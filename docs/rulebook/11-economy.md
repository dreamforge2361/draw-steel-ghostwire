# Ghostwire Core Rulebook — Chapter: Economy (Nuyen)

**Status:** Stage 3 draft — for Michael review (2026-09-16)  
**Pairs with:** `docs/rulebook/12-chrome.md`, `docs/rulebook/14-mods.md`, `docs/masters/GHOSTWIRE_CHROME_MASTER.md`, `docs/masters/GHOSTWIRE_GEAR_MASTER.md`, `docs/rulebook/10-kits.md`  
**Foundry:** stock Draw Steel `wealth` field is remapped to **Nuyen (¥)** in module lang — do not invent a parallel currency field for v1.

**Design locks (do not reopen in this draft):**
- Ghostwire is world + module on **stock Draw Steel**; rulebook text first, Foundry later
- **Nuyen (¥)** is the real currency
- Chrome costs **¥ + Body Integrity**, never XP or any other character power
- Attributes remain Physique, Reflex, Logic, Instinct, Persona
- Availability bands: street → professional → restricted → military → prototype (not a GW tier ladder)
- Starting funds v1: **¥5,000** liquid + **one free starting Kit** (includes street-band qualifying gear)
- **Kit doctrine never costs ¥** — ¥ buys gear / mods / chrome / services only

---

## Purpose

This chapter defines the **nuyen loop** for Ghostwire on Draw Steel: how heroes earn ¥, what ¥ buys, and the hard wall between money and character power (characteristics, skills, class features, XP-driven advancement).

Draw Steel abstracts gear behind Wealth. Ghostwire tracks cash because chrome, kits' qualifying gear, bribes, lifestyle, and Wired access are material progression axes. Kits remain trained doctrine (see Kits chapter); the objects those doctrines need are Economy items.

## What ¥ buys

| Spend | Notes |
|---|---|
| **Gear** | Weapons, armor, tools that satisfy Kit categories or standalone use |
| **Mods** | Smartlink, silencer, armor weave, etc. (stack with Kit doctrine) — full rules: **Mods chapter** `14-mods.md` |
| **Chrome** | Implants and chrome packages — **also** spends Body Integrity (Chrome chapter) |
| **Lifestyle** | Pay upkeep band or street complication — RAW: `docs/raw/26-lifestyle-downtime.md` |
| **Bribes / favors** | Access, silence, fixers, corp doors |
| **Wired access** | Decks, hosts, illegal node time, black-clinic install facilities |

¥ never buys attributes, skills, class features, or any other character power.

## Character-power firewall (absolute)

**Money never buys character power.**

- Attributes, skills, class features, heroic resources, and XP-driven advancement stay on the class/build side.
- ¥ buys **objects and services** (gear, chrome hardware, installs, bribes, access).
- Chrome is the one exception that looks like power — and it is throttled by **Body Integrity** and magic erosion, not by a character-power cost. See Chrome chapter.
- Converting ¥ into character power (or character power into ¥) is illegal by design. Directors who want to grant a Background/Profession ¥ bonus may do so as liquid cash — still never as free attributes or class picks.

## Starting package (v1 locked)

Every new hero starts with:

1. **¥5,000** liquid nuyen
2. **One free starting Kit** (doctrine) **including street-band qualifying gear** for that Kit’s category (so the Kit is live on day one)

### Kits chargen gear (locked)

- Street-band qualifying gear auto-grants **at chargen only** with the free Kit (Economy object side of the doctrine).
- **Merc** (Operator dual-Kit): street-band qualifying gear for **both** Kits.
- **Mods** and **chrome** are opt-in — never auto-grant. Buy with ¥ (chrome also spends Body Integrity). See `14-mods.md` and `12-chrome.md`.

**No free starting chrome.** Buy chrome with ¥ + Body Integrity if allowed.

Directors may later grant a ¥ bonus from Background/Profession — **flagged open** (amount / table deferred).

## Availability bands

Gear, chrome, and some services are gated by **Availability**, not a Ghostwire tier ladder. Match Kits chapter language: progress by Availability + echelon-appropriate lists.

| Band | Feel (brief) |
|---|---|
| **Street** | Common, gray-market, alley vendors; easy for runners |
| **Professional** | Licensed shops, corp surplus, competent fixers |
| **Restricted** | Permit / underworld gate; heat if careless |
| **Military** | Milspec issue; black clinics and serious fixers |
| **Prototype** | Unique, corp R&D, or one-off; campaign prize or ruinous buy |

Exact price lists and band assignment per item land in the gear pass. Soft/bioware chrome and military packages skew high-Availability by design.

## Run payouts (provisional Director guidance)

Mark **provisional** — tune after playtest. Per-run (or per-job) liquid for a typical crew share before lifestyle burn:

| Job scale | Provisional ¥ (crew share band) |
|---|---|
| Street job / gang errand | ¥500–2,000 |
| Mid run / district score | ¥2,000–8,000 |
| Corp run / serious extraction | ¥5,000–20,000 |
| Black-ops / milspec / prototype prize | ¥20,000+ or unique gear instead |

Directors may pay partly in gear, chrome credits, or favors. Payouts should fund chrome/gear progression without trivializing Body Integrity or Availability gates.

## Kits ↔ Economy bridge (locked 2026-09-16)

**Kit doctrine never costs ¥.** A Kit is trained technique (character-power side of the firewall), same as the Kits chapter.

| Spend | ¥? |
|---|---|
| Learn / know a Kit (doctrine) | **No** — chargen free Kit; later Kits via class features, mentors, or downtime **training** (time/story), not a cash menu |
| Swap which known Kit is active | **No** — respite activity (Kits chapter) |
| Qualifying weapons / armor | **Yes** — Economy + Availability |
| Gear mods (smartlink, etc.) | **Yes** |
| Chrome that *is* the qualifying gear (cyber-limb, implant weapon) | **Yes** + Body Integrity (Chrome chapter) |
| Cyborg frame mounts that satisfy a Kit category | **Yes** + hardpoints (Frame Modules stub) |

**Ownership rule (unchanged):** without a qualifying item in hand/worn, Kit bonuses are inert (improvised fallback). Better Availability gear upgrades the *object*; Kit bonus lines stay the same.

## Link to Chrome / Body Integrity

Chrome purchases spend **¥ + Body Integrity**. Grades trade cheap Salvage (Integrity ×1.5) vs Soft-Bioware (Integrity ×0.4 round up). Cyborgs do **not** use Chrome/Body Integrity. Full rules: `12-chrome.md` and the Chrome master.

## §Craft (downtime Projects)

**§Craft is a procedure, not a skill.** Installing, swapping, removing, inventing, or configuring gear/mods is a Draw Steel **Project** during downtime (with the field-toggle exception for already-installed features — see Mods chapter).

Power Rolls on those Projects use ordinary Ghostwire skills by job:

| Skill | Job |
|---|---|
| **Hacking** | Programs / deck software / software installs |
| **Electronics** | Deck hardware, sensors, gadgets, Wired devices |
| **Repair** | Weapons, armor, vehicles/drones — physical mods |
| **Cybertech** | Chrome-adjacent only |

Legacy labels **Gunsmithing** and **Cyber/electronics** in older Gear-master rows mean **Repair** and **Electronics**. Full Invent a Mod + slot rules: `docs/rulebook/14-mods.md` (**locked**).

## Lifestyle burn

Between runs, heroes either **pay lifestyle** (safehouse grade, food, heat scrub) or take a **street complication**. **Full table:** `docs/raw/26-lifestyle-downtime.md` (B67; upkeep ¥ from gear master §F3).

## Foundry note

Module lang remaps Draw Steel's **wealth** label to **Nuyen**. Track ¥ on the hero sheet wealth field for v1. **Body Integrity** already ships in the Ghostwire Chrome pack (Integrity costs on implants); keep using that path — do not invent a parallel currency or Integrity field.

## Open questions (Michael)

1. Background/Profession ¥ bonus — amount and whether it is always liquid.
2. Lifestyle rates — **drafted** in `26-lifestyle-downtime.md` (tune after playtest; Recovery-quality column pending DS alignment).
3. Run payout bands — keep provisional numbers or retune after first table.
4. Bribes / Wired access sample price points for the gear pass.
5. How additional Kits are unlocked after chargen (class list / mentor / downtime training length) — still not ¥.

**Closed 2026-09-16/17:** Invent a Mod + §Craft skill-by-host + echelon/Availability gear-grade remap — see `14-mods.md` (locked). Do not reopen as an Economy open question.
