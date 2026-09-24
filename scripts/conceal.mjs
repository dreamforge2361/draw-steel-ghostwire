// 0.3.124 (B2) — Conceal, the free Scout maneuver, and the Invisible status its high tier buys.
//
// Michael's lock: **every** Scout gets Conceal at 1st level, whatever their subclass, and it costs
// nothing. It is granted from the Scout class's own L1 `Features` itemGrant (sort 4000) alongside
// Advantage and Hesitation is Weakness, so Hunter, Ghost and Face all walk in with it.
//
// The card's three tiers:
//
//   low  (≤11)   nothing happens.
//   mid  (12–16) Cover/Conceal on yourself — the F13 status, reused, never a second cover effect.
//   high (17+)   Cover/Conceal **and** Invisible, and the Invisible lasts only until you move.
//
// Two things here are not decoration:
//
//  * **Invisible is real.** Draw Steel ships ten conditions and none of them is invisibility, and
//    Foundry's own vision pipeline hides a token only for the status id named by
//    `CONFIG.specialStatusEffects.INVISIBLE`. So this file registers `ghostwire-invisible` as a
//    status *and* points that special at it, which is what makes `basicSight` stop drawing the
//    token and the `seeInvisibility` detection mode — already granted by every Ghostwire optic
//    through F20 (scripts/sights.mjs) — start drawing it again. Without the second half it would be
//    an icon on a token everybody can still see.
//  * **Moving drops Invisible and only Invisible.** Cover/Conceal survives, because cover is about
//    where you are standing and invisibility is about not having just given yourself away. The hook
//    is `preUpdateToken` → `updateToken`: the pre-hook still holds the old coordinates, so the pair
//    compares *squares* rather than pixels and ignores a Director nudging a token inside its own
//    cell. A teleport, a shift and a forced move are all x/y writes, so all three count.
//
// Helpers above the "Foundry registration" divider are Foundry-free so
// tools/scout-sp-wave-03124-smoke.mjs can run them in Node.

import { COVER_CONCEAL_ID, COVER_SOURCE_CONCEAL, addCoverSource } from "./cover-conceal.mjs";
import { messageCritical } from "./crit-feedback.mjs";
import { abilityFromMessage } from "./token-light.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const L = "GHOSTWIRE.Conceal";

/** `system._dsid` of the pack row this file automates. */
export const CONCEAL_DSID = "scout-conceal";

/** The status. `_id` must be exactly 16 characters — Foundry uses it as the ActiveEffect id. */
export const INVISIBLE_STATUS = Object.freeze({
  id: "ghostwire-invisible",
  _id: "gwInvisible00000",
  name: `${L}.Invisible.Label`,
  img: "icons/svg/invisible.svg",
  order: 3,
});

export const INVISIBLE_ID = INVISIBLE_STATUS.id;

/**
 * What Conceal leaves on the Scout, by rolled tier.
 *
 * Order matters for the chat line, not for the rules: Cover/Conceal comes first because the high
 * tier is "as middle, and also invisible", not a different effect.
 *
 * @param {number|string|null} tier  1, 2 or 3 as Draw Steel reported it.
 * @returns {string[]} status ids to switch on, in order. Empty on a low result.
 */
export function concealStatusesForTier(tier) {
  const n = Math.floor(Number(tier));
  if (!Number.isFinite(n) || (n <= 1)) return [];
  return (n >= 3) ? [COVER_CONCEAL_ID, INVISIBLE_ID] : [COVER_CONCEAL_ID];
}

/**
 * Did this token change square?
 *
 * Pixel coordinates floored by grid size — a drag that lands back inside the same cell is not a
 * move, and a 0.5-size Beast token still occupies exactly one cell for this purpose.
 *
 * @param {object} opts
 * @param {{x: number, y: number}|null} opts.from
 * @param {{x: number, y: number}|null} opts.to
 * @param {number} [opts.grid]  Scene grid size in pixels.
 * @returns {boolean}
 */
export function movedSquare({ from = null, to = null, grid = 100 } = {}) {
  if (!from || !to) return false;
  const size = (Number(grid) > 0) ? Number(grid) : 1;
  const cell = p => `${Math.floor((Number(p.x) || 0) / size)},${Math.floor((Number(p.y) || 0) / size)}`;
  return cell(from) !== cell(to);
}

/* ============================================ Foundry registration */

function registerSettings() {
  game.settings.register(MODULE_ID, "concealApplyOnUse", {
    name: `${L}.Settings.Apply.Name`, hint: `${L}.Settings.Apply.Hint`,
    scope: "world", config: true, type: Boolean, default: true,
  });
}

/**
 * Register the status and make it mean something.
 *
 * `CONFIG.statusEffects` is an id-keyed proxy over the array in Foundry 14 (the same shape
 * scripts/cover-conceal.mjs and scripts/module.mjs assign through), so one write both registers the
 * status and lists it in the token HUD palette.
 */
function registerInvisibleStatus() {
  CONFIG.statusEffects[INVISIBLE_STATUS.id] = { ...INVISIBLE_STATUS };
  const special = CONFIG.specialStatusEffects ?? {};
  const current = special.INVISIBLE;
  // Core defaults this to "invisible", an id nothing in Draw Steel or Ghostwire registers, so the
  // special is unclaimed and we can take it. If some other module has already pointed it at a real
  // status, leave it alone and say so — two modules fighting over token visibility is worse than
  // Conceal's high tier reading as a strong Cover/Conceal.
  if (!current || !CONFIG.statusEffects[current]) special.INVISIBLE = INVISIBLE_ID;
  else if (current !== INVISIBLE_ID) {
    console.warn(`${MODULE_ID} | CONFIG.specialStatusEffects.INVISIBLE is already "${current}"; Conceal's high tier still applies ${INVISIBLE_ID}, but Foundry will keep drawing the token`);
  }
}

/**
 * Switch a status on without disturbing one the token already carries.
 *
 * 0.3.133 (B): Cover/Conceal goes through `addCoverSource` instead, which records **why** it is on.
 * Take Cover's cover ends when the hero moves and the Scout's does not, so the two have to be
 * distinguishable on the one shared status — see scripts/cover-conceal.mjs. Cover the Scout already
 * has still has `scout-conceal` added to its source list, so re-rolling Conceal does not make the
 * cover mortal.
 */
async function addStatus(actor, id) {
  if (id === COVER_CONCEAL_ID) return addCoverSource(actor, COVER_SOURCE_CONCEAL);
  if (actor.statuses?.has(id)) return false;
  await actor.toggleStatusEffect(id, { active: true });
  return true;
}

/**
 * Apply Conceal's result to the Scout who rolled it.
 * @returns {Promise<string[]>} the status ids this call actually switched on.
 */
export async function applyConceal(actor, tier, { silent = false } = {}) {
  const statuses = concealStatusesForTier(tier);
  if (!statuses.length) {
    if (!silent) ui.notifications.info(game.i18n.format(`${L}.Chat.Nothing`, { actor: actor.name }));
    return [];
  }
  const added = [];
  for (const id of statuses) if (await addStatus(actor, id)) added.push(id);
  if (!silent) {
    const key = statuses.includes(INVISIBLE_ID) ? "Chat.Vanished" : "Chat.Concealed";
    ui.notifications.info(game.i18n.format(`${L}.${key}`, { actor: actor.name }));
  }
  return added;
}

/** Drop Invisible, leaving Cover/Conceal exactly where it is. */
export async function dropInvisible(actor, { silent = false } = {}) {
  if (!actor?.statuses?.has(INVISIBLE_ID)) return false;
  await actor.toggleStatusEffect(INVISIBLE_ID, { active: false });
  if (!silent) ui.notifications.info(game.i18n.format(`${L}.Chat.Moved`, { actor: actor.name }));
  return true;
}

export function registerConceal() {
  registerSettings();
  registerInvisibleStatus();

  // Using the card applies the result. The client that rolled it does the work — the same seam
  // Compile Sprite (scripts/sprites.mjs) and the token light (scripts/token-light.mjs) use.
  Hooks.on("createChatMessage", async (message, options, userId) => {
    if ((userId !== game.user.id) || !game.settings.get(MODULE_ID, "concealApplyOnUse")) return;
    const ability = abilityFromMessage(message);
    if (ability?.system?._dsid !== CONCEAL_DSID) return;
    const actor = ability.parent;
    if (!(actor instanceof Actor) || !actor.isOwner) return;
    // messageCritical reads the tier Draw Steel put on the abilityResult part and already folds a
    // critical up to tier 3 — so a natural 20 on Conceal vanishes the Scout, as it should.
    await applyConceal(actor, messageCritical(message).tier);
  });

  // The pre-hook is where the old coordinates still live; stash the verdict for the post-hook,
  // which is where it is safe to write to the Actor.
  Hooks.on("preUpdateToken", (token, changes, options) => {
    if ((changes.x === undefined) && (changes.y === undefined)) return;
    if (!token.actor?.statuses?.has(INVISIBLE_ID)) return;
    const moved = movedSquare({
      from: { x: token.x, y: token.y },
      to: { x: changes.x ?? token.x, y: changes.y ?? token.y },
      grid: token.parent?.grid?.size ?? canvas?.grid?.size ?? 100,
    });
    if (moved) foundry.utils.setProperty(options, `${MODULE_ID}.concealMoved`, true);
  });

  Hooks.on("updateToken", async (token, changes, options, userId) => {
    if (userId !== game.user.id) return;
    if (!foundry.utils.getProperty(options, `${MODULE_ID}.concealMoved`)) return;
    const actor = token.actor;
    if (!actor?.isOwner) return;
    await dropInvisible(actor);
  });

  const module = game.modules.get(MODULE_ID);
  if (module) {
    module.api = {
      ...(module.api ?? {}),
      INVISIBLE_ID,
      applyConceal,
      concealStatusesForTier,
      dropInvisible,
      movedSquare,
    };
  }
  console.log(`${MODULE_ID} | Conceal registered (${INVISIBLE_ID} · free Scout maneuver · Invisible ends on a square change)`);
}
