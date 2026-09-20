# Corruption & Taint — Director notes (B80)

**Module 0.3.38 · spike `docs/spikes/B80-CORRUPTION-TAINT-TRACK.md` (DESIGN LOCKED)**  
**Player RAW:** `docs/raw/27-corruption-taint.md`

Use this page to run the track. Do not invent a second meter. Band math, the +1/scene cap, the pact exception, and the cleanse ladder are locked in RAW `27`.

## What you are pacing

Taint is **radiation / spiritual fallout**, not a slap on the wrist and not a free mutation shop. Award it when the Word is being defaced — zones, demons, coerced Veil work, willing un-speaking, pacts. Then let cleansing cost a rite or a quest.

**Chrome does not raise Taint.** If a runner installs a cyberarm in a black clinic, spend Body Integrity (`09`). Leave the Taint field alone unless something else in that scene was a stain (a demon in the bay, a Dark pact paid for the surgery).

**Rest never cleanses.** A respite, Recoveries, Lifestyle upkeep, and downtime Recover refill Stamina and the Recovery pool. They do not scrub Taint. If the crew wants the number to drop, they need a Light rite, an Unmaking working, or a quest (`22`, `27`).

## When to award

| Beat | Award | Cap? |
|---|---|---|
| A scene spent lingering in a corrupted zone / Null-ward thin place / dead-air Wired stretch | **+1** (or after a failed Corruption / Instinct endurance test) | Counts toward the **+1/scene** cap |
| Demon touch, curse, Great Dark reach | **+1** unless printed higher | Cap |
| Coerced summon / botched Dark-heavy seal (Veil Price) | As printed; "1 corruption" = **+1 Taint** | Cap unless it is a **pact** Price |
| Willing defacement | **+1** | Cap |
| Dark / infernal **pact** Price, or coerce-aid (any Street Priest pact) | Printed amount, or **+1** | **Ignores** the cap |

A scene that is "walked the Nine and coerced a spirit" is still **+1** unless the coerce is a **pact** Price — then you may add the pact amount on top.

Do not drip Taint for flavor alone. If the crew crosses a stained alley and keeps moving, that is color. If they camp in it, bargain in it, or fail the endurance test, that is a tick.

## Corrupted zones as run hooks

A corrupted zone is a **place that stains**. Use it as the score, the clock, or the tax — not as wallpaper.

**Setup**
- Name the zone and what the Word is forgetting there (comms, courage, memory, flesh).
- Decide the **exposure beat**: end of each scene inside, or one test per scene (Corruption / Instinct). Failure or lingering = **+1** (cap applies).
- Put a **cleanse hook** in reach: a Light-pact contact, a stolen Unmaking rite, a reagent that only grows in the zone. Cleansing can *be* the run.

**Clocks (pick one)**
- **Bleed:** the zone grows one block per unanswered session. Later visits start the crew one band closer to trouble (story pressure — do not auto-raise Taint just for calendar time).
- **Bargain:** something in the zone offers power now (edge, a door, a name) for a **pact** Price. That tick ignores the cap.
- **Quarantine lie:** corp signage calls it a contamination event. Crossing the tape is the job; coming out **Marked** is the receipt.

**Opposition:** use `25` for the fight. Taint is the leftover. Claimed / Hollowed already feed Malice when their costs fire — do not invent a second Malice track.

**Wired dead-air:** a Null-ward stretch of the Wired can stain the same way a thin place does. Overlay / Jacked In does not protect the soul. Chrome does not protect it either.

## Cleanse as a quest

| Band they are in | What you ask of them |
|---|---|
| Marked | A Light-pact downtime rite or Unmaking Mag 1. Cheap is fine; free is not. |
| Stained | Mag 2–3 or a short reagent run. −1 or −2. |
| Claimed | Mag 4 or a dedicated quest. −1 to −3. They cannot hit Clean in one working. |
| Hollowed | Campaign quest. You may drop them to Claimed. You may rule the last points never lift. |

At **Taint 12**, pause. Redemption quest, retirement-as-NPC, or a last-run clock — talk to the player. Do not pull the hero out of their hands.

## Mutants

**Corruption Load stays retired.** A Mutant's optional Corruptive Flaw is cosmetic. They use the same 0–12 track as everyone else. Do not start them at Marked unless the table agreed that hook at chargen.

## Foundry

Open a hero or pregen sheet. **Taint** is a visible **0–12** number input in the **sheet header** and again on **Stats** under **Body Integrity**. The band chip updates live. Owner and GM edit; the flag is `flags.draw-steel-ghostwire.taint`. **Corruption History** is a free-text field on the **Biography** tab (`flags.draw-steel-ghostwire.corruptionHistory`) — fiction notes, not a second meter. Ghostwire does **not** auto-tick on rest, chrome, or zone entry this pass. Band gifts and costs are table rules — no Active Effects.

**Director Taint +1 (0.3.58).** GM-only. Token controls biohazard (same strip as Wired Console / Run Generator), token HUD on a hero, or drag **Director: Taint +1** from **Ghostwire Macros** to the hotbar. Uses targeted tokens if any, otherwise the controlled/selected token. Heroes, or any actor that already has the Taint flag. Calls `incrementTaint(actor, 1)` — clamps 0–12, chat + notify with the new score and band, warns if already at 12. The **+1 per scene** cap stays a table call; the tool does not enforce it. API: `game.modules.get("draw-steel-ghostwire").api.directorTaintPlusOne()`.

If the field and the fiction disagree, the table's last award wins; then set the field to match.

## Pointers

- RAW ladder: `docs/raw/27-corruption-taint.md`
- Unmaking / Price: `docs/raw/22-the-veil.md`
- Ancestry Flaw: `docs/raw/05-ancestries.md`
- Chrome firewall: `docs/raw/09-chrome-body-integrity.md`
