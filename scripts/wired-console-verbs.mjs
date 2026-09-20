// B117 Matrix Verbs — Foundry-free helpers (Node smoke can import this).
// All nine fire from the node-facing applet (Director Console shares the strip).
// Player path: open the node facing you → Connect if needed → fire verbs from your actor.
// Soft Trace: +1 on tier 1 for active rolled verbs. Scan is observation — no auto Trace.
// Broadcast / Toggle have no power roll.

import {
  CONSOLE_SLICE_DSIDS,
  CONSOLE_SLICE_VERB_IDS,
  CONNECTION_VERB_DSIDS,
  MATRIX_VERB_DSIDS,
  MODULE_ID,
  WIRE_KIT_DSID,
  verbUuid,
} from "./wired-verbs.mjs";
import {
  isOnNet,
  resolveWiredState,
  verbAllowedAtState,
} from "./wired-state.mjs";

export const ALERT_MAX = 12;

/** Flag on a Matrix Verb Item embedded only so AbilityModel#use / chat can resolve it. */
export const TEMP_CONSOLE_VERB_FLAG = "temporaryConsoleVerb";

/** Draw Steel 1.1.2 ActorSheet `_prepareAbilitiesContext` skips items with this flag. */
export const DS_SYSTEM_ID = "draw-steel";
export const DS_HIDE_IN_SHEET = "hideInSheet";

/**
 * Foundry `getFlag` requires a non-empty string scope.
 * Array.filter/map pass `(element, index)` so a default param never runs — index `0`
 * became Flag scope "0". Ignore anything that is not a non-empty string.
 */
function flagScope(scope, fallback) {
  return typeof scope === "string" && scope ? scope : fallback;
}

export function isTemporaryConsoleVerb(item, moduleId) {
  const scope = flagScope(moduleId, MODULE_ID);
  if (typeof item?.getFlag === "function") return !!item.getFlag(scope, TEMP_CONSOLE_VERB_FLAG);
  return !!item?.flags?.[scope]?.[TEMP_CONSOLE_VERB_FLAG];
}

/** B117: all nine Matrix Verbs stay off hero/NPC sheets (permanent leftover or temp embed). */
export function isOffSheetMatrixVerb(item, moduleId) {
  const dsid = item?.system?._dsid ?? item?.item?.system?._dsid;
  return MATRIX_VERB_DSIDS.includes(dsid) || isTemporaryConsoleVerb(item, moduleId);
}

/**
 * Stamp DS `hideInSheet` so `_prepareAbilitiesContext` never lists the temp.
 * Chat still `fromUuidSync(abilityUuid)` against the embed.
 */
export function applyHideInSheetFlag(data, systemId) {
  const scope = flagScope(systemId, DS_SYSTEM_ID);
  const next = data && typeof data === "object" ? data : {};
  next.flags = { ...(next.flags ?? {}) };
  next.flags[scope] = { ...(next.flags[scope] ?? {}), [DS_HIDE_IN_SHEET]: true };
  return next;
}

export function hasHideInSheetFlag(item, systemId) {
  const scope = flagScope(systemId, DS_SYSTEM_ID);
  if (typeof item?.getFlag === "function") return !!item.getFlag(scope, DS_HIDE_IN_SHEET);
  return !!item?.flags?.[scope]?.[DS_HIDE_IN_SHEET];
}

function iterableItems(items) {
  if (!items) return [];
  if (Array.isArray(items)) return items;
  if (typeof items[Symbol.iterator] === "function") return [...items];
  return [];
}

/** Temps for this verb dsid. Chat `abilityUse.abilityUuid` may still point at one. */
export function leftoverTemporaryVerbs(items, dsid, isTemp = isTemporaryConsoleVerb) {
  return iterableItems(items).filter(item => item.system?._dsid === dsid && isTemp(item));
}

/**
 * Keep one leftover (stable uuid for Draw Steel chat). Return extras to delete.
 * @returns {{ keep: object|null, extras: object[] }}
 */
export function splitReusableTemporaryVerbs(items, dsid, isTemp = isTemporaryConsoleVerb) {
  const leftover = leftoverTemporaryVerbs(items, dsid, isTemp);
  return { keep: leftover[0] ?? null, extras: leftover.slice(1) };
}

/**
 * Draw Steel 1.1.2 AbilityUsePart / AbilityResultPart store `abilityUuid` and later
 * `fromUuidSync` it for `toEmbed` and `powerRollText` (tier display strings). Deleting
 * the embed as soon as `use()` returns yields "Failed to Find Item for this ability roll"
 * and no Search (etc.) flavor. Drop a temp only if this call created it and no chat card
 * captured its uuid. Leftovers are reused on the next fire and stripped on ready (B117).
 */
export function shouldReleaseTemporaryVerb({ created = false, hasChatCard = false } = {}) {
  return !!created && !hasChatCard;
}

/**
 * Stamp compendium source data as a temporary embedded verb.
 * Drops `_id` so Foundry assigns a new id (no collision with a leftover temp).
 */
export function markTemporaryConsoleVerbData(data, moduleId) {
  const scope = flagScope(moduleId, MODULE_ID);
  const next = JSON.parse(JSON.stringify(data ?? {}));
  delete next._id;
  delete next.folder;
  next.flags = { ...(next.flags ?? {}) };
  next.flags[scope] = { ...(next.flags[scope] ?? {}), [TEMP_CONSOLE_VERB_FLAG]: true };
  return applyHideInSheetFlag(next);
}

/**
 * Draw Steel 1.1.2 ability rows use `data-document-uuid`, not `data-item-id`.
 * Keep the older selectors so a custom sheet still matches.
 */
export function offSheetVerbDomSelectors(item) {
  const id = item?.id ?? item?._id ?? "";
  const uuid = item?.uuid ?? "";
  const selectors = [];
  if (id) {
    selectors.push(
      `[data-item-id="${id}"]`,
      `[data-entry-id="${id}"]`,
      `[data-document-id="${id}"]`,
      `[data-ability-id="${id}"]`,
    );
  }
  if (uuid) {
    selectors.push(`[data-document-uuid="${uuid}"]`, `[data-uuid="${uuid}"]`);
  }
  return selectors;
}

export function abilityUuidsFromMessages(messages = []) {
  const uuids = new Set();
  for (const message of messages) {
    for (const part of partsOf(message)) {
      if (part?.abilityUuid) uuids.add(part.abilityUuid);
    }
  }
  return uuids;
}

/** Temps whose uuid is not on a live chat card can be deleted on ready. */
export function orphanTemporaryVerbs(items, keepUuids, isTemp = isTemporaryConsoleVerb) {
  const keep = keepUuids instanceof Set ? keepUuids : new Set(keepUuids ?? []);
  return iterableItems(items).filter(item => {
    if (!isTemp(item)) return false;
    const uuid = item?.uuid;
    if (!uuid) return true;
    return !keep.has(uuid);
  });
}

/**
 * Drop Matrix Verbs from a Draw Steel `_prepareAbilitiesContext` result.
 * Play-mode empty groups (no Add) are removed so Ping cannot leave a blank Maneuver header.
 */
export function filterOffSheetAbilitiesContext(context) {
  if (!context || typeof context !== "object") return context;
  const next = { ...context };
  for (const [key, group] of Object.entries(next)) {
    if (!Array.isArray(group?.abilities)) continue;
    const abilities = group.abilities.filter(row => !isOffSheetMatrixVerb(row?.item ?? row));
    if (!abilities.length && group.showAdd !== true) {
      delete next[key];
      continue;
    }
    next[key] = { ...group, abilities };
  }
  return next;
}

export function compareConsoleNames(a, b, lang) {
  return String(a ?? "").localeCompare(String(b ?? ""), lang, { sensitivity: "base" });
}

/** Revealed node Actors (or board nodes) sort above everyone else, then A–Z by name. */
export function compareConsoleListRows(a = {}, b = {}, { lang } = {}) {
  const rank = row => (row.isNode && row.revealed) ? 0 : 1;
  const delta = rank(a) - rank(b);
  if (delta) return delta;
  return compareConsoleNames(a.name, b.name, lang);
}

export function sortConsoleNodes(nodes = [], { lang } = {}) {
  const list = Array.isArray(nodes) ? nodes : [];
  return list.sort((a, b) => compareConsoleListRows(
    { name: a?.name, isNode: true, revealed: !!a?.revealed },
    { name: b?.name, isNode: true, revealed: !!b?.revealed },
    { lang },
  ));
}

export function sortConsoleRoster(roster = [], { lang } = {}) {
  const list = Array.isArray(roster) ? roster : [];
  return list.sort((a, b) => compareConsoleListRows(a, b, { lang }));
}

/**
 * Draw Steel 1.1.2 AbilityModel#use merges `messageOptions.data` into the chat message.
 * Top-level `messageOptions.flags` is a create-operation option and does not land on the card.
 */
export function verbUseMessageOptions(consoleVerb, moduleId = MODULE_ID) {
  return { data: { flags: { [moduleId]: { consoleVerb } } } };
}

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

/**
 * Connections chip for one token. Wire node Actors (`kind: "node"`) are infrastructure:
 * always show Connected, never Disconnected, and are not verb runners.
 */
export function consoleRosterWireState({ isNode = false, runnerState = "disconnected" } = {}) {
  if (isNode) return { state: "connected", connected: true, verbSelectable: false };
  const state = runnerState || "disconnected";
  return { state, connected: state !== "disconnected", verbSelectable: true };
}

/** Runners only — skip Wire node Actors even if their chip reads Connected. */
export function consoleVerbRoster(roster = []) {
  return (Array.isArray(roster) ? roster : []).filter(row => row.verbSelectable !== false && !row.isNode);
}

/** Keep a live runner selection if it's still on the roster; else combatant; else first Connected runner; else first runner. */
export function pickConsoleActor({ roster = [], selectedUuid = null, combatantUuid = null } = {}) {
  const pool = consoleVerbRoster(roster);
  const has = uuid => !!uuid && pool.some(row => row.uuid === uuid);
  if (has(selectedUuid)) return selectedUuid;
  if (has(combatantUuid)) return combatantUuid;
  const connected = pool.find(row => row.connected);
  return connected?.uuid ?? pool[0]?.uuid ?? null;
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

/**
 * Tagged `flags.draw-steel-ghostwire.wired.connectInterface`, Wire Kit
 * (`kind: "wire-kit"` / `_dsid` wire-kit-matrix-verbs), or a matrix deck / RCC / interface.
 * Wire Kit alone is the Director stamp path — do not also require an RCC role on drones.
 */
export function itemIsConnectInterface(item) {
  const gw = item?.flags?.[MODULE_FLAG] ?? {};
  const kind = gw.kind ?? item?.getFlag?.(MODULE_FLAG, "kind");
  const wired = gw.wired ?? item?.getFlag?.(MODULE_FLAG, "wired");
  const dsid = item?.system?._dsid ?? gw.dsid;
  if (wired?.connectInterface === true) return true;
  if (kind === "wire-kit" || dsid === WIRE_KIT_DSID) return true;
  const role = gw.matrix?.role ?? item?.getFlag?.(MODULE_FLAG, "matrix")?.role;
  return CONNECT_ROLES.has(role);
}

/**
 * Connect (and thus the rest of the applet) needs a Wire interface:
 * tagged comms / deck / RCC / chrome / Wire Kit, or Technomancer class (deckless Resonance).
 */
export function actorHasConnectInterface(actor) {
  if (actorClassDsid(actor) === "technomancer") return true;
  return actorItems(actor).some(itemIsConnectInterface);
}

/**
 * @returns {{ ok: boolean, reason: string|null }}
 * reason is a GHOSTWIRE.WiredConsole.VerbNeed* key suffix
 * (Actor / Node / Owner / Hidden / Disconnected / AlreadyConnected / Interface / Immersion).
 * Pass dsid for per-verb rules (Connect while disconnected; action verbs need a node).
 * Pass `state` (preferred). Legacy `connected: true` without state = Overlay (full Connected).
 * hasInterface defaults true so older callers stay permissive; production always passes the live actor check.
 */
export function consoleVerbGate({ actorUuid, connected, state, nodeId, owned, revealed = true, isGM = true, dsid = null, hasInterface = true } = {}) {
  if (!actorUuid) return { ok: false, reason: "Actor" };
  if (!owned) return { ok: false, reason: "Owner" };
  const spec = dsid ? consoleSliceByDsid(dsid) : null;
  const needsNode = spec ? spec.needsNode !== false : true;
  if (needsNode && !nodeId) return { ok: false, reason: "Node" };
  if (nodeId && !isGM && !revealed) return { ok: false, reason: "Hidden" };
  const resolved = resolveWiredState({ state, connected });
  if (dsid === "matrix-connect") {
    if (isOnNet(resolved)) return { ok: false, reason: "AlreadyConnected" };
    if (!hasInterface) return { ok: false, reason: "Interface" };
    return { ok: true, reason: null };
  }
  if (!isOnNet(resolved)) return { ok: false, reason: "Disconnected" };
  if (dsid && !verbAllowedAtState(dsid, resolved)) return { ok: false, reason: "Immersion" };
  return { ok: true, reason: null };
}

/**
 * Hint dsid: Connect when disconnected; Toggle when Linked (step deeper to Scan);
 * Scan once Overlay / Jacked In. Accepts a boolean (legacy) or a state string.
 */
export function hintVerbDsid(connectedOrState) {
  const state = typeof connectedOrState === "string"
    ? connectedOrState
    : (connectedOrState ? "overlay" : "disconnected");
  if (state === "disconnected") return "matrix-connect";
  if (state === "linked") return "matrix-toggle-connection-state";
  return "matrix-scan";
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
