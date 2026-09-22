# Ghostwire master backlog — triage 2026-09-22 (updated afternoon)

**Module now:** **0.3.92** on main.  
**Just shipped:** Ritual Working applet (0.3.91) via [PR #74](https://github.com/dreamforge2361/draw-steel-ghostwire/pull/74) and **Plot & Run** top-level Gear folder (0.3.92) via [PR #75](https://github.com/dreamforge2361/draw-steel-ghostwire/pull/75) — both awaiting Michael's Foundry smoke.  
**Next in flight:** Thursday PDF reprint; F2 ritual applet polish.  
**Playtest:** Deadhead Saturday; Quiet Floor after. Thursday PDF reprint from assembled manuscript.  
**Doctrine:** Claude Code on Allfather first; Cursor only if no choice.

---

## Now / in flight

| # | Item | Notes |
|---|---|---|
| N1 | ~~Mark Learned~~ | **DONE** 0.3.89 — right-click Formula → Mark learned / Mark unlearned + chat. |
| N2 | ~~Ritual Working applet~~ | **DONE** 0.3.91 — all players can open; the Formula owner who selects it is **Ritual Leader** (Project rolls, sealing roll, ¥); Pay Components off `system.hero.wealth`; Study and built-sanctum stages are stock Draw Steel Project Items. Smoke `node tools/ritual-working-smoke.mjs`; Foundry checklist `docs/directors/ritual-working-applet-smoke-0391.md`. |
| N3 | ~~Foundry smoke 0.3.88 rituals~~ | **DONE** — Michael signed off. |
| N4 | Thursday **PDF reprint** | `docs/manuscript/build/Ghostwire-Manuscript.md` (+ Appendix FAQ ch30). |

---

## Next Foundry pushes

| # | Item | Notes |
|---|---|---|
| F1 | ~~**Plot & Run** top-level Gear folder~~ | **DONE** 0.3.92 — `gwGearPlot000000` promoted to top level (sort 20000, after Weapons); source moved to `src/packs/gear/plot/`; lang key re-keyed `Gear.Folders.PlotRun` = “Plot & Run”. Gear pack rebuilt. |
| F2 | Ritual applet polish | Hung/fail, party-fund ¥, assistants, upkeep clocks. |
| F3 | Formula Item art | Beyond stock scroll icon. |
| F4 | ~~Pregen regenerate pipeline~~ | **DONE** 0.3.93 — `node tools/pregens-to-actors.mjs` is safe to re-run: portraits / Changer form art / class level from the ROSTER, installed matrix mods from `loadouts.json`, Taint + Corruption History from the new `docs/masters/pregens/post-patches.json`. Reproduces `src/packs/pregens/` byte for byte; Ward the Room stays learned on Kaïs / Vessa / Sabbat. Smoke: `node tools/pregen-regen-smoke.mjs`. |
| F5 | ~~Magical societies in Foundry + ¥250 pregens~~ | **DONE** 0.3.93 — **Magical Societies** folder in **Ghostwire Lore** with The Measure Collegium / The Wickkeepers / The Ash Survey (symbols + HQ plates + read-alouds, 0 art gaps); sources `docs/manuscript/01-lore/L6–L8`. All seven pregens start at **¥250** (`START_WEALTH`). Checklist: `docs/directors/magical-societies-foundry-smoke-0393.md`. |

---

## Adventure

| # | Item | Notes |
|---|---|---|
| A1 | **Quiet Floor (QF-01)** resume | Scene 1 + transit + Scene 2. |
| A2 | Deadhead post-Saturday pass | Into QF + template. |
| A3 | Run Comp folder ownership | Ongoing hygiene. |

---

## Systems

| # | Item | Notes |
|---|---|---|
| S1 | Ritual echelon gating | Hard vs soft Magnitude caps. |
| S2 | SR gear reskin | Arsenal / M&M / Rigger. |
| S3 | Broader SR References reskin | Sprawl Sites, Threats, etc. |
| S4 | ~~Sprite/Agent Lock A~~ | **DONE**. |
| S5 | Wired Console ↔ Journal research | 3-tier topic journals. |
| S6 | Director-only Voidmark lore filter | B122. |
| S7 | ~~Agent/Sprite/Spirit action-economy FAQ~~ | **DONE** 0.3.90 — `docs/raw/28-constructs-pets-faq.md`. |

---

## Gear / chargen
**G1** street-band auto-grants · **G2** armor/gadget mod families · **G3** lang + style tokens

## Art
**R1** inside-cover · **R2** round pregen tokens · **R3** B103 palette/gender · **R4** B89 Foundry token · **R5** Reach Events thumbs · **R6** wire-opener

## Lore
**L1** language gazetteer · **L2** Pandora wilds · **L3** cosmos art · **L4** Prime maps · **L5** criminal factions (+ all-Revenant) · **L6** news ticker

## Infra
**I1** Foundry 14.368 · **I2** chargen wizard · **I3** Deadfall module · **I4** Rideable replacement · **I5** old smoke debt

---

## Recently shipped
- **0.3.92** **Plot & Run** promoted to a top-level Ghostwire Gear folder
- **0.3.91** **Ritual Working applet** — five stages on linked Draw Steel Projects
- **0.3.90** S7 Constructs & Pets FAQ + Voidmark reindex (Appendix ch30)
- **0.3.89** Mark Learned / Unlearned on Ritual Formulas
- **0.3.88** Ritual Workings catalog + 46 Formula Items (smoke OK)
- **0.3.87** Deadhead Foundry push
- **S4** Lock A / B121 Constructs closed

---

## Suggested next pick
N2 and F1 are both shipped and waiting on Michael's Foundry smoke. Next: **N4 Thursday PDF reprint**, **F2 ritual applet polish** (hung/fail paths, party-fund ¥, assistant Project progress, ward upkeep clocks), **or** **A1 Quiet Floor** for the playtest path.

---

## Lore research queue (from 2026-09-22 Shadowrun inspiration brief)

Source: `docs/directors/lore-research/2026-09-22-shadowrun-inspiration-magical-factions.md` (proposal, not canon).

| # | Item | Notes |
|---|---|---|
| LR1 | ~~**Measure Collegium, Wickkeepers, Ash Survey**~~ | **LOCKED canon** 2026-09-22 — profiles + contacts (`2026-09-22-magical-societies-canon-three.md`) **and** symbol names, HQ names, layouts + art (`2026-09-22-magical-societies-symbols-hq.md`, locked 2026-09-22): True Measure / Datum House, Sheltered Wick / The Last Kettle, Held Fault / The Cinder Yard. **Shipped to Foundry in 0.3.93.** Open: exact atlas addresses; hooks stay optional. |
| LR2 | **Deepen existing gangs** (Ninth Ward Kings, Rust Saints, Glass Vipers, Metermen, Skinjobs, Nightshift; Hollow Men keep horror role) | **ADOPTED backlog** 2026-09-22 — seven-field template: income / service / dependent / forbidden / internal split / outside patron / current pressure. Do before minting new gang names. |
| LR3 | Who teaches magic outside corp employment? | Immediate lore gap |
| LR4 | Who maintains/pays neighborhood wards? | Rent, labor, gang power |
| LR5 | Magical society offer/demand sheets | Membership as recurring choice |
| LR6 | How institutions treat Resonance users, Revenants, magically implicated witnesses | Civil rights / testing / sanctuary |
| LR7 | Five–eight public Reach events (shared history template) | Near term |
| LR8 | Hold in reserve: Quiet Relay, First Ledger, Ninth Knot, Gilt Table, Closed Hand | Introduce when earned |

---

## Campaign chapter order (LOCKED 2026-09-22)

| # | Chapter | Status |
|---|---|---|
| 1 | **Deadhead** (Gold Line) | Shipped / playtest weekend |
| 2 | **Quiet Floor (QF-01)** | Resume after Deadhead |
| 3 | **Price of a Safe Night** | LOCKED after Quiet Floor — **new district** (not Mama's / Slackwater / Deadhead Gold Line path) to spread hive exposure; onstage Collegium / Wickkeepers / Ash Survey; canon TBD |

Source brief: `docs/directors/lore-research/2026-09-22-shadowrun-inspiration-magical-factions.md` (proposal until faction dossiers lock).

---

## District player journals (LOCKED ask 2026-09-22)

| # | Item | Notes |
|---|---|---|
| DJ1 | **Player-facing district lore cards** | For each district already visited (and future ones): culture, perspective, style, lived details. Sections: Rumors, Gangs, Police-like actions, Corporate rumors. Ship as Foundry Journal entries placeable on district maps as clickable Journal cards. |
| DJ2 | Template for district journal | Standard headings so every district card matches; Director-secret vs player page split if needed. |

