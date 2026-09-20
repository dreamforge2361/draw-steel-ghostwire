# Corruption & Taint

**RAW status:** draft (B80 lock 2026-09-19)  
**Sources:** `docs/spikes/B80-CORRUPTION-TAINT-TRACK.md` (DESIGN LOCKED), L1 Corruption & Taint (lore only — procedures live here), `docs/raw/22-the-veil.md` (Unmaking / Price), `docs/raw/05-ancestries.md` (Mutant Flaw), `docs/raw/09-chrome-body-integrity.md` (chrome is not this track)

---

## What this chapter covers

**Taint** is the shared hero track for the Dark's foothold in a runner — radiation-like spiritual fallout, not a damage type and not a second Stamina pool. **Corruption** (the damage type) still exists on abilities. This chapter is the meter.

Every runner uses this track, **Cyborgs included**. Chrome, rest, and the retired Mutant **Corruption Load** do not replace it.

> **In Foundry**
> Open a **hero** (or pregen) sheet. **Taint** is a number input **0–12** in two places: a compact row in the **sheet header** (visible on every tab), and a **Taint** fieldset on the **Stats** tab directly under **Body Integrity** (same overlay family as Integrity / Wired). The band chip (**Clean / Marked / Stained / Claimed / Hollowed**) sits next to the input and updates as you change the number. Owner and GM can edit; observers see it read-only. Writes `flags.draw-steel-ghostwire.taint`. New heroes and pregens start at **0**. Rest and chrome install do not move it.
> On the **Biography** tab, **Corruption History** is a free-text notes field next to Biography / Director notes. Write how the stain landed, tells, cleanses, pacts, and debts. It stores `flags.draw-steel-ghostwire.corruptionHistory` (empty by default). It is not a second meter.

## The track

**Taint** is an integer from **0** to **12**. Chargen default is **0**. It does not heal with rest. It must be cleansed, or it stays.

| Taint | Band | Read |
|---|---|---|
| **0** | **Clean** | Unmarked. No gift, no cost. |
| **1–3** | **Marked** | First foothold. Tells show under stress. |
| **4–6** | **Stained** | Settled wrongness. Gifts and costs both show. |
| **7–9** | **Claimed** | The Dark has a hook. Power is easy; leaving is hard. |
| **10–12** | **Hollowed** | The Word is failing in you. Campaign-scale crisis. |

Band effects apply while your current Taint sits in that band. Crossing a threshold changes the band immediately.

A **scene** is what the table already calls a scene: a combat, a ritual sealing, a zone traversal beat, or the Director's cut.

## How Taint is gained

Taint is earned or inflicted where creation and un-speaking touch. It is not caught like a cold.

| Source | Typical award | Notes |
|---|---|---|
| **Exposure** | **+1** | Linger in a corrupted zone, a thin place gone Null-ward, or a dead-air Wired stretch. Award when a scene of meaningful lingering ends, or after a failed **Corruption** / **Instinct** endurance test the Director calls. |
| **Direct defacement** | **+1** unless printed higher | Demon touch, curse, Great Dark reach. |
| **Veil Price** | As printed; else **+1** | Coerced summons and Dark-heavy or botched ritual seals. Class text that says "1 corruption" means **+1 Taint**. Elementalist coerced summon: **+1 Taint + 1 spirit-attention per Rank**. Greater Elemental coerced: **+3 Taint + 3 spirit-attention** (`17`, `22`). |
| **Willing defacement** | **+1** | Director may award when a runner chooses un-speaking (murder-as-offering, feeding a thin place, and the like). |
| **Pact** | Printed amount, or **+1** | Sealing, invoking, or paying a Dark / infernal pact Price. A Street Priest who **coerces** aid (any pact) pays the dark-path Taint cost. Dark Pact workings that "load corruption" are **+1 Taint** unless printed otherwise (`18`). |

### Per-scene cap

**+1 Taint maximum per scene** from all **non-pact** sources combined. A scene that includes both zone exposure and a coerced summon still awards only **+1** unless a **pact** is involved.

### Pact exception

A **pact** Price may raise Taint by its printed amount in the same scene, even if the cap already fired. If no amount is printed, the pact Price is **+1** and still ignores the cap (so a scene can be +1 exposure +1 pact = **+2**).

## What never moves the track

These never raise Taint and never cleanse it:

- **Chrome** — install, removal, Body Integrity spend or refund, Cyborg conversion, Frame Modules (`09`)
- **Rest** — Recoveries, Lifestyle upkeep, respite, downtime Recover, spending ¥ (`04`, `26`)
- **Advancement** — leveling, Victory, characteristic increases (`24`)

**Chrome does not raise Taint.** Chrome is secular un-speaking: it spends Body Integrity and can erode magic. It does **not** stain this track. A Cyborg can still be tainted by demons, pacts, and zones.

## Band effects

Power with a price. Apply the row for your current Taint. These are table rules — apply them when they fire; do not invent a second mutation menu.

| Band | Gift (+) | Cost (−) |
|---|---|---|
| **Clean (0)** | None | None |
| **Marked (1–3)** | Edge on tests to sense or identify taint, thin places, demons, and corrupted zones | Once per scene in a clean corp, Concord, or "safe" space, when the mark shows, take a **bane** on one Persona test (Director picks the beat) |
| **Stained (4–6)** | Once per scene, after you damage a creature with a **Magic**-keyword ability or a **corruption**-typed strike, that creature takes extra psychic or corruption damage equal to your **level** | **Bane** on tests to resist demonic influence, Dark bargains, and compulsion. Whenever you tick spirit-attention, tick **+1 extra** |
| **Claimed (7–9)** | Once per scene, gain an **edge** on one Power Roll. If you do, the Director gains **+1 Malice** or a thin-place-sensitive notices you | Holy / Light-pact damaging abilities against you deal extra damage equal to your **level**. You cannot be reduced below **7** except by a Claimed-or-higher cleanse path |
| **Hollowed (10–12)** | Once per scene, ignore one **bane** on a Magic-keyword or corruption-typed Power Roll, **or** gain an edge on that roll (player choice) | At the start of each combat, the Director gains **+1 Malice**. You have damage weakness **5** against holy (Light-pact) damage. At **12**, the table pauses: redemption quest, retirement-as-NPC, or a last-run clock — Director and player. Do **not** auto-remove the hero |

Visible tells (greying flesh, static in the voice, features that drift) are Director color on top of the row. They are not a second economy.

## How Taint is cleansed

Rest never cleanses Taint. Cleansing is a rite, an Unmaking working, or a quest.

| Current band | Typical path | Typical drop |
|---|---|---|
| **Marked (1–3)** | Street-Priest **Light** downtime rite, or Unmaking Ritual Working Magnitude **1** (`22`) | **−1** |
| **Stained (4–6)** | Unmaking Magnitude **2–3**, or a short quest reagent + rite | **−1** or **−2** |
| **Claimed (7–9)** | Unmaking Magnitude **4**, or a dedicated quest (true sacrifice / turning-back) | **−1** to **−3**. Cannot reach **Clean** in one working |
| **Hollowed (10–12)** | Campaign quest | May drop to **Claimed**. May never fully lift in a mortal life (Director) |

Unmaking is the Ritual Working family that scrubs corruption (`22`). Extra reagents, assistants, and a proper sanctum still grant edges or blunt Price on the sealing — they do not skip the Magnitude gate.

A Light-pact Street Priest can lead a **Marked** cleanse as a downtime rite without a full Magnitude 1 Project when the Director agrees the stain is fresh. Deeper bands need the Unmaking ladder or a quest.

## Mutants and the retired Load

**Mutant Corruption Load is retired.** Mutants use this shared Taint track like every other People.

The optional cosmetic **Corruptive Flaw** (`05`) is ancestry fiction: tells, roleplay, scene color. It has **no Load bands**, costs no ancestry points, and is **not** Taint. Reducing Taint does not erase a Flaw. Being born in a corrupted zone does not force starting Taint; the Director may set a higher starting score as a campaign hook.

## Director notes (short)

Corrupted zones, thin places, and pact clocks are run hooks — how to pace them lives in `docs/directors/corruption-taint.md`. Opposition procedure stays in `25`. Do not invent a second Malice track for Taint; Claimed / Hollowed already feed Malice when their costs fire.

## Pointers

| Topic | Where |
|---|---|
| Unmaking / Ritual Workings / Price | `22-the-veil.md` |
| Elementalist coerced-summon Price | `17-elementalist.md` |
| Street Priest pact / coerce | `18-street-priest.md` |
| Mutant Flaw; Load retired | `05-ancestries.md` |
| Chrome is not Taint | `09-chrome-body-integrity.md` |
| Rest / respite never cleanse | `26-lifestyle-downtime.md`, `04-combat.md` |
| Corruption skill | `02-heroes-characteristics.md` |
| Zone hooks | `docs/directors/corruption-taint.md` |
