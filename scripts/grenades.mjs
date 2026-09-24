// 0.3.126 (C) — Throw: one shared ability, a 20-foot circle, and a Reflex save per token under it.
//
// Michael lock 2026-09-24, confirmed. A Blast grenade is not a single-target free strike, which is
// all B49 could make of it (scripts/equipment-use.mjs spawns a free-strike-shaped ability from any
// weapon treasure with a damage line). It is a **template**: you put a 20-foot circle down, and
// everybody standing in it rolls Reflex.
//
// The resolution table, exactly as locked — and the third row is the one that looks like a typo and
// is not:
//
//   | Save                       | Impact                                                       |
//   |----------------------------|--------------------------------------------------------------|
//   | Fail                       | the thrower's power-roll tier, in full                        |
//   | Normal success             | nothing                                                       |
//   | **Critical** success       | **middle (tier 2)** impact — a crit is not a clean shrug      |
//   | Fail *and* thrower HIGH    | the HIGH rider (EMP: 2 rounds of chrome suppression)          |
//
// Four decisions worth writing down:
//
//  1. **The thrower's tier comes off the thrower's own card.** Throw runs Draw Steel's normal
//     `AbilityModel#use`, so the power roll, the edges and banes, and F11's critical handling all
//     work untouched; `messageCritical()` from scripts/crit-feedback.mjs then reads the tier back
//     off the message. Rolling a second, private power roll behind the card would have desynced
//     from every modifier the system already applied.
//  2. **The save is a Power Roll, not Draw Steel's `rollSave`.** `rollSave` is the d10 save-ends
//     mechanic bolted to an ActiveEffect; it has no tiers and no critical, and the lock asks for
//     both. So a Reflex save here is `2d10 + agility` read on Draw Steel's own tier ladder, which is
//     what Ghostwire's Reflex label has always meant (chargen-wizard.mjs maps Reflex -> agility).
//  3. **Adjacent demolition stays adjacent.** Thermite and Shaped Charge carry the Blast tag but
//     are placed against a wall, not lobbed, so they keep their B49 strike and are absent from the
//     `thrown` stamp. Only a grenade that is *thrown* converts.
//  4. **Smoke has no save.** A screening canister does not hurt anybody — it puts the circle down
//     and everything inside it is Concealed (F13's one token toggle). Rolling Reflex against smoke
//     would have been a rule nobody asked for.
//
// Everything above the "Foundry registration" divider is Foundry-free so
// tools/wave-03126-smoke.mjs can run it under Node.

import { messageCritical } from "./crit-feedback.mjs";
import { strikeChrome, isChromeItem } from "./chrome-damage.mjs";
import { COVER_CONCEAL_ID } from "./cover-conceal.mjs";
import { sceneLightRadius } from "./token-light.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const L = "GHOSTWIRE.Throw";

/** The one shared ability, and the flag that marks it. */
export const THROW_DSID = "gw-throw";
export const THROW_FLAG = "throwAbility";

/** The gear flag a thrown Blast grenade carries: `{ feet, save, impact }`. */
export const THROWN_FLAG = "thrown";

/** Michael lock: every Blast grenade lands as a 20-foot circle. */
export const BLAST_FEET = 20;

/** Ghostwire's Reflex is Draw Steel's agility (scripts/chargen-wizard.mjs CHARACTERISTIC_LABELS). */
export const REFLEX_CHARACTERISTIC = "agility";

/** Draw Steel's critical threshold on the natural 2d10. A save at 19+ is a critical success. */
export const SAVE_CRIT_THRESHOLD = 19;

/** The tier a critical success still eats, per the lock. */
export const CRIT_SUCCESS_TIER = 2;

/** Ranged free-strike spread (scripts/data/weapon-use-templates.json): printed damage is the middle. */
export const BLAST_SPREAD = Object.freeze({ low: -2, high: 2 });

const gwFlags = doc => doc?.flags?.[MODULE_ID] ?? doc?.flags?.["draw-steel-ghostwire"] ?? {};

/* -------------------------------------------- reading */

/**
 * The `thrown` block on a grenade SKU, normalized.
 * @returns {{feet: number, save: boolean, impact: object}|null} null for anything not thrown.
 */
export function thrownSpec(item) {
  const raw = gwFlags(item).gear?.[THROWN_FLAG];
  if (!raw) return null;
  return {
    feet: Math.max(1, Math.floor(Number(raw.feet) || BLAST_FEET)),
    save: raw.save !== false,
    impact: raw.impact ?? {},
  };
}

/** Is this a thrown Blast grenade — the line that converts to Throw + template + save? */
export function isThrownBlast(item) {
  if (item?.type !== "treasure" || item?.system?.kind !== "weapon") return false;
  return !!thrownSpec(item);
}

/* -------------------------------------------- planning */

/**
 * Read one Reflex save.
 *
 * A critical is the *natural* 2d10, not the total, for the same reason F11 reads it that way: edges,
 * banes and a high Reflex move the total but never make or unmake a critical.
 *
 * @param {object} opts
 * @param {number} opts.natural  The natural 2d10.
 * @param {number} opts.tier     Draw Steel's tier for the modified total (1 / 2 / 3).
 * @returns {"critical"|"success"|"fail"}
 */
export function saveOutcome({ natural = 0, tier = 1 } = {}) {
  if ((Number(natural) || 0) >= SAVE_CRIT_THRESHOLD) return "critical";
  return (Math.floor(Number(tier) || 1) <= 1) ? "fail" : "success";
}

/**
 * What one token in the circle actually eats.
 *
 * `high` is the HIGH rider gate: the thrower read tier 3 (which a natural 19-20 always is) **and**
 * the save failed. A critical success never earns the rider — it is capped at the middle impact.
 *
 * @returns {{impactTier: number, high: boolean, applies: boolean}} `impactTier` is 0 for nothing.
 */
export function planBlastImpact({ outcome = "fail", throwerTier = 1 } = {}) {
  const tier = Math.min(3, Math.max(1, Math.floor(Number(throwerTier) || 1)));
  if (outcome === "success") return { impactTier: 0, high: false, applies: false };
  if (outcome === "critical") return { impactTier: CRIT_SUCCESS_TIER, high: false, applies: true };
  return { impactTier: tier, high: tier >= 3, applies: true };
}

/**
 * Tier damage for a grenade whose printed number is the middle result — the same derivation B49
 * uses for every other ranged weapon, so a Frag thrown at tier 2 still deals its printed 6.
 * @returns {[number, number, number]} tier 1 / 2 / 3, never below 1.
 */
export function blastDamageTiers(middle) {
  const mid = Math.max(1, Math.floor(Number(middle) || 0));
  return [
    Math.max(1, mid + BLAST_SPREAD.low),
    mid,
    Math.max(1, mid + BLAST_SPREAD.high),
  ];
}

/**
 * The concrete impact one token takes: damage, conditions, chrome suppression.
 *
 * @param {object} impact       The SKU's `gear.thrown.impact` block.
 * @param {number} impactTier   1 / 2 / 3, or 0 for nothing.
 * @param {boolean} high        Whether the HIGH rider fired.
 * @returns {{damage: number, damageType: string|null, conditions: string[], chromeSuppress: number}}
 */
export function impactFor(impact = {}, impactTier = 0, high = false) {
  const none = { damage: 0, damageType: null, conditions: [], chromeSuppress: 0 };
  const tier = Math.min(3, Math.max(0, Math.floor(Number(impactTier) || 0)));
  if (!tier) return none;
  const damage = Number(impact.damage) || 0;
  const suppress = Math.max(0, Math.floor(Number(impact.chromeSuppress) || 0));
  const highSuppress = Math.max(suppress, Math.floor(Number(impact.highChromeSuppress) || 0));
  return {
    damage: damage ? blastDamageTiers(damage)[tier - 1] : 0,
    damageType: damage ? (impact.damageType ?? null) : null,
    conditions: Array.isArray(impact.conditions) ? [...impact.conditions] : [],
    chromeSuppress: high ? highSuppress : suppress,
  };
}

/* ============================================ Foundry registration */

const loc = (key, data) => (data ? game.i18n.format(`${L}.${key}`, data) : game.i18n.localize(`${L}.${key}`));
const isHero = actor => actor?.type === "hero";
const esc = text => foundry.utils.escapeHTML(String(text ?? ""));
const conditionLabel = id => game.i18n.localize(CONFIG.statusEffects?.[id]?.name ?? id);

/** The thrown Blast grenades on this sheet with something left in the pouch. */
export const grenadesOf = actor =>
  (actor?.items?.filter?.(item => isThrownBlast(item) && (Number(item.system?.quantity ?? 0) > 0)) ?? []);

/* -------------------------------------------- the Throw ability */

export function buildThrowAbility() {
  return {
    name: loc("Name"),
    type: "ability",
    img: "modules/draw-steel-ghostwire/assets/tokens/weapons/frag.webp",
    system: {
      description: { value: loc("Description", { feet: BLAST_FEET }), director: "" },
      source: { book: "Ghostwire", page: "08-kits-gear-wealth", license: "Draw Steel Creator License" },
      _dsid: THROW_DSID,
      keywords: ["ranged", "weapon"],
      type: "main",
      category: "",
      resource: null,
      trigger: "",
      distance: { type: "ranged", primary: "10", secondary: "1", tertiary: "1" },
      target: { type: "special", value: null, custom: "" },
      power: {
        roll: { formula: "@chr", characteristics: ["might", "agility"], reactive: false },
        effects: {
          throwTiers000000: {
            _id: "throwTiers000000", name: "", img: null, type: "other", sort: 0,
            other: {
              tier1: { display: loc("Tiers.Tier1"), potency: { value: "", characteristic: "none" } },
              tier2: { display: loc("Tiers.Tier2"), potency: { value: "", characteristic: "" } },
              tier3: { display: loc("Tiers.Tier3"), potency: { value: "", characteristic: "" } },
            },
          },
        },
      },
      effects: {
        throwBefore00000: {
          _id: "throwBefore00000", type: "base", description: loc("Effect", { feet: BLAST_FEET }),
          before: true, name: "", img: null, sort: 0,
        },
      },
    },
    flags: { [MODULE_ID]: { [THROW_FLAG]: true } },
  };
}

const throwAbilityOf = actor => (actor?.items ?? []).find(item => item.getFlag?.(MODULE_ID, THROW_FLAG));

/**
 * One shared Throw per sheet, present exactly while a thrown Blast grenade is.
 * @returns {Promise<{added: number, removed: number}>}
 */
export async function syncActor(actor) {
  if (!isHero(actor) || !actor.isOwner) return { added: 0, removed: 0 };
  const existing = throwAbilityOf(actor);
  const wanted = (actor.items?.filter?.(isThrownBlast) ?? []).length > 0;
  if (wanted && !existing) {
    await actor.createEmbeddedDocuments("Item", [buildThrowAbility()]);
    return { added: 1, removed: 0 };
  }
  if (!wanted && existing) {
    await actor.deleteEmbeddedDocuments("Item", [existing.id]);
    return { added: 0, removed: 1 };
  }
  return { added: 0, removed: 0 };
}

/** Which grenade. One in the pouch answers itself. */
async function promptGrenade(actor) {
  const grenades = grenadesOf(actor);
  if (!grenades.length) {
    ui.notifications.warn(loc("NoGrenade", { actor: actor.name }));
    return null;
  }
  if (grenades.length === 1) return grenades[0];
  const rows = grenades
    .map(item => `<option value="${item.id}">${esc(loc("GrenadeOption", { item: item.name, count: Number(item.system?.quantity ?? 0) }))}</option>`)
    .join("");
  const data = await foundry.applications.api.DialogV2.input({
    window: { title: loc("Pick.Title"), icon: "fa-solid fa-bomb" },
    content: `<p>${loc("Pick.Hint")}</p>`
      + `<div class="form-group"><label>${loc("Pick.Label")}</label><select name="grenade">${rows}</select></div>`,
    ok: { label: `${L}.Pick.Confirm`, icon: "fa-solid fa-bomb" },
  });
  return data?.grenade ? actor.items.get(data.grenade) : null;
}

/**
 * Where the grenade lands, in canvas pixels.
 *
 * A targeted token is the aim point — that is one click the player has already made, and it is what
 * everybody at the table means by "throw it at him". With nothing targeted, the next click on the
 * canvas is the aim point instead; right-click cancels the throw outright.
 */
function pickBlastOrigin() {
  const target = [...(game.user?.targets ?? [])][0];
  if (target) return Promise.resolve({ x: target.center.x, y: target.center.y });
  ui.notifications.info(loc("ClickToPlace"));
  return new Promise(resolve => {
    const stage = canvas?.stage;
    if (!stage) return resolve(null);
    const done = point => {
      stage.off("pointerdown", onDown);
      stage.off("rightdown", onCancel);
      resolve(point);
    };
    const onDown = event => {
      const local = event.getLocalPosition?.(stage) ?? event.data?.getLocalPosition?.(stage) ?? null;
      done(local ? { x: local.x, y: local.y } : null);
    };
    const onCancel = () => done(null);
    stage.on("pointerdown", onDown);
    stage.on("rightdown", onCancel);
  });
}

/** Put the circle on the canvas and hand back the MeasuredTemplate document. */
async function placeBlastTemplate(actor, origin, feet) {
  const scene = canvas?.scene;
  if (!scene) return null;
  const [doc] = await scene.createEmbeddedDocuments("MeasuredTemplate", [{
    t: "circle",
    user: game.user.id,
    x: origin.x,
    y: origin.y,
    distance: sceneLightRadius(feet, scene),
    direction: 0,
    fillColor: game.user.color?.css ?? game.user.color ?? "#ff6633",
    flags: { [MODULE_ID]: { blast: true, feet, thrownBy: actor.id } },
  }]);
  return doc ?? null;
}

/** The tokens standing inside a circular template, by centre point. */
export function tokensUnderTemplate(doc) {
  if (!doc || !canvas?.tokens) return [];
  const radius = (Number(doc.distance) || 0) * (canvas.dimensions.size / (canvas.dimensions.distance || 1));
  return canvas.tokens.placeables.filter(token => {
    const dx = token.center.x - doc.x;
    const dy = token.center.y - doc.y;
    return Math.hypot(dx, dy) <= radius;
  });
}

/** Roll one token's Reflex save and read it on Draw Steel's own tier ladder. */
async function rollReflexSave(actor) {
  const score = Number(foundry.utils.getProperty(actor ?? {}, `system.characteristics.${REFLEX_CHARACTERISTIC}.value`)) || 0;
  const roll = new ds.rolls.PowerRoll("2d10 + @reflex", { reflex: score }, {
    type: "test",
    flavor: loc("SaveFlavor", { actor: actor?.name ?? "" }),
  });
  await roll.evaluate();
  const natural = roll.dice?.[0]?.total ?? 0;
  const tier = Number(roll.product) || 1;
  return { roll, natural, tier, total: roll.total, outcome: saveOutcome({ natural, tier }) };
}

/** Suppress every implant on a target for `rounds` rounds (EMP). */
async function suppressChrome(target, rounds, source) {
  const implants = (target?.items ?? []).filter(isChromeItem);
  if (!implants.length) return 0;
  let hit = 0;
  for (const implant of implants) {
    const result = await strikeChrome(implant, { ladder: "suppress", tier: 3, source });
    if (result?.changed) hit += 1;
  }
  if (hit) ui.notifications.info(loc("Chrome.Suppressed", { actor: target.name, count: hit, rounds }));
  return hit;
}

/** Apply one resolved impact to one token's actor. */
async function applyImpact(target, impact, { source = "" } = {}) {
  if (!target) return;
  if (impact.damage && target.system?.takeDamage) {
    await target.system.takeDamage(impact.damage, { type: impact.damageType ?? "" });
  }
  for (const condition of impact.conditions) {
    if (!target.statuses?.has?.(condition)) await target.toggleStatusEffect(condition, { active: true });
  }
  if (impact.chromeSuppress) await suppressChrome(target, impact.chromeSuppress, source);
}

/** One row of the resolution card. */
function resolutionRow(name, save, plan, impact) {
  const parts = [];
  if (impact.damage) parts.push(loc("Row.Damage", { damage: impact.damage }));
  for (const condition of impact.conditions) parts.push(loc("Row.Condition", { condition: conditionLabel(condition) }));
  if (impact.chromeSuppress) parts.push(loc("Row.Chrome", { rounds: impact.chromeSuppress }));
  if (!parts.length) parts.push(loc("Row.Nothing"));
  return `<li>${loc("Row.Line", {
    name: esc(name),
    total: save.total,
    outcome: loc(`Outcomes.${save.outcome}`),
    impact: parts.join(loc("Row.Join")),
  })}${plan.high ? ` <strong>${loc("Row.High")}</strong>` : ""}</li>`;
}

/**
 * C1-C4 — pick, place, roll, resolve, spend.
 *
 * Runs after Draw Steel has posted the thrower's own card, so the tier on that card is the tier the
 * saves are read against. Smoke (no `save` in the stamp) skips the save loop entirely and just hands
 * out Cover/Conceal.
 */
async function resolveThrow(actor, grenade, message) {
  const spec = thrownSpec(grenade);
  const origin = await pickBlastOrigin();
  if (!origin) return null;
  const template = await placeBlastTemplate(actor, origin, spec.feet);
  if (!template) {
    ui.notifications.warn(loc("NoScene"));
    return null;
  }

  const hit = messageCritical(message);
  const throwerTier = Math.min(3, Math.max(1, Number(hit.tier) || 1));
  const caught = tokensUnderTemplate(template).map(token => token.actor).filter(Boolean);

  const rows = [];
  if (!spec.save) {
    // Smoke: no save, no damage — everything in the cloud is Concealed until the cloud goes.
    for (const target of caught) {
      if (!target.statuses?.has?.(COVER_CONCEAL_ID)) await target.toggleStatusEffect(COVER_CONCEAL_ID, { active: true });
      rows.push(`<li>${loc("Row.Concealed", { name: esc(target.name) })}</li>`);
    }
  } else {
    for (const target of caught) {
      const save = await rollReflexSave(target);
      const plan = planBlastImpact({ outcome: save.outcome, throwerTier });
      const impact = impactFor(spec.impact, plan.impactTier, plan.high);
      await applyImpact(target, impact, { source: grenade.name });
      rows.push(resolutionRow(target.name, save, plan, impact));
    }
  }

  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content: `<p>${loc("Chat.Thrown", {
      actor: esc(actor.name), item: esc(grenade.name), feet: spec.feet, tier: throwerTier,
    })}</p>`
      + (rows.length ? `<ul class="ghostwire-blast-rows">${rows.join("")}</ul>` : `<p><em>${loc("Chat.NobodyCaught")}</em></p>`),
    flags: { [MODULE_ID]: { blastCard: true } },
  });

  const left = Math.max(0, Number(grenade.system?.quantity ?? 1) - 1);
  await grenade.update({ "system.quantity": left });
  return { template, rows: rows.length, throwerTier, left };
}

/** Using Throw picks a grenade first, then lets Draw Steel roll, then resolves the circle. */
function patchThrowUse() {
  const AbilityModel = CONFIG.Item.dataModels?.ability ?? ds.data?.Item?.AbilityModel;
  if (!AbilityModel?.prototype.use) {
    console.warn(`${MODULE_ID} | AbilityModel#use not found; Throw will not place a template`);
    return;
  }
  const use = AbilityModel.prototype.use;
  AbilityModel.prototype.use = async function(config = {}, dialogOptions = {}, messageOptions = {}) {
    if (!this.parent?.getFlag?.(MODULE_ID, THROW_FLAG)) return use.call(this, config, dialogOptions, messageOptions);
    const actor = this.actor;
    // Refuse before the card posts: an empty pouch must not leave a power roll on the log.
    const grenade = await promptGrenade(actor);
    if (!grenade) return null;
    const message = await use.call(this, config, dialogOptions, messageOptions);
    if (!message) return message;
    await resolveThrow(actor, grenade, message);
    return message;
  };
}

/* -------------------------------------------- registration */

export function registerGrenades() {
  patchThrowUse();

  Hooks.once("ready", async () => {
    let added = 0;
    let removed = 0;
    for (const actor of game.actors) {
      if (!actor.isOwner) continue;
      const result = await syncActor(actor);
      added += result.added;
      removed += result.removed;
    }
    if (added || removed) console.log(`${MODULE_ID} | Throw abilities: +${added} / -${removed}`);
  });

  Hooks.on("createItem", (item, options, userId) => {
    if (userId !== game.user.id) return;
    if (isThrownBlast(item) && (item.parent instanceof Actor)) syncActor(item.parent);
  });

  Hooks.on("deleteItem", (item, options, userId) => {
    if (userId !== game.user.id) return;
    if (item?.type === "treasure" && (item.parent instanceof Actor)) syncActor(item.parent);
  });

  Hooks.on("createActor", (actor, options, userId) => {
    if (userId !== game.user.id) return;
    syncActor(actor);
  });

  const module = game.modules.get(MODULE_ID);
  if (module) {
    module.api = {
      ...(module.api ?? {}),
      isThrownBlast,
      thrownSpec,
      saveOutcome,
      planBlastImpact,
      impactFor,
      blastDamageTiers,
      syncThrowAbility: syncActor,
    };
  }
  console.log(`${MODULE_ID} | thrown Blast grenades registered (${BLAST_FEET} ft circle, Reflex save)`);
}
