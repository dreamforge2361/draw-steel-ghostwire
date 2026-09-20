// Wired node tokens + linked Wired map (B32 Phase 5b, docs/spikes/B32-PHASE5B-NODE-TOKENS-WIRED-MAP.md).
// - A matrix map Scene can point at another Scene's board: Scene.flags.<module>.wiredMapFor = boardSceneId.
// - Place on canvas: a Console node becomes a linked world Actor (Wired Nodes folder) + token on the viewed Scene, from the
//   summons/nodes track template. Actor flags.<module> = { kind: "node", boardSceneId, nodeId, track }.
// - The board is the source of truth: board changes sync name / Rating / Integrity / track / revealed onto placed tokens;
//   a GM changing a Track 2 node's Stamina writes Integrity back. Deleted nodes and reset boards remove their Actors.

const MODULE_ID = "draw-steel-ghostwire";
const PACK_ID = `${MODULE_ID}.summons`;
const L = "GHOSTWIRE.WiredConsole";
const SYNC = { ghostwireNodeSync: true };

let getBoardFn = null;

/** The Scene whose board the Console shows for a viewed Scene: its linked board Scene, else itself. */
export function boardScene(viewed = game.scenes.viewed) {
  const id = viewed?.getFlag(MODULE_ID, "wiredMapFor");
  return (id && (id !== viewed.id) && game.scenes.get(id)) || viewed || null;
}

const isNodeActor = actor => actor?.getFlag(MODULE_ID, "kind") === "node";

/** The placed Actor for a board node, or null. */
export function placedNodeActor(boardSceneId, nodeId) {
  return game.actors.find(actor => isNodeActor(actor)
    && (actor.getFlag(MODULE_ID, "boardSceneId") === boardSceneId) && (actor.getFlag(MODULE_ID, "nodeId") === nodeId)) ?? null;
}

function actorTokens(actor) {
  const tokens = [];
  for (const scene of game.scenes) tokens.push(...scene.tokens.filter(token => token.actorId === actor.id));
  return tokens;
}

async function templateFor(track) {
  const pack = game.packs.get(PACK_ID);
  const index = await pack.getIndex({ fields: [`flags.${MODULE_ID}.kind`, `flags.${MODULE_ID}.track`] });
  const entry = index.find(e => (foundry.utils.getProperty(e, `flags.${MODULE_ID}.kind`) === "node-template")
    && (foundry.utils.getProperty(e, `flags.${MODULE_ID}.track`) === track));
  return entry ? pack.getDocument(entry._id) : null;
}

async function nodeFolder() {
  return game.folders.find(f => (f.type === "Actor") && f.getFlag(MODULE_ID, "wiredNodes"))
    ?? Folder.create({ name: game.i18n.localize(`${L}.NodeFolder`), type: "Actor", flags: { [MODULE_ID]: { wiredNodes: true } } });
}

// Track 2 Stamina is Integrity; Track 1 has no pool (1 / 1, no bar).
const staminaFor = node => (node.track === 2) ? { value: node.integrity, max: node.integrityMax } : { value: 1, max: 1 };
const barFor = node => ((node.track === 2) ? "stamina" : null);

/** Elevation + Level for a new token on the viewed Scene (Foundry V14 Levels / theripper Levels). */
export function placementElevationAndLevel() {
  // theripper Levels: active layer bottom elevation
  const levelsBottom = Number(CONFIG.Levels?.UI?.rangeBottom);
  if (Number.isFinite(levelsBottom)) {
    return { elevation: levelsBottom, level: canvas.level?.id ?? null };
  }
  // Foundry V14 native: currently displayed Level
  const current = canvas.level ?? null;
  if (current) {
    const bottom = Number(current.elevation?.bottom);
    return {
      elevation: Number.isFinite(bottom) ? bottom : (Number(current.elevation) || 0),
      level: current.id,
    };
  }
  const controlled = Number(canvas.tokens?.controlled?.[0]?.document?.elevation);
  if (Number.isFinite(controlled)) return { elevation: controlled, level: null };
  return { elevation: 0, level: null };
}

/** Place a board node on the viewed Scene as a linked token. GM only. */
export async function placeNode(board, node) {
  const viewed = canvas.scene;
  if (!game.user.isGM || !board || !node) return;
  if (!viewed) return ui.notifications.warn(game.i18n.localize(`${L}.NoCanvasScene`));
  if (placedNodeActor(board.id, node.id)) return ui.notifications.warn(game.i18n.format(`${L}.AlreadyPlaced`, { name: node.name }));
  const template = await templateFor(node.track);
  if (!template) return ui.notifications.error(game.i18n.localize(`${L}.NoNodeTemplate`));

  const data = game.actors.fromCompendium(template);
  foundry.utils.mergeObject(data, {
    name: node.name, folder: (await nodeFolder())?.id ?? null, ownership: { default: 0 },
    "system.stamina": { ...staminaFor(node), temporary: 0 },
    "system.monster.level": node.rating,
    "prototypeToken.name": node.name,
    "prototypeToken.actorLink": true,
    "prototypeToken.bar1.attribute": barFor(node),
    [`flags.${MODULE_ID}`]: { kind: "node", boardSceneId: board.id, nodeId: node.id, track: node.track },
  });
  const actor = await Actor.create(data);
  if (!actor) return;

  // View centre, stepped right for each node token already on this Scene so placements don't stack.
  const grid = canvas.grid.size;
  const placed = viewed.tokens.filter(token => isNodeActor(token.actor)).length;
  const snap = value => Math.round(value / grid) * grid;
  const x = snap(canvas.stage.pivot.x - (grid / 2)) + (placed * grid);
  const y = snap(canvas.stage.pivot.y - (grid / 2));
  // Land on the Level the GM is viewing (Interior vs Roof). Scripted createEmbeddedDocuments
  // does not inherit canvas.level the way drag-drop does (B108).
  const { elevation, level } = placementElevationAndLevel();
  const tokenData = { x, y, elevation, actorLink: true, hidden: !node.revealed };
  if (level) tokenData.level = level;
  const tokenDocument = await actor.getTokenDocument(tokenData, { parent: viewed });
  await viewed.createEmbeddedDocuments("Token", [tokenDocument.toObject()]);
}

/** Remove a placed node: its tokens on every Scene and its Actor. The board node stays. */
export async function removePlacedNode(actor) {
  if (!game.user.isGM || !actor) return;
  for (const token of actorTokens(actor)) await token.delete();
  if (game.actors.has(actor.id)) await actor.delete({ ghostwireNodeCleanup: true });
}

/** Sync every placed node of a board Scene to its board: update what differs, remove Actors whose node is gone. */
export async function syncPlacedNodes(scene) {
  if (!game.user.isGM || !scene || !getBoardFn) return;
  const nodes = new Map(getBoardFn(scene).nodes.map(node => [node.id, node]));
  const actors = game.actors.filter(actor => isNodeActor(actor) && (actor.getFlag(MODULE_ID, "boardSceneId") === scene.id));
  for (const actor of actors) {
    const node = nodes.get(actor.getFlag(MODULE_ID, "nodeId"));
    if (!node) {
      await removePlacedNode(actor);
      continue;
    }
    const stamina = staminaFor(node);
    const actorChanges = {};
    if (actor.name !== node.name) Object.assign(actorChanges, { name: node.name, "prototypeToken.name": node.name });
    if (actor.system.monster.level !== node.rating) actorChanges["system.monster.level"] = node.rating;
    if ((actor.system.stamina.value !== stamina.value) || (actor.system.stamina.max !== stamina.max)) {
      actorChanges["system.stamina.value"] = stamina.value;
      actorChanges["system.stamina.max"] = stamina.max;
    }
    if (actor.getFlag(MODULE_ID, "track") !== node.track) {
      actorChanges[`flags.${MODULE_ID}.track`] = node.track;
      actorChanges["prototypeToken.bar1.attribute"] = barFor(node);
    }
    if (!foundry.utils.isEmpty(actorChanges)) await actor.update(actorChanges, SYNC);

    for (const token of actorTokens(actor)) {
      const tokenChanges = {};
      if (token.hidden === node.revealed) tokenChanges.hidden = !node.revealed;
      if (token.name !== node.name) tokenChanges.name = node.name;
      if ((token.bar1?.attribute ?? null) !== barFor(node)) tokenChanges["bar1.attribute"] = barFor(node);
      if (!foundry.utils.isEmpty(tokenChanges)) await token.update(tokenChanges, SYNC);
    }
  }
}

/** Write a Track 2 node token's Stamina back to its board node's Integrity. */
async function writeIntegrity(actor) {
  const scene = game.scenes.get(actor.getFlag(MODULE_ID, "boardSceneId"));
  if (!scene || !getBoardFn) return;
  const board = getBoardFn(scene);
  const node = board.nodes.find(n => n.id === actor.getFlag(MODULE_ID, "nodeId"));
  if (!node || (node.track !== 2)) return;
  const integrity = Math.min(node.integrityMax, Math.max(0, Math.floor(Number(actor.system.stamina.value) || 0)));
  if (integrity === node.integrity) return;
  node.integrity = integrity;
  await scene.setFlag(MODULE_ID, "wiredBoard", { nodes: board.nodes, stratum: board.stratum, updated: Date.now() });
}

/**
 * Register node token sync. Call during init.
 * @param {{ getBoard: (scene: Scene) => { nodes: object[], stratum: string } }} options
 */
export function registerNodeTokens({ getBoard }) {
  getBoardFn = getBoard;

  // Board changes (including node deletion and board reset) sync placed tokens. Runs on the writing GM's client.
  Hooks.on("updateScene", (scene, changes, options, userId) => {
    if ((userId !== game.user.id) || !foundry.utils.hasProperty(changes, `flags.${MODULE_ID}.wiredBoard`)) return;
    syncPlacedNodes(scene);
  });

  // A GM changing a node token's Stamina (damage button, sheet, bar) writes Integrity back to the board.
  Hooks.on("updateActor", (actor, changes, options, userId) => {
    if ((userId !== game.user.id) || options.ghostwireNodeSync || !isNodeActor(actor) || !game.user.isGM) return;
    if (!foundry.utils.hasProperty(changes, "system.stamina.value")) return;
    writeIntegrity(actor);
  });

  // Deleting a node Actor by hand removes its tokens; deleting its last token removes the Actor (the node stays on the board).
  Hooks.on("deleteActor", async (actor, options, userId) => {
    if ((userId !== game.user.id) || options.ghostwireNodeCleanup || !isNodeActor(actor)) return;
    for (const scene of game.scenes) {
      const ids = scene.tokens.filter(token => token.actorId === actor.id).map(token => token.id);
      if (ids.length) await scene.deleteEmbeddedDocuments("Token", ids);
    }
  });
  Hooks.on("deleteToken", async (token, options, userId) => {
    const actor = game.actors.get(token.actorId);
    if ((userId !== game.user.id) || !isNodeActor(actor)) return;
    if (!actorTokens(actor).length) await actor.delete({ ghostwireNodeCleanup: true });
  });
}
