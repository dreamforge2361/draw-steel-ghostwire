// 0.3.122 — right-click a repickable trait to change the pick.
//
// Michael lock 2026-09-23: **Beast-Hide** (`src/packs/origins/changer/beast-hide-trait.json`) grants
// one damage immunity out of six, and the card says you may change it when you finish a respite. The
// data already says so — the `effectGrant` advancement carries `repick: { respite: "finish" }` and
// Draw Steel caches it in `system._respiteAdvancements.finish`. What it does **not** do, in practice
// at Michael's table, is open the chooser when Take Respite runs. So the player is stuck with the
// immunity they picked at chargen.
//
// This is the missing door, and it is only a door: the repick itself is Draw Steel's own
// `BaseAdvancement#reconfigure()`, which puts up the confirm, opens the real
// EffectGrantConfigurationDialog over the real pool, deletes the granted effect and creates the new
// one. Nothing here re-implements immunity math, and nothing here reads the pool — a pack row that
// adds a seventh immunity tomorrow needs no change in this file.
//
// **Layered Hide** (`layered-hide-trait.json`) carries the identical advancement shape, so it comes
// along free: the rule below is "any owned Item with a repickable effectGrant", not two hard-coded
// DSIDs. Anything that later ships the same shape gets the same right-click.
//
// Helpers above the "Foundry registration" divider are Foundry-free so
// tools/trait-repick-smoke.mjs can run them in Node.

const MODULE_ID = "draw-steel-ghostwire";
const L = "GHOSTWIRE.Repick";

/* -------------------------------------------- pure */

/**
 * Is this advancement one a player may re-pick from the sheet?
 *
 * Three conditions, all read off the advancement itself:
 *  1. It is an `effectGrant` — the shape whose "pick one of these Active Effects" flow
 *     `reconfigure()` knows how to re-open.
 *  2. It declares a repick window (`repick.respite`). An advancement with no window is a permanent
 *     choice and must not get a re-roll button.
 *  3. There is more than one thing in the pool. A pool of one is not a choice.
 */
export function advancementIsRepickable(advancement) {
  if (advancement?.type !== "effectGrant") return false;
  if (!advancement?.repick?.respite) return false;
  const pool = advancement.pool;
  const size = Array.isArray(pool) ? pool.length : (pool?.length ?? pool?.size ?? 0);
  return Number(size) > 1;
}

/** Every repickable advancement in a collection (array, Collection or id-keyed object). */
export function repickableAdvancements(advancements) {
  if (!advancements) return [];
  const list = Array.isArray(advancements)
    ? advancements
    : (typeof advancements[Symbol.iterator] === "function" ? [...advancements] : Object.values(advancements));
  return list.filter(advancementIsRepickable);
}

/**
 * Should the context-menu entry show on this row?
 * Owner-or-GM only, and only on an Item that is actually on an Actor — `reconfigure()` throws
 * otherwise, and a menu entry that throws is worse than no menu entry.
 */
export function repickMenuVisible({ repickable = 0, embedded = false, isOwner = false, isGM = false } = {}) {
  return (repickable > 0) && embedded && (isOwner || isGM);
}

/* ============================================ Foundry registration */

/** The repickable advancements on one owned Item. */
export function itemRepickAdvancements(item) {
  return repickableAdvancements(item?.system?.advancements);
}

function canRepick(item) {
  if (!item) return false;
  return repickMenuVisible({
    repickable: itemRepickAdvancements(item).length,
    embedded: item.parent instanceof Actor,
    isOwner: !!item.parent?.isOwner,
    isGM: !!game.user?.isGM,
  });
}

/**
 * Open Draw Steel's own effectGrant chooser for this Item's repickable advancement.
 *
 * With more than one repickable advancement on the same Item (nothing ships that today) the player
 * picks which one first, rather than the code guessing.
 */
export async function openTraitRepick(item) {
  const advancements = itemRepickAdvancements(item);
  if (!advancements.length) {
    ui.notifications.warn(game.i18n.format(`${L}.Warnings.NotRepickable`, { name: item?.name ?? "" }));
    return null;
  }
  let advancement = advancements[0];
  if (advancements.length > 1) {
    const picked = await foundry.applications.api.DialogV2.wait({
      window: { title: game.i18n.localize(`${L}.Title`) },
      content: `<form class="ghostwire-trait-repick flexcol">
        <p>${game.i18n.format(`${L}.Prompt`, { name: foundry.utils.escapeHTML(item.name) })}</p>
        <select name="advancement">${advancements.map(a =>
    `<option value="${a.id}">${foundry.utils.escapeHTML(a.name || item.name)}</option>`).join("")}</select>
      </form>`,
      buttons: [
        {
          action: "pick",
          label: game.i18n.localize(`${L}.Open`),
          icon: "fa-solid fa-arrow-rotate-right",
          default: true,
          callback: (_event, button) => button.form.elements.advancement.value,
        },
        { action: "cancel", label: game.i18n.localize("Cancel"), icon: "fa-solid fa-xmark" },
      ],
    });
    if (!picked || picked === "cancel") return null;
    advancement = advancements.find(a => a.id === picked) ?? advancement;
  }

  if (advancement.canReconfigure === false) {
    ui.notifications.warn(game.i18n.format(`${L}.Warnings.CannotReconfigure`, { name: item.name }));
    return null;
  }
  try {
    return await advancement.reconfigure();
  } catch (error) {
    console.warn(`${MODULE_ID} | could not reconfigure ${item.name}`, error);
    ui.notifications.error(game.i18n.format(`${L}.Warnings.Failed`, { name: item.name }));
    return null;
  }
}

/**
 * Append the entry to the Hero sheet's own row context menu.
 *
 * Patching `_getDocumentListContextOptions` rather than listening on a hook keeps this next to the
 * other DS prototype patches in scripts/module.mjs, and means the entry sits in the *same* menu as
 * Edit / Delete instead of a second menu fighting the first for the same right-click.
 */
export function registerTraitRepick() {
  const sheets = [
    ds.applications.sheets?.DrawSteelHeroSheet,
    ds.applications.sheets?.DrawSteelNPCSheet,
  ].filter(sheet => typeof sheet?.prototype?._getDocumentListContextOptions === "function");
  if (!sheets.length) {
    console.warn(`${MODULE_ID} | DrawSteelHeroSheet#_getDocumentListContextOptions not found; Beast-Hide has no right-click repick`);
    return;
  }
  for (const Sheet of sheets) {
    const original = Sheet.prototype._getDocumentListContextOptions;
    Sheet.prototype._getDocumentListContextOptions = function() {
      const options = original.call(this);
      options.unshift({
        label: `${L}.MenuLabel`,
        icon: "fa-solid fa-arrow-rotate-right",
        visible: target => canRepick(this._getEmbeddedDocument(target)),
        onClick: (event, target) => openTraitRepick(this._getEmbeddedDocument(target)),
      });
      return options;
    };
  }

  Hooks.once("ready", () => {
    const module = game.modules.get(MODULE_ID);
    if (module) module.api = { ...(module.api ?? {}), openTraitRepick, itemRepickAdvancements };
  });

  console.log(`${MODULE_ID} | Trait repick registered (effectGrant + repick.respite → Draw Steel reconfigure())`);
}
