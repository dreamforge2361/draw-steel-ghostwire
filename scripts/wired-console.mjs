// Wired Console (B23b): a Scene-tied view of the Wired — connection roster, nodes, Integrity, and Trace Alert.
// Board data lives on the viewed Scene: flags.draw-steel-ghostwire.wiredBoard = { nodes: [...], stratum, updated }.
// Random nodes (B23c) roll from scripts/wired-node-table.mjs.
// Rules: docs/rulebook/08-hacker.md (System Stat Card, Trace Alert). Foundry notes: docs/rulebook/18-wired-foundry.md.

import { rollNode, STRATA } from "./wired-node-table.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

// System Stat Card, indexed by Node Rating 1–5.
const RATING = {
  1: { integrity: 12, breachDC: 10, biofeedback: 3, ice: "1 passive layer" },
  2: { integrity: 18, breachDC: 12, biofeedback: 5, ice: "2 passive layers" },
  3: { integrity: 26, breachDC: 15, biofeedback: 8, ice: "Passive + 1 active ICE" },
  4: { integrity: 36, breachDC: 17, biofeedback: 13, ice: "Passive + 2 active ICE; biofeedback on a failed breach" },
  5: { integrity: 50, breachDC: 19, biofeedback: 22, ice: "Full active ICE suite; automatic counter-trace on any high (17+) roll against it" },
};
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
    };
  });
  // Stratum is the scene's default for random nodes; "random" rolls a stratum per node.
  const stratum = STRATA[board.stratum] ? board.stratum : "random";
  return { nodes, stratum, updated: board.updated ?? 0 };
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

  get scene() {
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
      };
    };

    // Roster: one row per actor with a token on the scene. Players only see actors they own.
    const roster = [];
    const seen = new Set();
    for (const token of scene?.tokens ?? []) {
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
      hasScene: !!scene,
      stratumLabel: localize(`Strata.${board.stratum}`),
      roster,
      nodes: decorated,
      selected: decorated.find(node => node.selected) ?? null,
    };
  }

  /** @override */
  _onRender(context, options) {
    super._onRender(context, options);
    if (!game.user.isGM) return;
    // Inline edits in the detail panel save on change.
    for (const input of this.element.querySelectorAll("[data-field]")) {
      input.addEventListener("change", event => this.#onFieldChange(event));
    }
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
      integrity: RATING[rating].integrity, integrityMax: RATING[rating].integrity, alert: 0, revealed: false, description, notes,
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
    if (confirmed) await this.#updateBoard(nodes => nodes.splice(nodes.findIndex(n => n.id === nodeId), 1));
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
    if ((scene === game.scenes.viewed) && foundry.utils.hasProperty(changes, `flags.${MODULE_ID}`)) rerender();
  });
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
    if (module) module.api = { ...(module.api ?? {}), openWiredConsole, getBoard, rollNode };
  });
}
