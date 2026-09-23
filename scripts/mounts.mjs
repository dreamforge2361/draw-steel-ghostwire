// 0.3.112 — heavy / vehicle weapons bolted onto an installed Weaponry kit.
//
// The §5F Weaponry kits (Gun Rack, Twin Mount, Turret Ring, Heavy Hardpoint) are *mounts*, not guns:
// "Mounted weapons themselves come from Category 3 unless the weaponry SKU is an integrated package"
// (docs/masters/GHOSTWIRE_GEAR_MASTER.md §5F). Until now nothing recorded WHICH gun sat in the
// hardpoint, so a fielded machine had a kit line and no weapon.
//
// The shape deliberately mirrors the B20c mod-install tracker in scripts/mods.mjs, one level deeper:
//   - kit:    flags.<module>.mountedWeapons = [weaponItemId, ...]   (display/list only)
//   - weapon: flags.<module>.mount = { mountedOn: kitItemId|null, kitDsid, kitName, scale }
// Used hardpoints are computed on the fly from the Actor's weapons whose mount.mountedOn is the kit,
// exactly as usedSlots does for mods, so the two lists can never disagree about capacity.
//
// The hero's chassis Item stays the source of truth (0.3.110 mirror pattern): Deploy / syncMachineMods
// copies installed mods AND the weapons mounted on the active weaponry kit onto the machine Actor, so
// the Machine sheet Inventory shows the gun. Recall throws the copies away; the hero Items are untouched.
//
// B49: a gun on a hardpoint answers to **Gunnery**, never its hand-held weapon skill. weapon-skills.mjs
// reads the `mount` flag directly (it must stay Foundry-free and cycle-free), and mount / unmount
// restamps the cached `weaponSkill` on the use-ability the gun spawned.

import { getModData, installedHost, isActive, standardContentChatData } from "./mods.mjs";
import { kitProfile, machineBand, deployedMachine, syncMachineMods } from "./machines.mjs";
import { weaponSkillKey } from "./weapon-skills.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const L = "GHOSTWIRE.Mounts";

/** Flag keys. scripts/machines.mjs repeats these two strings; tools/mount-weapons-smoke.mjs asserts they agree. */
export const MOUNT_FLAG = "mount";
export const MOUNTED_WEAPONS_FLAG = "mountedWeapons";

/**
 * Hardpoint scale ladder, smallest first. A mount takes any weapon at its own scale or below —
 * a Turret Ring happily carries a Category-3 gun, a Gun Rack cannot swallow an anti-vehicle cannon.
 */
export const MOUNT_SCALES = Object.freeze(["category-3", "medium", "heavy"]);

const gwFlags = doc => doc?.flags?.[MODULE_ID] ?? null;

/** Gear catalog flags of a weapon (Document or plain data). */
function gearData(item) {
  if (typeof item?.getFlag === "function") {
    const flagged = item.getFlag(MODULE_ID, "gear");
    if (flagged) return flagged;
  }
  return gwFlags(item)?.gear ?? null;
}

/** The mount record on a weapon (Document or plain data), or null. */
export function getMountData(item) {
  if (typeof item?.getFlag === "function") {
    const flagged = item.getFlag(MODULE_ID, MOUNT_FLAG);
    if (flagged) return flagged;
  }
  return gwFlags(item)?.[MOUNT_FLAG] ?? null;
}

export function mountScaleRank(scale) {
  const index = MOUNT_SCALES.indexOf(String(scale ?? "").toLowerCase());
  return index < 0 ? null : index;
}

/**
 * The hardpoint scale this weapon needs, or null when it is nobody's mounted weapon.
 *
 * `gear.mountScale` is the SKU's own answer and always wins, so the 0.3.112 vehicle-mount SKUs say
 * what they are. Hand-held heavies fall back to the Damage-Bridge band: a Heavy-band gun (Chatterbox,
 * Wallbreaker) is what §5F calls "one Category-3 weapon", and an Anti-veh piece (Siege Missile,
 * Tank-Cracker) needs the heavy integrated battery. A Light / Medium sidearm is not mount hardware.
 * `gear.mountable: false` opts a SKU out entirely.
 */
export function weaponMountScale(item) {
  const gear = gearData(item);
  if (!gear) return null;
  if (gear.mountable === false) return null;
  if (gear.mountScale) return mountScaleRank(gear.mountScale) === null ? null : String(gear.mountScale).toLowerCase();
  switch (String(gear.weaponBand ?? "").toLowerCase()) {
    case "anti-veh": return "heavy";
    case "heavy": return "category-3";
    default: return null;
  }
}

/** "turret" / "integrated" / "" — hardware the weapon demands of its mount. */
export function weaponMountType(item) {
  return String(gearData(item)?.mountType ?? "").toLowerCase();
}

/** Is this a Ghostwire weapon treasure at all? Mirrors equipment-use.mjs isWeaponTreasure, minus the range gate. */
export function isWeapon(item) {
  return (item?.type === "treasure") && (item?.system?.kind === "weapon") && !!gearData(item);
}

/** Can this weapon ever go on a hardpoint? */
export function isMountableWeapon(item) {
  return isWeapon(item) && !!weaponMountScale(item);
}

/**
 * The mount capacity of a §5F weaponry kit Item, or null when it is not one.
 * Capacities come from MACHINE_MOD_PROFILES (machines.mjs) so there is one source of truth for
 * "gun-rack 1× category-3, twin-mount 2 hardpoints, turret-ring 1 medium turret, heavy-hardpoint 1 heavy".
 */
export function kitMountProfile(kit) {
  const data = getModData(kit);
  if (!data) return null;
  const profile = kitProfile(kit?.system?._dsid);
  if ((profile?.kind !== "weaponry") && (data.exclusiveKit !== "weaponry")) return null;
  return {
    hardpoints: Math.max(1, Number(profile?.hardpoints ?? data.hardpoints ?? 1)),
    scale: String(profile?.scale ?? data.mountScale ?? "category-3").toLowerCase(),
    turret: !!(profile?.turret ?? data.turret),
    integrated: !!(profile?.integrated ?? data.integrated),
    dualFeed: !!(profile?.dualFeed ?? data.dualFeed),
    wideArc: !!(profile?.wideArc ?? data.wideArc),
  };
}

/** Is this Item an installed §5F weaponry kit — the only thing a gun can be bolted to? */
export function isWeaponryKit(kit) {
  return !!kitMountProfile(kit);
}

/** The weapons on the kit's Actor whose mount.mountedOn is this kit. */
export function mountedWeapons(kit) {
  const actor = kit?.parent;
  if (!(actor instanceof Actor) || !kit?.id) return [];
  return actor.items.filter(item => getMountData(item)?.mountedOn === kit.id);
}

/** The kit a weapon is mounted on (same Actor), or null. */
export function mountHost(weapon) {
  const id = getMountData(weapon)?.mountedOn;
  const kit = id ? weapon.parent?.items?.get?.(id) : null;
  return isWeaponryKit(kit) ? kit : null;
}

export const usedHardpoints = kit => mountedWeapons(kit).length;
export const freeHardpoints = kit => (kitMountProfile(kit)?.hardpoints ?? 0) - usedHardpoints(kit);

/** Mounted, on an installed kit, with that kit switched on — the state that actually fires. */
export function isLiveMount(weapon) {
  const kit = mountHost(weapon);
  return !!kit && !!installedHost(kit) && isActive(kit);
}

/** The chassis Item (drone / vehicle) a mounted weapon ultimately rides on, or null. */
export function mountChassis(weapon) {
  const kit = mountHost(weapon);
  return kit ? installedHost(kit) : null;
}

/**
 * @returns {{ ok: boolean, reason?: string, extra?: object }} reason is a GHOSTWIRE.Mounts.Blocked.* key.
 */
export function canMount(weapon, kit) {
  if (!isWeapon(weapon)) return { ok: false, reason: "NotWeapon" };
  const profile = kitMountProfile(kit);
  if (!profile) return { ok: false, reason: "NotMount" };
  if (!(weapon.parent instanceof Actor) || (weapon.parent !== kit.parent)) return { ok: false, reason: "SameActor" };
  if (!installedHost(kit)) return { ok: false, reason: "KitNotInstalled" };
  if (mountHost(weapon)) return { ok: false, reason: "AlreadyMounted" };

  const scale = weaponMountScale(weapon);
  if (!scale) return { ok: false, reason: "NotMountable" };
  const want = mountScaleRank(scale);
  const have = mountScaleRank(profile.scale);
  if ((want === null) || (have === null) || (want > have)) {
    return { ok: false, reason: "TooLarge", extra: { scale, kitScale: profile.scale } };
  }

  const type = weaponMountType(weapon);
  if ((type === "turret") && !profile.turret) return { ok: false, reason: "NeedsTurret" };
  if ((type === "integrated") && !profile.integrated) return { ok: false, reason: "NeedsIntegrated" };

  if (usedHardpoints(kit) + 1 > profile.hardpoints) {
    return { ok: false, reason: "NoHardpoints", extra: { mounted: mountedWeapons(kit).map(w => w.name).join(", ") } };
  }
  return { ok: true };
}

const blocked = (reason, weapon, kit, extra = {}) => ui.notifications.warn(game.i18n.format(`${L}.Blocked.${reason}`, {
  weapon: weapon?.name ?? "",
  kit: kit?.name ?? "",
  scale: weaponMountScale(weapon) ?? "—",
  kitScale: kitMountProfile(kit)?.scale ?? "—",
  used: kit ? usedHardpoints(kit) : 0,
  hardpoints: kitMountProfile(kit)?.hardpoints ?? 0,
  free: kit ? Math.max(0, freeHardpoints(kit)) : 0,
  mounted: "",
  ...extra,
}));

/** Restamp the fielded machine (Integrity, kit flags, mirrored Items) behind a kit. */
async function restampMountMachine(kit) {
  const chassis = kit ? installedHost(kit) : null;
  if (chassis && machineBand(chassis)) await syncMachineMods(chassis);
}

/**
 * Restamp every fielded machine this hero owns.
 * Used when the kit is already off its chassis (uninstall / swap / delete) and there is no host left
 * to walk back to, so the mirrored gun on the deployed Actor would otherwise linger.
 */
async function restampActorMachines(actor) {
  if (!(actor instanceof Actor)) return;
  for (const chassis of actor.items.filter(item => machineBand(item))) {
    if (deployedMachine(chassis)) await syncMachineMods(chassis);
  }
}

/**
 * Refresh the cached `weaponSkill` on the use-ability this gun spawned (B49 / G4).
 * Mounting swings the +2 from Heavy Weapons to Gunnery; unmounting swings it back.
 */
export async function restampWeaponSkill(weapon) {
  const actor = weapon?.parent;
  if (!(actor instanceof Actor)) return;
  const abilities = actor.items.filter(item => item.getFlag?.(MODULE_ID, "fromGearId") === weapon.id);
  const skill = weaponSkillKey(weapon);
  const updates = abilities
    .filter(ability => ability.getFlag(MODULE_ID, "weaponSkill") !== skill)
    .map(ability => ({ _id: ability.id, [`flags.${MODULE_ID}.weaponSkill`]: skill }));
  if (updates.length) await actor.updateEmbeddedDocuments("Item", updates);
}

/**
 * Bolt a weapon onto an installed weaponry kit on the same Actor.
 * @returns {Promise<boolean>} Whether it was mounted.
 */
export async function mountWeapon(weapon, kit) {
  const check = canMount(weapon, kit);
  if (!check.ok) {
    blocked(check.reason, weapon, kit, check.extra);
    return false;
  }
  const ids = mountedWeapons(kit).map(w => w.id);
  await weapon.parent.updateEmbeddedDocuments("Item", [
    { _id: kit.id, [`flags.${MODULE_ID}.${MOUNTED_WEAPONS_FLAG}`]: [...ids, weapon.id] },
    {
      _id: weapon.id,
      [`flags.${MODULE_ID}.${MOUNT_FLAG}`]: {
        mountedOn: kit.id,
        kitDsid: kit.system?._dsid ?? null,
        kitName: kit.name,
        scale: weaponMountScale(weapon),
      },
    },
  ]);
  await restampWeaponSkill(weapon);
  await restampMountMachine(kit);
  ui.notifications.info(game.i18n.format(`${L}.Mounted`, {
    weapon: weapon.name, kit: kit.name, used: usedHardpoints(kit), hardpoints: kitMountProfile(kit).hardpoints,
  }));
  await announceMounted(weapon, kit);
  return true;
}

/** Free the hardpoint. The gun stays in the hero's inventory. */
export async function unmountWeapon(weapon) {
  const actor = weapon?.parent;
  if (!(actor instanceof Actor)) return;
  const kit = mountHost(weapon);
  const updates = [];
  if (kit) {
    updates.push({
      _id: kit.id,
      [`flags.${MODULE_ID}.${MOUNTED_WEAPONS_FLAG}`]: mountedWeapons(kit).map(w => w.id).filter(id => id !== weapon.id),
    });
  }
  updates.push({ _id: weapon.id, [`flags.${MODULE_ID}.${MOUNT_FLAG}.mountedOn`]: null });
  await actor.updateEmbeddedDocuments("Item", updates);
  await restampWeaponSkill(weapon);
  await restampMountMachine(kit);
  ui.notifications.info(game.i18n.format(`${L}.Unmounted`, { weapon: weapon.name, kit: kit?.name ?? "—" }));
}

/** Public chat card for a successful Mount on… — same shape as the Install onto… card (0.3.111). */
async function announceMounted(weapon, kit) {
  const actor = weapon.parent;
  const profile = kitMountProfile(kit);
  const esc = value => foundry.utils.escapeHTML(String(value ?? ""));
  const chassis = installedHost(kit);
  let fielded = "";
  if (chassis && machineBand(chassis)) {
    const machine = deployedMachine(chassis);
    if (machine) fielded = `<p class="hint">${esc(game.i18n.format(`${L}.ChatFielded`, { machine: machine.name }))}</p>`;
  }
  const content = `<div class="ghostwire-mod-install-chat">
      <header><i class="fa-solid fa-crosshairs"></i> <span>${esc(game.i18n.localize(`${L}.ChatTitle`))}</span></header>
      <p>${esc(game.i18n.format(`${L}.ChatBody`, {
        actor: actor?.name ?? game.user?.name ?? "", weapon: weapon.name, kit: kit.name,
        chassis: chassis?.name ?? "—",
      }))}</p>
      <p class="hint">${esc(game.i18n.format(`${L}.ChatHardpoints`, {
        used: usedHardpoints(kit), hardpoints: profile.hardpoints, skill: game.i18n.localize("GHOSTWIRE.Skills.List.Gunnery"),
      }))}</p>
      ${fielded}
    </div>`;
  const Chat = ChatMessage.implementation ?? ChatMessage;
  await Chat.create(standardContentChatData({
    speaker: Chat.getSpeaker({ actor }),
    content,
    style: CONST.CHAT_MESSAGE_STYLES.OTHER,
  }));
}

/**
 * Sheet / Build-tab text for one weaponry kit: the guns in it and the hardpoints left.
 * Empty string when nothing is mounted, so the kit line stays short until a gun lands.
 */
export function describeMounts(kit) {
  const profile = kitMountProfile(kit);
  if (!profile) return "";
  const weapons = mountedWeapons(kit);
  if (!weapons.length) return "";
  const names = weapons.map(w => w.name).join(", ");
  const key = `${L}.SheetMounted`;
  const label = globalThis.game?.i18n?.format?.(key, { weapons: names, used: weapons.length, hardpoints: profile.hardpoints });
  return (label && label !== key) ? label : `mounted: ${names} (${weapons.length} / ${profile.hardpoints})`;
}

// Pick a kit on the weapon's Actor. Kits that pass every check are listed first; the rest are disabled with the reason.
async function promptMount(weapon) {
  const actor = weapon.parent;
  if (mountHost(weapon)) return blocked("AlreadyMounted", weapon, mountHost(weapon));
  const kits = actor.items.filter(item => isWeaponryKit(item))
    .map(kit => ({ kit, check: canMount(weapon, kit) }))
    .sort((a, b) => (b.check.ok - a.check.ok) || a.kit.name.localeCompare(b.kit.name));
  if (!kits.some(k => k.check.ok)) {
    if (!isMountableWeapon(weapon)) return blocked("NotMountable", weapon, null);
    if (!kits.length) return blocked("NoKits", weapon, null);
    const first = kits.find(k => ["NoHardpoints", "TooLarge", "KitNotInstalled", "NeedsTurret", "NeedsIntegrated"].includes(k.check.reason))
      ?? kits[0];
    return blocked(first.check.reason, weapon, first.kit, first.check.extra);
  }
  const escape = foundry.utils.escapeHTML;
  const options = kits.map(({ kit, check }, index) => {
    const profile = kitMountProfile(kit);
    const chassis = installedHost(kit);
    const note = check.ok ? "" : ` — ${game.i18n.format(`${L}.Short.${check.reason}`, check.extra ?? {})}`;
    const on = chassis ? ` @ ${escape(chassis.name)}` : "";
    return `<option value="${kit.id}"${index === 0 ? " selected" : ""}${check.ok ? "" : " disabled"}>`
      + `${escape(kit.name)}${on} (${escape(profile.scale)}; ${usedHardpoints(kit)} / ${profile.hardpoints})${note}</option>`;
  });
  const kitId = await foundry.applications.api.DialogV2.prompt({
    window: { title: game.i18n.format(`${L}.Title`, { weapon: weapon.name }) },
    content: `<p>${game.i18n.format(`${L}.Prompt`, { weapon: escape(weapon.name), scale: escape(weaponMountScale(weapon) ?? "—") })}</p>`
      + `<div class="form-group"><label>${game.i18n.localize(`${L}.Kit`)}</label><select name="kit">${options.join("")}</select></div>`,
    ok: { label: game.i18n.localize(`${L}.Confirm`), callback: (event, button) => button.form.elements.kit.value },
    rejectClose: false,
  });
  if (kitId) return mountWeapon(weapon, actor.items.get(kitId));
}

/** Every weapon mounted on a kit that is no longer installed, across one Actor. */
function strandedMounts(actor) {
  return actor.items.filter(weapon => {
    const data = getMountData(weapon);
    if (!data?.mountedOn) return false;
    const kit = actor.items.get(data.mountedOn);
    return !kit || !isWeaponryKit(kit) || !installedHost(kit);
  });
}

export function registerMounts() {
  // Hero sheet: right-click a weapon row (or its ⋮) → Mount on… / Unmount weapon.
  Hooks.on("getDocumentListContextOptions", (app, menuItems) => {
    if (typeof app._getEmbeddedDocument !== "function") return;
    const weaponItem = target => {
      const item = app._getEmbeddedDocument(target);
      return (isWeapon(item) && (item.parent instanceof Actor) && item.isOwner) ? item : null;
    };
    menuItems.push(
      {
        label: `${L}.Menu.Mount`, icon: "fa-solid fa-crosshairs",
        visible: target => { const w = weaponItem(target); return !!w && isMountableWeapon(w) && !mountHost(w); },
        onClick: (event, target) => promptMount(weaponItem(target)),
      },
      {
        label: `${L}.Menu.Unmount`, icon: "fa-solid fa-link-slash",
        visible: target => { const w = weaponItem(target); return !!w && !!mountHost(w); },
        onClick: (event, target) => unmountWeapon(weaponItem(target)),
      },
    );
  });

  // Item sheet: "Mounted: …" under an owned kit's line; "Mounted on: …" under a mounted gun's. Rebuilt every render.
  Hooks.on("renderDrawSteelItemSheet", (app, element) => {
    const item = app.document;
    element.querySelector(".ghostwire-mount-line")?.remove();
    if (!(item.parent instanceof Actor)) return;
    let text = "";
    if (isWeaponryKit(item)) {
      text = describeMounts(item);
    } else if (isMountableWeapon(item)) {
      const kit = mountHost(item);
      const chassis = mountChassis(item);
      text = kit
        ? game.i18n.format(`${L}.SheetMountedOn`, { kit: kit.name, chassis: chassis?.name ?? "—" })
        : game.i18n.format(`${L}.SheetMountable`, { scale: weaponMountScale(item) });
    }
    if (!text) return;
    const anchor = element.querySelector(".ghostwire-mod-install")
      ?? element.querySelector(".ghostwire-chrome-line")
      ?? element.querySelector(".sheet-header .document-name");
    if (!anchor) return;
    const line = document.createElement("div");
    line.className = "ghostwire-mount-line hint";
    line.textContent = text;
    anchor.after(line);
  });

  // Uninstalling (or swapping) the kit strands its guns: free the hardpoints rather than leave a
  // mount pointing at a kit that is back in the parts bin. exclusiveKit swap goes through here too.
  Hooks.on("updateItem", async (item, changes, options, userId) => {
    if (userId !== game.user.id) return;
    const actor = item.parent;
    if (!(actor instanceof Actor)) return;
    if (!foundry.utils.hasProperty(changes, `flags.${MODULE_ID}.mod`)) return;
    if (!getModData(item)) return;
    const stranded = strandedMounts(actor);
    if (!stranded.length) return;
    for (const weapon of stranded) await unmountWeapon(weapon);
    await restampActorMachines(actor);
  });

  // Deleting a mounted gun frees the kit's list; deleting the kit unmounts its guns.
  Hooks.on("deleteItem", async (item, options, userId) => {
    const actor = item.parent;
    if ((userId !== game.user.id) || !(actor instanceof Actor)) return;
    const updates = [];
    const kit = actor.items.get(getMountData(item)?.mountedOn ?? "");
    if (kit) {
      updates.push({
        _id: kit.id,
        [`flags.${MODULE_ID}.${MOUNTED_WEAPONS_FLAG}`]: (kit.getFlag(MODULE_ID, MOUNTED_WEAPONS_FLAG) ?? []).filter(id => id !== item.id),
      });
    }
    if (isWeaponryKit(item)) {
      for (const weapon of actor.items.filter(w => getMountData(w)?.mountedOn === item.id)) {
        updates.push({ _id: weapon.id, [`flags.${MODULE_ID}.${MOUNT_FLAG}.mountedOn`]: null });
      }
    }
    if (!updates.length) return;
    await actor.updateEmbeddedDocuments("Item", updates);
    for (const id of updates.map(u => u._id)) {
      const weapon = actor.items.get(id);
      if (weapon && isWeapon(weapon)) await restampWeaponSkill(weapon);
    }
    await restampActorMachines(actor);
  });

  const module = game.modules.get(MODULE_ID);
  if (module) {
    module.api = {
      ...(module.api ?? {}),
      mountWeapon, unmountWeapon, canMount, mountedWeapons, mountHost, mountChassis,
      kitMountProfile, isWeaponryKit, isMountableWeapon, weaponMountScale, weaponMountType,
      usedHardpoints, freeHardpoints, isLiveMount, describeMounts, restampWeaponSkill,
    };
  }
  console.log(`${MODULE_ID} | Mounts: Mount on… / Unmount registered (hero sheet row menu and Item sheet)`);
}
