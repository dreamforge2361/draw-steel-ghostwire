// Scene → Wire auto-nodes (B112). Pure planning lives here so smoke tests can import without Foundry.
// Foundry glue (read Scene lights/doors, write wiredBoard, place tokens) is in applyAutoNodesFromScene.

import { RATING } from "./wired-node-templates.mjs";
import { ROOM_TYPE_KEYWORDS, roomPrefix } from "./wired-layout.mjs";
import { boardScene, placeNode, placedNodeActor, removePlacedNode } from "./wired-node-tokens.mjs";

const MODULE_ID = "draw-steel-ghostwire";

/** B113: Light / Maglock token art — Michael supplies files later. Null = generic Track 1 node token. */
export const AUTO_NODE_TOKEN_ART = {
  "light-control": null,
  maglock: null,
};

export const AUTO_KIND = {
  light: "light-control",
  maglock: "maglock",
};

/**
 * Room name from a light (or named door).
 *
 * Rule (Director-facing, also in the Console helpText):
 * 1. If the name contains ` - `, the room is the trimmed part before the first ` - `.
 * 2. Otherwise take leading words until a type keyword (Light, Lights, Control, Cam,
 *    Camera, Cameras, Work, Maglock, Door, Host, Node, ICE).
 * 3. Practical shortcut matching Michael's "first name is the room": if no keyword
 *    appears, use the first two words unless the second word is itself a keyword
 *    (then only the first word).
 *
 * Examples: "Rear Bay Work Light" → Rear Bay; "Cab Light" → Cab;
 * "R2 - Wire Closet Light" → R2; "Track Light" → Track.
 */
export function parseRoomName(name) {
  const raw = String(name ?? "").trim();
  if (!raw) return "";
  if (raw.includes(" - ")) return raw.split(/\s+-\s+/)[0].trim();

  const words = raw.split(/\s+/).filter(Boolean);
  if (!words.length) return "";
  const taken = [];
  for (const word of words) {
    if (ROOM_TYPE_KEYWORDS.has(word.toLowerCase())) break;
    taken.push(word);
  }
  if (!taken.length) return "";
  if (taken.length === 1) return taken[0];
  // First two words when the second isn't a type keyword (already filtered).
  return taken.slice(0, 2).join(" ");
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

function makeNode({ id, name, track, rating, autoFrom, links = [], description = "", notes = "" }) {
  const integrity = RATING[rating]?.integrity ?? 12;
  return {
    id, name, track, rating,
    integrity, integrityMax: integrity, alert: 0, revealed: false,
    description, notes, links: [...links], autoFrom,
  };
}

/**
 * Plan Light Control + Maglock nodes for a Scene snapshot.
 *
 * @param {{ lights: {id,name,x,y}[], doors: {id,name,x,y}[], existing?: object[], replace?: boolean, idFactory?: () => string }} input
 * @returns {{ nodes: object[], skipped: object[], created: object[], rooms: string[] }}
 */
export function planAutoNodes({ lights = [], doors = [], existing = [], replace = false, idFactory = () => `id${Math.random().toString(36).slice(2, 10)}` } = {}) {
  const keep = replace ? existing.filter(n => !n.autoFrom) : [...existing];
  const byId = new Map(keep.map(n => [n.id, { ...n, links: [...(n.links ?? [])] }]));

  const roomMap = new Map();
  for (const light of lights) {
    const room = parseRoomName(light.name);
    if (!room) continue;
    if (!roomMap.has(room)) {
      roomMap.set(room, { name: room, lightIds: [], anchor: { x: light.x, y: light.y }, place: { x: light.x, y: light.y } });
    }
    const entry = roomMap.get(room);
    entry.lightIds.push(light.id);
  }
  const rooms = [...roomMap.values()];

  const created = [];
  const skipped = [];

  for (const room of rooms) {
    const prior = [...byId.values()].find(n => matchLight(n, room.name));
    if (prior && !replace) {
      skipped.push(prior);
      continue;
    }
    const node = makeNode({
      id: idFactory(),
      name: `${room.name} Light Control`,
      track: 1,
      rating: 1,
      autoFrom: { kind: AUTO_KIND.light, room: room.name, lightIds: room.lightIds },
      description: `Lighting grid for ${room.name}. Track 1 Rating 1 — a single power roll seizes the lights. The Wire does not flip them in v1; this node is the address.`,
      notes: `Auto-node from Scene lights (${room.lightIds.join(", ")}). Token art: B113 placeholder (generic Track 1).`,
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
      name: `${room} Maglock Door ${n}`,
      track: 1,
      rating: 2,
      autoFrom: { kind: AUTO_KIND.maglock, room, doorId: door.id },
      description: `Maglock on a ${room} door. Track 1 Rating 2 — professional lock, no Integrity pool. The Wire does not open it in v1; this node is the address.`,
      notes: `Auto-node from wall door ${door.id}. Token art: B113 placeholder (generic Track 1).`,
    });
    node._place = { x: door.x, y: door.y, kind: AUTO_KIND.maglock };
    byId.set(node.id, node);
    created.push(node);
  }

  // Light Control ↔ Maglocks in the same room.
  const list = [...byId.values()];
  for (const light of list.filter(n => n.autoFrom?.kind === AUTO_KIND.light)) {
    for (const door of list.filter(n => n.autoFrom?.kind === AUTO_KIND.maglock && n.autoFrom.room === light.autoFrom.room)) {
      if (!light.links.includes(door.id)) light.links.push(door.id);
      if (!door.links.includes(light.id)) door.links.push(light.id);
    }
  }

  return {
    nodes: list.map(node => {
      const { _place, ...rest } = node;
      return rest;
    }),
    created,
    skipped,
    rooms: rooms.map(r => r.name),
    placements: Object.fromEntries(created.filter(n => n._place).map(n => [n.id, n._place])),
  };
}

function offsetNear(x, y, grid, kind) {
  const step = (grid || 100) * 0.4;
  if (kind === AUTO_KIND.maglock) return { x: x + step, y: y - step };
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
    const art = AUTO_NODE_TOKEN_ART[place.kind] ?? null;
    await placeNode(scene, node, {
      x: snap(near.x - (grid * 0.125), grid / 4),
      y: snap(near.y - (grid * 0.125), grid / 4),
      extraFlags: { autoKind: place.kind, autoFrom: node.autoFrom, tokenArt: art },
      textureSrc: art,
    });
  }

  const count = plan.created.length;
  const skipped = plan.skipped.length;
  if (count) {
    ui.notifications.info(game.i18n.format("GHOSTWIRE.WiredConsole.AutoNodesDone", {
      count, skipped, rooms: plan.rooms.length || 0,
    }));
  } else if (skipped) {
    ui.notifications.info(game.i18n.format("GHOSTWIRE.WiredConsole.AutoNodesSkipped", { skipped }));
  }
  return plan;
}
