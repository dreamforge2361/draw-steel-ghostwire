#!/usr/bin/env node
/**
 * F11 smoke (0.3.117): Critical Roll detection, feedback wiring, the rule card, and automation.
 *
 * 0.3.117 retired natural doubles from RAW and made Ghostwire Criticals Draw Steel Criticals: a
 * natural 19 or 20, always read at tier 3, and a main-action ability hands back a main action.
 * Sections 14 and 15 assert that pass end to end, including that no doubles rule survives in RAW.
 *
 * Detection is executed for real against fake message shapes built to match what Draw Steel 1.1.2
 * actually creates (`message.rolls` plus `system.parts[].rolls`, PowerRoll-shaped objects carrying
 * `options.criticalThreshold` and a first dice term). No live Foundry.
 *
 * Run: node tools/crit-feedback-smoke.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import {
  CRIT_CARD_LINES,
  CRIT_KINDS,
  CRIT_SOUND,
  CRIT_THRESHOLD,
  CRIT_TIER,
  MAIN_ACTION_TYPE,
  criticalFromNatural,
  criticalFromNaturals,
  criticalTier,
  criticalTierProblems,
  grantsExtraMainAction,
  critKindFromParts,
  isPowerRollLike,
  messageCritical,
  naturalFromRoll,
  ruleCardLines,
} from "../scripts/crit-feedback.mjs";
import { atLeast } from "./lib/module-version.mjs";

const fail = [];
const ok = [];
const note = (pass, msg) => (pass ? ok : fail).push(pass ? `  ✓ ${msg}` : msg);

const module = JSON.parse(readFileSync("module.json", "utf8"));
const lang = JSON.parse(readFileSync("lang/en.json", "utf8"));
const src = readFileSync("scripts/crit-feedback.mjs", "utf8");
const boot = readFileSync("scripts/module.mjs", "utf8");
const sfx = readFileSync("scripts/sfx.mjs", "utf8");
const css = readFileSync("styles/ghostwire.css", "utf8");

/** A PowerRoll-shaped stand-in: what matters is dice[0].total and options.criticalThreshold. */
const powerRoll = (natural, { threshold = CRIT_THRESHOLD } = {}) => ({
  dice: [{ total: natural, results: [{ result: natural - 5, active: true }, { result: 5, active: true }] }],
  options: { criticalThreshold: threshold },
  get isCritical() { return natural >= threshold; },
});
/** A DamageRoll-shaped stand-in: dice, no criticalThreshold, no isCritical. */
const damageRoll = total => ({ dice: [{ total }], options: {} });

const abilityMessage = (natural, extra = []) => ({
  rolls: [powerRoll(natural), ...extra],
  system: {
    parts: {
      abilityUse000000: { type: "abilityUse", abilityUuid: "Item.x" },
      tier3Result00000: { type: "abilityResult", tier: 3, rolls: [powerRoll(natural)] },
    },
  },
});
const testMessage = natural => ({
  rolls: [powerRoll(natural)],
  system: { parts: { test000000000000: { type: "test", rolls: [powerRoll(natural)] } } },
});

console.log("F11 Critical Roll feedback + automation smoke (0.3.117)\n");

console.log("1) Ship surface");
note(atLeast(module.version, "0.3.117"), `module.json is >= 0.3.117 (got ${module.version})`);
note(boot.includes("registerCritFeedback()"), "module.mjs registers registerCritFeedback");
note(boot.includes('import { registerCritFeedback } from "./crit-feedback.mjs"'), "and imports it");
note(CRIT_THRESHOLD === 19, `threshold is Draw Steel's 19 (got ${CRIT_THRESHOLD})`);

console.log("\n2) Natural-result reading");
note(naturalFromRoll(powerRoll(19)) === 19, "reads dice[0].total");
note(naturalFromRoll({ dice: [{ results: [{ result: 10 }, { result: 9 }] }] }) === 19, "falls back to summing active results");
note(naturalFromRoll({ dice: [{ results: [{ result: 10 }, { result: 9 }, { result: 2, active: false }] }] }) === 19,
  "a dropped die (3d10kh2) does not count");
note(naturalFromRoll({ terms: [{ results: [{ result: 10 }, { result: 10 }] }] }) === 20, "falls back to the first dice term");
note(naturalFromRoll(null) === null && naturalFromRoll({}) === null, "an unevaluated / absent roll reads null");

console.log("\n3) Only power rolls count");
note(isPowerRollLike(powerRoll(12)), "a PowerRoll counts");
note(!isPowerRollLike(damageRoll(19)), "a damage roll does not — a 19 of damage is not a critical");
note(!isPowerRollLike(null) && !isPowerRollLike({}), "nothing-shaped does not count");
note(!messageCritical(abilityMessage(11, [damageRoll(20)])).critical,
  "a natural 11 attack that rolled 20 damage is NOT a critical");

console.log("\n4) The rule itself: natural 19 or 20");
for (const [natural, critical] of [[2, false], [17, false], [18, false], [19, true], [20, true]]) {
  note(criticalFromNatural(natural).critical === critical, `natural ${natural} → ${critical ? "critical" : "not critical"}`);
  note(messageCritical(abilityMessage(natural)).critical === critical, `an ability message at natural ${natural} agrees`);
  note(messageCritical(testMessage(natural)).critical === critical, `a test message at natural ${natural} agrees`);
}
note(criticalFromNatural(20).nat20 && !criticalFromNatural(19).nat20, "nat20 is only 20");
note(messageCritical(abilityMessage(20)).nat20, "a message carries nat20 through");
note(criticalFromNatural(null).critical === false, "a null natural is never critical");
note(criticalFromNaturals([3, 19, 7]).natural === 19, "several rolls take the best natural");
note(criticalFromNaturals([]).critical === false, "no rolls is not a critical");

console.log("\n5) Edges, banes and bonuses do not make a critical");
// The unmodified base roll and the per-target rolls share terms[0], so the natural is one number;
// what a bane changes is the total, which this code never reads.
const baned = {
  rolls: [powerRoll(11)],
  system: {
    parts: {
      abilityUse000000: { type: "abilityUse" },
      tier1Result00000: { type: "abilityResult", tier: 1, rolls: [{ ...powerRoll(11), total: 31 }] },
    },
  },
};
note(!messageCritical(baned).critical, "a natural 11 with a total of 31 is not a critical");
note(!src.includes("roll.total") && !src.includes(".total >= threshold"), "the code never compares a roll TOTAL to the threshold");
note(src.includes("dice?.[0]") || src.includes("dice[0]"), "it reads the first dice term");

console.log("\n6) A Director's raised threshold is honoured");
const raised = { rolls: [powerRoll(19, { threshold: 20 })], system: { parts: { t: { type: "test", rolls: [] } } } };
note(!messageCritical(raised).critical, "natural 19 against a threshold of 20 is not a critical");
const raised20 = { rolls: [powerRoll(20, { threshold: 20 })], system: { parts: { t: { type: "test", rolls: [] } } } };
note(messageCritical(raised20).critical, "natural 20 against a threshold of 20 is");

console.log("\n7) Which pipeline");
note(critKindFromParts(["abilityUse", "abilityResult"]) === "ability", "ability parts → ability");
note(critKindFromParts(["abilityUse"]) === "ability", "an ability use with no roll part still reads ability");
note(critKindFromParts(["test"]) === "test", "a test part → test");
note(critKindFromParts(["project"]) === null, "a project roll is deliberately out of scope");
note(critKindFromParts([]) === null && critKindFromParts(null) === null, "no parts → no kind");
note(messageCritical(abilityMessage(20)).kind === "ability", "an ability message reports kind ability");
note(messageCritical(testMessage(20)).kind === "test", "a test message reports kind test");
note(!messageCritical({ rolls: [powerRoll(20)], system: { parts: { p: { type: "project", rolls: [] } } } }).critical,
  "a critical project roll gets no feedback");
note(!messageCritical({ content: "hello" }).critical, "a plain chat message is never a critical");
note(CRIT_KINDS.join(",") === "ability,test", "the two supported kinds");

console.log("\n8) Parts are read as a ModelCollection, not an object");
// `system.parts` is a CollectionField: at runtime it is a Map with `.contents`, and Object.values()
// on it returns nothing. This is the trap that silently broke B40's first cut.
const collectionShaped = {
  rolls: [],
  system: { parts: { contents: [{ constructor: { TYPE: "test" }, rolls: [powerRoll(19)] }] } },
};
note(messageCritical(collectionShaped).critical, "a .contents-shaped parts collection is read");
note(messageCritical(collectionShaped).kind === "test", "and its part type comes off the constructor");
note(src.includes(".contents"), "the code reads .contents");

console.log("\n9) The rule card");
note(CRIT_CARD_LINES.ability.length >= 2, "the ability card has at least two bullets");
note(CRIT_CARD_LINES.test.length >= 2, "the test card has at least two bullets");
note(ruleCardLines("project").length === 0, "an unsupported kind has no bullets");
const card = lang.GHOSTWIRE.Crit.Card;
note(typeof card.Title === "string" && card.Title.length > 0, "the card has a title");
note(card.Lead.includes("{natural}") && card.Lead.includes("{kind}"), "the lead prints the natural and the kind");
for (const kind of CRIT_KINDS) {
  for (const key of CRIT_CARD_LINES[kind]) {
    const text = card[kind]?.[key];
    note(typeof text === "string" && text.trim().length > 20, `Card.${kind}.${key} is non-empty`);
    // Ghostwire paraphrase, not a book dump: each bullet is one short sentence's worth.
    note(typeof text === "string" && text.length < 320, `Card.${kind}.${key} is a paraphrase, not a page (${text?.length} chars)`);
  }
}
const allCardText = CRIT_KINDS.flatMap(kind => CRIT_CARD_LINES[kind].map(key => card[kind][key]))
  .concat([card.Title, card.Lead, card.Nat20, card.Natural]).join(" ");
note(allCardText.length < 1400, `the whole card is short (${allCardText.length} chars) — a reminder, not licensed prose`);
note(/tier 3/i.test(allCardText), "it says what a critical actually gives: tier 3");
note(/main action/i.test(card.ability.Action), "and that an ability critical hands back a main action");
note(/natural/i.test(card.Natural) && /19/.test(card.Natural) && /20/.test(card.Natural),
  "and that only the natural 19 or 20 counts");
note(/Cover\/Conceal/.test(card.Natural), "it names Cover/Conceal as one of the things that does NOT make a critical");
note(!/Draw Steel Creator License|DRAW_STEEL\./.test(allCardText), "no system string keys leaked into the card");
note(CRIT_KINDS.every(kind => typeof lang.GHOSTWIRE.Crit.Kinds[kind] === "string"), "each kind has a label");

console.log("\n10) Settings (B40 patterns)");
const SETTING_LANG = {
  critSfxEnabled: "Sfx",
  critSfxSrc: "SfxSrc",
  critVfxEnabled: "Vfx",
  critRuleCard: "RuleCard",
  critRuleCardWhisper: "RuleCardWhisper",
};
for (const [key, langKey] of Object.entries(SETTING_LANG)) {
  note(src.includes(`"${key}"`), `setting ${key} is registered`);
  const strings = lang.GHOSTWIRE.Crit.Settings[langKey];
  note(typeof strings?.Name === "string" && typeof strings?.Hint === "string", `lang for ${key} resolves`);
  note(src.includes(`${"$"}{L}.Settings.${langKey}.Name`), `${key} points at Settings.${langKey}`);
}
note(/scope: "client"/.test(src.slice(src.indexOf("critVfxEnabled"))), "the VFX setting is client-scoped");
note(src.includes('game.settings.get(MODULE_ID, "sfxVolume")'), "crit SFX reuses B40's sfxVolume rather than adding a second volume");
note(sfx.includes('game.settings.register(MODULE_ID, "sfxVolume"'), "and B40 still owns that setting");
note(sfx.includes('Hooks.on("createChatMessage"'), "B40's ability-use SFX hook is untouched");
note(sfx.includes("abilityUse"), "B40 still fires on the abilityUse part");

console.log("\n11) SFX / VFX wiring");
note(CRIT_SOUND.endsWith(".ogg"), "the default crit sound is an audio file");
note(existsSync(CRIT_SOUND.replace(/^modules\/draw-steel-ghostwire\//, "")), `${CRIT_SOUND} is already in-tree — no new audio binary ships`);
note(src.includes("foundry.audio.AudioHelper.play"), "playback uses AudioHelper, like B40");
note(src.includes('channel: "interface"'), "on the interface channel, so Foundry's own mute applies");
note(src.includes('Hooks.on("renderChatMessageHTML"'), "the VFX rides the render hook, so every client sees it");
note(src.includes("ghostwire-crit-flash"), "the flash element has a class");
note(css.includes(".ghostwire-crit-flash"), "CSS for the flash");
note(css.includes("@keyframes ghostwire-crit-flash"), "and an animation for it");
note(css.includes(".ghostwire-crit-card"), "CSS for the rule card");
note(css.includes(".chat-message.ghostwire-crit"), "CSS for the glow on the crit roll card");

console.log("\n12) No loops, no double-fire");
note(src.includes('message.getFlag?.(MODULE_ID, "critCard")'), "the rule card is flagged and skipped on the way back in");
note(src.includes("userId !== game.user.id"), "one client fires the sound and posts the card");
note(src.includes("_ghostwireCritFlashed"), "a re-render does not re-flash");
note(/Date\.now\(\) - \(message\.timestamp/.test(src), "and scrolling the log back does not flash old criticals");

console.log("\n13) Director note");
const director = readFileSync("docs/directors/crit-feedback-03116.md", "utf8");
note(director.length > 1500, "docs/directors/crit-feedback-03116.md exists and is not a stub");
note(/natural 19 or 20/i.test(director), "the note states the trigger");
note(/never reads a roll total/i.test(director), "and that a total can never fake a critical");
note(/sword-crit\.ogg/.test(director), "and names the in-tree sound");

console.log("\n14) 0.3.117 — Ghostwire Criticals are Draw Steel Criticals");
note(CRIT_TIER === 3, `a critical is read at tier ${CRIT_TIER}`);
note(criticalTier(true, 1) === 3, "a critical reported at tier 1 is still read at tier 3");
note(criticalTier(true, undefined) === 3, "and a critical with no reported tier is tier 3");
note(criticalTier(false, 2) === 2, "an ordinary roll keeps the tier the system reported");
note(criticalTier(false, 9) === 3 && criticalTier(false, 0) === 1, "and a nonsense tier is clamped into 1-3");
note(criticalTier(false, null) === 1, "an absent tier reads tier 1");
note(criticalTierProblems([{ type: "abilityResult", tier: 3 }]).length === 0,
  "a tier-3 ability result on a critical is no problem — the system already did the work");
note(criticalTierProblems([{ type: "abilityResult", tier: 1 }]).join() === "1",
  "a tier-1 ability result IS reported, so a system change cannot quietly pay tier-1 damage on a nat 20");
note(criticalTierProblems([{ type: "test", tier: 1 }]).length === 0, "non-ability parts are not tier problems");
note(criticalTierProblems().length === 0, "nothing-shaped is not a tier problem");
note(messageCritical(abilityMessage(20)).tier === 3, "a critical ability message reports tier 3");
note(messageCritical(abilityMessage(11)).tier === 3, "and a non-critical reports the tier the system built");

// The extra main action: an ability used as a main action, and nothing else.
note(MAIN_ACTION_TYPE === "main", `the ability type that earns another one is "${MAIN_ACTION_TYPE}"`);
note(grantsExtraMainAction({ kind: "ability", abilityType: "main" }), "a main-action ability hands back a main action");
note(!grantsExtraMainAction({ kind: "ability", abilityType: "maneuver" }), "a maneuver does not");
note(!grantsExtraMainAction({ kind: "ability", abilityType: "triggered" }), "a triggered action does not");
note(!grantsExtraMainAction({ kind: "ability", abilityType: "free" }), "a free action does not");
note(!grantsExtraMainAction({ kind: "test", abilityType: "main" }), "a critical on a TEST does not — there is no main action to repeat");
note(!grantsExtraMainAction({}) && !grantsExtraMainAction(), "nothing-shaped hands back nothing");
note(src.includes("data-ghostwire-crit-extra"), "the rule card carries the extra-main-action affordance");
note(typeof lang.GHOSTWIRE.Crit.Card.ExtraAction === "string", "and it has a label");
note(/main action/i.test(lang.GHOSTWIRE.Crit.Chat.ExtraTaken), "taking it says so in chat");
note(src.includes("ghostwire-crit-badge"), "the roll's own card gets a Critical badge");
note(/tier 3/i.test(lang.GHOSTWIRE.Crit.BadgeHint), "whose tooltip states the tier-3 rule");
note(css.includes(".ghostwire-crit-badge"), "CSS for the badge");
note(css.includes(".ghostwire-crit-extra"), "and for the affordance");

// A natural double is now just a number. [7,7] is 14.
const doubles = face => ({
  dice: [{ total: face * 2, results: [{ result: face, active: true }, { result: face, active: true }] }],
  options: { criticalThreshold: CRIT_THRESHOLD },
});
const doublesMessage = face => ({
  rolls: [doubles(face)],
  system: { parts: { test000000000000: { type: "test", rolls: [doubles(face)] } } },
});
for (const face of [1, 3, 5, 7, 9]) {
  note(!messageCritical(doublesMessage(face)).critical, `a natural [${face},${face}] is NOT a critical — doubles are retired`);
}
note(messageCritical(doublesMessage(10)).critical, "a natural [10,10] is a critical because it is a 20, not because it matched");
// Source with every comment stripped: the file still *mentions* retired doubles in its header,
// and that prose is the record of the change, not a rule.
const critCode = src.replace(/^\s*\/\/.*$/gm, "").replace(/^\s*\*.*$/gm, "");
note(!/double/i.test(critCode), "crit-feedback.mjs holds no doubles rule");

console.log("\n15) RAW retired natural doubles");
const tests = readFileSync("docs/raw/03-tests-power-rolls.md", "utf8");
note(/^## Criticals$/m.test(tests), "03-tests has a Criticals section");
note(!/^## Natural doubles and criticals$/m.test(tests), "and no Natural-doubles-and-criticals section");
note(/A \*\*critical\*\* is a natural \*\*19 or 20\*\*/.test(tests), "it defines a critical as a natural 19 or 20");
note(/gain \*\*another main action\*\*/.test(tests), "and that a main-action ability hands back a main action");
note(/\*\*tier 3\*\* result/.test(tests), "and that the roll is read at tier 3");
note(!/natural double is Ghostwire/.test(tests), "the old doubles-are-the-cue sentence is gone");
note(!/is two matching faces on the first two dice/.test(tests), "and so is the doubles definition");
note(/only the natural 19 or 20 is a critical/.test(tests), "RAW says so out loud, so nobody house-rules doubles back in");
note(!/extra damage equal to your highest characteristic/.test(tests), "and the retired characteristic-damage rider is gone");
note(/Natural \*\*19 or 20\*\*/.test(tests), "the chapter summary table prints the new rule");
note(!/Natural doubles \/ criticals/.test(tests), "and no longer prints the old one");

for (const line of ok) console.log(line);
if (fail.length) {
  console.error(`\n${fail.length} failed:`);
  for (const line of fail) console.error(`  ✗ ${line}`);
  process.exit(1);
}
console.log(`\n${ok.length} checks passed.`);
