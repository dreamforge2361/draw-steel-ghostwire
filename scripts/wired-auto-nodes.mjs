// Scene → Wire auto-nodes (B112). Pure planning lives here so smoke tests can import without Foundry.
// Foundry glue (read Scene lights/doors, write wiredBoard, place tokens) is in applyAutoNodesFromScene.

import { RATING } from "./wired-node-templates.mjs";
import { boardScene, placeNode, placedNodeActor, removePlacedNode } from "./wired-node-tokens.mjs";
import { tokenSrcForStyle } from "./wired-node-art.mjs";

const MODULE_ID = "draw-steel-ghostwire";

/** B113: Light Control / Maglock / Cam Controls defaults. Generic Track 1/2 templates stay for other nodes. */
export const AUTO_NODE_TOKEN_ART = {
  "light-control": tokenSrcForStyle("light-control"),
  maglock: tokenSrcForStyle("maglock"),
  "cam-controls": tokenSrcForStyle("cam-controls"),
};

export function tokenArtFor(kind) {
  return AUTO_NODE_TOKEN_ART[kind] || null;
}

/** Director `tokenStyle` (B116) wins; else locked auto Light/Maglock/Cam art. */
export function tokenArtForNode(node) {
  return tokenSrcForStyle(node?.tokenStyle) || tokenArtFor(node?.autoFrom?.kind);
}

export const AUTO_KIND = {
  light: "light-control",
  maglock: "maglock",
  cam: "cam-controls",
};

/** Michael lock (2026-09-20): `{Room Name} - {rest…}` — space-hyphen-space, first occurrence. */
export const ROOM_SPLIT = " - ";

/**
 * Room name from a light (or a door that uses the same pattern).
 *
 * Locked rule: `{Room Name} - {rest…}`. Room = everything left of the first
 * ` - ` (space-hyphen-space). No first-word fallback — missing splitter → "".
 *
 * Example: "Rear Car Substation - Light Control" → "Rear Car Substation"
 * → Light Control node "Rear Car Substation - Light Control".
 */
export function parseRoomName(name) {
  const raw = String(name ?? "").trim();
  if (!raw) return "";
  const idx = raw.indexOf(ROOM_SPLIT);
  if (idx <= 0) return "";
  return raw.slice(0, idx).trim();
}

/** `{Room} - Light Control` — matches the light name pattern. */
export const lightControlName = room => `${room}${ROOM_SPLIT}Light Control`;
/** `{Room} - Maglock Door N` — same ` - ` after the room (never `{Room} Maglock Door N`). */
export const maglockName = (room, n) => `${room}${ROOM_SPLIT}Maglock Door ${n}`;

/** `{Room} - Cam Controls N` — one node per cam light / named cam. */
export const camControlsName = (room, n) => `${room}${ROOM_SPLIT}Cam Controls ${n}`;

/**
 * True when the name’s rest (right of first ` - `) is a camera, not a light.
 * Examples: “Security Nest - Cam 1”, “Cab - Camera”, “Aft Freight - Cam Controls”.
 */
export function isCamName(name) {
  const raw = String(name ?? "").trim();
  const idx = raw.indexOf(ROOM_SPLIT);
  const rest = (idx >= 0 ? raw.slice(idx + ROOM_SPLIT.length) : raw).trim();
  if (!rest) return false;
  return /\bcam(?:era)?s?\b/i.test(rest);
}

export function isDoorWall(wall, noneValue = 0) {
  const door = wall?.door;
  if (door === undefined || door === null || door === false) return false;
  if (door === noneValue || door === "NONE" || door === "none") return false;
  return Number(door) !== noneValue;
}

export function wallCenter(wall) {
  const c = wall?.c;
  if (Array.isArray(c) && c.length >= 4) {
    return { x: (Number(c[0]) + Number(c[2])) / 2, y: (Number(c[1]) + Number(c[3])) / 2 };
  }
  const a = wall?.A ?? wall?.a ?? wall?.edge?.a;
  const b = wall?.B ?? wall?.b ?? wall?.edge?.b;
  if (a && b && Number.isFinite(a.x) && Number.isFinite(b.x)) {
    return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  }
  return { x: Number(wall?.x) || 0, y: Number(wall?.y) || 0 };
}

function dist2(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return (dx * dx) + (dy * dy);
}

function nearestRoom(point, rooms) {
  let best = "";
  let bestD = Infinity;
  for (const room of rooms) {
    const d = dist2(point, room.anchor);
    if (d < bestD) {
      bestD = d;
      best = room.name;
    }
  }
  return best;
}

const matchLight = (node, room) =>
  node?.autoFrom?.kind === AUTO_KIND.light && node.autoFrom.room === room;

const matchMaglock = (node, doorId) =>
  node?.autoFrom?.kind === AUTO_KIND.maglock && node.autoFrom.doorId === doorId;

const matchCam = (node, lightId) =>
  node?.autoFrom?.kind === AUTO_KIND.cam && node.autoFrom.lightId === lightId;

function makeNode({ id, name, track, rating, autoFrom, tokenStyle = null, links = [], description = "", notes = "" }) {
  const integrity = RATING[rating]?.integrity ?? 12;
  return {
    id, name, track, rating,
    integrity, integrityMax: integrity, alert: 0, revealed: false,
    description, notes, links: [...links], autoFrom,
    tokenStyle: tokenStyle || autoFrom?.kind || null,
  };
}

/**
 * Plan Light Control + Maglock + Cam Controls nodes for a Scene snapshot.
 *
 * @param {{ lights: {id,name,x,y}[], doors: {id,name,x,y}[], existing?: object[], replace?: boolean, idFactory?: () => string }} input
 * @returns {{ nodes: object[], skipped: object[], created: object[], skippedLights: {id:string,name:string,reason:string}[], rooms: string[], placements: object }}
 */
export function planAutoNodes({ lights = [], doors = [], existing = [], replace = false, idFactory = () => `id${Math.random().toString(36).slice(2, 10)}` } = {}) {
  const keep = replace ? existing.filter(n => !n.autoFrom) : [...existing];
  const byId = new Map(keep.map(n => [n.id, { ...n, links: [...(n.links ?? [])] }]));

  const roomMap = new Map();
  const skippedLights = [];
  const camLights = [];
  for (const light of lights) {
    const room = parseRoomName(light.name);
    if (!room) {
      skippedLights.push({ id: light.id, name: light.name ?? "", reason: "no-split" });
      continue;
    }
    if (!roomMap.has(room)) {
      roomMap.set(room, { name: room, lightIds: [], anchor: { x: light.x, y: light.y }, place: { x: light.x, y: light.y } });
    }
    const entry = roomMap.get(room);
    if (isCamName(light.name)) {
      camLights.push({ ...light, room });
      continue;
    }
    if (!entry.lightIds.length) entry.place = { x: light.x, y: light.y };
    entry.lightIds.push(light.id);
  }
  const rooms = [...roomMap.values()];

  const created = [];
  const skipped = [];

  for (const room of rooms) {
    if (!room.lightIds.length) continue;
    const prior = [...byId.values()].find(n => matchLight(n, room.name));
    if (prior && !replace) {
      skipped.push(prior);
      continue;
    }
    const node = makeNode({
      id: idFactory(),
      name: lightControlName(room.name),
      track: 1,
      rating: 1,
      autoFrom: { kind: AUTO_KIND.light, room: room.name, lightIds: room.lightIds },
      description: `Lighting grid for ${room.name}. Track 1 Rating 1 — a single power roll seizes the lights. The Wire does not flip them in v1; this node is the address.`,
      notes: `Auto-node from Scene lights (${room.lightIds.join(", ")}). Token art: node-light-control.webp.`,
    });
    node._place = { x: room.place.x, y: room.place.y, kind: AUTO_KIND.light };
    byId.set(node.id, node);
    created.push(node);
  }

  const doorCounts = new Map();
  const sortedDoors = [...doors].sort((a, b) => (a.x - b.x) || (a.y - b.y));
  for (const door of sortedDoors) {
    const named = parseRoomName(door.name);
    const room = named || nearestRoom(door, rooms) || "Unassigned";
    doorCounts.set(room, (doorCounts.get(room) ?? 0) + 1);
    const n = doorCounts.get(room);
    const prior = [...byId.values()].find(node => matchMaglock(node, door.id));
    if (prior && !replace) {
      skipped.push(prior);
      continue;
    }
    const node = makeNode({
      id: idFactory(),
      name: maglockName(room, n),
      track: 1,
      rating: 2,
      autoFrom: { kind: AUTO_KIND.maglock, room, doorId: door.id },
      description: `Maglock on a ${room} door. Track 1 Rating 2 — professional lock, no Integrity pool. The Wire does not open it in v1; this node is the address.`,
      notes: `Auto-node from wall door ${door.id}. Token art: node-maglock.webp.`,
    });
    node._place = { x: door.x, y: door.y, kind: AUTO_KIND.maglock };
    byId.set(node.id, node);
    created.push(node);
  }

  const camCounts = new Map();
  const sortedCams = [...camLights].sort((a, b) => (a.x - b.x) || (a.y - b.y) || String(a.id).localeCompare(String(b.id)));
  for (const cam of sortedCams) {
    camCounts.set(cam.room, (camCounts.get(cam.room) ?? 0) + 1);
    const n = camCounts.get(cam.room);
    const prior = [...byId.values()].find(node => matchCam(node, cam.id));
    if (prior && !replace) {
      skipped.push(prior);
      continue;
    }
    const node = makeNode({
      id: idFactory(),
      name: camControlsName(cam.room, n),
      track: 1,
      rating: 1,
      autoFrom: { kind: AUTO_KIND.cam, room: cam.room, lightId: cam.id },
      description: `Camera feed for ${cam.room}. Track 1 Rating 1 — a single power roll seizes the cam. The Wire does not pan it in v1; this node is the address.`,
      notes: `Auto-node from Scene cam ${cam.id}. Token art: node-cam-controls.webp.`,
    });
    node._place = { x: cam.x, y: cam.y, kind: AUTO_KIND.cam };
    byId.set(node.id, node);
    created.push(node);
  }

  // Light Control ↔ Maglocks and Cam Controls in the same room.
  const list = [...byId.values()];
  for (const light of list.filter(n => n.autoFrom?.kind === AUTO_KIND.light)) {
    for (const other of list.filter(n => (n.autoFrom?.kind === AUTO_KIND.maglock || n.autoFrom?.kind === AUTO_KIND.cam) && n.autoFrom.room === light.autoFrom.room)) {
      if (!light.links.includes(other.id)) light.links.push(other.id);
      if (!other.links.includes(light.id)) other.links.push(light.id);
    }
  }

  return {
    nodes: list.map(node => {
      const { _place, ...rest } = node;
      return rest;
    }),
    created,
    skipped,
    skippedLights,
    rooms: rooms.map(r => r.name),
    placements: Object.fromEntries(created.filter(n => n._place).map(n => [n.id, n._place])),
  };
}

function offsetNear(x, y, grid, kind) {
  const step = (grid || 100) * 0.4;
  if (kind === AUTO_KIND.maglock) return { x: x + step, y: y - step };
  if (kind === AUTO_KIND.cam) return { x: x - step, y: y + step };
  return { x: x + step, y };
}

function snap(value, grid) {
  if (!grid) return value;
  return Math.round(value / grid) * grid;
}

/** Collect named AmbientLights from a Scene. */
export function collectLights(scene) {
  return [...(scene?.lights ?? [])].map(light => ({
    id: light.id,
    name: light.name ?? "",
    x: Number(light.x) || 0,
    y: Number(light.y) || 0,
  })).filter(light => light.name.trim());
}

/** Collect wall doors (door != NONE). */
export function collectDoors(scene) {
  const none = (typeof CONST !== "undefined" && CONST.WALL_DOOR_TYPES?.NONE) ?? 0;
  return [...(scene?.walls ?? [])].filter(wall => isDoorWall(wall, none)).map(wall => {
    const { x, y } = wallCenter(wall);
    return { id: wall.id, name: wall.name ?? "", x, y };
  });
}

/**
 * GM: build auto-nodes on the viewed Scene's board, place hidden tokens next to lights/doors.
 * Idempotent unless `replace` is true (then existing auto-nodes are removed first).
 */
export async function applyAutoNodesFromScene({ replace = false } = {}) {
  if (typeof game === "undefined" || !game.user?.isGM) return { created: [], skipped: [], rooms: [] };
  const viewed = game.scenes.viewed;
  const scene = boardScene(viewed);
  if (!viewed || !scene) {
    ui.notifications.warn(game.i18n.localize("GHOSTWIRE.WiredConsole.NoScene"));
    return { created: [], skipped: [], rooms: [] };
  }

  const { getBoard } = await import("./wired-console.mjs");
  const board = getBoard(scene);
  const lights = collectLights(viewed);
  const doors = collectDoors(viewed);
  if (!lights.length && !doors.length) {
    ui.notifications.warn(game.i18n.localize("GHOSTWIRE.WiredConsole.AutoNodesEmpty"));
    return { created: [], skipped: [], rooms: [] };
  }

  if (replace) {
    const autoIds = board.nodes.filter(n => n.autoFrom).map(n => n.id);
    for (const id of autoIds) {
      const actor = placedNodeActor(scene.id, id);
      if (actor) await removePlacedNode(actor);
    }
    board.nodes = board.nodes.filter(n => !n.autoFrom);
  }

  const plan = planAutoNodes({
    lights,
    doors,
    existing: board.nodes,
    replace: false,
    idFactory: () => foundry.utils.randomID(),
  });

  board.nodes = plan.nodes;
  await scene.setFlag(MODULE_ID, "wiredBoard", { nodes: board.nodes, stratum: board.stratum, updated: Date.now() });

  const grid = viewed.grid?.size ?? 100;
  for (const node of plan.created) {
    const place = plan.placements[node.id];
    if (!place) continue;
    const near = offsetNear(place.x, place.y, grid, place.kind);
    const art = tokenArtFor(place.kind);
    await placeNode(scene, node, {
      x: snap(near.x - (grid * 0.125), grid / 4),
      y: snap(near.y - (grid * 0.125), grid / 4),
      extraFlags: { autoKind: place.kind, autoFrom: node.autoFrom, tokenArt: art },
      textureSrc: art,
    });
  }

  const count = plan.created.length;
  const skipped = plan.skipped.length;
  const unsplit = plan.skippedLights ?? [];
  if (unsplit.length) {
    const names = unsplit.map(l => l.name || game.i18n.localize("GHOSTWIRE.WiredConsole.AutoNodesUnnamed")).slice(0, 8).join(", ");
    ui.notifications.warn(game.i18n.format("GHOSTWIRE.WiredConsole.AutoNodesUnsplit", { count: unsplit.length, names }));
  }
  if (count) {
    ui.notifications.info(game.i18n.format("GHOSTWIRE.WiredConsole.AutoNodesDone", {
      count, skipped, rooms: plan.rooms.length || 0,
    }));
  } else if (skipped) {
    ui.notifications.info(game.i18n.format("GHOSTWIRE.WiredConsole.AutoNodesSkipped", { skipped }));
  } else if (!unsplit.length) {
    ui.notifications.warn(game.i18n.localize("GHOSTWIRE.WiredConsole.AutoNodesEmpty"));
  }
  return plan;
}
