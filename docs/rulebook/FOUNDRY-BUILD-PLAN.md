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

**2026-09-18 (B61):** Print TOC **LOCKED** (recommended package) at `docs/rulebook/TOC-PROPOSAL.md`. `01-how-to-play` Stage 3 fill landed 0.1.97; `03`/`04` still thin. Stage 4 **Wire RAW-locked** (B66, `21`); Veil/Machines drafts (`22`–`23`); Veil Rituals + §C3 locked. Regenerate journals after Michael reviews HTP + Wire lock (held for manuscript pass).

| Item | Status | Notes |
|---|---|---|
| Stage 3 shared core (How to Play, characteristics, Power Rolls, combat basics) | **In progress** | HTP Stage 3 fill 0.1.97; `03`/`04` next |
| Economy chapter (`11-economy.md`) | **Drafted** 2026-09-16 | ¥5,000 + one free Kit; Availability bands; BP firewall; Michael review |
| Chrome chapter (`12-chrome.md`) + master ingest | **Drafted** 2026-09-16 | Body Integrity 20; grades; packages; Cyborg excluded; Michael review |
| Stage 4 Wire / Veil (minimal) / Machines | **Wire RAW-locked** (B66, 2026-09-18); Veil/Machines still draft | Wire: `docs/raw/21-the-wire.md`. Veil Rituals+§C3 locked; Machines thin |
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
| B23c | Wired vision tints (Overlay / Jacked In) | **Done** (Foundry-verified 2026-09-17) | Status-driven vision: Overlay = world-readable color wash; Jacked In = dark/shadowed meatspace, Wire-forward |
| B24 | Commander class pack | **Done** (`d336ea7`, Foundry-verified 2026-09-16) | Commander (Influence) + Street-Fixer / Corp-Exec / Bard in Ghostwire Classes; DS Tactician spine; class label **Commander only** (no “Face”); module v0.1.29 |
| B25 | Languages CONFIG remap | **Done** (Foundry-verified 2026-09-16) | All 42 DS language keys relabeled with locked Ghostwire names (`scripts/languages.mjs`, `GHOSTWIRE.Languages.*`); keys unchanged; module v0.1.30 |
| B26 | Medic class pack | **Done** (Foundry-verified 2026-09-16) | Medic (Reagents, **persist across encounters — turnGain "0", no reset at combat start**) + Street-Doc / Corp-Medtech / Ripperdoc in Ghostwire Classes; DS Troubadour spine; module v0.1.31 |
| B27 | Wrench class pack | **Done** (Foundry-verified 2026-09-16) | Wrench (Uptime, turnGain "1" v1 baseline) + Drone Jockey / Vehicle Rig-Pilot / Facility Rigger in Ghostwire Classes; DS Talent spine, psionics scrubbed; machines inventory still backlog; module v0.1.32 |
| B28 | Elementalist class pack | **Done** (Foundry-verified 2026-09-16) | Elementalist (Essence, turnGain "1" drip; Channel/Resonance in feature text) + Pyromancer / Stormcaller / Geomancer; signature summons + Elementalist foci grants; module v0.1.35 |
| B29 | Street Priest class pack | **Done** (Foundry-verified 2026-09-17) | Street Priest (Conviction, turnGain "2"; Prayer Gamble in feature text) + Light/Dark pact overlay + Shepherd / Templar / Exorcist; Cyborg-blocked; module v0.1.37 |
| B30 | Hacker class pack | **Done** (Foundry-verified 2026-09-17) | Hacker (Bandwidth, turnGain "1") + Disruptor / Controller / Support; three street cyberdeck Kits; Programs; Matrix Verbs not duplicated; Cyborgs allowed; module v0.1.38 |
| B31 | Technomancer class pack | **Done** (Foundry-verified 2026-09-17) | `20-technomancer.md` Stage 2 extract of master Part 1; three disciplines; sprites text-only; Cyborgs barred (Arcane Severance gate) |
| B19 | Full gear import | **In progress / pending verify** | Gear master → Foundry gear pack; Kit-qualifying subset already shipped; Claude owns `src/packs` JSON |
| B20 | Mods expansion + Invent a Mod | **Pending** | Align Mods pack to `14-mods.md`; armor/gadget families; Claude owns packs |
| B20d | Deck / RCC software slots + effects | **Done** (Foundry-verified 2026-09-17) | Programs → decks, autosofts → RCCs via the B20c installer; Activate / Deactivate; software AEs; Reader / Skeleton / Targeting roll edges |
| B20c | Mod install tracker (mods ↔ hosts, used / max slots) | **Done** (Foundry-verified 2026-09-17) | `scripts/mods.mjs`; spec `docs/spikes/B20c-MOD-INSTALL-TRACKER.md` |

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

### Backlog — Stage 4 Wire (2026-09-16 → done 2026-09-18 B66)
- [x] Extract **The Wire (Matrix)** into standalone RAW chapter (`docs/raw/21-the-wire.md`) — **RAW-locked**
- [x] Anyone-vs-Hacker gap + suites/payloads + Connected gate + Chrome BI pointer (Integrity ≠ Body Integrity)
- [x] Foundry Wire surface already shipped (B23 Matrix Verbs / Console, B32 node templates Rating 1–5, B51 payloads); journal regen deferred

### B19 / B20 (Foundry-verified 2026-09-16)
- [x] **B19** Full Gear master Categories 1�6 into packs: gear, mods, matrix, vehicles, foci (module v0.1.24)
- [x] **B20** Mods expansion (armor/gadgets/weapons/vehicles) + �Craft skill text � Michael verified working

### B20c Mod install tracker (2026-09-17)
Spec: `docs/spikes/B20c-MOD-INSTALL-TRACKER.md`. New `scripts/mods.mjs` (registered from `module.mjs` init). **Data:** host `flags.draw-steel-ghostwire.installedMods = [modItemId, …]` (list only); mod `flags.draw-steel-ghostwire.mod.installedOn = hostItemId | null`. **Used slots** = sum of `slotCost` over the Actor's mods whose `mod.installedOn` is the host; **capacity** = `modSlots` of the host's `matrix`, `vehicle`, or `gear` flag; **family** = mod `hosts` / `host` (normalized) must overlap host `modFamily`. **UX:** hero sheet → right-click a mod row (or ⋮) → **Install onto…** (dialog lists the hero's hosts; illegal ones disabled with the reason) / **Uninstall mod**. Host sheet catalog line reads `Mod slots used / max` plus `Installed: …`; mod sheet shows `Installed on: …`. **Blocks** (warning): wrong family, not enough free slots, already installed, not a host, different Actor. Deleting an installed mod or its host cleans the link. Install / uninstall write both Items in one embedded update (one hero-sheet render). No auto-install from compendium drops; §Craft Projects, Invent a Mod, and field toggles stay out of scope.
- [x] **B20c** mod install tracker (module v0.1.44) — **Foundry-verified 2026-09-17**. Done when:
  - [x] Weapon / armor / vehicle / matrix mod installs onto a legal host: host shows `used / max` + names; mod shows host
  - [x] Over-capacity and wrong-family installs are blocked
  - [x] Uninstall clears both flags and restores `0 / max`
  - [x] Matrix Items with `modSlots` work as hosts

### B20d Deck / RCC software slots + effects (2026-09-17)
Spec: `docs/spikes/B20d-DECK-RCC-PROGRAM-SLOTS.md`. **Data (option A):** the 7 Matrix catalog programs (`src/packs/matrix/programs/`) and 4 RCC autosofts (`autosofts/`) now also carry `flags.draw-steel-ghostwire.mod = { slotCost: 1, hosts: ["deck"] | ["rcc"], host, craftSkill, edgeAbilities }`, so the B20c installer works unchanged (programs → decks, autosofts → RCCs; wrong family blocked). `flags.matrix` keeps ¥ / echelon / role / tags (plus `slotCost` and `host` for the sheet line); the sheet reads `matrix` before `mod`. Payloads stay inventory consumables (not installable in v1). **Field toggle:** `mod.active` (set true on install; missing = on) with **Activate / Deactivate** on the hero sheet row menu for any installed mod; an inactive mod keeps its slot. Host sheet lists `Installed: Sneak (on), Reader (off)`; mod sheet `Installed on: Street Deck (on)`. **Effects:** each program/autosoft has one transferred Active Effect (`flags.software`) carrying its catalog Effect line; `scripts/mods.mjs` wraps `ActiveEffect#isSuppressed` so it applies only while the software is installed and on. **Roll edges** (`scripts/module.mjs` ability-use hook, `softwareEdges`): **Reader** → Scan, Search, Deep Scan; **Skeleton** → Seize Control, Seize (v1: always, not only one Rating band below); **Targeting Autosoft** → Rigged Fire, Focus Fire, Sentry Fire, Crossfire Grid, Saturation Fire, Bench-Rigged Shot, Tablet Crossfire. **Deferred (effect text only, Director-adjudicated):** Sneak, Guardian, Mirror, Overlord, Scrubber, Clearsight, Evade, Repair Tick — no clean roll to hook yet.
- [x] **B20d** deck / RCC software (module v0.1.49) — **Foundry-verified 2026-09-17**. Done when:
  - [x] Street Deck + Sneak + Reader install → `2 / 2`; a third program is blocked
  - [x] A program onto an RCC and an autosoft onto a deck are blocked (wrong family)
  - [x] Reader running → Scan rolls with an edge; Deactivate → no edge, slot still used; Activate restores it
  - [x] Targeting Autosoft on an RCC → Rigged Fire rolls with an edge
  - [x] Uninstall frees the slot and clears both flags

### B21 Scout (2026-09-16)
- [ ] **B21** Scout class pack from `02-scout.md`: class, Hunter / Ghost / Face-in-crowd, signatures, 3/5/7/9/11 bands, level 1–10 features; Chrome/Optics keywords; Advantage costs enforced in combat (module v0.1.25) — **pending Michael Foundry test**

- [x] **B21** Scout class pack � Foundry-verified 2026-09-16 (Advantage; Hunter/Ghost/Face-in-crowd)


### B22 Perks (2026-09-16)
- [ ] **B22** Ghostwire Perks pack: all 47 Draw Steel perks reskinned, folders by perk type, 3 perk abilities cloned; level-up perk grants list only Ghostwire perks filtered by `perkType`; Draw Steel perks refused on drop and removed from the registry; `docs/rulebook/17-perks.md` (module v0.1.26) — **pending Michael Foundry test**

### B23a Wired on the sheet (2026-09-16)
- [x] **B23a** Matrix Verbs (9, Wired keyword) granted to every hero + one-time grant for existing heroes; Overlay / Jacked In token statuses set by Connect / Toggle Connection State / Jack Out; roll modifiers; `flags.draw-steel-ghostwire.wired`; `docs/rulebook/18-wired-foundry.md` (module v0.1.27) — **done** (`53a4b59`)
- [x] **B23b** Wired Console: ApplicationV2 popout (token controls button + assignable keybinding) with connection roster from Overlay / Jacked In statuses, per-Scene nodes in `flags.draw-steel-ghostwire.wiredBoard` (Track, Rating, Integrity from the System Stat Card, Trace Alert 0–12 with lockout/reset-to-6), GM edit + reveal-to-players, player read-only view (module v0.1.28) — **done, pending Michael Foundry test**


### B23c Wired vision tints (LOCKED design 2026-09-17 — implement after Phase 5)

Status-driven (reuse existing Overlay / Jacked In Active Effects from B23a; any hero who can Overlay or Jack In gets it).

| State | Player vision | Feel |
|---|---|---|
| **Overlay** | World still readable; color wash / mild saturation (cyan–pink HUD tint) | HUD on top of the street |
| **Jacked In** | Dark / high-contrast / desaturated or neon-forward; meatspace heavily shadowed | In the Wire; physical world is a ghost |

**Foundry approach (v1):** custom Detection/Vision mode or token sight override applied when the matching status AE is active; cleared on Jack Out / Toggle off. Optional soft light radius so Jacked-In runners can still navigate Wired Console nodes.

**Implemented (module v0.1.47, spec `docs/spikes/B23c-WIRED-VISION-TINTS.md`) — Foundry-verified 2026-09-17.** New `scripts/wired-vision.mjs` registers two vision modes in `CONFIG.Canvas.visionModes` — `ghostwireOverlay` (canvas +contrast/+saturation; lit areas cyan-tinted, light colour magenta-tinted; not darkness-adaptive, so it reads in daylight) and `ghostwireJackedIn` (canvas saturation −0.85, exposure −0.55, contrast +0.35; lit areas cold and dim; coloured light boosted toward magenta) — both `tokenConfig: false`. `Token#_getVisionSourceData` is wrapped client-side: while the token's actor has `ghostwire-jacked-in` (wins) or `ghostwire-overlay`, the vision source uses the Wired mode; the Token document's `sight.visionMode` is never written, so clearing the status restores its own vision. Creating, deleting, or toggling a Wired status re-initializes that actor's token vision on every client. **Scope (Foundry's vision rules):** the tint shows on the client looking through the token — its owners, or a GM controlling it — and needs **Token Vision** on the Scene and vision on the token (Draw Steel heroes default to vision on). A GM with no token controlled, and users who don't own the token, see normally. The optional soft light radius was not added.

- [x] **B23c** Overlay vision tint (world-readable color wash)
- [x] **B23c** Jacked In vision (dark/shadowed meatspace); Overlay wash replaced, not stacked
- [x] Clears correctly when status ends (Jack Out, Toggle, token HUD); works for Hacker and any Overlay/Jacked In user
- [x] A second user / GM without the status sees normally

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

### B27b Wrench polish + B26c Medic toxin sync (2026-09-16)
**B27b (module v0.1.34):** `05-wrench.md` locks — Overclock (once-per-encounter Deploy/Command burst: Uptime costs −2 min 1, machines +2 Integrity buffer, then one turn without fleet drip; v1), Jump-In buffer +4 → +5 at 6th and +5 → +6 at 7th, Uptime Economy Mastery at 9th (once per encounter, +2 Uptime drip tick). New Wrench features `jump-in-buffer-l6` (L6) and `uptime-economy-mastery` (L9); Overclock text replaced (L10). Three new Kits in `src/packs/kits/tech/` (Fabricator's Bench, Rigger's Harness, Field Chassis) with signature abilities, first in the Wrench Kit pool and named as each subclass's starter Kit (Quick Build). No subclass itemGrant of the Kit: the class Kit grant already picks one Kit, and a second grant would give two.
**B26c:** Nerve Toxin / Nerve Agent 6 + Instinct over 3 rounds (chapter, master, Foundry); Medic master synced to the B26b locks; zero "weapon-band" left in `04-medic.md`.
- [x] **B27b / B26c** — **Foundry-verified 2026-09-16**. Done when:
  - [x] Wrench L6 (Jump-In Buffer +5), L7 (+6), L9 (Uptime Economy Mastery), L10 (Overclock) features appear with the new text
  - [x] Kits pack has a Tech / rigger folder with Fabricator's Bench, Rigger's Harness, Field Chassis and their signatures; the Wrench Kit picker lists them first
  - [x] Medic Nerve Toxin / Nerve Agent show 6 + Instinct over 3 rounds
  - [x] `node tools/build-packs.mjs` succeeds (classes + kits)

### B28 Elementalist (2026-09-16)
**Essence:** class `turnGain` `"1"` is the drip; Channel ramp (+2/+3/+4), Elemental Resonance, the echelon cap (8/12/16/20), and sustain drains are feature text with gain buttons. Persistent workings use Draw Steel's `persistent` effect (display only). **Cyborg gate: enforced** (`patchArcaneSeverance` in `scripts/module.mjs`): dropping a Veil-caster class (`elementalist`, `street-priest`) on a Cyborg, or the Cyborg ancestry on a Veil caster, is refused with a warning before the advancement dialog opens; a `preCreateItem` check backs it up. **+ Add Class** on the hero sheet now opens Ghostwire Classes. **Optional Kit:** the Kit grant offers **No Kit (Pure Caster)** (`src/packs/kits/magic-tech/no-kit.json`), since Draw Steel requires a pick. **Locks applied (Michael 2026-09-16):** Persistent 1 = −2 / Persistent 2 = −4; Read the Weave rolls (2d10 + Logic); Hurl / Shaping boost numbers; Summon Elemental bind = Logic roll with an edge if Persona ≥ Logic; World-Fissure cost 9; Riptide Grab obstacle damage by tier; L6 has no core features. Chrome magic-erosion is description only. The standalone Veil chapter is still backlog; the class text is enough to play.
- [x] **B28** Elementalist class pack from `06-elementalist.md` (module v0.1.35) — **Foundry-verified 2026-09-16**. Done when:
  - [x] Class picker shows Elementalist; Essence resource (+1 per turn); core Logic / Persona; Stamina 18 (+6), Recoveries 8
  - [x] Specialization picker: Pyromancer / Stormcaller / Geomancer, each with skill (Spellcraft / Perception / Athletics), signature summon, signature focus (Spark-ring; Storm-tine or Riverstone; Grave-anchor), and ladders at 2/5/6/8/9
  - [x] L1: Hurl Element, Elemental Shaping, Read the Weave + base-band pick (5 options incl. Summon Elemental); 7 at L3, 9 at L5, 11 at L8
  - [x] Kit grant offers No Kit (Pure Caster) / Hexshot / Spellblade / Sanctified
  - [x] A Cyborg can't take Elementalist, and an Elementalist can't take the Cyborg ancestry
  - [x] + Add Class opens Ghostwire Classes
  - [x] `node tools/build-packs.mjs` succeeds

### B29 Street Priest (2026-09-16)
**Pact overlay:** a level-1 **Pact Alignment** grant (choose Light Pact or Dark Pact feature, flagged `pactAlignment`). Pact-renamed features ship as Light and Dark variants flagged `pact` (Roster/Ledger L2, Burgeoning Saint/Rising Adept L6, Consecrated/Damned Weapon L9, Ordained/Sworn L9); `patchPactFilter` in `scripts/module.mjs` enables only the variant matching the chosen pact. **Judgment** (Templar L1) is an ability that applies an "Under Judgment" marker effect; its bane and Conviction gain are text + gain buttons. **Conviction:** +2 drip automatic; Prayer Gamble, creed echo, sustain (−2 × Persistent), and cap are feature text. Cyborg block and + Add Class reuse the B28 Arcane Severance gate (`street-priest` already listed). Numbers for Conduit-reskinned abilities come from the Draw Steel Conduit. Veil chapter still backlog; class text is enough to play.
- [x] **B29** Street Priest class pack from `07-street-priest.md` (module v0.1.37) — **Foundry-verified 2026-09-17**. Done when:
  - [x] Class picker shows Street Priest; Conviction (+2 per turn); core Persona / Instinct; Stamina 18 (+6), Recoveries 8
  - [x] L1 Pact Alignment (Light / Dark) works; later Light/Dark grants offer only the matching version
  - [x] Ministry picker: Shepherd / Templar / Exorcist with skill (Medicine / Melee / Occult), ladders, and ability picks at 1/2/6 (+ apex at 9)
  - [x] L1: three class signatures + choose 2 of 8 signatures + 1/3/5 picks; 7 at L3 (incl. Invoke the Pact), 9 at L5, 11 at L8
  - [x] Kit grant: No Kit / Sanctified / Raider / Duelist; Cyborg can't take Street Priest
  - [x] `node tools/build-packs.mjs` succeeds

### B30 Hacker (2026-09-17)
**Cyberdecks:** three new Kits in Ghostwire Kits › Tech / rigger — Nyx Cartel "Switchblade" (Flatline Jab), Ferrum "Padlock-6" (Seize), Meridian "Lookout" (Overwatch Ping). Deck stats (Bandwidth Bonus, Alert Discount, Biofeedback Resistance, Intrusion Roll Mod, Integrity Damage Bonus bands, Reach, Ghost Distance) are description tables; the Kits grant no Stamina, speed, or weapon damage. The Ghostwire Matrix pack's gear decks (Scrapdeck, Street Deck, Ghostbox, Blackdeck, Fairlight Ghost) are separate nuyen gear and unchanged. **Matrix Verbs** stay on every hero (B23a) and are not in the class pack. **Bandwidth:** +1 per turn automatic; deck bonus, natural 19/20, cap, and Infinite Loop carry-over are feature text with gain buttons. **Cyborgs are allowed** (not in the Arcane Severance list).
- [x] **B30** Hacker class pack from `08-hacker.md` (module v0.1.38) — **Foundry-verified 2026-09-17**. Done when:
  - [x] Class picker shows Hacker; Bandwidth (+1 per turn); core Logic / Instinct; Stamina 19 (+7), Recoveries 9
  - [x] Cyberdeck Kit choice: Switchblade / Padlock-6 / Lookout, each granting its signature
  - [x] Hacking Doctrine picker: Disruptor / Controller / Support, ladders 1–9
  - [x] L1: Seize Control + Deep Scan + Ghost Signal; Kill Switch L2, Failsafe Cascade L3, Network Purge L5, Backdoor Override L8; no duplicate Matrix Verbs
  - [x] A Cyborg can take Hacker
  - [x] `node tools/build-packs.mjs` succeeds

### B31 Technomancer (2026-09-17)
**Chapter:** `20-technomancer.md` is now a Stage 2 extract of the master's Part 1, with Power Roll results normalized to Draw Steel print order (low ≤11 / middle 12–16 / high 17+). **Resonance:** +1 per turn automatic; Victories on first communion, per-sprite drip, compile momentum, and harmonic echo are feature text with gain buttons. **Sprites:** text only (Sprite Congregation feature with the archetype and hybrid-tier table); no Sprite Actor compendium yet (backlog). **Biofeedback:** only on 5+ Resonance spends, DC 12/15/18/20, Weaver −2 / Warrior +2, never lethal (Winded floor), written into each 5+ ability. **Kit:** optional light Kit — No Kit (Pure Caster), Hexshot, Spellblade, Sanctified. **Cyborgs are barred:** `technomancer` added to the Arcane Severance gate (`VEIL_CASTER_CLASSES`), and the Cyborg ancestry text names the class. Perks (2/4/6/8/10) and skills (4/7/10) follow the standard cadence; the master's progression table lists neither.
- [x] **B31** Technomancer class pack from `20-technomancer.md` / master Part 1 (module v0.1.39) — **Foundry-verified 2026-09-17**. Done when:
  - [x] Class picker shows Technomancer; Resonance (+1 per turn); core Logic / Persona; Stamina 18 (+8), Recoveries 8
  - [x] L1 skills: Resonance + Rituals, choose Electronics or Matrix Theory; discipline skill Summoning / Repair / Security Systems
  - [x] Kit (Optional): No Kit / Hexshot / Spellblade / Sanctified
  - [x] Discipline picker: Sprite-Weaver / Machine-Whisperer / Resonance-Warrior, ladders 1/2/3/5/7/8
  - [x] L1: Compile Sprite + Resonance Strike + Resonance Mending; pick one each of 1/3/5-cost; 7-cost at L3, 9-cost at L5, 11-cost at L8
  - [x] Sprite Cap 3 (L5), Sprite Cap 4 (L8), Master of the Current (L10)
  - [x] A Cyborg can't take Technomancer, and a Technomancer can't become a Cyborg
  - [x] `node tools/build-packs.mjs` succeeds


## Support Entities (B32+)

- **B32 Phase 0 (done):** `GHOSTWIRE_SUPPORT_ENTITIES.md` inventory + schema.
- **B33 Phase 1 (B32 Phase 1 spike):** Technomancer sprite Actors (12 SKUs) — **Foundry-verified 2026-09-17** (module v0.1.40). See checklist below.
- **B34 Phase 2 (B32 Phase 2 spike):** Elementalist companions + elemental scaffolds (7 Actors) — **Foundry-verified 2026-09-17** (module v0.1.41). See checklist below.
- **B35 Phase 3 (B32 Phase 3 spike):** Street Priest pact spirits (3 Actors + Light/Dark tint) — **Foundry-verified 2026-09-17** (module v0.1.42). See checklist below.
- **B36 Phase 4 (B32 Phase 4 spike):** scale-band Actor templates under `summons/machines` + Deploy / Recall pipeline (dual Item+Actor lock 2026-09-17) — **Foundry-verified 2026-09-17** (module v0.1.43). See checklist below. **B36b** full Item catalog sync (36 drones + 32 vehicles) — **Foundry-verified 2026-09-17** (module v0.1.48).
- **B37 Phase 5 (B32 Phase 5 spike):** Hacker Node/ICE Director templates (10) in the Wired Console — **Foundry-verified 2026-09-17** (module v0.1.45). See checklist below.
- **B32 Phase 5b:** node tokens on the canvas + linked Wired map — **Foundry-verified 2026-09-17** (module v0.1.46). See checklist below.
- **B23c:** Overlay / Jacked In **vision tints** — **Foundry-verified 2026-09-17** (module v0.1.47); see checklist below.

- **Summons pack scaffold (2026-09-17):** Actor pack `summons` registered; folders sprites/elementals/spirits/machines/nodes ready for Phase 1+.

### B32 Phase 1 — Technomancer sprites (2026-09-17)
**Actors:** 12 Draw Steel `npc` Actors in `src/packs/summons/sprites/` (Data / Attack / Machine / Ward × Minor / Intermediate / Advanced), modelled on the Draw Steel Familiar: size 1T, `minion` organization, friendly token, speed 5 fly + hover (placeholder), `construct` keyword, EV 0. **Stamina:** Known Bugs #13 placeholders from `GHOSTWIRE_SUPPORT_ENTITIES.md` §3.1, baked at each hybrid tier's entry level with that level's Logic — Minor L1 / Logic 2, Intermediate L4 / Logic 3, Advanced L8 / Logic 4 (e.g. Attack Minor 14, Intermediate 30, Advanced 58); the description gives the live formula for Compile Sprite to stamp later. **Defenses:** Draw Steel npcs have no defense fields, so Reflex / Physique 10 and Wired = owner Persona are description text. **Items:** Attack sprites embed a **Code Strike** ability (Logic power roll; low no damage, middle/high the band's damage enricher); Data / Ward / Machine embed one description feature (Data Uplink / Ward Screen / Mend). No Active Effects. **Flags:** `flags.draw-steel-ghostwire = { kind: "sprite", archetype, hybridTier, ownerUuid: null, dsid }` (`dsid` added because the npc model has no `_dsid`). **Folder ids:** the scaffold's summons folder ids were 17–18 characters, which blacked out world load once the pack was built; renamed to 16-character ids (`gwSummonsSprites`, `gwSummonsSpirits`, `gwSummonsElement`, `gwSummonsMachine`, `gwSummonsNodes00`), and `build-packs.mjs` now fails on any non-16-character `_id`. **Tooling:** `tools/build-packs.mjs` now writes embedded Actor items under `!actors.items!<actor>.<item>` (and their effects) like it already did for embedded effects.
- [x] **B32 Phase 1** sprite Actors (module v0.1.40) — **Foundry-verified 2026-09-17**. Done when:
  - [x] Ghostwire Summons & Machines › Sprites lists 12 entries
  - [x] Dragging a sprite to a Scene makes a 1T friendly token that moves
  - [x] Attack Sprite sheets show Code Strike and the baked Stamina; the damage button rolls the band
  - [x] Data / Machine / Ward sprite sheets show their feature and description
  - [x] `node tools/build-packs.mjs` succeeds

### B32 Phase 2 — Elementalist companions + elemental scaffolds (2026-09-17)
**Actors:** 7 Draw Steel `npc` Actors in `src/packs/summons/elementals/`, same schema as the Phase 1 sprites (friendly token, `elemental` keyword, EV 0). **Companions** (full, usable): Ember (fire), Zephyr (air/water, fly + hover), Boulder (earth/void) — Rank 1 extensions (minion), 0 Essence, once per encounter, 3 rounds, no sustain. Each embeds its chapter strike as a real damage effect with the caster's Logic: Lash of Flame 4/7/10 fire; Striking Wind 3/5/8 (cold/lightning/sonic chosen on summon) with slide 1 on middle/high; Stone Fist 4/7/10 (acid/corruption chosen on summon) with push 1 on middle/high. **Scaffolds:** Bound Elemental Rank 1 (extension; Summon Elemental 5 Essence, Persistent 2 = −4/turn; Elemental Lash 4/7/10 + a Twin Elemental Summon note feature — no twin Actor), Rank 2 and Rank 3 (independent, Persistent 4 = −8/turn), Greater Elemental (Rank 4 independent, Greater Elemental Summon 11 Essence, Persistent 6 = −12/turn; Rank 5 at echelon 4 noted as Stamina 75). Rank 2+ carry no strike yet (Veil §C3). **Provisional numbers:** Stamina = 15 × Rank (15 / 30 / 45 / 60); size 1S (companions, Rank 1) / 1M / 1L / 2; speed 5; Reason = caster Logic at the Rank's unlock level (L1 2, L5 3, L7 4, L8 4). **Flags:** `{ kind: "elemental", subtype: "companion"|"elemental", element, rank, hybridTier: "extension"|"independent", ownerUuid: null, dsid }`. The Cyborg bar stays on the class.
- [x] **B32 Phase 2** Elementalist companion + elemental Actors (module v0.1.41) — **Foundry-verified 2026-09-17**. Done when:
  - [x] Ghostwire Summons & Machines › Elementals & Companions lists 7 entries (3 companions, Rank 1–3, Greater)
  - [x] Each drags to a Scene as a friendly token at its size (1S / 1M / 1L / 2) and moves
  - [x] Companion sheets show their strike; Striking Wind and Stone Fist show the slide / push rider on middle and high
  - [x] Scaffold descriptions show the provisional Stamina, defense note, and Persistent drain reminder; Rank 1 shows the Twin note
  - [x] `node tools/build-packs.mjs` succeeds

### B32 Phase 3 — Street Priest pact spirits (2026-09-17)
**Actors (3, not 6):** Guardian Spirit (Shepherd, Warding Aegis feature; Sentinel Spirit size-2 flare noted in its description, no extra Actor), Warrior Spirit (Templar, Pact Blade strike), Hunter Spirit (Exorcist, Binding Chain strike; restrained on middle/high vs spirit-type targets, description rider). Same npc schema as Phases 1–2: 1M friendly minion tokens, speed 5 fly + hover, level 3, Persona 2 / Instinct 2 (a 3rd-level Street Priest). Strikes are light band 4 / 7 / 10 + Persona, typeless until tinted. **Stamina:** flat provisional 20 (independent form only) until Veil §C3. Each description carries the Invoke the Pact grammar (7 Conviction; Bind Check 2d10 + Instinct; low = asymmetric failed bind; middle = extension; high = independent, Persistent 2 = −4 Conviction/turn). **Flags:** `{ kind: "spirit", ministry, pact: null, hybridTier: "extension", ownerUuid: null, dsid }`.
**Light / Dark tint:** each Actor embeds two disabled `abilityModifier` effects, **Pact: Light** and **Pact: Dark** (`flags.draw-steel-ghostwire.pactTint`), filtered to `strike` abilities, adding `holy` or `corruption` to `damage.tierN.types`. `scripts/module.mjs` keeps them exclusive, sets `flags.pact`, and tints the token (Light `#fff1b8`, Dark `#c9a0ff`); setting `flags.pact` directly enables the matching effect. Turning the active pact off clears the flag and tint.
- [x] **B32 Phase 3** pact spirit Actors (module v0.1.42) — **Foundry-verified 2026-09-17**. Done when:
  - [x] Ghostwire Summons & Machines › Pact Spirits lists 3 entries
  - [x] Guardian drags to a Scene and moves
  - [x] Enabling Pact: Light on a placed Warrior makes Pact Blade deal holy damage and tints the token; switching to Pact: Dark turns Light off, deals corruption, and re-tints
  - [x] Each sheet shows the Invoke the Pact text; Hunter shows its spirit restrain rider; Guardian shows Warding Aegis and the Sentinel note
  - [x] `node tools/build-packs.mjs` succeeds

### B32 Phase 4 — Drones & vehicles: band templates + Deploy / Recall (2026-09-17)
**Templates:** 9 scale-band npc Actors in `src/packs/summons/machines/` — `machine-drone-micro / small / medium`, `machine-vehicle-bike / car / heavy / air / water / space` (`construct` keyword, friendly, provisional Stamina / size / speed). No large drone band (no SKU needs one). **Band map:** `docs/masters/GHOSTWIRE_MACHINE_BANDS.md` lists all 31 current vehicles-pack Items → template, resolved at runtime from the existing `flags.draw-steel-ghostwire.vehicle` (`drone`, `domain`, `scale`) — **no Item changes, vehicles pack not rebuilt for this**.
**Deploy / Recall:** new `scripts/machines.mjs` (registered from `module.mjs` init). Click path: hero sheet → right-click the drone/vehicle row (or its ⋮) → **Deploy**, or open the Item → **Deploy** in its header. Deploy imports the band template into a world Actor in the **Deployed Machines** folder, named and imaged after the Item, owned by the hero's owners; stamps Stamina = template × echelon multiplier (×1 / 1.5 / 2 / 2.5), speed (vehicles ± chapter Speed band), movement type from domain, level = echelon; places a **linked** token next to the owner's token (or the view centre); sets Actor `flags = { kind, band, ownerUuid, gearItemUuid, dsid, gearDsid, echelon, speedBand }` and Item `flags.deployed = { actorUuid }`. The button then reads **Recall**: deletes the machine's tokens on every Scene and its Actor; the Item stays. **Guardrails:** one deployed Actor per Item; deleting the Actor by hand removes its tokens and clears the link; deleting the Item recalls its machine; 0 Stamina posts a wrecked warning. Deploy needs Create Actors + Create Tokens (Director by default). Deploy / Recall don't force a sheet re-render (a double render raced Draw Steel's async Biography / description editors and logged a ProseMirror `replaceWith` error). Macro API: `game.modules.get("draw-steel-ghostwire").api.deployMachine / recallMachine / machineBand / deployedMachine`.
**Not in this phase:** the Items-catalog sync to the chapters' full chassis lists (done in B36b, below), Wrench Deploy & Command automation, Fleet Size, Jump-In, player-side Deploy without permissions.
- [x] **B32 Phase 4** machine band templates + Deploy / Recall (module v0.1.43) — **Foundry-verified 2026-09-17**. Done when:
  - [x] Ghostwire Summons & Machines › Drones & Vehicles (Actors) lists 9 band templates
  - [x] A hero with a drone Item (e.g. Guard-Dog): right-click its row → Deploy places a movable token next to the hero, named after the Item, with stamped Stamina (Guard-Dog 18)
  - [x] The deployed Actor sits in the Deployed Machines folder with ownerUuid / gearItemUuid flags; Deploy again is refused
  - [x] Recall removes the token and Actor; the Item stays on the hero and shows Deploy again
  - [x] A vehicle Item (e.g. Getaway) deploys as a 2-square token
  - [x] `node tools/build-packs.mjs` succeeds

### B36b Vehicles pack full sync (2026-09-17)
Spec: `docs/spikes/B36b-VEHICLES-PACK-FULL-SYNC.md`. Ghostwire Vehicles & Drones now matches the chapters: **36 drones** (`15-drones.md` §5.1) and **32 crewed platforms** (`16-vehicles.md` §7.1) — **37 Items added** (25 drones, 12 vehicles), same `treasure` schema, folders, and images as their neighbours; `_dsid` from the first slang name (the drone Rustbucket is `rustbucket-drone`, shown as "Rustbucket (Drone)"; the vehicle keeps `rustbucket`). Descriptions follow the existing pattern (names · stats line · domain/scale · crew/speed/Jump-In for vehicles · profile · stat-block note · vehicle mod list). **Existing 31 Items** keep their ids and prose; their flags synced to the chapter: chapter **tags** (previously empty), **Iron Giant** scale `Vehicle–Heavy` → `Heavy`, and a new **`speedBand`** flag on every crewed vehicle; their stats and domain lines now show the tags. `scripts/machines.mjs` reads `flags.vehicle.speedBand` first (the old per-dsid table stays as fallback). Every Item resolves to an existing band — no new Actor templates; map regenerated in `GHOSTWIRE_MACHINE_BANDS.md` §3.
- [x] **B36b** vehicles pack full sync (module v0.1.48) — **Foundry-verified 2026-09-17**. Done when:
  - [x] Ghostwire Vehicles & Drones shows 36 drones and 32 vehicles
  - [x] A new Item's catalog line (echelon / availability / ¥ / mod slots) matches its chapter row
  - [x] A new drone and a new vehicle Deploy to the right band; Recall cleans up
  - [x] Guard-Dog / Getaway still Deploy as before
  - [x] `node tools/build-packs.mjs` succeeds

### B101 Vehicle + drone token-art plumbing (2026-09-19)
Spec: `docs/spikes/B101-VEHICLE-DRONE-TOKEN-ART.md`. JSON sources `src/packs/vehicles/**` remain SoR (LevelDB is compiled). Chassis `img` convention: `modules/draw-steel-ghostwire/assets/tokens/{vehicles,drones}/<dsid>.webp`. Apply tool `tools/apply-machine-token-art.mjs` maps slang-slug files onto Item `img` and rebuilds `packs/vehicles`. **SHIPPED 0.3.31:** 36 drone + 32 vehicle WebPs. Deploy already stamps Item `img` onto the band Actor (`scripts/machines.mjs`). **0.3.68:** generic `machine-drone-medium` uses the Mule-Bot cargo plate; other band templates stay generic.
- [x] **B101** vehicle + drone tokens (module **0.3.31**) — **pending Michael Foundry-verify**. Done when:
  - [x] Spike lists 36 drone + 32 vehicle slang slugs vs chapter inventories
  - [x] `assets/tokens/drones/` (36 WebP) + `assets/tokens/vehicles/` (32 WebP)
  - [x] `node tools/apply-machine-token-art.mjs --list` matches the pack (`art=yes` × 68)
  - [x] Every chassis Item `img` is the module token path; `packs/vehicles` rebuilt
  - [ ] Foundry-verify Deploy art (Fly + Getaway)

### B102 Armor + weapon item-art plumbing (2026-09-19)
Spec: `docs/spikes/B102-ARMOR-WEAPON-ITEM-ART.md`. JSON sources `src/packs/gear/{armor,weapons}/**` remain SoR (LevelDB is compiled). Item `img` convention: `modules/draw-steel-ghostwire/assets/tokens/{armor,weapons}/<dsid>.webp` (shields under `armor/`). Apply tool `tools/apply-gear-token-art.mjs` maps `_dsid` files onto Gear Item `img` **and** matching embedded `type: treasure` Items on pregen Heroes, then rebuilds `packs/gear` + `packs/pregens`. **SHIPPED 0.3.32:** 22 armor/shield + 49 weapon WebPs. Pregens store full Item copies (not live UUID links) — the Equipment tab shows the embed. Kit dsid collisions (Wren Longshot) are skipped because only treasure is stamped. General gear is out of scope.
- [x] **B102** armor + weapon tokens (module **0.3.32**) — **pending Michael Foundry-verify**. Done when:
  - [x] Spike lists 22 armor/shields + 49 weapons vs pack `_dsid`s + pregen update rule
  - [x] `assets/tokens/armor/` (22 WebP) + `assets/tokens/weapons/` (49 WebP)
  - [x] `node tools/apply-gear-token-art.mjs --list` matches the pack (`art=yes` × 71)
  - [x] Gear + pregen embed `img` fields are the module token path; `packs/gear` + `packs/pregens` rebuilt
  - [ ] Foundry-verify Equipment tab art (Wren Armored Jacket + Gear pack Ghost Pistol)

### B103 Bestiary + L≤4 summon portrait-art plumbing (2026-09-19)
Spec: `docs/spikes/B103-BESTIARY-HUMANOID-PORTRAITS.md`. JSON sources `src/packs/{bestiary,summons}/**` remain SoR (LevelDB is compiled). Path convention: `modules/draw-steel-ghostwire/assets/tokens/{bestiary,summons}/<slug>.webp` (bestiary humanoids + ICE vs summons pack, split so machine-band templates stay on B101 chassis art). Apply tool `tools/apply-bestiary-portrait-art.mjs` maps pack-slug files onto Actor `img` **and** `prototypeToken.texture.src`, then rebuilds the packs that changed. **SHIPPED 0.3.35:** 40 bestiary + 17 summon WebPs from `gw-bestiary-portraits.zip` (Michael approved shipping). Original scope was **57** Actors. **0.3.48** adds Mama Cassavir (L5 named boss, Michael split-face) — live apply-tool scope is **58**. Critters, wilds, undead monsters, L6 corp bosses, `machines/*` band templates, elemental rank 2/3/greater, and sprite-*-advanced stay out of scope.
- [x] **B103** bestiary + L≤4 summon portraits (module **0.3.35**) — **pending Foundry-verify**. Done when:
  - [x] Spike lists 57 slugs vs pack JSON + Actor `img` / token update rule
  - [x] `assets/tokens/bestiary/` (40 WebP) + `assets/tokens/summons/` (17 WebP)
  - [x] `node tools/apply-bestiary-portrait-art.mjs --list` matches the packs (`art=yes` × 57)
  - [x] Actor `img` + `prototypeToken.texture.src` are the module token path; `packs/bestiary` + `packs/summons` rebuilt
  - [ ] Foundry-verify sheet + Scene token (Corp Enforcer, Watchdog ICE, Ember Companion)

### B111 ARG Argent Exchange portraits (2026-09-20)
Spec: `docs/spikes/B111-ARG-TOKEN-ART.md`. Michael’s ARG Corporate Enforcer / Response Lieutenant (Goliar) / Security Officer art under `assets/tokens/bestiary/arg/` (PNG + 1024² WebP). Pack slugs unchanged; Actor `img` + `prototypeToken.texture.src` point at `modules/draw-steel-ghostwire/assets/tokens/bestiary/arg/…`. Lang names ARG-prefixed; `flags.draw-steel-ghostwire.faction = "arg"`. Deadhead SoR / Director opposition lines use ARG names. **SHIPPED 0.3.47.** Does not force-rewrite Gold Line.
- [x] **B111** ARG token art (module **0.3.47**) — **pending Foundry-verify**. Done when:
  - [x] Three PNG + WebP files under `assets/tokens/bestiary/arg/`
  - [x] Actor `img` + `prototypeToken.texture.src` are the ARG module paths; `packs/bestiary` rebuilt
  - [x] Lang names + Deadhead opposition lines use ARG prefixes
  - [ ] Foundry-verify sheet + token (ARG Corporate Enforcer, ARG Response Lieutenant, ARG Security Officer)

### Mama Cassavir portrait (2026-09-20 / 0.3.48)
Michael’s split-face portrait (elderly organic / chrome cyborg, cyan eye, hand on the Switchboard deck) as `assets/tokens/bestiary/mama-cassavir.png` + `.webp`. Actor `img` + `prototypeToken.texture.src` → `modules/draw-steel-ghostwire/assets/tokens/bestiary/mama-cassavir.webp` (B103 slug convention, not the ARG `bestiary/arg/` override). **Do not regenerate.** Apply-tool slug `mama-cassavir` is in-scope as of 0.3.48.
- [x] PNG + WebP under `assets/tokens/bestiary/`
- [x] Actor `img` + `prototypeToken.texture.src` are the module WebP path; `packs/bestiary` rebuilt
- [ ] Foundry-verify sheet + token (Mama Cassavir)

### B112 Scene → Wire auto-nodes (2026-09-20)
Spec: `docs/spikes/B112-SCENE-WIRE-AUTO-NODES.md`. GM **Auto-nodes from Scene** on the Wired Console reads named AmbientLights + wall doors on the **viewed** Scene, writes Track 1 nodes onto `wiredBoard` (`{Room} - Light Control` R1, `{Room} - Maglock Door N` R2, `{Room} - Cam Controls N` R1 for cam lights), places hidden 0.25 tokens via `placeNode` (B108 level + B110 scale) next to the first light / each door / each cam, links Light Control ↔ maglocks and Cam Controls in the same room. Room parse: **`{Room Name} - {rest…}`** (space-hyphen-space required; no first-word fallback; missing splitter → warn + skip). Maglock names use the same ` - ` after the room (`Rear Car Substation - Maglock Door 1`, not `Rear Car Substation Maglock Door 1`). Cam lights (`rest` contains Cam / Camera) are not folded into Light Control `lightIds`. `autoFrom` flags make re-run skip (or replace). Wire→meat toggles out of scope. **B113** Light/Maglock/Cam art ships with this module (`AUTO_NODE_TOKEN_ART` → `assets/tokens/wired/node-*.webp`). Does not touch `gold-line-scene.mjs`. **SHIPPED 0.3.49.**
- [x] **B112** auto-nodes (module **0.3.49**) — **pending Foundry-verify**. Done when:
  - [x] Console GM button + dialog (skip / replace) + helpText room rule
  - [x] One Light Control per room; maglocks numbered per room; nearest-light room for unnamed doors
  - [x] Cam lights / named cams → Cam Controls (not Light Control)
  - [x] Hidden tokens on current Level at 0.25; idempotent skip
  - [ ] Foundry-verify on Gold Line after lights are named

### B113 Light Control / Maglock token art (2026-09-20)
Spec: `docs/spikes/B113-LIGHT-MAGLOCK-TOKEN-ART.md`. Michael **YES** art: cyan lightbulb + power symbol (`node-light-control`), sliding doors + padlock (`node-maglock`), plus six more catalog styles under `assets/tokens/wired/` (1254² PNG originals + 1024² WebP). B112 `placeNode` stamps Actor `img` + `prototypeToken.texture.src` + placed token texture. Generic Track 1/2 templates stay when `tokenStyle` is empty. **SHIPPED 0.3.49.**
- [x] **B113** token art (module **0.3.49**) — **pending Foundry-verify**. Done when:
  - [x] PNG + WebP at `assets/tokens/wired/node-light-control.*`, `node-maglock.*`, and the six extra catalog stems
  - [x] `AUTO_NODE_TOKEN_ART` paths non-null; auto-nodes + Console Place on canvas use them
  - [ ] Foundry-verify 0.25 tokens on Gold Line Interior

### B114 Node-map readability (2026-09-20)
Spec: `docs/spikes/B114-NODE-MAP-READABILITY.md`. Fail-case: overlapping labels on dense Gold Line boards. `scripts/wired-layout.mjs`: spatial (placed tokens) / cluster-by-room / force-directed, then label collision avoidance. Dense (≥12): smaller pills, truncated names + tooltip. Minimap zoom/pan (scroll / drag / reset). **SHIPPED 0.3.49.**
- [x] **B114** node map (module **0.3.49**) — **pending Foundry-verify**. Done when:
  - [x] 24-node Gold Line-style board has min centre separation ≥ 7 in smoke
  - [x] Zoom/pan + truncated labels in the minimap template
  - [ ] Foundry-verify after B112 auto-nodes: pills do not stack

### B115 NPC Wire Kit (2026-09-20)
Spec: `docs/spikes/B115-NPC-WIRE-KIT.md`. Droppable Matrix Support feature **Wire Kit — Matrix Verbs** marks an NPC/drone Wire-capable. Console / Token HUD **Add Wire Kit** for selected NPC tokens. Heroes skipped (same applet). No bestiary default. **SHIPPED 0.3.49** (stamp); **B117 0.3.53** does not copy the nine onto the sheet; **0.3.68** kit is a Connect interface.
- [x] **B115** Wire Kit (module **0.3.49** / interface **0.3.68**) — **pending Foundry-verify**. Done when:
  - [x] Pack item `wire-kit-matrix-verbs` + grant/revoke hook
  - [x] Console + HUD one-click; API `addWireKit`
  - [x] `itemIsConnectInterface` treats `kind: "wire-kit"` / `_dsid` as interface (0.3.68)
  - [ ] Foundry-verify: stamp ARG Response Lieutenant or a drone; Connect enabled without a commlink; Enforcer left meat-only

### B116 Node token library (2026-09-20)
Spec: `docs/spikes/B116-NODE-TOKEN-LIBRARY.md`. Eight Michael YES styles under `assets/tokens/wired/` (`library.json` + `NODE_TOKEN_LIBRARY`). Wired Console GM **Token art** select writes board `tokenStyle`. Auto-nodes: Light → `light-control`, Maglock → `maglock`, Cam lights / named cams → `cam-controls`. Manual place: Director picks. Generic Track 1/2 when `tokenStyle` is empty. **SHIPPED 0.3.49.** Ten Conglomerates Host skins (`node-host-{ticker}`) **0.3.54**; generic `node-host` stays default.
- [x] Catalog 8 styles png+webp under `assets/tokens/wired/` (module **0.3.49**)
- [x] Console `<select>` on the selected node; Place / sync stamps the WebP
- [ ] Foundry-verify extra styles + picker on Gold Line

### B116 Wire Atlas topology (2026-09-20)
Spec: `docs/spikes/B116-WIRE-ATLAS.md`. Locked brief: device tokens = **what**, atlas tokens = **where**. Three altitudes (district Relay/Host → facility Segment → room Device). Scan Reach = hops on the **current Scene graph**. Dig-down procedure. Catalog at `assets/tokens/wired/` (`node-relay` / `node-host` / `node-segment`). Topology + journal **0.3.50**; Michael atlas art **0.3.51**. Device library (eight YES styles + picker) shipped **0.3.49** (PR **#34**). Mama **0.3.48**. PDF redo later. Gold Line `{ force: true }` untouched.
- [x] **B116** Wire Atlas (module **0.3.50** topology / **0.3.51** art) — **pending Foundry-verify**. Done when:
  - [x] Spike + RAW `21-the-wire.md` topology section (Relay / Host / Segment; Endpoint note only)
  - [x] Short cross-links in `08-hacker.md`, `18-wired-foundry.md`, doctrine, Director wired-node docs
  - [x] Rulebook journal **The Wire** has a **Wire Atlas / topology** page
  - [x] `assets/tokens/wired/library.json` atlas rows + README; Michael png/webp shipped **0.3.51** (`placeholder: false`)
  - [ ] Foundry-verify: Rulebook → The Wire → Wire Atlas / topology page; catalog art stamps; no Gold Line rewrite

### B117 Matrix Verbs from the node the player faces (2026-09-20)
Spec: `docs/spikes/B117-CONSOLE-MATRIX-VERBS.md`. **PLAYER UX lock:** player opens the Wired node facing them; that node UI shows **all nine** Matrix Verbs (Connect, Jack Out, Toggle, Scan, Navigate, Ping, Broadcast, Search, Read/Write); the verb fires from their actor. Connect is on the applet (not the sheet) and requires a Wire interface or Technomancer. Director Console still has board + roster + the same shared strip. Strip from `hero.defaultItems`, pregens, NPC Wire Kit stamp, and Mama Cassavir. Programs stay on the sheet. **SHIPPED 0.3.53.** Gold Line `{ force: true }` untouched. PDF later.
- [x] **B117** node-facing Matrix Verbs (module **0.3.53**) — **pending Foundry-verify**. Done when:
  - [x] Spike + Foundry notes in `18-wired-foundry.md` + Wire chapter In Foundry aside
  - [x] Node panel verb strip (all nine); Console strip shares `useConsoleVerb`
  - [x] Roll uses the player's characteristics + existing Hacking / Jacked In / Reader edges
  - [x] Sheet cleanup: all nine off defaultItems, Wire Kit stamp, pregens, Mama
  - [x] Connect gated on tagged comms / deck / chrome / Wire Kit or Technomancer; street Commlink SKU
  - [ ] Foundry-verify: player opens a revealed node, Connects there (with a commlink), fires the other verbs without the GM Console; no interface → Connect refuses; sheet / pregen / Mama / Wire Kit have none of the nine

### Linked connection state — docs + VOIDMARK (2026-09-20)
Spec: `docs/spikes/LINKED-CONNECTION-STATE.md`. Code + RAW `21` shipped **0.3.56**. **0.3.57** completes SoR everywhere rules/AI tools read: journals from RAW (`03`/`04`/`19`/`21`), Hacker doctrine, manuscript glossary, VOIDMARK index rebuild. Four states: Disconnected | Linked | Overlay | Jacked In. No Gold Line `{ force: true }`. No new art.
- [x] **Linked docs / VOIDMARK** (module **0.3.57**) — **pending Foundry-verify**. Done when:
  - [x] RAW + journals name four states; Connect→Linked; Toggle ladder
  - [x] VOIDMARK index chunks contain Linked; smoke retrieves it on Overlay / Jacked In / Connect / connection-state queries
  - [x] Lang / Foundry notes no longer say two-state-only for the status list
  - [ ] Foundry-verify: VOIDMARK applet answers “what are the connection states?” with Linked

### Ping vs Read/Write doctrine (2026-09-20)
Lang Ping/Read/Write Story+Effect + RAW `21` Matrix Verbs + `08-hacker.md` sync + Foundry notes one-liner. **SHIPPED 0.3.62.** Ping = touch/test nudge (lights; “does it answer?”; one-frame glitch). Read/Write = change data/settings/state (unlock maglock, kill cam feed). **Ping vs ICE:** Track 1 only (no ICE); ICE is Track 2; Ping does not bypass or defeat ICE. Not B106 Console Wire ping/spoof. VOIDMARK index rebuilt. No Gold Line `{ force: true }`. No PDF.
- [x] **Ping vs Read/Write** (module **0.3.62**) — **pending Foundry-verify**. Done when:
  - [x] Ping card names maglock-not-unlock and cam-not-lasting-off
  - [x] Read/Write card names unlock maglock / kill cam feed
  - [x] Ping card / RAW: Track 1 only, ICE is Track 2, Ping does not bypass ICE
  - [x] RAW `21` + Hacker doctrine + VOIDMARK retrieve the distinction
  - [ ] Foundry-verify: Ping / Read/Write ability text on the node applet matches lang

### Console node Actors always Connected (2026-09-20)
Michael: Hotel Interface and other placed Wire node Actors showed **Disconnected** in Connections. They are infrastructure (`kind: "node"`), always **Connected** on the roster chip, never the Matrix Verb actor. Click a node row to select/pan the board node; verbs keep the last runner. **SHIPPED 0.3.63.** No Gold Line `{ force: true }`. No PDF.
- [x] **Node roster Connected** (module **0.3.63**) — **pending Foundry-verify**. Done when:
  - [x] `kind: "node"` chips Connected; pickConsoleActor skips them
  - [x] Click node row selects/pans the board node; `useConsoleVerb` refuses a node actor
  - [x] Foundry notes + B117 smoke
  - [ ] Foundry-verify: Hotel Interface / Light Control show Connected; Ping still rolls from a hero

### Console sort + hover + Matrix Verb sheet hide (2026-09-20)
Michael: Nodes/Connections lists need **revealed first, then A–Z by name**, plus hover for truncated full names. Smoke 0.3.63: **Ping is back on the hero ability sheet** after use (B117 lock — all nine must stay on the node applet / Console strip). **SHIPPED 0.3.64.** Temp embeds stay for chat `abilityUuid`; hide via `flags.draw-steel.hideInSheet` + `_prepareAbilitiesContext` filter + CSS/DOM (`data-document-uuid`). Ready deletes only temps that are not backing a chat card. No Gold Line `{ force: true }`. No PDF. No Ping doctrine rewrite.
- [x] **Console UX + sheet hide** (module **0.3.64**) — **pending Foundry-verify**. Done when:
  - [x] Nodes: revealed A–Z then hidden A–Z; Connections: revealed node Actors first, then everyone else A–Z
  - [x] Name hover (`title` + `data-tooltip`) on node and Connections labels
  - [x] Temp/permanent Matrix Verbs filtered from DS hero/NPC sheets; chat `abilityUuid` still resolves
  - [x] B117 smoke + Foundry notes
  - [ ] Foundry-verify: long node names tooltip; revealed nodes on top; Ping does not appear on the hero sheet after use; Search chat still prints tier text

### Console ready leftover strip Flag scope "0" (2026-09-20)
Michael console 0.3.65: `Uncaught (in promise) Error: Flag scope "0" is not valid or not currently active` at `DrawSteelItem.getFlag` ← `isTemporaryConsoleVerb` ← `Array.filter` during `Game.setupGame`. `filter` passes `(element, index)`; index `0` was treated as `moduleId`. **SHIPPED 0.3.66.** Wrap callbacks; ignore a non-string second arg. No Gold Line `{ force: true }`. No PDF.
- [x] **Flag scope harden** (module **0.3.66**) — **pending Foundry-verify**. Done when:
  - [x] Ready leftover strip wraps `item => isTemporaryConsoleVerb(item)`
  - [x] Sheet hide wraps `item => isOffSheetMatrixVerb(item)`
  - [x] `getFlag` helpers ignore a second arg that is not a non-empty string
  - [x] B117 smoke: bare `filter(isTemporaryConsoleVerb)` does not throw
  - [ ] Foundry-verify: world `Game.setupGame` no longer throws Flag scope "0"

### Kiosk food/chem row art (2026-09-20)
Michael smoke 0.3.65: food/chem kiosk rows showed no image. SKU `img` used `icons/consumables/…` game-icons that 404 on stock Foundry 14. **SHIPPED 0.3.66.** Module SVGs at `assets/icons/consumables/`; shop `onerror` falls back food vs chem vs `icons/svg/item-bag.svg`. No Gold Line `{ force: true }`. No PDF.
- [x] **Consumable kiosk art** (module **0.3.66**) — **pending Foundry-verify**. Done when:
  - [x] All `src/packs/gear/consumables/**` Item `img` are module SVGs on disk
  - [x] Kiosk listing helper rejects blank / game-icons `icons/` trees
  - [x] Template `data-fallback` + render `onerror`
  - [x] `node tools/kiosk-smoke.mjs`
  - [ ] Foundry-verify: Food kiosk rows show icons; Medical chems show flasks; 404 still shows a glyph

### Hero / NPC token Has Vision (2026-09-20)
Michael lock: any **Hero** or **NPC** created in Ghostwire always has token vision on (`sight.enabled` / Has Vision). World create, pack import, and compendium drag; placed tokens inherit. Existing range/angle/visionMode are not wiped. One-time GM ready migration for world actors + placed tokens still off. **Scope:** Actor type `hero` + `npc`. **Skip** `flags.draw-steel-ghostwire.kind` in `node` / `node-template` / `kiosk` / `vehicle` / `drone`. Pack stubs: bestiary + pregens + summon creatures (sprites / spirits / elementals). **SHIPPED 0.3.67.** No Gold Line `{ force: true }`. No PDF.
- [x] **Hero/NPC Has Vision** (module **0.3.67**) — **pending Foundry-verify**. Done when:
  - [x] `preCreateActor` / `preCreateToken` set `sight.enabled: true` for hero + npc
  - [x] Ready migration once per world (`tokenVisionMigrated`)
  - [x] Kiosk / Wire node / vehicle / drone stubs stay vision-off
  - [x] Bestiary + pregen + summon-creature source JSON + `node tools/token-vision-smoke.mjs`
  - [ ] Foundry-verify: new hero, imported bestiary NPC, and a dropped token all show Has Vision; Hotel Interface / kiosk / deployed drone do not gain it

### Street-snack food ¥ (2026-09-20)
Michael: “30 for a brick bar is crazy.” Food was priced like T5 gear. **SHIPPED 0.3.66.** Brick Bar ¥3, Buzz-Can ¥4, Lyte-Pouch ¥5, Shift Chews ¥6, Stall Ramen ¥10, Grease Box ¥12. Chems unchanged (Kickwire ¥400 / Clearline ¥350 / Numb-Tap ¥250 / Red Dust ¥600). No Gold Line `{ force: true }`. No PDF.
- [x] **Street-snack ¥** (module **0.3.66**) — **pending Foundry-verify**. Done when:
  - [x] Six food SKU `gear.price` + lang Cost lines
  - [x] Chems not slashed
  - [x] Gear pack rebuilt; kiosk smoke
  - [ ] Foundry-verify: Food kiosk shows stall prices; Kickwire still ¥400

### Wire Kit is a Connect interface (2026-09-20)
Michael smoke: drone on scene had **Wire Kit — Matrix Verbs** on Features, but Wired Console showed DISCONNECTED and all verbs disabled (“Need a comlink, deck, datajack, or trodes — or be a Technomancer.”). `itemIsConnectInterface` only accepted `wired.connectInterface` / matrix role deck|rcc|interface / Technomancer. Pack item had `kind: "wire-kit"` only. **SHIPPED 0.3.68.** Treat `kind === "wire-kit"` / `_dsid === "wire-kit-matrix-verbs"` as interface; stamp `connectInterface` on pack JSON + HUD grant. **Pack drones and vehicles** embed the kit (Wire-ready imports; still Disconnected until Connect). World ready stamps missing kits onto `kind: "drone"` and `kind: "vehicle"` actors. **Wrench drone control (RCC or Rigger’s Harness) counts as a Connect interface.** Existing world copies Connect without a commlink. Do not require RCC role for the kit path. Verbs stay off the sheet. No Gold Line `{ force: true }`. No PDF.
- [x] **Wire Kit Connect interface** (module **0.3.68**) — **pending Foundry-verify**. Done when:
  - [x] `itemIsConnectInterface` accepts Wire Kit kind/dsid (and pack `connectInterface`)
  - [x] Pack drone **and vehicle** templates + Deploy + world migration stamp the kit (not Overlay)
  - [x] RCC SKUs + Rigger’s Harness count as Connect interfaces (Harness ≡ deck)
  - [x] B115 / B117 notes + Foundry Director notes
  - [x] RAW `21-the-wire.md` Wire interface section + journals + VOIDMARK index
  - [x] Mule-Bot / generic Drone (Medium) cargo plate (`mule-bot.{png,webp}`)
  - [x] `node tools/b117-console-verbs-smoke.mjs` + B112–B115 smoke
  - [ ] Foundry-verify: pack drone **or vehicle** Connects → Linked; Wrench with Rigger’s Harness Connects without a commlink; Scan after Toggle to Overlay; nine verbs still not on the sheet; Drone (Medium) / Mule-Bot show the yellow cargo plate

### B118 Scene kiosk merchant (2026-09-20)
Spec: `docs/spikes/B118-SCENE-KIOSK-MERCHANT.md`. Placeable **NPC Actor stub** (`flags.draw-steel-ghostwire.kind === "kiosk"`), not a Tile/Drawing. Director names the merchant/corp, stocks Item UUIDs (Gear/Chrome/Matrix/Mods/Vehicles/Foci + optional ¥ override), sets Chebyshev range in grid squares (default 2). Players open when a hero token is in range; GM always. Purchase checks `system.hero.wealth`, deducts ¥, creates the Item on the buyer, chat logs. Infinite stock. Token HUD + double-click (same path as Wired node applet). Pack stub `src/packs/summons/kiosks/kiosk-merchant.json`. **SHIPPED 0.3.59.** No Gold Line `{ force: true }`. No PDF.
- [x] **B118** scene kiosk merchant (module **0.3.59**) — **pending Foundry-verify**. Done when:
  - [x] Actor stub + flags + ApplicationV2 shop + lang + CSS
  - [x] Proximity gate (Chebyshev squares) + GM bypass
  - [x] Purchase helpers: wealth check, deduct, Item clone (`node tools/kiosk-smoke.mjs`)
  - [ ] Foundry-verify: Mama’s Bar + ARG Lobby on a scratch Scene; player in range buys; out of range refused; Gold Line untouched

### B119 Kiosk type presets + street consumables (2026-09-20)
Spec: `docs/spikes/B119-KIOSK-PRESETS-CONSUMABLES.md`. Token controls type picker auto-stocks Food / Medical / Tools / Armor / Weapons / Drones from catalog UUIDs (`scripts/kiosk-presets.mjs`). Restock from preset on the shop. New Gear folder `src/packs/gear/consumables/` (6 food + 4 chems). Chems spawn Use maneuvers and apply AE / temp Stamina / Taint. Default kiosk plate: `assets/tokens/kiosks/kiosk-merchant.{png,webp}`. **SHIPPED 0.3.65.** No Gold Line `{ force: true }`. No PDF.
- [x] **B119** kiosk presets + consumables (module **0.3.65**) — **pending Foundry-verify**. Done when:
  - [x] Preset filters + place/restock + lang/CSS
  - [x] Ten street SKUs with catalog ¥; four chem doses
  - [x] Default kiosk plate on stub + placeKiosk (`assets/tokens/kiosks/kiosk-merchant.webp`)
  - [x] Smoke: `node tools/kiosk-smoke.mjs`
  - [ ] Foundry-verify: place Food / Armor / Weapons kiosks; buy; Use Kickwire on a hero; token shows the street-kiosk plate

### B120 Hacker Agents — sprite parity (2026-09-20)
Spec: `docs/spikes/B120-HACKER-AGENTS.md`. Mirror Compile Sprite for Hackers: **Compile Agent** (3 Bandwidth, Overlay/Jacked In; Linked refuses) + **Decompile Agent** (free maneuver). 12 Actors in `src/packs/summons/agents/` (Probe/Spike/Daemon/Watchdog × minor/int/adv). `scripts/agents.mjs`. Cap 2→3@5→4@8. Distinct from sprites. **SHIPPED 0.3.72.** Sheet icons **0.3.73** (`assets/icons/abilities/compile-agent.svg` / `decompile-agent.svg`). No Gold Line `{ force: true }`. No PDF.
- [x] **B120** Hacker Agents (module **0.3.72**, icons **0.3.73**) — **pending Foundry-verify**. Done when:
  - [x] 12 Agent Actors + Compile/Decompile abilities + L1 class grant
  - [x] `scripts/agents.mjs` registered; Overlay/Jacked In gate; cap; dismiss
  - [x] RAW 19 + Wire + glossary, rulebook 08/20/18, manuscript L1/slang/chargen, journals + VOIDMARK index
  - [x] Smoke: `node tools/hacker-agents-smoke.mjs`
  - [x] Compile/Decompile (and Kessic embeds) `img` is a module SVG under `assets/icons/abilities/`
  - [ ] Foundry-verify: Overlay Compile Agent → Spike token; Linked refuses; cap 2; Decompile removes token+Actor; sheet shows the two ability icons

### Mule-Bot named Actor (2026-09-20)
Michael: “Bug: Mulebot is treasure? It should be an actor.” The Vehicles pack SKU was `type: treasure` with no named Summons Actor — only generic **Drone (Medium)** reused the cargo plate. **SHIPPED 0.3.73.** Named Actor `src/packs/summons/machines/mule-bot.json` (`kind: drone`, Wire Kit / Connect, industrial hauler plate). Buy SKU stays in Vehicles; Deploy prefers named SKU `dsid` then the scale band. Generic Drone (Medium) is not Mule-Bot. No Gold Line `{ force: true }`. No PDF.
- [x] **Mule-Bot Actor** (module **0.3.73**) — **pending Foundry-verify**. Done when:
  - [x] Named Actor in Summons › Machines (not treasure-only)
  - [x] Vehicles Item still the ¥ / Deploy SKU; UUID link both ways
  - [x] Wire Kit embedded; `isDroneActor` true
  - [x] Smoke: `node tools/mulebot-actor-smoke.mjs`
  - [ ] Foundry-verify: drag Mule-Bot from Summons onto a Scene; Deploy from the Vehicles SKU; Connect works; generic Drone (Medium) is still the band template

### B32 Phase 5 — Hacker node / ICE Director templates (2026-09-17)
Spec: `docs/spikes/B32-PHASE5-HACKER-NODE-TEMPLATES.md`. New `scripts/wired-node-templates.mjs` exports **`RATING`** (System Stat Card, moved out of `wired-console.mjs` — the Console now imports it, single source of truth) and **`NODE_TEMPLATES`**: `node-t1-r1…r5` and `node-t2-r1…r5` with `id, name, track, rating, integrityMax, biofeedback, ice, breachDC, description, notes`. **Track 1** templates follow 08-hacker.md: no Integrity pool, ICE, or biofeedback (`null`; the Console hides them). **Track 2** carry Integrity 12/18/26/36/50, biofeedback 3/5/8/13/22, and the ICE sketch. **Wired Console:** GM **Add template…** button (layers icon) in the Nodes header → pick one of the 10 → a hidden node is pushed onto `wiredBoard.nodes` through the same `#makeNode` / `#updateBoard` path as Add Node, with Description and Notes pre-filled. Add Node / Random Node / Generate Cluster unchanged; `module.api.NODE_TEMPLATES` exposed. **Director reference:** `docs/directors/wired-node-templates.md` (no journals pack exists, so no Journal pages). **Deferred:** node Actor scaffolds under `summons/nodes/` (optional D, skipped).
- [x] **B32 Phase 5** node templates (module v0.1.45) — **Foundry-verified 2026-09-17**. Done when:
  - [x] GM Add template adds each of the 10 with correct track / rating / Integrity / ICE text
  - [x] Track 1 templates show no Integrity bar; Track 2 show the table's Integrity max
  - [x] Add Node and Random Node still work
  - [x] Board nodes persist on Scene flags after a reload

### B32 Phase 5b — Node tokens on the canvas + linked Wired map (2026-09-17)
Spec: `docs/spikes/B32-PHASE5B-NODE-TOKENS-WIRED-MAP.md`. **Wired map:** a matrix map Scene sets `flags.draw-steel-ghostwire.wiredMapFor = <boardSceneId>` from the Console header's **Wired map for** select (GM); the Console reads/writes that board while the roster stays on the viewed Scene. **Node tokens:** two npc templates in `src/packs/summons/nodes/` (*Wired Node (Track 1)* / *(Track 2)*, `kind: "node-template"`; folder renamed "Wired Nodes"). New `scripts/wired-node-tokens.mjs`: **Place on canvas** imports the track template into a linked world Actor (Wired Nodes folder) and a token at the view centre on the viewed Scene — hidden unless revealed, Track 2 Stamina = Integrity with bar1, Track 1 1/1 with no bar, level = Rating; Actor flags `{ kind: "node", boardSceneId, nodeId, track }`. **Remove from canvas** deletes tokens + Actor. **Sync:** board writes update placed Actors/tokens (name, Rating, Integrity, track/bar, hidden) with only-changed fields; a GM Stamina change on a node Actor writes Integrity back (sync updates carry an option flag, so no loops); deleted nodes / reset boards remove Actors; deleting the last token removes the Actor. Existing Console tools unchanged. Foundry notes: `18-wired-foundry.md`.
- [x] **B32 Phase 5b** node tokens + Wired map (module v0.1.46) — **Foundry-verified 2026-09-17**. Done when:
  - [x] A matrix map linked to a meatspace Scene shows and edits that board
  - [x] Place on canvas: hidden token on the viewed map; Track 2 Integrity bar; Track 1 no bar
  - [x] Console damage and token damage stay in sync
  - [x] Reveal unhides the token (chat card still posts)
  - [x] Remove from canvas / delete node / reset board clean up tokens and Actors
  - [x] `node tools/build-packs.mjs` succeeds



### Backlog - Ghostwire Bestiary / NPC Compendium (LOCKED 2026-09-17)

Director-facing monster/NPC pipeline for Ghostwire (not stock fantasy dump).

1. **Review** Draw Steel Monsters + NPC lists: tag each as Keep (reskin), Adapt (heavy theme), or Skip.
2. **Create** new themed Actors for **The Reach**, surrounding **wild jungles**, and Ghostwire setting threats (corps, streets, Wire-adjacent, Veil-adjacent as needed) using DS bestiary math as the template where stock creatures don't fit.
3. **Ship** a Foundry **Bestiary / NPC** Actor pack (or folder tree under a new compendium) containing only reviewed keepers + Ghostwire originals — so the table knows every entry has been approved for the setting.
4. **Docs:** master inventory (e.g. `docs/masters/GHOSTWIRE_BESTIARY.md`) listing keep / adapt / skip / original with source DS creature when applicable.

- [ ] DS monster/NPC review pass (Keep / Adapt / Skip)
- [ ] Reach + jungle + setting original creature wave
- [ ] Foundry Ghostwire Bestiary/NPC pack with only reviewed entries
- [ ] `GHOSTWIRE_BESTIARY.md` master

### Backlog - Ghostwire Bestiary / NPC Compendium (LOCKED 2026-09-17)

Director-facing monster/NPC pipeline. **Doctrine: reskin first.**

1. **Review** Draw Steel Monsters + NPC lists into Keep (reskin) / Adapt / Skip.
2. **Reskin Keepers:** Ghostwire name, description, and fiction; keep DS mechanics/stats as the spine (retune numbers only when fiction forces it). Placeholder art/tokens OK.
3. **Adapt** only when stock needs structural changes to fit the Reach.
4. **Later:** greenfield Reach / wild jungles / setting originals.
5. **Later still:** artwork / token pass.
6. **Ship** Foundry Bestiary/NPC Actor pack with only reviewed entries.
7. **Docs:** `docs/masters/GHOSTWIRE_BESTIARY.md`.

- [ ] DS monster/NPC review pass (Keep / Adapt / Skip) — **B38 proposal done, pending Michael review** (187 Keep / 224 Adapt / 56 Skip / 16 Defer-hazard; `GHOSTWIRE_BESTIARY_DS_INVENTORY.md`)
- [ ] Reskin wave (mechanics + description + stats; placeholder art) — **B38 wave 1: 35 Actors in `bestiary` pack, pending Foundry verification**
- [ ] Reach + jungle + setting original creature wave
- [ ] Artwork / token pass
- [ ] Foundry Ghostwire Bestiary/NPC pack (reviewed only) — **B38 scaffold + wave 1 built (module v0.1.50), pending Foundry verification**
- [ ] GHOSTWIRE_BESTIARY.md master — **counts + wave 1 list added (B38)**

#### B38 Bestiary review + reskin wave 1 (2026-09-17)
Spec: `docs/spikes/B38-BESTIARY-REVIEW-RESKIN-WAVE1.md`. **Part A:** all 483 rows of `GHOSTWIRE_BESTIARY_DS_INVENTORY.md` have a Decision, Ghostwire name (Keep/Adapt), and region + notes; rules and counts in `GHOSTWIRE_BESTIARY.md`. **Part B:** new Actor pack `bestiary` registered in `module.json` (label “Ghostwire Bestiary”, PLAYER NONE / ASSISTANT OWNER), six region folders with 16-character ids. **Part C:** 35 Actors cloned from the Draw Steel monsters pack — 11 street / corp / Veil-cult Humans, the 7 first-echelon Rivals as Ghostwire classes, 5 Ironclad (War Dog) troops, 4 Undead, 2 Chrome Raiders, 2 Signal Talkers, 4 jungle / feral animals. System stats, embedded abilities, and effects are byte-identical to Draw Steel except for faction names in ability prose; names, token names, and biographies are Ghostwire lang keys; flags `bestiary = { dsSourceId, dsSourceName, decision, region }`. Placeholder art; ability names / rules text pass later.
- [ ] **B38** wave 1 (module v0.1.50) — **implemented, pending Foundry verification**. Done when:
  - [ ] Ghostwire Bestiary shows the six folders and 35 Actors
  - [ ] Spot-checked Actors show Ghostwire fiction with Draw Steel math intact
  - [ ] A Rival and street muscle drag onto a Scene
  - [ ] No unreviewed stock names on pack Actors
  - [ ] Michael reviews / corrects the Decision column

#### B38c Bestiary firearms / chrome ability pass (2026-09-17)
Spec: `docs/spikes/B38c-BESTIARY-FIREARMS-CHROME-PASS.md`. 25 humanoid / Chrome Raider Actors in `src/packs/bestiary/` get Ghostwire ability names, rules text, icons, and biographies (firearms, grenades, stims, chrome, decks); Draw Steel damage tiers, potencies, targets, and Malice costs unchanged. Melee-only gun signatures become Melee X or Ranged 5/10 (`meleeRanged`); `magic` keyword dropped where fiction became tech. Undead, wilds, and Signal Talker natural attacks untouched. Per-Actor table + conventions (standing rule) in `GHOSTWIRE_BESTIARY.md`.
- [x] **B38c** (module v0.1.51) — **Foundry-verified, committed `08e63bf`**. Done when:
  - [x] Gang Boss, Corp Enforcer, Corp Security Officer, Ironclad Conscript, Rooftop Shooter, Trick Shooter show firearms / chrome ability names
  - [x] Street Cutter shows holdout + mono-knife; Gang Raider has no handaxes
  - [x] Feral Beast / Zombie still have natural attacks
  - [x] Corp Enforcer + Gang Boss dragged to a Scene; abilities roll
  - [x] Master notes the firearms doctrine

#### B38b Bestiary originals Wave 2a — Ossian Reach Handbook (2026-09-17)
Spec: `docs/spikes/B38b-BESTIARY-ORIGINALS-WAVE2.md`. **20 new Actors** adapted from Draw Steel spines onto Handbook threats (DS math intact; names, rules text, icons, biographies rethemed; firearms / chrome doctrine applied). Reach Streets: Colors Boss, Chrome Bruiser, Street Doc, Wrench Rigger, The Warlord, Razorline Prime. Corp & Security: Response Lieutenant, Corp Netrunner, Contract Enforcer (Handbook “Corp Enforcer”, renamed vs Wave 1), Ironclad Warden. New **Reach Critters** folder: Chrome-Rat, Tunnel-Bat, Scrap-Hound, Sink-Crawler, Gutter-Serpent. Wilds & Jungles seeds: Canopy-Stalker, Reach Behemoth. Wire & Machine: Watchdog ICE, Scrambler ICE, Black ICE. Humanoids get the Human (or Ironclad) Malice set; beasts / ICE carry no ancestry Malice. Each biography has a Director note mapping Handbook Tier → DS level / echelon. Flags add `handbookName` + `echelon`, `decision: "Adapt"`. Spines + status in `GHOSTWIRE_BESTIARY.md` § Originals.
- [x] **B38b** Wave 2a (module v0.1.52) — **Foundry-verified, committed `02121c4`**. Done when:
  - [x] Ghostwire Bestiary shows Reach Critters folder + Wave 2a Actors (Colors Boss, Chrome Bruiser, Canopy-Stalker, Reach Behemoth, Scrap-Hound at minimum)
  - [x] Three humanoids show gun / chrome ability names and roll
  - [x] A critter + Canopy-Stalker have natural attacks
  - [x] Contract Enforcer biography explains the split from Wave 1 Corp Enforcer
  - [x] The Warlord or Colors Boss + Ironclad Warden dragged to a Scene

#### B38b.1 Named lore bosses (2026-09-17)
Spec: `docs/spikes/B38b1-NAMED-LORE-BOSSES.md`. Five named level-bosses from the Lore Source, adapted from Draw Steel spines with full Director biographies (stratum, hook, holds, answers to / leans on, table use) and Draw Steel negotiation values: **Mama Cassavir** (Reach Streets; identity lock 2026-09-20 / 0.3.48: Cyborg hacker Controller, not Rival Tactician / Human Malice → L5 elite controller; Michael split-face portrait `bestiary/mama-cassavir.webp`), **Warden Krael** (Corp & Security, Devil High Judge → L6 leader), **The Ferryman** (Reach Streets, Time Raider Tyrannis → L3 leader), **The Choirmother** (Reach Streets, High Elf Ordinator → L3 leader; Mid default, Early / Mid / Late (Fallen) dial in the Director bio), **Cael Marrow** (Wilds & Jungles, Wode Elf Warleader → L3 leader). Firearms / chrome doctrine applied; Human Malice on human-keyword bosses (Cassavir is cyborg as of 0.3.48 — no human malice); flags `decision: "Original"`, `role: "named-boss"`, `loreName`.
- [x] **B38b.1** (module v0.1.53) — **Foundry-verified, committed `84a104f`**. Done when:
  - [x] Compendium shows Mama Cassavir, Warden Krael, The Ferryman, The Choirmother, Cael Marrow
  - [x] Cassavir reads social-first; Ferryman or Marrow combat abilities are guns / chrome
  - [x] Choirmother Director bio has the Early / Mid / Fallen dial, default Mid
  - [x] Two dragged to a Scene; sheets open; abilities usable
  - [x] Master § D marked shipped
- [ ] **B38b Wave 2b** — Nyx Fixer, The Ripper, Null-Prophet, Stall-Keeper / Flats Worker / Chore-Sprite, Data-Sprite / Wisp / Ghost-in-the-Wire.

#### B39 Director Run Generator v1 (2026-09-17)
Spec: `docs/spikes/B39-RUN-GENERATOR.md`; design + as-built: `docs/directors/run-generator.md`. ApplicationV2 popup in the Wired Console family: Token controls › **Run Generator** (GM-only button, unbound GM keybinding, `game.ghostwire.openRunGenerator()`). Dials: run name, hero level, echelon (auto / override), run type (8 + Wilds Survey stub), stratum (Crown → Wastes–Outer Wall), heat, Wired intensity (auto / none / Overlay / Jacked-in), seed. Generate / Reroll / Create Journal. Pure seeded generator `scripts/run-tables.mjs` over JSON tables in `scripts/data/runs/` (run types, strata, patrons, Economy pay bands, opposition map). Opposition resolves against the live `bestiary` pack by name and Draw Steel level; ICE ladder Watchdog → Scrambler → Black ICE for Jacked-in runs; escalation ladders by stratum. Journal: Ghostwire Runs folder, pages Brief / Pay / Beats / Opposition / Support / Scenes, params in `flags.draw-steel-ghostwire.run`. Offline check: 4,608 dial combinations generate without errors, unfilled tokens, empty opposition, or unresolved Actor names; same seed reproduces.
- [x] **B39** Director Run Generator v1 — **Done** (Foundry-verified; module v0.1.54+)
  - [ ] GM opens Run Generator from scene controls; players don't see it
  - [ ] Flats + Extraction + medium heat + level 3 → Brief, ¥ band, beats, opposition (e.g. Colors Boss / Chrome Bruiser)
  - [ ] Create Journal appears under Ghostwire Runs with params in flags
  - [ ] Data Steal + Jacked-in shows the Watchdog → Scrambler → Black ICE ladder
  - [ ] Same seed reproduces; Reroll differs
  - [ ] Wired Console still opens and works

## Backlog add (2026-09-17)

- **B38** Bestiary review + reskin Wave 1 — **Foundry-verified** (module v0.1.50; 35 Actors).
- **B38c** Bestiary firearms / chrome ability pass — **Foundry-verified** (module v0.1.51).
- **B38b** Handbook originals Wave 2a — **Foundry-verified** (module v0.1.52; 20 Actors).
- **B38b.1** Named lore bosses — **Foundry-verified** (module v0.1.53; 5 Actors). Wave 2b next.
- **B39** Director Run Generator v1 - **Done** (Foundry-verified; module v0.1.54+) - `docs/directors/run-generator.md`.
- Wilds Pandora-like lore pass — later; ship only Canopy-Stalker + Reach Behemoth seeds until then.
- **B40** Ability/weapon/gear SFX — **built at 0.1.66, pending Foundry-verify**: `scripts/sfx.mjs`, settings + keyword map + per-item FilePicker override, firing on the system's `abilityUse` chat part. Core placeholder sounds only; custom files drop into `assets/sfx/` later. `docs/directors/ability-sfx.md`. Spike: `docs/spikes/B40-ABILITY-SFX.md` (**spike live**).
- **B41** Wired node topology minimap — **built 0.1.79, pending Foundry-verify**: `scripts/wired-minimap.mjs` player ApplicationV2 over the Console board (revealed nodes only; Overlay compact / Jacked In large + client canvas dim; node links deferred to v1.1). `docs/directors/wired-node-minimap.md`.
- **B42** RAW master rulebook `docs/raw/` (no lore/art) — **first full assemble done, pending Michael review** (docs-only; no module bump). Flags: `docs/spikes/B42-RAW-REVIEW-FLAGS.md`.
- **B42b** Foundry Journal pack **Ghostwire Rulebook** (`packs/rulebook`) mirroring `docs/raw/` — **built 0.1.55, pending Foundry-verify**. One JournalEntry per RAW chapter (Front Matter / Shared Core / Hero Building / Classes / Ghostwire Systems folders + a Rulebook Index), one markdown page per `##` section, chapter refs as `@UUID` links. Source of truth stays `docs/raw/`: `node tools/raw-to-journals.mjs` then `node tools/build-packs.mjs` (Foundry closed). Spike: `docs/spikes/B42b-RULEBOOK-JOURNALS.md`.
- **B98** Journal regen after Rulebook 0.4.0 + B91 gang signs — **built 0.3.24, pending Michael Foundry-verify**. Rules pack regenerated text-only (adds `26` Lifestyle; Ghostwire-only index; In Foundry sidebars kept). New **Ghostwire Lore** pack from `docs/manuscript/01-lore/` with 18 in-tree plates (L1 fillers, L2 opener, L3 gangs + Flats map, VOIDMARK, Hands Off). Peoples species plates still ART GAP (local). Handbook / Wired Flats packs left as-is. Spike: `docs/spikes/B98-JOURNAL-REGEN-RULES-LORE-ART.md`.
- **B101** Vehicle + drone token art — **SHIPPED 0.3.31, pending Foundry-verify**. Spike: `docs/spikes/B101-VEHICLE-DRONE-TOKEN-ART.md`. 36 drone + 32 vehicle WebPs; `tools/apply-machine-token-art.mjs`; vehicles-pack `img` + LevelDB rebuilt.
- **B102** Armor + weapon item art — **SHIPPED 0.3.32, pending Foundry-verify**. Spike: `docs/spikes/B102-ARMOR-WEAPON-ITEM-ART.md`. 22 armor/shield + 49 weapon WebPs; `tools/apply-gear-token-art.mjs`; gear + pregen `img` + LevelDB rebuilt.
- **B103** Bestiary + L≤4 summon portrait art — **SHIPPED 0.3.35, pending Foundry-verify**. Spike: `docs/spikes/B103-BESTIARY-HUMANOID-PORTRAITS.md`. 40 bestiary + 17 summon WebPs; `tools/apply-bestiary-portrait-art.mjs`; Actor `img` + `prototypeToken.texture.src` + LevelDB rebuilt. Michael approved shipping. **0.3.48** adds Mama Cassavir’s split-face portrait (apply-tool scope 58).
- **B111** ARG Argent Exchange bestiary portraits — **SHIPPED 0.3.47, pending Foundry-verify**. Spike: `docs/spikes/B111-ARG-TOKEN-ART.md`. Three Actors (Enforcer / Lieutenant / Officer); `bestiary/arg/` PNG+WebP; faction flag `arg`; Deadhead opposition names. No Gold Line scene rewrite.
- **B112** Scene → Wire auto-nodes — **SHIPPED 0.3.49, pending Foundry-verify**. Spike: `docs/spikes/B112-SCENE-WIRE-AUTO-NODES.md`. Console GM button; Light Control + Maglock + Cam Controls from named lights / wall doors; B113 art stamped on those tokens.
- **B113** Light Control / Maglock token art — **SHIPPED 0.3.49, pending Foundry-verify**. Spike: `docs/spikes/B113-LIGHT-MAGLOCK-TOKEN-ART.md`. Michael YES art: eight styles under `assets/tokens/wired/node-*.webp` (1254² PNG sources alongside). Generic Track 1/2 templates unchanged when `tokenStyle` is empty.
- [x] **B116** Node token library — **SHIPPED 0.3.49, pending Foundry-verify**. Spike: `docs/spikes/B116-NODE-TOKEN-LIBRARY.md`. Catalog `assets/tokens/wired/library.json` (8 device styles); Console Token art select; Auto Light/Maglock/Cam keep locked defaults. Megacorp Host skins **0.3.54**.
- **B116** Wire Atlas topology — **SHIPPED 0.3.50 (docs + journal) / 0.3.51 (Michael atlas art), pending Foundry-verify**. Spike: `docs/spikes/B116-WIRE-ATLAS.md`. RAW + Rulebook journal. Catalog `assets/tokens/wired/node-relay|host|segment` (png+webp, `placeholder: false`). Mama **0.3.48**; Wired Gold Line **0.3.49** (PR **#34**). No Gold Line rewrite. PDF later.
- **B114** Node-map readability — **SHIPPED 0.3.49, pending Foundry-verify**. Spike: `docs/spikes/B114-NODE-MAP-READABILITY.md`. Force/cluster layout, collision, zoom/pan, dense pills.
- **B115** NPC Wire Kit — **SHIPPED 0.3.49, Connect interface 0.3.68, pending Foundry-verify**. Spike: `docs/spikes/B115-NPC-WIRE-KIT.md`. Droppable feature marks NPCs/drones Wire-capable (and is a Connect interface); Console / HUD stamp. No bestiary default. Verbs stay on the applet.
- **B117** Matrix Verbs from the node the player faces — **SHIPPED 0.3.53, pending Foundry-verify**. Spike: `docs/spikes/B117-CONSOLE-MATRIX-VERBS.md`. All nine on the node applet (Console shares the fire path); stripped from sheets, pregens, defaultItems, Wire Kit stamp, and Mama. Connect needs a tagged Wire interface, **Wire Kit**, or Technomancer. No Gold Line rewrite.
- **B118** Scene kiosk merchant — **SHIPPED 0.3.59, pending Foundry-verify**. Spike: `docs/spikes/B118-SCENE-KIOSK-MERCHANT.md`. Actor stub kiosk; proximity-gated shop; ¥ from `system.hero.wealth`; Item copied to buyer. Director note: `docs/directors/scene-kiosk-merchant.md`. No Gold Line rewrite.
- **B119** Kiosk type presets + street consumables — **SHIPPED 0.3.65, pending Foundry-verify**. Spike: `docs/spikes/B119-KIOSK-PRESETS-CONSUMABLES.md`. Type picker + Restock; catalog filters; `src/packs/gear/consumables/`; chem Use maneuvers. No Gold Line rewrite.
- **B104** Deadhead Foundry run pack — **SoR + empty pack scaffold 0.3.33**; **Gold Line map notes + Scene 0.3.36 (B106)**; **cargo remap folded 0.3.40**; **Director journal 0.3.42**; **Beat 0 hangout Scene 0.3.43 (B107) REMOVED permanently 0.3.55**; **Wire ping + Technomancer Whiteout 0.3.45**; **auto-nodes + node-map + Wire Kit + node library 0.3.49 (B112 / B113 / B114 / B115 / B116)**; **Wire Atlas 0.3.50**; **atlas token art 0.3.51**; **Gear SKUs 0.3.52**; **Nox trash freighter + aerial recon 0.3.54**. Spikes: `docs/spikes/B104-DEADHEAD-FOUNDRY-RUN-PACK.md`, `docs/spikes/B107-DEADHEAD-HANGOUT.md` (**KILLED**), `docs/spikes/B106-WIRED-CONSOLE-WIRE-PING.md`, `docs/spikes/B109-TECHNOMANCER-DECKLESS-PAYLOADS.md`, `docs/spikes/B112-SCENE-WIRE-AUTO-NODES.md`, `docs/spikes/B113-LIGHT-MAGLOCK-TOKEN-ART.md`, `docs/spikes/B114-NODE-MAP-READABILITY.md`, `docs/spikes/B115-NPC-WIRE-KIT.md`, `docs/spikes/B116-NODE-TOKEN-LIBRARY.md`, `docs/spikes/B116-WIRE-ATLAS.md`. Director SoR `docs/directors/runs/deadhead/DEADHEAD-GOLD-LINE.md` + sidecar `GOLD-LINE-CARGO-REMAP.md` (LOCKED). JournalEntry pack `runs` (label **Ghostwire Runs**, GM-only) with intra-pack folder **Deadhead**. **Gear SKUs shipped 0.3.52** (Mama’s Deadhead Brief + ARG Courier Capsule in **Ghostwire Gear → Plot & Run Hooks**; gallery art, not regenerated). Hangout Scene **REMOVED permanently 0.3.55** (do not reintroduce); canyon **SKIPPED** — narrated; Mama reused; Gold Line is Michael’s live Scene. No Trace −1 class abilities. Cargo maglev — not a passenger train. Do not overwrite Gold Line walls/lights/tiles.
- **B106** Deadhead Gold Line dual-Hammerhead map pack — **SHIPPED 0.3.36, loop hotfix 0.3.37, cargo 0.3.40, live-scene lock 0.3.41, pending Foundry-verify**. Spike: `docs/spikes/B106-GOLD-LINE-MAP-PACK.md`. **Number collision:** Wire ping/spoof is a separate spike `docs/spikes/B106-WIRED-CONSOLE-WIRE-PING.md` (**0.3.45**) — keep both filenames.
- **B109** Technomancer deckless payloads (Whiteout parity) — **SHIPPED 0.3.45, pending Foundry-verify**. Spike: `docs/spikes/B109-TECHNOMANCER-DECKLESS-PAYLOADS.md`. Magazines compile onto Wired Native (resonance/body). Sabbat Vane Whiteout ×2 compiled; not an auto-grant.
- **B42c/B42d/B42e** RAW Passes A–C — locks applied, license + language scrub, class number holes closed from masters/packs (0.1.58, pending review). **B42e1** applied all twelve Michael locks — `docs/raw/` now carries **zero** `[PASS-C NEEDS MICHAEL]` markers. - **B47** Foundry-sync — **done at 0.1.60, pending Michael Foundry-verify**: `lang/en.json` (the prose behind every pack) now matches Pass A/B/C RAW; packs rebuilt; no JSON structure, `_id`, cost or damage value changed. Residual pack-vs-RAW differences are listed in `docs/spikes/B42-RAW-REVIEW-FLAGS.md` and are all cases where the pack already agrees with RAW.
- **B48** Reach random encounter / event RollTables — **built at 0.1.64, pending Foundry-verify**: pack `encounters` (GM-only), 147 rows over Flats / City / Wilds, authored in `docs/masters/encounters/*.md` and generated by `tools/encounters-to-tables.mjs`. No auto-spawn; combat rows link bestiary Actors by `@UUID`. `docs/directors/random-encounter-tables.md`. Spike: `docs/spikes/B48-REACH-ENCOUNTER-TABLES.md` (**spike live**).
- **B49** Equipment → usable ability + SFX link (bug) - `docs/directors/equipment-use-abilities.md`. Spike: `docs/spikes/B49-EQUIPMENT-USE-ABILITIES.md` (**spike live**). — **built at 0.1.68, pending Foundry-verify**: `scripts/equipment-use.mjs`, templates in `scripts/data/weapon-use-templates.json`, 48 of 49 weapons arm (Net-Gun has no damage line).
- **B43** Veil Rituals as DS Projects (explore) — `docs/directors/veil-rituals-exploration.md`.
- **B44** Pregens from Dossiers PDF — `docs/directors/pregens-dossiers.md`. Spike: `docs/spikes/B44-PREGENS-DOSSIERS.md` — **built at 0.1.62, pending Foundry-verify**: packs `pregens` (8 Level 1 Heroes, portraits from the PDF) and `pregen-fiction` (7 origin stories + index), generated by `tools/pregens-to-actors.mjs` and `tools/pregen-stories-to-journals.mjs`. Roster and assumptions: `docs/masters/pregens/ROSTER.md`, `BUILD-NOTES.md`.
- **B44b** Pregens robust fill-out (L1 grants + street gear/chrome/languages) - `docs/spikes/B44b-PREGENS-ROBUST-FILL.md` (**spike live**).
- **B45** Reach Handbook lore Journals + art — **built at 0.1.65, pending Foundry-verify**: pack `reach-handbook` (18 journals / 159 pages / 6 folders) from `docs/setting/reach-handbook/`, with 13 district maps in `assets/reach-handbook/`. Old tier ladders and stat blocks scrubbed to bestiary pointers; the Wired side of the Flats stays in the B46 pack. `docs/directors/reach-handbook-journals.md`. Spike: `docs/spikes/B45-REACH-HANDBOOK-JOURNALS.md` (**spike live**).
- **B46** Wired Flats Matrix Gazetteer Journals — `docs/directors/wired-flats-gazetteer.md`. Spike: `docs/spikes/B46-WIRED-FLATS-JOURNALS.md` — **built at 0.1.61, pending Foundry-verify**: pack `wired-flats`, one journal of 15 pages generated from `docs/setting/wired-flats-gazetteer.md` by `tools/wired-flats-to-journals.mjs`.
- **B47** Foundry-sync packs/lang to Pass A/B/C - `docs/spikes/B47-FOUNDRY-SYNC-PASS-ABC.md` (**spike live**).


| **Wired Flats Gazetteer Journals (B46)** | *The Wired — The Flats* Matrix Gazetteer & Node Key → Foundry Journals (Grid/Barrier, district master nodes, corp fortresses, POI swarm, GM notes). Scrub old rules; keep lore + E1–E4 ICE posture. Stub: `docs/directors/wired-flats-gazetteer.md`. Local SoR: Dropbox `GHOSTWIRE - The Wired  The Flats (Matrix Gazetteer).docx`. | **Built 0.1.61, pending Foundry-verify** |
