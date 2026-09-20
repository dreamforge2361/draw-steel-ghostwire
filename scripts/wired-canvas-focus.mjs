// Canvas pan/center on a placed Wired node token (Console list + minimap).
// Lock 2026-09-20 (Michael): selecting or clicking a Console / minimap node pans to its token
// after Place Node, and controls the token when the user can. Foundry-free plan helpers so
// Node smoke can import this; runtime uses canvas.animatePan + Token#control.

import { placedNodeToken } from "./wired-node-tokens.mjs";

/**
 * Pixel centre of a Token object or TokenDocument.
 * Live Token#center wins; documents use x/y + width/height × grid.
 * @param {{ center?: { x: number, y: number }, document?: object, x?: number, y?: number, width?: number, height?: number } | null} token
 * @param {number} [gridSize=100]
 * @returns {{ x: number, y: number } | null}
 */
export function tokenCenter(token, gridSize = 100) {
  if (!token) return null;
  const live = token.center;
  if (live && Number.isFinite(live.x) && Number.isFinite(live.y)) return { x: live.x, y: live.y };
  const doc = token.document ?? token;
  const x = Number(doc.x);
  const y = Number(doc.y);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  const width = Number(doc.width) || 1;
  const height = Number(doc.height) || 1;
  const size = Number(gridSize) || 100;
  return { x: x + ((width * size) / 2), y: y + ((height * size) / 2) };
}

/**
 * Whether this user may pan to / control a placed node token.
 * Hidden tokens: GM only. Unplaced or canvas-not-ready: no-op (list selection still works).
 * @param {{ hasCenter?: boolean, hidden?: boolean, isGM?: boolean, canControl?: boolean, canvasReady?: boolean }} [opts]
 */
export function canvasFocusPlan({
  hasCenter = false,
  hidden = false,
  isGM = false,
  canControl = false,
  canvasReady = true,
} = {}) {
  const allowed = !!hasCenter && !!canvasReady && (!hidden || !!isGM);
  return {
    pan: allowed,
    control: allowed && !!canControl,
  };
}

/**
 * Pan/center the viewed canvas on a token document or live Token and control it when allowed.
 * Safe no-op when missing, hidden from this user, or the canvas is not ready.
 * @param {{ token?: object | null, isGM?: boolean }} [opts]
 * @returns {Promise<{ panned: boolean, controlled: boolean }>}
 */
export async function focusTokenOnCanvas({
  token = null,
  isGM = globalThis.game?.user?.isGM ?? false,
} = {}) {
  const canvas = globalThis.canvas;
  const viewed = globalThis.game?.scenes?.viewed ?? canvas?.scene ?? null;
  const tokenDoc = token?.document ?? token ?? null;
  const object = token?.object ?? (token?.center ? token : tokenDoc?.object) ?? null;
  if (!tokenDoc && !object) return { panned: false, controlled: false };

  const hidden = !!(object?.document?.hidden ?? tokenDoc?.hidden);
  const canControl = !!(isGM || object?.isOwner || tokenDoc?.isOwner);
  const grid = viewed?.grid?.size ?? canvas?.grid?.size ?? 100;
  const center = tokenCenter(object ?? tokenDoc, grid);
  const plan = canvasFocusPlan({
    hasCenter: !!center,
    hidden,
    isGM,
    canControl,
    canvasReady: !!canvas?.ready,
  });

  if (!plan.pan || !center) return { panned: false, controlled: false };

  await canvas.animatePan({ x: center.x, y: center.y });
  let controlled = false;
  if (plan.control && object?.control) {
    object.control({ releaseOthers: true });
    controlled = true;
  }
  return { panned: true, controlled };
}

/**
 * Pan/center the viewed canvas on a placed node token and control it when allowed.
 * Safe no-op when the node is unplaced, hidden from this user, or the canvas is not ready.
 * @param {{ boardSceneId?: string | null, nodeId?: string | null, isGM?: boolean }} [opts]
 * @returns {Promise<{ panned: boolean, controlled: boolean }>}
 */
export async function focusPlacedNodeOnCanvas({
  boardSceneId = null,
  nodeId = null,
  isGM = globalThis.game?.user?.isGM ?? false,
} = {}) {
  const viewed = globalThis.game?.scenes?.viewed ?? globalThis.canvas?.scene ?? null;
  if (!boardSceneId || !nodeId) return { panned: false, controlled: false };
  return focusTokenOnCanvas({
    token: placedNodeToken(boardSceneId, nodeId, viewed),
    isGM,
  });
}

/**
 * Pan to an actor's token on the viewed Scene (Constructs roster anchor).
 * @param {{ actorId?: string | null, actorUuid?: string | null, isGM?: boolean }} [opts]
 */
export async function focusActorTokenOnCanvas({
  actorId = null,
  actorUuid = null,
  isGM = globalThis.game?.user?.isGM ?? false,
} = {}) {
  const viewed = globalThis.game?.scenes?.viewed ?? globalThis.canvas?.scene ?? null;
  const token = viewed?.tokens?.find(doc => {
    if (actorId && (doc.actorId === actorId || doc.actor?.id === actorId)) return true;
    if (actorUuid && (doc.actor?.uuid === actorUuid || doc.actorUuid === actorUuid)) return true;
    return false;
  }) ?? null;
  return focusTokenOnCanvas({ token, isGM });
}
