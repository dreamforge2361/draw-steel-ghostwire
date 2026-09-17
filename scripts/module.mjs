import { registerGhostwireSkills } from "./skills.mjs";

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

Hooks.once("init", () => {
  console.log(`${MODULE_ID} | Draw Steel - Ghostwire Build initialized`);
  document.body.classList.add("ghostwire", "ghostwire-theme");

  const defaultItems = ds.CONFIG.hero.defaultItems;
  for (const [stock, ghostwire] of Object.entries(DEFAULT_ITEM_SWAPS)) {
    if (defaultItems.delete(stock)) defaultItems.add(ghostwire);
    else console.warn(`${MODULE_ID} | ${stock} not found in hero default items; ${ghostwire} not added`);
  }

  // Tech: non-Magic, non-Psionic ability keyword for machine abilities (Cyborg Installed Suite).
  // Draw Steel localizes keyword labels at i18nInit, after this hook.
  ds.CONFIG.abilities.keywords.tech ??= { label: "GHOSTWIRE.Abilities.Keywords.Tech" };

  registerGhostwireSkills();
  patchPreviousLifeFilter();
  patchAddOrigin();
  enforceHeroicResourceCost();
});

// Heroic abilities: Draw Steel's use dialog lets a hero spend Adrenaline (or any heroic resource) they don't have.
// In combat, refuse to use an ability whose cost is more than the hero's current heroic resource.
// Outside combat, heroic abilities stay usable without spending (chapter rule), so nothing is checked.
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
    if ((cost > 0) && (actor?.type === "hero") && actor.inCombat) {
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

// Hero sheet "+ Add Ancestry / Background / Profession" opens the Ghostwire compendiums instead of draw-steel.origins.
const ORIGIN_PACKS = { ancestry: `${MODULE_ID}.origins`, culture: `${MODULE_ID}.backgrounds`, career: `${MODULE_ID}.professions` };
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

// Changer forms: enabling one form effect disables the others, so exactly one form is active.
Hooks.on("updateActiveEffect", (effect, changes, options, userId) => {
  if ((userId !== game.user.id) || (changes.disabled !== false)) return;
  if (!effect.getFlag(MODULE_ID, "changerForm")) return;
  const others = effect.parent.effects.filter(e => (e !== effect) && !e.disabled && e.getFlag(MODULE_ID, "changerForm"));
  if (others.length) effect.parent.updateEmbeddedDocuments("ActiveEffect", others.map(e => ({ _id: e.id, disabled: true })));
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
Hooks.on("preCreateActor", (actor, data, options, userId) => {
  if ((userId !== game.user.id) || (actor.type !== "hero")) return;
  const stats = data._stats ?? {};
  if (stats.duplicateSource || stats.compendiumSource || stats.exportSource) return;
  const updates = { [`flags.${MODULE_ID}.integrity`]: { value: INTEGRITY_START, max: INTEGRITY_START } };
  if (foundry.utils.getProperty(data, "system.hero.wealth") === undefined) updates["system.hero.wealth"] = STARTING_NUYEN;
  actor.updateSource(updates);
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
const CATALOG_FLAGS = ["gear", "mod", "matrix", "vehicle", "focus"];

function catalogLine(entry) {
  const parts = [
    entry.echelon ? game.i18n.format("GHOSTWIRE.Gear.SheetLine.Echelon", { echelon: entry.echelon }) : game.i18n.localize("GHOSTWIRE.Gear.SheetLine.NoGrade"),
  ];
  if (entry.availability) parts.push(game.i18n.localize(`GHOSTWIRE.Gear.Availability.${entry.availability}`));
  parts.push(entry.price != null ? `${formatYen(entry.price)}${entry.priceNote ?? ""}` : (entry.priceText ?? "—"));
  if (entry.slotCost) parts.push(game.i18n.format("GHOSTWIRE.Gear.SheetLine.SlotCost", { slots: entry.slotCost }));
  else if (entry.modSlots) parts.push(game.i18n.format("GHOSTWIRE.Gear.SheetLine.ModSlots", { slots: entry.modSlots }));
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
    : catalogLine(catalog);
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
