// Builds the Ghostwire Lore journal pack (src/packs/lore/) from docs/manuscript/01-lore/ (B98).
// One JournalEntry per L1–L5 harvest file, split into pages at "##". Artwork from
// ART-PLACEMENT.yml is injected after the matching heading when the file exists.
// Missing plates are skipped (no ART GAP boxes in Foundry) and listed in the spike / stdout.
//
// Run:  node tools/lore-to-journals.mjs   then   node tools/build-packs.mjs lore   (Foundry closed)
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";
import { foundryRequire } from "./lib/foundry-require.mjs";
import { parseYaml } from "./lib/simple-yaml.mjs";
import { megacorpIndexLinks, writeMegacorpJournals } from "./lib/megacorps-journals.mjs";

const showdown = foundryRequire("showdown");
const SHOWDOWN_OPTIONS = { disableForced4SpacesIndentedSublists: true, noHeaderId: true, parseImgDimensions: true, strikethrough: true, tables: true, tablesHeaderId: true };
const converter = new showdown.Converter(SHOWDOWN_OPTIONS);

const MODULE_ID = "draw-steel-ghostwire";
const SRC = "docs/manuscript/01-lore";
const PLACEMENT = "docs/manuscript/print-art/ART-PLACEMENT.yml";
const OUT = "src/packs/lore";
const CREDIT = "Ghostwire AI (AI-generated)";
const IMAGE_EXT = new Set([".webp", ".png", ".jpg", ".jpeg", ".gif"]);
const B62 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const stableId = seed => [...createHash("sha256").update("gw-lore:" + seed).digest()].slice(0, 16).map(b => B62[b % 62]).join("");
const read = p => readFileSync(p, "utf8").replace(/\r\n/g, "\n");

const FOLDERS = [
  { key: "Setting", id: "gwLorePackSet000", dir: "setting", label: "Setting Primer", files: ["L1-setting-primer"] },
  { key: "Peoples", id: "gwLorePackPeople", dir: "peoples", label: "Peoples & World", files: ["L2-peoples-and-world"] },
  { key: "Reach", id: "gwLorePackReach0", dir: "reach", label: "Ossian Reach", files: ["L3-ossian-reach-color"] },
  { key: "Factions", id: "gwLorePackFact00", dir: "factions", label: "VOIDMARK & Accords", files: ["L4-voidmark", "L5-hands-off-accords"] },
];

const FILE_CHAPTER = {
  "L1-setting-primer": "L1",
  "L2-peoples-and-world": "L2",
  "L3-ossian-reach-color": "L3",
  "L4-voidmark": "L4",
  "L5-hands-off-accords": "L5",
};

const langKey = file => file.replace(/^L\d+-/, "").split("-").map(w => w[0].toUpperCase() + w.slice(1)).join("");

function isImageFile(abs) {
  return existsSync(abs) && statSync(abs).isFile() && IMAGE_EXT.has(extname(abs).toLowerCase());
}

function tryAltExtensions(abs) {
  if (isImageFile(abs)) return abs;
  const base = abs.replace(/\.[^.]+$/, "");
  for (const ext of [".webp", ".png", ".jpg", ".jpeg", ".gif"]) {
    const cand = base + ext;
    if (isImageFile(cand)) return cand;
  }
  return null;
}

function scoreName(filename, match) {
  if (!match) return 0;
  const n = basename(filename, extname(filename)).toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const m = String(match).toLowerCase().replace(/[^a-z0-9]+/g, "-");
  if (!m) return 0;
  if (n === m) return 100;
  if (n.startsWith(`${m}-`) || n.endsWith(`-${m}`) || n.includes(`-${m}-`)) return 80;
  if (n.includes(m)) return 50;
  return 0;
}

function toRel(abs) {
  const root = resolve(".").replace(/\\/g, "/");
  const norm = abs.replace(/\\/g, "/");
  return norm.startsWith(`${root}/`) ? norm.slice(root.length + 1) : norm;
}

function resolveArt(slot) {
  const files = Array.isArray(slot.files) ? slot.files : slot.file ? [slot.file] : [];
  for (const rel of files) {
    const hit = tryAltExtensions(resolve(rel));
    if (hit) return { status: "placed", rel: toRel(hit) };
  }
  const dirs = Array.isArray(slot.search_dirs) ? slot.search_dirs : [];
  let best = null;
  for (const dirRel of dirs) {
    const dir = resolve(dirRel);
    if (!existsSync(dir) || !statSync(dir).isDirectory()) continue;
    for (const name of readdirSync(dir)) {
      const abs = join(dir, name);
      if (!isImageFile(abs)) continue;
      const score = scoreName(name, slot.match);
      if (score < 50) continue;
      if (!best || score > best.score) best = { score, rel: toRel(abs) };
    }
  }
  if (best) return { status: "placed", rel: best.rel };
  return { status: "gap", expected: files[0] || (dirs[0] && slot.match ? `${dirs[0]}/*${slot.match}*` : "(no file listed)") };
}

function figureMarkdown(slot, rel) {
  const alt = slot.caption || slot.title || slot.id;
  const src = `modules/${MODULE_ID}/${rel}`;
  return `![${alt}](${src})\n\n*${alt} — ${CREDIT}*`;
}

function insertAfterHeading(md, heading, block) {
  const lines = md.split("\n");
  const h = heading.trim();
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trimEnd();
    if (line === h || line.startsWith(h)) {
      let insertAt = i + 1;
      while (insertAt < lines.length && lines[insertAt].trim() === "") insertAt++;
      lines.splice(insertAt, 0, "", block, "");
      return { ok: true, text: lines.join("\n") };
    }
  }
  return { ok: false, text: md };
}

function injectArt(md, chapterId, mapping) {
  const slots = mapping.filter(s => s.chapter_id === chapterId);
  const placed = [];
  const gaps = [];
  let next = md;
  for (const slot of slots) {
    const resolved = resolveArt(slot);
    if (resolved.status !== "placed") {
      gaps.push({ id: slot.id, heading: slot.after_heading, expected: resolved.expected });
      continue;
    }
    const block = figureMarkdown(slot, resolved.rel);
    if (slot.after_heading) {
      const inserted = insertAfterHeading(next, slot.after_heading, block);
      if (!inserted.ok) {
        gaps.push({ id: slot.id, heading: slot.after_heading, expected: `heading miss: ${slot.after_heading}` });
        continue;
      }
      next = inserted.text;
    } else {
      next = `${block}\n\n${next}`;
    }
    placed.push({ id: slot.id, rel: resolved.rel, heading: slot.after_heading || "(opener)" });
  }
  return { markdown: next, placed, gaps };
}

function parseChapter(md) {
  let body = md.replace(/^# .+\n+/, "");
  body = body.replace(/^---\n/m, "");
  const sections = [];
  let current = { name: "Overview", lines: [] };
  let fence = false;
  for (const line of body.split("\n")) {
    if (/^```/.test(line)) fence = !fence;
    const h2 = !fence && /^## (.+)$/.exec(line);
    if (h2) {
      sections.push(current);
      current = { name: h2[1].trim().replace(/\*\*/g, ""), lines: [] };
    } else current.lines.push(line);
  }
  sections.push(current);
  return sections
    .map(s => ({ name: s.name, markdown: s.lines.join("\n").replace(/\n{3,}/g, "\n\n").trim() }))
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

for (const folder of FOLDERS) {
  if (!/^[A-Za-z0-9]{16}$/.test(folder.id)) throw new Error(`Folder id "${folder.id}" must be 16 alphanumeric characters`);
}

const loreFiles = readdirSync(SRC).filter(f => /^L\d+-.*\.md$/.test(f)).map(f => f.replace(/\.md$/, ""));
const mapped = FOLDERS.flatMap(f => f.files);
const missing = mapped.filter(f => !loreFiles.includes(f));
const unmapped = loreFiles.filter(f => !mapped.includes(f));
if (missing.length || unmapped.length) throw new Error(`Lore mapping mismatch — missing: ${missing} · unmapped: ${unmapped}`);

const placement = parseYaml(read(PLACEMENT));
const slots = Array.isArray(placement.slots) ? placement.slots : [];
const titles = Object.fromEntries(loreFiles.map(f => [f, /^# (.+)$/m.exec(read(join(SRC, `${f}.md`)))[1].trim()]));

mkdirSync(OUT, { recursive: true });
for (const entry of readdirSync(OUT)) rmSync(join(OUT, entry), { recursive: true, force: true });

const lang = JSON.parse(readFileSync("lang/en.json", "utf8"));
const loreLang = { Folders: {}, Journals: {} };
const artLog = { placed: [], gaps: [] };
let pages = 0;

FOLDERS.forEach((folder, fi) => {
  const dir = join(OUT, folder.dir);
  mkdirSync(dir, { recursive: true });
  loreLang.Folders[folder.key] = folder.label;
  writeFileSync(join(dir, "_folder.json"), JSON.stringify({
    _id: folder.id, _key: `!folders!${folder.id}`, name: `GHOSTWIRE.Lore.Folders.${folder.key}`,
    type: "JournalEntry", folder: null, sort: (fi + 1) * 100000, flags: {}, color: null, description: "", sorting: "m",
  }, null, 2) + "\n");

  if (folder.key === "Setting") {
    const rows = FOLDERS.map(f => `| ${f.label} | ${f.files.map(x => `@UUID[Compendium.${MODULE_ID}.lore.JournalEntry.${stableId(x)}]{${titles[x]}}`).join(" · ")} |`).join("\n");
    const markdown = [
      "Ghostwire setting harvest for the table: cosmology, peoples, Reach street color, Ten Conglomerates, VOIDMARK, and the Hands Off Accords.",
      "",
      "This pack is **lore, not rules**. Procedures live in the **Ghostwire Rulebook**. District maps and Handbook gazetteer pages live in **Ghostwire — Ossian Reach Handbook**. Matrix nodes live in **Ghostwire — The Wired: Flats**.",
      "",
      "Artwork that ships with the module is placed on the matching heading. Peoples plates that are still local Dropbox files are skipped — they are not invented. Megacorp brand marks are ticker cards only (`docs/rulebook/MEGACORP-TICKERS.md`) — not deep corp profiles.",
      "",
      "| Section | Journals |",
      "|---|---|",
      rows,
      `| Ten Conglomerates | ${megacorpIndexLinks()} |`,
    ].join("\n");
    loreLang.Journals.LoreIndex = "Lore Index";
    const entryId = stableId("lore-index");
    const entry = {
      _id: entryId, _key: `!journal!${entryId}`,
      name: "GHOSTWIRE.Lore.Journals.LoreIndex",
      folder: folder.id, sort: 0, categories: [],
      pages: [page(entryId, "lore-index", 0, { name: "Lore Index", markdown })],
      ownership: { default: 0 },
      flags: { [MODULE_ID]: { source: "docs/manuscript/01-lore/" } },
    };
    writeFileSync(join(dir, "lore-index.json"), JSON.stringify(entry, null, 2) + "\n");
    pages += 1;
  }

  folder.files.forEach((file, i) => {
    const chapterId = FILE_CHAPTER[file];
    const raw = read(join(SRC, `${file}.md`));
    const injected = injectArt(raw, chapterId, slots);
    artLog.placed.push(...injected.placed.map(p => ({ ...p, file })));
    artLog.gaps.push(...injected.gaps.map(g => ({ ...g, file })));
    const key = langKey(file);
    loreLang.Journals[key] = titles[file];
    const sections = parseChapter(injected.markdown);
    const entryId = stableId(file);
    const entry = {
      _id: entryId, _key: `!journal!${entryId}`,
      name: `GHOSTWIRE.Lore.Journals.${key}`,
      folder: folder.id, sort: (i + 1) * 100000, categories: [],
      pages: sections.map((s, n) => page(entryId, file, n, s)),
      ownership: { default: 0 },
      flags: { [MODULE_ID]: { source: `${SRC}/${file}.md` } },
    };
    pages += entry.pages.length;
    writeFileSync(join(dir, `${file}.json`), JSON.stringify(entry, null, 2) + "\n");
  });
});

const megaLang = writeMegacorpJournals(OUT);
Object.assign(loreLang.Folders, megaLang.Folders);
Object.assign(loreLang.Journals, megaLang.Journals);

lang.GHOSTWIRE.COMPENDIUM.lore = "Ghostwire Lore";
lang.GHOSTWIRE.Lore = loreLang;
writeFileSync("lang/en.json", JSON.stringify(lang, null, 2) + "\n");

console.log(`lore: ${mapped.length + 1 + 10} journals, ${pages + 10} pages, ${FOLDERS.length + 1} folders`);
console.log(`art placed: ${artLog.placed.length}`);
for (const p of artLog.placed) console.log(`  PLACED  ${p.id}  →  ${p.rel}  (${p.heading})`);
console.log(`art gaps: ${artLog.gaps.length}`);
for (const g of artLog.gaps) console.log(`  GAP     ${g.id}  ${g.expected}`);
