// Wired Console (B23b): a Scene-tied view of the Wired — connection roster, nodes, Integrity, and Trace Alert.
// Board data lives on a Scene: flags.draw-steel-ghostwire.wiredBoard = { nodes: [...], stratum, updated }. A matrix map can show another
// Scene's board (flags.draw-steel-ghostwire.wiredMapFor); nodes can be placed on the canvas as tokens (scripts/wired-node-tokens.mjs).
// Random nodes (B23c) roll from scripts/wired-node-table.mjs; Director templates and the System Stat Card (RATING) come from
// scripts/wired-node-templates.mjs (B32 Phase 5).
// Rules: docs/rulebook/08-hacker.md (System Stat Card, Trace Alert). Foundry notes: docs/rulebook/18-wired-foundry.md.

import { rollNode, STRATA } from "./wired-node-table.mjs";
import { RATING, NODE_TEMPLATES } from "./wired-node-templates.mjs";
import { boardScene, placedNodeActor, placeNode, removePlacedNode, registerNodeTokens } from "./wired-node-tokens.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

const ALERT_MAX = 12;
const ALERT_RESET = 6;
const CLUSTER_MAX = 12;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const alertBand = alert => (alert >= 12) ? "lockout" : (alert >= 9) ? "hunting" : (alert >= 5) ? "malice" : (alert >= 1) ? "stir" : "quiet";

/** Read the board from a Scene, filling in defaults so older or partial data renders. */
export function getBoard(scene) {
  const board = scene?.getFlag(MODULE_ID, "wiredBoard") ?? {};
  const nodes = (board.nodes ?? []).map(node => {
    const rating = clamp(Number(node.rating) || 1, 1, 5);
    const integrityMax = Number(node.integrityMax) || RATING[rating].integrity;
    return {
      id: node.id ?? foundry.utils.randomID(),
      name: node.name ?? "",
      track: (Number(node.track) === 1) ? 1 : 2,
      rating,
      integrityMax,
      integrity: clamp(Number(node.integrity ?? integrityMax), 0, integrityMax),
      alert: clamp(Number(node.alert) || 0, 0, ALERT_MAX),
      revealed: !!node.revealed,
      description: node.description ?? "",
      notes: node.notes ?? "",
      links: Array.isArray(node.links) ? node.links.filter(id => typeof id === "string") : [],
    };
  });
  // Links are undirected (B41b): drop self-links and ids not on this board, and mirror one-sided links so both ends list each other.
  const byId = new Map(nodes.map(node => [node.id, node]));
  for (const node of nodes) node.links = [...new Set(node.links)].filter(id => (id !== node.id) && byId.has(id));
  for (const node of nodes) for (const id of node.links) {
    const other = byId.get(id);
    if (!other.links.includes(node.id)) other.links.push(node.id);
  }
  // Stratum is the scene's default for random nodes; "random" rolls a stratum per node.
  const stratum = STRATA[board.stratum] ? board.stratum : "random";
  return { nodes, stratum, updated: board.updated ?? 0 };
}

/** Link or unlink two board nodes, keeping the graph symmetric (each end lists the other). Mutates `nodes`. */
export function setLink(nodes, a, b, linked) {
  const nodeA = nodes.find(n => n.id === a);
  const nodeB = nodes.find(n => n.id === b);
  if (!nodeA || !nodeB || (a === b)) return;
  for (const [node, other] of [[nodeA, b], [nodeB, a]]) {
    node.links = (node.links ?? []).filter(id => id !== other);
    if (linked) node.links.push(other);
  }
}

export class WiredConsole extends HandlebarsApplicationMixin(ApplicationV2) {
  /** @param {{ getWiredState: (actor: Actor) => "disconnected"|"overlay"|"jackedIn" }} options */
  constructor(options = {}) {
    super(options);
    this.getWiredState = options.getWiredState;
  }

  static DEFAULT_OPTIONS = {
    id: "ghostwire-wired-console",
    classes: ["ghostwire-wired-console"],
    window: { title: "GHOSTWIRE.WiredConsole.Title", icon: "fa-solid fa-network-wired", resizable: true },
    position: { width: 860, height: 640 },
    actions: {
      selectNode: WiredConsole.#onSelectNode,
      addNode: WiredConsole.#onAddNode,
      randomNode: WiredConsole.#onRandomNode,
      addTemplate: WiredConsole.#onAddTemplate,
      placeNode: WiredConsole.#onPlaceNode,
      removeNode: WiredConsole.#onRemoveNode,
      generateCluster: WiredConsole.#onGenerateCluster,
      deleteNode: WiredConsole.#onDeleteNode,
      alertUp: WiredConsole.#onAlertUp,
      alertDown: WiredConsole.#onAlertDown,
      alertMax: WiredConsole.#onAlertMax,
      alertReset: WiredConsole.#onAlertReset,
      damageIntegrity: WiredConsole.#onDamageIntegrity,
      restoreIntegrity: WiredConsole.#onRestoreIntegrity,
      toggleReveal: WiredConsole.#onToggleReveal,
      resetBoard: WiredConsole.#onResetBoard,
    },
  };

  static PARTS = {
    console: {
      template: `modules/${MODULE_ID}/templates/wired-console.hbs`,
      scrollable: [".wc-roster-list", ".wc-node-list", ".wc-detail"],
    },
  };

  /** The node selected in the detail panel. */
  selectedId = null;

  /** The Scene whose board is shown: the viewed Scene, or the board Scene it is the Wired map for. */
  get scene() {
    return boardScene(game.scenes.viewed);
  }

  /** The Scene on the canvas (roster, token placement). */
  get viewedScene() {
    return game.scenes.viewed ?? null;
  }

  /** @override */
  async _prepareContext(options) {
    const isGM = game.user.isGM;
    const scene = this.scene;
    const board = getBoard(scene);
    const nodes = board.nodes.filter(node => isGM || node.revealed);
    if (!nodes.some(node => node.id === this.selectedId)) this.selectedId = nodes[0]?.id ?? null;

    const localize = key => game.i18n.localize(`GHOSTWIRE.WiredConsole.${key}`);
    const decorate = node => {
      const card = RATING[node.rating];
      return {
        ...node,
        selected: node.id === this.selectedId,
        isTrack2: node.track === 2,
        placed: !!(scene && placedNodeActor(scene.id, node.id)),
        integrityPct: Math.round((node.integrity / node.integrityMax) * 100),
        down: (node.track === 2) && (node.integrity <= 0),
        alertBand: alertBand(node.alert),
        alertSteps: Array.from({ length: ALERT_MAX }, (_, i) => ({ step: i + 1, lit: i < node.alert, band: alertBand(i + 1) })),
        alertLabel: localize(`AlertBands.${alertBand(node.alert)}`),
        lockout: node.alert >= ALERT_MAX,
        breachDC: card.breachDC,
        ice: (node.track === 2) ? card.ice : localize("NoIce"),
        biofeedback: (node.track === 2) ? card.biofeedback : null,
        biofeedbackOverlay: Math.max(1, Math.floor(card.biofeedback * 0.5)),
        biofeedbackJackedIn: Math.ceil(card.biofeedback * 1.5),
        // Core Handlebars has no "selected" helper, so options carry their own selected state.
        trackOptions: [1, 2].map(track => ({ value: track, label: localize(`Track${track}`), isSelected: node.track === track })),
        ratingOptions: [1, 2, 3, 4, 5].map(rating => ({ value: rating, label: `R${rating}`, isSelected: node.rating === rating })),
        // Links (B41b): every other node on the board as a checkbox; the Director sees them all, hidden ones marked.
        linkOptions: board.nodes.filter(other => other.id !== node.id)
          .map(other => ({ id: other.id, name: other.name, rating: other.rating, hidden: !other.revealed, linked: node.links.includes(other.id) })),
      };
    };

    // Roster: one row per actor with a token on the scene. Players only see actors they own.
    const roster = [];
    const seen = new Set();
    for (const token of this.viewedScene?.tokens ?? []) {
      const actor = token.actor;
      if (!actor || seen.has(actor.uuid) || (!isGM && !actor.isOwner)) continue;
      seen.add(actor.uuid);
      const state = this.getWiredState?.(actor) ?? "disconnected";
      roster.push({ name: token.name || actor.name, img: token.texture?.src || actor.img, state, stateLabel: game.i18n.localize(`GHOSTWIRE.Wired.States.${state}`) });
    }
    const order = { jackedIn: 0, overlay: 1, disconnected: 2 };
    roster.sort((a, b) => (order[a.state] - order[b.state]) || a.name.localeCompare(b.name, game.i18n.lang));

    const decorated = nodes.map(decorate);
    return {
      isGM,
      sceneName: scene?.name ?? localize("NoScene"),
      wiredMap: this.#wiredMapContext(scene),
      hasScene: !!scene,
      stratumLabel: localize(`Strata.${board.stratum}`),
      roster,
      nodes: decorated,
      selected: decorated.find(node => node.selected) ?? null,
    };
  }

  // Header select: which Scene's board this viewed Scene shows. Only other Scenes that aren't themselves Wired maps are offered.
  #wiredMapContext(board) {
    const viewed = this.viewedScene;
    if (!viewed) return null;
    const linkedId = (board && (board !== viewed)) ? board.id : "";
    const options = game.scenes.filter(s => (s !== viewed) && !s.getFlag(MODULE_ID, "wiredMapFor"))
      .sort((a, b) => a.name.localeCompare(b.name, game.i18n.lang))
      .map(s => ({ value: s.id, label: s.name, isSelected: s.id === linkedId }));
    return { linked: !!linkedId, viewedName: viewed.name, options };
  }

  /** @override */
  _onRender(context, options) {
    super._onRender(context, options);
    if (!game.user.isGM) return;
    this.element.querySelector("[data-wired-map]")?.addEventListener("change", event => this.#onWiredMapChange(event));
    // Inline edits in the detail panel save on change.
    for (const input of this.element.querySelectorAll("[data-field]")) {
      input.addEventListener("change", event => this.#onFieldChange(event));
    }
    for (const input of this.element.querySelectorAll("[data-link-to]")) {
      input.addEventListener("change", event => this.#onLinkChange(event));
    }
  }

  async #onWiredMapChange(event) {
    const viewed = this.viewedScene;
    const target = event.currentTarget.value;
    if (!game.user.isGM || !viewed) return;
    this.selectedId = null;
    if (target) await viewed.setFlag(MODULE_ID, "wiredMapFor", target);
    else await viewed.unsetFlag(MODULE_ID, "wiredMapFor");
  }

  /* ---------- board writes (GM only) ---------- */

  async #updateBoard(mutate) {
    const scene = this.scene;
    if (!game.user.isGM || !scene) return;
    const board = getBoard(scene);
    await mutate(board.nodes, board);
    await scene.setFlag(MODULE_ID, "wiredBoard", { nodes: board.nodes, stratum: board.stratum, updated: Date.now() });
  }

  async #updateNode(nodeId, mutate) {
    return this.#updateBoard(nodes => {
      const node = nodes.find(n => n.id === nodeId);
      if (node) mutate(node);
    });
  }

  async #onFieldChange(event) {
    const input = event.currentTarget;
    const nodeId = input.closest("[data-node-id]")?.dataset.nodeId;
    const field = input.dataset.field;
    if (!nodeId || !field) return;
    await this.#updateNode(nodeId, node => {
      switch (field) {
        case "name":
        case "description":
        case "notes":
          node[field] = input.value;
          break;
        case "track":
          node.track = Number(input.value) === 1 ? 1 : 2;
          break;
        case "rating": {
          // Rating sets the Integrity pool; a full pool stays full.
          const rating = clamp(Number(input.value) || 1, 1, 5);
          const max = RATING[rating].integrity;
          const wasFull = node.integrity >= node.integrityMax;
          node.rating = rating;
          node.integrityMax = max;
          node.integrity = wasFull ? max : Math.min(node.integrity, max);
          break;
        }
        case "integrity":
          node.integrity = clamp(Math.floor(Number(input.value) || 0), 0, node.integrityMax);
          break;
        case "alert":
          node.alert = clamp(Math.floor(Number(input.value) || 0), 0, ALERT_MAX);
          break;
      }
    });
  }

  // Links checkbox: toggles the undirected edge between the selected node and the checked one.
  async #onLinkChange(event) {
    const input = event.currentTarget;
    const nodeId = input.closest("[data-node-id]")?.dataset.nodeId;
    const otherId = input.dataset.linkTo;
    if (!nodeId || !otherId) return;
    await this.#updateBoard(nodes => setLink(nodes, nodeId, otherId, input.checked));
  }

  static #nodeId(target) {
    return target.closest("[data-node-id]")?.dataset.nodeId;
  }

  static async #onSelectNode(event, target) {
    this.selectedId = WiredConsole.#nodeId(target);
    this.render();
  }

  /** A complete, hidden node with a full Integrity pool for its Rating. */
  static #makeNode({ name, track = 2, rating = 3, description = "", notes = "" }) {
    return {
      id: foundry.utils.randomID(), name, track, rating,
      integrity: RATING[rating].integrity, integrityMax: RATING[rating].integrity, alert: 0, revealed: false, description, notes, links: [],
    };
  }

  static async #onAddNode() {
    const count = getBoard(this.scene).nodes.length;
    const node = WiredConsole.#makeNode({ name: game.i18n.format("GHOSTWIRE.WiredConsole.NewNode", { n: count + 1 }) });
    this.selectedId = node.id;
    await this.#updateBoard(nodes => { nodes.push(node); });
  }

  // One click: roll a themed node from the scene's stratum (set in the cluster dialog).
  static async #onRandomNode() {
    const node = WiredConsole.#makeNode(rollNode(getBoard(this.scene).stratum));
    this.selectedId = node.id;
    await this.#updateBoard(nodes => { nodes.push(node); });
  }

  // Director preset: one of the ten Track 1 / Track 2 × Rating 1–5 templates, stats filled from the System Stat Card.
  static async #onAddTemplate() {
    if (!this.scene) return;
    const localize = key => game.i18n.localize(`GHOSTWIRE.WiredConsole.${key}`);
    const esc = foundry.utils.escapeHTML;
    // Track 2 lists Integrity and biofeedback; Track 1 has neither, so it lists the breach DC.
    const stats = t => (t.track === 2)
      ? game.i18n.format("GHOSTWIRE.WiredConsole.TemplateStats", { integrity: t.integrityMax, biofeedback: t.biofeedback })
      : game.i18n.format("GHOSTWIRE.WiredConsole.TemplateBreach", { dc: t.breachDC });
    const options = [1, 2].map(track => {
      const entries = NODE_TEMPLATES.filter(t => t.track === track)
        .map(t => `<option value="${t.id}">${esc(t.name)} — ${esc(stats(t))}</option>`).join("");
      return `<optgroup label="${esc(localize(`Track${track}`))}">${entries}</optgroup>`;
    }).join("");
    const data = await foundry.applications.api.DialogV2.input({
      window: { title: "GHOSTWIRE.WiredConsole.AddTemplate", icon: "fa-solid fa-layer-group" },
      content: `
        <p>${localize("AddTemplateHint")}</p>
        <div class="form-group">
          <label>${localize("Template")}</label>
          <select name="template">${options}</select>
        </div>`,
      ok: { label: "GHOSTWIRE.WiredConsole.AddTemplateConfirm", icon: "fa-solid fa-plus" },
    });
    const template = NODE_TEMPLATES.find(t => t.id === data?.template);
    if (!template) return;
    const node = WiredConsole.#makeNode(template);
    this.selectedId = node.id;
    await this.#updateBoard(nodes => { nodes.push(node); });
  }

  static async #onPlaceNode(event, target) {
    const scene = this.scene;
    const node = getBoard(scene).nodes.find(n => n.id === WiredConsole.#nodeId(target));
    await placeNode(scene, node);
  }

  static async #onRemoveNode(event, target) {
    const scene = this.scene;
    await removePlacedNode(scene && placedNodeActor(scene.id, WiredConsole.#nodeId(target)));
  }

  static async #onGenerateCluster() {
    if (!this.scene) return;
    const localize = key => game.i18n.localize(`GHOSTWIRE.WiredConsole.${key}`);
    const current = getBoard(this.scene).stratum;
    const options = ["random", ...Object.keys(STRATA)]
      .map(key => `<option value="${key}" ${key === current ? "selected" : ""}>${localize(`Strata.${key}`)}</option>`).join("");
    const data = await foundry.applications.api.DialogV2.input({
      window: { title: "GHOSTWIRE.WiredConsole.GenerateCluster", icon: "fa-solid fa-diagram-project" },
      content: `
        <p>${localize("GenerateClusterHint")}</p>
        <div class="form-group">
          <label>${localize("Stratum")}</label>
          <select name="stratum">${options}</select>
        </div>
        <div class="form-group">
          <label>${localize("ClusterCount")}</label>
          <input type="number" name="count" min="1" max="${CLUSTER_MAX}" step="1" value="5">
        </div>`,
      ok: { label: "GHOSTWIRE.WiredConsole.Generate", icon: "fa-solid fa-dice" },
    });
    if (!data) return;
    const stratum = STRATA[data.stratum] ? data.stratum : "random";
    const count = clamp(Math.floor(Number(data.count) || 0), 1, CLUSTER_MAX);
    const added = Array.from({ length: count }, () => WiredConsole.#makeNode(rollNode(stratum)));
    this.selectedId = added[0].id;
    await this.#updateBoard((nodes, board) => {
      nodes.push(...added);
      board.stratum = stratum;
    });
  }

  static async #onDeleteNode(event, target) {
    const nodeId = WiredConsole.#nodeId(target);
    const node = getBoard(this.scene).nodes.find(n => n.id === nodeId);
    if (!node) return;
    const confirmed = await foundry.applications.api.DialogV2.confirm({
      window: { title: "GHOSTWIRE.WiredConsole.DeleteNode" },
      content: `<p>${game.i18n.format("GHOSTWIRE.WiredConsole.DeleteNodeConfirm", { name: foundry.utils.escapeHTML(node.name) })}</p>`,
    });
    if (!confirmed) return;
    await this.#updateBoard(nodes => {
      // Strip back-links so no node keeps a wire to the deleted one.
      for (const other of nodes) other.links = other.links.filter(id => id !== nodeId);
      nodes.splice(nodes.findIndex(n => n.id === nodeId), 1);
    });
  }

  static async #onAlertUp(event, target) {
    const nodeId = WiredConsole.#nodeId(target);
    let lockout = null;
    await this.#updateNode(nodeId, node => {
      node.alert = clamp(node.alert + 1, 0, ALERT_MAX);
      if (node.alert === ALERT_MAX) lockout = node.name;
    });
    if (lockout) WiredConsole.#warnLockout(lockout);
  }

  static async #onAlertDown(event, target) {
    await this.#updateNode(WiredConsole.#nodeId(target), node => { node.alert = clamp(node.alert - 1, 0, ALERT_MAX); });
  }

  static async #onAlertMax(event, target) {
    let name = null;
    await this.#updateNode(WiredConsole.#nodeId(target), node => {
      node.alert = ALERT_MAX;
      name = node.name;
    });
    if (name) WiredConsole.#warnLockout(name);
  }

  // Step 12 resolves as a full lockout and counter-trace, then the track resets to 6 (not 0).
  static async #onAlertReset(event, target) {
    await this.#updateNode(WiredConsole.#nodeId(target), node => { node.alert = ALERT_RESET; });
  }

  static #warnLockout(name) {
    ui.notifications.warn(game.i18n.format("GHOSTWIRE.WiredConsole.LockoutWarning", { name }), { permanent: true });
  }

  static #amount(target) {
    const input = target.closest("[data-node-id]")?.querySelector("input[name='integrityAmount']");
    return Math.max(0, Math.floor(Number(input?.value) || 0));
  }

  static async #onDamageIntegrity(event, target) {
    const amount = WiredConsole.#amount(target);
    if (!amount) return;
    await this.#updateNode(WiredConsole.#nodeId(target), node => { node.integrity = clamp(node.integrity - amount, 0, node.integrityMax); });
  }

  static async #onRestoreIntegrity(event, target) {
    const amount = WiredConsole.#amount(target);
    if (!amount) return;
    await this.#updateNode(WiredConsole.#nodeId(target), node => { node.integrity = clamp(node.integrity + amount, 0, node.integrityMax); });
  }

  static async #onToggleReveal(event, target) {
    let revealed = null;
    await this.#updateNode(WiredConsole.#nodeId(target), node => {
      node.revealed = !node.revealed;
      if (node.revealed) revealed = { ...node };
    });
    if (revealed) await WiredConsole.#announceReveal(revealed, this.scene);
  }

  /** Post a public chat card when a node is revealed, carrying its player-facing Description (never the Director's Notes). */
  static async #announceReveal(node, scene) {
    const localize = key => game.i18n.localize(`GHOSTWIRE.WiredConsole.${key}`);
    const esc = foundry.utils.escapeHTML;
    const paragraphs = node.description.trim().split(/\n\s*\n/).filter(Boolean)
      .map(text => `<p>${esc(text).replace(/\n/g, "<br>")}</p>`).join("");
    const content = `
      <div class="ghostwire-node-reveal">
        <header>
          <i class="fa-solid fa-network-wired"></i>
          <span class="gw-reveal-kicker">${esc(localize("RevealChatTitle"))}</span>
        </header>
        <h3>${esc(node.name)}</h3>
        <div class="gw-reveal-tags">
          <span>${esc(localize(`Track${node.track}`))}</span>
          <span>R${node.rating}</span>
        </div>
        ${paragraphs ? `<div class="gw-reveal-description">${paragraphs}</div>` : ""}
      </div>`;
    await ChatMessage.implementation.create({
      speaker: { alias: scene?.name ? game.i18n.format("GHOSTWIRE.WiredConsole.RevealChatSpeaker", { scene: scene.name }) : localize("Title") },
      content,
    });
  }

  static async #onResetBoard() {
    const confirmed = await foundry.applications.api.DialogV2.confirm({
      window: { title: "GHOSTWIRE.WiredConsole.ResetBoard" },
      content: `<p>${game.i18n.format("GHOSTWIRE.WiredConsole.ResetBoardConfirm", { scene: foundry.utils.escapeHTML(this.scene?.name ?? "") })}</p>`,
    });
    if (confirmed) await this.#updateBoard(nodes => nodes.splice(0, nodes.length));
  }
}

/* ---------- registration ---------- */

let getWiredStateFn = null;

/** Open (or bring to front) the Wired Console. */
export function openWiredConsole() {
  const existing = foundry.applications.instances.get(WiredConsole.DEFAULT_OPTIONS.id);
  if (existing) return existing.render({ force: true });
  return new WiredConsole({ getWiredState: getWiredStateFn }).render({ force: true });
}

function toggleWiredConsole() {
  const existing = foundry.applications.instances.get(WiredConsole.DEFAULT_OPTIONS.id);
  if (existing?.rendered) return existing.close();
  return openWiredConsole();
}

const rerender = () => {
  const app = foundry.applications.instances.get(WiredConsole.DEFAULT_OPTIONS.id);
  if (app?.rendered) app.render();
};

/**
 * Register the Wired Console: scene control button, keybinding, live-refresh hooks, and module API.
 * Call during the init hook.
 * @param {{ getWiredState: Function }} options
 */
export function registerWiredConsole({ getWiredState }) {
  getWiredStateFn = getWiredState;
  registerNodeTokens({ getBoard });

  game.keybindings.register(MODULE_ID, "wiredConsole", {
    name: "GHOSTWIRE.WiredConsole.Keybinding",
    // No default key: pick one under Configure Controls (WASD panning owns the obvious choices).
    editable: [],
    onDown: () => {
      toggleWiredConsole();
      return true;
    },
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
  });

  Hooks.on("getSceneControlButtons", controls => {
    const tools = controls.tokens?.tools;
    if (!tools) return;
    tools.ghostwireWiredConsole = {
      name: "ghostwireWiredConsole",
      title: "GHOSTWIRE.WiredConsole.Title",
      icon: "fa-solid fa-network-wired",
      order: Object.keys(tools).length,
      button: true,
      visible: true,
      onChange: () => toggleWiredConsole(),
    };
  });

  // Live refresh: board changes, connection statuses, tokens entering or leaving, and switching scenes.
  Hooks.on("updateScene", (scene, changes) => {
    const viewed = game.scenes.viewed;
    if (((scene === viewed) || (scene === boardScene(viewed))) && foundry.utils.hasProperty(changes, `flags.${MODULE_ID}`)) rerender();
  });
  // Placed node Actors appearing or going away flip Place / Remove on canvas.
  Hooks.on("createActor", actor => { if (actor.getFlag(MODULE_ID, "kind") === "node") rerender(); });
  Hooks.on("deleteActor", actor => { if (actor.getFlag(MODULE_ID, "kind") === "node") rerender(); });
  Hooks.on("createActiveEffect", rerender);
  Hooks.on("deleteActiveEffect", rerender);
  Hooks.on("updateActor", (actor, changes) => {
    if (foundry.utils.hasProperty(changes, `flags.${MODULE_ID}.wired`)) rerender();
  });
  Hooks.on("createToken", rerender);
  Hooks.on("deleteToken", rerender);
  Hooks.on("canvasReady", rerender);

  Hooks.once("ready", () => {
    const module = game.modules.get(MODULE_ID);
    if (module) module.api = { ...(module.api ?? {}), openWiredConsole, getBoard, setLink, rollNode, NODE_TEMPLATES };
  });
}
