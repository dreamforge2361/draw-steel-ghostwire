# Ghostwire Core Rulebook — Chapter: Mods

**Status:** Stage 3 draft locked 2026-09-16/17  
**Pairs with:** `docs/rulebook/11-economy.md`, `docs/rulebook/10-kits.md`, `docs/masters/GHOSTWIRE_GEAR_MASTER.md`, skills master (`docs/masters/GHOSTWIRE_SKILLS_MASTER.md`)  
**Foundry:** Mods pack + Invent a Mod rules (B20 expansion); Gear master remains source of record for published families. **B20c install tracker (v0.1.44, Foundry-verified):** record a finished install with **Install onto…** on the hero sheet; hosts show mod slots used / max. **B20d deck / RCC software (v0.1.49, Foundry-verified):** Matrix programs install onto decks and autosofts onto RCCs the same way; **Activate / Deactivate** is the field toggle (the software keeps its slot), and Reader, Skeleton, and Targeting Autosoft add their edge to the matching rolls while on. **B51b payload magazines (v0.1.77):** payload chips load onto a deck only through **Load magazine (Craft)…** (Reason roll, Hacking edge; tier sets fires 1 / 3 / 5); each **Run {Payload}** spends one fire. **0.3.100 (G2) armor + gadget families:** wearable armor/shield mods (§2F, 14) and gadget mods (§1H, 17) are **published**, each carrying stock Draw Steel **Project** fields like the §5F rows; every host gear card lists its own fitting mods by link; the kiosk adds **Armorer** and **Gadgeteer** presets beside the Chop Shop. Only **Thermoptic Skin** and **Deep Optics** carry an Active Effect (a Stealth and a Perception edge, shipped off), the same honest pattern **Stealth Weave** used — every other row is a card the Director reads at the table, and **no wearable mod writes Stamina**. **0.3.98 (S8) machine build-out:** vehicle/drone mods are 24 SKUs (armor ladder + weaponry ladder + a 16-row stacking menu), every mod and chassis carries stock Draw Steel **Project** fields (goal 150/300/450/600 by Echelon), and the kiosk ships a **Mods** preset (“Chop Shop”) that auto-stocks every SKU in the Mods pack. **0.3.68 machine kits:** installing an armor/weaponry/other §5F mod onto a **Deployed** vehicle or drone applies Stamina (hero-armor treasure AE) and kit flags/AEs on that Actor; toggle-off and uninstall reverse them. Tune Kit / Sensor Pod / Ghost Coat / Runflats / Rigger Cocoon / Ammo Bin are flagged for the Director to apply at the table.

**Design locks (do not reopen in this draft):**
- Mods cost **¥**; stack with Kit doctrine (different numbers); never rewrite Kit damage/Stamina lines
- **§Craft** = downtime **Project procedure** (Draw Steel Projects), **not** a skill
- Field toggle OK for already-installed mods; install/swap/remove = downtime Project
- Slot integrity rule (below)
- Firewall: mods buy tags, edges, convenience, small typed immunities — never characteristics, skills, class features, or Kit doctrine
- **Invent a Mod (v1)** procedure locked (this chapter)
- Chargen: starting Kit includes street-band qualifying gear only; **mods never auto-grant**

---

## Purpose

Mods are the **object-side** upgrade layer. Kits train technique; Economy buys hosts; Mods fill **mod slots** on those hosts with situational tags and edges. A smartlinked Ghost-Kit pistol gets both the Kit’s doctrine *and* the mod’s effects — they never overwrite each other.

## Doctrine

| Rule | Detail |
|---|---|
| **¥ cost** | Every published mod has a nuyen price. Invented mods spend materials ¥ up front (see Invent a Mod). |
| **Stack with Kits** | Mods and Kit doctrine touch **different numbers**. Never rewrite Kit damage / Stamina / signature lines. |
| **§Craft = procedure** | Installing, swapping, removing, or inventing a mod is a Draw Steel **Project** (downtime). §Craft is **not** a skill name. |
| **Fabricate = the stock Project** (0.3.98) | Every published vehicle/drone mod and chassis carries stock Draw Steel **Project** fields — goal, prerequisites, roll characteristics, yield — so building one eats a **Lifestyle project slot** and needs no parallel tracker. Goal by Echelon: **E1 150 · E2 300 · E3 450 · E4 600** (the system's trinket ladder). Roll **Might or Reason** for Repair jobs, **Reason or Intuition** for Electronics jobs. Fabricating yields the part; **installing it is still a separate §Craft Project**. |
| **Field toggle** | An already-installed mod may be toggled on/off in the field (normal action / free as printed). Install, swap, or remove always requires a downtime Project. |
| **Firewall** | Mods may grant tags, edges, convenience, and small typed immunities. Mods **never** grant characteristics, skills, class features, heroic resources, or Kit doctrine. |

### Skills by job (Power Roll on §Craft Projects)

| Skill | Used for |
|---|---|
| **Hacking** | Programs / deck software / software installs (deck & RCC slots) |
| **Electronics** | Deck hardware, sensors, gadgets, Wired devices |
| **Repair** | Weapons, armor, vehicles/drones — physical mods |
| **Cybertech** | Chrome-adjacent only (implanted weapon/mount interfaces that are chrome-side; living chrome still spends Body Integrity per Chrome chapter) |

### Slot integrity

If an item publishes **modSlots > 0**, a **published mod family** must exist for that host family. If no family exists yet, set slots to **0** until the family ships. Do not leave orphan slot counts.

**Consumables** never have mod slots.

### Host families

| Host family | Notes |
|---|---|
| **Weapons** | Published core set in Gear master **§3G**; Foundry Mods pack |
| **Armor / shields** | **Published** set in Gear master **§2F** (14 SKUs, 0.3.100); hosts `armor` and `shield`. **No wearable mod adds Stamina** |
| **Gadgets** | **Published** set in Gear master **§1H** (17 SKUs, 0.3.100); hosts `comms`, `sensors`, `bne-mechanical`, `bne-electronic`, `survival`, `wired` |
| **Vehicles / drones** | Published set in Gear master **§5F** |
| **Decks / RCCs** | Slots filled by **suites / autosofts** and **payload magazines** from the Matrix catalog (Gear master Category 4); install skill = **Hacking** |

## Echelon + Availability (gear grade)

**No Item Tier / T5–T1 in player-facing text.** The Gear master’s Item Tier column is a **legacy label** for gear grade only. Map:

| Legacy Item Tier | Draw Steel Echelon | Availability feel |
|---|---|---|
| T5 | Echelon 1 | Street |
| T4 | Echelon 1 | Professional |
| T3 | Echelon 2 | Restricted |
| T2 | Echelon 3 | Military |
| T1 | Echelon 4 | Prototype |

Higher-grade gear costs more and has more mod slots. Hero-side benefits (Kit Stamina per echelon; Armor-as-Stamina by wearer **Echelon**) scale with the hero’s Draw Steel Echelon — not with a Ghostwire item-tier ladder.

**Do not confuse** Power Roll **outcome bands** (low / middle / high) with Item Tier / gear grade.

## Published mod families

Point of record: `docs/masters/GHOSTWIRE_GEAR_MASTER.md` + Foundry **Mods** pack.

- **Weapon mods** — Gear master **§3G** (Smartlink, Suppressor, Recoil Comp, Extended Mag, Smart-Scope, Gas-Seal, Underbarrel Mount, Personalized Grip, …).
- **Vehicle / drone mods** — Gear master **§5F**, **24 SKUs as of 0.3.98 (S8)**. Two one-at-a-time ladders — armor (Scrap-Weld → Plate-Up → Combat Plate → Aegis Kit) and weaponry (Gun Rack → Twin Mount → Turret Ring → Heavy Hardpoint) — plus a **16-row "other" menu** that stacks to the frame's free slots: Burner Plates, Lane Skirt, Spool Rig, Drop Harness, Runflats, Signal Mule, Ammo Bin, Tune Kit, Sensor Pod, Ghost Rein, Deep Shell, Spoof Cowl, Rigger Cocoon, Ghost Coat, Kick Drive, Storm Lattice. Hosts: `vehicle` and `drone`. Armor kits grant Stamina (Integrity); machines have no armor rating / DR. **Ghost Rein** buffers Jump-In biofeedback and never grants Jump-In — only a **Rigger Cocoon** upgrades a frame to accept one, and only a Wrench may Jump In. **0.3.112:** a weaponry kit is the **mount** — bolt a concrete gun into it from Gear master **§3H** (nine vehicle-mount SKUs) or a Mounted-tagged §3C heavy, with *Mount on…* / *Unmount weapon* on the weapon’s row. Capacity is the kit’s (Gun Rack 1, Twin Mount 2, Turret Ring 1 medium turret, Heavy Hardpoint 1 heavy integrated); Deploy mirrors the mounted gun onto the machine’s Inventory, and a mounted gun fires with **Gunnery**.
- **Wearable armor + shield mods** — Gear master **§2F**, **14 SKUs as of 0.3.100 (G2)**, Street → Prototype: Soft Armor Insert, Mag-Harness, Climate Seal Liner, Trauma Plates, Stealth Weave, Reactive Flash Comp, Brace Struts, Shield Capacitor, Insulator Liner, Seal Kit, Scanner Null, Thermoptic Skin, Reactive Plating, Denial Field. Hosts: `armor` and `shield`. They buy tags, edges, convenience and small **typed** immunities — **never Stamina**, which stays on the armor Item by class and wearer Echelon. Three exclusive groups refuse to stack: *inner liner*, *outer camouflage layer*, *active-denial cell*.
- **Gadget mods** — Gear master **§1H**, **17 SKUs as of 0.3.100 (G2)**, Street → Prototype across every Category-1 family: Filter Upgrade, Burner Mode Chip, Quiet Picks, Focus Magnifier, Encryption Dongle, Spectrum Filter, Skeleton Key Soft, Beacon Squelch, Jam Mask, Breach Jack, Sniffer Head, Rad Baffle, Habitat Stage, Deep Optics, Passkey Stack, Quantum Link, Ghost Frame. Hosts: `comms`, `sensors`, `bne-mechanical`, `bne-electronic`, `survival`, `wired`. Two exclusive groups: *optical stage*, *lock-cracking package*.
- **Programs** — occupy deck / RCC slots (Category 4B+); §Craft Project skill = **Hacking**.
- **Matrix payloads** — consumable mods (Gear master **§4C**; locked 2026-09-17). A payload fills one deck slot as a **magazine**, sharing the deck's slots with suites. Loading = Craft (Hacking) Project; the result sets its fires (**low 1 / middle 3 / high 5**, provisional). Each Run spends one; at 0 the slot frees. **Whiteout** compile is **steep / hard**. A payload fills a slot, it never has one, so the Consumables rule above still holds. Full player rule: `docs/raw/21-the-wire.md` (Deck software: suites vs payloads); doctrine: `docs/masters/GHOSTWIRE_WIRE_SOFTWARE_DOCTRINE.md`.

## Invent a Mod (v1) — LOCKED

Between runs, a hero may invent a new mod as a **Project**:

1. **Pitch** — name, host family, slot cost (usually **1**), one-sentence effect, Availability feel (Street → Prototype).
2. **Firewall check (Director)** — reject anything that grants characteristics, skills, class features, heroic resources, or Kit doctrine lines.
3. **Echelon gate** — effect power ≤ inventor’s **Echelon** (Street/Professional at E1, Restricted at E2, Military at E3, Prototype at E4).
4. **Materials ¥** — ≈ half a comparable published mod (**floor ¥100**); spend up front.
5. **Project Power Roll** with the skill by host (table above):
   - **Low:** materials burned; no mod (or a flawed one-use prototype at Director whim).
   - **Middle:** personal unique mod (works for the inventor).
   - **High:** personal + the crew may treat it as a campaign catalog entry.
6. **Install** is a **separate** §Craft Project onto a host with free slots.

Invent a Mod does **not** bypass Availability heat, Director veto, or the firewall.

## Chargen note

Starting Kit grant includes **street-band qualifying gear** only (see Kits + Economy). **Mods never auto-grant** at chargen — buy, craft, or invent them later. Merc (dual Kit) receives street-band qualifying gear for **both** Kits; still no free mods.

## Related chapters

- Economy — `docs/rulebook/11-economy.md` (§Craft Projects; ¥ loop)
- Kits — `docs/rulebook/10-kits.md` (doctrine vs object; chargen gear)
- Chrome — `docs/rulebook/12-chrome.md` (Cybertech-adjacent; Body Integrity)
- Gear master — `docs/masters/GHOSTWIRE_GEAR_MASTER.md`
- The Wire (deck software: suites vs payloads) — `docs/raw/21-the-wire.md`
- Skills master — `docs/masters/GHOSTWIRE_SKILLS_MASTER.md`
