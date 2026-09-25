// 0.3.143 — the node applet's ICE package: the four triggers, the Alert strip, and one confirm card.
//
// 0.3.142 wrote the *arithmetic* down once (`scripts/director-biofeedback.mjs`) and gave the Director
// a macro to run it by hand. This file is the other half: the applet noticing that a trigger has
// fired, and asking. It never computes Biofeedback itself and it never writes Stamina itself — every
// path in here ends in `directorApplyBiofeedback`, the same function the macro calls.
//
// **The hard rule (LOCKED 2026-09-25): never silent Stamina.** Every bite the applet spots is a
// *request*. The Director sees a confirm card with the whole line prefilled — Rating → base, scaled
// by the runner's connection state, minus the deck's resistance, damage, and the Stamina before and
// after — and either presses Apply or presses Cancel. Cancel leaves Stamina untouched and posts
// nothing. There is no setting that turns the card off, because the card *is* the feature: the
// Director is the one who decides whether the fiction earned a bite, and the applet only does the
// arithmetic and the noticing.
//
// **The four triggers (`docs/raw/21-the-wire.md`, unchanged by this wave).**
//
//   1. low-roll      — a low (≤11) Wired Power Roll against a Track 2 host with *active* ICE (R3+).
//   2. failed-breach — a breach verb that came in under a Rating 4+ host's Breach DC.
//   3. hunt-bite     — Trace Alert 9–11, at the end of each of the runner's turns, while they are
//                      still Overlay or Jacked In.
//   4. malice-surge  — the Director presses the button.
//
// Linked and Disconnected never fire: step 2 of the procedure scales them to 0, and this file refuses
// to even raise the card, so a Linked runner never sees a dialog offering them 0 damage.
//
// Everything above the Foundry section is Foundry-free so tools/wave-03143-smoke.mjs can execute the
// predicates in Node rather than re-typing them.

import { RATING } from "./wired-node-templates.mjs";
import { isFullyConnected } from "./wired-state.mjs";
import {
  BIOFEEDBACK_BY_RATING, ICE_TRIGGERS, detectResistance, detectWiredState, directorApplyBiofeedback,
  normalizeRating, resolveBiofeedback,
} from "./director-biofeedback.mjs";

export const MODULE_ID = "draw-steel-ghostwire";

const L = "GHOSTWIRE.WiredIce";

/* -------------------------------------------- pure: the trigger predicates */

export const ALERT_MAX = 12;

/** The three Alert steps the strip announces when the track crosses them. */
export const ALERT_ANNOUNCE_STEPS = Object.freeze([5, 9, 12]);

/** What each announced step means, as a lang key suffix under `GHOSTWIRE.WiredIce.Alert`. */
export const ALERT_ANNOUNCE_KEYS = Object.freeze({ 5: "Malice", 9: "Hunt", 12: "CounterTrace" });

/** Trigger 1 — a host only has *active* ICE from Rating 3. R1–2 passive layers are flavour. */
export const ICE_ACTIVE_MIN_RATING = 3;

/** Trigger 2 — only Rating 4+ hosts carry Biofeedback on a failed breach. */
export const FAILED_BREACH_MIN_RATING = 4;

/** Trigger 1 — "low" is the Draw Steel tier 1 ceiling. */
export const LOW_ROLL_MAX = 11;

/** Trigger 3 — the hunt band. At 12 the host is in lockout, which is its own row. */
export const HUNT_ALERT_MIN = 9;
export const HUNT_ALERT_MAX = 11;

/**
 * The Matrix Verbs that are a *breach* for trigger 2.
 *
 * Connect / Jack Out / Toggle are posture, Broadcast is talk, Scan is observation (no Trace, no
 * bite), and Ping is Track 1 only and now refuses on a Track 2 host outright. What is left is the
 * three verbs that reach into a host and change or take something.
 */
export const BREACH_VERB_DSIDS = Object.freeze(["matrix-navigate", "matrix-search", "matrix-read-write"]);

/** The Breach DC printed on the System Stat Card for a Node Rating, or 0 when the rating is unreadable. */
export function breachDcForRating(rating) {
  const r = normalizeRating(rating);
  return r ? (RATING[r]?.breachDC ?? 0) : 0;
}

/** Overlay or Jacked In. The only two states a bite can land on — Linked and Disconnected scale to 0. */
export function exposedToBite(state) {
  return isFullyConnected(state);
}

/**
 * A resolved Wired Power Roll total, or null.
 *
 * `null` and `""` are *not* a roll of 0: a card that has not resolved yet has no total, and coercing
 * it to 0 would make every unresolved Matrix Verb look like a catastrophic low roll.
 */
export function rollTotal(value) {
  if ((value === null) || (value === undefined) || (value === "")) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/** A host has active ICE from Rating 3, and only on Track 2 — Track 1 objects carry no ICE at all. */
export function hostHasActiveIce({ track = 2, rating = 0 } = {}) {
  return (Number(track) === 2) && (Number(rating) >= ICE_ACTIVE_MIN_RATING);
}

/**
 * Trigger 1 — a low (≤11) Wired Power Roll against a host with active ICE, from Overlay or Jacked In.
 * @param {{ total: number|null, track: number, rating: number, state: string }} options
 */
export function lowRollBiteFires({ total = null, track = 2, rating = 0, state = "disconnected" } = {}) {
  if (!exposedToBite(state) || !hostHasActiveIce({ track, rating })) return false;
  const roll = rollTotal(total);
  return (roll !== null) && (roll <= LOW_ROLL_MAX);
}

/**
 * Trigger 2 — a breach verb that came in under a Rating 4+ host's Breach DC.
 *
 * `breachDC` defaults to the Rating's printed number, so a caller that only knows the Rating gets the
 * right answer; a Director who has written a custom DC onto the node can pass it.
 */
export function failedBreachFires({
  total = null, dsid = "", track = 2, rating = 0, state = "disconnected", breachDC = null,
} = {}) {
  if (!exposedToBite(state)) return false;
  if (Number(track) !== 2) return false;
  if (Number(rating) < FAILED_BREACH_MIN_RATING) return false;
  if (!BREACH_VERB_DSIDS.includes(dsid)) return false;
  const roll = rollTotal(total);
  if (roll === null) return false;
  const dc = Number(breachDC ?? breachDcForRating(rating)) || 0;
  return dc > 0 && (roll < dc);
}

/** Trigger 3 — Trace Alert 9–11 on this host, with the runner still Overlay or Jacked In. */
export function huntBiteFires({ alert = 0, state = "disconnected" } = {}) {
  if (!exposedToBite(state)) return false;
  const n = Number(alert) || 0;
  return (n >= HUNT_ALERT_MIN) && (n <= HUNT_ALERT_MAX);
}

/** Trigger 4 — the Director's button. Linked and Disconnected still take nothing. */
export function maliceSurgeFires({ state = "disconnected" } = {}) {
  return exposedToBite(state);
}

/**
 * Every trigger one resolved verb roll set off, in the order the card should ask them.
 *
 * "One trigger, one bite. Two different triggers on the same turn are two bites" — so a ≤11 roll
 * against a Rating 4 host really is two cards, and the Director can cancel either.
 *
 * @returns {string[]} a subset of ICE_TRIGGERS, ordered low-roll then failed-breach.
 */
export function rollTriggers({ total = null, dsid = "", track = 2, rating = 0, state = "disconnected", breachDC = null } = {}) {
  const fired = [];
  if (lowRollBiteFires({ total, track, rating, state })) fired.push("low-roll");
  if (failedBreachFires({ total, dsid, track, rating, state, breachDC })) fired.push("failed-breach");
  return fired;
}

/**
 * One bite's identity, for "the same trigger firing twice in one turn is still one".
 *
 * Roll-driven bites key on the chat message, so one roll is one bite no matter how many times the
 * card re-renders. The hunt bite keys on the combat turn, because that is the thing it happens once
 * per.
 */
export function biteKey({ trigger = "", runner = "", node = "", scope = "" } = {}) {
  return `${trigger}|${runner}|${node}|${scope}`;
}

/* -------------------------------------------- pure: the Alert strip */

/** The band a Trace Alert step sits in. Same ladder the Console and minimap already draw. */
export function alertBandAt(alert) {
  const n = Number(alert) || 0;
  if (n >= 12) return "lockout";
  if (n >= 9) return "hunting";
  if (n >= 5) return "malice";
  if (n >= 1) return "stir";
  return "quiet";
}

/**
 * Which announced steps a change in Trace Alert crossed, upward only.
 *
 * Going 4 → 9 crosses both 5 and 9 and announces both: the Director banked Malice *and* woke the
 * hunt in one move, and the table should hear both. Coming back down announces nothing — the Console
 * reset button is bookkeeping, not a story beat.
 *
 * @returns {number[]} an ascending subset of ALERT_ANNOUNCE_STEPS.
 */
export function alertCrossings(before, after) {
  const from = Math.max(0, Number(before) || 0);
  const to = Math.max(0, Number(after) || 0);
  if (to <= from) return [];
  return ALERT_ANNOUNCE_STEPS.filter(step => (from < step) && (to >= step));
}

/** The lang key suffix for one announced step (`GHOSTWIRE.WiredIce.Alert<suffix>`). */
export function alertAnnounceKey(step) {
  return ALERT_ANNOUNCE_KEYS[Number(step)] ?? null;
}

/* -------------------------------------------- pure: the Wire run checklist */

/**
 * The collapsible checklist on the node applet, following the North Substation spine
 * (`docs/directors/north-substation-masterwork.md`). Guidance, not a second rules engine: it blocks
 * nothing, gates nothing, and rolls nothing. Every row is a lang key under
 * `GHOSTWIRE.WiredIce.Checklist.<id>` with a `.Label` and a `.Hint`.
 */
export const WIRE_RUN_CHECKLIST = Object.freeze([
  "connect",      // Connect → Linked → Broadcast
  "toggle",       // Toggle to Overlay
  "scan",         // Scan / Deep Scan
  "tracks",       // Track 1 vs Track 2
  "lows",         // watch lows vs ICE
  "integrity",    // Integrity
  "alert",        // Alert bands 1–4 / 5–8 / 9–11 / 12
  "out",          // Decompile / Jack Out (the Alert persists)
].map(id => Object.freeze({ id, label: `${L}.Checklist.${id}.Label`, hint: `${L}.Checklist.${id}.Hint` })));

export const WIRE_RUN_CHECKLIST_IDS = Object.freeze(WIRE_RUN_CHECKLIST.map(step => step.id));

/** A checklist step id, or null. Anything not on the spine is ignored rather than stored. */
export function normalizeChecklistStep(id) {
  return WIRE_RUN_CHECKLIST_IDS.includes(id) ? id : null;
}

/** Flip one step's done-ness in a stored id list, dropping anything that is not on the spine. */
export function toggleChecklistStep(done = [], id) {
  const step = normalizeChecklistStep(id);
  const current = (Array.isArray(done) ? done : []).filter(normalizeChecklistStep);
  if (!step) return current;
  return current.includes(step) ? current.filter(s => s !== step) : [...current, step];
}

/** The checklist as the template renders it: spine order, with the stored ticks applied. */
export function checklistView(done = []) {
  const ticked = new Set((Array.isArray(done) ? done : []).filter(normalizeChecklistStep));
  return WIRE_RUN_CHECKLIST.map(step => ({ ...step, done: ticked.has(step.id) }));
}

/* -------------------------------------------- pure: the confirm card's own numbers */

/**
 * Everything the confirm card shows, computed by `resolveBiofeedback` and nothing else.
 *
 * The card never invents a number: this is the 0.3.142 pipeline run once for display, and then the
 * *same inputs* are handed to `directorApplyBiofeedback`, which runs it again for real. Two runs of
 * one pure function agree; two implementations would not.
 */
export function bitePreview({
  rating = null, base = null, state = "disconnected", resistance = 0, stamina = 0, staminaMax = 0,
} = {}) {
  return resolveBiofeedback({ rating, base, state, resistance, stamina, staminaMax });
}

/** A trigger the applet is allowed to raise a card for. */
export function isIceTrigger(trigger) {
  return ICE_TRIGGERS.includes(trigger);
}

/* -------------------------------------------- Foundry */

const loc = (key, data) => (data ? game.i18n.format(`${L}.${key}`, data) : game.i18n.localize(`${L}.${key}`));
const esc = value => foundry.utils.escapeHTML(String(value ?? ""));

/** Injected by registerWiredIce so every path reads the state the Console reads. */
let readWiredState = null;

/** Bites this client has already offered. Keyed by `biteKey`; see "one trigger, one bite". */
const offered = new Set();

const wiredState = actor => (readWiredState?.(actor) ?? detectWiredState(actor));

/** Only the one GM who owns world writes raises cards, so a three-GM table sees one dialog. */
function isBiteDirector() {
  if (!game.user?.isGM) return false;
  return !game.users?.activeGM || (game.users.activeGM === game.user);
}

function staminaOf(actor) {
  return {
    value: Math.floor(Number(actor?.system?.stamina?.value ?? 0)) || 0,
    max: Math.max(0, Math.floor(Number(actor?.system?.stamina?.max ?? 0)) || 0),
  };
}

/** The current Malice pool, read-only. Draw Steel keeps it in a world setting; we never write it. */
export function currentMalice() {
  try {
    const value = Number(game.actors?.malice?.value);
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

/**
 * The Director confirm card: the whole line, prefilled, with Apply and Cancel.
 *
 * Returns true only when the Director pressed Apply. Closing the window, pressing Escape and
 * pressing Cancel are all the same answer, and that answer leaves Stamina alone.
 *
 * @param {object} options
 * @param {Actor} options.actor        The compiler — the default target of a host's ICE.
 * @param {string} options.trigger     One of ICE_TRIGGERS.
 * @param {object} [options.node]      The board node, for the card's header.
 * @param {number|null} [options.rating]
 * @param {number|null} [options.resistance]
 * @param {string|null} [options.state]
 * @param {string} [options.detail]    A pre-localized line naming what fired (the roll, the Alert).
 * @returns {Promise<boolean>}
 */
export async function confirmBite({
  actor, trigger = "", node = null, rating = null, resistance = null, state = null, detail = "",
} = {}) {
  const resolvedState = state ?? wiredState(actor);
  const resolvedResistance = (resistance === null || resistance === undefined)
    ? detectResistance(actor)
    : Math.max(0, Math.floor(Number(resistance) || 0));
  const stamina = staminaOf(actor);
  const preview = bitePreview({
    rating, state: resolvedState, resistance: resolvedResistance,
    stamina: stamina.value, staminaMax: stamina.max,
  });
  const data = {
    actor: actor?.name ?? "",
    node: node?.name ?? "",
    rating: preview.rating ?? rating ?? "?",
    base: preview.base,
    scaled: preview.scaled,
    state: game.i18n.localize(`GHOSTWIRE.Biofeedback.Director.States.${preview.state}`),
    resistance: preview.resistance,
    damage: preview.damage,
    before: preview.staminaBefore,
    after: preview.staminaAfter,
    trigger: game.i18n.localize(`GHOSTWIRE.Biofeedback.Director.Triggers.${trigger}`),
  };
  const lines = [
    loc("Card.Base", data),
    loc("Card.Scale", data),
    loc("Card.Resist", data),
    loc("Card.Stamina", data),
  ];
  if (preview.floored) lines.push(loc("Card.Floor", data));
  else if (preview.damage === 0) lines.push(loc("Card.NoBite", data));
  const content = `
      <div class="ghostwire-ice-confirm state-${preview.state}${preview.floored ? " winded-floor" : ""}">
        <p class="gw-ice-trigger">${esc(loc(`Trigger.${trigger}`, data))}</p>
        ${detail ? `<p class="hint">${esc(detail)}</p>` : ""}
        <ol class="gw-ice-math">${lines.map(line => `<li>${esc(line)}</li>`).join("")}</ol>
        <p class="hint">${esc(loc("Card.CancelHint"))}</p>
      </div>`;
  const answer = await foundry.applications.api.DialogV2.wait({
    window: { title: loc("Card.Title", data), icon: "fa-solid fa-shield-halved" },
    classes: ["ghostwire-ice-dialog"],
    content,
    buttons: [
      { action: "apply", label: loc("Card.Apply", data), icon: "fa-solid fa-bolt", default: true },
      { action: "cancel", label: loc("Card.Cancel"), icon: "fa-solid fa-ban" },
    ],
    rejectClose: false,
  });
  return answer === "apply";
}

/**
 * Ask, then apply through the 0.3.142 pipeline. The only Stamina write in this file, and it is not
 * in this file — `directorApplyBiofeedback` owns it.
 *
 * @returns {Promise<object|null>} the apply result, or null when the Director cancelled.
 */
export async function confirmAndApplyBite({
  actor, trigger = "", node = null, rating = null, resistance = null, state = null, detail = "", key = null,
} = {}) {
  if (!isBiteDirector() || !actor) return null;
  const resolvedState = state ?? wiredState(actor);
  if (!exposedToBite(resolvedState)) return null; // Linked and Disconnected never see a card.
  if (key) {
    if (offered.has(key)) return null;
    offered.add(key); // Marked *before* the await: a second hook pass must not open a second dialog.
  }
  const ok = await confirmBite({ actor, trigger, node, rating, resistance, state: resolvedState, detail });
  if (!ok) return null;
  return directorApplyBiofeedback({
    actor, rating, state: resolvedState, resistance, trigger,
  });
}

/* -------------------------------------------- Foundry: the Alert strip */

/** Chat + a notification when the Trace Alert crosses 5, 9 or 12 on a node. */
export async function announceAlertCrossings(node, crossings, { scene = null } = {}) {
  if (!isBiteDirector() || !crossings?.length) return;
  const data = { node: node?.name ?? "", alert: node?.alert ?? 0, scene: scene?.name ?? "" };
  const lines = crossings.map(step => loc(`Alert.${alertAnnounceKey(step)}`, data)).filter(Boolean);
  if (!lines.length) return;
  const band = alertBandAt(node?.alert ?? 0);
  const content = `
      <div class="ghostwire-ice-alert band-${band}">
        <header>
          <i class="fa-solid fa-tower-broadcast"></i>
          <span class="gw-ice-kicker">${esc(loc("Alert.Title", data))}</span>
        </header>
        ${lines.map(line => `<p>${esc(line)}</p>`).join("")}
      </div>`;
  ui.notifications.info(loc("Alert.Notify", { ...data, step: crossings[crossings.length - 1] }));
  await ChatMessage.implementation.create({ speaker: { alias: loc("Speaker") }, content });
}

/** Every node's Trace Alert on a Scene's board, as `{ id: alert }`. Read straight off the flag. */
export function alertMapFromScene(scene) {
  const nodes = scene?.getFlag?.(MODULE_ID, "wiredBoard")?.nodes ?? [];
  const map = {};
  for (const node of nodes) map[node?.id] = Math.max(0, Number(node?.alert) || 0);
  return map;
}

/* -------------------------------------------- Foundry: triggers 1 and 2 (the roll) */

/** The board node a Console-verb chat message was fired at, plus its Scene. */
function nodeFromMeta(meta) {
  const scene = meta?.sceneId ? game.scenes.get(meta.sceneId) : null;
  const node = (scene?.getFlag(MODULE_ID, "wiredBoard")?.nodes ?? []).find(n => n?.id === meta?.nodeId) ?? null;
  return { scene, node };
}

/**
 * A resolved Matrix Verb roll — check it against triggers 1 and 2 and raise a card for each that
 * fired. Runs on `createChatMessage` / `updateChatMessage` beside the existing soft-Trace pass.
 *
 * @param {ChatMessage} message
 * @param {object} options
 * @param {number|null} options.total  The Wired Power Roll total off the card.
 * @param {object|null} [options.meta] The `consoleVerb` flag, when the caller already has it.
 */
export async function handleVerbRollBites(message, { total = null, meta = null } = {}) {
  if (!isBiteDirector()) return [];
  const resolved = meta ?? message?.flags?.[MODULE_ID]?.consoleVerb ?? null;
  if (!resolved?.nodeId || !resolved?.actorUuid) return [];
  const roll = rollTotal(total);
  if (roll === null) return [];

  const { scene, node } = nodeFromMeta(resolved);
  if (!node) return [];
  const actor = await fromUuid(resolved.actorUuid);
  if (!actor) return [];
  const state = wiredState(actor);

  const fired = rollTriggers({
    total: roll, dsid: resolved.dsid, track: node.track, rating: node.rating, state,
  });
  const applied = [];
  for (const trigger of fired) {
    const detail = loc(`Detail.${trigger}`, {
      total: roll, node: node.name, rating: node.rating, dc: breachDcForRating(node.rating),
    });
    const result = await confirmAndApplyBite({
      actor, trigger, node, rating: node.rating, state, detail,
      key: biteKey({ trigger, runner: actor.uuid, node: node.id, scope: message?.id ?? "" }),
    });
    if (result) applied.push(result);
  }
  if (applied.length && scene) rerenderNodePanels();
  return applied;
}

/* -------------------------------------------- Foundry: trigger 3 (end of turn) */

/**
 * The runner's hunt host: the highest-Alert node in the hunt band on the board they are running on.
 *
 * Ghostwire does not bind a runner to a host — a Persona is on the board, not in one room — so "this
 * host" is read as "a host on this board whose Alert is hunting". With one hot node, which is the
 * normal case, that is exactly the host the rules mean. With two, the Director gets the hotter one
 * named on the card and can cancel.
 */
export function huntHostFor(nodes = []) {
  const hunting = (Array.isArray(nodes) ? nodes : [])
    .filter(node => (Number(node?.track) === 2) && huntBiteFires({ alert: node?.alert, state: "jackedIn" }));
  if (!hunting.length) return null;
  return hunting.sort((a, b) => (Number(b.alert) || 0) - (Number(a.alert) || 0))[0];
}

/**
 * End of a runner's turn: if they are still Overlay or Jacked In and a host on their board is at
 * Alert 9–11, offer the hunt bite. Once per turn per host — that is what `scope` is for.
 */
export async function handleTurnEndHuntBite(combat, prior) {
  if (!isBiteDirector() || !prior?.combatantId) return null;
  const combatant = combat?.combatants?.get?.(prior.combatantId);
  const actor = combatant?.actor ?? null;
  if (!actor) return null;
  const state = wiredState(actor);
  if (!exposedToBite(state)) return null;

  const scene = huntBoardScene(combat);
  const nodes = scene?.getFlag(MODULE_ID, "wiredBoard")?.nodes ?? [];
  const node = huntHostFor(nodes);
  if (!node) return null;

  const detail = loc("Detail.hunt-bite", { node: node.name, alert: node.alert, actor: actor.name });
  return confirmAndApplyBite({
    actor, trigger: "hunt-bite", node, rating: node.rating, state, detail,
    key: biteKey({
      trigger: "hunt-bite", runner: actor.uuid, node: node.id,
      scope: `${combat?.id ?? ""}:${prior?.round ?? 0}:${prior?.turn ?? 0}`,
    }),
  });
}

/**
 * The board the combat is being fought over: the combat's own Scene, or — when that Scene is a Wired
 * map for another — the board Scene behind it. The same hop `boardScene` makes for the Console.
 */
function huntBoardScene(combat) {
  const scene = combat?.scene ?? game.scenes.viewed ?? null;
  const mapFor = scene?.getFlag?.(MODULE_ID, "wiredMapFor");
  return ((mapFor && (mapFor !== scene?.id)) ? game.scenes.get(mapFor) : null) ?? scene;
}

/* -------------------------------------------- Foundry: trigger 4 (the button) */

/**
 * The Director's Malice ICE surge, from the node applet.
 *
 * **Malice is not spent for you.** Draw Steel keeps Malice in a world setting with no spend helper —
 * only `game.settings.set`, which is a bare write with no accounting behind it — so Ghostwire reads
 * the pool, prints it on the card and in chat, and leaves the Director's own tracker alone. Wiring a
 * silent debit to a resource the Director is already managing by hand is the same class of mistake
 * as a silent Stamina write.
 *
 * @param {object} options
 * @param {Actor} options.actor  The target. The default is the compiler; the caller picks.
 * @param {object} [options.node]
 */
export async function maliceIceSurge({ actor, node = null } = {}) {
  if (!isBiteDirector()) {
    ui.notifications.warn(game.i18n.localize("GHOSTWIRE.Biofeedback.Director.GMOnly"));
    return null;
  }
  if (!actor) {
    ui.notifications.warn(loc("Surge.NoTarget"));
    return null;
  }
  const state = wiredState(actor);
  if (!maliceSurgeFires({ state })) {
    ui.notifications.warn(loc("Surge.NotExposed", {
      actor: actor.name,
      state: game.i18n.localize(`GHOSTWIRE.Biofeedback.Director.States.${state}`),
    }));
    return null;
  }
  const malice = currentMalice();
  const detail = (malice === null)
    ? loc("Surge.Detail", { node: node?.name ?? "" })
    : loc("Surge.DetailMalice", { node: node?.name ?? "", malice });
  const result = await confirmAndApplyBite({
    actor, trigger: "malice-surge", node, rating: node?.rating ?? null, state, detail,
  });
  if (!result) return null;
  await ChatMessage.implementation.create({
    speaker: { alias: loc("Speaker") },
    content: `<div class="ghostwire-ice-alert band-hunting">
        <header><i class="fa-solid fa-skull"></i><span class="gw-ice-kicker">${esc(loc("Surge.ChatTitle"))}</span></header>
        <p>${esc(loc("Surge.ChatLine", { actor: actor.name, node: node?.name ?? "" }))}</p>
        <p class="hint">${esc(malice === null ? loc("Surge.ChatTrackHint") : loc("Surge.ChatTrackHintMalice", { malice }))}</p>
      </div>`,
  });
  return result;
}

/* -------------------------------------------- registration */

function rerenderNodePanels() {
  for (const [, app] of foundry.applications.instances) {
    if (app?.rendered && app.options?.classes?.includes?.("ghostwire-wired-node-panel")) app.render();
  }
}

/**
 * Hook the applet's ICE package onto the seams that already exist. Call during init.
 *
 * Nothing here opens a second dice system, a second Alert track or a second Stamina path: the roll
 * bites read the Console's own `consoleVerb` chat flag, the Alert crossings read the Scene board
 * flag the Console writes, and every apply ends in `directorApplyBiofeedback`.
 *
 * @param {object} [deps]
 * @param {(actor: Actor) => string} [deps.getWiredState]
 * @param {(message: ChatMessage) => number|null} [deps.rollTotalFromMessage]
 */
export function registerWiredIce({ getWiredState = null, rollTotalFromMessage = null } = {}) {
  if (typeof getWiredState === "function") readWiredState = getWiredState;
  const totalOf = typeof rollTotalFromMessage === "function" ? rollTotalFromMessage : (() => null);

  const onVerbMessage = message => {
    const total = rollTotal(totalOf(message));
    if (total === null) return;
    handleVerbRollBites(message, { total })
      .catch(err => console.warn(`${MODULE_ID} | ICE roll bite`, err));
  };
  Hooks.on("createChatMessage", onVerbMessage);
  Hooks.on("updateChatMessage", onVerbMessage);

  // Trigger 3. `combatTurnChange` hands us the turn that just *ended* as `prior`, which is exactly
  // the RAW's "at the end of each of the runner's turns".
  Hooks.on("combatTurnChange", (combat, prior) => {
    handleTurnEndHuntBite(combat, prior).catch(err => console.warn(`${MODULE_ID} | ICE hunt bite`, err));
  });

  // The Alert strip. preUpdateScene still sees the old board, so it stashes the before-picture and
  // updateScene compares — the same two-step every "what changed" hook in Foundry uses.
  Hooks.on("preUpdateScene", (scene, changes, options) => {
    if (!foundry.utils.hasProperty(changes, `flags.${MODULE_ID}.wiredBoard`)) return;
    options.ghostwireAlertBefore = alertMapFromScene(scene);
  });
  Hooks.on("updateScene", (scene, changes, options) => {
    if (!isBiteDirector() || !options?.ghostwireAlertBefore) return;
    const after = alertMapFromScene(scene);
    const nodes = scene.getFlag(MODULE_ID, "wiredBoard")?.nodes ?? [];
    for (const node of nodes) {
      const crossings = alertCrossings(options.ghostwireAlertBefore[node.id] ?? 0, after[node.id] ?? 0);
      if (crossings.length) {
        announceAlertCrossings(node, crossings, { scene })
          .catch(err => console.warn(`${MODULE_ID} | Alert announce`, err));
      }
    }
  });

  Hooks.once("ready", () => {
    const module = game.modules.get(MODULE_ID);
    if (module) {
      module.api = {
        ...(module.api ?? {}),
        confirmBite, confirmAndApplyBite, maliceIceSurge, rollTriggers, huntBiteFires,
        alertCrossings, WIRE_RUN_CHECKLIST,
      };
    }
  });

  console.log(`${MODULE_ID} | Wired ICE package registered (${ICE_TRIGGERS.join(" · ")}; Alert announces ${ALERT_ANNOUNCE_STEPS.join(" / ")}; confirm before apply)`);
}

export { BIOFEEDBACK_BY_RATING, ICE_TRIGGERS };
