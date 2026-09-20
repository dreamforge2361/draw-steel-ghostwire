// B119 — street consumable chems: spawn a maneuver (B49/B51 pattern) and apply Active Effects
// + temp Stamina / Taint on a successful AbilityModel#use. Crash AEs land when the buff expires.
// Foundry-free helpers at the top so tools/kiosk-smoke.mjs can plan doses without a world.

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
 * Preview a dose: spend one unit, grant temp Stamina / heal, optional Taint.
 * No Foundry I/O.
 */
export function planConsumableUse({ quantity = 1, staminaValue = 0, staminaMax = 0, staminaTemporary = 0, taint = 0, use = {} } = {}) {
  const q = Math.max(0, Math.floor(Number(quantity) || 0));
  if (q <= 0) return { ok: false, reason: "spent", quantityAfter: 0, deleteItem: false };
  const spend = use.spend !== false;
  const heal = Math.max(0, Math.floor(Number(use.heal) || 0));
  const temp = Math.max(0, Math.floor(Number(use.tempStamina) || 0));
  const taintDelta = Math.trunc(Number(use.taint) || 0);
  const max = Math.max(0, Math.floor(Number(staminaMax) || 0));
  const value = Math.max(0, Math.floor(Number(staminaValue) || 0));
  const healed = heal ? (max ? Math.min(max, value + heal) : value + heal) : value;
  const taintPlan = previewTaintDelta(taint, taintDelta);
  const quantityAfter = spend ? q - 1 : q;
  return {
    ok: true,
    reason: null,
    quantityAfter,
    deleteItem: spend && quantityAfter <= 0,
    staminaValue: healed,
    staminaTemporary: Math.max(0, Math.floor(Number(staminaTemporary) || 0)) + temp,
    tempGranted: temp,
    healed: healed - value,
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

export function buildConsumableAbility(gearItem) {
  const use = consumableUseOf(gearItem);
  if (!use) return null;
  const action = use.action === "main" ? "main" : "maneuver";
  return {
    name: loc("AbilityName", { item: gearItem.name }),
    type: "ability",
    img: gearItem.img,
    system: {
      description: {
        value: loc("AbilityDescription", { item: gearItem.name }),
        director: "",
      },
      source: { book: "Ghostwire", page: "08-kits-gear-wealth", license: "Draw Steel Creator License" },
      _dsid: `consumable-use-${gearItem.system?._dsid ?? gearItem.id}`,
      keywords: [],
      type: action,
      category: "",
      resource: null,
      trigger: "",
      distance: { type: "self", primary: "1", secondary: "1", tertiary: "1" },
      target: { type: "self", value: null, custom: "" },
      power: {
        roll: { formula: "@chr", characteristics: [], reactive: false },
        effects: {},
      },
      effects: {
        before0000000000: {
          _id: "before0000000000",
          type: "base",
          description: loc("AbilityEffect", { item: gearItem.name }),
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

async function applyDose(actor, gearItem) {
  const use = consumableUseOf(gearItem);
  const stamina = staminaOf(actor);
  const plan = planConsumableUse({
    quantity: Number(gearItem.system?.quantity ?? 1),
    staminaValue: stamina.value,
    staminaMax: stamina.max,
    staminaTemporary: stamina.temporary,
    taint: actor.getFlag?.(MODULE_ID, "taint") ?? actor.flags?.[MODULE_ID]?.taint ?? 0,
    use,
  });
  if (!plan.ok) return plan;

  const updates = {};
  if (plan.healed) updates["system.stamina.value"] = plan.staminaValue;
  if (plan.tempGranted) updates["system.stamina.temporary"] = plan.staminaTemporary;
  if (!foundry.utils.isEmpty(updates)) await actor.update(updates);
  if (plan.taint.delta) await incrementTaint(actor, plan.taint.delta);

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
  if (buffs.length) await actor.createEmbeddedDocuments("ActiveEffect", buffs);

  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content: loc("Chat.Used", {
      actor: actor.name,
      item: gearItem.name,
    }),
  });
  ui.notifications.info(loc("Used", { actor: actor.name, item: gearItem.name }));

  if (plan.quantityAfter !== Number(gearItem.system?.quantity ?? 1)) {
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
      isConsumableTreasure,
    };
  }
}
