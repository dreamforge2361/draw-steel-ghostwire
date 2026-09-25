#!/usr/bin/env node
/**
 * 0.3.135 wave smoke — items 1 through 5 of the brief, one section each.
 *
 * The theme of this wave is **automation that showed up on the sheet and never reached the dice**: a
 * Rally edge that rendered as an icon and added nothing to an ability roll, a Hurl Element whose
 * element was on the card and unreadable through a live CollectionField, a VOIDMARK that could answer
 * a chapter question and not a card question, and three drone bands drawn at one size.
 *
 * As in 0.3.133 and 0.3.134, the assertions run the **real exported functions** over the **real
 * shipped data** rather than re-typing either: `rallyAbilityEdges` and `hasRallyEdge` over the shipped
 * Rally rules, `elementOfAbility` / `powerEffectList` over four live-collection shapes and the shipped
 * Hurl Element pack row, `droneTokenScale` over every drone SKU in the vehicles pack, and
 * `retrieveConversational` / `classRoute` / `clarification` over the rebuilt VOIDMARK index.
 *
 * Run: `node tools/wave-03135-smoke.mjs`
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { atLeast } from "./lib/module-version.mjs";
import { PACK_FILES, packEntries, packEntryCounts, plainText } from "./lib/pack-entries.mjs";
import {
  EDGE_CHARACTERISTICS, RALLY_EDGE_ID, RALLY_TEMP_STAMINA, rallyAbilityEdges, hasRallyEdge,
} from "../scripts/rally.mjs";
import {
  ELEMENTS, ELEMENT_FX, elementFx, elementForFx, elementOfAbility, powerEffectList, powerEffectType,
} from "../scripts/elements.mjs";
import { ATTUNEMENT_FLAG, ATTUNEMENT_TYPES } from "../scripts/elementalist.mjs";
import { hitFxProfile, spellFlavour } from "../scripts/hit-fx.mjs";
import { DRONE_TOKEN_SCALES, droneScaleBand, droneTokenScale, machineBand, machineTokenSize } from "../scripts/machines.mjs";
import {
  CURRENT_QUERY_SLOTS, PER_SOURCE_QUOTA, clarification, classRoute, retrieve, retrievalQuery,
  retrieveConversational,
} from "../scripts/voidmark-rag.mjs";
import { DEFAULT_SYSTEM_INSTRUCTIONS, buildChatMessages, formatClarification } from "../scripts/voidmark-prompt.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const fail = [];
const note = (pass, msg) => { if (pass) console.log(`  ✓ ${msg}`); else { fail.push(msg); console.log(`  ✗ ${msg}`); } };

const read = path => readFileSync(path, "utf8").replace(/\r\n/g, "\n");
const readJson = path => JSON.parse(read(path));
/** Source with every comment line dropped — a header that *names* a thing is not the thing. */
const code = text => text.split("\n").filter(line => !/^\s*(\/\/|\*|\/\*)/.test(line)).join("\n");

const manifest = readJson("module.json");
const lang = readJson("lang/en.json");
const index = readJson("data/voidmark-rules-index.json");

const localize = key => {
  let node = lang;
  for (const part of String(key).split(".")) {
    if (!node || (typeof node !== "object") || !(part in node)) return key;
    node = node[part];
  }
  return (typeof node === "string") ? node : key;
};
const langHas = dotted => localize(dotted) !== dotted;

function walkJson(root) {
  const out = [];
  const walk = dir => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) { walk(path); continue; }
      if (!entry.name.endsWith(".json") || entry.name.startsWith("_")) continue;
      out.push({ path, doc: readJson(path) });
    }
  };
  if (existsSync(root)) walk(root);
  return out;
}

/* ================================================================ 1 — Rally edge on ability rolls */

console.log("\n1) The Rally edge reaches an ability roll");

{
  const rallyCode = code(read("scripts/rally.mjs"));

  // The rule, as a function: an edge only exists where there is a roll to spend it on.
  note(rallyAbilityEdges({ hasEdge: true, rollEnabled: true }) === 1, "a rallied hero's ability roll gains +1 edge");
  note(rallyAbilityEdges({ hasEdge: true, rollEnabled: false }) === 0, "…a maneuver with no power roll gains nothing");
  note(rallyAbilityEdges({ hasEdge: false, rollEnabled: true }) === 0, "…and an un-rallied hero gains nothing");
  note(rallyAbilityEdges() === 0, "…and no arguments is 0, not NaN");

  // The bug: the AE writes characteristic edges, which an ability roll never reads.
  note(/system\.characteristics\.\$\{characteristic\}\.edges/.test(rallyCode),
    "the Active Effect still writes characteristic edges (that is what a *test* reads)");
  note(EDGE_CHARACTERISTICS.length === 5, "…on all five characteristics");
  // …and the fix: an explicit bump on the modifiers bag AbilityModel#use actually reads.
  note(/config\.modifiers/.test(rallyCode) && /edges: \(Number\(modifiers\.edges\) \|\| 0\) \+ rallyEdges/.test(rallyCode),
    "and the ability roll gets an explicit config.modifiers.edges bump");
  note(/rollEnabled: !!this\.power\?\.roll\?\.enabled/.test(rallyCode), "…gated on the ability having a power roll");
  note(/hasEdge: hasRallyEdge\(this\.actor\)/.test(rallyCode), "…and on the actor actually carrying the edge");

  // The bump has to happen for **every** ability, not only the two cards this file owns.
  const wrapper = rallyCode.slice(rallyCode.indexOf("AbilityModel.prototype.use = async function"));
  const bumpAt = wrapper.indexOf("rallyAbilityEdges");
  const dsidGateAt = wrapper.indexOf("(dsid !== RALLY_DSID)");
  note(bumpAt > 0 && dsidGateAt > 0 && bumpAt < dsidGateAt,
    "the edge is applied before the Rally / Lay-on-Hands dsid gate, so it lands on any ability");

  // Same seam three other files already use — this is not a new mechanism.
  for (const [file, pattern] of [
    ["scripts/mark.mjs", /modifiers\.edges \+= edges/],
    ["scripts/module.mjs", /edges: \(modifiers\.edges \?\? 0\) \+ edges/],
    ["scripts/workshop-benches.mjs", /config\.modifiers\.edges = \(Number\(config\.modifiers\.edges\) \|\| 0\) \+ edges/],
  ]) note(pattern.test(code(read(file))), `${file} uses the same config.modifiers seam`);

  // The clear-after-chat-message hook survives, and only a roll eats the edge.
  note(/Hooks\.on\("createChatMessage"/.test(rallyCode), "the clear-after-chat-message hook is still registered");
  note(/if \(!rolled && !message\.rolls\?\.length\) return;/.test(rallyCode),
    "…and a message with no roll does not consume the edge");
  note(/deleteEmbeddedDocuments\("ActiveEffect", \[RALLY_EDGE_ID\]\)/.test(rallyCode), "…and the effect is deleted when it is spent");
  note(RALLY_EDGE_ID.length === 16, `the effect id is a legal Foundry id (${RALLY_EDGE_ID})`);
  note(hasRallyEdge({ effects: { get: id => (id === RALLY_EDGE_ID ? {} : null) } }) === true, "hasRallyEdge finds the effect by id");
  note(hasRallyEdge(null) === false, "…and says no for no actor");
  note(RALLY_TEMP_STAMINA === 2, "the rest of Rally is untouched (2 temporary Stamina)");

  // The card the player reads should not promise something narrower than what happens.
  const description = localize("GHOSTWIRE.Rally.Edge.Description");
  note(/ability rolls and tests alike/.test(description), "the Rallied effect description says where the edge applies");
  note(langHas("GHOSTWIRE.Rally.Edge.Spent"), "…and the spent message is still localized");
}

/* ================================================================ 2 — Hurl Element / Bolt Barrage colour */

console.log("\n2) The element survives a live CollectionField");

{
  const tier = types => ({ type: "damage", damage: { tier2: { types } } });

  // Shape 1: a plain object keyed by effect id — the pack JSON, and what 0.3.134 handled.
  note(elementOfAbility({ system: { power: { effects: { a: tier(["fire"]) } } } }) === "fire",
    "plain object keyed by id → fire");
  // Shape 2: a plain array.
  note(elementOfAbility({ system: { power: { effects: [tier(["cold"])] } } }) === "cold", "array → cold");
  // Shape 3: `values()` — a Map / Collection. This is the shape that was returning null in a live world.
  note(elementOfAbility({ system: { power: { effects: new Map([["a", tier(["acid"])]]) } } }) === "acid",
    "Map / Collection via values() → acid");
  // Shape 4: `documentsByType.damage` — a DataModel CollectionField's type index.
  note(elementOfAbility({
    system: { power: { effects: { documentsByType: { damage: [tier(["corruption"])] } } } },
  }) === "corruption", "CollectionField documentsByType.damage → corruption");
  // …and documentsByType present but carrying no damage entries must not short-circuit values().
  note(elementOfAbility({
    system: {
      power: {
        effects: {
          documentsByType: { applied: [{ type: "applied" }] },
          values: () => [tier(["poison"])][Symbol.iterator](),
        },
      },
    },
  }) === "poison", "…and a type index with no damage key falls through to values()");

  // The 0.3.134 read, spelled out, so the regression is named rather than implied.
  const collection = new Map([["a", tier(["fire"])]]);
  note(Object.values(collection).length === 0, "Object.values() on a live collection is empty — that was the whole bug");

  note(powerEffectList(null).length === 0, "powerEffectList tolerates nothing at all");
  note(powerEffectList({ a: 1, b: "x" }).length === 0, "…and ignores non-object properties");
  note(powerEffectList([1, 2]).length === 2, "…and passes an array straight through");

  // Model types: `type`, the class's `TYPE`, and a toObject()'d `_source.type`.
  class DamageModel { static TYPE = "damage"; }
  note(powerEffectType(new DamageModel()) === "damage", "a live model's type is read off constructor.TYPE");
  note(powerEffectType({ _source: { type: "damage" } }) === "damage", "…and off _source.type");
  note(powerEffectType({ type: "DAMAGE" }) === "damage", "…case-insensitively");
  note(elementOfAbility({ system: { power: { effects: [Object.assign(new DamageModel(), tier(["sonic"]))] } } }) === "sonic",
    "…and a model instance with no own `type` still resolves its element");

  // Sets: `types` is a SetField on the live model, not an array.
  note(elementOfAbility({
    system: { power: { effects: [{ type: "damage", damage: { tier1: { types: new Set(["holy"]) } } }] } },
  }) === "holy", "a SetField of damage types resolves");
  note(elementOfAbility({ system: { power: { effects: [{ type: "damage", damage: { tier1: { types: "lightning" } } }] } } }) === "lightning",
    "…and so does a bare string");

  note(elementOfAbility({ system: { power: { effects: {} } } }) === null, "no damage effect → null, never a guess");
  note(elementOfAbility(null) === null, "…and no ability at all → null");
  note(elementOfAbility({ system: { power: { effects: [tier(["untyped-nonsense"])] } } }) === null,
    "…and a damage type Ghostwire has no colour for → null");

  // The fallback: the caster's attunement when the card says nothing.
  note(elementForFx({ system: { power: { effects: {} } } }, "fire") === "fire", "elementForFx falls back to the attunement");
  note(elementForFx({ system: { power: { effects: [tier(["cold"])] } } }, "fire") === "cold", "…but the card always wins");
  note(elementForFx({}, "not-an-element") === null, "…and an attunement that is not an element is still null");
  note(ATTUNEMENT_TYPES.every(type => !!ELEMENT_FX[type]), "every attunement a hero can pick has a colour");

  // The fire point, and the flag name it reads.
  const hitFxCode = code(read("scripts/hit-fx.mjs"));
  note(/const element = elementForFx\(ability, attunementOf\(/.test(hitFxCode), "hit-fx reads card-then-attunement");
  note(ATTUNEMENT_FLAG === "attunement", `ATTUNEMENT_FLAG is "${ATTUNEMENT_FLAG}"`);
  note(new RegExp(`getFlag\\?\\.\\(MODULE_ID, "${ATTUNEMENT_FLAG}"\\)`).test(hitFxCode),
    "…and hit-fx reads that exact flag name (no import cycle with elementalist.mjs)");
  note(!/from "\.\/elementalist\.mjs"/.test(hitFxCode), "…because elementalist.mjs already imports hit-fx.mjs");

  // Colours: fire is not pale blue, and cold is not fire.
  const arcane = spellFlavour("Hurl Element");
  note(arcane.key === "arcane", "\"Hurl Element\" still tells the name-matcher nothing");
  note(hitFxProfile("spell", "Hurl Element", { element: "fire" }).color === ELEMENT_FX.fire.color, "fire attunement tints fire");
  note(hitFxProfile("spell", "Hurl Element", { element: "cold" }).color === ELEMENT_FX.cold.color, "cold attunement tints cold");
  note(hitFxProfile("spell", "Hurl Element", { element: "fire" }).color !== arcane.color, "…and neither is the arcane fallback");
  note(ELEMENTS.every(element => elementFx(element)), "every element still has a colour, core and sound");

  // Over the shipped rows: Hurl Element and Bolt Barrage are the two cards Michael named.
  const abilities = walkJson("src/packs/classes/elementalist/abilities");
  const byDsid = new Map(abilities.map(({ doc }) => [doc.system?._dsid, doc]));
  for (const dsid of ["hurl-element", "bolt-barrage"]) {
    const doc = byDsid.get(dsid);
    note(!!doc, `${dsid} ships in the Elementalist pack`);
    if (!doc) continue;
    const damage = powerEffectList(doc.system.power?.effects).filter(effect => powerEffectType(effect) === "damage");
    note(damage.length >= 1, `…and ${dsid} has a damage power effect for the attunement to type`);
    // The pack row is untyped on purpose — scripts/elementalist.mjs stamps the hero's pick before the roll.
    note(elementOfAbility(doc) === null, `…untyped in the pack (${dsid}); the attunement write path types it at use`);
    // …and once typed, the colour follows.
    const typed = structuredClone(doc);
    for (const effect of Object.values(typed.system.power.effects)) {
      if (effect.type !== "damage") continue;
      for (const key of ["tier1", "tier2", "tier3"]) effect.damage[key].types = ["fire"];
    }
    note(elementOfAbility(typed) === "fire", `…and a fire-typed ${dsid} reads fire`);
  }
}

/* ================================================================ 3 — VOIDMARK full wave */

console.log("\n3) VOIDMARK answers card questions, routes by class, and asks when it is unsure");

const SUMMON_TURN = { role: "user", content: "I am an elementalist and I've just summoned my electrical spirit what can he do?" };
const WARD_Q = "What does ward the room do?";

{
  /* 3a — the packs are in the index. */
  const entries = packEntries(".");
  const counts = packEntryCounts(entries);
  note(counts.ability === 418, `${counts.ability} abilities rendered from the packs`);
  note(counts.ritual === 46, `${counts.ritual} ritual Workings`);
  note(counts.summon === 68, `${counts.summon} summon / machine Actors`);
  note(index.entityCounts?.ability === counts.ability, "the shipped index was rebuilt from those entries");
  note(index.entityCounts?.ritual === counts.ritual, "…rituals too");
  note(index.entityCounts?.summon === counts.summon, "…and summons");
  const files = new Set(index.chunks.map(chunk => chunk.file));
  for (const file of Object.values(PACK_FILES)) note(files.has(file), `the index carries ${file}`);
  note(index.chunks.every(chunk => chunk.audience === "player" || chunk.audience === "director"),
    "every chunk still carries an audience (B122 holds)");
  note(index.chunks.filter(chunk => chunk.kind === "ability").every(chunk => chunk.audience === "player"),
    "…and no ability card is accidentally Director-only");

  const byEntity = new Map(entries.map(entry => [entry.entity, entry]));
  note(byEntity.has("Ward the Room"), "Ward the Room is a first-class entry (the lock)");
  note(entries.filter(entry => entry.kind === "ritual").length === 46, "…and so is every other Working");
  note(/Ghosts, spirits and any magic/.test(byEntity.get("Ward the Room").text),
    "…carrying the card's own plain-words paragraph");
  note(byEntity.get("Ward the Room").entityDsid === "ritual-ward-the-room", "…and its dsid");
  note(byEntity.has("Hurl Element") && /Power roll: reason/.test(byEntity.get("Hurl Element").text),
    "an ability entry carries its power roll");
  note(/17\+: 9 \+ @chr damage/.test(byEntity.get("Hurl Element").text), "…and its tiers");
  note(byEntity.has("Zephyr Companion") && /Stamina 15/.test(byEntity.get("Zephyr Companion").text),
    "a summon entry carries its stat line");
  note(/Card — Striking Wind/.test(byEntity.get("Zephyr Companion").text), "…and its embedded cards");

  // Rendering: no HTML, no enricher machinery, no unresolved lang keys.
  const withHtml = entries.filter(entry => /<[a-z/][^>]*>/i.test(entry.text));
  note(!withHtml.length, `no entry leaks HTML (${withHtml.slice(0, 2).map(e => e.entity).join(", ")})`);
  const withKeys = entries.filter(entry => /GHOSTWIRE\./.test(entry.text) || /GHOSTWIRE\./.test(entry.entity));
  note(!withKeys.length, `no entry leaks an unresolved lang key (${withKeys.slice(0, 2).map(e => e.entity).join(", ")})`);
  note(plainText("<p>a</p><ul><li>b</li></ul>") === "a\n\n- b", "plainText turns blocks into lines and items into dashes");
  note(plainText("@UUID[Item.x]{Ward the Room}") === "Ward the Room", "…and reduces an enricher to its label");

  /* 3b — current-query-first. */
  note(CURRENT_QUERY_SLOTS === 3 && PER_SOURCE_QUOTA === 2, `${CURRENT_QUERY_SLOTS} reserved slots, quota ${PER_SOURCE_QUOTA}`);
  const alone = retrieveConversational(index, { query: WARD_Q });
  note(alone[0]?.entity === "Ward the Room", `"${WARD_Q}" alone → ${alone[0]?.heading}`);
  const threaded = retrieveConversational(index, {
    query: WARD_Q,
    history: [SUMMON_TURN, { role: "assistant", content: "Your zephyr strikes for 4 electrical." }],
  });
  note(threaded[0]?.entity === "Ward the Room", `…and after a summon turn → ${threaded[0]?.heading} (no Clear thread needed)`);
  note(threaded.filter(hit => hit.origin === "current").length >= CURRENT_QUERY_SLOTS,
    "the current question keeps its reserved slots");
  note(threaded.some(hit => hit.origin === "context"), "…and continuity still gets the slots below them");
  const merged = retrieve(index, retrievalQuery({ query: WARD_Q, history: [SUMMON_TURN] }));
  note(!/ward the room/i.test(merged[0]?.heading ?? ""),
    `the 0.3.134 merged-query path still leads with the summons (${merged[0]?.heading}) — the bug this replaces`);
  const quota = new Map();
  for (const hit of retrieveConversational(index, { query: WARD_Q }, { k: 5 })) {
    const key = hit.entity || hit.file;
    quota.set(key, (quota.get(key) ?? 0) + 1);
  }
  note([...quota.values()].every(n => n <= PER_SOURCE_QUOTA), "no single card or chapter takes every slot");
  note(retrieveConversational(index, {
    query: "and how much damage?",
    history: [SUMMON_TURN],
    token: { name: "Electrical Zephyr", type: "npc", dsid: "companion-zephyr" },
  }).some(hit => /zephyr/i.test(hit.heading ?? "")), "a bare follow-up still lands, through the continuity pass");

  /* 3c — class routing. */
  const route = classRoute(SUMMON_TURN.content);
  note(route?.kind === "elementalistSummon", "an Elementalist's electrical spirit routes to the elemental path");
  const summonHits = retrieveConversational(index, { query: SUMMON_TURN.content });
  const headings = summonHits.map(hit => hit.heading).join(" | ");
  note(/bound elemental|zephyr|greater elemental/i.test(headings), `→ ${headings}`);
  note(!/guardian spirit|hunter spirit|warrior spirit/i.test(headings), "…and not one Street Priest pact spirit");
  for (const alias of ["my electrical spirit", "a lightning spirit", "electrical zephyr"]) {
    note(classRoute(`what can ${alias} do?`)?.kind === "elementalistSummon", `alias "${alias}" routes without naming the class`);
  }
  note(classRoute("what does my pact spirit do, street priest?")?.kind === "pactSpirit", "a priest still gets pact spirits");
  note(classRoute("how does a maglock work?") === null, "…and a question about nothing summon-shaped routes nowhere");
  for (const [dsid, want] of [["elemental-rank-3", /bound elemental \(rank 3\)/i], ["companion-zephyr", /zephyr/i]]) {
    const selected = retrieveConversational(index, { query: "what can it do?", token: { name: "It", type: "npc", dsid } });
    note(want.test(selected[0]?.heading ?? ""), `a selected ${dsid} token boosts its own entry (${selected[0]?.heading})`);
  }

  /* 3d — clarifying questions. */
  const ambiguous = "what does the ward do?";
  const clarify = clarification(retrieveConversational(index, { query: ambiguous }), ambiguous);
  note(clarify?.ask === true, `"${ambiguous}" → ask which one`);
  note(clarify.candidates.length >= 2, `…candidates: ${clarify.candidates.join(" / ")}`);
  note(/Did you mean/.test(formatClarification(clarify)), "…as a did-you-mean instruction in the prompt");
  note(clarification(alone, WARD_Q) === null, "a question that names its card asks nothing");
  note(clarification([], "anything") === null, "an empty retrieve is not an ambiguous one");

  /* 3e — the answer shape. */
  note(/ANSWER SHAPE/.test(DEFAULT_SYSTEM_INSTRUCTIONS), "the persona has a two-part answer shape");
  note(/Mark's read/.test(DEFAULT_SYSTEM_INSTRUCTIONS) && /Tactical angle/.test(DEFAULT_SYSTEM_INSTRUCTIONS),
    "…rules first, then Mark's read / Tactical angle");
  note(/never invents a rule, a number, a distance, a condition or a duration/.test(DEFAULT_SYSTEM_INSTRUCTIONS),
    "…and the read may never invent a rule");
  note(/Never ask the table to clear the thread/.test(DEFAULT_SYSTEM_INSTRUCTIONS), "…and never asks for a Clear thread");
  const system = buildChatMessages({ mode: "director", hits: threaded, query: WARD_Q, clarify: null })[0].content;
  note(/card: Ward the Room/.test(system), "the assembled context names the card to quote");
  note(/background only/.test(system), "…and marks the continuity packets as background");

  /* 3f — the smoke that owns these cases lives with the other VOIDMARK ones too. */
  const voidmarkSmoke = read("tools/voidmark-smoke.mjs");
  note(/0\.3\.135\) Packs indexed/.test(voidmarkSmoke), "tools/voidmark-smoke.mjs carries the 0.3.135 section");
  note(/retrieveConversational/.test(voidmarkSmoke), "…and exercises the new retrieve");
}

/* ================================================================ 4 — drone token scale */

console.log("\n4) Drone tokens are drawn at their band's scale");

{
  note(DRONE_TOKEN_SCALES["drone-micro"] === 0.5, "Personal / Micro → 0.5");
  note(DRONE_TOKEN_SCALES["drone-small"] === 1, "Light / Small → 1.0");
  note(DRONE_TOKEN_SCALES["drone-medium"] === 1.5, "Vehicle / Medium → 1.5");
  note(Object.keys(DRONE_TOKEN_SCALES).length === 3, "…and exactly three bands ship (no invented fourth)");

  // Both sides of the source of truth: the Item's scale word and the Actor's band.
  note(droneScaleBand("Personal") === "drone-micro", "the Item scale word Personal is Micro");
  note(droneScaleBand("Light") === "drone-small", "…Light is Small");
  note(droneScaleBand("Vehicle") === "drone-medium", "…Vehicle is Medium");
  note(droneScaleBand("drone-medium") === "drone-medium", "…and a band name passes through");
  note(droneScaleBand("machine-drone-micro") === "drone-micro", "…as does a machine-<band> dsid");
  note(droneScaleBand("vehicle-car") === null, "the vehicle-car *band* is not the Item word Vehicle");
  note(droneScaleBand("Heavy") === null && droneScaleBand("Capital") === null, "…and Heavy / Capital are not drone bands");
  note(droneScaleBand("") === null && droneScaleBand(null) === null, "…and nothing is nothing");

  // A vehicle is not this wave's business, and a base asset borrows the small-drone band.
  note(droneTokenScale("vehicle-car", { drone: false, scale: "Vehicle" }) === null, "a car keeps its own art scale");
  note(droneTokenScale("vehicle-air", { scale: "Light" }) === null, "…so does a VTOL");
  note(droneTokenScale("drone-small", { baseAsset: "safehouse-beacon", drone: true }) === null, "…and so does a base asset");
  note(droneTokenScale(null, null) === null, "…and a non-machine Item gets nothing");

  // Over every drone SKU in the shipped vehicles pack.
  const rows = walkJson("src/packs/vehicles")
    .map(({ path, doc }) => ({ path, doc, vehicle: doc.flags?.[MODULE_ID]?.vehicle }))
    .filter(row => row.vehicle);
  const drones = rows.filter(row => row.vehicle.drone);
  note(drones.length >= 40, `${drones.length} drone SKUs ship`);
  const scaled = new Map([["drone-micro", 0], ["drone-small", 0], ["drone-medium", 0]]);
  const missed = [];
  for (const row of drones) {
    const band = machineBand({ getFlag: (_scope, key) => (key === "vehicle" ? row.vehicle : null) });
    const scale = droneTokenScale(band, row.vehicle);
    if (scale == null) { missed.push(row.doc.system?._dsid); continue; }
    if (DRONE_TOKEN_SCALES[band] !== scale) missed.push(`${row.doc.system?._dsid} (band ${band} ≠ ${scale})`);
    else scaled.set(band, scaled.get(band) + 1);
  }
  note(!missed.length, `every drone SKU resolves to its band's scale${missed.length ? ` — missed: ${missed.slice(0, 4)}` : ""}`);
  note([...scaled.values()].every(count => count > 0),
    `all three bands are populated (${[...scaled].map(([band, n]) => `${band} ${n}`).join(", ")})`);
  const vehicles = rows.filter(row => !row.vehicle.drone);
  const scaledVehicles = vehicles.filter(row => droneTokenScale(machineBand({
    getFlag: (_scope, key) => (key === "vehicle" ? row.vehicle : null),
  }), row.vehicle) != null);
  note(!scaledVehicles.length, `no vehicle is rescaled (${vehicles.length} checked)`);

  // The three Generic Drone template Actors carry the scale on their prototype token.
  for (const [file, want] of [
    ["machine-drone-micro", 0.5],
    ["machine-drone-small", 1],
    ["machine-drone-medium", 1.5],
  ]) {
    const doc = readJson(`src/packs/summons/machines/${file}.json`);
    const texture = doc.prototypeToken?.texture ?? {};
    note(texture.scaleX === want && texture.scaleY === want, `${file} prototype token art scale is ${want}`);
    note(doc.prototypeToken?.texture?.src === doc.prototypeToken?.texture?.src, `…and its art path is untouched`);
  }
  // Michael's own Medium drone, the Mule-Bot.
  const mule = readJson("src/packs/summons/machines/mule-bot.json");
  note(mule.prototypeToken.texture.scaleX === 1.5, "the Mule-Bot (Medium) is drawn at 1.5");
  note(/assets\/tokens\/drones\/mule-bot\.webp$/.test(mule.prototypeToken.texture.src), "…on the art it already had");

  // Footprint and art scale are different things, and the footprint did not move.
  note(machineTokenSize("drone-micro") === 1 && machineTokenSize("drone-small") === 1, "token footprints are unchanged");
  note(machineTokenSize("drone-medium") === 2, "…including the 2-square Medium drone");

  // deployMachine stamps both the prototype and the placed token.
  const machinesCode = code(read("scripts/machines.mjs"));
  note(/const artScale = droneTokenScale\(band, vehicleFlags\);/.test(machinesCode), "deployMachine resolves the art scale");
  note(/"prototypeToken\.texture\.scaleX": artScale/.test(machinesCode), "…writes it to the Actor prototype token");
  note(/texture: \{ scaleX: artScale, scaleY: artScale \}/.test(machinesCode), "…and to the token it places");
  note(/artScale == null \? \{\} :/.test(machinesCode), "…and writes nothing at all when the band has no scale");

  // Out of scope this wave: no art was generated, replaced or re-pointed.
  const artTools = ["tools/apply-machine-token-art.mjs", "tools/apply-gear-token-art.mjs"];
  for (const tool of artTools) note(existsSync(tool), `${tool} still ships (unused this wave)`);
}

/* ================================================================ 5 — checklist, version, wiring */

console.log("\n5) Version, checklist and wiring");

note(atLeast(manifest.version, "0.3.135"), `module.json is ${manifest.version} (>= 0.3.135)`);
note(/`0\.3\.135`/.test(read("README.md")), "README has a 0.3.135 Status entry");
note(existsSync("docs/directors/03135-smoke.md"), "the Foundry checklist is written");
{
  const checklist = existsSync("docs/directors/03135-smoke.md") ? read("docs/directors/03135-smoke.md") : "";
  for (const item of ["Rally", "modifiers.edges", "Hurl Element", "Bolt Barrage", "VOIDMARK", "Ward the Room",
    "electrical spirit", "Zephyr", "Did you mean", "Micro", "Small", "Medium", "0.5", "1.5"]) {
    note(checklist.includes(item), `the checklist covers ${item}`);
  }
  for (let item = 1; item <= 4; item += 1) {
    note(new RegExp(`^## ${item}\\.`, "m").test(checklist), `…and has a section for item ${item}`);
  }
  note(/characteristic/i.test(checklist), "…and documents the characteristic / test behaviour Michael asked for");
}
for (const script of ["scripts/rally.mjs", "scripts/elements.mjs", "scripts/hit-fx.mjs", "scripts/machines.mjs",
  "scripts/voidmark-rag.mjs", "scripts/voidmark-prompt.mjs"]) {
  note(existsSync(script), `${script} ships`);
}
for (const tool of ["tools/lib/pack-entries.mjs", "tools/build-voidmark-index.mjs", "tools/voidmark-smoke.mjs"]) {
  note(existsSync(tool), `${tool} ships`);
}
note(manifest.esmodules?.includes("scripts/module.mjs") !== false, "and module.mjs is still the entry point");

/* ================================================================ */

console.log(fail.length ? `\n0.3.135 smoke FAIL — ${fail.length}` : "\n0.3.135 smoke OK");
for (const msg of fail) console.log(`  - ${msg}`);
process.exit(fail.length ? 1 : 0);
