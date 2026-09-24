// 0.3.131 (A) — the generator behind assets/fx/*.png.
//
// **Why a generator and not a folder of clips.** 0.3.131 had to make a gun hit visible with
// Automated Animations, Sequencer and JB2A all switched off, and the obvious shortcut — copy a few
// WebMs out of the JB2A free pack next door — is licensed CC BY-NC-SA 4.0. Re-hosting those inside
// a repository under a different licence is a share-alike problem nobody wants to litigate over a
// muzzle flash. So Ghostwire draws its own.
//
// Every file this writes is a greyscale+alpha PNG whose grey channel is **flat 255**. That matters:
// a browser decodes it to pure white pixels with a shaped alpha, so one texture tints to any colour
// a profile asks for and a single `glow.png` serves the orange of a tracer and the violet of a Dark
// Blast alike. Six small files cover four kinds; nothing here is bigger than 256 px or 6 KB.
//
// Run: `node tools/make-fx-assets.mjs`. It is deterministic — re-running it produces byte-identical
// files, so it is safe in a smoke and the committed PNGs are always reproducible from this source.

import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT = "assets/fx";

/* -------------------------------------------- a minimal PNG writer */

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    table[n] = c;
  }
  return table;
})();

function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, body) {
  const head = Buffer.alloc(8);
  head.writeUInt32BE(body.length, 0);
  head.write(type, 4, "ascii");
  const tail = Buffer.alloc(4);
  tail.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), body])), 0);
  return Buffer.concat([head, body, tail]);
}

/**
 * Write one greyscale+alpha PNG (colour type 4).
 * @param {string} name
 * @param {number} width
 * @param {number} height
 * @param {(x: number, y: number) => number} alphaAt  0..1 coverage at a pixel centre.
 */
function writePng(name, width, height, alphaAt) {
  // Filter 0 (None) on every row: the grey byte never changes, so deflate eats the rows anyway and
  // the file stays small without a filter heuristic nobody would ever read again.
  const raw = Buffer.alloc(height * ((width * 2) + 1));
  let p = 0;
  for (let y = 0; y < height; y += 1) {
    raw[p] = 0; p += 1;
    for (let x = 0; x < width; x += 1) {
      const a = Math.max(0, Math.min(1, alphaAt(x + 0.5, y + 0.5)));
      raw[p] = 255; p += 1;                        // grey: flat white, so `tint` owns the colour
      raw[p] = Math.round(a * 255); p += 1;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;                                     // bit depth
  ihdr[9] = 4;                                     // colour type: greyscale + alpha
  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
  const path = join(OUT, name);
  writeFileSync(path, png);
  console.log(`  ${OUT}/${name}  ${width}x${height}  ${png.length} bytes`);
}

/* -------------------------------------------- the shapes */

const clamp01 = v => Math.max(0, Math.min(1, v));
/** A soft falloff that reaches exactly 0 at the edge — no hard ring where the texture stops. */
const falloff = (t, power) => Math.pow(clamp01(1 - t), power);
const gauss = (d, sigma) => Math.exp(-((d * d) / (2 * sigma * sigma)));

mkdirSync(OUT, { recursive: true });
console.log("0.3.131 — generating assets/fx\n");

// glow: the workhorse. A hot core inside a wide halo — muzzle, tracer head, impact flash.
writePng("glow.png", 128, 128, (x, y) => {
  const r = Math.hypot(x - 64, y - 64) / 64;
  return clamp01(falloff(r, 2.2) + (0.85 * gauss(r, 0.13)));
});

// flare: glow plus four spikes. The beat that says "something just went off here".
writePng("flare.png", 128, 128, (x, y) => {
  const dx = (x - 64) / 64;
  const dy = (y - 64) / 64;
  const r = Math.hypot(dx, dy);
  const core = falloff(r, 3) + (0.9 * gauss(r, 0.09));
  const spikeH = gauss(dy, 0.035) * falloff(Math.abs(dx), 1.6);
  const spikeV = gauss(dx, 0.035) * falloff(Math.abs(dy), 1.6);
  const diag = (gauss((dx - dy) / 1.414, 0.03) + gauss((dx + dy) / 1.414, 0.03)) * falloff(r, 2.4) * 0.45;
  return clamp01(core + (0.8 * (spikeH + spikeV)) + diag);
});

// ring: the impact shockwave, scaled up over the beat.
writePng("ring.png", 128, 128, (x, y) => {
  const r = Math.hypot(x - 64, y - 64) / 62;
  if (r > 1) return 0;
  return clamp01(gauss(r - 0.80, 0.085) + (0.16 * falloff(Math.abs(r - 0.80) / 0.8, 2)));
});

// beam: stretched muzzle→target. Bright centre line, soft shoulders, tapered ends so a stretched
// sprite never shows a cut edge at either token.
writePng("beam.png", 256, 32, (x, y) => {
  const t = x / 256;
  const dy = (y - 16) / 16;
  const body = gauss(dy, 0.10) + (0.35 * gauss(dy, 0.42));
  const taper = Math.min(1, clamp01(t / 0.12)) * Math.min(1, clamp01((1 - t) / 0.06));
  return clamp01(body * taper);
});

// spark: a tapered streak for the shards thrown off an impact, bright end trailing to nothing.
writePng("spark.png", 64, 16, (x, y) => {
  const t = x / 64;
  const dy = (y - 8) / 8;
  return clamp01(gauss(dy, 0.10 + (0.22 * (1 - t))) * Math.pow(t, 1.4));
});

// slash: the melee crescent. A band swept around an arc, fat at the middle and thin at both tips.
writePng("slash.png", 128, 128, (x, y) => {
  const dx = (x - 64) / 58;
  const dy = (y - 64) / 58;
  const r = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx);
  const half = Math.PI * 0.42;                     // the crescent spans ~150 degrees
  if (Math.abs(angle) > half) return 0;
  const along = Math.abs(angle) / half;            // 0 at the middle of the sweep, 1 at a tip
  const width = 0.16 * falloff(along, 0.9);
  if (width <= 0) return 0;
  return clamp01(gauss(r - 0.80, width) * (0.35 + (0.65 * falloff(along, 0.8))));
});

console.log("\ndone.");
