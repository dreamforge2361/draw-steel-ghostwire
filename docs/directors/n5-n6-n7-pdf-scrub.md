# N5 + N6 + N7 — player-facing PDF scrub + 0.4.0 reprint

**Done:** 2026-09-23 · branch `docs/n5-n6-n7-pdf-scrub` · module stays **0.3.119** · print stays **0.4.0**
**Output:** `docs/manuscript/build/Ghostwire-Rulebook-0.4.0.pdf` — **95.4 MB / 316 pages**, `%%EOF` present
**Scope:** documentation / print only. No pack rebuild, no LevelDB, no gameplay code.

Same shape as N4: the rules chapters assemble by **pointer** at `docs/raw/*.md`, so editing the RAW
sources is what changes the book. Nothing was edited only in `docs/manuscript/build/*` (those regenerate).

---

## N5 — player-facing reference scrub

The shipped book no longer names a repository path anywhere a reader can see it.

**Production headers deleted** from every MANIFEST input that carried them — the `**RAW status:** draft
(Stage 3 fill …)` and `**Sources:** docs/rulebook/…, docs/masters/…` pair at the top of 29 chapters, plus
the lore-harvest `**Source:** / **Harvested:**` provenance lines on L2 and L3, the `**Status:** draft lore
(… lock 2026-09-…)` lines on L1 / L4 / L5 / L6 / L7 / L8, and Ch 27's `**Status:** / **TOC:**` pair. Ch 0's
"## Chapter status" section went with them — it promised a per-chapter `RAW status` line that no longer
exists.

**Every path reference rewritten or dropped.** `docs/directors/…`, `docs/rulebook/…`, `docs/masters/…`,
`docs/spikes/…`, `docs/setting/…`, `docs/manuscript/…`, `src/packs/…`, `scripts/*.mjs`, `tools/*.mjs`.
Director-doc pointers (Quiet Floor pacing, the F12/F14/F15/F18 notes, kit street-band grants, conglomerate
NPCs, corruption-taint, run generator, random encounter tables) are simply gone from the player book —
they still live in `docs/directors/`, which is not in the print MANIFEST. Master-doc pointers became plain
statements ("Rows below are **harvested**, not invented"; "The table below is the play list and the point
of record for names"). `MEGACORP-TICKERS.md` became "the lore chapters", which is where the Twelve
Conglomerate profiles actually are.

**Filename cross-links became chapter names.** 168 backticked `NN-name.md` references (`21-the-wire.md`,
`09-chrome-body-integrity.md`, …) now read **The Wire** (`21`) / **Chrome & Body Integrity** (`09`). The
bare `NN` in backticks is deliberate: `tools/lib/linkify-manuscript.mjs` turns it into the in-PDF hotlink,
so the reader gets a plain chapter name *and* keeps the click. Post-scrub linkify reports **997 hotlinks**
(contents 130 · raw-ids 791 · print-ch 62 · appendix 10 · see-title 3 · arrows 1 · 6 skipped) with the
`filenames` bucket now at 0 — the traffic moved to `raw-ids`, it did not disappear.

**Internal ticket IDs stripped** — 59 `Bnn` backlog references (`(B49)`, `(B82/B89)`, `B44c / B49`,
`spike **B55**`, `(B91)` in the plate index, …). Same for per-rule module build numbers that a player has
no use for: `**In Foundry (0.3.99):**`, `**Implemented 0.3.113 (F12).**`, `> **Foundry 0.3.105:**`,
`as of G2 / 0.3.100`, `(0.3.80)`, `**0.3.112 — the kit is the mount…**`. And for by-name production locks:
`(Michael lock 2026-09-20)`, `(Michael 2026-09-23)`, "Token art is a placeholder until Michael's plate",
"names are stubs Michael can rename", `backlog #67`, "**TO BE FILLED by Michael** — do not invent" in the
reserved-cover plate. Michael's author, copyright, and commission lines on the credits page stay — those
are the book's actual byline.

**Two leaks were in the build tools, not the sources:**

- `tools/assemble-manuscript.mjs` stamped `<!-- source: ../raw/21-the-wire.md -->` and
  `<!-- resolved: C:\Users\…\docs\raw\21-the-wire.md -->` above every chapter — a bare `../raw/…` and a
  live workspace path in the assembled manuscript and the HTML. Both replaced by `<!-- entry: ch23 -->`.
  Nothing parses those banners (only `<!-- chapter: … kind=… -->` is read, by linkify).
- The manuscript's own title block printed `*Assembled Markdown SoR for later Pandoc/PDF. See
  docs/manuscript/README.md.*` as **visible body text on page 1**, and `tools/build-pdf.mjs`'s print banner
  said "Assembled from `docs/manuscript/` + ART-PLACEMENT.yml. … Journals not regenerated." Both trimmed;
  the banner keeps the version and the art credit.

## N6 — hero-facing Node Rating scrub

Node Rating is a **Wire node / host / ICE defense grade (1–5)** and nothing else. Removed from:

- **Advancement** (`24`) — the "do not touch … Node Rating … as part of the level" step, the
  "What doesn't scale with level" bullet, and "Not permission to grow … Node Rating … by leveling".
  Advancement now contains the string zero times.
- **Heroes & Characteristics** (`02`) — "What leveling does **not** grant: … or Wire Node Rating", and the
  build-firewall bullet that listed Node Rating among the hero's Wire-side entries.
- **Mods** (`10`) — "Node Rating does not change" in the install checklist.
- **Ch 0** — the E1–E4 disambiguation no longer says "not the runner's level"; it just states that E1–E4 on
  a **Wired host** is that host's ICE posture / Node Rating.

Preserved, per the lock: **The Wire** (`21`) keeps all 18 mentions (System Stat Card, Integrity/ICE/
biofeedback ladders, atlas token rows, the Rating-3 worked example); Ch 0's glossary row still defines it,
reworded to "A property of the node, never of a runner"; **Opposition** (`25`) and **Ch 27** keep it for
statting hosts; **How to Play** keeps "Power Roll vs Node Rating" (rolling *against* a node is correct).
No hero chapter now implies runners have — or are denied — a Node Rating.

## N7 — "Converting older Ghostwire material" removed

The whole `## Converting older Ghostwire material` section is deleted from `docs/raw/24-advancement.md`
(~PDF p.105 in the previous 0.4.0): the three conversion tables (hero/foe tier → level, gear tier →
echelon + Availability, node tier → Node Rating), the inverted "Tier 1 / 2 / 3" Power Roll note, and the
"E1–E4 on a host" gazetteer paragraph that lived inside it (the Ch 0 line already carries that
distinction). No stub, no "see director docs" pointer. The chapter's `> **In Foundry**` callout was kept
and now follows the ¥-loop section directly.

Pointers to it are gone too: Ch 0's "**T5–T1** in old drafts is a legacy ladder. Convert with the tables in
Advancement", **Opposition**'s "Convert older Ghostwire foe tiers with the table in `24-advancement.md`
(T5 = Level 1 … T1 = Level 9)", Ch 27's "Convert leftover **T5–T1** Handbook language with the tables in
`24`", Advancement's own promise to teach "how to read leftover **T5–T1** material", and Opposition's
"advancement / **old tiers** `24`" cross-link.

## F16 (print slice only)

Player-facing T5–T1 / Item Tier as a *current* label is out of the print inputs:

- **Mods** (`10`) — the "**No Item Tier / T5–T1 in player-facing text.** The Gear master's Item Tier column
  is a **legacy label**…" block and its five-row `Legacy Item Tier → Echelon` table became a plain
  `Echelon / Availability / mod slots` grade table. "not with a leftover item-tier ladder" and
  "Do not confuse … with Item Tier / gear grade" reworded. Two "Availability feel follows the Gear master's
  **legacy tier** on each row" lines now say "follows the band printed on each row".
- **Lifestyle** (`26`) — Fixer Retainer's "Military-feel Availability **(legacy T2)**".
- **Kits** (`08`) — "gated by **Availability**, not a Ghostwire tier ladder" → "gated by **Availability**".
- **L1 lore** — "Availability T1 gear" / "the milspec gear (Availability T1)" → Prototype Availability;
  "the entities a **T1** ritual might barely banish" → "only the greatest ritual".

Surviving "tier" mentions are all negations of the concept ("Ghostwire has **no separate tier ladder**",
"Do not say 'tier' to players") — those are the doctrine and they stay. **No Foundry lang / pack T1–T5
pass was attempted; F16 stays open** for that.

## Honesty touch

Module version is unchanged at **0.3.119** (docs-only wave). Two front-matter lines that claimed 0.3.100
were corrected to 0.3.119 with the newer shipped systems named (chrome damage, Cover & Conceal, Flanking,
Cyborg System Crisis, workshop benches), the credits page's stale `module.json (0.3.23)` was corrected,
and `docs/manuscript/README.md` got an N5/N6/N7 reprint note. No marketing rewrite.

---

## Deliberate non-changes

- **The bare `NN` chapter shorthand stays.** 795 backticked `` `08` ``-style cross-references are the
  book's own reference scheme, explained on the generated Contents page, and they are what linkify turns
  into hotlinks. Converting them to prose names would gut ~790 in-PDF links for no reader gain. They are
  numbers, not paths.
- **`assets/…` paths stay** (token art, brand marks, district maps, `assets/ai-persona/`). They point at
  content shipped inside the module the reader already has, in Director-facing *In Foundry* click-notes —
  not at internal documents.
- **`27-corruption-taint.md` is still not in the print MANIFEST** (N4's lock: the locked TOC treats Taint
  as a pointer inside Ch 24, not a new print chapter). Its 12 references now read **Corruption & Taint**
  with no number, so they no longer look like a file — but they still name a chapter this PDF does not
  contain. Left as N4 left it.
- **The Foundry rulebook journal pack and the VOIDMARK RAG index still carry the deleted section.**
  `src/packs/rulebook/shared-core/24-advancement.json` and `data/voidmark-rules-index.json` both still hold
  a "Converting older Ghostwire material" entry. Clearing them means `raw-to-journals` +
  `build-packs rulebook` (LevelDB) and a VOIDMARK reindex, which this brief rules out. N4 already recorded
  that journals stay held for 0.4.0. **Follow-up when a journal-regen wave opens.**
- **The generated-file provenance comments stay** — `<!-- Ghostwire-Manuscript.md — GENERATED FILE. Do not
  edit by hand. Source: docs/manuscript/MANIFEST.yml … -->` and the equivalent from
  `inject-print-art.mjs`. They are HTML comments that never render, and they are the only thing telling a
  future editor not to hand-edit the build output.
- **`wire-opener` (Ch 23 filler) is still the one art gap** — 54/55 slots placed, same as N4. Not a
  blocker.
- **`docs/raw/00-INDEX.md`, `docs/manuscript/TOC.md`, `docs/rulebook/TOC-PROPOSAL.md` untouched** — none of
  them is a print MANIFEST input, and the brief says to keep internal references in director-only sources.

## Known flake

`tools/linkify-manuscript.mjs` intermittently dies with an access violation (exit `3221225477`) when
`build-pdf.mjs` spawns it — it crashed on two of five attempts and then ran clean six times in a row
standalone on the same input. Not caused by this wave's edits (the only tool change is one comment string).
**Workaround: re-run.** `node tools/build-pdf.mjs` exited **0** on the retry that produced the shipped PDF.

## Verify (all green)

| Check | Result |
|---|---|
| `node tools/build-pdf.mjs` | exit **0** (after one linkify retry) |
| PDF exists / size / `%%EOF` | 95,389,226 bytes · 316 pages · `%%EOF` present |
| `docs/directors` in assembled manuscript / with-links / print HTML | **0 / 0 / 0** |
| `Converting older Ghostwire` in assembled manuscript / with-links / print HTML | **0 / 0 / 0** |
| `docs/` anywhere in print inputs | **0** |
| `Bnn` ticket IDs in print inputs | **0** |
| Workspace (`C:\…`) paths in assembled manuscript | **0** |
| `Node Rating` in `docs/raw/24-advancement.md` | **0** |
| `Node Rating` in `docs/raw/21-the-wire.md` | **18** (preserved) |
| Node Rating by print chapter | Ch 0 ×2 (glossary + host E1–E4) · Ch 1 ×1 (roll vs) · Ch 23 Wire ×18 · Ch 26 Opposition ×2 · Ch 27 ×3 — none hero-framed |
| Print art | 55 slots · 54 placed · 1 gap (`wire-opener`) |
