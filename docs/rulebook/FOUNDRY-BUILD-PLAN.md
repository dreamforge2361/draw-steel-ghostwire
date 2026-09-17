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
- [x] Gear master ingested + DS ALIGNMENT OVERRIDE
- [x] Mods chapter locked (`14-mods.md`) — Invent a Mod; echelon remap
- [x] ART-STYLE brief locked
- [x] Backgrounds & Professions v1 (`13-backgrounds-professions.md`)

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
| Mods chapter (`14-mods.md`) | **Locked** 2026-09-16/17 | Invent a Mod; echelon gear remap; §Craft skills |
| ART-STYLE (`ART-STYLE.md`) | **Locked** 2026-09-16 | Visual brief for PDF/Journal art |
| Gear master ingest | **Done** | `GHOSTWIRE_GEAR_MASTER.md` + DS ALIGNMENT OVERRIDE |

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
| B8 | Chrome / Body Integrity data | **Done** (pack shipped) | Chrome pack with Integrity costs + provisional ¥ |
| B21 | Scout class pack | **Pending Michael test** | Scout (Advantage) + Hunter / Ghost / Face-in-crowd in Ghostwire Classes; mirrors Operator; module v0.1.25 |
| B22 | Ghostwire Perks pack | **Pending Michael test** | 47 reskinned perks by type; perk grants list Ghostwire perks only; `17-perks.md`; module v0.1.26 |
| B23a | Matrix Verbs + Overlay / Jacked In on the sheet | **Done** (`53a4b59`) | 9 verbs on every hero; token statuses; `18-wired-foundry.md`; module v0.1.27 |
| B23b | Wired Console | **Done, pending Michael test** | ApplicationV2 console: connection roster, Scene nodes (`wiredBoard` flag), Integrity, Trace Alert, reveal to players; module v0.1.28 |
| B24 | Commander class pack | **Done** (`d336ea7`, Foundry-verified 2026-09-16) | Commander (Influence) + Street-Fixer / Corp-Exec / Bard in Ghostwire Classes; DS Tactician spine; class label **Commander only** (no “Face”); module v0.1.29 |
| B25 | Languages CONFIG remap | **Done** (Foundry-verified 2026-09-16) | All 42 DS language keys relabeled with locked Ghostwire names (`scripts/languages.mjs`, `GHOSTWIRE.Languages.*`); keys unchanged; module v0.1.30 |
| B26 | Medic class pack | **Done** (Foundry-verified 2026-09-16) | Medic (Reagents, **persist across encounters — turnGain "0", no reset at combat start**) + Street-Doc / Corp-Medtech / Ripperdoc in Ghostwire Classes; DS Troubadour spine; module v0.1.31 |
| B27 | Wrench class pack | **Done** (Foundry-verified 2026-09-16) | Wrench (Uptime, turnGain "1" v1 baseline) + Drone Jockey / Vehicle Rig-Pilot / Facility Rigger in Ghostwire Classes; DS Talent spine, psionics scrubbed; machines inventory still backlog; module v0.1.32 |
| B19 | Full gear import | **In progress / pending verify** | Gear master → Foundry gear pack; Kit-qualifying subset already shipped; Claude owns `src/packs` JSON |
| B20 | Mods expansion + Invent a Mod | **Pending** | Align Mods pack to `14-mods.md`; armor/gadget families; Claude owns packs |

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

1. **B19** — verify / finish full gear import from Gear master (Claude; do not thrash pack JSON from docs agents).
2. **B20** — Mods pack expansion + Invent a Mod alignment to `14-mods.md` (echelon not tier).
3. **Delivery** — PDF + Foundry Journal from `docs/rulebook/`; ART-STYLE locked. Parallel: remaining Peoples / class packs / C0 test world.

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

- **2026-09-16/17** — Mods chapter locked (`14-mods.md`); Invent a Mod; §Craft skill cleanup; Gear master DS ALIGNMENT OVERRIDE (echelon + Availability; no player-facing Item Tier). ART-STYLE locked. B19 gear import / B20 mods = next Foundry (Claude). Delivery = PDF + Journal.

### Rulebook delivery (locked 2026-09-16)
- Masters under `docs/masters/` are SoR (including `GHOSTWIRE_GEAR_MASTER.md`).
- Final product ships as: (1) PDF rulebook built from `docs/rulebook/` + masters, (2) Foundry **Journal** compendium pack with the same chapters as in-world rulebook.
- Gear/mods/economy numbers come from the Gear master; player-facing text uses **Echelon 1–4 + Availability** (Street→Prototype). Legacy Item Tier columns = gear grade only (price / Avail / mod slots) — see Gear master OVERRIDE + `14-mods.md`. **§Craft ≠ skill.**

### Backlog — Stage 4 Wire (2026-09-16)
- [ ] Extract **The Wire (Matrix)** from Hacker into standalone rulebook chapter (`17-wired.md`)
- [ ] Anyone-vs-Hacker gap + Gear Cat 4 deck alignment + Chrome BI pointer fix
- [ ] Foundry Wire pack only after chapter approval

### B19 / B20 (Foundry-verified 2026-09-16)
- [x] **B19** Full Gear master Categories 1�6 into packs: gear, mods, matrix, vehicles, foci (module v0.1.24)
- [x] **B20** Mods expansion (armor/gadgets/weapons/vehicles) + �Craft skill text � Michael verified working

### B21 Scout (2026-09-16)
- [ ] **B21** Scout class pack from `02-scout.md`: class, Hunter / Ghost / Face-in-crowd, signatures, 3/5/7/9/11 bands, level 1–10 features; Chrome/Optics keywords; Advantage costs enforced in combat (module v0.1.25) — **pending Michael Foundry test**

- [x] **B21** Scout class pack � Foundry-verified 2026-09-16 (Advantage; Hunter/Ghost/Face-in-crowd)


### B22 Perks (2026-09-16)
- [ ] **B22** Ghostwire Perks pack: all 47 Draw Steel perks reskinned, folders by perk type, 3 perk abilities cloned; level-up perk grants list only Ghostwire perks filtered by `perkType`; Draw Steel perks refused on drop and removed from the registry; `docs/rulebook/17-perks.md` (module v0.1.26) — **pending Michael Foundry test**

### B23a Wired on the sheet (2026-09-16)
- [x] **B23a** Matrix Verbs (9, Wired keyword) granted to every hero + one-time grant for existing heroes; Overlay / Jacked In token statuses set by Connect / Toggle Connection State / Jack Out; roll modifiers; `flags.draw-steel-ghostwire.wired`; `docs/rulebook/18-wired-foundry.md` (module v0.1.27) — **done** (`53a4b59`)
- [x] **B23b** Wired Console: ApplicationV2 popout (token controls button + assignable keybinding) with connection roster from Overlay / Jacked In statuses, per-Scene nodes in `flags.draw-steel-ghostwire.wiredBoard` (Track, Rating, Integrity from the System Stat Card, Trace Alert 0–12 with lockout/reset-to-6), GM edit + reveal-to-players, player read-only view (module v0.1.28) — **done, pending Michael Foundry test**

### B24 Commander (2026-09-16)
**Naming lock:** the class label is **Commander** everywhere in Foundry (item names, folders, advancements, descriptions). “Face” is retired as a class name. Scout’s **Face-in-crowd** subclass is unrelated and keeps its name.
- [x] **B24** Commander class pack from `03-commander-face.md` (module v0.1.29) — **Foundry-verified 2026-09-16** (`d336ea7`). Done when:
  - [x] New hero can pick Class → Commander
  - [x] Influence shows as the heroic resource (2 per turn); core characteristics Persona / Instinct; Stamina 21 (+9), Recoveries 10; light Kit
  - [x] Skills: Command + Negotiation fixed, choose 2 from Social / Knowledge; doctrine skill (Streetwise / Corporate / Performance)
  - [x] Command Doctrine picker: Street-Fixer / Corp-Exec / Bard, each with L1 feature + two triggered actions, and ladders at 2/3/5/6/7/8/9
  - [x] L1: four signatures (Direct Ally, Mark, Read the Room, The Right Word) + 1/3/5-Influence picks; 7 at L3, 9 at L5, 11 at L8
  - [x] Mark applies the Marked effect (edge on power rolls against the target, ends at combat end)
  - [x] Influence costs enforced in combat; new **Command** ability keyword shows its label
  - [x] No UI string calls the class “Face”
  - [x] `node tools/build-packs.mjs` succeeds

### B25 Languages (2026-09-16)
- [ ] **B25** Languages CONFIG remap from `docs/masters/GHOSTWIRE_LANGUAGES.md` (module v0.1.30) — **Foundry-verified 2026-09-16**. Done when:
  - [x] Hero language picker shows Ghostwire names only (Trade Cant, Corp Cant, Wire Speak, …) — no Caelian / Anjali / Vaslorian
  - [x] Existing heroes’ languages still show (same keys, new labels); no console warning about missing or unmapped language keys
  - [x] All 42 Draw Steel keys mapped 1:1 (`scripts/languages.mjs`)
  - [ ] Follow-up (not B25): language lore + Journal entries; Background/Peoples language grants

### B26 Medic (2026-09-16)
**Reagents persist:** no per-turn gain (class `turnGain` is `"0"`), and `scripts/module.mjs` (`patchPersistentReagents`) stops Draw Steel from setting a Medic's heroic resource to Victories at combat start or posting a gain card each turn. Kit capacity (E1 10 / E2 14 / E3 20 / E4 38, +2 from Advanced Chem-Prep) is feature text; the pool isn't capped automatically.
- [x] **B26** Medic class pack from `04-medic.md` (module v0.1.31) — **Foundry-verified 2026-09-16**. Done when:
  - [x] Class picker shows Medic; Stamina 18 (+6), Recoveries 8; core Instinct / Logic
  - [x] Reagents is the heroic resource; nothing is gained at the start of turns and combat start doesn't reset the pool
  - [x] Skills: Medicine + Medicine Lore fixed, choose 2 from Technical / Social / Knowledge; specialization skill (Streetwise / Corporate / Cybertech)
  - [x] Kit: light Kits + Streetsweeper / Breacher
  - [x] Specialization picker: Street-Doc / Corp-Medtech / Ripperdoc, with L1 features + triggered action and ladders at 2/3/5/6/8/9 (Ripperdoc L8 Nano-Adrenal Auto-Injector)
  - [x] L1: First Aid, Administer Dose, Diagnose + 1/3/5-Reagent picks; Field Synthesis + Advanced Chem-Prep at L2; 7 at L3, 9 at L5, 11 at L8
  - [x] `node tools/build-packs.mjs` succeeds

### B26b Medic gap locks (2026-09-16)
Four Michael locks applied to `04-medic.md` and the Medic pack (module v0.1.33):
1. **Toxins & Gas:** base 2 + Instinct over 2 rounds + Weakened; enhanced 4 + Instinct + Weakened and Slowed (Administer Dose enemy mode, Toxic Cloud, Field Synthesis toxin, Reagents feature).
2. **Level 9:** a second pick per specialization — Last Syringe (Street-Doc), Crash Protocol Override (Corp-Medtech), Emergency Excision (Ripperdoc); L9 grants now choose 1 of 2.
3. **Anesthetize:** power roll 2d10 + Instinct (dazed EoT / dazed save ends / unconscious), no Physique save.
4. **Reagents outside combat (lock A):** Reagents still spend outside combat; Established Protocols stay free; Field Synthesis is encounter-only. `enforceHeroicResourceCost` now blocks an unaffordable Reagent cost outside combat too (there was no free out-of-combat spend to remove).
- [x] **B26b** — **Foundry-verified 2026-09-16**. Done when:
  - [x] Administer Dose / Toxic Cloud show 2 + Instinct toxin text; Anesthetize rolls Instinct with three tiers
  - [x] L9 specialization grant offers two picks for each specialization
  - [x] A Medic can't use a Reagent ability they can't afford outside combat
  - [x] `node tools/build-packs.mjs` succeeds

### B27 Wrench (2026-09-16)
**Uptime v1:** class `turnGain` is a flat `"1"`; the full earn/drain loop (1 per active machine, Deploy momentum, maintenance/salvage ticks, drains from hits, jamming, and wrecks), the 10/12/14 Uptime cap, and fleet size 3/4/5/6 live in feature text (Uptime, Fleet Size Doctrine, Fleet Cap +1, Uptime Cap Increase). No fleet counter UI. **Machines inventory Foundry sync (`15-drones.md`, `16-vehicles.md`) is still backlog** — class items only reference machines; a Fleet & Jump-In feature summarizes THE MACHINES.
- [x] **B27** Wrench class pack from `05-wrench.md` (module v0.1.32) — **Foundry-verified 2026-09-16**. Done when:
  - [x] Class picker shows Wrench; Stamina 18 (+6), Recoveries 8
  - [x] Uptime is the heroic resource (+1 per turn); core Logic / Reflex
  - [x] Skills: Rigging + Gunnery fixed, choose 2 from Technical or Streetwise; subclass skill (Electronics / Piloting / Security Systems)
  - [x] Subclass picker: Drone Jockey / Vehicle Rig-Pilot / Facility Rigger, each with its feature ladder (1–9) and ability picks at 1 (Base Tier), 3 (7-cost + Focus Fire), 5 (9-cost), 8 (11-cost)
  - [x] Four signatures at L1: Deploy & Command, Rigged Fire, Field Repair, Override Ping
  - [x] `node tools/build-packs.mjs` succeeds
