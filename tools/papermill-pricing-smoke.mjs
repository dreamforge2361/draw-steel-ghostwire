#!/usr/bin/env node
/**
 * F23 smoke (0.3.116): the Papermill identity price ladder.
 *
 * The prices themselves are the deliverable, so they are asserted by exact value rather than by
 * shape alone — a later pass that re-cuts the ladder is expected to edit this table too, which is
 * the point: the number a player pays should never move without someone looking at it.
 *
 * Run: node tools/papermill-pricing-smoke.mjs
 * Does not need live Foundry.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { getPreset, listingsFromItems, matchPresetItem, FOLDER_IDS } from "../scripts/kiosk-presets.mjs";
import { catalogPrice } from "../scripts/kiosk.mjs";
import { effectiveQuality, isIdentityItem } from "../scripts/identity.mjs";
import { atLeast } from "./lib/module-version.mjs";

const fail = [];
const ok = [];
const note = (pass, msg) => (pass ? ok : fail).push(pass ? `  ✓ ${msg}` : msg);

const MOD = "draw-steel-ghostwire";
const DIR = "src/packs/gear/identity";

/** The 0.3.116 Michael-locked ladder: _dsid → [lang key, ¥]. */
const LADDER = Object.freeze({
  "burn-sin": ["BurnSin", 500],
  "lanyard-forgery": ["LanyardForgery", 2500],
  "paper-ghost-sin": ["PaperGhostSin", 3500],
  "clinic-credential-forgery": ["ClinicCredentialForgery", 8000],
  "carry-permit-forgery": ["CarryPermitForgery", 12000],
  "broker-sin": ["BrokerSin", 15000],
  "wire-ticket-forgery": ["WireTicketForgery", 28000],
  "deep-cover-sin": ["DeepCoverSin", 45000],
  "cradle-seeded-sin": ["CradleSeededSin", 110000],
});

/** Prices before the pass, so the smoke can prove the ladder actually moved up. */
const PRIOR = Object.freeze({
  "burn-sin": 400,
  "lanyard-forgery": 1200,
  "paper-ghost-sin": 1500,
  "clinic-credential-forgery": 3500,
  "carry-permit-forgery": 4000,
  "broker-sin": 6000,
  "wire-ticket-forgery": 15000,
  "deep-cover-sin": 25000,
  "cradle-seeded-sin": 90000,
});

const module = JSON.parse(readFileSync("module.json", "utf8"));
const lang = JSON.parse(readFileSync("lang/en.json", "utf8"));
const skus = readdirSync(DIR)
  .filter(f => f.endsWith(".json") && f !== "_folder.json")
  .map(f => JSON.parse(readFileSync(join(DIR, f), "utf8")));
const byDsid = new Map(skus.map(doc => [doc.system._dsid, doc]));
const priceOf = doc => doc.flags[MOD].gear.price;
const yen = n => `¥${n.toLocaleString("en-US")}`;

console.log("F23 Papermill identity pricing smoke (0.3.116)\n");

console.log("1) Ship surface");
note(atLeast(module.version, "0.3.116"), `module.json is >= 0.3.116 (got ${module.version})`);
note(skus.length === Object.keys(LADDER).length, `${Object.keys(LADDER).length} Identity SKUs on the shelf (got ${skus.length})`);
note([...byDsid.keys()].every(dsid => dsid in LADDER), "every shipped SKU is on the locked ladder");

console.log("\n2) The ladder");
for (const [dsid, [, price]] of Object.entries(LADDER)) {
  const doc = byDsid.get(dsid);
  note(!!doc, `${dsid} ships`);
  if (!doc) continue;
  note(priceOf(doc) === price, `${dsid} is ${yen(price)} (got ${yen(priceOf(doc))})`);
  note(priceOf(doc) >= PRIOR[dsid], `${dsid} did not get cheaper (${yen(PRIOR[dsid])} -> ${yen(priceOf(doc))})`);
}

console.log("\n3) Michael locks");
const burn = priceOf(byDsid.get("burn-sin"));
note(burn >= 400 && burn <= 600, `Burn SIN stays the floor of existence, 400-600 (got ${yen(burn)})`);
const rungs = Object.entries(LADDER).map(([dsid]) => priceOf(byDsid.get(dsid)));
note(rungs.every((p, i) => i === 0 || p > rungs[i - 1]), `every rung steps up (${rungs.map(yen).join(" < ")})`);

const illegalBand = ["restricted", "military"];
const illegal = skus.filter(d => illegalBand.includes(d.flags[MOD].gear.availability));
const street = skus.filter(d => d.flags[MOD].gear.availability === "street");
note(illegal.length === 6 && street.length === 3, `three Street rows, six Restricted/Military (got ${street.length}/${illegal.length})`);
note(Math.min(...illegal.map(priceOf)) > Math.max(...street.map(priceOf)),
  `the cheapest Restricted row (${yen(Math.min(...illegal.map(priceOf)))}) costs more than the dearest Street row (${yen(Math.max(...street.map(priceOf)))})`);
note(priceOf(byDsid.get("carry-permit-forgery")) >= 3 * PRIOR["carry-permit-forgery"],
  "Carry Permit — the most-wanted paper at the table — took the biggest multiplier (>= x3)");
for (const dsid of ["clinic-credential-forgery", "broker-sin"]) {
  note(priceOf(byDsid.get(dsid)) >= 2 * PRIOR[dsid], `${dsid} is meaningfully higher (>= x2)`);
}
for (const dsid of ["lanyard-forgery", "paper-ghost-sin"]) {
  note(priceOf(byDsid.get(dsid)) >= 2 * PRIOR[dsid], `${dsid} street forgery is no longer pocket change (>= x2)`);
}
for (const dsid of ["wire-ticket-forgery", "deep-cover-sin", "cradle-seeded-sin"]) {
  note(priceOf(byDsid.get(dsid)) > PRIOR[dsid], `${dsid} stays premium and bumped further`);
}

console.log("\n4) SIN ladder still tracks quality");
const sins = skus.filter(d => d.flags[MOD].identity.kind === "sin")
  .sort((a, b) => a.flags[MOD].identity.quality - b.flags[MOD].identity.quality);
note(sins.length === 5, `five SIN rungs (got ${sins.length})`);
const sinPrices = sins.map(priceOf);
note(sinPrices.every((p, i) => i === 0 || p > sinPrices[i - 1]), `SIN yen climbs with quality (${sinPrices.map(yen).join(" < ")})`);
note(sins.every(d => effectiveQuality(d) === d.flags[MOD].identity.quality), "quality flags still read through identity.mjs");
note(skus.every(isIdentityItem), "every row is still an identity Item");

console.log("\n5) The printed card matches the flag");
for (const [dsid, [key, price]] of Object.entries(LADDER)) {
  const description = lang.GHOSTWIRE.Gear.Items[key]?.Description ?? "";
  note(description.includes(`<strong>Cost:</strong> ${yen(price)} `), `${key} card prints ${yen(price)}`);
  const printed = [...description.matchAll(/<strong>Cost:<\/strong> (¥[\d,]+)/g)].map(m => m[1]);
  note(printed.length === 1 && printed[0] === yen(price), `${key} card carries exactly one, current Cost line`);
  note(!description.includes(yen(PRIOR[dsid])) || PRIOR[dsid] === price, `${key} card no longer prints the old ${yen(PRIOR[dsid])}`);
}

console.log("\n6) catalogPrice reads the flag");
for (const doc of skus) {
  note(catalogPrice(doc) === priceOf(doc), `catalogPrice(${doc.system._dsid}) = ${yen(priceOf(doc))}`);
}

console.log("\n7) Papermill still stocks Identity");
const preset = getPreset("identity");
note(!!preset, "the identity preset is still registered");
note(preset.match.folderIds.includes(FOLDER_IDS.identity), "it still matches the Identity folder");
note(preset.match.tagsAny.includes("Identity"), "and the Identity tag, so a new forgery auto-stocks");
note(lang.GHOSTWIRE.Kiosk.Presets.Identity.ActorName.includes("Papermill"), "the vendor is still Papermill");
const rows = skus.map((doc, i) => ({ ...doc, pack: "gear", id: `id${i}`, path: `identity/sku${i}` }));
note(rows.every(r => matchPresetItem(r, preset)), "every repriced SKU still stocks the papermill");
note(listingsFromItems(rows, preset).length === skus.length, `the shelf lists all ${skus.length} rows`);

console.log("\n8) One vendor only");
const presetsSrc = readFileSync("scripts/kiosk-presets.mjs", "utf8");
const identityPresets = [...presetsSrc.matchAll(/id:\s*"identity"/g)].length;
note(identityPresets === 1, `exactly one identity preset id in kiosk-presets.mjs (got ${identityPresets})`);

console.log("\n9) Director note");
const director = readFileSync("docs/directors/papermill-pricing-03116.md", "utf8");
note(director.length > 1500, "docs/directors/papermill-pricing-03116.md exists and is not a stub");
for (const [, [key, price]] of Object.entries(LADDER)) {
  note(director.includes(`**${price.toLocaleString("en-US")}**`), `the note documents the new ${key} price`);
}
const f17 = readFileSync("docs/directors/f17-sin-identity.md", "utf8");
note(f17.includes("papermill-pricing-03116.md"), "the F17 note points at the 0.3.116 pricing note");
note(!f17.includes("| **Burn SIN** | 1 | 1 | 400 |"), "the F17 ladder table no longer prints the old Burn price");

for (const line of ok) console.log(line);
if (fail.length) {
  console.error(`\n${fail.length} failed:`);
  for (const line of fail) console.error(`  ✗ ${line}`);
  process.exit(1);
}
console.log(`\n${ok.length} checks passed.`);
