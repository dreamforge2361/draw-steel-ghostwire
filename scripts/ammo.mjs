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
// Everything above the "Foundry registration" divider is Foundry-free so
// tools/wave-03126-smoke.mjs can run it under Node.

import { isMountedWeapon, isMachineActor } from "./weapon-skills.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const L = "GHOSTWIRE.Ammo";

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
 * Firing one round.
 * @returns {{ok: boolean, reason: string|null, count: number}} `count` is what is left afterwards.
 */
export function planFire({ loadedCount = 0 } = {}) {
  const count = Math.max(0, Math.floor(Number(loadedCount) || 0));
  if (count <= 0) return { ok: false, reason: "empty", count: 0 };
  return { ok: true, reason: null, count: count - 1 };
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

/** Pick a gun and an ammo type. Returns null when the player backs out. */
async function promptReload(actor) {
  const guns = ammoWeaponsOf(actor);
  if (!guns.length) {
    ui.notifications.warn(loc("NoGun", { actor: actor.name }));
    return null;
  }
  const gunRows = guns.map(gun => {
    const family = ammoFamilyOf(gun);
    const state = loadedAmmo(gun);
    const label = loc("Reload.GunOption", {
      gun: gun.name,
      family: familyLabel(family),
      count: state.count,
      capacity: capacityForFamily(family),
      type: typeLabel(state.type),
    });
    return `<option value="${gun.id}">${esc(label)}</option>`;
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
  if (!data?.gun) return null;
  const gun = actor.items.get(data.gun);
  if (!gun) return null;
  return { gun, type: AMMO_TYPE_KEYS.includes(data.type) ? data.type : DEFAULT_AMMO_TYPE };
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

    const gun = gunForAbility(this.parent, actor);
    if (!gun) return use.call(this, config, dialogOptions, messageOptions);

    const state = loadedAmmo(gun);
    const plan = planFire({ loadedCount: state.count });
    if (!plan.ok) {
      ui.notifications.warn(loc("Empty", { gun: gun.name }));
      return null;
    }
    // Read the targets before the roll dialog runs: resolving a card can clear the user's targets.
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
  line.innerHTML = loc("Chat.Fired", {
    gun: esc(shot.gun), type: typeLabel(shot.type), remaining: shot.remaining, capacity: shot.capacity,
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

  Hooks.on("createActor", (actor, options, userId) => {
    if (userId !== game.user.id) return;
    syncActor(actor);
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
      planReload,
      gelRider,
      ammoStock,
      reloadWeapon: reload,
      syncReloadAbility: syncActor,
    };
  }
  console.log(`${MODULE_ID} | gun ammunition registered (${AMMO_FAMILIES.map(f => `${f} ${FAMILY_CAPACITY[f]}`).join(" · ")})`);
}
