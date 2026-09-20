# Spike B118 — Scene kiosk merchant

**Date:** 2026-09-20  
**Module:** **0.3.59** (presets + street consumables **0.3.65 / B119**)  
**Status:** **SHIPPED / DESIGN LOCKED** (pending Michael Foundry-verify)  
**Lock:** Michael backlog LOCK 2026-09-20

## Goal

Placeable scene object that acts like a **kiosk**: when a player token is **close enough**, they can open a curated inventory list. Director stores a **merchant or corporate name** on it. Players **purchase** gear for **¥ nuyen** (`system.hero.wealth`) and the Item is **added to their inventory**.

## Placeable choice

**Dedicated NPC Actor stub** with `flags.draw-steel-ghostwire.kind === "kiosk"`, linked token on the Scene.

Not a Tile, Drawing, or AmbientLight. Ghostwire already places scene objects as Actor stubs (Wired nodes, machines, Nox freighter). Tokens give:

- Multiple kiosks per Scene (Mama’s Bar, ARG Lobby, street vendor) as separate Actors
- A Director-facing name on the canvas (`displayName: ALWAYS`)
- Token HUD + double-click, same path as the Wired node applet
- Flags that players can read (`ownership.default = OBSERVER` on world copies)

Pack template: `src/packs/summons/kiosks/kiosk-merchant.json`  
UUID: `Compendium.draw-steel-ghostwire.summons.Actor.GwKioskMerchant1`

World copies land in an Actors folder **Kiosks**. Drag from the pack **or** Token controls › cash register (`placeKiosk`).

## Flags

```text
flags.draw-steel-ghostwire = {
  kind: "kiosk",
  dsid: "kiosk-merchant",      // pack stub only
  range: 2,                    // grid squares, Chebyshev, default 2
  tagline: "",                 // optional flavor under the name
  inventory: [
    { id, uuid, price }        // price null = catalog ¥; number = override (incl. 0)
  ]
}
```

**Merchant / corp name** is the Actor name (rename to Mama’s Bar, ARG Lobby, …). Tagline is extra color, not the identity.

Catalog ¥ is read from `flags.draw-steel-ghostwire.{gear,chrome,matrix,mod,vehicle,focus}.price` — same path the item sheet already prints. Draw Steel treasure has no price field.

## Proximity

Square-grid **Chebyshev** on occupied cells. Adjacent 1×1 tokens = **1**. Default range **2** (adjacent or one square away). Configurable, including 0 (must share a cell). Ungridded scenes still use `scene.grid.size` as the cell.

GM always opens / edits. Players open only when **an owned hero token on the kiosk’s Scene** is in range. Purchase re-checks range.

## Purchase

1. Buyer is a Draw Steel **hero** (`system.hero.wealth`).
2. `wealth >= price` or refuse.
3. Create Item on the buyer (`fromCompendium` / `itemCreateData` clone).
4. Deduct ¥. If the wealth write fails, the created Item is deleted.
5. Public chat line + notification.

v1 stock is **infinite**. No fencing. No Gold Line `{ force: true }`. No PDF.

## UX

| Who | Open | Edit stock |
|---|---|---|
| Director | Always (double-click, HUD, Actor sheet redirect) | Name, tagline, range, UUID list, ¥ override, item drop |
| Player | In range only | — |

Token HUD cash-register icon (players + GM). Double-click is patched the same way as Wired nodes (`_onClickLeft2` chain). NPC combat sheet is redirected to the kiosk app; GM **Open actor sheet** uses `ghostwireAllowKioskSheet`.

## Files

- `scripts/kiosk.mjs` — helpers + ApplicationV2 shop
- `templates/kiosk.hbs` / `styles/ghostwire.css`
- `lang/en.json` → `GHOSTWIRE.Kiosk.*`
- `src/packs/summons/kiosks/`
- Director note: `docs/directors/scene-kiosk-merchant.md`

## Default token art (0.3.65)

Michael street-kiosk plate (circular, multi-bay). PNG original **1254²** + Foundry WebP **1024²**:

- `assets/tokens/kiosks/kiosk-merchant.png`
- `assets/tokens/kiosks/kiosk-merchant.webp`

Foundry path: `modules/draw-steel-ghostwire/assets/tokens/kiosks/kiosk-merchant.webp`

Stamped on pack stub `img` + `prototypeToken.texture.src`. `placeKiosk` (including type presets) writes the same path onto the world Actor and placed Token. One stub for all types — no extra preset Actors.

World copies that still use the old Foundry merchant icon (`icons/skills/trades/academics-merchant-scribe.webp`) are upgraded on ready. Custom art is left alone. Does **not** rewrite the Gold Line Scene. After pull, Michael’s already-placed kiosk should pick up the plate (or set Actor `img` + Token texture by hand if it was customized).

## B119 follow-on (0.3.65)

Type presets + street consumable SKUs: `docs/spikes/B119-KIOSK-PRESETS-CONSUMABLES.md`. Token controls type picker; Restock from preset on the shop. Catalog filters in `scripts/kiosk-presets.mjs`. New Gear folder `src/packs/gear/consumables/`.

## Out of scope

Full economy simulation, fencing, stock counts, Gold Line inject.

## Verify

```text
node tools/kiosk-smoke.mjs
```

Foundry: on a **non–Gold Line** scratch Scene, Token controls › Place kiosk. Rename to **Mama’s Bar**. Drop Burner (or paste its UUID). Move a hero token adjacent → Buy → wealth drops, Item on the sheet, chat logs. Second kiosk **ARG Lobby** with a different list. Player token 3+ squares away is refused. GM still opens.
