# Pregen Walkthrough Audit — Ghostwire Foundry (Director-facing)

**Date:** 2026-09-18 (America/New_York)  
**Module version audited:** `0.1.90` (`dreamforge2361/draw-steel-ghostwire` @ `main`)  
**Actor sources:** `src/packs/pregens/*.json`  
**Cross-checked against:** `docs/masters/pregens/{ROSTER,LOADOUTS,BUILD-NOTES}.md`, class RAW under `docs/raw/` / Development Masters, chrome scripts (`caster-chrome.mjs`, `magic-erosion.mjs`, `free-strikes.mjs`)

**Access note:** This executor could not shell into Windows `machineId a56fac98-0769-4efb-9cbb-fac52eb848bb` (same limitation as the SFX audit). The GitHub `0.1.90` tree matches the post-0.1.88/0.1.89 P0 fix state (integrity flags, `class.system.level = 1`, firearm `bow` tags stripped). A stale copy under `/workspace/gw-audit/pregens/` still showed L0 + bows — treat GitHub/`src/packs/pregens` as source of truth, not that older extract.

**Policy:** Report-first. No pack JSON was edited; no version bump; no git push.

---

## Summary table

| Pregen | Class (subclass) | People | BI spent | Chrome notes | Chassis | Top issues |
|---|---|---|---|---:|---|---|
| **Sabbat Vane** | Technomancer (Sprite-Weaver) | Revenant | 1 | Cyber-Ears **Soft** (1); erosion 0; under soft-cap | **A** | Cleanest caster sheet; ROSTER.md still says “no chrome” |
| **Kaïs Vahn-Estal** | Elementalist (Stormcaller) | Elvani | 0 | Unchromed by design; Hexshot + Storm-Tine | **A** | Solid L1; Zephyr Companion present; no Soft chrome (identity) |
| **Vessa Corran-Dov** | Street Priest (Shepherd) | Corran | 0 | Unchromed by design | **A−** | Strong L1 band picks; Sanctified + Hardshell aligned |
| **Barak Voss-Hallor** | Commander (Street-Fixer) | Goliar | 9 | Cyberlimb Arm 5 + Dermal Plating 4 (Standard) | **B** | Two 3-cost heroics; Hardshell vs Saturation light armor; Chatterbox Restricted/E2 |
| **Wren Sable-Corvin** | Scout (Hunter) | Changer (Raven) | 0 | Unchromed; changer art flags complete | **B** | **Careful Observation is L3** but embedded; legacy DS Shadow ability names |
| **Vira Kellis-Nade** | Wrench (Drone Jockey) | Changer (Rat) | 1 | Datajack Standard (1) | **B** | Kit is **Rigger’s Harness** (Vehicle Rig-Pilot RAW); Drone Jockey expects Fabricator’s Bench |
| **Kessic Draye** | Hacker (Disruptor) | Mutant | 3 | Datajack 1 + Cyber-Eyes 2 (Standard) | **C** | **P0:** Dual Boot (L6) + Backdoor Override (L8) on a L1 sheet |

---

## P0 re-verify (0.1.88–0.1.89) — all seven

| Fix | Status in `0.1.90` sources |
|---|---|
| Integrity flags `{value,max}` + `biSpent`/`biRemaining` | **Pass** — Barak 11/20 (9), Kessic 17/20 (3), Vira 19/20 (1), Sabbat 19/20 (1), others 20/20 |
| `class.system.level = 1` | **Pass** on all seven |
| Firearm `bow` keywords stripped (bands only) | **Pass** on all pregen weapons; genuine bows still correctly tagged under `gear/weapons/bows-exotic/` |

Runtime automation confirmed present: caster soft-cap (`>5` BI → Weave Strain), magic erosion (Soft/3 + Standard/2 + Salvage), free-strike strip, changer form art swap.

---

## Per-pregen findings

### 1. Sabbat Vane — “the Dead Frequency” — **Grade A**

| Checklist | Finding |
|---|---|
| Identity | Technomancer / Sprite-Weaver / Revenant / `sabbat-vane.webp` / **No Kit (Pure Caster)** |
| L1 chassis | Class L1; primary **Resonance**; signatures Compile Sprite, Resonance Mending, Resonance Strike; heroics Recompile (1), Swarm the Signal (3), Resonance Ward (5) — correct 1/3/5 band shape |
| Characteristics | Reason 2, Presence 2, Might 1, Agility 1, Intuition 0 — matches core `[reason, presence]` |
| Resources | Stamina 18, Recoveries 8; Soft 1 BI → **erosion 0**, soft-cap OK |
| Body Integrity | 19/20; Soft grade stamped on Cyber-Ears |
| Gear | Secure Threads (light), Popper (light), Faraday Bag, Pocket Sec, Fake SIN, Standard Rounds — matches LOADOUTS |
| Abilities | L1 set looks complete; no free strikes (module-suppressed — intentional) |
| Languages / culture | RevenantMemorySpeech, ResonanceNotation, WireSpeak, SprawlArgot; Undercity Barrens / Deck Jockey |
| Legacy DS names | None material |

**Correct:** Soft chrome pick, kit doctrine, ability band ladder, BI math.  
**Dubious / docs drift:** `ROSTER.md` still claims five heroes unchromed and omits Sabbat’s Soft ears (LOADOUTS/BUILD-NOTES are current).  
**Fixes:** P2 — refresh ROSTER.md chrome paragraph.

---

### 2. Kaïs Vahn-Estal — “the Static Saint” — **Grade A**

| Checklist | Finding |
|---|---|
| Identity | Elementalist / Stormcaller / Elvani / `kaes-vahn-estal.webp` / **Hexshot** |
| L1 chassis | Class L1; Essence; all 3 signatures (Hurl Element, Elemental Shaping, Read the Weave); Bolt Barrage (3) as Base-band heroic; **Kinetic Enlargement** + **Zephyr Companion** (Stormcaller L1) |
| Characteristics | Reason 2, Presence 2, Might 1, Agility 1, Intuition 0 — OK |
| Resources | Stam 18 / Rec 8; BI 20/20; no erosion |
| Gear | Storm-Tine focus; Zapper + Sleeve-Gun (light only — no bow); no armor (Hexshot `armor: none`) — correct |
| Languages | ElvaniHighCant, ElvaniSoftspeech, CorpCant, ReachMetro; Corp Arcology / Entertainer |

**Correct:** Stormcaller ladder, Hexshot firearm bands, unchromed caster identity.  
**Open (class-wide, not pregen-unique):** Zephyr Companion still needs a summon actor (Development Master known gap).  
**Fixes:** P2 — optional Soft Cyber-Ears if a table wants one Soft implant; P2 — elemental companion actor pack.

---

### 3. Vessa Corran-Dov — “the Preacher of Ninth” — **Grade A−**

| Checklist | Finding |
|---|---|
| Identity | Street Priest / Shepherd / Corran / `vessa-corran-dov.webp` / **Sanctified** |
| L1 chassis | Conviction; Smite/Rebuke, Lay On Hands, Sense the Veil; Blessed Light + Drain as chosen signatures; Minor Rebuke (1), Call the Thunder Down (3), Faith Is Our Armor (5); Shepherd **Warden’s Grace** + **Steady Hand**; Light Pact |
| Characteristics | Presence 2, Intuition 2, Might 1, Agility 1, Reason 0 — OK |
| Resources | Stam **27** (= 18 class + 9 Sanctified) / Rec 8; BI 20/20 |
| Gear | Hardshell (heavy) matches Sanctified `armor: heavy`; Workhorse (light), Street-Blade (light) |

**Correct:** Stamina math, pact, Shepherd L1 pair, armor/kit alignment.  
**Dubious:** None blocking. Prayer Gamble / Priest’s Ward present as class features — acceptable for robust-filled L1.  
**Fixes:** P2 — none urgent.

---

### 4. Barak Voss-Hallor — “the Foreman” — **Grade B**

| Checklist | Finding |
|---|---|
| Identity | Commander / Street-Fixer / Goliar / `barak-voss-hallor.webp` / **Saturation** |
| L1 chassis | Influence; four signatures (Mark, Direct Ally, Read the Room, The Right Word); Field Presence; Fixer’s Web; Advanced Tactics + Undercity Whisper (Street-Fixer L1 triggered) — good |
| Heroics | A Word (1), **Battle Cry (3) + Command Persona/Fearful Awe (3)**, Rally the Crew (5) |
| Characteristics | Presence 2, Intuition 2, Might 1, Agility 1, Reason 0 — OK |
| Resources | Stam 24 (= 21 + 3) / Rec 10; BI **11/20** (9 spent) — math matches Cyberlimb 5 + Dermal 4 |
| Gear | Hardshell (**heavy**) vs Saturation kit `armor: light`; Chatterbox (**heavy**, Restricted / Echelon 2); Knuckles (light) |
| Languages | GoliarBattleCant, SprawlArgot, TradeCant, CorpCant |

**Correct:** Integrity/chrome, Saturation kit legality (vs old Juggernaut), signature quartet, Street-Fixer triggers.  
**Wrong / dubious:**
1. **Two 3-cost heroics** — RAW L1 chooses **one** from the 3-cost band.
2. Armor heavier than kit (documented in LOADOUTS; Director must not stack kit Stam and armor Stam).
3. Chatterbox availability above Street/Professional (documented dead zone).
4. Display name still **“Command Persona / Fearful Awe”** (DS-shaped dual mode — intentional reskin, but title reads legacy).

**Fixes:**  
- **P1** — drop either Battle Cry or Command Persona/Fearful Awe to one 3-cost pick.  
- **P1** — either swap Hardshell → light armor matching Saturation, or leave as fiction and stamp a Director note on the sheet.  
- **P2** — Street/Professional heavy firearm SKU so Chatterbox isn’t forced.

---

### 5. Wren Sable-Corvin — “the Kite” — **Grade B**

| Checklist | Finding |
|---|---|
| Identity | Scout / Hunter / Changer Raven / `wren-sable-corvin.webp` + beast/hybrid art flags |
| L1 chassis | Advantage; Hunter Quarry + Ranged Reflex + Steady the Scope; signature **Gasping in Pain**; Disorienting Strike (3), Coup de Grâce (5); Hesitation Is Weakness (1 Adv free triggered — **correct** L1 class feature) |
| Overgrant | **Careful Observation** embedded — RAW grants this at **3rd level**, not 1st |
| Characteristics | Agility 2, Reason 2, Might 1, Intuition 1, Presence 0 — OK |
| Resources | Stam 18 / Rec 8; BI 20/20 |
| Gear | Armored Jacket (light) despite Longshot `armor: none` (documented spike choice); Longshot rifle (medium), Popper (light) — no bow tags |
| Changer | Forms + Raven + Beast Movement + Beast Hide + Pack Guard + Feral Cry; art triad present |
| Legacy DS | Gasping in Pain, Disorienting Strike, Coup de Grâce, Hesitation Is Weakness — Shadow SRD names, not Ghostwire-reskinned |

**Fixes:**  
- **P1** — remove Careful Observation from the L1 pregen (or gate behind level).  
- **P1** — Ghostwire-reskin the four Shadow-named abilities (titles + prose).  
- **P2** — resolve Longshot armor:none vs Armored Jacket (pick one doctrine).

---

### 6. Vira Kellis-Nade — “the Warren-Wire” — **Grade B**

| Checklist | Finding |
|---|---|
| Identity | Wrench / Drone Jockey / Changer Rat / default `…-human.webp` + full changer art flags |
| L1 chassis | Uptime; Deploy & Command, Rigged Fire, Field Repair, Override Ping; Wide Band + Salvage Sense + Swarm Launch; Taser Swarm (1) Base-band heroic |
| Kit | **Rigger’s Harness** on sheet — RAW Drone Jockey starter is **Fabricator’s Bench**; Rigger’s Harness is Vehicle Rig-Pilot |
| Chrome | Datajack Standard 1 BI — legal; no caster erosion (Wrench is non-Veil) |
| Changer | Forms + Rat + Beast Hide + Pack Guard + Feral Cry + **Savage Burst** (Wren lacks Savage Burst — different trait budget, OK if points allow) |
| Gear | Secure Threads, Popper, Fleet Deck (RCC), Targeting Autosoft, Burner, Lockpick Set |

**Fixes:**  
- **P1** — swap kit to Fabricator’s Bench (or reclass fiction to Vehicle Rig-Pilot if Harness is intentional).  
- **P2** — ensure Fleet Deck / drone summons have usable support actors at the table.

---

### 7. Kessic Draye — “Null” — **Grade C** (worst)

| Checklist | Finding |
|---|---|
| Identity | Hacker / Disruptor / Mutant / `kessic-draye.webp` / Nyx “Switchblade” + Street Deck |
| L1 expected (RAW) | Seize Control, Deep Scan, Ghost Signal (3-cost choice); Overclocked Damage; Cascade Strike; Dual Boot is **6th**; Backdoor Override is **8th** |
| L1 actual | Has all L1 programs **plus Dual Boot + Backdoor Override (cost 11)** |
| Characteristics | Reason 2, Intuition 2, Might 1, Agility 1, Presence 0 — OK |
| Resources | Stam 19 / Rec 9; BI 17/20 (3) — Datajack + Cyber-Eyes math OK |
| Gear | Street Deck, Secure Threads, Sleeve-Gun (light), Sneak + Crash payloads, Pocket Sec, Trauma Patch |

**Fixes:**  
- **P0** — remove `dual-boot` and `backdoor-override` embedded abilities from the pregen actor (and regenerate pack).  
- **P1** — audit generator advancement recursion so level-gated programs cannot embed at L1.  
- **P2** — none until P0 cleared.

---

## Cross-cutting issues

1. **Advancement over-embedding (generator)** — Kessic (L6/L8) and Wren (L3 Careful Observation) show the robust-fill pass pulling future grants onto L1 actors. Highest systemic risk.  
2. **Heroic band pick counts** — Barak has two 3-cost picks; most other heroes correctly have one pick per unlocked band.  
3. **Kit vs armor fiction vs RAW** — Barak (heavy on light kit), Wren (armor on none kit), Vira (wrong subclass kit). LOADOUTS documents some; Vira’s kit mismatch is the sharpest RAW break.  
4. **Legacy Draw Steel naming** — concentrated on Scout (Shadow SRD strings). Commander’s “Command Persona / Fearful Awe” is a dual-mode title that still reads DS.  
5. **Characteristic keys** — Actors store DS keys (`might`/`agility`/`reason`/`intuition`/`presence`); Ghostwire lang maps to Physique/Reflex/Logic/Instinct/Persona. Expected, not a bug — Directors should know the remap.  
6. **Free strikes** — intentionally suppressed module-wide; weapon attacks via B49 equipment-use. Pregens correctly lack Melee/Ranged Free Strike items.  
7. **Caster chrome automation** — Sabbat Soft 1 is the only chromed caster; soft-cap (>5) and erosion formulas are wired and would apply if BI rose. Vessa/Kaïs correctly unchromed.  
8. **Docs drift** — `ROSTER.md` chrome section is stale vs LOADOUTS/BUILD-NOTES/Sabbat Soft ears.  
9. **Summon / fleet actors** — Zephyr Companion, sprites, drones still depend on support packs (known class open items); pregen sheets grant the abilities but Directors need the actors.  
10. **Stamina math** — all seven match `class.starting + kit.stamina` (Wren kit stam null → 18).

---

## Recommended fix queue

### P0 (ship before table use)
1. **Kessic** — strip Dual Boot and Backdoor Override from `src/packs/pregens/kessic-draye.json`; rebuild packs.  
2. Re-smoke: Hacker L1 sheet shows only Seize Control, Deep Scan, Ghost Signal, Cascade Strike, kit signature, Overclocked Damage.

### P1 (next pregen pass)
1. **Wren** — remove Careful Observation from L1 pregen.  
2. **Barak** — keep one 3-cost heroic only.  
3. **Vira** — Fabricator’s Bench (or flip subclass to Vehicle Rig-Pilot).  
4. **Scout reskin** — Ghostwire titles for Gasping in Pain / Disorienting Strike / Coup de Grâce / Hesitation Is Weakness.  
5. **Generator guard** — refuse to embed abilities whose RAW “Gained At” / advancement level exceeds actor level.  
6. Barak armor/kit consistency note or gear swap.

### P2 (polish / content)
1. Refresh `ROSTER.md` chrome table (Sabbat Soft ears; BI spent).  
2. Street/Professional heavy firearm SKU for Barak-class loadouts.  
3. Elemental / sprite / drone companion actors for Kaïs / Sabbat / Vira.  
4. Optional Soft chrome Director variants for Vessa/Kaïs (already sketched in LOADOUTS).  
5. Longshot armor doctrine (none vs Armored Jacket) locked in one place.  
6. Portrait compression pass (BUILD-NOTES: ~36 MB pregen art).

---

## Cleanest → dirtiest (executive)

1. **Sabbat** — cleanest overall  
2. **Kaïs** — clean Stormcaller L1  
3. **Vessa** — clean Shepherd; armor/kit aligned  
4. **Barak** — chrome/integrity excellent; ability/armor nits  
5. **Wren** — art/forms excellent; L3 ability + legacy names  
6. **Vira** — solid Wrench; wrong kit for subclass  
7. **Kessic** — must fix before play

---

*End of audit. Sources: module `0.1.90` pregen JSON + Ghostwire RAW/masters. No files mutated.*

## Fixes applied
- **0.1.91** — Kessic P0 stripped Dual Boot + Backdoor Override.
- **0.1.92** — P1 pregen data fixes:
  - **Wren**: removed embedded L3 ability Careful Observation; kept Hesitation Is Weakness and other L1 Scout/Hunter grants; changer art flags untouched.
  - **Barak**: kept **Battle Cry** (3); removed Command Persona/Fearful Awe (3). LOADOUTS.md does not require Command Persona; Battle Cry is the more iconic Street-Fixer/Commander table presence. Integrity 11/20 intact.
  - **Vira**: swapped kit Rigger’s Harness → Fabricator’s Bench (plus signature Bench-Rigged Shot); Drone Jockey subclass unchanged; datajack/integrity 19/20 intact. Kit bonuses now match Fabricator’s Bench (stam+3, speed+1, melee+1, ranged+1).

- **0.1.93** — Scout title reskins (Wren sheet resolves via lang keys + advancement display names): Gasping in Pain→Breathless Hit, Disorienting Strike→Vertigo Burst, Coup de Grâce→Kill Confirm, Hesitation Is Weakness→Beat the Draw, Careful Observation→Glass the Block, Quarry→Hard Tag. SFX map matches both old and new names.

