# Ghostwire Core Rulebook — Chapter: Economy (Nuyen)

**Status:** Stage 3 draft — for Michael review (2026-09-16)  
**Pairs with:** `docs/rulebook/12-chrome.md`, `docs/masters/GHOSTWIRE_CHROME_MASTER.md`, `docs/rulebook/10-kits.md`  
**Foundry:** stock Draw Steel `wealth` field is remapped to **Nuyen (¥)** in module lang — do not invent a parallel currency field for v1.

**Design locks (do not reopen in this draft):**
- Ghostwire is world + module on **stock Draw Steel**; rulebook text first, Foundry later
- **Nuyen (¥)** is the real currency
- Chrome costs **¥ + Body Integrity**, never BP/XP/class power
- Attributes remain Physique, Reflex, Logic, Instinct, Persona
- Availability bands: street → professional → restricted → military → prototype (not a GW tier ladder)
- Starting funds v1: **¥5,000** liquid + **one free starting Kit**

---

## Purpose

This chapter defines the **nuyen loop** for Ghostwire on Draw Steel: how heroes earn ¥, what ¥ buys, and the hard wall between money and character-power budget (BP/XP/class features).

Draw Steel abstracts gear behind Wealth. Ghostwire tracks cash because chrome, kits' qualifying gear, bribes, lifestyle, and Wired access are material progression axes. Kits remain trained doctrine (see Kits chapter); the objects those doctrines need are Economy items.

## What ¥ buys

| Spend | Notes |
|---|---|
| **Kits (after chargen)** | Additional Kit doctrines / loadouts beyond the free starting Kit — see below |
| **Gear** | Weapons, armor, tools, mods that satisfy Kit categories or standalone use |
| **Chrome** | Implants and chrome packages — **also** spends Body Integrity (Chrome chapter) |
| **Lifestyle** | Thin burn: pay upkeep or take a street complication (placeholder) |
| **Bribes / favors** | Access, silence, fixers, corp doors |
| **Wired access** | Decks, hosts, illegal node time, black-clinic install facilities |

¥ never buys attributes, skills, class features, or BP/XP equivalents.

## BP firewall (absolute)

**Money never buys character power.**

- Attributes, skills, class features, heroic resources, and BP/XP spends stay on the class/build side.
- ¥ buys **objects and services** (gear, chrome hardware, installs, bribes, access).
- Chrome is the one exception that looks like power — and it is throttled by **Body Integrity** and magic erosion, not by a BP tax. See Chrome chapter.
- Converting ¥ → BP (or BP → ¥) is illegal by design. Directors who want to grant a Background/Profession ¥ bonus may do so as liquid cash — still never as free attributes or class picks.

## Starting package (v1 locked)

Every new hero starts with:

1. **¥5,000** liquid nuyen
2. **One free starting Kit** (chosen from the Kits chapter / class guidance)

**No free starting chrome package.** Buy chrome with ¥ if Body Integrity allows. Additional kits, gear, and chrome after chargen are bought with ¥.

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

## How Kits are purchased after chargen

- **Chargen:** one Kit free (doctrine + the implication that the hero owns qualifying starter gear appropriate to that Kit — Directors may treat starter qualifying gear as covered by the free Kit for v1 simplicity, or require spending part of the ¥5,000; **open**).
- **After chargen:** additional Kits cost ¥ (training / doctrine acquisition fee — exact schedule deferred to gear pass). The hero must still **own** Availability-appropriate qualifying weapons/armor for the new Kit's bonuses to apply (Kits ownership rule).
- Swapping the *active* Kit during a respite remains a respite activity (Kits chapter); buying a *new* Kit into the hero's repertoire is an Economy spend.

**Tension to resolve on review:** Kits chapter currently says Kit doctrine never costs ¥ (training on BP side). Economy v1 locks additional Kits as ¥ purchases. Prefer: ¥ unlocks the doctrine slot; BP/class still never sold for cash. Confirm with Michael.

## Link to Chrome / Body Integrity

Chrome purchases spend **¥ + Body Integrity**. Grades trade cheap Salvage (Integrity ×1.5) vs Soft-Bioware (Integrity ×0.4 round up). Cyborgs do **not** use Chrome/Body Integrity. Full rules: `12-chrome.md` and the Chrome master.

## Lifestyle burn (thin placeholder)

Between runs, heroes either **pay lifestyle** (safehouse grade, food, heat scrub) or take a **street complication** (Director pick: debt collector, illness, gear theft, unwanted attention, etc.). Full lifestyle table deferred — one short pressure valve for now so ¥ has a sink besides chrome.

## Foundry note

Module lang remaps Draw Steel's **wealth** label to **Nuyen**. Track ¥ on the hero sheet wealth field for v1. Body Integrity is a separate resource (Foundry spike deferred — see FOUNDRY-BUILD-PLAN B8).

## Open questions (Michael)

1. Background/Profession ¥ bonus — amount and whether it is always liquid.
2. Does the free starting Kit include qualifying street-band gear, or must ¥5,000 cover that gear?
3. Exact ¥ price for additional Kits after chargen (training fee schedule).
4. Reconcile Kits chapter "doctrine never costs ¥" vs Economy v1 "additional kits bought with ¥."
5. Lifestyle rates — when to expand beyond the pay-or-complication placeholder.
6. Run payout bands — keep provisional numbers or retune after first table.
7. Bribes / Wired access sample price points for the gear pass.
