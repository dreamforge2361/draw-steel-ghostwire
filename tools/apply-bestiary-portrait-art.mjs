#!/usr/bin/env node
/**
 * Apply humanoid bestiary portrait art onto Ghostwire Bestiary pack Actors.
 *
 * Source of truth is src/packs/bestiary (nested JSON; LevelDB under
 * `packs/bestiary` is compiled). B103 stamps Actor `img` AND
 * `prototypeToken.texture.src` so the sheet portrait and the canvas token
 * stay in sync. Embedded ability / item icons are left alone.
 *
 *   node tools/apply-bestiary-portrait-art.mjs --list
 *   node tools/apply-bestiary-portrait-art.mjs
 *   node tools/apply-bestiary-portrait-art.mjs --from _incoming-art
 *   node tools/apply-bestiary-portrait-art.mjs --from _incoming-art --dry-run
 *
 * Filenames are pack slugs (`corp-enforcer.webp`, `rival-hacker-echelon1.webp`).
 * Convention:
 *   modules/draw-steel-ghostwire/assets/tokens/bestiary/<slug>.webp
 *
 * Scope is the 33 L1–4 corp / gang / E1 rival humanoids (+ veil-cultist).
 * Critters, wilds beasts, wire ICE, undead (except cultist), Mama (L5),
 * and L6 corp bosses are out of scope — unmatched unless --ignore-unknown.
 *
 * Foundry closed before a rebuild. Does not bump module.json.
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const MODULE_ID = "draw-steel-ghostwire";
const PACK_SRC = join(ROOT, "src/packs/bestiary");
const DEST = join(ROOT, "assets/tokens/bestiary");
const IMAGE_EXT = new Set([".webp", ".png", ".jpg", ".jpeg"]);
const PREFERRED_EXT = ".webp";
const EXPECTED = 33;

/** B103 humanoid portrait slugs (filename stem = pack JSON stem). */
const SCOPE = [
  // Corp security L1–4
  "corp-enforcer",
  "corp-netrunner",
  "corp-security-officer",
  "ironclad-commando",
  "ironclad-conscript",
  "ironclad-ground-commander",
  "ironclad-sharpshooter",
  "ironclad-subcommander",
  "response-lieutenant",
  // Reach streets L1–4
  "chrome-bruiser",
  "colors-boss",
  "gang-boss",
  "gang-raider",
  "hustler",
  "razorline-prime",
  "rooftop-shooter",
  "street-brawler",
  "street-cutter",
  "street-doc",
  "street-punk",
  "the-choirmother",
  "the-ferryman",
  "the-warlord",
  "trick-shooter",
  "wrench-rigger",
  // Rivals E1
  "rival-commander-echelon1",
  "rival-elementalist-echelon1",
  "rival-hacker-echelon1",
  "rival-operator-echelon1",
  "rival-scout-echelon1",
  "rival-street-priest-echelon1",
  "rival-technomancer-echelon1",
  // Veil (humanoid cultist only)
  "veil-cultist",
];

const SCOPE_SET = new Set(SCOPE);

/** Explicit skips so a dropped Mama / critter / ICE file is a clear unknown. */
const SKIP = new Map([
  ["mama-cassavir", "Mama (L5) — later pass"],
  ["contract-enforcer", "L6 corp boss — later pass"],
  ["ironclad-warden", "L6 corp boss — later pass"],
  ["warden-krael", "L6 corp boss — later pass"],
  ["chrome-rat", "reach critter"],
  ["gutter-serpent", "reach critter"],
  ["scrap-hound", "reach critter"],
  ["sink-crawler", "reach critter"],
  ["tunnel-bat", "reach critter"],
  ["cael-marrow", "wilds beast / named"],
  ["canopy-stalker", "wilds beast"],
  ["feral-beast", "wilds beast"],
  ["jungle-beast", "wilds beast"],
  ["jungle-predator", "wilds beast"],
  ["reach-behemoth", "wilds beast"],
  ["vermin-swarm", "wilds beast"],
  ["black-ice", "wire ICE"],
  ["chrome-raider-armiger", "wire / chrome raider"],
  ["chrome-raider-hijack", "wire / chrome raider"],
  ["scrambler-ice", "wire ICE"],
  ["signal-mindkiller-whelp", "wire ICE"],
  ["signal-talker-invader", "wire ICE"],
  ["watchdog-ice", "wire ICE"],
  ["ghost", "undead monster"],
  ["ghoul", "undead monster"],
  ["skeleton", "undead monster"],
  ["zombie", "undead monster"],
]);

const BAND_LABEL = {
  "corp-security": "corp",
  "reach-streets": "streets",
  rivals: "rivals",
  "veil-undead": "veil",
};

function hasFlag(flag) {
  return process.argv.includes(flag);
}

function argValue(flag) {
  const i = process.argv.indexOf(flag);
  if (i >= 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith("-")) return process.argv[i + 1];
  return null;
}

function slugify(name) {
  return String(name)
    .normalize("NFKD")
    .replace(/['’]/g, "")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function displayPath(p) {
  const rel = relative(ROOT, p);
  if (rel.startsWith("..")) return p;
  return rel.replaceAll("\\", "/");
}

function pascal(dsid) {
  return dsid.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join("");
}

function localize(lang, key) {
  return key.split(".").reduce((o, k) => o?.[k], lang);
}

function walkJson(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { recursive: true })
    .filter(f => f.endsWith(".json") && !f.endsWith(`${sep}_folder.json`) && basename(f) !== "_folder.json")
    .map(f => join(dir, f));
}

function walkFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { recursive: true }).map(f => join(dir, f));
}

function loadCatalog() {
  const lang = JSON.parse(readFileSync(join(ROOT, "lang/en.json"), "utf8"));
  const bySlug = new Map();
  for (const file of walkJson(PACK_SRC)) {
    const slug = basename(file, ".json");
    if (!SCOPE_SET.has(slug)) continue;
    const doc = JSON.parse(readFileSync(file, "utf8"));
    const nameKey = typeof doc.name === "string" && doc.name.startsWith("GHOSTWIRE.") ? doc.name : null;
    const name = (nameKey && localize(lang, nameKey)) || pascal(slug);
    const relParts = relative(PACK_SRC, file).split(/[/\\]/);
    const folder = relParts.length > 1 ? relParts[0] : "";
    const monster = doc.system?.monster ?? {};
    bySlug.set(slug, {
      slug,
      name,
      file,
      rel: relative(ROOT, file).replaceAll("\\", "/"),
      img: doc.img ?? "",
      token: doc.prototypeToken?.texture?.src ?? "",
      folder,
      band: BAND_LABEL[folder] ?? folder,
      level: monster.level ?? null,
      role: monster.role || "",
      organization: monster.organization || "",
    });
  }
  return { bySlug, lang };
}

function aliasMap(catalog) {
  const aliases = new Map();
  for (const [slug, entry] of catalog.bySlug) {
    aliases.set(slug, slug);
    aliases.set(slug.replaceAll("-", ""), slug);
    aliases.set(slugify(entry.name), slug);
    if (slug.startsWith("the-")) aliases.set(slug.slice(4), slug);
    if (slug.endsWith("-echelon1")) {
      const stem = slug.slice(0, -"-echelon1".length);
      aliases.set(stem, slug);
      aliases.set(`${stem}-e1`, slug);
      aliases.set(`${stem}-echelon-1`, slug);
      aliases.set(`${stem}echelon1`, slug);
      aliases.set(`${stem}e1`, slug);
    }
  }
  aliases.set("choir-mother", "the-choirmother");
  aliases.set("choirmother", "the-choirmother");
  aliases.set("ferryman", "the-ferryman");
  aliases.set("warlord", "the-warlord");
  aliases.set("veil-cult", "veil-cultist");
  return aliases;
}

function resolveSlug(stem, catalog, aliases) {
  const slug = aliases.get(stem) ?? null;
  if (!slug) return null;
  return catalog.bySlug.get(slug) ?? null;
}

function moduleImg(slug, ext = PREFERRED_EXT) {
  return `modules/${MODULE_ID}/assets/tokens/bestiary/${slug}${ext}`;
}

function destPath(slug, ext = PREFERRED_EXT) {
  return join(DEST, `${slug}${ext}`);
}

function printHelp() {
  console.log(`Apply humanoid portrait art to Ghostwire Bestiary Actors (B103).

Usage:
  node tools/apply-bestiary-portrait-art.mjs [--from DIR]
  node tools/apply-bestiary-portrait-art.mjs --list
  node tools/apply-bestiary-portrait-art.mjs --dry-run --from DIR
  node tools/apply-bestiary-portrait-art.mjs --no-build

Options:
  --from DIR     Incoming images (flat, or a bestiary/ subfolder). Copied into
                 assets/tokens/bestiary/<slug>.webp.
  --list         Print inventory (slug, pack JSON, current img + token, art).
  --dry-run      Show copies + img/token writes; do not write files or rebuild.
  --no-build     Update src JSON only; skip tools/build-packs.mjs bestiary.
  --ignore-unknown
                 Warn on unmatched filenames instead of failing.

Stamps Actor img AND prototypeToken.texture.src. Embedded item icons are
untouched. Scope is 33 L1–4 corp / gang / E1 rival humanoids + veil-cultist.

Close Foundry before a pack rebuild. Do not bump module.json until art ships.
`);
}

function printList(catalog) {
  const rows = [...catalog.bySlug.values()].sort((a, b) => {
    if (a.band !== b.band) return a.band.localeCompare(b.band);
    if (a.level !== b.level) return (a.level ?? 0) - (b.level ?? 0);
    return a.slug.localeCompare(b.slug);
  });
  console.log(`Ghostwire Bestiary humanoids (B103) — ${rows.length} Actors`);
  console.log("band\tL\tslug\tname\torg\trole\tpack JSON\tmodule img\tart\timg-set\ttoken-set");
  for (const row of rows) {
    const expected = moduleImg(row.slug);
    const onDisk = existsSync(destPath(row.slug)) ? "yes" : "no";
    const imgSet = row.img === expected ? "yes" : "no";
    const tokenSet = row.token === expected ? "yes" : "no";
    console.log(
      `${row.band}\t${row.level ?? "-"}\t${row.slug}\t${row.name}\t${row.organization || "-"}\t${row.role || "-"}\t${row.rel}\t${expected}\t${onDisk}\t${imgSet}\t${tokenSet}`,
    );
  }
}

function collectIncoming(fromDir, catalog, aliases) {
  const found = [];
  const unknown = [];
  const files = walkFiles(fromDir).filter(f => IMAGE_EXT.has(extname(f).toLowerCase()));
  for (const file of files) {
    const rel = relative(fromDir, file);
    const stem = slugify(basename(file, extname(file)));
    if (!stem) continue;
    const entry = resolveSlug(stem, catalog, aliases);
    if (!entry) {
      const skipReason = SKIP.get(stem) ?? SKIP.get(stem.replaceAll("-", "")) ?? null;
      unknown.push({ file, rel, slug: stem, skipReason });
      continue;
    }
    found.push({ file, ext: extname(file).toLowerCase(), entry });
  }
  return { found, unknown };
}

function collectStaged(catalog) {
  const found = [];
  for (const entry of catalog.bySlug.values()) {
    const preferred = destPath(entry.slug, PREFERRED_EXT);
    let file = existsSync(preferred) ? preferred : null;
    let ext = PREFERRED_EXT;
    if (!file) {
      for (const other of IMAGE_EXT) {
        const candidate = destPath(entry.slug, other);
        if (existsSync(candidate)) {
          file = candidate;
          ext = other;
          break;
        }
      }
    }
    if (file) found.push({ file, ext, entry, staged: true });
  }
  return found;
}

function dedupeJobs(jobs) {
  const byKey = new Map();
  for (const job of jobs) {
    const key = job.entry.slug;
    const prev = byKey.get(key);
    if (!prev) {
      byKey.set(key, job);
      continue;
    }
    const preferNew = job.ext === PREFERRED_EXT && prev.ext !== PREFERRED_EXT;
    if (preferNew) byKey.set(key, job);
    else console.warn(`warn: extra file for ${job.entry.slug} ignored: ${displayPath(job.file)}`);
  }
  return [...byKey.values()];
}

function stampActor(doc, img) {
  let changed = (doc.img ?? "") !== img;
  doc.img = img;
  if (!doc.prototypeToken) doc.prototypeToken = {};
  if (!doc.prototypeToken.texture) doc.prototypeToken.texture = {};
  if ((doc.prototypeToken.texture.src ?? "") !== img) {
    doc.prototypeToken.texture.src = img;
    changed = true;
  }
  return changed;
}

function applyArt(jobs, { dryRun }) {
  const updated = [];
  const skipped = [];
  for (const job of jobs) {
    const { entry, ext } = job;
    const dest = destPath(entry.slug, ext);
    const img = moduleImg(entry.slug, ext);
    if (!job.staged && resolve(job.file) !== resolve(dest)) {
      console.log(`${dryRun ? "would copy" : "copy"} ${displayPath(job.file)} → ${displayPath(dest)}`);
      if (!dryRun) {
        mkdirSync(dirname(dest), { recursive: true });
        copyFileSync(job.file, dest);
      }
    }
    const already = entry.img === img && entry.token === img;
    if (already) {
      skipped.push({ ...entry, img, reason: "already set" });
      continue;
    }
    console.log(`${dryRun ? "would set" : "set"} ${entry.rel} img + prototypeToken.texture.src → ${img}`);
    if (!dryRun) {
      const doc = JSON.parse(readFileSync(entry.file, "utf8"));
      stampActor(doc, img);
      writeFileSync(entry.file, JSON.stringify(doc, null, 2) + "\n");
    }
    updated.push({ ...entry, img });
  }
  return { updated, skipped };
}

function rebuildBestiary() {
  const lock = join(ROOT, "packs/bestiary/LOCK");
  if (existsSync(lock)) {
    console.warn("warn: packs/bestiary/LOCK exists — close Foundry before rebuilding LevelDB.");
  }
  const r = spawnSync(process.execPath, [join(ROOT, "tools/build-packs.mjs"), "bestiary"], {
    cwd: ROOT,
    stdio: "inherit",
  });
  if (r.status !== 0) throw new Error(`tools/build-packs.mjs bestiary failed with status ${r.status}`);
}

function main() {
  if (hasFlag("--help") || hasFlag("-h")) {
    printHelp();
    return 0;
  }

  const catalog = loadCatalog();
  const aliases = aliasMap(catalog);
  if (catalog.bySlug.size !== EXPECTED) {
    const missing = SCOPE.filter(s => !catalog.bySlug.has(s));
    console.warn(`warn: expected ${EXPECTED} in-scope Actors; found ${catalog.bySlug.size}`);
    if (missing.length) console.warn(`warn: missing pack JSON for: ${missing.join(", ")}`);
  }

  if (hasFlag("--list")) {
    printList(catalog);
    return 0;
  }

  const dryRun = hasFlag("--dry-run");
  const fromArg = argValue("--from");

  let jobs;
  if (fromArg) {
    const fromDir = resolve(ROOT, fromArg);
    if (!existsSync(fromDir)) {
      console.error(`error: --from not found: ${fromDir}`);
      return 1;
    }
    const { found, unknown } = collectIncoming(fromDir, catalog, aliases);
    if (unknown.length) {
      for (const u of unknown) {
        const why = u.skipReason ? `out of scope: ${u.skipReason}` : "unmatched";
        console.warn(`unknown slug: ${u.rel} (${u.slug}; ${why})`);
      }
      if (!hasFlag("--ignore-unknown")) {
        console.error("error: unmatched files. Rename to a B103 slug (see --list) or pass --ignore-unknown.");
        return 1;
      }
    }
    jobs = found;
  } else {
    jobs = collectStaged(catalog);
  }

  jobs = dedupeJobs(jobs);
  if (!jobs.length) {
    console.log("No token art to apply.");
    console.log("Drop <slug>.webp into assets/tokens/bestiary/, or pass --from DIR.");
    console.log("Inventory: node tools/apply-bestiary-portrait-art.mjs --list");
    console.log("Spike: docs/spikes/B103-BESTIARY-HUMANOID-PORTRAITS.md");
    return 0;
  }

  const { updated, skipped } = applyArt(jobs, { dryRun });
  console.log(`${dryRun ? "would update" : "updated"} ${updated.length}; unchanged ${skipped.length}; files ${jobs.length}`);

  if (dryRun || hasFlag("--no-build")) return 0;
  if (!updated.length) {
    console.log("No img / token fields changed; skipping pack rebuild.");
    return 0;
  }
  rebuildBestiary();
  return 0;
}

process.exit(main());
