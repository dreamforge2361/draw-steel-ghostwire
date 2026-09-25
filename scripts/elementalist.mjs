// 0.3.132 (E) — the Elementalist's three printed choices, wired.
//
// Michael's 0.3.131 smoke found the same hole three times: a card that says "choose" and a use that
// chooses nothing.
//
//   * **Elemental Shaping** reads *"choose one when you use this ability: a burst of elemental damage
//     to a creature, a forced slide of a creature, or a shift for yourself"* — and rolled a bare
//     tier with no mode attached, so the table had to read the card and do the arithmetic.
//   * **Hurl Element** reads *"the damage type matches your attunement"* — and Ghostwire never had
//     anywhere to put an attunement, so every Hurl Element in the game rolled **typeless** damage
//     and every immunity in the bestiary was a coin flip.
//   * **Zephyr Companion** reads *"choose cold, lightning, or sonic damage when you summon it"*, and
//     **Boulder Companion** *"choose acid or corruption"* — both summoned, both typeless.
//
// ---------------------------------------------------------------------------------------------
// Attunement, and why it is stored as a damage **type**
//
// RAW (docs/raw/17-elementalist.md, line 21) names the attuned *element*: fire, air, water, earth or
// void. Every ability that consumes it names a *damage type* instead — Hurl Element's own text lists
// "acid, cold, corruption, fire, lightning, poison, or sonic". There is no printed table mapping the
// five elements onto the seven types, so **Ghostwire does not invent one**: the flag holds the
// damage type the player picked, which is the thing every consuming ability actually asks for. The
// element is flavour the player says out loud; the type is what the dice need.
//
// The flag is `flags.draw-steel-ghostwire.attunement` on the hero. Switching is free (RAW: "no
// action, no maneuver", and Attunement Discipline at 3rd makes it free even off-turn), so it is a
// context-menu entry on the ability row rather than an ability of its own.
//
// **How the type reaches the dice.** Not by rewriting the roll: by writing the chosen type onto the
// `damage.tierN.types` arrays of the hero's *own embedded copy* of each attuned ability, which is
// exactly the shape scripts/payload-use.mjs already builds its damage effects in. After that the
// system rolls typed damage natively, the card says the type, and Draw Steel's own immunity maths
// works without this file being anywhere near it. Every Pyromancer / Stormcaller / Geomancer origin
// ability is already typed in the pack (Solar Lance is fire whatever you are attuned to) and is
// deliberately left alone: only the **class** abilities, whose text says "typed to attunement", are
// re-typed.
//
// Everything above the "Foundry registration" divider is Foundry-free so
// tools/wave-03132-smoke.mjs can run it under Node.

import { playHitFx } from "./hit-fx.mjs";
import { elementAdjective } from "./elements.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const L = "GHOSTWIRE.Summons.Veil.UI";

/** The attunement flag on the hero. */
export const ATTUNEMENT_FLAG = "attunement";

/**
 * The damage types an Elementalist may be attuned to.
 *
 * Verbatim from Hurl Element's printed text, in its order, so the dialog reads like the card.
 */
export const ATTUNEMENT_TYPES = Object.freeze([
  "acid", "cold", "corruption", "fire", "lightning", "poison", "sonic",
]);

/**
 * Class abilities whose damage is "typed to attunement".
 *
 * Listed by `_dsid` rather than detected by "has an untyped damage effect", because those are not
 * the same claim: an untyped effect might be untyped because nobody has typed it yet. Each of these
 * has printed text that says elemental / attuned damage.
 */
export const ATTUNED_DSIDS = Object.freeze([
  "hurl-element", "bolt-barrage", "difficult-ground", "elemental-wall", "conflagration-tempest",
  "elemental-convergence", "void-vortex", "world-fissure", "cataclysm",
]);

/**
 * What each companion may strike with, from its own card.
 *
 * Ember has no choice printed — it is a lash of living flame and its pack row is already `fire` —
 * so it is listed with the single type it has, and {@link companionNeedsChoice} reads false for it.
 * Mirroring a choice onto Ember that its text does not offer would be inventing RAW.
 */
export const COMPANION_ELEMENTS = Object.freeze({
  "zephyr-companion": Object.freeze(["cold", "lightning", "sonic"]),
  "boulder-companion": Object.freeze(["acid", "corruption"]),
  "ember-companion": Object.freeze(["fire"]),
});

/** Does this companion ask the player, or does its card name one element? */
export function companionNeedsChoice(dsid) {
  return (COMPANION_ELEMENTS[String(dsid ?? "")]?.length ?? 0) > 1;
}

/**
 * 0.3.134 (D) — the summon abilities that pick an element, and the flag the pick is recorded in.
 *
 * `COMPANION_ELEMENTS` above is the per-companion list the card prints. The three *bound* summons
 * (Summon Elemental, Twin Elemental Summon, Greater Elemental Summon) print no list at all: RAW ties
 * a bound elemental to the caster's attunement, so they take whatever the hero is attuned to and ask
 * for one if the hero has never picked.
 *
 * The pick is written to `flags.draw-steel-ghostwire.summonElement` on the **ability**, because that
 * is the only object both halves of the summon can see: scripts/elementalist.mjs patches `use()` and
 * writes it *before* the roll, and scripts/veil-summons.mjs reads it off the same ability when the
 * resulting chat message fires its `createChatMessage` hook a moment later.
 */
export const SUMMON_ELEMENT_FLAG = "summonElement";
export const BOUND_SUMMON_DSIDS = Object.freeze([
  "summon-elemental", "twin-elemental-summon", "greater-elemental-summon",
]);

/** Does this ability place something on the canvas that should wear an element in its name? */
export function summonPicksElement(dsid) {
  const key = String(dsid ?? "");
  return !!COMPANION_ELEMENTS[key] || BOUND_SUMMON_DSIDS.includes(key);
}

/** Elemental Shaping's three modes, in the order the card prints them. */
export const SHAPING_MODES = Object.freeze(["damage", "slide", "shift"]);

/** The tier ladders, verbatim: "2 / 4 / 6 elemental damage, or slide 1 / 2 / 3, or shift 1 / 2 / 3". */
const SHAPING_LADDER = Object.freeze({
  damage: Object.freeze({ 1: 2, 2: 4, 3: 6 }),
  slide: Object.freeze({ 1: 1, 2: 2, 3: 3 }),
  shift: Object.freeze({ 1: 1, 2: 2, 3: 3 }),
});

/**
 * How much of the chosen effect one Elemental Shaping delivers.
 *
 * `spend` is the Essence riding on the use: *"for each Essence spent, the chosen effect increases by
 * 1 (damage, slide, or shift)"* — one ladder, one rider, the same +1 whichever mode was picked.
 *
 * Unknown mode or unrolled tier returns 0 rather than throwing: a card with no tier on it yet is a
 * card the player is still looking at.
 *
 * @param {object} opts
 * @param {string} opts.mode    One of {@link SHAPING_MODES}.
 * @param {number} opts.tier    The power roll's tier, 1–3.
 * @param {number} [opts.spend] Essence spent on the use.
 * @returns {number}
 */
export function shapingValue({ mode = "", tier = 0, spend = 0 } = {}) {
  const ladder = SHAPING_LADDER[String(mode)];
  const step = ladder?.[Math.floor(Number(tier) || 0)];
  if (!step) return 0;
  return step + Math.max(0, Math.floor(Number(spend) || 0));
}

/**
 * The `system.power.effects` update that stamps one damage type onto every tier of every damage
 * effect on an ability, or `null` when there is nothing to change.
 *
 * Returns `null` — not an empty object — when the ability is already that type, so the caller can
 * skip the database write entirely. A hero switching attunement mid-fight would otherwise write
 * nine items every time they changed their mind.
 *
 * @param {object} system   An ability's `system`, as a plain object.
 * @param {string} type     One of {@link ATTUNEMENT_TYPES}.
 * @returns {object|null}   Flattened update paths, ready for `Item#update`.
 */
export function damageTypeUpdate(system, type) {
  if (!ATTUNEMENT_TYPES.includes(String(type))) return null;
  const effects = system?.power?.effects ?? {};
  const update = {};
  for (const [id, effect] of Object.entries(effects)) {
    if ((effect?.type ?? "") !== "damage") continue;
    for (const tier of ["tier1", "tier2", "tier3"]) {
      const current = effect.damage?.[tier]?.types;
      if (!current) continue;
      if ((current.length === 1) && (current[0] === type)) continue;
      update[`system.power.effects.${id}.damage.${tier}.types`] = [type];
    }
  }
  return Object.keys(update).length ? update : null;
}

/* ============================================ Foundry registration */

const loc = (key, data) => (data ? game.i18n.format(`${L}.${key}`, data) : game.i18n.localize(`${L}.${key}`));
const esc = text => foundry.utils.escapeHTML(String(text ?? ""));
const typeLabel = type => loc(`Types.${type}`);
const isElementalist = actor => (actor?.type === "hero") && (actor.system.class?.system?._dsid === "elementalist");

/** The hero's current attunement, or "" when they have not picked one. */
export const attunementOf = actor =>
  (ATTUNEMENT_TYPES.includes(actor?.getFlag?.(MODULE_ID, ATTUNEMENT_FLAG)) ? actor.getFlag(MODULE_ID, ATTUNEMENT_FLAG) : "");

/** Stamp one damage type onto one ability, if it is not already wearing it. */
async function applyDamageType(item, type) {
  const update = damageTypeUpdate(item?.toObject?.()?.system ?? item?.system, type);
  if (!update) return false;
  await item.update(update);
  return true;
}

/**
 * Remember which element this summon was called with, on the ability that called it.
 *
 * Written even when it has not changed is a pointless database write on every use, so it is skipped
 * when the flag already says the same thing — a player re-summoning the same Zephyr should not
 * touch the sheet.
 */
export async function recordSummonElement(ability, element) {
  if (!ability?.setFlag) return false;
  if (ability.getFlag(MODULE_ID, SUMMON_ELEMENT_FLAG) === element) return false;
  await ability.setFlag(MODULE_ID, SUMMON_ELEMENT_FLAG, element);
  return true;
}

/** The element an ability last summoned with, or `""`. */
export const summonElementOf = ability =>
  (elementAdjective(ability?.getFlag?.(MODULE_ID, SUMMON_ELEMENT_FLAG)) ? ability.getFlag(MODULE_ID, SUMMON_ELEMENT_FLAG) : "");

/**
 * Set (or change) a hero's attunement and re-type every class ability that follows it.
 * @returns {Promise<number>}  How many abilities were re-typed.
 */
export async function setAttunement(actor, type) {
  if (!isElementalist(actor) || !ATTUNEMENT_TYPES.includes(type)) return 0;
  await actor.setFlag(MODULE_ID, ATTUNEMENT_FLAG, type);
  let retyped = 0;
  for (const item of actor.items) {
    if ((item.type !== "ability") || !ATTUNED_DSIDS.includes(item.system?._dsid)) continue;
    if (await applyDamageType(item, type)) retyped += 1;
  }
  ui.notifications.info(loc("Attunement.Set", { name: actor.name, type: typeLabel(type) }));
  return retyped;
}

/** A one-select DialogV2 prompt. Returns the chosen value, or null. */
async function choose(title, prompt, options, selected = null) {
  const html = options.map((option, index) => {
    const isOn = selected ? (option.value === selected) : (index === 0);
    return `<option value="${esc(option.value)}"${isOn ? " selected" : ""}>${esc(option.label)}</option>`;
  }).join("");
  const picked = await foundry.applications.api.DialogV2.prompt({
    window: { title },
    content: `<p>${esc(prompt)}</p><div class="form-group"><select name="choice">${html}</select></div>`,
    ok: { label: loc("Choose.Confirm"), callback: (event, button) => button.form.elements.choice.value },
    rejectClose: false,
  });
  return picked || null;
}

/** Ask which element, from a fixed list. */
const chooseType = (title, prompt, types, selected = null) =>
  choose(title, prompt, types.map(type => ({ value: type, label: typeLabel(type) })), selected);

/**
 * The hero's attunement, asking for one if they have never picked.
 *
 * A player who backs out of the prompt gets `""` and the use is refused — a Hurl Element that rolls
 * typeless is the bug this closes, so rolling one "just this once" is not a fallback.
 */
async function ensureAttunement(actor) {
  const current = attunementOf(actor);
  if (current) return current;
  const picked = await chooseType(
    loc("Attunement.Title"),
    loc("Attunement.Prompt", { name: actor?.name ?? "" }),
    ATTUNEMENT_TYPES,
  );
  if (!picked) return "";
  await setAttunement(actor, picked);
  return picked;
}

/* -------------------------------------------- Elemental Shaping */

const partsOf = message => {
  const parts = message?.system?.parts;
  if (!parts) return [];
  return Array.isArray(parts) ? parts : (parts.contents ?? Object.values(parts));
};
const partType = part => part?.type ?? part?.constructor?.TYPE;

/** The tier this card rolled, or 0. Lowest wins when targets split it, as scripts/veil-summons.mjs does. */
function tierOf(message) {
  const tiers = partsOf(message).filter(part => partType(part) === "abilityResult")
    .map(part => Number(part.tier)).filter(Boolean);
  return tiers.length ? Math.min(...tiers) : 0;
}

/**
 * Essence riding on this use.
 *
 * Read defensively from both ends — the config the caller passed and the use part on the card —
 * because the system has moved this field before and a wrong number here would be worse than a
 * missing one. Anything unreadable is 0, which is the unboosted card.
 */
function essenceSpent(config, message) {
  const fromConfig = Number(config?.spend?.value ?? config?.spend ?? 0);
  if (Number.isFinite(fromConfig) && (fromConfig > 0)) return Math.floor(fromConfig);
  for (const part of partsOf(message)) {
    if (partType(part) !== "abilityUse") continue;
    const spent = Number(part?.spend?.value ?? part?.spend ?? 0);
    if (Number.isFinite(spent) && (spent > 0)) return Math.floor(spent);
  }
  return 0;
}

/** Everything this use was aimed at, read before the roll can clear it. */
const targetTokens = () => [...(game.user?.targets ?? [])].filter(token => token?.actor);

/** A token's centre in the shape scripts/hit-fx.mjs draws from. */
function fxPoint(token) {
  const centre = token?.center ?? token?.object?.center ?? null;
  if (!centre || !Number.isFinite(centre.x)) return null;
  return { x: centre.x, y: centre.y, uuid: (token.document ?? token)?.uuid ?? null };
}

/**
 * One line of Elemental Shaping's ladder, with the number filled in.
 *
 * `damage` and `value` are separate because the card's damage row carries a type and its movement
 * rows do not, and the pre-roll dialog shows the whole ladder ("2 / 4 / 6") where the post-roll line
 * shows the one number the dice produced.
 */
const shapingLabel = (mode, { amount, type }) => loc(
  `Shaping.${mode.charAt(0).toUpperCase()}${mode.slice(1)}`,
  { damage: amount, value: amount, type },
);

/**
 * One Elemental Shaping, resolved.
 *
 * The mode is chosen **before** the roll, because the card says "choose one when you use this
 * ability" and because a mode chosen after the tier is known is a different game. The number is
 * computed after, from the tier the dice actually produced.
 *
 * Only the damage mode is applied to anybody: a slide and a shift are forced movement, and this file
 * has no business moving somebody's token for them. Both still print the exact distance on the card,
 * which is the number the table was otherwise doing in its head.
 */
async function useShaping(model, use, config, dialogOptions, messageOptions) {
  const actor = model.actor;
  const attuned = attunementOf(actor);
  const ladderType = attuned ? typeLabel(attuned) : loc("Types.elemental");

  const mode = await choose(
    loc("Shaping.Title"),
    loc("Shaping.Prompt", { name: actor?.name ?? "" }),
    SHAPING_MODES.map(key => ({
      value: key,
      label: shapingLabel(key, { amount: (key === "damage") ? "2 / 4 / 6" : "1 / 2 / 3", type: ladderType }),
    })),
  );
  if (!mode) return null;

  // Only the burst is typed, so only the burst has to know the attunement — a player who has never
  // picked one can still shift out of a fire without answering a question about acid first.
  let type = attuned;
  if (mode === "damage") {
    type = await ensureAttunement(actor);
    if (!type) return null;
  }

  const tokens = targetTokens();
  if ((mode !== "shift") && !tokens.length) {
    ui.notifications.warn(loc("Shaping.NoTarget"));
    return null;
  }

  const message = await use.call(model, config, dialogOptions, messageOptions);
  const tier = tierOf(message);
  const amount = shapingValue({ mode, tier, spend: essenceSpent(config, message) });
  if (!amount) return message;

  const label = shapingLabel(mode, { amount, type: type ? typeLabel(type) : ladderType });
  await message?.setFlag?.(MODULE_ID, "shaping", { mode, value: amount, type, label });

  if (mode === "damage") {
    for (const token of tokens) {
      const target = token.actor;
      if (typeof target.system?.takeDamage !== "function") {
        console.warn(`${MODULE_ID} | ${target.name}: no system.takeDamage; Elemental Shaping's ${amount} not applied`);
        continue;
      }
      await target.system.takeDamage(amount, { type });
    }
    // Shaping is suppressed in scripts/hit-fx.mjs precisely because two of its three modes are not a
    // hit. This one is, so it asks for the beat itself, with the points it still has in hand.
    playHitFx("spell", {
      from: fxPoint(actor?.getActiveTokens?.()?.[0]),
      at: tokens.map(fxPoint).filter(Boolean),
      name: model.parent?.name ?? "",
      // 0.3.134 (E): Elemental Shaping is suppressed in hit-fx.mjs and calls playHitFx itself, so it
      // is also the one caller that has to hand over its own element. It has it in `type`.
      element: type || null,
    });
  }
  ui.notifications.info(loc("Shaping.Chose", { name: actor?.name ?? "", mode: label }));
  return message;
}

/** The Shaping line on the card, so the resolved mode outlives the toast. */
function injectShapingLine(message, html) {
  const shaping = message.getFlag?.(MODULE_ID, "shaping");
  if (!shaping || html.querySelector(".ghostwire-shaping-line")) return;
  const host = html.querySelector(".message-content") ?? html;
  const line = document.createElement("p");
  line.className = "ghostwire-shaping-line";
  line.innerHTML = `<em>${esc(shaping.label)}</em>`;
  host.append(line);
}

/* -------------------------------------------- the use chain */

function patchElementalistUse() {
  const AbilityModel = CONFIG.Item.dataModels?.ability ?? globalThis.ds?.data?.Item?.AbilityModel;
  if (!AbilityModel?.prototype.use) {
    console.warn(`${MODULE_ID} | AbilityModel#use not found; Elementalist choices are unwired`);
    return;
  }
  const use = AbilityModel.prototype.use;
  AbilityModel.prototype.use = async function(config = {}, dialogOptions = {}, messageOptions = {}) {
    const actor = this.actor;
    const dsid = this.parent?.system?._dsid ?? "";
    if (!isElementalist(actor)) return use.call(this, config, dialogOptions, messageOptions);

    // A companion picks its element as it is summoned, and the pick has to be on the item *before*
    // the roll, because the roll is the companion's strike.
    if (COMPANION_ELEMENTS[dsid]) {
      // Ember prints one element and is not asked; Zephyr and Boulder are.
      const types = COMPANION_ELEMENTS[dsid];
      const picked = companionNeedsChoice(dsid)
        ? await chooseType(this.parent.name, loc("Attunement.Companion", { name: actor.name }), types)
        : types[0];
      if (!picked) return null;
      await applyDamageType(this.parent, picked);
      await recordSummonElement(this.parent, picked);
      ui.notifications.info(loc("Attunement.Hurl", { name: this.parent.name, type: typeLabel(picked) }));
      return use.call(this, config, dialogOptions, messageOptions);
    }

    // 0.3.134 (D) — a bound elemental wears the caster's attunement, and the placed token is named
    // for it ("Electrical Zephyr", "Fire Elemental"). The pick has to land on the ability before the
    // roll, because veil-summons.mjs reads it off the ability when the roll's message arrives.
    if (BOUND_SUMMON_DSIDS.includes(dsid)) {
      const type = await ensureAttunement(actor);
      if (!type) return null;
      await recordSummonElement(this.parent, type);
      return use.call(this, config, dialogOptions, messageOptions);
    }

    if (dsid === "elemental-shaping") return useShaping(this, use, config, dialogOptions, messageOptions);

    if (ATTUNED_DSIDS.includes(dsid)) {
      const type = await ensureAttunement(actor);
      if (!type) return null;
      await applyDamageType(this.parent, type);          // a no-op once the attunement sync has run
      return use.call(this, config, dialogOptions, messageOptions);
    }

    return use.call(this, config, dialogOptions, messageOptions);
  };
}

export function registerElementalist() {
  patchElementalistUse();

  // Switching attunement is free in RAW, so it is one right-click on any attuned ability row rather
  // than a maneuver, an ability, or a sheet the player has to go and find.
  Hooks.on("getDocumentListContextOptions", (app, menuItems) => {
    if (typeof app._getEmbeddedDocument !== "function") return;
    const attuned = target => {
      const item = app._getEmbeddedDocument(target);
      return ((item?.type === "ability") && ATTUNED_DSIDS.includes(item.system?._dsid)
        && item.isOwner && isElementalist(item.parent)) ? item : null;
    };
    menuItems.push({
      label: `${L}.Attunement.Title`, icon: "fa-solid fa-atom",
      visible: target => !!attuned(target),
      onClick: async (event, target) => {
        const actor = attuned(target)?.parent;
        if (!actor) return;
        const picked = await chooseType(
          loc("Attunement.Title"),
          loc("Attunement.Prompt", { name: actor.name }),
          ATTUNEMENT_TYPES,
          attunementOf(actor) || null,
        );
        if (picked) await setAttunement(actor, picked);
      },
    });
  });

  Hooks.on("renderChatMessageHTML", (message, html) => injectShapingLine(message, html));

  const module = game.modules.get(MODULE_ID);
  if (module) {
    module.api = {
      ...(module.api ?? {}),
      ATTUNEMENT_TYPES,
      ATTUNED_DSIDS,
      attunementOf,
      setAttunement,
      shapingValue,
      damageTypeUpdate,
      companionNeedsChoice,
      summonPicksElement,
      summonElementOf,
      SUMMON_ELEMENT_FLAG,
    };
  }
  console.log(`${MODULE_ID} | Elementalist choices registered`
    + ` (attunement → ${ATTUNED_DSIDS.length} abilities; Elemental Shaping modes; companion elements)`);
}
