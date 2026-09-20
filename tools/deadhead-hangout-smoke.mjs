#!/usr/bin/env node
/**
 * B107 smoke: Deadhead Beat 0 hangout plate + Scene template stay locked.
 *
 * LOCK: still background only. No Levels, no Tiles, no video, no loop.
 * Existing `deadheadHangoutScene` worlds are never rewritten on ready.
 *
 * Run: node tools/deadhead-hangout-smoke.mjs
 * Does not write pack JSON, rebuild packs, or touch Gold Line inject.
 */
import { existsSync, readFileSync } from "node:fs";
import { DEADHEAD_HANGOUT_PLATE } from "../scripts/deadhead-hangout-scene.mjs";

const failures = [];
const ok = (cond, msg) => {
  if (!cond) failures.push(msg);
  else console.log(`  ✓ ${msg}`);
};

const PLATE_REL = "assets/maps/battlemaps/map-deadhead-hangout.webp";
const TEMPLATE = "data/scenes/deadhead-hangout.json";
const SCRIPT = "scripts/deadhead-hangout-scene.mjs";
const MODULE = "module.json";
const LANG = "lang/en.json";
const ENTRY = "scripts/module.mjs";
const JOURNAL = "src/packs/runs/deadhead/deadhead-director.json";
const SPIKE = "docs/spikes/B107-DEADHEAD-HANGOUT.md";
const GOLD_LINE = "scripts/gold-line-scene.mjs";
const PLATE = { width: 1920, height: 1080 };

function readBomFreeJson(path) {
  const buf = readFileSync(path);
  ok(buf[0] !== 0xEF && buf[1] !== 0xBB && buf[2] !== 0xBF, `${path} is BOM-free`);
  return JSON.parse(buf.toString("utf8"));
}

function webpSize(path) {
  const data = readFileSync(path);
  const chunk = data.subarray(12, 16).toString();
  if (chunk === "VP8X") return { w: 1 + data.readUIntLE(24, 3), h: 1 + data.readUIntLE(27, 3) };
  if (chunk === "VP8 ") return { w: data.readUInt16LE(26) & 0x3fff, h: data.readUInt16LE(28) & 0x3fff };
  throw new Error(`${path}: not a VP8/VP8X WebP`);
}

console.log("Deadhead hangout smoke");

ok(existsSync(SCRIPT), "inject script exists");
ok(existsSync(SPIKE), "spike doc exists");

const moduleJson = readBomFreeJson(MODULE);
ok(moduleJson.version === "0.3.43", `module.json is 0.3.43 (got ${moduleJson.version})`);

ok(existsSync(PLATE_REL), `hangout plate shipped at ${PLATE_REL}`);
const size = webpSize(PLATE_REL);
ok(size.w === PLATE.width && size.h === PLATE.height, `plate is 1920×1080 (got ${size.w}×${size.h})`);

const template = readBomFreeJson(TEMPLATE);
ok(template.width === PLATE.width && template.height === PLATE.height, "template canvas is 1920×1080");
ok(template.grid.size === 80, `template grid size is 80 (got ${template.grid.size})`);
ok(template.grid.distance === 5 && template.grid.units === "ft", "template grid is 5 ft");
ok(template.grid.type === 1, "template grid is square");
ok(template.assets.still === `modules/draw-steel-ghostwire/${PLATE_REL}`, "template still points at the shipped webp");
ok(template.thumb === template.assets.still, "template thumb is the still");
ok(!template.level && !template.roofTile && !template.interiorTile, "template ships no Levels or Tiles");
ok(!/loop|\.mp4|\.webm/i.test(JSON.stringify(template)), "template has no loop / video assets");

const squaresX = template.width / template.grid.size;
const squaresY = template.height / template.grid.size;
ok(squaresX === 24, `scene is 24 squares wide (got ${squaresX})`);
ok(squaresY === 13.5, `scene is 13.5 squares tall (got ${squaresY})`);

ok(DEADHEAD_HANGOUT_PLATE.width === PLATE.width && DEADHEAD_HANGOUT_PLATE.height === PLATE.height,
  "DEADHEAD_HANGOUT_PLATE is 1920×1080");

const script = readFileSync(SCRIPT, "utf8");
ok(/deadheadHangoutScene/.test(script), "inject uses the deadheadHangoutScene flag");
ok(/FOLDER_FLAG = "deadheadScenes"/.test(script), "inject reuses the Gold Line Deadhead folder flag");
ok(/if \(existing && !force\) return existing;/.test(script), "inject returns immediately when the flag is already set");
ok(/Ready never passes force/.test(script), "inject comments that ready never passes force");
ok(/if \(existingHangoutScene\(\)\) return;/.test(script), "ready bails before calling ensure when a scene exists");
ok(!/force: true/.test(script.split("export function registerDeadheadHangoutScene")[1] ?? ""),
  "register/ready path never passes force");
ok(!/createEmbeddedDocuments/.test(script), "inject creates no embedded Tiles or Levels");
ok(!/VideoHelper|currentTime|\.mp4|\.webm/.test(script), "inject has no video handling");

const goldLine = readFileSync(GOLD_LINE, "utf8");
ok(/if \(existing && !force\) return existing;/.test(goldLine), "Gold Line live-scene lock is untouched");
ok(/GM-opt-in only/.test(goldLine), "Gold Line force is still GM-opt-in only");
ok(!/deadheadHangout/i.test(goldLine), "Gold Line inject was not edited for the hangout");

const entry = readFileSync(ENTRY, "utf8");
ok(/import \{ registerDeadheadHangoutScene \} from "\.\/deadhead-hangout-scene\.mjs";/.test(entry), "module.mjs imports the register");
ok(/registerDeadheadHangoutScene\(\);/.test(entry), "module.mjs calls registerDeadheadHangoutScene()");

const lang = readBomFreeJson(LANG);
const keys = lang.GHOSTWIRE?.Scenes?.DeadheadHangout;
ok(!!keys, "lang has GHOSTWIRE.Scenes.DeadheadHangout");
for (const key of ["Name", "Folder", "Injected", "Refreshed"]) {
  ok(typeof keys?.[key] === "string" && keys[key].length > 0, `lang key ${key}`);
}
ok(keys?.Folder === lang.GHOSTWIRE?.Scenes?.GoldLine?.Folder, "hangout and Gold Line share the Deadhead folder name");

const journal = readBomFreeJson(JOURNAL);
const text = journal.pages.map(p => `${p.text?.markdown ?? ""}\n${p.text?.content ?? ""}`).join("\n");
ok(/Shady Workshop/.test(text), "Director journal names the Shady Workshop plate");
ok(/map-deadhead-hangout\.webp/.test(text), "Director journal gives the plate path");
ok(/SKIPPED/.test(text), "Director journal marks the canyon SKIPPED");
ok(/narrate/i.test(text) && /canyon/i.test(text), "Director journal says narrate the canyon");
ok(/never rewritten/.test(text), "Director journal repeats the never-rewrite contract");

const spike = readFileSync(SPIKE, "utf8");
ok(/0\.3\.43/.test(spike), "spike names 0.3.43");
ok(/deadheadHangoutScene/.test(spike), "spike names the scene flag");
ok(/SKIPPED/.test(spike), "spike records the canyon as SKIPPED");
ok(!/generated|AI art/i.test(spike) || /No AI art/i.test(spike), "spike records no AI art generation");

if (failures.length) {
  console.error("\nFAILED:");
  for (const msg of failures) console.error(`  ✗ ${msg}`);
  process.exit(1);
}
console.log("\nAll Deadhead hangout smoke checks passed.");
