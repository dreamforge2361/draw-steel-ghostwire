# GHOSTWIRE — Kits Master Compendium

*Compiled for review, 2026-09-16. Canon source: "The Kits chapter — loadout doctrines & fighting styles" in `master_rules_baseline.md` (added 2026-07-15, unchanged through the 2026-07-29 baseline). On any conflict with the quick-reference chapter page, this baseline text wins. Bonus-line numbers are Draw Steel-benchmark illustrative values re-expressed on our Outcome Tiers; final tuning is deferred to the numeric/gear pass.*

## The design problem it solves

Draw Steel's Kit system (its Chapter 6 martial-loadout layer) assumes an abstract Wealth score and hands the hero a fixed weapon-and-armor package as flavor, because Draw Steel gear is light. GHOSTWIRE deliberately built the opposite — tracked nuyen, tiered gear gated by Availability, and mod-slot crafting (the Economy and Chrome chapters). A naive port would give away free gear and silently override the whole Economy.

The fix **splits what Draw Steel fuses**: a Kit governs trained **technique** (mechanical bonuses + a signature ability); the **Economy** governs the physical **object** that technique is applied to. A hero must still buy and own a qualifying weapon/armor to get a Kit's bonuses — the Economy becomes a hard prerequisite for the Kit, not a bystander.

## What a Kit is (and what it is not)

A **Kit** is a **loadout doctrine** — a package of trained fighting technique that turns a category of gear into a personal combat style. It represents *how you were trained to fight*, not *what you happen to be carrying*.

- A Kit grants a bundle of combat bonuses (Stamina, damage, speed, stability, distance, disengage) and one **signature ability** — a repeatable weapon attack keyed to the Kit.
- A Kit is **flexible and never locked**: a hero may swap Kits during a respite (a respite activity), exactly as Draw Steel allows. Training can be re-focused between runs; it is not a permanent build choice.
- **A Kit is training, so it lives on the class/BP side of the firewall — it is never bought with nuyen.** This is the key distinction from gear. A Kit is character capability (like a class feature or skill); the item the Kit uses is Economy gear. Nuyen never buys the doctrine; it buys the tool the doctrine needs.
- **Not every hero leans on a Kit equally.** Kits are the martial identity layer — the **Operator, Scout, Commander**, and any gun/blade/fist-forward build live here. A pure caster (Elementalist, Street-Priest) or a deck-bound Hacker may take a light Kit or none, fighting instead through the Veil or the Wired resource systems.

## The bridge to the Economy — the ownership rule

This is the rule that keeps Kits and the Economy/gadgets system intact and interlocked. Draw Steel's "if you don't wield your kit's gear you lose its bonuses" clause becomes the load-bearing bridge here:

1. **A Kit names a category, not a specific item.** A Kit calls for, e.g., "a light firearm + light armor," "a heavy weapon + heavy armor," "a precision rifle, no armor," or "unarmed / cyber-limb strikes." Categories are broad; the specifics are yours.
2. **You must OWN a qualifying item — bought through the Economy — to get the Kit's bonuses.** The gun, blade, bow-equivalent, or armor that satisfies the Kit's category is nuyen-purchased, tier- and Availability-gated gear like everything else. No qualifying weapon in hand means no weapon bonuses from the Kit (you're using an improvised weapon, below). No qualifying armor worn means no Stamina/stability bonus from the Kit. **The Kit is inert without the gear the Economy supplies.**
   - *Armor reconciliation (§Armor-3, Gear Catalog Category 2):* when a Kitted class wears qualifying armor, the Kit's Stamina bonus **is** that armor's Stamina — you do not also add the §Armor-1 armor value on top; the two are the same contribution and never double-count. A class with no Kit gains the armor's Stamina directly from §Armor-1. Encumbrance, tags, typed Immunity, and gear mods apply in both cases.
3. **Kit doctrine and gear mods stack, because they touch different numbers.** The Kit adds doctrine bonuses (damage per Outcome Tier, distance, speed, stability, the signature ability). Nuyen-bought mods (smartlink, silencer, recoil comp, armor weave, drone hardpoint) add situational traits and effects via the mod-slot crafting subsystem. They never overwrite each other — a smartlinked, silenced pistol in the hands of a **Ghost**-Kit runner gets both the Kit's ranged doctrine *and* the mods' effects. A gear-focused hero therefore benefits twice (Kit + deep mods).
4. **Gear tier still matters underneath the Kit.** The Kit's bonuses are constant, but the item satisfying it climbs the reversed gear ladder (Tier 5 street-grade → Tier 1 milspec/prototype). A Longshot Kit is deadlier with a Tier 1 rifle than a Tier 5 zip-gun even though the Kit line is unchanged — the Economy remains the axis of material progression, the Kit the axis of trained skill.

**Firewall check:** a Kit costs no nuyen (it's training) and the gear costs no BP (it's an object). Neither converts into the other. The two economies stay separate and both stay meaningful.

## What a Kit grants

Each Kit provides some subset of the following, drawn from the Draw Steel benchmark and re-expressed for this system:

- **Stamina bonus** — added to Stamina maximum; scales by tier/echelon. Requires the Kit's armor to be worn.
- **Speed bonus** — added to movement.
- **Stability bonus** — added to stability (resisting forced movement). Requires the Kit's armor.
- **Melee / Ranged damage bonus** — added to the rolled damage of the matching weapon attacks, expressed as **+X / +Y / +Z across the three Outcome Tiers**. Requires the qualifying weapon.
- **Melee / Ranged distance bonus** — extends the reach/range of the matching weapon attacks (does not enlarge area-of-effect abilities).
- **Disengage bonus** — extra squares of shift when you Disengage.
- **Signature ability** — one repeatable weapon Strike unique to the Kit, whose printed distance and damage already include the Kit's bonuses.

**Tier note (binding):** bonus lines are written on **our** Outcome Tiers — **Tier 1 (17+) = the largest bonus slot, Tier 3 (≤11) = the smallest.** A "finesse" Kit reads roughly +2/+2/+2 (flat, reliable); a "heavy hitter" Kit reads roughly +4/+0/+0 on our ladder (big payoff only on a Tier 1 crit-tier hit). Draw Steel prints these reversed (its "tier 1" is the worst); GHOSTWIRE inverts to match our convention so the biggest number always sits on the best result.

## Improvised weapons (the no-gear fallback)

Straight from Draw Steel, reskinned: anything that isn't your Kit's weapon — a pipe, a bottle, a chair, a dropped pistol you grabbed, or your bare fists if your Kit isn't an unarmed Kit — is an **improvised weapon**. You may use improvised weapons with **class** weapon abilities, but not with your **Kit's** weapon abilities, and you add no Kit bonuses to an improvised attack. This is the mechanical teeth of the ownership rule: disarmed or under-equipped, a Kit hero still fights, but without their doctrine bonuses — a real, recoverable setback rather than helplessness.

## Kits are flexible

One Kit at a time; swap it during a respite (a respite activity) — never a locked build choice.

---

## The Kit list (cyber-fantasy reskin of the 21 Draw Steel archetypes)

Weapon/armor "category" is what the Economy item must satisfy; bonus lines are illustrative benchmarks pending the numeric pass, already flipped onto the Tier-1-best ladder. Fantasy melee Kits are fully supported — this is a cyber-fantasy world where a chromed samurai, a monowhip duelist, and a mage-blade coexist with gunfighters.

| Kit (our name) | Draw Steel source | Gear category (Economy-supplied) | Doctrine sketch |
|---|---|---|---|
| **Longshot** | Sniper | Precision rifle; no armor | Extreme range, huge Tier-1 payoff (+4/+0/+0), reward for holding still |
| **Saturation** | Rapid-Fire | SMG / carbine; light armor | Volume fire, two-target signature, steady ranged bonus |
| **Ghost** | Cloak and Dagger | One or two silenced light weapons; light armor | Mixed melee/ranged, shift-on-hit, infiltration doctrine |
| **Gunslinger** | Swashbuckler | Medium sidearm/blade; light armor | High speed, push-and-shift finesse |
| **Streetsweeper** | Ranger | Shotgun/carbine + medium weapon; medium armor | Flexible mid-range hybrid, slow-on-hit signature |
| **Juggernaut** | Mountain | Heavy weapon; heavy armor | Tank doctrine, massive Tier-1 hit, punishes attackers |
| **Breacher** | Sword and Board | Medium weapon + ballistic shield; medium armor | Push/prone control, high Stamina, front-line |
| **Warframe** | Shining Armor | Medium weapon + shield; heavy armor | Highest Stamina, taunt/hold-the-line signature |
| **Bulldozer** | Panther | Heavy weapon; no armor | Mobile heavy hitter, charge-for-damage |
| **Brawler** | Pugilist | Unarmed / cyber-limb strikes; no armor | Durable striker, slide-and-follow |
| **Mantis** | Martial Artist | Unarmed / cyber-limb strikes; no armor | Fast martial artist, swap-places signature |
| **Chromeblade** | Dual Wielder | A light + a medium melee weapon; medium armor | Twin-blade doctrine, act-between-strikes signature |
| **Reach** | Guisarmier | Polearm / long cyber-weapon; medium armor | Extended melee reach, two-target sweep |
| **Monowhip** | Whirlwind | Whip / monofilament / chain; no armor | Very fast, reach + vertical-pull signature |
| **Snarehunter** | Retiarius | Net/ensnaring gear + polearm; light armor | Control specialist, restrain-on-hit |
| **Staff Adept** | Stick and Robe | Staff / polearm; light armor | Mobile reach, slide control |
| **Duelist** | Battlemind | Medium melee weapon; light armor | Balanced melee, forced-movement amplifier |
| **Raider** | Raider | Light weapon + shield; light armor | Melee/thrown hybrid, impose-bane signature |
| **Hexshot** | Arcane Archer | Bow/crossbow/dartgun; no armor | Ranged + rider magic/tech effect (splash) |
| **Spellblade** | Spellsword | Medium melee + shield; light armor | Melee weapon carrying an elemental/tech strike |
| **Sanctified** | Warrior Priest | Light weapon; heavy armor | Armored faith-warrior, weaken-on-hit (Veil-flavored) |

*Magic/tech-flavored Kits — Hexshot, Spellblade, Sanctified — are the natural attachment points for the Veil and for cyber-augmented casters; their "magic" damage rider can be reskinned as elemental essence, holy/infernal power, or a weapon-mounted tech effect per the wielder's class.*

### Kits grouped by role

| Role | Kits |
|---|---|
| Ranged specialists | Longshot, Saturation, Ghost, Hexshot |
| Gun/blade finesse | Gunslinger, Streetsweeper, Raider |
| Heavy / tank | Juggernaut, Warframe, Breacher, Bulldozer |
| Melee / martial | Brawler, Mantis, Chromeblade, Reach, Monowhip, Snarehunter, Staff Adept, Duelist |
| Magic/tech-flavored | Spellblade, Sanctified (plus Hexshot above) |

---

## How Kits connect to the rest of the game

- **Economy (hard dependency):** the Kit's weapon/armor category must be satisfied by nuyen-bought, tier/Availability-gated gear; mods stack on top via mod-slot crafting. The Economy is the prerequisite and the progression axis; the Kit is the doctrine layer. This is the deliberate reconciliation that keeps Kits from replacing or bypassing the Economy and gadget system — Kits sit on top of it and require it.
- **Chrome:** unarmed/cyber-limb Kits (**Brawler, Mantis**) and implanted weapons interlock with the Chrome chapter — a cyber-limb or implant weapon can be the "gear" that satisfies an unarmed or light-weapon Kit, and Chrome mods tune it. Body Integrity, not nuyen, is the cost of the implant; the Kit is still free training.
- **Combat:** Kit bonuses and the signature ability plug straight into the Combat chapter's Power Roll, Outcome Tiers, action economy, forced movement, and conditions — a Kit is just a trained set of options within that engine.
- **Downtime:** swapping a Kit is a respite activity; acquiring/upgrading the gear a Kit needs is Economy/Downtime work (purchase, acquisition project, or mod crafting).
- **Classes (attachment point):** class writeups define which classes get a Kit, how many signature options, and any class-specific Kit perks (extra slots, bonus Kit abilities, doctrine tweaks). Martial classes — **Operator, Scout, Commander** — lean hard on Kits; casters/specialists lean on their resource systems (the Veil, the Wired). Numbers for every bonus line are set in the numeric pass.

## Still to come — numeric pass

Deferred to the numeric/gear pass: every Kit's exact bonus values, signature-ability numbers, and the gear stat blocks the Kits sit on. The structure and full 21-Kit roster above are settled canon; only the numbers remain open.

## Related chapters

- Economy (nuyen, tiered gear, Availability, mod-slot crafting)
- Chrome (cyber-implants — Body Integrity cost, unarmed/light-weapon Kit interlock)
- Combat (Power Roll, Outcome Tiers, action economy — where Kit bonuses plug in)
- Downtime (Kit swaps; gear acquisition and mod crafting)
- Followers, Strongholds & Contacts (crew support that can feed gear/mod projects)
