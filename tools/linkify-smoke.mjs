#!/usr/bin/env node
/**
 * B97 smoke: heading IDs + linkify patterns + (optional) assembled HTML grep.
 *
 *   node tools/linkify-smoke.mjs
 *   node tools/linkify-smoke.mjs --html   # also require built 0.4.0.html
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { assignHeadingIds, createIdAllocator, headingIdSource, scanAtxHeadings, slugifyHeading } from "./lib/heading-anchor.mjs";
import { linkifyManuscript } from "./lib/linkify-manuscript.mjs";
import { markdownToHtml } from "./lib/md-to-html.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const HTML_OUT = join(ROOT, "docs/manuscript/build/Ghostwire-Rulebook-0.4.0.html");

const failures = [];
const ok = (cond, msg) => {
  if (!cond) failures.push(msg);
  else console.log(`  ✓ ${msg}`);
};

console.log("heading-anchor");
ok(slugifyHeading("The Wire") === "the-wire", "slug The Wire");
ok(slugifyHeading("Kits, Gear & Wealth (¥)") === "kits-gear-wealth", "slug kits/gear");
ok(slugifyHeading("Appendix B — Character Generation Cheat Sheet").startsWith("appendix-b-"), "slug appendix B");
ok(headingIdSource("[Chapter 27](#x) — Running Ossian Reach") === "Chapter 27 — Running Ossian Reach", "headingIdSource strips links");
const alloc = createIdAllocator();
ok(alloc("Class Chassis") === "class-chassis", "first collision keeps slug");
ok(alloc("Class Chassis") === "class-chassis-2", "second collision suffixes -2");
ok(alloc("Class Chassis") === "class-chassis-3", "third collision suffixes -3");

const scanned = assignHeadingIds(scanAtxHeadings("# Combat\n\n## When a fight starts\n\n> ## In Foundry\n"));
ok(scanned[0].id === "combat", "scan h1");
ok(scanned[1].id === "when-a-fight-starts", "scan h2");
ok(scanned[2]?.id === "in-foundry", "scan heading inside blockquote");

console.log("md-to-html shared allocator");
const htmlHead = markdownToHtml("# Hello\n\n# Hello\n\n> # Hello\n");
ok(htmlHead.includes('id="hello"') && htmlHead.includes('id="hello-2"') && htmlHead.includes('id="hello-3"'), "html collisions + blockquote share allocator");

console.log("linkify fixtures");
const manifest = [
  { type: "part", id: "I", title: "Part I — Core Rules" },
  { type: "file", id: "L1", title: "Setting Primer", path: "01-lore/L1-setting-primer.md", kind: "lore" },
  { type: "file", id: "how-to", title: "How to Use This Book", path: "00-front/how-to-use-this-book.md", kind: "front" },
  { type: "file", id: "ch4", title: "Combat", path: "../raw/04-combat.md", kind: "raw", print_ch: 4 },
  { type: "file", id: "ch9", title: "Kits, Gear & Wealth (¥)", path: "../raw/08-kits-gear-wealth.md", kind: "raw", print_ch: 9 },
  { type: "file", id: "ch23", title: "The Wire", path: "../raw/21-the-wire.md", kind: "raw", print_ch: 23 },
  { type: "file", id: "ch28", title: "Glossary of Slang & Setting Jargon", path: "04-back/28-glossary-slang.md", kind: "new", print_ch: 28 },
  { type: "file", id: "ch29", title: "Character Generation Cheat Sheet (Foundry)", path: "04-back/29-chargen-cheat-sheet.md", kind: "new", print_ch: 29 },
  { type: "file", id: "ch21", title: "Hacker", path: "../raw/19-hacker.md", kind: "raw", print_ch: 21 },
];

const fixture = [
  "<!-- PART: Lore Harvest -->",
  "<!-- chapter: Setting Primer · kind=lore -->",
  "# Setting Primer",
  "",
  "Piped through the overlay (Ch. 21) — lore-book chapter, not print Hacker.",
  "Directors still use print Ch 23 for the Wire.",
  "",
  "<!-- chapter: How to Use This Book -->",
  "# How to Use This Book",
  "",
  "Safety lives in How to Play → Table tone and safety (print Ch 1).",
  "Foundry punch-list: Appendix B (print Ch 29).",
  "",
  "<!-- chapter: Combat (print Ch 4) · kind=raw -->",
  "# Combat",
  "",
  "Jacked In runners use `21`. Full rules: `21-the-wire.md`.",
  "Take payout (`08`) then see Combat again.",
  "Directors: Ch. 9 and chapter 26 if those exist.",
  "Do not invent `99`.",
  "Range `12`–`20` stays two raw ids (missing → skipped).",
  "Source note: `docs/rulebook/08-hacker.md` is not a print chapter.",
  "<figure class=\"gw-plate\"><img src=\"assets/maps/districts/04-combat.png\" alt=\"x\" /></figure>",
  "",
  "## Table tone and safety",
  "",
  "| File | Chapter |",
  "|---|---|",
  "| `04-combat.md` | Combat |",
  "",
  "<!-- chapter: Kits, Gear & Wealth (¥) (print Ch 9) · kind=raw -->",
  "# Kits, Gear & Wealth (¥)",
  "",
  "<!-- chapter: The Wire (print Ch 23) · kind=raw -->",
  "# The Wire",
  "",
  "<!-- chapter: Glossary of Slang & Setting Jargon (print Ch 28) · kind=new -->",
  "# Glossary of Slang & Setting Jargon",
  "",
  "<!-- chapter: Character Generation Cheat Sheet (Foundry) (print Ch 29) · kind=new -->",
  "# Appendix B — Character Generation Cheat Sheet",
  "",
  "See also **How to Play → Table tone and safety** (print Ch 1).",
  "",
  "<!-- chapter: Hacker (print Ch 21) · kind=raw -->",
  "# The Hacker",
  "",
  "See also Ch. 21 in rules (print number).",
  "",
].join("\n");

const { markdown, stats } = linkifyManuscript(fixture, manifest);
ok(stats.contentsInserted, "inserts Contents before lore part");
ok(/<!-- chapter: Contents -->/.test(markdown), "Contents banner present");
ok(/\[`21`\]\(#the-wire\)/.test(markdown), "`21` → #the-wire (RAW file, not print Ch 21)");
ok(/\[`21-the-wire\.md`\]\(#the-wire\)/.test(markdown), "filename `21-the-wire.md` links");
ok(/\[`08`\]\(#kits-gear-wealth\)/.test(markdown), "`08` → kits/gear heading");
ok(/\[print Ch 29\]\(#appendix-b-character-generation-cheat-sheet\)/.test(markdown), "print Ch 29 → appendix B heading");
ok(/\[Appendix B\]\(#appendix-b-character-generation-cheat-sheet\)/.test(markdown), "Appendix B label links");
ok(/\[Ch\. 9\]\(#kits-gear-wealth\)/.test(markdown), "Ch. 9 → print Ch 9 (kits), not raw 09");
ok(!/chapter 26\]\(#/.test(markdown), "chapter 26 left alone (no print Ch 26 in fixture)");
ok(!/`99`\]\(#/.test(markdown) && /Do not invent `99`/.test(markdown), "unknown raw id left alone");
ok(/`docs\/rulebook\/08-hacker\.md`/.test(markdown) && !/\[`docs\/rulebook\/08-hacker\.md`\]/.test(markdown), "rulebook path not linkified");
ok(/src="assets\/maps\/districts\/04-combat\.png"/.test(markdown), "figure src untouched");
ok(/\[`04-combat\.md`\]\(#combat\)/.test(markdown), "TOC table filename cell links");
ok(!/see Combat again/.test(markdown) || /see \[Combat\]\(#combat\) again/.test(markdown), "see Combat links chapter title");
ok(/^# Combat$/m.test(markdown), "plain Combat h1 unchanged");
ok(/# (?:\[)?Appendix B/.test(markdown), "Appendix B h1 still present");
ok(markdownToHtml(markdown).includes('id="appendix-b-character-generation-cheat-sheet"'), "Appendix B id stable if heading is linkified");
ok(/\*\*How to Play → \[Table tone and safety\]\(#table-tone-and-safety\)\*\*/.test(markdown), "bold How to Play → subsection arrow");
ok(/overlay \(Ch\. 21\)/.test(markdown) && !/overlay \(\[Ch\. 21\]/.test(markdown), "lore-book Ch. 21 not mapped to print Hacker");
ok(/\[print Ch 23\]\(#the-wire\)/.test(markdown), "print Ch 23 still links Wire inside lore");
ok(/See also \[Ch\. 21\]\(#the-hacker\)/.test(markdown), "rules Ch. 21 → print Hacker");
ok(stats.skipped >= 1, "records skipped/unambiguous misses");

const linkedHtml = markdownToHtml(markdown);
ok(linkedHtml.includes('href="#the-wire"'), "html emits href=#the-wire");
ok(linkedHtml.includes('id="the-wire"'), "html heading id the-wire exists");
ok(linkedHtml.includes('id="contents"'), "html Contents heading id");

if (process.argv.includes("--html")) {
  console.log("assembled HTML");
  ok(existsSync(HTML_OUT), `exists ${HTML_OUT}`);
  if (existsSync(HTML_OUT)) {
    const html = readFileSync(HTML_OUT, "utf8");
    const hrefs = html.match(/href="#[^"]+"/g) || [];
    const unique = new Set(hrefs);
    console.log(`  href="#…" count: ${hrefs.length} (${unique.size} unique)`);
    ok(hrefs.length >= 80, `at least 80 in-doc hrefs (got ${hrefs.length})`);
    ok(html.includes('href="#the-wire"'), "draft HTML has #the-wire");
    ok(html.includes('href="#combat"'), "draft HTML has #combat");
    ok(html.includes('id="contents"') && html.includes('href="#how-to-use-this-book"'), "draft HTML Contents + how-to-use");
    ok(html.includes('href="#appendix-b-character-generation-cheat-sheet"'), "draft HTML Appendix B");
    const missing = [];
    const idSet = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
    for (const href of unique) {
      const id = href.slice('href="#'.length, -1);
      if (!idSet.has(id)) missing.push(id);
    }
    ok(missing.length === 0, missing.length ? `all href targets exist (missing ${missing.slice(0, 8).join(", ")})` : "all href targets exist");
  }
}

if (failures.length) {
  console.error("\nFAIL");
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log("\nlinkify-smoke OK");
