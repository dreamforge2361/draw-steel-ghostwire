#!/usr/bin/env node
/**
 * F17 smoke: SIN / forged-identity pack presence, kiosk preset, quality → edge/bane mapping.
 *
 * Run: node tools/f17-identity-smoke.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  IDENTITY_QUALITIES,
  LEGACY_IDENTITY,
  SCAN_OUTCOMES,
  clampQuality,
  effectiveQuality,
  identityData,
  isBurned,
  isIdentityItem,
  planScan,
  qualityBand,
  scanChatContent,
  scanOutcome,
} from "../scripts/identity.mjs";
import { getPreset, listPresets, listingsFromItems, matchPresetItem, FOLDER_IDS } from "../scripts/kiosk-presets.mjs";
import { catalogPrice } from "../scripts/kiosk.mjs";
import { isChargenSpendable } from "../scripts/chargen-wizard.mjs";
import { atLeast } from "./lib/module-version.mjs";

const fail = [];
const ok = [];
const note = (pass, msg) => (pass ? ok : fail).push(pass ? `  ✓ ${msg}` : msg);

const MOD = "draw-steel-ghostwire";
const module = JSON.parse(readFileSync("module.json", "utf8"));
const lang = JSON.parse(readFileSync("lang/en.json", "utf8"));
const boot = readFileSync("scripts/module.mjs", "utf8");
const identity = readFileSync("scripts/identity.mjs", "utf8");
const director = readFileSync("docs/directors/f17-sin-identity.md", "utf8");

const DIR = "src/packs/gear/identity";
const folder = JSON.parse(readFileSync(join(DIR, "_folder.json"), "utf8"));
const skus = readdirSync(DIR)
  .filter(f => f.endsWith(".json") && f !== "_folder.json")
  .map(f => ({ file: f.replace(/\.json$/, ""), doc: JSON.parse(readFileSync(join(DIR, f), "utf8")) }));
const legacy = JSON.parse(readFileSync("src/packs/gear/general/lifestyle/fake-sin-basic.json", "utf8"));
const all = [...skus.map(r => r.doc), legacy];

console.log("F17 SIN / forged-identity smoke\n");

console.log("1) Ship surface");
note(atLeast(module.version, "0.3.113"), `module.json is ≥ 0.3.113 (got ${module.version})`);
note(boot.includes("registerIdentity()"), "module.mjs registers registerIdentity");
note(director.length > 1000, "Director note exists and is not a stub");
note(folder._id === FOLDER_IDS.identity, "the Identity folder id matches the kiosk preset constant");
note(folder.folder === null, "Identity is a top-level gear folder");
note(lang.GHOSTWIRE.Gear.Folders.Identity === "Identity", "folder lang key resolves");

console.log("\n2) Quality bands");
note(IDENTITY_QUALITIES.length === 5, "five quality rungs");
note(IDENTITY_QUALITIES.map(r => r.quality).join(",") === "1,2,3,4,5", "quality 1–5, in order");
note(SCAN_OUTCOMES.join(",") === "double-bane,bane,none,edge,double-edge", "scan outcomes run worst → best");
note(scanOutcome(1) === "double-bane", "quality 1 → double bane");
note(scanOutcome(2) === "bane", "quality 2 → bane");
note(scanOutcome(3) === "none", "quality 3 → no modifier");
note(scanOutcome(4) === "edge", "quality 4 → edge");
note(scanOutcome(5) === "double-edge", "quality 5 → double edge");
note(clampQuality(0) === 1 && clampQuality(99) === 5 && clampQuality("x") === 1, "quality is clamped into 1–5");
note(qualityBand(4).echelon === 3, "quality 4 is an echelon-3 band");
const echelons = IDENTITY_QUALITIES.map(r => r.echelon);
note(echelons.every((e, i) => i === 0 || e >= echelons[i - 1]), `echelon never drops as quality climbs (${echelons.join(",")})`);
const mods = IDENTITY_QUALITIES.map(r => r.mod);
note(mods.every((m, i) => i === 0 || m > mods[i - 1]), `the modifier climbs monotonically (${mods.join(",")})`);
const risks = IDENTITY_QUALITIES.map(r => r.burnRisk);
note(risks.every((m, i) => i === 0 || m <= risks[i - 1]), `burn risk never climbs with quality (${risks.join(",")})`);

console.log("\n3) Hot checks");
note(planScan({ quality: 4, hot: true }).scan === "none", "a hot check knocks a quality-4 edge down to neutral");
note(planScan({ quality: 1, hot: true }).scan === "double-bane", "a hot check cannot go below double bane");
note(planScan({ quality: 5, hot: true }).scan === "edge", "even cradle-seeded paper only reads as an edge under a hot pull");
note(planScan({ quality: 3, hot: true }).burnRisk === 2, "a hot check raises burn risk");
note(planScan({ quality: 3 }).mod === 0 && planScan({ quality: 3, hot: true }).mod === -1, "the modifier tracks the shift");

console.log("\n4) Item reading and burning");
const sin = { name: "Deep Cover SIN", system: { _dsid: "deep-cover-sin" }, flags: { [MOD]: { identity: { quality: 4, band: "deep" } } } };
const burned = { ...sin, flags: { [MOD]: { identity: { quality: 4, band: "deep", burned: true } } } };
note(isIdentityItem(sin) && !isIdentityItem({ system: {}, flags: {} }), "isIdentityItem keys on the flag");
note(effectiveQuality(sin) === 4, "a clean identity reads at its bought quality");
note(isBurned(burned) && effectiveQuality(burned) === 1, "a burned identity drops to the bottom rung");
note(planScan({ quality: effectiveQuality(burned) }).scan === "double-bane", "burned paper scans as a double bane");
note(effectiveQuality({ system: {}, flags: {} }) === null, "non-identity Items have no quality");

console.log("\n5) Legacy Fake SIN still works");
note(!!LEGACY_IDENTITY["fake-sin-basic"], "the pre-F17 SKU is mapped by _dsid");
note(isIdentityItem({ system: { _dsid: "fake-sin-basic" }, flags: {} }), "an old pregen copy with no flag still scans");
note(identityData({ system: { _dsid: "fake-sin-basic" }, flags: {} }).quality === 2, "the old copy resolves to quality 2");
// The legacy pack row is deliberately NOT stamped: it is embedded on three pregens, and
// tools/pregen-regen-smoke.mjs requires the regen round-trip to stay a no-op. The code maps it instead.
note(isIdentityItem(legacy) && identityData(legacy).quality === 2, "the pack row still resolves to quality 2");
note(!legacy.flags[MOD].identity, "the legacy pack row is left unstamped, so the pregen regen stays a no-op");
note(!legacy.flags[MOD].gear.tags.includes("Identity"), "and untagged, for the same reason");
note(!skus.some(r => r.doc.system._dsid === "fake-sin-basic"), "the legacy SKU was not duplicated into the Identity folder");

console.log("\n6) Pack SKUs");
note(skus.length === 9, `nine Identity-folder SKUs (got ${skus.length})`);
const sins = skus.map(r => r.doc).filter(d => d.flags[MOD].identity.kind === "sin");
const creds = skus.map(r => r.doc).filter(d => d.flags[MOD].identity.kind === "credential");
note(sins.length === 5, `five SIN rungs (got ${sins.length})`);
note(creds.length === 4, `four forged credentials (got ${creds.length})`);
const sinQualities = sins.map(d => d.flags[MOD].identity.quality).sort();
note(sinQualities.join(",") === "1,2,3,4,5", `the SIN ladder covers every quality (got ${sinQualities.join(",")})`);
for (const { file, doc } of skus) {
  const flags = doc.flags[MOD];
  note(doc.type === "treasure", `${file} is a treasure Item`);
  note(doc.folder === folder._id, `${file} sits in the Identity folder`);
  note(typeof flags.gear?.price === "number" && flags.gear.price > 0, `${file} has a ¥ price`);
  note(flags.gear.tags.includes("Identity"), `${file} carries the Identity tag`);
  note(flags.identity.scan === scanOutcome(flags.identity.quality), `${file} scan matches its quality band`);
  note(flags.identity.echelon === qualityBand(flags.identity.quality).echelon, `${file} echelon matches its quality band`);
  note(flags.identity.burnRisk === qualityBand(flags.identity.quality).burnRisk, `${file} burn risk matches its quality band`);
  note(!!lang.GHOSTWIRE.Gear.Items[doc.name.split(".").at(-2)], `${file} name key resolves`);
}
const byQuality = [...sins].sort((a, b) => a.flags[MOD].identity.quality - b.flags[MOD].identity.quality)
  .map(d => d.flags[MOD].gear.price);
note(byQuality.every((p, i) => i === 0 || p > byQuality[i - 1]), `SIN ¥ climbs with quality (${byQuality.join(" < ")})`);

console.log("\n7) No copyrighted product names");
const banned = /shadowrun|renraku|aztechnology|ares macrotech|fuchi|saeder|mitsuhama|horizon|evo corp|wuxing|cross applied/i;
const names = all.map(d => lang.GHOSTWIRE.Gear.Items[d.name.split(".").at(-2)].Name);
const bodies = all.map(d => lang.GHOSTWIRE.Gear.Items[d.name.split(".").at(-2)].Description);
note(!names.some(n => banned.test(n)), `names are Ghostwire originals (${names.join(", ")})`);
note(!bodies.some(b => banned.test(b)), "descriptions name no licensed corps");

console.log("\n8) Kiosk preset (the papermill)");
const preset = getPreset("identity");
note(!!preset, "an identity preset is registered");
note(listPresets().some(p => p.id === "identity"), "it shows up in the preset list");
note(preset.match.folderIds.includes(FOLDER_IDS.identity), "it matches on the Identity folder");
const rows = all.map((doc, i) => ({ ...doc, pack: "gear", id: `id${i}`, path: doc.folder === folder._id ? `identity/sku${i}` : "general/lifestyle/fake-sin-basic" }));
note(rows.filter(r => r.folder === folder._id).every(r => matchPresetItem(r, preset)), "every Identity-folder SKU stocks the papermill");
note(!matchPresetItem(rows.find(r => r.system._dsid === "fake-sin-basic"), preset), "the unstamped legacy SKU stays on the Lifestyle shelf");
note(!matchPresetItem({ pack: "gear", path: "weapons/heavy/x", flags: { [MOD]: { gear: { tags: ["Mounted"] } } } }, preset),
  "a weapon does not land on the papermill shelf");
note(listingsFromItems(rows, preset).length === skus.length, "listings resolve one row per Identity-folder SKU");
note(!!lang.GHOSTWIRE.Kiosk.Presets.Identity?.ActorName, "the preset has a vendor name");

console.log("\n9) Chargen spends without special casing");
for (const doc of all) {
  const price = catalogPrice(doc);
  note(price === doc.flags[MOD].gear.price, `catalogPrice reads ${doc.system._dsid} straight off the gear flag`);
  note(isChargenSpendable({ pack: "gear", price, chrome: null }), `${doc.system._dsid} is chargen-spendable`);
}
const identityCode = identity.replace(/^\s*\/\/.*$/gm, "");
note(!/chargen/i.test(identityCode), "identity.mjs has no chargen code path at all (comments aside)");
note(!/^s*import .*chargen/m.test(identity), "identity.mjs does not import the chargen wizard");

console.log("\n10) Chat + strings");
const card = scanChatContent({ bearer: "Kessic", identity: "Broker SIN", scan: "no modifier", mod: 0, burnRisk: 1, hot: false });
note(card.includes("Kessic") && card.includes("routine"), "the scan card names bearer and check");
note(scanChatContent({ bearer: "<b>x", identity: "i", scan: "s", mod: 1, burnRisk: 0 }).includes("&lt;b&gt;"), "names are escaped");
note(scanChatContent({ bearer: "a", identity: "i", scan: "s", mod: 2, burnRisk: 0 }).includes("+2"), "a positive modifier is signed");
const id = lang.GHOSTWIRE.Identity;
note(Object.keys(id.Bands).length === 5, "a label per band");
note(Object.keys(id.Scan).length === 5, "a label per scan outcome");
note(Object.keys(id.Hint).length === 5, "a table hint per scan outcome");
note(id.Menu.Scan.includes("Validate"), "the context menu says Validate / scan");
note(id.Chat.Scanned.includes("{scan}") && id.Chat.Scanned.includes("{burnRisk}"), "the chat line carries the modifier and risk");

for (const line of ok) console.log(line);
if (fail.length) {
  console.error(`\n${fail.length} failed:`);
  for (const line of fail) console.error(`  ✗ ${line}`);
  process.exit(1);
}
console.log(`\n${ok.length} checks passed.`);
