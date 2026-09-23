// F10 — Chest / Locker: player-locked storage on the map.
//
// Shape follows the scene kiosk (scripts/kiosk.mjs, B118): a placeable Actor stub carrying
// `flags.<module>.kind === "locker"`, opened by double-click or the token HUD, with a matching
// ApplicationV2 + Handlebars part. The crew reads it the same way they read a kiosk.
//
// What it is NOT: a shop. Nothing here reads or writes hero wealth, catalog ¥, or kiosk presets -- the smoke
// asserts the wealth path does not appear in this file at all.
// A locker moves Items between a hero's inventory and the locker's own inventory, both directions,
// in stack-sized piles. Deposit / withdraw only.
//
// Access (Michael 2026-09-22 lock): the **owner** (an Actor-ownership OWNER on the stub) or the
// Director opens it. Everyone else is refused unless the locker explicitly shares with them —
// a per-user share list (`flags.<module>.shared`) plus a one-switch `partyShare` for "the whole
// crew has a key". Proximity is deliberately NOT a gate: a locker is a lock, not a counter.
//
// Helpers above the "Foundry registration" divider are Foundry-free so tools/f10-locker-smoke.mjs
// can run them in Node.

const MODULE_ID = "draw-steel-ghostwire";
const L = "GHOSTWIRE.Locker";
const FOLDER_FLAG = "lockersFolder";

export const LOCKER_ACTOR_ID = "GwLockerStash001";
export const LOCKER_UUID = `Compendium.${MODULE_ID}.summons.Actor.${LOCKER_ACTOR_ID}`;
/** Core Foundry 14 always ships `icons/svg`; game-icons trees 404 on a stock install. */
export const LOCKER_TOKEN_ART = "icons/svg/chest.svg";
/** Item types a hero can stash. Class/ancestry/career paperwork stays on the sheet. */
export const STORABLE_TYPES = Object.freeze(["treasure", "equipment", "consumable", "item"]);

const gwFlags = doc => doc?.flags?.[MODULE_ID] ?? doc?.flags?.["draw-steel-ghostwire"] ?? {};

export function isLockerActor(actor) {
  return gwFlags(actor).kind === "locker";
}

export function isHeroActor(actor) {
  return actor?.type === "hero";
}

/** Chrome, kits, classes and the rest of a hero's build are not loot — they never leave the sheet. */
export function isStorableItem(item) {
  if (!item) return false;
  if (gwFlags(item).chrome) return false;
  if (gwFlags(item).grantedBy || item?.flags?.[MODULE_ID]?.grantedBy) return false;
  return STORABLE_TYPES.includes(item.type);
}

export function readLockerConfig(actor) {
  const flags = gwFlags(actor);
  const shared = Array.isArray(flags.shared) ? flags.shared.map(String).filter(Boolean) : [];
  return {
    kind: flags.kind ?? null,
    label: String(flags.label ?? actor?.name ?? ""),
    tagline: String(flags.tagline ?? ""),
    shared: [...new Set(shared)],
    partyShare: flags.partyShare === true,
    locked: flags.locked !== false,
  };
}

/**
 * Who may open this locker.
 *
 * @param {object} options
 * @param {{id: string, isGM: boolean}} options.user
 * @param {{ownership?: object}} options.locker      Actor (or plain stub) with Foundry ownership.
 * @param {object} options.config                    `readLockerConfig()` output.
 * @param {number} [options.ownerLevel]              CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER (3).
 * @returns {{ok: boolean, reason: string|null, via: string|null}}
 */
export function accessGate({ user, locker, config, ownerLevel = 3 } = {}) {
  if (!user) return { ok: false, reason: "no-user", via: null };
  if (user.isGM) return { ok: true, reason: null, via: "director" };
  const cfg = config ?? readLockerConfig(locker);
  const ownership = locker?.ownership ?? {};
  const level = Number(ownership[user.id] ?? ownership.default ?? 0);
  if (level >= ownerLevel) return { ok: true, reason: null, via: "owner" };
  if (!cfg.locked) return { ok: true, reason: null, via: "unlocked" };
  if (cfg.partyShare) return { ok: true, reason: null, via: "party" };
  if (cfg.shared.includes(user.id)) return { ok: true, reason: null, via: "shared" };
  return { ok: false, reason: "locked", via: null };
}

/** Clamp a requested pile against what is actually on the shelf. */
export function planTransfer({ available = 0, requested = 1 } = {}) {
  const have = Math.max(0, Math.floor(Number(available) || 0));
  const want = Math.max(1, Math.floor(Number(requested) || 1));
  if (!have) return { ok: false, reason: "empty", moved: 0, left: 0 };
  const moved = Math.min(have, want);
  return { ok: true, reason: null, moved, left: have - moved };
}

/** Strip pack/world metadata so a stashed copy can land on the other side clean. */
export function itemTransferData(source, quantity) {
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
  if (quantity !== undefined && data.system && ("quantity" in data.system)) {
    data.system.quantity = Math.max(1, Math.floor(Number(quantity) || 1));
  }
  data.ownership = { default: 0 };
  return data;
}

/**
 * Stack merge target: an identical SKU already on the destination.
 * Matches on `_dsid` when both have one, otherwise on name — the same rule the gear packs rely on.
 */
export function matchStack(items = [], source) {
  const dsid = source?.system?._dsid ?? null;
  const name = String(source?.name ?? "");
  return items.find(item => {
    if (!isStorableItem(item)) return false;
    if (dsid && item.system?._dsid) return item.system._dsid === dsid;
    return item.name === name;
  }) ?? null;
}

export const itemQuantity = item => {
  const n = Number(item?.system?.quantity);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
};

export function transferChatContent({ hero, locker, item, count, direction }) {
  const esc = value => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
  const verb = direction === "deposit" ? "stows" : "pulls";
  const prep = direction === "deposit" ? "into" : "from";
  return `<p><strong>${esc(hero)}</strong> ${verb} <strong>${esc(item)}</strong> ×${Math.max(1, Math.floor(Number(count) || 1))} ${prep} ${esc(locker)}.</p>`;
}

/* ============================================ Foundry registration (not imported by smoke) */

function loc(key, data) {
  return data ? game.i18n.format(`${L}.${key}`, data) : game.i18n.localize(`${L}.${key}`);
}

const OWNER = () => CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER;

function gateFor(locker, user = game.user) {
  return accessGate({ user, locker, config: readLockerConfig(locker), ownerLevel: OWNER() });
}

export function canOpenLocker(locker, user = game.user) {
  return isLockerActor(locker) && gateFor(locker, user).ok;
}

function sceneOf() {
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

/**
 * Move `count` of one Item from `from` to `to`, merging into an existing stack when there is one.
 * Used both directions — deposit is hero → locker, withdraw is locker → hero.
 */
export async function transferItem({ from, to, itemId, count = 1, direction = "deposit", locker, hero } = {}) {
  const source = from?.items?.get(itemId);
  if (!source) return { ok: false, reason: "no-item", moved: 0 };
  if (!isStorableItem(source)) return { ok: false, reason: "not-storable", moved: 0 };
  if (!from.isOwner || !to.isOwner) return { ok: false, reason: "no-permission", moved: 0 };
  const plan = planTransfer({ available: itemQuantity(source), requested: count });
  if (!plan.ok) return { ...plan };

  const stack = matchStack(to.items ?? [], source);
  if (stack) await stack.update({ "system.quantity": itemQuantity(stack) + plan.moved });
  else await to.createEmbeddedDocuments("Item", [itemTransferData(source, plan.moved)]);

  if (plan.left > 0) await source.update({ "system.quantity": plan.left });
  else await source.delete();

  await ChatMessage.create({
    speaker: hero ? ChatMessage.getSpeaker({ actor: hero }) : undefined,
    content: game.i18n.format(`${L}.Chat.${direction === "deposit" ? "Deposited" : "Withdrew"}`, {
      hero: hero?.name ?? loc("UnknownHero"),
      locker: locker?.name ?? loc("DefaultName"),
      item: source.name,
      count: plan.moved,
    }),
  });
  return { ok: true, reason: null, moved: plan.moved, left: plan.left };
}

async function lockerFolder() {
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

export async function promptPlaceLocker() {
  if (!game.user.isGM) return null;
  const heroes = ownedHeroes().filter(isHeroActor);
  const owners = [
    `<option value="">${loc("PlaceForm.NoOwner")}</option>`,
    ...game.users.filter(u => !u.isGM).map(u => `<option value="${u.id}">${foundry.utils.escapeHTML(u.name)}</option>`),
  ].join("");
  const data = await foundry.applications.api.DialogV2.input({
    window: { title: `${L}.Place`, icon: "fa-solid fa-box-archive" },
    content: `
      <p>${loc("PlaceForm.Hint")}</p>
      <div class="form-group"><label>${loc("PlaceForm.Name")}</label>
        <input type="text" name="name" placeholder="${loc("DefaultName")}"></div>
      <div class="form-group"><label>${loc("PlaceForm.Owner")}</label>
        <select name="owner">${owners}</select></div>
      <div class="form-group"><label>${loc("PlaceForm.PartyShare")}</label>
        <input type="checkbox" name="partyShare"></div>`,
    ok: { label: `${L}.PlaceConfirm`, icon: "fa-solid fa-plus" },
  });
  if (!data) return null;
  return placeLocker({ name: data.name, ownerId: data.owner || null, partyShare: !!data.partyShare, heroes });
}

export async function placeLocker({ name, ownerId = null, partyShare = false } = {}) {
  if (!game.user.isGM) return null;
  const viewed = canvas.scene;
  if (!viewed) return ui.notifications.warn(loc("NoScene"));
  const template = await fromUuid(LOCKER_UUID);
  if (!template) return ui.notifications.error(loc("NoTemplate"));
  const data = game.actors.fromCompendium(template);
  const label = String(name ?? "").trim() || loc("DefaultName");
  const ownership = { default: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE };
  if (ownerId) ownership[ownerId] = OWNER();
  foundry.utils.mergeObject(data, {
    name: label,
    img: LOCKER_TOKEN_ART,
    folder: (await lockerFolder())?.id ?? null,
    ownership,
    "prototypeToken.name": label,
    "prototypeToken.actorLink": true,
    "prototypeToken.displayName": CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,
    "prototypeToken.texture.src": LOCKER_TOKEN_ART,
    [`flags.${MODULE_ID}`]: { kind: "locker", label, tagline: "", shared: [], partyShare: !!partyShare, locked: true },
  });
  const actor = await Actor.create(data);
  if (!actor) return null;
  const { x, y, elevation, level } = placementOnView();
  const tokenData = {
    x, y, elevation, actorLink: true, name: label,
    displayName: CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,
    texture: { src: LOCKER_TOKEN_ART },
  };
  if (level) tokenData.level = level;
  const tokenDocument = await actor.getTokenDocument(tokenData, { parent: viewed });
  await viewed.createEmbeddedDocuments("Token", [tokenDocument.toObject()]);
  ui.notifications.info(loc("Placed", { name: label }));
  return actor;
}

let LockerSheet = null;

function defineLockerSheet() {
  const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
  return class GhostwireLocker extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
      id: "ghostwire-locker",
      classes: ["ghostwire-locker"],
      window: { title: `${L}.Title`, icon: "fa-solid fa-box-archive", resizable: true },
      position: { width: 560, height: 640 },
      actions: {
        deposit: GhostwireLocker.#onDeposit,
        withdraw: GhostwireLocker.#onWithdraw,
        toggleShare: GhostwireLocker.#onToggleShare,
        openSheet: GhostwireLocker.#onOpenSheet,
      },
    };

    static PARTS = {
      locker: {
        template: `modules/${MODULE_ID}/templates/locker.hbs`,
        scrollable: [".gw-locker-stock", ".gw-locker-carry"],
      },
    };

    actorUuid = null;
    heroUuid = null;

    setLocker(actor) {
      this.actorUuid = actor?.uuid ?? null;
      return this;
    }

    get locker() {
      return this.actorUuid ? fromUuidSync(this.actorUuid) : null;
    }

    get hero() {
      return this.heroUuid ? fromUuidSync(this.heroUuid) : null;
    }

    /** @override */
    get title() {
      return this.locker?.name || loc("Title");
    }

    #row(item) {
      return {
        id: item.id,
        name: item.name,
        img: item.img || "icons/svg/item-bag.svg",
        quantity: itemQuantity(item),
        type: game.i18n.has(`TYPES.Item.${item.type}`) ? game.i18n.localize(`TYPES.Item.${item.type}`) : item.type,
      };
    }

    /** @override */
    async _prepareContext() {
      const locker = this.locker;
      if (!locker || !isLockerActor(locker)) return { missing: true, hint: loc("NoTemplate") };
      const gate = gateFor(locker);
      if (!gate.ok) return { missing: false, denied: true, name: locker.name, hint: loc("Denied") };

      const cfg = readLockerConfig(locker);
      const heroes = ownedHeroes().filter(isHeroActor);
      if (!this.heroUuid || !heroes.some(h => h.uuid === this.heroUuid)) this.heroUuid = heroes[0]?.uuid ?? null;
      const hero = this.hero;

      const stock = (locker.items ?? []).filter(isStorableItem).map(item => this.#row(item));
      const carry = hero ? (hero.items ?? []).filter(isStorableItem).map(item => this.#row(item)) : [];
      const canWrite = locker.isOwner && !!hero?.isOwner;
      return {
        missing: false,
        denied: false,
        isGM: game.user.isGM,
        name: locker.name,
        img: locker.img,
        tagline: cfg.tagline,
        via: loc(`Via.${gate.via ?? "director"}`),
        partyShare: cfg.partyShare,
        shareLabel: loc(cfg.partyShare ? "Share.OnParty" : "Share.OffParty"),
        stock,
        carry,
        stockEmpty: !stock.length,
        carryEmpty: !carry.length,
        canWrite,
        readOnlyHint: canWrite ? "" : loc("ReadOnly"),
        heroes: heroes.map(h => ({ uuid: h.uuid, name: h.name, selected: h.uuid === this.heroUuid })),
        heroUuid: this.heroUuid,
        stockHeading: loc("StockHeading", { count: stock.length }),
        carryHeading: loc("CarryHeading", { name: hero?.name ?? loc("UnknownHero") }),
        dropHint: loc("DropHint"),
      };
    }

    /** @override */
    _onRender(context, options) {
      super._onRender(context, options);
      const root = this.element;
      root.querySelector("[data-hero]")?.addEventListener("change", event => {
        this.heroUuid = event.currentTarget.value || null;
        this.render();
      });
      if (!this._lockerDropBound) {
        this._lockerDropBound = true;
        root.addEventListener("dragover", event => event.preventDefault());
        root.addEventListener("drop", event => this.#onDrop(event));
      }
    }

    #count(target) {
      const input = this.element.querySelector(`[data-count="${target.dataset.itemId}"]`);
      return Math.max(1, Math.floor(Number(input?.value) || 1));
    }

    static async #onDeposit(event, target) {
      const locker = this.locker;
      const hero = this.hero;
      if (!locker || !hero) return ui.notifications.warn(loc("NoHero"));
      if (!gateFor(locker).ok) return ui.notifications.warn(loc("Denied"));
      const result = await transferItem({
        from: hero, to: locker, itemId: target.dataset.itemId, count: this.#count(target),
        direction: "deposit", locker, hero,
      });
      if (!result.ok) ui.notifications.warn(loc(`Errors.${result.reason}`));
      this.render();
    }

    static async #onWithdraw(event, target) {
      const locker = this.locker;
      const hero = this.hero;
      if (!locker || !hero) return ui.notifications.warn(loc("NoHero"));
      if (!gateFor(locker).ok) return ui.notifications.warn(loc("Denied"));
      const result = await transferItem({
        from: locker, to: hero, itemId: target.dataset.itemId, count: this.#count(target),
        direction: "withdraw", locker, hero,
      });
      if (!result.ok) ui.notifications.warn(loc(`Errors.${result.reason}`));
      this.render();
    }

    static async #onToggleShare() {
      const locker = this.locker;
      if (!game.user.isGM || !locker) return;
      const cfg = readLockerConfig(locker);
      await locker.update({ [`flags.${MODULE_ID}.partyShare`]: !cfg.partyShare });
      this.render();
    }

    static async #onOpenSheet() {
      const locker = this.locker;
      if (!game.user.isGM || !locker) return;
      return locker.sheet.render({ force: true, ghostwireAllowLockerSheet: true });
    }

    /** Drag an Item straight onto the panel to stash it (Director convenience / loot drop). */
    async #onDrop(event) {
      event.preventDefault();
      const locker = this.locker;
      if (!locker || !gateFor(locker).ok || !locker.isOwner) return;
      let payload = null;
      try {
        payload = foundry.applications.ux.TextEditor.implementation.getDragEventData(event);
      } catch {
        try { payload = JSON.parse(event.dataTransfer.getData("text/plain") || "null"); } catch { payload = null; }
      }
      if (payload?.type !== "Item" || !payload.uuid) return;
      const source = await fromUuid(payload.uuid).catch(() => null);
      if (!source || !isStorableItem(source)) return ui.notifications.warn(loc("Errors.not-storable"));
      const parent = source.parent;
      if (parent instanceof Actor && isHeroActor(parent)) {
        await transferItem({
          from: parent, to: locker, itemId: source.id, count: itemQuantity(source),
          direction: "deposit", locker, hero: parent,
        });
      } else {
        await locker.createEmbeddedDocuments("Item", [itemTransferData(source)]);
      }
      this.render();
    }
  };
}

function instance() {
  return foundry.applications.instances.get(LockerSheet?.DEFAULT_OPTIONS?.id);
}

function rerender() {
  const app = instance();
  if (app?.rendered) app.render();
}

export function openLocker(actor) {
  if (!actor || !isLockerActor(actor)) return null;
  const gate = gateFor(actor);
  if (!gate.ok) {
    ui.notifications.warn(loc("Denied"));
    return null;
  }
  if (!LockerSheet) LockerSheet = defineLockerSheet();
  let app = instance();
  if (!app) app = new LockerSheet();
  app.setLocker(actor);
  return app.render({ force: true });
}

function maybeRedirectLockerSheet(app) {
  const actor = app?.document ?? app?.actor;
  if (!isLockerActor(actor) || app.options?.ghostwireAllowLockerSheet) return;
  if ((LockerSheet && app instanceof LockerSheet) || app._ghostwireLockerRedirect) return;
  app._ghostwireLockerRedirect = true;
  queueMicrotask(() => {
    app.close?.();
    openLocker(actor);
  });
}

function patchTokenDoubleClick() {
  const TokenClass = CONFIG.Token?.objectClass;
  if (!TokenClass?.prototype || TokenClass.prototype._ghostwireLockerClick) return;
  const original = TokenClass.prototype._onClickLeft2;
  TokenClass.prototype._ghostwireLockerClick = true;
  TokenClass.prototype._onClickLeft2 = function(event) {
    const actor = this.actor;
    if (isLockerActor(actor)) {
      event?.stopPropagation?.();
      openLocker(actor);
      return;
    }
    return original?.call(this, event);
  };
}

function injectLockerHud(hud, html) {
  const actor = hud.object?.actor;
  if (!isLockerActor(actor)) return;
  const root = html?.rootElement ?? html?.[0] ?? html;
  if (!root?.querySelector) return;
  const col = root.querySelector(".col.right") ?? root.querySelector(".right");
  if (!col || col.querySelector(".ghostwire-locker-hud")) return;
  const btn = document.createElement("div");
  btn.className = "control-icon ghostwire-locker-hud";
  btn.dataset.tooltip = loc("Hud");
  btn.innerHTML = `<i class="fa-solid fa-box-archive"></i>`;
  btn.addEventListener("click", event => {
    event.preventDefault();
    openLocker(actor);
  });
  col.appendChild(btn);
}

async function normalizeWorldLocker(actor) {
  if (!game.user.isGM || !isLockerActor(actor)) return;
  const stats = actor._stats ?? {};
  if (stats.compendiumSource && actor.pack) return;
  const flags = gwFlags(actor);
  const updates = {};
  if (!Array.isArray(flags.shared)) updates[`flags.${MODULE_ID}.shared`] = [];
  if (flags.partyShare === undefined) updates[`flags.${MODULE_ID}.partyShare`] = false;
  if (flags.locked === undefined) updates[`flags.${MODULE_ID}.locked`] = true;
  if (!foundry.utils.isEmpty(updates)) await actor.update(updates);
}

export function registerLocker() {
  Hooks.once("ready", () => {
    LockerSheet = defineLockerSheet();
    patchTokenDoubleClick();
    const module = game.modules.get(MODULE_ID);
    if (module) {
      module.api = {
        ...(module.api ?? {}),
        locker: {
          openLocker,
          placeLocker,
          promptPlaceLocker,
          transferItem,
          canOpenLocker,
          accessGate,
          isLockerActor,
          readLockerConfig,
          LOCKER_UUID,
        },
      };
    }
    if (game.user.isGM) {
      for (const actor of game.actors) if (isLockerActor(actor)) normalizeWorldLocker(actor);
    }
    console.log(`${MODULE_ID} | F10 Locker: player-locked stash registered (Actor stub kind=locker)`);
  });

  Hooks.on("getSceneControlButtons", controls => {
    const tools = controls.tokens?.tools;
    if (!tools) return;
    tools.ghostwireLocker = {
      name: "ghostwireLocker",
      title: `${L}.Place`,
      icon: "fa-solid fa-box-archive",
      order: Object.keys(tools).length,
      button: true,
      visible: game.user.isGM,
      onChange: () => promptPlaceLocker(),
    };
  });

  Hooks.on("renderTokenHUD", injectLockerHud);
  Hooks.on("renderActorSheet", maybeRedirectLockerSheet);
  Hooks.on("renderActorSheetV2", maybeRedirectLockerSheet);
  Hooks.on("renderApplicationV2", app => {
    if (app?.document instanceof Actor) maybeRedirectLockerSheet(app);
  });
  Hooks.on("createActor", actor => { if (isLockerActor(actor)) normalizeWorldLocker(actor); });
  Hooks.on("createItem", item => { if (item.parent instanceof Actor) rerender(); });
  Hooks.on("deleteItem", item => { if (item.parent instanceof Actor) rerender(); });
  Hooks.on("updateItem", item => { if (item.parent instanceof Actor) rerender(); });
  Hooks.on("controlToken", rerender);
}
