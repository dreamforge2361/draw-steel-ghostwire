#!/usr/bin/env node
/**
 * 0.3.132 wave smoke — locks A–G.
 *
 * Every lock in this wave is a *decision* that used to be missing: a classifier that said nothing, a
 * maneuver that refused nothing, a picker that asked nothing, a summon with no way home, a card that
 * printed "choose" and chose nothing, a marker with no encounter around it. Decisions are exactly
 * what a Node smoke can check, so the assertions here are almost all against real exported functions
 * rather than against source text — the source greps that remain are for the handful of claims that
 * only exist inside a Foundry hook.
 *
 * Run: `node tools/wave-03132-smoke.mjs`
 */
import { existsSync, readFileSync } from "node:fs";

import { atLeast } from "./lib/module-version.mjs";

import {
  NO_HIT_FX_DSIDS, TECH_BOLT_KEYWORD, classifyHit, hasDamageEffect,
} from "../scripts/hit-fx.mjs";
import { VEIL_SUMMON_DSIDS, COMPANIONS } from "../scripts/veil-summons.mjs";
import { markSpecFor, markUseGate, squaresApart } from "../scripts/mark.mjs";
import { ammoCostForDsid, ammoGunOptions, needsGunPick, pickAmmoGunPlan } from "../scripts/ammo.mjs";
import {
  DISMISS_DSIDS, DISMISS_SPECS, dismissPlan, wantsDismissAbility,
} from "../scripts/dismiss-abilities.mjs";
import {
  ATTUNED_DSIDS, ATTUNEMENT_TYPES, COMPANION_ELEMENTS, SHAPING_MODES,
  companionNeedsChoice, damageTypeUpdate, shapingValue,
} from "../scripts/elementalist.mjs";
import { flankedMarkerAllowed } from "../scripts/flanking.mjs";

const fail = [];
const note = (pass, msg) => { if (pass) console.log(`  ✓ ${msg}`); else { fail.push(msg); console.log(`  ✗ ${msg}`); } };

const read = path => readFileSync(path, "utf8").replace(/\r\n/g, "\n");
const readJson = path => JSON.parse(read(path));
/** Source with every comment line dropped — a header that *names* a thing is not the thing. */
const code = text => text.split("\n").filter(line => !/^\s*(\/\/|\*|\/\*)/.test(line)).join("\n");

const manifest = readJson("module.json");
const lang = readJson("lang/en.json");
const hitFxCode = code(read("scripts/hit-fx.mjs"));
const markCode = code(read("scripts/mark.mjs"));
const ammoCode = code(read("scripts/ammo.mjs"));
const flankingCode = code(read("scripts/flanking.mjs"));
const dismissCode = code(read("scripts/dismiss-abilities.mjs"));
const elementalistCode = code(read("scripts/elementalist.mjs"));
const moduleCode = code(read("scripts/module.mjs"));

/** A `GHOSTWIRE.*` key that actually resolves in lang/en.json. */
function langHas(dotted) {
  let node = lang;
  for (const part of dotted.split(".")) {
    if (!node || typeof node !== "object" || !(part in node)) return false;
    node = node[part];
  }
  return typeof node === "string";
}

console.log("0.3.132 wave smoke\n");

/* ================================================================ A — hit FX classify / suppress */

console.log("A1) Kinetic Driver: a tech ranged strike is a bolt");

{
  const kineticDriver = readJson("src/packs/origins/cyborg/kinetic-driver-ability.json").system;
  note(kineticDriver.keywords.includes(TECH_BOLT_KEYWORD) && kineticDriver.keywords.includes("ranged")
    && kineticDriver.keywords.includes("strike"),
    "the pack row still reads tech / ranged / strike (the whole reason it was invisible)");
  note(hasDamageEffect(kineticDriver) === true, "and it really does roll damage");
  note(classifyHit({
    dsid: kineticDriver._dsid,
    keywords: kineticDriver.keywords,
    distanceType: kineticDriver.distance.type,
    damaging: hasDamageEffect(kineticDriver),
  }) === "spell", "so Kinetic Driver classifies as `spell` and draws a bolt origin→target");
}
note(classifyHit({ keywords: ["tech", "ranged"], distanceType: "ranged", damaging: false }) === null,
  "a tech ranged *non*-strike (a drone deploy) is still nothing");
note(classifyHit({ keywords: ["tech"], distanceType: "self", damaging: null }) === null,
  "and a tool bag is still nothing");

console.log("\nA2) Summons, self workings and utilities draw nothing");

for (const dsid of VEIL_SUMMON_DSIDS) {
  note(NO_HIT_FX_DSIDS.includes(dsid), `${dsid} is on the suppression list`);
}
note(COMPANIONS.every(dsid => NO_HIT_FX_DSIDS.includes(dsid)),
  "including all three companions — the Zephyr bolt Michael saw");
note(classifyHit({
  dsid: "zephyr-companion", keywords: ["magic", "melee", "strike"], distanceType: "ranged", damaging: true,
}) === null, "Zephyr Companion draws nothing even though its strike really does roll damage");
note(classifyHit({
  dsid: "read-the-weave", keywords: ["magic"], distanceType: "self", damaging: false,
}) === null, "Read the Weave draws nothing");
note(classifyHit({
  dsid: "elemental-shaping", keywords: ["magic", "ranged"], distanceType: "ranged", damaging: false,
}) === null, "Elemental Shaping draws nothing from the classifier (its burst mode asks for its own)");
note(classifyHit({
  dsid: "blessed-light", keywords: ["magic"], distanceType: "self", damaging: false,
}) === null, "Blessed Light draws nothing");
note(classifyHit({ keywords: ["magic", "ranged"], distanceType: "ranged", damaging: false }) === null,
  "and so does any magic ability with no strike keyword and no damage effect");
note(classifyHit({
  dsid: "holy-smite", keywords: ["magic", "ranged", "strike"], distanceType: "ranged", damaging: true,
}) === "spell", "while a real ranged magic strike is still a spell");
note(/const NO_HIT_FX_DSIDS/.test(hitFxCode) && /\.\.\.VEIL_SUMMON_DSIDS/.test(hitFxCode),
  "the summon half of the list is imported from veil-summons.mjs, not copied");
note(!/game\.user\.targets\.clear|releaseTarget|setTarget\(false/.test(hitFxCode),
  "and hit-fx still never clears anybody's targets (Michael's lock)");

console.log("\nA3) 0.3.127–0.3.131 gear paths are untouched");

note(classifyHit({ range: "Medium", ammoFamily: "handgun" }) === "gun", "a weapon that eats rounds is a gun");
note(classifyHit({ range: "Adjacent" }) === "melee", "an Adjacent-band weapon is melee");
note(classifyHit({ thrownBlast: true }) === "grenade", "a thrown Blast is a grenade");
note(classifyHit({ gunAbility: ammoCostForDsid("double-tap") > 0 }) === "gun", "Double Tap is still a gun");
note(classifyHit({ range: "Short", keywords: ["ranged", "strike", "weapon"] }) === null, "and a bow is still nobody's business");
note(hasDamageEffect(undefined) === null && hasDamageEffect({ power: {} }) === null,
  "`damaging` is tri-state: unknown reads null, so an old caller keeps 0.3.131 behaviour");
note(classifyHit({ keywords: ["magic", "ranged"], damaging: null }) === "spell",
  "and an unknown-damage magic ability still classifies rather than going silent");

/* ================================================================ B — Spot Target */

console.log("\nB) Spot Target refuses before the card, and lands without one");

{
  const spec = markSpecFor("aid-attack");
  note(!!spec?.requires, "the aid-attack spec carries a requirement");
  note(spec.requires.enemy === true, "which is an enemy");
  note(spec.requires.reach === 1, "adjacent — reach 1");
  const card = readJson("src/packs/abilities/spot-target.json").system;
  note((card.distance.type === "melee") && (String(card.distance.primary) === "1"),
    "and that reach is the card's own melee / primary 1, not a number invented in code");
  note(card.target.type === "enemy", "and the card's target type really is enemy");

  note(markUseGate({ spec, rows: [] }).reason === "noTarget", "no target at all refuses");
  note(markUseGate({ spec, rows: [{ isEnemy: false, apart: 1 }] }).reason === "notEnemy",
    "an adjacent ally refuses");
  note(markUseGate({ spec, rows: [{ isEnemy: true, apart: 4 }] }).reason === "notAdjacent",
    "an enemy across the room refuses");
  note(markUseGate({ spec, rows: [{ isEnemy: true, apart: 1 }] }).ok === true, "an adjacent enemy passes");
  note(markUseGate({ spec, rows: [{ isEnemy: true, apart: 0 }] }).ok === true,
    "and so does one sharing a square (a Medium-2 body measured from its nearest square)");
  {
    const picked = markUseGate({
      spec, rows: [{ name: "far", isEnemy: true, apart: 6 }, { name: "near", isEnemy: true, apart: 1 }],
    }).picked.map(row => row.name);
    note((picked.length === 1) && (picked[0] === "near"),
      "one legal pick beside an illegal one marks only the legal one");
  }
  for (const dsid of ["you", "quarry", "mark", "spotter-lock"]) {
    note(markUseGate({ spec: markSpecFor(dsid), rows: [] }).ok === true,
      `${dsid} has no requirement and is unchanged`);
  }
}
note(squaresApart({ x: 0, y: 0 }, { x: 100, y: 0 }, 100) === 1, "squaresApart: neighbours are 1 apart");
note(squaresApart({ x: 0, y: 0 }, { x: 100, y: 100 }, 100) === 1, "and diagonals count");
note(squaresApart({ x: 0, y: 0, width: 2, height: 2 }, { x: 200, y: 0 }, 100) === 1,
  "and a Medium-2 token is measured from its nearest square");
{
  const gate = markCode.indexOf("markUseGate({ spec, rows: gateRows(actor, targetTokens) })");
  const roll = markCode.indexOf("const message = await use.call(this, config, dialogOptions, messageOptions);");
  note((gate > 0) && (roll > gate), "the refusal runs before Draw Steel's use() is ever called");
}
note(/if \(!actor\) return message;/.test(markCode) && !/if \(!message \|\| !actor\) return message;/.test(markCode),
  "and a mark no longer needs a message to land (empty-power maneuvers hand back null)");
for (const key of ["noTarget", "notEnemy", "notAdjacent"]) {
  note(langHas(`GHOSTWIRE.Mark.Notify.Refuse.${key}`), `the ${key} refusal has copy`);
}

/* ================================================================ C — the gun picker */

console.log("\nC) One gun guesses, two guns ask");

note(needsGunPick({ guns: [] }) === false, "no gun asks nothing");
note(needsGunPick({ guns: [{ id: "a" }] }) === false, "one gun asks nothing");
note(needsGunPick({ guns: [{ id: "a" }, { id: "b" }] }) === true, "two guns ask");
{
  const rows = ammoGunOptions({
    guns: [{ id: "a", name: "Workhorse", loaded: 1 }, { id: "b", name: "Streetsweeper", loaded: 8 }],
    cost: 2,
  });
  note(rows[0].name === "Streetsweeper", "the picker lists the fullest gun first");
  note(rows.length === 2, "and lists the one that cannot pay rather than hiding it");
  note((rows[1].able === false) && (rows[1].needed === 2), "flagged as short, with the cost it could not meet");
  note(rows.every(row => Number.isInteger(row.loaded)), "and every row carries its loaded rounds");
}
note(ammoCostForDsid("controlled-pair") === 2 && ammoCostForDsid("suppressing-fire") === 5
  && ammoCostForDsid("breach-and-clear") === 1,
  "the 0.3.128 ability costs are untouched");
note(pickAmmoGunPlan({ guns: [{ id: "a", name: "Workhorse", loaded: 0 }], cost: 2 }).reason === "empty",
  "an empty magazine still refuses");
note(pickAmmoGunPlan({ guns: [{ id: "a", name: "Workhorse", loaded: 1 }], cost: 2 }).reason === "short",
  "and a short one still refuses, before the roll");
{
  const ask = ammoCode.indexOf("gun = await promptAmmoGun(actor, this.parent, actor, spend.guns, spend.cost);");
  const roll = ammoCode.lastIndexOf("const message = await use.call(this, config, dialogOptions, messageOptions);");
  note((ask > 0) && (roll > ask), "the hero's picker opens before the roll");
  note(/!spend\.pick\?\.reason && needsGunPick/.test(ammoCode),
    "and never opens when no gun can pay — that refusal needs no dialog");
  note(/promptAmmoGun\(actor, this\.parent, platform, platformGuns, 1\)/.test(ammoCode),
    "Rigged Fire asks the same question of a two-gun platform");
  note(/const fireGun = gunForAbility\(this\.parent, actor\);/.test(ammoCode),
    "and a spawned Fire <gun> still names its own gun, so fromGearId never reaches the picker");
}
for (const key of ["Title", "Hint", "Gun", "Confirm", "Option", "OptionShort"]) {
  note(langHas(`GHOSTWIRE.Ammo.Pick.${key}`), `the picker's ${key} copy exists`);
}

/* ================================================================ D — dismiss / decompile */

console.log("\nD) Every summon has a way home, on the Abilities tab");

note(DISMISS_DSIDS.length === 3, "three dismiss abilities ship");
for (const spec of Object.values(DISMISS_SPECS)) {
  note(spec.dsid.startsWith("gw-"), `${spec.dsid} is a Ghostwire row, prefixed like gw-reload`);
  note(NO_HIT_FX_DSIDS.includes(spec.dsid), `and ${spec.dsid} never draws a hit beat`);
  note(langHas(`${spec.lang}.Name`) && langHas(`${spec.lang}.Story`)
    && langHas(`${spec.lang}.Effect_before0000000000`), `${spec.dsid} has a name, a story and rules text`);
}
note(wantsDismissAbility({ spec: DISMISS_SPECS.sprite, classDsid: "technomancer", dsids: ["compile-sprite"] }),
  "a Technomancer with Compile Sprite gets Decompile Sprite");
note(!wantsDismissAbility({ spec: DISMISS_SPECS.sprite, classDsid: "technomancer", dsids: [] }),
  "one without it does not");
note(!wantsDismissAbility({ spec: DISMISS_SPECS.sprite, classDsid: "hacker", dsids: ["compile-sprite"] }),
  "and a Hacker holding a copy never does");
note(wantsDismissAbility({ spec: DISMISS_SPECS.elemental, classDsid: "elementalist", dsids: ["zephyr-companion"] }),
  "a Stormcaller with only a companion still gets Dismiss Elemental");
note(wantsDismissAbility({ spec: DISMISS_SPECS.elemental, classDsid: "elementalist", dsids: ["summon-elemental"] }),
  "and so does one with Summon Elemental");
note(wantsDismissAbility({ spec: DISMISS_SPECS.spirit, classDsid: "street-priest", dsids: ["invoke-the-pact"] }),
  "a Street Priest with Invoke the Pact gets Dismiss Spirit");
note(dismissPlan({ count: 0 }).mode === "none", "nothing out: refuse");
note(dismissPlan({ count: 1 }).mode === "one", "one out: no question, exactly as Decompile Agent behaves");
note(dismissPlan({ count: 3 }).mode === "choose", "three out: pick one or all");
note(/decompileSprite, decompileAll|decompileAll, decompileSprite/.test(dismissCode)
  || /import \{ compiledSprites, decompileAll, decompileSprite \}/.test(dismissCode),
  "it drives the existing sprite engine rather than a second copy of it");
note(/dismissAllVeil, dismissVeil, veilSummons/.test(dismissCode),
  "and the existing Veil engine for elementals and spirits");
note(/registerDismissAbilities\(\);/.test(moduleCode), "module.mjs registers it");
{
  // The Hacker's own decompile is the model the other three copy; it must still be granted.
  const hacker = readJson("src/packs/classes/hacker/hacker.json").system.advancements;
  const agents = Object.values(hacker).find(adv => adv.name === "Agents");
  const ids = (agents?.pool ?? []).map(row => row.uuid.split(".").pop());
  note(ids.includes("bwJwQXSsAdo6de3U"), "Decompile Agent is still granted beside Compile Agent");
  note(readJson("src/packs/classes/hacker/abilities/decompile-agent.json").system._dsid === "decompile-agent",
    "and its pack row is unchanged");
}
{
  // The reason these are synced rather than granted: two of the three pools are player choices.
  for (const [cls, name] of [["elementalist", "Base Band Heroic Ability"], ["street-priest", "7 Conviction Ability"]]) {
    const adv = Object.values(readJson(`src/packs/classes/${cls}/${cls}.json`).system.advancements)
      .find(row => row.name === name);
    note(adv?.chooseN === 1, `${cls}'s summon lives in a chooseN:1 pool, so a free maneuver must not go in it`);
  }
}

/* ================================================================ E — Elementalist choices */

console.log("\nE) The Elementalist's printed choices");

note(SHAPING_MODES.join(",") === "damage,slide,shift", "Elemental Shaping has the card's three modes, in its order");
note(shapingValue({ mode: "damage", tier: 1 }) === 2 && shapingValue({ mode: "damage", tier: 2 }) === 4
  && shapingValue({ mode: "damage", tier: 3 }) === 6, "burst is 2 / 4 / 6, verbatim");
note(shapingValue({ mode: "slide", tier: 1 }) === 1 && shapingValue({ mode: "slide", tier: 3 }) === 3,
  "slide is 1 / 2 / 3");
note(shapingValue({ mode: "shift", tier: 2 }) === 2, "shift is 1 / 2 / 3");
note(shapingValue({ mode: "damage", tier: 2, spend: 3 }) === 7,
  "and each Essence spent adds 1 to whichever mode was chosen");
note(shapingValue({ mode: "shift", tier: 0 }) === 0 && shapingValue({ mode: "nonsense", tier: 2 }) === 0,
  "an unrolled tier or an unknown mode is 0, not a throw");
note(ATTUNEMENT_TYPES.join(",") === "acid,cold,corruption,fire,lightning,poison,sonic",
  "attunement offers exactly the seven types Hurl Element's text lists");
for (const type of ATTUNEMENT_TYPES) {
  note(langHas(`GHOSTWIRE.Summons.Veil.UI.Types.${type}`), `${type} has a label`);
}
note(ATTUNED_DSIDS.includes("hurl-element"), "Hurl Element follows attunement");
{
  // Every listed ability must actually have an untyped damage effect to re-type.
  const paths = {
    "hurl-element": "abilities/hurl-element.json",
    "bolt-barrage": "abilities/bolt-barrage.json",
    "difficult-ground": "abilities/difficult-ground.json",
    "elemental-wall": "abilities/elemental-wall.json",
    "conflagration-tempest": "abilities/conflagration-tempest.json",
    "elemental-convergence": "abilities/elemental-convergence.json",
    "void-vortex": "abilities/void-vortex.json",
    "world-fissure": "abilities/world-fissure.json",
    cataclysm: "abilities/cataclysm.json",
  };
  note(Object.keys(paths).length === ATTUNED_DSIDS.length, "every attuned dsid is accounted for here");
  for (const dsid of ATTUNED_DSIDS) {
    const system = readJson(`src/packs/classes/elementalist/${paths[dsid]}`).system;
    note(system._dsid === dsid, `${dsid}: the pack row is where the list says it is`);
    note(hasDamageEffect(system) === true, `${dsid}: it has damage to type`);
    note(damageTypeUpdate(system, "fire") !== null, `${dsid}: and attuning to fire really re-types it`);
  }
  // A Pyromancer's Solar Lance is fire whatever you are attuned to: origin abilities are left alone.
  const solar = readJson("src/packs/classes/elementalist/origins/pyromancer/solar-lance.json").system;
  note(!ATTUNED_DSIDS.includes(solar._dsid), "Solar Lance is not on the list");
  note(damageTypeUpdate(solar, "fire") === null, "and is already fire, so nothing would re-type it anyway");
}
note(damageTypeUpdate({ power: { effects: {} } }, "fire") === null, "an ability with no damage is left alone");
note(damageTypeUpdate({ power: { effects: { a: { type: "damage", damage: { tier1: { types: [] } } } } } }, "plaid") === null,
  "and a type that is not an attunement is refused");
note(companionNeedsChoice("zephyr-companion") && companionNeedsChoice("boulder-companion"),
  "Zephyr and Boulder ask which element");
note(!companionNeedsChoice("ember-companion"),
  "Ember does not — its card offers no choice, and inventing one would be inventing RAW");
note(COMPANION_ELEMENTS["zephyr-companion"].join(",") === "cold,lightning,sonic",
  "Zephyr's three are the three its card prints");
note(COMPANION_ELEMENTS["boulder-companion"].join(",") === "acid,corruption", "and Boulder's two are Boulder's two");
{
  const zephyr = readJson("src/packs/classes/elementalist/origins/stormcaller/zephyr-companion.json").system;
  note(hasDamageEffect(zephyr) === true, "Zephyr's strike has a damage effect to type");
  note(damageTypeUpdate(zephyr, "sonic") !== null, "and choosing sonic types it");
  const ember = readJson("src/packs/classes/elementalist/origins/pyromancer/ember-companion.json").system;
  note(damageTypeUpdate(ember, "fire") === null, "while Ember's is already fire");
}
{
  const mode = elementalistCode.indexOf("const mode = await choose(");
  const roll = elementalistCode.indexOf("const message = await use.call(model, config, dialogOptions, messageOptions);");
  note((mode > 0) && (roll > mode), "the Shaping mode is chosen before the roll, as the card says");
}
note(/registerElementalist\(\);/.test(moduleCode), "module.mjs registers it");
for (const key of ["Shaping.Title", "Shaping.Prompt", "Shaping.Damage", "Shaping.Slide", "Shaping.Shift",
  "Shaping.NoTarget", "Attunement.Title", "Attunement.Prompt", "Attunement.Companion"]) {
  note(langHas(`GHOSTWIRE.Summons.Veil.UI.${key}`), `the ${key} copy exists`);
}

/* ================================================================ F — Flanked is combat-only */

console.log("\nF) Flanked is an encounter marker");

note(flankedMarkerAllowed({ combatStarted: false, tokenInCombat: false }) === false, "out of combat: no marker");
note(flankedMarkerAllowed({ combatStarted: false, tokenInCombat: true }) === false,
  "a combatant with no started encounter: still no marker");
note(flankedMarkerAllowed({ combatStarted: true, tokenInCombat: false }) === false,
  "a bystander inside a running encounter: no marker");
note(flankedMarkerAllowed({ combatStarted: true, tokenInCombat: true }) === true, "a combatant in a round: marker");
note(/const combat = liveCombat\(\);\n  if \(!combat\) return ids;/.test(flankingCode),
  "flankedTokenIds returns empty out of combat, so the sweep clears stale markers rather than skipping them");
note(/game\.combat\?\.started \? game\.combat : null/.test(flankingCode), "and `started` is the test, not merely `game.combat`");
note(/inCombat\(token, combat\)/.test(flankingCode), "attackers have to be in the encounter too");
for (const hook of ["combatStart", "deleteCombat", "createCombatant", "deleteCombatant"]) {
  note(new RegExp(`Hooks\\.on\\("${hook}", scheduleSync\\)`).test(flankingCode), `the marker syncs on ${hook}`);
}
note(/if \(!abilityIsMeleeStrike\(this\)\) return modifiers;/.test(flankingCode),
  "and the roll edge is untouched — this wave moved the icon, not the rule");

/* ================================================================ G — ship hygiene */

console.log("\nG) Version, docs and wiring");

// 0.3.133: this was an exact-equality check, so it went red the moment the module was bumped —
// exactly the trap tools/lib/module-version.mjs exists to close. Every other wave smoke uses
// `atLeast`; this one now does too.
note(atLeast(manifest.version, "0.3.132"), `module.json is ${manifest.version}`);
note(/`0\.3\.132`/.test(read("README.md")), "README has a 0.3.132 entry");
note(existsSync("docs/directors/03132-smoke.md"), "the Foundry checklist is written");
// The per-wave result doc (`_claude-03132-result.md`) is deliberately NOT asserted: `_claude-*` is
// gitignored, so it exists on the machine that wrote it and in no clone. The committed artifact is
// the checklist above.
{
  const checklist = existsSync("docs/directors/03132-smoke.md") ? read("docs/directors/03132-smoke.md") : "";
  for (const item of ["Kinetic Driver", "Zephyr", "Read the Weave", "Spot Target", "Rigged Fire",
    "Decompile Sprite", "Dismiss Elemental", "Dismiss Spirit", "Elemental Shaping", "Hurl Element", "Flanked"]) {
    note(checklist.includes(item), `the checklist covers ${item}`);
  }
}
note(existsSync("scripts/dismiss-abilities.mjs") && existsSync("scripts/elementalist.mjs"),
  "both new scripts ship");
note(manifest.esmodules?.includes("scripts/module.mjs") !== false, "and module.mjs is still the entry point");

/* ================================================================ */

console.log(fail.length ? `\n0.3.132 smoke FAIL — ${fail.length}` : "\n0.3.132 smoke OK");
for (const msg of fail) console.log(`  - ${msg}`);
process.exit(fail.length ? 1 : 0);
