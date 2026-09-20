#!/usr/bin/env node
/**
 * B117 Matrix Verbs smoke — all nine on the node-facing applet (module 0.3.53).
 *
 * Run: node tools/b117-console-verbs-smoke.mjs
 * Does not need live Foundry. Does not write Scene JSON.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  CONSOLE_SLICE_DSIDS,
  MATRIX_VERB_DSIDS,
  MATRIX_VERB_IDS,
  MATRIX_VERBS,
  OFF_SHEET_DSIDS,
  SHEET_VERB_DSIDS,
  SHEET_VERBS,
} from "../scripts/wired-verbs.mjs";
import {
  CONSOLE_SLICE,
  abilityTierFromMessage,
  actorHasConnectInterface,
  consoleVerbGate,
  itemIsConnectInterface,
  nextAlert,
  pickConsoleActor,
  pickPlayerVerbActor,
  softTraceDelta,
} from "../scripts/wired-console-verbs.mjs";

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

const NINE = "matrix-connect,matrix-jack-out,matrix-toggle-connection-state,matrix-scan,matrix-navigate,matrix-ping,matrix-broadcast,matrix-search,matrix-read-write";

console.log("B117 all-nine node-facing Matrix Verbs smoke (0.3.53)\n");

const moduleJson = readBomFreeJson("module.json");
ok(moduleJson.version === "0.3.53", `module.json is 0.3.53 (got ${moduleJson.version})`);

const goldDiff = execFileSync("git", ["diff", "--", "scripts/gold-line-scene.mjs"], { encoding: "utf8" });
ok(!goldDiff.trim(), "scripts/gold-line-scene.mjs is unmodified");

console.log("\n1) Verb homes — all nine on the applet");
ok(MATRIX_VERB_IDS.length === 9 && MATRIX_VERBS.length === 9, "nine Matrix Verb UUIDs still exist");
ok(SHEET_VERB_DSIDS.length === 0 && SHEET_VERBS.length === 0, "no sheet verbs");
ok(CONSOLE_SLICE_DSIDS.join(",") === NINE, "applet slice is all nine in lock order");
ok(CONSOLE_SLICE.length === 9, "nine catalog rows");
ok(OFF_SHEET_DSIDS.join(",") === NINE, "all nine leave the sheet");

const byDsid = Object.fromEntries(CONSOLE_SLICE.map(v => [v.dsid, v]));
ok(byDsid["matrix-connect"].characteristic === "intuition" && byDsid["matrix-connect"].softTraceOnTier1, "Connect: intuition, soft Trace");
ok(byDsid["matrix-jack-out"].characteristic === "intuition", "Jack Out: intuition");
ok(byDsid["matrix-toggle-connection-state"].characteristic == null && !byDsid["matrix-toggle-connection-state"].needsNode, "Toggle: no roll, no node");
ok(byDsid["matrix-scan"].characteristic === "intuition" && !byDsid["matrix-scan"].softTraceOnTier1, "Scan: intuition, no auto Trace");
ok(byDsid["matrix-navigate"].characteristic === "intuition" && byDsid["matrix-navigate"].softTraceOnTier1, "Navigate: intuition, soft Trace");
ok(byDsid["matrix-ping"].characteristic === "reason" && byDsid["matrix-ping"].softTraceOnTier1, "Ping: reason, soft Trace");
ok(byDsid["matrix-broadcast"].characteristic == null, "Broadcast: no roll");
ok(byDsid["matrix-search"].characteristic === "reason" && byDsid["matrix-search"].softTraceOnTier1, "Search: reason, soft Trace");
ok(byDsid["matrix-read-write"].characteristic === "reason" && byDsid["matrix-read-write"].softTraceOnTier1, "Read/Write: reason, soft Trace");

const scan = readBomFreeJson("src/packs/abilities/matrix-verbs/scan.json");
const ping = readBomFreeJson("src/packs/abilities/matrix-verbs/ping.json");
const navigate = readBomFreeJson("src/packs/abilities/matrix-verbs/navigate.json");
ok(scan.system.power.roll.characteristics[0] === "intuition", "Scan card intuition");
ok(navigate.system.power.roll.characteristics[0] === "intuition", "Navigate card intuition");
ok(ping.system.power.roll.characteristics[0] === "reason", "Ping card reason");

console.log("\n2) Gate / actor pick / soft Trace (pure)");
const roster = [
  { uuid: "Actor.a", connected: false },
  { uuid: "Actor.b", connected: true },
  { uuid: "Actor.c", connected: true },
];
ok(pickConsoleActor({ roster, selectedUuid: "Actor.c" }) === "Actor.c", "keeps a live roster selection");
ok(pickConsoleActor({ roster: [] }) === null, "empty roster is null");

const players = [
  { uuid: "Actor.disc", connected: false, owned: true },
  { uuid: "Actor.me", connected: true, owned: true },
];
ok(pickPlayerVerbActor({ candidates: players, controlledUuid: "Actor.disc" }) === "Actor.me", "prefers Connected over controlled disconnected");
ok(pickPlayerVerbActor({ candidates: [{ uuid: "Actor.disc", connected: false, owned: true }] }) === "Actor.disc", "falls back to disconnected so Connect can run");

ok(!consoleVerbGate({}).ok && consoleVerbGate({}).reason === "Actor", "no actor");
ok(consoleVerbGate({ actorUuid: "Actor.b", owned: false, nodeId: "n1", connected: true, dsid: "matrix-scan" }).reason === "Owner", "not owner");
ok(consoleVerbGate({ actorUuid: "Actor.b", owned: true, connected: true, dsid: "matrix-scan" }).reason === "Node", "Scan needs a node");
ok(consoleVerbGate({ actorUuid: "Actor.b", owned: true, connected: false, dsid: "matrix-connect", hasInterface: true }).ok, "Connect works while Disconnected without a node");
ok(consoleVerbGate({ actorUuid: "Actor.b", owned: true, connected: false, dsid: "matrix-connect", hasInterface: false }).reason === "Interface", "Connect needs a Wire interface");
ok(consoleVerbGate({ actorUuid: "Actor.b", owned: true, connected: true, dsid: "matrix-connect", hasInterface: true }).reason === "AlreadyConnected", "Connect disabled while already connected");
ok(consoleVerbGate({ actorUuid: "Actor.b", owned: true, connected: false, nodeId: "n1", dsid: "matrix-scan" }).reason === "Disconnected", "Scan while Disconnected");
ok(consoleVerbGate({ actorUuid: "Actor.b", owned: true, nodeId: "n1", connected: true, revealed: false, isGM: false, dsid: "matrix-scan" }).reason === "Hidden", "player cannot fire on a hidden node");
ok(consoleVerbGate({ actorUuid: "Actor.b", owned: true, nodeId: "n1", connected: true, dsid: "matrix-broadcast" }).ok, "Broadcast while Connected + node");
ok(consoleVerbGate({ actorUuid: "Actor.b", owned: true, connected: true, dsid: "matrix-jack-out" }).ok, "Jack Out needs Connected, not a node");

ok(softTraceDelta("matrix-scan", 1) === 0, "Scan tier1 does not raise Trace");
ok(softTraceDelta("matrix-connect", 1) === 1, "Connect tier1 +1 Trace");
ok(softTraceDelta("matrix-search", 1) === 1, "Search tier1 +1 Trace");
ok(softTraceDelta("matrix-read-write", 1) === 1, "Read/Write tier1 +1 Trace");
ok(softTraceDelta("matrix-broadcast", 1) === 0, "Broadcast no auto Trace");
ok(softTraceDelta("matrix-ping", 2) === 0, "middle never raises Trace");
ok(nextAlert(11, 1).lockout, "Trace 11+1 lockout");
ok(abilityTierFromMessage({ system: { parts: [{ type: "abilityResult", tier: 1 }] } }) === 1, "parses abilityResult tier");

console.log("\n3) Node panel / Console / kit / defaultItems / packs");
const consoleSrc = readFileSync("scripts/wired-console.mjs", "utf8");
ok(consoleSrc.includes("useConsoleVerb") && consoleSrc.includes("verbStripView"), "shared fire + strip");
ok(consoleSrc.includes("hasInterface") && consoleSrc.includes("actorHasConnectInterface"), "Console passes Connect interface into the gate");
ok(consoleSrc.includes("VerbNeed${gate.reason}"), "Console warns with gate reason");
ok(!consoleSrc.includes("gold-line-scene"), "Console does not import gold-line-scene");

const nodeSrc = readFileSync("scripts/wired-node-verbs.mjs", "utf8");
ok(nodeSrc.includes("useConsoleVerb") && nodeSrc.includes("pickPlayerVerbActor"), "node panel shares fire path");
ok(nodeSrc.includes("hasInterface") && nodeSrc.includes("actorHasConnectInterface"), "node panel passes Connect interface");
ok(nodeSrc.includes("openWiredNodePanel"), "node panel opens");
const nodeTpl = readFileSync("templates/wired-node-panel.hbs", "utf8");
ok(nodeTpl.includes("data-action=\"fireVerb\"") && nodeTpl.includes("{{#each verbs}}"), "node panel has the verb strip");
ok(!nodeTpl.includes("laterHint"), "node panel does not say verbs come later");

const moduleSrc = readFileSync("scripts/module.mjs", "utf8");
ok(moduleSrc.includes("matrixVerbsApplet") && moduleSrc.includes("MATRIX_VERB_DSIDS"), "world strip uses matrixVerbsApplet + all nine dsids");
ok(moduleSrc.includes("defaultItems.delete") && moduleSrc.includes("MATRIX_VERBS"), "defaultItems deletes Matrix Verbs");
ok(!/defaultItems\.add\(uuid\)/.test(moduleSrc) && !/for \(const uuid of SHEET_VERBS\)/.test(moduleSrc), "defaultItems does not add Matrix Verbs");
ok(moduleSrc.includes("NeedInterface") && moduleSrc.includes("actorHasConnectInterface"), "AbilityModel#use also gates Connect on interface");

const kitSrc = readFileSync("scripts/wired-kit.mjs", "utf8");
ok(kitSrc.includes("grantMatrixVerbs") && kitSrc.includes("return 0"), "Wire Kit grant is a no-op");
ok(!kitSrc.includes("SHEET_VERBS"), "Wire Kit does not stamp sheet verbs");
ok(!/fromUuid\(uuid\)/.test(kitSrc), "Wire Kit does not copy verb documents onto the actor");

const mama = JSON.stringify(readBomFreeJson("src/packs/bestiary/reach-streets/mama-cassavir.json"));
ok(!MATRIX_VERB_DSIDS.some(d => mama.includes(`"${d}"`)), "Mama Cassavir has none of the nine Matrix Verbs");

const pregenDir = "src/packs/pregens";
const pregenFiles = readdirSync(pregenDir).filter(f => f.endsWith(".json"));
ok(pregenFiles.length >= 7, `pregen pack has actors (${pregenFiles.length})`);
let pregenHits = 0;
for (const file of pregenFiles) {
  const text = readFileSync(join(pregenDir, file), "utf8");
  for (const dsid of MATRIX_VERB_DSIDS) if (text.includes(`"${dsid}"`)) pregenHits += 1;
}
ok(pregenHits === 0, "pregen actors do not embed Matrix Verbs");

function walkJson(dir) {
  const out = [];
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, name.name);
    if (name.isDirectory()) out.push(...walkJson(path));
    else if (name.name.endsWith(".json")) out.push(path);
  }
  return out;
}
const taggedDsids = new Set();
for (const path of walkJson("src/packs")) {
  const text = readFileSync(path, "utf8");
  if (!text.includes('"connectInterface": true')) continue;
  const json = JSON.parse(text);
  if (json.system?._dsid) taggedDsids.add(json.system._dsid);
}
const requiredTags = [
  "burner", "commlink", "pocket-sec", "ghost-relay", "corp-blacklink",
  "scrapdeck", "street-deck", "blackdeck", "ghostbox", "fairlight-ghost",
  "fleet-deck",
  "datajack", "datajack-soft", "datajack-dongle", "trode-net", "hot-sim-module",
  "nyx-switchblade", "ferrum-padlock-6", "meridian-lookout",
];
ok(requiredTags.every(d => taggedDsids.has(d)), `connectInterface tags (${[...taggedDsids].sort().join(",")})`);
ok(!taggedDsids.has("spoof-kit"), "Spoof Kit is not a Connect interface");
const commlink = readBomFreeJson("src/packs/gear/general/comms/commlink.json");
ok(commlink.system._dsid === "commlink" && commlink.flags["draw-steel-ghostwire"].wired.connectInterface, "street Commlink SKU");
ok(itemIsConnectInterface(commlink), "itemIsConnectInterface sees Commlink");
ok(actorHasConnectInterface({ items: [commlink] }), "actor with Commlink can Connect");
ok(!actorHasConnectInterface({ items: [] }), "empty actor cannot Connect");
ok(actorHasConnectInterface({ classDsid: "technomancer", items: [] }), "Technomancer Connects deckless");
ok(!actorHasConnectInterface({ classDsid: "hacker", items: [] }), "Hacker still needs a deck or comms");

const css = readFileSync("styles/ghostwire.css", "utf8");
ok(css.includes(".wc-verb-strip") && css.includes(".ghostwire-wired-node-panel"), "CSS for verb strip + node panel");

console.log("\n4) Docs / lang");
const lang = readBomFreeJson("lang/en.json");
ok(lang.GHOSTWIRE.WiredConsole.Verbs === "Matrix Verbs", "lang Verbs");
ok(lang.GHOSTWIRE.WiredConsole.VerbNeedDisconnected.includes("Connect"), "lang Disconnected points at Connect on the node");
ok(!lang.GHOSTWIRE.WiredConsole.VerbNeedDisconnected.includes("sheet"), "lang Disconnected does not send players to the sheet");
ok(lang.GHOSTWIRE.WiredConsole.VerbNeedAlreadyConnected.includes("connected"), "lang AlreadyConnected");
ok(lang.GHOSTWIRE.WiredConsole.VerbTooltipAuto.includes("no roll"), "lang auto tooltip");
ok(lang.GHOSTWIRE.Wired.ConsoleMigrated.includes("all nine") || lang.GHOSTWIRE.Wired.ConsoleMigrated.includes("nine"), "lang migration names all nine");
ok(lang.GHOSTWIRE.WiredConsole.VerbNeedInterface.includes("Technomancer"), "lang Interface names Technomancer");
ok(lang.GHOSTWIRE.Wired.Warnings.NeedInterface.includes("comlink"), "lang Wired NeedInterface");
ok(lang.GHOSTWIRE.Gear.Items.Commlink.Name === "Commlink", "lang street Commlink");
ok(lang.GHOSTWIRE.Matrix.Items.WireKit.Description.includes("does <strong>not</strong> copy") || lang.GHOSTWIRE.Matrix.Items.WireKit.Description.includes("does not"), "Wire Kit does not copy verbs");
ok(lang.GHOSTWIRE.Matrix.Items.WireKit.Description.includes("Read/Write"), "Wire Kit description names all nine");

const spike = readFileSync("docs/spikes/B117-CONSOLE-MATRIX-VERBS.md", "utf8");
ok(/LOCKED 2026-09-20/.test(spike) && /0\.3\.53/.test(spike), "spike is locked and names 0.3.53");
ok(/all nine|all 9/.test(spike) && /Mama/.test(spike) && /defaultItems/.test(spike) && /Wire Kit/.test(spike), "spike locks all 9 on applet and sheet cleanup");
ok(/pregens/i.test(spike), "spike names pregens");
ok(/Anyone vs Hacker vs Technomancer/.test(spike) && /Padlock-6/.test(spike), "spike documents anyone vs Hacker vs Technomancer");
ok(/connectInterface/.test(spike) && /Commlink/.test(spike) && /Technomancer/.test(spike), "spike documents Connect interface allow-list");
ok(/No new/.test(spike) && /everyone gets Programs/.test(spike), "spike refuses everyone-gets-Programs");
const foundry = readFileSync("docs/rulebook/18-wired-foundry.md", "utf8");
ok(/all nine/.test(foundry) && /Mama/.test(foundry), "18-wired-foundry.md names all nine + Mama strip");
ok(/Technomancer/.test(foundry) && /Commlink/.test(foundry), "Foundry notes name Connect interface");
ok(!/Sheet keeps/.test(foundry), "Foundry notes no longer keep verbs on the sheet");
const raw = readFileSync("docs/raw/21-the-wire.md", "utf8");
ok(/all nine Matrix Verbs/.test(raw) && /Read\/Write/.test(raw), "Wire RAW aside names all nine");
ok(!/stay on the sheet/.test(raw), "Wire RAW no longer parks Connect on the sheet");
ok(/0\.3\.53/.test(readFileSync("README.md", "utf8")) && /all nine/i.test(readFileSync("README.md", "utf8")), "README changelog 0.3.53 all nine");

const journal = readBomFreeJson("src/packs/rulebook/ghostwire-systems/21-the-wire.json");
const overview = journal.pages?.find(p => /Scan/.test(p.text?.markdown ?? "") && /Wired Console/.test(p.text?.markdown ?? ""));
ok(!!overview, "Wire journal still has a Wired Console aside");
ok(/all nine Matrix Verbs/.test(overview?.text?.markdown ?? ""), "Wire journal aside names all nine");

if (failures.length) {
  console.error(`\n${failures.length} failure(s):`);
  for (const msg of failures) console.error(`  ✗ ${msg}`);
  process.exit(1);
}
console.log("\nB117 all-nine node-facing Matrix Verbs smoke OK");
