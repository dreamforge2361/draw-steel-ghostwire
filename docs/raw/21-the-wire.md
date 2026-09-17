# The Wire

**RAW status:** draft  
**Sources:** `docs/rulebook/08-hacker.md` (The Wired System; Matrix Verbs), `docs/rulebook/18-wired-foundry.md` (rules only), `docs/rulebook/DS-ALIGNMENT.md` (Node Rating)

---

## The Wired System

The Wired is the network layer every hero can touch. This chapter defines what a node is, the two connection states, the System Stat Card that stats any node, ICE, or hostile Persona, Trace Alert, and the nine Matrix Verbs every hero has. The Hacker (`19-hacker.md`) and Technomancer (`20-technomancer.md`) build on these rules.

### What a Node Is

A **node** is any addressable point in the Wired -- a maglock, a security camera, a corp host, a smartgun's wireless interface, a drone, a vehicle's control bus. Every Program, Matrix Verb, and Hacker ability ultimately targets a node (or a target *through* a node). Nodes come in two flavors for targeting purposes:

- **Track 1** -- objects, systems, and infrastructure: doors, lights, cameras, locks, power grids, vaults, and Wired-connected gear worn or carried by a person (a smartlink, a cyberware wireless interface). Track 1 targets resolve as a single Power Roll with no ongoing health pool -- you breach and act on it in the same activation.
- **Track 2** -- hostile, contested, or "alive" targets: ICE, hostile AI Personas, rival deckers, and any node actively defended by an intelligence fighting back. Track 2 targets have their own **Integrity** pool (see below) and can hit back.

### Connection States: Overlay and Jacked In

You reach a node by first using the **Connect** Matrix Verb (see Matrix Verbs, below) to establish a Persona in the Wired at your current location. Once connected, you exist in one of two connection states, and you can freely switch between them with the **Toggle Connection State** Matrix Verb (no roll, no contest -- your call):

| State | What It Means | Physical Awareness | Power Roll Tradeoff | Biofeedback Exposure |
|---|---|---|---|---|
| **Overlay** | Partial immersion -- your Persona rides alongside your physical senses. You see the Wired layered over the real world (an AR-style heads-up view of nearby nodes, marks, and traffic). | Full -- you can still see, move, speak, and react physically while Overlaid. | **Bane on real-world (physical) Power Rolls** -- the AR overlay is a genuine distraction competing for your attention with whatever's happening in front of you. No modifier either way on Wired Power Rolls. | Reduced. Biofeedback damage while Overlaid is treated as **wireless/wired-direct exposure**: half the node's listed Biofeedback value (round down, minimum 1). |
| **Jacked In** | Full immersion -- your Persona *is* your primary presence, and your body goes inert and exposed in the physical world (the reason your crew guards your body while you're under). | None. You cannot perceive, move, or act in the physical world while Jacked In, and you're an easy physical target. | **Edge on all Wired Power Rolls** -- full immersion sharpens every Matrix Verb, Program, and Wired-based signature ability. You cannot make real-world Power Rolls at all while Jacked In (no physical awareness means no physical action to roll for), and you cannot perceive or interact with the physical world in any way. | Full. Biofeedback damage while Jacked In is multiplied **x1.5 (round up)** against the node's listed Biofeedback value -- the tradeoff for full-immersion speed and power. |

Some Programs, features, and abilities (Ghost Protocol, Chokepoint, Borrowed Access, Failsafe Cascade, Wired Guard, and others) explicitly require you or an ally to be "Jacked In or Overlaid" -- meaning either connection state satisfies the requirement, as opposed to being fully disconnected. A handful of higher-tier features (Anchor Point, Emergency Patch's biofeedback-cancel clause) key specifically off **Jacked In** alone, since they're addressing the higher-risk state directly.

**Ruling:** Overlay and Jacked In are a genuine mechanical tradeoff, not just a fiction toggle. **Overlaid**, you keep both worlds live but pay a **bane on real-world Power Rolls** for the split attention -- you're fighting (or talking, or driving) with half your head somewhere else. **Jacked In**, you gain an **edge on all Wired Power Rolls** (every Matrix Verb, Program, and Wired-based signature ability gets sharper), but you lose the real world entirely -- no physical perception, no physical action, nothing to roll for on that side at all. This is why the crew treats a Jacked-In Hacker's body as cargo to protect: it isn't just fictionally vulnerable, it's mechanically undefended and unable to act. **Toggle Connection State** (free, no roll) is the tool for choosing which tradeoff you want turn to turn.

You leave either connection state with the **Jack Out** Matrix Verb -- a clean disconnect that also serves as your emergency eject if a Program or Trace Alert spike goes bad.

### Wired-System Stats: Integrity (Not Body Integrity)

Every Track 2 target -- and the "system" side of any Wired encounter -- tracks its own **Integrity**: a Stamina-equivalent health pool that Programs and abilities damage directly (via your cyberdeck's Integrity Damage Bonus) rather than dealing physical damage. Reducing a Track 2 target to 0 Integrity takes it down, exactly as reducing a creature to 0 Stamina does.

**Do not confuse this with Body Integrity** (`09-chrome-body-integrity.md`). They share a name but are different systems: Body Integrity is a permanent capacity for how much chrome a living hero can carry; Wired-system Integrity is an encounter-scoped health pool belonging to nodes, ICE, hostile Personas, and rival deckers.

| Node Rating | Integrity |
|---|---|
| Rating 1 (street-grade) | 12 |
| Rating 2 | 18 |
| Rating 3 | 26 |
| Rating 4 | 36 |
| Rating 5 (alpha/AAA-corp core) | 50 |

The same Integrity table scales ICE, hostile AI Personas, and rival-decker Track 2 targets by Node Rating.

**Biofeedback bleed-through:** some hits carry an "Integrity-to-Stamina biofeedback bleed-through" clause (see Failsafe Cascade, Emergency Patch, Anchor Point) -- this is the mechanism by which damage done to a *node's* Integrity can bleed back into a *Hacker's own* Stamina, gated by your cyberdeck's Biofeedback Resistance stat and your connection state (see the table above).

### System Stat Card -- The Universal Template for Nodes, ICE, and Systems

Every node, system, ICE construct, hostile AI Persona, or rival decker in the Wired is built from the same stats. The Director fills in this card for any Track 1 object or Track 2 target on the fly — every number is keyed off a single input, the target's **Node Rating** (**1** = street-grade / weakest → **5** = alpha-corp / strongest). Node Rating is a **system defense grade**, not a character level or echelon.

| Stat | Applies To | What It Represents | How It's Calculated |
|---|---|---|---|
| **Node Rating** | Both Tracks | The target's overall Wired defense grade (Rating **1–5**) -- the single input that sets every other stat on this card. | A Director-assigned Rating reflecting how well-defended/valuable the system is (street-grade lock = **Rating 1**; alpha-corp core = **Rating 5**). Not a character tier. Everything below reads off this one number. |
| **Node Description** | Both Tracks | The node's aesthetic -- often artistic and stylized to brand the System, and represented in the Wired by a holographic icon or similar visual signature (a corp's sigil rendered as a floating glyph, a black-market host skinned like a snarling dog, a government node as a flat gray monolith). Pure flavor, no mechanical effect -- but it's how a Hacker (and the table) actually *sees* a node before touching it. | Director/Session-defined per node, not Rating-derived like the other rows -- describe it to match the node's owner, purpose, and reputation. No formula; this is narrative color layered on top of the mechanical stats above. |
| **Breach DC** *(optional flat-target alternative)* | Both Tracks | How hard the node is to force entry into, for tables that want a quick binary pass/fail instead of reading the full Power Roll result. | Fixed by Node Rating: **R1 DC10 · R2 DC12 · R3 DC15 · R4 DC17 · R5 DC19.** The primary resolution is still the Power Roll result (low / middle / high) -- this DC is a shortcut for trivial nodes only. |
| **ICE Layer(s)** | Track 2 (defines what's actively fighting back) | The node's active defenses -- how many layers of passive/active ICE stand between you and full access, and whether black ICE (the kind that bites back with biofeedback) is present. | Fixed by Node Rating: **R1** 1 passive layer · **R2** 2 passive layers · **R3** passive + 1 active ICE · **R4** passive + 2 active ICE, biofeedback on a failed breach · **R5** full active ICE suite + automatic counter-trace on any high (17+) roll against it. |
| **Integrity** | Track 2 (Track 1 has none -- see note below) | The target's health pool -- the Stamina-equivalent number that Programs and abilities whittle down via your cyberdeck's Integrity Damage Bonus. Reaching 0 takes the target down. | Fixed by Node Rating: **R1** 12 · **R2** 18 · **R3** 26 · **R4** 36 · **R5** 50. |
| **Biofeedback Value** | Track 2 (the damage that can bleed back to *you*) | The raw Stamina damage a hostile hit (black ICE, catastrophic failure) deals back through your deck into your own body if it connects. | Fixed by Node Rating: **R1** 3 · **R2** 5 · **R3** 8 · **R4** 13 · **R5** 22. Then scaled by **your own connection state** (see Connection States table, above): **x0.5 round down, min 1** if Overlaid · **x1** if wired-direct · **x1.5 round up** if Jacked In. Finally reduced by your cyberdeck's **Biofeedback Resistance** stat before it hits your Stamina. |
| **Alert Contribution** | Both Tracks | How much heat interacting with this target generates -- not a separate number of its own, but a reminder that every Track 1/Track 2 interaction feeds the *same* 12-step Trace Alert track (see below), regardless of Rating. Higher-Rating targets don't push Alert up faster per hit, but their tougher Integrity/ICE means you're rolling against them -- and risking low (≤11) results -- more times per encounter. | Not Rating-scaled on its own. Governed entirely by the Trace Alert rules below (Power Roll result of your roll, not the target's Node Rating, decides whether Alert moves). |

**Track 1 note:** Track 1 objects and systems (doors, cameras, locks, a person's smartlink) use only **Node Rating**, **Node Description**, **Breach DC**, and **Alert Contribution** from this card -- they resolve as a single Power Roll with no ongoing Integrity pool and no ICE layers of their own (per the Wired System's "What a Node Is" section, above). A Track 1 target is breached and acted on in the same activation; there's nothing left to "reduce to 0."

**Track 2 note:** Track 2 targets (ICE, hostile AI Personas, rival deckers, and any actively-defended node) use the full card -- Node Rating, Node Description, Breach DC, ICE Layers, Integrity, Biofeedback Value, and Alert Contribution all apply. This is the template a Director uses to stat up any hostile Wired presence on the fly: pick a Node Rating (1–5), and all five downstream numbers are already fixed by the table.

**Worked example -- statting a Rating 3 corp host (Track 2) on the fly:** Node Rating 3 -> Breach DC 15 (optional) -> ICE Layers: passive + 1 active ICE -> Integrity 26 -> Biofeedback Value 8 (x1.5 = 12, round up, if a Hacker gets hit while Jacked In, before that Hacker's own Biofeedback Resistance reduces it further) -> Alert Contribution: governed by the standard Trace Alert rules on every roll against it, same as any other target.

### Trace Alert: Definition and Escalation

**Trace Alert** (referred to on some abilities simply as "the Alert Track") is the Wired system's rising detection meter -- the mechanical spine of "the longer you're in, the worse it gets." It is tracked per hostile node/host, on a **12-step track**:

| Alert Steps | Effect |
|---|---|
| **1-4** | No mechanical effect yet -- flavor only. Passive ICE stirs, but nothing bites. |
| **5-8** | **+1 Malice to the Director per step crossed** (cumulative) -- rising Alert directly feeds the Director's Malice pool, the same "heat" engine used in physical combat. |
| **9-11** | As above, plus a **bane on your next Wired Power Roll** -- active ICE is actively hunting you now. |
| **12 (max)** | **Full lockout** and a **hard counter-trace to your physical location** (security, corp response, or a hostile decker's own crew is now inbound on your real-world position) -- then the track **resets to step 6**, not to 0. A maxed-out host never fully forgets you found it. |

**When does Trace Alert increase?** Using the Power Roll result bands (**low** ≤11 = something goes wrong; **high** 17+ = clean success — see Matrix Verbs), Trace Alert typically increases on:

- **A low (≤11) result** on a Wired Power Roll (Matrix Verb, Program, or signature ability) -- this is the standard trigger referenced throughout Wired ability text (e.g., Ghost Signal low, Kill Switch low, Network Purge low, Backdoor Override's normal-use low).
- **Certain middle (12–16) results** on specific Programs where the ability text says so explicitly (most Hacker Programs do NOT raise Alert on middle -- check each ability; low is the default trigger unless stated otherwise).
- **Direct triggers named on an ability**, independent of Power Roll result -- for example, Ghost Signal's Alert Track increase is a low-result-specific clause, while some Trigger conditions (like Ghost Step's own trigger condition) fire *off of* an Alert increase happening, rather than causing one.
- **Noisy or hostile action against a Track 2 target** in general.

**What does NOT increase Trace Alert:**

- **High (17+) results** are always clean on Alert -- no increase, and several abilities (Ghost the Log-equivalent effects, Backdoor Override's Track 2 application) explicitly zero out Alert gain entirely as their signature payoff.
- **Backdoor Override** (11 Bandwidth) is explicitly written so its Track 2 application "does not increase from this use at all -- the intrusion leaves no trace," making it the cleanest high-cost Program in the kit.
- Passive observation (Scan, Deep Scan) does not raise Alert on its own -- only active intrusion, contested, or hostile verbs do.

**Managing Trace Alert.** The Hacker has dedicated tools to actively lower or freeze the track rather than just avoid raising it (see `19-hacker.md`):

- **Ghost Step** (3rd level) -- as a Free Triggered Action, when the Alert Track increases from your own action, you may cancel that specific increase entirely (once per encounter).
- Higher-level Hacker Programs and capstone features extend this further, up to freezing the Alert Track for the whole crew.

**What happens as Trace Alert climbs, narratively:** early steps (1-4) are pure atmosphere -- the Director may narrate a light flicker, a camera pausing a beat too long. Mid steps (5-8) start actively feeding the encounter's Malice budget, meaning the enemy side of the table gets more resources to spend against the whole party, not just the Hacker. Late steps (9-11) mean the Wired system itself is now actively working against the Hacker specifically (banes on their own rolls). Step 12 breaks containment entirely -- the fight stops being confined to the Wired and becomes a physical-world problem (security teams, a corp strike, a hostile decker's crew arriving at your real location), which is exactly why the rest of the crew has a stake in watching the clock too.

## Matrix Verbs (Universal)

These 9 abilities aren't unique to the Hacker -- *any* hero with a commlink or cyberdeck has them. They're the baseline vocabulary of doing anything in the Wired. All 9 cost exactly 1 Maneuver. Two are automatic (no roll); the other seven are genuine Power Rolls, and **having the Hacking skill grants an edge on all seven** (instead of the usual skill bonus on tests).

| Verb | What It Lets You Do | Roll Characteristic | Roll? | High (17+) Bonus |
|---|---|---|---|---|
| **Connect** | Plug your Persona into the Wired at your current location -- the on-ramp for everything else on this list. Without a successful Connect, you're not Jacked In/Overlaid and can't use the other verbs, Programs, or Wired-based abilities that require that state. | Instinct | Yes | Refunds the Maneuver |
| **Jack Out** | Disconnect cleanly from the Wired and return your full attention to the physical world -- your emergency eject button when things go wrong on the Wired side (biofeedback spikes, hostile ICE lock-on). Also usable as a Free Triggered Action in a genuine emergency, on top of its normal Maneuver use. | Instinct | Yes (also usable as a Free Triggered Action in an emergency, layered on top of the Maneuver cost) | Refunds the Maneuver |
| **Toggle Connection State** | Switch your own head-space between Overlay (partial awareness, still present physically) and Jacked In (full immersion, more vulnerable) without disconnecting entirely. No contest involved -- it's your call, always. | -- | No -- automatic | -- |
| **Scan** | Get a read on what Nodes exist near you within Reach -- doors, cameras, locks, drones, any Wired-connected system in range. This is your general-purpose "what's here" check before deciding what to touch. | Instinct | Yes | Refunds the Maneuver |
| **Navigate** | Move through the Wired itself, up to your Reach in Nodes -- the Matrix-side equivalent of physical movement, letting you reposition to reach a node, ally, or target you couldn't otherwise touch. | Instinct | Yes | Refunds the Maneuver |
| **Ping** | Give a simple, low-stakes nudge to one simple Track 1 object within Reach -- flick a light, tap a lock, test a system -- without needing a cyberdeck or a full Program. The lightest-weight way to interact with a system. | Logic | Yes | Refunds the Maneuver |
| **Broadcast** | Send a message to allies you're already connected to, within Reach or Ghost Distance -- a private, Wired-only comms channel no one outside the link can intercept. No contest involved; it just works. | -- | No -- automatic | -- |
| **Search** | Dig into a node you're already at to find something specific hiding inside it -- the follow-up to Scan (which tells you what's around) when you need to know what's buried in one particular place. | Logic | Yes | Refunds the Maneuver + extra intel |
| **Read/Write** | The core data-manipulation verb -- read a file's contents, alter a record, plant or delete evidence, forge a credential. This is the verb that actually changes information in the Wired, rather than just observing or moving through it. | Logic | Yes | Leaves **zero forensic trace** (does NOT refund the Maneuver -- this verb trades the refund for a clean exit instead) |

**Low (≤11)** on any rolling verb generally means "it works, but something goes wrong" — usually an Alert Track increase. **Middle (12–16)** is a clean success. **High (17+)** is a clean success plus the bonus listed above.

## Connection-state modifiers (summary)

| State | Wired abilities (Wired keyword) | Real-world abilities and tests |
|---|---|---|
| Disconnected | Only **Connect** can be used | Normal |
| Overlay | Normal | **Bane** |
| Jacked In | **Edge** | Can’t be used (body inert) |

- **Connect** works only while Disconnected and puts you in **Overlay** on any result.
- **Toggle Connection State** (connected only) switches Overlay ↔ Jacked In.
- **Jack Out** (connected only) returns you to Disconnected.
- Every other Matrix Verb requires a connection.
- Having the **Hacking** skill gives an edge on every rolling Matrix Verb and other Wired ability.

## Director tools

Tables running Ghostwire in Foundry VTT can track nodes, Node Rating stat cards, Integrity, reveal state, and Trace Alert in the Wired Console. Its rules are the ones in this chapter; its operation is described in the module’s Foundry notes, not here.
