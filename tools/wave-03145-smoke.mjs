#!/usr/bin/env node
/**
 * 0.3.145 wave smoke — Recompile vs Special Sprite, Option A (UX only).
 *
 * The lock is narrow and it is mostly a *negative* lock. Recompile may not touch a Special Sprite: it is
 * compiled once, for a job the player wrote after the dice, and a reshape has no roll and no purpose
 * prompt to give it a new one. 0.3.140 already asserted that ban and this wave does not move it.
 *
 *   A  The ban holds. A standing Special is not a reshape target, a destroyed Special is not a rebuild
 *      target, and the Recompile dialog's Archetype list is the published four.
 *   B  The *wording* changes. When the only thing compiled (or the only thing just lost) is a Special,
 *      the warn names the rule instead of claiming the caster "has no compiled sprite" while the sprite
 *      stands on the canvas in front of them.
 *   C  When a Special stands beside stock sprites, the dialog lists it greyed out with the reason on the
 *      row, rather than leaving it silently missing.
 *   D  Option B (rebuild a destroyed Special) and the Specials cleanup package (token scale, Decompile
 *      Specials, removing the standalone abilities, Chase Pilot-first, VOIDMARK Wire-only) did NOT ship.
 *
 * A and B are real behaviour here, not a re-typed list: `scripts/sprites.mjs` imports cleanly under plain
 * node, so `recompileTargets` and the new `recompileSpecials` are called for real against hand-built
 * rosters. The branch that picks the message and the dialog that renders the disabled rows need Foundry
 * (`ui.notifications`, `DialogV2`), so those are a source scan over the comment-stripped file — a header
 * that *names* a call is not the call.
 *
 * Run: `node tools/wave-03145-smoke.mjs`
 */
import { existsSync, readFileSync } from "node:fs";

import { atLeast } from "./lib/module-version.mjs";
import { SPECIAL_ARCHETYPE, compileArchetypeOptions, reshapeArchetypes } from "../scripts/special-summons.mjs";
import { destroyedSprite, recompileSpecials, recompileTargets } from "../scripts/sprites.mjs";

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
const UI = "GHOSTWIRE.Summons.Sprites.UI";
const SPRITE_ARCHETYPES = ["data", "attack", "machine", "ward"];

/** A roster row shaped the way `recompileSprite` shapes one off a live Actor. */
const row = (name, archetype) => ({ uuid: `Actor.${name}`, name, archetype });
const STOCK = row("Watchdog-4", "attack");
const SPECIAL = row("Turret-jammer", SPECIAL_ARCHETYPE);
const SPECIAL_TWO = row("Door-holder", SPECIAL_ARCHETYPE);

/* ================================================================ 1 — the ban, run for real (lock A) */

console.log("\n1) the ban holds: a Special is neither reshaped nor rebuilt");

note(recompileTargets({ sprites: [SPECIAL] }).length === 0, "a standing Special alone leaves Recompile with no target");
note(recompileTargets({ sprites: [SPECIAL, SPECIAL_TWO] }).length === 0, "…and two of them are still no target");

const mixed = recompileTargets({ sprites: [SPECIAL, STOCK, SPECIAL_TWO] });
note(mixed.length === 1, "a mixed roster offers exactly the stock sprite");
note(mixed[0]?.name === STOCK.name && mixed[0]?.kind === "reshape", `…which is ${mixed[0]?.name} as a reshape`);
note(!mixed.some(r => r.archetype === SPECIAL_ARCHETYPE), "…and no row carries the special archetype");

note(recompileTargets({ sprites: [], destroyed: { archetype: SPECIAL_ARCHETYPE, name: SPECIAL.name } }).length === 0,
  "a destroyed Special is not a rebuild target — Option B did not ship");
const rebuild = recompileTargets({ sprites: [], destroyed: { archetype: "ward", name: "Screen-2" } });
note((rebuild.length === 1) && (rebuild[0].kind === "rebuild") && (rebuild[0].value === "destroyed"),
  "…while a destroyed stock sprite is still the rebuild row it always was");
note(recompileTargets({ sprites: [STOCK], destroyed: { archetype: "ward", name: "Screen-2" } }).length === 2,
  "…and stock reshape + stock rebuild still stack into two choices");

note(destroyedSprite({ getFlag: () => ({ archetype: SPECIAL_ARCHETYPE, name: SPECIAL.name }) }) === null,
  "a Special that died is not remembered as something to rebuild");
note(destroyedSprite({ getFlag: () => ({ archetype: "data", name: "Scout-1" }) })?.name === "Scout-1",
  "…while a stock sprite that died still is");

const reshapeList = reshapeArchetypes(compileArchetypeOptions(SPRITE_ARCHETYPES));
note(reshapeList.join(",") === SPRITE_ARCHETYPES.join(","), `the reshape archetype list is still ${reshapeList.join(" / ")}`);

/* ================================================================ 2 — what was stepped over (lock B/C) */

console.log("\n2) recompileSpecials names the Specials Recompile had to step over");

const onlySpecials = recompileSpecials({ sprites: [SPECIAL, SPECIAL_TWO] });
note(onlySpecials.length === 2, "both standing Specials are reported");
note(onlySpecials.every(r => r.kind === "special"), "…as standing rows (kind \"special\")");
note(onlySpecials.map(r => r.name).join(", ") === `${SPECIAL.name}, ${SPECIAL_TWO.name}`,
  "…carrying their own names, so the warn can print them");
note(onlySpecials.map(r => r.value).join(",") === `${SPECIAL.uuid},${SPECIAL_TWO.uuid}`,
  "…and their uuids, so the dialog can list them");

const besideStock = recompileSpecials({ sprites: [STOCK, SPECIAL] });
note((besideStock.length === 1) && (besideStock[0].name === SPECIAL.name),
  "a mixed roster reports the Special only — the stock sprite is a target, not an exclusion");
note(recompileSpecials({ sprites: [STOCK] }).length === 0, "an all-stock roster reports nothing excluded");
note(recompileSpecials().length === 0, "no roster at all reports nothing excluded");

const deadSpecial = recompileSpecials({ sprites: [], destroyed: { archetype: SPECIAL_ARCHETYPE, name: SPECIAL.name } });
note((deadSpecial.length === 1) && (deadSpecial[0].kind === "special-destroyed"),
  "a Special in the just-destroyed record is reported, and reported as destroyed");
note(deadSpecial[0]?.name === SPECIAL.name, `…by name (${deadSpecial[0]?.name})`);
note(deadSpecial[0]?.value !== "destroyed",
  "…under its own option value, so it can never collide with a real rebuild row");
note(recompileSpecials({ sprites: [], destroyed: { archetype: "ward", name: "Screen-2" } }).length === 0,
  "a destroyed *stock* sprite is not an exclusion — it is a rebuild");
note(recompileSpecials({ sprites: [], destroyed: null }).length === 0, "an empty destroyed record reports nothing");

const both = recompileSpecials({ sprites: [SPECIAL], destroyed: { archetype: SPECIAL_ARCHETYPE, name: SPECIAL_TWO.name } });
note(both.length === 2, "a standing Special and a dead one are both reported");
note(new Set(both.map(r => r.value)).size === 2, "…with distinct option values");

/* ================================================================ 3 — the empty state says the rule (lock B) */

console.log("\n3) the empty state names the rule instead of \"no compiled sprite\"");

const recompileSprite = bodyOf(spritesSrc, "export async function recompileSprite");
note(!!recompileSprite, "recompileSprite is still one exported function");
note(/const specials = recompileSpecials\(\{ sprites, destroyed: destroyedRecord\(caster\) \}\);/.test(recompileSprite),
  "it asks for the exclusions off the *raw* destroyed record, not the filtered one");
note(/const targets = recompileTargets\(\{ sprites, destroyed \}\);/.test(recompileSprite),
  "…and for its targets off the filtered one, exactly as before");
note(recompileSprite.indexOf("const sprites =") < recompileSprite.indexOf("recompileTargets({"),
  "…and the roster is read once and shared by both");

const emptyBranch = recompileSprite.slice(recompileSprite.indexOf("if (!targets.length)"),
  recompileSprite.indexOf("if (!target || !archetype)"));
note(/const standing = specials\.filter\(row => row\.kind === "special"\);/.test(emptyBranch),
  "the branch tells a standing Special from one that just died");
note(/standing\.length \? "RecompileSpecialOnly"/.test(emptyBranch),
  "a standing Special gets RecompileSpecialOnly");
note(/specials\.length \? "RecompileSpecialDestroyed"/.test(emptyBranch),
  "…a Special that just died gets RecompileSpecialDestroyed");
note(/: "RecompileNothing"/.test(emptyBranch),
  "…and a caster with genuinely nothing compiled still gets RecompileNothing");
note(/ui\.notifications\.warn\(/.test(emptyBranch) && (emptyBranch.match(/ui\.notifications\.warn\(/g).length === 1),
  "…all three through one warn, so there is one place to read");
note(/sprites: specials\.map\(row => row\.name\)/.test(emptyBranch),
  "the warn is handed the Special's own name");
note(/\|\| game\.i18n\.localize\(`\$\{UI\}\.Archetype\.\$\{SPECIAL_ARCHETYPE\}`\)/.test(emptyBranch),
  "…falling back to \"Special Sprite\" when the record kept no name");
note(/return null;/.test(emptyBranch), "…and the ability still stops there: nothing is compiled, nothing is spent");
note(!/compileSprite\(/.test(emptyBranch), "…no compile is reached from the empty state");

/* ================================================================ 4 — the dialog greys Special out (lock C) */

console.log("\n4) the dialog lists a Special beside stock, greyed out");

const promptRecompile = bodyOf(spritesSrc, "async function promptRecompile");
note(/async function promptRecompile\(caster, targets, specials = \[\]\) \{/.test(promptRecompile),
  "promptRecompile takes the exclusions, defaulting to none");
note(/await promptRecompile\(caster, targets, specials\)/.test(recompileSprite),
  "…and recompileSprite hands them over");
note(/const specialOptions = specials\.map\(/.test(promptRecompile), "the disabled rows are built from that list");
note(/disabled>/.test(promptRecompile), "…and they are rendered disabled, so none can be chosen");
note(/RecompileSpecialOption/.test(promptRecompile), "…with the reason on the row itself");
note(/\$\{targetOptions\}\$\{specialOptions\}/.test(promptRecompile),
  "…appended after the real targets, so a real target is still the selected default");
note(/specials\.length \? `<p class="hint">\$\{UIL\("RecompileSpecialExcluded"\)\}<\/p>` : ""/.test(promptRecompile),
  "the extra hint line shows only when there is a Special to explain");
note(/RESHAPE_ARCHETYPES\.map\(/.test(promptRecompile), "the Archetype list is still the reshape list");
note(!/ALL_ARCHETYPES/.test(promptRecompile), "…and still never reaches for the compile list");
note(/RecompileHint/.test(promptRecompile), "…and the original reshape/rebuild hint is untouched");

note(/if \(!RESHAPE_ARCHETYPES\.includes\(archetype\)\) return null;/.test(recompileSprite),
  "recompileSprite still refuses a Special archetype passed in by a macro");
note(/const row = targets\.find\(t => t\.value === target\);/.test(recompileSprite)
  && /if \(!row\) return null;/.test(recompileSprite),
  "…and a target that is not in the *targets* list is refused, disabled row or not");

/* ================================================================ 5 — the copy a player reads */

console.log("\n5) the strings");

for (const key of ["RecompileSpecialOnly", "RecompileSpecialDestroyed", "RecompileSpecialOption", "RecompileSpecialExcluded"]) {
  note(!!localize(`${UI}.${key}`), `${UI}.${key} ships`);
}
const only = localize(`${UI}.RecompileSpecialOnly`) ?? "";
const dead = localize(`${UI}.RecompileSpecialDestroyed`) ?? "";
note(/cannot be Recompiled/.test(only), "the standing warn says a Special cannot be Recompiled");
note(/\{sprites\}/.test(only) && /\{sprites\}/.test(dead), "…both warns name the sprite");
note(/Compile a new Special Sprite/.test(only) && /Compile a new Special Sprite/.test(dead),
  "…and both say what to press instead");
note(/Data \/ Attack \/ Machine \/ Ward/.test(only) && /Data \/ Attack \/ Machine \/ Ward/.test(dead),
  "…and name the sprites Recompile *can* take");
note(!/has no compiled sprite/.test(only) && !/has no compiled sprite/.test(dead),
  "…and neither reuses the old \"has no compiled sprite\" wording");
note(!/nothing recently destroyed/.test(dead), "the destroyed warn does not claim nothing was destroyed");
note(/not rebuilt/.test(dead), "…it says a Special is not rebuilt");
note(localize(`${UI}.RecompileNothing`)
  === "{name} has no compiled sprite to reshape and nothing recently destroyed to rebuild. Compile one first.",
  "RecompileNothing itself is byte-for-byte what it was — it is still the right line for an empty caster");
note(/\{name\}/.test(localize(`${UI}.RecompileSpecialOption`) ?? ""), "the disabled row names the sprite");
note(/cannot be Recompiled/.test(localize(`${UI}.RecompileSpecialOption`) ?? ""), "…and says why in the row");
note(/greyed out/.test(localize(`${UI}.RecompileSpecialExcluded`) ?? ""), "the hint line explains the greying");
note(localize(`${UI}.Archetype.${SPECIAL_ARCHETYPE}`) === "Special Sprite", "the fallback name is still \"Special Sprite\"");
for (const key of ["RecompileSpecialOnly", "RecompileSpecialDestroyed", "RecompileSpecialOption", "RecompileSpecialExcluded"]) {
  note(!/\{count\}/.test(localize(`${UI}.${key}`) ?? ""), `${key} carries no placeholder the code never fills`);
}

/* ================================================================ 6 — nothing deferred leaked in (lock D) */

console.log("\n6) Option B and the Specials cleanup package did not ship");

note(!/RecompileSpecialRebuild|rebuildSpecial/i.test(spritesSrc), "no rebuild-a-Special path appeared");
note(/RESHAPE_ARCHETYPES\.includes\(record\?\.archetype\)/.test(bodyOf(spritesSrc, "export function destroyedSprite")),
  "destroyedSprite still filters Specials out of the rebuildable view");
note(/RESHAPE_ARCHETYPES\.includes\(sprite\.archetype\)/.test(bodyOf(spritesSrc, "export function recompileTargets")),
  "recompileTargets still filters the reshape rows by the reshape list");

note(!/DecompileSpecial/.test(read("lang/en.json")), "no \"Decompile Specials\" control was added");
note(!/Pilot-first|PilotFirst/i.test(read("lang/en.json")), "no Chase Pilot-first seating was added");
for (const path of [
  "src/packs/classes/technomancer/abilities/special-sprite.json",
  "src/packs/classes/hacker/abilities/special-agent.json",
]) {
  note(existsSync(path), `the standalone ability still ships (${path})`);
}
for (const band of ["minor", "intermediate", "advanced"]) {
  const token = readJson(`src/packs/summons/sprites/sprite-special-${band}.json`).prototypeToken ?? {};
  note((token.width === 0.5) && (token.height === 0.5) && (token.texture?.scaleX === 1),
    `the ${band} Special template's token is untouched (${token.width}×${token.height}, scale ${token.texture?.scaleX})`);
}

/* ================================================================ 7 — version, checklist, suite */

console.log("\n7) version, checklist, and the smokes that ship beside it");

note(atLeast(manifest.version, "0.3.145"), `module.json is ${manifest.version} (>= 0.3.145)`);
note(/0\.3\.145/.test(read("README.md")), "README carries a 0.3.145 Status entry");
note(existsSync("docs/directors/03145-smoke.md"), "the committed Foundry checklist ships");
const checklist = existsSync("docs/directors/03145-smoke.md") ? read("docs/directors/03145-smoke.md") : "";
for (const item of [1, 2, 3, 4]) {
  note(new RegExp(`^## ${item}\\.`, "m").test(checklist), `…with a section for check ${item}`);
}
note(/wave-03145-smoke/.test(checklist), "…and points at this smoke");
note(existsSync("tools/wave-03140-smoke.mjs"), "the 0.3.140 smoke is still there — it owns the ban this wave leaves alone");

/* ================================================================ */

console.log(fail.length ? `\n0.3.145 smoke FAIL — ${fail.length}` : "\n0.3.145 smoke OK");
for (const msg of fail) console.log(`  - ${msg}`);
process.exit(fail.length ? 1 : 0);
