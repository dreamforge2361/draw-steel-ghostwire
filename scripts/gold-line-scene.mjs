// Deadhead Gold Line (B106 / 0.3.39): world-inject the dual-Hammerhead train Scene.
// WORKING SETUP (Michael 2026-09-20): do NOT use Level background video (broken).
// Two Tiles play the duration-valid MP4s. Template: data/scenes/gold-line.json.
// Design: docs/spikes/B106-GOLD-LINE-MAP-PACK.md.
//
// Do not use HEAD / foundry.utils.srcExists to probe loops — Foundry's file server
// often rejects HEAD on webm.
//
// Prefer loop.mp4 → loop.webm → still.webp. Skip currentTime when duration is
// non-finite. Stills remain a valid playable layout if video is missing.
// Do not change train art content. Roof occlusion is NONE (solid) — the Director
// hides the roof tile when the crew goes inside.
//
// Roof x/y 3232, 475 until a final GOLD_LINE_LOCKED paste.

const MODULE_ID = "draw-steel-ghostwire";
const TEMPLATE_PATH = `modules/${MODULE_ID}/data/scenes/gold-line.json`;
const SCENE_FLAG = "goldLineScene";
const INTERIOR_FLAG = "goldLineInterior";
const ROOF_FLAG = "goldLineRoofs";
const FOLDER_FLAG = "deadheadScenes";
const L = "GHOSTWIRE.Scenes.GoldLine";
const VIDEO_EXT = /\.(webm|mp4|m4v|ogv)$/i;
const VIDEO_PLAYBACK = Object.freeze({ loop: true, autoplay: true, volume: 0 });
/** Dual-Hammerhead plate. Scene canvas stays this size on force. */
export const GOLD_LINE_PLATE = Object.freeze({ width: 6472, height: 958 });
/**
 * Interior motion tile (Michael working setup 2026-09-20).
 * x/y 0,0 — this tile fills the scene like a background. Level background src
 * stays empty (Level video is broken on this stack).
 */
export const GOLD_LINE_INTERIOR = Object.freeze({
  x: 0,
  y: 0,
  width: 6472,
  height: 958,
  elevation: 0,
  sort: 0,
  locked: true,
  occlusion: Object.freeze({ mode: 0, alpha: 1 }),
});
/**
 * Roof motion tile (Michael live align 2026-09-20). Await GOLD_LINE_LOCKED
 * if these numbers change; use 3232/475 until then.
 *
 * x/y are not 0,0: a Foundry Tile's x/y is its registration point (center), so
 * a full-plate roof sits near (width/2, height/2) ≈ (3236, 479). Michael nudged
 * that to 3232, 475. The interior tile stays at 0,0 (scene-origin fill).
 * Occlusion is NONE (mode 0, alpha 1) — solid. Director hides this tile when
 * the crew goes inside.
 */
export const GOLD_LINE_ROOF = Object.freeze({
  x: 3232,
  y: 475,
  width: 6472,
  height: 958,
  elevation: 1,
  sort: 100,
  locked: true,
  occlusion: Object.freeze({ mode: 0, alpha: 1 }),
});

const loc = (key, data) => (data ? game.i18n.format(`${L}.${key}`, data) : game.i18n.localize(`${L}.${key}`));

let templatePromise = null;
let seekGuardInstalled = false;

/** Load the shipped scene template (paths, grid, occlusion). */
export function loadGoldLineTemplate() {
  templatePromise ??= foundry.utils.fetchJsonWithTimeout(TEMPLATE_PATH).catch(error => {
    templatePromise = null;
    throw error;
  });
  return templatePromise;
}

function isVideoSrc(src) {
  return VIDEO_EXT.test(src ?? "");
}

function videoPlayback(src, extra = {}) {
  return isVideoSrc(src) ? { ...VIDEO_PLAYBACK, ...extra } : extra;
}

function emptyLevelBackground() {
  return { src: "" };
}

/** True when a media duration (or seek target) is a real number Foundry can use. */
export function isFiniteDuration(value) {
  return Number.isFinite(Number(value));
}

/**
 * Apply currentTime only when duration and the requested time are finite.
 * VP9 Gold Line webms report duration=N/A; seeking them throws in Chromium.
 */
export function safeVideoCurrentTime(media, time = 0) {
  if (!media) return false;
  if (!isFiniteDuration(media.duration) || !isFiniteDuration(time)) return false;
  try {
    media.currentTime = Number(time);
    return true;
  } catch (_) {
    return false;
  }
}

function goldLineVideoSrc(mediaOrSrc) {
  const src = typeof mediaOrSrc === "string"
    ? mediaOrSrc
    : (mediaOrSrc?.currentSrc || mediaOrSrc?.src || "");
  return typeof src === "string" && src.includes("/gold-line/") && VIDEO_EXT.test(src);
}

function wrapVideoHelperPlay(helper) {
  if (!helper?.play || helper.play._gwGoldLine) return;
  const orig = helper.play.bind(helper);
  const wrapped = (video, options = {}) => {
    const skipSeek = goldLineVideoSrc(video) && !isFiniteDuration(video?.duration);
    const nextOptions = skipSeek && options && Object.prototype.hasOwnProperty.call(options, "offset")
      ? (() => {
        const { offset: _offset, ...rest } = options;
        return rest;
      })()
      : options;
    try {
      return orig(video, nextOptions);
    } catch (error) {
      if (goldLineVideoSrc(video) && /non-finite/i.test(String(error?.message ?? error))) {
        const { offset: _offset, ...rest } = options ?? {};
        return orig(video, rest);
      }
      throw error;
    }
  };
  wrapped._gwGoldLine = true;
  helper.play = wrapped;
}

/**
 * When applying Gold Line video, skip currentTime writes if duration is non-finite.
 * Installs a per-element currentTime guard plus a VideoHelper.play wrapper.
 */
export function installGoldLineSeekGuard() {
  if (seekGuardInstalled) return;
  seekGuardInstalled = true;

  const Media = globalThis.HTMLMediaElement;
  const desc = Media ? Object.getOwnPropertyDescriptor(Media.prototype, "currentTime") : null;
  if (desc?.set && !desc.set._gwGoldLine) {
    const rawSet = desc.set;
    const guarded = function setCurrentTime(value) {
      if (goldLineVideoSrc(this) && (!isFiniteDuration(this.duration) || !isFiniteDuration(value))) {
        return;
      }
      return rawSet.call(this, value);
    };
    guarded._gwGoldLine = true;
    Object.defineProperty(Media.prototype, "currentTime", {
      configurable: true,
      enumerable: desc.enumerable,
      get: desc.get,
      set: guarded,
    });
  }

  wrapVideoHelperPlay(globalThis.foundry?.helpers?.media?.VideoHelper);
  wrapVideoHelperPlay(globalThis.VideoHelper);
  wrapVideoHelperPlay(globalThis.game?.video);
}

/** True when a module media path exists. Never uses HEAD (webm often 405s). */
export async function mediaExists(path) {
  const slash = path.lastIndexOf("/");
  const dir = slash >= 0 ? path.slice(0, slash) : "";
  const file = slash >= 0 ? path.slice(slash + 1) : path;
  if (dir && globalThis.FilePicker?.browse) {
    try {
      const listing = await FilePicker.browse("data", dir);
      if (listing.files?.some(entry => entry === path || entry.endsWith(`/${file}`) || entry === file)) return true;
    } catch (_) { /* fall through to ranged GET */ }
  }
  try {
    const ranged = await fetch(path, { headers: { Range: "bytes=0-0" } });
    if (ranged.ok || ranged.status === 206) return true;
    if (ranged.status !== 405 && ranged.status !== 416 && ranged.status !== 501) return false;
  } catch (_) { /* try a short GET */ }
  try {
    const res = await fetch(path, { headers: { Range: "bytes=0-1" } });
    return res.ok || res.status === 206;
  } catch (_) {
    return false;
  }
}

/**
 * First existing candidate. Gold Line order is loop.mp4 → loop.webm → still.webp.
 */
export async function resolveSrc(...candidates) {
  const list = candidates.flat(Infinity).filter(src => typeof src === "string" && src);
  if (!list.length) return null;
  for (const src of list) {
    if (await mediaExists(src)) return src;
  }
  return list[list.length - 1];
}

function preferSrc(assets, preferKey, keys) {
  return assets?.[preferKey] ?? keys.map(key => assets?.[key]).filter(Boolean);
}

async function deadheadSceneFolder() {
  const existing = game.folders.find(f => (f.type === "Scene") && f.getFlag(MODULE_ID, FOLDER_FLAG));
  if (existing) return existing;
  return Folder.implementation.create({
    name: loc("Folder"),
    type: "Scene",
    color: "#c9a227",
    flags: { [MODULE_ID]: { [FOLDER_FLAG]: true } },
  });
}

function existingGoldLineScene() {
  return game.scenes.find(s => s.getFlag(MODULE_ID, SCENE_FLAG)) ?? null;
}

function tilePayload(name, flag, place, src, videoExtra = {}) {
  return {
    name,
    x: place.x,
    y: place.y,
    width: place.width,
    height: place.height,
    elevation: place.elevation,
    sort: place.sort,
    locked: place.locked,
    hidden: false,
    texture: { src },
    occlusion: { ...place.occlusion },
    video: videoPlayback(src, videoExtra),
    flags: { [MODULE_ID]: { [flag]: true } },
  };
}

async function applyFlaggedTile(scene, { _id, flag, name, place, src, videoExtra }) {
  const data = tilePayload(name, flag, place, src, videoExtra);
  const existing = scene.tiles.find(t => t.getFlag(MODULE_ID, flag));
  if (!existing) {
    await scene.createEmbeddedDocuments("Tile", [{ _id, ...data }]);
    return;
  }
  await existing.update({
    ...data,
    x: place.x,
    y: place.y,
    width: place.width,
    height: place.height,
    elevation: place.elevation,
    sort: place.sort,
    locked: place.locked,
    occlusion: { ...place.occlusion },
  });
}

/**
 * Create or refresh the Gold Line Scene (GM only).
 * force=true (or a stale goldLineVersion) restamps both motion tiles and
 * clears the Level background (Level video is broken). Does not delete the Scene.
 */
export async function ensureGoldLineScene({ force = false } = {}) {
  if (!game.user.isGM) return existingGoldLineScene();
  installGoldLineSeekGuard();
  const template = await loadGoldLineTemplate();
  const existing = existingGoldLineScene();
  const installed = Number(existing?.getFlag(MODULE_ID, "goldLineVersion") ?? 0);
  const stale = Boolean(existing && installed < Number(template.version ?? 0));
  const rewrite = force || stale;
  if (existing && !rewrite) return existing;

  const interiorSrc = await resolveSrc(preferSrc(template.assets, "interiorPrefer", [
    "interiorLoopMp4",
    "interiorLoopFixed",
    "interiorLoop",
    "interiorStill",
  ]));
  const roofsSrc = await resolveSrc(preferSrc(template.assets, "roofsPrefer", [
    "roofsLoopMp4",
    "roofsLoopFixed",
    "roofsLoop",
    "roofsStill",
  ]));
  const folder = await deadheadSceneFolder();

  const sceneData = {
    name: loc("Name"),
    navName: loc("Name"),
    navigation: template.navigation,
    width: GOLD_LINE_PLATE.width,
    height: GOLD_LINE_PLATE.height,
    padding: template.padding,
    backgroundColor: template.backgroundColor,
    tokenVision: template.tokenVision,
    thumb: template.thumb,
    grid: { ...template.grid },
    initial: { ...template.initial },
    folder: folder?.id ?? null,
    flags: { [MODULE_ID]: { [SCENE_FLAG]: true, goldLineVersion: template.version } },
  };

  let scene = existing;
  if (!scene) scene = await Scene.implementation.create(sceneData);
  else if (rewrite) {
    await scene.update({
      width: GOLD_LINE_PLATE.width,
      height: GOLD_LINE_PLATE.height,
      padding: template.padding,
      backgroundColor: template.backgroundColor,
      thumb: template.thumb,
      grid: { ...template.grid },
      initial: { ...template.initial },
      [`flags.${MODULE_ID}.goldLineVersion`]: template.version,
    });
  }

  const levelPayload = {
    name: loc("LevelInterior"),
    sort: template.level.sort,
    elevation: { ...template.level.elevation },
    background: emptyLevelBackground(),
  };
  const level = scene.levels?.contents?.[0];
  if (level) await level.update(levelPayload);
  else {
    const [created] = await scene.createEmbeddedDocuments("Level", [{ _id: template.level._id, ...levelPayload }]);
    if (created && scene.initialLevel !== created.id) await scene.update({ initialLevel: created.id });
  }

  await applyFlaggedTile(scene, {
    _id: template.interiorTile._id,
    flag: INTERIOR_FLAG,
    name: loc("InteriorTile"),
    place: GOLD_LINE_INTERIOR,
    src: interiorSrc,
    videoExtra: template.interiorTile.video,
  });
  await applyFlaggedTile(scene, {
    _id: template.roofTile._id,
    flag: ROOF_FLAG,
    name: loc("RoofsTile"),
    place: GOLD_LINE_ROOF,
    src: roofsSrc,
    videoExtra: template.roofTile.video,
  });
  if (stale && !force) ui.notifications.info(loc("Refreshed"));
  return scene;
}

/** Register ready-hook inject + module API. Call during the init hook. */
export function registerGoldLineScene() {
  installGoldLineSeekGuard();
  Hooks.once("ready", async () => {
    installGoldLineSeekGuard();
    const module = game.modules.get(MODULE_ID);
    if (module) module.api = { ...(module.api ?? {}), ensureGoldLineScene, loadGoldLineTemplate };
    game.ghostwire = { ...(game.ghostwire ?? {}), ensureGoldLineScene };
    if (!game.user.isGM) return;
    try {
      const scene = await ensureGoldLineScene();
      if (scene && !scene.getFlag(MODULE_ID, "goldLineNotified")) {
        ui.notifications.info(loc("Injected"));
        await scene.setFlag(MODULE_ID, "goldLineNotified", true);
      }
    } catch (error) {
      console.error(`${MODULE_ID} | Gold Line scene inject failed`, error);
    }
  });
}
