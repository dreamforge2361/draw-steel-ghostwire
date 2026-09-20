#!/usr/bin/env node
/**
 * B121 Wired Console Constructs smoke — sprites/Agents roster, Lock A, no graph edges.
 *
 * Run: node tools/b121-console-constructs-smoke.mjs
 * Does not need live Foundry. Does not write Scene JSON.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import {
  collectConsoleConstructs,
  compareConsoleConstructs,
  constructKind,
  constructLeavesConnections,
  constructStamina,
  isConstructActor,
  nearestFaceNode,
  resolveConstructFace,
  sortConsoleConstructs,
} from "../scripts/wired-constructs.mjs";

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

const flags = (kind, extra = {}) => ({ flags: { "draw-steel-ghostwire": { kind, ...extra } } });

console.log("B121 Wired Console Constructs smoke (0.3.78)\n");

const moduleJson = readBomFreeJson("module.json");
ok((() => {
  const [maj, min, pat] = String(moduleJson.version).split(".").map(Number);
  return maj === 0 && min === 3 && pat >= 78;
})(), `module.json is 0.3.78+ (got ${moduleJson.version})`);

const goldDiff = execFileSync("git", ["diff", "--", "scripts/gold-line-scene.mjs"], { encoding: "utf8" });
ok(!goldDiff.trim(), "scripts/gold-line-scene.mjs is unmodified");

console.log("\n1) Kind / stamina / Connections filter");
const sprite = { id: "s1", uuid: "Actor.s1", name: "Data Sprite (Minor)", img: "s.webp", ...flags("sprite", { archetype: "data", hybridTier: "minor", compiler: "Actor.tech" }), system: { stamina: { value: 8, max: 12 } } };
const agent = { id: "a1", uuid: "Actor.a1", name: "Spike Agent (Minor)", img: "a.webp", ...flags("agent", { archetype: "spike", hybridTier: "minor", compiler: "Actor.hack" }), system: { stamina: { value: 14, max: 14 } } };
const runner = { id: "h1", uuid: "Actor.tech", name: "Nyx", isOwner: true, ...flags("hero") };
const node = { id: "n1", uuid: "Actor.node", name: "Hotel Interface", ...flags("node", { nodeId: "hotel" }) };

ok(constructKind(sprite) === "sprite" && constructKind(agent) === "agent", "kind sprite / agent");
ok(isConstructActor(sprite) && isConstructActor(agent) && !isConstructActor(runner) && !isConstructActor(node), "isConstructActor only sprites/Agents");
ok(constructLeavesConnections(sprite) && constructLeavesConnections(agent) && !constructLeavesConnections(runner), "Constructs leave Connections; runners stay");
ok(!constructLeavesConnections(node), "Wire nodes stay on Connections");
ok(constructStamina(sprite).label === "8 / 12" && constructStamina(sprite).pct === 67, "Stamina current/max + pct");
ok(constructStamina({}).label === null, "missing Stamina is null");

console.log("\n2) Collect / sort / viewer");
const tech = { id: "h1", uuid: "Actor.tech", name: "Nyx", isOwner: true };
const hack = { id: "h2", uuid: "Actor.hack", name: "Kessic", isOwner: false };
const world = [sprite, agent, runner, node, hack];
const tokens = [
  { actorId: "s1", actor: sprite, name: sprite.name, texture: { src: sprite.img }, x: 200, y: 100, width: 1, height: 1 },
  { actorId: "h1", actor: tech, name: tech.name, x: 0, y: 0, width: 1, height: 1 },
  { actorId: "h2", actor: hack, name: hack.name, x: 400, y: 0, width: 1, height: 1 },
];
const boardNodes = [
  { id: "hotel", name: "Hotel Interface", revealed: true },
  { id: "cam", name: "Cam Controls", revealed: false },
];
const placedNodes = [
  { id: "hotel", name: "Hotel Interface", revealed: true, x: 180, y: 90, width: 1, height: 1 },
  { id: "cam", name: "Cam Controls", revealed: false, x: 800, y: 800, width: 1, height: 1 },
];

const gmRows = collectConsoleConstructs({
  worldActors: world,
  sceneTokens: tokens,
  boardNodes,
  placedNodes,
  isGM: true,
  canView: actor => !!actor?.isOwner,
  resolveActor: uuid => world.find(a => a.uuid === uuid) ?? null,
  gridSize: 100,
});
ok(gmRows.some(r => r.kind === "sprite"), "GM sees sprite whose token is on the scene");
const agentByCompiler = gmRows.find(r => r.kind === "agent");
ok(!!agentByCompiler, "Agent listed because compiler token is on the scene");
ok(gmRows.find(r => r.kind === "sprite")?.anchored === true, "sprite row is anchored");
ok(agentByCompiler?.anchored === false, "Agent with compiler-only presence is unanchored");
ok(gmRows.find(r => r.kind === "sprite")?.face?.name === "Hotel Interface", "sprite face chip is nearest placed node");
ok(gmRows.find(r => r.kind === "sprite")?.face?.fromFlag === false, "face is inferred, not a graph flag");
ok(!gmRows.some(r => r.kind === "node"), "node Actors are not Constructs");

const playerRows = collectConsoleConstructs({
  worldActors: world,
  sceneTokens: tokens,
  boardNodes,
  placedNodes,
  isGM: false,
  canView: actor => !!actor?.isOwner,
  resolveActor: uuid => world.find(a => a.uuid === uuid) ?? null,
});
ok(playerRows.length === 1 && playerRows[0].kind === "sprite", "player sees owned sprite only (Agent compiler not owned)");

const flagged = { ...sprite, flags: { "draw-steel-ghostwire": { kind: "sprite", archetype: "data", hybridTier: "minor", compiler: "Actor.tech", wiredFace: "cam" } } };
const flaggedRows = collectConsoleConstructs({
  worldActors: [flagged, tech],
  sceneTokens: tokens,
  boardNodes,
  placedNodes,
  isGM: true,
  canView: () => true,
  resolveActor: uuid => world.find(a => a.uuid === uuid) ?? null,
});
ok(flaggedRows[0]?.face?.name === "Cam Controls" && flaggedRows[0]?.face?.fromFlag, "wiredFace flag wins over nearest");
const playerHiddenFace = resolveConstructFace({
  flagNodeId: "cam",
  boardById: new Map(boardNodes.map(n => [n.id, n])),
  isGM: false,
});
ok(playerHiddenFace === null, "players do not see a hidden face chip");

const sorted = sortConsoleConstructs([
  { name: "Zed", kind: "sprite", anchored: false },
  { name: "Ann", kind: "agent", anchored: true },
  { name: "Bo", kind: "sprite", anchored: true },
], { lang: "en" });
ok(sorted.map(r => r.name).join(",") === "Bo,Ann,Zed", "sort: anchored first, then sprite before agent, then A–Z");
ok(compareConsoleConstructs({ name: "A", kind: "sprite", anchored: true }, { name: "A", kind: "agent", anchored: true }) < 0, "sprite kind ranks before agent");

console.log("\n3) Face helper does not write links");
const hotel = nearestFaceNode({ token: { x: 200, y: 100, width: 1, height: 1 }, placedNodes, gridSize: 100 });
ok(hotel?.id === "hotel", "nearestFaceNode picks closest placed node");
const constructsSrc = readFileSync("scripts/wired-constructs.mjs", "utf8");
ok(!constructsSrc.includes("setLink") && !constructsSrc.includes("wiredBoard"), "construct helpers never touch board links");

console.log("\n4) Console wiring / Command does not compile");
const consoleSrc = readFileSync("scripts/wired-console.mjs", "utf8");
ok(consoleSrc.includes("constructLeavesConnections") && consoleSrc.includes("collectConsoleConstructs"), "Console collects Constructs and filters Connections");
ok(consoleSrc.includes("selectConstruct") && consoleSrc.includes("focusActorTokenOnCanvas"), "pan-to-anchor action");
ok(consoleSrc.includes("commandConstruct") && consoleSrc.includes("decompileConstruct"), "Command / Decompile actions");
ok(consoleSrc.includes("commandSprite") && consoleSrc.includes("commandAgent"), "Command hooks existing sprite/agent APIs");
ok(consoleSrc.includes("decompileSprite") && consoleSrc.includes("decompileAgent"), "Decompile uses shipped APIs");
ok(/isConstructActor\(actor\)/.test(consoleSrc) && /isNodeActor\(actor\)/.test(consoleSrc), "verb fire refuses node and construct actors");
ok(consoleSrc.includes("setLink(nodes, nodeId, otherId") && !/setLink\([^)]*construct/i.test(consoleSrc), "setLink stays on board nodes only");

const tpl = readFileSync("templates/wired-console.hbs", "utf8");
ok(tpl.includes("wc-constructs") && tpl.includes("GHOSTWIRE.WiredConsole.Constructs.Title"), "template has Constructs section");
ok(tpl.includes("wc-roster") && tpl.includes("wc-nodes"), "Connections and Nodes sections remain");
ok(tpl.includes("data-action=\"selectConstruct\"") && tpl.includes("data-action=\"commandConstruct\"") && tpl.includes("data-action=\"decompileConstruct\""), "construct row actions");
ok(!tpl.includes("data-link-to") || tpl.includes("data-link-to=\"{{id}}\""), "link checkboxes stay on selected node, not Constructs");

const spriteSrc = readFileSync("scripts/sprites.mjs", "utf8");
ok(spriteSrc.includes("export async function commandSprite") && spriteSrc.includes("compileAbility(caster)"), "commandSprite opens Compile sheet");
const spriteCmd = spriteSrc.match(/export async function commandSprite[\s\S]*?\nexport async function /);
ok(spriteCmd && !spriteCmd[0].includes("compileSprite("), "commandSprite does not call compileSprite");
ok(spriteSrc.includes("compile.addEventListener") && spriteSrc.includes("compileSprite(caster)"), "sheet Compile button still compiles");

const agentSrc = readFileSync("scripts/agents.mjs", "utf8");
const agentCmd = agentSrc.match(/export async function commandAgent[\s\S]*?\nexport async function /);
ok(agentSrc.includes("export async function commandAgent") && agentCmd && !agentCmd[0].includes("compileAgent("), "commandAgent does not call compileAgent");
ok(agentSrc.includes("compileAgent(caster)"), "sheet Compile Agent still compiles");

const css = readFileSync("styles/ghostwire.css", "utf8");
ok(css.includes(".wc-constructs") && css.includes("grid-template-columns: 190px 250px 220px 1fr"), "CSS adds Constructs column without replacing Nodes");

const canvasSrc = readFileSync("scripts/wired-canvas-focus.mjs", "utf8");
ok(canvasSrc.includes("export async function focusActorTokenOnCanvas"), "shared pan helper for construct tokens");

console.log("\n5) Lang / docs / Lock A");
const lang = readBomFreeJson("lang/en.json");
ok(lang.GHOSTWIRE.WiredConsole.Constructs.Title === "Constructs", "lang Constructs title");
ok(/roster anchor/i.test(lang.GHOSTWIRE.WiredConsole.Constructs.LockA), "lang Lock A");
ok(lang.GHOSTWIRE.WiredConsole.Constructs.Band.minor === "Minor", "lang band chips");
ok(/Compile Sprite/.test(lang.GHOSTWIRE.Summons.Sprites.UI.CommandHint), "sprite CommandHint");
ok(/Compile Agent/.test(lang.GHOSTWIRE.Summons.Agents.UI.CommandHint), "agent CommandHint");

const raw21 = readFileSync("docs/raw/21-the-wire.md", "utf8");
ok(/Lock A/.test(raw21) && /roster anchor/.test(raw21), "RAW 21 Lock A roster anchor");
ok(/Wired \/ EW/.test(raw21) && /hybrid band/.test(raw21), "RAW 21 construct-vs-construct Wire/EW + band economy");
ok(/construct/.test(raw21) && /edges to the board graph/.test(raw21), "RAW 21 forbids construct graph edges");

const foundry = readFileSync("docs/rulebook/18-wired-foundry.md", "utf8");
ok(/Constructs \(B121/.test(foundry) && /kind: "sprite"/.test(foundry), "Foundry notes document Constructs panel");
ok(!/gold-line-scene/.test(consoleSrc), "Console still does not import gold-line-scene");

if (failures.length) {
  console.error(`\n${failures.length} failure(s):`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log("\nB121 Constructs smoke passed.");
