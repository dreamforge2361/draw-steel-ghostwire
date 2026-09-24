#!/usr/bin/env node
/**
 * 0.3.122 next-build wave smoke — ten of Michael's twelve locks.
 *
 * Locks 4 (the Disconnect rung) and 5 (the cycle macro) live in tools/wire-state-toggle-smoke.mjs,
 * next to the three-rung assertions they replaced. Everything else is here:
 *
 *   1  Changer art pickers on Biography; form buttons still on Stats.
 *   2  Director macro: +1 system.hero.primary.value.
 *   3  Beast-Hide (and Layered Hide) right-click repick from the existing effectGrant pool.
 *   6  Locked-sheet Stamina tooltip listing every contributor to max.
 *   7  Changer Darksight 30 through the F20 sightGrant path.
 *   8  Trade Cant free on create and in chargen.
 *   9  Machine conditions from Integrity: On Fire / Leaking, Crippled, Systems Down.
 *  10  Rat-lineage Beast-Form token size 0.5.
 *  11  Advanced Tactics costs 1 Influence.
 *  12  Worn armor enables its Stamina band; one armor only; kit Stamina kept.
 *
 * Run: node tools/next-build-wave-03122-smoke.mjs
 * Does not need live Foundry.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { readdirSync } from "node:fs";

import { changerFormTokenSize, shouldSnapshotBeastSize, beastTokenSize, CHANGER_FORMS } from "../scripts/changer-forms.mjs";
import {
  advancementIsRepickable,
  repickMenuVisible,
  repickableAdvancements,
} from "../scripts/trait-repick.mjs";
import {
  armorStaminaBands,
  armorStaminaPlan,
  isArmorItem,
  isStaminaChangeKey,
  pickArmorBand,
  staminaChangeValue,
  staminaTooltipRows,
} from "../scripts/stamina.mjs";
import {
  MACHINE_CONDITIONS,
  integrityPercent,
  machineConditionFor,
  machineConditionStatusPlan,
} from "../scripts/machine-conditions.mjs";
import { TRADE_CANT_KEY } from "../scripts/languages.mjs";
import { atLeast } from "./lib/module-version.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const fail = [];
const ok = [];
const note = (pass, msg) => (pass ? ok : fail).push(pass ? `  ✓ ${msg}` : msg);

// Sources are read CRLF-normalised: this file asserts on code *shape*, and a stray \r would make
// every multi-line pattern below depend on how git checked the tree out.
const read = p => readFileSync(p, "utf8").replace(/\r\n/g, "\n");
const readJson = p => JSON.parse(read(p));

const module_ = readJson("module.json");
const lang = readJson("lang/en.json");
const css = read("styles/ghostwire.css");
const boot = read("scripts/module.mjs");
const langAt = path => path.split(".").reduce((o, k) => o?.[k], lang);

console.log("0.3.122 next-build wave smoke\n");

/* ------------------------------------------------------------------ 0) ship surface */

console.log("0) Ship surface");
note(atLeast(module_.version, "0.3.122"), `module.json is >= 0.3.122 (got ${module_.version})`);
note(read("README.md").includes("0.3.122"), "README changelog carries a 0.3.122 entry");
const backlog = read("docs/directors/MASTER-BACKLOG-2026-09-22.md");
note(/0\.3\.122/.test(backlog), "the master backlog knows about 0.3.122");
for (const script of [
  "scripts/changer-forms.mjs", "scripts/director-resource.mjs", "scripts/trait-repick.mjs",
  "scripts/stamina.mjs", "scripts/machine-conditions.mjs",
]) {
  note(boot.includes(script.replace("scripts/", "./")), `module.mjs imports ${script}`);
}
for (const call of ["registerDirectorResource()", "registerTraitRepick()", "registerStamina()", "registerMachineConditions()"]) {
  note(boot.includes(call), `module.mjs calls ${call}`);
}

/* ------------------------------------------------------------------ 1) Changer sheet split */

console.log("\n1) Changer art pickers → Biography; form buttons stay on Stats");
const artHookAt = boot.indexOf('const biography = element.querySelector("section.tab[data-tab=\'biography\']");');
note(artHookAt > 0, "a render hook reaches for the Biography tab");
const artHook = boot.slice(artHookAt);
note(artHook.includes('.ghostwire-changer-form-art'), "and it is the one that builds the art row");
note(artHook.includes("biography.append(fieldset)"), "and the art fieldset lands on Biography");
note(!artHook.includes("ghostwire-changer-form-buttons"), "the Biography half ships no form buttons");
const statsHalfAt = boot.lastIndexOf('stats.querySelector(".ghostwire-changer-forms")', artHookAt);
note(statsHalfAt > 0, "a render hook reaches for the Stats tab");
const statsHalf = boot.slice(statsHalfAt, artHookAt);
note(statsHalf.includes("ghostwire-changer-form-buttons"), "the Stats half still builds the form buttons");
note(!statsHalf.includes("ghostwire-changer-form-art-slot"), "and no longer builds the art slots");
note(statsHalf.includes("setChangerForm(formEffects, form, actor)"), "the buttons still call setChangerForm");
note(typeof langAt("GHOSTWIRE.Peoples.Changer.Forms.Art.Name") === "string", "the Biography fieldset has a legend string");
note(/Biography/i.test(langAt("GHOSTWIRE.Peoples.Changer.Forms.Art.MovedHint")), "the Stats box points at Biography");
note(css.includes(".ghostwire-changer-art"), "CSS for the Biography art fieldset");
// R2's flags are untouched — the pickers moved, they were not rewritten.
for (const key of ["humanArt", "hybridArt", "beastArt", "humanToken", "hybridToken", "beastToken"]) {
  note(read("scripts/changer-forms.mjs").includes(`"${key}"`), `R2 flag ${key} still named in changer-forms.mjs`);
}
note(CHANGER_FORMS.join(",") === "human,hybrid,beast", "the three forms are unchanged");

/* ------------------------------------------------------------------ 2) Director +1 primary */

console.log("\n2) Director macro: +1 heroic primary");
const resource = read("scripts/director-resource.mjs");
note(resource.includes("system.updateResource"), "the write goes through Draw Steel's updateResource, not a raw actor.update");
note(!/actor\.update\(\{\s*"system\.hero\.primary/.test(resource), "and never writes system.hero.primary.value directly");
note(resource.includes("coreResource"), "the resource is resolved from the class's coreResource");
note(/Surge|Victor/i.test(resource) === false || /Not Surges/.test(resource), "the file is explicit that this is not Surges / Victories");
note(resource.includes('collectTaintTargets as resolveDirectorTargets'), "targeting reuses the existing Director helper");
note(resource.includes("game.user?.isGM"), "GM-only");
const plusOne = readJson("src/packs/macros/director-heroic-plus-one.json");
note(plusOne.type === "script" && plusOne.scope === "global", "the macro is a global script macro");
note(plusOne.name === "GHOSTWIRE.Resources.Director.MacroName", "its name is a lang key (house pattern)");
note(plusOne.command.includes("api.directorHeroicPlusOne"), "it calls the API helper");
note(plusOne.flags[MODULE_ID].directorTool === "heroic-plus-one", "and carries the directorTool flag");
note(/^[A-Za-z0-9]{16}$/.test(plusOne._id), "and a legal 16-character id");
note(plusOne._key === `!macros!${plusOne._id}`, "and a matching pack key");
for (const key of ["MacroName", "Notify", "ChatLine", "GMOnly", "NoTarget", "NotHero", "NoPrimary"]) {
  note(typeof langAt(`GHOSTWIRE.Resources.Director.${key}`) === "string", `lang Resources.Director.${key}`);
}

/* ------------------------------------------------------------------ 3) Beast-Hide repick */

console.log("\n3) Beast-Hide / Layered Hide right-click repick");
const repickable = adv => advancementIsRepickable(adv);
const beastHide = readJson("src/packs/origins/changer/beast-hide-trait.json");
const layered = readJson("src/packs/origins/changer/layered-hide-trait.json");
for (const [name, doc] of [["Beast-Hide", beastHide], ["Layered Hide", layered]]) {
  const advancements = Object.values(doc.system.advancements);
  const found = repickableAdvancements(advancements);
  note(found.length === 1, `${name} has exactly one repickable advancement`);
  note(found[0]?.repick?.respite === "finish", `${name} repicks when you finish a respite`);
  note(found[0]?.pool?.length === 6, `${name} still offers the stock six-immunity pool`);
  note(found[0]?.chooseN === 1, `${name} still chooses one`);
}
note(beastHide.system.advancements[Object.keys(beastHide.system.advancements)[0]].pool
  .every(entry => entry.uuid.startsWith("Compendium.draw-steel.effects.ActiveEffect.")),
"the pool is still Draw Steel's own effects — no invented immunity math");
note(!repickable({ type: "itemGrant", repick: { respite: "finish" }, pool: [1, 2] }), "an itemGrant is not offered a repick");
note(!repickable({ type: "effectGrant", repick: {}, pool: [1, 2] }), "an effectGrant with no repick window is not offered one");
note(!repickable({ type: "effectGrant", repick: { respite: "finish" }, pool: [1] }), "a pool of one is not a choice");
note(repickable({ type: "effectGrant", repick: { respite: "activity" }, pool: [1, 2] }), "the respite-activity window counts too");
note(repickMenuVisible({ repickable: 1, embedded: true, isOwner: true }), "an owner sees the entry on an owned trait");
note(!repickMenuVisible({ repickable: 1, embedded: false, isOwner: true }), "a compendium copy does not — reconfigure() would throw");
note(!repickMenuVisible({ repickable: 0, embedded: true, isOwner: true }), "nothing to repick means no entry");
note(repickMenuVisible({ repickable: 1, embedded: true, isOwner: false, isGM: true }), "the Director sees it on anyone's sheet");
const repick = read("scripts/trait-repick.mjs");
note(repick.includes("advancement.reconfigure()"), "the repick is Draw Steel's own reconfigure(), not a reimplementation");
note(!/pool\s*=\s*\[/.test(repick), "the module hard-codes no immunity pool of its own");
note(repick.includes("_getDocumentListContextOptions"), "it extends the sheet's existing row menu rather than adding a second one");
note(typeof langAt("GHOSTWIRE.Repick.MenuLabel") === "string", "the menu entry has a label");
for (const key of ["NotRepickable", "CannotReconfigure", "Failed"]) {
  note(typeof langAt(`GHOSTWIRE.Repick.Warnings.${key}`) === "string", `lang Repick.Warnings.${key}`);
}

/* ------------------------------------------------------------------ 6) Stamina tooltip */

console.log("\n6) Locked-sheet Stamina tooltip");
const stamina = read("scripts/stamina.mjs");
note(stamina.includes("dataset.tooltipHtml"), "the pool gets an HTML tooltip");
note(stamina.includes(".resource.stamina"), "hung on Draw Steel's own Stamina pool element");
note(isStaminaChangeKey("system.stamina.bonuses.treasure"), "treasure bonuses count");
note(isStaminaChangeKey("system.stamina.bonuses.echelon"), "echelon bonuses count");
note(isStaminaChangeKey("system.stamina.bonuses.level"), "level bonuses count");
note(isStaminaChangeKey("system.stamina.max"), "a direct max override counts");
note(!isStaminaChangeKey("system.stamina.value"), "current Stamina is not a contributor to max");
note(!isStaminaChangeKey("system.movement.value"), "and neither is speed");
note(staminaChangeValue({ key: "system.stamina.bonuses.echelon", value: 3 }, { echelon: 4, level: 10 }) === 12,
  "an echelon bonus is multiplied by the echelon");
note(staminaChangeValue({ key: "system.stamina.bonuses.level", value: 2 }, { echelon: 4, level: 10 }) === 20,
  "a level bonus is multiplied by the level");
note(staminaChangeValue({ key: "system.stamina.bonuses.treasure", value: 8 }, { echelon: 4, level: 10 }) === 8,
  "a treasure bonus is flat");
{
  const rows = [
    { kind: "class", name: "Rigger", value: 21 },
    { kind: "kit", name: "Longshot", value: 3 },
    { kind: "armor", name: "Armored Jacket", value: 4 },
    { kind: "trait", name: "Tough But Withered", value: 0 },
  ];
  const summary = staminaTooltipRows({ rows, max: 30 });
  note(summary.rows.length === 4, "a zero-value row is dropped and the remainder takes its place");
  note(summary.rows.at(-1).kind === "other" && summary.rows.at(-1).value === 2,
    `an unexplained +2 is shown honestly as "other" (got ${summary.rows.at(-1).value})`);
  note(summary.total === 30, "the total is the sheet's own max");
  const exact = staminaTooltipRows({ rows: rows.slice(0, 3), max: 28 });
  note(!exact.rows.some(r => r.kind === "other"), "when the rows add up, no remainder row is added");
  note(exact.remainder === 0, "and the remainder is zero");
  const negative = staminaTooltipRows({ rows: [{ kind: "class", name: "X", value: 30 }], max: 25 });
  note(negative.rows.at(-1).value === -5, "an over-count is reported as a negative other row, not hidden");
}
for (const kind of ["class", "kit", "armor", "trait", "effect", "other"]) {
  note(typeof langAt(`GHOSTWIRE.Stamina.Kinds.${kind}`) === "string", `lang Stamina.Kinds.${kind}`);
}
note(typeof langAt("GHOSTWIRE.Stamina.Tooltip.Total") === "string", "lang Stamina.Tooltip.Total");
note(css.includes(".ghostwire-stamina-sources"), "CSS for the tooltip rows");
note(stamina.includes("system.changes"), "the walk reads Draw Steel's system.changes, not core changes");

/* ------------------------------------------------------------------ 7) Changer Darksight 30 */

console.log("\n7) Changer Darksight 30");
const darksight = readJson("src/packs/origins/changer/darksight-trait.json");
const grant = darksight.flags[MODULE_ID].sightGrant;
note(darksight.type === "ancestryTrait", "Darksight is a People trait Item");
note(darksight.system._dsid === "changer-darksight", "with its own dsid");
note(darksight.folder === readJson("src/packs/origins/changer/_folder.json")._id, "filed in the Changer folder");
note(grant.modes.length === 1 && grant.modes[0].id === "basicSight", "it writes the stock basicSight mode");
note(grant.modes[0].range === 30, `at range 30 (got ${grant.modes[0].range})`);
note(grant.visionMode === "darkvision", "with Foundry's stock darkvision vision mode (F20 nightOptics mapping)");
note(grant.claims.join(",") === "nightOptics", "and claims exactly nightOptics");
note(grant.enableVision !== true, "it does not flip Has Vision — token-vision.mjs still owns that for heroes");
const changer = readJson("src/packs/origins/changer/changer.json");
const darkGrant = Object.values(changer.system.advancements)
  .find(a => a.pool?.some(p => p.uuid.endsWith(darksight._id)));
note(!!darkGrant, "the Changer ancestry grants it");
note(darkGrant?.chooseN === null && darkGrant?.pool.length === 1, "automatically — a pool of one with no choice");
note(darkGrant?.requirements?.level === null, "at level 1, like the other signature grants");
for (const slug of ["vira-kellis-nade", "wren-sable-corvin"]) {
  const pregen = readJson(`src/packs/pregens/${slug}.json`);
  note(pregen.items.some(i => i.system?._dsid === "changer-darksight"), `${slug} regenerated with Darksight`);
}
note(/Darkvision 30 squares/.test(langAt("GHOSTWIRE.Peoples.Changer.Darksight.Description")),
  "the card prints what the canvas actually does");

/* ------------------------------------------------------------------ 8) Trade Cant free */

console.log("\n8) Trade Cant free for every hero");
note(TRADE_CANT_KEY === "caelian", "Trade Cant is Draw Steel's caelian key (the remap keeps the key)");
note(read("scripts/languages.mjs").includes("caelian: \"TradeCant\""), "and the remap row is untouched");
note(langAt("GHOSTWIRE.Languages.TradeCant") === "Trade Cant", "the label still reads Trade Cant");
note(boot.includes("TRADE_CANT_KEY"), "module.mjs imports the key rather than typing the string");
note(/preCreateActor[\s\S]{0,2200}TRADE_CANT_KEY/.test(boot), "the create-Actor path stamps it");
note(/tradeCantGranted/.test(boot), "existing worlds get a one-time, flagged grant");
const chargen = read("scripts/chargen-wizard.mjs");
note(chargen.includes("spentLanguages("), "the wizard counts spent languages, not all languages");
note(/budget > 0 && spentLanguages\(known\)\.length >= budget/.test(chargen), "the Add button's budget check skips the free one");
note(/isFreeLanguage\(key\)/.test(chargen), "and Remove refuses to give it up");
note(/\[\.\.\.FREE_LANGUAGES\]/.test(chargen), "Start over restores the grant rather than clearing it");
note(typeof langAt("GHOSTWIRE.Chargen.Languages.Free") === "string", "the wizard marks it as free");
note(typeof langAt("GHOSTWIRE.Chargen.Languages.FreeLocked") === "string", "and explains why it cannot be removed");
note(read("templates/chargen-wizard.hbs").includes("{{#if free}}"), "the template renders the marker");

/* ------------------------------------------------------------------ 9) Machine conditions */

console.log("\n9) Machine conditions from Integrity");
const band = (value, max) => machineConditionFor({ value, max });
note(band(20, 20) === null, "a full frame is in no band");
note(band(11, 20) === null, "55% is still healthy");
note(band(10, 20) === "onFire", "exactly 50% is On Fire / Leaking");
note(band(6, 20) === "onFire", "30% is On Fire / Leaking");
note(band(5, 20) === "crippled", "exactly 25% is Crippled");
note(band(1, 20) === "crippled", "5% is Crippled");
note(band(0, 20) === "systemsDown", "0% is Systems Down");
note(band(-4, 20) === "systemsDown", "and so is negative Integrity");
note(band(5, 0) === null, "an unrated frame (max 0) is not Systems Down — 0/0 is not a wreck");
note(band(undefined, 20) === null, "a missing value reads as no band rather than a wreck");
note(MACHINE_CONDITIONS.map(b => b.id).join(",") === "systemsDown,crippled,onFire",
  "the bands are ordered worst-first so the worst one wins");
note(MACHINE_CONDITIONS.every(b => /^[A-Za-z0-9]{16}$/.test(b._id)), "every condition status has a legal 16-character id");
note(new Set(MACHINE_CONDITIONS.map(b => b.status)).size === 3, "three distinct status ids");
{
  const plan = machineConditionStatusPlan("crippled");
  note(plan.on.length === 1 && plan.on[0] === "ghostwire-crippled", "one band on");
  note(plan.off.length === 2, "and the other two off — never two bands at once");
  const clear = machineConditionStatusPlan(null);
  note(clear.on.length === 0 && clear.off.length === 3, "healthy clears all three");
}
note(integrityPercent({ value: 7, max: 20 }) === 35, "the chip prints a rounded percentage");
note(integrityPercent({ value: 7, max: 0 }) === null, "an unrated frame prints no percentage");
const conditions = read("scripts/machine-conditions.mjs");
note(/[Ss]talled/.test(conditions) && /out of scope/i.test(conditions), "Stalled / Dead-stick are named as out of scope, not modelled");
note(!conditions.includes('"ghostwire-stalled"'), "and no Stalled status is registered");
note(read("templates/machine-sheet.hbs").includes("gw-m-condition"), "the Machine sheet prints a Condition chip");
note(read("templates/machine-sheet.hbs").indexOf("gw-m-condition")
  < read("templates/machine-sheet.hbs").indexOf("data-tab=\"control\""), "on page 1 (the combat tab)");
note(read("scripts/machine-sheet.mjs").includes("machineConditionLabel(actor)"), "and the sheet context supplies it");
for (const key of ["onFire", "crippled", "systemsDown", "healthy"]) {
  note(typeof langAt(`GHOSTWIRE.Summons.Machines.Conditions.${key}.Label`) === "string", `lang Conditions.${key}.Label`);
}
note(langAt("GHOSTWIRE.Summons.Machines.Conditions.onFire.Label") === "On Fire / Leaking", "the 50% band is named On Fire / Leaking");
note(css.includes(".gw-m-condition"), "CSS for the chip");

/* ------------------------------------------------------------------ 10) Rat Beast token 0.5 */

console.log("\n10) Rat- and Raven-lineage Beast forms are 0.5 tokens");
note(beastTokenSize("rat") === 0.5, "rat lineage shrinks to 0.5");
note(beastTokenSize("wolf") === null, "wolf does not resize");
// 0.3.125 (C2): Raven joined Rat. A bird that walks onto the grid as a full square reads as a person.
note(beastTokenSize("raven") === 0.5, "raven lineage shrinks to 0.5");
note(beastTokenSize(null) === null, "a hero with no lineage does not resize");
{
  const rat = form => changerFormTokenSize({ lineage: "rat", form, base: { width: 1, height: 1 } });
  note(rat("beast").width === 0.5 && rat("beast").height === 0.5, "Beast form is 0.5 × 0.5");
  note(rat("human").width === 1 && rat("human").height === 1, "Human form restores the base footprint");
  note(rat("hybrid").width === 1, "Hybrid form restores it too");
  note(changerFormTokenSize({ lineage: "rat", form: "human", base: { width: 2, height: 2 } }).width === 2,
    "a Director's own 2×2 frame comes back 2×2, not 1×1");
  note(changerFormTokenSize({ lineage: "wolf", form: "beast" }) === null, "a non-resizing lineage writes nothing at all");
  note(changerFormTokenSize({ lineage: "rat", form: "human" }) === null,
    "a Rat who has never been in Beast form writes nothing — clicking Human cannot normalise a hand-sized token");
  note(changerFormTokenSize({ lineage: "rat", form: "human", base: { width: 0, height: -3 } }).width === 1,
    "a corrupt snapshot falls back to 1×1 rather than a zero-size token");
}
note(shouldSnapshotBeastSize({ lineage: "rat", form: "beast", current: { width: 1, height: 1 } }),
  "the pre-Beast footprint is snapshotted on the first swap");
note(!shouldSnapshotBeastSize({ lineage: "rat", form: "beast", stored: { width: 1, height: 1 }, current: { width: 0.5, height: 0.5 } }),
  "and never re-snapshotted over an existing record");
note(!shouldSnapshotBeastSize({ lineage: "rat", form: "beast", current: { width: 0.5, height: 0.5 } }),
  "a half-finished earlier swap cannot freeze 0.5 as the normal size");
note(!shouldSnapshotBeastSize({ lineage: "rat", form: "human", current: { width: 1, height: 1 } }),
  "leaving Beast snapshots nothing");
const ratRow = readJson("src/packs/origins/changer/rat-lineage-trait.json");
note(ratRow.flags[MODULE_ID].changerLineage === "rat", "lineage is read from the existing changerLineage flag");
note(read("scripts/changer-forms.mjs").includes("changerLineage") || boot.includes('"changerLineage"'),
  "and the runtime reads that same flag — no parallel lineage flag");
note(boot.includes("syncChangerFormTokenSize"), "the form swap syncs the token footprint");
note(/prototypeToken\.width/.test(boot) && /getActiveTokens/.test(boot), "on the prototype token and on every placed token");

/* ------------------------------------------------------------------ 11) Advanced Tactics */

console.log("\n11) Advanced Tactics costs 1 Influence");
const tactics = readJson("src/packs/classes/commander/origins/street-fixer/advanced-tactics.json");
note(tactics.system.resource === 1, `resource is 1 (got ${JSON.stringify(tactics.system.resource)})`);
note(tactics.system._dsid === "advanced-tactics", "on the Street Fixer ability");
const barak = readJson("src/packs/pregens/barak-voss-hallor.json");
const embedded = barak.items.find(i => i.system?._dsid === "advanced-tactics");
note(!!embedded, "Barak still carries the ability");
note(embedded?.system.resource === 1, "and his embedded copy agrees with the pack");
note(readJson("src/packs/classes/commander/abilities/a-word.json").system.resource === 1,
  "the other 1-Influence Commander ability is unchanged (sanity)");

/* ------------------------------------------------------------------ 12) Armor Stamina */

console.log("\n12) Worn armor adds Stamina");
const armorDir = "src/packs/gear/armor";
const armorFiles = [];
for (const sub of readdirSync(armorDir, { withFileTypes: true })) {
  if (!sub.isDirectory()) continue;
  for (const f of readdirSync(join(armorDir, sub.name))) {
    if (f.endsWith(".json") && f !== "_folder.json") armorFiles.push(join(armorDir, sub.name, f));
  }
}
note(armorFiles.length >= 20, `${armorFiles.length} armor SKUs found`);
let banded = 0;
for (const file of armorFiles) {
  const doc = readJson(file);
  if (!isArmorItem(doc)) { note(false, `${file}: not recognised as armor`); continue; }
  const bands = armorStaminaBands(doc.effects ?? []);
  if (bands.length === 4) banded += 1;
  else note(false, `${file}: expected 4 echelon bands, got ${bands.length}`);
  const byEchelon = bands.slice().sort((a, b) => a.echelon - b.echelon).map(b => b.value);
  const declared = doc.flags[MODULE_ID].gear.staminaByEchelon;
  if (byEchelon.join(",") !== declared.join(",")) {
    note(false, `${file}: band values ${byEchelon} disagree with staminaByEchelon ${declared}`);
  }
  if ((doc.effects ?? []).some(e => e.disabled !== true)) note(false, `${file}: a band ships enabled in the pack`);
}
note(banded === armorFiles.length, `every armor SKU carries four echelon bands (${banded}/${armorFiles.length})`);
note(armorFiles.every(f => (readJson(f).effects ?? []).every(e => e.disabled === true)),
  "every pack effect still ships disabled — the catalog copy is never live");
note(!isArmorItem({ flags: { [MODULE_ID]: { gear: { armorClass: "light" } } } }),
  "a gear row with no staminaByEchelon is not Stamina-bearing armor");
note(!isArmorItem({ flags: { [MODULE_ID]: { gear: { modSlots: 1 } } } }), "and a non-armor gear row is not armor");
{
  const jacket = readJson("src/packs/gear/armor/light/armored-jacket.json");
  const bands = armorStaminaBands(jacket.effects);
  note(bands.every(b => b.kit === "none"), "the shipped bands are all the No Kit flavour");
  note(pickArmorBand(bands, { echelon: 1, hasKit: false }).value === 4, "echelon 1 picks the +4 band");
  note(pickArmorBand(bands, { echelon: 3, hasKit: false }).value === 8, "echelon 3 picks the +8 band");
  // The lock: kit Stamina is its own source, so a hero WITH a kit still gets the armor's band.
  note(pickArmorBand(bands, { echelon: 2, hasKit: true }).value === 6,
    "a hero with a kit still gets the echelon band — kit Stamina is a separate source");
  note(pickArmorBand(bands, { echelon: 9, hasKit: false }).value === 10, "an echelon past the printed bands clamps to the top one");
  note(pickArmorBand([], { echelon: 1 }) === null, "no bands means no band");
  // A SKU that one day ships both flavours honours them.
  const both = [
    { id: "a", echelon: 1, kit: "none", value: 4 },
    { id: "b", echelon: 1, kit: "with", value: 2 },
  ];
  note(pickArmorBand(both, { echelon: 1, hasKit: true }).id === "b", "a With Kit band is preferred when the hero has a kit");
  note(pickArmorBand(both, { echelon: 1, hasKit: false }).id === "a", "and the No Kit band when they do not");
}
{
  const bands = n => [1, 2, 3, 4].map(e => ({ id: `${n}-${e}`, echelon: e, kit: "none", value: e * 2 }));
  const plan = armorStaminaPlan({
    armors: [
      { id: "jacket", worn: true, bands: bands("jacket") },
      { id: "hardshell", worn: false, bands: bands("hardshell") },
    ],
    echelon: 2,
  });
  note(plan.wornId === "jacket", "the worn armor is the one that counts");
  note(plan.enable.length === 1, "exactly one band is enabled — never two armor bonuses");
  note(plan.enable[0].effectId === "jacket-2", "and it is the echelon-matching band");
  note(plan.disable.length === 7, "every other band on every armor is switched off");
  note(plan.disable.every(e => e.effectId !== "jacket-2"), "including all three of the worn armor's other echelons");
  const none = armorStaminaPlan({ armors: [{ id: "jacket", worn: false, bands: bands("jacket") }], echelon: 2 });
  note(none.wornId === null && none.enable.length === 0 && none.disable.length === 4,
    "taking the armor off clears every band");
  const two = armorStaminaPlan({
    armors: [
      { id: "a", worn: true, bands: bands("a") },
      { id: "b", worn: true, bands: bands("b") },
    ],
    echelon: 1,
  });
  note(two.enable.length === 1, "a world that somehow carries two worn armors still enables only one band");
}
note(stamina.includes("Kit Stamina is untouched") || /never disabled here/.test(stamina),
  "the file states the kit rule in so many words");
note(!/type === "kit"[\s\S]{0,80}disabled: true/.test(stamina), "and no code path disables a kit effect");
note(/newest wins/i.test(stamina) || /armor you just put on/.test(stamina), "the one-armor tie-break is documented in the file");
note(stamina.includes("WORN_FLAG"), "worn is a named flag, not a magic string at each call site");
note(typeof langAt("GHOSTWIRE.Stamina.Menu.Wear") === "string", "lang for the Wear entry");
note(typeof langAt("GHOSTWIRE.Stamina.Menu.Remove") === "string", "lang for the Take off entry");

/* ------------------------------------------------------------------ docs */

console.log("\n13) Director note and Foundry checklist");
const directorNote = read("docs/directors/next-build-wave-03122.md");
const checklist = read("docs/directors/next-build-wave-smoke-03122.md");
note(directorNote.length > 4000, "docs/directors/next-build-wave-03122.md is a real note");
note(checklist.length > 2000, "docs/directors/next-build-wave-smoke-03122.md is a real checklist");
for (const phrase of [
  "Biography", "Influence", "Beast-Hide", "Disconnect", "Darksight", "Trade Cant",
  "Systems Down", "Advanced Tactics", "Crippled",
]) {
  note(directorNote.includes(phrase), `the note covers "${phrase}"`);
}
note(/only one armor/i.test(directorNote), "the note states the one-armor rule");
note(/shield/i.test(directorNote), "and says where shields sit in that rule");

/* ------------------------------------------------------------------ report */

for (const line of ok) console.log(line);
if (fail.length) {
  console.error(`\n${fail.length} failed:`);
  for (const line of fail) console.error(`  ✗ ${line}`);
  process.exit(1);
}
console.log(`\n${ok.length} checks passed.`);
