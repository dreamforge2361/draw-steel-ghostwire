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
ok(index.chunkCount === index.chunks.length && index.chunks.length >= 80, `${index.chunks.length} chunks`);
ok(files.has("21-the-wire.md"), "includes The Wire");
ok(files.has("04-combat.md"), "includes Combat");
ok(files.has("L4-voidmark.md"), "includes VOIDMARK lore chip");
ok(files.has("L5-hands-off-accords.md"), "includes Hands Off lore chip");
ok(!files.has("00-front-matter.md"), "skips front matter");
ok(!files.has("00-INDEX.md"), "skips RAW index notes");

const heroesHits = index.chunks.filter(c => /draw steel heroes/i.test(c.text));
ok(!heroesHits.length, "no Draw Steel Heroes in indexed rule/lore chunks");

console.log("\n2) Retrieval");
const wire = retrieve(index, "What's the difference between Overlay and Jacked In on the Wire?");
ok(wire.length >= 2, `wire query returned ${wire.length} hits`);
ok(wire.some(h => h.file.includes("21-the-wire")), `wire top files: ${wire.map(h => h.file).join(", ")}`);
ok(wire.some(h => /overlay|jacked in/i.test(h.text)), "wire hits mention Overlay / Jacked In");

const combat = retrieve(index, "How does a combat round work? Main action maneuver move");
ok(combat.some(h => h.file.includes("04-combat")), `combat top files: ${combat.map(h => h.file).join(", ")}`);
ok(combat.some(h => /main action|maneuver|round/i.test(h.text)), "combat hits mention the action budget");

const mark = retrieve(index, "Who is VOIDMARK and what are the Hands Off Accords?");
ok(mark.some(h => /L4-voidmark|L5-hands/.test(h.file)), `identity files: ${mark.map(h => h.file).join(", ")}`);

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
