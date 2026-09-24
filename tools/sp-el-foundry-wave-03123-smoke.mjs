#!/usr/bin/env node
/**
 * 0.3.123 smoke — Street Priest rework, Elementalist Cantrip, and the Foundry fix wave.
 *
 *   A1  Rebuke is the one free Light-pact strike, at 2 / 4 / 6 + Persona. Smite / Rebuke is gone.
 *   A2  Blessed Light is a free 20-foot light utility: no strike keyword, no damage, no roll.
 *   A3  Drain is the Dark-pact free strike; the class grants exactly one of the two.
 *   A4  Lay On Hands and Sense the Veil are untouched.
 *   A5  Minor Rebuke is Holy Smite at 3 / 5 / 8 + Persona, still 1 Conviction.
 *   B   Cantrip: a fourth Elementalist signature, 0 Essence, no damage, Light or a described working.
 *   C1  Donning armor sets current Stamina to the new max; removing it only clamps.
 *   C2  Trauma Patch restores 1 spent Recovery, once per combat, and is consumed.
 *   C3  Wired Console Connections pin the viewing player's own hero to the top.
 *   C4  Using the Compile Sprite card compiles a sprite.
 *   C5  Recompile reshapes a compiled sprite or rebuilds a just-destroyed one at half Stamina.
 *
 * Run: node tools/sp-el-foundry-wave-03123-smoke.mjs
 * Does not need live Foundry.
 */
import { existsSync, readFileSync } from "node:fs";

import { lightRadius, lightConfig, planTokenLight, tokenLightSpec } from "../scripts/token-light.mjs";
import { planCantrip, isCantrip, CANTRIP_MODES } from "../scripts/cantrip.mjs";
import { planPactStrike, PACT_STRIKES, RETIRED_STRIKE_DSIDS } from "../scripts/pact-strike.mjs";
import { planStaminaAfterArmorChange } from "../scripts/stamina.mjs";
import { planConsumableUse, planOncePerCombat, planRecoveryRestore } from "../scripts/consumable-use.mjs";
import { compareConsoleListRows, sortConsoleRoster } from "../scripts/wired-console-verbs.mjs";
import { reducedStamina, recompileTargets } from "../scripts/sprites.mjs";
import { atLeast } from "./lib/module-version.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const fail = [];
const ok = [];
const note = (pass, msg) => (pass ? ok : fail).push(pass ? `  ✓ ${msg}` : msg);

const read = p => readFileSync(p, "utf8").replace(/\r\n/g, "\n");
const readJson = p => JSON.parse(read(p));

const SP = "src/packs/classes/street-priest";
const EL = "src/packs/classes/elementalist";
const lang = readJson("lang/en.json").GHOSTWIRE;
const spLang = lang.Classes.StreetPriest.Items;
const elLang = lang.Classes.Elementalist.Items;

const damageTiers = ability => {
  const effect = Object.values(ability.system.power.effects).find(e => e.type === "damage");
  if (!effect) return null;
  return ["tier1", "tier2", "tier3"].map(t => effect.damage[t].value);
};
const damageTypes = ability => {
  const effect = Object.values(ability.system.power.effects).find(e => e.type === "damage");
  return effect ? effect.damage.tier1.types : [];
};

console.log("0) Version");
note(atLeast(readJson("module.json").version, "0.3.123"), "module.json is at least 0.3.123");

/* ------------------------------------------------------------------ A: Street Priest */

console.log("\nA1) Rebuke is the one free Light-pact strike");
note(!existsSync(`${SP}/abilities/smite-rebuke.json`), "smite-rebuke.json is gone (no competing free strike)");
note(!("SmiteRebuke" in spLang), "lang has no Smite / Rebuke block left");
const rebuke = readJson(`${SP}/abilities/rebuke.json`);
note(spLang.Rebuke.Name === "Rebuke", "the card is named Rebuke, not Smite / Rebuke");
note(String(damageTiers(rebuke)) === String(["2 + @chr", "4 + @chr", "6 + @chr"]),
  `Rebuke is low power: ${damageTiers(rebuke).join(" / ")}`);
note(String(damageTypes(rebuke)) === "holy", "Rebuke is holy (the Light path)");
note(rebuke.system.category === "signature" && rebuke.system.resource === null, "Rebuke is a free signature");
note(rebuke.flags[MODULE_ID].pact === "light", "Rebuke carries the Light pact flag");
note(!!rebuke.system.effects.spend00000000000, "the Conviction spend rider survived the consolidation");
note(!!spLang.Rebuke.Effect_spend00000000000, "and the rider has its lang string");

console.log("\nA2) Blessed Light is a light, not an attack");
const blessed = readJson(`${SP}/abilities/blessed-light.json`);
note(!blessed.system.keywords.includes("strike"), "Blessed Light dropped the strike keyword");
note(blessed.system.keywords.includes("magic"), "and kept magic");
note(blessed.system.type === "maneuver", "it is a maneuver");
note(blessed.system.resource === null, "it costs nothing");
note(damageTiers(blessed) === null, "it has no damage effect at all");
note(blessed.system.power.roll.characteristics.length === 0, "and no power roll");
note(blessed.system.target.type === "self" && blessed.system.distance.type === "self", "self-targeted");
note(blessed.flags[MODULE_ID].tokenLight?.feet === 20, "it carries the shared tokenLight flag at 20 feet");
note(!("Tier1" in spLang.BlessedLight), "the old damage tier strings are gone from lang");
note(/20-foot bright light/.test(spLang.BlessedLight.Effect_before0000000000), "and the card says 20-foot bright light");

console.log("\nA3) Drain is Dark-pact only, and the class grants exactly one free strike");
const drain = readJson(`${SP}/abilities/drain.json`);
note(drain.flags[MODULE_ID].pact === "dark", "Drain carries the Dark pact flag");
const spClass = readJson(`${SP}/street-priest.json`);
const advancements = Object.values(spClass.system.advancements);
const idOf = entry => entry.uuid.split(".").pop();
const classSignatures = advancements.find(a => a.name === "Class Signatures");
const pactStrike = advancements.find(a => a.name === "Pact Strike");
const signatureAbilities = advancements.find(a => a.name === "Signature Abilities");
note(!!pactStrike, "the class has a Pact Strike grant");
note(pactStrike.chooseN === 1 && pactStrike.pool.length === 2, "it offers exactly one of two");
note(pactStrike.pool.map(idOf).join(",") === `${rebuke._id},${drain._id}`, "and those two are Rebuke and Drain");
note(pactStrike.sort > classSignatures.sort, "it sorts after the free class signatures");
note(classSignatures.pool.length === 3 && classSignatures.pool.map(idOf).includes(blessed._id),
  "Class Signatures is Lay On Hands + Sense the Veil + Blessed Light");
note(!classSignatures.pool.map(idOf).some(id => [rebuke._id, drain._id].includes(id)),
  "no free strike rides in the always-granted pool");
note(!signatureAbilities.pool.map(idOf).some(id => [rebuke._id, drain._id, blessed._id].includes(id)),
  "and none of the three is still an optional pick");
// 0.3.124 (A1) took Lightfall out of the pool as well, leaving Sacrificial Offer, Word of Rebuke,
// Warrior's Prayer and Wither. tools/scout-sp-wave-03124-smoke.mjs owns that lock; this only counts.
note(signatureAbilities.pool.length === 4, `the optional pool is the remaining ${signatureAbilities.pool.length}`);
note(!/Blessed Light/.test(signatureAbilities.description), "the Quick Build note no longer pushes Blessed Light");
note(/Rebuke/.test(pactStrike.description) && /Drain/.test(pactStrike.description),
  "the Pact Strike copy names both halves");

console.log("\nA3b) The live-hero swap plans one strike and only one");
note(planPactStrike({ pact: "light", held: [] }).grant === "rebuke", "a Light priest with nothing gains Rebuke");
note(planPactStrike({ pact: "dark", held: [] }).grant === "priest-drain", "a Dark priest with nothing gains Drain");
note(String(planPactStrike({ pact: "light", held: ["rebuke", "priest-drain"] }).remove) === "priest-drain",
  "a Light priest holding both loses Drain");
note(planPactStrike({ pact: "light", held: ["rebuke"] }).grant === null, "a correct sheet is left alone");
note(String(planPactStrike({ pact: "dark", held: ["smite-rebuke"] }).remove) === "smite-rebuke",
  "the retired Smite / Rebuke is stripped from pre-0.3.123 sheets");
note(RETIRED_STRIKE_DSIDS.includes("smite-rebuke"), "smite-rebuke is recorded as retired");
const noPact = planPactStrike({ pact: null, held: ["rebuke"] });
note(!noPact.grant && !noPact.remove.length, "a priest with no pact yet is untouched");
note(PACT_STRIKES.light === "rebuke" && PACT_STRIKES.dark === "priest-drain", "the pact table is Light→Rebuke, Dark→Drain");

console.log("\nA4) Lay On Hands and Sense the Veil are untouched");
const lay = readJson(`${SP}/abilities/lay-on-hands.json`);
const sense = readJson(`${SP}/abilities/sense-the-veil.json`);
note(lay.system.type === "maneuver" && lay.system.resource === null, "Lay On Hands is still a free maneuver");
note(sense.system.type === "maneuver" && sense.system.resource === null, "Sense the Veil is still a free maneuver");
note(["Tier1", "Tier2", "Tier3"].every(t => t in spLang.SenseTheVeil), "Sense the Veil keeps its three tiers");

console.log("\nA5) Minor Rebuke is Holy Smite, and it beats the free strike");
note(!existsSync(`${SP}/abilities/minor-rebuke.json`), "minor-rebuke.json is gone");
const holySmite = readJson(`${SP}/abilities/holy-smite.json`);
note(spLang.HolySmite.Name === "Holy Smite" && !("MinorRebuke" in spLang), "the card is named Holy Smite");
note(holySmite.system._dsid === "holy-smite", "its _dsid follows the rename");
note(holySmite.system.category === "heroic" && holySmite.system.resource === 1, "still a 1-Conviction heroic");
note(holySmite.system.type === "main" && holySmite.system.distance.type === "ranged", "still a ranged main action");
note(String(damageTiers(holySmite)) === String(["3 + @chr", "5 + @chr", "8 + @chr"]),
  `Holy Smite is ${damageTiers(holySmite).join(" / ")} + Persona`);
const asNumber = tiers => tiers.map(t => Number.parseInt(t, 10));
note(asNumber(damageTiers(holySmite)).every((v, i) => v > asNumber(damageTiers(rebuke))[i]),
  "and it out-damages the free Rebuke at every tier");
note(readJson(`${SP}/street-priest.json`).system.advancements.lXnIYqm2cl0bgHpT.pool.some(p => idOf(p) === holySmite._id),
  "the 1 Conviction pool still points at it");

console.log("\nA7) The Street Priest chapter matches the locks");
const spBook = read("docs/rulebook/07-street-priest.md");
note(!/Smite ?\/ ?Rebuke/.test(spBook), "no Smite / Rebuke left in the chapter");
note(/Blessed Light[\s\S]{0,400}20-foot bright light/.test(spBook), "Blessed Light is written as the light");
note(/Pact Strike/.test(spBook), "the pact strike has its own entry");
note(/Holy Smite/.test(spBook), "Holy Smite is named");
note(!/\| low \(≤11\) \| No damage\. \|/.test(spBook), "the old 'no damage on low' tier table is gone");

/* ------------------------------------------------------------------ B: Elementalist */

console.log("\nB1) Cantrip is a free fourth signature");
const cantrip = readJson(`${EL}/abilities/cantrip.json`);
note(cantrip.system._dsid === "cantrip", "src/packs/classes/elementalist/abilities/cantrip.json exists");
note(cantrip.system.category === "signature", "it is a signature");
note(cantrip.system.resource === null, "it costs no Essence");
note(damageTiers(cantrip) === null, "it has no damage effect");
note(cantrip.system.power.roll.characteristics.length === 0, "and no power roll");
note(cantrip.flags[MODULE_ID].cantrip === true, "it carries the cantrip flag the dialog keys on");
note(cantrip.flags[MODULE_ID].tokenLight?.feet === 20, "and the same 20-foot tokenLight as Blessed Light");
note(elLang.Cantrip.Name === "Cantrip", "the lang block exists");
note(/no damage, ever/i.test(elLang.Cantrip.Effect_before0000000000), "and the card says it never deals damage");

const elClass = readJson(`${EL}/elementalist.json`);
const elSignatures = Object.values(elClass.system.advancements).find(a => a.name === "Signature Abilities");
note(elSignatures.pool.length === 4, "the Signature Abilities grant is now four UUIDs");
note(elSignatures.pool.map(idOf).includes(cantrip._id), "and Cantrip is one of them");
for (const id of ["gMBcO6dBq7m3upna", "eYZFRohyNHecgwgp", "tWzky4yWGWvI9fd4"]) {
  note(elSignatures.pool.map(idOf).includes(id), `the original signature ${id} is still granted`);
}
note(/four/.test(elSignatures.description) && /Essence/.test(elSignatures.description),
  "the grant copy says four signatures and names Essence");

console.log("\nB2) The cast-time choice");
note(String(CANTRIP_MODES) === "light,other", "the dialog offers Light and Other utility");
note(planCantrip({ mode: "light" }).mode === "light", "Light resolves to the light");
note(planCantrip({ mode: "other", description: "  clean the coat  " }).description === "clean the coat",
  "a described working is trimmed and kept");
note(planCantrip({ mode: "other", description: "   " }).mode === "none",
  "an empty description is not a cast (nothing is posted)");
note(isCantrip({ type: "ability", system: { _dsid: "cantrip" } }), "isCantrip falls back to the _dsid");
note(!isCantrip({ type: "ability", system: { _dsid: "hurl-element" } }), "and does not claim other signatures");
const cantripSrc = read("scripts/cantrip.mjs");
note(/DialogV2/.test(cantripSrc), "the dialog is DialogV2");
note(/textarea name="description"/.test(cantripSrc), "with a description text box");
note(/ChatMessage\.create/.test(cantripSrc), "and the description is posted to chat");

console.log("\nB3) The Elementalist chapter carries the paragraph");
const elBook = read("docs/rulebook/06-elementalist.md");
note(/\*\*Cantrip\*\*/.test(elBook), "Cantrip is in the chapter");
note(/all four signature abilities/.test(elBook), "the signature count says four");
note(/20-foot\s+bright light/.test(elBook), "and the Light mode prints the radius");

console.log("\nA2/B2) The shared 20-foot light");
note(lightRadius(20, { units: "ft" }) === 20, "a foot-scaled scene takes 20 as printed");
note(lightRadius(20, { units: "ft.", distance: 5 }) === 20, "ft. counts as feet too");
note(lightRadius(20, { units: "sq", distance: 1 }) === 4, "a 1-unit square map gets 4 squares");
note(lightRadius(20, { units: "", distance: 2 }) === 8, "a 2-unit square map gets 8");
note(lightRadius(0, { units: "ft" }) === 0, "zero feet is no light");
const cfg = lightConfig(20);
note(cfg.bright === 20 && cfg.dim === 20, "bright equals dim: the circle ends where the card says");
note(planTokenLight({ lit: false }) === "on", "an unlit token lights up");
note(planTokenLight({ lit: true, toggle: true }) === "off", "a lit token goes out");
note(planTokenLight({ lit: true, toggle: false }) === "none", "a non-toggling light is not re-cast");
note(tokenLightSpec({ flags: { [MODULE_ID]: { tokenLight: { feet: 20 } } } })?.feet === 20, "the flag reads off a pack row");
note(tokenLightSpec({ flags: {} }) === null, "an ability without the flag is not a light");
const lightSrc = read("scripts/token-light.mjs");
note(/tokenLightPrior/.test(lightSrc), "the prior light is snapshotted so the change is reversible");
note(read("scripts/module.mjs").includes("registerTokenLight()"), "module.mjs registers the shared light");
note(read("scripts/module.mjs").includes("registerCantrip()"), "and the Cantrip dialog");
note(read("scripts/module.mjs").includes("registerPactStrike()"), "and the pact strike swap");

/* ------------------------------------------------------------------ C: the Foundry fix wave */

console.log("\nC1) Wearing armor fills the Stamina pool");
note(planStaminaAfterArmorChange({ value: 12, max: 24, donned: true }) === 24, "donning tops a wounded hero up to max");
note(planStaminaAfterArmorChange({ value: 24, max: 24, donned: true }) === null, "an already-full hero is not written");
note(planStaminaAfterArmorChange({ value: 24, max: 20, donned: false }) === 20, "removing armor clamps down to the new max");
note(planStaminaAfterArmorChange({ value: 12, max: 20, donned: false }) === null, "and never heals on the way off");
const staminaSrc = read("scripts/stamina.mjs");
note(/syncStaminaPool\(actor, \{ donned: worn \}\)/.test(staminaSrc), "setArmorWorn settles the pool");
note(/syncStaminaPool\(actor, \{ donned: touchedWorn && isWorn\(item\) \}\)/.test(staminaSrc),
  "and so does the auto-wear path through updateItem");

console.log("\nC2) Trauma Patch gives back a spent Recovery, once per combat");
const patch = readJson("src/packs/gear/general/medical/trauma-patch.json");
const patchUse = patch.flags[MODULE_ID].gear.consumableUse;
note(!!patchUse, "trauma-patch.json has a consumableUse block (it was flavour-only)");
note(patchUse.recoveries === 1, "it restores 1 Recovery");
note(patchUse.oncePerCombat === true, "once per combat");
note(patchUse.spend === true, "and the patch is still consumed");
note(/spent Recovery/i.test(lang.Gear.Items.TraumaPatch.Description), "the description says Recovery, not Stamina");
note(planRecoveryRestore({ value: 5, max: 8, restore: 1 }) === 6, "a spent Recovery comes back");
note(planRecoveryRestore({ value: 8, max: 8, restore: 1 }) === null, "a full hero gains nothing");
note(planRecoveryRestore({ value: 7, max: 8, restore: 4 }) === 8, "and you never go over your maximum");
note(planOncePerCombat({ oncePerCombat: true, combatId: "c1", usedIn: null }).record === "c1", "the first use is recorded");
note(!planOncePerCombat({ oncePerCombat: true, combatId: "c1", usedIn: "c1" }).allowed, "the second use in that fight is refused");
note(planOncePerCombat({ oncePerCombat: true, combatId: "c2", usedIn: "c1" }).allowed, "a new fight is a new allowance");
note(planOncePerCombat({ oncePerCombat: true, combatId: null, usedIn: "c1" }).allowed, "out of combat there is no gate");
const dose = planConsumableUse({
  quantity: 2, recoveriesValue: 4, recoveriesMax: 8, combatId: "c1", usedIn: null, use: patchUse,
});
note(dose.ok && dose.recoveriesValue === 5 && dose.quantityAfter === 1, "one patch: +1 Recovery, one left in the stack");
note(planConsumableUse({ quantity: 1, combatId: "c1", usedIn: "c1", use: patchUse }).reason === "usedThisCombat",
  "a second patch in the same fight is refused before anything is spent");
const consumableSrc = read("scripts/consumable-use.mjs");
note(/system\.recoveries\.value/.test(consumableSrc), "the dose writes system.recoveries.value");
note(/Hooks\.on\("deleteCombat"/.test(consumableSrc), "and the ledger is cleared when the fight ends");

console.log("\nC3) Connections pin your own hero to the top");
const roster = sortConsoleRoster([
  { name: "Nyx", isNode: false },
  { name: "Zebra Host", isNode: true, revealed: false },
  { name: "Hotel Interface", isNode: true, revealed: true },
  { name: "Vessa", isNode: false, isSelf: true },
  { name: "Kessic", isNode: false },
]);
note(roster[0].name === "Vessa", "the viewing player's own hero sorts first");
note(roster.map(r => r.name).join(",") === "Vessa,Hotel Interface,Kessic,Nyx,Zebra Host",
  "and everything else keeps the order it had");
note(compareConsoleListRows({ isSelf: true, name: "Z" }, { isNode: true, revealed: true, name: "A" }) < 0,
  "self even outranks a revealed node");
const consoleSrc = read("scripts/wired-console.mjs");
note(/export function ownHeroUuid/.test(consoleSrc), "wired-console resolves the viewing user's own hero");
note(/isSelf: !!selfUuid/.test(consoleSrc), "and stamps isSelf on its own roster row only");
note(/user\?\.character/.test(consoleSrc), "the assigned character is preferred");
note(/is-self/.test(read("templates/wired-console.hbs")), "the row is marked in the template");

console.log("\nC4/C5) Sprites: the card compiles, and Recompile rebuilds");
const spriteSrc = read("scripts/sprites.mjs");
note(/spriteCompileOnUse/.test(spriteSrc), "there is a world setting for compile-on-use");
note(/if \(ability\.system\?\._dsid === COMPILE_DSID\) await compileSprite\(caster\)/.test(spriteSrc),
  "using the Compile Sprite card compiles a sprite");
note(/await recompileSprite\(caster\)/.test(spriteSrc), "and using Recompile recompiles one");
note(/rememberDestroyed/.test(spriteSrc), "a destroyed sprite is remembered so it can be rebuilt");
note(reducedStamina(26) === 13, "a rebuilt sprite comes back on half Stamina");
note(reducedStamina(13) === 7, "rounded up");
note(reducedStamina(1) === 1, "and never at zero");
const targets = recompileTargets({
  sprites: [{ uuid: "Actor.a", name: "Data-sprite", archetype: "data" }],
  destroyed: { archetype: "attack", name: "Attack-sprite" },
});
note(targets.length === 2, "Recompile offers both a live sprite and the just-destroyed one");
note(targets[0].kind === "reshape" && targets[1].kind === "rebuild", "one to reshape, one to rebuild");
note(recompileTargets({ sprites: [], destroyed: null }).length === 0, "and nothing to offer when there is nothing");
note(recompileTargets({ sprites: [{ uuid: "x", name: "?", archetype: "bogus" }] }).length === 0,
  "an unknown archetype is not offered");
const recompileCard = readJson("src/packs/classes/technomancer/abilities/recompile.json");
note(recompileCard.system.target.custom.includes("just-destroyed"), "the card still targets a compiled or destroyed sprite");
note(/Reshape/.test(lang.Classes.Technomancer.Items.Recompile.Effect_before0000000000)
  && /Rebuild/.test(lang.Classes.Technomancer.Items.Recompile.Effect_before0000000000),
  "and its text now describes both halves instead of nothing");

/* ------------------------------------------------------------------ docs */

console.log("\nDocs) Director note and Foundry checklist");
const directorNote = read("docs/directors/sp-el-foundry-wave-03123.md");
const checklist = read("docs/directors/sp-el-foundry-wave-smoke-03123.md");
note(directorNote.length > 4000, "docs/directors/sp-el-foundry-wave-03123.md is a real note");
note(checklist.length > 2000, "docs/directors/sp-el-foundry-wave-smoke-03123.md is a real checklist");
for (const phrase of [
  "Rebuke", "Blessed Light", "Drain", "Holy Smite", "Cantrip",
  "Trauma Patch", "Compile Sprite", "Recompile", "Connections",
]) {
  note(directorNote.includes(phrase), `the note covers "${phrase}"`);
}
note(/20 \/ 20|bright.*dim|one edge/i.test(directorNote), "the note documents the bright/dim choice");
note(/never heals/i.test(directorNote), "and states that removing armor never heals");
note(read("README.md").includes("`0.3.123`"), "README has a 0.3.123 entry");

/* ------------------------------------------------------------------ report */

for (const line of ok) console.log(line);
if (fail.length) {
  console.error(`\n${fail.length} failed:`);
  for (const line of fail) console.error(`  ✗ ${line}`);
  process.exit(1);
}
console.log(`\n${ok.length} checks passed.`);
