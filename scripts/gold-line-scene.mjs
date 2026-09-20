// Deadhead Gold Line (B106 / 0.3.39 hotfix): world-inject the dual-Hammerhead train Scene.
// Default to stills until video is proven. Roofs are a SOLID overhead tile
// (occlusion NONE) at Michael's locked place. Template: data/scenes/gold-line.json.
// Design: docs/spikes/B106-GOLD-LINE-MAP-PACK.md.
//
// Do not use HEAD / foundry.utils.srcExists to probe loops — Foundry's file server
// often rejects HEAD on webm and the old inject fell back to stills.
//
// Shipped VP9 webms report stream duration=N/A; Foundry then throws
// "Failed to set currentTime ... non-finite". Prefer still.webp first; mp4/webm
// stay shipped for a later opt-in. Stills are a valid playable layout.
// Do not change train art content. Do not enable FADE / Surface roof occlusion.

const MODULE_ID = "draw-steel-ghostwire";
const TEMPLATE_PATH = `modules/${MODULE_ID}/data/scenes/gold-line.json`;
const SCENE_FLAG = "goldLineScene";
const ROOF_FLAG = "goldLineRoofs";
const FOLDER_FLAG = "deadheadScenes";
const L = "GHOSTWIRE.Scenes.GoldLine";
const VIDEO_EXT = /\.(webm|mp4|m4v|ogv)$/i;
const VIDEO_PLAYBACK = Object.freeze({ loop: true, autoplay: true, volume: 0 });
/** Dual-Hammerhead plate. Scene canvas stays this size on force. */
export const GOLD_LINE_PLATE = Object.freeze({ width: 6472, height: 958 });
/**
 * Michael-locked roof (live align 2026-09-20). Always restamp on force.
 *
 * x/y are not 0,0: the Level background is pinned to the scene origin and fills
 * 6472×958. A Foundry Tile's x/y is its registration point (center), so a
 * full-plate roof sits near (width/2, height/2) ≈ (3236, 479). Michael nudged
 * that to 3232, 475. Resetting to 0,0 shifts the roof by half a plate.
 *
 * elevation 1 (not 10) so Levels does not hide the tile. Occlusion stays
 * NONE (mode 0, alpha 1) — solid roofs; no FADE / Surface.
 */
export const GOLD_LINE_ROOF = Object.freeze({
  x: 3232,
  y: 475,
  width: 6472,
  height: 958,
  elevation: 1,
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

function levelBackground(src, template) {
  const background = { src };
  if (isVideoSrc(src)) background.video = videoPlayback(src, template?.level?.video);
  return background;
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
 * First existing candidate. Gold Line default is still.webp until video is proven
 * (then optional loop.mp4 / loop-fixed.webm / loop.webm).
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

function roofPayload(template, roofsSrc) {
  return {
    name: loc("RoofsTile"),
    x: GOLD_LINE_ROOF.x,
    y: GOLD_LINE_ROOF.y,
    width: GOLD_LINE_ROOF.width,
    height: GOLD_LINE_ROOF.height,
    elevation: GOLD_LINE_ROOF.elevation,
    sort: template.roofTile.sort,
    locked: GOLD_LINE_ROOF.locked,
    hidden: false,
    texture: { src: roofsSrc },
    occlusion: { ...GOLD_LINE_ROOF.occlusion },
    video: videoPlayback(roofsSrc, template.roofTile.video),
    flags: { [MODULE_ID]: { [ROOF_FLAG]: true } },
  };
}

async function applyRoofTile(scene, template, roofsSrc, { force = false } = {}) {
  const roof = scene.tiles.find(t => t.getFlag(MODULE_ID, ROOF_FLAG));
  const data = roofPayload(template, roofsSrc);
  if (!roof) {
    await scene.createEmbeddedDocuments("Tile", [{ _id: template.roofTile._id, ...data }]);
    return;
  }
  if (force) {
    // Always restamp Michael's locked place — a failed video left a one-car scrap.
    await roof.update({
      ...data,
      x: GOLD_LINE_ROOF.x,
      y: GOLD_LINE_ROOF.y,
      width: GOLD_LINE_ROOF.width,
      height: GOLD_LINE_ROOF.height,
      elevation: GOLD_LINE_ROOF.elevation,
      locked: GOLD_LINE_ROOF.locked,
      occlusion: { ...GOLD_LINE_ROOF.occlusion },
    });
  }
}

/**
 * Create or refresh the Gold Line Scene (GM only).
 * force=true (or a stale goldLineVersion) restamps Level background + roof tile
 * onto the stills (default) without deleting the Scene.
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
    "interiorStill",
    "interiorLoopMp4",
    "interiorLoopFixed",
    "interiorLoop",
  ]));
  const roofsSrc = await resolveSrc(preferSrc(template.assets, "roofsPrefer", [
    "roofsStill",
    "roofsLoopMp4",
    "roofsLoopFixed",
    "roofsLoop",
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
    background: levelBackground(interiorSrc, template),
  };
  const level = scene.levels?.contents?.[0];
  if (level) await level.update(levelPayload);
  else {
    const [created] = await scene.createEmbeddedDocuments("Level", [{ _id: template.level._id, ...levelPayload }]);
    if (created && scene.initialLevel !== created.id) await scene.update({ initialLevel: created.id });
  }

  await applyRoofTile(scene, template, roofsSrc, { force: rewrite || !scene.tiles.some(t => t.getFlag(MODULE_ID, ROOF_FLAG)) });
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
