// 0.3.141 — the Chase HUD (vehicle combat HUD). Michael lock 2026-09-25.
//
// 0.3.138 locked the chase *rules* (docs/raw/23-machines.md › Chase round checklist). This is the
// applet that runs them at the table: a roster of vehicles and drones, four crew stations on each,
// one abstract range-band track, and a phase stepper that is the chase's own clock. It never opens,
// reads or advances a Foundry Combat encounter — a chase and a foot fight can run side by side.
//
//   * **Turn order is phase by phase, all vehicles together** (open call 1): 0 Setup → 1 Pilots →
//     2a Sensor lock → 2b Jam / spoof → 2c Terrain read → 3 Gunners → 4 Integrity → 5 End. Inside a
//     phase every seated crew member on every vehicle may act or pass; an empty seat is skipped.
//   * **Ports are passengers only** (open call 2). Cargo and boarding ports are backlog.
//   * **The range track is measured to the lead.** One vehicle is the lead; every other vehicle's
//     band is its distance to the lead, so a two-vehicle chase has exactly one band, and a pack of
//     pursuers reads as a pack. The track is the source of truth; the Director's fiat beats any roll.
//   * **Integrity is never cached here.** A vehicle row stores the Actor's uuid, and every render
//     reads `system.stamina` off that Actor (the field machines.mjs stamps and the token bar shows).
//     Committing damage writes the new value straight back — `writeIntegrityThrough` — so the HUD and
//     the sheet cannot disagree.
//   * **Nothing is permanent until the Director confirms.** Every roll posts its dice to chat and
//     parks a *pending outcome*; the Director's review dialog can change the tier, the winner, the
//     band, hit or miss and the damage, keep it for later, or discard it. A player's roll reaches the
//     Director on the roll's own chat-message flags, which every client sees — no socket involved.
//   * **Sounds** reuse the shipped assets/sfx and the B40 settings (`sfxEnabled`, `sfxVolume`,
//     `sfxGmOnly`). Each client plays its own cue, so the HUD's mute button (a client setting) mutes
//     the HUD for that user only and never touches Foundry's own volume.
//
// State lives on the Scene: `flags.draw-steel-ghostwire.chaseHud`. Only a GM writes it.
//
// Everything above the "Foundry runtime" divider is Foundry-free so tools/wave-03141-smoke.mjs can
// execute the real phase clock, band track, roll plans and commit maths in Node.

import { isMachineKindDocument, machineKindOf } from "./machines.mjs";
import { machineIntegrity } from "./machine-conditions.mjs";
import { ridersOf } from "./passengers.mjs";
import { WEAPON_SKILL_BONUS, actorHasSkill, weaponSkillKey } from "./weapon-skills.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const L = "GHOSTWIRE.ChaseHud";

export const CHASE_FLAG = "chaseHud";
export const CHASE_APP_ID = "ghostwire-chase-hud";
export const CHASE_MUTE_SETTING = "chaseHudMuted";
export const CHASE_STATE_VERSION = 1;
export const CHASE_LANG_ROOT = L;

/** The band track, far to near. Same words as the 0.3.138 checklist. */
export const CHASE_BANDS = Object.freeze(["brokenOff", "extreme", "long", "medium", "close", "ramming"]);
/** Where a vehicle lands when it joins. The Director moves it from there. */
export const DEFAULT_BAND = "medium";

/** The round, in checklist order. `stations` is who acts in that phase. */
export const CHASE_PHASES = Object.freeze([
  Object.freeze({ id: "setup", step: "0", stations: Object.freeze([]) }),
  Object.freeze({ id: "pilots", step: "1", stations: Object.freeze(["pilot"]) }),
  Object.freeze({ id: "sensorLock", step: "2a", stations: Object.freeze(["systems"]) }),
  Object.freeze({ id: "jam", step: "2b", stations: Object.freeze(["systems"]) }),
  Object.freeze({ id: "terrain", step: "2c", stations: Object.freeze(["systems"]) }),
  Object.freeze({ id: "gunners", step: "3", stations: Object.freeze(["turrets", "ports"]) }),
  Object.freeze({ id: "integrity", step: "4", stations: Object.freeze([]) }),
  Object.freeze({ id: "end", step: "5", stations: Object.freeze([]) }),
]);
export const CHASE_PHASE_IDS = Object.freeze(CHASE_PHASES.map(phase => phase.id));

export const CHASE_STATIONS = Object.freeze(["pilot", "systems", "turrets", "ports"]);
/** One seat each. Turrets and Ports take as many crew as the Director seats. */
export const SINGLE_SEAT_STATIONS = Object.freeze(["pilot", "systems"]);
export const CHASE_SIDES = Object.freeze(["crew", "opposition"]);
export const PILOT_INTENTS = Object.freeze(["close", "open", "hold", "ram"]);
export const TERRAIN_EDGE_TARGETS = Object.freeze(["pilot", "gunner"]);

/** Ghostwire characteristic → Draw Steel key (scripts/chargen-wizard.mjs CHARACTERISTIC_LABELS). */
export const CHASE_CHARACTERISTICS = Object.freeze({ reflex: "agility", logic: "reason", instinct: "intuition", might: "might" });

/** The mod dsids the chase reads (scripts/machines.mjs MACHINE_MOD_PROFILES). */
export const CHASE_KITS = Object.freeze({
  sensorPod: "sensor-pod",
  stormLattice: "storm-lattice",
  ghostCoat: "ghost-coat",
  signalMule: "signal-mule",
  tuneKit: "tune-kit",
  laneSkirt: "lane-skirt",
});

/** The ranged free-strike spread — mirrors `spread.ranged` in scripts/data/weapon-use-templates.json. */
export const WEAPON_SPREAD = Object.freeze({ low: -2, high: 2 });

const SFX = name => `modules/${MODULE_ID}/assets/sfx/${name}.ogg`;
/** One cue per HUD beat. Every file already ships under assets/sfx (B40); nothing new is added. */
export const CHASE_SFX = Object.freeze({
  pilot: SFX("drone-fly"),
  sensorLock: SFX("matrix-scan"),
  jam: SFX("taser-arc"),
  terrain: SFX("scout-mark"),
  gunnery: SFX("gun-machinegun"),
  passenger: SFX("pistol-single"),
  integrity: SFX("salvage-clank"),
  repair: SFX("chrome-servo-a"),
  wreck: SFX("grenade-boom"),
  bandShift: SFX("drone-effect"),
});

/** Roll kinds, and the cue each one plays when its dice land. */
export const ROLL_KINDS = Object.freeze(["pilot", "sensorLock", "jam", "terrain", "gunnery", "passenger"]);

/* ============================================================ the clock */

export function phaseIndex(phase) {
  const index = CHASE_PHASE_IDS.indexOf(phase);
  return index < 0 ? 0 : index;
}

export function phaseDef(phase) {
  return CHASE_PHASES[phaseIndex(phase)];
}

/** Stations that act in this phase. */
export function stationsForPhase(phase) {
  return [...phaseDef(phase).stations];
}

/**
 * One step forward. Setup happens once; stepping past End opens the next round at Pilots.
 * @returns {{round: number, phase: string, newRound: boolean}}
 */
export function advancePhase({ round = 1, phase = "setup" } = {}) {
  const index = phaseIndex(phase);
  if (CHASE_PHASE_IDS[index] === "end") return { round: (Number(round) || 1) + 1, phase: "pilots", newRound: true };
  return { round: Number(round) || 1, phase: CHASE_PHASE_IDS[index + 1], newRound: false };
}

/** One step back — the Director's undo for a phase clicked too early. Round 1 Setup is the floor. */
export function retreatPhase({ round = 1, phase = "setup" } = {}) {
  const current = Number(round) || 1;
  const index = phaseIndex(phase);
  if ((CHASE_PHASE_IDS[index] === "pilots") && (current > 1)) return { round: current - 1, phase: "end" };
  if (index === 0) return { round: current, phase: "setup" };
  return { round: current, phase: CHASE_PHASE_IDS[index - 1] };
}

/* ============================================================ the band track */

export function bandIndex(band) {
  const index = CHASE_BANDS.indexOf(band);
  return index < 0 ? CHASE_BANDS.indexOf(DEFAULT_BAND) : index;
}

export function isChaseBand(band) {
  return CHASE_BANDS.includes(band);
}

/** Positive closes toward Ramming, negative opens toward Broken off; clamped to the track. */
export function shiftBand(band, delta) {
  const next = bandIndex(band) + (Math.trunc(Number(delta)) || 0);
  return CHASE_BANDS[Math.max(0, Math.min(CHASE_BANDS.length - 1, next))];
}

const INTENT_DELTA = Object.freeze({ close: 1, open: -1, hold: 0, ram: 0 });

/**
 * The band a Pilot contest *suggests*. The winner closes, opens or holds; a tie holds. Both intents
 * are read on the same axis — "close" always means toward Ramming — so it does not matter which side
 * of the contest the lead was on. A ram is only a ram at Ramming / Boarding.
 *
 * @returns {{band: string, ram: boolean}}
 */
export function suggestPilotBand({ band, winner = null, chaserIntent = "close", leadIntent = "open" } = {}) {
  const current = CHASE_BANDS[bandIndex(band)];
  if (!winner) return { band: current, ram: false };
  const intent = winner === "chaser" ? chaserIntent : leadIntent;
  if (intent === "ram") return { band: current, ram: current === "ramming" };
  return { band: shiftBand(current, INTENT_DELTA[intent] ?? 0), ram: false };
}

/* ============================================================ state */

export function emptyStations() {
  return Object.fromEntries(CHASE_STATIONS.map(station => [station, []]));
}

export function newChaseState() {
  return {
    version: CHASE_STATE_VERSION,
    round: 1,
    phase: "setup",
    leadId: null,
    vehicles: [],
    pending: [],
    acted: [],
    cue: null,
  };
}

export function newVehicle({ id, actorUuid, tokenUuid = null, name = "", side = "crew", band = DEFAULT_BAND } = {}) {
  return {
    id: String(id),
    actorUuid: actorUuid ?? null,
    tokenUuid,
    name: String(name ?? ""),
    side: CHASE_SIDES.includes(side) ? side : "crew",
    band: isChaseBand(band) ? band : DEFAULT_BAND,
    stations: emptyStations(),
    locks: [],
    jammed: false,
    terrainEdge: null,
    pendingDamage: 0,
    wrecked: false,
    brokenOff: false,
  };
}

/** Defensive read of whatever the Scene flag holds. Missing fields come back with their defaults. */
export function normalizeState(raw) {
  const base = newChaseState();
  const state = { ...base, ...(raw && typeof raw === "object" ? raw : {}) };
  state.round = Math.max(1, Number(state.round) || 1);
  state.phase = CHASE_PHASE_IDS.includes(state.phase) ? state.phase : "setup";
  state.vehicles = (Array.isArray(state.vehicles) ? state.vehicles : []).filter(v => v?.id).map(v => {
    const vehicle = { ...newVehicle(v), ...v };
    const stations = emptyStations();
    for (const station of CHASE_STATIONS) {
      const seated = Array.isArray(v.stations?.[station]) ? v.stations[station].filter(c => c?.actorUuid) : [];
      stations[station] = SINGLE_SEAT_STATIONS.includes(station) ? seated.slice(0, 1) : seated;
    }
    vehicle.stations = stations;
    vehicle.locks = Array.isArray(v.locks) ? [...new Set(v.locks)] : [];
    vehicle.band = isChaseBand(v.band) ? v.band : DEFAULT_BAND;
    vehicle.pendingDamage = Math.max(0, Number(v.pendingDamage) || 0);
    return vehicle;
  });
  state.pending = Array.isArray(state.pending) ? state.pending.filter(p => p?.id) : [];
  state.acted = Array.isArray(state.acted) ? state.acted : [];
  if (!state.vehicles.some(v => v.id === state.leadId)) state.leadId = state.vehicles[0]?.id ?? null;
  return state;
}

export const isVehicleOut = vehicle => !!(vehicle?.wrecked || vehicle?.brokenOff);

export function vehicleById(state, id) {
  return state?.vehicles?.find(v => v.id === id) ?? null;
}

export function activeVehicles(state) {
  return (state?.vehicles ?? []).filter(v => !isVehicleOut(v));
}

/** The lead, or — if the lead is out — the first vehicle still in the chase. */
export function leadVehicle(state) {
  const lead = vehicleById(state, state?.leadId);
  if (lead && !isVehicleOut(lead)) return lead;
  return activeVehicles(state)[0] ?? null;
}

/** Every vehicle still in the chase that is not the lead: the ones with a band. */
export function chaserVehicles(state) {
  const lead = leadVehicle(state);
  return activeVehicles(state).filter(v => v.id !== lead?.id);
}

/** Why the chase is over, or null while it is still on. */
export function chaseOverReason(state) {
  if (!state?.vehicles?.length) return null;
  if (activeVehicles(state).length < 2) return "oneLeft";
  return null;
}

/** Seat someone. Single seats swap their occupant; Turrets / Ports add without duplicates. */
export function assignStation(vehicle, station, crew) {
  if (!vehicle || !CHASE_STATIONS.includes(station) || !crew?.actorUuid) return vehicle;
  vehicle.stations ??= emptyStations();
  const seat = { actorUuid: crew.actorUuid, tokenUuid: crew.tokenUuid ?? null, name: String(crew.name ?? "") };
  if (SINGLE_SEAT_STATIONS.includes(station)) vehicle.stations[station] = [seat];
  else if (!vehicle.stations[station].some(c => c.actorUuid === seat.actorUuid)) vehicle.stations[station].push(seat);
  return vehicle;
}

/**
 * 0.3.146: the seat order a joining vehicle's riders fill — Pilot first, then Systems, then Turrets,
 * and everyone left over into the Ports (the last stop, which holds any number). Phase 1 Pilots used
 * to open with nobody seated because every rider went straight to the Ports.
 */
export const AUTO_SEAT_ORDER = Object.freeze(["pilot", "systems", "turrets", "ports"]);

/**
 * Pure: which station each of `crewList` takes, in order. Riders without an Actor and repeats of one
 * already in the list take no seat. A single seat the Director already filled is skipped, not swapped.
 */
export function autoSeatPlan(crewList = [], vehicle = null) {
  const seen = new Set();
  const plan = [];
  let cursor = 0;
  for (const crew of crewList) {
    if (!crew?.actorUuid || seen.has(crew.actorUuid)) continue;
    seen.add(crew.actorUuid);
    while (cursor < AUTO_SEAT_ORDER.length - 1
      && SINGLE_SEAT_STATIONS.includes(AUTO_SEAT_ORDER[cursor])
      && vehicle?.stations?.[AUTO_SEAT_ORDER[cursor]]?.length) cursor += 1;
    plan.push({ station: AUTO_SEAT_ORDER[cursor], crew });
    if (cursor < AUTO_SEAT_ORDER.length - 1) cursor += 1;
  }
  return plan;
}

/** Seat a joining vehicle's riders in that order. The table can unseat / reassign afterwards. */
export function autoSeatRiders(vehicle, crewList = []) {
  for (const { station, crew } of autoSeatPlan(crewList, vehicle)) assignStation(vehicle, station, crew);
  return vehicle;
}

export function unassignStation(vehicle, station, actorUuid) {
  if (!vehicle?.stations?.[station]) return vehicle;
  vehicle.stations[station] = vehicle.stations[station].filter(c => c.actorUuid !== actorUuid);
  return vehicle;
}

export const actedKey = (vehicleId, station, actorUuid = "") => `${vehicleId}:${station}:${actorUuid}`;

export function markActed(state, key) {
  if (key && !state.acted.includes(key)) state.acted.push(key);
  return state;
}

/**
 * What a phase change clears. Acted marks go every phase. At a new round jams lift and the Gunner's
 * terrain edge expires; bands and live locks carry over, per step 5. A Pilot's terrain edge waits for
 * that Pilot's next contest, which is the only roll it can reach once 2c is past.
 */
export function applyPhaseChange(state, next) {
  state.round = next.round;
  state.phase = next.phase;
  state.acted = [];
  if (next.newRound) {
    for (const vehicle of state.vehicles) {
      vehicle.jammed = false;
      if (vehicle.terrainEdge?.to === "gunner") vehicle.terrainEdge = null;
    }
  }
  return state;
}

/* ============================================================ roll plans (0.3.138 checklist) */

/** Opposed Power Roll: higher total wins, a tie wins nothing. */
export function opposedWinner(a, b) {
  const left = Number(a);
  const right = Number(b);
  if (!Number.isFinite(left) && !Number.isFinite(right)) return null;
  if (!Number.isFinite(right) || left > right) return "a";
  if (!Number.isFinite(left) || right > left) return "b";
  return null;
}

/** Higher Handling takes an edge; a tie, a lower number, or a fixed asset gets nothing. */
export function handlingEdge(own, other) {
  const a = Number(own);
  const b = Number(other);
  if (!Number.isFinite(a) || !Number.isFinite(b) || own == null || other == null) return 0;
  return a > b ? 1 : 0;
}

/** Which of Driving / Piloting / Rigging the machine calls for. */
export function pilotSkillFor({ kind = "vehicle", domain = "" } = {}) {
  if (kind === "drone") return "rigging";
  const d = String(domain ?? "").toLowerCase();
  if (d.startsWith("air") || d.startsWith("space") || d.startsWith("water")) return "piloting";
  return "driving";
}

const note = (key, data = {}) => ({ key, data });
const skillBonus = trained => (trained ? WEAPON_SKILL_BONUS : 0);

/** 1 — Pilots: 2d10 + Reflex + (Driving | Piloting | Rigging); Handling edge; untrained bane. */
export function pilotRollPlan({ reflex = 0, skill = "driving", trained = false, handling = null, opponentHandling = null, terrainEdge = false } = {}) {
  const notes = [];
  let edges = 0;
  let banes = 0;
  if (handlingEdge(handling, opponentHandling)) { edges += 1; notes.push(note("Handling", { own: handling, other: opponentHandling })); }
  if (terrainEdge) { edges += 1; notes.push(note("TerrainEdge")); }
  if (!trained) { banes += 1; notes.push(note("Untrained", { skill })); }
  return { characteristic: CHASE_CHARACTERISTICS.reflex, value: Number(reflex) || 0, skill, skillBonus: skillBonus(trained), edges, banes, notes };
}

const kitSet = kits => (kits instanceof Set ? kits : new Set(kits ?? []));

/** 2a — Sensor lock: 2d10 + Logic + Electronics; Pod / Lattice edge; target's Ghost Coat bane. */
export function sensorLockPlan({ logic = 0, trained = false, ownKits = [], targetKits = [] } = {}) {
  const own = kitSet(ownKits);
  const target = kitSet(targetKits);
  const notes = [];
  let edges = 0;
  let banes = 0;
  if (own.has(CHASE_KITS.stormLattice)) { edges += 1; notes.push(note("StormLattice")); }
  else if (own.has(CHASE_KITS.sensorPod)) { edges += 1; notes.push(note("SensorPod")); }
  if (target.has(CHASE_KITS.ghostCoat)) { banes += 1; notes.push(note("GhostCoat")); }
  return {
    characteristic: CHASE_CHARACTERISTICS.logic, value: Number(logic) || 0, skill: "electronics",
    skillBonus: skillBonus(trained), edges, banes, notes, share: own.has(CHASE_KITS.stormLattice),
  };
}

/** 2b — the jammer: 2d10 + Logic + Security Systems; untrained there = Electronics at a bane. */
export function jamPlan({ logic = 0, securitySystems = false, electronics = false } = {}) {
  const notes = [];
  let banes = 0;
  let skill = "securitySystems";
  let trained = securitySystems;
  if (!securitySystems) {
    banes += 1;
    skill = "electronics";
    trained = electronics;
    notes.push(note("JamUntrained"));
  }
  return { characteristic: CHASE_CHARACTERISTICS.logic, value: Number(logic) || 0, skill, skillBonus: skillBonus(trained), edges: 0, banes, notes };
}

/** 2b — the lock-holder's defence: 2d10 + Logic + Electronics; Signal Mule edge. */
export function jamDefensePlan({ logic = 0, trained = false, ownKits = [] } = {}) {
  const notes = [];
  let edges = 0;
  if (kitSet(ownKits).has(CHASE_KITS.signalMule)) { edges += 1; notes.push(note("SignalMule")); }
  return { characteristic: CHASE_CHARACTERISTICS.logic, value: Number(logic) || 0, skill: "electronics", skillBonus: skillBonus(trained), edges, banes: 0, notes };
}

/** 2c — Terrain read: 2d10 + Logic (or Instinct, whichever is higher) + Navigation. */
export function terrainPlan({ logic = 0, instinct = 0, trained = false } = {}) {
  const useLogic = (Number(logic) || 0) >= (Number(instinct) || 0);
  return {
    characteristic: useLogic ? CHASE_CHARACTERISTICS.logic : CHASE_CHARACTERISTICS.instinct,
    value: useLogic ? (Number(logic) || 0) : (Number(instinct) || 0),
    skill: "navigation", skillBonus: skillBonus(trained), edges: 0, banes: 0, notes: [],
  };
}

/**
 * 3 — Gunners: 2d10 + Reflex + Gunnery hands-on, or Logic + Gunnery sensor-fed. Firing at a moving
 * vehicle **with** a lock is a bane; firing **without** one is a double bane. Sensor-fed needs the
 * lock, and is taken when the gunner's Logic beats their Reflex.
 */
export function gunneryPlan({ reflex = 0, logic = 0, trained = false, hasLock = false, terrainEdge = false } = {}) {
  const notes = [];
  const sensorFed = !!hasLock && ((Number(logic) || 0) > (Number(reflex) || 0));
  notes.push(note(sensorFed ? "SensorFed" : "HandsOn"));
  const banes = hasLock ? 1 : 2;
  notes.push(note(hasLock ? "WithLock" : "NoLock"));
  let edges = 0;
  if (terrainEdge) { edges += 1; notes.push(note("TerrainEdge")); }
  return {
    characteristic: sensorFed ? CHASE_CHARACTERISTICS.logic : CHASE_CHARACTERISTICS.reflex,
    value: sensorFed ? (Number(logic) || 0) : (Number(reflex) || 0),
    skill: "gunnery", skillBonus: skillBonus(trained), edges, banes, notes, sensorFed,
  };
}

/** 3 — Passengers: an ordinary personal strike at a speed bane (best of Might / Reflex). */
export function passengerPlan({ might = 0, agility = 0, skill = null, trained = false } = {}) {
  const useMight = (Number(might) || 0) > (Number(agility) || 0);
  return {
    characteristic: useMight ? CHASE_CHARACTERISTICS.might : CHASE_CHARACTERISTICS.reflex,
    value: useMight ? (Number(might) || 0) : (Number(agility) || 0),
    skill, skillBonus: skillBonus(trained && !!skill), edges: 0, banes: 1, notes: [note("SpeedBane")],
  };
}

/** A lock or a terrain read lands on tier 2 or 3. The Director can overrule either way. */
export const testSucceeds = tier => (Number(tier) || 0) >= 2;
/** The jammer has to beat the lock-holder outright; a tie keeps the lock. */
export const jamSucceeds = (jammerTotal, defenderTotal) => opposedWinner(jammerTotal, defenderTotal) === "a";

/**
 * Suggested Integrity damage for a weapon at a tier: the gear's printed number is the middle result,
 * low and high use the ranged free-strike spread, and a connecting hit floors at 1 — the same rule
 * scripts/equipment-use.mjs builds every weapon ability from. `null` when there is no number.
 */
export function weaponTierDamage(middle, tier) {
  const base = Number(middle);
  if (middle === null || middle === undefined || middle === "" || !Number.isFinite(base) || base <= 0) return null;
  const shift = { 1: WEAPON_SPREAD.low, 2: 0, 3: WEAPON_SPREAD.high }[Number(tier)] ?? 0;
  return Math.max(1, base + shift);
}

export function weaponDamageByTier(middle) {
  return [null, weaponTierDamage(middle, 1), weaponTierDamage(middle, 2), weaponTierDamage(middle, 3)];
}

/* ============================================================ Integrity */

/** Integrity after a change: never below 0, never above max (when there is a max). */
export function integrityAfter({ value = 0, max = 0 } = {}, delta = 0) {
  const ceiling = Number(max) || 0;
  let next = (Number(value) || 0) + (Math.trunc(Number(delta)) || 0);
  next = Math.max(0, next);
  if (ceiling > 0) next = Math.min(ceiling, next);
  return { value: next, max: ceiling };
}

/** The cue an Integrity change plays: wreck at 0, a clank for damage, a servo for repair. */
export function integrityCue(before, after) {
  if ((Number(after?.value) <= 0) && (Number(before?.value) > 0)) return "wreck";
  if (Number(after?.value) < Number(before?.value)) return "integrity";
  if (Number(after?.value) > Number(before?.value)) return "repair";
  return null;
}

/** Every mod dsid installed on a deployed machine, from its `installedKits` flag. */
export function machineKitDsids(installedKits) {
  const kits = installedKits ?? {};
  return new Set([
    kits.armor?.dsid, kits.weaponry?.dsid,
    ...(Array.isArray(kits.others) ? kits.others.map(row => row?.dsid) : []),
  ].filter(Boolean));
}

/* ============================================================ commit */

function addLock(state, vehicle, targetId, share) {
  const holders = share
    ? activeVehicles(state).filter(v => (v.side === vehicle.side) && (v.id !== targetId))
    : [vehicle];
  for (const holder of holders) {
    if (holder.jammed) continue;
    if (!holder.locks.includes(targetId)) holder.locks.push(targetId);
  }
}

/**
 * Apply one confirmed outcome to the chase state — the only place a roll changes anything.
 * Mutates `state`; Integrity is not touched here (hits queue on the target for phase 4).
 *
 * @param {object} state      normalizeState() output.
 * @param {object} pending    the parked outcome the roll built.
 * @param {object} decision   what the Director confirmed.
 * @returns {{cue: string|null, bandChanged: boolean}}
 */
export function commitOutcome(state, pending, decision = {}) {
  const vehicle = vehicleById(state, pending?.vehicleId);
  const target = vehicleById(state, pending?.targetId);
  let cue = pending?.kind ?? null;
  let bandChanged = false;

  switch (pending?.kind) {
    case "pilot": {
      if (vehicle && isChaseBand(decision.band) && (vehicle.band !== decision.band)) {
        vehicle.band = decision.band;
        bandChanged = true;
      }
      if (vehicle) vehicle.brokenOff = vehicle.band === "brokenOff";
      const rammed = vehicleById(state, decision.rammedId);
      const ram = Math.max(0, Math.trunc(Number(decision.ramDamage) || 0));
      if (rammed && ram) rammed.pendingDamage += ram;
      for (const v of [vehicle, target]) {
        if (v?.terrainEdge?.to === "pilot") v.terrainEdge = null;
      }
      if (bandChanged) cue = "bandShift";
      break;
    }
    case "sensorLock":
      if (vehicle && target && decision.lock) addLock(state, vehicle, target.id, !!pending.share);
      break;
    case "jam":
      if (target && decision.jam) {
        target.locks = [];
        target.jammed = true;
      }
      break;
    case "terrain":
      if (vehicle) {
        vehicle.terrainEdge = decision.success && TERRAIN_EDGE_TARGETS.includes(decision.edgeTo)
          ? { to: decision.edgeTo, round: state.round }
          : null;
      }
      break;
    case "gunnery":
    case "passenger": {
      const damage = Math.max(0, Math.trunc(Number(decision.damage) || 0));
      if (target && decision.hit && damage) target.pendingDamage += damage;
      break;
    }
    case "pass":
      cue = null;
      break;
    default:
      cue = null;
  }
  markActed(state, pending?.actedKey);
  state.pending = state.pending.filter(p => p.id !== pending?.id);
  return { cue, bandChanged };
}

/** Director fiat: set a band outright. Broken off takes the vehicle out; any other band brings it back. */
export function setVehicleBand(state, vehicleId, band) {
  const vehicle = vehicleById(state, vehicleId);
  if (!vehicle || !isChaseBand(band)) return false;
  const changed = vehicle.band !== band;
  vehicle.band = band;
  vehicle.brokenOff = band === "brokenOff";
  return changed;
}

/** Whether a HUD cue may play on this client. Mute is per-client and silences the HUD only. */
export function chaseCueAllowed({ enabled = true, muted = false, gmOnly = false, isGM = false, volume = 0.8 } = {}) {
  if (!enabled || muted) return false;
  if (gmOnly && !isGM) return false;
  return Number(volume) > 0;
}

/* ============================================================ Foundry runtime */

const loc = (key, data) => (data ? game.i18n.format(`${L}.${key}`, data) : game.i18n.localize(`${L}.${key}`));
const esc = value => foundry.utils.escapeHTML(String(value ?? ""));
const noteText = n => loc(`Note.${n.key}`, Object.fromEntries(Object.entries(n.data ?? {}).map(([k, v]) => [k, esc(v)])));
const speedBandLabel = band => {
  if (!band) return null;
  const key = `${L}.SpeedBand.${String(band).toLowerCase()}`;
  return game.i18n.has(key) ? game.i18n.localize(key) : String(band);
};

export function chaseScene() {
  return game.scenes?.viewed ?? globalThis.canvas?.scene ?? null;
}

export function readChaseState(scene = chaseScene()) {
  const raw = scene?.getFlag?.(MODULE_ID, CHASE_FLAG);
  return raw ? normalizeState(raw) : null;
}

let writeQueue = Promise.resolve();

/** GM-only, serialized: read the flag, let `fn` mutate a copy, write it back whole. */
export function mutateChase(scene, fn) {
  if (!game.user.isGM) {
    ui.notifications.warn(loc("GmOnly"));
    return Promise.resolve(null);
  }
  const run = async () => {
    const state = readChaseState(scene) ?? newChaseState();
    const result = await fn(state);
    const next = result === false ? null : state;
    if (next) await scene.setFlag(MODULE_ID, CHASE_FLAG, next);
    return next;
  };
  writeQueue = writeQueue.then(run, run).catch(error => {
    console.error(`${MODULE_ID} | Chase HUD write failed`, error);
    return null;
  });
  return writeQueue;
}

const cue = key => ({ id: foundry.utils.randomID(), key });

/** Resolve a stored crew / vehicle reference to its Actor, trying the token when the actor uuid misses. */
function resolveActor(ref) {
  if (!ref) return null;
  try {
    const actor = ref.actorUuid ? fromUuidSync(ref.actorUuid) : null;
    if (actor instanceof Actor) return actor;
  } catch { /* fall through to the token */ }
  try {
    const token = ref.tokenUuid ? fromUuidSync(ref.tokenUuid) : null;
    return token?.actor ?? null;
  } catch {
    return null;
  }
}

const chr = (actor, key) => Number(actor?.system?.characteristics?.[key]?.value) || 0;
/** NPC crew carry no skill list, so they count as trained at the seat the Director put them in. */
const crewTrained = (actor, skill) => (actor?.type !== "hero") || actorHasSkill(actor, skill);
const canRollFor = actor => !!actor && (game.user.isGM || actor.isOwner);

function vehicleFacts(vehicle) {
  const actor = resolveActor(vehicle);
  const machine = actor?.getFlag?.(MODULE_ID, "machine") ?? {};
  const handling = Number.isInteger(Number(machine.handling)) && machine.handling !== null && machine.handling !== ""
    ? Number(machine.handling) : null;
  return {
    actor,
    name: actor?.name ?? vehicle.name,
    img: actor?.img ?? "icons/svg/mystery-man.svg",
    kind: machineKindOf(actor) ?? "vehicle",
    domain: machine.domain ?? "",
    handling,
    speed: Number(actor?.system?.movement?.value) || null,
    speedBand: actor?.getFlag?.(MODULE_ID, "speedBand") ?? machine.speedBand ?? null,
    scale: machine.sizeScale || "",
    integrity: machineIntegrity(actor),
    kits: machineKitDsids(actor?.getFlag?.(MODULE_ID, "installedKits")),
  };
}

/** Weapons with a printed damage number, on a machine (its mounted guns) or on a passenger. */
function weaponsOn(actor) {
  return [...(actor?.items ?? [])].filter(item => {
    const gear = item.flags?.[MODULE_ID]?.gear;
    return (item.type === "treasure") && gear && (gear.damage !== null) && (gear.damage !== undefined) && (gear.damage !== "");
  });
}

/* -------------------------------------------- sound */

let lastCueId = null;

export function playChaseCue(key) {
  const src = CHASE_SFX[key];
  if (!src) return;
  const setting = name => { try { return game.settings.get(MODULE_ID, name); } catch { return undefined; } };
  const volume = Number(setting("sfxVolume") ?? 0.8);
  if (!chaseCueAllowed({
    enabled: setting("sfxEnabled") !== false,
    muted: !!setting(CHASE_MUTE_SETTING),
    gmOnly: !!setting("sfxGmOnly"),
    isGM: game.user.isGM,
    volume,
  })) return;
  try {
    foundry.audio.AudioHelper.play({ src, volume, loop: false, channel: "interface" }, false);
  } catch (error) {
    console.warn(`${MODULE_ID} | Chase HUD sound failed`, error);
  }
}

/* -------------------------------------------- rolling */

async function rollPlan(plan, flavor) {
  const roll = new ds.rolls.PowerRoll("2d10 + @chr + @skill", { chr: plan.value, skill: plan.skillBonus }, {
    type: "test", edges: plan.edges, banes: plan.banes, flavor,
  });
  await roll.evaluate();
  return { roll, total: Number(roll.total) || 0, tier: Number(roll.product) || 1 };
}

function rollLine(name, result, plan) {
  const mods = plan.notes.length ? ` <span class="gw-ch-card-notes">(${plan.notes.map(noteText).join("; ")})</span>` : "";
  return `${loc("Card.RollLine", { name: esc(name), total: result.total, tier: result.tier })}${mods}`;
}

/** Post the dice and park the outcome. The active GM's client picks the pending entry up off the flags. */
async function postPending({ scene, speaker, title, lines, rolls, pending }) {
  const content = `<div class="ghostwire-chase-card"><h4>${esc(title)}</h4>`
    + lines.map(line => `<p>${line}</p>`).join("")
    + `<p class="hint">${esc(loc("Card.PendingHint"))}</p></div>`;
  if (!game.users.activeGM) ui.notifications.warn(loc("NoGm"));
  const payload = { ...pending, id: foundry.utils.randomID(), sceneId: scene.id, summary: title, userId: game.user.id };
  return ChatMessage.implementation.create({
    speaker: ChatMessage.implementation.getSpeaker({ actor: speaker }),
    content,
    rolls: rolls.map(r => r.roll),
    sound: rolls.length ? globalThis.CONFIG?.sounds?.dice : null,
    flags: { [MODULE_ID]: { [CHASE_FLAG]: { pending: payload, cue: pending.kind === "pass" ? null : pending.kind } } },
  });
}

async function rollPilotContest(scene, state, chaserId, intents = {}) {
  const chaser = vehicleById(state, chaserId);
  const lead = leadVehicle(state);
  if (!chaser || !lead || chaser.id === lead.id) return;
  const sides = [chaser, lead].map(vehicle => {
    const facts = vehicleFacts(vehicle);
    const seat = vehicle.stations.pilot[0] ?? null;
    return { vehicle, facts, seat, pilot: resolveActor(seat) };
  });
  if (!sides.some(side => canRollFor(side.pilot))) return ui.notifications.warn(loc("NotOwner"));
  const results = [];
  const lines = [];
  for (const [index, side] of sides.entries()) {
    const other = sides[1 - index];
    if (!side.pilot) {
      results.push(null);
      lines.push(loc("Card.PilotNoPilot", { vehicle: esc(side.facts.name) }));
      continue;
    }
    const skill = pilotSkillFor(side.facts);
    const plan = pilotRollPlan({
      reflex: chr(side.pilot, CHASE_CHARACTERISTICS.reflex), skill, trained: crewTrained(side.pilot, skill),
      handling: side.facts.handling, opponentHandling: other.facts.handling,
      terrainEdge: side.vehicle.terrainEdge?.to === "pilot",
    });
    const result = await rollPlan(plan, loc("Card.PilotFlavor", { name: side.pilot.name, vehicle: side.facts.name }));
    results.push(result);
    lines.push(`${esc(side.facts.name)} — ${rollLine(side.pilot.name, result, plan)}`);
  }
  const [a, b] = results;
  const raw = opposedWinner(a?.total ?? Number.NaN, b?.total ?? Number.NaN);
  const winner = raw === "a" ? "chaser" : (raw === "b" ? "lead" : null);
  const chaserIntent = PILOT_INTENTS.includes(intents.chaser) ? intents.chaser : defaultIntent(chaser, lead, "chaser");
  const leadIntent = PILOT_INTENTS.includes(intents.lead) ? intents.lead : defaultIntent(chaser, lead, "lead");
  const suggest = suggestPilotBand({ band: chaser.band, winner, chaserIntent, leadIntent });
  const winnerName = winner ? sides[winner === "chaser" ? 0 : 1].facts.name : null;
  lines.push(winner
    ? loc("Card.PilotWinner", { name: esc(winnerName), intent: esc(loc(`Intent.${winner === "chaser" ? chaserIntent : leadIntent}`)), band: esc(loc(`Band.${suggest.band}`)) })
    : loc("Card.PilotTie"));
  const speaker = sides.find(side => canRollFor(side.pilot))?.pilot ?? null;
  await postPending({
    scene, speaker,
    title: loc("Card.Pilot", { a: sides[0].facts.name, b: sides[1].facts.name }),
    lines, rolls: results.filter(Boolean),
    pending: {
      kind: "pilot", vehicleId: chaser.id, targetId: lead.id, round: state.round, phase: state.phase,
      winner, suggest: { band: suggest.band, ram: suggest.ram, rammedId: suggest.ram ? (winner === "chaser" ? lead.id : chaser.id) : null },
      actedKey: actedKey(chaser.id, "pilot"),
    },
  });
}

function defaultIntent(chaser, lead, who) {
  if (chaser.side === lead.side) return "hold";
  return who === "chaser" ? "close" : "open";
}

async function rollSystems(scene, state, kind, vehicleId, { targetId = null, edgeTo = "pilot" } = {}) {
  const vehicle = vehicleById(state, vehicleId);
  const seat = vehicle?.stations.systems[0] ?? null;
  const crew = resolveActor(seat);
  if (!vehicle || !crew) return;
  if (!canRollFor(crew)) return ui.notifications.warn(loc("NotOwner"));
  const facts = vehicleFacts(vehicle);
  const target = vehicleById(state, targetId);
  const targetFacts = target ? vehicleFacts(target) : null;
  const logic = chr(crew, CHASE_CHARACTERISTICS.logic);

  if (kind === "sensorLock") {
    if (!target) return ui.notifications.warn(loc("Action.NoTargets"));
    const plan = sensorLockPlan({ logic, trained: crewTrained(crew, "electronics"), ownKits: facts.kits, targetKits: targetFacts.kits });
    const result = await rollPlan(plan, loc("Card.LockFlavor", { name: crew.name }));
    return postPending({
      scene, speaker: crew,
      title: loc("Card.Lock", { vehicle: facts.name, target: targetFacts.name }),
      lines: [rollLine(crew.name, result, plan), testSucceeds(result.tier) ? loc("Card.LockYes") : loc("Card.LockNo")],
      rolls: [result],
      pending: {
        kind, vehicleId, targetId, round: state.round, phase: state.phase, tier: result.tier, share: plan.share,
        suggest: { lock: testSucceeds(result.tier) }, actedKey: actedKey(vehicleId, "systems", seat.actorUuid),
      },
    });
  }

  if (kind === "jam") {
    if (!target) return ui.notifications.warn(loc("Action.NoTargets"));
    const plan = jamPlan({ logic, securitySystems: crewTrained(crew, "securitySystems"), electronics: crewTrained(crew, "electronics") });
    const result = await rollPlan(plan, loc("Card.JamFlavor", { name: crew.name }));
    const defender = resolveActor(target.stations.systems[0]) ?? targetFacts.actor;
    const defensePlan = jamDefensePlan({ logic: chr(defender, CHASE_CHARACTERISTICS.logic), trained: crewTrained(defender, "electronics"), ownKits: targetFacts.kits });
    const defense = await rollPlan(defensePlan, loc("Card.JamDefenseFlavor", { name: defender?.name ?? targetFacts.name }));
    const lands = jamSucceeds(result.total, defense.total);
    return postPending({
      scene, speaker: crew,
      title: loc("Card.Jam", { vehicle: facts.name, target: targetFacts.name }),
      lines: [rollLine(crew.name, result, plan), rollLine(defender?.name ?? targetFacts.name, defense, defensePlan),
        lands ? loc("Card.JamYes", { target: esc(targetFacts.name) }) : loc("Card.JamNo", { target: esc(targetFacts.name) })],
      rolls: [result, defense],
      pending: {
        kind, vehicleId, targetId, round: state.round, phase: state.phase, total: result.total, defenseTotal: defense.total,
        suggest: { jam: lands }, actedKey: actedKey(vehicleId, "systems", seat.actorUuid),
      },
    });
  }

  if (kind === "terrain") {
    const plan = terrainPlan({ logic, instinct: chr(crew, CHASE_CHARACTERISTICS.instinct), trained: crewTrained(crew, "navigation") });
    const result = await rollPlan(plan, loc("Card.TerrainFlavor", { name: crew.name }));
    const to = TERRAIN_EDGE_TARGETS.includes(edgeTo) ? edgeTo : "pilot";
    return postPending({
      scene, speaker: crew,
      title: loc("Card.Terrain", { vehicle: facts.name }),
      lines: [rollLine(crew.name, result, plan), testSucceeds(result.tier)
        ? loc("Card.TerrainYes", { to: esc(loc(`Station.${to === "pilot" ? "pilot" : "turrets"}`)) })
        : loc("Card.TerrainNo")],
      rolls: [result],
      pending: {
        kind, vehicleId, round: state.round, phase: state.phase, tier: result.tier,
        suggest: { success: testSucceeds(result.tier), edgeTo: to }, actedKey: actedKey(vehicleId, "systems", seat.actorUuid),
      },
    });
  }
}

async function rollFire(scene, state, vehicleId, station, actorUuid, { targetId = null, weaponId = null } = {}) {
  const vehicle = vehicleById(state, vehicleId);
  const seat = vehicle?.stations[station]?.find(c => c.actorUuid === actorUuid) ?? null;
  const crew = resolveActor(seat);
  const target = vehicleById(state, targetId);
  if (!vehicle || !crew) return;
  if (!canRollFor(crew)) return ui.notifications.warn(loc("NotOwner"));
  if (!target) return ui.notifications.warn(loc("Action.NoTargets"));
  const facts = vehicleFacts(vehicle);
  const targetFacts = vehicleFacts(target);
  const passenger = station === "ports";
  const weapons = weaponsOn(passenger ? crew : facts.actor);
  const weapon = weapons.find(w => w.id === weaponId) ?? weapons[0] ?? null;
  const middle = weapon?.flags?.[MODULE_ID]?.gear?.damage ?? null;

  let plan;
  if (passenger) {
    const skill = weapon ? weaponSkillKey(weapon) : null;
    plan = passengerPlan({ might: chr(crew, "might"), agility: chr(crew, "agility"), skill, trained: !!skill && crewTrained(crew, skill) });
  } else {
    plan = gunneryPlan({
      reflex: chr(crew, CHASE_CHARACTERISTICS.reflex), logic: chr(crew, CHASE_CHARACTERISTICS.logic),
      trained: crewTrained(crew, "gunnery"), hasLock: vehicle.locks.includes(target.id),
      terrainEdge: vehicle.terrainEdge?.to === "gunner",
    });
  }
  const kind = passenger ? "passenger" : "gunnery";
  const result = await rollPlan(plan, loc(passenger ? "Card.PassengerFlavor" : "Card.GunneryFlavor", { name: crew.name }));
  const byTier = weaponDamageByTier(middle);
  const damage = byTier[result.tier];
  return postPending({
    scene, speaker: crew,
    title: passenger
      ? loc("Card.Passenger", { name: crew.name, vehicle: facts.name, target: targetFacts.name })
      : loc("Card.Gunnery", { vehicle: facts.name, target: targetFacts.name }),
    lines: [
      rollLine(crew.name, result, plan),
      weapon
        ? loc("Card.WeaponLine", { weapon: esc(weapon.name), damage: damage ?? "—", target: esc(targetFacts.name) })
        : loc("Card.NoWeapon"),
    ],
    rolls: [result],
    pending: {
      kind, vehicleId, targetId, station, round: state.round, phase: state.phase, tier: result.tier,
      weaponName: weapon?.name ?? null, damageByTier: byTier,
      suggest: { hit: true, damage: damage ?? 0 }, actedKey: actedKey(vehicleId, station, actorUuid),
    },
  });
}

async function passStation(scene, state, vehicleId, station, actorUuid) {
  const vehicle = vehicleById(state, vehicleId);
  const seat = vehicle?.stations[station]?.find(c => c.actorUuid === actorUuid) ?? null;
  const crew = resolveActor(seat);
  if (!vehicle || !crew) return;
  if (!canRollFor(crew)) return ui.notifications.warn(loc("NotOwner"));
  const key = station === "pilot" ? actedKey(vehicleId, "pilot") : actedKey(vehicleId, station, actorUuid);
  if (game.user.isGM) return mutateChase(scene, s => { markActed(s, key); });
  return postPending({
    scene, speaker: crew,
    title: loc("Card.Pass", { name: crew.name, station: loc(`Station.${station}`), vehicle: vehicleFacts(vehicle).name }),
    lines: [], rolls: [],
    pending: { kind: "pass", vehicleId, station, round: state.round, phase: state.phase, actedKey: key },
  });
}

/* -------------------------------------------- Integrity write-through */

/**
 * Write an Integrity change through to the vehicle's own Actor — `system.stamina.value`, the field
 * machines.mjs stamps on Deploy, the Machine sheet edits and the token bar draws. The HUD reads the
 * same field back on every render, so after this resolves the Actor and the HUD agree.
 *
 * @param {Actor} actor
 * @param {number} delta   negative = damage, positive = repair.
 */
export async function writeIntegrityThrough(actor, delta) {
  const before = machineIntegrity(actor);
  const after = integrityAfter(before, delta);
  if (actor && (after.value !== before.value)) {
    await actor.update({ "system.stamina.value": after.value }, { ghostwireChaseHud: true });
  }
  return { before, after, cue: integrityCue(before, after), wrecked: after.value <= 0 };
}

async function postIntegrityCard(lines) {
  if (!lines.length) return;
  await ChatMessage.implementation.create({
    content: `<div class="ghostwire-chase-card"><h4>${esc(loc("Card.IntegrityTitle"))}</h4>${lines.map(l => `<p>${l}</p>`).join("")}</div>`,
  });
}

async function applyIntegrityChanges(scene, changes) {
  const lines = [];
  const results = [];
  const state = readChaseState(scene);
  for (const { vehicleId, delta } of changes) {
    const vehicle = vehicleById(state, vehicleId);
    const actor = resolveActor(vehicle);
    if (!vehicle || !actor || !delta) continue;
    const result = await writeIntegrityThrough(actor, delta);
    results.push({ vehicleId, ...result });
    const data = { name: esc(actor.name), amount: Math.abs(delta), value: result.after.value, max: result.after.max };
    lines.push(loc(delta < 0 ? "Card.Integrity" : "Card.Repaired", data));
    if (result.cue === "wreck") lines.push(loc("Card.Wrecked", { name: esc(actor.name) }));
  }
  const worst = results.some(r => r.cue === "wreck") ? "wreck" : (results.find(r => r.cue)?.cue ?? null);
  await mutateChase(scene, s => {
    for (const r of results) {
      const v = vehicleById(s, r.vehicleId);
      if (v) v.wrecked = r.wrecked;
    }
    for (const c of changes) {
      const v = c.clearQueue ? vehicleById(s, c.vehicleId) : null;
      if (v) v.pendingDamage = 0;
    }
    if (worst) s.cue = cue(worst);
  });
  await postIntegrityCard(lines);
}

/* -------------------------------------------- dialogs */

const DialogV2 = () => foundry.applications.api.DialogV2;

function formValues(form) {
  const out = {};
  for (const element of form?.elements ?? []) {
    if (!element.name) continue;
    out[element.name] = element.type === "checkbox" ? element.checked : element.value;
  }
  return out;
}

const selectHtml = (name, options, selected) => `<select name="${name}">${options
  .map(o => `<option value="${esc(o.value)}"${String(o.value) === String(selected) ? " selected" : ""}>${esc(o.label)}</option>`).join("")}</select>`;
const field = (label, input, hint = "") => `<div class="form-group"><label>${esc(label)}</label><div class="form-fields">${input}</div>${hint ? `<p class="hint">${hint}</p>` : ""}</div>`;
const tierOptions = () => [1, 2, 3].map(t => ({ value: t, label: loc("Review.TierN", { tier: t }) }));
const bandOptions = () => CHASE_BANDS.map(b => ({ value: b, label: loc(`Band.${b}`) }));

function reviewContent(pending, state) {
  const vehicle = vehicleById(state, pending.vehicleId);
  const target = vehicleById(state, pending.targetId);
  const name = v => (v ? vehicleFacts(v).name : "—");
  const s = pending.suggest ?? {};
  const parts = [`<p class="hint">${esc(loc("Review.Hint"))}</p>`];
  switch (pending.kind) {
    case "pilot": {
      const winnerOptions = [
        { value: "chaser", label: name(vehicle) }, { value: "lead", label: name(target) }, { value: "", label: loc("Review.Tie") },
      ];
      parts.push(field(loc("Review.Winner"), selectHtml("winner", winnerOptions, pending.winner ?? "")));
      parts.push(field(loc("Review.NewBand", { name: name(vehicle) }), selectHtml("band", bandOptions(), s.band ?? vehicle?.band)));
      const rammedOptions = [{ value: vehicle?.id, label: name(vehicle) }, { value: target?.id, label: name(target) }];
      parts.push(field(loc("Review.Rammed"), selectHtml("rammedId", rammedOptions, s.rammedId ?? target?.id)));
      parts.push(field(loc("Review.RamDamage"), `<input type="number" name="ramDamage" min="0" step="1" value="0">`, esc(loc("Review.RamHint"))));
      break;
    }
    case "sensorLock":
      parts.push(field(loc("Review.Tier"), selectHtml("tier", tierOptions(), pending.tier)));
      parts.push(field(loc("Review.Lock", { target: name(target) }), `<input type="checkbox" name="lock"${s.lock ? " checked" : ""}>`));
      break;
    case "jam":
      parts.push(field(loc("Review.JamLands", { target: name(target) }), `<input type="checkbox" name="jam"${s.jam ? " checked" : ""}>`,
        esc(loc("Review.JamTotals", { jammer: pending.total, defender: pending.defenseTotal }))));
      break;
    case "terrain":
      parts.push(field(loc("Review.Tier"), selectHtml("tier", tierOptions(), pending.tier)));
      parts.push(field(loc("Review.Success"), `<input type="checkbox" name="success"${s.success ? " checked" : ""}>`));
      parts.push(field(loc("Review.EdgeTo"), selectHtml("edgeTo", [
        { value: "pilot", label: loc("Station.pilot") }, { value: "gunner", label: loc("Station.turrets") },
      ], s.edgeTo)));
      break;
    case "gunnery":
    case "passenger": {
      const byTier = pending.damageByTier ?? [];
      parts.push(field(loc("Review.Tier"), selectHtml("tier", tierOptions(), pending.tier)));
      parts.push(field(loc("Review.Hit"), `<input type="checkbox" name="hit"${s.hit ? " checked" : ""}>`));
      const hint = byTier[2] != null ? esc(loc("Review.DamageHint", { t1: byTier[1], t2: byTier[2], t3: byTier[3] })) : esc(loc("Review.DamageManual"));
      parts.push(field(loc("Review.Damage", { target: name(target) }),
        `<input type="number" name="damage" min="0" step="1" value="${Number(s.damage) || 0}" data-by-tier="${esc(JSON.stringify(byTier))}">`, hint));
      break;
    }
    default:
      break;
  }
  return `<div class="ghostwire-chase-review">${parts.join("")}</div>`;
}

function decisionFrom(pending, values) {
  switch (pending.kind) {
    case "pilot": return { band: values.band, rammedId: values.rammedId, ramDamage: Number(values.ramDamage) || 0, winner: values.winner || null };
    case "sensorLock": return { lock: !!values.lock };
    case "jam": return { jam: !!values.jam };
    case "terrain": return { success: !!values.success, edgeTo: values.edgeTo };
    case "gunnery":
    case "passenger": return { hit: !!values.hit, damage: Number(values.damage) || 0 };
    default: return {};
  }
}

/** Tier edits re-suggest the damage and the lock / read result, so the Director only edits what is wrong. */
function wireReviewForm(root, pending) {
  const form = root?.querySelector?.("form") ?? root;
  const tier = form?.querySelector?.("[name=tier]");
  if (!tier) return;
  tier.addEventListener("change", () => {
    const t = Number(tier.value);
    const damage = form.querySelector("[name=damage]");
    if (damage) {
      const byTier = JSON.parse(damage.dataset.byTier || "[]");
      if (byTier[t] != null) damage.value = byTier[t];
    }
    const lock = form.querySelector("[name=lock]") ?? form.querySelector("[name=success]");
    if (lock) lock.checked = testSucceeds(t);
    if (pending.kind === "gunnery" || pending.kind === "passenger") {
      const hit = form.querySelector("[name=hit]");
      if (hit) hit.checked = true;
    }
  });
}

/**
 * The Director's adjust-before-commit window. Nothing is written unless Confirm is pressed.
 * A fresh roll (not yet in the queue) that the Director keeps for later is queued here.
 */
export async function reviewPending(scene, pending, { queued = true } = {}) {
  if (!game.user.isGM || !pending) return;
  if (pending.kind === "pass") return commitPending(scene, pending, {});
  const state = readChaseState(scene);
  if (!state) return;
  const result = await DialogV2().wait({
    window: { title: loc("Review.Title", { summary: pending.summary ?? "" }), icon: "fa-solid fa-car-burst" },
    classes: ["ghostwire-chase-review-dialog"],
    content: reviewContent(pending, state),
    buttons: [
      { action: "confirm", label: loc("Review.Confirm"), icon: "fa-solid fa-check", default: true, callback: (event, button) => formValues(button.form) },
      { action: "later", label: loc("Review.Later"), icon: "fa-solid fa-clock" },
      { action: "discard", label: loc("Review.Discard"), icon: "fa-solid fa-trash" },
    ],
    render: (event, dialog) => wireReviewForm(dialog?.element ?? event?.target?.element ?? dialog, pending),
    rejectClose: false,
  });
  if (result === "discard") return mutateChase(scene, s => { s.pending = s.pending.filter(p => p.id !== pending.id); });
  if (!result || (typeof result !== "object")) {
    if (!queued) {
      return mutateChase(scene, s => {
        if (!s.pending.some(p => p.id === pending.id)) s.pending.push(pending);
      });
    }
    return;
  }
  return commitPending(scene, pending, decisionFrom(pending, result));
}

async function commitPending(scene, pending, decision) {
  return mutateChase(scene, s => {
    const out = commitOutcome(s, pending, decision);
    if (out.cue) s.cue = cue(out.cue);
  });
}

async function openIntegrityDialog(scene, vehicleId) {
  const state = readChaseState(scene);
  const vehicle = vehicleById(state, vehicleId);
  const facts = vehicle ? vehicleFacts(vehicle) : null;
  if (!facts?.actor) return;
  const content = `<div class="ghostwire-chase-review">`
    + `<p class="hint">${esc(loc("IntegrityDialog.Now", { value: facts.integrity.value, max: facts.integrity.max }))}</p>`
    + field(loc("IntegrityDialog.Mode"), selectHtml("mode", [
      { value: "damage", label: loc("IntegrityDialog.Damage") }, { value: "repair", label: loc("IntegrityDialog.Repair") },
    ], "damage"))
    + field(loc("IntegrityDialog.Amount"), `<input type="number" name="amount" min="0" step="1" value="${vehicle.pendingDamage || 0}">`)
    + field(loc("IntegrityDialog.ClearQueue"), `<input type="checkbox" name="clearQueue"${vehicle.pendingDamage ? " checked" : ""}>`)
    + `</div>`;
  const values = await DialogV2().prompt({
    window: { title: loc("IntegrityDialog.Title", { name: facts.name }) },
    content,
    ok: { label: loc("Review.Confirm"), callback: (event, button) => formValues(button.form) },
    rejectClose: false,
  });
  if (!values) return;
  const amount = Math.max(0, Math.trunc(Number(values.amount) || 0));
  if (!amount && !values.clearQueue) return;
  await applyIntegrityChanges(scene, [{ vehicleId, delta: values.mode === "repair" ? amount : -amount, clearQueue: !!values.clearQueue }]);
}

async function openQueuedDamageDialog(scene) {
  const state = readChaseState(scene);
  const rows = (state?.vehicles ?? []).filter(v => !v.wrecked && v.pendingDamage > 0);
  if (!rows.length) return ui.notifications.info(loc("Queued.None"));
  const content = `<div class="ghostwire-chase-review"><p class="hint">${esc(loc("Queued.Hint"))}</p>`
    + rows.map(v => {
      const facts = vehicleFacts(v);
      return field(loc("Queued.Row", { name: facts.name, value: facts.integrity.value, max: facts.integrity.max }),
        `<input type="number" name="dmg-${esc(v.id)}" min="0" step="1" value="${v.pendingDamage}">`);
    }).join("") + `</div>`;
  const values = await DialogV2().prompt({
    window: { title: loc("Queued.Title") },
    content,
    ok: { label: loc("Queued.Apply"), callback: (event, button) => formValues(button.form) },
    rejectClose: false,
  });
  if (!values) return;
  const changes = rows.map(v => ({ vehicleId: v.id, delta: -Math.max(0, Math.trunc(Number(values[`dmg-${v.id}`]) || 0)), clearQueue: true }));
  await applyIntegrityChanges(scene, changes);
}

/* -------------------------------------------- the app */

let ChaseHudApp = null;
const instance = () => foundry.applications.instances.get(CHASE_APP_ID) ?? null;
let renderTimer = null;

function rerender() {
  const app = instance();
  if (!app?.rendered) return;
  clearTimeout(renderTimer);
  renderTimer = setTimeout(() => app.render(), 60);
}

function crewChoices(scene) {
  const seen = new Set();
  const out = [];
  for (const token of scene?.tokens ?? []) {
    const actor = token.actor;
    if (!actor || isMachineKindDocument(actor) || seen.has(actor.uuid)) continue;
    seen.add(actor.uuid);
    out.push({ value: token.uuid, label: token.name || actor.name });
  }
  return out.sort((a, b) => a.label.localeCompare(b.label));
}

function vehicleChoices(scene, state) {
  const taken = new Set((state?.vehicles ?? []).map(v => v.actorUuid));
  const out = [];
  for (const token of scene?.tokens ?? []) {
    const actor = token.actor;
    if (!actor || !isMachineKindDocument(actor) || machineKindOf(actor) === "baseAsset" || taken.has(actor.uuid)) continue;
    taken.add(actor.uuid);
    out.push({ value: token.uuid, label: token.name || actor.name });
  }
  return out.sort((a, b) => a.label.localeCompare(b.label));
}

function crewFromToken(token) {
  const actor = token?.actor;
  return actor ? { actorUuid: actor.uuid, tokenUuid: token.uuid, name: token.name || actor.name } : null;
}

/** Add a vehicle token to the chase; its riders (0.3.137 passengers) fill Pilot → Systems → Turrets → Ports. */
function addVehicleToState(state, token) {
  const actor = token?.actor;
  if (!actor || state.vehicles.some(v => v.actorUuid === actor.uuid)) return false;
  const vehicle = newVehicle({
    id: foundry.utils.randomID(), actorUuid: actor.uuid, tokenUuid: token.uuid, name: token.name || actor.name,
    side: state.vehicles.length ? "opposition" : "crew",
  });
  autoSeatRiders(vehicle, ridersOf(token).map(rider => crewFromToken(token.parent?.tokens?.get(rider.tokenId))).filter(Boolean));
  state.vehicles.push(vehicle);
  state.leadId ??= vehicle.id;
  return true;
}

function defineChaseHudApp() {
  const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

  return class GhostwireChaseHud extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
      id: CHASE_APP_ID,
      classes: ["ghostwire-chase-hud"],
      window: { title: `${L}.Title`, icon: "fa-solid fa-car-burst", resizable: true },
      position: { width: 760, height: 820 },
      actions: {
        startChase: GhostwireChaseHud.#onStart,
        endChase: GhostwireChaseHud.#onEnd,
        nextPhase: GhostwireChaseHud.#onNext,
        prevPhase: GhostwireChaseHud.#onPrev,
        toggleMute: GhostwireChaseHud.#onMute,
        addVehicle: GhostwireChaseHud.#onAddVehicle,
        addSelected: GhostwireChaseHud.#onAddSelected,
        removeVehicle: GhostwireChaseHud.#onRemoveVehicle,
        makeLead: GhostwireChaseHud.#onMakeLead,
        bandStep: GhostwireChaseHud.#onBandStep,
        unseat: GhostwireChaseHud.#onUnseat,
        pilotContest: GhostwireChaseHud.#onPilot,
        systemsRoll: GhostwireChaseHud.#onSystems,
        fire: GhostwireChaseHud.#onFire,
        pass: GhostwireChaseHud.#onPass,
        review: GhostwireChaseHud.#onReview,
        discard: GhostwireChaseHud.#onDiscard,
        applyQueued: GhostwireChaseHud.#onApplyQueued,
        adjustIntegrity: GhostwireChaseHud.#onAdjustIntegrity,
        openSheet: GhostwireChaseHud.#onOpenSheet,
      },
    };

    static PARTS = {
      hud: { template: `modules/${MODULE_ID}/templates/chase-hud.hbs`, scrollable: [".gw-ch-vehicles"] },
    };

    /** Unsaved row picks (targets, weapons, intents) survive re-renders; they are UI, not chase state. */
    picks = {};

    pick(row, name, fallback) {
      return this.picks[row]?.[name] ?? fallback;
    }

    async _prepareContext() {
      const scene = chaseScene();
      const isGM = game.user.isGM;
      const muted = !!game.settings.get(MODULE_ID, CHASE_MUTE_SETTING);
      const base = { isGM, muted, muteLabel: loc(muted ? "Unmute" : "Mute"), muteHint: loc("MuteHint") };
      if (!scene) return { ...base, noScene: true };
      const state = readChaseState(scene);
      if (!state) return { ...base, noChase: true, sceneName: scene.name, noChaseText: loc(isGM ? "NoChase" : "NoChasePlayer", { scene: scene.name }) };

      const phase = phaseDef(state.phase);
      const current = phaseIndex(state.phase);
      const lead = leadVehicle(state);
      const facts = new Map(state.vehicles.map(v => [v.id, vehicleFacts(v)]));
      const nameOf = id => facts.get(id)?.name ?? "—";
      const crewOptions = crewChoices(scene);
      const overReason = chaseOverReason(state);

      const track = CHASE_BANDS.map(band => ({
        id: band,
        label: loc(`Band.${band}`),
        chips: state.vehicles.filter(v => (v.id !== lead?.id) && (v.band === band))
          .map(v => ({ id: v.id, name: nameOf(v.id), side: v.side, out: isVehicleOut(v) })),
      }));

      const vehicles = state.vehicles.map(vehicle => this.#vehicleContext(vehicle, { state, facts, lead, phase, crewOptions, isGM }));

      return {
        ...base,
        sceneName: scene.name,
        round: loc("Round", { round: state.round }),
        phases: CHASE_PHASES.map((p, i) => ({
          id: p.id, step: p.step, label: loc(`Phase.${p.id}.Label`), current: i === current, done: i < current,
        })),
        phaseLabel: `${phase.step} · ${loc(`Phase.${phase.id}.Label`)}`,
        phaseHint: loc(`Phase.${phase.id}.Hint`),
        isIntegrityPhase: phase.id === "integrity",
        queuedTotal: state.vehicles.reduce((sum, v) => sum + (v.wrecked ? 0 : v.pendingDamage), 0),
        leadName: lead ? nameOf(lead.id) : "—",
        leadHint: loc("LeadHint"),
        track,
        pending: state.pending.map(p => ({
          id: p.id, summary: p.summary ?? p.kind,
          from: game.users.get(p.userId)?.name ?? "",
        })),
        overText: overReason ? loc(`Over.${overReason}`) : null,
        vehicles,
        addOptions: vehicleChoices(scene, state),
        hasVehicles: state.vehicles.length > 0,
      };
    }

    #vehicleContext(vehicle, { state, facts, lead, phase, crewOptions, isGM }) {
      const f = facts.get(vehicle.id);
      const nameOf = id => facts.get(id)?.name ?? "—";
      const out = isVehicleOut(vehicle);
      const isLead = lead?.id === vehicle.id;
      const others = state.vehicles.filter(v => (v.id !== vehicle.id) && !isVehicleOut(v))
        .sort((a, b) => Number(a.side === vehicle.side) - Number(b.side === vehicle.side));
      const targetOptions = row => others.map(v => ({ value: v.id, label: nameOf(v.id), selected: this.pick(row, "target", others[0]?.id) === v.id }));
      const kitTags = [...f.kits].filter(dsid => Object.values(CHASE_KITS).includes(dsid)).map(dsid => loc(`Kit.${dsid}`));
      const tags = [
        ...kitTags.map(label => ({ label, cls: "kit" })),
        ...(vehicle.locks.length ? [{ label: loc("Tag.Locked", { targets: vehicle.locks.map(nameOf).join(", ") }), cls: "ok" }] : []),
        ...(vehicle.jammed ? [{ label: loc("Tag.Jammed"), cls: "warn" }] : []),
        ...(vehicle.terrainEdge ? [{ label: loc(vehicle.terrainEdge.to === "pilot" ? "Tag.TerrainPilot" : "Tag.TerrainGunner"), cls: "ok" }] : []),
        ...(vehicle.pendingDamage ? [{ label: loc("Tag.Queued", { damage: vehicle.pendingDamage }), cls: "hot" }] : []),
        ...(vehicle.wrecked ? [{ label: loc("Tag.Wrecked"), cls: "danger" }] : []),
        ...(vehicle.brokenOff ? [{ label: loc("Tag.BrokenOff"), cls: "warn" }] : []),
      ];
      const { value, max } = f.integrity;
      const pct = max > 0 ? Math.round((Math.max(0, value) / max) * 100) : 0;

      const stations = CHASE_STATIONS.map(station => ({
        id: station,
        label: loc(`Station.${station}`),
        hint: loc(`StationHint.${station}`),
        seated: vehicle.stations[station].map(c => {
          const actor = resolveActor(c);
          return { actorUuid: c.actorUuid, name: actor?.name ?? c.name, missing: !actor };
        }),
        empty: !vehicle.stations[station].length,
        single: SINGLE_SEAT_STATIONS.includes(station),
        canAdd: isGM,
        options: crewOptions,
      }));

      const actions = out ? [] : this.#actionsFor(vehicle, { state, facts, lead, phase, isLead, targetOptions });
      return {
        id: vehicle.id, name: f.name, img: f.img, side: vehicle.side, sideLabel: loc(`Side.${vehicle.side}`),
        sides: CHASE_SIDES.map(s => ({ value: s, label: loc(`Side.${s}`), selected: s === vehicle.side })),
        isLead, out, missing: !f.actor,
        integrity: max > 0 ? `${value} / ${max}` : `${value}`, pct, low: pct <= 25,
        handling: f.handling ?? "—",
        speed: [f.speed, speedBandLabel(f.speedBand)].filter(Boolean).join(" · ") || "—",
        scale: f.scale || "—",
        bandLabel: isLead ? loc("Lead") : loc(`Band.${vehicle.band}`),
        bands: CHASE_BANDS.map(b => ({ value: b, label: loc(`Band.${b}`), selected: b === vehicle.band })),
        tags, stations, actions,
      };
    }

    #actionsFor(vehicle, { state, facts, lead, phase, isLead, targetOptions }) {
      const acted = key => state.acted.includes(key);
      const rows = [];
      const nameOf = id => facts.get(id)?.name ?? "—";
      const actorFor = c => resolveActor(c);
      if (phase.id === "pilots") {
        if (isLead) {
          rows.push({ info: loc("Action.LeadNoContest") });
        } else if (lead) {
          const row = `pilot-${vehicle.id}`;
          const mine = actorFor(vehicle.stations.pilot[0]);
          const theirs = actorFor(lead.stations.pilot[0]);
          const key = actedKey(vehicle.id, "pilot");
          const intent = (who, fallback) => PILOT_INTENTS.map(i => ({ value: i, label: loc(`Intent.${i}`), selected: this.pick(row, who, fallback) === i }));
          rows.push({
            kind: "pilot", row, label: loc("Action.Contest", { lead: nameOf(lead.id) }),
            crewName: mine?.name ?? loc("Action.NoPilot"),
            intents: [
              { name: "chaser", label: loc("Action.IntentOf", { name: nameOf(vehicle.id) }), options: intent("chaser", defaultIntent(vehicle, lead, "chaser")) },
              { name: "lead", label: loc("Action.IntentOf", { name: nameOf(lead.id) }), options: intent("lead", defaultIntent(vehicle, lead, "lead")) },
            ],
            station: "pilot", actorUuid: vehicle.stations.pilot[0]?.actorUuid ?? "",
            canRoll: !acted(key) && (canRollFor(mine) || canRollFor(theirs)) && !!(mine || theirs),
            canPass: !acted(key) && canRollFor(mine),
            acted: acted(key), rollLabel: loc("Action.Roll"),
          });
        }
      }
      if (["sensorLock", "jam", "terrain"].includes(phase.id)) {
        const seat = vehicle.stations.systems[0];
        const crew = actorFor(seat);
        const key = actedKey(vehicle.id, "systems", seat?.actorUuid);
        const row = `${phase.id}-${vehicle.id}`;
        if (!seat) rows.push({ info: loc("Action.EmptySeat", { station: loc("Station.systems") }) });
        else {
          const blocked = phase.id === "sensorLock" && vehicle.jammed;
          rows.push({
            kind: "systems", row, systemsKind: phase.id, label: loc(`Action.${phase.id}`), crewName: crew?.name ?? seat.name,
            targets: phase.id === "terrain" ? null : targetOptions(row),
            edgeTo: phase.id === "terrain" ? TERRAIN_EDGE_TARGETS.map(t => ({ value: t, label: loc(t === "pilot" ? "Station.pilot" : "Station.turrets"), selected: this.pick(row, "edgeTo", "pilot") === t })) : null,
            station: "systems", actorUuid: seat.actorUuid,
            canRoll: !acted(key) && !blocked && canRollFor(crew), canPass: !acted(key) && canRollFor(crew),
            acted: acted(key), blockedText: blocked ? loc("Tag.Jammed") : null, rollLabel: loc(`Action.${phase.id}`),
          });
        }
      }
      if (phase.id === "gunners") {
        for (const station of ["turrets", "ports"]) {
          if (!vehicle.stations[station].length) {
            rows.push({ info: loc("Action.EmptySeat", { station: loc(`Station.${station}`) }) });
            continue;
          }
          for (const seat of vehicle.stations[station]) {
            const crew = actorFor(seat);
            const key = actedKey(vehicle.id, station, seat.actorUuid);
            const row = `${station}-${vehicle.id}-${seat.actorUuid}`;
            const weapons = weaponsOn(station === "ports" ? crew : facts.get(vehicle.id)?.actor);
            rows.push({
              kind: "fire", row, label: loc(station === "ports" ? "Action.PassengerFire" : "Action.Fire"), crewName: crew?.name ?? seat.name,
              targets: targetOptions(row),
              weapons: weapons.length
                ? weapons.map(w => ({ value: w.id, label: w.name, selected: this.pick(row, "weapon", weapons[0].id) === w.id }))
                : [{ value: "", label: loc("Action.NoWeapon"), selected: true }],
              station, actorUuid: seat.actorUuid,
              canRoll: !acted(key) && canRollFor(crew), canPass: !acted(key) && canRollFor(crew),
              acted: acted(key), rollLabel: loc(station === "ports" ? "Action.PassengerFire" : "Action.Fire"),
            });
          }
        }
      }
      return rows;
    }

    _onRender(context, options) {
      super._onRender(context, options);
      const root = this.element;
      for (const select of root.querySelectorAll("[data-pick]")) {
        select.addEventListener("change", event => {
          const el = event.currentTarget;
          (this.picks[el.dataset.row] ??= {})[el.dataset.pick] = el.value;
        });
      }
      for (const select of root.querySelectorAll("[data-edit]")) {
        select.addEventListener("change", event => this.#onEdit(event.currentTarget));
      }
    }

    async #onEdit(el) {
      const scene = chaseScene();
      const { edit, vehicle: vehicleId, station } = el.dataset;
      const value = el.value;
      if (!scene || !value) return;
      if (edit === "band") {
        return mutateChase(scene, s => {
          if (setVehicleBand(s, vehicleId, value)) s.cue = cue("bandShift");
        });
      }
      if (edit === "side") {
        return mutateChase(scene, s => {
          const v = vehicleById(s, vehicleId);
          if (v && CHASE_SIDES.includes(value)) v.side = value;
        });
      }
      if (edit === "seat") {
        const token = fromUuidSync(value);
        const crew = crewFromToken(token);
        if (!crew) return;
        return mutateChase(scene, s => { assignStation(vehicleById(s, vehicleId), station, crew); });
      }
    }

    static async #onStart() {
      const scene = chaseScene();
      if (!scene) return ui.notifications.warn(loc("NoScene"));
      await mutateChase(scene, () => {});
      ui.notifications.info(loc("Started", { scene: scene.name }));
    }

    static async #onEnd() {
      const scene = chaseScene();
      if (!scene || !game.user.isGM) return;
      const confirmed = await DialogV2().confirm({
        window: { title: loc("End") },
        content: `<p>${esc(loc("EndConfirm", { scene: scene.name }))}</p>`,
      });
      if (confirmed) await scene.unsetFlag(MODULE_ID, CHASE_FLAG);
    }

    static async #onNext() {
      const scene = chaseScene();
      await mutateChase(scene, s => { applyPhaseChange(s, advancePhase(s)); });
    }

    static async #onPrev() {
      const scene = chaseScene();
      await mutateChase(scene, s => { applyPhaseChange(s, retreatPhase(s)); });
    }

    static async #onMute() {
      const muted = !!game.settings.get(MODULE_ID, CHASE_MUTE_SETTING);
      await game.settings.set(MODULE_ID, CHASE_MUTE_SETTING, !muted);
      this.render();
    }

    static async #onAddVehicle(event, target) {
      const scene = chaseScene();
      const select = target.closest(".gw-ch-add")?.querySelector("[name=addVehicle]");
      const token = select?.value ? fromUuidSync(select.value) : null;
      if (!token) return ui.notifications.warn(loc("AddPick"));
      await mutateChase(scene, s => addVehicleToState(s, token) || false);
    }

    static async #onAddSelected() {
      const scene = chaseScene();
      const tokens = (globalThis.canvas?.tokens?.controlled ?? []).map(t => t.document).filter(t => t?.actor);
      if (!tokens.length) return ui.notifications.warn(loc("NoSelection"));
      await mutateChase(scene, s => {
        let added = 0;
        for (const token of tokens) if (addVehicleToState(s, token)) added += 1;
        return added ? undefined : false;
      });
    }

    static async #onRemoveVehicle(event, target) {
      const scene = chaseScene();
      const id = target.dataset.vehicle;
      await mutateChase(scene, s => {
        s.vehicles = s.vehicles.filter(v => v.id !== id);
        for (const v of s.vehicles) v.locks = v.locks.filter(l => l !== id);
        s.pending = s.pending.filter(p => (p.vehicleId !== id) && (p.targetId !== id));
        if (s.leadId === id) s.leadId = s.vehicles[0]?.id ?? null;
      });
    }

    static async #onMakeLead(event, target) {
      const scene = chaseScene();
      await mutateChase(scene, s => { if (vehicleById(s, target.dataset.vehicle)) s.leadId = target.dataset.vehicle; });
    }

    static async #onBandStep(event, target) {
      const scene = chaseScene();
      const delta = Number(target.dataset.delta) || 0;
      await mutateChase(scene, s => {
        const v = vehicleById(s, target.dataset.vehicle);
        if (v && setVehicleBand(s, v.id, shiftBand(v.band, delta))) s.cue = cue("bandShift");
      });
    }

    static async #onUnseat(event, target) {
      const scene = chaseScene();
      const { vehicle, station, actor } = target.dataset;
      await mutateChase(scene, s => { unassignStation(vehicleById(s, vehicle), station, actor); });
    }

    #rowPick(target, name) {
      const row = target.closest("[data-row]");
      return row?.querySelector(`[data-pick="${name}"]`)?.value ?? null;
    }

    static async #onPilot(event, target) {
      const scene = chaseScene();
      const state = readChaseState(scene);
      if (!state) return;
      await rollPilotContest(scene, state, target.dataset.vehicle, {
        chaser: this.#rowPick(target, "chaser"), lead: this.#rowPick(target, "lead"),
      });
    }

    static async #onSystems(event, target) {
      const scene = chaseScene();
      const state = readChaseState(scene);
      if (!state) return;
      await rollSystems(scene, state, target.dataset.kind, target.dataset.vehicle, {
        targetId: this.#rowPick(target, "target"), edgeTo: this.#rowPick(target, "edgeTo"),
      });
    }

    static async #onFire(event, target) {
      const scene = chaseScene();
      const state = readChaseState(scene);
      if (!state) return;
      await rollFire(scene, state, target.dataset.vehicle, target.dataset.station, target.dataset.actor, {
        targetId: this.#rowPick(target, "target"), weaponId: this.#rowPick(target, "weapon"),
      });
    }

    static async #onPass(event, target) {
      const scene = chaseScene();
      const state = readChaseState(scene);
      if (!state) return;
      await passStation(scene, state, target.dataset.vehicle, target.dataset.station, target.dataset.actor);
    }

    static async #onReview(event, target) {
      const scene = chaseScene();
      const pending = readChaseState(scene)?.pending.find(p => p.id === target.dataset.pending);
      if (pending) await reviewPending(scene, pending);
    }

    static async #onDiscard(event, target) {
      const scene = chaseScene();
      await mutateChase(scene, s => { s.pending = s.pending.filter(p => p.id !== target.dataset.pending); });
    }

    static async #onApplyQueued() {
      const scene = chaseScene();
      if (scene && game.user.isGM) await openQueuedDamageDialog(scene);
    }

    static async #onAdjustIntegrity(event, target) {
      const scene = chaseScene();
      if (scene && game.user.isGM) await openIntegrityDialog(scene, target.dataset.vehicle);
    }

    static #onOpenSheet(event, target) {
      const state = readChaseState(chaseScene());
      const actor = resolveActor(vehicleById(state, target.dataset.vehicle));
      actor?.sheet?.render({ force: true });
    }
  };
}

/** Open the Chase HUD on the scene being viewed. Every user may; only the Director changes it. */
export function openChaseHud() {
  ChaseHudApp ??= defineChaseHudApp();
  const app = instance() ?? new ChaseHudApp();
  return app.render({ force: true });
}

function toggleChaseHud() {
  const app = instance();
  if (app?.rendered) return app.close();
  return openChaseHud();
}

/** Active GM only: park a roll's outcome in the chase, and open the review for the GM who rolled it. */
async function receivePending(message, data) {
  const pending = data.pending;
  const scene = game.scenes.get(pending.sceneId);
  if (!scene) return;
  const author = message.author ?? message.user ?? null;
  // A Director's own roll goes straight to that Director's review; it is only queued if they keep it.
  if (author?.isGM) {
    if (author.id === game.user.id) await reviewPending(scene, { ...pending, messageId: message.id }, { queued: false });
    return;
  }
  if (!game.users.activeGM?.isSelf) return;
  if (pending.kind === "pass") {
    await mutateChase(scene, s => { markActed(s, pending.actedKey); });
    return;
  }
  await mutateChase(scene, s => {
    if (!s.pending.some(p => p.id === pending.id)) s.pending.push({ ...pending, messageId: message.id });
  });
  ui.notifications.info(loc("PendingNotify", { user: author?.name ?? "", summary: pending.summary ?? "" }));
}

/** Settings, scene control, keybinding, hooks, API. Call during init. */
export function registerChaseHud() {
  game.settings.register(MODULE_ID, CHASE_MUTE_SETTING, {
    name: `${L}.Settings.Muted.Name`, hint: `${L}.Settings.Muted.Hint`,
    scope: "client", config: true, type: Boolean, default: false,
    onChange: () => rerender(),
  });

  game.keybindings.register(MODULE_ID, "chaseHud", {
    name: `${L}.Keybinding`,
    editable: [],
    restricted: false,
    onDown: () => {
      toggleChaseHud();
      return true;
    },
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
  });

  Hooks.on("getSceneControlButtons", controls => {
    const tools = controls.tokens?.tools;
    if (!tools) return;
    tools.ghostwireChaseHud = {
      name: "ghostwireChaseHud",
      title: `${L}.Control`,
      icon: "fa-solid fa-car-burst",
      order: Object.keys(tools).length,
      button: true,
      visible: true,
      onChange: () => toggleChaseHud(),
    };
  });

  Hooks.on("createChatMessage", message => {
    const data = message.flags?.[MODULE_ID]?.[CHASE_FLAG];
    if (!data) return;
    if (data.cue) playChaseCue(data.cue);
    if (data.pending) receivePending(message, data);
  });

  Hooks.on("updateScene", (scene, changes) => {
    if (!foundry.utils.hasProperty(changes, `flags.${MODULE_ID}`)) return;
    const state = foundry.utils.getProperty(changes, `flags.${MODULE_ID}.${CHASE_FLAG}`);
    if (state?.cue?.id && (state.cue.id !== lastCueId) && (scene === chaseScene())) {
      lastCueId = state.cue.id;
      playChaseCue(state.cue.key);
    }
    rerender();
  });
  Hooks.on("canvasReady", rerender);
  Hooks.on("updateActor", rerender);
  Hooks.on("createToken", rerender);
  Hooks.on("deleteToken", rerender);
  Hooks.on("updateToken", (token, changes) => { if ("name" in changes || foundry.utils.hasProperty(changes, "delta")) rerender(); });

  Hooks.once("ready", () => {
    ChaseHudApp ??= defineChaseHudApp();
    const module = game.modules.get(MODULE_ID);
    if (module) {
      module.api = {
        ...(module.api ?? {}),
        openChaseHud, readChaseState, writeIntegrityThrough, reviewPending, playChaseCue,
        chase: {
          CHASE_BANDS, CHASE_PHASES, CHASE_STATIONS, advancePhase, retreatPhase, shiftBand, suggestPilotBand,
          pilotRollPlan, sensorLockPlan, jamPlan, jamDefensePlan, terrainPlan, gunneryPlan, passengerPlan,
          commitOutcome, integrityAfter, weaponTierDamage,
        },
      };
    }
    game.ghostwire = { ...(game.ghostwire ?? {}), openChaseHud };
    console.log(`${MODULE_ID} | Chase HUD: phase stepper, band track and stations registered (Token controls)`);
  });
}
