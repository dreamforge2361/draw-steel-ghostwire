#!/usr/bin/env node
/**
 * S8 (0.3.98) — vehicles / drones / machine mods build-out smoke.
 *
 * Covers the S8 lock brief (docs/directors/S8-vehicle-drone-mods-brief.md):
 *   1. every chassis + machine mod SKU has a real ¥ on the catalog flag path
 *   2. every chassis + machine mod carries stock Draw Steel Project fields
 *      (goal on the trinket ladder, prerequisites, roll characteristics, yield)
 *   3. the locked Echelon coverage rule holds for drones and crewed vehicles
 *   4. §5F ladders stay one-at-a-time; every machine mod has a kit profile
 *   5. the drone / vehicle / mod kiosk presets resolve the new SKUs
 *   6. lang + rules docs are in sync with the packs
 *
 * Run (no live Foundry needed): node tools/s8-machines-smoke.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { catalogPrice } from "../scripts/kiosk.mjs";
import { getPreset, listingsFromItems } from "../scripts/kiosk-presets.mjs";
import { MACHINE_MOD_PROFILES, kitProfile } from "../scripts/machines.mjs";
import { atLeast } from "./lib/module-version.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const fail = [];
const ok = [];
const note = (pass, msg) => (pass ? ok.push(`  ✓ ${msg}`) : fail.push(msg));

const readJson = path => JSON.parse(readFileSync(path, "utf8"));
const module = readJson("module.json");
const lang = readJson("lang/en.json");
const langVehicles = lang.GHOSTWIRE.Vehicles.Items;
const langMods = lang.GHOSTWIRE.Mods.Items;

/** Draw Steel trinket crafting ladder (system pack: E1 150 / E2 300 / E3 450 / E4 600). */
const PROJECT_GOAL = { 1: 150, 2: 300, 3: 450, 4: 600 };

/** Tags that name a role for the Echelon coverage rule (shape / mobility tags do not). */
const ROLE_TAGS = new Set([
  "Anthro", "Aquatic", "Armor", "Assault", "Boarding", "Breach", "Capture", "Cargo",
  "Clunker", "Combat", "Command", "Courier", "Covert", "Crew-car", "Decoy", "EW",
  "Extraction", "Infiltrate", "Insertion", "Mark", "Medic", "Medical", "Nonlethal",
  "Patrol", "Pursuit", "Recon", "Repair", "Sabotage", "Secure", "Sentry", "Stealth",
  "Survival", "Transit", "Troop", "Utility", "Workshop",
]);

function scan(pack) {
  const base = join("src/packs", pack);
  const rows = [];
  for (const file of readdirSync(base, { recursive: true })) {
    const rel = String(file).replaceAll("\\", "/");
    if (!rel.endsWith(".json") || rel.endsWith("_folder.json")) continue;
    const data = readJson(join(base, rel));
    if (!data._id || data._key?.startsWith("!folders!")) continue;
    rows.push({ ...data, pack, path: rel.replace(/\.json$/, ""), id: data._id, uuid: `Compendium.${MODULE_ID}.${pack}.Item.${data._id}` });
  }
  return rows;
}

const vehiclesPack = scan("vehicles");
const modsPack = scan("mods");
const gw = doc => doc.flags?.[MODULE_ID] ?? {};
const chassis = vehiclesPack.filter(doc => gw(doc).vehicle);
const drones = chassis.filter(doc => gw(doc).vehicle.drone);
const crewed = chassis.filter(doc => !gw(doc).vehicle.drone);
const machineMods = modsPack.filter(doc => doc.path.startsWith("vehicles/"));

console.log("S8 vehicles / drones / machine mods smoke (0.3.98)\n");

console.log("1) Ship surface");
note(atLeast(module.version, "0.3.98"), `module.json is ≥ 0.3.98 (got ${module.version})`);
note(crewed.length >= 47, `crewed platforms published (got ${crewed.length})`);
note(drones.length >= 40, `drone chassis published (got ${drones.length})`);
note(machineMods.length >= 24, `vehicle/drone mods published (got ${machineMods.length})`);

console.log("\n2) Every SKU carries a real ¥ on the catalog flag path");
const priceless = [...chassis, ...modsPack].filter(doc => !(catalogPrice(doc) > 0));
note(priceless.length === 0, `no ¥0 / missing-price SKUs (offenders: ${priceless.map(d => d.system._dsid).join(", ") || "none"})`);
const nox = chassis.find(doc => doc.system._dsid === "nox-trash-freighter");
note(catalogPrice(nox) === 2800, `Nox's Trash Freighter prices at ¥2,800 replacement (got ${catalogPrice(nox)})`);
note(gw(nox).vehicle.tags.includes("Plot"), "Nox keeps the Plot tag so it stays off the Vehicle Lot shelf");

console.log("\n3) Project (downtime) fields on every chassis and machine mod");
const badProject = [];
for (const doc of [...chassis, ...machineMods]) {
  const project = doc.system?.project ?? {};
  const echelon = doc.system?.echelon;
  const okRow = project.goal === PROJECT_GOAL[echelon]
    && typeof project.prerequisites === "string" && project.prerequisites.length > 10
    && Array.isArray(project.rollCharacteristic) && project.rollCharacteristic.length > 0
    && typeof project.yield?.display === "string" && project.yield.display.length > 5
    && typeof project.source === "string" && project.source.length > 5;
  if (!okRow) badProject.push(doc.system._dsid);
}
note(badProject.length === 0, `all ${chassis.length + machineMods.length} chassis + machine mods have stock Project fields (offenders: ${badProject.join(", ") || "none"})`);
const wrongRoll = machineMods.filter(doc => {
  const skill = gw(doc).mod.craftSkill?.[0];
  const roll = doc.system.project.rollCharacteristic.join("/");
  return skill === "repair" ? roll !== "might/reason" : roll !== "reason/intuition";
});
note(wrongRoll.length === 0, `Repair mods roll Might/Reason, Electronics mods roll Reason/Intuition (offenders: ${wrongRoll.map(d => d.system._dsid).join(", ") || "none"})`);

console.log("\n4) Echelon coverage rule (≥5 chassis, ≥3 roles per Echelon 1–4)");
function coverage(list, label) {
  for (const echelon of [1, 2, 3, 4]) {
    const band = list.filter(doc => gw(doc).vehicle.echelon === echelon);
    const roles = new Set();
    for (const doc of band) for (const tag of gw(doc).vehicle.tags) if (ROLE_TAGS.has(tag)) roles.add(tag);
    note(band.length >= 5, `${label} E${echelon} offers ≥5 chassis (got ${band.length})`);
    note(roles.size >= 3, `${label} E${echelon} spans ≥3 roles (got ${roles.size}: ${[...roles].sort().join(", ")})`);
  }
  const e1Clunkers = list.filter(doc => gw(doc).vehicle.echelon === 1 && gw(doc).vehicle.tags.includes("Clunker"));
  note(e1Clunkers.length > 0, `${label} E1 keeps Clunker / Junk options (got ${e1Clunkers.length})`);
}
coverage(drones, "drones");
coverage(crewed, "crewed vehicles");

console.log("\n5) §5F ladders and kit profiles");
const armorKits = machineMods.filter(doc => gw(doc).mod.exclusiveKit === "armor");
const weaponryKits = machineMods.filter(doc => gw(doc).mod.exclusiveKit === "weaponry");
const otherKits = machineMods.filter(doc => !gw(doc).mod.exclusiveKit);
note(armorKits.length === 4, `armor ladder stays four one-at-a-time kits (got ${armorKits.length})`);
note(weaponryKits.length === 4, `weaponry ladder stays four one-at-a-time kits (got ${weaponryKits.length})`);
note(otherKits.length >= 16, `other vehicle/drone mods expanded (got ${otherKits.length})`);
const badHost = machineMods.filter(doc => {
  const mod = gw(doc).mod;
  return !(mod.host?.includes("vehicle") && mod.host?.includes("drone") && mod.slotCost === 1 && mod.modSlots === 0);
});
note(badHost.length === 0, `every machine mod hosts vehicle + drone at slotCost 1 (offenders: ${badHost.map(d => d.system._dsid).join(", ") || "none"})`);
const missingProfile = machineMods.filter(doc => !kitProfile(doc.system._dsid));
note(missingProfile.length === 0, `every machine mod has a MACHINE_MOD_PROFILES entry (offenders: ${missingProfile.map(d => d.system._dsid).join(", ") || "none"})`);
const modDsids = new Set(machineMods.map(doc => doc.system._dsid));
const orphanProfiles = Object.keys(MACHINE_MOD_PROFILES).filter(dsid => !modDsids.has(dsid));
note(orphanProfiles.length === 0, `no kit profile without a SKU (offenders: ${orphanProfiles.join(", ") || "none"})`);
// Ghost Rein softens Jump-In; it must never claim to grant it (16-vehicles.md §4 firewall).
note(kitProfile("ghost-rein")?.jumpInCapable !== true, "Ghost Rein does not grant Jump-In (Rigger Cocoon only)");
note(kitProfile("rigger-cocoon")?.jumpInCapable === true, "Rigger Cocoon still carries jumpInCapable");

console.log("\n6) Table vendors — drone / vehicle / mod kiosk presets");
const catalog = [...vehiclesPack, ...modsPack].map(doc => ({
  pack: doc.pack, path: doc.path, id: doc.id, uuid: doc.uuid,
  folder: doc.folder, system: doc.system, flags: doc.flags, type: doc.type, name: doc.name,
}));
const droneShelf = listingsFromItems(catalog, "drones");
const vehicleShelf = listingsFromItems(catalog, "vehicles");
const modShelf = listingsFromItems(catalog, "mods");
note(getPreset("mods") !== null, "a mods preset exists (Chop Shop vendor)");
note(droneShelf.length === drones.length, `Drone Vendor stocks every drone SKU (${droneShelf.length} / ${drones.length})`);
note(vehicleShelf.length === crewed.length - 1, `Vehicle Lot stocks every crewed platform but the Plot freighter (${vehicleShelf.length} / ${crewed.length - 1})`);
note(modShelf.length === modsPack.length, `Chop Shop stocks every mod SKU (${modShelf.length} / ${modsPack.length})`);
const shelfIds = ids => new Set(ids.map(row => row.uuid.split(".").pop()));
const droneIds = shelfIds(droneShelf);
const vehicleIds = shelfIds(vehicleShelf);
const modIds = shelfIds(modShelf);
for (const dsid of ["static-crow", "kiln-beetle", "second-face", "tide-wraith"]) {
  const doc = drones.find(d => d.system._dsid === dsid);
  note(doc && droneIds.has(doc._id), `new drone ${dsid} lands on the Drone Vendor shelf`);
}
for (const dsid of ["dock-tug", "trauma-barge", "lane-bus", "gale-runner", "ash-crawler", "black-ledger", "longshore"]) {
  const doc = crewed.find(d => d.system._dsid === dsid);
  note(doc && vehicleIds.has(doc._id), `new vehicle ${dsid} lands on the Vehicle Lot shelf`);
}
for (const dsid of ["lane-skirt", "spool-rig", "burner-plates", "drop-harness", "signal-mule", "ghost-rein", "deep-shell", "spoof-cowl", "kick-drive", "storm-lattice"]) {
  const doc = machineMods.find(d => d.system._dsid === dsid);
  note(doc && modIds.has(doc._id), `new mod ${dsid} lands on the Chop Shop shelf`);
}
note(!vehicleIds.has(nox._id), "Plot freighter still excluded from the Vehicle Lot");

console.log("\n7) Lang + rules sync");
const langKeyOf = doc => doc.system.description.value.split(".").at(-2);
const missingLang = [];
for (const doc of chassis) {
  const entry = langVehicles[langKeyOf(doc)];
  if (!entry?.Name || !entry?.Description) missingLang.push(doc.system._dsid);
}
for (const doc of modsPack) {
  const entry = langMods[langKeyOf(doc)];
  if (!entry?.Name || !entry?.Description) missingLang.push(doc.system._dsid);
}
note(missingLang.length === 0, `every SKU resolves a lang Name + Description (offenders: ${missingLang.join(", ") || "none"})`);
const noFabricate = chassis.filter(doc => !langVehicles[langKeyOf(doc)].Description.includes("Fabricate (§Craft Project)"));
note(noFabricate.length === 0, `every chassis card prints its Fabricate Project (offenders: ${noFabricate.map(d => d.system._dsid).join(", ") || "none"})`);
const modLinkCount = desc => (desc.match(/@UUID\[Compendium\.draw-steel-ghostwire\.mods\.Item\./g) ?? []).length;
const staleSlots = chassis.filter(doc => modLinkCount(langVehicles[langKeyOf(doc)].Description) !== machineMods.length);
note(staleSlots.length === 0, `every chassis mod-slot paragraph links all ${machineMods.length} machine mods (offenders: ${staleSlots.map(d => d.system._dsid).join(", ") || "none"})`);
const noProjectLine = machineMods.filter(doc => !langMods[langKeyOf(doc)].Description.includes("Fabricate (§Craft Project)"));
note(noProjectLine.length === 0, `every machine-mod card prints its Fabricate Project (offenders: ${noProjectLine.map(d => d.system._dsid).join(", ") || "none"})`);

const machinesRaw = readFileSync("docs/raw/23-machines.md", "utf8");
const modsRaw = readFileSync("docs/raw/10-mods.md", "utf8");
const gearMaster = readFileSync("docs/masters/GHOSTWIRE_GEAR_MASTER.md", "utf8");
const vehiclesChapter = readFileSync("docs/rulebook/16-vehicles.md", "utf8");
const dronesChapter = readFileSync("docs/rulebook/15-drones.md", "utf8");
const modsChapter = readFileSync("docs/rulebook/14-mods.md", "utf8");
const kioskDirector = readFileSync("docs/directors/scene-kiosk-merchant.md", "utf8");

const newNames = ["Dock Tug", "Trauma Barge", "Lane Bus", "Gale-Runner", "Ash-Crawler", "Black Ledger", "Longshore",
  "Static Crow", "Kiln-Beetle", "Second Face", "Tide-Wraith"];
const newModNames = ["Lane Skirt", "Spool Rig", "Burner Plates", "Drop Harness", "Signal Mule", "Ghost Rein",
  "Deep Shell", "Spoof Cowl", "Kick Drive", "Storm Lattice"];
note(newNames.every(name => machinesRaw.includes(name)), "player Machines chapter lists every new chassis");
note(newModNames.every(name => modsRaw.includes(name)), "player Mods chapter lists every new machine mod");
note(newModNames.every(name => gearMaster.includes(name)), "Gear master §5F lists every new machine mod");
note(newNames.every(name => gearMaster.includes(name)), "Gear master Cat 5 lists every new chassis");
note(vehiclesChapter.includes("0.3.98") && dronesChapter.includes("0.3.98") && modsChapter.includes("0.3.98"),
  "Stage 3 chapters record the 0.3.98 pass");
note(machinesRaw.includes("Fabricate") && modsRaw.includes("Project Goal"), "rules text documents the Project goal ladder");
note(kioskDirector.includes("Chop Shop"), "Director kiosk note documents the Chop Shop vendor");

for (const line of ok) console.log(line);
if (fail.length) {
  console.error(`\n${fail.length} failed:`);
  for (const line of fail) console.error(`  ✗ ${line}`);
  process.exit(1);
}
console.log(`\n${ok.length} checks passed.`);
