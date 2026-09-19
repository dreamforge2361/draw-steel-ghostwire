# Spike B93 — Appendix B Character Generation Cheat Sheet

**Date:** 2026-09-19  
**Module:** 0.3.18  
**Status:** Done — print appendix, journals **not** regenerated  
**Authority:** Michael 2026-09-18 — Foundry-first punch-list, not a second rules chapter

## Goal

A colorful, 1–2 page (hard max 3) **Foundry-first** checklist for making a runner on the Hero sheet. Chargen is clicks on the sheet + Ghostwire packs, with pointers into RAW.

## Page budget

| Target | Hard max | Intent |
|---|---|---|
| **1–2** print pages | **3** | Dense punch-list; remap strip + Done-when box; no chrome chapter, no skill reprint |

Word count of `29-chargen-cheat-sheet.md` should stay in the ~700–950 band so letter + 10.5pt print CSS lands near two pages.

## Locks

- Venue: Foundry VTT + **Draw Steel - Ghostwire Build** (`draw-steel-ghostwire`). System package `draw-steel` OK as software only. World *Ghostwire - the Reach* / `ghostwire-v2` optional only.
- Sheet remaps (Foundry labels, not a rules cite): Culture→**Background**, Career→**Profession**, Ancestry→**People**, Class stays Class.
- Characteristics: **Physique / Reflex / Logic / Instinct / Persona**. Array **2, 2, 1, 1, 0** from `02`.
- Step order from `docs/raw/02-heroes-characteristics.md`, adapted to Foundry clicks (6–7 = characteristics + remaining sheet fields).
- Firewall: ¥ never buys characteristics / skills / class power. Chrome = ¥ + Integrity later. No auto chrome. Start ¥5,000. Integrity 20 except Cyborg.
- Caster Soft-cap (5 Integrity on chrome): one checkbox only.
- **B92 stand-alone print:** no Draw Steel / Heroes / §F* procedure cites. Steps point only at Ghostwire chapters + Hero-sheet actions. Module name once in the In Foundry venue line.
- B78 / B83: no external IP name-checks.
- Journals **not** regenerated.

## Shipped

- `docs/manuscript/04-back/29-chargen-cheat-sheet.md` — Appendix B
- Wired: `TOC.md` Part VI, `MANIFEST.yml`, `assemble-order.txt` (after Glossary / Ch 28)
- Cross-links: print how-to-use + RAW `02` In Foundry sidebar
- Print CSS: remap chips, firewall, Done-when, GFM checkboxes (`tools/lib/md-to-html.mjs`)
- `module.json` **0.3.18**

## Out of scope

- Journal regen
- Inventing sheet menus
- Chrome catalog / Kit reprint / skill tables
