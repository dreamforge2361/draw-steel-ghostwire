// F13 (0.3.116) — Cover/Conceal.
//
// Michael lock 2026-09-23: ONE token-level toggle called Cover/Conceal. Cover and Conceal share the
// same effect — while it is on, a **ranged** attack power roll that targets that token takes a
// **bane**. Melee is untouched. No Flanking (F14), no Cyborg Crisis (F15), no cover tiers.
//
// Where it hooks (verified against Draw Steel 1.1.2, not guessed):
// `AbilityModel#use` builds `dialogConfig.context.targets[tokenId].modifiers` from
// `AbilityModel#getTargetModifiers(token)` — the system's own per-target modifier seam, which
// already carries Frightened, Grabbed, Restrained and Surprised. The dialog folds those into
// `target.combinedModifiers` (and re-runs the getter live when the player re-targets), then
// `_processFormData` turns each target into one entry of `config.rolls`, so the bane lands on the
// power roll *for that target only*. Patching `getTargetModifiers` therefore gets: the right roll,
// per target, visible in the dialog before the dice move, and clearable by the player if the
// Director rules otherwise. Injecting into `config.modifiers` instead would have baned every
// target of a multi-target attack, which is not the rule.
//
// The status itself is Foundry-native: a `CONFIG.statusEffects` entry, so it appears in the stock
// token HUD status palette next to the Wired statuses and meat-inert, with no bespoke UI to keep
// alive. In Foundry v14 `CONFIG.statusEffects` is an id-keyed proxy over the array, which is why
// assigning by id (the same shape scripts/module.mjs and scripts/rigger-vertical.mjs use) both
// registers the status and lists it in the HUD.

const MODULE_ID = "draw-steel-ghostwire";
const L = "GHOSTWIRE.CoverConceal";

/** The one status. `_id` must be exactly 16 characters — Foundry uses it as the ActiveEffect id. */
export const COVER_CONCEAL_STATUS = Object.freeze({
  id: "ghostwire-cover-conceal",
  _id: "gwCoverConceal00",
  name: `${L}.Label`,
  img: "icons/svg/shield.svg",
  order: 3,
});

export const COVER_CONCEAL_ID = COVER_CONCEAL_STATUS.id;

/** One bane. Cover and Conceal are the same effect and never stack with themselves. */
export const COVER_CONCEAL_BANES = 1;

/**
 * Is this ability a *ranged* attack for cover purposes?
 *
 * Melee-only is never ranged. A Ghostwire weapon-use ability built by scripts/equipment-use.mjs
 * carries `distance.type: "ranged"` and keywords `["ranged", "strike", "weapon"]`, so every gun in
 * the game reads true here. Area shapes (`cube` / `line` / `wall`) that are thrown or fired from a
 * distance carry the `ranged` keyword and read true as well.
 *
 * A `meleeRanged` ability — one weapon that does both, where the player picks the mode in the roll
 * dialog — deliberately reads **false**. Nothing in the use pipeline says which mode was chosen, and
 * the lock is "melee unaffected"; silently baning a melee swing is worse than a Director adding one
 * bane by hand in the dialog, which is one click away. The director note says so.
 *
 * @param {object} ability
 * @param {string} [ability.distanceType]   `system.distance.type`.
 * @param {Iterable<string>} [ability.keywords]
 * @returns {boolean}
 */
export function isRangedAttack({ distanceType = "", keywords = [] } = {}) {
  const kw = new Set(keywords);
  const melee = kw.has("melee");
  const ranged = kw.has("ranged");
  if (melee && !ranged) return false;
  if (distanceType === "melee") return false;
  if (distanceType === "meleeRanged") return false;
  if (distanceType === "ranged") return !melee;
  return ranged && !melee;
}

/**
 * Banes this ability's roll takes for the target's Cover/Conceal.
 * @param {object} opts
 * @param {boolean} opts.ranged   isRangedAttack for the ability being used.
 * @param {boolean} opts.covered  The *target* carries the Cover/Conceal status.
 * @returns {number} 0 or 1.
 */
export function coverConcealBanes({ ranged = false, covered = false } = {}) {
  return (ranged && covered) ? COVER_CONCEAL_BANES : 0;
}

/** True when an Actor-like object is behind Cover/Conceal right now. */
export function hasCoverConceal(actor) {
  return !!actor?.statuses?.has?.(COVER_CONCEAL_ID);
}

/* -------------------------------------------- runtime */

function abilityIsRanged(model) {
  return isRangedAttack({
    distanceType: model?.distance?.type ?? model?.parent?.system?.distance?.type ?? "",
    keywords: model?.keywords ?? model?.parent?.system?.keywords ?? [],
  });
}

function patchTargetModifiers() {
  const AbilityModel = CONFIG.Item.dataModels?.ability ?? globalThis.ds?.data?.Item?.AbilityModel;
  if (!AbilityModel?.prototype.getTargetModifiers) {
    console.warn(`${MODULE_ID} | AbilityModel#getTargetModifiers not found; Cover/Conceal applies no bane`);
    return;
  }
  const prior = AbilityModel.prototype.getTargetModifiers;
  AbilityModel.prototype.getTargetModifiers = function(target) {
    const modifiers = prior.call(this, target);
    const banes = coverConcealBanes({
      ranged: abilityIsRanged(this),
      covered: hasCoverConceal(target?.actor),
    });
    if (banes) modifiers.banes += banes;
    return modifiers;
  };
}

/** Announce the toggle so the table knows a target went behind cover. */
function announce(actor, active) {
  if (!game.settings.get(MODULE_ID, "coverConcealChat")) return;
  const key = active ? "Chat.Taken" : "Chat.Dropped";
  const line = game.i18n.format(`${L}.${key}`, { actor: foundry.utils.escapeHTML(actor.name) });
  ui.notifications.info(game.i18n.format(`${L}.${key}`, { actor: actor.name }));
  const hint = active ? `<p class="hint">${game.i18n.localize(`${L}.Hint`)}</p>` : "";
  return ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content: `<div class="ghostwire-cover-conceal-card"><p><strong>${game.i18n.localize(`${L}.Label`)}</strong> — ${line}</p>${hint}</div>`,
    flags: { [MODULE_ID]: { coverConceal: active } },
  });
}

function registerSettings() {
  game.settings.register(MODULE_ID, "coverConcealChat", {
    name: `${L}.Settings.Chat.Name`, hint: `${L}.Settings.Chat.Hint`,
    scope: "world", config: true, type: Boolean, default: true,
  });
}

export function registerCoverConceal() {
  registerSettings();

  CONFIG.statusEffects[COVER_CONCEAL_STATUS.id] = { ...COVER_CONCEAL_STATUS };

  patchTargetModifiers();

  const isCoverEffect = effect => effect?.statuses?.has?.(COVER_CONCEAL_ID);
  Hooks.on("createActiveEffect", (effect, options, userId) => {
    if ((userId !== game.user.id) || !isCoverEffect(effect) || !(effect.parent instanceof Actor)) return;
    announce(effect.parent, true);
  });
  Hooks.on("deleteActiveEffect", (effect, options, userId) => {
    if ((userId !== game.user.id) || !isCoverEffect(effect) || !(effect.parent instanceof Actor)) return;
    announce(effect.parent, false);
  });

  const module = game.modules.get(MODULE_ID);
  if (module) {
    module.api = {
      ...(module.api ?? {}),
      COVER_CONCEAL_ID,
      coverConcealBanes,
      hasCoverConceal,
      isRangedAttack,
    };
  }
  console.log(`${MODULE_ID} | Cover/Conceal: ${COVER_CONCEAL_ID} registered (bane on ranged attacks targeting the token)`);
}
