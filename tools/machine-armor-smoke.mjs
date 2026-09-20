#!/usr/bin/env node
/**
 * 0.3.68 — vehicle/drone Armor = Stamina + 4+4 echelon ladders.
 * Run: node tools/machine-armor-smoke.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

let failed = 0;
const ok = (cond, msg) => {
  if (cond) console.log(`ok  ${msg}`);
  else {
    failed++;
    console.error(`FAIL ${msg}`);
  }
};

const lang = JSON.parse(readFileSync("lang/en.json", "utf8"));
const moduleJson = JSON.parse(readFileSync("module.json", "utf8"));
ok(moduleJson.version === "0.3.68", `module version is 0.3.68 (got ${moduleJson.version})`);

const DIR = "src/packs/mods/vehicles";
const files = readdirSync(DIR).filter(f => f.endsWith(".json") && f !== "_folder.json");
const mods = files.map(f => {
  const json = JSON.parse(readFileSync(join(DIR, f), "utf8"));
  return { file: f, json, mod: json.flags["draw-steel-ghostwire"].mod };
});

const armor = mods.filter(m => m.mod.exclusiveKit === "armor").sort((a, b) => a.mod.echelon - b.mod.echelon);
const weaponry = mods.filter(m => m.mod.exclusiveKit === "weaponry").sort((a, b) => a.mod.echelon - b.mod.echelon);

ok(armor.length === 4, `exactly 4 armor SKUs (got ${armor.length}: ${armor.map(m => m.json.system._dsid).join(", ")})`);
ok(weaponry.length === 4, `exactly 4 weaponry SKUs (got ${weaponry.length}: ${weaponry.map(m => m.json.system._dsid).join(", ")})`);
ok(armor.map(m => m.mod.echelon).join(",") === "1,2,3,4", `armor echelons 1–4 (${armor.map(m => m.mod.echelon).join(",")})`);
ok(weaponry.map(m => m.mod.echelon).join(",") === "1,2,3,4", `weaponry echelons 1–4 (${weaponry.map(m => m.mod.echelon).join(",")})`);

const ARMOR_EXPECT = {
  "scrap-weld": { echelon: 1, availability: "street", price: 400, staminaBonus: 6 },
  "plate-up": { echelon: 2, availability: "restricted", price: 3000, staminaBonus: 12 },
  "combat-plate": { echelon: 3, availability: "military", price: 8000, staminaBonus: 18 },
  "aegis-kit": { echelon: 4, availability: "prototype", price: 22000, staminaBonus: 27 },
};
const WEAPON_EXPECT = {
  "gun-rack": { echelon: 1, availability: "professional", price: 800 },
  "twin-mount": { echelon: 2, availability: "restricted", price: 2500 },
  "turret-ring": { echelon: 3, availability: "military", price: 9000 },
  "heavy-hardpoint": { echelon: 4, availability: "prototype", price: 24000 },
};

for (const row of armor) {
  const dsid = row.json.system._dsid;
  const expect = ARMOR_EXPECT[dsid];
  ok(!!expect, `armor dsid ${dsid} is on the ladder`);
  if (!expect) continue;
  ok(row.mod.echelon === expect.echelon, `${dsid} echelon ${row.mod.echelon} === ${expect.echelon}`);
  ok(row.mod.availability === expect.availability, `${dsid} availability ${row.mod.availability}`);
  ok(row.mod.price === expect.price, `${dsid} price ${row.mod.price}`);
  ok(row.mod.staminaBonus === expect.staminaBonus, `${dsid} staminaBonus +${row.mod.staminaBonus}`);
  ok(row.mod.hosts?.includes("vehicle") && row.mod.hosts?.includes("drone"), `${dsid} hosts vehicle+drone`);
  ok(row.mod.tags?.includes("Armor"), `${dsid} tagged Armor`);
  ok(Array.isArray(row.json.effects) && row.json.effects.length === 1, `${dsid} has one machine-armor AE`);
  const ae = row.json.effects[0];
  ok(ae.transfer === false, `${dsid} AE does not transfer onto the hero`);
  ok(ae.flags?.["draw-steel-ghostwire"]?.machineArmor === true, `${dsid} AE flagged machineArmor`);
  ok(ae.system.changes[0]?.key === "system.stamina.bonuses.treasure", `${dsid} AE uses treasure Stamina bonus (hero armor path)`);
  ok(Number(ae.system.changes[0]?.value) === expect.staminaBonus, `${dsid} AE value ${ae.system.changes[0]?.value}`);
}

for (const row of weaponry) {
  const dsid = row.json.system._dsid;
  const expect = WEAPON_EXPECT[dsid];
  ok(!!expect, `weaponry dsid ${dsid} is on the ladder`);
  if (!expect) continue;
  ok(row.mod.echelon === expect.echelon, `${dsid} echelon ${row.mod.echelon} === ${expect.echelon}`);
  ok(row.mod.availability === expect.availability, `${dsid} availability ${row.mod.availability}`);
  ok(row.mod.price === expect.price, `${dsid} price ${row.mod.price}`);
  ok(row.mod.hosts?.includes("vehicle") && row.mod.hosts?.includes("drone"), `${dsid} hosts vehicle+drone`);
  ok(row.mod.tags?.includes("Mount") && row.mod.tags?.includes("Weaponry"), `${dsid} tagged Mount+Weaponry`);
  ok(!row.mod.staminaBonus, `${dsid} is not an armor kit`);
}

ok(armor.find(m => m.json.system._dsid === "plate-up")?.mod.staminaBonus === 12, "Plate-Up absorbed as E2 armor (+12 Stamina), same _id");
ok(weaponry.find(m => m.json.system._dsid === "gun-rack")?.mod.echelon === 1, "Gun Rack remains E1 weaponry");

const items = lang.GHOSTWIRE.Mods.Items;
for (const key of ["ScrapWeld", "PlateUp", "CombatPlate", "AegisKit", "GunRack", "TwinMount", "TurretRing", "HeavyHardpoint"]) {
  ok(typeof items[key]?.Name === "string" && typeof items[key]?.Description === "string", `lang GHOSTWIRE.Mods.Items.${key}`);
}
ok(!/Raises the machine's Armor \(damage reduction\)/.test(items.PlateUp.Description), "Plate-Up lang has no DR wording");
ok(!/costs Handling/.test(items.PlateUp.Description) || /Does not cost Handling/.test(items.PlateUp.Description), "Plate-Up lang does not cost Handling");
ok(/\+12 Stamina/.test(items.PlateUp.Description), "Plate-Up lang grants +12 Stamina");
ok(/\+6 Stamina/.test(items.ScrapWeld.Description), "Scrap-Weld lang grants +6 Stamina");
ok(/\+18 Stamina/.test(items.CombatPlate.Description), "Combat Plate lang grants +18 Stamina");
ok(/\+27 Stamina/.test(items.AegisKit.Description), "Aegis Kit lang grants +27 Stamina");
ok(/Gunnery/.test(items.GunRack.Description) && /Gunnery/.test(items.TwinMount.Description)
  && /Gunnery/.test(items.TurretRing.Description) && /Gunnery/.test(items.HeavyHardpoint.Description),
  "all four Weaponry kits fire with Gunnery");

const vehicleLang = JSON.stringify(lang.GHOSTWIRE.Vehicles.Items);
ok(vehicleLang.includes("eQecSEZsQbEha9NC") && vehicleLang.includes("yBf28QdlONHik8Tp") && vehicleLang.includes("ncSy3J7Ig64vmOeI"),
  "vehicle/drone catalog links Scrap-Weld, Combat Plate, Aegis Kit");
ok(vehicleLang.includes("XVW0fos7O7NuW9Ix") && vehicleLang.includes("W1Qoa7BRh4WvHXvT") && vehicleLang.includes("C0I6LZZwrZPtZgcq"),
  "vehicle/drone catalog links Twin Mount, Turret Ring, Heavy Hardpoint");
ok(!/Integrity, Handling, Speed, and Armor numbers/.test(vehicleLang), "catalog no longer promises Armor numbers/DR");

const droneDir = "src/packs/vehicles/drones";
const drones = readdirSync(droneDir).filter(f => f.endsWith(".json") && f !== "_folder.json");
let droneFamily = 0;
for (const f of drones) {
  const json = JSON.parse(readFileSync(join(droneDir, f), "utf8"));
  const family = json.flags?.["draw-steel-ghostwire"]?.vehicle?.modFamily ?? [];
  if (family.includes("drone") && family.includes("vehicle")) droneFamily++;
}
ok(droneFamily === drones.length, `all ${drones.length} drones have modFamily vehicle+drone (${droneFamily})`);

const machines = readFileSync("scripts/machines.mjs", "utf8");
ok(machines.includes("armorStaminaBonus") && machines.includes("syncMachineStamina") && machines.includes("staminaBonus"),
  "machines.mjs stamps armor staminaBonus onto deployed Integrity");
const modsSrc = readFileSync("scripts/mods.mjs", "utf8");
ok(modsSrc.includes("ExclusiveKit") && modsSrc.includes("restampHostMachine"),
  "mods.mjs exclusive armor/weaponry kits + restamp on install");

const raw = readFileSync("docs/raw/10-mods.md", "utf8");
ok(raw.includes("Scrap-Weld") && raw.includes("Combat Plate") && raw.includes("Aegis Kit"), "RAW 10-mods has 4 armor SKUs");
ok(raw.includes("Twin Mount") && raw.includes("Turret Ring") && raw.includes("Heavy Hardpoint"), "RAW 10-mods has 4 weaponry SKUs");
ok(!/Raises the machine's Armor \(damage reduction\)/.test(raw), "RAW 10-mods has no Plate-Up DR row");
const gear = readFileSync("docs/masters/GHOSTWIRE_GEAR_MASTER.md", "utf8");
ok(gear.includes("#### Armor kits") && gear.includes("#### Weaponry kits"), "gear master §5F has both ladders");
ok(!/Raises the machine's Armor \(damage reduction\)/.test(gear), "gear master has no Plate-Up DR row");

if (failed) {
  console.error(`\n${failed} failure(s)`);
  process.exit(1);
}
console.log("\nmachine-armor-smoke OK");
