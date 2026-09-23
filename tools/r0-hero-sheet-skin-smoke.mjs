#!/usr/bin/env node
/**
 * R0 smoke (0.3.120) — Hero sheet Ghostwire skin.
 *
 * R0 is a design pass, so most of it cannot be asserted: a smoke cannot tell you whether the sheet
 * *feels* like the locked mock. What it can lock is everything that would silently undo the lock —
 * the two token ladders G3 deferred, the sheet-scoped accent group, the three pieces of atmosphere
 * the mock is actually made of, and the line R0 promised not to cross.
 *
 *   1. TRACKING LADDER — ten rungs, the values already in the file, and no `letter-spacing: Nem`
 *      literal left below the token block.
 *   2. PANEL RAMP — eleven steps, distinct, strictly ascending in relative luminance, none re-typed.
 *   3. WIRE STATES — the four state colours are named, not bare hex.
 *   4. SHEET GROUP — `--ghostwire-sheet-*` exists, and reads as the locked direction: near-black
 *      ink, a *desaturated* cold-steel accent (not the neon `--ghostwire-accent`), an ember in the
 *      warm-brown band. Checked numerically, because "cold steel" is the whole brief.
 *   5. THE MOCK'S THREE PIECES — GHOSTWIRE watermark, hairline wire frame with corner nodes, one
 *      corner sigil. Each present, each `pointer-events: none` so the skin can never eat a click.
 *   6. SHEET-SCOPED, NOT A GLOBAL FLIP — the R0 block never reads `--ghostwire-accent`, the accent
 *      is still the neon cyan, and the applets still alias the globals they always did.
 *   7. The marker class `scripts/module.mjs` stamps, and the asset the sigil masks.
 *
 * Run (no live Foundry needed): node tools/r0-hero-sheet-skin-smoke.mjs
 */
import { readFileSync, statSync } from "node:fs";
import { atLeast } from "./lib/module-version.mjs";

const ok = [];
const fail = [];
const note = (pass, msg) => (pass ? ok.push(`  ✓ ${msg}`) : fail.push(msg));

console.log("R0 Hero sheet skin smoke (0.3.120)\n");

const css = readFileSync("styles/ghostwire.css", "utf8");
const lines = css.split(/\r?\n/);
const rootStart = lines.findIndex(l => l.startsWith(":root,"));
const rootEnd = lines.findIndex((l, i) => (i > rootStart) && (l.trim() === "}"));
const rootText = lines.slice(rootStart, rootEnd).join(" ");
const bodyText = lines.slice(rootEnd + 1).join("\n");

const declared = new Map();
for (const m of rootText.matchAll(/--(ghostwire-[a-z0-9-]+):\s*([^;]+);/g)) {
  declared.set(m[1], m[2].replace(/\s+/g, " ").trim());
}

/* --- colour helpers. "Cold steel, not neon" is a numeric claim, so measure it. ---------------- */
const rgb = hex => [1, 3, 5].map(i => Number.parseInt(hex.slice(i, i + 2), 16));
const luma = hex => { const [r, g, b] = rgb(hex); return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; };
const hsl = hex => {
  const [r, g, b] = rgb(hex).map(v => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? ((g - b) / d + (g < b ? 6 : 0)) : max === g ? ((b - r) / d + 2) : ((r - g) / d + 4);
  return { h: h * 60, s, l };
};

/* ================================================================ 1) tracking ladder */

console.log("1) Letter-spacing ladder (G3 deferral #1)");
const TRACK = [
  ["ghostwire-track-xs", "0.02em"],
  ["ghostwire-track-sm", "0.03em"],
  ["ghostwire-track", "0.04em"],
  ["ghostwire-track-md", "0.05em"],
  ["ghostwire-track-lg", "0.06em"],
  ["ghostwire-track-xl", "0.08em"],
  ["ghostwire-track-2xl", "0.1em"],
  ["ghostwire-track-3xl", "0.12em"],
  ["ghostwire-track-4xl", "0.14em"],
  ["ghostwire-track-5xl", "0.16em"],
];
const trackGaps = TRACK.filter(([name, value]) => declared.get(name) !== value);
note(!trackGaps.length,
  `the ten-rung tracking ladder is declared${trackGaps.length ? ` — wrong/missing: ${trackGaps.map(([n]) => n).join(", ")}` : ""}`);
const trackValues = TRACK.map(([, v]) => Number.parseFloat(v));
note(trackValues.every((v, i) => !i || (v > trackValues[i - 1])), "and it ascends, 0.02em → 0.16em");

const rawTrack = [...new Set([...bodyText.matchAll(/letter-spacing:\s*(0?\.[0-9]+em)/g)].map(m => m[1]))];
note(!rawTrack.length,
  `no rule below the block re-types a tracking value${rawTrack.length ? ` — ${rawTrack.join(", ")}` : ""}`);
const trackReads = [...bodyText.matchAll(/letter-spacing:\s*var\(--ghostwire-track/g)].length;
note(trackReads >= 55, `${trackReads} rules read the ladder instead`);
// `letter-spacing: 0` is "none", not a rung, and stays a literal on purpose.
note([...bodyText.matchAll(/letter-spacing:\s*0;/g)].length >= 1, "a bare `letter-spacing: 0` reset is still allowed");

/* ================================================================ 2) panel ramp */

console.log("\n2) Panel dark ramp (G3 deferral #2)");
const PANEL = Array.from({ length: 11 }, (_, i) => `ghostwire-panel-${i}`);
const panelGaps = PANEL.filter(t => !/^#[0-9a-f]{6}$/i.test(declared.get(t) ?? ""));
note(!panelGaps.length,
  `the panel ramp is eleven plain hex steps${panelGaps.length ? ` — bad/missing: ${panelGaps.join(", ")}` : ""}`);
const panelHexes = PANEL.map(t => (declared.get(t) ?? "").toLowerCase());
note(new Set(panelHexes).size === PANEL.length, "every step is a distinct colour");
const lumas = panelHexes.map(luma);
note(lumas.every((v, i) => !i || (v > lumas[i - 1])), "and the ramp ascends by relative luminance, step 0 darkest");
note(lumas.at(-1) < 0.16, `the whole ramp stays deep ink (lightest step ${panelHexes.at(-1)} at ${lumas.at(-1).toFixed(3)})`);
const rawPanel = panelHexes.filter(hex => bodyText.toLowerCase().includes(hex));
note(!rawPanel.length, `no rule re-types a ramp step${rawPanel.length ? ` — ${rawPanel.join(", ")}` : ""}`);
const panelReads = [...bodyText.matchAll(/var\(--ghostwire-panel-/g)].length;
note(panelReads >= 30, `${panelReads} rules read the ramp instead`);

/* ================================================================ 3) wire states */

console.log("\n3) Wire-state colours (G3 deferral #3)");
const WIRE = ["ghostwire-wire-linked", "ghostwire-wire-linked-console", "ghostwire-wire-connected", "ghostwire-wire-jacked"];
note(WIRE.every(t => /^#[0-9a-f]{6}$/i.test(declared.get(t) ?? "")), "the four wire-state colours are named tokens");
const wireHexes = WIRE.map(t => (declared.get(t) ?? "").toLowerCase());
note(!wireHexes.some(hex => bodyText.toLowerCase().includes(hex)), "and none of them is re-typed below the block");
// The two greens stay two greens: merging them is an applet repaint, and R0 is sheet-scoped.
note(declared.get("ghostwire-wire-linked") !== declared.get("ghostwire-wire-linked-console"),
  "the sheet green and the console green are still deliberately different");
note(bodyText.includes("var(--ghostwire-wire-linked)") && bodyText.includes("var(--ghostwire-wire-jacked)"),
  "the Hero sheet / token-HUD rungs read the tokens");

/* ================================================================ 4) the sheet group */

console.log("\n4) Sheet-scoped cold-steel group");
const SHEET = [
  "ghostwire-sheet-ink", "ghostwire-sheet-panel", "ghostwire-sheet-panel-2",
  "ghostwire-sheet-steel", "ghostwire-sheet-steel-bright", "ghostwire-sheet-steel-dim",
  "ghostwire-sheet-text", "ghostwire-sheet-text-dim",
  "ghostwire-sheet-ember", "ghostwire-sheet-ember-bright",
  "ghostwire-sheet-watermark", "ghostwire-sheet-wire", "ghostwire-sheet-wire-soft",
  "ghostwire-sheet-sigil",
];
const sheetGaps = SHEET.filter(t => !declared.has(t));
note(!sheetGaps.length, `all ${SHEET.length} --ghostwire-sheet-* tokens are declared${sheetGaps.length ? ` — missing: ${sheetGaps.join(", ")}` : ""}`);
const unusedSheet = SHEET.filter(t => !bodyText.includes(`var(--${t})`));
note(!unusedSheet.length, `and every one of them is read${unusedSheet.length ? ` — dead: ${unusedSheet.join(", ")}` : ""}`);

const steel = declared.get("ghostwire-sheet-steel") ?? "";
const steelHsl = hsl(steel);
note(/^#[0-9a-f]{6}$/i.test(steel), `the accent is a plain colour (${steel})`);
note((steelHsl.h > 170) && (steelHsl.h < 230), `and it sits in the cyan-steel band (hue ${steelHsl.h.toFixed(0)}°)`);
note(steelHsl.s < 0.32, `and it is muted, not neon (saturation ${(steelHsl.s * 100).toFixed(0)}% — the brief says cold steel)`);
note(steel.toLowerCase() !== (declared.get("ghostwire-accent") ?? "").toLowerCase(),
  "and it is not --ghostwire-accent wearing a new name");

const ember = declared.get("ghostwire-sheet-ember") ?? "";
const emberHsl = hsl(ember);
note((emberHsl.h > 10) && (emberHsl.h < 45), `the ember is a warm brown (${ember}, hue ${emberHsl.h.toFixed(0)}°)`);
note(emberHsl.s < 0.5, "and a muted one, not a signal orange");

note(declared.get("ghostwire-sheet-ink") === "var(--ghostwire-panel-0)", "the sheet ink is step 0 of the ramp, not a twelfth dark");
note(luma(panelHexes[0]) < 0.05, `and step 0 is genuinely deep ink (${panelHexes[0]})`);

/* ================================================================ 5) the mock's three pieces */

console.log("\n5) Watermark, wire frame, corner sigil");
const r0 = css.slice(css.indexOf("R0 (0.3.120) — Hero sheet Ghostwire skin"));
note(r0.length > 4000, "the R0 block is present and is not a stub");

const rule = name => {
  const at = r0.indexOf(name);
  if (at < 0) return "";
  const open = r0.indexOf("{", at);
  return (open < 0) ? "" : r0.slice(open, r0.indexOf("}", open));
};

const watermark = rule(".ghostwire-hero-sheet .window-content::before");
note(/content:\s*"GHOSTWIRE"/.test(watermark), "the watermark is a GHOSTWIRE ::before on the sheet content");
note(/var\(--ghostwire-sheet-watermark\)/.test(watermark), "drawn in the watermark token, not a bare dark");
note(/var\(--ghostwire-font-display\)/.test(watermark), "in the display face");
note(/overflow:\s*hidden/.test(watermark), "clipped by its own box, so it never widens or scrolls the sheet");
note(/pointer-events:\s*none/.test(watermark), "and it cannot eat a click");

const frame = rule(".ghostwire-hero-sheet::before");
note(/border:\s*1px solid/.test(frame), "the wire frame is a hairline, not a slab");
note((frame.match(/radial-gradient/g) ?? []).length === 4, "with a node dot at each of the four corners");
note(/var\(--ghostwire-sheet-wire-soft\)/.test(frame) && /var\(--ghostwire-sheet-steel\)/.test(frame),
  "in the steel hairline tokens");
note(/pointer-events:\s*none/.test(frame), "and it cannot eat a click");

const trace = rule(".ghostwire-hero-sheet::after");
note((trace.match(/linear-gradient/g) ?? []).length === 4, "four trace runs come off the corner nodes");
note(/pointer-events:\s*none/.test(trace), "and they cannot eat a click either");

const sigil = rule(".ghostwire-hero-sheet .window-content::after");
note(/mask-image:\s*var\(--ghostwire-sheet-sigil\)/.test(sigil), "the corner sigil is masked from the sigil token");
note(/-webkit-mask-image/.test(sigil), "with the -webkit- pair for older Electron");
note(/background:\s*var\(--ghostwire-sheet-steel\)/.test(sigil), "so the glyph takes the steel accent and cannot drift");
note(/pointer-events:\s*none/.test(sigil), "and it cannot eat a click");

const sigilPath = "assets/brands/ghostwire-sigil.svg";
const sigilSrc = readFileSync(sigilPath, "utf8");
note(declared.get("ghostwire-sheet-sigil") === `url("../${sigilPath}")`, "the token points at the shipped asset");
note(statSync(sigilPath).size < 4096, `and the asset is tiny (${statSync(sigilPath).size} bytes — no pack rebuild needed)`);
note(/<svg[\s>]/.test(sigilSrc) && !/<image[\s>]/.test(sigilSrc), "it is real vector, with no raster payload smuggled in");
note(!/(MCDM|Draw Steel|Draw-Steel)/i.test(sigilSrc), "and carries no MCDM / Draw Steel wordmark");

/* ================================================================ 6) sheet-scoped, not a flip */

console.log("\n6) The applets are not repainted");
note(declared.get("ghostwire-accent") === "#6ee7ff", "--ghostwire-accent is still the module's neon cyan");
note(!/var\(--ghostwire-accent\)/.test(r0), "and the R0 block never reads it — the Hero sheet is cold steel end to end");
const beforeR0 = bodyText.slice(0, bodyText.indexOf("R0 (0.3.120) — Hero sheet Ghostwire skin"));
note([...beforeR0.matchAll(/var\(--ghostwire-accent\)/g)].length > 20,
  "the applets above still read the accent, so nothing was globally flipped");
for (const prefix of ["wc", "rg", "rw", "cg", "vm"]) {
  const aliases = [...css.matchAll(new RegExp(`--${prefix}-[a-z0-9-]+:\\s*var\\(--ghostwire-`, "g"))].length;
  note(aliases >= 5, `--${prefix}-* still aliases ${aliases} global tokens`);
}
note(/\.ghostwire-hero-sheet/.test(r0) && !/\.ghostwire-wired-console/.test(r0),
  "and every R0 selector is scoped under the Hero sheet marker");

/* ================================================================ 7) the marker + the version */

console.log("\n7) Marker class, structure, version");
const moduleSrc = readFileSync("scripts/module.mjs", "utf8");
note(/renderDrawSteelHeroSheet[\s\S]{0,400}classList\.add\("ghostwire-hero-sheet"\)/.test(moduleSrc),
  "scripts/module.mjs stamps .ghostwire-hero-sheet on the Hero sheet render");
note(!/ghostwire-hero-sheet/.test(moduleSrc.replace(/classList\.add\("ghostwire-hero-sheet"\)/, "")
  .replace(/`styles\/ghostwire\.css` under `\.ghostwire-hero-sheet`/, "")),
  "and nothing else in the module hands that class out");

// Structural sanity: the file is only ever shipped, never compiled, so a stray brace is a silent
// half-dead stylesheet. Walk it with comments and strings stripped.
const stripped = css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/"[^"]*"/g, '""');
let depth = 0;
let negative = false;
for (const ch of stripped) {
  if (ch === "{") depth += 1;
  else if (ch === "}") { depth -= 1; if (depth < 0) negative = true; }
}
note(!negative && (depth === 0), `styles/ghostwire.css braces balance (depth ${depth})`);
const opens = (stripped.match(/var\(/g) ?? []).length;
note(opens > 400, `${opens} var() reads`);
const r0Hex = [...r0.matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map(m => m[0]);
note(!r0Hex.length, `the R0 block contains no bare colour literal at all${r0Hex.length ? ` — ${r0Hex.join(", ")}` : ""}`);

const version = JSON.parse(readFileSync("module.json", "utf8")).version;
note(atLeast(version, "0.3.120"), `module.json is ${version} (>= 0.3.120)`);

const director = readFileSync("docs/directors/r0-hero-sheet-skin.md", "utf8");
note(director.length > 2000, "docs/directors/r0-hero-sheet-skin.md exists and is not a stub");
note(/ghostwire-hero-sheet/.test(director), "the note names the marker class");
note(/--ghostwire-track-/.test(director) && /--ghostwire-panel-/.test(director), "and both new ladders");
note(/ghostwire-r0-hero-sheet-mock\.png/.test(director), "and points at the locked mock");

/* ================================================================ */

for (const line of ok) console.log(line);
if (fail.length) {
  console.error(`\n${fail.length} failed:`);
  for (const line of fail) console.error(`  ✗ ${line}`);
  process.exit(1);
}
console.log(`\n${ok.length} checks passed.`);
