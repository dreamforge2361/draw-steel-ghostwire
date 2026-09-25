#!/usr/bin/env node
/**
 * 0.3.144 — write the ground vehicle catalog names, maker flavour and maker lore into lang/en.json.
 *
 * The pack rows under `src/packs/vehicles/ground/**` and `src/packs/summons/machines/**` store lang
 * **keys** in `name` and `system.description.value`, so the printed name of every chassis in Ghostwire
 * is one string in `lang/en.json`. This tool is the thing that writes those strings, from the single
 * table in `scripts/vehicle-rename.mjs`, which means:
 *
 *   * a rename cannot drift between the migration, the smoke and the card, because all three read the
 *     same table; and
 *   * running this again is a no-op, so it can be re-run after any hand edit to the descriptions
 *     without having to reason about what it will do.
 *
 * What each card gets:
 *   1. the flavour line rewritten to `Catalog Name · Maker · what it is`. For the fourteen new-art
 *      chassis the third field is the table's `role`; for a polish row it is whatever "what it is"
 *      phrase the card already carried, because that phrase is load-bearing lore;
 *   2. one line saying what the street still calls it;
 *   3. one line of maker lore for the house that builds it.
 *
 * It also repoints every `@UUID[...]{Old Name}` label at the catalog name, and strips the
 * "token art is a placeholder" copy now that the plates are real. Chassis band templates get their
 * Name set and their body left alone: a template's opening line is a category description, not a
 * `A · B · C` flavour line, and it has no maker.
 *
 * Run: node tools/vehicles-rename-lang.mjs
 * Then (Foundry closed): node tools/build-packs.mjs vehicles summons
 */
import { readFileSync, writeFileSync } from "node:fs";

import { CHASSIS_TEMPLATES, MAKERS, VEHICLE_MAKERS, flavourLine } from "../scripts/vehicle-rename.mjs";

const LANG = "lang/en.json";
const MARK = "ghostwire-maker";

const lang = JSON.parse(readFileSync(LANG, "utf8"));
const items = lang.GHOSTWIRE.Vehicles.Items;
const machines = lang.GHOSTWIRE.Summons.Machines;

let renamed = 0;
let reflavoured = 0;
let relabelled = 0;
const missing = [];

/** Every old → new pair, longest old name first so "Lane Bus" cannot eat a prefix of another row. */
const labelPairs = [...Object.values(VEHICLE_MAKERS), ...Object.values(CHASSIS_TEMPLATES)]
  .map(row => [row.old, row.name])
  .sort((a, b) => b[0].length - a[0].length);

/** Repoint `@UUID[...]{Old Name}` link labels — and only those. Prose keeps the street name. */
function relabelUuids(text) {
  return String(text).replace(/(@UUID\[[^\]]+]\{)([^}]*)(\})/g, (match, open, label, close) => {
    const hit = labelPairs.find(([old]) => label === old);
    return hit ? `${open}${hit[1]}${close}` : match;
  });
}

/** The plates are real now, so the copy that apologised for them goes. */
function dropArtPlaceholder(text) {
  return String(text)
    .replace(/\s*Token art is a <strong>placeholder<\/strong> until Michael’s plate\.\s*/g, " ")
    .replace(/\s*Token art is a placeholder until Michael’s plate lands\.\s*/g, " ");
}

/** Rewrite one `A · B · C` card: flavour line, street line, maker lore, UUID labels. */
function rewriteCard(entry, dsid, row, label) {
  const maker = MAKERS[row.maker];
  if (entry.Name !== row.name) { entry.Name = row.name; renamed += 1; }

  const flavour = /^<p><em>(.*?)<\/em><\/p>/.exec(entry.Description ?? "");
  if (!flavour) { missing.push(`flavour line for ${label}`); return; }
  const parts = flavour[1].split("·").map(part => part.trim());
  const kind = parts.length >= 3 ? parts.slice(2).join(" · ") : "";
  const line = flavourLine(dsid, { kind });

  const street = `<p class="${MARK}"><em>The street still calls it a <strong>${row.old}</strong>.</em> ${maker.lore}</p>`;

  // Drop any block a previous run wrote, then re-add: that is what makes this idempotent.
  const body = String(entry.Description)
    .replace(/^<p><em>.*?<\/em><\/p>/, "")
    .replace(new RegExp(`<p class="${MARK}">.*?</p>`, "g"), "");
  const next = dropArtPlaceholder(relabelUuids(`<p><em>${line}</em></p>${street}${body}`));
  if (next !== entry.Description) { entry.Description = next; reflavoured += 1; }
}

for (const [dsid, row] of Object.entries(VEHICLE_MAKERS)) {
  const entry = items[row.key];
  if (!entry) { missing.push(`lang GHOSTWIRE.Vehicles.Items.${row.key} for ${dsid}`); continue; }
  rewriteCard(entry, dsid, row, `Vehicles.Items.${row.key}`);

  if (!row.machineKey) continue;
  const actorEntry = machines[row.machineKey];
  if (!actorEntry) { missing.push(`lang GHOSTWIRE.Summons.Machines.${row.machineKey} for ${dsid}`); continue; }
  rewriteCard(actorEntry, dsid, row, `Summons.Machines.${row.machineKey}`);
}

for (const row of Object.values(CHASSIS_TEMPLATES)) {
  const entry = machines[row.machineKey];
  if (!entry) { missing.push(`lang GHOSTWIRE.Summons.Machines.${row.machineKey}`); continue; }
  if (entry.Name !== row.name) { entry.Name = row.name; renamed += 1; }
  const next = dropArtPlaceholder(relabelUuids(entry.Description));
  if (next !== entry.Description) { entry.Description = next; reflavoured += 1; }
}

// Every other Ghostwire card that links to a renamed chassis by UUID label — the band templates name
// the chassis they cover, the kiosk presets cite them, the machine chapter links them.
const walk = (node, path) => {
  for (const [key, value] of Object.entries(node)) {
    if (typeof value === "string") {
      if (!value.includes("@UUID[")) continue;
      const next = relabelUuids(value);
      if (next !== value) { node[key] = next; relabelled += 1; }
    } else if (value && typeof value === "object") {
      walk(value, `${path}.${key}`);
    }
  }
};
walk(lang.GHOSTWIRE, "GHOSTWIRE");

if (missing.length) {
  console.error("vehicles-rename-lang: unmapped rows —");
  for (const line of missing) console.error(`  ${line}`);
  process.exit(1);
}

writeFileSync(LANG, `${JSON.stringify(lang, null, 2)}\n`);
console.log(`vehicles-rename-lang: ${renamed} name(s) set, ${reflavoured} card(s) reflavoured, ${relabelled} UUID label(s) repointed`);
