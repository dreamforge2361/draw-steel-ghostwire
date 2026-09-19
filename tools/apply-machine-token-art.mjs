#!/usr/bin/env node
/**
 * Apply vehicle / drone token art onto Ghostwire Vehicles & Drones pack Items.
 *
 * Source of truth for pack docs is src/packs/vehicles (nested JSON; LevelDB under
 * `packs/vehicles` is compiled). Deploy (`scripts/machines.mjs`) copies Item `img`
 * onto the stamped Actor + token, so chassis art lives on the Item, not the
 * nine generic band templates in `src/packs/summons/machines/`.
 *
 *   node tools/apply-machine-token-art.mjs --list
 *   node tools/apply-machine-token-art.mjs
 *   node tools/apply-machine-token-art.mjs --from _incoming-art
 *   node tools/apply-machine-token-art.mjs --from _incoming-art --dry-run
 *
 * Filenames are slang slugs (`tape-eye.webp`, `grey-cab.webp`). The drone
 * Rustbucket must be `rustbucket-drone.webp`. Convention:
 *   modules/draw-steel-ghostwire/assets/tokens/vehicles/<dsid>.webp
 *   modules/draw-steel-ghostwire/assets/tokens/drones/<dsid>.webp
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
const PACK_SRC = join(ROOT, "src/packs/vehicles");
const DEST = {
  drone: join(ROOT, "assets/tokens/drones"),
  vehicle: join(ROOT, "assets/tokens/vehicles"),
};
const IMAGE_EXT = new Set([".webp", ".png", ".jpg", ".jpeg"]);
const PREFERRED_EXT = ".webp";

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
  return readdirSync(dir, { recursive: true })
    .filter(f => f.endsWith(".json") && !f.endsWith(`${sep}_folder.json`) && basename(f) !== "_folder.json")
    .map(f => join(dir, f));
}

function walkFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { recursive: true }).map(f => join(dir, f));
}

function kindFromName(name) {
  const base = String(name).toLowerCase();
  if (base === "drones" || base === "drone") return "drone";
  if (base === "vehicles" || base === "vehicle") return "vehicle";
  return null;
}

function kindFromRel(rel) {
  const parts = String(rel).split(/[/\\]/).map(p => p.toLowerCase());
  for (const part of parts) {
    const kind = kindFromName(part);
    if (kind) return kind;
  }
  return null;
}

function loadCatalog() {
  const lang = JSON.parse(readFileSync(join(ROOT, "lang/en.json"), "utf8"));
  const byDsid = new Map();
  const byKind = { drone: new Map(), vehicle: new Map() };
  for (const file of walkJson(PACK_SRC)) {
    const doc = JSON.parse(readFileSync(file, "utf8"));
    const dsid = doc.system?._dsid;
    if (!dsid) continue;
    const vehicle = doc.flags?.[MODULE_ID]?.vehicle ?? {};
    const kind = vehicle.drone ? "drone" : "vehicle";
    const nameKey = typeof doc.name === "string" && doc.name.startsWith("GHOSTWIRE.") ? doc.name : null;
    const name = (nameKey && localize(lang, nameKey)) || pascal(dsid);
    const entry = {
      dsid,
      kind,
      name,
      file,
      rel: relative(ROOT, file).replaceAll("\\", "/"),
      img: doc.img ?? "",
      domain: vehicle.domain ?? "",
      scale: vehicle.scale ?? "",
      echelon: vehicle.echelon ?? null,
    };
    byDsid.set(dsid, entry);
    byKind[kind].set(dsid, entry);
  }
  return { byDsid, byKind };
}

function aliasMap(catalog) {
  const aliases = new Map();
  for (const dsid of catalog.byDsid.keys()) {
    aliases.set(dsid, dsid);
    aliases.set(dsid.replaceAll("-", ""), dsid);
  }
  // Chapter slang for the aerial clunker is "Rustbucket"; pack dsid is rustbucket-drone.
  aliases.set("rusted-quad", "rustbucket-drone");
  aliases.set("rustedquad", "rustbucket-drone");
  aliases.set("rustbucket-quad", "rustbucket-drone");
  aliases.set("junk-rotor", "junk-rotor");
  aliases.set("junkrotor", "junk-rotor");
  aliases.set("iron-mantis", "iron-mantis");
  aliases.set("ironmantis", "iron-mantis");
  // Art-pack filename variants (B101 zip): Fly / Micro-Drone, Getaway / Sedan, Rustbucket / City Runabout.
  aliases.set("fly-micro-drone", "fly");
  aliases.set("flymicrodrone", "fly");
  aliases.set("getaway-sedan", "getaway");
  aliases.set("getawaysedan", "getaway");
  aliases.set("rustbucket-runabout", "rustbucket");
  aliases.set("rustbucketrunabout", "rustbucket");
  return aliases;
}

function resolveDsid(slug, kind, catalog, aliases) {
  let dsid = aliases.get(slug) ?? null;
  if (kind === "drone" && slug === "rustbucket") dsid = "rustbucket-drone";
  if (!dsid) return null;
  const entry = catalog.byDsid.get(dsid);
  if (!entry) return null;
  if (kind && entry.kind !== kind) return null;
  return entry;
}

function moduleImg(kind, dsid, ext = PREFERRED_EXT) {
  const folder = kind === "drone" ? "drones" : "vehicles";
  return `modules/${MODULE_ID}/assets/tokens/${folder}/${dsid}${ext}`;
}

function destPath(kind, dsid, ext = PREFERRED_EXT) {
  return join(DEST[kind], `${dsid}${ext}`);
}

function printHelp() {
  console.log(`Apply slang-slug token art to Ghostwire Vehicles & Drones pack Items.

Usage:
  node tools/apply-machine-token-art.mjs [--from DIR] [--kind drones|vehicles]
  node tools/apply-machine-token-art.mjs --list
  node tools/apply-machine-token-art.mjs --dry-run --from DIR
  node tools/apply-machine-token-art.mjs --no-build

Options:
  --from DIR     Incoming images (flat, or drones/ + vehicles/ subfolders). Copied into assets/tokens/.
  --kind KIND    When --from is a flat folder, treat every file as drones or vehicles.
  --list         Print chassis inventory (dsid, pack JSON, current img, art present).
  --dry-run      Show copies + img writes; do not write files or rebuild packs.
  --no-build     Update src JSON only; skip tools/build-packs.mjs vehicles.
  --ignore-unknown
                 Warn on unmatched filenames instead of failing.

Close Foundry before a pack rebuild. Do not bump module.json until art ships.
`);
}

function printList(catalog) {
  const rows = [...catalog.byDsid.values()].sort((a, b) => {
    if (a.kind !== b.kind) return a.kind.localeCompare(b.kind);
    return a.dsid.localeCompare(b.dsid);
  });
  console.log(`Ghostwire Vehicles & Drones — ${catalog.byKind.drone.size} drones + ${catalog.byKind.vehicle.size} vehicles`);
  console.log("kind\tdsid\tname\tpack JSON\tmodule img\tart");
  for (const row of rows) {
    const expected = moduleImg(row.kind, row.dsid);
    const onDisk = existsSync(destPath(row.kind, row.dsid)) ? "yes" : "no";
    console.log(`${row.kind}\t${row.dsid}\t${row.name}\t${row.rel}\t${expected}\t${onDisk}`);
  }
}

function collectIncoming(fromDir, kindFlag, catalog, aliases) {
  const found = [];
  const unknown = [];
  const defaultKind = kindFlag ?? kindFromRel(fromDir) ?? kindFromName(basename(fromDir));
  const files = walkFiles(fromDir).filter(f => IMAGE_EXT.has(extname(f).toLowerCase()));
  for (const file of files) {
    const rel = relative(fromDir, file);
    const slug = slugify(basename(file, extname(file)));
    if (!slug) continue;
    const kind = kindFromRel(rel) ?? defaultKind;
    const entry = resolveDsid(slug, kind, catalog, aliases) ?? (!kind ? resolveDsid(slug, null, catalog, aliases) : null);
    if (!entry) {
      unknown.push({ file, rel, slug, kind });
      continue;
    }
    found.push({ file, ext: extname(file).toLowerCase(), entry });
  }
  return { found, unknown };
}

function collectStaged(catalog) {
  const found = [];
  for (const entry of catalog.byDsid.values()) {
    const preferred = destPath(entry.kind, entry.dsid, PREFERRED_EXT);
    let file = existsSync(preferred) ? preferred : null;
    let ext = PREFERRED_EXT;
    if (!file) {
      for (const other of IMAGE_EXT) {
        const candidate = destPath(entry.kind, entry.dsid, other);
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
    const key = `${job.entry.kind}:${job.entry.dsid}`;
    const prev = byKey.get(key);
    if (!prev) {
      byKey.set(key, job);
      continue;
    }
    const preferNew = job.ext === PREFERRED_EXT && prev.ext !== PREFERRED_EXT;
    if (preferNew) byKey.set(key, job);
    else console.warn(`warn: extra file for ${job.entry.dsid} ignored: ${displayPath(job.file)}`);
  }
  return [...byKey.values()];
}

function applyArt(jobs, { dryRun }) {
  const updated = [];
  const skipped = [];
  for (const job of jobs) {
    const { entry, ext } = job;
    const dest = destPath(entry.kind, entry.dsid, ext);
    const img = moduleImg(entry.kind, entry.dsid, ext);
    if (!job.staged && resolve(job.file) !== resolve(dest)) {
      console.log(`${dryRun ? "would copy" : "copy"} ${displayPath(job.file)} → ${displayPath(dest)}`);
      if (!dryRun) {
        mkdirSync(dirname(dest), { recursive: true });
        copyFileSync(job.file, dest);
      }
    }
    if (entry.img === img) {
      skipped.push({ ...entry, img, reason: "already set" });
      continue;
    }
    console.log(`${dryRun ? "would set" : "set"} ${entry.rel} img → ${img}`);
    if (!dryRun) {
      const doc = JSON.parse(readFileSync(entry.file, "utf8"));
      doc.img = img;
      writeFileSync(entry.file, JSON.stringify(doc, null, 2) + "\n");
    }
    updated.push({ ...entry, img });
  }
  return { updated, skipped };
}

function rebuildVehicles() {
  const lock = join(ROOT, "packs/vehicles/LOCK");
  if (existsSync(lock)) {
    console.warn("warn: packs/vehicles/LOCK exists — close Foundry before rebuilding LevelDB.");
  }
  const r = spawnSync(process.execPath, [join(ROOT, "tools/build-packs.mjs"), "vehicles"], {
    cwd: ROOT,
    stdio: "inherit",
  });
  if (r.status !== 0) throw new Error(`tools/build-packs.mjs vehicles failed with status ${r.status}`);
}

function main() {
  if (hasFlag("--help") || hasFlag("-h")) {
    printHelp();
    return 0;
  }

  const catalog = loadCatalog();
  const aliases = aliasMap(catalog);
  if (catalog.byKind.drone.size !== 36 || catalog.byKind.vehicle.size !== 32) {
    console.warn(`warn: expected 36 drones + 32 vehicles; found ${catalog.byKind.drone.size} + ${catalog.byKind.vehicle.size}`);
  }

  if (hasFlag("--list")) {
    printList(catalog);
    return 0;
  }

  const dryRun = hasFlag("--dry-run");
  const fromArg = argValue("--from");
  const kindArg = argValue("--kind");
  const kindFlag = kindArg ? (kindArg.replace(/s$/, "") === "drone" ? "drone" : kindArg.replace(/s$/, "") === "vehicle" ? "vehicle" : null) : null;
  if (kindArg && !kindFlag) {
    console.error(`error: --kind must be drones or vehicles (got ${kindArg})`);
    return 1;
  }

  let jobs;
  if (fromArg) {
    const fromDir = resolve(ROOT, fromArg);
    if (!existsSync(fromDir)) {
      console.error(`error: --from not found: ${fromDir}`);
      return 1;
    }
    const { found, unknown } = collectIncoming(fromDir, kindFlag, catalog, aliases);
    if (unknown.length) {
      for (const u of unknown) console.warn(`unknown slug: ${u.rel} (${u.slug}${u.kind ? `, ${u.kind}` : ""})`);
      if (!hasFlag("--ignore-unknown")) {
        console.error("error: unmatched files. Rename to a slang dsid (see --list) or pass --ignore-unknown.");
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
    console.log("Drop <dsid>.webp into assets/tokens/drones/ and assets/tokens/vehicles/, or pass --from DIR.");
    console.log("Inventory: node tools/apply-machine-token-art.mjs --list");
    console.log("Spike: docs/spikes/B101-VEHICLE-DRONE-TOKEN-ART.md");
    return 0;
  }

  const { updated, skipped } = applyArt(jobs, { dryRun });
  console.log(`${dryRun ? "would update" : "updated"} ${updated.length}; unchanged ${skipped.length}; files ${jobs.length}`);

  if (dryRun || hasFlag("--no-build")) return 0;
  if (!updated.length) {
    console.log("No img fields changed; skipping pack rebuild.");
    return 0;
  }
  rebuildVehicles();
  return 0;
}

process.exit(main());
