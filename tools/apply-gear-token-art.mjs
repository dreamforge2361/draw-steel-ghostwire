#!/usr/bin/env node
/**
 * Apply armor / weapon / shield token art onto Ghostwire Gear pack Items
 * and matching embedded treasure Items on pregen Heroes.
 *
 * Source of truth is src/packs/gear/{armor,weapons} (nested JSON; LevelDB
 * under packs/gear is compiled). Pregens store a full copy of each loadout
 * Item (type: treasure) on the Actor — the sheet Equipment tab displays
 * those embedded imgs, not live UUID links — so this tool stamps both.
 *
 *   node tools/apply-gear-token-art.mjs --list
 *   node tools/apply-gear-token-art.mjs
 *   node tools/apply-gear-token-art.mjs --from _incoming-art
 *   node tools/apply-gear-token-art.mjs --from _incoming-art --dry-run
 *
 * Filenames are pack `_dsid` slugs (`armored-jacket.webp`, `popper.webp`).
 * Shields live under armor/. Convention:
 *   modules/draw-steel-ghostwire/assets/tokens/armor/<dsid>.webp
 *   modules/draw-steel-ghostwire/assets/tokens/weapons/<dsid>.webp
 *
 * Does not touch general gear, chrome, foci, or kits (Wren's Longshot kit
 * shares a dsid with the rifle — only type:treasure is updated).
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
const GEAR_SRC = join(ROOT, "src/packs/gear");
const PREGEN_SRC = join(ROOT, "src/packs/pregens");
const DEST = {
  armor: join(ROOT, "assets/tokens/armor"),
  weapon: join(ROOT, "assets/tokens/weapons"),
};
const KIND_DIRS = { armor: "armor", weapon: "weapons" };
const IMAGE_EXT = new Set([".webp", ".png", ".jpg", ".jpeg"]);
const PREFERRED_EXT = ".webp";
const EXPECTED = { armor: 22, weapon: 49 };

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

function kindFromName(name) {
  const base = String(name).toLowerCase();
  if (base === "armor" || base === "armors" || base === "shield" || base === "shields") return "armor";
  if (base === "weapon" || base === "weapons") return "weapon";
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

function loadLang() {
  return JSON.parse(readFileSync(join(ROOT, "lang/en.json"), "utf8"));
}

function loadCatalog() {
  const lang = loadLang();
  const byDsid = new Map();
  const byKind = { armor: new Map(), weapon: new Map() };
  for (const kind of ["armor", "weapon"]) {
    const dir = join(GEAR_SRC, KIND_DIRS[kind]);
    for (const file of walkJson(dir)) {
      const doc = JSON.parse(readFileSync(file, "utf8"));
      const dsid = doc.system?._dsid;
      if (!dsid) continue;
      const nameKey = typeof doc.name === "string" && doc.name.startsWith("GHOSTWIRE.") ? doc.name : null;
      const name = (nameKey && localize(lang, nameKey)) || pascal(dsid);
      const relParts = relative(dir, file).split(/[/\\]/);
      const folder = relParts.length > 1 ? relParts[0] : "";
      const entry = {
        dsid,
        kind,
        name,
        file,
        rel: relative(ROOT, file).replaceAll("\\", "/"),
        img: doc.img ?? "",
        folder,
        echelon: doc.system?.echelon ?? null,
        keywords: doc.system?.keywords ?? [],
        pregens: [],
      };
      byDsid.set(dsid, entry);
      byKind[kind].set(dsid, entry);
    }
  }
  attachPregens(byDsid, lang);
  return { byDsid, byKind, lang };
}

function matchEmbedded(item, catalog, lang) {
  if (item?.type !== "treasure") return null;
  const dsid = item.system?._dsid;
  if (dsid && catalog.has(dsid)) return catalog.get(dsid);
  const nameKey = typeof item.name === "string" ? item.name : "";
  const display = (nameKey.startsWith("GHOSTWIRE.") && localize(lang, nameKey)) || nameKey;
  const slug = slugify(display);
  if (slug && catalog.has(slug)) return catalog.get(slug);
  return null;
}

function attachPregens(byDsid, lang) {
  for (const file of walkJson(PREGEN_SRC)) {
    const actor = JSON.parse(readFileSync(file, "utf8"));
    const actorRel = relative(ROOT, file).replaceAll("\\", "/");
    const actorName = (typeof actor.name === "string" && actor.name.startsWith("GHOSTWIRE.")
      ? localize(lang, actor.name)
      : actor.name) || basename(file, ".json");
    for (const item of actor.items ?? []) {
      const entry = matchEmbedded(item, byDsid, lang);
      if (!entry) continue;
      entry.pregens.push({
        actor: actorName,
        actorRel,
        itemId: item._id,
        itemName: entry.name,
      });
    }
  }
}

function aliasMap(catalog) {
  const aliases = new Map();
  for (const [dsid, entry] of catalog.byDsid) {
    aliases.set(dsid, dsid);
    aliases.set(dsid.replaceAll("-", ""), dsid);
    aliases.set(slugify(entry.name), dsid);
  }
  // Display name "Flash-Bang" vs pack dsid flash-bang-3e.
  aliases.set("flash-bang", "flash-bang-3e");
  aliases.set("flashbang", "flash-bang-3e");
  aliases.set("flashbang3e", "flash-bang-3e");
  aliases.set("flash-bang-3e", "flash-bang-3e");
  // Apostrophe / hyphen variants for Dragon's Breath.
  aliases.set("dragon-breath", "dragons-breath");
  aliases.set("dragonsbreath", "dragons-breath");
  aliases.set("streetsweeper", "streetsweeper-smg");
  aliases.set("hecombatsuit", "he-combat-suit");
  aliases.set("h-e-combat-suit", "he-combat-suit");
  aliases.set("mil-spec-battledress", "milspec-battledress");
  aliases.set("mil-spec-battle-rifle", "milspec-battle-rifle");
  return aliases;
}

function resolveDsid(slug, kind, catalog, aliases) {
  const dsid = aliases.get(slug) ?? null;
  if (!dsid) return null;
  const entry = catalog.byDsid.get(dsid);
  if (!entry) return null;
  if (kind && entry.kind !== kind) return null;
  return entry;
}

function moduleImg(kind, dsid, ext = PREFERRED_EXT) {
  return `modules/${MODULE_ID}/assets/tokens/${KIND_DIRS[kind]}/${dsid}${ext}`;
}

function destPath(kind, dsid, ext = PREFERRED_EXT) {
  return join(DEST[kind], `${dsid}${ext}`);
}

function printHelp() {
  console.log(`Apply armor / weapon / shield token art to Ghostwire Gear Items and pregen embeds.

Usage:
  node tools/apply-gear-token-art.mjs [--from DIR] [--kind armor|weapons]
  node tools/apply-gear-token-art.mjs --list
  node tools/apply-gear-token-art.mjs --dry-run --from DIR
  node tools/apply-gear-token-art.mjs --no-build

Options:
  --from DIR     Incoming images (flat, or armor/ + weapons/ subfolders).
                 A shields/ folder is treated as armor/. Copied into assets/tokens/.
  --kind KIND    When --from is a flat folder, treat every file as armor or weapons.
  --list         Print inventory (dsid, pack JSON, current img, art, pregen embeds).
  --dry-run      Show copies + img writes; do not write files or rebuild packs.
  --no-build     Update src JSON only; skip tools/build-packs.mjs gear pregens.
  --ignore-unknown
                 Warn on unmatched filenames instead of failing.

Close Foundry before a pack rebuild. Do not bump module.json until art ships.
Shields file under assets/tokens/armor/<dsid>.webp. General gear is out of scope.
`);
}

function printList(catalog) {
  const rows = [...catalog.byDsid.values()].sort((a, b) => {
    if (a.kind !== b.kind) return a.kind.localeCompare(b.kind);
    if (a.folder !== b.folder) return a.folder.localeCompare(b.folder);
    return a.dsid.localeCompare(b.dsid);
  });
  console.log(`Ghostwire Gear — ${catalog.byKind.armor.size} armor/shields + ${catalog.byKind.weapon.size} weapons`);
  console.log("kind\tfolder\tdsid\tname\tpack JSON\tmodule img\tart\tpregens");
  for (const row of rows) {
    const expected = moduleImg(row.kind, row.dsid);
    const onDisk = existsSync(destPath(row.kind, row.dsid)) ? "yes" : "no";
    const pregens = row.pregens.length ? row.pregens.map(p => p.actor).join(",") : "-";
    console.log(`${row.kind}\t${row.folder}\t${row.dsid}\t${row.name}\t${row.rel}\t${expected}\t${onDisk}\t${pregens}`);
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

function stampImg(doc, img) {
  const prev = doc.img ?? "";
  let changed = prev !== img;
  doc.img = img;
  if (Array.isArray(doc.effects)) {
    for (const effect of doc.effects) {
      if (effect && effect.img === prev && prev !== img) {
        effect.img = img;
        changed = true;
      }
    }
  }
  return changed;
}

function applyGear(jobs, { dryRun }) {
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
    const doc = JSON.parse(readFileSync(entry.file, "utf8"));
    if (doc.img === img) {
      skipped.push({ ...entry, img, reason: "already set" });
      continue;
    }
    console.log(`${dryRun ? "would set" : "set"} ${entry.rel} img → ${img}`);
    if (!dryRun) {
      stampImg(doc, img);
      writeFileSync(entry.file, JSON.stringify(doc, null, 2) + "\n");
    }
    updated.push({ ...entry, img });
  }
  return { updated, skipped };
}

function applyPregens(jobs, { dryRun, catalog }) {
  const byDsid = new Map(jobs.map(job => [job.entry.dsid, job]));
  const updated = [];
  const skipped = [];
  for (const file of walkJson(PREGEN_SRC)) {
    const actor = JSON.parse(readFileSync(file, "utf8"));
    const actorRel = relative(ROOT, file).replaceAll("\\", "/");
    let dirty = false;
    for (const item of actor.items ?? []) {
      const entry = matchEmbedded(item, catalog.byDsid, catalog.lang);
      if (!entry) continue;
      const job = byDsid.get(entry.dsid);
      if (!job) continue;
      const img = moduleImg(entry.kind, entry.dsid, job.ext);
      const before = item.img;
      const wouldChange = before !== img;
      if (!wouldChange) {
        skipped.push({ actorRel, dsid: entry.dsid, img, reason: "already set" });
        continue;
      }
      console.log(`${dryRun ? "would set" : "set"} ${actorRel} embedded ${entry.dsid} img → ${img}`);
      if (!dryRun) stampImg(item, img);
      dirty = true;
      updated.push({ actorRel, dsid: entry.dsid, img });
    }
    if (dirty && !dryRun) writeFileSync(file, JSON.stringify(actor, null, 2) + "\n");
  }
  return { updated, skipped };
}

function rebuildPacks() {
  for (const pack of ["gear", "pregens"]) {
    const lock = join(ROOT, "packs", pack, "LOCK");
    if (existsSync(lock)) {
      console.warn(`warn: packs/${pack}/LOCK exists — close Foundry before rebuilding LevelDB.`);
    }
  }
  const r = spawnSync(process.execPath, [join(ROOT, "tools/build-packs.mjs"), "gear", "pregens"], {
    cwd: ROOT,
    stdio: "inherit",
  });
  if (r.status !== 0) throw new Error(`tools/build-packs.mjs gear pregens failed with status ${r.status}`);
}

function parseKindArg(kindArg) {
  if (!kindArg) return null;
  const kind = kindFromName(kindArg);
  if (!kind) {
    console.error(`error: --kind must be armor or weapons (got ${kindArg})`);
    process.exit(1);
  }
  return kind;
}

function main() {
  if (hasFlag("--help") || hasFlag("-h")) {
    printHelp();
    return 0;
  }

  const catalog = loadCatalog();
  const aliases = aliasMap(catalog);
  if (catalog.byKind.armor.size !== EXPECTED.armor || catalog.byKind.weapon.size !== EXPECTED.weapon) {
    console.warn(`warn: expected ${EXPECTED.armor} armor/shields + ${EXPECTED.weapon} weapons; found ${catalog.byKind.armor.size} + ${catalog.byKind.weapon.size}`);
  }

  if (hasFlag("--list")) {
    printList(catalog);
    return 0;
  }

  const dryRun = hasFlag("--dry-run");
  const fromArg = argValue("--from");
  const kindFlag = parseKindArg(argValue("--kind"));

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
        console.error("error: unmatched files. Rename to a gear dsid (see --list) or pass --ignore-unknown.");
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
    console.log("Drop <dsid>.webp into assets/tokens/armor/ and assets/tokens/weapons/, or pass --from DIR.");
    console.log("Inventory: node tools/apply-gear-token-art.mjs --list");
    console.log("Spike: docs/spikes/B102-ARMOR-WEAPON-ITEM-ART.md");
    return 0;
  }

  const gear = applyGear(jobs, { dryRun });
  const pregens = applyPregens(jobs, { dryRun, catalog });
  console.log(
    `${dryRun ? "would update" : "updated"} gear ${gear.updated.length} (unchanged ${gear.skipped.length}); ` +
    `pregen embeds ${pregens.updated.length} (unchanged ${pregens.skipped.length}); files ${jobs.length}`,
  );

  if (dryRun || hasFlag("--no-build")) return 0;
  if (!gear.updated.length && !pregens.updated.length) {
    console.log("No img fields changed; skipping pack rebuild.");
    return 0;
  }
  rebuildPacks();
  return 0;
}

process.exit(main());
