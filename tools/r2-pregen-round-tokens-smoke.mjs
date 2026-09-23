#!/usr/bin/env node
/**
 * R2 smoke (0.3.121) — round pregen canvas tokens.
 *
 * Asserts the whole R2 contract:
 *   1. every listed stem exists as a 1024² WebP with a real alpha channel;
 *   2. the alpha is actually a *circle* — opaque at the centre, transparent in all four corners,
 *      and roughly πr²/4 ≈ 78.5% of the canvas covered;
 *   3. every pregen Actor's `prototypeToken.texture.src` points into assets/tokens/pregens/ and
 *      its `img` still points at the untouched square plate under assets/pregens/;
 *   4. the Changer `*Art` (portrait) / `*Token` (round) split is complete on Vira and Wren, and
 *      covers all three forms;
 *   5. `scripts/module.mjs` reads both halves and never forces the token onto the portrait path;
 *   6. the square portrait files are untouched — still rectangular, still no alpha.
 *
 * Alpha is read by piping the file through ffmpeg's `alphaextract` (ffmpeg is on PATH on Allfather;
 * Windows `convert.exe` is NOT ImageMagick and is never used).
 *
 * Run: node tools/r2-pregen-round-tokens-smoke.mjs
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { SOURCES, TOKEN_SIZE, probe, squareCrop, tokenPathFor } from "./pregen-round-tokens.mjs";

const MODULE_ID = "draw-steel-ghostwire";
const PREGENS = "src/packs/pregens";
const PORTRAIT_DIR = `modules/${MODULE_ID}/assets/pregens/`;
const TOKEN_DIR = `modules/${MODULE_ID}/assets/tokens/pregens/`;
const read = p => JSON.parse(readFileSync(p, "utf8"));

const failures = [];
const ok = (cond, msg) => { if (cond) console.log(`  ✓ ${msg}`); else { failures.push(msg); console.log(`  ✗ ${msg}`); } };

const files = readdirSync(PREGENS).filter(f => f.endsWith(".json") && !f.startsWith("_"));
const actors = Object.fromEntries(files.map(f => [f.replace(/\.json$/, ""), read(join(PREGENS, f))]));
const gw = a => a.flags?.[MODULE_ID] ?? {};
const local = src => typeof src === "string" && src.startsWith(`modules/${MODULE_ID}/`) && existsSync(src.slice(`modules/${MODULE_ID}/`.length));

/** Downsample the alpha plane to an N×N grid of 0–255 coverage values. */
function alphaGrid(file, n = 16) {
  const raw = execFileSync("ffmpeg", ["-v", "error", "-i", file, "-vf", `alphaextract,scale=${n}:${n}:flags=area`,
    "-f", "rawvideo", "-pix_fmt", "gray", "-"], { stdio: ["ignore", "pipe", "pipe"], maxBuffer: 1 << 20 });
  return [...raw];
}

console.log(`R2 round pregen tokens smoke — ${SOURCES.length} stems, ${files.length} actors\n`);

console.log("1) Every listed stem is a 1024² WebP with an alpha channel");
for (const { stem } of SOURCES) {
  const file = tokenPathFor(stem);
  if (!existsSync(file)) { ok(false, `${stem}: ${file} is missing`); continue; }
  const { width, height, pixFmt } = probe(file);
  ok(width === TOKEN_SIZE && height === TOKEN_SIZE, `${stem}: ${width}×${height}`);
  // yuva420p is what every other Ghostwire circular token carries (bestiary/arg, drones/mule-bot).
  ok(/a/.test(pixFmt), `${stem}: ${pixFmt} carries alpha`);
}

console.log("\n2) The alpha is a circle — opaque centre, clear corners, ~78.5% coverage");
const N = 16;
for (const { stem } of SOURCES) {
  const file = tokenPathFor(stem);
  if (!existsSync(file)) continue;
  const g = alphaGrid(file, N);
  const at = (x, y) => g[y * N + x];
  const corners = [at(0, 0), at(N - 1, 0), at(0, N - 1), at(N - 1, N - 1)];
  const centre = [at(N / 2, N / 2), at(N / 2 - 1, N / 2 - 1)];
  const coverage = g.reduce((s, v) => s + v, 0) / (g.length * 255);
  ok(corners.every(v => v <= 24), `${stem}: all four corners transparent (max ${Math.max(...corners)}/255)`);
  ok(centre.every(v => v >= 230), `${stem}: centre opaque (min ${Math.min(...centre)}/255)`);
  // A perfect inscribed disc is π/4 = 0.785 of the square; the feathered rim and 4:2:0 alpha give a
  // little slack either way. A square plate would come back at 1.0 and fail here.
  ok(coverage > 0.72 && coverage < 0.83, `${stem}: ${(coverage * 100).toFixed(1)}% of the canvas is inked (disc ≈ 78.5%)`);
}

console.log("\n3) The square portraits under assets/pregens/ were not touched");
for (const f of readdirSync("assets/pregens").filter(n => n.endsWith(".webp"))) {
  const { width, height, pixFmt } = probe(`assets/pregens/${f}`);
  ok(width !== height, `${f}: still rectangular (${width}×${height}) — not rounded in place`);
  ok(!/a/.test(pixFmt), `${f}: still opaque (${pixFmt})`);
}

console.log("\n4) Every pregen Actor: square portrait on the sheet, round token on the canvas");
for (const [slug, a] of Object.entries(actors)) {
  const src = a.prototypeToken?.texture?.src;
  ok(local(a.img) && a.img.startsWith(PORTRAIT_DIR), `${slug}: img → ${String(a.img).replace(/.*\//, "")}`);
  ok(local(src) && src.startsWith(TOKEN_DIR), `${slug}: prototypeToken → ${String(src).replace(/.*\//, "")}`);
  ok(src !== a.img, `${slug}: the two are different files`);
  const stem = String(src).replace(/.*\//, "").replace(/\.webp$/, "");
  ok(SOURCES.some(s => s.stem === stem), `${slug}: token stem ${stem} is built by pregen-round-tokens`);
}

console.log("\n5) Changer forms carry both halves (Vira human / hybrid / beast, Wren default / hybrid / beast)");
for (const slug of ["vira-kellis-nade", "wren-sable-corvin"]) {
  const c = gw(actors[slug]).changer ?? {};
  for (const key of ["humanArt", "hybridArt", "beastArt"])
    ok(local(c[key]) && c[key].startsWith(PORTRAIT_DIR), `${slug}: ${key} is a square portrait`);
  for (const key of ["humanToken", "hybridToken", "beastToken"])
    ok(local(c[key]) && c[key].startsWith(TOKEN_DIR), `${slug}: ${key} is a round token`);
  const tokens = [c.humanToken, c.hybridToken, c.beastToken];
  ok(new Set(tokens).size === 3, `${slug}: three distinct form tokens`);
  ok(c.humanToken === actors[slug].prototypeToken.texture.src, `${slug}: humanToken is the default canvas token`);
  ok(c.humanArt === actors[slug].img, `${slug}: humanArt is the default sheet portrait`);
}

console.log("\n6) syncChangerFormArt reads *Token for the canvas and *Art for the sheet");
// CRLF-normalised: core.autocrlf is on here, so a fresh checkout hands us \r\n and a naive
// indexOf("\n}\n") would slice the function body down to nothing and "pass" on an empty string.
const readText = p => readFileSync(p, "utf8").replace(/\r\n/g, "\n");
const module_ = readText("scripts/module.mjs");
const fn = module_.slice(module_.indexOf("async function syncChangerFormArt"));
const body = fn.slice(0, fn.indexOf("\n}\n") + 2);
ok(body.length > 400, `syncChangerFormArt body located (${body.length} chars)`);
ok(/CHANGER_TOKEN_KEYS\s*=\s*\{\s*human:\s*"humanToken",\s*hybrid:\s*"hybridToken",\s*beast:\s*"beastToken"\s*\}/.test(module_),
  "module.mjs declares the humanToken / hybridToken / beastToken map");
ok(/CHANGER_ART_KEYS\s*=\s*\{\s*human:\s*"humanArt",\s*hybrid:\s*"hybridArt",\s*beast:\s*"beastArt"\s*\}/.test(module_),
  "module.mjs declares the humanArt / hybridArt / beastArt map");
ok(/update\.img\s*=\s*portrait/.test(body), "the sheet portrait comes from *Art");
ok(/update\["prototypeToken\.texture\.src"\]\s*=\s*token/.test(body), "the prototype token comes from *Token");
ok(/placed\.update\(\{\s*"texture\.src":\s*token\s*\}\)/.test(body), "placed tokens take *Token");
ok(!/const src = \{ beast: art\.beastArt/.test(module_), "the pre-R2 single-src swap is gone");
ok(/keys: CHANGER_TOKEN_KEYS/.test(module_) && /ghostwire-changer-form-art-\$\{kind\}/.test(module_),
  "the Hero sheet offers a round-token picker per form beside the portrait picker");

console.log("\n7) The generator wires the split (tools/pregens-to-actors.mjs)");
const gen = readText("tools/pregens-to-actors.mjs");
ok(/function tokenPath\(/.test(gen) && /assets\/tokens\/pregens\//.test(gen), "tokenPath() resolves assets/tokens/pregens/");
ok(/texture: \{ src: token,/.test(gen), "prototypeToken.texture.src takes the round token");
ok(/const img = artPath\(/.test(gen), "img still takes artPath() (assets/pregens/)");
ok(/humanToken: token,/.test(gen), "Changer humanToken is the round token");

console.log("\n8) Every source plate the tool reads is still in the repo (a rebuild is reproducible)");
for (const entry of SOURCES) {
  const source = entry.circle ?? entry.plate;
  ok(existsSync(source), `${entry.stem} ← ${source}`);
  if (entry.plate && existsSync(source)) {
    const meta = probe(source);
    const { size, x, y } = squareCrop(meta, entry);
    ok(x >= 0 && y >= 0 && x + size <= meta.width && y + size <= meta.height,
      `${entry.stem}: crop ${size}² at ${x},${y} sits inside ${meta.width}×${meta.height}`);
  }
}

console.log("");
if (failures.length) { console.error(`r2-pregen-round-tokens-smoke: ${failures.length} FAILED\n  ${failures.join("\n  ")}`); process.exit(1); }
console.log(`r2-pregen-round-tokens-smoke: all checks passed`);
