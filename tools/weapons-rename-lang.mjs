#!/usr/bin/env node
/**
 * 0.3.134 (B) — write the weapon names, maker flavour and maker lore into lang/en.json.
 *
 * The pack rows under `src/packs/gear/weapons/**` store lang **keys** in `name` and
 * `system.description.value`, so the printed name of every gun in Ghostwire is one string in
 * `lang/en.json`. This tool is the thing that writes those strings, from the single table in
 * `scripts/weapon-rename.mjs`, which means:
 *
 *   * a rename cannot drift between the migration, the smoke and the card, because all three read
 *     the same table; and
 *   * running this again is a no-op, so it can be re-run after any hand edit to the descriptions
 *     without having to reason about what it will do.
 *
 * What each description gets:
 *   1. the flavour line rewritten to `New Name · Maker Model · what it is` (the *type* phrase is
 *      taken from whatever was already there, so no card loses its own words);
 *   2. for a renamed gun, one line saying what the street still calls it;
 *   3. one line of maker lore / rivalry for the house that builds it.
 *
 * Run: node tools/weapons-rename-lang.mjs   then   node tools/build-packs.mjs gear   (Foundry closed)
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { MAKERS, WEAPON_MAKERS } from "../scripts/weapon-rename.mjs";

const ROOT = ".";
const WEAPON_DIR = join(ROOT, "src/packs/gear/weapons");
const LANG = join(ROOT, "lang/en.json");
const MARK = "ghostwire-maker";

const walk = dir => readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
  const path = join(dir, entry.name);
  if (entry.isDirectory()) return walk(path);
  return (entry.name.endsWith(".json") && !entry.name.startsWith("_")) ? [path] : [];
});

const lang = JSON.parse(readFileSync(LANG, "utf8"));
const items = lang.GHOSTWIRE.Gear.Items;

let renamed = 0;
let reflavoured = 0;
const missing = [];

for (const path of walk(WEAPON_DIR)) {
  const doc = JSON.parse(readFileSync(path, "utf8"));
  const dsid = doc.system?._dsid;
  const row = WEAPON_MAKERS[dsid];
  if (!row) { missing.push(`${dsid} (${path})`); continue; }
  const entry = items[row.key];
  if (!entry) { missing.push(`lang GHOSTWIRE.Gear.Items.${row.key} for ${dsid}`); continue; }

  const maker = MAKERS[row.maker];
  const printed = row.name ?? entry.Name;
  if (entry.Name !== printed) { entry.Name = printed; renamed += 1; }

  // The flavour line is `Something · Something · what it is`. Keep the trailing "what it is" phrase —
  // that is the card's own description of the object and this tool has no better words for it.
  const flavour = /^<p><em>(.*?)<\/em><\/p>/.exec(entry.Description ?? "");
  if (!flavour) { missing.push(`flavour line for ${row.key}`); continue; }
  const parts = flavour[1].split("·").map(part => part.trim());
  const kind = parts.length >= 3 ? parts.slice(2).join(" · ") : "";
  // A gun already named for its house ("Ferrum Rivet") would otherwise read
  // "Ferrum Rivet · Ferrum Forgeworks Rivet". When the printed name already opens with the house,
  // the middle field is the house in full; otherwise it is the house plus its model designation.
  const housed = printed.split(/\s+/)[0] === maker.short.split(/\s+/)[0];
  const middle = housed ? maker.full : `${maker.short} ${row.model}`;
  const line = [printed, middle, kind].filter(Boolean).join(" · ");

  const street = row.name && row.old
    ? `<p class="${MARK}"><em>The street still calls it a <strong>${row.old}</strong>.</em> ${maker.lore}${row.extra ? ` ${row.extra}` : ""}</p>`
    : `<p class="${MARK}"><em>${maker.lore}</em>${row.extra ? ` ${row.extra}` : ""}</p>`;

  // Drop any block a previous run wrote, then re-add: that is what makes this idempotent.
  const body = String(entry.Description)
    .replace(/^<p><em>.*?<\/em><\/p>/, "")
    .replace(new RegExp(`<p class="${MARK}">.*?</p>`, "g"), "");
  const next = `<p><em>${line}</em></p>${street}${body}`;
  if (next !== entry.Description) { entry.Description = next; reflavoured += 1; }
}

if (missing.length) {
  console.error("weapons-rename-lang: unmapped rows —");
  for (const line of missing) console.error(`  ${line}`);
  process.exit(1);
}

writeFileSync(LANG, `${JSON.stringify(lang, null, 2)}\n`);
console.log(`weapons-rename-lang: ${renamed} name(s) set, ${reflavoured} description(s) reflavoured`);
