# Chrome damage — Suppressed / Damaged / Destroyed

**Module 0.3.113 · backlog F12 · `scripts/chrome-damage.mjs`**
**Inventory that seeded this:** `docs/spikes/F12-CHROME-DAMAGE-INVENTORY.md`
**RAW:** `docs/raw/09-chrome-body-integrity.md` § Suppress / Damage / Destroy
**Smoke:** `node tools/f12-chrome-damage-smoke.mjs`

Before 0.3.113 the table could *talk* about EMP and implant failure but nothing in Foundry wrote a chrome condition. Static jams devices, Zap is biofeedback, the Hacker's whole damage kit is node Integrity, and Resonance Mending mended in prose. This pass closes that: chrome Items now carry a real state, there are programs that write it, and there are paths that clear it.

## The one hard lock

**Destroyed never deletes the Item.**

Deleting a chrome Item runs the install/remove hook in `module.mjs`, which returns 75% of its Body Integrity. That is exactly the wrong outcome for an implant that was blown apart from the inside. So:

- Destroyed chrome **stays on the sheet**, benefits dead, Body Integrity **locked out**.
- A bare delete of Destroyed chrome is **refused** with a warning.
- The only way off the sheet is right-click → **Replace destroyed chrome**, which deletes it and refunds **nothing** — the socket stays spent until a fresh implant goes in.
- The hero sheet shows a line under Body Integrity: *"N Body Integrity is locked out by Destroyed chrome."*

## The four states

Stored on the Item at `flags.draw-steel-ghostwire.chromeState` — *adjacent* to `flags.draw-steel-ghostwire.chrome`, never inside it, so the catalog row (grade / location / integrity / ¥ / availability) stays the immutable SKU data.

| State | Benefit | Cleared by |
|---|---|---|
| **Online** | Normal. | — |
| **Suppressed** | Item's Active Effects switched **off**. | Reboot (a maneuver, or free at the start of the mark's next turn); Resonance Mending; anything better. |
| **Damaged** | Effects stay **on** — the implant works at a **bane** on whatever it drives. The Director applies the bane. | 2-Resonance Resonance Mending; Machine God's Rite; a downtime repair Project. |
| **Destroyed** | Effects **off**, Integrity **locked**, Item stays. | Machine God's Rite; a repair-or-replace downtime Project. 2-Resonance Mending only drops it to Damaged ("minimal function"). |

Implant-granted abilities (Implant Weapon → Spur Strike) go offline with the implant and come back with it. They are never deleted.

## Grade matters: Soft is harder to EMP

Every strike declares a three-rung ladder by power-roll tier. The implant's **grade** then shifts the result one step:

| Grade | Shift |
|---|---|
| **Soft / Bioware** | one step **milder** |
| **Standard / Clinic** | none |
| **Salvage / Used** | one step **worse** |

So the same Pulse that Suppresses a standard datajack does nothing at all to a soft one and **Damages** a salvage one. And Sunder Spike — the only thing in the game that Destroys chrome — **cannot** Destroy Soft bioware at all. Vat-grown tissue does not care about an induction spike; a black-clinic implant pulled off a corpse very much does.

## Hacker programs (matrix payloads)

Three new 1-shot magazine chips, loaded and fired exactly like Static or Zap (Load magazine Craft Project → a **Run \<Payload\>** ability → each run spends a fire).

| Chip | E | ¥ | Availability | Tier 1 | Tier 2 | Tier 3 |
|---|---:|---:|---|---|---|---|
| **Pulse** | 1 | 1,200 | Restricted | — | Suppressed | Suppressed |
| **System Rot** | 2 | 3,500 | Restricted | Suppressed | Damaged | Damaged |
| **Sunder Spike** | 3 | 9,000 | Military | Damaged | Damaged | **Destroyed** |

They target **wireless** chrome: you must be Connected (Overlay or Jacked In). When the use card posts, Ghostwire opens a **Chrome strike** prompt — pick the implant on your target, pick the tier your power roll came up, apply. If you do not have write access to the victim's sheet, the strike is relayed to the first active Director, who applies it.

## Technomancer paths

**Offence** — two new abilities in the Technomancer pack:

- **Resonance Pulse** (main, 1 Resonance to escalate) — the Suppress parity. It does not need the implant to be wireless; you are talking to the machine, not its radio. 3 Resonance makes a tier 2–3 result Damaged instead.
- **Chrome Sunder** (main, **5 Resonance**) — the Destroy path, with the Director's biofeedback for tearing a machine apart inside a living body.

**Repair** — the two abilities that already mended chrome in prose now clear the flags:

- **Resonance Mending** — the use card opens a Mend prompt. Base clears Suppressed; the 2-Resonance line ("restore failed chrome to minimal function") clears Damaged and drops Destroyed to Damaged.
- **Machine God's Rite** — restores an implant to full, whatever state it was in.

## Downtime repair Projects

A Damaged or Destroyed implant shows its recipe on the Item sheet, under the chrome line.

| State | Project goal | Parts |
|---|---|---|
| **Damaged** | 30 + (10 × Integrity cost) | 25% of the implant's ¥ |
| **Destroyed** | 60 + (20 × Integrity cost) | 60% of the implant's ¥ |

Roll it as a **Craft** Project with **Repair**, **Electronics**, or **Medicine**. The natural menders are the **Wrench** (Field Repair), the **Medic** / street-doc, and the **Technomancer**. Directors who prefer to hand-wave: right-click the implant → **Repair chrome (downtime)**.

## Director controls

Right-click any chrome row on a hero sheet:

- **Reboot chrome** — clears Suppressed (visible to the owner).
- **Repair chrome (downtime)** — Director only; clears Damaged or Destroyed outright.
- **Replace destroyed chrome** — confirms, then deletes the wreck with **no** Integrity refund.
- **Set chrome condition…** — Director only; set any state directly. This is the fallback for called shots, grenades, plot, or anything the programs do not cover.

Every state change posts a chat line naming the implant, both states, and what caused it.

## Table guardrails

Keep chrome targetable without making every decker an anti-tank gun:

- **One implant Destroyed per target per encounter.** Destroying chrome is a scene beat, not a rate of fire.
- **Suppressed is short** — one reboot and it is back. Do not stack it.
- **Damaged is a downtime problem**, not a combat one. Apply the bane and move on.
- **Soft resists**, Salvage suffers. If a player buys bioware because it is mage-tolerable, they also get the EMP hardness — that is the price of the price.
- Faraday Suits, jammers, and a nervous-system location are all fair grounds for a Director-called resist.

## Not in this pass

**F15 Cyborg System Crisis** is a separate track. Cyborgs do not use this ladder, and Cyborg Crisis must not reuse these flags.
