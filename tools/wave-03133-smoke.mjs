#!/usr/bin/env node
/**
 * 0.3.133 wave smoke — locks A, A2, B, C, D, E.
 *
 * The theme of this wave is *matching the wrong thing*: art matched by per-tier filename, a pact
 * matched by one dsid on one feature, a cover effect matched by nothing at all, and three SFX rules
 * matched against a lang key instead of a name. So almost every assertion here runs the **real
 * exported function** over the **real shipped data** rather than re-typing either — including
 * `resolveSfxIn`, which 0.3.133 made injectable precisely so this file can run the shipped
 * scripts/data/sfx-map.json through the shipped resolver in Node.
 *
 * Run: `node tools/wave-03133-smoke.mjs`
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import {
  LEGACY_SUMMON_ART, SUMMON_ART, SUMMON_ART_KINDS, isLegacySummonArt, summonArtUpdate,
} from "../scripts/summon-art.mjs";
import { NEUTRAL_TINT, PACT_TINTS, pactTint } from "../scripts/veil-summons.mjs";
import {
  COVER_CONCEAL_ID, COVER_SOURCE_CONCEAL, COVER_SOURCE_TAKE_COVER, coverDropPlan, nextCoverSources,
} from "../scripts/cover-conceal.mjs";
import {
  RETIRED_TAKE_COVER_EFFECT_ID, TAKE_COVER_DSID, TAKE_COVER_ID, isTakeCover, takeCoverCleanup,
} from "../scripts/take-cover.mjs";
import { deCamel, resolveSfxIn, sfxNameCandidates } from "../scripts/sfx.mjs";
import { MARKER_ART, callingTemplateDsid, familyKey } from "../scripts/ritual-seal.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const fail = [];
const note = (pass, msg) => { if (pass) console.log(`  ✓ ${msg}`); else { fail.push(msg); console.log(`  ✗ ${msg}`); } };

const read = path => readFileSync(path, "utf8").replace(/\r\n/g, "\n");
const readJson = path => JSON.parse(read(path));
/** Source with every comment line dropped — a header that *names* a thing is not the thing. */
const code = text => text.split("\n").filter(line => !/^\s*(\/\/|\*|\/\*)/.test(line)).join("\n");

const manifest = readJson("module.json");
const lang = readJson("lang/en.json");
const sfxMap = readJson("scripts/data/sfx-map.json");
const veilCode = code(read("scripts/veil-summons.mjs"));
const takeCoverCode = code(read("scripts/take-cover.mjs"));
const concealCode = code(read("scripts/conceal.mjs"));
const moduleCode = code(read("scripts/module.mjs"));
const summonArtCode = code(read("scripts/summon-art.mjs"));

/** A `GHOSTWIRE.*` key that actually resolves in lang/en.json. */
function langHas(dotted) {
  let node = lang;
  for (const part of dotted.split(".")) {
    if (!node || (typeof node !== "object") || !(part in node)) return false;
    node = node[part];
  }
  return typeof node === "string";
}
const localize = key => {
  let node = lang;
  for (const part of key.split(".")) {
    if (!node || (typeof node !== "object") || !(part in node)) return key;
    node = node[part];
  }
  return (typeof node === "string") ? node : key;
};

/** Every Actor JSON under a pack source tree, keyed by its dsid. */
function actorsByDsid(root) {
  const out = new Map();
  const walk = dir => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) { walk(path); continue; }
      if (!entry.name.endsWith(".json") || entry.name.startsWith("_")) continue;
      const doc = readJson(path);
      const dsid = doc.flags?.[MODULE_ID]?.dsid ?? doc.system?._dsid;
      if (dsid) out.set(dsid, { path, doc });
    }
  };
  if (existsSync(root)) walk(root);
  return out;
}

const summons = actorsByDsid("src/packs/summons");
const bestiary = actorsByDsid("src/packs/bestiary");

/** Resolve an item shape through the shipped map, with lang/en.json standing in for game.i18n. */
const sfx = (name, dsid = null, keywords = []) =>
  resolveSfxIn(sfxMap, { name, system: { _dsid: dsid, keywords } }, { localize });
const sfxFile = (...args) => sfx(...args).src.split("/").pop();

console.log("0.3.133 wave smoke\n");

/* ================================================================ A — summon + sprite token art */

console.log("A1) Every mapped summon wears its art, and the art is on disk");

{
  const missingRows = [...Object.keys(SUMMON_ART)].filter(dsid => !summons.has(dsid));
  note(missingRows.length === 0, `all ${Object.keys(SUMMON_ART).length} mapped dsids exist in src/packs/summons (${missingRows.join(", ") || "none missing"})`);

  const wrong = [];
  const offDisk = [];
  const tinted = [];
  for (const [dsid, art] of Object.entries(SUMMON_ART)) {
    const row = summons.get(dsid);
    if (!row) continue;
    const { doc } = row;
    if ((doc.img !== art) || (doc.prototypeToken?.texture?.src !== art)) wrong.push(dsid);
    const file = art.replace(`modules/${MODULE_ID}/`, "");
    if (!existsSync(file)) offDisk.push(file);
    // A2 lock: the pack row stays on the neutral base. Tint is runtime, never baked.
    if (doc.prototypeToken?.texture?.tint !== NEUTRAL_TINT) tinted.push(dsid);
  }
  note(wrong.length === 0, `every row's img AND prototypeToken.texture.src point at it${wrong.length ? ` (wrong: ${wrong.join(", ")})` : ""}`);
  note(offDisk.length === 0, `every art file ships${offDisk.length ? ` (missing: ${[...new Set(offDisk)].join(", ")})` : ""}`);
  note(tinted.length === 0, `and every pack row is left on the neutral base ${NEUTRAL_TINT}${tinted.length ? ` (tinted: ${tinted.join(", ")})` : ""}`);
}

console.log("\nA2) One art per family — a Probe is a Probe at every tier");

{
  const families = {};
  for (const [dsid, art] of Object.entries(SUMMON_ART)) (families[art] ??= []).push(dsid);
  for (const stem of ["agent-probe", "agent-spike", "agent-daemon", "agent-watchdog",
    "sprite-data", "sprite-attack", "sprite-machine", "sprite-ward"]) {
    const art = `modules/${MODULE_ID}/assets/tokens/summons/${stem}.webp`;
    note((families[art] ?? []).length === 3, `${stem}.webp covers all three tiers`);
  }
  for (const [dsid, file] of [
    ["elemental-rank-1", "bound-elemental-rank-1.webp"],
    ["elemental-rank-2", "bound-elemental-rank-2.webp"],
    ["elemental-rank-3", "bound-elemental-rank-3.webp"],
    ["elemental-greater", "greater-living-mountain.webp"],
    ["spirit-guardian", "pact-spirit-guardian.webp"],
    ["spirit-warrior", "pact-spirit-warrior.webp"],
    ["spirit-hunter", "pact-spirit-hunter.webp"],
  ]) {
    note(SUMMON_ART[dsid]?.endsWith(`/${file}`), `${dsid} wears ${file}`);
  }
}

console.log("\nA3) The world sync only ever replaces art the module shipped");

{
  const probe = "agent-probe-minor";
  const old = LEGACY_SUMMON_ART[probe][0];
  note(old.endsWith("agent-probe-minor.png"), `the old ${probe} path is remembered: ${old.split("/").pop()}`);
  note(isLegacySummonArt(probe, old) === true, "…and is recognised as replaceable");
  note(isLegacySummonArt(probe, SUMMON_ART[probe]) === false, "art already current is left alone (the pass is idempotent)");
  note(isLegacySummonArt(probe, "worlds/mine/my-probe.webp") === false, "a Director's own art is NEVER replaced");
  note(isLegacySummonArt("not-a-summon", old) === false, "a dsid this file does not own is refused outright");

  const update = summonArtUpdate({ dsid: probe, kind: "agent", img: old, tokenSrc: old });
  note((update.img === SUMMON_ART[probe]) && (update["prototypeToken.texture.src"] === SUMMON_ART[probe]),
    "a legacy row is repointed on both the portrait and the prototype token");
  note(Object.keys(summonArtUpdate({ dsid: probe, kind: "agent", img: SUMMON_ART[probe], tokenSrc: SUMMON_ART[probe] })).length === 0,
    "…and a current row is not written to at all");
  note(Object.keys(summonArtUpdate({ dsid: probe, kind: "machine", img: old, tokenSrc: old })).length === 0,
    "a foreign kind (machine / node / kiosk) is never touched");
  note(SUMMON_ART_KINDS.join(",") === "agent,sprite,elemental,spirit", "the four owned kinds are the four summon families");
  note(!/tint/.test(summonArtCode), "and the sync writes no tint anywhere — the pact owns that");
  note(/Hooks\.once\("ready"/.test(summonArtCode) && /game\.user\.isGM/.test(summonArtCode),
    "it runs GM-only on ready");
  note(/summonArtSyncVersion/.test(summonArtCode) && /game\.settings\.set/.test(summonArtCode),
    "…once per art generation, gated on a recorded version");
  note(/registerSummonArt\(\)/.test(moduleCode), "and module.mjs registers it");

  // The three Companions were replaced in place, so there is nothing for the migration to do.
  for (const dsid of ["companion-ember", "companion-zephyr", "companion-boulder"]) {
    note((LEGACY_SUMMON_ART[dsid] ?? []).length === 0, `${dsid} has no legacy path — the file itself was replaced`);
  }
}

console.log("\nA4) The superseded files are gone and nothing still points at them");

{
  const gone = [
    ...["probe", "spike", "daemon", "watchdog"].flatMap(a =>
      ["minor", "intermediate", "advanced"].map(b => `assets/tokens/summons/agent-${a}-${b}.png`)),
    ...["data", "attack", "machine", "ward"].flatMap(s =>
      ["minor", "intermediate"].map(b => `assets/tokens/summons/sprite-${s}-${b}.webp`)),
    "assets/tokens/summons/elemental-rank-1.webp",
    "assets/tokens/summons/spirit-guardian.webp",
    "assets/tokens/summons/spirit-warrior.webp",
    "assets/tokens/summons/spirit-hunter.webp",
  ];
  const left = gone.filter(existsSync);
  note(left.length === 0, `all ${gone.length} superseded files deleted${left.length ? ` (left: ${left.join(", ")})` : ""}`);
  note(MARKER_ART.endsWith("/sprite-ward.webp"), "the F8 ritual marker points at sprite-ward.webp, not the dead -minor");
  note(existsSync(MARKER_ART.replace(`modules/${MODULE_ID}/`, "")), "…and that file ships");
  const generator = read("tools/gen-hacker-agents.mjs");
  note(!/writePng|tokenRgba/.test(code(generator)), "the agent generator no longer draws placeholder PNGs");
  note(/agentArt/.test(code(generator)), "…it points every tier at the family art instead");
  note(/DESTRUCTIVE/.test(generator), "and it warns that re-running it reassigns ids");
}

/* ================================================================ A2 — Street Priest pact tint */

console.log("\nA2a) The two tints, and the neutral base for a priest with no pact");

{
  note(PACT_TINTS.light === "#fff1b8" && PACT_TINTS.dark === "#c9a0ff", "Light #fff1b8 / Dark #c9a0ff");
  note(pactTint("light") === "#fff1b8", "a Light priest summons a Light spirit");
  note(pactTint("dark") === "#c9a0ff", "a Dark priest summons a Dark spirit");
  note(pactTint(null) === NEUTRAL_TINT && pactTint(undefined) === NEUTRAL_TINT && pactTint("teal") === NEUTRAL_TINT,
    `no pact (and no nonsense pact) is neutral ${NEUTRAL_TINT}, never a guess`);
  // module.mjs owns the same two hexes for the manual sheet toggle; they must not drift.
  note(/PACT_TINTS = \{ light: "#fff1b8", dark: "#c9a0ff" \}/.test(read("scripts/module.mjs")),
    "syncPactTint in module.mjs agrees on both hexes");
}

console.log("\nA2b) Pact detection has four layers, and the pack rows carry the flag it reads first");

{
  for (const [file, pact] of [["light-pact", "light"], ["dark-pact", "dark"]]) {
    const item = readJson(`src/packs/classes/street-priest/${file}.json`);
    note(item.flags?.[MODULE_ID]?.pactAlignment === pact, `${file}.json carries flags.pactAlignment = ${pact}`);
    note(item.system?._dsid === file, `…and system._dsid = ${file}`);
  }
  // Vessa is the shipped Street Priest pregen; if her pact stops being readable, every spirit she
  // calls goes grey and nothing else in the module notices.
  const vessa = readJson("src/packs/pregens/vessa-corran-dov.json");
  const vessaPact = vessa.items.find(i => i.flags?.[MODULE_ID]?.pactAlignment);
  note(vessaPact?.flags[MODULE_ID].pactAlignment === "light", "the Vessa pregen is still readable as Light");
  note(vessa.items.some(i => i.system?._dsid === "light-pact"), "…by dsid as well as by flag");

  note(/pactOf\(actor\)/.test(veilCode), "casterPact reads pact-strike.mjs's pactOf (the pactAlignment flag) first");
  note(/hasDsid\(actor, "light-pact"\)/.test(veilCode), "…then the light-pact / dark-pact dsid");
  note(/flag\(actor, "pact"\)/.test(veilCode), "…then an Actor flag a Director set by hand");
  note(/light\[- \]\?pact/.test(veilCode), "…and finally the feature's printed name");
}

console.log("\nA2c) The placed token is tinted, not only the prototype");

{
  note(/foundry\.utils\.setProperty\(tokenData, "texture\.tint", pactTint\(pact\)\)/.test(veilCode),
    "summonVeil writes texture.tint onto the token document it places");
  note(/setProperty\(data, "prototypeToken\.texture\.tint", pactTint\(pact\)\)/.test(veilCode),
    "…and onto the prototype, so a second token of the same spirit is right too");
  note(/PactNeutral/.test(veilCode) && langHas("GHOSTWIRE.Summons.Veil.UI.PactNeutral"),
    "a pactless priest is told why the spirit is grey");
  for (const dsid of ["spirit-guardian", "spirit-warrior", "spirit-hunter"]) {
    const doc = summons.get(dsid)?.doc;
    note(doc?.flags?.[MODULE_ID]?.pact === null, `${dsid} still serves both pacts (flags.pact === null)`);
    const tints = (doc?.effects ?? []).map(e => e.flags?.[MODULE_ID]?.pactTint).filter(Boolean).sort();
    note(tints.join("/") === "dark/light", `…and carries both a Pact: Light and a Pact: Dark effect`);
  }
  // Sentinel Spirit is a Street Priest "summon" that deliberately places no token, so there is no
  // tint path to fix — assert the card is still token-less rather than silently growing one.
  const sentinel = readJson("src/packs/classes/street-priest/abilities/sentinel-spirit.json");
  note(sentinel.system._dsid === "sentinel-spirit" && !/SPIRIT_ABILITIES.*sentinel/.test(veilCode),
    "Sentinel Spirit is still not a token summon (nothing to tint)");
}

/* ================================================================ B — Take Cover */

console.log("\nB1) The card: the retired 2-bane effect is gone from the pack and from every pregen");

{
  const card = readJson("src/packs/abilities/take-cover.json");
  note(card._id === TAKE_COVER_ID && card.system._dsid === TAKE_COVER_DSID,
    `the card is still ${TAKE_COVER_ID} / _dsid "${TAKE_COVER_DSID}" (the Defend swap every hero owns)`);
  note((card.effects ?? []).length === 0, "the 2-bane Active Effect is off the card entirely");
  note(takeCoverCleanup(card).clean, "…and takeCoverCleanup agrees there is nothing left to strip");
  note(isTakeCover(card) === true, "isTakeCover recognises the card");
  note(isTakeCover({ type: "ability", system: { _dsid: "rush" } }) === false, "…and does not recognise Rush");
  note(isTakeCover({ type: "feature", system: { _dsid: TAKE_COVER_DSID } }) === false, "…nor a feature that happens to share the dsid");
  note(isTakeCover({ type: "ability", _id: TAKE_COVER_ID, system: { _dsid: "renamed-by-a-director" } }) === true,
    "a Director-renamed _dsid still matches on the compendium id");

  const pregens = readdirSync("src/packs/pregens").filter(f => f.endsWith(".json") && !f.startsWith("_"));
  const dirty = [];
  let copies = 0;
  for (const file of pregens) {
    for (const item of readJson(join("src/packs/pregens", file)).items ?? []) {
      if (!isTakeCover(item)) continue;
      copies++;
      if (!takeCoverCleanup(item).clean) dirty.push(file);
    }
  }
  note(copies === pregens.length, `all ${pregens.length} pregens still carry a Take Cover copy`);
  note(dirty.length === 0, `and none of them still carries ${RETIRED_TAKE_COVER_EFFECT_ID}${dirty.length ? ` (${dirty.join(", ")})` : ""}`);
  note(!read("lang/en.json").includes(`/apply ${RETIRED_TAKE_COVER_EFFECT_ID}`),
    "the dead [[/apply]] link is out of lang/en.json");
}

console.log("\nB2) The rewritten card text says what it now does");

{
  const description = lang.GHOSTWIRE.Abilities.TakeCover.Description;
  const effect = lang.GHOSTWIRE.Abilities.TakeCover.EffectDescription;
  note(/Cover\/Conceal/.test(description), "Description names Cover/Conceal");
  note(/bane/.test(description) && /ranged/i.test(description), "…one bane on ranged attacks");
  note(/melee is unaffected/i.test(description), "…melee unaffected");
  note(/until they move|when you move/i.test(description), "…and that it ends on a move");
  note(!/double bane|double edge/i.test(description) && !/double bane|double edge/i.test(effect),
    "and the retired double bane / double edge are not mentioned anywhere");
  for (const key of ["Chat.Taken", "Chat.Moved", "Settings.Apply.Name", "Settings.Apply.Hint"]) {
    note(langHas(`GHOSTWIRE.Abilities.TakeCover.${key}`), `lang key TakeCover.${key} resolves`);
  }
}

console.log("\nB3) Cover carries its sources, so only Take Cover's cover is mortal");

{
  note(nextCoverSources(null, { add: COVER_SOURCE_TAKE_COVER }).join() === COVER_SOURCE_TAKE_COVER,
    "taking cover records take-cover");
  note(nextCoverSources([COVER_SOURCE_TAKE_COVER], { add: COVER_SOURCE_TAKE_COVER }).length === 1,
    "taking cover twice records it once (the status never stacks with itself)");
  note(nextCoverSources([COVER_SOURCE_TAKE_COVER], { add: COVER_SOURCE_CONCEAL }).join() ===
    `${COVER_SOURCE_TAKE_COVER},${COVER_SOURCE_CONCEAL}`, "a Scout rolling Conceal on top adds a second source");

  const both = coverDropPlan([COVER_SOURCE_TAKE_COVER, COVER_SOURCE_CONCEAL], COVER_SOURCE_TAKE_COVER);
  note(both.owned && !both.ends && (both.remaining.join() === COVER_SOURCE_CONCEAL),
    "moving with both up removes only the Take Cover source — the Scout keeps their cover");

  const only = coverDropPlan([COVER_SOURCE_TAKE_COVER], COVER_SOURCE_TAKE_COVER);
  note(only.owned && only.ends, "moving with only Take Cover up ends the cover");

  const scoutOnly = coverDropPlan([COVER_SOURCE_CONCEAL], COVER_SOURCE_TAKE_COVER);
  note(!scoutOnly.owned && !scoutOnly.ends, "a Scout who never took cover does not lose theirs by moving");

  const director = coverDropPlan(null, COVER_SOURCE_TAKE_COVER);
  note(!director.owned && !director.ends, "and a Director's hand-toggled cover (no sources) is never touched");
}

console.log("\nB4) The runtime is wired");

{
  note(/createChatMessage/.test(takeCoverCode) && /isTakeCover\(ability\)/.test(takeCoverCode),
    "using the card is the trigger (the ability-use chat message, as conceal.mjs and sfx.mjs do)");
  note(/preUpdateToken/.test(takeCoverCode) && /updateToken/.test(takeCoverCode) && /movedSquare/.test(takeCoverCode),
    "…and a square change is what ends it, compared on squares rather than pixels");
  note(/addCoverSource\(actor, COVER_SOURCE_TAKE_COVER\)/.test(takeCoverCode), "it applies through the shared source list");
  note(/dropCoverSource\(actor, COVER_SOURCE_TAKE_COVER\)/.test(takeCoverCode), "…and only ever drops its own source");
  note(/addCoverSource\(actor, COVER_SOURCE_CONCEAL\)/.test(concealCode), "Scout Conceal tags its cover too");
  note(/Hooks\.once\("ready"/.test(takeCoverCode) && /deleteEmbeddedDocuments\("ActiveEffect"/.test(takeCoverCode),
    "a GM-only ready migration strips the retired effect off world copies");
  note(/registerTakeCover\(\)/.test(moduleCode), "and module.mjs registers it");
  note(COVER_CONCEAL_ID === "ghostwire-cover-conceal", "the status is still F13's one Cover/Conceal");
  const swapLine = read("scripts/module.mjs").split("\n").find(line => line.includes(TAKE_COVER_ID));
  note(!!swapLine && swapLine.includes("abilities.Item"),
    "Take Cover is still the Defend swap in DEFAULT_ITEM_SWAPS");
}

/* ================================================================ C — Breach and Clear SFX */

console.log("\nC1) The resolver stops matching the raw lang key");

{
  note(deCamel("BreachAndClear") === "Breach And Clear", "deCamel splits a CamelCase key segment");
  note(deCamel("GaspingInPain") === "Gasping In Pain", "…and another");
  const candidates = sfxNameCandidates(
    { name: "GHOSTWIRE.Classes.Operator.Items.BreachAndClear.Name", system: { _dsid: "breach-and-clear" } },
    { localize });
  note(candidates.includes("Breach & Clear"), "a key resolves to the localized name the card prints");
  note(candidates.includes("Breach And Clear"), "…and to the de-camelized key segment, so a Node smoke sees the same thing");
  note(candidates.includes("breach and clear"), "…and to the _dsid with dashes as spaces");
  note(!candidates.some(c => c.includes("GHOSTWIRE.")), "and NEVER to the raw key — that is what was pulling path segments in");
  const plain = sfxNameCandidates({ name: "Controlled Pair", system: { _dsid: "controlled-pair" } }, { localize });
  note(plain.includes("Controlled Pair"), "a plain-text name is still matched as itself");
}

console.log("\nC2) Breach and Clear fires a pistol");

{
  const key = "GHOSTWIRE.Classes.Operator.Items.BreachAndClear.Name";
  note(localize(key) !== key, "the card has a printed name in lang/en.json");
  note(sfx(key, "breach-and-clear", ["ranged", "strike", "weapon"]).rule === "firearm-ability-single",
    "it lands on firearm-ability-single, above the hacking rule");
  note(sfxFile(key, "breach-and-clear", ["ranged", "strike", "weapon"]) === "pistol-single.ogg",
    "…and plays pistol-single.ogg, not the tech sound");
  const rule = sfxMap.rules.find(r => r.id === "firearm-ability-single");
  note(/breach\.\?and\.\?clear/.test(rule.match), "the pattern is space-tolerant (`breach.?and.?clear`)");
  note(/hold\.\?the\.\?line/.test(rule.match), "…and so is its multi-word sibling Hold the Line");

  // The ammo half of the card, unchanged by this wave but asserted so a regression shows up here.
  note(readJson("scripts/data/sfx-map.json").rules.some(r => r.id === "firearm-ability-single"),
    "the rule still ships");
  const ammo = read("scripts/ammo.mjs");
  note(/"breach-and-clear": 1/.test(ammo), "Breach and Clear still spends 1 round");
  note(/needsGunPick/.test(ammo) && /planFireN|plan\.needed/.test(ammo),
    "…and still runs through the shared gun picker and the short-magazine refusal");
}

console.log("\nC3) Every rule's word boundaries actually are word boundaries");

{
  // Seventeen rules shipped `\\b` (an escaped backslash, then a literal b) where they meant `\b`, so
  // those alternatives could only ever match a name containing a real backslash.
  const DOUBLE = "\\" + "\\";
  const broken = sfxMap.rules.filter(r => r.match?.includes(DOUBLE)).map(r => r.id);
  note(broken.length === 0, `no rule carries a literal double backslash${broken.length ? ` (${broken.join(", ")})` : ""}`);
  note(sfx("Deep Scan", "deep-scan", ["wired"]).rule === "wired-scan", "`\\b(scan|probe|trace)\\b` matches Deep Scan again");
  note(sfx("Quarry", "quarry", ["ranged"]).rule === "scout-mark", "Quarry is still the mark sound");
  note(sfxFile("Hex Round", "hex-round", ["ranged"]) === "hex-round.ogg", "Hex Round keeps its own sound");
  note(/spell-/.test(sfxFile("Bolt Barrage", "bolt-barrage", ["magic", "ranged"])), "Bolt Barrage is still a spell");
  for (const rule of sfxMap.rules) {
    if (!rule.match) continue;
    try { new RegExp(rule.match, "i"); } catch { fail.push(`rule ${rule.id} does not compile`); }
  }
  note(true, `all ${sfxMap.rules.length} rules compile as regular expressions`);
}

console.log("\nC4) The multi-word patterns that were dead now reach their cards");

{
  // Each of these is `<lang key>` → `<rule it must now hit>`; every one of them used to fall through
  // because a literal space cannot match a CamelCase key.
  for (const [key, dsid, keywords, rule] of [
    ["GHOSTWIRE.Classes.StreetPriest.Items.LayOnHands.Name", "lay-on-hands", ["magic"], "veil-heal-strong"],
    ["GHOSTWIRE.Classes.StreetPriest.Items.InvokeThePact.Name", "invoke-the-pact", ["magic"], "wired-compile"],
  ]) {
    note(sfx(key, dsid, keywords).rule === rule, `${localize(key)} → ${rule}`);
  }
  note(typeof sfxMap["_comment0.3.133"] === "string" && /sfxNameCandidates/.test(sfxMap["_comment0.3.133"]),
    "the map records why its multi-word patterns are reachable at all");
}

/* ================================================================ D — Breathless SFX */

console.log("\nD) Breathless Hit is a knife, not a monster");

{
  const key = "GHOSTWIRE.Classes.Scout.Items.GaspingInPain.Name";
  note(localize(key) === "Breathless Hit", "the Scout signature prints as Breathless Hit");
  const scream = sfxMap.rules.find(r => r.id === "creature-scream");
  note(!/breathless|gasping/i.test(scream.match), "`breathless` and `gasping` are off the creature-scream rule");
  note(/scream\|shriek\|howl/.test(scream.match), "…and the three real screams stay");
  const hit = sfx(key, "gasping-in-pain", ["melee", "strike", "weapon"]);
  note(hit.rule !== "creature-scream", "Breathless Hit no longer screams");
  note(hit.rule === "impact" && hit.src.endsWith("sword-crit.ogg"), "…it reads as the melee weapon strike it is");
  const impact = sfxMap.rules.find(r => r.id === "impact");
  note((impact.keywords ?? []).includes("melee") && (impact.keywords ?? []).includes("weapon"),
    "the impact rule is keyword-gated, so nothing ranged reaches its new `hit`");
  note(sfx("Ghost Round", "ghost-round", ["ranged", "strike", "weapon"]).rule !== "impact",
    "…proved: a ranged strike with no melee keyword does not land there");

  // Nothing else in the module is named for a scream, so the rule has no other hero to catch.
  const heroNames = JSON.stringify(lang.GHOSTWIRE.Classes ?? {});
  const caught = ["scream", "shriek", "howl"].filter(word => new RegExp(`"Name": "[^"]*${word}`, "i").test(heroNames));
  note(caught.length === 0, `no hero ability name contains scream / shriek / howl${caught.length ? ` (${caught.join(", ")})` : ""}`);
}

/* ================================================================ E — Calling ritual seals */

console.log("\nE) Every Calling Formula calls something that exists");

{
  const dir = "src/packs/gear/general/ritual-formulas";
  const formulas = readdirSync(dir).filter(f => f.endsWith(".json") && !f.startsWith("_"))
    .map(f => readJson(join(dir, f)))
    .filter(item => item.flags?.[MODULE_ID]?.ritual?.formula === true);
  const callings = formulas.filter(item => familyKey(item.flags[MODULE_ID].ritual.family) === "calling");
  note(callings.length === 12, `${callings.length} Calling Formulas ship`);

  const named = callings.map(item => [item.system._dsid, callingTemplateDsid(item.flags[MODULE_ID].ritual)]);
  const missing = named.filter(([, dsid]) => !dsid).map(([f]) => f);
  note(missing.length === 0, `every one names a ritual.summonDsid${missing.length ? ` (missing: ${missing.join(", ")})` : ""}`);

  const dangling = named.filter(([, dsid]) => dsid && !summons.has(dsid) && !bestiary.has(dsid));
  note(dangling.length === 0,
    `and every dsid resolves in the summons or bestiary pack${dangling.length ? ` (${dangling.map(([f, d]) => `${f}→${d}`).join(", ")})` : ""}`);
  for (const [formula, dsid] of named.sort()) note(!!dsid, `  ${formula} → ${dsid}`);

  const strays = formulas.filter(item => familyKey(item.flags[MODULE_ID].ritual.family) !== "calling")
    .filter(item => item.flags[MODULE_ID].ritual.summonDsid).map(item => item.system._dsid);
  note(strays.length === 0, `no non-Calling family carries one${strays.length ? ` (${strays.join(", ")})` : ""}`);

  const generator = read("tools/ritual-formulas-to-items.mjs");
  note(/CALLING_SUMMON/.test(generator) && /has no CALLING_SUMMON entry/.test(generator),
    "the dsids are set at the source, and a new Calling card with none is a hard error");
  note(/BESTIARY_PACK_ID/.test(veilCode), "templateFor searches the bestiary as well as Summons & Machines");
  note(!/TODO \(F2 \/ S1\)/.test(read("scripts/ritual-seal.mjs")), "the F8 TODO is retired");
  note(/every.{0,40}shipped Calling Formula now names one/i.test(read("scripts/ritual-seal.mjs")),
    "…and replaced by what is actually true");
}

/* ================================================================ version, docs, wiring */

console.log("\nF) Version, docs and wiring");

note(manifest.version === "0.3.133", `module.json is ${manifest.version}`);
note(/`0\.3\.133`/.test(read("README.md")), "README has a 0.3.133 entry");
note(existsSync("docs/directors/03133-smoke.md"), "the Foundry checklist is written");
// The per-wave result doc (`_claude-03133-result.md`) is deliberately NOT asserted: `_claude-*` is
// gitignored, so it exists on the machine that wrote it and in no clone.
{
  const checklist = existsSync("docs/directors/03133-smoke.md") ? read("docs/directors/03133-smoke.md") : "";
  for (const item of ["Take Cover", "Breach and Clear", "Breathless", "Invoke the Pact", "Compile Agent",
    "Watcher", "summon art", "Conceal"]) {
    note(checklist.includes(item), `the checklist covers ${item}`);
  }
}
note(existsSync("scripts/take-cover.mjs") && existsSync("scripts/summon-art.mjs"), "both new scripts ship");
note(manifest.esmodules?.includes("scripts/module.mjs") !== false, "and module.mjs is still the entry point");

/* ================================================================ */

console.log(fail.length ? `\n0.3.133 smoke FAIL — ${fail.length}` : "\n0.3.133 smoke OK");
for (const msg of fail) console.log(`  - ${msg}`);
process.exit(fail.length ? 1 : 0);
