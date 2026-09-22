// 0.3.96 — Black Market sell (F9): the other half of the ¥ economy.
//
// The Gear kiosk (kiosk.mjs) is the buy — walk up, press Buy, ¥ comes off `system.hero.wealth` and an Item lands
// on the hero. F6 (director-wealth.mjs) is the Director's purse — pay and spend by fiat. Nothing turned *loot*
// back into ¥: a stripped deck, a drone the crew never flies, the armor off a downed corpsec. This file is that
// door. Pick owned Items, confirm, optionally haggle, and the Items leave the sheet while ¥ lands on it.
//
// Locks:
//   1. **List price is the catalog price.** `catalogPrice(item)` from kiosk.mjs — the gear / chrome / matrix /
//      mod / vehicle / focus `.price` flag, the same number the kiosk charges. A missing or 0 catalog price
//      **refuses the sale** with a named reason. Nothing here invents a price.
//   2. **Base payout is 50%** of list, floored to an integer ≥ 0. The street does not pay retail.
//   3. The optional **haggle** is one Draw Steel Power Roll and moves the percentage only:
//      low (tier 1) → 50%, middle (tier 2) → 55%, high (tier 3) → 60%. A hung haggle costs nothing but pride.
//   4. **One purse:** `WEALTH_PATH` from kiosk.mjs. There is no second wealth track.
//   5. Sellers are the hero's **owner** or the **Director**, and an Item is only sellable when it sits on that
//      hero and this user may delete it. Nothing else can be liquidated.
//
// Stacks: a line's list price is the catalog ¥ **times the quantity being sold**, so selling 3 of 5 grenades
// pays for three and leaves two on the sheet. `planSale` still takes one already-multiplied `listPrice` — the
// multiplication happens where the Item is read, not inside the math.
//
// Helpers above the Foundry section are Foundry-free so tools/black-market-smoke.mjs can check the math in Node.

import { WEALTH_PATH, catalogPrice, formatYen, getWealth } from "./kiosk.mjs";
import { actorAcceptsWealth, clampAmount, collectWealthTargets } from "./director-wealth.mjs";

export const MODULE_ID = "draw-steel-ghostwire";

/** The street's cut of list, before any haggle. Lock 2. */
export const BASE_SALE_PERCENT = 50;

/** Draw Steel tiers → the percentage of list the fence pays. Lock 3. */
export const SALE_TIER_PERCENT = Object.freeze({ 1: 50, 2: 55, 3: 60 });

/** The characteristics a haggle may be rolled on. Presence is the pitch; the others are angles. */
export const HAGGLE_CHARACTERISTICS = Object.freeze(["presence", "intuition", "reason"]);
export const DEFAULT_HAGGLE_CHARACTERISTIC = "presence";

const L = "GHOSTWIRE.BlackMarket";

/* -------------------------------------------- pure math */

/** `"2"` / `2` / `2.4` → 2; anything outside the Draw Steel 1–3 tiers (including no roll) → null. */
export function normalizeSaleTier(tier) {
  const n = Math.floor(Number(tier));
  return [1, 2, 3].includes(n) ? n : null;
}

/** A haggle characteristic, defaulting to the pitch. */
export const normalizeHaggleCharacteristic = key =>
  (HAGGLE_CHARACTERISTICS.includes(String(key)) ? String(key) : DEFAULT_HAGGLE_CHARACTERISTIC);

/**
 * The percentage of list a tier pays. No roll — and a hung roll — both pay the base 50%.
 * @param {number|null} tier
 * @returns {number} 50 | 55 | 60
 */
export function salePercentForTier(tier) {
  return SALE_TIER_PERCENT[normalizeSaleTier(tier)] ?? BASE_SALE_PERCENT;
}

/** How many of a stack this sale moves: an integer in 1…stock. A broken stock reads as 1. */
export function clampSaleQuantity(value, stock = 1) {
  const max = Math.max(1, Math.floor(Number(stock)) || 1);
  const want = Math.floor(Number(value));
  if (!Number.isFinite(want)) return max;
  return Math.min(max, Math.max(1, want));
}

/**
 * Price one sale line without touching an Actor or an Item.
 *
 * `ok` is false — and `payout` is 0 — when the list price is missing, unreadable or 0 (`"no-price"`). That is
 * the only refusal: a ¥1 SKU legitimately fences for ¥0, and the confirm dialog shows that before anything is
 * deleted.
 *
 * @param {object} options
 * @param {number|null} options.listPrice  The catalog ¥ of what is being sold (already × quantity).
 * @param {number|null} [options.tier]     The haggle Power Roll tier, or null for no haggle.
 * @returns {{ok: boolean, reason: string|null, listPrice: number, tier: number|null, percent: number, payout: number}}
 */
export function planSale({ listPrice, tier = null } = {}) {
  const t = normalizeSaleTier(tier);
  const percent = salePercentForTier(t);
  const list = Math.floor(Number(listPrice));
  if (!Number.isFinite(list) || list <= 0) {
    return { ok: false, reason: "no-price", listPrice: 0, tier: t, percent, payout: 0 };
  }
  const payout = Math.max(0, Math.floor((list * percent) / 100));
  return { ok: true, reason: null, listPrice: list, tier: t, percent, payout };
}

/**
 * Price a whole basket at one tier. Unpriced rows are refused individually and carried in `refused`, so the
 * seller is told which SKU has no catalog ¥ rather than having the whole sale fail.
 *
 * @param {object} options
 * @param {Array<{id?: string, uuid?: string, name?: string, listPrice?: number, quantity?: number}>} options.items
 * @param {number|null} [options.tier]
 * @returns {{ok: boolean, reason: string|null, tier: number|null, percent: number, payout: number,
 *            lines: object[], sold: object[], refused: object[]}}
 */
export function planSaleBatch({ items = [], tier = null } = {}) {
  const t = normalizeSaleTier(tier);
  const percent = salePercentForTier(t);
  const rows = Array.isArray(items) ? items : [];
  const lines = rows.map(entry => ({
    id: entry?.id ?? null,
    uuid: entry?.uuid ?? null,
    name: String(entry?.name ?? ""),
    quantity: Math.max(1, Math.floor(Number(entry?.quantity)) || 1),
    stock: Math.max(1, Math.floor(Number(entry?.stock ?? entry?.quantity)) || 1),
    ...planSale({ listPrice: entry?.listPrice, tier: t }),
  }));
  const sold = lines.filter(line => line.ok);
  const refused = lines.filter(line => !line.ok);
  const payout = sold.reduce((sum, line) => sum + line.payout, 0);
  const reason = sold.length ? null : (rows.length ? "no-price" : "no-items");
  return { ok: sold.length > 0, reason, tier: t, percent, payout, lines, sold, refused };
}

/** A sale only ever credits — this is the arithmetic that lands on the purse. */
export function previewSaleWealth({ wealth = 0, payout = 0 } = {}) {
  const have = clampAmount(wealth);
  const gain = clampAmount(payout);
  return { wealth: have, payout: gain, wealthAfter: have + gain };
}

/**
 * Who may liquidate: the hero's **owner**, or the **Director**. Anything without a purse is refused first.
 * @returns {{ok: boolean, reason: string|null}}
 */
export function canSell({ actor, isGM = false } = {}) {
  if (!actorAcceptsWealth(actor)) return { ok: false, reason: "not-hero" };
  if (!isGM && !actor?.isOwner) return { ok: false, reason: "no-permission" };
  return { ok: true, reason: null };
}

/** The Item must sit on this seller, and this user must be able to delete it. Lock 5. */
export function ownsSellableItem({ actor, item, isGM = false } = {}) {
  if (!actor || !item) return false;
  const actorId = actor.id ?? actor._id ?? null;
  const parent = item.parent ?? item.actor ?? null;
  const parentId = parent?.id ?? parent?._id ?? null;
  if (!actorId || !parentId || parentId !== actorId) return false;
  return isGM || item.isOwner === true;
}

/* -------------------------------------------- Foundry */

const loc = (key, data) => (data ? game.i18n.format(`${L}.${key}`, data) : game.i18n.localize(`${L}.${key}`));
const esc = value => foundry.utils.escapeHTML(String(value ?? ""));
const characteristicLabel = key => game.i18n.localize(`DRAW_STEEL.Actor.characteristics.${key}.full`);

/** Targeted tokens first, else selected — the Director Taint +1 collect, shared rather than copied. */
export const collectSaleTargets = collectWealthTargets;

/** True when the Item carries a catalog ¥ the street will pay for. */
export function hasListPrice(item) {
  const price = catalogPrice(item);
  return Number.isFinite(price) && price > 0;
}

/** How many of this Item sit on the sheet. Items with no quantity field are a stack of one. */
export function itemStock(item) {
  const n = Math.floor(Number(item?.system?.quantity));
  return Number.isFinite(n) && n > 0 ? n : 1;
}

/** Every Item on this hero this user could put on the street, priced or not. */
export function sellableItems(actor, { isGM = !!game.user?.isGM } = {}) {
  if (!actor?.items) return [];
  return [...actor.items].filter(item => ownsSellableItem({ actor, item, isGM }));
}

/**
 * `{ id, uuid, name, img, unitPrice, stock, quantity, listPrice }` rows for `planSaleBatch`.
 * `listPrice` is the catalog ¥ times the quantity this line sells — the multiplication lock.
 */
export function saleEntries(items = [], quantities = {}) {
  return items.map(item => {
    const unitPrice = catalogPrice(item) ?? 0;
    const stock = itemStock(item);
    const quantity = clampSaleQuantity(quantities?.[item.id], stock);
    return {
      id: item.id,
      uuid: item.uuid,
      name: item.name,
      img: item.img,
      unitPrice,
      stock,
      quantity,
      listPrice: unitPrice * quantity,
    };
  });
}

/** The hero this user is selling for when no actor was handed in: targeted, selected, their character, else the one hero they own. */
function defaultSeller() {
  const user = game.user;
  const picked = collectSaleTargets({
    targeted: [...(user?.targets ?? [])],
    controlled: [...(canvas?.tokens?.controlled ?? [])],
  }).filter(actorAcceptsWealth);
  if (picked.length) return picked[0];
  if (actorAcceptsWealth(user?.character)) return user.character;
  const owned = game.actors?.filter?.(actor => actorAcceptsWealth(actor) && actor.isOwner) ?? [];
  return owned.length === 1 ? owned[0] : null;
}

/**
 * One haggle Power Roll on the seller.
 * @returns {Promise<{rolled: boolean, tier: number|null}>} `rolled: false` when the roll dialog was dismissed —
 *          the caller treats that as a cancelled sale rather than silently fencing at 50%.
 */
async function rollHaggle(seller, characteristic) {
  const key = normalizeHaggleCharacteristic(characteristic);
  const title = loc("HaggleRollTitle", { actor: seller.name });
  const message = await seller.system?.rollCharacteristic?.(key, {}, { window: { title } }, { data: { title } });
  if (!message) return { rolled: false, tier: null };
  return { rolled: true, tier: normalizeSaleTier(message?.rolls?.[0]?.product) };
}

/** low | middle | high, or null when nobody haggled. */
export function saleOutcomeKey(tier) {
  const t = normalizeSaleTier(tier);
  return t ? ["low", "middle", "high"][t - 1] : null;
}

async function announce(seller, result) {
  const rows = result.sold
    .map(line => `<li>${esc(loc("ChatLine", {
      item: line.name,
      quantity: line.quantity,
      list: formatYen(line.listPrice),
      percent: line.percent,
      payout: formatYen(line.payout),
    }))}</li>`)
    .join("");
  const key = saleOutcomeKey(result.tier);
  const haggle = key
    ? `<p class="hint">${esc(loc("ChatHaggle", {
        characteristic: characteristicLabel(result.characteristic),
        outcome: loc(`Outcome.${key}`),
        percent: result.percent,
      }))}</p>`
    : `<p class="hint">${esc(loc("ChatNoHaggle", { percent: result.percent }))}</p>`;
  const content = `
      <div class="ghostwire-market-chat">
        <header>
          <i class="fa-solid fa-sack-dollar"></i>
          <span class="gw-market-kicker">${esc(loc("ChatTitle"))}</span>
        </header>
        <p>${esc(loc("ChatHeadline", {
          actor: seller.name,
          count: result.sold.length,
          payout: formatYen(result.payout),
          before: formatYen(result.wealth),
          after: formatYen(result.wealthAfter),
        }))}</p>
        <ul class="gw-market-lines">${rows}</ul>
        ${haggle}
      </div>`;
  await ChatMessage.implementation.create({
    speaker: ChatMessage.getSpeaker({ actor: seller }),
    content,
  });
  ui.notifications.info(loc("Notify", {
    actor: seller.name,
    count: result.sold.length,
    payout: formatYen(result.payout),
    after: formatYen(result.wealthAfter),
  }));
}

/** `[Item]` or `[{ item, quantity }]` → `[{ item, quantity }]`, quantities clamped to what is on the sheet. */
function normalizeSaleLines(rows = []) {
  const out = [];
  for (const row of rows) {
    const item = row?.item ?? row;
    if (!item?.id) continue;
    const stock = itemStock(item);
    out.push({ item, quantity: clampSaleQuantity(row?.item ? row.quantity : stock, stock), stock });
  }
  return out;
}

/**
 * Liquidate Items off one hero and credit the payout. The Items go first, then the ¥ — a failed purse write
 * puts every Item back, so a sale is never half-done.
 *
 * @param {object} options
 * @param {Actor} options.seller
 * @param {Array<Item|{item: Item, quantity: number}>} options.items  Embedded Items on `seller`. A bare Item
 *        sells its whole stack; `{ item, quantity }` sells part of one.
 * @param {number|null} [options.tier]           Haggle tier, or null for the base 50%.
 * @param {string} [options.characteristic]      Which characteristic the haggle was rolled on (chat only).
 * @param {boolean} [options.silent]             Skip the chat card and the notification.
 * @returns {Promise<object>} the `planSaleBatch` result plus `wealth`, `wealthAfter`, `actor` and `id`.
 */
export async function executeSale({ seller, items = [], tier = null, characteristic = null, silent = false } = {}) {
  const isGM = !!game.user?.isGM;
  const wealth = getWealth(seller);
  const base = {
    ...planSaleBatch({ items: [], tier }),
    wealth,
    wealthAfter: wealth,
    actor: seller?.name ?? "",
    id: seller?.id ?? null,
    characteristic: normalizeHaggleCharacteristic(characteristic),
  };

  const gate = canSell({ actor: seller, isGM });
  if (!gate.ok) {
    ui.notifications.warn(gate.reason === "not-hero"
      ? loc("NotHero", { actor: seller?.name ?? "" })
      : loc("NoPermission", { actor: seller?.name ?? "" }));
    return { ...base, ok: false, reason: gate.reason };
  }

  // Lock 5 again, at the write: never delete an Item that is not this hero's, whatever the caller passed.
  const asked = normalizeSaleLines(items);
  const lines = asked.filter(line => ownsSellableItem({ actor: seller, item: line.item, isGM }));
  if (lines.length !== asked.length) ui.notifications.warn(loc("NotOwnedItems"));

  const quantities = Object.fromEntries(lines.map(line => [line.item.id, line.quantity]));
  const result = planSaleBatch({ items: saleEntries(lines.map(line => line.item), quantities), tier });
  const info = { ...result, actor: seller.name, id: seller.id, characteristic: base.characteristic };
  if (!result.ok) {
    ui.notifications.warn(result.reason === "no-items" ? loc("NothingPicked") : loc("NoPrice"));
    return { ...info, wealth, wealthAfter: wealth };
  }
  if (result.refused.length) {
    ui.notifications.warn(loc("SkippedUnpriced", { items: result.refused.map(line => line.name).join(", ") }));
  }

  // A line that sells the whole stack deletes the Item; a partial line just decrements it.
  const byId = new Map(lines.map(line => [line.item.id, line]));
  const deletes = [];
  const updates = [];
  const restore = [];
  const revert = [];
  for (const sold of result.sold) {
    const line = byId.get(sold.id);
    if (!line) continue;
    if (sold.quantity >= line.stock) {
      deletes.push(line.item.id);
      restore.push(line.item.toObject());
    } else {
      updates.push({ _id: line.item.id, "system.quantity": line.stock - sold.quantity });
      revert.push({ _id: line.item.id, "system.quantity": line.stock });
    }
  }

  const purse = previewSaleWealth({ wealth, payout: result.payout });
  if (updates.length) await seller.updateEmbeddedDocuments("Item", updates);
  if (deletes.length) await seller.deleteEmbeddedDocuments("Item", deletes);
  try {
    await seller.update({ [WEALTH_PATH]: purse.wealthAfter });
  } catch (error) {
    if (restore.length) await seller.createEmbeddedDocuments("Item", restore, { keepId: true });
    if (revert.length) await seller.updateEmbeddedDocuments("Item", revert);
    throw error;
  }

  const final = { ...info, ...purse };
  if (!silent) await announce(seller, final);
  return final;
}

/** How many the seller asked for on one dialog row. Rows with a stack of one carry no box. */
function pickedQuantity(checkbox) {
  const box = checkbox.closest("li")?.querySelector(".gw-market-qty") ?? null;
  return box ? clampSaleQuantity(box.value, box.dataset.stock) : 1;
}

/** The confirm dialog: which Items, how many of each, whether to haggle, and on what. Null when dismissed. */
async function askSale(seller, rows, preset = new Set()) {
  const wealth = getWealth(seller);
  const div = document.createElement("div");
  const options = HAGGLE_CHARACTERISTICS
    .map(key => `<option value="${key}"${key === DEFAULT_HAGGLE_CHARACTERISTIC ? " selected" : ""}>${esc(characteristicLabel(key))}</option>`)
    .join("");
  const lines = rows.map(row => {
    const unit = planSale({ listPrice: row.unitPrice });
    const checked = preset.has(row.id) && unit.ok;
    const price = unit.ok
      ? loc("RowPrice", { list: formatYen(unit.listPrice), payout: formatYen(unit.payout) })
      : loc("RowNoPrice");
    const stack = row.stock > 1
      ? `<input type="number" class="gw-market-qty" name="qty-${esc(row.id)}" value="${row.stock}" min="1" max="${row.stock}" step="1" data-stock="${row.stock}"${unit.ok ? "" : " disabled"}>`
      : `<span class="gw-market-qty-fixed">×1</span>`;
    return `
      <li class="gw-market-row${unit.ok ? "" : " unpriced"}">
        <label>
          <input type="checkbox" name="items" value="${esc(row.id)}" data-unit-price="${unit.listPrice}"${unit.ok ? "" : " disabled"}${checked ? " checked" : ""}>
          <span class="gw-market-name">${esc(row.name)}</span>
          <span class="gw-market-price">${esc(price)}</span>
        </label>
        ${stack}
      </li>`;
  }).join("");
  // DialogV2 rejects a content <div> that carries any attribute and keeps only its innerHTML, so the
  // styling hook has to be an inner element rather than the wrapper itself.
  div.insertAdjacentHTML("beforeend", `
    <div class="ghostwire-market-dialog">
      <p class="hint">${esc(loc("Hint", { actor: seller.name, wealth: formatYen(wealth) }))}</p>
      <ul class="gw-market-list">${lines}</ul>
      <div class="form-group">
        <label><input type="checkbox" name="haggle"> ${esc(loc("Haggle"))}</label>
        <select name="characteristic" data-tooltip="${esc(loc("HaggleCharacteristic"))}">${options}</select>
      </div>
      <p class="gw-market-total" data-market-total></p>
      <p class="hint">${esc(loc("HaggleHint"))}</p>
    </div>`);

  return foundry.applications.api.DialogV2.prompt({
    window: { title: loc("Title"), icon: "fa-solid fa-sack-dollar" },
    position: { width: 480 },
    content: div,
    ok: {
      label: loc("Submit"),
      icon: "fa-solid fa-sack-dollar",
      callback: (event, button) => {
        const form = button.form;
        const picks = {};
        for (const input of form.querySelectorAll("input[name='items']:checked")) {
          picks[input.value] = pickedQuantity(input);
        }
        return {
          quantities: picks,
          haggle: !!form.elements.haggle?.checked,
          characteristic: normalizeHaggleCharacteristic(form.elements.characteristic?.value),
        };
      },
    },
    rejectClose: false,
    // The running total is the one thing a seller needs before they delete gear, so it updates live.
    render: (event, dialog) => {
      const root = dialog.element;
      const total = root.querySelector("[data-market-total]");
      const refresh = () => {
        const picked = [...root.querySelectorAll("input[name='items']:checked")].map(input => {
          const quantity = pickedQuantity(input);
          return { id: input.value, quantity, listPrice: Number(input.dataset.unitPrice) * quantity };
        });
        const flat = planSaleBatch({ items: picked, tier: null });
        const best = planSaleBatch({ items: picked, tier: 3 });
        total.textContent = root.querySelector("input[name='haggle']")?.checked
          ? loc("TotalHaggle", { count: flat.sold.length, payout: formatYen(flat.payout), best: formatYen(best.payout) })
          : loc("Total", { count: flat.sold.length, percent: flat.percent, payout: formatYen(flat.payout) });
      };
      for (const input of root.querySelectorAll("input[name='items'], input[name='haggle'], .gw-market-qty")) {
        input.addEventListener("change", refresh);
        input.addEventListener("input", refresh);
      }
      refresh();
    },
  });
}

/**
 * The Black Market door: pick a seller, pick Items, optionally haggle, sell.
 *
 * @param {object} [options]
 * @param {Actor} [options.actor]   Skip the seller collect (the token HUD and the Item menu pass one hero).
 * @param {Item[]} [options.items]  Pre-check these Items in the dialog (the Item context menu passes one).
 * @returns {Promise<object|null>} the `executeSale` result, or null when nothing was sold.
 */
export async function blackMarketPrompt({ actor = null, items = null } = {}) {
  const isGM = !!game.user?.isGM;
  const seller = actor ?? defaultSeller();
  if (!seller) {
    ui.notifications.warn(loc("NoSeller"));
    return null;
  }
  const gate = canSell({ actor: seller, isGM });
  if (!gate.ok) {
    ui.notifications.warn(gate.reason === "not-hero"
      ? loc("NotHero", { actor: seller.name })
      : loc("NoPermission", { actor: seller.name }));
    return null;
  }

  const stock = sellableItems(seller, { isGM });
  if (!stock.some(hasListPrice)) {
    ui.notifications.warn(loc("NoStock", { actor: seller.name }));
    return null;
  }
  const preset = new Set((items ?? []).map(item => item?.id).filter(Boolean));

  const answer = await askSale(seller, saleEntries(stock), preset);
  if (!answer) return null;
  const lines = stock
    .filter(item => answer.quantities[item.id] > 0)
    .map(item => ({ item, quantity: answer.quantities[item.id] }));
  if (!lines.length) {
    ui.notifications.warn(loc("NothingPicked"));
    return null;
  }

  let tier = null;
  if (answer.haggle) {
    const roll = await rollHaggle(seller, answer.characteristic);
    if (!roll.rolled) {
      ui.notifications.warn(loc("HaggleCancelled"));
      return null;
    }
    tier = roll.tier;
  }
  return executeSale({ seller, items: lines, tier, characteristic: answer.characteristic });
}

/** The Item context-menu door: open the prompt on that Item's hero with the Item pre-picked. */
export function sellItem(item) {
  return blackMarketPrompt({ actor: item?.parent ?? item?.actor ?? null, items: [item] });
}

/** Macro / keybinding entry point. */
export const blackMarketSellPrompt = () => blackMarketPrompt();

/* -------------------------------------------- registration */

/** Item context menu, a token HUD button, a scene-control tool, a keybinding and the API. Call during init. */
export function registerBlackMarket() {
  game.keybindings.register(MODULE_ID, "blackMarketSell", {
    name: `${L}.Keybinding`,
    editable: [],
    restricted: false,
    onDown: () => {
      blackMarketPrompt();
      return true;
    },
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
  });

  // Hero sheet: right-click an owned, priced Item chip → Black Market: Sell…
  Hooks.on("getDocumentListContextOptions", (app, menuItems) => {
    if (typeof app._getEmbeddedDocument !== "function") return;
    const sellable = target => {
      const item = app._getEmbeddedDocument(target);
      if (!item || !hasListPrice(item)) return null;
      const seller = item.parent ?? null;
      if (!actorAcceptsWealth(seller)) return null;
      return ownsSellableItem({ actor: seller, item, isGM: !!game.user?.isGM }) ? item : null;
    };
    menuItems.push({
      label: `${L}.Menu.Sell`,
      icon: "fa-solid fa-sack-dollar",
      visible: target => !!sellable(target),
      onClick: (event, target) => sellItem(sellable(target)),
    });
  });

  Hooks.on("getSceneControlButtons", controls => {
    const tools = controls.tokens?.tools;
    if (!tools) return;
    tools.ghostwireBlackMarket = {
      name: "ghostwireBlackMarket",
      title: `${L}.SceneTool`,
      icon: "fa-solid fa-sack-dollar",
      order: Object.keys(tools).length,
      button: true,
      visible: true,
      onChange: () => blackMarketPrompt(),
    };
  });

  // Token HUD: the hero's owner, or the Director, gets a sack on the right column.
  Hooks.on("renderTokenHUD", (hud, html) => {
    const actor = hud.object?.actor;
    if (!canSell({ actor, isGM: !!game.user?.isGM }).ok) return;
    const root = html?.rootElement ?? html?.[0] ?? html;
    if (!root?.querySelector) return;
    const col = root.querySelector(".col.right") ?? root.querySelector(".right");
    if (!col || col.querySelector(".ghostwire-black-market")) return;
    const btn = document.createElement("div");
    btn.className = "control-icon ghostwire-black-market";
    btn.dataset.tooltip = loc("Hud");
    btn.innerHTML = `<i class="fa-solid fa-sack-dollar"></i>`;
    btn.addEventListener("click", event => {
      event.preventDefault();
      blackMarketPrompt({ actor });
    });
    col.appendChild(btn);
  });

  Hooks.once("ready", () => {
    const module = game.modules.get(MODULE_ID);
    if (module) {
      module.api = {
        ...(module.api ?? {}),
        blackMarketPrompt,
        blackMarketSellPrompt,
        executeSale,
        sellItem,
        sellableItems,
        planSale,
        planSaleBatch,
        salePercentForTier,
        canSell,
      };
    }
    game.ghostwire = {
      ...(game.ghostwire ?? {}),
      blackMarketPrompt, blackMarketSellPrompt, executeSale, sellItem,
    };
  });

  console.log(`${MODULE_ID} | Black Market sell registered (${WEALTH_PATH}, base ${BASE_SALE_PERCENT}% of catalog)`);
}
