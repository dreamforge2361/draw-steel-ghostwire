// B119 — street consumable chems: spawn a maneuver (B49/B51 pattern) and apply Active Effects
// + temp Stamina / Taint on a successful AbilityModel#use. Crash AEs land when the buff expires.
// Foundry-free helpers at the top so tools/kiosk-smoke.mjs can plan doses without a world.
//
// 0.3.125 (B) — the two medical kits join the same seam, and each needed one thing this file did
// not do yet:
//
//   * **Somebody else.** Every chem so far was a dose you take yourself, so `applyDose` wrote to
//     whoever held the item. A Field Surgery Kit is used *on a dying ally*, so the block now carries
//     a `target` ("self" | "selfOrAlly"), the generated ability is shaped to match, and the write
//     splits: Stamina, Recoveries, conditions and buff effects land on the **target**, while the
//     once-per-combat ledger, the Taint and the spent unit stay on the **user**.
//   * **Refusing before the card posts.** Stabilize only means anything on a dying target, so the
//     "not dying" no lands in the same place the once-per-combat no already does — in the `use`
//     patch, before Draw Steel prints a roll that did nothing. `planStabilize` is the pure half.
//
// The Field Surgery Kit's *other* half — the edge on First-Aid / Restorative tests — is not here at
// all. It is a plain `transfer: true` ActiveEffect on the pack row writing
// `system.skills.modifiers.<skill>.edges`, which is the same shape every Ghostwire chrome implant
// already uses, and Foundry grants and revokes it with the item for free. Automating a passive
// through this file would have been a worse version of something the data model does natively.

import { incrementTaint, previewTaintDelta } from "./taint.mjs";

export const MODULE_ID = "draw-steel-ghostwire";
const L = "GHOSTWIRE.ConsumableUse";

const gwFlags = doc => doc?.flags?.[MODULE_ID] ?? doc?.flags?.["draw-steel-ghostwire"] ?? {};

export function isConsumableTreasure(item) {
  if (item?.type !== "treasure") return false;
  const gear = gwFlags(item).gear ?? {};
  return !!gear.consumableUse;
}

const linkedAbilityId = item => item?.getFlag?.(MODULE_ID, "useAbilityId") ?? item?.flags?.[MODULE_ID]?.useAbilityId ?? null;
const sourceConsumableId = ability => ability?.getFlag?.(MODULE_ID, "fromConsumableId") ?? ability?.flags?.[MODULE_ID]?.fromConsumableId ?? null;

export function consumableUseOf(item) {
  return gwFlags(item).gear?.consumableUse ?? null;
}

/**
 * C2 (0.3.123) — how many spent Recoveries a dose gives back.
 *
 * A Recovery is not Stamina: restoring one hands the hero a resource they choose when to cash in, which is
 * why Michael's lock supersedes the Trauma Patch's older "heal Recovery value" master text. You can never
 * end up above your own maximum, and a hero who has spent none gains nothing.
 */
export function planRecoveryRestore({ value = 0, max = 0, restore = 0 } = {}) {
  const give = Math.max(0, Math.floor(Number(restore) || 0));
  if (!give) return null;
  const ceiling = Math.max(0, Math.floor(Number(max) || 0));
  const current = Math.max(0, Math.floor(Number(value) || 0));
  const next = Math.min(ceiling, current + give);
  return (next === current) ? null : next;
}

/**
 * C2 (0.3.123) — the once-per-combat gate.
 *
 * The lock is *per combat*, not per scene and not per day, so the key is the Combat's own id: a new fight
 * is a new allowance with no bookkeeping to reset, and `deleteCombat` clears the record so the flag never
 * accumulates. **Outside combat there is no gate at all** — "once per combat" says nothing about the walk
 * between fights, and a patch used in the corridor should not eat the next fight's use.
 */
export function planOncePerCombat({ oncePerCombat = false, combatId = null, usedIn = null } = {}) {
  if (!oncePerCombat || !combatId) return { allowed: true, record: null };
  if (usedIn === combatId) return { allowed: false, record: null };
  return { allowed: true, record: combatId };
}

/**
 * 0.3.125 (B1) — the stabilize gate.
 *
 * `04-combat.md` is the whole rule: a runner at **0 Stamina** is dying, and stabilizing stops the
 * dying strikes and sits them at **1 Stamina**. So this is a two-line function on purpose — the
 * only judgement in it is that anybody above 0 is not dying and the kit refuses rather than
 * quietly topping them up, which would turn a reusable trauma kit into an infinite heal.
 *
 * Negative Stamina counts as dying: Draw Steel lets Stamina run below zero, and a runner at -4 is
 * not less dying than one at exactly 0.
 *
 * @param {object} opts
 * @param {number} opts.staminaValue  The **target's** current Stamina.
 * @param {number} [opts.stabilizeTo] Where a stabilized runner sits. 1 per RAW.
 * @returns {{ok: boolean, reason: string|null, staminaValue: number}}
 */
export function planStabilize({ staminaValue = 0, stabilizeTo = 1 } = {}) {
  const value = Math.floor(Number(staminaValue) || 0);
  if (value > 0) return { ok: false, reason: "notDying", staminaValue: value };
  return { ok: true, reason: null, staminaValue: Math.max(1, Math.floor(Number(stabilizeTo) || 1)) };
}

/**
 * 0.3.125 (B2) — which of Draw Steel's ten conditions a Slap-Doc Kit can burn off.
 *
 * The canister is nanite med-foam, so it answers to things done to a **body**: blood loss, a rattled
 * head, being on the floor, being tangled, being slowed down, being weakened.
 *
 * Deliberately *not* here:
 *   * **frightened / taunted / surprised** — those are what a mind is doing, and foam does not argue.
 *   * **grabbed** — somebody has hold of you. That ends when they let go or you break it, not when
 *     a medic sprays you.
 *   * every `ghostwire-*` status (Wire state, Cover/Conceal, Invisible) — not conditions at all.
 */
export const PHYSICAL_CONDITIONS = Object.freeze(["bleeding", "dazed", "prone", "restrained", "slowed", "weakened"]);

/**
 * The physical conditions actually present on a target, in the order above.
 * @param {Iterable<string>|Set<string>} statuses  `actor.statuses`.
 * @returns {string[]} Possibly empty — an unhurt ally still gets the Recoveries.
 */
export function clearableConditions(statuses) {
  const present = new Set(statuses ?? []);
  return PHYSICAL_CONDITIONS.filter(id => present.has(id));
}

/** "self" unless the block says otherwise; anything unrecognised reads as self. */
export function useTargetKind(use) {
  return (use?.target === "selfOrAlly") ? "selfOrAlly" : "self";
}

/**
 * Preview a dose: spend one unit, grant temp Stamina / heal / spent Recoveries, optional Taint.
 * No Foundry I/O.
 */
export function planConsumableUse({ quantity = 1, staminaValue = 0, staminaMax = 0, staminaTemporary = 0,
  recoveriesValue = 0, recoveriesMax = 0, taint = 0, combatId = null, usedIn = null, use = {} } = {}) {
  const q = Math.max(0, Math.floor(Number(quantity) || 0));
  if (q <= 0) return { ok: false, reason: "spent", quantityAfter: 0, deleteItem: false };
  const gate = planOncePerCombat({ oncePerCombat: !!use.oncePerCombat, combatId, usedIn });
  if (!gate.allowed) return { ok: false, reason: "usedThisCombat", quantityAfter: q, deleteItem: false };
  // B1: stabilize is a gate as well as an effect. A Field Surgery Kit used on somebody who is not
  // dying does nothing, costs nothing, and says so — it must not read as a heal that rounded to 0.
  const stabilize = use.stabilize ? planStabilize({ staminaValue }) : null;
  if (stabilize && !stabilize.ok) return { ok: false, reason: stabilize.reason, quantityAfter: q, deleteItem: false };
  const spend = use.spend !== false;
  const heal = Math.max(0, Math.floor(Number(use.heal) || 0));
  const temp = Math.max(0, Math.floor(Number(use.tempStamina) || 0));
  const taintDelta = Math.trunc(Number(use.taint) || 0);
  const max = Math.max(0, Math.floor(Number(staminaMax) || 0));
  const value = Math.max(0, Math.floor(Number(staminaValue) || 0));
  // Stabilize sets Stamina outright (RAW: "sit at 1 Stamina"); `heal` adds to it. No kit does both,
  // and if one ever did, being stabilized first and then healed is the order that reads right.
  const base = stabilize ? stabilize.staminaValue : value;
  const healed = heal ? (max ? Math.min(max, base + heal) : base + heal) : base;
  const taintPlan = previewTaintDelta(taint, taintDelta);
  const quantityAfter = spend ? q - 1 : q;
  const recoveries = planRecoveryRestore({ value: recoveriesValue, max: recoveriesMax, restore: use.recoveries });
  return {
    ok: true,
    reason: null,
    quantityAfter,
    // B2: a spent canister is rubbish, not inventory. Only kits that ask for it are deleted, so the
    // chems and the Trauma Patch keep the empty row a player can re-stock against.
    deleteItem: spend && (quantityAfter <= 0) && !!use.deleteAtZero,
    stabilized: !!stabilize,
    clearCondition: !!use.clearCondition,
    staminaValue: healed,
    staminaTemporary: Math.max(0, Math.floor(Number(staminaTemporary) || 0)) + temp,
    tempGranted: temp,
    healed: healed - value,
    recoveriesValue: recoveries,
    recoveriesGranted: (recoveries === null) ? 0 : recoveries - Math.max(0, Math.floor(Number(recoveriesValue) || 0)),
    combatRecord: gate.record,
    taint: taintPlan,
    applyBuff: true,
    applyCrashOnBuffEnd: !!use.crash,
  };
}

export function effectPhase(effect) {
  return gwFlags(effect).consumablePhase ?? null;
}

export function buffEffectsOf(item) {
  return (item?.effects ?? []).filter(effect => effectPhase(effect) === "buff");
}

export function crashEffectsOf(item) {
  return (item?.effects ?? []).filter(effect => effectPhase(effect) === "crash");
}

/** Strip pack ids so a copy can land on an Actor. */
export function actorEffectData(source, { disabled = false } = {}) {
  if (!source || typeof source !== "object") return null;
  const raw = typeof source.toObject === "function" ? source.toObject() : source;
  const data = JSON.parse(JSON.stringify(raw));
  delete data._id;
  delete data._key;
  data.disabled = disabled;
  data.transfer = false;
  return data;
}

function loc(key, data) {
  return data ? game.i18n.format(`${L}.${key}`, data) : game.i18n.localize(`${L}.${key}`);
}

function isHero(actor) {
  return actor?.type === "hero";
}

/**
 * The card's effect text, assembled from what the block actually does.
 *
 * Data-driven rather than one authored string per SKU: a kit that stabilizes says so, a kit that
 * hands back Recoveries says so, a kit that burns off a condition says so, and a plain dose falls
 * back to the generic line the chems have always used. Adding a fourth medical SKU needs no new
 * lang key unless it does something none of these three do.
 */
function consumableEffectText(gearItem, use) {
  const lines = [];
  if (use.stabilize) lines.push(loc("Effects.Stabilize"));
  const recoveries = Math.max(0, Math.floor(Number(use.recoveries) || 0));
  if (recoveries) lines.push(loc("Effects.Recoveries", { count: recoveries }));
  if (use.clearCondition) lines.push(loc("Effects.ClearCondition"));
  if (!lines.length) lines.push(loc("AbilityEffect", { item: gearItem.name }));
  if (useTargetKind(use) === "selfOrAlly") lines.push(loc("Effects.TargetHint"));
  if (use.spend === false) lines.push(loc("Effects.Reusable"));
  return lines.join("");
}

export function buildConsumableAbility(gearItem) {
  const use = consumableUseOf(gearItem);
  if (!use) return null;
  const action = use.action === "main" ? "main" : "maneuver";
  // A kit you use on somebody else is a melee-reach ability targeting one creature; a dose you take
  // yourself stays self/self, exactly as the chems have been since B119.
  const reachesOut = useTargetKind(use) === "selfOrAlly";
  return {
    name: loc("AbilityName", { item: gearItem.name }),
    type: "ability",
    img: gearItem.img,
    system: {
      description: {
        value: loc(reachesOut ? "AbilityDescriptionAlly" : "AbilityDescription", { item: gearItem.name }),
        director: "",
      },
      source: { book: "Ghostwire", page: "08-kits-gear-wealth", license: "Draw Steel Creator License" },
      _dsid: `consumable-use-${gearItem.system?._dsid ?? gearItem.id}`,
      keywords: [],
      type: action,
      category: "",
      resource: null,
      trigger: "",
      distance: reachesOut
        ? { type: "melee", primary: "1", secondary: "1", tertiary: "1" }
        : { type: "self", primary: "1", secondary: "1", tertiary: "1" },
      target: reachesOut
        ? { type: "selfOrAlly", value: 1, custom: "" }
        : { type: "self", value: null, custom: "" },
      power: {
        roll: { formula: "@chr", characteristics: [], reactive: false },
        effects: {},
      },
      effects: {
        before0000000000: {
          _id: "before0000000000",
          type: "base",
          description: consumableEffectText(gearItem, use),
          before: true,
          name: "",
          img: null,
          sort: 0,
        },
      },
    },
    flags: { [MODULE_ID]: { fromConsumableId: gearItem.id } },
  };
}

async function armConsumable(gearItem) {
  const actor = gearItem.parent;
  if (!isHero(actor) || !isConsumableTreasure(gearItem)) return null;
  const existingId = linkedAbilityId(gearItem);
  if (existingId && actor.items.get(existingId)) return null;
  if (actor.items.some(i => sourceConsumableId(i) === gearItem.id)) return null;
  const data = buildConsumableAbility(gearItem);
  if (!data) return null;
  const [ability] = await actor.createEmbeddedDocuments("Item", [data]);
  if (ability) await gearItem.setFlag(MODULE_ID, "useAbilityId", ability.id);
  return ability;
}

async function disarmConsumable(gearItem) {
  const actor = gearItem.parent;
  if (!isHero(actor)) return;
  const ids = actor.items.filter(i => sourceConsumableId(i) === gearItem.id).map(i => i.id);
  if (ids.length) await actor.deleteEmbeddedDocuments("Item", ids);
}

export async function syncActor(actor) {
  if (!isHero(actor) || !actor.isOwner) return { added: 0, removed: 0 };
  const orphans = actor.items.filter(i => {
    const gearId = sourceConsumableId(i);
    return gearId && !actor.items.get(gearId);
  }).map(i => i.id);
  if (orphans.length) await actor.deleteEmbeddedDocuments("Item", orphans);
  let added = 0;
  for (const gearItem of actor.items.filter(isConsumableTreasure)) {
    if (await armConsumable(gearItem)) added += 1;
  }
  return { added, removed: orphans.length };
}

function staminaOf(actor) {
  const block = actor?.system?.stamina ?? {};
  return {
    value: Number(block.value) || 0,
    max: Number(block.max) || 0,
    temporary: Number(block.temporary) || 0,
  };
}

/** Flag path for the once-per-combat ledger on the hero: `{ [dsid]: combatId }`. */
export const COMBAT_USE_FLAG = "consumableCombatUse";

/** The Combat this dose is being taken in, or null out of combat. */
const currentCombatId = () => game.combat?.id ?? null;

/** Which Combat this actor last used `dsid` in, per the once-per-combat ledger. */
const combatUseRecord = (actor, dsid) =>
  actor?.getFlag?.(MODULE_ID, COMBAT_USE_FLAG)?.[dsid] ?? null;

function recoveriesOf(actor) {
  const block = actor?.system?.recoveries ?? {};
  return { value: Number(block.value) || 0, max: Number(block.max) || 0 };
}

/**
 * Who this dose lands on.
 *
 * `target: "self"` (every chem) is always the holder. `target: "selfOrAlly"` takes the user's single
 * Foundry target if there is one, and falls back to the holder — a Medic with no token targeted and
 * a Field Surgery Kit in hand is far more likely to mean "on me" than to want a silent no-op. Two
 * or more targets is an ambiguity worth surfacing rather than guessing at, so it is refused.
 *
 * @returns {{actor: Actor|null, reason: string|null}}
 */
function resolveDoseTarget(actor, use) {
  if (useTargetKind(use) !== "selfOrAlly") return { actor, reason: null };
  const targets = [...(game.user?.targets ?? [])].map(t => t.actor).filter(Boolean);
  if (targets.length > 1) return { actor: null, reason: "tooManyTargets" };
  return { actor: targets[0] ?? actor, reason: null };
}

/** Localized name for one of Draw Steel's conditions, falling back to the raw id. */
const conditionLabel = id => game.i18n.localize(CONFIG.statusEffects?.[id]?.name ?? id);

/**
 * B2 — pick one physical condition to burn off.
 *
 * Only ever called when the target actually has at least one, so there is no "none of them" row to
 * dismiss; cancelling the dialog simply clears nothing, which is a legitimate choice (the foam still
 * went in, and the Recoveries still landed).
 */
async function promptClearCondition(target) {
  const options = clearableConditions(target?.statuses);
  if (!options.length) return null;
  const rows = options
    .map(id => `<option value="${id}">${foundry.utils.escapeHTML(conditionLabel(id))}</option>`)
    .join("");
  const data = await foundry.applications.api.DialogV2.input({
    window: { title: loc("ClearCondition.Title"), icon: "fa-solid fa-syringe" },
    content: `<p>${loc("ClearCondition.Hint", { actor: target.name })}</p>`
      + `<div class="form-group"><label>${loc("ClearCondition.Label")}</label>`
      + `<select name="condition">${rows}</select></div>`,
    ok: { label: `${L}.ClearCondition.Confirm`, icon: "fa-solid fa-check" },
  });
  const chosen = data?.condition;
  if (!chosen || !options.includes(chosen)) return null;
  await target.toggleStatusEffect(chosen, { active: false });
  return chosen;
}

async function applyDose(actor, gearItem) {
  const use = consumableUseOf(gearItem);
  const resolved = resolveDoseTarget(actor, use);
  if (!resolved.actor) {
    ui.notifications.warn(loc("TooManyTargets", { item: gearItem.name }));
    return { ok: false, reason: resolved.reason };
  }
  const target = resolved.actor;
  const stamina = staminaOf(target);
  const recoveries = recoveriesOf(target);
  const dsid = gearItem.system?._dsid ?? gearItem.id;
  const plan = planConsumableUse({
    quantity: Number(gearItem.system?.quantity ?? 1),
    staminaValue: stamina.value,
    staminaMax: stamina.max,
    staminaTemporary: stamina.temporary,
    recoveriesValue: recoveries.value,
    recoveriesMax: recoveries.max,
    // Taint is the *user's* — they are the one with the chem in their bloodstream, whoever the
    // needle went into. Every taint-carrying SKU is self-targeted anyway, so the two are the same
    // actor in practice; this only matters if one ever is not.
    taint: actor.getFlag?.(MODULE_ID, "taint") ?? actor.flags?.[MODULE_ID]?.taint ?? 0,
    combatId: currentCombatId(),
    usedIn: combatUseRecord(actor, dsid),
    use,
  });
  if (!plan.ok) {
    if (plan.reason === "usedThisCombat") ui.notifications.warn(loc("UsedThisCombat", { item: gearItem.name }));
    if (plan.reason === "notDying") ui.notifications.warn(loc("NotDying", { item: gearItem.name, actor: target.name }));
    return plan;
  }

  const updates = {};
  if (plan.healed) updates["system.stamina.value"] = plan.staminaValue;
  if (plan.tempGranted) updates["system.stamina.temporary"] = plan.staminaTemporary;
  if (plan.recoveriesValue !== null) updates["system.recoveries.value"] = plan.recoveriesValue;
  if (!foundry.utils.isEmpty(updates)) await target.update(updates);
  if (plan.combatRecord) await actor.setFlag(MODULE_ID, `${COMBAT_USE_FLAG}.${dsid}`, plan.combatRecord);
  if (plan.taint.delta) await incrementTaint(actor, plan.taint.delta);

  const cleared = plan.clearCondition ? await promptClearCondition(target) : null;

  const buffs = [];
  for (const effect of gearItem.effects ?? []) {
    if (effectPhase(effect) !== "buff") continue;
    const data = actorEffectData(effect, { disabled: false });
    if (!data) continue;
    data.flags = foundry.utils.mergeObject(data.flags ?? {}, {
      [MODULE_ID]: {
        consumablePhase: "buff",
        consumableDsid: gearItem.system?._dsid ?? gearItem.id,
        consumableCrash: !!use?.crash,
      },
    });
    buffs.push(data);
  }
  if (buffs.length) await target.createEmbeddedDocuments("ActiveEffect", buffs);

  const onSelf = target === actor;
  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content: loc(onSelf ? "Chat.Used" : "Chat.UsedOn", {
      actor: actor.name,
      target: target.name,
      item: gearItem.name,
    })
      + (plan.stabilized ? loc("Chat.Stabilized", { actor: target.name }) : "")
      + (plan.recoveriesGranted
        ? loc("Chat.Recoveries", { count: plan.recoveriesGranted, value: plan.recoveriesValue })
        : "")
      + (cleared ? loc("Chat.Cleared", { condition: conditionLabel(cleared) }) : ""),
  });
  ui.notifications.info(loc(onSelf ? "Used" : "UsedOn", { actor: actor.name, target: target.name, item: gearItem.name }));

  if (plan.deleteItem) await gearItem.delete();
  else if (plan.quantityAfter !== Number(gearItem.system?.quantity ?? 1)) {
    await gearItem.update({ "system.quantity": plan.quantityAfter });
  }
  return plan;
}

async function applyCrash(actor, dsid) {
  if (!actor || !dsid) return;
  for (const item of actor.items) {
    if (!isConsumableTreasure(item)) continue;
    if ((item.system?._dsid ?? item.id) !== dsid) continue;
    const crashes = [];
    for (const effect of item.effects ?? []) {
      if (effectPhase(effect) !== "crash") continue;
      const data = actorEffectData(effect, { disabled: false });
      if (!data) continue;
      data.flags = foundry.utils.mergeObject(data.flags ?? {}, {
        [MODULE_ID]: { consumablePhase: "crash", consumableDsid: dsid },
      });
      crashes.push(data);
    }
    if (crashes.length) {
      await actor.createEmbeddedDocuments("ActiveEffect", crashes);
      ui.notifications.warn(loc("Crash", { actor: actor.name, item: item.name }));
    }
    return;
  }
}

function patchConsumableUse() {
  const AbilityModel = CONFIG.Item.dataModels?.ability ?? ds.data?.Item?.AbilityModel;
  if (!AbilityModel?.prototype.use) {
    console.warn(`${MODULE_ID} | AbilityModel#use not found; consumable doses will not apply`);
    return;
  }
  const use = AbilityModel.prototype.use;
  AbilityModel.prototype.use = async function(config = {}, dialogOptions = {}, messageOptions = {}) {
    const gearId = sourceConsumableId(this.parent);
    const gear = gearId ? this.actor?.items.get(gearId) : null;
    if (!gear) return use.call(this, config, dialogOptions, messageOptions);
    const quantity = Number(gear.system.quantity ?? 0);
    if (quantity <= 0) {
      ui.notifications.warn(loc("Spent", { item: gear.name }));
      return null;
    }
    // C2: refuse *before* the card posts, so a second Trauma Patch in the same fight never leaves a
    // roll on the log that did nothing. applyDose re-checks; this is only about where the "no" lands.
    const block = consumableUseOf(gear) ?? {};
    const dsid = gear.system?._dsid ?? gear.id;
    if (!planOncePerCombat({
      oncePerCombat: !!block.oncePerCombat,
      combatId: currentCombatId(),
      usedIn: combatUseRecord(this.actor, dsid),
    }).allowed) {
      ui.notifications.warn(loc("UsedThisCombat", { item: gear.name }));
      return null;
    }
    // 0.3.125 (B1): the same rule for "they are not dying". Both refusals land here so the log never
    // carries a Field Surgery Kit card that was always going to do nothing.
    const { actor: resolved, reason } = resolveDoseTarget(this.actor, block);
    if (!resolved) {
      ui.notifications.warn(loc("TooManyTargets", { item: gear.name }));
      return null;
    }
    if (block.stabilize && !planStabilize({ staminaValue: staminaOf(resolved).value }).ok) {
      ui.notifications.warn(loc("NotDying", { item: gear.name, actor: resolved.name }));
      return null;
    }
    const message = await use.call(this, config, dialogOptions, messageOptions);
    if (!message) return message;
    await applyDose(this.actor, gear);
    return message;
  };
}

export function registerConsumableUse() {
  patchConsumableUse();

  Hooks.once("ready", async () => {
    let added = 0;
    let removed = 0;
    for (const actor of game.actors) {
      if (!actor.isOwner) continue;
      const result = await syncActor(actor);
      added += result.added;
      removed += result.removed;
    }
    if (added || removed) console.log(`${MODULE_ID} | consumable use-abilities: +${added} / -${removed}`);
  });

  Hooks.on("createItem", (item, options, userId) => {
    if (userId !== game.user.id) return;
    if (isConsumableTreasure(item)) armConsumable(item);
  });

  Hooks.on("deleteItem", (item, options, userId) => {
    if (userId !== game.user.id) return;
    if (item?.type === "treasure") disarmConsumable(item);
  });

  Hooks.on("createActor", (actor, options, userId) => {
    if (userId !== game.user.id) return;
    syncActor(actor);
  });

  // C2: the fight is over, so the once-per-combat allowance is too. Keying the ledger by Combat id
  // already makes a stale entry harmless; clearing it keeps the flag from growing forever.
  Hooks.on("deleteCombat", async (combat, options, userId) => {
    if (userId !== game.user.id) return;
    for (const actor of game.actors) {
      if (!actor.isOwner) continue;
      const ledger = actor.getFlag(MODULE_ID, COMBAT_USE_FLAG);
      if (!ledger || !Object.values(ledger).includes(combat.id)) continue;
      const kept = Object.fromEntries(Object.entries(ledger).filter(([, id]) => id !== combat.id));
      await actor.update({ [`flags.${MODULE_ID}.${COMBAT_USE_FLAG}`]: null });
      if (!foundry.utils.isEmpty(kept)) await actor.setFlag(MODULE_ID, COMBAT_USE_FLAG, kept);
    }
  });

  Hooks.on("deleteActiveEffect", (effect, options, userId) => {
    if (userId !== game.user.id) return;
    const actor = effect.parent;
    if (!(actor instanceof Actor)) return;
    const flags = effect.getFlag?.(MODULE_ID) ?? {};
    if (flags.consumablePhase !== "buff" || !flags.consumableCrash) return;
    applyCrash(actor, flags.consumableDsid);
  });

  const module = game.modules.get(MODULE_ID);
  if (module) {
    module.api = {
      ...(module.api ?? {}),
      syncConsumableAbilities: syncActor,
      planConsumableUse,
      planRecoveryRestore,
      planOncePerCombat,
      planStabilize,
      clearableConditions,
      PHYSICAL_CONDITIONS,
      isConsumableTreasure,
    };
  }
}
