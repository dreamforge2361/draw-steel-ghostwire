#!/usr/bin/env node
/**
 * B116 Wire Atlas smoke (module 0.3.50).
 * Catalog stubs + RAW/journal topology. Does not generate art or touch Gold Line.
 *
 * Run: node tools/b116-wire-atlas-smoke.mjs
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { ATLAS_TOKEN_LIBRARY, atlasTokenSrc } from "../scripts/wired-atlas-catalog.mjs";

const failures = [];
const ok = (cond, msg) => {
  if (!cond) failures.push(msg);
  else console.log(`  ✓ ${msg}`);
};

function readBomFreeJson(path) {
  const buf = readFileSync(path);
  ok(buf[0] !== 0xEF && buf[1] !== 0xBB && buf[2] !== 0xBF, `${path} is BOM-free`);
  return JSON.parse(buf.toString("utf8"));
}

console.log("B116 Wire Atlas smoke (0.3.50)");

const moduleJson = readBomFreeJson("module.json");
ok(moduleJson.version === "0.3.50", `module.json is 0.3.50 (got ${moduleJson.version})`);

const spike = readFileSync("docs/spikes/B116-WIRE-ATLAS.md", "utf8");
ok(/Relay/.test(spike) && /Host/.test(spike) && /Segment/.test(spike), "spike names Relay / Host / Segment");
ok(/Switchboard/.test(spike) && /Power Co/.test(spike) && /North Substation/.test(spike), "spike has Director example");
ok(/0\.3\.50/.test(spike), "spike names 0.3.50");
ok(/do not generate|Do \*\*not\*\* generate/i.test(spike), "spike forbids generated art");
ok(/node-endpoint/.test(spike) && /optional v1\.1/i.test(spike), "Endpoint is optional v1.1, not a v1 style");

const raw = readFileSync("docs/raw/21-the-wire.md", "utf8");
ok(/^## Wire Atlas \/ topology$/m.test(raw), "RAW has Wire Atlas / topology H2");
ok(/node-hops on the graph of the Scene you are on/.test(raw), "RAW defines Reach as current-scene hops");
ok(/Power Co — North Substation/.test(raw), "RAW names parented Segment");
ok(/Room-only/.test(raw) || /room-scale only/.test(raw) || /\*\*Room-only\.\*\*/.test(raw), "RAW keeps devices room-only");

const journal = readBomFreeJson("src/packs/rulebook/ghostwire-systems/21-the-wire.json");
const atlasPage = journal.pages?.find(p => p.name === "Wire Atlas / topology");
ok(!!atlasPage, "rulebook journal has Wire Atlas / topology page");
ok(typeof atlasPage?.text?.markdown === "string" && atlasPage.text.markdown.includes("Relay"), "atlas journal page has Relay prose");
ok(typeof atlasPage?.text?.content === "string" && atlasPage.text.content.includes("<table"), "atlas journal page has HTML tables");
ok(!/!\[[^\]]*]\([^)]+\)|<img\b/.test(`${atlasPage?.text?.markdown ?? ""}\n${atlasPage?.text?.content ?? ""}`), "atlas journal page has no art plates");

const lib = readBomFreeJson("assets/tokens/wired/library.json");
ok(lib.base === "modules/draw-steel-ghostwire/assets/tokens/wired", "library.json base path");
const atlas = (lib.styles ?? []).filter(s => s.family === "atlas");
const ids = atlas.map(s => s.id);
ok(ids.includes("node-relay") && ids.includes("node-host") && ids.includes("node-segment"), "catalog has three atlas ids");
ok(!ids.includes("node-endpoint") && !(lib.styles ?? []).some(s => s.id === "node-endpoint"), "v1 catalog does not ship Endpoint");
ok(atlas.length === 3 && atlas.every(s => s.placeholder === true), "atlas rows are placeholders");
ok(atlas.every(s => s.family === "atlas"), "atlas rows marked family=atlas");

const catalogIds = ATLAS_TOKEN_LIBRARY.map(s => s.id);
ok(catalogIds.join(",") === ids.join(","), "scripts/wired-atlas-catalog.mjs matches library.json atlas ids");
ok(atlasTokenSrc("node-relay") === null, "placeholder art resolver returns null");

ok(existsSync("assets/tokens/wired/README.md"), "wired token README exists");
ok(existsSync("assets/tokens/wired/.gitkeep"), "wired token .gitkeep exists");

const wiredFiles = readdirSync("assets/tokens/wired");
const atlasArt = wiredFiles.filter(f => /^(node-relay|node-host|node-segment)\.(png|webp|jpg|jpeg|gif)$/i.test(f));
ok(atlasArt.length === 0, `no generated atlas art files (found ${atlasArt.join(", ") || "none"})`);

const readme = readFileSync("README.md", "utf8");
ok(/0\.3\.50/.test(readme) && /Wire Atlas/.test(readme), "root README changelog mentions 0.3.50 Wire Atlas");
ok(/#34/.test(readme) && /0\.3\.49/.test(readme) && /0\.3\.48/.test(readme), "README notes Mama 0.3.48 and Wired #34 as 0.3.49");
ok(/0\.3\.49/.test(readme) && /eight-style node token library/.test(readme), "README keeps 0.3.49 device library changelog");

if (failures.length) {
  console.error(`\n${failures.length} failure(s):`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log("\nB116 Wire Atlas smoke OK");
