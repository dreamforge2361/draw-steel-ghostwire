# Kit street-band grants + Static Crow — Foundry checklist (0.3.99 / G1)

Node smokes first, in the module folder with Foundry **closed**:

```
node tools/kit-grants-smoke.mjs
node tools/street-eye-smoke.mjs
node tools/s8-machines-smoke.mjs
```

All must print `ok` / `passed`. Then open the world and walk the list below.

Packs rebuilt this pass (Foundry closed): `node tools/build-packs.mjs gear vehicles rulebook`.
Reference: `docs/directors/kit-street-band-grants.md` — the full Kit → SKU table and the gate.

---

## What shipped

| Line | Before | After |
|---|---|---|
| Kit chargen gear | Hero bought their own qualifying item; Kit inert until they did | **All 28 Kits** hand over their street-band package at chargen |
| Street-band weapons | 7 | **14** — new: Slugger, Pipe Rifle, Scrap Cleaver, Slab-Hammer, Scaffold Pike, Chain Lash, Weighted Net |
| Weapon categories with no street object | 6 (`heavy`, `polearm`, `whip`, `ensnaring`, medium melee, medium sidearm) | **0** |
| Categories with no object at *any* Availability | 2 (`polearm`, `unarmed`) | **0** — `polearm` now exists; `unarmed` is fists by rule, never an Item |
| Static Crow tags | EW, **Mark**, Jump-In-Capable, Wired | **EW, Jump-In-Capable, Wired** |
| Street Eye v1 qualifying frames | 9 | **8** — Static Crow off the list; Spotter (E1) and Phantom (E4) stay |

---

## A — Static Crow drops Mark

- [ ] **Ghostwire Vehicles & Drones › Drones › Static Crow** — the card's **Tags** line reads **EW, Jump-In-Capable, Wired**. No *Mark*.
- [ ] Drop Static Crow onto a hero. **No Street Eye** ability appears under Abilities.
- [ ] Now drop a **Spotter** (or **Phantom**, **Rotor**, **Tape-Eye**) on the same hero. **Street Eye appears.**
- [ ] Delete the Spotter, keep the Static Crow. **Street Eye leaves** — the Crow was never holding it up.
- [ ] Ask **VOIDMARK** *"does Static Crow give me Street Eye?"* — the answer says no, and gives the EW-vs-Mark reason (it paints a lane as an artefact of the EW suite, not as a scout designation).

Michael's call, recorded: **drop Mark rather than widen the Street Eye gate.** The gate itself is unchanged — a Personal or Light **Air** frame tagged **Recon** / **Mark** / **Decoy**.

---

## B — Kit chargen grants

### B1 — Merc: two Kits, two packages

- [ ] New hero → **Operator**, Origin **Merc**, level **1**.
- [ ] The Kits advancement offers **two** picks. Take **Gunslinger** and **Streetsweeper**.
- [ ] Inventory shows **four** new Items: **Secure Threads** + **Slugger** (Gunslinger), **Armor Vest** + **Boomstick** (Streetsweeper).
- [ ] Two chat lines, one per Kit, each naming what landed and repeating the ownership rule.
- [ ] Each granted Item's flags carry `kitStreetGrant` with the right `kitDsid`. The actor carries `kitStreetGrants` with **two** entries.
- [ ] Nothing is a **mod** or **chrome**. Nothing is above **Street**.

### B2 — Scout Longshot: rifle, no armor

- [ ] New hero → **Scout**, level **1**, Kit **Longshot**.
- [ ] Inventory gains **Pipe Rifle** and **nothing else** — Longshot is a no-armor Kit.
- [ ] The Pipe Rifle is **Echelon 1 · Street · ¥300 · 1 mod slot**, Weapon Base **6 kinetic (Medium band)**, Range **Long**.
- [ ] A **Strike with Pipe Rifle** ability appears from the B49 equipment-use path, and the Longshot Kit's `+0/+0/+4` ranged line applies to it.

### B3 — The ownership rule still bites

- [ ] On the Longshot hero, **delete** the Pipe Rifle.
- [ ] The Kit's weapon bonuses go **inert** (existing behaviour — no Kit damage on an improvised attack). Nothing re-grants.
- [ ] Add the Pipe Rifle back by hand from the gear pack. Bonuses return. Still **no** second grant, and **no** duplicate.

### B4 — The grant does not fire twice, or late

- [ ] On the Merc, **remove** the Gunslinger Kit and **re-add** it. **No** second package — the ledger already names `gunslinger`.
- [ ] Take a hero to **level 3**, then swap their Kit at a respite. **Nothing is granted.** The new category is theirs to buy with ¥ + Availability.
- [ ] Import a **pregen** (Kaïs, Vessa, any of the seven). They ship with their own gear — confirm **no duplicate** armor or weapon lands on the sheet.

### B5 — The Kits with nothing to hand over

- [ ] **Brawler** or **Mantis** at level 1: **no Items granted**, and a notification says the Kit needs no purchased object. Fists are the qualifying weapon.
- [ ] A Hacker deck-Kit (**Nyx Switchblade** / **Ferrum Padlock-6** / **Meridian Lookout**): **no Items granted**. The Kit *is* the deck — no Scrapdeck, and never chrome.
- [ ] **Rigger's Harness**: **Secure Threads** + **Popper** only. **No RCC** on top — the Harness is already the Wire interface.

### B6 — The new street SKUs read right

Open **Ghostwire Gear › Weapons** and check the seven new cards:

- [ ] **Melee** — Scrap Cleaver (¥280), Chain Lash (¥200), Scaffold Pike (¥250), Slab-Hammer (¥300)
- [ ] **Light Firearms** — Slugger (¥300), tagged **[Medium], Loud** (the one street handgun in the Medium band)
- [ ] **Longarms** — Pipe Rifle (¥300)
- [ ] **Bows, Crossbows & Exotic** — Weighted Net (¥120), no damage line, tagged **Restraining, Non-lethal-capable**
- [ ] Every one is **Echelon 1 · Street · 1 mod slot** and appears on the **Gear Vendor** kiosk shelf with no listing edit.
- [ ] Art gap: all seven use core Foundry icons. Plates go in `_incoming-art/` → `node tools/apply-gear-token-art.mjs --from _incoming-art`.

---

## Known and deliberate

- ~~**Hexshot's second slot is empty.**~~ **Closed by G2 / 0.3.100:** the Street band gained the **Scrap-Bow** (¥300, medium band), and `kit-grants.mjs` now grants **Street-Bow + Scrap-Bow**, so both of Hexshot's weapon slots are live at chargen. See `docs/directors/g2-armor-gadget-mods-smoke-03100.md`.
- **A level-1 hero who swaps Kits gets both packages.** That is the chargen rule as written, and Merc depends on it. Clear `flags.draw-steel-ghostwire.kitStreetGrants` or delete the extra Items if you want it tighter.
- **No back-fill.** Heroes who already exist in the world get nothing retroactively — the grant only fires when a Kit Item lands. Run `game.modules.get("draw-steel-ghostwire").api.grantKitStreetPackage(actor, kitItem)` by hand if you want to top one up.
