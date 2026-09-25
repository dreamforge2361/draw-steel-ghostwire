#!/usr/bin/env node
/**
 * 0.3.142 wave smoke — Biofeedback, ICE attack triggers, North Substation, the Director macro, VOIDMARK.
 *
 *   A  **One Biofeedback pipeline.** Rating base → connection scale → minus deck Biofeedback
 *      Resistance → Stamina, and the **Winded floor** (0 becomes 1: Winded, not Dying) shared by Wire
 *      Biofeedback and Technomancer overreach.
 *   B  **ICE attack triggers.** Four and only four, in the RAW: low (≤11) roll vs active ICE at R3+,
 *      failed breach at R4+, the Alert 9–11 hunt bite, a Director Malice ICE surge. Passive R1–2 is
 *      flavour, Linked takes none, host ICE bites the compiler.
 *   C  **North Substation** masterwork — rules appendix, journal page, Director cue sheet, and the two
 *      locked worked numbers (Overlay 2, Jacked In 10).
 *   D  **Director: Apply Biofeedback** — macro pack entry, lang keys, registration from the module
 *      entrypoint, and the pure math this file executes rather than re-types.
 *   E  **VOIDMARK** — the procedure, the triggers, North Substation and the Wire-only guardrail all
 *      retrievable, and the guardrail in the prompt.
 *   F  Version, README, committed checklist, no `_id` / `_dsid` movement, and none of the 0.3.143
 *      Specials package mixed in.
 *
 * The arithmetic is executed straight out of scripts/director-biofeedback.mjs. Dialogs, ChatMessage
 * and Actor#update cannot run in Node, so that wiring is checked by scanning comment-stripped source.
 *
 * Run: `node tools/wave-03142-smoke.mjs`
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

import { atLeast } from "./lib/module-version.mjs";
import { retrieve } from "../scripts/voidmark-rag.mjs";
import { DEFAULT_SYSTEM_INSTRUCTIONS } from "../scripts/voidmark-prompt.mjs";
import {
  BIOFEEDBACK_BY_RATING, BIOFEEDBACK_RATINGS, ICE_TRIGGERS, WINDED_FLOOR_STAMINA,
  applyWindedFloor, baseForRating, biofeedbackDamage, clampBiofeedback, deckResistance,
  normalizeBiofeedbackState, normalizeRating, resolveBiofeedback, scaleBiofeedback,
} from "../scripts/director-biofeedback.mjs";

const fail = [];
const note = (pass, msg) => { if (pass) console.log(`  ✓ ${msg}`); else { fail.push(msg); console.log(`  ✗ ${msg}`); } };

const read = path => readFileSync(path, "utf8").replace(/\r\n/g, "\n");
const readJson = path => JSON.parse(read(path));
/** Source with every comment line dropped — a header that *names* a call is not the call. */
const code = text => text.split("\n").filter(line => !/^\s*(\/\/|\*|\/\*)/.test(line)).join("\n");

const manifest = readJson("module.json");
const lang = readJson("lang/en.json");
const localize = key => {
  let node = lang;
  for (const part of String(key).split(".")) {
    if (!node || (typeof node !== "object") || !(part in node)) return null;
    node = node[part];
  }
  return node;
};

const wire = read("docs/raw/21-the-wire.md");
const techno = read("docs/raw/20-technomancer.md");
const hacker = read("docs/raw/19-hacker.md");
const combat = read("docs/raw/04-combat.md");
const opposition = read("docs/raw/25-opposition.md");

/* ================================================================ A — the Biofeedback pipeline */

console.log("\nA) Biofeedback — one pipeline, four steps");

note(
  JSON.stringify(BIOFEEDBACK_BY_RATING) === JSON.stringify({ 1: 3, 2: 5, 3: 8, 4: 13, 5: 22 }),
  "the System Stat Card Biofeedback Values are R1 3 · R2 5 · R3 8 · R4 13 · R5 22",
);
note(BIOFEEDBACK_RATINGS.join(",") === "1,2,3,4,5", "the picker offers Node Ratings 1–5");
note([1, 2, 3, 4, 5].every(r => baseForRating(r) === BIOFEEDBACK_BY_RATING[r]), "baseForRating reads that table");
note((baseForRating(0) === 0) && (baseForRating(6) === 0) && (baseForRating("x") === 0), "…and anything that is not a Rating 1–5 is 0");
note((normalizeRating("3") === 3) && (normalizeRating(9) === null), "normalizeRating accepts a string and refuses 9");

// Step 2 — the connection scale. Disconnected and Linked are 0; there is no ×1 rung.
note(scaleBiofeedback(8, "disconnected") === 0, "Disconnected scales to 0 — no Biofeedback off-net");
note(scaleBiofeedback(8, "linked") === 0, "Linked scales to 0 — soft presence is not immersion");
note(scaleBiofeedback(22, "linked") === 0, "…at every Rating, not just the small ones");
note(scaleBiofeedback(8, "overlay") === 4, "Overlay is ×0.5 (8 → 4)");
note(scaleBiofeedback(3, "overlay") === 1, "…round down (3 → 1)");
note(scaleBiofeedback(5, "overlay") === 2, "…round down again (5 → 2)");
note(scaleBiofeedback(13, "overlay") === 6, "…13 → 6");
note(scaleBiofeedback(1, "overlay") === 1, "…with a minimum of 1, so a bite that connects always costs something");
note(scaleBiofeedback(8, "jackedIn") === 12, "Jacked In is ×1.5 round up (8 → 12)");
note(scaleBiofeedback(3, "jackedIn") === 5, "…round up (3 → 5)");
note(scaleBiofeedback(5, "jackedIn") === 8, "…5 → 8");
note(scaleBiofeedback(13, "jackedIn") === 20, "…13 → 20");
note(scaleBiofeedback(22, "jackedIn") === 33, "…22 → 33, the number the Rating 5 note prints");
note(scaleBiofeedback(0, "jackedIn") === 0, "a base of 0 scales to 0, not to a minimum of 1");
note(normalizeBiofeedbackState("nonsense") === "disconnected", "an unreadable state reads as Disconnected (the safe end)");

// Step 3 — resistance comes off the SCALED number, never the base, and never below 0.
note(biofeedbackDamage({ base: 8, state: "overlay", resistance: 2 }) === 2, "resistance comes off the scaled number (8 → 4 → −2 = 2)");
note(biofeedbackDamage({ base: 8, state: "jackedIn", resistance: 2 }) === 10, "…and off the Jacked In number too (8 → 12 → −2 = 10)");
note(biofeedbackDamage({ base: 8, state: "overlay", resistance: 99 }) === 0, "…never below 0");
note(biofeedbackDamage({ base: 8, state: "linked", resistance: 0 }) === 0, "Linked takes none even with no resistance at all");
note(clampBiofeedback("7") === 7 && clampBiofeedback(-4) === 0 && clampBiofeedback(2.9) === 2, "clampBiofeedback floors to a non-negative integer");

console.log("\nA) the Winded floor");

note(WINDED_FLOOR_STAMINA === 1, "the floor is 1 Stamina");
{
  const hit = applyWindedFloor({ stamina: 4, staminaMax: 20, damage: 10 });
  note(hit.staminaAfter === 1, "a hit that would go to -6 stops at 1");
  note(hit.floored === true, "…and says the floor caught it");
  note(hit.dying === false, "…Winded, not Dying");
  note(hit.winded === true, "…and 1 of 20 is Winded");
  note(hit.applied === 3, "…only 3 of the 10 actually landed");
  note(hit.prevented === 7, "…7 were prevented");
}
{
  const clean = applyWindedFloor({ stamina: 30, staminaMax: 40, damage: 10 });
  note(clean.staminaAfter === 20 && !clean.floored, "a hit that leaves Stamina above 0 is untouched by the floor");
  note(clean.winded === true, "…and 20 of 40 is still Winded on the ordinary rule");
}
{
  const exact = applyWindedFloor({ stamina: 10, staminaMax: 40, damage: 10 });
  note(exact.staminaAfter === 1 && exact.floored, "exactly 0 is floored too — 'to 0 or below'");
}
note(applyWindedFloor({ stamina: 1, staminaMax: 20, damage: 8 }).staminaAfter === 1, "the floor never heals: already at 1 stays at 1");
note(applyWindedFloor({ stamina: 1, staminaMax: 20, damage: 8 }).applied === 0, "…and applies nothing");
note(applyWindedFloor({ stamina: 0, staminaMax: 20, damage: 8 }).staminaAfter === 0, "a hero already down at 0 is not rescued by a bite");
note(applyWindedFloor({ stamina: 0, staminaMax: 20, damage: 8 }).dying === true, "…they are still Dying");
note(applyWindedFloor({ stamina: 4, staminaMax: 20, damage: 10, floor: false }).staminaAfter === -6, "floor:false is the non-Biofeedback path and still kills");

console.log("\nA) resolveBiofeedback end to end");
{
  // The two numbers locked in the North Substation masterwork.
  const act2 = resolveBiofeedback({ rating: 3, state: "overlay", resistance: 2, stamina: 21, staminaMax: 21 });
  note(act2.base === 8 && act2.scaled === 4 && act2.damage === 2, "Act 2: Rating 3, Overlaid, resistance 2 → base 8, scaled 4, 2 damage");
  note(act2.staminaAfter === 19 && !act2.floored, "…Stamina 21 → 19, no floor");
  const act4 = resolveBiofeedback({ rating: 3, state: "jackedIn", resistance: 2, stamina: 19, staminaMax: 21 });
  note(act4.damage === 10 && act4.staminaAfter === 9, "Act 4: same host, Jacked In → 10 damage, Stamina 19 → 9");
  const act5 = resolveBiofeedback({ rating: 3, state: "jackedIn", resistance: 2, stamina: 6, staminaMax: 21 });
  note(act5.damage === 10 && act5.staminaAfter === 1 && act5.floored, "Act 5: the hunt bite that would drop her holds at 1 Stamina");
  const custom = resolveBiofeedback({ rating: 3, base: 20, state: "overlay", resistance: 0, stamina: 30, staminaMax: 30 });
  note(custom.custom === true && custom.base === 20 && custom.rating === null, "a custom base overrides the Rating");
  note(custom.damage === 10, "…and still runs the same scale (20 → 10)");
  const linked = resolveBiofeedback({ rating: 5, state: "linked", resistance: 0, stamina: 30, staminaMax: 30 });
  note(linked.damage === 0 && linked.staminaAfter === 30, "a Rating 5 host cannot touch a Linked runner");
}
note(deckResistance({ perEchelon: 2, echelon: 1 }) === 2, "deck resistance is per-Echelon: 2 at Echelon 1");
note(deckResistance({ perEchelon: 2, echelon: 3 }) === 6, "…6 at Echelon 3");
note(deckResistance({ perEchelon: 0, echelon: 4 }) === 0, "…and 0 stays 0 (a Technomancer carries no deck)");
note(deckResistance({ perEchelon: 3, echelon: 0 }) === 3, "…an unknown Echelon reads as 1 rather than as 0");

/* ================================================================ A — the RAW says the same thing */

console.log("\nA) the Wired chapter prints the procedure");

note(/### Biofeedback -- the full procedure/.test(wire), "21-the-wire has a Biofeedback procedure section");
note(/#### The Winded floor \(both sources\)/.test(wire), "…with the Winded floor under it, named for both sources");
note(/R1\*\* 3 · \*\*R2\*\* 5 · \*\*R3\*\* 8 · \*\*R4\*\* 13 · \*\*R5\*\* 22/.test(wire), "…the Rating table unchanged");
note(/There is no ×1 step/.test(wire), "…no ×1 rung");
note(/Biofeedback that would take your Stamina to 0 or below leaves you Winded, not Dying\./.test(wire), "…the floor says Winded, not Dying");
note(/You stop at \*\*1 Stamina\*\*/.test(wire), "…and says where it stops");
note(/The floor never heals/.test(wire), "…and that it never heals");
note(/\*\*Only Biofeedback is floored\.\*\*/.test(wire), "…and that non-Biofeedback damage still kills");
note(/8 × 0\.5 = 4\*\* → minus \*\*2\*\* → \*\*2 Stamina damage/.test(wire), "…with the Overlay worked line (8 → 4 → 2)");
note(/8 × 1\.5 = 12\*\* → minus \*\*2\*\* → \*\*10 Stamina damage/.test(wire), "…and the Jacked In one (8 → 12 → 10)");
note(/Director: Apply Biofeedback/.test(wire), "…and the In Foundry box names the macro");

console.log("\nA) the Technomancer floor is the same floor");

note(/the Winded floor/i.test(techno), "20-technomancer names the Winded floor");
note(/you stop at \*\*1 Stamina\*\*/i.test(techno), "…stops at 1 Stamina, like the Wire chapter");
note(/same floor/i.test(techno), "…and says it is the same floor");
note(/Physique test/.test(techno) && /cost band/.test(techno), "…while keeping the existing 5\\+ Resonance → Physique test by cost band");
note(/never \*?heals?\*?/i.test(techno), "…and that it never heals");
note(!/stop at the winded threshold/i.test(techno), "…and the old ambiguous 'winded threshold' wording is gone");
note(/Winded, not Dying/.test(combat), "04-combat's connection-state summary carries the floor too");

/* ================================================================ B — ICE attack triggers */

console.log("\nB) ICE attack triggers — four, and no free attack every round");

note(/### ICE attack triggers -- when ICE actually bites/.test(wire), "21-the-wire has an ICE attack triggers section");
note(/\*\*ICE does not get a free attack every round\.\*\*/.test(wire), "…and says so outright");
note(/low \(≤11\) Wired Power Roll\*\* against a host that has \*\*active ICE\*\* \(Node Rating \*\*3\*\* or higher\)/.test(wire), "trigger 1: low roll vs active ICE at R3+");
note(/failed breach against a Rating 4\+ host/.test(wire), "trigger 2: failed breach at R4+");
note(/Trace Alert 9–11 — the hunt bite/.test(wire), "trigger 3: the Alert 9–11 hunt bite");
note(/end of each of the runner's turns\*\*, while they are still \*\*Overlay or Jacked In\*\*/.test(wire), "…at the end of each of the runner's turns while Overlay or Jacked In");
note(/bites \*\*once\*\*/.test(wire), "…once");
note(/Director Malice ICE surge/.test(wire), "trigger 4: a Director Malice ICE surge");
note(/Passive ICE at Rating 1–2 is flavor only — it never deals Biofeedback/.test(wire), "passive R1–2 is flavour only");
note(/\*\*Linked deals no Biofeedback\*\*/.test(wire), "Linked deals none, on any trigger");
note(/\*\*Default target: the compiler\.\*\*/.test(wire), "host ICE bites the compiler by default");
note(/A Black ICE \*creature\* is a different thing/.test(wire), "…and a Black ICE creature is separated from a host's ICE layers");
note(ICE_TRIGGERS.join(",") === "low-roll,failed-breach,hunt-bite,malice-surge", "the macro offers exactly those four triggers");
note(ICE_TRIGGERS.every(t => typeof localize(`GHOSTWIRE.Biofeedback.Director.Triggers.${t}`) === "string"), "…and every one has a lang string");

console.log("\nB) Trace Alert 9–11 is the hunt bite, and nothing contradicts it");

const alert911 = /\|\s\*\*9–11\*\*\s\|([^|]*)\|/.exec(wire)?.[1] ?? "";
note(/hunt bite/i.test(alert911), "the Alert 9–11 row delivers the hunt bite");
note(/one Biofeedback hit/i.test(alert911), "…one Biofeedback hit");
note(!/bane on your next Wired Power Roll/.test(alert911), "…and the bane it replaced is gone from that row");
note(!/Steps 9–11 put banes on the runner's Wired rolls/.test(wire), "the 'as the track climbs' paragraph was brought along");
note(/one Biofeedback hunt bite at the end of every one of their turns/.test(wire), "…and now describes the bite");
for (const [file, text, label] of [["19-hacker", hacker, "the Hacker"], ["20-technomancer", techno, "the Technomancer"]]) {
  note(/\*\*ICE does not attack every round\.\*\*/.test(text), `${file}'s firefight checklist says ICE does not attack every round`);
  note(/hunt bite/.test(text), `…and names the hunt bite (${label})`);
  note(/Malice ICE surge/.test(text), "…and the Malice surge");
}
note(/A Malice \*\*ICE surge\*\* is one of the four — and only four — triggers/.test(opposition), "25-opposition's Malice section points at the same four triggers");
note(/A host's ICE does not get a free attack every round\.\*\*/.test(opposition), "…and repeats the no-free-attack lock");
note(/stat it as a creature/.test(opposition), "…and tells the Director to stat ICE as a creature if they want turns");

/* ================================================================ C — North Substation */

console.log("\nC) North Substation masterwork");

note(/^## North Substation — a worked Wired run$/m.test(wire), "the masterwork ships as a Wired chapter appendix");
for (const act of [0, 1, 2, 3, 4, 5, 6]) {
  note(new RegExp(`^### Act ${act} — `, "m").test(wire), `…with Act ${act}`);
}
note(/### Technomancer appendix/.test(wire), "…and the Technomancer appendix");
note(/Node Rating \*\*3\*\*, \*\*Track 2\*\*/.test(wire), "the host is Rating 3, Track 2");
note(/Integrity \*\*26\*\*\. Biofeedback Value \*\*8\*\*\. Trace Alert starts at \*\*0\*\*/.test(wire), "…Integrity 26, Biofeedback 8, Alert 0");
note(/Breach difficulty \*\*medium\*\*/.test(wire), "…breach medium");
note(/ICE: \*\*passive \+ 1 active\*\*/.test(wire), "…passive + 1 active ICE");
note(/street deck\*\* \(Biofeedback Resistance \*\*2\*\*\), Bandwidth \*\*6\*\*/.test(wire), "Vira carries a street deck at resistance 2 with Bandwidth 6");
note(/Logic 3/.test(wire), "…Logic 3");
note(/\*\*Kade\*\*, an Operator, all meat/.test(wire), "Kade is the meat half of the crew");
note(/Maglock Door 1\*\*, \*\*Light Control\*\*, and a \*\*Turret feed\*\*/.test(wire), "the Track 1 room is Maglock Door 1 / Light Control / Turret feed");
note(/spoof the turret lock/.test(wire), "the Special Agent's purpose is Wire-only — spoofing a turret lock");
note(/Actions \(2\): spoof the turret lock/.test(wire), "…stamped as Actions (2)");
note(/Pull Kade out of the corridor/.test(wire), "…and the meatspace purposes are named as refused");
note(/Agents and sprites are \*\*Wire-only\*\*/.test(wire), "…because Agents and sprites are Wire-only");
note(/Integrity \*\*26 → 21\*\*/.test(wire), "Act 4 strikes Integrity 26 → 21");
note(/crosses \*\*step 5\*\* — the Director banks \*\*\+1 Malice\*\*/.test(wire), "…Alert crosses 5 for +1 Malice");
note(/full lockout\*\* with a \*\*hard counter-trace/.test(wire), "…and the optional Alert 12 counter-trace is offered");
note(/that is Lock A/.test(wire), "Act 6 carries Lock A construct visibility");
note(/\*\*The Alert does not leave with her\.\*\*/.test(wire), "…and the Alert persists past Jack Out");
note(/Linked\*\* — no meat bane, and \*\*no Biofeedback exposure at all\*\* — can still put a sprite on the board/.test(wire), "the Technomancer appendix compiles a sprite from Linked");
note(/5 or more Resonance/.test(wire), "…and names the 5+ Resonance overreach");

const directorPage = "docs/directors/north-substation-masterwork.md";
note(existsSync(directorPage), "the Director cue sheet is committed (no leading underscore)");
const cue = existsSync(directorPage) ? read(directorPage) : "";
note(/## 4\. Foundry alignment/.test(cue), "…with a Foundry alignment note");
note(/base 8 \(Rating 3\)\s+→\s+Overlay ×0\.5 = 4\s+→\s+− resistance 2\s+→\s+2 Stamina damage/.test(cue), "…the Act 2 math (2)");
note(/base 8 \(Rating 3\)\s+→\s+Jacked In ×1\.5 = 12\s+→\s+− resistance 2\s+→\s+10 Stamina damage/.test(cue), "…the Act 4 math (10)");
note(/Director: Apply Biofeedback/.test(cue), "…and it names the macro");
note(/Wire-only/.test(cue), "…and carries the Wire-only guardrail");
note(/wave-03142-smoke/.test(cue), "…and points at this smoke");
note(new RegExp(directorPage.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).test(wire), "the chapter points readers at the Director page");

const wireJournal = readJson("src/packs/rulebook/ghostwire-systems/21-the-wire.json");
const substationPage = wireJournal.pages.find(p => p.name === "North Substation — a worked Wired run");
note(!!substationPage, "the masterwork is a Rulebook journal page too, so VOIDMARK and the sidebar carry it");
note(/Act 5 — the hunt, and the floor/.test(substationPage?.text?.markdown ?? ""), "…with its acts in the page markdown");
note(/<h3/.test(substationPage?.text?.content ?? ""), "…and rendered HTML beside the markdown");
const wirePage = wireJournal.pages.find(p => p.name === "The Wired System");
note(/ICE attack triggers/.test(wirePage?.text?.markdown ?? ""), "the Wired System page carries the ICE triggers");
note(/Biofeedback -- the full procedure/.test(wirePage?.text?.markdown ?? ""), "…and the Biofeedback procedure");
note(/hunt bite/.test(wirePage?.text?.markdown ?? ""), "…and the reworded Alert 9–11 row");

/* ================================================================ D — the Director macro */

console.log("\nD) Director: Apply Biofeedback");

const macroPath = "src/packs/macros/director-biofeedback.json";
note(existsSync(macroPath), "the macro ships in the macros pack source");
const macro = existsSync(macroPath) ? readJson(macroPath) : {};
note(macro.type === "script" && macro.scope === "global", "…as a global script macro, like Pay / Spend Hero");
note(macro._id === "gwDirBiofeed0001" && macro._key === "!macros!gwDirBiofeed0001", "…with a stable _id and a matching _key");
note(macro.name === "GHOSTWIRE.Biofeedback.Director.MacroName", "…a lang-key name");
note(localize("GHOSTWIRE.Biofeedback.Director.MacroName") === "Director: Apply Biofeedback", "…that resolves to 'Director: Apply Biofeedback'");
note(/directorBiofeedbackPrompt/.test(macro.command ?? ""), "…and calls the module API");
note(macro.flags?.["draw-steel-ghostwire"]?.directorTool === "biofeedback-apply", "…flagged as a Director tool");
// Core icon paths are guessable and often wrong, so check the real install when it is on this box.
note(/^icons\/[a-z0-9/-]+\.webp$/.test(macro.img ?? ""), "…on a core Foundry icon path");
{
  const app = process.env.FOUNDRY_APP ?? "C:/Program Files/Foundry Virtual Tabletop/resources/app";
  const onDisk = `${app}/public/${macro.img}`;
  if (existsSync(app)) note(existsSync(onDisk), "…that actually exists in the Foundry install");
  else console.log("  · no Foundry install on this box; macro icon path not verified against disk");
}

const source = read("scripts/director-biofeedback.mjs");
const src = code(source);
note(/export function registerDirectorBiofeedback/.test(src), "the script exports a registrar");
note(/game\.keybindings\.register/.test(src), "…which registers a GM-restricted keybinding");
note(/restricted: true/.test(src), "…restricted to the Director");
note(/directorApplyBiofeedback,\s*\n\s*directorBiofeedbackPrompt,/.test(src), "…and publishes the pair on module.api");
note(/system\.stamina\.value/.test(src), "…writing Stamina through to the Actor");
note(/ghostwireBiofeedback: true/.test(src), "…tagged so other hooks can tell it apart");
note(/game\.user\?\.isGM/.test(src), "…GM only");
note(/collectTaintTargets/.test(src), "…reusing the Taint / Wealth token collect rather than a third copy");
note(/getWiredState/.test(src), "…and taking the module's own getWiredState rather than inventing a second reader");
note(!/createToolbar|getSceneControlButtons/.test(src), "no new Token toolbar button (0.3.137 declutter holds)");

const moduleSrc = code(read("scripts/module.mjs"));
note(/import \{ registerDirectorBiofeedback \} from "\.\/director-biofeedback\.mjs"/.test(moduleSrc), "the entrypoint imports it");
note(/registerDirectorBiofeedback\(\{ getWiredState \}\)/.test(moduleSrc), "…and registers it with getWiredState");

for (const key of [
  "Title", "Keybinding", "GMOnly", "NoTarget", "NotEligible", "Speaker", "Rating", "RatingOption",
  "CustomBaseLabel", "State", "StateAuto", "Resistance", "ResistanceAuto", "Trigger", "Submit",
  "FloorHint", "ChatTitle", "ChatSource", "ChatScale", "ChatResist", "ChatApplied",
  "ChatWindedFloor", "Notify", "NotifyFloored",
]) {
  note(typeof localize(`GHOSTWIRE.Biofeedback.Director.${key}`) === "string", `lang key ${key}`);
}
for (const state of ["disconnected", "linked", "overlay", "jackedIn"]) {
  note(typeof localize(`GHOSTWIRE.Biofeedback.Director.States.${state}`) === "string", `…and a label for ${state}`);
}
note(/Winded/.test(localize("GHOSTWIRE.Biofeedback.Director.FloorHint") ?? ""), "the dialog hint states the Winded floor");
note(/1 Stamina/.test(localize("GHOSTWIRE.Biofeedback.Director.ChatWindedFloor") ?? ""), "…and the chat line names 1 Stamina");

console.log("\nD) deck Biofeedback Resistance is data, not a hidden number");

const DECK_RESISTANCE = { scrapdeck: 1, "street-deck": 2, ghostbox: 2, blackdeck: 3, "fairlight-ghost": 3 };
for (const [slug, expected] of Object.entries(DECK_RESISTANCE)) {
  const deck = readJson(`src/packs/matrix/decks/${slug}.json`);
  const matrix = deck.flags?.["draw-steel-ghostwire"]?.matrix ?? {};
  note(matrix.biofeedbackResistance === expected, `${slug} carries biofeedbackResistance ${expected}`);
  note(matrix.role === "deck", `…and is still flagged role: deck (which is how the macro finds it)`);
}
note(/Scrapdeck 1\*\* \(street\) · \*\*Street Deck 2\*\* \(professional\) · \*\*Ghostbox 2\*\* \(restricted\) · \*\*Blackdeck 3\*\* \(military\) · \*\*Fairlight Ghost 3\*\*/.test(hacker), "19-hacker prints the same five numbers, so the book and the data agree");
note(/\*\*per-Echelon\*\* number/.test(hacker), "…and says the stat is per-Echelon");
note(/after\*\* your connection state has scaled it/.test(hacker), "…and that it applies after the scale, not to the base");
note(/the best one you are carrying, not the sum/.test(hacker), "…and that you get one deck's resistance");

note(/ghostwire-biofeedback-chat/.test(read("styles/ghostwire.css")), "the chat card has a style block");
note(!/letter-spacing:\s*(?!var\()/.test(read("styles/ghostwire.css").split("ghostwire-biofeedback-chat")[1]?.slice(0, 900) ?? ""), "…using the design token rather than a raw letter-spacing");

/* ================================================================ E — VOIDMARK */

console.log("\nE) VOIDMARK");

const index = readJson("data/voidmark-rules-index.json");
const probe = (query, k = 5) => retrieve(index, query, { k });
const lands = (query, file, heading) => probe(query).some(h =>
  String(h.file ?? "").includes(file) && (!heading || new RegExp(heading, "i").test(String(h.heading ?? ""))));

note(lands("how does biofeedback work", "21-the-wire", "Biofeedback"), "'how does biofeedback work' retrieves the Biofeedback procedure");
note(lands("biofeedback resistance deck", "21-the-wire", "Biofeedback"), "'biofeedback resistance deck' retrieves it too");
note(lands("winded floor biofeedback", "21-the-wire"), "'winded floor biofeedback' reaches the Wired chapter");
note(lands("does ICE attack every round", "21-the-wire", "ICE attack triggers"), "'does ICE attack every round' retrieves the ICE attack triggers");
note(lands("ICE bite triggers", "21-the-wire", "ICE attack triggers"), "'ICE bite triggers' does too");
note(lands("north substation", "21-the-wire", "North Substation"), "'north substation' retrieves the masterwork");
note(probe("can my special agent pull a downed runner out of the corridor").some(h => /special agent/i.test(String(h.heading ?? "") + String(h.entity ?? ""))), "a meatspace Agent purpose retrieves the Special Agent rules");
note(index.chunks.some(c => /Wire-only/.test(String(c.text ?? "")) && String(c.file ?? "").includes("21-the-wire")), "the Wire-only guardrail is in an indexed chunk");
note(index.chunks.some(c => /ICE does not get a free attack every round/.test(String(c.text ?? ""))), "…and so is the no-free-attack lock");
note(index.chunks.some(c => /Winded, not Dying/.test(String(c.text ?? ""))), "…and the Winded floor");

const prompt = DEFAULT_SYSTEM_INSTRUCTIONS;
note(/WIRED HARD GUARDRAILS/.test(prompt), "the VOIDMARK prompt has a Wired guardrail block");
note(/R1 3 · R2 5 · R3 8 · R4 13 · R5 22/.test(prompt), "…with the Rating table");
note(/Disconnected or Linked = 0/.test(prompt), "…Linked at 0");
note(/Overlay ×0\.5 round down minimum 1/.test(prompt), "…Overlay ×0.5 min 1");
note(/Jacked In ×1\.5 round up/.test(prompt), "…Jacked In ×1.5");
note(/leaves them at 1 Stamina, Winded and not Dying/.test(prompt), "…the Winded floor");
note(/\*\*ICE does not attack every round\.\*\*/.test(prompt), "…the no-free-attack lock");
note(/four triggers/.test(prompt), "…the four triggers");
note(/Agents, sprites and Specials are Wire-only/.test(prompt), "…and the Wire-only guardrail");
note(/no pulling a downed runner out of a corridor/.test(prompt), "…named with the example that keeps coming up");
note(index.entityCounts?.ability === 420, `${index.entityCounts?.ability} ability entries (unchanged — this wave ships no abilities)`);
note(index.entityCounts?.summon === 74, `${index.entityCounts?.summon} summon entries (unchanged)`);

/* ================================================================ F — version, hygiene, scope */

console.log("\nF) version, ids, and the 0.3.143 line");

note(atLeast(manifest.version, "0.3.142"), `module.json is ${manifest.version} (>= 0.3.142)`);
note(/`0\.3\.142` — \*\*Biofeedback has one procedure/.test(read("README.md")), "README carries a 0.3.142 Status entry");

const checklistPath = "docs/directors/03142-smoke.md";
note(existsSync(checklistPath), "the committed Foundry checklist ships");
const checklist = existsSync(checklistPath) ? read(checklistPath) : "";
for (const item of [1, 2, 3, 4, 5, 6, 7, 8]) note(new RegExp(`^## ${item}\\.`, "m").test(checklist), `…with a section for check ${item}`);
note(/wave-03142-smoke/.test(checklist), "…and points at this smoke");

let baseRef = null;
for (const ref of ["origin/main", "main"]) {
  try { execFileSync("git", ["rev-parse", "--verify", "--quiet", ref], { stdio: "pipe" }); baseRef = ref; break; } catch { /* next */ }
}
if (baseRef) {
  const changed = execFileSync("git", ["diff", "--name-only", baseRef, "--", "src/packs"], { encoding: "utf8" })
    .split("\n").filter(f => f.endsWith(".json"));
  const idsOf = doc => JSON.stringify([
    doc._id, doc.system?._dsid, doc.flags?.["draw-steel-ghostwire"]?.dsid,
    ...(doc.pages ?? []).map(p => p._id), ...(doc.items ?? []).map(i => [i._id, i.system?._dsid]),
    ...(doc.effects ?? []).map(e => e._id),
  ]);
  let moved = 0;
  for (const file of changed) {
    let before = null;
    try { before = JSON.parse(execFileSync("git", ["show", `${baseRef}:${file}`], { encoding: "utf8" })); } catch { continue; }
    if (!existsSync(file)) { moved += 1; continue; }
    const after = readJson(file);
    // An appended page is a new _id, never a moved one: every id that was there must still be there.
    const beforeIds = JSON.parse(idsOf(before)).flat(2).filter(Boolean);
    const afterIds = new Set(JSON.parse(idsOf(after)).flat(2).filter(Boolean));
    if (!beforeIds.every(id => afterIds.has(id))) moved += 1;
  }
  note(!moved, `${changed.length} changed pack source file(s) against ${baseRef}; no _id / dsid moved`);

  const allChanged = execFileSync("git", ["diff", "--name-only", baseRef], { encoding: "utf8" }).split("\n").filter(Boolean);
  note(!allChanged.some(f => f.startsWith("src/packs/summons/")), "no summon Actor touched — Specials token scale 0.5 is 0.3.143");
  note(!allChanged.some(f => f === "scripts/chase-hud.mjs"), "the Chase HUD is untouched — Pilot-first seats are 0.3.143");
  note(!allChanged.some(f => f.startsWith("docs/directors/_")), "no director scratch file staged for commit");
} else {
  console.log("  · no main ref to diff against; id and scope checks skipped");
}

note(!/Decompile Specials/i.test(source + wire + hacker + techno), "nothing ships a Decompile Specials verb (0.3.143)");

/* ================================================================ */

console.log(fail.length ? `\n0.3.142 smoke FAIL — ${fail.length}` : "\n0.3.142 smoke OK");
for (const msg of fail) console.log(`  - ${msg}`);
process.exit(fail.length ? 1 : 0);
