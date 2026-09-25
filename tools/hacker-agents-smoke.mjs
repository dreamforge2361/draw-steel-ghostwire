#!/usr/bin/env node
/**
 * B120 smoke: Hacker Agents compile / cap / dismiss (Foundry-free).
 *
 * Run: node tools/hacker-agents-smoke.mjs
 * Does not write pack JSON or rebuild packs.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  agentBand, agentCap, agentStamina, compileAgentGate, compileAllowedAtState,
  actorWiredState, COMPILE_BANDWIDTH, sheetUseCompilePlan,
} from "../scripts/agents.mjs";
import { spriteBand, spriteCap, spriteStamina } from "../scripts/sprites.mjs";
import { atLeast } from "./lib/module-version.mjs";

const failures = [];
const ok = (cond, msg) => {
  if (!cond) failures.push(msg);
  else console.log(`  ✓ ${msg}`);
};

const read = p => JSON.parse(readFileSync(p, "utf8"));
const lang = read("lang/en.json");
const hacker = actor => ({
  type: "hero",
  system: {
    class: { system: { _dsid: "hacker" } },
    level: actor.level ?? 1,
    characteristics: { reason: { value: actor.logic ?? 2 } },
  },
});

const ARCHETYPES = ["probe", "spike", "daemon", "watchdog"];
const BANDS = ["minor", "intermediate", "advanced"];
const AGENT_DIR = "src/packs/summons/agents";
const SPRITE_DIR = "src/packs/summons/sprites";

console.log("B120 Hacker Agents smoke\n");

console.log("1) Band / cap / stamina (sprite-parallel math)");
ok(agentBand(1) === "minor" && agentBand(3) === "minor", "minor L1–3");
ok(agentBand(4) === "intermediate" && agentBand(7) === "intermediate", "intermediate L4–7");
ok(agentBand(8) === "advanced" && agentBand(10) === "advanced", "advanced L8–10");
ok(agentBand(1) === spriteBand(1) && agentBand(4) === spriteBand(4) && agentBand(8) === spriteBand(8), "bands match sprites");

ok(agentCap(hacker({ level: 1 })) === 2, "cap 2 at L1");
ok(agentCap(hacker({ level: 4 })) === 2, "cap still 2 at L4");
ok(agentCap(hacker({ level: 5 })) === 3, "cap 3 at L5");
ok(agentCap(hacker({ level: 8 })) === 4, "cap 4 at L8");
const technoL1 = { type: "hero", system: { class: { system: { _dsid: "technomancer" } }, level: 1, subclasses: [] } };
ok(agentCap(hacker({ level: 1 })) === spriteCap(technoL1), "L1 cap matches non-Weaver sprite baseline");

ok(agentStamina("probe", "minor", hacker({ level: 1, logic: 2 })) === 10, "Probe minor L1 Logic 2 = 10");
ok(agentStamina("spike", "intermediate", hacker({ level: 4, logic: 3 })) === 30, "Spike int L4 Logic 3 = 30");
ok(agentStamina("watchdog", "advanced", hacker({ level: 8, logic: 4 })) === 54, "Watchdog adv L8 Logic 4 = 54");
ok(
  agentStamina("probe", "minor", hacker({ level: 1, logic: 2 })) === spriteStamina("data", "minor", hacker({ level: 1, logic: 2 })),
  "Probe stamina mirrors Data sprite",
);
ok(COMPILE_BANDWIDTH === 3, "compile costs 3 Bandwidth");

console.log("\n2) Compile gate (immersion + cap + dismiss sim)");
ok(compileAllowedAtState("overlay") && compileAllowedAtState("jackedIn"), "Overlay and Jacked In allowed");
ok(!compileAllowedAtState("linked") && !compileAllowedAtState("disconnected"), "Linked and Disconnected refuse");

ok(compileAgentGate({ hacker: false, state: "overlay", count: 0, cap: 2, hasScene: true, canCreate: true }) === "NotHacker", "non-Hacker refused");
ok(compileAgentGate({ hacker: true, state: "linked", count: 0, cap: 2, hasScene: true, canCreate: true }) === "LinkedRefuses", "Linked refuses");
ok(compileAgentGate({ hacker: true, state: "disconnected", count: 0, cap: 2, hasScene: true, canCreate: true }) === "NeedImmersion", "Disconnected needs immersion");
ok(compileAgentGate({ hacker: true, state: "overlay", count: 0, cap: 2, hasScene: false, canCreate: true }) === "NoScene", "no Scene");
ok(compileAgentGate({ hacker: true, state: "jackedIn", count: 0, cap: 2, hasScene: true, canCreate: false }) === "NoPermission", "no create permission");
ok(compileAgentGate({ hacker: true, state: "overlay", count: 2, cap: 2, hasScene: true, canCreate: true }) === "AtCap", "at cap blocks compile");
ok(compileAgentGate({ hacker: true, state: "overlay", count: 0, cap: 2, hasScene: true, canCreate: true }) === null, "Overlay + room compiles");

const usePlan = args => sheetUseCompilePlan(args);
ok(usePlan({ hacker: true, state: "overlay", count: 0, cap: 2, hasScene: true, canCreate: true }).mode === "compile", "sheet Use under cap compiles");
ok(usePlan({ hacker: true, state: "jackedIn", count: 0, cap: 2, hasScene: true, canCreate: true }).mode === "compile", "sheet Use Jacked In compiles");
ok(usePlan({ hacker: true, state: "overlay", count: 2, cap: 2, hasScene: true, canCreate: true }).mode === "command", "sheet Use at cap commands (no second Agent)");
ok(usePlan({ hacker: true, state: "overlay", count: 2, cap: 2, hasScene: false, canCreate: false }).mode === "command", "at-cap command does not need a Scene");
ok(usePlan({ hacker: true, state: "linked", count: 0, cap: 2, hasScene: true, canCreate: true }).mode === "refuse"
  && usePlan({ hacker: true, state: "linked", count: 0, cap: 2, hasScene: true, canCreate: true }).gate === "LinkedRefuses", "sheet Use Linked refuses with LinkedRefuses");
ok(usePlan({ hacker: true, state: "disconnected", count: 0, cap: 2, hasScene: true, canCreate: true }).gate === "NeedImmersion", "sheet Use disconnected needs immersion");
ok(usePlan({ hacker: true, state: "overlay", count: 0, cap: 2, hasScene: false, canCreate: true }).gate === "NoScene", "sheet Use compile needs a Scene");
ok(usePlan({ hacker: false, state: "overlay", count: 0, cap: 2, hasScene: true, canCreate: true }).gate === "NotHacker", "sheet Use non-Hacker refused");

const roster = [];
const cap = agentCap(hacker({ level: 1 }));
const tryCompile = () => {
  const gate = compileAgentGate({ hacker: true, state: "overlay", count: roster.length, cap, hasScene: true, canCreate: true });
  if (gate) return gate;
  roster.push(`agent-${roster.length}`);
  return null;
};
ok(tryCompile() === null && tryCompile() === null && roster.length === 2, "two compiles fill L1 cap");
ok(tryCompile() === "AtCap" && roster.length === 2, "third compile blocked");
roster.pop(); // dismiss one
ok(tryCompile() === null && roster.length === 2, "decompile frees a slot; compile succeeds again");
roster.length = 0; // decompile all
ok(roster.length === 0 && tryCompile() === null, "decompile all then compile");

ok(actorWiredState({ flags: { "draw-steel-ghostwire": { wired: { state: "linked" } } } }) === "linked", "flag state Linked");
ok(actorWiredState({ statuses: { has: id => id === "ghostwire-overlay" } }) === "overlay", "status Overlay");
ok(actorWiredState({ statuses: { has: id => id === "ghostwire-jacked-in" } }) === "jackedIn", "status Jacked In");

console.log("\n3) 15 Agent Actors, distinct from sprites");
const agentFiles = readdirSync(AGENT_DIR).filter(f => f.endsWith(".json") && f !== "_folder.json");
// 0.3.139 (A): 12 archetype Actors + 3 Special Agent bands. The Special rows are checked
// separately below — they are deliberately *not* in ARCHETYPES, because they are never offered
// in the Compile Agent picker.
ok(agentFiles.length === 15, `15 agent JSON files: 12 archetype + 3 Special (${agentFiles.length})`);
const spriteDsids = new Set(
  readdirSync(SPRITE_DIR).filter(f => f.endsWith(".json") && f !== "_folder.json")
    .map(f => read(join(SPRITE_DIR, f)).flags?.["draw-steel-ghostwire"]?.dsid),
);
const agentDsids = [];
for (const arch of ARCHETYPES) {
  for (const band of BANDS) {
    const dsid = `agent-${arch}-${band}`;
    const path = join(AGENT_DIR, `${dsid}.json`);
    ok(existsSync(path), `${dsid} exists`);
    if (!existsSync(path)) continue;
    const json = read(path);
    const flags = json.flags?.["draw-steel-ghostwire"] ?? {};
    ok(flags.kind === "agent", `${dsid} kind=agent`);
    ok(flags.archetype === arch && flags.hybridTier === band, `${dsid} archetype/band flags`);
    ok(flags.dsid === dsid, `${dsid} flag dsid`);
    ok(!spriteDsids.has(dsid) && !String(flags.dsid).startsWith("sprite-"), `${dsid} is not a sprite SKU`);
    ok(json.type === "npc" && json.folder === "gwSummonsAgents0", `${dsid} npc in Agents folder`);
    ok(json.prototypeToken?.sight?.enabled === true, `${dsid} Has Vision on`);
    // 0.3.133 (A): the per-tier placeholder PNG is gone. Every tier of an archetype wears the family
    // art, and the row's own `img` / token src are what has to resolve — not a filename convention.
    const art = `modules/draw-steel-ghostwire/assets/tokens/summons/agent-${arch}.webp`;
    ok(json.img === art && json.prototypeToken?.texture?.src === art, `${dsid} wears agent-${arch}.webp`);
    ok(existsSync(art.replace("modules/draw-steel-ghostwire/", "")), `${dsid} token art ships`);
    ok(json.prototypeToken?.texture?.tint === "#ffffff", `${dsid} token tint is neutral`);
    agentDsids.push(dsid);
    const key = json.name;
    ok(typeof lang.GHOSTWIRE.Summons.Agents?.[key.split(".").pop()]?.Name === "string" || key.startsWith("GHOSTWIRE.Summons.Agents."), `${dsid} lang name key`);
  }
}
ok(new Set(agentDsids).size === 12, "12 unique archetype agent dsids");
for (const band of BANDS) {
  const dsid = `agent-special-${band}`;
  const path = join(AGENT_DIR, `${dsid}.json`);
  ok(existsSync(path), `${dsid} exists`);
  if (!existsSync(path)) continue;
  const json = read(path);
  const flags = json.flags?.["draw-steel-ghostwire"] ?? {};
  ok(flags.kind === "agent" && flags.archetype === "special" && flags.hybridTier === band && flags.dsid === dsid,
    `${dsid} kind/archetype/band/dsid`);
  ok(!ARCHETYPES.includes(flags.archetype), `${dsid} is not one of the four picker archetypes`);
  ok(!spriteDsids.has(dsid), `${dsid} is not a sprite SKU`);
  ok(json.type === "npc" && json.folder === "gwSummonsAgents0", `${dsid} npc in Agents folder`);
  agentDsids.push(dsid);
}
ok(new Set(agentDsids).size === 15, "15 unique agent dsids with the Special rows");
ok(!agentDsids.some(d => spriteDsids.has(d)), "no shared sprite dsids");

const spike = read(join(AGENT_DIR, "agent-spike-minor.json"));
const strike = spike.items?.[0];
ok(strike?.type === "ability" && strike.system?._dsid === "agent-spike-minor-integrity-spike", "Spike minor embeds Integrity Spike");
const dmg = Object.values(strike?.system?.power?.effects ?? {}).find(e => e.type === "damage");
ok(dmg?.damage?.tier1?.value === "0" && dmg?.damage?.tier2?.value === "2d10 + @chr", "Spike minor damage 0 / 2d10+@chr");

console.log("\n4) Class grants + ability cards");
const compile = read("src/packs/classes/hacker/abilities/compile-agent.json");
const decompile = read("src/packs/classes/hacker/abilities/decompile-agent.json");
ok(compile.system._dsid === "compile-agent" && compile.system.resource === 3, "Compile Agent is 3 Bandwidth");
ok(compile.system.keywords.includes("wired") && compile.system.type === "main", "Compile Agent is wired main");
ok(decompile.system._dsid === "decompile-agent" && decompile.system.resource == null, "Decompile Agent is free");
ok(decompile.system.type === "maneuver" && !decompile.system.keywords.includes("wired"), "Decompile is a maneuver, no wired gate");
ok(compile.system.prerequisites.dsid.includes("hacker"), "Compile requires Hacker");

const cls = read("src/packs/classes/hacker/hacker.json");
const grant = Object.values(cls.system.advancements).find(a => a._id === "pPmGDKraCpKV4cOx");
ok(grant?.type === "itemGrant" && grant.requirements.level === 1, "L1 Agents itemGrant");
const uuids = (grant?.pool ?? []).map(p => p.uuid);
ok(uuids.includes("Compendium.draw-steel-ghostwire.classes.Item.J1YFmCnCn5dJfS6T"), "grant includes Compile Agent");
ok(uuids.includes("Compendium.draw-steel-ghostwire.classes.Item.bwJwQXSsAdo6de3U"), "grant includes Decompile Agent");

ok(lang.GHOSTWIRE.Classes.Hacker.Items.CompileAgent.Name === "Compile Agent", "Compile Agent lang");
ok(lang.GHOSTWIRE.Classes.Hacker.Items.DecompileAgent.Name === "Decompile Agent", "Decompile Agent lang");
ok(lang.GHOSTWIRE.Summons.Agents.UI.LinkedRefuses.includes("Linked"), "UI names Linked refuse");
ok(lang.GHOSTWIRE.Summons.Agents.UI.Compile === "Compile Agent", "UI Compile label");
ok(lang.GHOSTWIRE.Summons.Agents.UI.None.includes("no compiled Agents"), "UI names empty decompile");
ok(lang.GHOSTWIRE.Classes.Hacker.Items.CompileAgent.Effect_before0000000000.includes("Use this ability"), "Compile Agent flavor names sheet Use");
ok(lang.GHOSTWIRE.Classes.Hacker.Items.DecompileAgent.Effect_before0000000000.includes("Use this ability"), "Decompile Agent flavor names sheet Use");

console.log("\n4b) Compile / Decompile sheet imgs are module assets");
const MODULE_IMG = /^modules\/draw-steel-ghostwire\/assets\//;
const imgOnDisk = img => {
  if (!img || !MODULE_IMG.test(img)) return false;
  return existsSync(img.replace(/^modules\/draw-steel-ghostwire\//, ""));
};
ok(imgOnDisk(compile.img) && !compile.img.startsWith("icons/"), `Compile Agent img is a module path (${compile.img})`);
ok(imgOnDisk(decompile.img) && !decompile.img.startsWith("icons/"), `Decompile Agent img is a module path (${decompile.img})`);
ok(compile.img.includes("compile-agent.svg"), "Compile Agent img is compile-agent.svg");
ok(decompile.img.includes("decompile-agent.svg"), "Decompile Agent img is decompile-agent.svg");
const kessic = read("src/packs/pregens/kessic-draye.json");
const kCompile = (kessic.items ?? []).find(i => i.system?._dsid === "compile-agent");
const kDecompile = (kessic.items ?? []).find(i => i.system?._dsid === "decompile-agent");
ok(kCompile?.img === compile.img, "Kessic Compile Agent img matches class pack");
ok(kDecompile?.img === decompile.img, "Kessic Decompile Agent img matches class pack");
ok(grant?.img === compile.img, "Hacker L1 Agents grant uses Compile Agent icon");
ok(atLeast(read("module.json").version, "0.3.76"), `module.json is ≥ 0.3.76 (got ${read("module.json").version})`);

console.log("\n5) Script registration + RAW");
const mod = readFileSync("scripts/module.mjs", "utf8");
ok(mod.includes('from "./agents.mjs"') && mod.includes("registerAgents()"), "module.mjs registers agents");
const agentsSrc = readFileSync("scripts/agents.mjs", "utf8");
ok(!agentsSrc.includes("kind: \"sprite\""), "agents.mjs does not stamp kind sprite");
ok(agentsSrc.includes("AbilityModel.prototype.use"), "Compile Agent wraps AbilityModel#use");
ok(agentsSrc.includes("skipSpend: true"), "sheet Use compile does not double-charge Bandwidth");
ok(agentsSrc.includes("useDecompileFromSheet"), "Decompile Agent sheet Use is intercepted");
ok(!readFileSync("scripts/sprites.mjs", "utf8").includes("AbilityModel.prototype.use"), "Compile Sprite Use path unchanged");
const raw = readFileSync("docs/raw/19-hacker.md", "utf8");
ok(/Compile Agent/.test(raw) && /Linked refuses/.test(raw), "RAW 19 names Compile Agent + Linked refuses");
ok(/Probe/.test(raw) && /Spike/.test(raw) && /Daemon/.test(raw) && /Watchdog/.test(raw), "RAW names four archetypes");
ok(/3 Bandwidth/.test(raw), "RAW locks 3 Bandwidth");
ok(existsSync("docs/spikes/B120-HACKER-AGENTS.md"), "B120 spike exists");

if (failures.length) {
  console.error(`\n${failures.length} failure(s):`);
  for (const msg of failures) console.error(`  ✗ ${msg}`);
  process.exit(1);
}
console.log("\nB120 Hacker Agents smoke: ok");
