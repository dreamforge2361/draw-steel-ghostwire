// 0.3.122 — Director: +1 heroic resource.
//
// Michael lock 2026-09-23: a Director hands a hero **one point of their primary heroic resource** —
// the Commander's Influence, the Rigger's Adrenaline, whatever that class names it. Not Surges, not
// Victories, not Hero Tokens. One button, one point, one line in chat.
//
// The write goes through Draw Steel's own `system.updateResource(delta)` →
// `modifyTokenAttribute("hero.primary.value", …)` rather than `actor.update()`, because that path is
// where the class **minimum** is enforced (a Shadow's negative floor, for instance) and where the
// system's own `modifyTokenAttribute` hook fires. Writing the field directly would skip both.
//
// Targeting follows the house Director pattern (scripts/taint.mjs `directorTaintPlusOne`): targeted
// tokens win over controlled ones, and only when nothing is targeted does the selection count.

// Targeted-beats-controlled is already solved in scripts/taint.mjs and already covered by
// tools/taint-smoke.mjs. Reuse it rather than ship a second copy of the same eight lines.
import { collectTaintTargets as resolveDirectorTargets } from "./taint.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const LR = "GHOSTWIRE.Resources.Director";

const loc = (key, data) => (data ? game.i18n.format(`${LR}.${key}`, data) : game.i18n.localize(`${LR}.${key}`));

/**
 * The class-named heroic resource on this actor, or null when there isn't one.
 *
 * A level-0 hero with no class Item still has `system.hero.primary`, but no class to name it and no
 * `coreResource` worth spending — that is the "missing primary" the lock says to refuse gracefully.
 *
 * @param {Actor} actor
 * @returns {{name: string, path: string, target: object, current: number}|null}
 */
export function heroicPrimaryOf(actor) {
  if (actor?.type !== "hero") return null;
  const resource = actor.system?.coreResource;
  if (!resource?.path || !resource.target) return null;
  if (!actor.system?.class) return null;
  const current = Number(foundry.utils.getProperty(resource.target, resource.path));
  if (!Number.isFinite(current)) return null;
  return { name: resource.name, path: resource.path, target: resource.target, current };
}

/**
 * Add `amount` to one hero's primary heroic resource.
 * @returns {Promise<{ok: boolean, reason?: string, name?: string, from?: number, to?: number}>}
 */
export async function grantHeroicPrimary(actor, amount = 1) {
  const primary = heroicPrimaryOf(actor);
  if (!primary) {
    return { ok: false, reason: actor?.type === "hero" ? "noPrimary" : "notHero" };
  }
  const delta = Math.trunc(Number(amount) || 0);
  if (!delta) return { ok: false, reason: "noChange", name: primary.name, from: primary.current, to: primary.current };
  await actor.system.updateResource(delta);
  // Re-read rather than assume current + delta: the class minimum may have clamped it.
  const after = heroicPrimaryOf(actor)?.current ?? primary.current;
  return { ok: true, name: primary.name, from: primary.current, to: after };
}

async function announce(actor, result) {
  const data = { actor: actor.name, resource: result.name, value: result.to, amount: result.to - result.from };
  ui.notifications.info(loc("Notify", data));
  const esc = foundry.utils.escapeHTML;
  await ChatMessage.implementation.create({
    speaker: { alias: loc("Speaker") },
    content: `<div class="ghostwire-resource-chat">`
      + `<header><i class="fa-solid fa-bolt"></i> <span class="gw-resource-kicker">${esc(loc("ChatTitle"))}</span></header>`
      + `<p>${esc(loc("ChatLine", data))}</p></div>`,
    flags: { [MODULE_ID]: { directorResource: "primary-plus-one" } },
  });
}

/**
 * GM-only: +1 primary heroic resource on every targeted hero, else every selected one.
 * A non-hero or a hero with no class is skipped with a warning; its siblings still get their point.
 */
export async function directorHeroicPlusOne({ amount = 1 } = {}) {
  if (!game.user?.isGM) {
    ui.notifications.warn(loc("GMOnly"));
    return [];
  }
  const actors = resolveDirectorTargets({
    targeted: [...(game.user.targets ?? [])],
    controlled: [...(canvas?.tokens?.controlled ?? [])],
  });
  if (!actors.length) {
    ui.notifications.warn(loc("NoTarget"));
    return [];
  }
  const results = [];
  for (const actor of actors) {
    const result = await grantHeroicPrimary(actor, amount);
    results.push({ actor: actor.name, id: actor.id, ...result });
    if (!result.ok) {
      ui.notifications.warn(loc(result.reason === "noPrimary" ? "NoPrimary" : "NotHero", { actor: actor.name }));
      continue;
    }
    await announce(actor, result);
  }
  return results;
}

export function registerDirectorResource() {
  Hooks.once("ready", () => {
    const module = game.modules.get(MODULE_ID);
    if (module) {
      module.api = {
        ...(module.api ?? {}),
        heroicPrimaryOf,
        grantHeroicPrimary,
        directorHeroicPlusOne,
      };
    }
    game.ghostwire = { ...(game.ghostwire ?? {}), directorHeroicPlusOne };
  });

  game.keybindings.register(MODULE_ID, "directorHeroicPlusOne", {
    name: `${LR}.Keybinding`,
    editable: [],
    restricted: true,
    onDown: () => {
      directorHeroicPlusOne();
      return true;
    },
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
  });

  console.log(`${MODULE_ID} | Director +1 heroic resource registered (system.hero.primary.value via updateResource)`);
}
