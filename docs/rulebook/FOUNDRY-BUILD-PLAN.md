# Ghostwire Foundry Build Plan

**Living log** — update when a spike finishes.  
**Module:** `draw-steel-ghostwire` (stock system `draw-steel`; world + module architecture)  
**Repo:** https://github.com/dreamforge2361/draw-steel-ghostwire  
**Local clone:** `C:\Users\mfran\Dropbox\FoundryVTT\Data\modules\draw-steel-ghostwire`  
**Tooling split:** this assistant = design / prompts / review · Claude Code = multi-file module coding · Michael = approve small diffs, Foundry click-test, commits when ready

Related rulebook status: `docs/rulebook/STATUS.md`

---

## North star

1. Get **game data** into the module (Peoples, kits, classes, Wire/Veil/Machines as packs + lang).
2. Make **character creation** work in Foundry on stock Draw Steel (ancestry picker, class, kits, Ghostwire constraints like Cyborg Arcane Severance).
3. Keep other Foundry worlds safe: dedicated Ghostwire test world only.

---

## Done (as of 2026-09-16)

### Rulebook foundation
- [x] Stage 1 skeleton accepted
- [x] Class chapters 01–08 approved + DS terminology sweep (commit `e9ec975`)
- [x] All eight Peoples as DS creation-time ancestry packages (Mutant=Devil, Cyborg=Time Raider; commit `2cde39a`)
- [x] Kits chapter interim DS pass
- [x] SPECIES-DS-MAP + DS-ALIGNMENT doctrine locked
- [x] Economy v1 + Chrome v1 rulebook drafts (2026-09-16) — Michael review pending
- [x] Chrome master ingested to `docs/masters/GHOSTWIRE_CHROME_MASTER.md`

### Module / tooling bootstrap
- [x] Module repo exists; package id `draw-steel-ghostwire` v0.1.1
- [x] Depends on Foundry ≥14.367 + `draw-steel` ≥1.1.2
- [x] Loads `scripts/module.mjs`, `styles/ghostwire.css`, `lang/en.json` (incl. characteristic label remaps)
- [x] Git clone live under Foundry `Data/modules/` (old non-git skeleton renamed aside)
- [x] Claude Code installed, logged in, read-only dry-run succeeded
- [x] **B1** Pure Human signature — Detect the Supernatural (local `f88a8f0`)
- [x] **B2** Pure Human 3-point purchased traits (local `b5fcd69`)
- [ ] Push local Pure Human commits to GitHub (`main` ahead 2)
- [ ] Lang remaps: Culture→Background, Career→Profession (Class stays)

---

## Track A — Rulebook (still open)

| Item | Status | Notes |
|---|---|---|
| Stage 3 shared core (How to Play, characteristics, Power Rolls, combat basics) | **Todo** | DS reskin chapters |
| Economy chapter (`11-economy.md`) | **Drafted** 2026-09-16 | ¥5,000 + one free Kit; Availability bands; BP firewall; Michael review |
| Chrome chapter (`12-chrome.md`) + master ingest | **Drafted** 2026-09-16 | Body Integrity 20; grades; packages; Cyborg excluded; Michael review |
| Stage 4 Wire / Veil (minimal) / Machines | **Todo** | Forced by Hacker / casters / Wrench |
| Kits chapter full polish | Interim | After shared core if needed; reconcile Kit ¥ vs doctrine firewall |
| Cyborg System Crisis Director table | Optional | Pointer exists in Species |
| Veil entity-grade tables (old T-labels) | Later | Stage 4 cleanup |
| Lore/art harvest | Later | Stage 5 |

---

## Track B — Foundry game data (packs + lang)

Ship data **incrementally**. Each row should leave the module loadable.

| # | Spike | Status | Deliverable |
|---|---|---|---|
| B0 | Module shell | **Done** | module.json, init log, theme CSS, lang remaps |
| B1 | Pure Human signature | **Done** (local `f88a8f0`) | Detect the Supernatural grants on hero |
| B2 | Pure Human full ancestry (3 AP menu) | **Done** (local `b5fcd69`) | Point-buy purchased traits work in Foundry |
| B2b | Sheet labels Culture/Career | Todo | Culture→Background, Career→Profession; Class stays |
| B3 | Remaining Peoples (start Corran) | Todo | One People per spike preferred |
| B4 | Kits pack (v1 subset) | Todo | After ancestry path proven |
| B5 | Class content pack (start Operator) | Todo | Mirror Development Masters / rulebook 01 |
| B6 | Classes 02–08 | Todo | Same pattern as Operator |
| B7 | Wire / Veil / Machines lean packs | Todo | After Stage 4 rule text exists (or thin stubs) |
| B8 | Chrome / Body Integrity data | **Next after review** | Rule text drafted; Foundry Integrity resource + sample implants after Michael approves |

**Rule:** do not invent Foundry schemas that fight `draw-steel`. Read stock DS packs first; reskin/override/add module packs.

---

## Track C — Character creation (Foundry UX)

This is **separate** from “data exists in a pack.” Data first, then wire creation.

| # | Spike | Status | Deliverable |
|---|---|---|---|
| C0 | Dedicated Ghostwire test world | Todo | New world, system `draw-steel`, only this module enabled |
| C1 | Ancestry appears in hero creation | Todo | Pure Human selectable (or DS Human replaced/reskinned — decide in B1 investigation) |
| C2 | Ancestry point spend UI for purchased traits | Todo | Match DS ancestry-point picker behavior |
| C3 | Class selection uses Ghostwire class docs | Todo | After B5+ |
| C4 | Kit selection | Todo | After B4 |
| C5 | Chargen constraints | Todo | Cyborg Arcane Severance / class bans; Street Priest chrome ceiling; etc. |
| C6 | Sheet polish (Ghostwire labels already partially in lang) | Later | Don’t block C1 |

**Open design call (resolve during B1/C1):** replace stock DS ancestries in Ghostwire worlds vs ship parallel Ghostwire Peoples packs and hide/disable fantasy names via lang/filters.

---

## Track D — Safety & workflow

| Item | Status |
|---|---|
| Never edit other worlds/modules | **Standing rule** |
| Claude Code only in module clone folder | **Standing rule** |
| Don’t modify `Data/systems/draw-steel` | **Standing rule** (read-only reference) |
| Commit when Michael asks; no surprise pushes | **Standing rule** |
| Dropbox + git: pull before coding if unsure | Reminder |

---

## Suggested next 3 moves (narrow)

1. **Michael review** — Economy v1 + Chrome v1 (+ Chrome master). Resolve open questions (Kit ¥ vs doctrine firewall; starter gear vs ¥5,000).
2. **B8** — Foundry Body Integrity resource + sample implants (after review). Class packs after.
3. **B2b / B3 / C0** — lang remaps, remaining Peoples (eight Peoples rulebook done), or dedicated test world — pick one Foundry focus after B8 or in parallel.

---

## How we update this log

After each spike:
1. Check the box / flip Status.
2. Note commit SHA if pushed.
3. One line under **Changelog** below.

### Changelog
- **2026-09-16** — Plan created. Rulebook foundation marked done. Spike B1 (Pure Human signature) started as Claude Code learning exercise.
- **2026-09-16** — B1+B2 done locally: `f88a8f0` signature, `b5fcd69` 3-point menu. Sheet labels locked Background/Profession/Class. Next: push, B2b lang remaps, then Corran (B3).
- **2026-09-16** — Economy v1 + Chrome v1 drafts + Chrome master ingest. Eight Peoples Foundry/rulebook ancestry packages already done. Next: Michael review → B8 Integrity + sample implants → class packs.
