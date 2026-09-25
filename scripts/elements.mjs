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
  const effects = ability?.system?.power?.effects ?? {};
  const list = Array.isArray(effects) ? effects : Object.values(effects);
  for (const effect of list) {
    if ((effect?.type ?? "") !== "damage") continue;
    for (const tier of ["tier1", "tier2", "tier3"]) {
      const types = effect?.damage?.[tier]?.types ?? [];
      const hit = [...types].map(t => String(t).toLowerCase()).find(t => ELEMENT_FX[t]);
      if (hit) return hit;
    }
  }
  return null;
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
