#!/usr/bin/env node
/**
 * 0.3.144 wave smoke — the ground vehicle catalog rename and the seventeen new plates.
 *
 *   A  **The table is the only source.** Names, makers, roles and art stems come out of
 *      `scripts/vehicle-rename.mjs`; this file asserts the *shipped* lang and pack rows agree with it
 *      rather than re-typing twenty-one names, so a table edit can never drift past the smoke.
 *   B  **Every card is a catalog card.** Twenty-one lang Names match, the flavour line reads
 *      `Catalog Name · Maker · what it is`, and each of the twenty-one keeps the street nickname on
 *      its maker line. The three band templates read `Chassis — Bike / Car / Heavy Ground`.
 *   C  **Art on disk, art in the document.** All seventeen new plates exist; every ground Item points
 *      at its stem; the ground Rustbucket points at `rustbucket-ground.webp` and the drone's own
 *      `rustbucket-drone.webp` is untouched and still on disk; Bulldog and the three chassis Actors
 *      are off Foundry's stock wagon icon on *both* portrait and prototype token.
 *   D  **The migration.** `vehicleRenameFor` renames a stock name, is idempotent on an already-renamed
 *      one, and **refuses** a name a Director chose. Registered in `scripts/module.mjs`.
 *   E  **Nothing mechanical moved.** Handling, Integrity, mod slots, tags, price, echelon, domain and
 *      scale for all twenty-one chassis are byte-identical to the 0.3.143 baseline snapshot below,
 *      which was taken off main at branch start. No `_id` and no `_dsid` moved.
 *   F  **Scope.** Drone documents untouched; no Specials package; the Chase HUD untouched; the drone
 *      half of the machines chapter still calls its quadrotor a Rustbucket; version, README and the
 *      committed Foundry checklist are in place.
 *
 * Run: `node tools/wave-03144-smoke.mjs`
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { atLeast } from "./lib/module-version.mjs";
import {
  CHASSIS_TEMPLATES, MAKERS, NEW_ART_DSIDS, VEHICLE_MAKERS, VEHICLE_RENAMES,
  artPath, flavourLine, isStockVehicleName, vehicleRenameFor,
} from "../scripts/vehicle-rename.mjs";

const fail = [];
const note = (pass, msg) => { if (pass) console.log(`  ✓ ${msg}`); else { fail.push(msg); console.log(`  ✗ ${msg}`); } };

const read = path => readFileSync(path, "utf8").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
const readJson = path => JSON.parse(read(path));
/** Source with every comment line dropped — a header that *names* a call is not the call. */
const code = text => text.split("\n").filter(line => !/^\s*(\/\/|\*|\/\*)/.test(line)).join("\n");

const GROUND = "src/packs/vehicles/ground";
const MACHINES = "src/packs/summons/machines";
const ASSETS = "assets/tokens/vehicles";

const manifest = readJson("module.json");
const lang = readJson("lang/en.json");
const items = lang.GHOSTWIRE.Vehicles.Items;
const machines = lang.GHOSTWIRE.Summons.Machines;

const groundDocs = new Map();
for (const file of readdirSync(GROUND).filter(f => f.endsWith(".json") && !f.startsWith("_"))) {
  const doc = readJson(join(GROUND, file));
  if (doc.system?._dsid) groundDocs.set(doc.system._dsid, { file, doc });
}
const machineDocs = new Map();
for (const file of readdirSync(MACHINES).filter(f => f.endsWith(".json") && !f.startsWith("_"))) {
  const doc = readJson(join(MACHINES, file));
  const dsid = doc.system?._dsid ?? doc.flags?.["draw-steel-ghostwire"]?.dsid;
  if (dsid) machineDocs.set(dsid, { file, doc });
}

/* ================================================================ A — the table is the source */

console.log("\nA) the rename table is the only source");

note(atLeast(manifest.version, "0.3.144"), `module.json is ≥ 0.3.144 (got ${manifest.version})`);
note(Object.keys(VEHICLE_MAKERS).length === 21, `21 ground chassis in the table (got ${Object.keys(VEHICLE_MAKERS).length})`);
note(Object.keys(CHASSIS_TEMPLATES).length === 3, "3 scale-band templates in the table");
note(NEW_ART_DSIDS.length === 14, "14 chassis flagged as new-art this wave");
note(Object.values(VEHICLE_MAKERS).every(row => MAKERS[row.maker]), "every chassis names a house that exists in MAKERS");
note(NEW_ART_DSIDS.every(dsid => VEHICLE_MAKERS[dsid]?.role), "every new-art chassis carries a role for its flavour line");
for (const key of ["velvet", "lanetransit", "sealwarden", "kestrel"]) {
  note(!!MAKERS[key]?.lore, `motor house ${key} carries its own lore line`);
}
note(new Set(Object.values(VEHICLE_MAKERS).map(r => r.name)).size === 21, "no two chassis share a catalog name");

/* ================================================================ B — every card is a catalog card */

console.log("\nB) catalog names, maker lines, street nicknames");

for (const [dsid, row] of Object.entries(VEHICLE_MAKERS)) {
  const entry = items[row.key];
  note(entry?.Name === row.name, `lang Vehicles.Items.${row.key}.Name is "${row.name}"`);
  const flavour = /^<p><em>(.*?)<\/em><\/p>/.exec(entry?.Description ?? "")?.[1] ?? "";
  const parts = flavour.split("·").map(p => p.trim());
  note(parts[0] === row.name, `…${row.key} flavour opens with the catalog name`);
  note(parts[1] === (row.name.split(/\s+/)[0] === MAKERS[row.maker].short.split(/\s+/)[0]
    ? MAKERS[row.maker].full
    : `${MAKERS[row.maker].short} ${row.model}`), `…${row.key} flavour names ${MAKERS[row.maker].full}`);
  if (row.role) note(parts.slice(2).join(" · ") === row.role, `…${row.key} flavour role is "${row.role}"`);
  note(new RegExp(`The street still calls it a <strong>${row.old.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}</strong>`)
    .test(entry?.Description ?? ""), `…${row.key} keeps the street name "${row.old}"`);
  note(flavourLine(dsid, { kind: parts.slice(2).join(" · ") }) === flavour, `…and the table reproduces ${row.key}'s line exactly`);

  if (!row.machineKey) continue;
  note(machines[row.machineKey]?.Name === row.name, `lang Summons.Machines.${row.machineKey}.Name is "${row.name}"`);
}

for (const row of Object.values(CHASSIS_TEMPLATES)) {
  note(machines[row.machineKey]?.Name === row.name, `lang Summons.Machines.${row.machineKey}.Name is "${row.name}"`);
  note(!/street still calls it/.test(machines[row.machineKey]?.Description ?? ""),
    `…and the ${row.name} band template claims no street nickname`);
}

note(!/Token art is a (<strong>)?placeholder/.test(items.Bulldog.Description), "IW Bulldog's Item card no longer apologises for its art");
note(!/Token art is a (<strong>)?placeholder/.test(machines.Bulldog.Description), "…nor does its Machine Actor card");
note(/@UUID\[[^\]]+]\{IW Bulldog\}/.test(machines.Bulldog.Description), "…and its Library SKU link is relabelled");

/* ================================================================ C — art on disk and in the document */

console.log("\nC) seventeen plates, wired");

const NEW_PLATES = [...NEW_ART_DSIDS.map(dsid => VEHICLE_MAKERS[dsid].art), ...Object.values(CHASSIS_TEMPLATES).map(r => r.art)];
note(NEW_PLATES.length === 17, `17 new plates expected (got ${NEW_PLATES.length})`);
for (const stem of NEW_PLATES) note(existsSync(join(ASSETS, `${stem}.webp`)), `${stem}.webp on disk`);
for (const row of Object.values(VEHICLE_MAKERS)) note(existsSync(join(ASSETS, `${row.art}.webp`)), `${row.art}.webp on disk`);

for (const [dsid, row] of Object.entries(VEHICLE_MAKERS)) {
  const entry = groundDocs.get(dsid);
  note(!!entry, `ground Item exists for ${dsid}`);
  note(entry?.doc.img === artPath(row.art), `…${entry?.file} img is ${row.art}.webp`);
  note(entry?.doc.system?.project?.yield?.display?.startsWith(`one ${row.name} chassis`),
    `…and its Fabricate yield prints "${row.name}"`);
}

note(groundDocs.get("rustbucket").doc.img.endsWith("rustbucket-ground.webp"), "the ground Rustbucket is on rustbucket-ground.webp");
note(!groundDocs.get("rustbucket").doc.img.includes("drones/"), "…and not on anything under assets/tokens/drones");
note(existsSync("assets/tokens/drones/rustbucket-drone.webp"), "the Rustbucket drone plate is still on disk");
const droneRust = readdirSync("src/packs/vehicles", { recursive: true })
  .filter(f => String(f).endsWith(".json"))
  .map(f => readJson(join("src/packs/vehicles", String(f))))
  .find(doc => doc.system?._dsid === "rustbucket-drone");
note(droneRust?.img?.endsWith("drones/rustbucket-drone.webp"), "…and the drone Item still points at it");

const WAGON = "icons/environment/settlement/wagon.webp";
for (const [dsid, row] of [...Object.entries(VEHICLE_MAKERS).filter(([, r]) => r.machineKey), ...Object.entries(CHASSIS_TEMPLATES)]) {
  const entry = machineDocs.get(dsid);
  note(!!entry, `Machine Actor exists for ${dsid}`);
  note(entry?.doc.img === artPath(row.art), `…${entry?.file} portrait is ${row.art}.webp`);
  note(entry?.doc.prototypeToken?.texture?.src === artPath(row.art), `…and its prototype token matches`);
  note(entry?.doc.img !== WAGON, `…and it is off the stock wagon icon`);
}

/* ================================================================ D — the migration */

console.log("\nD) the world migration");

const moduleSrc = code(read("scripts/module.mjs"));
note(/import \{ registerVehicleRename \} from "\.\/vehicle-rename\.mjs";/.test(moduleSrc), "module.mjs imports registerVehicleRename");
note(/registerVehicleRename\(\);/.test(moduleSrc), "…and calls it at init");

const stub = (name, dsid) => ({ name, system: { _dsid: dsid } });
note(vehicleRenameFor(stub("Brick", "brick"))?.to === "Ferrum Bastion", "a stock Brick renames to Ferrum Bastion");
note(vehicleRenameFor(stub("Ferrum Bastion", "brick")) === null, "…and an already-renamed one is left alone");
note(vehicleRenameFor(stub("Bessie", "getaway")) === null, "a Director's own name is never overwritten");
note(vehicleRenameFor({ name: "Grey Cab" })?.to === "Grey Ledger Meter", "a dsid-less world copy matches on the old printed name");
note(vehicleRenameFor(stub("Grey Cab", "grey-cab-services")) === null, "…but a dsid we do not rename is skipped even so");
note(vehicleRenameFor(stub("Rustbucket", "rustbucket-drone")) === null, "the Rustbucket **drone** is never caught by the car's rename");
note(isStockVehicleName("brick", "GHOSTWIRE.Vehicles.Items.Brick.Name"), "an unlocalised lang key counts as a stock name");
note(!isStockVehicleName("brick", "Lucky"), "…and an arbitrary string does not");
note(Object.keys(VEHICLE_RENAMES).length === 24, "24 dsids are migratable (21 chassis + 3 templates)");

/* ================================================================ E — nothing mechanical moved */

console.log("\nE) no Handling / Integrity / slot / price movement");

/**
 * The 0.3.143 numbers, read off main at branch start. This wave is art and names; if any of these
 * move, something reached past its brief.
 */
const BASELINE = {
  "brick": [1, 160, 6, 18000, 3, "Ground", "Heavy"],
  "cage": [2, 80, 6, 14000, 3, "Ground", "Vehicle"],
  "clunker": [1, 40, 3, 150, 1, "Ground", "Vehicle"],
  "crotch-rocket": [4, 20, 3, 1000, 1, "Ground", "Light"],
  "flatbed": [1, 120, 6, 5500, 2, "Ground", "Heavy"],
  "getaway": [2, 40, 4, 1200, 1, "Ground", "Vehicle"],
  "grey-cab": [2, 60, 5, 3800, 2, "Ground", "Vehicle"],
  "hardtop": [2, 60, 5, 4500, 2, "Ground", "Vehicle"],
  "iron-giant": [1, 200, 6, 55000, 4, "Ground", "Heavy"],
  "rustbucket": [2, 40, 3, 250, 1, "Ground", "Vehicle"],
  "scrap-bike": [4, 20, 2, 180, 1, "Ground", "Light"],
  "spider-frame": [1, 200, 6, 52000, 4, "Ground", "Heavy"],
  "warbike": [4, 40, 5, 12000, 3, "Ground", "Light"],
  "workhorse": [1, 40, 4, 900, 1, "Ground", "Vehicle"],
  "bulldog": [1, 40, 3, 650, 1, "Ground", "Vehicle"],
  "ash-crawler": [1, 160, 6, 16000, 3, "Ground", "Heavy"],
  "lane-bus": [1, 120, 6, 5200, 2, "Ground", "Heavy"],
  "lane-hopper": [2, 40, 3, 500, 1, "Ground", "Vehicle"],
  "seal-cruiser": [3, 40, 4, 1400, 1, "Ground", "Vehicle"],
  "star-chopper": [4, 20, 2, 700, 1, "Ground", "Light"],
  "white-door": [2, 40, 4, 1300, 1, "Ground", "Vehicle"],
};
for (const [dsid, expected] of Object.entries(BASELINE)) {
  const v = groundDocs.get(dsid)?.doc.flags?.["draw-steel-ghostwire"]?.vehicle ?? {};
  const actual = [v.handling, v.integrity, v.modSlots, v.price, v.echelon, v.domain, v.scale];
  note(JSON.stringify(actual) === JSON.stringify(expected),
    `${dsid} still ${expected[0]} Handling / ${expected[1]} Integrity / ${expected[2]} slots / ¥${expected[3]} / E${expected[4]}`);
}

/* ================================================================ F — scope */

console.log("\nF) scope and deliverables");

note(existsSync("docs/directors/03144-smoke.md"), "the committed Foundry checklist exists");
note(existsSync("docs/directors/03144-vehicle-token-mapping.csv"), "the committed art mapping CSV exists");
note(/`0\.3\.144`/.test(read("README.md")), "README has a 0.3.144 Status entry");

const rawMachines = read("docs/raw/23-machines.md");
const droneHalf = rawMachines.slice(0, rawMachines.indexOf("\n## Vehicles"));
note(/\| Rustbucket \/ Rusted Quad/.test(droneHalf), "the drone roster still calls its quadrotor a Rustbucket");
note(!/Nyx Primer/.test(droneHalf), "…and no ground catalog name leaked into the drone half");
for (const row of Object.values(VEHICLE_MAKERS)) {
  note(rawMachines.includes(`| ${row.name} (${row.old}) /`), `machines roster prints "${row.name} (${row.old})"`);
}
note(/Inventory \(46 crewed platforms\)/.test(rawMachines), "…and the roster is still 46 crewed platforms");

const chase = read("scripts/chase-hud.mjs");
note(!Object.values(VEHICLE_MAKERS).some(row => chase.includes(`"${row.old}"`)), "the Chase HUD hardcodes no chassis name");

let baseRef = "";
for (const ref of ["origin/main", "main"]) {
  try { execFileSync("git", ["rev-parse", "--verify", ref], { stdio: "ignore" }); baseRef = ref; break; } catch { /* next */ }
}
if (baseRef) {
  const changed = execFileSync("git", ["diff", "--name-only", baseRef], { encoding: "utf8" }).split("\n").filter(Boolean);
  note(!changed.some(f => f.startsWith("docs/directors/_")), "no director scratch file staged for commit");
  note(!changed.some(f => f.startsWith("assets/tokens/drones/")), "no drone art touched");
  note(!changed.includes("scripts/chase-hud.mjs"), "the Chase HUD is untouched — Pilot-first seats stay deferred");

  let moved = 0;
  for (const file of changed.filter(f => f.startsWith("src/packs/") && f.endsWith(".json"))) {
    let before;
    try { before = JSON.parse(execFileSync("git", ["show", `${baseRef}:${file}`], { encoding: "utf8" }).replace(/^\uFEFF/, "")); } catch { continue; }
    const after = readJson(file);
    const ids = doc => [doc._id, doc.system?._dsid, doc.flags?.["draw-steel-ghostwire"]?.dsid].filter(Boolean).join("|");
    if (ids(before) !== ids(after)) moved += 1;
  }
  note(!moved, `${changed.length} changed file(s) against ${baseRef}; no _id / _dsid moved`);
} else {
  console.log("  · no main ref to diff against; id and scope checks skipped");
}

note(!/Decompile Specials/i.test(read("lang/en.json")), "nothing ships a Decompile Specials verb — the package stays deferred");

/* ================================================================ */

console.log(fail.length ? `\n0.3.144 smoke FAIL — ${fail.length}` : "\n0.3.144 smoke OK");
for (const msg of fail) console.log(`  - ${msg}`);
process.exit(fail.length ? 1 : 0);
