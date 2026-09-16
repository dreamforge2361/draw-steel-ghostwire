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

  patchPreviousLifeFilter();
});

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
