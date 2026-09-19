#!/usr/bin/env node
/**
 * Inject print-art figures into the assembled Ghostwire manuscript.
 *
 * Reads docs/manuscript/print-art/ART-PLACEMENT.yml, resolves the first
 * existing image (or a search_dirs + match hit), and inserts a <figure>
 * after the chapter heading (or replaces a reserved cover hole).
 *
 * Missing files become a visible ART GAP placeholder — never invented art.
 *
 * Usage (repo root):
 *   node tools/inject-print-art.mjs
 *   node tools/inject-print-art.mjs --in path --out path --report path
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseYaml } from "./lib/simple-yaml.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const DEFAULT_PLACEMENT = join(ROOT, "docs/manuscript/print-art/ART-PLACEMENT.yml");
const DEFAULT_MANIFEST = join(ROOT, "docs/manuscript/MANIFEST.yml");
const DEFAULT_IN = join(ROOT, "docs/manuscript/build/Ghostwire-Manuscript.md");
const DEFAULT_OUT = join(ROOT, "docs/manuscript/build/Ghostwire-Manuscript.with-art.md");
const DEFAULT_REPORT = join(ROOT, "docs/manuscript/build/ART-GAP-REPORT.md");

const IMAGE_EXT = new Set([".webp", ".png", ".jpg", ".jpeg", ".gif", ".tif", ".tiff"]);
const CREDIT = "Ghostwire AI (AI-generated)";

function argValue(flag, fallback) {
  const i = process.argv.indexOf(flag);
  if (i >= 0 && process.argv[i + 1]) return resolve(process.cwd(), process.argv[i + 1]);
  return fallback;
}

function parseManifestEntries(obj) {
  const entries = obj.entries || [];
  return Array.isArray(entries) ? entries : [];
}

function chapterBannerIndex(md, title) {
  const needle = `<!-- chapter: ${title}`;
  return md.indexOf(needle);
}

function chapterRange(md, title) {
  const start = chapterBannerIndex(md, title);
  if (start < 0) return null;
  const after = start + 4;
  const nextChapter = md.indexOf("<!-- chapter:", after);
  const nextPart = md.indexOf("<!-- PART:", after);
  let end = md.length;
  if (nextChapter >= 0) end = Math.min(end, nextChapter);
  if (nextPart >= 0) end = Math.min(end, nextPart);
  return { start, end };
}

function isImageFile(abs) {
  if (!existsSync(abs) || !statSync(abs).isFile()) return false;
  return IMAGE_EXT.has(extname(abs).toLowerCase());
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

function tryAltExtensions(abs) {
  if (isImageFile(abs)) return abs;
  const base = abs.replace(/\.[^.]+$/, "");
  for (const ext of [".webp", ".png", ".jpg", ".jpeg", ".gif"]) {
    const cand = base + ext;
    if (isImageFile(cand)) return cand;
  }
  return null;
}

function resolveArt(slot, credit) {
  const tried = [];
  const files = Array.isArray(slot.files) ? slot.files : slot.file ? [slot.file] : [];
  for (const rel of files) {
    const abs = resolve(ROOT, rel);
    tried.push(rel);
    const hit = tryAltExtensions(abs);
    if (hit) {
      return { status: "placed", path: hit, rel: hit.slice(ROOT.length + 1).replaceAll("\\", "/"), tried };
    }
  }
  const dirs = Array.isArray(slot.search_dirs) ? slot.search_dirs : [];
  let best = null;
  for (const dirRel of dirs) {
    const dir = resolve(ROOT, dirRel);
    if (!existsSync(dir) || !statSync(dir).isDirectory()) continue;
    for (const name of readdirSync(dir)) {
      const abs = join(dir, name);
      if (!isImageFile(abs)) continue;
      const score = scoreName(name, slot.match);
      if (score < 50) continue;
      if (!best || score > best.score) {
        best = {
          score,
          path: abs,
          rel: abs.slice(ROOT.length + 1).replaceAll("\\", "/"),
        };
      }
    }
  }
  if (best) {
    return { status: "placed", path: best.path, rel: best.rel, tried, matched: true };
  }
  return {
    status: "gap",
    tried,
    expected: files[0] || (dirs[0] && slot.match ? `${dirs[0]}/*${slot.match}*` : "(no file listed)"),
    credit,
  };
}

function figurePlaced(slot, rel, credit) {
  const alt = slot.caption || slot.title || slot.id;
  const css = slot.css_class || `plate-${slot.kind || "art"}`;
  const down = slot.downscale === false ? " gw-no-downscale" : "";
  return [
    `<!-- ART SLOT: ${slot.id} -->`,
    `<figure class="gw-plate ${css}${down}" id="art-${slot.id}">`,
    `<img src="${rel}" alt="${escapeAttr(alt)}" />`,
    `<figcaption>${escapeHtml(alt)} — ${escapeHtml(credit)}</figcaption>`,
    `</figure>`,
    `<!-- /ART SLOT: ${slot.id} -->`,
    "",
  ].join("\n");
}

function figureGap(slot, resolved, credit) {
  const expected = resolved.expected;
  const label = slot.title || slot.id;
  return [
    `<!-- ART SLOT: ${slot.id} -->`,
    `<!-- ART GAP: ${slot.id} — expected ${expected} -->`,
    `<figure class="gw-plate gw-art-gap plate-${slot.kind || "art"}" id="art-${slot.id}">`,
    `<div class="gw-art-gap-box">`,
    `<p class="gw-art-gap-label">ART GAP</p>`,
    `<p>${escapeHtml(label)}</p>`,
    `<p class="gw-art-gap-path"><code>${escapeHtml(expected)}</code></p>`,
    `<p class="gw-art-gap-credit">Credit when filled: ${escapeHtml(credit)}. Do not invent artwork.</p>`,
    `</div>`,
    `<figcaption>${escapeHtml(slot.caption || label)} — placeholder (file not in print-art tree)</figcaption>`,
    `</figure>`,
    `<!-- /ART SLOT: ${slot.id} -->`,
    "",
  ].join("\n");
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeAttr(s) {
  return escapeHtml(s).replaceAll('"', "&quot;");
}

function stripExistingSlot(md, id) {
  const re = new RegExp(`<!-- ART SLOT: ${id} -->[\\s\\S]*?<!-- /ART SLOT: ${id} -->\\n?`, "g");
  return md.replace(re, "");
}

function insertAfterHeading(chapterText, heading, block) {
  const lines = chapterText.split("\n");
  const h = heading.trim();
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trimEnd();
    if (line === h || line.startsWith(h)) {
      let insertAt = i + 1;
      while (insertAt < lines.length && lines[insertAt].trim() === "") insertAt++;
      lines.splice(insertAt, 0, "", block.trimEnd(), "");
      return { ok: true, text: lines.join("\n") };
    }
  }
  return { ok: false, text: chapterText };
}

function replaceBlock(chapterText, startNeedle, endNeedle, block) {
  const start = chapterText.indexOf(startNeedle);
  if (start < 0) return { ok: false, text: chapterText };
  const endIdx = chapterText.indexOf(endNeedle, start);
  if (endIdx < 0) return { ok: false, text: chapterText };
  const end = endIdx + endNeedle.length;
  const nextNl = chapterText.indexOf("\n", end);
  const cutEnd = nextNl >= 0 ? nextNl : end;
  const text = chapterText.slice(0, start) + block.trimEnd() + "\n" + chapterText.slice(cutEnd);
  return { ok: true, text };
}

function writeGapReport(path, results, credit) {
  const placed = results.filter((r) => r.status === "placed");
  const gaps = results.filter((r) => r.status === "gap");
  const missingChapter = results.filter((r) => r.status === "no-chapter");
  const lines = [
    "# Ghostwire print-art gap report",
    "",
    `**Generated:** ${new Date().toISOString()}`,
    `**Tool:** \`tools/inject-print-art.mjs\``,
    `**Placement map:** \`docs/manuscript/print-art/ART-PLACEMENT.yml\``,
    `**Credit:** ${credit} (B76). No external IP name-checks (B78/B83).`,
    `**Journals:** not regenerated.`,
    "",
    `| | Count |`,
    `|---|---:|`,
    `| Slots in map | ${results.length} |`,
    `| Placed | ${placed.length} |`,
    `| ART GAP (file missing) | ${gaps.length} |`,
    `| Chapter anchor missing | ${missingChapter.length} |`,
    "",
    "## Placed",
    "",
  ];
  if (!placed.length) {
    lines.push("_None — print-art binaries are not in this checkout (expected on first cloud build)._");
    lines.push("");
  } else {
    lines.push("| Slot | Kind | File |");
    lines.push("|---|---|---|");
    for (const r of placed) {
      lines.push(`| \`${r.id}\` | ${r.kind} | \`${r.rel}\` |`);
    }
    lines.push("");
  }
  lines.push("## Gaps");
  lines.push("");
  if (!gaps.length) {
    lines.push("_No file gaps._");
    lines.push("");
  } else {
    lines.push("| Slot | Kind | Chapter | Expected / search |");
    lines.push("|---|---|---|---|");
    for (const r of gaps) {
      lines.push(`| \`${r.id}\` | ${r.kind} | \`${r.chapter_id}\` | \`${r.expected}\` |`);
    }
    lines.push("");
    lines.push("Fill gaps by copying Michael’s Dropbox art tree (see `docs/manuscript/print-art/README.md`), then re-run inject + build.");
    lines.push("");
  }
  if (missingChapter.length) {
    lines.push("## Missing chapter anchors");
    lines.push("");
    lines.push("| Slot | chapter_id | Title looked up |");
    lines.push("|---|---|---|");
    for (const r of missingChapter) {
      lines.push(`| \`${r.id}\` | \`${r.chapter_id}\` | ${r.title || "—"} |`);
    }
    lines.push("");
  }
  lines.push("## Policy");
  lines.push("");
  lines.push("- Do **not** invent artwork to close a gap.");
  lines.push("- District / battle maps use in-module `assets/maps/districts/` at **native resolution** (no downscale of source files).");
  lines.push("- Class plates prefer `print-art/classes/` names matching `GHOSTWIRE_Class_Art`.");
  lines.push("- Species plates prefer `print-art/species/` names matching `GHOSTWIRE_Species_Art`.");
  lines.push("- Gang signs prefer `print-art/gangs/` slugs (B91: metermen → undertow).");
  lines.push("- Core Sourcebook extracts land in `print-art/from-core-pdf/` as fallbacks only.");
  lines.push("");
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, lines.join("\n"), "utf8");
}

function main() {
  const placementPath = argValue("--placement", DEFAULT_PLACEMENT);
  const inPath = argValue("--in", DEFAULT_IN);
  const outPath = argValue("--out", DEFAULT_OUT);
  const reportPath = argValue("--report", DEFAULT_REPORT);

  if (!existsSync(placementPath)) {
    console.error(`ART-PLACEMENT.yml not found: ${placementPath}`);
    process.exit(1);
  }
  if (!existsSync(inPath)) {
    console.error(`Assembled manuscript not found: ${inPath}`);
    console.error("Run: node tools/assemble-manuscript.mjs");
    process.exit(1);
  }
  if (!existsSync(DEFAULT_MANIFEST)) {
    console.error(`MANIFEST.yml not found: ${DEFAULT_MANIFEST}`);
    process.exit(1);
  }

  const placement = parseYaml(readFileSync(placementPath, "utf8"));
  const manifest = parseYaml(readFileSync(DEFAULT_MANIFEST, "utf8"));
  const entries = parseManifestEntries(manifest);
  const byId = new Map(entries.filter((e) => e.id).map((e) => [e.id, e]));
  const credit = placement.credit || CREDIT;
  const slots = Array.isArray(placement.slots) ? placement.slots : [];
  if (!slots.length) {
    console.error("ART-PLACEMENT.yml parsed zero slots.");
    process.exit(1);
  }

  let md = readFileSync(inPath, "utf8").replace(/^\uFEFF/, "");
  const results = [];

  for (const slot of slots) {
    const entry = byId.get(slot.chapter_id);
    const title = entry?.title || slot.chapter_title;
    if (!title) {
      results.push({ ...slot, status: "no-chapter", title: null });
      console.warn(`SKIP ${slot.id}: unknown chapter_id ${slot.chapter_id}`);
      continue;
    }
    md = stripExistingSlot(md, slot.id);
    const range = chapterRange(md, title);
    if (!range) {
      results.push({ ...slot, status: "no-chapter", title });
      console.warn(`SKIP ${slot.id}: chapter banner not found for "${title}"`);
      continue;
    }
    const resolved = resolveArt(slot, credit);
    const block = resolved.status === "placed" ? figurePlaced(slot, resolved.rel, credit) : figureGap(slot, resolved, credit);
    const chapter = md.slice(range.start, range.end);
    let next = chapter;
    let ok = false;
    if (slot.replace_start && slot.replace_end) {
      const replaced = replaceBlock(chapter, slot.replace_start, slot.replace_end, block);
      next = replaced.text;
      ok = replaced.ok;
    }
    if (!ok && slot.after_heading) {
      const inserted = insertAfterHeading(next, slot.after_heading, block);
      next = inserted.text;
      ok = inserted.ok;
    }
    if (!ok) {
      next = chapter.replace(/(\n)/, `\n${block}\n`);
      ok = true;
      console.warn(`WARN ${slot.id}: heading/replace miss — prepended after chapter banner`);
    }
    md = md.slice(0, range.start) + next + md.slice(range.end);
    results.push({
      id: slot.id,
      kind: slot.kind || "",
      chapter_id: slot.chapter_id,
      title: slot.title,
      status: resolved.status,
      rel: resolved.rel,
      expected: resolved.expected,
    });
    const mark = resolved.status === "placed" ? "PLACED" : "GAP";
    console.log(`${mark}\t${slot.id}\t${resolved.rel || resolved.expected}`);
  }

  mkdirSync(dirname(outPath), { recursive: true });
  const header = [
    "<!--",
    "  Ghostwire-Manuscript.with-art.md — GENERATED. Do not edit by hand.",
    `  Built: ${new Date().toISOString()}`,
    "  Tool:   tools/inject-print-art.mjs",
    "  Map:    docs/manuscript/print-art/ART-PLACEMENT.yml",
    `  Credit: ${credit}`,
    "-->",
    "",
  ].join("\n");
  const body = md.replace(/^<!--[\s\S]*?-->\s*/, "");
  writeFileSync(outPath, header + body, "utf8");
  writeGapReport(reportPath, results, credit);

  const placed = results.filter((r) => r.status === "placed").length;
  const gaps = results.filter((r) => r.status === "gap").length;
  console.log(`Wrote ${outPath}`);
  console.log(`Wrote ${reportPath}`);
  console.log(`Slots: ${results.length} · placed: ${placed} · gaps: ${gaps}`);
}

main();
