# Vehicles / drones / machine mods — Foundry checklist (0.3.98 / S8)

Node smokes first, in the module folder with Foundry **closed**:

```
node tools/s8-machines-smoke.mjs
node tools/kiosk-smoke.mjs
node tools/mulebot-actor-smoke.mjs
node tools/machine-armor-smoke.mjs
node tools/vehicle-lore-smoke.mjs
node tools/service-vehicles-smoke.mjs
```

All must print `passed`. Then open the world and walk the list below.

Packs rebuilt this pass (Foundry closed): `node tools/build-packs.mjs vehicles mods rulebook`.
Brief: `docs/directors/S8-vehicle-drone-mods-brief.md`.

---

## What shipped

| Line | Before | After |
|---|---|---|
| Crewed platforms | 40 (39 buyable + Nox) | **47** (46 buyable + Nox) — E1 20 / E2 10 / E3 9 / E4 8 |
| Drones | 36 | **40** — E1 15 / E2 8 / E3 8 / E4 9 |
| Vehicle / drone mods | 14 | **24** — armor ladder 4, weaponry ladder 4, **16** stacking "other" |
| Mods pack total | 37 | **47** |
| Kiosk presets | 10 | **11** (new **Mods** → *Chop Shop*) |

**New crewed:** Dock Tug (E1 Space ¥1,800) · Trauma Barge (E2 Water ¥4,800) · Lane Bus (E2 Ground ¥5,200) · Gale-Runner (E3 Air ¥13,000) · Ash-Crawler (E3 Ground ¥16,000) · Longshore (E4 Water ¥54,000) · Black Ledger (E4 Air ¥65,000).

**New drones:** Kiln-Beetle (E3 ¥11,500) · Static Crow (E3 ¥12,000) · Tide-Wraith (E4 ¥34,000) · Second Face (E4 ¥36,000).

**New mods:** Burner Plates ¥500 · Lane Skirt ¥700 · Spool Rig ¥900 · Drop Harness ¥1,800 · Signal Mule ¥2,200 · Ghost Rein ¥3,400 · Deep Shell ¥5,500 · Spoof Cowl ¥6,500 · Kick Drive ¥17,000 · Storm Lattice ¥19,000.

**Fixed:** Nox's Trash Freighter was ¥0 — it now prices at **¥2,800** (replacement / scratch-it-you-bought-it) and keeps its **Plot** tag, so it still never appears on the Vehicle Lot shelf.

---

## The rules this pass holds to

- **¥ on every SKU.** Price lives on `flags.draw-steel-ghostwire.vehicle.price` / `.mod.price`; `catalogPrice()` reads them. No chassis or mod prices at 0.
- **Fabricate = the stock Draw Steel Project.** Every chassis and machine mod carries real `system.project` fields — goal, prerequisites, roll characteristics, yield. Goal follows the system trinket ladder: **E1 150 · E2 300 · E3 450 · E4 600**. Repair jobs roll **Might or Reason**; Electronics jobs roll **Reason or Intuition**. Points come from **Lifestyle project slots**. There is no parallel tracker.
- **Fabricate ≠ install.** Finishing a fabricate Project yields the part. Installing it is still its own §Craft Project.
- **Ladders stay ladders.** One armor kit and one weaponry kit at a time (`exclusiveKit`). Everything in the "other" menu stacks up to the frame's free slots.
- **Ghost Rein never grants Jump-In.** It buffers biofeedback only. Jump-In stays Wrench-only, and the frame still needs Jump-In Capable or a **Rigger Cocoon**.
- **Dual Item + Actor unchanged.** Drone and vehicle SKUs are still Draw Steel **treasure** Items; Deploy stamps a band Actor, Recall deletes it, the Item stays.

---

## In Foundry

### 1. The catalog

- [ ] **Ghostwire Vehicles & Drones** shows five folders. Ground has **Lane Bus** and **Ash-Crawler**; Air has **Gale-Runner** and **Black Ledger**; Water has **Trauma Barge** and **Longshore**; Space has **Dock Tug**; Drones has **Kiln-Beetle**, **Static Crow**, **Tide-Wraith**, **Second Face**.
- [ ] **Ghostwire Mods › Vehicle & Drone Mods** holds **24** Items.
- [ ] Open any chassis card. It prints Echelon / Availability / **Cost ¥** / Mod slots / Tags, Domain + Scale, (crewed only) Crew · Speed · Jump-In, Profile, Stat block, a **Fabricate (§Craft Project)** line, and a **Mod slots (N)** paragraph linking all **24** mods.
- [ ] Open **Nox's Trash Freighter**. Cost reads **¥2,800 (replacement — scratch it and you bought it)**.
- [ ] Open any machine mod. It prints Effect, Fits, Install, and a **Fabricate (§Craft Project)** line.
- [ ] On a chassis or mod sheet, the **Project** block on the Item is filled in — Goal, Item Prerequisites, Project Source, Roll Characteristic, Yield Display — not blank.

### 2. The three machine vendors

- [ ] Token controls › **cash register**. The **Kiosk type** dropdown now lists **Mods** after Ammo.
- [ ] Place one with type **Drones**, blank name. The Actor is named **Drone Vendor** and stocks **40** listings, every price blank (catalog ¥).
- [ ] Place one with type **Vehicles**. **Vehicle Lot**, **46** listings. **Nox's Trash Freighter is not on it.**
- [ ] Place one with type **Mods**. **Chop Shop**, **47** listings — the 24 machine mods plus the weapon / armor / gadget families.
- [ ] Open the Chop Shop as Director. Every row shows a catalog ¥; none shows *No catalog ¥*.
- [ ] Stand a hero token within 2 squares, open the shop, buy **Lane Skirt** (¥700). ¥ drops by exactly 700 and the mod lands on the hero.
- [ ] On an older kiosk placed before this update, **Restock from preset** re-pulls the current catalog — the new SKUs appear without touching a listing UUID.

### 3. Install and Deploy still work

- [ ] Give a hero a **Mule-Bot** and a **Scrap-Weld**. **Install onto…** → the drone. Slots read 1 / 2.
- [ ] **Deploy** the Mule-Bot. The stamped Actor's Stamina (Integrity) is chassis + **6**, and an Active Effect names the armor kit.
- [ ] Install **Storm Lattice** as well, re-Deploy (or toggle). A second Active Effect appears naming the mod; the Director applies its edge at the table (Foundry does not auto-roll it).
- [ ] Uninstall the armor kit → Stamina clamps back to chassis; the effect is gone.
- [ ] Deploy a **Tide-Wraith** (Water drone, Scale Vehicle) — it stamps the `drone-medium` band. **Recall** deletes the Actor and the Item stays on the hero.

### 4. Rules text in the world

- [ ] **Ghostwire Rulebook › Ghostwire Systems › Machines** — the drone inventory reads **40** chassis (15 + 8 + 8 + 9); the crewed inventory reads **46**; the role quick-indexes name the new frames.
- [ ] **Ghostwire Rulebook › Hero Building › Mods** — the §5F *Other* table has 16 rows and a **Project Goal** table (150 / 300 / 450 / 600).
- [ ] Ask **VOIDMARK** *"how do I fabricate a drone mod?"* — the answer cites the Project goal ladder and the Lifestyle project slot, not an invented tracker.

---

## Known gap (not a blocker)

The eleven new chassis ship with **core Foundry placeholder icons** (the Bulldog has had the same gap since it was published). To swap in real plates, drop `‹dsid›.webp` into `_incoming-art/` and run:

```
node tools/apply-machine-token-art.mjs --from _incoming-art
node tools/build-packs.mjs vehicles
```

Slugs: `dock-tug`, `trauma-barge`, `lane-bus`, `gale-runner`, `ash-crawler`, `black-ledger`, `longshore`, `static-crow`, `kiln-beetle`, `second-face`, `tide-wraith` (and `bulldog`).
