/**
 * Shared Draw Steel NPC item builders for Ghostwire one-shot Actor generators
 * (Mama's Club floor cast, Deadhead cast). Output shape is the packed-source
 * form tools/build-packs.mjs expects: embedded items carry "!actors.items!" keys.
 *
 * Item ids derive from the Actor id: first 12 chars + "It" + two digits, so an
 * Actor id must stay unique in its first 12 characters within a pack.
 */

export const MELEE = { type: "melee", primary: "1", secondary: "1", tertiary: "1" };
export const RANGED = { type: "ranged", primary: "1", secondary: "5", tertiary: "1" };

export const NO_DAMAGE_MOD = {
  all: 0, acid: 0, cold: 0, corruption: 0, fire: 0,
  holy: 0, lightning: 0, poison: 0, psychic: 0, sonic: 0,
};

export const itemId = (id, n) => `${id.slice(0, 12)}It${String(n).padStart(2, "0")}`;
export const captainId = id => `${id.slice(0, 11)}Captn`;

/**
 * Builders bound to one source citation. `minionSpine` lends the street "With
 * Captain" rider to minion Actors.
 */
export function makeNpcKit({ module, source, minionSpine }) {
  function feature({ id, n, name, img, dsid, html, sort = 0 }) {
    return {
      name,
      type: "feature",
      _id: itemId(id, n),
      img,
      system: {
        description: { value: html, director: "" },
        source,
        _dsid: dsid,
        advancements: {},
        prerequisites: { value: "", dsid: [], level: null },
      },
      effects: [],
      folder: null,
      sort,
      ownership: { default: 0 },
      flags: {},
      _key: `!actors.items!${id}.${itemId(id, n)}`,
    };
  }

  /**
   * A plain signature strike. `tiers` is [t1, t2, t3] damage values; `applied` is an
   * optional Draw Steel condition key stamped on every tier (EoT).
   */
  function strike({ id, n, name, img, dsid, story, keywords, distance, characteristic, tiers, applied, appliedHtml, sort = 0 }) {
    const damage = {};
    ["tier1", "tier2", "tier3"].forEach((tier, i) => {
      damage[tier] = {
        value: String(tiers[i]),
        types: [],
        potency: {
          value: `@potency.${["weak", "average", "strong"][i]}`,
          characteristic: i === 0 ? "none" : "",
        },
        ignoredImmunities: [],
      };
    });

    const effects = {
      [`${id.slice(0, 12)}Dmg0`]: {
        name: "",
        img: null,
        type: "damage",
        _id: `${id.slice(0, 12)}Dmg0`,
        damage,
        sort: 0,
      },
    };
    if (applied) {
      const appliedTier = i => ({
        display: "",
        effects: { [applied]: { condition: "always", end: "turn", properties: [] } },
        potency: {
          value: `@potency.${["weak", "average", "strong"][i]}`,
          characteristic: i === 0 ? characteristic : "",
        },
      });
      effects[`${id.slice(0, 12)}App0`] = {
        name: "",
        img: null,
        type: "applied",
        _id: `${id.slice(0, 12)}App0`,
        applied: { tier1: appliedTier(0), tier2: appliedTier(1), tier3: appliedTier(2) },
        sort: 0,
      };
    }

    return {
      name,
      type: "ability",
      _id: itemId(id, n),
      img,
      system: {
        type: "main",
        source,
        _dsid: dsid,
        story: story ?? "",
        keywords,
        category: "signature",
        resource: null,
        trigger: "",
        distance,
        damageDisplay: distance.type === "ranged" ? "ranged" : "melee",
        target: { type: "creatureObject", value: 1, custom: "" },
        power: {
          roll: { formula: "@chr", characteristics: [characteristic], reactive: false },
          effects,
        },
        effects: appliedHtml
          ? {
              after00000000000: {
                _id: "after00000000000",
                type: "base",
                description: appliedHtml,
                name: "",
                img: null,
                sort: 0,
                before: false,
              },
            }
          : {},
        prerequisites: { value: "", dsid: [], level: null },
      },
      effects: [],
      folder: null,
      sort,
      ownership: { default: 0 },
      flags: {},
      _key: `!actors.items!${id}.${itemId(id, n)}`,
    };
  }

  /** The Director Wire Kit stamp — itself a Connect interface (see 0.3.82). */
  function wireKit(id, n) {
    return {
      name: "GHOSTWIRE.Matrix.Items.WireKit.ShortName",
      type: "feature",
      img: "icons/commodities/tech/cable-end.webp",
      system: {
        description: { value: "GHOSTWIRE.Matrix.Items.WireKit.Description", director: "" },
        source: {
          book: "Ghostwire Core Rulebook",
          page: "21-the-wire",
          license: "Draw Steel Creator License",
        },
        _dsid: "wire-kit-matrix-verbs",
        advancements: {},
        prerequisites: { value: "", dsid: [], level: null },
      },
      effects: [],
      folder: null,
      sort: 9000,
      ownership: { default: 0 },
      flags: {
        [module]: {
          kind: "wire-kit",
          dsid: "wire-kit-matrix-verbs",
          wired: { connectInterface: true },
        },
      },
      _id: itemId(id, n),
      _key: `!actors.items!${id}.${itemId(id, n)}`,
    };
  }

  /** Append Wire Kit as the last item when the roster entry did not already include one. */
  function ensureWireKit(id, items) {
    if (items.some(i => i.system?._dsid === "wire-kit-matrix-verbs")) return items;
    return [...items, wireKit(id, items.length + 1)];
  }

  /** Minions keep the street "With Captain" rider, rekeyed onto the new Actor. */
  function captainEffect(id) {
    const effect = structuredClone(minionSpine.effects.find(e => e.name === "With Captain"));
    effect._id = captainId(id);
    effect.origin = `Actor.${id}`;
    effect._key = `!actors.effects!${id}.${captainId(id)}`;
    return effect;
  }

  return { feature, strike, wireKit, ensureWireKit, captainEffect };
}
