// Deadhead Gold Line (B106 / 0.3.39): world-inject the dual-Hammerhead train Scene.
// LOCK (Michael 2026-09-20): Level background = interior MP4. ONE roof Tile.
// No interior motion tile. Occlusion off — Director hides the roof to go inside.
// SACRED: if a world already has flag goldLineScene, never rewrite it on ready.
// `{ force: true }` is GM-opt-in only and overwrites walls/lights/tiles/background.
// Template: data/scenes/gold-line.json. Spike: docs/spikes/B106-GOLD-LINE-MAP-PACK.md.
// Prefer loop.mp4. Skip currentTime when duration is non-finite. Never HEAD-probe.

const MODULE_ID = "draw-steel-ghostwire";
const TEMPLATE_PATH = `modules/${MODULE_ID}/data/scenes/gold-line.json`;
const SCENE_FLAG = "goldLineScene";
const ROOF_FLAG = "goldLineRoofs";
const INTERIOR_TILE_FLAG = "goldLineInterior";
const FOLDER_FLAG = "deadheadScenes";
const L = "GHOSTWIRE.Scenes.GoldLine";
const VIDEO_EXT = /\.(webm|mp4|m4v|ogv)$/i;
const VIDEO_PLAYBACK = Object.freeze({ loop: true, autoplay: true, volume: 0 });

export const GOLD_LINE_PLATE = Object.freeze({ width: 6472, height: 958 });
/** One roof tile. Start at 0,0 elev 1 — Michael may nudge. Occlusion NONE. */
export const GOLD_LINE_ROOF = Object.freeze({
  x: 0,
  y: 0,
  width: 6472,
  height: 958,
  elevation: 1,
  sort: 1,
  locked: true,
  occlusion: Object.freeze({ mode: 0, alpha: 1 }),
});

const loc = (key, data) => (data ? game.i18n.format(`${L}.${key}`, data) : game.i18n.localize(`${L}.${key}`));

let templatePromise = null;
let seekGuardInstalled = false;

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

export function isFiniteDuration(value) {
  return Number.isFinite(Number(value));
}

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

/** First existing candidate. Order: loop.mp4 → loop.webm → still.webp.
 *  Stills are a valid playable layout if a loop is missing. */
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
    sort: GOLD_LINE_ROOF.sort,
    locked: GOLD_LINE_ROOF.locked,
    hidden: false,
    texture: { src: roofsSrc },
    occlusion: { ...GOLD_LINE_ROOF.occlusion },
    video: videoPlayback(roofsSrc, template.roofTile.video),
    flags: { [MODULE_ID]: { [ROOF_FLAG]: true } },
  };
}

async function removeStrayInteriorTiles(scene) {
  const stray = scene.tiles.filter(t => t.getFlag(MODULE_ID, INTERIOR_TILE_FLAG));
  if (!stray.length) return;
  await scene.deleteEmbeddedDocuments("Tile", stray.map(t => t.id));
}

async function applyRoofTile(scene, template, roofsSrc) {
  const data = roofPayload(template, roofsSrc);
  const roof = scene.tiles.find(t => t.getFlag(MODULE_ID, ROOF_FLAG));
  if (!roof) {
    await scene.createEmbeddedDocuments("Tile", [{ _id: template.roofTile._id, ...data }]);
    return;
  }
  await roof.update({
    ...data,
    x: GOLD_LINE_ROOF.x,
    y: GOLD_LINE_ROOF.y,
    width: GOLD_LINE_ROOF.width,
    height: GOLD_LINE_ROOF.height,
    elevation: GOLD_LINE_ROOF.elevation,
    sort: GOLD_LINE_ROOF.sort,
    locked: GOLD_LINE_ROOF.locked,
    occlusion: { ...GOLD_LINE_ROOF.occlusion },
  });
}

/**
 * Create the Gold Line Scene (GM only) on *new* worlds.
 * If a scene already has flag goldLineScene, return immediately — never rewrite
 * background, tiles, levels, walls, lights, or dimensions.
 * `{ force: true }` is GM-opt-in only (ready must never pass force).
 */
export async function ensureGoldLineScene({ force = false } = {}) {
  if (!game.user.isGM) return existingGoldLineScene();
  installGoldLineSeekGuard();
  const existing = existingGoldLineScene();
  if (existing && !force) return existing;

  const template = await loadGoldLineTemplate();

  const interiorSrc = await resolveSrc(preferSrc(template.assets, "interiorPrefer", [
    "interiorLoopMp4",
    "interiorLoop",
    "interiorStill",
  ]));
  const roofsSrc = await resolveSrc(preferSrc(template.assets, "roofsPrefer", [
    "roofsLoopMp4",
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
  else {
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

  await removeStrayInteriorTiles(scene);
  await applyRoofTile(scene, template, roofsSrc);
  if (force) ui.notifications.info(loc("Refreshed"));
  return scene;
}

export function registerGoldLineScene() {
  installGoldLineSeekGuard();
  Hooks.once("ready", async () => {
    installGoldLineSeekGuard();
    const module = game.modules.get(MODULE_ID);
    if (module) module.api = { ...(module.api ?? {}), ensureGoldLineScene, loadGoldLineTemplate };
    game.ghostwire = { ...(game.ghostwire ?? {}), ensureGoldLineScene };
    if (!game.user.isGM) return;
    try {
      // Ready never passes force. Existing goldLineScene worlds are sacred.
      if (existingGoldLineScene()) return;
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
