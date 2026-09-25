#!/usr/bin/env node
/**
 * 0.3.144 — point every ground chassis document at its plate, from `scripts/vehicle-rename.mjs`.
 *
 * Three jobs, all keyed by `_dsid` so no `_id` and no file stem moves:
 *
 *   1. **Items** (`src/packs/vehicles/ground/*.json`) — `img` = the table's `art` stem. Only Rustbucket
 *      actually moves (`rustbucket.webp` → `rustbucket-ground.webp`); the rest already point at their
 *      street-keyed stem, whose *bytes* changed this wave but whose path did not.
 *   2. **Machine Actors** (`src/packs/summons/machines/*.json`) — portrait `img` and
 *      `prototypeToken.texture.src` = the same plate as the Item, so a Deploy and a dragged template
 *      show the same machine. Bulldog and the three chassis band templates were still on Foundry's
 *      stock `icons/environment/settlement/wagon.webp`.
 *   3. **Yield copy** — `system.project.yield.display` prints the chassis name on the Fabricate card
 *      ("one Brick chassis · …"), so it moves to the catalog name with the rest.
 *
 * Handling, Integrity, mod slots, tags, price and echelon are never read or written here.
 *
 * Run: node tools/apply-vehicle-catalog-art.mjs
 * Then (Foundry closed): node tools/build-packs.mjs vehicles summons
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { CHASSIS_TEMPLATES, VEHICLE_MAKERS, artPath } from "../scripts/vehicle-rename.mjs";

const GROUND = "src/packs/vehicles/ground";
const MACHINES = "src/packs/summons/machines";

const readDoc = path => JSON.parse(readFileSync(path, "utf8").replace(/^﻿/, ""));
const writeDoc = (path, doc) => writeFileSync(path, `${JSON.stringify(doc, null, 2)}\n`);

let changes = 0;
const log = line => { changes += 1; console.log(`  ${line}`); };

console.log("Items — src/packs/vehicles/ground");
for (const file of readdirSync(GROUND).filter(f => f.endsWith(".json") && !f.startsWith("_"))) {
  const path = join(GROUND, file);
  const doc = readDoc(path);
  const row = VEHICLE_MAKERS[doc.system?._dsid];
  if (!row) continue;
  let dirty = false;

  const img = artPath(row.art);
  if (doc.img !== img) { log(`${file}: img ${doc.img} → ${img}`); doc.img = img; dirty = true; }

  const display = doc.system?.project?.yield?.display;
  if (typeof display === "string" && display.includes(`one ${row.old} chassis`)) {
    doc.system.project.yield.display = display.replace(`one ${row.old} chassis`, `one ${row.name} chassis`);
    log(`${file}: yield display → "${doc.system.project.yield.display}"`);
    dirty = true;
  }

  if (dirty) writeDoc(path, doc);
}

console.log("Actors — src/packs/summons/machines");
// dsid → art stem, for both the named Machine Actors and the three band templates.
const byDsid = new Map([
  ...Object.entries(VEHICLE_MAKERS).filter(([, row]) => row.machineKey).map(([dsid, row]) => [dsid, row.art]),
  ...Object.entries(CHASSIS_TEMPLATES).map(([dsid, row]) => [dsid, row.art]),
]);

for (const file of readdirSync(MACHINES).filter(f => f.endsWith(".json") && !f.startsWith("_"))) {
  const path = join(MACHINES, file);
  const doc = readDoc(path);
  const dsid = doc.system?._dsid ?? doc.flags?.["draw-steel-ghostwire"]?.dsid;
  const stem = byDsid.get(dsid);
  if (!stem) continue;
  const img = artPath(stem);
  let dirty = false;

  if (doc.img !== img) { log(`${file}: portrait ${doc.img} → ${img}`); doc.img = img; dirty = true; }
  const token = doc.prototypeToken?.texture;
  if (token && token.src !== img) { log(`${file}: token ${token.src} → ${img}`); token.src = img; dirty = true; }

  if (dirty) writeDoc(path, doc);
}

console.log(`\napply-vehicle-catalog-art: ${changes} change(s)`);
