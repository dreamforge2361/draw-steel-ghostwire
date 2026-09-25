// 0.3.134 (D/E) — one table for "which element is this", shared by the three places that were each
// guessing separately.
//
// The bug Michael found: **Hurl Element renders blue whatever you pick.** scripts/hit-fx.mjs chooses
// its colour from `spellFlavour(ability.name)` — a regex over the card's *name* — and "Hurl Element"
// contains no element word at all, so every Hurl Element in the game fell to the `arcane` fallback
// and threw a pale blue bolt. Fire was blue. Acid was blue. The element the player picked was already
// on the card as a damage **type** (scripts/elementalist.mjs writes it onto `damage.tierN.types`), and
// nothing was reading it.
//
// So: the element is read off the damage type, and this file is the only place that says what each
// element looks like, sounds like, and is called. Three consumers:
//
//   * **scripts/hit-fx.mjs** — `ELEMENT_FX[type]` overrides the spell profile's colour, core and sound.
//   * **scripts/veil-summons.mjs** — `elementAdjectiveKey` names the placed token "Electrical Zephyr".
//   * **scripts/elementalist.mjs** — records the pick so the other two can find it.
//
// Foundry-free on purpose: tools/wave-03134-smoke.mjs runs every export of this file in Node.

/**
 * Every element Ghostwire offers, in the order Hurl Element prints them, plus the three Draw Steel
 * damage types a Director's homebrew can still reach (`holy`, `psychic`, and untyped `elemental`).
 */
export const ELEMENTS = Object.freeze([
  "acid", "cold", "corruption", "fire", "holy", "lightning", "poison", "psychic", "sonic",
]);

/**
 * The adjective a token wears when it is summoned with an element: `"Electrical Zephyr"`.
 *
 * `lightning` reads **Electrical** and not "Lightning" because that is the word Ghostwire already
 * uses everywhere else for the same damage type — the Seraph Mercy is "4 electrical", the Shock-Stick
 * is "4 electrical" — and because Michael named the case that way. Every other element keeps its own
 * word. `corruption` shortens to "Corrupt" so the name reads as an adjective and not a noun.
 *
 * The values here are lang keys under `GHOSTWIRE.Summons.Veil.UI.Elements`, so a translation can
 * change the printed word without touching the mapping.
 */
export const ELEMENT_ADJECTIVE = Object.freeze({
  acid: "Acid",
  cold: "Cold",
  corruption: "Corrupt",
  fire: "Fire",
  holy: "Holy",
  lightning: "Electrical",
  poison: "Poison",
  psychic: "Psychic",
  sonic: "Sonic",
});

/** The lang key for an element's token adjective, or null when the element is unknown. */
export function elementAdjectiveKey(element) {
  const key = String(element ?? "").trim().toLowerCase();
  return ELEMENT_ADJECTIVE[key] ? `GHOSTWIRE.Summons.Veil.UI.Elements.${key}` : null;
}

/**
 * The English adjective, for a Node smoke and as the fallback when no localizer is present.
 * @param {string} element
 * @returns {string} `""` for an unknown element — never a guess.
 */
export function elementAdjective(element) {
  return ELEMENT_ADJECTIVE[String(element ?? "").trim().toLowerCase()] ?? "";
}

/**
 * Colour, hot core and sound per element.
 *
 * `color` is the outer hue the beam and the impact ring wear; `core` is the hot inner tint the flash
 * and the beam head wear — the same two fields `HIT_FX_PROFILES` in scripts/hit-fx.mjs already uses,
 * so this is a drop-in override rather than a second rendering path.
 *
 * Sounds are only overridden where the module actually ships something that matches. Cold, psychic
 * and untyped keep the generic cast sound rather than borrowing one that would read wrong.
 */
export const ELEMENT_FX = Object.freeze({
  fire:       { color: 0xff5a1f, core: 0xffd9a0, sound: "spell-fireball.ogg" },
  cold:       { color: 0xaee8ff, core: 0xffffff, sound: "spell-dark-light.ogg" },
  lightning:  { color: 0x9fd4ff, core: 0xf6fdff, sound: "spell-lightning.ogg" },
  acid:       { color: 0x7fd83c, core: 0xe6ffcc, sound: "spell-boil.ogg" },
  poison:     { color: 0x7bb04a, core: 0xd9b3ff, sound: "toxin-hiss.ogg" },
  corruption: { color: 0xb46bff, core: 0xecd8ff, sound: "spell-dark-blast.ogg" },
  sonic:      { color: 0xd7e9ff, core: 0xffffff, sound: "thunder-crash.ogg" },
  psychic:    { color: 0xff6be0, core: 0xffd6f6, sound: "spell-dark-light.ogg" },
  holy:       { color: 0xffe08a, core: 0xfffbe6, sound: "spell-holy-heal.ogg" },
});

/**
 * The FX override for one element, or null.
 * @param {string} element
 * @param {string} [sfxRoot]  Prefix for `sound`; the caller passes its own assets path.
 * @returns {{color: number, core: number, sound: string}|null}
 */
export function elementFx(element, sfxRoot = "modules/draw-steel-ghostwire/assets/sfx") {
  const row = ELEMENT_FX[String(element ?? "").trim().toLowerCase()];
  if (!row) return null;
  return { color: row.color, core: row.core, sound: `${sfxRoot}/${row.sound}` };
}

/** The three damage tiers, in the order a card prints them. */
const DAMAGE_TIERS = Object.freeze(["tier1", "tier2", "tier3"]);

/**
 * Every power effect on an ability, whatever shape it is in.
 *
 * 0.3.135 (2) — this is the second half of the Hurl Element colour bug, and the reason 0.3.134's fix
 * only worked in Node. `system.power.effects` is a **CollectionField** on the live `AbilityModel`, so
 * `Object.values(effects)` on it returns the collection's own enumerable *properties* — not its
 * entries — which is an empty list of damage effects on every real card in a running world. The
 * attunement write path was correct all along (Kaës had `flag = fire` and typed tiers, and chat said
 * Fire Damage); `elementOfAbility` simply could not see it, returned `null`, and `hit-fx.mjs` fell
 * through to `spellFlavour("Hurl Element")` — arcane pale blue.
 *
 * Four shapes, in order of how much they tell us:
 *
 *  1. `effects.documentsByType.damage` — a `ModelCollection`'s type index. Cheapest and exact.
 *  2. `effects.values()` — any Map / Collection / Set.
 *  3. a plain array (what a smoke or a `toObject()` hands over).
 *  4. a plain object keyed by effect id (what the pack JSON on disk looks like).
 *
 * @param {object|Array|Map|null} effects
 * @returns {object[]}
 */
export function powerEffectList(effects) {
  if (!effects) return [];
  if (Array.isArray(effects)) return effects;
  const byType = effects.documentsByType;
  if (byType) {
    const damage = byType.damage ?? byType.get?.("damage");
    if (damage) return Array.isArray(damage) ? damage : [...damage];
  }
  if (typeof effects.values === "function") {
    try {
      return [...effects.values()];
    } catch {
      /* fall through to the plain-object read */
    }
  }
  if (typeof effects !== "object") return [];
  return Object.values(effects).filter(value => value && (typeof value === "object"));
}

/**
 * The model type of one power effect.
 *
 * A plain row carries `type`; a live `DamageModel` carries it on its schema *and* on the class as
 * `TYPE`, and a `toObject()`-ed one keeps it on `_source`. All three are read rather than assuming.
 *
 * @param {object} effect
 * @returns {string}
 */
export function powerEffectType(effect) {
  const raw = effect?.type ?? effect?.constructor?.TYPE ?? effect?._source?.type ?? "";
  return String(raw ?? "").toLowerCase();
}

/** A tier's damage types as a plain lowercase array, whatever container they arrived in. */
function damageTypes(tier) {
  const types = tier?.types;
  if (!types) return [];
  if (typeof types === "string") return [types.toLowerCase()];
  if (Array.isArray(types) || (typeof types[Symbol.iterator] === "function")) {
    return [...types].map(type => String(type).toLowerCase());
  }
  return Object.values(types).map(type => String(type).toLowerCase());
}

/**
 * The element an ability is currently typed to, read off its own damage effects.
 *
 * This is the whole fix for the Hurl Element colour bug: `scripts/elementalist.mjs` already stamps
 * the chosen type onto every tier of every damage effect before the roll, so by the time the card
 * exists the answer is sitting on it. First typed tier wins; a card with two different types on two
 * tiers is not something Ghostwire ships, and guessing between them would be worse than `null`.
 *
 * @param {{system?: object}|object} ability  An ability Item, live or plain.
 * @returns {string|null}
 */
export function elementOfAbility(ability) {
  const effects = ability?.system?.power?.effects ?? ability?.power?.effects ?? null;
  for (const effect of powerEffectList(effects)) {
    if (powerEffectType(effect) !== "damage") continue;
    for (const tier of DAMAGE_TIERS) {
      const hit = damageTypes(effect?.damage?.[tier]).find(type => ELEMENT_FX[type]);
      if (hit) return hit;
    }
  }
  return null;
}

/**
 * The element to colour an attack with: the card's own damage type, else the caster's attunement.
 *
 * 0.3.135 (2), the belt to the braces above. A Director's homebrew Hurl Element, or a card the
 * attunement sync has not reached yet, still carries the hero's chosen element — it is on the actor
 * as `flags.draw-steel-ghostwire.attunement`. Reading it here means the fallback is the player's own
 * pick rather than arcane blue. Returns `null` when neither source says anything, because a guess is
 * worse than the generic profile.
 *
 * `attunement` is passed in rather than imported so this file stays Foundry-free and free of a cycle
 * with scripts/elementalist.mjs.
 *
 * @param {object} ability
 * @param {string} [attunement]  The caster's attunement flag, when the caller can see one.
 * @returns {string|null}
 */
export function elementForFx(ability, attunement = "") {
  const typed = elementOfAbility(ability);
  if (typed) return typed;
  const fallback = String(attunement ?? "").trim().toLowerCase();
  return ELEMENT_FX[fallback] ? fallback : null;
}

/**
 * Prefix a summon's name with its element, without ever doing it twice.
 *
 * Re-summoning, a level-up refresh and `summon-art.mjs` all re-stamp names, and a naive
 * `${adjective} ${name}` would give you "Electrical Electrical Zephyr" by the third pass. The guard
 * is: if the name already starts with *any* element adjective, that prefix is replaced, not stacked.
 *
 * @param {string} baseName   The template's name ("Zephyr Companion").
 * @param {string} element
 * @param {(key: string) => string} [localize]  A localizer for the adjective; identity in Node.
 * @returns {string}
 */
export function elementalName(baseName, element, localize = null) {
  const base = String(baseName ?? "").trim();
  if (!base) return base;
  const adjectives = Object.values(ELEMENT_ADJECTIVE)
    .map(word => (localize ? String(localize(`GHOSTWIRE.Summons.Veil.UI.Elements.${
      Object.keys(ELEMENT_ADJECTIVE).find(k => ELEMENT_ADJECTIVE[k] === word)
    }`) ?? word) : word));
  let stripped = base;
  let changed = true;
  while (changed) {
    changed = false;
    for (const word of [...adjectives, ...Object.values(ELEMENT_ADJECTIVE)]) {
      if (!word) continue;
      if (stripped.toLowerCase().startsWith(`${word.toLowerCase()} `)) {
        stripped = stripped.slice(word.length + 1).trim();
        changed = true;
      }
    }
  }
  const key = elementAdjectiveKey(element);
  if (!key) return stripped;
  const adjective = localize ? String(localize(key) ?? elementAdjective(element)) : elementAdjective(element);
  return adjective ? `${adjective} ${stripped}` : stripped;
}
