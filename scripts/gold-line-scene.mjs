// Deadhead Gold Line (B106 / 0.3.37 hotfix): world-inject the dual-Hammerhead train Scene.
// Background prefers the interior WebM loop; roofs sit as an overhead tile with
// Foundry v14 SURFACE occlusion (roofs on until a token is underneath).
// Template: data/scenes/gold-line.json. Design: docs/spikes/B106-GOLD-LINE-MAP-PACK.md.
//
// Do not use HEAD / foundry.utils.srcExists to probe loops — Foundry's file server
// often rejects HEAD on webm and the old inject fell back to stills.

const MODULE_ID = "draw-steel-ghostwire";
const TEMPLATE_PATH = `modules/${MODULE_ID}/data/scenes/gold-line.json`;
const SCENE_FLAG = "goldLineScene";
const ROOF_FLAG = "goldLineRoofs";
const FOLDER_FLAG = "deadheadScenes";
const L = "GHOSTWIRE.Scenes.GoldLine";
const VIDEO_EXT = /\.(webm|mp4|m4v|ogv)$/i;
const VIDEO_PLAYBACK = Object.freeze({ loop: true, autoplay: true, volume: 0 });

const loc = (key, data) => (data ? game.i18n.format(`${L}.${key}`, data) : game.i18n.localize(`${L}.${key}`));

let templatePromise = null;

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

/** Prefer the loop path when it exists; stills only if the loop GET/browse fails. */
export async function resolveSrc(preferred, fallback) {
  if (await mediaExists(preferred)) return preferred;
  return fallback;
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
    x: template.roofTile.x,
    y: template.roofTile.y,
    width: template.roofTile.width,
    height: template.roofTile.height,
    elevation: template.roofTile.elevation,
    sort: template.roofTile.sort,
    locked: template.roofTile.locked,
    hidden: false,
    texture: { src: roofsSrc },
    occlusion: { ...template.roofTile.occlusion },
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
  if (force) await roof.update(data);
}

/**
 * Create or refresh the Gold Line Scene (GM only).
 * force=true (or a stale goldLineVersion) restamps Level background + roof tile
 * onto the loop paths without deleting the Scene.
 */
export async function ensureGoldLineScene({ force = false } = {}) {
  if (!game.user.isGM) return existingGoldLineScene();
  const template = await loadGoldLineTemplate();
  const existing = existingGoldLineScene();
  const installed = Number(existing?.getFlag(MODULE_ID, "goldLineVersion") ?? 0);
  const stale = Boolean(existing && installed < Number(template.version ?? 0));
  const rewrite = force || stale;
  if (existing && !rewrite) return existing;

  const interiorSrc = await resolveSrc(template.assets.interiorLoop, template.assets.interiorStill);
  const roofsSrc = await resolveSrc(template.assets.roofsLoop, template.assets.roofsStill);
  const folder = await deadheadSceneFolder();

  const sceneData = {
    name: loc("Name"),
    navName: loc("Name"),
    navigation: template.navigation,
    width: template.width,
    height: template.height,
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
      width: template.width,
      height: template.height,
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
  Hooks.once("ready", async () => {
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
