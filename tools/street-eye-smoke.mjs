#!/usr/bin/env node
/**
 * B94 smoke: v1 Street Eye qualify list matches the Machines inventory lock.
 *
 * Run: node tools/street-eye-smoke.mjs
 * Does not write pack JSON or rebuild packs.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { isQualifyingScoutDrone, isStreetEyeAbility, STREET_EYE_DSID } from "../scripts/street-eye.mjs";

const DRONE_DIR = "src/packs/vehicles/drones";
const EXPECTED = new Set([
  "tape-eye",
  "fly",
  "needle",
  "buzz",
  "rustbucket-drone",
  "rotor",
  "spotter",
  "phantom",
]);
const MUST_EXCLUDE = new Set([
  // 0.3.99: Static Crow is a Light Air frame, but Michael dropped its Mark tag rather than
  // widen the Street Eye gate. Its lane-painting is an EW artefact, not a scout designation,
  // so it must stay OUT of the qualify list while Spotter (E1) and Phantom (E4) stay in.
  "static-crow",
  "skitter",
  "junkbug",
  "crawler",
  "sink-floater",
  "taser-bee",
  "choir-box",
  "choir-king",
  "ghost-courier",
  "whisper-run",
  "rattlebox",
  "guard-dog",
  "nest",
  "stinger",
  "hellkite",
  "razorwing",
  "medbot",
  "mule-bot",
]);

const failures = [];
const ok = (cond, msg) => {
  if (!cond) failures.push(msg);
  else console.log(`  ✓ ${msg}`);
};

const asItem = json => ({
  type: json.type,
  system: json.system,
  flags: json.flags,
});

const drones = readdirSync(DRONE_DIR)
  .filter(f => f.endsWith(".json") && f !== "_folder.json")
  .map(f => {
    const json = JSON.parse(readFileSync(join(DRONE_DIR, f), "utf8"));
    return { file: f, dsid: json.system?._dsid, item: asItem(json), vehicle: json.flags?.["draw-steel-ghostwire"]?.vehicle };
  });

console.log("B94 Street Eye qualify smoke\n");

console.log("1) v1 include list");
const qualified = drones.filter(d => isQualifyingScoutDrone(d.item)).map(d => d.dsid).sort();
const expected = [...EXPECTED].sort();
ok(qualified.join(",") === expected.join(","), `qualified dsids: ${qualified.join(", ") || "(none)"}`);
for (const dsid of expected) {
  const row = drones.find(d => d.dsid === dsid);
  ok(!!row, `${dsid} exists in the vehicles pack`);
  if (row) ok(isQualifyingScoutDrone(row.item), `${dsid} qualifies`);
}

console.log("\n2) v1 exclude list");
for (const dsid of [...MUST_EXCLUDE].sort()) {
  const row = drones.find(d => d.dsid === dsid);
  ok(!!row, `${dsid} exists in the vehicles pack`);
  if (row) ok(!isQualifyingScoutDrone(row.item), `${dsid} does not qualify`);
}

console.log("\n3) gate shape (Air + Personal/Light + Recon/Mark/Decoy)");
const rotor = drones.find(d => d.dsid === "rotor");
ok(rotor?.vehicle?.drone === true, "Rotor is a drone");
ok(String(rotor?.vehicle?.domain).startsWith("Air"), "Rotor domain is Air");
ok(String(rotor?.vehicle?.scale).startsWith("Light"), "Rotor scale is Light");
ok(rotor?.vehicle?.tags?.includes("Recon"), "Rotor is tagged Recon");

const stinger = drones.find(d => d.dsid === "stinger");
ok(String(stinger?.vehicle?.domain).startsWith("Air"), "Stinger is Air but Vehicle-scale");
ok(String(stinger?.vehicle?.scale).toLowerCase().startsWith("vehicle"), "Stinger scale is Vehicle");

const skitter = drones.find(d => d.dsid === "skitter");
ok(skitter?.vehicle?.tags?.includes("Recon"), "Skitter is Recon but Ground — v1.1");
ok(String(skitter?.vehicle?.domain).startsWith("Ground"), "Skitter domain is Ground");

console.log("\n4) sheet decision (one ability, inventory-gated)");
const fakeEye = { type: "ability", system: { _dsid: STREET_EYE_DSID }, flags: { "draw-steel-ghostwire": { streetEyeGranted: true } } };
ok(isStreetEyeAbility(fakeEye), "Street Eye copies are recognized by _dsid");
ok(!isStreetEyeAbility(rotor.item), "a drone treasure is not Street Eye");
ok(isQualifyingScoutDrone(rotor.item) === true, "Rotor in inventory ⇒ grant");
ok(isQualifyingScoutDrone(stinger.item) === false, "Stinger-only inventory ⇒ no grant");

const byDsid = Object.fromEntries(drones.map(d => [d.dsid, d.item]));
const shouldGrant = items => items.some(isQualifyingScoutDrone);
const path = (label, dsids, expect) => {
  const items = dsids.map(id => byDsid[id]);
  ok(items.every(Boolean), `${label}: inventory dsids exist`);
  ok(shouldGrant(items) === expect, `${label}: Street Eye ${expect ? "ON" : "OFF"}`);
};

console.log("\n5) Michael verify matrix (inventory → Street Eye)");
path("empty sheet", [], false);
path("add Rotor", ["rotor"], true);
path("remove Rotor", [], false);
path("add Tape-Eye", ["tape-eye"], true);
path("Rotor + Tape-Eye (still one grant)", ["rotor", "tape-eye"], true);
path("Stinger only", ["stinger"], false);
path("Guard-Dog only", ["guard-dog"], false);
path("Stinger + Rotor", ["stinger", "rotor"], true);
path("remove Rotor, keep Stinger", ["stinger"], false);
const wrenchDac = "src/packs/classes/wrench/abilities/deploy-and-command.json";
ok(existsSync(wrenchDac), "Wrench Deploy & Command source JSON is unchanged on disk");
if (existsSync(wrenchDac)) {
  const dac = JSON.parse(readFileSync(wrenchDac, "utf8"));
  ok(dac.system?._dsid === "deploy-and-command", "Wrench signature _dsid is still deploy-and-command");
  ok(dac._id === "9ak5OVKlBxDB4Y0j", "Wrench Deploy & Command item id is unchanged");
}
const hook = readFileSync("scripts/street-eye.mjs", "utf8");
ok(!hook.includes("deploy-and-command"), "Street Eye hook does not mention or touch Deploy & Command");

if (failures.length) {
  console.error(`\n${failures.length} failure(s):`);
  for (const msg of failures) console.error(`  ✗ ${msg}`);
  process.exit(1);
}
console.log("\nB94 Street Eye smoke: ok");
