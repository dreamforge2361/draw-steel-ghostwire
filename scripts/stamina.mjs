// 0.3.122 — worn armor really adds Stamina, and the sheet says where every point came from.
//
// Two Michael locks, one file, because they are two halves of the same question.
//
// **Lock 12 — armor Stamina.** Every armor SKU in `src/packs/gear/armor/**` already ships four
// Active Effects ("No Kit — Echelon 1 (+4 Stamina)" … "Echelon 4"), each an `upgrade` on
// `system.stamina.bonuses.treasure`, and every one of them ships `disabled: true` with nothing
// anywhere that ever enables one. So armor has been pure flavour: buy a Hardshell, gain nothing.
// This module is the missing switch.
//
//   * **Worn is a flag, not a guess.** Draw Steel's `treasure` model has no equipped state, so
//     Ghostwire keeps its own: `flags.<module>.worn` on the Item. New armor that lands on a hero who
//     is wearing none is worn automatically — the common case (buy a jacket, gain Stamina) needs no
//     extra click — and a right-click entry on the sheet takes it off or puts another one on.
//   * **One armor, newest wins.** Putting on a second armor takes the first one off. That is the
//     documented rule: the armor you just put on is the armor you are wearing. Two armor Stamina
//     bonuses are never summed, and the AEs could not sum them anyway (`upgrade` takes the higher),
//     but the lock is about the *fiction* as much as the arithmetic, so only one is ever enabled.
//     Shields live in `gear/armor/shields/` and carry the identical band AEs. 0.3.128 (E) makes that
//     one-line change to ARMOR_GROUPS: a shield is its own group, so armor and shield are each
//     exclusive with their own kind and stack with each other. See below.
//   * **Kit Stamina is untouched *by this file*.** A kit's Stamina is `kitBonuses.stamina × echelon`
//     inside Draw Steel's own `prepareDerivedData`. No kit effect is ever disabled here. The bands
//     are *named* "No Kit" because that is the band the packs shipped; if a SKU ever ships a
//     "With Kit — Echelon N" sibling, `pickArmorBand` honours it and prefers the band matching the
//     hero's actual kit state. Until one does, the echelon band applies either way.
//
// **Michael lock 2026-09-24 (0.3.128 E) — max Stamina is class + worn gear, and nothing else.**
//
// Research: `docs/directors/_stamina-stack-research-03127.md`. The state it found was wrong on two
// axes at once. RAW said a kitted hero's kit Stamina *is* their armor's Stamina (never both) and
// that a shield stacks on top; the code did the exact opposite, adding kit and armor together and
// making the shield exclusive with the armor. An Operator L1 in a Warframe kit read **42** — 21
// class + 12 kit + 9 Hardshell — with the Riot Shield the same kit handed them contributing nothing
// because wearing it would have taken the Hardshell off.
//
// Three changes, and the arithmetic they produce:
//
//  1. **Kits grant 0 Stamina.** Every kit SKU's `system.bonuses.stamina` is 0 (21 kits had more).
//     That resolves the double-count in the direction the Director chose — Stamina is **class plus
//     the gear you are actually wearing** — rather than by trying to decide whether a Warframe's 12
//     or a Hardshell's 9 is "the same contribution".
//  2. **A shield is its own worn group.** `ARMOR_GROUPS` maps `shield -> "shield"` and the other
//     four to `"armor"`, and the plan picks one worn item **per group**. One armor at a time is
//     still the rule; a raised shield is simply not competing for that slot.
//  3. **The band AEs changed mode from `upgrade` to `add`.** This is the part the research called
//     out as the trap: Draw Steel's `system.stamina.bonuses.treasure` is documented for `Upgrade`
//     precisely so treasure Stamina does *not* stack, and two `upgrade` changes on one key take the
//     max — a Hardshell (9) plus a Riot Shield (3) would have read 9, not 12. There is no second
//     key to move the shield to: `stamina.bonuses` is exactly `{ echelon, level, treasure }`, and
//     `system.stamina.max` is assigned (not incremented) by HeroModel#prepareDerivedData, so an AE
//     on it is wiped. So both armor and shield bands are `add`, and this file's own one-per-group
//     rule is what keeps the sum honest — exactly one armor band and at most one shield band is
//     ever enabled.
//
//     Operator L1 · Warframe · Hardshell + Riot Shield: 21 + 9 + 3 = **33**.
//
// **Lock 6 — the Stamina tooltip.** On a locked (play-mode) Hero sheet, hovering the Stamina pool
// lists every contributor to max Stamina: class, kit, worn armor, traits, other effects. It reads
// the derived numbers Draw Steel already computed rather than re-deriving them, and any shortfall
// between the listed rows and the real `system.stamina.max` is shown as its own honest "other" row
// instead of being papered over.
//
// Helpers above the "Foundry registration" divider are Foundry-free so
// tools/wave-03128-smoke.mjs can run them in Node.

const MODULE_ID = "draw-steel-ghostwire";
const L = "GHOSTWIRE.Stamina";

/** The Item flag that says "this is on my body right now". */
export const WORN_FLAG = "worn";

/**
 * Armor classes, and which worn slot each one competes for.
 *
 * 0.3.128 (E): **`shield` is its own group.** Light, medium, heavy and sealed still share one slot —
 * putting on a second armor takes the first off — but a shield is raised beside whatever armor is
 * worn and the two Stamina bands add. That is what the gear master has always said ("the one thing
 * that stacks with armor Stamina by design") and what the code refused to do until now.
 */
export const ARMOR_GROUPS = Object.freeze({
  light: "armor", medium: "armor", heavy: "armor", sealed: "armor", shield: "shield",
});

/** The worn groups, in the order the tooltip and the retro-fit walk them. */
export const WORN_GROUPS = Object.freeze(["armor", "shield"]);

/* -------------------------------------------- pure: what is armor */

const gwFlags = doc => doc?.flags?.[MODULE_ID] ?? {};

/** The gear flag block, whether this is a live Item or a raw pack row. */
function gearOf(item) {
  if (typeof item?.getFlag === "function") return item.getFlag(MODULE_ID, "gear") ?? null;
  return gwFlags(item).gear ?? null;
}

/** Is this Item a Stamina-bearing armor SKU? */
export function isArmorItem(item) {
  const gear = gearOf(item);
  if (!gear) return false;
  if (!ARMOR_GROUPS[gear.armorClass]) return false;
  return Array.isArray(gear.staminaByEchelon) && gear.staminaByEchelon.length > 0;
}

/** Which worn slot this Item competes for: `"armor"`, `"shield"`, or null when it is neither. */
export function armorGroupOf(item) {
  return ARMOR_GROUPS[gearOf(item)?.armorClass] ?? null;
}

/** Is this a shield rather than a suit? The whole UI split (Raise / Lower) hangs off this. */
export function isShieldItem(item) {
  return armorGroupOf(item) === "shield";
}

/** Is this armor currently worn? */
export function isWorn(item) {
  if (typeof item?.getFlag === "function") return item.getFlag(MODULE_ID, WORN_FLAG) === true;
  return gwFlags(item)[WORN_FLAG] === true;
}

/* -------------------------------------------- pure: bands */

const BAND_PATTERN = /^\s*(No Kit|With Kit)?\s*[—\-–]?\s*Echelon\s+(\d+)/i;

/** An effect's changes. Draw Steel stores them under `system.changes`; core `changes` is the fallback. */
export function effectChanges(effect) {
  const system = effect?.system?.changes;
  if (Array.isArray(system) && system.length) return system;
  return Array.isArray(effect?.changes) ? effect.changes : [];
}

/**
 * Read the echelon bands off an armor Item's Active Effects.
 *
 * The band is parsed from the effect *name* because that is where the packs encode it — the change
 * itself is just a number and carries no echelon. A name that does not match is not a band and is
 * left alone entirely (sealed armor's "Worn — typed immunity" effect is exactly that case, and it
 * must keep its own life).
 *
 * @param {Array} effects  Raw effect objects or live ActiveEffects.
 * @returns {Array<{id: string, echelon: number, kit: "none"|"with"|null, value: number}>}
 */
export function armorStaminaBands(effects = []) {
  const bands = [];
  for (const effect of effects) {
    const name = String(effect?.name ?? "");
    const match = BAND_PATTERN.exec(name);
    if (!match) continue;
    const change = effectChanges(effect).find(c => String(c?.key ?? "").startsWith("system.stamina.bonuses."));
    if (!change) continue;
    const kitWord = match[1] ? match[1].toLowerCase() : null;
    bands.push({
      id: effect._id ?? effect.id,
      echelon: Number(match[2]),
      kit: kitWord === "with kit" ? "with" : (kitWord === "no kit" ? "none" : null),
      value: Number(change.value) || 0,
    });
  }
  return bands;
}

/**
 * The one band that should be enabled for this hero, or null.
 *
 * Kit preference first: if the SKU ships bands for both kit states, take the one that matches. When
 * it ships only one flavour (every SKU today ships "No Kit"), that flavour is what the armor does,
 * kit or no kit — the kit's own Stamina is a separate source and is never displaced.
 *
 * Echelon clamps rather than fails: a level-10 hero in an armor that only prints three bands wears
 * the highest band it has.
 */
export function pickArmorBand(bands = [], { echelon = 1, hasKit = false } = {}) {
  if (!bands.length) return null;
  const wanted = hasKit ? "with" : "none";
  const matching = bands.filter(band => band.kit === wanted);
  const pool = matching.length ? matching : bands.filter(band => band.kit !== (hasKit ? "none" : "with"));
  const usable = pool.length ? pool : bands;
  const target = Number(echelon) || 1;
  const exact = usable.find(band => band.echelon === target);
  if (exact) return exact;
  const lower = usable.filter(band => band.echelon <= target).sort((a, b) => b.echelon - a.echelon);
  return lower[0] ?? usable.slice().sort((a, b) => a.echelon - b.echelon)[0] ?? null;
}

/**
 * Plan the whole hero at once: which item holds each worn slot, which single band effect is on in
 * each, and which effects must go off.
 *
 * 0.3.128 (E): **one worn item per group, not one per hero.** A hero wears one armor *and* may raise
 * one shield, and both bands are enabled — they are `add` changes on one key, so the sum is exactly
 * armor + shield. Everything else is still off.
 *
 * @param {object} opts
 * @param {Array<{id: string, worn: boolean, group?: string, bands: Array}>} opts.armors
 * @param {number} opts.echelon
 * @param {boolean} opts.hasKit
 * @returns {{wornId: string|null, wornIds: string[], wornByGroup: Record<string, string>,
 *            enable: Array<{itemId: string, effectId: string}>,
 *            disable: Array<{itemId: string, effectId: string}>}}
 */
export function armorStaminaPlan({ armors = [], echelon = 1, hasKit = false } = {}) {
  // Newest wins is decided at wear time; by the time a plan runs there should be at most one worn
  // item per group. If a world somehow carries two, the first in Item order keeps the slot rather
  // than both contributing — which with `add` bands would silently double the Stamina.
  const wornByGroup = new Map();
  for (const armor of armors) {
    if (!armor.worn) continue;
    const group = armor.group ?? "armor";
    if (!wornByGroup.has(group)) wornByGroup.set(group, armor.id);
  }
  const wornIds = new Set(wornByGroup.values());

  const enable = [];
  const disable = [];
  for (const armor of armors) {
    const chosen = wornIds.has(armor.id) ? pickArmorBand(armor.bands, { echelon, hasKit }) : null;
    for (const band of armor.bands) {
      const entry = { itemId: armor.id, effectId: band.id };
      if (chosen && (band.id === chosen.id)) enable.push(entry);
      else disable.push(entry);
    }
  }
  return {
    wornId: wornByGroup.get("armor") ?? null,       // the armor slot, for callers that predate groups
    wornIds: [...wornIds],
    wornByGroup: Object.fromEntries(wornByGroup),
    enable,
    disable,
  };
}

/**
 * What the enabled bands add up to — the number the "Hardshell + Riot Shield = 12" check is about.
 *
 * Pure, and deliberately re-derived from the plan rather than read off a hero, so a smoke can assert
 * the arithmetic without Foundry and without an Actor.
 */
export function plannedStaminaFromGear({ armors = [], echelon = 1, hasKit = false } = {}) {
  const plan = armorStaminaPlan({ armors, echelon, hasKit });
  const byId = new Map(armors.map(armor => [armor.id, armor]));
  return plan.enable.reduce((total, entry) => {
    const band = byId.get(entry.itemId)?.bands?.find(candidate => candidate.id === entry.effectId);
    return total + (Number(band?.value) || 0);
  }, 0);
}

/* -------------------------------------------- pure: the pool after an armor change */

/**
 * C1 (0.3.123) — what the current Stamina pool should read after armor went on or came off.
 *
 * **Putting armor on fills you up.** Michael's lock: donning a suit sets current Stamina to the new
 * maximum. The fiction is that you are strapping into protection out of combat, not healing under fire,
 * and the alternative — a hero who buys a Hardshell and stays on the old number until a respite — is the
 * bug this fixes.
 *
 * **Taking it off never heals.** Removing armor only ever *clamps*: if the maximum dropped below what you
 * were carrying, the pool comes down to meet it, and otherwise nothing is written at all.
 *
 * @param {object} opts
 * @param {number} opts.value    Current `system.stamina.value`.
 * @param {number} opts.max      The *new* `system.stamina.max`, after the band effects were synced.
 * @param {boolean} opts.donned  True when this change put armor on.
 * @returns {number|null}        The value to write, or null when nothing should be written.
 */
export function planStaminaAfterArmorChange({ value = 0, max = 0, donned = false } = {}) {
  const ceiling = Math.max(0, Math.floor(Number(max) || 0));
  const current = Math.floor(Number(value) || 0);
  if (donned) return (current === ceiling) ? null : ceiling;
  return (current > ceiling) ? ceiling : null;
}

/* -------------------------------------------- pure: the tooltip */

/** Stamina change keys and how each one turns into points of max Stamina. */
const STAMINA_KEY_SCALE = {
  "system.stamina.bonuses.treasure": () => 1,
  "system.stamina.bonuses.echelon": ({ echelon }) => echelon,
  "system.stamina.bonuses.level": ({ level }) => level,
  "system.stamina.max": () => 1,
};

/** Does this change key feed max Stamina? */
export function isStaminaChangeKey(key) {
  return Object.hasOwn(STAMINA_KEY_SCALE, String(key));
}

/** Points of max Stamina one change is worth on this hero. */
export function staminaChangeValue(change, { echelon = 1, level = 1 } = {}) {
  const scale = STAMINA_KEY_SCALE[String(change?.key)];
  if (!scale) return 0;
  return (Number(change?.value) || 0) * scale({ echelon, level });
}

/**
 * Turn raw contributor rows into the tooltip's rows plus an honest remainder.
 *
 * The remainder exists because this module does not own Stamina — Draw Steel does, and a module or
 * a homebrew Item may add to it by a route nobody here enumerated. Rather than quietly disagree
 * with the number printed on the sheet, anything unaccounted for gets its own row.
 *
 * @param {object} opts
 * @param {Array<{kind: string, name: string, value: number}>} opts.rows
 * @param {number} opts.max  The hero's real `system.stamina.max`.
 */
export function staminaTooltipRows({ rows = [], max = 0 } = {}) {
  const listed = rows.filter(row => Number(row?.value));
  const sum = listed.reduce((total, row) => total + Number(row.value), 0);
  const remainder = (Number(max) || 0) - sum;
  const out = listed.map(row => ({ kind: row.kind, name: row.name, value: Number(row.value) }));
  if (remainder) out.push({ kind: "other", name: null, value: remainder });
  return { rows: out, total: Number(max) || 0, remainder };
}

/* ============================================ Foundry registration */

const isHero = actor => actor?.type === "hero";

/** Every armor Item on this hero. */
export function armorItems(actor) {
  return [...(actor?.items ?? [])].filter(isArmorItem);
}

/** The armor this hero is wearing (the suit, not the shield), or null. */
export function wornArmor(actor) {
  return armorItems(actor).find(item => isWorn(item) && (armorGroupOf(item) === "armor")) ?? null;
}

/** The shield this hero has raised, or null. */
export function raisedShield(actor) {
  return armorItems(actor).find(item => isWorn(item) && isShieldItem(item)) ?? null;
}

/** The item holding one worn slot, or null. */
export function wornInGroup(actor, group) {
  return armorItems(actor).find(item => isWorn(item) && (armorGroupOf(item) === group)) ?? null;
}

const heroHasKit = actor => !!actor?.system?.kits?.length || actor?.items?.some?.(item => item.type === "kit");

/** Describe the hero's armor for the pure planner. */
function armorState(actor) {
  return {
    armors: armorItems(actor).map(item => ({
      id: item.id,
      worn: isWorn(item),
      group: armorGroupOf(item),
      bands: armorStaminaBands(item.effects ?? []),
    })),
    echelon: Number(actor?.system?.echelon) || 1,
    hasKit: heroHasKit(actor),
  };
}

/**
 * Bring every armor Item's band effects in line with what the hero is wearing right now.
 * Writes nothing when nothing changed, so it is safe to call from any hook.
 */
export async function syncArmorStamina(actor) {
  if (!isHero(actor) || !actor.isOwner) return false;
  const plan = armorStaminaPlan(armorState(actor));
  const wanted = new Map();
  for (const entry of plan.enable) wanted.set(`${entry.itemId}:${entry.effectId}`, { ...entry, disabled: false });
  for (const entry of plan.disable) wanted.set(`${entry.itemId}:${entry.effectId}`, { ...entry, disabled: true });

  const byItem = new Map();
  for (const { itemId, effectId, disabled } of wanted.values()) {
    const item = actor.items.get(itemId);
    const effect = item?.effects?.get?.(effectId);
    if (!effect || (effect.disabled === disabled)) continue;
    if (!byItem.has(item)) byItem.set(item, []);
    byItem.get(item).push({ _id: effectId, disabled });
  }
  if (!byItem.size) return false;
  for (const [item, changes] of byItem) {
    await item.updateEmbeddedDocuments("ActiveEffect", changes, { ghostwireArmorStamina: true });
  }
  return true;
}

/**
 * C1 (0.3.123): settle the current Stamina pool after the band effects have already been synced, so
 * `system.stamina.max` is the new maximum by the time this reads it.
 * @returns {Promise<number|null>} the value written, or null when nothing needed writing.
 */
export async function syncStaminaPool(actor, { donned = false } = {}) {
  if (!isHero(actor) || !actor.isOwner) return null;
  const stamina = actor.system?.stamina ?? {};
  const next = planStaminaAfterArmorChange({ value: stamina.value, max: stamina.max, donned });
  if (next === null) return null;
  await actor.update({ "system.stamina.value": next }, { ghostwireArmorStamina: true });
  return next;
}

/**
 * Put one armor on (or take it off) — or raise and lower a shield.
 *
 * 0.3.128 (E): exclusivity is **within the group**. Putting on a second armor still takes the first
 * off, and raising a shield leaves the armor exactly where it was. Items in the other group are not
 * touched at all, which is what makes armor + shield stack.
 */
export async function setArmorWorn(item, worn = true) {
  const actor = item?.parent;
  if (!isArmorItem(item) || !isHero(actor)) return false;
  const group = armorGroupOf(item);
  const updates = [];
  for (const other of armorItems(actor)) {
    if (armorGroupOf(other) !== group) continue;   // a shield is none of the armor slot's business
    const want = worn && (other.id === item.id);
    if (isWorn(other) === want) continue;
    updates.push({ _id: other.id, [`flags.${MODULE_ID}.${WORN_FLAG}`]: want });
  }
  if (updates.length) await actor.updateEmbeddedDocuments("Item", updates, { ghostwireArmorStamina: true });
  await syncArmorStamina(actor);
  await syncStaminaPool(actor, { donned: worn });
  const shield = group === "shield";
  const key = worn
    ? (shield ? "Notify.Raised" : "Notify.Worn")
    : (shield ? "Notify.Lowered" : "Notify.Removed");
  ui.notifications.info(game.i18n.format(`${L}.${key}`, { name: item.name, actor: actor.name }));
  return true;
}

/* ---------------- the tooltip */

/** Classify an Active Effect's source Item for the tooltip's label. */
function sourceKind(item) {
  if (!item) return "effect";
  if (item.type === "kit") return "kit";
  if (item.type === "class" || item.type === "subclass") return "class";
  if (isArmorItem(item)) {
    if (isShieldItem(item)) return isWorn(item) ? "shield" : "shieldOff";
    return isWorn(item) ? "armor" : "armorOff";
  }
  if (["ancestry", "ancestryTrait", "culture", "career", "feature", "perk", "title", "complication"].includes(item.type)) return "trait";
  return "effect";
}

/**
 * Every contributor to this hero's max Stamina, in sheet order.
 * @returns {{rows: Array<{kind: string, name: string|null, value: number}>, total: number, remainder: number}}
 */
export function staminaSources(actor) {
  const level = Number(actor?.system?.level) || 0;
  const echelon = Number(actor?.system?.echelon) || 1;
  const rows = [];

  // Class: starting Stamina plus per-level Stamina, exactly as ClassModel#prepareDerivedData adds it.
  const classItem = actor?.system?.class ?? null;
  if (classItem) {
    const stamina = classItem.system?.stamina ?? {};
    const starting = Number(stamina.starting) || 0;
    const perLevel = Number(stamina.level) || 0;
    rows.push({ kind: "class", name: classItem.name, value: starting + Math.max(0, level - 1) * perLevel });
  }

  // Kit: 0 for every Ghostwire kit since 0.3.128 (E) — Stamina is class plus worn gear. The row is
  // still computed rather than deleted, because `staminaTooltipRows` drops a zero row on its own and
  // a Director who hand-edits a kit back to +6 should see where the six came from, not an "other".
  // Draw Steel takes the BEST kit's bonus, not the sum, then multiplies by echelon.
  const kits = [...(actor?.system?.kits ?? [])];
  if (kits.length) {
    const best = kits.reduce((top, kit) => {
      const value = Number(kit.system?.bonuses?.stamina) || 0;
      return value > (top.value ?? -Infinity) ? { kit, value } : top;
    }, {});
    if (best.kit) rows.push({ kind: "kit", name: best.kit.name, value: best.value * echelon });
  }

  // Everything else that touches Stamina, attributed to the Item it rides in on. `upgrade` changes
  // do not sum, so only the winning one is counted — otherwise the rows would overshoot the total.
  // Ghostwire armor and shield bands are `add` since 0.3.128 (E) and therefore land in `additive`,
  // which is exactly why a worn Hardshell and a raised Riot Shield show as two rows totalling 12.
  const upgrades = new Map();
  const additive = [];
  for (const effect of actor?.allApplicableEffects?.() ?? []) {
    if (effect.disabled) continue;
    const item = (effect.parent instanceof Actor) ? null : effect.parent;
    if (item?.type === "kit" || item?.type === "class") continue;
    // Draw Steel keeps an effect's changes under `system.changes`; core `changes` only ever carries
    // `flags.*` keys on this system (DrawSteelActiveEffect._applyChangeUnguided), so it is a fallback.
    for (const change of effectChanges(effect)) {
      if (!isStaminaChangeKey(change.key)) continue;
      const value = staminaChangeValue(change, { echelon, level });
      if (!value) continue;
      const row = { kind: sourceKind(item), name: item?.name ?? effect.name, value };
      if (change.type === "upgrade") {
        const best = upgrades.get(change.key);
        if (!best || (value > best.value)) upgrades.set(change.key, row);
      } else additive.push(row);
    }
  }
  rows.push(...upgrades.values(), ...additive);

  return staminaTooltipRows({ rows, max: Number(actor?.system?.stamina?.max) || 0 });
}

/** The tooltip HTML for the Stamina pool. */
export function staminaTooltipHtml(actor) {
  const { rows, total } = staminaSources(actor);
  const esc = foundry.utils.escapeHTML;
  const line = row => {
    const label = row.name
      ? game.i18n.format(`${L}.Tooltip.Row`, { kind: game.i18n.localize(`${L}.Kinds.${row.kind}`), name: esc(row.name) })
      : game.i18n.localize(`${L}.Kinds.other`);
    const sign = row.value >= 0 ? "+" : "−";
    return `<li><span class="gw-stamina-src">${label}</span><span class="gw-stamina-val">${sign}${Math.abs(row.value)}</span></li>`;
  };
  const body = rows.length
    ? `<ul class="ghostwire-stamina-sources">${rows.map(line).join("")}</ul>`
    : `<p class="hint">${game.i18n.localize(`${L}.Tooltip.Empty`)}</p>`;
  return `<div class="ghostwire-stamina-tooltip">`
    + `<p class="gw-stamina-total"><strong>${game.i18n.format(`${L}.Tooltip.Total`, { total })}</strong></p>`
    + body
    + `</div>`;
}

function injectStaminaTooltip(app, element) {
  const actor = app?.document ?? app?.actor;
  if (!isHero(actor)) return;
  const pool = element?.querySelector?.(".tab[data-tab='stats'] .resource.stamina")
    ?? element?.querySelector?.(".resource.stamina");
  if (!pool) return;
  // The lock names the locked (play-mode) sheet. The editable sheet gets it too where it is free —
  // the pool only renders as a hoverable block in play mode, so in practice this is the play sheet.
  pool.dataset.tooltipHtml = staminaTooltipHtml(actor);
  pool.dataset.tooltipDirection ??= "UP";
  pool.classList.add("ghostwire-stamina-hover");
}

/* ---------------- hooks */

export function registerStamina() {
  // Armor lands on a hero.
  //
  // Nothing worn yet → wear it, so the common case (buy a jacket, gain Stamina) needs no extra click.
  // Something already worn → the newcomer does **not** steal the slot. Arriving in the inventory is
  // not putting it on; the right-click entry is, and that is where "newest wins" applies. A copy that
  // arrives carrying a stale `worn` flag (duplicated from a worn item) has it cleared here, so the
  // hero can never end up wearing two.
  Hooks.on("createItem", async (item, options, userId) => {
    if ((userId !== game.user.id) || !isArmorItem(item)) return;
    const actor = item.parent;
    if (!isHero(actor) || !actor.isOwner) return;
    // 0.3.128 (E): "is something already worn" is a question about this item's own group. A hero
    // wearing a Hardshell who buys a Riot Shield has an empty shield slot, so the shield goes up.
    const group = armorGroupOf(item);
    const othersWorn = armorItems(actor)
      .some(other => (other.id !== item.id) && (armorGroupOf(other) === group) && isWorn(other));
    if (othersWorn === isWorn(item)) {
      // Either nothing is worn and this one is not flagged (wear it), or something is worn and this
      // one is also flagged (clear it). Both are a single flag write; the updateItem hook syncs.
      await item.setFlag(MODULE_ID, WORN_FLAG, !othersWorn);
      return;
    }
    await syncArmorStamina(actor);
  });

  Hooks.on("updateItem", async (item, changes, options, userId) => {
    if ((userId !== game.user.id) || options?.ghostwireArmorStamina) return;
    const actor = item.parent;
    if (!isHero(actor) || !actor.isOwner) return;
    // A worn flag flip, a kit arriving or leaving, or an echelon-relevant class change.
    const touchedWorn = foundry.utils.hasProperty(changes, `flags.${MODULE_ID}.${WORN_FLAG}`);
    if (!touchedWorn && !isArmorItem(item) && (item.type !== "kit") && (item.type !== "class")) return;
    await syncArmorStamina(actor);
    // C1: a worn-flag flip is a hero donning or removing a suit — the auto-wear path in createItem
    // below comes through here too. Level-ups and kit changes are not, so they only ever clamp.
    await syncStaminaPool(actor, { donned: touchedWorn && isWorn(item) });
  });

  Hooks.on("deleteItem", async (item, options, userId) => {
    if (userId !== game.user.id) return;
    const actor = item.parent;
    if (!isHero(actor) || !actor.isOwner) return;
    if (!isArmorItem(item) && (item.type !== "kit")) return;
    // Taking off the only armor by deleting it: promote nothing, just clear the bands.
    await syncArmorStamina(actor);
  });

  // Levelling changes the echelon, which changes which band is the right band.
  Hooks.on("updateActor", async (actor, changes, options, userId) => {
    if ((userId !== game.user.id) || !isHero(actor) || !actor.isOwner) return;
    if (!foundry.utils.hasProperty(changes, "system.hero.xp") && !foundry.utils.hasProperty(changes, "system.level")) return;
    await syncArmorStamina(actor);
  });

  // Right-click an armor row: wear it, or take it off.
  const Sheet = ds.applications.sheets?.DrawSteelHeroSheet;
  if (typeof Sheet?.prototype?._getDocumentListContextOptions === "function") {
    const original = Sheet.prototype._getDocumentListContextOptions;
    Sheet.prototype._getDocumentListContextOptions = function() {
      const options = original.call(this);
      // 0.3.128 (E): four entries, not two. A shield is raised and lowered; armor is worn and taken
      // off. One pair was offering to "Wear this armor" on a Riot Shield, which is both wrong copy
      // and the visible half of the exclusivity bug this wave fixes.
      const entry = ({ key, icon, shield, wear }) => ({
        label: `${L}.Menu.${key}`,
        icon,
        visible: target => {
          const item = this._getEmbeddedDocument(target);
          if (!isArmorItem(item) || !item.parent?.isOwner) return false;
          if (isShieldItem(item) !== shield) return false;
          return isWorn(item) === !wear;
        },
        onClick: (event, target) => setArmorWorn(this._getEmbeddedDocument(target), wear),
      });
      options.unshift(
        entry({ key: "Wear", icon: "fa-solid fa-shirt", shield: false, wear: true }),
        entry({ key: "Remove", icon: "fa-solid fa-person", shield: false, wear: false }),
        entry({ key: "RaiseShield", icon: "fa-solid fa-shield-halved", shield: true, wear: true }),
        entry({ key: "LowerShield", icon: "fa-solid fa-shield", shield: true, wear: false }),
      );
      return options;
    };
  } else {
    console.warn(`${MODULE_ID} | DrawSteelHeroSheet#_getDocumentListContextOptions not found; armor has no wear/remove menu`);
  }

  Hooks.on("renderDrawSteelHeroSheet", injectStaminaTooltip);
  // Fallback if a world still fires the generic actor-sheet hook for heroes.
  Hooks.on("renderActorSheet", (app, element) => injectStaminaTooltip(app, element));

  // Worlds built before 0.3.122: wear the one armor a hero already owns, so the fix is retroactive.
  Hooks.once("ready", async () => {
    if (!game.user.isGM) return;
    let touched = 0;
    for (const actor of game.actors) {
      if (!isHero(actor) || !actor.isOwner) continue;
      const armors = armorItems(actor);
      if (!armors.length) continue;
      // One per group: a hero who owns a suit and a shield and is wearing neither ends up in both.
      for (const group of WORN_GROUPS) {
        const inGroup = armors.filter(candidate => armorGroupOf(candidate) === group);
        if (!inGroup.length || inGroup.some(isWorn)) continue;
        await inGroup[0].setFlag(MODULE_ID, WORN_FLAG, true);
        touched += 1;
      }
      if (await syncArmorStamina(actor)) touched += 1;
    }
    if (touched) console.log(`${MODULE_ID} | armor Stamina synced on ${touched} hero update(s)`);

    const module = game.modules.get(MODULE_ID);
    if (module) {
      module.api = {
        ...(module.api ?? {}),
        setArmorWorn,
        syncArmorStamina,
        syncStaminaPool,
        wornArmor,
        raisedShield,
        armorGroupOf,
        isShieldItem,
        staminaSources,
      };
    }
  });

  console.log(`${MODULE_ID} | Armor Stamina + Stamina tooltip registered `
    + `(flags.${MODULE_ID}.${WORN_FLAG}; worn groups: ${WORN_GROUPS.join(" + ")})`);
}
