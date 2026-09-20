#!/usr/bin/env node
/**
 * 0.3.73 — Mule-Bot is a placeable Actor, not treasure-only.
 *
 * Run: node tools/mulebot-actor-smoke.mjs
 * Does not need live Foundry. Does not write Scene JSON.
 */
import { existsSync, readFileSync } from "node:fs";
import { actorHasKit, isDroneActor, isMachineActor, isVehicleActor, isWireKit } from "../scripts/wired-kit.mjs";
import { itemIsConnectInterface } from "../scripts/wired-console-verbs.mjs";
import { MATRIX_VERB_DSIDS } from "../scripts/wired-verbs.mjs";

const failures = [];
const ok = (cond, msg) => {
  if (!cond) failures.push(msg);
  else console.log(`  ✓ ${msg}`);
};

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

console.log("Mule-Bot Actor smoke (0.3.73)\n");

const moduleJson = readJson("module.json");
ok(typeof moduleJson.version === "string" && moduleJson.version >= "0.3.73", `module.json is ≥ 0.3.73 (got ${moduleJson.version})`);

const item = readJson("src/packs/vehicles/drones/mule-bot.json");
ok(item.type === "treasure", "Vehicles SKU stays type treasure (buy path)");
ok(item.system._dsid === "mule-bot", "Item dsid mule-bot");
ok(item._id === "KBZhF1Z1L67t1gU4", "Item id is the published SKU");
ok(item.flags["draw-steel-ghostwire"].vehicle.drone === true, "Item flagged drone");
ok(item.flags["draw-steel-ghostwire"].vehicle.domain === "Ground (drone)", "Item domain Ground (drone)");
ok(item.flags["draw-steel-ghostwire"].vehicle.scale === "Vehicle", "Item scale Vehicle");
ok(item.img.endsWith("drones/mule-bot.webp"), "Item img is the industrial hauler plate");

const spaceMule = readJson("src/packs/vehicles/space/mule.json");
ok(spaceMule.system._dsid === "mule", "space Mule shuttle is a different SKU");
ok(spaceMule._id !== item._id, "Mule-Bot Item is not the space Mule");

const actor = readJson("src/packs/summons/machines/mule-bot.json");
ok(actor.type === "npc", "Summons document is an Actor (npc)");
ok(actor._id === "gwMuleBotAct0000", "Actor id is 16-char stable");
ok(/^[A-Za-z0-9]{16}$/.test(actor._id), "Actor _id is 16 alphanumeric");
ok(actor.flags["draw-steel-ghostwire"].kind === "drone", "Actor kind drone");
ok(actor.flags["draw-steel-ghostwire"].dsid === "mule-bot", "Actor dsid mule-bot (named SKU, not machine-drone-medium)");
ok(actor.flags["draw-steel-ghostwire"].band === "drone-medium", "Actor band drone-medium");
ok(actor.flags["draw-steel-ghostwire"].gearDsid === "mule-bot", "Actor gearDsid mule-bot");
ok(actor.flags["draw-steel-ghostwire"].gearItemUuid === "Compendium.draw-steel-ghostwire.vehicles.Item.KBZhF1Z1L67t1gU4", "Actor links the Vehicles SKU UUID");
ok(isDroneActor(actor) && isMachineActor(actor), "isDroneActor / isMachineActor see Mule-Bot");
ok(!isVehicleActor(actor), "isVehicleActor does not treat Mule-Bot as a crewed van");
ok(actor.system.stamina.max === 24, "Actor Stamina 24 (E1 medium drone)");
ok(actor.system.movement.value === 7 && actor.system.movement.types.includes("walk"), "Actor speed 7 walk");
ok(actor.system.movement.hover === false, "Actor does not hover");
ok(actor.system.combat.size.value === 1 && actor.system.combat.size.letter === "L", "Actor size 1L");
ok(actor.prototypeToken?.width === 1 && actor.prototypeToken?.height === 1, "token 1×1");
ok(actor.prototypeToken?.actorLink === true, "token is actor-linked");
ok(actor.prototypeToken?.texture?.src?.endsWith("drones/mule-bot.webp"), "token texture is the cargo plate");
ok((actor.items ?? []).some(isWireKit), "Actor embeds Wire Kit");
ok(actorHasKit(actor), "actorHasKit sees Wire Kit");
ok(itemIsConnectInterface(actor.items.find(isWireKit)), "Wire Kit is a Connect interface");
ok(!(actor.items ?? []).some(i => MATRIX_VERB_DSIDS.includes(i.system?._dsid)), "no Matrix Verbs on the Actor");
ok(!actor.flags["draw-steel-ghostwire"].wired?.state, "not auto-Overlay / auto-Connected");
ok(existsSync("assets/tokens/drones/mule-bot.png") && existsSync("assets/tokens/drones/mule-bot.webp"), "png+webp on disk");

const medium = readJson("src/packs/summons/machines/machine-drone-medium.json");
ok(medium.flags["draw-steel-ghostwire"].dsid === "machine-drone-medium", "generic Drone (Medium) still exists");
ok(medium._id !== actor._id, "named Mule-Bot is a distinct document from Drone (Medium)");
ok(medium.name !== actor.name, "Drone (Medium) and Mule-Bot have different name keys");

const lang = readJson("lang/en.json");
ok(lang.GHOSTWIRE.Summons.Machines.MuleBot.Name === "Mule-Bot", "Actor lang Name is Mule-Bot");
ok(/Place:/.test(lang.GHOSTWIRE.Summons.Machines.MuleBot.Description), "Actor lang has Place path");
ok(/KBZhF1Z1L67t1gU4/.test(lang.GHOSTWIRE.Summons.Machines.MuleBot.Description), "Actor lang UUID-links the SKU");
ok(/not the space shuttle/i.test(lang.GHOSTWIRE.Summons.Machines.MuleBot.Description), "Actor lang disambiguates space Mule");
ok(/Placeable token/.test(lang.GHOSTWIRE.Vehicles.Items.MuleBot.Description), "Item lang points at the placeable Actor");
ok(/Not Mule-Bot/.test(lang.GHOSTWIRE.Summons.Machines.DroneMedium.Description), "Drone (Medium) lang is not the Mule-Bot SKU");

const machinesSrc = readFileSync("scripts/machines.mjs", "utf8");
ok(machinesSrc.includes("item.system._dsid"), "Deploy templateFor prefers named SKU dsid");
ok(machinesSrc.includes("`machine-${band}`"), "Deploy still falls back to scale-band templates");

const readme = readFileSync("README.md", "utf8");
ok(/0\.3\.73/.test(readme) && /Mule-Bot is a placeable Actor/.test(readme), "README changelog names 0.3.73 Mule-Bot Actor");

const raw = readFileSync("docs/raw/23-machines.md", "utf8");
ok(/\*\*Mule-Bot\*\* is a placeable drone Actor/.test(raw), "RAW 23 names Mule-Bot as a placeable Actor");

const machinesJournal = readJson("src/packs/rulebook/ghostwire-systems/23-machines.json");
const journalText = (machinesJournal.pages ?? []).map(p => `${p.text?.markdown ?? ""}\n${p.text?.content ?? ""}`).join("\n");
ok(/placeable drone Actor/.test(journalText) && /Mule-Bot/.test(journalText), "Machines journal names Mule-Bot as a placeable Actor");

const index = readJson("data/voidmark-rules-index.json");
ok(index.chunks.some(c => /placeable drone Actor/.test(c.text) && /Mule-Bot/.test(c.text)), "VOIDMARK indexes Mule-Bot as a placeable Actor");

if (failures.length) {
  console.error(`\n${failures.length} failure(s):`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log("\nAll Mule-Bot Actor checks passed.");
