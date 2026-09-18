// B40 — ability / weapon / gear sound effects.
//
// Fire point (verified against Draw Steel 1.1.2, not guessed): the system emits no ability-use hook.
// `DrawSteelAbility#use()` (draw-steel.mjs ~6336) finishes by creating a ChatMessage of type
// "standard" whose `system.parts` holds a part with `type: "abilityUse"` and `abilityUuid` pointing
// at the ability Item. So `createChatMessage` + that part is the one reliable signal, and it covers
// everything used from a sheet — class abilities, weapon attacks and gear-driven abilities alike.
// (The follow-up "abilityResult" part carries the power roll; we deliberately fire on use, not result.)
//
// Sounds resolve in this order: the item's own flag → the keyword/name map in
// scripts/data/sfx-map.json → the map's default. Every shipped path is a Foundry core sound; no
// audio binary ships with this module.
const MODULE_ID = "draw-steel-ghostwire";
const MAP_PATH = `modules/${MODULE_ID}/scripts/data/sfx-map.json`;
const FLAG = "sfx";
const L = "GHOSTWIRE.Sfx";

let SFX_MAP = { default: "sounds/notify.wav", rules: [] };

/* -------------------------------------------- settings */

function registerSettings() {
  game.settings.register(MODULE_ID, "sfxEnabled", {
    name: `${L}.Settings.Enabled.Name`, hint: `${L}.Settings.Enabled.Hint`,
    scope: "world", config: true, type: Boolean, default: true,
  });
  game.settings.register(MODULE_ID, "sfxVolume", {
    name: `${L}.Settings.Volume.Name`, hint: `${L}.Settings.Volume.Hint`,
    scope: "client", config: true, type: Number, default: 0.8,
    range: { min: 0, max: 1, step: 0.05 },
  });
  game.settings.register(MODULE_ID, "sfxGmOnly", {
    name: `${L}.Settings.GmOnly.Name`, hint: `${L}.Settings.GmOnly.Hint`,
    scope: "world", config: true, type: Boolean, default: false,
  });
}

/* -------------------------------------------- resolution */

/** The item's own override, if a Director set one with the FilePicker on its sheet. */
function overrideSrc(item) {
  const src = item?.getFlag?.(MODULE_ID, FLAG)?.src;
  return typeof src === "string" && src.trim() ? src.trim() : null;
}

/**
 * First matching rule wins: an ability keyword match, else a name match.
 * @param {Item} item
 * @returns {{src: string, rule: string}}
 */
export function resolveSfx(item) {
  const override = overrideSrc(item);
  if (override) return { src: override, rule: "item override" };

  const keywords = new Set(item?.system?.keywords ?? []);
  const name = String(item?.name ?? "");
  for (const rule of SFX_MAP.rules ?? []) {
    const needKw = rule.keywords ?? [];
    const byKeyword = needKw.length ? needKw.some(k => keywords.has(k)) : false;
    const byName = rule.match ? new RegExp(rule.match, "i").test(name) : false;
    // If the rule has a name pattern, the name MUST match; keywords then only filter.
    // Keyword-only rules (no match) still fire on keyword alone.
    const hit = rule.match ? (byName && (!needKw.length || byKeyword)) : byKeyword;
    if (!hit) continue;
    const srcs = Array.isArray(rule.srcs) && rule.srcs.length
      ? rule.srcs
      : (rule.src ? [rule.src] : []);
    if (!srcs.length) continue;
    const src = srcs.length === 1
      ? srcs[0]
      : srcs[Math.abs([...name].reduce((h, c) => ((h << 5) - h) + c.charCodeAt(0), 0)) % srcs.length];
    return { src, rule: rule.id };
  }
  return { src: SFX_MAP.default, rule: "default" };
}

/* -------------------------------------------- playback */

/**
 * Play one resolved sound. Uses the "interface" channel, so Foundry's own mute and interface-volume
 * controls apply for free. Only the client that created the message calls this; it then pushes the
 * sound to the other clients rather than each client reacting to the same message.
 */
function play(src, { gmOnly }) {
  if (!src) return;
  const volume = Number(game.settings.get(MODULE_ID, "sfxVolume") ?? 0.8);
  if (!(volume > 0)) return;

  if (!gmOnly) return foundry.audio.AudioHelper.play({ src, volume, loop: false, channel: "interface" }, true);

  // GM-only: push to GM clients, and play locally only if this client is one of them.
  const recipients = game.users.filter(u => u.isGM && u.active).map(u => u.id);
  if (!recipients.length) return;
  return foundry.audio.AudioHelper.play(
    { src, volume, loop: false, channel: "interface", autoplay: game.user.isGM },
    { recipients: recipients.filter(id => id !== game.user.id) },
  );
}

/**
 * The ability Item behind an "abilityUse" chat part, if it still resolves.
 *
 * `system.parts` is declared as a CollectionField, so at runtime it is a ModelCollection — a
 * Foundry Collection (Map), NOT a plain object. `Object.values()` on it returns nothing, which is
 * what silently broke playback in the first cut. Read `.contents` when present, and fall back to
 * object/array shapes for raw source data.
 */
function abilityFromMessage(message) {
  const parts = message?.system?.parts;
  if (!parts) return null;
  const list = Array.isArray(parts) ? parts : (parts.contents ?? Object.values(parts));

  // Pseudo-documents carry their type on the class (`static get TYPE()`), and on the instance.
  const part = list.find(p => (p?.type ?? p?.constructor?.TYPE) === "abilityUse" && p?.abilityUuid);
  if (!part) return null;

  // AbilityUsePart exposes a synchronous `ability` getter over fromUuidSync.
  try {
    return part.ability ?? fromUuidSync(part.abilityUuid) ?? null;
  } catch {
    return null;
  }
}

/* -------------------------------------------- item sheet override */

/** "Ghostwire SFX" block on an ability sheet: FilePicker path, preview, clear. */
function injectSheetControls(app, element) {
  const item = app.document;
  element.querySelector(".ghostwire-sfx")?.remove();
  if (item.type !== "ability" || !item.isOwner) return;

  const current = overrideSrc(item) ?? "";
  const { src: resolved, rule } = resolveSfx(item);

  const block = document.createElement("div");
  block.className = "ghostwire-sfx form-group";
  block.innerHTML = `
    <label>${game.i18n.localize(`${L}.Sheet.Label`)}</label>
    <div class="form-fields">
      <input type="text" class="ghostwire-sfx-src" value="${foundry.utils.escapeHTML(current)}"
             placeholder="${foundry.utils.escapeHTML(resolved ?? "")}">
      <button type="button" class="ghostwire-sfx-pick" data-tooltip="${game.i18n.localize(`${L}.Sheet.Pick`)}">
        <i class="fa-solid fa-file-audio"></i></button>
      <button type="button" class="ghostwire-sfx-play" data-tooltip="${game.i18n.localize(`${L}.Sheet.Preview`)}">
        <i class="fa-solid fa-play"></i></button>
      <button type="button" class="ghostwire-sfx-clear" data-tooltip="${game.i18n.localize(`${L}.Sheet.Clear`)}">
        <i class="fa-solid fa-rotate-left"></i></button>
    </div>
    <p class="hint">${game.i18n.format(`${L}.Sheet.Hint`, { rule })}</p>`;

  const input = block.querySelector(".ghostwire-sfx-src");
  const save = value => item.setFlag(MODULE_ID, FLAG, { src: value || null });

  block.querySelector(".ghostwire-sfx-pick").addEventListener("click", () => {
    new foundry.applications.apps.FilePicker.implementation({
      type: "audio",
      current: input.value || resolved,
      callback: path => { input.value = path; save(path); },
    }).browse();
  });
  block.querySelector(".ghostwire-sfx-play").addEventListener("click", () => {
    const src = input.value || resolved;
    if (src) foundry.audio.AudioHelper.play({ src, volume: Number(game.settings.get(MODULE_ID, "sfxVolume") ?? 0.8), loop: false, channel: "interface" }, false);
  });
  block.querySelector(".ghostwire-sfx-clear").addEventListener("click", () => { input.value = ""; save(null); });
  input.addEventListener("change", () => save(input.value));

  const anchor = element.querySelector(".tab.active .form-group:last-of-type") ?? element.querySelector(".window-content form") ?? element.querySelector(".window-content");
  anchor?.append(block);
}

/* -------------------------------------------- registration */

export function registerAbilitySfx() {
  registerSettings();

  Hooks.once("ready", async () => {
    try {
      SFX_MAP = await foundry.utils.fetchJsonWithTimeout(MAP_PATH);
    } catch (error) {
      console.error(`${MODULE_ID} | could not load ${MAP_PATH}; ability SFX disabled`, error);
      SFX_MAP = { default: null, rules: [] };
    }
  });

  // One client fires the sound: the one whose action created the message.
  // Set CONFIG.debug.ghostwireSfx = true in the console to trace resolution.
  Hooks.on("createChatMessage", (message, options, userId) => {
    const debug = CONFIG.debug?.ghostwireSfx;
    if (userId !== game.user.id) return;
    if (!game.settings.get(MODULE_ID, "sfxEnabled")) return;
    const gmOnly = game.settings.get(MODULE_ID, "sfxGmOnly");
    if (gmOnly && !game.user.isGM && !game.users.some(u => u.isGM && u.active)) return;

    const ability = abilityFromMessage(message);
    if (!ability) {
      if (debug) console.debug(`${MODULE_ID} | no abilityUse part on message`, message);
      return;
    }
    const { src, rule } = resolveSfx(ability);
    if (debug) console.debug(`${MODULE_ID} | ${ability.name} -> ${rule} -> ${src}`);
    play(src, { gmOnly });
  });

  Hooks.on("renderDrawSteelItemSheet", injectSheetControls);

  const module = game.modules.get(MODULE_ID);
  if (module) module.api = { ...(module.api ?? {}), resolveSfx, sfxMap: () => SFX_MAP };
}
