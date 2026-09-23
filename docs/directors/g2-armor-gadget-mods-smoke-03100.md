# Armor / gadget mod families — Foundry checklist (0.3.100 / G2)

Node smokes first, in the module folder with Foundry **closed**:

```
node tools/g2-armor-gadget-mods-smoke.mjs
node tools/kit-grants-smoke.mjs
node tools/kiosk-smoke.mjs
node tools/s8-machines-smoke.mjs
node tools/machine-armor-smoke.mjs
node tools/regen-mod-slot-cards.mjs --check
```

All must pass. Then open the world and walk the list below.

Packs rebuilt this pass (Foundry closed): `node tools/build-packs.mjs mods gear rulebook`.
Prompt: `docs/directors/_claude-g2-armor-gadget-mods-prompt.md` · Log: `docs/directors/_claude-g2-armor-gadget-mods-log.txt`.

---

## What shipped

| Line | Before | After |
|---|---|---|
| Wearable armor / shield mods | 7 stubs, **unpublished** | **14**, **published** (Gear master §2F) — E1 5 / E2 4 / E3 3 / E4 2 |
| Gadget mods | 8 stubs, **unpublished** | **17**, **published** (§1H) — E1 7 / E2 5 / E3 3 / E4 2 |
| Mods pack total | 47 | **63** (24 vehicle · 8 weapon · 14 armor · 17 gadget) |
| Kiosk presets | 11 | **13** (new **Armorer**, **Gadgeteer**) |
| Host gear cards listing their mods | 88 (hand-written) | **89**, all derived by tool |
| Street bow/crossbow/dartgun in the medium slot | none | **Scrap-Bow** ¥300 |

**New armor / shield SKUs:** Brace Struts ¥1,800 (armor + shield) · Insulator Liner ¥2,200 · Seal Kit ¥6,000 · Scanner Null ¥9,000 · Thermoptic Skin ¥11,000 · Reactive Plating ¥24,000 (armor + shield) · Denial Field ¥26,000 (shield).

**New gadget SKUs:** Jam Mask ¥1,600 · Breach Jack ¥1,900 · Sniffer Head ¥2,400 · Rad Baffle ¥2,600 · Habitat Stage ¥6,800 · Deep Optics ¥7,500 · Passkey Stack ¥8,500 · Quantum Link ¥21,000 · Ghost Frame ¥23,000.

**Also:** every one of the 15 existing stubs gained real `system.project` fields (they had empty ones), so each card now prints a **Fabricate (§Craft Project)** line.

---

## The lock to check first

**No wearable armor or shield mod adds Stamina.** Armor Stamina lives on the armor Item, by class and wearer Echelon (RAW `08`). The smoke asserts this three ways — no `staminaBonus` on the catalog flag, no Active Effect writing a Stamina key, and no card promising "+N Stamina" — but confirm it by eye once:

- [ ] Put **Trauma Plates** and **Soft Armor Insert** on a hero, install both on a **Hardshell** (2 slots), and watch max Stamina. It must **not move**.
- [ ] Toggle each off and on. Still no Stamina movement.

---

## 1. Install and refuse (hero sheet)

No **Deploy** step here — unlike a vehicle, the host Item is already on the hero.

- [ ] Give a hero **Secure Threads** (Light, 1 slot) and **Soft Armor Insert**. Right-click the mod → **Install onto…**. Secure Threads is listed and legal.
- [ ] Install it. The armor row shows **Mod slots: 1 / 1**.
- [ ] Add **Mag-Harness** and try to install. It is refused: **no free slots**.
- [ ] Give the hero a **Riot Shield** and try **Soft Armor Insert** on it → refused, **wrong family**.
- [ ] **Shield Capacitor** onto the Riot Shield → legal. Onto Hardshell → refused.
- [ ] **Quiet Picks** onto a **Lockpick Set** → legal. Onto a **Maglock Passkey** → refused (mechanical vs electronic B&E).
- [ ] **Beacon Squelch** onto anything carrying the **Wired** tag (Commlink, Maglock Passkey, Full Sensorium) → legal.
- [ ] **Habitat Stage** onto an **Environment Suit** → legal; onto a Commlink → refused.
- [ ] Right-click an installed mod → **Uninstall mod**. The slot frees.

## 2. Exclusive groups (the clash message)

Each pair is the same trick twice; Foundry should refuse the second by **name**.

- [ ] **Climate Seal Liner** then **Insulator Liner** on one suit → refused, *inner liner*.
- [ ] **Stealth Weave** then **Thermoptic Skin** → refused, *outer camouflage layer*.
- [ ] **Shield Capacitor** then **Denial Field** on one shield → refused, *active-denial cell*.
- [ ] **Spectrum Filter** then **Deep Optics** on one optic → refused, *optical stage*.
- [ ] **Skeleton Key Soft** then **Passkey Stack** → refused, *lock-cracking package*.
- [ ] On a roomy host (**Juggernaut**, 6 slots) confirm mods from *different* groups still stack.

## 3. Active Effects — only two, and they ship off

- [ ] **Thermoptic Skin** on armor: its **Stealth edge** effect is present on the sheet and **disabled**. Enable it → Stealth gains an edge. Disable → gone.
- [ ] **Deep Optics** on optics: same, for **Perception**.
- [ ] Every other armor / gadget mod has **no** Active Effect at all. Its card is the rule; the Director applies it. Nothing auto-modifies a Power Roll.

## 4. Host cards read right

- [ ] Open **Hardshell**. The card ends with **Mod slots (2): Fill them with armor mods from Ghostwire Mods › Armor & Shield Mods** and links **all 12** armor-hosting mods.
- [ ] Open **Riot Shield** → links the **6** shield-hosting mods.
- [ ] Open **Commlink**, **Lockpick Set**, **Cheap Shades**, **Rebreather** → each lists the mods for its own family and nothing else.
- [ ] Open any new mod (e.g. **Seal Kit**). The card prints Echelon / Availability / Cost / Slot cost / Tags, an **Effect** line, **Fits**, **Install**, any **Does not stack with**, and a **Fabricate (§Craft Project)** line with a goal of 450.

## 5. Kiosk vendors

- [ ] Token controls › **cash register** → place a kiosk, type **Armor mods**. It names itself **Armorer** and stocks **14** listings at catalog ¥.
- [ ] Place another, type **Gadget mods** → **Gadgeteer**, **17** listings.
- [ ] Place a **Mods** kiosk → **Chop Shop**, **63** listings (all four families).
- [ ] Buy one thing from the Armorer with a hero in range; ¥ leaves `system.hero.wealth` and the Item lands on the sheet.
- [ ] **Restock from preset** on each → same counts, no hand-edited UUIDs.

## 6. Fabricate as a Project

- [ ] Start **Insulator Liner** as a crafting Project from the Item. Goal **300**, prerequisites name **¥1,100** in parts, roll is **Might or Reason** (Repair).
- [ ] Start **Deep Optics** → goal **450**, roll **Reason or Intuition** (Electronics).
- [ ] Confirm finishing the fabricate Project yields the part and that **installing** it is still its own §Craft Project.

## 7. Part B — Hexshot's medium bow

- [ ] Build a level-1 hero and give them the **Hexshot** Kit. The chargen grant lands **two** bows: **Street-Bow** (light) and **Scrap-Bow** (medium).
- [ ] Both are **Echelon 1 / Street**, 1 mod slot, and carry the `bow` keyword, so both of Hexshot's weapon slots are live on day one.
- [ ] No armor and no shield are granted (Hexshot is `armor: none`).
- [ ] **Scrap-Bow** reads ¥300 · 5 kinetic (Medium band) · Range Medium · [Medium] Two-handed Quiet.

## 8. Rules text

- [ ] Rulebook journal **Mods** (Hero Building): the host-family table says Armor / shields **Published §2F** and Gadgets **Published §1H**, and both harvested tables are present.
- [ ] Nothing anywhere still says wearable armor **modSlots** should be treated as **0**, or that liners must not be invented.
- [ ] Voidmark (Director mode) answers a question about armor mods from the new §2F text.

---

## Known open

- The 16 new SKUs use **core Foundry placeholder icons**. Drop `‹dsid›.webp` plates into `_incoming-art/` and run `node tools/apply-gear-token-art.mjs --from _incoming-art` when art lands.
- The print manuscript assembles `docs/raw/10-mods.md` directly, so the new §2F / §1H text reaches the PDF on the **N4** reprint pass — same as S8 and G1.
- Pre-existing and untouched by this pass: `tools/b106-b109-smoke.mjs` and `tools/b116-wire-atlas-smoke.mjs` fail on `main` as well (Kessic's Whiteout quantity; megacorp Host skins).
