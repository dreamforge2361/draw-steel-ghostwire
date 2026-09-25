#!/usr/bin/env node
/**
 * B82 smoke: VOIDMARK index + lexical RAG + prompt/API helpers (no Foundry, no live key).
 *
 * Run: node tools/voidmark-smoke.mjs
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  citationLabels, clarification, classRoute, retrieve, retrievalQuery, retrieveConversational, scoreChunk,
} from "../scripts/voidmark-rag.mjs";
import {
  DEFAULT_SYSTEM_INSTRUCTIONS, buildChatMessages, formatClarification,
} from "../scripts/voidmark-prompt.mjs";
import { buildChatRequest, redactSecrets, serializeRequestForLog } from "../scripts/voidmark-client.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const INDEX_PATH = join(ROOT, "data/voidmark-rules-index.json");
const failures = [];
const ok = (cond, msg) => {
  if (!cond) failures.push(msg);
  else console.log(`  ✓ ${msg}`);
};

const index = JSON.parse(readFileSync(INDEX_PATH, "utf8"));
const files = new Set(index.chunks.map(c => c.file));

console.log("B82 VOIDMARK RAG / prompt smoke\n");

console.log("1) Index shape");
ok(index.version === 1, `version ${index.version}`);
ok(index.role === "knowledge" || index.role == null, `role ${index.role ?? "unset"}`);
ok(index.chunkCount === index.chunks.length && index.chunks.length >= 200, `${index.chunks.length} chunks`);
ok(files.has("21-the-wire.md"), "includes The Wire");
ok(files.has("04-combat.md"), "includes Combat");
ok(files.has("L1-setting-primer.md"), "includes L1 setting primer");
ok(files.has("L2-peoples-and-world.md"), "includes L2 peoples");
ok(files.has("L3-ossian-reach-color.md"), "includes L3 Reach color");
ok(files.has("L4-voidmark.md"), "includes VOIDMARK lore chip");
ok(files.has("L5-hands-off-accords.md"), "includes Hands Off lore chip");
ok(files.has("04-switchboard.md"), "includes Reach Handbook Switchboard");
ok(files.has("01-what-the-flats-are.md"), "includes What the Flats Are");
ok(files.has("05-the-neon-shambles.md"), "includes Neon Shambles");
ok(files.has("wired-flats-gazetteer.md"), "includes Wired Flats gazetteer");
ok(files.has("27-running-ossian-reach.md"), "includes Running Ossian Reach pointer");
ok(files.has("28-glossary-slang.md"), "includes glossary slang (Hover / POV)");
ok(files.has("03-life-on-the-flats.md"), "includes Life on the Flats");
ok(index.chunks.some(c => /Table look — Lane-Hopper/.test(c.heading)), "indexes Lane-Hopper table look");
ok(index.chunks.some(c => /Table look — Star-Chopper/.test(c.heading)), "indexes Star-Chopper table look");
ok(!files.has("00-front-matter.md"), "skips front matter");
ok(!files.has("00-INDEX.md"), "skips RAW index notes");
ok(!files.has("EXTRACT-NOTES.md"), "skips handbook extract notes");
ok(!files.has("ART-INDEX.md"), "skips handbook art index");
ok(!files.has("README.md"), "skips lore README");
ok(index.sources?.handbook?.some(f => f.includes("04-switchboard")), "handbook source lists 04-switchboard");

ok(index.chunks.every(c => c.audience === "player" || c.audience === "director"), "B122: every chunk carries an audience");
ok(index.audienceCounts?.director > 0, `B122: ${index.audienceCounts?.director} Director-only chunks tagged`);

const heroesHits = index.chunks.filter(c => /draw steel heroes/i.test(c.text));
ok(!heroesHits.length, "no Draw Steel Heroes in indexed rule/lore chunks");

const linkedChunks = index.chunks.filter(c => /linked/i.test(c.text) && c.file.includes("21-the-wire"));
ok(linkedChunks.length >= 1, `Wire index chunks mention Linked (${linkedChunks.length})`);
ok(
  index.chunks.some(c => /Disconnected.*Linked.*Overlay.*Jacked In|four connection states/i.test(c.text)),
  "index names four connection states including Linked",
);

console.log("\n2) Retrieval");
const wire = retrieve(index, "What's the difference between Overlay and Jacked In on the Wire?");
ok(wire.length >= 2, `wire query returned ${wire.length} hits`);
ok(wire.some(h => h.file.includes("21-the-wire")), `wire top files: ${wire.map(h => h.file).join(", ")}`);
ok(wire.some(h => /overlay|jacked in/i.test(h.text)), "wire hits mention Overlay / Jacked In");
ok(wire.some(h => /linked/i.test(h.text)), "Overlay vs Jacked In query still retrieves Linked");

const linkedQ = retrieve(index, "What is Linked on the Wire?");
ok(linkedQ.some(h => h.file.includes("21-the-wire")), `Linked query files: ${linkedQ.map(h => h.file).join(", ")}`);
ok(linkedQ.some(h => /linked/i.test(h.text) && /broadcast|comms|connect/i.test(h.text)), "Linked query hits name Linked + comms/Broadcast");

const connectQ = retrieve(index, "What does Connect do on the Wire?");
ok(connectQ.some(h => /linked/i.test(h.text) && /connect/i.test(h.text)), "Connect query retrieves Connect + Linked");

const kitQ = retrieve(index, "Does Wire Kit count as a Connect interface?");
ok(kitQ.some(h => h.file.includes("21-the-wire") && /wire kit/i.test(h.text)), "Wire Kit query retrieves RAW 21");
ok(kitQ.some(h => /pack drones and vehicles|pack drones/i.test(h.text) || /wire kit/i.test(h.text) && /connect/i.test(h.text)), "Wire Kit query names Connect / pack drones");

const vehQ = retrieve(index, "Do pack vehicles and drones ship with Wire Kit?");
ok(vehQ.some(h => /wire kit/i.test(h.text) && /vehicle/i.test(h.text)), "pack vehicles query retrieves Wire Kit");
ok(index.chunks.some(c => c.file.includes("21-the-wire") && /wire kit/i.test(c.text) && /pack drones and vehicles/i.test(c.text)), "RAW 21 Wire interface chunk names pack drones and vehicles");

const harnessQ = retrieve(index, "Does Rigger's Harness count as a Connect interface or deck?");
ok(harnessQ.some(h => /rigger.?s harness/i.test(h.text) && /connect|interface|deck/i.test(h.text)), "Rigger's Harness query retrieves Harness as Connect");

const constructsQ = retrieve(index, "Where do sprites and Agents live on the Wired Console? Lock A roster anchor");
ok(constructsQ.some(h => h.file.includes("21-the-wire")), `Constructs query files: ${constructsQ.map(h => h.file).join(", ")}`);
ok(
  constructsQ.some(h => /construct/i.test(h.text) && /lock a/i.test(h.text) && /roster anchor/i.test(h.text)),
  "Constructs query retrieves Lock A roster-anchor language",
);
const peerQ = retrieve(index, "Do Overlay Jacked In compilers see each other's sprites Agents without Scan?");
ok(peerQ.some(h => /without Scan/i.test(h.text) && /Overlay/i.test(h.text)), "Constructs peer-visibility query retrieves Overlay without Scan");

const statesQ = retrieve(index, "What are the Wire connection states?");
ok(statesQ.some(h => /linked/i.test(h.text) && /overlay/i.test(h.text) && /jacked in/i.test(h.text)), "connection-states query names Linked, Overlay, and Jacked In");

// 0.3.125 (A) — Disengage had no RAW chunk at all, so VOIDMARK answered "not on this channel".
// The procedure now lives in 04-combat under its own heading; the retrieve has to find it.
const disengageQ = retrieve(index, "What are the disengage rules?");
ok(disengageQ.some(h => h.file.includes("04-combat")), `disengage query files: ${disengageQ.map(h => h.file).join(", ")}`);
ok(
  disengageQ.some(h => /[Dd]isengage/.test(h.text) && /shift/i.test(h.text) && /opportunity pressure/i.test(h.text)),
  "Disengage query retrieves shift + no opportunity pressure",
);
const disengageValueQ = retrieve(index, "What is my Disengage value?");
ok(
  disengageValueQ.some(h => h.file.includes("04-combat")
    && /Baseline 1/i.test(h.text) && /Kit Disengage bonus/i.test(h.text)),
  "Disengage-value query retrieves the baseline-1 + bonuses stack",
);

const pingQ = retrieve(index, "What does Ping do on the Wire? maglock camera ICE");
ok(pingQ.some(h => h.file.includes("21-the-wire")), `Ping query files: ${pingQ.map(h => h.file).join(", ")}`);
ok(
  pingQ.some(h => /nudge|touch/i.test(h.text) && /read\/write/i.test(h.text) && /maglock|cam/i.test(h.text)),
  "Ping query retrieves nudge vs Read/Write (maglock/cam)",
);

const iceQ = retrieve(index, "Can Ping bypass ICE or open a Track 2 host?");
ok(
  iceQ.some(h => /does not bypass or defeat ICE/i.test(h.text) || (/track 1 only/i.test(h.text) && /ICE/i.test(h.text) && /track 2/i.test(h.text))),
  "ICE/Track 2 query retrieves Ping does not bypass ICE",
);

const agentQ = retrieve(index, "How does a Hacker compile an Agent? Overlay Jacked In");
ok(agentQ.some(h => h.file.includes("19-hacker")), `compile-agent files: ${agentQ.map(h => h.file).join(", ")}`);
ok(
  agentQ.some(h => /compile agent/i.test(h.text) && /overlay|jacked in/i.test(h.text)),
  "compile-agent query retrieves Compile Agent + Overlay/Jacked In",
);

const probeQ = retrieve(index, "What is a Probe Agent?");
ok(probeQ.some(h => h.file.includes("19-hacker") && /probe/i.test(h.text)), "Probe Agent retrieves RAW 19");
const spikeQ = retrieve(index, "What does a Spike Agent do?");
ok(spikeQ.some(h => h.file.includes("19-hacker") && /spike/i.test(h.text) && /integrity/i.test(h.text)), "Spike Agent retrieves Integrity strike");
const daemonQ = retrieve(index, "What is a Daemon Agent?");
ok(daemonQ.some(h => h.file.includes("19-hacker") && /daemon/i.test(h.text)), "Daemon Agent retrieves RAW 19");
const watchdogQ = retrieve(index, "What is a Watchdog Agent vs Watchdog ICE?");
ok(
  watchdogQ.some(h => h.file.includes("19-hacker") && /watchdog agent/i.test(h.text) && /watchdog ice/i.test(h.text)),
  "Watchdog Agent vs Watchdog ICE retrieves RAW 19 distinction",
);
ok(
  retrieve(index, "Linked refuses Compile Agent").some(h => /linked refuses/i.test(h.text)),
  "Linked refuses Compile Agent",
);

const rwQ = retrieve(index, "How do I unlock a maglock or kill a camera feed?");
ok(
  rwQ.some(h => /read\/write/i.test(h.text) && /unlock|kill a cam|kill a camera|cam feed/i.test(h.text)),
  "unlock/cam-off query points at Read/Write",
);

const combat = retrieve(index, "How does a combat round work? Main action maneuver move");
ok(combat.some(h => h.file.includes("04-combat")), `combat top files: ${combat.map(h => h.file).join(", ")}`);
ok(combat.some(h => /main action|maneuver|round/i.test(h.text)), "combat hits mention the action budget");

const mark = retrieve(index, "Who is VOIDMARK and what are the Hands Off Accords?");
ok(mark.some(h => /L4-voidmark|L5-hands/.test(h.file)), `identity files: ${mark.map(h => h.file).join(", ")}`);

const switchboard = retrieve(index, "What is the Switchboard?");
const switchboardSrc = hit => `${hit.file} ${hit.source ?? ""}`;
ok(switchboard.length >= 1, `switchboard query returned ${switchboard.length} hits`);
ok(
  switchboard.some(h => /04-switchboard|L3-ossian-reach|reach-handbook/.test(switchboardSrc(h))),
  `switchboard sources: ${switchboard.map(h => h.source || h.file).join(", ")}`,
);
ok(switchboard.some(h => /switchboard|cassavir/i.test(h.text)), "switchboard hits mention Switchboard / Cassavir");

const flats = retrieve(index, "Switchboard district lore");
ok(
  flats.some(h => /04-switchboard|L3-ossian-reach|reach-handbook/.test(switchboardSrc(h))),
  `district-lore sources: ${flats.map(h => h.source || h.file).join(", ")}`,
);

const shambles = retrieve(index, "Neon Shambles");
ok(
  shambles.some(h => /05-the-neon-shambles|L3-ossian-reach/.test(switchboardSrc(h))),
  `shambles sources: ${shambles.map(h => h.source || h.file).join(", ")}`,
);

const playerWire = retrieve(index, "What's the difference between Overlay and Jacked In on the Wire?", { audience: "player" });
ok(playerWire.length >= 2, `player-audience wire query returned ${playerWire.length} hits`);
ok(playerWire.every(h => h.audience === "player"), "player audience returns no Director chunks (detail: tools/voidmark-audience-smoke.mjs)");

console.log("\n3) Prompt assembly");
ok(/VOIDMARK/.test(DEFAULT_SYSTEM_INSTRUCTIONS), "default prompt names VOIDMARK");
ok(/Draw Steel Heroes/.test(DEFAULT_SYSTEM_INSTRUCTIONS), "default prompt forbids Heroes citations");
ok(/take the stick|Hands Off/i.test(DEFAULT_SYSTEM_INSTRUCTIONS), "default prompt knows Hands Off");

const messages = buildChatMessages({
  mode: "director",
  hits: wire,
  history: [{ role: "user", content: "earlier" }, { role: "assistant", content: "prior" }],
  query: "Overlay vs Jacked In?",
});
ok(messages[0].role === "system", "system message first");
ok(/Director/.test(messages[0].content), "director suffix present");
ok(/SOURCE 1/.test(messages[0].content), "retrieved sources injected");
ok(messages.at(-1).content.includes("Overlay"), "user query last");
ok(citationLabels(wire).length > 0, `citations: ${citationLabels(wire).slice(0, 2).join(" | ")}`);

console.log("\n4) API request builder (no network)");
const request = buildChatRequest({
  baseUrl: "https://api.x.ai/v1/",
  apiKey: "xai-TESTKEY-do-not-log",
  model: "grok-4.6",
  temperature: 0.4,
  maxTokens: 800,
  messages,
});
ok(request.url === "https://api.x.ai/v1/chat/completions", request.url);
ok(request.body.model === "grok-4.6", "model");
const defaulted = buildChatRequest({ apiKey: "xai-TESTKEY-do-not-log", messages });
ok(defaulted.body.model === "grok-4.6", "DEFAULT_MODEL grok-4.6");
ok(request.body.max_tokens === 800, "max_tokens");
ok(request.options.headers.Authorization === "Bearer xai-TESTKEY-do-not-log", "auth header set");

const dumped = JSON.stringify(serializeRequestForLog(request));
ok(!dumped.includes("TESTKEY"), "serializer redacts the key");
ok(dumped.includes("[redacted]"), "serializer marks redaction");
ok(!redactSecrets(`Bearer xai-TESTKEY-do-not-log`).includes("TESTKEY"), "redactSecrets strips bearer tokens");

let threw = false;
try { buildChatRequest({ apiKey: "", messages }); } catch (error) {
  threw = error.code === "VOIDMARK_NO_KEY";
}
ok(threw, "empty key throws VOIDMARK_NO_KEY");

/* ---------------------------------------------------------------- 0.3.134 (G7) summon retrieval */

console.log("");
console.log("0.3.134) Summons, synonyms, and word boundaries");

const search = (query, opts = {}) => retrieve(index, retrievalQuery({ query, ...opts }), { k: 5 });
const topFiles = hits => hits.map(h => h.file);

ok(files.has("29-summon-stat-blocks.md"), "the index includes the generated summon stat blocks");

{
  // The case Michael named: the player uses Ghostwire's own word for lightning damage ("electrical"),
  // and the summon chapter has to come back with the Zephyr and the command rules.
  const hits = search("how do I make my electrical zephyr attack?");
  const hitFiles = topFiles(hits);
  ok(hitFiles.includes("29-summon-stat-blocks.md"), `"electrical zephyr attack" retrieves the summon stat blocks (${hitFiles[0]})`);
  ok(hits.some(h => /zephyr/i.test(h.heading) || /zephyr/i.test(h.text)), "…and the Zephyr's own block is in the hits");
  ok(hits.some(h => /maneuver/i.test(h.text) && /command/i.test(h.text)), "…and the command rules come with it");
}

{
  // The `ice` bug: a bare `ice` in the Wire hint matched "price" and "device", so a shopping question
  // was answered out of the hacking chapter. The hint must not fire at all on this sentence.
  const query = "what's the price of a device";
  const wire = index.chunks.find(c => c.file === "21-the-wire.md");
  const wireScore = scoreChunk(wire, query);
  const hits = search(query);
  ok(topFiles(hits)[0] !== "21-the-wire.md", `"price of a device" does not lead with The Wire (${topFiles(hits)[0]})`);
  // The hint adds a flat +4; with the boundary fixed this chunk should score below that on its own.
  ok(wireScore < 4, `…and the Wire hint no longer fires on "price"/"device" (score ${wireScore})`);
}

{
  // A follow-up carries no nouns of its own. The previous user turn and the selected token do.
  const bare = retrieve(index, "and how much damage?", { k: 5 });
  const withContext = search("and how much damage?", {
    history: [{ role: "user", content: "how do I make my electrical zephyr attack?" }],
    token: { name: "Electrical Zephyr", type: "npc", dsid: "companion-zephyr" },
  });
  ok(!topFiles(bare).includes("29-summon-stat-blocks.md"), "a bare follow-up finds no summon chapter (as expected)");
  ok(topFiles(withContext).includes("29-summon-stat-blocks.md"), "…and the same follow-up with the previous turn + selected token does");
}

{
  // 0.3.134 (C): the arms makers are lore the index has to be able to answer from.
  const hits = search("who makes the Ferrum Rivet?");
  ok(topFiles(hits).includes("L9-arms-makers.md"), `"who makes the Ferrum Rivet" reaches the Arms Makers chapter (${topFiles(hits)[0]})`);
}


/* ------------------------------------------------- 0.3.135 (3) VOIDMARK full wave */

console.log("");
console.log("0.3.135) Packs indexed, current-query-first retrieval, class routing, clarifying questions");

/* 3a — every ability, ritual Working and summon is a first-class entry. */
{
  ok(files.has("pack-abilities.md"), "the index ingests the abilities packs");
  ok(files.has("pack-rituals.md"), "…the 46 ritual Workings");
  ok(files.has("pack-summons.md"), "…and the summons pack");
  ok(index.entityCounts?.ability === 418, `${index.entityCounts?.ability} ability entries`);
  ok(index.entityCounts?.ritual === 46, `${index.entityCounts?.ritual} ritual Working entries`);
  ok(index.entityCounts?.summon === 68, `${index.entityCounts?.summon} summon / machine entries`);
  const entities = new Set(index.chunks.map(c => c.entity).filter(Boolean));
  ok(entities.has("Ward the Room"), "Ward the Room is an entry by name, not a paragraph of Veil prose");
  ok(entities.has("Hurl Element"), "…and so is Hurl Element");
  ok(entities.has("Zephyr Companion"), "…and the Zephyr");
  // Every Working, not a sample of them: the lock is "all Workings".
  const workings = index.chunks.filter(c => c.kind === "ritual");
  const workingNames = new Set(workings.map(c => c.entity));
  ok(workingNames.size === 46, `all ${workingNames.size} Workings are retrievable by name`);
  ok(workings.every(c => c.entityDsid?.startsWith("ritual-")), "…and every one carries its own dsid");
  ok(index.chunks.every(c => (c.kind !== "ability") || c.entityDsid), "every ability entry carries its dsid");
  const ward = workings.find(c => c.entity === "Ward the Room");
  ok(/bane/i.test(ward.text) && /one room/i.test(ward.text), "the Ward entry carries the card's own plain-words text");
  // `retrieve` skips any chunk longer than its char budget, so an unsplit card would be invisible.
  // (Three long *chapter* chunks predate this wave and are not pack entries — hence the kind filter.)
  const packKinds = new Set(["ability", "ritual", "summon"]);
  const oversize = index.chunks.filter(c => packKinds.has(c.kind) && (String(c.text ?? "").length > 5500));
  ok(!oversize.length, `no pack entry is too large for retrieve to pick up (${oversize.length} oversize)`);
}

/* 3b — the current question first. Ward must survive a thread that was about summons. */
const SUMMON_TURN = { role: "user", content: "I am an elementalist and I've just summoned my electrical spirit what can he do?" };
const WARD_Q = "What does ward the room do?";

{
  const alone = retrieveConversational(index, { query: WARD_Q });
  ok(alone[0]?.entity === "Ward the Room", `"${WARD_Q}" alone leads with the Ward entry (${alone[0]?.heading})`);

  const afterSummons = retrieveConversational(index, {
    query: WARD_Q,
    history: [SUMMON_TURN, { role: "assistant", content: "Your zephyr strikes for 4 electrical." }],
  });
  ok(afterSummons[0]?.entity === "Ward the Room", `…and still leads with it after a summon turn (${afterSummons[0]?.heading})`);
  ok(afterSummons.filter(h => h.origin === "current").length >= 3, "the current question holds its reserved slots");
  ok(afterSummons.some(h => /ward/i.test(h.heading ?? "")), "Ward is not starved by the prior summon chat");

  // The 0.3.134 behaviour, for contrast: one merged search string put summons on top.
  const merged = retrieve(index, retrievalQuery({ query: WARD_Q, history: [SUMMON_TURN] }));
  ok(!/ward the room/i.test(merged[0]?.heading ?? ""), "the old merged-query path did lead with the summons (the bug)");

  // Diversity: one card or chapter cannot take every slot.
  const spread = retrieveConversational(index, { query: WARD_Q }, { k: 5 });
  const perKey = new Map();
  for (const hit of spread) {
    const key = hit.entity || hit.file;
    perKey.set(key, (perKey.get(key) ?? 0) + 1);
  }
  ok([...perKey.values()].every(n => n <= 2), `per-source quota holds (${[...perKey.entries()].map(([k, n]) => `${k} x${n}`).join(", ")})`);

  // And a bare follow-up still works — that is what the continuity pass is for.
  const followUp = retrieveConversational(index, {
    query: "and how much damage?",
    history: [SUMMON_TURN],
    token: { name: "Electrical Zephyr", type: "npc", dsid: "companion-zephyr" },
  });
  ok(followUp.some(h => /zephyr/i.test(h.heading ?? "")), "a bare follow-up still reaches the Zephyr through continuity");
}

/* 3c — an Elementalist's electrical spirit is a Zephyr / bound elemental, never a pact spirit. */
{
  const route = classRoute(SUMMON_TURN.content);
  ok(route?.kind === "elementalistSummon", `the question routes to the Elementalist (${route?.kind})`);
  ok(route.demote.includes("hunter spirit"), "…and pact spirits are demoted, not deleted");

  const hits = retrieveConversational(index, { query: SUMMON_TURN.content });
  const headings = hits.map(h => h.heading).join(" | ");
  ok(/bound elemental|zephyr|greater elemental/i.test(headings), `electrical spirit reaches the Bound Elemental / Zephyr path (${headings})`);
  ok(!/guardian spirit|hunter spirit|warrior spirit/i.test(headings), `…and no Street Priest pact spirit (${headings})`);

  // The aliases work without the class being named at all.
  for (const alias of ["what can my electrical spirit do?", "how does a lightning spirit attack?", "electrical zephyr damage"]) {
    ok(classRoute(alias)?.kind === "elementalistSummon", `alias routes: "${alias}"`);
  }
  // A Street Priest still gets their own spirits.
  const priestQ = "I am a street priest, what does my pact spirit do?";
  ok(classRoute(priestQ)?.kind === "pactSpirit", "a priest's spirit is a pact spirit");
  const priest = retrieveConversational(index, { query: priestQ });
  ok(/guardian|hunter|warrior|pact/i.test(priest.map(h => h.heading).join(" | ")), "…and the pact blocks come back for them");

  // Selected-token boost.
  for (const [dsid, want] of [["elemental-rank-3", /bound elemental \(rank 3\)/i], ["companion-zephyr", /zephyr/i]]) {
    const selected = retrieveConversational(index, {
      query: "what can it do?",
      token: { name: "Bound Elemental", type: "npc", dsid },
    });
    ok(want.test(selected[0]?.heading ?? ""), `selected ${dsid} boosts its own entry (${selected[0]?.heading})`);
  }
}

/* 3d — "did you mean X?" instead of a guess or "not on this channel". */
{
  const ambiguous = "what does the ward do?";
  const hits = retrieveConversational(index, { query: ambiguous });
  const clarify = clarification(hits, ambiguous);
  ok(clarify?.ask === true, `"${ambiguous}" asks which ward`);
  ok(clarify.candidates.length >= 2, `…and offers ${clarify.candidates.length}: ${clarify.candidates.join(" / ")}`);
  const instruction = formatClarification(clarify);
  ok(/Did you mean X, or Y\?/.test(instruction), "the prompt carries the did-you-mean instruction");
  ok(/not on this channel/.test(instruction), "…and explicitly forbids the not-on-this-channel fallback here");

  ok(clarification(retrieveConversational(index, { query: WARD_Q }), WARD_Q) === null,
    "a question that names its card asks nothing");
  ok(clarification([], "anything") === null, "an empty retrieve is a different problem, not an ambiguous one");

  const messages = buildChatMessages({ mode: "director", hits, query: ambiguous, clarify });
  ok(/AMBIGUOUS ASK/.test(messages[0].content), "the system message carries the clarify block");
  ok(!/AMBIGUOUS ASK/.test(buildChatMessages({ mode: "director", hits, query: WARD_Q }).content),
    "…and does not when there is nothing to ask");
}

/* 3e — grounded rules first, then a labelled read. */
{
  ok(/ANSWER SHAPE/.test(DEFAULT_SYSTEM_INSTRUCTIONS), "the prompt has an answer shape");
  ok(/\*\*The rules\*\*/.test(DEFAULT_SYSTEM_INSTRUCTIONS), "…rules first");
  ok(/Mark's read/.test(DEFAULT_SYSTEM_INSTRUCTIONS), "…then Mark's read");
  ok(/Tactical angle/.test(DEFAULT_SYSTEM_INSTRUCTIONS), "…labelled as the tactical angle in Director mode");
  ok(/never invents a rule/.test(DEFAULT_SYSTEM_INSTRUCTIONS), "…and never invents a rule there");
  ok(/ability, ritual, Working, spell, summon or construct/.test(DEFAULT_SYSTEM_INSTRUCTIONS),
    "the prompt knows the packet covers any card");
  ok(/Never ask the table to clear the thread/.test(DEFAULT_SYSTEM_INSTRUCTIONS), "no CLEAR THREAD between topics");
  ok(/Did you mean X, or Y/.test(DEFAULT_SYSTEM_INSTRUCTIONS), "the persona knows to ask rather than guess");
  const wardHits = retrieveConversational(index, { query: WARD_Q });
  const system = buildChatMessages({ mode: "director", hits: wardHits, query: WARD_Q })[0].content;
  ok(/card: Ward the Room/.test(system), "the context names the exact card the answer should quote");
  const threaded = buildChatMessages({
    mode: "director",
    hits: retrieveConversational(index, { query: WARD_Q, history: [SUMMON_TURN] }),
    query: WARD_Q,
  })[0].content;
  ok(/background only/.test(threaded), "…and marks continuity packets as background, not as the answer");
}

console.log("");
if (failures.length) {
  console.error(`FAILED (${failures.length})`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log("B82 VOIDMARK smoke passed");
