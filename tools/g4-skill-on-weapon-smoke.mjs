#!/usr/bin/env node
/**
 * G4 (0.3.102) — B49 skill-on-weapon rolls smoke.
 *
 * Covers the G4 lock (docs/directors/_claude-g4-g3-prompt.md, backlog row G4):
 *   1. the SKU table in scripts/weapon-skills.mjs still equals the folder rule Michael locked
 *   2. every shipped weapon SKU is mapped — deliberately, including the deliberate `null`s
 *   3. the three rows that are easy to get backwards: melee/ heavy-band, heavy/ "Mounted", bows
 *   4. every skill named is a real Ghostwire skill
 *   5. a gun on a deployed machine answers to Gunnery, and a Director flag beats everything
 *   6. +2 lands only when the hero owns that skill (Workhorse vs Chatterbox, one skill each)
 *   7. the ability B49 spawns really carries the cached skill key (registerEquipmentUse is run)
 *   8. module.mjs seeds the dialog, not config.modifiers — the only path the system leaves open
 *
 * Run (no live Foundry needed): node tools/g4-skill-on-weapon-smoke.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { SKILLS } from "../scripts/skills.mjs";
import {
  MOUNTED_SKILL,
  WEAPON_SKILLS,
  WEAPON_SKILL_BONUS,
  actorHasSkill,
  isMachineActor,
  weaponSkillBonus,
  weaponSkillKey,
} from "../scripts/weapon-skills.mjs";
import { atLeast } from "./lib/module-version.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const fail = [];
const note = (pass, msg) => (pass ? console.log(`  ✓ ${msg}`) : fail.push(msg));

const readJson = path => JSON.parse(readFileSync(path, "utf8"));
const module = readJson("module.json");

console.log("G4 B49 skill-on-weapon rolls smoke (0.3.102)\n");

/* ---------------------------------------------------------------- the locked folder rule */

// Michael's mapping table, 2026-09-22. Folder -> skill for every weapon SKU in that folder.
const FOLDER_SKILL = {
  "bows-exotic": "firearms",      // bows / crossbows / needlers: "conventional ranged weapons"
  "heavy": "heavyWeapons",
  "light-firearms": "firearms",
  "longarms": "firearms",
  "melee": "melee",               // even when the kit band says heavy
  "mounted": "gunnery",           // 0.3.112 vehicle/drone hardpoint SKUs — no hand-held way to fire one
  "thrown": null,                 // only the two placed charges are named; see below
};
// The named exceptions inside a folder.
const SKU_OVERRIDE = {
  "thermite-charge": "demolitions",
  "shaped-charge": "demolitions",
  "weighted-net": null,           // flung by hand, not fired
};

function scanWeapons() {
  const base = "src/packs/gear/weapons";
  const rows = [];
  for (const file of readdirSync(base, { recursive: true })) {
    const rel = String(file).replaceAll("\\", "/");
    if (!rel.endsWith(".json") || rel.endsWith("_folder.json") || !rel.includes("/")) continue;
    const data = readJson(join(base, rel));
    if (!data._id) continue;
    rows.push({
      folder: rel.split("/")[0], dsid: data.system._dsid, path: rel,
      gear: data.flags?.[MODULE_ID]?.gear ?? {}, keywords: data.system.keywords ?? [],
    });
  }
  return rows;
}

const weapons = scanWeapons();
const EXPECTED_SKUS = 66;   // 57 through 0.3.111 + the nine 0.3.112 mounted/ SKUs
note(weapons.length === EXPECTED_SKUS, `read ${weapons.length} weapon SKUs out of src/packs/gear/weapons (expected ${EXPECTED_SKUS})`);

const expected = Object.fromEntries(weapons.map(w =>
  [w.dsid, (w.dsid in SKU_OVERRIDE) ? SKU_OVERRIDE[w.dsid] : FOLDER_SKILL[w.folder]]));

const drift = weapons.filter(w => WEAPON_SKILLS[w.dsid] !== expected[w.dsid]);
const driftNote = drift.map(w => `${w.dsid} is ${WEAPON_SKILLS[w.dsid]}, folder says ${expected[w.dsid]}`).join("; ");
note(!drift.length, `every SKU's table entry matches its folder rule${drift.length ? ` — drift: ${driftNote}` : ""}`);

const unmapped = weapons.filter(w => !(w.dsid in WEAPON_SKILLS));
note(!unmapped.length, `no weapon SKU is missing from the table${unmapped.length ? ` — ${unmapped.map(w => w.dsid).join(", ")}` : ""}`);

const stale = Object.keys(WEAPON_SKILLS).filter(dsid => !weapons.some(w => w.dsid === dsid));
note(!stale.length, `no table entry points at a SKU that no longer ships${stale.length ? ` — ${stale.join(", ")}` : ""}`);

/* ---------------------------------------------------------------- the rows that bite */

const byFolder = folder => weapons.filter(w => w.folder === folder);

const heavyBandMelee = byFolder("melee").filter(w => w.gear.weaponBand === "heavy");
note(heavyBandMelee.length >= 3, `melee/ ships ${heavyBandMelee.length} heavy-band SKUs to get wrong (${heavyBandMelee.map(w => w.dsid).join(", ")})`);
note(heavyBandMelee.every(w => WEAPON_SKILLS[w.dsid] === "melee"),
  "THE LOCK: a heavy-band melee weapon is Melee, never Heavy Weapons");
note(!byFolder("melee").some(w => WEAPON_SKILLS[w.dsid] === "heavyWeapons"),
  "no melee/ SKU maps to heavyWeapons at all");

const mounted = byFolder("heavy").filter(w => (w.gear.tags ?? []).includes("Mounted"));
note(mounted.length >= 2, `heavy/ ships ${mounted.length} "Mounted"-tagged SKUs (${mounted.map(w => w.dsid).join(", ")})`);
note(mounted.every(w => WEAPON_SKILLS[w.dsid] === "heavyWeapons"),
  "a Mounted-tagged heavy weapon in a hero's hands is still Heavy Weapons — Gunnery is the chassis, not the tag");
note(byFolder("heavy").every(w => WEAPON_SKILLS[w.dsid] === "heavyWeapons"), "every heavy/ SKU is Heavy Weapons");

// 0.3.112 — mounted/ is the other side of the same coin: hardpoint hardware, Gunnery by SKU.
const mountedFolder = byFolder("mounted");
note(mountedFolder.length >= 8, `mounted/ ships ${mountedFolder.length} vehicle-mount SKUs`);
note(mountedFolder.every(w => WEAPON_SKILLS[w.dsid] === MOUNTED_SKILL),
  "every mounted/ SKU answers to Gunnery even off a hardpoint — it has no hand-held mode");
note(mountedFolder.every(w => (w.gear.tags ?? []).includes("Mounted") && !!w.gear.mountScale),
  "every mounted/ SKU carries the Mounted tag and a gear.mountScale");

const bows = byFolder("bows-exotic").filter(w => w.keywords.includes("bow"));
note(bows.length >= 5 && bows.every(w => WEAPON_SKILLS[w.dsid] === "firearms"),
  `every bow-keyword SKU is Firearms (${bows.length} of them)`);
note([...byFolder("light-firearms"), ...byFolder("longarms")].every(w => WEAPON_SKILLS[w.dsid] === "firearms"),
  "every light-firearms/ and longarms/ SKU is Firearms");
note((WEAPON_SKILLS["thermite-charge"] === "demolitions") && (WEAPON_SKILLS["shaped-charge"] === "demolitions"),
  "Thermite Charge and Shaped Charge are Demolitions");
note(byFolder("thrown").filter(w => WEAPON_SKILLS[w.dsid] === "demolitions").length === 2,
  "and no other thrown SKU claims Demolitions");

/* ---------------------------------------------------------------- the skills are real */

const allSkills = new Set(Object.values(SKILLS).flat());
const named = [...new Set([...Object.values(WEAPON_SKILLS).filter(Boolean), MOUNTED_SKILL])].sort();
const bogus = named.filter(key => !allSkills.has(key));
note(!bogus.length, `every skill the mapping names is registered in scripts/skills.mjs (${named.join(", ")})${bogus.length ? ` — bogus: ${bogus.join(", ")}` : ""}`);
note(WEAPON_SKILL_BONUS === 2, "the skill benefit is RAW's flat +2, not an edge");

/* ---------------------------------------------------------------- resolution */

const gearStub = (dsid, extra = {}, parent = null) => ({
  id: `gear-${dsid}`, uuid: `Actor.x.Item.gear-${dsid}`, name: dsid, img: "x.webp", parent,
  system: { _dsid: dsid, kind: "weapon" },
  flags: { [MODULE_ID]: { gear: { damage: 4, damageType: "kinetic", range: "Short", ...extra } } },
});
const heroStub = (...skills) => ({
  type: "hero", name: `hero(${skills.join("+") || "none"})`,
  system: { skills: { value: new Set(skills) } }, items: new Map(),
});
const machineStub = () => ({ name: "Hardtop", flags: { [MODULE_ID]: { kind: "vehicle", band: "vehicle-car" } } });

note(weaponSkillKey(gearStub("workhorse")) === "firearms", "weaponSkillKey(Workhorse) is firearms");
note(weaponSkillKey(gearStub("chatterbox")) === "heavyWeapons", "weaponSkillKey(Chatterbox) is heavyWeapons");
note(weaponSkillKey(gearStub("warhammer")) === "melee", "weaponSkillKey(Warhammer) is melee, not heavyWeapons");
note(weaponSkillKey(gearStub("frag")) === null, "weaponSkillKey(Frag) is null — no skill, no bonus");
note(weaponSkillKey(gearStub("some-homebrew-gun")) === null, "an unknown SKU gets null rather than a guess");

note(isMachineActor(machineStub()) && !isMachineActor(heroStub("firearms")),
  "a deployed machine Actor is told apart from a hero");
note(weaponSkillKey(gearStub("wallbreaker", {}, machineStub())) === "gunnery",
  "a Wallbreaker bolted to a deployed vehicle answers to Gunnery, not Heavy Weapons");
// 0.3.112 — bolting a hand-held heavy onto a hardpoint swings it to Gunnery without moving the Item.
const mountedStub = gearStub("wallbreaker");
mountedStub.flags[MODULE_ID].mount = { mountedOn: "kit-gun-rack" };
note(weaponSkillKey(mountedStub) === "gunnery",
  "a Wallbreaker mounted on a Gun Rack answers to Gunnery while still on the hero's sheet");
const unmountedStub = gearStub("wallbreaker");
unmountedStub.flags[MODULE_ID].mount = { mountedOn: null };
note(weaponSkillKey(unmountedStub) === "heavyWeapons",
  "and unmounting it swings back to Heavy Weapons");

note(weaponSkillKey(gearStub("warhammer", { weaponSkill: "brawl" })) === "brawl",
  "a Director's gear.weaponSkill flag beats the table");
note(weaponSkillKey(gearStub("workhorse", { weaponSkill: null })) === null,
  "and gear.weaponSkill: null opts a weapon out entirely");
note(weaponSkillKey(gearStub("wallbreaker", { weaponSkill: "heavyWeapons" }, machineStub())) === "heavyWeapons",
  "the flag beats the chassis too");

/* ---------------------------------------------------------------- +2 only when owned */

const abilityStub = (dsid, weaponSkill) => ({
  name: `Fire ${dsid}`,
  flags: { [MODULE_ID]: { fromGearId: `gear-${dsid}`, ...(weaponSkill === undefined ? {} : { weaponSkill }) } },
});

const gunner = heroStub("firearms");
const trooper = heroStub("heavyWeapons");
const civilian = heroStub();

const workhorse = abilityStub("workhorse", "firearms");
const chatterbox = abilityStub("chatterbox", "heavyWeapons");

note(weaponSkillBonus(workhorse, gunner).bonus === 2, "Firearms hero, Fire Workhorse: +2");
note(weaponSkillBonus(chatterbox, gunner).bonus === 0, "Firearms hero, Fire Chatterbox: +0");
note(weaponSkillBonus(workhorse, trooper).bonus === 0, "Heavy Weapons hero, Fire Workhorse: +0");
note(weaponSkillBonus(chatterbox, trooper).bonus === 2, "Heavy Weapons hero, Fire Chatterbox: +2");
note((weaponSkillBonus(workhorse, civilian).bonus === 0) && (weaponSkillBonus(chatterbox, civilian).bonus === 0),
  "unskilled hero: +0 with either gun");
note(weaponSkillBonus(abilityStub("frag", null), heroStub("demolitions")).bonus === 0,
  "a Demolitions hero gets nothing for a Frag — it maps to no skill");
note(weaponSkillBonus(abilityStub("thermite-charge", "demolitions"), heroStub("demolitions")).bonus === 2,
  "but +2 on a Thermite Charge");
note(weaponSkillBonus({ name: "Rush", flags: {} }, gunner).bonus === 0,
  "an ability B49 did not spawn is left alone");

// Pre-0.3.102 abilities carry no weaponSkill flag: the source gear on the sheet answers instead.
const legacyHero = heroStub("firearms");
legacyHero.items.set("gear-workhorse", gearStub("workhorse"));
note(weaponSkillBonus(abilityStub("workhorse", undefined), legacyHero).bonus === 2,
  "an ability armed before 0.3.102 resolves through its gear — no migration pass needed");
note(weaponSkillBonus(abilityStub("workhorse", undefined), heroStub("firearms")).bonus === 0,
  "and a flagless ability whose gear is gone falls back to +0");

note(actorHasSkill({ system: { skills: { value: ["firearms"] } } }, "firearms"),
  "actorHasSkill copes with a plain array as well as a Set");

/* ---------------------------------------------------------------- the ability really carries it */

// Run registerEquipmentUse for real against stub globals, so buildUseAbility uses the shipped templates.
let readyHook = null;
globalThis.Hooks = { once: (hook, cb) => { if (hook === "ready") readyHook ??= cb; }, on: () => {} };
globalThis.game = {
  user: { id: "u" },
  actors: [],
  modules: { get: () => ({}) },
  i18n: { localize: key => key, format: (key, data) => `${key}:${Object.values(data).join("|")}` },
};
globalThis.foundry = {
  utils: {
    randomID: () => "abcdefghijklmnop",
    fetchJsonWithTimeout: async path => readJson(path.replace(`modules/${MODULE_ID}/`, "")),
  },
};

const { registerEquipmentUse, buildUseAbility, isWeaponTreasure } = await import("../scripts/equipment-use.mjs");
registerEquipmentUse();
await readyHook();

const shippedGear = dsid => weapons.find(w => w.dsid === dsid)?.gear ?? {};
const built = dsid => buildUseAbility(gearStub(dsid, shippedGear(dsid)));
const builtWorkhorse = built("workhorse");
const builtChatterbox = built("chatterbox");
const builtWarhammer = built("warhammer");

note(!!builtWorkhorse, "buildUseAbility still builds an ability with the shipped templates");
note(builtWorkhorse?.flags?.[MODULE_ID]?.weaponSkill === "firearms", "Fire Workhorse is stamped weaponSkill: firearms");
note(builtChatterbox?.flags?.[MODULE_ID]?.weaponSkill === "heavyWeapons", "Fire Chatterbox is stamped weaponSkill: heavyWeapons");
note(builtWarhammer?.flags?.[MODULE_ID]?.weaponSkill === "melee", "Strike with Warhammer is stamped weaponSkill: melee");
note(builtWorkhorse?.flags?.[MODULE_ID]?.fromGearId === "gear-workhorse", "and the B49 gear link is untouched");
note(built("frag")?.flags?.[MODULE_ID]?.weaponSkill === null, "a Frag's ability is stamped null, not left undefined");
note(isWeaponTreasure({ type: "treasure", system: { kind: "weapon" }, flags: { [MODULE_ID]: { gear: { range: "Short" } } } }),
  "isWeaponTreasure is unchanged");

// The bonus must ride the dialog context; AbilityModel#use drops config.modifiers.bonuses on the floor.
const moduleSrc = readFileSync("scripts/module.mjs", "utf8");
note(moduleSrc.includes("weaponSkillBonus"), "scripts/module.mjs calls weaponSkillBonus in the ability use patch");
note(/dialogOptions = foundry\.utils\.mergeObject\(dialogOptions, \{ context: \{ modifiers: \{ bonuses/.test(moduleSrc),
  "and seeds it on dialogOptions.context.modifiers.bonuses, not config.modifiers");

note(atLeast(module.version, "0.3.102"), `module.json is ${module.version} (>= 0.3.102)`);

/* ---------------------------------------------------------------- */

console.log("");
if (fail.length) {
  for (const msg of fail) console.error(`  ✗ ${msg}`);
  console.error(`\nG4 smoke FAILED — ${fail.length} check(s).`);
  process.exit(1);
}
console.log("G4 smoke PASS.");
