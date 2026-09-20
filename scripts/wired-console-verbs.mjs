// B117 Matrix Verbs — Foundry-free helpers (Node smoke can import this).
// All nine fire from the node-facing applet (Director Console shares the strip).
// Player path: open the node facing you → Connect if needed → fire verbs from your actor.
// Soft Trace: +1 on tier 1 for active rolled verbs. Scan is observation — no auto Trace.
// Broadcast / Toggle have no power roll.

import {
  CONSOLE_SLICE_DSIDS,
  CONSOLE_SLICE_VERB_IDS,
  CONNECTION_VERB_DSIDS,
  MODULE_ID,
  verbUuid,
} from "./wired-verbs.mjs";

export const ALERT_MAX = 12;

/**
 * All nine Matrix Verbs as the node panel and Console fire them.
 * characteristic is the Draw Steel key on the verb card (null = no power roll).
 * needsNode: connection verbs can fire without a selected node (Console roster);
 *   action verbs need the node the runner is facing.
 * softTraceOnTier1 follows shipped cards + Scan doctrine (no Trace on clean observation).
 */
export const CONSOLE_SLICE = [
  {
    dsid: "matrix-connect",
    id: CONSOLE_SLICE_VERB_IDS[0],
    uuid: verbUuid(CONSOLE_SLICE_VERB_IDS[0]),
    characteristic: "intuition",
    characteristicLabel: "Instinct",
    softTraceOnTier1: true,
    needsNode: false,
    icon: "fa-plug",
    lang: "Connect",
  },
  {
    dsid: "matrix-jack-out",
    id: CONSOLE_SLICE_VERB_IDS[1],
    uuid: verbUuid(CONSOLE_SLICE_VERB_IDS[1]),
    characteristic: "intuition",
    characteristicLabel: "Instinct",
    softTraceOnTier1: true,
    needsNode: false,
    icon: "fa-right-from-bracket",
    lang: "JackOut",
  },
  {
    dsid: "matrix-toggle-connection-state",
    id: CONSOLE_SLICE_VERB_IDS[2],
    uuid: verbUuid(CONSOLE_SLICE_VERB_IDS[2]),
    characteristic: null,
    characteristicLabel: null,
    softTraceOnTier1: false,
    needsNode: false,
    icon: "fa-shuffle",
    lang: "ToggleConnectionState",
  },
  {
    dsid: "matrix-scan",
    id: CONSOLE_SLICE_VERB_IDS[3],
    uuid: verbUuid(CONSOLE_SLICE_VERB_IDS[3]),
    characteristic: "intuition",
    characteristicLabel: "Instinct",
    softTraceOnTier1: false,
    needsNode: true,
    icon: "fa-magnifying-glass",
    lang: "Scan",
  },
  {
    dsid: "matrix-navigate",
    id: CONSOLE_SLICE_VERB_IDS[4],
    uuid: verbUuid(CONSOLE_SLICE_VERB_IDS[4]),
    characteristic: "intuition",
    characteristicLabel: "Instinct",
    softTraceOnTier1: true,
    needsNode: true,
    icon: "fa-route",
    lang: "Navigate",
  },
  {
    dsid: "matrix-ping",
    id: CONSOLE_SLICE_VERB_IDS[5],
    uuid: verbUuid(CONSOLE_SLICE_VERB_IDS[5]),
    characteristic: "reason",
    characteristicLabel: "Logic",
    softTraceOnTier1: true,
    needsNode: true,
    icon: "fa-tower-broadcast",
    lang: "Ping",
  },
  {
    dsid: "matrix-broadcast",
    id: CONSOLE_SLICE_VERB_IDS[6],
    uuid: verbUuid(CONSOLE_SLICE_VERB_IDS[6]),
    characteristic: null,
    characteristicLabel: null,
    softTraceOnTier1: false,
    needsNode: true,
    icon: "fa-comments",
    lang: "Broadcast",
  },
  {
    dsid: "matrix-search",
    id: CONSOLE_SLICE_VERB_IDS[7],
    uuid: verbUuid(CONSOLE_SLICE_VERB_IDS[7]),
    characteristic: "reason",
    characteristicLabel: "Logic",
    softTraceOnTier1: true,
    needsNode: true,
    icon: "fa-file-lines",
    lang: "Search",
  },
  {
    dsid: "matrix-read-write",
    id: CONSOLE_SLICE_VERB_IDS[8],
    uuid: verbUuid(CONSOLE_SLICE_VERB_IDS[8]),
    characteristic: "reason",
    characteristicLabel: "Logic",
    softTraceOnTier1: true,
    needsNode: true,
    icon: "fa-pen-to-square",
    lang: "ReadWrite",
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
 * owned actor so Connect on this applet can run.
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

const MODULE_FLAG = "draw-steel-ghostwire";
const CONNECT_ROLES = new Set(["deck", "rcc", "interface"]);

function actorItems(actor) {
  const items = actor?.items;
  if (!items) return [];
  if (Array.isArray(items)) return items;
  if (typeof items[Symbol.iterator] === "function") return [...items];
  return [];
}

export function actorClassDsid(actor) {
  return actor?.system?.class?.system?._dsid
    ?? actor?.classDsid
    ?? actorItems(actor).find(item => item.type === "class")?.system?._dsid
    ?? null;
}

/** Tagged `flags.draw-steel-ghostwire.wired.connectInterface`, or a matrix deck / RCC / interface. */
export function itemIsConnectInterface(item) {
  const gw = item?.flags?.[MODULE_FLAG] ?? {};
  if (gw.wired?.connectInterface === true) return true;
  return CONNECT_ROLES.has(gw.matrix?.role);
}

/**
 * Connect (and thus the rest of the applet) needs a Wire interface:
 * tagged comms / deck / RCC / chrome / kit, or Technomancer class (deckless Resonance).
 */
export function actorHasConnectInterface(actor) {
  if (actorClassDsid(actor) === "technomancer") return true;
  return actorItems(actor).some(itemIsConnectInterface);
}

/**
 * @returns {{ ok: boolean, reason: string|null }}
 * reason is a GHOSTWIRE.WiredConsole.VerbNeed* key suffix
 * (Actor / Node / Owner / Hidden / Disconnected / AlreadyConnected / Interface).
 * Pass dsid for per-verb rules (Connect while disconnected; action verbs need a node).
 * hasInterface defaults true so older callers stay permissive; production always passes the live actor check.
 */
export function consoleVerbGate({ actorUuid, connected, nodeId, owned, revealed = true, isGM = true, dsid = null, hasInterface = true } = {}) {
  if (!actorUuid) return { ok: false, reason: "Actor" };
  if (!owned) return { ok: false, reason: "Owner" };
  const spec = dsid ? consoleSliceByDsid(dsid) : null;
  const needsNode = spec ? spec.needsNode !== false : true;
  if (needsNode && !nodeId) return { ok: false, reason: "Node" };
  if (nodeId && !isGM && !revealed) return { ok: false, reason: "Hidden" };
  if (dsid === "matrix-connect") {
    if (connected) return { ok: false, reason: "AlreadyConnected" };
    if (!hasInterface) return { ok: false, reason: "Interface" };
    return { ok: true, reason: null };
  }
  if (!connected) return { ok: false, reason: "Disconnected" };
  return { ok: true, reason: null };
}

/** Hint dsid: Connect when disconnected, else Scan (an action verb that needs a node). */
export function hintVerbDsid(connected) {
  return connected ? "matrix-scan" : "matrix-connect";
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

export { CONSOLE_SLICE_DSIDS, CONNECTION_VERB_DSIDS };
