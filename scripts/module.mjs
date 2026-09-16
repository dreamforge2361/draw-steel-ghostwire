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
});

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
