#!/usr/bin/env node
/**
 * Linkify the assembled+injected Ghostwire manuscript (B97).
 *
 * Usage (repo root):
 *   node tools/linkify-manuscript.mjs
 *   node tools/linkify-manuscript.mjs --in path --out path
 *
 * Default in:  docs/manuscript/build/Ghostwire-Manuscript.with-art.md
 * Default out: docs/manuscript/build/Ghostwire-Manuscript.with-links.md
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseYaml } from "./lib/simple-yaml.mjs";
import { linkifyManuscript } from "./lib/linkify-manuscript.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const BUILD = join(ROOT, "docs/manuscript/build");
const MANIFEST = join(ROOT, "docs/manuscript/MANIFEST.yml");
const DEFAULT_IN = join(BUILD, "Ghostwire-Manuscript.with-art.md");
const FALLBACK_IN = join(BUILD, "Ghostwire-Manuscript.md");
const DEFAULT_OUT = join(BUILD, "Ghostwire-Manuscript.with-links.md");

function argValue(flag, fallback) {
  const i = process.argv.indexOf(flag);
  if (i >= 0 && process.argv[i + 1]) return resolve(process.cwd(), process.argv[i + 1]);
  return fallback;
}

function main() {
  const inPath = argValue("--in", existsSync(DEFAULT_IN) ? DEFAULT_IN : FALLBACK_IN);
  const outPath = argValue("--out", DEFAULT_OUT);
  if (!existsSync(inPath)) {
    console.error(`Missing input: ${inPath} — assemble + inject first.`);
    process.exit(1);
  }
  if (!existsSync(MANIFEST)) {
    console.error(`Missing manifest: ${MANIFEST}`);
    process.exit(1);
  }
  const manifest = parseYaml(readFileSync(MANIFEST, "utf8"));
  const entries = Array.isArray(manifest.entries) ? manifest.entries : [];
  const md = readFileSync(inPath, "utf8");
  const { markdown, stats } = linkifyManuscript(md, entries);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, markdown, "utf8");
  console.log(`Wrote ${outPath}`);
  console.log(
    `Hotlinks: ${stats.total}  (contents/toc ${stats.toc} · raw-ids ${stats.rawIds} · filenames ${stats.filenames} · print-ch ${stats.printCh} · appendix ${stats.appendix} · see-title ${stats.seeTitles} · arrows ${stats.arrows} · skipped ${stats.skipped})`,
  );
  if (stats.contentsInserted) console.log("Inserted generated Contents page (from MANIFEST).");
}

try {
  main();
} catch (err) {
  console.error(err.message || err);
  process.exit(1);
}
