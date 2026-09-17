# The Hacker

**RAW status:** draft  
**Sources:** `docs/rulebook/08-hacker.md`

The Wired System (nodes, connection states, System Stat Card, Trace Alert) and the universal Matrix Verbs are in `21-the-wire.md`. This chapter keeps the Hacker's own rules: Bandwidth, cyberdecks, Programs, progression, and subclasses.

---

## Class Chassis

| Stat | Value |
|---|---|
| **Core Characteristics** | Logic, Instinct |
| **Heroic Resource** | Bandwidth |
| **Epic Resource / Capstone** | Ghost in the Machine (10th level) |
| **Starting Stamina** | 19 |
| **Stamina per Level** | +7 |
| **Recoveries** | 9 |
| **Kit Slot** | Cyberdeck (your Field Arsenal-equivalent choice) |

## Bandwidth -- Your Heroic Resource

Bandwidth is the Hacker's fuel. It works like this:

- **Income:** +1 Bandwidth per turn (base), plus your equipped cyberdeck's Bandwidth Bonus at your current Echelon, plus +1 bonus Bandwidth whenever you roll a natural 19 or 20 on any Power Roll.
- **Cap:** 6 x Echelon (rising to 8 x Echelon once you take Bandwidth Overclock at 7th level).
- **Reset:** Drops to 0 at the end of each encounter -- *unless* you've taken Infinite Loop (10th level), which lets you carry Echelon-worth of Bandwidth between encounters and softens overflow loss.

## Cyberdecks (Your Kit)

At 1st level you're equipped with a cyberdeck of your choice -- this is your Kit slot. Three Echelon 1 ("Street Grade") decks exist today, one leaning toward each subclass, though any Hacker can carry any deck:

| Cyberdeck | Deck Role | Price | Bandwidth Bonus/Echelon | Alert Discount/Echelon | Biofeedback Resistance/Echelon | Intrusion Roll Mod | Integrity Damage Bonus (low / middle / high) | Reach | Ghost Distance | Signature Ability |
|---|---|---|---|---|---|---|---|---|---|---|
| **Nyx Cartel "Switchblade"** | Disruptor | ¥800 | +2 | +0 | +1 | +1 | +1/+2/+3 | 1 | +0 | Flatline Jab |
| **Ferrum "Padlock-6"** | Controller | ¥900 | +1 | +1 | +2 | +0 | +0/+1/+2 | 2 | +1 | Seize |
| **Meridian "Lookout"** | Support | ¥750 | +1 | +2 | +1 | +0 | +0/+0/+1 | 3 | +1 | Overwatch Ping |

**Intrusion Roll Modifier** is your cyberdeck's flat bonus applied to Programs' Power Rolls (rolled with Logic). **Integrity Damage Bonus** is the flat damage a successful Program hit deals to Track 2 targets, gated by Power Roll result band. Both numbers grow with **Improved Cyberdeck** (4th level) and again with **Root Access** (9th level) -- these bonuses come from the class, not the deck, so they persist even if you swap decks.

**Cyberdeck Signature Abilities** (each deck's built-in Power Roll, Logic-keyed, `2 + @chr / 4 + @chr / 6 + @chr` style result-band damage on the Switchblade, `0 / 1+@chr / 2+@chr` on the Padlock-6, and a no-damage ally-edge effect on the Lookout):

- **Flatline Jab** (Switchblade) -- a quick, single-target Intrusion strike against one node or device; guarantees a small Alert bump regardless of tier.
- **Seize** (Padlock-6) -- attempt to take temporary control of an already-compromised node and hold it steady; favors holding what you've got over grabbing more.
- **Overwatch Ping** (Lookout) -- grants one ally within Reach an edge on their next roll by feeding them real-time Wired data; deals no direct damage of its own.

## Programs -- Your Signature Abilities

Programs are the Hacker's spell-equivalent -- learned automatically or chosen by cost band as you level. Every Program is a **signature** category ability keyed to Logic when it rolls at all.

| Program | Cost | Type | Target | Rolls? | Gained At |
|---|---|---|---|---|---|
| **Seize Control** | 2 Bandwidth | Maneuver | 1 Track 1 object/item within Reach (includes environmental nodes AND a person's Wired-connected gear) | Yes -- Logic | 1st (automatic) |
| **Deep Scan** | Free (0 Bandwidth) | Maneuver | 1 person within Reach | Yes -- Logic | 1st (automatic) |
| **Ghost Signal** | 3 Bandwidth | Maneuver | 1 ally or self within Reach | No -- automatic | 1st (choice) |
| **Kill Switch** | 5 Bandwidth | Maneuver | 1 Track 2 target within Reach you can see | Yes -- Logic | 2nd (choice) |
| **Failsafe Cascade** | 7 Bandwidth | Maneuver | Self or 1 ally within Reach who is Jacked In/Overlaid | No -- automatic | 3rd (choice) |
| **Network Purge** | 9 Bandwidth | Maneuver | Up to 2 Track 2 targets within Reach | Yes -- Logic, one roll for both | 5th (choice) |
| **Backdoor Override** | 11 Bandwidth | Maneuver | 1 Track 1 object OR 1 Track 2 target within Reach | No -- automatic | 8th (choice) |

**Program details:**

- **Seize Control** -- A single activation both breaches the target's security AND lets you use it that same turn. low (≤11): brief one-shot control. middle (12–16): solid, lasting control. high (17+): as middle, plus your choice of refunding the Maneuver or leaving no trace. This is your primary out-of-combat lever -- doors, lights, and power matter even in scenes with zero ICE or hostile deckers present.
- **Deep Scan** -- Free doesn't mean automatic; it's still a genuine Power Roll. low (≤11): surface-level info only. middle (12–16): specific make/model of one or two items. high (17+): full readout of everything Wired-connected on the target, plus a marked exploitable weakness (see Exploit the Breach, 4th level). Deep Scan is Scan's person-targeted big sibling and sets up a follow-up Seize Control.
- **Ghost Signal** -- No roll. The target becomes untraceable/unlisted on the Wired for the rest of the encounter until they take a hostile Wired action themselves. Outside combat, scrubs a commlink signature from local logs/cameras for a scene.
- **Kill Switch** -- low (≤11): no damage, Alert increases. middle (12–16): Integrity damage equal to your deck's middle-band bonus, target loses its Maneuver next turn. high (17+): as middle, but the target loses its Main Action instead.
- **Failsafe Cascade** -- No roll. Target regains Stamina equal to Biofeedback Resistance x 2 and is shielded from the next instance of Integrity-to-Stamina biofeedback bleed-through this encounter.
- **Network Purge** -- low (≤11): Alert only. middle (12–16): both targets take Integrity damage (middle-band bonus). high (17+): as middle, plus a bane on both targets' next Power Roll.
- **Backdoor Override** -- No roll, by design. On a Track 1 object: automatic high (17+) breach, no roll. On a Track 2 target: guaranteed Integrity damage (middle-band bonus value) with **zero Alert Track increase**. Outside combat, this is an automatic clean breach of any lock, vault, or system -- no roll, no Alert cost.

## Level 1-10 Progression Table

| Level | Class Features | Perks/Skills | Subclass Features |
|---|---|---|---|
| **1** | Hacking Doctrine (choose subclass) - Bandwidth (heroic resource) - Cyberdeck (Kit choice) - Seize Control (automatic Program) - Deep Scan (automatic Program) - Choose a 3-Cost Program (Ghost Signal) | -- | Subclass passive + subclass triggered action (see subclass tables below) |
| **2** | Choose a 5-Cost Program (Kill Switch) | Perk (choice) | Subclass 2nd-level feature |
| **3** | Ghost Step (feature + ability) - Choose a 7-Cost Program (Failsafe Cascade) | -- | Subclass 3rd-level feature |
| **4** | Exploit the Breach - Improved Cyberdeck (+1 Intrusion Roll Mod / +1 Integrity Damage Bonus at every result band) | Characteristic Increase - Perk (choice) - Skill | -- |
| **5** | Choose a 9-Cost Program (Network Purge) | -- | Subclass 5th-level feature |
| **6** | Dual Boot (feature + Dual Boot Swap ability) | Perk (choice) | Subclass 6th-level feature |
| **7** | Bandwidth Overclock (+1 income, cap 6->8 x Echelon) - Ghost Protocol (feature + Pre-Encounter Sweep ability) | Characteristic Increase - Skill | Subclass 7th-level feature |
| **8** | Choose an 11-Cost Program (Backdoor Override) | Perk (choice) | Subclass 8th-level feature |
| **9** | Root Access (Dual Boot 2/encounter; Improved Cyberdeck bonus becomes +2/+2, replacing the 4th-level values) | -- | Subclass 9th-level feature |
| **10** | Ghost in the Machine (epic capstone, feature + ability) - Infinite Loop (Bandwidth carries between encounters) - Borrowed Access (feature + ability) | Characteristic Increase - Perk (choice) - Skill | -- |

## Core Class Features (Non-Subclass)

- **Ghost Step** (3rd) -- Free Triggered Action, no Bandwidth cost. Trigger: a Track 2 target (ICE, hostile AI, rival decker) targets you directly, OR the Alert Track increases from your own action. Effect: choose one -- immediately use a Maneuver-cost Matrix Verb for free, or cancel the Alert increase entirely (once per encounter).
- **Exploit the Breach** (4th) -- Passive. Whenever your Deep Scan lands a high (17+), the target has a marked exploitable weakness until the end of the encounter (or until re-scanned). The next Track 1/Track 2 Wired-based hit against that target from you or an ally gains an edge, and a Track 2 hit also deals +2 Integrity damage. Only one target can be marked at a time.
- **Improved Cyberdeck** (4th) -- Passive. +1 Intrusion Roll Modifier and +1 Integrity Damage Bonus at every result band, on top of whatever deck you're currently running. Granted by the class, not the deck.
- **Dual Boot** (6th) -- Passive enabling a once-per-encounter Free Triggered Action: apply a second owned deck's Roll Modifier/Damage Bonus to a single Program/Verb/signature roll instead of your equipped deck's, whichever is better. Bandwidth Bonus, Alert Discount, Biofeedback Resistance, Reach, and Ghost Distance are unaffected -- only the roll/damage numbers swap.
- **Bandwidth Overclock** (7th) -- Passive. Base income +1->+2 per turn; cap 6->8 x Echelon.
- **Ghost Protocol** (7th) -- Passive with a pre-encounter Free Triggered use. If you had at least one uninterrupted round of Overlay/Jacked-In access before initiative (Director’s call), you and your allies get an edge on your first Power Roll of the encounter, and you may use one free Matrix Verb or Deep Scan before the first turn begins.
- **Root Access** (9th) -- Passive. Dual Boot becomes twice per encounter; Improved Cyberdeck's bonus rises to +2/+2 at every tier (replacing, not stacking with, the 4th-level +1/+1).
- **Ghost in the Machine** (10th, epic capstone) -- Free Triggered Action, once per encounter. Treat any Power Roll you just made as a natural 19 if the actual result was lower -- can turn a low/middle into a guaranteed high (17+), and also triggers the natural-19/20 bonus Bandwidth.
- **Infinite Loop** (10th) -- Passive. Bandwidth no longer fully resets between encounters -- retain Echelon's worth (4 at 10th level) instead of dropping to 0. The first 2 points of cap overflow in a round are retained for one round instead of lost outright.
- **Borrowed Access** (10th) -- Main Action, 3 Bandwidth. Choose an ally within Reach who is Jacked In/Overlaid; they immediately use one Program you know costing 5 Bandwidth or less, using your deck's stats, without spending their own action -- but it costs your Main Action and your Bandwidth.

## Subclass: Disruptor -- *Striker, Damage Amplification*

The Hacker's offensive specialist: hard, fast, single-target Intrusion strikes that punish Track 2 targets and amplify the whole team's damage against ICE, hostile deckers, and hostile AIs.

| Level | Feature | Effect |
|---|---|---|
| 1 | Overclocked Damage (passive) | +1 flat Integrity damage on your own successful Track 2 hits |
| 1 | Cascade Strike (Triggered Action, 1 Bandwidth) | Trigger: any Track 2 target takes Integrity damage from anyone. Effect: add +2 flat Integrity damage to that hit |
| 2 | Overclocked Strikes (passive) | Your own-hit bonus rises from +1 to +2 (the ally-hit trigger stays +2) |
| 3 | Cascade Failure (Triggered Action, 2 Bandwidth) | Trigger: you drop a Track 2 target to 0 Integrity. Effect: another Track 2 target within Reach immediately takes Integrity damage equal to your deck's low-band Damage Bonus |
| 5 | No Second Chances (passive) | Your 1st-level triggered action can also apply Exploit the Breach's marked-weakness edge to the same hit, even if you didn't scan the target |
| 6 | Overwhelm ICE (Main Action, 4 Bandwidth) | Power Roll, Logic. low (≤11): half low-band Damage Bonus (rounded down), Alert up. middle (12–16): full middle-band bonus + your 1st-level passive. high (17+): full high-band bonus + passive + bane on target's next roll |
| 7 | Hair Trigger (passive) | Your 1st-level triggered action can be used twice per round (still 1 Bandwidth each) |
| 8 | Total Breach (passive) | Own-hit bonus rises to +3; dropping a Track 2 target to 0 Integrity refunds 2 Bandwidth |
| 9 | Zero Day (Main Action, 6 Bandwidth) | Power Roll with an edge, Logic. Always deals high-band Damage Bonus damage regardless of roll result (a low roll still raises Alert) + passive bonus. On an actual high (17+) roll, target also can't act on its next turn |

## Subclass: Controller -- *Lockdown, Node Control / Holding* ("The Sysop")

A specialist in seizing and holding fixed systems, turning nodes into weapons and tripwires against anyone who tries to take them back.

| Level | Feature | Effect |
|---|---|---|
| 1 | Extra Node (passive) | Hold 1 extra node beyond your deck's normal limit |
| 1 | Lockout (Triggered Action, 1 Bandwidth) | Trigger: an enemy attempts to retake/break your hold on a seized node. Effect: apply a bane to that attempt |
| 2 | Redundant Systems (passive, enabling a once-per-encounter Free Triggered Action) | If you lose control of a held node, spend 1 Bandwidth to attempt re-seizing it with a Power Roll (Logic), no Maneuver/Main Action cost, once per encounter |
| 3 | Chokepoint (Main Action, 3 Bandwidth) | No roll. Until your next turn, any Track 2 target that breaches/retakes/routes through a node you hold takes a bane and alerts you immediately, even if you're not Jacked In |
| 5 | Wider Net (passive) | Extra-node count rises from 1 to 2 |
| 6 | Puppet Strings (Main Action, 4 Bandwidth) | No roll. Use a held interactive node's normal function (turret, camera, drone, smartlink) once, without counting against its own action economy |
| 7 | Iron Grip (passive) | 1st-level triggered action's single bane becomes a double-bane |
| 8 | Total Awareness (passive) | You always know when a held node is targeted for retake/breach/disruption, even off-map or out of Reach, and may spend a Maneuver to act on it as though it were in Reach |
| 9 | Master Sysop (Main Action, 6 Bandwidth) | Power Roll (Logic), one roll vs up to 3 unheld nodes within Reach. low (≤11): seize 1 (your choice), Alert up. middle (12–16): seize 2. high (17+): seize all 3, none count against your held-node limit for the rest of the encounter |

## Subclass: Support -- *Tank/Anchor, Ally Protection* ("Guardian Angel in the Net")

The Hacker whose value extends to the whole team, feeding allies edges and softening the blows of Wired-side combat before they reach flesh.

| Level | Feature | Effect |
|---|---|---|
| 1 | Wired Guard (passive) | +1 flat defense bonus to allies within Reach who are Jacked In/Overlaid, vs Track 2 attacks |
| 1 | Dampen (Triggered Action, 1 Bandwidth) | Trigger: a nearby Jacked-In ally takes a Track 2 hit. Effect: -2 flat damage reduction on that hit |
| 2 | Watchful Relay (passive) | Defense bonus rises from +1 to +2 |
| 3 | Signal Boost (Maneuver, 2 Bandwidth) | No roll. One ally within Reach gains an edge on their next Power Roll before your next turn (Wired or physical) |
| 5 | Standing Watch (passive) | Dampen can now trigger off a Track 2 hit against ANY ally in Reach (not just Jacked In/Overlaid); -2 reduction unchanged |
| 6 | Emergency Patch (Main Action, 4 Bandwidth) | No roll. Target ally (or self) regains Stamina = 2 + Echelon; if Jacked In, also cancels the next biofeedback bleed-through this encounter |
| 7 | Anchor Point (passive) | Defense bonus rises to +3; allies in Reach who are Jacked In also gain your deck's Biofeedback Resistance as bonus resistance of their own |
| 8 | Full Coverage (passive) | Dampen and Standing Watch's trigger cost 0 Bandwidth the first time each triggers per round (additional uses still cost 1) |
| 9 | Guardian Angel in the Net (Main Action, 6 Bandwidth) | No roll. All allies in Reach who are Jacked In/Overlaid get double your defense bonus (currently +6) vs Track 2 attacks until your next turn, and biofeedback bleed-through is reduced by an additional flat 3 |

## Chrome a Hacker Runs

Cyberware relevant to the Wired -- from the Matrix & Signals implant category (chrome grades Salvage / Standard / Soft; higher-end implants are gated by Availability — `09-chrome-body-integrity.md`):

- **Sub-Dermal Radio / Ghost Antenna** -- Wired signal-boosting implants.
- **Encephalon / Cerebral Datastore** -- grants +1 Bandwidth/Uptime cap at E3, +2 Logic on Matrix rolls at E4.
- **Simsense Booster / Hot-Sim Adapter** -- sensory/interface boosters for deeper Wired immersion.
- **Signal Ghost** -- signature-masking implant.

Body Integrity (chrome capacity) starts at **20**, as for every living non-Cyborg hero — see `09-chrome-body-integrity.md` for install rules and grades.

---
