#!/usr/bin/env node
/**
 * F13 smoke (0.3.116): Cover/Conceal — one token toggle, one bane, ranged only.
 *
 * Run: node tools/cover-conceal-smoke.mjs
 * Does not need live Foundry.
 */
import { readFileSync } from "node:fs";
import {
  COVER_CONCEAL_BANES,
  COVER_CONCEAL_ID,
  COVER_CONCEAL_STATUS,
  coverConcealBanes,
  hasCoverConceal,
  isRangedAttack,
} from "../scripts/cover-conceal.mjs";
import { WIRED_STATUS_DEFS } from "../scripts/wired-state.mjs";
import { atLeast } from "./lib/module-version.mjs";

const fail = [];
const ok = [];
const note = (pass, msg) => (pass ? ok : fail).push(pass ? `  ✓ ${msg}` : msg);

const module = JSON.parse(readFileSync("module.json", "utf8"));
const lang = JSON.parse(readFileSync("lang/en.json", "utf8"));
const src = readFileSync("scripts/cover-conceal.mjs", "utf8");
/** Source with every `//` comment line stripped, for "the code does not do X" checks. */
const code = src.replace(/^\s*\/\/.*$/gm, "").replace(/^\s*\*.*$/gm, "");
const boot = readFileSync("scripts/module.mjs", "utf8");
const css = readFileSync("styles/ghostwire.css", "utf8");
const weaponTemplates = JSON.parse(readFileSync("scripts/data/weapon-use-templates.json", "utf8"));

console.log("F13 Cover/Conceal smoke (0.3.116)\n");

console.log("1) Ship surface");
note(atLeast(module.version, "0.3.116"), `module.json is >= 0.3.116 (got ${module.version})`);
note(boot.includes("registerCoverConceal()"), "module.mjs registers registerCoverConceal");
note(boot.includes('import { registerCoverConceal } from "./cover-conceal.mjs"'), "and imports it");

console.log("\n2) One status, Foundry-native");
note(COVER_CONCEAL_ID === "ghostwire-cover-conceal", `status id is ${COVER_CONCEAL_ID}`);
note(COVER_CONCEAL_STATUS._id.length === 16, `_id is exactly 16 characters (got "${COVER_CONCEAL_STATUS._id}", ${COVER_CONCEAL_STATUS._id.length})`);
note(/^[A-Za-z0-9]+$/.test(COVER_CONCEAL_STATUS._id), "_id is a plain alphanumeric document id");
note(COVER_CONCEAL_STATUS.name === "GHOSTWIRE.CoverConceal.Label", "the status name is a lang key");
note(typeof COVER_CONCEAL_STATUS.img === "string" && COVER_CONCEAL_STATUS.img.endsWith(".svg"), "it has an icon");
note(src.includes("CONFIG.statusEffects[COVER_CONCEAL_STATUS.id]"), "it registers into CONFIG.statusEffects by id, like the Wired statuses");
note(boot.includes("CONFIG.statusEffects[status.id]"), "and that is still how module.mjs registers the Wired statuses");
const ids = new Set(Object.values(WIRED_STATUS_DEFS).map(status => status.id));
note(!ids.has(COVER_CONCEAL_ID), "the id does not collide with a Wired status");
note(!Object.values(WIRED_STATUS_DEFS).some(status => status._id === COVER_CONCEAL_STATUS._id), "nor with a Wired status _id");
note(COVER_CONCEAL_STATUS._id !== "gwLinkedStatus00", "sanity: not a copy-paste of the Linked _id");

console.log("\n3) Cover and Conceal are one effect: one bane");
note(COVER_CONCEAL_BANES === 1, `exactly one bane (got ${COVER_CONCEAL_BANES})`);
note(coverConcealBanes({ ranged: true, covered: true }) === 1, "ranged attack on a covered target: 1 bane");
note(coverConcealBanes({ ranged: true, covered: false }) === 0, "ranged attack on an open target: no bane");
note(coverConcealBanes({ ranged: false, covered: true }) === 0, "MELEE attack on a covered target: no bane");
note(coverConcealBanes({ ranged: false, covered: false }) === 0, "melee on an open target: no bane");
note(coverConcealBanes({}) === 0, "no arguments: no bane");
note(coverConcealBanes({ ranged: true, covered: true }) === coverConcealBanes({ ranged: true, covered: true }),
  "it never stacks with itself — the status is a single flag, not a count");

console.log("\n4) Ranged, decided from the ability");
note(isRangedAttack({ distanceType: "ranged", keywords: ["ranged", "strike", "weapon"] }), "a Ghostwire gun is ranged");
note(!isRangedAttack({ distanceType: "melee", keywords: ["melee", "strike", "weapon"] }), "a Ghostwire melee weapon is not");
note(isRangedAttack({ distanceType: "ranged", keywords: [] }), "distance.type ranged alone is enough");
note(!isRangedAttack({ distanceType: "melee", keywords: [] }), "distance.type melee alone is enough to refuse");
note(isRangedAttack({ keywords: ["ranged", "strike"] }), "the ranged keyword alone is enough");
note(!isRangedAttack({ keywords: ["melee", "strike"] }), "the melee keyword alone refuses");
note(!isRangedAttack({ distanceType: "meleeRanged", keywords: ["melee", "ranged", "strike"] }),
  "a melee-AND-ranged weapon does NOT auto-bane — the use pipeline never says which mode was picked");
note(!isRangedAttack({ distanceType: "self", keywords: [] }), "a self-targeted ability is not a ranged attack");
note(!isRangedAttack({ distanceType: "aura", keywords: [] }), "an aura is not a ranged attack");
note(isRangedAttack({ distanceType: "cube", keywords: ["ranged", "area"] }), "a cube thrown from a distance is ranged");
note(isRangedAttack({ distanceType: "line", keywords: ["ranged"] }), "so is a line fired from a distance");
note(!isRangedAttack({}) && !isRangedAttack(), "nothing-shaped is not a ranged attack");

console.log("\n5) Every shipped weapon band classifies");
for (const [band, profile] of Object.entries(weaponTemplates.range)) {
  const kind = profile.type === "melee" ? "melee" : "ranged";
  const keywords = weaponTemplates.keywords[kind];
  const ranged = isRangedAttack({ distanceType: profile.type, keywords });
  note(ranged === (kind === "ranged"), `${band} (${profile.type}) → ${ranged ? "ranged" : "melee"}`);
}

console.log("\n6) Reading the status off a target");
note(hasCoverConceal({ statuses: new Set([COVER_CONCEAL_ID]) }), "a covered actor reads true");
note(!hasCoverConceal({ statuses: new Set(["ghostwire-overlay"]) }), "an Overlay actor does not");
note(!hasCoverConceal({ statuses: new Set() }), "an empty status set does not");
note(!hasCoverConceal(null) && !hasCoverConceal({}), "a missing actor does not throw");

console.log("\n7) It rides Draw Steel's own per-target modifier seam");
note(src.includes("getTargetModifiers"), "it patches AbilityModel#getTargetModifiers");
note(src.includes("modifiers.banes += banes"), "and adds to the banes the system already computed");
note(src.includes("prior.call(this, target)"), "the system's own modifiers (Frightened, Grabbed, Restrained, Surprised) still run first");
note(!/config\.modifiers/.test(code), "it does NOT touch config.modifiers — that would bane every target of a multi-target attack");
note(!/AbilityModel\.prototype\.use/.test(code), "and it does not patch AbilityModel#use, so the Wired gates in module.mjs are untouched");

console.log("\n8) Combat UX only — no F14 / F15 creep");
note(!/flank/i.test(code), "no Flanking (F14)");
note(!/cyborg|crisis/i.test(code), "no Cyborg Crisis (F15)");
note(!/tier|degree|halfCover|threeQuarters/i.test(code), "no cover tiers — Cover and Conceal are the same one effect");
note(!/taint|renown/i.test(code), "nothing else crept in");

console.log("\n9) Settings, lang, CSS");
note(src.includes('"coverConcealChat"'), "setting coverConcealChat is registered");
const strings = lang.GHOSTWIRE.CoverConceal;
note(!!strings, "GHOSTWIRE.CoverConceal exists");
note(strings.Label === "Cover/Conceal", `the status label is the locked name (got "${strings.Label}")`);
note(/ranged/i.test(strings.Hint) && /bane/i.test(strings.Hint), "the hint says ranged + bane");
note(/melee/i.test(strings.Hint), "and that melee is unaffected");
note(strings.Chat.Taken.includes("{actor}") && strings.Chat.Dropped.includes("{actor}"), "both chat lines name the actor");
note(src.includes(`${"$"}{L}.Hint`), "the card prints the rule hint, so the table reads it without opening settings");
note(typeof strings.Settings.Chat.Name === "string" && typeof strings.Settings.Chat.Hint === "string", "the setting has a name and a hint");
note(css.includes(".ghostwire-cover-conceal-card"), "CSS for the chat line");

console.log("\n10) Toggle announcements");
note(src.includes('Hooks.on("createActiveEffect"'), "taking cover is announced");
note(src.includes('Hooks.on("deleteActiveEffect"'), "dropping it is announced");
note(src.includes("userId !== game.user.id"), "one client announces");

console.log("\n11) Director note");
const director = readFileSync("docs/directors/cover-conceal-03116.md", "utf8");
note(director.length > 1500, "docs/directors/cover-conceal-03116.md exists and is not a stub");
note(/ranged/i.test(director) && /melee/i.test(director), "the note states ranged-only");
note(/meleeRanged|melee \*and\* ranged/i.test(director), "and documents the melee-and-ranged Director call");
note(director.includes(COVER_CONCEAL_ID), "and names the status id");

for (const line of ok) console.log(line);
if (fail.length) {
  console.error(`\n${fail.length} failed:`);
  for (const line of fail) console.error(`  ✗ ${line}`);
  process.exit(1);
}
console.log(`\n${ok.length} checks passed.`);
