#!/usr/bin/env node
/**
 * B117 Matrix Verbs smoke — all nine on the node-facing applet (shipped 0.3.53; fire path 0.3.61).
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
  DS_HIDE_IN_SHEET,
  DS_SYSTEM_ID,
  TEMP_CONSOLE_VERB_FLAG,
  abilityTierFromMessage,
  abilityUuidsFromMessages,
  actorHasConnectInterface,
  consoleVerbGate,
  filterOffSheetAbilitiesContext,
  hasHideInSheetFlag,
  isOffSheetMatrixVerb,
  isTemporaryConsoleVerb,
  itemIsConnectInterface,
  leftoverTemporaryVerbs,
  markTemporaryConsoleVerbData,
  nextAlert,
  offSheetVerbDomSelectors,
  orphanTemporaryVerbs,
  consoleRosterWireState,
  consoleVerbRoster,
  pickConsoleActor,
  pickPlayerVerbActor,
  RIGGER_INTERFACE_DSIDS,
  shouldReleaseTemporaryVerb,
  softTraceDelta,
  sortConsoleNodes,
  sortConsoleRoster,
  splitReusableTemporaryVerbs,
  verbUseMessageOptions,
} from "../scripts/wired-console-verbs.mjs";
import { isNodeActor } from "../scripts/wired-node-tokens.mjs";
import { abilityPowerRollModifiers } from "../scripts/wired-state.mjs";

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

console.log("B117 all-nine node-facing Matrix Verbs smoke (0.3.64)\n");

const moduleJson = readBomFreeJson("module.json");
ok((() => {
  const [maj, min, pat] = String(moduleJson.version).split(".").map(Number);
  return maj === 0 && min === 3 && pat >= 64;
})(), `module.json is 0.3.64+ (got ${moduleJson.version})`);

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

const nodeChip = consoleRosterWireState({ isNode: true, runnerState: "disconnected" });
ok(nodeChip.state === "connected" && nodeChip.connected && nodeChip.verbSelectable === false, "node Actors chip as Connected, not a verb runner");
ok(consoleRosterWireState({ isNode: false, runnerState: "disconnected" }).state === "disconnected", "runners still show Disconnected");
ok(consoleRosterWireState({ isNode: false, runnerState: "linked" }).connected, "Linked runners are connected");

const mixed = [
  { uuid: "Actor.hotel", connected: true, isNode: true, verbSelectable: false },
  { uuid: "Actor.disc", connected: false },
  { uuid: "Actor.runner", connected: true },
];
ok(pickConsoleActor({ roster: mixed }) === "Actor.runner", "skips Connected node Actors when picking the verb runner");
ok(pickConsoleActor({ roster: mixed, selectedUuid: "Actor.hotel" }) === "Actor.runner", "stale node selection falls back to a runner");
ok(pickConsoleActor({ roster: mixed.filter(r => r.isNode) }) === null, "nodes-only roster has no verb actor");
ok(consoleVerbRoster(mixed).every(row => !row.isNode), "verb roster excludes nodes");
ok(isNodeActor({ flags: { "draw-steel-ghostwire": { kind: "node" } } }), "isNodeActor reads flags.kind node");
ok(!isNodeActor({ flags: { "draw-steel-ghostwire": { kind: "kiosk" } } }), "kiosk is not a Wire node");

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
ok(!consoleSrc.includes("new CONFIG.Item.documentClass"), "resolveVerbItem does not construct ephemeral Items");
ok(consoleSrc.includes("createEmbeddedDocuments") && consoleSrc.includes("deleteEmbeddedDocuments"), "temporary embed for AbilityModel#use");
ok(consoleSrc.includes("shouldReleaseTemporaryVerb") && consoleSrc.includes("releaseTemporaryVerbItem"), "release is gated so chat cards keep abilityUuid");
ok(!consoleSrc.includes("if (acquired.ephemeral) await releaseTemporaryVerbItem"), "does not always delete the temp after use");
ok(consoleSrc.includes("splitReusableTemporaryVerbs"), "reuses leftover temps of the same verb");
ok(consoleSrc.includes("verbUseMessageOptions"), "use() gets DS 1.1.2 messageOptions.data flags");
ok(consoleSrc.includes("render: false"), "temp embed does not force a sheet redraw");
ok(consoleSrc.includes("hideTemporaryConsoleVerbs"), "hides in-flight temps on the hero/NPC sheet");
ok(/filter\(\s*item\s*=>\s*isOffSheetMatrixVerb\(\s*item\s*\)\s*\)/.test(consoleSrc), "sheet hide wraps item => isOffSheetMatrixVerb(item)");
ok(!/\.filter\(\s*isOffSheetMatrixVerb\s*\)/.test(consoleSrc), "sheet hide does not pass isOffSheetMatrixVerb bare to filter");
ok(consoleSrc.includes("data-document-uuid"), "sheet hide matches DS data-document-uuid");
ok(consoleSrc.includes("filterOffSheetAbilitiesContext") && consoleSrc.includes("patchSheetHideMatrixVerbs"), "wraps DS _prepareAbilitiesContext");
ok(consoleSrc.includes("renderActorSheetV2") && consoleSrc.includes("renderDrawSteelRetainerSheet"), "sheet hide hooks AppV2 + retainer fallback");
ok(consoleSrc.includes("sortConsoleNodes") && consoleSrc.includes("sortConsoleRoster"), "Console sorts nodes + Connections");
ok(consoleSrc.includes("ensureTempHiddenOnSheet") && consoleSrc.includes("hideInSheet"), "temps stamp DS hideInSheet");
ok(consoleSrc.includes("consoleRosterWireState") && consoleSrc.includes("isNodeActor"), "roster chips node Actors as Connected");
ok(/if \(isNodeActor\(actor\)(?:\s*\|\|\s*isConstructActor\(actor\))?\)/.test(consoleSrc), "useConsoleVerb refuses a node actor");
ok(/dataset.isNode === "true"/.test(consoleSrc), "node roster click does not become the verb actor");

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
ok(moduleSrc.includes("abilityPowerRollModifiers"), "Wired use patch uses shared modifier helper");
ok(moduleSrc.includes("isTemporaryConsoleVerb"), "ready hook strips leftover temporary verbs");
ok(/filter\(\s*item\s*=>\s*isTemporaryConsoleVerb\(\s*item\s*\)\s*\)/.test(moduleSrc), "ready leftover strip wraps item => isTemporaryConsoleVerb(item)");
ok(!/\.filter\(\s*isTemporaryConsoleVerb\s*\)/.test(moduleSrc), "ready hook does not pass isTemporaryConsoleVerb bare to filter");
ok(moduleSrc.includes("orphanTemporaryVerbs") && moduleSrc.includes("abilityUuidsFromMessages"), "ready keeps temps backing chat abilityUuid");
ok(moduleSrc.includes("hideInSheet"), "ready stamps hideInSheet on chat-backed temps");

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
  "wire-kit-matrix-verbs",
  "remote-box", "fleet-deck", "war-table", "command-rig", "hydra-console",
  "riggers-harness",
];
ok(requiredTags.every(d => taggedDsids.has(d)), `connectInterface tags (${[...taggedDsids].sort().join(",")})`);
ok(!taggedDsids.has("spoof-kit"), "Spoof Kit is not a Connect interface");
ok(!taggedDsids.has("fabricators-bench") && !taggedDsids.has("field-chassis"), "Fabricator's Bench and Field Chassis are not Connect interfaces");
ok(!taggedDsids.has("neural-snap-shot"), "Neural Snap Shot signature is not a Connect interface");
const commlink = readBomFreeJson("src/packs/gear/general/comms/commlink.json");
ok(commlink.system._dsid === "commlink" && commlink.flags["draw-steel-ghostwire"].wired.connectInterface, "street Commlink SKU");
ok(itemIsConnectInterface(commlink), "itemIsConnectInterface sees Commlink");
ok(actorHasConnectInterface({ items: [commlink] }), "actor with Commlink can Connect");
ok(!actorHasConnectInterface({ items: [] }), "empty actor cannot Connect");
ok(actorHasConnectInterface({ classDsid: "technomancer", items: [] }), "Technomancer Connects deckless");
ok(!actorHasConnectInterface({ classDsid: "hacker", items: [] }), "Hacker still needs a deck or comms");

const kit = readBomFreeJson("src/packs/matrix/support/wire-kit-matrix-verbs.json");
ok(kit.system._dsid === "wire-kit-matrix-verbs" && kit.flags["draw-steel-ghostwire"].kind === "wire-kit", "Wire Kit pack kind/dsid");
ok(kit.flags["draw-steel-ghostwire"].wired.connectInterface === true, "Wire Kit pack stamps connectInterface");
ok(itemIsConnectInterface(kit), "itemIsConnectInterface sees pack Wire Kit");
ok(actorHasConnectInterface({ items: [kit] }), "actor with pack Wire Kit can Connect");
const worldKit = {
  name: "Wire Kit — Matrix Verbs",
  type: "feature",
  system: { _dsid: "wire-kit-matrix-verbs" },
  flags: { "draw-steel-ghostwire": { kind: "wire-kit", dsid: "wire-kit-matrix-verbs" } },
};
ok(!worldKit.flags["draw-steel-ghostwire"].wired, "pre-0.3.68 world copies have kind only");
ok(itemIsConnectInterface(worldKit), "kind/dsid Wire Kit is a Connect interface without connectInterface stamp");
ok(actorHasConnectInterface({ items: [worldKit] }), "drone with untagged Wire Kit can Connect");
ok(itemIsConnectInterface({ system: { _dsid: "wire-kit-matrix-verbs" }, flags: {} }), "_dsid wire-kit-matrix-verbs is enough");
ok(itemIsConnectInterface({ flags: { "draw-steel-ghostwire": { kind: "wire-kit" } } }), "kind wire-kit is enough");
ok(itemIsConnectInterface({ flags: { "draw-steel-ghostwire": { matrix: { role: "rcc" } } } }), "RCC role still counts (not required for Wire Kit drones)");
ok(!itemIsConnectInterface({ flags: { "draw-steel-ghostwire": { kind: "spoof-kit" } } }), "spoof-kit kind is not an interface");
ok(consoleVerbGate({ actorUuid: "Actor.drone", owned: true, connected: false, dsid: "matrix-connect", hasInterface: actorHasConnectInterface({ items: [worldKit] }) }).ok, "drone with Wire Kit: Connect gate opens");

const harness = readBomFreeJson("src/packs/kits/tech/riggers-harness.json");
ok(harness.system._dsid === "riggers-harness" && harness.flags["draw-steel-ghostwire"].wired.connectInterface, "Rigger's Harness stamps connectInterface");
ok(harness.flags["draw-steel-ghostwire"].matrix.role === "rcc", "Rigger's Harness matrix role is rcc (≡ deck)");
ok(itemIsConnectInterface(harness), "itemIsConnectInterface sees Rigger's Harness");
ok(actorHasConnectInterface({ items: [harness] }), "Wrench with Rigger's Harness can Connect");
ok(itemIsConnectInterface({ system: { _dsid: "riggers-harness" }, flags: {} }), "riggers-harness dsid is enough without flags");
ok(!itemIsConnectInterface(readBomFreeJson("src/packs/kits/tech/fabricators-bench.json")), "Fabricator's Bench tool rig is not a Connect interface");
ok(!itemIsConnectInterface(readBomFreeJson("src/packs/kits/tech/field-chassis.json")), "Field Chassis turret tablet is not a Connect interface");
ok(!itemIsConnectInterface(readBomFreeJson("src/packs/kits/tech/riggers-harness-signature-ability.json")), "Neural Snap Shot is a strike, not an interface");
const commandRig = readBomFreeJson("src/packs/matrix/rccs/command-rig.json");
ok(commandRig.flags["draw-steel-ghostwire"].matrix.role === "rcc" && commandRig.flags["draw-steel-ghostwire"].wired.connectInterface, "Command Rig RCC is a Connect interface");
ok(itemIsConnectInterface(commandRig), "itemIsConnectInterface sees Command Rig");
ok(itemIsConnectInterface({ flags: { "draw-steel-ghostwire": { matrix: { modFamily: ["rcc"] } } } }), "matrix modFamily rcc is a Connect interface");
ok(["remote-box", "fleet-deck", "war-table", "command-rig", "hydra-console", "riggers-harness"].every(d => RIGGER_INTERFACE_DSIDS.has(d)), "RIGGER_INTERFACE_DSIDS covers Rigger's Harness + RCC SKUs");
ok(!RIGGER_INTERFACE_DSIDS.has("fabricators-bench") && !RIGGER_INTERFACE_DSIDS.has("field-chassis"), "workshop/turret kits are not in RIGGER_INTERFACE_DSIDS");
const cocoon = readBomFreeJson("src/packs/mods/vehicles/rigger-cocoon.json");
ok(!itemIsConnectInterface(cocoon), "Rigger Cocoon vehicle mod is not a Connect interface");

const css = readFileSync("styles/ghostwire.css", "utf8");
ok(css.includes(".wc-verb-strip") && css.includes(".ghostwire-wired-node-panel"), "CSS for verb strip + node panel");
ok(css.includes("ghostwire-off-sheet-verb"), "CSS hides off-sheet Matrix Verb rows");

console.log("\n4) Docs / lang");
const lang = readBomFreeJson("lang/en.json");
ok(lang.GHOSTWIRE.WiredConsole.Verbs === "Matrix Verbs", "lang Verbs");
ok(lang.GHOSTWIRE.Wired.States.connected === "Connected", "lang node chip reads Connected");
ok(/always Connected/.test(lang.GHOSTWIRE.WiredConsole.RosterNodeHint), "lang node row hint");
ok(lang.GHOSTWIRE.WiredConsole.VerbNeedDisconnected.includes("Connect"), "lang Disconnected points at Connect on the node");
ok(!lang.GHOSTWIRE.WiredConsole.VerbNeedDisconnected.includes("sheet"), "lang Disconnected does not send players to the sheet");
ok(/connected|on-net/.test(lang.GHOSTWIRE.WiredConsole.VerbNeedAlreadyConnected), "lang AlreadyConnected");
ok(lang.GHOSTWIRE.WiredConsole.VerbTooltipAuto.includes("no roll"), "lang auto tooltip");
ok(lang.GHOSTWIRE.Wired.ConsoleMigrated.includes("all nine") || lang.GHOSTWIRE.Wired.ConsoleMigrated.includes("nine"), "lang migration names all nine");
ok(lang.GHOSTWIRE.WiredConsole.VerbNeedInterface.includes("Technomancer"), "lang Interface names Technomancer");
ok(lang.GHOSTWIRE.WiredConsole.VerbNeedInterface.includes("rigger"), "lang Interface names rigger interface");
ok(lang.GHOSTWIRE.Wired.Warnings.NeedInterface.includes("comlink"), "lang Wired NeedInterface");
ok(lang.GHOSTWIRE.WiredKit.DroneMigrated.includes("Disconnected") || lang.GHOSTWIRE.WiredKit.DroneMigrated.includes("Connect"), "lang drone migration does not auto-Overlay");
ok(lang.GHOSTWIRE.Gear.Items.Commlink.Name === "Commlink", "lang street Commlink");
ok(lang.GHOSTWIRE.Matrix.Items.WireKit.Description.includes("does <strong>not</strong> copy") || lang.GHOSTWIRE.Matrix.Items.WireKit.Description.includes("does not"), "Wire Kit does not copy verbs");
ok(lang.GHOSTWIRE.Matrix.Items.WireKit.Description.includes("Read/Write"), "Wire Kit description names all nine");
ok(/Connect interface/.test(lang.GHOSTWIRE.Matrix.Items.WireKit.Description), "Wire Kit description names Connect interface");

const spike = readFileSync("docs/spikes/B117-CONSOLE-MATRIX-VERBS.md", "utf8");
ok(/LOCKED 2026-09-20/.test(spike) && /0\.3\.53/.test(spike), "spike is locked and names 0.3.53");
ok(/all nine|all 9/.test(spike) && /Mama/.test(spike) && /defaultItems/.test(spike) && /Wire Kit/.test(spike), "spike locks all 9 on applet and sheet cleanup");
ok(/pregens/i.test(spike), "spike names pregens");
ok(/Anyone vs Hacker vs Technomancer/.test(spike) && /Padlock-6/.test(spike), "spike documents anyone vs Hacker vs Technomancer");
ok(/connectInterface/.test(spike) && /Commlink/.test(spike) && /Technomancer/.test(spike) && /Wire Kit/.test(spike), "spike documents Connect interface allow-list");
ok(/kind: "wire-kit"|wire-kit-matrix-verbs/.test(spike) && /0\.3\.68/.test(spike), "spike names Wire Kit as Connect interface (0.3.68)");
ok(/Rigger.?s Harness/.test(spike) && /RCC/.test(spike) && /Wrench drone control/.test(spike), "spike documents Wrench drone control (RCC or Rigger's Harness)");
ok(/Rigger/.test(spike) && /≡ deck|== deck|counts as a deck|counts as a Connect interface/.test(spike), "spike documents Rigger interface ≡ deck");
ok(/No new/.test(spike) && /everyone gets Programs/.test(spike), "spike refuses everyone-gets-Programs");
const foundry = readFileSync("docs/rulebook/18-wired-foundry.md", "utf8");
ok(/all nine/.test(foundry) && /Mama/.test(foundry), "18-wired-foundry.md names all nine + Mama strip");
ok(/Technomancer/.test(foundry) && /Commlink/.test(foundry) && /Wire Kit/.test(foundry), "Foundry notes name Connect interface");
ok(/0\.3\.68/.test(foundry) && /Wire Kit/.test(foundry), "Foundry notes name 0.3.68 Wire Kit interface");
ok(/Rigger/.test(foundry) && /pack drone/.test(foundry) && /vehicle/.test(foundry), "Foundry notes name Rigger interface + pack drones and vehicles");
ok(/Mule-Bot|cargo-hauler|cargo plate/.test(foundry), "Foundry notes name Mule-Bot cargo plate");
ok(/kind: "node"/.test(foundry) && /always chip \*\*Connected\*\*/.test(foundry), "Foundry notes: node Actors always Connected");
ok(/revealed first/.test(foundry) && /A–Z|A-Z/.test(foundry), "Foundry notes: revealed-first then A–Z lists");
ok(/hideInSheet/.test(foundry) && /data-document-uuid/.test(foundry), "Foundry notes: 0.3.64 sheet hide path");
ok(/0\.3\.64/.test(foundry), "Foundry notes name 0.3.64");
ok(/0\.3\.66/.test(foundry) && /Flag scope/.test(foundry), "Foundry notes name 0.3.66 Flag scope harden");
ok(!/Sheet keeps/.test(foundry), "Foundry notes no longer keep verbs on the sheet");
const raw = readFileSync("docs/raw/21-the-wire.md", "utf8");
ok(/all nine Matrix Verbs/.test(raw) && /Read\/Write/.test(raw), "Wire RAW aside names all nine");
ok(!/stay on the sheet/.test(raw), "Wire RAW no longer parks Connect on the sheet");
ok(/Wire Kit/.test(raw) && /Rigger.?s Harness/.test(raw) && /Pack drones and vehicles/.test(raw), "Wire RAW names Wire Kit, Rigger's Harness, pack drones and vehicles as Connect");
ok(/### Wire interface/.test(raw), "Wire RAW has a Wire interface (Connect) section");
ok(/0\.3\.53/.test(readFileSync("README.md", "utf8")) && /all nine/i.test(readFileSync("README.md", "utf8")), "README changelog 0.3.53 all nine");

const journal = readBomFreeJson("src/packs/rulebook/ghostwire-systems/21-the-wire.json");
const overview = journal.pages?.find(p => /Scan/.test(p.text?.markdown ?? "") && /Wired Console/.test(p.text?.markdown ?? ""));
ok(!!overview, "Wire journal still has a Wired Console aside");
ok(/all nine Matrix Verbs/.test(overview?.text?.markdown ?? ""), "Wire journal aside names all nine");
ok(/Wire Kit/.test(journal.pages?.map(p => p.text?.markdown ?? "").join("\n") ?? "") && /Rigger/.test(journal.pages?.map(p => p.text?.markdown ?? "").join("\n") ?? ""), "Wire journal names Wire Kit + Rigger interface");

console.log("\n5) resolveVerbItem + use path (0.3.60 / 0.3.61)");
const stamped = markTemporaryConsoleVerbData({
  _id: "keepMeNot",
  folder: "folderId",
  name: "Search",
  type: "ability",
  flags: { other: { x: 1 } },
  system: { _dsid: "matrix-search" },
});
ok(!stamped._id && !stamped.folder, "temp verb data drops _id and folder");
ok(stamped.flags["draw-steel-ghostwire"]?.[TEMP_CONSOLE_VERB_FLAG] === true, "temp flag is set");
ok(stamped.flags.other?.x === 1, "unrelated flags are preserved");
ok(stamped.flags[DS_SYSTEM_ID]?.[DS_HIDE_IN_SHEET] === true, "temp data stamps DS hideInSheet");
ok(hasHideInSheetFlag(stamped), "hasHideInSheetFlag reads stamped data");
ok(isOffSheetMatrixVerb(stamped) && isOffSheetMatrixVerb({ system: { _dsid: "matrix-ping" } }), "temps and all nine dsids are off-sheet");
ok(!isOffSheetMatrixVerb({ system: { _dsid: "seize-control" } }), "Hacker Programs stay on-sheet");

const msgOpts = verbUseMessageOptions({ dsid: "matrix-search", nodeId: "n1" });
ok(msgOpts.data?.flags?.["draw-steel-ghostwire"]?.consoleVerb?.dsid === "matrix-search", "messageOptions.data carries consoleVerb");
ok(!Object.hasOwn(msgOpts, "flags"), "does not put flags on the create-operation options");

const overlaySearch = abilityPowerRollModifiers({ wired: true, hasHacking: true, softwareEdges: 0, state: "overlay" });
ok(overlaySearch.edges === 1 && overlaySearch.banes === 0, "Overlay Search: Hacking edge, no Overlay meat bane");
const jackedSearch = abilityPowerRollModifiers({ wired: true, hasHacking: true, softwareEdges: 1, state: "jackedIn" });
ok(jackedSearch.edges === 3 && jackedSearch.banes === 0, "Jacked In Search: Hacking + Jacked In + Reader");
const overlayMeat = abilityPowerRollModifiers({ wired: false, hasHacking: true, state: "overlay" });
ok(overlayMeat.edges === 0 && overlayMeat.banes === 1, "Overlay meat bane only on non-Wired rolls");
const linkedWired = abilityPowerRollModifiers({ wired: true, hasHacking: false, state: "linked" });
ok(linkedWired.edges === 0 && linkedWired.banes === 0, "Linked Wired rolls add neither edge nor bane");

ok(!shouldReleaseTemporaryVerb({ created: true, hasChatCard: true }), "successful card keeps the temp (DS fromUuidSync)");
ok(shouldReleaseTemporaryVerb({ created: true, hasChatCard: false }), "cancelled dialog drops a temp this call created");
ok(!shouldReleaseTemporaryVerb({ created: false, hasChatCard: false }), "reused leftover is not dropped on cancel");
ok(!shouldReleaseTemporaryVerb({}), "default is keep");

const first = markTemporaryConsoleVerbData({ name: "Search", system: { _dsid: "matrix-search" } });
first.id = "temp-a";
const extra = markTemporaryConsoleVerbData({ name: "Search", system: { _dsid: "matrix-search" } });
extra.id = "temp-b";
const pingTemp = markTemporaryConsoleVerbData({ name: "Ping", system: { _dsid: "matrix-ping" } });
pingTemp.id = "temp-ping";
const split = splitReusableTemporaryVerbs([first, extra, pingTemp], "matrix-search");
ok(split.keep?.id === "temp-a" && split.extras.map(i => i.id).join(",") === "temp-b", "reuses first Search leftover, extras are the rest");
ok(leftoverTemporaryVerbs([first, pingTemp], "matrix-search").length === 1, "leftover filter is per dsid");
ok(splitReusableTemporaryVerbs([], "matrix-search").keep == null, "no leftover is null keep");

const searchCard = readBomFreeJson("src/packs/abilities/matrix-verbs/search.json");
ok(searchCard.system.power.effects.verbSearch000000.other.tier2.display.includes("find it cleanly"), "Search card still has tier2 flavor");

ok(/0\.3\.61/.test(readFileSync("README.md", "utf8")), "README changelog names 0.3.61");
ok(/Failed to Find Item/.test(readFileSync("README.md", "utf8")), "README names the Failed to Find Item card");
ok(/fromUuidSync/.test(readFileSync("docs/rulebook/18-wired-foundry.md", "utf8")), "Foundry notes name DS fromUuidSync");
ok(/0\.3\.61/.test(readFileSync("docs/spikes/B117-CONSOLE-MATRIX-VERBS.md", "utf8")), "spike names 0.3.61 fire path");
ok(/Failed to Find Item/.test(readFileSync("docs/spikes/B117-CONSOLE-MATRIX-VERBS.md", "utf8")), "spike names the Failed to Find Item card");

console.log("\n6) 0.3.64 Console sort + hover + sheet hide");
const nodeSort = sortConsoleNodes([
  { name: "Zebra Host", revealed: false },
  { name: "Alpha Light", revealed: true },
  { name: "Mid Cam", revealed: true },
  { name: "Beta Door", revealed: false },
]);
ok(nodeSort.map(n => n.name).join(",") === "Alpha Light,Mid Cam,Beta Door,Zebra Host", "nodes: revealed A–Z then hidden A–Z");

const rosterSort = sortConsoleRoster([
  { name: "Nyx", isNode: false, revealed: false, state: "jackedIn" },
  { name: "Zebra Host", isNode: true, revealed: false },
  { name: "Hotel Interface", isNode: true, revealed: true },
  { name: "Kessic", isNode: false, revealed: false, state: "disconnected" },
]);
ok(rosterSort.map(r => r.name).join(",") === "Hotel Interface,Kessic,Nyx,Zebra Host", "Connections: revealed nodes first, then everyone else A–Z");

pingTemp.uuid = "Actor.a.Item.temp-ping";
ok(orphanTemporaryVerbs([pingTemp], new Set()).length === 1, "unreferenced temp is an orphan");
ok(orphanTemporaryVerbs([pingTemp], new Set(["Actor.a.Item.temp-ping"])).length === 0, "chat-backed temp is kept");
ok(abilityUuidsFromMessages([{ system: { parts: [{ type: "abilityUse", abilityUuid: "Actor.a.Item.temp-ping" }] } }]).has("Actor.a.Item.temp-ping"), "parses abilityUuid from chat parts");

const filtered = filterOffSheetAbilitiesContext({
  maneuver: { label: "Maneuver", showAdd: false, abilities: [{ item: stamped }, { item: { system: { _dsid: "field-repair" } } }] },
  emptyPing: { label: "Ping only", showAdd: false, abilities: [{ item: { system: { _dsid: "matrix-ping" } } }] },
});
ok(filtered.maneuver.abilities.length === 1 && filtered.maneuver.abilities[0].item.system._dsid === "field-repair", "abilities context drops Matrix Verbs");
ok(!filtered.emptyPing, "play-mode empty group after dropping Ping is removed");

const selectors = offSheetVerbDomSelectors({ id: "abc", uuid: "Actor.a.Item.abc" });
ok(selectors.includes('[data-document-uuid="Actor.a.Item.abc"]') && selectors.includes('[data-item-id="abc"]'), "DOM hide includes data-document-uuid and data-item-id");

const consoleTpl = readFileSync("templates/wired-console.hbs", "utf8");
ok(/class="wc-node-name"[^>]*title="\{\{name\}\}"/.test(consoleTpl) && /data-tooltip="\{\{name\}\}"/.test(consoleTpl), "node names have title + data-tooltip");
ok(/class="wc-roster-name"[^>]*title="\{\{name\}\}"/.test(consoleTpl), "Connections names have title tooltip");

ok(/0\.3\.64/.test(readFileSync("README.md", "utf8")), "README changelog names 0.3.64");
ok(/hideInSheet/.test(readFileSync("docs/spikes/B117-CONSOLE-MATRIX-VERBS.md", "utf8")), "spike names hideInSheet");
ok(!/gold-line-scene/.test(readFileSync("scripts/wired-console.mjs", "utf8")), "0.3.64 still does not import gold-line-scene");

console.log("\n7) 0.3.66 Flag scope harden (filter index is not moduleId)");
ok((() => {
  const [maj, min, pat] = String(moduleJson.version).split(".").map(Number);
  return maj === 0 && min === 3 && pat >= 66;
})(), `module.json is 0.3.66+ (got ${moduleJson.version})`);
ok(/0\.3\.66/.test(readFileSync("README.md", "utf8")), "README changelog names 0.3.66");
ok(/Flag scope/.test(readFileSync("docs/spikes/B117-CONSOLE-MATRIX-VERBS.md", "utf8")), "spike names Flag scope 0");

function mockGetFlagItem(flags) {
  return {
    flags,
    getFlag(scope, key) {
      if (typeof scope !== "string" || !scope) {
        throw new Error(`Flag scope "${scope}" is not valid or not currently active`);
      }
      return flags?.[scope]?.[key];
    },
  };
}
const liveTemp = mockGetFlagItem({ "draw-steel-ghostwire": { [TEMP_CONSOLE_VERB_FLAG]: true } });
const blank = mockGetFlagItem({});
ok(isTemporaryConsoleVerb(liveTemp), "isTemporaryConsoleVerb reads getFlag with MODULE_ID");
ok(isTemporaryConsoleVerb(liveTemp, 0), "numeric second arg is ignored (filter index 0)");
ok(isTemporaryConsoleVerb(liveTemp, ""), "empty second arg falls back to MODULE_ID");
ok(isTemporaryConsoleVerb(liveTemp, "draw-steel-ghostwire"), "explicit MODULE_ID still works");
ok(!isTemporaryConsoleVerb(blank, 0), "unflagged getFlag item is not temporary even with index 0");
ok([liveTemp, blank].filter(isTemporaryConsoleVerb).length === 1, "bare filter(isTemporaryConsoleVerb) does not throw Flag scope 0");
ok([liveTemp].filter(isOffSheetMatrixVerb).length === 1, "bare filter(isOffSheetMatrixVerb) does not throw Flag scope 0");
ok(hasHideInSheetFlag(mockGetFlagItem({ [DS_SYSTEM_ID]: { [DS_HIDE_IN_SHEET]: true } }), 0), "hasHideInSheetFlag ignores numeric systemId");

console.log("\n8) 0.3.68 Wire Kit is a Connect interface");
ok((() => {
  const [maj, min, pat] = String(moduleJson.version).split(".").map(Number);
  return maj === 0 && min === 3 && pat >= 68;
})(), `module.json is 0.3.68+ (got ${moduleJson.version})`);
ok(/0\.3\.68/.test(readFileSync("README.md", "utf8")), "README changelog names 0.3.68");
ok(kitSrc.includes("wired.connectInterface"), "Add Wire Kit stamps connectInterface");
ok(!kitSrc.includes("SHEET_VERBS"), "0.3.68 still does not stamp sheet verbs");
ok(kitSrc.includes("stampWireKitOnMachines"), "0.3.68 migrates world drones and vehicles missing Wire Kit");
ok(readFileSync("scripts/machines.mjs", "utf8").includes("addWireKit") && !/if \(vehicle\.drone\) await addWireKit/.test(readFileSync("scripts/machines.mjs", "utf8")), "Deploy stamps Wire Kit on drones and vehicles");

if (failures.length) {
  console.error(`\n${failures.length} failure(s):`);
  for (const msg of failures) console.error(`  ✗ ${msg}`);
  process.exit(1);
}
console.log("\nB117 all-nine node-facing Matrix Verbs smoke OK");
