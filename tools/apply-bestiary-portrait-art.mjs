#!/usr/bin/env node
/**
 * Apply bestiary + lower-level summon portrait art onto Ghostwire Actors.
 *
 * Source of truth is src/packs/{bestiary,summons} (nested JSON; LevelDB under
 * packs/ is compiled). Stamps Actor `img` AND `prototypeToken.texture.src`
 * so the sheet portrait and the canvas token stay in sync. Embedded ability /
 * item icons are left alone.
 *
 *   node tools/apply-bestiary-portrait-art.mjs --list
 *   node tools/apply-bestiary-portrait-art.mjs
 *   node tools/apply-bestiary-portrait-art.mjs --from _incoming-art
 *   node tools/apply-bestiary-portrait-art.mjs --from _incoming-art --dry-run
 *
 * Filenames are pack slugs (`corp-enforcer.webp`, `watchdog-ice.webp`,
 * `companion-ember.webp`). Convention:
 *   modules/draw-steel-ghostwire/assets/tokens/bestiary/<slug>.webp
 *   modules/draw-steel-ghostwire/assets/tokens/summons/<slug>.webp
 *
 * B111 ARG portraits override three corp-security slugs into
 *   assets/tokens/bestiary/arg/arg-<role>.webp
 * (PNG originals sit beside the WebPs; Foundry img uses WebP).
 *
 * Scope (57): 33 L1–4 corp / gang / E1 rival humanoids + veil-cultist,
 * 7 wire-machine ICE/constructs, 17 summons (elemental companions + rank 1,
 * three spirits, sprite minor/intermediate, two node tokens).
 *
 * Out of scope: critters, wilds, undead monsters, Mama (L5), L6 corp bosses,
 * machine band templates, elemental rank 2/3/greater, sprite-*-advanced.
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
const IMAGE_EXT = new Set([".webp", ".png", ".jpg", ".jpeg"]);
const PREFERRED_EXT = ".webp";

const BESTIARY_SLUGS = [
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
  // Wire / ICE constructs
  "watchdog-ice",
  "scrambler-ice",
  "chrome-raider-armiger",
  "chrome-raider-hijack",
  "black-ice",
  "signal-mindkiller-whelp",
  "signal-talker-invader",
];

const SUMMONS_SLUGS = [
  "companion-boulder",
  "companion-ember",
  "companion-zephyr",
  "elemental-rank-1",
  "spirit-guardian",
  "spirit-hunter",
  "spirit-warrior",
  "sprite-attack-minor",
  "sprite-attack-intermediate",
  "sprite-data-minor",
  "sprite-data-intermediate",
  "sprite-machine-minor",
  "sprite-machine-intermediate",
  "sprite-ward-minor",
  "sprite-ward-intermediate",
  "node-token-track-1",
  "node-token-track-2",
];

/** Michael ARG portraits (B111): keep pack slugs, ship art under bestiary/arg/. */
const ART_OVERRIDES = {
  "corp-enforcer": { subdir: "arg", stem: "arg-corporate-enforcer" },
  "response-lieutenant": { subdir: "arg", stem: "arg-response-lieutenant" },
  "corp-security-officer": { subdir: "arg", stem: "arg-security-officer" },
};

const PACKS = {
  bestiary: {
    kind: "bestiary",
    src: join(ROOT, "src/packs/bestiary"),
    dest: join(ROOT, "assets/tokens/bestiary"),
    folder: "bestiary",
    slugs: BESTIARY_SLUGS,
    expected: BESTIARY_SLUGS.length,
  },
  summons: {
    kind: "summons",
    src: join(ROOT, "src/packs/summons"),
    dest: join(ROOT, "assets/tokens/summons"),
    folder: "summons",
    slugs: SUMMONS_SLUGS,
    expected: SUMMONS_SLUGS.length,
  },
};

const EXPECTED_TOTAL = BESTIARY_SLUGS.length + SUMMONS_SLUGS.length;

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
  ["ghost", "undead monster"],
  ["ghoul", "undead monster"],
  ["skeleton", "undead monster"],
  ["zombie", "undead monster"],
  ["elemental-rank-2", "summon rank 2 — later pass"],
  ["elemental-rank-3", "summon rank 3 — later pass"],
  ["elemental-greater", "greater elemental — later pass"],
  ["sprite-attack-advanced", "sprite advanced — later pass"],
  ["sprite-data-advanced", "sprite advanced — later pass"],
  ["sprite-machine-advanced", "sprite advanced — later pass"],
  ["sprite-ward-advanced", "sprite advanced — later pass"],
  ["machine-drone-micro", "machine band template"],
  ["machine-drone-small", "machine band template"],
  ["machine-drone-medium", "machine band template"],
  ["machine-vehicle-bike", "machine band template"],
  ["machine-vehicle-car", "machine band template"],
  ["machine-vehicle-heavy", "machine band template"],
  ["machine-vehicle-air", "machine band template"],
  ["machine-vehicle-water", "machine band template"],
  ["machine-vehicle-space", "machine band template"],
]);

const BAND_LABEL = {
  "corp-security": "corp",
  "reach-streets": "streets",
  rivals: "rivals",
  "veil-undead": "veil",
  "wire-machine": "wire",
  elementals: "elementals",
  spirits: "spirits",
  sprites: "sprites",
  nodes: "nodes",
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

function kindFromName(name) {
  const base = String(name).toLowerCase();
  if (base === "bestiary" || base === "npc" || base === "npcs" || base === "humanoid" || base === "humanoids") return "bestiary";
  if (base === "summon" || base === "summons") return "summons";
  if (["corp-security", "reach-streets", "rivals", "veil-undead", "wire-machine", "portraits", "arg"].includes(base)) return "bestiary";
  if (["elementals", "spirits", "sprites", "nodes"].includes(base)) return "summons";
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
  const bySlug = new Map();
  const byKind = { bestiary: new Map(), summons: new Map() };
  for (const pack of Object.values(PACKS)) {
    const allow = new Set(pack.slugs);
    for (const file of walkJson(pack.src)) {
      const slug = basename(file, ".json");
      if (!allow.has(slug)) continue;
      const doc = JSON.parse(readFileSync(file, "utf8"));
      const nameKey = typeof doc.name === "string" && doc.name.startsWith("GHOSTWIRE.") ? doc.name : null;
      const name = (nameKey && localize(lang, nameKey)) || pascal(slug);
      const relParts = relative(pack.src, file).split(/[/\\]/);
      const folder = relParts.length > 1 ? relParts[0] : "";
      const monster = doc.system?.monster ?? {};
      const entry = {
        slug,
        kind: pack.kind,
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
      };
      bySlug.set(slug, entry);
      byKind[pack.kind].set(slug, entry);
    }
  }
  return { bySlug, byKind, lang };
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
    if (slug.endsWith("-ice")) aliases.set(slug.slice(0, -4), slug);
  }
  aliases.set("choir-mother", "the-choirmother");
  aliases.set("choirmother", "the-choirmother");
  aliases.set("ferryman", "the-ferryman");
  aliases.set("warlord", "the-warlord");
  aliases.set("veil-cult", "veil-cultist");
  aliases.set("ember-companion", "companion-ember");
  aliases.set("zephyr-companion", "companion-zephyr");
  aliases.set("boulder-companion", "companion-boulder");
  aliases.set("bound-elemental-rank-1", "elemental-rank-1");
  aliases.set("elemental-rank1", "elemental-rank-1");
  aliases.set("guardian-spirit", "spirit-guardian");
  aliases.set("hunter-spirit", "spirit-hunter");
  aliases.set("warrior-spirit", "spirit-warrior");
  aliases.set("node-track-1", "node-token-track-1");
  aliases.set("node-track-2", "node-token-track-2");
  aliases.set("wired-node-track-1", "node-token-track-1");
  aliases.set("wired-node-track-2", "node-token-track-2");
  aliases.set("wired-node-track1", "node-token-track-1");
  aliases.set("wired-node-track2", "node-token-track-2");
  aliases.set("arg-corporate-enforcer", "corp-enforcer");
  aliases.set("arg-corp-enforcer", "corp-enforcer");
  aliases.set("arg-response-lieutenant", "response-lieutenant");
  aliases.set("arg-security-officer", "corp-security-officer");
  aliases.set("arg-corp-security-officer", "corp-security-officer");
  return aliases;
}

function resolveSlug(stem, kind, catalog, aliases) {
  const slug = aliases.get(stem) ?? null;
  if (!slug) return null;
  const entry = catalog.bySlug.get(slug);
  if (!entry) return null;
  if (kind && entry.kind !== kind) return null;
  return entry;
}

function artRel(kind, slug, ext = PREFERRED_EXT) {
  const over = ART_OVERRIDES[slug];
  const folder = PACKS[kind].folder;
  if (over) return `${folder}/${over.subdir}/${over.stem}${ext}`;
  return `${folder}/${slug}${ext}`;
}

function moduleImg(kind, slug, ext = PREFERRED_EXT) {
  return `modules/${MODULE_ID}/assets/tokens/${artRel(kind, slug, ext)}`;
}

function destPath(kind, slug, ext = PREFERRED_EXT) {
  const over = ART_OVERRIDES[slug];
  if (over) return join(PACKS[kind].dest, over.subdir, `${over.stem}${ext}`);
  return join(PACKS[kind].dest, `${slug}${ext}`);
}

function printHelp() {
  console.log(`Apply portrait art to Ghostwire Bestiary + L≤4 Summons Actors (B103).

Usage:
  node tools/apply-bestiary-portrait-art.mjs [--from DIR] [--kind bestiary|summons]
  node tools/apply-bestiary-portrait-art.mjs --list
  node tools/apply-bestiary-portrait-art.mjs --dry-run --from DIR
  node tools/apply-bestiary-portrait-art.mjs --no-build

Options:
  --from DIR     Incoming images (flat, or bestiary/ + summons/ subfolders).
                 Copied into assets/tokens/{bestiary,summons}/<slug>.webp.
  --kind KIND    When --from is a flat folder, treat every file as that pack.
  --list         Print inventory (slug, pack JSON, current img + token, art).
  --dry-run      Show copies + img/token writes; do not write files or rebuild.
  --no-build     Update src JSON only; skip tools/build-packs.mjs.
  --ignore-unknown
                 Warn on unmatched filenames instead of failing.

Stamps Actor img AND prototypeToken.texture.src. Embedded item icons are
untouched. Scope is 57 Actors: 40 bestiary (33 humanoids + 7 ICE) and
17 summons (companions / rank 1, spirits, sprite minor+intermediate, nodes).

Close Foundry before a pack rebuild. Do not bump module.json until art ships.
`);
}

function printList(catalog) {
  const rows = [...catalog.bySlug.values()].sort((a, b) => {
    if (a.kind !== b.kind) return a.kind.localeCompare(b.kind);
    if (a.band !== b.band) return a.band.localeCompare(b.band);
    if (a.level !== b.level) return (a.level ?? 0) - (b.level ?? 0);
    return a.slug.localeCompare(b.slug);
  });
  console.log(`Ghostwire B103 portraits — ${catalog.byKind.bestiary.size} bestiary + ${catalog.byKind.summons.size} summons = ${rows.length} Actors`);
  console.log("kind\tband\tL\tslug\tname\torg\trole\tpack JSON\tmodule img\tart\timg-set\ttoken-set");
  for (const row of rows) {
    const expected = moduleImg(row.kind, row.slug);
    const onDisk = existsSync(destPath(row.kind, row.slug)) ? "yes" : "no";
    const imgSet = row.img === expected ? "yes" : "no";
    const tokenSet = row.token === expected ? "yes" : "no";
    console.log(
      `${row.kind}\t${row.band}\t${row.level ?? "-"}\t${row.slug}\t${row.name}\t${row.organization || "-"}\t${row.role || "-"}\t${row.rel}\t${expected}\t${onDisk}\t${imgSet}\t${tokenSet}`,
    );
  }
}

function collectIncoming(fromDir, kindFlag, catalog, aliases) {
  const found = [];
  const unknown = [];
  const defaultKind = kindFlag ?? kindFromRel(fromDir) ?? kindFromName(basename(fromDir));
  const files = walkFiles(fromDir).filter(f => IMAGE_EXT.has(extname(f).toLowerCase()));
  for (const file of files) {
    const rel = relative(fromDir, file);
    const stem = slugify(basename(file, extname(file)));
    if (!stem) continue;
    const kind = kindFromRel(rel) ?? defaultKind;
    const entry = resolveSlug(stem, kind, catalog, aliases) ?? (!kind ? resolveSlug(stem, null, catalog, aliases) : null);
    if (!entry) {
      const skipReason = SKIP.get(stem) ?? SKIP.get(stem.replaceAll("-", "")) ?? null;
      unknown.push({ file, rel, slug: stem, kind, skipReason });
      continue;
    }
    found.push({ file, ext: extname(file).toLowerCase(), entry });
  }
  return { found, unknown };
}

function collectStaged(catalog) {
  const found = [];
  for (const entry of catalog.bySlug.values()) {
    const preferred = destPath(entry.kind, entry.slug, PREFERRED_EXT);
    let file = existsSync(preferred) ? preferred : null;
    let ext = PREFERRED_EXT;
    if (!file) {
      for (const other of IMAGE_EXT) {
        const candidate = destPath(entry.kind, entry.slug, other);
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
    const key = `${job.entry.kind}:${job.entry.slug}`;
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
  if (!doc.prototypeToken.texture || typeof doc.prototypeToken.texture !== "object") {
    doc.prototypeToken.texture = {};
  }
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
    const dest = destPath(entry.kind, entry.slug, ext);
    const img = moduleImg(entry.kind, entry.slug, ext);
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

function rebuildPacks(kinds) {
  const unique = [...new Set(kinds)];
  for (const pack of unique) {
    const lock = join(ROOT, "packs", pack, "LOCK");
    if (existsSync(lock)) {
      console.warn(`warn: packs/${pack}/LOCK exists — close Foundry before rebuilding LevelDB.`);
    }
  }
  const r = spawnSync(process.execPath, [join(ROOT, "tools/build-packs.mjs"), ...unique], {
    cwd: ROOT,
    stdio: "inherit",
  });
  if (r.status !== 0) throw new Error(`tools/build-packs.mjs ${unique.join(" ")} failed with status ${r.status}`);
}

function parseKindArg(kindArg) {
  if (!kindArg) return null;
  const kind = kindFromName(kindArg);
  if (!kind) {
    console.error(`error: --kind must be bestiary or summons (got ${kindArg})`);
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
  for (const pack of Object.values(PACKS)) {
    if (catalog.byKind[pack.kind].size !== pack.expected) {
      const missing = pack.slugs.filter(s => !catalog.byKind[pack.kind].has(s));
      console.warn(`warn: expected ${pack.expected} ${pack.kind} Actors; found ${catalog.byKind[pack.kind].size}`);
      if (missing.length) console.warn(`warn: missing pack JSON for: ${missing.join(", ")}`);
    }
  }
  if (catalog.bySlug.size !== EXPECTED_TOTAL) {
    console.warn(`warn: expected ${EXPECTED_TOTAL} in-scope Actors; found ${catalog.bySlug.size}`);
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
      for (const u of unknown) {
        const why = u.skipReason ? `out of scope: ${u.skipReason}` : "unmatched";
        console.warn(`unknown slug: ${u.rel} (${u.slug}${u.kind ? `, ${u.kind}` : ""}; ${why})`);
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
    console.log("Drop <slug>.webp into assets/tokens/bestiary/ or assets/tokens/summons/, or pass --from DIR.");
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
  rebuildPacks(updated.map(u => u.kind));
  return 0;
}

process.exit(main());
