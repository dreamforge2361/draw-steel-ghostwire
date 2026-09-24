// 0.3.126 (B) — guns spend rounds, and Reload tops the magazine in one maneuver.
//
// Michael's lock, in one sentence: **there are no magazine Items.** Loaded state is a property of
// the gun you are holding, ammunition is a stack of rounds in your pockets, and Reload moves rounds
// from the second into the first. Five families, five capacities:
//
//     Handgun 12 · SMG 30 · Longarm 20 · Shotgun 8 · Heavy 50
//
// Four decisions worth writing down, because each of them had a tempting wrong answer:
//
//  1. **Loaded state lives on the owned weapon.** `flags.<module>.ammo = { count, type }` on the
//     `treasure` the hero carries — not on the spawned Fire ability (which is rebuilt whenever the
//     gun is re-armed, and would lose the magazine every time), and not as a second Item (which is
//     the magazine-Item model the lock rules out in as many words).
//  2. **Family is a stamp, not a filename.** Every gun SKU carries `flags.<module>.gear.ammoFamily`;
//     `AMMO_FAMILY_BY_DSID` below is the same table compiled from the folder rule, kept as the
//     fallback for a sheet that predates the stamp. tools/wave-03126-smoke.mjs re-derives the table
//     from `src/packs/gear/weapons/` on every run, so the two cannot drift — the same contract
//     scripts/weapon-skills.mjs holds for the G4 skill map.
//  3. **A stack's `system.quantity` is rounds.** That is what makes "spend from the stack down to
//     what fits" and "leftover rounds of the old type go back to the stack" both literal. The three
//     ammunition SKUs therefore ship as a **box of 30** at their printed price rather than as one
//     abstract "magazine", and a Heavy needs two boxes to fill its 50.
//  4. **A mounted gun does not spend.** A Wallbreaker bolted to a section 5F Weaponry kit is fed by
//     the chassis, and 0.3.112's Mounted fire path must keep working untouched this pass.
//     `spendsAmmo()` is where that exemption lives, in one place, so turning it off later is one line.
//
// 0.3.128 (B) adds the half B never had: **class, subclass and kit abilities that fire the hero's own
// gun now spend rounds too.** Before this wave only a spawned Fire `<weapon>` ability debited the
// magazine, because only that ability carries `fromGearId`; Controlled Pair, Suppressing Fire and
// seventeen more emptied nothing. Three more decisions:
//
//  5. **An allowlist keyed on `_dsid`, not a keyword sweep.** `AMMO_ABILITY_COSTS` is the whole
//     policy, and `docs/directors/_ammo-ability-candidates.md` is where each row was argued. A
//     keyword sweep over `ranged` + `weapon` would have taxed Hex Round (a dart gun), every
//     meleeRanged blade in the Scout list and the Wrench's drone guns; the borderline column of that
//     note is deliberately **not** wired.
//  6. **The gun is resolved, not asked for.** A class ability has no `fromGearId`, so
//     `pickAmmoGunPlan` picks the fullest gun that can pay and names it on the card. A dialog per
//     shot is friction on a signature ability the Operator uses every round.
//  7. **Short refuses before the roll**, exactly where the empty refusal already lived. A Controlled
//     Pair with one round left is not a Controlled Pair, and printing a power roll first and taking
//     it back afterwards is worse than saying no.
//
// Everything above the "Foundry registration" divider is Foundry-free so
// tools/wave-03126-smoke.mjs and tools/wave-03128-smoke.mjs can run it under Node.

import { isMountedWeapon, isMachineActor } from "./weapon-skills.mjs";
import { isDeployedMachineActor } from "./machines.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const L = "GHOSTWIRE.Ammo";

const RIGGED_FIRE_DSID = "rigged-fire";

/** Loaded state on the gun: `{ count, type }`. Deliberately outside `gear`, which is the catalog row. */
export const AMMO_FLAG = "ammo";

/** The Reload ability this file grants, and the flag that marks it. */
export const RELOAD_DSID = "gw-reload";
export const RELOAD_FLAG = "reloadAbility";

/** Michael lock 2026-09-24. Rounds a full magazine holds, by weapon family. */
export const FAMILY_CAPACITY = Object.freeze({ handgun: 12, smg: 30, longarm: 20, shotgun: 8, heavy: 50 });
export const AMMO_FAMILIES = Object.freeze(Object.keys(FAMILY_CAPACITY));

/** Ammo type key -> the `_dsid` of the inventory stack it comes out of. */
export const AMMO_TYPES = Object.freeze({ standard: "standard-rounds", ap: "ap-rounds", gel: "gel-stick-n-shock" });
export const AMMO_TYPE_KEYS = Object.freeze(Object.keys(AMMO_TYPES));
export const DEFAULT_AMMO_TYPE = "standard";

/** How many rounds one purchased box holds. The SKUs' printed price is the box price. */
export const ROUNDS_PER_BOX = 30;

/** Stick-n-Shock's specialty effect on a hit: 1 Stamina and Dazed, instead of the gun's printed damage. */
export const GEL_STAMINA = 1;
export const GEL_CONDITION = "dazed";

/**
 * Gear `_dsid` -> ammo family, compiled from the folder rule (Michael lock 2026-09-24):
 *   light-firearms/ pistols -> handgun · light-firearms/ SMGs -> smg
 *   longarms/ rifles -> longarm · longarms/ shotguns -> shotgun · heavy/ -> heavy
 *
 * `chatter` is a handgun here because the lock names it in the Handgun row, even though its own
 * catalog blurb calls it a suppressed SMG — the enumerated list is the lock, the blurb is flavour.
 * A weapon absent from this table (bows, melee, thrown, mounted hardpoints) spends no ammunition.
 */
export const AMMO_FAMILY_BY_DSID = Object.freeze({
  // light-firearms/ — pistols
  "ghost-pistol": "handgun",
  "hand-cannon": "handgun",
  "popper": "handgun",
  "sleeve-gun": "handgun",
  "slugger": "handgun",
  "workhorse": "handgun",
  "zapper": "handgun",
  "chatter": "handgun",

  // light-firearms/ — SMGs
  "streetsweeper-smg": "smg",
  "buzz-gun": "smg",

  // longarms/ — rifles and carbines
  "apex-rifle": "longarm",
  "brush-gun": "longarm",
  "chopper": "longarm",
  "longshot": "longarm",
  "milspec-battle-rifle": "longarm",
  "pipe-rifle": "longarm",
  "streetline-carbine": "longarm",
  "whisper-rifle": "longarm",

  // longarms/ — shotguns
  "autoshotgun": "shotgun",
  "boomstick": "shotgun",

  // heavy/ — support guns and launchers
  "chatterbox": "heavy",
  "dragons-breath": "heavy",
  "grease-gun": "heavy",
  "hand-of-god": "heavy",
  "siege-missile": "heavy",
  "tank-cracker": "heavy",
  "wallbreaker": "heavy",
});

/**
 * 0.3.128 (B) — `_dsid` -> rounds spent, for abilities that fire the hero's **own** gun.
 *
 * Michael's locked four (Controlled Pair 2 · Suppressing Fire 5 · Breach and Clear 1 · normal Fire 1)
 * plus every row in the "Clear candidates" table of `docs/directors/_ammo-ability-candidates.md` at
 * its suggested cost. Nothing in that note's *Borderline* or *Explicitly excluded* columns is here,
 * and that is the lock rather than an oversight:
 *
 *   * **meleeRanged dual-mode** abilities (Ghost Out, Kill Confirm, You Talk Too Much) are absent —
 *     nothing in the use pipeline says whether the player rolled the blade or the barrel.
 *   * **Hex Round** is absent because the Hexshot kit's gear is a bow / crossbow / dartgun, none of
 *     which carry an `ammoFamily`; a round with no magazine behind it cannot be debited.
 *   * **Overwatch Lane** and **Vantage Trap** are absent because the stance fires nothing. The free
 *     ranged strike each one triggers is a spawned Fire `<gun>` and already costs 1 via `fromGearId`,
 *     so listing the stance too would tax the same shot twice.
 *   * **Drone, sentry and vehicle guns** are absent: `spendsAmmo()` already exempts a mounted weapon,
 *     and a Wrench's autogun is not the Wrench's magazine.
 *
 * `saturation-fire` is a flat 5 rather than a "dump the magazine" special, to match Suppressing Fire.
 */
export const AMMO_ABILITY_COSTS = Object.freeze({
  // Operator — signatures and heroics
  "controlled-pair": 2,
  "suppressing-fire": 5,
  "breach-and-clear": 1,
  "hold-the-line": 1,
  "overwatch": 1,
  "adrenaline-dump": 3,
  "saturation-fire": 5,                            // Street Vet origin

  // Scout — class and Hunter origin
  "pinning-shot": 1,
  "night-watch-strike": 1,
  "they-always-line-up": 1,
  "called-shot-vitals": 1,
  "called-shot-commlink": 1,
  "ghost-round": 1,
  "one-shot-one-kill": 1,

  // Kit signature abilities
  "double-tap": 2,                                 // Saturation
  "kneecap-shot": 1,                               // Streetsweeper
  "held-breath": 1,                                // Longshot
  "bench-rigged-shot": 1,                          // Fabricator's Bench
  "neural-snap-shot": 1,                           // Rigger's Harness
  "tablet-crossfire": 1,                           // Field Chassis
});

/** Every `_dsid` the ability allowlist covers. */
export const AMMO_ABILITY_DSIDS = Object.freeze(Object.keys(AMMO_ABILITY_COSTS));

const gwFlags = doc => doc?.flags?.[MODULE_ID] ?? doc?.flags?.["draw-steel-ghostwire"] ?? {};

/* -------------------------------------------- reading */

/** Rounds a full magazine of this family holds; 0 when the family is not one of the five. */
export function capacityForFamily(family) {
  return FAMILY_CAPACITY[String(family ?? "")] ?? 0;
}

/**
 * The ammo family of one gun: the SKU's own stamp first, the compiled table second.
 * @returns {string|null} One of AMMO_FAMILIES, or null when this weapon eats no ammunition.
 */
export function ammoFamilyOf(gearItem) {
  const gear = gwFlags(gearItem).gear;
  if (!gear) return null;
  if ("ammoFamily" in gear) {
    const stamped = String(gear.ammoFamily ?? "");
    return AMMO_FAMILIES.includes(stamped) ? stamped : null;
  }
  return AMMO_FAMILY_BY_DSID[gearItem?.system?._dsid] ?? null;
}

/** Is this a Ghostwire gun that spends rounds? */
export function isAmmoWeapon(item) {
  if (item?.type !== "treasure" || item?.system?.kind !== "weapon") return false;
  return !!ammoFamilyOf(item);
}

/** The ammo type a stack in inventory holds, or null when the item is not ammunition. */
export function ammoTypeOfStack(item) {
  const stamped = gwFlags(item).gear?.ammo?.type;
  if (stamped && AMMO_TYPE_KEYS.includes(String(stamped))) return String(stamped);
  const dsid = item?.system?._dsid;
  return AMMO_TYPE_KEYS.find(key => AMMO_TYPES[key] === dsid) ?? null;
}

/**
 * What is in the gun right now.
 *
 * An unstamped gun reads as **empty**, not as full: a magazine that fills itself the first time
 * anybody looks would make the empty refusal unreachable, and Reload is one maneuver away.
 * @returns {{count: number, type: string}}
 */
export function loadedAmmo(gearItem) {
  const raw = (typeof gearItem?.getFlag === "function")
    ? gearItem.getFlag(MODULE_ID, AMMO_FLAG)
    : gwFlags(gearItem)[AMMO_FLAG];
  const count = Math.max(0, Math.floor(Number(raw?.count) || 0));
  const type = AMMO_TYPE_KEYS.includes(String(raw?.type)) ? String(raw.type) : DEFAULT_AMMO_TYPE;
  return { count, type };
}

/* -------------------------------------------- planning */

/**
 * 0.3.128 (B) — firing `count` rounds in one trigger pull.
 *
 * **A short magazine refuses; it does not fire what it has.** Controlled Pair with one round left is
 * not a Controlled Pair, and a partial spend would leave the card claiming an effect the fiction did
 * not pay for. `reason` distinguishes the two refusals so the toast can say which one happened:
 * `empty` (nothing in the gun at all) and `short` (something, but not enough).
 *
 * @param {object} opts
 * @param {number} opts.loadedCount  What is in the magazine now.
 * @param {number} opts.count        Rounds this trigger pull wants.
 * @returns {{ok: boolean, reason: "empty"|"short"|null, count: number, spent: number, needed: number}}
 *          `count` is what is left afterwards; `spent` is 0 on a refusal.
 */
export function planFireN({ loadedCount = 0, count = 1 } = {}) {
  const have = Math.max(0, Math.floor(Number(loadedCount) || 0));
  const needed = Math.max(1, Math.floor(Number(count) || 1));
  if (have < needed) return { ok: false, reason: have ? "short" : "empty", count: have, spent: 0, needed };
  return { ok: true, reason: null, count: have - needed, spent: needed, needed };
}

/**
 * Firing one round — the 0.3.126 shape, kept because the Fire path and its smoke both read it.
 * @returns {{ok: boolean, reason: string|null, count: number}} `count` is what is left afterwards.
 */
export function planFire({ loadedCount = 0 } = {}) {
  const { ok, reason, count } = planFireN({ loadedCount, count: 1 });
  return { ok, reason, count };
}

/** Rounds this ability `_dsid` spends out of the hero's magazine; 0 for everything not on the list. */
export function ammoCostForDsid(dsid) {
  return AMMO_ABILITY_COSTS[String(dsid ?? "")] ?? 0;
}

/**
 * Which gun a class or kit ability fires, when the ability itself does not say.
 *
 * A spawned Fire `<weapon>` ability carries `fromGearId` and needs none of this. Controlled Pair
 * does not: it is an Operator's ability, not a gun's, so something has to choose. **The fullest gun
 * that can pay**, ties broken by name so two identical Workhorses resolve the same way every time —
 * a player who wants the other one reloads it, and the card always names the gun that fired.
 *
 * On a refusal the pick still comes back (the fullest gun overall) so the toast can say *which* gun
 * is short and by how much.
 *
 * @param {object} opts
 * @param {Array<{id: string, name?: string, loaded?: number}>} opts.guns
 * @param {number} opts.cost
 * @returns {{gunId: string|null, name: string|null, loaded: number, cost: number,
 *            reason: "noGun"|"empty"|"short"|null}}
 */
export function pickAmmoGunPlan({ guns = [], cost = 1 } = {}) {
  const needed = Math.max(1, Math.floor(Number(cost) || 1));
  const rows = (guns ?? [])
    .filter(gun => gun?.id)
    .map(gun => ({
      id: String(gun.id),
      name: String(gun.name ?? ""),
      loaded: Math.max(0, Math.floor(Number(gun.loaded) || 0)),
    }))
    .sort((a, b) => (b.loaded - a.loaded) || a.name.localeCompare(b.name) || a.id.localeCompare(b.id));
  if (!rows.length) return { gunId: null, name: null, loaded: 0, cost: needed, reason: "noGun" };
  const able = rows.find(row => row.loaded >= needed);
  const pick = able ?? rows[0];
  return {
    gunId: pick.id,
    name: pick.name,
    loaded: pick.loaded,
    cost: needed,
    reason: able ? null : (pick.loaded ? "short" : "empty"),
  };
}

/**
 * Reloading. **Tops to capacity in one action** — this is not a round-at-a-time pump.
 *
 * Switching type returns whatever is still in the gun to inventory as the *old* type, which is why
 * `returnedCount` is reported separately from `taken`. A switch with nothing to switch to is
 * refused rather than silently unloading the gun and leaving it empty: a player who cannot fill it
 * would rather keep the rounds they already have.
 *
 * @returns {{ok: boolean, reason: string|null, capacity: number, count: number, type: string,
 *            taken: number, returnedType: string|null, returnedCount: number, stockAfter: number}}
 */
export function planReload({ family = null, capacity = null, loadedCount = 0, loadedType = DEFAULT_AMMO_TYPE,
  ammoType = DEFAULT_AMMO_TYPE, stock = 0 } = {}) {
  const cap = (capacity === null || capacity === undefined)
    ? capacityForFamily(family)
    : Math.max(0, Math.floor(Number(capacity) || 0));
  const wanted = AMMO_TYPE_KEYS.includes(String(ammoType)) ? String(ammoType) : DEFAULT_AMMO_TYPE;
  const held = AMMO_TYPE_KEYS.includes(String(loadedType)) ? String(loadedType) : DEFAULT_AMMO_TYPE;
  const loaded = Math.max(0, Math.floor(Number(loadedCount) || 0));
  const have = Math.max(0, Math.floor(Number(stock) || 0));
  const refused = {
    ok: false, capacity: cap, count: loaded, type: held,
    taken: 0, returnedType: null, returnedCount: 0, stockAfter: have,
  };
  if (cap <= 0) return { ...refused, reason: "unknownFamily" };

  const switching = wanted !== held;
  const base = switching ? 0 : Math.min(loaded, cap);
  const room = cap - base;
  const taken = Math.min(room, have);
  if (taken <= 0) return { ...refused, reason: room <= 0 ? "full" : "noStock" };

  return {
    ok: true,
    reason: null,
    capacity: cap,
    count: base + taken,
    type: wanted,
    taken,
    returnedType: (switching && loaded) ? held : null,
    returnedCount: (switching && loaded) ? loaded : 0,
    stockAfter: have - taken,
  };
}

/**
 * The Stick-n-Shock rider, or null for anything else in the magazine.
 *
 * Gel is less-lethal takedown ammo, so on a hit it **replaces** the gun's printed damage with
 * 1 Stamina and Dazed rather than adding to it — a rifle that still cracks ribs for 8 and *then*
 * stuns is not a non-lethal round. The chat card says so out loud, because Draw Steel's own
 * Apply Damage button is still sitting on the attack card next to it.
 */
export function gelRider({ loadedType = DEFAULT_AMMO_TYPE } = {}) {
  if (String(loadedType) !== "gel") return null;
  return { stamina: GEL_STAMINA, condition: GEL_CONDITION, replacesDamage: true };
}

/**
 * Does this gun, on this sheet, spend rounds at all?
 *
 * A gun on a section 5F hardpoint (or carried by a deployed machine Actor) is fed by the chassis:
 * 0.3.112's Mounted fire path is untouched by this pass, per the lock.
 */
export function spendsAmmo(gearItem) {
  if (!isAmmoWeapon(gearItem)) return false;
  if (isMountedWeapon(gearItem)) return false;
  if (isMachineActor(gearItem?.parent)) return false;
  return true;
}

/* -------------------------------------------- platform helpers (Rigged Fire / Reload) */

/**
 * 0.3.130 (C) — every deployed machine Actor this hero owns.
 *
 * A "connected drone" or "vehicle with turret" is a deployed machine Actor whose
 * `ownerUuid` resolves to the hero. The machine carries its own guns as Items, and
 * Rigged Fire debits those guns — not the hero's belt.
 */
export function deployedPlatformsOf(hero) {
  if (!hero?.uuid) return [];
  const platforms = [];
  for (const actor of game.actors ?? []) {
    if (!isDeployedMachineActor(actor)) continue;
    if (actor.getFlag?.(MODULE_ID, "ownerUuid") !== hero.uuid) continue;
    platforms.push(actor);
  }
  return platforms;
}

/** Ammo-bearing guns on a platform (drone or vehicle). */
export function platformGunsOf(platform) {
  return [...(platform?.items ?? [])].filter(item => isAmmoWeapon(item));
}

/** Is this actor a vehicle (not a drone)? */
function isVehicle(actor) {
  return actor?.getFlag?.(MODULE_ID, "kind") === "vehicle";
}

/** Does this vehicle have a turret? Check its weaponry mods for turret-ring. */
function vehicleHasTurret(actor) {
  if (!isVehicle(actor)) return false;
  for (const item of actor?.items ?? []) {
    const mod = item.getFlag?.(MODULE_ID, "machineMod");
    if (!mod) continue;
    if (mod.profile?.turret || mod.turret) return true;
  }
  return platformGunsOf(actor).length > 0;
}

/**
 * 0.3.130 (C) — pick a fire platform for Rigged Fire.
 *
 * Returns the first connected drone with a gun, or a vehicle with turret/gun, or null.
 * When multiple platforms have guns, the one with the fullest magazine wins.
 */
export function pickFirePlatform(hero) {
  const platforms = deployedPlatformsOf(hero);
  let best = null;
  let bestLoaded = -1;
  for (const platform of platforms) {
    const kind = platform.getFlag?.(MODULE_ID, "kind");
    const isDrone = kind === "drone";
    const isVeh = kind === "vehicle";
    if (!isDrone && !isVeh) continue;
    if (isVeh && !vehicleHasTurret(platform)) continue;
    const guns = platformGunsOf(platform);
    if (!guns.length) continue;
    const maxLoaded = Math.max(...guns.map(g => loadedAmmo(g).count));
    if (maxLoaded > bestLoaded) {
      bestLoaded = maxLoaded;
      best = platform;
    }
  }
  return best;
}

/* ============================================ Foundry registration */

const loc = (key, data) => (data ? game.i18n.format(`${L}.${key}`, data) : game.i18n.localize(`${L}.${key}`));
const typeLabel = type => loc(`Types.${AMMO_TYPE_KEYS.includes(type) ? type : DEFAULT_AMMO_TYPE}`);
const familyLabel = family => loc(`Families.${family}`);
const isHero = actor => actor?.type === "hero";
const esc = text => foundry.utils.escapeHTML(String(text ?? ""));

/** The guns on this sheet that spend rounds. */
export const ammoWeaponsOf = actor => (actor?.items?.filter?.(item => spendsAmmo(item)) ?? []);

/** Ammunition stacks of one type on this sheet, most-stocked first. */
function ammoStacks(actor, type) {
  return (actor?.items ?? [])
    .filter(item => ammoTypeOfStack(item) === type)
    .sort((a, b) => Number(b.system?.quantity ?? 0) - Number(a.system?.quantity ?? 0));
}

/** Total rounds of one type this actor is carrying. */
export function ammoStock(actor, type) {
  return ammoStacks(actor, type)
    .reduce((sum, item) => sum + Math.max(0, Math.floor(Number(item.system?.quantity) || 0)), 0);
}

/** Take `count` rounds off this actor's stacks of `type`, smallest first so the sheet tidies itself. */
async function spendStock(actor, type, count) {
  let left = Math.max(0, Math.floor(Number(count) || 0));
  const updates = [];
  for (const stack of ammoStacks(actor, type).reverse()) {
    if (left <= 0) break;
    const have = Math.max(0, Math.floor(Number(stack.system?.quantity) || 0));
    const take = Math.min(have, left);
    left -= take;
    updates.push({ _id: stack.id, "system.quantity": have - take });
  }
  if (updates.length) await actor.updateEmbeddedDocuments("Item", updates);
  return left;
}

/**
 * Put `count` rounds of `type` back. Increments the biggest existing stack rather than littering the
 * sheet with a second row; with no stack at all the rounds arrive as a fresh copy of the pack SKU.
 */
async function returnStock(actor, type, count) {
  const rounds = Math.max(0, Math.floor(Number(count) || 0));
  if (!rounds) return;
  const [stack] = ammoStacks(actor, type);
  if (stack) {
    const have = Math.max(0, Math.floor(Number(stack.system?.quantity) || 0));
    await stack.update({ "system.quantity": have + rounds });
    return;
  }
  const pack = game.packs.get(`${MODULE_ID}.gear`);
  const index = pack ? await pack.getIndex({ fields: ["system._dsid"] }).catch(() => null) : null;
  const row = index?.find(entry => entry.system?._dsid === AMMO_TYPES[type]);
  const source = row ? await pack.getDocument(row._id).catch(() => null) : null;
  if (!source) {
    ui.notifications.warn(loc("NoStackToReturn", { type: typeLabel(type), count: rounds }));
    return;
  }
  const data = source.toObject();
  delete data._id;
  data.folder = null;
  data.system.quantity = rounds;
  await actor.createEmbeddedDocuments("Item", [data]);
}

/* -------------------------------------------- the Reload ability */

export function buildReloadAbility() {
  return {
    name: loc("Reload.Name"),
    type: "ability",
    img: "icons/weapons/ammunition/bullets-cartridge-shell-gray.webp",
    system: {
      description: { value: loc("Reload.Description"), director: "" },
      source: { book: "Ghostwire", page: "08-kits-gear-wealth", license: "Draw Steel Creator License" },
      _dsid: RELOAD_DSID,
      keywords: [],
      type: "maneuver",
      category: "",
      resource: null,
      trigger: "",
      distance: { type: "self", primary: "1", secondary: "1", tertiary: "1" },
      target: { type: "self", value: null, custom: "" },
      power: { roll: { formula: "@chr", characteristics: [], reactive: false }, effects: {} },
      effects: {
        reloadBefore0000: {
          _id: "reloadBefore0000", type: "base", description: loc("Reload.Effect"),
          before: true, name: "", img: null, sort: 0,
        },
      },
    },
    flags: { [MODULE_ID]: { [RELOAD_FLAG]: true } },
  };
}

const reloadAbilityOf = actor => (actor?.items ?? []).find(item => item.getFlag?.(MODULE_ID, RELOAD_FLAG));

/**
 * One shared Reload per sheet, present exactly while a gun that eats rounds is.
 * @returns {Promise<{added: number, removed: number}>}
 */
export async function syncActor(actor) {
  if (!isHero(actor) || !actor.isOwner) return { added: 0, removed: 0 };
  const existing = reloadAbilityOf(actor);
  const wanted = ammoWeaponsOf(actor).length > 0;
  if (wanted && !existing) {
    await actor.createEmbeddedDocuments("Item", [buildReloadAbility()]);
    return { added: 1, removed: 0 };
  }
  if (!wanted && existing) {
    await actor.deleteEmbeddedDocuments("Item", [existing.id]);
    return { added: 0, removed: 1 };
  }
  return { added: 0, removed: 0 };
}

/**
 * Pick a gun and an ammo type. Returns null when the player backs out.
 *
 * 0.3.130 (C2): the chooser now also lists drone guns and vehicle turret guns so the hero can
 * reload any platform they have access to. Inventory rounds always come from the hero's belt.
 */
async function promptReload(actor) {
  // Hero's own guns
  const heroGuns = ammoWeaponsOf(actor).map(gun => ({ gun, owner: actor, label: gun.name }));

  // 0.3.130 (C2): platform guns (drones + vehicles with turrets)
  const platformGuns = [];
  if (isHero(actor)) {
    for (const platform of deployedPlatformsOf(actor)) {
      for (const gun of platformGunsOf(platform)) {
        platformGuns.push({ gun, owner: platform, label: `${platform.name} — ${gun.name}` });
      }
    }
  }

  const allGuns = [...heroGuns, ...platformGuns];
  if (!allGuns.length) {
    ui.notifications.warn(loc("NoGun", { actor: actor.name }));
    return null;
  }

  const gunRows = allGuns.map((entry, idx) => {
    const family = ammoFamilyOf(entry.gun);
    const state = loadedAmmo(entry.gun);
    const label = loc("Reload.GunOption", {
      gun: entry.label,
      family: familyLabel(family),
      count: state.count,
      capacity: capacityForFamily(family),
      type: typeLabel(state.type),
    });
    return `<option value="${idx}">${esc(label)}</option>`;
  }).join("");
  const typeRows = AMMO_TYPE_KEYS.map(key => {
    const label = loc("Reload.TypeOption", { type: typeLabel(key), stock: ammoStock(actor, key) });
    return `<option value="${key}">${esc(label)}</option>`;
  }).join("");
  const data = await foundry.applications.api.DialogV2.input({
    window: { title: loc("Reload.Title"), icon: "fa-solid fa-rotate" },
    content: `<p>${loc("Reload.Hint")}</p>`
      + `<div class="form-group"><label>${loc("Reload.Gun")}</label><select name="gun">${gunRows}</select></div>`
      + `<div class="form-group"><label>${loc("Reload.Type")}</label><select name="type">${typeRows}</select></div>`,
    ok: { label: `${L}.Reload.Confirm`, icon: "fa-solid fa-rotate" },
  });
  if (data?.gun === undefined || data?.gun === null) return null;
  const entry = allGuns[Number(data.gun)];
  if (!entry) return null;
  return { gun: entry.gun, type: AMMO_TYPE_KEYS.includes(data.type) ? data.type : DEFAULT_AMMO_TYPE, owner: entry.owner };
}

/** Do the reload the dialog described. */
export async function reload(actor, gun, ammoType) {
  const family = ammoFamilyOf(gun);
  const state = loadedAmmo(gun);
  const plan = planReload({
    family,
    loadedCount: state.count,
    loadedType: state.type,
    ammoType,
    stock: ammoStock(actor, ammoType),
  });
  if (!plan.ok) {
    ui.notifications.warn(loc(plan.reason === "full" ? "Reload.AlreadyFull" : "Reload.NoStock",
      { gun: gun.name, type: typeLabel(ammoType) }));
    return plan;
  }
  await spendStock(actor, ammoType, plan.taken);
  if (plan.returnedCount) await returnStock(actor, plan.returnedType, plan.returnedCount);
  await gun.setFlag(MODULE_ID, AMMO_FLAG, { count: plan.count, type: plan.type });
  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content: `<p>${loc("Chat.Reloaded", {
      actor: esc(actor.name), gun: esc(gun.name), count: plan.count,
      capacity: plan.capacity, type: typeLabel(plan.type), taken: plan.taken,
    })}</p>`
      + (plan.returnedCount
        ? `<p><em>${loc("Chat.Returned", { count: plan.returnedCount, type: typeLabel(plan.returnedType) })}</em></p>`
        : ""),
    flags: { [MODULE_ID]: { ammoCard: true } },
  });
  return plan;
}

/* -------------------------------------------- firing */

/** The gun a spawned Fire ability came from, when it came from one that eats rounds. */
function gunForAbility(ability, actor) {
  const gearId = ability?.getFlag?.(MODULE_ID, "fromGearId");
  if (!gearId) return null;
  const gun = actor?.items?.get(gearId);
  return (gun && spendsAmmo(gun)) ? gun : null;
}

/**
 * 0.3.128 (B) — the ability allowlist half: what this ability costs, and which gun pays for it.
 *
 * Returns null for everything that is not on `AMMO_ABILITY_COSTS` (which is nearly everything), so
 * the caller's fast path is one object lookup. A spawned Fire ability never reaches here — it has
 * `fromGearId` and is handled a few lines earlier — which is what keeps a free triggered Fire from
 * being taxed twice.
 *
 * @returns {{cost: number, gun: Item|null, pick: object}|null}
 */
function abilityAmmoSpend(ability, actor) {
  const cost = ammoCostForDsid(ability?.system?._dsid);
  if (!cost) return null;
  if (!isHero(actor)) return null;                 // an NPC stat block is not spending a hero magazine
  const guns = ammoWeaponsOf(actor);
  const pick = pickAmmoGunPlan({
    guns: guns.map(gun => ({ id: gun.id, name: gun.name, loaded: loadedAmmo(gun).count })),
    cost,
  });
  return { cost, gun: pick.gunId ? (actor.items.get(pick.gunId) ?? null) : null, pick };
}

/** Apply the Gel rider to everyone this shot was aimed at. */
async function applyGelRider(targets) {
  for (const target of targets) {
    if (!target?.system?.takeDamage) continue;
    await target.system.takeDamage(GEL_STAMINA, { type: "" });
    if (!target.statuses?.has?.(GEL_CONDITION)) await target.toggleStatusEffect(GEL_CONDITION, { active: true });
  }
}

/**
 * B2 / B3 / B6 / B7 — one shot: refuse when empty, debit a round, put the type on the card, run the
 * Gel rider.
 *
 * Wrapping `AbilityModel#use` is the same seam scripts/consumable-use.mjs and scripts/reagents.mjs
 * already patch, and for the same reason: the refusal has to land *before* Draw Steel prints a roll
 * that was never going to fire.
 */
function patchFireUse() {
  const AbilityModel = CONFIG.Item.dataModels?.ability ?? ds.data?.Item?.AbilityModel;
  if (!AbilityModel?.prototype.use) {
    console.warn(`${MODULE_ID} | AbilityModel#use not found; guns will not spend ammunition`);
    return;
  }
  const use = AbilityModel.prototype.use;
  AbilityModel.prototype.use = async function(config = {}, dialogOptions = {}, messageOptions = {}) {
    const actor = this.actor;

    // Reload is not a power roll, so it never reaches Draw Steel's pipeline at all.
    if (this.parent?.getFlag?.(MODULE_ID, RELOAD_FLAG)) {
      const picked = await promptReload(actor);
      if (!picked) return null;
      await reload(actor, picked.gun, picked.type);
      return null;
    }

    // 0.3.130 (C) — Rigged Fire: platform gate + platform ammo.
    // Require a connected drone or vehicle with turret. Debit the platform's gun, not the hero's.
    const dsid = this.parent?.system?._dsid;
    if (dsid === RIGGED_FIRE_DSID && isHero(actor)) {
      const platform = pickFirePlatform(actor);
      if (!platform) {
        ui.notifications.warn(loc("RiggedFire.NoPlatform", { actor: actor?.name ?? "" }));
        return null;
      }
      const platformGuns = platformGunsOf(platform);
      const pick = pickAmmoGunPlan({
        guns: platformGuns.map(g => ({ id: g.id, name: g.name, loaded: loadedAmmo(g).count })),
        cost: 1,
      });
      const gun = pick.gunId ? platform.items.get(pick.gunId) : null;
      if (!gun || pick.reason) {
        ui.notifications.warn(pick.reason === "noGun"
          ? loc("RiggedFire.NoPlatformGun", { platform: platform.name })
          : loc("RiggedFire.PlatformEmpty", { platform: platform.name, gun: gun?.name ?? "" }));
        return null;
      }
      const state = loadedAmmo(gun);
      const plan = planFireN({ loadedCount: state.count, count: 1 });
      if (!plan.ok) {
        ui.notifications.warn(loc("RiggedFire.PlatformEmpty", { platform: platform.name, gun: gun.name }));
        return null;
      }
      const targets = [...(game.user?.targets ?? [])].map(token => token.actor).filter(Boolean);
      const message = await use.call(this, config, dialogOptions, messageOptions);
      if (!message) return message;
      await gun.setFlag(MODULE_ID, AMMO_FLAG, { count: plan.count, type: state.type });
      const rider = gelRider({ loadedType: state.type });
      await message.setFlag?.(MODULE_ID, "ammoShot", {
        type: state.type, remaining: plan.count,
        capacity: capacityForFamily(ammoFamilyOf(gun)),
        gun: `${platform.name} — ${gun.name}`, spent: plan.spent, gel: !!rider,
      });
      if (rider && targets.length) await applyGelRider(targets);
      return message;
    }

    // A spawned Fire `<gun>` ability names its own gun and always costs exactly 1.
    // A class / kit / origin ability on the 0.3.128 allowlist costs what the table says, and the gun
    // has to be resolved. Everything else is none of this file's business.
    const fireGun = gunForAbility(this.parent, actor);
    const spend = fireGun
      ? { cost: 1, gun: fireGun, pick: null }
      : abilityAmmoSpend(this.parent, actor);
    if (!spend) return use.call(this, config, dialogOptions, messageOptions);

    const gun = spend.gun;
    if (!gun) {
      ui.notifications.warn(loc("Ability.NoGun", { ability: this.parent?.name ?? "", actor: actor?.name ?? "" }));
      return null;
    }

    const state = loadedAmmo(gun);
    const plan = planFireN({ loadedCount: state.count, count: spend.cost });
    if (!plan.ok) {
      ui.notifications.warn(plan.reason === "empty"
        ? loc("Empty", { gun: gun.name })
        : loc("Short", { gun: gun.name, needed: plan.needed, loaded: plan.count }));
      return null;
    }
    const targets = [...(game.user?.targets ?? [])].map(token => token.actor).filter(Boolean);
    const message = await use.call(this, config, dialogOptions, messageOptions);
    if (!message) return message;

    await gun.setFlag(MODULE_ID, AMMO_FLAG, { count: plan.count, type: state.type });
    const rider = gelRider({ loadedType: state.type });
    await message.setFlag?.(MODULE_ID, "ammoShot", {
      type: state.type,
      remaining: plan.count,
      capacity: capacityForFamily(ammoFamilyOf(gun)),
      gun: gun.name,
      spent: plan.spent,
      gel: !!rider,
    });
    if (rider && targets.length) await applyGelRider(targets);
    return message;
  };
}

/** B6 — the line on the attack card that says which rounds went downrange. */
function injectAmmoLine(message, html) {
  const shot = message.getFlag?.(MODULE_ID, "ammoShot");
  if (!shot || html.querySelector(".ghostwire-ammo-line")) return;
  const host = html.querySelector(".message-content") ?? html;
  const line = document.createElement("p");
  line.className = "ghostwire-ammo-line";
  const spent = Math.max(1, Math.floor(Number(shot.spent) || 1));
  line.innerHTML = loc(spent > 1 ? "Chat.FiredN" : "Chat.Fired", {
    gun: esc(shot.gun), type: typeLabel(shot.type), remaining: shot.remaining, capacity: shot.capacity,
    spent,
  }) + (shot.gel ? ` <em>${loc("Chat.GelRider", { stamina: GEL_STAMINA })}</em>` : "");
  host.append(line);
}

/* -------------------------------------------- registration */

export function registerAmmo() {
  patchFireUse();

  Hooks.once("ready", async () => {
    let added = 0;
    let removed = 0;
    for (const actor of game.actors) {
      if (!actor.isOwner) continue;
      const result = await syncActor(actor);
      added += result.added;
      removed += result.removed;
    }
    if (added || removed) console.log(`${MODULE_ID} | Reload abilities: +${added} / -${removed}`);
  });

  Hooks.on("createItem", (item, options, userId) => {
    if (userId !== game.user.id) return;
    if (isAmmoWeapon(item) && (item.parent instanceof Actor)) syncActor(item.parent);
  });

  Hooks.on("deleteItem", (item, options, userId) => {
    if (userId !== game.user.id) return;
    if (item?.type === "treasure" && (item.parent instanceof Actor)) syncActor(item.parent);
  });

  Hooks.on("createActor", async (actor, options, userId) => {
    if (userId !== game.user.id) return;
    syncActor(actor);
    // 0.3.130 (C): deployed drones/vehicles ship with full Standard Rounds in every gun.
    if (isDeployedMachineActor(actor)) {
      for (const gun of platformGunsOf(actor)) {
        const state = loadedAmmo(gun);
        if (state.count > 0) continue;
        const family = ammoFamilyOf(gun);
        const cap = capacityForFamily(family);
        if (cap > 0) await gun.setFlag(MODULE_ID, AMMO_FLAG, { count: cap, type: DEFAULT_AMMO_TYPE });
      }
    }
  });

  Hooks.on("renderChatMessageHTML", (message, html) => injectAmmoLine(message, html));

  const module = game.modules.get(MODULE_ID);
  if (module) {
    module.api = {
      ...(module.api ?? {}),
      ammoFamilyOf,
      capacityForFamily,
      loadedAmmo,
      planFire,
      planFireN,
      planReload,
      ammoCostForDsid,
      pickAmmoGunPlan,
      ammoAbilityCosts: () => AMMO_ABILITY_COSTS,
      gelRider,
      ammoStock,
      reloadWeapon: reload,
      syncReloadAbility: syncActor,
      deployedPlatformsOf,
      platformGunsOf,
      pickFirePlatform,
    };
  }
  console.log(`${MODULE_ID} | gun ammunition registered (${AMMO_FAMILIES.map(f => `${f} ${FAMILY_CAPACITY[f]}`).join(" · ")}`
    + ` · ${AMMO_ABILITY_DSIDS.length} ability spends)`);
}
