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
//     Shields live in `gear/armor/shields/` and carry the identical band AEs, so they are in the
//     same exclusive group; making them stack would be a one-line change to ARMOR_GROUPS.
//   * **Kit Stamina is untouched.** A kit's Stamina is `kitBonuses.stamina × echelon` inside Draw
//     Steel's own `prepareDerivedData` and has nothing to do with these AEs. No kit effect is ever
//     disabled here. The bands are *named* "No Kit" because that is the band the packs shipped; if a
//     SKU ever ships a "With Kit — Echelon N" sibling, `pickArmorBand` honours it and prefers the
//     band matching the hero's actual kit state. Until one does, the echelon band applies either way.
//
// **Lock 6 — the Stamina tooltip.** On a locked (play-mode) Hero sheet, hovering the Stamina pool
// lists every contributor to max Stamina: class, kit, worn armor, traits, other effects. It reads
// the derived numbers Draw Steel already computed rather than re-deriving them, and any shortfall
// between the listed rows and the real `system.stamina.max` is shown as its own honest "other" row
// instead of being papered over.
//
// Helpers above the "Foundry registration" divider are Foundry-free so
// tools/armor-stamina-smoke.mjs can run them in Node.

const MODULE_ID = "draw-steel-ghostwire";
const L = "GHOSTWIRE.Stamina";

/** The Item flag that says "this is on my body right now". */
export const WORN_FLAG = "worn";

/**
 * Armor classes that compete for the one worn slot. Every entry shares one exclusive group, so
 * wearing any of them takes off whatever else was worn.
 */
export const ARMOR_GROUPS = Object.freeze({
  light: "armor", medium: "armor", heavy: "armor", sealed: "armor", shield: "armor",
});

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
 * Plan the whole hero at once: which armor is worn, which single band effect is on, and which
 * effects must go off.
 *
 * @param {object} opts
 * @param {Array<{id: string, worn: boolean, bands: Array}>} opts.armors  One entry per armor Item.
 * @param {number} opts.echelon
 * @param {boolean} opts.hasKit
 * @returns {{wornId: string|null, enable: Array<{itemId: string, effectId: string}>,
 *            disable: Array<{itemId: string, effectId: string}>}}
 */
export function armorStaminaPlan({ armors = [], echelon = 1, hasKit = false } = {}) {
  const worn = armors.filter(armor => armor.worn);
  // Newest wins is decided at wear time; by the time a plan runs there should be exactly one. If a
  // world somehow carries two, the first in Item order keeps the slot rather than both contributing.
  const wornId = worn[0]?.id ?? null;
  const enable = [];
  const disable = [];
  for (const armor of armors) {
    const chosen = (armor.id === wornId) ? pickArmorBand(armor.bands, { echelon, hasKit }) : null;
    for (const band of armor.bands) {
      const entry = { itemId: armor.id, effectId: band.id };
      if (chosen && (band.id === chosen.id)) enable.push(entry);
      else disable.push(entry);
    }
  }
  return { wornId, enable, disable };
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

/** The armor this hero is wearing, or null. */
export function wornArmor(actor) {
  return armorItems(actor).find(isWorn) ?? null;
}

const heroHasKit = actor => !!actor?.system?.kits?.length || actor?.items?.some?.(item => item.type === "kit");

/** Describe the hero's armor for the pure planner. */
function armorState(actor) {
  return {
    armors: armorItems(actor).map(item => ({
      id: item.id,
      worn: isWorn(item),
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
 * Put one armor on (or take it off). Wearing takes every other armor off first — one armor, and the
 * one you just put on is the one you are wearing.
 */
export async function setArmorWorn(item, worn = true) {
  const actor = item?.parent;
  if (!isArmorItem(item) || !isHero(actor)) return false;
  const updates = [];
  for (const other of armorItems(actor)) {
    const want = worn && (other.id === item.id);
    if (isWorn(other) === want) continue;
    updates.push({ _id: other.id, [`flags.${MODULE_ID}.${WORN_FLAG}`]: want });
  }
  if (updates.length) await actor.updateEmbeddedDocuments("Item", updates, { ghostwireArmorStamina: true });
  await syncArmorStamina(actor);
  const key = worn ? "Notify.Worn" : "Notify.Removed";
  ui.notifications.info(game.i18n.format(`${L}.${key}`, { name: item.name, actor: actor.name }));
  return true;
}

/* ---------------- the tooltip */

/** Classify an Active Effect's source Item for the tooltip's label. */
function sourceKind(item) {
  if (!item) return "effect";
  if (item.type === "kit") return "kit";
  if (item.type === "class" || item.type === "subclass") return "class";
  if (isArmorItem(item)) return isWorn(item) ? "armor" : "armorOff";
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

  // Kit: Draw Steel takes the BEST kit's bonus, not the sum, then multiplies by echelon.
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
      if (change.type === "upgrade" || change.mode === "upgrade") {
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
    const othersWorn = armorItems(actor).some(other => (other.id !== item.id) && isWorn(other));
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
      options.unshift(
        {
          label: `${L}.Menu.Wear`,
          icon: "fa-solid fa-shield-halved",
          visible: target => {
            const item = this._getEmbeddedDocument(target);
            return isArmorItem(item) && !isWorn(item) && !!item.parent?.isOwner;
          },
          onClick: (event, target) => setArmorWorn(this._getEmbeddedDocument(target), true),
        },
        {
          label: `${L}.Menu.Remove`,
          icon: "fa-solid fa-shield",
          visible: target => {
            const item = this._getEmbeddedDocument(target);
            return isArmorItem(item) && isWorn(item) && !!item.parent?.isOwner;
          },
          onClick: (event, target) => setArmorWorn(this._getEmbeddedDocument(target), false),
        },
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
      if (!armors.some(isWorn)) {
        await armors[0].setFlag(MODULE_ID, WORN_FLAG, true);
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
        wornArmor,
        staminaSources,
      };
    }
  });

  console.log(`${MODULE_ID} | Armor Stamina + Stamina tooltip registered (flags.${MODULE_ID}.${WORN_FLAG})`);
}
