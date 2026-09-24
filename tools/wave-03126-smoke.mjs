#!/usr/bin/env node
/**
 * 0.3.126 smoke — Raw Reagent, gun ammunition, and the thrown Blast line.
 *
 *   A  Raw Reagent is a Medic-only maneuver worth +1 Reagent against the kit ceiling, it refuses
 *      rather than wasting itself, the 3-Pack is one row of quantity 3 at ¥5,500, and both sit on
 *      the Medical shelf the Street Clinic kiosk already stocks.
 *   B  Every gun in light-firearms/, longarms/ and heavy/ carries an ammoFamily stamp that agrees
 *      with the folder rule; the five capacities are the locked ones; firing spends one and refuses
 *      at zero; Reload tops to capacity in one action and hands leftovers of the old type back; Gel
 *      is 1 Stamina + Dazed.
 *   C  Thrown Blast grenades stop being B49 free strikes and gain a circle + Reflex save;
 *      Flash-Bang's impact is Dazed with no damage; EMP is ¥5,000 and suppresses chrome 1 round
 *      (2 on HIGH); the inert Ammo Counter duplicates are gone.
 *
 *      **The save table moved.** 0.3.127 (A) replaced fail / success / critical-success with
 *      Low / Mid / High and put the circle at 15 ft, so those assertions live in
 *      tools/wave-03127-smoke.mjs now. What stays here is the part 0.3.127 did not touch: which
 *      SKUs convert, which stay Adjacent demolition, and what each impact block holds.
 *
 * Run: node tools/wave-03126-smoke.mjs
 * Does not need live Foundry.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import {
  AMMO_FAMILIES, AMMO_FAMILY_BY_DSID, AMMO_TYPES, AMMO_TYPE_KEYS, DEFAULT_AMMO_TYPE,
  FAMILY_CAPACITY, GEL_CONDITION, GEL_STAMINA, ROUNDS_PER_BOX,
  ammoFamilyOf, ammoTypeOfStack, capacityForFamily, gelRider, isAmmoWeapon, loadedAmmo,
  planFire, planReload,
} from "../scripts/ammo.mjs";
import {
  BLAST_FEET, REFLEX_CHARACTERISTIC,
  blastDamageTiers, impactFor, isThrownBlast, planBlastImpact, thrownSpec,
} from "../scripts/grenades.mjs";
import { planReagentDose, planConsumableUse, isConsumableTreasure, consumableUseOf } from "../scripts/consumable-use.mjs";
import { reagentCapacity } from "../scripts/reagents.mjs";
import { matchPresetItem, getPreset } from "../scripts/kiosk-presets.mjs";
import { WEAPON_SKILLS } from "../scripts/weapon-skills.mjs";
import { atLeast } from "./lib/module-version.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const fail = [];
const note = (pass, msg) => { if (pass) console.log(`  ✓ ${msg}`); else { fail.push(msg); console.log(`  ✗ ${msg}`); } };

const read = p => readFileSync(p, "utf8").replace(/\r\n/g, "\n");
const readJson = p => JSON.parse(read(p));
const lang = readJson("lang/en.json").GHOSTWIRE;
const gearFlags = item => item.flags?.[MODULE_ID]?.gear ?? {};

console.log("0.3.126 wave smoke\n");

/* ------------------------------------------------------------------ A: Raw Reagent */

console.log("A) Raw Reagent — emergency restock, Medic only, against the kit ceiling");

const rawReagent = readJson("src/packs/gear/general/medical/raw-reagent.json");
const threePack = readJson("src/packs/gear/general/medical/raw-reagent-3-pack.json");

note(rawReagent.system._dsid === "raw-reagent", "raw-reagent.json carries the locked _dsid");
note(rawReagent.type === "treasure" && rawReagent.system.kind === "other" && rawReagent.system.category === "trinket",
  "and the Trauma Patch's type / kind / category");
note(gearFlags(rawReagent).price === 2000, "priced at ¥2,000");
note(gearFlags(threePack).price === 5500, "the 3-Pack at ¥5,500");
note(gearFlags(rawReagent).consumable === true && gearFlags(rawReagent).tags.includes("Consumable"),
  "both are tagged Consumable");

// A2 shape choice: ONE row, quantity 3, same use block. Recorded here so the choice cannot drift.
note(threePack.system.quantity === 3 && rawReagent.system.quantity === 1,
  "the 3-Pack is one row of quantity 3 — one Use path, no container document");
note(JSON.stringify(consumableUseOf(threePack)) === JSON.stringify(consumableUseOf(rawReagent)),
  "and it carries exactly the single's use block, so a dose out of the case is the same dose");

for (const [name, item] of [["Raw Reagent", rawReagent], ["3-Pack", threePack]]) {
  const use = consumableUseOf(item);
  note(isConsumableTreasure(item), `${name} spawns a use ability`);
  note(use.action === "maneuver", `${name} is a maneuver, like the Trauma Patch`);
  note(use.spend === true, `${name} is spent on use`);
  note(use.reagentGrant === 1, `${name} grants exactly 1 Reagent`);
}

// The grant itself, against the real Echelon ceilings from scripts/reagents.mjs.
{
  const capacity = reagentCapacity({ echelon: 1 });                    // 10
  const medic = planReagentDose({ medic: true, current: 4, capacity, grant: 1 });
  const capped = planReagentDose({ medic: true, current: capacity - 1, capacity, grant: 1 });
  const full = planReagentDose({ medic: true, current: capacity, capacity, grant: 1 });
  const civilian = planReagentDose({ medic: false, current: 4, capacity, grant: 1 });
  note(medic.ok && medic.value === 5 && medic.granted === 1, "a Medic at 4 of 10 goes to 5");
  note(capped.ok && capped.value === capacity, "a Medic at 9 of 10 fills to the ceiling and no further");
  note(!full.ok && full.reason === "reagentsFull", "a Medic already at capacity is refused, not spent for nothing");
  note(!civilian.ok && civilian.reason === "notMedic", "a non-Medic is refused with notMedic");
}

// And through the shared consumable planner, which is the path applyDose actually takes.
{
  const use = consumableUseOf(rawReagent);
  const ok = planConsumableUse({ quantity: 1, medic: true, reagents: 2, reagentCapacity: 10, use });
  const no = planConsumableUse({ quantity: 1, medic: false, reagents: 2, reagentCapacity: 10, use });
  note(ok.ok && ok.reagentValue === 3 && ok.reagentsGranted === 1 && ok.quantityAfter === 0,
    "planConsumableUse grants the Reagent and spends the dose");
  note(!no.ok && no.reason === "notMedic", "and refuses a non-Medic before anything is spent");
  note(no.quantityAfter === 1, "the refused dose is still in the pouch");
}

// A3 — the Medical shelf. New JSON under general/medical auto-stocks; assert it rather than assume.
{
  const medical = getPreset("medical");
  for (const [name, item] of [["Raw Reagent", rawReagent], ["3-Pack", threePack]]) {
    const row = { ...item, pack: "gear", path: `general/medical/${item.system._dsid}` };
    note(matchPresetItem(row, medical), `${name} matches the Medical / Street Clinic kiosk preset`);
  }
  note(rawReagent.folder === "6OQ8YIl853VINDDp" && threePack.folder === "6OQ8YIl853VINDDp",
    "both sit in the Medical compendium folder");
}

note(!!lang.Gear.Items.RawReagent?.Name && !!lang.Gear.Items.RawReagent3Pack?.Name, "both have lang names");
note(/Medic only/i.test(lang.Gear.Items.RawReagent.Description), "the single's copy says Medic only out loud");
note(!!lang.ConsumableUse.NotMedic && !!lang.ConsumableUse.ReagentsFull, "the two refusals have strings");
note(!!lang.ConsumableUse.Effects.Reagents, "and the generated card has a Reagents effect line");

/* ------------------------------------------------------------------ B: gun ammunition */

console.log("\nB) Guns spend rounds — five families, five capacities, one Reload");

note(JSON.stringify(FAMILY_CAPACITY) === JSON.stringify({ handgun: 12, smg: 30, longarm: 20, shotgun: 8, heavy: 50 }),
  "the locked capacities: Handgun 12 · SMG 30 · Longarm 20 · Shotgun 8 · Heavy 50");

/**
 * The folder rule, re-derived from the tree on every run so the table in scripts/ammo.mjs and the
 * SKUs on disk cannot drift apart — the same contract tools/g4-skill-on-weapon-smoke.mjs holds.
 * Shotguns are the two SKUs whose own blurb says "shotgun"; everything else in longarms/ is a rifle.
 */
const GUN_DIRS = ["light-firearms", "longarms", "heavy"];
const SMG_DSIDS = new Set(["streetsweeper-smg", "buzz-gun"]);
const SHOTGUN_DSIDS = new Set(["autoshotgun", "boomstick"]);
const expectedFamily = (dir, dsid) => {
  if (dir === "heavy") return "heavy";
  if (dir === "light-firearms") return SMG_DSIDS.has(dsid) ? "smg" : "handgun";
  return SHOTGUN_DSIDS.has(dsid) ? "shotgun" : "longarm";
};

const guns = [];
for (const dir of GUN_DIRS) {
  const base = join("src/packs/gear/weapons", dir);
  for (const file of readdirSync(base).filter(f => f.endsWith(".json") && f !== "_folder.json")) {
    guns.push({ dir, file, doc: readJson(join(base, file)) });
  }
}
note(guns.length === 27, `${guns.length} gun SKUs across ${GUN_DIRS.join(" / ")}`);

const mismatched = guns.filter(({ dir, doc }) => gearFlags(doc).ammoFamily !== expectedFamily(dir, doc.system._dsid));
note(!mismatched.length,
  `every gun carries the ammoFamily its folder implies${mismatched.length ? ` — ${mismatched.map(g => g.file).join(", ")}` : ""}`);

const tableGaps = guns.filter(({ dir, doc }) => AMMO_FAMILY_BY_DSID[doc.system._dsid] !== expectedFamily(dir, doc.system._dsid));
note(!tableGaps.length,
  `AMMO_FAMILY_BY_DSID agrees with the tree${tableGaps.length ? ` — ${tableGaps.map(g => g.file).join(", ")}` : ""}`);
note(Object.keys(AMMO_FAMILY_BY_DSID).length === guns.length, "and holds no row the tree does not");

// Nothing outside those three folders eats ammunition — melee, bows, thrown and hardpoints stay out.
{
  const outside = [];
  for (const dir of ["melee", "bows-exotic", "thrown", "mounted"]) {
    const base = join("src/packs/gear/weapons", dir);
    for (const file of readdirSync(base).filter(f => f.endsWith(".json") && f !== "_folder.json")) {
      const doc = readJson(join(base, file));
      if (ammoFamilyOf(doc) || AMMO_FAMILY_BY_DSID[doc.system._dsid]) outside.push(`${dir}/${file}`);
    }
  }
  note(!outside.length, `melee / bows / thrown / mounted spend no rounds${outside.length ? ` — ${outside.join(", ")}` : ""}`);
}

// Families resolve through the stamp, and a stamp beats the table.
{
  const handgun = guns.find(g => g.doc.system._dsid === "popper").doc;
  note(ammoFamilyOf(handgun) === "handgun" && isAmmoWeapon(handgun), "the Popper reads as a handgun");
  note(capacityForFamily(ammoFamilyOf(handgun)) === 12, "and holds 12");
  const overridden = { ...handgun, flags: { [MODULE_ID]: { gear: { ...gearFlags(handgun), ammoFamily: "smg" } } } };
  note(ammoFamilyOf(overridden) === "smg", "a Director's stamp beats the compiled table");
  const optedOut = { ...handgun, flags: { [MODULE_ID]: { gear: { ...gearFlags(handgun), ammoFamily: null } } } };
  note(ammoFamilyOf(optedOut) === null && !isAmmoWeapon(optedOut), "and a null stamp opts a gun out entirely");
}

// B1 — an unstamped gun is empty, not full.
note(loadedAmmo({}).count === 0 && loadedAmmo({}).type === DEFAULT_AMMO_TYPE,
  "a gun nobody has loaded reads as 0 Standard, never as a free full magazine");

// B2 / B3 — firing and the refusal.
note(planFire({ loadedCount: 12 }).ok && planFire({ loadedCount: 12 }).count === 11, "firing spends exactly one round");
note(!planFire({ loadedCount: 0 }).ok && planFire({ loadedCount: 0 }).reason === "empty", "an empty gun refuses");
note(lang.Ammo.Empty === "You are out of ammunition.", "with the locked English: \"You are out of ammunition.\"");

// B4 — Reload tops to capacity in ONE action.
{
  const topped = planReload({ family: "smg", loadedCount: 4, loadedType: "standard", ammoType: "standard", stock: 90 });
  note(topped.ok && topped.count === 30 && topped.taken === 26, "an SMG at 4 tops to 30 in one action, taking 26");
  note(topped.stockAfter === 64, "and the pocket goes 90 -> 64");
  const short = planReload({ family: "heavy", loadedCount: 0, loadedType: "standard", ammoType: "standard", stock: 30 });
  note(short.ok && short.count === 30 && short.taken === 30, "a Heavy with one box in the pocket loads 30 of its 50");
  const full = planReload({ family: "shotgun", loadedCount: 8, loadedType: "standard", ammoType: "standard", stock: 40 });
  note(!full.ok && full.reason === "full", "a full shotgun refuses rather than shuffling shells");
  const dry = planReload({ family: "handgun", loadedCount: 0, loadedType: "standard", ammoType: "ap", stock: 0 });
  note(!dry.ok && dry.reason === "noStock", "and a type you have none of refuses with noStock");
}

// B5 — switching type hands the old rounds back.
{
  const swap = planReload({ family: "handgun", loadedCount: 5, loadedType: "standard", ammoType: "ap", stock: 30 });
  note(swap.ok && swap.count === 12 && swap.type === "ap", "swapping to AP fills the handgun to 12 of AP");
  note(swap.returnedType === "standard" && swap.returnedCount === 5, "and the 5 Standard still in it go back to the pocket");
  note(swap.taken === 12 && swap.stockAfter === 18, "12 AP leave the AP stack, not 7");
  const noSwap = planReload({ family: "handgun", loadedCount: 5, loadedType: "standard", ammoType: "standard", stock: 30 });
  note(noSwap.returnedCount === 0, "topping up the same type returns nothing");
  const blocked = planReload({ family: "handgun", loadedCount: 5, loadedType: "standard", ammoType: "gel", stock: 0 });
  note(!blocked.ok && blocked.returnedCount === 0,
    "a switch you cannot fill never unloads the gun — you keep the 5 you had");
}

// B7 — Stick-n-Shock.
{
  const gel = gelRider({ loadedType: "gel" });
  note(!!gel && gel.stamina === GEL_STAMINA && gel.condition === GEL_CONDITION,
    `Gel on a hit is ${GEL_STAMINA} Stamina + ${GEL_CONDITION}`);
  note(gel.replacesDamage === true, "and it replaces the gun's printed damage rather than stacking on it");
  note(gelRider({ loadedType: "standard" }) === null && gelRider({ loadedType: "ap" }) === null,
    "Standard and AP carry no rider");
  note(/1 Stamina damage and Dazed/i.test(lang.Gear.Items.GelStickNShock.Description),
    "and the SKU's own copy says so, so the card and the catalog agree");
}

// The three stacks: rounds, not abstract magazines.
for (const [type, dsid] of Object.entries(AMMO_TYPES)) {
  const item = readJson(`src/packs/gear/general/ammunition/${dsid}.json`);
  note(ammoTypeOfStack(item) === type, `${item.system._dsid} reads as ${type}`);
  note(item.system.quantity === ROUNDS_PER_BOX, `and ships as a box of ${ROUNDS_PER_BOX} rounds`);
}
note(AMMO_TYPE_KEYS.length === 3 && AMMO_FAMILIES.length === 5, "three ammo types, five families");

// The G4 skill map must still cover every gun — the ammoFamily stamp is additive, not a rewrite.
note(guns.every(({ doc }) => WEAPON_SKILLS[doc.system._dsid]), "every gun still maps to a weapon skill");

/* ------------------------------------------------------------------ C: thrown Blast line */

console.log("\nC) Throw — a 20 ft circle, a Reflex save, and no more single-target grenades");

const THROWN_DIR = "src/packs/gear/weapons/thrown";
const thrown = Object.fromEntries(readdirSync(THROWN_DIR)
  .filter(f => f.endsWith(".json") && f !== "_folder.json")
  .map(f => [f.replace(/\.json$/, ""), readJson(join(THROWN_DIR, f))]));

const BLAST_LINE = ["frag", "flash-bang-3e", "smart-grenade", "gasser", "firestarter", "emp-grenade", "smoke-grenade"];
const ADJACENT_DEMO = ["thermite-charge", "shaped-charge"];

for (const key of BLAST_LINE) {
  note(!!thrown[key], `${key}.json is on the thrown shelf`);
  note(isThrownBlast(thrown[key]), `${key} converts to Throw + template + save`);
  note(thrownSpec(thrown[key]).feet === BLAST_FEET, `${key} follows BLAST_FEET — a ${BLAST_FEET} ft circle`);
}
for (const key of ADJACENT_DEMO) {
  note(!isThrownBlast(thrown[key]), `${key} stays Adjacent demolition — it is placed, not lobbed`);
  note(gearFlags(thrown[key]).range === "Adjacent", `and still reads Adjacent`);
}
note(!isThrownBlast(thrown["throwing-knife"]), "the throwing knife is not a grenade and is untouched");

// C2 — the Reflex characteristic. The save *table* is 0.3.127's; see tools/wave-03127-smoke.mjs.
note(REFLEX_CHARACTERISTIC === "agility", "Ghostwire's Reflex is Draw Steel's agility key");

// C3 — impacts.
note(blastDamageTiers(6).join("/") === "4/6/8", "a printed 6 reads 4 / 6 / 8, the B49 ranged spread");
note(blastDamageTiers(1).join("/") === "1/1/3", "and a connecting hit never floors below 1");
{
  const frag = thrownSpec(thrown.frag);
  note(frag.impact.damage === 6, "Frag keeps its printed tier impacts");
  const low3 = planBlastImpact({ outcome: "low", throwerTier: 3 });
  note(impactFor(frag.impact, low3).damage === 8, "a tier-3 Frag against a Low save is its tier-3 8");
}
{
  const flash = thrown["flash-bang-3e"];
  note(gearFlags(flash).damage === null && gearFlags(flash).damageType === null,
    "Flash-Bang's misleading 4 electrical is stripped");
  const impact = impactFor(thrownSpec(flash).impact, planBlastImpact({ outcome: "low", throwerTier: 2 }));
  note(impact.damage === 0 && impact.conditions.join() === "dazed", "its impact is Dazed and nothing else");
  note(/Dazed/.test(lang.Gear.Items.FlashBang3e.Description) && !/4 electrical/.test(lang.Gear.Items.FlashBang3e.Description),
    "and the catalog copy agrees");
}
{
  const emp = thrown["emp-grenade"];
  note(emp.system._dsid === "emp-grenade" && gearFlags(emp).price === 5000, "the EMP Grenade is ¥5,000");
  const spec = thrownSpec(emp);
  const low2 = planBlastImpact({ outcome: "low", throwerTier: 2 });
  const low3 = planBlastImpact({ outcome: "low", throwerTier: 3 });
  const high = planBlastImpact({ outcome: "high", throwerTier: 3 });
  note(impactFor(spec.impact, low2).chromeSuppress === 1, "a Low save suppresses chrome for 1 round");
  note(impactFor(spec.impact, low3).chromeSuppress === 2, "a HIGH throw plus a Low save makes it 2");
  note(impactFor(spec.impact, high).chromeSuppress === 0, "a High save suppresses nothing");
  note(impactFor(spec.impact, low2).damage === 0, "and an EMP never damages a body");
  note(!!lang.Gear.Items.EmpGrenade?.Name, "it has a lang name");
}
{
  const smoke = thrown["smoke-grenade"];
  note(thrownSpec(smoke).save === false, "Smoke places its circle with no save — a canister hurts nobody");
  note(gearFlags(smoke).damage === null, "and carries no damage line");
  note(smoke.system.kind === "weapon" && smoke.folder === "78iusAOPSM8frLfk",
    "it is a Weapons Cage row now, not an Ammo Counter one");
  note(smoke.system._dsid === "smoke", "its _dsid is unchanged, so a sheet that already holds one keeps it");
}

// C4 — the Ammo Counter no longer double-sells broken copies.
for (const gone of ["frag-grenade", "flash-bang", "smoke"]) {
  note(!existsSync(`src/packs/gear/general/ammunition/${gone}.json`),
    `the inert ${gone} duplicate is off the Ammo Counter`);
}
{
  const ammoShelf = readdirSync("src/packs/gear/general/ammunition")
    .filter(f => f.endsWith(".json") && f !== "_folder.json");
  note(ammoShelf.length === 3, `the Ammo Counter is exactly the three round types (${ammoShelf.length})`);
  const ammo = getPreset("ammo");
  for (const key of ["frag", "emp-grenade", "smoke-grenade"]) {
    const row = { ...thrown[key], pack: "gear", path: `weapons/thrown/${key}` };
    note(!matchPresetItem(row, ammo), `${key} does not appear on the Ammo Counter`);
    note(matchPresetItem(row, getPreset("weapons")), `${key} is on the Weapons Cage`);
  }
}
for (const gone of ["FragGrenade", "FlashBang", "Smoke"]) {
  note(!(gone in lang.Gear.Items), `the ${gone} lang entry went with its SKU`);
}

// C4 — and equipment-use.mjs actually refuses to arm them.
{
  const src = read("scripts/equipment-use.mjs");
  note(/isThrownBlast\(item\)\) return false/.test(src), "isWeaponTreasure refuses a thrown Blast grenade");
  note(/isThrownBlast\(gearItem\)/.test(src), "and syncActor sweeps a free strike a grenade spawned before this pass");
}

/* ------------------------------------------------------------------ registration + version */

console.log("\nD) Wiring");

{
  const src = read("scripts/module.mjs");
  note(/import \{ registerAmmo \} from "\.\/ammo\.mjs";/.test(src), "module.mjs imports registerAmmo");
  note(/import \{ registerGrenades \} from "\.\/grenades\.mjs";/.test(src), "module.mjs imports registerGrenades");
  const order = ["registerConsumableUse();", "registerReagents();", "registerAmmo();", "registerGrenades();"]
    .map(call => src.indexOf(call));
  note(order.every(i => i > 0) && order.every((v, i) => !i || v > order[i - 1]),
    "and both register after the other AbilityModel#use patches, so each passes through to the next");
}

const version = readJson("module.json").version;
note(atLeast(version, "0.3.126"), `module.json is ${version}`);
note(read("README.md").includes("`0.3.126`"), "README has a 0.3.126 entry");
note(existsSync("docs/directors/03126-smoke.md"), "the Foundry checklist is written");

/* ------------------------------------------------------------------ */

console.log(fail.length ? `\n0.3.126 smoke FAIL — ${fail.length}\n${fail.map(f => `  - ${f}`).join("\n")}`
  : "\n0.3.126 smoke PASS.");
process.exit(fail.length ? 1 : 0);
