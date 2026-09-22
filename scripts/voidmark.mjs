// VOIDMARK (B82): in-module AI chat applet. Players/GM talk to an OpenAI-compatible
// Chat Completions API from Foundry — not a live Cursor/Grok Bot bridge.
// RAG: scripts/voidmark-rag.mjs over data/voidmark-rules-index.json
// (RAW + Reach Handbook + L1–L5 + Flats gazetteer) plus world Journal pages the
// asker may see. Design: docs/spikes/B82-VOIDMARK-AI-APPLET.md.
// B122 / S6: only a GM asking in Director mode hears Director-only material —
// Director campaign aids in the static index, and world journals marked
// flags.draw-steel-ghostwire.voidmarkAudience = "director".
// Lock: docs/spikes/B122-DIRECTOR-ONLY-LORE-VOIDMARK.md

import { citationLabels, retrieve } from "./voidmark-rag.mjs";
import { audienceForAsk } from "./voidmark-audience.mjs";
import { worldJournalChunks } from "./voidmark-journal.mjs";
import { DEFAULT_SYSTEM_INSTRUCTIONS, buildChatMessages, normalizeMode } from "./voidmark-prompt.mjs";
import { buildChatRequest, redactSecrets, sendChatRequest } from "./voidmark-client.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const SOCKET = `module.${MODULE_ID}`;
const INDEX_PATH = `modules/${MODULE_ID}/data/voidmark-rules-index.json`;
const AVATAR_PATH = `modules/${MODULE_ID}/assets/ai-persona/voidmark.webp`;
const THREAD_FLAG = "voidmarkThread";
const L = "GHOSTWIRE.Voidmark";
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

const SETTINGS = {
  enabled: "voidmarkEnabled",
  playerAccess: "voidmarkPlayerAccess",
  apiBaseUrl: "voidmarkApiBaseUrl",
  apiKey: "voidmarkApiKey",
  model: "voidmarkModel",
  temperature: "voidmarkTemperature",
  maxTokens: "voidmarkMaxTokens",
  systemInstructions: "voidmarkSystemInstructions",
};

const loc = (key, data) => (data ? game.i18n.format(`${L}.${key}`, data) : game.i18n.localize(`${L}.${key}`));

let indexPromise = null;

function loadIndex() {
  indexPromise ??= foundry.utils.fetchJsonWithTimeout(INDEX_PATH).catch(error => {
    indexPromise = null;
    throw error;
  });
  return indexPromise;
}

function setting(key) {
  return game.settings.get(MODULE_ID, SETTINGS[key]);
}

export function canOpenVoidmark(user = game.user) {
  if (!setting("enabled")) return false;
  return !!(user?.isGM || setting("playerAccess"));
}

function activeHandlerGm() {
  return game.users.filter(u => u.isGM && u.active).sort((a, b) => a.id.localeCompare(b.id))[0] ?? null;
}

function notifyWarn(key, data) {
  ui.notifications.warn(loc(key, data));
}

function escapeHtml(text) {
  return foundry.utils.escapeHTML(String(text ?? ""));
}

function formatMessageHtml(text) {
  const escaped = escapeHtml(text).replace(/\r\n/g, "\n");
  return escaped
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");
}

/**
 * Static index + world-journal hits, filtered to what this asker may hear.
 * @param {string} query
 * @param {{ user?: User, mode?: string, forcePlayer?: boolean }} [spec]
 */
async function retrieveHits(query, { user = game.user, mode = "runner", forcePlayer = false } = {}) {
  const audience = audienceForAsk({ user, mode, forcePlayer });
  let staticChunks = [];
  try {
    const index = await loadIndex();
    staticChunks = Array.isArray(index) ? index : (index?.chunks ?? []);
  } catch (error) {
    console.warn(`${MODULE_ID} | VOIDMARK rules index failed to load`, error);
  }
  let journalChunks = [];
  try {
    journalChunks = worldJournalChunks({ user, mode, forcePlayer });
  } catch (error) {
    console.warn(`${MODULE_ID} | VOIDMARK world journal scan failed`, error);
  }
  return retrieve([...staticChunks, ...journalChunks], query, { k: 5, maxChars: 5500, audience });
}

function readThread() {
  const flag = game.user.getFlag(MODULE_ID, THREAD_FLAG) ?? {};
  return {
    mode: normalizeMode(flag.mode),
    messages: Array.isArray(flag.messages) ? flag.messages : [],
  };
}

async function writeThread(thread) {
  await game.user.setFlag(MODULE_ID, THREAD_FLAG, {
    mode: normalizeMode(thread.mode),
    messages: (thread.messages ?? []).slice(-24).map(m => ({
      role: m.role,
      content: String(m.content ?? ""),
      citations: Array.isArray(m.citations) ? m.citations : undefined,
    })),
  });
}

function askPayload(query, mode, history) {
  return {
    query: String(query ?? "").trim().slice(0, 4000),
    mode: normalizeMode(mode),
    history: (history ?? [])
      .filter(m => m.role === "user" || m.role === "assistant")
      .slice(-8)
      .map(m => ({ role: m.role, content: String(m.content ?? "").slice(0, 4000) })),
  };
}

async function completeFromSettings(query, mode, history, asker = {}) {
  const hits = await retrieveHits(query, { user: asker.user ?? game.user, mode, forcePlayer: asker.forcePlayer });
  const messages = buildChatMessages({
    systemInstructions: setting("systemInstructions"),
    mode,
    hits,
    history,
    query,
  });
  const request = buildChatRequest({
    baseUrl: setting("apiBaseUrl"),
    apiKey: setting("apiKey"),
    model: setting("model"),
    temperature: setting("temperature"),
    maxTokens: setting("maxTokens"),
    messages,
  });
  const { content } = await sendChatRequest(globalThis.fetch.bind(globalThis), request);
  return { content, citations: citationLabels(hits) };
}

/* ---------- chat app ---------- */

export class VoidmarkChat extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "ghostwire-voidmark-chat",
    classes: ["ghostwire-voidmark-chat"],
    window: { title: `${L}.Title`, icon: "fa-solid fa-ghost", resizable: true },
    position: { width: 520, height: 680 },
    actions: {
      send: VoidmarkChat.#onSend,
      clear: VoidmarkChat.#onClear,
      setMode: VoidmarkChat.#onSetMode,
    },
  };

  static PARTS = {
    chat: {
      template: `modules/${MODULE_ID}/templates/voidmark-chat.hbs`,
      scrollable: [".vm-transcript"],
    },
  };

  pending = false;
  #draft = "";
  #error = "";

  /** @override */
  async _prepareContext() {
    const thread = readThread();
    const hasKey = !!String(setting("apiKey") ?? "").trim();
    const configured = game.user.isGM ? hasKey : !!activeHandlerGm();
    const messages = thread.messages.map((m, i) => ({
      id: `m${i}`,
      role: m.role,
      isUser: m.role === "user",
      isMark: m.role === "assistant",
      html: formatMessageHtml(m.content),
      citations: m.citations ?? [],
    }));
    return {
      avatar: AVATAR_PATH,
      callsign: loc("Callsign"),
      kicker: loc("Kicker"),
      mode: thread.mode,
      runnerMode: thread.mode === "runner",
      directorMode: thread.mode === "director",
      messages,
      empty: !messages.length && !this.pending,
      pending: this.pending,
      error: this.#error,
      draft: this.#draft,
      configured,
      canClear: !!messages.length,
      playerHint: !game.user.isGM && setting("playerAccess") ? loc("PlayerRelayHint") : "",
    };
  }

  /** @override */
  _onRender(context, options) {
    super._onRender(context, options);
    const transcript = this.element.querySelector(".vm-transcript");
    if (transcript) transcript.scrollTop = transcript.scrollHeight;
    const input = this.element.querySelector("[name='prompt']");
    if (input) {
      input.addEventListener("keydown", event => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          this.#submit();
        }
      });
      input.addEventListener("input", event => { this.#draft = event.currentTarget.value; });
    }
  }

  static #onSetMode(event, target) {
    const mode = normalizeMode(target.dataset.mode);
    const thread = readThread();
    if (thread.mode === mode) return;
    writeThread({ ...thread, mode }).then(() => this.render());
  }

  static #onClear() {
    this.#error = "";
    this.#draft = "";
    writeThread({ mode: readThread().mode, messages: [] }).then(() => this.render());
  }

  static #onSend() {
    this.#submit();
  }

  async #submit() {
    if (this.pending) return;
    const input = this.element.querySelector("[name='prompt']");
    const query = String(input?.value ?? this.#draft ?? "").trim();
    if (!query) return;
    this.#draft = "";
    this.#error = "";
    const thread = readThread();
    thread.messages.push({ role: "user", content: query });
    await writeThread(thread);
    this.pending = true;
    this.render();
    try {
      const reply = await this.#complete(query, thread);
      thread.messages.push({ role: "assistant", content: reply.content, citations: reply.citations });
      await writeThread(thread);
    } catch (error) {
      this.#error = userFacingError(error);
    } finally {
      this.pending = false;
      this.render();
    }
  }

  async #complete(query, thread) {
    const history = thread.messages.slice(0, -1);
    const body = askPayload(query, thread.mode, history);
    if (game.user.isGM) return completeFromSettings(body.query, body.mode, body.history, { user: game.user });
    return requestViaGm(body);
  }
}

function userFacingError(error) {
  const code = error?.code;
  if (code === "VOIDMARK_NO_KEY") return loc("Errors.NoKey");
  if (code === "VOIDMARK_NO_GM") return loc("Errors.NoGm");
  if (code === "VOIDMARK_DISABLED") return loc("Errors.Disabled");
  if (code === "VOIDMARK_DENIED") return loc("Errors.Denied");
  if (code === "VOIDMARK_EMPTY") return loc("Errors.Empty");
  return loc("Errors.Generic", { detail: redactSecrets(error?.message ?? error) });
}

/* ---------- player → GM relay ---------- */

const pendingAsks = new Map();

function requestViaGm(body) {
  if (!canOpenVoidmark()) {
    const error = new Error("VOIDMARK_DENIED");
    error.code = "VOIDMARK_DENIED";
    return Promise.reject(error);
  }
  const gm = activeHandlerGm();
  if (!gm) {
    const error = new Error("VOIDMARK_NO_GM");
    error.code = "VOIDMARK_NO_GM";
    return Promise.reject(error);
  }
  const id = foundry.utils.randomID();
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      pendingAsks.delete(id);
      const error = new Error("VOIDMARK_TIMEOUT");
      error.code = "VOIDMARK_HTTP";
      reject(error);
    }, 90000);
    pendingAsks.set(id, { resolve, reject, timer });
    game.socket.emit(SOCKET, { op: "voidmark.ask", id, userId: game.user.id, ...body });
  });
}

async function onSocket(payload) {
  if (!payload?.op) return;
  if (payload.op === "voidmark.reply") {
    const pending = pendingAsks.get(payload.id);
    if (!pending) return;
    clearTimeout(pending.timer);
    pendingAsks.delete(payload.id);
    if (payload.ok) pending.resolve({ content: payload.content, citations: payload.citations ?? [] });
    else {
      const error = new Error(payload.error ?? "VOIDMARK_HTTP");
      error.code = payload.code ?? "VOIDMARK_HTTP";
      pending.reject(error);
    }
    return;
  }
  if (payload.op !== "voidmark.ask" || !game.user.isGM) return;
  const handler = activeHandlerGm();
  if (!handler || handler.id !== game.user.id) return;

  const user = game.users.get(payload.userId);
  const fail = (code, message) => game.socket.emit(SOCKET, { op: "voidmark.reply", id: payload.id, ok: false, code, error: message });
  if (!setting("enabled")) return fail("VOIDMARK_DISABLED", loc("Errors.Disabled"));
  if (!user || !canOpenVoidmark(user)) return fail("VOIDMARK_DENIED", loc("Errors.Denied"));
  try {
    // Relay asks are always player audience, whatever mode the payload claims.
    const reply = await completeFromSettings(payload.query, payload.mode, payload.history, { user, forcePlayer: true });
    game.socket.emit(SOCKET, { op: "voidmark.reply", id: payload.id, ok: true, ...reply });
  } catch (error) {
    fail(error.code ?? "VOIDMARK_HTTP", userFacingError(error));
  }
}

/* ---------- settings menu ---------- */

export class VoidmarkSettingsMenu extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "ghostwire-voidmark-settings",
    classes: ["ghostwire-voidmark-settings"],
    tag: "form",
    form: { handler: VoidmarkSettingsMenu.#onSubmit, closeOnSubmit: true },
    window: { title: `${L}.Settings.Menu.Name`, icon: "fa-solid fa-ghost", resizable: true },
    position: { width: 640, height: 720 },
  };

  static PARTS = {
    form: { template: `modules/${MODULE_ID}/templates/voidmark-settings.hbs`, scrollable: [".vm-settings-body"] },
  };

  /** @override */
  async _prepareContext() {
    return {
      apiBaseUrl: setting("apiBaseUrl"),
      model: setting("model"),
      temperature: setting("temperature"),
      maxTokens: setting("maxTokens"),
      systemInstructions: setting("systemInstructions"),
    };
  }

  static async #onSubmit(_event, _form, formData) {
    const data = formData?.object ?? Object.fromEntries(formData ?? []);
    await game.settings.set(MODULE_ID, SETTINGS.apiBaseUrl, String(data.apiBaseUrl ?? "").trim());
    await game.settings.set(MODULE_ID, SETTINGS.model, String(data.model ?? "").trim());
    await game.settings.set(MODULE_ID, SETTINGS.temperature, Number(data.temperature));
    await game.settings.set(MODULE_ID, SETTINGS.maxTokens, Number(data.maxTokens));
    await game.settings.set(MODULE_ID, SETTINGS.systemInstructions, String(data.systemInstructions ?? ""));
    ui.notifications.info(loc("Settings.Saved"));
  }
}

function registerSettings() {
  game.settings.register(MODULE_ID, SETTINGS.enabled, {
    name: `${L}.Settings.Enabled.Name`, hint: `${L}.Settings.Enabled.Hint`,
    scope: "world", config: true, type: Boolean, default: true,
  });
  game.settings.register(MODULE_ID, SETTINGS.playerAccess, {
    name: `${L}.Settings.PlayerAccess.Name`, hint: `${L}.Settings.PlayerAccess.Hint`,
    scope: "world", config: true, type: Boolean, default: false,
  });
  game.settings.register(MODULE_ID, SETTINGS.apiBaseUrl, {
    name: `${L}.Settings.ApiBaseUrl.Name`, hint: `${L}.Settings.ApiBaseUrl.Hint`,
    scope: "world", config: true, type: String, default: "https://api.x.ai/v1",
  });
  game.settings.register(MODULE_ID, SETTINGS.apiKey, {
    name: `${L}.Settings.ApiKey.Name`, hint: `${L}.Settings.ApiKey.Hint`,
    scope: "world", config: true, type: String, default: "", secret: true,
  });
  game.settings.register(MODULE_ID, SETTINGS.model, {
    name: `${L}.Settings.Model.Name`, hint: `${L}.Settings.Model.Hint`,
    scope: "world", config: true, type: String, default: "grok-4.6",
  });
  game.settings.register(MODULE_ID, SETTINGS.temperature, {
    name: `${L}.Settings.Temperature.Name`, hint: `${L}.Settings.Temperature.Hint`,
    scope: "world", config: true, type: Number, default: 0.7,
    range: { min: 0, max: 2, step: 0.1 },
  });
  game.settings.register(MODULE_ID, SETTINGS.maxTokens, {
    name: `${L}.Settings.MaxTokens.Name`, hint: `${L}.Settings.MaxTokens.Hint`,
    scope: "world", config: true, type: Number, default: 1200,
    range: { min: 256, max: 4096, step: 64 },
  });
  game.settings.register(MODULE_ID, SETTINGS.systemInstructions, {
    name: `${L}.Settings.SystemInstructions.Name`, hint: `${L}.Settings.SystemInstructions.Hint`,
    scope: "world", config: false, type: String, default: DEFAULT_SYSTEM_INSTRUCTIONS,
  });
  game.settings.registerMenu(MODULE_ID, "voidmarkMenu", {
    name: `${L}.Settings.Menu.Name`,
    label: `${L}.Settings.Menu.Label`,
    hint: `${L}.Settings.Menu.Hint`,
    icon: "fa-solid fa-ghost",
    type: VoidmarkSettingsMenu,
    restricted: true,
  });
}

/* ---------- open / register ---------- */

export function openVoidmark() {
  if (!setting("enabled")) {
    notifyWarn("Errors.Disabled");
    return null;
  }
  if (!canOpenVoidmark()) {
    notifyWarn("Errors.Denied");
    return null;
  }
  const existing = foundry.applications.instances.get(VoidmarkChat.DEFAULT_OPTIONS.id);
  if (existing) return existing.render({ force: true });
  return new VoidmarkChat().render({ force: true });
}

function toggleVoidmark() {
  const existing = foundry.applications.instances.get(VoidmarkChat.DEFAULT_OPTIONS.id);
  if (existing?.rendered) return existing.close();
  return openVoidmark();
}

/** Register VOIDMARK: settings, scene control, keybinding, socket relay, module API. Call during init. */
export function registerVoidmark() {
  registerSettings();

  game.keybindings.register(MODULE_ID, "voidmarkChat", {
    name: `${L}.Keybinding`,
    editable: [],
    onDown: () => {
      toggleVoidmark();
      return true;
    },
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
  });

  Hooks.on("getSceneControlButtons", controls => {
    const tools = controls.tokens?.tools;
    if (!tools) return;
    tools.ghostwireVoidmark = {
      name: "ghostwireVoidmark",
      title: `${L}.Title`,
      icon: "fa-solid fa-ghost",
      order: Object.keys(tools).length,
      button: true,
      visible: canOpenVoidmark(),
      onChange: () => toggleVoidmark(),
    };
  });

  Hooks.once("ready", () => {
    game.socket.on(SOCKET, onSocket);
    const module = game.modules.get(MODULE_ID);
    if (module) {
      module.api = {
        ...(module.api ?? {}),
        openVoidmark,
        voidmark: { open: openVoidmark, retrieve, loadIndex, canOpenVoidmark, worldJournalChunks },
      };
    }
    game.ghostwire = { ...(game.ghostwire ?? {}), openVoidmark };
  });
}
