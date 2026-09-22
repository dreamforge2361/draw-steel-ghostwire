#!/usr/bin/env node
/**
 * 0.3.87 — Deadhead Foundry push smoke (FOUNDRY-NEXT-PUSH-DEADHEAD.md §E, the
 * parts a file check can prove; the rest is Michael's in-Foundry pass).
 *
 *   - Session Chapters Journal: one page per Scene, READ ALOUD visible,
 *     Director material only inside secret blocks, car-by-car page GM-only
 *   - Director SoR journal: 5 security + 1 worker drone, wafer second-to-last,
 *     Nightjar Market exchange (no Handoff Beat, no club return)
 *   - Deadhead Actors: Iona / Rhen / Nim + Rack & Rest five, tokens on disk,
 *     Wire Kit, 16-char ids, folders; Nox portrait on the freighter
 *   - Nightjar Market Scene inject: create-once, no force, Deadhead folder,
 *     plate on disk; no phantom Transit / Freighter Scene
 *
 * Run: node tools/deadhead-session-smoke.mjs
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { actorHasConnectInterface } from "../scripts/wired-console-verbs.mjs";

const MODULE = "draw-steel-ghostwire";
const failures = [];
const ok = (cond, msg) => {
  if (!cond) failures.push(msg);
  else console.log(`  ✓ ${msg}`);
};
const read = p => JSON.parse(readFileSync(p, "utf8"));
const asset = src => src.replace(`modules/${MODULE}/`, "");
const ID16 = /^[A-Za-z0-9]{16}$/;

console.log("Deadhead Foundry push smoke (0.3.87)\n");

const moduleJson = read("module.json");
const [maj, min, pat] = String(moduleJson.version).split(".").map(Number);
ok(maj === 0 && min === 3 && pat >= 87, `module.json is 0.3.87+ (got ${moduleJson.version})`);
const lang = read("lang/en.json").GHOSTWIRE;

// ------------------------------------------------------------ Session Chapters

const chapters = read("src/packs/runs/deadhead/deadhead-session-chapters.json");
ok(chapters._id === "gwDhSessionChap0" && chapters.folder === "gwRunsDeadhead00", "Session Chapters journal sits in Ghostwire Runs → Deadhead");
ok(chapters.ownership?.default === 0, "Session Chapters journal is GM-only by default");
ok(lang.Runs.Journals.DeadheadSessionChapters === "Deadhead — Session Chapters", "lang Session Chapters journal name");
const SCENES = [
  ["SessionOpening", null],
  ["SessionMamasClub", "Mama"],
  ["SessionFlatsTransit", "Flats Transit"],
  ["SessionRackRest", "Rack & Rest"],
  ["SessionFreighterMeet", "Freighter Meet"],
  ["SessionGoldLine", "Gold Line"],
  ["SessionNightjar", "Nightjar Market"],
];
const byKey = new Map(chapters.pages.map(p => [p.name.replace("GHOSTWIRE.Runs.Pages.", ""), p]));
ok(chapters.pages.length === SCENES.length + 1, `Session Chapters has ${SCENES.length} Scene pages + car-by-car (got ${chapters.pages.length})`);
for (const p of chapters.pages) {
  ok(ID16.test(p._id) && p._key === `!journal.pages!${chapters._id}.${p._id}`, `page ${p.name} id + key`);
  ok(typeof lang.Runs.Pages[p.name.replace("GHOSTWIRE.Runs.Pages.", "")] === "string", `lang page ${p.name}`);
}

const SECRET = /<section class="secret" id="secret-[A-Za-z0-9]+">[\s\S]*?<\/section>/g;
const secretIds = [];
for (const [key] of SCENES) {
  const p = byKey.get(key);
  ok(p?.text?.format === 1, `${key} is an HTML page (secret blocks survive the editor)`);
  const html = p?.text?.content ?? "";
  secretIds.push(...[...html.matchAll(/id="(secret-[A-Za-z0-9]+)"/g)].map(m => m[1]));
  const visible = html.replace(SECRET, "");
  ok(html.includes('class="secret"'), `${key} wraps Director material in secret blocks`);
  if (key !== "SessionOpening") ok(/READ ALOUD — Meatspace/.test(visible) && /READ ALOUD — Wired/.test(visible), `${key} READ ALOUD boxes are player-visible`);
  ok(!/Director Notes|Director:|If pressed|Victory checklist|Foundry:/.test(visible), `${key} shows no Director Notes / If pressed / Foundry lines outside secrets`);
  ok(!/ARG Response Lieutenant|Enforcers|worker drone \(|Watchdog ICE \(|★/.test(visible), `${key} shows no opposition seats or ★ outside secrets`);
  ok(!/@UUID|gw-art-refs|\.md\)/.test(visible), `${key} shows no links / staging paths outside secrets`);
}
ok(new Set(secretIds).size === secretIds.length, "secret block ids are unique");

const mamas = byKey.get("SessionMamasClub")?.text?.content ?? "";
ok(/Compendium\.draw-steel-ghostwire\.gear\.Item\.gwMamaBriefWafer/.test(mamas), "Mama’s Club page UUID-links the Job Stick");
const nightjar = byKey.get("SessionNightjar")?.text?.content ?? "";
// Buyers are named in the Scene prose; their Actor links live on the Director journal (Beat 5 / Items).
ok(/Iona Vale/.test(nightjar) && /Rhen Calder/.test(nightjar) && /Nim/.test(nightjar), "Nightjar page carries all three buyer faces");
ok(!/Look \/ token art brief/.test(nightjar), "Nightjar page strips the production art brief (clean copy)");

const goldLine = byKey.get("SessionGoldLine")?.text?.content ?? "";
ok(/5 security \+ 1 worker drone/.test(goldLine) && /second-to-last/.test(goldLine), "Gold Line page carries the 5+1 / second-to-last lock");
ok(!/Beat — Handoff|Handoff Beat/.test(goldLine) && /Nightjar Market/.test(goldLine), "Gold Line has no Handoff Beat; Escape cuts to Nightjar Market");

const car = byKey.get("SessionCarByCar");
ok(car?.ownership?.default === 0 && car?.flags?.[MODULE]?.directorOnly === true, "car-by-car page is hard GM-only");
ok(/Integrity\/Stamina \*\*24\*\*/.test(car?.text?.markdown ?? "") && /Integrity \*\*26\*\*/.test(car?.text?.markdown ?? ""), "car-by-car carries drone 24 / Watchdog 26");

// ------------------------------------------------------------ Director SoR journal

const director = read("src/packs/runs/deadhead/deadhead-director.json");
const dirText = director.pages.map(p => `${p.text.markdown}\n${p.text.content}`).join("\n");
ok(/5 security \+ 1 worker drone/.test(dirText), "SoR journal locks 5 security + 1 worker drone");
ok(/\*\*2\*\* \+ cams/.test(dirText) && /Security Officer ×2/.test(dirText) && /Lieutenant ×1/.test(dirText), "SoR opposition count: 2 Enforcers + 2 Officers + 1 Lt");
ok(!/4\*{0,2} ARG Security Officers|Lt nest/.test(dirText), "SoR journal has no 4-Officer / Lt nest");
ok(!/\bR1\*{0,2} courier|courier \*\*R1\*\*|\*\*R1\*\* is the courier/i.test(dirText), "SoR journal has no R1 courier label");
ok(/second-to-last/.test(dirText), "SoR journal seats the wafer second-to-last");
ok(!/Handoff/i.test(dirText) && !/Mama’s Club \(return\)/.test(dirText), "SoR journal has no Handoff Beat / club return");
ok(lang.Runs.Pages.Beat5 === "Beat 5 — Nightjar Market", "Beat 5 is Nightjar Market");
ok(/Nightjar Market/.test(dirText) && /Create-once inject/.test(dirText), "Foundry checklist lists the Nightjar Market Scene");
ok(/Flats Transit\* \| Narrate/.test(dirText) && /Freighter Meet \(Call Nox\)\* \| Narrate/.test(dirText), "Transit / Freighter Meet stay narrate — no phantom Scenes");

// ------------------------------------------------------------ Deadhead Actors

const CAST = [
  ["nightjar-market/iona-vale.json", "gwDhIonaVale0000", "iona-vale-token", 30],
  ["nightjar-market/rhen-calder.json", "gwDhRhenCalder00", "rhen-calder-token", 30],
  ["nightjar-market/nim.json", "gwDhNim000000000", "nim-token", 30],
  ["rack-rest/vesper-drift.json", "gwDhVesperDrift0", "rack-rest-vesper-drift-token", null],
  ["rack-rest/tam-kade.json", "gwDhTamKade00000", "rack-rest-tam-kade-token", null],
  ["rack-rest/sera-nix.json", "gwDhSeraNix00000", "rack-rest-sera-nix-token", null],
  ["rack-rest/cousin-vell.json", "gwDhCousinVell00", "rack-rest-cousin-vell-token", null],
  ["rack-rest/juno-halve.json", "gwDhJunoHalve000", "rack-rest-juno-halve-token", null],
];
const folders = {
  "nightjar-market": read("src/packs/deadhead/nightjar-market/_folder.json"),
  "rack-rest": read("src/packs/deadhead/rack-rest/_folder.json"),
};
ok(folders["nightjar-market"].type === "Actor" && folders["rack-rest"].type === "Actor", "Deadhead Actor folders are Actor folders");
for (const f of Object.values(folders)) ok(typeof localize(f.name) === "string", `lang folder ${f.name}`);
function localize(key) {
  return key.replace(/^GHOSTWIRE\./, "").split(".").reduce((o, k) => o?.[k], lang);
}
for (const [file, id, tokenSlug, stamina] of CAST) {
  const actor = read(join("src/packs/deadhead", file));
  const dir = file.split("/")[0];
  ok(actor._id === id && ID16.test(id) && actor._key === `!actors!${id}`, `${actor.name} id ${id}`);
  ok(actor.type === "npc" && actor.system.monster.level === 1, `${actor.name} is an L1 NPC`);
  ok(actor.folder === folders[dir]._id, `${actor.name} sits in ${dir}`);
  ok(actor.img === `modules/${MODULE}/assets/tokens/deadhead/${tokenSlug}.webp` && actor.prototypeToken.texture.src === actor.img, `${actor.name} img + token use the deadhead webp`);
  ok(existsSync(asset(actor.img)) && existsSync(asset(actor.img).replace(/\.webp$/, ".png")), `${actor.name} token webp + png on disk`);
  ok(actor.prototypeToken.sight.enabled === true && actor.prototypeToken.disposition === 0, `${actor.name} token has vision, neutral`);
  ok(actorHasConnectInterface(actor), `${actor.name} can Connect (Wire Kit)`);
  ok(actor.items.every(i => ID16.test(i._id) && i._key === `!actors.items!${id}.${i._id}`), `${actor.name} item ids + keys`);
  if (stamina) ok(actor.system.stamina.max === stamina && actor.system.monster.organization === "platoon" && actor.system.ev === 6, `${actor.name} is the Appendix platoon band (Sta ${stamina}, EV 6)`);
  else ok(actor.system.monster.organization === "minion" && actor.effects.some(e => e.name === "With Captain"), `${actor.name} is an ambience minion with the captain rider`);
  ok(!/ritual (rules|magic)/i.test(JSON.stringify(actor.items)), `${actor.name} carries no ritual rules`);
}
const nim = read("src/packs/deadhead/nightjar-market/nim.json");
ok(nim.system.damage.weaknesses.fire === 5 && nim.system.damage.immunities.poison === 1 && nim.system.statuses.immunities.includes("bleeding"), "Nim: fire weakness 5, immunity 1, Bloodless");
ok(/wHt0uT7mAgK3s1cQ/.test(nim.system.biography.director) && /OepS68mz9km9j8EU/.test(nim.system.biography.director), "Nim references Whiteout / Static by UUID, no duplicate SKUs");
const rhen = read("src/packs/deadhead/nightjar-market/rhen-calder.json");
ok(rhen.system.movement.disengage === 2 && !rhen.items.some(i => i.type === "ability"), "Rhen: Graceful Retreat disengage 2, no weapon strike");
const deadheadFiles = readdirSync("src/packs/deadhead", { recursive: true }).filter(f => f.endsWith(".json") && !f.endsWith("_folder.json"));
ok(deadheadFiles.length === CAST.length + 1, `deadhead pack = Nox freighter + ${CAST.length} cast (got ${deadheadFiles.length})`);
const bestiaryDupes = readdirSync("src/packs/bestiary", { recursive: true }).filter(f => /iona|rhen-calder|nim\.json|vesper|tam-kade|sera-nix|cousin-vell|juno/.test(f));
ok(bestiaryDupes.length === 0, "no run-only cast duplicated into the main Bestiary");

const nox = read("src/packs/deadhead/nox-trash-freighter.json");
ok(nox.flags[MODULE].contactPortrait?.endsWith("deadhead/nox-portrait.webp") && existsSync(asset(nox.flags[MODULE].contactPortrait)), "Nox portrait linked on the freighter Actor");
ok(/nox-portrait\.webp/.test(lang.Deadhead.Actors.NoxTrashFreighter.Description), "Nox portrait shows on the freighter sheet");

// ------------------------------------------------------------ Nightjar Market Scene

const template = read("data/scenes/nightjar-market.json");
const script = readFileSync("scripts/nightjar-market-scene.mjs", "utf8");
const entry = readFileSync("scripts/module.mjs", "utf8");
ok(template.width === 1579 && template.height === 915 && existsSync(asset(template.background)), "Nightjar template 1579×915; plate on disk");
ok(/registerNightjarMarketScene\(\)/.test(entry) && /nightjar-market-scene\.mjs/.test(entry), "module.mjs registers the Nightjar inject");
ok(!/force/.test(script.replace(/no force path/i, "")), "Nightjar inject has no force path");
ok(/if \(existing \|\| !game\.user\.isGM\) return existing/.test(script), "Nightjar inject returns an existing Scene untouched");
ok(/deadheadScenes/.test(script) && /navOrder/.test(script), "Nightjar lands in Scenes → Deadhead, nav after Gold Line");
ok(!/Tile|Wall|AmbientLight|Token/.test(script.replace(/Director's dress pass|walls, lights, and buyer tokens/gi, "")), "Nightjar inject invents no tiles / walls / lights / tokens");
ok(!existsSync("data/scenes/flats-transit.json") && !existsSync("data/scenes/freighter-meet.json"), "no phantom Transit / Freighter Scene templates");
ok(readFileSync("scripts/gold-line-scene.mjs", "utf8").includes("if (existing && !force) return existing"), "Gold Line inject still returns the live Scene untouched");
ok(lang.Scenes.NightjarMarket?.Name === "Nightjar Market", "lang Nightjar Scene name");

if (failures.length) {
  console.error("\nFAILED:");
  for (const msg of failures) console.error(`  ✗ ${msg}`);
  process.exit(1);
}
console.log("\nAll Deadhead Foundry push smoke checks passed.");
