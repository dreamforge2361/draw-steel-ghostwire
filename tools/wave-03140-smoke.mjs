#!/usr/bin/env node
/**
 * 0.3.140 wave smoke — Special Sprite / Special Agent in the Compile picker.
 *
 * This is a one-lock hot-fix and the lock is a *list*: 0.3.139 shipped the purpose-built construct as
 * its own ability only, and `scripts/sprites.mjs` said so out loud — "`special` is never offered in
 * the picker". Michael opened Compile Sprite on Sabbat Vane expecting to find it there.
 *
 *   A  Compile Sprite's Archetype dropdown offers **Special Sprite**, and picking it runs the locked
 *      roll → Actions → purpose → spend flow instead of stamping a sprite from the dialog. Recompile
 *      still refuses it: a reshape has no roll and no purpose prompt to give it one.
 *   B  Compile Agent's dropdown does the same for **Special Agent**, and is charged once — Compile
 *      Agent's own 3 Bandwidth *is* the Special's 3.
 *   C  Both entry paths are said to be true in the copy a player reads: the i18n rows behind the new
 *      dropdown entries, and both class journals in both halves (markdown and rendered HTML).
 *
 * The option order lives in `scripts/special-summons.mjs` as two pure functions, so A and B are real
 * assertions here rather than a re-typed list: `compileArchetypeOptions` is what a picker offers and
 * `reshapeArchetypes` is what a reshape offers, and the smoke checks the engines build their dialogs
 * from those and nothing else.
 *
 * Offline only — no Foundry. Dialogs, PowerRoll and Actor.create cannot run here, so the wiring is a
 * source scan over the comment-stripped file: a header that *names* a call is not the call.
 *
 * Run: `node tools/wave-03140-smoke.mjs`
 */
import { existsSync, readFileSync } from "node:fs";

import { atLeast } from "./lib/module-version.mjs";
import {
  SPECIAL_AGENT_DSID, SPECIAL_ARCHETYPE, SPECIAL_FLOW, SPECIAL_SPRITE_DSID,
  compileArchetypeOptions, reshapeArchetypes,
} from "../scripts/special-summons.mjs";

const fail = [];
const note = (pass, msg) => { if (pass) console.log(`  ✓ ${msg}`); else { fail.push(msg); console.log(`  ✗ ${msg}`); } };

const read = path => readFileSync(path, "utf8").replace(/\r\n/g, "\n");
const readJson = path => JSON.parse(read(path));
/** Source with every comment line dropped — a header that *names* a call is not the call. */
const code = text => text.split("\n").filter(line => !/^\s*(\/\/|\*|\/\*)/.test(line)).join("\n");
/** One function's body, from its signature to the first column-0 closing brace. */
const bodyOf = (src, signature) => {
  const start = src.indexOf(signature);
  if (start < 0) return "";
  const rest = src.slice(start);
  return rest.slice(0, rest.indexOf("\n}\n") + 1);
};

const manifest = readJson("module.json");
const lang = readJson("lang/en.json");
const localize = key => {
  let node = lang;
  for (const part of String(key).split(".")) {
    if (!node || (typeof node !== "object") || !(part in node)) return null;
    node = node[part];
  }
  return (typeof node === "string") ? node : null;
};

const spritesSrc = code(read("scripts/sprites.mjs"));
const agentsSrc = code(read("scripts/agents.mjs"));

const SPRITE_ARCHETYPES = ["data", "attack", "machine", "ward"];
const AGENT_ARCHETYPES = ["probe", "spike", "daemon", "watchdog"];
const SPRITE_UI = "GHOSTWIRE.Summons.Sprites.UI";
const AGENT_UI = "GHOSTWIRE.Summons.Agents.UI";

/* ================================================================ 1 — the two lists, as data */

console.log("\n1) the Compile list offers Special; the reshape list does not");

const spritePicker = compileArchetypeOptions(SPRITE_ARCHETYPES);
const agentPicker = compileArchetypeOptions(AGENT_ARCHETYPES);

note(spritePicker.includes(SPECIAL_ARCHETYPE), `the sprite picker offers ${spritePicker.join(" / ")}`);
note(agentPicker.includes(SPECIAL_ARCHETYPE), `the Agent picker offers ${agentPicker.join(" / ")}`);
note(spritePicker.length === 5 && agentPicker.length === 5, "five options each: the published four plus Special");
note(spritePicker[spritePicker.length - 1] === SPECIAL_ARCHETYPE
  && agentPicker[agentPicker.length - 1] === SPECIAL_ARCHETYPE, "…and Special is last in both");
note(spritePicker.slice(0, 4).join(",") === SPRITE_ARCHETYPES.join(","), "…with the published four still in card order");
note(compileArchetypeOptions([...SPRITE_ARCHETYPES, SPECIAL_ARCHETYPE]).filter(a => a === SPECIAL_ARCHETYPE).length === 1,
  "a list that already carries Special does not grow a second copy");
note(compileArchetypeOptions().join(",") === SPECIAL_ARCHETYPE, "an empty list still offers Special and nothing else");

const spriteReshape = reshapeArchetypes(spritePicker);
note(!spriteReshape.includes(SPECIAL_ARCHETYPE), `a reshape offers ${spriteReshape.join(" / ")} — no Special`);
note(spriteReshape.join(",") === SPRITE_ARCHETYPES.join(","), "…which is exactly the published four, in order");
note(reshapeArchetypes([]).length === 0, "an empty list reshapes into nothing");
note(JSON.stringify(SPECIAL_FLOW) === JSON.stringify(["roll", "budget", "purpose", "summon"]),
  "the locked order is untouched by this wave");

/* ================================================================ 2 — Compile Sprite (lock A) */

console.log("\n2) Compile Sprite: Special in the dropdown, running the Special flow");

note(/const ALL_ARCHETYPES = compileArchetypeOptions\(ARCHETYPES\);/.test(spritesSrc),
  "sprites.mjs builds its compile list with the shared builder");
note(/const RESHAPE_ARCHETYPES = reshapeArchetypes\(ALL_ARCHETYPES\);/.test(spritesSrc),
  "…and its reshape list by taking Special back out of that same list");
note(!/never offered in the picker/.test(read("scripts/sprites.mjs")),
  "…and no longer claims Special is never offered in the picker");

const spritePrompt = bodyOf(spritesSrc, "async function promptArchetype");
note(/ALL_ARCHETYPES\.map\(/.test(spritePrompt), "the Compile Sprite dialog is built from the compile list");
note(!/(?<!ALL_)(?<!RESHAPE_)ARCHETYPES\.map\(/.test(spritePrompt), "…and not from the four-archetype list");

const compileSprite = bodyOf(spritesSrc, "export async function compileSprite");
note(/const picked = \(archetype === undefined\) \|\| \(archetype === null\);/.test(compileSprite),
  "compileSprite knows whether the archetype came from the dialog or from a caller");
note(/if \(!picked\) return null;/.test(compileSprite),
  "…so a caller asking for a Special with no budget still gets null (the level refresh never prompts)");
note(/await specialSpritePayload\(caster, message\)/.test(compileSprite),
  "…and a player who picked it off the dropdown gets the roll → Actions → purpose flow");
note(compileSprite.indexOf("specialSpritePayload(") < compileSprite.indexOf("special: payload"),
  "…which is gathered BEFORE compileSprite is called with the payload");
note(/return compileSprite\(caster, \{ archetype, position, silent, reduced, special: payload \}\);/.test(compileSprite),
  "…and the compile that follows carries position, silence and reduced-power through unchanged");

const spritePayload = bodyOf(spritesSrc, "async function specialSpritePayload");
note(!!spritePayload, "the roll → budget → purpose → pay half is one named helper");
note(spritePayload.indexOf("specialSpendPlan(") < spritePayload.indexOf("promptSpecialPurpose("),
  "affordability is checked before the player is asked for a purpose");
note(spritePayload.indexOf("tierFromMessage") < spritePayload.indexOf("promptSpecialPurpose("),
  "the tier is read before the prompt, so the prompt can show the budget");
note(spritePayload.indexOf("promptSpecialPurpose(") < spritePayload.indexOf("plan.spend > 0"),
  "Resonance is written only after the purpose is in — backing out costs nothing");
note(/message \? tierFromMessage\(message\) : await rollSpecialTier\(caster\)/.test(spritePayload),
  "a card that already rolled is never re-rolled; a sheet button with no card rolls for real");

const spriteRoll = bodyOf(spritesSrc, "async function rollSpecialTier");
note(/new ds\.rolls\.PowerRoll\("2d10 \+ @logic"/.test(spriteRoll), "the sheet-button roll is a real 2d10 + Logic Power Roll");
note(/await roll\.toMessage\(/.test(spriteRoll), "…and it posts, so the table sees the dice that bought the Actions");
note(/return Number\(roll\.product\) \|\| 1;/.test(spriteRoll), "…and its tier comes off PowerRoll#product");

note(/await compileSprite\(caster, \{ message \}\)/.test(spritesSrc),
  "the Compile Sprite card hands its own Power Roll through to the picker");
note(/const special = await specialSpritePayload\(caster, message\);/.test(bodyOf(spritesSrc, "async function compileSpecialSprite")),
  "the standalone Special Sprite ability runs the same shared half — one flow, two doors");

/* ================================================================ 3 — Recompile still refuses Special */

console.log("\n3) Recompile still excludes Special (reshape and rebuild)");

const recompileTargets = bodyOf(spritesSrc, "export function recompileTargets");
note(/RESHAPE_ARCHETYPES\.includes\(sprite\.archetype\)/.test(recompileTargets), "a live Special is not a reshape target");
note(/RESHAPE_ARCHETYPES\.includes\(destroyed\.archetype\)/.test(recompileTargets), "a destroyed Special is not a rebuild target");
const promptRecompile = bodyOf(spritesSrc, "async function promptRecompile");
note(/RESHAPE_ARCHETYPES\.map\(/.test(promptRecompile), "the Recompile dialog's archetype list is the reshape list");
note(!/ALL_ARCHETYPES/.test(promptRecompile), "…and it never reaches for the compile list");
note(/if \(!RESHAPE_ARCHETYPES\.includes\(archetype\)\) return null;/.test(bodyOf(spritesSrc, "export async function recompileSprite")),
  "recompileSprite refuses a Special archetype even if one is passed in");
note(/RESHAPE_ARCHETYPES\.includes\(record\?\.archetype\)/.test(bodyOf(spritesSrc, "export function destroyedSprite")),
  "a Special that died is not remembered as something to rebuild");

/* ================================================================ 4 — Compile Agent (lock B) */

console.log("\n4) Compile Agent: the same change, charged once");

note(/const ALL_ARCHETYPES = compileArchetypeOptions\(ARCHETYPES\);/.test(agentsSrc),
  "agents.mjs builds its compile list with the shared builder");
note(!/never offered in the picker/.test(read("scripts/agents.mjs")),
  "…and no longer claims Special is never offered in the picker");

const agentPrompt = bodyOf(agentsSrc, "async function promptArchetype");
note(/ALL_ARCHETYPES\.map\(/.test(agentPrompt), "the Compile Agent dialog is built from the compile list");
note(!/(?<!ALL_)ARCHETYPES\.map\(/.test(agentPrompt), "…and not from the four-archetype list");

const useCompile = bodyOf(agentsSrc, "async function useCompileFromSheet");
note(/if \(!ALL_ARCHETYPES\.includes\(archetype\)\) return null;/.test(useCompile),
  "Abilities-tab Use accepts Special out of the dropdown instead of bailing on it");
note(useCompile.indexOf("await use.call(") < useCompile.indexOf("specialAgentPayload("),
  "the card rolls BEFORE the purpose prompt is reached");
note(/await compileAgent\(caster, \{ archetype, skipSpend: true, special \}\);/.test(useCompile),
  "…and the compile that follows skips the spend: Compile Agent's 3 Bandwidth is the Special's 3");
note(!/spendBandwidth\(/.test(useCompile), "…so nothing on that path charges a second time");

const agentPayload = bodyOf(agentsSrc, "async function specialAgentPayload");
note(!!agentPayload, "the roll → budget → purpose half is one named helper");
note(!/spendBandwidth\(/.test(agentPayload), "the shared half never writes Bandwidth — the caller owns the spend");
note(agentPayload.indexOf("specialSpendPlan(") < agentPayload.indexOf("promptSpecialPurpose("),
  "affordability is still checked before the roll and the prompt");
note(/message \? tierFromMessage\(message\) : await rollSpecialTier\(caster\)/.test(agentPayload),
  "a card that already rolled is never re-rolled; a sheet button with no card rolls for real");

const compileAgent = bodyOf(agentsSrc, "export async function compileAgent");
note(/const picked = \(archetype === undefined\) \|\| \(archetype === null\);/.test(compileAgent),
  "compileAgent knows whether the archetype came from the dialog or from a caller");
note(/if \(!picked\) return null;/.test(compileAgent), "…so the level refresh still never prompts");
note(/return compileAgent\(caster, \{ archetype, position, silent, skipSpend, special: payload \}\);/.test(compileAgent),
  "…and the sheet-button path compiles with the payload, spend flag carried through");

const useSpecial = bodyOf(agentsSrc, "async function useSpecialFromSheet");
note(/await spendBandwidth\(caster, SPECIAL_AGENT_BANDWIDTH\)/.test(useSpecial),
  "the standalone Special Agent ability still pays for itself (its card carries no stock resource)");
note(/const special = await specialAgentPayload\(caster, message\);/.test(useSpecial),
  "…and runs the same shared half — one flow, two doors");

const agentRoll = bodyOf(agentsSrc, "async function rollSpecialTier");
note(/new ds\.rolls\.PowerRoll\("2d10 \+ @logic"/.test(agentRoll) && /await roll\.toMessage\(/.test(agentRoll),
  "the sheet-button roll is a real, posted 2d10 + Logic Power Roll");

/* ================================================================ 5 — both standalone abilities survive */

console.log("\n5) the standalone Special abilities are untouched");

const specialSprite = readJson("src/packs/classes/technomancer/abilities/special-sprite.json");
const specialAgent = readJson("src/packs/classes/hacker/abilities/special-agent.json");
note(specialSprite.system._dsid === SPECIAL_SPRITE_DSID, `Special Sprite still ships as ${SPECIAL_SPRITE_DSID}`);
note(specialAgent.system._dsid === SPECIAL_AGENT_DSID, `Special Agent still ships as ${SPECIAL_AGENT_DSID}`);
note(!!specialSprite.system.power?.roll && !!specialAgent.system.power?.roll, "…both still roll on their own card");
note(/SPECIAL_SPRITE_DSID\) await compileSpecialSprite\(caster, message\)/.test(spritesSrc),
  "…and the Special Sprite card is still wired to its own flow");
note(/isSpecialAbility\(item\)\) return useSpecialFromSheet/.test(agentsSrc),
  "…and Special Agent is still routed through AbilityModel#use");

const compileSpriteAbility = readJson("src/packs/classes/technomancer/abilities/compile-sprite.json");
note(!!compileSpriteAbility.system.power?.roll,
  "Compile Sprite rolls too — which is the tier a Special picked from its dropdown spends");

/* ================================================================ 6 — the copy a player reads (lock C) */

console.log("\n6) i18n and journals say both entry paths are true");

for (const [ui, label] of [[SPRITE_UI, "Special Sprite"], [AGENT_UI, "Special Agent"]]) {
  note(localize(`${ui}.Archetype.${SPECIAL_ARCHETYPE}`) === label, `${ui}.Archetype.special reads "${label}"`);
  const hint = localize(`${ui}.ArchetypeHint.${SPECIAL_ARCHETYPE}`);
  note(!!hint && /purpose-built/.test(hint), `…with a hint that says what it is (${hint})`);
  note(!!localize(`${ui}.SpecialRollFlavor`), `${ui}.SpecialRollFlavor exists for the sheet-button roll`);
}
for (const archetype of compileArchetypeOptions(SPRITE_ARCHETYPES)) {
  note(!!localize(`${SPRITE_UI}.Archetype.${archetype}`) && !!localize(`${SPRITE_UI}.ArchetypeHint.${archetype}`),
    `every sprite dropdown row has a name and a hint (${archetype})`);
}
for (const archetype of compileArchetypeOptions(AGENT_ARCHETYPES)) {
  note(!!localize(`${AGENT_UI}.Archetype.${archetype}`) && !!localize(`${AGENT_UI}.ArchetypeHint.${archetype}`),
    `every Agent dropdown row has a name and a hint (${archetype})`);
}
note(/including Special Sprite/.test(localize(`${SPRITE_UI}.Setting.Hint`) ?? ""),
  "the compile-on-use setting hint names the new dropdown entry");

for (const [path, phrase] of [
  ["docs/raw/20-technomancer.md", "Special Sprite"],
  ["docs/raw/19-hacker.md", "Special Agent"],
]) {
  const raw = read(path);
  note(/last in the list/.test(raw), `${path} tells a player the picker carries ${phrase}`);
  note(/Two ways in\./.test(raw), "…and that the standalone ability is the other way in");
}

for (const [path, page, needle] of [
  ["src/packs/rulebook/classes/20-technomancer.json", 5, "Special Sprite"],
  ["src/packs/rulebook/classes/19-hacker.json", 5, "Special Agent"],
]) {
  const text = readJson(path).pages[page]?.text ?? {};
  for (const half of ["markdown", "content"]) {
    const value = text[half] ?? "";
    note(/last in the list/.test(value) && /Two ways in/.test(value),
      `${path} page ${page} (${half}) carries both entry paths for ${needle}`);
  }
}

/* ================================================================ version, checklist, suite */

console.log("\n7) version, checklist, and the tools that ship with them");

note(atLeast(manifest.version, "0.3.140"), `module.json is ${manifest.version} (>= 0.3.140)`);
note(/0\.3\.140/.test(read("README.md")), "README carries a 0.3.140 Status entry");
note(existsSync("docs/directors/03140-smoke.md"), "the committed Foundry checklist ships");
const checklist = existsSync("docs/directors/03140-smoke.md") ? read("docs/directors/03140-smoke.md") : "";
for (const item of [1, 2, 3, 4]) {
  note(new RegExp(`^## ${item}\\.`, "m").test(checklist), `…with a section for check ${item}`);
}
note(/wave-03140-smoke/.test(checklist), "…and points at this smoke");
note(existsSync("tools/wave-03139-smoke.mjs"), "the 0.3.139 smoke is still there to be re-run beside this one");

/* ================================================================ */

console.log(fail.length ? `\n0.3.140 smoke FAIL — ${fail.length}` : "\n0.3.140 smoke OK");
for (const msg of fail) console.log(`  - ${msg}`);
process.exit(fail.length ? 1 : 0);
