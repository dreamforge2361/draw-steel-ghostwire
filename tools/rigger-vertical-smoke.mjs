#!/usr/bin/env node
/**
 * 0.3.105 Rigger vertical — static smoke (no live Foundry).
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { atLeast } from "./lib/module-version.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const fail = [];
const ok = [];
const note = (pass, msg) => (pass ? ok.push(`  ✓ ${msg}`) : fail.push(msg));
const readJson = path => JSON.parse(readFileSync(path, "utf8"));

const module = readJson("module.json");
const lang = readJson("lang/en.json");
const ui = lang.GHOSTWIRE?.Summons?.Machines?.UI ?? {};

console.log("Rigger vertical smoke (0.3.105)\n");

note(atLeast(module.version, "0.3.105"), `module.json ≥ 0.3.105 (got ${module.version})`);
note(existsSync("scripts/machine-sheet.mjs"), "scripts/machine-sheet.mjs present");
note(existsSync("scripts/rigger-vertical.mjs"), "scripts/rigger-vertical.mjs present");
note(existsSync("templates/machine-sheet.hbs"), "templates/machine-sheet.hbs present");

const moduleSrc = readFileSync("scripts/module.mjs", "utf8");
note(moduleSrc.includes("registerRiggerVertical"), "module.mjs registers Rigger vertical");
note(moduleSrc.includes("registerMachineSheet"), "module.mjs registers Machine sheet");

const machinesSrc = readFileSync("scripts/machines.mjs", "utf8");
note(machinesSrc.includes("FleetFull"), "deployMachine refuses at Fleet Size");
note(machinesSrc.includes("jumpInCapable"), "deployMachine stamps jumpInCapable");
note(machinesSrc.includes("baseAsset"), "machineBand recognizes baseAsset");

const sheetHbs = readFileSync("templates/machine-sheet.hbs", "utf8");
note(sheetHbs.includes("Description"), "Machine sheet template has Description");
note(sheetHbs.includes("Notes") || sheetHbs.includes("biography.director"), "Machine sheet template has Notes");
note(sheetHbs.includes("editImage") || sheetHbs.includes("profile"), "Machine sheet template has portrait control");

for (const key of ["FleetFull", "JumpIn", "Description", "Notes", "HomeGround", "Beacon"]) {
  note(!!ui[key], `lang UI.${key}`);
}

const baseDir = "src/packs/vehicles/base-assets";
note(existsSync(baseDir), "vehicles/base-assets folder exists");
const baseFiles = existsSync(baseDir)
  ? readdirSync(baseDir).filter(f => f.endsWith(".json") && f !== "_folder.json")
  : [];
note(baseFiles.length >= 7, `base-asset Items ≥ 7 (got ${baseFiles.length})`);
for (const need of ["door-lock.json", "safehouse-beacon.json", "camera-sensor-mast.json"]) {
  note(baseFiles.includes(need), `Item ${need}`);
}

const actors = readdirSync("src/packs/summons/machines").filter(f => f.startsWith("machine-base-"));
note(actors.length >= 7, `base-asset Actor templates ≥ 7 (got ${actors.length})`);

// Spot-check Safehouse Beacon flags
if (existsSync(join(baseDir, "safehouse-beacon.json"))) {
  const beacon = readJson(join(baseDir, "safehouse-beacon.json"));
  const v = beacon.flags?.[MODULE_ID]?.vehicle ?? {};
  note(!!v.beacon || !!v.homeGround, "Safehouse Beacon marked beacon/homeGround");
  note(Number(v.integrity ?? v.stamina) > 0, "Safehouse Beacon has Integrity");
  note(Number(v.price) > 0, "Safehouse Beacon has ¥");
}

console.log(ok.join("\n"));
if (fail.length) {
  console.error("\nFAILED:");
  for (const f of fail) console.error("  ✗", f);
  process.exit(1);
}
console.log("\npassed");
