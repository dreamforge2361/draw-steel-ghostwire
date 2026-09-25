#!/usr/bin/env node
/**
 * 0.3.144 — move the ground chassis **catalog** names through the rules markdown, from the single
 * table in `scripts/vehicle-rename.mjs`.
 *
 * **What this deliberately does not do.** It does not blanket-replace old names in prose. The street
 * nickname is still the right word in lore — the card itself says "the street still calls it a Brick",
 * and the setting primer, the Reach handbook and the glossary are written in street voice. A global
 * find-and-replace would also eat the *tag* words: `Clunker` and `Cage` are a drone tag and a kiosk
 * shelf as well as chassis names, and `Brick` is a ration bar.
 *
 * So it edits three column-addressed places, and nothing else:
 *
 *   1. **The crewed inventory roster** — column 1 only, and only when the cell opens with a known old
 *      name. The cell becomes `Catalog Name (Street) / corp / sci`, which is what a Director reading
 *      the table needs: the name printed on the Foundry card, and the name their players will say.
 *   2. **The role quick-index and the scale-examples table** — the comma-separated chassis lists, by
 *      exact entry, so a role label spelled `Clunker / beater` is left alone.
 *   3. **The "In Foundry" callouts** — these name Items and Actors a Director has to find in a
 *      compendium, so they have to match the printed document name exactly.
 *
 * Run: node tools/vehicles-rename-docs.mjs            (dry run — prints every edit)
 *      node tools/vehicles-rename-docs.mjs --apply
 */
import { readFileSync, writeFileSync } from "node:fs";

import { CHASSIS_TEMPLATES, VEHICLE_MAKERS } from "../scripts/vehicle-rename.mjs";

const APPLY = process.argv.includes("--apply");

/**
 * `from` is the heading this pass may start at. `23-machines.md` opens with the **drone** roster, and
 * a drone called Rustbucket is a different machine from the ground car called Rustbucket — renaming
 * the quadrotor to "Nyx Primer" would be a straight-up data error, so the drone half is off limits.
 */
const FILES = [
  { path: "docs/raw/23-machines.md", from: /^## Vehicles\s*$/ },
  { path: "docs/rulebook/16-vehicles.md", from: null },
];

/** old → new, longest old first so "Lane Bus" cannot be eaten by a shorter row. */
const RENAMES = [...Object.values(VEHICLE_MAKERS), ...Object.values(CHASSIS_TEMPLATES)]
  .map(row => [row.old, row.name])
  .sort((a, b) => b[0].length - a[0].length);

const newFor = old => RENAMES.find(([from]) => from === old)?.[1] ?? null;
const escape = text => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** A markdown table row's cells, or null. */
const cells = line => (/^\|/.test(line.trim()) ? line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|") : null);
const rebuild = parts => `| ${parts.map(p => p.trim()).join(" | ")} |`;

/** Replace comma-separated chassis entries in a cell, matching the whole entry only. */
function renameList(cell) {
  return cell.split(",").map(entry => {
    const trimmed = entry.trim();
    // "Brick APC" / "Getaway hover" — the scale table qualifies a few entries with a trailing word.
    const hit = RENAMES.find(([from]) => trimmed === from || trimmed.startsWith(`${from} `));
    if (!hit) return entry;
    return entry.replace(new RegExp(`(^|\\s)${escape(hit[0])}(?=$|\\s)`), `$1${hit[1]}`);
  }).join(",");
}

let total = 0;

for (const { path: file, from } of FILES) {
  const before = readFileSync(file, "utf8");
  const eol = before.includes("\r\n") ? "\r\n" : "\n";
  const lines = before.split(/\r?\n/);
  const start = from ? lines.findIndex(line => from.test(line)) : 0;
  if (start < 0) throw new Error(`${file}: start heading ${from} not found`);
  const edits = [];

  lines.forEach((line, index) => {
    if (index < start) return;
    const parts = cells(line);
    let next = line;

    if (parts && parts.length >= 8) {
      // The crewed inventory roster: 12 columns, "Name (slang / corp / sci)" first.
      const name = parts[0].trim();
      const hit = RENAMES.find(([from]) => name === from || name.startsWith(`${from} /`));
      if (hit && !name.startsWith(hit[1])) {
        parts[0] = ` ${name.replace(hit[0], `${hit[1]} (${hit[0]})`)} `;
        next = rebuild(parts);
      }
    } else if (parts && parts.length === 2 && !/^\s*-+\s*$/.test(parts[1])) {
      // Two-column index tables: the second cell is a comma list of chassis.
      const renamed = renameList(parts[1]);
      if (renamed !== parts[1]) { parts[1] = renamed; next = rebuild(parts); }
    } else if (parts && parts.length === 3 && /^\s*\*\*(Light|Vehicle|Heavy|Personal|Micro|Capital|Small)\*\*\s*$/.test(parts[0])) {
      // The scale table: third cell is a comma list of examples.
      const renamed = renameList(parts[2]);
      if (renamed !== parts[2]) { parts[2] = renamed; next = rebuild(parts); }
    } else if (/^>\s/.test(line) && /Enable \*\*Draw Steel/.test(line)) {
      // The "In Foundry" callout names documents a Director has to find by name.
      for (const [old, name] of RENAMES) {
        next = next
          .replace(new RegExp(`(Item )\\*\\*${escape(old)}\\*\\*`, "g"), `$1**${name}**`)
          .replace(new RegExp(`(› )${escape(old)}(?= \\()`, "g"), `$1${name}`);
      }
    }

    if (next !== line) { edits.push([index + 1, line, next]); lines[index] = next; }
  });

  console.log(`${file} — ${edits.length} line(s)`);
  for (const [lineNo, from, to] of edits) {
    console.log(`  ${lineNo}: - ${from.slice(0, 150)}`);
    console.log(`  ${" ".repeat(String(lineNo).length)}  + ${to.slice(0, 150)}`);
  }
  total += edits.length;
  if (APPLY && edits.length) writeFileSync(file, lines.join(eol));
}

console.log(`\nvehicles-rename-docs: ${total} line(s) ${APPLY ? "written" : "(dry run — pass --apply)"}`);
