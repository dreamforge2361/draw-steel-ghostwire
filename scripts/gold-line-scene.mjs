// Deadhead Gold Line (B106): world-inject the dual-Hammerhead train Scene.
// Background prefers the interior WebM loop; roofs sit as an overhead tile with
// Foundry v14 SURFACE occlusion (roofs on until a token is underneath).
// Template: data/scenes/gold-line.json. Design: docs/spikes/B106-GOLD-LINE-MAP-PACK.md.

const MODULE_ID = "draw-steel-ghostwire";
const TEMPLATE_PATH = `modules/${MODULE_ID}/data/scenes/gold-line.json`;
const SCENE_FLAG = "goldLineScene";
const ROOF_FLAG = "goldLineRoofs";
const FOLDER_FLAG = "deadheadScenes";
const L = "GHOSTWIRE.Scenes.GoldLine";

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

async function resolveSrc(preferred, fallback) {
  try {
    const res = await fetch(preferred, { method: "HEAD" });
    if (res.ok) return preferred;
  } catch (_) { /* fall through */ }
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

/**
 * Create the Gold Line Scene once in this world (GM only).
 * @param {{ force?: boolean }} [options]  force=true recreates if missing tiles/levels, but never deletes a GM-edited scene.
 */
export async function ensureGoldLineScene({ force = false } = {}) {
  if (!game.user.isGM) return existingGoldLineScene();
  const existing = existingGoldLineScene();
  if (existing && !force) return existing;

  const template = await loadGoldLineTemplate();
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
  else if (force) {
    await scene.update({
      width: template.width,
      height: template.height,
      padding: template.padding,
      backgroundColor: template.backgroundColor,
      thumb: template.thumb,
      grid: { ...template.grid },
      initial: { ...template.initial },
    });
  }

  const levelPayload = {
    name: loc("LevelInterior"),
    sort: template.level.sort,
    elevation: { ...template.level.elevation },
    background: { src: interiorSrc },
  };
  const level = scene.levels?.contents?.[0];
  if (level) await level.update(levelPayload);
  else {
    const [created] = await scene.createEmbeddedDocuments("Level", [{ _id: template.level._id, ...levelPayload }]);
    if (created && scene.initialLevel !== created.id) await scene.update({ initialLevel: created.id });
  }

  const roofExists = scene.tiles.some(t => t.getFlag(MODULE_ID, ROOF_FLAG));
  if (!roofExists) {
    await scene.createEmbeddedDocuments("Tile", [{
      _id: template.roofTile._id,
      name: loc("RoofsTile"),
      x: template.roofTile.x,
      y: template.roofTile.y,
      width: template.roofTile.width,
      height: template.roofTile.height,
      elevation: template.roofTile.elevation,
      sort: template.roofTile.sort,
      locked: template.roofTile.locked,
      texture: { src: roofsSrc },
      occlusion: { ...template.roofTile.occlusion },
      video: { ...template.roofTile.video },
      flags: { [MODULE_ID]: { [ROOF_FLAG]: true } },
    }]);
  }

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
