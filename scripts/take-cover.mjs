// 0.3.133 (B) — Take Cover, the universal Defend swap, finally does something.
//
// Take Cover is Ghostwire's copy of Draw Steel's Defend main action (`src/packs/abilities/take-cover.json`,
// `_dsid` "defend", swapped in by `DEFAULT_ITEM_SWAPS` in scripts/module.mjs), so **every hero has it**,
// pregens included. Up to 0.3.132 using it applied nothing: the card carried a 2-bane Active Effect that
// only landed if somebody clicked the `[[/apply]]` link in its description, and in practice nobody did.
//
// Michael's lock (2026-09-24) replaces the whole thing:
//
//   * Using the card **applies Cover/Conceal to the user** — the F13 status, the same one the Scout's
//     Conceal grants. One bane on ranged attack rolls against the token; melee is untouched.
//   * It lasts **until the hero moves**. The moment their token changes square, it drops.
//   * The old 2-bane effect and the double edge on resist tests are **retired** — not weakened, gone.
//
// Two things make this harder than "toggle a status":
//
//  1. **Only Take Cover's cover is mortal.** The Scout's Conceal grants the same status and it
//     deliberately survives movement. So cover carries a *source list*
//     (`flags.draw-steel-ghostwire.coverSources`, scripts/cover-conceal.mjs) and this file only ever
//     takes `take-cover` back out. A Scout who took cover *and* rolled Conceal keeps their cover when
//     they move; a Director's hand-toggled cover — no sources at all — is never touched.
//  2. **Every existing hero already owns a copy of the old card.** Rebuilding the pack fixes the
//     compendium and nothing on anybody's sheet. So this file recognises the ability by `_dsid` and
//     `_id` rather than by the effect that used to be on it, and a GM-only `ready` migration strips
//     the retired Active Effect from embedded copies in the world and refreshes their description.
//
// Helpers above the Foundry divider are Foundry-free so tools/wave-03133-smoke.mjs can walk them in Node.

import {
  COVER_SOURCE_TAKE_COVER, addCoverSource, coverConcealEffect, dropCoverSource,
} from "./cover-conceal.mjs";
import { movedSquare } from "./conceal.mjs";
import { abilityFromMessage } from "./token-light.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const L = "GHOSTWIRE.Abilities.TakeCover";

/** The pack row. `_dsid` is "defend" because it *is* Draw Steel's Defend action, reskinned. */
export const TAKE_COVER_DSID = "defend";
export const TAKE_COVER_ID = "1W0HIoL2SAcbTU6W";
/** The 2-bane Active Effect retired in 0.3.133. Kept here only so the migration can find and delete it. */
export const RETIRED_TAKE_COVER_EFFECT_ID = "TYggdI2Kwa302NjW";
/** The description key the card and every embedded copy must end up pointing at. */
export const TAKE_COVER_DESCRIPTION_KEY = `${L}.Description`;

/**
 * Is this the Take Cover card?
 *
 * By `_dsid` first, because that is what survives a Director duplicating the ability onto a sheet,
 * and by compendium `_id` second, because an embedded copy keeps the source id even if its `_dsid`
 * is edited. Either is enough.
 *
 * @param {object} ability  An Item or a plain `{_id, type, system}` shape.
 * @returns {boolean}
 */
export function isTakeCover(ability) {
  if (!ability || (ability.type !== "ability")) return false;
  return (ability.system?._dsid === TAKE_COVER_DSID) || (ability._id === TAKE_COVER_ID) || (ability.id === TAKE_COVER_ID);
}

/**
 * What a world copy of Take Cover still needs cleaning up.
 *
 * Pure so the smoke can run it over the committed pregen JSON without a world.
 *
 * @param {object} ability  `{effects: [{_id}], system: {effects: {...}}}`
 * @returns {{retiredEffectIds: string[], clean: boolean}}
 */
export function takeCoverCleanup(ability) {
  const retiredEffectIds = [...(ability?.effects ?? [])]
    .map(e => e?._id ?? e?.id)
    .filter(id => id === RETIRED_TAKE_COVER_EFFECT_ID);
  return { retiredEffectIds, clean: retiredEffectIds.length === 0 };
}

/* ============================================ Foundry registration */

function registerSettings() {
  game.settings.register(MODULE_ID, "takeCoverApplyOnUse", {
    name: `${L}.Settings.Apply.Name`, hint: `${L}.Settings.Apply.Hint`,
    scope: "world", config: true, type: Boolean, default: true,
  });
  // Bumped with the wave, so the strip below runs once per upgrade rather than once per boot.
  game.settings.register(MODULE_ID, "takeCoverMigration", {
    scope: "world", config: false, type: String, default: "",
  });
}

export const TAKE_COVER_MIGRATION_VERSION = "0.3.133";

/**
 * Put the hero behind cover.
 * @returns {Promise<boolean>} whether cover was newly applied.
 */
export async function applyTakeCover(actor, { silent = false } = {}) {
  if (!actor) return false;
  const fresh = await addCoverSource(actor, COVER_SOURCE_TAKE_COVER);
  // cover-conceal.mjs already announces the status itself (its own `createActiveEffect` hook and the
  // `coverConcealChat` setting), so this only says the part that file cannot know: it ends on a move.
  if (!silent && fresh) ui.notifications.info(game.i18n.format(`${L}.Chat.Taken`, { actor: actor.name }));
  return fresh;
}

/** Drop the Take Cover source. Scout Conceal's cover, and a Director's, stay exactly where they are. */
export async function dropTakeCover(actor, { silent = false } = {}) {
  const dropped = await dropCoverSource(actor, COVER_SOURCE_TAKE_COVER);
  if (dropped && !silent) ui.notifications.info(game.i18n.format(`${L}.Chat.Moved`, { actor: actor.name }));
  return dropped;
}

/**
 * Strip the retired 2-bane effect off one Actor's embedded Take Cover copies, and repoint the
 * description at the rewritten key. Idempotent: an already-clean sheet is not written to.
 * @returns {Promise<number>} embedded copies changed.
 */
export async function migrateTakeCover(actor) {
  if (!actor?.isOwner) return 0;
  let changed = 0;
  for (const item of actor.items ?? []) {
    if (!isTakeCover(item)) continue;
    const { retiredEffectIds } = takeCoverCleanup(item.toObject());
    if (retiredEffectIds.length) {
      await item.deleteEmbeddedDocuments("ActiveEffect", retiredEffectIds);
      changed++;
    }
    // The card's one "before" effect block holds the printed rule; point it back at the lang key so a
    // sheet that cached the old prose (with its dead [[/apply]] link) prints the new text.
    const before = item.system?.effects?.before0000000000;
    if (before && (before.description !== TAKE_COVER_DESCRIPTION_KEY)) {
      await item.update({ "system.effects.before0000000000.description": TAKE_COVER_DESCRIPTION_KEY });
      changed++;
    }
  }
  return changed;
}

async function migrateWorld() {
  if (!game.user.isGM) return;
  if (game.settings.get(MODULE_ID, "takeCoverMigration") === TAKE_COVER_MIGRATION_VERSION) return;
  let changed = 0;
  for (const actor of game.actors ?? []) {
    if (actor.pack) continue;
    changed += await migrateTakeCover(actor);
  }
  await game.settings.set(MODULE_ID, "takeCoverMigration", TAKE_COVER_MIGRATION_VERSION);
  if (changed) console.log(`${MODULE_ID} | Take Cover migration ${TAKE_COVER_MIGRATION_VERSION}: ${changed} embedded copy/copies cleaned`);
}

export function registerTakeCover() {
  registerSettings();

  // Using the card is the trigger. Draw Steel emits no ability-use hook, so — exactly as
  // scripts/conceal.mjs, scripts/sfx.mjs and scripts/sprites.mjs do — the signal is the chat message
  // `AbilityModel#use` creates, and the client that rolled it does the work.
  Hooks.on("createChatMessage", async (message, options, userId) => {
    if ((userId !== game.user.id) || !game.settings.get(MODULE_ID, "takeCoverApplyOnUse")) return;
    const ability = abilityFromMessage(message);
    if (!isTakeCover(ability)) return;
    const actor = ability.parent;
    if (!(actor instanceof Actor) || !actor.isOwner) return;
    await applyTakeCover(actor);
  });

  // Moving ends it. The pre-hook still holds the old coordinates, so the pair compares *squares*
  // rather than pixels — a nudge inside the same cell is not a move, and a teleport, a shift and a
  // forced move all are. Same shape as the Invisible drop in scripts/conceal.mjs, deliberately.
  Hooks.on("preUpdateToken", (token, changes, options) => {
    if ((changes.x === undefined) && (changes.y === undefined)) return;
    if (!coverConcealEffect(token.actor)) return;
    const moved = movedSquare({
      from: { x: token.x, y: token.y },
      to: { x: changes.x ?? token.x, y: changes.y ?? token.y },
      grid: token.parent?.grid?.size ?? canvas?.grid?.size ?? 100,
    });
    if (moved) foundry.utils.setProperty(options, `${MODULE_ID}.takeCoverMoved`, true);
  });

  Hooks.on("updateToken", async (token, changes, options, userId) => {
    if (userId !== game.user.id) return;
    if (!foundry.utils.getProperty(options, `${MODULE_ID}.takeCoverMoved`)) return;
    const actor = token.actor;
    if (!actor?.isOwner) return;
    await dropTakeCover(actor);
  });

  Hooks.once("ready", () => migrateWorld());

  const module = game.modules.get(MODULE_ID);
  if (module) {
    module.api = {
      ...(module.api ?? {}),
      TAKE_COVER_DSID,
      applyTakeCover,
      dropTakeCover,
      isTakeCover,
      migrateTakeCover,
      takeCoverCleanup,
    };
  }
  console.log(`${MODULE_ID} | Take Cover registered (applies Cover/Conceal on use · ends on a square change)`);
}
