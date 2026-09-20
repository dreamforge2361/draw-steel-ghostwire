// Wired node minimap (B41, docs/directors/wired-node-minimap.md): a player-facing topology view of the Matrix nodes they can see.
// - Reads the same board as the Wired Console: getBoard(boardScene(viewed Scene)). Players see revealed nodes only; a GM
//   opening it by hand sees every node, like the Console.
// - Opens by itself when an actor this user owns goes Overlay or Jacked In, and closes when they all disconnect.
//   Overlay: compact floating map, canvas stays readable. Jacked In: larger, centred map, and this client's canvas is dimmed
//   on top of the B23c Jacked In vision mode (body class, CSS only — nothing is written to documents).
// - Layout: nodes placed as tokens on the viewed Scene keep their relative canvas positions; unplaced nodes sit on a ring
//   (or along the bottom when some are placed).
// - Wires (B41b): the board's undirected node.links draw as SVG lines between visible endpoints only. Players see a wire when
//   both ends are revealed; the GM Director view also draws wires touching hidden nodes, dashed like the hidden node itself.

import { getBoard } from "./wired-console.mjs";
import { boardScene, placedNodeActor } from "./wired-node-tokens.mjs";
import { layoutNodes, shortNodeName, roomPrefix } from "./wired-layout.mjs";
import { openWiredNodePanel } from "./wired-node-verbs.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const L = "GHOSTWIRE.WiredMinimap";
const JACKED_IN_CLASS = "ghostwire-minimap-jacked-in";
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

const ALERT_MAX = 12;
const alertBand = alert => (alert >= 12) ? "lockout" : (alert >= 9) ? "hunting" : (alert >= 5) ? "malice" : (alert >= 1) ? "stir" : "quiet";
const SIZES = { overlay: { width: 320, height: 300 }, jackedIn: { width: 640, height: 560 } };

let getWiredStateFn = null;

/* ---------- viewer state ---------- */

/** Actors this user looks through: controlled tokens, their assigned character, and owned tokens on the viewed Scene. */
function viewerActors() {
  const actors = new Set();
  for (const token of canvas?.tokens?.controlled ?? []) if (token.actor?.isOwner) actors.add(token.actor);
  if (game.user.character) actors.add(game.user.character);
  for (const token of game.scenes.viewed?.tokens ?? []) if (token.actor?.isOwner) actors.add(token.actor);
  return actors;
}

/** The strongest Wired state among this user's actors: "jackedIn" beats "overlay" beats "disconnected". */
function viewerState() {
  if (game.user.isGM) return "disconnected";
  let state = "disconnected";
  for (const actor of viewerActors()) {
    const s = getWiredStateFn?.(actor) ?? "disconnected";
    if (s === "jackedIn") return s;
    if (s === "overlay") state = s;
  }
  return state;
}

const enabled = () => game.settings.get(MODULE_ID, "wiredMinimapEnabled");

/* ---------- layout ---------- */

/** The token for a placed node on the viewed Scene, or null. */
function nodeToken(board, node) {
  const actor = board && placedNodeActor(board.id, node.id);
  return actor ? (game.scenes.viewed?.tokens.find(token => token.actorId === actor.id) ?? null) : null;
}

/** Canvas centres for placed tokens, fed into layoutNodes. */
function tokenCentres(nodes, tokens) {
  const centres = new Map();
  const size = game.scenes.viewed?.grid.size ?? 100;
  for (const node of nodes) {
    const token = tokens.get(node.id);
    if (!token) continue;
    centres.set(node.id, { x: token.x + ((token.width * size) / 2), y: token.y + ((token.height * size) / 2) });
  }
  return centres;
}

/** Unique undirected wires between the given (visible) nodes, in percent coordinates. */
function edges(nodes, positions) {
  const visible = new Map(nodes.map(node => [node.id, node]));
  const wires = [];
  for (const node of nodes) {
    for (const id of node.links) {
      const other = visible.get(id);
      // Each pair once: the endpoint with the smaller id draws it.
      if (!other || (node.id > id)) continue;
      const a = positions.get(node.id);
      const b = positions.get(id);
      wires.push({
        x1: a.x.toFixed(2), y1: a.y.toFixed(2), x2: b.x.toFixed(2), y2: b.y.toFixed(2),
        hidden: !node.revealed || !other.revealed,
      });
    }
  }
  return wires;
}

/* ---------- application ---------- */

export class WiredMinimap extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "ghostwire-wired-minimap",
    classes: ["ghostwire-wired-console", "ghostwire-wired-minimap"],
    window: { title: "GHOSTWIRE.WiredMinimap.Title", icon: "fa-solid fa-diagram-project", resizable: true, minimizable: true },
    position: { ...SIZES.overlay },
    actions: {
      focusNode: WiredMinimap.#onFocusNode,
      resetView: WiredMinimap.#onResetView,
    },
  };

  static PARTS = {
    map: { template: `modules/${MODULE_ID}/templates/wired-minimap.hbs` },
  };

  /** "overlay" | "jackedIn" | "director" (a GM opened it by hand). */
  mode = "overlay";

  /** Pan/zoom of the node field (percent-space transform). Survives live re-renders. */
  view = { scale: 1, x: 0, y: 0 };

  /** @override */
  async _prepareContext(options) {
    const isGM = game.user.isGM;
    const scene = boardScene(game.scenes.viewed);
    const board = getBoard(scene);
    const nodes = board.nodes.filter(node => isGM || node.revealed);
    const tokens = new Map(nodes.map(node => [node.id, nodeToken(scene, node)]));
    const { positions, dense, mode: layoutMode } = layoutNodes(nodes, tokenCentres(nodes, tokens));
    const showRatings = game.settings.get(MODULE_ID, "wiredMinimapRatings");
    const localize = key => game.i18n.localize(`${L}.${key}`);
    const esc = foundry.utils.escapeHTML;

    return {
      mode: this.mode,
      layoutMode,
      dense,
      modeLabel: (this.mode === "director") ? localize("Director") : game.i18n.localize(`GHOSTWIRE.Wired.States.${this.mode}`),
      sceneName: scene?.name ?? game.i18n.localize("GHOSTWIRE.WiredConsole.NoScene"),
      panHint: localize("PanHint"),
      showRatings,
      viewportTransform: viewStyle(this.view),
      edges: edges(nodes, positions),
      nodes: nodes.map(node => {
        const band = alertBand(node.alert);
        const { x, y } = positions.get(node.id);
        const token = tokens.get(node.id);
        const integrity = (node.track === 2) ? `${node.integrity} / ${node.integrityMax}` : game.i18n.localize("GHOSTWIRE.WiredConsole.NoIce");
        const room = roomPrefix(node.name);
        const tooltip = `
          <div class="gw-minimap-tip">
            <strong>${esc(node.name)}</strong>
            ${room ? `<div>${esc(localize("Room"))}: ${esc(room)}</div>` : ""}
            <div>${esc(game.i18n.localize(`GHOSTWIRE.WiredConsole.Track${node.track}`))} · R${node.rating}</div>
            <div>${esc(game.i18n.localize("GHOSTWIRE.WiredConsole.Integrity"))}: ${esc(integrity)}</div>
            <div>${esc(game.i18n.localize("GHOSTWIRE.WiredConsole.TraceAlert"))}: ${node.alert} / ${ALERT_MAX} — ${esc(game.i18n.localize(`GHOSTWIRE.WiredConsole.AlertBands.${band}`))}</div>
            ${(isGM && !node.revealed) ? `<div><em>${esc(localize("Hidden"))}</em></div>` : ""}
            ${token ? `<div class="gw-minimap-tip-hint">${esc(localize("FocusHint"))}</div>` : ""}
          </div>`;
        return {
          id: node.id,
          name: node.name,
          shortName: shortNodeName(node.name, { dense }),
          rating: node.rating,
          track: node.track,
          band,
          placed: !!token,
          hidden: !node.revealed,
          down: (node.track === 2) && (node.integrity <= 0),
          integrityPct: (node.track === 2) ? Math.round((node.integrity / node.integrityMax) * 100) : 100,
          style: `left: ${x.toFixed(2)}%; top: ${y.toFixed(2)}%;`,
          tooltip,
        };
      }),
    };
  }

  /** Size and dim the canvas for the viewer's mode. */
  applyMode(mode) {
    const changed = mode !== this.mode;
    this.mode = mode;
    document.body.classList.toggle(JACKED_IN_CLASS, (mode === "jackedIn") && game.settings.get(MODULE_ID, "wiredMinimapDim"));
    this.element?.classList.toggle("mode-jackedIn", mode === "jackedIn");
    if (!changed || !this.rendered) return;
    this.setPosition(defaultPosition(mode));
  }

  /** @override */
  _onRender(context, options) {
    super._onRender(context, options);
    this.element.classList.toggle("mode-jackedIn", this.mode === "jackedIn");
    this.element.classList.toggle("is-dense", !!context.dense);
    this.#bindPanZoom();
  }

  #bindPanZoom() {
    const field = this.element.querySelector(".wm-field");
    if (!field || field.dataset.gwPanBound) return;
    field.dataset.gwPanBound = "1";
    field.addEventListener("wheel", event => {
      event.preventDefault();
      const delta = event.deltaY < 0 ? 1.12 : (1 / 1.12);
      const next = Math.min(3, Math.max(0.6, this.view.scale * delta));
      const rect = field.getBoundingClientRect();
      const cx = ((event.clientX - rect.left) / rect.width) * 100;
      const cy = ((event.clientY - rect.top) / rect.height) * 100;
      const k = next / this.view.scale;
      this.view.x = cx - ((cx - this.view.x) * k);
      this.view.y = cy - ((cy - this.view.y) * k);
      this.view.scale = next;
      this.#applyView();
    }, { passive: false });

    let drag = null;
    field.addEventListener("pointerdown", event => {
      if (event.button !== 0) return;
      if (event.target.closest(".wm-node")) return;
      drag = { x: event.clientX, y: event.clientY, ox: this.view.x, oy: this.view.y };
      field.setPointerCapture(event.pointerId);
    });
    field.addEventListener("pointermove", event => {
      if (!drag) return;
      const rect = field.getBoundingClientRect();
      this.view.x = drag.ox + (((event.clientX - drag.x) / rect.width) * 100);
      this.view.y = drag.oy + (((event.clientY - drag.y) / rect.height) * 100);
      this.#applyView();
    });
    field.addEventListener("pointerup", () => { drag = null; });
    field.addEventListener("pointercancel", () => { drag = null; });
    field.addEventListener("dblclick", event => {
      if (event.target.closest(".wm-node")) return;
      this.view = { scale: 1, x: 0, y: 0 };
      this.#applyView();
    });
  }

  #applyView() {
    const viewport = this.element.querySelector(".wm-viewport");
    if (viewport) viewport.style.transform = viewStyle(this.view);
  }

  static #onResetView() {
    this.view = { scale: 1, x: 0, y: 0 };
    this.#applyView();
  }

  /** @override */
  _onClose(options) {
    super._onClose(options);
    document.body.classList.remove(JACKED_IN_CLASS);
    // Closed by hand while still connected: stay closed until the connection state changes.
    if (!options.ghostwireAuto && (viewerState() !== "disconnected")) dismissedState = viewerState();
  }

  // Pan the canvas to a placed node's token, then open the node-facing verb panel.
  static async #onFocusNode(event, target) {
    const scene = boardScene(game.scenes.viewed);
    const node = getBoard(scene).nodes.find(n => n.id === target.dataset.nodeId);
    const token = node && nodeToken(scene, node)?.object;
    if (token && canvas.ready && (!token.document.hidden || game.user.isGM)) {
      await canvas.animatePan({ x: token.center.x, y: token.center.y });
      if (game.user.isGM) token.control({ releaseOthers: true });
    }
    if (node) openWiredNodePanel({ nodeId: node.id, boardSceneId: scene?.id ?? null });
  }
}

/** CSS transform for the pan/zoom viewport (percent-space). */
function viewStyle(view) {
  const scale = Number(view?.scale) || 1;
  const x = Number(view?.x) || 0;
  const y = Number(view?.y) || 0;
  return `translate(${x.toFixed(2)}%, ${y.toFixed(2)}%) scale(${scale})`;
}

/** Overlay: compact, bottom-right above the hotbar. Jacked In: large and centred. Both scaled by the size setting. */
function defaultPosition(mode) {
  const scale = Number(game.settings.get(MODULE_ID, "wiredMinimapScale")) || 1;
  const size = SIZES[mode === "jackedIn" ? "jackedIn" : "overlay"];
  const width = Math.round(size.width * scale);
  const height = Math.round(size.height * scale);
  if (mode === "jackedIn") return { width, height, left: Math.round((window.innerWidth - width) / 2), top: Math.round((window.innerHeight - height) / 2) };
  const sidebar = document.getElementById("sidebar")?.offsetWidth ?? 300;
  return { width, height, left: Math.max(0, window.innerWidth - sidebar - width - 16), top: Math.max(0, window.innerHeight - height - 110) };
}

/* ---------- open / close ---------- */

let dismissedState = null;
let lastState = "disconnected";

const instance = () => foundry.applications.instances.get(WiredMinimap.DEFAULT_OPTIONS.id);

/** Open the minimap (or bring it to front). A GM gets the Director view with every node. */
export function openWiredMinimap(mode = null) {
  const resolved = mode ?? (game.user.isGM ? "director" : viewerState());
  const state = (resolved === "disconnected") ? "overlay" : resolved;
  let app = instance();
  if (!app) {
    app = new WiredMinimap({ position: defaultPosition(state) });
    app.mode = state;
  }
  app.applyMode(state);
  return app.render({ force: true });
}

function toggleWiredMinimap() {
  const app = instance();
  if (app?.rendered) return app.close();
  dismissedState = null;
  return openWiredMinimap();
}

/** Re-read this user's connection state: open, resize, or close the minimap to match. */
function evaluate() {
  if (game.user.isGM || !game.ready) return;
  const state = enabled() ? viewerState() : "disconnected";
  const app = instance();
  if (state !== lastState) dismissedState = null;
  lastState = state;
  if (state === "disconnected") {
    if (app?.rendered && (app.mode !== "director")) app.close({ ghostwireAuto: true });
    return;
  }
  if (dismissedState === state) return;
  if (!app?.rendered) openWiredMinimap(state);
  else if (app.mode !== state) {
    app.applyMode(state);
    app.render();
  }
}

const rerender = () => {
  const app = instance();
  if (app?.rendered) app.render();
};

/* ---------- registration ---------- */

function registerSettings() {
  game.settings.register(MODULE_ID, "wiredMinimapEnabled", {
    name: `${L}.Settings.Enabled.Name`, hint: `${L}.Settings.Enabled.Hint`,
    scope: "world", config: true, type: Boolean, default: true,
    onChange: () => evaluate(),
  });
  game.settings.register(MODULE_ID, "wiredMinimapScale", {
    name: `${L}.Settings.Scale.Name`, hint: `${L}.Settings.Scale.Hint`,
    scope: "client", config: true, type: Number, default: 1,
    range: { min: 0.6, max: 1.6, step: 0.1 },
    onChange: () => {
      const app = instance();
      if (app?.rendered) app.setPosition(defaultPosition(app.mode));
    },
  });
  game.settings.register(MODULE_ID, "wiredMinimapRatings", {
    name: `${L}.Settings.Ratings.Name`, hint: `${L}.Settings.Ratings.Hint`,
    scope: "client", config: true, type: Boolean, default: true,
    onChange: rerender,
  });
  game.settings.register(MODULE_ID, "wiredMinimapDim", {
    name: `${L}.Settings.Dim.Name`, hint: `${L}.Settings.Dim.Hint`,
    scope: "client", config: true, type: Boolean, default: true,
    onChange: () => instance()?.applyMode(instance().mode),
  });
}

/**
 * Register the Wired node minimap: settings, scene control button, keybinding, auto-open and live-refresh hooks.
 * Call during init.
 * @param {{ getWiredState: (actor: Actor) => "disconnected"|"linked"|"overlay"|"jackedIn" }} options
 */
export function registerWiredMinimap({ getWiredState }) {
  getWiredStateFn = getWiredState;
  registerSettings();

  game.keybindings.register(MODULE_ID, "wiredMinimap", {
    name: `${L}.Keybinding`,
    editable: [],
    onDown: () => {
      toggleWiredMinimap();
      return true;
    },
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
  });

  Hooks.on("getSceneControlButtons", controls => {
    const tools = controls.tokens?.tools;
    if (!tools) return;
    tools.ghostwireWiredMinimap = {
      name: "ghostwireWiredMinimap",
      title: `${L}.Title`,
      icon: "fa-solid fa-diagram-project",
      order: Object.keys(tools).length,
      button: true,
      visible: game.user.isGM || game.settings.get(MODULE_ID, "wiredMinimapEnabled"),
      onChange: () => toggleWiredMinimap(),
    };
  });

  // Connection changes: Wired statuses on any owned actor, the mirrored flag, token control, and Scene switches.
  const onEffect = effect => {
    if ((effect.parent instanceof Actor) && effect.parent.isOwner) evaluate();
  };
  Hooks.on("createActiveEffect", onEffect);
  Hooks.on("deleteActiveEffect", onEffect);
  Hooks.on("updateActiveEffect", onEffect);
  Hooks.on("updateActor", (actor, changes) => {
    if (foundry.utils.hasProperty(changes, `flags.${MODULE_ID}.wired`)) evaluate();
    if (actor.getFlag(MODULE_ID, "kind") === "node") rerender();
  });
  Hooks.on("updateUser", (user, changes) => {
    if ((user === game.user) && ("character" in changes)) evaluate();
  });
  Hooks.on("controlToken", () => evaluate());
  Hooks.on("canvasReady", () => {
    evaluate();
    rerender();
  });
  Hooks.once("ready", () => evaluate());

  // Board changes (add / reveal / edit / delete nodes) on the viewed Scene or the board it maps.
  Hooks.on("updateScene", (scene, changes) => {
    const viewed = game.scenes.viewed;
    if (((scene === viewed) || (scene === boardScene(viewed))) && foundry.utils.hasProperty(changes, `flags.${MODULE_ID}`)) rerender();
  });
  // Node tokens placed, moved, revealed, or removed on the viewed Scene; owned tokens arriving can connect this user.
  const onToken = token => {
    if (token.parent !== game.scenes.viewed) return;
    evaluate();
    rerender();
  };
  Hooks.on("createToken", onToken);
  Hooks.on("deleteToken", onToken);
  Hooks.on("updateToken", (token, changes) => {
    if ((token.parent === game.scenes.viewed) && ["x", "y", "hidden", "name"].some(key => key in changes)) rerender();
  });
  Hooks.on("createActor", actor => { if (actor.getFlag(MODULE_ID, "kind") === "node") rerender(); });
  Hooks.on("deleteActor", actor => { if (actor.getFlag(MODULE_ID, "kind") === "node") rerender(); });

  Hooks.once("ready", () => {
    const module = game.modules.get(MODULE_ID);
    if (module) module.api = { ...(module.api ?? {}), openWiredMinimap, layoutNodes };
  });
}
