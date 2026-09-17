// Builds the Reach Events RollTable pack (src/packs/encounters/) from the authored rows in
// docs/masters/encounters/{flats,city,wilds}.md (B48), and regenerates the aggregate master list
// docs/masters/GHOSTWIRE_ENCOUNTER_TABLES.md so every row is readable in one place.
//
// Markdown contract (the tables are edited here, never in LevelDB):
//   # Reach Events — <zone title>
//   ## Flavor | RP | Complication | Action | Combat     <- result kind
//   ### Row Title
//   body sentences (1–3), then optional *Opposition:* and *Director:* lines
//
// One fat weighted table per zone: every row has weight 1, so the share of each kind is just its
// row count — the authored counts give roughly 40% flavor / 30% RP / 15% complication / 10% action
// / 5% combat, the spike's "quiet night" mix. Combat rows carry @UUID links to bestiary Actors;
// nothing auto-spawns, the Director drags the actor in.
//
// Run:  node tools/encounters-to-tables.mjs   then   node tools/build-packs.mjs   (Foundry closed)
import { createRequire } from "node:module";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { join } from "node:path";

const FOUNDRY_APP = process.env.FOUNDRY_APP ?? "C:/Program Files/Foundry Virtual Tabletop/resources/app";
const showdown = createRequire(join(FOUNDRY_APP, "package.json"))("showdown");
const converter = new showdown.Converter({ noHeaderId: true, strikethrough: true, tables: true, simpleLineBreaks: true });

const MODULE_ID = "draw-steel-ghostwire";
const SRC = "docs/masters/encounters";
const OUT = "src/packs/encounters";
const MASTER = "docs/masters/GHOSTWIRE_ENCOUNTER_TABLES.md";
const B62 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const stableId = seed => [...createHash("sha256").update("gw-encounters:" + seed).digest()].slice(0, 16).map(b => B62[b % 62]).join("");

const ZONES = [
  { file: "flats.md", key: "Flats", label: "Reach Events — Flats / Hive", img: "icons/environment/city/city-night.webp", min: 60 },
  { file: "city.md", key: "City", label: "Reach Events — City / Grid-adjacent", img: "icons/environment/city/skyline.webp", min: 50 },
  { file: "wilds.md", key: "Wilds", label: "Reach Events — Wilds / Outer Wall", img: "icons/environment/wilderness/tree-oak.webp", min: 20 },
];
const KINDS = ["Flavor", "RP", "Complication", "Action", "Combat"];

/** Parse one zone file into rows: { kind, title, body[] }. */
function parseZone(path) {
  const lines = readFileSync(path, "utf8").replace(/\r\n/g, "\n").split("\n");
  const rows = [];
  let kind = null, row = null;
  const flush = () => { if (row && row.body.join("").trim()) rows.push(row); row = null; };
  for (const line of lines) {
    const h2 = /^##\s+(.+?)\s*$/.exec(line);
    const h3 = /^###\s+(.+?)\s*$/.exec(line);
    if (h2 && !h3) { flush(); kind = h2[1].trim(); continue; }
    if (h3) { flush(); row = { kind, title: h3[1].trim(), body: [] }; continue; }
    if (row) row.body.push(line);
  }
  flush();
  return rows;
}

mkdirSync(OUT, { recursive: true });
for (const entry of readdirSync(OUT)) rmSync(join(OUT, entry), { recursive: true, force: true });

const lang = JSON.parse(readFileSync("lang/en.json", "utf8"));
const tablesLang = {};
const master = ["# Ghostwire — Reach event tables (B48)", "",
  "Source of record for the **Ghostwire Reach Events** RollTable compendium (`packs/encounters`).",
  "Edit the per-zone files under `docs/masters/encounters/`, then run `node tools/encounters-to-tables.mjs`",
  "and `node tools/build-packs.mjs` (Foundry closed). This file is generated — do not hand-edit it.", "",
  "Each zone is one weighted table. Every row has weight 1, so a kind's share of the table is simply its",
  "row count: the mix is deliberately quiet — mostly atmosphere and hooks, rarely a fight. Combat rows name",
  "real bestiary Actors by `@UUID` link; nothing auto-spawns.", ""];
const summary = [];

for (const [z, zone] of ZONES.entries()) {
  const path = join(SRC, zone.file);
  if (!existsSync(path)) throw new Error(`${path} missing — author the rows first`);
  const rows = parseZone(path);
  const unknown = rows.filter(r => !KINDS.includes(r.kind));
  if (unknown.length) throw new Error(`${zone.file}: unknown section(s) ${[...new Set(unknown.map(u => u.kind))].join(", ")}`);
  if (rows.length < zone.min) throw new Error(`${zone.file}: ${rows.length} rows, spike floor is ${zone.min}`);

  const tableId = stableId(zone.key);
  const results = rows.map((row, i) => {
    const markdown = row.body.join("\n").replace(/\n{3,}/g, "\n\n").trim();
    const _id = stableId(`${zone.key}:${i}:${row.title}`);
    return {
      _id, _key: `!tables.results!${tableId}.${_id}`,
      type: "text", name: row.title,
      description: converter.makeHtml(markdown),
      img: null, weight: 1, range: [i + 1, i + 1], drawn: false,
      flags: { [MODULE_ID]: { kind: row.kind.toLowerCase() } },
    };
  });

  const counts = Object.fromEntries(KINDS.map(k => [k, rows.filter(r => r.kind === k).length]));
  const nameKey = `GHOSTWIRE.Encounters.Tables.${zone.key}`;
  tablesLang[zone.key] = zone.label;

  writeFileSync(join(OUT, zone.file.replace(".md", ".json")), JSON.stringify({
    _id: tableId, _key: `!tables!${tableId}`,
    name: nameKey, img: zone.img,
    description: `<p>${rows.length} events: ${KINDS.map(k => `${counts[k]} ${k.toLowerCase()}`).join(" · ")}. Draw for atmosphere between scenes; combat rows name a bestiary Actor for the Director to place.</p>`,
    results, formula: `1d${rows.length}`, replacement: true, displayRoll: true,
    folder: null, sort: (z + 1) * 100000, ownership: { default: 0 }, flags: { [MODULE_ID]: { zone: zone.key.toLowerCase(), counts } },
  }, null, 2) + "\n");

  summary.push(`${zone.label}: ${rows.length} rows (${KINDS.map(k => `${k} ${counts[k]}`).join(", ")})`);
  master.push(`## ${zone.label}`, "", `Table formula \`1d${rows.length}\` · ${KINDS.map(k => `**${counts[k]}** ${k.toLowerCase()}`).join(" · ")}`, "");
  for (const k of KINDS) {
    master.push(`### ${k}`, "");
    for (const row of rows.filter(r => r.kind === k)) {
      const body = row.body.join(" ").replace(/\s+/g, " ").trim();
      master.push(`- **${row.title}** — ${body}`);
    }
    master.push("");
  }
}

writeFileSync(MASTER, master.join("\n") + "\n");
lang.GHOSTWIRE.COMPENDIUM.encounters = "Ghostwire Reach Events";
lang.GHOSTWIRE.Encounters = { Tables: tablesLang };
writeFileSync("lang/en.json", JSON.stringify(lang, null, 2) + "\n");
console.log(summary.join("\n"));
console.log(`master list: ${MASTER}`);
