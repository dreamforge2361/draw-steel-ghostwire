#!/usr/bin/env node
/**
 * F18 smoke (0.3.117): Base workshop benches — six placeable Project aids.
 *
 * Two rules and a price list, so all three are asserted by value: the **capped** +1 Lifestyle
 * project slot, the matching-family edge, and the locked SKU ladder. The cap is the whole point of
 * the Michael tweak — six benches must not be six slots — so it is executed rather than described.
 *
 * Run: node tools/f18-workshop-benches-smoke.mjs
 * Does not need live Foundry.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import {
  BENCH_EDGE,
  BENCH_FAMILIES,
  BENCH_SLOT_CAP,
  benchData,
  benchEdge,
  benchFamilies,
  benchFamily,
  benchSummary,
  extraProjectSlots,
  isWorkshopBench,
  projectFamily,
} from "../scripts/workshop-benches.mjs";
import { getPreset, matchPresetItem, listingsFromItems, KIOSK_PRESETS, FOLDER_IDS } from "../scripts/kiosk-presets.mjs";
import { atLeast } from "./lib/module-version.mjs";

const fail = [];
const ok = [];
const note = (pass, msg) => (pass ? ok : fail).push(pass ? `  ✓ ${msg}` : msg);

const MOD = "draw-steel-ghostwire";
const ITEMS = "src/packs/vehicles/base-assets";
const ACTORS = "src/packs/summons/machines";

/** The Michael-locked ladder: file stem → [family, echelon, ¥, lang key]. */
const LADDER = Object.freeze({
  "armorers-bench": ["armor", 1, 8000, "ArmorersBench"],
  "weaponeers-bench": ["weapons", 1, 10000, "WeaponeersBench"],
  "chrome-bay": ["chrome", 2, 18000, "ChromeBay"],
  "matrix-deck-lab": ["matrix", 2, 15000, "MatrixDeckLab"],
  "vehicle-depot": ["vehicles", 2, 22000, "VehicleDepot"],
  "ritual-sanctum-tools": ["ritual", 2, 16000, "RitualSanctumTools"],
});

const module = JSON.parse(readFileSync("module.json", "utf8"));
const lang = JSON.parse(readFileSync("lang/en.json", "utf8"));
const boot = readFileSync("scripts/module.mjs", "utf8");
const src = readFileSync("scripts/workshop-benches.mjs", "utf8");
const lifestyle = readFileSync("docs/raw/26-lifestyle-downtime.md", "utf8");
const wrench = readFileSync("docs/raw/16-wrench.md", "utf8");

const readItem = stem => JSON.parse(readFileSync(join(ITEMS, `${stem}.json`), "utf8"));
const readActor = stem => JSON.parse(readFileSync(join(ACTORS, `machine-base-${stem}.json`), "utf8"));
const yen = n => `¥${n.toLocaleString("en-US")}`;
/** A bench-shaped stand-in for the pure-rule checks. */
const bench = family => ({ flags: { [MOD]: { workshopBench: { family, grantsExtraProjectSlot: true, slotCap: 1, edge: 1 } } } });

console.log("F18 Workshop benches smoke (0.3.117)\n");

console.log("1) Ship surface");
note(atLeast(module.version, "0.3.117"), `module.json is >= 0.3.117 (got ${module.version})`);
note(boot.includes("registerWorkshopBenches()"), "module.mjs registers registerWorkshopBenches");
note(boot.includes('import { registerWorkshopBenches } from "./workshop-benches.mjs"'), "and imports it");
note(BENCH_FAMILIES.length === 6, `six craft families (got ${BENCH_FAMILIES.length})`);

console.log("\n2) Six benches ship, as Items");
for (const [stem, [family, echelon, price]] of Object.entries(LADDER)) {
  note(existsSync(join(ITEMS, `${stem}.json`)), `${stem}.json ships`);
  if (!existsSync(join(ITEMS, `${stem}.json`))) continue;
  const doc = readItem(stem);
  const gw = doc.flags[MOD];
  note(doc.type === "treasure", `${stem} is a treasure Item (got ${doc.type})`);
  note(doc.system._dsid === stem, `${stem} carries its _dsid`);
  note(doc._key === `!items!${doc._id}`, `${stem} _key addresses the items collection`);
  note(doc._id.length === 16 && /^[A-Za-z0-9]+$/.test(doc._id), `${stem} has a valid 16-character _id`);
  note(gw.vehicle.price === price, `${stem} is ${yen(price)} (got ${yen(gw.vehicle.price)})`);
  note(gw.vehicle.echelon === echelon, `${stem} is Echelon ${echelon} (got ${gw.vehicle.echelon})`);
  note(gw.vehicle.availability === "restricted", `${stem} is Restricted (got ${gw.vehicle.availability})`);
  note(gw.vehicle.baseAsset === true, `${stem} reuses the E1 Base Asset pattern, so Deploy already places it`);
  note(gw.workshopBench?.family === family, `${stem} is the ${family} bench (got ${gw.workshopBench?.family})`);
  note(gw.workshopBench?.grantsExtraProjectSlot === true, `${stem} grants the extra project slot`);
  note(gw.workshopBench?.slotCap === BENCH_SLOT_CAP, `${stem} carries the +${BENCH_SLOT_CAP} cap`);
  note(gw.workshopBench?.edge === BENCH_EDGE, `${stem} carries the one edge`);
  note(isWorkshopBench(doc) && benchFamily(doc) === family, `${stem} reads back through workshop-benches.mjs`);
}
const prices = Object.values(LADDER).map(([, , price]) => price);
note(Math.min(...prices) >= 8000, `even the cheapest bench is expensive on purpose (${yen(Math.min(...prices))})`);

console.log("\n3) And as placeable Actors — dual Item + Actor, like Base Assets");
for (const [stem, [family]] of Object.entries(LADDER)) {
  note(existsSync(join(ACTORS, `machine-base-${stem}.json`)), `machine-base-${stem}.json ships`);
  if (!existsSync(join(ACTORS, `machine-base-${stem}.json`))) continue;
  const doc = readActor(stem);
  const gw = doc.flags[MOD];
  note(doc.type === "npc", `machine-base-${stem} is an npc Actor (got ${doc.type})`);
  note(doc._key === `!actors!${doc._id}`, `machine-base-${stem} _key addresses the actors collection`);
  note(gw.kind === "baseAsset", `machine-base-${stem} is a baseAsset, so machines.mjs owns placement`);
  note(gw.workshopBench?.family === family, `machine-base-${stem} carries the same family as its Item`);
  note(isWorkshopBench(doc), `machine-base-${stem} reads as a bench once placed`);
  note(doc.system.movement.value === 0, `machine-base-${stem} does not move — it is bolted down`);
}
const itemIds = Object.keys(LADDER).map(stem => readItem(stem)._id);
const actorIds = Object.keys(LADDER).map(stem => readActor(stem)._id);
note(new Set([...itemIds, ...actorIds]).size === 12, "all twelve documents have distinct ids");

console.log("\n4) The cap is the rule: +1 total, however many benches");
note(BENCH_SLOT_CAP === 1, `the cap is +${BENCH_SLOT_CAP}`);
note(extraProjectSlots([]) === 0, "no benches: no extra slot");
note(extraProjectSlots([bench("armor")]) === 1, "one bench: +1 slot");
note(extraProjectSlots([bench("armor"), bench("weapons")]) === 1, "two benches: still +1 slot");
note(extraProjectSlots(BENCH_FAMILIES.map(bench)) === 1, "all SIX benches: still +1 slot — six benches are not six slots");
note(extraProjectSlots([{ flags: {} }]) === 0, "a non-bench Item grants nothing");
note(extraProjectSlots([null, undefined]) === 0, "junk in the list grants nothing");
note(extraProjectSlots() === 0, "no list at all grants nothing");
note(extraProjectSlots([{ flags: { [MOD]: { workshopBench: { family: "armor", grantsExtraProjectSlot: false } } } }]) === 0,
  "a bench that does not claim the slot does not grant it");

console.log("\n5) The edge: matching family only, and only one");
note(BENCH_EDGE === 1, `one edge (got ${BENCH_EDGE})`);
note(benchEdge({ family: "armor", benches: [bench("armor")] }) === 1, "Armorer's Bench edges an armor Project");
note(benchEdge({ family: "ritual", benches: [bench("armor")] }) === 0, "Armorer's Bench does NOT edge a Ritual Working");
note(benchEdge({ family: "armor", benches: [bench("armor"), bench("armor")] }) === 1,
  "two matching benches are still one edge");
note(benchEdge({ family: "armor", benches: BENCH_FAMILIES.map(bench) }) === 1, "a full workshop is still one edge");
note(benchEdge({ family: null, benches: [bench("armor")] }) === 0, "an untagged Project gets no automatic edge");
note(benchEdge({ family: "sandwiches", benches: [bench("armor")] }) === 0, "an unknown family gets nothing");
note(benchEdge({ family: "armor", benches: [] }) === 0, "no bench, no edge");
note(benchEdge() === 0, "no arguments, no edge");
for (const family of BENCH_FAMILIES) {
  note(benchEdge({ family, benches: [bench(family)] }) === 1, `the ${family} bench edges a ${family} Project`);
  const others = BENCH_FAMILIES.filter(f => f !== family).map(bench);
  note(benchEdge({ family, benches: others }) === 0, `and the other five do not`);
}

console.log("\n6) The summary a Director reads");
const summary = benchSummary([bench("armor"), bench("chrome"), { flags: {} }]);
note(summary.slots === 1, `two benches report +1 slot (got ${summary.slots})`);
note(summary.count === 2, `and count only the benches (got ${summary.count})`);
note(summary.families.join(",") === "armor,chrome", `and list their families (got ${summary.families.join(",")})`);
note(summary.capped === true, "and flag that the cap bit");
note(benchSummary([bench("armor")]).capped === false, "one bench is not capped");
note(benchSummary([]).slots === 0 && benchSummary([]).count === 0, "an empty base reports nothing");
note(benchFamilies([bench("ritual"), bench("armor")]).join(",") === "armor,ritual", "families come back in ship order");
note(benchData({ flags: { [MOD]: { workshopBench: { family: "nope" } } } }) === null, "an unknown family is not bench data");

console.log("\n7) Project tagging — the honest auto-edge");
note(projectFamily({ flags: { [MOD]: { craftFamily: "chrome" } } }) === "chrome", "a tagged Project reads its family");
note(projectFamily({ flags: { [MOD]: { craftFamily: "sandwiches" } } }) === null, "an unknown tag reads null");
note(projectFamily({}) === null && projectFamily() === null, "an untagged Project reads null");
note(src.includes("rollPrompt"), "the edge is seeded into ProjectModel#rollPrompt");
note(src.includes("config.modifiers"), "through the dialog's own modifier bag, so the player sees it before the dice move");
note(!/name.*match|\.name\.includes/.test(src.replace(/^\s*(\/\/|\*).*$/gm, "")),
  "and never guesses a Project's family from its name");

console.log("\n8) Kiosk — one shelf, no second economy");
const preset = getPreset("benches");
note(!!preset, "the benches preset is registered");
note(preset.match.workshopBench === true, "it gates on the workshopBench flag");
note(preset.match.folderIds.includes(FOLDER_IDS.baseAssets), "and matches the base-assets folder");
const rows = Object.keys(LADDER).map((stem, i) => ({ ...readItem(stem), pack: "vehicles", id: `b${i}`, path: `base-assets/${stem}` }));
note(rows.every(row => matchPresetItem(row, preset)), "every bench stocks the shelf");
note(listingsFromItems(rows, preset).length === 6, "and the shelf lists all six");
const notBench = { ...readItem("armorers-bench"), pack: "vehicles", id: "x", path: "base-assets/door-lock" };
delete notBench.flags[MOD].workshopBench;
note(!matchPresetItem(notBench, preset), "a Door Lock in the same folder does NOT reach the bench shelf");
note(KIOSK_PRESETS.filter(p => p.id === "benches").length === 1, "exactly one benches preset");
note(typeof lang.GHOSTWIRE.Kiosk.Presets.Benches?.ActorName === "string", "the shelf has a vendor name");

console.log("\n9) Lang");
const L = lang.GHOSTWIRE.WorkshopBench;
note(!!L, "GHOSTWIRE.WorkshopBench exists");
for (const family of BENCH_FAMILIES) note(typeof L?.Families?.[family] === "string", `a label for the ${family} family`);
note(/once per base|however many benches/i.test(L?.SheetLine ?? ""), "the sheet line states the cap");
note(/edge/i.test(L?.SheetLine ?? ""), "and the matching-Project edge");
note(/capped at \+1/i.test(L?.Report?.Capped ?? ""), "the report card spells the cap out");
note(/never waives/i.test(L?.Report?.Hint ?? ""), "and that a bench waives nothing");
for (const [, [, , , key]] of Object.entries(LADDER)) {
  note(typeof lang.GHOSTWIRE.Vehicles.Items[key]?.Name === "string", `${key} Item name resolves`);
  note(typeof lang.GHOSTWIRE.Vehicles.Items[key]?.Description === "string", `${key} Item description resolves`);
  note(typeof lang.GHOSTWIRE.Summons.Machines[key]?.Name === "string", `${key} Actor name resolves`);
}

console.log("\n10) RAW");
note(/Workshop benches \(project aids\)/i.test(lifestyle), "26-lifestyle prints the benches section");
note(/capped at \*\*\+1 in total/i.test(lifestyle), "and the cap");
note(/six benches are not six slots/i.test(lifestyle), "in the words that stop the argument");
note(/wrong-family bench gives nothing/i.test(lifestyle), "and that a wrong bench gives nothing");
note(/never waives \*\*¥\*\*, \*\*Body Integrity\*\*, or \*\*Availability\*\*/.test(lifestyle),
  "and that a bench waives no cost, BI, or Availability");
note(/one printed exception/.test(lifestyle), "the ¥-does-not-buy-slots line now names its one exception");
for (const [, [, , price]] of Object.entries(LADDER)) {
  note(lifestyle.includes(price.toLocaleString("en-US")), `the RAW table prints ${yen(price)}`);
}
note(/f18-workshop-benches\.md/.test(lifestyle), "and points at the director note");
note(/bench capacity/i.test(wrench), "16-wrench points a Physical Upgrade Slot at bench capacity");
note(/it does not grant one/i.test(wrench), "and is clear that designation does not hand out a bench");
note(/Home Ground|Safehouse Beacon/.test(lifestyle), "Facility Rigger Home Ground stays a separate system");

console.log("\n11) Director note");
const director = readFileSync("docs/directors/f18-workshop-benches.md", "utf8");
note(director.length > 1500, "docs/directors/f18-workshop-benches.md exists and is not a stub");
note(/\+1/.test(director) && /cap/i.test(director), "the note states the capped slot");
note(/edge/i.test(director), "and the matching-family edge");
for (const [, [, , price]] of Object.entries(LADDER)) {
  note(director.includes(price.toLocaleString("en-US")), `the note documents the ${yen(price)} rung`);
}
note(/craft family|Workshop bench family/i.test(director), "and explains tagging a Project");

for (const line of ok) console.log(line);
if (fail.length) {
  console.error(`\n${fail.length} failed:`);
  for (const line of fail) console.error(`  ✗ ${line}`);
  process.exit(1);
}
console.log(`\n${ok.length} checks passed.`);
