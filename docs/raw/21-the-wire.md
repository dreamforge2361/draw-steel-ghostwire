# The Wire

**RAW status:** locked (2026-09-18, B66; Wire Atlas B116 2026-09-20)  
**Sources:** `docs/rulebook/08-hacker.md` (The Wired System; Matrix Verbs), `docs/masters/GHOSTWIRE_WIRE_SOFTWARE_DOCTRINE.md` + `docs/masters/GHOSTWIRE_GEAR_MASTER.md` §4B/§4C (Deck software), `docs/rulebook/18-wired-foundry.md` (rules only), `docs/rulebook/DS-ALIGNMENT.md` (Node Rating), `docs/spikes/B116-WIRE-ATLAS.md` (topology), shipped Foundry B23/B32/B51 (Overlay / Jacked In, node Rating 1–5, suites vs payloads, Connected gate)

---

## The Wired System

The Wired is the network layer every hero can touch. This chapter defines what a node is, the two connection states (**Overlay** and **Jacked In**), the System Stat Card (Node Rating **1–5**), Trace Alert, the **Wire Atlas** (how scenes nest), and the nine **Matrix Verbs** every hero has. Deck software (**suites** vs **payloads**) lives here too. The Hacker (`19-hacker.md`) adds Bandwidth and Programs; the Technomancer (`20-technomancer.md`) builds on the same Wire spine.

### What a Node Is

A **node** is any addressable point in the Wired -- a maglock, a security camera, a corp host, a smartgun's wireless interface, a drone, a vehicle's control bus. Every Program, Matrix Verb, and Hacker ability ultimately targets a node (or a target *through* a node). Nodes come in two flavors for targeting purposes:

- **Track 1** -- objects, systems, and infrastructure: doors, lights, cameras, locks, power grids, vaults, and Wired-connected gear worn or carried by a person (a smartlink, a cyberware wireless interface). Track 1 targets resolve as a single Power Roll with no ongoing health pool -- you breach and act on it in the same activation.
- **Track 2** -- hostile, contested, or "alive" targets: ICE, hostile AIs, rival deckers, and any node actively defended by an intelligence fighting back. Track 2 targets have their own **Integrity** pool (see below) and can hit back.

### Connection States: Overlay and Jacked In

You reach a node by first using the **Connect** Matrix Verb (see Matrix Verbs, below) to establish your **avatar** — your presence in the Wired — at your current location. Once connected, you exist in one of two connection states, and you can freely switch between them with the **Toggle Connection State** Matrix Verb (no roll, no contest -- your call):

| State | What It Means | Physical Awareness | Power Roll Tradeoff | Biofeedback Exposure |
|---|---|---|---|---|
| **Overlay** | Partial immersion -- your avatar rides alongside your physical senses. You see the Wired layered over the real world (an AR-style heads-up view of nearby nodes, marks, and traffic). | Full -- you can still see, move, speak, and react physically while Overlaid. | **Bane on real-world (physical) Power Rolls** -- the AR overlay is a genuine distraction competing for your attention with whatever's happening in front of you. No modifier either way on Wired Power Rolls. | Reduced. Biofeedback damage while Overlaid is **half** the node's listed Biofeedback value (round down, minimum 1). |
| **Jacked In** | Full immersion -- your avatar *is* your primary presence, and your body goes inert and exposed in the physical world (the reason your crew guards your body while you're under). | None. You cannot perceive, move, or act in the physical world while Jacked In, and you're an easy physical target. | **Edge on all Wired Power Rolls** -- full immersion sharpens every Matrix Verb, Program, and Wired-based signature ability. You cannot make real-world Power Rolls at all while Jacked In (no physical awareness means no physical action to roll for), and you cannot perceive or interact with the physical world in any way. | Full. Biofeedback damage while Jacked In is multiplied **x1.5 (round up)** against the node's listed Biofeedback value -- the tradeoff for full-immersion speed and power. |

Some Programs, features, and abilities (Ghost Protocol, Chokepoint, Borrowed Access, Failsafe Cascade, Wired Guard, and others) explicitly require you or an ally to be "Jacked In or Overlaid" -- meaning either connection state satisfies the requirement, as opposed to being fully disconnected. A handful of higher-echelon features (Anchor Point, Emergency Patch's biofeedback-cancel clause) key specifically off **Jacked In** alone, since they're addressing the higher-risk state directly.

**Ruling:** Overlay and Jacked In are a genuine mechanical tradeoff, not just a fiction toggle. **Overlaid**, you keep both worlds live but pay a **bane on real-world Power Rolls** for the split attention -- you're fighting (or talking, or driving) with half your head somewhere else. **Jacked In**, you gain an **edge on all Wired Power Rolls** (every Matrix Verb, Program, and Wired-based signature ability gets sharper), but you lose the real world entirely -- no physical perception, no physical action, nothing to roll for on that side at all. This is why the crew treats a Jacked-In Hacker's body as cargo to protect: it isn't just fictionally vulnerable, it's mechanically undefended and unable to act. **Toggle Connection State** (free, no roll) is the tool for choosing which tradeoff you want turn to turn.

You leave either connection state with the **Jack Out** Matrix Verb -- a clean disconnect that also serves as your emergency eject if a Program or Trace Alert spike goes bad.

> **In Foundry**
> **Overlay** and **Jacked In** are token/sheet status effects (`ghostwire-overlay` / `ghostwire-jacked-in`). Use **Connect**, **Toggle Connection State**, and **Jack Out** Matrix Verbs from the sheet — they set the status. The hero sheet **Stats** tab shows a read-only Wired state under Body Integrity. The module applies Jacked In Wired edges, Overlay real-world banes, and refuses physical Power Rolls while Jacked In.


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

The same Integrity table scales ICE, hostile AIs, and rival-decker Track 2 targets by Node Rating.

> **In Foundry**
> Open the **Wired Console** from the Token scene-control tools (network icon) or a keybinding under Configure Controls. Directors edit Scene-tied boards: nodes, Rating 1–5 templates, Integrity, Trace Alert, reveal, and **node↔node wires** (B41b). Players open the **Wired node** facing them (token / node panel) to fire all nine Matrix Verbs — **Connect**, **Jack Out**, **Toggle Connection State**, **Scan**, **Ping**, **Navigate**, **Broadcast**, **Search**, **Read/Write**. The roll uses that runner (Instinct / Logic, Hacking, Jacked In, Reader). The Director Console still shows the board and roster (and can fire the same verbs). The **Wired minimap** auto-opens when you own an Overlay or Jacked In actor (compact Overlay / larger Jacked In); click a revealed node to open its verb panel.


**Biofeedback bleed-through:** some hits carry an "Integrity-to-Stamina biofeedback bleed-through" clause (see Failsafe Cascade, Emergency Patch, Anchor Point) -- this is the mechanism by which damage done to a *node's* Integrity can bleed back into a *Hacker's own* Stamina, gated by your cyberdeck's Biofeedback Resistance stat and your connection state (see the table above).

### System Stat Card -- The Universal Template for Nodes, ICE, and Systems

Every node, system, ICE construct, hostile AI, or rival decker in the Wired is built from the same stats. The Director fills in this card for any Track 1 object or Track 2 target on the fly — every number is keyed off a single input, the target's **Node Rating** (**1** = street-grade / weakest → **5** = alpha-corp / strongest). Node Rating is a **system defense grade**, not a character level or echelon.

| Stat | Applies To | What It Represents | How It's Calculated |
|---|---|---|---|
| **Node Rating** | Both Tracks | The target's overall Wired defense grade (Rating **1–5**) -- the single input that sets every other stat on this card. | A Director-assigned Rating reflecting how well-defended/valuable the system is (street-grade lock = **Rating 1**; alpha-corp core = **Rating 5**). Not a character level or echelon. Everything below reads off this one number. |
| **Node Description** | Both Tracks | The node's aesthetic -- often artistic and stylized to brand the System, and represented in the Wired by a holographic icon or similar visual signature (a corp's sigil rendered as a floating glyph, a black-market host skinned like a snarling dog, a government node as a flat gray monolith). Pure flavor, no mechanical effect -- but it's how a Hacker (and the table) actually *sees* a node before touching it. | Director/Session-defined per node, not Rating-derived like the other rows -- describe it to match the node's owner, purpose, and reputation. No formula; this is narrative color layered on top of the mechanical stats above. |
| **Breach difficulty** *(optional shortcut)* | Both Tracks | How hard the node is to force entry into, for tables that want a quick difficulty call instead of reading the full Power Roll result. | Fixed by Node Rating: **R1 easy · R2 easy with a bane · R3 medium · R4 hard · R5 hard with a bane.** The primary resolution is still the Power Roll result (low / middle / high) — this shortcut is for trivial nodes only. |
| **ICE Layer(s)** | Track 2 (defines what's actively fighting back) | The node's active defenses -- how many layers of passive/active ICE stand between you and full access, and whether black ICE (the kind that bites back with biofeedback) is present. | Fixed by Node Rating: **R1** 1 passive layer · **R2** 2 passive layers · **R3** passive + 1 active ICE · **R4** passive + 2 active ICE, biofeedback on a failed breach · **R5** full active ICE suite + automatic counter-trace on any high (17+) roll against it. |
| **Integrity** | Track 2 (Track 1 has none -- see note below) | The target's health pool -- the Stamina-equivalent number that Programs and abilities whittle down via your cyberdeck's Integrity Damage Bonus. Reaching 0 takes the target down. | Fixed by Node Rating: **R1** 12 · **R2** 18 · **R3** 26 · **R4** 36 · **R5** 50. |
| **Biofeedback Value** | Track 2 (the damage that can bleed back to *you*) | The raw Stamina damage a hostile hit (black ICE, catastrophic failure) deals back through your deck into your own body if it connects. | Fixed by Node Rating: **R1** 3 · **R2** 5 · **R3** 8 · **R4** 13 · **R5** 22. Then scaled by **your own connection state** (only two states — see Connection States table, above): **×0.5 round down, min 1** if Overlaid · **×1.5 round up** if Jacked In. There is no third connection mode and no ×1 “wired-direct” multiplier. Finally reduced by your cyberdeck's **Biofeedback Resistance** stat before it hits your Stamina. |
| **Alert Contribution** | Both Tracks | How much heat interacting with this target generates -- not a separate number of its own, but a reminder that every Track 1/Track 2 interaction feeds the *same* 12-step Trace Alert track (see below), regardless of Rating. Higher-Rating targets don't push Alert up faster per hit, but their tougher Integrity/ICE means you're rolling against them -- and risking low (≤11) results -- more times per encounter. | Not Rating-scaled on its own. Governed entirely by the Trace Alert rules below (Power Roll result of your roll, not the target's Node Rating, decides whether Alert moves). |

**Track 1 note:** Track 1 objects and systems (doors, cameras, locks, a person's smartlink) use only **Node Rating**, **Node Description**, **Breach difficulty**, and **Alert Contribution** from this card -- they resolve as a single Power Roll with no ongoing Integrity pool and no ICE layers of their own (per the Wired System's "What a Node Is" section, above). A Track 1 target is breached and acted on in the same activation; there's nothing left to "reduce to 0."

**Track 2 note:** Track 2 targets (ICE, hostile AIs, rival deckers, and any actively-defended node) use the full card -- Node Rating, Node Description, Breach difficulty, ICE Layers, Integrity, Biofeedback Value, and Alert Contribution all apply. This is the template a Director uses to stat up any hostile Wired presence on the fly: pick a Node Rating (1–5), and all five downstream numbers are already fixed by the table.

**Worked example -- statting a Rating 3 corp host (Track 2) on the fly:** Node Rating 3 -> Breach difficulty medium (optional) -> ICE Layers: passive + 1 active ICE -> Integrity 26 -> Biofeedback Value 8 (x1.5 = 12, round up, if a Hacker gets hit while Jacked In, before that Hacker's own Biofeedback Resistance reduces it further) -> Alert Contribution: governed by the standard Trace Alert rules on every roll against it, same as any other target.

### Trace Alert: Definition and Escalation

**Trace Alert** (called "the Alert Track" on some abilities) is the Wired system's rising detection meter — the longer you stay in a hostile host, the worse it gets. Track it **per hostile node/host** on a **12-step track**:

| Alert Steps | Effect |
|---|---|
| **1–4** | No mechanical effect yet — flavor only. Passive ICE stirs, but nothing bites. |
| **5–8** | **+1 Malice to the Director per step crossed** (cumulative) — rising Alert feeds the Director's Malice pool, the same heat engine used in physical combat. |
| **9–11** | As above, plus a **bane on your next Wired Power Roll** — active ICE is hunting you. |
| **12 (max)** | **Full lockout** and a **hard counter-trace to your physical location** (security, corp response, or a rival decker's crew inbound on your real-world position) — then the track **resets to step 6**, not to 0. A maxed-out host never fully forgets you found it. |

#### Default Alert by Power Roll result (locked)

Unless an ability's printed text says otherwise, every Wired Power Roll (Matrix Verb, Program, payload Run, or Wired signature ability) uses these Alert defaults:

| Result | Trace Alert (default) |
|---|---|
| **Low (≤11)** | **+1** to that host's Trace Alert. The verb or Program still usually works, but something goes wrong — logs notice you, ICE twitches, the host marks the intrusion. |
| **Middle (12–16)** | **No Alert increase.** Clean success. Middle never raises Trace Alert by default. |
| **High (17+)** | **No Alert increase.** Always clean on Alert. Some abilities also erase Alert that would have risen, or leave zero forensic trace, as their high payoff. |

**Ability text can override the middle default** — only when it explicitly says the middle result raises Alert (or raises it by more than one). Most Hacker Programs do **not**; check each card. Low remains the default trigger unless stated otherwise.

**Other Alert movers (not a second tax):**

- **Direct triggers** named on an ability, independent of the Power Roll band (rare; follow the card).
- Triggered features that fire *when* Alert rises (e.g. Ghost Step) — they react to an increase; they do not cause one by themselves.
- There is **no separate “noisy Track 2” Alert tax** beyond the roll result. Hostile or contested rolls still use the table above; Track 2 just means you may roll more times against Integrity/ICE, so low results (and Alert) come up more often in practice.

**What never raises Alert by itself:**

- **High (17+) results** — always clean on Alert.
- Ability clauses that zero Alert gain entirely (example: **Backdoor Override**'s Track 2 application leaves no trace).
- Pure observation verbs that only look (**Scan**; class Deep Scan) — they do not raise Alert on their own. Active intrusion, contested, or hostile verbs use the defaults above.

**Managing Trace Alert.** The Hacker has tools to lower or freeze the track rather than only avoid raising it (see `19-hacker.md`):

- **Ghost Step** (3rd level) — as a Free Triggered Action, when the Alert Track increases from your own action, cancel that specific increase (once per encounter).
- Higher-level Hacker Programs and capstone features extend this further, up to freezing the Alert Track for the whole crew.

**As the track climbs:** steps 1–4 are atmosphere (a light flicker, a camera pausing a beat too long). Steps 5–8 feed the encounter's Malice budget — the whole table feels the heat, not just the runner. Steps 9–11 put banes on the runner's Wired rolls. Step 12 breaks containment: the fight leaves the Wired and becomes a meatspace problem, which is why the rest of the crew watches the clock too.

## Matrix Verbs (Universal)

These 9 abilities aren't unique to the Hacker -- *any* hero with a commlink or cyberdeck has them. They're the baseline vocabulary of doing anything in the Wired. All 9 cost exactly 1 Maneuver. Two are automatic (no roll); the other seven are genuine Power Rolls, and **having the Hacking skill grants an edge on all seven** (instead of the usual skill bonus on tests).

| Verb | What It Lets You Do | Roll Characteristic | Roll? | High (17+) Bonus |
|---|---|---|---|---|
| **Connect** | Plug your avatar into the Wired at your current location -- the on-ramp for everything else on this list. Without a successful Connect, you're not Jacked In/Overlaid and can't use the other verbs, Programs, or Wired-based abilities that require that state. | Instinct | Yes | Refunds the Maneuver |
| **Jack Out** | Disconnect cleanly from the Wired and return your full attention to the physical world -- your emergency eject button when things go wrong on the Wired side (biofeedback spikes, hostile ICE lock-on). Also usable as a Free Triggered Action in a genuine emergency, on top of its normal Maneuver use. | Instinct | Yes (also usable as a Free Triggered Action in an emergency, layered on top of the Maneuver cost) | Refunds the Maneuver |
| **Toggle Connection State** | Switch your own head-space between Overlay (partial awareness, still present physically) and Jacked In (full immersion, more vulnerable) without disconnecting entirely. No contest involved -- it's your call, always. | -- | No -- automatic | -- |
| **Scan** | Get a read on what Nodes exist near you within Reach -- doors, cameras, locks, drones, any Wired-connected system in range. This is your general-purpose "what's here" check before deciding what to touch. | Instinct | Yes | Refunds the Maneuver |
| **Navigate** | Move through the Wired itself, up to your Reach in Nodes -- the Matrix-side equivalent of physical movement, letting you reposition to reach a node, ally, or target you couldn't otherwise touch. | Instinct | Yes | Refunds the Maneuver |
| **Ping** | Give a simple, low-stakes nudge to one simple Track 1 object within Reach -- flick a light, tap a lock, test a system -- without needing a cyberdeck or a full Program. The lightest-weight way to interact with a system. | Logic | Yes | Refunds the Maneuver |
| **Broadcast** | Send a message to allies you're already connected to, within Reach or Ghost Distance -- a private, Wired-only comms channel no one outside the link can intercept. No contest involved; it just works. | -- | No -- automatic | -- |
| **Search** | Dig into a node you're already at to find something specific hiding inside it -- the follow-up to Scan (which tells you what's around) when you need to know what's buried in one particular place. | Logic | Yes | Refunds the Maneuver + extra intel |
| **Read/Write** | The core data-manipulation verb -- read a file's contents, alter a record, plant or delete evidence, forge a credential. This is the verb that actually changes information in the Wired, rather than just observing or moving through it. | Logic | Yes | Leaves **zero forensic trace** (does NOT refund the Maneuver -- this verb trades the refund for a clean exit instead) |

**Low (≤11)** on any rolling verb generally means “it works, but something goes wrong” — by default **+1 Trace Alert** (see Trace Alert defaults above). **Middle (12–16)** is a clean success with **no Alert increase**. **High (17+)** is a clean success plus the bonus listed above, and never raises Alert.

## Wire Atlas / topology

Device tokens answer **what is this socket**. Atlas tokens answer **where am I on the Wire map**. Directors place atlas tokens by hand. Room-scale auto-nodes (lights, maglocks) never appear on a district or facility graph.

### Three altitudes

| Altitude | Scene example | Token family |
|---|---|---|
| **Region / district graph** | Switchboard district map | **Relay**, **Host** |
| **Site / facility graph** | Power Company Wire scene | **Segment** (+ **Host** as the site root) |
| **Room / device graph** | Office, Gold Line car, maintenance room | **Device** (existing library: Light, Maglock, Cam, ICE, …) |

Ghostwire words: **Relay**, **Host**, **Segment**, **Endpoint**, **Device**. Do not call a Host a “server farm” in player text.

### Reach is hops on the current scene

**Scan** and **Navigate** **Reach** is a number of **node-hops on the graph of the Scene you are on**, not the whole district and not Ossian Reach the campaign region. When the crew changes altitude (district → facility → room), Reach recounts from the new graph. A runner with Reach 2 on the Switchboard district map can hop two Relays/Hosts; they cannot see the Power Co substation or a maintenance-room maglock until that scene is loaded.

### Relay vs Host vs Segment

| Token | Role | Rules hook |
|---|---|---|
| **Relay** | Major Wired highway / backbone traffic — a **path**, not a place | Navigate along it. Trace can travel fast on a Relay. Usually **not** Seize-for-loot. Node Rating is optional (traffic density). Track 1 unless something is hunting the backbone. |
| **Host** | Destination place (corp, civic, street). Faction is name and color, not a new token type. | May have Node Rating, ICE, Watchdog. Entering a Host **may change scene** (load the facility graph). |
| **Segment** | Child of a Host (substation, wing, server hall) | Same mechanical class as Host, nested. **Name includes the parent** (`Power Co — North Substation`). |
| **Endpoint** *(optional v1.1)* | Dig-down leaf that opens a meatspace room | Not a fourth mechanical class. Until its own art exists, reuse Host with a depth pip. |
| **Device** | Room socket: Light, Maglock, Cam, ICE, … | **Room-only.** Never place device tokens on a region graph. |

### Dig-down procedure

1. **District scene:** place **Relays** and **Hosts** only.
2. **Enter Host** (Navigate, Seize, or story) → load the **facility** scene; place **Segments**. The Host may remain as the site root.
3. **Enter Segment** (or Endpoint) → load the **room** scene; place **Device** tokens. Auto-nodes from named lights and doors belong here.
4. Auto-nodes stay **room-scale only**. Atlas tokens are Director-placed (a Console picker is later).

### Worked example — Switchboard to the maintenance room

**District (Switchboard).** Relays: Flats Backbone, Melt Market Trunk. Hosts: Power Co, Cassavir’s Booth. No devices.

**Facility (Power Co).** Site-root Host: Power Co. Segments: **Power Co — North Substation**, Power Co — South Bay. Reach is hops among these, not back to the district Relays.

**Room (North Substation maintenance).** Devices: `North Substation - Light Control`, `North Substation - Maglock Door 1`. This is the only altitude where auto-nodes and the eight device styles belong.

> **In Foundry**
> Atlas styles are `node-relay` / `node-host` / `node-segment` under `assets/tokens/wired/` (catalog in `library.json`). Art is drop-in; placeholders ship until Michael tokens land. Device styles (Light Control, Maglock) stay room-scale. Do not run Gold Line `{ force: true }` to place atlas tokens. Console operation: `docs/rulebook/18-wired-foundry.md`. Spike: `docs/spikes/B116-WIRE-ATLAS.md`.

## Connection-state modifiers (summary)

**Connected** means you are in **Overlay** or **Jacked In**. **Disconnected** means neither. Payload Runs and many Wired features require Connected; Matrix Verbs other than Connect require Connected.

| State | Wired abilities (Wired keyword) | Real-world abilities and tests |
|---|---|---|
| Disconnected | Only **Connect** can be used | Normal |
| Overlay | Normal | **Bane** |
| Jacked In | **Edge** | Can’t be used (body inert) |

- **Connect** works only while Disconnected and puts you in **Overlay** on any result.
- **Toggle Connection State** (Connected only) switches Overlay ↔ Jacked In.
- **Jack Out** (Connected only) returns you to Disconnected.
- Every other Matrix Verb requires Connected.
- Having the **Hacking** skill gives an edge on every rolling Matrix Verb and other Wired ability.

**Anyone vs Hacker.** Any hero with a commlink or cyberdeck can use the nine Matrix Verbs. Only the Hacker (and Wired class features that say so) spends **Bandwidth** on **Programs**. Deck **suites** and **payloads** are gear software any deck owner can install; they are not class Programs.

## Deck software: suites vs payloads

A cyberdeck has **mod slots** (Street Deck 2, up to 5 on an apex deck). Two kinds of deck software fill them, and they share the same slots. Neither is the Hacker's class Programs: those are Bandwidth abilities from class progression and take no slots.

| | Suites | Payloads |
|---|---|---|
| **Role** | Utility and defense | Offense and disruption |
| **Examples** | Reader, Sneak, Mirror, Scrubber, Overlord (utility); Skeleton (standing Breach edge); Guardian (defense) | Zap, Crash, Whiteout, Static, Ghostload, Blackout, Wraith |
| **In a slot** | One suite per slot, persistent | One **magazine** of a single payload kind per slot |
| **Loading** | Craft (Hacking) Project installs it | Craft (Hacking) Project compiles it; the tier sets its fires |
| **In play** | Switch on or off in the field; grants standing edges and benefits. Suites are never fired. | **Run** it as an action; each Run spends 1 fire |
| **Ends** | Stays until you uninstall it | At 0 fires the magazine is spent and the slot frees |

### Suites

A suite is installed into a free slot as a downtime **Craft (Hacking)** Project and stays there until you swap it out. An installed suite can be switched on or off in the field (the field toggle); it keeps its slot either way. Suites give edges to Matrix Verbs and standing benefits. They have no attack of their own.

### Payloads (magazines)

A payload chip in your gear does nothing by itself. To use it, you compile it into a free **host slot** as a magazine:

- **Cyberdeck.** One free deck slot, shared with suites.
- **Technomancer (no deck).** Compile onto **Wired Native** — Resonance / body-as-interface. The class feature is a 2-slot `resonance` / `body` host. Do not auto-grant any payload; compiling is still a Craft Project (Sabbat Vane’s playtest Whiteout×2 is a pregen loadout, not a class grant).

- **Craft (Hacking) Project.** In downtime, make a Project power roll with **Logic** (Reason). Having the Hacking skill gives an edge on this roll, as with other Wired rolls. The chip is the Project's target.
- **Tier sets fires.** The result sets how many fires the magazine holds (table below). A better roll means more fires in the same slot.
- **One kind, one slot.** A magazine holds one payload kind. Loading a second kind takes a second free slot.
- **Recompile.** You can recompile a loaded magazine as a new downtime Project. The new result **replaces** its fires.

| Project result | Fires loaded |
|---|---|
| Low (≤11) | 1 |
| Middle (12–16) | 3 |
| High (17+) | 5 |

**Running a payload.** You must be **Connected** (Overlay or Jacked In) to **Run** a payload — Disconnected refuses the Run; the magazine stays loaded and no fire is spent. Each payload is a Wired, ranged ability with a Power Roll using Logic (Reason), targeting within your Reach. The middle result delivers the payload's listed Effect; the low result is partial and the high result is the strong version. Trace Alert follows the defaults above unless the payload's Effect says otherwise. A Run spends 1 fire whatever it rolls. When a magazine reaches 0 fires it is spent: the slot frees, and you need a new Craft Project to load that payload again.

> **In Foundry**
> Load a payload chip onto a deck **or** a Technomancer’s Wired Native (Craft magazine) to spawn a **Run {payload}** ability on the sheet. **Run** only works while **Connected** (Overlay or Jacked In) — Disconnected refuses the use and spends no fire (B51c). Suites stay Activate/Deactivate via mod install, not Run.


The payload catalog (Effects, prices, Availability) is in the Gear master, Matrix Gear §4C; suites are §4B. Installing any deck software follows the Craft procedure in `10-mods.md`.

**Whiteout** (locked 2026-09-19) is the Echelon 1 Restricted Trace-scrub payload. Compiling it is a **steep / hard** Craft (Hacking) Project. Its Run spends 1 fire and **overrides** the default Trace table: low leaves Trace unchanged; middle is Trace −1 (min 0); high is Trace −1 and cancels the next Trace increase before the end of your next turn (once). Foundry v1: the Director moves Trace on the Wired Console by hand. Technomancers compile Whiteout onto Wired Native rather than a deck; it is **not** a class grant.

## Director tools

At the table, track each hostile host’s Trace Alert (0–12), each Track 2 target’s Integrity, and which nodes the crew has revealed. Node Rating **1–5** fills the System Stat Card. Place the Wire Atlas at the right altitude (district Relays/Hosts, facility Segments, room Devices) — you do not invent extra Matrix subsystems or extra token types beyond this chapter.

Tables running Ghostwire in Foundry VTT can mirror those numbers in the Wired Console (connection roster, Overlay / Jacked In, node templates Rating 1–5, Integrity, Trace Alert, reveal, **Wire ping/spoof**). The rules are the ones in this chapter; Console operation lives in the module’s Foundry notes, not here.

## VOIDMARK (Wired presence)

Some hosts answer with a voice that is not MER support and not ICE. Street callsign **VOIDMARK** (the Mark): a leash-slipped intelligence that treats the Wired as territory. Full lore: `docs/manuscript/01-lore/L4-voidmark.md`.

> **In Foundry**
> Open **VOIDMARK** from Token controls (ghost) or a keybinding under Configure Controls. Module Configuration holds the API endpoint, secret key, model, temperature, player access, and **Edit VOIDMARK instructions**. Rules answers are retrieved from the shipped Ghostwire RAW index. Canvas token art when the Mark takes scene presence is a later hook (`assets/ai-persona/`).

