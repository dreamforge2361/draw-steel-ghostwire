#!/usr/bin/env node
/**
 * 0.3.138 — stamp the one vehicle/chase schema onto every catalog Item and every deployed-machine Actor.
 *
 * Before this wave the chase numbers lived in three different places and agreed by accident: the rules
 * chapter described Handling in words, the catalog Items carried `scale` + `speedBand` and no Handling
 * at all, and only the thirteen fixed base assets carried a `handling` — the string `"fixed"`. This
 * script writes the same fields everywhere, from one rubric:
 *
 *   handling   integer 1-4, higher is better. Scale base (Light/Personal/Micro/Small 3, Vehicle 2,
 *              Heavy 1, Capital 1) + speed band (extreme|fast +1, standard 0, slow -1), clamped 1-4.
 *              Fixed base assets get `null` — they never contest a chase.
 *   integrity  the machine's own damage track (player-facing name for DS stamina). Concrete numbers
 *              that already live on a chassis or on its summons Actor are kept; everything else takes
 *              the published band Stamina x the echelon multiplier, exactly what deployMachine used.
 *   speedBand  filled in as `standard` for drones that never published one (drones ignore the band
 *              for movement; the rubric needs it).
 *   scale / domain / echelon / modSlots / tags / drone / jumpInCapable stay as they are and are
 *              mirrored onto the deployed Actor.
 *
 * Idempotent: run it twice and the second run writes nothing. It never touches `_id` or `_dsid`.
 *
 * Run: node tools/stamp-vehicle-schema.mjs        (add --check to fail instead of writing)
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One rubric, one place: the same constants scripts/machines.mjs uses at the table.
import {
  HANDLING_MAX, HANDLING_MIN, HANDLING_SCALE_BASE, HANDLING_SPEED_STEP,
} from "../scripts/machines.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const VEHICLE_DIR = "src/packs/vehicles";
const MACHINE_DIR = "src/packs/summons/machines";
const CHECK = process.argv.includes("--check");

/** Band Stamina and the echelon multiplier — must stay identical to BANDS in scripts/machines.mjs. */
const BAND_STAMINA = {
  "drone-micro": 5, "drone-small": 12, "drone-medium": 24,
  "vehicle-bike": 20, "vehicle-car": 40, "vehicle-heavy": 80,
  "vehicle-air": 40, "vehicle-water": 40, "vehicle-space": 80,
};
const ECHELON_MULTIPLIER = { 1: 1, 2: 1.5, 3: 2, 4: 2.5 };

/** Mirrors machineBand() in scripts/machines.mjs. */
function bandFor(vehicle) {
  if (!vehicle) return null;
  if (vehicle.baseAsset) return "drone-small";
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

function handlingFor(vehicle) {
  if (vehicle.baseAsset) return null;
  const base = HANDLING_SCALE_BASE[String(vehicle.scale ?? "").trim().toLowerCase()] ?? 2;
  const step = HANDLING_SPEED_STEP[String(vehicle.speedBand ?? "standard").trim().toLowerCase()] ?? 0;
  return Math.min(HANDLING_MAX, Math.max(HANDLING_MIN, base + step));
}

function integrityFor(vehicle) {
  const published = Number(vehicle.integrity ?? vehicle.stamina);
  if (Number.isFinite(published) && (published > 0)) return Math.round(published);
  const band = bandFor(vehicle);
  if (!band) return null;
  return Math.round(BAND_STAMINA[band] * (ECHELON_MULTIPLIER[vehicle.echelon] ?? 1));
}

const readJson = path => JSON.parse(readFileSync(path, "utf8"));
const writeJson = (path, json) => writeFileSync(path, `${JSON.stringify(json, null, 2)}\n`, "utf8");

const files = [];
for (const dir of readdirSync(VEHICLE_DIR)) {
  const abs = join(VEHICLE_DIR, dir);
  if (!statSync(abs).isDirectory()) continue;
  for (const f of readdirSync(abs)) {
    if (f.endsWith(".json") && !f.startsWith("_")) files.push(join(abs, f));
  }
}

/** dsid → the stamped schema, so the summons Actors can be mirrored from the same answer. */
const byDsid = new Map();
let itemsChanged = 0;

for (const path of files) {
  const json = readJson(path);
  const vehicle = json.flags?.[MODULE_ID]?.vehicle;
  if (!vehicle) continue;
  const before = JSON.stringify(vehicle);

  if (vehicle.drone && !vehicle.speedBand) vehicle.speedBand = "standard";
  vehicle.handling = handlingFor(vehicle);
  const integrity = integrityFor(vehicle);
  if (integrity != null) vehicle.integrity = integrity;

  byDsid.set(json.system?._dsid, {
    handling: vehicle.handling,
    integrity: vehicle.integrity ?? null,
    speedBand: vehicle.speedBand ?? null,
    scale: vehicle.scale ?? "",
    domain: vehicle.domain ?? "",
    echelon: vehicle.echelon ?? 1,
    modSlots: Number(vehicle.modSlots ?? 0) || 0,
    tags: Array.isArray(vehicle.tags) ? vehicle.tags : [],
    drone: !!vehicle.drone,
    baseAsset: !!vehicle.baseAsset,
    jumpInCapable: vehicle.jumpInCapable ?? null,
  });

  if (JSON.stringify(vehicle) !== before) {
    itemsChanged += 1;
    if (!CHECK) writeJson(path, json);
  }
}

/** Band templates: the rubric with no speed band, so a hand-placed template is never blank. */
const BAND_HANDLING = {
  "drone-micro": 3, "drone-small": 3, "drone-medium": 2,
  "vehicle-bike": 3, "vehicle-car": 2, "vehicle-heavy": 1,
  "vehicle-air": 2, "vehicle-water": 2, "vehicle-space": 1,
};

let actorsChanged = 0;
for (const f of readdirSync(MACHINE_DIR)) {
  if (!f.endsWith(".json") || f.startsWith("_")) continue;
  const path = join(MACHINE_DIR, f);
  const json = readJson(path);
  const flags = json.flags?.[MODULE_ID];
  if (!flags) continue;
  const before = JSON.stringify(flags);
  const machine = flags.machine ?? (flags.machine = {});
  const schema = byDsid.get(flags.gearDsid);

  if (schema) {
    machine.handling = schema.handling;
    machine.integrity = schema.integrity ?? (Number(json.system?.stamina?.max ?? 0) || null);
    machine.speedBand = schema.speedBand;
    machine.sizeScale = machine.sizeScale || schema.scale;
    machine.domain = machine.domain || schema.domain;
    machine.modSlots = Number(machine.modSlots ?? 0) || schema.modSlots;
    machine.drone = schema.drone;
    machine.kind = machine.kind || flags.kind || (schema.drone ? "drone" : "vehicle");
    if (!Array.isArray(machine.tags) || !machine.tags.length) machine.tags = schema.tags;
  } else if (flags.kind === "baseAsset" || machine.handling === "fixed") {
    machine.handling = null;
    machine.integrity = Number(json.system?.stamina?.max ?? 0) || null;
  } else if (BAND_HANDLING[flags.band]) {
    machine.handling = BAND_HANDLING[flags.band];
    machine.integrity = Number(json.system?.stamina?.max ?? 0) || null;
    machine.kind = machine.kind || flags.kind;
  }

  if (JSON.stringify(flags) !== before) {
    actorsChanged += 1;
    if (!CHECK) writeJson(path, json);
  }
}

console.log(`vehicle/drone Items stamped: ${itemsChanged} of ${files.length}`);
console.log(`summons machine Actors stamped: ${actorsChanged}`);
if (CHECK && (itemsChanged || actorsChanged)) {
  console.log("--check: the vehicle/chase schema is out of date. Run without --check.");
  process.exit(1);
}
