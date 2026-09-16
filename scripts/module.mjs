const MODULE_ID = "draw-steel-ghostwire";

// Draw Steel copies ds.CONFIG.hero.defaultItems onto every new hero.
// Ghostwire swaps the stock Ride move action for Drive (vehicles, not mounts).
const DS_RIDE = "Compendium.draw-steel.abilities.Item.QXOkflcYF6DITJE3";
const GHOSTWIRE_DRIVE = `Compendium.${MODULE_ID}.abilities.Item.Xc5MebcXHYG1hdQR`;

Hooks.once("init", () => {
  console.log(`${MODULE_ID} | Draw Steel - Ghostwire Build initialized`);
  document.body.classList.add("ghostwire", "ghostwire-theme");

  const defaultItems = ds.CONFIG.hero.defaultItems;
  if (defaultItems.delete(DS_RIDE)) defaultItems.add(GHOSTWIRE_DRIVE);
  else console.warn(`${MODULE_ID} | Ride not found in hero default items; Drive not added`);

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
