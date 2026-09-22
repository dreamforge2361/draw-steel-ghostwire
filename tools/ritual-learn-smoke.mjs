#!/usr/bin/env node
/**
 * 0.3.89 — Mark Learned smoke (scripts/rituals.mjs).
 * - The gate reads flags.draw-steel-ghostwire.ritual.formula, and falls back to the RitualFormula gear tag.
 * - Nothing else on a hero sheet (mods, chems, plain gear) is mistaken for a Formula.
 * - Pack Formulas ship unlearned; the pregens who studied Ward the Room read as learned.
 * - Every lang key the context menu, chat card and sheet line name resolves in lang/en.json.
 *
 * Run: node tools/ritual-learn-smoke.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { formulaSubtitle, isLearned, isRitualFormula, ritualData } from "../scripts/rituals.mjs";

const MODULE = "draw-steel-ghostwire";
const DIR = "src/packs/gear/general/ritual-formulas";
const failures = [];
const ok = (cond, msg) => { if (!cond) failures.push(msg); else console.log(`  ✓ ${msg}`); };
const read = p => JSON.parse(readFileSync(p, "utf8").replace(/^﻿/, ""));
const lang = read("lang/en.json");
const t = key => key.split(".").reduce((o, k) => o?.[k], lang);

// ---------- the gate ----------
const flagged = { flags: { [MODULE]: { ritual: { formula: true, learned: false, family: "Ward", magnitudeText: "1", leaders: "General" } } } };
const tagged = { flags: { [MODULE]: { gear: { tags: ["RitualFormula"] } } } };
ok(isRitualFormula(flagged) && isRitualFormula(tagged), "formula flag and RitualFormula tag both open the menu");
ok(!isRitualFormula(null) && !isRitualFormula({}) && !isRitualFormula({ flags: { [MODULE]: { gear: { tags: ["Wired"] } } } }), "plain gear is not a Formula");
ok(!isRitualFormula({ flags: { [MODULE]: { mod: { installedOn: "abc" } } } }), "a mod is not a Formula");
ok(!isLearned(flagged) && !isLearned(tagged) && !isLearned({}), "unlearned by default (missing flag reads unlearned)");
ok(isLearned({ flags: { [MODULE]: { ritual: { formula: true, learned: true } } } }), "learned:true reads learned");
ok(ritualData(tagged) !== null && !ritualData(tagged).formula, "tag-only Formula still yields a ritual block");
ok(formulaSubtitle(flagged) === "Ward · Magnitude 1 · General", `subtitle reads "${formulaSubtitle(flagged)}"`);
ok(formulaSubtitle(tagged) === "" && formulaSubtitle({}) === "", "subtitle empty when the card carried no detail");

// ---------- pack + pregen state ----------
const files = readdirSync(DIR).filter(f => f.endsWith(".json") && f !== "_folder.json");
ok(files.length > 0 && files.every(f => { const it = read(join(DIR, f)); return isRitualFormula(it) && !isLearned(it); }),
  `all ${files.length} pack Formulas read as unlearned Formulas`);

for (const slug of ["kaes-vahn-estal", "vessa-corran-dov", "sabbat-vane"]) {
  const formula = read(`src/packs/pregens/${slug}.json`).items.find(i => i._id === "gwRitWardRoom000");
  ok(isRitualFormula(formula) && isLearned(formula), `${slug}: Ward the Room reads learned (menu offers Mark unlearned)`);
}

// ---------- lang ----------
const KEYS = ["Menu.MarkLearned", "Menu.MarkUnlearned", "Learned", "Unlearned", "SheetLearned", "SheetNotLearned", "Chat.Learned", "Chat.Unlearned"];
for (const key of KEYS) ok(typeof t(`GHOSTWIRE.Ritual.${key}`) === "string", `lang: GHOSTWIRE.Ritual.${key}`);
ok(/\{actor\}/.test(t("GHOSTWIRE.Ritual.Chat.Learned")) && /\{item\}/.test(t("GHOSTWIRE.Ritual.Chat.Learned")), "chat card names the student and the Formula");

// Both directions: every key above is actually used, and rituals.mjs names no key that lang lacks.
const source = readFileSync("scripts/rituals.mjs", "utf8");
const used = [...source.matchAll(/(?:["`]|\$\{L\}\.)(Menu\.[A-Za-z]+|Chat\.[A-Za-z]+|Learned|Unlearned|Sheet[A-Za-z]+)(?:["`])?/g)].map(m => m[1]);
ok(KEYS.every(k => used.includes(k)), `rituals.mjs uses every Ritual lang key (missing: ${KEYS.filter(k => !used.includes(k)).join(", ") || "none"})`);
ok(used.every(k => typeof t(`GHOSTWIRE.Ritual.${k}`) === "string"), `every key rituals.mjs names exists (${[...new Set(used)].length} keys)`);
ok(/registerRituals/.test(readFileSync("scripts/module.mjs", "utf8")), "module.mjs registers the hooks");
const cmpVer = (a, b) => { const p = v => v.split(".").map(Number); const [x, y] = [p(a), p(b)]; for (let i = 0; i < 3; i++) if ((x[i] ?? 0) !== (y[i] ?? 0)) return (x[i] ?? 0) - (y[i] ?? 0); return 0; };
ok(cmpVer(read("module.json").version, "0.3.89") >= 0, `module.json is >= 0.3.89 (Mark Learned shipped in 0.3.89; now ${read("module.json").version})`);

if (failures.length) {
  console.error(`\nMark Learned smoke FAILED:\n  - ${failures.join("\n  - ")}`);
  process.exit(1);
}
console.log("\nMark Learned smoke passed");
