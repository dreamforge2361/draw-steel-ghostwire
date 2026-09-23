#!/usr/bin/env node
/**
 * Rigger vertical — static smoke (no live Foundry).
 * 0.3.105: sheet/template/base-asset shape.
 * 0.3.106: Machine sheet tabs, Save path, sheet preference, and live Fleet Size arithmetic.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { atLeast } from "./lib/module-version.mjs";
import { standardContentChatData } from "../scripts/mods.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const fail = [];
const ok = [];
const note = (pass, msg) => (pass ? ok.push(`  ✓ ${msg}`) : fail.push(msg));
const readJson = path => JSON.parse(readFileSync(path, "utf8"));

const module = readJson("module.json");
const lang = readJson("lang/en.json");
const ui = lang.GHOSTWIRE?.Summons?.Machines?.UI ?? {};

console.log("Rigger vertical smoke (0.3.106)\n");

note(atLeast(module.version, "0.3.106"), `module.json ≥ 0.3.106 (got ${module.version})`);
note(existsSync("scripts/machine-sheet.mjs"), "scripts/machine-sheet.mjs present");
note(existsSync("scripts/rigger-vertical.mjs"), "scripts/rigger-vertical.mjs present");
note(existsSync("templates/machine-sheet.hbs"), "templates/machine-sheet.hbs present");

const moduleSrc = readFileSync("scripts/module.mjs", "utf8");
note(moduleSrc.includes("registerRiggerVertical"), "module.mjs registers Rigger vertical");
note(moduleSrc.includes("registerMachineSheet"), "module.mjs registers Machine sheet");

const machinesSrc = readFileSync("scripts/machines.mjs", "utf8");
note(machinesSrc.includes("FleetFull"), "deployMachine refuses at Fleet Size");
note(machinesSrc.includes("jumpInCapable"), "deployMachine stamps jumpInCapable");
note(machinesSrc.includes("baseAsset"), "machineBand recognizes baseAsset");

const sheetSrc = readFileSync("scripts/machine-sheet.mjs", "utf8");
const sheetHbs = readFileSync("templates/machine-sheet.hbs", "utf8");
const css = readFileSync("styles/ghostwire.css", "utf8");

note(sheetHbs.includes("Description"), "Machine sheet template has Description");
note(sheetHbs.includes("Notes") || sheetHbs.includes("biography.director"), "Machine sheet template has Notes");
note(sheetHbs.includes("editImage") || sheetHbs.includes("profile"), "Machine sheet template has portrait control");

for (const key of ["FleetFull", "FleetStatus", "JumpIn", "Description", "Notes", "HomeGround", "Beacon",
  "Portrait", "TokenArt", "TokenArtHint", "SaveChanges"]) {
  note(!!ui[key], `lang UI.${key}`);
}

/* ------------------------------------------------------------------ */
/*  0.3.106 — Machine sheet tabs                                       */
/* ------------------------------------------------------------------ */
// ApplicationV2 routes data-action="tab" to its own _onClickTab before consulting options.actions,
// so a custom `tab` action can never fire. The sheet must ride the core tab group instead.
const TAB_IDS = ["combat", "control", "build", "inventory", "links", "story"];

note(/static TABS\s*=/.test(sheetSrc), "Machine sheet declares static TABS (core tab group)");
note(!/actions:[\s\S]{0,400}?\btab:/.test(sheetSrc), "Machine sheet does NOT register a custom `tab` action");
note(!sheetSrc.includes("#tab ="), "Machine sheet no longer tracks its own #tab field");
note(/data-group="primary"/.test(sheetHbs), "template tabs carry data-group");
note(/<nav[^>]*class="[^"]*\btabs\b/.test(sheetHbs), "template nav has the core `tabs` class");
for (const id of TAB_IDS) {
  note(new RegExp(`class="tab [^"]*"[^>]*data-group="primary" data-tab="${id}"`).test(sheetHbs),
    `tab panel rendered for "${id}"`);
  note(new RegExp(`data-action="tab"[^>]*data-tab="{{t.id}}"`).test(sheetHbs) || sheetHbs.includes(`data-tab="${id}"`),
    `tab control present for "${id}"`);
}
note(!/<a[^>]*data-action="tab"/.test(sheetHbs), "tab controls are buttons, not bare anchors");
note(css.includes("section.gw-m-tab.active"), "CSS shows the active tab panel");

/* ------------------------------------------------------------------ */
/*  0.3.106 — Save path                                                */
/* ------------------------------------------------------------------ */
// DocumentSheetV2 hands _processSubmitData an already-expanded object; reading formData.object there
// is what threw "cannot read properties of undefined (reading 'flags')".
note(!sheetSrc.includes("expandObject(formData.object)"), "Machine sheet does not re-expand formData.object");
note(sheetSrc.includes("_processFormData"), "Machine sheet massages submit data in _processFormData");
note(!/_processSubmitData\s*\(/.test(sheetSrc), "Machine sheet leaves _processSubmitData to core");

/* ------------------------------------------------------------------ */
/*  0.3.106 — Default sheet for machines                               */
/* ------------------------------------------------------------------ */
// The Draw Steel NPC sheet extends DocumentSheetV2, not ActorSheetV2, so renderActorSheetV2 never fired.
const SHEET_ID = `${MODULE_ID}.GhostwireMachineSheet`;
note(sheetSrc.includes("MACHINE_SHEET_ID"), "machine-sheet.mjs exports a sheet id constant");
note(sheetSrc.includes("GhostwireMachineSheet"), `sheet id resolves to ${SHEET_ID}`);
note(machinesSrc.includes("`${MODULE_ID}.GhostwireMachineSheet`"), "machines.mjs mirrors the same sheet id");
note(machinesSrc.includes('"flags.core.sheetClass": MACHINE_SHEET_ID'),
  "deployMachine stamps flags.core.sheetClass on the new machine Actor");
note(sheetSrc.includes('setFlag("core", "sheetClass"'), "sheet preference is stamped per Actor");
note(sheetSrc.includes("renderDocumentSheetV2"), "redirect hooks a hook that actually fires in v14");
note(!sheetSrc.includes('Hooks.on("renderActorSheetV2"'), "dead renderActorSheetV2 redirect removed");

/* ------------------------------------------------------------------ */
/*  0.3.106 — Fleet Size, executed for real                            */
/* ------------------------------------------------------------------ */
// machines.mjs only touches Foundry globals inside function bodies, so it imports under stubs.
class FakeActor {
  constructor({ name = "Rigger", level = 1, dsids = [], machines = [] } = {}) {
    this.name = name;
    this.system = { level };
    this.items = [
      ...dsids.map(dsid => new FakeItem({ dsid, parent: this })),
      ...machines.map(m => new FakeItem({ ...m, parent: this })),
    ];
  }
}
class FakeItem {
  constructor({ dsid = null, vehicle = null, deployedUuid = null, parent = null, ownerUuid = null, id = null, name = "", mod = null } = {}) {
    this.id = id;
    this.name = name;
    this.uuid = id ? `Item.${id}` : null;
    this.system = { _dsid: dsid };
    this.parent = parent;
    this._flags = {};
    if (vehicle) this._flags.vehicle = vehicle;
    if (deployedUuid) this._flags.deployed = { actorUuid: deployedUuid };
    if (ownerUuid) this._flags.ownerUuid = ownerUuid;
    if (mod) this._flags.mod = mod;
  }
  getFlag(scope, key) {
    return scope === MODULE_ID ? this._flags[key] : undefined;
  }
  toObject() {
    return {
      name: this.name,
      type: "treasure",
      system: { ...this.system },
      effects: [],
      flags: { [MODULE_ID]: structuredClone(this._flags) },
    };
  }
}

globalThis.Actor = FakeActor;
globalThis.game = { actors: new Map() };
globalThis.CONFIG = {};
globalThis.Hooks = { on() {}, once() {} };
globalThis.ui = { notifications: { warn() {}, info() {}, error() {} } };
globalThis.fromUuidSync = uuid => globalThis.game.actors.get(String(uuid).replace(/^Actor\./, "")) ?? null;
globalThis.foundry = { utils: { getProperty: () => undefined, setProperty: () => {} } };

const {
  fleetSizeCap, fieldedMachineCount, isMachineFielded, machineOwner,
  applyMachineTokenDefaults, actorBloodsplatUpdate, tokenBloodsplatUpdate,
  describeWeaponryKit, machineModSheetFields, machineModMirrorData, kitProfile,
  isJumpInCapable, chassisJumpInCapable, droneJumpInSourceUpdate,
  fleetIdleWirePlan,
} = await import("../scripts/machines.mjs");
const { jumpInCandidates, jumpInUsePlan, jumpInDenialKey } = await import("../scripts/rigger-vertical.mjs");
const { jumpedInBlocksAbility } = await import("../scripts/wired-state.mjs");

const drone = (deployedUuid = null) => ({ vehicle: { drone: true, scale: "" }, deployedUuid });

note(fleetSizeCap(new FakeActor({ level: 1 })) === 1, "Fleet cap 1 at L1");
note(fleetSizeCap(new FakeActor({ level: 4 })) === 2, "Fleet cap 2 at L4");
note(fleetSizeCap(new FakeActor({ level: 7 })) === 3, "Fleet cap 3 at L7");
note(fleetSizeCap(new FakeActor({ level: 10 })) === 4, "Fleet cap 4 at L10");
note(fleetSizeCap(new FakeActor({ level: 1, dsids: ["wide-band"] })) === 2, "Wide Band adds +1 (L1 Drone Jockey => 2)");
// Wide Band, Redoubled only drops the distance requirement on the whole-swarm Command — no extra cap.
note(fleetSizeCap(new FakeActor({ level: 1, dsids: ["wide-band", "wide-band-redoubled"] })) === 2,
  "Wide Band, Redoubled adds no further cap");
note(!machinesSrc.includes('ids.has("wide-band-redoubled")'), "invented Redoubled cap boost removed");
note(fleetSizeCap(new FakeActor({ level: 7, dsids: ["wide-band", "endless-swarm"] })) === 6,
  "Endless Swarm +2 on L7 Wide Band (3+1+2 => 6)");

// Counting is by the `deployed` flag, not by a successful UUID resolve.
globalThis.game.actors = new Map([["alive1", {}], ["alive2", {}], ["alive3", {}]]);
const fleeted = new FakeActor({
  level: 1,
  machines: [drone("Actor.alive1"), drone("Actor.alive2"), drone("Actor.alive3"), drone(null)],
});
note(fieldedMachineCount(fleeted) === 3, "fieldedMachineCount counts the three fielded drones");
note(fieldedMachineCount(fleeted) >= fleetSizeCap(fleeted), "L1 rigger at or over fleetSizeCap (Deploy refuses)");

// A UUID this client cannot resolve must still count — under-counting waved refused Deploys through.
globalThis.fromUuidSync = () => null;
const unresolvable = new FakeActor({ level: 1, machines: [drone("Compendium.x.Actor.abc"), drone("Actor.alive1")] });
note(fieldedMachineCount(unresolvable) === 2, "unresolvable deployed UUIDs still count against the fleet");
note(isMachineFielded(new FakeItem({ vehicle: { drone: true }, deployedUuid: "Actor.gone" })) === false,
  "a world Actor known to be gone does not count");

// The refuse must find an owner however Deploy was triggered.
const owner = new FakeActor({ level: 1 });
note(machineOwner(new FakeItem({ vehicle: { drone: true }, parent: owner })) === owner, "owner from item.parent");
note(machineOwner(new FakeItem({ vehicle: { drone: true } }), owner) === owner, "owner from explicit argument");
globalThis.game.actors = new Map([["own1", owner]]);
globalThis.fromUuidSync = uuid => globalThis.game.actors.get(String(uuid).replace(/^Actor\./, "")) ?? null;
note(machineOwner(new FakeItem({ vehicle: { drone: true }, ownerUuid: "Actor.own1" })) === owner,
  "owner from flags.ownerUuid when the Item is unbound");
note(machinesSrc.includes("machineOwner(item, ownerOverride)"), "deployMachine resolves the fleet owner through machineOwner");

/* ------------------------------------------------------------------ */
/*  0.3.105 — base assets                                              */
/* ------------------------------------------------------------------ */
const baseDir = "src/packs/vehicles/base-assets";
note(existsSync(baseDir), "vehicles/base-assets folder exists");
const baseFiles = existsSync(baseDir)
  ? readdirSync(baseDir).filter(f => f.endsWith(".json") && f !== "_folder.json")
  : [];
note(baseFiles.length >= 7, `base-asset Items ≥ 7 (got ${baseFiles.length})`);
for (const need of ["door-lock.json", "safehouse-beacon.json", "camera-sensor-mast.json"]) {
  note(baseFiles.includes(need), `Item ${need}`);
}

const actors = readdirSync("src/packs/summons/machines").filter(f => f.startsWith("machine-base-"));
note(actors.length >= 7, `base-asset Actor templates ≥ 7 (got ${actors.length})`);

// Spot-check Safehouse Beacon flags
if (existsSync(join(baseDir, "safehouse-beacon.json"))) {
  const beacon = readJson(join(baseDir, "safehouse-beacon.json"));
  const v = beacon.flags?.[MODULE_ID]?.vehicle ?? {};
  note(!!v.beacon || !!v.homeGround, "Safehouse Beacon marked beacon/homeGround");
  note(Number(v.integrity ?? v.stamina) > 0, "Safehouse Beacon has Integrity");
  note(Number(v.price) > 0, "Safehouse Beacon has ¥");
}

/* ------------------------------------------------------------------ */
/*  0.3.109 — Scorch Marks on machine tokens                           */
/* ------------------------------------------------------------------ */
note(atLeast(module.version, "0.3.109"), `module.json ≥ 0.3.109 (got ${module.version})`);
note(machinesSrc.includes("applyMachineTokenDefaults(data.prototypeToken"), "Deploy stamps Scorch on the new Actor prototype");
note(machinesSrc.includes("applyMachineTokenDefaults(tokenData)"), "Deploy stamps Scorch on the placed token");
note(machinesSrc.includes("MACHINE_BLOODSPLAT_TYPE"), "Deploy forces bloodsplat-type scorch beside the token-size update");
note(!JSON.stringify(module.relationships ?? {}).includes("monks-bloodsplats"), "monks-bloodsplats is not a hard dependency");

const kept = applyMachineTokenDefaults({
  flags: {
    "monks-bloodsplats": { "bloodsplat-colour": "#ff00aa", "bloodsplat-size": 2, "bloodsplat-type": "blood" },
    "draw-steel-ghostwire": { kind: "vehicle" },
  },
});
note(kept.flags["monks-bloodsplats"]["bloodsplat-type"] === "scorch", "applyMachineTokenDefaults forces scorch");
note(kept.flags["monks-bloodsplats"]["bloodsplat-colour"] === "#ff00aa", "existing bloodsplat colour is kept");
note(kept.flags["monks-bloodsplats"]["bloodsplat-size"] === 2, "existing bloodsplat size is kept");
note(kept.flags["draw-steel-ghostwire"].kind === "vehicle", "other flag scopes are kept");
const merged = [];
globalThis.foundry.utils.mergeObject = (target, patch) => {
  merged.push(patch);
  target.flags = {
    ...(target.flags ?? {}),
    "monks-bloodsplats": {
      ...(target.flags?.["monks-bloodsplats"] ?? {}),
      ...(patch.flags?.["monks-bloodsplats"] ?? {}),
    },
  };
  return target;
};
const viaMerge = applyMachineTokenDefaults({
  flags: { "monks-bloodsplats": { "bloodsplat-index": 3, "bloodsplat-type": "blood" } },
});
note(merged.length === 1, "applyMachineTokenDefaults uses foundry.utils.mergeObject when present");
note(viaMerge.flags["monks-bloodsplats"]["bloodsplat-type"] === "scorch"
  && viaMerge.flags["monks-bloodsplats"]["bloodsplat-index"] === 3,
  "mergeObject path keeps index and sets scorch");
delete globalThis.foundry.utils.mergeObject;

const scorchKey = "prototypeToken.flags.monks-bloodsplats.bloodsplat-type";
const droneActor = { flags: { [MODULE_ID]: { kind: "drone" } }, prototypeToken: { flags: {} } };
const vehicleActor = { flags: { [MODULE_ID]: { kind: "vehicle" } }, prototypeToken: { flags: {} } };
const baseActor = { flags: { [MODULE_ID]: { machine: { kind: "baseAsset" } } }, prototypeToken: { flags: {} } };
const hero = { type: "hero", flags: {}, prototypeToken: { flags: {} } };
const punk = { type: "npc", flags: { [MODULE_ID]: { kind: "rival" } }, prototypeToken: { flags: {} } };
note(actorBloodsplatUpdate(droneActor)?.[scorchKey] === "scorch", "drone prototype patch is scorch");
note(actorBloodsplatUpdate(vehicleActor)?.[scorchKey] === "scorch", "vehicle prototype patch is scorch");
note(actorBloodsplatUpdate(baseActor)?.[scorchKey] === "scorch", "baseAsset prototype patch is scorch");
note(actorBloodsplatUpdate(hero) === null, "hero bloodsplat is left alone");
note(actorBloodsplatUpdate(punk) === null, "living NPC bloodsplat is left alone");
note(actorBloodsplatUpdate({
  flags: { [MODULE_ID]: { kind: "drone" } },
  prototypeToken: { flags: { "monks-bloodsplats": { "bloodsplat-type": "scorch", "bloodsplat-colour": "#111" } } },
}) === null, "already-scorch drone is a no-op");
note(tokenBloodsplatUpdate({ flags: {} }, droneActor)?.["flags.monks-bloodsplats.bloodsplat-type"] === "scorch",
  "placed drone token patch is scorch");
note(tokenBloodsplatUpdate({ flags: { "monks-bloodsplats": { "bloodsplat-colour": "#111" } } }, vehicleActor)
  ?.["flags.monks-bloodsplats.bloodsplat-type"] === "scorch", "placed vehicle token patch sets type only");
note(tokenBloodsplatUpdate({ flags: {} }, hero) === null, "placed hero token is left alone");

const walk = (dir, out = []) => {
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, name.name);
    if (name.isDirectory()) walk(path, out);
    else if (name.name.endsWith(".json") && name.name !== "_folder.json") out.push(path);
  }
  return out;
};
const machineKinds = new Set(["drone", "vehicle", "baseAsset"]);
let machineActors = 0;
let machineMiss = 0;
let otherActors = 0;
let otherScorch = 0;
for (const file of walk("src/packs")) {
  const doc = readJson(file);
  if (doc.type !== "npc" && doc.type !== "hero") continue;
  const kind = doc.flags?.[MODULE_ID]?.kind ?? doc.flags?.[MODULE_ID]?.machine?.kind ?? null;
  const type = doc.prototypeToken?.flags?.["monks-bloodsplats"]?.["bloodsplat-type"];
  if (machineKinds.has(kind)) {
    machineActors += 1;
    if (type !== "scorch") {
      machineMiss += 1;
      note(false, `${file} prototype is Scorch Marks`);
    }
  } else {
    otherActors += 1;
    if (type === "scorch") {
      otherScorch += 1;
      note(false, `${file} is not a machine and stays off Scorch`);
    }
  }
}
note(machineActors >= 25 && machineMiss === 0, `machine Actor prototypes stamped (got ${machineActors}, missing ${machineMiss})`);
note(otherActors > 10 && otherScorch === 0, `non-machine Actor prototypes are not Scorch (checked ${otherActors})`);

/* ------------------------------------------------------------------ */
/*  0.3.110 — Hardpoint mods on the Machine sheet + install chat       */
/* ------------------------------------------------------------------ */
note(atLeast(module.version, "0.3.110"), `module.json ≥ 0.3.110 (got ${module.version})`);
const modsSrc = readFileSync("scripts/mods.mjs", "utf8");
note(modsSrc.includes("ghostwire-mod-install-chat"), "successful mod install posts a chat card");
note(modsSrc.includes("announceModInstalled"), "install announcement names actor, mod, and host");
note(modsSrc.includes("if (!isMagazine(mod)) await announceModInstalled"), "payload magazines keep their own Load card");
note(modsSrc.includes("standardContentChatData"), "install chat goes through the Draw Steel content-part helper");
const installChat = standardContentChatData({
  speaker: { alias: "Hex" },
  content: "<div class=\"ghostwire-mod-install-chat\">installed</div>",
  style: 0,
});
note(installChat.type === "standard" && installChat.style === 0, "install chat is a standard OTHER message");
note(installChat.system?.parts?.[0]?.type === "content" && installChat.content.includes("ghostwire-mod-install-chat"),
  "install chat carries a content part so Draw Steel will render it");
note(atLeast(module.version, "0.3.111"), `module.json ≥ 0.3.111 (got ${module.version})`);
note(css.includes("ghostwire-mod-install-chat"), "install chat card has Ghostwire chat styling");
for (const key of ["ChatTitle", "ChatBody", "ChatSlots", "ChatFielded"]) {
  note(typeof lang.GHOSTWIRE?.Mods?.Install?.[key] === "string", `lang Mods.Install.${key}`);
}
note(lang.GHOSTWIRE.Mods.Install.ChatBody.includes("{actor}") && lang.GHOSTWIRE.Mods.Install.ChatBody.includes("{mod}")
  && lang.GHOSTWIRE.Mods.Install.ChatBody.includes("{host}"), "install chat names who, the mod, and the host");
note(ui.ModOff === "off", "lang UI.ModOff");

const weaponryDsids = ["gun-rack", "twin-mount", "turret-ring", "heavy-hardpoint"];
for (const dsid of weaponryDsids) {
  const line = describeWeaponryKit({ name: dsid, system: { _dsid: dsid }, flags: { [MODULE_ID]: { mod: { exclusiveKit: "weaponry" } } } });
  note(line.length > 0 && line.includes("Gunnery"), `${dsid} describes a Gunnery hardpoint (${line})`);
  note(kitProfile(dsid)?.kind === "weaponry", `${dsid} is a weaponry profile`);
}
const heavyLine = describeWeaponryKit({
  name: "Heavy Hardpoint", system: { _dsid: "heavy-hardpoint" },
  flags: { [MODULE_ID]: { mod: { exclusiveKit: "weaponry" } } },
});
note(heavyLine.includes("Heavy Hardpoint") && heavyLine.includes("heavy") && heavyLine.includes("integrated"),
  `Heavy Hardpoint line names the kit (${heavyLine})`);
note(describeWeaponryKit({ name: "Scrap-Weld", system: { _dsid: "scrap-weld" }, flags: { [MODULE_ID]: { mod: { exclusiveKit: "armor" } } } }) === "",
  "armor kits do not take the hardpoints line");

const wrench = new FakeActor({ name: "Wrench" });
const bulldog = new FakeItem({
  id: "bull", name: "Bulldog", dsid: "bulldog", parent: wrench,
  vehicle: { drone: false, domain: "Ground", scale: "Vehicle", hardpoints: "pintle" },
});
const heavy = new FakeItem({
  id: "hh", name: "Heavy Hardpoint", dsid: "heavy-hardpoint", parent: wrench,
  mod: { installedOn: "bull", active: true, exclusiveKit: "weaponry" },
});
const plate = new FakeItem({
  id: "sw", name: "Scrap-Weld", dsid: "scrap-weld", parent: wrench,
  mod: { installedOn: "bull", active: true, exclusiveKit: "armor", staminaBonus: 6 },
});
wrench.items.push(bulldog, heavy, plate);
const stamped = machineModSheetFields(bulldog);
note(stamped.hardpoints.includes("pintle") && stamped.hardpoints.includes("Heavy Hardpoint"),
  `Build hardpoints keeps the factory mount and the kit (${stamped.hardpoints})`);
note(stamped.installedModsText.includes("Heavy Hardpoint") && stamped.installedModsText.includes("Scrap-Weld"),
  "Installed mods lists the hardpoint and the armor kit");

heavy._flags.mod.active = false;
const toggled = machineModSheetFields(bulldog);
note(!toggled.hardpoints.includes("Heavy Hardpoint") && toggled.hardpoints.includes("pintle"),
  "a switched-off hardpoint leaves the factory mount and drops the kit line");
note(toggled.installedModsText.includes("Heavy Hardpoint") && toggled.installedModsText.includes("(off)"),
  "a switched-off hardpoint stays in the installed-mods list");
heavy._flags.mod.active = true;

const mirror = machineModMirrorData(heavy);
note(mirror.flags[MODULE_ID].machineModMirror === "Item.hh", "mirror records the hero mod uuid");
note(mirror.flags[MODULE_ID].mod.installedOn === null, "mirror does not copy the hero installedOn id");
note(mirror.name === "Heavy Hardpoint" && !mirror._id, "mirror is a nameless-id copy of the hardpoint Item");
note(heavy.getFlag(MODULE_ID, "mod").installedOn === "bull", "building a mirror does not uninstall the hero mod");

/* ------------------------------------------------------------------ */
/*  0.3.110 — Drones are always Jump-In capable                        */
/* ------------------------------------------------------------------ */
const gw = kind => ({ flags: { [MODULE_ID]: kind } });
note(isJumpInCapable(gw({ kind: "drone" })) === true, "a drone with no Jump-In flag is capable");
note(isJumpInCapable(gw({ kind: "drone", machine: { jumpInCapable: false } })) === true, "a drone stays capable if the flag is off");
note(isJumpInCapable(gw({ kind: "vehicle" })) === false, "a vehicle without the flag is not Jump-In capable");
note(isJumpInCapable(gw({ kind: "baseAsset", machine: { jumpInCapable: false } })) === false, "a base asset is not forced Jump-In capable");
note(isJumpInCapable(gw({ kind: "vehicle", machine: { jumpInCapable: true } })) === true, "a vehicle flag still grants Jump-In");
note(isJumpInCapable({ ...gw({ kind: "vehicle" }), items: [{ system: { _dsid: "rigger-cocoon" } }] }) === true,
  "Rigger Cocoon still grants Jump-In on a vehicle");
note(chassisJumpInCapable({ drone: true }) === true, "Deploy treats a drone chassis as Jump-In capable");
note(chassisJumpInCapable({ drone: true, jumpInCapable: false }) === true, "a drone chassis cannot opt out of Jump-In");
note(chassisJumpInCapable({ drone: false, scale: "Vehicle" }) === false, "Deploy does not force Jump-In on a vehicle chassis");
note(chassisJumpInCapable({ baseAsset: "door-lock", jumpInCapable: false }) === false, "Deploy does not force Jump-In on a base asset");
note(chassisJumpInCapable({ baseAsset: "safehouse-beacon", jumpInCapable: true }) === true, "a beacon keeps its own Jump-In flag");
note(chassisJumpInCapable({ jumpInCapable: true }) === true, "a vehicle chassis flag still stamps Jump-In");
note(chassisJumpInCapable({}, { cocoon: true }) === true, "Rigger Cocoon still stamps Jump-In on Deploy");
const droneCreate = droneJumpInSourceUpdate(gw({ kind: "drone" }));
note(droneCreate?.[`flags.${MODULE_ID}.machine.jumpInCapable`] === true, "create hook stamps Jump-In on a new drone");
note(droneJumpInSourceUpdate(gw({ kind: "drone", machine: { jumpInCapable: true } })) === null, "create hook leaves an already-capable drone alone");
note(droneJumpInSourceUpdate(gw({ kind: "vehicle" })) === null, "create hook does not stamp vehicles");
note(droneJumpInSourceUpdate(gw({ kind: "baseAsset", machine: { jumpInCapable: false } })) === null, "create hook does not stamp base assets");
for (const file of ["machine-drone-micro.json", "machine-drone-small.json", "machine-drone-medium.json", "mule-bot.json"]) {
  const doc = readJson(`src/packs/summons/machines/${file}`);
  note(doc.flags[MODULE_ID].kind === "drone" && doc.flags[MODULE_ID].machine?.jumpInCapable === true,
    `${file} prototype is Jump-In capable`);
}
const carProto = readJson("src/packs/summons/machines/machine-vehicle-car.json");
note(carProto.flags[MODULE_ID].kind === "vehicle" && carProto.flags[MODULE_ID].machine?.jumpInCapable !== true,
  "vehicle prototype is not forced Jump-In capable");
const doorProto = readJson("src/packs/summons/machines/machine-base-door-lock.json");
note(doorProto.flags[MODULE_ID].machine?.jumpInCapable === false, "Door Lock prototype stays not Jump-In capable");
const riggerSrc = readFileSync("scripts/rigger-vertical.mjs", "utf8");
note(riggerSrc.includes("isJumpInCapable(machineActor)"), "jumpIn uses the drone gate");
note(riggerSrc.includes("jump-in-signature-platform"), "signature Jump-In ability is intercepted before its power roll");
note(riggerSrc.includes('picked?.action === "jumpIn"') && riggerSrc.includes("return null"),
  "Deploy & Command Jump-In does not fall through into the power roll");
const machineActor = (id, name, kind, machine = {}, items = []) => ({
  id, name, items,
  flags: { [MODULE_ID]: { kind, machine } },
});
const plainBulldog = machineActor("bull", "Bulldog", "vehicle", { jumpInCapable: false });
const flaggedBulldog = machineActor("flag", "Bulldog", "vehicle", { jumpInCapable: true });
const cocoonBulldog = machineActor("cocoon", "Bulldog", "vehicle", {}, [{ system: { _dsid: "rigger-cocoon" } }]);
const rotor = machineActor("rot", "Rotor", "drone", {});
const meatHero = machineActor("hex", "Hex", "hero");
const incapablePlan = jumpInUsePlan(jumpInCandidates({ fielded: [plainBulldog] }), { capable: isJumpInCapable });
note(incapablePlan.reason === "incapable" && jumpInDenialKey(incapablePlan) === "JumpInNotCapable",
  "a lone non-capable Bulldog is denied before any roll");
const targetedPlan = jumpInUsePlan(jumpInCandidates({ targets: [plainBulldog], fielded: [rotor] }), { capable: isJumpInCapable });
note(targetedPlan.machine?.id === "bull" && jumpInDenialKey(targetedPlan) === "JumpInNotCapable",
  "a targeted Bulldog is the Jump-In target even when a drone is also fielded");
const heroTargetPlan = jumpInUsePlan(jumpInCandidates({ targets: [meatHero], fielded: [plainBulldog] }), { capable: isJumpInCapable });
note(heroTargetPlan.machine?.id === "bull" && heroTargetPlan.reason === "incapable",
  "a targeted hero falls through to the fielded Bulldog");
const dronePlan = jumpInUsePlan(jumpInCandidates({ targets: [rotor] }), { capable: isJumpInCapable });
note(dronePlan.proceed === true && jumpInDenialKey(dronePlan) === null, "a drone Jump-In is allowed");
const flagPlan = jumpInUsePlan(jumpInCandidates({ fielded: [flaggedBulldog] }), { capable: isJumpInCapable });
note(flagPlan.proceed === true, "a flagged vehicle Jump-In is allowed");
const cocoonPlan = jumpInUsePlan(jumpInCandidates({ fielded: [cocoonBulldog] }), { capable: isJumpInCapable });
note(cocoonPlan.proceed === true, "a Rigger Cocoon vehicle Jump-In is allowed");
const manyPlan = jumpInUsePlan(jumpInCandidates({ fielded: [plainBulldog, rotor] }), { capable: isJumpInCapable });
note(manyPlan.reason === "many" && jumpInDenialKey(manyPlan) === "JumpInPickOne",
  "two fielded machines ask for a target instead of rolling");
const nonePlan = jumpInUsePlan(jumpInCandidates({}), { capable: isJumpInCapable });
note(nonePlan.reason === "none" && jumpInDenialKey(nonePlan) === "JumpInNoTarget", "no machine refuses Jump-In");
note(ui.JumpInNotCapable?.includes("{name}"), "lang JumpInNotCapable names the machine");
note(typeof ui.JumpInNoTarget === "string" && typeof ui.JumpInPickOne === "string", "lang JumpInNoTarget and JumpInPickOne");
note(!jumpedInBlocksAbility({ state: "jackedIn", dsid: "deploy-and-command", rollEnabled: true }),
  "Deploy & Command is not a meat lock while Jacked In");
note(!jumpedInBlocksAbility({ state: "jackedIn", dsid: "rigged-fire", rollEnabled: true }),
  "Rigged Fire is not a meat lock while Jacked In");
note(!jumpedInBlocksAbility({ state: "jackedIn", dsid: "field-repair", rollEnabled: true }),
  "Field Repair is not a meat lock while Jacked In");
note(jumpedInBlocksAbility({ state: "jackedIn", dsid: "scrap-bow", rollEnabled: true }),
  "a personal weapon stays blocked while Jacked In");
note(moduleSrc.includes("jumpedInBlocksAbility"), "Jacked In use patch consults the seat allowlist");
const idleJacked = fleetIdleWirePlan({ fielded: 0, state: "jackedIn", jumpedIn: true });
note(idleJacked.jumpOut && idleJacked.linked, "empty fleet clears Jump-In and returns to Linked");
note(!fleetIdleWirePlan({ fielded: 0, state: "linked" }).linked
  && !fleetIdleWirePlan({ fielded: 0, state: "linked" }).jumpOut, "already Linked stays Linked");
note(!fleetIdleWirePlan({ fielded: 0, state: "overlay" }).linked, "Overlay is not forced to Linked");
note(!fleetIdleWirePlan({ fielded: 0, state: "disconnected" }).linked, "a pure-meat hero is not forced onto the wire");
note(fleetIdleWirePlan({ fielded: 1, state: "jackedIn", jumpedIn: true }).jumpOut === false, "a remaining fielded machine does not Jump-Out");
note(fleetIdleWirePlan({ fielded: 0, state: "disconnected", fleetLinked: true }).linked, "fleet-command with the status missing still returns to Linked");
note(machinesSrc.includes("fleetIdleWirePlan"), "Recall and Actor delete share the empty-fleet wire plan");
note(!machinesSrc.includes("WIRED_STATUS_DEFS.linked.id, { active: false }"), "Recall no longer clears Linked");
note(sheetSrc.includes('machineKindOf(actor) === "drone"'), "Machine sheet shows drones as Jump-In capable");
note(machinesSrc.includes("migrateDroneJumpIn"), "ready pass stores Jump-In on world drones");

note(machinesSrc.includes("syncMachineModMirrors"), "syncMachineMods embeds installed mods on the machine Actor");
note(machinesSrc.includes("machineModSheetFields(item)"), "Deploy stamp reuses the kit hardpoints line");
note(!machinesSrc.includes('installedModsText: ""'), "Deploy no longer blanks Installed mods");

console.log(ok.join("\n"));
if (fail.length) {
  console.error("\nFAILED:");
  for (const f of fail) console.error("  ✗", f);
  process.exit(1);
}
console.log("\npassed");
