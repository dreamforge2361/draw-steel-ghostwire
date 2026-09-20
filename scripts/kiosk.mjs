// Scene kiosk merchant (B118): a placeable NPC Actor stub that sells curated gear for ¥.
// Choice: dedicated Actor (flags.draw-steel-ghostwire.kind === "kiosk") + linked token — not a Tile
// or Drawing. Matches Wired node / machine stubs so Directors can drop several named kiosks on one
// Scene (Mama’s Bar, ARG Lobby, street vendor). Inventory and range live on the Actor.
//
// Helpers below are Foundry-free so tools/kiosk-smoke.mjs can run them in Node.

export const MODULE_ID = "draw-steel-ghostwire";
export const KIOSK_ACTOR_ID = "GwKioskMerchant1";
export const KIOSK_UUID = `Compendium.${MODULE_ID}.summons.Actor.${KIOSK_ACTOR_ID}`;
export const DEFAULT_KIOSK_RANGE = 2;
export const CATALOG_PRICE_FLAGS = Object.freeze(["gear", "chrome", "matrix", "mod", "vehicle", "focus"]);
export const WEALTH_PATH = "system.hero.wealth";

const L = "GHOSTWIRE.Kiosk";
const FOLDER_FLAG = "kiosksFolder";

const gwFlags = doc => doc?.flags?.[MODULE_ID] ?? doc?.flags?.["draw-steel-ghostwire"] ?? {};

export function isKioskActor(actor) {
  return gwFlags(actor).kind === "kiosk";
}

export function isHeroActor(actor) {
  return actor?.type === "hero";
}

export function getWealth(actor) {
  const n = Number(actor?.system?.hero?.wealth);
  return Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0;
}

export function formatYen(price, locale = "en") {
  const n = Math.max(0, Math.floor(Number(price) || 0));
  const lang = (typeof game !== "undefined" && game.i18n?.lang) ? game.i18n.lang : locale;
  return `¥${n.toLocaleString(lang)}`;
}

export function newListingId() {
  const rnd = globalThis.foundry?.utils?.randomID;
  if (typeof rnd === "function") return rnd();
  return `k${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function normalizeInventory(raw) {
  if (!Array.isArray(raw)) return [];
  const rows = [];
  const seen = new Set();
  for (const row of raw) {
    const uuid = String(row?.uuid ?? "").trim();
    if (!uuid) continue;
    const priceRaw = row?.price;
    const hasOverride = priceRaw !== null && priceRaw !== undefined && priceRaw !== "";
    const price = hasOverride && Number.isFinite(Number(priceRaw)) ? Math.max(0, Math.floor(Number(priceRaw))) : null;
    const key = `${uuid}::${price ?? "catalog"}`;
    if (seen.has(key)) continue;
    seen.add(key);
    rows.push({ id: String(row?.id || newListingId()), uuid, price });
  }
  return rows;
}

export function readKioskConfig(actor) {
  const flags = gwFlags(actor);
  const parsed = Math.floor(Number(flags.range ?? DEFAULT_KIOSK_RANGE));
  const range = Number.isFinite(parsed) && parsed >= 0 ? parsed : DEFAULT_KIOSK_RANGE;
  return {
    kind: flags.kind ?? null,
    range,
    tagline: String(flags.tagline ?? ""),
    inventory: normalizeInventory(flags.inventory),
    merchantName: String(actor?.name || flags.merchantName || ""),
  };
}

export function catalogPrice(item) {
  const flags = gwFlags(item);
  for (const key of CATALOG_PRICE_FLAGS) {
    const n = Number(flags?.[key]?.price);
    if (Number.isFinite(n)) return Math.max(0, Math.floor(n));
  }
  return null;
}

export function listingPrice(listing, item) {
  if (listing && listing.price !== null && listing.price !== undefined && listing.price !== "") {
    const n = Number(listing.price);
    if (Number.isFinite(n)) return Math.max(0, Math.floor(n));
  }
  return catalogPrice(item) ?? 0;
}

export function planPurchase({ wealth, price }) {
  const w = Math.max(0, Math.floor(Number(wealth) || 0));
  const p = Math.max(0, Math.floor(Number(price) || 0));
  if (w < p) return { ok: false, reason: "insufficient", wealth: w, price: p, wealthAfter: w };
  return { ok: true, reason: null, wealth: w, price: p, wealthAfter: w - p };
}

/** Strip pack/world metadata so the copy can land on a hero inventory. */
export function itemCreateData(source) {
  if (!source || typeof source !== "object") return null;
  const raw = typeof source.toObject === "function" ? source.toObject() : source;
  const data = JSON.parse(JSON.stringify(raw));
  delete data._id;
  delete data._key;
  delete data.folder;
  delete data.sort;
  delete data._stats;
  if (Array.isArray(data.effects)) {
    data.effects = data.effects.map(effect => {
      const copy = { ...effect };
      delete copy._id;
      delete copy._key;
      return copy;
    });
  }
  data.ownership = { default: 0 };
  return data;
}

/**
 * Deduct ¥ and stamp an Item payload. No Foundry I/O — the live path calls this then writes.
 * @returns {{ok: boolean, reason: string|null, wealth: number, price: number, wealthAfter: number, item: object|null}}
 */
export function applyPurchase({ wealth, price, sourceItem }) {
  const plan = planPurchase({ wealth, price });
  if (!plan.ok) return { ...plan, item: null };
  const item = itemCreateData(sourceItem);
  if (!item) return { ok: false, reason: "no-item", wealth: plan.wealth, price: plan.price, wealthAfter: plan.wealth, item: null };
  return { ...plan, item };
}

export function purchaseChatContent({ buyer, merchant, item, price }) {
  const yen = formatYen(price);
  const esc = value => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
  return `<p><strong>${esc(buyer)}</strong> taps ${esc(merchant)} and walks with <strong>${esc(item)}</strong> — ${esc(yen)} off the stick.</p>`;
}

/** Grid cells a token occupies (square grid). */
export function tokenCells(token, gridSize = 100) {
  const size = Number(gridSize) || 100;
  const width = Number(token?.width) || 1;
  const height = Number(token?.height) || 1;
  const x = Number(token?.x) || 0;
  const y = Number(token?.y) || 0;
  const col0 = Math.round(x / size);
  const row0 = Math.round(y / size);
  const cols = Math.max(1, Math.round(width));
  const rows = Math.max(1, Math.round(height));
  const cells = [];
  for (let i = 0; i < cols; i += 1) {
    for (let j = 0; j < rows; j += 1) cells.push({ i: col0 + i, j: row0 + j });
  }
  return cells;
}

export function chebyshevCells(a, b) {
  return Math.max(Math.abs(a.i - b.i), Math.abs(a.j - b.j));
}

/** Closest-cell Chebyshev distance in squares. Adjacent 1×1 tokens = 1. */
export function tokenDistanceSquares(tokenA, tokenB, gridSize = 100) {
  const a = tokenCells(tokenA, gridSize);
  const b = tokenCells(tokenB, gridSize);
  let min = Infinity;
  for (const ac of a) {
    for (const bc of b) min = Math.min(min, chebyshevCells(ac, bc));
  }
  return min;
}

export function isWithinKioskRange(buyerToken, kioskToken, range = DEFAULT_KIOSK_RANGE, gridSize = 100) {
  const r = Math.max(0, Math.floor(Number(range) || 0));
  return tokenDistanceSquares(buyerToken, kioskToken, gridSize) <= r;
}

export function tokensForActor(actor, scene) {
  const id = actor?.id;
  if (!id) return [];
  const tokens = scene?.tokens;
  if (!tokens) return [];
  if (typeof tokens.filter === "function") return tokens.filter(token => token.actorId === id);
  if (typeof tokens.values === "function") return [...tokens.values()].filter(token => token.actorId === id);
  return [];
}

export function isBuyerInRange(buyer, kiosk, scene, { range, gridSize } = {}) {
  const cfg = readKioskConfig(kiosk);
  const r = range ?? cfg.range ?? DEFAULT_KIOSK_RANGE;
  const size = gridSize ?? scene?.grid?.size ?? 100;
  const buyers = tokensForActor(buyer, scene);
  const kiosks = tokensForActor(kiosk, scene);
  if (!buyers.length || !kiosks.length) return false;
  return buyers.some(bt => kiosks.some(kt => isWithinKioskRange(bt, kt, r, size)));
}

export function browseGate({ user, kiosk, scene, heroes = [] } = {}) {
  if (user?.isGM) return { ok: true, reason: null, buyers: heroes.filter(isHeroActor) };
  const unique = [];
  const seen = new Set();
  for (const hero of heroes) {
    if (!isHeroActor(hero) || !hero?.id || seen.has(hero.id)) continue;
    seen.add(hero.id);
    unique.push(hero);
  }
  if (!unique.length) return { ok: false, reason: "no-buyer", buyers: [] };
  const inRange = unique.filter(hero => isBuyerInRange(hero, kiosk, scene));
  if (!inRange.length) return { ok: false, reason: "out-of-range", buyers: unique };
  return { ok: true, reason: null, buyers: inRange };
}

/* ---------- Foundry registration (not imported by smoke) ---------- */

function loc(key, data) {
  return data ? game.i18n.format(`${L}.${key}`, data) : game.i18n.localize(`${L}.${key}`);
}

function sceneOf(kiosk) {
  return canvas?.scene ?? game.scenes?.viewed ?? null;
}

function ownedHeroes(user = game.user) {
  const rows = [];
  const seen = new Set();
  const add = actor => {
    if (!isHeroActor(actor) || seen.has(actor.id)) return;
    if (!user.isGM && !actor.isOwner) return;
    seen.add(actor.id);
    rows.push(actor);
  };
  for (const token of canvas?.tokens?.controlled ?? []) add(token.actor);
  add(user.character);
  for (const token of sceneOf()?.tokens ?? []) add(token.actor);
  if (user.isGM) for (const actor of game.actors) add(actor);
  return rows;
}

function gateFor(kiosk, user = game.user) {
  return browseGate({ user, kiosk, scene: sceneOf(kiosk), heroes: ownedHeroes(user) });
}

function foundryItemData(source) {
  if (source?.pack && game.items?.fromCompendium) {
    try {
      return game.items.fromCompendium(source, { clearFolder: true, keepId: false });
    } catch {
      // World items and odd pack copies fall through to the clone helper.
    }
  }
  if (typeof source?.toObject === "function") return itemCreateData(source);
  return itemCreateData(source);
}

export async function executePurchase({ kiosk, buyer, listing, source }) {
  if (!isHeroActor(buyer)) return { ok: false, reason: "not-hero", wealth: 0, price: 0, wealthAfter: 0 };
  if (!buyer.isOwner) return { ok: false, reason: "no-permission", wealth: getWealth(buyer), price: 0, wealthAfter: getWealth(buyer) };
  if (!game.user.isGM && !isBuyerInRange(buyer, kiosk, sceneOf(kiosk))) {
    return { ok: false, reason: "out-of-range", wealth: getWealth(buyer), price: 0, wealthAfter: getWealth(buyer) };
  }
  if (!source) return { ok: false, reason: "no-item", wealth: getWealth(buyer), price: 0, wealthAfter: getWealth(buyer) };
  const price = listingPrice(listing, source);
  const result = applyPurchase({ wealth: getWealth(buyer), price, sourceItem: foundryItemData(source) ?? source });
  if (!result.ok) return result;
  const [created] = await buyer.createEmbeddedDocuments("Item", [result.item]);
  try {
    await buyer.update({ [WEALTH_PATH]: result.wealthAfter });
  } catch (error) {
    if (created) await created.delete();
    throw error;
  }
  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: buyer }),
    content: game.i18n.format(`${L}.Chat.Purchased`, {
      buyer: buyer.name,
      merchant: kiosk?.name ?? loc("DefaultName"),
      item: source.name,
      price: formatYen(result.price),
    }),
  });
  ui.notifications.info(loc("Purchased", {
    buyer: buyer.name,
    item: source.name,
    merchant: kiosk?.name ?? loc("DefaultName"),
    price: formatYen(result.price),
  }));
  return { ...result, created: true };
}

async function kioskFolder() {
  return game.folders.find(f => (f.type === "Actor") && f.getFlag(MODULE_ID, FOLDER_FLAG))
    ?? Folder.create({ name: loc("Folder"), type: "Actor", flags: { [MODULE_ID]: { [FOLDER_FLAG]: true } } });
}

function placementOnView() {
  const grid = canvas.grid.size;
  const snap = value => Math.round(value / grid) * grid;
  const x = snap(canvas.stage.pivot.x - (grid / 2));
  const y = snap(canvas.stage.pivot.y - (grid / 2));
  let elevation = 0;
  let level = null;
  const current = canvas.level ?? null;
  if (current) {
    const bottom = Number(current.elevation?.bottom);
    elevation = Number.isFinite(bottom) ? bottom : (Number(current.elevation) || 0);
    level = current.id ?? null;
  }
  return { x, y, elevation, level };
}

export async function placeKiosk({ name } = {}) {
  if (!game.user.isGM) return null;
  const viewed = canvas.scene;
  if (!viewed) return ui.notifications.warn(loc("NoScene"));
  const template = await fromUuid(KIOSK_UUID);
  if (!template) return ui.notifications.error(loc("NoTemplate"));
  const data = game.actors.fromCompendium(template);
  const merchant = name || loc("DefaultName");
  foundry.utils.mergeObject(data, {
    name: merchant,
    folder: (await kioskFolder())?.id ?? null,
    ownership: { default: CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER },
    "prototypeToken.name": merchant,
    "prototypeToken.actorLink": true,
    "prototypeToken.displayName": CONST.TOKEN_DISPLAY_MODES.ALWAYS,
    [`flags.${MODULE_ID}`]: { kind: "kiosk", range: DEFAULT_KIOSK_RANGE, tagline: "", inventory: [] },
  });
  const actor = await Actor.create(data);
  if (!actor) return null;
  const { x, y, elevation, level } = placementOnView();
  const tokenData = { x, y, elevation, actorLink: true, name: merchant, displayName: CONST.TOKEN_DISPLAY_MODES.ALWAYS };
  if (level) tokenData.level = level;
  const tokenDocument = await actor.getTokenDocument(tokenData, { parent: viewed });
  await viewed.createEmbeddedDocuments("Token", [tokenDocument.toObject()]);
  ui.notifications.info(loc("Placed", { name: merchant }));
  return actor;
}

let KioskShop = null;

function defineKioskShop() {
  const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
  return class GhostwireKioskShop extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
      id: "ghostwire-kiosk",
      classes: ["ghostwire-kiosk"],
      window: { title: `${L}.Title`, icon: "fa-solid fa-cash-register", resizable: true },
      position: { width: 520, height: 640 },
      actions: {
        buy: GhostwireKioskShop.#onBuy,
        addRow: GhostwireKioskShop.#onAddRow,
        removeRow: GhostwireKioskShop.#onRemoveRow,
        openSheet: GhostwireKioskShop.#onOpenSheet,
      },
    };

    static PARTS = {
      shop: {
        template: `modules/${MODULE_ID}/templates/kiosk.hbs`,
        scrollable: [".gw-kiosk-stock"],
      },
    };

    actorUuid = null;
    buyerUuid = null;

    setKiosk(actor) {
      this.actorUuid = actor?.uuid ?? null;
      return this;
    }

    get kiosk() {
      return this.actorUuid ? fromUuidSync(this.actorUuid) : null;
    }

    /** @override */
    get title() {
      return this.kiosk?.name || loc("Title");
    }

    /** @override */
    async _prepareContext() {
      const kiosk = this.kiosk;
      const isGM = game.user.isGM;
      if (!kiosk || !isKioskActor(kiosk)) return { missing: true, hint: loc("NoTemplate") };
      const cfg = readKioskConfig(kiosk);
      const gate = gateFor(kiosk);
      const heroes = (isGM ? ownedHeroes() : gate.buyers).filter(isHeroActor);
      if (!this.buyerUuid || !heroes.some(h => h.uuid === this.buyerUuid)) {
        this.buyerUuid = heroes[0]?.uuid ?? null;
      }
      const buyer = this.buyerUuid ? heroes.find(h => h.uuid === this.buyerUuid) ?? null : null;
      const listings = [];
      const inRangePreview = isGM || (buyer ? isBuyerInRange(buyer, kiosk, sceneOf(kiosk)) : gate.ok);
      for (const row of cfg.inventory) {
        const source = row.uuid ? await fromUuid(row.uuid).catch(() => null) : null;
        const catalog = source ? catalogPrice(source) : null;
        const price = listingPrice(row, source);
        const wealth = buyer ? getWealth(buyer) : 0;
        const missing = !source;
        listings.push({
          id: row.id,
          uuid: row.uuid,
          name: source?.name ?? loc("MissingItem"),
          img: source?.img ?? "icons/svg/item-bag.svg",
          price,
          priceLabel: formatYen(price),
          catalog,
          catalogLabel: catalog == null ? loc("NoPrice") : loc("CatalogPrice", { price: formatYen(catalog) }),
          override: row.price,
          overrideValue: row.price ?? "",
          missing,
          canAfford: !!buyer && wealth >= price,
          canBuy: !missing && !!buyer && inRangePreview,
        });
      }
      const inRange = inRangePreview;
      return {
        missing: false,
        isGM,
        name: kiosk.name,
        img: kiosk.img,
        tagline: cfg.tagline,
        range: cfg.range,
        stocked: loc("Stocked", { count: listings.length }),
        empty: !listings.length,
        listings,
        buyers: heroes.map(h => ({
          uuid: h.uuid,
          name: h.name,
          wealth: getWealth(h),
          wealthLabel: formatYen(getWealth(h)),
          selected: h.uuid === this.buyerUuid,
        })),
        buyerUuid: this.buyerUuid,
        buyerWealth: buyer ? formatYen(getWealth(buyer)) : "",
        inRange,
        rangeHint: loc("RangeHint"),
        dropHint: loc("DropHint"),
        infinite: loc("InfiniteStock"),
        hasSheet: isGM,
      };
    }

    /** @override */
    _onRender(context, options) {
      super._onRender(context, options);
      const root = this.element;
      if (!this._kioskDropBound) {
        this._kioskDropBound = true;
        root.addEventListener("dragover", event => event.preventDefault());
        root.addEventListener("drop", event => this.#onDrop(event));
      }
      root.querySelector("[data-buyer]")?.addEventListener("change", event => {
        this.buyerUuid = event.currentTarget.value || null;
        this.render();
      });
      if (context.isGM) {
        for (const input of root.querySelectorAll("[data-kiosk-field]")) {
          input.addEventListener("change", () => this.#saveConfig());
        }
        for (const input of root.querySelectorAll("[data-listing-price]")) {
          input.addEventListener("change", event => this.#savePrice(event.currentTarget));
        }
        for (const input of root.querySelectorAll("[data-listing-uuid]")) {
          input.addEventListener("change", event => this.#saveUuid(event.currentTarget));
        }
      }
    }

    async #saveConfig() {
      const kiosk = this.kiosk;
      if (!game.user.isGM || !kiosk) return;
      const name = this.element.querySelector("[name='merchantName']")?.value?.trim() || loc("DefaultName");
      const tagline = this.element.querySelector("[name='tagline']")?.value ?? "";
      const range = Math.max(0, Math.floor(Number(this.element.querySelector("[name='range']")?.value) || DEFAULT_KIOSK_RANGE));
      const updates = {
        [`flags.${MODULE_ID}.range`]: range,
        [`flags.${MODULE_ID}.tagline`]: tagline,
      };
      if (kiosk.name !== name) {
        updates.name = name;
        updates["prototypeToken.name"] = name;
      }
      await kiosk.update(updates);
      for (const token of tokensForActor(kiosk, sceneOf(kiosk))) {
        if (token.name !== name) await token.update({ name });
      }
    }

    async #writeInventory(inventory) {
      const kiosk = this.kiosk;
      if (!game.user.isGM || !kiosk) return;
      await kiosk.update({ [`flags.${MODULE_ID}.inventory`]: normalizeInventory(inventory) });
    }

    async #savePrice(input) {
      const kiosk = this.kiosk;
      if (!kiosk) return;
      const cfg = readKioskConfig(kiosk);
      const row = cfg.inventory.find(r => r.id === input.dataset.listingPrice);
      if (!row) return;
      const raw = input.value;
      row.price = raw === "" ? null : Math.max(0, Math.floor(Number(raw) || 0));
      await this.#writeInventory(cfg.inventory);
    }

    async #saveUuid(input) {
      const kiosk = this.kiosk;
      if (!kiosk) return;
      const cfg = readKioskConfig(kiosk);
      const row = cfg.inventory.find(r => r.id === input.dataset.listingUuid);
      if (!row) return;
      row.uuid = String(input.value ?? "").trim();
      await this.#writeInventory(cfg.inventory);
    }

    async #onDrop(event) {
      event.preventDefault();
      if (!game.user.isGM) return;
      let payload = null;
      try {
        payload = foundry.applications.ux.TextEditor.implementation.getDragEventData(event);
      } catch {
        try { payload = JSON.parse(event.dataTransfer.getData("text/plain") || "null"); } catch { payload = null; }
      }
      const uuid = payload?.uuid || (payload?.type === "Item" ? payload.uuid : null);
      if (!uuid) return;
      const kiosk = this.kiosk;
      const cfg = readKioskConfig(kiosk);
      if (cfg.inventory.some(row => row.uuid === uuid)) return;
      cfg.inventory.push({ id: newListingId(), uuid, price: null });
      await this.#writeInventory(cfg.inventory);
    }

    static async #onBuy(event, target) {
      const kiosk = this.kiosk;
      const listingId = target.dataset.listingId;
      const cfg = readKioskConfig(kiosk);
      const listing = cfg.inventory.find(row => row.id === listingId);
      if (!listing) return;
      const buyer = this.buyerUuid ? await fromUuid(this.buyerUuid) : null;
      if (!buyer) return ui.notifications.warn(loc("NoBuyer"));
      const source = await fromUuid(listing.uuid).catch(() => null);
      if (!source) return ui.notifications.warn(loc("NoItem"));
      const result = await executePurchase({ kiosk, buyer, listing, source });
      if (!result.ok) {
        if (result.reason === "insufficient") {
          ui.notifications.warn(loc("Insufficient", { name: buyer.name, price: formatYen(result.price), wealth: formatYen(result.wealth) }));
        } else if (result.reason === "out-of-range") {
          ui.notifications.warn(loc("OutOfRange", { name: kiosk.name, range: cfg.range }));
        } else if (result.reason === "not-hero") {
          ui.notifications.warn(loc("NotHero", { name: buyer.name }));
        } else if (result.reason === "no-permission") {
          ui.notifications.warn(loc("NoPermission"));
        } else if (result.reason === "no-item") {
          ui.notifications.warn(loc("NoItem"));
        }
        return;
      }
      this.render();
    }

    static async #onAddRow() {
      const kiosk = this.kiosk;
      if (!game.user.isGM || !kiosk) return;
      const cfg = readKioskConfig(kiosk);
      cfg.inventory.push({ id: newListingId(), uuid: "", price: null });
      await this.#writeInventory(cfg.inventory);
    }

    static async #onRemoveRow(event, target) {
      const kiosk = this.kiosk;
      if (!game.user.isGM || !kiosk) return;
      const id = target.dataset.listingId;
      const cfg = readKioskConfig(kiosk);
      await this.#writeInventory(cfg.inventory.filter(row => row.id !== id));
    }

    static async #onOpenSheet() {
      const kiosk = this.kiosk;
      if (!game.user.isGM || !kiosk) return;
      return kiosk.sheet.render({ force: true, ghostwireAllowKioskSheet: true });
    }
  };
}

function instance() {
  return foundry.applications.instances.get(KioskShop?.DEFAULT_OPTIONS?.id);
}

function rerender() {
  const app = instance();
  if (app?.rendered) app.render();
}

export function openKiosk(actor) {
  if (!actor || !isKioskActor(actor)) return null;
  const gate = gateFor(actor);
  if (!gate.ok) {
    const cfg = readKioskConfig(actor);
    ui.notifications.warn(gate.reason === "out-of-range"
      ? loc("OutOfRange", { name: actor.name, range: cfg.range })
      : loc("NoBuyer"));
    return null;
  }
  if (!KioskShop) KioskShop = defineKioskShop();
  let app = instance();
  if (!app) app = new KioskShop();
  app.setKiosk(actor);
  return app.render({ force: true });
}

function maybeRedirectKioskSheet(app) {
  const actor = app?.document ?? app?.actor;
  if (!isKioskActor(actor) || app.options?.ghostwireAllowKioskSheet) return;
  if ((KioskShop && app instanceof KioskShop) || app._ghostwireKioskRedirect) return;
  app._ghostwireKioskRedirect = true;
  queueMicrotask(() => {
    app.close?.();
    openKiosk(actor);
  });
}

function patchTokenDoubleClick() {
  const TokenClass = CONFIG.Token?.objectClass;
  if (!TokenClass?.prototype || TokenClass.prototype._ghostwireKioskClick) return;
  const original = TokenClass.prototype._onClickLeft2;
  TokenClass.prototype._ghostwireKioskClick = true;
  TokenClass.prototype._onClickLeft2 = function(event) {
    const actor = this.actor;
    if (isKioskActor(actor)) {
      event?.stopPropagation?.();
      openKiosk(actor);
      return;
    }
    return original?.call(this, event);
  };
}

function injectKioskHud(hud, html) {
  const actor = hud.object?.actor;
  if (!isKioskActor(actor)) return;
  const root = html?.rootElement ?? html?.[0] ?? html;
  if (!root?.querySelector) return;
  const col = root.querySelector(".col.right") ?? root.querySelector(".right");
  if (!col || col.querySelector(".ghostwire-kiosk-hud")) return;
  const btn = document.createElement("div");
  btn.className = "control-icon ghostwire-kiosk-hud";
  btn.dataset.tooltip = loc("Hud");
  btn.innerHTML = `<i class="fa-solid fa-cash-register"></i>`;
  btn.addEventListener("click", event => {
    event.preventDefault();
    openKiosk(actor);
  });
  col.appendChild(btn);
}

async function normalizeWorldKiosk(actor) {
  if (!game.user.isGM || !isKioskActor(actor)) return;
  const stats = actor._stats ?? {};
  if (stats.compendiumSource && actor.pack) return;
  const cfg = readKioskConfig(actor);
  const updates = {};
  if (actor.getFlag(MODULE_ID, "range") === undefined) updates[`flags.${MODULE_ID}.range`] = cfg.range;
  if (!Array.isArray(actor.getFlag(MODULE_ID, "inventory"))) updates[`flags.${MODULE_ID}.inventory`] = cfg.inventory;
  if (actor.getFlag(MODULE_ID, "tagline") === undefined) updates[`flags.${MODULE_ID}.tagline`] = "";
  const observer = CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER;
  if ((actor.ownership?.default ?? 0) < observer) updates["ownership.default"] = observer;
  if (!foundry.utils.isEmpty(updates)) await actor.update(updates);
}

export function registerKiosk() {
  Hooks.once("ready", () => {
    KioskShop = defineKioskShop();
    patchTokenDoubleClick();
    const module = game.modules.get(MODULE_ID);
    if (module) {
      module.api = {
        ...(module.api ?? {}),
        openKiosk,
        placeKiosk,
        executePurchase,
        isKioskActor,
        planPurchase,
        applyPurchase,
        listingPrice,
        catalogPrice,
        KIOSK_UUID,
      };
    }
    console.log(`${MODULE_ID} | Kiosk: scene merchant registered (Actor stub kind=kiosk)`);
  });

  Hooks.on("getSceneControlButtons", controls => {
    const tools = controls.tokens?.tools;
    if (!tools) return;
    tools.ghostwireKiosk = {
      name: "ghostwireKiosk",
      title: `${L}.Place`,
      icon: "fa-solid fa-cash-register",
      order: Object.keys(tools).length,
      button: true,
      visible: game.user.isGM,
      onChange: () => placeKiosk(),
    };
  });

  Hooks.on("renderTokenHUD", injectKioskHud);
  Hooks.on("renderActorSheet", maybeRedirectKioskSheet);
  Hooks.on("renderActorSheetV2", maybeRedirectKioskSheet);
  Hooks.on("renderApplicationV2", app => {
    if (app?.document instanceof Actor) maybeRedirectKioskSheet(app);
  });
  Hooks.on("createActor", actor => { if (isKioskActor(actor)) normalizeWorldKiosk(actor); });
  Hooks.on("updateActor", (actor, changes) => {
    if (!instance()?.rendered) return;
    if (isKioskActor(actor) || foundry.utils.hasProperty(changes, WEALTH_PATH)) rerender();
  });
  Hooks.on("createItem", item => { if (isHeroActor(item.parent)) rerender(); });
  Hooks.on("controlToken", rerender);
  Hooks.on("canvasReady", rerender);
}
