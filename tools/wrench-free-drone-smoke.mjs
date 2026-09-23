#!/usr/bin/env node
/**
 * 0.3.115 smoke: the Wrench's one free Echelon 1 drone chassis at chargen.
 *
 * Four things the brief asks be provable without a world, and they are all provable because every gate on
 * the feature is a pure function sitting above the app class in scripts/chargen-wizard.mjs:
 *   1. a Wrench sees the picker and can be handed the chassis
 *   2. a non-Wrench never sees the step at all — it is absent from their ladder, not greyed out
 *   3. the grant path touches no ¥: no WEALTH_PATH write, no planChargenSpend, no `spent` bump
 *   4. only Echelon 1 drone chassis are on offer, checked against the shipped vehicles pack JSON
 *
 * Run: node tools/wrench-free-drone-smoke.mjs
 * Reads only. Does not write pack JSON, rebuild packs, or touch a world.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { atLeast } from "./lib/module-version.mjs";
import { WEALTH_PATH } from "../scripts/kiosk.mjs";
import {
  ACK_STEPS,
  CHARGEN_STEPS,
  FREE_DRONE_ECHELON,
  FREE_DRONE_FLAG,
  FREE_DRONE_PACK,
  OPTIONAL_STEPS,
  WRENCH_CLASS_DSID,
  WRENCH_ONLY_STEPS,
  chargenComplete,
  doneChecklist,
  droneEchelonOf,
  freeDroneRows,
  hasFreeDrone,
  isChargenSpendable,
  isFreeDroneRow,
  isWrenchChargen,
  nextStep,
  prevStep,
  stepIndex,
  stepStatus,
  stepVisible,
  visibleSteps,
} from "../scripts/chargen-wizard.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const SCRIPT = "scripts/chargen-wizard.mjs";
const TEMPLATE = "templates/chargen-wizard.hbs";
const DRONES_DIR = "src/packs/vehicles/drones";
const NOTE = "docs/directors/wrench-free-drone-chargen-03115.md";

const failures = [];
const ok = (cond, msg) => {
  if (!cond) failures.push(msg);
  else console.log(`  ✓ ${msg}`);
};

const read = path => readFileSync(path, "utf8");
const moduleJson = JSON.parse(read("module.json"));
const lang = JSON.parse(read("lang/en.json"));
const scriptSrc = read(SCRIPT);
const templateSrc = read(TEMPLATE);
const localize = key => key.split(".").reduce((node, part) => node?.[part], lang);

/** The shape `heroFacts()` hands the pure helpers, with only the fields this feature reads. */
const hero = (over = {}) => ({
  name: "Test Runner",
  classDsid: null,
  freeDrone: null,
  freeDroneName: null,
  state: {},
  ...over,
});
const wrench = (over = {}) => hero({ classDsid: WRENCH_CLASS_DSID, ...over });

/** A runner who has finished every other step, so Done's gate is the only thing under test. */
const finished = (over = {}) => hero({
  name: "Vira Kellis-Nade",
  peopleDsid: "human",
  backgroundDsid: "arcology",
  professionDsid: "survey-hand",
  classDsid: "operator",
  kits: [{ dsid: "gunslinger", name: "Gunslinger", needsGear: true }],
  streetGearCount: 2,
  skills: ["intimidate"],
  characteristics: { might: 2, agility: 2, reason: 1, intuition: 1, presence: 0 },
  languages: ["caelian"],
  integrity: { value: 20, max: 20 },
  taint: 0,
  chromeCount: 0,
  state: { acked: ["kit", "languages", "resources"] },
  ...over,
});

console.log("0.3.115 Wrench free E1 drone smoke\n");

/* -------------------------------------------- 1) it ships */

console.log("1) the feature ships at 0.3.115");
ok(atLeast(moduleJson.version, "0.3.115"), `module.json is at least 0.3.115 (${moduleJson.version})`);
ok(existsSync(SCRIPT) && existsSync(TEMPLATE), "the wizard script and template are both present");
ok(existsSync(NOTE), `the director note ships (${NOTE})`);
ok(moduleJson.packs.some(pack => pack.name === FREE_DRONE_PACK),
  `the "${FREE_DRONE_PACK}" pack the free pick reads is declared in module.json`);
ok(existsSync(DRONES_DIR), `${DRONES_DIR} exists`);
ok(scriptSrc.includes("export async function grantFreeChargenDrone"), "grantFreeChargenDrone is exported");
ok(scriptSrc.includes("export async function clearFreeChargenDrone"), "clearFreeChargenDrone is exported (G6)");
ok(templateSrc.includes('data-action="takeFreeDrone"'), "the template carries the Take control");
ok(scriptSrc.includes("takeFreeDrone: GhostwireChargenWizard.#onTakeFreeDrone"),
  "the takeFreeDrone action is registered on the app");

/* -------------------------------------------- 2) the step, and who sees it */

console.log("\n2) the step is on the ladder after Kit, and Wrench-only");
ok(CHARGEN_STEPS.includes("drone"), "\"drone\" is on the master ladder");
ok(stepIndex("drone") === stepIndex("kit") + 1, "it sits immediately after Kit");
ok(WRENCH_ONLY_STEPS.join(",") === "drone", "WRENCH_ONLY_STEPS names exactly the drone step");
ok(WRENCH_CLASS_DSID === "wrench", "the gate is the class dsid \"wrench\"");
ok(ACK_STEPS.includes("drone"), "the step can be waved off, the way the Kit step can");
ok(!OPTIONAL_STEPS.includes("drone"), "it is not a blanket-optional step — a Wrench takes it or acks it");

ok(isWrenchChargen(wrench()), "isWrenchChargen: a Wrench is a Wrench");
for (const other of ["operator", "hacker", "medic", "scout", "commander", "technomancer", null, "", "Wrench "]) {
  ok(!isWrenchChargen(hero({ classDsid: other })), `isWrenchChargen refuses ${JSON.stringify(other)}`);
}

ok(stepVisible("drone", wrench()), "a Wrench sees the drone step");
ok(!stepVisible("drone", hero({ classDsid: "operator" })), "an Operator does not");
ok(!stepVisible("drone", hero()), "a runner with no class yet does not (hidden is the safe default)");
ok(!stepVisible("nonsense", wrench()), "a step that does not exist is never visible");
for (const step of CHARGEN_STEPS.filter(key => key !== "drone")) {
  ok(stepVisible(step, hero({ classDsid: "operator" })), `every other step still shows: ${step}`);
}

const wrenchLadder = visibleSteps(wrench());
const otherLadder = visibleSteps(hero({ classDsid: "operator" }));
ok(wrenchLadder.length === CHARGEN_STEPS.length, `a Wrench walks all ${wrenchLadder.length} steps`);
ok(otherLadder.length === CHARGEN_STEPS.length - 1, `everyone else walks ${otherLadder.length}`);
ok(!otherLadder.includes("drone"), "the step is absent from a non-Wrench ladder, not merely disabled");
ok(otherLadder.join(",") === CHARGEN_STEPS.filter(k => k !== "drone").join(","),
  "dropping the step reorders nothing else");

/* -------------------------------------------- 3) next / prev skip it */

console.log("\n3) next/prev walk the runner's own ladder");
ok(nextStep("kit", wrench()) === "drone", "a Wrench goes Kit → Free drone");
ok(nextStep("drone", wrench()) === "skills", "…and Free drone → Skills");
ok(prevStep("skills", wrench()) === "drone", "…and back again");
ok(prevStep("drone", wrench()) === "kit", "…and Free drone → Kit");
ok(nextStep("kit", hero({ classDsid: "operator" })) === "skills", "an Operator goes Kit → Skills, no stop between");
ok(prevStep("skills", hero({ classDsid: "operator" })) === "kit", "…and Skills → Kit on the way back");
ok(nextStep("kit") === "skills", "with no facts at all the step stays hidden");
ok(nextStep("bio", wrench()) === "name" && prevStep("name", wrench()) === "bio", "the rest of the ladder is untouched");
ok(nextStep("done", wrench()) === "done" && prevStep("bio", wrench()) === "bio", "neither end runs off the ladder");
ok(nextStep("nonsense", wrench()) === "bio", "an unknown step falls back to the first");
// The runner stands on the drone step and then drops the Wrench class: walk on from where it sat.
ok(nextStep("drone", hero({ classDsid: "operator" })) === "skills",
  "leaving the step after losing the class moves forward, not back to step 1");
ok(prevStep("drone", hero({ classDsid: "operator" })) === "kit", "…and backward lands on Kit");
ok(scriptSrc.includes("if (!ladder.includes(this.step)) this.step = nextStep(this.step, facts);"),
  "the app rehomes a runner standing on a step that has gone out from under them");

/* -------------------------------------------- 4) the Done gate */

console.log("\n4) Done never waits on a step the runner cannot see");
ok(chargenComplete(finished()), "the control fixture (an Operator) finishes");
const wrenchNoDrone = finished({ classDsid: WRENCH_CLASS_DSID });
ok(!chargenComplete(wrenchNoDrone), "a Wrench with the pick still open is not finished");
ok(stepStatus(wrenchNoDrone).drone.warn === "FreeDroneWaiting", "…and the step warns that the chassis is waiting");
ok(chargenComplete(finished({
  classDsid: WRENCH_CLASS_DSID,
  freeDrone: { dsid: "junkbug", grantedAt: "2026-09-23T00:00:00.000Z" },
  freeDroneName: "Junkbug",
})), "a Wrench who took the chassis finishes");
ok(chargenComplete(finished({
  classDsid: WRENCH_CLASS_DSID,
  state: { acked: ["kit", "drone", "languages", "resources"] },
})), "a Wrench who waved it off finishes too");
ok(stepStatus(finished()).drone.done, "for a non-Wrench the row reports done rather than a phantom blocker");
ok(stepStatus(finished()).drone.warn === null, "…and never warns");

// The brief's lock 5, stated the other way round: no non-Wrench field of the ladder changed.
for (const key of ["kit", "skills", "characteristics", "languages", "resources", "integrity", "spends"]) {
  ok(stepStatus(finished())[key].done, `the existing spine still passes: ${key}`);
}

ok(hasFreeDrone({ freeDrone: { dsid: "buzz" } }), "hasFreeDrone reads the Actor ledger");
ok(!hasFreeDrone({ freeDrone: null }) && !hasFreeDrone({}), "…and is false with no ledger");
ok(!hasFreeDrone({ freeDrone: { dsid: "" } }), "…and refuses a ledger with no dsid");

const wrenchDone = doneChecklist(finished({ classDsid: WRENCH_CLASS_DSID, freeDroneName: "Junkbug" }));
ok(wrenchDone.some(row => row.key === "FreeDrone"), "the Done checklist gains a Wrench-only chassis bullet");
ok(wrenchDone.find(row => row.key === "FreeDrone").drone === "Junkbug", "…naming the chassis taken");
ok(!doneChecklist(finished()).some(row => row.key === "FreeDrone"), "a non-Wrench Done list never mentions it");
ok(doneChecklist(finished()).length === doneChecklist(finished({ classDsid: WRENCH_CLASS_DSID })).length - 1,
  "one extra bullet for a Wrench and no other change");

/* -------------------------------------------- 5) only E1 drone chassis */

console.log("\n5) the catalog filter is E1 drone chassis and nothing else");
ok(FREE_DRONE_ECHELON === 1, "the free pick is fixed at Echelon 1");
ok(FREE_DRONE_PACK === "vehicles", "it comes out of the vehicles pack");
ok(isFreeDroneRow({ pack: "vehicles", drone: true, echelon: 1 }), "an E1 drone row passes");
ok(!isFreeDroneRow({ pack: "vehicles", drone: true, echelon: 2 }), "an E2 drone row is refused");
ok(!isFreeDroneRow({ pack: "vehicles", drone: true, echelon: 4 }), "an E4 drone row is refused");
ok(!isFreeDroneRow({ pack: "vehicles", drone: false, echelon: 1 }), "an E1 vehicle that is not a drone is refused");
ok(!isFreeDroneRow({ pack: "vehicles", echelon: 1 }), "a row with no drone flag is refused");
ok(!isFreeDroneRow({ pack: "vehicles", drone: "true", echelon: 1 }), "a stringy drone flag is refused");
ok(!isFreeDroneRow({ pack: "gear", drone: true, echelon: 1 }), "a gear row is refused whatever it claims");
ok(!isFreeDroneRow({ pack: "chrome", drone: true, echelon: 1 }), "a chrome row is refused");
ok(!isFreeDroneRow({ pack: "mods", drone: true, echelon: 1 }), "a mod row is refused");
ok(!isFreeDroneRow({}), "an empty row is refused");
ok(droneEchelonOf({ vehicleEchelon: 2, systemEchelon: 1 }) === 2, "the vehicle flag wins on echelon");
ok(droneEchelonOf({ vehicleEchelon: null, systemEchelon: 3 }) === 3, "system.echelon is the fallback");
ok(droneEchelonOf({}) === null, "no echelon anywhere reads null, and null never equals 1");
ok(!isFreeDroneRow({ pack: "vehicles", drone: true, echelon: droneEchelonOf({}) }),
  "an unechelonned chassis therefore cannot be taken free");

/* -------------------------------------------- 6) against the shipped pack JSON */

console.log("\n6) the shipped vehicles pack agrees");
const walk = dir => {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) { out.push(...walk(p)); continue; }
    if (!entry.endsWith(".json") || entry.startsWith("_")) continue;
    const json = JSON.parse(read(p));
    if (!String(json._key ?? "").startsWith("!items!")) continue;
    out.push({ file: relative(".", p).split(sep).join("/"), json });
  }
  return out;
};

const vehicleRows = walk("src/packs/vehicles").map(({ file, json }) => {
  const vehicle = json.flags?.[MODULE_ID]?.vehicle ?? {};
  return {
    file,
    name: json.system?._dsid ?? json.name,
    dsid: json.system?._dsid ?? null,
    pack: "vehicles",
    drone: vehicle.drone === true,
    echelon: droneEchelonOf({ vehicleEchelon: vehicle.echelon, systemEchelon: json.system?.echelon }),
    price: Number(vehicle.price) || 0,
  };
});

const offered = freeDroneRows(vehicleRows);
// The brief's known-E1 list, verbatim.
const EXPECTED = [
  "buzz", "crawler", "fly", "junkbug", "mule-bot", "needle", "rattlebox", "rotor", "rustbucket-drone",
  "sink-floater", "skitter", "spotter", "sputter-sled", "tape-eye", "taser-bee",
].sort();
ok(offered.length === EXPECTED.length, `${offered.length} chassis on offer (the brief names ${EXPECTED.length})`);
ok(offered.map(row => row.dsid).sort().join(",") === EXPECTED.join(","),
  `the offer is exactly the brief's list: ${EXPECTED.join(" ")}`);
ok(offered.every(row => row.drone === true), "every row on offer is a drone chassis");
ok(offered.every(row => row.echelon === 1), "every row on offer is Echelon 1");
ok(offered.every(row => row.file.startsWith("src/packs/vehicles/drones")),
  "every row on offer comes out of the drones folder");
const above = vehicleRows.filter(row => row.drone && row.echelon > 1);
ok(above.length > 0, `there really are higher-echelon drones to exclude (${above.length})`);
ok(above.every(row => !offered.includes(row)), "and not one of them is on offer");
const notDrones = vehicleRows.filter(row => !row.drone);
ok(notDrones.length > 0, `there really are non-drone vehicles to exclude (${notDrones.length})`);
ok(notDrones.every(row => !offered.includes(row)), "and not one of them is on offer");
ok(offered.map(row => row.name).join(",") === [...offered].map(row => row.name).sort().join(","),
  "the offer comes back name-sorted");

/* -------------------------------------------- 7) the ¥ firewall: free means free */

console.log("\n7) the grant is free — no ¥ moves, no spend ledger");
const grantSrc = scriptSrc.slice(
  scriptSrc.indexOf("export async function grantFreeChargenDrone"),
  scriptSrc.indexOf("export async function clearFreeChargenDrone"),
);
ok(grantSrc.length > 400, "the grant function body was located for inspection");
ok(!grantSrc.includes("WEALTH_PATH"), `the grant never names ${WEALTH_PATH} (WEALTH_PATH)`);
ok(!grantSrc.includes("planChargenSpend") && !grantSrc.includes("planPurchase"),
  "the grant never runs a purchase plan");
ok(!grantSrc.includes("getWealth"), "the grant never even reads the purse");
ok(!/\bspent\b/.test(grantSrc), "the grant never touches the chargen `spent` counter");
ok(!grantSrc.includes("catalogPrice"), "the grant never prices the chassis");
// …and it does use the exact Item path a purchase uses.
ok(grantSrc.includes("game.items.fromCompendium(source, { clearFolder: true })"),
  "the grant copies the compendium Item the same way buyChargenItem does");
ok(grantSrc.includes('getDocumentClass("Item").create(itemData, { parent: actor })'),
  "…and creates it on the hero the same way");
// The purchase path, for contrast: it must still do all four of those things.
const buySrc = scriptSrc.slice(
  scriptSrc.indexOf("export async function buyChargenItem"),
  scriptSrc.indexOf("* 0.3.115 — hand a Wrench their one free"),
);
ok(buySrc.includes("WEALTH_PATH") && buySrc.includes("planChargenSpend") && buySrc.includes("spent"),
  "buyChargenItem still debits ¥ and logs the spend — the paid path is untouched");
ok(!isChargenSpendable({ pack: FREE_DRONE_PACK, price: 0 }),
  "a ¥0 row is still not *spendable* — free chassis never leak into the early-spend list");
ok(isChargenSpendable({ pack: FREE_DRONE_PACK, price: 400 }),
  "…while a priced chassis stays buyable there, as before");
ok(templateSrc.includes('GHOSTWIRE.Chargen.Drone.Free"'), "the picker labels the price Free");
ok(!/data-action="takeFreeDrone"[^>]*data-price/.test(templateSrc),
  "the Take control carries no price to debit");

/* -------------------------------------------- 8) once, and only by a Wrench */

console.log("\n8) the grant's own gates");
ok(FREE_DRONE_FLAG === "chargenFreeDrone", `the stamp is flags.${MODULE_ID}.chargenFreeDrone`);
ok(grantSrc.includes("if (!isWrenchChargen(facts))"), "gate 1: the class");
ok(grantSrc.includes("if (hasFreeDrone(facts))"), "gate 2: once only");
ok(grantSrc.includes("if (!isFreeDroneRow(row))") || grantSrc.includes("!isFreeDroneRow(row)"),
  "gate 3: the row really is an E1 drone chassis");
ok(grantSrc.includes("rerunGate(facts).writable"), "a finished / past-1st hero is refused (G9 holds)");
ok(grantSrc.includes(`actor.setFlag(MODULE_ID, FREE_DRONE_FLAG`), "the Actor ledger is written");
ok(grantSrc.includes(`flags.${MODULE_ID}.${"${FREE_DRONE_FLAG}"}`)
  || grantSrc.includes("FREE_DRONE_FLAG}`, { dsid, grantedAt })"), "the Item is stamped too");
ok(/case "drone":\s*await clearFreeChargenDrone\(actor\);/.test(scriptSrc),
  "G6 Start over on the step hands the chassis back");

/* -------------------------------------------- 9) nothing else broke */

console.log("\n9) the neighbours are untouched");
ok(scriptSrc.includes('import { packageDsids } from "./kit-grants.mjs"'), "Kit street-band grants still wired in");
ok(scriptSrc.includes("kitWantsGear && !Number(facts.streetGearCount)"), "the Kit-needs-gear warning still fires");
ok(scriptSrc.includes("G10:") && scriptSrc.includes("chromeIntegrityCost"), "G10 chrome Integrity still in place");
ok(scriptSrc.includes("G9:"), "G9 hide-Chargen-after-Finish still in place");
ok(templateSrc.includes('data-action="startOver"'), "G6 Start over control still in the template");
ok(templateSrc.includes('data-action="buy"'), "the ¥ early-spend Buy control still in the template");

/* -------------------------------------------- 10) lang */

console.log("\n10) every string the new UI names resolves");
const KEYS = [
  "Steps.drone.Name", "Steps.drone.Hint",
  "Drone.Hint", "Drone.FreeHint", "Drone.Free", "Drone.Take", "Drone.Taken", "Drone.NoDrone",
  "Drone.EchelonOne", "Drone.ListPrice", "Drone.Empty", "Drone.NotASpend", "Drone.Granted",
  "Drone.CardTitle", "Drone.CardBody", "Drone.CardFoot",
  "Warnings.FreeDroneWaiting",
  "Errors.FreeDroneNotWrench", "Errors.FreeDroneTaken", "Errors.FreeDroneNotE1",
  "Done.FreeDrone", "Done.NoDrone",
];
for (const key of KEYS) {
  ok(typeof localize(`GHOSTWIRE.Chargen.${key}`) === "string", `GHOSTWIRE.Chargen.${key} resolves`);
}
// B93: player-facing copy names no system, and says Free where it means free.
const droneStrings = Object.entries(lang.GHOSTWIRE.Chargen.Drone).map(([k, v]) => [k, String(v)]);
const FORBIDDEN = [/draw\s*steel/i, /\bMCDM\b/i, /creator license/i, /\bAncestry\b/, /\bCulture\b/, /\bCareer\b/];
const offenders = droneStrings.filter(([, text]) => FORBIDDEN.some(rx => rx.test(text)));
ok(offenders.length === 0, `no Drone string breaks the B93 copy lock (${offenders.map(([k]) => k).join(", ") || "none"})`);
ok(/free/i.test(localize("GHOSTWIRE.Chargen.Steps.drone.Hint")), "the step hint says the pick is free");
ok(/wrench/i.test(localize("GHOSTWIRE.Chargen.Steps.drone.Hint")), "…and says who it is for");

/* -------------------------------------------- done */

if (failures.length) {
  console.error(`\nFAILED (${failures.length}):`);
  for (const failure of failures) console.error(`  ✗ ${failure}`);
  process.exit(1);
}
console.log("\n0.3.115 Wrench free E1 drone smoke: all checks passed.");
