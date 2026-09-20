# B80 — Corruption / Taint track (DESIGN LOCKED)

**Date:** 2026-09-19  
**Status:** DESIGN LOCKED — do not redesign  
**Bump:** module **0.3.38**  
**Depends on:** cosmos plate (B79) helpful but not required

This file is the SoR for the hero Taint track. Implement it; do not invent a second meter, a mutation catalog, or rest/chrome cleansing.

## What exists today

### Draw Steel
- **Corruption is a damage type** (like fire/cold), not a character meter or moral track.
- No DS hero "corruption points," mutations-from-chaos, or Sanity subsystem in the stock system we ship against.

### Ghostwire already (lore / partial)
- **Lore:** L1 "Corruption & Taint" — theological stain, not metaphor; contracted via demons, pacts, thin places, corrupted zones; cleansed by rite / does not heal with rest.
- **Partial mechanics elsewhere:** Mutant **Corruption Load** (species) is **retired**; Elementalist/Veil **Price** mentions corruption ticks; "corruption" as a damage flavor on some abilities.
- **Gap this lock closes:** a shared **hero track** for all Runners that plays like radiation / spiritual fallout with quest-scale cleansing and dual +/- effects.

## Design locks (Michael 2026-09-19)

- Feels like **radiation** or spiritual fallout: evil acts, unholy places, prolonged exposure.
- **Cleansing can be a quest** (not only a rest / cheap rite).
- **Negative and positive** effects (power with a price; gifts that mark you).
- Fit Ghostwire cosmology: Light / Dark / Prime / Wire / Veil — corruption as **defacement of the Word**, not a separate element.
- Inspiration look is design-only. **Do not name** third-party IP in published text (B78 / B83).

### Hard locks (do not reopen)

| Lock | Rule |
|---|---|
| Track | **Taint 0–12** integer. All heroes, including Cyborgs. Chargen default **0**. |
| Bands | **Clean** 0 · **Marked** 1–3 · **Stained** 4–6 · **Claimed** 7–9 · **Hollowed** 10–12 |
| Scene cap | **+1 Taint maximum per scene** from all non-pact sources combined |
| Pact exception | A **pact** Price (Dark/infernal bargain, coerce-aid, printed pact Taint) may raise Taint by its printed amount in the same scene, even if the cap already fired. Unprinted pact Price = **+1** and still ignores the cap |
| Rest | Rest, Recoveries, Lifestyle, respite, and downtime Recover **never** raise or cleanse Taint |
| Chrome | Chrome install/removal, Body Integrity spend, and Cyborg conversion **do not** raise Taint. Integrity and Taint are separate economies |
| Mutant Load | **Stays retired.** Mutants use this shared Taint track. Optional cosmetic Corruptive Flaw is not Load and has no bands |
| Foundry flag | `flags.draw-steel-ghostwire.taint` = number 0–12 |
| IP | No third-party IP names in published text |
| JSON | BOM-free UTF-8 |

## Track (LOCKED)

**Taint** is a change in what you are. It is not damage, not Stamina, not Body Integrity, and not a second heroic resource.

**Scene** means what the table already calls a scene (a combat, a ritual sealing, a zone traversal beat, or the Director's cut).

### Sources of gain

1. **Exposure** — linger in a corrupted zone, a thin place gone Null-ward, or a dead-air Wired stretch. Typically **+1** when a scene of meaningful lingering ends, or after a failed **Corruption** / **Instinct** endurance test the Director calls.
2. **Direct defacement** — demon touch, curse, Great Dark reach. **+1** unless printed higher.
3. **Veil Price** — coerced summons and Dark-heavy / botched ritual seals. Class text that says "1 corruption" means **+1 Taint**. Elementalist coerced summon: **+1 Taint + 1 spirit-attention per Rank**. Greater Elemental coerced: **+3 Taint + 3 spirit-attention**.
4. **Willing defacement** — Director may award **+1** when a runner chooses un-speaking (murder-as-offering, feeding a thin place, and the like).
5. **Pact** — sealing, invoking, or paying a Dark/infernal pact Price. A Street Priest who **coerces** aid (any pact) pays the dark-path Taint cost. Dark Pact workings that "load corruption" are **+1 Taint** unless printed otherwise.

### What never moves the track

- Chrome install, chrome removal, Body Integrity spend or refund, Cyborg conversion, Frame Modules
- Rest, Recoveries, Lifestyle upkeep, respite, downtime Recover, spending ¥
- Leveling, Victory, characteristic increases

Lore still treats chrome as secular un-speaking (magic erosion / Arcane Severance). That is **not** this meter.

### Cleanse paths

| Current band | Typical path | Typical drop |
|---|---|---|
| Marked (1–3) | Street-Priest **Light** downtime rite, or Unmaking Ritual Working Magnitude **1** (`22`) | **−1** |
| Stained (4–6) | Unmaking Magnitude **2–3**, or a short quest reagent + rite | **−1** or **−2** |
| Claimed (7–9) | Unmaking Magnitude **4**, or a dedicated quest (true sacrifice / turning-back) | **−1** to **−3**; cannot reach Clean in one working |
| Hollowed (10–12) | Campaign quest | May drop to Claimed; may never fully lift in a mortal life (Director) |

A Mutant's inherited **Corruptive Flaw** is ancestry fiction. Reducing Taint does not erase it.

### Band effects (dual +/-)

Apply while current Taint sits in that band. Table rules this pass — **no** Foundry Active Effect automation, **no** mutation catalog.

| Band | Gift (+) | Cost (−) |
|---|---|---|
| **Clean (0)** | None | None |
| **Marked (1–3)** | Edge on tests to sense or identify taint, thin places, demons, and corrupted zones | Once per scene in a clean corp / Concord / "safe" space, when the mark shows, take a bane on one Persona test (Director picks the beat) |
| **Stained (4–6)** | Once per scene, after you damage a creature with a Magic-keyword ability or a corruption-typed strike, that creature takes extra psychic or corruption damage equal to your **level** | Bane on tests to resist demonic influence, Dark bargains, and compulsion. Whenever you tick spirit-attention, tick **+1 extra** |
| **Claimed (7–9)** | Once per scene, gain an edge on one Power Roll. If you do, the Director gains **+1 Malice** or a thin-place-sensitive notices you | Holy / Light-pact damaging abilities against you deal extra damage equal to your **level**. You cannot be reduced below **7** except by a Claimed-or-higher cleanse path |
| **Hollowed (10–12)** | Once per scene, ignore one bane on a Magic-keyword or corruption-typed Power Roll, **or** gain an edge on that roll (player choice) | At the start of each combat, the Director gains **+1 Malice**. Damage weakness **5** against holy (Light-pact) damage. At **12**, the table pauses: redemption quest, retirement-as-NPC, or a last-run clock — Director + player. Do **not** auto-remove the hero |

## Deliverables (this bump)

1. This lock (sources, thresholds, cleanse, +/- , Mutant Load relationship).
2. RAW chapter `docs/raw/27-corruption-taint.md` + index / glossary / Veil / ancestry / chrome / Lifestyle pointers.
3. Director guidance `docs/directors/corruption-taint.md` (corrupted zones as run hooks).
4. Slang glossary: Taint band names; Corruption row points at the track.
5. Foundry: Rulebook journal from RAW; hero sheet **Taint 0–12** + band label on `flags.draw-steel-ghostwire.taint`. New heroes start at 0. No rest hook. No chrome hook.
6. `module.json` **0.3.38**, BOM-free JSON.

## Non-goals (still)

Full mutation catalog; Foundry automation of gain/cleanse/band Active Effects; reprinting other games' tables; a new print-TOC chapter number (print Ch 27 stays Running Ossian Reach). RAW `27` is the systems chapter; print reaches it via the Veil pointer until a later TOC pass.

## As built

| Piece | Where |
|---|---|
| Lock | this file |
| RAW | `docs/raw/27-corruption-taint.md` |
| Director | `docs/directors/corruption-taint.md` |
| Sheet | `scripts/taint.mjs` — header + Stats Taint 0–12; Biography tab **Corruption History** (`flags.draw-steel-ghostwire.corruptionHistory`) |
| Director +1 | `incrementTaint(actor, delta=1)` + GM Token-control / HUD / **Ghostwire Macros** `Director: Taint +1` (0.3.58). Clamps 0–12; per-scene cap is a table call |
| Journal | `src/packs/rulebook/ghostwire-systems/27-corruption-taint.json` |
| Flag | `flags.draw-steel-ghostwire.taint` |
