#!/usr/bin/env node
/**
 * 0.3.136 wave smoke — items 1 and 2 of the brief, one section each.
 *
 * Two unrelated-looking jobs with the same shape: **something the table can see was wired to
 * something the table cannot**. Thirty-five finished drone plates were sitting in a staging folder
 * while the map still showed silhouettes, and a hero standing on a truck was standing on a truck only
 * in everybody's imagination — the third-party Rideable module was supposed to do the rest and did it
 * badly.
 *
 * As in 0.3.134 and 0.3.135, the assertions run the **real exported functions** over the **real
 * shipped data** rather than re-typing either: `seatCapacity` / `mountPlan` / `rimSeatPosition` over
 * the shipped band table, and every drone Item + band template Actor read straight off the pack JSON
 * with its art path checked against the file that is actually on disk.
 *
 * Run: `node tools/wave-03136-smoke.mjs`
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import { atLeast } from "./lib/module-version.mjs";
import { DRONE_TOKEN_SCALES, droneTokenScale, machineBand } from "../scripts/machines.mjs";
import {
  MOUNTED_RIDER_SCALE, PASSENGER_LANG_ROOT, RIDERS_FLAG, RIDING_FLAG, SEAT_CAPACITY,
  dismountPosition, isRiding, mountPlan, riderMoveBlocked, ridersOf, ridingRecord,
  resolveRideParty, rimSeatPosition, seatAngle, seatCapacity,
} from "../scripts/passengers.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const DRONE_ART = "assets/tokens/drones";
const fail = [];
const note = (pass, msg) => { if (pass) console.log(`  ✓ ${msg}`); else { fail.push(msg); console.log(`  ✗ ${msg}`); } };

const read = path => readFileSync(path, "utf8").replace(/\r\n/g, "\n");
const readJson = path => JSON.parse(read(path));
/** Source with every comment line dropped — a header that *names* a thing is not the thing. */
const code = text => text.split("\n").filter(line => !/^\s*(\/\/|\*|\/\*)/.test(line)).join("\n");
const sha256 = path => createHash("sha256").update(readFileSync(path)).digest("hex");

const manifest = readJson("module.json");
const lang = readJson("lang/en.json");

const localize = key => {
  let node = lang;
  for (const part of String(key).split(".")) {
    if (!node || (typeof node !== "object") || !(part in node)) return key;
    node = node[part];
  }
  return (typeof node === "string") ? node : key;
};
const langHas = dotted => localize(dotted) !== dotted;

function walkJson(root) {
  const out = [];
  const walk = dir => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) { walk(path); continue; }
      if (!entry.name.endsWith(".json") || entry.name.startsWith("_")) continue;
      out.push({ path, doc: readJson(path) });
    }
  };
  if (existsSync(root)) walk(root);
  return out;
}

/* ================================================================ 1 — drone art on Items and Actors */

console.log("\n1) Thirty-five finished drone plates are the art the table sees");

/** The 35 WebPs Michael generated (2026-09-24), by the live asset name each one lands on. */
const INCOMING_PLATES = [
  "barracuda", "buzz", "choir-box", "choir-king", "crawler", "deep-viper", "fly", "ghost-courier",
  "guard-dog", "hellkite", "iron-mantis", "junkbug", "lifeline", "medbot", "needle", "nest",
  "netcaster", "pallbearer", "phantom", "rattlebox", "razorwing", "ripper", "rotor",
  "rustbucket-drone", "sink-floater", "skitter", "skulker", "spotter", "sputter-sled", "stinger",
  "tape-eye", "taser-bee", "warhound", "whisper-run", "wrenchbot",
];

/**
 * Finished plates that were NOT in the 35-drone pack and must survive this wave byte for byte.
 * Hashes recorded off 0.3.135's tree before the copy ran.
 */
const PROTECTED_PLATES = Object.freeze({
  "kiln-beetle.webp": "c3db3d948b9d3479c086f87684115325e4361419cb2c65bcea8e31e21c451df5",
  "mule-bot.webp": "4fbe27a53f8682e1828624c0ed235d1fa3ae270b40ad129b713f40a52008d793",
  "mule-bot.png": "a44301cdaa8baada0e9831e38401c18324eb19d33495b345fe0b3c7b03d0fe81",
  "second-face.webp": "fd72daa633e1c4a96896f26bf0d20ca9e83647128ddf5efa5c57ec8f3f3c7d68",
  "static-crow.webp": "569104f1bac219dfc6dfdccc44f53ec56c48cc7eda52525af71c013b6e909ea6",
  "tide-wraith.webp": "aaf65e384d6f399b805f3534badf978f7af48f5385c9a37282cbc47b482a50f3",
});

{
  note(INCOMING_PLATES.length === 35, `${INCOMING_PLATES.length} incoming plates in the 2026-09-24 pack`);
  const thin = [];
  for (const slug of INCOMING_PLATES) {
    const file = `${DRONE_ART}/${slug}.webp`;
    if (!existsSync(file)) { thin.push(`${slug} (missing)`); continue; }
    // A zero-byte or placeholder-sized file is a failed copy, not art.
    if (statSync(file).size < 4096) thin.push(`${slug} (${statSync(file).size} bytes)`);
  }
  note(!thin.length, `every incoming plate landed in ${DRONE_ART}/${thin.length ? ` — thin: ${thin.slice(0, 4)}` : ""}`);

  // The one rename in the whole wave. The live asset keeps the dsid's name.
  note(existsSync(`${DRONE_ART}/rustbucket-drone.webp`), "the aerial clunker ships as rustbucket-drone.webp");
  note(!existsSync(`${DRONE_ART}/rustbucket.webp`), "…and incoming rustbucket.webp was NOT dropped in beside it");
  const artTool = code(read("tools/apply-machine-token-art.mjs"));
  note(/kind === "drone"\) && \(slug === "rustbucket"\)\) dsid = "rustbucket-drone"/.test(artTool)
    || /slug === "rustbucket"/.test(artTool), "apply-machine-token-art maps a drone rustbucket to rustbucket-drone");

  // Protected plates: not in the 35, already finished, untouched.
  for (const [file, digest] of Object.entries(PROTECTED_PLATES)) {
    const path = `${DRONE_ART}/${file}`;
    note(existsSync(path) && (sha256(path) === digest), `${file} is byte-for-byte the plate 0.3.135 shipped`);
    note(!INCOMING_PLATES.includes(file.replace(/\.(webp|png)$/, "")), `…and ${file} was not in the incoming pack`);
  }

  /* Items: every named drone points at its own plate, and the plate exists. */
  const rows = walkJson("src/packs/vehicles")
    .map(({ path, doc }) => ({ path, doc, vehicle: doc.flags?.[MODULE_ID]?.vehicle }))
    .filter(row => row.vehicle);
  const drones = rows.filter(row => row.vehicle.drone);
  note(drones.length === 40, `${drones.length} drone SKUs ship (35 new plates + 5 protected)`);
  const wrong = [];
  for (const row of drones) {
    const dsid = row.doc.system?._dsid;
    const want = `modules/${MODULE_ID}/assets/tokens/drones/${dsid}.webp`;
    if (row.doc.img !== want) { wrong.push(`${dsid} → ${row.doc.img}`); continue; }
    if (!existsSync(`${DRONE_ART}/${dsid}.webp`)) wrong.push(`${dsid} (no file)`);
  }
  note(!wrong.length, `every drone Item points at its own plate on disk${wrong.length ? ` — ${wrong.slice(0, 4)}` : ""}`);
  const silhouettes = drones.filter(row => /^icons\//.test(row.doc.img ?? ""));
  note(!silhouettes.length, "…and not one drone Item is still on a core Foundry icon");
  const covered = new Set(drones.map(row => row.doc.system?._dsid));
  for (const slug of ["guard-dog", "rustbucket-drone", "fly", "sputter-sled"]) {
    note(covered.has(slug), `Michael's four spot-check drones ship: ${slug}`);
  }

  /* Actors: the three Generic Drone band templates, and the named machines. */
  const bandArt = {
    "machine-drone-micro": { art: "fly.webp", scale: 0.5 },
    "machine-drone-small": { art: "guard-dog.webp", scale: 1 },
    "machine-drone-medium": { art: "mule-bot.webp", scale: 1.5 },
  };
  for (const [file, want] of Object.entries(bandArt)) {
    const doc = readJson(`src/packs/summons/machines/${file}.json`);
    const src = doc.prototypeToken?.texture?.src;
    const expected = `modules/${MODULE_ID}/assets/tokens/drones/${want.art}`;
    note(doc.img === expected, `${file} portrait is ${want.art}`);
    note(src === expected, `…and its prototype token wears the same plate`);
    note(existsSync(`${DRONE_ART}/${want.art}`), `…which is on disk`);
    // Scale is the 0.3.135 LOCK and this wave does not move it.
    note(doc.prototypeToken?.texture?.scaleX === want.scale
      && doc.prototypeToken?.texture?.scaleY === want.scale, `…drawn at the locked ${want.scale}`);
  }
  const machineActors = walkJson("src/packs/summons/machines");
  const placeholders = machineActors.filter(({ doc }) => /robotics-frame-steel-blue/.test(doc.img ?? ""));
  note(!placeholders.length, "no machine Actor is left on the steel-blue robotics placeholder");
  const mule = readJson("src/packs/summons/machines/mule-bot.json");
  note(/drones\/mule-bot\.webp$/.test(mule.img), "the named Mule-Bot Actor keeps its own protected plate");

  // Every img / texture.src in both machine packs resolves to a file that exists.
  const dangling = [];
  const scan = (node, path) => {
    if (!node || (typeof node !== "object")) return;
    for (const [key, value] of Object.entries(node)) {
      if (((key === "img") || (key === "src")) && (typeof value === "string")
        && value.startsWith(`modules/${MODULE_ID}/`)) {
        const rel = value.slice(`modules/${MODULE_ID}/`.length);
        if (!existsSync(rel)) dangling.push(`${path}: ${value}`);
      } else scan(value, path);
    }
  };
  for (const { path, doc } of [...walkJson("src/packs/vehicles"), ...machineActors]) scan(doc, path);
  note(!dangling.length, `no machine art path is dangling${dangling.length ? ` — ${dangling.slice(0, 3)}` : ""}`);

  /* Deploy stamps the Item's art onto the Actor and the placed token. */
  const machinesCode = code(read("scripts/machines.mjs"));
  note(/name: item\.name, img: item\.img/.test(machinesCode), "deployMachine copies the Item img onto the Actor");
  note(/"prototypeToken\.texture\.src": item\.img/.test(machinesCode), "…and onto the prototype token it places");

  /* Scale bands are the 0.3.135 lock. This wave must not have moved them. */
  note(DRONE_TOKEN_SCALES["drone-micro"] === 0.5, "Personal / Micro is still 0.5");
  note(DRONE_TOKEN_SCALES["drone-small"] === 1, "Light / Small is still 1.0");
  note(DRONE_TOKEN_SCALES["drone-medium"] === 1.5, "Vehicle / Medium is still 1.5");
  note(Object.keys(DRONE_TOKEN_SCALES).length === 3, "…and the contact sheets' 0.35 / 0.5 / 1.5 was ignored");
  const mistuned = drones.filter(row => {
    const band = machineBand({ getFlag: (_scope, key) => (key === "vehicle" ? row.vehicle : null) });
    return droneTokenScale(band, row.vehicle) !== DRONE_TOKEN_SCALES[band];
  });
  note(!mistuned.length, "every drone SKU still resolves to its band's locked scale");
}

/* ================================================================ 2 — Ghostwire-native passengers */

console.log("\n2) Mount / Dismount is Ghostwire's own, and weapon hardpoints are untouched");

{
  const rideCode = code(read("scripts/passengers.mjs"));
  const moduleCode = code(read("scripts/module.mjs"));
  const weaponMounts = read("scripts/mounts.mjs");

  /* 2a — the file is new, wired, and not the weapon one. */
  note(existsSync("scripts/passengers.mjs"), "scripts/passengers.mjs ships");
  note(/import \{ registerPassengers \} from "\.\/passengers\.mjs";/.test(moduleCode),
    "module.mjs imports it");
  note(/^\s*registerPassengers\(\);/m.test(moduleCode), "…and calls registerPassengers() at init");
  const machinesAt = moduleCode.indexOf("registerMachines();");
  const rideAt = moduleCode.indexOf("registerPassengers();");
  note((machinesAt > 0) && (rideAt > machinesAt), "…after registerMachines(), whose band helpers it reads");

  // The third-party module this replaces must not be a dependency, an import or a runtime lookup.
  note(!/rideable/i.test(rideCode), "passengers.mjs never mentions the third-party Rideable module");
  note(!/rideable/i.test(JSON.stringify(manifest)), "…and module.json declares no Rideable relationship");

  // scripts/mounts.mjs is WEAPON hardpoints (0.3.112) and this wave did not touch it.
  note(/heavy \/ vehicle weapons bolted onto an installed Weaponry kit/.test(weaponMounts),
    "scripts/mounts.mjs is still the weapon-hardpoint file");
  note(/export const MOUNT_FLAG = "mount";/.test(weaponMounts), "…with its own MOUNT_FLAG");
  note(/export const MOUNTED_WEAPONS_FLAG = "mountedWeapons";/.test(weaponMounts), "…and MOUNTED_WEAPONS_FLAG");
  note(!/passengers\.mjs|GHOSTWIRE\.Ride/.test(weaponMounts), "…and knows nothing about passengers");
  note(!/from "\.\/mounts\.mjs"/.test(rideCode), "passengers.mjs does not import the weapon file");
  note((RIDING_FLAG !== "mount") && (RIDERS_FLAG !== "mountedWeapons"), "the two flag families cannot collide");
  note(PASSENGER_LANG_ROOT === "GHOSTWIRE.Ride", `passenger lang root is ${PASSENGER_LANG_ROOT}, not GHOSTWIRE.Mounts`);

  /* 2b — flag shape. */
  note(RIDING_FLAG === "riding", 'the rider flag is flags.<module>.riding');
  note(RIDERS_FLAG === "riders", 'the mount flag is flags.<module>.riders');
  const rider = { flags: { [MODULE_ID]: { riding: { mountId: "abc", seatIndex: 1, seatCount: 4, savedScale: { x: 1, y: 1 } } } } };
  note(isRiding(rider) === true, "isRiding reads the flag off a plain token object");
  note(ridingRecord(rider).seatIndex === 1, "…and the seat comes back with it");
  note(isRiding({ flags: { [MODULE_ID]: { riding: {} } } }) === false, "a record with no mountId is not riding");
  note(isRiding(null) === false, "…and nothing is not riding");
  note(ridersOf({ flags: { [MODULE_ID]: { riders: [{ tokenId: "a", seatIndex: 0 }, { seatIndex: 1 }] } } }).length === 1,
    "ridersOf drops a seat with no token id");
  note(ridersOf(null).length === 0, "…and tolerates no mount at all");

  /* 2c — capacity by band (the documented 0.3.136 default). */
  note(seatCapacity("drone-micro") === 0, "a Micro drone carries nobody");
  note(seatCapacity("drone-small") === 1, "a Small drone carries 1");
  note(seatCapacity("drone-medium") === 2, "a Medium drone carries 2");
  note(seatCapacity("vehicle-bike") === 2, "a bike takes a pillion");
  note(seatCapacity("vehicle-car") === 4, "a car takes a crew of 4");
  note(seatCapacity("vehicle-heavy") === 6, "a heavy takes 6");
  note(["vehicle-air", "vehicle-water", "vehicle-space"].every(band => seatCapacity(band) === 4),
    "air / water / space vehicles take 4");
  note(seatCapacity("machine-drone-medium") === 2, "a machine-<band> dsid resolves the same way");
  note(seatCapacity("drone-medium", { baseAsset: "safehouse-beacon" }) === 0, "a base asset is furniture, not a bus");
  note(seatCapacity("drone-medium", { kind: "baseAsset" }) === 0, "…however it spells that");
  note(seatCapacity("drone-micro", { seats: 3 }) === 3, "a Director's explicit seats override wins");
  note(seatCapacity("vehicle-car", { seats: 0 }) === 0, "…including an override down to zero");
  note(seatCapacity("drone-micro", { stations: "2 crew stations" }) === 2, "a numeric stations string is read");
  note(seatCapacity("not-a-band") === 0 && seatCapacity(null) === 0, "an unknown band carries nobody");
  note(Object.values(SEAT_CAPACITY).every(n => Number.isInteger(n) && (n >= 0)), "every band capacity is a whole number");

  /* 2d — seat handing-out. */
  const empty = mountPlan({ capacity: 4, occupied: [], incoming: ["a", "b"] });
  note(empty.seated.map(s => s.seatIndex).join(",") === "0,1", "two riders onto an empty 4-seater take seats 0 and 1");
  note(!empty.refused.length, "…and nobody is refused");
  const partial = mountPlan({ capacity: 2, occupied: [{ tokenId: "x", seatIndex: 0 }], incoming: ["b", "c"] });
  note(partial.seated.length === 1 && partial.seated[0].seatIndex === 1, "the next rider takes the free seat, not seat 0");
  note(partial.refused.join(",") === "c", "…and the one that does not fit is refused by name");
  note(partial.used === 2, "…leaving the mount full");
  note(mountPlan({ capacity: 0, incoming: ["a"] }).refused.length === 1, "a Micro drone refuses everybody");
  note(mountPlan().seated.length === 0, "…and no arguments is empty, not a crash");
  const gap = mountPlan({ capacity: 3, occupied: [{ seatIndex: 1 }], incoming: ["a", "b"] });
  note(gap.seated.map(s => s.seatIndex).join(",") === "0,2", "a vacated middle seat is filled before a new one");

  /* 2e — rim maths. */
  note(Math.abs(seatAngle(0, 4) + (Math.PI / 2)) < 1e-9, "seat 0 sits on the mount's nose");
  note(Math.abs(seatAngle(1, 4) - 0) < 1e-9, "…seat 1 a quarter turn clockwise");
  note(Math.abs(seatAngle(2, 4) - (Math.PI / 2)) < 1e-9, "…seat 2 at the tail");
  note(Math.abs(seatAngle(4, 4) - seatAngle(0, 4)) < 1e-9, "…and the ring wraps");
  note(Math.abs(seatAngle(-1, 4) - seatAngle(3, 4)) < 1e-9, "…in both directions");
  note(Math.abs(seatAngle(0, 4, 90) - seatAngle(1, 4, 0)) < 1e-9, "turning the mount 90° carries its seats round");

  const single = rimSeatPosition({ mountX: 0, mountY: 0, mountWidth: 1, mountHeight: 1, grid: 100 });
  note((single.x === 0) && (single.y === -50), "a rider on a 1-square mount sits on its top edge, not its middle");
  const truck = { mountX: 300, mountY: 300, mountWidth: 3, mountHeight: 3, grid: 100, seatCount: 4 };
  const seats = [0, 1, 2, 3].map(seatIndex => rimSeatPosition({ ...truck, seatIndex }));
  note(new Set(seats.map(s => `${s.x},${s.y}`)).size === 4, "four riders on a 3-square truck get four different squares");
  const centre = { x: 300 + 150, y: 300 + 150 };
  note(seats.every(s => Math.abs(Math.hypot((s.x + 50) - centre.x, (s.y + 50) - centre.y) - 150) < 1),
    "…all of them the same distance out, on the rim");
  note(seats[0].y < centre.y && seats[2].y > centre.y, "…seat 0 forward of centre and seat 2 behind it");
  note(rimSeatPosition({}).x === 0, "no arguments is a number, not NaN");
  note(Number.isFinite(rimSeatPosition({ grid: 0 }).y), "…and a zero grid does not divide by nothing");

  // Dismount puts a rider clear of the hull, on the grid.
  const off = dismountPosition({ ...truck, seatIndex: 0 });
  note((off.x % 100 === 0) && (off.y % 100 === 0), "a dismounted rider lands snapped to the grid");
  note(Math.hypot((off.x + 50) - centre.x, (off.y + 50) - centre.y) > 150, "…outside the mount's own footprint");
  const spread = [0, 1, 2, 3].map(seatIndex => dismountPosition({ ...truck, seatIndex }));
  note(new Set(spread.map(s => `${s.x},${s.y}`)).size === 4, "…and four riders step off into four squares");

  /* 2f — a mounted rider does not walk. */
  note(riderMoveBlocked(rider, { x: 100 }) === true, "dragging a mounted rider is refused");
  note(riderMoveBlocked(rider, { y: 100 }) === true, "…on either axis");
  note(riderMoveBlocked(rider, { elevation: 20 }) === true, "…and elevation too");
  note(riderMoveBlocked(rider, { x: 100 }, { ghostwireRide: true }) === false,
    "…but the mount's own follow-the-crew write always passes");
  note(riderMoveBlocked(rider, { rotation: 90 }) === false, "turning a rider on the spot is still allowed");
  note(riderMoveBlocked({}, { x: 1 }) === false, "an unmounted token walks normally");
  // Decision lock: a stray drag is IGNORED, not silently turned into a dismount.
  note(/Hooks\.on\("preUpdateToken"/.test(rideCode) && /return false;/.test(rideCode),
    "the pre-hook vetoes the move rather than unseating the rider");
  note(!/dismount.*preUpdateToken|preUpdateToken.*dismountRiders/is.test(rideCode.slice(rideCode.indexOf("preUpdateToken"), rideCode.indexOf("preUpdateToken") + 400)),
    "…and never dismounts from a drag");

  /* 2f2 — who rides what, from a selection that a right-click may have just eaten. */
  {
    const truckDoc = { id: "truck" };
    const hero = { id: "hero" };
    const other = { id: "other" };
    const carries = doc => doc.id === "truck";
    const targeted = resolveRideParty({ controlled: [hero, other], targets: [truckDoc], carries });
    note(targeted.mount?.id === "truck", "a targeted machine is the mount");
    note(targeted.riders.map(r => r.id).join(",") === "hero,other", "…and the whole selection rides it");
    const held = resolveRideParty({ controlled: [truckDoc, hero], targets: [], carries });
    note(held.mount?.id === "truck", "with nothing targeted, the one controlled machine is the mount");
    note(held.riders.map(r => r.id).join(",") === "hero", "…and it is never handed to itself as a rider");
    const swallowed = resolveRideParty({ controlled: [truckDoc], targets: [hero], carries });
    note(swallowed.mount?.id === "truck" && swallowed.riders.map(r => r.id).join(",") === "hero",
      "a right-click that ate the selection still works off the target");
    note(resolveRideParty({ controlled: [hero], targets: [], carries }).mount === null,
      "no machine anywhere → no mount, not a guess");
    note(resolveRideParty({ controlled: [hero, hero], targets: [hero], carries }).riders.length === 1,
      "…and the same token selected and targeted rides once");
    note(resolveRideParty().riders.length === 0, "no arguments is empty, not a crash");
  }

  /* 2g — the rest of the hooks. */
  note(/Hooks\.on\("updateToken"/.test(rideCode), "the mount's move is followed");
  note(/\["x", "y", "rotation", "elevation", "width", "height"\]/.test(rideCode),
    "…on position, rotation, elevation and footprint");
  note(/Hooks\.on\("deleteToken"/.test(rideCode), "a deleted mount frees its riders");
  note(/Hooks\.on\("preDeleteToken"/.test(rideCode), "…reading the seat list off the doomed token before it goes");
  note(/Hooks\.on\("renderTokenHUD"/.test(rideCode), "and the Token HUD carries the buttons");
  note(/Hooks\.on\("getSceneControlButtons"/.test(rideCode), "…with a token-layer Mount / Dismount tool beside them");
  note(/tools\.ghostwireMount/.test(rideCode) && /tools\.ghostwireDismount/.test(rideCode),
    "…named so they cannot collide with the weapon-hardpoint UI");
  note(/ghostwireRide: true/.test(rideCode), "our own writes are marked so they are not re-processed");
  note(MOUNTED_RIDER_SCALE === 0.5, "a rider is drawn at half scale while aboard");
  note(/savedScale/.test(rideCode) && /savedElevation/.test(rideCode), "…and its own scale and elevation are saved to restore");
  note(/texture\.scaleX": Number\(saved\.x\) \|\| 1/.test(rideCode), "…and restored on dismount");
  note(/module\.api[\s\S]{0,400}ride:/.test(rideCode), "module.api.ride exposes the verbs for a macro");

  /* 2h — lang. */
  for (const key of ["Mount", "Dismount", "DismountAll", "HudMount", "HudDismount", "HudDismountAll",
    "Mounted", "Dismounted", "Freed", "Refused", "Full", "NoSeats", "NotMachine", "NoRiders",
    "AlreadyRiding", "NotRiding", "NoPassengers", "DragBlocked", "TheMount",
    "ToolMount", "ToolDismount", "NoMount"]) {
    note(langHas(`GHOSTWIRE.Ride.${key}`), `lang GHOSTWIRE.Ride.${key}`);
  }
  note(localize("GHOSTWIRE.Ride.Mount") === "Mount", "the button says Mount");
  note(localize("GHOSTWIRE.Ride.Dismount") === "Dismount", "…and Dismount");
  note(langHas("GHOSTWIRE.Mounts.Mount") || langHas("GHOSTWIRE.Mounts.Title") || !!lang.GHOSTWIRE.Mounts,
    "the weapon-hardpoint lang family still exists beside it");
  const rideStrings = Object.values(lang.GHOSTWIRE.Ride);
  note(rideStrings.every(text => typeof text === "string"), "every Ride string is a string");
  note(!rideStrings.some(text => /\bhardpoint\b/i.test(text)), "…and none of them talks about weapon hardpoints");
  note(/\{capacity\}/.test(localize("GHOSTWIRE.Ride.HudMount")), "the Mount tooltip prints the seat count");
  note(/Dismount/.test(localize("GHOSTWIRE.Ride.DragBlocked")), "the refused-drag warning says what to do instead");
}

/* ================================================================ 3 — version, checklist, wiring */

console.log("\n3) Version, checklist and wiring");

note(atLeast(manifest.version, "0.3.136"), `module.json is ${manifest.version} (>= 0.3.136)`);
note(/`0\.3\.136`/.test(read("README.md")), "README has a 0.3.136 Status entry");
note(existsSync("docs/directors/03136-smoke.md"), "the Foundry checklist is written");
{
  const checklist = existsSync("docs/directors/03136-smoke.md") ? read("docs/directors/03136-smoke.md") : "";
  for (const item of ["Guard-Dog", "Rustbucket", "Fly", "Sputter-Sled", "rustbucket-drone.webp",
    "Kiln-Beetle", "Mule-Bot", "Second Face", "Static Crow", "Tide-Wraith",
    "0.5", "1.0", "1.5", "Mount", "Dismount", "Capacity", "Recall"]) {
    note(checklist.includes(item), `the checklist covers ${item}`);
  }
  for (let item = 1; item <= 2; item += 1) {
    note(new RegExp(`^## ${item}\\.`, "m").test(checklist), `…and has a section for item ${item}`);
  }
}
for (const script of ["scripts/machines.mjs", "scripts/mounts.mjs", "scripts/passengers.mjs",
  "scripts/rigger-vertical.mjs"]) {
  note(existsSync(script), `${script} ships`);
}
note(existsSync("tools/apply-machine-token-art.mjs"), "tools/apply-machine-token-art.mjs ships (it did the copy)");
note(manifest.esmodules?.includes("scripts/module.mjs") !== false, "and module.mjs is still the entry point");

/* ================================================================ */

console.log(fail.length ? `\n0.3.136 smoke FAIL — ${fail.length}` : "\n0.3.136 smoke OK");
for (const msg of fail) console.log(`  - ${msg}`);
process.exit(fail.length ? 1 : 0);
