#!/usr/bin/env node
/**
 * 0.3.134 (G8) — put the eight locked summon rules into every chapter that needs them.
 *
 * The rules live once, in `tools/data/summon-command-rules.md`, and are written into the four raw
 * chapters a player or a Director would actually look in, plus the generated stat-block chapter
 * (`tools/gen-summon-statblocks.mjs` reads the same file). VOIDMARK indexes docs/raw, so putting the
 * section in all five is also what makes "how do I make my electrical zephyr attack?" retrievable
 * from whichever chapter the question lands nearest.
 *
 * Idempotent: the section is fenced, and a re-run replaces what is between the fences.
 *
 * Run: node tools/summon-rules-to-raw.mjs   then   node tools/raw-to-journals.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";

const RULES = readFileSync("tools/data/summon-command-rules.md", "utf8").replace(/\r\n/g, "\n").trim();
const OPEN = "<!-- summon-command-rules:start -->";
const CLOSE = "<!-- summon-command-rules:end -->";
const BLOCK = `${OPEN}\n\n${RULES}\n\n${CLOSE}`;

/** Chapter → the heading the section is inserted *before*, or null for "append at the end". */
const TARGETS = [
  ["docs/raw/17-elementalist.md", null],
  ["docs/raw/18-street-priest.md", null],
  ["docs/raw/22-the-veil.md", "## Corruption & Taint"],
  ["docs/raw/28-constructs-pets-faq.md", null],
];

for (const [path, before] of TARGETS) {
  const text = readFileSync(path, "utf8").replace(/\r\n/g, "\n");
  const stripped = text.replace(new RegExp(`\\n*${OPEN}[\\s\\S]*?${CLOSE}\\n*`, "g"), "\n\n");
  let next;
  if (before && stripped.includes(`\n${before}`)) {
    next = stripped.replace(`\n${before}`, `\n${BLOCK}\n\n${before}`);
  } else {
    next = `${stripped.replace(/\n+$/, "")}\n\n${BLOCK}\n`;
  }
  writeFileSync(path, next);
  console.log(`  ${path}: eight summon rules ${before ? `before "${before}"` : "appended"}`);
}
console.log(`summon command rules: ${TARGETS.length} chapter(s) updated`);
