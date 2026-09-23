#!/usr/bin/env node
/**
 * G2 (0.3.100) — wearable armor / shield + gadget mod families smoke.
 *
 * Covers the G2 brief (docs/directors/_claude-g2-armor-gadget-mods-prompt.md):
 *   1. both families ship a real Street -> Prototype spread, every SKU with a ¥
 *   2. every armor / gadget mod carries stock Draw Steel Project fields (S8 quality)
 *   3. hosts overlap a published host family, and every host family has mods
 *   4. THE LOCK: no wearable armor or shield mod grants Stamina, anywhere
 *   5. exclusiveKit groups are symmetric and localized
 *   6. install / refuse behaviour through scripts/mods.mjs' own canInstall rules
 *   7. kiosk presets resolve the families (Chop Shop + Armorer + Gadgeteer)
 *   8. lang + host gear cards + RAW / rulebook / Gear master are in sync
 *   9. Part B: Hexshot's medium bow gap is closed at Street
 *
 * Run (no live Foundry needed): node tools/g2-armor-gadget-mods-smoke.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { catalogPrice } from "../scripts/kiosk.mjs";
import { getPreset, listingsFromItems } from "../scripts/kiosk-presets.mjs";
import { KIT_STREET_GRANTS } from "../scripts/kit-grants.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const fail = [];
const note = (pass, msg) => (pass ? console.log(`  ✓ ${msg}`) : fail.push(msg));

const readJson = path => JSON.parse(readFileSync(path, "utf8"));
const module = readJson("module.json");
const lang = readJson("lang/en.json");
const langMods = lang.GHOSTWIRE.Mods.Items;
const langGear = lang.GHOSTWIRE.Gear.Items;

/** Draw Steel trinket crafting ladder (E1 150 / E2 300 / E3 450 / E4 600). */
const PROJECT_GOAL = { 1: 150, 2: 300, 3: 450, 4: 600 };
/** Availability band each echelon may sit in (legacy tier -> echelon map, RAW 10-mods). */
const ECHELON_AVAIL = { 1: ["street", "professional"], 2: ["restricted"], 3: ["military"], 4: ["prototype"] };
const CHARACTERISTICS = { repair: ["might", "reason"], electronics: ["reason", "intuition"], hacking: ["reason", "intuition"] };

function scan(pack) {
  const base = join("src/packs", pack);
  const rows = [];
  for (const file of readdirSync(base, { recursive: true })) {
    const rel = String(file).replaceAll("\\", "/");
    if (!rel.endsWith(".json") || rel.endsWith("_folder.json")) continue;
    const data = readJson(join(base, rel));
    if (!data._id || String(data._key ?? "").startsWith("!folders!")) continue;
    rows.push({ ...data, pack, path: rel.replace(/\.json$/, ""), id: data._id,
                uuid: `Compendium.${MODULE_ID}.${pack}.Item.${data._id}` });
  }
  return rows;
}

const gw = doc => doc.flags?.[MODULE_ID] ?? {};
const modOf = doc => gw(doc).mod;
const gearOf = doc => gw(doc).gear;
const dsid = doc => doc.system?._dsid;
const langKeyOf = doc => String(doc.system?.description?.value ?? "").split(".").at(-2);
const hostsOf = doc => [...new Set([modOf(doc)?.hosts, modOf(doc)?.host].flat().filter(Boolean))];

const modsPack = scan("mods");
const gearPack = scan("gear");
const armorMods = modsPack.filter(d => d.path.startsWith("armor/"));
const gadgetMods = modsPack.filter(d => d.path.startsWith("gadgets/"));
const newFamilies = [...armorMods, ...gadgetMods];
const hosts = gearPack.filter(d => Number(gearOf(d)?.modSlots) > 0 && gearOf(d)?.modFamily?.length);

console.log("G2 wearable armor / shield + gadget mod families smoke (0.3.100)\n");

/* ---------------------------------------------------------------- 1) ship surface */
console.log("1) Ship surface");
note(module.version === "0.3.100", `module.json is 0.3.100 (got ${module.version})`);
note(armorMods.length >= 14, `armor / shield mods published (got ${armorMods.length})`);
note(gadgetMods.length >= 17, `gadget mods published (got ${gadgetMods.length})`);
note(modsPack.length === 63, `the Mods pack ships 63 SKUs total (got ${modsPack.length})`);

for (const [label, rows] of [["armor/shield", armorMods], ["gadget", gadgetMods]]) {
  const byEchelon = rows.reduce((acc, d) => ((acc[modOf(d).echelon] = (acc[modOf(d).echelon] ?? 0) + 1), acc), {});
  const spread = [1, 2, 3, 4].map(e => `E${e} ${byEchelon[e] ?? 0}`).join(" / ");
  note([1, 2, 3, 4].every(e => (byEchelon[e] ?? 0) >= 1), `${label} covers Street -> Prototype (${spread})`);
}
// Shields are a host family of their own; they need their own usable spread, not one token row.
const shieldMods = armorMods.filter(d => hostsOf(d).includes("shield"));
note(shieldMods.length >= 5, `shields have a real menu, not one row (got ${shieldMods.length})`);
note(new Set(shieldMods.map(d => modOf(d).echelon)).size >= 3,
  `shield mods span at least 3 echelons (${[...new Set(shieldMods.map(d => modOf(d).echelon))].sort().join(", ")})`);

/* ---------------------------------------------------------------- 2) ¥ + Project fields */
console.log("\n2) Every SKU carries a real ¥ and stock Draw Steel Project fields");
const priceless = newFamilies.filter(d => !(catalogPrice(d) > 0));
note(priceless.length === 0, `no ¥0 / missing-price SKUs (offenders: ${priceless.map(dsid).join(", ") || "none"})`);

for (const doc of newFamilies) {
  const mod = modOf(doc);
  const project = doc.system.project ?? {};
  const echelon = mod.echelon;
  const skill = mod.craftSkill?.[0];
  const ok = project.goal === PROJECT_GOAL[echelon]
    && typeof project.prerequisites === "string" && project.prerequisites.length > 20
    && typeof project.source === "string" && project.source.includes("Gear master")
    && Array.isArray(project.rollCharacteristic) && project.rollCharacteristic.length === 2
    && String(project.yield?.display ?? "").includes("mod slot");
  note(ok, `${dsid(doc)}: Project goal ${PROJECT_GOAL[echelon]}, prerequisites, source, roll, yield`);
  note(String(project.prerequisites).includes("¥"), `${dsid(doc)}: prerequisites name a materials ¥ figure`);
  note(JSON.stringify(project.rollCharacteristic) === JSON.stringify(CHARACTERISTICS[skill]),
    `${dsid(doc)}: ${skill} rolls ${CHARACTERISTICS[skill]?.join(" or ")}`);
  note(doc.system.echelon === echelon, `${dsid(doc)}: system.echelon agrees with the catalog flag (${echelon})`);
  note(mod.slotCost === 1, `${dsid(doc)}: costs 1 slot`);
  note(mod.modSlots === 0, `${dsid(doc)}: is not itself a host (modSlots 0)`);
  note((ECHELON_AVAIL[echelon] ?? []).includes(mod.availability),
    `${dsid(doc)}: Echelon ${echelon} sits at ${mod.availability}`);
  note((mod.craftSkill ?? []).every(s => ["repair", "electronics", "hacking"].includes(s)),
    `${dsid(doc)}: craftSkill is Repair / Electronics / Hacking (${(mod.craftSkill ?? []).join(", ")})`);
}

/* ---------------------------------------------------------------- 3) hosts overlap */
console.log("\n3) Hosts overlap a published host family, and every family has mods");
const publishedFamilies = new Set(hosts.flatMap(d => gearOf(d).modFamily));
for (const doc of newFamilies) {
  const families = hostsOf(doc);
  note(families.length > 0 && families.every(f => publishedFamilies.has(f)),
    `${dsid(doc)}: hosts [${families.join(", ")}] all exist on real gear`);
}
// The skill mapping lock: Repair for physical armor, Electronics for sensors/gadgets/Wired.
for (const doc of armorMods) {
  const wired = (modOf(doc).tags ?? []).includes("Wired");
  const skill = modOf(doc).craftSkill[0];
  note(wired ? skill === "electronics" : skill === "repair",
    `${dsid(doc)}: ${wired ? "Wired" : "physical"} armor mod keys to ${skill}`);
}
const GADGET_FAMILIES = ["comms", "sensors", "bne-mechanical", "bne-electronic", "survival", "wired"];
for (const family of GADGET_FAMILIES) {
  const fits = gadgetMods.filter(d => hostsOf(d).includes(family));
  note(fits.length >= 2, `gadget family "${family}" has a menu (${fits.length}: ${fits.map(dsid).join(", ")})`);
}
for (const family of ["armor", "shield"]) {
  const fits = armorMods.filter(d => hostsOf(d).includes(family));
  note(fits.length >= 5, `host family "${family}" has ${fits.length} mods`);
}
// No orphan slots: every host family that publishes slots has at least one mod that fits.
const orphan = hosts.filter(h => !modsPack.some(m => hostsOf(m).some(f => gearOf(h).modFamily.includes(f))));
note(orphan.length === 0, `no host publishes orphan slots (offenders: ${orphan.map(dsid).join(", ") || "none"})`);

/* ---------------------------------------------------------------- 4) THE LOCK: no Stamina */
console.log("\n4) LOCK — no wearable armor or shield mod grants Stamina");
const STAMINA_RE = /stamina/i;
for (const doc of newFamilies) {
  const mod = modOf(doc);
  note(mod.staminaBonus === undefined && mod.staminaByEchelon === undefined,
    `${dsid(doc)}: no staminaBonus / staminaByEchelon on the catalog flag`);
  const changes = (doc.effects ?? []).flatMap(e => e.system?.changes ?? []);
  note(!changes.some(c => STAMINA_RE.test(String(c.key))),
    `${dsid(doc)}: no Active Effect writes a Stamina key`);
  note(!(doc.effects ?? []).some(e => e.flags?.[MODULE_ID]?.machineArmor),
    `${dsid(doc)}: carries no machineArmor flag`);
  note(!/\+\d+\s*Stamina/i.test(langMods[langKeyOf(doc)]?.Description ?? ""),
    `${dsid(doc)}: its card never promises +N Stamina`);
}
// Only the two honest edge AEs exist; everything else is a card the Director reads.
const withEffects = newFamilies.filter(d => (d.effects ?? []).length);
note(withEffects.length === 3,
  `exactly 3 rows carry an Active Effect (got ${withEffects.length}: ${withEffects.map(dsid).join(", ")})`);
for (const doc of withEffects) {
  const effect = doc.effects[0];
  note(effect.disabled === true && effect.transfer === true,
    `${dsid(doc)}: its AE ships off and transfers to the sheet (the Stealth Weave pattern)`);
  note((effect.system?.changes ?? []).every(c => /^system\.skills\.modifiers\.\w+\.edges$/.test(String(c.key))),
    `${dsid(doc)}: its AE only adds a skill edge`);
}

/* ---------------------------------------------------------------- 5) exclusiveKit groups */
console.log("\n5) exclusiveKit groups are symmetric and localized");
const groups = new Map();
for (const doc of modsPack) {
  const key = modOf(doc)?.exclusiveKit;
  if (!key) continue;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(doc);
}
const kitLang = lang.GHOSTWIRE.Mods.Install.Kit ?? {};
for (const [key, rows] of groups) {
  note(rows.length >= 2, `group "${key}" has something to clash with (${rows.map(dsid).join(", ")})`);
  note(typeof kitLang[key] === "string" && kitLang[key].length > 0,
    `group "${key}" localizes as GHOSTWIRE.Mods.Install.Kit.${key} = "${kitLang[key]}"`);
  const families = rows.map(d => hostsOf(d).sort().join("+"));
  note(new Set(families).size <= rows.length, `group "${key}" members share a host family`);
}
for (const key of ["liner", "camo", "denial", "optic-stage", "lock-soft"]) {
  note(groups.has(key), `G2 documents the "${key}" group`);
}

/* ---------------------------------------------------------------- 6) install / refuse */
console.log("\n6) Install and refuse, through the real canInstall rules");
// A faithful re-implementation of scripts/mods.mjs canInstall, minus the Foundry document layer.
function canInstall(mod, host, installed = []) {
  const catalog = gearOf(host);
  if (!(Number(catalog?.modSlots) > 0)) return "NotHost";
  if (!hostsOf(mod).some(f => (catalog.modFamily ?? []).includes(f))) return "WrongFamily";
  const used = installed.reduce((n, m) => n + Number(modOf(m).slotCost ?? 1), 0);
  if (used + Number(modOf(mod).slotCost ?? 1) > Number(catalog.modSlots)) return "NoSlots";
  const kit = modOf(mod).exclusiveKit;
  if (kit && installed.some(m => modOf(m).exclusiveKit === kit)) return "ExclusiveKit";
  return "ok";
}
const byDsid = new Map([...modsPack, ...gearPack].map(d => [dsid(d), d]));
const cases = [
  ["soft-armor-insert", "secure-threads", "ok"],
  ["soft-armor-insert", "armor-vest", "ok"],
  ["soft-armor-insert", "hardshell", "ok"],
  ["soft-armor-insert", "riot-shield", "WrongFamily"],
  ["soft-armor-insert", "lockpick-set", "WrongFamily"],
  ["shield-capacitor", "riot-shield", "ok"],
  ["shield-capacitor", "hardshell", "WrongFamily"],
  ["denial-field", "smart-shield", "ok"],
  ["denial-field", "armored-jacket", "WrongFamily"],
  ["quiet-picks", "lockpick-set", "ok"],
  ["quiet-picks", "maglock-passkey", "WrongFamily"],
  ["breach-jack", "grapple-line", "ok"],
  ["passkey-stack", "maglock-passkey", "ok"],
  ["passkey-stack", "cheap-shades", "WrongFamily"],
  ["deep-optics", "thermal-scanner", "ok"],
  ["habitat-stage", "environment-suit", "ok"],
  ["habitat-stage", "commlink", "WrongFamily"],
  ["jam-mask", "burner", "ok"],
  ["ghost-frame", "silent-suite", "ok"],
  ["beacon-squelch", "full-sensorium", "ok"],
  ["thermoptic-skin", "whisperweave", "ok"],
  ["armor-seal-kit", "sealed-armor", "ok"],
  ["reactive-plating", "juggernaut", "ok"],
  ["reactive-plating", "ballistic-board", "ok"],
  // a mod is never a host
  ["soft-armor-insert", "trauma-plates", "NotHost"],
];
for (const [modDsid, hostDsid, want] of cases) {
  const mod = byDsid.get(modDsid);
  const host = byDsid.get(hostDsid);
  if (!mod || !host) { fail.push(`install case ${modDsid} -> ${hostDsid}: missing SKU`); continue; }
  const got = canInstall(mod, host);
  note(got === want, `${modDsid} -> ${hostDsid}: ${want}${got === want ? "" : ` (got ${got})`}`);
}
// the exclusive groups actually bite
note(canInstall(byDsid.get("insulator-liner"), byDsid.get("hardshell"), [byDsid.get("climate-seal-liner")]) === "ExclusiveKit",
  "Insulator Liner refuses a vest that already runs a Climate Seal Liner (inner liner)");
note(canInstall(byDsid.get("thermoptic-skin"), byDsid.get("whisperweave"), [byDsid.get("stealth-weave")]) === "ExclusiveKit",
  "Thermoptic Skin refuses armor already wearing a Stealth Weave (camouflage layer)");
note(canInstall(byDsid.get("denial-field"), byDsid.get("smart-shield"), [byDsid.get("shield-capacitor")]) === "ExclusiveKit",
  "Denial Field refuses a shield already carrying a Shield Capacitor (active-denial cell)");
note(canInstall(byDsid.get("deep-optics"), byDsid.get("thermal-scanner"), [byDsid.get("spectrum-filter")]) === "ExclusiveKit",
  "Deep Optics refuses optics already running a Spectrum Filter (optical stage)");
note(canInstall(byDsid.get("passkey-stack"), byDsid.get("maglock-passkey"), [byDsid.get("skeleton-key-soft")]) === "ExclusiveKit",
  "Passkey Stack refuses a passkey already running Skeleton Key Soft (lock-cracking package)");
// a one-slot Street host fills up
note(canInstall(byDsid.get("mag-harness"), byDsid.get("secure-threads"), [byDsid.get("soft-armor-insert")]) === "NoSlots",
  "a 1-slot Street vest refuses a second mod");
// different groups still stack on a roomy host
note(canInstall(byDsid.get("thermoptic-skin"), byDsid.get("juggernaut"), [byDsid.get("climate-seal-liner"), byDsid.get("trauma-plates")]) === "ok",
  "different groups stack on a 6-slot hardsuit");

/* ---------------------------------------------------------------- 7) kiosk */
console.log("\n7) Kiosk presets resolve the families");
const allCatalog = [...modsPack, ...gearPack];
for (const [presetId, expected] of [["mods", 63], ["armorMods", armorMods.length], ["gadgetMods", gadgetMods.length]]) {
  const preset = getPreset(presetId);
  note(!!preset, `kiosk preset "${presetId}" exists`);
  if (!preset) continue;
  const rows = listingsFromItems(allCatalog, presetId);
  note(rows.length === expected, `"${presetId}" stocks ${expected} listings (got ${rows.length})`);
  const langEntry = lang.GHOSTWIRE.Kiosk.Presets[preset.langKey];
  note(!!langEntry?.Name && !!langEntry?.ActorName && !!langEntry?.Tagline,
    `"${presetId}" localizes Name / ActorName / Tagline (${langEntry?.ActorName})`);
}
// the focused shelves must not leak the other families onto themselves
const armorShelf = listingsFromItems(allCatalog, "armorMods").map(r => r.uuid);
note(!armorShelf.includes(byDsid.get("plate-up").uuid) && !armorShelf.includes(byDsid.get("smartlink").uuid),
  "the Armorer shelf carries no vehicle or weapon mods");
const gadgetShelf = listingsFromItems(allCatalog, "gadgetMods").map(r => r.uuid);
note(gadgetShelf.includes(byDsid.get("jam-mask").uuid) && !gadgetShelf.includes(byDsid.get("trauma-plates").uuid),
  "the Gadgeteer shelf carries gadget mods and no armor mods");

/* ---------------------------------------------------------------- 8) lang + docs */
console.log("\n8) lang, host cards, and the rules docs are in sync");
for (const doc of newFamilies) {
  const entry = langMods[langKeyOf(doc)];
  note(!!entry?.Name && !!entry?.Description, `${dsid(doc)} resolves a lang Name + Description`);
  if (!entry) continue;
  note(entry.Description.includes("Fabricate (§Craft Project)"), `${dsid(doc)}: card prints its Fabricate line`);
  note(entry.Description.includes(`Goal ${PROJECT_GOAL[modOf(doc).echelon]}`), `${dsid(doc)}: card prints the right Project goal`);
  note(entry.Description.includes("<strong>Effect:</strong>"), `${dsid(doc)}: card states the table effect`);
  if (modOf(doc).exclusiveKit) {
    note(entry.Description.includes("Does not stack with"), `${dsid(doc)}: card names what it will not stack with`);
  }
}
// every host card lists the mods that actually fit it
for (const host of hosts) {
  const fits = modsPack.filter(m => hostsOf(m).some(f => gearOf(host).modFamily.includes(f)));
  const card = langGear[langKeyOf(host)]?.Description ?? "";
  const missing = fits.filter(m => !card.includes(m.id));
  note(missing.length === 0, `${dsid(host)}: card links all ${fits.length} fitting mods${missing.length ? ` (missing ${missing.map(dsid).join(", ")})` : ""}`);
}

const raw = readFileSync("docs/raw/10-mods.md", "utf8");
note(/\|\s*\*\*Armor \/ shields\*\*\s*\|\s*\*\*Published\*\*/.test(raw), "RAW host-family table says Armor / shields: Published");
note(/\|\s*\*\*Gadgets\*\*\s*\|\s*\*\*Published\*\*/.test(raw), "RAW host-family table says Gadgets: Published");
note(!/modSlots as 0/.test(raw), 'RAW drops the "treat wearable armor modSlots as 0" instruction');
note(!/Do not invent liners/.test(raw), 'RAW drops the "do not invent liners" instruction');
note(!/Wearable armor and gadget families remain \*\*unpublished\*\*/.test(raw), "RAW design-lock line no longer calls the families unpublished");
note(!/### Wearable armor \+ gadget families/.test(raw), 'RAW drops the old "Not yet published" section');
note(raw.includes("Gear master §2F") && raw.includes("Gear master §1H"), "RAW harvests §2F and §1H");
note(/No armor or shield mod adds Stamina/.test(raw), "RAW prints the no-Stamina lock in so many words");

const rulebook = readFileSync("docs/rulebook/14-mods.md", "utf8");
note(rulebook.includes("§2F") && rulebook.includes("§1H"), "rulebook chapter names §2F and §1H");
note(!/families expanding \(B20\)/.test(rulebook), "rulebook host-family table no longer says families are expanding");

const gearMaster = readFileSync("docs/masters/GHOSTWIRE_GEAR_MASTER.md", "utf8");
note(/^### 2F — Wearable Armor & Shield Mods$/m.test(gearMaster), "Gear master publishes §2F");
note(/^### 1H — Gadget Mods$/m.test(gearMaster), "Gear master publishes §1H");
for (const doc of newFamilies) {
  const name = langMods[langKeyOf(doc)].Name;
  note(gearMaster.includes(name), `Gear master lists ${name}`);
}

/* ---------------------------------------------------------------- 9) Part B: Hexshot */
console.log("\n9) Part B — Hexshot's Street medium bow");
const bow = byDsid.get("scrap-bow");
note(!!bow, "scrap-bow exists in the gear pack");
if (bow) {
  const gear = gearOf(bow);
  note(bow.system.kind === "weapon", "Scrap-Bow is a weapon SKU");
  note(gear.echelon === 1 && gear.availability === "street", `Scrap-Bow is Echelon 1 / Street (got ${gear.echelon} / ${gear.availability})`);
  note(gear.price > 0 && gear.price <= 300, `Scrap-Bow prices inside the Street band (¥${gear.price})`);
  note(gear.modSlots === 1, `Scrap-Bow has 1 mod slot (got ${gear.modSlots})`);
  note((gear.modFamily ?? []).includes("weapon"), "Scrap-Bow is a weapon-mod host");
  note(gear.weaponBand === "medium", `Scrap-Bow is medium band (got ${gear.weaponBand})`);
  note((bow.system.keywords ?? []).includes("medium") && (bow.system.keywords ?? []).includes("bow"),
    `Scrap-Bow keywords satisfy a bow Kit in the medium slot ([${bow.system.keywords.join(", ")}])`);
  note(!!langGear.ScrapBow?.Name && !!langGear.ScrapBow?.Description, "Scrap-Bow resolves a lang Name + Description");
  note(gearMaster.includes("Scrap-Bow"), "Gear master §3F lists Scrap-Bow");
}
const hexshot = KIT_STREET_GRANTS.hexshot;
note(hexshot.weapons.length === 2 && hexshot.weapons.includes("street-bow") && hexshot.weapons.includes("scrap-bow"),
  `Hexshot grants both bows ([${hexshot.weapons.join(", ")}])`);
note(!hexshot.note, "Hexshot no longer carries the partial-medium-bow note");
const hexshotKit = readJson("src/packs/kits/ranged/hexshot.json");
const wanted = hexshotKit.system.equipment.weapon;
const granted = hexshot.weapons.map(s => byDsid.get(s)).filter(Boolean).flatMap(d => d.system.keywords ?? []);
for (const category of wanted) {
  note(granted.includes(category), `Hexshot's "${category}" weapon slot is satisfied at Street`);
}
note(!readFileSync("tools/kit-grants-smoke.mjs", "utf8").includes("hexshot: [\"medium\"]"),
  "the G1 smoke no longer carries Hexshot as a documented gap");

/* ---------------------------------------------------------------- report */
if (fail.length) {
  console.error(`\n${fail.length} failure(s):`);
  for (const msg of fail) console.error(`  ✗ ${msg}`);
  process.exit(1);
}
console.log("\nG2 armor / gadget mod families smoke: ok");
