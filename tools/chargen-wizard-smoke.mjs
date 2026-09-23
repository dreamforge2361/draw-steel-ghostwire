#!/usr/bin/env node
/**
 * B95 / I2 smoke: the Chargen Wizard's structure, step ladder, characteristic array, lang coverage,
 * wealth path and — the load-bearing one — the "no chrome, no mods at chargen" spend firewall.
 *
 * Run: node tools/chargen-wizard-smoke.mjs
 * Reads only. Does not write pack JSON, rebuild packs, or touch a world.
 */
import {
  readFileSync,
  readdirSync,
  statSync,
  existsSync } from "node:fs";
import { join } from "node:path";
import { atLeast } from "./lib/module-version.mjs";
import { WEALTH_PATH } from "../scripts/kiosk.mjs";
import { KIT_STREET_GRANTS } from "../scripts/kit-grants.mjs";
import {
  ACK_STEPS,
  AVAILABILITY_BANDS,
  CHARACTERISTIC_ARRAY,
  CHARACTERISTIC_KEYS,
  CHARACTERISTIC_LABELS,
  CHARGEN_FORBIDDEN_PACKS,
  CHARGEN_PICKS,
  CHARGEN_SPEND_PACKS,
  CHARGEN_STEPS,
  CYBORG_BLOCKED_CLASSES,
  INTEGRITY_START,
  CYBORG_INTEGRITY_START,
  integrityStartFor,
  OPTIONAL_STEPS,
  STARTING_NUYEN,
  arrayOptionsFor,
  autoAssignArray,
  characteristicsAssigned,
  chargenComplete,
  doneChecklist,
  isChargenSpendable,
  spendCategoryOf,
  chromeIntegrityCost,
  skillPickBudget,
  languagePickBudget,
  SPEND_CATEGORIES,
  isPlaceholderName,
  nextStep,
  normalizeChargenState,
  planChargenSpend,
  prevStep,
  remainingPool,
  rerunGate,
  stepIndex,
  stepStatus,
  voidmarkSeed
} from "../scripts/chargen-wizard.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const SCRIPT = "scripts/chargen-wizard.mjs";
const TEMPLATE = "templates/chargen-wizard.hbs";

const failures = [];
const ok = (cond, msg) => {
  if (!cond) failures.push(msg);
  else console.log(`  ✓ ${msg}`);
};

const read = path => readFileSync(path, "utf8");
const moduleJson = JSON.parse(read("module.json"));
const lang = JSON.parse(read("lang/en.json"));
const scriptSrc = read(SCRIPT);
const templateSrc = read(TEMPLATE);
const moduleSrc = read("scripts/module.mjs");
const cssSrc = read("styles/ghostwire.css");

const localize = key => key.split(".").reduce((node, part) => node?.[part], lang);

console.log("B95 Chargen Wizard smoke\n");

/* -------------------------------------------- 1) it ships */

console.log("1) the module ships the wizard at 0.3.103");
ok(atLeast(moduleJson.version, "0.3.103"), `module.json is at least 0.3.103 (${moduleJson.version})`);
ok(existsSync(SCRIPT), `${SCRIPT} exists`);
ok(existsSync(TEMPLATE), `${TEMPLATE} exists`);
ok(moduleSrc.includes('import { registerChargenWizard } from "./chargen-wizard.mjs";'),
  "scripts/module.mjs imports registerChargenWizard");
ok(/^\s*registerChargenWizard\(\);/m.test(moduleSrc), "scripts/module.mjs calls registerChargenWizard() at init");
ok(cssSrc.includes(".ghostwire-chargen "), "styles/ghostwire.css carries the applet block");
ok(cssSrc.includes(".ghostwire-chargen-launch"), "styles/ghostwire.css carries the hero-sheet launcher");
ok(scriptSrc.includes("templates/chargen-wizard.hbs"), "the app PART points at the shipped template");

/* -------------------------------------------- 2) the doors */

console.log("\n2) both doors are open — hero sheet header, and the API");
ok(/Hooks\.on\("renderDrawSteelHeroSheet", injectChargenButton\)/.test(scriptSrc),
  "a hero sheet render hook injects the launcher");
ok(scriptSrc.includes('root.querySelector("[data-application-part=\'header\']")'),
  "the launcher lands in the sheet header, not the tab strip");
ok(/game\.ghostwire = \{ \.\.\.\(game\.ghostwire \?\? \{\}\), openChargenWizard \}/.test(scriptSrc),
  "game.ghostwire.openChargenWizard is exposed");
ok(scriptSrc.includes("openChargenWizard,") && scriptSrc.includes("chargen: {"),
  "module.api carries openChargenWizard and the chargen surface");
ok(/isHeroActor = actor => actor\?\.type === "hero"/.test(scriptSrc), "only `hero` actors open the wizard");
ok(/canOpenChargen = \(actor, user = game\.user\) =>[\s\S]{0,140}user\?\.isGM \|\| !!actor\?\.isOwner/.test(scriptSrc),
  "the gate is Actor ownership or GM — players may run it too");

const macroSrc = "src/packs/macros/chargen-wizard.json";
ok(existsSync(macroSrc), "the optional Ghostwire macro source exists");
if (existsSync(macroSrc)) {
  const macro = JSON.parse(read(macroSrc));
  ok(macro.command.includes("openChargenWizard"), "the macro calls module.api.openChargenWizard");
  ok(typeof localize(macro.name) === "string", `the macro name resolves (${macro.name})`);
}

/* -------------------------------------------- 3) the step ladder */

console.log("\n3) the FULL step order Michael locked (2026-09-22)");
const EXPECTED_STEPS = [
  "bio", "name", "people", "background", "class", "kit",
  "skills", "characteristics", "languages", "resources", "integrity", "spends", "done",
];
ok(CHARGEN_STEPS.join(",") === EXPECTED_STEPS.join(","), `the ladder is ${EXPECTED_STEPS.join(" → ")}`);
ok(CHARGEN_STEPS[0] === "bio", "biography brainstorm is step 1, before anything else");
ok(CHARGEN_STEPS[1] === "name", "the hero name is step 2, after the concept");
ok(stepIndex("people") > stepIndex("name"), "the Appendix B spine starts after the name");
ok(stepIndex("spends") > stepIndex("integrity"), "optional ¥ spends come after the Body Integrity check");
ok(CHARGEN_STEPS.at(-1) === "done", "Done is last");
ok(nextStep("bio") === "name" && prevStep("name") === "bio", "next/prev walk the ladder");
ok(nextStep("done") === "done" && prevStep("bio") === "bio", "the ladder does not run off either end");
ok(nextStep("nonsense") === "bio", "an unknown step falls back to the first");
ok(OPTIONAL_STEPS.every(key => CHARGEN_STEPS.includes(key)), "every optional step is on the ladder");
ok(ACK_STEPS.every(key => CHARGEN_STEPS.includes(key)), "every confirm-only step is on the ladder");
ok(normalizeChargenState({ step: "not-a-step" }).step === "bio", "a stored junk step normalizes to the first");
ok(normalizeChargenState({ acked: ["kit", "kit", "junk"] }).acked.join(",") === "kit",
  "stored acknowledgements dedupe and drop junk");
ok(normalizeChargenState({ spent: -40 }).spent === 0, "a negative spend total clamps to 0");

for (const key of CHARGEN_STEPS) {
  ok(typeof localize(`GHOSTWIRE.Chargen.Steps.${key}.Name`) === "string", `step "${key}" has a name`);
  ok(typeof localize(`GHOSTWIRE.Chargen.Steps.${key}.Hint`) === "string", `step "${key}" has a hint`);
}

/* -------------------------------------------- 4) the picks resolve to real packs */

console.log("\n4) every spine pick names a real pack and a real Item type");
const packNames = new Set(moduleJson.packs.map(pack => pack.name));
const srcTypes = dir => {
  const types = new Set();
  const walk = path => {
    for (const entry of readdirSync(path)) {
      const child = join(path, entry);
      if (statSync(child).isDirectory()) { walk(child); continue; }
      if (!entry.endsWith(".json") || entry.startsWith("_")) continue;
      const json = JSON.parse(read(child));
      if (String(json._key ?? "").startsWith("!items!")) types.add(json.type);
    }
  };
  walk(dir);
  return types;
};
for (const [step, pick] of Object.entries(CHARGEN_PICKS)) {
  ok(packNames.has(pick.pack), `${step} → the "${pick.pack}" pack is declared in module.json`);
  const dir = join("src/packs", pick.pack);
  ok(existsSync(dir), `${step} → src/packs/${pick.pack} exists`);
  if (existsSync(dir)) ok(srcTypes(dir).has(pick.type), `${step} → the pack really holds "${pick.type}" Items`);
}
ok(CHARGEN_PICKS.people.type === "ancestry", "People reads the ancestry type (sheet remap Ancestry→People)");
ok(CHARGEN_PICKS.background.type === "culture", "Background reads the culture type (Culture→Background)");
ok(CHARGEN_PICKS.profession.type === "career", "Profession reads the career type (Career→Profession)");

/* -------------------------------------------- 5) the wizard drives the stock dialogs */

console.log("\n5) picks drive the stock advancement path, never a private one");
ok(scriptSrc.includes("actor.system.advance({ levels: 1, item: source })"),
  "a class pick goes through the system's own advance()");
ok(scriptSrc.includes("source.system.applyAdvancements({ actor, levels: { end: actor.system.level } })"),
  "an advancement-bearing pick goes through the system's own applyAdvancements()");
ok(scriptSrc.includes("advancementDeletionPrompt({ replacement: true })"),
  "replacing People / Background / Profession uses the system's replacement prompt");
ok(scriptSrc.includes("game.items.fromCompendium(source"), "plain Items are copied out of the compendium, not fabricated");
ok(!/grantKitStreetPackage|KIT_STREET_GRANTS\s*\[/.test(scriptSrc),
  "the wizard never grants Kit street gear itself — G1's createItem hook owns that");
ok(scriptSrc.includes('import { packageDsids } from "./kit-grants.mjs"'),
  "it reads G1's table only to say whether a Kit wants gear");
ok(Object.keys(KIT_STREET_GRANTS).length > 0, "G1's Kit table is still importable (the needs-gear read)");
ok(typeof localize("GHOSTWIRE.Chargen.PromptHandoff") === "string",
  "there is copy for the “finish the sheet prompt, then Re-check” hand-off");

/* -------------------------------------------- 6) characteristics: 2, 2, 1, 1, 0 */

console.log("\n6) characteristics are the printed 2, 2, 1, 1, 0 and nothing else");
ok(CHARACTERISTIC_ARRAY.join(",") === "2,2,1,1,0", "the array is 2, 2, 1, 1, 0");
ok(CHARACTERISTIC_KEYS.join(",") === "might,agility,reason,intuition,presence",
  "the five Draw Steel characteristic keys are covered");
ok(Object.values(CHARACTERISTIC_LABELS).join(",") === "Physique,Reflex,Logic,Instinct,Persona",
  "the labels a player reads are Physique / Reflex / Logic / Instinct / Persona");
for (const label of Object.values(CHARACTERISTIC_LABELS)) {
  ok(typeof localize(`GHOSTWIRE.Chargen.Characteristics.${label}`) === "string", `"${label}" has a lang key`);
}

const spread = (might, agility, reason, intuition, presence) => ({ might, agility, reason, intuition, presence });
ok(characteristicsAssigned(spread(2, 2, 1, 1, 0)), "2/2/1/1/0 in printed order is legal");
ok(characteristicsAssigned(spread(0, 1, 2, 1, 2)), "the same multiset in any order is legal");
ok(!characteristicsAssigned(spread(2, 2, 2, 1, 0)), "a third 2 is refused");
ok(!characteristicsAssigned(spread(2, 2, 1, 1, 1)), "swapping the 0 for a 1 is refused");
ok(!characteristicsAssigned(spread(2, 2, 1, 1, null)), "an unassigned characteristic is not done");
ok(!characteristicsAssigned({}), "an empty sheet is not done");
ok(remainingPool(spread(2, null, null, null, null)).join(",") === "2,1,1,0", "one 2 spent leaves 2, 1, 1, 0");
ok(remainingPool(spread(2, 2, 1, 1, 0)).length === 0, "a finished spread leaves nothing in the pool");
ok(arrayOptionsFor("reason", spread(2, 2, null, null, null)).join(",") === "1,1,0".replace("1,1", "1"),
  "a half-spent pool offers only what is left (deduped)");
ok(arrayOptionsFor("might", spread(2, 2, 1, 1, 0)).join(",") === "2",
  "a placed characteristic can always be re-picked as itself");

const auto = autoAssignArray(["might", "agility"]);
ok(characteristicsAssigned(auto), "the class-core auto-spread is itself a legal 2, 2, 1, 1, 0");
ok((auto.might === 2) && (auto.agility === 2), "the two 2s land on the class cores");
ok(JSON.stringify(auto) === JSON.stringify(autoAssignArray(["might", "agility"])), "the auto-spread is deterministic");
ok(characteristicsAssigned(autoAssignArray([])), "with no cores the auto-spread is still a legal array");
ok(characteristicsAssigned(autoAssignArray(["reason", "intuition", "presence"])),
  "a class naming three cores still yields a legal array (only two 2s exist)");

/* -------------------------------------------- 7) the ¥ firewall */

console.log("\n7) the ¥ firewall: one wealth path, no chrome, no mods");
ok(STARTING_NUYEN === 5000, "a runner starts on ¥5,000");
ok(INTEGRITY_START === 20, "living Peoples start on Body Integrity 20");
ok(CYBORG_INTEGRITY_START === 25, "Cyborgs start on Body Integrity 25");
ok(integrityStartFor({ isCyborg: false }) === 20 && integrityStartFor({ isCyborg: true }) === 25,
  "integrityStartFor switches living 20 / Cyborg 25");
const moduleStart = /const STARTING_NUYEN = (\d+);/.exec(moduleSrc)?.[1];
const moduleIntegrity = /const INTEGRITY_START = (\d+);/.exec(moduleSrc)?.[1];
const moduleCyborgIntegrity = /const CYBORG_INTEGRITY_START = (\d+);/.exec(moduleSrc)?.[1];
ok(Number(moduleStart) === STARTING_NUYEN, `module.mjs agrees on ¥${moduleStart}`);
ok(Number(moduleIntegrity) === INTEGRITY_START, `module.mjs agrees on Integrity ${moduleIntegrity}`);
ok(Number(moduleCyborgIntegrity) === CYBORG_INTEGRITY_START, `module.mjs agrees on Cyborg Integrity ${moduleCyborgIntegrity}`);
ok(!/format\("CyborgBlocked"\)/.test(moduleSrc),
  "module.mjs no longer warns CyborgBlocked on chrome install");
ok(/isCyborg\(actor\) \? "GHOSTWIRE\.Integrity\.CyborgHint"/.test(moduleSrc),
  "hero sheet Integrity tooltip uses CyborgHint for Cyborgs");
ok(!/localize\("GHOSTWIRE\.Integrity\.CyborgNA"\)/.test(moduleSrc),
  "hero sheet no longer renders Integrity as CyborgNA / Not used");
ok(WEALTH_PATH === "system.hero.wealth", `the kiosk wealth path is ${WEALTH_PATH}`);
ok(scriptSrc.includes('import { WEALTH_PATH, catalogPrice, formatYen, getWealth, planPurchase } from "./kiosk.mjs"'),
  "the wizard debits ¥ through the kiosk's path and plan, not its own arithmetic");
ok(!/system\.hero\.wealth/.test(scriptSrc.replace(/WEALTH_PATH/g, "")),
  "the wealth path is never re-typed as a string literal");
ok(scriptSrc.includes("[WEALTH_PATH]: plan.wealthAfter"), "a purchase writes the planned remainder to that path");

const plan = planChargenSpend({ wealth: 5000, price: 300 });
ok(plan.ok && (plan.wealthAfter === 4700), "¥5,000 less ¥300 leaves ¥4,700");
ok(!planChargenSpend({ wealth: 100, price: 300 }).ok, "an unaffordable row is refused");

ok(CHARGEN_SPEND_PACKS.join(",") === "gear,matrix,foci,vehicles,chrome",
  "G10: the spend catalog reads gear, matrix, foci, vehicles, and chrome");
ok(!CHARGEN_FORBIDDEN_PACKS.includes("chrome"), "G10: chrome pack is no longer forbidden");
ok(CHARGEN_FORBIDDEN_PACKS.includes("mods"), "the mods pack is named as forbidden");
for (const pack of CHARGEN_FORBIDDEN_PACKS) {
  ok(!CHARGEN_SPEND_PACKS.includes(pack), `"${pack}" is not in the spend catalog`);
  ok(!isChargenSpendable({ pack, price: 100 }), `a priced "${pack}" row is still refused`);
}
ok(isChargenSpendable({ pack: "gear", price: 300 }), "a priced Street gear row is spendable");
ok(isChargenSpendable({ pack: "chrome", price: 300, chrome: { integrity: 2 } }),
  "G10: a chrome pack row with Integrity cost is spendable");
ok(!isChargenSpendable({ pack: "gear", price: null }), "an unpriced row is refused — the wizard never guesses at ¥");
ok(!isChargenSpendable({ pack: "gear", price: 0 }), "a ¥0 row is refused");
ok(!isChargenSpendable({ pack: "bestiary", price: 100 }), "a pack nobody listed is refused");
ok(!isChargenSpendable({}), "an empty row is refused");

// Second lock: the four allowed packs must not *contain* a chrome-flagged Item in the first place.
console.log("\n   └ no chrome hides inside an allowed pack");
let chromeFlagged = 0;
let priced = 0;
for (const pack of CHARGEN_SPEND_PACKS) {
  const dir = join("src/packs", pack);
  if (!existsSync(dir)) continue;
  const walk = path => {
    for (const entry of readdirSync(path)) {
      const child = join(path, entry);
      if (statSync(child).isDirectory()) { walk(child); continue; }
      if (!entry.endsWith(".json") || entry.startsWith("_")) continue;
      const json = JSON.parse(read(child));
      if (!String(json._key ?? "").startsWith("!items!")) continue;
      const flags = json.flags?.[MODULE_ID] ?? {};
      if (flags.chrome) chromeFlagged += 1;
      if (["gear", "matrix", "vehicle", "focus"].some(key => Number.isFinite(Number(flags[key]?.price)))) priced += 1;
    }
  };
  walk(dir);
}
ok(chromeFlagged > 0, `G10: chrome Items are reachable from spendable packs (found ${chromeFlagged})`);
ok(priced > 100, `the spendable packs carry real ¥ (${priced} priced rows)`);

console.log("\n   └ the wizard cannot install chrome or spend Body Integrity");
ok(!/flags\.\$\{MODULE_ID\}\.integrity|"flags\.draw-steel-ghostwire\.integrity"/.test(scriptSrc),
  "the wizard never writes the Body Integrity flag");
ok(!/grantChromeItems|setIntegrity/.test(scriptSrc), "the wizard never calls the chrome install path");
ok(/IntegrityConfirm/.test(scriptSrc),
  "G10: buyChargenItem confirms Integrity cost before creating chrome");
ok(!/"\$\{MODULE_ID\}\.chrome"|\.chrome`|packs\.get\(`\$\{MODULE_ID\}\.chrome/.test(scriptSrc),
  "the wizard never opens the chrome compendium");
ok(typeof localize("GHOSTWIRE.Chargen.Spends.ChromeOkModsNo") === "string",
  "G10: the spends step says Programs+Chrome are sold, mods are not");
ok(typeof localize("GHOSTWIRE.Chargen.Spends.NoLifestyle") === "string",
  "the spends step says Lifestyle is not pre-paid");
ok(AVAILABILITY_BANDS.join(",") === "street,professional,restricted,military,prototype",
  "the Availability ladder is street → prototype");
ok(AVAILABILITY_BANDS.every(band => typeof localize(`GHOSTWIRE.Chargen.Spends.Bands.${band}`) === "string"),
  "every Availability band has a label");
ok(CHARGEN_SPEND_PACKS.every(pack => typeof localize(`GHOSTWIRE.Chargen.Spends.Packs.${pack}`) === "string"),
  "every spendable pack has a label");

/* -------------------------------------------- 8) step state on real-shaped heroes */

console.log("\n8) step state reads a hero the way Appendix B does");

const blankHero = {
  name: "New Actor", bio: "", level: 0,
  peopleDsid: null, backgroundDsid: null, professionDsid: null, classDsid: null,
  kits: [], streetGearCount: 0, skills: [], characteristics: {}, languages: [],
  taint: 0, chromeCount: 0, integrity: { value: 20, max: 20 },
  state: {},
};
const finishedHero = {
  ...blankHero,
  name: "Vex", bio: "Came up in the Flats.", level: 1,
  peopleDsid: "corran", backgroundDsid: "hive-born", professionDsid: "fixer", classDsid: "operator",
  kits: [{ dsid: "gunslinger", name: "Gunslinger", needsGear: true }],
  streetGearCount: 2,
  skills: ["firearms", "streetwise"],
  characteristics: spread(2, 2, 1, 1, 0),
  languages: ["caelian"],
  state: { acked: ["resources"] },
};

const blank = stepStatus(blankHero);
ok(!blank.name.done, "a placeholder-named hero has not finished the name step");
ok(!blank.people.done && !blank.class.done && !blank.kit.done, "nothing on the spine is done on a blank sheet");
ok(blank.integrity.done, "a blank sheet already passes the firewall: 20/20, Taint 0, no chrome");
ok(blank.spends.optional && blank.spends.done, "the spends step is optional and never blocks");
ok(blank.bio.optional, "the concept step is optional");
ok(!chargenComplete(blankHero), "a blank sheet is not complete");

const finished = stepStatus(finishedHero);
ok(Object.entries(finished).filter(([key]) => key !== "done").every(([, row]) => row.done),
  "the finished runner clears every step");
ok(chargenComplete(finishedHero), "the finished runner is complete");

ok(isPlaceholderName("New Actor") && isPlaceholderName("  ") && !isPlaceholderName("Vex"),
  "placeholder names are recognised, real ones are not");

console.log("\n   └ the firewall bites");
ok(stepStatus({ ...finishedHero, chromeCount: 1, integrity: { value: 20, max: 20 } }).integrity.done !== false
  || stepStatus({ ...finishedHero, chromeCount: 1, integrity: { value: 20, max: 20 } }).integrity.warn !== "ChromeAtChargen",
  "G10: chrome alone no longer raises ChromeAtChargen");
ok(!stepStatus({ ...finishedHero, chromeCount: 1, integrity: { value: 18, max: 20 } }).integrity.done,
  "G10: chrome with Integrity below start still fails the honest Integrity check");
ok(!stepStatus({ ...finishedHero, taint: 1 }).integrity.done, "Taint 1 fails the firewall");
ok(!stepStatus({ ...finishedHero, integrity: { value: 18, max: 20 } }).integrity.done, "18/20 fails the firewall");
ok(stepStatus({ ...finishedHero, isCyborg: true, peopleDsid: "cyborg", integrity: { value: 25, max: 25 } }).integrity.done,
  "a Cyborg at 25/25 clears the Integrity step");
ok(!stepStatus({ ...finishedHero, isCyborg: true, peopleDsid: "cyborg", integrity: { value: null, max: null } }).integrity.done,
  "a Cyborg with missing Integrity fails until stamped 25/25");
ok(!stepStatus({ ...finishedHero, isCyborg: true, peopleDsid: "cyborg", integrity: { value: 20, max: 20 } }).integrity.done,
  "a Cyborg still on living 20/20 fails until migrated to 25");
ok(!stepStatus({ ...finishedHero, isCyborg: true, peopleDsid: "cyborg", integrity: { value: 23, max: 25 }, chromeCount: 1 }).integrity.done,
  "Cyborg chrome that spent Integrity fails the honest Integrity check (same as living)");
ok(stepStatus({ ...finishedHero, isCyborg: true, peopleDsid: "cyborg", integrity: { value: 25, max: 25 }, chromeCount: 1 }).integrity.done,
  "Cyborg with chromeCount but Integrity still at start can clear (debit pending / edge)");
ok(chargenComplete({ ...finishedHero, chromeCount: 1, integrity: { value: 20, max: 20 }, taint: 0 }),
  "G10: chromed runner with Integrity at start can complete");

console.log("\n   └ the advisory warnings");
ok(stepStatus({ ...finishedHero, peopleDsid: "changer", changerLineage: false }).people.warn === "ChangerLineage",
  "a Changer with no lineage gets a warning");
ok(stepStatus({ ...finishedHero, peopleDsid: "changer", changerLineage: true }).people.warn === null,
  "a Changer with a lineage does not");
ok(stepStatus({ ...finishedHero, isCyborg: true, classDsid: "elementalist" }).class.warn === "ArcaneSeverance",
  "a Cyborg caster gets the Arcane Severance warning");
ok(stepStatus({ ...finishedHero, streetGearCount: 0 }).kit.warn === "KitNeedsGear",
  "a Kit that wants gear on a bare sheet gets a warning");
ok(stepStatus({ ...blankHero, state: { acked: ["kit"] } }).kit.done,
  "an explicit “no Kit is right for this runner” finishes the Kit step");
ok(stepStatus(blankHero).resources.warn === "ResourcesNeedClass",
  "the resource read-back asks for a class first");
for (const key of ["ChangerLineage", "ArcaneSeverance", "KitNeedsGear", "ResourcesNeedClass",
  "ChromeAtChargen", "TaintNotZero", "IntegrityOff"]) {
  ok(typeof localize(`GHOSTWIRE.Chargen.Warnings.${key}`) === "string", `warning "${key}" has a lang key`);
}

/* -------------------------------------------- 8b) chargen spend preview-before-buy */

console.log("\n8b) early-spend rows can open the Item card without buying");
ok(templateSrc.includes('data-action="openDoc"') && templateSrc.includes('data-action="buy"'),
  "spend rows expose openDoc and buy as separate actions");
ok(templateSrc.includes('data-action="openDoc"') && templateSrc.includes('data-uuid="{{uuid}}"'),
  "openDoc carries the catalog UUID");
ok((templateSrc.match(/data-action="openDoc"/g) || []).length >= 2,
  "spend rows offer more than one openDoc affordance (name + eye)");
ok(scriptSrc.includes("#onOpenDoc") && scriptSrc.includes("doc?.sheet?.render"),
  "openDoc renders the Item sheet without creating an owned copy");
ok(typeof localize("GHOSTWIRE.Chargen.Spends.View") === "string",
  "Spends.View lang key exists");
ok(typeof localize("GHOSTWIRE.Chargen.Spends.ViewHint") === "string",
  "Spends.ViewHint lang key exists");
ok(typeof localize("GHOSTWIRE.Integrity.CyborgHint") === "string",
  "Integrity.CyborgHint lang key exists");
ok(localize("GHOSTWIRE.Chargen.People.CyborgLocks").includes("25"),
  "People.CyborgLocks mentions Body Integrity 25");

/* -------------------------------------------- 9) the Done-when box */

console.log("\n9) the Done summary mirrors the Appendix B Done-when box");
const checklist = doneChecklist(finishedHero);
const CHECKLIST_KEYS = ["Items", "Kit", "Skills", "Characteristics", "Resources", "Firewall", "Spends", "Portrait"];
ok(checklist.map(row => row.key).join(",") === CHECKLIST_KEYS.join(","),
  `the box prints ${CHECKLIST_KEYS.length} rows in print order`);
ok(checklist.filter(row => row.optional).map(row => row.key).join(",") === "Spends,Portrait",
  "only the optional spends and the portrait are optional — exactly as the box prints it");
ok(checklist.filter(row => !row.optional).every(row => row.done), "the finished runner clears every required row");
ok(!doneChecklist({ ...finishedHero, streetGearCount: 0 }).find(row => row.key === "Kit").done,
  "a Kit with no qualifying gear fails its Done row");
for (const key of CHECKLIST_KEYS) {
  ok(typeof localize(`GHOSTWIRE.Chargen.Done.${key}`) === "string", `Done row "${key}" has a lang key`);
}

/* -------------------------------------------- 10) re-run gate */

console.log("\n10) chargen never runs twice");
ok(rerunGate({ level: 1, state: {} }).writable, "a 1st-level runner mid-build is writable");
ok(!rerunGate({ level: 2, state: {} }).writable, "a hero past 1st level is read-only");
ok(rerunGate({ level: 2, state: {} }).reason === "PastFirstLevel", "and says why");
ok(!rerunGate({ level: 1, state: { completed: "2026-09-22T00:00:00.000Z" } }).writable,
  "a stamped-complete hero is read-only");
ok(rerunGate({ level: 1, state: { completed: "2026-09-22T00:00:00.000Z" } }).reason === "Completed", "and says why");
ok(scriptSrc.includes("if (!rerunGate(heroFacts(actor)).writable)"), "the pick handler checks the gate before writing");
for (const key of ["Completed", "PastFirstLevel", "NotOwner", "Blocked"]) {
  ok(typeof localize(`GHOSTWIRE.Chargen.ReadOnly.${key}`) === "string", `read-only reason "${key}" has a lang key`);
}

/* -------------------------------------------- 11) Arcane Severance agrees with module.mjs */

console.log("\n11) Cyborg class locks agree with the rest of the module");
const moduleCasters = /VEIL_CASTER_CLASSES = new Set\(\[([^\]]+)\]\)/.exec(moduleSrc)?.[1] ?? "";
const moduleList = [...moduleCasters.matchAll(/"([^"]+)"/g)].map(match => match[1]).sort();
ok(moduleList.length === 3, `module.mjs names three Veil-caster classes (${moduleList.join(", ")})`);
ok([...CYBORG_BLOCKED_CLASSES].sort().join(",") === moduleList.join(","),
  "the wizard blocks exactly the classes module.mjs blocks");
for (const dsid of CYBORG_BLOCKED_CLASSES) {
  ok(typeof localize(`GHOSTWIRE.Chargen.Classes.${dsid}`) === "string", `"${dsid}" has a player-facing label`);
}

/* -------------------------------------------- 12) VOIDMARK */

console.log("\n12) VOIDMARK is asked as a runner, never as a Director");
ok(/game\.modules\.get\(MODULE_ID\)\?\.api\?\.voidmark/.test(scriptSrc),
  "VOIDMARK is reached through the module API, not a hard import");
ok(!/from "\.\/voidmark\.mjs"/.test(scriptSrc), "voidmark.mjs is not imported (it needs Foundry at module scope)");
ok(!/mode:\s*"director"|normalizeMode|setMode/.test(scriptSrc),
  "the wizard never sets VOIDMARK's mode — the B122 / S6 audience lock stands");
const voidmarkSrc = read("scripts/voidmark.mjs");
ok(/seed\(text\)/.test(voidmarkSrc), "voidmark.mjs gained a seed() that fills the prompt box without sending");
ok(/export function openVoidmark\(\{ seed \} = \{\}\)/.test(voidmarkSrc), "openVoidmark accepts a seed");
const seeded = voidmarkSeed({ bio: "A Flats courier who lost a leg to a Gold Line tram.", peopleName: "Corran" });
ok(seeded.includes("Flats courier"), "the seed carries the runner's concept");
ok(seeded.includes("Corran"), "the seed carries the picks made so far");
ok(/People.*Class.*Kit/s.test(seeded), "the seed asks for People / Class / Kit build ideas");
ok(voidmarkSeed({}).length > 40, "an empty sheet still gets a usable question");
ok(!/director|Director/.test(seeded), "the seed never asks for Director-only material");

/* -------------------------------------------- 13) lang coverage + the B93 name-check lock */

console.log("\n13) every key the UI asks for exists, and the copy stays clean");
const referenced = new Set();
for (const match of templateSrc.matchAll(/GHOSTWIRE\.Chargen\.([A-Za-z0-9_.]+)/g)) referenced.add(match[1]);
for (const match of scriptSrc.matchAll(/loc\("([A-Za-z0-9_.]+)"/g)) referenced.add(match[1]);
for (const match of scriptSrc.matchAll(/\$\{L\}\.([A-Za-z0-9_.]+)/g)) referenced.add(match[1]);
// A key ending in "." is the static head of a template literal (`${L}.Spends.Bands.${band}`); those dynamic
// families are asserted by name in sections 3, 7 and 8 instead.
let missing = 0;
for (const key of [...referenced].filter(key => !key.endsWith(".")).sort()) {
  if (typeof localize(`GHOSTWIRE.Chargen.${key}`) !== "string") {
    failures.push(`missing lang key: GHOSTWIRE.Chargen.${key}`);
    missing += 1;
  }
}
ok(missing === 0, `every static GHOSTWIRE.Chargen key the UI names resolves (${referenced.size} referenced)`);

const flatten = (node, prefix = "") => Object.entries(node).flatMap(([key, value]) =>
  (value && (typeof value === "object"))
    ? flatten(value, `${prefix}${key}.`)
    : [[`${prefix}${key}`, String(value)]]);
const chargenStrings = flatten(lang.GHOSTWIRE.Chargen);
ok(chargenStrings.length > 100, `the Chargen block ships ${chargenStrings.length} strings`);

// B93: no Draw Steel / MCDM / Creator License name-checks in player-facing copy.
const FORBIDDEN = [/draw\s*steel/i, /\bMCDM\b/i, /creator license/i];
const offenders = chargenStrings.filter(([, text]) => FORBIDDEN.some(rx => rx.test(text)));
ok(offenders.length === 0,
  `no player-facing Chargen string name-checks the system (offenders: ${offenders.map(([key]) => key).join(", ") || "none"})`);

// Sheet remaps: the player reads People / Background / Profession, never the stock words.
const REMAP = [/\bAncestry\b/, /\bCulture\b/, /\bCareer\b/];
const remapOffenders = chargenStrings.filter(([, text]) => REMAP.some(rx => rx.test(text)));
ok(remapOffenders.length === 0,
  `the remaps hold — People / Background / Profession only (offenders: ${remapOffenders.map(([key]) => key).join(", ") || "none"})`);
ok(localize("GHOSTWIRE.Chargen.Steps.people.Name") === "People", "step 3 is called People");
ok(localize("GHOSTWIRE.Chargen.Background.BackgroundHead") === "Background", "the Culture slot is called Background");
ok(localize("GHOSTWIRE.Chargen.Background.ProfessionHead") === "Profession", "the Career slot is called Profession");

/* -------------------------------------------- done */

console.log("");

/* -------------------------------------------- G5–G10 / 0.3.103 */

console.log("G5–G10 chargen wave (0.3.103)");
ok(CHARGEN_SPEND_PACKS.includes("chrome"), "G10: CHARGEN_SPEND_PACKS includes chrome");
ok(!CHARGEN_FORBIDDEN_PACKS.includes("chrome"), "G10: chrome is not forbidden");
ok(CHARGEN_FORBIDDEN_PACKS.includes("mods"), "G10: mods remain forbidden");
ok(isChargenSpendable({ pack: "chrome", price: 500, chrome: { integrity: 2 } }), "G10: chrome row is spendable");
ok(!isChargenSpendable({ pack: "mods", price: 100 }), "G10: mods row still refused");
ok(typeof spendCategoryOf === "function", "G8: spendCategoryOf exported");
ok(spendCategoryOf({ pack: "matrix" }) === "wired", "G8: matrix maps to wired");
ok(spendCategoryOf({ pack: "chrome" }) === "chrome", "G8: chrome category");
ok(chromeIntegrityCost({ chrome: { integrity: 3 } }) === 3, "G10: chromeIntegrityCost reads integrity");
ok(skillPickBudget([{ type: "skill", chooseN: 2 }, { type: "skill", skills: { choices: ["occult"] } }]) === 3, "G7: skillPickBudget sums chooseN + fixed");
ok(languagePickBudget([]) >= 1, "G7: languagePickBudget floor");
ok(scriptSrc.includes("startOver"), "G6: startOver action registered");
ok(scriptSrc.includes("G9:"), "G9: hide-after-finish lock present");
ok(templateSrc.includes('data-action="startOver"'), "G6: Start over control in template");
ok(templateSrc.includes('data-spend-filter="category"'), "G8: category filter in template");
ok(templateSrc.includes("ChromeOkModsNo"), "G10: spend copy allows chrome");
ok(existsSync("src/packs/professions/ward-apprentice.json"), "G5: ward-apprentice profession source");
ok(existsSync("src/packs/professions/survey-hand.json"), "G5: survey-hand profession source");
ok(atLeast(moduleJson.version, "0.3.103"), `module.json is at least 0.3.103 (${moduleJson.version})`);

if (failures.length) {
  console.error(`FAILED (${failures.length}):`);
  for (const failure of failures) console.error(`  ✗ ${failure}`);
  process.exit(1);
}
console.log("B95 Chargen Wizard smoke: all checks passed.");
