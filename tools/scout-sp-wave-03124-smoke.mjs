#!/usr/bin/env node
/**
 * 0.3.124 smoke — Scout Conceal, Hard Tag, Street Priest cleanup, sprite size, nine pregens.
 *
 *   A1  Lightfall is out of the Street Priest signature pool, and off Vessa.
 *   A2  Sacrificial Offer is Dark Pact only: flagged on the row, filtered in chargen, stripped live.
 *   B1  Hard Tag costs 1 Advantage — it is never free.
 *   B2  Conceal is a free maneuver every Scout gets, with Cover/Conceal on middle and
 *       Cover/Conceal + Invisible on high, and the Invisible ends on a square change.
 *   C   Feral Cry deals 1 / 2 / 3, push riders unchanged.
 *   D   Every sprite template places at half a square, and compiling one writes 0.5 too.
 *   E   Pregen Names are the hero's name; the street handle opens their Biography.
 *   F   Renn Solace-Ward and Kade Orrin-Vex exist, and Kade spends all 25 Body Integrity.
 *
 * Run: node tools/scout-sp-wave-03124-smoke.mjs
 * Does not need live Foundry.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { planPactStrike, planPactOptionals, PACT_OPTIONAL_DSIDS } from "../scripts/pact-strike.mjs";
import { concealStatusesForTier, movedSquare, CONCEAL_DSID, INVISIBLE_ID } from "../scripts/conceal.mjs";
import { COVER_CONCEAL_ID } from "../scripts/cover-conceal.mjs";
import { SPRITE_TOKEN_SIZE } from "../scripts/sprites.mjs";
import { atLeast } from "./lib/module-version.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const fail = [];
const ok = [];
const note = (pass, msg) => (pass ? ok : fail).push(pass ? `  ✓ ${msg}` : msg);

const read = p => readFileSync(p, "utf8").replace(/\r\n/g, "\n");
const readJson = p => JSON.parse(read(p));

const SP = "src/packs/classes/street-priest";
const SCOUT = "src/packs/classes/scout";
const PREGENS = "src/packs/pregens";
const lang = readJson("lang/en.json").GHOSTWIRE;
const scoutLang = lang.Classes.Scout.Items;

const pregen = slug => readJson(join(PREGENS, `${slug}.json`));
const dsids = actor => actor.items.map(i => i.system?._dsid);
const gw = doc => doc.flags?.[MODULE_ID] ?? {};
const poolIds = adv => (adv.pool ?? []).map(p => p.uuid.split(".").pop());

console.log("0) Version");
note(atLeast(readJson("module.json").version, "0.3.124"), "module.json is at least 0.3.124");

/* ------------------------------------------------------------------ A: Street Priest */

console.log("\nA1) Lightfall is not an optional signature any more");
const priest = readJson(`${SP}/street-priest.json`);
const lightfall = readJson(`${SP}/abilities/lightfall.json`);
const offer = readJson(`${SP}/abilities/sacrificial-offer.json`);
const signatures = Object.values(priest.system.advancements).find(a => a.name === "Signature Abilities");
note(!!signatures, "the class still has a Signature Abilities grant");
note(!poolIds(signatures).includes(lightfall._id), "Lightfall is gone from its pool");
note(signatures.chooseN === 2 && signatures.pool.length === 4, "four options remain, still choose 2");
note(!/Lightfall/.test(signatures.description), "and the Quick Build line no longer names it");
// The row itself stays: 0.3.123 worlds and the printed book still reference it historically.
note(lightfall.system._dsid === "priest-lightfall", "the Lightfall ability JSON is kept, just ungranted");
note(!JSON.stringify(priest).includes(lightfall._id), "nothing else on the class grants it");
note(!dsids(pregen("vessa-corran-dov")).includes("priest-lightfall"), "Vessa no longer carries Lightfall");

console.log("\nA2) Sacrificial Offer is Dark Pact only");
note(offer.flags?.[MODULE_ID]?.pact === "dark", "the row carries the Dark pact flag patchPactFilter reads");
note(poolIds(signatures).includes(offer._id), "it is still an option — for a Dark priest");
note(/Dark Pact only/i.test(signatures.description), "the grant says so on the card");
note(PACT_OPTIONAL_DSIDS["sacrificial-offer"] === "dark", "pact-strike names it as a Dark-only optional");
note(String(planPactOptionals({ pact: "light", held: ["sacrificial-offer", "rebuke"] })) === "sacrificial-offer",
  "a Light priest holding it loses it");
note(!planPactOptionals({ pact: "dark", held: ["sacrificial-offer"] }).length, "a Dark priest keeps it");
note(!planPactOptionals({ pact: null, held: ["sacrificial-offer"] }).length, "a priest with no pact yet is untouched");
// It is an optional pick, so losing it never hands the priest something else.
note(planPactStrike({ pact: "light", held: ["sacrificial-offer"] }).grant === "rebuke",
  "the free-strike plan is unaffected by the optional");
const vessa = pregen("vessa-corran-dov");
note(dsids(vessa).includes("light-pact"), "Vessa is still Light pact");
note(!dsids(vessa).includes("sacrificial-offer"), "and no longer carries Sacrificial Offer");
note(dsids(vessa).includes("warriors-prayer") && dsids(vessa).includes("word-of-rebuke"),
  "her two signatures are now Warrior's Prayer and Word of Rebuke");

/* ------------------------------------------------------------------ B: Scout */

console.log("\nB1) Hard Tag costs 1 Advantage");
const quarry = readJson(`${SCOUT}/origins/hunter/quarry.json`);
note(quarry.system.resource === 1, "resource is 1, not null");
note(quarry.system.type === "maneuver", "it is still a maneuver");
note(quarry.system.effects.before0000000000, "the Marked rider is still there");
note(quarry.effects.some(e => e._id === "QR00000000marked"), "and so is the Marked effect");
note(/1 Advantage/.test(scoutLang.Quarry.Effect_before0000000000), "the card text states the cost");
note(/never free/i.test(scoutLang.Quarry.Effect_before0000000000), "and says it is never free");
note(/1 Advantage/.test(scoutLang.Quarry.Story), "the story line says so too");
note(/beyond the 1/.test(scoutLang.Quarry.Effect_spend00000000000),
  "the surge rider now buys surges with Advantage spent *beyond* the cost");

console.log("\nB2) Conceal is free for every Scout");
const conceal = readJson(`${SCOUT}/abilities/conceal.json`);
const scout = readJson(`${SCOUT}/scout.json`);
const features = Object.values(scout.system.advancements)
  .find(a => (a.name === "Features") && (a.requirements?.level === 1));
note(conceal.system._dsid === CONCEAL_DSID, `the pack row is ${CONCEAL_DSID}`);
note(conceal.system.resource === null, "it costs no Advantage");
note(conceal.system.type === "maneuver", "it is a maneuver");
note(conceal.system.target.type === "self", "targeting yourself");
note(String(conceal.system.power.roll.characteristics) === "agility", "rolled on Agility");
note(poolIds(features).includes(conceal._id), "the L1 class Features grant includes it");
note(features.chooseN == null, "which is an everyone-gets-it grant, not a choice");
note(!conceal.system.prerequisites.dsid.some(d => ["hunter", "ghost", "face-in-crowd"].includes(d)),
  "and it is gated on the class, not a subclass");
// Every Scout means every Scout: Wren is a Hunter and still has it.
note(dsids(pregen("wren-sable-corvin")).includes(CONCEAL_DSID), "Wren (Hunter) carries Conceal");

console.log("\nB2) …and its tiers apply the right statuses");
note(!concealStatusesForTier(1).length, "low: nothing happens");
note(String(concealStatusesForTier(2)) === COVER_CONCEAL_ID, "middle: Cover/Conceal only");
note(String(concealStatusesForTier(3)) === `${COVER_CONCEAL_ID},${INVISIBLE_ID}`, "high: Cover/Conceal and Invisible");
note(!concealStatusesForTier(null).length && !concealStatusesForTier("").length, "an unreadable tier applies nothing");
note(COVER_CONCEAL_ID === "ghostwire-cover-conceal", "it reuses F13's status rather than inventing a second cover");
const conceal_ = read("scripts/conceal.mjs");
note(/specialStatusEffects/.test(conceal_) && /INVISIBLE/.test(conceal_),
  "Invisible is wired to CONFIG.specialStatusEffects so Foundry actually stops drawing the token");
note(/seeInvisibility/.test(read("scripts/sights.mjs")), "and the F20 optics that see through it already exist");
note(conceal.effects.some(e => String(e.statuses) === COVER_CONCEAL_ID), "the card carries a Cover/Conceal effect");
note(conceal.effects.some(e => String(e.statuses) === INVISIBLE_ID), "and an Invisible effect");
note(read("scripts/module.mjs").includes("registerConceal()"), "module.mjs registers it");

console.log("\nB2) …and moving drops the Invisible, never the Cover/Conceal");
note(movedSquare({ from: { x: 0, y: 0 }, to: { x: 100, y: 0 }, grid: 100 }), "one square across is a move");
note(movedSquare({ from: { x: 0, y: 0 }, to: { x: 0, y: 100 }, grid: 100 }), "one square down is a move");
note(!movedSquare({ from: { x: 10, y: 10 }, to: { x: 40, y: 60 }, grid: 100 }), "a nudge inside the same square is not");
note(!movedSquare({ from: { x: 0, y: 0 }, to: { x: 0, y: 0 }, grid: 100 }), "and standing still is not");
note(!movedSquare({ from: null, to: { x: 100, y: 0 } }), "a missing coordinate reads as no move");
note(/dropInvisible/.test(conceal_) && !/COVER_CONCEAL_ID, \{ active: false \}/.test(conceal_),
  "dropInvisible only ever switches off the Invisible");
note(/preUpdateToken/.test(conceal_), "the old coordinates are read in preUpdateToken");
note(/Tier3/.test(JSON.stringify(conceal.system.power.effects)), "the card prints all three tiers");
for (const [tier, phrase] of [["Tier1", "Nothing happens"], ["Tier2", "Cover/Conceal"], ["Tier3", "Invisible"]])
  note(scoutLang.Conceal[tier].includes(phrase), `${tier} reads "${phrase}"`);
note(/until you move/i.test(scoutLang.Conceal.Tier3), "and the high tier says the Invisible ends when you move");

/* ------------------------------------------------------------------ C: Changer */

console.log("\nC) Feral Cry is 1 / 2 / 3");
const feralCry = readJson("src/packs/origins/changer/feral-cry-ability.json");
const cryDamage = Object.values(feralCry.system.power.effects).find(e => e.type === "damage");
note(["tier1", "tier2", "tier3"].map(t => cryDamage.damage[t].value).join("/") === "1/2/3", "damage is 1 / 2 / 3");
const cryForced = Object.values(feralCry.system.power.effects).find(e => e.type === "forced");
note(!!cryForced, "the forced-movement effect survives");
note(JSON.stringify(cryForced ?? {}).includes("push"), "and it is still a push");
// The two Changer pregens embed their own copy; a stale one would print the old numbers at the table.
for (const slug of ["wren-sable-corvin", "vira-kellis-nade"]) {
  const embedded = pregen(slug).items.find(i => i.system?._dsid === "feral-cry" && i.type === "ability");
  const tiers = Object.values(embedded?.system?.power?.effects ?? {}).find(e => e.type === "damage");
  note(["tier1", "tier2", "tier3"].map(t => tiers?.damage?.[t]?.value).join("/") === "1/2/3",
    `${slug}'s embedded copy reads 1 / 2 / 3`);
}

/* ------------------------------------------------------------------ D: sprites */

console.log("\nD) Sprites are half a square");
note(SPRITE_TOKEN_SIZE === 0.5, "the compile path's constant is 0.5");
const spriteDir = "src/packs/summons/sprites";
const sprites = readdirSync(spriteDir).filter(f => f.endsWith(".json") && f !== "_folder.json");
// 0.3.139 (A): the Special Sprite bands joined the folder. The half-square lock is about the
// twelve archetype templates this wave shipped, so they are counted by name rather than by
// folder size — a future sprite must not quietly turn this assertion off.
const archetypeSprites = sprites.filter(f => !f.startsWith("sprite-special-"));
note(archetypeSprites.length === 12, `all twelve archetype templates present (${archetypeSprites.length})`);
note(sprites.length === 15, `…plus the three Special Sprite bands (${sprites.length})`);
for (const file of sprites) {
  const t = readJson(join(spriteDir, file)).prototypeToken;
  note(t.width === 0.5 && t.height === 0.5, `${file.replace(/\.json$/, "")} is ${t.width}×${t.height}`);
}
const spritesSrc = read("scripts/sprites.mjs");
note(/"prototypeToken\.width": SPRITE_TOKEN_SIZE/.test(spritesSrc), "compileSprite writes the width");
note(/"prototypeToken\.height": SPRITE_TOKEN_SIZE/.test(spritesSrc), "and the height");
note(!/prototypeToken\.(width|height)":\s*1\b/.test(spritesSrc), "and nothing forces either back to 1");

/* ------------------------------------------------------------------ E: nicknames */

console.log("\nE) Street names are in the Biography, not the Name");
const NICKNAMES = {
  Barak: ["Barak Voss-Hallor", "the Foreman"],
  Kaes: ["Kaïs Vahn-Estal", "the Static Saint"],
  Kessic: ["Kessic Draye", "Null"],
  Sabbat: ["Sabbat Vane", "the Dead Frequency"],
  Vessa: ["Vessa Corran-Dov", "the Preacher of Ninth"],
  Vira: ["Vira Kellis-Nade", "the Warren-Wire"],
  Wren: ["Wren Sable-Corvin", "the Kite"],
  Renn: ["Renn Solace-Ward", "Patchwire"],
  Kade: ["Kade Orrin-Vex", "Hardframe"],
};
const actorsLang = lang.Pregens.Actors;
note(Object.keys(actorsLang).length === 9, `nine pregens in lang (${Object.keys(actorsLang).length})`);
for (const [key, [name, handle]] of Object.entries(NICKNAMES)) {
  const row = actorsLang[key];
  note(row?.Name === name, `${key}: Name is "${name}"`);
  note(!row?.Name.includes("—") && !row?.Name.includes("“"), `${key}: no em dash, no quotes in the Name`);
  note(row?.Description.startsWith(`Street name: “${handle}.”`), `${key}: the Biography opens with "${handle}"`);
}
note(/The Nine/.test(lang.Pregens.Journals.Fiction), "the fiction journal is The Nine");
const fiction = readJson("src/packs/pregen-fiction/pregen-fiction.json");
note(fiction.pages.length === 10, `one index page plus nine stories (${fiction.pages.length})`);
note(fiction.pages[0].name === "The Nine", "the index page is titled The Nine");
note(/\| Story \| Hero \| Street name \|/.test(fiction.pages[0].text.markdown),
  "and it lists the street name in its own column, not fused into the hero's name");

/* ------------------------------------------------------------------ F: the two new pregens */

console.log("\nF) Renn Solace-Ward and Kade Orrin-Vex");
const files = readdirSync(PREGENS).filter(f => f.endsWith(".json"));
note(files.length === 9, `nine pregen actors (${files.length})`);

const renn = pregen("renn-solace-ward");
note(renn.items.find(i => i.type === "ancestry")?.system._dsid === "pure-human", "Renn is Pure Human");
note(renn.items.find(i => i.type === "class")?.system._dsid === "medic", "a Medic");
note(renn.items.find(i => i.type === "subclass")?.system._dsid === "medic-street-doc", "of the Street-Doc specialization");
note(renn.items.find(i => i.type === "kit")?.system._dsid === "gunslinger", "with the class's own Quick Build kit");
note(renn.items.find(i => i.type === "career")?.system._dsid === "street-doc", "and a Street Doc career");
note(renn.items.find(i => i.type === "class")?.system.level === 1, "built at Level 1");
for (const dsid of ["first-aid", "administer-dose", "diagnose"])
  note(dsids(renn).includes(dsid), `Renn knows ${dsid}`);
note(["trauma-patch", "field-surgery-kit", "slap-doc-kit"].every(d => dsids(renn).includes(d)), "and carries the bag");
note(gw(renn).integrity.max === 20 && gw(renn).biSpent === 0, "Body Integrity 20/20 — no chrome");

const kade = pregen("kade-orrin-vex");
note(kade.items.find(i => i.type === "ancestry")?.system._dsid === "cyborg", "Kade is a Cyborg");
note(kade.items.find(i => i.type === "class")?.system._dsid === "operator", "an Operator");
note(kade.items.find(i => i.type === "subclass")?.system._dsid === "corp-milspec", "of the Corp-Milspec origin");
note(kade.items.find(i => i.type === "kit")?.system._dsid === "warframe", "wearing the Warframe kit");
note(kade.items.find(i => i.type === "class")?.system.level === 1, "built at Level 1");
note(dsids(kade).includes("cortical-firewall") && dsids(kade).includes("arcane-severance"),
  "with both Cyborg signature traits");

console.log("\nF2 ADDENDUM) all 25 Body Integrity, spent");
const CHROME = {
  "wired-reflexes": 6, "cyberlimb-arm": 5, "muscle-bone-lacing": 5,
  "dermal-plating": 4, "cyber-eyes": 2, "cyber-ears": 2, datajack: 1,
};
let spent = 0;
for (const [dsid, bi] of Object.entries(CHROME)) {
  const item = kade.items.find(i => i.system?._dsid === dsid);
  const chrome = item?.flags?.[MODULE_ID]?.chrome;
  note(!!item && (chrome?.integrity === bi), `${dsid}: ${bi} BI`);
  note(chrome?.grade === "standard", `${dsid} is Standard grade — no soft substitution`);
  spent += bi;
}
note(spent === 25, `the table totals 25 (${spent})`);
note(gw(kade).biSpent === 25, "biSpent is 25");
note(gw(kade).biRemaining === 0, "biRemaining is 0 — nothing left over");
note(gw(kade).integrity.max === 25, "integrity.max is 25, the Cyborg start");
note(gw(kade).integrity.value === 0, "integrity.value is 0");
note(read("scripts/module.mjs").includes("CYBORG_INTEGRITY_START"),
  "and the runtime already knows a Cyborg starts at 25");
const loadouts = readJson("docs/masters/pregens/loadouts.json");
note(loadouts["kade-orrin-vex"].biTotal === 25, "loadouts.json agrees");
note(loadouts["kade-orrin-vex"].chrome.length === 7, "with seven chrome rows");
note(!JSON.stringify(loadouts["kade-orrin-vex"].chrome).includes("-soft"), "and not one of them is Soft grade");

console.log("\nF3) Both are in the pack and the fiction");
note(gw(renn).pregen === "renn-solace-ward" && gw(kade).pregen === "kade-orrin-vex", "both carry the pregen flag");
note(renn.system.hero.wealth === 250 && kade.system.hero.wealth === 250, "both start on ¥250 like their siblings");
note(renn.system.hero.renown === 1 && kade.system.hero.renown === 1, "both at renown 1");
note(renn.system.biography.languages.includes("TradeCant"), "Renn has free Trade Cant");
note(kade.system.biography.languages.includes("TradeCant"), "Kade has free Trade Cant");
note(fiction.pages.some(p => p.name === "The Folding Table"), "Renn has an origin story");
note(fiction.pages.some(p => p.name === "No Offboarding Scrub"), "Kade has an origin story");

/* ------------------------------------------------------------------ G: docs */

console.log("\nG) The book says all of it");
const scoutBook = read("docs/raw/13-scout.md");
note(/Conceal is free, and every Scout has it/.test(scoutBook), "the Scout chapter gives Conceal to everybody");
note(/Cost: 1 Advantage/.test(scoutBook), "and prices Hard Tag");
const changerBook = read("docs/raw/05-ancestries.md");
note(/\*\*≤11:\*\* 1 damage · \*\*12–16:\*\* 2 damage, push 1 · \*\*17\+:\*\* 3 damage, push 2/.test(changerBook),
  "the Changer chapter prints 1 / 2 / 3 with the pushes intact");
const priestBook = read("docs/raw/18-street-priest.md");
note(/Lightfall is no longer one of the options/.test(priestBook), "the Street Priest chapter drops Lightfall");
note(/Sacrificial Offer is Dark Pact only/.test(priestBook), "and locks Sacrificial Offer to the Dark pact");
note(read("README.md").includes("`0.3.124`"), "README has a 0.3.124 entry");
note(read("docs/directors/03124-smoke.md").length > 400, "the director smoke checklist exists");

/* ------------------------------------------------------------------ report */

for (const line of ok) console.log(line);
if (fail.length) {
  console.error(`\n${fail.length} failed:`);
  for (const line of fail) console.error(`  ✗ ${line}`);
  process.exit(1);
}
console.log(`\n${ok.length} checks passed.`);
