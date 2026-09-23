#!/usr/bin/env node
/**
 * F20 — Wired sights on the canvas smoke (0.3.119).
 * Foundry-free: scripts/sights.mjs helpers + pack source flags + lang cards + boot wiring.
 *
 * Run: node tools/f20-foundry-sights-smoke.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  FOUNDRY_DETECTION_MODES,
  FOUNDRY_VISION_MODES,
  MODULE_ID,
  SIGHT_APPLIED_FLAG,
  SIGHT_CLAIMS,
  SIGHT_DOCTRINE,
  SIGHT_GRANT_FLAG,
  SIGHTS_SETTING,
  actorSightGrants,
  appliedRecord,
  claimProblems,
  isSightGrantLive,
  mergeSightGrants,
  sightGrantOf,
  sightUpdate,
} from "../scripts/sights.mjs";
import { atLeast } from "./lib/module-version.mjs";

const fail = [];
const ok = [];
const note = (pass, msg) => (pass ? ok.push(`  ✓ ${msg}`) : fail.push(msg));

const moduleJson = JSON.parse(readFileSync("module.json", "utf8"));
const boot = readFileSync("scripts/module.mjs", "utf8");
const sights = readFileSync("scripts/sights.mjs", "utf8");
const tokenVision = readFileSync("scripts/token-vision.mjs", "utf8");
const lang = JSON.parse(readFileSync("lang/en.json", "utf8"));
const foundryNotes = readFileSync("docs/rulebook/18-wired-foundry.md", "utf8");
const directorNote = readFileSync("docs/directors/f20-foundry-sights.md", "utf8");
const readme = readFileSync("README.md", "utf8");

console.log("F20 — Wired sights on the canvas smoke (0.3.119)\n");

/* ------------------------------------------------------------------ 1) ship surface */

console.log("1) Ship surface");
note(atLeast(moduleJson.version, "0.3.119"), `module.json is ≥ 0.3.119 (got ${moduleJson.version})`);
note(boot.includes("registerSights()"), "module.mjs registers registerSights");
note(boot.includes("./sights.mjs"), "module.mjs imports sights.mjs");
note(sights.includes("prototypeToken") && sights.includes("detectionModes"), "sights writes prototypeToken detectionModes");
note(/Hooks\.on\("preCreateToken"/.test(sights), "placed-token create is covered");
note(/createActiveEffect/.test(sights) && /deleteActiveEffect/.test(sights), "Active Effect toggles recompute");
note(/Hooks\.once\("ready", migrateSights\)/.test(sights), "one-time ready migration");
note(SIGHTS_SETTING === "sightsMigrated", "world setting id");
note(SIGHT_GRANT_FLAG === "sightGrant" && SIGHT_APPLIED_FLAG === "sightApplied", "flag names are sightGrant / sightApplied");
// token-vision stays the only owner of sight.enabled scope; sights only flips it on an explicit grant.
note(!/SKIP_TOKEN_VISION_KINDS\s*=/.test(sights), "sights does not redefine token-vision's skip list");
note(sights.includes("actorWantsTokenVision"), "sights reuses token-vision's scope predicate");
note(!/sight\.range|sight\.angle/.test(sights), "sights never writes sight.range or sight.angle");
note(!/git diff|execFileSync/.test(sights), "sights is a runtime module, not a tool");
note(/0\.3\.119/.test(readme) && /sight|detectionMode/i.test(readme), "README changelog names 0.3.119 sights");
note(/Canvas sights \(F20, 0\.3\.119\)/.test(foundryNotes), "Foundry notes document canvas sights");
note(/seeAll/.test(foundryNotes) && /no thermal imager/i.test(foundryNotes), "Foundry notes state the thermal doctrine");
note(/Director call/.test(directorNote), "director note records the deferred claims");

/* ------------------------------------------------------------------ 2) stock ids only */

console.log("\n2) Stock Foundry ids only");
// Verified against the shipped client: Foundry 14.367 client/config.mjs CONFIG.Canvas.detectionModes
// and CONFIG.Canvas.visionModes. Nothing invented, nothing subclassed.
const STOCK_DETECTION = ["basicSight", "lightPerception", "seeInvisibility", "senseInvisibility", "feelTremor", "seeAll", "senseAll"];
const STOCK_VISION = ["basic", "darkvision", "monochromatic", "blindness", "tremorsense", "lightAmplification"];
note(FOUNDRY_DETECTION_MODES.length === STOCK_DETECTION.length
  && STOCK_DETECTION.every(id => FOUNDRY_DETECTION_MODES.includes(id)), "detection mode list is exactly Foundry 14's seven");
note(FOUNDRY_VISION_MODES.length === STOCK_VISION.length
  && STOCK_VISION.every(id => FOUNDRY_VISION_MODES.includes(id)), "vision mode list is exactly Foundry 14's six");
note(SIGHT_CLAIMS.join(",") === "nightOptics,thermal,veilGlimpse", "three claims, no more");
note(SIGHT_DOCTRINE.nightOptics.mode === "basicSight" && SIGHT_DOCTRINE.nightOptics.visionMode === "darkvision",
  "nightOptics maps to basicSight + darkvision");
note(SIGHT_DOCTRINE.thermal.mode === "seeAll", "thermal maps to seeAll (Foundry ships no thermal engine)");
note(SIGHT_DOCTRINE.veilGlimpse.mode === "seeInvisibility", "veilGlimpse maps to seeInvisibility");
for (const claim of SIGHT_CLAIMS) {
  note(FOUNDRY_DETECTION_MODES.includes(SIGHT_DOCTRINE[claim].mode), `${claim} names a stock detection mode`);
}
note(sightGrantOf({ flags: { [MODULE_ID]: { sightGrant: { modes: [{ id: "thermalImager", range: 5 }] } } } }) === null,
  "an invented mode id is dropped, not written");
note(sightGrantOf({ flags: { [MODULE_ID]: { sightGrant: { modes: [{ id: "seeAll", range: 5 }], visionMode: "ghostwireOverlay" } } } })?.visionMode === null,
  "a non-stock vision mode is dropped (the Wired tints stay client-only)");

/* ------------------------------------------------------------------ 3) helper behaviour */

console.log("\n3) Helper behaviour");
const grantOf = (sightGrant, extra = {}) => ({ flags: { [MODULE_ID]: { sightGrant, ...extra } }, ...extra.system ? { system: extra.system } : {} });
const eyes = { modes: [{ id: "basicSight", range: 10 }, { id: "seeAll", range: 5 }], visionMode: "darkvision", priority: 1, claims: ["nightOptics", "thermal"] };
const sensorium = { modes: [{ id: "basicSight", range: 20 }, { id: "seeAll", range: 10 }, { id: "seeInvisibility", range: 10 }], visionMode: "darkvision", priority: 3, claims: ["nightOptics", "thermal", "veilGlimpse"] };

note(sightGrantOf(grantOf(eyes))?.modes.length === 2, "a two-mode grant reads back two modes");
note(sightGrantOf({ flags: {} }) === null, "no flag is no grant");
note(sightGrantOf(grantOf({ modes: [] })) === null, "an empty mode list is no grant");
note(sightGrantOf(grantOf({ modes: [{ id: "seeAll", range: 5 }, { id: "seeAll", range: 9 }] }))?.modes.length === 1,
  "a duplicated mode id collapses to one");
note(sightGrantOf(grantOf({ modes: [{ id: "seeAll", range: "nonsense" }] }))?.modes[0].range === null,
  "an unparseable range becomes unlimited (null), never NaN");
note(claimProblems(sightGrantOf(grantOf({ modes: [{ id: "basicSight", range: 5 }], claims: ["thermal"] }))).length === 1,
  "a claim with no matching mode is caught");
note(claimProblems(sightGrantOf(grantOf(eyes))).length === 0, "an honest grant has no claim problems");

const merged = mergeSightGrants([sightGrantOf(grantOf(eyes)), sightGrantOf(grantOf(sensorium))]);
note(merged.modes.basicSight.range === 20, "two optics take the better darkvision band, not the sum");
note(merged.modes.seeAll.range === 10, "two optics take the better thermal band");
note(merged.visionMode === "darkvision", "merged vision mode is darkvision");
note(mergeSightGrants([sightGrantOf(grantOf({ modes: [{ id: "seeAll", range: 5 }], visionMode: "monochromatic", priority: 9 })),
  sightGrantOf(grantOf(sensorium))]).visionMode === "monochromatic", "the highest priority vision mode wins");
note(mergeSightGrants([sightGrantOf(grantOf({ modes: [{ id: "seeAll", range: null }] })), sightGrantOf(grantOf(eyes))]).modes.seeAll.range === null,
  "unlimited beats any printed range");
note(Object.keys(mergeSightGrants([sightGrantOf(grantOf({ modes: [{ id: "seeAll", range: 5, enabled: false }] }))]).modes).length === 0,
  "a mode nobody enabled is dropped rather than written as enabled:false");
note(Object.keys(mergeSightGrants([]).modes).length === 0 && mergeSightGrants([]).visionMode === null,
  "no grants merge to nothing");

console.log("\n4) A grant is only live while its source is");
note(isSightGrantLive({ flags: { [MODULE_ID]: { sightGrant: eyes, chrome: { grade: "standard" } } } }) === true,
  "healthy chrome grants");
for (const state of ["suppressed", "destroyed"]) {
  note(isSightGrantLive({ flags: { [MODULE_ID]: { sightGrant: eyes, chrome: { grade: "standard" }, chromeState: { state } } } }) === false,
    `F12 ${state} chrome grants nothing`);
}
note(isSightGrantLive({ flags: { [MODULE_ID]: { sightGrant: eyes, chrome: { grade: "standard" }, chromeState: { state: "damaged" } } } }) === true,
  "F12 damaged chrome keeps its optics (Damaged keeps the benefit)");
note(isSightGrantLive({ flags: { [MODULE_ID]: { sightGrant: eyes, mod: {} } } }) === false, "an uninstalled mod grants nothing");
note(isSightGrantLive({ flags: { [MODULE_ID]: { sightGrant: eyes, mod: { installedOn: "abc", active: false } } } }) === false,
  "an installed but switched-off mod grants nothing");
note(isSightGrantLive({ flags: { [MODULE_ID]: { sightGrant: eyes, mod: { installedOn: "abc" } } } }) === true,
  "an installed, on mod grants");
note(isSightGrantLive({ flags: { [MODULE_ID]: { sightGrant: eyes } }, system: { quantity: 0 } }) === false,
  "gear spent to quantity 0 grants nothing");
note(actorSightGrants({ items: [{ flags: { [MODULE_ID]: { sightGrant: eyes } } }, { flags: {} }] }).length === 1,
  "actorSightGrants only counts the granting items");

/* ------------------------------------------------------------------ 5) the patch */

console.log("\n5) The patch is minimal and reversible");
const bare = { sight: { enabled: true, visionMode: "basic" }, detectionModes: {}, flags: {} };
const on = sightUpdate(bare, mergeSightGrants([sightGrantOf(grantOf(eyes))]), { keepVision: true });
note(on.detectionModes.basicSight.range === 10 && on.detectionModes.seeAll.range === 5, "the patch writes both bands");
note(on.sight.visionMode === "darkvision", "the patch writes the vision mode");
note(on.sight.enabled === undefined, "no enableVision grant means sight.enabled is left to token-vision");
note(on.flags[MODULE_ID][SIGHT_APPLIED_FLAG].modes.join(",") === "basicSight,seeAll", "the ledger records what was written");
note(on.flags[MODULE_ID][SIGHT_APPLIED_FLAG].baseVisionMode === "basic", "the ledger remembers the Director's vision mode");

const applied = { sight: { enabled: true, visionMode: "darkvision" }, detectionModes: { basicSight: { enabled: true, range: 10 }, seeAll: { enabled: true, range: 5 } }, flags: { [MODULE_ID]: { [SIGHT_APPLIED_FLAG]: on.flags[MODULE_ID][SIGHT_APPLIED_FLAG] } } };
note(sightUpdate(applied, mergeSightGrants([sightGrantOf(grantOf(eyes))]), { keepVision: true }) === null,
  "re-running on an already-correct token writes nothing");

const off = sightUpdate(applied, mergeSightGrants([]), { keepVision: true });
note(off.detectionModes["-=basicSight"] === null && off.detectionModes["-=seeAll"] === null, "removing the implant removes both modes");
note(off.sight.visionMode === "basic", "removing the implant restores the Director's vision mode");
note(off.flags[MODULE_ID][`-=${SIGHT_APPLIED_FLAG}`] === null, "the ledger is cleared");
note(off.sight.enabled === undefined, "removing an optic never turns Has Vision off on its own");

// A mode a Director configured by hand is never removed, because it is not in our ledger.
const directorOwned = { sight: { enabled: true, visionMode: "basic" }, detectionModes: { feelTremor: { enabled: true, range: 4 } }, flags: {} };
const withDirector = sightUpdate(directorOwned, mergeSightGrants([sightGrantOf(grantOf(eyes))]), { keepVision: true });
note(!("-=feelTremor" in withDirector.detectionModes), "a Director's own detection mode is never stripped");

// enableVision: the Sensor Pod path.
const pod = { modes: [{ id: "basicSight", range: 10 }], visionMode: "darkvision", priority: 1, claims: ["nightOptics"], enableVision: true };
const machine = { sight: { enabled: false, visionMode: "basic" }, detectionModes: {}, flags: {} };
const podOn = sightUpdate(machine, mergeSightGrants([sightGrantOf(grantOf(pod))]), { keepVision: false });
note(podOn.sight.enabled === true, "a Sensor Pod switches Has Vision on for its machine");
note(podOn.flags[MODULE_ID][SIGHT_APPLIED_FLAG].enabledVision === true, "the ledger records the vision flip");
const podApplied = { sight: { enabled: true, visionMode: "darkvision" }, detectionModes: { basicSight: { enabled: true, range: 10 } }, flags: { [MODULE_ID]: { [SIGHT_APPLIED_FLAG]: podOn.flags[MODULE_ID][SIGHT_APPLIED_FLAG] } } };
note(sightUpdate(podApplied, mergeSightGrants([]), { keepVision: false }).sight.enabled === false,
  "pulling the pod puts Has Vision back off on a machine");
note(sightUpdate(podApplied, mergeSightGrants([]), { keepVision: true }).sight.enabled === undefined,
  "pulling the pod never overrides token-vision on a hero or NPC");
note(appliedRecord({ flags: { [MODULE_ID]: { [SIGHT_APPLIED_FLAG]: { modes: ["nope", "seeAll"] } } } }).modes.join(",") === "seeAll",
  "a stale ledger entry for a non-stock mode is ignored");

/* ------------------------------------------------------------------ 6) pack source */

console.log("\n6) Pack source flags");
function walk(dir) {
  const out = [];
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(p));
    else if (ent.name.endsWith(".json") && ent.name !== "_folder.json") out.push(p);
  }
  return out;
}

// dsid -> [darkvision, thermal, seeInvisibility] in squares; null = the SKU does not claim it.
const EXPECTED = {
  "cyber-eyes": [10, 5, null],
  "cyber-eyes-soft": [10, 5, null],
  "low-light-goggles": [10, null, null],
  "thermal-scanner": [null, 10, null],
  "sensor-sweep-drone-eye": [10, 10, null],
  "full-sensorium": [20, 10, 10],
  "deep-optics": [null, 5, 5],
  "sensor-pod": [10, 5, null],
  "taint-sight": [10, null, null],
  "predictive-sensors": [null, null, 20],
};
// Sight-adjacent SKUs that must NOT carry a grant, and why.
const NO_GRANT = ["cheap-shades", "thermoptic-skin", "penetration-optics", "detect-the-supernatural", "cold-read"];

const rows = new Map();
for (const root of ["src/packs/chrome", "src/packs/gear", "src/packs/mods", "src/packs/origins", "src/packs/classes"]) {
  for (const file of walk(root)) {
    const doc = JSON.parse(readFileSync(file, "utf8"));
    const dsid = doc.system?._dsid;
    if (!dsid || rows.has(dsid)) continue;
    rows.set(dsid, { doc, file });
  }
}

for (const [dsid, [dark, thermal, invis]] of Object.entries(EXPECTED)) {
  const row = rows.get(dsid);
  if (!row) { note(false, `${dsid}: no pack row found`); continue; }
  const grant = sightGrantOf(row.doc);
  note(!!grant, `${dsid}: carries a sightGrant`);
  if (!grant) continue;
  note(claimProblems(grant).length === 0, `${dsid}: every claim names a mode it actually writes`);
  const byId = Object.fromEntries(grant.modes.map(m => [m.id, m.range]));
  note((byId.basicSight ?? null) === dark, `${dsid}: darkvision ${dark ?? "—"} (got ${byId.basicSight ?? "—"})`);
  note((byId.seeAll ?? null) === thermal, `${dsid}: thermal ${thermal ?? "—"} (got ${byId.seeAll ?? "—"})`);
  note((byId.seeInvisibility ?? null) === invis, `${dsid}: see invisible ${invis ?? "—"} (got ${byId.seeInvisibility ?? "—"})`);
  note(grant.modes.every(m => m.enabled), `${dsid}: every granted mode is enabled`);
  if (dark !== null) note(grant.visionMode === "darkvision", `${dsid}: night optics carry the darkvision vision mode`);
  else note(grant.visionMode === null, `${dsid}: no night-optics claim means no vision mode`);
}
note(sightGrantOf(rows.get("sensor-pod").doc).enableVision === true, "sensor-pod is the SKU that switches Has Vision on");
note(Object.keys(EXPECTED).filter(d => d !== "sensor-pod").every(d => sightGrantOf(rows.get(d)?.doc)?.enableVision === false),
  "no other SKU flips Has Vision");
for (const dsid of NO_GRANT) {
  const row = rows.get(dsid);
  note(!!row, `${dsid}: pack row exists`);
  if (row) note(sightGrantOf(row.doc) === null, `${dsid}: deliberately grants no canvas sight`);
}

// Nothing outside the audited set may quietly grow a grant.
const known = new Set(Object.keys(EXPECTED));
const strays = [...rows.entries()].filter(([dsid, row]) => sightGrantOf(row.doc) && !known.has(dsid)).map(([dsid]) => dsid);
note(strays.length === 0, `no unaudited sightGrant rows (found: ${strays.join(", ") || "none"})`);

/* ------------------------------------------------------------------ 7) cards match the canvas */

console.log("\n7) The printed card matches the canvas");
const langAt = path => path.split(".").reduce((o, k) => o?.[k], lang);
const CARDS = {
  "GHOSTWIRE.Chrome.CyberEyes.Description": ["Darkvision 10 squares", "Thermal 5 squares"],
  "GHOSTWIRE.Chrome.CyberEyesSoft.Description": ["Darkvision 10 squares", "Thermal 5 squares"],
  "GHOSTWIRE.Gear.Items.LowLightGoggles.Description": ["Darkvision 10 squares"],
  "GHOSTWIRE.Gear.Items.ThermalScanner.Description": ["Thermal 10 squares"],
  "GHOSTWIRE.Gear.Items.SensorSweepDroneEye.Description": ["Darkvision 10 squares", "Thermal 10 squares"],
  "GHOSTWIRE.Gear.Items.FullSensorium.Description": ["Darkvision 20 squares", "Thermal 10 squares", "See invisible 10 squares"],
  "GHOSTWIRE.Mods.Items.DeepOptics.Description": ["Thermal 5 squares", "See invisible 5 squares"],
  "GHOSTWIRE.Mods.Items.SensorPod.Description": ["Darkvision 10 squares", "Thermal 5 squares", "Has Vision"],
  "GHOSTWIRE.Peoples.Mutant.TaintSight.Description": ["Darkvision 10 squares"],
  "GHOSTWIRE.Peoples.Cyborg.PredictiveSensors.Description": ["See invisible 20 squares"],
};
for (const [key, phrases] of Object.entries(CARDS)) {
  const card = langAt(key);
  note(typeof card === "string", `${key} resolves`);
  if (typeof card !== "string") continue;
  note(card.includes("On the canvas"), `${key} prints an "On the canvas" block`);
  for (const phrase of phrases) note(card.includes(phrase), `${key} prints "${phrase}"`);
}
for (const key of [
  "GHOSTWIRE.Gear.Items.CheapShades.Description",
  "GHOSTWIRE.Mods.Items.ThermopticSkin.Description",
]) {
  const card = langAt(key);
  note(card.includes("<strong>On the canvas:</strong> no change"), `${key} says plainly that it changes nothing`);
}
for (const key of [
  "GHOSTWIRE.Peoples.Cyborg.PenetrationOptics.Description",
  "GHOSTWIRE.Peoples.Cyborg.PenetrationOpticsAbility.Effect",
  "GHOSTWIRE.Peoples.PureHuman.DetectTheSupernatural.Description",
  "GHOSTWIRE.Classes.Scout.Items.ColdRead.Description",
]) {
  const card = langAt(key);
  note(card.includes("Director call"), `${key} defers to the Director instead of faking a mode`);
  note(card.includes("f20-foundry-sights"), `${key} points at the director note`);
}
// Every card that claims heat prints the one doctrine sentence.
for (const key of Object.keys(CARDS)) {
  const card = langAt(key);
  if (!card.includes("Thermal ")) continue;
  note(/no thermal imager/.test(card), `${key} states why thermal is seeAll`);
}
note(langAt("GHOSTWIRE.Abilities.Keywords.Psychic") === "Psychic", "the F21 psychic keyword label ships too");

/* ------------------------------------------------------------------ 8) token-vision is untouched */

console.log("\n8) token-vision (0.3.67) is untouched");
note(tokenVision.includes("prototypeToken.sight.enabled"), "token-vision still owns sight.enabled");
note(!tokenVision.includes("detectionModes"), "token-vision still writes no detectionModes");
note(!tokenVision.includes("sights.mjs"), "token-vision does not import sights");

if (fail.length) {
  console.log(ok.join("\n"));
  console.error(`\n${fail.length} failed:\n${fail.map(m => `  ✗ ${m}`).join("\n")}`);
  process.exit(1);
}
console.log(`\n${ok.length} passed`);
