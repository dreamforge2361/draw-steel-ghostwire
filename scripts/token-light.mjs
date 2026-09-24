// 0.3.123 — the shared 20-foot glow behind Street Priest **Blessed Light** and Elementalist **Cantrip**.
//
// Michael's lock for both cards is the same sentence: "20 foot light, no damage, no attack." So there is
// one implementation and two callers, and neither card owns any light math of its own — an ability is
// lit by carrying `flags.draw-steel-ghostwire.tokenLight = { feet, toggle }` and nothing else.
//
// Three decisions worth writing down:
//
//  1. **Feet, converted at the scene.** Foundry's `light.bright` / `light.dim` are in *scene* units, and a
//     Draw Steel scene is normally gridded in 1-square steps, not feet. `lightRadius()` reads the scene's
//     own `grid.units` / `grid.distance` and turns 20 feet into 20 on a foot-scaled map or 4 on a
//     square-scaled one (Draw Steel's square is 5 feet). A card that says 20 feet is 20 feet on any map.
//  2. **bright = dim = the printed radius.** Michael said *20 foot light*, so the lit circle ends where the
//     card says it ends: no dim skirt reaching past 20 feet, and nothing inside it is half-lit.
//  3. **Everything is reversible.** Turning the light on snapshots whatever `light` the token already had
//     into `flags.<module>.tokenLightPrior`; turning it off writes that snapshot back. A Director's own
//     torch configuration survives a priest walking through the room.
//
// Helpers above the "Foundry registration" divider are Foundry-free so
// tools/sp-el-foundry-wave-03123-smoke.mjs can run them in Node.

export const MODULE_ID = "draw-steel-ghostwire";
export const LIGHT_FLAG = "tokenLight";
export const LIGHT_PRIOR_FLAG = "tokenLightPrior";
export const LIGHT_ON_FLAG = "tokenLightOn";
const L = "GHOSTWIRE.TokenLight";

/** Draw Steel's square. Only used to turn a printed foot radius into squares. */
export const FEET_PER_SQUARE = 5;

/** Scene `grid.units` strings that mean the map is measured in feet. */
const FOOT_UNITS = new Set(["ft", "ft.", "feet", "foot"]);

/**
 * The `tokenLight` block on an ability, or null. Accepts a live Item or a raw pack row.
 * @returns {{feet: number, toggle: boolean}|null}
 */
export function tokenLightSpec(item) {
  const flags = (typeof item?.getFlag === "function")
    ? item.getFlag(MODULE_ID, LIGHT_FLAG)
    : item?.flags?.[MODULE_ID]?.[LIGHT_FLAG];
  if (!flags) return null;
  const feet = Number(flags.feet) || 0;
  if (feet <= 0) return null;
  return { feet, toggle: flags.toggle !== false };
}

/**
 * A printed foot radius in the units this scene measures in.
 *
 * A foot-scaled map takes the number as printed. Anything else (Draw Steel's default 1-unit squares,
 * or metres) is treated as squares of `grid.distance` units each, so 20 feet is 4 squares.
 */
export function lightRadius(feet, { units = "", distance = 1 } = {}) {
  const printed = Number(feet) || 0;
  if (printed <= 0) return 0;
  if (FOOT_UNITS.has(String(units).trim().toLowerCase())) return printed;
  const perSquare = Number(distance) || 1;
  return Math.round((printed / FEET_PER_SQUARE) * perSquare * 100) / 100;
}

/**
 * The `light` payload for a token, given a radius already in scene units.
 * bright === dim on purpose: the card prints one number, so the light has one edge.
 */
export function lightConfig(radius, { color = "#ffe4b0", alpha = 0.25 } = {}) {
  const r = Number(radius) || 0;
  return {
    bright: r,
    dim: r,
    alpha,
    color,
    luminosity: 0.5,
    animation: { type: "torch", speed: 1, intensity: 1 },
  };
}

/**
 * Decide what one use of a light ability does to one token.
 *
 * @param {object} opts
 * @param {boolean} opts.lit        Is this token already lit by *this module*?
 * @param {boolean} [opts.toggle]   Does using the card again put the light out?
 * @returns {"on"|"off"|"none"}
 */
export function planTokenLight({ lit = false, toggle = true } = {}) {
  if (!lit) return "on";
  return toggle ? "off" : "none";
}

/* ============================================ Foundry registration */

/** Tokens this actor has on the scene currently on the canvas. */
function actorTokens(actor) {
  if (!actor) return [];
  if (actor.isToken && actor.token) return [actor.token];
  const placed = actor.getActiveTokens(false, true) ?? [];
  return placed.filter(token => token.parent?.id === canvas?.scene?.id);
}

const isLit = token => token?.getFlag?.(MODULE_ID, LIGHT_ON_FLAG) === true;

/** The radius, in this scene's units, for a printed foot value. */
export function sceneLightRadius(feet, scene = canvas?.scene) {
  return lightRadius(feet, { units: scene?.grid?.units ?? "", distance: scene?.grid?.distance ?? 1 });
}

/**
 * Toggle the shared glow on every token this actor has on the canvas.
 *
 * @param {Actor} actor
 * @param {object} [options]
 * @param {number} [options.feet]     Printed radius. Defaults to 20.
 * @param {boolean} [options.toggle]  Using it again puts it out (default true).
 * @param {boolean} [options.silent]
 * @returns {Promise<"on"|"off"|null>} null when there was no token to light.
 */
export async function toggleTokenLight(actor, { feet = 20, toggle = true, silent = false } = {}) {
  const tokens = actorTokens(actor);
  if (!tokens.length) {
    if (!silent) ui.notifications.warn(game.i18n.format(`${L}.NoToken`, { name: actor?.name ?? "" }));
    return null;
  }
  const action = planTokenLight({ lit: tokens.some(isLit), toggle });
  if (action === "none") return null;

  const radius = sceneLightRadius(feet);
  for (const token of tokens) {
    if (action === "on") {
      // Snapshot first, so a Director's own light configuration comes back when the priest puts it out.
      const prior = token.getFlag(MODULE_ID, LIGHT_PRIOR_FLAG)
        ?? foundry.utils.deepClone(token.toObject().light ?? {});
      await token.update({
        light: lightConfig(radius),
        [`flags.${MODULE_ID}.${LIGHT_PRIOR_FLAG}`]: prior,
        [`flags.${MODULE_ID}.${LIGHT_ON_FLAG}`]: true,
      });
    } else {
      const prior = token.getFlag(MODULE_ID, LIGHT_PRIOR_FLAG) ?? lightConfig(0);
      await token.update({
        light: prior,
        [`flags.${MODULE_ID}.-=${LIGHT_PRIOR_FLAG}`]: null,
        [`flags.${MODULE_ID}.${LIGHT_ON_FLAG}`]: false,
      });
    }
  }
  if (!silent) {
    ui.notifications.info(game.i18n.format(`${L}.${action === "on" ? "On" : "Off"}`, {
      name: actor.name, feet,
    }));
  }
  return action;
}

/** The ability an `abilityUse` chat message was rolled from, or null. */
export function abilityFromMessage(message) {
  const parts = message?.system?.parts;
  if (!parts) return null;
  const list = Array.isArray(parts) ? parts : (parts.contents ?? Object.values(parts));
  const part = list.find(p => ((p?.type ?? p?.constructor?.TYPE) === "abilityUse") && p?.abilityUuid);
  if (!part) return null;
  try { return part.ability ?? fromUuidSync(part.abilityUuid) ?? null; } catch { return null; }
}

export function registerTokenLight() {
  // Using a light ability from the sheet flips the glow: the client that rolled it does the work.
  // Cantrip is deliberately skipped here — scripts/cantrip.mjs asks Light-or-other first, then calls in.
  Hooks.on("createChatMessage", async (message, options, userId) => {
    if (userId !== game.user.id) return;
    const ability = abilityFromMessage(message);
    const spec = tokenLightSpec(ability);
    if (!spec || ability.getFlag?.(MODULE_ID, "cantrip")) return;
    const actor = ability.parent;
    if (!(actor instanceof Actor) || !actor.isOwner) return;
    await toggleTokenLight(actor, spec);
  });

  const module = game.modules.get(MODULE_ID);
  if (module) {
    module.api = { ...(module.api ?? {}), toggleTokenLight, tokenLightSpec, sceneLightRadius };
  }
  console.log(`${MODULE_ID} | Token light registered (flags.${MODULE_ID}.${LIGHT_FLAG})`);
}
