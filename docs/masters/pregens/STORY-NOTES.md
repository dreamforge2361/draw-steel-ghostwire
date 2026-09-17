# Story extraction notes — `dossiers-extract.txt` → `stories/`

Source: `docs/masters/pregens/dossiers-extract.txt` (4344 lines, PDF text dump of
*GHOSTWIRE — Dossiers & Fiction*). Eight origin stories recovered verbatim as markdown
in `docs/masters/pregens/stories/`.

## Method

Mechanical reflow only — no rewriting. Per story:

- Dropped the running header/footer line `GHOSTWIRE // deniable-contractor field dossiers <page#>`
  (the page number lives on that same line, so no separate page-number lines exist).
- Dropped the form-feed (`\x0c`) page-break characters.
- Joined hard-wrapped lines into paragraphs; blank lines separate paragraphs.
- Re-joined paragraphs that a page break split mid-sentence (detected as a post-page-break
  fragment beginning with a lowercase word).
- Scene breaks rendered as `* * *`. The source marks them only with extra vertical space
  (two blank lines within a page) — there is no glyph separator in the PDF.
- Added an H1 (story title) and two italic lines: a roster byline (hero — class · ancestry)
  and the source's own standfirst line (`A GHOSTWIRE story · …`). Everything below those is
  source text.

Verification: after stripping all whitespace, each output file's body is byte-identical to the
corresponding source region with headers/page-breaks removed. All eight verified MATCH.

No hyphenation-across-line-break artifacts exist inside any story region (the single
line-terminal hyphen in the file, line 4009, is in a stat-sheet appendix).

Stat sheets ("Pregen Character Sheet — …", Tier 5 math), the `Dossier — …` Director-facing
bullet notes, the table of contents (lines ~196–236) and the world/lore front matter
(lines 1–480) are all excluded.

## Per-story

| # | File | Source lines (prose) | Words | Paragraphs | Scene breaks |
|---|------|----------------------|-------|-----------|--------------|
| 1 | `01-the-lamp-on-ninth.md` | 486–686 | 2193 | 42 | 4 |
| 2 | `02-rain-on-the-glass-tier.md` | 986–1084 | 1326 | 21 | 0 |
| 3 | `03-serial-number.md` | 1359–1476 | 1318 | 25 | 2 |
| 4 | `04-the-weight-of-the-word.md` | 1773–1897 | 1645 | 22 | 0 |
| 5 | `05-the-long-sight.md` | 2244–2328 | 988 | 19 | 0 |
| 6 | `06-the-dead-frequency.md` | 2688–2770 | 1050 | 16 | 0 |
| 7 | `07-nine-ways-out.md` | 3183–3315 | 1666 | 27 | 0 |
| 8 | `08-turn-their-own-guns-around.md` | 3766–3884 | 1403 | 26 | 0 |

Title / standfirst lines sit immediately above each prose range (e.g. 484–485 for story 1;
story 8's standfirst wraps across 3764–3765). Word counts are prose-body words as written to
the file, excluding the H1 and the two italic lines.

### 1 — The Lamp on Ninth (Vessa Corran-Dov)

- **Closing epigraph included, flagged.** Source lines 681–685 (53 of the 2193 words) are an
  indented pull-quote: *"The Machine gives you everything and asks you for nothing…" —
  attributed to the Preacher of Ninth*. It sits after the story's last line and before the
  Director-facing `Dossier —` bullets, so it is in-world fiction rather than rules text; it is
  rendered as a blockquote after a `* * *`. **If the intent was story prose only, delete the
  final blockquote.** No other story in the anthology carries such a quote.
- Scene breaks at: "The first one through the door was Tomas.", "She did not heal his mother.",
  "Mama Cassavir found her on the walk back…", and before the epigraph.

### 3 — Serial Number (KRV-9 "Krow")

- Scene breaks at "He walked out of the corp arcology on a Tuesday…" and
  "Down in the Warrens, KRV-9 — Krow — stood his post…".

### 4 — The Weight of the Word (Barak Voss-Hallor)

- **Unresolved artifact, kept verbatim.** Source line 1837 reads:
  `Barak did not move fast. He simply stopped being warm. — "HAND." The single word came up out of him…`
  The bare ` — ` before `"HAND."` is almost certainly PDF layout residue from a display-type
  callout (the word "HAND." set large in the printed page), not authored punctuation. Left
  exactly as the extract has it rather than silently dropping the dash. If the page layout is
  available, confirm and delete the stray dash.

## Known ambiguities (all stories)

- **Scene breaks coinciding with page breaks are undetectable.** The extract renders a page
  break as 3–4 blank lines plus the running header, and a scene break as 2 blank lines. Where
  a paragraph boundary falls on a page break, there is no way to tell from the text dump
  whether the author also intended a scene break there, so none was inserted. Affected
  boundaries (rendered as ordinary paragraph breaks):
  - Story 1: before "Her Conviction was low this morning…", before `"System. I know."`,
    before "A pause. Even the rain seemed to hold it.", before `"Never thought it was,"`
  - Story 5: before "She keyed her throat-mic."
  - Story 7: before `"Contact," Cassavir said…`, before "The change came as a free thing…"
  - Story 8: before `"Cameras are mine,"`, before "So he bit back."
- **Paragraphs re-joined across page breaks** (continuation began lowercase — high confidence,
  but listed for audit): story 2 ×1 ("That was the old | tool, the built-in one…"), story 3 ×2
  ("…and he kept walking | until the arcology was just a bright tumor…", "I would like the wall | to be
  yours, Mama."), story 4 ×2 ("…the way another man used a | smile — to open the door…", "…a smaller, | more nervous
  operator never could…"), story 6 ×1 ("…cheap armor under a | courier's jacket…"). The `|`
  marks the page boundary.
- **Name spelling.** The roster supplied for this task spells hero 2 "Kaës Vahn-Estal"; the
  extract consistently spells him **Kaïs** (i-diaeresis). Prose is verbatim, so the story uses
  Kaïs, and the byline was set to Kaïs to match. **Resolved in B44b: Kaïs is the locked spelling
  book-wide** — Actor name, lang, ROSTER and BUILD-NOTES all normalised.
- No mojibake or garbled characters were found in any story region — em dashes (—), middots
  (·), i-diaeresis (ï) and curly-free straight quotes all came through the PDF dump intact.
- No story is truncated and none is interleaved with stat-sheet text; every story runs
  uninterrupted from its standfirst to its last line, with the sheet beginning on the next page.
