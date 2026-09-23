#!/usr/bin/env node
/**
 * Ping vs Read/Write doctrine smoke — module 0.3.62 (docs / lang / VOIDMARK).
 *
 * Run: node tools/ping-doctrine-smoke.mjs
 * Does not need live Foundry. Does not write Scene JSON.
 */
import { readFileSync } from "node:fs";
import { atLeast } from "./lib/module-version.mjs";

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

console.log("Ping vs Read/Write doctrine smoke (0.3.62)\n");

const moduleJson = readBomFreeJson("module.json");
ok(atLeast(moduleJson.version, "0.3.62"), `module.json is ≥ 0.3.62 (got ${moduleJson.version})`);

const lang = readBomFreeJson("lang/en.json");
const ping = lang.GHOSTWIRE.Abilities.MatrixVerbs.Ping;
const rw = lang.GHOSTWIRE.Abilities.MatrixVerbs.ReadWrite;

ok(/nudge, not a deep hack/i.test(ping.Story), "Ping.Story is a nudge, not a deep hack");
ok(/Track 1 only/i.test(ping.Story), "Ping.Story is Track 1 only");
ok(/does <strong>not<\/strong> unlock it for entry/i.test(ping.Effect), "Ping.Effect: maglock tap is not unlock for entry");
ok(/lasting cam-off/i.test(ping.Effect), "Ping.Effect: cam test is not lasting cam-off");
ok(/Read\/Write/.test(ping.Effect), "Ping.Effect points those jobs at Read/Write");
ok(/Ping vs ICE/i.test(ping.Effect), "Ping.Effect has Ping vs ICE");
ok(/does not bypass or defeat ICE/i.test(ping.Effect), "Ping.Effect: Ping does not bypass or defeat ICE");
ok(/Track 2/.test(ping.Effect), "Ping.Effect: ICE is Track 2");
ok(/never opens or controls the guarded system/i.test(ping.Effect), "Ping.Effect: Ping never opens the guarded system");
ok(/B106/.test(ping.Effect), "Ping.Effect is not Console Wire ping/spoof (B106)");
ok(/touch\/test nudge/i.test(ping.Effect), "Ping.Effect states Ping = touch/test nudge");
ok(/Overlaid/.test(ping.Effect) && /Jacked In/.test(ping.Effect), "Ping.Effect requires Overlay or Jacked In");

ok(/Unlock the maglock/i.test(rw.Story) && /Kill the cam/i.test(rw.Story), "Read/Write.Story names unlock maglock and kill cam");
ok(/unlock a maglock for entry/i.test(rw.Effect), "Read/Write.Effect names maglock unlock for entry");
ok(/toggle a camera off \/ kill a feed/i.test(rw.Effect), "Read/Write.Effect names lasting cam-off");
ok(/not a Ping nudge/i.test(rw.Effect), "Read/Write.Effect contrasts Ping");

const wire = readFileSync("docs/raw/21-the-wire.md", "utf8");
ok(/### Ping vs Read\/Write/.test(wire), "RAW 21 has Ping vs Read/Write");
ok(/### Ping vs ICE/.test(wire), "RAW 21 has Ping vs ICE heading");
ok(/\*\*not\*\* unlock for entry/.test(wire), "RAW 21: Ping does not unlock maglock");
ok(/\*\*not\*\* lasting cam-off/.test(wire), "RAW 21: Ping is not lasting cam-off");
ok(/Ping vs ICE/.test(wire), "RAW 21 has Ping vs ICE");
ok(/does not bypass or defeat ICE/.test(wire), "RAW 21: Ping does not bypass ICE");
ok(/never opens or controls the guarded system/.test(wire), "RAW 21: Ping never opens the guarded system");
ok(/unlock a maglock for entry/.test(wire) && /kill a feed/.test(wire), "RAW 21 Read/Write names unlock and cam-off");
ok(/B106/.test(wire), "RAW 21 names B106 Console Wire ping/spoof");

const hacker = readFileSync("docs/rulebook/08-hacker.md", "utf8");
ok(/Ping vs Read\/Write/.test(hacker), "08-hacker syncs Ping vs Read/Write");
ok(/not\*\* unlock for entry/.test(hacker) || /not unlock for entry/.test(hacker), "08-hacker: Ping does not unlock");
ok(/lasting cam-off/.test(hacker), "08-hacker: Ping is not lasting cam-off");
ok(/Ping vs ICE/.test(hacker), "08-hacker syncs Ping vs ICE");
ok(/does not bypass or defeat ICE/.test(hacker), "08-hacker: Ping does not bypass ICE");

const foundry = readFileSync("docs/rulebook/18-wired-foundry.md", "utf8");
ok(/Ping vs Read\/Write/.test(foundry), "Foundry notes include Ping vs Read/Write one-liner");
ok(/Ping vs ICE/.test(foundry), "Foundry notes include Ping vs ICE");
ok(/B106/.test(foundry), "Foundry notes: Ping is not Console Wire ping/spoof");

const readme = readFileSync("README.md", "utf8");
ok(/0\.3\.62/.test(readme) && /Ping vs Read\/Write/.test(readme), "README changelog names 0.3.62 Ping vs Read/Write");

if (failures.length) {
  console.error(`\n${failures.length} failure(s):`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log("\nAll Ping vs Read/Write doctrine checks passed.");
