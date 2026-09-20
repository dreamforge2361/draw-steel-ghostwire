#!/usr/bin/env node
/**
 * Vehicle lore lock smoke — module 0.3.69 (docs / journals / VOIDMARK).
 *
 * Run: node tools/vehicle-lore-smoke.mjs
 * Does not need live Foundry. Does not write Scene JSON.
 */
import { readFileSync, readdirSync } from "node:fs";
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

const flats = read("docs/setting/reach-handbook/03-life-on-the-flats.md");
ok(/## Vehicles & Transit — How the Flats Move/.test(flats), "Handbook Life on the Flats has Vehicles & Transit");
ok(/altitude limiters ~25–50 feet/.test(flats), "Handbook quotes limiter");

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
const flatbed = readJson("src/packs/vehicles/ground/flatbed.json");
ok(flatbed.flags["draw-steel-ghostwire"].vehicle.tags.includes("Ground-hauler"), "Flatbed tagged Ground-hauler");
const tiltjet = readJson("src/packs/vehicles/air/tiltjet.json");
ok(tiltjet.flags["draw-steel-ghostwire"].vehicle.tags.includes("VTOL"), "Tiltjet tagged VTOL");
const getaway = readJson("src/packs/vehicles/ground/getaway.json");
ok(getaway.flags["draw-steel-ghostwire"].vehicle.tags.includes("Hover"), "Getaway tagged Hover (street-layer)");

const lang = readJson("lang/en.json");
ok(/limiter ~25–50 ft/.test(lang.GHOSTWIRE.Vehicles.Items.Getaway.Description), "Getaway lang names limiter hover");
ok(/Ground-hauler/.test(lang.GHOSTWIRE.Vehicles.Items.Flatbed.Description), "Flatbed lang tagged Ground-hauler");
ok(/VTOL/.test(lang.GHOSTWIRE.Vehicles.Items.Tiltjet.Description), "Tiltjet lang tagged VTOL");

const lorePages = loadJournalPages("lore");
ok(lorePages.some(p => /Vehicles & Transit/.test(p.text) && /light electric hovercraft/.test(p.text)), "Lore journal has Vehicles & Transit page");
const rulePages = loadJournalPages("rulebook");
ok(rulePages.some(p => /Street picture/.test(p.text) && /25–50 feet/.test(p.text)), "Rulebook Machines journal has street picture");
const hbPages = loadJournalPages("reach-handbook");
ok(hbPages.some(p => /Vehicles & Transit/.test(p.text) && /25–50 feet/.test(p.text)), "Reach Handbook journal has Vehicles & Transit");

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
