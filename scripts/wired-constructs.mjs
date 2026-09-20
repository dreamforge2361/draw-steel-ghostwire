// Wired Console Constructs roster (B121): compiled sprites + Agents, separate from Connections/Nodes.
// Lock A (Michael 2026-09-20): scene token = roster anchor only; Wire play = Wired Console;
// meat actions off unless an ability bridges. Do not add construct edges to the node graph.
// Foundry-free so Node smoke can import this.

import { compareConsoleNames } from "./wired-console-verbs.mjs";
import { tokenCenter } from "./wired-canvas-focus.mjs";

export const MODULE_ID = "draw-steel-ghostwire";
export const CONSTRUCT_KINDS = ["sprite", "agent"];

function flagScope(scope, fallback = MODULE_ID) {
  return typeof scope === "string" && scope ? scope : fallback;
}

export function constructFlag(doc, key, moduleId) {
  const scope = flagScope(moduleId, MODULE_ID);
  if (typeof doc?.getFlag === "function") return doc.getFlag(scope, key);
  return doc?.flags?.[scope]?.[key];
}

export function constructKind(actor, moduleId) {
  const kind = constructFlag(actor, "kind", moduleId);
  return CONSTRUCT_KINDS.includes(kind) ? kind : null;
}

export function isConstructActor(actor, moduleId) {
  return !!constructKind(actor, moduleId);
}

/** Connections is runners + Wire nodes. Sprites/Agents belong on Constructs, not that list. */
export function constructLeavesConnections(actor, moduleId) {
  return isConstructActor(actor, moduleId);
}

export function constructStamina(actor) {
  const pool = actor?.system?.stamina;
  if (!pool || typeof pool !== "object") return { value: null, max: null, pct: 0, label: null };
  const value = Number(pool.value);
  const max = Number(pool.max);
  const hasValue = Number.isFinite(value);
  const hasMax = Number.isFinite(max) && max > 0;
  const pct = (hasValue && hasMax) ? Math.round((Math.max(0, value) / max) * 100) : 0;
  return {
    value: hasValue ? value : null,
    max: hasMax ? max : null,
    pct: Math.min(100, Math.max(0, pct)),
    label: (hasValue && hasMax) ? `${value} / ${max}` : (hasValue ? String(value) : null),
  };
}

function tokenActorId(token) {
  return token?.actorId ?? token?.actor?.id ?? token?.actor?._id ?? null;
}

function tokenActorUuid(token) {
  return token?.actorUuid ?? token?.actor?.uuid ?? null;
}

export function tokenMatchesActor(token, actor) {
  if (!token || !actor) return false;
  const id = actor.id ?? actor._id ?? null;
  const uuid = actor.uuid ?? null;
  if (id && tokenActorId(token) === id) return true;
  if (uuid && tokenActorUuid(token) === uuid) return true;
  if (token.actor && token.actor === actor) return true;
  return false;
}

/**
 * Optional Wire "face" chip: stored node id wins, else nearest placed node token.
 * Never writes `node.links` — this is a label, not a graph edge.
 */
export function nearestFaceNode({ token = null, placedNodes = [], gridSize = 100 } = {}) {
  const origin = tokenCenter(token, gridSize);
  if (!origin) return null;
  let best = null;
  let bestDist = Infinity;
  for (const node of placedNodes) {
    const point = tokenCenter(node.token ?? node, gridSize);
    if (!point) continue;
    const dist = Math.hypot(point.x - origin.x, point.y - origin.y);
    if (dist < bestDist) {
      bestDist = dist;
      best = node;
    }
  }
  return best;
}

export function resolveConstructFace({
  flagNodeId = null,
  nearest = null,
  boardById = null,
  isGM = false,
} = {}) {
  const fromFlag = flagNodeId && boardById?.get?.(flagNodeId);
  const node = fromFlag ?? nearest ?? null;
  if (!node) return null;
  const revealed = node.revealed !== false;
  if (!revealed && !isGM) return null;
  return {
    id: node.id,
    name: node.name ?? "",
    revealed,
    fromFlag: !!fromFlag,
  };
}

function viewerSeesConstruct({ actor, compiler, isGM, canView }) {
  if (isGM) return true;
  if (typeof canView !== "function") return false;
  return !!(canView(actor) || (compiler && canView(compiler)));
}

function actorOnScene(actor, tokens) {
  return (Array.isArray(tokens) ? tokens : []).some(token => tokenMatchesActor(token, actor));
}

/**
 * Scene-scoped Constructs roster. A compiled sprite/Agent appears when its token
 * or its compiler's token is on the viewed scene. Players see owned constructs
 * (or ones whose compiler they own); Directors see all of those on the scene.
 */
export function collectConsoleConstructs({
  worldActors = [],
  sceneTokens = [],
  boardNodes = [],
  placedNodes = [],
  isGM = false,
  canView = () => false,
  resolveActor = () => null,
  moduleId = MODULE_ID,
  gridSize = 100,
} = {}) {
  const tokens = Array.isArray(sceneTokens) ? sceneTokens : [];
  const boardById = new Map((Array.isArray(boardNodes) ? boardNodes : []).map(node => [node.id, node]));
  const rows = [];
  const seen = new Set();

  for (const actor of worldActors) {
    const kind = constructKind(actor, moduleId);
    if (!kind) continue;
    const uuid = actor.uuid ?? actor.id ?? null;
    if (!uuid || seen.has(uuid)) continue;

    const compilerUuid = constructFlag(actor, "compiler", moduleId) ?? null;
    const compiler = compilerUuid ? resolveActor(compilerUuid) : null;
    const token = tokens.find(t => tokenMatchesActor(t, actor)) ?? null;
    const compilerOnScene = compiler ? actorOnScene(compiler, tokens) : false;
    if (!token && !compilerOnScene) continue;
    if (!viewerSeesConstruct({ actor, compiler, isGM, canView })) continue;

    seen.add(uuid);
    const stamina = constructStamina(actor);
    const flagFace = constructFlag(actor, "wiredFace", moduleId)
      ?? constructFlag(actor, "faceNodeId", moduleId)
      ?? null;
    const nearest = token ? nearestFaceNode({ token, placedNodes, gridSize }) : null;
    const face = resolveConstructFace({
      flagNodeId: typeof flagFace === "string" ? flagFace : flagFace?.id,
      nearest: nearest ? { id: nearest.id, name: nearest.name, revealed: nearest.revealed !== false } : null,
      boardById,
      isGM,
    });

    rows.push({
      uuid,
      id: actor.id ?? actor._id ?? uuid,
      name: token?.name || actor.name || "",
      img: token?.texture?.src || token?.img || actor.img || "",
      kind,
      archetype: constructFlag(actor, "archetype", moduleId) ?? "",
      band: constructFlag(actor, "hybridTier", moduleId) ?? "",
      compilerUuid,
      compilerName: compiler?.name ?? "",
      stamina,
      anchored: !!token,
      face,
      owned: isGM || canView(actor) || (compiler ? canView(compiler) : false),
    });
  }
  return rows;
}

/** Anchored (has a scene token) first — same idea as revealed-first — then kind, then A–Z. */
export function compareConsoleConstructs(a = {}, b = {}, { lang } = {}) {
  const anchored = row => (row.anchored ? 0 : 1);
  const kindRank = row => (row.kind === "sprite" ? 0 : row.kind === "agent" ? 1 : 2);
  const aDelta = anchored(a) - anchored(b);
  if (aDelta) return aDelta;
  const kDelta = kindRank(a) - kindRank(b);
  if (kDelta) return kDelta;
  return compareConsoleNames(a.name, b.name, lang);
}

export function sortConsoleConstructs(list = [], { lang } = {}) {
  const rows = Array.isArray(list) ? list : [];
  return rows.sort((a, b) => compareConsoleConstructs(a, b, { lang }));
}
