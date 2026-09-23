#!/usr/bin/env node
/**
 * F15 smoke (0.3.117): Cyborg System Crisis — the 2d6 severity RollTable, and the RAW behind it.
 *
 * The deliverable is a table a Director opens in Foundry and rolls, so the checks that matter are
 * the ones Foundry itself would trip over: a 2d6 formula, five bands that cover 2–12 with no gap and
 * no overlap, document ids the packer will accept, and a `_key` that lands in the encounters pack.
 *
 * Run: node tools/f15-cyborg-crisis-smoke.mjs
 * Does not need live Foundry.
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { atLeast } from "./lib/module-version.mjs";

const fail = [];
const ok = [];
const note = (pass, msg) => (pass ? ok : fail).push(pass ? `  ✓ ${msg}` : msg);

const MOD = "draw-steel-ghostwire";
const DIR = "src/packs/encounters";
const FILE = join(DIR, "cyborg-system-crisis.json");

const module = JSON.parse(readFileSync("module.json", "utf8"));
const lang = JSON.parse(readFileSync("lang/en.json", "utf8"));
const combat = readFileSync("docs/raw/04-combat.md", "utf8");
const ancestries = readFileSync("docs/raw/05-ancestries.md", "utf8");

console.log("F15 Cyborg System Crisis smoke (0.3.117)\n");

console.log("1) Ship surface");
note(atLeast(module.version, "0.3.117"), `module.json is >= 0.3.117 (got ${module.version})`);
note(existsSync(FILE), `${FILE} ships`);
if (!existsSync(FILE)) {
  console.error("\nno table — nothing else to check");
  process.exit(1);
}
const table = JSON.parse(readFileSync(FILE, "utf8"));
const encountersPack = module.packs.find(p => p.path.endsWith("packs/encounters"));
note(!!encountersPack, "module.json still declares the encounters pack");
note(encountersPack?.type === "RollTable", `and it is a RollTable pack (got ${encountersPack?.type})`);

console.log("\n2) Document shape");
note(table._id.length === 16, `_id is exactly 16 characters (got "${table._id}", ${table._id.length})`);
note(/^[A-Za-z0-9]+$/.test(table._id), "_id is a plain alphanumeric document id");
note(table._key === `!tables!${table._id}`, `_key addresses the tables collection (got ${table._key})`);
note(table.name === "GHOSTWIRE.Encounters.Tables.CyborgSystemCrisis", "the name is a lang key");
note(typeof table.img === "string" && table.img.length > 0, "it has an icon");
note(table.displayRoll === true, "the roll shows in chat — the table is meant to be rolled at the table");
note(table.replacement === true, "with replacement: a second Crisis can land on the same band");

console.log("\n3) It is a 2d6 severity table");
note(table.formula === "2d6", `the formula is 2d6 (got ${table.formula})`);
note(Array.isArray(table.results) && table.results.length === 5, `five severity bands (got ${table.results?.length})`);
note(table.results.every(r => r.type === "text"), "every row is a text result — no document lookups to break");
note(table.results.every(r => r.weight === 1), "every row has weight 1 — the 2d6 curve does the weighting");

console.log("\n4) The bands cover 2–12, once each");
const ranges = table.results.map(r => r.range);
note(ranges.every(r => Array.isArray(r) && r.length === 2), "every range is a [low, high] pair");
note(ranges.every(([lo, hi]) => hi >= lo), "and no range runs backwards");
const sorted = [...ranges].sort((a, b) => a[0] - b[0]);
note(sorted[0][0] === 2, `the lowest band starts at 2 (got ${sorted[0][0]})`);
note(sorted.at(-1)[1] === 12, `the highest band ends at 12 (got ${sorted.at(-1)[1]})`);
for (let i = 1; i < sorted.length; i += 1) {
  note(sorted[i][0] === sorted[i - 1][1] + 1,
    `${sorted[i - 1].join("–")} runs straight into ${sorted[i].join("–")} — no gap, no overlap`);
}
const hits = n => ranges.filter(([lo, hi]) => n >= lo && n <= hi).length;
for (let roll = 2; roll <= 12; roll += 1) note(hits(roll) === 1, `a 2d6 of ${roll} finds exactly one row (got ${hits(roll)})`);
note(hits(1) === 0 && hits(13) === 0, "nothing outside 2–12 matches, so a modified roll is clamped by Foundry, not doubled");

console.log("\n5) The Michael-locked ladder");
const BANDS = [
  ["2-3", "Brick", "brick", [2, 3]],
  ["4-5", "Cascade", "cascade", [4, 5]],
  ["6-8", "Limp-Home", "limp-home", [6, 8]],
  ["9-10", "Soft Reboot", "soft-reboot", [9, 10]],
  ["11-12", "Failover", "failover", [11, 12]],
];
const byName = new Map(table.results.map(r => [r.name, r]));
for (const [band, name, severity, range] of BANDS) {
  const row = byName.get(name);
  note(!!row, `${name} is on the table`);
  if (!row) continue;
  note(row.range[0] === range[0] && row.range[1] === range[1], `${name} sits at ${range.join("–")} (got ${row.range.join("–")})`);
  const flags = row.flags?.[MOD] ?? {};
  note(flags.severity === severity, `${name} is machine-readable as "${severity}" (got ${flags.severity})`);
  note(flags.band === band, `${name} carries its band (got ${flags.band})`);
  note(row._id.length === 16 && /^[A-Za-z0-9]+$/.test(row._id), `${name} has a valid 16-character _id`);
  note(row._key === `!tables.results!${table._id}.${row._id}`, `${name}'s _key hangs off the table`);
  note(typeof row.description === "string" && row.description.length > 150, `${name} prints a real result, not a stub`);
}
const ids = new Set(table.results.map(r => r._id));
note(ids.size === table.results.length, "every result _id is distinct");

console.log("\n6) Severity is the point: worse rolls hurt more");
const brick = byName.get("Brick").description;
const failover = byName.get("Failover").description;
note(/no field reboot|There is no field reboot/i.test(brick), "Brick never field-reboots");
note(/Repair Project|goal 60/i.test(brick), "and names the Repair Project that gets them back");
note(/Once per respite/i.test(failover), "Failover is once per respite");
note(/Limp-Home/i.test(failover), "and a second Crisis that respite drops to Limp-Home");
note(/one step/i.test(byName.get("Cascade").description), "Cascade escalates exactly one chrome step");
note(/Destroyed/.test(byName.get("Cascade").description), "and stops at Destroyed");
note(/bane/i.test(byName.get("Cascade").description), "with the no-chrome fallback spelled out");

console.log("\n7) Crisis is not F12, and not a second Integrity track");
const allText = [table.description, ...table.results.map(r => r.description)].join(" ");
note(/2d6/.test(table.description), "the table description says to roll 2d6");
note(/−1|-1/.test(table.description) && /\+1/.test(table.description), "and lists the soft / military modifiers");
note(/maneuver/i.test(table.description), "and the adjacent-ally maneuver reboot");
note(/not/i.test(table.description) && /Body Integrity/i.test(table.description),
  "and says Crisis is not a Body Integrity debit");
note(/never deletes an Item/i.test(allText), "and never deletes an Item");
note(/Suppressed \/ Damaged \/ Destroyed|Suppressed/.test(table.description),
  "it names the F12 chrome track explicitly so nobody reuses it as Crisis state");
note(!/flags\.draw-steel-ghostwire\.chrome|chromeState/.test(JSON.stringify(table)),
  "the table never writes an F12 chrome flag");

console.log("\n8) RAW — the stubs are gone");
note(!/A full System Crisis table is not locked yet/.test(combat), "04-combat no longer says the table is unlocked");
note(!/the Director adjudicates severity/.test(combat), "nor that the Director adjudicates severity");
note(!/A full System Crisis table is not yet defined/.test(ancestries), "05-ancestries no longer says it is undefined");
note(/Severity — roll 2d6|roll \*\*2d6\*\*/.test(combat), "04-combat prints the 2d6 instruction");
for (const [, name] of BANDS) note(combat.includes(`**${name}**`), `04-combat prints the ${name} row`);
note(/no dying saves and no dying strikes/i.test(combat), "and that there are no dying saves");
note(/Magic healing does nothing/i.test(combat), "and that magic healing does nothing");
note(/goal 60/.test(combat), "and the Brick Repair Project goal");
note(/2d6 severity table/.test(ancestries), "05-ancestries points at the 2d6 table");
note(/Body Integrity 25/.test(ancestries), "and holds BI 25 unchanged");
note(/never deletes an Item/.test(ancestries), "and repeats the no-Item-deletion rule");
note(/f15-cyborg-system-crisis\.md/.test(combat), "04-combat points at the director note");

console.log("\n9) Lang");
note(lang.GHOSTWIRE.Encounters.Tables.CyborgSystemCrisis === "Cyborg System Crisis",
  `the table's visible name resolves (got ${lang.GHOSTWIRE.Encounters.Tables.CyborgSystemCrisis})`);

console.log("\n10) A regen does not eat the table");
const generator = readFileSync("tools/encounters-to-tables.mjs", "utf8");
note(generator.includes("cyborg-system-crisis.json"), "encounters-to-tables.mjs keeps the hand-authored table");
note(/KEEP\.has\(entry\)/.test(generator), "the wipe skips it explicitly");
const siblings = readdirSync(DIR).filter(f => f.endsWith(".json"));
note(siblings.includes("city.json") && siblings.includes("flats.json") && siblings.includes("wilds.json"),
  "the generated zone tables still ship alongside it");

console.log("\n11) No auto-trigger script this wave");
note(!existsSync("scripts/cyborg-crisis.mjs"), "no scripts/cyborg-crisis.mjs — rolling the table IS the Foundry support");
note(!readFileSync("scripts/module.mjs", "utf8").includes("cyborg-crisis"), "and module.mjs registers nothing for it");

console.log("\n12) Director note");
const director = readFileSync("docs/directors/f15-cyborg-system-crisis.md", "utf8");
note(director.length > 1500, "docs/directors/f15-cyborg-system-crisis.md exists and is not a stub");
note(/compendium|encounters/i.test(director), "the note says where to find the table");
note(/2d6/.test(director), "and what to roll");
note(/F12/.test(director) && /not/i.test(director), "and carries the explicit not-F12 language");
note(/NPC/i.test(director), "and covers Director-flagged NPC Cyborgs");
for (const [, name] of BANDS) note(director.includes(name), `and names the ${name} row`);

for (const line of ok) console.log(line);
if (fail.length) {
  console.error(`\n${fail.length} failed:`);
  for (const line of fail) console.error(`  ✗ ${line}`);
  process.exit(1);
}
console.log(`\n${ok.length} checks passed.`);
