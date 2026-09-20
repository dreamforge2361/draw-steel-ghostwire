#!/usr/bin/env node
/**
 * B106 smoke: Gold Line plates + scene template stay locked to the dual-Hammerhead stitch.
 *
 * LOCK: Level background = interior MP4. ONE roof Tile at 0,0 elev 1. No interior tile.
 *
 * Run: node tools/gold-line-scene-smoke.mjs
 * Does not write pack JSON or rebuild packs.
 */
import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import {
  GOLD_LINE_PLATE,
  GOLD_LINE_ROOF,
  isFiniteDuration,
  safeVideoCurrentTime,
} from "../scripts/gold-line-scene.mjs";

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
  interiorLoopMp4: "assets/maps/battlemaps/gold-line/map-gold-line-interior-loop.mp4",
  roofsLoopMp4: "assets/maps/battlemaps/gold-line/map-gold-line-roofs-loop.mp4",
};
const TEMPLATE = "data/scenes/gold-line.json";
const MODULE = "module.json";
const SOR = "docs/directors/runs/deadhead/DEADHEAD-GOLD-LINE.md";
const SCRIPT = "scripts/gold-line-scene.mjs";
const JOURNAL = "src/packs/runs/deadhead/gold-line-map.json";
const PLATE = { width: 6472, height: 958 };

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
    "-show_entries", "stream=width,height,codec_name,r_frame_rate,duration",
    "-show_entries", "format=duration",
    "-of", "json",
    path,
  ], { encoding: "utf8" });
  const parsed = JSON.parse(out);
  return {
    ...parsed.streams[0],
    formatDuration: parsed.format?.duration,
  };
}

function finiteDuration(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0;
}

console.log("Gold Line map pack smoke");

ok(existsSync(SCRIPT), "inject script exists");
ok(existsSync(JOURNAL), "Deadhead journal source exists");

const moduleJson = readBomFreeJson(MODULE);
ok(moduleJson.version === "0.3.42", `module.json is 0.3.42 (got ${moduleJson.version})`);
ok(moduleJson.esmodules.includes("scripts/module.mjs"), "module still loads scripts/module.mjs");

const template = readBomFreeJson(TEMPLATE);
ok(template.width === PLATE.width && template.height === PLATE.height, "template canvas is 6472×958");
ok(template.grid.size === 208, "template grid size is 208");
ok(template.grid.distance === 5 && template.grid.units === "ft", "template grid is 5 ft");
ok(template.version >= 7, `template version is 7+ (got ${template.version})`);
ok(!template.interiorTile, "template has no interiorTile (Level background is the interior)");
ok(template.level.video?.loop === true && template.level.video?.autoplay === true, "level video loops and autoplays");

ok(template.roofTile.x === 0 && template.roofTile.y === 0, "roof tile starts at 0, 0");
ok(template.roofTile.width === PLATE.width && template.roofTile.height === PLATE.height, "roof tile is 6472×958");
ok(template.roofTile.elevation === 1 && template.roofTile.sort === 1, "roof tile elev 1 sort 1");
ok(template.roofTile.locked === true, "roof tile is locked");
ok(template.roofTile.occlusion.mode === 0 && template.roofTile.occlusion.alpha === 1, "roof occlusion is NONE (0) / solid alpha 1");
ok(template.roofTile.video.loop === true && template.roofTile.video.autoplay === true, "roof tile loops");

const squaresX = template.width / template.grid.size;
const squaresY = template.height / template.grid.size;
ok(squaresX > 31 && squaresX < 32, `scene is ~31 squares wide (got ${squaresX.toFixed(2)})`);
ok(squaresY > 4.5 && squaresY < 5, `scene is ~4.6 squares tall (got ${squaresY.toFixed(2)})`);

for (const [key, rel] of Object.entries(ASSETS)) {
  ok(existsSync(rel), `${key} shipped at ${rel}`);
  const modulePath = `modules/draw-steel-ghostwire/${rel}`;
  const listed = [
    ...Object.values(template.assets).filter(v => typeof v === "string"),
    ...(template.assets.interiorPrefer ?? []),
    ...(template.assets.roofsPrefer ?? []),
  ];
  if (/Still|Loop/.test(key)) ok(listed.includes(modulePath), `template assets list ${rel}`);
}

ok(template.assets.interiorPrefer[0].endsWith("-loop.mp4"), "interior prefer starts with loop.mp4");
ok(template.assets.interiorPrefer.some(p => p.endsWith("-loop.webm") && !p.endsWith("-loop-fixed.webm")), "interior prefer includes shipped loop.webm");
ok(template.assets.interiorPrefer.at(-1).endsWith(".webp"), "interior prefer ends with still.webp");
ok(template.assets.roofsPrefer[0].endsWith("-loop.mp4"), "roofs prefer starts with loop.mp4");
ok(template.assets.roofsPrefer.some(p => p.endsWith("-loop.webm") && !p.endsWith("-loop-fixed.webm")), "roofs prefer includes shipped loop.webm");
ok(template.assets.roofsPrefer.at(-1).endsWith(".webp"), "roofs prefer ends with still.webp");

const interior = webpSize(ASSETS.interiorStill);
const roofs = webpSize(ASSETS.roofsStill);
ok(interior.w === PLATE.width && interior.h === PLATE.height, `interior still is 6472×958 (got ${interior.w}×${interior.h})`);
ok(roofs.w === PLATE.width && roofs.h === PLATE.height, `roofs still is 6472×958 (got ${roofs.w}×${roofs.h})`);

const interiorLoop = probeVideo(ASSETS.interiorLoop);
const roofsLoop = probeVideo(ASSETS.roofsLoop);
ok(interiorLoop.codec_name === "vp9" && interiorLoop.width === PLATE.width && interiorLoop.height === PLATE.height, "interior loop is VP9 6472×958");
ok(roofsLoop.codec_name === "vp9" && roofsLoop.width === PLATE.width && roofsLoop.height === PLATE.height, "roofs loop is VP9 6472×958");

const interiorMp4 = probeVideo(ASSETS.interiorLoopMp4);
const roofsMp4 = probeVideo(ASSETS.roofsLoopMp4);
ok(interiorMp4.codec_name === "h264" && interiorMp4.width === PLATE.width && interiorMp4.height === PLATE.height, "interior mp4 is H.264 6472×958");
ok(roofsMp4.codec_name === "h264" && roofsMp4.width === PLATE.width && roofsMp4.height === PLATE.height, "roofs mp4 is H.264 6472×958");
ok(finiteDuration(interiorMp4.duration) && finiteDuration(interiorMp4.formatDuration), `interior mp4 stream duration is finite (got ${interiorMp4.duration})`);
ok(finiteDuration(roofsMp4.duration) && finiteDuration(roofsMp4.formatDuration), `roofs mp4 stream duration is finite (got ${roofsMp4.duration})`);

const moduleSrc = readFileSync("scripts/module.mjs", "utf8");
ok(moduleSrc.includes("registerGoldLineScene"), "module.mjs registers Gold Line inject");

const script = readFileSync(SCRIPT, "utf8");
ok(script.includes("ensureGoldLineScene"), "inject exports ensureGoldLineScene");
ok(script.includes("if (existing && !force) return existing"), "existing goldLineScene returns immediately unless force");
ok(!/\bstale\b/.test(script), "inject does not auto-migrate stale template versions");
const readyFn = script.slice(script.indexOf("export function registerGoldLineScene"));
ok(!/ensureGoldLineScene\(\s*\{\s*force\s*:/.test(readyFn), "ready hook does not pass force");
ok(/if \(existingGoldLineScene\(\)\) return/.test(readyFn), "ready returns if goldLineScene already exists");
ok(/Ready never passes force/.test(readyFn), "ready documents that force is GM-opt-in only");
ok(!/\bGOLD_LINE_INTERIOR\b/.test(script), "inject has no GOLD_LINE_INTERIOR tile apply");
ok(!/interiorTile/.test(script), "inject has no interiorTile apply");
ok(script.includes("removeStrayInteriorTiles") && script.includes("goldLineInterior"), "inject deletes leftover goldLineInterior tiles");
ok(script.includes("goldLineRoofs") && script.includes("GOLD_LINE_ROOF"), "inject stamps one roof motion tile");
ok(/function levelBackground/.test(script), "inject puts interior MP4 on the Level background");
ok(!/emptyLevelBackground/.test(script), "inject does not clear the Level background");
ok(!/method:\s*["']HEAD["']/.test(script), "inject does not probe media with HEAD");
ok(!/\bsrcExists\s*\(/.test(script), "inject does not call srcExists (HEAD)");
ok(script.includes("FilePicker.browse") && script.includes("Range"), "inject probes via FilePicker or ranged GET");
ok(script.includes("interiorLoopMp4") && script.includes("loop.mp4"), "inject prefers mp4 over webm");
ok(script.includes("safeVideoCurrentTime") && script.includes("isFiniteDuration"), "inject skips seek when duration is non-finite");
ok(!/3232/.test(script) && !/\b475\b/.test(script), "inject does not bake roof 3232, 475");
ok(GOLD_LINE_ROOF.occlusion.mode === 0 && GOLD_LINE_ROOF.occlusion.alpha === 1, "GOLD_LINE_ROOF is solid NONE");
ok(GOLD_LINE_ROOF.x === 0 && GOLD_LINE_ROOF.y === 0 && GOLD_LINE_ROOF.elevation === 1 && GOLD_LINE_ROOF.sort === 1, "GOLD_LINE_ROOF is 0, 0, elev 1, sort 1");
ok(GOLD_LINE_PLATE.width === PLATE.width && GOLD_LINE_PLATE.height === PLATE.height, "GOLD_LINE_PLATE is 6472×958");
ok(!/GOLD_LINE_LOCKED/.test(script), "inject does not wait on GOLD_LINE_LOCKED");
ok(/valid playable layout/i.test(script), "inject comments that stills are a valid playable layout");
ok(!isFiniteDuration(Number.NaN) && !isFiniteDuration(Infinity) && !isFiniteDuration("N/A") && isFiniteDuration(8), "isFiniteDuration rejects N/A / NaN / Infinity");
const unseekable = { duration: Number.NaN, currentTime: 1 };
ok(safeVideoCurrentTime(unseekable, 0) === false && unseekable.currentTime === 1, "safeVideoCurrentTime skips seek when duration is NaN");
const seekable = { duration: 8, currentTime: 3 };
ok(safeVideoCurrentTime(seekable, 0) === true && seekable.currentTime === 0, "safeVideoCurrentTime seeks when duration is finite");

const sor = readFileSync(SOR, "utf8");
ok(/L1.*AFT FREIGHT/i.test(sor) && /R1.*COURIER/i.test(sor) && /R3.*CAB/i.test(sor), "SoR has cargo dual-Hammerhead beat remap");
ok(/freight Enforcers \*\*L1–L2\*\*/i.test(sor) && /Security \*\*L3\*\*/.test(sor), "SoR opposition is freight Enforcers L1–L2 + Security L3");
ok(/interior-loop\.mp4/.test(sor) && /roofs-loop\.mp4/.test(sor), "SoR points at the mp4 assets");
ok(/Level background/i.test(sor) && /interior/i.test(sor), "SoR says Level background is the interior");
ok(/one tile|ONE Tile|one roof/i.test(sor), "SoR says there is one roof tile");
ok(/deletes leftover `goldLineInterior`/.test(sor) && !/flag `goldLineInterior`/.test(sor), "SoR deletes leftover interior tiles, does not ship one");
ok(!/3232/.test(sor) && !/\b475\b/.test(sor), "SoR does not bake roof 3232, 475");
ok(/returns immediately|never rewrites/i.test(sor), "SoR says existing goldLineScene is never rewritten");
ok(/GM-opt-in/i.test(sor), "SoR says force is GM-opt-in only");
ok(/hide/i.test(sor) && /inside/i.test(sor), "SoR has Director hide-roof note when crew goes inside");
ok(/valid playable layout/i.test(sor), "SoR says stills are a valid playable layout");
ok(/Michael manual/.test(sor), "SoR says walls/lights are Michael manual");
ok(!/Draw Steel|MCDM/i.test(sor), "SoR stays Ghostwire-only (no Draw Steel / MCDM)");

const journal = readBomFreeJson(JOURNAL);
ok(/^[A-Za-z0-9]{16}$/.test(journal._id), "journal _id is 16 alphanumeric");
ok(journal.folder === "gwRunsDeadhead00", "journal sits in Deadhead folder");
ok(journal.pages?.length >= 2, "journal has plate + beat pages");
const plateMd = journal.pages[0]?.text?.markdown ?? "";
const journalText = journal.pages.map(p => `${p.text?.markdown ?? ""}\n${p.text?.content ?? ""}`).join("\n");
ok(/deletes leftover `goldLineInterior`/.test(plateMd) && !/flag `goldLineInterior`/.test(plateMd), "journal deletes leftover interior tiles, does not ship one");
ok(/goldLineRoofs/.test(plateMd), "journal names the roof tile flag");
ok(/loop\.mp4/.test(plateMd), "journal prefers loop.mp4");
ok(/Level/.test(plateMd) && /interior/i.test(plateMd), "journal says Level background is the interior");
ok(!/3232/.test(plateMd) && !/\b475\b/.test(plateMd), "journal does not bake roof 3232, 475");
ok(/x=0|x = 0|0, 0|0,0/.test(plateMd), "journal starts the roof at 0, 0");
ok(/never rewrites/i.test(plateMd), "journal says existing worlds are never rewritten");
ok(/GM-opt-in/i.test(plateMd), "journal says force is GM-opt-in only");
ok(/hide/i.test(plateMd) && /inside/i.test(plateMd), "journal has Director hide-roof note");
ok(/NONE|occlusion off|occlusion stays off/i.test(plateMd), "journal says roofs have occlusion off");
ok(/AFT FREIGHT/.test(journalText) && /freight Enforcers/.test(journalText), "journal beat remap is cargo");
ok(/hide the roofs tile when playing inside/.test(journalText), "journal: Director hides roofs when inside");
ok(/Michael manual/.test(journalText), "journal: walls/lights are Michael manual");
ok(!/\bPASSENGER\b/.test(journalText) && !/5 cars/.test(journalText), "journal has no passenger-car remap");
for (const page of journal.pages ?? []) {
  ok(/^[A-Za-z0-9]{16}$/.test(page._id), `page ${page.name} _id is 16 alphanumeric`);
}

if (failures.length) {
  console.error("\nFAILED:");
  for (const msg of failures) console.error(`  ✗ ${msg}`);
  process.exit(1);
}
console.log("\nAll Gold Line smoke checks passed.");
