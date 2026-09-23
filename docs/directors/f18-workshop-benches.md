# F18 — Base workshop benches (0.3.117)

**Michael lock + tweak, 2026-09-23.** Six purchasable, expensive, placeable **Project aids**. A bench
gives exactly two things:

1. **+1 Lifestyle project slot** while it is available at the crew's base or on the scene —
   **capped at +1 in total, however many benches are placed.**
2. **One edge** on a Project Power Roll whose craft family **matches** the bench.

That is the whole feature. A bench is infrastructure, not a service and not a skill.

---

## The shelf

| Bench | Helps | E | Avail | ¥ |
|---|---|---:|---|---:|
| **Armorer's Bench** | Armor, ballistic, personal-defense Craft & Repair | 1 | Restricted | 8,000 |
| **Weaponeer's Bench** | Weapons, ammunition, weapon mods | 1 | Restricted | 10,000 |
| **Matrix / Deck Lab** | Electronics, Hacking, Program Craft | 2 | Restricted | 15,000 |
| **Ritual Sanctum Tools** | Ritual Working Projects (`22`) | 2 | Restricted | 16,000 |
| **Chrome Bay** | Chrome install, removal, repair (`09`) | 2 | Restricted | 18,000 |
| **Vehicle Depot** | Vehicle and drone Repair, mod installation | 2 | Restricted | 22,000 |

Expensive on purpose. A bench is a campaign-scale purchase a crew saves for, not something they pick
up between runs — and the second one only widens which Projects get an edge, it never adds a second
slot.

Sold from the **Workshop Benches** kiosk shelf (*The Fitters' Yard*). That shelf is gated on the
bench flag, not on the folder, so Door Locks and Safehouse Beacons in the same base-assets folder
stay off it and there is no second economy.

## What a Director does

**Buying one.** Restricted, like any Restricted SKU. Kiosk, black market, or just hand it over as
payment for a job — the ¥ is the gate, not the paperwork.

**Placing one.** It is a **dual Item + Actor**, exactly like the other Base Assets, so placement is
already handled: whoever owns the Item deploys it from the item's own controls and a bolted-down,
speed-0 Actor lands on the scene. Nothing new to learn.

**Counting the slot.** At the respite, if any bench is in reach, the crew's project slots go up by
**one**. Not one per bench. Not one per character who owns a bench. One.

**Reading the situation.** Right-click a bench on a sheet → **Report bench benefits** posts a card
saying how many slots the crew actually gets, which families are covered, and — when there are more
benches than the cap — that the extra ones only buy coverage.

## The edge, and why it is opt-in

A Draw Steel **Project** is a world Item somebody typed a name into. Nothing on it says what kind of
work it is, and guessing the craft family from the name would silently hand out — or silently
withhold — an edge on the strength of a string match. So:

- Right-click a Project → **Workshop bench family…** → pick one. From then on a matching bench
  pre-seeds **+1 edge** into that Project's roll dialog, where everyone can see it.
- Leave it untagged and nothing happens automatically. The Director adds the edge in the dialog,
  which is one click.

Either way the edge shows in the dialog **before the dice move**, same as F13 Cover and F14 Flanking.
Ghostwire does not quietly change numbers after the fact.

## What a bench does **not** do

- **It does not waive ¥, Body Integrity, or Availability** on whatever the Project makes or installs.
  A Chrome Bay does not make chrome cheaper or free up BI; it buys a slot and an edge.
- **It does not stack.** Six benches, one slot. Two Armorer's Benches, one edge.
- **It does not raise a lodge or sanctum ceiling.** Ritual Sanctum Tools help Ritual Working
  *Projects*. The lodge cap still comes from the Lifestyle band (`26`).
- **It is not the Facility Rigger's Home Ground / Safehouse Beacon.** That stays its own system
  (`16`, `23`).
- **It does not stack with another "extra slot" source** unless that source explicitly says it does.

## Wrench Buildings

A Physical Upgrade Slot spent on **bench capacity** is where a bench lives (`16`). Designation sets
how many benches a site can hold; it does not grant one. The bench is still bought with ¥.

## Running it

- **Let them see the second bench do nothing for slots.** The cap is easier to hold if the crew
  learns it from the report card rather than from an argument.
- **Coverage is the real purchase.** The interesting question is not "how many benches" but "which
  five Projects can we edge this respite" — that is what the ladder is priced around.
- **Benches are a target.** They are bolted-down Actors on a scene with 16 Stamina. A raid on the
  safehouse can take a bench out, and that is a good scene.

## Scope

- No full Building Stat Card automation.
- No per-bench slot stacking — explicitly capped at +1.
- No Renown (F22).

## Files

- `scripts/workshop-benches.mjs` — the two rules, the tagging menu, the report card
- `src/packs/vehicles/base-assets/*.json` — six Items
- `src/packs/summons/machines/machine-base-*.json` — six placeable Actors
- `docs/raw/26-lifestyle-downtime.md` § Workshop benches — the RAW
- `docs/raw/16-wrench.md` § Building designation — the bench-capacity pointer
- `tools/f18-workshop-benches-smoke.mjs` — `node tools/f18-workshop-benches-smoke.mjs`
