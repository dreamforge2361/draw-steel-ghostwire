// G4 / B49 — which skill backs a Ghostwire weapon, and the benefit it is worth on that weapon's roll.
//
// RAW (docs/raw/03-tests-power-rolls.md, GHOSTWIRE_SKILLS_MASTER.md): having the right skill on a
// Power Roll is a flat **+2 bonus**, not an edge. Draw Steel agrees — its own skill dropdown adds
// `modifiers.bonuses += 2` when you pick a skill. So this is a bonus, not an edge; the Hacking path
// in wired-state.mjs is an edge only because the Wired rules say edge.
//
// The lock (Michael, 2026-09-22) maps gear *folders* to skills. A folder is a compendium-side fact:
// once a weapon is dragged onto a sheet the folder is gone, so the folder rule is compiled here into
// an explicit SKU table keyed on `system._dsid`. `tools/g4-skill-on-weapon-smoke.mjs` re-derives the
// table from `src/packs/gear/weapons/` on every run, so the rule and the table cannot drift.
//
// Three rows are deliberate and easy to get backwards:
//   * `melee/` is **melee** even when the SKU's kit band is `heavy` (Warhammer, Slab-Hammer,
//     Powered Greatsword). Heavy Weapons is launchers and support guns, not big swords.
//   * `heavy/` stays **heavyWeapons** in a hero's hands even for the two "Mounted"-tagged pieces.
//     Gunnery is for a gun bolted to a machine, which is the mount check below, not a gear tag.
//   * Bows and crossbows are **firearms** — the skill reads "conventional ranged weapons".

const MODULE_ID = "draw-steel-ghostwire";

/** RAW skill benefit on a Power Roll. */
export const WEAPON_SKILL_BONUS = 2;

/**
 * Gear `_dsid` -> Ghostwire skill key, compiled from the folder rule.
 * `null` means "no skill backs this" — a thrown grenade or a hand-flung net is nobody's weapon
 * skill, and an unmapped weapon must give no bonus rather than a guessed one.
 */
export const WEAPON_SKILLS = {
  // bows-exotic/ -> Firearms (conventional ranged weapons)
  "dart-gun": "firearms",
  "gauss-needler": "firearms",
  "hand-crossbow": "firearms",
  "heavy-crossbow": "firearms",
  "hunting-bow": "firearms",
  "net-gun": "firearms",
  "scrap-bow": "firearms",
  "street-bow": "firearms",
  "weighted-net": null, // thrown by hand, and it has no damage line, so it never arms anyway

  // heavy/ -> Heavy Weapons
  "chatterbox": "heavyWeapons",
  "dragons-breath": "heavyWeapons",
  "grease-gun": "heavyWeapons",
  "hand-of-god": "heavyWeapons",
  "siege-missile": "heavyWeapons",
  "tank-cracker": "heavyWeapons",
  "wallbreaker": "heavyWeapons",

  // mounted/ -> Gunnery. These are vehicle / drone hardpoint SKUs (0.3.112): there is no hand-held
  // way to fire one, so Gunnery is the answer whether or not the gun is currently on a hardpoint.
  "ashwalker": "gunnery",
  "crownfire": "gunnery",
  "godsfinger": "gunnery",
  "hailstorm": "gunnery",
  "hornet-pod": "gunnery",
  "lanternhead": "gunnery",
  "quiverframe": "gunnery",
  "roadspike": "gunnery",
  "streetlash": "gunnery",

  // light-firearms/ -> Firearms
  "buzz-gun": "firearms",
  "chatter": "firearms",
  "ghost-pistol": "firearms",
  "hand-cannon": "firearms",
  "popper": "firearms",
  "sleeve-gun": "firearms",
  "slugger": "firearms",
  "streetsweeper-smg": "firearms",
  "workhorse": "firearms",
  "zapper": "firearms",

  // longarms/ -> Firearms
  "apex-rifle": "firearms",
  "autoshotgun": "firearms",
  "boomstick": "firearms",
  "brush-gun": "firearms",
  "chopper": "firearms",
  "longshot": "firearms",
  "milspec-battle-rifle": "firearms",
  "pipe-rifle": "firearms",
  "streetline-carbine": "firearms",
  "whisper-rifle": "firearms",

  // melee/ -> Melee, band regardless
  "chain-lash": "melee",
  "cyber-spur": "melee",
  "knuckles": "melee",
  "machete": "melee",
  "monoblade": "melee",
  "monowhip": "melee",
  "powered-greatsword": "melee",  // heavy band
  "scaffold-pike": "melee",
  "scrap-cleaver": "melee",
  "shock-stick": "melee",
  "slab-hammer": "melee",         // heavy band
  "street-blade": "melee",        // (light band, listed for symmetry)
  "warhammer": "melee",           // heavy band

  // thrown/ -> only the two placed charges are Demolitions. The grenades are a strong arm, not a
  // trade skill, and the lock names no skill for them: no bonus rather than a guessed one.
  "shaped-charge": "demolitions",
  "thermite-charge": "demolitions",
  "emp-grenade": null,
  "firestarter": null,
  "flash-bang-3e": null,
  "frag": null,
  "gasser": null,
  "smart-grenade": null,
  "smoke": null,
  "throwing-knife": null,
};

/** The skill a gun answers to once it is bolted to a chassis instead of carried. */
export const MOUNTED_SKILL = "gunnery";

const gwFlags = doc => doc?.flags?.[MODULE_ID] ?? null;

/**
 * Is this gun bolted to a §5F Weaponry kit right now (0.3.112, scripts/mounts.mjs)?
 *
 * The flag is read straight off the Item rather than imported from mounts.mjs: this file must stay
 * Foundry-free for tools/g4-skill-on-weapon-smoke.mjs, and mounts.mjs imports machines.mjs, which
 * would make an import cycle out of one flag name. tools/mount-weapons-smoke.mjs asserts the two agree.
 */
export function isMountedWeapon(gearItem) {
  return !!gwFlags(gearItem)?.mount?.mountedOn;
}

/**
 * Is this document a deployed machine Actor (scripts/machines.mjs stamps kind + band on deploy)?
 * A weapon carried by one is on a hardpoint, not in a hand.
 */
export function isMachineActor(actor) {
  const gw = gwFlags(actor);
  if (!gw?.band) return false;
  return (gw.kind === "vehicle") || (gw.kind === "drone");
}

/**
 * The skill key that backs one Ghostwire weapon treasure.
 *
 * Resolution order — a Director's explicit flag, then where the weapon actually sits (on a hardpoint,
 * or carried by a deployed machine), then the SKU table. `gear.weaponSkill` lets homebrew gear opt in
 * (or out, with `null`) without touching code.
 *
 * @param {Item|object} gearItem  A Ghostwire weapon treasure, Document or plain data.
 * @returns {string|null}         Ghostwire skill key, or null when no skill backs this weapon.
 */
export function weaponSkillKey(gearItem) {
  const gear = gwFlags(gearItem)?.gear;
  if (!gear) return null;
  if ("weaponSkill" in gear) return gear.weaponSkill || null;
  if (isMountedWeapon(gearItem)) return MOUNTED_SKILL;
  if (isMachineActor(gearItem.parent)) return MOUNTED_SKILL;
  return WEAPON_SKILLS[gearItem?.system?._dsid] ?? null;
}

/** Does this actor own that skill? Draw Steel keeps hero skills in a Set at system.skills.value. */
export function actorHasSkill(actor, skillKey) {
  if (!skillKey) return false;
  const skills = actor?.system?.skills?.value;
  if (!skills) return false;
  return typeof skills.has === "function" ? skills.has(skillKey) : Array.from(skills).includes(skillKey);
}

/**
 * The +2 a hero earns on this weapon's spawned attack ability, or 0.
 *
 * Reads the skill key cached on the ability at arm time (equipment-use.mjs) and falls back to the
 * source gear on the same sheet, so abilities armed before 0.3.102 need no migration pass.
 *
 * @param {Item} ability  A spawned weapon use-ability.
 * @param {Actor} actor   The hero rolling it.
 * @returns {{bonus: number, skill: string|null}}
 */
export function weaponSkillBonus(ability, actor) {
  const gw = gwFlags(ability);
  if (!gw?.fromGearId) return { bonus: 0, skill: null };

  let skill = gw.weaponSkill;
  if (skill === undefined) {
    const gearItem = actor?.items?.get?.(gw.fromGearId);
    skill = gearItem ? weaponSkillKey(gearItem) : null;
  }

  return actorHasSkill(actor, skill)
    ? { bonus: WEAPON_SKILL_BONUS, skill }
    : { bonus: 0, skill: skill ?? null };
}
