// 0.3.142 — Director: Apply Biofeedback. One apply pipeline for every bite the Wired takes out of a body.
//
// Two things in Ghostwire deal Biofeedback and they have never shared an implementation:
//
//   * **Wire Biofeedback** — ICE, black ICE, an Integrity-to-Stamina bleed-through clause, a
//     catastrophic bite from the host you are standing in (`docs/raw/21-the-wire.md`).
//   * **Technomancer overreach** — a failed Physique test after spending 5+ Resonance
//     (`docs/raw/20-technomancer.md`), which keeps its own sheet/chat resolution.
//
// Both land on the same floor, so the floor lives here once. The Director macro runs the Wire path
// end to end; the Techno path borrows `applyWindedFloor` and nothing else.
//
// **The four steps (LOCKED 2026-09-25).**
//
//   1. base      — the host's Biofeedback Value by Node Rating: R1 3 · R2 5 · R3 8 · R4 13 · R5 22
//                  (the numbers already printed on the System Stat Card), or a Director's custom base.
//   2. scale     — by the *runner's own* connection state. Disconnected / Linked → 0 (no Biofeedback
//                  at all). Overlay → ×0.5 round down, minimum 1. Jacked In → ×1.5 round up.
//                  There is no ×1 "wired-direct" rung.
//   3. resist    — minus the deck's Biofeedback Resistance, off the *scaled* number, never below 0.
//   4. apply     — the remainder as untyped Stamina damage.
//
// **The Winded floor (LOCKED, both sources).** Biofeedback that would take a hero to 0 Stamina or
// below leaves them **Winded, not Dying**: they stop at **1** Stamina. The floor never heals — a hero
// already at 1 stays at 1, and a hero already down at 0 from gunfire is not brought back up by a bite.
// Only Biofeedback is floored; a bullet in the corridor still kills them on the same turn.
//
// Everything above the Foundry section is Foundry-free so tools/wave-03142-smoke.mjs can execute the
// arithmetic in Node rather than re-typing it. Shape and registration follow director-wealth.mjs (F6).

import { collectTaintTargets } from "./taint.mjs";
import { WIRED_STATES, WIRED_STATUS_DEFS, isWiredState } from "./wired-state.mjs";

export const MODULE_ID = "draw-steel-ghostwire";

const L = "GHOSTWIRE.Biofeedback.Director";

/* -------------------------------------------- pure math */

/** System Stat Card Biofeedback Value by Node Rating. Printed in `21-the-wire.md`; do not drift. */
export const BIOFEEDBACK_BY_RATING = Object.freeze({ 1: 3, 2: 5, 3: 8, 4: 13, 5: 22 });

/** The Node Ratings the picker offers, in order. */
export const BIOFEEDBACK_RATINGS = Object.freeze([1, 2, 3, 4, 5]);

/** Where the Winded floor puts a hero Biofeedback would have dropped. */
export const WINDED_FLOOR_STAMINA = 1;

/** The four ICE attack triggers (`21-the-wire.md`). ICE never free-attacks every round. */
export const ICE_TRIGGERS = Object.freeze(["low-roll", "failed-breach", "hunt-bite", "malice-surge"]);

/** A Node Rating 1–5, or null when the value is not one. */
export function normalizeRating(value) {
  const n = Math.floor(Number(value));
  return BIOFEEDBACK_RATINGS.includes(n) ? n : null;
}

/** The printed Biofeedback Value for a Node Rating, or 0 when the rating is not 1–5. */
export function baseForRating(rating) {
  const r = normalizeRating(rating);
  return r ? BIOFEEDBACK_BY_RATING[r] : 0;
}

/** `"jackedIn"` / `"overlay"` / `"linked"` / anything else → a Wired state, defaulting to disconnected. */
export function normalizeBiofeedbackState(state) {
  return isWiredState(state) ? state : "disconnected";
}

/** A non-negative integer. `"8"` / `8.7` / `-3` / `null` → 8 / 8 / 0 / 0. */
export function clampBiofeedback(value) {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, n);
}

/**
 * Step 2 — scale a base Biofeedback Value by the runner's own connection state.
 *
 * Disconnected and Linked are **0**: soft presence is not immersion, so nothing bleeds through.
 * Overlay halves and rounds down but never below 1 (a bite that connects always costs something).
 * Jacked In multiplies by 1.5 and rounds up.
 *
 * @param {number} base
 * @param {string} state  disconnected | linked | overlay | jackedIn
 * @returns {number}
 */
export function scaleBiofeedback(base, state) {
  const value = clampBiofeedback(base);
  if (value === 0) return 0;
  switch (normalizeBiofeedbackState(state)) {
    case "overlay": return Math.max(1, Math.floor(value * 0.5));
    case "jackedIn": return Math.ceil(value * 1.5);
    default: return 0; // disconnected, linked
  }
}

/** Step 3 — the deck's Biofeedback Resistance comes off the scaled number, never below 0. */
export function biofeedbackDamage({ base = 0, state = "disconnected", resistance = 0 } = {}) {
  return Math.max(0, scaleBiofeedback(base, state) - clampBiofeedback(resistance));
}

/**
 * The Winded floor. Shared by Wire Biofeedback and Technomancer overreach — one rule, two sources.
 *
 * `floored` is true only when the floor actually caught the hit (the hero would have gone to 0 or
 * below and did not). `winded` is the table-facing state after the hit: at or below half maximum
 * Stamina, which a floored hero always is.
 *
 * @param {object} options
 * @param {number} options.stamina      Stamina now.
 * @param {number} options.staminaMax   Maximum Stamina (0 when unknown — then `winded` mirrors `floored`).
 * @param {number} options.damage       The Biofeedback damage from `biofeedbackDamage`.
 * @param {boolean} [options.floor]     false resolves without the floor (non-Biofeedback damage).
 * @returns {{staminaBefore: number, staminaAfter: number, damage: number, applied: number,
 *            prevented: number, floored: boolean, winded: boolean, dying: boolean}}
 */
export function applyWindedFloor({ stamina = 0, staminaMax = 0, damage = 0, floor = true } = {}) {
  const before = Math.floor(Number(stamina) || 0);
  const max = clampBiofeedback(staminaMax);
  const hit = clampBiofeedback(damage);
  const raw = before - hit;

  // The floor never *raises* Stamina: a hero already at or below the floor stays where they are.
  const after = (floor && (raw <= 0)) ? Math.min(before, WINDED_FLOOR_STAMINA) : raw;
  const floored = after > raw;
  const windedThreshold = Math.floor(max / 2);
  return {
    staminaBefore: before,
    staminaAfter: after,
    damage: hit,
    applied: before - after,
    prevented: after - raw,
    floored,
    winded: max > 0 ? (after <= windedThreshold) && (after > 0) : floored,
    dying: after <= 0,
  };
}

/**
 * The whole pipeline: rating or custom base → connection scale → resistance → Stamina, with the floor.
 *
 * This is the function the macro runs and the function the smoke asserts. Nothing else computes
 * Biofeedback.
 *
 * @param {object} options
 * @param {number|null} [options.rating]    Node Rating 1–5. Ignored when `base` is given.
 * @param {number|null} [options.base]      A custom base Biofeedback Value, overriding the rating.
 * @param {string} [options.state]          The runner's connection state.
 * @param {number} [options.resistance]     The deck's Biofeedback Resistance.
 * @param {number} [options.stamina]
 * @param {number} [options.staminaMax]
 * @param {boolean} [options.floor]
 * @returns {object} the `applyWindedFloor` result plus `rating`, `base`, `state`, `scaled`, `resistance`.
 */
export function resolveBiofeedback({
  rating = null, base = null, state = "disconnected", resistance = 0,
  stamina = 0, staminaMax = 0, floor = true,
} = {}) {
  const normalizedState = normalizeBiofeedbackState(state);
  const normalizedRating = normalizeRating(rating);
  const custom = (base !== null) && (base !== undefined) && (base !== "");
  const baseValue = custom ? clampBiofeedback(base) : baseForRating(normalizedRating);
  const scaled = scaleBiofeedback(baseValue, normalizedState);
  const resist = clampBiofeedback(resistance);
  const damage = Math.max(0, scaled - resist);
  return {
    rating: custom ? null : normalizedRating,
    base: baseValue,
    custom,
    state: normalizedState,
    scaled,
    resistance: resist,
    ...applyWindedFloor({ stamina, staminaMax, damage, floor }),
  };
}

/**
 * A deck's Biofeedback Resistance. The Hacker chapter prints it **per Echelon**, so the deck carries
 * the per-Echelon number and the wearer's Echelon multiplies it.
 *
 * @param {object} options
 * @param {number} options.perEchelon  `flags.<module>.matrix.biofeedbackResistance` on the deck Item.
 * @param {number} options.echelon     The runner's Echelon (1–4). Below 1 reads as 1.
 */
export function deckResistance({ perEchelon = 0, echelon = 1 } = {}) {
  return clampBiofeedback(perEchelon) * Math.max(1, clampBiofeedback(echelon) || 1);
}

/** Only creatures with a Stamina pool can take Biofeedback. Heroes are the normal case. */
export const actorAcceptsBiofeedback = actor =>
  Number.isFinite(Number(actor?.system?.stamina?.max)) || Number.isFinite(Number(actor?.system?.stamina?.value));

/* -------------------------------------------- Foundry */

const loc = (key, data) => (data ? game.i18n.format(`${L}.${key}`, data) : game.i18n.localize(`${L}.${key}`));
const esc = value => foundry.utils.escapeHTML(String(value ?? ""));

/** Injected by registerDirectorBiofeedback so the macro reads the same state the Console does. */
let readWiredState = null;

/**
 * The target's connection state. Prefers the module's own `getWiredState`; falls back to the three
 * exclusive statuses, which is what that function reads anyway.
 */
export function detectWiredState(actor) {
  if (readWiredState) {
    const state = readWiredState(actor);
    if (isWiredState(state)) return state;
  }
  if (actor?.statuses?.has?.(WIRED_STATUS_DEFS.jackedIn.id)) return "jackedIn";
  if (actor?.statuses?.has?.(WIRED_STATUS_DEFS.overlay.id)) return "overlay";
  if (actor?.statuses?.has?.(WIRED_STATUS_DEFS.linked.id)) return "linked";
  return "disconnected";
}

/** The runner's Echelon, for the per-Echelon deck stat. Draw Steel derives it from level. */
function actorEchelon(actor) {
  const echelon = Number(actor?.system?.echelon ?? actor?.system?.hero?.echelon);
  if (Number.isFinite(echelon) && (echelon > 0)) return Math.floor(echelon);
  const level = Number(actor?.system?.hero?.level ?? actor?.system?.level);
  if (Number.isFinite(level) && (level > 0)) return Math.min(4, Math.max(1, Math.ceil(level / 3)));
  return 1;
}

/**
 * The best Biofeedback Resistance the target's own gear gives them.
 *
 * Reads `flags.<module>.matrix.biofeedbackResistance` (a per-Echelon number) off every carried Item
 * whose matrix role is a deck, takes the highest — you run one deck at a time, and the good one — and
 * multiplies by the runner's Echelon. Returns 0 when they carry no deck, which is the honest answer
 * for a Technomancer or a runner on a bare commlink.
 */
export function detectResistance(actor) {
  let best = 0;
  for (const item of actor?.items ?? []) {
    const matrix = item?.flags?.[MODULE_ID]?.matrix;
    if (!matrix || (matrix.role !== "deck")) continue;
    const perEchelon = clampBiofeedback(matrix.biofeedbackResistance);
    if (perEchelon > best) best = perEchelon;
  }
  if (!best) return 0;
  return deckResistance({ perEchelon: best, echelon: actorEchelon(actor) });
}

/** Targeted tokens first, else controlled — the same collect the Taint and Wealth tools use. */
export function collectBiofeedbackTargets({ targeted = [], controlled = [] } = {}) {
  return collectTaintTargets({ targeted, controlled });
}

function pickedActors() {
  const targeted = [...(game.user.targets ?? [])];
  const controlled = [...(canvas?.tokens?.controlled ?? [])];
  return collectBiofeedbackTargets({ targeted, controlled });
}

function staminaOf(actor) {
  return {
    value: Math.floor(Number(actor?.system?.stamina?.value ?? 0)) || 0,
    max: clampBiofeedback(actor?.system?.stamina?.max),
  };
}

async function announce(actor, result, trigger) {
  const data = {
    actor: actor.name,
    base: result.base,
    state: loc(`States.${result.state}`),
    scaled: result.scaled,
    resistance: result.resistance,
    damage: result.damage,
    applied: result.applied,
    before: result.staminaBefore,
    after: result.staminaAfter,
    trigger: trigger ? loc(`Triggers.${trigger}`) : loc("Triggers.unstated"),
    source: result.custom ? loc("CustomBase", { base: result.base }) : loc("RatingBase", { rating: result.rating ?? "?", base: result.base }),
  };
  const lines = [
    loc("ChatSource", data),
    loc("ChatScale", data),
    loc("ChatResist", data),
    loc("ChatApplied", data),
  ];
  if (result.floored) lines.push(loc("ChatWindedFloor", data));
  else if (result.damage === 0) lines.push(loc("ChatNoBite", data));
  const content = `
      <div class="ghostwire-biofeedback-chat state-${result.state}${result.floored ? " winded-floor" : ""}">
        <header>
          <i class="fa-solid fa-bolt"></i>
          <span class="gw-biofeedback-kicker">${esc(loc("ChatTitle", data))}</span>
        </header>
        <p class="hint">${esc(loc("ChatTrigger", data))}</p>
        ${lines.map(line => `<p>${esc(line)}</p>`).join("")}
      </div>`;
  ui.notifications.info(loc(result.floored ? "NotifyFloored" : "Notify", data));
  await ChatMessage.implementation.create({ speaker: { alias: loc("Speaker") }, content });
}

/**
 * Resolve and apply one Biofeedback hit to one Actor, and post the whole line to chat. GM only.
 *
 * @param {object} options
 * @param {Actor} options.actor
 * @param {number|null} [options.rating]       Node Rating 1–5.
 * @param {number|null} [options.base]         Custom base, overriding the rating.
 * @param {string|null} [options.state]        Override the auto-detected connection state.
 * @param {number|null} [options.resistance]   Override the auto-detected deck resistance.
 * @param {string} [options.trigger]           Which of the four ICE triggers fired (chat only).
 * @param {boolean} [options.silent]
 * @returns {Promise<object>} the `resolveBiofeedback` result, with `actor` and `id`.
 */
export async function directorApplyBiofeedback({
  actor, rating = null, base = null, state = null, resistance = null, trigger = "", silent = false,
} = {}) {
  const stamina = staminaOf(actor);
  const resolvedState = (state && isWiredState(state)) ? state : detectWiredState(actor);
  const resolvedResistance = (resistance === null || resistance === undefined || resistance === "")
    ? detectResistance(actor)
    : clampBiofeedback(resistance);

  const result = resolveBiofeedback({
    rating, base, state: resolvedState, resistance: resolvedResistance,
    stamina: stamina.value, staminaMax: stamina.max,
  });
  const tag = { ...result, actor: actor?.name ?? "", id: actor?.id ?? null, trigger };

  if (!game.user?.isGM) {
    ui.notifications.warn(loc("GMOnly"));
    return { ...tag, ok: false, refusal: "not-gm", applied: 0, staminaAfter: stamina.value };
  }
  if (!actorAcceptsBiofeedback(actor)) {
    ui.notifications.warn(loc("NotEligible", { actor: actor?.name ?? "" }));
    return { ...tag, ok: false, refusal: "no-stamina", applied: 0, staminaAfter: stamina.value };
  }

  if (result.applied > 0) {
    await actor.update({ "system.stamina.value": result.staminaAfter }, { ghostwireBiofeedback: true });
  }
  if (!silent) await announce(actor, result, trigger);
  return { ...tag, ok: true, refusal: null };
}

/** Ask the Director for rating / custom base / state / resistance / trigger. Null when they cancel. */
async function askBiofeedback(actors) {
  const first = actors[0];
  const detectedState = detectWiredState(first);
  const detectedResistance = detectResistance(first);
  const names = actors
    .map(actor => `${actor.name} — ${loc(`States.${detectWiredState(actor)}`)}, ${loc("ResistanceShort", { resistance: detectResistance(actor) })}`)
    .join("; ");
  const ratingOptions = BIOFEEDBACK_RATINGS
    .map(r => `<option value="${r}"${r === 3 ? " selected" : ""}>${esc(loc("RatingOption", { rating: r, base: BIOFEEDBACK_BY_RATING[r] }))}</option>`)
    .join("");
  const stateOptions = ["", ...WIRED_STATES]
    .map(s => `<option value="${s}"${s === "" ? " selected" : ""}>${esc(s === "" ? loc("StateAuto", { state: loc(`States.${detectedState}`) }) : loc(`States.${s}`))}</option>`)
    .join("");
  const triggerOptions = ["", ...ICE_TRIGGERS]
    .map(t => `<option value="${t}"${t === "" ? " selected" : ""}>${esc(t === "" ? loc("Triggers.unstated") : loc(`Triggers.${t}`))}</option>`)
    .join("");
  const content = `
      <p class="hint">${esc(loc("Targets", { actors: names }))}</p>
      <div class="form-group">
        <label>${esc(loc("Rating"))}</label>
        <select name="rating">${ratingOptions}</select>
      </div>
      <div class="form-group">
        <label>${esc(loc("CustomBaseLabel"))}</label>
        <input type="number" name="base" min="0" step="1" placeholder="${esc(loc("CustomBasePlaceholder"))}">
      </div>
      <div class="form-group">
        <label>${esc(loc("State"))}</label>
        <select name="state">${stateOptions}</select>
      </div>
      <div class="form-group">
        <label>${esc(loc("Resistance"))}</label>
        <input type="number" name="resistance" min="0" step="1" placeholder="${esc(loc("ResistanceAuto", { resistance: detectedResistance }))}">
      </div>
      <div class="form-group">
        <label>${esc(loc("Trigger"))}</label>
        <select name="trigger">${triggerOptions}</select>
      </div>
      <p class="hint">${esc(loc("FloorHint"))}</p>`;
  return foundry.applications.api.DialogV2.prompt({
    window: { title: loc("Title"), icon: "fa-solid fa-bolt" },
    content,
    ok: {
      label: loc("Submit"),
      icon: "fa-solid fa-bolt",
      callback: (event, button) => {
        const form = button.form;
        const rawBase = String(form.elements.base.value ?? "").trim();
        const rawResistance = String(form.elements.resistance.value ?? "").trim();
        return {
          rating: normalizeRating(form.elements.rating.value),
          base: rawBase === "" ? null : clampBiofeedback(rawBase),
          state: form.elements.state.value || null,
          resistance: rawResistance === "" ? null : clampBiofeedback(rawResistance),
          trigger: form.elements.trigger.value || "",
        };
      },
    },
    rejectClose: false,
  });
}

/**
 * The Director tool: collect targeted / selected tokens, ask once, apply to each.
 *
 * @param {object} [options]
 * @param {Actor[]} [options.actors]  Skip the token collect.
 * @returns {Promise<object[]>} one result per Actor touched.
 */
export async function directorBiofeedbackPrompt({ actors = null } = {}) {
  if (!game.user?.isGM) {
    ui.notifications.warn(loc("GMOnly"));
    return [];
  }
  const picked = (actors ?? pickedActors()).filter(Boolean);
  if (!picked.length) {
    ui.notifications.warn(loc("NoTarget"));
    return [];
  }
  const eligible = picked.filter(actor => {
    if (actorAcceptsBiofeedback(actor)) return true;
    ui.notifications.warn(loc("NotEligible", { actor: actor.name }));
    return false;
  });
  if (!eligible.length) return [];

  const answer = await askBiofeedback(eligible);
  if (!answer) return [];

  const results = [];
  for (const actor of eligible) {
    results.push(await directorApplyBiofeedback({ actor, ...answer }));
  }
  return results;
}

/* -------------------------------------------- registration */

/**
 * A keybinding, the API and `game.ghostwire`. Call during init.
 *
 * No Token toolbar button: after the 0.3.137 declutter, Director tools are **Ghostwire Macros**
 * (`src/packs/macros/director-biofeedback.json`, beside Pay / Spend Hero) plus this keybinding.
 *
 * @param {object} [deps]
 * @param {(actor: Actor) => string} [deps.getWiredState]  The module's own state reader.
 */
export function registerDirectorBiofeedback({ getWiredState = null } = {}) {
  if (typeof getWiredState === "function") readWiredState = getWiredState;

  game.keybindings.register(MODULE_ID, "directorBiofeedback", {
    name: `${L}.Keybinding`,
    editable: [],
    restricted: true,
    onDown: () => {
      directorBiofeedbackPrompt();
      return true;
    },
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
  });

  Hooks.once("ready", () => {
    const module = game.modules.get(MODULE_ID);
    if (module) {
      module.api = {
        ...(module.api ?? {}),
        directorApplyBiofeedback,
        directorBiofeedbackPrompt,
        resolveBiofeedback,
        scaleBiofeedback,
        biofeedbackDamage,
        applyWindedFloor,
        detectWiredState,
        detectResistance,
        BIOFEEDBACK_BY_RATING,
      };
    }
    game.ghostwire = {
      ...(game.ghostwire ?? {}),
      directorApplyBiofeedback, directorBiofeedbackPrompt, resolveBiofeedback, applyWindedFloor,
    };
  });

  console.log(`${MODULE_ID} | Director: Apply Biofeedback registered (R1 3 · R2 5 · R3 8 · R4 13 · R5 22, Winded floor at ${WINDED_FLOOR_STAMINA})`);
}
