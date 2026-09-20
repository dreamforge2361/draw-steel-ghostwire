#!/usr/bin/env node
/**
 * B106 smoke: Gold Line plates + scene template stay locked to the dual-Hammerhead stitch.
 *
 * Run: node tools/gold-line-scene-smoke.mjs
 * Does not write pack JSON or rebuild packs.
 */
import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const failures = [];
const ok = (cond, msg) => {
  if (!cond) failures.push(msg);
  else console.log(`  ✓ ${msg}`);
};

const ASSETS = {
  interiorStill: "assets/maps/battlemaps/gold-line/map-gold-line-interior.webp",
  roofsStill: "assets/maps/battlemaps/gold-line/map-gold-line-roofs.webp",
  interiorLoop: "assets/maps/battlemaps/gold-line/map-gold-line-interior-loop.webm",
  roofsLoop: "assets/maps/battlemaps/gold-line/map-gold-line-roofs-loop.webm",
};
const TEMPLATE = "data/scenes/gold-line.json";
const MODULE = "module.json";
const SOR = "docs/directors/runs/deadhead/DEADHEAD-GOLD-LINE.md";
const SCRIPT = "scripts/gold-line-scene.mjs";
const JOURNAL = "src/packs/runs/deadhead/gold-line-map.json";

function readBomFreeJson(path) {
  const buf = readFileSync(path);
  ok(buf[0] !== 0xEF && buf[1] !== 0xBB && buf[2] !== 0xBF, `${path} is BOM-free`);
  return JSON.parse(buf.toString("utf8"));
}

function webpSize(path) {
  const data = readFileSync(path);
  if (data.subarray(12, 16).toString() === "VP8X") {
    return {
      w: 1 + data.readUIntLE(24, 3),
      h: 1 + data.readUIntLE(27, 3),
    };
  }
  if (data.subarray(12, 16).toString() === "VP8 ") {
    return {
      w: data.readUInt16LE(26) & 0x3fff,
      h: data.readUInt16LE(28) & 0x3fff,
    };
  }
  throw new Error(`${path}: not a VP8/VP8X WebP`);
}

function probeVideo(path) {
  const out = execFileSync("ffprobe", [
    "-v", "error",
    "-select_streams", "v:0",
    "-show_entries", "stream=width,height,codec_name,r_frame_rate",
    "-of", "json",
    path,
  ], { encoding: "utf8" });
  return JSON.parse(out).streams[0];
}

console.log("Gold Line map pack smoke");

ok(existsSync(SCRIPT), "inject script exists");
ok(existsSync(JOURNAL), "Deadhead journal source exists");

const moduleJson = readBomFreeJson(MODULE);
ok(moduleJson.version === "0.3.37", `module.json is 0.3.37 (got ${moduleJson.version})`);
ok(moduleJson.esmodules.includes("scripts/module.mjs"), "module still loads scripts/module.mjs");

const template = readBomFreeJson(TEMPLATE);
ok(template.width === 6472 && template.height === 958, "template canvas is 6472×958");
ok(template.grid.size === 208, "template grid size is 208");
ok(template.grid.distance === 5 && template.grid.units === "ft", "template grid is 5 ft");
ok(template.roofTile.occlusion.mode === 2, "roof occlusion is SURFACE (2)");
ok(template.roofTile.elevation === 10, "roof tile elevation is 10");
ok(template.roofTile.width === 6472 && template.roofTile.height === 958, "roof tile matches plate");
ok(template.version >= 2, `template version is 2+ (got ${template.version})`);
ok(template.roofTile.video.loop === true && template.roofTile.video.autoplay === true, "roof tile loops");
ok(template.level.video?.loop === true && template.level.video?.autoplay === true, "level template has video loop/autoplay");

const squaresX = template.width / template.grid.size;
const squaresY = template.height / template.grid.size;
ok(squaresX > 31 && squaresX < 32, `scene is ~31 squares wide (got ${squaresX.toFixed(2)})`);
ok(squaresY > 4.5 && squaresY < 5, `scene is ~4.6 squares tall (got ${squaresY.toFixed(2)})`);

for (const [key, rel] of Object.entries(ASSETS)) {
  ok(existsSync(rel), `${key} shipped at ${rel}`);
  const modulePath = `modules/draw-steel-ghostwire/${rel}`;
  const listed = Object.values(template.assets);
  if (key.includes("Still") || key.includes("Loop")) ok(listed.includes(modulePath), `template assets list ${rel}`);
}

const interior = webpSize(ASSETS.interiorStill);
const roofs = webpSize(ASSETS.roofsStill);
ok(interior.w === 6472 && interior.h === 958, `interior still is 6472×958 (got ${interior.w}×${interior.h})`);
ok(roofs.w === 6472 && roofs.h === 958, `roofs still is 6472×958 (got ${roofs.w}×${roofs.h})`);

const interiorLoop = probeVideo(ASSETS.interiorLoop);
const roofsLoop = probeVideo(ASSETS.roofsLoop);
ok(interiorLoop.codec_name === "vp9" && interiorLoop.width === 6472 && interiorLoop.height === 958, "interior loop is VP9 6472×958");
ok(roofsLoop.codec_name === "vp9" && roofsLoop.width === 6472 && roofsLoop.height === 958, "roofs loop is VP9 6472×958");

const moduleSrc = readFileSync("scripts/module.mjs", "utf8");
ok(moduleSrc.includes("registerGoldLineScene"), "module.mjs registers Gold Line inject");

const script = readFileSync(SCRIPT, "utf8");
ok(script.includes("ensureGoldLineScene"), "inject exports ensureGoldLineScene");
ok(script.includes("SURFACE") || script.includes("occlusion"), "inject mentions roof occlusion");
ok(!/method:\s*["']HEAD["']/.test(script), "inject does not probe media with HEAD");
ok(!/\bsrcExists\s*\(/.test(script), "inject does not call srcExists (HEAD)");
ok(script.includes("FilePicker.browse") && script.includes("Range"), "inject probes via FilePicker or ranged GET");
ok(script.includes("levelBackground") && script.includes("background.video"), "inject sets Level background video flags for loops");
ok(/roof\.update\(data\)/.test(script), "force updates an existing roof tile");

const sor = readFileSync(SOR, "utf8");
ok(/L1.*TAIL/i.test(sor) && /R1.*COURIER/i.test(sor) && /R3.*CAB/i.test(sor), "SoR has dual-Hammerhead beat remap");
ok(/map-gold-line-interior-loop\.webm/.test(sor), "SoR points at the interior loop");
ok(!/Draw Steel|MCDM/i.test(sor), "SoR stays Ghostwire-only (no Draw Steel / MCDM)");

const journal = readBomFreeJson(JOURNAL);
ok(/^[A-Za-z0-9]{16}$/.test(journal._id), "journal _id is 16 alphanumeric");
ok(journal.folder === "gwRunsDeadhead00", "journal sits in Deadhead folder");
ok(journal.pages?.length >= 2, "journal has plate + beat pages");
for (const page of journal.pages ?? []) {
  ok(/^[A-Za-z0-9]{16}$/.test(page._id), `page ${page.name} _id is 16 alphanumeric`);
}

if (failures.length) {
  console.error("\nFAILED:");
  for (const msg of failures) console.error(`  ✗ ${msg}`);
  process.exit(1);
}
console.log("\nAll Gold Line smoke checks passed.");
