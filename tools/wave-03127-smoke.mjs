#!/usr/bin/env node
/**
 * 0.3.127 wave smoke — the five locks of the grenade / wire / pregen / hit-FX / loot build.
 *
 *   A  Throw is a 15 ft circle the player places within 60 ft *before* the power roll, the save
 *      table is Low / Mid / High (full / half-rounded-down / nothing), riders are Low-only, the
 *      circle is a Region that is always deleted, and the damage apply path is awaited.
 *   B  The Wire State cycle is Disconnected -> Linked -> Overlay -> Disconnected. Jumped In is off
 *      the cycle and still on the picker.
 *   C  Every pregen carries the seven kept Draw Steel defaults and the five Ghostwire swaps, and
 *      neither Free Strike nor any Matrix Verb.
 *   D  Gun / melee / grenade hit FX ship inside the module: module-owned sounds, a built-in PIXI
 *      flash, Sequencer and JB2A optional, Automated Animations never mentioned.
 *   E  Bestiary NPCs carry role-appropriate loot, every role justifies itself, the stamp is
 *      idempotent, and the folders that should be empty are empty.
 *
 * Run: node tools/wave-03127-smoke.mjs
 * Does not need live Foundry.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import {
  BLAST_FEET, REFLEX_CHARACTERISTIC, SAVE_OUTCOMES, THROWER_HIGH_TIER, THROW_RANGE_FEET,
  blastDamageTiers, halveDamage, impactFor, isThrownBlast, pixelsPerFoot, planBlastImpact,
  saveOutcome, throwReach, thrownSpec,
} from "../scripts/grenades.mjs";
import { WIRE_CYCLE_ORDER, WIRE_TOGGLE_OPTIONS, nextWireCycleState } from "../scripts/wire-state-toggle.mjs";
import { HIT_FX_KINDS, HIT_FX_PROFILES, classifyHit } from "../scripts/hit-fx.mjs";
import { atLeast } from "./lib/module-version.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const fail = [];
const note = (pass, msg) => { if (pass) console.log(`  ✓ ${msg}`); else { fail.push(msg); console.log(`  ✗ ${msg}`); } };

const read = p => readFileSync(p, "utf8").replace(/\r\n/g, "\n");
const readJson = p => JSON.parse(read(p));
const lang = readJson("lang/en.json").GHOSTWIRE;
const gearFlags = item => item.flags?.[MODULE_ID]?.gear ?? {};

console.log("0.3.127 wave smoke\n");

/* ------------------------------------------------------------------ A: the Throw rewrite */

console.log("A) Throw — 15 ft, placed before the roll, Low / Mid / High");

const grenades = read("scripts/grenades.mjs");
/** Source with every comment line dropped — a header that *names* the old call is not the old call. */
const code = text => text.split("\n").filter(line => !/^\s*(\/\/|\*|\/\*)/.test(line)).join("\n");

// A1 — the radius, and the stamps that must follow it rather than print their own.
note(BLAST_FEET === 15, `BLAST_FEET is ${BLAST_FEET} ft`);
note(THROW_RANGE_FEET === 60, `and the reach is ${THROW_RANGE_FEET} ft`);

const THROWN_DIR = "src/packs/gear/weapons/thrown";
const thrown = Object.fromEntries(readdirSync(THROWN_DIR)
  .filter(f => f.endsWith(".json") && f !== "_folder.json")
  .map(f => [f.replace(/\.json$/, ""), readJson(join(THROWN_DIR, f))]));
const BLAST_LINE = ["frag", "flash-bang-3e", "smart-grenade", "gasser", "firestarter", "emp-grenade", "smoke-grenade"];

for (const key of BLAST_LINE) {
  note(thrownSpec(thrown[key])?.feet === BLAST_FEET, `${key} lands as a ${BLAST_FEET} ft circle`);
  note(gearFlags(thrown[key]).thrown?.feet === undefined,
    `and its stamp carries no hardcoded feet, so it follows the constant`);
}
for (const key of ["FlashBang3e", "EmpGrenade", "SmokeGrenade"]) {
  const copy = lang.Gear.Items[key].Description;
  note(/15 ft circle/.test(copy), `${key}'s catalog copy says 15 ft`);
  note(!/20 ft/.test(copy), `and no longer says 20`);
  note(/within <strong>60 ft<\/strong>/.test(copy), `and names the 60 ft reach`);
}
note(!/\b20 ft circle\b/.test(JSON.stringify(lang.Throw)), "no 20 ft circle survives anywhere in the Throw strings");

// A2 — place BEFORE the roll. The order is the lock, so it is asserted on the source.
{
  const place = grenades.indexOf("const blast = await placeBlast(actor, grenade, spec.feet);");
  const roll = grenades.indexOf("const message = await use.call(this, config, dialogOptions, messageOptions);");
  note(place > 0 && roll > place, "patchThrowUse places the circle before it calls Draw Steel's use()");
  note(/if \(!blast\) return null;/.test(grenades), "and a cancelled placement returns before any dice are rolled");
  note(!/game\.user\?\.targets/.test(grenades) && !/target\.center/.test(grenades),
    "nothing auto-centres on a targeted token any more");
  note(/pickBlastPoint/.test(grenades) && /stage\.on\("pointerdown"/.test(grenades),
    "placement is a click on the canvas, driven by the player");
}

// A2 — the 60 ft refusal.
{
  const dims = { size: 100, distance: 1, units: "" };         // Draw Steel's default 1-unit squares
  const perFoot = pixelsPerFoot(dims);
  note(perFoot === 20, `a 5 ft square of 100 px is ${perFoot} px per foot`);
  note(pixelsPerFoot({ size: 100, distance: 5, units: "ft" }) === 20, "and a foot-scaled map agrees");
  note(BLAST_FEET * perFoot === 300, "so the 15 ft blast is three squares across the radius");

  const at = feet => throwReach({ from: { x: 0, y: 0 }, to: { x: feet * perFoot, y: 0 }, perFoot });
  note(at(10).ok && at(59).ok && at(60).ok, "10 / 59 / 60 ft are all in reach");
  note(!at(61).ok && at(61).feet === 61, "61 ft is refused, and the refusal knows the distance");
  note(at(61).max === THROW_RANGE_FEET, "and the maximum it quotes is the constant");
  note(throwReach({ from: null, to: { x: 9999, y: 0 }, perFoot }).ok,
    "with no thrower token on the canvas there is nothing to measure, so nothing is refused");
  note(typeof lang.Throw.OutOfRange === "string" && /\{feet\}/.test(lang.Throw.OutOfRange) && /\{range\}/.test(lang.Throw.OutOfRange),
    "the refusal has a lang string carrying both numbers");
  note(/Right-click or Esc/.test(lang.Throw.ClickToPlace), "and the placement prompt says how to call it off");
}

// A3 — the save table.
note(SAVE_OUTCOMES.join(",") === "low,mid,high", "the table's three rows, in tier order");
note(saveOutcome({ tier: 1 }) === "low", "tier 1 is Low");
note(saveOutcome({ tier: 2 }) === "mid", "tier 2 is Mid");
note(saveOutcome({ tier: 3 }) === "high", "tier 3 is High");
note(REFLEX_CHARACTERISTIC === "agility", "Ghostwire's Reflex is Draw Steel's agility key");
note(!/natural/i.test(grenades.slice(grenades.indexOf("export function saveOutcome"), grenades.indexOf("export function planBlastImpact")))
  || !/SAVE_CRIT_THRESHOLD/.test(grenades),
  "and the natural-19 crit branch is gone from the save — the ladder already reads it as tier 3");

{
  const frag = { damage: 6, damageType: "kinetic" };
  const low = planBlastImpact({ outcome: "low", throwerTier: 2 });
  const mid = planBlastImpact({ outcome: "mid", throwerTier: 2 });
  const high = planBlastImpact({ outcome: "high", throwerTier: 2 });
  note(blastDamageTiers(6).join("/") === "4/6/8", "a printed 6 still reads 4 / 6 / 8, the B49 ranged spread");
  note(impactFor(frag, low).damage === 6, "Low takes the thrower's tier in full");
  note(impactFor(frag, mid).damage === 3, "Mid takes half of it");
  note(impactFor(frag, high).damage === 0, "High takes nothing");
  note(high.applies === false && high.impactTier === 0, "and High does not even resolve an impact tier");

  const low3 = planBlastImpact({ outcome: "low", throwerTier: 3 });
  const mid3 = planBlastImpact({ outcome: "mid", throwerTier: 3 });
  note(impactFor(frag, low3).damage === 8 && impactFor(frag, mid3).damage === 4,
    "a tier-3 throw is 8 against Low and 4 against Mid");
  note(halveDamage(7) === 3 && halveDamage(1) === 0, "halving rounds DOWN — 7 -> 3, and a 1 halves to nothing");
  note(impactFor({ damage: 3 }, planBlastImpact({ outcome: "mid", throwerTier: 1 })).damage === 0,
    "so a Knuckle-grade 1 at Mid really is 0, which the card has a line for");
  note(typeof lang.Throw.Row.HalvedToNothing === "string", "and that line exists");
}

// A4 — riders are Low only.
{
  const flash = thrownSpec(thrown["flash-bang-3e"]).impact;
  const emp = thrownSpec(thrown["emp-grenade"]).impact;
  const rows = ["low", "mid", "high"].map(outcome => [outcome, planBlastImpact({ outcome, throwerTier: 3 })]);
  for (const [outcome, plan] of rows) {
    const dazed = impactFor(flash, plan).conditions.join();
    const suppress = impactFor(emp, plan).chromeSuppress;
    if (outcome === "low") {
      note(dazed === "dazed", "Low is Dazed by a Flash-Bang");
      note(suppress === 2, "and a HIGH throw's EMP suppresses chrome for 2 rounds");
    } else {
      note(dazed === "", `${outcome} is NOT Dazed, however well the thrower rolled`);
      note(suppress === 0, `and ${outcome} keeps its chrome lit`);
    }
  }
  note(impactFor(emp, planBlastImpact({ outcome: "low", throwerTier: 2 })).chromeSuppress === 1,
    "a Low save against a tier-2 throw is 1 round, not 2");
  note(THROWER_HIGH_TIER === 3, "the long duration is gated on the thrower reading tier 3");
  note(impactFor(emp, planBlastImpact({ outcome: "low", throwerTier: 3 })).damage === 0,
    "and an EMP never damages a body");
}

// A5 — the card says which rung and why.
for (const key of ["low", "mid", "high"]) note(typeof lang.Throw.Outcomes[key] === "string", `Outcomes.${key} has a label`);
note(lang.Throw.Outcomes.low === "Low" && lang.Throw.Outcomes.mid === "Mid" && lang.Throw.Outcomes.high === "High",
  "printed as Low / Mid / High");
note(!("critical" in lang.Throw.Outcomes) && !("fail" in lang.Throw.Outcomes),
  "and the old fail / success / critical labels are gone");
note(/\{outcome\}/.test(lang.Throw.Row.Line) && /\{total\}/.test(lang.Throw.Row.Line),
  "every row prints the save total and the rung");
note(/half, rounded down/.test(lang.Throw.Row.Half), "and a halved number says so, so 4 does not read as a bad roll");

// A6 — the circle always goes.
note(/} finally {\n      await blast\.delete\(\);/.test(grenades),
  "the delete is in a finally, so an abort after the place still clears the canvas");
note(/createEmbeddedDocuments\("Region"/.test(grenades),
  "the circle is a Region — Foundry 14 merged MeasuredTemplate into Region");
note(!/createEmbeddedDocuments\("MeasuredTemplate"/.test(code(grenades)),
  "and the v13 MeasuredTemplate call, which had nothing to create into on 14.367, is gone");

// A7 — the Stamina path.
note(/await target\.system\.takeDamage\(impact\.damage/.test(grenades), "takeDamage is awaited");
note(/if \(impact\.damage > 0\) \{/.test(grenades), "it is reached whenever the row deals anything at all");
note(/no system\.takeDamage/.test(grenades), "and a target that cannot take damage says so rather than failing quietly");

// A8 — what did not change.
note(!isThrownBlast(thrown["thermite-charge"]) && !isThrownBlast(thrown["shaped-charge"]),
  "Thermite and Shaped Charge stay Adjacent demolition");
note(thrownSpec(thrown["smoke-grenade"]).save === false, "Smoke still places its circle with no save");
note(thrownSpec(thrown["smoke-grenade"]).feet === BLAST_FEET, "at the same 15 ft");
note(/Conceal outlives the\n    \/\/ circle/.test(grenades), "and the Conceal outlives the circle on purpose");

/* ------------------------------------------------------------------ B: the wire cycle */

console.log("\nB) Wire State cycle — three rungs, and the seat is not one of them");

note(WIRE_CYCLE_ORDER.join(",") === "disconnected,linked,overlay",
  `the cycle is ${WIRE_CYCLE_ORDER.join(" -> ")} -> ${WIRE_CYCLE_ORDER[0]}`);
note(!WIRE_CYCLE_ORDER.includes("jumpedIn"), "Jumped In is not a rung");
note(WIRE_TOGGLE_OPTIONS.includes("jumpedIn"), "but the picker dialog still offers it");
note(nextWireCycleState("overlay") === "disconnected", "Overlay steps off, not deeper");
note(nextWireCycleState("jumpedIn") === "disconnected", "a pilot in a seat cycles all the way out");
note(nextWireCycleState("jackedIn") === "disconnected", "and a seatless Jacked In deck jockey wraps rather than being seated");
{
  const walk = [];
  let at = "disconnected";
  for (let i = 0; i < 12; i += 1) { at = nextWireCycleState(at); walk.push(at); }
  note(!walk.includes("jumpedIn"), "twelve presses never land on the seat");
}
note(/Disconnected → Linked → Overlay → Disconnected/.test(lang.WireToggle.Cycle.Hint), "the macro hint spells the ladder out");
note(/not on the cycle/i.test(lang.WireToggle.Cycle.Hint), "and says Jumped In is not on it");
{
  const macro = readJson("src/packs/macros/cycle-wire-state.json");
  note(macro._id === "gwCycleWireState" && /cycleWireStateForSelection/.test(macro.command),
    "the macro still calls the API helper rather than owning a ladder of its own");
}
note(/export async function jumpIn/.test(read("scripts/rigger-vertical.mjs")), "jumpIn() is untouched and still exported");

/* ------------------------------------------------------------------ C: pregen defaults */

console.log("\nC) Pregens carry the default abilities they never had");

const KEPT = ["catch-breath", "escape-grab", "grab", "knockback", "stand-up", "advance", "disengage"];
const SWAPS = { "aid-attack": "Xc5MebcXHYG1hdQR", charge: "Od6u2idYoCRmoDYD", defend: "1W0HIoL2SAcbTU6W", heal: "pJY4ybZUtkH9HDxy", drive: "Lc7LhoqWg9ydP5Jm" };
const FORBIDDEN = ["melee-free-strike", "ranged-free-strike"];

const defaults = readJson("docs/masters/pregens/default-items.json");
note(defaults.items.length === KEPT.length, `the committed snapshot holds the ${KEPT.length} kept stock defaults`);
note(defaults.items.map(i => i.system._dsid).join(",") === KEPT.join(","), "in the locked order");
note(defaults.items.every(i => !i._key && !i._stats && i.folder === null),
  "with the system's compendium furniture stripped");
note(existsSync("tools/ds-default-items.mjs"), "and a tool that refreshes it after a Draw Steel upgrade");

const matrixVerbs = readdirSync("src/packs/abilities/matrix-verbs")
  .filter(f => f.endsWith(".json") && f !== "_folder.json")
  .map(f => readJson(join("src/packs/abilities/matrix-verbs", f)).system._dsid);
note(matrixVerbs.length === 9, `${matrixVerbs.length} Matrix Verbs exist to stay off a sheet`);

const pregens = readdirSync("src/packs/pregens").filter(f => f.endsWith(".json"));
note(pregens.length === 9, `${pregens.length} pregen Heroes`);
for (const file of pregens) {
  const actor = readJson(join("src/packs/pregens", file));
  const held = new Set(actor.items.map(i => i.system?._dsid));
  const ids = new Set(actor.items.map(i => i._id));
  const slug = file.replace(/\.json$/, "");
  const missing = KEPT.filter(d => !held.has(d));
  note(!missing.length, `${slug}: all seven stock defaults${missing.length ? ` — missing ${missing.join(", ")}` : ""}`);
  const noSwap = Object.entries(SWAPS).filter(([dsid, id]) => !held.has(dsid) || !ids.has(id));
  note(!noSwap.length, `${slug}: all five Ghostwire swaps${noSwap.length ? ` — missing ${noSwap.map(s => s[0]).join(", ")}` : ""}`);
  const strikes = FORBIDDEN.filter(d => held.has(d));
  note(!strikes.length, `${slug}: no generic Free Strike${strikes.length ? ` — ${strikes.join(", ")}` : ""}`);
  const verbs = matrixVerbs.filter(d => held.has(d));
  note(!verbs.length, `${slug}: no Matrix Verbs${verbs.length ? ` — ${verbs.join(", ")}` : ""}`);
  note(ids.size === actor.items.length, `${slug}: every embedded item id is unique`);
}
{
  // The sample the brief names, by its printed name rather than its dsid.
  const vira = readJson("src/packs/pregens/vira-kellis-nade.json");
  const named = new Set(vira.items.map(i => i.name));
  note(named.has("Catch Breath"), "Vira can Catch Breath by name");
  note([...named].some(n => /Drive/.test(n) || /GHOSTWIRE\.Abilities\.Drive/.test(n)), "and Drive is on her sheet");
}
note(/DEFAULT_ITEM_SWAPS drift/.test(read("tools/pregens-to-actors.mjs")),
  "and the generator asserts the swap ids against scripts/module.mjs rather than assuming them");
for (const id of Object.values(SWAPS)) {
  note(read("scripts/module.mjs").includes(id), `module.mjs still swaps to ${id}`);
}

/* ------------------------------------------------------------------ D: hit FX */

console.log("\nD) Hit FX — in the module, and nothing else is required");

const hitFx = read("scripts/hit-fx.mjs");
note(HIT_FX_KINDS.join(",") === "gun,melee,grenade", "the first slice is gun / melee / grenade");
note(classifyHit({ thrownBlast: true, range: "Short" }) === "grenade", "a thrown Blast grenade is a grenade, band notwithstanding");
note(classifyHit({ range: "Adjacent" }) === "melee", "an Adjacent-band weapon is melee");
note(classifyHit({ range: "Medium", ammoFamily: "handgun" }) === "gun", "a weapon that eats rounds is a gun");
note(classifyHit({ range: "Long" }) === null, "a bow is out of scope and says so");
note(classifyHit({}) === null, "and so is everything else");

for (const kind of HIT_FX_KINDS) {
  const profile = HIT_FX_PROFILES[kind];
  const path = profile.sound.replace(`modules/${MODULE_ID}/`, "");
  note(existsSync(path), `${kind}: its sound ships in the module (${path.split("/").pop()})`);
  note(profile.sequencerFiles.length > 0 && typeof profile.style === "string",
    `${kind}: a Sequencer path to try and a built-in style to fall back to`);
}
note(!/autoanimations/i.test(code(hitFx)), "no code path asks for Automated Animations (the header names it only to say it is not required)");
note(!readJson("module.json").relationships?.requires?.some?.(r => ["sequencer", "autoanimations", "JB2A_DnD5e"].includes(r.id)),
  "and module.json requires none of them");
note(/game\.modules\.get\("sequencer"\)\?\.active/.test(hitFx), "Sequencer is probed, never assumed");
note(/drawBurst\(/.test(hitFx) && /canvas\.app\?\.ticker/.test(hitFx),
  "and the fallback is a real built-in flash, not a silent no-op");
note(/abilityResult/.test(hitFx), "it fires on the ability result — where it lands");
note(/abilityUse/.test(read("scripts/sfx.mjs")), "leaving B40 on the ability use — where it fires");
note(/registerHitFx\(\);/.test(read("scripts/module.mjs")), "module.mjs registers it");
note(/playHitFx\("grenade"/.test(grenades), "and the grenade resolve calls it directly");
for (const key of ["Enabled", "Volume", "Sequencer"]) {
  note(typeof lang.HitFx.Settings[key]?.Name === "string" && typeof lang.HitFx.Settings[key]?.Hint === "string",
    `the ${key} setting has a name and a hint`);
}

/* ------------------------------------------------------------------ E: bestiary loot */

console.log("\nE) Bestiary loot — role-appropriate, and empty where it should be");

const table = readJson("docs/masters/bestiary/loot.json");
const bestiary = new Map();
for (const folder of readdirSync("src/packs/bestiary")) {
  for (const file of readdirSync(join("src/packs/bestiary", folder))) {
    if (!file.endsWith(".json") || file === "_folder.json") continue;
    bestiary.set(`${folder}/${file.replace(/\.json$/, "")}`, readJson(join("src/packs/bestiary", folder, file)));
  }
}
const lootOf = actor => (actor.items ?? []).filter(i => i.flags?.[MODULE_ID]?.loot === true);

note(Object.keys(table.actors).length === 51, `${Object.keys(table.actors).length} actors are assigned a role`);
note(Object.values(table.roles).every(r => typeof r.why === "string" && r.why.length > 20),
  "every role writes down why it carries what it carries");
note(Object.keys(table.actors).every(k => bestiary.has(k)), "every assigned actor exists on disk");
note(Object.values(table.actors).every(r => !!table.roles[r]), "and every assignment names a defined role");

{
  const stamped = [...bestiary].filter(([, a]) => lootOf(a).length);
  const items = stamped.reduce((n, [, a]) => n + lootOf(a).length, 0);
  note(stamped.length === 51, `${stamped.length} actors carry loot on disk`);
  note(items === 161, `${items} embedded loot items`);
  note(stamped.every(([, a]) => lootOf(a).every(i => i.type === "treasure" && Number(i.system?.quantity) > 0)),
    "all of it is treasure with a real quantity, so drag-to-loot and liquidate both work");
  note(stamped.every(([, a]) => new Set(a.items.map(i => i._id)).size === a.items.length),
    "and no loot id collides with anything already on the sheet");
}

// The empty folders are the other half of the lock.
for (const folder of ["reach-critters", "wilds-jungles"]) {
  const rows = [...bestiary].filter(([k]) => k.startsWith(`${folder}/`));
  note(rows.every(([, a]) => !lootOf(a).length), `${folder}: beasts have no pockets (${rows.length} actors, nothing on any of them)`);
}
{
  const ice = ["wire-machine/black-ice", "wire-machine/scrambler-ice", "wire-machine/watchdog-ice",
    "wire-machine/signal-mindkiller-whelp", "wire-machine/signal-talker-invader"];
  note(ice.every(k => !lootOf(bestiary.get(k)).length), "ICE and the Signal entities have no body to loot");
  note(["wire-machine/chrome-raider-armiger", "wire-machine/chrome-raider-hijack"].every(k => lootOf(bestiary.get(k)).length),
    "but the two chromed Raider bodies are salvage");
}
{
  const risen = ["veil-undead/skeleton", "veil-undead/zombie", "veil-undead/ghoul", "veil-undead/ghost"];
  note(risen.every(k => !lootOf(bestiary.get(k)).length), "the risen rose without their kit");
  note(lootOf(bestiary.get("veil-undead/veil-cultist")).length > 0, "the Veil Cultist, being alive, is looted");
}
{
  const club = [...bestiary].filter(([k]) => k.startsWith("mama-club/"));
  const carrying = club.filter(([, a]) => lootOf(a).length);
  note(carrying.length === 5, `${carrying.length} of ${club.length} of the club cast carry anything — the rest are a scene, not an encounter`);
}

// Role fit: the ammo actually matches the role, which is the thing the lock names.
const dsidsOn = key => new Set(lootOf(bestiary.get(key)).map(i => i.system._dsid));
note(dsidsOn("aequitas/aeq-trooper").has("gel-stick-n-shock"), "Mandate patrol carries the non-lethal load");
note(dsidsOn("lazarus/laz-medic").has("gel-stick-n-shock") && dsidsOn("lazarus/laz-medic").has("trauma-patch"),
  "Lazarus medics carry gel and medical consumables");
note(dsidsOn("corp-security/ironclad-sharpshooter").has("ap-rounds"), "an Ironclad marksman carries AP");
note(dsidsOn("reach-streets/gang-raider").has("standard-rounds"), "a ganger carries loose standard shells");
note(lootOf(bestiary.get("reach-streets/gang-raider")).find(i => i.system._dsid === "standard-rounds").system.quantity < 30,
  "and not a full box — a sawed-off in the colours is not a quartermaster");
note(!dsidsOn("magical-societies/daska-venn").has("standard-rounds")
  && ![...dsidsOn("magical-societies/daska-venn")].some(d => /rounds|pistol|rifle|shotgun/.test(d)),
  "the magical societies get lodge gear, not street guns as filler");
note(!dsidsOn("rivals/rival-elementalist-echelon1").has("standard-rounds"), "and neither does a Rival Elementalist");
note(dsidsOn("corp-security/corp-netrunner").has("corp-blacklink") && !dsidsOn("corp-security/corp-netrunner").has("standard-rounds"),
  "a corp decker carries access, not a rifle nobody gave them");

// Mama Cassavir's hand-embedded chrome has to survive a restamp.
{
  const mama = bestiary.get("reach-streets/mama-cassavir");
  const chrome = mama.items.filter(i => i.flags?.[MODULE_ID]?.chrome);
  note(chrome.length === 7, `Mama Cassavir keeps her ${chrome.length} hand-embedded implants`);
  note(chrome.every(i => !i.flags[MODULE_ID].loot), "which are not loot-flagged, so a restamp never eats them");
}

// Idempotence: re-running the stamp must change nothing.
{
  const before = new Map([...bestiary.keys()].map(key => {
    const [folder, slug] = key.split("/");
    const path = join("src/packs/bestiary", folder, `${slug}.json`);
    return [path, read(path)];
  }));
  execFileSync(process.execPath, ["tools/bestiary-loot.mjs"], { stdio: "pipe" });
  const changed = [...before].filter(([path, text]) => read(path) !== text).map(([path]) => path);
  note(!changed.length, `re-running tools/bestiary-loot.mjs is a no-op${changed.length ? ` — ${changed.join(", ")}` : ""}`);
}

/* ------------------------------------------------------------------ version */

console.log("\nF) Version");

const version = readJson("module.json").version;
note(atLeast(version, "0.3.127"), `module.json is ${version}`);
note(read("README.md").includes("`0.3.127`"), "README has a 0.3.127 entry");
note(existsSync("docs/directors/03127-smoke.md"), "the Foundry checklist is written");

/* ------------------------------------------------------------------ */

console.log(fail.length ? `\n0.3.127 smoke FAIL — ${fail.length}\n${fail.map(f => `  - ${f}`).join("\n")}`
  : "\n0.3.127 smoke PASS.");
process.exit(fail.length ? 1 : 0);
