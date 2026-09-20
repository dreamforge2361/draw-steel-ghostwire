# Scene kiosk merchant

**Module 0.3.59 · spike `docs/spikes/B118-SCENE-KIOSK-MERCHANT.md` (DESIGN LOCKED)**  
**Presets + street consumables 0.3.65 · spike `docs/spikes/B119-KIOSK-PRESETS-CONSUMABLES.md`**

A **kiosk** is a named stall on the Scene: Mama’s Bar, an ARG lobby desk, a street vendor. It is a Ghostwire Summons Actor (`kind: kiosk`), not a Tile.

**Default token art:** `modules/draw-steel-ghostwire/assets/tokens/kiosks/kiosk-merchant.webp` (Michael circular street-kiosk plate; PNG original at `assets/tokens/kiosks/kiosk-merchant.png`). Every new place / preset uses this Actor `img` and Token texture. Already-placed world kiosks that still show the old Foundry merchant icon pick it up on reload. Custom art is left alone. Gold Line is not rewritten — if a kiosk on that Scene still shows the old icon after pull, set Actor `img` + Token texture to the WebP path.

**Shelf item art (0.3.66):** street food and chem SKUs use module SVGs at `modules/draw-steel-ghostwire/assets/icons/consumables/<dsid>.svg`. Stock Foundry 14 does not ship `icons/consumables/…`. If a row img is blank or 404s, the shop shows the food or chem fallback, then `icons/svg/item-bag.svg`.

## Place

1. Token controls › **cash register**. Pick a **kiosk type** (or Empty shelf) and an optional name. Blank name uses the type default (Street Food Kiosk, Armor Locker, …). You can rename after.
2. Or drag **Street Vendor (Kiosk)** from Ghostwire Summons & Machines › Kiosks, then **Restock from preset** on the Director shop.
3. Set **Range (squares)** — default **2**. Adjacent is 1.
4. Stock is pre-filled from catalog UUIDs when you pick a type. You can still drop Gear / Chrome / Matrix / Mods / Vehicles / Foci, or paste Item UUIDs. Optional ¥ override per row (blank = catalog price).

Players see the token name. They do not need the combat sheet.

### Types (auto-stock)

| Type | Default name | What lands on the shelf |
|---|---|---|
| **General / Food** | Street Food Kiosk | New street food / drink / supplement SKUs (Buzz-Can, Lyte-Pouch, Stall Ramen, Grease Box, Brick Bar, Shift Chews) |
| **Medical** | Street Clinic Kiosk | Kickwire, Clearline, Numb-Tap, Red Dust **plus** existing medical gear (Trauma Patch, Stim Patch, Field Surgery Kit, Antidote, Slap-Doc) |
| **Tools** | Hardware Kiosk | Break-in, sensors, and survival / field kit from General gear |
| **Armor** | Armor Locker | **All** armor Items in Ghostwire Gear › Armor |
| **Weapons** | Weapons Cage | **All** weapons in Ghostwire Gear › Weapons |
| **Drones** | Drone Vendor | Buyable drone chassis in Ghostwire Vehicles › Drones |
| **Vehicles** | Vehicle Lot | Crewed platforms in Ghostwire Vehicles (ground / air / water / space). **Not** drones — `flags.vehicle` present and `drone` falsy. Plot SKUs (Nox’s Trash Freighter) stay off the lot |
| **Decks** | Deck Vendor | Cyberdecks in Ghostwire Matrix › Decks (Cat 4A, `matrix.role === "deck"`) |
| **Programs** | Software Stall | Buyable deck software: Cat **4B** persistent suites **and** Cat **4C** attack payloads on one shelf (v1). Autosofts and Hacker class Program abilities stay off this stall |
| **Ammo** | Ammo Counter | Gear › General › Ammunition magazines / one-shot specialty rounds (Standard Rounds, AP, Gel, grenades, smoke). **Not** machine Ammo Bin mods |
| Empty shelf | Street Vendor | Nothing — stock by hand |

New food SKUs under `consumables/food` (tag `StreetFood`) join the Food kiosk automatically. New chems under `consumables/chems` (tag `Chem`) join Medical. New armor/weapon Items join those shelves by `system.kind`. New drone Items with `flags.vehicle.drone` join Drones. New crewed vehicles (`flags.vehicle` and not `drone`) join Vehicles. New Matrix decks (`role: deck`) join Decks. New `programs/` suites and `payloads/` chips join Programs. New `general/ammunition` SKUs join Ammo.

**Restock from preset** on an open kiosk **replaces** the current list. Infinite stock still (B118).

## Street consumables

Food and drink are stall snacks (Brick Bar ¥3, Buzz-Can ¥4, Lyte-Pouch ¥5, Shift Chews ¥6, Stall Ramen ¥10, Grease Box ¥12). Chems are doses:

- **Kickwire** (¥400) — combat stim: temp Stamina, Speed, Physique edge; Weakened crash.
- **Clearline** (¥350) — focus chem: Logic + Instinct edge for 2 rounds.
- **Numb-Tap** (¥250) — painkiller: temp Stamina; Instinct bane when it fades.
- **Red Dust** (¥600) — street spice: bigger buff + **+1 Taint** (existing 0–12 track) + crash.

A hero who owns a chem gets a **Use {item}** maneuver. Using it spends the dose, applies the Active Effect, and posts chat.

## Play

Hero token in range → double-click or HUD cash register → pick buyer → **Buy**. Deducts nuyen (`system.hero.wealth`) and copies the Item onto that hero. Chat logs the tap. Stock does not decrement (v1 infinite).

Director can always open and edit, even off-range. Players only when close enough.

Multiple kiosks on one Scene are separate Actors. Linked tokens of the same Actor share one shelf (two counters, one stock).
