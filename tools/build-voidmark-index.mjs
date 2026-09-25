#!/usr/bin/env node
/**
 * Build data/voidmark-rules-index.json — Ghostwire knowledge index
 * (RAW procedures + Reach / Flats setting lore + manuscript L-chips).
 * Skips front matter / INDEX / handbook extract notes so player-facing
 * retrieve stays Ghostwire-only (B92).
 *
 * B122 / S6: every chunk carries `audience: "player" | "director"`. Anything
 * under docs/directors/** or docs/manuscript/03-directors/** is a Director
 * campaign aid and never reaches a player or Runner-mode retrieve.
 *
 * 0.3.135 (3a): the packs are ingested too — all 418 abilities, all 46 ritual
 * Workings and all 68 summon / machine Actors, one entry per card, rendered by
 * tools/lib/pack-entries.mjs straight off the src pack JSON. Before this, VOIDMARK
 * had the chapter that *describes* rituals and no entry for Ward the Room, so a
 * question about a specific card had nothing to land on.
 *
 * Run: node tools/build-voidmark-index.mjs
 */
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { PACK_FILES, packEntries, packEntryCounts } from "./lib/pack-entries.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const RAW_DIR = join(ROOT, "docs/raw");
const LORE_DIR = join(ROOT, "docs/manuscript/01-lore");
const HANDBOOK_DIR = join(ROOT, "docs/setting/reach-handbook");
const OUT = join(ROOT, "data/voidmark-rules-index.json");

const SKIP_RAW = new Set(["00-INDEX.md", "00-front-matter.md"]);
const SKIP_HANDBOOK = new Set(["EXTRACT-NOTES.md", "ART-INDEX.md"]);
const SKIP_LORE = new Set(["README.md"]);

/** Extra setting pages (gazetteer + Director Reach pointer). */
const SETTING_PAGES = [
  "docs/setting/wired-flats-gazetteer.md",
  "docs/manuscript/03-directors/27-running-ossian-reach.md",
  "docs/manuscript/04-back/28-glossary-slang.md",
  "docs/rulebook/MEGACORP-TICKERS.md",
  // Director campaign aids (Quiet Floor implements RAW 24 default cadence)
  "docs/directors/campaigns/QUIET-FLOOR-XP-NUYEN-PACING.md",
  "docs/directors/campaigns/QUIET-FLOOR-OUTLINE.md",
];

/** B122: source prefixes that are Director campaign aids, never player-facing. */
const DIRECTOR_PREFIXES = [
  "docs/directors/",
  "docs/manuscript/03-directors/",
];

/** @returns {"player"|"director"} */
function audienceFor(source) {
  const path = String(source ?? "").replaceAll("\\", "/");
  return DIRECTOR_PREFIXES.some(prefix => path.startsWith(prefix)) ? "director" : "player";
}

const MAX_CHUNK = 1600;
const MIN_CHUNK = 80;

const slug = text => String(text ?? "")
  .toLowerCase()
  .replace(/['’]/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "")
  .slice(0, 60);

function listMarkdown(dir, skip = new Set()) {
  return readdirSync(dir)
    .filter(f => f.endsWith(".md") && !skip.has(f))
    .sort();
}

function rel(abs) {
  return relative(ROOT, abs).replaceAll("\\", "/");
}

function stripMeta(markdown) {
  let text = String(markdown ?? "").replace(/\r\n/g, "\n");
  text = text.replace(/^![^\n]+\n+(?:\*[^\n]+\n+)?/gm, "");
  text = text.replace(/^>\s*\*\*In Foundry\*\*[\s\S]*?(?:\n{2,}|\n*$)/gm, "\n");
  const lines = text.split("\n");
  const kept = [];
  let seenTitle = false;
  let skippingHeader = true;
  for (const line of lines) {
    if (!seenTitle && /^#\s+/.test(line)) {
      seenTitle = true;
      kept.push(line);
      continue;
    }
    if (skippingHeader) {
      if (/^\*\*(RAW status|Sources|Print|Engine|Terminology|Status|Theme|Related|Street names|Harvested|TOC|Points to)\*\*/i.test(line)) continue;
      if (/^---\s*$/.test(line)) {
        skippingHeader = false;
        continue;
      }
      if (seenTitle && line.trim() === "") continue;
    }
    skippingHeader = false;
    kept.push(line);
  }
  return kept.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function splitByHeading(markdown, depth) {
  const re = depth === 2 ? /^##\s+.+/m : /^###\s+.+/m;
  const parts = [];
  const lines = markdown.split("\n");
  let heading = "";
  let buf = [];
  const flush = () => {
    const text = buf.join("\n").trim();
    if (text) parts.push({ heading, text });
    buf = [];
  };
  for (const line of lines) {
    if (re.test(line)) {
      flush();
      heading = line.replace(/^#+\s+/, "").trim();
      continue;
    }
    buf.push(line);
  }
  flush();
  return parts;
}

function looksLikeTable(text) {
  const lines = String(text ?? "").split("\n").filter(l => l.trim());
  if (lines.length < 3) return false;
  const tableLines = lines.filter(l => /^\|/.test(l.trim()));
  return tableLines.length >= 3 && tableLines.length >= lines.length - 1;
}

/** Oversized markdown tables are one paragraph — split on body rows so retrieve can budget them. */
function splitMarkdownTable(text, heading) {
  const lines = String(text ?? "").split("\n");
  const pre = [];
  const rows = [];
  const post = [];
  let phase = "pre";
  for (const line of lines) {
    if (phase === "pre") {
      if (/^\|/.test(line.trim())) {
        phase = "table";
        rows.push(line);
      } else pre.push(line);
    } else if (phase === "table") {
      if (/^\|/.test(line.trim())) rows.push(line);
      else {
        phase = "post";
        post.push(line);
      }
    } else post.push(line);
  }
  if (rows.length < 3) return [{ heading, text: String(text ?? "").trim() }].filter(p => p.text);
  const header = rows.slice(0, 2);
  const body = rows.slice(2);
  const intro = pre.join("\n").trim();
  const outro = post.join("\n").trim();
  const chunks = [];
  let buf = [...header];
  const flush = last => {
    const parts = [intro, buf.join("\n"), last ? outro : ""].filter(Boolean);
    const piece = parts.join("\n\n");
    if (piece.length >= MIN_CHUNK) chunks.push({ heading, text: piece });
    buf = [...header];
  };
  for (const row of body) {
    if (buf.length > 2 && intro.length + buf.join("\n").length + row.length + 2 > MAX_CHUNK) flush(false);
    buf.push(row);
  }
  if (buf.length > 2) flush(true);
  return chunks.length ? chunks : [{ heading, text: String(text ?? "").trim() }];
}

function splitParagraphs(text, heading) {
  const paras = text.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
  const out = [];
  let buf = "";
  const push = () => {
    if (buf.trim().length >= MIN_CHUNK) out.push({ heading, text: buf.trim() });
    buf = "";
  };
  for (const para of paras) {
    if (para.length > MAX_CHUNK && looksLikeTable(para)) {
      if (buf) push();
      out.push(...splitMarkdownTable(para, heading));
      continue;
    }
    if ((buf + "\n\n" + para).length > MAX_CHUNK && buf) push();
    buf = buf ? `${buf}\n\n${para}` : para;
  }
  if (buf.trim()) {
    if (buf.trim().length >= MIN_CHUNK) out.push({ heading, text: buf.trim() });
    else if (out.length) out[out.length - 1].text += `\n\n${buf.trim()}`;
  }
  return out;
}

/** B92: drop chunks that still cite Draw Steel Heroes procedure. */
function isHeroesCitationHeavy(text) {
  return /draw steel heroes/i.test(text);
}

function chunkMarkdown(markdown, source, kind) {
  const audience = audienceFor(source);
  const body = stripMeta(markdown);
  const file = basename(source);
  const titleMatch = body.match(/^#\s+(.+)$/m);
  const chapter = titleMatch?.[1]?.trim() || basename(file, ".md");
  const withoutTitle = body.replace(/^#\s+.+\n+/, "");
  const sections = splitByHeading(withoutTitle, 2);
  const seed = sections.length ? sections : [{ heading: chapter, text: withoutTitle }];
  const chunks = [];
  for (const section of seed) {
    const heading = section.heading || chapter;
    let pieces = [{ heading, text: section.text }];
    if (section.text.length > MAX_CHUNK) {
      const subs = splitByHeading(section.text, 3).filter(s => s.text);
      pieces = subs.length ? subs.map(s => ({ heading: s.heading || heading, text: s.text })) : pieces;
    }
    for (const piece of pieces) {
      const sliced = piece.text.length > MAX_CHUNK ? splitParagraphs(piece.text, piece.heading || heading) : [piece];
      for (const part of sliced) {
        const text = part.text.trim();
        if (text.length < MIN_CHUNK) continue;
        if (isHeroesCitationHeavy(text)) continue;
        chunks.push({
          id: `${basename(file, ".md")}#${slug(part.heading || heading)}#${chunks.length + 1}`,
          file,
          source,
          chapter,
          heading: part.heading || heading,
          kind,
          audience,
          text,
        });
      }
    }
  }
  return chunks;
}

function ingestFile(abs, kind) {
  return chunkMarkdown(readFileSync(abs, "utf8"), rel(abs), kind);
}

/**
 * 0.3.135 (3a) — one pack card as one or more chunks.
 *
 * A card is a unit: splitting Hurl Element across two chunks means a retrieve can hand the model the
 * tiers without the keywords. So the cap is generous (PACK_MAX_CHUNK, well under `retrieve`'s 5500-char
 * per-hit ceiling) and most cards fit in one piece — but five of the 46 Workings run past 4 KB of
 * printed text, and a chunk `retrieve` silently skips for being oversized is worse than a split. The
 * splits break on line boundaries and **repeat the card's first line**, so every piece still says which
 * card it belongs to and still carries the `entity` name that drives the exact-name boost.
 */
const PACK_MAX_CHUNK = 2600;

function chunkPackEntry(entry) {
  const lines = entry.text.split("\n");
  const header = lines[0] ?? entry.entity;
  const parts = [];
  let buf = [];
  const flush = () => {
    const text = buf.join("\n").trim();
    if (text) parts.push(parts.length ? `${header}\n${text}` : text);
    buf = [];
  };
  for (const line of lines) {
    const pending = buf.join("\n").length + line.length + 1;
    if (buf.length && (pending > PACK_MAX_CHUNK)) flush();
    buf.push(line);
  }
  flush();
  return parts.map((text, i) => ({
    id: `${entry.kind}:${slug(entry.entityDsid || entry.entity)}#${i + 1}`,
    file: entry.file,
    source: entry.source,
    chapter: entry.chapter,
    heading: entry.heading,
    kind: entry.kind,
    audience: audienceFor(entry.source),
    entity: entry.entity,
    entityDsid: entry.entityDsid,
    text,
  }));
}

const rawFiles = listMarkdown(RAW_DIR, SKIP_RAW);
const loreFiles = listMarkdown(LORE_DIR, SKIP_LORE).filter(f => /^L\d+-/i.test(f));
const handbookFiles = listMarkdown(HANDBOOK_DIR, SKIP_HANDBOOK);

const chunks = [];
for (const name of rawFiles) {
  chunks.push(...ingestFile(join(RAW_DIR, name), "rules"));
}
for (const name of loreFiles) {
  chunks.push(...ingestFile(join(LORE_DIR, name), "lore"));
}
for (const name of handbookFiles) {
  chunks.push(...ingestFile(join(HANDBOOK_DIR, name), "setting"));
}
for (const source of SETTING_PAGES) {
  chunks.push(...ingestFile(join(ROOT, source), "setting"));
}
const entries = packEntries(ROOT);
for (const entry of entries) chunks.push(...chunkPackEntry(entry));
const entryCounts = packEntryCounts(entries);

const index = {
  version: 1,
  role: "knowledge",
  built: new Date().toISOString().slice(0, 10),
  generator: "tools/build-voidmark-index.mjs",
  sources: {
    raw: rawFiles,
    lore: loreFiles.map(f => `docs/manuscript/01-lore/${f}`),
    handbook: handbookFiles.map(f => `docs/setting/reach-handbook/${f}`),
    setting: [...SETTING_PAGES],
    packs: [...Object.values(PACK_FILES)],
    director: [...new Set(chunks.filter(c => c.audience === "director").map(c => c.source))].sort(),
    skipped: [...SKIP_RAW, ...SKIP_HANDBOOK, ...SKIP_LORE],
  },
  // 0.3.135 (3a): abilities / rituals / summons, one entry per card.
  entityCounts: entryCounts,
  chunkCount: chunks.length,
  audienceCounts: {
    player: chunks.filter(c => c.audience === "player").length,
    director: chunks.filter(c => c.audience === "director").length,
  },
  chunks,
};

mkdirSync(join(ROOT, "data"), { recursive: true });
writeFileSync(OUT, `${JSON.stringify(index, null, 2)}\n`);
const bytes = Buffer.byteLength(JSON.stringify(index));
console.log(`Wrote ${chunks.length} chunks (${Math.round(bytes / 1024)} KB) → ${OUT}`);
console.log(`  audience: ${index.audienceCounts.player} player / ${index.audienceCounts.director} director`);
console.log(`  packs: ${entryCounts.ability} abilities / ${entryCounts.ritual} rituals / ${entryCounts.summon} summons`);
