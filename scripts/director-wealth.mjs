// 0.3.95 — Director Pay / Spend Hero (F6): the Director-side purse tool.
//
// The Gear kiosk (kiosk.mjs) is the player's spend — walk up, press Buy, ¥ comes off `system.hero.wealth`.
// Nothing moved ¥ the other way: job pay, a fixer's cut, a bribe refunded, a fine levied at the table all had to
// be typed into the sheet by hand. This file is the Director's counterpart, built on the Director Taint +1 shape
// (taint.mjs): target or select hero tokens, press the tool, answer amount + reason, and the change lands with a
// chat card naming who, which way, how much, why, and the ¥ before → after.
//
// Locks:
//   1. Same wealth path as everything else — `WEALTH_PATH` from kiosk.mjs. There is no second purse.
//   2. Amounts are integers ≥ 0. **Pay always credits; spend refuses when the hero cannot cover it** — the
//      Director is told and nothing is written, because a hero's ¥ never goes negative.
//   3. GM only. A player pressing the API gets a notification and no write.
//
// Helpers above the Foundry section are Foundry-free so tools/director-wealth-smoke.mjs can check the math in Node.

import { WEALTH_PATH, formatYen, getWealth } from "./kiosk.mjs";
import { collectTaintTargets } from "./taint.mjs";

export const MODULE_ID = "draw-steel-ghostwire";
export const WEALTH_MODES = Object.freeze(["pay", "spend"]);

const L = "GHOSTWIRE.Wealth.Director";

/* -------------------------------------------- pure math */

/** `"1200"` / `1200.7` / `-5` / `null` → a non-negative integer. Anything unreadable is 0. */
export function clampAmount(value) {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, n);
}

/** pay | spend, defaulting to pay. */
export const normalizeMode = mode => (WEALTH_MODES.includes(String(mode)) ? String(mode) : "pay");

/** The signed change a mode makes: pay credits, spend debits. */
export const signFor = mode => ((normalizeMode(mode) === "spend") ? -1 : 1);

/**
 * Preview a Director wealth write without touching an Actor.
 *
 * `ok` is false — and `wealthAfter` equals `wealth` — when the amount is 0 (`"zero"`) or when a spend is larger
 * than the hero's purse (`"insufficient"`). A pay always lands.
 *
 * @param {object} options
 * @param {number} options.wealth   The hero's ¥ now.
 * @param {number} options.amount   The amount asked for (clamped to a non-negative integer).
 * @param {string} options.mode     pay | spend
 * @returns {{ok: boolean, reason: string|null, mode: string, amount: number, wealth: number,
 *            wealthAfter: number, delta: number}}
 */
export function previewWealthChange({ wealth = 0, amount = 0, mode = "pay" } = {}) {
  const m = normalizeMode(mode);
  const have = clampAmount(wealth);
  const value = clampAmount(amount);
  const no = reason => ({ ok: false, reason, mode: m, amount: value, wealth: have, wealthAfter: have, delta: 0 });
  if (value === 0) return no("zero");
  if ((m === "spend") && (value > have)) return no("insufficient");
  const delta = signFor(m) * value;
  return { ok: true, reason: null, mode: m, amount: value, wealth: have, wealthAfter: have + delta, delta };
}

/** A reason string trimmed to one chat-safe line, or "" when the Director gave none. */
export function normalizeReason(reason, { max = 160 } = {}) {
  return String(reason ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}

/** Only heroes carry `system.hero.wealth`; nothing else has a purse to move. */
export const actorAcceptsWealth = actor => actor?.type === "hero";

/* -------------------------------------------- Foundry */

const loc = (key, data) => (data ? game.i18n.format(`${L}.${key}`, data) : game.i18n.localize(`${L}.${key}`));
const esc = value => foundry.utils.escapeHTML(String(value ?? ""));

/** Targeted tokens first, else controlled — the Director Taint +1 collect, shared rather than copied. */
export function collectWealthTargets({ targeted = [], controlled = [] } = {}) {
  return collectTaintTargets({ targeted, controlled });
}

/** The heroes this press is aimed at: targeted tokens, else selected ones. */
function pickedHeroes() {
  const targeted = [...(game.user.targets ?? [])];
  const controlled = [...(canvas?.tokens?.controlled ?? [])];
  return collectWealthTargets({ targeted, controlled });
}

async function announce(actor, result, reason) {
  const data = {
    actor: actor.name,
    amount: formatYen(result.amount),
    before: formatYen(result.wealth),
    after: formatYen(result.wealthAfter),
    reason: reason || loc("NoReason"),
  };
  ui.notifications.info(loc(result.mode === "spend" ? "NotifySpend" : "NotifyPay", data));
  const content = `
      <div class="ghostwire-wealth-chat mode-${result.mode}">
        <header>
          <i class="fa-solid ${result.mode === "spend" ? "fa-money-bill-transfer" : "fa-hand-holding-dollar"}"></i>
          <span class="gw-wealth-kicker">${esc(loc(result.mode === "spend" ? "ChatTitleSpend" : "ChatTitlePay"))}</span>
        </header>
        <p>${esc(loc(result.mode === "spend" ? "ChatLineSpend" : "ChatLinePay", data))}</p>
        <p class="hint">${esc(loc("ChatReason", data))}</p>
      </div>`;
  await ChatMessage.implementation.create({
    speaker: { alias: loc("Speaker") },
    content,
  });
}

/**
 * Move one hero's ¥ and announce it. GM only.
 *
 * @param {object} options
 * @param {Actor} options.actor
 * @param {number} options.amount    Integer ≥ 0.
 * @param {string} [options.reason]
 * @param {string} [options.mode]    pay | spend
 * @param {boolean} [options.silent] Skip the chat card and the notification (used by the batch prompt's dry runs).
 * @returns {Promise<object>} the `previewWealthChange` result, with `actor` and `id`.
 */
export async function directorAdjustWealth({ actor, amount = 0, reason = "", mode = "pay", silent = false } = {}) {
  const m = normalizeMode(mode);
  const blank = previewWealthChange({ wealth: getWealth(actor), amount, mode: m });
  if (!game.user?.isGM) {
    ui.notifications.warn(loc("GMOnly"));
    return { ...blank, ok: false, reason: "not-gm", actor: actor?.name ?? "", id: actor?.id ?? null };
  }
  if (!actorAcceptsWealth(actor)) {
    ui.notifications.warn(loc("NotEligible", { actor: actor?.name ?? "" }));
    return { ...blank, ok: false, reason: "not-hero", actor: actor?.name ?? "", id: actor?.id ?? null };
  }

  const result = previewWealthChange({ wealth: getWealth(actor), amount, mode: m });
  const text = normalizeReason(reason);
  if (!result.ok) {
    if (result.reason === "insufficient") {
      ui.notifications.warn(loc("Insufficient", {
        actor: actor.name, amount: formatYen(result.amount), wealth: formatYen(result.wealth),
      }));
    } else if (result.reason === "zero") ui.notifications.warn(loc("NoAmount"));
    return { ...result, actor: actor.name, id: actor.id };
  }

  await actor.update({ [WEALTH_PATH]: result.wealthAfter });
  if (!silent) await announce(actor, result, text);
  return { ...result, actor: actor.name, id: actor.id, reason: text };
}

/** Credit a hero. `amount` is an integer ≥ 0; a pay always lands. */
export const directorPayHero = ({ actor, amount = 0, reason = "" } = {}) =>
  directorAdjustWealth({ actor, amount, reason, mode: "pay" });

/** Debit a hero. Refuses — with a notification and no write — when the purse cannot cover it. */
export const directorSpendHero = ({ actor, amount = 0, reason = "" } = {}) =>
  directorAdjustWealth({ actor, amount, reason, mode: "spend" });

/** Ask the Director for mode, amount and reason. Returns null when they cancel. */
async function askAmount(mode, heroes) {
  const m = normalizeMode(mode);
  const names = heroes.map(actor => `${actor.name} — ${formatYen(getWealth(actor))}`).join(", ");
  const options = WEALTH_MODES
    .map(key => `<option value="${key}"${key === m ? " selected" : ""}>${esc(loc(`Modes.${key}`))}</option>`)
    .join("");
  const content = `
      <p class="hint">${esc(loc("Targets", { heroes: names }))}</p>
      <div class="form-group">
        <label>${esc(loc("Mode"))}</label>
        <select name="mode">${options}</select>
      </div>
      <div class="form-group">
        <label>${esc(loc("Amount"))}</label>
        <input type="number" name="amount" min="0" step="1" value="0" autofocus>
      </div>
      <div class="form-group">
        <label>${esc(loc("Reason"))}</label>
        <input type="text" name="reason" placeholder="${esc(loc("ReasonPlaceholder"))}">
      </div>`;
  return foundry.applications.api.DialogV2.prompt({
    window: { title: loc("Title"), icon: "fa-solid fa-yen-sign" },
    content,
    ok: {
      label: loc("Submit"),
      icon: "fa-solid fa-yen-sign",
      callback: (event, button) => ({
        mode: button.form.elements.mode.value,
        amount: clampAmount(button.form.elements.amount.value),
        reason: normalizeReason(button.form.elements.reason.value),
      }),
    },
    rejectClose: false,
  });
}

/**
 * The Director tool: collect targeted / selected heroes, ask for mode + amount + reason, apply to each.
 * @param {object} [options]
 * @param {string} [options.mode]      Which way the dialog opens on.
 * @param {Actor[]} [options.actors]   Skip the token collect (the token HUD passes one hero).
 * @returns {Promise<object[]>} one result per hero touched.
 */
export async function directorWealthPrompt({ mode = "pay", actors = null } = {}) {
  if (!game.user?.isGM) {
    ui.notifications.warn(loc("GMOnly"));
    return [];
  }
  const heroes = (actors ?? pickedHeroes()).filter(Boolean);
  if (!heroes.length) {
    ui.notifications.warn(loc("NoTarget"));
    return [];
  }
  const eligible = heroes.filter(actor => {
    if (actorAcceptsWealth(actor)) return true;
    ui.notifications.warn(loc("NotEligible", { actor: actor.name }));
    return false;
  });
  if (!eligible.length) return [];

  const answer = await askAmount(mode, eligible);
  if (!answer) return [];

  const results = [];
  for (const actor of eligible) {
    results.push(await directorAdjustWealth({ actor, ...answer }));
  }
  return results;
}

/** Macro / keybinding entry points. */
export const directorPayPrompt = () => directorWealthPrompt({ mode: "pay" });
export const directorSpendPrompt = () => directorWealthPrompt({ mode: "spend" });

/* -------------------------------------------- registration */

/** GM scene-control tools, a token HUD button, a keybinding and the API. Call during init. */
export function registerDirectorWealth() {
  game.keybindings.register(MODULE_ID, "directorWealth", {
    name: `${L}.Keybinding`,
    editable: [],
    restricted: true,
    onDown: () => {
      directorWealthPrompt({ mode: "pay" });
      return true;
    },
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
  });

  // 0.3.137: the two Token toolbar buttons are gone. Pay and Spend are **Ghostwire Macros**
  // ("Director Pay Hero" / "Director Spend Hero", `src/packs/macros/director-{pay,spend}-hero.json`),
  // the keybinding registered above, and the yen sign on the Token HUD.

  Hooks.on("renderTokenHUD", (hud, html) => {
    if (!game.user.isGM) return;
    const actor = hud.object?.actor;
    if (!actorAcceptsWealth(actor)) return;
    const root = html?.rootElement ?? html?.[0] ?? html;
    if (!root?.querySelector) return;
    const col = root.querySelector(".col.right") ?? root.querySelector(".right");
    if (!col || col.querySelector(".ghostwire-wealth-director")) return;
    const btn = document.createElement("div");
    btn.className = "control-icon ghostwire-wealth-director";
    btn.dataset.tooltip = loc("Hud");
    btn.innerHTML = `<i class="fa-solid fa-yen-sign"></i>`;
    btn.addEventListener("click", event => {
      event.preventDefault();
      directorWealthPrompt({ mode: "pay", actors: [actor] });
    });
    col.appendChild(btn);
  });

  Hooks.once("ready", () => {
    const module = game.modules.get(MODULE_ID);
    if (module) {
      module.api = {
        ...(module.api ?? {}),
        directorPayHero,
        directorSpendHero,
        directorAdjustWealth,
        directorWealthPrompt,
        previewWealthChange,
        clampAmount,
        actorAcceptsWealth,
      };
    }
    game.ghostwire = {
      ...(game.ghostwire ?? {}),
      directorPayHero, directorSpendHero, directorAdjustWealth, directorWealthPrompt,
    };
  });

  console.log(`${MODULE_ID} | Director Pay / Spend Hero registered (${WEALTH_PATH})`);
}
