// B117 player path: all nine Matrix Verbs on the Wired node the runner is facing.
// Connect / Jack Out / Toggle / Scan / Navigate / Ping / Broadcast / Search / Read-Write
// fire through the same useConsoleVerb path as the Director Console. Nothing on the sheet.

import { RATING } from "./wired-node-templates.mjs";
import { getBoard, useConsoleVerb, verbStripView } from "./wired-console.mjs";
import { consoleVerbGate, hintVerbDsid, pickPlayerVerbActor } from "./wired-console-verbs.mjs";
import { boardScene, isNodeActor, nodeRefFromToken, placedNodeActor } from "./wired-node-tokens.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const L = "GHOSTWIRE.WiredNode";
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

const ALERT_MAX = 12;
const alertBand = alert => (alert >= 12) ? "lockout" : (alert >= 9) ? "hunting" : (alert >= 5) ? "malice" : (alert >= 1) ? "stir" : "quiet";

let getWiredStateFn = null;

const loc = (key, data) => data
  ? game.i18n.format(`${L}.${key}`, data)
  : game.i18n.localize(`${L}.${key}`);

function playerVerbCandidates() {
  const rows = [];
  const seen = new Set();
  const add = actor => {
    if (!actor || seen.has(actor.uuid) || isNodeActor(actor)) return;
    if (!game.user.isGM && !actor.isOwner) return;
    seen.add(actor.uuid);
    const state = getWiredStateFn?.(actor) ?? "disconnected";
    rows.push({
      uuid: actor.uuid,
      name: actor.name,
      img: actor.img,
      state,
      stateLabel: game.i18n.localize(`GHOSTWIRE.Wired.States.${state}`),
      connected: state !== "disconnected",
      owned: game.user.isGM || actor.isOwner,
    });
  };
  for (const token of canvas?.tokens?.controlled ?? []) add(token.actor);
  add(game.user.character);
  for (const token of game.scenes.viewed?.tokens ?? []) add(token.actor);
  return rows;
}

function controlledUuid() {
  return canvas?.tokens?.controlled?.find(token => token.actor?.isOwner && !isNodeActor(token.actor))?.actor?.uuid ?? null;
}

export class WiredNodePanel extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "ghostwire-wired-node-panel",
    classes: ["ghostwire-wired-console", "ghostwire-wired-node-panel"],
    window: { title: "GHOSTWIRE.WiredNode.Title", icon: "fa-solid fa-circle-nodes", resizable: true },
    position: { width: 460, height: 620 },
    actions: {
      fireVerb: WiredNodePanel.#onFireVerb,
      openSheet: WiredNodePanel.#onOpenSheet,
    },
  };

  static PARTS = {
    panel: {
      template: `modules/${MODULE_ID}/templates/wired-node-panel.hbs`,
      scrollable: [".wn-body"],
    },
  };

  nodeId = null;
  boardSceneId = null;
  runnerUuid = null;

  setTarget({ nodeId = null, boardSceneId = null } = {}) {
    this.nodeId = nodeId;
    this.boardSceneId = boardSceneId;
    return this;
  }

  get board() {
    return game.scenes.get(this.boardSceneId) ?? boardScene(game.scenes.viewed);
  }

  get nodeActor() {
    const scene = this.board;
    return (scene && this.nodeId) ? placedNodeActor(scene.id, this.nodeId) : null;
  }

  /** @override */
  async _prepareContext() {
    const isGM = game.user.isGM;
    const scene = this.board;
    const node = getBoard(scene).nodes.find(n => n.id === this.nodeId) ?? null;
    if (!node || (!isGM && !node.revealed)) {
      return { missing: true, isGM, hint: loc(node ? "Hidden" : "Missing") };
    }

    const candidates = playerVerbCandidates();
    this.runnerUuid = pickPlayerVerbActor({
      candidates,
      controlledUuid: controlledUuid(),
      characterUuid: game.user.character?.uuid ?? null,
    });
    const runner = candidates.find(row => row.uuid === this.runnerUuid) ?? null;
    const verbCtx = {
      actorUuid: runner?.uuid,
      connected: !!runner?.connected,
      nodeId: node.id,
      owned: !!runner?.owned,
      revealed: !!node.revealed,
      isGM,
    };
    const gate = consoleVerbGate({ ...verbCtx, dsid: hintVerbDsid(verbCtx.connected) });
    const card = RATING[node.rating] ?? RATING[1];
    const actor = this.nodeActor;
    return {
      missing: false,
      isGM,
      sceneName: scene?.name ?? "",
      name: node.name,
      img: actor?.img ?? "",
      track: node.track,
      rating: node.rating,
      isTrack2: node.track === 2,
      integrity: node.integrity,
      integrityMax: node.integrityMax,
      integrityPct: Math.round((node.integrity / Math.max(1, node.integrityMax)) * 100),
      down: (node.track === 2) && (node.integrity <= 0),
      alert: node.alert,
      alertBand: alertBand(node.alert),
      alertSteps: Array.from({ length: ALERT_MAX }, (_, i) => ({ step: i + 1, lit: i < node.alert, band: alertBand(i + 1) })),
      alertLabel: game.i18n.localize(`GHOSTWIRE.WiredConsole.AlertBands.${alertBand(node.alert)}`),
      description: node.description ?? "",
      revealed: !!node.revealed,
      runner,
      verbs: verbStripView(verbCtx),
      verbHint: gate.reason
        ? (gate.reason === "Actor" ? loc("NeedActor") : game.i18n.localize(`GHOSTWIRE.WiredConsole.VerbNeed${gate.reason}`))
        : game.i18n.format("GHOSTWIRE.WiredConsole.VerbReady", { actor: runner.name, node: node.name }),
      hasSheet: isGM && !!actor,
      ice: (node.track === 2) ? card.ice : game.i18n.localize("GHOSTWIRE.WiredConsole.NoIce"),
      breachDC: card.breachDC,
    };
  }

  static async #onFireVerb(event, target) {
    const dsid = target.dataset.verb;
    const actor = this.runnerUuid ? await fromUuid(this.runnerUuid) : null;
    const scene = this.board;
    const node = getBoard(scene).nodes.find(n => n.id === this.nodeId) ?? null;
    await useConsoleVerb(actor, dsid, { node, scene, getWiredState: getWiredStateFn });
  }

  static async #onOpenSheet() {
    const actor = this.nodeActor;
    if (!game.user.isGM || !actor) return;
    return actor.sheet.render({ force: true, ghostwireAllowNodeSheet: true });
  }
}

const instance = () => foundry.applications.instances.get(WiredNodePanel.DEFAULT_OPTIONS.id);

const rerender = () => {
  const app = instance();
  if (app?.rendered) app.render();
};

/**
 * Open (or retarget) the player-facing node verb panel.
 * @param {{ actor?: Actor|null, nodeId?: string|null, boardSceneId?: string|null }} [ref]
 */
export function openWiredNodePanel({ actor = null, nodeId = null, boardSceneId = null } = {}) {
  const id = nodeId ?? actor?.getFlag(MODULE_ID, "nodeId") ?? null;
  const sceneId = boardSceneId ?? actor?.getFlag(MODULE_ID, "boardSceneId") ?? boardScene(game.scenes.viewed)?.id ?? null;
  const scene = game.scenes.get(sceneId) ?? boardScene(game.scenes.viewed);
  const node = id ? getBoard(scene).nodes.find(n => n.id === id) : null;
  if (!node) {
    ui.notifications.warn(loc("Missing"));
    return null;
  }
  if (!game.user.isGM && !node.revealed) {
    ui.notifications.warn(loc("Hidden"));
    return null;
  }
  let app = instance();
  if (!app) app = new WiredNodePanel();
  app.setTarget({ nodeId: node.id, boardSceneId: scene?.id ?? sceneId });
  return app.render({ force: true });
}

export function openWiredNodeFromToken(token) {
  const ref = nodeRefFromToken(token);
  if (!ref?.nodeId) return null;
  return openWiredNodePanel(ref);
}

function maybeRedirectNodeSheet(app) {
  const actor = app?.document ?? app?.actor;
  if (!isNodeActor(actor) || app.options?.ghostwireAllowNodeSheet) return;
  if (app instanceof WiredNodePanel || app._ghostwireNodeRedirect) return;
  app._ghostwireNodeRedirect = true;
  const nodeId = actor.getFlag(MODULE_ID, "nodeId");
  const boardSceneId = actor.getFlag(MODULE_ID, "boardSceneId");
  queueMicrotask(() => {
    app.close?.();
    openWiredNodePanel({ actor, nodeId, boardSceneId });
  });
}

function patchTokenDoubleClick() {
  const TokenClass = CONFIG.Token?.objectClass;
  if (!TokenClass?.prototype || TokenClass.prototype._ghostwireNodeClick) return;
  const original = TokenClass.prototype._onClickLeft2;
  TokenClass.prototype._ghostwireNodeClick = true;
  TokenClass.prototype._onClickLeft2 = function(event) {
    if (nodeRefFromToken(this)?.nodeId) {
      event?.stopPropagation?.();
      openWiredNodeFromToken(this);
      return;
    }
    return original?.call(this, event);
  };
}

function injectNodeHud(hud, html) {
  const token = hud.object;
  if (!nodeRefFromToken(token)?.nodeId) return;
  const root = html?.rootElement ?? html?.[0] ?? html;
  if (!root?.querySelector) return;
  const col = root.querySelector(".col.right") ?? root.querySelector(".right");
  if (!col || col.querySelector(".ghostwire-node-verbs")) return;
  const btn = document.createElement("div");
  btn.className = "control-icon ghostwire-node-verbs";
  btn.dataset.tooltip = loc("Hud");
  btn.innerHTML = `<i class="fa-solid fa-circle-nodes"></i>`;
  btn.addEventListener("click", event => {
    event.preventDefault();
    openWiredNodeFromToken(token);
  });
  col.appendChild(btn);
}

/**
 * Register the player-facing node verb panel. Call during init.
 * @param {{ getWiredState: (actor: Actor) => "disconnected"|"overlay"|"jackedIn" }} options
 */
export function registerWiredNodeVerbs({ getWiredState }) {
  getWiredStateFn = getWiredState;

  Hooks.once("ready", () => {
    patchTokenDoubleClick();
    const module = game.modules.get(MODULE_ID);
    if (module) module.api = { ...(module.api ?? {}), openWiredNodePanel };
  });

  Hooks.on("renderTokenHUD", injectNodeHud);
  Hooks.on("renderActorSheet", maybeRedirectNodeSheet);
  Hooks.on("renderActorSheetV2", maybeRedirectNodeSheet);
  Hooks.on("renderApplicationV2", app => {
    if (app?.document instanceof Actor) maybeRedirectNodeSheet(app);
  });

  Hooks.on("updateScene", (scene, changes) => {
    const app = instance();
    if (!app?.rendered) return;
    const viewed = game.scenes.viewed;
    if (((scene === viewed) || (scene === boardScene(viewed)) || (scene.id === app.boardSceneId))
      && foundry.utils.hasProperty(changes, `flags.${MODULE_ID}`)) rerender();
  });
  Hooks.on("createActiveEffect", rerender);
  Hooks.on("deleteActiveEffect", rerender);
  Hooks.on("updateActor", (actor, changes) => {
    if (foundry.utils.hasProperty(changes, `flags.${MODULE_ID}.wired`)) rerender();
    if (isNodeActor(actor)) rerender();
  });
  Hooks.on("controlToken", rerender);
  Hooks.on("canvasReady", rerender);
}
