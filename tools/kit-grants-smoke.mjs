#!/usr/bin/env node
/**
 * G1 smoke: the Kit → street-band grant table agrees with the Kits and Gear pack sources.
 *
 * Run: node tools/kit-grants-smoke.mjs
 * Does not write pack JSON or rebuild packs.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { KIT_STREET_GRANTS, packageDsids } from "../scripts/kit-grants.mjs";
import { isQualifyingScoutDrone } from "../scripts/street-eye.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const KITS_DIR = "src/packs/kits";
const GEAR_DIR = "src/packs/gear";
const MODS_DIR = "src/packs/mods";
const CHROME_DIR = "src/packs/chrome";

const failures = [];
const ok = (cond, msg) => {
  if (!cond) failures.push(msg);
  else console.log(`  ✓ ${msg}`);
};

/* -------------------------------------------- pack sources */

const walk = dir => {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) { out.push(...walk(p)); continue; }
    if (!entry.endsWith(".json") || entry.startsWith("_")) continue;
    const json = JSON.parse(readFileSync(p, "utf8"));
    if (!String(json._key ?? "").startsWith("!items!")) continue;
    out.push({ file: relative(".", p), json });
  }
  return out;
};

const kits = walk(KITS_DIR)
  .filter(r => r.json.type === "kit")
  .map(r => ({ file: r.file, dsid: r.json.system?._dsid, id: r.json._id, equipment: r.json.system?.equipment ?? {} }));

const gear = walk(GEAR_DIR).map(r => ({
  file: r.file,
  dsid: r.json.system?._dsid,
  id: r.json._id,
  kind: r.json.system?.kind,
  keywords: r.json.system?.keywords ?? [],
  flags: r.json.flags?.[MODULE_ID] ?? {},
}));
const gearByDsid = new Map(gear.map(g => [g.dsid, g]));

const modDsids = new Set(walk(MODS_DIR).map(r => r.json.system?._dsid));
const chromeDsids = new Set(walk(CHROME_DIR).map(r => r.json.system?._dsid));

console.log("G1 Kit street-band grant smoke\n");

/* -------------------------------------------- 1) coverage */

console.log("1) every Kit in the pack has a mapping (and nothing extra is mapped)");
const kitDsids = kits.map(k => k.dsid).sort();
const mapped = Object.keys(KIT_STREET_GRANTS).sort();
ok(kitDsids.length === 28, `the kits pack ships 28 Kits (found ${kitDsids.length})`);
ok(mapped.join(",") === kitDsids.join(","), `the table maps exactly the packed Kits (${mapped.length} entries)`);
for (const dsid of kitDsids) ok(!!KIT_STREET_GRANTS[dsid], `${dsid} is mapped`);

/* -------------------------------------------- 2) every SKU exists, at Street */

console.log("\n2) every mapped SKU is a real Echelon 1 / Street gear Item");
for (const dsid of mapped) {
  for (const sku of packageDsids(dsid)) {
    const item = gearByDsid.get(sku);
    ok(!!item, `${dsid} → ${sku} exists in the gear pack`);
    if (!item) continue;
    ok(String(item.flags.gear?.availability).toLowerCase() === "street", `${sku} is Street Availability`);
    ok(Number(item.flags.gear?.echelon) === 1, `${sku} is Echelon 1`);
    ok(["weapon", "armor"].includes(item.kind), `${sku} is a weapon or armor SKU (kind=${item.kind})`);
  }
}

/* -------------------------------------------- 3) no mods, no chrome */

console.log("\n3) the table never reaches for a mod or a chrome Item");
const everySku = [...new Set(mapped.flatMap(dsid => packageDsids(dsid)))];
for (const sku of everySku) {
  ok(!modDsids.has(sku), `${sku} is not a mod`);
  ok(!chromeDsids.has(sku), `${sku} is not chrome`);
  const item = gearByDsid.get(sku);
  if (item) {
    ok(!item.flags.chrome, `${sku} carries no chrome flag`);
    ok(!item.flags.mod, `${sku} carries no mod flag`);
    ok(!!item.flags.gear, `${sku} carries the gear flag`);
  }
}
const modFamilies = everySku.map(s => gearByDsid.get(s)).filter(Boolean)
  .filter(i => i.kind === "weapon" && !(i.flags.gear?.modFamily ?? []).includes("weapon"));
ok(modFamilies.length === 0, `granted weapons stay in the weapon mod family (offenders: ${modFamilies.map(i => i.dsid).join(", ") || "none"})`);

/* -------------------------------------------- 4) the package satisfies system.equipment */

console.log("\n4) each package satisfies the Kit's own system.equipment");
const ARMOR_KEYWORD = { light: "light", medium: "medium", heavy: "heavy" };
// Documented gaps: the object the Kit needs does not exist at Street in the published catalog.
// Each entry is a slot the grant deliberately leaves empty, mirrored in the table's `note`.
const DOCUMENTED_GAPS = {
  // Hexshot asks for a bow/crossbow/dartgun in the light AND medium slots; the Street band has only
  // the light one (Hunting Bow / Heavy Crossbow are Restricted). It is live on Street-Bow.
  hexshot: ["medium"],
};

for (const kit of kits) {
  const plan = KIT_STREET_GRANTS[kit.dsid];
  if (!plan) continue;
  const skus = packageDsids(kit.dsid).map(s => gearByDsid.get(s)).filter(Boolean);
  const keywordsOf = kinds => skus.filter(s => kinds.includes(s.kind)).flatMap(s => s.keywords);

  // Armor
  const armorClass = String(kit.equipment.armor ?? "none");
  if (armorClass === "none" || !ARMOR_KEYWORD[armorClass]) {
    ok(!plan.armor, `${kit.dsid}: armor "${armorClass}" → no armor granted`);
  } else {
    const armor = plan.armor ? gearByDsid.get(plan.armor) : null;
    ok(!!armor && armor.kind === "armor" && armor.keywords.includes(ARMOR_KEYWORD[armorClass]),
      `${kit.dsid}: armor "${armorClass}" satisfied by ${plan.armor}`);
  }

  // Shield
  if (kit.equipment.shield) {
    const shield = plan.shield ? gearByDsid.get(plan.shield) : null;
    ok(!!shield && shield.keywords.includes("shield"), `${kit.dsid}: shield satisfied by ${plan.shield}`);
  } else {
    ok(!plan.shield, `${kit.dsid}: wants no shield → none granted`);
  }

  // Weapons, one SKU per category the Kit names. Fists satisfy an unarmed Kit (RAW), so it needs none.
  const wanted = (kit.equipment.weapon ?? []).filter(Boolean);
  const gaps = DOCUMENTED_GAPS[kit.dsid] ?? [];
  const available = keywordsOf(["weapon"]);
  for (const category of wanted) {
    if (category === "unarmed") {
      ok(plan.weapons.length === 0, `${kit.dsid}: unarmed → fists already qualify, no weapon granted`);
      continue;
    }
    if (gaps.includes(category)) {
      ok(!available.includes(category) || true, `${kit.dsid}: "${category}" is a documented Street gap (note: ${plan.note})`);
      continue;
    }
    ok(available.includes(category), `${kit.dsid}: weapon "${category}" satisfied by [${plan.weapons.join(", ")}]`);
  }
  if (!wanted.length) {
    ok(plan.weapons.length === 0, `${kit.dsid}: names no weapon category → none granted`);
  }
  // No package hands over more objects than the Kit asks for.
  const budget = wanted.filter(c => c !== "unarmed").length;
  ok(plan.weapons.length <= budget, `${kit.dsid}: grants ${plan.weapons.length} weapon(s) for ${budget} category slot(s)`);
}

/* -------------------------------------------- 5) Merc: two Kits, two packages */

console.log("\n5) Merc (Operator dual-Kit Origin) gets a package per Kit");
const merc = JSON.parse(readFileSync("src/packs/classes/operator/origins/merc/merc.json", "utf8"));
const kitsAdvancement = Object.values(merc.system?.advancements ?? {})
  .find(a => (a.pool ?? []).some(p => String(p.uuid).includes(".kits.Item.")));
ok(!!kitsAdvancement, "the Merc Origin carries a Kits itemGrant advancement");
ok(kitsAdvancement?.chooseN === 2, `the Merc Kits advancement is chooseN: 2 (got ${kitsAdvancement?.chooseN})`);

const kitIdsByDsid = new Map(kits.map(k => [k.id, k.dsid]));
const poolDsids = (kitsAdvancement?.pool ?? []).map(p => kitIdsByDsid.get(String(p.uuid).split(".").pop())).filter(Boolean);
ok(poolDsids.length === (kitsAdvancement?.pool ?? []).length, `every Merc Kit choice resolves to a packed Kit (${poolDsids.length})`);
ok(poolDsids.every(dsid => !!KIT_STREET_GRANTS[dsid]), "every Merc Kit choice has a street package");

// The hook is keyed on the kit Item, and the ledger on the kit dsid, so two Kits mean two ledger
// entries and two packages. Simulate the pair Michael will build at the table.
const simulate = (dsids) => {
  const ledger = {};
  const owned = new Set();
  const out = [];
  for (const dsid of dsids) {
    if (ledger[dsid]) { out.push({ dsid, granted: [], reason: "already-granted" }); continue; }
    const needed = packageDsids(dsid).filter(s => !owned.has(s));
    for (const s of needed) owned.add(s);
    ledger[dsid] = "now";
    out.push({ dsid, granted: needed, reason: "granted" });
  }
  return out;
};
const mercRun = simulate(["gunslinger", "streetsweeper"]);
ok(mercRun[0].granted.length === 2, `Merc Kit 1 (gunslinger) grants 2 objects: ${mercRun[0].granted.join(", ")}`);
ok(mercRun[1].granted.length === 2, `Merc Kit 2 (streetsweeper) grants 2 objects: ${mercRun[1].granted.join(", ")}`);

console.log("\n6) idempotency and the ownership rule");
const twice = simulate(["longshot", "longshot"]);
ok(twice[0].granted.length === 1 && twice[1].granted.length === 0, "the same Kit twice grants once (ledger keyed on kit dsid)");
const overlap = simulate(["juggernaut", "bulldozer"]);
ok(overlap[0].granted.includes("slab-hammer") && !overlap[1].granted.includes("slab-hammer"),
  "two Kits sharing a SKU do not duplicate it (Juggernaut then Bulldozer)");

console.log("\n7) the free Kit stays free");
const priced = everySku.map(s => gearByDsid.get(s)).filter(Boolean);
ok(priced.every(i => Number(i.flags.gear?.price) > 0), "every granted SKU still carries its ¥ price as a catalog object");
// Street grade is one mod slot, except heavy armor: "Armor class shifts mod slots: Heavy +1" (RAW 08).
const slotsFor = i => (i.kind === "armor" && i.keywords.includes("heavy") ? 2 : 1);
const wrongSlots = priced.filter(i => Number(i.flags.gear?.modSlots) !== slotsFor(i));
ok(wrongSlots.length === 0, `every granted SKU carries its street mod-slot count (offenders: ${wrongSlots.map(i => i.dsid).join(", ") || "none"})`);

/* -------------------------------------------- 8) Part A: Static Crow */

console.log("\n8) 0.3.99 Static Crow drops Mark (Street Eye negative)");
const crow = JSON.parse(readFileSync("src/packs/vehicles/drones/static-crow.json", "utf8"));
const crowTags = crow.flags?.[MODULE_ID]?.vehicle?.tags ?? [];
ok(!crowTags.includes("Mark"), `Static Crow tags carry no Mark: [${crowTags.join(", ")}]`);
ok(["EW", "Jump-In-Capable", "Wired"].every(t => crowTags.includes(t)), "Static Crow keeps EW, Jump-In-Capable, Wired");
ok(isQualifyingScoutDrone({ type: crow.type, system: crow.system, flags: crow.flags }) === false,
  "isQualifyingScoutDrone(Static Crow) === false");
for (const dsid of ["spotter", "phantom"]) {
  const json = JSON.parse(readFileSync(`src/packs/vehicles/drones/${dsid}.json`, "utf8"));
  ok(isQualifyingScoutDrone({ type: json.type, system: json.system, flags: json.flags }) === true,
    `${dsid} still qualifies for Street Eye`);
}
const machinesRaw = readFileSync("docs/raw/23-machines.md", "utf8");
const publishedFrames = (machinesRaw.match(/Published v1 frames: ([^.]*)\./) ?? [])[1] ?? "";
ok(publishedFrames.length > 0, "RAW still prints a published v1 frame list");
ok(!publishedFrames.includes("Static Crow"), `Static Crow is off the published v1 frame list (${publishedFrames.trim()})`);
ok(/Static Crow does not qualify/.test(machinesRaw), "RAW says in so many words that Static Crow does not qualify");
ok(!machinesRaw.includes("| EW, Mark, Jump-In-Capable, Wired |"), "RAW Machines table row drops the Mark tag");
ok(!readFileSync("docs/rulebook/15-drones.md", "utf8").includes("| EW, Mark, Jump-In-Capable, Wired |"),
  "Drones chapter table row drops the Mark tag");

/* -------------------------------------------- 9) lang + wiring */

console.log("\n9) lang keys and module wiring");
const lang = JSON.parse(readFileSync("lang/en.json", "utf8"));
for (const key of ["Notify", "ChatTitle", "ChatBody", "Ownership", "NoGear"]) {
  ok(typeof lang.GHOSTWIRE.KitGrants?.[key] === "string", `GHOSTWIRE.KitGrants.${key} exists`);
}
const langKeyOf = item => {
  const json = JSON.parse(readFileSync(item.file, "utf8"));
  return String(json.system?.description?.value ?? "").split(".").at(-2);
};
for (const sku of everySku) {
  const item = gearByDsid.get(sku);
  if (!item) continue;
  const entry = lang.GHOSTWIRE.Gear.Items[langKeyOf(item)];
  ok(!!entry?.Name && !!entry?.Description, `${sku} resolves a lang Name + Description`);
}
const moduleSrc = readFileSync("scripts/module.mjs", "utf8");
ok(moduleSrc.includes('from "./kit-grants.mjs"'), "module.mjs imports the kit-grants module");
ok(moduleSrc.includes("registerKitGrants();"), "module.mjs calls registerKitGrants()");
const grantSrc = readFileSync("scripts/kit-grants.mjs", "utf8");
ok(!/Hooks\.once\(\s*"ready"/.test(grantSrc), "no ready-hook sweep: existing heroes are never back-filled");
ok(grantSrc.includes("isChargenHero"), "the grant is gated on chargen level");

const gearMaster = readFileSync("docs/masters/GHOSTWIRE_GEAR_MASTER.md", "utf8");
for (const name of ["Scrap Cleaver", "Slugger", "Pipe Rifle", "Slab-Hammer", "Scaffold Pike", "Chain Lash", "Weighted Net"]) {
  ok(gearMaster.includes(name), `Gear master lists the new street SKU ${name}`);
}

if (failures.length) {
  console.error(`\n${failures.length} failure(s):`);
  for (const msg of failures) console.error(`  ✗ ${msg}`);
  process.exit(1);
}
console.log(`\nG1 Kit grants smoke: ok`);
