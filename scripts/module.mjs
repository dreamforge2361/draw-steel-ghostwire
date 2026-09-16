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
