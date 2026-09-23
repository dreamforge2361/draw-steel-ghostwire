#!/usr/bin/env node
/**
 * G3 (0.3.102) — lang + style tokens smoke.
 *
 * Two halves, both of which are mostly a *lock* on a state that is already good:
 *
 * LANG — every `GHOSTWIRE.*` key the module reaches for at runtime exists in lang/en.json.
 *   Scans scripts/, templates/, src/packs/ and data/ for literal keys, and resolves by hand the
 *   handful of families built from a template literal (skills, wired states, verb gates), because
 *   those are exactly where a missing key hides: the copy is fine for 43 skills and raw for the
 *   44th. A player who hits a missing key sees `GHOSTWIRE.Something.Name` on their sheet.
 *
 * STYLE — styles/ghostwire.css has one source of truth for the palette.
 *   1. every --ghostwire-* token read is declared in the :root block
 *   2. no --ghostwire-* token is read with a fallback (the block is unconditional; a fallback is a
 *      second copy that goes stale — one had already drifted to a different cyan)
 *   3. no colour literal below the block duplicates a token's value
 *   4. the radius ladder and the two font stacks are used, not re-typed
 *
 * Run (no live Foundry needed): node tools/g3-lang-style-tokens-smoke.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { SKILLS, SKILL_GROUPS } from "../scripts/skills.mjs";
import { WEAPON_SKILLS, MOUNTED_SKILL } from "../scripts/weapon-skills.mjs";
import { atLeast } from "./lib/module-version.mjs";

const fail = [];
const note = (pass, msg) => (pass ? console.log(`  ✓ ${msg}`) : fail.push(msg));
const readJson = path => JSON.parse(readFileSync(path, "utf8"));

console.log("G3 lang + style tokens smoke (0.3.102)\n");

/* ================================================================ lang */

const lang = readJson("lang/en.json");
const keys = new Set();
(function walk(obj, prefix) {
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && (typeof v === "object") && !Array.isArray(v)) walk(v, path);
    else keys.add(path);
  }
})(lang, "");

const has = key => keys.has(key);
// Every ancestor path of every leaf, precomputed: a literal like `GHOSTWIRE.WiredConsole.VerbNeed`
// that only ever appears with a suffix is a branch, not a missing key. Rebuilding this per lookup
// costs ~24M string compares across the pack scan, which is enough to fall over.
const branches = new Set();
for (const key of keys) {
  const parts = key.split(".");
  for (let i = 1; i < parts.length; i += 1) branches.add(parts.slice(0, i).join("."));
}
const isBranch = key => branches.has(key);

const sources = [];
const collect = (dir, exts) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) { if (entry.name !== "node_modules") collect(path, exts); }
    else if (exts.some(ext => entry.name.endsWith(ext))) sources.push(path);
  }
};
collect("scripts", [".mjs", ".json"]);
collect("templates", [".hbs"]);
collect("src/packs", [".json"]);
collect("data", [".json"]);

// A literal key immediately followed by `${` (a template literal) or `*` (a doc comment naming a
// family) is a *prefix*, not a key — those families are checked by hand below.
const literals = new Map();
for (const file of sources) {
  const src = readFileSync(file, "utf8");
  for (const m of src.matchAll(/GHOSTWIRE(?:\.[A-Za-z0-9_]+)+(\$\{|\*)?/g)) {
    if (m[1]) continue;
    if (!literals.has(m[0])) literals.set(m[0], new Set());
    literals.get(m[0]).add(file);
  }
}
const missingLiterals = [...literals.keys()].filter(k => !has(k) && !isBranch(k)).sort();
note(literals.size > 300, `scanned ${sources.length} files for GHOSTWIRE keys — ${literals.size} distinct literals`);
note(!missingLiterals.length,
  `every literal GHOSTWIRE key resolves${missingLiterals.length ? ` — missing: ${missingLiterals.map(k => `${k} (${[...literals.get(k)][0]})`).join(", ")}` : ""}`);

// Families built from a template literal, resolved against the real enums.
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const family = (label, built) => {
  const gaps = built.filter(key => !has(key));
  note(!gaps.length, `${label}: all ${built.length} keys resolve${gaps.length ? ` — missing: ${gaps.join(", ")}` : ""}`);
};

family("skill groups", SKILL_GROUPS.map(g => `GHOSTWIRE.Skills.Groups.${cap(g)}`));
family("skill list", Object.values(SKILLS).flat().map(s => `GHOSTWIRE.Skills.List.${cap(s)}`));

const consoleSrc = ["wired-console-verbs", "wired-console", "wired-node-verbs"]
  .map(name => readFileSync(`scripts/${name}.mjs`, "utf8")).join("\n");
const reasons = [...new Set([...consoleSrc.matchAll(/reason:\s*"([A-Za-z]+)"/g)].map(m => m[1]))];
note(reasons.length >= 6, `wired console gates report ${reasons.length} refusal reasons`);
family("console verb gates", reasons.map(r => `GHOSTWIRE.WiredConsole.VerbNeed${r}`));

const moduleSrc = readFileSync("scripts/module.mjs", "utf8");
const warnings = [...new Set([...moduleSrc.matchAll(/warn\("([A-Za-z]+)"\)/g)].map(m => m[1]))];
note(warnings.length >= 5, `the ability-use patch raises ${warnings.length} wired warnings`);
family("wired warnings", warnings.map(w => `GHOSTWIRE.Wired.Warnings.${w}`));
family("wired states", ["disconnected", "linked", "overlay", "jackedIn"].map(s => `GHOSTWIRE.Wired.States.${s}`));

// G4's spawned weapon abilities are player-facing copy too.
family("B49 weapon-use copy",
  ["VerbMelee", "VerbRanged", "AbilityName", "AbilityDescription"].map(k => `GHOSTWIRE.EquipmentUse.${k}`));

// Every skill G4 can award a +2 for has to have a name a player can read on the dialog.
family("G4 weapon skills",
  [...new Set([...Object.values(WEAPON_SKILLS).filter(Boolean), MOUNTED_SKILL])].map(s => `GHOSTWIRE.Skills.List.${cap(s)}`));

// An empty string is usually a half-written key a player will hit as blank space. The exception is
// a power-roll effect tier with nothing to say: DrawSteelAbility#powerRollText does
// `.map(e => e.toText(tier)).filter(_ => _).join("; ")`, so an empty tier display is dropped rather
// than rendered as a blank line. The two damage-only summon strikes — the Attack Sprite's Code
// Strike and the Spike Agent's Integrity Spike — say "no damage" at tier 1 and let the damage
// effect speak for tiers 2 and 3. Listed one by one so a *new* empty key still fails this check.
const ALLOWED_EMPTY = new Set(
  [["Sprites", "SpriteAttack"], ["Agents", "AgentSpike"]].flatMap(([group, stem]) =>
    ["Minor", "Intermediate", "Advanced"].flatMap(band =>
      ["Tier2", "Tier3"].map(tier => `GHOSTWIRE.Summons.${group}.${stem}${band}.Strike.${tier}`))));
const leaf = path => path.split(".").reduce((obj, k) => obj?.[k], { GHOSTWIRE: lang.GHOSTWIRE });
const blank = [...keys].filter(k => k.startsWith("GHOSTWIRE.") && !ALLOWED_EMPTY.has(k) && !String(leaf(k) ?? "").trim());
note(!blank.length, `no GHOSTWIRE key is present but empty${blank.length ? ` — ${blank.slice(0, 6).join(", ")}` : ""}`);
note([...ALLOWED_EMPTY].every(k => keys.has(k)), `the ${ALLOWED_EMPTY.size} deliberately-empty sprite tier displays are all still present`);

/* ================================================================ style tokens */

const css = readFileSync("styles/ghostwire.css", "utf8");
const lines = css.split(/\r?\n/);
const rootStart = lines.findIndex(l => l.startsWith(":root,"));
const rootEnd = lines.findIndex((l, i) => (i > rootStart) && (l.trim() === "}"));
note((rootStart > 0) && (rootEnd > rootStart), `the :root token block is lines ${rootStart + 1}-${rootEnd + 1}`);

// Parsed over the whole block, not line by line: --ghostwire-glow wraps onto a second line.
const declared = new Map();     // token name -> declared value
for (const m of lines.slice(rootStart, rootEnd).join(" ").matchAll(/--(ghostwire-[a-z0-9-]+):\s*([^;]+);/g)) {
  declared.set(m[1], m[2].replace(/\s+/g, " ").trim());
}
note(declared.size >= 24, `${declared.size} --ghostwire-* tokens declared`);

const body = lines.slice(rootEnd + 1);
const bodyText = body.join("\n");

const used = new Set([...css.matchAll(/var\(\s*--(ghostwire-[a-z0-9-]+)/g)].map(m => m[1]));
const undeclared = [...used].filter(t => !declared.has(t)).sort();
note(!undeclared.length, `every token read is declared${undeclared.length ? ` — undeclared: ${undeclared.join(", ")}` : ""}`);

const withFallback = [...css.matchAll(/var\(\s*--ghostwire-[a-z0-9-]+\s*,[^)]*\)/g)].map(m => m[0]);
note(!withFallback.length,
  `no --ghostwire-* token is read with a fallback${withFallback.length ? ` — ${withFallback.slice(0, 4).join(" · ")}` : ""}`);

const colourTokens = new Map();  // #hex -> first token declaring it
for (const [name, value] of declared) {
  const m = value.match(/^(#[0-9a-fA-F]{3,8})$/);
  if (m && !colourTokens.has(m[1].toLowerCase())) colourTokens.set(m[1].toLowerCase(), name);
}
note(colourTokens.size >= 12, `${colourTokens.size} of them are plain colour literals`);

const dupes = [...new Set([...bodyText.matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map(m => m[0].toLowerCase()))]
  .filter(hex => colourTokens.has(hex));
note(!dupes.length,
  `no colour below the block re-types a token's value${dupes.length ? ` — ${dupes.map(h => `${h} is --${colourTokens.get(h)}`).join(", ")}` : ""}`);

// The two halves of the palette that were split: ok/warn ran on undeclared fallbacks.
note(declared.has("ghostwire-ok") && declared.has("ghostwire-warn"),
  "--ghostwire-ok and --ghostwire-warn are declared, not left to per-applet fallbacks");
note(declared.get("ghostwire-ok") === "var(--ghostwire-success)", "--ghostwire-ok points at --ghostwire-success");
note(declared.get("ghostwire-warn") === "var(--ghostwire-warning)", "--ghostwire-warn points at --ghostwire-warning");

const RADIUS = ["ghostwire-radius-xs", "ghostwire-radius-sm", "ghostwire-radius", "ghostwire-radius-lg", "ghostwire-radius-pill"];
note(RADIUS.every(t => declared.has(t)), `the radius ladder is declared (${RADIUS.length} steps)`);
// A size that is not on the ladder (the one 1px hairline) is fine; re-typing a ladder size is not.
const LADDER = ["3px", "4px", "6px", "8px", "999px"];
const rawRadius = [...new Set([...bodyText.matchAll(/border-radius:\s*([0-9]+px)/g)].map(m => m[1]))].filter(s => LADDER.includes(s));
note(!rawRadius.length, `no border-radius re-types a ladder size${rawRadius.length ? ` — ${rawRadius.join(", ")}` : ""}`);

note(declared.has("ghostwire-font-mono") && declared.has("ghostwire-font-ui"), "both font stacks are tokens");
const rawMono = [...bodyText.matchAll(/font-family:\s*(?:ui-)?monospace/g)].length;
note(!rawMono, `no rule re-types a monospace stack${rawMono ? ` — ${rawMono} left` : ""}`);
note(bodyText.includes("var(--ghostwire-font-mono)"), "and --ghostwire-font-mono is actually used");

// Applet prefixes must keep aliasing the globals rather than styling against raw colour.
for (const prefix of ["wc", "rg", "rw", "cg", "vm"]) {
  const aliases = [...css.matchAll(new RegExp(`--${prefix}-[a-z0-9-]+:\\s*var\\(--ghostwire-`, "g"))].length;
  note(aliases >= 5, `--${prefix}-* still aliases ${aliases} global tokens`);
}

note(document_body_gets_theme(moduleSrc), "scripts/module.mjs puts .ghostwire-theme on the body, so the theme hooks fire");
function document_body_gets_theme(src) {
  return /document\.body\.classList\.add\([^)]*"ghostwire-theme"/.test(src);
}

note(atLeast(readJson("module.json").version, "0.3.102"), `module.json is ${readJson("module.json").version} (>= 0.3.102)`);

/* ================================================================ */

console.log("");
if (fail.length) {
  for (const msg of fail) console.error(`  ✗ ${msg}`);
  console.error(`\nG3 smoke FAILED — ${fail.length} check(s).`);
  process.exit(1);
}
console.log("G3 smoke PASS.");
