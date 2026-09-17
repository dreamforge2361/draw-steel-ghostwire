# GHOSTWIRE_HACKER_DEVELOPMENT_MASTER

*This is the SINGLE SOURCE OF TRUTH for the Hacker class as of 2026-07-26. All future Hacker-class design, rules, and Foundry-implementation work -- across every session -- must reference and update THIS file, and only this file. Do not create new Hacker-class markdown files; edit this one in place, the same way `GHOSTWIRE_BUILD_LOG_CANONICAL.md` is treated for build-log state. Any older Hacker documents (the 2026-07-15 `hacker.md`/`hacker-1.md`/`hacker-2.md` concept drafts, and any prior Hacker markdown not named `Ghostwire_Hacker_Development_Master.md`) are SUPERSEDED and should not be used as ground truth going forward.*

*Last updated: 2026-07-28. Ground truth for this document is the live GHOSTWIRE Foundry build (compendiums `ghostwire.ghostwire-classes`, `ghostwire.ghostwire-kits`, `ghostwire.ghostwire-abilities`), not the earlier 2026-07-15 concept draft. Attribute names follow the locked GHOSTWIRE convention: display label first, real Draw Steel attribute in parentheses -- e.g. Logic (Reason).

---

## PART 1 -- PLAYER-FACING: THE HACKER

### Who You Are

You are a **Hacker** -- a ghost in the machine who fights wars in the Wired before the first physical shot is ever fired. Your cyberdeck is your weapon, Bandwidth is your fuel, and Programs are your spells. Whether you specialize as a **Disruptor**, **Controller**, or **Support**, you turn digital infrastructure into a battlefield only you can truly see.

Outside combat, you are the party's key into any door, camera, lock, drone, or vault that has a wire running to it. Inside combat, you are a second front the enemy has to defend -- one they usually can't even see coming.

### Class Chassis

| Stat | Value |
|---|---|
| **Core Characteristics** | Logic (Reason), Instinct (Intuition) |
| **Heroic Resource** | Bandwidth |
| **Epic Resource / Capstone** | Ghost in the Machine (10th level) |
| **Starting Stamina** | 19 |
| **Stamina per Level** | +7 |
| **Recoveries** | 9 |
| **Kit Slot** | Cyberdeck (your Field Arsenal-equivalent choice) |

### The Wired System -- Connection States, Nodes, and Trace Alert

*Before Bandwidth, Programs, or Matrix Verbs make sense, you need to understand the battlespace they operate in. This section defines the Wired System itself: what a node is, the two connection states referenced constantly throughout this document ("Jacked In or Overlaid"), the Track 1/Track 2 target distinction, and the Trace Alert mechanic that every Program and Matrix Verb references but never explains on its own card.*

*Source note: this section reconciles two layers of ground truth per Pre-Flight Doctrine -- the structural/numeric Wired chapter in `master_rules_baseline_2XP-1BP_2026-07-22.md` (Appendix D, "WIRED NUMBERS") and the live shipped Hacker item text in the Foundry build. The baseline formally defines three connection modes (wireless, wired-direct, jacked-in) and a 12-step Alert track; the shipped Hacker kit already uses "Overlay" and "Jacked In" as its two named connection states via the **Toggle Connection State** Matrix Verb. Where the shipped build's plain-language "Overlay" doesn't have a numbered baseline entry of its own, it is reconciled below as GHOSTWIRE's shorthand for the baseline's lighter-weight connection modes (wireless/wired-direct) as opposed to full immersion (jacked-in) -- flagged here as a reconciliation, not an invention, since the underlying biofeedback math and Tier-3 counter-trace consequence are both drawn directly from baseline Appendix D4 and D2.*

#### What a Node Is

A **node** is any addressable point in the Wired -- a maglock, a security camera, a corp host, a smartgun's wireless interface, a drone, a vehicle's control bus. Every Program, Matrix Verb, and Hacker ability ultimately targets a node (or a target *through* a node). Nodes come in two flavors for targeting purposes:

- **Track 1** -- objects, systems, and infrastructure: doors, lights, cameras, locks, power grids, vaults, and Wired-connected gear worn or carried by a person (a smartlink, a cyberware wireless interface). Track 1 targets resolve as a single Power Roll with no ongoing health pool -- you breach and act on it in the same activation.
- **Track 2** -- hostile, contested, or "alive" targets: ICE, hostile AI Personas, rival deckers, and any node actively defended by an intelligence fighting back. Track 2 targets have their own **Integrity** pool (see below) and can hit back.

#### Connection States: Overlay and Jacked In

You reach a node by first using the **Connect** Matrix Verb (see Matrix Verbs, below) to establish a Persona in the Wired at your current location. Once connected, you exist in one of two connection states, and you can freely switch between them with the **Toggle Connection State** Matrix Verb (no roll, no contest -- your call):

| State | What It Means | Physical Awareness | Power Roll Tradeoff | Biofeedback Exposure |
|---|---|---|---|---|
| **Overlay** | Partial immersion -- your Persona rides alongside your physical senses. You see the Wired layered over the real world (an AR-style heads-up view of nearby nodes, marks, and traffic). | Full -- you can still see, move, speak, and react physically while Overlaid. | **Bane on real-world (physical) Power Rolls** -- the AR overlay is a genuine distraction competing for your attention with whatever's happening in front of you. No modifier either way on Wired Power Rolls. | Reduced. Biofeedback damage while Overlaid is treated as **wireless/wired-direct exposure**: half the node's listed Biofeedback value (round down, minimum 1), per baseline Appendix D4's connection-mode modifiers. |
| **Jacked In** | Full immersion -- your Persona *is* your primary presence, and your body goes inert and exposed in the physical world (the reason your crew guards your body while you're under). | None. You cannot perceive, move, or act in the physical world while Jacked In, and you're an easy physical target. | **Edge on all Wired Power Rolls** -- full immersion sharpens every Matrix Verb, Program, and Wired-based signature ability. You cannot make real-world Power Rolls at all while Jacked In (no physical awareness means no physical action to roll for), and you cannot perceive or interact with the physical world in any way. | Full. Biofeedback damage while Jacked In is multiplied **x1.5 (round up)** against the node's listed Biofeedback value, per baseline Appendix D4 -- the tradeoff for full-immersion speed and power. |

Some Programs, features, and abilities (Ghost Protocol, Chokepoint, Borrowed Access, Failsafe Cascade, Wired Guard, and others) explicitly require you or an ally to be "Jacked In or Overlaid" -- meaning either connection state satisfies the requirement, as opposed to being fully disconnected. A handful of higher-tier features (Anchor Point, Emergency Patch's biofeedback-cancel clause) key specifically off **Jacked In** alone, since they're addressing the higher-risk state directly.

**Ruling (Michael, 2026-07-28):** Overlay and Jacked In are a genuine mechanical tradeoff, not just a fiction toggle. **Overlaid**, you keep both worlds live but pay a **bane on real-world Power Rolls** for the split attention -- you're fighting (or talking, or driving) with half your head somewhere else. **Jacked In**, you gain an **edge on all Wired Power Rolls** (every Matrix Verb, Program, and Wired-based signature ability gets sharper), but you lose the real world entirely -- no physical perception, no physical action, nothing to roll for on that side at all. This is why the crew treats a Jacked-In Hacker's body as cargo to protect: it isn't just fictionally vulnerable, it's mechanically undefended and unable to act. **Toggle Connection State** (free, no roll) is the tool for choosing which tradeoff you want turn to turn.

You leave either connection state with the **Jack Out** Matrix Verb -- a clean disconnect that also serves as your emergency eject if a Program or Trace Alert spike goes bad.

#### Wired-System Stats: Integrity (Not Body Integrity)

Every Track 2 target -- and the "system" side of any Wired encounter -- tracks its own **Integrity**: a Stamina-equivalent health pool that Programs and abilities damage directly (via your cyberdeck's Integrity Damage Bonus) rather than dealing physical damage. Reducing a Track 2 target to 0 Integrity takes it down, exactly as reducing a creature to 0 Stamina does.

**Do not confuse this with Body Integrity** (the Chrome chapter's cyberware capacity resource, starting at **20** for every living non-Cyborg hero). They share a name but are entirely different systems: Body Integrity is a permanent character-sheet capacity for how much chrome you can carry; Wired-system Integrity is an encounter-scoped health pool belonging to nodes, ICE, hostile Personas, and rival deckers.

| Wired-System Integrity by Node Tier | Integrity | Source |
|---|---|---|
| Tier 5 (street-grade) | 12 | Baseline Appendix D5 |
| Tier 4 | 18 | Baseline Appendix D5 |
| Tier 3 | 26 | Baseline Appendix D5 |
| Tier 2 | 36 | Baseline Appendix D5 |
| Tier 1 (alpha/AAA-corp core) | 50 | Baseline Appendix D5 |

*(D5 is written for drones/sprites in the baseline, but is the same Wired-system Integrity pool that scales ICE, hostile AI Personas, and rival-decker Track 2 targets by node tier -- there is only one Integrity table in the Wired system, per Appendix D's structure.)*

**Biofeedback bleed-through:** some hits carry an "Integrity-to-Stamina biofeedback bleed-through" clause (see Failsafe Cascade, Emergency Patch, Anchor Point) -- this is the mechanism by which damage done to a *node's* Integrity can bleed back into a *Hacker's own* Stamina, gated by your cyberdeck's Biofeedback Resistance stat and your connection state (see the table above).

#### System Stat Card -- The Universal Template for Nodes, ICE, and Systems

*Every node, system, ICE construct, hostile AI Persona, or rival decker in the Wired is built from the same six stats. This card is the template a Director fills in for any Track 1 object or Track 2 target on the fly -- all six numbers are keyed off a single input, the target's **tier** (5 = weakest/street-grade, 1 = strongest/alpha-corp), per baseline Appendix D.*

| Stat | Applies To | What It Represents | How It's Calculated |
|---|---|---|---|
| **Node Rating** | Both Tracks | The target's overall tier (T5-T1) -- the single input that sets every other stat on this card. | A Director-assigned tier reflecting how well-defended/valuable the system is (street-grade lock = T5; alpha-corp core = T1). Everything below reads off this one number. |
| **Node Description** | Both Tracks | The node's aesthetic -- often artistic and stylized to brand the System, and represented in the Wired by a holographic icon or similar visual signature (a corp's sigil rendered as a floating glyph, a black-market host skinned like a snarling dog, a government node as a flat gray monolith). Pure flavor, no mechanical effect -- but it's how a Hacker (and the table) actually *sees* a node before touching it. | Director/Session-defined per node, not tier-derived like the other rows -- describe it to match the node's owner, purpose, and reputation. No formula; this is narrative color layered on top of the mechanical stats above. |
| **Breach DC** *(optional flat-target alternative)* | Both Tracks | How hard the node is to force entry into, for tables that want a quick binary pass/fail instead of reading the full Outcome Tier. | Fixed by Node Rating: **T5 DC10 · T4 DC12 · T3 DC15 · T2 DC17 · T1 DC19.** The primary resolution is still the Outcome Tier read on the Power Roll -- this DC is a shortcut for trivial nodes only. |
| **ICE Layer(s)** | Track 2 (defines what's actively fighting back) | The node's active defenses -- how many layers of passive/active ICE stand between you and full access, and whether black ICE (the kind that bites back with biofeedback) is present. | Fixed by Node Rating: **T5** 1 passive layer · **T4** 2 passive layers · **T3** passive + 1 active ICE · **T2** passive + 2 active ICE, biofeedback on a failed breach · **T1** full active ICE suite + automatic counter-trace on any Tier-3 roll against it. |
| **Integrity** | Track 2 (Track 1 has none -- see note below) | The target's health pool -- the Stamina-equivalent number that Programs and abilities whittle down via your cyberdeck's Integrity Damage Bonus. Reaching 0 takes the target down. | Fixed by Node Rating: **T5** 12 · **T4** 18 · **T3** 26 · **T2** 36 · **T1** 50. |
| **Biofeedback Value** | Track 2 (the damage that can bleed back to *you*) | The raw Stamina damage a hostile hit (black ICE, catastrophic failure) deals back through your deck into your own body if it connects. | Fixed by Node Rating: **T5** 3 · **T4** 5 · **T3** 8 · **T2** 13 · **T1** 22. Then scaled by **your own connection state** (see Connection States table, above): **x0.5 round down, min 1** if Overlaid · **x1** if wired-direct · **x1.5 round up** if Jacked In. Finally reduced by your cyberdeck's **Biofeedback Resistance** stat before it hits your Stamina. |
| **Alert Contribution** | Both Tracks | How much heat interacting with this target generates -- not a separate number of its own, but a reminder that every Track 1/Track 2 interaction feeds the *same* 12-step Trace Alert track (see below), regardless of tier. Higher-tier targets don't push Alert up faster per hit, but their tougher Integrity/ICE means you're rolling against them -- and risking Tier 1 results -- more times per encounter. | Not tier-scaled on its own. Governed entirely by the Trace Alert rules below (Outcome Tier of your roll, not the target's tier, decides whether Alert moves). |

**Track 1 note:** Track 1 objects and systems (doors, cameras, locks, a person's smartlink) use only **Node Rating**, **Node Description**, **Breach DC**, and **Alert Contribution** from this card -- they resolve as a single Power Roll with no ongoing Integrity pool and no ICE layers of their own (per the Wired System's "What a Node Is" section, above). A Track 1 target is breached and acted on in the same activation; there's nothing left to "reduce to 0."

**Track 2 note:** Track 2 targets (ICE, hostile AI Personas, rival deckers, and any actively-defended node) use the full card -- Node Rating, Node Description, Breach DC, ICE Layers, Integrity, Biofeedback Value, and Alert Contribution all apply. This is the template a Director uses to stat up any hostile Wired presence on the fly: pick a tier, and all five downstream numbers are already fixed by the table.

**Worked example -- statting a Tier 3 corp host (Track 2) on the fly:** Node Rating T3 -> Breach DC 15 (optional) -> ICE Layers: passive + 1 active ICE -> Integrity 26 -> Biofeedback Value 8 (x1.5 = 12, round up, if a Hacker gets hit while Jacked In, before that Hacker's own Biofeedback Resistance reduces it further) -> Alert Contribution: governed by the standard Trace Alert rules on every roll against it, same as any other target.

*Source: baseline Appendix D1 (Node Rating/Breach DC/ICE layers), D4 (Biofeedback Value + connection-mode modifiers), D5 (Integrity by tier). Consolidated here into one lookup card per Michael's request (2026-07-28) -- no new numbers invented, only reorganized into a single reference template.*

#### Trace Alert: Definition and Escalation

**Trace Alert** (referred to on some abilities simply as "the Alert Track") is the Wired system's rising detection meter -- the mechanical spine of "the longer you're in, the worse it gets." It is tracked per hostile node/host, on a **12-step track**, per baseline Appendix D2:

| Alert Steps | Effect |
|---|---|
| **1-4** | No mechanical effect yet -- flavor only. Passive ICE stirs, but nothing bites. |
| **5-8** | **+1 Malice to the Director per step crossed** (cumulative) -- rising Alert directly feeds the GM's Malice pool, the same "heat" engine used in physical combat. |
| **9-11** | As above, plus a **bane on your next Wired Power Roll** -- active ICE is actively hunting you now. |
| **12 (max)** | **Full lockout** and a **hard counter-trace to your physical location** (security, corp response, or a hostile decker's own crew is now inbound on your real-world position) -- then the track **resets to step 6**, not to 0. A maxed-out host never fully forgets you found it. |

*(Source: baseline Appendix D2, "Alert track length & steps." This is the same track referred to in the shipped Hacker kit simply as "the Alert Track.")*

**When does Trace Alert increase?** Per the Outcome Tier convention this document uses (Tier 1 = something goes wrong, Tier 3 = clean success -- see the Matrix Verbs section below for the full convention note), Trace Alert typically increases on:

- **A Tier 1 result** on a Wired Power Roll (Matrix Verb, Program, or signature ability) -- this is the standard trigger referenced throughout this document's ability text (e.g., Ghost Signal Tier 1, Kill Switch Tier 1, Network Purge Tier 1, Backdoor Override's normal-use Tier 1).
- **Certain Tier 2 results** on specific Programs where the ability text says so explicitly (most Hacker Programs do NOT raise Alert on Tier 2 -- check each ability's own tier breakdown; Tier 1 is the default trigger unless stated otherwise).
- **Direct triggers named on an ability**, independent of Outcome Tier -- for example, Ghost Signal's Alert Track increase is a Tier-1-specific clause, while some Trigger conditions (like Ghost Step's own trigger condition) fire *off of* an Alert increase happening, rather than causing one.
- **Noisy or hostile action against a Track 2 target** in general, per the baseline's "poor roll, noisy action, or hostile ICE raises Alert" framing (baseline Wired chapter, "Risk: the Trace/Alert track + biofeedback").

**What does NOT increase Trace Alert:**

- **Tier 3 results** are always clean on Alert -- no increase, and several abilities (Ghost the Log-equivalent effects, Backdoor Override's Track 2 application) explicitly zero out Alert gain entirely as their signature payoff.
- **Backdoor Override** (11 Bandwidth) is explicitly written so its Track 2 application "does not increase from this use at all -- the intrusion leaves no trace," making it the cleanest high-cost Program in the kit.
- Passive observation (Scan, Deep Scan) does not raise Alert on its own -- only active intrusion, contested, or hostile verbs do.

**Managing Trace Alert.** The Hacker's defining identity is Alert-mastery -- unlike any other class on the Wired spine, the Hacker has dedicated tools to actively lower or freeze the track rather than just avoid raising it:

- **Ghost Step** (3rd level) -- as a Free Triggered Action, when the Alert Track increases from your own action, you may cancel that specific increase entirely (once per encounter).
- Higher-level Programs and capstone features (see Core Class Features and the Level 1-10 Progression Table below) extend this further, up to freezing the Alert Track for the whole crew at the top of the kit.

**What happens as Trace Alert climbs, narratively:** early steps (1-4) are pure atmosphere -- the Director may narrate a light flicker, a camera pausing a beat too long. Mid steps (5-8) start actively feeding the encounter's Malice budget, meaning the enemy side of the table gets more resources to spend against the whole party, not just the Hacker. Late steps (9-11) mean the Wired system itself is now actively working against the Hacker specifically (banes on their own rolls). Step 12 breaks containment entirely -- the fight stops being confined to the Wired and becomes a physical-world problem (security teams, a corp strike, a hostile decker's crew arriving at your real location), which is exactly why the rest of the crew has a stake in watching the clock too.

### Bandwidth -- Your Heroic Resource

Bandwidth is the Hacker's fuel. It works like this:

- **Income:** +1 Bandwidth per turn (base), plus your equipped cyberdeck's Bandwidth Bonus at your current Echelon, plus +1 bonus Bandwidth whenever you roll a natural 19 or 20 on any Power Roll.
- **Cap:** 6 x Echelon (rising to 8 x Echelon once you take Bandwidth Overclock at 7th level).
- **Reset:** Drops to 0 at the end of each encounter -- *unless* you've taken Infinite Loop (10th level), which lets you carry Echelon-worth of Bandwidth between encounters and softens overflow loss.

### Matrix Verbs (Universal)

These 9 abilities aren't unique to the Hacker -- *any* character with a commlink or cyberdeck has access to them (GMs/players add them directly to a sheet). They're the baseline vocabulary of doing anything in the Wired. All 9 cost exactly 1 Maneuver. Two are automatic (no roll); the other seven are genuine Power Rolls, and **having the Hacking skill (real key: Fabrication/`blacksmithing`) grants an edge on all seven** -- a deliberate GHOSTWIRE house-rule deviation from standard Draw Steel skill rules.

| Verb | What It Lets You Do | Roll Characteristic | Roll? | Tier 3 Bonus |
|---|---|---|---|---|
| **Connect** | Plug your Persona into the Wired at your current location -- the on-ramp for everything else on this list. Without a successful Connect, you're not Jacked In/Overlaid and can't use the other verbs, Programs, or Wired-based abilities that require that state. | Instinct (Intuition) | Yes | Refunds the Maneuver |
| **Jack Out** | Disconnect cleanly from the Wired and return your full attention to the physical world -- your emergency eject button when things go wrong on the Wired side (biofeedback spikes, hostile ICE lock-on). Also usable as a Free Triggered Action in a genuine emergency, on top of its normal Maneuver use. | Instinct (Intuition) | Yes (also usable as a Free Triggered Action in an emergency, layered on top of the Maneuver cost) | Refunds the Maneuver |
| **Toggle Connection State** | Switch your own head-space between Overlay (partial awareness, still present physically) and Jacked In (full immersion, more vulnerable) without disconnecting entirely. No contest involved -- it's your call, always. | -- | No -- automatic | -- |
| **Scan** | Get a read on what Nodes exist near you within Reach -- doors, cameras, locks, drones, any Wired-connected system in range. This is your general-purpose "what's here" check before deciding what to touch. | Instinct (Intuition) | Yes | Refunds the Maneuver |
| **Navigate** | Move through the Wired itself, up to your Reach in Nodes -- the Matrix-side equivalent of physical movement, letting you reposition to reach a node, ally, or target you couldn't otherwise touch. | Instinct (Intuition) | Yes | Refunds the Maneuver |
| **Ping** | Give a simple, low-stakes nudge to one simple Track 1 object within Reach -- flick a light, tap a lock, test a system -- without needing a cyberdeck or a full Program. The lightest-weight way to interact with a system. | Logic (Reason) | Yes | Refunds the Maneuver |
| **Broadcast** | Send a message to allies you're already connected to, within Reach or Ghost Distance -- a private, Wired-only comms channel no one outside the link can intercept. No contest involved; it just works. | -- | No -- automatic | -- |
| **Search** | Dig into a node you're already at to find something specific hiding inside it -- the follow-up to Scan (which tells you what's around) when you need to know what's buried in one particular place. | Logic (Reason) | Yes | Refunds the Maneuver + extra intel |
| **Read/Write** | The core data-manipulation verb -- read a file's contents, alter a record, plant or delete evidence, forge a credential. This is the verb that actually changes information in the Wired, rather than just observing or moving through it. | Logic (Reason) | Yes | Leaves **zero forensic trace** (does NOT refund the Maneuver -- this verb trades the refund for a clean exit instead) |

**Tier 1** on any rolling verb generally means "it works, but something goes wrong" -- usually an Alert Track increase. **Tier 2** is a clean success. **Tier 3** is a clean success plus the bonus listed above.

### Cyberdecks (Your Kit)

At 1st level you're equipped with a cyberdeck of your choice -- this is your Kit slot. Three Echelon 1 ("Street Grade") decks exist today, one leaning toward each subclass, though any Hacker can carry any deck:

| Cyberdeck | Deck Role | Price | Bandwidth Bonus/Echelon | Alert Discount/Echelon | Biofeedback Resistance/Echelon | Intrusion Roll Mod | Integrity Damage Bonus (T1/T2/T3) | Reach | Ghost Distance | Signature Ability |
|---|---|---|---|---|---|---|---|---|---|---|
| **Nyx Cartel "Switchblade"** | Disruptor | ¥800 | +2 | +0 | +1 | +1 | +1/+2/+3 | 1 | +0 | Flatline Jab |
| **Ferrum "Padlock-6"** | Controller | ¥900 | +1 | +1 | +2 | +0 | +0/+1/+2 | 2 | +1 | Seize |
| **Meridian "Lookout"** | Support | ¥750 | +1 | +2 | +1 | +0 | +0/+0/+1 | 3 | +1 | Overwatch Ping |

**Intrusion Roll Modifier** is your cyberdeck's flat bonus applied to Programs' Power Rolls (rolled with Logic (Reason)). **Integrity Damage Bonus** is the flat damage a successful Program hit deals to Track 2 targets, gated by tier. Both numbers grow with **Improved Cyberdeck** (4th level) and again with **Root Access** (9th level) -- these bonuses come from the class, not the deck, so they persist even if you swap decks.

**Cyberdeck Signature Abilities** (each deck's built-in Power Roll, Logic (Reason)-keyed, `2 + @chr / 4 + @chr / 6 + @chr` style tier damage on the Switchblade, `0 / 1+@chr / 2+@chr` on the Padlock-6, and a no-damage ally-edge effect on the Lookout):

- **Flatline Jab** (Switchblade) -- a quick, single-target Intrusion strike against one node or device; guarantees a small Alert bump regardless of tier.
- **Seize** (Padlock-6) -- attempt to take temporary control of an already-compromised node and hold it steady; favors holding what you've got over grabbing more.
- **Overwatch Ping** (Lookout) -- grants one ally within Reach an edge on their next roll by feeding them real-time Wired data; deals no direct damage of its own.

### Programs -- Your Signature Abilities

Programs are the Hacker's spell-equivalent -- learned automatically or chosen by cost tier as you level. Every Program is a **signature** category ability keyed to Logic (Reason) when it rolls at all.

| Program | Cost | Type | Target | Rolls? | Gained At |
|---|---|---|---|---|---|
| **Seize Control** | 2 Bandwidth | Maneuver | 1 Track 1 object/item within Reach (includes environmental nodes AND a person's Wired-connected gear) | Yes -- Logic (Reason) | 1st (automatic) |
| **Deep Scan** | Free (0 Bandwidth) | Maneuver | 1 person within Reach | Yes -- Logic (Reason) | 1st (automatic) |
| **Ghost Signal** | 3 Bandwidth | Maneuver | 1 ally or self within Reach | No -- automatic | 1st (choice) |
| **Kill Switch** | 5 Bandwidth | Maneuver | 1 Track 2 target within Reach you can see | Yes -- Logic (Reason) | 2nd (choice) |
| **Failsafe Cascade** | 7 Bandwidth | Maneuver | Self or 1 ally within Reach who is Jacked In/Overlaid | No -- automatic | 3rd (choice) |
| **Network Purge** | 9 Bandwidth | Maneuver | Up to 2 Track 2 targets within Reach | Yes -- Logic (Reason), one roll for both | 5th (choice) |
| **Backdoor Override** | 11 Bandwidth | Maneuver | 1 Track 1 object OR 1 Track 2 target within Reach | No -- automatic | 8th (choice) |

**Program details:**

- **Seize Control** -- A single activation both breaches the target's security AND lets you use it that same turn. Tier 1: brief one-shot control. Tier 2: solid, lasting control. Tier 3: as Tier 2, plus your choice of refunding the Maneuver or leaving no trace. This is your primary out-of-combat lever -- doors, lights, and power matter even in scenes with zero ICE or hostile deckers present.
- **Deep Scan** -- Free doesn't mean automatic; it's still a genuine Power Roll. Tier 1: surface-level info only. Tier 2: specific make/model of one or two items. Tier 3: full readout of everything Wired-connected on the target, plus a marked exploitable weakness (see Exploit the Breach, 4th level). Deep Scan is Scan's person-targeted big sibling and sets up a follow-up Seize Control.
- **Ghost Signal** -- No roll. The target becomes untraceable/unlisted on the Wired for the rest of the encounter until they take a hostile Wired action themselves. Outside combat, scrubs a commlink signature from local logs/cameras for a scene.
- **Kill Switch** -- Tier 1: no damage, Alert increases. Tier 2: Integrity damage equal to your deck's Tier 2 bonus, target loses its Maneuver next turn. Tier 3: as Tier 2, but the target loses its Main Action instead.
- **Failsafe Cascade** -- No roll. Target regains Stamina equal to Biofeedback Resistance x 2 and is shielded from the next instance of Integrity-to-Stamina biofeedback bleed-through this encounter.
- **Network Purge** -- Tier 1: Alert only. Tier 2: both targets take Integrity damage (Tier 2 bonus). Tier 3: as Tier 2, plus a bane on both targets' next Power Roll.
- **Backdoor Override** -- No roll, by design. On a Track 1 object: automatic Tier 3 breach, no roll. On a Track 2 target: guaranteed Integrity damage (Tier 2 bonus value) with **zero Alert Track increase**. Outside combat, this is an automatic clean breach of any lock, vault, or system -- no roll, no Alert cost.

### Level 1-10 Progression Table

| Level | Class Features | Perks/Skills | Subclass Features |
|---|---|---|---|
| **1** | Hacking Doctrine (choose subclass) - Bandwidth (heroic resource) - Cyberdeck (Kit choice) - Seize Control (automatic Program) - Deep Scan (automatic Program) - Choose a 3-Cost Program (Ghost Signal) | -- | Subclass passive + subclass triggered action (see subclass tables below) |
| **2** | Choose a 5-Cost Program (Kill Switch) | Perk (choice) | Subclass 2nd-level feature |
| **3** | Ghost Step (feature + ability) - Choose a 7-Cost Program (Failsafe Cascade) | -- | Subclass 3rd-level feature |
| **4** | Exploit the Breach - Improved Cyberdeck (+1 Intrusion Roll Mod / +1 Integrity Damage Bonus at every tier) | Characteristic Increase - Perk (choice) - Skill | -- |
| **5** | Choose a 9-Cost Program (Network Purge) | -- | Subclass 5th-level feature |
| **6** | Dual Boot (feature + Dual Boot Swap ability) | Perk (choice) | Subclass 6th-level feature |
| **7** | Bandwidth Overclock (+1 income, cap 6->8 x Echelon) - Ghost Protocol (feature + Pre-Encounter Sweep ability) | Characteristic Increase - Skill | Subclass 7th-level feature |
| **8** | Choose an 11-Cost Program (Backdoor Override) | Perk (choice) | Subclass 8th-level feature |
| **9** | Root Access (Dual Boot 2/encounter; Improved Cyberdeck bonus becomes +2/+2, replacing the 4th-level values) | -- | Subclass 9th-level feature |
| **10** | Ghost in the Machine (epic capstone, feature + ability) - Infinite Loop (Bandwidth carries between encounters) - Borrowed Access (feature + ability) | Characteristic Increase - Perk (choice) - Skill | -- |

### Core Class Features (Non-Subclass)

- **Ghost Step** (3rd) -- Free Triggered Action, no Bandwidth cost. Trigger: a Track 2 target (ICE, hostile AI Persona, rival decker) targets you directly, OR the Alert Track increases from your own action. Effect: choose one -- immediately use a Maneuver-cost Matrix Verb for free, or cancel the Alert increase entirely (once per encounter).
- **Exploit the Breach** (4th) -- Passive. Whenever your Deep Scan lands a Tier 3, the target has a marked exploitable weakness until the end of the encounter (or until re-scanned). The next Track 1/Track 2 Wired-based hit against that target from you or an ally gains an edge, and a Track 2 hit also deals +2 Integrity damage. Only one target can be marked at a time.
- **Improved Cyberdeck** (4th) -- Passive. +1 Intrusion Roll Modifier and +1 Integrity Damage Bonus at every tier, on top of whatever deck you're currently running. Granted by the class, not the deck.
- **Dual Boot** (6th) -- Passive enabling a once-per-encounter Free Triggered Action: apply a second owned deck's Roll Modifier/Damage Bonus to a single Program/Verb/signature roll instead of your equipped deck's, whichever is better. Bandwidth Bonus, Alert Discount, Biofeedback Resistance, Reach, and Ghost Distance are unaffected -- only the roll/damage numbers swap.
- **Bandwidth Overclock** (7th) -- Passive. Base income +1->+2 per turn; cap 6->8 x Echelon.
- **Ghost Protocol** (7th) -- Passive with a pre-encounter Free Triggered use. If you had at least one uninterrupted round of Overlay/Jacked-In access before initiative (GM's call), you and your allies get an edge on your first Power Roll of the encounter, and you may use one free Matrix Verb or Deep Scan before the first turn begins.
- **Root Access** (9th) -- Passive. Dual Boot becomes twice per encounter; Improved Cyberdeck's bonus rises to +2/+2 at every tier (replacing, not stacking with, the 4th-level +1/+1).
- **Ghost in the Machine** (10th, epic capstone) -- Free Triggered Action, once per encounter. Treat any Power Roll you just made as a natural 19 if the actual result was lower -- can turn a Tier 1/2 into a guaranteed Tier 3, and also triggers the natural-19/20 bonus Bandwidth.
- **Infinite Loop** (10th) -- Passive. Bandwidth no longer fully resets between encounters -- retain Echelon's worth (4 at 10th level) instead of dropping to 0. The first 2 points of cap overflow in a round are retained for one round instead of lost outright.
- **Borrowed Access** (10th) -- Main Action, 3 Bandwidth. Choose an ally within Reach who is Jacked In/Overlaid; they immediately use one Program you know costing 5 Bandwidth or less, using your deck's stats, without spending their own action -- but it costs your Main Action and your Bandwidth.

### Subclass: Disruptor -- *Striker, Damage Amplification*

The Hacker's offensive specialist: hard, fast, single-target Intrusion strikes that punish Track 2 targets and amplify the whole team's damage against ICE, hostile deckers, and AI Personas.

| Level | Feature | Effect |
|---|---|---|
| 1 | Overclocked Damage (passive) | +1 flat Integrity damage on your own successful Track 2 hits |
| 1 | Cascade Strike (Triggered Action, 1 Bandwidth) | Trigger: any Track 2 target takes Integrity damage from anyone. Effect: add +2 flat Integrity damage to that hit |
| 2 | Overclocked Strikes (passive) | Your own-hit bonus rises from +1 to +2 (the ally-hit trigger stays +2) |
| 3 | Cascade Failure (Triggered Action, 2 Bandwidth) | Trigger: you drop a Track 2 target to 0 Integrity. Effect: another Track 2 target within Reach immediately takes Integrity damage equal to your deck's Tier 1 Damage Bonus |
| 5 | No Second Chances (passive) | Your 1st-level triggered action can also apply Exploit the Breach's marked-weakness edge to the same hit, even if you didn't scan the target |
| 6 | Overwhelm ICE (Main Action, 4 Bandwidth) | Power Roll, Logic (Reason). Tier 1: half Tier 1 Damage Bonus (rounded down), Alert up. Tier 2: full Tier 2 bonus + your 1st-level passive. Tier 3: full Tier 3 bonus + passive + bane on target's next roll |
| 7 | Hair Trigger (passive) | Your 1st-level triggered action can be used twice per round (still 1 Bandwidth each) |
| 8 | Total Breach (passive) | Own-hit bonus rises to +3; dropping a Track 2 target to 0 Integrity refunds 2 Bandwidth |
| 9 | Zero Day (Main Action, 6 Bandwidth) | Power Roll with an edge, Logic (Reason). Always deals Tier 3 Damage Bonus damage regardless of roll tier (a Tier 1 roll still raises Alert) + passive bonus. On an actual Tier 3 roll, target also can't act on its next turn |

### Subclass: Controller -- *Lockdown, Node Control / Holding* ("The Sysop")

A specialist in seizing and holding fixed systems, turning nodes into weapons and tripwires against anyone who tries to take them back.

| Level | Feature | Effect |
|---|---|---|
| 1 | Extra Node (passive) | Hold 1 extra node beyond your deck's normal limit |
| 1 | Lockout (Triggered Action, 1 Bandwidth) | Trigger: an enemy attempts to retake/break your hold on a seized node. Effect: apply a bane to that attempt |
| 2 | Redundant Systems (passive, enabling a once-per-encounter Free Triggered Action) | If you lose control of a held node, spend 1 Bandwidth to attempt re-seizing it with a Power Roll (Logic (Reason)), no Maneuver/Main Action cost, once per encounter |
| 3 | Chokepoint (Main Action, 3 Bandwidth) | No roll. Until your next turn, any Track 2 target that breaches/retakes/routes through a node you hold takes a bane and alerts you immediately, even if you're not Jacked In |
| 5 | Wider Net (passive) | Extra-node count rises from 1 to 2 |
| 6 | Puppet Strings (Main Action, 4 Bandwidth) | No roll. Use a held interactive node's normal function (turret, camera, drone, smartlink) once, without counting against its own action economy |
| 7 | Iron Grip (passive) | 1st-level triggered action's single bane becomes a double-bane |
| 8 | Total Awareness (passive) | You always know when a held node is targeted for retake/breach/disruption, even off-map or out of Reach, and may spend a Maneuver to act on it as though it were in Reach |
| 9 | Master Sysop (Main Action, 6 Bandwidth) | Power Roll (Logic (Reason)), one roll vs up to 3 unheld nodes within Reach. Tier 1: seize 1 (your choice), Alert up. Tier 2: seize 2. Tier 3: seize all 3, none count against your held-node limit for the rest of the encounter |

### Subclass: Support -- *Tank/Anchor, Ally Protection* ("Guardian Angel in the Net")

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

### Chrome a Hacker Runs

Cyberware relevant to the Wired -- from the Matrix & Signals implant category (chrome grades Salvage / Standard / Soft (Bioware); Milspec is an Availability band, not a chrome grade):

- **Sub-Dermal Radio / Ghost Antenna** -- Wired signal-boosting implants.
- **Encephalon / Cerebral Datastore** -- grants +1 Bandwidth/Uptime cap at E3, +2 Logic (Reason) on Matrix rolls at E4.
- **Simsense Booster / Hot-Sim Adapter** -- sensory/interface boosters for deeper Wired immersion.
- **Signal Ghost** -- signature-masking implant.

Body Integrity (chrome capacity) starts at **20**, as for every living non-Cyborg hero -- see `GHOSTWIRE-Chrome-Rules-v1.md` and `GHOSTWIRE-Chrome-Catalog-v1.md` for full install rules, Echelon/grade doctrine, and pricing.

---

## PART 2 -- AGENT/DEV-FACING: IMPLEMENTATION GUIDE

*This section is a technical reference for future agents/sessions rebuilding, patching, or extending the Hacker class in Foundry. It documents real schemas, real IDs, real folder structure, and known caveats -- nothing here is guessed. Per Pre-Flight Doctrine, verify any field path live before writing code that touches it.*

### Module Scope (Standing Rule)

All GHOSTWIRE Foundry work is scoped to the `ghostwire` module folder and its compendiums:

- `ghostwire.ghostwire-classes` -- Hacker class item, 3 subclass items
- `ghostwire.ghostwire-kits` -- Cyberdeck kit items
- `ghostwire.ghostwire-abilities` -- Program/ability items, Matrix Verb items, cyberdeck signature abilities

**Never modify the base `draw-steel` Foundry system directly.** Module root on Michael's machine: `C:\Users\mfran\Dropbox\FoundryVTT\Data\modules\ghostwire`.

### Item Inventory (Live, Ground Truth)

74 total items across 4 types, confirmed via bracket-matched JSON extraction of the original creation payload in `Deploy-Ghostwire-Hacker-Rebuild-v1.js`, cross-checked against post-creation live patches (see Known Live Patches below):

| Type | Count |
|---|---|
| `class` | 1 (Hacker, `oyCY9gbV8BUf6qb8`) |
| `subclass` | 3 (Disruptor `2kfUmfZcdqXRqNjm`, Controller `M7U93S4xg89YL4Tb`, Support `fWXBE7ZHKeemLolG`) |
| `feature` | 45 |
| `ability` | 25 |

Plus, outside the 74-item Hacker rebuild payload:

- 3 Cyberdeck `kit` items + 3 cyberdeck signature `ability` items (from `Deploy-Ghostwire-Cyberdecks-Pilot-v1.js`)
- 9 universal Matrix Verb `ability` items (from `Deploy-Ghostwire-MatrixVerbs-v1.js`)

### The Feature/Ability Pairing Pattern

**Critical structural pattern for any agent extending this class:** most Hacker abilities have a same-named `feature` counterpart alongside the `ability` item (e.g. "Ghost Step" exists as both feature `ih84SE8JyaQ5NMlL` and ability `NJtENy1A1JOSoRPz`; "Seize Control" as feature `3Mmh9ItvaCwvq83n`/`ApvhDm8Cm7rozXVj` -- note the original feature-duplicate IDs were deleted live per Bug #2 fix -- and ability `xv0uMibofKQGVLkI`).

- The **feature** item carries the actual rules prose (`system.description.value`) -- cost, target, roll characteristic, tier-by-tier effect text. This is what a player reads to understand what the ability does.
- The **ability** item carries the *mechanical* roll data Foundry's sheet actually uses to render a Roll button: `system.power.roll` (formula + characteristics array + reactive flag), `system.target`, `system.distance`, `system.resource`.
- Class-level `itemGrant` advancements grant BOTH the feature and the ability together in the same advancement's `pool` array (see `Cq9ZqLfLAybSrjH0` "Ghost Step" advancement granting both `ih84SE8JyaQ5NMlL` and `NJtENy1A1JOSoRPz` at 3rd level, as one example among many).

**Important gotcha confirmed live during Bug #2 investigation:** on several items (all 25 signature/heroic `ability`-type items in the 74-item dump), `system.description.value` is **empty** -- the rules text lives entirely on the paired feature, not duplicated onto the ability. Do not assume an ability item is self-describing; always resolve its paired feature for display text when building any tooltip, export, or documentation pass.

Cross-reference against real Draw Steel source for how `itemGrant` advancements structurally resolve pools into granted items: `/home/user/workspace/draw-steel-src/src/module/data/pseudo-documents/advancements/item-grant-advancement.mjs`.

### Class Item Schema (`oyCY9gbV8BUf6qb8`, type `class`)

Key fields under `system`:

```
_dsid: "hacker"
level: 0
primary: "Bandwidth"          // heroic resource display name
epic: "Ghost in the Machine"  // epic capstone display name
turnGain: "1"                 // base Bandwidth income per turn
minimum: "0"
characteristics.core: ["reason", "intuition"]   // real DS keys; display as Logic/Instinct
stamina: { starting: 19, level: 7 }
recoveries: 9
advancements: { <advId>: { name, type: "itemGrant", requirements: { level }, chooseN, pool: [{uuid}], description, additional: {type, perkType, cost} } }
```

Advancement `additional.type` of `"perk"` marks a generic Perk-choice slot (empty `pool`, resolved by player choice from the perk compendium, not by a fixed itemGrant target). `Characteristic Increase` and `Skill` advancements at levels 4/7/10 have empty `pool` and empty `additional` -- these use Foundry's built-in characteristic/skill advancement types, not `itemGrant`.

The full level 1-10 advancement list (30 total advancement entries on the class item) is enumerated in Part 1's progression table above -- that table was generated directly from this live `system.advancements` object, sorted by `requirements.level`.

### Ability Item Schema (Programs / Matrix Verbs / Signatures)

```
type: "ability"
system: {
  _dsid: <string>,
  story: <flavor line>,
  keywords: [...],
  type: "maneuver" | "main" | "triggered" | "free",   // action economy
  category: "signature" | "heroic",
  resource: <number|null>,      // Bandwidth cost, or null if the parent feature states the cost in prose
  trigger: <string>,             // trigger text for triggered-action types
  distance: { type: "ranged"|"self", primary, secondary, tertiary },
  target: { type: "creature"|"object"|"creature-or-object"|"ally"|"ally-or-self"|"self", value, custom },
  power: {
    roll: { formula: "@chr", characteristics: ["reason"]|["intuition"], reactive: false } | null,
    effects: { <effectId>: { type: "damage", damage: { tier1: {...}, tier2: {...}, tier3: {...} } } }  // only on cyberdeck signature abilities; Program/Verb abilities generally carry power.effects: {} and put tier text on the paired feature instead
  },
  effects: { <effectId>: { type: "base", description: <html>, name, sort, before } },  // present on Matrix Verb items only, holding their full tier-by-tier text inline
  prerequisites: { value, dsid: [], level }
}
```

`power.roll.characteristics` is a real Draw Steel key (`reason` or `intuition`), never the display label -- **always translate to Logic (Reason) / Instinct (Intuition) in any player-facing output.** `power.roll.enabled` seen in live sheet inspection is a **derived** getter computed by `ability.mjs`, not a raw source field -- do not read/write it directly; it derives from whether `power.roll` is non-null and other prepared-data logic.

### Feature Item Schema

```
type: "feature"
system: {
  description: { value: <html rules text>, director: "" },
  ... (type/category fields largely unused/null on Hacker features -- confirmed live: both are `None`/absent on every one of the 45 Hacker feature items pulled)
}
```

All real mechanical text for player-facing display should be read from `system.description.value` on the feature, HTML-stripped for markdown/plaintext output.

### Cyberdeck (Kit) Item Schema

```
type: "kit"
system: {
  description: { value: <html>, director: "" },
  _dsid: <string>,
  advancements: { <advId>: { type: "itemGrant", requirements: {level: null}, pool: [{uuid: signature-ability-uuid}] } },
  equipment: { armor: "none", weapon: [], shield: false },
  bonuses: { melee/ranged damage all 0, stamina/speed/stability 0, disengage null }  // native DS combat fields, unused for Wired mechanics
},
flags.ghostwire.wiredStats: {
  deckRole: "Disruptor"|"Controller"|"Support",
  tier: "Echelon 1 -- Street Grade",
  price: "800 nuyen",
  bandwidthBonusPerEchelon: <int>,
  alertDiscountPerEchelon: <int>,
  biofeedbackResistancePerEchelon: <int>,
  intrusionRollModifier: <int>,
  integrityDamageBonus: [tier1, tier2, tier3],
  reach: <int>,
  ghostDistance: <int>
}
```

**Critical:** all Wired-only stats (Bandwidth Bonus, Alert Discount, Biofeedback Resistance, Intrusion Roll Modifier, Integrity Damage Bonus, Reach, Ghost Distance) live under `flags.ghostwire.wiredStats`, NOT in the native `system.bonuses` block -- native `bonuses` only covers melee/ranged physical combat and doesn't apply to Wired mechanics. Any script or sheet element reading cyberdeck stats must read the flag path.

The Hacker class item's Cyberdeck advancement (`VeAdN8OVOO7eJz1h`) is deliberately created with an **empty pool** -- cyberdecks are NOT duplicated into the class item's own advancement pool. They're wired in separately by `Wire-Ghostwire-Hacker-CyberdeckPool-v1.js`, which finds the advancement by name-match (`"cyberdeck"` substring) and writes the 3 kit UUIDs into `system.advancements.<advId>.pool` via a plain dotted-path `item.update()` call. This is safe specifically because it's appending to an existing array field, not changing the advancement's `type` (see the Perk-advancement `ForcedReplacement` bug note below).

### Folder Structure (Live)

| Pack | Folder | Contents |
|---|---|---|
| `ghostwire-classes` | `GWClassesFldr001` | Hacker class item |
| `ghostwire-kits` | "GHOSTWIRE Cyberdecks" | 3 cyberdeck kit items |
| `ghostwire-abilities` | "GHOSTWIRE Cyberdeck Signatures" | 3 cyberdeck signature abilities |
| `ghostwire-abilities` | "Matrix Verbs (Universal)" (`j410s2nh7w7Ut8rk`) | 9 universal verb ability items |
| `ghostwire-abilities` / `ghostwire-classes` | (Hacker-specific folders, per rebuild script) | 45 features + 25 Program/heroic abilities + 3 subclasses |

### Deploy/Fix Script Reference (Chronological, Authoritative Order)

1. **`Deploy-Ghostwire-Hacker-v1.js`** (60KB) -- EARLIER deploy script. Superseded by the Teardown/Rebuild pair below; do not treat as authoritative without verifying it wasn't rolled back.
2. **`Teardown-Ghostwire-Hacker-v1.js`** + **`Deploy-Ghostwire-Hacker-Rebuild-v1.js`** -- the authoritative full rebuild. The 74-item ground-truth dump used throughout Part 1 was extracted from this rebuild script's `ITEMS` array.
3. **`Deploy-Ghostwire-Cyberdecks-Pilot-v1.js`** -- creates the 3 cyberdeck kits + 3 signature abilities (idempotent: checks for existing folders by name before creating).
4. **`Wire-Ghostwire-Hacker-CyberdeckPool-v1.js`** -- wires the 3 cyberdeck UUIDs into the Hacker class item's empty Cyberdeck advancement pool. Run only after step 3 is verified clean.
5. **`Deploy-Ghostwire-MatrixVerbs-v1.js`** -- creates the 9 universal Matrix Verb items in their own folder, independent of the Hacker class (no itemGrant links them -- any Wired-capable character gets them by manual drag-on).
6. **`Deploy-Ghostwire-Hacker-Patch-MissingAbilities-v1.js`** -- post-creation patch (details not yet fully audited in this document; re-verify live state before citing specific field changes).
7. **`Deploy-Ghostwire-Hacker-SkillFix-v1.js`** -- post-creation patch (skill/skill-key correction; re-verify live state).
8. **`Fix-Ghostwire-Hacker-PerkAdvancements-v1.js` through `v5.js`** -- iterative fix chain for a Perk-advancement bug (see Known Bugs below). v5 is presumed final/working; v1-v4 are historical iterations, each with a matching Rollback script.
9. **`Deploy-Ghostwire-SeizeControl-DeepScan-Fix-v1.js`** (this session) -- targeted live patch to Seize Control/Deep Scan specifically: deleted feature-duplicates (`3Mmh9ItvaCwvq83n`, `ApvhDm8Cm7rozXVj`), corrected `target.type` to `creatureObject`, populated `power.effects`, trimmed advancement pools to real ability UUIDs only.

Every forward-fix script above has a matching `Rollback-*` script per Pre-Flight Doctrine. **A rollback script must never fabricate data it doesn't actually have on disk or in a verified live capture -- if the backup/source doesn't exist, it must abort safely, not guess.**

### CAVEAT -- Static Dump vs. Live State

**The 74-item JSON dump (`hacker_items_full.json`) reflects the ORIGINAL `Deploy-Ghostwire-Hacker-Rebuild-v1.js` creation payload only.** It does NOT reflect corrections applied by later fix scripts (list in the previous section, items 6-9). Known specific divergences as of this writing:

- **Seize Control / Deep Scan:** the original creation payload's items (`3Mmh9ItvaCwvq83n` feature-duplicate for Seize Control, `ApvhDm8Cm7rozXVj` feature-duplicate for Deep Scan) were **deleted live** by the Bug #2 fix. The class item's advancement pools (`1z9W98KNgpNLsXdP`, `pWodNPdmbQEfYWrn`) still show both the old deleted feature ID and the correct ability ID in the static dump above -- this reflects the pre-fix pool contents. Live pools were trimmed to real ability UUIDs only.
- **`target.type`** for Seize Control/Deep Scan abilities was corrected live (confirmed changed to `creatureObject` per the Bug #2 fix script's validation output) -- the static dump shows `creature-or-object` (Seize Control) and `creature` (Deep Scan), the PRE-fix values.
- **`power.effects`** for these two abilities was populated live (1 effect each) -- the static dump shows empty effects on these two.

**Open/unconfirmed as of this document:** whether Seize Control and Deep Scan actually roll dice in the live Use-Ability dialog remains unresolved. Michael reported ("They dont, bug still there") that no roll formula/Roll button appears for Seize Control despite the mechanically clean Bug #2 fix apply. A read-only diagnostic script (`Diagnose-SeizeControl-DeepScan-PowerRoll.js`) was written to dump live `system.power`, `system.resource`, `system.target` as both raw source and derived-data, since `power.roll.enabled` is a derived getter -- **this diagnostic has not yet been run by Michael.** Treat any statement that these two Programs "roll normally" as unconfirmed until that diagnostic comes back clean. See `GHOSTWIRE_BUILD_LOG_CANONICAL.md`, HANDOFF NOTE #9, for full bug-tracking detail.

**For any future documentation, export, or migration pass:** re-pull live data via a fresh read-only diagnostic dump rather than trusting the static rebuild-script dump for Seize Control, Deep Scan, or any item touched by a fix script listed above.

### Known Bugs / Caveats for Future Agents

1. **Perk-advancement `ForcedReplacement` restriction (see fix chain v1-v5):** Foundry disallows a plain dotted-path `item.update()` when it would change an advancement's `type` field -- attempting this throws a `ForcedReplacement`-class error. This is WHY `Wire-Ghostwire-Hacker-CyberdeckPool-v1.js` is safe (it only appends array entries, never touches `type`) while the Perk-advancement fixes needed a different, more careful update strategy across 5 iterations. Any future advancement-editing script must check whether the edit touches `type` before choosing an update strategy.
2. **Ability `description.value` is frequently empty; the feature has the real text.** Any script generating player-facing output from ability items alone will produce blank rules text for at least the 25 Programs/heroic abilities audited here. Always resolve the paired feature.
3. **`power.roll.enabled` is derived, not raw.** Diagnostic/inspection scripts must call `.toObject()` for raw source AND separately inspect the live prepared-data getter to get the full picture -- inspecting only one or the other has previously produced a false "looks fine" read that didn't match the actual broken sheet behavior (Seize Control/Deep Scan, unresolved as of this writing).
4. **Massive file-duplication in the project's upload history is a known platform quirk, not a data-integrity issue** -- 65+ near-identical copies of the Hacker Player Guide docx and 8+ copies each of `master_rules_baseline` variants exist in `uploaded_attachments/` and `space_files/` from repeated re-uploads across a long thread. Always pick the most-recently-dated/uploaded copy and verify with a diff against one other copy if unsure, rather than assuming any given path is unique or canonical.
5. **The early `hacker.md` concept doc (2026-07-15, 3 near-identical copies `hacker.md`/`hacker-1.md`/`hacker-2.md`) is SUPERSEDED design, not ground truth.** It used now-abandoned terminology (a "Cognition" characteristic that was never implemented -- the real build uses Logic (Reason)/Instinct (Intuition) per the locked attribute-naming rule) and different resource mechanics (an "intrusion momentum" breach-and-build loop, not the flat per-turn Bandwidth income actually built). Subclass NAMES (Disruptor/Controller/Support) did carry through unchanged, but do not trust this doc for any numeric or mechanical detail -- cross-check everything against the live 74-item dump or a fresh live pull instead.
6. **OPEN DEV WORK ITEM (flagged 2026-07-28): Echelon 2-4 Cyberdeck Kits still need to be created.** `Deploy-Ghostwire-Cyberdecks-Pilot-v1.js` only ever shipped **3 decks, all Echelon 1 -- "Street Grade"** (Switchblade/Disruptor, Padlock-6/Controller, Lookout/Support) -- confirmed by grepping the script itself, which hardcodes `tier: "Echelon 1 -- Street Grade"` on all three entries and is explicitly named a "Pilot" batch. No Echelon 2 ("Mid-Grade"), Echelon 3, or Echelon 4 decks exist anywhere in the live build, the build log, or any project source file -- this was confirmed by a full search, not assumed. The Level 1-10 Progression Table's deck-scaling math (Improved Cyberdeck at 4th, Root Access at 9th) only upgrades the class-side Intrusion Roll Mod/Integrity Damage Bonus on top of whichever Echelon-1 deck you're holding -- it does NOT substitute for higher-tier deck items. **Next agent/session:** design and deploy 3 additional decks per missing Echelon (one per subclass lean, matching the existing stat template: Bandwidth Bonus/Alert Discount/Biofeedback Resistance per Echelon, flat Intrusion Roll Mod, tiered Integrity Damage Bonus, Reach, Ghost Distance, Signature Ability), following the same deploy/rollback script-pair pattern used for the Echelon 1 pilot. Do not invent Echelon 2-4 numbers without Michael's sign-off first -- this is new content, not sourced content, per Pre-Flight Doctrine.
7. **OPEN DEV WORK ITEM (flagged 2026-07-28): each Cyberdeck Kit still needs a physical description, artwork, and megacorp background lore.** All 3 shipped Echelon 1 decks (Switchblade, Padlock-6, Lookout) currently carry only mechanical stat blocks and a one-line flavor sentence each -- none have a full physical description (size, shape, materials, how it's worn/carried/jacked in), dedicated artwork/icon, or megacorp origin lore (which corp manufactures it, why, and how that corp's reputation colors the deck's street standing). Also needed per deck: **street rumors and reputation** -- the kind of table-talk color that tells a player what NPCs and rival deckers assume about them the moment their deck is spotted (e.g., "nobody trusts a Switchblade user not to burn the whole host down," "a Lookout on the table means somebody's about to get flagged before they know it"). This applies to the 3 existing Echelon 1 decks now, and will apply again to any Echelon 2-4 decks built per item 6, above -- **next agent/session should treat deck lore as its own pass, separate from and after the mechanical stat work**, and should surface drafts to Michael for sign-off before treating any invented corp name/lore as canon, per Pre-Flight Doctrine.

### Source File Index

| Purpose | Path |
|---|---|
| Canonical build log (single source of truth for build state) | `/home/user/workspace/GHOSTWIRE_BUILD_LOG_CANONICAL.md` |
| Full 74-item live-build dump (original creation payload) | `/home/user/workspace/hacker_items_full.json` |
| Extracted feature rules text (all 45 features, HTML-stripped) | `/home/user/workspace/hacker_features_text.txt` |
| Matrix Verb full item dump (9 universal verbs) | `/home/user/workspace/matrix_verbs_full.json` |
| Cyberdeck deploy script | `/home/user/workspace/ghostwire/foundry_build/Deploy-Ghostwire-Cyberdecks-Pilot-v1.js` |
| Cyberdeck pool wiring script | `/home/user/workspace/ghostwire/foundry_build/Wire-Ghostwire-Hacker-CyberdeckPool-v1.js` |
| Matrix Verb deploy script | `/home/user/workspace/ghostwire/foundry_build/hacker_rebuild/Deploy-Ghostwire-MatrixVerbs-v1.js` |
| Real Draw Steel source (for schema verification) | `/home/user/workspace/draw-steel-src/src/module/data/item/{ability,feature}.mjs`, `.../advancements/item-grant-advancement.mjs`, `.../power-roll-effects/{base-power-roll-effect,other-effect}.mjs`, `src/module/config.mjs` |
| Chrome/cyberware rules (Body Integrity, Echelon doctrine) | Uploaded `GHOSTWIRE-Chrome-Rules-v1.md` |
| Chrome/cyberware catalog (implant stats) | Uploaded `GHOSTWIRE-Chrome-Catalog-v1.md` |
| Pre-Flight Doctrine (governing process rules) | `/home/user/workspace/GHOSTWIRE_Preflight_Doctrine_v1.md` |

---

*End of GHOSTWIRE Hacker Class Compendium. For live bug status (Body Integrity, Seize Control/Deep Scan roll formula, Matrix Verb rollout), see the canonical build log's most recent HANDOFF NOTE.*
