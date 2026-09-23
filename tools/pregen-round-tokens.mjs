#!/usr/bin/env node
/**
 * R2 (0.3.121): build the round, transparent canvas tokens for every pregen — and for every
 * Changer form — under assets/tokens/pregens/.
 *
 * Why this exists: until 0.3.120 a pregen's Actor `img` and its `prototypeToken.texture.src` were
 * the *same* square dossier plate from assets/pregens/. On the canvas that reads as a rectangular
 * photo dropped on the battle map, while every other Ghostwire token (bestiary, ARG, mule-bot,
 * kiosk) is a 1024² circular plate with alpha. R2 splits the two: the sheet portrait stays the
 * square file, and the token becomes the circle this tool cuts.
 *
 * Output matches the existing token habit exactly: **1024×1024 WebP, pix_fmt yuva420p**
 * (see assets/tokens/bestiary/arg/*.webp and assets/tokens/drones/mule-bot.webp).
 *
 * Sources, in the order the brief locks them:
 *   1. the print-art circles under docs/manuscript/print-art/pregens/*_circle.png, when one is
 *      mapped — they are already Michael's framing, just at 512²;
 *   2. otherwise the highest-resolution square plate we hold (the pre-compress PNG masters under
 *      assets/pregens/_pre-compress-backup/, or a print portrait), cut to a square and masked.
 *
 * Tooling: **ffmpeg only**. Windows ships a `convert.exe` that is *not* ImageMagick — never call it.
 * The circular alpha is cut with `geq`, with a one-pixel feather so the rim is not stair-stepped.
 *
 * Run:    node tools/pregen-round-tokens.mjs            (writes only what changed)
 *         node tools/pregen-round-tokens.mjs --force    (rewrite every token)
 *         node tools/pregen-round-tokens.mjs --check    (report, write nothing)
 * Smoke:  node tools/r2-pregen-round-tokens-smoke.mjs
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, statSync } from "node:fs";

export const OUT_DIR = "assets/tokens/pregens";
export const TOKEN_SIZE = 1024;

const PRINT = "docs/manuscript/print-art/pregens";
const MASTERS = "assets/pregens/_pre-compress-backup";

/**
 * One row per token stem. `circle` names an already-round print plate (upscaled, re-masked);
 * `plate` names a rectangular source that has to be cropped square first.
 *
 * `focusX` / `focusY` pan the square crop across the free axis of a rectangular plate:
 * 0 = flush left / top, 0.5 = centred, 1 = flush right / bottom. The print circles were cut
 * **top-anchored and full-width** off the 1529×2048 plates (barak_circle lines up pixel-for-pixel
 * with barak_2048 at y=0), so a tall plate defaults to focusY 0 and a wide one to focusX 0.5.
 */
export const SOURCES = [
  // --- print circles (Michael's own crops) -------------------------------------------------
  { stem: "barak-voss-hallor", circle: `${PRINT}/barak_circle.png` },
  { stem: "kaes-vahn-estal", circle: `${PRINT}/kais_circle.png` },
  { stem: "kessic-draye", circle: `${PRINT}/null_circle.png` },
  { stem: "sabbat-vane", circle: `${PRINT}/sabbat_circle.png` },
  { stem: "vessa-corran-dov", circle: `${PRINT}/vessa_circle.png` },
  // Michael's locked mapping (brief 0.3.121 R2, step 3). NOTE for the next art pass: vira_circle
  // is cut from the *hybrid* plate (rat ears), so Vira's human-form token reads hybrid. Swapping
  // this one row to `{ stem: "vira-kellis-nade-human", plate: `${MASTERS}/vira-kellis-nade-human.png` }`
  // is the whole fix if Michael wants the human plate instead — see the director note.
  { stem: "vira-kellis-nade-human", circle: `${PRINT}/vira_circle.png` },

  // --- cut from square plates --------------------------------------------------------------
  { stem: "vira-kellis-nade-hybrid", plate: `${MASTERS}/vira-kellis-nade-hybrid.png` },
  // The rat sits right of centre on a 16:9 plate — pan the crop onto its head without losing the body.
  { stem: "vira-kellis-nade-beast", plate: `${MASTERS}/vira-kellis-nade-beast.png`, focusX: 0.62 },
  // Wren has no *_circle in the print bundle; her print portraits are the best masters we hold
  // (1024×1536 vs the 683×1024 shipped WebP).
  { stem: "wren-sable-corvin", plate: `${PRINT}/wren_portrait.png` },
  // The hybrid plate is 16:9 and she sits left of centre, so pan the crop toward her.
  { stem: "wren-sable-corvin-hybrid", plate: `${MASTERS}/wren-sable-corvin-hybrid.png`, focusX: 0.28 },
  { stem: "wren-sable-corvin-beast", plate: `${PRINT}/wren_beast_portrait.png` },
];

export const tokenPathFor = stem => `${OUT_DIR}/${stem}.webp`;

const ff = (args, bin = "ffmpeg") => execFileSync(bin, args, { stdio: ["ignore", "pipe", "pipe"] }).toString();

/** width/height of any image ffprobe can open. */
export function probe(file) {
  const [w, h, fmt] = ff(["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height,pix_fmt",
    "-of", "csv=p=0", file], "ffprobe").trim().split(",");
  return { width: Number(w), height: Number(h), pixFmt: fmt };
}

/**
 * The circular alpha. Radius is half the output with a 1px feather inside the rim: a hard cut
 * leaves visible stair-steps on a 1024² plate once Foundry scales it down to a 100px grid square.
 */
const FEATHER = 1.5;
function maskFilter(size = TOKEN_SIZE) {
  const c = size / 2;
  const r = c - 1; // keep the rim a hair inside the canvas so no row of the circle is clipped
  const d = `hypot(X-${c},Y-${c})`;
  return `format=rgba,geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='clip(255*(${r}-${d})/${FEATHER},0,255)*alpha(X,Y)/255'`;
}

/** Square-crop geometry for a rectangular plate, honouring focusX / focusY. */
export function squareCrop({ width, height }, { focusX, focusY } = {}) {
  const size = Math.min(width, height);
  const fx = focusX ?? 0.5;
  // A tall plate is a standing character: the head is at the top, so default to the top edge.
  const fy = focusY ?? 0;
  return {
    size,
    x: Math.round((width - size) * fx),
    y: Math.round((height - size) * fy),
  };
}

/** Build one round token. Returns the ffmpeg filter chain used, for the log. */
export function buildToken(entry, { outDir = OUT_DIR } = {}) {
  const source = entry.circle ?? entry.plate;
  if (!existsSync(source)) throw new Error(`${entry.stem}: source ${source} is missing`);
  const meta = probe(source);
  const chain = [];
  if (entry.plate) {
    const { size, x, y } = squareCrop(meta, entry);
    chain.push(`crop=${size}:${size}:${x}:${y}`);
  }
  chain.push(`scale=${TOKEN_SIZE}:${TOKEN_SIZE}:flags=lanczos`);
  chain.push(maskFilter());
  const out = `${outDir}/${entry.stem}.webp`;
  ff(["-y", "-v", "error", "-i", source, "-vf", chain.join(","),
    "-c:v", "libwebp", "-pix_fmt", "yuva420p", "-compression_level", "6", "-quality", "90", out]);
  return { source, out, filter: chain.join(","), meta };
}

if (import.meta.filename === process.argv[1] || process.argv[1]?.endsWith("pregen-round-tokens.mjs")) {
  const force = process.argv.includes("--force");
  const check = process.argv.includes("--check");
  mkdirSync(OUT_DIR, { recursive: true });
  let built = 0, kept = 0;
  for (const entry of SOURCES) {
    const out = tokenPathFor(entry.stem);
    if (check) {
      console.log(`${existsSync(out) ? "✓" : "✗"} ${out}${existsSync(out) ? ` (${probe(out).width}² ${probe(out).pixFmt})` : ""}`);
      continue;
    }
    if (!force && existsSync(out)) { kept++; console.log(`  = ${out} (exists — --force to rebuild)`); continue; }
    const r = buildToken(entry);
    built++;
    console.log(`  + ${out} ← ${r.source} (${r.meta.width}×${r.meta.height}) · ${Math.round(statSync(out).size / 1024)} KiB`);
  }
  if (!check) console.log(`\npregen-round-tokens: ${built} built, ${kept} kept — ${SOURCES.length} stems`);
}
