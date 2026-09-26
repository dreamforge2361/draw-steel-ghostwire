#!/usr/bin/env node
/**
 * 0.3.146 wave smoke — the Chase HUD seats the Pilot first.
 *
 *   A  A joining vehicle's riders auto-fill in station order: 1st → Pilot, 2nd → Systems,
 *      3rd → Turrets, 4th and up → Ports. Zero riders still joins with four empty seats.
 *   B  The single-seat rule is respected: Pilot and Systems hold one crew member, and a single seat
 *      that is already filled is skipped rather than swapped.
 *   C  addVehicleToState uses that order (it used to drop every rider into the Ports).
 *   D  Nothing else in the chase moved — phases, bands, roll plans, Integrity and SFX are untouched.
 *   E  The book says the new order; version, README and the Foundry checklist ship.
 *   F  wave-03141 (the Chase HUD wave) is still green.
 *
 * The order is a pure function (autoSeatPlan / autoSeatRiders) in scripts/chase-hud.mjs, so it is
 * executed here rather than re-typed. Foundry's canvas, tokens and passenger flags cannot run in
 * Node, so the wiring in addVehicleToState is a scan over comment-stripped source.
 *
 * Run: `node tools/wave-03146-smoke.mjs`
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

import { atLeast } from "./lib/module-version.mjs";
import {
  AUTO_SEAT_ORDER, CHASE_BANDS, CHASE_PHASES, CHASE_SFX, CHASE_STATIONS, SINGLE_SEAT_STATIONS,
  assignStation, autoSeatPlan, autoSeatRiders, emptyStations, integrityAfter, newVehicle, normalizeState,
  shiftBand, stationsForPhase,
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

const HUD_PATH = "scripts/chase-hud.mjs";
const hudRaw = read(HUD_PATH);
const hud = code(hudRaw);
const manifest = readJson("module.json");

/** A rider as crewFromToken hands it over. */
const rider = n => ({ actorUuid: `Actor.r${n}`, tokenUuid: `Scene.s.Token.t${n}`, name: `Rider ${n}` });
const riders = n => Array.from({ length: n }, (_, i) => rider(i + 1));
const seatedAt = (vehicle, station) => (vehicle.stations?.[station] ?? []).map(c => c.name);
const stationsOf = crewList => autoSeatPlan(crewList).map(p => p.station).join(",");

/* ================================================================ A — Pilot first, then Systems → Turrets → Ports */

console.log("\nA) a joining vehicle fills Pilot first");

note(AUTO_SEAT_ORDER.join() === "pilot,systems,turrets,ports", "the auto-seat order is Pilot → Systems → Turrets → Ports");
note(AUTO_SEAT_ORDER.join() === CHASE_STATIONS.join(), "…which is the station order the HUD already prints");

note(stationsOf([]) === "", "zero riders seat nobody");
note(stationsOf(riders(1)) === "pilot", "one rider: the Pilot seat, and nothing else");
note(stationsOf(riders(2)) === "pilot,systems", "two riders: Pilot + Systems");
note(stationsOf(riders(3)) === "pilot,systems,turrets", "three riders: Pilot + Systems + Turrets");
note(stationsOf(riders(4)) === "pilot,systems,turrets,ports", "four riders: the fourth takes the Ports");
note(stationsOf(riders(7)) === "pilot,systems,turrets,ports,ports,ports,ports", "…and the fifth and up ride the Ports with them");

const empty = newVehicle({ id: "v0", actorUuid: "Actor.v0" });
autoSeatRiders(empty, []);
note(JSON.stringify(empty.stations) === JSON.stringify(emptyStations()), "a vehicle with no riders joins with four empty seats, as before");

const solo = autoSeatRiders(newVehicle({ id: "v1", actorUuid: "Actor.v1" }), riders(1));
note(seatedAt(solo, "pilot").join() === "Rider 1" && !seatedAt(solo, "systems").length
  && !seatedAt(solo, "turrets").length && !seatedAt(solo, "ports").length, "one rider is seated at the Pilot station only");

const crewed = autoSeatRiders(newVehicle({ id: "v2", actorUuid: "Actor.v2" }), riders(5));
note(seatedAt(crewed, "pilot").join() === "Rider 1", "five riders: Rider 1 pilots");
note(seatedAt(crewed, "systems").join() === "Rider 2", "…Rider 2 takes Systems");
note(seatedAt(crewed, "turrets").join() === "Rider 3", "…Rider 3 takes the Turrets");
note(seatedAt(crewed, "ports").join() === "Rider 4,Rider 5", "…and Riders 4 and 5 ride the Ports, in order");
const pilotSeat = crewed.stations.pilot[0];
note(pilotSeat.actorUuid === "Actor.r1" && pilotSeat.tokenUuid === "Scene.s.Token.t1" && pilotSeat.name === "Rider 1",
  "the seat carries the rider's Actor uuid, token uuid and name");
note(normalizeState({ vehicles: [crewed] }).vehicles[0].stations.pilot.length === 1,
  "…and the seated state survives normalizeState (it is the shape the scene flag stores)");

note(stationsForPhase("pilots").join() === "pilot" && crewed.stations.pilot.length === 1,
  "phase 1 Pilots names the Pilot station, and a joined vehicle now has somebody in it");

/* ================================================================ B — single seats */

console.log("\nB) single seats are respected, never double-booked");

note(SINGLE_SEAT_STATIONS.join() === "pilot,systems", "Pilot and Systems are still the single seats");
note(crewed.stations.pilot.length === 1 && crewed.stations.systems.length === 1, "…and each took exactly one rider");

const dupes = autoSeatRiders(newVehicle({ id: "v3", actorUuid: "Actor.v3" }), [rider(1), rider(1), rider(2)]);
note(seatedAt(dupes, "pilot").join() === "Rider 1" && seatedAt(dupes, "systems").join() === "Rider 2"
  && !seatedAt(dupes, "turrets").length, "the same Actor listed twice takes one seat, and does not push the next rider along");

const junk = autoSeatRiders(newVehicle({ id: "v4", actorUuid: "Actor.v4" }), [null, { name: "no actor" }, rider(1)]);
note(seatedAt(junk, "pilot").join() === "Rider 1", "a rider with no Actor takes no seat at all");

const preseated = newVehicle({ id: "v5", actorUuid: "Actor.v5" });
assignStation(preseated, "pilot", { actorUuid: "Actor.gm", name: "Director's pick" });
autoSeatRiders(preseated, riders(2));
note(seatedAt(preseated, "pilot").join() === "Director's pick", "a Pilot seat that is already filled is skipped, not swapped");
note(seatedAt(preseated, "systems").join() === "Rider 1" && seatedAt(preseated, "turrets").join() === "Rider 2",
  "…and the riders start one station further down");
const withPilot = assignStation(newVehicle({ id: "v6", actorUuid: "Actor.v6" }), "pilot", { actorUuid: "Actor.gm", name: "Director's pick" });
const firstPlan = autoSeatPlan(riders(2), withPilot).map(p => p.station).join();
note(firstPlan === "systems,turrets" && autoSeatPlan(riders(2), withPilot).map(p => p.station).join() === firstPlan
  && withPilot.stations.systems.length === 0, "autoSeatPlan is pure — it reads the vehicle's seats and writes nothing");
const bothTaken = assignStation(withPilot, "systems", { actorUuid: "Actor.gm2", name: "Director's other pick" });
note(autoSeatPlan(riders(3), bothTaken).map(p => p.station).join() === "turrets,ports,ports",
  "…both single seats already filled: every rider goes to the Turrets and the Ports");

/* ================================================================ C — the join path uses it */

console.log("\nC) addVehicleToState seats on join");

const add = bodyOf(hud, "function addVehicleToState");
note(/ridersOf\(token\)/.test(add) && /crewFromToken\(token\.parent\?\.tokens\?\.get\(rider\.tokenId\)\)/.test(add),
  "the crew still comes from the 0.3.137 passenger riders on the token");
note(/autoSeatRiders\(vehicle,/.test(add), "…and they are handed to autoSeatRiders");
note(!/assignStation\(vehicle, "ports", crew\)/.test(hud), "…not dropped into the Ports any more");
note(/\.filter\(Boolean\)/.test(add), "…a rider whose token or Actor is gone is dropped before seating");
note(!/riders \(0\.3\.137 passengers\) take the Ports/.test(hudRaw),
  "the comment above it no longer says the riders take the Ports");
note(/fill Pilot → Systems → Turrets → Ports/.test(hudRaw), "…it names the new order");
note(/export function autoSeatPlan/.test(hud) && /export function autoSeatRiders/.test(hud) && /export const AUTO_SEAT_ORDER/.test(hud),
  "the order is exported, so it can be asserted offline");

/* ================================================================ D — nothing else moved */

console.log("\nD) the rest of the chase is untouched");

note(JSON.stringify(CHASE_PHASES.map(p => `${p.step}:${p.id}`)) === JSON.stringify([
  "0:setup", "1:pilots", "2a:sensorLock", "2b:jam", "2c:terrain", "3:gunners", "4:integrity", "5:end",
]), "the phase clock is still 0 → 1 → 2a → 2b → 2c → 3 → 4 → 5");
note(CHASE_BANDS.join() === "brokenOff,extreme,long,medium,close,ramming" && shiftBand("medium", 1) === "close",
  "the band track and its clamped steps are unchanged");
note(integrityAfter({ value: 30, max: 40 }, -8).value === 22, "Integrity write-through maths are unchanged");
note(Object.keys(CHASE_SFX).length >= 10 && !!CHASE_SFX.pilot && !!CHASE_SFX.wreck, "the SFX table is unchanged");

let baseRef = null;
for (const ref of ["origin/main", "main"]) {
  try { execFileSync("git", ["rev-parse", "--verify", "--quiet", ref], { stdio: "pipe" }); baseRef = ref; break; } catch { /* next */ }
}
if (baseRef) {
  const changed = execFileSync("git", ["diff", "--name-only", baseRef], { encoding: "utf8" }).split("\n").filter(Boolean);
  const allowed = new Set([
    "README.md", "module.json", "scripts/chase-hud.mjs", "tools/wave-03141-smoke.mjs", "tools/wave-03146-smoke.mjs",
    "docs/directors/03146-smoke.md", "docs/raw/23-machines.md", "data/voidmark-rules-index.json",
    "src/packs/rulebook/ghostwire-systems/23-machines.json",
  ]);
  const extra = changed.filter(f => !allowed.has(f));
  note(!extra.length, `this wave ships alone — ${changed.length} file(s) against ${baseRef}${extra.length ? `, unexpected: ${extra.join(", ")}` : ""}`);
  note(!changed.some(f => f.startsWith("packs/")), "…and no compiled LevelDB pack noise");
  const scripts = changed.filter(f => f.startsWith("scripts/"));
  note(scripts.length <= 1 && (!scripts.length || scripts[0] === HUD_PATH), "…only chase-hud.mjs changed under scripts/");
} else {
  console.log("  · no main ref to diff against; ship-alone check skipped");
}

/* ================================================================ E — book, version, checklist */

console.log("\nE) the book, the version and the checklist");

const SEAT_LINE = "first rider at Pilot, second at Systems, third at Turrets, the rest in the Ports";
const raw23 = read("docs/raw/23-machines.md");
note(raw23.includes(SEAT_LINE), "docs/raw/23-machines.md states the join seat order");
note(/Ports are passengers only/.test(raw23), "…and still says Ports are passengers only");
note(!/anyone already riding the vehicle starts there/.test(raw23), "…with the old Ports-only sentence gone");
const machinesJournal = readJson("src/packs/rulebook/ghostwire-systems/23-machines.json");
const vehiclesPage = machinesJournal.pages.find(p => p.name === "Vehicles");
note((vehiclesPage?.text?.markdown ?? "").includes(SEAT_LINE) && (vehiclesPage?.text?.content ?? "").includes(SEAT_LINE),
  "the Machines › Vehicles journal page says it in markdown and rendered HTML");
note(machinesJournal._id === "AqxsZKQapco75Bgx" && vehiclesPage?._id === "mDW1EnmzdfuBh0bV",
  "…patched in place: the journal and its page keep their _ids");
const index = readJson("data/voidmark-rules-index.json");
note(index.chunks.some(c => c.text.includes(SEAT_LINE)), "VOIDMARK's chase chunk says it too");

note(manifest.version === "0.3.146", `module.json is ${manifest.version}`);
note(atLeast(manifest.version, "0.3.146"), "…and that is at or past 0.3.146");
note(/`0\.3\.146` — \*\*A vehicle joins the chase with somebody at the wheel/.test(read("README.md")),
  "README carries the 0.3.146 Status entry");
const checklistPath = "docs/directors/03146-smoke.md";
note(existsSync(checklistPath), "the committed Foundry checklist ships");
const checklist = existsSync(checklistPath) ? read(checklistPath) : "";
for (const item of [1, 2, 3, 4, 5]) note(new RegExp(`^## ${item}\\.`, "m").test(checklist), `…with a section for check ${item}`);
note(/wave-03146-smoke/.test(checklist), "…and points at this smoke");

/* ================================================================ F — the 0.3.141 wave stays green */

console.log("\nF) wave-03141 regression");

let prior = { ok: false, out: "" };
try {
  prior = { ok: true, out: execFileSync(process.execPath, ["tools/wave-03141-smoke.mjs"], { encoding: "utf8" }) };
} catch (err) {
  prior = { ok: false, out: `${err.stdout ?? ""}${err.stderr ?? ""}` };
}
note(prior.ok && /0\.3\.141 smoke OK/.test(prior.out), "node tools/wave-03141-smoke.mjs is still green");
if (!prior.ok) for (const line of prior.out.split("\n").filter(l => /✗|FAIL|Error/.test(l))) console.log(`      ${line}`);

/* ================================================================ */

console.log(fail.length ? `\n0.3.146 smoke FAIL — ${fail.length}` : "\n0.3.146 smoke OK");
for (const msg of fail) console.log(`  - ${msg}`);
process.exit(fail.length ? 1 : 0);
