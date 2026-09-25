#!/usr/bin/env node
/**
 * Linked Wire connection state smoke — module 0.3.57 (docs / VOIDMARK follow-up).
 *
 * Run: node tools/linked-wire-state-smoke.mjs
 * Does not need live Foundry. Does not write Scene JSON.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import {
  consoleVerbGate,
  hintVerbDsid,
} from "../scripts/wired-console-verbs.mjs";
import { whisperRecipientIds } from "../scripts/wired-pings.mjs";
import {
  FULLY_CONNECTED_STATES,
  ON_NET_STATES,
  TOGGLE_LADDER,
  WIRED_STATUS_DEFS,
  connectTargetState,
  isFullyConnected,
  isLinkedOkVerb,
  isOnNet,
  isWireDiscoverable,
  jumpedInBlocksAbility,
  meatPowerRollModifier,
  nextToggleState,
  resolveWiredState,
  verbAllowedAtState,
  wiredAbilityAllowedAtState,
  wiredPowerRollModifier,
} from "../scripts/wired-state.mjs";
import { canvasFocusPlan, tokenCenter } from "../scripts/wired-canvas-focus.mjs";
import { verbRefusalCopy } from "../scripts/wired-console-verbs.mjs";

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

console.log("Linked Wire connection state smoke (0.3.57)\n");

const moduleJson = readBomFreeJson("module.json");
ok((() => {
  const [maj, min, pat] = String(moduleJson.version).split(".").map(Number);
  return maj === 0 && min === 3 && pat >= 57;
})(), `module.json is 0.3.57+ (got ${moduleJson.version})`);

const goldDiff = execFileSync("git", ["diff", "--", "scripts/gold-line-scene.mjs"], { encoding: "utf8" });
ok(!goldDiff.trim(), "scripts/gold-line-scene.mjs is unmodified");

console.log("\n1) State helpers");
ok(connectTargetState() === "linked", "Connect lands in Linked");
ok(TOGGLE_LADDER.join(",") === "linked,overlay,jackedIn", "Toggle ladder is Linked → Overlay → Jacked In");
ok(nextToggleState("linked") === "overlay", "Toggle Linked → Overlay");
ok(nextToggleState("overlay") === "jackedIn", "Toggle Overlay → Jacked In");
ok(nextToggleState("jackedIn") === "linked", "Toggle Jacked In wraps to Linked");
ok(nextToggleState("disconnected") === "linked", "Toggle off-ladder starts at Linked (gate should refuse first)");
ok(ON_NET_STATES.every(isOnNet) && !isOnNet("disconnected"), "on-net = Linked / Overlay / Jacked In");
ok(FULLY_CONNECTED_STATES.every(isFullyConnected) && !isFullyConnected("linked"), "full Connected excludes Linked");
ok(isWireDiscoverable("linked") && isWireDiscoverable("overlay") && !isWireDiscoverable("disconnected"), "Linked is Wire-discoverable soft presence");
ok(WIRED_STATUS_DEFS.linked.id === "ghostwire-linked", "status id ghostwire-linked");
ok(WIRED_STATUS_DEFS.overlay.id === "ghostwire-overlay" && WIRED_STATUS_DEFS.jackedIn.id === "ghostwire-jacked-in", "existing Overlay / Jacked In ids unchanged");

ok(verbAllowedAtState("matrix-connect", "disconnected") && !verbAllowedAtState("matrix-connect", "linked"), "Connect only while Disconnected");
ok(verbAllowedAtState("matrix-broadcast", "linked") && verbAllowedAtState("matrix-jack-out", "linked") && verbAllowedAtState("matrix-toggle-connection-state", "linked"), "Broadcast / Toggle / Jack Out from Linked");
ok(!verbAllowedAtState("matrix-scan", "linked") && !verbAllowedAtState("matrix-navigate", "linked") && !verbAllowedAtState("matrix-ping", "linked"), "Scan / Navigate / Ping refuse Linked");
ok(!verbAllowedAtState("matrix-search", "linked") && !verbAllowedAtState("matrix-read-write", "linked"), "Search / Read-Write refuse Linked");
ok(verbAllowedAtState("matrix-scan", "overlay") && verbAllowedAtState("matrix-scan", "jackedIn"), "Scan OK Overlay and Jacked In");
ok(!wiredAbilityAllowedAtState("linked") && wiredAbilityAllowedAtState("overlay"), "Programs / payload Runs need Overlay+");
ok(isLinkedOkVerb("broadcast") && isLinkedOkVerb("matrix-jack-out"), "Linked-ok verb helper");
ok(meatPowerRollModifier("linked").banes === 0 && !meatPowerRollModifier("linked").blocked, "Linked meat rolls normal");
ok(meatPowerRollModifier("overlay").banes === 1, "Overlay meat bane");
ok(meatPowerRollModifier("jackedIn").blocked, "Jacked In meat blocked");
ok(!jumpedInBlocksAbility({ state: "jackedIn", dsid: "deploy-and-command", rollEnabled: true }), "Deploy & Command stays usable while Jacked In");
ok(!jumpedInBlocksAbility({ state: "jackedIn", dsid: "rigged-fire", rollEnabled: true }), "Rigged Fire stays usable while Jacked In");
ok(!jumpedInBlocksAbility({ state: "jackedIn", dsid: "focus-fire", rollEnabled: true }), "Focus Fire stays usable while Jacked In");
ok(jumpedInBlocksAbility({ state: "jackedIn", dsid: "scrap-bow", rollEnabled: true }), "a personal weapon is still blocked while Jacked In");
ok(!jumpedInBlocksAbility({ state: "jackedIn", wired: true, dsid: "matrix-scan", rollEnabled: true }), "Wired rolls are not the meat lock");
ok(!jumpedInBlocksAbility({ state: "overlay", dsid: "scrap-bow", rollEnabled: true }), "Overlay does not use the Jacked In lock");
ok(wiredPowerRollModifier("linked").edges === 0 && wiredPowerRollModifier("overlay").edges === 0 && wiredPowerRollModifier("jackedIn").edges === 1, "Jacked In Wired edge only");
ok(resolveWiredState({ connected: true }) === "overlay" && resolveWiredState({ state: "linked" }) === "linked", "legacy connected:true = Overlay; explicit state wins");

console.log("\n2) Console / node gate");
const linked = { actorUuid: "Actor.b", owned: true, nodeId: "n1", state: "linked", hasInterface: true };
ok(consoleVerbGate({ ...linked, dsid: "matrix-connect" }).reason === "AlreadyConnected", "Connect refused while Linked");
ok(consoleVerbGate({ ...linked, dsid: "matrix-broadcast" }).ok, "Broadcast from Linked + node");
ok(consoleVerbGate({ actorUuid: "Actor.b", owned: true, state: "linked", dsid: "matrix-jack-out" }).ok, "Jack Out from Linked, no node");
ok(consoleVerbGate({ actorUuid: "Actor.b", owned: true, state: "linked", dsid: "matrix-toggle-connection-state" }).ok, "Toggle from Linked");
ok(consoleVerbGate({ ...linked, dsid: "matrix-scan" }).reason === "Immersion", "Scan refused while Linked-only");
ok(consoleVerbGate({ ...linked, dsid: "matrix-navigate" }).reason === "Immersion", "Navigate refused while Linked-only");
ok(consoleVerbGate({ actorUuid: "Actor.b", owned: true, nodeId: "n1", state: "overlay", dsid: "matrix-scan" }).ok, "Scan OK Overlay");
ok(consoleVerbGate({ actorUuid: "Actor.b", owned: true, nodeId: "n1", connected: false, dsid: "matrix-scan" }).reason === "Disconnected", "Scan while Disconnected");
ok(hintVerbDsid("disconnected") === "matrix-connect", "hint Connect while Disconnected");
ok(hintVerbDsid("linked") === "matrix-toggle-connection-state", "hint Toggle while Linked");
ok(hintVerbDsid("overlay") === "matrix-scan", "hint Scan while Overlay");
ok(hintVerbDsid(true) === "matrix-scan", "legacy hint boolean true = Scan");

console.log("\n3) Runtime wiring");
const moduleSrc = readFileSync("scripts/module.mjs", "utf8");
ok(moduleSrc.includes("ghostwire-linked") || moduleSrc.includes("WIRED_STATUS_DEFS"), "module registers Linked status");
ok(moduleSrc.includes("connectTargetState") && moduleSrc.includes("nextToggleState"), "module uses Connect→Linked and Toggle ladder");
ok(moduleSrc.includes("NeedImmersion") && moduleSrc.includes("isLinkedOkVerb"), "AbilityModel#use gates Linked vs immersion");
ok(moduleSrc.includes("abilityPowerRollModifiers"), "power-roll helpers (Linked applies neither)");

const consoleSrc = readFileSync("scripts/wired-console.mjs", "utf8");
ok(consoleSrc.includes("state: verbActor?.state") && consoleSrc.includes("sortConsoleRoster") && consoleSrc.includes("consoleRosterWireState"), "Console roster + gate pass state; Connections sort revealed-first then A–Z; nodes chip as Connected");
ok(consoleSrc.includes("isNodeActor") && consoleSrc.includes("consoleRosterWireState"), "Console roster treats kind:node as always Connected");
ok(consoleSrc.includes("state,"), "useConsoleVerb passes state into the gate");
ok(/focusPlacedNodeOnCanvas/.test(consoleSrc) && /#onSelectNode/.test(consoleSrc), "Console list select calls focusPlacedNodeOnCanvas");

const nodeSrc = readFileSync("scripts/wired-node-verbs.mjs", "utf8");
ok(nodeSrc.includes("state: runner?.state") && nodeSrc.includes("hintVerbDsid(verbCtx.state)"), "node panel passes state");

const pingSrc = readFileSync("scripts/wired-pings.mjs", "utf8");
ok(pingSrc.includes('state === "disconnected"'), "Wire whispers include Linked");

const payloadSrc = readFileSync("scripts/payload-use.mjs", "utf8");
ok(payloadSrc.includes('state !== "overlay"') && payloadSrc.includes('state !== "jackedIn"'), "payload Run still Overlay / Jacked In only");

const css = readFileSync("styles/ghostwire.css", "utf8");
ok(css.includes(".state-linked"), "CSS for Linked sheet + roster");

const gm = { id: "gm1", isGM: true };
const alice = { id: "u1", isGM: false };
const bob = { id: "u2", isGM: false };
const linkedActor = { id: "a0", state: "linked" };
const meatActor = { id: "a3", state: "disconnected" };
const recips = whisperRecipientIds({
  users: [gm, alice, bob],
  tokens: [{ actor: linkedActor }, { actor: meatActor }],
  getWiredState: actor => actor.state,
  canOwn: (actor, user) => (actor === linkedActor && user === alice) || (actor === meatActor && user === bob),
});
ok(recips.includes("gm1") && recips.includes("u1") && !recips.includes("u2"), "Wire whisper reaches Linked owner, not Disconnected");

console.log("\n4) Docs / lang / cards");
const lang = readBomFreeJson("lang/en.json");
ok(lang.GHOSTWIRE.Wired.States.linked === "Linked", "lang Linked state");
ok(lang.GHOSTWIRE.Wired.StateHints.linked.toLowerCase().includes("broadcast"), "lang Linked hint names Broadcast");
ok(lang.GHOSTWIRE.Wired.Warnings.NeedImmersion.includes("Linked"), "lang NeedImmersion");
ok(lang.GHOSTWIRE.WiredConsole.VerbNeedImmersion.includes("Overlay or Jacked In"), "lang VerbNeedImmersion");
// 0.3.143: the "press Toggle" half of that refuse now lives in the hint beside it.
ok(verbRefusalCopy("Immersion")?.hintVerb === "matrix-toggle-connection-state", "lang VerbHintImmersion points at Toggle");
ok(lang.GHOSTWIRE.Abilities.MatrixVerbs.Connect.Effect.includes("Linked"), "Connect card enters Linked");
ok(lang.GHOSTWIRE.Abilities.MatrixVerbs.ToggleConnectionState.Effect.includes("Linked → Overlay → Jacked In → Linked"), "Toggle card documents the ladder");
ok(lang.GHOSTWIRE.Abilities.MatrixVerbs.Broadcast.Effect.includes("Linked"), "Broadcast card allows Linked");
ok(lang.GHOSTWIRE.Abilities.MatrixVerbs.JackOut.Effect.includes("Linked"), "Jack Out from any on-net state");
ok(lang.GHOSTWIRE.WiredConsole.PingWhisper.includes("Linked"), "ping whisper label includes Linked");

const connect = readBomFreeJson("src/packs/abilities/matrix-verbs/connect.json");
const tiers = Object.values(connect.system.power.effects.verbConnect00000.other).map(t => t.display).join(" ");
ok(/enter Linked/.test(tiers) && !/enter Overlay/.test(tiers), "Connect power-roll tiers enter Linked");

const raw = readFileSync("docs/raw/21-the-wire.md", "utf8");
ok(/Disconnected \| Linked \| Overlay \| Jacked In|four connection states/.test(raw), "RAW names four states");
ok(/lands you in \*\*Linked\*\*/.test(raw) || /puts you in \*\*Linked\*\*/.test(raw), "RAW Connect → Linked");
ok(/Linked → Overlay → Jacked In → Linked/.test(raw), "RAW Toggle ladder");
ok(/soft presence/.test(raw) && /Wire-discoverable/.test(raw), "RAW Linked discoverability");
ok(/jammable backup/.test(raw) && /default street/.test(raw), "RAW radio backup / Wire default comms");
ok(/Does \*\*not\*\* count as full \*\*Connected\*\*/.test(raw), "RAW Linked is not full Connected");

const foundry = readFileSync("docs/rulebook/18-wired-foundry.md", "utf8");
ok(/ghostwire-linked/.test(foundry) && /Linked → Overlay → Jacked In → Linked/.test(foundry), "Foundry notes document Linked + ladder");
ok(/0\.3\.56/.test(foundry), "Foundry notes name 0.3.56 (Linked code ship)");
ok(/0\.3\.57/.test(foundry), "Foundry notes name 0.3.57 (Linked docs / VOIDMARK)");
ok(/Pan to node/.test(foundry) && /canvas\.animatePan/.test(foundry), "Foundry notes document Console / minimap pan-to-node");

const testsJournal = readBomFreeJson("src/packs/rulebook/shared-core/03-tests-power-rolls.json");
const testsMd = (testsJournal.pages ?? []).map(p => p.text?.markdown ?? "").join("\n");
ok(/\*\*Linked\*\*/.test(testsMd) && /Broadcast/.test(testsMd), "Tests journal connection-state table includes Linked");

const combatJournal = readBomFreeJson("src/packs/rulebook/shared-core/04-combat.json");
const combatMd = (combatJournal.pages ?? []).map(p => p.text?.markdown ?? "").join("\n");
ok(/\*\*Linked:\*\* on-net for comms/.test(combatMd), "Combat journal documents Linked in combat");

const readme = readFileSync("README.md", "utf8");
ok(/0\.3\.56/.test(readme) && /Linked/.test(readme), "README changelog 0.3.56 Linked");
ok(/0\.3\.57/.test(readme) && /VOIDMARK/.test(readme), "README changelog 0.3.57 VOIDMARK / Linked docs");
ok(/pans\/centers/.test(readme) || /pan-to-node/.test(readme), "README changelog 0.3.56 names Console pan-to-node");

const vmIndex = readBomFreeJson("data/voidmark-rules-index.json");
ok(vmIndex.chunks.some(c => /linked/i.test(c.text) && String(c.file).includes("21-the-wire")), "VOIDMARK index Wire chunks mention Linked");
ok(!vmIndex.chunks.some(c => /the two connection states \(\*\*Overlay\*\* and \*\*Jacked In\*\*\)/.test(c.text)), "VOIDMARK index has no two-state Overlay/Jacked In-only Wire intro");

console.log("\n5) Console / minimap pan-to-node");
ok(tokenCenter(null) === null, "tokenCenter(null) is null");
ok(tokenCenter({ x: Number.NaN, y: 0 }) === null, "tokenCenter rejects NaN coords");
const live = tokenCenter({ center: { x: 640, y: 480 } });
ok(live?.x === 640 && live?.y === 480, "tokenCenter prefers Token#center");
const doc = tokenCenter({ x: 0, y: 0, width: 0.25, height: 0.25 }, 100);
ok(doc?.x === 12.5 && doc?.y === 12.5, "tokenCenter uses document x/y + 0.25 grid");

const missing = canvasFocusPlan({ hasCenter: false, isGM: true });
ok(!missing.pan && !missing.control, "unplaced node: no pan, no control");
const hiddenPlayer = canvasFocusPlan({ hasCenter: true, hidden: true, isGM: false, canControl: false });
ok(!hiddenPlayer.pan && !hiddenPlayer.control, "hidden token: player does not pan");
const hiddenGM = canvasFocusPlan({ hasCenter: true, hidden: true, isGM: true, canControl: true });
ok(hiddenGM.pan && hiddenGM.control, "hidden token: GM pans and controls");
const revealedPlayer = canvasFocusPlan({ hasCenter: true, hidden: false, isGM: false, canControl: false });
ok(revealedPlayer.pan && !revealedPlayer.control, "revealed token: player pans, no control unless owner");
const ownerPlayer = canvasFocusPlan({ hasCenter: true, hidden: false, isGM: false, canControl: true });
ok(ownerPlayer.pan && ownerPlayer.control, "revealed token: owner pans and controls");
const notReady = canvasFocusPlan({ hasCenter: true, isGM: true, canControl: true, canvasReady: false });
ok(!notReady.pan && !notReady.control, "canvas not ready: no-op");

ok(/data-action="selectNode"/.test(readFileSync("templates/wired-console.hbs", "utf8")), "Console list row is selectNode");
const minimapSrc = readFileSync("scripts/wired-minimap.mjs", "utf8");
ok(/focusPlacedNodeOnCanvas/.test(minimapSrc) && /#onFocusNode/.test(minimapSrc), "Minimap node click uses the same pan helper");
ok(/data-action="focusNode"/.test(readFileSync("templates/wired-minimap.hbs", "utf8")), "Minimap node click is focusNode");

if (failures.length) {
  console.error(`\n${failures.length} failure(s):`);
  for (const msg of failures) console.error(`  ✗ ${msg}`);
  process.exit(1);
}
console.log("\nLinked Wire connection state smoke OK");
