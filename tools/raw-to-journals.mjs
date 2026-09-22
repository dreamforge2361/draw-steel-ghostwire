// Generates the Ghostwire Rulebook journal pack source (src/packs/rulebook/) from docs/raw/*.md (B42b / B98).
// docs/raw/ stays the single source of truth: one JournalEntry per chapter file, one page per "## " section,
// markdown pages (format 2) with HTML rendered by Foundry's own showdown + SHOWDOWN_OPTIONS.
// Chapter file references (`12-operator.md`) become @UUID links; journal and folder names are lang keys
// under GHOSTWIRE.Rulebook.*, written to lang/en.json by this script.
// Rules journals are text-only: artwork plates are stripped. In Foundry sidebars stay in the RAW text.
// Run:  node tools/raw-to-journals.mjs   then   node tools/build-packs.mjs rulebook   (Foundry closed)
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { foundryRequire } from "./lib/foundry-require.mjs";

const showdown = foundryRequire("showdown");
const SHOWDOWN_OPTIONS = { disableForced4SpacesIndentedSublists: true, noHeaderId: true, parseImgDimensions: true, strikethrough: true, tables: true, tablesHeaderId: true };
const converter = new showdown.Converter(SHOWDOWN_OPTIONS);

const MODULE_ID = "draw-steel-ghostwire";
const RAW = "docs/raw";
const OUT = "src/packs/rulebook";

const FOLDERS = [
  { id: "gwRulebookFront0", dir: "front-matter", key: "FrontMatter", label: "Front Matter", files: ["00-front-matter"] },
  { id: "gwRulebookCore00", dir: "shared-core", key: "SharedCore", label: "Shared Core", files: ["01-how-to-play", "02-heroes-characteristics", "03-tests-power-rolls", "04-combat", "24-advancement"] },
  { id: "gwRulebookHeroes", dir: "hero-building", key: "HeroBuilding", label: "Hero Building", files: ["05-ancestries", "06-backgrounds-professions", "07-languages", "08-kits-gear-wealth", "09-chrome-body-integrity", "10-mods", "11-perks"] },
  { id: "gwRulebookClass0", dir: "classes", key: "Classes", label: "Classes", files: ["12-operator", "13-scout", "14-commander", "15-medic", "16-wrench", "17-elementalist", "18-street-priest", "19-hacker", "20-technomancer"] },
  { id: "gwRulebookSystem", dir: "ghostwire-systems", key: "GhostwireSystems", label: "Ghostwire Systems", files: ["21-the-wire", "22-the-veil", "27-corruption-taint", "23-machines", "25-opposition", "26-lifestyle-downtime", "28-constructs-pets-faq"] },
];

const B62 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const stableId = seed => [...createHash("sha256").update("gw-rulebook:" + seed).digest()].slice(0, 16).map(b => B62[b % 62]).join("");
const langKey = file => file.replace(/^\d+-/, "").split("-").map(w => w[0].toUpperCase() + w.slice(1)).join("");
const uuid = file => `Compendium.${MODULE_ID}.rulebook.JournalEntry.${stableId(file)}`;

// Every mapped chapter must exist, and every chapter in docs/raw must be mapped.
const rawFiles = readdirSync(RAW).filter(f => f.endsWith(".md") && f !== "00-INDEX.md").map(f => f.replace(/\.md$/, ""));
const mapped = FOLDERS.flatMap(f => f.files);
const missing = mapped.filter(f => !rawFiles.includes(f));
const unmapped = rawFiles.filter(f => !mapped.includes(f));
if (missing.length || unmapped.length) throw new Error(`RAW mapping mismatch — missing: ${missing} · unmapped: ${unmapped}`);

const titles = Object.fromEntries(rawFiles.map(f => [f, /^# (.+)$/m.exec(readFileSync(join(RAW, `${f}.md`), "utf8"))[1].trim()]));

/** RAW markdown → { intro, sections: [{ name, markdown }] } with header tidied and chapter refs linked. */
function parseChapter(file) {
  let md = readFileSync(join(RAW, `${file}.md`), "utf8").replace(/\r\n/g, "\n");
  md = md.replace(/^# .+\n+/, "");
  // "**RAW status:** draft  \n**Sources:** …" → one italic transparency line.
  md = md.replace(/^\*\*RAW status:\*\* ([^\n]*?)\s*\n\*\*Sources:\*\* ([^\n]*?)\s*\n/, (m, status, sources) => `*RAW ${status.trim()} · Sources: ${sources.trim()}*\n\n`);
  md = md.replace(/^---\n/m, "");
  // B98 lock: rules journals stay text-only. Do not ship print plates into the rulebook pack.
  md = md.replace(/!\[[^\]]*]\([^)]+\)/g, "");
  md = md.replace(/<figure\b[\s\S]*?<\/figure>/gi, "");
  md = md.replace(/<img\b[^>]*>/gi, "");
  // Chapter references → links to the matching journal (skip anything inside the Sources line).
  md = md.split("\n").map(line => (line.startsWith("*RAW ") ? line : line.replace(/`(\d{2}-[a-z0-9-]+)\.md`/g, (m, ref) => (titles[ref] ? `@UUID[${uuid(ref)}]{${titles[ref]}}` : m)))).join("\n");

  const sections = [];
  let current = { name: "Overview", lines: [] };
  let fence = false;
  for (const line of md.split("\n")) {
    if (/^```/.test(line)) fence = !fence;
    const h2 = !fence && /^## (.+)$/.exec(line);
    if (h2) {
      sections.push(current);
      current = { name: h2[1].trim(), lines: [] };
    } else current.lines.push(line);
  }
  sections.push(current);
  return sections
    .map(s => ({ name: s.name.replace(/\*\*/g, ""), markdown: s.lines.join("\n").replace(/^\s*---\s*$/gm, "").replace(/\n{3,}/g, "\n\n").trim() }))
    .filter(s => s.markdown || s.name !== "Overview");
}

function page(entryId, file, index, section) {
  const _id = stableId(`${file}#${index}#${section.name}`);
  return {
    _id, _key: `!journal.pages!${entryId}.${_id}`,
    name: section.name, type: "text", sort: (index + 1) * 100000,
    title: { show: true, level: 1 }, image: {}, video: { controls: true, volume: 0.5 }, src: null, system: {},
    text: { format: 2, markdown: section.markdown, content: converter.makeHtml(section.markdown) },
    category: null, ownership: { default: -1 }, flags: {},
  };
}

function journal(file, folder, sort, sections, key) {
  const _id = stableId(file);
  return {
    _id, _key: `!journal!${_id}`,
    name: `GHOSTWIRE.Rulebook.Journals.${key}`,
    folder: folder.id, sort, categories: [],
    pages: sections.map((s, i) => page(_id, file, i, s)),
    ownership: { default: 0 },
    flags: { [MODULE_ID]: { raw: `docs/raw/${file}.md` } },
  };
}

// Clear the output's contents, not the folder itself (Dropbox can hold a handle on the folder).
mkdirSync(OUT, { recursive: true });
for (const entry of readdirSync(OUT)) rmSync(join(OUT, entry), { recursive: true, force: true });
const lang = JSON.parse(readFileSync("lang/en.json", "utf8"));
const rulebookLang = { Folders: {}, Journals: {} };
let pages = 0;

FOLDERS.forEach((folder, fi) => {
  const dir = join(OUT, folder.dir);
  mkdirSync(dir, { recursive: true });
  rulebookLang.Folders[folder.key] = folder.label;
  writeFileSync(join(dir, "_folder.json"), JSON.stringify({
    _id: folder.id, _key: `!folders!${folder.id}`, name: `GHOSTWIRE.Rulebook.Folders.${folder.key}`,
    type: "JournalEntry", folder: null, sort: (fi + 1) * 100000, flags: {}, color: null, description: "", sorting: "m",
  }, null, 2) + "\n");

  // Front Matter opens with a short Rulebook Index linking every chapter.
  if (folder.key === "FrontMatter") {
    const rows = FOLDERS.map(f => `| ${f.label} | ${f.files.map(x => `@UUID[${uuid(x)}]{${titles[x]}}`).join(" · ")} |`).join("\n");
    const markdown = `The Ghostwire rules-as-written: one journal per chapter. Rules only — no lore, no art. Every chapter is marked **draft** until it is locked.\n\nPlay from this book plus dice (Foundry optional). You do **not** need a separate rulebook. Start with @UUID[${uuid("00-front-matter")}]{${titles["00-front-matter"]}}.\n\n| Section | Chapters |\n|---|---|\n${rows}`;
    rulebookLang.Journals.RulebookIndex = "Rulebook Index";
    const entry = journal("rulebook-index", folder, 0, [{ name: "Rulebook Index", markdown }], "RulebookIndex");
    writeFileSync(join(dir, "rulebook-index.json"), JSON.stringify(entry, null, 2) + "\n");
    pages += 1;
  }

  folder.files.forEach((file, i) => {
    const key = langKey(file);
    rulebookLang.Journals[key] = titles[file];
    const entry = journal(file, folder, (i + 1) * 100000, parseChapter(file), key);
    pages += entry.pages.length;
    writeFileSync(join(dir, `${file}.json`), JSON.stringify(entry, null, 2) + "\n");
  });
});

// Lang: GHOSTWIRE.COMPENDIUM.rulebook + GHOSTWIRE.Rulebook.{Folders,Journals}.
lang.GHOSTWIRE.COMPENDIUM.rulebook = "Ghostwire Rulebook";
lang.GHOSTWIRE.Rulebook = rulebookLang;
writeFileSync("lang/en.json", JSON.stringify(lang, null, 2) + "\n");
console.log(`rulebook: ${mapped.length + 1} journals, ${pages} pages, ${FOLDERS.length} folders`);
