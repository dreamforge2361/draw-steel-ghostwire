// 0.3.131 (A/D) — the canvas primitives behind scripts/hit-fx.mjs.
//
// This file exists because 0.3.130's hit FX had two silent failure modes and both of them lived in
// the drawing, not in the classifier:
//
//  1. **Nothing to look at.** The built-in beat was two- and three-pixel vector strokes over about
//     half a second. On a zoomed-out battle map, against a lit token, that is a rumour. The fix is
//     textures: six small greyscale+alpha PNGs in `assets/fx/`, tinted per profile and drawn
//     **additively**, which is how every FX module on the shelf gets a muzzle flash to read. The
//     PNGs are Ghostwire's own — `tools/make-fx-assets.mjs` writes them — so nothing here is
//     licensed from JB2A or anyone else. See `assets/fx/README.md`.
//  2. **A drawing API that may not be there.** Foundry 14.367 bundles PIXI 7.4.3 and core itself
//     still calls `beginFill` / `lineStyle`, so the v7 calls 0.3.127 shipped do work today. They
//     will not survive the jump to PIXI 8, where the whole Graphics fill/stroke API was replaced.
//     Every vector call in Ghostwire now goes through the shims below, which use v7 when v7 is
//     there and the v8 `fill()` / `stroke()` form when it is not. One code path, both engines.
//
// Textures are the primary path and the vectors are the floor: if the PNGs have not finished
// loading (a first hit inside the first second of a scene), the shimmed vector beat still draws.
// Neither path needs Automated Animations, Sequencer or JB2A.
//
// Everything here is Foundry-free except where it names `canvas` / `PIXI`, and every entry point
// guards for their absence so tools/wave-03131-smoke.mjs can import it under Node.

const MODULE_ID = "draw-steel-ghostwire";

/** Where the generated PNGs live, as Foundry resolves them. */
export const FX_ASSET_DIR = `modules/${MODULE_ID}/assets/fx`;

/**
 * The six textures `tools/make-fx-assets.mjs` writes.
 *
 *  * `glow`  — hot core in a wide halo: muzzle, tracer head, impact flash.
 *  * `flare` — glow plus four spikes: the "something went off here" beat.
 *  * `ring`  — the expanding shockwave.
 *  * `beam`  — stretched origin→target, tapered so neither end shows a cut edge.
 *  * `spark` — a tapered streak for the shards an impact throws.
 *  * `slash` — the melee crescent.
 */
export const FX_TEXTURES = Object.freeze(["glow", "flare", "ring", "beam", "spark", "slash"]);

/** @param {string} name @returns {string} */
export const fxAssetPath = name => `${FX_ASSET_DIR}/${name}.png`;

/* -------------------------------------------- texture cache */

const textures = new Map();
let loading = null;

/**
 * Has this texture been freed under us?
 *
 * `Texture#destroyed` alone is not enough: a scene change runs `TextureLoader.loadSceneTextures`
 * with `expireCache`, which destroys the **base** texture of anything the new scene does not use
 * while the wrapper stays nominally alive. A sprite built on one of those renders nothing, which is
 * precisely the class of silent blank this wave exists to remove, so both layers are checked (and
 * `source` is the PIXI 8 spelling of `baseTexture`).
 */
const isDeadTexture = texture => !texture
  || texture.destroyed
  || (texture.baseTexture?.destroyed === true)
  || (texture.source?.destroyed === true);

/**
 * Load every FX texture once and keep it. Called on `ready` and on every `canvasReady`, because a
 * texture freed by a scene teardown has to come back before the next shot is fired.
 *
 * Never rejects: a missing PNG leaves that key out of the cache and the vector floor covers it.
 *
 * @returns {Promise<number>} How many textures are cached afterwards.
 */
export function preloadFxTextures() {
  if (loading) return loading;
  loading = (async () => {
    for (const name of FX_TEXTURES) {
      if (!isDeadTexture(textures.get(name))) continue;
      textures.delete(name);
      try {
        const texture = await loadOne(fxAssetPath(name));
        if (texture) textures.set(name, texture);
      } catch (error) {
        console.warn(`${MODULE_ID} | FX texture ${name} did not load; vector beats will cover it`, error);
      }
    }
    loading = null;
    return textures.size;
  })();
  return loading;
}

async function loadOne(src) {
  // Foundry's own loader first: it shares the core texture cache, so a re-preload after a scene
  // change is free and the PNG is never fetched twice.
  const core = globalThis.foundry?.canvas?.loadTexture ?? globalThis.loadTexture ?? null;
  if (typeof core === "function") {
    const texture = await core(src);
    if (texture) return texture;
  }
  if (globalThis.PIXI?.Assets?.load) return await globalThis.PIXI.Assets.load(src);
  return globalThis.PIXI?.Texture?.from?.(src) ?? null;
}

/** A loaded texture, or null when it is not ready yet. Never throws. */
export function fxTexture(name) {
  const texture = textures.get(name);
  if (isDeadTexture(texture)) return null;
  return texture;
}

/** True when every texture a profile asks for is in hand, so the sprite path can run. */
export function fxTexturesReady(names = FX_TEXTURES) {
  return names.every(name => !!fxTexture(name));
}

/** Test seam: drop the cache so a reload is forced. */
export function clearFxTextures() {
  textures.clear();
  loading = null;
}

/* -------------------------------------------- sprites */

/**
 * `PIXI.BLEND_MODES.ADD` on PIXI 7, the string `"add"` on PIXI 8. Both engines accept their own.
 *
 * Resolved per call rather than at module load: this file is imported during Foundry's `init`, and
 * reading another library's namespace at import time is how a module ends up depending on script
 * order it does not control.
 */
export const additiveBlend = () => globalThis.PIXI?.BLEND_MODES?.ADD ?? "add";

/**
 * One additive, centred, non-interactive sprite parented to `container`.
 *
 * @param {PIXI.Container} container
 * @param {string} name     A key from {@link FX_TEXTURES}.
 * @param {object} [opts]
 * @returns {PIXI.Sprite|null} null when the texture is not loaded — callers fall back to vectors.
 */
export function addFxSprite(container, name, { tint = 0xffffff, alpha = 1, anchorX = 0.5, anchorY = 0.5 } = {}) {
  const texture = fxTexture(name);
  if (!texture || !container || !globalThis.PIXI?.Sprite) return null;
  const sprite = new globalThis.PIXI.Sprite(texture);
  sprite.anchor.set(anchorX, anchorY);
  sprite.tint = tint;
  sprite.alpha = alpha;
  sprite.blendMode = additiveBlend();
  sprite.eventMode = "none";
  return container.addChild(sprite);
}

/**
 * Lay a sprite along a segment: anchored at its left edge, rotated to the heading, sized to span it.
 * The one call that makes `beam` and `spark` useful.
 */
export function layAlong(sprite, from, to, thickness) {
  if (!sprite) return sprite;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  sprite.anchor.set(0, 0.5);
  sprite.position.set(from.x, from.y);
  sprite.rotation = Math.atan2(dy, dx);
  sprite.width = Math.max(1, Math.hypot(dx, dy));
  sprite.height = Math.max(1, thickness);
  return sprite;
}

/** Centre a sprite at a point and give it a diameter. */
export function placeAt(sprite, point, diameter) {
  if (!sprite) return sprite;
  sprite.anchor.set(0.5, 0.5);
  sprite.position.set(point.x, point.y);
  sprite.width = Math.max(1, diameter);
  sprite.height = Math.max(1, diameter);
  return sprite;
}

/* -------------------------------------------- the PIXI 7 / PIXI 8 Graphics shim */

/**
 * True on PIXI 7 (and anything else that kept the v7 Graphics API).
 *
 * The check is on the instance rather than on a version string because a shim, a patched build or
 * a future PIXI that restores the call would all read correctly, and no version number has to be
 * maintained here.
 */
export const isLegacyGraphics = graphics => typeof graphics?.lineStyle === "function";

/** A stroked polyline through `points`. */
export function strokePath(graphics, points, { color = 0xffffff, alpha = 1, width = 2 } = {}) {
  if (!graphics || (points?.length ?? 0) < 2) return graphics;
  if (isLegacyGraphics(graphics)) {
    graphics.lineStyle(width, color, alpha);
    graphics.moveTo(points[0].x, points[0].y);
    for (const point of points.slice(1)) graphics.lineTo(point.x, point.y);
    graphics.lineStyle(0);
    return graphics;
  }
  graphics.moveTo(points[0].x, points[0].y);
  for (const point of points.slice(1)) graphics.lineTo(point.x, point.y);
  graphics.stroke({ width, color, alpha });
  return graphics;
}

/** A filled disc. */
export function fillCircle(graphics, { x, y, radius, color = 0xffffff, alpha = 1 } = {}) {
  if (!graphics || !(radius > 0)) return graphics;
  if (isLegacyGraphics(graphics)) {
    graphics.lineStyle(0).beginFill(color, alpha).drawCircle(x, y, radius).endFill();
    return graphics;
  }
  graphics.circle(x, y, radius).fill({ color, alpha });
  return graphics;
}

/** A stroked circle, optionally with a wash inside it. */
export function strokeCircle(graphics, { x, y, radius, color = 0xffffff, alpha = 1, width = 2, fillAlpha = 0 } = {}) {
  if (!graphics || !(radius > 0)) return graphics;
  if (isLegacyGraphics(graphics)) {
    graphics.lineStyle(width, color, alpha);
    if (fillAlpha > 0) graphics.beginFill(color, fillAlpha);
    graphics.drawCircle(x, y, radius);
    if (fillAlpha > 0) graphics.endFill();
    graphics.lineStyle(0);
    return graphics;
  }
  graphics.circle(x, y, radius);
  if (fillAlpha > 0) graphics.fill({ color, alpha: fillAlpha });
  graphics.stroke({ width, color, alpha });
  return graphics;
}

/** A stroked arc — the melee sweep. */
export function strokeArc(graphics, { x, y, radius, start, end, color = 0xffffff, alpha = 1, width = 2 } = {}) {
  if (!graphics || !(radius > 0)) return graphics;
  if (isLegacyGraphics(graphics)) {
    graphics.lineStyle(width, color, alpha);
    graphics.arc(x, y, radius, start, end);
    graphics.lineStyle(0);
    return graphics;
  }
  graphics.arc(x, y, radius, start, end);
  graphics.stroke({ width, color, alpha });
  return graphics;
}

/** A stroked quadratic curve — the melee slash's trailing edge. */
export function strokeQuad(graphics, { from, control, to, color = 0xffffff, alpha = 1, width = 2 } = {}) {
  if (!graphics || !from || !to) return graphics;
  if (isLegacyGraphics(graphics)) {
    graphics.lineStyle(width, color, alpha);
    graphics.moveTo(from.x, from.y);
    graphics.quadraticCurveTo(control.x, control.y, to.x, to.y);
    graphics.lineStyle(0);
    return graphics;
  }
  graphics.moveTo(from.x, from.y);
  graphics.quadraticCurveTo(control.x, control.y, to.x, to.y);
  graphics.stroke({ width, color, alpha });
  return graphics;
}

/** Destroy a display object and everything under it, whatever engine built it. */
export function destroyDisplay(display) {
  if (!display || display.destroyed) return;
  try {
    display.parent?.removeChild(display);
  } catch { /* already detached */ }
  try {
    display.destroy({ children: true });
  } catch { /* already gone */ }
}
