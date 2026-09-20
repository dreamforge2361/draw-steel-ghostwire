// Wired Console (B23b): a Scene-tied view of the Wired — connection roster, nodes, Integrity, and Trace Alert.
// Board data lives on a Scene: flags.draw-steel-ghostwire.wiredBoard = { nodes: [...], stratum, updated }. A matrix map can show another
// Scene's board (flags.draw-steel-ghostwire.wiredMapFor); nodes can be placed on the canvas as tokens (scripts/wired-node-tokens.mjs).
// Wire pings (B106) live on flags.draw-steel-ghostwire.wiredPings = { entries, updated } (last ~20); wiredBoard.pings is also read.
// Random nodes (B23c) roll from scripts/wired-node-table.mjs; Director templates and the System Stat Card (RATING) come from
// scripts/wired-node-templates.mjs (B32 Phase 5).
// Rules: docs/rulebook/08-hacker.md (System Stat Card, Trace Alert). Foundry notes: docs/rulebook/18-wired-foundry.md.

import { rollNode, STRATA } from "./wired-node-table.mjs";
import { RATING, NODE_TEMPLATES } from "./wired-node-templates.mjs";
import { boardScene, isNodeActor, placedNodeActor, placeNode, removePlacedNode, registerNodeTokens } from "./wired-node-tokens.mjs";
import { focusPlacedNodeOnCanvas } from "./wired-canvas-focus.mjs";
import { PING_MAX_LENGTH, appendPing, readPings, whisperRecipientIds } from "./wired-pings.mjs";
import { NODE_TOKEN_LIBRARY } from "./wired-node-art.mjs";
import { applyAutoNodesFromScene, tokenArtForNode } from "./wired-auto-nodes.mjs";
import { addWireKitToSelected } from "./wired-kit.mjs";
import {
  CONSOLE_SLICE,
  DS_HIDE_IN_SHEET,
  DS_SYSTEM_ID,
  abilityTierFromMessage,
  actorHasConnectInterface,
  consoleVerbGate,
  consoleVerbMetaFromMessage,
  filterOffSheetAbilitiesContext,
  hasHideInSheetFlag,
  hintVerbDsid,
  isOffSheetMatrixVerb,
  isTemporaryConsoleVerb,
  markTemporaryConsoleVerbData,
  nextAlert,
  offSheetVerbDomSelectors,
  shouldReleaseTemporaryVerb,
  sortConsoleNodes,
  sortConsoleRoster,
  splitReusableTemporaryVerbs,
  consoleRosterWireState,
  pickConsoleActor,
  pickPlayerVerbActor,
  softTraceDelta,
  verbUseMessageOptions,
} from "./wired-console-verbs.mjs";

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
      autoFrom: node.autoFrom && typeof node.autoFrom === "object" ? { ...node.autoFrom } : null,
      tokenStyle: typeof node.tokenStyle === "string" && node.tokenStyle.trim() ? node.tokenStyle.trim() : null,
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
  /** @param {{ getWiredState: (actor: Actor) => "disconnected"|"linked"|"overlay"|"jackedIn" }} options */
  constructor(options = {}) {
    super(options);
    this.getWiredState = options.getWiredState;
  }

  static DEFAULT_OPTIONS = {
    id: "ghostwire-wired-console",
    classes: ["ghostwire-wired-console"],
    window: { title: "GHOSTWIRE.WiredConsole.Title", icon: "fa-solid fa-network-wired", resizable: true },
    position: { width: 860, height: 720 },
    actions: {
      selectNode: WiredConsole.#onSelectNode,
      addNode: WiredConsole.#onAddNode,
      randomNode: WiredConsole.#onRandomNode,
      addTemplate: WiredConsole.#onAddTemplate,
      placeNode: WiredConsole.#onPlaceNode,
      removeNode: WiredConsole.#onRemoveNode,
      generateCluster: WiredConsole.#onGenerateCluster,
      autoNodes: WiredConsole.#onAutoNodes,
      addWireKit: WiredConsole.#onAddWireKit,
      selectActor: WiredConsole.#onSelectActor,
      fireVerb: WiredConsole.#onFireVerb,
      deleteNode: WiredConsole.#onDeleteNode,
      alertUp: WiredConsole.#onAlertUp,
      alertDown: WiredConsole.#onAlertDown,
      alertMax: WiredConsole.#onAlertMax,
      alertReset: WiredConsole.#onAlertReset,
      damageIntegrity: WiredConsole.#onDamageIntegrity,
      restoreIntegrity: WiredConsole.#onRestoreIntegrity,
      toggleReveal: WiredConsole.#onToggleReveal,
      resetBoard: WiredConsole.#onResetBoard,
      sendPing: WiredConsole.#onSendPing,
    },
  };

  static PARTS = {
    console: {
      template: `modules/${MODULE_ID}/templates/wired-console.hbs`,
      scrollable: [".wc-roster-list", ".wc-node-list", ".wc-detail", ".wc-ping-log", ".wc-verb-strip"],
    },
  };

  /** The node selected in the detail panel. */
  selectedId = null;

  /** The actor selected in the connection roster (uuid). */
  selectedActorUuid = null;

  /** GM Wire ping composer (kept across live re-renders). */
  pingDraft = "";
  pingWhisper = false;

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
    const lang = game.i18n.lang;
    const nodes = sortConsoleNodes(board.nodes.filter(node => isGM || node.revealed), { lang });
    if (!nodes.some(node => node.id === this.selectedId)) this.selectedId = nodes[0]?.id ?? null;
    const boardById = new Map(board.nodes.map(node => [node.id, node]));

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
        tokenStyleOptions: [
          { value: "", label: localize("TokenStyleGeneric"), isSelected: !node.tokenStyle },
          ...NODE_TOKEN_LIBRARY.map(style => ({ value: style.id, label: style.name, isSelected: node.tokenStyle === style.id })),
        ],
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
      const isNode = isNodeActor(actor);
      const display = consoleRosterWireState({
        isNode,
        runnerState: this.getWiredState?.(actor) ?? "disconnected",
      });
      const nodeId = isNode ? (actor.getFlag(MODULE_ID, "nodeId") ?? "") : "";
      const boardNode = nodeId ? boardById.get(nodeId) : null;
      roster.push({
        uuid: actor.uuid,
        name: token.name || actor.name,
        img: token.texture?.src || actor.img,
        state: display.state,
        stateLabel: game.i18n.localize(`GHOSTWIRE.Wired.States.${display.state}`),
        connected: display.connected,
        verbSelectable: display.verbSelectable,
        isNode,
        nodeId,
        revealed: isNode ? !!boardNode?.revealed : false,
        owned: isGM || actor.isOwner,
        hasInterface: !isNode && actorHasConnectInterface(actor),
      });
    }
    sortConsoleRoster(roster, { lang });
    this.selectedActorUuid = pickConsoleActor({
      roster,
      selectedUuid: this.selectedActorUuid,
      combatantUuid: game.combat?.combatant?.actor?.uuid ?? null,
    });
    for (const row of roster) row.selected = row.uuid === this.selectedActorUuid;

    const decorated = nodes.map(decorate);
    const selected = decorated.find(node => node.selected) ?? null;
    const verbActor = roster.find(row => row.selected) ?? null;
    const verbCtx = {
      actorUuid: verbActor?.uuid,
      connected: !!verbActor?.connected,
      state: verbActor?.state ?? "disconnected",
      nodeId: selected?.id,
      owned: !!verbActor?.owned,
      revealed: selected ? !!selected.revealed : true,
      isGM,
      hasInterface: !!verbActor?.hasInterface,
    };
    const verbs = verbStripView(verbCtx);
    const verbGate = consoleVerbGate({ ...verbCtx, dsid: hintVerbDsid(verbCtx.state) });
    const pings = readPings(scene).map(ping => ({
      ...ping,
      timeLabel: ping.at ? new Date(ping.at).toLocaleTimeString(game.i18n.lang, { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "",
      modeLabel: localize(ping.whisper ? "PingWhisper" : "PingPublic"),
    }));
    return {
      isGM,
      sceneName: scene?.name ?? localize("NoScene"),
      wiredMap: this.#wiredMapContext(scene),
      hasScene: !!scene,
      stratumLabel: localize(`Strata.${board.stratum}`),
      roster,
      nodes: decorated,
      selected,
      verbActor,
      verbs,
      verbHint: verbGate.reason
        ? game.i18n.localize(`GHOSTWIRE.WiredConsole.VerbNeed${verbGate.reason}`)
        : game.i18n.format("GHOSTWIRE.WiredConsole.VerbReady", { actor: verbActor.name, node: selected?.name ?? "—" }),
      pings,
      pingDraft: this.pingDraft ?? "",
      pingWhisper: !!this.pingWhisper,
      pingMax: PING_MAX_LENGTH,
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
    const pingLog = this.element.querySelector(".wc-ping-log");
    if (pingLog) pingLog.scrollTop = pingLog.scrollHeight;
    const pingText = this.element.querySelector("[data-ping-text]");
    pingText?.addEventListener("input", event => { this.pingDraft = event.currentTarget.value; });
    pingText?.addEventListener("keydown", event => {
      if (event.key !== "Enter" || event.isComposing) return;
      event.preventDefault();
      WiredConsole.#onSendPing.call(this, event, event.currentTarget);
    });
    this.element.querySelector("[data-ping-chat]")?.addEventListener("change", event => {
      this.pingWhisper = event.currentTarget.value === "whisper";
    });
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
        case "tokenStyle":
          node.tokenStyle = String(input.value ?? "").trim() || null;
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
    // After Place Node, list select / click / push pans to the token so the Director can find it.
    await focusPlacedNodeOnCanvas({ boardSceneId: this.scene?.id ?? null, nodeId: this.selectedId });
  }

  static async #onSelectActor(event, target) {
    const row = target.closest("[data-actor-uuid]");
    if (!row) return;
    // Node rows are infrastructure: pan/select the board node, never the verb actor.
    if (row.dataset.isNode === "true") {
      const nodeId = row.dataset.nodeId || null;
      if (nodeId) {
        this.selectedId = nodeId;
        this.render();
        await focusPlacedNodeOnCanvas({ boardSceneId: this.scene?.id ?? null, nodeId });
      }
      return;
    }
    this.selectedActorUuid = row.dataset.actorUuid ?? null;
    this.render();
  }

  static async #onFireVerb(event, target) {
    const dsid = target.dataset.verb;
    const actor = this.selectedActorUuid ? await fromUuid(this.selectedActorUuid) : null;
    const scene = this.scene;
    const node = getBoard(scene).nodes.find(n => n.id === this.selectedId) ?? null;
    await useConsoleVerb(actor, dsid, { node, scene, getWiredState: this.getWiredState });
  }

  /** A complete, hidden node with a full Integrity pool for its Rating. */
  static #makeNode({ name, track = 2, rating = 3, description = "", notes = "", links = [], autoFrom = null, tokenStyle = null }) {
    return {
      id: foundry.utils.randomID(), name, track, rating,
      integrity: RATING[rating].integrity, integrityMax: RATING[rating].integrity, alert: 0, revealed: false, description, notes,
      links: Array.isArray(links) ? [...links] : [],
      autoFrom,
      tokenStyle,
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
    const art = tokenArtForNode(node);
    await placeNode(scene, node, art ? {
      extraFlags: {
        ...(node.autoFrom ? { autoKind: node.autoFrom.kind, autoFrom: node.autoFrom } : {}),
        tokenArt: art,
      },
      textureSrc: art,
    } : {});
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

  // B112: Light Control per room, Maglock per door, Cam Controls per cam light; hidden tokens on the canvas.
  static async #onAutoNodes() {
    if (!this.scene) return;
    const localize = key => game.i18n.localize(`GHOSTWIRE.WiredConsole.${key}`);
    const existing = getBoard(this.scene).nodes.filter(n => n.autoFrom).length;
    const data = await foundry.applications.api.DialogV2.input({
      window: { title: "GHOSTWIRE.WiredConsole.AutoNodes", icon: "fa-solid fa-lightbulb" },
      content: `
        <p>${localize("AutoNodesHint")}</p>
        <p class="hint">${localize("AutoNodesRule")}</p>
        ${existing ? `<p class="hint">${game.i18n.format("GHOSTWIRE.WiredConsole.AutoNodesExisting", { count: existing })}</p>` : ""}
        <div class="form-group">
          <label>${localize("AutoNodesMode")}</label>
          <select name="mode">
            <option value="skip" selected>${localize("AutoNodesSkip")}</option>
            <option value="replace">${localize("AutoNodesReplace")}</option>
          </select>
        </div>`,
      ok: { label: "GHOSTWIRE.WiredConsole.AutoNodesConfirm", icon: "fa-solid fa-lightbulb" },
    });
    if (!data) return;
    const plan = await applyAutoNodesFromScene({ replace: data.mode === "replace" });
    if (plan.created?.[0]) this.selectedId = plan.created[0].id;
  }

  // B115: stamp Wire Kit + Matrix Verbs onto selected NPC tokens. Heroes already have verbs.
  static async #onAddWireKit() {
    await addWireKitToSelected();
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

  /* ---------- Wire ping / spoof (B106) ---------- */

  static async #onSendPing() {
    const scene = this.scene;
    if (!game.user.isGM || !scene) return;
    const text = (this.pingDraft ?? "").trim();
    if (!text) {
      ui.notifications.warn(game.i18n.localize("GHOSTWIRE.WiredConsole.PingEmpty"));
      return;
    }
    const whisper = !!this.pingWhisper;
    const ping = {
      id: foundry.utils.randomID(),
      text,
      whisper,
      at: Date.now(),
      user: game.user.name,
    };
    const entries = appendPing(readPings(scene), ping, () => foundry.utils.randomID());
    await scene.setFlag(MODULE_ID, "wiredPings", { entries, updated: Date.now() });
    this.pingDraft = "";
    await WiredConsole.#announcePing(ping, scene, this.getWiredState);
  }

  /** Chat card for a ping: public, or whisper to Overlay / Jacked In token owners (plus GMs). */
  static async #announcePing(ping, scene, getWiredState) {
    const localize = key => game.i18n.localize(`GHOSTWIRE.WiredConsole.${key}`);
    const esc = foundry.utils.escapeHTML;
    const mode = localize(ping.whisper ? "PingWhisper" : "PingPublic");
    const content = `
      <div class="ghostwire-wire-ping${ping.whisper ? " is-whisper" : ""}">
        <header>
          <i class="fa-solid fa-satellite-dish"></i>
          <span class="gw-ping-kicker">${esc(localize("PingChatTitle"))}</span>
          <span class="gw-ping-mode">${esc(mode)}</span>
        </header>
        <p class="gw-ping-text">${esc(ping.text)}</p>
      </div>`;
    const data = {
      speaker: { alias: scene?.name ? game.i18n.format("GHOSTWIRE.WiredConsole.PingChatSpeaker", { scene: scene.name }) : localize("Title") },
      content,
    };
    if (ping.whisper) {
      const viewed = game.scenes.viewed;
      data.whisper = whisperRecipientIds({
        users: game.users,
        tokens: viewed?.tokens ?? [],
        getWiredState,
        canOwn: (actor, user) => actor.testUserPermission(user, "OWNER"),
      });
      if (!data.whisper.some(id => !game.users.get(id)?.isGM)) {
        ui.notifications.info(localize("PingNoConnected"));
      }
    }
    await ChatMessage.implementation.create(data);
  }
}

/* ---------- Matrix Verbs from Console / node panel (B117) ---------- */

/** Shared Matrix Verb button specs for the Console strip and the node panel (all nine). */
export function verbStripView(ctx = {}) {
  return CONSOLE_SLICE.map(verb => {
    const gate = consoleVerbGate({ ...ctx, dsid: verb.dsid });
    const name = game.i18n.localize(`GHOSTWIRE.Abilities.MatrixVerbs.${verb.lang}.Name`);
    let tooltip;
    if (!gate.ok) tooltip = game.i18n.localize(`GHOSTWIRE.WiredConsole.VerbNeed${gate.reason}`);
    else if (verb.characteristicLabel) {
      tooltip = game.i18n.format("GHOSTWIRE.WiredConsole.VerbTooltip", { name, chr: verb.characteristicLabel });
    } else {
      tooltip = game.i18n.format("GHOSTWIRE.WiredConsole.VerbTooltipAuto", { name });
    }
    return {
      dsid: verb.dsid,
      icon: verb.icon,
      label: name,
      enabled: gate.ok,
      tooltip,
    };
  });
}

const TEMP_EMBED_OPTIONS = { render: false };

/**
 * Draw Steel 1.1.2 AbilityModel#use requires a real embedded Item:
 *   "Abilities can only be used while embedded"
 * Chat `abilityUse` / `abilityResult` store `abilityUuid` and later
 * `fromUuidSync` it for `toEmbed` + `powerRollText` (tier display strings).
 * A parented-but-unembedded Item is not in the actor collection, so confirm
 * throws. Embed for the use, **keep** it while chat still points at it
 * (`flags.draw-steel.hideInSheet` + sheet prepare filter + DOM/CSS hide;
 * ready leftover strip deletes only orphans not backing a chat abilityUuid).
 *
 * @returns {Promise<{ item: Item|null, ephemeral: boolean, created: boolean }>}
 */
async function resolveVerbItem(actor, dsid) {
  const owned = [...(actor?.items ?? [])].find(item => item.system?._dsid === dsid && !isTemporaryConsoleVerb(item));
  if (owned) {
    await ensureTempHiddenOnSheet(owned);
    return { item: owned, ephemeral: false, created: false };
  }

  const spec = CONSOLE_SLICE.find(verb => verb.dsid === dsid);
  const source = spec ? await fromUuid(spec.uuid) : null;
  if (!source || !actor?.createEmbeddedDocuments) return { item: null, ephemeral: false, created: false };

  const { keep, extras } = splitReusableTemporaryVerbs(actor.items, dsid);
  if (extras.length) {
    await actor.deleteEmbeddedDocuments("Item", extras.map(item => item.id), TEMP_EMBED_OPTIONS);
  }
  if (keep) {
    await ensureTempHiddenOnSheet(keep);
    return { item: keep, ephemeral: true, created: false };
  }

  const data = markTemporaryConsoleVerbData(game.items.fromCompendium(source, { clearFolder: true }));
  const [created] = await actor.createEmbeddedDocuments("Item", [data], TEMP_EMBED_OPTIONS);
  if (created) await ensureTempHiddenOnSheet(created);
  return { item: created ?? null, ephemeral: true, created: true };
}

async function ensureTempHiddenOnSheet(item) {
  if (!item || hasHideInSheetFlag(item)) return;
  try {
    if (typeof item.setFlag === "function") await item.setFlag(DS_SYSTEM_ID, DS_HIDE_IN_SHEET, true);
  } catch (err) {
    console.warn(`${MODULE_ID} | could not stamp hideInSheet on temporary Matrix Verb`, err);
  }
}

async function releaseTemporaryVerbItem(actor, item) {
  if (!item?.id || !actor?.items?.get(item.id) || !isTemporaryConsoleVerb(item)) return;
  try {
    await actor.deleteEmbeddedDocuments("Item", [item.id], TEMP_EMBED_OPTIONS);
  } catch (err) {
    console.warn(`${MODULE_ID} | could not drop temporary Matrix Verb`, err);
  }
}

function hideVerbRow(node) {
  const row = node.closest("li, article, .item, .document, .ability, [data-document-uuid]") ?? node;
  row.hidden = true;
  row.classList.add("ghostwire-off-sheet-verb");
  row.dataset.ghostwireOffSheetVerb = "true";
  row.style?.setProperty?.("display", "none", "important");
}

/**
 * Hide Matrix Verbs on Draw Steel hero/NPC sheets (B117).
 * DS 1.1.2 rows use `data-document-uuid`; hideInSheet is the primary filter.
 */
function hideTemporaryConsoleVerbs(app, element) {
  const root = element instanceof HTMLElement ? element : element?.[0];
  const actor = app?.document ?? app?.actor;
  if (!root?.querySelectorAll || !actor?.items) return;
  const offSheet = [...actor.items].filter(item => isOffSheetMatrixVerb(item));
  if (!offSheet.length) return;
  const ids = new Set(offSheet.map(item => item.id).filter(Boolean));
  const uuids = new Set(offSheet.map(item => item.uuid).filter(Boolean));
  for (const item of offSheet) {
    for (const selector of offSheetVerbDomSelectors(item)) {
      for (const node of root.querySelectorAll(selector)) hideVerbRow(node);
    }
  }
  for (const node of root.querySelectorAll("[data-document-uuid], [data-uuid], [data-item-id], [data-entry-id]")) {
    const ref = node.dataset.documentUuid || node.dataset.uuid || node.dataset.itemId || node.dataset.entryId || "";
    if (!ref) continue;
    if (uuids.has(ref) || ids.has(ref) || [...ids].some(id => ref.endsWith(`.Item.${id}`))) hideVerbRow(node);
  }
}

/** Wrap DS `_prepareAbilitiesContext` so Ping (and the other eight) never enter the sheet list. */
function patchSheetHideMatrixVerbs() {
  const sheets = Object.values(ds?.applications?.sheets ?? {});
  for (const Sheet of sheets) {
    const prep = Sheet?.prototype?._prepareAbilitiesContext;
    if (typeof prep !== "function" || prep.__ghostwireOffSheet) continue;
    async function patched() {
      return filterOffSheetAbilitiesContext(await prep.call(this));
    }
    patched.__ghostwireOffSheet = true;
    Sheet.prototype._prepareAbilitiesContext = patched;
  }
}

/**
 * Fire a Matrix Verb through Draw Steel AbilityModel#use on the selected actor.
 * Edges (Hacking, Jacked In, Reader) come from the existing AbilityModel#use patch.
 */
export async function useConsoleVerb(actor, dsid, { node = null, scene = null, getWiredState = getWiredStateFn } = {}) {
  if (isNodeActor(actor)) {
    const warn = game.i18n.localize("GHOSTWIRE.WiredConsole.VerbNeedActor");
    ui.notifications.warn(warn);
    return;
  }
  const state = getWiredState?.(actor) ?? "disconnected";
  const gate = consoleVerbGate({
    actorUuid: actor?.uuid,
    connected: state !== "disconnected",
    state,
    nodeId: node?.id,
    owned: !!(actor && (game.user.isGM || actor.isOwner)),
    revealed: node ? !!node.revealed : true,
    isGM: !!game.user.isGM,
    dsid,
    hasInterface: actorHasConnectInterface(actor),
  });
  if (!gate.ok) {
    const warn = game.i18n.localize(`GHOSTWIRE.WiredConsole.VerbNeed${gate.reason}`);
    ui.notifications.warn(warn);
    if (gate.reason === "Interface") {
      await ChatMessage.implementation.create({
        speaker: ChatMessage.implementation.getSpeaker({ actor }),
        content: `<p>${warn}</p>`,
      });
    }
    return null;
  }
  const spec = CONSOLE_SLICE.find(verb => verb.dsid === dsid);
  if (!spec) {
    ui.notifications.warn(game.i18n.localize("GHOSTWIRE.WiredConsole.VerbUnknown"));
    return null;
  }
  const acquired = await resolveVerbItem(actor, dsid);
  const item = acquired.item;
  if (!item?.system?.use) {
    if (shouldReleaseTemporaryVerb({ created: acquired.created, hasChatCard: false })) {
      await releaseTemporaryVerbItem(actor, item);
    }
    ui.notifications.warn(game.i18n.format("GHOSTWIRE.WiredConsole.VerbMissing", { name: spec.lang }));
    return null;
  }
  const consoleVerb = { dsid, nodeId: node?.id ?? null, sceneId: scene?.id ?? null, actorUuid: actor.uuid };
  let message = null;
  try {
    message = await item.system.use({}, {}, verbUseMessageOptions(consoleVerb));
  } catch (err) {
    if (shouldReleaseTemporaryVerb({ created: acquired.created, hasChatCard: false })) {
      await releaseTemporaryVerbItem(actor, item);
    }
    throw err;
  }
  // Successful use: keep the embed so DS chat can still fromUuidSync abilityUuid
  // for Search (and the other eight) tier text. Cancelled dialog: drop only a
  // temp this call created (reused leftovers may still back an earlier card).
  if (shouldReleaseTemporaryVerb({ created: acquired.created, hasChatCard: !!message })) {
    await releaseTemporaryVerbItem(actor, item);
  }
  if (message?.setFlag && !consoleVerbMetaFromMessage(message)) {
    try { await message.setFlag(MODULE_ID, "consoleVerb", consoleVerb); }
    catch (err) { console.warn(`${MODULE_ID} | could not flag Console verb chat`, err); }
  }
  await applyConsoleVerbTrace(message);
  return message;
}

/** GM applies soft Trace once the power-roll tier is on the chat card. */
export async function applyConsoleVerbTrace(message) {
  if (!game.user.isGM) return false;
  if (game.users?.activeGM && (game.users.activeGM !== game.user)) return false;
  const meta = consoleVerbMetaFromMessage(message);
  if (!meta?.nodeId || meta.applied) return false;
  const tier = abilityTierFromMessage(message);
  if (tier == null) return false;
  const delta = softTraceDelta(meta.dsid, tier);
  if (delta && meta.sceneId) {
    const scene = game.scenes.get(meta.sceneId);
    if (scene) {
      const board = getBoard(scene);
      const node = board.nodes.find(n => n.id === meta.nodeId);
      if (node) {
        const next = nextAlert(node.alert, delta);
        node.alert = next.alert;
        await scene.setFlag(MODULE_ID, "wiredBoard", { nodes: board.nodes, stratum: board.stratum, updated: Date.now() });
        if (next.lockout) {
          ui.notifications.warn(game.i18n.format("GHOSTWIRE.WiredConsole.LockoutWarning", { name: node.name }), { permanent: true });
        } else {
          ui.notifications.info(game.i18n.format("GHOSTWIRE.WiredConsole.VerbTrace", { name: node.name, alert: next.alert }));
        }
      }
    }
  }
  if (message?.setFlag) {
    try { await message.setFlag(MODULE_ID, "consoleVerb", { ...meta, tier, applied: true }); }
    catch (err) { console.warn(`${MODULE_ID} | could not mark Console verb applied`, err); }
  }
  return true;
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
  patchSheetHideMatrixVerbs();

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

  Hooks.on("createChatMessage", message => {
    applyConsoleVerbTrace(message).catch(err => console.warn(`${MODULE_ID} | Console verb Trace`, err));
  });
  Hooks.on("updateChatMessage", message => {
    applyConsoleVerbTrace(message).catch(err => console.warn(`${MODULE_ID} | Console verb Trace`, err));
  });

  Hooks.on("renderDrawSteelHeroSheet", hideTemporaryConsoleVerbs);
  Hooks.on("renderDrawSteelNPCSheet", hideTemporaryConsoleVerbs);
  Hooks.on("renderDrawSteelRetainerSheet", hideTemporaryConsoleVerbs);
  Hooks.on("renderActorSheet", hideTemporaryConsoleVerbs);
  Hooks.on("renderActorSheetV2", hideTemporaryConsoleVerbs);

  Hooks.once("ready", () => {
    const module = game.modules.get(MODULE_ID);
    if (module) {
      module.api = {
        ...(module.api ?? {}),
        openWiredConsole, getBoard, setLink, rollNode, NODE_TEMPLATES, readPings,
        applyAutoNodesFromScene, useConsoleVerb, verbStripView, CONSOLE_SLICE, pickPlayerVerbActor, actorHasConnectInterface,
        isTemporaryConsoleVerb,
      };
    }
  });
}
