// B106 Wire ping/spoof: last ~20 Director pings on a Scene.
// Flag: flags.draw-steel-ghostwire.wiredPings = { entries: Ping[], updated }
// Also reads wiredBoard.pings if an older client nested them there.
// Pure helpers so Node smoke can import this file without Foundry.

export const PING_CAP = 20;
export const PING_MAX_LENGTH = 240;

/** @typedef {{ id: string, text: string, whisper: boolean, at: number, user: string }} WirePing */

const asText = value => String(value ?? "").replace(/\s+/g, " ").trim();

/** Clamp ping text. Empty after trim is "". */
export function clampPingText(value) {
  return asText(value).slice(0, PING_MAX_LENGTH);
}

/** Normalize one stored ping. Returns null if it has no text. */
export function normalizePing(raw, idFactory = () => "") {
  if (!raw || typeof raw !== "object") return null;
  const text = clampPingText(raw.text);
  if (!text) return null;
  const at = Number(raw.at);
  return {
    id: (typeof raw.id === "string" && raw.id) ? raw.id : idFactory(),
    text,
    whisper: !!raw.whisper,
    at: Number.isFinite(at) ? at : 0,
    user: asText(raw.user).slice(0, 80),
  };
}

/** Keep insertion order, drop empties, cap at PING_CAP (oldest first, newest last). */
export function normalizePings(raw, idFactory = () => "") {
  const list = Array.isArray(raw) ? raw : [];
  return list.map(entry => normalizePing(entry, idFactory)).filter(Boolean).slice(-PING_CAP);
}

/** Append one ping and cap. Does not mutate `pings`. */
export function appendPing(pings, ping, idFactory = () => "") {
  const next = normalizePing(ping, idFactory);
  if (!next) return normalizePings(pings, idFactory);
  return [...normalizePings(pings, idFactory), next].slice(-PING_CAP);
}

/**
 * Read pings from a Scene-like object (Foundry Scene or a plain flags bag).
 * Accepts wiredPings (preferred) or wiredBoard.pings.
 */
export function readPings(scene) {
  const flags = scene?.flags?.["draw-steel-ghostwire"]
    ?? (typeof scene?.getFlag === "function" ? null : scene?.flags);
  const fromGet = (key) => (typeof scene?.getFlag === "function") ? scene.getFlag("draw-steel-ghostwire", key) : undefined;
  const wiredPings = fromGet("wiredPings") ?? flags?.wiredPings;
  const board = fromGet("wiredBoard") ?? flags?.wiredBoard;
  const raw = Array.isArray(wiredPings) ? wiredPings
    : (Array.isArray(wiredPings?.entries) ? wiredPings.entries
      : (Array.isArray(board?.pings) ? board.pings : []));
  return normalizePings(raw);
}

/**
 * Users who should receive a whispered Wire ping: GMs, plus owners of Overlay / Jacked In tokens.
 * `getWiredState(actor)` returns "disconnected" | "overlay" | "jackedIn".
 * @param {{ users: Iterable<{ id: string, isGM?: boolean }>, tokens: Iterable<{ actor?: object }>, getWiredState: Function, canOwn?: Function }} ctx
 */
export function whisperRecipientIds({ users, tokens, getWiredState, canOwn }) {
  const ids = new Set();
  for (const user of users ?? []) {
    if (user?.isGM && user.id) ids.add(user.id);
  }
  for (const token of tokens ?? []) {
    const actor = token?.actor;
    if (!actor) continue;
    const state = getWiredState?.(actor) ?? "disconnected";
    if (state !== "overlay" && state !== "jackedIn") continue;
    for (const user of users ?? []) {
      if (!user?.id || user.isGM) continue;
      const owns = canOwn ? canOwn(actor, user) : false;
      if (owns) ids.add(user.id);
    }
  }
  return [...ids];
}
