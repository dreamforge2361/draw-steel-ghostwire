# Spike B74 — Print title plate + front matter

**Status:** Done 2026-09-19  
**Bump:** module **0.3.3** (from 0.3.2 / B73)  
**Branch / PR:** same as B73 — `cursor/manuscript-assemble-gaps-f9b3` · https://github.com/dreamforge2361/draw-steel-ghostwire/pull/1  
**Journals:** **not** regenerated

## Goal

Replace title-page `CONTENT TBD` with a PDF-ready Ghostwire title plate; draft print credits + how-to-use; expand RAW Ch 0 (glossary already present) with abbreviations and a safety pointer. No invented lore, no fake artist names, no chrome ¥ / Rank 2+ summons, no journal regen.

## As built

### `docs/manuscript/00-front/title-page.md`
- Title **GHOSTWIRE**; harvested tagline (*ghosts, chrome, and the Machine* / *Break free… Run the Wire*).
- Subtitle: cyberpunk-fantasy setting **for the Draw Steel engine** (Ghostwire street; no Shadowrun name on the plate).
- World line: Ossian Reach / Veyra; product line *Draw Steel — Ghostwire Build*; version **v0.3.3**.
- Reserved cover-art hole; ART-STYLE nocturne note; **artist TBD — Michael**.

### `docs/manuscript/00-front/credits.md` (new)
- Author: Michael Frantz / dreamforge2361.
- Module vs system; © 2026; Creator License block (same wording as RAW Ch 0).
- Foundry VTT trademark line.
- Artist/plate table left **TBD** (maps path cited, no invented names).

### `docs/manuscript/00-front/how-to-use-this-book.md` (new)
- Print-only: lore vs RAW SoR; print reading order; safety → HTP Ch 1; In Foundry B68 pattern; ART-STYLE pointer; explicit non-goals.

### `docs/raw/00-front-matter.md`
- Print-vs-RAW sentence; session-zero pointer; **Abbreviations** table; In Foundry convention bullet. Glossary kept.

### Wiring
`MANIFEST.yml` + `assemble-order.txt` insert credits + how-to after title-page. `TOC.md` Front table. HTP leftover “Lifestyle will matter / until then” → points at `26`.

## Word counts

| Source | Before (B73 / 0.3.2) | After (B74) | Δ |
|---|---:|---:|---:|
| `00-front/title-page.md` | 28 | **279** | +251 |
| `00-front/credits.md` | 0 | **521** | +521 |
| `00-front/how-to-use-this-book.md` | 0 | **743** | +743 |
| **00-front/ total** | **28** | **1,543** | **+1,515** |
| RAW Ch 0 `00-front-matter.md` | 1,316 | **1,640** | +324 |
| Assembled manuscript | 151,605 | **153,448** | +1,843 |
| Assemble files included | 32 | **34** | +2 |

Assemble: **7** parts · **34** files · **0** missing · **0** `CONTENT TBD`.

## Remaining TBD (Michael)

- Cover / interior **artist names** and rights lines on the credits table.
- Actual cover file / Pandoc wrap (not this spike).
- Optional: more names on the thanks line.

## Still backlog (unchanged from B73 except #3–4)

Mods ~882; Languages 364; L2 vs L1 depth; Followers; buildings/ramming; Rank 2+ strikes; chrome package ¥; journal regen + PDF CSS.

## Checklist

- [x] Title plate has no `CONTENT TBD`
- [x] No fake artists
- [x] No DS Heroes paste; Creator License retained
- [x] No journal regen; no invented ¥ / Rank 2+ strikes
- [x] Assemble clean
- [x] module.json **0.3.3** UTF-8 no BOM
