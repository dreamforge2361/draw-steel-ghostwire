#!/usr/bin/env node
/**
 * 0.3.80 — Conglomerate service vehicles (AEQ / LAZ) dual Item + Actor.
 *
 * Run: node tools/service-vehicles-smoke.mjs
 * Does not need live Foundry. Does not write Scene JSON.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { listingsFromItems } from "../scripts/kiosk-presets.mjs";
import { actorHasKit, isMachineActor, isVehicleActor, isWireKit } from "../scripts/wired-kit.mjs";
import { itemIsConnectInterface } from "../scripts/wired-console-verbs.mjs";
import { MATRIX_VERB_DSIDS } from "../scripts/wired-verbs.mjs";
import { chassisStamina, machineBand } from "../scripts/machines.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const failures = [];
const ok = (cond, msg) => {
  if (!cond) failures.push(msg);
  else console.log(`  ✓ ${msg}`);
};

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function asItem(json) {
  return {
    system: json.system,
    getFlag: (mod, key) => (mod === MODULE_ID ? json.flags?.[mod]?.[key] : undefined),
  };
}

const SKUS = [
  {
    dsid: "seal-cruiser",
    name: "Seal Cruiser",
    lang: "SealCruiser",
    itemPath: "src/packs/vehicles/ground/seal-cruiser.json",
    actorPath: "src/packs/summons/machines/seal-cruiser.json",
    itemId: "gwSealCruiserItm",
    actorId: "gwSealCruiserAct",
    faction: "AEQ",
    factionName: "Aequitas Mandate",
    street: "Mandate cruiser",
    domain: "Ground",
    scale: "Vehicle",
    band: "vehicle-car",
    price: 1400,
    speedBand: "fast",
    hover: true,
    move: "walk",
    stamina: 40,
    tokenW: 2,
    tokenH: 3,
    tags: ["Patrol", "Pursuit", "Hover", "AEQ"],
  },
  {
    dsid: "writ-vtol",
    name: "Writ VTOL",
    lang: "WritVtol",
    itemPath: "src/packs/vehicles/air/writ-vtol.json",
    actorPath: "src/packs/summons/machines/writ-vtol.json",
    itemId: "gwWritVtolItem00",
    actorId: "gwWritVtolAct000",
    faction: "AEQ",
    factionName: "Aequitas Mandate",
    street: "Council badge air",
    domain: "Air",
    scale: "Vehicle",
    band: "vehicle-air",
    price: 2000,
    speedBand: "fast",
    hover: false,
    move: "fly",
    stamina: 40,
    tokenW: 2,
    tokenH: 4,
    tags: ["Patrol", "Insertion", "VTOL", "AEQ"],
  },
  {
    dsid: "white-door",
    name: "White Door",
    lang: "WhiteDoor",
    itemPath: "src/packs/vehicles/ground/white-door.json",
    actorPath: "src/packs/summons/machines/white-door.json",
    itemId: "gwWhiteDoorItm00",
    actorId: "gwWhiteDoorAct00",
    faction: "LAZ",
    factionName: "Lazarus Extract",
    street: "Laz ambulance",
    domain: "Ground",
    scale: "Vehicle",
    band: "vehicle-car",
    price: 1300,
    speedBand: "standard",
    hover: true,
    move: "walk",
    stamina: 40,
    tokenW: 2,
    tokenH: 4,
    tags: ["Medical", "Extraction", "Hover", "LAZ"],
  },
  {
    dsid: "crash-angel",
    name: "Crash Angel",
    lang: "CrashAngel",
    itemPath: "src/packs/vehicles/air/crash-angel.json",
    actorPath: "src/packs/summons/machines/crash-angel.json",
    itemId: "gwCrashAngelItm0",
    actorId: "gwCrashAngelAct0",
    faction: "LAZ",
    factionName: "Lazarus Extract",
    street: "Laz chopper",
    domain: "Air",
    scale: "Vehicle",
    band: "vehicle-air",
    price: 2200,
    speedBand: "fast",
    hover: false,
    move: "fly",
    stamina: 40,
    tokenW: 3,
    tokenH: 3,
    tags: ["Medical", "Extraction", "VTOL", "LAZ"],
  },
];

console.log("Conglomerate service vehicles smoke (0.3.80)\n");

const moduleJson = readJson("module.json");
ok(moduleJson.version === "0.3.80" || moduleJson.version >= "0.3.80", `module.json is ≥ 0.3.80 (got ${moduleJson.version})`);

const lang = readJson("lang/en.json");
const lane = readJson("src/packs/vehicles/ground/lane-hopper.json");
const vehicleSrc = [];
for (const file of readdirSync("src/packs/vehicles", { recursive: true }).filter(f => String(f).endsWith(".json") && !String(f).endsWith("_folder.json"))) {
  const rel = String(file).replaceAll("\\", "/");
  const data = readJson(join("src/packs/vehicles", rel));
  if (!data._id || data._key?.startsWith("!folders!")) continue;
  vehicleSrc.push({
    pack: "vehicles",
    path: rel.replace(/\.json$/, ""),
    id: data._id,
    uuid: `Compendium.draw-steel-ghostwire.vehicles.Item.${data._id}`,
    folder: data.folder,
    system: data.system,
    flags: data.flags,
    type: data.type,
    name: data.name,
  });
}
const kioskVehicles = listingsFromItems(vehicleSrc, "vehicles");
const kioskIds = new Set(kioskVehicles.map(r => r.uuid.split(".").pop()));

console.log("1) Four treasure Items + four named Actors");
for (const s of SKUS) {
  const item = readJson(s.itemPath);
  const actor = readJson(s.actorPath);
  const v = item.flags[MODULE_ID].vehicle;
  ok(item.type === "treasure", `${s.name} Item is treasure`);
  ok(item._id === s.itemId && item.system._dsid === s.dsid, `${s.name} Item id/dsid`);
  ok(item.img.endsWith(`vehicles/${s.dsid}.webp`), `${s.name} Item img is webp`);
  ok(v.drone === false, `${s.name} drone=false`);
  ok(v.domain === s.domain && v.scale === s.scale, `${s.name} domain/scale`);
  ok(v.echelon === 1 && v.availability === "professional" && v.price === s.price && v.modSlots === 2, `${s.name} E1 Professional ¥${s.price} / 2 slots`);
  ok(v.speedBand === s.speedBand, `${s.name} speedBand ${s.speedBand}`);
  ok(v.faction === s.faction, `${s.name} faction flag ${s.faction}`);
  ok(s.tags.every(t => v.tags.includes(t)), `${s.name} tags ${s.tags.join(", ")}`);
  ok(!v.tags.includes("Plot"), `${s.name} is not Plot`);
  ok(machineBand(asItem(item)) === s.band, `${s.name} Deploy band ${s.band}`);
  ok(chassisStamina(asItem(item)) === s.stamina, `${s.name} Deploy Stamina ${s.stamina}`);
  ok(kioskIds.has(s.itemId), `${s.name} is on the kiosk Vehicles shelf`);

  ok(actor.type === "npc" && actor._id === s.actorId, `${s.name} Actor is npc`);
  ok(actor.flags[MODULE_ID].kind === "vehicle" && actor.flags[MODULE_ID].dsid === s.dsid, `${s.name} Actor kind/dsid`);
  ok(actor.flags[MODULE_ID].band === s.band, `${s.name} Actor band ${s.band}`);
  ok(actor.flags[MODULE_ID].faction === s.faction, `${s.name} Actor faction ${s.faction}`);
  ok(actor.flags[MODULE_ID].gearItemUuid === `Compendium.${MODULE_ID}.vehicles.Item.${s.itemId}`, `${s.name} Actor UUID-links the Item`);
  ok(isVehicleActor(actor) && isMachineActor(actor), `${s.name} is a vehicle machine`);
  ok((actor.items ?? []).some(isWireKit) && actorHasKit(actor), `${s.name} Actor embeds Wire Kit`);
  ok(itemIsConnectInterface(actor.items.find(isWireKit)), `${s.name} Wire Kit is a Connect interface`);
  ok(!(actor.items ?? []).some(i => MATRIX_VERB_DSIDS.includes(i.system?._dsid)), `${s.name} has no Matrix Verbs`);
  ok(!actor.flags[MODULE_ID].wired?.state, `${s.name} starts Disconnected`);
  ok(actor.prototypeToken?.texture?.src?.endsWith(`vehicles/${s.dsid}.webp`), `${s.name} token texture`);
  ok(actor.prototypeToken?.width === s.tokenW && actor.prototypeToken?.height === s.tokenH, `${s.name} token ${s.tokenW}×${s.tokenH}`);
  ok(actor.system.movement.hover === s.hover, `${s.name} hover=${s.hover}`);
  ok(actor.system.movement.types.includes(s.move), `${s.name} movement ${s.move}`);
  ok(actor.system.stamina.max === s.stamina && actor.system.movement.value === (s.band === "vehicle-air" ? 14 : s.speedBand === "fast" ? 12 : 10), `${s.name} placeholder stamina/speed`);
  ok(existsSync(`assets/tokens/vehicles/${s.dsid}.png`) && existsSync(`assets/tokens/vehicles/${s.dsid}.webp`), `${s.name} png+webp on disk`);

  ok(lang.GHOSTWIRE.Vehicles.Items[s.lang].Name === s.name, `${s.name} Item lang Name`);
  ok(lang.GHOSTWIRE.Summons.Machines[s.lang].Name === s.name, `${s.name} Actor lang Name`);
  const itemDesc = lang.GHOSTWIRE.Vehicles.Items[s.lang].Description;
  const actorDesc = lang.GHOSTWIRE.Summons.Machines[s.lang].Description;
  ok(itemDesc.includes(s.factionName) && itemDesc.includes(s.faction), `${s.name} Item lang names ${s.factionName}`);
  ok(itemDesc.includes(s.street), `${s.name} Item lang street tag`);
  ok(actorDesc.includes(s.factionName) && actorDesc.includes("Deploy"), `${s.name} Actor lang names faction + Deploy`);
}

ok(lane.type === "treasure" && machineBand(asItem(lane)) === "vehicle-car", "Lane-Hopper still treasure → vehicle-car");
ok(!kioskIds.has("gwNoxTrashFrgt00"), "kiosk Vehicles still excludes Nox plot freighter");

console.log("2) Catalog / director / RAW");
const raw = readFileSync("docs/raw/23-machines.md", "utf8");
const vehCh = readFileSync("docs/rulebook/16-vehicles.md", "utf8");
const gear = readFileSync("docs/masters/GHOSTWIRE_GEAR_MASTER.md", "utf8");
const director = readFileSync("docs/manuscript/03-directors/27-running-ossian-reach.md", "utf8");
ok(/Inventory \(46 crewed platforms\)/.test(raw) && /Seal Cruiser/.test(raw) && /Crash Angel/.test(raw), "RAW 23 inventory is 46 and names the four");
ok(/Aequitas Mandate \(AEQ\)/.test(raw) && /Lazarus Extract \(LAZ\)/.test(raw), "RAW 23 names AEQ and LAZ");
ok(/Inventory \(46 crewed platforms\)/.test(vehCh) && /Writ VTOL/.test(vehCh) && /White Door/.test(vehCh), "16-vehicles inventory is 46");
ok(/Seal Cruiser/.test(gear) && /Crash Angel/.test(gear) && /White Door/.test(gear) && /Writ VTOL/.test(gear), "gear master lists all four");
ok(/Seal Cruiser/.test(director) && /Crash Angel/.test(director) && /AEQ/.test(director) && /LAZ/.test(director), "director pointer names AEQ/LAZ SKUs");

console.log("3) README / changelog");
const readme = readFileSync("README.md", "utf8");
ok(/0\.3\.80/.test(readme) && /Seal Cruiser/.test(readme) && /Crash Angel/.test(readme), "README changelog names 0.3.80 service vehicles");

if (failures.length) {
  console.error(`\n${failures.length} failure(s):`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log("\nAll conglomerate service-vehicle checks passed.");
