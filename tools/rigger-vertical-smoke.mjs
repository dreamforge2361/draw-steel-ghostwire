#!/usr/bin/env node
/**
 * Rigger vertical — static smoke (no live Foundry).
 * 0.3.105: sheet/template/base-asset shape.
 * 0.3.106: Machine sheet tabs, Save path, sheet preference, and live Fleet Size arithmetic.
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
  constructor({ dsid = null, vehicle = null, deployedUuid = null, parent = null, ownerUuid = null } = {}) {
    this.system = { _dsid: dsid };
    this.parent = parent;
    this._flags = {};
    if (vehicle) this._flags.vehicle = vehicle;
    if (deployedUuid) this._flags.deployed = { actorUuid: deployedUuid };
    if (ownerUuid) this._flags.ownerUuid = ownerUuid;
  }
  getFlag(scope, key) {
    return scope === MODULE_ID ? this._flags[key] : undefined;
  }
}

globalThis.Actor = FakeActor;
globalThis.game = { actors: new Map() };
globalThis.CONFIG = {};
globalThis.Hooks = { on() {}, once() {} };
globalThis.ui = { notifications: { warn() {}, info() {}, error() {} } };
globalThis.fromUuidSync = uuid => globalThis.game.actors.get(String(uuid).replace(/^Actor\./, "")) ?? null;
globalThis.foundry = { utils: { getProperty: () => undefined, setProperty: () => {} } };

const { fleetSizeCap, fieldedMachineCount, isMachineFielded, machineOwner } = await import("../scripts/machines.mjs");

const drone = (deployedUuid = null) => ({ vehicle: { drone: true, scale: "" }, deployedUuid });

note(fleetSizeCap(new FakeActor({ level: 1 })) === 3, "Fleet cap 3 at L1");
note(fleetSizeCap(new FakeActor({ level: 4 })) === 4, "Fleet cap 4 at L4");
note(fleetSizeCap(new FakeActor({ level: 7 })) === 5, "Fleet cap 5 at L7");
note(fleetSizeCap(new FakeActor({ level: 10 })) === 6, "Fleet cap 6 at L10");
note(fleetSizeCap(new FakeActor({ level: 1, dsids: ["wide-band"] })) === 5, "Wide Band adds +2 (L1 Drone Jockey → 5)");
// Wide Band, Redoubled only drops the distance requirement on the whole-swarm Command — no extra cap.
note(fleetSizeCap(new FakeActor({ level: 1, dsids: ["wide-band", "wide-band-redoubled"] })) === 5,
  "Wide Band, Redoubled adds no further cap");
note(!machinesSrc.includes('ids.has("wide-band-redoubled")'), "invented Redoubled cap boost removed");

// Counting is by the `deployed` flag, not by a successful UUID resolve.
globalThis.game.actors = new Map([["alive1", {}], ["alive2", {}], ["alive3", {}]]);
const fleeted = new FakeActor({
  level: 1,
  machines: [drone("Actor.alive1"), drone("Actor.alive2"), drone("Actor.alive3"), drone(null)],
});
note(fieldedMachineCount(fleeted) === 3, "fieldedMachineCount counts the three fielded drones");
note(fieldedMachineCount(fleeted) >= fleetSizeCap(fleeted), "L1 rigger with 3 out is at cap (Deploy refuses)");

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

console.log(ok.join("\n"));
if (fail.length) {
  console.error("\nFAILED:");
  for (const f of fail) console.error("  ✗", f);
  process.exit(1);
}
console.log("\npassed");
