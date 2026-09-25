// B117 player path: all nine Matrix Verbs on the Wired node the runner is facing.
// Connect / Jack Out / Toggle / Scan / Navigate / Ping / Broadcast / Search / Read-Write
// fire through the same useConsoleVerb path as the Director Console. Nothing on the sheet.

import { RATING } from "./wired-node-templates.mjs";
import { getBoard, useConsoleVerb, verbStripView } from "./wired-console.mjs";
import { actorHasConnectInterface, consoleVerbGate, hintVerbDsid, pickPlayerVerbActor } from "./wired-console-verbs.mjs";
import { boardScene, isNodeActor, nodeRefFromToken, placedNodeActor } from "./wired-node-tokens.mjs";
import {
  ALERT_ANNOUNCE_STEPS, alertAnnounceKey, checklistView, currentMalice, exposedToBite,
  huntBiteFires, maliceIceSurge, toggleChecklistStep,
} from "./wired-ice.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const L = "GHOSTWIRE.WiredNode";
const ICE_L = "GHOSTWIRE.WiredIce";
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

const ALERT_MAX = 12;
const alertBand = alert => (alert >= 12) ? "lockout" : (alert >= 9) ? "hunting" : (alert >= 5) ? "malice" : (alert >= 1) ? "stir" : "quiet";

/** Per-user, per-node ticks on the Wire run checklist. Guidance state, so it never leaves this client. */
const CHECKLIST_SETTING = "wireRunChecklist";
const checklistKey = (sceneId, nodeId) => `${sceneId ?? "-"}~${nodeId ?? "-"}`;

function checklistStore() {
  const stored = game.settings.get(MODULE_ID, CHECKLIST_SETTING);
  return (stored && (typeof stored === "object")) ? foundry.utils.deepClone(stored) : {};
}

function checklistDone(sceneId, nodeId) {
  const row = checklistStore()[checklistKey(sceneId, nodeId)];
  return Array.isArray(row?.done) ? row.done : [];
}

async function setChecklistDone(sceneId, nodeId, done) {
  const store = checklistStore();
  const key = checklistKey(sceneId, nodeId);
  store[key] = { ...(store[key] ?? {}), done };
  return game.settings.set(MODULE_ID, CHECKLIST_SETTING, store);
}

/** Collapsed / expanded is one flag for the whole applet, not one per node. */
function checklistOpen() {
  return checklistStore().open === true;
}

async function setChecklistOpen(open) {
  return game.settings.set(MODULE_ID, CHECKLIST_SETTING, { ...checklistStore(), open: !!open });
}

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
      hasInterface: actorHasConnectInterface(actor),
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
      maliceSurge: WiredNodePanel.#onMaliceSurge,
      toggleChecklist: WiredNodePanel.#onToggleChecklist,
      checkStep: WiredNodePanel.#onCheckStep,
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
      state: runner?.state ?? "disconnected",
      nodeId: node.id,
      owned: !!runner?.owned,
      revealed: !!node.revealed,
      isGM,
      hasInterface: !!runner?.hasInterface,
      track: node.track,
    };
    const gate = consoleVerbGate({ ...verbCtx, dsid: hintVerbDsid(verbCtx.state) });
    const card = RATING[node.rating] ?? RATING[1];
    const actor = this.nodeActor;
    const malice = isGM ? currentMalice() : null;
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
      // 0.3.143 — the strip now shows *where the three announced steps are*, not just how far the
      // track has climbed. 5 banks Malice, 9 wakes the hunt, 12 is lockout and counter-trace.
      alertSteps: Array.from({ length: ALERT_MAX }, (_, i) => ({
        step: i + 1,
        lit: i < node.alert,
        band: alertBand(i + 1),
        mark: ALERT_ANNOUNCE_STEPS.includes(i + 1),
      })),
      alertLabel: game.i18n.localize(`GHOSTWIRE.WiredConsole.AlertBands.${alertBand(node.alert)}`),
      alertMarks: ALERT_ANNOUNCE_STEPS.map(step => ({
        step,
        reached: node.alert >= step,
        label: game.i18n.format(`${ICE_L}.Strip.${alertAnnounceKey(step)}`, { step }),
      })),
      // The hunt bite is the one Alert band that costs Stamina, so the applet says so out loud while
      // the runner is standing in it. It still never applies anything on its own.
      hunting: huntBiteFires({ alert: node.alert, state: verbCtx.state }),
      huntNotice: game.i18n.format(`${ICE_L}.Strip.HuntNotice`, {
        actor: runner?.name ?? "", node: node.name, alert: node.alert,
      }),
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
      // Trigger 4. Director-only, and only where a host actually has ICE to surge with.
      canSurge: isGM && (node.track === 2),
      surgeLabel: game.i18n.localize(`${ICE_L}.Surge.Button`),
      surgeTooltip: (malice === null)
        ? game.i18n.localize(`${ICE_L}.Surge.Tooltip`)
        : game.i18n.format(`${ICE_L}.Surge.TooltipMalice`, { malice }),
      // The Wire run checklist: read-only cues plus a tick box, following the North Substation spine.
      checklistOpen: checklistOpen(),
      checklistTitle: game.i18n.localize(`${ICE_L}.Checklist.Title`),
      checklistHint: game.i18n.localize(`${ICE_L}.Checklist.Hint`),
      checklist: checklistView(checklistDone(scene?.id, node.id)).map(step => ({
        ...step,
        labelText: game.i18n.localize(step.label),
        hintText: game.i18n.localize(step.hint),
      })),
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

  /**
   * Trigger 4 — the Director spends Malice to have this host's ICE strike now.
   *
   * Two steps on purpose: pick the target (defaulting to the compiler, which is what host ICE bites),
   * then the same confirm card every other trigger raises, with the same Apply and the same Cancel.
   */
  static async #onMaliceSurge() {
    if (!game.user.isGM) return;
    const scene = this.board;
    const node = getBoard(scene).nodes.find(n => n.id === this.nodeId) ?? null;
    if (!node) return;
    const actor = await pickSurgeTarget(this.runnerUuid);
    if (!actor) return;
    return maliceIceSurge({ actor, node });
  }

  static async #onToggleChecklist() {
    await setChecklistOpen(!checklistOpen());
    return this.render();
  }

  static async #onCheckStep(event, target) {
    const scene = this.board;
    const done = toggleChecklistStep(checklistDone(scene?.id, this.nodeId), target.dataset.step);
    await setChecklistDone(scene?.id, this.nodeId, done);
    return this.render();
  }
}

/**
 * The Malice surge target picker.
 *
 * The default is the compiler — the runner the applet already has selected — because that is who
 * host ICE bites. Everyone else on the scene who is Overlay or Jacked In is offered too, since a
 * Director surging at the *other* decker in the room is a legitimate call. Linked and Disconnected
 * are not on the list at all: they take nothing, and offering them a card would be offering a 0.
 */
async function pickSurgeTarget(defaultUuid) {
  const rows = playerVerbCandidates().filter(row => exposedToBite(row.state));
  if (!rows.length) {
    ui.notifications.warn(game.i18n.localize(`${ICE_L}.Surge.NoExposed`));
    return null;
  }
  if (rows.length === 1) return fromUuid(rows[0].uuid);

  const selected = rows.some(row => row.uuid === defaultUuid) ? defaultUuid : rows[0].uuid;
  const esc = value => foundry.utils.escapeHTML(String(value ?? ""));
  const options = rows
    .map(row => `<option value="${esc(row.uuid)}"${row.uuid === selected ? " selected" : ""}>${esc(`${row.name} — ${row.stateLabel}`)}</option>`)
    .join("");
  const uuid = await foundry.applications.api.DialogV2.prompt({
    window: { title: game.i18n.localize(`${ICE_L}.Surge.PickTitle`), icon: "fa-solid fa-skull" },
    content: `
      <p class="hint">${esc(game.i18n.localize(`${ICE_L}.Surge.PickHint`))}</p>
      <div class="form-group">
        <label>${esc(game.i18n.localize(`${ICE_L}.Surge.PickLabel`))}</label>
        <select name="target">${options}</select>
      </div>`,
    ok: {
      label: game.i18n.localize(`${ICE_L}.Surge.PickSubmit`),
      icon: "fa-solid fa-skull",
      callback: (event, button) => button.form.elements.target.value,
    },
    rejectClose: false,
  });
  return uuid ? fromUuid(uuid) : null;
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
 * @param {{ getWiredState: (actor: Actor) => "disconnected"|"linked"|"overlay"|"jackedIn" }} options
 */
export function registerWiredNodeVerbs({ getWiredState }) {
  getWiredStateFn = getWiredState;

  // 0.3.143 — the Wire run checklist is guidance, and one player ticking "Toggle Overlay" is not a
  // fact about the world. Client scope keeps it out of the Scene, off the Director's board, and out
  // of every other runner's applet, and means a player with no world-write rights can still tick it.
  game.settings.register(MODULE_ID, CHECKLIST_SETTING, {
    name: `${ICE_L}.Checklist.Title`,
    scope: "client",
    config: false,
    type: Object,
    default: {},
  });

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
