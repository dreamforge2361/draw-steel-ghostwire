#!/usr/bin/env node
/**
 * Surgically refresh the rulebook journal pages a single chapter edit actually changed.
 *
 * **Why this exists.** `node tools/raw-to-journals.mjs` is a full regenerate of all 28 chapters, and
 * main's committed `src/packs/rulebook/` has drifted from `docs/raw/` — several chapters carry pages
 * the current tool no longer emits. A full run therefore sweeps hundreds of lines of unrelated
 * content deletions into whatever PR happens to be open, which is how a one-paragraph rules edit
 * turns into a 28-file diff. Re-syncing the pack properly deserves its own pass.
 *
 * So this tool does the narrow thing instead:
 *
 *   * re-parses the named chapters with **raw-to-journals' own `parseChapter` rules**, so the markdown
 *     and the rendered HTML come out byte-identical to what a real regenerate would produce;
 *   * **updates** committed pages matched by `name` — `text.markdown` and `text.content` only;
 *   * **appends** a parsed section that has no committed page, with the same stable `_id` a
 *     regenerate would give it (`stableId(file#index#name)`);
 *   * **never** writes an existing `_id`, and refuses to write at all if one would move;
 *   * leaves committed pages with no matching section alone, and names them as pre-existing drift.
 *
 * Run: `node tools/patch-rulebook-pages.mjs 21-the-wire 20-technomancer`   (dry run)
 *      `node tools/patch-rulebook-pages.mjs --apply 21-the-wire`           (write)
 *
 * Then rebuild the pack with Foundry closed: `node tools/build-packs.mjs rulebook`.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { foundryRequire } from "./lib/foundry-require.mjs";

const showdown = foundryRequire("showdown");
const SHOWDOWN_OPTIONS = { disableForced4SpacesIndentedSublists: true, noHeaderId: true, parseImgDimensions: true, strikethrough: true, tables: true, tablesHeaderId: true };
const converter = new showdown.Converter(SHOWDOWN_OPTIONS);

const MODULE_ID = "draw-steel-ghostwire";
const RAW = "docs/raw";
const OUT = "src/packs/rulebook";

const B62 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const stableId = seed => [...createHash("sha256").update("gw-rulebook:" + seed).digest()].slice(0, 16).map(b => B62[b % 62]).join("");
const uuid = file => `Compendium.${MODULE_ID}.rulebook.JournalEntry.${stableId(file)}`;

const rawFiles = readdirSync(RAW).filter(f => f.endsWith(".md") && f !== "00-INDEX.md").map(f => f.replace(/\.md$/, ""));
const titles = Object.fromEntries(rawFiles.map(f => [f, /^# (.+)$/m.exec(readFileSync(join(RAW, `${f}.md`), "utf8"))[1].trim()]));

/** Verbatim from tools/raw-to-journals.mjs. Keep the two in step. */
function parseChapter(file) {
  let md = readFileSync(join(RAW, `${file}.md`), "utf8").replace(/\r\n/g, "\n");
  md = md.replace(/^# .+\n+/, "");
  md = md.replace(/^\*\*RAW status:\*\* ([^\n]*?)\s*\n\*\*Sources:\*\* ([^\n]*?)\s*\n/, (m, status, sources) => `*RAW ${status.trim()} · Sources: ${sources.trim()}*\n\n`);
  md = md.replace(/^---\n/m, "");
  md = md.replace(/!\[[^\]]*]\([^)]+\)/g, "");
  md = md.replace(/<figure\b[\s\S]*?<\/figure>/gi, "");
  md = md.replace(/<img\b[^>]*>/gi, "");
  md = md.split("\n").map(line => (line.startsWith("*RAW ") ? line : line.replace(/`(\d{2}-[a-z0-9-]+)\.md`/g, (m, ref) => (titles[ref] ? `@UUID[${uuid(ref)}]{${titles[ref]}}` : m)))).join("\n");

  const sections = [];
  let current = { name: "Overview", lines: [] };
  let fence = false;
  for (const line of md.split("\n")) {
    if (/^```/.test(line)) fence = !fence;
    const h2 = !fence && /^## (.+)$/.exec(line);
    if (h2) { sections.push(current); current = { name: h2[1].trim(), lines: [] }; }
    else current.lines.push(line);
  }
  sections.push(current);
  return sections
    .map(s => ({ name: s.name.replace(/\*\*/g, ""), markdown: s.lines.join("\n").replace(/^\s*---\s*$/gm, "").replace(/\n{3,}/g, "\n\n").trim() }))
    .filter(s => s.markdown || s.name !== "Overview");
}

/** The page shape raw-to-journals emits, for a section that has no committed page yet. */
function newPage(entryId, file, index, section) {
  const _id = stableId(`${file}#${index}#${section.name}`);
  return {
    _id, _key: `!journal.pages!${entryId}.${_id}`,
    name: section.name, type: "text", sort: (index + 1) * 100000,
    title: { show: true, level: 1 }, image: {}, video: { controls: true, volume: 0.5 }, src: null, system: {},
    text: { format: 2, markdown: section.markdown, content: converter.makeHtml(section.markdown) },
    category: null, ownership: { default: -1 }, flags: {},
  };
}

/** `src/packs/rulebook/<folder>/<chapter>.json`, whichever folder holds it. */
function chapterPath(file) {
  for (const dir of readdirSync(OUT)) {
    const path = join(OUT, dir, `${file}.json`);
    if (existsSync(path)) return path;
  }
  return null;
}

const args = process.argv.slice(2);
const apply = args.includes("--apply");
const chapters = args.filter(a => a !== "--apply");
if (!chapters.length) {
  console.error("usage: node tools/patch-rulebook-pages.mjs [--apply] <chapter> [<chapter>...]");
  process.exit(2);
}

let moved = 0;
let touched = 0;
for (const file of chapters) {
  if (!rawFiles.includes(file)) {
    console.error(`  ! ${file}: no docs/raw/${file}.md`);
    moved += 1;
    continue;
  }
  const path = chapterPath(file);
  if (!path) {
    console.error(`  ! ${file}: no committed pack file under ${OUT}`);
    moved += 1;
    continue;
  }
  const entry = JSON.parse(readFileSync(path, "utf8"));
  const before = entry.pages.map(p => p._id).join(",");
  const parsed = parseChapter(file);
  const byName = new Map(parsed.map((s, i) => [s.name, { ...s, index: i }]));

  const updated = [];
  for (const page of entry.pages) {
    const section = byName.get(page.name);
    if (!section) continue;
    if (page.text?.markdown === section.markdown) continue;
    updated.push(page.name);
    page.text.markdown = section.markdown;
    page.text.content = converter.makeHtml(section.markdown);
  }

  const added = [];
  for (const [name, section] of byName) {
    if (entry.pages.some(p => p.name === name)) continue;
    const page = newPage(entry._id, file, section.index, section);
    entry.pages.push(page);
    added.push(`${name} (${page._id})`);
  }
  entry.pages.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));

  const orphans = entry.pages.filter(p => !byName.has(p.name)).map(p => p.name);
  const after = entry.pages.map(p => p._id);
  const stillThere = before.split(",").every(id => after.includes(id));
  if (!stillThere) {
    console.error(`  ! ${file}: an existing page _id would be dropped — refusing to write`);
    moved += 1;
    continue;
  }

  console.log(`${file} → ${path}`);
  console.log(`   updated: ${updated.join(" | ") || "none"}`);
  console.log(`   added:   ${added.join(" | ") || "none"}`);
  if (orphans.length) console.log(`   · committed pages with no RAW section (pre-existing drift, left alone): ${orphans.join(", ")}`);
  if (updated.length || added.length) {
    touched += 1;
    if (apply) writeFileSync(path, JSON.stringify(entry, null, 2) + "\n");
  }
}

console.log(apply ? `\nwritten — ${touched} chapter file(s)` : `\n(dry run — pass --apply to write; ${touched} chapter file(s) would change)`);
process.exit(moved ? 1 : 0);
