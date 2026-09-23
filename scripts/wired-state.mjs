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

/**
 * Wrench abilities used from the Jump-In seat (fleet, platform, swarm, building).
 * Jacked In still blocks every other non-Wired power roll — personal weapons and other classes.
 * Wired abilities are not in this set; they already pass the Jacked In gate on the Wired keyword.
 */
export const JUMP_IN_SEAT_DSIDS = Object.freeze(new Set([
  "adaptive-net",
  "autogun-lockdown",
  "bee-storm",
  "boarding-repel",
  "building-scale-volley",
  "buzzsaw-pass",
  "collapse-the-corridor",
  "crossfire-grid",
  "decoy-chirp",
  "deploy-and-command",
  "emergency-reinforcement",
  "evasive-burn",
  "feedback-loop",
  "field-repair",
  "focus-fire",
  "focus-sting",
  "fortify-node",
  "full-broadside",
  "full-stabilization",
  "ghost-in-the-walls",
  "ghost-signature",
  "ghost-swarm",
  "jump-in-signature-platform",
  "kamikaze-run",
  "kamikaze-volley",
  "kill-ram",
  "lockdown-protocol",
  "one-machine-one-will",
  "overdrive-charge",
  "overpressure-vent",
  "override-ping",
  "ram-speed",
  "recon-loop",
  "redline-barrage",
  "rigged-fire",
  "salvage-sense",
  "sensor-fusion-lock",
  "sensor-ghost",
  "sentry-fire",
  "spotter-lock",
  "swarm-reposition",
  "systems-purge",
  "taser-swarm",
  "terrain-breaker",
  "total-lockdown",
  "total-swarm-protocol",
  "trip-the-web",
  "turn-the-building-ability",
  "twin-mount-volley",
  "wake-the-walls",
  "web-the-corridor",
  "wide-eyes",
  "wrench-breach-charge",
  "wrench-emergency-patch",
  "wrench-saturation-fire",
]));

/** The Rigger seat's own Fire ability, and the Vehicle Rig-Pilot feature that sharpens it. */
export const RIGGED_FIRE_DSID = "rigged-fire";
export const PILOT_AND_GUNNER_DSID = "pilot-and-gunner";

/** A weapon use-ability spawned by equipment-use.mjs (`gear-use-<sku>`). */
export function isGearUseDsid(dsid = "") {
  return typeof dsid === "string" && dsid.startsWith("gear-use-");
}

/**
 * 0.3.114 — is this trigger-pull *seat fire* rather than a personal weapon?
 *
 * A gun bolted to a §5F Weaponry kit hardpoint (0.3.112, `flags.<module>.mount.mountedOn`) is part
 * of the machine. A pilot who is Jumped In (`jumpedInto`) is the machine, so firing it is the same
 * act as Rigged Fire — the meat body never moves. A gun still *in the pilot's hands* is not seat
 * fire and stays blocked, which is why this is a predicate on the gear rather than another row in
 * JUMP_IN_SEAT_DSIDS: mounting is a runtime fact, not a SKU fact.
 *
 * @param {object} opts
 * @param {boolean} opts.jumpedIn     Pilot carries the `jumpedInto` flag.
 * @param {string}  opts.dsid         Ability `_dsid`.
 * @param {boolean} opts.gearMounted  The ability's source gear is mounted right now.
 * @param {boolean} opts.fromGear     The ability was spawned from a gear Item (`fromGearId`).
 */
export function isMountedSeatFire({ jumpedIn = false, dsid = "", gearMounted = false, fromGear = false } = {}) {
  if (!jumpedIn || !gearMounted) return false;
  return isGearUseDsid(dsid) || !!fromGear;
}

/** True when Jacked In should refuse this ability before it rolls. Machine-seat and Wired uses stay open. */
export function jumpedInBlocksAbility({
  state, wired = false, dsid = "", rollEnabled = false,
  jumpedIn = false, gearMounted = false, fromGear = false,
} = {}) {
  if (state !== "jackedIn" || !rollEnabled || wired) return false;
  if (JUMP_IN_SEAT_DSIDS.has(dsid)) return false;
  return !isMountedSeatFire({ jumpedIn, dsid, gearMounted, fromGear });
}

/**
 * Edges Jump-In hands the pilot on a Fire roll.
 *
 * RAW (Wrench master / Jump-In Plumbing): Jump-In grants **one weapon-lock edge** while Jumped In.
 * It rides on the seat's guns — Rigged Fire, and a mounted weapon fired from the seat (0.3.114).
 * The Vehicle Rig-Pilot feature **Pilot and Gunner** adds the RAW *extra* edge on Rigged Fire made
 * this way, so a Rig-Pilot rolls two edges there and one on a plain mounted Fire.
 *
 * @returns {number} 0, 1 or 2.
 */
export function jumpInFireEdges({ jumpedIn = false, dsid = "", gearMounted = false, hasPilotAndGunner = false } = {}) {
  if (!jumpedIn) return 0;
  const riggedFire = dsid === RIGGED_FIRE_DSID;
  const mountedFire = isMountedSeatFire({ jumpedIn, dsid, gearMounted });
  if (!riggedFire && !mountedFire) return 0;
  let edges = 1; // weapon lock
  if (riggedFire && hasPilotAndGunner) edges += 1; // Pilot and Gunner
  return edges;
}

/** Wired Power Rolls: Jacked In edge only. Linked and Overlay add neither. */
export function wiredPowerRollModifier(state) {
  if (state === "jackedIn") return { edges: 1, banes: 0 };
  return { edges: 0, banes: 0 };
}

/**
 * Edges / banes Ghostwire injects into AbilityModel#use `config.modifiers`.
 * Hacking and Jacked In apply only to Wired rolls. Overlay meat bane applies only to non-Wired rolls.
 */
export function abilityPowerRollModifiers({
  wired = false, hasHacking = false, softwareEdges = 0, state,
  jumpedIn = false, dsid = "", gearMounted = false, hasPilotAndGunner = false,
} = {}) {
  let edges = Math.max(0, Number(softwareEdges) || 0);
  let banes = 0;
  if (wired && hasHacking) edges += 1;
  if (wired) edges += wiredPowerRollModifier(state).edges;
  else banes += meatPowerRollModifier(state).banes;
  edges += jumpInFireEdges({ jumpedIn, dsid, gearMounted, hasPilotAndGunner });
  return { edges, banes };
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
