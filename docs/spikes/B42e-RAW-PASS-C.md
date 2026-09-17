# Spike B42e — RAW Pass C (class-specific holes)

**Repo:** draw-steel-ghostwire  
**Depends on:** Pass B on main (`60d98f7`); Pass C backlog in `docs/spikes/B42-RAW-REVIEW-FLAGS.md` ("Pass C backlog").  
**Do NOT commit or push** until Michael Foundry-/doc-reviews.  
After RAW edits: regenerate Journals (`node tools/raw-to-journals.mjs` then `node tools/build-packs.mjs`); bump **one** module patch only if packs change.

## Goal
Close **missing numbers, undefined procedures, and contradictory class rules** in `docs/raw/` class chapters (and sync the same fixes into `docs/rulebook/` / Development Masters when the RAW line is clearly wrong vs SoR). Prefer existing locked sources over inventing math.

## Source-of-truth order (mandatory)
For every hole, resolve in this order and **cite the winner in the flags file**:
1. **Development Master Part 1** for that class (`docs/masters/GHOSTWIRE_*_DEVELOPMENT_MASTER.md`).
2. **Shipped Foundry class pack** ability JSON under `src/packs/` (playable numbers already Foundry-verified).
3. **Draw Steel spine** ability math **by reference** (Conduit / Shadow / Tactician / etc. — do **not** paste MCDM prose).
4. If still missing: leave an explicit `[PASS-C NEEDS MICHAEL: …]` marker in the RAW chapter **and** a row in the flags file. **Do not invent combat math.**

## Work list (from Pass C backlog + residual chapter flags)

### Street Priest (`18-street-priest.md`)
- Fill damage on Smite/Rebuke, Call the Thunder Down, Penance, Beacon of Grace, Drag the Unworthy (and other holy/corruption lines with no dice) from master → Foundry → Conduit spine.
- Faith Is Our Armor: print **four** echelon values (E1–E4), not three.
- Invoke the Pact: replace “per Veil §C3” with concrete middle/high numbers from master/Foundry, or a short local rule if Veil chapter still absent.
- Judgment / Warden’s Grace / Priest’s Ward: amounts from SoR.
- Keep Pass B echelon / result-order wording intact.

### Medic (`15-medic.md`)
- Magnitudes for Toxic Cloud, Chemical Warfare, Nerve Agent, Full Kit Purge, Chemical Interrogation.
- Restock cost/procedure; Field Synthesis “½ step”; Nano-Adrenal “burn 30 Reagents” vs 8th-level cap (fix to master/Foundry; do not leave contradictory caps).
- Align Field Synthesis encounter limits with Street-Doc Make Do if masters already decided.

### Technomancer (`20-technomancer.md`)
- Sprite HP unit: define as Stamina (or the Foundry Actor value); kill undefined “rank HP.”
- Ward-sprite / Harmonic Adjustment “+defense” → Draw Steel equivalent (edge / damage reduction / shield Stamina — pick what Foundry/master uses).
- Attack-sprite: full low/middle/high damage spread.
- Decompile formula vs sprite table: one formula wins (cite).
- Winded-instead-of-Dying / sprites on own initiative / Compile Sprite free vs 3 Resonance: pick the Foundry-verified behavior and write it once.

### Elementalist (`17-elementalist.md`)
- Five 9th-level specialization abilities costing 11 while 11-cost band unlocks at 8th — align cost band labels with unlock level (or retarget costs to the band the progression table grants).
- World-Fissure / World-Sundering duplication: one ability, one block.
- Essence cap double-count: reconcile level-10 24 vs Essence Cap +4 (7th).

### Wrench (`16-wrench.md`)
- “Four cost tracks” vs five table rows — fix prose or table.
- Jump-In: replace “moderate difficulty” with a named Draw Steel test difficulty (easy / medium / hard ± edge/bane) from master/Foundry.
- Unbreakable Hive / Systems Purge: replace d6 / flat-threshold with Power Roll or characteristic test pattern.
- Turn the Building / The Building Remembers: collapse each to **one** definition (Foundry/master wins).

### Commander (`14-commander.md`)
- Missing action types on Battle Cry, Concussive Command, Coordinated Strike, Break Formation.
- Kill “Skill Points”; use skill-pick language already used elsewhere.
- Master of Voice 3d10-keep-2 → standard Power Roll (or document as intentional exception with Michael marker if master insists).
- Fix worked example for The Right Word so it matches the feature.

### Book-wide residual (class chapters only)
- Flat “+1 / +2 to a roll” that should be **edge / bane** (Medic, Wrench, Commander kit/feature lines) — same A14 spirit; Pass B missed these.
- Do **not** reopen A1 ancestry rewrite, full Veil chapter, Followers/Lifestyle, or PDF.

## Also update
- `docs/spikes/B42-RAW-REVIEW-FLAGS.md`: add **Pass C — applied** table (Done / Deferred-to-Michael / cite SoR per item).
- `docs/rulebook/STATUS.md` + FOUNDRY-BUILD-PLAN one-liners: Pass C status.
- Regenerate Rulebook journals if `docs/raw/` changed.

## Out of scope
B40/B41/B43–B46; inventing wilds lore; bestiary; committing/pushing; rewriting Foundry ability JSON unless RAW and pack disagree and pack is wrong (prefer flag for a follow-on Foundry sync spike).

## Done when
- Every Pass C backlog bullet is either filled with a cited number/procedure **or** marked `[PASS-C NEEDS MICHAEL]`.
- No new invented combat math without a cited SoR.
- Journals regenerated if packs changed; module patch bumped only then.
- Checklist printed for Michael; **no commit**.

## Michael checklist
1. Spot-read Street Priest signatures — damage dice present; Faith Is Our Armor has four echelon rows.
2. Spot-read Medic toxin/cloud abilities — magnitudes + restock not “TBD.”
3. Spot-read Technomancer sprites — one HP rule, Compile cost consistent, defense language is DS-shaped.
4. Spot-read Elementalist L8–L9 cost bands + single World-Fissure.
5. Spot-read Wrench Jump-In + one Building feature (no duplicates).
6. Spot-read Commander — no Skill Points; worked example matches The Right Word.
7. Flags file shows Pass C applied table; any remaining rows are clearly Michael decisions.