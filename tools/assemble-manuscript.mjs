#!/usr/bin/env node
/**
 * Assemble Ghostwire print manuscript from docs/manuscript/MANIFEST.yml.
 *
 * Rules chapters are pointers into docs/raw/ (no copies). Missing lore/NEW stubs
 * emit a visible HTML + MD comment placeholder and are skipped (no throw).
 *
 * Usage (repo root):  node tools/assemble-manuscript.mjs
 * Out: docs/manuscript/build/Ghostwire-Manuscript.md
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const MANIFEST = join(ROOT, "docs/manuscript/MANIFEST.yml");
const OUT_DIR = join(ROOT, "docs/manuscript/build");
const OUT = join(OUT_DIR, "Ghostwire-Manuscript.md");
const MANIFEST_DIR = join(ROOT, "docs/manuscript");

/** Minimal YAML subset parser for MANIFEST.yml (maps + list of maps). */
function parseManifest(text) {
  const entries = [];
  let current = null;
  let inEntries = false;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/\t/g, "  ");
    if (!line.trim() || line.trim().startsWith("#")) continue;
    if (/^entries:\s*$/.test(line)) {
      inEntries = true;
      continue;
    }
    if (!inEntries) continue;
    const item = line.match(/^  - type:\s*(.+)\s*$/);
    if (item) {
      if (current) entries.push(current);
      current = { type: item[1].trim() };
      continue;
    }
    const kv = line.match(/^    ([a-z_]+):\s*(.+)\s*$/);
    if (kv && current) {
      let v = kv[2].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      if (/^\d+$/.test(v)) v = Number(v);
      current[kv[1]] = v;
    }
  }
  if (current) entries.push(current);
  return entries;
}

function separator(title) {
  return [
    "",
    "<!-- ============================================================ -->",
    `<!-- PART: ${title} -->`,
    "<!-- ============================================================ -->",
    "",
    `---`
    ,
    "",
    `# ${title}`,
    "",
  ].join("\n");
}

function fileBanner(entry) {
  const ch = entry.print_ch != null ? ` (print Ch ${entry.print_ch})` : "";
  const kind = entry.kind ? ` · kind=${entry.kind}` : "";
  return [
    "",
    `<!-- chapter: ${entry.title || entry.id}${ch}${kind} -->`,
    // N5: no source/workspace paths in the shipped manuscript — the entry id is
    // enough to trace a chapter back to MANIFEST.yml.
    `<!-- entry: ${entry.id || entry.title} -->`,
    "",
  ].join("\n");
}

function missingPlaceholder(entry, absPath) {
  const label = entry.title || entry.id || entry.path;
  return [
    "",
    `<!-- MISSING: ${label} — expected at ${entry.path} (resolved ${absPath}) -->`,
    `<!-- CONTENT TBD — harvest or create this stub before final PDF. -->`,
    "",
    `[//]: # (MISSING: ${label} — ${entry.path})`,
    "",
    `> **PLACEHOLDER — missing file** \`${entry.path}\``,
    `>`,
    `> CONTENT TBD — harvest from master PDF or draft NEW chapter. Assemble skipped body.`,
    "",
  ].join("\n");
}

function main() {
  if (!existsSync(MANIFEST)) {
    console.error(`Manifest not found: ${MANIFEST}`);
    process.exit(1);
  }
  const entries = parseManifest(readFileSync(MANIFEST, "utf8"));
  if (!entries.length) {
    console.error("MANIFEST.yml parsed zero entries — check YAML subset format.");
    process.exit(1);
  }

  const chunks = [];
  const stamp = new Date().toISOString();
  chunks.push(
    [
      "<!--",
      "  Ghostwire-Manuscript.md — GENERATED FILE. Do not edit by hand.",
      `  Built: ${stamp}`,
      "  Source: docs/manuscript/MANIFEST.yml",
      "  Tool:   tools/assemble-manuscript.mjs",
      "  Rules:  docs/raw/ via path pointers (no dual-edit copies).",
      "  Lore:   docs/manuscript/01-lore/ stubs until PDF harvest.",
      "-->",
      "",
      "# Ghostwire — Print Manuscript",
      "",
    ].join("\n")
  );

  let included = 0;
  let missing = 0;
  let parts = 0;

  for (const entry of entries) {
    if (entry.type === "part") {
      parts++;
      chunks.push(separator(entry.title || entry.id || "Part"));
      continue;
    }
    if (entry.type !== "file") continue;
    if (!entry.path) {
      console.warn(`Skip entry without path: ${JSON.stringify(entry)}`);
      continue;
    }
    const absPath = resolve(MANIFEST_DIR, entry.path);
    chunks.push(fileBanner(entry));
    if (!existsSync(absPath)) {
      missing++;
      chunks.push(missingPlaceholder(entry, absPath));
      console.warn(`MISSING: ${entry.path}`);
      continue;
    }
    const body = readFileSync(absPath, "utf8").replace(/^\uFEFF/, "");
    chunks.push(body.trimEnd() + "\n");
    included++;
  }

  mkdirSync(OUT_DIR, { recursive: true });
  const out = chunks.join("\n") + "\n";
  writeFileSync(OUT, out, { encoding: "utf8" }); // UTF-8 no BOM
  console.log(`Wrote ${OUT}`);
  console.log(`Parts: ${parts} · files included: ${included} · missing placeholders: ${missing}`);
}

main();
