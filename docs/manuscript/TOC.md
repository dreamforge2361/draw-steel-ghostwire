# Ghostwire Print Manuscript — TOC

**Status:** Matches LOCKED recommended TOC in `docs/rulebook/TOC-PROPOSAL.md` (2026-09-18)  
**Assemble:** `docs/manuscript/MANIFEST.yml` → `tools/assemble-manuscript.mjs`  
**Source key:** `raw:` → `docs/raw/<file>` · `lore:` → `01-lore/` · `NEW` → manuscript · `front:` → `00-front/`

Lore harvest is **pre-rules** (not in the locked 5-part rules TOC). Rules Parts I–V match the lock exactly. Lifestyle & Downtime body lives in `docs/raw/26-lifestyle-downtime.md` (B67). Print title / credits / how-to-use assemble before lore (B74).

---

## Front (print-only; before lore)

| # | Print title | Source |
|---|---|---|
| — | Title plate | `front:` `00-front/title-page.md` — draft B74; cover art hole reserved (artist TBD) |
| — | Copyright & Credits | `front:` `00-front/credits.md` — Michael Frantz / dreamforge2361; DS + Foundry attribution; no invented artists |
| — | How to Use This Book | `front:` `00-front/how-to-use-this-book.md` — rules SoR vs lore; safety → HTP; In Foundry pattern |

---

## Lore harvest (pre-rules)

| # | Print title | Source |
|---|---|---|
| L1 | Setting Primer (Core Sourcebook harvest) | `lore:` `01-lore/L1-setting-primer.md` — harvested B65 (~33k words); not a stub |
| L2 | Peoples & World (Lore Book harvest) | `lore:` `01-lore/L2-peoples-and-world.md` — harvested B65 (~3.8k); thinner than L1, PDF-depth OK |
| L3 | Ossian Reach / Street Color (optional harvest) | `lore:` `01-lore/L3-ossian-reach-color.md` — harvested B65 (~6.4k); optional street color, not a gazetteer reprint |

---

## Part I — Core Rules

| Ch | Print title | Source |
|---|---|---|
| 0 | Front Matter, License, Glossary | `raw:` `00-front-matter.md` |
| 1 | How to Play | `raw:` `01-how-to-play.md` |
| 2 | Heroes & Characteristics | `raw:` `02-heroes-characteristics.md` |
| 3 | Tests & Power Rolls | `raw:` `03-tests-power-rolls.md` |
| 4 | Combat | `raw:` `04-combat.md` |
| 5 | Advancement & Echelons | `raw:` `24-advancement.md` — Stage 3 fill / B73 *(print order earlier than filename)* |

---

## Part II — Peoples & Making a Hero

| Ch | Print title | Source |
|---|---|---|
| 6 | Ancestries (The Peoples) | `raw:` `05-ancestries.md` |
| 7 | Backgrounds & Professions | `raw:` `06-backgrounds-professions.md` — Stage 3 play procedure / B73 |
| 8 | Languages | `raw:` `07-languages.md` — Stage 3 chargen/play fill / B75; lore gazetteer still backlog #67 |
| 9 | Kits, Gear & Wealth (¥) | `raw:` `08-kits-gear-wealth.md` |
| 10 | Lifestyle & Downtime | `raw:` `26-lifestyle-downtime.md` — draft (Stage 3 fill / B67, 2026-09-18) |
| 11 | Chrome & Body Integrity | `raw:` `09-chrome-body-integrity.md` — draft (implant ¥ catalog / B71, 2026-09-18) |
| 12 | Mods | `raw:` `10-mods.md` — Stage 3 procedure fill / B75; Invent a Mod still locked; no armor/gadget SKUs |
| 13 | Perks | `raw:` `11-perks.md` |

---

## Part III — Classes

| Ch | Print title | Source |
|---|---|---|
| 14 | Operator | `raw:` `12-operator.md` |
| 15 | Scout | `raw:` `13-scout.md` |
| 16 | Commander | `raw:` `14-commander.md` |
| 17 | Medic | `raw:` `15-medic.md` |
| 18 | Wrench | `raw:` `16-wrench.md` |
| 19 | Elementalist | `raw:` `17-elementalist.md` |
| 20 | Street Priest | `raw:` `18-street-priest.md` |
| 21 | Hacker | `raw:` `19-hacker.md` |
| 22 | Technomancer | `raw:` `20-technomancer.md` |

---

## Part IV — Systems

| Ch | Print title | Source |
|---|---|---|
| 23 | The Wire | `raw:` `21-the-wire.md` — **RAW-locked** B66 (2026-09-18) |
| 24 | The Veil | `raw:` `22-the-veil.md` |
| 25 | Machines (Drones & Vehicles) | `raw:` `23-machines.md` — Buildings remain Wrench stub for v1 |

---

## Part V — Directors

| Ch | Print title | Source |
|---|---|---|
| 26 | Opposition | `raw:` `25-opposition.md` — draft (Stage 3 fill / B70, 2026-09-18); not lore bestiary |
| 27 | Running Ossian Reach (pointer) | **NEW** `03-directors/27-running-ossian-reach.md` — Stage 3 pointer fill / B73; Handbook + Wired Flats + L3 by reference; **no lore reprint** |

---

## Part VI — Appendix

| Ch | Print title | Source |
|---|---|---|
| 28 | Glossary of Slang & Setting Jargon | **NEW** `04-back/28-glossary-slang.md` — B77; Runner = Ghost Runner coin; street/Wired/Veil slang |


## Notes

- Print numbering may differ from `docs/raw/` filenames (Advancement = print Ch 5 / file `24-advancement.md`). Journals keep raw filenames.
- Optional fold (TOC-PROPOSAL): skip print Ch 10 and Ch 27 — **not** applied; Ch 10 points at raw `26`; Ch 27 is a Stage 3 pointer (B73), not a gazetteer.
- `00-INDEX.md` is meta only — **not** a print chapter.
- Wire (`21-the-wire.md`) **RAW-locked** 2026-09-18 (B66).
- Lifestyle (`26-lifestyle-downtime.md`) **draft Stage 3 fill** 2026-09-18 (B67); journals **not** regenerated.
- Opposition (`25-opposition.md`) **draft Stage 3 fill** 2026-09-18 (B70); journals **not** regenerated.
- Chrome (`09-chrome-body-integrity.md`) **implant ¥ + Availability catalog** 2026-09-18 (B71); journals **not** regenerated.
- Advancement (`24-advancement.md`) + Backgrounds (`06-backgrounds-professions.md`) **Stage 3 fill** 2026-09-19 (B73); journals **not** regenerated.
- Running Ossian Reach (`03-directors/27-running-ossian-reach.md`) **Stage 3 pointer fill** 2026-09-19 (B73); no lore reprint; journals **not** regenerated.
- Print front (`00-front/title-page.md`, `credits.md`, `how-to-use-this-book.md`) **draft** 2026-09-19 (B74); art credit = Ghostwire AI (B76 follow-on / 0.3.6); journals **not** regenerated.
- Mods (`10-mods.md`) + Languages (`07-languages.md`) **Stage 3 procedure fill** 2026-09-19 (B75); armor/gadget families and language gazetteer **not** invented; journals **not** regenerated.
- Lifestyle Contacts stub **pointer polish** 2026-09-19 (B75); full Followers chapter still v1 non-goal.
