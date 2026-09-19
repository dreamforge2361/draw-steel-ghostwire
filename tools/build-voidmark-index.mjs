#!/usr/bin/env node
/**
 * Build data/voidmark-rules-index.json from Ghostwire RAW (+ L4/L5 lore chips).
 * Skips front matter / INDEX so player-facing retrieve stays Ghostwire-only (B92).
 *
 * Run: node tools/build-voidmark-index.mjs
 */
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const RAW_DIR = join(ROOT, "docs/raw");
const OUT = join(ROOT, "data/voidmark-rules-index.json");
const SKIP_RAW = new Set(["00-INDEX.md", "00-front-matter.md"]);
const LORE = [
  { file: "docs/manuscript/01-lore/L4-voidmark.md", kind: "lore" },
  { file: "docs/manuscript/01-lore/L5-hands-off-accords.md", kind: "lore" },
];

const MAX_CHUNK = 1600;
const MIN_CHUNK = 80;

const slug = text => String(text ?? "")
  .toLowerCase()
  .replace(/['’]/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "")
  .slice(0, 60);

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
      if (/^\*\*(RAW status|Sources|Print|Engine|Terminology|Status|Theme|Related|Street names)\*\*/i.test(line)) continue;
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

function splitParagraphs(text, heading) {
  const paras = text.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
  const out = [];
  let buf = "";
  const push = () => {
    if (buf.trim().length >= MIN_CHUNK) out.push({ heading, text: buf.trim() });
    buf = "";
  };
  for (const para of paras) {
    if ((buf + "\n\n" + para).length > MAX_CHUNK && buf) push();
    buf = buf ? `${buf}\n\n${para}` : para;
  }
  if (buf.trim()) {
    if (buf.trim().length >= MIN_CHUNK) out.push({ heading, text: buf.trim() });
    else if (out.length) out[out.length - 1].text += `\n\n${buf.trim()}`;
  }
  return out;
}

function chunkMarkdown(markdown, file, kind) {
  const body = stripMeta(markdown);
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
        chunks.push({
          id: `${basename(file, ".md")}#${slug(part.heading || heading)}#${chunks.length + 1}`,
          file: basename(file),
          chapter,
          heading: part.heading || heading,
          kind,
          text,
        });
      }
    }
  }
  return chunks;
}

const chunks = [];
for (const name of readdirSync(RAW_DIR).filter(f => f.endsWith(".md")).sort()) {
  if (SKIP_RAW.has(name)) continue;
  chunks.push(...chunkMarkdown(readFileSync(join(RAW_DIR, name), "utf8"), name, "rules"));
}
for (const row of LORE) {
  chunks.push(...chunkMarkdown(readFileSync(join(ROOT, row.file), "utf8"), basename(row.file), row.kind));
}

const index = {
  version: 1,
  built: new Date().toISOString().slice(0, 10),
  generator: "tools/build-voidmark-index.mjs",
  sources: {
    raw: readdirSync(RAW_DIR).filter(f => f.endsWith(".md") && !SKIP_RAW.has(f)).sort(),
    lore: LORE.map(r => r.file),
    skipped: [...SKIP_RAW],
  },
  chunkCount: chunks.length,
  chunks,
};

mkdirSync(join(ROOT, "data"), { recursive: true });
writeFileSync(OUT, `${JSON.stringify(index, null, 2)}\n`);
const bytes = Buffer.byteLength(JSON.stringify(index));
console.log(`Wrote ${chunks.length} chunks (${Math.round(bytes / 1024)} KB) → ${OUT}`);
