#!/usr/bin/env node
/**
 * 0.3.138 wave smoke — chase finalize: one vehicle schema, Handling 1–4, Integrity, anyone-vs-anyone,
 * EW without the Uptime jam drain, and the mod alignments that go with them.
 *
 * The bug this wave fixes is not a crash. It is that the *same* chase stat meant four different things
 * depending on where you read it: the rules chapter said Handling was "an edge/bane/die-step feel", the
 * catalog Items carried no Handling at all, `deployMachine()` stamped the string `"standard"` onto the
 * Actor, and the machine sheet showed a free-text box. Nothing compared. So this smoke drives the real
 * exported rubric out of `scripts/machines.mjs` rather than re-typing the arithmetic, and then checks
 * that the Items, the deployed Actors, the cards, the journals and the VOIDMARK index all say it.
 *
 * Offline only. Deploy, jam rolls and the sheet cannot run without Foundry, so those are source scans
 * over the comment-stripped file — a comment that *names* `handling` is not a line that copies it.
 *
 * Run: `node tools/wave-03138-smoke.mjs`
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import { atLeast } from "./lib/module-version.mjs";
import {
  HANDLING_MAX, HANDLING_MIN, HANDLING_SCALE_BASE, HANDLING_SPEED_STEP, MACHINE_MOD_PROFILES,
  chassisStamina, handlingFromRubric, handlingWithMods, kitProfile, machineBand, vehicleHandling,
} from "../scripts/machines.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const fail = [];
const note = (pass, msg) => { if (pass) console.log(`  ✓ ${msg}`); else { fail.push(msg); console.log(`  ✗ ${msg}`); } };

const read = path => readFileSync(path, "utf8").replace(/\r\n/g, "\n");
const readJson = path => JSON.parse(read(path));
/** Source with every comment line dropped — a header that *names* a call is not the call. */
const code = text => text.split("\n").filter(line => !/^\s*(\/\/|\*|\/\*)/.test(line)).join("\n");

const manifest = readJson("module.json");
const lang = readJson("lang/en.json");
const localize = key => {
  let node = lang;
  for (const part of String(key).split(".")) {
    if (!node || (typeof node !== "object") || !(part in node)) return key;
    node = node[part];
  }
  return (typeof node === "string") ? node : key;
};

/** Every vehicle / drone / base-asset Item in the catalog, with its vehicle flags. */
const vehicleItems = [];
for (const dir of readdirSync("src/packs/vehicles")) {
  const abs = join("src/packs/vehicles", dir);
  if (!statSync(abs).isDirectory()) continue;
  for (const f of readdirSync(abs)) {
    if (!f.endsWith(".json") || f.startsWith("_")) continue;
    const json = readJson(join(abs, f));
    const vehicle = json.flags?.[MODULE_ID]?.vehicle;
    if (vehicle) vehicleItems.push({ file: `${dir}/${f}`, json, vehicle, dsid: json.system?._dsid });
  }
}
const byDsid = new Map(vehicleItems.map(row => [row.dsid, row]));
const mobile = vehicleItems.filter(row => !row.vehicle.baseAsset);

/* ================================================================ 1 — one rubric, one number */

console.log("\n1) Handling is an integer 1–4 and the rubric is the only way it is set");

note(HANDLING_MIN === 1 && HANDLING_MAX === 4, `Handling clamps to ${HANDLING_MIN}–${HANDLING_MAX}`);
note(HANDLING_SCALE_BASE.light === 3 && HANDLING_SCALE_BASE.vehicle === 2
  && HANDLING_SCALE_BASE.heavy === 1 && HANDLING_SCALE_BASE.capital === 1,
  "scale base is Light 3 / Vehicle 2 / Heavy 1 / Capital 1");
note(HANDLING_SCALE_BASE.personal === 3 && HANDLING_SCALE_BASE.micro === 3 && HANDLING_SCALE_BASE.small === 3,
  "Personal / Micro / Small ride the Light base of 3");
note(HANDLING_SPEED_STEP.extreme === 1 && HANDLING_SPEED_STEP.fast === 1
  && HANDLING_SPEED_STEP.standard === 0 && HANDLING_SPEED_STEP.slow === -1,
  "speed band steps extreme|fast +1 / standard 0 / slow −1");

note(handlingFromRubric({ scale: "Light", speedBand: "fast" }) === 4, "Light + fast → 4");
note(handlingFromRubric({ scale: "Vehicle", speedBand: "slow" }) === 1, "Vehicle + slow → 1");
note(handlingFromRubric({ scale: "Heavy", speedBand: "slow" }) === 1, "Heavy + slow clamps at 1, not 0");
note(handlingFromRubric({ scale: "Light", speedBand: "extreme" }) === 4, "Light + extreme clamps at 4, not 5");
note(handlingFromRubric({ scale: "Personal" }) === 3, "a drone with no speed band is treated as standard");
note(handlingFromRubric({ scale: "Personal", baseAsset: true }) === null, "a fixed base asset has no Handling");

/* ================================================================ 2 — the catalog carries it */

console.log("\n2) Every mobile chassis is stamped, and the stamp equals the rubric");

note(mobile.length >= 85, `${mobile.length} mobile vehicle/drone Items in the catalog`);
const badHandling = mobile.filter(r => !Number.isInteger(r.vehicle.handling)
  || (r.vehicle.handling < HANDLING_MIN) || (r.vehicle.handling > HANDLING_MAX));
note(badHandling.length === 0, `every mobile chassis carries an integer 1–4 Handling (${badHandling.map(r => r.file).join(", ") || "all clean"})`);
const offRubric = mobile.filter(r => r.vehicle.handling !== handlingFromRubric(r.vehicle));
note(offRubric.length === 0, `every stamp matches the rubric (${offRubric.map(r => r.file).join(", ") || "all clean"})`);
const missingBand = mobile.filter(r => !r.vehicle.speedBand);
note(missingBand.length === 0, `every mobile chassis publishes a speed band (${missingBand.map(r => r.file).join(", ") || "all clean"})`);
const missingIntegrity = vehicleItems.filter(r => !Number.isFinite(Number(r.vehicle.integrity)) || (Number(r.vehicle.integrity) <= 0));
note(missingIntegrity.length === 0, `every chassis publishes an Integrity (${missingIntegrity.map(r => r.file).join(", ") || "all clean"})`);

const fixed = vehicleItems.filter(r => r.vehicle.baseAsset);
note(fixed.length > 0 && fixed.every(r => r.vehicle.handling === null),
  `all ${fixed.length} fixed base assets carry handling: null, not the old "fixed" string`);

console.log("\n   design-intent spot checks (H4 bikes and light pursuit, H1 haulers and APCs)");
for (const [dsid, want] of [["scrap-bike", 4], ["warbike", 4], ["crotch-rocket", 4], ["star-chopper", 4],
  ["bulldog", 1], ["flatbed", 1], ["lane-bus", 1], ["iron-giant", 1], ["ash-crawler", 1]]) {
  const row = byDsid.get(dsid);
  note(row?.vehicle.handling === want, `${dsid} (${row?.vehicle.scale} + ${row?.vehicle.speedBand}) → Handling ${row?.vehicle.handling} (want ${want})`);
}

/* The band Integrity the catalog publishes must be the band Integrity Deploy would have computed. */
const fakeItem = row => ({
  getFlag: (scope, key) => ((scope === MODULE_ID) && (key === "vehicle")) ? row.vehicle : undefined,
  system: { _dsid: row.dsid },
});
const bandMismatch = vehicleItems.filter(row => {
  const band = machineBand(fakeItem(row));
  return !band || (chassisStamina(fakeItem(row)) !== Number(row.vehicle.integrity));
});
note(bandMismatch.length === 0,
  `chassisStamina() returns the published Integrity for every chassis (${bandMismatch.map(r => r.file).join(", ") || "all clean"})`);
note(byDsid.get("scrap-bike")?.vehicle.integrity === 20, "Scrap-Bike Integrity 20 (bike band, E1)");
note(byDsid.get("bulldog")?.vehicle.integrity === 40, "Bulldog Integrity 40 (car band, E1)");

/* ================================================================ 3 — the deployed Actor agrees */

console.log("\n3) Deployed machine Actors mirror the Item, and Deploy copies Handling");

const machinesSrc = read("scripts/machines.mjs");
const machinesCode = code(machinesSrc);
note(!/handling:\s*vehicleFlags\.handling\s*\?\?\s*"standard"/.test(machinesCode),
  "the string-era `handling ?? \"standard\"` stamp is gone");
note(/handling:\s*machineHandling\(item\)/.test(machinesCode), "deployMachine() copies Handling onto the placed Actor");
note(/integrity:\s*chassisStamina\(item\)/.test(machinesCode), "…and Integrity");
note(/speedBand:\s*speedBand\s*\?\?\s*null/.test(machinesCode), "…and the speed band");
note(/machine\.handling`\]:\s*machineHandling\(item\)/.test(machinesCode),
  "syncMachineMods() restamps Handling, so a Tune Kit going on or off moves it");
note(!/handlingEdge/.test(machinesCode), "no mod profile still claims a free `handlingEdge`");

const actorDir = "src/packs/summons/machines";
const actors = readdirSync(actorDir).filter(f => f.endsWith(".json") && !f.startsWith("_"))
  .map(f => ({ file: f, json: readJson(join(actorDir, f)) }));
const linked = actors.filter(a => a.json.flags?.[MODULE_ID]?.gearDsid);
note(linked.length >= 8, `${linked.length} named machine Actors link back to a catalog Item`);
const actorMismatch = linked.filter(a => {
  const flags = a.json.flags[MODULE_ID];
  const item = byDsid.get(flags.gearDsid);
  return !item || (flags.machine?.handling !== item.vehicle.handling);
});
note(actorMismatch.length === 0,
  `every linked Actor carries its Item's Handling (${actorMismatch.map(a => a.file).join(", ") || "all clean"})`);
const actorIntegrity = linked.filter(a => a.json.flags[MODULE_ID].machine?.integrity !== Number(a.json.system?.stamina?.max));
note(actorIntegrity.length === 0,
  `every linked Actor's Integrity flag matches its stamina max (${actorIntegrity.map(a => a.file).join(", ") || "all clean"})`);
const bandTemplates = actors.filter(a => /^machine-(drone|vehicle)-/.test(a.file));
note(bandTemplates.length === 9 && bandTemplates.every(a => Number.isInteger(a.json.flags[MODULE_ID].machine?.handling)),
  "all 9 band templates carry a Handling so a hand-placed template is never blank");
const fixedActors = actors.filter(a => a.file.startsWith("machine-base-"));
note(fixedActors.length > 0 && fixedActors.every(a => a.json.flags[MODULE_ID].machine?.handling === null),
  `all ${fixedActors.length} fixed base-asset Actors dropped the "fixed" Handling string`);

const sheet = read("scripts/machine-sheet.mjs");
note(!/handling:\s*"standard"/.test(sheet), "the machine sheet no longer defaults Handling to \"standard\"");
const hbs = read("templates/machine-sheet.hbs");
note(/name="flags\.draw-steel-ghostwire\.machine\.handling"[^>]*type="number"|type="number"[^>]*name="flags\.draw-steel-ghostwire\.machine\.handling"/.test(hbs),
  "the sheet's Handling field is a number, not free text");
note(/min="1"[^>]*max="4"/.test(hbs), "…bounded to 1–4");

/* ================================================================ 4 — Integrity is the player word */

console.log("\n4) Machine-facing copy says Integrity; heroes keep Stamina");

const UI = "GHOSTWIRE.Summons.Machines.UI";
note(localize(`${UI}.Integrity`) === "Integrity", "the machine sheet label is plain \"Integrity\"");
note(!/Stamina/.test(localize(`${UI}.Deployed`)) && /Integrity/.test(localize(`${UI}.Deployed`)),
  "the Deploy notification reports Integrity");
note(!/Stamina/.test(localize(`${UI}.ArmorKit`)) && /Integrity/.test(localize(`${UI}.ArmorKit`)),
  "the armor-kit effect name reports Integrity");
note(!/Stamina/.test(localize(`${UI}.ArmorKitHint`)), "…and so does its hint");
note(localize(`${UI}.HandlingHint`) !== `${UI}.HandlingHint`, "the sheet ships a Handling hint");
note(/Biofeedback/.test(localize(`${UI}.Biofeedback`)) && /Stamina/.test(localize(`${UI}.Biofeedback`)),
  "biofeedback still costs the hero **Stamina** — the rename is machine-facing only");

const MODS = "GHOSTWIRE.Mods.Items";
for (const [key, bonus] of [["ScrapWeld", 6], ["PlateUp", 12], ["CombatPlate", 18], ["AegisKit", 27]]) {
  const text = localize(`${MODS}.${key}.Description`);
  note(text.includes(`+${bonus} Integrity`), `${key} lang grants +${bonus} Integrity`);
  note(!/\+\d+ Stamina/.test(text), `…and no longer says "+N Stamina"`);
  note(/One armor kit at a time/.test(text), "…one kit at a time");
  note(/no armor rating or damage reduction/.test(text), "…and no DR");
}
note(/does not cost Handling/i.test(localize(`${MODS}.PlateUp.Description`)), "Plate-Up does not cost Handling");

for (const [file, bonus] of [["scrap-weld", 6], ["plate-up", 12], ["combat-plate", 18], ["aegis-kit", 27]]) {
  const json = readJson(`src/packs/mods/vehicles/${file}.json`);
  const ae = json.effects?.[0];
  note(ae?.name === `Machine Armor (+${bonus} Integrity)`, `${file} AE is named "${ae?.name}"`);
  note(!/Stamina/.test(ae?.description ?? ""), `…and its AE text says Integrity, not Stamina`);
  note(ae?.system?.changes?.[0]?.key === "system.stamina.bonuses.treasure",
    "…while the change still writes DS stamina under the hood");
  note(Number(ae?.system?.changes?.[0]?.value) === bonus, `…at +${bonus}`);
  note(json.flags[MODULE_ID].mod.exclusiveKit === "armor", "…one kit at a time");
}
note(/It does not cost Handling/.test(readJson("src/packs/mods/vehicles/plate-up.json").effects[0].description),
  "the Plate-Up AE says in so many words that it costs no Handling");

/* ================================================================ 5 — mod alignments */

console.log("\n5) Tune Kit, Lane Skirt, and the sensor / EW ladder");

note(kitProfile("tune-kit")?.handlingBonus === 1, "Tune Kit profile is +1 Handling");
note(!kitProfile("tune-kit")?.handlingEdge, "…and not a free Piloting edge flag");
note(readJson("src/packs/mods/vehicles/tune-kit.json").flags[MODULE_ID].mod.handlingBonus === 1,
  "…the Item carries the same +1");
const tuneText = localize(`${MODS}.TuneKit.Description`);
note(/\+1 Handling/.test(tuneText), "Tune Kit lang says +1 Handling");
note(!/edge on Piloting\/Rigging/.test(tuneText), "…and drops the old free-edge wording");
note(handlingWithMods({ scale: "Vehicle", speedBand: "standard" }, [kitProfile("tune-kit")]) === 3,
  "a Handling-2 chassis with a Tune Kit is 3");
note(handlingWithMods({ scale: "Light", speedBand: "fast" }, [kitProfile("tune-kit")]) === 4,
  "a Handling-4 chassis with a Tune Kit is still 4 (clamped)");

note(!kitProfile("lane-skirt")?.handlingEdge, "Lane Skirt is no longer a Handling flag");
note(kitProfile("lane-skirt")?.situationalEdge === true, "…it is a situational edge");
note(handlingWithMods({ scale: "Vehicle", speedBand: "standard" }, [kitProfile("lane-skirt")]) === 2,
  "…and it moves Handling by nothing");
const skirtText = localize(`${MODS}.LaneSkirt.Description`);
note(/limiter lanes/.test(skirtText) && /not<\/strong> raise Handling|not raise Handling/.test(skirtText),
  "Lane Skirt lang is limiter-lane only and says it does not raise Handling");

const podText = localize(`${MODS}.SensorPod.Description`);
note(/edge on sensor lock/i.test(podText), "Sensor Pod grants an edge on sensor lock");
note(/Sensor Pod → Storm Lattice/.test(podText), "…and names the published ladder");
note(kitProfile("sensor-pod")?.sensorLockEdge === true, "…with the profile flag to match");
const latticeText = localize(`${MODS}.StormLattice.Description`);
note(/apex/i.test(latticeText) && /shares its lock/i.test(latticeText), "Storm Lattice is the apex and shares its lock");
note(/pierces smoke, dark, and spoof/.test(latticeText), "…piercing smoke, dark and spoof");
note(/Sensor Pod → Storm Lattice/.test(latticeText) && /no mid rung/.test(latticeText),
  "…and says there is no mid rung (no invented mid-tier sensor mod)");
note(kitProfile("storm-lattice")?.sensorApex === true, "…with the profile flag to match");
note(!Object.keys(MACHINE_MOD_PROFILES).some(id => /sensor/.test(id) && !["sensor-pod", "storm-lattice"].includes(id)),
  "no new sensor mod was invented between them");

const coatText = localize(`${MODS}.GhostCoat.Description`);
note(/sensor lock/i.test(coatText) && /bane/i.test(coatText), "Ghost Coat is a bane on enemy sensor lock");
note(kitProfile("ghost-coat")?.enemyLockBane === true, "…with the profile flag to match");
const muleText = localize(`${MODS}.SignalMule.Description`);
note(/edge when you defend against an enemy jam or spoof/i.test(muleText), "Signal Mule is an edge on defending against jam");
note(kitProfile("signal-mule")?.jamDefenseEdge === true, "…with the profile flag to match");
const cowlText = localize(`${MODS}.SpoofCowl.Description`);
note(/Transit and ID only/i.test(cowlText) && /not a combat jam/i.test(cowlText),
  "Spoof Cowl is transit / ID only and never a combat jam");
note(kitProfile("spoof-cowl")?.combatJam === false, "…with the profile flag to match");
for (const dsid of ["buzz", "choir-box", "choir-king"]) {
  note(!!byDsid.get(dsid), `${dsid} is still in the catalog with its jam bubble`);
}
note(Object.keys(MACHINE_MOD_PROFILES).length === 24, `still 24 vehicle/drone mod profiles (got ${Object.keys(MACHINE_MOD_PROFILES).length})`);

/* ================================================================ 6 — EW costs no Uptime */

console.log("\n6) Jam and spoof break the lock and drain no Uptime");

const uptime = localize("GHOSTWIRE.Classes.Wrench.Items.Uptime.Description");
note(!/Signal jamming/.test(uptime), "the Uptime card no longer lists Signal jamming as a drain");
note(!/drains 2–4 Uptime/.test(uptime), "…and no longer drains 2–4 Uptime for it");
note(/Jamming and spoofing do not drain Uptime/.test(uptime), "…and says so out loud");
note(/lose 1 Uptime/.test(uptime) && /lose 3 Uptime/.test(uptime),
  "the machine-hit and wreck drains are untouched");

for (const path of ["docs/raw/16-wrench.md", "docs/rulebook/05-wrench.md",
  "docs/masters/GHOSTWIRE_WRENCH_DEVELOPMENT_MASTER.md",
  "docs/manuscript/build/Ghostwire-Manuscript.md",
  "src/packs/rulebook/classes/16-wrench.json"]) {
  note(!/Signal jamming/.test(read(path)), `${path} has no jam-drain line left`);
}

/* ================================================================ 7 — the canonical round */

console.log("\n7) The chase round checklist is canonical and printed everywhere it was promised");

const STEPS = [
  ["0. Setup", /0\. Setup/],
  ["1. Pilots", /1\. Pilots/],
  ["2. Systems / Sensors / EW", /2\. Systems \/ Sensors \/ EW/],
  ["2a Sensor lock", /2a Sensor lock/],
  ["2b Jam / spoof", /2b Jam \/ spoof/],
  ["3. Gunners", /3\. Gunners/],
  ["4. Damage and wrecks", /4\. Damage and wrecks/],
  ["5. End of round", /5\. End of round/],
];

const machinesJournal = read("src/packs/rulebook/ghostwire-systems/23-machines.json");
const wrenchJournal = read("src/packs/rulebook/classes/16-wrench.json");
const theMachinesCard = localize("GHOSTWIRE.Classes.Wrench.Items.TheMachines.Description");
const rawMachines = read("docs/raw/23-machines.md");
const rawCombat = read("docs/raw/04-combat.md");
const combatJournal = read("src/packs/rulebook/shared-core/04-combat.json");

for (const [where, text] of [["Machines journal", machinesJournal], ["Wrench journal", wrenchJournal],
  ["THE MACHINES card", theMachinesCard], ["RAW 23", rawMachines]]) {
  for (const [label, re] of STEPS) note(re.test(text), `${where} prints step ${label}`);
}
for (const [where, text] of [["Machines journal", machinesJournal], ["Wrench journal", wrenchJournal],
  ["THE MACHINES card", theMachinesCard], ["RAW 23", rawMachines]]) {
  note(/anyone versus anyone/i.test(text), `${where} says chase is anyone versus anyone`);
  note(/overlay/i.test(text), `${where} calls the Wrench kit an overlay`);
  note(/2d10 \+ Logic \+ Electronics/.test(text), `${where} prints the sensor-lock roll`);
  note(/2d10 \+ Logic \+ Security Systems/.test(text), `${where} prints the jam roll`);
  note(/double bane/.test(text), `${where} prints the double-bane firing rule`);
  note(/drains no Uptime|drains <strong>no<\/strong> Uptime|no Uptime drain/i.test(text),
    `${where} says jam drains no Uptime`);
}
note(/abstract track/i.test(machinesJournal) && /Default chase mode for this ship/.test(machinesJournal),
  "the Machines journal names the abstract track as the default chase mode");
note(/Abstract range-state track \(default\)|Abstract range-state track <strong>\(default\)/.test(wrenchJournal)
  || /Abstract range-state track \(default\):/.test(wrenchJournal),
  "the Wrench chapter no longer calls positional the default");
note(!/Positional \(default\)/.test(wrenchJournal) && !/Positional \(default\)/.test(read("docs/raw/16-wrench.md")),
  "…anywhere");

note(/Chases are anyone versus anyone/.test(rawCombat), "Combat points at the shared chase round");
note(/chase round checklist/i.test(rawCombat), "…by name");
note(/chase round checklist/i.test(combatJournal), "…and so does the Combat journal");
note(/double bane/.test(rawCombat) && /double bane/.test(combatJournal), "…including the firing lock rule");

/* The Handling rubric is printed where a player will look for it. */
for (const [where, text] of [["Machines journal", machinesJournal], ["RAW 23", rawMachines],
  ["THE MACHINES card", theMachinesCard], ["Wrench journal", wrenchJournal]]) {
  note(/Light \/ Personal \/ Micro \/ Small/.test(text), `${where} prints the Handling rubric`);
}

/* ================================================================ 8 — the cards read the schema */

console.log("\n8) Every catalog card prints its own Integrity, Handling and speed band");

let cardHits = 0;
let cardMisses = [];
for (const row of mobile) {
  const key = String(row.json.name ?? "").split(".").slice(0, -1).join(".");
  const text = localize(`${key}.Description`);
  const want = `Integrity ${row.vehicle.integrity} · Handling ${row.vehicle.handling}`;
  if (text.includes(want)) cardHits += 1; else cardMisses.push(row.file);
}
note(cardMisses.length === 0, `all ${cardHits} mobile chassis cards print their stamped numbers (${cardMisses.join(", ") || "all clean"})`);
note(!JSON.stringify(lang.GHOSTWIRE.Vehicles.Items).includes("numbers come in the damage/status pass"),
  "no card still promises the numbers in a later pass");
note(!JSON.stringify(lang.GHOSTWIRE.Vehicles.Items).includes("Armor kits add Stamina"),
  "no card still says armor kits add Stamina");

/* ================================================================ 9 — VOIDMARK retrieves it */

console.log("\n9) VOIDMARK indexes the chase round, the sensor lock and the firing rule");

const index = readJson("data/voidmark-rules-index.json");
const chunks = Array.isArray(index) ? index : (index.chunks ?? []);
const hits = re => chunks.filter(c => re.test(String(c.text ?? "")));
note(chunks.length > 2000, `the index carries ${chunks.length} chunks`);
note(hits(/Chase round checklist/i).length > 0, "…including the chase round checklist");
note(hits(/2d10 \+ Logic \+ Electronics/).length > 0, "…the sensor-lock roll");
note(hits(/2d10 \+ Logic \+ Security Systems/).length > 0, "…the jam roll");
note(hits(/double bane/).some(c => /sensor lock/i.test(String(c.text))), "…the firing lock rule");
note(hits(/anyone versus anyone/i).length > 0, "…and the anyone-vs-anyone lock");
note(hits(/Signal jamming/).length === 0, "…and nothing about jamming draining Uptime");

const rag = code(read("scripts/voidmark-rag.mjs"));
note(/takeRows\(current, currentSlots, state/.test(rag), "VOIDMARK still scores the current question first (0.3.135 lock)");
note(!/clearThread|requireClearThread/.test(rag), "…and never requires a Clear Thread");

/* ================================================================ 10 — no dsid churn */

console.log("\n10) No _id or dsid moved");

const BASELINE_DSIDS = {
  "scrap-bike": "fHxzMAu5YqI74l4D",
  bulldog: "gwBulldogItm0000",
  "tune-kit": "C84pf5SAJelQ7Ur1",
  "lane-skirt": "gwModLaneSkirt00",
  "scrap-weld": "eQecSEZsQbEha9NC",
  "plate-up": "3Gm5TNWoneP0tI8N",
  "combat-plate": "yBf28QdlONHik8Tp",
  "aegis-kit": "ncSy3J7Ig64vmOeI",
  "sensor-pod": "YAtDg7LUVjASb4xI",
  "storm-lattice": "gwModStormLatt00",
  "ghost-coat": "BmkU18rfNLFsZFXy",
  "signal-mule": "gwModSignalMule0",
  "spoof-cowl": "gwModSpoofCowl00",
};
const modFiles = readdirSync("src/packs/mods/vehicles").filter(f => f.endsWith(".json") && !f.startsWith("_"))
  .map(f => readJson(join("src/packs/mods/vehicles", f)));
const allById = new Map([...vehicleItems.map(r => [r.dsid, r.json._id]), ...modFiles.map(j => [j.system._dsid, j._id])]);
for (const [dsid, id] of Object.entries(BASELINE_DSIDS)) {
  note(allById.get(dsid) === id, `${dsid} is still _id ${id}`);
}
const badKey = [...vehicleItems.map(r => r.json), ...modFiles].filter(j => j._key !== `!items!${j._id}`);
note(badKey.length === 0, "every touched Item's _key still matches its _id");

/* ================================================================ 11 — version, checklist, wiring */

console.log("\n11) Version, checklist, and the tools that ship with them");

note(atLeast(manifest.version, "0.3.138"), `module.json is ${manifest.version} (>= 0.3.138)`);
note(/0\.3\.138/.test(read("README.md")), "README carries a 0.3.138 Status entry");
note(existsSync("docs/directors/03138-smoke.md"), "the committed Foundry checklist ships");
const checklist = read("docs/directors/03138-smoke.md");
for (const item of [1, 2, 3, 4, 5]) {
  note(new RegExp(`^## ${item}\\.`, "m").test(checklist), `…with a section for item ${item}`);
}
note(/wave-03138-smoke/.test(checklist), "…and points at this smoke");
note(existsSync("tools/stamp-vehicle-schema.mjs"), "the schema stamper ships so the rubric can be re-run");
note(existsSync("tools/wave-03137-smoke.mjs"), "the 0.3.137 smoke is still there to be re-run beside this one");

/* ================================================================ */

console.log(fail.length ? `\n0.3.138 smoke FAIL — ${fail.length}` : "\n0.3.138 smoke OK");
for (const msg of fail) console.log(`  - ${msg}`);
process.exit(fail.length ? 1 : 0);
