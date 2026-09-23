# F18 — Base workshop benches (Project aids)

**Status:** READY after 0.3.116 (still HOLD until Michael locks F14/F15/F18 as a set).
**Michael ask (2026-09-23):** Base workshop benches (Project aids). Purchasable, expensive, placeable.
**Michael tweak (2026-09-23 ~1:55 PM ET):** Workshop benches **can add +1 to Lifestyle project slots** (overrides earlier "no extra slots" draft).

## Context

- Lifestyle project slots gate downtime (`docs/raw/26-lifestyle-downtime.md`)
- Wrench Building Stat Card names Workshop designation (`docs/raw/16-wrench.md`)
- E1 Base Assets = dual Item+Actor — **reuse that pattern**
- F10 Lockers = placeable inventory; benches = placeable **Project aids**

## Lock

### Two benefits (both print on the Item)

1. **+1 Lifestyle project slot** while the bench is available at the crew's base / scene for that respite.
   - Cap: **+1 total from benches**, no matter how many benches are placed (six benches ≠ +6 slots).
   - Does not stack with other "extra slot" sources unless those sources explicitly say they stack with workshop benches.
   - Still does not waive ¥ / Body Integrity / Availability.
2. **One edge** on a Project Power Roll whose craft family **matches** the bench (Armorer's helps armor Projects; not Rituals).
   - Wrong bench = no edge.
   - Multiple matching benches do not stack edges (still one edge).

Facility Rigger Home Ground (Safehouse Beacon) stays separate.

### Starter SKU ladder (expensive on purpose)

| Bench | Craft family match | E | Avail | Price ¥ | Notes |
|---|---|---:|---|---:|---|
| **Armorer's Bench** | Armor / ballistic / personal defense Craft & Repair | 1 | Restricted | 8,000 | |
| **Weaponeer's Bench** | Weapons / ammo / weapon mods | 1 | Restricted | 10,000 | |
| **Chrome Bay** | Chrome install/remove/repair (`09`) | 2 | Restricted | 18,000 | BI rules unchanged |
| **Matrix / Deck Lab** | Electronics / Hacking / Program Craft | 2 | Restricted | 15,000 | |
| **Vehicle Depot** | Vehicle / drone Repair & mod install | 2 | Restricted | 22,000 | |
| **Ritual Sanctum Tools** | Ritual Working Projects (`22`) | 2 | Restricted | 16,000 | Lodge-cap still from Lifestyle |

### Foundry shape

1. Gear Items with `flags.draw-steel-ghostwire.workshopBench = { family, grantsExtraProjectSlot: true }`
2. Dual placeable like Base Assets; anyone who owns the Item can place
3. Item description prints: **+1 project slot (once per base)** + **edge on matching Projects**
4. Optional: auto-edge on matching Project rolls if an easy hook exists; otherwise Director adds the edge in dialog
5. Kiosk: Safehouse / Workshop Restricted shelf — no second economy

### Out of scope

- Full Building Stat Card automation
- Stacking +1 per bench (explicitly capped at +1)
- F22 Renown

## Ship

- RAW under Lifestyle Projects + Wrench Building pointer
- Director note `docs/directors/f18-workshop-benches.md`
- Six Item + placeable pack rows
- Smoke: prices, families, `grantsExtraProjectSlot`, slot-cap note
- Version bump with the wave

## Acceptance

- Six expensive placeable benches
- Any one+ bench at base → **+1** Lifestyle project slot that respite (not more)
- Matching Project → edge; wrong family → no edge
