# Ghostwire Core Rulebook — Chapter: The Hacker

**Status:** Stage 2 draft — batch review  
**Source of record:** `docs/masters/GHOSTWIRE_HACKER_DEVELOPMENT_MASTER.md` Part 1  
**Draw Steel spine:** Custom Ghostwire / Wired-heavy (not a direct DS class clone)  
**Prior:** Operator + Scout **approved** 2026-09-16; remaining classes drafted together for one review pass

**Notes for review:**
- Heroic resource: Bandwidth
- Subclasses: Disruptor / Controller / Support
- Depends on The Wire chapter — Wire rules are also summarized inside this master; full Wire chapter still Stage 4
- Old Foundry dump references in Part 1 kept only where they are rules text; treat numbers as SoR from this master

---

## PART 1 -- PLAYER-FACING: THE HACKER

### Who You Are

You are a **Hacker** -- a ghost in the machine who fights wars in the Wired before the first physical shot is ever fired. Your cyberdeck is your weapon, Bandwidth is your fuel, and Programs are your spells. You also compile **Agents** — deck daemons (Probe, Spike, Daemon, Watchdog), software not Resonance sprites. Whether you specialize as a **Disruptor**, **Controller**, or **Support**, you turn digital infrastructure into a battlefield only you can truly see.

Outside combat, you are the party's key into any door, camera, lock, drone, or vault that has a wire running to it. Inside combat, you are a second front the enemy has to defend -- one they usually can't even see coming.

### Class Chassis

| Stat | Value |
|---|---|
| **Core Characteristics** | Logic, Instinct |
| **Heroic Resource** | Bandwidth |
| **Epic Resource / Capstone** | Ghost in the Machine (10th level) |
| **Starting Stamina** | 19 |
| **Stamina per Level** | +7 |
| **Recoveries** | 9 |
| **Kit Slot** | Cyberdeck (your Field Arsenal-equivalent choice) |

### The Wired System -- Connection States, Nodes, and Trace Alert

*Before Bandwidth, Programs, or Matrix Verbs make sense, you need to understand the battlespace they operate in. This section defines the Wired System itself: what a node is, the four connection states (**Disconnected | Linked | Overlay | Jacked In**), the Track 1/Track 2 target distinction, and the Trace Alert mechanic that every Program and Matrix Verb references but never explains on its own card. Features that still say "Jacked In or Overlaid" mean those two immersion states — Linked does not satisfy them.*

*Source note: this section used to reconcile the 2026-07 baseline's three connection modes (wireless, wired-direct, jacked-in) with the shipped Overlay / Jacked In kit. **Live lock (2026-09-20):** RAW `docs/raw/21-the-wire.md` is source of record. Four states. Connect lands in **Linked**. There is no ×1 “wired-direct” biofeedback multiplier. Historical baseline notes below stay as provenance, not as a second ladder.*

#### What a Node Is

A **node** is any addressable point in the Wired -- a maglock, a security camera, a corp host, a smartgun's wireless interface, a drone, a vehicle's control bus. Every Program, Matrix Verb, and Hacker ability ultimately targets a node (or a target *through* a node). Nodes come in two flavors for targeting purposes:

- **Track 1** -- objects, systems, and infrastructure: doors, lights, cameras, locks, power grids, vaults, and Wired-connected gear worn or carried by a person (a smartlink, a cyberware wireless interface). Track 1 targets resolve as a single Power Roll with no ongoing health pool -- you breach and act on it in the same activation.
- **Track 2** -- hostile, contested, or "alive" targets: ICE, hostile AIs, rival deckers, and any node actively defended by an intelligence fighting back. Track 2 targets have their own **Integrity** pool (see below) and can hit back.

#### Wire Atlas / topology

The Wire sits at **three altitudes**. Device tokens answer **what is this socket**; atlas tokens answer **where am I on the map**. Full procedure: `docs/raw/21-the-wire.md` (Wire Atlas / topology) and `docs/spikes/B116-WIRE-ATLAS.md`.

| Altitude | Tokens | Reach |
|---|---|---|
| Region / district graph | **Relay**, **Host** | Hops on **this** scene’s graph |
| Site / facility graph | **Segment** (+ **Host** as site root) | Recounted on the facility graph |
| Room / device graph | **Device** (Light, Maglock, Cam, ICE, …) | Room only; auto-nodes stay here |

**Relay** is a path (Navigate along; Trace can travel fast; usually not Seize-for-loot). **Host** is a destination (Rating / ICE / Watchdog; entering may change scene). **Segment** is the same mechanical class as Host, nested — name includes the parent (`Power Co — North Substation`). **Endpoint** is optional v1.1 (opens a meatspace room). Do not put Devices on a district graph.

#### Connection States: Disconnected, Linked, Overlay, Jacked In

> **Live lock (2026-09-20):** RAW `docs/raw/21-the-wire.md` is source of record. Four states — **Disconnected | Linked | Overlay | Jacked In**. Connect lands in **Linked**. Toggle steps Linked → Overlay → Jacked In → Linked. Jack Out from any on-net state. Do not ship a two-state Overlay/Jacked In-only ladder over this lock.

You reach a node by first using the **Connect** Matrix Verb (see Matrix Verbs, below) to establish your **avatar** — your presence in the Wired — at your current location. Connect (from Disconnected, with a Wire interface) lands you in **Linked**. **Toggle Connection State** (no roll, no contest) steps one rung deeper, then wraps:

| State | What It Means | Physical Awareness | Power Roll Tradeoff | Biofeedback Exposure |
|---|---|---|---|---|
| **Disconnected** | Off-net. Radio is a jammable backup. | Full | Normal meat rolls. Only **Connect** is a Wired verb. | None |
| **Linked** | On-net for comms / ID / packets — the post-radio Wire default. Soft presence. | Full | Meat Power Rolls **normal** (no Overlay bane). No Jacked In Wired edge. **Broadcast** works. Does **not** count as full **Connected** for Scan / Navigate / Ping / Search / Read-Write / Programs / payload Runs / **Compile Agent**. | None — you are not immersed |
| **Overlay** | Partial immersion -- your avatar rides alongside your physical senses. You see the Wired layered over the real world (an AR-style heads-up view of nearby nodes, marks, and traffic). | Full -- you can still see, move, speak, and react physically while Overlaid. | **Bane on real-world (physical) Power Rolls** -- the AR overlay is a genuine distraction competing for your attention with whatever's happening in front of you. No modifier either way on Wired Power Rolls. | Reduced. Biofeedback damage while Overlaid is **half** the node's listed Biofeedback value (round down, minimum 1). |
| **Jacked In** | Full immersion -- your avatar *is* your primary presence, and your body goes inert and exposed in the physical world (the reason your crew guards your body while you're under). | None. You cannot perceive, move, or act in the physical world while Jacked In, and you're an easy physical target. | **Edge on all Wired Power Rolls** -- full immersion sharpens every Matrix Verb, Program, and Wired-based signature ability. You cannot make real-world Power Rolls at all while Jacked In (no physical awareness means no physical action to roll for), and you cannot perceive or interact with the physical world in any way. | Full. Biofeedback damage while Jacked In is multiplied **x1.5 (round up)** against the node's listed Biofeedback value -- the tradeoff for full-immersion speed and power. |

**On-net vs Connected.** **On-net** means Linked, Overlay, or Jacked In. **Connected** (full) means Overlay or Jacked In only. Some Programs, features, and abilities (Ghost Protocol, Chokepoint, Borrowed Access, Failsafe Cascade, Wired Guard, **Compile Agent**, and others) explicitly require you or an ally to be "Jacked In or Overlaid" -- Linked does **not** satisfy them. A handful of higher-tier features (Anchor Point, Emergency Patch's biofeedback-cancel clause) key specifically off **Jacked In** alone. Scan, Search, and Watchdog ICE can find any non-Disconnected presence (**Linked = soft presence**). A Hacker’s **Watchdog Agent** is a compiled screen, not Watchdog ICE.

**Ruling (Michael, 2026-07-28, Linked addendum 2026-09-20):** Overlay and Jacked In remain a genuine mechanical tradeoff. **Linked** is the street-default on-ramp — comms and packets without Overlay’s meat bane or Jacked In’s Wired edge. **Overlaid**, you keep both worlds live but pay a **bane on real-world Power Rolls**. **Jacked In**, you gain an **edge on all Wired Power Rolls**, but you lose the real world entirely. **Toggle Connection State** (free, no roll) steps Linked → Overlay → Jacked In → Linked. **Jack Out** is the only off-ramp.

You leave any on-net state with the **Jack Out** Matrix Verb -- a clean disconnect that also serves as your emergency eject if a Program or Trace Alert spike goes bad.

#### Wired-System Stats: Integrity (Not Body Integrity)

Every Track 2 target -- and the "system" side of any Wired encounter -- tracks its own **Integrity**: a Stamina-equivalent health pool that Programs and abilities damage directly (via your cyberdeck's Integrity Damage Bonus) rather than dealing physical damage. Reducing a Track 2 target to 0 Integrity takes it down, exactly as reducing a creature to 0 Stamina does.

**Do not confuse this with Body Integrity** (the Chrome chapter's cyberware slot-budget resource, starting at **20** for every living non-Cyborg hero). They share a name but are entirely different systems: Body Integrity is a permanent character-sheet capacity for how much chrome you can carry; Wired-system Integrity is an encounter-scoped health pool belonging to nodes, ICE, hostile avatars, and rival deckers.

| Wired-System Integrity by Node Tier | Integrity | Source |
|---|---|---|
| Rating 1 (street-grade) | 12 | Baseline Appendix D5 |
| Rating 2 | 18 | Baseline Appendix D5 |
| Rating 3 | 26 | Baseline Appendix D5 |
| Rating 4 | 36 | Baseline Appendix D5 |
| Rating 5 (alpha/AAA-corp core) | 50 | Baseline Appendix D5 |

*(D5 is written for drones/sprites in the baseline, but is the same Wired-system Integrity pool that scales ICE, hostile AIs, and rival-decker Track 2 targets by node tier -- there is only one Integrity table in the Wired system, per Appendix D's structure.)*

**Biofeedback bleed-through:** some hits carry an "Integrity-to-Stamina biofeedback bleed-through" clause (see Failsafe Cascade, Emergency Patch, Anchor Point) -- this is the mechanism by which damage done to a *node's* Integrity can bleed back into a *Hacker's own* Stamina, gated by your cyberdeck's Biofeedback Resistance stat and your connection state (see the table above).

#### System Stat Card -- The Universal Template for Nodes, ICE, and Systems

*Every node, system, ICE construct, hostile AI, or rival decker in the Wired is built from the same six stats. This card is the template a Director fills in for any Track 1 object or Track 2 target on the fly -- all six numbers are keyed off a single input, the target's **Node Rating** (**1** = street-grade / weakest → **5** = alpha-corp / strongest). This Rating is a **system defense grade**, not a character level or echelon. Numbers preserved from the old T5→T1 lookup (see mapping note below).*

| Stat | Applies To | What It Represents | How It's Calculated |
|---|---|---|---|
| **Node Rating** | Both Tracks | The target's overall Wired defense grade (Rating **1–5**) -- the single input that sets every other stat on this card. | A Director-assigned Rating reflecting how well-defended/valuable the system is (street-grade lock = **Rating 1**; alpha-corp core = **Rating 5**). Not a character tier. Everything below reads off this one number. |
| **Node Description** | Both Tracks | The node's aesthetic -- often artistic and stylized to brand the System, and represented in the Wired by a holographic icon or similar visual signature (a corp's sigil rendered as a floating glyph, a black-market host skinned like a snarling dog, a government node as a flat gray monolith). Pure flavor, no mechanical effect -- but it's how a Hacker (and the table) actually *sees* a node before touching it. | Director/Session-defined per node, not Rating-derived like the other rows -- describe it to match the node's owner, purpose, and reputation. No formula; this is narrative color layered on top of the mechanical stats above. |
| **Breach DC** *(optional flat-target alternative)* | Both Tracks | How hard the node is to force entry into, for tables that want a quick binary pass/fail instead of reading the full Power Roll result. | Fixed by Node Rating: **R1 DC10 · R2 DC12 · R3 DC15 · R4 DC17 · R5 DC19.** The primary resolution is still the Power Roll result (low / middle / high) -- this DC is a shortcut for trivial nodes only. |
| **ICE Layer(s)** | Track 2 (defines what's actively fighting back) | The node's active defenses -- how many layers of passive/active ICE stand between you and full access, and whether black ICE (the kind that bites back with biofeedback) is present. | Fixed by Node Rating: **R1** 1 passive layer · **R2** 2 passive layers · **R3** passive + 1 active ICE · **R4** passive + 2 active ICE, biofeedback on a failed breach · **R5** full active ICE suite + automatic counter-trace on any high (17+) roll against it. |
| **Integrity** | Track 2 (Track 1 has none -- see note below) | The target's health pool -- the Stamina-equivalent number that Programs and abilities whittle down via your cyberdeck's Integrity Damage Bonus. Reaching 0 takes the target down. | Fixed by Node Rating: **R1** 12 · **R2** 18 · **R3** 26 · **R4** 36 · **R5** 50. |
| **Biofeedback Value** | Track 2 (the damage that can bleed back to *you*) | The raw Stamina damage a hostile hit (black ICE, catastrophic failure) deals back through your deck into your own body if it connects. | Fixed by Node Rating: **R1** 3 · **R2** 5 · **R3** 8 · **R4** 13 · **R5** 22. Then scaled by **your own connection state** (see Connection States table, above): **none** while Linked (not immersed) · **×0.5 round down, min 1** if Overlaid · **×1.5 round up** if Jacked In. There is no ×1 “wired-direct” multiplier. Finally reduced by your cyberdeck's **Biofeedback Resistance** stat before it hits your Stamina. |
| **Alert Contribution** | Both Tracks | How much heat interacting with this target generates -- not a separate number of its own, but a reminder that every Track 1/Track 2 interaction feeds the *same* 12-step Trace Alert track (see below), regardless of Rating. Higher-Rating targets don't push Alert up faster per hit, but their tougher Integrity/ICE means you're rolling against them -- and risking low (≤11) results -- more times per encounter. | Not Rating-scaled on its own. Governed entirely by the Trace Alert rules below (Power Roll result of your roll, not the target's Node Rating, decides whether Alert moves). |

**Track 1 note:** Track 1 objects and systems (doors, cameras, locks, a person's smartlink) use only **Node Rating**, **Node Description**, **Breach DC**, and **Alert Contribution** from this card -- they resolve as a single Power Roll with no ongoing Integrity pool and no ICE layers of their own (per the Wired System's "What a Node Is" section, above). A Track 1 target is breached and acted on in the same activation; there's nothing left to "reduce to 0."

**Track 2 note:** Track 2 targets (ICE, hostile AIs, rival deckers, and any actively-defended node) use the full card -- Node Rating, Node Description, Breach DC, ICE Layers, Integrity, Biofeedback Value, and Alert Contribution all apply. This is the template a Director uses to stat up any hostile Wired presence on the fly: pick a Node Rating (1–5), and all five downstream numbers are already fixed by the table.

**Worked example -- statting a Rating 3 corp host (Track 2) on the fly:** Node Rating 3 -> Breach DC 15 (optional) -> ICE Layers: passive + 1 active ICE -> Integrity 26 -> Biofeedback Value 8 (x1.5 = 12, round up, if a Hacker gets hit while Jacked In, before that Hacker's own Biofeedback Resistance reduces it further) -> Alert Contribution: governed by the standard Trace Alert rules on every roll against it, same as any other target.

*Source: baseline Appendix D1 (Node Rating/Breach DC/ICE layers), D4 (Biofeedback Value + connection-mode modifiers), D5 (Integrity by grade). Consolidated here into one lookup card per Michael's request (2026-07-28) -- no new numbers invented, only reorganized into a single reference template. **Legacy map:** old node T5→Rating 1, T4→2, T3→3, T2→4, T1→5 (street→alpha ascending).*

#### Trace Alert: Definition and Escalation

**Trace Alert** (referred to on some abilities simply as "the Alert Track") is the Wired system's rising detection meter -- the mechanical spine of "the longer you're in, the worse it gets." It is tracked per hostile node/host, on a **12-step track**, per baseline Appendix D2:

| Alert Steps | Effect |
|---|---|
| **1-4** | No mechanical effect yet -- flavor only. Passive ICE stirs, but nothing bites. |
| **5-8** | **+1 Malice to the Director per step crossed** (cumulative) -- rising Alert directly feeds the GM's Malice pool, the same "heat" engine used in physical combat. |
| **9-11** | As above, plus a **bane on your next Wired Power Roll** -- active ICE is actively hunting you now. |
| **12 (max)** | **Full lockout** and a **hard counter-trace to your physical location** (security, corp response, or a hostile decker's own crew is now inbound on your real-world position) -- then the track **resets to step 6**, not to 0. A maxed-out host never fully forgets you found it. |

*(Source: baseline Appendix D2, "Alert track length & steps." This is the same track referred to in the shipped Hacker kit simply as "the Alert Track.")*

**When does Trace Alert increase?** Per the Power Roll result convention this document uses (**low** ≤11 = something goes wrong; **high** 17+ = clean success — see Matrix Verbs), Trace Alert typically increases on:

- **A low (≤11) result** on a Wired Power Roll (Matrix Verb, Program, or signature ability) -- this is the standard trigger referenced throughout this document's ability text (e.g., Ghost Signal low, Kill Switch low, Network Purge low, Backdoor Override's normal-use low).
- **Certain middle (12–16) results** on specific Programs where the ability text says so explicitly (most Hacker Programs do NOT raise Alert on middle -- check each ability's own cost band breakdown; low is the default trigger unless stated otherwise).
- **Direct triggers named on an ability**, independent of Power Roll result -- for example, Ghost Signal's Alert Track increase is a low-result-specific clause, while some Trigger conditions (like Ghost Step's own trigger condition) fire *off of* an Alert increase happening, rather than causing one.
- **Noisy or hostile action against a Track 2 target** in general, per the baseline's "poor roll, noisy action, or hostile ICE raises Alert" framing (baseline Wired chapter, "Risk: the Trace/Alert track + biofeedback").

**What does NOT increase Trace Alert:**

- **High (17+) results** are always clean on Alert -- no increase, and several abilities (Ghost the Log-equivalent effects, Backdoor Override's Track 2 application) explicitly zero out Alert gain entirely as their signature payoff.
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

These 9 abilities aren't unique to the Hacker -- *any* character with a **Wire interface** has them (commlink, cyberdeck, datajack / trodes, **Rigger’s Harness** / RCC, **Wire Kit** on an NPC, pack drone, or pack vehicle, or Technomancer Resonance). They fire from the node applet, **not** the sheet. Full interface list: `docs/raw/21-the-wire.md`. They're the baseline vocabulary of doing anything in the Wired. All 9 cost exactly 1 Maneuver. Two are automatic (no roll); the other seven are genuine Power Rolls, and **having the Hacking skill (real key: Fabrication/`blacksmithing`) grants an edge on all seven** -- a deliberate GHOSTWIRE house-rule deviation from standard Draw Steel skill rules.

| Verb | What It Lets You Do | Roll Characteristic | Roll? | High (17+) Bonus |
|---|---|---|---|---|
| **Connect** | Plug your avatar into the Wired at your current location -- lands you in **Linked** (on-net for comms / ID / packets). Scan / Navigate / Ping / Search / Read-Write / Programs / payload Runs still need Overlay or Jacked In (Toggle). Requires a Wire interface (commlink / deck / chrome, **Rigger’s Harness** / RCC, **Wire Kit**, or Technomancer). | Instinct | Yes | Refunds the Maneuver |
| **Jack Out** | Disconnect cleanly from any on-net state (**Linked**, Overlay, or Jacked In) and return your full attention to the physical world -- your emergency eject button when things go wrong on the Wired side (biofeedback spikes, hostile ICE lock-on). Also usable as a Free Triggered Action in a genuine emergency, on top of its normal Maneuver use. | Instinct | Yes (also usable as a Free Triggered Action in an emergency, layered on top of the Maneuver cost) | Refunds the Maneuver |
| **Toggle Connection State** | Step one rung deeper on the ladder, then wrap: **Linked → Overlay → Jacked In → Linked**. No contest -- it's your call, always. Jack Out is the only path to Disconnected. | -- | No -- automatic | -- |
| **Scan** | Get a read on what Nodes exist near you within Reach -- doors, cameras, locks, drones, any Wired-connected system in range. Requires Overlay or Jacked In (Linked-only refuses). Scan can find any on-net presence; Linked reads as a soft presence. | Instinct | Yes | Refunds the Maneuver |
| **Navigate** | Move through the Wired itself, up to your Reach in Nodes -- the Matrix-side equivalent of physical movement, letting you reposition to reach a node, ally, or target you couldn't otherwise touch. | Instinct | Yes | Refunds the Maneuver |
| **Ping** | The lightest “touch this system” verb -- a nudge, not a deep hack. One simple **Track 1** thing within Reach does one small thing, without a Program or a full Read/Write: flick lights (the classic Ping); tap a maglock to see if it’s live / soft jolt (**not** unlock for entry); test whether a camera or door bus answers / brief glitch (**not** lasting cam-off); trigger a trivial system response. Unlock and lasting cam-off are **Read/Write**. Track 1 only (no ICE) -- ICE is **Track 2**. Ping does not bypass or defeat ICE; an ICE-guarded / Track 2 host is the wrong tool (Programs / payload Runs / real breach). Director may flavor a failed poke (ICE twitches, Soft Trace) but Ping never opens or controls the guarded system. Overlay or Jacked In. Not Console Wire ping/spoof (B106). | Logic | Yes | Refunds the Maneuver |
| **Broadcast** | Send a message to allies who are on-net (**Linked**, Overlay, or Jacked In), within Reach or Ghost Distance -- a private, Wired-only comms channel no one outside the link can intercept. Works from Linked. No contest; it just works. | -- | No -- automatic | -- |
| **Search** | Dig into a node you're already at to find something specific hiding inside it -- the follow-up to Scan (which tells you what's around) when you need to know what's buried in one particular place. | Logic | Yes | Refunds the Maneuver + extra intel |
| **Read/Write** | Change data, settings, or state -- read a file, alter a record, plant or delete evidence, forge a credential, **unlock a maglock for entry**, or **toggle a camera off / kill a feed**. This is the verb that actually changes information and device state in the Wired, not a Ping nudge. | Logic | Yes | Leaves **zero forensic trace** (does NOT refund the Maneuver -- this verb trades the refund for a clean exit instead) |

**Low (≤11)** on any rolling verb generally means "it works, but something goes wrong" — usually an Alert Track increase. **Middle (12–16)** is a clean success. **High (17+)** is a clean success plus the bonus listed above.

**Ping vs Read/Write.** Ping is the lightest “touch this system” verb — a nudge, not a deep hack. One simple Track 1 thing within Reach does one small thing without a Program or a full Read/Write: flick lights (the classic Ping); tap a maglock to see if it's live / soft jolt (**not** unlock for entry); test whether a camera or door bus answers / brief glitch (**not** lasting cam-off); trigger a trivial system response. Unlocking a maglock for entry and killing a camera feed are **Read/Write**. **Ping vs ICE:** Track 1 only (no ICE). ICE is Track 2. Ping does not bypass or defeat ICE; an ICE-guarded / Track 2 host is the wrong tool (Programs / payload Runs / real breach). Director may flavor a failed poke (ICE twitches, Soft Trace) but Ping never opens or controls the guarded system. Doctrine: Ping = touch/test nudge; Read/Write = change data/settings/state. Scan = what's near; Search = what's inside; Broadcast = Wire talk (Linked OK). Not the Console Wire ping/spoof (B106). Logic, Maneuver, Overlay or Jacked In. Tier 2 clean; tier 1 Soft Trace often; tier 3 clean + Maneuver refunded.

### Cyberdecks (Your Kit)

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

### Programs -- Your Signature Abilities

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

### Agents -- Deck Daemons (not Sprites)

Agents are software constructs you compile from your deck — **Probe** (recon / Deep Scan twin), **Spike** (intrusion / Integrity strike), **Daemon** (system control / Track 1 puppet), **Watchdog** (defend / Trace scrub / screen). They are **not** Resonance sprites. A Technomancer compiles sprites from the Wired's spirit world (`20`); you compile Agents as running processes. Different Actors, different art, different language. They never share a sprite SKU.

**Watchdog Agent is not Watchdog ICE.** Watchdog ICE is opposition on a Track 2 node. A Watchdog Agent is *your* compiled screen — Trace scrub and a bane on Wired/EW attacks — not the node's teeth.

**Immersion.** Compiling an Agent requires **Overlay or Jacked In**. **Linked refuses** — Agents need immersion; a soft presence is not enough to keep a daemon running. Decompile does not require immersion: you can kill your own process while Linked or Disconnected.

**Compile cost.** **Compile Agent** is a signature main action that costs **3 Bandwidth** in combat (the same number as Compile Sprite's Enhance and as Ghost Signal). Outside combat, Hacker Programs (and this compile) fire without spending, once until you earn Victories or finish a respite. There is no v1 Enhance that compiles a second Agent in the same action.

**Agent cap.** At 1st level you may have up to **2 Agents** compiled at once. The cap rises to **3** at 5th level and **4** at 8th. Caps do not stack — use the single highest number you qualify for. (A later Controller "Weaver-like" bump is parked.)

**Bands.** The Agent you compile is chosen by your current level, every time:

| Rank | Levels | Behavior |
|---|---|---|
| **Minor (extension)** | 1–3 | Agents act on your turn. No separate initiative. |
| **Intermediate (commanded)** | 4–7 | Agents act on their own turn, but only within standing orders — a Compile Agent maneuver-command each round keeps an intermediate Agent acting that round. |
| **Advanced (independent)** | 8–10 | Each Agent takes its own turn in the round. |

**Stamina.** An Agent's Stamina is archetype base + (**Logic × Level**), stamped when it compiles:

| Archetype | Minor (L1–3) | Intermediate (L4–7) | Advanced (L8–10) | Job |
|---|---|---|---|---|
| **Probe** | 8 + (Logic × Level) | 14 + (Logic × Level) | 20 + (Logic × Level) | Recon / Deep Scan twin. Edge on Scan, Search, or Deep Scan. |
| **Spike** | 12 + (Logic × Level) | 18 + (Logic × Level) | 26 + (Logic × Level) | Intrusion / Integrity strike. Power roll + Logic; low no damage; middle/high 2d10 + Logic (intermediate +1d6; advanced 3d10 + Logic). |
| **Daemon** | 10 + (Logic × Level) | 16 + (Logic × Level) | 22 + (Logic × Level) | System control / Track 1 puppet. Holds a breached maglock, cam, or light and fires its function. |
| **Watchdog** | 10 + (Logic × Level) | 16 + (Logic × Level) | 22 + (Logic × Level) | Defend / Trace scrub. Reduces your own Trace Alert increases; bane on Wired/EW attacks against the Agent (and allies at higher bands). |

**Decompile.** A free maneuver dismisses one Agent or the whole roster (token + Actor). An Agent also decompiles when reduced to **0 Stamina**, and the whole roster decompiles when the encounter ends.

> **Compile Agent** *(Class Feature Signature — 3 Bandwidth, Overlay or Jacked In)*
>
> **Effect:** **Compile** an Agent of your choice (Probe, Spike, Daemon, or Watchdog) if you are under your Agent cap, or **Command** your compiled Agents to move and act. On **high (17+)**, you compile *and* issue a free command in the same action. On **middle (12–16)**, the Agent compiles, or the command resolves, normally. On **low (≤11)**, the Agent manifests unstable (it acts next turn) or a command garbles (Director's call).

> **Decompile Agent** *(Class Feature Signature — free maneuver)*
>
> **Effect:** Dismiss one compiled Agent, or the whole roster. No Bandwidth refund.

> **In Foundry**
> **Use Compile Agent** from the Abilities tab (or press **Compile Agent** on the ability’s Item sheet). Pick Probe / Spike / Daemon / Watchdog, and the matching Summons › Agents Actor drops a token beside you. Overlay or Jacked In is required — Linked warns and refuses. At cap, Use commands the roster without compiling another. **Use Decompile Agent**, the roster ✕, 0 Stamina, or end of encounter removes the token and the world Actor. Agents are not sprites: do not drag a sprite SKU.

### Level 1-10 Progression Table

| Level | Class Features | Perks/Skills | Subclass Features |
|---|---|---|---|
| **1** | Hacking Doctrine (choose subclass) - Bandwidth (heroic resource) - Cyberdeck (Kit choice) - Seize Control (automatic Program) - Deep Scan (automatic Program) - Compile Agent / Decompile Agent - Choose a 3-Cost Program (Ghost Signal) | -- | Subclass passive + subclass triggered action (see subclass tables below) |
| **2** | Choose a 5-Cost Program (Kill Switch) | Perk (choice) | Subclass 2nd-level feature |
| **3** | Ghost Step (feature + ability) - Choose a 7-Cost Program (Failsafe Cascade) | -- | Subclass 3rd-level feature |
| **4** | Exploit the Breach - Improved Cyberdeck (+1 Intrusion Roll Mod / +1 Integrity Damage Bonus at every result band) | Characteristic Increase - Perk (choice) - Skill | -- |
| **5** | Choose a 9-Cost Program (Network Purge) | -- | Subclass 5th-level feature |
| **6** | Dual Boot (feature + Dual Boot Swap ability) | Perk (choice) | Subclass 6th-level feature |
| **7** | Bandwidth Overclock (+1 income, cap 6->8 x Echelon) - Ghost Protocol (feature + Pre-Encounter Sweep ability) | Characteristic Increase - Skill | Subclass 7th-level feature |
| **8** | Choose an 11-Cost Program (Backdoor Override) | Perk (choice) | Subclass 8th-level feature |
| **9** | Root Access (Dual Boot 2/encounter; Improved Cyberdeck bonus becomes +2/+2, replacing the 4th-level values) | -- | Subclass 9th-level feature |
| **10** | Ghost in the Machine (epic capstone, feature + ability) - Infinite Loop (Bandwidth carries between encounters) - Borrowed Access (feature + ability) | Characteristic Increase - Perk (choice) - Skill | -- |

### Core Class Features (Non-Subclass)

- **Ghost Step** (3rd) -- Free Triggered Action, no Bandwidth cost. Trigger: a Track 2 target (ICE, hostile AI, rival decker) targets you directly, OR the Alert Track increases from your own action. Effect: choose one -- immediately use a Maneuver-cost Matrix Verb for free, or cancel the Alert increase entirely (once per encounter).
- **Exploit the Breach** (4th) -- Passive. Whenever your Deep Scan lands a high (17+), the target has a marked exploitable weakness until the end of the encounter (or until re-scanned). The next Track 1/Track 2 Wired-based hit against that target from you or an ally gains an edge, and a Track 2 hit also deals +2 Integrity damage. Only one target can be marked at a time.
- **Improved Cyberdeck** (4th) -- Passive. +1 Intrusion Roll Modifier and +1 Integrity Damage Bonus at every result band, on top of whatever deck you're currently running. Granted by the class, not the deck.
- **Dual Boot** (6th) -- Passive enabling a once-per-encounter Free Triggered Action: apply a second owned deck's Roll Modifier/Damage Bonus to a single Program/Verb/signature roll instead of your equipped deck's, whichever is better. Bandwidth Bonus, Alert Discount, Biofeedback Resistance, Reach, and Ghost Distance are unaffected -- only the roll/damage numbers swap.
- **Bandwidth Overclock** (7th) -- Passive. Base income +1->+2 per turn; cap 6->8 x Echelon.
- **Ghost Protocol** (7th) -- Passive with a pre-encounter Free Triggered use. If you had at least one uninterrupted round of Overlay/Jacked-In access before initiative (GM's call), you and your allies get an edge on your first Power Roll of the encounter, and you may use one free Matrix Verb or Deep Scan before the first turn begins.
- **Root Access** (9th) -- Passive. Dual Boot becomes twice per encounter; Improved Cyberdeck's bonus rises to +2/+2 at every tier (replacing, not stacking with, the 4th-level +1/+1).
- **Ghost in the Machine** (10th, epic capstone) -- Free Triggered Action, once per encounter. Treat any Power Roll you just made as a natural 19 if the actual result was lower -- can turn a low/middle into a guaranteed high (17+), and also triggers the natural-19/20 bonus Bandwidth.
- **Infinite Loop** (10th) -- Passive. Bandwidth no longer fully resets between encounters -- retain Echelon's worth (4 at 10th level) instead of dropping to 0. The first 2 points of cap overflow in a round are retained for one round instead of lost outright.
- **Borrowed Access** (10th) -- Main Action, 3 Bandwidth. Choose an ally within Reach who is Jacked In/Overlaid; they immediately use one Program you know costing 5 Bandwidth or less, using your deck's stats, without spending their own action -- but it costs your Main Action and your Bandwidth.

### Subclass: Disruptor -- *Striker, Damage Amplification*

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

### Subclass: Controller -- *Lockdown, Node Control / Holding* ("The Sysop")

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

Cyberware relevant to the Wired -- from the Matrix & Signals implant category (chrome grades Salvage / Standard / Soft; higher-end implants are gated by Availability — `09-chrome-body-integrity.md`):

- **Sub-Dermal Radio / Ghost Antenna** -- Wired signal-boosting implants.
- **Encephalon / Cerebral Datastore** -- grants +1 Bandwidth/Uptime cap at E3, +2 Logic on Matrix rolls at E4.
- **Simsense Booster / Hot-Sim Adapter** -- sensory/interface boosters for deeper Wired immersion.
- **Signal Ghost** -- signature-masking implant.

Body Integrity (chrome capacity) starts at **20**, as for every living non-Cyborg hero — see `09-chrome-body-integrity.md` for install rules and grades.

---

---

## Stage 2 review checklist (The Hacker)

- [ ] Chassis + heroic resource
- [ ] Signatures / heroic ladders complete enough for v1
- [ ] Subclass names and ladders OK
- [ ] Provisional / invented high-tier content flagged above — keep, cut, or hold?
- [ ] Cross-links needed (Wire / Veil / Machines / Kits)?

**Next:** Batch review, then Species / Kits backlog
