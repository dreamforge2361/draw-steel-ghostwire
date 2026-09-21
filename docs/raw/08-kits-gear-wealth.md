# Kits, Gear & Wealth (¥)

**RAW status:** draft  
**Sources:** `docs/rulebook/10-kits.md`, `docs/rulebook/11-economy.md`, `docs/masters/GHOSTWIRE_GEAR_MASTER.md` (rules header, remapped per its DS alignment override)

---

## Part 1 — Kits

### What a Kit is (and what it is not)

A **Kit** is a **loadout doctrine** — a package of trained fighting technique that turns a category of gear into a personal combat style. It represents *how you were trained to fight*, not *what you happen to be carrying*.

- A Kit grants a bundle of combat bonuses (Stamina, damage, speed, stability, distance, disengage) and one **signature ability** — a repeatable weapon attack keyed to the Kit.
- A Kit is **flexible and never locked**: a hero may swap Kits during a respite (a respite activity). Training can be re-focused between runs; it is not a permanent build choice.
- **A Kit is training, so it lives on the character-power side of the firewall — it is never bought with nuyen.** This is the key distinction from gear. A Kit is character capability (like a class feature or skill); the item the Kit uses is Economy gear. Nuyen never buys the doctrine; it buys the tool the doctrine needs.
- **Not every hero leans on a Kit equally.** Kits are the martial identity layer — the **Operator, Scout, Commander**, and any gun/blade/fist-forward build live here. A pure caster (Elementalist, Street-Priest) or a deck-bound Hacker may take a light Kit or none, fighting instead through the Veil or the Wired resource systems.

### The bridge to the Economy — the ownership rule

This is the rule that keeps Kits and the Economy/gadgets system intact and interlocked. If you don't wield your Kit's gear, you lose its bonuses — that ownership clause is the load-bearing bridge here:

1. **A Kit names a category, not a specific item.** A Kit calls for, e.g., "a light firearm + light armor," "a heavy weapon + heavy armor," "a precision rifle, no armor," or "unarmed / cyber-limb strikes." Categories are broad; the specifics are yours.
2. **You must OWN a qualifying item — bought through the Economy — to get the Kit's bonuses.** The gun, blade, bow-equivalent, or armor that satisfies the Kit's category is nuyen-purchased, Availability-gated (echelon-appropriate) gear like everything else. No qualifying weapon in hand means no weapon bonuses from the Kit (you're using an improvised weapon, below). No qualifying armor worn means no Stamina/stability bonus from the Kit. **The Kit is inert without the gear the Economy supplies.**
   - *Armor and Kit Stamina:* when a Kitted class wears qualifying armor, the Kit's Stamina bonus **is** that armor's Stamina — you do not also add the armor’s Stamina on top; the two are the same contribution and never double-count. A class with no Kit gains the armor's Stamina directly from §Armor-1. Encumbrance, tags, typed Immunity, and gear mods apply in both cases.
3. **Kit doctrine and gear mods stack, because they touch different numbers.** The Kit adds doctrine bonuses (damage by Power Roll result band, distance, speed, stability, the signature ability). Nuyen-bought mods (smartlink, silencer, recoil comp, armor weave, drone hardpoint) add situational traits and effects via the mod-slot crafting subsystem. They never overwrite each other — a smartlinked, silenced pistol in the hands of a **Ghost**-Kit runner gets both the Kit's ranged doctrine *and* the mods' effects. A gear-focused hero therefore benefits twice (Kit + deep mods).
4. **Gear quality still matters underneath the Kit.** The Kit's bonuses are constant, but the item satisfying it climbs Availability / echelon gear lists (street-grade → milspec / prototype). A Longshot Kit is deadlier with a high-Availability rifle than a cheap zip-gun even though the Kit line is unchanged — the Economy remains the axis of material progression, the Kit the axis of trained skill.

**Firewall check:** a Kit costs no nuyen (it's training) and the gear costs no character power (it's an object). Neither converts into the other. The two economies stay separate and both stay meaningful.

### What a Kit grants

Each Kit provides some subset of the following:

- **Stamina bonus** — added to Stamina maximum; scales by **echelon** (`24`). Requires the Kit's armor to be worn.
- **Speed bonus** — added to movement.
- **Stability bonus** — added to stability (resisting forced movement). Requires the Kit's armor.
- **Melee / Ranged damage bonus** — added to the rolled damage of the matching weapon attacks, expressed as **+X / +Y / +Z across the three Power Roll result bands** (low / middle / high). Requires the qualifying weapon.
- **Melee / Ranged distance bonus** — extends the reach/range of the matching weapon attacks (does not enlarge area-of-effect abilities).
- **Disengage bonus** — extra squares of shift when you Disengage.
- **Signature ability** — one repeatable weapon Strike unique to the Kit, whose printed distance and damage already include the Kit's bonuses.

**Power Roll note (binding):** bonus lines use this book’s print order: low result / middle result / high result (`03`). A “finesse” Kit reads roughly +2/+2/+2 (flat, reliable). A “heavy hitter” Kit puts the large number on the **high** result (e.g. +0/+0/+4) — not an inverted ladder.

### Improvised weapons (the no-gear fallback)

Anything that isn't your Kit's weapon — a pipe, a bottle, a chair, a dropped pistol you grabbed, or your bare fists if your Kit isn't an unarmed Kit — is an **improvised weapon**. You may use improvised weapons with **class** weapon abilities, but not with your **Kit's** weapon abilities, and you add no Kit bonuses to an improvised attack. This is the mechanical teeth of the ownership rule: disarmed or under-equipped, a Kit hero still fights, but without their doctrine bonuses — a real, recoverable setback rather than helplessness.

### Kits are flexible

One Kit at a time; swap it during a respite (a respite activity) — never a locked build choice.

---

### The Kit list

Weapon/armor “category” is what the purchased item must satisfy; bonus lines are provisional benchmarks, printed in Power Roll order (low / middle / high). Fantasy melee Kits are fully supported — this is a cyber-fantasy world where a chromed samurai, a monowhip duelist, and a mage-blade coexist with gunfighters.

| Kit | Gear category (Economy-supplied) | Doctrine sketch |
|---|---|---|
| **Longshot** | Precision rifle; no armor | Extreme range, huge high-result payoff (+0/+0/+4), reward for holding still |
| **Saturation** | SMG / carbine; light armor | Volume fire, two-target signature, steady ranged bonus |
| **Ghost** | One or two silenced light weapons; light armor | Mixed melee/ranged, shift-on-hit, infiltration doctrine |
| **Gunslinger** | Medium sidearm/blade; light armor | High speed, push-and-shift finesse |
| **Streetsweeper** | Shotgun/carbine + medium weapon; medium armor | Flexible mid-range hybrid, slow-on-hit signature |
| **Juggernaut** | Heavy weapon; heavy armor | Tank doctrine, massive high-result hit, punishes attackers |
| **Breacher** | Medium weapon + ballistic shield; medium armor | Push/prone control, high Stamina, front-line |
| **Warframe** | Medium weapon + shield; heavy armor | Highest Stamina, taunt/hold-the-line signature |
| **Bulldozer** | Heavy weapon; no armor | Mobile heavy hitter, charge-for-damage |
| **Brawler** | Unarmed / cyber-limb strikes; no armor | Durable striker, slide-and-follow |
| **Mantis** | Unarmed / cyber-limb strikes; no armor | Fast martial artist, swap-places signature |
| **Chromeblade** | A light + a medium melee weapon; medium armor | Twin-blade doctrine, act-between-strikes signature |
| **Reach** | Polearm / long cyber-weapon; medium armor | Extended melee reach, two-target sweep |
| **Monowhip** | Whip / monofilament / chain; no armor | Very fast, reach + vertical-pull signature |
| **Snarehunter** | Net/ensnaring gear + polearm; light armor | Control specialist, restrain-on-hit |
| **Staff Adept** | Staff / polearm; light armor | Mobile reach, slide control |
| **Duelist** | Medium melee weapon; light armor | Balanced melee, forced-movement amplifier |
| **Raider** | Light weapon + shield; light armor | Melee/thrown hybrid, impose-bane signature |
| **Hexshot** | Bow/crossbow/dartgun; no armor | Ranged + rider magic/tech effect (splash) |
| **Spellblade** | Medium melee + shield; light armor | Melee weapon carrying an elemental/tech strike |
| **Sanctified** | Light weapon; heavy armor | Armored faith-warrior, weaken-on-hit (Veil-flavored) |

*Magic/tech-flavored Kits — Hexshot, Spellblade, Sanctified — are the natural attachment points for the Veil and for cyber-augmented casters; their "magic" damage rider can be reskinned as elemental essence, holy/infernal power, or a weapon-mounted tech effect per the wielder's class.*

#### Kits grouped by role

| Role | Kits |
|---|---|
| Ranged specialists | Longshot, Saturation, Ghost, Hexshot |
| Gun/blade finesse | Gunslinger, Streetsweeper, Raider |
| Heavy / tank | Juggernaut, Warframe, Breacher, Bulldozer |
| Melee / martial | Brawler, Mantis, Chromeblade, Reach, Monowhip, Snarehunter, Staff Adept, Duelist |
| Magic/tech-flavored | Spellblade, Sanctified (plus Hexshot above) |
| Tech / rigger | Fabricator's Bench, Rigger's Harness, Field Chassis |

#### Wrench rigger Kits

Three light Kits built for the Wrench's subclasses (any class with light-Kit access can take them). Doctrine bonuses are provisional, in Power Roll order (low / middle / high); each signature is a 2/5/7 + characteristic ranged strike.

| Kit | Gear category | Doctrine bonuses | Signature ability | Rigging bonus | Starter Kit for |
|---|---|---|---|---|---|
| **Fabricator's Bench** | Light sidearm + mobile tool rig; light armor | Stamina +3 · Speed +1 · Disengage +1 · Melee +1/+1/+1 · Ranged +1/+1/+1 · Ranged distance +5 | **Bench-Rigged Shot** — a machine you control within 5 regains 1/2/3 Integrity | +1 on Field Repair Power Rolls targeting your own drones | Drone Jockey |
| **Rigger's Harness** | Light sidearm + neural control-interface mount; light armor | Stamina +3 · Speed +2 · Disengage +1 · Ranged +1/+1/+1 · Ranged distance +5 | **Neural Snap Shot** — shift 1/2/2 (high: the target has a bane on its next strike against you) | +1 on Jump-In checks | Vehicle Rig-Pilot |

**Connect.** **Rigger’s Harness** is a Wire interface (≡ deck). Fabricator’s Bench and Field Chassis are not. Full list: `21-the-wire.md`.
| **Field Chassis** | Light sidearm + portable turret-control tablet; light armor | Stamina +3 · Speed +1 · Stability +1 · Ranged +1/+1/+1 · Ranged distance +5 | **Tablet Crossfire** — middle/high: a machine or pre-placed asset you control gains an edge on its next strike against the target (high: target slowed) | +1 on Deploy checks for pre-placed assets | Facility Rigger |

---

## Part 2 — Wealth (¥)

### What ¥ buys

| Spend | Notes |
|---|---|
| **Gear** | Weapons, armor, tools that satisfy Kit categories or standalone use |
| **Mods** | Smartlink, silencer, armor weave, etc. (stack with Kit doctrine) — full rules: `10-mods.md` |
| **Chrome** | Implants and chrome packages — **also** spends Body Integrity (Chrome chapter) |
| **Lifestyle** | Pay upkeep band or take a street complication — full table: `26-lifestyle-downtime.md` |
| **Bribes / favors** | Access, silence, fixers, corp doors |
| **Wired access** | Decks, hosts, illegal node time, black-clinic install facilities |

¥ never buys attributes, skills, class features, or any other character power.

### Character-power firewall (absolute)

**Money never buys character power.**

- Attributes, skills, class features, heroic resources, and XP-driven advancement stay on the class/build side.
- ¥ buys **objects and services** (gear, chrome hardware, installs, bribes, access).
- Chrome is the one exception that looks like power — and it is throttled by **Body Integrity** and magic erosion, not by a character-power cost. See Chrome chapter.
- Converting ¥ into character power (or character power into ¥) is illegal by design. Directors who want to grant a Background/Profession ¥ bonus may do so as liquid cash — still never as free attributes or class picks.

### Starting package

Every new hero starts with:

1. **¥5,000** liquid nuyen
2. **One free starting Kit** (doctrine) **including street-band qualifying gear** for that Kit’s category (so the Kit is live on day one)

#### Kits chargen gear

- Street-band qualifying gear auto-grants **at chargen only** with the free Kit (Economy object side of the doctrine).
- **Merc** (Operator dual-Kit): street-band qualifying gear for **both** Kits.
- **Mods** and **chrome** are opt-in — never auto-grant. Buy with ¥ (chrome also spends Body Integrity). See `10-mods.md` and `09-chrome-body-integrity.md`.

**No free starting chrome.** Buy chrome with ¥ + Body Integrity if allowed.

A Director may grant a small ¥ bonus from Background or Profession, as liquid cash only.

### Availability bands

Gear, chrome, and some services are gated by **Availability**, not a Ghostwire tier ladder. Match Kits chapter language: progress by Availability + echelon-appropriate lists.

| Band | Feel (brief) |
|---|---|
| **Street** | Common, gray-market, alley vendors; easy for runners |
| **Professional** | Licensed shops, corp surplus, competent fixers |
| **Restricted** | Permit / underworld gate; heat if careless |
| **Military** | Milspec issue; black clinics and serious fixers |
| **Prototype** | Unique, corp R&D, or one-off; campaign prize or ruinous buy |

Soft/bioware chrome and military packages skew high-Availability by design.

### Run payouts (Director guidance — integrated U+G+buffer)

Payday is **per hero share, per completed job**, and lands at **job complete / full respite** (`24`, `26`). Mid-job **short stops** do not pay.

```
Payout ≈ U + G + ~25%(U + G)
```

- **U** — Lifestyle upkeep for the band the hero claims this full respite (`26`). Suggested ladder: L1–2 Low (¥400); L3–5 Middle (¥1,200); L6–8 High (¥3,500); L9–10 High (Elite rare ¥9,000 / Writ-covered).
- **G** — Gear allotment by level band (table). Funds chrome/gear progression without trivializing Body Integrity or Availability.
- **~25%** — Buffer for bribes, ammo, Medic restock, Trace scrub, fixer skim.

| Hero levels | Suggested U | **G** | ≈ Hero share `1.25×(U+G)` |
|---|---|---|---|
| **1–2** | ¥400 | **¥1,600** | **¥2,500** |
| **3–5** | ¥1,200 | **¥3,600** | **¥6,000** |
| **6–8** | ¥3,500 | **¥8,500** | **¥15,000** |
| **9–10** | ¥3,500 (Elite rare ¥9,000) | **¥16,500** (Elite **¥15,000**) | **¥25,000** (Elite **¥30,000**) |

**L6+:** the Director may pay **half ¥ / half favor** (Restricted window, Writ cover, extract credit, named introduction) instead of full liquid.

Skew up for heat / Trace Alert / milspec prize; skew down for quiet cut-outs. Directors may still substitute unique gear for part of the share. Do not pay characteristics, Kits, or class features in ¥.

**Campaign worked example** (same numbers): `docs/directors/campaigns/QUIET-FLOOR-XP-NUYEN-PACING.md`.

*Legacy job-scale bands (street ¥500–2,000 / district ¥2,000–8,000 / corp ¥5,000–20,000 / black-ops ¥20,000+) remain useful as a heat dial on top of the level-band table — they are not a second economy.*

### Kits ↔ Economy bridge

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

### Link to Chrome / Body Integrity

Chrome purchases spend **¥ + Body Integrity**. Grades trade cheap Salvage (Integrity ×1.5) vs Soft-Bioware (Integrity ×0.4 round up). Cyborgs do **not** use Chrome/Body Integrity. Full rules: `09-chrome-body-integrity.md`.

### §Craft (downtime Projects)

**§Craft is a procedure, not a skill.** Installing, swapping, removing, inventing, or configuring gear/mods is a **Project** (`03`) during downtime (with the field-toggle exception for already-installed features — see Mods chapter).

Power Rolls on those Projects use ordinary Ghostwire skills by job:

| Skill | Job |
|---|---|
| **Hacking** | Programs / deck software / software installs |
| **Electronics** | Deck hardware, sensors, gadgets, Wired devices |
| **Repair** | Weapons, armor, vehicles/drones — physical mods |
| **Cybertech** | Chrome-adjacent only |

Full Invent a Mod and slot rules: `10-mods.md`.

### Lifestyle burn

At each **full respite** (not a mid-job short stop), heroes either **pay lifestyle** (safehouse grade, food, heat scrub, and that band’s **Lazarus Extract** contract) or take a **street complication** (Director pick: debt collector, illness, gear theft, unwanted attention, etc.). **Full bands, Lazarus tiers, Medic restock quotes, and downtime overview:** `26-lifestyle-downtime.md`. Extract is bundled into upkeep — no second ¥ line unless the Director adds a premium rider.

## Part 3 — Gear

Gear is everything ¥ buys that isn’t chrome: general and lifestyle gear, armor, weapons, Wired hardware, vehicles and drones, and magical foci. The full itemized catalog is published separately (Ghostwire Gear catalog); this section is the rule set every entry follows.

### Reading a gear entry

> **Name** · **Echelon** · **Availability** · **Cost (¥)** · **Profile** (the stat that matters — effect, bonus, or damage) · **Mod slots** · **Tags**

- **Echelon + Availability** set the item’s grade. Price band and mod slots come from grade alone, never from the item’s raw power:

| Echelon | Availability | Price band | Mod slots |
|---|---|---|---|
| 1 | Street | ¥50–¥300 | 1 |
| 1 | Professional | ¥300–¥1,200 | 2 |
| 2 | Restricted | ¥1,200–¥5,000 | 3 |
| 3 | Military | ¥5,000–¥20,000 | 4 |
| 4 | Prototype | ¥20,000–¥80,000+ | 5 |

- **Tags** are keywords other rules hook into (*Sealed*, *Wired*, *Concealable*, *Two-handed*, *Focus*, *Consumable*, and so on). A tag never adds a rule of its own.
- **Consumables** (ammo, medkits, stims, grenades, reagents) are bought in the listed unit and used up in play. They never have mod slots.
- **Firewall:** ¥ and grade buy convenience, price, Availability, and mod capacity — never raw combat power, Stamina, or class ability. The one exception is the single **signature-focus bond** for casters’ foci.

### Weapons

- Every weapon names a **damage band** in its tags: **Light ≈ 4**, **Medium ≈ 6**, **Heavy ≈ 9**, **Anti-vehicle ≈ 14** (each varies by ±1–2 within its band). Weapon Power Roll results print **low / middle / high** (`03`). When a weapon line gives a single number, that number is its **middle** result; a line that prints all three results uses those.
- Damage carries a **type tag** that maps to this book’s damage types: **electrical → lightning**, **toxin → poison**, **fire → fire**, **kinetic → untyped**, **AP → untyped** plus the AP gear note (ignores or reduces armor-as-Stamina per that gear’s rules; AP is not a damage type). Untagged damage is kinetic (untyped).
- A Kit’s damage bonus lines add on top by Power Roll result (see What a Kit grants).

### Armor as Stamina

Ghostwire has no armor class and no to-hit-versus-defense roll. Worn armor **raises your maximum Stamina** instead of reducing damage. The bonus scales with your hero **Echelon**:

| Armor | Echelon 1 (Street — default) | Echelon 1 (Professional) | Echelon 2 | Echelon 3 | Echelon 4 | Encumbrance |
|---|---|---|---|---|---|---|
| **Light** | +3 | +4 | +6 | +8 | +10 | None |
| **Medium** | +6 | +8 | +11 | +14 | +18 | Bane on Stealth |
| **Heavy** | +9 | +12 | +16 | +21 | +27 | −1 speed; bane on Stealth and Reflex tests for agility |
| **Shield / riot board** (stacks with any armor) | +3 | +4 | +5 | +6 | +8 | Occupies one hand; bane on two-handed weapon use |

- **Echelon 1 default is the Street column.** A 1st–3rd level hero uses Street unless they have bought Professional-Availability armor, which is the upgraded Echelon 1 option when Availability allows.
- A hero with a Kit who wears the Kit’s qualifying armor uses the Kit’s Stamina bonus instead — the two never stack.
- The **only** true damage reduction is **typed immunity** (fire, poison, lightning, cold), carried by sealed and hardened specialty armor.
- Armor class shifts mod slots: **Heavy +1**, **Light −1**, **Medium** unchanged.

### Gear categories

| Category | Covers |
|---|---|
| General & lifestyle | Comms and credentials, sensors and optics, break-in tools, survival kit, medical consumables, ammunition and thrown, lifestyle goods and services |
| Armor | Light, medium, heavy, sealed and hardened, shields and riot gear |
| Weapons | Light firearms, longarms, heavy weapons, melee and blades, thrown and grenades, bows and exotic, weapon mods |
| Wired gear | Cyberdecks, programs and utilities, intrusion payloads, RCCs, cyberjacks and interfaces, Wired support gear (see `21-the-wire.md`) |
| Vehicles & drones | Ground, air, water, space, drones, vehicle and drone mods (see `23-machines.md`) |
| Magical foci | Elementalist, Street Priest, and Technomancer foci; shared ritual tools; material components; reagent packages |
