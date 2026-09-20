// Wired Console Constructs roster (B121): compiled sprites + Agents, separate from Connections/Nodes.
// Lock A (Michael 2026-09-20): scene token = roster anchor only; Wire play = Wired Console;
// meat actions off unless an ability bridges. Do not add construct edges to the node graph.
// Foundry-free so Node smoke can import this.

import { compareConsoleNames } from "./wired-console-verbs.mjs";
import { tokenCenter } from "./wired-canvas-focus.mjs";
import { isFullyConnected } from "./wired-state.mjs";

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

/** Overlay / Jacked In. Linked is soft presence and does not grant Constructs peer visibility. */
export function compilerIsImmersed(compiler, getWiredState) {
  if (!compiler || typeof getWiredState !== "function") return false;
  return isFullyConnected(getWiredState(compiler));
}

/**
 * True when this viewer owns an Overlay or Jacked In actor on the viewed scene.
 * That presence is what lets same-scene compilers see each other's constructs without Scan.
 */
export function viewerImmersedOnScene({
  sceneTokens = [],
  canView = () => false,
  getWiredState = () => "disconnected",
} = {}) {
  for (const token of Array.isArray(sceneTokens) ? sceneTokens : []) {
    const actor = token?.actor ?? null;
    if (!actor || !canView(actor)) continue;
    if (compilerIsImmersed(actor, getWiredState)) return true;
  }
  return false;
}

/**
 * Peer Wire visibility: both the viewer and the construct's compiler are Overlay/Jacked In
 * on this scene. Does not require Scan. Does not grant Command/Decompile or reveal meat tokens.
 */
export function constructPeerVisible({
  compiler = null,
  compilerOnScene = false,
  viewerImmersed = false,
  getWiredState = () => "disconnected",
} = {}) {
  if (!viewerImmersed || !compilerOnScene || !compiler) return false;
  return compilerIsImmersed(compiler, getWiredState);
}

function viewerSeesConstruct({
  actor,
  compiler,
  isGM,
  canView,
  compilerOnScene,
  viewerImmersed,
  getWiredState,
}) {
  if (isGM) return true;
  if (typeof canView !== "function") return false;
  if (canView(actor) || (compiler && canView(compiler))) return true;
  return constructPeerVisible({ compiler, compilerOnScene, viewerImmersed, getWiredState });
}

function actorOnScene(actor, tokens) {
  return (Array.isArray(tokens) ? tokens : []).some(token => tokenMatchesActor(token, actor));
}

/**
 * Scene-scoped Constructs roster. A compiled sprite/Agent appears when its token
 * or its compiler's token is on the viewed scene.
 *
 * Visibility: Director; owner (construct or compiler); **or** Overlay/Jacked In
 * compilers on the same scene (peer Wire view, no Scan). Linked does not grant
 * peer visibility. `owned` stays owner-only so Command/Decompile stay meat-side
 * off the peer roster. Anchor tokens are not revealed on the canvas.
 */
export function collectConsoleConstructs({
  worldActors = [],
  sceneTokens = [],
  boardNodes = [],
  placedNodes = [],
  isGM = false,
  canView = () => false,
  resolveActor = () => null,
  getWiredState = () => "disconnected",
  moduleId = MODULE_ID,
  gridSize = 100,
} = {}) {
  const tokens = Array.isArray(sceneTokens) ? sceneTokens : [];
  const boardById = new Map((Array.isArray(boardNodes) ? boardNodes : []).map(node => [node.id, node]));
  const viewerImmersed = isGM ? true : viewerImmersedOnScene({ sceneTokens: tokens, canView, getWiredState });
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
    if (!viewerSeesConstruct({
      actor, compiler, isGM, canView, compilerOnScene, viewerImmersed, getWiredState,
    })) continue;

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
    const owned = isGM || canView(actor) || (compiler ? canView(compiler) : false);

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
      owned,
      peerVisible: !owned && constructPeerVisible({
        compiler, compilerOnScene, viewerImmersed, getWiredState,
      }),
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
