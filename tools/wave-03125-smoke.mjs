#!/usr/bin/env node
/**
 * 0.3.125 smoke — Disengage RAW, the two medical kits, four hotfixes, Medic Reagents.
 *
 *   A  Disengage is a defined move action in 04-combat, in the journal page, and in the
 *      VOIDMARK index — the last of which is the thing that was actually broken at the table.
 *   B  Field Surgery Kit stabilizes a dying target and never spends; Slap-Doc Kit gives two
 *      Recoveries back, offers a physical-condition picker, and deletes itself at zero.
 *   C1 Conceal's tier block has a legal 16-character pseudo-document id — and so does every other
 *      `_id` in `src/packs`, which is the assertion that catches the *next* one.
 *   C2 Raven Beast form is half a square, like Rat.
 *   C3 Kade carries nothing above Echelon 1, and the Warframe pieces his doctrine needs.
 *   C4 `hold-the-line` belongs to the Operator heroic alone; the kit signature is Frame Lock.
 *   E  Kit capacity caps every grant, Craft Reagents is a 1st-level feature and a project, the
 *      signatures' enhance spends are 2+, and every heroic carries its printed Reagent cost.
 *
 * Run: node tools/wave-03125-smoke.mjs
 * Does not need live Foundry.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import {
  planStabilize, clearableConditions, useTargetKind, planConsumableUse,
  PHYSICAL_CONDITIONS, isConsumableTreasure,
} from "../scripts/consumable-use.mjs";
import { beastTokenSize } from "../scripts/changer-forms.mjs";
import {
  reagentCapacity, planReagentGrant, planImprovise, planCraftRestock, clampReagents,
  KIT_CAPACITY_BY_ECHELON, ADVANCED_CHEM_PREP_BONUS, CRAFT_REAGENTS_DSID, CRAFT_REAGENTS_GOAL,
  IMPROVISE_THRESHOLD, echelonForLevel,
} from "../scripts/reagents.mjs";
import { retrieve } from "../scripts/voidmark-rag.mjs";
import { atLeast } from "./lib/module-version.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const fail = [];
const ok = [];
const note = (pass, msg) => (pass ? ok : fail).push(pass ? `  ✓ ${msg}` : msg);

const read = p => readFileSync(p, "utf8").replace(/\r\n/g, "\n");
const readJson = p => JSON.parse(read(p));

const lang = readJson("lang/en.json").GHOSTWIRE;
const gearFlags = item => item.flags?.[MODULE_ID]?.gear ?? {};
const useBlock = item => gearFlags(item).consumableUse ?? null;

console.log("0.3.125 wave smoke\n");

/* ------------------------------------------------------------------ A: Disengage */

console.log("A) Disengage is written down, in all three places it has to be");

const combat = read("docs/raw/04-combat.md");
note(/^### Move actions — Move vs Disengage$/m.test(combat), "04-combat has the Move vs Disengage subsection");
note(/\*\*Disengage\.\*\* \*\*Shift\*\* a number of squares equal to your \*\*Disengage\*\* value/.test(combat),
  "Disengage shifts your Disengage value");
note(/does \*\*not\*\* invite opportunity pressure/.test(combat), "and does not invite opportunity pressure");
note(/\*\*Baseline 1\*\* for every runner/.test(combat), "the value stacks from a baseline of 1");
note(/\+ Kit Disengage bonus/.test(combat) && /Reaction Enhancer \(\+1\)/.test(combat) && /Wired Reflexes \(\+2\)/.test(combat),
  "with the Kit row and the chrome riders named");
note(/\*\*Move action\*\* \| \*\*Move\*\*.*\*\*or Disengage\*\*/.test(combat), "the action budget table offers both");
// B92 keeps VOIDMARK Ghostwire-only: the new chunk must not cite the other book by name, or the
// index builder drops it and the channel goes quiet again for exactly the query it was written for.
const section = combat.slice(combat.indexOf("### Move actions — Move vs Disengage"),
  combat.indexOf("**Ghostwire table language:**"));
note(!/draw steel heroes/i.test(section), "and never cites Draw Steel Heroes, which B92 would strip");

// The chrome the prose promises has to actually write the field Draw Steel reads.
for (const [file, squares] of [["reaction-enhancer", 1], ["wired-reflexes", 2]]) {
  const row = readJson(`src/packs/chrome/${file}.json`);
  const change = (row.effects ?? []).flatMap(e => e.system?.changes ?? [])
    .find(c => c.key === "system.movement.disengage");
  note(change?.value === squares, `${file} writes +${squares} to system.movement.disengage`);
}

const combatPage = readJson("src/packs/rulebook/shared-core/04-combat.json")
  .pages.find(p => p.name === "Rounds, turns, and actions");
note(/Move actions — Move vs Disengage/.test(combatPage?.text?.markdown ?? ""), "the journal page carries it too");
note(/<h3>Move actions — Move vs Disengage<\/h3>/.test(combatPage?.text?.content ?? ""), "and its rendered HTML");

const index = readJson("data/voidmark-rules-index.json");
const disengageHits = retrieve(index, "What are the disengage rules?");
note(disengageHits.some(h => h.file.includes("04-combat") && /opportunity pressure/i.test(h.text)),
  "VOIDMARK retrieves the combat chunk instead of the empty-channel reply");
note(disengageHits[0]?.heading === "Move actions — Move vs Disengage", "and it is the top hit");

/* ------------------------------------------------------------------ B: medical kits */

console.log("\nB) Field Surgery Kit and Slap-Doc Kit do something when you click them");

const fieldSurgery = readJson("src/packs/gear/general/medical/field-surgery-kit.json");
const slapDoc = readJson("src/packs/gear/general/medical/slap-doc-kit.json");

note(isConsumableTreasure(fieldSurgery) && isConsumableTreasure(slapDoc), "both kits spawn a use ability");
for (const [name, item] of [["Field Surgery Kit", fieldSurgery], ["Slap-Doc Kit", slapDoc]]) {
  note(useBlock(item).action === "maneuver", `${name} is a maneuver`);
  note(useTargetKind(useBlock(item)) === "selfOrAlly", `${name} targets self or one ally`);
}

// B1 — reusable stabilize.
const fsUse = useBlock(fieldSurgery);
note(fsUse.spend === false && fsUse.stabilize === true, "Field Surgery Kit stabilizes and is not spent");
note(planStabilize({ staminaValue: 0 }).staminaValue === 1, "a target at 0 Stamina stabilizes to 1");
note(planStabilize({ staminaValue: -6 }).ok, "and so does one below 0 — negative Stamina is still dying");
note(planStabilize({ staminaValue: 1 }).reason === "notDying", "a target at 1 Stamina is refused");
{
  const dying = planConsumableUse({ quantity: 1, staminaValue: 0, staminaMax: 24, use: fsUse });
  const alive = planConsumableUse({ quantity: 1, staminaValue: 9, staminaMax: 24, use: fsUse });
  note(dying.ok && dying.staminaValue === 1 && dying.stabilized, "using it on a dying ally sets Stamina to 1");
  note(dying.quantityAfter === 1 && dying.deleteItem === false, "and does not consume the kit");
  note(!alive.ok && alive.reason === "notDying", "using it on somebody upright refuses");
  note(alive.quantityAfter === 1, "and costs nothing when it refuses");
}
// The edge is a transferred ActiveEffect, not use automation — check it is shaped like every other
// Ghostwire skill-edge grant (chrome, mods, traits all use `system.changes` + `upgrade`).
{
  const effect = (fieldSurgery.effects ?? [])[0];
  note(effect?.transfer === true, "the First-Aid edge transfers with the item in inventory");
  const keys = (effect?.system?.changes ?? []).map(c => `${c.key}=${c.value}/${c.type}`);
  note(keys.includes("system.skills.modifiers.medicine.edges=1/upgrade"), "edge on Medicine");
  note(keys.includes("system.skills.modifiers.medicineLore.edges=1/upgrade"), "edge on Medicine Lore");
  note(/^[A-Za-z0-9]{16}$/.test(effect?._id ?? ""), "and its effect id is a legal 16-character id");
}

// B2 — consumable, two Recoveries, one condition.
const sdUse = useBlock(slapDoc);
note(sdUse.spend === true && sdUse.recoveries === 2, "Slap-Doc Kit spends a unit and gives 2 Recoveries");
note(sdUse.clearCondition === true && sdUse.deleteAtZero === true, "clears a condition and deletes at zero");
note(gearFlags(slapDoc).consumable === true, "and is still flagged Consumable on the gear row");
{
  const spent = planConsumableUse({ quantity: 1, recoveriesValue: 4, recoveriesMax: 8, use: sdUse });
  const full = planConsumableUse({ quantity: 1, recoveriesValue: 8, recoveriesMax: 8, use: sdUse });
  const nearCap = planConsumableUse({ quantity: 1, recoveriesValue: 7, recoveriesMax: 8, use: sdUse });
  note(spent.recoveriesGranted === 2 && spent.recoveriesValue === 6, "4 of 8 spent → 2 back");
  note(nearCap.recoveriesGranted === 1, "7 of 8 → 1 back, never past the maximum");
  note(full.ok && full.recoveriesGranted === 0 && full.clearCondition, "nothing spent → 0 back, picker still offered");
  note(spent.deleteItem === true, "and the empty canister deletes itself");
}
note(PHYSICAL_CONDITIONS.length === 6, "six physical conditions are clearable");
{
  const present = clearableConditions(new Set(["bleeding", "prone", "taunted", "grabbed", "frightened", "ghostwire-invisible"]));
  note(present.join(",") === "bleeding,prone", "the picker offers only the physical ones actually present");
  note(clearableConditions(new Set()).length === 0, "and offers nothing on an unafflicted target");
}
// The chems must not have picked up the new behaviour by accident.
{
  const trauma = readJson("src/packs/gear/general/medical/trauma-patch.json");
  const plan = planConsumableUse({ quantity: 1, recoveriesValue: 2, recoveriesMax: 8, use: useBlock(trauma) });
  note(useTargetKind(useBlock(trauma)) === "self", "the Trauma Patch is still a dose you take yourself");
  note(plan.deleteItem === false, "and an empty patch still stays in inventory");
}

for (const key of ["Effects", "UsedOn", "NotDying", "TooManyTargets", "ClearCondition", "AbilityDescriptionAlly"]) {
  note(lang.ConsumableUse[key] !== undefined, `GHOSTWIRE.ConsumableUse.${key} exists`);
}

/* ------------------------------------------------------------------ C: hotfixes */

console.log("\nC) The four table reports");

// C1 — the bug was a 15-character pseudo-document id, so assert the class of bug, not the instance.
{
  const bad = [];
  (function walk(dir) {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) { walk(p); continue; }
      if (!e.name.endsWith(".json")) continue;
      let json;
      try { json = JSON.parse(readFileSync(p, "utf8")); } catch { continue; }
      (function scan(node, path) {
        if (Array.isArray(node)) { node.forEach((v, i) => scan(v, `${path}[${i}]`)); return; }
        if (!node || typeof node !== "object") return;
        if ((typeof node._id === "string") && !/^[A-Za-z0-9]{16}$/.test(node._id)) {
          bad.push(`${p.replaceAll("\\", "/")}${path} _id="${node._id}" (${node._id.length})`);
        }
        for (const [k, v] of Object.entries(node)) scan(v, `${path}.${k}`);
      })(json, "");
    }
  })("src/packs");
  note(bad.length === 0, `every _id in src/packs is a legal 16-character id${bad.length ? ` — ${bad.slice(0, 3).join(" | ")}` : ""}`);
}
{
  const conceal = readJson("src/packs/classes/scout/abilities/conceal.json");
  const tiers = Object.values(conceal.system.power.effects)[0];
  note(tiers?.type === "other", "Conceal still carries its tier block");
  note(conceal.system.power.roll.characteristics.join() === "agility",
    "and rolls 2d10 + agility — the key behind the Reflex label");
  note((conceal.effects ?? []).length === 2, "its two applicable effects are intact");
  const wren = readJson("src/packs/pregens/wren-sable-corvin.json");
  const embedded = wren.items.find(i => i.system?._dsid === "scout-conceal");
  note(Object.keys(embedded?.system?.power?.effects ?? {}).every(k => /^[A-Za-z0-9]{16}$/.test(k)),
    "and Wren's embedded copy was regenerated with it");
}

// C2
note(beastTokenSize("raven") === 0.5, "Raven Beast form is half a square");
note(beastTokenSize("rat") === 0.5, "Rat still is too");
note(beastTokenSize("wolf") === null, "and Wolf deliberately still is not");

// C3
{
  const kade = readJson("src/packs/pregens/kade-orrin-vex.json");
  const gear = kade.items.filter(i => i.type === "treasure" && i.flags?.[MODULE_ID]?.gear);
  const over = gear.filter(i => Number(i.flags[MODULE_ID].gear.echelon) > 1)
    .map(i => `${i.system._dsid}@E${i.flags[MODULE_ID].gear.echelon}`);
  note(over.length === 0, `Kade carries nothing above Echelon 1${over.length ? ` — ${over.join(", ")}` : ""}`);
  const dsids = new Set(gear.map(i => i.system._dsid));
  for (const want of ["security-rig", "riot-shield", "shock-stick", "hand-cannon"]) {
    note(dsids.has(want), `Kade carries ${want}`);
  }
  note(!dsids.has("milspec-battle-rifle"), "and no longer the two-handed rifle his shield rules out");
  const classes = gear.map(i => i.flags[MODULE_ID].gear.armorClass).filter(Boolean);
  note(classes.includes("heavy") && classes.includes("shield"), "heavy armor plus a shield — the Warframe category");
  // The chrome half of his sheet is explicitly not this lock's business.
  const chrome = kade.items.filter(i => i.flags?.[MODULE_ID]?.chrome);
  note(chrome.length === 7, "all seven chrome installs are untouched");
}

// C4
{
  const warframe = readJson("src/packs/kits/heavy/warframe-signature-ability.json");
  note(warframe.system._dsid === "frame-lock", "the Warframe signature is frame-lock");
  note(lang.Kits.Warframe.Signature.Name === "Frame Lock", "and reads Frame Lock on the card");
  note(/\{Frame Lock\}/.test(lang.Kits.Warframe.Description), "the kit description links to it by the new name");
  const operator = readJson("src/packs/classes/operator/abilities/hold-the-line.json");
  note(operator.system._dsid === "hold-the-line", "the Operator heroic keeps hold-the-line");
  note(operator.system.category === "heroic" && Number(operator.system.resource) === 2,
    "still freeTriggered at 2 Adrenaline");
  // Nothing in the kits or classes packs may claim that _dsid a second time.
  const claims = [];
  for (const dir of ["src/packs/kits", "src/packs/classes"]) {
    (function walk(d) {
      for (const e of readdirSync(d, { withFileTypes: true })) {
        const p = join(d, e.name);
        if (e.isDirectory()) { walk(p); continue; }
        if (!e.name.endsWith(".json") || e.name === "_folder.json") continue;
        let j;
        try { j = JSON.parse(readFileSync(p, "utf8")); } catch { continue; }
        if (j?.system?._dsid === "hold-the-line") claims.push(p.replaceAll("\\", "/"));
      }
    })(dir);
  }
  note(claims.length === 1, `exactly one row claims hold-the-line — ${claims.join(", ")}`);
  const kade = readJson("src/packs/pregens/kade-orrin-vex.json");
  note(kade.items.some(i => i.system?._dsid === "frame-lock"), "and Kade's embedded signature followed the rename");
}

/* ------------------------------------------------------------------ E: Medic Reagents */

console.log("\nE) Reagents are a bag, not a battery");

// E1 — capacity, and the cap on every grant.
note(KIT_CAPACITY_BY_ECHELON.join(",") === "10,14,20,38", "kit capacity is 10 / 14 / 20 / 38 by echelon");
note(ADVANCED_CHEM_PREP_BONUS === 2, "Advanced Chem-Prep adds 2");
note([1, 3, 4, 6, 7, 9, 10].map(echelonForLevel).join(",") === "1,1,2,2,3,3,4",
  "echelon follows Draw Steel's own level thresholds");
note(reagentCapacity({ echelon: 3, advancedChemPrep: true }) === 22, "Echelon 3 with Chem-Prep is 22");
note(reagentCapacity({ echelon: 4, advancedChemPrep: true }) === 40, "Echelon 4 with Chem-Prep is 40");
{
  const chemPrep = lang.Classes.Medic.Items.AdvancedChemPrep.Description;
  note(/Echelon 1: 12, Echelon 2: 16, Echelon 3: 22, Echelon 4: 40/.test(chemPrep),
    "and the printed card agrees with the table");
}
note(clampReagents({ value: 30, capacity: 10 }) === 10, "a 30-Reagent write at Echelon 1 clamps to 10");
note(clampReagents({ value: 7, capacity: 10 }) === null, "a legal write is left alone entirely");
note(clampReagents({ value: 0, capacity: 10 }) === null, "and so is an empty bag");
note(planReagentGrant({ current: 9, capacity: 10, grant: 2 }).granted === 1, "a grant that would overflow is trimmed");
note(planReagentGrant({ current: 9, capacity: 10, grant: 2 }).capped === true, "and says it was capped");

// The persistent-resource patch is what stops the drip; assert it still names the Medic.
{
  const moduleSrc = read("scripts/module.mjs");
  note(/PERSISTENT_RESOURCE_CLASSES = new Set\(\["medic"\]\)/.test(moduleSrc), "Medics are still a persistent-resource class");
  note(/registerReagents\(\);/.test(moduleSrc), "and registerReagents is wired into init");
  const medicClass = readJson("src/packs/classes/medic/medic.json");
  note(medicClass.system.turnGain === "0", "the Medic class gains 0 per turn");
}

// E2 — Craft Reagents.
{
  const feature = readJson("src/packs/classes/medic/craft-reagents.json");
  note(feature.type === "feature" && feature.system._dsid === CRAFT_REAGENTS_DSID, "Craft Reagents is a Medic feature");
  note(/^[A-Za-z0-9]{16}$/.test(feature._id), "with a legal id");
  const medicClass = readJson("src/packs/classes/medic/medic.json");
  const l1 = Object.values(medicClass.system.advancements)
    .find(a => a.name === "Features" && a.requirements?.level === 1);
  note((l1?.pool ?? []).some(p => p.uuid.endsWith(feature._id)), "granted to every Medic at 1st level");
  note(CRAFT_REAGENTS_GOAL === 30, "the project goal is 30");
  note(planCraftRestock({ current: 4, capacity: 12, points: 30 }).granted === 8, "completing it fills 4 of 12 to 12");
  note(planCraftRestock({ current: 4, capacity: 12, points: 29 }).complete === false, "29 points is not complete");
  note(planCraftRestock({ current: 12, capacity: 12, points: 30 }).granted === 0, "a full bag completes and grants 0");
  const items = lang.Classes.Medic.Items.CraftReagents;
  for (const key of ["Name", "Description", "ProjectName", "ProjectDescription", "Yield"]) {
    note(items?.[key] !== undefined, `GHOSTWIRE.Classes.Medic.Items.CraftReagents.${key} exists`);
  }
  const renn = readJson("src/packs/pregens/renn-solace-ward.json");
  note(renn.items.some(i => i.system?._dsid === CRAFT_REAGENTS_DSID), "and Renn walks in with it");
  const medicRaw = read("docs/raw/15-medic.md");
  note(/\*\*Craft Reagents — the restock Project\.\*\*/.test(medicRaw), "15-medic documents the restock project");
  note(/- \*\*Craft Reagents\*\* \(1st\)/.test(medicRaw), "and lists it under Core Class Features");
  const page = readJson("src/packs/rulebook/classes/15-medic.json")
    .pages.find(p => p.name.startsWith("Reagents"));
  note(/Craft Reagents/.test(page?.text?.content ?? ""), "the medic journal page carries it");
}

// E3 — every printed heroic cost is on its row, so Draw Steel debits it.
{
  const dir = "src/packs/classes/medic/abilities";
  const rows = readdirSync(dir).filter(f => f.endsWith(".json") && f !== "_folder.json")
    .map(f => readJson(join(dir, f)));
  const heroics = rows.filter(r => r.system.category === "heroic");
  const bands = new Set([1, 3, 5, 7, 9, 11]);
  const offBand = heroics.filter(r => !bands.has(Number(r.system.resource))).map(r => r.system._dsid);
  note(heroics.length >= 20, `${heroics.length} Medic heroics`);
  note(offBand.length === 0, `every heroic costs a printed band${offBand.length ? ` — ${offBand.join(", ")}` : ""}`);
  const purge = rows.find(r => r.system._dsid === "full-kit-purge");
  note(Number(purge.system.resource) === 11, "Full Kit Purge costs its minimum 11");
  note(Object.values(purge.system.effects).some(e => e.type === "spend" && e.resource?.multiple),
    "and can pour the rest of the bag in on top");

  // E4 — signatures are free at the base and 2+ on the enhance.
  const signatures = rows.filter(r => r.system.category === "signature");
  note(signatures.length === 3, "three Medic signatures");
  for (const sig of signatures) {
    note(sig.system.resource === null, `${sig.system._dsid} costs nothing to use`);
    const spend = Object.values(sig.system.effects).find(e => e.type === "spend");
    note(spend?.resource?.value === 2 && spend?.resource?.multiple === true,
      `${sig.system._dsid} enhances for 2+ Reagents`);
  }
  const synthesis = rows.find(r => r.system._dsid === "field-synthesis");
  note(Number(synthesis.system.resource) === 0, "Field Synthesis is 0 Reagents");
  note(/Once per encounter \(Street-Doc: twice\)/.test(lang.Classes.Medic.Items.FieldSynthesis.Effect_before0000000000),
    "and prints its once-per-encounter limit, twice for a Street-Doc");
  note(!/Reagent/.test(lang.Classes.Medic.Items.EstablishedProtocols.Description.replace(/no Reagent cost/, "")),
    "Established Protocols stays free of any Reagent cost");
}

// E5 — Improvise!
{
  const improvise = readJson("src/packs/classes/medic/origins/street-doc/improvise.json");
  note(improvise.system._dsid === "improvise", "Improvise! is on the Street-Doc");
  note(Number(improvise.system.resource ?? 0) === 0, "and costs nothing to trigger");
  note(IMPROVISE_THRESHOLD === 3, "it triggers at 3 Reagents or fewer");
  note(planImprovise({ current: 3, capacity: 10 }).granted === 2, "at 3 of 10 it hands back 2");
  // The trigger and the cap can only collide on a small bag: 3 of 4 is low enough to fire and
  // close enough to the ceiling that only one of the two Reagents fits.
  note(planImprovise({ current: 3, capacity: 4 }).granted === 1, "at 3 of 4 it hands back 1, not 2");
  note(planImprovise({ current: 3, capacity: 4 }).capped === true, "and says the ceiling trimmed it");
  note(planImprovise({ current: 4, capacity: 10 }).reason === "notLowEnough", "at 4 it does not trigger at all");
  note(planImprovise({ current: 1, capacity: 10, usedThisEncounter: true }).reason === "usedThisEncounter",
    "and only once per encounter");
  const reagents = lang.Classes.Medic.Reagents;
  for (const key of ["Capped", "Improvise", "Chat"]) note(reagents?.[key] !== undefined, `GHOSTWIRE.Classes.Medic.Reagents.${key} exists`);
}

/* ------------------------------------------------------------------ shipping */

console.log("\nShipping");
const version = readJson("module.json").version;
note(atLeast(version, "0.3.125"), `module.json is ${version}`);
note(read("README.md").includes("`0.3.125`"), "README has a 0.3.125 entry");
{
  const path = "docs/directors/03125-smoke.md";
  let size = 0;
  try { size = statSync(path).size; } catch { /* reported below */ }
  note(size > 800, "the director smoke checklist exists");
}

/* ------------------------------------------------------------------ report */

for (const line of ok) console.log(line);
if (fail.length) {
  console.error(`\n${fail.length} failed:`);
  for (const line of fail) console.error(`  ✗ ${line}`);
  process.exit(1);
}
console.log(`\n${ok.length} checks passed.`);
