#!/usr/bin/env node
/**
 * B112 auto-nodes + B114 node-map layout + B115 Wire Kit smoke (module 0.3.55; device catalog 0.3.49).
 *
 * Run: node tools/b112-b115-smoke.mjs
 * Does not write Scene JSON. Asserts gold-line-scene.mjs is untouched.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { parseRoomName, planAutoNodes, isDoorWall, isCamName, wallCenter, AUTO_NODE_TOKEN_ART, AUTO_KIND, lightControlName, maglockName, camControlsName, ROOM_SPLIT, tokenArtFor, tokenArtForNode } from "../scripts/wired-auto-nodes.mjs";
import { layoutNodes, shortNodeName, minSeparation, roomPrefix } from "../scripts/wired-layout.mjs";
import { NODE_TOKEN_LIBRARY, tokenSrcForStyle } from "../scripts/wired-node-art.mjs";
import { MATRIX_VERBS, MATRIX_VERB_IDS, MATRIX_VERB_DSIDS, WIRE_KIT_ID, WIRE_KIT_DSID, WIRE_KIT_UUID } from "../scripts/wired-verbs.mjs";
import { actorHasConnectInterface, itemIsConnectInterface } from "../scripts/wired-console-verbs.mjs";
import { actorHasKit, isDroneActor, isMachineActor, isVehicleActor, isWireKit } from "../scripts/wired-kit.mjs";

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

console.log("B112 / B114 / B115 Wired Gold Line smoke (0.3.55)\n");

const moduleJson = readBomFreeJson("module.json");
ok((() => {
  const [maj, min, pat] = String(moduleJson.version).split(".").map(Number);
  return maj === 0 && min === 3 && pat >= 55;
})(), `module.json is 0.3.55+ (got ${moduleJson.version})`);

const goldDiff = execFileSync("git", ["diff", "--", "scripts/gold-line-scene.mjs"], { encoding: "utf8" });
ok(!goldDiff.trim(), "scripts/gold-line-scene.mjs is unmodified");

ok(AUTO_NODE_TOKEN_ART["light-control"]?.endsWith("/node-light-control.webp"), "B113 Light Control art path");
ok(AUTO_NODE_TOKEN_ART.maglock?.endsWith("/node-maglock.webp"), "B113 Maglock art path");
ok(AUTO_NODE_TOKEN_ART["cam-controls"]?.endsWith("/node-cam-controls.webp"), "B113 Cam Controls art path");
ok(tokenArtFor("light-control") === AUTO_NODE_TOKEN_ART["light-control"], "tokenArtFor Light Control");
ok(tokenArtForNode({ autoFrom: { kind: AUTO_KIND.maglock } })?.endsWith("node-maglock.webp"), "tokenArtForNode Maglock");
ok(tokenArtForNode({ autoFrom: { kind: AUTO_KIND.cam } })?.endsWith("node-cam-controls.webp"), "tokenArtForNode Cam Controls");
ok(!tokenArtForNode({ autoFrom: null }), "manual nodes keep generic Track templates");
ok(tokenArtForNode({ tokenStyle: "light-control" })?.endsWith("node-light-control.webp"), "tokenStyle light-control uses B113 filename");
ok(tokenArtForNode({ tokenStyle: "black-ice" })?.endsWith("/node-black-ice.webp"), "tokenStyle black-ice uses catalog file");
ok(tokenArtForNode({ tokenStyle: "camera-grid" })?.endsWith("/camera-grid.webp"), "unknown tokenStyle is drop-in <id>.webp");
ok(!tokenArtForNode({ tokenStyle: "../secret" }), "tokenStyle rejects path junk");
const library = readBomFreeJson("assets/tokens/wired/library.json");
const catalogIds = ["light-control", "maglock", "black-ice", "normal-ice", "mechanical", "turret-controls", "cam-controls", "data-vault"];
const atlasIds = ["node-relay", "node-host", "node-segment"];
const hostTickers = ["HAL", "FER", "MER", "CAD", "IRN", "ARG", "VER", "OBS", "SAN", "NYX", "AEQ", "LAZ"];
const deviceStyles = library.styles.filter(s => s.family !== "atlas");
const atlasStyles = library.styles.filter(s => s.family === "atlas" && !s.hostTicker);
const hostStyles = library.styles.filter(s => s.hostTicker);
ok(NODE_TOKEN_LIBRARY.length === 23 && library.styles.length === 23, "catalog is 8 device + 3 atlas + 12 megacorp Hosts");
ok(deviceStyles.length === 8 && NODE_TOKEN_LIBRARY.filter(s => s.family !== "atlas").length === 8, "B116 device catalog is 8 styles");
ok(NODE_TOKEN_LIBRARY.filter(s => s.family !== "atlas").map(s => s.id).join(",") === catalogIds.join(","), "device catalog id order is the locked full set");
ok(atlasStyles.map(s => s.id).join(",") === atlasIds.join(","), "atlas styles are node-relay / node-host / node-segment");
ok(atlasStyles.every(s => s.placeholder === false), "atlas rows are not placeholders");
ok(atlasStyles.every(s => s.family === "atlas"), "atlas rows keep family=atlas");
ok(hostStyles.map(s => s.hostTicker).join(",") === hostTickers.join(","), "megacorp Host tickers are the locked Twelve");
ok(hostStyles.every(s => s.family === "atlas" && s.altitude === "region" && s.id === `node-host-${s.hostTicker.toLowerCase()}`), "megacorp Hosts are atlas region skins");
ok(hostStyles.every(s => s.placeholder === false), "Twelve Host skins ship art (placeholder false)");
ok(hostStyles.map(s => s.hostTicker).join(",") === "HAL,FER,MER,CAD,IRN,ARG,VER,OBS,SAN,NYX,AEQ,LAZ", "Host ticker order is the locked Twelve");
ok(NODE_TOKEN_LIBRARY.every(s => library.styles.some(row => row.id === s.id && row.file === s.file && row.png === s.png && row.name === s.name && row.autoKind === s.autoKind && Boolean(row.placeholder) === Boolean(s.placeholder) && row.family === s.family && row.altitude === s.altitude && row.hostTicker === s.hostTicker)), "mjs catalog matches library.json rows");
ok(library.styles.filter(s => s.autoKind).map(s => s.id).join(",") === "light-control,maglock,cam-controls", "autoKinds are Light / Maglock / Cam only");
for (const style of deviceStyles) {
  ok(existsSync(`assets/tokens/wired/${style.file}`) && existsSync(`assets/tokens/wired/${style.png}`), `library style ${style.id} has png+webp`);
  if (style.autoKind) ok(AUTO_NODE_TOKEN_ART[style.autoKind]?.endsWith(`/${style.file}`), `${style.id} autoKind matches AUTO_NODE_TOKEN_ART`);
}
ok(tokenSrcForStyle("maglock") === AUTO_NODE_TOKEN_ART.maglock, "tokenSrcForStyle maglock");
ok(tokenSrcForStyle("data-vault")?.endsWith("/node-data-vault.webp"), "tokenSrcForStyle data-vault");
ok(tokenSrcForStyle("node-relay")?.endsWith("/node-relay.webp") && tokenSrcForStyle("node-host")?.endsWith("/node-host.webp") && tokenSrcForStyle("node-segment")?.endsWith("/node-segment.webp"), "atlas styles resolve to webp paths");
ok(tokenSrcForStyle("node-host-hal")?.endsWith("/node-host-hal.webp"), "megacorp Host HAL resolves");
ok(tokenArtForNode({ tokenStyle: "node-host-nyx" })?.endsWith("/node-host-nyx.webp"), "tokenArtForNode megacorp Host NYX");
ok(library.styles.find(s => s.id === "node-host")?.name === "Host" && !library.styles.find(s => s.id === "node-host")?.hostTicker, "generic node-host stays default Host");
for (const style of [...deviceStyles, ...atlasStyles, ...hostStyles.filter(s => !s.placeholder)]) {
  const stem = style.png.replace(/\.png$/i, "");
  const png = `assets/tokens/wired/${style.png}`;
  const webp = `assets/tokens/wired/${style.file}`;
  ok(existsSync(png) && existsSync(webp), `B113/B116 ships ${stem} png + webp`);
  const pngBuf = readFileSync(png);
  const webpBuf = readFileSync(webp);
  ok(pngBuf[0] === 0x89 && pngBuf.slice(1, 4).toString() === "PNG", `${stem}.png is a PNG source`);
  ok(pngBuf.readUInt32BE(16) === 1254 && pngBuf.readUInt32BE(20) === 1254, `${stem}.png is Michael 1254² source`);
  ok(webpBuf.slice(0, 4).toString() === "RIFF" && webpBuf.slice(8, 12).toString() === "WEBP", `${stem}.webp is WebP`);
  if (style.family !== "atlas" && webpBuf.slice(12, 16).toString() === "VP8X") {
    const w = 1 + webpBuf.readUIntLE(24, 3);
    const h = 1 + webpBuf.readUIntLE(27, 3);
    ok(w === 1024 && h === 1024, `${stem}.webp is 1024² Foundry token`);
  }
}
for (const id of atlasIds) {
  ok(existsSync(`assets/tokens/wired/${id}.png`) && existsSync(`assets/tokens/wired/${id}.webp`), `atlas ${id} ships png+webp`);
}

console.log("\n1) Room naming (B112)");
ok(ROOM_SPLIT === " - ", "ROOM_SPLIT is space-hyphen-space");
ok(lightControlName("Rear Car Substation") === "Rear Car Substation - Light Control", "Light Control is {Room} - Light Control");
ok(maglockName("Rear Car Substation", 1) === "Rear Car Substation - Maglock Door 1", "Maglock Door 1 uses dash after room");
ok(maglockName("Rear Car Substation", 2) === "Rear Car Substation - Maglock Door 2", "Maglock Door 2 uses dash after room");
ok(maglockName("Rear Car Substation", 1) !== "Rear Car Substation Maglock Door 1", "Maglock names are not undashed");
ok(camControlsName("Security Nest", 1) === "Security Nest - Cam Controls 1", "Cam Controls 1 uses dash after room");
ok(camControlsName("Security Nest", 2) === "Security Nest - Cam Controls 2", "Cam Controls 2 numbers per room");
ok(isCamName("Security Nest - Cam 1") && isCamName("Cab - Camera") && isCamName("Aft Freight - Cam Controls"), "rest with Cam / Camera / Cam Controls is a cam");
ok(isCamName("Cab - Cams") && isCamName("Nest - cameras"), "plural cam / cameras match");
ok(!isCamName("Aft Freight - Work Light") && !isCamName("Cab - Light Control"), "ordinary lights are not cams");
ok(parseRoomName("Rear Car Substation - Light Control") === "Rear Car Substation", "Rear Car Substation - Light Control → Rear Car Substation");
ok(parseRoomName("Aft Freight - Work Light") === "Aft Freight", "Aft Freight - Work Light → Aft Freight");
ok(parseRoomName("Cab - Light Control") === "Cab", "Cab - Light Control → Cab");
ok(parseRoomName("R2 - Wire Closet Light") === "R2", "first splitter only → R2");
ok(parseRoomName("Rear Bay Work Light") === "", "no splitter → skip (not first-word)");
ok(parseRoomName("Cab Light") === "", "Cab Light without splitter → skip");
ok(parseRoomName("  ") === "", "blank name is empty");
ok(parseRoomName("Security Nest Control Panel") === "", "no splitter, no keyword fallback");
ok(!isDoorWall({ door: 0 }), "door NONE is skipped");
ok(isDoorWall({ door: 1 }), "door DOOR is kept");
ok(isDoorWall({ door: 2 }), "secret door is kept");
const mid = wallCenter({ c: [0, 0, 10, 4] });
ok(mid.x === 5 && mid.y === 2, "wallCenter averages endpoints");

console.log("\n2) Auto-node plan (B112)");
let ids = 0;
const idFactory = () => `n${String(++ids).padStart(3, "0")}`;
const lights = [
  { id: "L1", name: "Aft Freight - Work Light", x: 100, y: 50 },
  { id: "L1b", name: "Aft Freight - Work Light 2", x: 120, y: 50 },
  { id: "L2", name: "Security Nest - Light", x: 400, y: 50 },
  { id: "C1", name: "Security Nest - Cam 1", x: 420, y: 50 },
  { id: "C2", name: "Security Nest - Camera", x: 430, y: 55 },
  { id: "L3", name: "Cab - Light Control", x: 800, y: 40 },
  { id: "L4", name: "Rear Car Substation - Light Control", x: 900, y: 40 },
  { id: "skip", name: "Cab Light", x: 0, y: 0 },
];
const doors = [
  { id: "D1", name: "", x: 110, y: 80 },
  { id: "D2", name: "", x: 130, y: 80 },
  { id: "D3", name: "Security Nest Maglock", x: 410, y: 90 },
  { id: "D4", name: "", x: 805, y: 70 },
];
const plan = planAutoNodes({ lights, doors, existing: [], replace: false, idFactory });
ok(plan.rooms.includes("Aft Freight") && plan.rooms.includes("Security Nest") && plan.rooms.includes("Cab") && plan.rooms.includes("Rear Car Substation"), "four rooms from dashed lights");
ok(plan.rooms.length === 4, `unique rooms (got ${plan.rooms.length})`);
ok(plan.skippedLights.length === 1 && plan.skippedLights[0].id === "skip", "light without “ - ” is skipped");
const lightNodes = plan.created.filter(n => n.autoFrom.kind === AUTO_KIND.light);
ok(lightNodes.length === 4, `one Light Control per room (got ${lightNodes.length})`);
ok(lightNodes.every(n => n.track === 1 && n.rating === 1), "Light Control is T1 R1");
ok(lightNodes.some(n => n.name === "Aft Freight - Light Control"), "Aft Freight - Light Control name");
ok(lightNodes.some(n => n.name === "Rear Car Substation - Light Control"), "Rear Car Substation - Light Control name");
ok(lightNodes.every(n => n.name.includes(ROOM_SPLIT)), "every Light Control name uses “ - ”");
const maglocks = plan.created.filter(n => n.autoFrom.kind === AUTO_KIND.maglock);
ok(maglocks.length === 4, `one maglock per door (got ${maglocks.length})`);
ok(maglocks.every(n => n.track === 1 && n.rating === 2), "Maglocks are T1 R2");
ok(plan.nodes.some(n => n.name === "Aft Freight - Maglock Door 1") && plan.nodes.some(n => n.name === "Aft Freight - Maglock Door 2"), "per-room door numbering with dash");
ok(plan.nodes.some(n => n.name === "Security Nest - Maglock Door 1"), "unnamed door uses nearest dashed light, not first-word door name");
ok(!plan.nodes.some(n => n.name === "Aft Freight Maglock Door 1" || n.name === "Rear Car Substation Maglock Door 1"), "no undashed Maglock names");
ok(maglocks.every(n => n.name.includes(ROOM_SPLIT) && / - Maglock Door \d+$/.test(n.name)), "every Maglock name is {Room} - Maglock Door N");
ok(lightNodes.every(n => n.tokenStyle === AUTO_KIND.light), "Light Control tokenStyle is light-control");
ok(maglocks.every(n => n.tokenStyle === AUTO_KIND.maglock), "Maglock tokenStyle is maglock");
ok(lightNodes.every(n => n.notes.includes("node-light-control.webp")), "Light Control notes cite B113 art");
ok(maglocks.every(n => n.notes.includes("node-maglock.webp")), "Maglock notes cite B113 art");
const nestLight = plan.nodes.find(n => n.name === "Security Nest - Light Control");
ok(nestLight?.autoFrom.lightIds.join(",") === "L2", "cam light ids are not on Light Control");
ok(!nestLight.autoFrom.lightIds.includes("C1") && !nestLight.autoFrom.lightIds.includes("C2"), "Security Nest cams stay off the lighting grid");
const cams = plan.created.filter(n => n.autoFrom.kind === AUTO_KIND.cam);
ok(cams.length === 2, `one Cam Controls per cam light (got ${cams.length})`);
ok(cams.every(n => n.track === 1 && n.rating === 1), "Cam Controls is T1 R1");
ok(plan.nodes.some(n => n.name === "Security Nest - Cam Controls 1") && plan.nodes.some(n => n.name === "Security Nest - Cam Controls 2"), "per-room cam numbering with dash");
ok(cams.every(n => n.name.includes(ROOM_SPLIT) && / - Cam Controls \d+$/.test(n.name)), "every Cam Controls name is {Room} - Cam Controls N");
ok(cams.every(n => n.tokenStyle === AUTO_KIND.cam), "Cam Controls tokenStyle is cam-controls");
ok(cams.every(n => n.notes.includes("node-cam-controls.webp")), "Cam Controls notes cite B113 art");
ok(cams.every(n => nestLight.links.includes(n.id) && n.links.includes(nestLight.id)), "Light Control linked to same-room Cam Controls");
const aftLight = plan.nodes.find(n => n.name === "Aft Freight - Light Control");
const aftDoors = plan.nodes.filter(n => n.autoFrom?.room === "Aft Freight" && n.autoFrom.kind === AUTO_KIND.maglock);
ok(aftDoors.every(d => aftLight.links.includes(d.id) && d.links.includes(aftLight.id)), "Light Control linked to same-room maglocks");

ids = 200;
const camOnly = planAutoNodes({
  lights: [{ id: "C3", name: "Courier Bay - Cam 1", x: 10, y: 10 }],
  doors: [{ id: "D9", name: "", x: 12, y: 20 }],
  existing: [],
  replace: false,
  idFactory,
});
ok(camOnly.rooms.includes("Courier Bay"), "cam-only room still seeds roomMap");
ok(!camOnly.created.some(n => n.autoFrom.kind === AUTO_KIND.light), "cam-only room has no Light Control");
ok(camOnly.created.some(n => n.name === "Courier Bay - Cam Controls 1"), "cam-only room still gets Cam Controls");
ok(camOnly.created.some(n => n.name === "Courier Bay - Maglock Door 1"), "nearest-room maglock uses cam-only room");

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
  const light = { id: `g${++nid}`, name: `${room} - Light Control`, links: [], track: 1, rating: 1 };
  const d1 = { id: `g${++nid}`, name: `${room} - Maglock Door 1`, links: [], track: 1, rating: 2 };
  const d2 = { id: `g${++nid}`, name: `${room} - Maglock Door 2`, links: [], track: 1, rating: 2 };
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
ok(shortNodeName("Rear Bay - Light Control", { dense: true }).includes("LC"), "Light Control compresses to LC");
ok(shortNodeName("Security Nest - Cam Controls 1").includes("Cam"), "Cam Controls compresses to Cam");
ok(shortNodeName("Cab - Maglock Door 2", { dense: true }).length <= 14, "dense labels truncate");
ok(roomPrefix("Rear Bay - Maglock Door 1") === "Rear Bay", "roomPrefix splits Maglock names on “ - ”");
ok(roomPrefix("Rear Car Substation - Maglock Door 2") === "Rear Car Substation", "roomPrefix keeps full room left of first “ - ”");
ok(laid.mode === "cluster", "dashed Gold Line names cluster by room");

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
ok(kit.flags["draw-steel-ghostwire"].wired.connectInterface === true, "Wire Kit pack stamps connectInterface");
ok(kit.folder === "coyCmRxnu5opxytj", "lives in Matrix Support folder");
ok(itemIsConnectInterface(kit), "itemIsConnectInterface sees pack Wire Kit");
ok(itemIsConnectInterface({ flags: { "draw-steel-ghostwire": { kind: "wire-kit" } } }), "kind wire-kit is a Connect interface");
ok(actorHasConnectInterface({ items: [{ system: { _dsid: WIRE_KIT_DSID }, flags: { "draw-steel-ghostwire": { kind: "wire-kit" } } }] }), "NPC/drone with Wire Kit can Connect without a commlink");

const src = readFileSync("scripts/wired-kit.mjs", "utf8");
ok(src.includes("grantMatrixVerbs") && src.includes("addWireKitToSelected"), "wired-kit grants + selected-token helper");
ok(src.includes("wired.connectInterface"), "HUD grant stamps connectInterface");
ok(src.includes("stampWireKitOnMachines") && src.includes("stampWireKitOnDrones"), "world ready migrates drone and vehicle Actors missing the kit");
ok(src.includes("actor.type === \"hero\""), "heroes are not auto-stamped");
ok(!/for \(const actor of game\.actors\)/.test(src) || src.includes("stampWireKitOnDrones"), "drone migration is kit-stamp only, not a verb grant scan");
ok(readFileSync("scripts/machines.mjs", "utf8").includes("addWireKit"), "Deploy stamps Wire Kit on drone and vehicle Actors");

console.log("\n4b) Pack drone templates carry Wire Kit (not Overlay)");
for (const band of ["micro", "small", "medium"]) {
  const drone = readBomFreeJson(`src/packs/summons/machines/machine-drone-${band}.json`);
  ok(drone.flags["draw-steel-ghostwire"].kind === "drone", `${band} template kind is drone`);
  ok(isDroneActor(drone), `isDroneActor sees ${band} template`);
  ok(drone.items.some(isWireKit), `${band} template embeds Wire Kit`);
  ok(actorHasKit(drone), `actorHasKit sees ${band} Wire Kit`);
  ok(itemIsConnectInterface(drone.items.find(isWireKit)), `${band} Wire Kit is a Connect interface`);
  ok(!drone.items.some(item => MATRIX_VERB_DSIDS.includes(item.system?._dsid)), `${band} template has none of the nine Matrix Verbs`);
  const wired = drone.flags["draw-steel-ghostwire"].wired;
  ok(!wired?.state && wired?.connected !== true, `${band} template is not auto-Overlay / auto-Connected`);
}
ok(isVehicleActor(readBomFreeJson("src/packs/summons/machines/machine-vehicle-car.json")), "isVehicleActor sees car template");
ok(!isDroneActor(readBomFreeJson("src/packs/summons/machines/machine-vehicle-car.json")), "vehicle templates are not drones");

console.log("\n4b2) Pack vehicle templates carry Wire Kit (not Overlay)");
for (const band of ["bike", "car", "heavy", "air", "water", "space"]) {
  const vehicle = readBomFreeJson(`src/packs/summons/machines/machine-vehicle-${band}.json`);
  ok(vehicle.flags["draw-steel-ghostwire"].kind === "vehicle", `${band} template kind is vehicle`);
  ok(isVehicleActor(vehicle) && isMachineActor(vehicle), `isVehicleActor/isMachineActor sees ${band} template`);
  ok(vehicle.items.some(isWireKit), `${band} template embeds Wire Kit`);
  ok(actorHasKit(vehicle), `actorHasKit sees ${band} Wire Kit`);
  ok(itemIsConnectInterface(vehicle.items.find(isWireKit)), `${band} Wire Kit is a Connect interface`);
  ok(!vehicle.items.some(item => MATRIX_VERB_DSIDS.includes(item.system?._dsid)), `${band} template has none of the nine Matrix Verbs`);
  const wired = vehicle.flags["draw-steel-ghostwire"].wired;
  ok(!wired?.state && wired?.connected !== true, `${band} template is not auto-Overlay / auto-Connected`);
}

console.log("\n4b3) Plot vehicles (Nox) carry Wire Kit");
const nox = readBomFreeJson("src/packs/deadhead/nox-trash-freighter.json");
ok(nox.flags["draw-steel-ghostwire"].kind === "vehicle", "Nox kind is vehicle");
ok(isVehicleActor(nox) && isMachineActor(nox), "isVehicleActor sees Nox freighter");
ok(nox.items.some(isWireKit), "Nox freighter embeds Wire Kit");
ok(itemIsConnectInterface(nox.items.find(isWireKit)), "Nox Wire Kit is a Connect interface");
ok(!nox.items.some(item => MATRIX_VERB_DSIDS.includes(item.system?._dsid)), "Nox has none of the nine Matrix Verbs");
ok(!nox.flags["draw-steel-ghostwire"].wired?.state, "Nox is not auto-Overlay");

console.log("\n4b4) Named street SKU vehicles carry Wire Kit");
for (const [file, label] of [
  ["src/packs/summons/machines/lane-hopper.json", "Lane-Hopper"],
  ["src/packs/summons/machines/star-chopper.json", "Star-Chopper"],
  ["src/packs/summons/machines/bulldog.json", "Bulldog"],
]) {
  const actor = readBomFreeJson(file);
  ok(actor.flags["draw-steel-ghostwire"].kind === "vehicle", `${label} kind is vehicle`);
  ok(isVehicleActor(actor), `isVehicleActor sees ${label}`);
  ok(actor.items.some(isWireKit), `${label} embeds Wire Kit`);
  ok(itemIsConnectInterface(actor.items.find(isWireKit)), `${label} Wire Kit is a Connect interface`);
  ok(!actor.items.some(item => MATRIX_VERB_DSIDS.includes(item.system?._dsid)), `${label} has none of the nine Matrix Verbs`);
}

console.log("\n4b5) Named Mule-Bot Director Actor (dual Item + Actor)");
const muleActor = readBomFreeJson("src/packs/summons/machines/mule-bot.json");
ok(muleActor.type === "npc", "Mule-Bot pack document is an Actor");
ok(muleActor.flags["draw-steel-ghostwire"].kind === "drone", "Mule-Bot kind is drone");
ok(muleActor.flags["draw-steel-ghostwire"].dsid === "mule-bot", "Mule-Bot Actor dsid is mule-bot");
ok(isDroneActor(muleActor) && isMachineActor(muleActor), "isDroneActor sees Mule-Bot");
ok(!isVehicleActor(muleActor), "Mule-Bot is not a crewed vehicle Actor");
ok(muleActor.items.some(isWireKit), "Mule-Bot embeds Wire Kit");
ok(itemIsConnectInterface(muleActor.items.find(isWireKit)), "Mule-Bot Wire Kit is a Connect interface");
ok(!muleActor.items.some(item => MATRIX_VERB_DSIDS.includes(item.system?._dsid)), "Mule-Bot has none of the nine Matrix Verbs");
ok(muleActor.flags["draw-steel-ghostwire"].gearItemUuid?.endsWith("KBZhF1Z1L67t1gU4"), "Mule-Bot Actor links the Vehicles SKU");

console.log("\n4c) Mule-Bot / Drone (Medium) cargo plate");
const muleToken = "modules/draw-steel-ghostwire/assets/tokens/drones/mule-bot.webp";
const mulePng = "assets/tokens/drones/mule-bot.png";
const muleWebp = "assets/tokens/drones/mule-bot.webp";
ok(existsSync(mulePng) && existsSync(muleWebp), "mule-bot png + webp ship");
const mulePngBuf = readFileSync(mulePng);
const muleWebpBuf = readFileSync(muleWebp);
ok(mulePngBuf[0] === 0x89 && mulePngBuf.slice(1, 4).toString() === "PNG", "mule-bot.png is a PNG source");
ok(mulePngBuf.readUInt32BE(16) === 1254 && mulePngBuf.readUInt32BE(20) === 1254, "mule-bot.png is Michael 1254² source");
ok(muleWebpBuf.slice(0, 4).toString() === "RIFF" && muleWebpBuf.slice(8, 12).toString() === "WEBP", "mule-bot.webp is WebP");
ok(muleWebpBuf.slice(12, 16).toString() === "VP8X", "mule-bot.webp is VP8X");
{
  const w = 1 + muleWebpBuf.readUIntLE(24, 3);
  const h = 1 + muleWebpBuf.readUIntLE(27, 3);
  ok(w === 1024 && h === 1024, "mule-bot.webp is 1024² Foundry token");
}
ok(readBomFreeJson("src/packs/vehicles/drones/mule-bot.json").img === muleToken, "Mule-Bot Item img is the cargo plate");
ok(readBomFreeJson("src/packs/vehicles/drones/mule-bot.json").type === "treasure", "Mule-Bot buy SKU remains treasure");
ok(muleActor.img === muleToken, "named Mule-Bot Actor img is the cargo plate");
ok(muleActor.prototypeToken?.texture?.src === muleToken, "named Mule-Bot prototypeToken uses the cargo plate");
ok(muleActor.prototypeToken?.actorLink === true, "named Mule-Bot token is actor-linked");
const medium = readBomFreeJson("src/packs/summons/machines/machine-drone-medium.json");
ok(medium.img === muleToken, "Drone (Medium) Actor img is the cargo plate");
ok(medium.prototypeToken?.texture?.src === muleToken, "Drone (Medium) prototypeToken uses the cargo plate");
ok(medium.items.some(isWireKit), "Drone (Medium) still embeds Wire Kit");
ok(!medium.img.includes("robotics-frame-steel-blue"), "Drone (Medium) is not the steel-blue placeholder");
ok(medium.flags["draw-steel-ghostwire"].dsid === "machine-drone-medium", "Drone (Medium) stays the generic band");
ok(medium.name !== muleActor.name, "Drone (Medium) is not named Mule-Bot");
ok(/mule-bot/.test(readFileSync("docs/spikes/B101-VEHICLE-DRONE-TOKEN-ART.md", "utf8")), "B101 documents Mule-Bot cargo plate");
ok(/mule-bot/.test(readFileSync("docs/spikes/B115-NPC-WIRE-KIT.md", "utf8")), "B115 documents Mule-Bot / Drone (Medium) art");

console.log("\n5) Console / minimap / docs");
const consoleSrc = readFileSync("scripts/wired-console.mjs", "utf8");
ok(consoleSrc.includes("autoNodes") && consoleSrc.includes("applyAutoNodesFromScene"), "Console wires Auto-nodes");
ok(consoleSrc.includes("tokenArtForNode"), "Place on canvas stamps B113 art for auto-nodes");
ok(consoleSrc.includes("NODE_TOKEN_LIBRARY"), "Console lists the node token library");
ok(consoleSrc.includes("addWireKit"), "Console wires Add Wire Kit");
ok(consoleSrc.includes("autoFrom"), "getBoard preserves autoFrom");
ok(consoleSrc.includes("tokenStyle"), "getBoard preserves tokenStyle");
ok(readFileSync("scripts/wired-auto-nodes.mjs", "utf8").includes("ROOM_SPLIT") && !readFileSync("scripts/wired-auto-nodes.mjs", "utf8").includes("first two words"), "parser is dash-split only");
ok(!consoleSrc.includes("gold-line-scene"), "Console does not import gold-line-scene");
const template = readFileSync("templates/wired-console.hbs", "utf8");
ok(template.includes("data-action=\"autoNodes\"") && template.includes("data-action=\"addWireKit\""), "Console template has both GM buttons");
ok(template.includes("data-field=\"tokenStyle\"") && template.includes("tokenStyleOptions"), "Console Token art select");
const mini = readFileSync("templates/wired-minimap.hbs", "utf8");
ok(mini.includes("wm-viewport") && mini.includes("shortName") && mini.includes("resetView"), "minimap has viewport, truncated names, reset");
ok(readFileSync("scripts/wired-minimap.mjs", "utf8").includes("layoutNodes"), "minimap uses shared layout");
ok(readFileSync("scripts/wired-node-tokens.mjs", "utf8").includes("textureSrc"), "placeNode accepts B113 textureSrc");
ok(readFileSync("scripts/wired-node-tokens.mjs", "utf8").includes("tokenSrcForStyle"), "sync stamps tokenStyle art onto placed tokens");
ok(readFileSync("scripts/wired-auto-nodes.mjs", "utf8").includes("node-light-control.webp") && readFileSync("scripts/wired-auto-nodes.mjs", "utf8").includes("node-maglock.webp") && readFileSync("scripts/wired-auto-nodes.mjs", "utf8").includes("node-cam-controls.webp"), "auto-nodes stamp Light/Maglock/Cam art");
ok(!readFileSync("scripts/wired-auto-nodes.mjs", "utf8").includes("placeholder (generic Track 1)"), "auto-node notes are not B113 placeholders");

const lang = readBomFreeJson("lang/en.json");
ok(lang.GHOSTWIRE.WiredConsole.AutoNodes === "Auto-nodes from Scene", "lang AutoNodes");
ok(lang.GHOSTWIRE.WiredConsole.AutoNodesRule.includes("Rear Car Substation - Light Control"), "lang documents locked room rule");
ok(lang.GHOSTWIRE.WiredConsole.AutoNodesRule.includes("Rear Car Substation - Maglock Door 1"), "lang Maglock names use dash after room");
ok(lang.GHOSTWIRE.WiredConsole.AutoNodesRule.includes("{Room} - Light Control"), "lang Light Control stays {Room} - Light Control");
ok(lang.GHOSTWIRE.WiredConsole.AutoNodesRule.includes("{Room} - Cam Controls 1"), "lang Cam Controls names use dash after room");
ok(lang.GHOSTWIRE.WiredConsole.TokenStyle === "Token art", "lang TokenStyle");
ok(lang.GHOSTWIRE.WiredConsole.TokenStyleGeneric.includes("Generic"), "lang TokenStyleGeneric");
ok(!lang.GHOSTWIRE.WiredConsole.AutoNodesRule.includes("Rear Car Substation Maglock Door"), "lang does not document undashed Maglock names");
ok(lang.GHOSTWIRE.WiredConsole.AutoNodesUnsplit.includes("{Room} - Light Control"), "lang warns on missing splitter");
ok(lang.GHOSTWIRE.WiredMinimap.PanHint.toLowerCase().includes("zoom"), "lang pan/zoom hint");
ok(lang.GHOSTWIRE.Matrix.Items.WireKit.Name.includes("Matrix Verbs"), "lang Wire Kit name");
ok(lang.GHOSTWIRE.WiredKit.NoSelection.includes("NPC"), "lang kit needs NPC selection");

const b112 = readFileSync("docs/spikes/B112-SCENE-WIRE-AUTO-NODES.md", "utf8");
ok(b112.includes("0.3.49"), "B112 spike");
ok(b112.includes("Rear Car Substation - Maglock Door 1"), "B112 spike Maglock dash lock");
ok(b112.includes("{Room} - Light Control"), "B112 spike Light Control dash");
ok(b112.includes("Wrong: `Rear Car Substation Maglock Door 1`"), "B112 spike marks undashed Maglock as wrong");
ok(readFileSync("docs/spikes/B114-NODE-MAP-READABILITY.md", "utf8").includes("0.3.49"), "B114 spike");
ok(readFileSync("docs/spikes/B115-NPC-WIRE-KIT.md", "utf8").includes("0.3.49"), "B115 spike");
ok(/Connect interface/.test(readFileSync("docs/spikes/B115-NPC-WIRE-KIT.md", "utf8")), "B115 spike documents Connect interface");
ok(/pack drone/.test(readFileSync("docs/spikes/B115-NPC-WIRE-KIT.md", "utf8")), "B115 spike documents pack drone Wire Kit stamp");
ok(/machine-vehicle|pack drone and vehicle|vehicles/.test(readFileSync("docs/spikes/B115-NPC-WIRE-KIT.md", "utf8")), "B115 spike documents pack vehicle Wire Kit stamp");
ok(/Wrench drone control/.test(readFileSync("docs/spikes/B115-NPC-WIRE-KIT.md", "utf8")), "B115 spike documents Wrench drone control as Connect");
ok(b112.includes("B113"), "B112 notes B113 art");
ok(b112.includes("Cam Controls"), "B112 spike cameras-in-scope");
ok(readFileSync("docs/spikes/B113-LIGHT-MAGLOCK-TOKEN-ART.md", "utf8").includes("node-light-control.webp"), "B113 spike");
ok(readFileSync("docs/spikes/B116-NODE-TOKEN-LIBRARY.md", "utf8").includes("library.json"), "B116 spike");
ok(readFileSync("docs/spikes/B116-NODE-TOKEN-LIBRARY.md", "utf8").includes("data-vault"), "B116 spike lists Data Vault");
ok(readFileSync("docs/spikes/B116-NODE-TOKEN-LIBRARY.md", "utf8").includes("SHIPPED"), "B116 spike is shipped");

if (failures.length) {
  console.error(`\n${failures.length} failure(s):`);
  for (const msg of failures) console.error(`  ✗ ${msg}`);
  process.exit(1);
}
console.log("\nAll B112 / B114 / B115 checks passed.");
