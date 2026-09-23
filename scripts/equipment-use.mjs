// B49 — a Ghostwire weapon in a hero's inventory gets a usable attack ability.
//
// Investigation (Draw Steel 1.1.2, read from draw-steel.mjs — see the as-built notes in
// docs/directors/equipment-use-abilities.md):
//   * There is no weapon Item type. Weapons are `treasure` with `system.kind: "weapon"` — inventory
//     and flavour, with no attack profile and no advancement grant.
//   * `freeStrike` as a stat exists only on the monster model. Heroes attack with abilities:
//     the system ships **Melee Free Strike** and **Ranged Free Strike** (`system.category: "freeStrike"`)
//     in `hero.defaultItems`, and kits add their damage and distance bonuses by ability keyword.
//   * So there is no native per-weapon path to switch on. The Ghostwire answer is to spawn an
//     ability shaped exactly like a free strike, but carrying this weapon's range band and damage —
//     which also means kit bonuses keep applying, because the keywords still say strike/weapon.
//
// Using it goes through the normal ability pipeline, so it produces the `abilityUse` chat part that
// B40 listens for and the sound plays with no extra wiring.
import { weaponSkillKey } from "./weapon-skills.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const TEMPLATES_PATH = `modules/${MODULE_ID}/scripts/data/weapon-use-templates.json`;
const L = "GHOSTWIRE.EquipmentUse";

let TEMPLATES = null;

/* -------------------------------------------- gear reading */

/** Ghostwire stamps every gear SKU with its own flags; weapons carry band, range and damage. */
const gearFlags = item => item?.flags?.[MODULE_ID]?.gear ?? null;

/** Is this a Ghostwire weapon treasure we should arm? */
export function isWeaponTreasure(item) {
  if (item?.type !== "treasure" || item?.system?.kind !== "weapon") return false;
  const gear = gearFlags(item);
  return !!gear && !!gear.range;
}

const linkedAbilityId = item => item?.getFlag?.(MODULE_ID, "useAbilityId") ?? null;
const sourceGearId = ability => ability?.getFlag?.(MODULE_ID, "fromGearId") ?? null;

/* -------------------------------------------- ability construction */

/**
 * Build the ability data for one weapon.
 * @param {Item} gearItem  A Ghostwire weapon treasure on an Actor.
 * @returns {object|null}  Item creation data, or null if the templates are unavailable.
 */
export function buildUseAbility(gearItem) {
  if (!TEMPLATES) return null;
  const gear = gearFlags(gearItem);
  const band = TEMPLATES.range[gear.range];
  if (!band) {
    console.warn(`${MODULE_ID} | ${gearItem.name}: unknown range band "${gear.range}"`);
    return null;
  }

  const kind = band.type === "melee" ? "melee" : "ranged";
  const spread = TEMPLATES.spread[kind];
  // Utility weapons ship without a damage line (the Net-Gun ensnares, it doesn't wound). There is
  // no attack profile to build and inventing one is not this spike's job — leave it in inventory.
  // Note `Number("")` is 0, so the blank has to be rejected before the conversion.
  if (gear.damage === null || gear.damage === undefined || gear.damage === "") return null;
  const middle = Number(gear.damage);
  if (!Number.isFinite(middle) || middle <= 0) return null;
  // An unmapped damage type falls back to untyped rather than dropping the weapon entirely.
  const damageTypes = TEMPLATES.damageTypes[gear.damageType] ?? [];

  // The gear's printed number is the middle result; low and high use the free-strike spread.
  // A connecting hit never deals nothing, so the low result floors at 1 (Knuckles, damage 3).
  const tier = (value, potency) => ({
    value: String(Math.max(1, value)),
    types: [...damageTypes],
    ignoredImmunities: [],
    potency: { value: potency, characteristic: "" },
  });

  const effectId = foundry.utils.randomID();
  const verb = kind === "melee" ? game.i18n.localize(`${L}.VerbMelee`) : game.i18n.localize(`${L}.VerbRanged`);

  return {
    name: game.i18n.format(`${L}.AbilityName`, { verb, weapon: gearItem.name }),
    type: "ability",
    img: gearItem.img,
    system: {
      description: {
        value: game.i18n.format(`${L}.AbilityDescription`, {
          weapon: gearItem.name,
          band: gear.range,
          damage: middle,
          type: gear.damageType ?? "kinetic",
        }),
        director: "",
      },
      source: { book: "Ghostwire", page: "08-kits-gear-wealth", license: "Draw Steel Creator License" },
      _dsid: `gear-use-${gearItem.system?._dsid ?? gearItem.id}`,
      keywords: [...TEMPLATES.keywords[kind]],
      type: "main",
      category: "freeStrike",
      resource: null,
      distance: { type: band.type, primary: band.primary, secondary: "1", tertiary: "1" },
      target: { type: "creature", value: 1, custom: "" },
      power: {
        roll: { formula: "@chr", characteristics: [...TEMPLATES.characteristics], reactive: false },
        effects: {
          [effectId]: {
            name: "", img: null, type: "damage", _id: effectId, sort: 0,
            damage: {
              tier1: tier(middle + spread.low, "@potency.weak"),
              tier2: tier(middle, "@potency.average"),
              tier3: tier(middle + spread.high, "@potency.strong"),
            },
          },
        },
      },
    },
    // `weaponSkill` caches the G4 mapping so the roll patch in module.mjs does not have to walk back
    // to the gear on every use; `null` is a real answer (grenades, nets) and is stored as one.
    flags: { [MODULE_ID]: { fromGearId: gearItem.id, fromGearUuid: gearItem.uuid, weaponSkill: weaponSkillKey(gearItem) } },
  };
}

/* -------------------------------------------- sync */

const isHero = actor => actor?.type === "hero";

/** Create the use-ability for one weapon, unless it already has a live one. */
async function armWeapon(gearItem) {
  const actor = gearItem.parent;
  if (!isHero(actor) || !isWeaponTreasure(gearItem)) return null;

  const existingId = linkedAbilityId(gearItem);
  if (existingId && actor.items.get(existingId)) return null;            // already armed
  if (actor.items.some(i => sourceGearId(i) === gearItem.id)) return null; // and no orphan double-up

  const data = buildUseAbility(gearItem);
  if (!data) return null;
  const [ability] = await actor.createEmbeddedDocuments("Item", [data]);
  if (ability) await gearItem.setFlag(MODULE_ID, "useAbilityId", ability.id);
  return ability;
}

/** Remove the ability a weapon spawned, when that weapon leaves the sheet. */
async function disarmWeapon(gearItem) {
  const actor = gearItem.parent;
  if (!isHero(actor)) return;
  const ids = actor.items.filter(i => sourceGearId(i) === gearItem.id).map(i => i.id);
  if (ids.length) await actor.deleteEmbeddedDocuments("Item", ids);
}

/**
 * Bring one actor's weapons and use-abilities into agreement: arm anything unarmed, and clear
 * abilities whose weapon is gone. Idempotent, so it is safe to run on every load.
 * @returns {Promise<{added: number, removed: number}>}
 */
export async function syncActor(actor) {
  if (!isHero(actor) || !actor.isOwner) return { added: 0, removed: 0 };

  const orphans = actor.items.filter(i => {
    const gearId = sourceGearId(i);
    return gearId && !actor.items.get(gearId);
  }).map(i => i.id);
  if (orphans.length) await actor.deleteEmbeddedDocuments("Item", orphans);

  let added = 0;
  for (const gearItem of actor.items.filter(isWeaponTreasure)) {
    if (await armWeapon(gearItem)) added++;
  }
  return { added, removed: orphans.length };
}

/* -------------------------------------------- registration */

export function registerEquipmentUse() {
  Hooks.once("ready", async () => {
    try {
      TEMPLATES = await foundry.utils.fetchJsonWithTimeout(TEMPLATES_PATH);
    } catch (error) {
      console.error(`${MODULE_ID} | could not load ${TEMPLATES_PATH}; weapon use-abilities disabled`, error);
      return;
    }

    // Catch up sheets that already hold weapons — pregens imported before this existed, or gear
    // added while the module was off. One owner per actor does the work.
    let added = 0, removed = 0;
    for (const actor of game.actors) {
      if (!actor.isOwner) continue;
      const result = await syncActor(actor);
      added += result.added; removed += result.removed;
    }
    if (added || removed) console.log(`${MODULE_ID} | weapon use-abilities: +${added} / -${removed}`);
  });

  Hooks.on("createItem", (item, options, userId) => {
    if (userId !== game.user.id || !TEMPLATES) return;
    if (isWeaponTreasure(item)) armWeapon(item);
  });

  Hooks.on("deleteItem", (item, options, userId) => {
    if (userId !== game.user.id) return;
    if (item?.type === "treasure") disarmWeapon(item);
  });

  // An actor imported whole (a pregen dragged out of the compendium) never fires createItem.
  Hooks.on("createActor", (actor, options, userId) => {
    if (userId !== game.user.id || !TEMPLATES) return;
    syncActor(actor);
  });

  const module = game.modules.get(MODULE_ID);
  if (module) module.api = { ...(module.api ?? {}), syncWeaponAbilities: syncActor, buildUseAbility, isWeaponTreasure, weaponSkillKey };
}
