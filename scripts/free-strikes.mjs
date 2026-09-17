// B44c — Ghostwire does not use Draw Steel's generic Free Strikes.
//
// In Draw Steel a weapon is inventory flavour and every hero gets **Melee Free Strike** and
// **Ranged Free Strike** from `ds.CONFIG.hero.defaultItems`. Ghostwire replaces that with B49:
// each weapon on the sheet spawns its own "Fire <weapon>" / "Strike with <weapon>" ability, carrying
// that weapon's range band and damage. Two generic strikes on top of those are noise, so they go.
//
// Matching is deliberately narrow. `system.category === "freeStrike"` is NOT a safe test: the system
// files **Mind Spike** (Talent) and **Hurl Element** (Elementalist) under the same category, and
// Ghostwire hands Hurl Element to Kaïs. So we match the two generics by their own `_dsid`, by the
// system compendium ids they are copied from, and by name as a last resort.
const MODULE_ID = "draw-steel-ghostwire";

const FREE_STRIKE_DSIDS = new Set(["melee-free-strike", "ranged-free-strike"]);
const FREE_STRIKE_IDS = new Set(["wU69Y06G9lYFrvp6", "eqUobBcm81mqZVgJ"]); // Melee / Ranged Free Strike
const FREE_STRIKE_UUIDS = [...FREE_STRIKE_IDS].map(id => `Compendium.draw-steel.abilities.Item.${id}`);
const FREE_STRIKE_NAMES = new Set(["melee free strike", "ranged free strike"]);

/**
 * Is this item one of the two generic Free Strikes?
 * Class abilities that merely share the freeStrike category (Mind Spike, Hurl Element) are not.
 */
export function isGenericFreeStrike(item) {
  if (item?.type !== "ability") return false;
  if (FREE_STRIKE_DSIDS.has(item.system?._dsid)) return true;
  const sourceId = item._stats?.compendiumSource ?? item.flags?.core?.sourceId ?? "";
  if (FREE_STRIKE_IDS.has(String(sourceId).split(".").pop())) return true;
  return FREE_STRIKE_NAMES.has(String(item.name ?? "").trim().toLowerCase());
}

/** Strip both generics from one actor. Returns how many were removed. */
export async function stripFreeStrikes(actor) {
  if (!actor?.isOwner) return 0;
  const ids = actor.items.filter(isGenericFreeStrike).map(i => i.id);
  if (!ids.length) return 0;
  await actor.deleteEmbeddedDocuments("Item", ids);
  return ids.length;
}

export function registerFreeStrikeStrip() {
  // Cheapest fix first: heroes never get them in the first place.
  const defaults = ds.CONFIG?.hero?.defaultItems;
  if (defaults) for (const uuid of FREE_STRIKE_UUIDS) defaults.delete(uuid);

  // NPCs and any other path that still adds one: take it back off.
  Hooks.on("createItem", (item, options, userId) => {
    if (userId !== game.user.id) return;
    const actor = item?.parent;
    if (!(actor instanceof Actor) || !actor.isOwner) return;
    if (isGenericFreeStrike(item)) actor.deleteEmbeddedDocuments("Item", [item.id]);
  });

  // Sheets that already carry them — including anything imported from a pack.
  Hooks.once("ready", async () => {
    let removed = 0;
    for (const actor of game.actors) removed += await stripFreeStrikes(actor);
    if (removed) console.log(`${MODULE_ID} | removed ${removed} generic Free Strike(s) from existing actors`);
  });

  Hooks.on("createActor", (actor, options, userId) => {
    if (userId === game.user.id) stripFreeStrikes(actor);
  });

  const module = game.modules.get(MODULE_ID);
  if (module) module.api = { ...(module.api ?? {}), stripFreeStrikes, isGenericFreeStrike };
}
