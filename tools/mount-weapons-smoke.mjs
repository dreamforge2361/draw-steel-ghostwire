#!/usr/bin/env node
/**
 * 0.3.112 — mount heavy / vehicle weapons onto a §5F Weaponry kit. Static smoke, no live Foundry.
 *
 * Covers the two Michael locks in docs/directors/_claude-03112-brief.md:
 *   L1  a concrete weapon Item attaches to an installed Gun Rack / Twin Mount / Turret Ring /
 *       Heavy Hardpoint, capacity comes from KIT_PROFILES, unmount frees the hardpoint, the hero
 *       chassis Item stays source of truth and Deploy mirrors the gun onto the machine Actor,
 *       and the gun fires with Gunnery (B49).
 *   L2  the vehicle-mount SKUs ship in the gear pack + a kiosk shelf, with no copied SR text.
 *
 * Also guards the things that must NOT break: armor kits, Rigger Cocoon, Jump-In, the exclusiveKit
 * weaponry swap, and Ammo Bin.
 *
 * Run: node tools/mount-weapons-smoke.mjs
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { atLeast } from "./lib/module-version.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const fail = [];
const ok = [];
const note = (pass, msg) => (pass ? ok.push(`  ✓ ${msg}`) : fail.push(msg));
const readJson = path => JSON.parse(readFileSync(path, "utf8"));

const module = readJson("module.json");
const lang = readJson("lang/en.json");

console.log("Mount heavy / vehicle weapons smoke (0.3.112)\n");

note(atLeast(module.version, "0.3.112"), `module.json ≥ 0.3.112 (got ${module.version})`);
note(existsSync("scripts/mounts.mjs"), "scripts/mounts.mjs present");

const bootSrc = readFileSync("scripts/module.mjs", "utf8");
note(bootSrc.includes("registerMounts"), "module.mjs registers the mount system");

/* ------------------------------------------------------------------ */
/*  Foundry stubs — mounts.mjs only touches globals inside functions   */
/* ------------------------------------------------------------------ */
class FakeActor {
  constructor(name = "Wrench") {
    this.name = name;
    this.items = [];
    this.items.get = id => this.items.find(item => item.id === id) ?? null;
    this.updates = [];
  }
  add(...items) {
    for (const item of items) {
      item.parent = this;
      this.items.push(item);
    }
    return this;
  }
  // The real Document API writes dot-paths; the stub only needs the paths mounts.mjs actually uses.
  async updateEmbeddedDocuments(_type, updates) {
    this.updates.push(...updates);
    for (const { _id, ...changes } of updates) {
      const item = this.items.get(_id);
      if (!item) continue;
      for (const [path, value] of Object.entries(changes)) {
        const key = path.replace(`flags.${MODULE_ID}.`, "");
        if (key === "mount.mountedOn") item._flags.mount = { ...(item._flags.mount ?? {}), mountedOn: value };
        else item._flags[key] = value;
      }
    }
    return updates;
  }
}

class FakeItem {
  constructor({ id, name, dsid, type = "treasure", kind = null, gear = null, mod = null, mount = null, vehicle = null }) {
    this.id = id;
    this.uuid = `Item.${id}`;
    this.name = name;
    this.type = type;
    this.system = { _dsid: dsid, kind };
    this.parent = null;
    this._flags = {};
    if (gear) this._flags.gear = gear;
    if (mod) this._flags.mod = mod;
    if (mount) this._flags.mount = mount;
    if (vehicle) this._flags.vehicle = vehicle;
  }
  get flags() { return { [MODULE_ID]: this._flags }; }
  getFlag(scope, key) { return scope === MODULE_ID ? this._flags[key] : undefined; }
  toObject() {
    return {
      name: this.name, type: this.type, img: "x.webp",
      system: { ...this.system }, effects: [],
      flags: { [MODULE_ID]: structuredClone(this._flags) },
    };
  }
}

const notices = [];
globalThis.Actor = FakeActor;
globalThis.game = { actors: new Map(), modules: { get: () => null }, user: { id: "u" }, i18n: { localize: k => k, format: (k, d) => `${k}:${JSON.stringify(d)}` } };
globalThis.CONFIG = {};
globalThis.CONST = { CHAT_MESSAGE_STYLES: { OTHER: 0 } };
globalThis.Hooks = { on() {}, once() {} };
globalThis.ui = { notifications: { warn: m => notices.push(["warn", m]), info: m => notices.push(["info", m]), error: m => notices.push(["error", m]) } };
globalThis.fromUuidSync = () => null;
const chatCards = [];
globalThis.ChatMessage = { implementation: { getSpeaker: () => ({}), create: async data => { chatCards.push(data); return data; } } };
globalThis.foundry = {
  utils: {
    getProperty: () => undefined,
    setProperty: () => {},
    deepClone: v => structuredClone(v),
    hasProperty: (obj, path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj) !== undefined,
    escapeHTML: String,
  },
};

const mounts = await import("../scripts/mounts.mjs");
const machines = await import("../scripts/machines.mjs");
const weaponSkills = await import("../scripts/weapon-skills.mjs");

const {
  MOUNT_FLAG, MOUNTED_WEAPONS_FLAG, MOUNT_SCALES, canMount, mountWeapon, unmountWeapon,
  mountedWeapons, mountHost, mountChassis, kitMountProfile, isWeaponryKit, isMountableWeapon,
  weaponMountScale, weaponMountType, usedHardpoints, freeHardpoints, isLiveMount, describeMounts,
  mountScaleRank,
} = mounts;

/* ------------------------------------------------------------------ */
/*  the flag keys machines.mjs / weapon-skills.mjs repeat by hand      */
/* ------------------------------------------------------------------ */
const machinesSrc = readFileSync("scripts/machines.mjs", "utf8");
const skillsSrc = readFileSync("scripts/weapon-skills.mjs", "utf8");
note(MOUNT_FLAG === "mount" && MOUNTED_WEAPONS_FLAG === "mountedWeapons", "mount flag keys are `mount` / `mountedWeapons`");
note(new RegExp(`const MOUNT_FLAG = "${MOUNT_FLAG}"`).test(machinesSrc), "machines.mjs repeats the same MOUNT_FLAG string");
note(skillsSrc.includes("?.mount?.mountedOn"), "weapon-skills.mjs reads the same mount.mountedOn path");
note(!machinesSrc.includes('from "./mounts.mjs"'), "machines.mjs does not import mounts.mjs — no cycle");
note(!skillsSrc.includes('from "./mounts.mjs"'), "weapon-skills.mjs stays a leaf module");

/* ------------------------------------------------------------------ */
/*  capacities come from KIT_PROFILES, not a second table             */
/* ------------------------------------------------------------------ */
const kitItem = (id, dsid, name, { installedOn = "bull", active = true } = {}) => new FakeItem({
  id, name, dsid, mod: { installedOn, active, exclusiveKit: "weaponry" },
});

const KIT_EXPECT = {
  "gun-rack": { hardpoints: 1, scale: "category-3", turret: false, integrated: false },
  "twin-mount": { hardpoints: 2, scale: "category-3", turret: false, integrated: false },
  "turret-ring": { hardpoints: 1, scale: "medium", turret: true, integrated: false },
  "heavy-hardpoint": { hardpoints: 1, scale: "heavy", turret: false, integrated: true },
};
for (const [dsid, want] of Object.entries(KIT_EXPECT)) {
  const profile = kitMountProfile(kitItem(`k-${dsid}`, dsid, dsid));
  const catalog = machines.kitProfile(dsid);
  note(!!profile && profile.hardpoints === want.hardpoints && profile.scale === want.scale
    && profile.turret === want.turret && profile.integrated === want.integrated,
    `${dsid}: ${want.hardpoints} hardpoint(s), ${want.scale} scale${want.turret ? ", turret" : ""}${want.integrated ? ", integrated" : ""}`);
  note(profile.hardpoints === catalog.hardpoints && profile.scale === catalog.scale,
    `${dsid} capacity is read from MACHINE_MOD_PROFILES, not a second table`);
}
note(!isWeaponryKit(new FakeItem({ id: "sw", name: "Scrap-Weld", dsid: "scrap-weld", mod: { installedOn: "bull", exclusiveKit: "armor", staminaBonus: 6 } })),
  "an armor kit is not a hardpoint");
note(!isWeaponryKit(new FakeItem({ id: "bin", name: "Ammo Bin", dsid: "ammo-bin", mod: { installedOn: "bull" } })),
  "Ammo Bin is not a hardpoint (it feeds one)");
note(!isWeaponryKit(new FakeItem({ id: "coc", name: "Rigger Cocoon", dsid: "rigger-cocoon", mod: { installedOn: "bull" } })),
  "Rigger Cocoon is not a hardpoint");
note(JSON.stringify(MOUNT_SCALES) === '["category-3","medium","heavy"]', "the scale ladder is category-3 < medium < heavy");
note(mountScaleRank("HEAVY") === 2 && mountScaleRank("nonsense") === null, "scale rank is case-insensitive and rejects junk");

/* ------------------------------------------------------------------ */
/*  which weapons are mount hardware                                  */
/* ------------------------------------------------------------------ */
const weaponItem = (id, name, dsid, gear) => new FakeItem({ id, name, dsid, kind: "weapon", gear: { range: "Medium", damage: 9, ...gear } });

note(weaponMountScale(weaponItem("w1", "Chatterbox", "chatterbox", { weaponBand: "heavy" })) === "category-3",
  "a hand-held Heavy-band gun is Category-3 mount hardware (§5F)");
note(weaponMountScale(weaponItem("w2", "Siege Missile", "siege-missile", { weaponBand: "anti-veh" })) === "heavy",
  "an Anti-veh piece needs the heavy integrated battery");
note(weaponMountScale(weaponItem("w3", "Workhorse", "workhorse", { weaponBand: "light" })) === null,
  "a sidearm is not mount hardware");
note(weaponMountScale(weaponItem("w4", "Hornet Pod", "hornet-pod", { weaponBand: "medium", mountScale: "category-3" })) === "category-3",
  "gear.mountScale wins over the damage band (Hornet Pod is Medium band, Category-3 mount)");
note(weaponMountScale(weaponItem("w5", "Wallbreaker", "wallbreaker", { weaponBand: "heavy", mountable: false })) === null,
  "gear.mountable: false opts a SKU out");
note(weaponMountType(weaponItem("w6", "Crownfire", "crownfire", { mountType: "turret" })) === "turret",
  "gear.mountType names the hardware a gun demands");
note(!isMountableWeapon(new FakeItem({ id: "x", name: "Combat Plate", dsid: "combat-plate", mod: { staminaBonus: 18 } })),
  "a mod is never mountable");

/* ------------------------------------------------------------------ */
/*  mount / unmount, for real                                         */
/* ------------------------------------------------------------------ */
function rig({ kitDsid = "gun-rack", kitName = "Gun Rack", active = true } = {}) {
  const actor = new FakeActor();
  const chassis = new FakeItem({ id: "bull", name: "Bulldog", dsid: "bulldog", vehicle: { drone: false, domain: "Ground", scale: "Heavy", modSlots: 3 } });
  const kit = kitItem("kit", kitDsid, kitName, { active });
  actor.add(chassis, kit);
  return { actor, chassis, kit };
}

{
  const { actor, kit } = rig();
  const gun = weaponItem("gun", "Roadspike", "roadspike", { weaponBand: "heavy", mountScale: "category-3" });
  actor.add(gun);
  note(canMount(gun, kit).ok, "a Category-3 gun mounts on a Gun Rack");
  note(await mountWeapon(gun, kit) === true, "mountWeapon reports success");
  note(mountHost(gun) === kit, "the gun knows its hardpoint");
  note(mountedWeapons(kit).length === 1 && mountedWeapons(kit)[0] === gun, "the kit knows its gun");
  note((kit.getFlag(MODULE_ID, MOUNTED_WEAPONS_FLAG) ?? []).join() === "gun", "the kit's display list records the id");
  note(usedHardpoints(kit) === 1 && freeHardpoints(kit) === 0, "Gun Rack is now 1 / 1");
  note(canMount(weaponItem("gun2", "Ashwalker", "ashwalker", { weaponBand: "heavy", mountScale: "category-3" }), kit).ok === false,
    "a second gun is refused: the hardpoint is full");
  note(canMount(gun, kit).reason === "AlreadyMounted", "and the same gun cannot double-mount");
  note(isLiveMount(gun), "a mounted gun on an installed, switched-on kit is live");
  note(weaponSkills.weaponSkillKey(gun) === "gunnery", "B49: the mounted gun answers to Gunnery");
  note(describeMounts(kit).includes("Roadspike"), `the kit line names its gun (${describeMounts(kit)})`);
  note(machines.mountedWeaponsOn(kit).length === 1, "machines.mjs sees the same mount through its own reader");
  note(machines.describeWeaponryKit(kit).includes("Roadspike") && machines.describeWeaponryKit(kit).includes("Gunnery"),
    `the Build hardpoints line names the gun (${machines.describeWeaponryKit(kit)})`);
  const card = chatCards.at(-1);
  note(card?.type === "standard" && card.system.parts[0].type === "content",
    "the mount posts a standard content chat card (the only subtype Draw Steel renders)");
  note(String(card?.content).includes("GHOSTWIRE.Mounts.ChatTitle"), "and the card is built from the Mounts lang block");

  await unmountWeapon(gun);
  note(mountHost(gun) === null, "unmount frees the gun");
  note(usedHardpoints(kit) === 0 && freeHardpoints(kit) === 1, "and frees the hardpoint");
  note(actor.items.includes(gun), "the gun stays in the hero's inventory");
  note(weaponSkills.weaponSkillKey(gun) === "gunnery", "a mounted/ SKU still reads Gunnery off a hardpoint (no hand-held mode)");
  note(describeMounts(kit) === "", "an empty hardpoint adds nothing to the kit line");
}

{
  const { actor, kit } = rig({ kitDsid: "twin-mount", kitName: "Twin Mount" });
  const a = weaponItem("a", "Roadspike", "roadspike", { weaponBand: "heavy", mountScale: "category-3" });
  const b = weaponItem("b", "Streetlash", "streetlash", { weaponBand: "heavy", mountScale: "category-3" });
  const c = weaponItem("c", "Ashwalker", "ashwalker", { weaponBand: "heavy", mountScale: "category-3" });
  actor.add(a, b, c);
  note(await mountWeapon(a, kit) && await mountWeapon(b, kit), "a Twin Mount takes two Category-3 guns");
  note(usedHardpoints(kit) === 2, "Twin Mount is 2 / 2");
  note(canMount(c, kit).reason === "NoHardpoints", "and refuses a third");
  note(describeMounts(kit).includes("Roadspike") && describeMounts(kit).includes("Streetlash"), "both guns show on the kit line");
}

{
  const { actor, kit } = rig({ kitDsid: "gun-rack", kitName: "Gun Rack" });
  const cannon = weaponItem("g", "God's-Finger", "godsfinger", { weaponBand: "anti-veh", mountScale: "heavy", mountType: "integrated" });
  actor.add(cannon);
  const check = canMount(cannon, kit);
  note(check.reason === "TooLarge", "a heavy integrated cannon does not fit a Gun Rack");
  note(check.extra.scale === "heavy" && check.extra.kitScale === "category-3", "and the refusal names both scales");
}

{
  const { actor, kit } = rig({ kitDsid: "turret-ring", kitName: "Turret Ring" });
  const turretGun = weaponItem("t", "Crownfire", "crownfire", { weaponBand: "heavy", mountScale: "medium", mountType: "turret" });
  const smallGun = weaponItem("s", "Roadspike", "roadspike", { weaponBand: "heavy", mountScale: "category-3" });
  actor.add(turretGun, smallGun);
  note(canMount(turretGun, kit).ok, "a medium turret gun mounts on a Turret Ring");
  note(canMount(smallGun, kit).ok, "a wider mount still takes a smaller gun");
  const rack = rig({ kitDsid: "gun-rack", kitName: "Gun Rack" });
  rack.actor.add(weaponItem("t2", "Crownfire", "crownfire", { weaponBand: "heavy", mountScale: "medium", mountType: "turret" }));
  note(canMount(rack.actor.items.get("t2"), rack.kit).reason === "TooLarge", "and a Gun Rack refuses a medium turret gun");
}

{
  const { actor, kit } = rig({ kitDsid: "heavy-hardpoint", kitName: "Heavy Hardpoint" });
  const rack = weaponItem("q", "Quiverframe", "quiverframe", { weaponBand: "anti-veh", mountScale: "heavy", mountType: "integrated" });
  const turretGun = weaponItem("t", "Lanternhead", "lanternhead", { weaponBand: "heavy", mountScale: "medium", mountType: "turret" });
  actor.add(rack, turretGun);
  note(canMount(rack, kit).ok, "an integrated package mounts on the Heavy Hardpoint");
  note(canMount(turretGun, kit).reason === "NeedsTurret", "a turret gun still needs a powered ring, not a battery mount");
  const ring = rig({ kitDsid: "turret-ring", kitName: "Turret Ring" });
  ring.actor.add(weaponItem("q2", "Quiverframe", "quiverframe", { weaponBand: "anti-veh", mountScale: "heavy", mountType: "integrated" }));
  note(["TooLarge", "NeedsIntegrated"].includes(canMount(ring.actor.items.get("q2"), ring.kit).reason),
    "and a Turret Ring refuses an integrated heavy package");
}

{
  const { actor, kit } = rig({ kitDsid: "gun-rack", kitName: "Gun Rack", active: true });
  kit._flags.mod.installedOn = null;               // bought, not yet bolted to the chassis
  const gun = weaponItem("gun", "Roadspike", "roadspike", { weaponBand: "heavy", mountScale: "category-3" });
  actor.add(gun);
  note(canMount(gun, kit).reason === "KitNotInstalled", "a kit still in the parts bin takes no gun");
}

{
  const { actor, kit, chassis } = rig();
  const gun = weaponItem("gun", "Roadspike", "roadspike", { weaponBand: "heavy", mountScale: "category-3" });
  actor.add(gun);
  await mountWeapon(gun, kit);
  note(mountChassis(gun) === chassis, "the gun walks back to the chassis Item through its kit");
  kit._flags.mod.active = false;
  note(!isLiveMount(gun), "a switched-off kit stops feeding its gun");
  note(mountHost(gun) === kit, "but the gun keeps its hardpoint — toggling is not unmounting");
}

{
  const other = new FakeActor("Scout");
  const gun = weaponItem("gun", "Roadspike", "roadspike", { weaponBand: "heavy", mountScale: "category-3" });
  other.add(gun);
  const { kit } = rig();
  note(canMount(gun, kit).reason === "SameActor", "a gun cannot mount onto another hero's kit");
}

/* ------------------------------------------------------------------ */
/*  the Deploy mirror (0.3.110 pattern)                                */
/* ------------------------------------------------------------------ */
note(machinesSrc.includes("machineMountMirrorData"), "syncMachineMods mirrors mounted weapons onto the machine Actor");
note(/mountedWeaponsOn\(mod\)/.test(machinesSrc), "the mirror list is built from the kit's mounted weapons");
note(/const guns = activeHostMods\(chassisItem\)/.test(machinesSrc), "only an ACTIVE kit's guns are mirrored");
{
  const gun = weaponItem("gun", "Roadspike", "roadspike", { weaponBand: "heavy", mountScale: "category-3" });
  gun._flags.mount = { mountedOn: "kit", kitDsid: "gun-rack", kitName: "Gun Rack", scale: "category-3" };
  const mirror = machines.machineMountMirrorData(gun);
  note(mirror.flags[MODULE_ID].machineModMirror === "Item.gun", "the gun mirror records the hero Item uuid");
  note(mirror.flags[MODULE_ID].mount.mountedOn === null, "the mirror drops the hero-side hardpoint id");
  note(mirror.flags[MODULE_ID].mount.kitName === "Gun Rack", "but keeps which kit it came off");
  note(mirror.flags[MODULE_ID].machineMountMirror === true, "and is marked a mount mirror");
  note(!mirror.flags[MODULE_ID].mod, "the gun mirror is NOT stamped with an empty mod block");
  note(!mirror._id && mirror.name === "Roadspike", "the mirror is an id-stripped copy");
  note(gun._flags.mount.mountedOn === "kit", "building a mirror does not unmount the hero gun");

  const kitMirror = machines.machineModMirrorData(kitItem("kit", "gun-rack", "Gun Rack"));
  note(kitMirror.flags[MODULE_ID].mod.installedOn === null, "the mod mirror still clears installedOn (0.3.110 behaviour)");
}

/* ------------------------------------------------------------------ */
/*  L2 — the new SKUs                                                  */
/* ------------------------------------------------------------------ */
const MOUNTED_DIR = "src/packs/gear/weapons/mounted";
note(existsSync(join(MOUNTED_DIR, "_folder.json")), "gear/weapons/mounted has its own compendium Folder");
const folder = readJson(join(MOUNTED_DIR, "_folder.json"));
note(folder.folder === "XLspd2sc9I6l34wi", "the mounted folder nests under Weapons");
note(folder.name === "GHOSTWIRE.Gear.Folders.WeaponsMounted" && typeof lang.GHOSTWIRE.Gear.Folders.WeaponsMounted === "string",
  "and its name resolves through lang");

const skus = readdirSync(MOUNTED_DIR).filter(f => f.endsWith(".json") && f !== "_folder.json").map(f => readJson(join(MOUNTED_DIR, f)));
note(skus.length >= 8, `${skus.length} vehicle-mount SKUs ship`);
note(skus.every(s => s.folder === folder._id), "every SKU points at that Folder (build-packs would throw otherwise)");
note(skus.every(s => /^[A-Za-z0-9]{16}$/.test(s._id)), "every _id is 16 alphanumerics");
note(new Set(skus.map(s => s._id)).size === skus.length, "no duplicate ids inside the folder");

const gearOf = s => s.flags[MODULE_ID].gear;
note(skus.every(s => s.type === "treasure" && s.system.kind === "weapon"), "each is a weapon treasure");
note(skus.every(s => MOUNT_SCALES.includes(gearOf(s).mountScale)), "each declares a real mountScale");
note(skus.every(s => gearOf(s).vehicleMount === true), "each is flagged vehicleMount");
note(skus.every(s => (gearOf(s).tags ?? []).includes("Mounted")), "each carries the Mounted tag");
note(skus.every(s => ["Adjacent", "Short", "Medium", "Long", "Extreme"].includes(gearOf(s).range)),
  "each range band is one B49 knows (weapon-use-templates.json)");
note(skus.every(s => ["kinetic", "AP", "fire", "electrical", "toxin"].includes(gearOf(s).damageType)),
  "each damage type maps in weapon-use-templates.json");
note(skus.every(s => Number(gearOf(s).damage) > 0), "each has a Weapon Base number, so B49 arms it");

// §F5/§F6: Availability and mod slots are inherited from the item tier alone.
const SLOTS_BY_AVAIL = { street: 1, professional: 2, restricted: 3, military: 4, prototype: 5 };
const ECHELON_BY_AVAIL = { street: 1, professional: 1, restricted: 2, military: 3, prototype: 4 };
const slotDrift = skus.filter(s => gearOf(s).modSlots !== SLOTS_BY_AVAIL[gearOf(s).availability]);
note(!slotDrift.length, `mod slots follow §F6 from Availability${slotDrift.length ? ` — ${slotDrift.map(s => s.system._dsid).join(", ")}` : ""}`);
const echDrift = skus.filter(s => gearOf(s).echelon !== ECHELON_BY_AVAIL[gearOf(s).availability]
  || s.system.echelon !== gearOf(s).echelon);
note(!echDrift.length, `echelon follows §F5 from Availability and matches system.echelon${echDrift.length ? ` — ${echDrift.map(s => s.system._dsid).join(", ")}` : ""}`);

// Damage-Bridge: Heavy ≈ 9, Anti-veh ≈ 14, each varying ±1–2.
const BAND_MID = { light: 4, medium: 6, heavy: 9, "anti-veh": 14 };
const bandDrift = skus.filter(s => Math.abs(Number(gearOf(s).damage) - BAND_MID[gearOf(s).weaponBand]) > 2);
note(!bandDrift.length, `every Weapon Base sits within ±2 of its Damage-Bridge band${bandDrift.length ? ` — ${bandDrift.map(s => s.system._dsid).join(", ")}` : ""}`);

// A turret / integrated SKU must be mountable on something that ships.
const KITS = Object.keys(KIT_EXPECT).map(dsid => kitItem(`k2-${dsid}`, dsid, dsid));
for (const sku of skus) {
  const gear = gearOf(sku);
  const stub = weaponItem(`sku-${sku.system._dsid}`, sku.system._dsid, sku.system._dsid, gear);
  const fits = KITS.filter(kit => {
    const profile = kitMountProfile(kit);
    if (mountScaleRank(gear.mountScale) > mountScaleRank(profile.scale)) return false;
    if (gear.mountType === "turret" && !profile.turret) return false;
    if (gear.mountType === "integrated" && !profile.integrated) return false;
    return true;
  });
  note(fits.length > 0, `${sku.system._dsid} fits at least one shipped kit (${fits.map(k => k.system._dsid).join(", ")})`);
  note(isMountableWeapon(stub), `${sku.system._dsid} reads as mount hardware`);
}

// Lang: every SKU resolves a Name + Description, and no Shadowrun product name leaks in.
const langItems = lang.GHOSTWIRE.Gear.Items;
const langKeyOf = s => s.name.replace("GHOSTWIRE.Gear.Items.", "").replace(".Name", "");
const missing = skus.filter(s => typeof langItems[langKeyOf(s)]?.Name !== "string" || typeof langItems[langKeyOf(s)]?.Description !== "string");
note(!missing.length, `every SKU resolves a lang Name + Description${missing.length ? ` — ${missing.map(s => s.system._dsid).join(", ")}` : ""}`);
const descriptions = skus.map(s => langItems[langKeyOf(s)].Description).join("\n");
note(skus.every(s => langItems[langKeyOf(s)].Description.includes("Gunnery")), "every card says it fires with Gunnery");
note(skus.every(s => langItems[langKeyOf(s)].Description.includes("Mount on")), "every card names the Mount on… UX");

// Reference was structure-and-feel only: no SR trademarks, product names, or table text.
const SR_MARKS = ["Shadowrun", "Catalyst", "Ares", "Ingram", "Fichetti", "SternMeyer", "Ruger", "Colt",
  "Cavalier", "Yamaha", "Aztechnology", "Renraku", "Shiawase", "Mitsuhama", "Saeder", "Krupp",
  "Krime", "Horizon", "Evo", "Wuxing", "Ceska", "Enfield", "Remington", "Ranger Arms", "Defiance",
  "Rigger Black Book", "Arsenal"];
const leaked = SR_MARKS.filter(mark => new RegExp(`\\b${mark}\\b`).test(descriptions));
note(!leaked.length, `no Shadowrun product name in the new cards${leaked.length ? ` — ${leaked.join(", ")}` : ""}`);
const GW_CORPS = ["Ferrum", "Ironclad", "Kestrel", "Nyx"];
note(GW_CORPS.every(corp => descriptions.includes(corp)), "the corp register is Ghostwire's own conglomerates");

/* ------------------------------------------------------------------ */
/*  L2 — the kiosk shelf                                               */
/* ------------------------------------------------------------------ */
const { getPreset, matchPresetItem, FOLDER_IDS } = await import("../scripts/kiosk-presets.mjs");
const preset = getPreset("vehicleWeapons");
note(!!preset, "a vehicleWeapons kiosk preset exists");
note(FOLDER_IDS.weaponsMounted === folder._id, "the preset folder id is the shipped Folder");
note(typeof lang.GHOSTWIRE.Kiosk.Presets.VehicleWeapons?.ActorName === "string", "the shelf has a lang Name / ActorName / Tagline");
const row = sku => ({ pack: "gear", path: `weapons/mounted/${sku.system._dsid}`, folder: sku.folder, type: sku.type, system: sku.system, flags: sku.flags });
note(skus.every(s => matchPresetItem(row(s), preset)), "every new SKU lands on the Hardpoint Bay shelf");
note(matchPresetItem(row(skus[0]), getPreset("weapons")), "and still lands in the Weapons Cage");
const wallbreaker = readJson("src/packs/gear/weapons/heavy/wallbreaker.json");
note(matchPresetItem({ pack: "gear", path: "weapons/heavy/wallbreaker", folder: wallbreaker.folder, type: wallbreaker.type, system: wallbreaker.system, flags: wallbreaker.flags }, preset),
  "the Mounted-tagged Wallbreaker is on the Hardpoint Bay shelf too");
note(!matchPresetItem({ pack: "gear", path: "weapons/light-firearms/workhorse", folder: "x", type: "treasure", system: { kind: "weapon" }, flags: { [MODULE_ID]: { gear: { tags: ["Light"] } } } }, preset),
  "a sidearm is not");

/* ------------------------------------------------------------------ */
/*  lang for the mount UX                                              */
/* ------------------------------------------------------------------ */
const M = lang.GHOSTWIRE.Mounts;
note(!!M, "GHOSTWIRE.Mounts lang block ships");
for (const key of ["Title", "Prompt", "Kit", "Confirm", "Mounted", "Unmounted", "ChatTitle", "ChatBody",
  "ChatHardpoints", "ChatFielded", "SheetMounted", "SheetMountedOn", "SheetMountable"]) {
  note(typeof M?.[key] === "string", `lang Mounts.${key}`);
}
note(typeof M?.Menu?.Mount === "string" && typeof M?.Menu?.Unmount === "string", "lang Mounts.Menu.Mount / .Unmount");
const REASONS = ["NotWeapon", "NotMount", "SameActor", "KitNotInstalled", "AlreadyMounted", "NotMountable",
  "TooLarge", "NeedsTurret", "NeedsIntegrated", "NoHardpoints"];
for (const reason of REASONS) {
  note(typeof M?.Blocked?.[reason] === "string", `lang Mounts.Blocked.${reason}`);
  note(typeof M?.Short?.[reason] === "string", `lang Mounts.Short.${reason}`);
}
note(typeof M?.Blocked?.NoKits === "string", "lang Mounts.Blocked.NoKits (nothing installed at all)");
const mountsSrc = readFileSync("scripts/mounts.mjs", "utf8");
const usedReasons = [...mountsSrc.matchAll(/reason: "([A-Za-z]+)"/g)].map(m => m[1]);
const unlocalized = [...new Set(usedReasons)].filter(r => typeof M?.Blocked?.[r] !== "string");
note(!unlocalized.length, `every refusal reason mounts.mjs can return is localized${unlocalized.length ? ` — ${unlocalized.join(", ")}` : ""}`);

/* ------------------------------------------------------------------ */
/*  nothing older broke                                               */
/* ------------------------------------------------------------------ */
note(machines.kitProfile("scrap-weld").staminaBonus === 6 && machines.kitProfile("aegis-kit").staminaBonus === 27,
  "armor kits still carry their Stamina bonuses");
note(machines.kitProfile("rigger-cocoon").jumpInCapable === true, "Rigger Cocoon still grants Jump-In");
note(machines.kitProfile("ammo-bin").ammoFeed === true, "Ammo Bin is untouched");
note(machines.chassisJumpInCapable({ drone: true }) === true && machines.chassisJumpInCapable({}) === false,
  "the Jump-In gate is unchanged");
const modsSrc = readFileSync("scripts/mods.mjs", "utf8");
note(modsSrc.includes('exclusiveKit'), "the exclusiveKit weaponry swap still lives in mods.mjs");
note(mountsSrc.includes("strandedMounts"), "uninstalling / swapping a kit unmounts its guns rather than stranding them");
note(Object.keys(machines.MACHINE_MOD_PROFILES).length === 24, `all 24 machine mod profiles still ship (got ${Object.keys(machines.MACHINE_MOD_PROFILES).length})`);

/* ------------------------------------------------------------------ */
/*  docs                                                              */
/* ------------------------------------------------------------------ */
const gearMaster = readFileSync("docs/masters/GHOSTWIRE_GEAR_MASTER.md", "utf8");
note(gearMaster.includes("3H"), "the gear master has a §3H vehicle & mounted weapons section");
const undocumented = skus.filter(s => !gearMaster.includes(langItems[langKeyOf(s)].Name));
note(!undocumented.length, `gear master §3H lists every new SKU${undocumented.length ? ` — ${undocumented.map(s => s.system._dsid).join(", ")}` : ""}`);
const directorNote = "docs/directors/mount-vehicle-weapons-0312.md";
note(existsSync(directorNote), `Director note ships (${directorNote})`);
if (existsSync(directorNote)) {
  const dn = readFileSync(directorNote, "utf8");
  note(dn.includes("Mount on") && dn.includes("Gunnery") && dn.includes("Hardpoint Bay"),
    "Director note covers the UX, Gunnery, and the new kiosk shelf");
}

/* ------------------------------------------------------------------ */
console.log(ok.join("\n"));
console.log("");
if (fail.length) {
  for (const msg of fail) console.error(`  ✗ ${msg}`);
  console.error(`\nmount-weapons smoke FAILED — ${fail.length} of ${fail.length + ok.length} check(s).`);
  process.exit(1);
}
console.log(`mount-weapons smoke PASS — ${ok.length} checks.`);
