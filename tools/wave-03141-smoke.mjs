#!/usr/bin/env node
/**
 * 0.3.141 wave smoke — the Chase HUD (vehicle combat HUD).
 *
 *   A  An ApplicationV2 applet registered from the module entrypoint: roster, four stations, the
 *      band track, per-vehicle state, its own phase clock (never Foundry Combat), and one action
 *      per station per phase that rolls the 0.3.138 checklist's Power Rolls.
 *   B  Integrity write-through: committed damage / repair lands on the vehicle Actor's
 *      `system.stamina.value`, and the HUD reads that same field back.
 *   C  SFX on every chase beat from shipped assets, and a per-client mute for the HUD only.
 *   D  Director band fiat that beats any roll.
 *   E  Rolls park a pending outcome; only the Director's confirm changes anything, and the
 *      confirm can change tier / band / hit / damage first.
 *   F  Machines journal + VOIDMARK say how to use it.
 *
 * The phase clock, the track, the roll plans and the commit maths are pure functions in
 * scripts/chase-hud.mjs, so they are executed here rather than re-typed — and so is
 * writeIntegrityThrough, against a mock Actor. Dialogs, PowerRoll and the canvas cannot run in Node,
 * so the rest of the wiring is a scan over comment-stripped source.
 *
 * Run: `node tools/wave-03141-smoke.mjs`
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { atLeast } from "./lib/module-version.mjs";
import { MACHINE_MOD_PROFILES } from "../scripts/machines.mjs";
import { retrieve } from "../scripts/voidmark-rag.mjs";
import {
  CHASE_BANDS, CHASE_FLAG, CHASE_KITS, CHASE_LANG_ROOT, CHASE_MUTE_SETTING, CHASE_PHASES, CHASE_SFX, CHASE_SIDES,
  CHASE_STATIONS, DEFAULT_BAND, PILOT_INTENTS, SINGLE_SEAT_STATIONS, TERRAIN_EDGE_TARGETS, WEAPON_SPREAD,
  advancePhase, applyPhaseChange, assignStation, chaseCueAllowed, chaseOverReason, commitOutcome, gunneryPlan,
  handlingEdge, integrityAfter, integrityCue, jamDefensePlan, jamPlan, jamSucceeds, leadVehicle, machineKitDsids,
  newChaseState, newVehicle, normalizeState, opposedWinner, passengerPlan, pilotRollPlan, pilotSkillFor,
  retreatPhase, sensorLockPlan, setVehicleBand, shiftBand, stationsForPhase, suggestPilotBand, terrainPlan,
  testSucceeds, unassignStation, weaponDamageByTier, weaponTierDamage, writeIntegrityThrough,
} from "../scripts/chase-hud.mjs";

const fail = [];
const note = (pass, msg) => { if (pass) console.log(`  ✓ ${msg}`); else { fail.push(msg); console.log(`  ✗ ${msg}`); } };

const read = path => readFileSync(path, "utf8").replace(/\r\n/g, "\n");
const readJson = path => JSON.parse(read(path));
/** Source with every comment line dropped — a header that *names* a call is not the call. */
const code = text => text.split("\n").filter(line => !/^\s*(\/\/|\*|\/\*)/.test(line)).join("\n");
const bodyOf = (src, signature) => {
  const start = src.indexOf(signature);
  if (start < 0) return "";
  const rest = src.slice(start);
  return rest.slice(0, rest.indexOf("\n}\n") + 1);
};

const manifest = readJson("module.json");
const lang = readJson("lang/en.json");
const localize = key => {
  let node = lang;
  for (const part of String(key).split(".")) {
    if (!node || (typeof node !== "object") || !(part in node)) return null;
    node = node[part];
  }
  return (typeof node === "string") ? node : null;
};
const hudKey = key => `${CHASE_LANG_ROOT}.${key}`;

const HUD_PATH = "scripts/chase-hud.mjs";
const TEMPLATE_PATH = "templates/chase-hud.hbs";
const hudRaw = read(HUD_PATH);
const hud = code(hudRaw);
const moduleSrc = code(read("scripts/module.mjs"));
const template = existsSync(TEMPLATE_PATH) ? read(TEMPLATE_PATH) : "";

/* ================================================================ A — registered applet */

console.log("\nA1) the applet is registered from the module entrypoint");

note(/import \{ registerChaseHud \} from "\.\/chase-hud\.mjs";/.test(moduleSrc), "module.mjs imports registerChaseHud");
note(/^\s*registerChaseHud\(\);/m.test(moduleSrc), "…and calls it during init");
note(moduleSrc.indexOf("registerMachineConditions();") < moduleSrc.indexOf("registerChaseHud();"),
  "…after registerMachineConditions, so conditions follow the Integrity write");
note(/HandlebarsApplicationMixin\(ApplicationV2\)/.test(hud), "the HUD is an ApplicationV2 (Handlebars) applet");
note(/template: `modules\/\$\{MODULE_ID\}\/templates\/chase-hud\.hbs`/.test(hud) && existsSync(TEMPLATE_PATH),
  "…rendering templates/chase-hud.hbs, which ships");
const register = bodyOf(hud, "export function registerChaseHud");
note(/tools\.ghostwireChaseHud = \{/.test(register) && /controls\.tokens\?\.tools/.test(register),
  "a Chase HUD button sits in the Token scene controls (the Director's open path)");
note(/visible: true/.test(register), "…visible to every user (players open it read-only)");
note(/game\.keybindings\.register\(MODULE_ID, "chaseHud"/.test(register), "a keybinding is registered");
note(/game\.ghostwire = \{ \.\.\.\(game\.ghostwire \?\? \{\}\), openChaseHud \}/.test(register), "game.ghostwire.openChaseHud is exposed");
note(/module\.api = \{/.test(register) && /writeIntegrityThrough/.test(register), "…and the module API carries openChaseHud and writeIntegrityThrough");

const actions = [...hud.matchAll(/^\s{8}([a-zA-Z]+): GhostwireChaseHud\.#/gm)].map(m => m[1]);
const used = [...new Set([...template.matchAll(/data-action="([a-zA-Z]+)"/g)].map(m => m[1]))];
note(used.length > 10 && used.every(a => actions.includes(a)), `every data-action in the template is a registered action (${used.length})`);
for (const required of ["startChase", "nextPhase", "prevPhase", "toggleMute", "addVehicle", "bandStep", "pilotContest", "systemsRoll", "fire", "pass", "review", "applyQueued", "adjustIntegrity"]) {
  note(used.includes(required), `…including ${required}`);
}
note(/data-edit="band"/.test(template) && /data-edit="seat"/.test(template) && /data-edit="side"/.test(template),
  "the template has the band-fiat, seat and side selects");

console.log("\nA2) its own turn order — no Foundry Combat");

note(!/game\.combats?\b|Combat\.create|\.nextTurn\(|\.startCombat\(|CONFIG\.Combat/.test(hud), "chase-hud.mjs never reads or drives Foundry Combat");
note(JSON.stringify(CHASE_PHASES.map(p => `${p.step}:${p.id}`)) === JSON.stringify([
  "0:setup", "1:pilots", "2a:sensorLock", "2b:jam", "2c:terrain", "3:gunners", "4:integrity", "5:end",
]), "the phase stepper is 0 → 1 → 2a → 2b → 2c → 3 → 4 → 5");
let clock = { round: 1, phase: "setup" };
const walked = [];
for (let i = 0; i < 9; i += 1) { clock = advancePhase(clock); walked.push(`${clock.round}:${clock.phase}`); }
note(walked.join(",") === "1:pilots,1:sensorLock,1:jam,1:terrain,1:gunners,1:integrity,1:end,2:pilots,2:sensorLock",
  "stepping past End opens the next round at Pilots (Setup happens once)");
note(JSON.stringify(retreatPhase({ round: 2, phase: "pilots" })) === JSON.stringify({ round: 1, phase: "end" })
  && retreatPhase({ round: 1, phase: "setup" }).phase === "setup", "Back undoes a phase, with round-1 Setup as the floor");
note(stationsForPhase("pilots").join() === "pilot" && stationsForPhase("jam").join() === "systems"
  && stationsForPhase("gunners").join() === "turrets,ports" && !stationsForPhase("integrity").length,
  "phase by phase, all vehicles together: each phase names the stations that act in it");

console.log("\nA3) roster, stations, band track");

note(CHASE_STATIONS.join() === "pilot,systems,turrets,ports", "four stations: Pilot · Systems · Turrets · Ports");
note(SINGLE_SEAT_STATIONS.join() === "pilot,systems", "Pilot and Systems are one seat; Turrets and Ports take several");
note(/passengers/i.test(localize(hudKey("StationHint.ports")) ?? "") && !/cargo|boarding/i.test(localize(hudKey("StationHint.ports")) ?? ""),
  "Ports are passengers only (no cargo / boarding port)");
const v = newVehicle({ id: "a", actorUuid: "Actor.a" });
assignStation(v, "pilot", { actorUuid: "Actor.p1", name: "P1" });
assignStation(v, "pilot", { actorUuid: "Actor.p2", name: "P2" });
assignStation(v, "turrets", { actorUuid: "Actor.g1" });
assignStation(v, "turrets", { actorUuid: "Actor.g2" });
assignStation(v, "turrets", { actorUuid: "Actor.g1" });
note(v.stations.pilot.length === 1 && v.stations.pilot[0].actorUuid === "Actor.p2", "seating a second Pilot swaps the seat");
note(v.stations.turrets.length === 2, "Turrets take several gunners, without duplicates");
unassignStation(v, "turrets", "Actor.g1");
note(v.stations.turrets.map(c => c.actorUuid).join() === "Actor.g2", "…and a gunner can be unseated");
note(/const crewTrained = \(actor, skill\) => \(actor\?\.type !== "hero"\) \|\| actorHasSkill\(actor, skill\);/.test(hud)
  && !/wrench|jumpIn|isJumpInCapable/i.test(hud), "anyone-vs-anyone: any hero or NPC can take any seat — nothing is Wrench-gated");
note(/ridersOf\(token\)/.test(bodyOf(hud, "function addVehicleToState")) && /assignStation\(vehicle, "ports", crew\)/.test(hud),
  "a vehicle's riders (0.3.137 passengers) start in its Ports");

note(CHASE_BANDS.map(b => localize(hudKey(`Band.${b}`))).join(" | ") === "Broken off | Extreme | Long | Medium | Close | Ramming / Boarding",
  "the band track uses the 0.3.138 checklist words");
const raw23 = read("docs/raw/23-machines.md");
note(raw23.includes("Broken off ← Extreme → Long → Medium → Close → Ramming / Boarding"), "…the same line the Machines chapter prints");
note(shiftBand("medium", 1) === "close" && shiftBand("ramming", 3) === "ramming" && shiftBand("extreme", -5) === "brokenOff",
  "band shifts clamp to the track");
note(DEFAULT_BAND === "medium", "a vehicle joins at Medium until the Director moves it");
const two = normalizeState({ vehicles: [newVehicle({ id: "a", actorUuid: "A" }), newVehicle({ id: "b", actorUuid: "B", side: "opposition" })] });
note(two.leadId === "a" && leadVehicle(two).id === "a", "the first vehicle is the lead until the Director picks another");
note(chaseOverReason(two) === null, "two live vehicles: the chase is on");
two.vehicles[1].wrecked = true;
note(chaseOverReason(two) === "oneLeft", "…one wrecked: the chase is over");
note(CHASE_SIDES.join() === "crew,opposition", "sides are Crew and Opposition");

console.log("\nA4) per-vehicle state shown");

for (const needle of ["Stat.Integrity", "Stat.Handling", "Stat.Speed", "Stat.Scale", "Stat.Band"]) {
  note(template.includes(`GHOSTWIRE.ChaseHud.${needle}`) && !!localize(hudKey(needle)), `the card shows ${localize(hudKey(needle))}`);
}
note(/machineIntegrity\(actor\)/.test(bodyOf(hud, "function vehicleFacts")), "Integrity is read live off the Actor (machineIntegrity), never cached in the chase");
note(/getFlag\?\.\(MODULE_ID, "machine"\)/.test(bodyOf(hud, "function vehicleFacts")) && /machine\.handling/.test(bodyOf(hud, "function vehicleFacts")),
  "Handling comes from the deployed Actor's 0.3.138 machine flag");
note(/Tag\.Locked/.test(hud) && /Tag\.Jammed/.test(hud) && /Kit\.\$\{dsid\}/.test(hud), "sensor locks, jams and chase mods show as tags");
const kits = machineKitDsids({ armor: { dsid: "plate-up" }, weaponry: { dsid: "turret-ring" }, others: [{ dsid: "sensor-pod" }, { dsid: "signal-mule" }] });
note(kits.has("sensor-pod") && kits.has("signal-mule") && kits.has("turret-ring"), "installed kits are read off flags.installedKits");

console.log("\nA5) the checklist's Power Rolls");

note(/new ds\.rolls\.PowerRoll\("2d10 \+ @chr \+ @skill"/.test(hud) && /type: "test", edges: plan\.edges, banes: plan\.banes/.test(hud),
  "every HUD roll is a real Draw Steel PowerRoll test with the plan's edges and banes");
note(pilotSkillFor({ kind: "drone" }) === "rigging" && pilotSkillFor({ kind: "vehicle", domain: "Air" }) === "piloting"
  && pilotSkillFor({ kind: "vehicle", domain: "Ground" }) === "driving", "Pilot: Driving | Piloting | Rigging, whichever the machine calls for");
let plan = pilotRollPlan({ reflex: 2, skill: "driving", trained: true, handling: 4, opponentHandling: 1 });
note(plan.characteristic === "agility" && plan.value === 2 && plan.skillBonus === 2 && plan.edges === 1 && plan.banes === 0,
  "Pilot: 2d10 + Reflex + skill, higher Handling takes an edge");
note(handlingEdge(2, 2) === 0 && handlingEdge(1, 3) === 0 && handlingEdge(null, 2) === 0, "…a tie, a lower number or a fixed asset gets nothing");
plan = pilotRollPlan({ reflex: 1, skill: "piloting", trained: false, handling: 2, opponentHandling: 2 });
note(plan.banes === 1 && plan.skillBonus === 0, "…untrained on a combat maneuver: bane");
plan = sensorLockPlan({ logic: 2, trained: true, ownKits: ["sensor-pod"], targetKits: ["ghost-coat"] });
note(plan.characteristic === "reason" && plan.skill === "electronics" && plan.edges === 1 && plan.banes === 1 && !plan.share,
  "Sensor lock: Logic + Electronics, Sensor Pod edge, target's Ghost Coat bane");
note(sensorLockPlan({ ownKits: ["storm-lattice", "sensor-pod"] }).edges === 1 && sensorLockPlan({ ownKits: ["storm-lattice"] }).share,
  "…Storm Lattice is one edge (no stacking with a Pod) and shares its lock");
note(jamPlan({ logic: 1, securitySystems: true }).skill === "securitySystems" && jamPlan({ securitySystems: true }).banes === 0,
  "Jam: Logic + Security Systems");
plan = jamPlan({ logic: 1, securitySystems: false, electronics: true });
note(plan.skill === "electronics" && plan.banes === 1 && plan.skillBonus === 2, "…untrained in Security Systems: Electronics at a bane");
note(jamDefensePlan({ ownKits: ["signal-mule"] }).edges === 1 && jamDefensePlan({}).skill === "electronics",
  "…against the lock-holder's Logic + Electronics, Signal Mule edge");
note(jamSucceeds(15, 14) && !jamSucceeds(14, 14), "…a tie keeps the lock");
note(!/uptime/i.test(bodyOf(hud, "async function rollSystems")) && /drains no Uptime/.test(localize(hudKey("Phase.jam.Hint")) ?? ""),
  "…and jamming drains no Uptime (the HUD never touches it, and says so)");
note(terrainPlan({ logic: 1, instinct: 3 }).characteristic === "intuition" && terrainPlan({ logic: 2, instinct: 2 }).skill === "navigation",
  "Terrain read: Logic or Instinct + Navigation");
plan = gunneryPlan({ reflex: 2, logic: 1, trained: true, hasLock: true });
note(plan.banes === 1 && plan.characteristic === "agility" && plan.skill === "gunnery", "Gunnery with a lock: bane (hands-on Reflex + Gunnery)");
note(gunneryPlan({ hasLock: false }).banes === 2, "…without a lock: double bane");
note(gunneryPlan({ reflex: 1, logic: 3, hasLock: true }).sensorFed && !gunneryPlan({ reflex: 1, logic: 3, hasLock: false }).sensorFed,
  "…sensor-fed (Logic + Gunnery) needs the lock");
note(passengerPlan({ might: 1, agility: 2 }).banes === 1, "Passengers fire at a speed bane");
note(testSucceeds(2) && testSucceeds(3) && !testSucceeds(1), "a lock or a terrain read lands on tier 2 or 3");
note(opposedWinner(12, 9) === "a" && opposedWinner(9, 12) === "b" && opposedWinner(10, 10) === null, "opposed rolls: higher total wins, a tie wins nothing");
for (const dsid of Object.values(CHASE_KITS)) {
  note(!!MACHINE_MOD_PROFILES[dsid], `the HUD's kit dsid ${dsid} is a real machine mod profile`);
}
const modDsids = new Set();
for (const file of readdirSync("src/packs/mods", { recursive: true }).filter(f => String(f).endsWith(".json"))) {
  const doc = readJson(join("src/packs/mods", String(file)));
  if (doc.system?._dsid) modDsids.add(doc.system._dsid);
}
for (const dsid of Object.values(CHASE_KITS)) note(modDsids.has(dsid), `…and ships in the mods pack (${dsid})`);

const templates = readJson("scripts/data/weapon-use-templates.json");
note(templates.spread.ranged.low === WEAPON_SPREAD.low && templates.spread.ranged.high === WEAPON_SPREAD.high,
  "suggested gunnery damage uses the same ranged spread as every weapon ability");
note(JSON.stringify(weaponDamageByTier(6)) === JSON.stringify([null, 4, 6, 8]) && weaponTierDamage(2, 1) === 1 && weaponTierDamage(null, 2) === null,
  "…printed damage is the middle tier, the low floors at 1, and no number means the Director sets it");

/* ================================================================ E — nothing until the Director confirms */

console.log("\nE) rolls park a pending outcome; the Director adjusts, then commits");

for (const fn of ["async function rollPilotContest", "async function rollSystems", "async function rollFire"]) {
  const body = bodyOf(hud, fn);
  note(/postPending\(/.test(body) && !/mutateChase|setFlag|\.update\(/.test(body), `${fn.split(" ").pop()} posts dice and a pending outcome, and writes no state`);
}
note(/flags: \{ \[MODULE_ID\]: \{ \[CHASE_FLAG\]: \{ pending: payload/.test(hud), "the pending outcome rides the roll's chat-message flags to the Director");
note(/if \(!game\.users\.activeGM\?\.isSelf\) return;/.test(bodyOf(hud, "async function receivePending")), "…and only the active Director's client queues a player's roll");
const review = bodyOf(hud, "export async function reviewPending");
note(/action: "confirm"/.test(review) && /action: "later"/.test(review) && /action: "discard"/.test(review), "the review offers Confirm / Keep for later / Discard");
note(/if \(!game\.user\.isGM/.test(review), "…and only a Director can review");
const reviewForm = bodyOf(hud, "function reviewContent");
for (const name of ["tier", "winner", "band", "hit", "damage", "ramDamage", "lock", "jam"]) {
  note(new RegExp(`name="${name}"|"${name}"`).test(reviewForm), `…the Director can change ${name} before commit`);
}

const state = normalizeState({
  round: 1, phase: "pilots",
  vehicles: [
    newVehicle({ id: "car", actorUuid: "A.car", side: "crew" }),
    newVehicle({ id: "bike", actorUuid: "A.bike", side: "opposition", band: "long" }),
    newVehicle({ id: "drone", actorUuid: "A.drone", side: "crew", band: "close" }),
  ],
});
state.pending.push({ id: "p1", kind: "pilot", vehicleId: "bike", targetId: "car", actedKey: "bike:pilot:" });
const suggested = suggestPilotBand({ band: "long", winner: "chaser", chaserIntent: "close" });
note(suggested.band === "medium", "a Pilot win suggests one band in the winner's direction");
note(suggestPilotBand({ band: "long", winner: null }).band === "long", "…a tie holds");
note(suggestPilotBand({ band: "ramming", winner: "lead", leadIntent: "ram" }).ram, "…and a ram is only a ram at Ramming / Boarding");
let out = commitOutcome(state, state.pending[0], { band: "extreme", ramDamage: 0 });
note(state.vehicles[1].band === "extreme" && out.cue === "bandShift", "the Director's band (Extreme) wins over the suggestion (Medium)");
note(!state.pending.length && state.acted.includes("bike:pilot:"), "…the pending outcome is gone and the station is marked done");

state.pending.push({ id: "p2", kind: "sensorLock", vehicleId: "car", targetId: "bike", share: true, actedKey: "car:systems:x" });
commitOutcome(state, state.pending[0], { lock: true });
note(state.vehicles[0].locks.includes("bike") && state.vehicles[2].locks.includes("bike"), "a confirmed Storm Lattice lock is shared with the whole side");
state.pending.push({ id: "p3", kind: "jam", vehicleId: "bike", targetId: "car" });
commitOutcome(state, state.pending[0], { jam: true });
note(!state.vehicles[0].locks.length && state.vehicles[0].jammed, "a confirmed jam breaks the target's locks and jams it for the round");
state.pending.push({ id: "p4", kind: "sensorLock", vehicleId: "car", targetId: "bike" });
commitOutcome(state, state.pending[0], { lock: true });
note(!state.vehicles[0].locks.length, "…a jammed vehicle cannot lock again this round");
state.pending.push({ id: "p5", kind: "gunnery", vehicleId: "drone", targetId: "bike" });
commitOutcome(state, state.pending[0], { hit: true, damage: 9 });
state.pending.push({ id: "p6", kind: "passenger", vehicleId: "car", targetId: "bike" });
commitOutcome(state, state.pending[0], { hit: false, damage: 5 });
note(state.vehicles[1].pendingDamage === 9, "a confirmed hit queues its (adjusted) damage on the target; a miss queues nothing");
state.pending.push({ id: "p7", kind: "terrain", vehicleId: "drone" });
commitOutcome(state, state.pending[0], { success: true, edgeTo: "gunner" });
note(state.vehicles[2].terrainEdge?.to === "gunner" && TERRAIN_EDGE_TARGETS.includes("pilot"), "a terrain read hands the edge to the Pilot or the Gunners");
applyPhaseChange(state, advancePhase({ round: 1, phase: "end" }));
note(state.round === 2 && !state.vehicles[0].jammed && !state.vehicles[2].terrainEdge && !state.acted.length,
  "a new round lifts jams, the Gunner edge and the done marks…");
note(state.vehicles[1].band === "extreme" && state.vehicles[2].locks.includes("bike"), "…while bands and live locks carry over");
note(PILOT_INTENTS.join() === "close,open,hold,ram", "Pilot intents are Close / Open / Hold / Ram");

/* ================================================================ D — Director fiat */

console.log("\nD) Director band fiat");

const fiat = normalizeState({ vehicles: [newVehicle({ id: "x", actorUuid: "X" }), newVehicle({ id: "y", actorUuid: "Y" })] });
note(setVehicleBand(fiat, "y", "ramming") && fiat.vehicles[1].band === "ramming", "the Director can set any band outright");
note(setVehicleBand(fiat, "y", "brokenOff") && fiat.vehicles[1].brokenOff && chaseOverReason(fiat) === "oneLeft", "…Broken off takes the vehicle out");
note(setVehicleBand(fiat, "y", "close") && !fiat.vehicles[1].brokenOff, "…and any other band brings it back");
note(!setVehicleBand(fiat, "y", "nowhere"), "…an unknown band is refused");
note(/edit === "band"/.test(hud) && /setVehicleBand\(s, vehicleId, value\)/.test(hud) && /cue\("bandShift"\)/.test(hud),
  "the band select on the card writes the fiat at once and plays the band-shift cue");
note(/bandStep/.test(hud) && /shiftBand\(v\.band, delta\)/.test(hud), "…and the ◀ ▶ buttons step it a band at a time");

/* ================================================================ B — Integrity write-through */

console.log("\nB) Integrity write-through");

note(JSON.stringify(integrityAfter({ value: 30, max: 40 }, -8)) === JSON.stringify({ value: 22, max: 40 }), "damage comes off Integrity");
note(integrityAfter({ value: 5, max: 40 }, -12).value === 0 && integrityAfter({ value: 38, max: 40 }, 10).value === 40, "…floored at 0, capped at max");
note(integrityCue({ value: 5 }, { value: 0 }) === "wreck" && integrityCue({ value: 9 }, { value: 4 }) === "integrity"
  && integrityCue({ value: 4 }, { value: 9 }) === "repair", "0 is a wreck; damage and repair each have a cue");

const writes = [];
const mockActor = {
  system: { stamina: { value: 40, max: 40 } },
  async update(data, options) { writes.push({ data, options }); this.system.stamina.value = data["system.stamina.value"]; },
};
const hit = await writeIntegrityThrough(mockActor, -15);
note(writes.length === 1 && writes[0].data["system.stamina.value"] === 25, "writeIntegrityThrough writes system.stamina.value on the Actor");
note(mockActor.system.stamina.value === 25 && hit.after.value === 25 && !hit.wrecked, "…and the Actor now reads the committed Integrity");
const wreck = await writeIntegrityThrough(mockActor, -99);
note(wreck.wrecked && wreck.cue === "wreck" && mockActor.system.stamina.value === 0, "…down to 0 is a wreck");
await writeIntegrityThrough(mockActor, 0);
note(writes.length === 2, "…and a zero change writes nothing");
note(/writeIntegrityThrough\(actor, delta\)/.test(bodyOf(hud, "async function applyIntegrityChanges")),
  "phase 4 and the Integrity button both commit through writeIntegrityThrough");
note(/"system\.stamina\.value"/.test(read("scripts/machines.mjs")) && /system\?\.stamina/.test(read("scripts/machine-conditions.mjs")),
  "…the same field Deploy stamps and the machine conditions read");

/* ================================================================ C — SFX + mute */

console.log("\nC) sound, and a HUD-only mute");

for (const cue of ["pilot", "sensorLock", "jam", "gunnery", "passenger", "integrity", "wreck", "bandShift", "repair", "terrain"]) {
  const src = CHASE_SFX[cue];
  note(!!src && existsSync(src.replace(/^modules\/draw-steel-ghostwire\//, "")), `${cue} plays a shipped sound (${src?.split("/").pop()})`);
}
note(!chaseCueAllowed({ muted: true }) && chaseCueAllowed({ muted: false }), "muted = silent, unmuted = plays");
note(!chaseCueAllowed({ enabled: false }), "…the world SFX switch still wins");
note(!chaseCueAllowed({ gmOnly: true, isGM: false }) && chaseCueAllowed({ gmOnly: true, isGM: true }), "…and so does SFX: GM only");
note(/game\.settings\.register\(MODULE_ID, CHASE_MUTE_SETTING, \{[\s\S]*?scope: "client"/.test(register) && CHASE_MUTE_SETTING === "chaseHudMuted",
  "the mute is a client setting — one user's mute never silences anyone else");
const play = bodyOf(hud, "export function playChaseCue");
note(/AudioHelper\.play\(\{ src, volume, loop: false, channel: "interface" \}, false\)/.test(play),
  "each client plays its own cue locally (no broadcast), so the mute is honoured");
note(!/masterVolume|globalInterfaceVolume|core", "globalAmbientVolume/.test(hud), "the HUD mute never touches Foundry's own volume settings");
note(/data-action="toggleMute"/.test(template), "the mute button is in the applet");
note(/if \(data\.cue\) playChaseCue\(data\.cue\)/.test(register) && /playChaseCue\(state\.cue\.key\)/.test(register),
  "roll cues ride the chat message; commit cues ride the chase state");

/* ================================================================ scene flags */

console.log("\nstate) scene flags, Director-only writes");

note(CHASE_FLAG === "chaseHud" && /scene\.setFlag\(MODULE_ID, CHASE_FLAG, next\)/.test(hud), "the chase lives on the Scene (flags.draw-steel-ghostwire.chaseHud)");
note(/if \(!game\.user\.isGM\) \{/.test(bodyOf(hud, "export function mutateChase")), "…and only a Director writes it");
const fresh = newChaseState();
note(fresh.phase === "setup" && fresh.round === 1 && Array.isArray(fresh.pending), "a new chase opens at round 1 Setup");

/* ================================================================ i18n */

console.log("\ni18n) every key the HUD reads exists");

const literal = [...new Set([
  ...[...hudRaw.matchAll(/loc\("([A-Za-z.]+)"/g)].map(m => m[1]),
  ...[...template.matchAll(/GHOSTWIRE\.ChaseHud\.([A-Za-z.]+)/g)].map(m => m[1]),
])];
const dynamic = [
  ...CHASE_PHASES.flatMap(p => [`Phase.${p.id}.Label`, `Phase.${p.id}.Hint`]),
  ...CHASE_BANDS.map(b => `Band.${b}`),
  ...CHASE_STATIONS.flatMap(s => [`Station.${s}`, `StationHint.${s}`]),
  ...CHASE_SIDES.map(s => `Side.${s}`),
  ...PILOT_INTENTS.map(i => `Intent.${i}`),
  ...Object.values(CHASE_KITS).map(k => `Kit.${k}`),
  ...["sensorLock", "jam", "terrain"].map(k => `Action.${k}`),
  ...["slow", "standard", "fast", "extreme"].map(k => `SpeedBand.${k}`),
  ...[...hudRaw.matchAll(/note\("([A-Za-z]+)"/g)].map(m => `Note.${m[1]}`),
  "Over.oneLeft", "Mute", "Unmute", "NoChase", "NoChasePlayer", "Tag.TerrainPilot", "Tag.TerrainGunner",
  "Card.Integrity", "Card.Repaired", "Card.GunneryFlavor", "Card.PassengerFlavor", "Action.Fire", "Action.PassengerFire",
  "Title", "Control", "Keybinding", "Settings.Muted.Name", "Settings.Muted.Hint",
];
const missing = [...literal, ...dynamic].filter(key => !localize(hudKey(key)));
note(!missing.length, `${literal.length + dynamic.length} ChaseHud keys resolve${missing.length ? ` — missing: ${missing.join(", ")}` : ""}`);

/* ================================================================ F — journal + VOIDMARK */

console.log("\nF) Machines journal and VOIDMARK");

const section = raw23.slice(raw23.indexOf("#### Chase HUD (Foundry)"), raw23.indexOf("#### Weapons at range"));
note(section.length > 400, "docs/raw/23-machines.md has a Chase HUD (Foundry) section");
for (const [needle, what] of [
  [/vehicle combat HUD/, "calls it the vehicle combat HUD too"],
  [/Token controls/, "says how to open it"],
  [/0 Setup → 1 Pilots → 2a Sensor lock → 2b Jam \/ spoof → 2c Terrain read → 3 Gunners → 4 Integrity → 5 End/, "lists the phases"],
  [/Integrity write-through/, "explains Integrity write-through"],
  [/Director's call on range/, "explains Director band overrides"],
  [/adjusts before anything changes/, "explains the Director's adjust-before-commit"],
  [/does not use Foundry's combat tracker/, "says it is not Foundry Combat"],
  [/Ports are passengers only/, "says Ports are passengers only"],
]) note(needle.test(section), `…which ${what}`);
const machinesJournal = readJson("src/packs/rulebook/ghostwire-systems/23-machines.json");
const vehiclesPage = machinesJournal.pages.find(p => p.name === "Vehicles");
note(/#### Chase HUD \(Foundry\)/.test(vehiclesPage?.text?.markdown ?? "") && /<h4>Chase HUD \(Foundry\)<\/h4>/.test(vehiclesPage?.text?.content ?? ""),
  "the Machines › Vehicles journal page carries it in markdown and rendered HTML");
note((vehiclesPage?.text?.content ?? "").indexOf("Chase HUD (Foundry)") > (vehiclesPage?.text?.content ?? "").indexOf("Chase round checklist"),
  "…right after the chase round checklist");
const index = readJson("data/voidmark-rules-index.json");
note(index.chunks.some(c => /Chase HUD/.test(c.text) && c.audience === "player"), "VOIDMARK indexes the section as player-facing");
for (const q of ["chase HUD", "vehicle combat HUD", "How do I open the Chase HUD?"]) {
  const hits = retrieve(index, q).slice(0, 3);
  note(hits.some(h => /Chase HUD/.test(h.text)), `VOIDMARK "${q}" retrieves it in the top three`);
}

/* ================================================================ ids */

console.log("\nids) no _id or dsid moved");

note(machinesJournal._id === "AqxsZKQapco75Bgx" && vehiclesPage?._id === "mDW1EnmzdfuBh0bV", "the Machines journal and its Vehicles page keep their _ids");
let baseRef = null;
for (const ref of ["origin/main", "main"]) {
  try { execFileSync("git", ["rev-parse", "--verify", "--quiet", ref], { stdio: "pipe" }); baseRef = ref; break; } catch { /* next */ }
}
if (baseRef) {
  const changed = execFileSync("git", ["diff", "--name-only", baseRef, "--", "src/packs"], { encoding: "utf8" }).split("\n").filter(f => f.endsWith(".json"));
  const idsOf = doc => JSON.stringify([
    doc._id, doc.system?._dsid, doc.flags?.["draw-steel-ghostwire"]?.dsid,
    ...(doc.pages ?? []).map(p => p._id), ...(doc.items ?? []).map(i => [i._id, i.system?._dsid]), ...(doc.effects ?? []).map(e => e._id),
  ]);
  let moved = 0;
  for (const file of changed) {
    let before = null;
    try { before = JSON.parse(execFileSync("git", ["show", `${baseRef}:${file}`], { encoding: "utf8" })); } catch { continue; }
    if (!existsSync(file) || idsOf(before) !== idsOf(readJson(file))) moved += 1;
  }
  note(!moved, `${changed.length} changed pack source file(s) against ${baseRef}; no _id / dsid moved`);
} else {
  console.log("  · no main ref to diff against; id check limited to the Machines journal");
}

/* ================================================================ version, checklist */

console.log("\nversion) module, README, checklist");

note(atLeast(manifest.version, "0.3.141"), `module.json is ${manifest.version} (>= 0.3.141)`);
note(/`0\.3\.141` — \*\*The Chase HUD/.test(read("README.md")), "README carries a 0.3.141 Status entry");
const checklistPath = "docs/directors/03141-smoke.md";
note(existsSync(checklistPath), "the committed Foundry checklist ships");
const checklist = existsSync(checklistPath) ? read(checklistPath) : "";
for (const item of [1, 2, 3, 4, 5, 6, 7, 8]) note(new RegExp(`^## ${item}\\.`, "m").test(checklist), `…with a section for check ${item}`);
note(/wave-03141-smoke/.test(checklist), "…and points at this smoke");

/* ================================================================ */

console.log(fail.length ? `\n0.3.141 smoke FAIL — ${fail.length}` : "\n0.3.141 smoke OK");
for (const msg of fail) console.log(`  - ${msg}`);
process.exit(fail.length ? 1 : 0);
