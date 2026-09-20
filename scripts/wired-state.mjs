// Wired connection states — Foundry-free helpers (Node smoke can import this).
// Lock 2026-09-20: Disconnected | Linked | Overlay | Jacked In.
// Connect lands in Linked. Toggle steps deeper then wraps. Jack Out → Disconnected.

export const WIRED_STATES = Object.freeze(["disconnected", "linked", "overlay", "jackedIn"]);

/** On-net / Connected-family. Soft presence counts. */
export const ON_NET_STATES = Object.freeze(["linked", "overlay", "jackedIn"]);

/** Full Connected: Scan / Navigate / Ping / Search / Read-Write / Programs / payload Runs. */
export const FULLY_CONNECTED_STATES = Object.freeze(["overlay", "jackedIn"]);

/** Toggle ladder: each use steps one rung deeper, then wraps. Jack Out is the only off-ramp. */
export const TOGGLE_LADDER = Object.freeze(["linked", "overlay", "jackedIn"]);

/** Matrix Verbs that work from Linked (on-net, not fully Connected). */
export const LINKED_OK_VERB_DSIDS = Object.freeze([
  "matrix-broadcast",
  "matrix-toggle-connection-state",
  "matrix-jack-out",
]);

export const WIRED_STATUS_DEFS = Object.freeze({
  linked: { id: "ghostwire-linked", _id: "gwLinkedStatus00", name: "GHOSTWIRE.Wired.States.linked", img: "icons/svg/aura.svg" },
  overlay: { id: "ghostwire-overlay", _id: "gwOverlayStatus0", name: "GHOSTWIRE.Wired.States.overlay", img: "icons/svg/eye.svg" },
  jackedIn: { id: "ghostwire-jacked-in", _id: "gwJackedInStatus", name: "GHOSTWIRE.Wired.States.jackedIn", img: "icons/svg/lightning.svg" },
});

export const WIRED_ROSTER_ORDER = Object.freeze({
  jackedIn: 0,
  overlay: 1,
  linked: 2,
  disconnected: 3,
});

export function isWiredState(state) {
  return WIRED_STATES.includes(state);
}

/** Any non-Disconnected state — Linked is on-net. */
export function isOnNet(state) {
  return ON_NET_STATES.includes(state);
}

/** Overlay or Jacked In. Linked is not full Connected. */
export function isFullyConnected(state) {
  return FULLY_CONNECTED_STATES.includes(state);
}

/** Scan / Search / Watchdog can find this presence. Linked = soft presence. */
export function isWireDiscoverable(state) {
  return isOnNet(state);
}

/**
 * Resolve a gate argument. Prefer explicit `state`.
 * Legacy `connected: true` (no state) means full Connected (Overlay) so older callers stay permissive.
 */
export function resolveWiredState({ state, connected } = {}) {
  if (typeof state === "string" && isWiredState(state)) return state;
  if (connected === true) return "overlay";
  return "disconnected";
}

/** Connect from Disconnected → Linked. Unknown / disconnected stays Linked as the default on-ramp. */
export function connectTargetState() {
  return "linked";
}

/**
 * Toggle Connection State: Linked → Overlay → Jacked In → Linked.
 * Disconnected is not on the ladder (Jack Out is the only path off-net).
 */
export function nextToggleState(state) {
  const i = TOGGLE_LADDER.indexOf(state);
  if (i < 0) return TOGGLE_LADDER[0];
  return TOGGLE_LADDER[(i + 1) % TOGGLE_LADDER.length];
}

export function verbDsid(verbOrDsid) {
  if (!verbOrDsid) return null;
  return String(verbOrDsid).startsWith("matrix-") ? String(verbOrDsid) : `matrix-${verbOrDsid}`;
}

/** Matrix Verbs allowed while Linked (plus Connect, which is Disconnected-only). */
export function isLinkedOkVerb(verbOrDsid) {
  return LINKED_OK_VERB_DSIDS.includes(verbDsid(verbOrDsid));
}

/**
 * Whether a Matrix Verb may fire in this state.
 * Connect is Disconnected-only. Broadcast / Toggle / Jack Out are any on-net.
 * Scan / Navigate / Ping / Search / Read-Write need Overlay or Jacked In.
 */
export function verbAllowedAtState(dsid, state) {
  if (dsid === "matrix-connect") return state === "disconnected";
  if (!isOnNet(state)) return false;
  if (isFullyConnected(state)) return true;
  return isLinkedOkVerb(dsid);
}

/**
 * Other Wired abilities (Programs, payload Runs) need Overlay or Jacked In.
 * Matrix Verbs use verbAllowedAtState instead.
 */
export function wiredAbilityAllowedAtState(state) {
  return isFullyConnected(state);
}

/** Meat Power Rolls: Overlay bane, Jacked In blocked, Linked normal. */
export function meatPowerRollModifier(state) {
  if (state === "overlay") return { edges: 0, banes: 1, blocked: false };
  if (state === "jackedIn") return { edges: 0, banes: 0, blocked: true };
  return { edges: 0, banes: 0, blocked: false };
}

/** Wired Power Rolls: Jacked In edge only. Linked and Overlay add neither. */
export function wiredPowerRollModifier(state) {
  if (state === "jackedIn") return { edges: 1, banes: 0 };
  return { edges: 0, banes: 0 };
}

/**
 * Strongest of several states (HUD / minimap). Jacked In beats Overlay beats Linked.
 * @param {Iterable<string>} states
 */
export function strongestWiredState(states) {
  let best = "disconnected";
  for (const state of states ?? []) {
    const rank = WIRED_ROSTER_ORDER[state] ?? 99;
    const bestRank = WIRED_ROSTER_ORDER[best] ?? 99;
    if (rank < bestRank) best = state;
  }
  return best;
}
