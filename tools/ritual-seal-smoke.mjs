#!/usr/bin/env node
/**
 * 0.3.95 — Ritual Seal artifacts smoke (scripts/ritual-seal.mjs), no live Foundry.
 *
 * Checks the parts that are rules rather than UI:
 *  - Family → artifact routing is the LOCKED table, and every shipped Formula family lands on a known artifact.
 *  - A hung seal (tier 1) leaves nothing; middle and high leave the Ritual Effect.
 *  - The Ritual Effect block carries every field the design names, normalized.
 *  - The chat line a result prints matches the branch that produced it.
 *  - Every lang key the artifacts and their chat cards name resolves.
 *  - The applet actually calls it on Seal, and unwinds it on reset / abandon.
 *  - The resource firewall holds: this file touches no ¥, Essence, Conviction or Resonance.
 *
 * Run: node tools/ritual-seal-smoke.mjs
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  ARTIFACT_KINDS,
  FAMILY_ARTIFACT,
  MARKER_ART,
  MARKER_KIND,
  RITUAL_EFFECT_FLAG,
  SEAL_FAMILIES,
  artifactForFamily,
  callingTemplateDsid,
  familyKey,
  isSealArtifactOf,
  outcomeKeyFor,
  placesMarker,
  ritualDurationText,
  ritualEffectData,
  ritualEffectOf,
  scopeKey,
  sealCardKey,
  sealSucceeded,
} from "../scripts/ritual-seal.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const DIR = "src/packs/gear/general/ritual-formulas";

/** Every `flags.<module>.dsid` / `system._dsid` on an Actor JSON under a pack source tree. */
function actorDsids(root) {
  const out = [];
  const walk = dir => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) { walk(path); continue; }
      if (!entry.name.endsWith(".json") || entry.name.startsWith("_")) continue;
      const doc = read(path);
      const dsid = doc.flags?.[MODULE_ID]?.dsid ?? doc.system?._dsid;
      if (dsid) out.push(dsid);
    }
  };
  if (existsSync(root)) walk(root);
  return out;
}
const failures = [];
const ok = (cond, msg) => { if (!cond) failures.push(msg); else console.log(`  ✓ ${msg}`); };
const read = p => JSON.parse(readFileSync(p, "utf8").replace(/^﻿/, ""));
const lang = read("lang/en.json");
const t = key => key.split(".").reduce((o, k) => o?.[k], lang);
const source = readFileSync("scripts/ritual-seal.mjs", "utf8");
const applet = readFileSync("scripts/ritual-working.mjs", "utf8");
const template = readFileSync("templates/ritual-working.hbs", "utf8");

console.log("0.3.95 Ritual Seal artifacts smoke\n");

/* ---------- 1. the LOCKED family table ---------- */
console.log("1) Family → artifact");
ok(artifactForFamily("Ward") === "marker" && artifactForFamily("Threshold") === "marker",
  "Ward and Threshold stand a scene marker");
ok(artifactForFamily("Calling") === "summon", "Calling goes down the summons path");
ok(artifactForFamily("Artifice") === "item", "Artifice folds into an Item");
ok(artifactForFamily("Reach") === "effect", "Reach leaves an Active Effect, no token");
ok(artifactForFamily("Unmaking") === "chat", "Unmaking leaves chat only");
ok(artifactForFamily("Other") === "chat" && artifactForFamily("Necromancy") === "chat" && artifactForFamily(null) === "chat",
  "an unknown or missing family falls to chat rather than guessing an artifact");
ok(familyKey("  WARD ") === "ward" && familyKey("") === "other", "family keys are trimmed, lower-cased and bounded");
ok(placesMarker("ward") && placesMarker("Threshold") && !placesMarker("Reach"), "placesMarker names exactly the token families");
ok(SEAL_FAMILIES.every(key => ARTIFACT_KINDS.includes(FAMILY_ARTIFACT[key])), "every family routes to a declared artifact kind");
ok(Object.keys(FAMILY_ARTIFACT).length === SEAL_FAMILIES.length, "the table has one row per family and no strays");

/* ---------- 2. hung seals leave nothing ---------- */
console.log("\n2) Only a held or clean seal leaves an artifact");
ok(!sealSucceeded(1), "tier 1 (low) is a hung ritual — no artifact");
ok(sealSucceeded(2) && sealSucceeded(3), "tier 2 (middle) and tier 3 (high) leave the Ritual Effect");
ok(!sealSucceeded(null) && !sealSucceeded(0) && !sealSucceeded(4) && !sealSucceeded("x"),
  "an unrolled or impossible tier leaves nothing");
ok(outcomeKeyFor(1) === "low" && outcomeKeyFor(2) === "middle" && outcomeKeyFor(3) === "high" && outcomeKeyFor(null) === "",
  "outcome keys follow the Power Roll tiers");

/* ---------- 3. the Ritual Effect block ---------- */
console.log("\n3) The Ritual Effect block");
const payload = ritualEffectData({
  workingId: "rw123",
  workingName: "Ward the Room",
  formulaUuid: "Actor.a.Item.b",
  family: "Ward",
  magnitude: 1,
  leaderUuid: "Actor.a",
  leaderName: "Kaïs",
  sealedAt: "2026-09-22T18:00:00.000Z",
  expires: null,
  scope: "The warded room and its thresholds — Magnitude 1.",
  sealTier: 3,
});
const FIELDS = ["workingName", "formulaUuid", "family", "magnitude", "leaderUuid", "leaderName",
  "sealedAt", "expires", "scope", "sealTier", "outcomeKey"];
ok(FIELDS.every(field => field in payload), "every field the LOCKED design names is on the block");
ok(payload.workingId === "rw123", "…plus the Working id, so the Director's reset can find the artifact again");
ok(payload.artifact === "marker" && payload.familyKey === "ward", "the block records which artifact the family chose");
ok(payload.outcomeKey === "high" && payload.sealTier === 3, "the tier and its outcome key ride along");
ok(payload.expires === null, "a card with no printed duration expires null — the Director rules upkeep");
ok(ritualEffectData({ magnitude: 9 }).magnitude === 5 && ritualEffectData({ magnitude: null }).magnitude === 1,
  "Magnitude is clamped to the 1–5 window");
ok(typeof ritualEffectData({}).sealedAt === "string" && !Number.isNaN(Date.parse(ritualEffectData({}).sealedAt)),
  "sealedAt defaults to an ISO stamp");
ok(ritualEffectData({ sealTier: 7 }).sealTier === null, "an impossible tier is stored as null, not echoed");
ok(ritualDurationText({ duration: " 24 hours " }) === "24 hours" && ritualDurationText({}) === null,
  "a printed duration is read off the card when one exists");
ok(callingTemplateDsid({ summonDsid: "spirit-guardian" }) === "spirit-guardian" && callingTemplateDsid({}) === null,
  "a Calling card names its summon template, or none");

const doc = { flags: { [MODULE_ID]: { [RITUAL_EFFECT_FLAG]: payload } } };
ok(ritualEffectOf(doc) === payload && ritualEffectOf({}) === null, "the Ritual Effect reads back off a document");
ok(isSealArtifactOf(doc, "rw123") && !isSealArtifactOf(doc, "rw999") && !isSealArtifactOf(doc, null),
  "an artifact is matched to its Working and to no other");

/* ---------- 4. the chat branch ---------- */
console.log("\n4) The chat line each branch prints");
ok(sealCardKey({ ok: true, kind: "marker" }) === "Card.Marker", "a placed marker says so");
ok(sealCardKey({ ok: true, kind: "summon" }) === "Card.Summon", "a real summon says so");
ok(sealCardKey({ ok: true, kind: "summon", reason: "no-template" }) === "Card.SummonPending",
  "a Calling with no template wired hands the placing to the Director");
ok(sealCardKey({ ok: true, kind: "item" }) === "Card.Item" && sealCardKey({ ok: true, kind: "effect" }) === "Card.Effect",
  "Artifice and Reach name their own artifacts");
ok(sealCardKey({ ok: true, kind: "chat" }) === "Card.Chat", "Unmaking gets the bare confirmation");
ok(sealCardKey({ ok: false, reason: "no-scene" }) === "Card.NoScene"
  && sealCardKey({ ok: false, reason: "no-permission" }) === "Card.NoPermission"
  && sealCardKey({ ok: false, reason: "error" }) === "Card.Chat",
  "a marker that could not be stood still reports the seal, and says why");

/* ---------- 5. every shipped Formula routes ---------- */
console.log("\n5) The shipped Formula catalog");
const formulas = readdirSync(DIR).filter(f => f.endsWith(".json") && !f.startsWith("_"))
  .map(f => read(join(DIR, f)))
  .filter(item => item.flags?.[MODULE_ID]?.ritual?.formula === true);
const families = new Map();
for (const item of formulas) {
  const family = item.flags?.[MODULE_ID]?.ritual?.family ?? "";
  families.set(family, (families.get(family) ?? 0) + 1);
}
ok(formulas.length > 0, `${formulas.length} Ritual Formulas on the shelf`);
ok([...families.keys()].every(family => ARTIFACT_KINDS.includes(artifactForFamily(family))),
  `every shipped family routes: ${[...families.entries()].map(([f, n]) => `${f}×${n}`).join(", ")}`);
ok([...families.keys()].every(family => familyKey(family) !== "other" || family === "Other"),
  "no shipped family falls through to the unknown bucket by accident");
const ward = formulas.find(item => item.flags?.[MODULE_ID]?.ritual?.family === "Ward");
ok(!!ward && artifactForFamily(ward.flags[MODULE_ID].ritual.family) === "marker",
  "Ward the Room's family stands a marker — the rite the design names first");

// 0.3.133 (E) — the branch that used to be dead. Every Calling Formula names a summon, and every dsid
// it names is a real Actor in the Summons & Machines pack or the bestiary, so `templateFor` in
// veil-summons.mjs can resolve it. A Calling card with no dsid puts the Director back to placing the
// called thing by hand, which is the thing this wave removed.
const summonDsids = new Set([
  ...actorDsids("src/packs/summons"),
  ...actorDsids("src/packs/bestiary"),
]);
ok(summonDsids.size > 0, `${summonDsids.size} summonable Actors indexed from the summons and bestiary packs`);
const callings = formulas.filter(item => familyKey(item.flags[MODULE_ID].ritual.family) === "calling");
ok(callings.length > 0, `${callings.length} Calling Formulas on the shelf`);
const unnamed = callings.filter(item => !callingTemplateDsid(item.flags[MODULE_ID].ritual))
  .map(item => item.system._dsid);
ok(unnamed.length === 0, `every Calling Formula names a summon${unnamed.length ? ` (missing: ${unnamed.join(", ")})` : ""}`);
const unresolved = callings
  .map(item => [item.system._dsid, callingTemplateDsid(item.flags[MODULE_ID].ritual)])
  .filter(([, dsid]) => dsid && !summonDsids.has(dsid));
ok(unresolved.length === 0,
  `and every one of them resolves to a real Actor${unresolved.length ? ` (dangling: ${unresolved.map(([f, d]) => `${f}->${d}`).join(", ")})` : ""}`);
ok(formulas.filter(item => familyKey(item.flags[MODULE_ID].ritual.family) !== "calling")
  .every(item => !item.flags?.[MODULE_ID]?.ritual?.summonDsid),
  "…and no non-Calling family carries one, which would summon on a Ward");

/* ---------- 6. lang ---------- */
console.log("\n6) Lang keys");
const L = "GHOSTWIRE.RitualSeal";
for (const key of ["ChatTitle", "UnknownWorking", "FolderName", "ArtifactName", "OpenArtifact", "Cleared", "Expires.None"]) {
  if (typeof t(`${L}.${key}`) !== "string") failures.push(`missing lang key ${L}.${key}`);
}
ok(true, "the top-level Ritual Seal keys resolve");
for (const family of SEAL_FAMILIES) {
  if (typeof t(`${L}.Family.${family}`) !== "string") failures.push(`missing lang key ${L}.Family.${family}`);
  if (typeof t(`${L}.${scopeKey(family)}`) !== "string") failures.push(`missing lang key ${L}.${scopeKey(family)}`);
}
ok(true, "every family has a label and a scope line");
for (const field of ["Working", "Family", "Magnitude", "Leader", "Scope", "Expires", "Sealed"]) {
  if (typeof t(`${L}.Fields.${field}`) !== "string") failures.push(`missing lang key ${L}.Fields.${field}`);
}
ok(true, "the Ritual Effect block labels resolve");
for (const kind of ARTIFACT_KINDS) {
  if (typeof t(`${L}.Artifact.${kind}`) !== "string") failures.push(`missing lang key ${L}.Artifact.${kind}`);
}
ok(true, "the panel names what each family will leave behind before the roll");
for (const card of ["Marker", "Summon", "SummonPending", "Item", "Effect", "Chat", "NoScene", "NoPermission"]) {
  if (typeof t(`${L}.Card.${card}`) !== "string") failures.push(`missing lang key ${L}.Card.${card}`);
}
ok(true, "every chat branch has its line");
for (const outcome of ["low", "middle", "high"]) {
  if (typeof t(`${L}.Outcome.${outcome}`) !== "string") failures.push(`missing lang key ${L}.Outcome.${outcome}`);
}
ok(true, "the seal outcomes read back on the artifact");
ok(t(`${L}.Card.NoScene`).includes("{working}") && t(`${L}.Card.NoPermission`).includes("{working}"),
  "the two failure lines take only {working} — they double as notifications");
ok(t(`${L}.ArtifactName`).includes("{family}") && t(`${L}.ArtifactName`).includes("{working}"),
  "an artifact is named `Family: Working`");

/* ---------- 7. the applet calls it ---------- */
console.log("\n7) Wiring");
ok(applet.includes('from "./ritual-seal.mjs"'), "the applet imports the seal module");
ok(/#onSeal[\s\S]*?applySealArtifact\(leader/.test(applet), "#onSeal stamps the artifact after the Sealed card");
ok(/applySealArtifact\([^)]*tier: outcome\.tier/.test(applet), "…and passes the tier it just rolled, so a hung seal is refused there");
ok(applet.includes("sealArtifactUuid") && applet.includes("sealArtifactKind"),
  "the Working remembers what its seal left behind");
ok(/#onResetStage[\s\S]*?clearSealArtifacts\(leader, working\.id\)/.test(applet),
  "the Director's seal reset clears the artifact with the stamp");
ok(/#onAbandon[\s\S]*?clearSealArtifacts\(leader, working\.id\)/.test(applet),
  "abandoning a Working takes its artifact too");
ok(applet.includes("registerRitualSeal()"), "the seal API is registered with the applet");
ok(template.includes("seal.artifactHint"), "the panel says what a seal will leave before the roll");
ok(template.includes("seal.artifactUuid") && template.includes('data-action="openDoc"'),
  "…and links the artifact once it exists");
ok(source.includes("export function registerRitualSeal"), "registerRitualSeal is exported");
for (const name of ["applySealArtifact", "clearSealArtifacts", "sealArtifactsOf", "ritualEffectOf"]) {
  if (!new RegExp(`module\\.api[\\s\\S]{0,400}${name}`).test(source)) failures.push(`api does not expose ${name}`);
}
ok(true, "the ship surface is on module.api");
ok(source.includes("game.ghostwire = {"), "…and on game.ghostwire");
ok(MARKER_KIND === "ritual-marker" && RITUAL_EFFECT_FLAG === "ritualEffect",
  `artifacts are findable by flags.${MODULE_ID}.kind and flags.${MODULE_ID}.${RITUAL_EFFECT_FLAG}`);

/* ---------- 8. art + firewall ---------- */
console.log("\n8) Art and the resource firewall");
const assetPath = MARKER_ART.replace(`modules/${MODULE_ID}/`, "");
ok(existsSync(assetPath), `the Ward marker token art ships: ${assetPath}`);
ok(!/system\.hero\.wealth|WEALTH_PATH|formatYen/.test(source), "the seal module never touches ¥");
// The header comment names the firewall, so strip comments before looking for a real resource write.
const code = source.replace(/^\s*\/\/.*$/gm, "");
ok(!/essence|conviction|resonance/i.test(code), "…and never touches Essence, Conviction or Resonance");
ok(source.includes("combat: { turns: 0"), "a scene marker takes no combat turn");
ok(source.includes("TOKEN_DISPOSITIONS.NEUTRAL"), "…and stands neutral, not as a combatant on anybody's side");

if (failures.length) {
  console.error(`\nRitual Seal smoke FAILED:\n  - ${failures.join("\n  - ")}`);
  process.exit(1);
}
console.log("\nRitual Seal smoke passed");
