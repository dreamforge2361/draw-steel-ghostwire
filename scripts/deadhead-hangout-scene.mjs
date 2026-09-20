// Deadhead Beat 0 hangout (B107 / 0.3.43): world-inject the Shady Workshop Scene.
// Still background only — no Levels, no Tiles, no video. Michael walls/lights by hand.
// SACRED: if a world already has flag deadheadHangoutScene, never rewrite it on ready.
// `{ force: true }` is GM-opt-in only and overwrites background and dimensions.
// Template: data/scenes/deadhead-hangout.json. Spike: docs/spikes/B107-DEADHEAD-HANGOUT.md.

const MODULE_ID = "draw-steel-ghostwire";
const TEMPLATE_PATH = `modules/${MODULE_ID}/data/scenes/deadhead-hangout.json`;
const SCENE_FLAG = "deadheadHangoutScene";
const FOLDER_FLAG = "deadheadScenes";
const L = "GHOSTWIRE.Scenes.DeadheadHangout";

/** CyberMaps "Shady Workshop HD - Gridless" still. 1920x1080, grid 80 = 5 ft. */
export const DEADHEAD_HANGOUT_PLATE = Object.freeze({ width: 1920, height: 1080 });

const loc = key => game.i18n.localize(`${L}.${key}`);

let templatePromise = null;

export function loadDeadheadHangoutTemplate() {
  templatePromise ??= foundry.utils.fetchJsonWithTimeout(TEMPLATE_PATH).catch(error => {
    templatePromise = null;
    throw error;
  });
  return templatePromise;
}

/** Reuse the Gold Line "Deadhead" Scene folder — one folder per run, not per map. */
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

function existingHangoutScene() {
  return game.scenes.find(s => s.getFlag(MODULE_ID, SCENE_FLAG)) ?? null;
}

/**
 * Create the Deadhead hangout Scene (GM only) on *new* worlds.
 * If a scene already has flag deadheadHangoutScene, return immediately — never
 * rewrite background, walls, lights, tokens, or dimensions.
 * `{ force: true }` is GM-opt-in only (ready must never pass force).
 */
export async function ensureDeadheadHangoutScene({ force = false } = {}) {
  if (!game.user.isGM) return existingHangoutScene();
  const existing = existingHangoutScene();
  if (existing && !force) return existing;

  const template = await loadDeadheadHangoutTemplate();
  const src = template.assets.still;
  const folder = await deadheadSceneFolder();

  const plate = {
    width: DEADHEAD_HANGOUT_PLATE.width,
    height: DEADHEAD_HANGOUT_PLATE.height,
    padding: template.padding,
    backgroundColor: template.backgroundColor,
    thumb: template.thumb,
    background: { src },
    grid: { ...template.grid },
    initial: { ...template.initial },
  };

  if (existing) {
    await existing.update({
      ...plate,
      [`flags.${MODULE_ID}.deadheadHangoutVersion`]: template.version,
    });
    ui.notifications.info(loc("Refreshed"));
    return existing;
  }

  return Scene.implementation.create({
    name: loc("Name"),
    navName: loc("Name"),
    navigation: template.navigation,
    tokenVision: template.tokenVision,
    folder: folder?.id ?? null,
    ...plate,
    flags: {
      [MODULE_ID]: { [SCENE_FLAG]: true, deadheadHangoutVersion: template.version },
    },
  });
}

export function registerDeadheadHangoutScene() {
  Hooks.once("ready", async () => {
    const module = game.modules.get(MODULE_ID);
    if (module) {
      module.api = {
        ...(module.api ?? {}),
        ensureDeadheadHangoutScene,
        loadDeadheadHangoutTemplate,
      };
    }
    game.ghostwire = { ...(game.ghostwire ?? {}), ensureDeadheadHangoutScene };
    if (!game.user.isGM) return;
    try {
      // Ready never passes force. Existing deadheadHangoutScene worlds are sacred.
      if (existingHangoutScene()) return;
      const scene = await ensureDeadheadHangoutScene();
      if (scene && !scene.getFlag(MODULE_ID, "deadheadHangoutNotified")) {
        ui.notifications.info(loc("Injected"));
        await scene.setFlag(MODULE_ID, "deadheadHangoutNotified", true);
      }
    } catch (error) {
      console.error(`${MODULE_ID} | Deadhead hangout scene inject failed`, error);
    }
  });
}
