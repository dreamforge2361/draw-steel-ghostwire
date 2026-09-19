#!/usr/bin/env node
/**
 * Copy Michael’s local art folders into docs/manuscript/print-art/.
 *
 * Windows Dropbox defaults (override with flags / env):
 *   %GHOSTWIRE_ART_ROOT%   e.g. C:\\Users\\mfran\\Dropbox\\Public\\RPG\\Ghostwire\\art
 *   %GHOSTWIRE_CORE_PDF%   Core Sourcebook PDF (optional extract)
 *
 * Folder name map:
 *   GHOSTWIRE_Class_Art          → print-art/classes/
 *   GHOSTWIRE_Species_Art        → print-art/species/
 *   GHOSTWIRE_Art_Bundle         → print-art/filler/
 *   GHOSTWIRE_Pregen_Art_Bundle  → print-art/pregens/
 *   from-core-pdf / Core extracts → print-art/from-core-pdf/
 *
 * Does not invent art. Does not downscale. Does not commit binaries.
 *
 *   node tools/copy-print-art.mjs --art-root "C:\\...\\art"
 *   node tools/copy-print-art.mjs --art-root "..." --extract-core --core-pdf "..."
 */
import { existsSync, mkdirSync, readdirSync, copyFileSync, statSync } from "node:fs";
import { dirname, extname, join, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DEST_ROOT = join(ROOT, "docs/manuscript/print-art");
const IMAGE_EXT = new Set([".webp", ".png", ".jpg", ".jpeg", ".gif", ".tif", ".tiff"]);

const FOLDER_MAP = [
  { names: ["GHOSTWIRE_Class_Art", "GHOSTWIRE Class Art", "Class_Art"], dest: "classes" },
  { names: ["GHOSTWIRE_Species_Art", "GHOSTWIRE Species Art", "Species_Art"], dest: "species" },
  { names: ["GHOSTWIRE_Art_Bundle", "GHOSTWIRE Art Bundle", "Art_Bundle"], dest: "filler" },
  { names: ["GHOSTWIRE_Pregen_Art_Bundle", "GHOSTWIRE Pregen Art Bundle", "Pregen_Art_Bundle"], dest: "pregens" },
  { names: ["from-core-pdf", "Core_PDF_Extracts", "Core Sourcebook Extracts"], dest: "from-core-pdf" },
  { names: ["cover", "GHOSTWIRE_Cover"], dest: "cover" },
];

const CLASS_SLUGS = [
  "operator",
  "scout",
  "commander",
  "medic",
  "wrench",
  "elementalist",
  "street-priest",
  "hacker",
  "technomancer",
];
const SPECIES_SLUGS = [
  "pure-human",
  "corran",
  "elvani",
  "goliar",
  "changer",
  "revenant",
  "mutant",
  "cyborg",
];

function argValue(flag) {
  const i = process.argv.indexOf(flag);
  if (i >= 0 && process.argv[i + 1]) return process.argv[i + 1];
  return null;
}

function isImage(name) {
  return IMAGE_EXT.has(extname(name).toLowerCase());
}

function findFolder(artRoot, names) {
  for (const n of names) {
    const p = join(artRoot, n);
    if (existsSync(p) && statSync(p).isDirectory()) return p;
  }
  return null;
}

function copyTree(srcDir, destDir) {
  mkdirSync(destDir, { recursive: true });
  let n = 0;
  for (const name of readdirSync(srcDir)) {
    const src = join(srcDir, name);
    if (!statSync(src).isFile() || !isImage(name)) continue;
    const dest = join(destDir, name);
    copyFileSync(src, dest);
    n++;
  }
  return n;
}

function slugify(name) {
  return basename(name, extname(name))
    .toLowerCase()
    .replace(/ghostwire[_-]?/g, "")
    .replace(/class|species|art|plate|opener/g, " ")
    .replace(/street\s*priest/g, "street-priest")
    .replace(/pure\s*human|baseline/g, "pure-human")
    .replace(/mutant\s*human/g, "mutant")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function aliasKnown(destDir, slugs) {
  if (!existsSync(destDir)) return 0;
  let n = 0;
  const files = readdirSync(destDir).filter(isImage);
  for (const slug of slugs) {
    const already = files.some((f) => basename(f, extname(f)).toLowerCase() === slug);
    if (already) continue;
    const hit = files.find((f) => {
      const s = slugify(f);
      return s === slug || s.includes(slug) || slug.includes(s);
    });
    if (!hit) continue;
    const dest = join(destDir, slug + extname(hit).toLowerCase());
    if (!existsSync(dest)) {
      copyFileSync(join(destDir, hit), dest);
      n++;
      console.log(`alias\t${hit} → ${basename(dest)}`);
    }
  }
  return n;
}

function main() {
  const artRoot =
    argValue("--art-root") ||
    process.env.GHOSTWIRE_ART_ROOT ||
    (process.platform === "win32"
      ? "C:\\\\Users\\\\mfran\\\\Dropbox\\\\Public\\\\RPG\\\\Ghostwire\\\\art"
      : "");
  const corePdf = argValue("--core-pdf") || process.env.GHOSTWIRE_CORE_PDF || "";
  const extractCore = process.argv.includes("--extract-core");

  if (!artRoot || !existsSync(artRoot)) {
    console.error("Art root not found. Pass --art-root or set GHOSTWIRE_ART_ROOT.");
    console.error(`Looked at: ${artRoot || "(empty)"}`);
    process.exit(1);
  }

  console.log(`Art root: ${artRoot}`);
  let copied = 0;
  for (const row of FOLDER_MAP) {
    const src = findFolder(artRoot, row.names);
    const dest = join(DEST_ROOT, row.dest);
    if (!src) {
      console.log(`miss\t${row.dest}\t(no folder among ${row.names.join(" | ")})`);
      continue;
    }
    const n = copyTree(src, dest);
    copied += n;
    console.log(`copy\t${row.dest}\t${n} files from ${src}`);
  }

  const classAliases = aliasKnown(join(DEST_ROOT, "classes"), CLASS_SLUGS);
  const speciesAliases = aliasKnown(join(DEST_ROOT, "species"), SPECIES_SLUGS);
  console.log(`aliases\tclasses=${classAliases} species=${speciesAliases}`);

  if (extractCore) {
    if (!corePdf || !existsSync(corePdf)) {
      console.error("--extract-core set but Core PDF missing. Pass --core-pdf / GHOSTWIRE_CORE_PDF.");
      process.exit(1);
    }
    const py = join(ROOT, "tools/extract-core-pdf-art.py");
    const r = spawnSync("python", [py, "--pdf", corePdf, "--out", join(DEST_ROOT, "from-core-pdf")], {
      cwd: ROOT,
      stdio: "inherit",
    });
    if (r.status !== 0) {
      const r2 = spawnSync("python3", [py, "--pdf", corePdf, "--out", join(DEST_ROOT, "from-core-pdf")], {
        cwd: ROOT,
        stdio: "inherit",
      });
      if (r2.status !== 0) process.exit(r2.status || 1);
    }
  }

  console.log(`Copied ${copied} image files into ${DEST_ROOT}`);
  console.log("Next: node tools/assemble-manuscript.mjs && node tools/inject-print-art.mjs && node tools/build-pdf.mjs");
}

main();
