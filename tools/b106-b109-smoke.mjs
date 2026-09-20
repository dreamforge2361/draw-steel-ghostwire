#!/usr/bin/env node
/**
 * B106 Wire ping + B109 Technomancer Whiteout smoke (module 0.3.45).
 *
 * Run: node tools/b106-b109-smoke.mjs
 * Does not write Scene JSON. Asserts gold-line-scene.mjs is untouched.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { appendPing, clampPingText, normalizePings, PING_CAP, PING_MAX_LENGTH, readPings, whisperRecipientIds } from "../scripts/wired-pings.mjs";

const failures = [];
const ok = (cond, msg) => {
  if (!cond) failures.push(msg);
  else console.log(`  ✓ ${msg}`);
};

function readBomFreeJson(path) {
  const buf = readFileSync(path);
  ok(buf[0] !== 0xEF && buf[1] !== 0xBB && buf[2] !== 0xBF, `${path} is BOM-free`);
  return JSON.parse(buf.toString("utf8"));
}

console.log("B106 / B109 playtest smoke (0.3.45)");

const moduleJson = readBomFreeJson("module.json");
ok(moduleJson.version === "0.3.45", `module.json is 0.3.45 (got ${moduleJson.version})`);

const goldDiff = execFileSync("git", ["diff", "--", "scripts/gold-line-scene.mjs"], { encoding: "utf8" });
ok(!goldDiff.trim(), "scripts/gold-line-scene.mjs is unmodified");

ok(clampPingText("  hi  ") === "hi", "clampPingText trims");
ok(clampPingText("x".repeat(PING_MAX_LENGTH + 10)).length === PING_MAX_LENGTH, `clampPingText caps at ${PING_MAX_LENGTH}`);
ok(PING_CAP === 20, "PING_CAP is 20");

const ids = [];
const factory = () => `id${ids.push(ids.length)}`;
const many = Array.from({ length: 25 }, (_, i) => ({ id: `p${i}`, text: `ping ${i}`, whisper: i % 2 === 0, at: i, user: "GM" }));
const capped = normalizePings(many, factory);
ok(capped.length === 20 && capped[0].text === "ping 5" && capped[19].text === "ping 24", "normalizePings keeps last 20");

const grown = appendPing(capped, { text: "newest", whisper: true, at: 99, user: "GM" }, factory);
ok(grown.length === 20 && grown[19].text === "newest" && grown[0].text === "ping 6", "appendPing caps at 20");
ok(appendPing([], { text: "   " }, factory).length === 0, "blank pings are dropped");

const fromBoard = readPings({ flags: { "draw-steel-ghostwire": { wiredBoard: { pings: [{ text: "nested", whisper: false, at: 1, user: "Dir" }] } } } });
ok(fromBoard.length === 1 && fromBoard[0].text === "nested", "readPings accepts wiredBoard.pings");
const fromFlag = readPings({ flags: { "draw-steel-ghostwire": { wiredPings: { entries: [{ text: "flag", whisper: true, at: 2, user: "Dir" }] } } } });
ok(fromFlag.length === 1 && fromFlag[0].whisper, "readPings prefers wiredPings.entries");

const gm = { id: "gm1", isGM: true };
const alice = { id: "u1", isGM: false };
const bob = { id: "u2", isGM: false };
const overlayActor = { id: "a1", state: "overlay" };
const jackedActor = { id: "a2", state: "jackedIn" };
const meatActor = { id: "a3", state: "disconnected" };
const recips = whisperRecipientIds({
  users: [gm, alice, bob],
  tokens: [
    { actor: overlayActor },
    { actor: jackedActor },
    { actor: meatActor },
  ],
  getWiredState: actor => actor.state,
  canOwn: (actor, user) => (actor === overlayActor && user === alice) || (actor === jackedActor && user === bob) || (actor === meatActor && user === bob),
});
ok(recips.includes("gm1") && recips.includes("u1") && recips.includes("u2"), "whisper includes GM + Overlay/Jacked In owners");
ok(!whisperRecipientIds({
  users: [gm, alice],
  tokens: [{ actor: meatActor }],
  getWiredState: actor => actor.state,
  canOwn: () => true,
}).includes("u1"), "disconnected owners are not whispered");

const consoleSrc = readFileSync("scripts/wired-console.mjs", "utf8");
ok(consoleSrc.includes("sendPing") && consoleSrc.includes("wiredPings"), "Console sends and persists wiredPings");
ok(consoleSrc.includes("whisperRecipientIds") && consoleSrc.includes("readPings"), "Console reuses ping helpers");
ok(!consoleSrc.includes("gold-line-scene"), "Console does not import gold-line-scene");

const template = readFileSync("templates/wired-console.hbs", "utf8");
ok(template.includes("data-ping-text") && template.includes("data-action=\"sendPing\""), "Console template has GM Send");
ok(template.includes("wc-ping-log"), "Console template has event log");

const payloadUse = readFileSync("scripts/payload-use.mjs", "utf8");
ok(payloadUse.includes("resonance") && payloadUse.includes("wired-native") && payloadUse.includes("isBodyCompile"), "payload-use supports Technomancer body compile");
ok(payloadUse.includes("ensureWiredNativeHost"), "payload-use stamps Wired Native host catalog");

const whiteout = readBomFreeJson("src/packs/matrix/payloads/whiteout.json");
ok(whiteout.flags["draw-steel-ghostwire"].mod.hosts.includes("deck"), "whiteout still hosts deck");
ok(whiteout.flags["draw-steel-ghostwire"].mod.hosts.includes("resonance"), "whiteout hosts resonance");
ok(whiteout.flags["draw-steel-ghostwire"].mod.hosts.includes("body"), "whiteout hosts body");

const native = readBomFreeJson("src/packs/classes/technomancer/wired-native.json");
const nativeMatrix = native.flags["draw-steel-ghostwire"].matrix;
ok(nativeMatrix.modSlots === 2, "Wired Native has 2 mod slots");
ok(nativeMatrix.modFamily.includes("resonance") && nativeMatrix.modFamily.includes("body"), "Wired Native family is resonance/body");

const sabbat = readBomFreeJson("src/packs/pregens/sabbat-vane.json");
const sabbatWhiteout = sabbat.items.find(i => i.system?._dsid === "whiteout");
const sabbatNative = sabbat.items.find(i => i.system?._dsid === "wired-native");
ok(sabbatWhiteout?.system.quantity === 2, "Sabbat Whiteout quantity is 2");
ok(sabbatWhiteout?.flags["draw-steel-ghostwire"].mod.installedOn === sabbatNative?._id, "Sabbat Whiteout compiled on Wired Native");
ok(sabbatWhiteout?.flags["draw-steel-ghostwire"].mod.installedOn !== undefined
  && !sabbat.items.some(i => i.system?._dsid === "street-deck"), "Sabbat has no street deck");
ok(sabbatNative?.flags["draw-steel-ghostwire"].matrix?.modFamily?.includes("body"), "Sabbat Wired Native is a body host");

const kessic = readBomFreeJson("src/packs/pregens/kessic-draye.json");
const kessicWhiteout = kessic.items.find(i => i.system?._dsid === "whiteout");
ok(kessicWhiteout?.system.quantity === 2, "Kessic Whiteout quantity is still 2");
ok(kessicWhiteout?.flags["draw-steel-ghostwire"].mod.installedOn === "6XVXN8DuHNp3HkDH", "Kessic Whiteout still on Street Deck");

const otherPregens = ["wren-sable-corvin", "barak-voss-hallor", "kaes-vahn-estal", "vessa-corran-dov", "vira-kellis-nade"];
for (const slug of otherPregens) {
  let actor;
  try {
    actor = readBomFreeJson(`src/packs/pregens/${slug}.json`);
  } catch {
    continue;
  }
  ok(!actor.items?.some(i => i.system?._dsid === "whiteout"), `${slug} was not auto-granted Whiteout`);
}

const wire = readFileSync("docs/raw/21-the-wire.md", "utf8");
ok(/Wired Native/.test(wire) && /Technomancer/.test(wire), "21-the-wire.md notes Technomancer compile");
ok(readFileSync("docs/spikes/B105-WHITEOUT-PAYLOAD.md", "utf8").includes("B109"), "B105 has B109 addendum");
ok(readFileSync("docs/spikes/B109-TECHNOMANCER-DECKLESS-PAYLOADS.md", "utf8").includes("0.3.45"), "B109 spike exists");
ok(readFileSync("docs/spikes/B106-WIRED-CONSOLE-WIRE-PING.md", "utf8").includes("B106-GOLD-LINE-MAP-PACK"), "wire-ping spike keeps colliding filename note");

const lang = readBomFreeJson("lang/en.json");
ok(lang.GHOSTWIRE.WiredConsole.PingSend === "Send", "lang PingSend");
ok(lang.GHOSTWIRE.WiredConsole.PingWhisper.includes("Overlay"), "lang whisper option names Overlay / Jacked In");

if (failures.length) {
  console.error(`\n${failures.length} failure(s):`);
  for (const msg of failures) console.error(`  ✗ ${msg}`);
  process.exit(1);
}
console.log("\nAll B106 / B109 checks passed.");
