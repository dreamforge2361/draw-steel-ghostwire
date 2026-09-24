// 0.3.127 (A) — Throw: one shared ability, a 15-foot circle the player puts down *before* the dice,
// and a Reflex save read Low / Mid / High.
//
// 0.3.126 shipped the first cut of this: a 20-foot circle, auto-centred on whatever token happened
// to be targeted, placed *after* the power roll, and left on the canvas afterwards. Michael's smoke
// on 2026-09-24 killed all four of those decisions at once, and this file is the rewrite.
//
// What changed, and why each one is a lock and not a preference:
//
//  1. **15 feet, not 20.** One constant, `BLAST_FEET`, and every stamp, every lang string and every
//     rules page reads it rather than printing its own number.
//  2. **The circle goes down first.** The old order was prompt -> power roll -> place -> saves,
//     which meant the log already carried a throw before the player had said where. Now it is
//     prompt -> place -> power roll -> saves -> card -> delete, so a player who changes their mind
//     about the corner has not yet spent a roll on the log.
//  3. **The player places it. Nothing auto-centres.** The 0.3.126 branch that snapped the circle
//     onto the first targeted token is gone. "Throw it at him" is a fine sentence and a bad rule:
//     a grenade lands on a *point*, and half the reason to throw one is to catch three people who
//     are not the one you have targeted. Placement is refused past **60 feet** from the thrower.
//  4. **The circle is deleted when the resolve ends** — always, including on an abort after the
//     place. Leftover circles were the concrete thing that broke Michael's smoke: they sat on the
//     canvas and made tokens under them hard to pick up.
//
// And the save table is new. It is Draw Steel's tier ladder, read straight, with no special row:
//
//   | Reflex save tier | Label | Damage           | Riders (Dazed, EMP suppression, ...) |
//   |------------------|-------|------------------|--------------------------------------|
//   | 1                | Low   | full             | yes                                  |
//   | 2                | Mid   | half, round down | no                                   |
//   | 3                | High  | none             | no                                   |
//
// The 0.3.126 table (fail / success / critical-success, with a critical success still eating the
// middle impact) is superseded. A natural 19-20 on the *save* no longer forces a row of its own —
// on Draw Steel's ladder a natural 19-20 is already tier 3, which is already High, which is already
// "no damage". The thrower's own critical still matters, but only in one place: an EMP that lands
// on a **Low** save suppresses chrome for 2 rounds instead of 1.
//
// Decisions carried over from 0.3.126 and still true:
//
//  * **The thrower's tier comes off the thrower's own card.** Throw runs Draw Steel's normal
//    `AbilityModel#use`, so the power roll, the edges and banes, and F11's critical handling all
//    work untouched; `messageCritical()` from scripts/crit-feedback.mjs reads the tier back off the
//    message. Rolling a second, private power roll would have desynced from every modifier.
//  * **The save is a Power Roll, not Draw Steel's `rollSave`.** `rollSave` is the d10 save-ends
//    mechanic bolted to an ActiveEffect; it has no tiers. A Reflex save here is `2d10 + agility`
//    read on the tier ladder, which is what Ghostwire's Reflex has always meant
//    (chargen-wizard.mjs maps Reflex -> agility).
//  * **Adjacent demolition stays adjacent.** Thermite and Shaped Charge carry the Blast tag but are
//    placed against a wall, not lobbed, so they keep their B49 strike and are absent from the
//    `thrown` stamp.
//  * **Smoke has no save.** A screening canister does not hurt anybody — it puts the (15-foot)
//    circle down, Conceals everything inside it, and the circle is still deleted afterwards. The
//    Conceal stays on the tokens; only the drawing goes.
//
// **The circle is a Region, not a MeasuredTemplate.** Foundry 14 merged MeasuredTemplate into
// Region: `Scene`'s embedded documents no longer include `MeasuredTemplate` at all, and
// `Scene#templates` is a deprecated read-only view over Regions carrying
// `flags.core.MeasuredTemplate`. The 0.3.126 `scene.createEmbeddedDocuments("MeasuredTemplate", ...)`
// call therefore had nothing to create into on 14.367, which is the other half of why the smoke went
// the way it did. A Region with one circular shape is the v14 spelling of the same thing, it
// highlights, and it deletes.
//
// Everything above the "Foundry registration" divider is Foundry-free so
// tools/wave-03127-smoke.mjs can run it under Node.

import { messageCritical } from "./crit-feedback.mjs";
import { strikeChrome, isChromeItem } from "./chrome-damage.mjs";
import { COVER_CONCEAL_ID } from "./cover-conceal.mjs";
import { FEET_PER_SQUARE, isFootScaled } from "./token-light.mjs";
import { playHitFx } from "./hit-fx.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const L = "GHOSTWIRE.Throw";

/** The one shared ability, and the flag that marks it. */
export const THROW_DSID = "gw-throw";
export const THROW_FLAG = "throwAbility";

/** The gear flag a thrown Blast grenade carries: `{ feet, save, impact }`. */
export const THROWN_FLAG = "thrown";

/** Michael lock 0.3.127: every Blast grenade lands as a 15-foot circle. */
export const BLAST_FEET = 15;

/** And nobody throws one further than this. Placement past it is refused, not clamped. */
export const THROW_RANGE_FEET = 60;

/** Ghostwire's Reflex is Draw Steel's agility (scripts/chargen-wizard.mjs CHARACTERISTIC_LABELS). */
export const REFLEX_CHARACTERISTIC = "agility";

/** The three rows of the save table, in tier order. `Outcomes.<key>` is the printed label. */
export const SAVE_OUTCOMES = Object.freeze(["low", "mid", "high"]);

/** The thrower tier at which the EMP's long rider applies (a natural 19-20 is always tier 3). */
export const THROWER_HIGH_TIER = 3;

/** Ranged free-strike spread (scripts/data/weapon-use-templates.json): printed damage is the middle. */
export const BLAST_SPREAD = Object.freeze({ low: -2, high: 2 });

const gwFlags = doc => doc?.flags?.[MODULE_ID] ?? doc?.flags?.["draw-steel-ghostwire"] ?? {};

/* -------------------------------------------- reading */

/**
 * The `thrown` block on a grenade SKU, normalized.
 *
 * 0.3.127 (A1): a stamp with no `feet` of its own follows {@link BLAST_FEET}. Stamps that print
 * their own number are still honoured, so a Director's one-off device keeps working.
 *
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

/** Is this a thrown Blast grenade — the line that converts to Throw + circle + save? */
export function isThrownBlast(item) {
  if (item?.type !== "treasure" || item?.system?.kind !== "weapon") return false;
  return !!thrownSpec(item);
}

/* -------------------------------------------- geometry */

/**
 * Pixels on this canvas for one printed foot.
 *
 * Foundry measures in *scene units per grid square* (`canvas.dimensions.distance`) and *pixels per
 * grid square* (`canvas.dimensions.size`). A foot-scaled map takes the printed number as its scene
 * unit; anything else (Draw Steel's default 1-unit squares, or metres) treats five feet as one
 * square, the same rule scripts/token-light.mjs applies to a light radius. Computed straight rather
 * than through `lightRadius()`, whose two-decimal rounding is fine for a glow and not fine for a
 * range check a player is refused on.
 *
 * @param {object} dims  `{ size, distance, units }` — `canvas.dimensions` plus `scene.grid.units`.
 */
export function pixelsPerFoot({ size = 100, distance = 1, units = "" } = {}) {
  const pixelsPerSquare = Number(size) || 0;
  const unitsPerSquare = Number(distance) || 1;
  if (isFootScaled(units)) return pixelsPerSquare / unitsPerSquare;
  return pixelsPerSquare / FEET_PER_SQUARE;
}

/**
 * Is a landing point inside the thrower's reach?
 *
 * Refuses rather than clamps: a player who clicks past 60 feet is told the number and clicks again,
 * which is information. Silently pulling the circle back toward them is not. With no thrower token
 * on the canvas there is nothing to measure from, so everything is in reach.
 *
 * @returns {{ok: boolean, feet: number, max: number}} `feet` is rounded for the refusal string.
 */
export function throwReach({ from = null, to = null, perFoot = 1, max = THROW_RANGE_FEET } = {}) {
  if (!from || !to) return { ok: true, feet: 0, max };
  const px = Math.hypot((to.x ?? 0) - (from.x ?? 0), (to.y ?? 0) - (from.y ?? 0));
  const feet = perFoot > 0 ? (px / perFoot) : 0;
  return { ok: feet <= max + 1e-6, feet: Math.round(feet), max };
}

/* -------------------------------------------- planning */

/**
 * Read one Reflex save onto the 0.3.127 table.
 *
 * The total's tier is the whole answer. There is no natural-19 branch here any more: on Draw
 * Steel's ladder a natural 19-20 is read at tier 3 by the roll itself, which is already High.
 *
 * @param {object} opts
 * @param {number} opts.tier  Draw Steel's tier for the modified total (1 / 2 / 3).
 * @returns {"low"|"mid"|"high"}
 */
export function saveOutcome({ tier = 1 } = {}) {
  const clamped = Math.min(3, Math.max(1, Math.floor(Number(tier) || 1)));
  return SAVE_OUTCOMES[clamped - 1];
}

/**
 * What one token in the circle actually eats.
 *
 * `high` is the EMP-duration gate, and it is only read when the save came in Low: the thrower
 * reached tier 3 (which a natural 19-20 always is) and the target did not get clear. A Mid save
 * takes half the damage and no rider at all, however well the thrower rolled.
 *
 * @param {object} opts
 * @param {"low"|"mid"|"high"} opts.outcome  The save's row.
 * @param {number} opts.throwerTier          The tier off the thrower's own card (1 / 2 / 3).
 * @returns {{impactTier: number, half: boolean, riders: boolean, high: boolean, applies: boolean}}
 */
export function planBlastImpact({ outcome = "low", throwerTier = 1 } = {}) {
  const tier = Math.min(3, Math.max(1, Math.floor(Number(throwerTier) || 1)));
  if (outcome === "high") return { impactTier: 0, half: false, riders: false, high: false, applies: false };
  if (outcome === "mid") return { impactTier: tier, half: true, riders: false, high: false, applies: true };
  return { impactTier: tier, half: false, riders: true, high: tier >= THROWER_HIGH_TIER, applies: true };
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

/** Michael lock: a Mid save is half damage, rounded down. A 1 halves to 0, and that is a clean dodge. */
export const halveDamage = damage => Math.floor((Number(damage) || 0) / 2);

/**
 * The concrete impact one token takes: damage, conditions, chrome suppression.
 *
 * @param {object} impact  The SKU's `gear.thrown.impact` block.
 * @param {object} plan    A {@link planBlastImpact} result.
 * @returns {{damage: number, damageType: string|null, conditions: string[], chromeSuppress: number}}
 */
export function impactFor(impact = {}, plan = {}) {
  const none = { damage: 0, damageType: null, conditions: [], chromeSuppress: 0 };
  const tier = Math.min(3, Math.max(0, Math.floor(Number(plan.impactTier) || 0)));
  if (!tier) return none;
  const printed = Number(impact.damage) || 0;
  const full = printed ? blastDamageTiers(printed)[tier - 1] : 0;
  const suppress = Math.max(0, Math.floor(Number(impact.chromeSuppress) || 0));
  const highSuppress = Math.max(suppress, Math.floor(Number(impact.highChromeSuppress) || 0));
  return {
    damage: plan.half ? halveDamage(full) : full,
    damageType: printed ? (impact.damageType ?? null) : null,
    // A4: Flash-Bang's Dazed and the EMP's suppression are riders, and riders are a Low save only.
    conditions: (plan.riders && Array.isArray(impact.conditions)) ? [...impact.conditions] : [],
    chromeSuppress: plan.riders ? (plan.high ? highSuppress : suppress) : 0,
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
      description: { value: loc("Description", { feet: BLAST_FEET, range: THROW_RANGE_FEET }), director: "" },
      source: { book: "Ghostwire", page: "08-kits-gear-wealth", license: "Draw Steel Creator License" },
      _dsid: THROW_DSID,
      keywords: ["ranged", "weapon"],
      type: "main",
      category: "",
      resource: null,
      trigger: "",
      distance: { type: "ranged", primary: String(THROW_RANGE_FEET / FEET_PER_SQUARE), secondary: "1", tertiary: "1" },
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
          _id: "throwBefore00000", type: "base",
          description: loc("Effect", { feet: BLAST_FEET, range: THROW_RANGE_FEET }),
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

/* -------------------------------------------- placement */

/** The thrower's token on this canvas — the one they control, else any of theirs. */
function throwerToken(actor) {
  const mine = (canvas?.tokens?.placeables ?? []).filter(token => token.actor?.id === actor?.id);
  return mine.find(token => token.controlled) ?? mine[0] ?? null;
}

/**
 * A2 — the player puts the circle down, with the blast and the 60-foot reach both drawn live.
 *
 * This is deliberately our own PIXI overlay rather than Foundry's Region drag-create: the v14
 * RegionLayer create flow is a multi-click shape editor aimed at a Director building a permanent
 * zone, and what a grenade needs is one click. The overlay sits on `canvas.controls`, the layer
 * Foundry itself uses for transient canvas furniture, so it draws above the tokens and disappears
 * with the promise.
 *
 * Left click lands it. A click past the reach is refused with the distance and the pick continues.
 * Right click or Escape calls the throw off entirely, before any dice.
 *
 * @returns {Promise<{x: number, y: number}|null>}
 */
function pickBlastPoint({ origin, radiusPx, rangePx, perFoot, maxFeet }) {
  const stage = canvas?.stage;
  const layer = canvas?.controls ?? stage;
  if (!stage || !layer) return Promise.resolve(null);

  ui.notifications.info(loc("ClickToPlace", { feet: BLAST_FEET, range: maxFeet }));

  return new Promise(resolve => {
    const graphics = layer.addChild(new PIXI.Graphics());
    graphics.eventMode = "none";
    let at = null;

    const reachAt = point => throwReach({ from: origin, to: point, perFoot, max: maxFeet });

    const draw = () => {
      graphics.clear();
      if (origin && rangePx > 0) graphics.lineStyle(2, 0x66ccff, 0.55).drawCircle(origin.x, origin.y, rangePx);
      if (!at) return;
      const ok = reachAt(at).ok;
      graphics
        .lineStyle(3, ok ? 0x66ff66 : 0xff4444, 0.9)
        .beginFill(ok ? 0xff6633 : 0xff4444, 0.22)
        .drawCircle(at.x, at.y, radiusPx)
        .endFill();
    };

    const pointOf = event => event?.getLocalPosition?.(stage) ?? event?.data?.getLocalPosition?.(stage) ?? null;

    const done = point => {
      stage.off("pointerdown", onDown);
      stage.off("pointermove", onMove);
      stage.off("rightdown", onCancel);
      window.removeEventListener("keydown", onKey, true);
      graphics.clear();
      graphics.destroy();
      resolve(point);
    };

    const onMove = event => { at = pointOf(event) ?? at; draw(); };
    const onDown = event => {
      const point = pointOf(event);
      if (!point) return;
      const reach = reachAt(point);
      if (!reach.ok) {
        ui.notifications.warn(loc("OutOfRange", { feet: reach.feet, range: reach.max }));
        at = point;
        draw();
        return;
      }
      done({ x: point.x, y: point.y });
    };
    const onCancel = () => done(null);
    const onKey = event => { if (event.key === "Escape") { event.stopPropagation(); done(null); } };

    stage.on("pointerdown", onDown);
    stage.on("pointermove", onMove);
    stage.on("rightdown", onCancel);
    window.addEventListener("keydown", onKey, true);
    draw();
  });
}

/**
 * Put the circle on the canvas as a Region and hand back a small handle over it.
 *
 * The handle is what the rest of the file talks to, so "is it a Region or a MeasuredTemplate" lives
 * in exactly one function. `radiusPx` rides along because a Region's shape radius is pixels while
 * `thrownSpec().feet` is printed feet, and mixing the two is how a blast ends up five times too big.
 *
 * @returns {Promise<{doc: object, x: number, y: number, radiusPx: number, delete: function}|null>}
 */
async function placeBlast(actor, grenade, feet) {
  const scene = canvas?.scene;
  if (!scene || !canvas?.dimensions) {
    ui.notifications.warn(loc("NoScene"));
    return null;
  }
  const perFoot = pixelsPerFoot({
    size: canvas.dimensions.size,
    distance: canvas.dimensions.distance,
    units: scene.grid?.units,
  });
  const radiusPx = feet * perFoot;
  const token = throwerToken(actor);
  if (!token) ui.notifications.warn(loc("NoThrowerToken", { actor: actor.name }));

  const point = await pickBlastPoint({
    origin: token ? { x: token.center.x, y: token.center.y } : null,
    radiusPx,
    rangePx: THROW_RANGE_FEET * perFoot,
    perFoot,
    maxFeet: THROW_RANGE_FEET,
  });
  if (!point) return null;

  const [doc] = await scene.createEmbeddedDocuments("Region", [{
    name: loc("RegionName", { item: grenade?.name ?? "", feet }),
    color: game.user.color?.css ?? game.user.color ?? "#ff6633",
    shapes: [{
      type: "circle",
      x: Math.round(point.x),
      y: Math.round(point.y),
      radius: Math.round(radiusPx),
      gridBased: false,
    }],
    visibility: CONST.REGION_VISIBILITY.ALWAYS,
    highlightMode: "coverage",
    displayMeasurements: false,
    ownership: { default: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER },
    flags: { [MODULE_ID]: { blast: true, feet, thrownBy: actor.id } },
  }]);
  if (!doc) return null;

  return {
    doc,
    x: point.x,
    y: point.y,
    radiusPx,
    // A6: never throws. A circle we cannot delete must not take the resolve down with it.
    delete: async () => {
      try {
        await doc.delete();
      } catch (error) {
        console.warn(`${MODULE_ID} | blast circle not deleted`, error);
      }
    },
  };
}

/** The tokens standing inside a blast, by centre point. */
export function tokensInBlast(blast) {
  if (!blast || !canvas?.tokens) return [];
  return canvas.tokens.placeables.filter(token => {
    const dx = token.center.x - blast.x;
    const dy = token.center.y - blast.y;
    return Math.hypot(dx, dy) <= blast.radiusPx;
  });
}

/* -------------------------------------------- resolution */

/** Roll one token's Reflex save and read it on Draw Steel's own tier ladder. */
async function rollReflexSave(actor) {
  const score = Number(foundry.utils.getProperty(actor ?? {}, `system.characteristics.${REFLEX_CHARACTERISTIC}.value`)) || 0;
  const roll = new ds.rolls.PowerRoll("2d10 + @reflex", { reflex: score }, {
    type: "test",
    flavor: loc("SaveFlavor", { actor: actor?.name ?? "" }),
  });
  await roll.evaluate();
  const tier = Number(roll.product) || 1;
  return { roll, tier, total: roll.total, outcome: saveOutcome({ tier }) };
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

/**
 * A7 — apply one resolved impact to one token's actor.
 *
 * Every branch is awaited. Michael's smoke saw save dice land with no Stamina following them, which
 * is what an un-awaited `takeDamage` looks like from the table: the card posts, the next save rolls,
 * and the write lands whenever it lands. `impact.damage` is 0 only when the row really is "nothing"
 * — a High save, a Mid save that halved a 1, or a device like the EMP that never damages a body —
 * and a missing `takeDamage` is now said out loud rather than swallowed.
 */
async function applyImpact(target, impact, { source = "" } = {}) {
  if (!target) return;
  if (impact.damage > 0) {
    if (typeof target.system?.takeDamage === "function") {
      await target.system.takeDamage(impact.damage, { type: impact.damageType ?? "" });
    } else {
      console.warn(`${MODULE_ID} | ${target.name}: no system.takeDamage; ${impact.damage} damage not applied`);
    }
  }
  for (const condition of impact.conditions) {
    if (!target.statuses?.has?.(condition)) await target.toggleStatusEffect(condition, { active: true });
  }
  if (impact.chromeSuppress) await suppressChrome(target, impact.chromeSuppress, source);
}

/**
 * A5 — one row of the resolution card: who, what they rolled, which rung, and what that bought them.
 *
 * "Why" is the point of the row. A Mid save that halves 8 to 4 has to say *half*, or the table reads
 * a 4 and assumes the grenade rolled badly.
 */
function resolutionRow(name, save, plan, impact) {
  const parts = [];
  if (impact.damage) {
    parts.push(plan.half ? loc("Row.Half", { damage: impact.damage }) : loc("Row.Damage", { damage: impact.damage }));
  } else if (plan.half) {
    parts.push(loc("Row.HalvedToNothing"));
  }
  for (const condition of impact.conditions) parts.push(loc("Row.Condition", { condition: conditionLabel(condition) }));
  if (impact.chromeSuppress) parts.push(loc("Row.Chrome", { rounds: impact.chromeSuppress }));
  if (!parts.length) parts.push(plan.applies ? loc("Row.Nothing") : loc("Row.Clear"));
  return `<li>${loc("Row.Line", {
    name: esc(name),
    total: save.total,
    outcome: loc(`Outcomes.${save.outcome}`),
    impact: parts.join(loc("Row.Join")),
  })}${plan.high ? ` <strong>${loc("Row.High")}</strong>` : ""}</li>`;
}

/**
 * A3/A5 — saves, impacts and the card, against a circle that is already on the canvas.
 *
 * Runs after Draw Steel has posted the thrower's own card, so the tier on that card is the tier the
 * saves are read against. Smoke (no `save` in the stamp) skips the save loop entirely and just hands
 * out Cover/Conceal.
 */
async function resolveThrow(actor, grenade, blast, message) {
  const spec = thrownSpec(grenade);
  const hit = messageCritical(message);
  const throwerTier = Math.min(3, Math.max(1, Number(hit.tier) || 1));
  const caught = tokensInBlast(blast).map(token => token.actor).filter(Boolean);

  const rows = [];
  if (!spec.save) {
    // Smoke: no save, no damage — everything in the cloud is Concealed. The Conceal outlives the
    // circle on purpose; the drawing is a placement aid, the condition is the effect.
    for (const target of caught) {
      if (!target.statuses?.has?.(COVER_CONCEAL_ID)) await target.toggleStatusEffect(COVER_CONCEAL_ID, { active: true });
      rows.push(`<li>${loc("Row.Concealed", { name: esc(target.name) })}</li>`);
    }
  } else {
    for (const target of caught) {
      const save = await rollReflexSave(target);
      const plan = planBlastImpact({ outcome: save.outcome, throwerTier });
      const impact = impactFor(spec.impact, plan);
      await applyImpact(target, impact, { source: grenade.name });
      rows.push(resolutionRow(target.name, save, plan, impact));
    }
  }

  // D: the detonation, in-module. Fires whether or not anybody was standing in it — the circle
  // going off is the beat, and a grenade thrown into an empty doorway still goes off.
  playHitFx("grenade", { at: [{ x: blast.x, y: blast.y }] });

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
  return { rows: rows.length, throwerTier, left };
}

/**
 * A2 — pick, **place**, roll, resolve, spend, and take the circle back off the canvas.
 *
 * Order is the lock. The grenade and the point are both settled before `use.call()` posts anything,
 * so an abort at either step leaves no roll on the log; and once the circle exists, the `finally`
 * owns deleting it no matter which way the rest goes.
 */
function patchThrowUse() {
  const AbilityModel = CONFIG.Item.dataModels?.ability ?? ds.data?.Item?.AbilityModel;
  if (!AbilityModel?.prototype.use) {
    console.warn(`${MODULE_ID} | AbilityModel#use not found; Throw will not place a circle`);
    return;
  }
  const use = AbilityModel.prototype.use;
  AbilityModel.prototype.use = async function(config = {}, dialogOptions = {}, messageOptions = {}) {
    if (!this.parent?.getFlag?.(MODULE_ID, THROW_FLAG)) return use.call(this, config, dialogOptions, messageOptions);
    const actor = this.actor;
    // Refuse before the card posts: an empty pouch must not leave a power roll on the log.
    const grenade = await promptGrenade(actor);
    if (!grenade) return null;

    const spec = thrownSpec(grenade);
    const blast = await placeBlast(actor, grenade, spec.feet);
    if (!blast) return null;                       // cancelled at the canvas — still no dice rolled.

    try {
      const message = await use.call(this, config, dialogOptions, messageOptions);
      if (!message) return message;                // dialog cancelled after the place: finally cleans up.
      await resolveThrow(actor, grenade, blast, message);
      return message;
    } finally {
      await blast.delete();
    }
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
      pixelsPerFoot,
      throwReach,
      syncThrowAbility: syncActor,
    };
  }
  console.log(`${MODULE_ID} | thrown Blast grenades registered (${BLAST_FEET} ft circle, ${THROW_RANGE_FEET} ft reach, Reflex save)`);
}
