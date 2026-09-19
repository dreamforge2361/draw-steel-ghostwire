// B51 / B51b — a matrix payload loaded into a deck as a magazine gets a "Run {Payload}" ability.
//
// Same gap B49 closed for weapons (scripts/equipment-use.mjs): payloads (Zap, Crash, Whiteout, Ghostload, Static,
// Blackout, Wraith) are `treasure` with `flags.<module>.matrix.role: "payload"` — inventory only, nothing to
// use, so B40 never hears them. This spawns a linked ability shaped like the Hacker's Wired abilities
// (keywords ranged + wired, Reason power roll, distance special / Reach), which runs the normal ability
// pipeline, emits the `abilityUse` chat part, and hits B40's `wired` SFX rule by keyword.
//
// Suite programs and autosofts are NOT payloads: they stay Activate/Deactivate in scripts/mods.mjs.
//
// B51b magazine rule (docs/raw/21-the-wire.md, Deck software): a payload is a deck mod (mod.magazine) sharing
// the deck's slots with suites. A loose chip does nothing. Load magazine (Craft) rolls Reason (Hacking adds an
// edge) and installs the chip onto a deck with a free slot; the tier sets its quantity (fires): 1 / 3 / 5.
// Recompile magazine re-rolls an installed one and replaces its quantity.
//
// Quantity means chips while a payload is loose and fires while it is loaded. Loading takes one chip off a stack
// (the spares stay loose as a new stack), and a chip at 0 is spent and cannot be loaded. Unloading a magazine that
// still has fires (Uninstall, or its deck deleted) dumps them: quantity goes to 0, so a pulled magazine never turns
// back into a stack of raw chips.
//
// Link: the payload stores `useAbilityId`, the ability stores `fromPayloadId`. Run exists only while the payload
// is installed on a deck. Each successful Run spends one fire. At 0 the magazine unloads at once (its slot frees,
// the chip stays at quantity 0), but its Run ability is only flagged `spentMagazine` and refuses to fire: the
// chat card just posted still points at it. Spent abilities are cleared on the next `ready`, or reused if the
// chip is loaded again first.
import { getModData, getHostCatalog, installedHost, canInstall, installMod, uninstallMod, usedSlots } from "./mods.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const TEMPLATES_PATH = `modules/${MODULE_ID}/scripts/data/payload-use-templates.json`;
const L = "GHOSTWIRE.PayloadUse";

/** Fires a Load magazine roll puts in the slot, by power roll tier 1 / 2 / 3 (provisional, docs/raw/21-the-wire.md). */
const MAGAZINE_FIRES = [1, 3, 5];

/** The mod flag every payload carries (src/packs/matrix/payloads); backfilled on chips that predate B51b. */
const MAGAZINE_MOD = { slotCost: 1, hosts: ["deck"], host: "deck", craftSkill: ["hacking"], magazine: true };

let TEMPLATES = null;

/* -------------------------------------------- payload reading */

/** Is this a matrix payload? */
export function isPayload(item) {
  return item?.type === "treasure" && item?.flags?.[MODULE_ID]?.matrix?.role === "payload";
}

/** Is this payload installed on a deck as a magazine? */
export const isLoaded = payload => !!installedHost(payload);

const linkedAbilityId = item => item?.getFlag?.(MODULE_ID, "useAbilityId") ?? null;
const sourcePayloadId = ability => ability?.getFlag?.(MODULE_ID, "fromPayloadId") ?? null;
const isSpentRun = ability => !!ability?.getFlag?.(MODULE_ID, "spentMagazine");
const templateKey = item => (item.system?._dsid || item.name || "").toLowerCase();
const runAbilities = payload => payload.parent?.items.filter(i => sourcePayloadId(i) === payload.id) ?? [];

/* -------------------------------------------- ability construction */

/**
 * Build the ability data for one payload.
 * @param {Item} payload  A matrix payload treasure on an Actor.
 * @returns {object|null}  Item creation data, or null if the templates are unavailable.
 */
export function buildRunAbility(payload) {
  if (!TEMPLATES) return null;
  const template = TEMPLATES.payloads[templateKey(payload)] ?? TEMPLATES.payloads.generic;
  const key = `${L}.Payloads.${template.lang}`;
  const text = suffix => {
    const path = `${key}.${suffix}`;
    return game.i18n.has(path) ? game.i18n.localize(path) : "";
  };

  const potency = ["@potency.weak", "@potency.average", "@potency.strong"];
  const powerEffects = {};
  if (template.damage) {
    const id = foundry.utils.randomID();
    const tier = (value, i) => ({
      value, types: [...template.damage.types], ignoredImmunities: [],
      potency: { value: potency[i], characteristic: "" },
    });
    powerEffects[id] = {
      name: "", img: null, type: "damage", _id: id, sort: 0,
      damage: { tier1: tier(template.damage.tier1, 0), tier2: tier(template.damage.tier2, 1), tier3: tier(template.damage.tier3, 2) },
    };
  } else if (template.roll !== false) {
    const id = foundry.utils.randomID();
    const tier = i => ({ display: text(`Tier${i + 1}`), potency: { value: potency[i], characteristic: i ? "" : "none" } });
    powerEffects[id] = {
      name: "", img: null, type: "other", _id: id, sort: 0,
      other: { tier1: tier(0), tier2: tier(1), tier3: tier(2) },
    };
  }

  // Generic (homebrew) payloads have no tiers: the use card carries the payload's own description.
  const effectLine = template.roll === false ? (payload.system?.description?.value ?? "") : "";
  const beforeId = "payloadBefore000";
  const baseEffects = template.before ? {
    [beforeId]: { _id: beforeId, type: "base", description: text("Before"), before: true, name: "", img: null, sort: 0 },
  } : {};

  const targetType = template.target?.type ?? "special";
  return {
    name: game.i18n.format(`${L}.AbilityName`, { payload: payload.name }),
    type: "ability",
    img: payload.img,
    system: {
      description: {
        value: game.i18n.format(`${L}.AbilityDescription`, { payload: payload.name, effect: effectLine }),
        director: "",
      },
      source: { book: "Ghostwire", page: "Master Gear List", license: "Draw Steel Creator License" },
      _dsid: `payload-use-${payload.system?._dsid || payload.id}`,
      keywords: [...TEMPLATES.keywords],
      type: TEMPLATES.type,
      category: "",
      resource: null,
      trigger: "",
      distance: targetType === "self"
        ? { type: "self", primary: "1", secondary: "1", tertiary: "1" }
        : { type: "special", primary: "", secondary: "1", tertiary: "1" },
      damageDisplay: "ranged",
      target: { type: targetType, value: template.target?.value ?? null, custom: targetType === "special" ? text("Target") : "" },
      power: {
        roll: { formula: "@chr", characteristics: [...TEMPLATES.characteristics], reactive: false },
        effects: powerEffects,
      },
      effects: baseEffects,
    },
    flags: { [MODULE_ID]: { fromPayloadId: payload.id, fromPayloadUuid: payload.uuid } },
  };
}

/* -------------------------------------------- sync */

const isHero = actor => actor?.type === "hero";

/** Create the Run ability for one loaded payload, unless it already has one (a spent one is reused). */
async function armPayload(payload) {
  const actor = payload.parent;
  if (!isHero(actor) || !isPayload(payload) || !isLoaded(payload)) return null;

  const existing = actor.items.get(linkedAbilityId(payload)) ?? runAbilities(payload)[0];
  if (existing) {
    if (isSpentRun(existing)) await existing.unsetFlag(MODULE_ID, "spentMagazine");
    return null;
  }

  const data = buildRunAbility(payload);
  if (!data) return null;
  const [ability] = await actor.createEmbeddedDocuments("Item", [data]);
  if (ability) await payload.setFlag(MODULE_ID, "useAbilityId", ability.id);
  return ability;
}

/**
 * Remove the Run abilities a payload spawned.
 * @param {object} [options]
 * @param {boolean} [options.keepSpent]  Leave a spent magazine's Run in place (its chat card may still be live).
 */
async function disarmPayload(payload, { keepSpent = false } = {}) {
  const actor = payload.parent;
  if (!isHero(actor)) return;
  const ids = runAbilities(payload).filter(i => !(keepSpent && isSpentRun(i))).map(i => i.id);
  if (ids.length) await actor.deleteEmbeddedDocuments("Item", ids);
}

/**
 * Bring one actor's payloads and Run abilities into agreement: arm every loaded payload, and clear abilities
 * whose payload is gone or no longer loaded (spent ones included). Idempotent, so it is safe to run on every load.
 * @returns {Promise<{added: number, removed: number}>}
 */
export async function syncActor(actor) {
  if (!isHero(actor) || !actor.isOwner) return { added: 0, removed: 0 };

  const orphans = actor.items.filter(i => {
    const payloadId = sourcePayloadId(i);
    if (!payloadId) return false;
    const payload = actor.items.get(payloadId);
    return !isPayload(payload) || !isLoaded(payload);
  }).map(i => i.id);
  if (orphans.length) await actor.deleteEmbeddedDocuments("Item", orphans);

  let added = 0;
  for (const payload of actor.items.filter(isPayload)) {
    if (await armPayload(payload)) added++;
  }
  return { added, removed: orphans.length };
}

/**
 * One client syncs each actor on load, so two owners online don't both create the same ability:
 * the active GM if there is one, otherwise the lowest-id active owner.
 */
function isSyncUser(actor) {
  if (game.users.activeGM) return game.users.activeGM.isSelf;
  const owners = game.users.filter(u => u.active && actor.testUserPermission(u, "OWNER")).sort((a, b) => a.id.localeCompare(b.id));
  return owners[0]?.isSelf ?? false;
}

/* -------------------------------------------- Load magazine (Craft) */

const decksOf = actor => actor.items.filter(item => getHostCatalog(item)?.modFamily.includes("deck"));

/** Give a chip that predates B51b its mod flag, so it can install onto a deck. */
async function ensureMagazineFlag(payload) {
  if (getModData(payload)?.magazine) return;
  await payload.update({ [`flags.${MODULE_ID}.mod`]: { ...MAGAZINE_MOD, ...(getModData(payload) ?? {}), magazine: true } });
}

/** The deck to load into: the only one with room, or the Director/player's pick. Null if none or cancelled. */
async function pickDeck(payload) {
  const decks = decksOf(payload.parent).filter(deck => canInstall(payload, deck).ok);
  if (!decks.length) {
    const key = decksOf(payload.parent).length ? "NoSlots" : "NoDeck";
    ui.notifications.warn(game.i18n.format(`${L}.Load.${key}`, { payload: payload.name }));
    return null;
  }
  if (decks.length === 1) return decks[0];

  const escape = foundry.utils.escapeHTML;
  const options = decks.map((deck, index) => {
    const { modSlots } = getHostCatalog(deck);
    return `<option value="${deck.id}"${index === 0 ? " selected" : ""}>${escape(deck.name)} (${usedSlots(deck)} / ${modSlots})</option>`;
  });
  const deckId = await foundry.applications.api.DialogV2.prompt({
    window: { title: game.i18n.format(`${L}.Load.Title`, { payload: payload.name }) },
    content: `<p>${game.i18n.format(`${L}.Load.PickDeck`, { payload: escape(payload.name) })}</p>`
      + `<div class="form-group"><label>${game.i18n.localize(`${L}.Load.Deck`)}</label><select name="deck">${options.join("")}</select></div>`,
    ok: { label: game.i18n.localize(`${L}.Load.Confirm`), callback: (event, button) => button.form.elements.deck.value },
    rejectClose: false,
  });
  return deckId ? payload.parent.items.get(deckId) : null;
}

/**
 * The Craft (Hacking) Project roll: Reason, with an edge for the Hacking skill (the Wired convention, in place of
 * the skill bonus, so the dialog's skill picker is off). Posts the system's normal test card.
 * @returns {Promise<1|2|3|null>}  The tier, or null if the dialog was cancelled.
 */
async function rollCraft(actor, payload, deck) {
  const hacking = !!actor.system.skills?.value?.has?.("hacking");
  // Whiteout (and any payload flagged craftDifficulty: "hard") is a steep/hard Craft Project: one bane.
  const hard = payload.flags?.[MODULE_ID]?.matrix?.craftDifficulty === "hard";
  const title = game.i18n.format(`${L}.Load.RollTitle`, { payload: payload.name, deck: deck.name });
  const message = await actor.system.rollCharacteristic?.("reason", { edges: hacking ? 1 : 0, banes: hard ? 1 : 0 },
    { context: { skills: null }, window: { title } },
    { data: { title } });
  return message?.rolls?.[0]?.product ?? null;
}

/**
 * Load a payload chip into a deck as a magazine (or recompile one already loaded) with a Craft roll.
 * The tier sets its quantity: 1 / 3 / 5. Nothing about the chip changes unless the install succeeds.
 */
export async function loadMagazine(payload) {
  const actor = payload?.parent;
  if (!isHero(actor) || !isPayload(payload)) return;
  const recompile = isLoaded(payload);

  let deck = installedHost(payload);
  if (!recompile) {
    if (Number(payload.system.quantity ?? 0) < 1) return ui.notifications.warn(game.i18n.format(`${L}.Load.NoChip`, { payload: payload.name }));
    await ensureMagazineFlag(payload);
    deck = await pickDeck(payload);
    if (!deck) return;
  }

  const tier = await rollCraft(actor, payload, deck);
  if (!tier) return;
  const fires = MAGAZINE_FIRES[tier - 1];

  if (recompile) {
    if (!isLoaded(payload)) return ui.notifications.warn(game.i18n.format(`${L}.Load.NotLoaded`, { payload: payload.name }));
    await payload.update({ "system.quantity": fires });
  } else {
    // This chip becomes the magazine; any other chips in its stack stay loose as a new stack.
    const spares = Number(payload.system.quantity ?? 0) - 1;
    const spareData = spares > 0 ? payload.toObject() : null;
    if (!(await installMod(payload, deck, { "system.quantity": fires }))) return;
    if (spareData) {
      delete spareData._id;
      spareData.system.quantity = spares;
      spareData.flags[MODULE_ID].mod.installedOn = null;
      delete spareData.flags[MODULE_ID].useAbilityId;
      await actor.createEmbeddedDocuments("Item", [spareData]);
    }
  }

  const tierLabel = game.i18n.localize(ds.rolls.PowerRoll.RESULT_TIERS[`tier${tier}`]?.label ?? "");
  const data = { actor: actor.name, payload: payload.name, deck: deck.name, tier: tierLabel, fires };
  const escaped = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, foundry.utils.escapeHTML(String(v))]));
  const key = recompile ? "Recompiled" : "Loaded";
  ui.notifications.info(game.i18n.format(`${L}.Load.${key}`, data));
  await ChatMessage.implementation.create({
    speaker: ChatMessage.implementation.getSpeaker({ actor }),
    content: `<p>${game.i18n.format(`${L}.Load.${key}`, escaped)}</p>`,
  });
}

/* -------------------------------------------- consumption */

/** @type {((actor: Actor) => "disconnected"|"overlay"|"jackedIn") | null} */
let getWiredStateFn = null;

/** Wrap AbilityModel#use: refuse an unloaded or spent magazine or a Disconnected hero, and spend one fire after a successful Run. */
function patchPayloadConsumption() {
  const AbilityModel = CONFIG.Item.dataModels?.ability ?? ds.data?.Item?.AbilityModel;
  if (!AbilityModel?.prototype.use) {
    console.warn(`${MODULE_ID} | AbilityModel#use not found; payloads will not be spent on use`);
    return;
  }
  const use = AbilityModel.prototype.use;
  AbilityModel.prototype.use = async function(config = {}, dialogOptions = {}, messageOptions = {}) {
    const payloadId = sourcePayloadId(this.parent);
    const payload = payloadId ? this.actor?.items.get(payloadId) : null;
    if (!payload) return use.call(this, config, dialogOptions, messageOptions);

    const quantity = Number(payload.system.quantity ?? 0);
    if ((quantity <= 0) || isSpentRun(this.parent)) {
      ui.notifications.warn(game.i18n.format(`${L}.Spent`, { payload: payload.name }));
      return null;
    }
    if (!isLoaded(payload)) {
      ui.notifications.warn(game.i18n.format(`${L}.NotLoaded`, { payload: payload.name }));
      return null;
    }
    // B51c: a payload only runs on the Wire. The Run stays on the sheet while Disconnected; the use is refused.
    const state = getWiredStateFn?.(this.actor);
    if ((state !== "overlay") && (state !== "jackedIn")) {
      ui.notifications.warn(game.i18n.format(`${L}.NotConnected`, { actor: this.actor?.name ?? "", payload: payload.name }));
      return null;
    }

    const message = await use.call(this, config, dialogOptions, messageOptions);
    if (!message) return message;

    const left = quantity - 1;
    await payload.update({ "system.quantity": left });
    ui.notifications.info(game.i18n.format(`${L}.Consumed`, { actor: this.actor.name, payload: payload.name, left }));
    if (left <= 0) {
      // Flag before unloading, so the updateItem sync leaves this Run (and the card that points at it) alone.
      await this.parent.setFlag(MODULE_ID, "spentMagazine", true);
      await uninstallMod(payload);
    }
    return message;
  };
}

/* -------------------------------------------- registration */

/**
 * @param {{ getWiredState?: (actor: Actor) => "disconnected"|"overlay"|"jackedIn" }} [options]
 */
export function registerPayloadUse({ getWiredState } = {}) {
  getWiredStateFn = getWiredState ?? null;
  patchPayloadConsumption();

  Hooks.once("ready", async () => {
    try {
      TEMPLATES = await foundry.utils.fetchJsonWithTimeout(TEMPLATES_PATH);
    } catch (error) {
      console.error(`${MODULE_ID} | could not load ${TEMPLATES_PATH}; payload Run abilities disabled`, error);
      return;
    }

    // Catch up sheets: arm loaded magazines, clear Runs of unloaded or spent ones.
    let added = 0, removed = 0;
    for (const actor of game.actors) {
      if (!isHero(actor) || !isSyncUser(actor)) continue;
      const result = await syncActor(actor);
      added += result.added; removed += result.removed;
    }
    if (added || removed) console.log(`${MODULE_ID} | payload Run abilities: +${added} / -${removed}`);
  });

  Hooks.on("createItem", (item, options, userId) => {
    if (userId !== game.user.id || !TEMPLATES) return;
    if (isPayload(item)) armPayload(item);
  });

  Hooks.on("deleteItem", (item, options, userId) => {
    if (userId !== game.user.id) return;
    if (isPayload(item)) disarmPayload(item);
  });

  // Install / uninstall (including a deck being deleted under it) arms or disarms the Run. Unloading a magazine
  // that still has fires dumps them (spending the last fire unloads it at 0, so that path dumps nothing).
  Hooks.on("updateItem", (item, changes, options, userId) => {
    if (userId !== game.user.id || !isPayload(item)) return;
    if (!foundry.utils.hasProperty(changes, `flags.${MODULE_ID}.mod`)) return;
    const unloaded = foundry.utils.getProperty(changes, `flags.${MODULE_ID}.mod.installedOn`) === null;
    const left = Number(item.system.quantity ?? 0);
    if (unloaded && !isLoaded(item) && (left > 0)) {
      item.update({ "system.quantity": 0 });
      ui.notifications.info(game.i18n.format(`${L}.Dumped`, { payload: item.name, fires: left }));
    }
    if (!TEMPLATES) return;
    if (isLoaded(item)) armPayload(item);
    else disarmPayload(item, { keepSpent: true });
  });

  // An actor imported whole (a pregen dragged out of the compendium) never fires createItem.
  Hooks.on("createActor", (actor, options, userId) => {
    if (userId !== game.user.id || !TEMPLATES) return;
    syncActor(actor);
  });

  // Hero sheet: right-click a payload chip → Load magazine (Craft)… / Recompile magazine (Craft)….
  Hooks.on("getDocumentListContextOptions", (app, menuItems) => {
    if (typeof app._getEmbeddedDocument !== "function") return;
    const payloadItem = target => {
      const item = app._getEmbeddedDocument(target);
      return (isPayload(item) && isHero(item.parent) && item.isOwner) ? item : null;
    };
    menuItems.push(
      {
        label: `${L}.Menu.Load`, icon: "fa-solid fa-microchip",
        visible: target => { const payload = payloadItem(target); return !!payload && !isLoaded(payload); },
        onClick: (event, target) => loadMagazine(payloadItem(target)),
      },
      {
        label: `${L}.Menu.Recompile`, icon: "fa-solid fa-rotate",
        visible: target => { const payload = payloadItem(target); return !!payload && isLoaded(payload); },
        onClick: (event, target) => loadMagazine(payloadItem(target)),
      },
    );
  });

  const module = game.modules.get(MODULE_ID);
  if (module) module.api = { ...(module.api ?? {}), syncPayloadAbilities: syncActor, buildRunAbility, isPayload, loadMagazine };
}
