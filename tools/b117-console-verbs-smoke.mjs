#!/usr/bin/env node
/**
 * B117 Matrix Verbs smoke — node-facing player path + Console strip (module 0.3.52).
 *
 * Run: node tools/b117-console-verbs-smoke.mjs
 * Does not need live Foundry. Does not write Scene JSON.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import {
  CONSOLE_SLICE_DSIDS,
  CONSOLE_SLICE_VERBS,
  MATRIX_VERB_IDS,
  MATRIX_VERBS,
  OFF_SHEET_DSIDS,
  SHEET_VERB_DSIDS,
  SHEET_VERBS,
} from "../scripts/wired-verbs.mjs";
import {
  CONSOLE_SLICE,
  abilityTierFromMessage,
  consoleVerbGate,
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

console.log("B117 node-facing Matrix Verbs smoke (0.3.52)\n");

const moduleJson = readBomFreeJson("module.json");
ok(moduleJson.version === "0.3.52", `module.json is 0.3.52 (got ${moduleJson.version})`);

const goldDiff = execFileSync("git", ["diff", "--", "scripts/gold-line-scene.mjs"], { encoding: "utf8" });
ok(!goldDiff.trim(), "scripts/gold-line-scene.mjs is unmodified");

console.log("\n1) Verb homes");
ok(MATRIX_VERB_IDS.length === 9 && MATRIX_VERBS.length === 9, "nine Matrix Verb UUIDs still exist");
ok(SHEET_VERB_DSIDS.join(",") === "matrix-connect,matrix-jack-out,matrix-toggle-connection-state", "sheet verbs are Connect / Jack Out / Toggle");
ok(SHEET_VERBS.length === 3 && SHEET_VERBS.every(u => u.startsWith("Compendium.draw-steel-ghostwire.abilities.Item.")), "three sheet UUIDs");
ok(CONSOLE_SLICE_DSIDS.join(",") === "matrix-scan,matrix-ping,matrix-navigate", "slice is Scan / Ping / Navigate");
ok(CONSOLE_SLICE_VERBS.length === 3, "three slice UUIDs");
ok(OFF_SHEET_DSIDS.includes("matrix-broadcast") && OFF_SHEET_DSIDS.includes("matrix-search") && OFF_SHEET_DSIDS.includes("matrix-read-write"), "Broadcast / Search / Read-Write leave the sheet");
ok(OFF_SHEET_DSIDS.length === 6, "six off-sheet dsids");

const scan = readBomFreeJson("src/packs/abilities/matrix-verbs/scan.json");
const ping = readBomFreeJson("src/packs/abilities/matrix-verbs/ping.json");
const navigate = readBomFreeJson("src/packs/abilities/matrix-verbs/navigate.json");
ok(scan.system.power.roll.characteristics[0] === "intuition", "Scan rolls intuition (Instinct)");
ok(navigate.system.power.roll.characteristics[0] === "intuition", "Navigate rolls intuition (Instinct)");
ok(ping.system.power.roll.characteristics[0] === "reason", "Ping rolls reason (Logic)");
ok(CONSOLE_SLICE[0].characteristic === "intuition" && !CONSOLE_SLICE[0].softTraceOnTier1, "Scan catalog: intuition, no auto Trace");
ok(CONSOLE_SLICE[1].characteristic === "reason" && CONSOLE_SLICE[1].softTraceOnTier1, "Ping catalog: reason, soft Trace");
ok(CONSOLE_SLICE[2].characteristic === "intuition" && CONSOLE_SLICE[2].softTraceOnTier1, "Navigate catalog: intuition, soft Trace");

console.log("\n2) Gate / actor pick / soft Trace (pure)");
const roster = [
  { uuid: "Actor.a", connected: false },
  { uuid: "Actor.b", connected: true },
  { uuid: "Actor.c", connected: true },
];
ok(pickConsoleActor({ roster, selectedUuid: "Actor.c" }) === "Actor.c", "keeps a live roster selection");
ok(pickConsoleActor({ roster, selectedUuid: "Actor.missing", combatantUuid: "Actor.a" }) === "Actor.a", "falls back to combatant even if Disconnected");
ok(pickConsoleActor({ roster, selectedUuid: null, combatantUuid: null }) === "Actor.b", "else first Connected");
ok(pickConsoleActor({ roster: [] }) === null, "empty roster is null");

const players = [
  { uuid: "Actor.disc", connected: false, owned: true },
  { uuid: "Actor.me", connected: true, owned: true },
  { uuid: "Actor.ally", connected: true, owned: true },
  { uuid: "Actor.other", connected: true, owned: false },
];
ok(pickPlayerVerbActor({ candidates: players, controlledUuid: "Actor.ally" }) === "Actor.ally", "player pick prefers controlled Connected");
ok(pickPlayerVerbActor({ candidates: players, controlledUuid: "Actor.disc", characterUuid: "Actor.me" }) === "Actor.me", "else assigned character if Connected");
ok(pickPlayerVerbActor({ candidates: players }) === "Actor.me", "else first Connected owned");
ok(pickPlayerVerbActor({ candidates: players, controlledUuid: "Actor.other" }) === "Actor.me", "does not pick an unowned Connected token");
ok(pickPlayerVerbActor({ candidates: [{ uuid: "Actor.disc", connected: false, owned: true }] }) === "Actor.disc", "falls back to disconnected owned so UI can say Connect");
ok(pickPlayerVerbActor({ candidates: [] }) === null, "empty player candidates is null");

ok(!consoleVerbGate({}).ok && consoleVerbGate({}).reason === "Actor", "no actor");
ok(consoleVerbGate({ actorUuid: "Actor.b", owned: false, nodeId: "n1", connected: true }).reason === "Owner", "not owner");
ok(consoleVerbGate({ actorUuid: "Actor.b", owned: true, connected: true }).reason === "Node", "no node");
ok(consoleVerbGate({ actorUuid: "Actor.b", owned: true, nodeId: "n1", connected: true, revealed: false, isGM: false }).reason === "Hidden", "player cannot fire on a hidden node");
ok(consoleVerbGate({ actorUuid: "Actor.b", owned: true, nodeId: "n1", connected: true, revealed: false, isGM: true }).ok, "GM can fire on a hidden node");
ok(consoleVerbGate({ actorUuid: "Actor.b", owned: true, nodeId: "n1", connected: false }).reason === "Disconnected", "Disconnected");
ok(consoleVerbGate({ actorUuid: "Actor.b", owned: true, nodeId: "n1", connected: true }).ok, "Connected + node + owner");

ok(softTraceDelta("matrix-scan", 1) === 0, "Scan tier1 does not raise Trace");
ok(softTraceDelta("matrix-ping", 1) === 1, "Ping tier1 +1 Trace");
ok(softTraceDelta("matrix-navigate", 1) === 1, "Navigate tier1 +1 Trace");
ok(softTraceDelta("matrix-ping", 2) === 0 && softTraceDelta("matrix-ping", 3) === 0, "middle/high never raise Trace");
ok(nextAlert(11, 1).alert === 12 && nextAlert(11, 1).lockout, "Trace 11+1 lockout");
ok(nextAlert(12, 1).alert === 12 && !nextAlert(12, 1).lockout, "already-12 is not a new lockout");
ok(nextAlert(0, 0).alert === 0, "Scan delta 0 stays quiet");

ok(abilityTierFromMessage({ system: { parts: [{ type: "abilityUse" }, { type: "abilityResult", tier: 1 }] } }) === 1, "parses abilityResult tier");
ok(abilityTierFromMessage({ system: { parts: { contents: [{ type: "abilityResult", tier: 3 }, { type: "abilityResult", tier: 2 }] } } }) === 2, "Collection-shaped parts use the lowest tier");
ok(abilityTierFromMessage({ system: { parts: [{ type: "abilityUse" }] } }) === null, "use without result is pending");

console.log("\n3) Node panel / Console / kit / defaultItems");
const consoleSrc = readFileSync("scripts/wired-console.mjs", "utf8");
ok(consoleSrc.includes("fireVerb") && consoleSrc.includes("selectActor") && consoleSrc.includes("useConsoleVerb"), "Console wires fireVerb + selectActor");
ok(consoleSrc.includes("export function verbStripView"), "shared verbStripView");
ok(consoleSrc.includes("applyConsoleVerbTrace"), "Console applies soft Trace from chat");
ok(!consoleSrc.includes("gold-line-scene"), "Console does not import gold-line-scene");
const template = readFileSync("templates/wired-console.hbs", "utf8");
ok(template.includes("data-action=\"fireVerb\"") && template.includes("data-action=\"selectActor\""), "template has verb strip + selectable roster");
ok(template.includes("VerbPlayerPath"), "Console names the player node path");
ok(template.includes("matrix-scan") || template.includes("{{#each verbs}}"), "verb buttons come from CONSOLE_SLICE");

const nodeSrc = readFileSync("scripts/wired-node-verbs.mjs", "utf8");
ok(nodeSrc.includes("useConsoleVerb") && nodeSrc.includes("pickPlayerVerbActor") && nodeSrc.includes("verbStripView"), "node panel shares fire path");
ok(nodeSrc.includes("openWiredNodePanel") && nodeSrc.includes("registerWiredNodeVerbs"), "node panel registers and opens");
ok(nodeSrc.includes("_onClickLeft2") && nodeSrc.includes("renderTokenHUD"), "token double-click + HUD open the panel");
ok(nodeSrc.includes("maybeRedirectNodeSheet"), "node actor sheet redirects to the panel");
const nodeTpl = readFileSync("templates/wired-node-panel.hbs", "utf8");
ok(nodeTpl.includes("data-action=\"fireVerb\"") && nodeTpl.includes("{{#each verbs}}"), "node panel has the verb strip");

const tokensSrc = readFileSync("scripts/wired-node-tokens.mjs", "utf8");
ok(tokensSrc.includes("setNodePlayerAccess") && tokensSrc.includes("OBSERVER"), "revealed nodes get OBSERVER so players can open them");
ok(tokensSrc.includes("nodeRefFromToken"), "token flags resolve a node without the actor sheet");

const minimapSrc = readFileSync("scripts/wired-minimap.mjs", "utf8");
ok(minimapSrc.includes("openWiredNodePanel"), "minimap click opens the node panel");

const moduleSrc = readFileSync("scripts/module.mjs", "utf8");
ok(moduleSrc.includes("SHEET_VERBS") && moduleSrc.includes("matrixVerbsConsole"), "heroes get sheet verbs; Console strip flag");
ok(moduleSrc.includes("registerWiredNodeVerbs"), "module registers the node panel");
ok(!/for \(const uuid of MATRIX_VERBS\) defaultItems\.add/.test(moduleSrc), "defaultItems does not add all nine verbs");
const kitSrc = readFileSync("scripts/wired-kit.mjs", "utf8");
ok(kitSrc.includes("SHEET_VERBS") && kitSrc.includes("fromUuid(uuid)"), "Wire Kit stamps SHEET_VERBS");
ok(!/MATRIX_VERBS\.map\(uuid => fromUuid/.test(kitSrc), "Wire Kit does not stamp all nine verbs");
ok(kitSrc.includes('kind") === "node"') || kitSrc.includes("kind') === \"node\"") || kitSrc.includes('kind") === "node"'), "Wire Kit HUD skips node actors");

const css = readFileSync("styles/ghostwire.css", "utf8");
ok(css.includes(".wc-verbs") && css.includes(".wc-verb-strip") && css.includes(".wc-roster-row.selected"), "CSS for verb strip + selected roster");
ok(css.includes(".ghostwire-wired-node-panel"), "CSS for node panel");

console.log("\n4) Docs / lang");
const lang = readBomFreeJson("lang/en.json");
ok(lang.GHOSTWIRE.WiredConsole.Verbs === "Matrix Verbs", "lang Verbs");
ok(lang.GHOSTWIRE.WiredConsole.VerbNeedDisconnected.includes("Connect"), "lang Disconnected points at sheet Connect");
ok(lang.GHOSTWIRE.WiredConsole.VerbNeedHidden.includes("hidden"), "lang Hidden gate");
ok(lang.GHOSTWIRE.WiredConsole.VerbPlayerPath.includes("node token"), "lang player path");
ok(lang.GHOSTWIRE.Wired.ConsoleMigrated.includes("node"), "lang migration names the node");
ok(lang.GHOSTWIRE.WiredNode.Title === "Wired Node", "lang WiredNode panel");
ok(lang.GHOSTWIRE.WiredNode.NeedActor.includes("Connect"), "lang node NeedActor points at sheet Connect");
ok(lang.GHOSTWIRE.Matrix.Items.WireKit.Description.includes("Connect") && lang.GHOSTWIRE.Matrix.Items.WireKit.Description.includes("Scan"), "Wire Kit description names sheet vs node/Console");
ok(!lang.GHOSTWIRE.Matrix.Items.WireKit.Description.includes("the nine Matrix Verbs (Connect, Jack Out, Toggle Connection State, Scan"), "Wire Kit no longer claims it stamps all nine");

const spike = readFileSync("docs/spikes/B117-CONSOLE-MATRIX-VERBS.md", "utf8");
ok(/LOCKED 2026-09-20/.test(spike) && /0\.3\.52/.test(spike), "spike is locked and names 0.3.52");
ok(/PLAYER UX/.test(spike) && /node facing/.test(spike), "spike locks the player node path");
ok(/Sheet keeps/.test(spike) && /useConsoleVerb/.test(spike), "spike keeps sheet verbs and shared fire path");
const foundry = readFileSync("docs/rulebook/18-wired-foundry.md", "utf8");
ok(/B117/.test(foundry) && /soft Trace/.test(foundry), "18-wired-foundry.md notes B117");
ok(/node facing/.test(foundry) && /OBSERVER/.test(foundry), "Foundry notes name the player node path + OBSERVER");
ok(/Connect, Jack Out/.test(foundry) || /Sheet keeps/.test(foundry), "Foundry notes keep Connect on the sheet");
const raw = readFileSync("docs/raw/21-the-wire.md", "utf8");
ok(/Wired node/.test(raw) && /Scan/.test(raw) && /Navigate/.test(raw), "Wire RAW In Foundry aside names node-facing verbs");
ok(!/Navigate\*\* fire from the Console/.test(raw), "Wire RAW no longer says verbs only fire from the Console");
ok(!/ensureGoldLineScene/.test(consoleSrc), "Console path does not Gold-Line force overwrite");
ok(/0\.3\.52/.test(readFileSync("README.md", "utf8")) && /B117/.test(readFileSync("README.md", "utf8")), "README changelog 0.3.52");
ok(/node the player faces/.test(readFileSync("README.md", "utf8")) || /node token/.test(readFileSync("README.md", "utf8")), "README names the player node path");

const journal = readBomFreeJson("src/packs/rulebook/ghostwire-systems/21-the-wire.json");
const overview = journal.pages?.find(p => /Scan/.test(p.text?.markdown ?? "") && /Wired Console/.test(p.text?.markdown ?? ""));
ok(!!overview, "Wire journal still has a Wired Console aside");
ok(/Scan/.test(overview?.text?.markdown ?? "") && /Navigate/.test(overview?.text?.markdown ?? ""), "Wire journal aside names Scan / Navigate");
ok(/Wired node/.test(overview?.text?.markdown ?? ""), "Wire journal aside names the node panel");

if (failures.length) {
  console.error(`\n${failures.length} failure(s):`);
  for (const msg of failures) console.error(`  ✗ ${msg}`);
  process.exit(1);
}
console.log("\nB117 node-facing Matrix Verbs smoke OK");
