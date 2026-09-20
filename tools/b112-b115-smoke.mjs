#!/usr/bin/env node
/**
 * B112 auto-nodes + B114 node-map layout + B115 Wire Kit smoke (module 0.3.48).
 *
 * Run: node tools/b112-b115-smoke.mjs
 * Does not write Scene JSON. Asserts gold-line-scene.mjs is untouched.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { parseRoomName, planAutoNodes, isDoorWall, wallCenter, AUTO_NODE_TOKEN_ART, AUTO_KIND } from "../scripts/wired-auto-nodes.mjs";
import { layoutNodes, shortNodeName, minSeparation, roomPrefix } from "../scripts/wired-layout.mjs";
import { MATRIX_VERBS, MATRIX_VERB_IDS, WIRE_KIT_ID, WIRE_KIT_DSID, WIRE_KIT_UUID } from "../scripts/wired-verbs.mjs";

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

console.log("B112 / B114 / B115 Wired Gold Line smoke (0.3.48)\n");

const moduleJson = readBomFreeJson("module.json");
ok(moduleJson.version === "0.3.48", `module.json is 0.3.48 (got ${moduleJson.version})`);

const goldDiff = execFileSync("git", ["diff", "--", "scripts/gold-line-scene.mjs"], { encoding: "utf8" });
ok(!goldDiff.trim(), "scripts/gold-line-scene.mjs is unmodified");

ok(AUTO_NODE_TOKEN_ART["light-control"] === null && AUTO_NODE_TOKEN_ART.maglock === null, "B113 token art hooks are null placeholders");

console.log("\n1) Room naming (B112)");
ok(parseRoomName("Rear Bay Work Light") === "Rear Bay", "Rear Bay Work Light → Rear Bay");
ok(parseRoomName("Cab Light") === "Cab", "Cab Light → Cab");
ok(parseRoomName("Aft Freight Work Light") === "Aft Freight", "Aft Freight Work Light → Aft Freight");
ok(parseRoomName("R2 - Wire Closet Light") === "R2", "dash split → R2");
ok(parseRoomName("Track Light") === "Track", "Track Light → Track");
ok(parseRoomName("  ") === "", "blank name is empty");
ok(parseRoomName("Security Nest Control Panel") === "Security Nest", "stops before Control");
ok(!isDoorWall({ door: 0 }), "door NONE is skipped");
ok(isDoorWall({ door: 1 }), "door DOOR is kept");
ok(isDoorWall({ door: 2 }), "secret door is kept");
const mid = wallCenter({ c: [0, 0, 10, 4] });
ok(mid.x === 5 && mid.y === 2, "wallCenter averages endpoints");

console.log("\n2) Auto-node plan (B112)");
let ids = 0;
const idFactory = () => `n${String(++ids).padStart(3, "0")}`;
const lights = [
  { id: "L1", name: "Aft Freight Work Light", x: 100, y: 50 },
  { id: "L1b", name: "Aft Freight Work Light 2", x: 120, y: 50 },
  { id: "L2", name: "Security Nest Light", x: 400, y: 50 },
  { id: "L3", name: "Cab Light", x: 800, y: 40 },
  { id: "skip", name: "", x: 0, y: 0 },
];
const doors = [
  { id: "D1", name: "", x: 110, y: 80 },
  { id: "D2", name: "", x: 130, y: 80 },
  { id: "D3", name: "Security Nest Maglock", x: 410, y: 90 },
  { id: "D4", name: "", x: 805, y: 70 },
];
const plan = planAutoNodes({ lights, doors, existing: [], replace: false, idFactory });
ok(plan.rooms.includes("Aft Freight") && plan.rooms.includes("Security Nest") && plan.rooms.includes("Cab"), "three rooms from lights");
ok(plan.rooms.length === 3, `unique rooms (got ${plan.rooms.length})`);
const lightNodes = plan.created.filter(n => n.autoFrom.kind === AUTO_KIND.light);
ok(lightNodes.length === 3, `one Light Control per room (got ${lightNodes.length})`);
ok(lightNodes.every(n => n.track === 1 && n.rating === 1), "Light Control is T1 R1");
ok(lightNodes.some(n => n.name === "Aft Freight Light Control"), "Aft Freight Light Control name");
const maglocks = plan.created.filter(n => n.autoFrom.kind === AUTO_KIND.maglock);
ok(maglocks.length === 4, `one maglock per door (got ${maglocks.length})`);
ok(maglocks.every(n => n.track === 1 && n.rating === 2), "Maglocks are T1 R2");
ok(plan.nodes.some(n => n.name === "Aft Freight Maglock Door 1") && plan.nodes.some(n => n.name === "Aft Freight Maglock Door 2"), "per-room door numbering");
const aftLight = plan.nodes.find(n => n.name === "Aft Freight Light Control");
const aftDoors = plan.nodes.filter(n => n.autoFrom?.room === "Aft Freight" && n.autoFrom.kind === AUTO_KIND.maglock);
ok(aftDoors.every(d => aftLight.links.includes(d.id) && d.links.includes(aftLight.id)), "Light Control linked to same-room maglocks");

ids = 0;
const again = planAutoNodes({ lights, doors, existing: plan.nodes, replace: false, idFactory });
ok(again.created.length === 0 && again.skipped.length === plan.created.length, "re-run skip is idempotent");
ids = 100;
const replaced = planAutoNodes({
  lights, doors,
  existing: [...plan.nodes, { id: "manual", name: "Cab Host", track: 2, rating: 3, links: [], autoFrom: null }],
  replace: true,
  idFactory,
});
ok(replaced.nodes.some(n => n.id === "manual"), "replace keeps manual nodes");
ok(!replaced.nodes.some(n => n.id === aftLight.id), "replace drops prior auto-nodes");

console.log("\n3) Dense layout (B114)");
const gold = [];
const rooms = ["Aft Freight", "Freight", "Security Nest", "Courier", "Wire Closet", "Cab", "Rear Bay", "Gangway"];
let nid = 0;
for (const room of rooms) {
  const light = { id: `g${++nid}`, name: `${room} Light Control`, links: [], track: 1, rating: 1 };
  const d1 = { id: `g${++nid}`, name: `${room} Maglock Door 1`, links: [], track: 1, rating: 2 };
  const d2 = { id: `g${++nid}`, name: `${room} Maglock Door 2`, links: [], track: 1, rating: 2 };
  light.links.push(d1.id, d2.id);
  d1.links.push(light.id);
  d2.links.push(light.id);
  gold.push(light, d1, d2);
}
ok(gold.length === 24, "Gold Line-style board is 24 nodes");
const laid = layoutNodes(gold);
ok(laid.dense, "24 nodes is dense mode");
ok(laid.mode === "cluster" || laid.mode === "force", `cluster or force mode (got ${laid.mode})`);
ok(laid.positions.size === 24, "every node has a position");
const sep = minSeparation(laid.positions);
ok(sep >= 7, `min centre separation ≥ 7 (got ${sep.toFixed(2)})`);
ok(shortNodeName("Rear Bay Light Control", { dense: true }).includes("LC"), "Light Control compresses to LC");
ok(shortNodeName("Cab Maglock Door 2", { dense: true }).length <= 14, "dense labels truncate");
ok(roomPrefix("Rear Bay Maglock Door 1") === "Rear Bay", "roomPrefix matches Maglock names");

const stacked = layoutNodes(
  gold.slice(0, 6),
  new Map([
    [gold[0].id, { x: 100, y: 100 }],
    [gold[1].id, { x: 102, y: 100 }],
    [gold[2].id, { x: 104, y: 100 }],
  ]),
);
ok(stacked.mode === "spatial", "placed tokens use spatial layout");
ok(minSeparation(stacked.positions) >= 7, "collision avoidance separates stacked tokens");

console.log("\n4) Wire Kit pack (B115)");
ok(MATRIX_VERB_IDS.length === 9 && MATRIX_VERBS.length === 9, "nine Matrix Verb UUIDs");
ok(WIRE_KIT_ID.length === 16 && /^[A-Za-z0-9]{16}$/.test(WIRE_KIT_ID), "Wire Kit _id is 16 alphanumeric");
ok(WIRE_KIT_UUID.endsWith(WIRE_KIT_ID), "Wire Kit UUID uses that id");
const kit = readBomFreeJson("src/packs/matrix/support/wire-kit-matrix-verbs.json");
ok(kit._id === WIRE_KIT_ID && kit.system._dsid === WIRE_KIT_DSID, "pack JSON id/dsid match");
ok(kit.type === "feature", "Wire Kit is a droppable feature");
ok(kit.flags["draw-steel-ghostwire"].kind === "wire-kit", "kind flag is wire-kit");
ok(kit.folder === "coyCmRxnu5opxytj", "lives in Matrix Support folder");

const src = readFileSync("scripts/wired-kit.mjs", "utf8");
ok(src.includes("grantMatrixVerbs") && src.includes("addWireKitToSelected"), "wired-kit grants + selected-token helper");
ok(src.includes("actor.type === \"hero\""), "heroes are not auto-stamped");
ok(!/for \(const actor of game\.actors\)/.test(src), "no world-actor scan to stamp kits");

console.log("\n5) Console / minimap / docs");
const consoleSrc = readFileSync("scripts/wired-console.mjs", "utf8");
ok(consoleSrc.includes("autoNodes") && consoleSrc.includes("applyAutoNodesFromScene"), "Console wires Auto-nodes");
ok(consoleSrc.includes("addWireKit"), "Console wires Add Wire Kit");
ok(consoleSrc.includes("autoFrom"), "getBoard preserves autoFrom");
ok(!consoleSrc.includes("gold-line-scene"), "Console does not import gold-line-scene");
const template = readFileSync("templates/wired-console.hbs", "utf8");
ok(template.includes("data-action=\"autoNodes\"") && template.includes("data-action=\"addWireKit\""), "Console template has both GM buttons");
const mini = readFileSync("templates/wired-minimap.hbs", "utf8");
ok(mini.includes("wm-viewport") && mini.includes("shortName") && mini.includes("resetView"), "minimap has viewport, truncated names, reset");
ok(readFileSync("scripts/wired-minimap.mjs", "utf8").includes("layoutNodes"), "minimap uses shared layout");
ok(readFileSync("scripts/wired-node-tokens.mjs", "utf8").includes("textureSrc"), "placeNode accepts B113 textureSrc");

const lang = readBomFreeJson("lang/en.json");
ok(lang.GHOSTWIRE.WiredConsole.AutoNodes === "Auto-nodes from Scene", "lang AutoNodes");
ok(lang.GHOSTWIRE.WiredConsole.AutoNodesRule.includes("Rear Bay"), "lang documents room rule");
ok(lang.GHOSTWIRE.WiredMinimap.PanHint.toLowerCase().includes("zoom"), "lang pan/zoom hint");
ok(lang.GHOSTWIRE.Matrix.Items.WireKit.Name.includes("Matrix Verbs"), "lang Wire Kit name");
ok(lang.GHOSTWIRE.WiredKit.NoSelection.includes("NPC"), "lang kit needs NPC selection");

ok(readFileSync("docs/spikes/B112-SCENE-WIRE-AUTO-NODES.md", "utf8").includes("0.3.48"), "B112 spike");
ok(readFileSync("docs/spikes/B114-NODE-MAP-READABILITY.md", "utf8").includes("0.3.48"), "B114 spike");
ok(readFileSync("docs/spikes/B115-NPC-WIRE-KIT.md", "utf8").includes("0.3.48"), "B115 spike");
ok(readFileSync("docs/spikes/B112-SCENE-WIRE-AUTO-NODES.md", "utf8").includes("B113"), "B112 notes B113 art later");

if (failures.length) {
  console.error(`\n${failures.length} failure(s):`);
  for (const msg of failures) console.error(`  ✗ ${msg}`);
  process.exit(1);
}
console.log("\nAll B112 / B114 / B115 checks passed.");
