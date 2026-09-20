#!/usr/bin/env node
/**
 * Deadhead Director journal smoke (B104 content pass).
 *
 * Run: node tools/deadhead-director-smoke.mjs
 * Does not write Scene JSON or touch Gold Line inject.
 */
import { readFileSync } from "node:fs";

const failures = [];
const ok = (cond, msg) => {
  if (!cond) failures.push(msg);
  else console.log(`  ✓ ${msg}`);
};

function readBomFreeJson(path) {
  const buf = readFileSync(path);
  ok(buf[0] !== 0xEF && buf[1] !== 0xBB && buf[2] !== 0xBF, `${path} is BOM-free`);
  return JSON.parse(buf.toString("utf8"));
}

const JOURNAL = "src/packs/runs/deadhead/deadhead-director.json";
const MAP = "src/packs/runs/deadhead/gold-line-map.json";
const MODULE = "module.json";
const SOR = "docs/directors/runs/deadhead/DEADHEAD-GOLD-LINE.md";
const REMAP = "docs/directors/runs/deadhead/GOLD-LINE-CARGO-REMAP.md";
const LANG = "lang/en.json";

const PAGE_KEYS = [
  "Overview",
  "TraceAlert",
  "CastKit",
  "Beat0",
  "Beat1",
  "Beat2",
  "Beat3",
  "Beat4",
  "Beat5",
  "Items",
  "Opposition",
  "FoundryChecklist",
];

console.log("Deadhead Director journal smoke");

const moduleJson = readBomFreeJson(MODULE);
ok(moduleJson.version === "0.3.42", `module.json is 0.3.42 (got ${moduleJson.version})`);

const journal = readBomFreeJson(JOURNAL);
ok(journal._id === "gwDeadheadDirJrn", "director journal id is gwDeadheadDirJrn");
ok(/^[A-Za-z0-9]{16}$/.test(journal._id), "journal _id is 16 alphanumeric");
ok(journal.folder === "gwRunsDeadhead00", "journal sits in Deadhead folder");
ok(journal.sort === 50000, "director journal sorts before map notes");
ok(journal.pages?.length === 12, `journal has 12 pages (got ${journal.pages?.length})`);

const lang = readBomFreeJson(LANG);
ok(lang.GHOSTWIRE.Runs.Journals.DeadheadDirector === "Deadhead — Director", "lang journal name");
for (const key of PAGE_KEYS) {
  ok(typeof lang.GHOSTWIRE.Runs.Pages[key] === "string", `lang page ${key}`);
}

const names = journal.pages.map(p => p.name);
for (const key of PAGE_KEYS) {
  ok(names.includes(`GHOSTWIRE.Runs.Pages.${key}`), `page key ${key} present`);
}

for (const page of journal.pages ?? []) {
  ok(/^[A-Za-z0-9]{16}$/.test(page._id), `page ${page.name} _id is 16 alphanumeric`);
  ok(page._key === `!journal.pages!${journal._id}.${page._id}`, `page ${page.name} _key matches`);
  ok(page.text?.format === 2 && page.text.markdown && page.text.content, `page ${page.name} has markdown+html`);
}

const text = journal.pages.map(p => `${p.text.markdown}\n${p.text.content}`).join("\n");
ok(/¥8,000/.test(text) && /¥14,000/.test(text) && /¥2,000/.test(text), "pay table is Mama 8k / corp 14k / Signal 2k");
ok(/wiped and fragged/.test(text) && /still inside its carry capsule/.test(text), "wipe-if-stop-while-nested is written");
ok(/\+1 per round/.test(text) || /\+1 max per round/.test(text), "Trace +1/round cap is written");
ok(/call-home/.test(text) && /Trace −1/.test(text), "ICE call-home Block → Trace −1");
ok(/AFT FREIGHT/.test(text) && /L1/.test(text) && /R1/.test(text) && /R3/.test(text), "cargo consist L1–R3 is written");
ok(/freight crawl/i.test(text) || /Freight crawl/.test(text) || /aft freight/.test(text), "Beat 2 is freight crawl");
ok(/not a passenger train/i.test(text), "cargo lock is stated");
ok(!/\bPASSENGER\b/.test(text) && !/passenger PA/i.test(text) && !/5 cars/.test(text), "no passenger-train consist");
ok(/hide the Roofs/.test(text) || /hide the \*\*Roofs/.test(text), "Director hides roofs when inside");
ok(/Michael’s live|Michael's live|Michael’s world|Michael manual/.test(text), "Gold Line is Michael's manual scene");
ok(!/ensureGoldLineScene/.test(text), "director journal does not tell Michael to force-inject Gold Line");
ok(!/Draw Steel Heroes|MCDM/i.test(text), "Ghostwire-only (no Draw Steel Heroes / MCDM)");
ok(!/\bdecker\b/i.test(text) && !/\bMatrix\b/.test(text) && !/\bShadowrun\b/i.test(text), "Ghostwire-only player wording");
ok(/Mama’s Deadhead Brief|Mama's Deadhead Brief/.test(text), "Mama brief notes");
ok(/live transaction wafer|ghost ledger/.test(text), "capsule / live wafer notes");
ok(/Corp Enforcer/.test(text) && /Response Lieutenant/.test(text) && /Watchdog ICE/.test(text), "opposition cheat sheet");
ok(/Crew hangout/.test(text) && /Mama’s Club|Mama's Club/.test(text) && /Canyon/.test(text), "scene checklist lists hangout / Mama / canyon");
ok(/Gold Line/.test(text) && /sacred|do \*\*not\*\* inject|Do \*\*not\*\* inject/i.test(text), "Gold Line checklist is manual / do not inject");

const sor = readFileSync(SOR, "utf8");
const remap = readFileSync(REMAP, "utf8");
ok(/cargo maglev/i.test(sor) && /AFT FREIGHT/.test(sor), "SoR still cargo-locked");
ok(/NOT a passenger train/i.test(remap) && /AFT FREIGHT/.test(remap), "cargo remap sidecar still locked");

const map = readBomFreeJson(MAP);
const mapText = map.pages.map(p => `${p.text?.markdown ?? ""}\n${p.text?.content ?? ""}`).join("\n");
ok(/AFT FREIGHT/.test(mapText) && /freight Enforcers/.test(mapText), "map-notes beat page is cargo remap");
ok(!/\bPASSENGER\b/.test(mapText) && !/5 cars/.test(mapText), "map-notes beat page has no passenger consist");

if (failures.length) {
  console.error("\nFAILED:");
  for (const msg of failures) console.error(`  ✗ ${msg}`);
  process.exit(1);
}
console.log("\nAll Deadhead Director smoke checks passed.");
