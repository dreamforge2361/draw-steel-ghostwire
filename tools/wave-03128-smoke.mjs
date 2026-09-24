#!/usr/bin/env node
/**
 * 0.3.128 wave smoke — the five locks of the FX / ammo / NPC-loot / Mark / Stamina build.
 *
 *   A  Hit FX run two beats (origin -> target, then impact), spells are a classified kind, the 20
 *      hero-gun abilities resolve to a firearm sound instead of the scan default, the grenade boom
 *      is short, and no path asks for Automated Animations, Sequencer or JB2A.
 *   B  Class / origin / kit gun abilities spend rounds from the hero's own magazine at the locked
 *      costs, a short magazine refuses before the roll, and nothing from the Borderline or Excluded
 *      columns of the research note is wired.
 *   C  A Ghostwire Loot panel puts an NPC's embedded treasure on the sheet and makes it draggable,
 *      with an honest empty state for the bodies the loot table deliberately left empty.
 *   D  Five Mark sources apply a real effect, and the edge is scoped to the side each ability's own
 *      text names — the blanket `targetModifiers.edges` change is gone from Commander Mark.
 *   E  Kits grant 0 Stamina, a shield is its own worn group, armor and shield bands are `add` so
 *      they stack, one armor at a time still holds, and the RAW says all of that.
 *
 * Run: node tools/wave-03128-smoke.mjs
 * Does not need live Foundry.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import {
  HIT_FX_KINDS, HIT_FX_PROFILES, SPELL_FLAVOURS, classifyHit, hitFxProfile, spellFlavour,
} from "../scripts/hit-fx.mjs";
import {
  AMMO_ABILITY_COSTS, AMMO_ABILITY_DSIDS, AMMO_FAMILY_BY_DSID,
  ammoCostForDsid, pickAmmoGunPlan, planFire, planFireN,
} from "../scripts/ammo.mjs";
import { isLootableItem, isStampedLoot, lootRows, lootSummary } from "../scripts/npc-loot.mjs";
import {
  MARK_DSIDS, MARK_SOURCES, hardTagBonusDamage, hardTagSpent, markExpired, markEdges, markSpecFor,
} from "../scripts/mark.mjs";
import {
  ARMOR_GROUPS, WORN_GROUPS, armorStaminaPlan, plannedStaminaFromGear,
} from "../scripts/stamina.mjs";
import { atLeast } from "./lib/module-version.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const fail = [];
const note = (pass, msg) => { if (pass) console.log(`  ✓ ${msg}`); else { fail.push(msg); console.log(`  ✗ ${msg}`); } };

const read = p => readFileSync(p, "utf8").replace(/\r\n/g, "\n");
const readJson = p => JSON.parse(read(p));
/** Source with every comment line dropped — a header that *names* a thing is not the thing. */
const code = text => text.split("\n").filter(line => !/^\s*(\/\/|\*|\/\*)/.test(line)).join("\n");

const lang = readJson("lang/en.json").GHOSTWIRE;
const langKey = path => path.split(".").reduce((o, k) => o?.[k], readJson("lang/en.json"));

console.log("0.3.128 wave smoke\n");

/* ------------------------------------------------------------------ A: hit FX */

console.log("A) Hit FX — two beats, four kinds, still no dependency");

const hitFx = read("scripts/hit-fx.mjs");

// A — the 0.3.127 three are still there, and `spell` joined them.
note(["gun", "melee", "grenade"].every(kind => HIT_FX_KINDS.includes(kind)),
  "the 0.3.127 slice is intact");
note(HIT_FX_KINDS.includes("spell"), "and `spell` is a kind now");

// The classifier, step by step — the order is the rule.
note(classifyHit({ thrownBlast: true, range: "Short" }) === "grenade", "a thrown Blast is a grenade, band notwithstanding");
note(classifyHit({ range: "Adjacent" }) === "melee", "an Adjacent-band weapon is melee");
note(classifyHit({ range: "Medium", ammoFamily: "handgun" }) === "gun", "a weapon that eats rounds is a gun");
note(classifyHit({ gunAbility: true, keywords: ["ranged", "strike", "weapon"] }) === "gun",
  "A1: a class ability on the ammo allowlist is a gun even with no gear behind it");
note(classifyHit({ keywords: ["magic", "ranged", "area"], distanceType: "cube" }) === "spell",
  "a magic working is a spell");
note(classifyHit({ keywords: ["psionic", "ranged"] }) === "spell", "and so is a psionic one");
note(classifyHit({ keywords: ["melee", "strike", "weapon"], distanceType: "melee" }) === "melee",
  "a class melee strike with no gear stamp still swings");
note(classifyHit({ range: "Short", keywords: ["ranged", "strike", "weapon"] }) === null,
  "a bow is still out of scope — `ranged` + `weapon` alone is never a gun");
note(classifyHit({ keywords: ["command"], distanceType: "ranged" }) === null, "a Commander's shout gets nothing");
note(classifyHit({ keywords: ["tech"], distanceType: "ranged" }) === null,
  "and `tech` alone is not a spell: a drone deploy is a tool bag, not a bolt");

// A2 — every kind that has an origin animates from it.
for (const kind of ["gun", "spell", "melee"]) {
  note(typeof HIT_FX_PROFILES[kind].travel === "string" && HIT_FX_PROFILES[kind].travelMs > 0,
    `${kind}: a travel beat with a duration (${HIT_FX_PROFILES[kind].travel})`);
}
note(HIT_FX_PROFILES.grenade.travel === null, "a grenade has no origin, so it only bursts");
note(/drawTravel\(/.test(code(hitFx)) && /drawImpact\(/.test(code(hitFx)),
  "both beats are drawn, off one ticker");
note(/impact: false/.test(code(hitFx)),
  "and the half-and-half Sequencer case draws travel only, so JB2A's impact is not doubled");

// A — spell flavours, and every sound on disk.
note(spellFlavour("Fire Blast").key === "fire", "Fire Blast is fire");
note(spellFlavour("Dark Blast").key === "dark", "Dark Blast is dark, not a detonation");
note(spellFlavour("Kinetic Driver").key === "lightning", "Kinetic Driver cracks");
note(spellFlavour("Hurl Element").key === "arcane", "and a name that says nothing still gets a sound");
for (const flavour of SPELL_FLAVOURS) {
  const path = flavour.sound.replace(`modules/${MODULE_ID}/`, "");
  note(existsSync(path), `spell/${flavour.key}: ${path.split("/").pop()} ships in the module`);
}
for (const kind of HIT_FX_KINDS) {
  const profile = hitFxProfile(kind, "");
  const path = profile.sound.replace(`modules/${MODULE_ID}/`, "");
  note(existsSync(path), `${kind}: its sound ships in the module (${path.split("/").pop()})`);
}

// A3 — the grenade boom is a different, smaller file than the one 0.3.127 shipped.
{
  const boom = HIT_FX_PROFILES.grenade.sound.replace(`modules/${MODULE_ID}/`, "");
  note(boom.endsWith("grenade-boom.ogg"), "A3: the grenade profile points at grenade-boom.ogg");
  const old = "assets/sfx/spell-fire-blast.ogg";
  note(existsSync(boom) && existsSync(old), "both files are on disk");
  const shrunk = readFileSync(boom).length < (readFileSync(old).length / 4);
  note(shrunk, `and the new one is under a quarter the size (${readFileSync(boom).length} vs ${readFileSync(old).length} bytes)`);
}

// A1 — the SFX map. Resolution is re-implemented here exactly as scripts/sfx.mjs does it.
{
  const map = readJson("scripts/data/sfx-map.json");
  const resolve = (name, keywords = []) => {
    const kw = new Set(keywords);
    for (const rule of map.rules) {
      const need = rule.keywords ?? [];
      const byKeyword = need.length ? need.some(k => kw.has(k)) : false;
      const byName = rule.match ? new RegExp(rule.match, "i").test(name) : false;
      const hit = rule.match ? (byName && (!need.length || byKeyword)) : byKeyword;
      if (!hit) continue;
      const srcs = (rule.srcs?.length ? rule.srcs : (rule.src ? [rule.src] : []));
      if (srcs.length) return srcs[0];
    }
    return map.default;
  };
  const FIREARM = /\/(pistol-|gun-)[^/]+\.ogg$/;
  const KEYWORDS = ["ranged", "strike", "weapon"];

  note(FIREARM.test(resolve("Controlled Pair", KEYWORDS)), "A1: Controlled Pair resolves to a firearm sound");
  note(resolve("Controlled Pair", KEYWORDS).endsWith("pistol-double-tap.ogg"),
    "and specifically to the double tap, not a drone or a scan");
  note(resolve("Controlled Pair", KEYWORDS) !== map.default, "it no longer falls through to the default");
  note(/scan-electronic/.test(map.default), "which is still the scan sound, for things that really are scans");

  const GUN_ABILITY_NAMES = {
    "controlled-pair": "Controlled Pair",
    "suppressing-fire": "Suppressing Fire",
    "breach-and-clear": "Breach and Clear",
    "hold-the-line": "Hold the Line",
    "overwatch": "Overwatch",
    "adrenaline-dump": "Adrenaline Dump",
    "saturation-fire": "Saturation Fire",
    "pinning-shot": "Pinning Shot",
    "night-watch-strike": "Night Watch Strike",
    "they-always-line-up": "They Always Line Up",
    "called-shot-vitals": "Called Shot (Vitals)",
    "called-shot-commlink": "Called Shot (Comm-link)",
    "ghost-round": "Ghost Round",
    "one-shot-one-kill": "One Shot, One Kill",
    "double-tap": "Double Tap",
    "kneecap-shot": "Kneecap Shot",
    "held-breath": "Held Breath",
    "bench-rigged-shot": "Bench-Rigged Shot",
    "neural-snap-shot": "Neural Snap Shot",
    "tablet-crossfire": "Tablet Crossfire",
  };
  note(Object.keys(GUN_ABILITY_NAMES).length === AMMO_ABILITY_DSIDS.length,
    `the map check covers all ${AMMO_ABILITY_DSIDS.length} ammo abilities`);
  const misses = Object.entries(GUN_ABILITY_NAMES)
    .filter(([, name]) => !FIREARM.test(resolve(name, KEYWORDS)))
    .map(([dsid]) => dsid);
  note(misses.length === 0, `every hero-gun ability sounds like a gun${misses.length ? ` (missing: ${misses.join(", ")})` : ""}`);

  // The things that must NOT have been swept up.
  note(/hex-round\.ogg$/.test(resolve("Hex Round", KEYWORDS)), "Hex Round keeps its own sound (a dartgun is not a firearm)");
  note(/spell-/.test(resolve("Bolt Barrage", ["magic", "ranged"])), "Bolt Barrage is still a spell");
  note(/scout-mark\.ogg$/.test(resolve("Quarry", ["ranged"])), "Quarry is still the mark sound");
  note(!FIREARM.test(resolve("Overwatch Lane", ["ranged"])),
    "and Overwatch Lane, which fires nothing, is excluded by name from the Overwatch rule");
}

// A4 — still no dependency.
note(!/autoanimations/i.test(code(hitFx)), "no code path asks for Automated Animations");
note(!readJson("module.json").relationships?.requires?.some?.(r => ["sequencer", "autoanimations", "JB2A_DnD5e"].includes(r.id)),
  "and module.json requires none of Sequencer / AA / JB2A");
note(/game\.modules\.get\("sequencer"\)\?\.active/.test(hitFx), "Sequencer is probed, never assumed");

/* ------------------------------------------------------------------ B: ability ammo */

console.log("\nB) Ability ammo — 20 abilities, the locked costs, and a refusal before the roll");

const ammo = read("scripts/ammo.mjs");

// B — the four Michael locked.
const LOCKED = { "controlled-pair": 2, "suppressing-fire": 5, "breach-and-clear": 1 };
for (const [dsid, cost] of Object.entries(LOCKED)) {
  note(ammoCostForDsid(dsid) === cost, `${dsid} spends ${cost}`);
}
note(planFire({ loadedCount: 12 }).count === 11, "and a normal Fire still spends exactly 1");

// B — every clear candidate from the research note, at its suggested cost.
const CLEAR = {
  "hold-the-line": 1, "overwatch": 1, "saturation-fire": 5, "adrenaline-dump": 3,
  "pinning-shot": 1, "night-watch-strike": 1, "they-always-line-up": 1,
  "called-shot-vitals": 1, "called-shot-commlink": 1, "ghost-round": 1, "one-shot-one-kill": 1,
  "double-tap": 2, "kneecap-shot": 1, "held-breath": 1,
  "bench-rigged-shot": 1, "neural-snap-shot": 1, "tablet-crossfire": 1,
};
for (const [dsid, cost] of Object.entries(CLEAR)) {
  note(ammoCostForDsid(dsid) === cost, `${dsid} spends ${cost}`);
}
note(AMMO_ABILITY_DSIDS.length === Object.keys(LOCKED).length + Object.keys(CLEAR).length,
  `${AMMO_ABILITY_DSIDS.length} abilities and no more — the allowlist is the whole policy`);

// B — every dsid on the list is a real ability on disk, at the path the note named.
{
  const found = new Map();
  const walk = dir => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) { walk(path); continue; }
      if (!entry.name.endsWith(".json") || entry.name.startsWith("_")) continue;
      let doc;
      try { doc = readJson(path); } catch { continue; }
      for (const item of [doc, ...(doc.items ?? [])]) {
        const dsid = item?.system?._dsid;
        if (dsid && (item.type === "ability") && AMMO_ABILITY_COSTS[dsid]) found.set(dsid, path);
      }
    }
  };
  walk("src/packs/classes");
  walk("src/packs/kits");
  const missing = AMMO_ABILITY_DSIDS.filter(dsid => !found.has(dsid));
  note(missing.length === 0, `every ammo dsid is a real pack ability${missing.length ? ` (missing: ${missing.join(", ")})` : ""}`);
}

// B — the exclusions, stated as assertions rather than as a comment.
for (const dsid of ["hex-round", "overwatch-lane", "vantage-trap", "crossfire", "quickdraw-shuffle",
  "ghost-out", "coup-de-grace", "you-talk-too-much", "setup", "rigged-fire", "focus-fire",
  "commander-overwatch", "mark", "quarry"]) {
  note(ammoCostForDsid(dsid) === 0, `${dsid} spends nothing`);
}
note(!("hex-round" in AMMO_FAMILY_BY_DSID), "and no bow or dartgun carries an ammoFamily to spend from");

// B2 — planFireN.
note(planFireN({ loadedCount: 12, count: 2 }).count === 10, "planFireN(12, 2) leaves 10");
note(planFireN({ loadedCount: 12, count: 2 }).spent === 2, "and reports 2 spent");
note(planFireN({ loadedCount: 5, count: 5 }).ok === true, "exactly enough is enough");
note(planFireN({ loadedCount: 4, count: 5 }).ok === false, "one short is a refusal");
note(planFireN({ loadedCount: 4, count: 5 }).reason === "short", "and the reason is `short`, not `empty`");
note(planFireN({ loadedCount: 4, count: 5 }).spent === 0, "a refusal spends nothing — no partial burst");
note(planFireN({ loadedCount: 0, count: 1 }).reason === "empty", "an empty gun is `empty`");
note(planFire({ loadedCount: 0 }).ok === false && planFire({ loadedCount: 0 }).count === 0,
  "and planFire keeps its 0.3.126 shape on top of it");

// B1 — which gun pays.
{
  const guns = [{ id: "a", name: "Workhorse", loaded: 1 }, { id: "b", name: "Chopper", loaded: 9 }];
  note(pickAmmoGunPlan({ guns, cost: 2 }).gunId === "b", "the fullest gun that can pay is picked");
  note(pickAmmoGunPlan({ guns, cost: 2 }).reason === null, "and the pick is not a refusal");
  note(pickAmmoGunPlan({ guns: [guns[0]], cost: 2 }).reason === "short",
    "one gun with one round in it is a short refusal");
  note(pickAmmoGunPlan({ guns: [guns[0]], cost: 2 }).name === "Workhorse",
    "and the refusal still names the gun, so the toast can say which");
  note(pickAmmoGunPlan({ guns: [], cost: 1 }).reason === "noGun", "no gun at all is `noGun`");
  const tie = [{ id: "z", name: "Slugger", loaded: 6 }, { id: "y", name: "Popper", loaded: 6 }];
  note(pickAmmoGunPlan({ guns: tie, cost: 1 }).gunId === pickAmmoGunPlan({ guns: [...tie].reverse(), cost: 1 }).gunId,
    "a tie resolves the same way whichever order the sheet is in");
}

// B3 — the refusal is before the roll, at the seam the empty refusal already used.
{
  const body = code(ammo);
  const refuse = body.indexOf('ui.notifications.warn(plan.reason === "empty"');
  const roll = body.indexOf("const message = await use.call(this, config, dialogOptions, messageOptions);");
  note(refuse > 0 && roll > refuse, "the short/empty refusal returns before Draw Steel's use() is called");
  note(/planFireN\(\{ loadedCount: state\.count, count: spend\.cost \}\)/.test(body),
    "and the plan is built from the ability's own cost");
}

// B4 — a spawned Fire is handled by fromGearId and never also by the allowlist.
note(/const fireGun = gunForAbility\(this\.parent, actor\);/.test(code(ammo)),
  "B4: fromGearId is checked first, so a free triggered Fire is never double-taxed");

// B — the lang the refusals need.
for (const key of ["GHOSTWIRE.Ammo.Short", "GHOSTWIRE.Ammo.Ability.NoGun", "GHOSTWIRE.Ammo.Chat.FiredN"]) {
  note(typeof langKey(key) === "string", `${key} exists`);
}
note(/\{needed\}/.test(lang.Ammo.Short) && /\{loaded\}/.test(lang.Ammo.Short),
  "and the short toast carries both numbers");

/* ------------------------------------------------------------------ C: NPC loot */

console.log("\nC) NPC loot — visible on the sheet, and draggable off it");

const npcLoot = read("scripts/npc-loot.mjs");

note(isLootableItem({ type: "treasure" }), "a treasure is lootable");
note(!isLootableItem({ type: "ability" }), "an ability is not");
note(isStampedLoot({ flags: { [MODULE_ID]: { loot: true } } }), "the loot flag is read");
note(!isStampedLoot({ flags: {} }), "and its absence is read too");

{
  const items = [
    { _id: "a", name: "Workhorse", type: "treasure", system: { quantity: 1 }, flags: { [MODULE_ID]: { loot: true } } },
    { _id: "b", name: "Chrome Arm", type: "treasure", system: { quantity: 1 }, flags: {} },
    { _id: "c", name: "Standard Rounds", type: "treasure", system: { quantity: 30 }, flags: { [MODULE_ID]: { loot: true } } },
    { _id: "d", name: "Autoshotgun Sweep", type: "ability" },
  ];
  const rows = lootRows(items);
  note(rows.length === 3, "abilities are filtered out; the three objects stay");
  note(rows.every(row => row.stamped) === false && rows[0].stamped && rows[2].stamped === false,
    "stamped loot sorts above hand-placed gear");
  note(rows[2].name === "Chrome Arm", "so Mama Cassavir's hand-embedded chrome is still listed, at the bottom");
  note(lootSummary(rows).pieces === 32, "the summary counts pieces, not just rows");
  note(lootSummary([]).empty === true, "and an empty body reads empty, not broken");
}

note(/toDragData\(\)/.test(code(npcLoot)), "C2: rows hand over the same payload the sheet would");
note(/addEventListener\("dragstart"/.test(code(npcLoot)),
  "and bind their own dragstart, because DSDocumentSheet bound its `.draggable` handlers before this hook ran");
note(/data-tab='features'/.test(npcLoot), "the panel goes on the Features tab");
note(/renderDrawSteelNPCSheet/.test(code(npcLoot)), "off the NPC sheet hook");
note(/actor\?\.type !== "npc"/.test(code(npcLoot)), "and heroes are refused by type");
note(/registerNpcLoot\(\)/.test(read("scripts/module.mjs")), "module.mjs registers it");
for (const key of ["Title", "Count", "None", "EmptyHint", "DragHint"]) {
  note(typeof lang.NpcLoot?.[key] === "string", `GHOSTWIRE.NpcLoot.${key} exists`);
}

// C — the loot really is on the bestiary, so the panel has something to show.
{
  let actors = 0;
  let items = 0;
  for (const folder of readdirSync("src/packs/bestiary")) {
    for (const file of readdirSync(join("src/packs/bestiary", folder))) {
      if (!file.endsWith(".json") || file.startsWith("_")) continue;
      const doc = readJson(join("src/packs/bestiary", folder, file));
      const loot = (doc.items ?? []).filter(item => isStampedLoot(item));
      if (loot.length) { actors += 1; items += loot.length; }
    }
  }
  note(actors === 51 && items === 161, `${actors} NPCs carry ${items} loot Items for the panel to show`);
}

/* ------------------------------------------------------------------ D: Mark */

console.log("\nD) Mark — five sources, and the edge goes to the side the text names");

const mark = read("scripts/mark.mjs");

note(MARK_DSIDS.length === 5, `five mark sources: ${MARK_DSIDS.join(", ")}`);
for (const dsid of ["you", "aid-attack", "quarry", "mark", "spotter-lock"]) {
  note(!!markSpecFor(dsid), `${dsid} is wired`);
}

// D2 — the scopes, which is the whole lock.
{
  const you = markSpecFor("you");
  note(markEdges({ spec: you, attackerIsSource: true }) === 1, "You!: the enforcer gets the edge");
  note(markEdges({ spec: you, attackerIsAlly: true }) === 1, "You!: and their allies do");
  note(markEdges({ spec: you }) === 0, "You!: and the other team does not");

  const spot = markSpecFor("aid-attack");
  note(markEdges({ spec: spot, attackerIsAlly: true }) === 1, "Spot Target: an ally gets the edge");
  note(markEdges({ spec: spot, attackerIsSource: true, attackerIsAlly: true }) === 0,
    "Spot Target: the spotter does not — they called it out *for* the crew");
  note(spot.consume === true, "and it is spent by the first roll that uses it");

  const cmd = markSpecFor("mark");
  note(markEdges({ spec: cmd, attackerIsSource: true }) === 1 && markEdges({ spec: cmd, attackerIsAlly: true }) === 1,
    "Commander Mark: the Commander and their allies");
  note(markEdges({ spec: cmd }) === 0, "Commander Mark: and nobody else — this is the bug that is fixed");

  const lock = markSpecFor("spotter-lock");
  note(markEdges({ spec: lock, attackerIsSource: true, abilityDsid: "rigged-fire" }) === 1,
    "Spotter Lock: Rigged Fire gets the edge");
  note(markEdges({ spec: lock, attackerIsSource: true, abilityDsid: "controlled-pair" }) === 0,
    "Spotter Lock: and nothing else does");

  const hard = markSpecFor("quarry");
  note(markEdges({ spec: hard, attackerIsSource: true }) === 0,
    "Hard Tag grants no edge — the printed text gives direction, distance and bonus damage");
  note([1, 2, 3, 4].every((want, i) => hardTagBonusDamage(i + 1) === want),
    "and the rider is +1/+2/+3/+4 by echelon");
  note(hardTagBonusDamage(9) === 4 && hardTagBonusDamage(0) === 1, "clamped at both ends");
  note(hardTagSpent({ latch: { round: 2, combat: "c1" }, round: 2, combat: "c1" }) === true,
    "once per round: the latch holds inside the round");
  note(hardTagSpent({ latch: { round: 2, combat: "c1" }, round: 3, combat: "c1" }) === false,
    "and releases on the next one");
}

// D — expiry.
note(markExpired({ placed: { round: 2, combat: "c1" }, round: 2, combat: "c1", markerIsActive: true }) === false,
  "a mark placed this turn survives this turn");
note(markExpired({ placed: { round: 2, combat: "c1" }, round: 3, combat: "c1", markerIsActive: true }) === true,
  "and comes off when the marker's turn comes round again");
note(markExpired({ placed: { round: 2, combat: "c1" }, round: 3, combat: "c1", markerIsActive: false }) === false,
  "not merely because the round advanced — somebody else's turn is not the marker's");
note(markExpired({ placed: { round: 2, combat: "c1" }, round: 1, combat: null }) === true,
  "and a mark from a finished encounter is gone");

// D3 — Apply really is wired, in the pack data and in the code.
{
  const enforcer = readJson("src/packs/bestiary/corp-security/corp-enforcer.json");
  const you = enforcer.items.find(item => item.system?._dsid === "you");
  const effect = you.effects.find(ae => ae._id === MARK_SOURCES.you.effectId);
  note(!!effect, "You! still carries the effect this file applies");
  note(effect.showIcon === 1, "with a visible icon");
  note(/crosshair/.test(effect.img), "and a crosshair for it");
  note(/\[\[\/apply AWkopDFw00pvxBSD\]\]/.test(you.system.effects.before0000000000.description),
    "D3: and its card finally carries an apply link, which it never had");

  const spot = readJson("src/packs/abilities/spot-target.json");
  note(spot.effects.some(ae => ae._id === MARK_SOURCES["aid-attack"].effectId && ae.showIcon === 1),
    "Spot Target has an effect at all now, with an icon");
  note(/\[\[\/apply GWSpotTarget0000\]\]/.test(lang.Abilities.SpotTarget.Description),
    "and its description applies it");

  const lock = readJson("src/packs/classes/wrench/origins/drone-jockey/spotter-lock.json");
  note(lock.effects.some(ae => ae._id === MARK_SOURCES["spotter-lock"].effectId),
    "Spotter Lock has one too");
  note(/\[\[\/apply WRSpotterLock000\]\]/.test(lang.Classes.Wrench.Items.SpotterLock.Effect_before0000000000),
    "and applies it");

  const quarry = readJson("src/packs/classes/scout/origins/hunter/quarry.json");
  note(quarry.effects.some(ae => ae._id === MARK_SOURCES.quarry.effectId && ae.showIcon === 1),
    "Hard Tag keeps its icon");

  // The headline pack fix: the blanket edge is gone.
  const cmd = readJson("src/packs/classes/commander/abilities/mark.json");
  const marked = cmd.effects.find(ae => ae._id === MARK_SOURCES.mark.effectId);
  note(!!marked && marked.showIcon === 1, "Commander Mark keeps its icon");
  note((marked.system.changes ?? []).every(change => change.key !== "system.combat.targetModifiers.edges"),
    "and no longer carries a blanket targetModifiers.edges — Draw Steel reads that for EVERY attacker");
}

note(/getTargetModifiers/.test(code(mark)), "the edge lands on AbilityModel#getTargetModifiers, the same seam Flanking uses");
note(/game\.socket\.emit\(SOCKET/.test(code(mark)), "a player marking an enemy relays through a GM");
note(!/socketlib/i.test(code(mark)), "on Foundry's own socket, not socketlib");
note(/actorsInPlay\(\)/.test(code(mark)), "and sweeps reach synthetic token actors, not just game.actors");
note(/registerMark\(\)/.test(read("scripts/module.mjs")), "module.mjs registers it");
for (const key of ["Kinds", "Notify", "Rider"]) {
  note(!!lang.Mark?.[key], `GHOSTWIRE.Mark.${key} exists`);
}

/* ------------------------------------------------------------------ E: Stamina */

console.log("\nE) Stamina — kits zero, class plus worn gear, and a shield that stacks");

// E1 — kits grant nothing.
{
  const kits = [];
  const walk = dir => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) { walk(path); continue; }
      if (!entry.name.endsWith(".json") || entry.name.startsWith("_")) continue;
      const doc = readJson(path);
      if (doc.type === "kit") kits.push({ dsid: doc.system?._dsid, stamina: doc.system?.bonuses?.stamina });
    }
  };
  walk("src/packs/kits");
  const offenders = kits.filter(kit => Number(kit.stamina) > 0).map(kit => kit.dsid);
  note(kits.length >= 28, `${kits.length} kits on disk`);
  note(offenders.length === 0, `not one grants Stamina${offenders.length ? ` (${offenders.join(", ")})` : ""}`);
  note(kits.find(kit => kit.dsid === "warframe")?.stamina === 0, "Warframe, which had the most at +12, is 0");
}

// E2 — a shield is its own group.
note(ARMOR_GROUPS.shield === "shield", "ARMOR_GROUPS puts a shield in its own group");
note(["light", "medium", "heavy", "sealed"].every(cls => ARMOR_GROUPS[cls] === "armor"),
  "and the four suits still share one");
note(WORN_GROUPS.join(",") === "armor,shield", "two worn slots");

// E — the arithmetic the lock is about.
{
  const armors = [
    { id: "hardshell", worn: true, group: "armor", bands: [{ id: "a1", echelon: 1, kit: "none", value: 9 }, { id: "a2", echelon: 2, kit: "none", value: 16 }] },
    { id: "riot", worn: true, group: "shield", bands: [{ id: "s1", echelon: 1, kit: "none", value: 3 }, { id: "s2", echelon: 2, kit: "none", value: 5 }] },
    { id: "vest", worn: false, group: "armor", bands: [{ id: "v1", echelon: 1, kit: "none", value: 6 }] },
  ];
  const plan = armorStaminaPlan({ armors, echelon: 1 });
  note(plan.wornByGroup.armor === "hardshell" && plan.wornByGroup.shield === "riot",
    "both slots are held at once");
  note(plan.enable.length === 2, "so two bands are enabled, not one");
  note(plannedStaminaFromGear({ armors, echelon: 1 }) === 12, "Hardshell 9 + Riot Shield 3 = 12");
  note(plannedStaminaFromGear({ armors, echelon: 2 }) === 21, "and at Echelon 2, 16 + 5 = 21");
  note(21 + plannedStaminaFromGear({ armors, echelon: 1 }) === 33,
    "so an Operator L1 in a Warframe kit reads 33 — not 42 from the old kit+armor double-count");

  const twoArmor = [
    { id: "a", worn: true, group: "armor", bands: [{ id: "a1", echelon: 1, kit: "none", value: 9 }] },
    { id: "b", worn: true, group: "armor", bands: [{ id: "b1", echelon: 1, kit: "none", value: 6 }] },
  ];
  note(plannedStaminaFromGear({ armors: twoArmor, echelon: 1 }) === 9,
    "one armor at a time still holds — two worn suits never sum");
  note(plannedStaminaFromGear({ armors: [armors[2]], echelon: 1 }) === 0, "and nothing worn is nothing gained");
}

// E — the AE mode, which is what makes the two add rather than take the max.
{
  const KEY = "system.stamina.bonuses.treasure";
  const rows = [];
  const walk = dir => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) { walk(path); continue; }
      if (!entry.name.endsWith(".json") || entry.name.startsWith("_")) continue;
      const doc = readJson(path);
      for (const ae of doc.effects ?? []) {
        for (const change of ae.system?.changes ?? []) {
          if (change.key === KEY) rows.push({ path, name: ae.name, type: change.type });
        }
      }
    }
  };
  walk("src/packs/gear/armor");
  note(rows.length === 88, `${rows.length} armor and shield band changes on disk`);
  const notAdd = rows.filter(row => row.type !== "add");
  note(notAdd.length === 0,
    `every one is \`add\`${notAdd.length ? ` (${notAdd.length} still upgrade)` : ""} — two \`upgrade\` changes on one key take the max, not the sum`);
}

// E3 — the UI says Raise / Lower for a shield.
note(lang.Stamina.Menu.RaiseShield === "Raise Shield", "the shield menu says Raise Shield");
note(lang.Stamina.Menu.LowerShield === "Lower Shield", "and Lower Shield");
note(lang.Stamina.Menu.Wear === "Wear this armor", "armor still says Wear this armor");
note(typeof lang.Stamina.Notify.Raised === "string" && typeof lang.Stamina.Notify.Lowered === "string",
  "and the toasts match");
note(lang.Stamina.Kinds.shield === "Raised shield", "the tooltip names a raised shield as one");

{
  const stamina = code(read("scripts/stamina.mjs"));
  note(/if \(armorGroupOf\(other\) !== group\) continue;/.test(stamina),
    "setArmorWorn only ever competes within a group, which is what makes the two stack");
  note(/isShieldItem\(item\) !== shield/.test(stamina), "and the context menu splits armor from shield");
}

// E — the RAW no longer claims kit Stamina is armor Stamina.
{
  const claims = [
    ["docs/rulebook/10-kits.md", read("docs/rulebook/10-kits.md")],
    ["docs/raw/08-kits-gear-wealth.md", read("docs/raw/08-kits-gear-wealth.md")],
    ["the rulebook journal", JSON.stringify(readJson("src/packs/rulebook/hero-building/08-kits-gear-wealth.json"))],
    ["lang/en.json", JSON.stringify(readJson("lang/en.json"))],
  ];
  for (const [label, text] of claims) {
    note(/Kits grant no Stamina/i.test(text), `${label} says kits grant no Stamina`);
    note(!/the Kit's Stamina bonus \*\*is\*\* that armor's Stamina — you do not also add/.test(text),
      `${label} no longer prints the old reconciliation as the rule`);
    note(!/Stamina \+\d+ (per echelon )?·/.test(text), `${label} prints no kit Stamina in a doctrine list`);
  }
  note(/shield<\/strong> stacks|shield stacks|A \*\*shield stacks\*\*/i.test(read("docs/raw/08-kits-gear-wealth.md")),
    "and the RAW armor table still says a shield stacks");
  note(!/Kit Stamina is the armour/.test(JSON.stringify(readJson("lang/en.json"))),
    "the chargen NoDoubleCount copy is replaced");
}

/* ------------------------------------------------------------------ F: version */

console.log("\nF) Version");

note(atLeast("0.3.128"), `module.json is ${readJson("module.json").version}`);
note(/`0\.3\.128`/.test(read("README.md")), "README has a 0.3.128 entry");
note(existsSync("docs/directors/03128-smoke.md"), "the Foundry checklist is written");

/* ------------------------------------------------------------------ */

if (fail.length) {
  console.log(`\n0.3.128 smoke FAIL — ${fail.length}`);
  for (const msg of fail) console.log(`  - ${msg}`);
  process.exitCode = 1;
} else {
  console.log("\n0.3.128 smoke PASS.");
}
