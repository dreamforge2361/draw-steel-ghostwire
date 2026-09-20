// B117 Matrix Verbs — Foundry-free helpers (Node smoke can import this).
// Thin slice: Scan / Ping / Navigate. Broadcast / Search / Read-Write stay later.
// Player path: Connect on the sheet, then fire verbs from the node facing them.
// Director Console still has the same strip (shared gate + fire). Soft Trace: +1 on
// tier 1 for active verbs. Scan is observation — no auto Trace.

import {
  CONSOLE_SLICE_DSIDS,
  CONSOLE_SLICE_VERB_IDS,
  MODULE_ID,
  verbUuid,
} from "./wired-verbs.mjs";

export const ALERT_MAX = 12;

/**
 * Scan / Ping / Navigate as the node panel and Console fire them.
 * characteristic is the Draw Steel key on the verb card (Instinct/Logic in Ghostwire lang).
 * softTraceOnTier1 follows shipped cards + Scan doctrine (no Trace on clean observation).
 */
export const CONSOLE_SLICE = [
  {
    dsid: "matrix-scan",
    id: CONSOLE_SLICE_VERB_IDS[0],
    uuid: verbUuid(CONSOLE_SLICE_VERB_IDS[0]),
    characteristic: "intuition",
    characteristicLabel: "Instinct",
    softTraceOnTier1: false,
    icon: "fa-magnifying-glass",
    lang: "Scan",
  },
  {
    dsid: "matrix-ping",
    id: CONSOLE_SLICE_VERB_IDS[1],
    uuid: verbUuid(CONSOLE_SLICE_VERB_IDS[1]),
    characteristic: "reason",
    characteristicLabel: "Logic",
    softTraceOnTier1: true,
    icon: "fa-tower-broadcast",
    lang: "Ping",
  },
  {
    dsid: "matrix-navigate",
    id: CONSOLE_SLICE_VERB_IDS[2],
    uuid: verbUuid(CONSOLE_SLICE_VERB_IDS[2]),
    characteristic: "intuition",
    characteristicLabel: "Instinct",
    softTraceOnTier1: true,
    icon: "fa-route",
    lang: "Navigate",
  },
];

export const consoleSliceByDsid = dsid => CONSOLE_SLICE.find(verb => verb.dsid === dsid) ?? null;

/** Keep a live selection if it's still on the roster; else combatant; else first Connected; else first row. */
export function pickConsoleActor({ roster = [], selectedUuid = null, combatantUuid = null } = {}) {
  const rows = Array.isArray(roster) ? roster : [];
  const has = uuid => !!uuid && rows.some(row => row.uuid === uuid);
  if (has(selectedUuid)) return selectedUuid;
  if (has(combatantUuid)) return combatantUuid;
  const connected = rows.find(row => row.connected);
  return connected?.uuid ?? rows[0]?.uuid ?? null;
}

/**
 * Player node panel: prefer the controlled Connected runner, else the assigned character
 * if Connected, else the first Connected owned candidate. Falls back to a disconnected
 * owned actor so the UI can say “use Connect on the sheet.”
 */
export function pickPlayerVerbActor({ candidates = [], controlledUuid = null, characterUuid = null } = {}) {
  const rows = (Array.isArray(candidates) ? candidates : []).filter(row => row.owned !== false);
  const connected = rows.filter(row => row.connected);
  const has = (uuid, list) => !!uuid && list.some(row => row.uuid === uuid);
  if (has(controlledUuid, connected)) return controlledUuid;
  if (has(characterUuid, connected)) return characterUuid;
  if (connected[0]) return connected[0].uuid;
  if (has(controlledUuid, rows)) return controlledUuid;
  if (has(characterUuid, rows)) return characterUuid;
  return rows[0]?.uuid ?? null;
}

/**
 * @returns {{ ok: boolean, reason: string|null }}
 * reason is a GHOSTWIRE.WiredConsole.VerbNeed* key suffix (Actor / Node / Owner / Hidden / Disconnected).
 * revealed/isGM default so existing Console callers stay Actor/Owner/Node/Disconnected.
 */
export function consoleVerbGate({ actorUuid, connected, nodeId, owned, revealed = true, isGM = true } = {}) {
  if (!actorUuid) return { ok: false, reason: "Actor" };
  if (!owned) return { ok: false, reason: "Owner" };
  if (!nodeId) return { ok: false, reason: "Node" };
  if (!isGM && !revealed) return { ok: false, reason: "Hidden" };
  if (!connected) return { ok: false, reason: "Disconnected" };
  return { ok: true, reason: null };
}

/** +1 Trace on tier 1 for verbs whose shipped card is an active intrusion; Scan stays 0. */
export function softTraceDelta(dsid, tier) {
  if (Number(tier) !== 1) return 0;
  return consoleSliceByDsid(dsid)?.softTraceOnTier1 ? 1 : 0;
}

export function nextAlert(alert, delta, max = ALERT_MAX) {
  const current = Math.min(max, Math.max(0, Number(alert) || 0));
  const next = Math.min(max, Math.max(0, current + (Number(delta) || 0)));
  return { alert: next, lockout: next === max && current < max };
}

function partsOf(message) {
  const parts = message?.system?.parts;
  if (!parts) return [];
  return Array.isArray(parts) ? parts : (parts.contents ?? Object.values(parts));
}

const partType = part => part?.type ?? part?.constructor?.TYPE;

/**
 * Draw Steel ability chat: abilityUse names the item; abilityResult carries the power-roll tier (1/2/3).
 * Returns null when the roll has not resolved yet.
 */
export function abilityTierFromMessage(message) {
  const parts = partsOf(message);
  const results = parts.filter(part => partType(part) === "abilityResult").map(part => Number(part.tier)).filter(n => n >= 1 && n <= 3);
  if (results.length) return Math.min(...results);
  const flagged = Number(message?.flags?.[MODULE_ID]?.consoleVerb?.tier);
  if (flagged >= 1 && flagged <= 3) return flagged;
  return null;
}

export function consoleVerbMetaFromMessage(message) {
  return message?.flags?.[MODULE_ID]?.consoleVerb
    ?? message?.getFlag?.(MODULE_ID, "consoleVerb")
    ?? null;
}
