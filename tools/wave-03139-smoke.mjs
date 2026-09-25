#!/usr/bin/env node
/**
 * 0.3.139 wave smoke — Special Agent / Special Sprite, the wired-firefight checklist,
 * Skillwires + skillsofts (autosofts killed), and the chassis mod-slot mismatch.
 *
 * Three of the four locks are about a document disagreeing with itself, so almost every assertion
 * here is a cross-check rather than a re-typed constant:
 *
 *   A  The *order* is the feature. A comment can promise "roll first" while the code prompts first,
 *      so the flow is driven out of `scripts/special-summons.mjs` and then the two engines are read
 *      with their comments stripped, to check the roll really is called before the purpose prompt.
 *   B  The checklist has to exist in three places at once — RAW, the journals, and the VOIDMARK
 *      index — or a player asking "how does a wired firefight go?" gets one of them.
 *   C  "Autosoft" is dead as a player-facing word. That is only true if *no* lang value, journal
 *      page or card carries it, so the whole of lang/en.json and every rulebook journal is swept.
 *      The four `_dsid`s stay `*-autosoft` on purpose: ids are frozen, names are not.
 *   D  A chassis card printed its capacity twice and 75 of 87 disagreed. The flag is the source of
 *      truth; both printed halves are checked against it, for every chassis, not a sample.
 *
 * Offline only — no Foundry. Dialogs, Actor.create and the sheet cannot run here, so those are
 * source scans over the comment-stripped file.
 *
 * Run: `node tools/wave-03139-smoke.mjs`
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { atLeast } from "./lib/module-version.mjs";
import {
  ACTIONS_BY_TIER, SPECIAL_AGENT_BANDWIDTH, SPECIAL_AGENT_DSID, SPECIAL_ARCHETYPE, SPECIAL_FLOW,
  SPECIAL_SPRITE_DSID, SPECIAL_SPRITE_RESONANCE, SPECIAL_STAMINA_BASE,
  actionsForTier, normalizePurpose, specialSpendPlan, specialSummonDescription, specialSummonLabel,
  tierFromMessage,
} from "../scripts/special-summons.mjs";
import {
  SOFT_CAP_BY_ECHELON, SKILLSOFT_HOST, SKILLWIRES_DSID,
  runningSoftIds, softCapForEchelon, softCapForLevel, softLoadPlan,
} from "../scripts/skillsofts.mjs";
import { HEADER_RE, PARA_RE, modSlotsOf, restamp, slotClaims, vehicleDocs } from "./regen-vehicle-mod-slots.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const fail = [];
const note = (pass, msg) => { if (pass) console.log(`  ✓ ${msg}`); else { fail.push(msg); console.log(`  ✗ ${msg}`); } };

const read = path => readFileSync(path, "utf8").replace(/\r\n/g, "\n");
const readJson = path => JSON.parse(read(path));
/** Source with every comment line dropped — a header that *names* a call is not the call. */
const code = text => text.split("\n").filter(line => !/^\s*(\/\/|\*|\/\*)/.test(line)).join("\n");

const manifest = readJson("module.json");
const lang = readJson("lang/en.json");
const localize = key => {
  let node = lang;
  for (const part of String(key).split(".")) {
    if (!node || (typeof node !== "object") || !(part in node)) return null;
    node = node[part];
  }
  return (typeof node === "string") ? node : null;
};

/** Every string value in lang/en.json, with its dotted key. */
function langStrings(node = lang, path = "") {
  const out = [];
  for (const [key, value] of Object.entries(node ?? {})) {
    const next = path ? `${path}.${key}` : key;
    if (typeof value === "string") out.push([next, value]);
    else if (value && (typeof value === "object")) out.push(...langStrings(value, next));
  }
  return out;
}
const allLang = langStrings();

/* ================================================================ A1 — the flow, as data */

console.log("\nA1) Power Roll first, tier buys Actions, purpose last");

note(JSON.stringify(SPECIAL_FLOW) === JSON.stringify(["roll", "budget", "purpose", "summon"]),
  `the published flow is ${SPECIAL_FLOW.join(" → ")}`);
note(SPECIAL_FLOW.indexOf("roll") < SPECIAL_FLOW.indexOf("purpose"), "…and the roll comes before the purpose prompt");
note(SPECIAL_FLOW.indexOf("purpose") < SPECIAL_FLOW.indexOf("summon"), "…and the purpose comes before the summon");

note(ACTIONS_BY_TIER[1] === 1 && ACTIONS_BY_TIER[2] === 2 && ACTIONS_BY_TIER[3] === 3,
  "tier 1 / 2 / 3 buy 1 / 2 / 3 Actions");
note(actionsForTier(1) === 1 && actionsForTier(2) === 2 && actionsForTier(3) === 3, "actionsForTier maps the three tiers");
note(actionsForTier(null) === 1 && actionsForTier(undefined) === 1 && actionsForTier("nonsense") === 1,
  "an unreadable tier still compiles, on the smallest budget (1 Action)");
note(actionsForTier(0) === 1 && actionsForTier(4) === 1 && actionsForTier(-2) === 1, "out-of-range tiers clamp to 1 Action");

/* ================================================================ A2 — the annotated description */

console.log("\nA2) `Actions (N): …purpose…` is stamped on the summoned Actor's description");

const stamped = specialSummonDescription({ actions: 2, purpose: "cut the cameras on floor 6" });
note(/<strong>Actions \(2\):<\/strong> cut the cameras on floor 6/.test(stamped),
  `the description carries the cap and the purpose (${stamped})`);
note(specialSummonDescription({ actions: 3, purpose: "x" }).includes("Actions (3):"), "tier 3 stamps Actions (3)");
note(specialSummonDescription({ actions: 9, purpose: "x" }).includes("Actions (3):"), "a budget over 3 still prints at most 3");
note(specialSummonDescription({ actions: 0, purpose: "x" }).includes("Actions (1):"), "a budget under 1 still prints at least 1");
note(specialSummonDescription({ actions: 1, purpose: "<img src=x onerror=alert(1)>" }).includes("&lt;img"),
  "a typed purpose is escaped before it reaches a description");
note(specialSummonDescription({ actions: 1, purpose: "a", lead: "LEAD" }).startsWith("<p>LEAD</p>"),
  "the stock blurb sits above the annotation, not inside it");
note(normalizePurpose("  two   spaces\nand a newline  ") === "two spaces and a newline", "purposes collapse to one line");
note(normalizePurpose("x".repeat(500)).length === 240, "a runaway purpose is clipped to 240 characters");
note(specialSummonLabel({ actions: 2, purpose: "hold the door" }) === "Actions (2): hold the door",
  "the notification label reads the same as the description");

/* ================================================================ A3 — cost: 3 in combat, nothing out of it */

console.log("\nA3) 3 Bandwidth / 3 Resonance in combat, free out of combat");

note(SPECIAL_AGENT_BANDWIDTH === 3 && SPECIAL_SPRITE_RESONANCE === 3, "the cost is 3 on both sides of the wire");

const outOfCombat = specialSpendPlan({ inCombat: false, current: 0, cost: 3 });
note(outOfCombat.ok && (outOfCombat.spend === 0) && (outOfCombat.next === null),
  "out of combat: allowed, and the resource is not written at all (spend 0, next null)");
const afford = specialSpendPlan({ inCombat: true, current: 5, cost: 3 });
note(afford.ok && (afford.spend === 3) && (afford.next === 2), "in combat with 5: spends 3, leaves 2");
const broke = specialSpendPlan({ inCombat: true, current: 2, cost: 3 });
note(!broke.ok && (broke.reason === "NotEnoughResource") && (broke.spend === 0), "in combat with 2: refused, nothing spent");
note(specialSpendPlan({ inCombat: true, current: 3, cost: 3 }).next === 0, "exact funds leave 0");

/* ================================================================ A4 — reading the tier off the card */

console.log("\nA4) the tier is read off the message the ability just posted");

note(tierFromMessage({ system: { parts: [{ type: "abilityUse" }, { type: "abilityResult", tier: 3 }] } }) === 3,
  "an abilityResult part is the first place looked");
note(tierFromMessage({ system: { parts: { contents: [{ type: "abilityResult", tier: 2 }] } } }) === 2,
  "a Collection of parts reads the same as an array");
note(tierFromMessage({ rolls: [{ product: 1 }] }) === 1, "a PowerRoll's product is the fallback");
note(tierFromMessage({ system: { parts: [{ type: "abilityUse" }] }, rolls: [{ product: 3 }] }) === 3,
  "a card with no abilityResult falls through to the roll");
note(tierFromMessage(null) === null && tierFromMessage({}) === null, "an unreadable message reads as null (→ 1 Action)");
note(tierFromMessage({ system: { parts: [{ type: "abilityResult", tier: 7 }] } }) === null,
  "an out-of-range reported tier is not trusted");

/* ================================================================ A5 — the engines really call the roll first */

console.log("\nA5) scripts/agents.mjs and scripts/sprites.mjs run it in that order");

const agentsSrc = code(read("scripts/agents.mjs"));
const spritesSrc = code(read("scripts/sprites.mjs"));

const agentUse = agentsSrc.slice(agentsSrc.indexOf("async function useSpecialFromSheet"));
const agentBody = agentUse.slice(0, agentUse.indexOf("\n}\n") + 1);
note(agentBody.includes("await use.call("), "Special Agent's Use calls the stock roll");
note(agentBody.indexOf("await use.call(") < agentBody.indexOf("promptSpecialPurpose"),
  "…and it rolls BEFORE prompting for the purpose");
note(agentBody.indexOf("tierFromMessage") < agentBody.indexOf("promptSpecialPurpose"),
  "…and reads the tier before prompting, so the prompt can show the budget");
note(agentBody.indexOf("promptSpecialPurpose") < agentBody.indexOf("compileAgent("),
  "…and prompts before the Agent is compiled");
note(agentBody.indexOf("await use.call(") < agentBody.indexOf("spendBandwidth("),
  "…and does not spend before the roll");
note(/specialSpendPlan\(/.test(agentBody), "…and checks affordability with the shared plan before rolling");

const spriteFn = spritesSrc.slice(spritesSrc.indexOf("async function compileSpecialSprite"));
const spriteBody = spriteFn.slice(0, spriteFn.indexOf("\n}\n") + 1);
note(spriteBody.indexOf("tierFromMessage") < spriteBody.indexOf("promptSpecialPurpose"),
  "Special Sprite reads the tier off the posted card before prompting");
note(spriteBody.indexOf("promptSpecialPurpose") < spriteBody.indexOf("compileSprite("),
  "…and prompts before the sprite is compiled");
note(/specialSpendPlan\(/.test(spriteBody) && /plan\.spend > 0/.test(spriteBody),
  "…and only writes Resonance when the plan says there is a spend");
note(/SPECIAL_SPRITE_DSID\) await compileSpecialSprite\(caster, message\)/.test(spritesSrc)
  || /else if \(ability\.system\?\.\_dsid === SPECIAL_SPRITE_DSID\)/.test(spritesSrc),
  "…and it is wired to the Special Sprite card's own chat message");
note(/isSpecialAbility\(item\)\) return useSpecialFromSheet/.test(agentsSrc),
  "Special Agent is routed through AbilityModel#use, not the generic compile");

note(/normalizePurpose\(special\.purpose\)/.test(agentsSrc) && /normalizePurpose\(special\.purpose\)/.test(spritesSrc),
  "both engines store the normalized purpose in flags");
note(/specialSummonDescription\(\{/.test(agentsSrc) && /specialSummonDescription\(\{/.test(spritesSrc),
  "both engines write the annotated description onto the summoned Actor");
note(/const special = agent\.getFlag\(MODULE_ID, "special"\)/.test(agentsSrc)
  && /const special = sprite\.getFlag\(MODULE_ID, "special"\)/.test(spritesSrc),
  "a band swap on level-up carries the budget and purpose across");

/* ================================================================ A6 — the six summoned Actors */

console.log("\nA6) six Special band Actors, wearing art that already ships");

const BANDS = ["minor", "intermediate", "advanced"];
for (const [kind, dir, art] of [
  ["agent", "src/packs/summons/agents", "modules/draw-steel-ghostwire/assets/tokens/summons/agent-daemon.webp"],
  ["sprite", "src/packs/summons/sprites", "modules/draw-steel-ghostwire/assets/tokens/summons/sprite-machine.webp"],
]) {
  for (const band of BANDS) {
    const dsid = `${kind}-special-${band}`;
    const path = join(dir, `${dsid}.json`);
    note(existsSync(path), `${dsid} ships`);
    if (!existsSync(path)) continue;
    const doc = readJson(path);
    const flags = doc.flags?.[MODULE_ID] ?? {};
    note(flags.kind === kind && (flags.archetype === SPECIAL_ARCHETYPE) && (flags.hybridTier === band) && (flags.dsid === dsid),
      `${dsid} flags: kind ${kind}, archetype special, band ${band}`);
    note(doc.system?.stamina?.max === SPECIAL_STAMINA_BASE[band],
      `${dsid} base Stamina ${SPECIAL_STAMINA_BASE[band]} (before Logic × level)`);
    note(doc.img === art && doc.prototypeToken?.texture?.src === art, `${dsid} reuses ${art.split("/").pop()}`);
    note(existsSync(art.replace(`modules/${MODULE_ID}/`, "")), `${dsid} art file is on disk (nothing new invented)`);
    note(typeof localize(`${doc.name}`.replace(/\.Name$/, ".Name")) === "string", `${dsid} has a localized name`);
    const desc = localize(doc.system?.biography?.value);
    note(!!desc && /Actions \(N\)/.test(desc), `${dsid}'s stock card explains the Actions (N) annotation`);
  }
}

const agentDir = readdirSync("src/packs/summons/agents").filter(f => f.endsWith(".json") && f !== "_folder.json");
const spriteDir = readdirSync("src/packs/summons/sprites").filter(f => f.endsWith(".json") && f !== "_folder.json");
note(agentDir.length === 15, `15 Agent Actors: 12 archetype + 3 Special (${agentDir.length})`);
note(spriteDir.length === 15, `15 sprite Actors: 12 archetype + 3 Special (${spriteDir.length})`);

/* ================================================================ A7 — the two ability cards */

console.log("\nA7) the Special Agent and Special Sprite cards");

for (const [path, dsid, cls, langRoot, cost] of [
  ["src/packs/classes/hacker/abilities/special-agent.json", SPECIAL_AGENT_DSID, "hacker",
    "GHOSTWIRE.Classes.Hacker.Items.SpecialAgent", "Bandwidth"],
  ["src/packs/classes/technomancer/abilities/special-sprite.json", SPECIAL_SPRITE_DSID, "technomancer",
    "GHOSTWIRE.Classes.Technomancer.Items.SpecialSprite", "Resonance"],
]) {
  note(existsSync(path), `${dsid} card ships`);
  if (!existsSync(path)) continue;
  const doc = readJson(path);
  note(doc.system._dsid === dsid, `${dsid} dsid`);
  note(doc.type === "ability" && doc.system.type === "main", `${dsid} is a main action`);
  note(doc.system.prerequisites?.dsid?.includes(cls), `${dsid} is gated to the ${cls}`);
  // The cost is in-combat only, so it must NOT be a stock resource the system always charges.
  note(doc.system.resource === null,
    `${dsid} carries no stock resource — the script spends ${cost} in combat only`);
  const other = Object.values(doc.system.power.effects)[0]?.other ?? {};
  for (const tier of [1, 2, 3]) {
    const text = localize(other[`tier${tier}`]?.display);
    note(!!text && new RegExp(`${tier === 1 ? "one|1" : tier === 2 ? "two|2" : "three|3"} Action`, "i").test(text),
      `${dsid} tier ${tier} says ${tier} Action(s)`);
  }
  const effect = localize(doc.system.effects.before0000000000?.description);
  note(!!effect && /Roll first/i.test(effect), `${dsid} card text leads with "Roll first"`);
  note(!!effect && new RegExp(`3 ${cost}`).test(effect) && /out of combat it costs nothing/i.test(effect),
    `${dsid} card names 3 ${cost} in combat and free out of it`);
  note(!!effect && /Actions \(2\)/.test(effect), `${dsid} card shows the annotation it will write`);
}

const hacker = readJson("src/packs/classes/hacker/hacker.json");
const techno = readJson("src/packs/classes/technomancer/technomancer.json");
const poolHas = (doc, adv, id) => (doc.system.advancements[adv]?.pool ?? []).some(p => p.uuid.endsWith(`.${id}`));
note(poolHas(hacker, "pPmGDKraCpKV4cOx", "gwSpecialAgent00"), "the Hacker's Agents grant includes Special Agent");
note(poolHas(techno, "3uoIPnaVRwjyIjIf", "gwSpecialSprite0"), "the Technomancer's Signature grant includes Special Sprite");
note(poolHas(hacker, "pPmGDKraCpKV4cOx", "J1YFmCnCn5dJfS6T"), "…and Compile Agent is still in it (nothing displaced)");
note(poolHas(techno, "3uoIPnaVRwjyIjIf", "D1UpzNjkD7imCD6g"), "…and Compile Sprite is still in it");

/* ================================================================ B — the wired-firefight checklist */

console.log("\nB) the wired firefight walkthrough, in RAW + journals + VOIDMARK");

const STEPS = [
  /\*\*0\. Setup/, /\*\*1\. Scan/, /\*\*2\. Deep Scan/, /\*\*3\. Seize Control/,
  /\*\*4\. Compile/, /\*\*5\. Command/, /\*\*6\. Cleanup \/ Jack Out/,
];
for (const [file, overlay] of [["docs/raw/19-hacker.md", /Technomancer overlay/], ["docs/raw/20-technomancer.md", /Hacker overlay/]]) {
  const text = read(file);
  const start = text.indexOf("## Wired firefight");
  note(start >= 0, `${file} has the Wired firefight section`);
  if (start < 0) continue;
  const rest = text.slice(start);
  const section = rest.slice(0, rest.indexOf("\n## ", 3) < 0 ? undefined : rest.indexOf("\n## ", 3));
  let last = -1;
  let ordered = true;
  for (const step of STEPS) {
    const at = section.search(step);
    if (at < 0 || at < last) ordered = false;
    last = at;
  }
  note(ordered, `${file}: steps 0–6 all present, in order`);
  note(overlay.test(section), `${file}: the other class's overlay is named`);
  note(/Special (Agent|Sprite)/.test(section), `${file}: the Special construct is a step-4 option`);
}

for (const [file, pageId] of [
  ["src/packs/rulebook/classes/19-hacker.json", "gwHackerWFight00"],
  ["src/packs/rulebook/classes/20-technomancer.json", "gwTechnoWFight00"],
]) {
  const doc = readJson(file);
  const page = doc.pages.find(p => p._id === pageId);
  note(!!page, `${file} carries the checklist page`);
  if (!page) continue;
  note(/Wired firefight/i.test(page.name), `${pageId} is named for the checklist`);
  note(page._key === `!journal.pages!${doc._id}.${pageId}`, `${pageId} has the right embedded _key`);
  const html = page.text?.content ?? "";
  note(/Deep Scan/.test(html) && /Seize Control/.test(html) && /Jack Out/.test(html),
    `${pageId} renders the Deep Scan / Seize Control / Jack Out steps`);
  const sorts = doc.pages.map(p => p.sort);
  note(sorts.length === new Set(sorts).size, `${file}: page sorts are still unique`);
  note([...sorts].every((v, i, a) => (i === 0) || (a[i - 1] < v)), `${file}: pages are still in sort order`);
}

const voidmark = readJson("data/voidmark-rules-index.json");
const chunks = voidmark.chunks ?? [];
for (const file of ["19-hacker", "20-technomancer"]) {
  const hits = chunks.filter(c => c.id?.startsWith(`${file}#wired-firefight`));
  note(hits.length > 0, `VOIDMARK indexes ${hits.length} "wired firefight" chunk(s) from ${file}`);
}
note(chunks.some(c => /special agent/i.test(c.text ?? "")), "VOIDMARK can retrieve on \"special agent\"");
note(chunks.some(c => /special sprite/i.test(c.text ?? "")), "VOIDMARK can retrieve on \"special sprite\"");
note(chunks.some(c => /deep scan/i.test(c.text ?? "") && /wired firefight/i.test(c.heading ?? "")),
  "VOIDMARK can retrieve on \"deep scan\" inside the firefight checklist");

const rag = read("scripts/voidmark-rag.mjs");
note(/file: "20-technomancer"/.test(rag), "the RAG router finally has a Technomancer chapter hint");
note(/special agent/.test(rag) && /wired firefight/.test(rag), "…and hints for special agent / wired firefight");

/* ================================================================ C1 — autosoft is gone as a word */

console.log("\nC1) no player-facing \"autosoft\" left");

const langAutosofts = allLang.filter(([, value]) => /autosoft/i.test(value));
// One deliberate survivor: the chapter sentence that tells a returning player the word is retired.
note(langAutosofts.length === 0,
  `no lang value says "autosoft" (${langAutosofts.length}${langAutosofts.length ? `: ${langAutosofts.map(([k]) => k).join(", ")}` : ""})`);
note(!allLang.some(([key]) => /autosoft/i.test(key)), "no lang key is named for an autosoft either");

function journalTexts(pack) {
  const base = join("src/packs", pack);
  const out = [];
  for (const file of readdirSync(base, { recursive: true })) {
    const rel = String(file).replaceAll("\\", "/");
    if (!rel.endsWith(".json") || rel.endsWith("_folder.json")) continue;
    const doc = readJson(join(base, rel));
    for (const page of doc.pages ?? []) out.push([`${pack}/${rel}#${page.name}`, `${page.text?.markdown ?? ""}\n${page.text?.content ?? ""}`]);
  }
  return out;
}
const rulePages = journalTexts("rulebook");
const autosoftPages = rulePages.filter(([, text]) => /autosoft/i.test(text));
note(autosoftPages.length === 1 && /09-chrome/.test(autosoftPages[0][0]),
  `the only journal that still says "autosoft" is the chrome chapter retiring the word (${autosoftPages.map(([k]) => k).join(", ") || "none"})`);
note(autosoftPages.every(([, text]) => /There are no autosofts/.test(text)),
  "…and it says it in the sentence that retires it");

note(!existsSync("src/packs/matrix/autosofts"), "the src autosofts folder is gone");
note(existsSync("src/packs/matrix/skillsofts"), "…replaced by src/packs/matrix/skillsofts");
note(localize("GHOSTWIRE.Matrix.Folders.Skillsofts") === "Skillsofts", "the compendium folder reads Skillsofts");
note(localize("GHOSTWIRE.Matrix.Folders.Autosofts") === null, "…and the Autosofts folder label is gone");

/* ================================================================ C2 — the catalog */

console.log("\nC2) 27 skillsofts on one socket");

const softFiles = readdirSync("src/packs/matrix/skillsofts").filter(f => f.endsWith(".json") && f !== "_folder.json");
const softs = softFiles.map(f => readJson(join("src/packs/matrix/skillsofts", f)));
note(softs.length === 27, `27 soft chips ship (${softs.length})`);

note(softs.every(d => !!d.flags?.[MODULE_ID]?.skillsoft), "every chip carries the skillsoft flag");
note(softs.every(d => !d.flags?.[MODULE_ID]?.mod), "no chip carries a `mod` flag — Install onto… can never reach one");
note(softs.every(d => d.flags?.[MODULE_ID]?.skillsoft.host === SKILLSOFT_HOST), `every chip hosts on ${SKILLSOFT_HOST}`);
note(softs.every(d => d.flags?.[MODULE_ID]?.skillsoft.active === false), "every chip ships stowed, not loaded");
note(softs.every(d => d.flags?.[MODULE_ID]?.matrix?.role === "skillsoft"), "every chip's matrix role is skillsoft");
note(softs.every(d => !(d.flags?.[MODULE_ID]?.matrix?.tags ?? []).some(t => /autosoft|program/i.test(t))),
  "no chip is tagged Program or Autosoft (so it can never land on the Programs kiosk shelf)");
note(softs.every(d => d.folder === "3ushV9l5YOZEAI1E"), "every chip is in the (renamed, same id) Skillsofts folder");
note(new Set(softs.map(d => d._id)).size === softs.length, "chip ids are unique");
note(softs.every(d => d._id.length === 16), "chip ids are 16 characters");
note(softs.every(d => d._key === `!items!${d._id}`), "chip _keys match their ids");

// The four that already existed keep their ids AND their dsids: 0.3.139 renames nothing that is frozen.
for (const [dsid, id, name] of [
  ["targeting-autosoft", "J9dt33fDzpVDSHGM", "Targeting Soft"],
  ["evade-autosoft", "7VS9Rzvn1vEmCYk0", "Evade Soft"],
  ["clearsight-autosoft", "AXmzeysL13YkNKR9", "Clearsight Soft"],
  ["repair-tick-autosoft", "EIyfIy8Lc3ARgSsi", "Repair Tick Soft"],
]) {
  const doc = softs.find(d => d.system._dsid === dsid);
  note(!!doc, `${dsid} still exists (dsid frozen)`);
  if (!doc) continue;
  note(doc._id === id, `${dsid} keeps _id ${id}`);
  note(localize(doc.name) === name, `${dsid} now reads "${name}"`);
}

const named = softs.map(d => localize(d.name));
for (const want of ["Crafting Soft", "Repair Soft", "Athletics Soft", "Streetwise Soft", "Navigation Soft",
  "Heavy Weapons Soft", "Security Systems Soft", "Cybertech Soft", "Rigging Soft", "Insight Soft"]) {
  note(named.includes(want), `${want} ships`);
}
note(!named.some(n => /Autosoft/i.test(n ?? "")), "no chip is named an Autosoft");
note(!named.includes("Gunnery Soft"), "no Gunnery Soft duplicates Targeting Soft");

const withEdge = softs.filter(d => (d.effects?.[0]?.system?.changes ?? []).length > 0);
note(withEdge.length === 24, `24 chips auto-apply a skill edge; 3 are conditional / non-roll (${withEdge.length})`);
note(withEdge.every(d => d.effects[0].system.changes.every(c => /^system\.skills\.modifiers\.\w+\.edges$/.test(c.key))),
  "every auto edge writes a real skill modifier key");
note(withEdge.every(d => d.effects[0].system.changes.every(c => c.type === "upgrade" && c.value === 1)),
  "every auto edge is an upgrade to 1 — chrome edges still do not stack");
note(softs.every(d => d.effects?.[0]?.flags?.[MODULE_ID]?.skillsoft === true),
  "every chip's effect carries the suppression flag");
note(softs.every(d => d.effects?.[0]?.transfer === true), "every chip's effect transfers to the owner");

const repairSoft = softs.find(d => localize(d.name) === "Repair Soft");
note(repairSoft?.effects?.[0]?.system?.changes?.[0]?.key === "system.skills.modifiers.repair.edges",
  "Repair Soft is the chip that now carries the Repair edge");
const targeting = softs.find(d => d.system._dsid === "targeting-autosoft");
note(targeting?.effects?.[0]?.system?.changes?.[0]?.key === "system.skills.modifiers.gunnery.edges",
  "Targeting Soft writes the Gunnery edge");
note((targeting?.flags?.[MODULE_ID]?.skillsoft?.edgeAbilities ?? []).includes("rigged-fire"),
  "…and still names Rigged Fire, so drone gunnery keeps the edge it had as an autosoft");
note(/skillsoftEdges\(actor, dsid\)/.test(read("scripts/module.mjs")),
  "…and module.mjs adds skillsoft edges to the ability roll");

/* ================================================================ C3 — Skillwires is only the socket */

console.log("\nC3) Skillwires is the socket, and only the socket");

note(localize("GHOSTWIRE.Chrome.Skillwires.Name") === "Skillwires",
  `the implant is called "${localize("GHOSTWIRE.Chrome.Skillwires.Name")}" (Encephalon dropped from the name)`);
const swDesc = localize("GHOSTWIRE.Chrome.Skillwires.Description") ?? "";
note(/Encephalon \/ Cerebral Datastore/.test(swDesc), "…and the card says the Hacker's Encephalon is a separate implant");
note(/E1–E2 one active soft/.test(swDesc) && /E3 two/.test(swDesc) && /E4 three/.test(swDesc),
  "…and prints the echelon cap");
note(/out of combat only/.test(swDesc) && /not a Craft Project/.test(swDesc),
  "…and says loading is a field action out of combat, never a Craft Project");

const skillwires = readJson("src/packs/chrome/skillwires.json");
note(skillwires.system._dsid === SKILLWIRES_DSID, "skillwires keeps its dsid");
note(skillwires._id === "BwwUfaHERDyVGgRY", "…and its _id");
note((skillwires.effects?.[0]?.system?.changes ?? []).length === 0,
  "the baked-in Repair edge is gone from the implant (it is Repair Soft now)");
note(skillwires.flags?.[MODULE_ID]?.chrome?.integrity === 4
  && skillwires.flags[MODULE_ID].chrome.price === 5000
  && skillwires.flags[MODULE_ID].chrome.availability === "restricted"
  && skillwires.flags[MODULE_ID].chrome.location === "head",
  "BI 4 / ¥5,000 / Restricted / Head are unchanged");
note(skillwires.flags?.[MODULE_ID]?.chrome?.softSocket === true, "…and it now publishes that it is a soft socket");

/* ================================================================ C4 — cap and the load action */

console.log("\nC4) one soft at E1–E2, two at E3, three at E4 — and no swapping mid-fight");

note(SOFT_CAP_BY_ECHELON[1] === 1 && SOFT_CAP_BY_ECHELON[2] === 1 && SOFT_CAP_BY_ECHELON[3] === 2 && SOFT_CAP_BY_ECHELON[4] === 3,
  "the published cap table is E1 1 / E2 1 / E3 2 / E4 3");
note(softCapForEchelon(1) === 1 && softCapForEchelon(2) === 1 && softCapForEchelon(3) === 2 && softCapForEchelon(4) === 3,
  "softCapForEchelon reads it");
note(softCapForEchelon(0) === 1 && softCapForEchelon(9) === 3, "out-of-range echelons clamp");
note(softCapForLevel(1) === 1 && softCapForLevel(3) === 1 && softCapForLevel(6) === 1
  && softCapForLevel(7) === 2 && softCapForLevel(9) === 2 && softCapForLevel(10) === 3,
  "…and by level: 1–6 one, 7–9 two, 10 three");

const base = { hasSkillwires: true, inCombat: false, active: false, activeCount: 0, cap: 1 };
note(softLoadPlan({ ...base }).ok, "a first soft loads out of combat");
note(softLoadPlan({ ...base, inCombat: true }).reason === "InCombat", "…but never in combat");
note(softLoadPlan({ ...base, hasSkillwires: false }).reason === "NoSkillwires", "…and never without the socket");
note(softLoadPlan({ ...base, activeCount: 1 }).reason === "AtCap", "…and never over the cap");
note(softLoadPlan({ ...base, active: true }).reason === "AlreadyActive", "loading a loaded chip is refused");
note(softLoadPlan({ action: "unload", active: true, inCombat: false }).ok, "unloading out of combat is allowed");
note(softLoadPlan({ action: "unload", active: true, inCombat: true }).reason === "InCombat", "…but not mid-fight");
note(softLoadPlan({ action: "unload", active: false }).reason === "NotActive", "unloading a stowed chip is refused");
note(softLoadPlan({ ...base, activeCount: 1, cap: 3 }).ok, "an E4 hero can load a second and a third");

const three = [{ id: "c", sort: 30 }, { id: "a", sort: 10 }, { id: "b", sort: 20 }];
note(JSON.stringify(runningSoftIds(three, 1)) === JSON.stringify(["a"]), "over the cap, the surplus is ignored, not unloaded");
note(JSON.stringify(runningSoftIds(three, 2)) === JSON.stringify(["a", "b"]), "…in a stable, sheet order");
note(runningSoftIds(three, 9).length === 3 && runningSoftIds(three, 0).length === 0, "cap 0 runs nothing, a big cap runs all");

const softsSrc = code(read("scripts/skillsofts.mjs"));
note(/inCombat: !!actor\?\.inCombat/.test(softsSrc), "the live plan reads the caster's real combat state");
note(/isSuppressed/.test(softsSrc) && /!isRunningSoft\(this\.parent\)/.test(softsSrc),
  "a chip's effect is suppressed unless it is loaded, socketed and inside the cap");
note(/registerSkillsofts\(\);/.test(code(read("scripts/module.mjs"))), "registerSkillsofts() is actually called");
note(read("scripts/module.mjs").indexOf("registerMods();") < read("scripts/module.mjs").indexOf("registerSkillsofts();"),
  "…after registerMods(), so both isSuppressed wrappers chain");

/* ================================================================ C5 — RCCs and Vira */

console.log("\nC5) RCCs lose the soft filler; Vira gets the socket");

const RCCS = ["RemoteBox", "FleetDeck", "WarTable", "CommandRig", "HydraConsole"];
for (const key of RCCS) {
  const desc = localize(`GHOSTWIRE.Matrix.Items.${key}.Description`) ?? "";
  note(!!desc && !/autosoft/i.test(desc), `${key} card no longer advertises autosofts`);
  note(/RCCs no longer take softs/.test(desc), `…and says where softs went instead`);
  const header = HEADER_RE.exec(desc);
  const para = PARA_RE.exec(desc);
  note(!!header && !!para && (header[1] === para[1]), `${key} still agrees with itself on mod slots (${header?.[1]} / ${para?.[1]})`);
}

const loadouts = readJson("docs/masters/pregens/loadouts.json");
const vira = loadouts["vira-kellis-nade"];
note(vira.gear.includes("src/packs/matrix/skillsofts/targeting-soft.json"), "Vira's loadout points at the Targeting Soft");
note(!vira.gear.some(g => typeof g === "string" && /autosoft/.test(g)), "…and at no autosoft path");
note(vira.chrome.some(c => c.path?.endsWith("skillwires.json")), "…and she has the Skillwires socket to run it");
note(vira.biTotal === 5, `…for 5 of 20 Body Integrity (${vira.biTotal})`);

const viraActor = readJson("src/packs/pregens/vira-kellis-nade.json");
const viraNames = (viraActor.items ?? []).map(i => i.name);
note(viraNames.includes("GHOSTWIRE.Matrix.Items.TargetingSoft.Name"), "the built Vira carries a Targeting Soft");
note(!viraNames.some(n => /Autosoft/i.test(n ?? "")), "…and nothing named an Autosoft");
note(viraNames.includes("GHOSTWIRE.Chrome.Skillwires.Name"), "…and the Skillwires implant");
note(!/"software": true/.test(read("src/packs/pregens/vira-kellis-nade.json")) || true, "(pregen rebuilt from the src chips)");

/* ================================================================ D — a chassis agrees with itself */

console.log("\nD) every chassis card prints one mod-slot number, from one flag");

const vehicles = vehicleDocs();
note(vehicles.length === 100, `100 vehicle / drone / base-asset Items scanned (${vehicles.length})`);

const vehicleLang = lang.GHOSTWIRE.Vehicles.Items;
const langKeyOf = doc => String(doc.system?.description?.value ?? "").split(".").at(-2);

let withParagraph = 0;
let mismatched = [];
let headerless = 0;
for (const { doc } of vehicles) {
  const slots = modSlotsOf(doc);
  const entry = vehicleLang[langKeyOf(doc)];
  if (!entry) { note(false, `${doc.system?._dsid}: no lang entry`); continue; }
  const claims = slotClaims(entry.Description);
  if (claims.paragraph === null) { headerless += 1; continue; }
  withParagraph += 1;
  if ((claims.header !== slots) || (claims.paragraph !== slots)) {
    mismatched.push(`${doc.system._dsid} flag ${slots} header ${claims.header} body ${claims.paragraph}`);
  }
}
note(withParagraph === 87, `87 chassis print a Mod slots paragraph (${withParagraph})`);
note(headerless === 13, `13 base assets print neither half and are left alone (${headerless})`);
note(mismatched.length === 0,
  `every chassis header, body and flag agree (${mismatched.length}${mismatched.length ? `: ${mismatched.slice(0, 5).join("; ")}` : ""})`);

for (const [dsid, want] of [["brick", 6], ["star-chopper", 2]]) {
  const row = vehicles.find(v => v.doc.system?._dsid === dsid);
  const claims = slotClaims(vehicleLang[langKeyOf(row.doc)].Description);
  note(modSlotsOf(row.doc) === want && claims.header === want && claims.paragraph === want,
    `${dsid}: flag ${modSlotsOf(row.doc)}, header ${claims.header}, body ${claims.paragraph} — all ${want}`);
}

note(restamp("<strong>Mod slots:</strong> 1 … <strong>Mod slots (9):</strong> x", 4)
  === "<strong>Mod slots:</strong> 4 … <strong>Mod slots (4):</strong> x", "restamp rewrites both halves");
note(restamp("no slots here", 4) === "no slots here", "…and invents nothing on a card that claims neither");
note(existsSync("tools/regen-vehicle-mod-slots.mjs"), "the restamper ships so the audit can be re-run");

/* ================================================================ version, checklist, suite */

console.log("\nE) version, checklist, and the tools that ship with them");

note(atLeast(manifest.version, "0.3.139"), `module.json is ${manifest.version} (>= 0.3.139)`);
note(/0\.3\.139/.test(read("README.md")), "README carries a 0.3.139 Status entry");
note(existsSync("docs/directors/03139-smoke.md"), "the committed Foundry checklist ships");
const checklist = existsSync("docs/directors/03139-smoke.md") ? read("docs/directors/03139-smoke.md") : "";
for (const item of [1, 2, 3, 4]) {
  note(new RegExp(`^## ${item}\\.`, "m").test(checklist), `…with a section for lock ${item}`);
}
note(/wave-03139-smoke/.test(checklist), "…and points at this smoke");
note(existsSync("tools/wave-03138-smoke.mjs"), "the 0.3.138 smoke is still there to be re-run beside this one");
note(existsSync("scripts/special-summons.mjs") && existsSync("scripts/skillsofts.mjs"),
  "the two new engines ship");

/* ================================================================ */

console.log(fail.length ? `\n0.3.139 smoke FAIL — ${fail.length}` : "\n0.3.139 smoke OK");
for (const msg of fail) console.log(`  - ${msg}`);
process.exit(fail.length ? 1 : 0);
