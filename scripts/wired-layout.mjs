// Wired Node Map layout (B114): keep dense boards (Gold Line 20+ lights/doors) readable.
// Pure functions — no Foundry. Used by scripts/wired-minimap.mjs and tools/b112-b115-smoke.mjs.
//
// Order:
// 1. Seed positions from canvas tokens (spatial), else cluster-by-room tree, else force-directed.
// 2. Run a short force pass so linked nodes sit near each other without collapsing.
// 3. Separate overlapping labels (collision avoidance).
// 4. Callers truncate long names and enable zoom/pan; this module only places centres in 0–100% space.

/** Type keywords that end a room phrase (B112 naming rule, reused for cluster prefixes). */
export const ROOM_TYPE_KEYWORDS = new Set([
  "light", "lights", "control", "cam", "camera", "cameras", "work",
  "maglock", "door", "doors", "host", "node", "nodes", "ice",
]);

const PAD = 8;
const DENSE_AT = 12;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/** Room cluster key from a node name: `{Room} Light Control` / `{Room} Maglock Door N` / leading phrase. */
export function roomPrefix(name) {
  const raw = String(name ?? "").trim();
  if (!raw) return "";
  const dash = raw.split(/\s+-\s+/)[0].trim();
  const base = dash && dash !== raw ? dash : raw;
  const stripped = base
    .replace(/\s+Light Control$/i, "")
    .replace(/\s+Maglock Door(?:\s+\d+)?$/i, "")
    .replace(/\s+Door(?:\s+\d+)?$/i, "")
    .trim();
  const words = (stripped || base).split(/\s+/).filter(Boolean);
  if (!words.length) return "";
  if (words.length === 1) return titleCase(words[0]);
  if (ROOM_TYPE_KEYWORDS.has(words[1].toLowerCase())) return titleCase(words[0]);
  return words.slice(0, 2).map(titleCase).join(" ");
}

function titleCase(word) {
  if (!word) return "";
  if (/^[A-Z0-9]+$/.test(word) && word.length <= 3) return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/** Short pill label: keep room, compress Light Control / Maglock Door. Full name stays in the tooltip. */
export function shortNodeName(name, { dense = false, max = 18 } = {}) {
  const raw = String(name ?? "").trim();
  if (!raw) return "";
  let short = raw
    .replace(/\s+Light Control$/i, " LC")
    .replace(/\s+Maglock Door\s+/i, " D")
    .replace(/\s+Maglock Door$/i, " D");
  const limit = dense ? Math.min(max, 14) : max;
  if (short.length <= limit) return short;
  return `${short.slice(0, Math.max(1, limit - 1)).trimEnd()}…`;
}

export function clusterByRoom(nodes) {
  const rooms = new Map();
  for (const node of nodes) {
    const room = roomPrefix(node.name);
    if (!room) continue;
    if (!rooms.has(room)) rooms.set(room, []);
    rooms.get(room).push(node);
  }
  let assigned = 0;
  for (const list of rooms.values()) assigned += list.length;
  return { rooms, assigned };
}

function tokenBox(tokenCentres) {
  const xs = [...tokenCentres.values()].map(c => c.x);
  const ys = [...tokenCentres.values()].map(c => c.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const span = Math.max(Math.max(...xs) - minX, Math.max(...ys) - minY, 1);
  return { minX, minY, span };
}

/** Scale token centres into the percent box, keeping aspect. */
function spatialPositions(nodes, tokenCentres) {
  const positions = new Map();
  const placed = nodes.filter(node => tokenCentres.has(node.id));
  const unplaced = nodes.filter(node => !tokenCentres.has(node.id));
  if (!placed.length) return null;

  const { minX, minY, span } = tokenBox(tokenCentres);
  const inner = 100 - (PAD * 2);
  for (const node of placed) {
    const c = tokenCentres.get(node.id);
    const x = placed.length === 1 ? 50 : PAD + (((c.x - minX) / span) * inner);
    const y = placed.length === 1 ? 50 : PAD + (((c.y - minY) / span) * inner);
    positions.set(node.id, { x, y });
  }
  if (unplaced.length) {
    const clustered = clusterLayout(unplaced, { top: 78, bottom: 96 });
    for (const [id, pos] of clustered) positions.set(id, pos);
  }
  return positions;
}

/** Rooms as columns; Light Control above Maglocks. */
function clusterLayout(nodes, { top = PAD, bottom = 100 - PAD } = {}) {
  const positions = new Map();
  const { rooms } = clusterByRoom(nodes);
  const used = new Set();
  const columns = [...rooms.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  const leftovers = nodes.filter(node => {
    const room = roomPrefix(node.name);
    if (room && rooms.has(room)) {
      used.add(node.id);
      return false;
    }
    return true;
  });

  const colCount = Math.max(columns.length, 1);
  columns.forEach(([room, members], i) => {
    const x = ((i + 0.5) * 100) / colCount;
    const lights = members.filter(n => /light control/i.test(n.name));
    const doors = members.filter(n => /maglock|door/i.test(n.name) && !lights.includes(n));
    const other = members.filter(n => !lights.includes(n) && !doors.includes(n));
    const stack = [...lights, ...other, ...doors];
    const n = Math.max(stack.length, 1);
    stack.forEach((node, row) => {
      const t = n === 1 ? 0.5 : row / (n - 1);
      const y = top + (t * (bottom - top));
      positions.set(node.id, { x, y });
    });
  });

  leftovers.forEach((node, i) => {
    const x = ((i + 1) * 100) / (leftovers.length + 1);
    positions.set(node.id, { x, y: bottom });
  });
  return positions;
}

function forceDirected(nodes, seed = null) {
  const positions = new Map();
  const n = nodes.length;
  if (n === 0) return positions;
  if (n === 1) {
    positions.set(nodes[0].id, { x: 50, y: 50 });
    return positions;
  }

  if (seed) {
    for (const node of nodes) {
      const s = seed.get(node.id) ?? { x: 50, y: 50 };
      positions.set(node.id, { x: s.x, y: s.y });
    }
  } else {
    nodes.forEach((node, i) => {
      const angle = (-Math.PI / 2) + ((2 * Math.PI * i) / n);
      const radius = n > 16 ? 38 : 32;
      positions.set(node.id, { x: 50 + (radius * Math.cos(angle)), y: 50 + (radius * Math.sin(angle)) });
    });
  }

  const index = new Map(nodes.map((node, i) => [node.id, i]));
  const links = [];
  for (const node of nodes) {
    for (const id of node.links ?? []) {
      if (!index.has(id) || node.id > id) continue;
      links.push([index.get(node.id), index.get(id)]);
    }
  }

  const pts = nodes.map(node => ({ ...positions.get(node.id) }));
  const iterations = Math.min(90, 40 + n);
  for (let step = 0; step < iterations; step++) {
    const cool = 0.85 ** (step / 12);
    const disp = pts.map(() => ({ x: 0, y: 0 }));
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const dist = Math.hypot(dx, dy) || 0.01;
        const push = (140 / n) / dist;
        const ux = dx / dist;
        const uy = dy / dist;
        disp[i].x += ux * push;
        disp[i].y += uy * push;
        disp[j].x -= ux * push;
        disp[j].y -= uy * push;
      }
    }
    for (const [a, b] of links) {
      const dx = pts[a].x - pts[b].x;
      const dy = pts[a].y - pts[b].y;
      const dist = Math.hypot(dx, dy) || 0.01;
      const pull = (dist - 18) * 0.04;
      const ux = dx / dist;
      const uy = dy / dist;
      disp[a].x -= ux * pull;
      disp[a].y -= uy * pull;
      disp[b].x += ux * pull;
      disp[b].y += uy * pull;
    }
    for (let i = 0; i < n; i++) {
      pts[i].x = clamp(pts[i].x + (disp[i].x * cool), PAD, 100 - PAD);
      pts[i].y = clamp(pts[i].y + (disp[i].y * cool), PAD, 100 - PAD);
    }
  }
  nodes.forEach((node, i) => positions.set(node.id, pts[i]));
  return positions;
}

/**
 * Push overlapping node centres apart. `labelW` / `labelH` are percent-of-field boxes
 * around each centre (the pill + name sit under the glyph).
 */
export function separateLabels(positions, { minDist = 10, labelW = 12, labelH = 10, steps = 40 } = {}) {
  const ids = [...positions.keys()];
  const halfW = labelW / 2;
  const halfH = labelH / 2;
  for (let step = 0; step < steps; step++) {
    let moved = false;
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const a = positions.get(ids[i]);
        const b = positions.get(ids[j]);
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const overlapX = (halfW * 2) - Math.abs(dx);
        const overlapY = (halfH * 2) - Math.abs(dy);
        const dist = Math.hypot(dx, dy);
        if (overlapX <= 0 || overlapY <= 0) {
          if (dist >= minDist) continue;
          const need = (minDist - dist) / 2;
          const ux = dist ? dx / dist : 1;
          const uy = dist ? dy / dist : 0;
          a.x = clamp(a.x + (ux * need), PAD, 100 - PAD);
          a.y = clamp(a.y + (uy * need), PAD, 100 - PAD);
          b.x = clamp(b.x - (ux * need), PAD, 100 - PAD);
          b.y = clamp(b.y - (uy * need), PAD, 100 - PAD);
          moved = true;
          continue;
        }
        if (overlapX < overlapY) {
          const push = (overlapX / 2) + 0.15;
          const dir = dx === 0 ? 1 : Math.sign(dx);
          a.x = clamp(a.x + (dir * push), PAD, 100 - PAD);
          b.x = clamp(b.x - (dir * push), PAD, 100 - PAD);
        } else {
          const push = (overlapY / 2) + 0.15;
          const dir = dy === 0 ? 1 : Math.sign(dy);
          a.y = clamp(a.y + (dir * push), PAD, 100 - PAD);
          b.y = clamp(b.y - (dir * push), PAD, 100 - PAD);
        }
        moved = true;
      }
    }
    if (!moved) break;
  }
  return positions;
}

/** Minimum centre-to-centre distance in the same units as `positions`. */
export function minSeparation(positions) {
  const pts = [...positions.values()];
  let min = Infinity;
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
      if (d < min) min = d;
    }
  }
  return Number.isFinite(min) ? min : 0;
}

/**
 * @param {object[]} nodes  `{ id, name, links? }[]`
 * @param {Map<string, {x:number, y:number}>} [tokenCentres]
 * @returns {{ positions: Map<string,{x:number,y:number}>, dense: boolean, mode: string, clusters: ReturnType<typeof clusterByRoom> }}
 */
export function layoutNodes(nodes, tokenCentres = new Map()) {
  const dense = nodes.length >= DENSE_AT;
  const clusters = clusterByRoom(nodes);
  const clustered = clusters.rooms.size >= 2 && clusters.assigned >= nodes.length * 0.45;

  let positions;
  let mode;
  if (tokenCentres.size) {
    positions = spatialPositions(nodes, tokenCentres) ?? new Map();
    mode = "spatial";
  } else if (clustered) {
    positions = clusterLayout(nodes);
    mode = "cluster";
    positions = forceDirected(nodes, positions);
  } else {
    positions = forceDirected(nodes);
    mode = "force";
  }

  const labelW = dense ? 9 : 12;
  const labelH = dense ? 8 : 10;
  const minDist = dense ? 8 : 11;
  separateLabels(positions, { minDist, labelW, labelH });
  return { positions, dense, mode, clusters };
}
