# Mods

**RAW status:** draft  
**Sources:** `docs/rulebook/14-mods.md`, `docs/masters/GHOSTWIRE_GEAR_MASTER.md`

---

## Purpose

Mods are the **object-side** upgrade layer. Kits train technique; Economy buys hosts; Mods fill **mod slots** on those hosts with situational tags and edges. A smartlinked Ghost-Kit pistol gets both the Kit’s doctrine *and* the mod’s effects — they never overwrite each other.

## Doctrine

| Rule | Detail |
|---|---|
| **¥ cost** | Every published mod has a nuyen price. Invented mods spend materials ¥ up front (see Invent a Mod). |
| **Stack with Kits** | Mods and Kit doctrine touch **different numbers**. Never rewrite Kit damage / Stamina / signature lines. |
| **§Craft = procedure** | Installing, swapping, removing, or inventing a mod is a Draw Steel **Project** (downtime). §Craft is **not** a skill name. |
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
| **Weapons** | Published core set in Gear master **§3G** |
| **Armor / shields** | Families not yet published |
| **Gadgets** | Comms, sensors, B&E, survival — families not yet published |
| **Vehicles / drones** | Published set in Gear master **§5F** |
| **Decks / RCCs** | Slots filled by **programs / autosofts** from the Matrix catalog (Gear master Category 4); install skill = **Hacking** |

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

Point of record: `docs/masters/GHOSTWIRE_GEAR_MASTER.md`.

- **Weapon mods** — Gear master **§3G** (Smartlink, Suppressor, Recoil Comp, Extended Mag, Smart-Scope, Gas-Seal, Underbarrel Mount, Personalized Grip, …).
- **Vehicle / drone mods** — Gear master **§5F** (Gun Rack, Plate-Up, Tune Kit, Sensor Pod, Ghost Coat, Runflats, Rigger Cocoon, Ammo Bin, …).
- **Armor + gadget families** — not yet published.
- **Programs** — occupy deck / RCC slots (Category 4B+); §Craft Project skill = **Hacking**.

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
