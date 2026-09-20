#!/usr/bin/env node
/**
 * Vehicle lore lock smoke — module 0.3.69 (docs / journals / VOIDMARK).
 *
 * Run: node tools/vehicle-lore-smoke.mjs
 * Does not need live Foundry. Does not write Scene JSON.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { retrieve } from "../scripts/voidmark-rag.mjs";

const failures = [];
const ok = (cond, msg) => {
  if (!cond) failures.push(msg);
  else console.log(`  ✓ ${msg}`);
};

function read(path) {
  return readFileSync(path, "utf8");
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function loadJournalPages(pack) {
  const root = join("src/packs", pack);
  const files = readdirSync(root, { recursive: true }).filter(f => String(f).endsWith(".json") && !String(f).endsWith("_folder.json"));
  return files.flatMap(f => {
    const doc = readJson(join(root, f));
    return (doc.pages ?? []).map(p => ({ file: String(f), text: `${p.text?.markdown ?? ""}\n${p.text?.content ?? ""}` }));
  });
}

console.log("Vehicle lore lock smoke (0.3.69)\n");

const moduleJson = readJson("module.json");
ok(typeof moduleJson.version === "string" && moduleJson.version >= "0.3.69", `module.json is ≥ 0.3.69 (got ${moduleJson.version})`);

const l1 = read("docs/manuscript/01-lore/L1-setting-primer.md");
ok(/## Vehicles & Transit/.test(l1), "L1 has Vehicles & Transit");
ok(/Lane-Hopper/.test(l1), "L1 names Lane-Hopper as POV archetype");
ok(/Star-Chopper/.test(l1), "L1 names Star-Chopper as hover-bike archetype");
ok(/Table look — Star-Chopper/.test(l1), "L1 has Star-Chopper table look");
ok(/Bulldog/.test(l1), "L1 names Bulldog as street hauler");
ok(/Rideable/.test(l1), "L1 Director note defers Rideable");
ok(/Most vehicles in this world are \*\*electric\*\*/.test(l1), "L1: most vehicles are electric");
ok(/light electric hovercraft/.test(l1) && /~25–50 feet/.test(l1), "L1: street POV hover + limiter");
ok(/not\*\* free-flight sky cars/.test(l1) || /not free-flight sky cars/.test(l1) || /They are \*\*not\*\* free-flight sky cars/.test(l1), "L1: not sky cars");
ok(/almost always heavy lifters, haulers, and big equipment/.test(l1), "L1: ground = haulers");
ok(/more expensive\*\* but also in \*\*common use/.test(l1) || /more expensive but also in \*\*common use/.test(l1), "L1: VTOL expensive + common");
ok(!/Draw Steel Heroes/i.test(l1.replace(/> \*\*In Foundry\*\*[\s\S]*?(?:\n\n|$)/, "")), "L1 lock body has no Draw Steel Heroes");

const raw = read("docs/raw/23-machines.md");
ok(/### Street picture \(vehicles & transit\)/.test(raw), "RAW 23 has street picture");
ok(/light electric hovercraft/.test(raw) && /~25–50 feet/.test(raw), "RAW 23 quotes limiter hover");
ok(/almost always heavy lifters/.test(raw), "RAW 23 quotes ground-haulers");

const vehCh = read("docs/rulebook/16-vehicles.md");
ok(/Lock \(Michael 2026-09-20\)/.test(vehCh), "16-vehicles lore frame is the lock");
ok(/light electric hovercraft/.test(vehCh), "16-vehicles quotes hover POV");
ok(/Inventory \(35 crewed platforms\)/.test(raw) && /Star-Chopper/.test(raw), "RAW 23 inventory includes Star-Chopper and count 35");
ok(/Inventory \(35 crewed platforms\)/.test(vehCh) && /Star-Chopper/.test(vehCh), "16-vehicles inventory includes Star-Chopper and count 35");

const flats = read("docs/setting/reach-handbook/03-life-on-the-flats.md");
ok(/## Vehicles & Transit — How the Flats Move/.test(flats), "Handbook Life on the Flats has Vehicles & Transit");
ok(/altitude limiters ~25–50 feet/.test(flats), "Handbook quotes limiter");
ok(/Star-Chopper/.test(flats), "Handbook names Star-Chopper");

const afterFront = [
  "docs/raw/23-machines.md",
  "docs/manuscript/01-lore/L1-setting-primer.md",
  "docs/setting/reach-handbook/03-life-on-the-flats.md",
  "docs/manuscript/04-back/28-glossary-slang.md",
];
for (const f of afterFront) {
  const body = read(f).replace(/^>\s*\*\*In Foundry\*\*[\s\S]*?(?:\n{2,}|\n*$)/gm, "");
  ok(!/Draw Steel Heroes/i.test(body), `${f} has no Draw Steel Heroes outside In Foundry`);
}

const hoverpad = readJson("src/packs/vehicles/air/hoverpad.json");
ok(hoverpad.flags["draw-steel-ghostwire"].vehicle.tags.includes("Hover"), "Hoverpad tagged Hover");
const laneHopper = readJson("src/packs/vehicles/ground/lane-hopper.json");
ok(laneHopper.system._dsid === "lane-hopper", "Lane-Hopper Item dsid");
ok(laneHopper.flags["draw-steel-ghostwire"].vehicle.tags.includes("Hover"), "Lane-Hopper tagged Hover");
ok(laneHopper.flags["draw-steel-ghostwire"].vehicle.tags.includes("POV"), "Lane-Hopper tagged POV");
ok(laneHopper.flags["draw-steel-ghostwire"].vehicle.availability === "street", "Lane-Hopper Street availability");
ok(laneHopper.flags["draw-steel-ghostwire"].vehicle.domain === "Ground", "Lane-Hopper Domain Ground (street-layer chase)");
ok(laneHopper.img.endsWith("lane-hopper.webp"), "Lane-Hopper Item img is webp");
const laneActor = readJson("src/packs/summons/machines/lane-hopper.json");
ok(laneActor.prototypeToken?.texture?.src?.endsWith("lane-hopper.webp"), "Lane-Hopper Actor token texture");
ok(laneActor.prototypeToken?.width === 2 && laneActor.prototypeToken?.height === 3, "Lane-Hopper token 2×3");
ok(laneActor.system.movement.hover === true, "Lane-Hopper Actor hover");
ok(existsSync("assets/tokens/vehicles/lane-hopper.png") && existsSync("assets/tokens/vehicles/lane-hopper.webp"), "Lane-Hopper png+webp on disk");
const starChopper = readJson("src/packs/vehicles/ground/star-chopper.json");
ok(starChopper.system._dsid === "star-chopper", "Star-Chopper Item dsid");
ok(starChopper.flags["draw-steel-ghostwire"].vehicle.tags.includes("Hover"), "Star-Chopper tagged Hover");
ok(starChopper.flags["draw-steel-ghostwire"].vehicle.tags.includes("POV"), "Star-Chopper tagged POV");
ok(starChopper.flags["draw-steel-ghostwire"].vehicle.tags.includes("Courier"), "Star-Chopper tagged Courier");
ok(starChopper.flags["draw-steel-ghostwire"].vehicle.availability === "street", "Star-Chopper Street availability");
ok(starChopper.flags["draw-steel-ghostwire"].vehicle.domain === "Ground", "Star-Chopper Domain Ground (street-layer chase)");
ok(starChopper.flags["draw-steel-ghostwire"].vehicle.scale === "Light", "Star-Chopper Scale Light");
ok(starChopper.flags["draw-steel-ghostwire"].vehicle.price === 700, "Star-Chopper Street/custom price");
ok(starChopper.img.endsWith("star-chopper.webp"), "Star-Chopper Item img is webp");
const starActor = readJson("src/packs/summons/machines/star-chopper.json");
ok(starActor.prototypeToken?.texture?.src?.endsWith("star-chopper.webp"), "Star-Chopper Actor token texture");
ok(starActor.prototypeToken?.width === 1 && starActor.prototypeToken?.height === 3, "Star-Chopper token 1×3");
ok(starActor.system.movement.hover === true, "Star-Chopper Actor hover");
ok(existsSync("assets/tokens/vehicles/star-chopper.png") && existsSync("assets/tokens/vehicles/star-chopper.webp"), "Star-Chopper png+webp on disk");
ok(starChopper.system._dsid !== "chopper", "Star-Chopper does not reuse rifle dsid chopper");
const bulldog = readJson("src/packs/vehicles/ground/bulldog.json");
ok(bulldog.system._dsid === "bulldog", "Bulldog Item dsid");
ok(bulldog.flags["draw-steel-ghostwire"].vehicle.tags.includes("Ground-hauler"), "Bulldog tagged Ground-hauler");
ok(bulldog.flags["draw-steel-ghostwire"].vehicle.domain === "Ground", "Bulldog Domain Ground");
ok(!bulldog.flags["draw-steel-ghostwire"].vehicle.tags.includes("Hover"), "Bulldog is not Hover/POV");
const bulldogActor = readJson("src/packs/summons/machines/bulldog.json");
ok(bulldogActor.prototypeToken?.width === 2 && bulldogActor.prototypeToken?.height === 4, "Bulldog token 2×4");
ok(bulldogActor.system.movement.hover === false, "Bulldog Actor does not hover");
const flatbed = readJson("src/packs/vehicles/ground/flatbed.json");
ok(flatbed.flags["draw-steel-ghostwire"].vehicle.tags.includes("Ground-hauler"), "Flatbed tagged Ground-hauler");
const tiltjet = readJson("src/packs/vehicles/air/tiltjet.json");
ok(tiltjet.flags["draw-steel-ghostwire"].vehicle.tags.includes("VTOL"), "Tiltjet tagged VTOL");
const getaway = readJson("src/packs/vehicles/ground/getaway.json");
ok(getaway.flags["draw-steel-ghostwire"].vehicle.tags.includes("Hover"), "Getaway tagged Hover (street-layer)");

const lang = readJson("lang/en.json");
ok(/limiter ~25–50 ft/.test(lang.GHOSTWIRE.Vehicles.Items.Getaway.Description), "Getaway lang names limiter hover");
ok(/four-seat street hovercar/.test(lang.GHOSTWIRE.Vehicles.Items.LaneHopper.Description), "Lane-Hopper lang is 4-seat hovercar");
ok(/tandem limiter hover-bike/.test(lang.GHOSTWIRE.Vehicles.Items.StarChopper.Description), "Star-Chopper lang is tandem hover-bike");
ok(/not the rifle named Chopper/.test(lang.GHOSTWIRE.Vehicles.Items.StarChopper.Description), "Star-Chopper lang disambiguates rifle Chopper");
ok(/street cargo van/.test(lang.GHOSTWIRE.Vehicles.Items.Bulldog.Description), "Bulldog lang is cargo van");
ok(/Rideable/.test(lang.GHOSTWIRE.Summons.Machines.LaneHopper.Description), "Lane-Hopper Actor notes future Rideable");
ok(/Rideable/.test(lang.GHOSTWIRE.Summons.Machines.StarChopper.Description), "Star-Chopper Actor notes future Rideable");
ok(lang.GHOSTWIRE.Gear.Items.Chopper.Name === "Chopper", "rifle Chopper lang key still exists");
ok(/Ground-hauler/.test(lang.GHOSTWIRE.Vehicles.Items.Flatbed.Description), "Flatbed lang tagged Ground-hauler");
ok(/VTOL/.test(lang.GHOSTWIRE.Vehicles.Items.Tiltjet.Description), "Tiltjet lang tagged VTOL");

const lorePages = loadJournalPages("lore");
ok(lorePages.some(p => /Vehicles & Transit/.test(p.text) && /light electric hovercraft/.test(p.text)), "Lore journal has Vehicles & Transit page");
ok(lorePages.some(p => /Star-Chopper/.test(p.text)), "Lore journal names Star-Chopper");
const rulePages = loadJournalPages("rulebook");
ok(rulePages.some(p => /Street picture/.test(p.text) && /25–50 feet/.test(p.text)), "Rulebook Machines journal has street picture");
ok(rulePages.some(p => /Star-Chopper/.test(p.text)), "Rulebook journal names Star-Chopper");
const hbPages = loadJournalPages("reach-handbook");
ok(hbPages.some(p => /Vehicles & Transit/.test(p.text) && /25–50 feet/.test(p.text)), "Reach Handbook journal has Vehicles & Transit");
ok(hbPages.some(p => /Star-Chopper/.test(p.text)), "Reach Handbook journal names Star-Chopper");

const index = readJson("data/voidmark-rules-index.json");
const q = retrieve(index, "What vehicles do people drive? hovercraft altitude limiter VTOL ground hauler");
ok(q.length >= 1, `vehicle query returned ${q.length} hits`);
ok(
  q.some(h => /hovercraft|limiter|25–50|VTOL|ground-hauler|heavy lifters/i.test(h.text)),
  `vehicle hits mention lock terms (${q.map(h => h.file).join(", ")})`,
);
ok(
  q.some(h => /L1-setting-primer|23-machines|03-life-on-the-flats|16-vehicles/.test(h.file)),
  "vehicle query cites primer / machines / handbook",
);

const readme = read("README.md");
ok(/0\.3\.69/.test(readme) && /Vehicle lore lock/.test(readme), "README changelog names 0.3.69 vehicle lore");

if (failures.length) {
  console.error(`\n${failures.length} failure(s):`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log("\nAll vehicle lore lock checks passed.");
