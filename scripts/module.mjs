import { registerGhostwireSkills } from "./skills.mjs";
import { registerGhostwireLanguages } from "./languages.mjs";
import { registerWiredConsole } from "./wired-console.mjs";
import { registerWiredMinimap } from "./wired-minimap.mjs";
import { registerRunGenerator } from "./run-generator.mjs";
import { registerMachines } from "./machines.mjs";
import { registerStreetEye } from "./street-eye.mjs";
import { registerSprites } from "./sprites.mjs";
import { registerVeilSummons } from "./veil-summons.mjs";
import { registerMods, modSlotsLabel, softwareEdges } from "./mods.mjs";
import { registerWiredVision } from "./wired-vision.mjs";
import { registerAbilitySfx } from "./sfx.mjs";
import { registerEquipmentUse } from "./equipment-use.mjs";
import { registerPayloadUse } from "./payload-use.mjs";
import { registerFreeStrikeStrip } from "./free-strikes.mjs";
import { registerCasterChrome } from "./caster-chrome.mjs";
import { registerMagicErosion } from "./magic-erosion.mjs";
import { registerVoidmark } from "./voidmark.mjs";
import { registerGoldLineScene } from "./gold-line-scene.mjs";
import { registerTaint } from "./taint.mjs";

const MODULE_ID = "draw-steel-ghostwire";

// Draw Steel copies ds.CONFIG.hero.defaultItems onto every new hero.
// Ghostwire swaps stock actions for street-themed copies with the same mechanics.
const DEFAULT_ITEM_SWAPS = {
  // Ride -> Drive (vehicles, not mounts)
  "Compendium.draw-steel.abilities.Item.QXOkflcYF6DITJE3": `Compendium.${MODULE_ID}.abilities.Item.Xc5MebcXHYG1hdQR`,
  // Charge -> Rush
  "Compendium.draw-steel.abilities.Item.wNqJWJbgAbnJBqZf": `Compendium.${MODULE_ID}.abilities.Item.Od6u2idYoCRmoDYD`,
  // Defend -> Take Cover
  "Compendium.draw-steel.abilities.Item.fjtY7RKBGWx2u5tK": `Compendium.${MODULE_ID}.abilities.Item.1W0HIoL2SAcbTU6W`,
  // Heal -> Patch Up
  "Compendium.draw-steel.abilities.Item.2qWHDVB7SBS9anLB": `Compendium.${MODULE_ID}.abilities.Item.pJY4ybZUtkH9HDxy`,
  // Aid Attack -> Spot Target
  "Compendium.draw-steel.abilities.Item.Xb3S5N1fZyICD58D": `Compendium.${MODULE_ID}.abilities.Item.Lc7LhoqWg9ydP5Jm`,
};

// Matrix Verbs (08-hacker.md): universal Wired abilities every hero gets, in Ghostwire Abilities › Matrix Verbs.
const MATRIX_VERBS = [
  "GY0GEe2obsavHD4a", // Connect
  "wRvsbMqkVkwKMwj0", // Jack Out
  "ZGGlbzIQqzGIBdG6", // Toggle Connection State
  "srf3OJxnEYVPlcbM", // Scan
  "6sOxYCw5Ff6Es8LF", // Navigate
  "H1xUDnDNhWmAw0Ko", // Ping
  "4gr00JaQt5OrEpDE", // Broadcast
  "n1fEJIA3QoDXxUZS", // Search
  "RM694XnuAyo25XNV", // Read/Write
].map(id => `Compendium.${MODULE_ID}.abilities.Item.${id}`);

// Wired connection states: the token/sheet statuses are the source of truth, mirrored to flags.<module>.wired for the Wired Console.
const WIRED_STATUSES = {
  overlay: { id: "ghostwire-overlay", _id: "gwOverlayStatus0", name: "GHOSTWIRE.Wired.States.overlay", img: "icons/svg/eye.svg" },
  jackedIn: { id: "ghostwire-jacked-in", _id: "gwJackedInStatus", name: "GHOSTWIRE.Wired.States.jackedIn", img: "icons/svg/lightning.svg" },
};

Hooks.once("init", () => {
  console.log(`${MODULE_ID} | Draw Steel - Ghostwire Build initialized`);
  document.body.classList.add("ghostwire", "ghostwire-theme");

  const defaultItems = ds.CONFIG.hero.defaultItems;
  for (const [stock, ghostwire] of Object.entries(DEFAULT_ITEM_SWAPS)) {
    if (defaultItems.delete(stock)) defaultItems.add(ghostwire);
    else console.warn(`${MODULE_ID} | ${stock} not found in hero default items; ${ghostwire} not added`);
  }
  for (const uuid of MATRIX_VERBS) defaultItems.add(uuid);
  for (const status of Object.values(WIRED_STATUSES)) CONFIG.statusEffects[status.id] = { ...status };

  // Tech: non-Magic, non-Psionic ability keyword for machine abilities (Cyborg Installed Suite).
  // Draw Steel localizes keyword labels at i18nInit, after this hook.
  ds.CONFIG.abilities.keywords.tech ??= { label: "GHOSTWIRE.Abilities.Keywords.Tech" };
  // Chrome / Optics: Scout gear keywords (implant-driven and emitter/holo-driven abilities).
  ds.CONFIG.abilities.keywords.chrome ??= { label: "GHOSTWIRE.Abilities.Keywords.Chrome" };
  ds.CONFIG.abilities.keywords.optics ??= { label: "GHOSTWIRE.Abilities.Keywords.Optics" };
  // Wired: Matrix Verbs, Programs, and other abilities that act in the Wired.
  ds.CONFIG.abilities.keywords.wired ??= { label: "GHOSTWIRE.Abilities.Keywords.Wired" };
  // Command: Commander abilities driven by command presence (orders, rallies, reads).
  ds.CONFIG.abilities.keywords.command ??= { label: "GHOSTWIRE.Abilities.Keywords.Command" };

  registerGhostwireSkills();
  registerGhostwireLanguages();
  registerPerkTypes();
  patchPerkGrants();
  patchPreviousLifeFilter();
  patchPactFilter();
  patchAddOrigin();
  patchArcaneSeverance();
  enforceHeroicResourceCost();
  patchPersistentReagents();
  patchWiredAbilities();
  registerWiredConsole({ getWiredState });
  registerWiredMinimap({ getWiredState });
  registerRunGenerator();
  registerWiredVision({ statusIds: { overlay: WIRED_STATUSES.overlay.id, jackedIn: WIRED_STATUSES.jackedIn.id } });
  registerMachines();
  registerStreetEye();
  registerSprites();
  registerVeilSummons();
  registerMods();
  registerAbilitySfx();
  registerEquipmentUse();
  registerPayloadUse({ getWiredState });
  registerFreeStrikeStrip();
  const { isCasterClass } = registerCasterChrome({ isCyborg, casterClasses: VEIL_CASTER_CLASSES });
  registerMagicErosion({ isCasterClass });
  registerTaint();
  registerVoidmark();
  registerGoldLineScene();
});

// ---------- Wired connection states ----------

/** @returns {"disconnected"|"overlay"|"jackedIn"} */
function getWiredState(actor) {
  if (actor.statuses.has(WIRED_STATUSES.jackedIn.id)) return "jackedIn";
  if (actor.statuses.has(WIRED_STATUSES.overlay.id)) return "overlay";
  return "disconnected";
}

async function syncWiredFlag(actor) {
  const state = getWiredState(actor);
  const flag = actor.getFlag(MODULE_ID, "wired");
  if ((flag?.state === state) && (flag?.connected === (state !== "disconnected"))) return;
  await actor.update({ [`flags.${MODULE_ID}.wired`]: { connected: state !== "disconnected", state } });
}

async function setWiredState(actor, state) {
  for (const [key, status] of Object.entries(WIRED_STATUSES)) {
    if (key !== state) await actor.toggleStatusEffect(status.id, { active: false });
  }
  if (WIRED_STATUSES[state]) await actor.toggleStatusEffect(WIRED_STATUSES[state].id, { active: true });
  await syncWiredFlag(actor);
  ui.notifications.info(game.i18n.format("GHOSTWIRE.Wired.Changed", { actor: actor.name, state: game.i18n.localize(`GHOSTWIRE.Wired.States.${state}`) }));
}

// Statuses toggled from the token HUD: Overlay and Jacked In are exclusive, and the flag follows.
const wiredStatusKey = effect => Object.keys(WIRED_STATUSES).find(key => effect.statuses?.has(WIRED_STATUSES[key].id));
Hooks.on("createActiveEffect", async (effect, options, userId) => {
  const actor = effect.parent;
  const key = wiredStatusKey(effect);
  if ((userId !== game.user.id) || !key || !(actor instanceof Actor)) return;
  const other = (key === "overlay") ? WIRED_STATUSES.jackedIn : WIRED_STATUSES.overlay;
  if (actor.statuses.has(other.id)) await actor.toggleStatusEffect(other.id, { active: false });
  await syncWiredFlag(actor);
});
Hooks.on("deleteActiveEffect", async (effect, options, userId) => {
  const actor = effect.parent;
  if ((userId !== game.user.id) || !wiredStatusKey(effect) || !(actor instanceof Actor)) return;
  await syncWiredFlag(actor);
});

// Matrix Verbs drive the connection state, and connection states modify power rolls:
// - Connect needs you disconnected and enters Overlay; every other verb needs you connected.
// - Toggle Connection State flips Overlay and Jacked In; Jack Out disconnects.
// - Wired abilities gain an edge with the Hacking skill and an edge while Jacked In.
// - Real-world abilities take a bane while Overlaid and can't make power rolls at all while Jacked In.
function patchWiredAbilities() {
  const AbilityModel = CONFIG.Item.dataModels?.ability ?? ds.data?.Item?.AbilityModel;
  if (!AbilityModel?.prototype.use) {
    console.warn(`${MODULE_ID} | AbilityModel#use not found; Matrix Verbs don't change connection state`);
    return;
  }
  const use = AbilityModel.prototype.use;
  AbilityModel.prototype.use = async function(config = {}, dialogOptions = {}, messageOptions = {}) {
    const actor = this.actor;
    if (!actor) return use.call(this, config, dialogOptions, messageOptions);
    const state = getWiredState(actor);
    const dsid = this.parent.system._dsid ?? "";
    const verb = dsid.startsWith("matrix-") ? dsid.slice("matrix-".length) : null;
    const wired = this.keywords.has("wired");
    const warn = key => {
      ui.notifications.warn(game.i18n.format(`GHOSTWIRE.Wired.Warnings.${key}`, {
        actor: actor.name, name: this.parent.name, state: game.i18n.localize(`GHOSTWIRE.Wired.States.${state}`),
      }));
      return null;
    };

    if ((verb === "connect") && (state !== "disconnected")) return warn("AlreadyConnected");
    if (verb && (verb !== "connect") && (state === "disconnected")) return warn("NotConnected");
    if ((state === "jackedIn") && !wired && this.power.roll.enabled) return warn("JackedInPhysical");

    if (this.power.roll.enabled) {
      // Installed, running deck programs and RCC autosofts that name this ability (B20d, scripts/mods.mjs).
      let edges = softwareEdges(actor, dsid);
      let banes = 0;
      if (wired && actor.system.skills?.value?.has?.("hacking")) edges += 1;
      if (wired && (state === "jackedIn")) edges += 1;
      if (!wired && (state === "overlay")) banes += 1;
      if (edges || banes) {
        const modifiers = config.modifiers ?? {};
        config = { ...config, modifiers: { ...modifiers, edges: (modifiers.edges ?? 0) + edges, banes: (modifiers.banes ?? 0) + banes } };
      }
    }

    const message = await use.call(this, config, dialogOptions, messageOptions);
    if (message && verb) {
      if (verb === "connect") await setWiredState(actor, "overlay");
      else if (verb === "jack-out") await setWiredState(actor, "disconnected");
      else if (verb === "toggle-connection-state") await setWiredState(actor, (state === "jackedIn") ? "overlay" : "jackedIn");
    }
    return message;
  };
}

// Existing heroes: add any missing Matrix Verbs once (GM client), then flag the hero so it isn't re-granted.
Hooks.once("ready", async () => {
  if (!game.user.isGM) return;
  const verbs = (await Promise.all(MATRIX_VERBS.map(uuid => fromUuid(uuid)))).filter(Boolean);
  if (verbs.length !== MATRIX_VERBS.length) console.warn(`${MODULE_ID} | Some Matrix Verbs are missing from the abilities pack`);
  let count = 0;
  for (const actor of game.actors) {
    if ((actor.type !== "hero") || actor.getFlag(MODULE_ID, "matrixVerbs")) continue;
    const owned = new Set(actor.items.map(i => i.system._dsid));
    const missing = verbs.filter(v => !owned.has(v.system._dsid)).map(v => game.items.fromCompendium(v, { clearFolder: true }));
    if (missing.length) {
      await actor.createEmbeddedDocuments("Item", missing);
      count += 1;
    }
    await actor.setFlag(MODULE_ID, "matrixVerbs", true);
  }
  if (count) ui.notifications.info(game.i18n.format("GHOSTWIRE.Wired.Migrated", { count }));
});

// Medic Reagents (docs/rulebook/04-medic.md) persist across encounters and have no per-turn gain.
// Draw Steel sets every hero's heroic resource to their Victories when combat starts and rolls the class turnGain
// ("0" still posts a chat card) at the start of each turn; skip both for Medics.
const PERSISTENT_RESOURCE_CLASSES = new Set(["medic"]);

function patchPersistentReagents() {
  const HeroModel = CONFIG.Actor.dataModels?.hero;
  const parent = HeroModel && Object.getPrototypeOf(HeroModel.prototype);
  if (!HeroModel?.prototype.startCombat || !HeroModel.prototype._onStartTurn || !parent) {
    console.warn(`${MODULE_ID} | HeroModel combat hooks not found; Medic Reagents reset when combat starts`);
    return;
  }
  const persistent = model => PERSISTENT_RESOURCE_CLASSES.has(model.class?.system._dsid);

  const startCombat = HeroModel.prototype.startCombat;
  HeroModel.prototype.startCombat = async function(combatant) {
    if (!persistent(this)) return startCombat.call(this, combatant);
    return parent.startCombat.call(this, combatant);
  };

  const onStartTurn = HeroModel.prototype._onStartTurn;
  HeroModel.prototype._onStartTurn = async function(combatant) {
    if (!persistent(this)) return onStartTurn.call(this, combatant);
    return parent._onStartTurn.call(this, combatant);
  };
}

// Heroic abilities: Draw Steel's use dialog lets a hero spend Adrenaline (or any heroic resource) they don't have.
// In combat, refuse to use an ability whose cost is more than the hero's current heroic resource.
// Outside combat, most classes' chapters let heroic abilities be used without spending, so nothing is checked,
// except for Medic Reagents: a physical kit that still spends outside combat (04-medic.md), so it's always checked.
function enforceHeroicResourceCost() {
  const AbilityModel = CONFIG.Item.dataModels?.ability ?? ds.data?.Item?.AbilityModel;
  if (!AbilityModel?.prototype.use) {
    console.warn(`${MODULE_ID} | AbilityModel#use not found; heroic resource costs aren't enforced`);
    return;
  }
  const use = AbilityModel.prototype.use;
  AbilityModel.prototype.use = async function(config = {}, dialogOptions = {}, messageOptions = {}) {
    const actor = this.actor;
    const cost = Number(this.resource) || 0;
    const persistent = PERSISTENT_RESOURCE_CLASSES.has(actor?.system.class?.system._dsid);
    if ((cost > 0) && (actor?.type === "hero") && (actor.inCombat || persistent)) {
      const resource = actor.system.coreResource;
      const current = Number(foundry.utils.getProperty(resource.target, resource.path)) || 0;
      if (current < cost) {
        ui.notifications.warn(game.i18n.format("GHOSTWIRE.Abilities.NotEnoughResource", { name: this.parent.name, cost, resource: resource.name, current }));
        return null;
      }
    }
    return use.call(this, config, dialogOptions, messageOptions);
  };
}

// Perks (docs/rulebook/17-perks.md): the Ghostwire Perks pack replaces the Draw Steel perks.
const PERK_PACK = `${MODULE_ID}.perks`;
const STOCK_PERK_PACK = "draw-steel.character-options";
const PERK_TYPES = ["crafting", "exploration", "interpersonal", "intrigue", "lore", "supernatural"];

// Draw Steel builds perk type options from the skill groups, which Ghostwire replaced, so the Draw Steel perk types
// lost their labels. List exactly the six perk types instead (Draw Steel localizes the labels at i18nInit).
function registerPerkTypes() {
  const perks = ds.CONFIG.perks;
  perks.types = Object.fromEntries(PERK_TYPES.map(type => [type, { label: `GHOSTWIRE.Perks.Types.${type.charAt(0).toUpperCase()}${type.slice(1)}` }]));
  Object.defineProperty(perks, "typeOptions", {
    configurable: true,
    get: () => Object.entries(perks.types).map(([value, { label }]) => ({ value, label })),
  });
}

// Perk grants (additional.type "perk") have an empty pool, so Draw Steel only offers a drop zone.
// List every Ghostwire perk that matches the grant's perk types as a choice, and refuse dropped Draw Steel perks.
function patchPerkGrants() {
  const ItemGrant = ds.CONFIG.Advancement?.itemGrant?.documentClass;
  const Dialog = ds.applications.apps.advancement?.ItemGrantConfigurationDialog;
  const Leaf = ds.utils.advancement?.AdvancementLeaf;
  if (!ItemGrant?.prototype.createLeaves || !Dialog?.prototype._onDrop || !Leaf) {
    console.warn(`${MODULE_ID} | Draw Steel item grant classes not found; perk grants don't list Ghostwire perks`);
    return;
  }

  const createLeaves = ItemGrant.prototype.createLeaves;
  ItemGrant.prototype.createLeaves = async function(node) {
    const result = await createLeaves.call(this, node);
    if ((this.additional.type !== "perk") || !node) return result;
    const pack = game.packs.get(PERK_PACK);
    if (!pack) return result;
    const types = this.additional.perkType;
    const perks = await pack.getDocuments({ type: "perk" });
    for (const perk of perks.sort((a, b) => a.name.localeCompare(b.name, game.i18n.lang))) {
      if (types.size && !types.has(perk.system.perkType)) continue;
      node.choices[perk.uuid] ??= new Leaf(node, perk.uuid, perk.toAnchor().outerHTML, { item: perk });
    }
    return result;
  };

  const onDrop = Dialog.prototype._onDrop;
  Dialog.prototype._onDrop = async function(event) {
    const data = foundry.applications.ux.TextEditor.implementation.getDragEventData(event);
    const item = data?.uuid ? await fromUuid(data.uuid) : null;
    if ((item?.type === "perk") && (item.pack === STOCK_PERK_PACK)) {
      ui.notifications.warn(game.i18n.format("GHOSTWIRE.Perks.Warnings.StockPerk", { name: item.name }));
      return;
    }
    return onDrop.call(this, event);
  };

  // The registry indexes perks from every pack; keep only non-Draw Steel perks.
  const initialize = ds.registry.initialize;
  ds.registry.initialize = async function(...args) {
    const result = await initialize.apply(this, args);
    for (const [key, entry] of this.perk.entries()) {
      if (entry.uuid?.startsWith(`Compendium.${STOCK_PERK_PACK}.`)) this.perk.delete(key);
    }
    return result;
  };
}

// Hero sheet "+ Add Ancestry / Background / Profession" opens the Ghostwire compendiums instead of draw-steel.origins.
const ORIGIN_PACKS = { ancestry: `${MODULE_ID}.origins`, culture: `${MODULE_ID}.backgrounds`, career: `${MODULE_ID}.professions`, class: `${MODULE_ID}.classes` };
function patchAddOrigin() {
  const actions = ds.applications.sheets?.DrawSteelHeroSheet?.DEFAULT_OPTIONS?.actions;
  if (!actions?.addOrigin) {
    console.warn(`${MODULE_ID} | DrawSteelHeroSheet addOrigin action not found; + Add buttons open Draw Steel compendiums`);
    return;
  }
  const original = actions.addOrigin;
  actions.addOrigin = function(event, target) {
    const pack = game.packs.get(ORIGIN_PACKS[target.dataset.type]);
    if (pack) return pack.render(true);
    return original.call(this, event, target);
  };
}

// Revenant Previous Life: its trait picker only enables traits from the Former Life People's Origins folder.
// Draw Steel's own prerequisite check only knows class and subclass DSIDs, so extend it here.
function patchPreviousLifeFilter() {
  const dialog = ds.applications.apps.advancement?.ItemGrantConfigurationDialog;
  if (!dialog?.prototype.fulfillsRequirements) {
    console.warn(`${MODULE_ID} | ItemGrantConfigurationDialog not found; Revenant Previous Life is unfiltered`);
    return;
  }
  const original = dialog.prototype.fulfillsRequirements;
  dialog.prototype.fulfillsRequirements = function(item) {
    if (!original.call(this, item)) return false;
    if (!this.advancement.document?.getFlag(MODULE_ID, "previousLife")) return true;
    const formerLife = findFormerLife(this.node.chain);
    return !!formerLife?.folder && ((item._source?.folder ?? item.folder?.id) === formerLife.folder);
  };
}

// Street Priest pact (07-street-priest.md): pact-named features come in Light and Dark versions, flagged
// flags.draw-steel-ghostwire.pact. A grant only enables the version matching the Light Pact / Dark Pact feature
// chosen earlier in the chain or already on the actor (both stay enabled until a pact is known).
function patchPactFilter() {
  const dialog = ds.applications.apps.advancement?.ItemGrantConfigurationDialog;
  if (!dialog?.prototype.fulfillsRequirements) {
    console.warn(`${MODULE_ID} | ItemGrantConfigurationDialog not found; Light/Dark pact features are unfiltered`);
    return;
  }
  const original = dialog.prototype.fulfillsRequirements;
  dialog.prototype.fulfillsRequirements = function(item) {
    if (!original.call(this, item)) return false;
    const pact = item.getFlag?.(MODULE_ID, "pact") ?? item.flags?.[MODULE_ID]?.pact;
    if (!pact) return true;
    const alignment = findPactAlignment(this.node.chain);
    return !alignment || (alignment === pact);
  };
}

function findPactAlignment(chain) {
  for (const node of chain.activeNodes()) {
    if (node.advancement.type !== "itemGrant") continue;
    for (const uuid of node.chosenSelection ?? []) {
      const alignment = node.choices[uuid]?.item?.getFlag(MODULE_ID, "pactAlignment");
      if (alignment) return alignment;
    }
  }
  return chain.actor.items.find(i => i.getFlag(MODULE_ID, "pactAlignment"))?.getFlag(MODULE_ID, "pactAlignment") ?? null;
}

// The Former Life chosen earlier in this advancement chain, or already on the actor.
function findFormerLife(chain) {
  for (const node of chain.activeNodes()) {
    if (node.advancement.type !== "itemGrant") continue;
    for (const uuid of node.chosenSelection ?? []) {
      const formerLife = node.choices[uuid]?.item?.getFlag(MODULE_ID, "formerLife");
      if (formerLife) return formerLife;
    }
  }
  return chain.actor.items.find(i => i.getFlag(MODULE_ID, "formerLife"))?.getFlag(MODULE_ID, "formerLife") ?? null;
}

// Changer forms: enabling one form effect switches the whole form, so exactly one form is active. A form can have
// several effects (Hybrid: Intimidation edge + melee damage modifier): every effect of that form turns on and every
// other form's effect turns off.
Hooks.on("updateActiveEffect", (effect, changes, options, userId) => {
  if ((userId !== game.user.id) || (changes.disabled !== false) || options.ghostwireChangerForm) return;
  const form = effect.getFlag(MODULE_ID, "changerForm");
  if (!form) return;
  const actor = (effect.parent instanceof Actor) ? effect.parent : effect.parent?.actor;
  setChangerForm(actor ? [...actor.allApplicableEffects()] : [...effect.parent.effects], form, actor);
});

// Enable every changerForm effect of `form` and disable the rest, one update per parent document, then swap the art.
async function setChangerForm(effects, form, actor) {
  const updates = new Map();
  for (const e of effects) {
    const f = e.getFlag(MODULE_ID, "changerForm");
    if (!f || (e.disabled === (f !== form))) continue;
    if (!updates.has(e.parent)) updates.set(e.parent, []);
    updates.get(e.parent).push({ _id: e.id, disabled: f !== form });
  }
  for (const [parent, changes] of updates) {
    await parent.updateEmbeddedDocuments("ActiveEffect", changes, { ghostwireChangerForm: true });
  }
  if (actor) await syncChangerFormArt(actor, form);
}

// Changer form art: swap the portrait and token art to the form's image from flags.changer (beastArt / humanArt /
// hybridArt). Changers without beastArt or humanArt keep their art; the forms still work mechanically.
async function syncChangerFormArt(actor, form) {
  const art = actor.getFlag(MODULE_ID, "changer") ?? {};
  if (!art.beastArt && !art.humanArt) return;
  // Snapshot the current portrait as the human form before the first Beast swap, so Human can swap back.
  if ((form === "beast") && art.beastArt && !art.humanArt && (actor.img !== art.beastArt)) {
    await actor.setFlag(MODULE_ID, "changer.humanArt", actor.img);
    art.humanArt = actor.img;
  }
  const src = { beast: art.beastArt, human: art.humanArt, hybrid: art.hybridArt ?? art.humanArt }[form] ?? null;
  if (!src) return;
  const update = {};
  if (actor.img !== src) update.img = src;
  if (!actor.isToken && (actor.prototypeToken.texture.src !== src)) update["prototypeToken.texture.src"] = src;
  if (!foundry.utils.isEmpty(update)) await actor.update(update);
  const tokens = actor.isToken ? [actor.token] : actor.getActiveTokens(false, true);
  for (const token of tokens) {
    if (token && (token.texture.src !== src)) await token.update({ "texture.src": src });
  }
}

// Pact spirits (Ghostwire Summons & Machines › Pact Spirits): one Actor serves both pacts. Enabling its Pact: Light or
// Pact: Dark effect disables the other, records flags.pact, and tints the token; setting flags.pact enables the matching effect.
const PACT_TINTS = { light: "#fff1b8", dark: "#c9a0ff" };

async function syncPactTint(actor, pact) {
  const updates = actor.effects.filter(e => e.getFlag(MODULE_ID, "pactTint"))
    .filter(e => e.disabled === (e.getFlag(MODULE_ID, "pactTint") === pact))
    .map(e => ({ _id: e.id, disabled: !e.disabled }));
  if (updates.length) await actor.updateEmbeddedDocuments("ActiveEffect", updates);
  if ((actor.getFlag(MODULE_ID, "pact") ?? null) !== pact) await actor.update({ [`flags.${MODULE_ID}.pact`]: pact });
  const tint = PACT_TINTS[pact] ?? "#ffffff";
  const tokens = actor.isToken ? [actor.token] : actor.getActiveTokens(false, true);
  for (const token of tokens) {
    if (token?.texture.tint?.css !== tint) await token.update({ "texture.tint": tint });
  }
}

Hooks.on("updateActiveEffect", (effect, changes, options, userId) => {
  const actor = effect.parent;
  const pact = effect.getFlag(MODULE_ID, "pactTint");
  if ((userId !== game.user.id) || !pact || !("disabled" in changes) || !(actor instanceof Actor)) return;
  if (!effect.disabled) syncPactTint(actor, pact);
  // Turning a pact off clears it, unless this is the other pact being switched off by syncPactTint itself.
  else if (!actor.effects.some(e => !e.disabled && e.getFlag(MODULE_ID, "pactTint"))) syncPactTint(actor, null);
});

Hooks.on("updateActor", (actor, changes, options, userId) => {
  if ((userId !== game.user.id) || (actor.getFlag(MODULE_ID, "kind") !== "spirit")) return;
  if (!foundry.utils.hasProperty(changes, `flags.${MODULE_ID}.pact`)) return;
  syncPactTint(actor, actor.getFlag(MODULE_ID, "pact") ?? null);
});

// Changer lineage: Draw Steel lets chargen be confirmed with a choice left unpicked, so warn when it happens.
Hooks.on("createItem", (item, options, userId) => {
  if ((userId !== game.user.id) || (item.type !== "ancestry") || (item.system._dsid !== "changer")) return;
  const actor = item.parent;
  if (!actor || actor.items.some(i => i.getFlag(MODULE_ID, "changerLineage"))) return;
  const message = game.i18n.format("GHOSTWIRE.Peoples.Changer.Warnings.MissingLineage", { name: actor.name });
  ui.notifications.warn(message, { permanent: true });
});

// Body Integrity (Chrome chapter): living heroes start at 20/20, stored as an actor flag.
// Cyborgs don't use Integrity or chrome implants; they upgrade with Frame Modules.
const INTEGRITY_START = 20;
const STARTING_NUYEN = 5000;
// Implants per body location (Chrome chapter); arms and legs are 2 per limb, so 4 total.
const CHROME_SLOT_CAPS = { head: 3, eyes: 1, ears: 1, torso: 3, arms: 4, legs: 4, nervous: 1 };

const isCyborg = actor => actor.items.some(i => (i.type === "ancestry") && (i.system._dsid === "cyborg"));

function getIntegrity(actor) {
  const flag = actor.getFlag(MODULE_ID, "integrity") ?? {};
  return { value: flag.value ?? INTEGRITY_START, max: flag.max ?? INTEGRITY_START };
}

const setIntegrity = (actor, value) => actor.update({ [`flags.${MODULE_ID}.integrity.value`]: value });

// New heroes: Integrity 20/20 and ¥5,000 starting funds. Duplicates, imports, and compendium heroes keep their data.

// Pregens used to store only biSpent/biRemaining. The sheet reads integrity.value/max — migrate once.
Hooks.once("ready", async () => {
  let fixed = 0;
  for (const actor of game.actors) {
    if (actor.type !== "hero") continue;
    const flag = actor.getFlag(MODULE_ID, "integrity");
    if (flag?.value !== undefined) continue;
    const remaining = actor.getFlag(MODULE_ID, "biRemaining");
    if (remaining === undefined || remaining === null) continue;
    await actor.update({
      [`flags.${MODULE_ID}.integrity`]: { value: Number(remaining), max: INTEGRITY_START },
    });
    fixed += 1;
  }
  if (fixed) console.log(`${MODULE_ID} | migrated Body Integrity onto ${fixed} hero(es) from biRemaining`);
});

Hooks.on("preCreateActor", (actor, data, options, userId) => {
  if ((userId !== game.user.id) || (actor.type !== "hero")) return;
  const stats = data._stats ?? {};
  if (stats.duplicateSource || stats.compendiumSource || stats.exportSource) return;
  const updates = {
    [`flags.${MODULE_ID}.integrity`]: { value: INTEGRITY_START, max: INTEGRITY_START },
    // Taint is a separate 0–12 stain track (B80). Chrome install never writes this flag.
    [`flags.${MODULE_ID}.taint`]: 0,
    [`flags.${MODULE_ID}.corruptionHistory`]: "",
    // New heroes get the Matrix Verbs from defaultItems, so they skip the migration.
    [`flags.${MODULE_ID}.matrixVerbs`]: true,
    [`flags.${MODULE_ID}.wired`]: { connected: false, state: "disconnected" },
  };
  if (foundry.utils.getProperty(data, "system.hero.wealth") === undefined) updates["system.hero.wealth"] = STARTING_NUYEN;
  actor.updateSource(updates);
});

// Arcane Severance (09-species.md, 06-elementalist.md, 20-technomancer.md): Cyborgs can never take a magic class
// (the Veil casters and the Technomancer).
// Checked on the hero sheet drop, before Draw Steel opens the advancement dialog, so nothing is half-created;
// the preCreateItem hook below is a backstop for any other creation path.
const VEIL_CASTER_CLASSES = new Set(["elementalist", "street-priest", "technomancer"]);

function arcaneSeveranceBlock(actor, item) {
  if (actor?.type !== "hero") return null;
  const dsid = item.system?._dsid;
  if ((item.type === "class") && VEIL_CASTER_CLASSES.has(dsid) && isCyborg(actor)) {
    return game.i18n.format("GHOSTWIRE.ArcaneSeverance.ClassBlocked", { actor: actor.name, name: item.name });
  }
  const casterClass = actor.items.find(i => (i.type === "class") && VEIL_CASTER_CLASSES.has(i.system._dsid));
  if ((item.type === "ancestry") && (dsid === "cyborg") && casterClass) {
    return game.i18n.format("GHOSTWIRE.ArcaneSeverance.AncestryBlocked", { actor: actor.name, name: casterClass.name });
  }
  return null;
}

function patchArcaneSeverance() {
  const HeroSheet = ds.applications.sheets?.DrawSteelHeroSheet;
  if (!HeroSheet?.prototype._onDropItem) {
    console.warn(`${MODULE_ID} | DrawSteelHeroSheet#_onDropItem not found; Arcane Severance is only checked on item creation`);
    return;
  }
  const onDropItem = HeroSheet.prototype._onDropItem;
  HeroSheet.prototype._onDropItem = async function(event, item) {
    const message = (this.actor.uuid !== item.parent?.uuid) && arcaneSeveranceBlock(this.actor, item);
    if (message) {
      ui.notifications.warn(message);
      return null;
    }
    return onDropItem.call(this, event, item);
  };
}

Hooks.on("preCreateItem", (item, data, options, userId) => {
  if (userId !== game.user.id) return;
  const message = arcaneSeveranceBlock(item.parent, item);
  if (!message) return;
  ui.notifications.warn(message);
  return false;
});

// Chrome install: block Cyborgs and installs the hero can't afford, then spend Integrity once the implant is on the sheet.
Hooks.on("preCreateItem", (item, data, options, userId) => {
  const chrome = item.getFlag(MODULE_ID, "chrome");
  const actor = item.parent;
  if (!chrome || (userId !== game.user.id) || (actor?.type !== "hero")) return;
  const format = key => game.i18n.format(`GHOSTWIRE.Integrity.${key}`, { actor: actor.name, name: item.name, cost: chrome.integrity, value: getIntegrity(actor).value });
  if (isCyborg(actor)) {
    ui.notifications.warn(format("CyborgBlocked"));
    return false;
  }
  if (getIntegrity(actor).value < chrome.integrity) {
    ui.notifications.warn(format("Insufficient"));
    return false;
  }
  const cap = CHROME_SLOT_CAPS[chrome.location];
  const count = actor.items.filter(i => i.getFlag(MODULE_ID, "chrome")?.location === chrome.location).length;
  if (cap && (count >= cap)) {
    const location = game.i18n.localize(`GHOSTWIRE.Chrome.Locations.${chrome.location}`);
    ui.notifications.warn(game.i18n.format("GHOSTWIRE.Integrity.SlotFull", { actor: actor.name, name: item.name, location, count, cap }));
    return false;
  }
});

Hooks.on("createItem", (item, options, userId) => {
  const chrome = item.getFlag(MODULE_ID, "chrome");
  const actor = item.parent;
  if (!chrome || (userId !== game.user.id) || (actor?.type !== "hero") || isCyborg(actor)) return;
  const { value, max } = getIntegrity(actor);
  const remaining = Math.max(0, value - chrome.integrity);
  // Chrome spends Body Integrity only. Do not write flags.<module>.taint here (B80).
  setIntegrity(actor, remaining);
  ui.notifications.info(game.i18n.format("GHOSTWIRE.Integrity.Installed", { name: item.name, cost: chrome.integrity, value: remaining, max }));
  grantChromeItems(item, chrome);
});

// Implants that grant abilities (Implant Weapon -> Spur Strike): add them on install, tagged with the implant's id.
async function grantChromeItems(item, chrome) {
  if (!chrome.grants?.length) return;
  const sources = (await Promise.all(chrome.grants.map(uuid => fromUuid(uuid)))).filter(Boolean);
  const data = sources.map(source => {
    const itemData = game.items.fromCompendium(source, { clearFolder: true });
    foundry.utils.setProperty(itemData, `flags.${MODULE_ID}.grantedBy`, item.id);
    return itemData;
  });
  if (data.length) await item.parent.createEmbeddedDocuments("Item", data);
}

// Chrome removal returns 75% of the implant's Integrity (round down); the rest is permanent scarring.
Hooks.on("deleteItem", (item, options, userId) => {
  const chrome = item.getFlag(MODULE_ID, "chrome");
  const actor = item.parent;
  if (!chrome || (userId !== game.user.id) || (actor?.type !== "hero") || isCyborg(actor)) return;
  const { value, max } = getIntegrity(actor);
  const refund = Math.floor(chrome.integrity * 0.75);
  const restored = Math.min(max, value + refund);
  setIntegrity(actor, restored);
  ui.notifications.info(game.i18n.format("GHOSTWIRE.Integrity.Removed", { name: item.name, refund, value: restored, max }));
  const granted = actor.items.filter(i => i.getFlag(MODULE_ID, "grantedBy") === item.id).map(i => i.id);
  if (granted.length) actor.deleteEmbeddedDocuments("Item", granted);
});

// Item sheet: chrome and catalog items (gear, mods, matrix, vehicles, foci) show their grade and ¥ under the name.
// Draw Steel treasure has no price field, so price lives in flags.draw-steel-ghostwire.<type>.price.
const formatYen = price => `¥${Number(price ?? 0).toLocaleString(game.i18n.lang)}`;
// Matrix before mod: deck programs and RCC autosofts carry both, and the matrix flag has their ¥ and echelon (B20d).
const CATALOG_FLAGS = ["gear", "matrix", "mod", "vehicle", "focus"];

function catalogLine(entry, item) {
  const parts = [
    entry.echelon ? game.i18n.format("GHOSTWIRE.Gear.SheetLine.Echelon", { echelon: entry.echelon }) : game.i18n.localize("GHOSTWIRE.Gear.SheetLine.NoGrade"),
  ];
  if (entry.availability) parts.push(game.i18n.localize(`GHOSTWIRE.Gear.Availability.${entry.availability}`));
  parts.push(entry.price != null ? `${formatYen(entry.price)}${entry.priceNote ?? ""}` : (entry.priceText ?? "—"));
  if (entry.slotCost) parts.push(game.i18n.format("GHOSTWIRE.Gear.SheetLine.SlotCost", { slots: entry.slotCost }));
  // Owned hosts show used / max (B20c mod install tracker); catalog copies show capacity only.
  else if (entry.modSlots) parts.push(modSlotsLabel(item) ?? game.i18n.format("GHOSTWIRE.Gear.SheetLine.ModSlots", { slots: entry.modSlots }));
  return parts.join(" · ");
}

Hooks.on("renderDrawSteelItemSheet", (app, element) => {
  const chrome = app.document.getFlag(MODULE_ID, "chrome");
  const catalog = CATALOG_FLAGS.map(key => app.document.getFlag(MODULE_ID, key)).find(Boolean);
  const name = element.querySelector(".sheet-header .document-name");
  if (!(chrome || catalog) || !name || element.querySelector(".ghostwire-chrome-line")) return;
  const line = document.createElement("div");
  line.className = "ghostwire-chrome-line";
  line.textContent = chrome
    ? game.i18n.format("GHOSTWIRE.Chrome.SheetLine", {
      grade: game.i18n.localize(`GHOSTWIRE.Chrome.Grades.${chrome.grade}`),
      location: game.i18n.localize(`GHOSTWIRE.Chrome.Locations.${chrome.location}`),
      integrity: chrome.integrity,
      price: formatYen(chrome.price),
      availability: game.i18n.localize(`GHOSTWIRE.Chrome.Availability.${chrome.availability}`),
    })
    : catalogLine(catalog, app.document);
  name.after(line);
});

// Hero sheet: a Body Integrity fieldset at the top of the Stats tab (current / max inputs, or N/A for Cyborgs).
Hooks.on("renderDrawSteelHeroSheet", (app, element) => {
  const stats = element.querySelector("section.tab[data-tab='stats']");
  if (!stats || stats.querySelector(".ghostwire-integrity")) return;
  const actor = app.document;

  const fieldset = document.createElement("fieldset");
  fieldset.className = "ghostwire-integrity flexrow";
  const legend = document.createElement("legend");
  legend.textContent = game.i18n.localize("GHOSTWIRE.Integrity.Label");
  legend.dataset.tooltip = game.i18n.localize("GHOSTWIRE.Integrity.Hint");
  fieldset.append(legend);

  if (isCyborg(actor)) {
    const note = document.createElement("p");
    note.className = "hint";
    note.textContent = game.i18n.localize("GHOSTWIRE.Integrity.CyborgNA");
    fieldset.append(note);
  } else {
    const integrity = getIntegrity(actor);
    for (const key of ["value", "max"]) {
      const group = document.createElement("div");
      group.className = "form-group stacked";
      const label = document.createElement("label");
      label.textContent = game.i18n.localize(`GHOSTWIRE.Integrity.${key === "value" ? "Current" : "Max"}`);
      const input = document.createElement("input");
      Object.assign(input, { type: "number", min: 0, step: 1, value: integrity[key], disabled: !app.isEditable });
      // Unnamed input handled here, so the sheet's own form submit never sees it.
      input.addEventListener("change", event => {
        event.stopPropagation();
        const number = Math.max(0, Math.floor(Number(input.value) || 0));
        actor.update({ [`flags.${MODULE_ID}.integrity.${key}`]: number });
      });
      group.append(label, input);
      fieldset.append(group);
    }
  }

  const resources = stats.querySelector("fieldset.resources");
  if (resources) resources.after(fieldset);
  else stats.prepend(fieldset);
});

// Hero sheet: a read-only Wired fieldset under Body Integrity showing the connection state.
Hooks.on("renderDrawSteelHeroSheet", (app, element) => {
  const stats = element.querySelector("section.tab[data-tab='stats']");
  if (!stats || stats.querySelector(".ghostwire-wired")) return;
  const state = getWiredState(app.document);
  const fieldset = document.createElement("fieldset");
  fieldset.className = `ghostwire-wired state-${state}`;
  const legend = document.createElement("legend");
  legend.textContent = game.i18n.localize("GHOSTWIRE.Wired.Label");
  legend.dataset.tooltip = game.i18n.localize("GHOSTWIRE.Wired.Hint");
  const value = document.createElement("span");
  value.className = "ghostwire-wired-state";
  value.textContent = game.i18n.localize(`GHOSTWIRE.Wired.States.${state}`);
  const hint = document.createElement("span");
  hint.className = "hint";
  hint.textContent = game.i18n.localize(`GHOSTWIRE.Wired.StateHints.${state}`);
  fieldset.append(legend, value, hint);
  const anchor = stats.querySelector(".ghostwire-integrity") ?? stats.querySelector("fieldset.resources");
  if (anchor) anchor.after(fieldset);
  else stats.prepend(fieldset);
});

// Hero sheet: Changer form control (B50b) under the Wired fieldset. Clicking a form runs setChangerForm: all of that
// form's Forms-trait effects on, the other forms' off, then the art swap.
const CHANGER_FORMS = ["human", "hybrid", "beast"];

Hooks.on("renderDrawSteelHeroSheet", (app, element) => {
  const stats = element.querySelector("section.tab[data-tab='stats']");
  if (!stats || stats.querySelector(".ghostwire-changer-forms")) return;
  const actor = app.document;
  const formEffects = [...actor.allApplicableEffects()].filter(e => CHANGER_FORMS.includes(e.getFlag(MODULE_ID, "changerForm")));
  const effects = Object.groupBy(formEffects, e => e.getFlag(MODULE_ID, "changerForm"));
  if (foundry.utils.isEmpty(effects)) return;
  const isActive = form => effects[form]?.some(e => !e.disabled);
  const active = CHANGER_FORMS.find(isActive);
  const art = actor.getFlag(MODULE_ID, "changer") ?? {};

  const fieldset = document.createElement("fieldset");
  fieldset.className = "ghostwire-changer-forms";
  const legend = document.createElement("legend");
  legend.textContent = game.i18n.localize("GHOSTWIRE.Peoples.Changer.Forms.Name");
  legend.dataset.tooltip = game.i18n.localize("GHOSTWIRE.Peoples.Changer.Forms.Hint");
  fieldset.append(legend);

  const buttons = document.createElement("div");
  buttons.className = "ghostwire-changer-form-buttons";
  for (const form of CHANGER_FORMS) {
    if (!effects[form]) continue;
    const key = `GHOSTWIRE.Peoples.Changer.Forms.${form.capitalize()}`;
    const button = document.createElement("button");
    Object.assign(button, { type: "button", textContent: game.i18n.localize(`${key}.Label`), disabled: !actor.isOwner });
    button.classList.toggle("active", form === active);
    button.setAttribute("aria-pressed", String(form === active));
    button.dataset.tooltip = game.i18n.localize(`${key}.Description`);
    button.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      setChangerForm(formEffects, form, actor);
    });
    buttons.append(button);
  }
  fieldset.append(buttons);

  const artRow = document.createElement("div");
  artRow.className = "ghostwire-changer-form-art";
  const artKeys = { human: "humanArt", hybrid: "hybridArt", beast: "beastArt" };
  for (const form of CHANGER_FORMS) {
    const flagKey = artKeys[form];
    const path = art[flagKey] ?? "";
    const cell = document.createElement("div");
    cell.className = "ghostwire-changer-form-art-slot";
    const label = document.createElement("label");
    label.textContent = game.i18n.localize(`GHOSTWIRE.Peoples.Changer.Forms.${form.capitalize()}.Label`);
    const thumb = document.createElement("img");
    thumb.alt = "";
    if (path) thumb.src = path;
    else thumb.classList.add("empty");
    const pick = document.createElement("button");
    Object.assign(pick, {
      type: "button",
      textContent: game.i18n.localize("GHOSTWIRE.Peoples.Changer.Forms.Art.Pick"),
      disabled: !actor.isOwner,
    });
    pick.dataset.tooltip = game.i18n.localize("GHOSTWIRE.Peoples.Changer.Forms.Art.Hint");
    pick.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      const fp = new FilePicker({
        type: "image",
        current: path || actor.img,
        callback: async src => {
          await actor.setFlag(MODULE_ID, `changer.${flagKey}`, src);
          const activeNow = CHANGER_FORMS.find(isActive);
          if (activeNow === form) await syncChangerFormArt(actor, form);
          else if (app.rendered) app.render();
        },
      });
      fp.browse();
    });
    const clear = document.createElement("button");
    Object.assign(clear, {
      type: "button",
      textContent: game.i18n.localize("GHOSTWIRE.Peoples.Changer.Forms.Art.Clear"),
      disabled: !actor.isOwner || !path,
    });
    clear.addEventListener("click", async event => {
      event.preventDefault();
      event.stopPropagation();
      await actor.unsetFlag(MODULE_ID, `changer.${flagKey}`);
      if (app.rendered) app.render();
    });
    cell.append(label, thumb, pick, clear);
    artRow.append(cell);
  }
  fieldset.append(artRow);

  const anchor = stats.querySelector(".ghostwire-wired") ?? stats.querySelector(".ghostwire-integrity")
    ?? stats.querySelector("fieldset.resources");
  if (anchor) anchor.after(fieldset);
  else stats.prepend(fieldset);
});
