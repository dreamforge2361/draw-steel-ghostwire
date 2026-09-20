# Spike B119 — Kiosk type presets + street consumables

**Date:** 2026-09-20  
**Module:** **0.3.65**  
**Status:** **SHIPPED** (pending Michael Foundry-verify)  
**Lock:** Michael backlog LOCK 2026-09-20  
**Depends on:** B118 scene kiosk (`docs/spikes/B118-SCENE-KIOSK-MERCHANT.md`)

## Goal

Expand scene kiosks with (1) street consumable gear SKUs and (2) one-click **kiosk type presets** that auto-stock inventory from catalog UUIDs.

No Gold Line `{ force: true }`. No PDF. Ghostwire-only player text.

## Part A — Consumable SKUs

Treasure Items under `src/packs/gear/consumables/` with `flags.draw-steel-ghostwire.gear.price` and Ghostwire lang keys.

**Food / drink / supplement (folder `food/`, tag `StreetFood`, shelf `food`):**

| SKU | ¥ | Notes |
|---|---|---|
| Buzz-Can | 35 | Stim soda |
| Lyte-Pouch | 20 | Electrolyte gel |
| Stall Ramen | 45 | Street noodles |
| Grease Box | 60 | Rice + skewer takeout |
| Brick Bar | 30 | Ration bar |
| Shift Chews | 80 | Shift supplement |

Food is inventory flavor (no combat bonus).

**Chems (folder `chems/`, tag `Chem`, shelf `chem`) — mechanical doses:**

| SKU | ¥ | Use |
|---|---|---|
| Kickwire | 400 | Maneuver. +5 temp Stamina, +1 Speed, Physique edge for 2 rounds. Crash: Weakened 1 round. |
| Clearline | 350 | Maneuver. Logic + Instinct edge for 2 rounds (short Wired-focus window). |
| Numb-Tap | 250 | Maneuver. +8 temp Stamina for 2 rounds. Crash: Instinct bane 2 rounds. |
| Red Dust | 600 | Maneuver. +10 temp Stamina, +2 Speed, Physique + Reflex edge for 2 rounds. **+1 Taint** (existing 0–12 track). Crash: Weakened 2 rounds. |

`scripts/consumable-use.mjs` spawns a **Use {item}** maneuver (same pattern as B49 weapons / B51 payloads). A successful `AbilityModel#use` applies the item’s buff Active Effect, temp Stamina / Taint, spends quantity, and posts chat. Crash AEs apply when the buff expires (`deleteActiveEffect`). Does not invent a new track.

## Part B — Presets

Data: `scripts/kiosk-presets.mjs`. Filters resolve pack UUIDs so new gear auto-includes:

| Type | Default Actor name | Stock |
|---|---|---|
| General / Food | Street Food Kiosk | `consumables/food` + `StreetFood` tag |
| Medical | Street Clinic Kiosk | `consumables/chems` + existing `general/medical` |
| Tools | Hardware Kiosk | infiltration + sensors + survival folders |
| Armor | Armor Locker | all `system.kind === "armor"` / `gear/armor/**` |
| Weapons | Weapons Cage | all `system.kind === "weapon"` / `gear/weapons/**` |
| Drones | Drone Vendor | Vehicles pack `flags.vehicle.drone` / `vehicles/drones/**` |

Price on every preset row is `null` (catalog ¥). Stock stays infinite (B118).

**UX:** Token controls › cash register opens a type picker (`DialogV2`). Blank name uses the type default (editable after). Director shop has **Restock from preset** (replaces the current shelf).

## Default token art

Same plate for every type (one stub, not per-preset Actors):

`modules/draw-steel-ghostwire/assets/tokens/kiosks/kiosk-merchant.webp`

Source: `assets/tokens/kiosks/kiosk-merchant.{png,webp}` (Michael 1254² PNG + 1024² WebP). `placeKiosk` stamps Actor `img` + Token texture. Does not rewrite Gold Line. Existing world kiosks still on the Foundry merchant icon upgrade on ready.

## Files

- `scripts/kiosk-presets.mjs`, `scripts/consumable-use.mjs`
- `scripts/kiosk.mjs` / `templates/kiosk.hbs` / `styles/ghostwire.css`
- `src/packs/gear/consumables/**`
- `src/packs/summons/kiosks/kiosk-merchant.json` (default art)
- `assets/tokens/kiosks/kiosk-merchant.{png,webp}`
- `lang/en.json` → `GHOSTWIRE.Kiosk.Presets.*`, `GHOSTWIRE.Gear.Items.*`, `GHOSTWIRE.ConsumableUse.*`
- Director note: `docs/directors/scene-kiosk-merchant.md`

## Verify

```text
node tools/kiosk-smoke.mjs
```

Foundry: Token controls › Place kiosk › **General / Food** on a non–Gold Line scratch Scene. Shelf lists the six food SKUs. Repeat Armor / Weapons. Buy Buzz-Can. On a hero, Use Kickwire — temp Stamina + Speed AE; crash when it ends.

**0.3.66 (Michael kiosk smoke 2026-09-20):** Food / chem rows showed no image. SKU `img` used Foundry game-icons (`icons/consumables/…`) that 404 on stock V14. Module SVGs ship at `assets/icons/consumables/<dsid>.svg` plus `food.svg` / `chem.svg` shelf fallbacks. Kiosk list `kioskListingImg` rejects blank / non-`icons/svg` `icons/` trees; `onerror` falls back food vs chem vs `icons/svg/item-bag.svg`. Rebuild `node tools/build-packs.mjs gear`.
