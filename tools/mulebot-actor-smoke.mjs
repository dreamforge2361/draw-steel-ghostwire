#!/usr/bin/env node
/**
 * 0.3.75 — Mule-Bot Deploy path (dual Item + Actor).
 *
 * Treasure SKUs in Ghostwire Vehicles & Drones are INTENTIONAL.
 * Deploy stamps machine-drone-medium; Recall deletes the Actor; the Item stays.
 *
 * Run: node tools/mulebot-actor-smoke.mjs
 * Does not need live Foundry. Does not write Scene JSON.
 */
import { existsSync, readFileSync } from "node:fs";
import { actorHasKit, isDroneActor, isMachineActor, isVehicleActor, isWireKit } from "../scripts/wired-kit.mjs";
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

console.log("Mule-Bot dual Item + Actor smoke (0.3.75)\n");

const moduleJson = readJson("module.json");
ok(typeof moduleJson.version === "string" && moduleJson.version >= "0.3.75", `module.json is ≥ 0.3.75 (got ${moduleJson.version})`);

console.log("1) Treasure SKU is the inventory / Deploy document");
const item = readJson("src/packs/vehicles/drones/mule-bot.json");
ok(item.type === "treasure", "Mule-Bot Vehicles SKU is type treasure (intentional, like every drone)");
ok(item.system._dsid === "mule-bot", "Item dsid mule-bot");
ok(item._id === "KBZhF1Z1L67t1gU4", "Item id is the published SKU");
const v = item.flags[MODULE_ID].vehicle;
ok(v.drone === true, "Item flagged drone");
ok(v.domain === "Ground (drone)", "Item domain Ground (drone)");
ok(v.scale === "Vehicle", "Item scale Vehicle (Vehicle-scale drone)");
ok(v.echelon === 1 && v.price === 1100 && v.modSlots === 2, "Item echelon 1 / ¥1100 / 2 slots");
ok(v.tags.includes("Cargo") && v.tags.includes("Cover") && v.tags.includes("Wired"), "Item tags Cargo, Cover, Wired");
ok(item.img.endsWith("drones/mule-bot.webp"), "Item img is the industrial hauler plate");

const stinger = readJson("src/packs/vehicles/drones/stinger.json");
const medbot = readJson("src/packs/vehicles/drones/medbot.json");
const fly = readJson("src/packs/vehicles/drones/fly.json");
const warhound = readJson("src/packs/vehicles/drones/warhound.json");
ok(stinger.type === "treasure" && medbot.type === "treasure" && fly.type === "treasure", "sibling drones stay type treasure");
ok(stinger.flags[MODULE_ID].vehicle.drone && warhound.flags[MODULE_ID].vehicle.drone, "Stinger / Warhound still flagged drone");

console.log("2) Band mapping matches sibling Vehicle-scale drones");
ok(machineBand(asItem(item)) === "drone-medium", "Mule-Bot → drone-medium");
ok(machineBand(asItem(stinger)) === "drone-medium", "Stinger → drone-medium (unchanged)");
ok(machineBand(asItem(warhound)) === "drone-medium", "Warhound → drone-medium (unchanged)");
ok(machineBand(asItem(medbot)) === "drone-small", "Medbot → drone-small (unchanged)");
ok(machineBand(asItem(fly)) === "drone-micro", "Fly → drone-micro (unchanged)");
ok(chassisStamina(asItem(item)) === 24, "Mule-Bot Deploy Stamina 24 (E1 × medium)");
ok(chassisStamina(asItem(stinger)) === 48, "Stinger Deploy Stamina 48 (E3 × medium, unchanged)");

const spaceMule = readJson("src/packs/vehicles/space/mule.json");
ok(spaceMule.system._dsid === "mule", "space Mule shuttle is a different SKU");
ok(machineBand(asItem(spaceMule)) === "vehicle-space", "space Mule still maps to vehicle-space");

console.log("3) Deploy uses band templates, not named-SKU Actors");
const machinesSrc = readFileSync("scripts/machines.mjs", "utf8");
ok(machinesSrc.includes('dsid`) === `machine-${band}`') || machinesSrc.includes("`machine-${band}`"), "templateFor looks up machine-${band}");
ok(!/item\.system\?\.\_dsid \? index\.find/.test(machinesSrc), "Deploy does not prefer named SKU dsid over the band");
ok(/Treasure Items in Ghostwire Vehicles & Drones are INTENTIONAL/.test(machinesSrc), "machines.mjs documents treasure SKUs as intentional");

const medium = readJson("src/packs/summons/machines/machine-drone-medium.json");
ok(medium.flags[MODULE_ID].dsid === "machine-drone-medium", "drone-medium band template exists");
ok(medium.items.some(isWireKit), "drone-medium band embeds Wire Kit");
ok(itemIsConnectInterface(medium.items.find(isWireKit)), "drone-medium Wire Kit is a Connect interface");
ok(medium.img.endsWith("drones/mule-bot.webp"), "drone-medium band uses the hauler plate (Deploy stamps Item art on top)");

console.log("4) Optional named Actor for Director-placed unowned mule");
const actor = readJson("src/packs/summons/machines/mule-bot.json");
ok(actor.type === "npc", "named Summons document is an Actor (npc)");
ok(actor.flags[MODULE_ID].kind === "drone" && actor.flags[MODULE_ID].dsid === "mule-bot", "named Actor kind/dsid");
ok(actor.flags[MODULE_ID].band === "drone-medium", "named Actor band drone-medium");
ok(actor.flags[MODULE_ID].gearItemUuid === "Compendium.draw-steel-ghostwire.vehicles.Item.KBZhF1Z1L67t1gU4", "named Actor UUID-links the treasure SKU");
ok(isDroneActor(actor) && isMachineActor(actor) && !isVehicleActor(actor), "named Actor is a drone machine");
ok((actor.items ?? []).some(isWireKit) && actorHasKit(actor), "named Actor embeds Wire Kit");
ok(itemIsConnectInterface(actor.items.find(isWireKit)), "named Actor Wire Kit is a Connect interface");
ok(!(actor.items ?? []).some(i => MATRIX_VERB_DSIDS.includes(i.system?._dsid)), "no Matrix Verbs on the named Actor");
ok(actor.prototypeToken?.texture?.src?.endsWith("drones/mule-bot.webp"), "named Actor token is the cargo plate");
ok(existsSync("assets/tokens/drones/mule-bot.png") && existsSync("assets/tokens/drones/mule-bot.webp"), "png+webp on disk");
ok(medium._id !== actor._id, "named Mule-Bot is distinct from the drone-medium band");

console.log("5) Lang / RAW / dual-model docs");
const lang = readJson("lang/en.json");
ok(lang.GHOSTWIRE.Vehicles.Items.MuleBot.Name === "Mule-Bot", "Item lang Name");
ok(/treasure/.test(lang.GHOSTWIRE.Vehicles.Items.MuleBot.Description), "Item lang names treasure as the inventory SKU");
ok(/Deploy/.test(lang.GHOSTWIRE.Vehicles.Items.MuleBot.Description), "Item lang names Deploy");
ok(/machine-drone-medium/.test(lang.GHOSTWIRE.Vehicles.Items.MuleBot.Description), "Item lang names the drone-medium band");
ok(!/not treasure-only loot/.test(lang.GHOSTWIRE.Vehicles.Items.MuleBot.Description), "Item lang does not treat treasure as a bug");
ok(/unowned \/ NPC/.test(lang.GHOSTWIRE.Summons.Machines.MuleBot.Description), "Actor lang is Director unowned/NPC placement");
ok(/machine-drone-medium/.test(lang.GHOSTWIRE.Summons.Machines.MuleBot.Description), "Actor lang says Deploy uses the band");
ok(/Not Mule-Bot/.test(lang.GHOSTWIRE.Summons.Machines.DroneMedium.Description), "Drone (Medium) lang is the band, not the SKU");

const raw = readFileSync("docs/raw/23-machines.md", "utf8");
ok(/treasure.*Item on purpose/i.test(raw) || /is a Draw Steel \*\*treasure\*\* Item on purpose/.test(raw), "RAW 23 states treasure SKUs are on purpose");
ok(/mule-bot.*machine-drone-medium/.test(raw), "RAW 23 maps mule-bot → machine-drone-medium");

const machinesJournal = readJson("src/packs/rulebook/ghostwire-systems/23-machines.json");
const journalText = (machinesJournal.pages ?? []).map(p => `${p.text?.markdown ?? ""}\n${p.text?.content ?? ""}`).join("\n");
ok(/treasure/.test(journalText) && /machine-drone-medium/.test(journalText), "Machines journal documents treasure SKU + mule-bot band");

const index = readJson("data/voidmark-rules-index.json");
ok(index.chunks.some(c => /treasure/.test(c.text) && /mule-bot/.test(c.text) && /machine-drone-medium/.test(c.text)), "VOIDMARK indexes mule-bot dual model");

const readme = readFileSync("README.md", "utf8");
ok(/0\.3\.75/.test(readme) && /treasure/.test(readme) && /intentional/i.test(readme), "README 0.3.75 documents intentional treasure dual model");

if (failures.length) {
  console.error(`\n${failures.length} failure(s):`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log("\nAll Mule-Bot dual-model checks passed.");
