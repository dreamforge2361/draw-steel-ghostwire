// Generates the Wired: Flats gazetteer journal pack source (src/packs/wired-flats/) from
// docs/setting/wired-flats-gazetteer.md (B46). Lore, not RAW — the Wire rules live in docs/raw/21-the-wire.md.
//
// The source is plain text extracted from Word, so structure is inferred, not marked up:
//   * "I." … "V." lines open a section;
//   * a node entry is any line immediately followed by "Echelon:", then its labelled lines;
//   * a POI category is a line immediately followed by "Node" (the pseudo-table header),
//     whose rows are six consecutive lines (Node / Echelon / Owner / Vibe / Score / Hook).
// Pages are markdown (format 2) plus HTML rendered by Foundry's own showdown, as in raw-to-journals.mjs.
// Run:  node tools/wired-flats-to-journals.mjs   then   node tools/build-packs.mjs   (Foundry closed)
import { createRequire } from "node:module";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const FOUNDRY_APP = process.env.FOUNDRY_APP ?? "C:/Program Files/Foundry Virtual Tabletop/resources/app";
const showdown = createRequire(join(FOUNDRY_APP, "package.json"))("showdown");
const SHOWDOWN_OPTIONS = { disableForced4SpacesIndentedSublists: true, noHeaderId: true, parseImgDimensions: true, strikethrough: true, tables: true, tablesHeaderId: true };
const converter = new showdown.Converter(SHOWDOWN_OPTIONS);

const MODULE_ID = "draw-steel-ghostwire";
const SRC = "docs/setting/wired-flats-gazetteer.md";
const OUT = "src/packs/wired-flats";
const ENTRY_LABELS = ["Echelon:", "Owner:", "Vibe:", "What to score:", "Plot hook:"];
const POI_COLUMNS = ["Node", "Echelon", "Owner", "Vibe", "Score", "Hook"];

const B62 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const stableId = seed => [...createHash("sha256").update("gw-wired-flats:" + seed).digest()].slice(0, 16).map(b => B62[b % 62]).join("");
const esc = s => s.replace(/\|/g, "\\|");

const lines = readFileSync(SRC, "utf8").replace(/\r\n/g, "\n").split("\n").map(l => l.trim());

/** Node entry: a title line followed by the five labelled lines. */
function readEntry(i) {
  const title = lines[i];
  const fields = [];
  let j = i + 1;
  while (j < lines.length && ENTRY_LABELS.some(l => lines[j].startsWith(l))) {
    const [label, ...rest] = lines[j].split(":");
    fields.push([label.trim(), rest.join(":").trim()]);
    j++;
  }
  const md = [`### ${title}`, "", ...fields.map(([k, v]) => `**${k}:** ${v}`), ""].join("\n");
  return { md, next: j };
}

/** POI category: a title line, the six column headers, then six-line rows until a blank line. */
function readPoiTable(i) {
  const title = lines[i];
  let j = i + 1 + POI_COLUMNS.length;
  const rows = [];
  while (j < lines.length && lines[j] !== "" && !lines[j].startsWith("V.")) {
    const row = lines.slice(j, j + POI_COLUMNS.length);
    if (row.length < POI_COLUMNS.length || row.some(c => c === "")) break;
    rows.push(row);
    j += POI_COLUMNS.length;
  }
  const md = [
    `### ${title}`, "",
    `| ${POI_COLUMNS.join(" | ")} |`,
    `|${POI_COLUMNS.map(() => "---").join("|")}|`,
    ...rows.map(r => `| ${r.map(esc).join(" | ")} |`), "",
  ].join("\n");
  return { md, title, next: j };
}

// ---- Walk the gazetteer into pages.
const pages = [];
let intro = [];           // "How to read this gazetteer" prose, before section I
let current = null;       // section page being filled
const push = () => { if (current && current.md.trim()) pages.push(current); };

for (let i = 0; i < lines.length;) {
  const line = lines[i];
  const next = lines[i + 1] ?? "";

  if (/^[IVX]+\. /.test(line)) {           // new top-level section
    push();
    current = { name: line.replace(/^[IVX]+\.\s*/, "").replace(/\s*\(GM Notes\)$/, " (Director notes)"), md: "" };
    i++;
    continue;
  }
  if (next === "Echelon:" || next.startsWith("Echelon:")) {
    const { md, next: j } = readEntry(i);
    (current ?? { md: "" }).md += md + "\n";
    i = j;
    continue;
  }
  if (next === "Node" && current) {         // POI category → its own page
    push();
    const { md, title, next: j } = readPoiTable(i);
    current = { name: title.replace(/\s*\(.*\)$/, ""), md };
    push();
    current = { name: "The POI Swarm (continued)", md: "" };
    i = j;
    continue;
  }
  if (line === "") { i++; continue; }

  if (current) current.md += line + "\n\n";
  else intro.push(line);
  i++;
}
push();

// ---- How to Read: title block + the E1–E4 posture table, rebuilt from the flat lines.
const headerEnd = intro.findIndex(l => l.startsWith("How to read"));
const title = intro.slice(0, headerEnd);
const rest = intro.slice(headerEnd + 1);
const gradeAt = rest.findIndex(l => l === "Echelon");
const grades = rest.slice(gradeAt + 3, gradeAt + 3 + 12);   // 4 grades × 3 cells
const tail = rest.slice(gradeAt + 3 + 12);
const howToRead = [
  `*${title.slice(2).join(" — ")}*`, "",
  ...rest.slice(0, gradeAt), "",
  "| Echelon | Security posture | What a runner faces |",
  "|---|---|---|",
  ...[0, 3, 6, 9].map(n => `| **${grades[n]}** | ${esc(grades[n + 1])} | ${esc(grades[n + 2])} |`), "",
  ...tail, "",
  "**Echelon here is a node's ICE grade, not a hero's progression.** Hero levels and echelons are in the rulebook (`24-advancement`); a node's own defence grade is its **Node Rating** (1–5, `21-the-wire`). The E1–E4 posture below describes the ICE a runner meets at the door.",
  "",
  "**Director's notes.** Names here that have stats or tools elsewhere: **Mama Cassavir**, **Warden Krael** and the ICE constructs are in the Ghostwire Bestiary; district strata feed the Director Run Generator; node stat cards come from the System Stat Card in The Wire (`21-the-wire`).",
].join("\n");
pages.unshift({ name: "How to Read This Gazetteer", md: howToRead });

// Word lost the bold lead-ins on the Director-notes paragraphs ("Downtime dives. …") — restore them.
const boldLeadIns = md => md.split("\n").map(l => {
  const m = /^([A-Z][^.]{3,45}\.)\s+(\S.*)$/.exec(l);
  return m ? `**${m[1]}** ${m[2]}` : l;
}).join("\n");
for (const p of pages) if (/RUNNING THE MATRIX/i.test(p.name)) p.md = boldLeadIns(p.md);

// The source shouts its section names; the sidebar reads better in title case.
const TITLES = {
  "THE GRID & THE BARRIER": "The Grid & The Barrier",
  "DISTRICT MASTER NODES": "District Master Nodes",
  "CORPORATE FORTRESS-NODES": "Corporate Fortress-Nodes",
  "THE POI SWARM — Street-Level Nodes": "The POI Swarm — Street-Level Nodes",
  "RUNNING THE MATRIX-SCAPE (Director notes)": "Running the Matrix-Scape (Director notes)",
};
for (const p of pages) p.name = TITLES[p.name] ?? p.name;

// Light rules scrub only — the lore stays. "Tier" as hero progression is not Ghostwire language
// (levels and echelons are, per docs/raw/24-advancement.md); "street tier" in the Director notes is
// narrative scale, not a rules ladder, so it is left alone.
const SCRUBS = [
  ["not the tier of the people who run it", "not the level or echelon of the people who run it"],
  ["The vertical rule (canon):", "**The vertical rule (canon):**"],
  ["Canon note (districts):", "**Canon note (districts):**"],
  ["Canon sources:", "**Canon sources:**"],
];
for (const p of pages) for (const [from, to] of SCRUBS) if (!p.md.includes(to)) p.md = p.md.split(from).join(to);

const kept = pages.filter(p => p.md.trim() && p.name !== "The POI Swarm (continued)");

// ---- Write one JournalEntry with a page per section.
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
const entryId = stableId("wired-flats");
const entry = {
  _id: entryId, _key: `!journal!${entryId}`,
  name: "GHOSTWIRE.WiredFlats.Journals.Gazetteer",
  folder: null, sort: 100000, categories: [],
  pages: kept.map((p, i) => {
    const _id = stableId(`page:${i}:${p.name}`);
    const markdown = p.md.replace(/\n{3,}/g, "\n\n").trim();
    return {
      _id, _key: `!journal.pages!${entryId}.${_id}`,
      name: p.name, type: "text", sort: (i + 1) * 100000,
      title: { show: true, level: 1 }, image: {}, video: { controls: true, volume: 0.5 }, src: null, system: {},
      text: { format: 2, markdown, content: converter.makeHtml(markdown) },
      category: null, ownership: { default: -1 }, flags: {},
    };
  }),
  ownership: { default: 0 },
  flags: { [MODULE_ID]: { source: SRC } },
};
writeFileSync(join(OUT, "wired-flats-gazetteer.json"), JSON.stringify(entry, null, 2) + "\n");

// ---- Lang: pack label + journal name.
const lang = JSON.parse(readFileSync("lang/en.json", "utf8"));
lang.GHOSTWIRE.COMPENDIUM.wiredFlats = "Ghostwire — The Wired: Flats";
lang.GHOSTWIRE.WiredFlats = { Journals: { Gazetteer: "The Wired — The Flats: Matrix Gazetteer" } };
writeFileSync("lang/en.json", JSON.stringify(lang, null, 2) + "\n");
console.log(`wired-flats: 1 journal, ${kept.length} pages`);
console.log(kept.map((p, i) => `  ${i + 1}. ${p.name}`).join("\n"));
