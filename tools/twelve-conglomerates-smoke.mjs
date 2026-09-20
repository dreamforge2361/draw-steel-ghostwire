#!/usr/bin/env node
/**
 * Twelve Conglomerates lore/rules smoke (0.3.76).
 * Tickers, Council-only AEQ, Lazarus Lifestyle tiers, Twelve roster.
 *
 * Run: node tools/twelve-conglomerates-smoke.mjs
 */
import { readFileSync } from "node:fs";
import { MEGACORPS } from "./lib/megacorps-journals.mjs";

const failures = [];
const ok = (cond, msg) => {
  if (!cond) failures.push(msg);
  else console.log(`  ✓ ${msg}`);
};

console.log("Twelve Conglomerates lore smoke\n");

const tickers = MEGACORPS.map(c => c.ticker).join(",");
ok(tickers === "HAL,FER,MER,CAD,IRN,ARG,VER,OBS,SAN,NYX,AEQ,LAZ", "MEGACORPS ticker lock");
ok(MEGACORPS.find(c => c.ticker === "AEQ")?.name === "Aequitas Mandate", "AEQ name");
ok(MEGACORPS.find(c => c.ticker === "LAZ")?.name === "Lazarus Extract", "LAZ name");
ok(/sells only to the Council/i.test(MEGACORPS.find(c => c.ticker === "AEQ").domain), "AEQ domain is Council-only");

const tickersDoc = readFileSync("docs/rulebook/MEGACORP-TICKERS.md", "utf8");
ok(/Twelve Conglomerates/.test(tickersDoc), "tickers doc says Twelve");
ok(/\*\*AEQ\*\*/.test(tickersDoc) && /Aequitas Mandate/.test(tickersDoc), "AEQ locked");
ok(/\*\*LAZ\*\*/.test(tickersDoc) && /Lazarus Extract/.test(tickersDoc), "LAZ locked");
ok(/only to the Council/.test(tickersDoc) && /single mega acting alone/.test(tickersDoc), "AEQ Council-only sales rule");
ok(/Lifestyle band/.test(tickersDoc) && /includes/.test(tickersDoc), "LAZ Lifestyle bundle in ticker lock");
ok(/brand-aeq/.test(tickersDoc) && /node-host-laz/.test(tickersDoc), "AEQ/LAZ plate filenames documented");

const l1 = readFileSync("docs/manuscript/01-lore/L1-setting-primer.md", "utf8");
ok(/## The Corporate Congress & the Twelve/.test(l1), "L1 Congress heading is Twelve");
ok(/## The Twelve — Conglomerate Profiles/.test(l1), "L1 profiles heading is Twelve");
ok(/### Aequitas Mandate/.test(l1) && /### Lazarus Extract/.test(l1), "L1 full profiles exist");
ok(/Council-only sales \(LOCKED\)/.test(l1), "AEQ Council-only lock in L1");
ok(/Lifestyle → contract \(LOCKED\)/.test(l1), "LAZ Lifestyle lock in L1");
ok(/Writ Inquest/.test(l1) && /Seal Wardens/.test(l1), "AEQ sub-corps");
ok(/White Door Flight/.test(l1), "LAZ sub-corp");
ok(/The Rising Thirteenth: Kestrel Dynamics/.test(l1), "Kestrel is thirteenth-chair climber");
ok(/~2035–2045 — The Ten become the Twelve/.test(l1), "timeline seats AEQ/LAZ as past-to-present");

const lifestyle = readFileSync("docs/raw/26-lifestyle-downtime.md", "utf8");
ok(/## Lazarus Extract contract/.test(lifestyle), "26 has Lazarus section");
ok(/\*\*Basic Extract\*\*/.test(lifestyle) && /\*\*Standard Extract\*\*/.test(lifestyle), "Low/Middle tiers");
ok(/\*\*Priority Extract\*\*/.test(lifestyle) && /White Door/.test(lifestyle), "High/Elite tiers");
ok(/includes\*\* that band’s Lazarus contract/.test(lifestyle) || /includes\*\* that band's Lazarus contract/.test(lifestyle) || /includes that band/.test(lifestyle), "upkeep includes contract");
ok(/no Lifestyle \/ downtime automation/.test(lifestyle) && /Lazarus Extract/.test(lifestyle), "In Foundry notes Lazarus tier");

const wealth = readFileSync("docs/raw/08-kits-gear-wealth.md", "utf8");
ok(/Lazarus Extract/.test(wealth), "08 Lifestyle burn points at Lazarus");

const opposition = readFileSync("docs/raw/25-opposition.md", "utf8");
ok(/Aequitas Mandate/.test(opposition) && /Council-only/.test(opposition), "25 names AEQ Council-only");

const glossary = readFileSync("docs/manuscript/04-back/28-glossary-slang.md", "utf8");
ok(/## The Twelve \(megacorp tickers\)/.test(glossary), "glossary section is Twelve");
ok(/\*\*AEQ\*\*/.test(glossary) && /\*\*LAZ\*\*/.test(glossary), "glossary tickers");
ok(/AEQ seal/.test(glossary) && /white door/.test(glossary), "glossary slang");

const front = readFileSync("docs/raw/00-front-matter.md", "utf8");
ok(/The Twelve/.test(front) && /\*\*AEQ\*\*/.test(front) && /\*\*LAZ\*\*/.test(front), "Ch 0 ticker line is Twelve");

const l3 = readFileSync("docs/manuscript/01-lore/L3-ossian-reach-color.md", "utf8");
ok(/all Twelve are present/.test(l3) && /all Twelve conglomerates present/.test(l3), "L3 current roster is Twelve");

const wire = readFileSync("docs/raw/21-the-wire.md", "utf8");
ok(/Construct Wire visibility \(LOCKED\)/.test(wire), "21 construct auto-see lock");
ok(/Constructs Console \(Lock A\)/.test(wire), "21 Constructs Console lock");
ok(/Meat tokens are not Wire eyes/.test(wire), "21 meat tokens are not Wire eyes");

const veil = readFileSync("docs/raw/22-the-veil.md", "utf8");
ok(/Pet Stamina \(LOCKED\)/.test(veil) && /Extension spirits/.test(veil), "22 pet Stamina lock");

if (failures.length) {
  console.error(`\n${failures.length} failure(s):`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log("\nTwelve Conglomerates lore smoke OK");
