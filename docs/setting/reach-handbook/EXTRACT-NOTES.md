# EXTRACT-NOTES — GHOSTWIRE: The Ossian Reach Handbook

Extraction notes for `docs/setting/reach-handbook/`. Source (read-only, never copied into the
repo): `C:\Users\mfran\Dropbox\ai-brain\projects\draw steel\GHOSTWIRE — The Ossian Reach Handbook.pdf`
— 175 pages, no embedded TOC, no outline. Text pulled in a single PyMuPDF pass and cached to the
session scratchpad; chapter structure inferred from font sizes, running heads and page breaks.

## Inferred structure

The PDF has no TOC. Chapter breaks were inferred from the 54 pt full-bleed cover pages
(`Rajdhani-Bold`) that open each chapter, each preceded by a blank art page. Heading hierarchy was
inferred from point size:

| Size | Role | Rendered as |
| --- | --- | --- |
| 54 pt | chapter title (cover page) | `#` |
| 16 pt | chapter subtitle (cover page) | italic line under the `#` |
| 30 pt | chapter title repeated as a banner on p.4 | folded into the lede (not a heading) |
| 22 pt | NPC tier band | `##` (tier label stripped — see scrub) |
| 18 pt | gazetteer location name | `##` |
| 17 pt | primer section | `##` |
| 15.5 pt | creature name | `###` |
| 15 pt | NPC/critter group heading | `##` in ch. 17, `###` in ch. 16 |
| 14.5 pt | NPC name | `####` |
| 12.5 pt | `PLAYER DESCRIPTION` / `DIRECTOR'S SECTION` | `###` |
| ~10–11 pt bold | `KEY NPCS` / `SECURITY` / `THE OVERLAY` / `PLOT HOOKS` / `THE MENU` | `####` |

Blank (art-only) pages: 1, 2, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120, 132.

### Inferred TOC, page ranges and folder mapping

| # | File | Book pages | Book's own title | Folder |
| --- | --- | --- | --- | --- |
| 01 | `01-what-the-flats-are.md` | 3–4 | THE FLATS / "What the Flats Are" | Front |
| 02 | `02-the-vertical-and-the-black-water.md` | 4–7 | (sections of the primer chapter) | Strata |
| 03 | `03-life-on-the-flats.md` | 7–11 | (sections of the primer chapter) | Flats |
| 04 | `04-switchboard.md` | 13–23 | SWITCHBOARD | Flats |
| 05 | `05-the-neon-shambles.md` | 25–35 | THE NEON SHAMBLES | Flats |
| 06 | `06-the-stacks.md` | 37–47 | THE STACKS | Flats |
| 07 | `07-slackwater.md` | 49–59 | SLACKWATER | Flats |
| 08 | `08-the-interchange.md` | 61–71 | THE INTERCHANGE | Flats |
| 09 | `09-cinder-market.md` | 73–83 | CINDER MARKET | Flats |
| 10 | `10-the-spillway.md` | 85–95 | THE SPILLWAY | Flats |
| 11 | `11-glasshook.md` | 97–107 | GLASSHOOK | Flats |
| 12 | `12-wireside.md` | 109–119 | WIRESIDE | Flats |
| 13 | `13-gallows-end.md` | 121–131 | GALLOWS END | Flats |
| 14 | `14-cinderhold-and-the-outer-gate.md` | 133–143 | CINDERHOLD & THE OUTER GATE | Cinderhold |
| 15 | `15-the-night-roster.md` | 144–149 | THE NIGHT ROSTER | Flats |
| 16 | `16-npcs-of-the-reach.md` | 150–166 | NPCS OF THE REACH | Threats |
| 17 | `17-critters-of-the-reach.md` | 167–175 | CRITTERS OF THE REACH | Threats |

### Deviations from a strict one-file-per-chapter split

* **The primer chapter (pp. 3–11) was split into three files** along its own `##` section
  boundaries, in book order, so it could serve both the `Front` and `Strata` folders. Chapter 01
  carries the book's own section title "What the Flats Are" plus the chapter lede. Chapters 02
  ("The Vertical & the Black Water") and 03 ("Life on the Flats") carry **editorial titles** — the
  book gives no titles at that level. Their `##` sections are the book's own headings, verbatim.
  Chapter 02 holds "Getting To & From the Flats" and "The Black Water" (both pure vertical-strata
  material); chapter 03 holds Culture & Recent History, Attitudes & Factions, Common Services,
  The Wired, The Gangs & Factions, and Director Plot Hooks.
* **No `Grid` chapter exists.** This book is the *Flats* handbook; the Grid appears only as the
  stratum above, described inside chapter 02. The `Grid` folder gets no entry.
* **No `Maps` chapter.** The book's art pages carry no text (all 13 art pages extract empty). A
  separate agent owns art extraction; the `Maps` entry is deliberately omitted from
  `chapters.json`.
* Chapter titles are title-cased from the book's ALL-CAPS display type; wording is unchanged.

## Rules scrub — what was removed and why

68 scrub actions logged. Nothing was rewritten; text was only removed or a cross-reference
stripped in place.

### Chapters 01–15 (lore) — four edits total

* `02-the-vertical-and-the-black-water.md` — "an ascension rig (T3, ~¥2,000)" → "(~¥2,000)".
  Obsolete gear-tier ladder.
* `03-life-on-the-flats.md` — "A survival-money job (Tier 5) pays ¥400–800" → parenthetical
  removed. Obsolete job-tier ladder.
* `03-life-on-the-flats.md` — services table, "Street-grade (Availability 5)" → parenthetical
  removed. Obsolete availability ladder.
* `03-life-on-the-flats.md` and `12-wireside.md` — one italic pointer line **added** at the top of
  the Wired section / chapter (see "Not carried over", below).

Everything else in chapters 01–15 is verbatim. A word-inventory diff of pp. 1–149 against the
output shows loss of exactly the three scrubbed tokens above (`tier`, `availability`, `or`) plus
one PDF glyph artefact — no prose was dropped.

### Chapter 16 — NPCs of the Reach

* **21 stat blocks removed** (every `THREAT / STA / ATK / ATTR / TRAITS / MALICE / FS` run),
  each replaced with a single line: `*Stats: see the Ghostwire Bestiary.*`
* **Tier-band headings de-laddered:** `TIER 5 — RECRUITS, MOOKS & STREET FIXTURES` →
  `## Recruits, Mooks & Street Fixtures`; `TIER 4 — TRAINED FIELD ASSETS` →
  `## Trained Field Assets`; `TIER 3 — MID-BOSS THREATS` → `## Mid-Boss Threats`. The book's own
  band names are kept; only the reversed-Tier ladder label is gone.
* **"READING THE BLOCKS" heading and its key paragraph dropped** (`THREAT is Tier · Role ·
  [Species]`, `STA is Stamina (Winded in parens)`, etc.) — pure block-reading instructions for a
  stat format that no longer ships. The two surviving lore sentences of that section became the
  chapter lede.
* **Sentences dropped from tier intros and HOOK lines** where they carried combat math:
  "Standard T5 attack score +5; no tier damage rider; Speed 5."; the T4 and T3 equivalents;
  "Elites and Leaders spend Malice."; "Every block is Elite, Leader, or Solo and spends Malice…";
  "They break the moment their Winded leader falls…"; "Drop her and the whole crew's morale rule
  flips back on."; "Drone Rating per §D5."; "Kill the RCC operator (the Tier-4 Wrench Rigger)…";
  "The Tier-4 brain behind the Tier-5 flight…"; "…111 Stamina is a grind unless the crew cuts the
  reinforcements first."; "In meat-space it is almost defenseless (Phy 2)…"; "Cut it off from the
  node, or drown under 111 Stamina and endless sprites."
* **Rules cross-references stripped in place** so the surrounding sentence survives: `(Ch. 32 /
  32b)`, `(§D2)`.
* The italic one-line descriptor under each NPC name ("*the gang's cybered heavy*") and every
  HOOK that carried no math are kept verbatim. Species tags that lived only inside the `THREAT`
  line (`[Human]`, `[Cyborg]`, `[Mutant Human]`) went with the stat block.

### Chapter 17 — Critters of the Reach

* **13 stat blocks removed** (`THREAT / STA / SPD / ATK / Signature`), replaced with
  `*Stats: see the Ghostwire Bestiary.*`
* Where the creature matches a shipped bestiary Actor, the line names it in plain text for a
  later linking pass: **Chrome-Rat, Tunnel-Bat, Scrap-Hound, Sink-Crawler, Gutter-Serpent,
  Canopy-Stalker, Reach Behemoth, Watchdog ICE, Scrambler ICE, Black ICE** (10 of 13).
  Data-Sprite, Wisp and Ghost-in-the-Wire have no exact shipped Actor and get the unqualified
  line — deliberately *not* mapped onto the bestiary's `Ghost`, which is a different creature.
* **"READING THE BLOCKS" heading and key paragraph dropped**, same reasoning as ch. 16; the lore
  sentences became the chapter lede. Dropped: "Stat blocks are lightweight — a role, a threat
  rating, the numbers a Director needs mid-scene…" and "All numbers derive from the ratified
  Adversary framework; reversed-Tier as always, where Tier 5 is a nuisance and Tier 1 is a
  nightmare."
* **Cross-references stripped in place:** `(Ch. 32 / 32c)`, `(Ch. 32c)` (this one preserved the
  Sprawl Cur / Scrap-Hound ecology sentence), `(32b.5)` ×2.
* **One editorial line added** at the end of the chapter naming the bestiary Actors the Handbook
  does *not* describe (Vermin Swarm, Feral Beast, Jungle Predator, Chrome Raider Armiger, Chrome
  Raider Hijack, Ghost, Ghoul, Zombie, Skeleton, Veil Cultist), so the linking pass knows the
  gap is real and not an extraction failure. It is clearly marked as an editorial note.
* All ecology and lore voice is kept: the Prime / the Wild / the Wire framing, the
  `Species/Type:` tag lines (no numbers in them), the descriptive paragraphs and the HOOKs.

## Not carried over

* **The matrix / Wired node gazetteer.** The Handbook does **not** contain a node-by-node matrix
  gazetteer, so nothing had to be cut. Its Wired coverage is (a) the primer's topology section
  ("The Wired — the Overlay, the Deep Net, and the Thin Place", ch. 03) and (b) a per-location
  `THE OVERLAY (what the Wired shows here)` block attached to each physical site. Both are
  site-specific and complementary to `docs/setting/wired-flats-gazetteer.md`, which owns the 19
  Echelon-rated node write-ups shipped as the B46 **Wired: Flats** journal pack, so both were
  kept. One italic pointer line was added in each of the two places where a reader would
  otherwise go looking for node write-ups: the top of ch. 03's Wired section and the top of
  ch. 12 (Wireside, the data-slums district). No node write-up is duplicated in this pack.
* **Running heads, footers and page furniture:** `OSSIAN REACH // THE FLATS`,
  `OSSIAN REACH // FIELD GAZETTEER`, `THE OSSIAN REACH HANDBOOK`, `GHOSTWIRE // THE FLATS`,
  `GAZETTEER`, and the bare per-location index digits (1–10) printed beside each location name.
* **Art pages.** All 13 blank pages extract as empty; nothing was lost.

## Known quirks in the source

* **p. 56, "Kesh Oraya"** — one glyph in this NPC name has no Unicode mapping and extracts as
  `U+0000`. Verified against a 600 dpi render of the page: the printed name is "Kesh Oraya" and
  the null byte is a kerning artefact. Stripped.
* **Duplicated locations.** The book itself repeats three venues across chapters, and both
  copies are kept because the text differs: *Marrow's Lantern* (ch. 14 Cinderhold p. 136 and
  ch. 15 Night Roster p. 149); *Velvet Stair* (ch. 05 p. 32) vs *Obsidian's Velvet Stair*
  (ch. 15 p. 146); *The Deadline* (ch. 13 p. 127) vs *The Dead Line* (ch. 15 p. 145 — a different
  place, Cassavir's bar).
* **`THE OVERLAY` sub-heading normalised.** The parenthetical "(what the Wired shows here)" is
  set in a smaller run and, on 50 of 115 locations, extracts detached or space-less. All 115 are
  emitted as `#### The Overlay (What the Wired Shows Here)`.
* **Layout.** Gazetteer pages are two-column (player-facing left, Director-facing right);
  columns were split at x = 500 pt and read left-then-right. Primer pages are single-column with
  three-column price/attitude tables at x = 54 / 363 / 544, emitted as markdown tables.
* **No page failed to extract.** Every non-blank page produced text; paragraph reflow re-joined
  hard-wrapped lines and 40-odd paragraphs that continued across a page break.

## Totals

17 chapter files, ~91,100 words. Source text on pp. 1–149 is reproduced essentially verbatim
(word-inventory diff: 3 scrubbed tokens); pp. 150–175 lose ~2,340 words of stat-block and
block-reading text by design.
