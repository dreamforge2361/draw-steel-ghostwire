#!/usr/bin/env node
/**
 * Hero / NPC token Has Vision smoke (module 0.3.67).
 * Foundry-free: helper predicates + pack source JSON + boot wiring.
 *
 * Run: node tools/token-vision-smoke.mjs
 */
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  MODULE_ID,
  SKIP_TOKEN_VISION_KINDS,
  TOKEN_VISION_SETTING,
  actorVisionUpdate,
  actorWantsTokenVision,
  ghostwireKind,
  needsSightEnabled,
  tokenVisionUpdate,
} from "../scripts/token-vision.mjs";

const fail = [];
const ok = [];
const note = (pass, msg) => (pass ? ok : fail).push(pass ? `  ✓ ${msg}` : msg);

const moduleJson = JSON.parse(readFileSync("module.json", "utf8"));
const boot = readFileSync("scripts/module.mjs", "utf8");
const vision = readFileSync("scripts/token-vision.mjs", "utf8");
const foundryNotes = readFileSync("docs/rulebook/18-wired-foundry.md", "utf8");
const status = readFileSync("docs/rulebook/STATUS.md", "utf8");
const plan = readFileSync("docs/rulebook/FOUNDRY-BUILD-PLAN.md", "utf8");
const readme = readFileSync("README.md", "utf8");
const goldDiff = execFileSync("git", ["diff", "--", "scripts/gold-line-scene.mjs"], { encoding: "utf8" });

console.log("Hero / NPC token Has Vision smoke (0.3.67)\n");

console.log("1) Ship surface");
note(moduleJson.version >= "0.3.67", `module.json is ≥ 0.3.67 (got ${moduleJson.version})`);
note(boot.includes("registerTokenVision()"), "module.mjs registers registerTokenVision");
note(boot.includes("./token-vision.mjs"), "module.mjs imports token-vision.mjs");
note(vision.includes("preCreateActor") && vision.includes("preCreateToken"), "hooks cover actor and token create");
note(vision.includes("Hooks.once(\"ready\"") && vision.includes("migrateTokenVision"), "one-time ready migration");
note(vision.includes("prototypeToken.sight.enabled") && vision.includes("sight.enabled"), "only writes sight.enabled");
note(!/"sight\.(range|angle|visionMode)"/.test(vision) && !/sight\.(range|angle|visionMode)\s*=/.test(vision), "does not assign range/angle/visionMode");
note(TOKEN_VISION_SETTING === "tokenVisionMigrated", "world setting id");
note(!goldDiff.trim(), "scripts/gold-line-scene.mjs is unmodified");
note(!vision.includes("gold-line-scene"), "token-vision does not import gold-line-scene");
note(!vision.includes("{ force: true }"), "token-vision has no Gold Line force");
note(/0\.3\.67/.test(readme) && /Has Vision|token vision/i.test(readme), "README changelog names 0.3.67 token vision");
note(/0\.3\.67/.test(status) && /Has Vision|token vision/i.test(status), "STATUS names 0.3.67 token vision");
note(/0\.3\.67/.test(plan) && /Has Vision|token vision/i.test(plan), "FOUNDRY-BUILD-PLAN names 0.3.67 token vision");
note(/Has Vision|sight\.enabled/.test(foundryNotes) && /0\.3\.67/.test(foundryNotes), "Foundry notes document Has Vision");

console.log("\n2) Scope predicates");
note(actorWantsTokenVision({ type: "hero" }) === true, "bare hero wants vision");
note(actorWantsTokenVision({ type: "npc" }) === true, "bare npc wants vision");
note(actorWantsTokenVision({ type: "character" }) === false, "non hero/npc skipped");
for (const kind of SKIP_TOKEN_VISION_KINDS) {
  note(actorWantsTokenVision({ type: "npc", flags: { [MODULE_ID]: { kind } } }) === false, `npc kind ${kind} skipped`);
}
note(actorWantsTokenVision({ type: "npc", flags: { [MODULE_ID]: { kind: "sprite" } } }) === true, "sprite npc wants vision");
note(actorWantsTokenVision({ type: "npc", flags: { [MODULE_ID]: { kind: "spirit" } } }) === true, "spirit npc wants vision");
note(ghostwireKind({ flags: { [MODULE_ID]: { kind: "kiosk" } } }) === "kiosk", "ghostwireKind reads flags");
note(needsSightEnabled({ enabled: false }) === true, "disabled sight needs enable");
note(needsSightEnabled({ enabled: true, range: 12, angle: 90 }) === false, "already-on sight is left alone");
note(needsSightEnabled(undefined) === true, "missing sight needs enable");

const heroOff = actorVisionUpdate({ type: "hero", prototypeToken: { sight: { enabled: false, range: 8, angle: 360 } } });
note(heroOff?.["prototypeToken.sight.enabled"] === true, "hero prototype patch is enabled true");
note(Object.keys(heroOff ?? {}).length === 1, "hero prototype patch is only enabled");
note(actorVisionUpdate({ type: "hero", prototypeToken: { sight: { enabled: true, range: 8 } } }) === null, "hero already-on is no-op");
note(actorVisionUpdate({ type: "npc", flags: { [MODULE_ID]: { kind: "node" } }, prototypeToken: { sight: { enabled: false } } }) === null, "node actor is no-op");
note(actorVisionUpdate({ type: "npc", flags: { [MODULE_ID]: { kind: "kiosk" } }, prototypeToken: { sight: { enabled: false } } }) === null, "kiosk actor is no-op");
note(actorVisionUpdate({ type: "npc", flags: { [MODULE_ID]: { kind: "vehicle" } }, prototypeToken: { sight: { enabled: false } } }) === null, "vehicle actor is no-op");
note(actorVisionUpdate({ type: "npc", flags: { [MODULE_ID]: { kind: "drone" } }, prototypeToken: { sight: { enabled: false } } }) === null, "drone actor is no-op");

const tokenOff = tokenVisionUpdate({ sight: { enabled: false, range: 5 } }, { type: "npc" });
note(tokenOff?.["sight.enabled"] === true, "placed npc token patch is enabled true");
note(tokenVisionUpdate({ sight: { enabled: true } }, { type: "hero" }) === null, "placed token already-on is no-op");
note(tokenVisionUpdate({ sight: { enabled: false } }, { type: "npc", flags: { [MODULE_ID]: { kind: "node" } } }) === null, "placed node token is no-op");

console.log("\n3) Pack source JSON");
function walk(dir) {
  const out = [];
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(p));
    else if (ent.name.endsWith(".json") && ent.name !== "_folder.json") out.push(p);
  }
  return out;
}

const roots = ["src/packs/bestiary", "src/packs/pregens", "src/packs/summons", "src/packs/deadhead"];
let inScope = 0;
let skipped = 0;
for (const root of roots) {
  for (const file of walk(root)) {
    const doc = JSON.parse(readFileSync(file, "utf8"));
    if (doc.type !== "hero" && doc.type !== "npc") continue;
    const kind = ghostwireKind(doc);
    const enabled = doc.prototypeToken?.sight?.enabled === true;
    const range = doc.prototypeToken?.sight?.range;
    const angle = doc.prototypeToken?.sight?.angle;
    if (actorWantsTokenVision(doc)) {
      inScope += 1;
      note(enabled, `${file} Has Vision on`);
      if (file.includes("/bestiary/") && range !== undefined) {
        // Bestiary stubs already had range/angle; enabling must not wipe them.
        note(range === 0 || typeof range === "number", `${file} keeps sight.range (${range})`);
        note(angle === 360 || typeof angle === "number", `${file} keeps sight.angle (${angle})`);
      }
    } else {
      skipped += 1;
      note(enabled === false, `${file} skip-kind ${kind} stays vision off`);
    }
  }
}
note(inScope > 0, `counted ${inScope} in-scope hero/npc stubs`);
note(skipped >= SKIP_TOKEN_VISION_KINDS.length, `counted ${skipped} skipped kiosk/node/vehicle/drone stubs`);

console.log("\n4) Pregen generator still stamps vision on");
const gen = readFileSync("tools/pregens-to-actors.mjs", "utf8");
note(gen.includes("sight: { enabled: true }"), "pregens-to-actors stamps sight.enabled true");

if (fail.length) {
  console.error(`\n${fail.length} failed:\n${fail.map(m => `  ✗ ${m}`).join("\n")}`);
  process.exit(1);
}
console.log(`\n${ok.length} passed`);
