# Scene kiosk merchant

**Module 0.3.59 · spike `docs/spikes/B118-SCENE-KIOSK-MERCHANT.md` (DESIGN LOCKED)**

A **kiosk** is a named stall on the Scene: Mama’s Bar, an ARG lobby desk, a street vendor. It is a Ghostwire Summons Actor (`kind: kiosk`), not a Tile.

## Place

1. Token controls › **cash register**, or drag **Street Vendor (Kiosk)** from Ghostwire Summons & Machines › Kiosks.
2. Rename the Actor to the merchant or corp. Optional tagline under the name.
3. Set **Range (squares)** — default **2**. Adjacent is 1.
4. Stock the shelf: drop Gear / Chrome / Matrix / Mods / Vehicles / Foci, or paste Item UUIDs. Optional ¥ override per row (blank = catalog price).

Players see the token name. They do not need the combat sheet.

## Play

Hero token in range → double-click or HUD cash register → pick buyer → **Buy**. Deducts nuyen (`system.hero.wealth`) and copies the Item onto that hero. Chat logs the tap. Stock does not decrement (v1 infinite).

Director can always open and edit, even off-range. Players only when close enough.

Multiple kiosks on one Scene are separate Actors. Linked tokens of the same Actor share one shelf (two counters, one stock).
