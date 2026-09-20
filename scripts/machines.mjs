// Drones & vehicles: dual Item + Actor (docs/masters/GHOSTWIRE_SUPPORT_ENTITIES.md, GHOSTWIRE_MACHINE_BANDS.md).
// Treasure Items in Ghostwire Vehicles & Drones are INTENTIONAL: ownership, ¥, mods, echelon.
// Deploy stamps a scale-band Actor template from Ghostwire Summons & Machines › Drones & Vehicles
// into a linked world Actor and places its token next to the owner;
// Recall deletes the token and Actor, and the Item stays. The link lives in flags on both sides:
// - Actor: flags.<module> = { kind, band, ownerUuid, gearItemUuid, dsid, gearDsid }
// - Item:  flags.<module>.deployed = { actorUuid }

import { addWireKit } from "./wired-kit.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const PACK_ID = `${MODULE_ID}.summons`;
const UI = "GHOSTWIRE.Summons.Machines.UI";

// Band templates (must match gen-machines.mjs): base Stamina and speed before the Item stamps them.
const BANDS = {
  "drone-micro": { stamina: 5, speed: 6 },
  "drone-small": { stamina: 12, speed: 6 },
  "drone-medium": { stamina: 24, speed: 7 },
  "vehicle-bike": { stamina: 20, speed: 10 },
  "vehicle-car": { stamina: 40, speed: 10 },
  "vehicle-heavy": { stamina: 80, speed: 8 },
  "vehicle-air": { stamina: 40, speed: 12 },
  "vehicle-water": { stamina: 40, speed: 8 },
  "vehicle-space": { stamina: 80, speed: 12 },
};

// Provisional stamping until the Machines numeric pass: Stamina × echelon multiplier, vehicle speed by chapter Speed band.
// Vehicle Items carry flags.vehicle.speedBand (B36b); the table below is the fallback for Items that predate it.
const ECHELON_MULTIPLIER = { 1: 1, 2: 1.5, 3: 2, 4: 2.5 };
const SPEED_BAND_BONUS = { slow: -2, standard: 0, fast: 2, extreme: 4 };
const VEHICLE_SPEED_BANDS = {
  "crotch-rocket": "fast", "warbike": "fast", "star-chopper": "fast", "getaway": "standard", "lane-hopper": "standard", "hardtop": "standard", "rustbucket": "standard", "workhorse": "slow", "bulldog": "slow",
  "brick": "standard", "iron-giant": "standard", "buzzcopter": "fast", "hoverpad": "fast", "tiltjet": "fast", "skyhunter": "fast",
  "ghost-wing": "fast", "skiff": "standard", "cigarette": "fast", "wetsub": "slow", "leviathan": "standard", "pod": "extreme",
  "mule": "extreme", "reaver": "extreme",
};

/** The scale band for a vehicles-pack Item, from its domain / scale / drone flags; null if it isn't a drone or vehicle. */
export function machineBand(item) {
  const vehicle = item?.getFlag(MODULE_ID, "vehicle");
  if (!vehicle) return null;
  const domain = String(vehicle.domain ?? "").toLowerCase();
  const scale = String(vehicle.scale ?? "").toLowerCase();
  if (vehicle.drone) {
    if (scale.startsWith("personal")) return "drone-micro";
    if (scale.startsWith("vehicle")) return "drone-medium";
    return "drone-small";
  }
  if (domain.startsWith("air")) return "vehicle-air";
  if (domain.startsWith("water")) return "vehicle-water";
  if (domain.startsWith("space")) return "vehicle-space";
  if (scale.startsWith("light")) return "vehicle-bike";
  if (scale.startsWith("heavy") || scale.includes("heavy")) return "vehicle-heavy";
  return "vehicle-car";
}

const bandKey = band => band.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join("");

/** Chassis Integrity before an armor kit: band Stamina × echelon multiplier. */
export function chassisStamina(item) {
  const band = machineBand(item);
  const vehicle = item?.getFlag(MODULE_ID, "vehicle");
  if (!band || !vehicle) return 0;
  return Math.round(BANDS[band].stamina * (ECHELON_MULTIPLIER[vehicle.echelon] ?? 1));
}

/**
 * Catalog of vehicle/drone mod effects Foundry stamps onto a deployed machine Actor.
 * `applied: "stamina"` uses the same AE path as hero armor (`system.stamina.bonuses.treasure`).
 * `applied: "flags"` writes kit flags the Gunnery / sheet path can read.
 * `applied: "director"` stamps an AE + flags; the Director still applies the edge/bane at the table.
 */
export const MACHINE_MOD_PROFILES = {
  "scrap-weld": { kind: "armor", staminaBonus: 6, applied: "stamina" },
  "plate-up": { kind: "armor", staminaBonus: 12, applied: "stamina" },
  "combat-plate": { kind: "armor", staminaBonus: 18, applied: "stamina" },
  "aegis-kit": { kind: "armor", staminaBonus: 27, applied: "stamina" },
  "gun-rack": { kind: "weaponry", gunnery: true, hardpoints: 1, scale: "category-3", dualFeed: false, turret: false, heavy: false, applied: "flags" },
  "twin-mount": { kind: "weaponry", gunnery: true, hardpoints: 2, scale: "category-3", dualFeed: true, turret: false, heavy: false, applied: "flags" },
  "turret-ring": { kind: "weaponry", gunnery: true, hardpoints: 1, scale: "medium", dualFeed: false, turret: true, wideArc: true, heavy: false, applied: "flags" },
  "heavy-hardpoint": { kind: "weaponry", gunnery: true, hardpoints: 1, scale: "heavy", dualFeed: false, turret: false, heavy: true, integrated: true, applied: "flags" },
  "tune-kit": { kind: "other", handlingEdge: true, applied: "director" },
  "sensor-pod": { kind: "other", sensorEdge: true, pierceConcealment: true, applied: "director" },
  "ghost-coat": { kind: "other", stealthBane: true, applied: "director" },
  "runflats": { kind: "other", resistCrippled: true, selfRepair: true, applied: "director" },
  "rigger-cocoon": { kind: "other", jumpInCapable: true, applied: "director" },
  "ammo-bin": { kind: "other", ammoFeed: true, applied: "director" },
};

export function kitProfile(dsid) {
  return MACHINE_MOD_PROFILES[dsid] ?? null;
}

/** Stamina bonus from one mod's catalog flags (0 if inactive or missing). */
export function staminaBonusFromModData(data) {
  if (!data || data.active === false) return 0;
  const n = Number(data.staminaBonus ?? 0);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/**
 * Raise/lower current Stamina when max changes.
 * Installing heals the gain; uninstalling / toggle-off clamps to the new max.
 */
export function staminaAfterArmorChange({ value, max }, nextMax) {
  const current = Number(value ?? 0);
  const oldMax = Number(max ?? 0);
  const target = Number(nextMax ?? 0);
  const delta = target - oldMax;
  const nextValue = delta >= 0 ? Math.min(target, current + delta) : Math.min(target, current);
  return { max: target, value: nextValue };
}

export function installedHostMods(item) {
  const actor = item?.parent;
  if (!(actor instanceof Actor)) return [];
  return actor.items.filter(mod => {
    const data = mod.getFlag(MODULE_ID, "mod");
    return data && data.installedOn === item.id;
  });
}

export function activeHostMods(item) {
  return installedHostMods(item).filter(mod => mod.getFlag(MODULE_ID, "mod")?.active !== false);
}

/**
 * Stamina (Integrity) from an installed, active vehicle/drone armor kit.
 * Hero armor uses staminaByEchelon on the worn Item (AE → system.stamina.bonuses.treasure).
 * Machine kits live on the hero's Item while Integrity lives on the deployed Actor, so each
 * SKU carries a flat staminaBonus (one kit at a time; exclusiveKit: "armor").
 */
export function armorStaminaBonus(item) {
  return activeHostMods(item).reduce((total, mod) => total + staminaBonusFromModData(mod.getFlag(MODULE_ID, "mod")), 0);
}

export function machineStamina(item) {
  return chassisStamina(item) + armorStaminaBonus(item);
}

/** Kit flags a Gunnery / sheet path can read off a deployed machine Actor (or null). */
export function machineWeaponry(actor) {
  return actor?.getFlag?.(MODULE_ID, "installedKits")?.weaponry ?? null;
}

const MACHINE_MOD_AE = "machineMod";

function baseMachineEffect(mod, extraFlags = {}) {
  return {
    name: mod.name,
    img: mod.img,
    origin: mod.uuid,
    disabled: false,
    transfer: false,
    statuses: [],
    tint: "#ffffff",
    flags: { [MODULE_ID]: { [MACHINE_MOD_AE]: true, dsid: mod.system._dsid ?? null, modUuid: mod.uuid, ...extraFlags } },
    duration: { value: null, units: "seconds", expiry: null, expired: false },
    start: null,
    showIcon: 1,
    type: "base",
    system: { end: { roll: "1d10 + @combat.save.bonus" }, changes: [] },
  };
}

function armorEffectPayload(mod, bonus) {
  const effect = baseMachineEffect(mod, { machineArmor: true, staminaBonus: bonus });
  effect.name = game.i18n.format(`${UI}.ArmorKit`, { name: mod.name, bonus });
  effect.description = game.i18n.format(`${UI}.ArmorKitHint`, { bonus });
  // Mirror hero armor: Draw Steel NPC/hero prepareDerivedData adds bonuses.treasure to max.
  effect.system.changes = [{
    key: "system.stamina.bonuses.treasure",
    type: "upgrade",
    value: bonus,
    phase: "initial",
    priority: null,
  }];
  return effect;
}

function kitEffectPayload(mod, profile) {
  const effect = baseMachineEffect(mod, { kind: profile.kind, applied: profile.applied, ...profile });
  const hintKey = profile.kind === "weaponry" ? "WeaponryKitHint" : "DirectorKitHint";
  effect.name = profile.kind === "weaponry"
    ? game.i18n.format(`${UI}.WeaponryKit`, { name: mod.name })
    : game.i18n.format(`${UI}.OtherKit`, { name: mod.name });
  effect.description = game.i18n.format(`${UI}.${hintKey}`, { name: mod.name });
  return effect;
}

function installedKitsFlag(item) {
  const kits = { armor: null, weaponry: null, others: [] };
  for (const mod of activeHostMods(item)) {
    const dsid = mod.system._dsid;
    const data = mod.getFlag(MODULE_ID, "mod") ?? {};
    const profile = kitProfile(dsid) ?? {};
    const row = { dsid, name: mod.name, uuid: mod.uuid, ...profile };
    if (profile.kind === "armor" || staminaBonusFromModData(data)) {
      kits.armor = { ...row, staminaBonus: staminaBonusFromModData(data) || profile.staminaBonus || 0 };
    } else if (profile.kind === "weaponry" || data.exclusiveKit === "weaponry") {
      kits.weaponry = row;
    } else {
      kits.others.push(row);
    }
  }
  return kits;
}

async function stampMachineModEffects(actor, item) {
  const existing = actor.effects.filter(effect => effect.getFlag(MODULE_ID, MACHINE_MOD_AE) || effect.getFlag(MODULE_ID, "machineArmor"));
  if (existing.length) await actor.deleteEmbeddedDocuments("ActiveEffect", existing.map(e => e.id));
  const payloads = [];
  for (const mod of activeHostMods(item)) {
    const dsid = mod.system._dsid;
    const data = mod.getFlag(MODULE_ID, "mod") ?? {};
    const profile = kitProfile(dsid);
    const bonus = staminaBonusFromModData(data);
    if (bonus > 0) payloads.push(armorEffectPayload(mod, bonus));
    else if (profile) payloads.push(kitEffectPayload(mod, profile));
  }
  if (payloads.length) await actor.createEmbeddedDocuments("ActiveEffect", payloads);
}

/**
 * Apply installed, active vehicle/drone mods onto a deployed machine Actor.
 * Armor: chassis max + treasure AE (hero-armor path); current Stamina heals on install and clamps on remove.
 * Weaponry / other: AE + `flags.installedKits` for the Gunnery/sheet path. Toggle-off and uninstall rebuild this set.
 */
export async function syncMachineMods(item) {
  const actor = deployedMachine(item);
  if (!actor) return null;
  const chassis = chassisStamina(item);
  const bonus = armorStaminaBonus(item);
  const nextMax = chassis + bonus;
  const current = Number(actor.system.stamina.value ?? 0);
  const oldMax = Number(actor.system.stamina.max ?? 0);
  const next = staminaAfterArmorChange({ value: current, max: oldMax }, nextMax);
  const kits = installedKitsFlag(item);
  // Wipe kit AEs first so a leftover treasure upgrade cannot double-count while we rewrite stored max.
  const existing = actor.effects.filter(effect => effect.getFlag(MODULE_ID, MACHINE_MOD_AE) || effect.getFlag(MODULE_ID, "machineArmor"));
  if (existing.length) await actor.deleteEmbeddedDocuments("ActiveEffect", existing.map(e => e.id));
  // Stored max is chassis only; the armor AE adds bonuses.treasure during prepareDerivedData.
  // Do not write current Stamina yet: writing value > stored max can clamp before the treasure AE lands.
  await actor.update({
    "system.stamina.max": chassis,
    [`flags.${MODULE_ID}.chassisStamina`]: chassis,
    [`flags.${MODULE_ID}.armorStaminaBonus`]: bonus,
    [`flags.${MODULE_ID}.installedKits`]: kits,
  });
  await stampMachineModEffects(actor, item);
  await actor.update({ "system.stamina.value": next.value });
  return { chassis, bonus, max: nextMax, value: next.value, kits };
}

/** @deprecated use syncMachineMods — kept so existing API callers restamp Integrity. */
export async function syncMachineStamina(item) {
  return syncMachineMods(item);
}

const movementTypes = domain => {
  domain = String(domain ?? "").toLowerCase();
  if (domain.startsWith("air") || domain.startsWith("space")) return ["fly"];
  if (domain.startsWith("water")) return ["swim"];
  return ["walk"];
};

/** The deployed Actor for a gear Item, or null if it isn’t deployed (or its Actor was deleted). */
export function deployedMachine(item) {
  const uuid = item?.getFlag(MODULE_ID, "deployed")?.actorUuid;
  const actor = uuid ? fromUuidSync(uuid) : null;
  return actor instanceof Actor ? actor : null;
}

async function templateFor(band) {
  const pack = game.packs.get(PACK_ID);
  const index = await pack.getIndex({ fields: [`flags.${MODULE_ID}.dsid`] });
  const entry = index.find(e => foundry.utils.getProperty(e, `flags.${MODULE_ID}.dsid`) === `machine-${band}`);
  return entry ? pack.getDocument(entry._id) : null;
}

async function deployFolder() {
  const name = game.i18n.localize(`${UI}.Folder`);
  return game.folders.find(f => (f.type === "Actor") && f.getFlag(MODULE_ID, "deployedMachines"))
    ?? Folder.create({ name, type: "Actor", flags: { [MODULE_ID]: { deployedMachines: true } } });
}

// Next to the owner's token on the viewed Scene, else the centre of the view.
function placement(owner, size) {
  const grid = canvas.grid.size;
  const token = owner?.getActiveTokens?.()[0]?.document;
  if (token) return { x: token.x + (token.width * grid), y: token.y };
  const { x, y } = canvas.stage.pivot;
  return { x: Math.round((x - ((size * grid) / 2)) / grid) * grid, y: Math.round((y - ((size * grid) / 2)) / grid) * grid };
}

/** Deploy a drone or vehicle Item: stamp its band template into a linked Actor and place a token. */
export async function deployMachine(item) {
  const band = machineBand(item);
  if (!band) return ui.notifications.warn(game.i18n.localize(`${UI}.NotMachine`));
  if (!canvas.scene) return ui.notifications.warn(game.i18n.localize(`${UI}.NoScene`));
  if (!game.user.can("ACTOR_CREATE") || !game.user.can("TOKEN_CREATE")) return ui.notifications.warn(game.i18n.localize(`${UI}.NoPermission`));
  const existing = deployedMachine(item);
  if (existing) return ui.notifications.warn(game.i18n.format(`${UI}.AlreadyDeployed`, { name: item.name }));

  const template = await templateFor(band);
  if (!template) return ui.notifications.error(game.i18n.format(`${UI}.NoTemplate`, { band }));

  const vehicle = item.getFlag(MODULE_ID, "vehicle");
  const owner = item.parent instanceof Actor ? item.parent : null;
  const base = BANDS[band];
  const chassis = chassisStamina(item);
  const armorBonus = armorStaminaBonus(item);
  const stamina = chassis + armorBonus;
  const speedBand = vehicle.speedBand ?? VEHICLE_SPEED_BANDS[item.system._dsid];
  const speed = base.speed + (vehicle.drone ? 0 : (SPEED_BAND_BONUS[speedBand] ?? 0));
  // The owner's players own the machine, so they can move its token and track its Integrity.
  const ownership = { default: 0 };
  for (const [userId, level] of Object.entries(owner?.ownership ?? {})) {
    if ((userId !== "default") && (level >= CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER)) ownership[userId] = level;
  }

  const data = game.actors.fromCompendium(template);
  foundry.utils.mergeObject(data, {
    name: item.name, img: item.img, folder: (await deployFolder())?.id ?? null, ownership,
    "system.stamina": { value: chassis, max: chassis, temporary: 0 },
    "system.movement.value": speed,
    "system.movement.types": movementTypes(vehicle.domain),
    "system.movement.hover": Array.isArray(vehicle.tags) && vehicle.tags.includes("Hover"),
    "system.monster.level": vehicle.echelon ?? 1,
    "prototypeToken.name": item.name,
    "prototypeToken.actorLink": true,
    "prototypeToken.texture.src": item.img,
    [`flags.${MODULE_ID}`]: {
      kind: vehicle.drone ? "drone" : "vehicle", band, ownerUuid: owner?.uuid ?? null, gearItemUuid: item.uuid,
      dsid: `machine-${band}`, gearDsid: item.system._dsid ?? null, echelon: vehicle.echelon ?? null, speedBand: speedBand ?? null,
      chassisStamina: chassis,
      armorStaminaBonus: armorBonus,
      installedKits: { armor: null, weaponry: null, others: [] },
    },
  });
  const actor = await Actor.create(data);
  if (!actor) return;
  await addWireKit(actor, { notify: false });
  await item.setFlag(MODULE_ID, "deployed", { actorUuid: actor.uuid });
  await syncMachineMods(item);

  const size = actor.system.combat.size.value;
  const tokenDocument = await actor.getTokenDocument({ ...placement(owner, size), actorLink: true });
  await canvas.scene.createEmbeddedDocuments("Token", [tokenDocument.toObject()]);
  ui.notifications.info(game.i18n.format(`${UI}.Deployed`, { name: item.name, stamina, speed }));
  return actor;
}

/** Recall a deployed machine: delete its tokens on every Scene and its Actor. The Item stays. */
export async function recallMachine(item, { actor } = {}) {
  actor ??= deployedMachine(item);
  if (actor) {
    for (const scene of game.scenes) {
      const ids = scene.tokens.filter(t => t.actorId === actor.id).map(t => t.id);
      if (ids.length) await scene.deleteEmbeddedDocuments("Token", ids);
    }
    await actor.delete({ ghostwireRecall: true });
  }
  if (item?.getFlag(MODULE_ID, "deployed")) await item.unsetFlag(MODULE_ID, "deployed");
  if (item) ui.notifications.info(game.i18n.format(`${UI}.Recalled`, { name: item.name }));
}

export function registerMachines() {
  // Hero sheet: right-click a drone or vehicle row (or its ⋮ control) → Deploy / Recall.
  Hooks.on("getDocumentListContextOptions", (app, menuItems) => {
    if (typeof app._getEmbeddedDocument !== "function") return;
    const machineItem = target => {
      const item = app._getEmbeddedDocument(target);
      return (machineBand(item) && (item.parent instanceof Actor) && item.isOwner) ? item : null;
    };
    menuItems.push(
      {
        label: `${UI}.Deploy`, icon: "fa-solid fa-location-dot",
        visible: target => { const item = machineItem(target); return !!item && !deployedMachine(item); },
        onClick: (event, target) => deployMachine(machineItem(target)),
      },
      {
        label: `${UI}.Recall`, icon: "fa-solid fa-arrow-rotate-left",
        visible: target => { const item = machineItem(target); return !!item && !!deployedMachine(item); },
        onClick: (event, target) => recallMachine(machineItem(target)),
      },
    );
  });

  // Item sheet: a Deploy / Recall row inside the header of a drone or vehicle Item that a hero owns (rebuilt every render).
  Hooks.on("renderDrawSteelItemSheet", (app, element) => {
    const item = app.document;
    element.querySelector(".ghostwire-machine-controls")?.remove();
    if (!machineBand(item) || !(item.parent instanceof Actor)) return;
    const header = element.querySelector(".sheet-header .header-center") ?? element.querySelector(".sheet-header");
    if (!header) return;
    const deployed = deployedMachine(item);
    const controls = document.createElement("div");
    controls.className = "ghostwire-machine-controls flexrow";
    const status = document.createElement("span");
    status.className = "hint";
    status.textContent = deployed
      ? game.i18n.format(`${UI}.StatusDeployed`, { band: game.i18n.localize(`GHOSTWIRE.Summons.Machines.${bandKey(machineBand(item))}.Name`) })
      : game.i18n.localize(`${UI}.StatusStowed`);
    const button = document.createElement("button");
    button.type = "button";
    button.innerHTML = deployed
      ? `<i class="fa-solid fa-arrow-rotate-left"></i> ${game.i18n.localize(`${UI}.Recall`)}`
      : `<i class="fa-solid fa-location-dot"></i> ${game.i18n.localize(`${UI}.Deploy`)}`;
    button.disabled = !item.isOwner;
    button.addEventListener("click", async event => {
      event.preventDefault();
      button.disabled = true;
      try {
        if (deployed) await recallMachine(item);
        else await deployMachine(item);
      } finally {
        // The deployed flag change re-renders the sheets; forcing another render races Draw Steel's async editors.
        button.disabled = false;
      }
    });
    controls.append(status, button);
    header.append(controls);
  });

  // Deleting a deployed Actor (wreck cleanup, or by hand) clears the Item's link; deleting the Item recalls its machine.
  Hooks.on("deleteActor", async (actor, options, userId) => {
    if ((userId !== game.user.id) || options.ghostwireRecall) return;
    const uuid = actor.getFlag(MODULE_ID, "gearItemUuid");
    if (!uuid || !["drone", "vehicle"].includes(actor.getFlag(MODULE_ID, "kind"))) return;
    for (const scene of game.scenes) {
      const ids = scene.tokens.filter(t => t.actorId === actor.id).map(t => t.id);
      if (ids.length) await scene.deleteEmbeddedDocuments("Token", ids);
    }
    const item = await fromUuid(uuid);
    if (item?.getFlag(MODULE_ID, "deployed")?.actorUuid === actor.uuid) await item.unsetFlag(MODULE_ID, "deployed");
  });
  Hooks.on("deleteItem", async (item, options, userId) => {
    if ((userId !== game.user.id) || !machineBand(item)) return;
    const actor = deployedMachine(item);
    if (actor) await recallMachine(null, { actor });
  });

  // A machine reduced to 0 Stamina is wrecked: say so once, and leave Recall to the table.
  Hooks.on("updateActor", (actor, changes, options, userId) => {
    if ((userId !== game.user.id) || !actor.getFlag(MODULE_ID, "gearItemUuid")) return;
    const value = foundry.utils.getProperty(changes, "system.stamina.value");
    if ((value !== undefined) && (value <= 0)) ui.notifications.warn(game.i18n.format(`${UI}.Wrecked`, { name: actor.name }));
  });

  const module = game.modules.get(MODULE_ID);
  if (module) {
    module.api = {
      ...(module.api ?? {}),
      machineBand, deployMachine, recallMachine, deployedMachine,
      chassisStamina, armorStaminaBonus, machineStamina, machineWeaponry,
      staminaAfterArmorChange, staminaBonusFromModData, kitProfile,
      syncMachineStamina, syncMachineMods, activeHostMods, installedHostMods,
    };
  }
  console.log(`${MODULE_ID} | Machines: Deploy / Recall registered (hero sheet row menu and Item sheet)`);
}
