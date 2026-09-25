// 0.3.139 (A) — Special Agent (Hacker) and Special Sprite (Technomancer): the purpose-built construct.
//
// Every other compile picks an archetype off a menu. This one does the opposite, and the order is the
// whole feature (LOCKED, Michael 2026-09-25):
//
//   1. **Power Roll first.** No picker, no prompt, no spend before the dice.
//   2. The tier sets the **action budget**: tier 1 = 1 Action, tier 2 = 2 Actions, tier 3 = 3 Actions.
//   3. **Then** the player writes the construct's **purpose** — knowing exactly how many Actions they
//      bought. Asking for the purpose first would be asking them to plan a job before they know how
//      much of it they can afford.
//   4. The Actor is summoned with the budget annotated on its description: `Actions (2): …purpose…`.
//
// Cost is **3 Bandwidth** (Hacker) / **3 Resonance** (Technomancer) **in combat only**. Out of combat
// the construct is free — same table discipline as the rest of the Hacker's Programs.
//
// This file is the pure half: no Foundry globals are touched at import time, so `tools/wave-03139-smoke.mjs`
// can drive the flow order, the tier→Actions map, the description stamp and the spend plan offline.
// scripts/agents.mjs and scripts/sprites.mjs own the dialogs, the roll and the Actor.

/** The archetype token both engines use for a purpose-built construct. Not in either archetype picker. */
export const SPECIAL_ARCHETYPE = "special";

/** The two ability `_dsid`s that drive this flow. */
export const SPECIAL_AGENT_DSID = "special-agent";
export const SPECIAL_SPRITE_DSID = "special-sprite";

/** In-combat cost. Out of combat is free — see {@link specialSpendPlan}. */
export const SPECIAL_AGENT_BANDWIDTH = 3;
export const SPECIAL_SPRITE_RESONANCE = 3;

/** Stamina base by band — the middle of the four published archetypes (Daemon / Watchdog / Machine / Ward). */
export const SPECIAL_STAMINA_BASE = Object.freeze({ minor: 10, intermediate: 16, advanced: 22 });

/** Tier → Actions. The only place this table is written. */
export const ACTIONS_BY_TIER = Object.freeze({ 1: 1, 2: 2, 3: 3 });

/** Longest purpose a player may type. Long enough for a sentence, short enough to read on a token. */
export const PURPOSE_MAX = 240;

/**
 * The mandatory order, as data, so the smoke can assert it instead of trusting a comment.
 * `scripts/agents.mjs` and `scripts/sprites.mjs` both run it exactly in this sequence.
 */
export const SPECIAL_FLOW = Object.freeze(["roll", "budget", "purpose", "summon"]);

/**
 * How many Actions a tier buys.
 * A missing / unreadable tier reads as tier 1 — the table already rolled, so the construct still
 * manifests, on the smallest budget, instead of silently vanishing.
 * @param {number|string|null|undefined} tier
 * @returns {1|2|3}
 */
export function actionsForTier(tier) {
  const n = Math.floor(Number(tier));
  return ACTIONS_BY_TIER[n] ?? ACTIONS_BY_TIER[1];
}

/** Trim, collapse whitespace and clip a typed purpose. Empty / non-string reads as "". */
export function normalizePurpose(purpose) {
  return String(purpose ?? "").replace(/\s+/g, " ").trim().slice(0, PURPOSE_MAX);
}

/**
 * The annotated description stamped onto the summoned Actor (LOCKED: the action cap is on the
 * description, not only in a flag). Plain language, one line, budget first.
 *
 * @param {object} opts
 * @param {number} opts.actions  1–3, from {@link actionsForTier}.
 * @param {string} opts.purpose  What the player typed.
 * @param {string} [opts.lead]   Optional sentence before the annotation (the stock card blurb).
 * @returns {string} HTML for `system.biography.value`.
 */
export function specialSummonDescription({ actions, purpose, lead = "" } = {}) {
  const budget = Math.max(1, Math.min(3, Math.floor(Number(actions) || 1)));
  const text = normalizePurpose(purpose);
  const head = lead ? `<p>${lead}</p>` : "";
  return `${head}<p><strong>Actions (${budget}):</strong> ${escapeText(text)}</p>`;
}

/** The one-line label the notification and the token tooltip use. */
export function specialSummonLabel({ actions, purpose } = {}) {
  const budget = Math.max(1, Math.min(3, Math.floor(Number(actions) || 1)));
  return `Actions (${budget}): ${normalizePurpose(purpose)}`;
}

/** Minimal HTML escape — this text is typed by a player and goes straight into a description. */
export function escapeText(text) {
  return String(text ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/**
 * What the in-combat spend costs, and whether the caster can pay it.
 *
 * Out of combat there is no spend at all — not a spend of 0, no spend: the caller must not write the
 * resource. That is why `spend` is reported separately from `cost`.
 *
 * @param {object} opts
 * @param {boolean} opts.inCombat
 * @param {number} opts.current   The caster's heroic resource right now.
 * @param {number} opts.cost      3 Bandwidth / 3 Resonance.
 * @returns {{ok: boolean, spend: number, next: number|null, reason: string|null}}
 */
export function specialSpendPlan({ inCombat = false, current = 0, cost = 0 } = {}) {
  const have = Math.max(0, Math.floor(Number(current) || 0));
  const price = Math.max(0, Math.floor(Number(cost) || 0));
  if (!inCombat) return { ok: true, spend: 0, next: null, reason: null };
  if (have < price) return { ok: false, spend: 0, next: null, reason: "NotEnoughResource" };
  return { ok: true, spend: price, next: have - price, reason: null };
}

/**
 * Read the power-roll tier off the chat message the ability just posted.
 *
 * Draw Steel puts one `abilityResult` part per tier on an ability message; a `PowerRoll` also exposes
 * `product`, which is already 3 on a critical. Prefer the part (it is what the card printed), then the
 * roll, then null.
 *
 * @param {object} message  A ChatMessage, or any `{ system: { parts }, rolls }` shape (smokeable).
 * @returns {number|null}
 */
export function tierFromMessage(message) {
  for (const part of messageParts(message)) {
    const type = part?.type ?? part?.constructor?.TYPE;
    if (type !== "abilityResult") continue;
    const tier = Math.floor(Number(part?.tier));
    if (tier >= 1 && tier <= 3) return tier;
  }
  for (const roll of collectRolls(message)) {
    const product = Math.floor(Number(roll?.product));
    if (product >= 1 && product <= 3) return product;
  }
  return null;
}

function messageParts(message) {
  const parts = message?.system?.parts;
  if (!parts) return [];
  if (Array.isArray(parts)) return parts;
  return parts.contents ?? Object.values(parts);
}

function collectRolls(message) {
  const out = [...(message?.rolls ?? [])];
  for (const part of messageParts(message)) out.push(...(part?.rolls ?? []));
  return out;
}
