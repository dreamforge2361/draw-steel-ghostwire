#!/usr/bin/env node
/**
 * B82 smoke: VOIDMARK index + lexical RAG + prompt/API helpers (no Foundry, no live key).
 *
 * Run: node tools/voidmark-smoke.mjs
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { citationLabels, retrieve } from "../scripts/voidmark-rag.mjs";
import { DEFAULT_SYSTEM_INSTRUCTIONS, buildChatMessages } from "../scripts/voidmark-prompt.mjs";
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
ok(!files.has("00-front-matter.md"), "skips front matter");
ok(!files.has("00-INDEX.md"), "skips RAW index notes");
ok(!files.has("EXTRACT-NOTES.md"), "skips handbook extract notes");
ok(!files.has("ART-INDEX.md"), "skips handbook art index");
ok(!files.has("README.md"), "skips lore README");
ok(index.sources?.handbook?.some(f => f.includes("04-switchboard")), "handbook source lists 04-switchboard");

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
ok(kitQ.some(h => /vehicle/i.test(h.text) && /wire kit|connect/i.test(h.text)), "Wire Kit query names pack vehicles");

const harnessQ = retrieve(index, "Does Rigger's Harness count as a Connect interface or deck?");
ok(harnessQ.some(h => /rigger.?s harness/i.test(h.text) && /connect|interface|deck/i.test(h.text)), "Rigger's Harness query retrieves Harness as Connect");

const statesQ = retrieve(index, "What are the Wire connection states?");
ok(statesQ.some(h => /linked/i.test(h.text) && /overlay/i.test(h.text) && /jacked in/i.test(h.text)), "connection-states query names Linked, Overlay, and Jacked In");

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

console.log("");
if (failures.length) {
  console.error(`FAILED (${failures.length})`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log("B82 VOIDMARK smoke passed");
