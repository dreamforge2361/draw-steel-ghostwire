// Deadhead Nightjar Market (0.3.87): world-inject the exchange Scene.
// Foundry order: Mama's → Rack & Rest → Gold Line → Nightjar Market. The
// exchange is its own Scene — never a Gold Line Beat, never Mama's club.
// CREATE-ONCE: if a Scene carries flag nightjarMarketScene, or a Scene named
// Nightjar Market already exists, return it untouched. There is no force path;
// walls, lights, and buyer tokens are the Director's dress pass on the plate.
// Template: data/scenes/nightjar-market.json. Plate 1579×915, grid 63 px = 5 ft.

const MODULE_ID = "draw-steel-ghostwire";
const TEMPLATE_PATH = `modules/${MODULE_ID}/data/scenes/nightjar-market.json`;
const SCENE_FLAG = "nightjarMarketScene";
const GOLD_LINE_FLAG = "goldLineScene";
/** Same Scenes → Deadhead folder flag the Gold Line inject stamps (gold-line-scene.mjs stays untouched). */
const FOLDER_FLAG = "deadheadScenes";
const L = "GHOSTWIRE.Scenes.NightjarMarket";

const loc = key => game.i18n.localize(`${L}.${key}`);

async function deadheadSceneFolder() {
  const existing = game.folders.find(f => (f.type === "Scene") && f.getFlag(MODULE_ID, FOLDER_FLAG));
  if (existing) return existing;
  return Folder.implementation.create({
    name: game.i18n.localize("GHOSTWIRE.Scenes.GoldLine.Folder"),
    type: "Scene",
    color: "#c9a227",
    flags: { [MODULE_ID]: { [FOLDER_FLAG]: true } },
  });
}

export function existingNightjarScene() {
  return game.scenes.find(s => s.getFlag(MODULE_ID, SCENE_FLAG))
    ?? game.scenes.find(s => s.name === loc("Name"))
    ?? null;
}

/**
 * On a fresh world the Gold Line inject is still creating its Scene (and the
 * Deadhead folder) when ready fires. Wait for it, bounded, so Nightjar lands in
 * the same folder and after Gold Line in the nav.
 */
function goldLineSettled(timeoutMs = 15000) {
  if (game.scenes.some(s => s.getFlag(MODULE_ID, GOLD_LINE_FLAG))) return Promise.resolve();
  return new Promise(resolve => {
    const done = () => {
      Hooks.off("createScene", hookId);
      clearTimeout(timer);
      resolve();
    };
    const hookId = Hooks.on("createScene", scene => {
      if (scene.getFlag(MODULE_ID, GOLD_LINE_FLAG)) done();
    });
    const timer = setTimeout(done, timeoutMs);
  });
}

/** Sits right after Gold Line in the nav bar and in the Deadhead folder. */
function afterGoldLine() {
  const goldLine = game.scenes.find(s => s.getFlag(MODULE_ID, GOLD_LINE_FLAG));
  if (!goldLine) return {};
  return { navOrder: (goldLine.navOrder ?? 0) + 1, sort: (goldLine.sort ?? 0) + 1 };
}

/** Create Nightjar Market (GM only) when no Nightjar Scene exists. Never rewrites one. */
export async function ensureNightjarMarketScene() {
  const existing = existingNightjarScene();
  if (existing || !game.user.isGM) return existing;

  const template = await foundry.utils.fetchJsonWithTimeout(TEMPLATE_PATH);
  const folder = await deadheadSceneFolder();
  const scene = await Scene.implementation.create({
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
    ...afterGoldLine(),
    flags: { [MODULE_ID]: { [SCENE_FLAG]: true, nightjarVersion: template.version } },
  });

  const levelPayload = {
    sort: template.level.sort,
    elevation: { ...template.level.elevation },
    background: { src: template.background },
  };
  const level = scene.levels?.contents?.[0];
  if (level) await level.update(levelPayload);
  else {
    const [created] = await scene.createEmbeddedDocuments("Level", [{ _id: template.level._id, ...levelPayload }]);
    if (created && scene.initialLevel !== created.id) await scene.update({ initialLevel: created.id });
  }
  return scene;
}

export function registerNightjarMarketScene() {
  Hooks.once("ready", async () => {
    const module = game.modules.get(MODULE_ID);
    if (module) module.api = { ...(module.api ?? {}), ensureNightjarMarketScene };
    game.ghostwire = { ...(game.ghostwire ?? {}), ensureNightjarMarketScene };
    if (!game.user.isGM || existingNightjarScene()) return;
    try {
      await goldLineSettled();
      const scene = await ensureNightjarMarketScene();
      if (scene) ui.notifications.info(loc("Injected"));
    } catch (error) {
      console.error(`${MODULE_ID} | Nightjar Market scene inject failed`, error);
    }
  });
}
