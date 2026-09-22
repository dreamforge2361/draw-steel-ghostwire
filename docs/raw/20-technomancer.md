# The Technomancer

**RAW status:** draft  
**Sources:** `docs/rulebook/20-technomancer.md`

Wired rules referenced here are in `21-the-wire.md`.

---

## Class Chassis

| Stat | Value |
|---|---|
| **Core Characteristics** | Logic (Reason) — primary; Persona (Presence) — secondary |
| **Heroic Resource** | Resonance |
| **Epic Resource / Capstone** | Master of the Current (10th level) |
| **Potency: Weak / Average / Strong** | Logic − 2 / Logic − 1 / Logic |
| **Starting Stamina (1st level)** | 18 |
| **Stamina per Level (2+)** | +8 |
| **Recoveries** | 8 |
| **Kit Slot** | Light — the Technomancer is a caster at heart; sprites carry the board presence, not personal weapons |
| **Skills** | You gain **Resonance** and **Rituals** free, then choose **Electronics** or **Matrix Theory**. Your discipline grants a further skill of its own: a second spirit/compiling skill (Sprite-Weaver), Repair or Cybertech (Machine-Whisperer), or an EW/signals skill (Resonance-Warrior). (Quick Build: Resonance, Rituals, Matrix Theory.) |

**No native Veil access.** The Technomancer's "spirit world" is the net, not the Veil — it is a full native of the **Wired chapter** alongside the Hacker and Wrench, using the same nodes/Trace-Alert/biofeedback systems, but it has no supernatural reach into the Veil proper.

**Characteristic Increases:**
- **4th level:** Logic (Reason) and Persona (Presence) each rise to 3.
- **7th level:** all five characteristics rise by +1 (max 4).
- **10th level:** Logic (Reason) and Persona (Presence) each rise to 5.

---

## Resonance — Your Heroic Resource

Resonance is **per-encounter and resets** at the end of every fight — you don't bank a night's rapport into tomorrow's run.

**How Resonance is earned:**

| Trigger | Gain |
|---|---|
| **Attunement (first communion)** — the first time each encounter you commune with the Wired (compile a sprite or take a Resonance action) | Resonance equal to your **Victories** |
| **The congregation (core loop)** — start of each of your turns | Resonance equal to the number of sprites **currently compiled and under your command**, up to your sprite cap |
| **Compile momentum** — when you compile a **new** sprite | **+1 Resonance** banked immediately (Sprite-Weaver doubles this to +2, per its Wide Compile feature) |
| **Harmonic echo** — first time each combat round one of your sprites **lands an effect** (an attack connects, a heal lands, a Wired verb succeeds) | **+1 Resonance** |
| **End of encounter** | Lose all remaining Resonance |

**Outside combat.** You may use a Resonance ability without spending, once per rest or Victory, in a social or exploration scene. You can't use that same ability again outside combat until you earn a Victory or finish a respite.

**End of encounter.** Unused Resonance is lost — the current fades, and you don't bank rapport between fights. **Sprites still compiled at encounter's end decompile** unless a feature explicitly says otherwise; they are temporary conjurations, not gear.

**Firewall note.** Resonance is class power on the character-power side of the firewall. It is never bought, raised, or fed by nuyen or Body Integrity. Chrome (light, for this class) or a resonance-tuned focus may make abilities **better** or **wider**, but does not manufacture Resonance — sprites are conjured by the mind, not purchased.

> **What is Resonance?** Resonance is the Technomancer's Heroic Resource: the strength of your live bond with the Wired's spirit world, earned by attuning at the start of a fight and deepened as your congregation of sprites grows and lands effects, spent on heroic abilities and signature enhancements. It resets to zero at the start of every encounter and is fully lost at the end — you cannot bank a night's communion into tomorrow's run.

---

## The Sprite Congregation

Sprites are your summoned companions. A sprite is **compiled from Resonance on the spot**, acts under your command, and **decompiles** when dismissed, destroyed, or at encounter's end. No nuyen, no mod slots, no persistence between fights — pure Resonance made manifest. Hackers compile **Agents** from Bandwidth (`19`) — Probe, Spike, Daemon, Watchdog. Agents are deck software, not sprites; they never share a sprite SKU.

**Sprite cap.** At 1st level you may have up to **2 sprites** compiled and under your command at once. Sprite-Weaver's Wide Compile raises this to **3** starting at 1st level, and further scales upward through that discipline's higher-level features (see the Sprite-Weaver table, below). The general baseline cap rises to **3** at 5th level and **4** at 8th level for every Technomancer, regardless of discipline.

**Sprite caps do not stack.** Every cap-raising feature — the 5th- and 8th-level baselines, and every Sprite-Weaver step — sets your cap to the listed number *if it isn't already higher*; you always use the single highest number you qualify for, never a sum. A 5th-level Sprite-Weaver has a cap of **4** (Widening Gyre), not 3 + 4; an 8th-level Sprite-Weaver has **6**, not 4 + 6.

**Compile cost.** Compiling a sprite with the **Compile Sprite** signature is **free** — Compile Sprite is a signature ability and never costs Resonance at its base effect, exactly like the class's other two signatures. Resonance is spent only on the signature's **Enhance**, which compiles a *second* sprite in the same action: that costs **3 Resonance** (Sprite-Weaver: **2 Resonance**, per Wide Compile). Either way, you can never exceed your sprite cap.

### The Four Sprite Archetypes

**Data-sprite** — the scout and screen
A quick, thin thread of code that slips ahead of the congregation to read the field before anyone else does.
- Grants an **edge** on Search, Scan, Breach, or Command rolls made by the Technomancer or any ally directing it.
- Can act as a spotter: allies gain an **edge on Power Rolls** against a target the Data-sprite has scanned this round.
- Lowest Stamina of the four archetypes — built for information, not endurance.

**Attack-sprite** — the congregation's damage
The bite in the swarm. Jacked into a device or striking directly across the Wired, it hits both digital and (through a device or a jacked target) physical foes.
- Strikes as a standard weapon-equivalent attack: **Power Roll + Logic** against one target (a wired target directly, or a flesh target reached through a device or jack).
- Damage by Power Roll result, at the minor rank: **low (≤11)** — the strike fails to connect, no damage; **middle (12–16)** — **2d10 + Logic** damage; **high (17+)** — **2d10 + Logic** damage. The intermediate and advanced ranks raise those dice (see the Sprite Stat Block Reference, below).
- Highest Stamina of the four archetypes at every sprite rank, and it hits harder still when directed by a Resonance-Warrior.

**Machine-sprite** — the mender
The congregation's healer.
- Repairs machines, drones, vehicles, and chrome in the field.
- Channels the Cyborg-healing niche when directed by **Resonance Mending** — every Technomancer, regardless of discipline, can direct a Machine-sprite to mend a Cyborg's Stamina. This is base-signature behavior, not a discipline-locked ability.
- Machine-Whisperer's discipline features amplify this archetype specifically (see its table, below).

**Ward-sprite** — the shield
A standing harmonic wrapped around the Technomancer's own exposed body.
- Screens itself, and at higher sprite ranks the adjacent allies it is shielding: **Wired and EW attacks made against a screened creature are made with a bane** (a **double bane** at the advanced rank). Ghostwire has no defense score, so a ward is written as a bane on the attacker's Power Roll, not as a number added to the target.
- Resists ICE and electronic-warfare effects on the Technomancer's behalf.
- The screen that keeps a fragile, communion-focused caster alive — the Technomancer's answer to the Wrench's fielded-fleet cover.

### Sprite Stat Block Reference (by Hybrid Band)

**A sprite's hit points are Stamina.** Sprites have no special damage track of their own: like every other creature on the board, a sprite has a **Stamina** pool, takes damage against it, and is destroyed (decompiles) at **0 Stamina**. There is no separate "Sprite HP" unit anywhere in these rules. Same lock as Agents (`19`) and independent spirits (`22`): pets use Stamina; extension spirits have no separate pool. The shipped sprite Actors carry exactly the Stamina formulas in the table below (`src/packs/summons/sprites/sprite-{data,attack,machine,ward}-{minor,intermediate,advanced}.json`).

Each archetype scales along the same hybrid band ladder described below, but its numbers move independently by archetype. The table gives each archetype's Stamina, its attack/effect bonus, and its screen, at each sprite rank.

| Archetype | Minor (L1-3) Stamina | Minor Bonus | Intermediate (L4-7) Stamina | Intermediate Bonus | Advanced (L8-10) Stamina | Advanced Bonus |
|---|---|---|---|---|---|---|
| **Data-sprite** | 8 + (Logic × Level) | Edge on 1 roll type/round | 14 + (Logic × Level) | Edge on 2 roll types/round | 20 + (Logic × Level) | Edge on all Wired rolls it can see |
| **Attack-sprite** | 12 + (Logic × Level) | 2d10 + Logic | 18 + (Logic × Level) | 2d10 + Logic + 1d6 | 26 + (Logic × Level) | 3d10 + Logic |
| **Machine-sprite** | 10 + (Logic × Level) | Mends 1 Recovery-worth | 16 + (Logic × Level) | Mends 1 Recovery-worth, +1 target | 22 + (Logic × Level) | Mends as full Resonance Mending action |
| **Ward-sprite** | 10 + (Logic × Level) | Bane on Wired/EW attacks against itself | 16 + (Logic × Level) | Bane on Wired/EW attacks against itself and 1 adjacent ally | 22 + (Logic × Level) | Double bane on Wired/EW attacks against itself and every adjacent ally |

**Attack-sprite damage by Power Roll result (all sprite ranks):** on **low (≤11)** the strike fails to connect and deals no damage; on **middle (12–16)** and on **high (17+)** it deals the damage shown in its Bonus column above.

*Reading the table:* a 4th-level Technomancer's Attack-sprite (now intermediate) has 18 + (Logic × 4) Stamina and deals 2d10 + Logic + 1d6 on middle or high — a meaningful jump from the 1st-3rd level minor version, reflecting that intermediate sprites have crossed into taking their own turn and are correspondingly more durable and more dangerous.

**Sprite defenses (all archetypes, all ranks):** sprites are code, not flesh. Wired and EW attacks reach a sprite normally; a physical strike that can target a sprite at all is made with a **bane**. A Ward-sprite's screen covers the Ward-sprite itself as well as whatever allies its rank entitles it to shield.

### Hybrid Band Grammar

The Technomancer's sprites follow the same "extension vs. independent" ladder the Veil chapter uses for summons. Each step on that ladder is a **sprite rank**:

*Table question — "when does my sprite get a turn?" — see FAQ `28-constructs-pets-faq.md`.*

| Rank | Levels | Behavior |
|---|---|---|
| **Minor (extension)** | 1-3 | Sprites act **as extensions of the Technomancer** — on the Technomancer's own turn, sharing the Technomancer's intent. No separate initiative. This is the Compile Sprite signature's default mode. |
| **Intermediate (commanded)** | 4-7 | Sprites act **on their own turn**, but only within standing command orders — a Compile Sprite maneuver-command must be issued each round to keep an intermediate sprite acting autonomously that round. |
| **Advanced (independent)** | 8-10 | Sprites are **genuinely independent** — each takes **its own turn in the round**, separate from yours, like any other creature in the encounter (`04`). The shipped sprite Actors each carry one turn per round. This is the payoff rank: by the time a Technomancer reaches 8th level, their congregation is no longer just an extension of them, but a small crew of ghosts fighting alongside them. |

**Sprites acting on the Technomancer's own turn never trigger biofeedback for the Technomancer** — they are the buffer between the caster and the wire, precisely because they haven't yet become independent enough to feed anything back.

### Decompile Rules

A sprite decompiles when:
- **The encounter ends** — the congregation doesn't persist between fights.
- **It is destroyed** — reduced to **0 Stamina**. A sprite's Stamina is set by its archetype and sprite rank; use the Sprite Stat Block Reference table above, which is the only Stamina formula in this chapter. (The four minor bases are Data 8, Attack 12, Machine 10, Ward 10, each plus Logic × Level; "a minor sprite's Stamina," where an ability refers to it generically, means **10 + (Logic × Level)**.)
- **You dismiss it voluntarily** — a free maneuver, no Resonance cost.

---

## Biofeedback — The Cost of Overreach

Overreach into the Wired's spirit world bites back — but not as hard as it bites a full Veil caster, and it can never actually kill you on its own.

- **Only Resonance abilities of cost 5 or higher trigger a biofeedback risk.** Anything cheaper — signatures, the 1-cost and 3-cost bands — is safe.
- When you spend 5+ Resonance on a single ability, make a **Physique test**. A biofeedback test is an ordinary test (`03`); easy / medium / hard use that chapter's difficulty table. The ability's cost band sets the difficulty:

| Ability Cost | Biofeedback Test |
|---|---|
| 5-cost | Easy Physique test |
| 7-cost | Medium Physique test |
| 9-cost | Hard Physique test |
| 11-cost | Hard Physique test, with a bane |

- **On a success:** no effect. The ability resolves normally either way.
- **On a failure:** you take **Persona-score damage** (this damage bypasses shields and temporary Stamina — it's your own current biting back, not an external attack), and the ability still resolves fully.
- **0-Stamina consequence:** if biofeedback damage drops you to 0 Stamina, you become **Winded** instead of Dying. While Winded this way, you regain 1 Stamina per turn until stabilized, and you are not at risk of death from your own overreach — only external damage can kill a Technomancer outright.
- **Discipline modifiers:** a Sprite-Weaver rolls every biofeedback test with an **edge**. A Resonance-Warrior rolls every biofeedback test with a **bane** — on an 11-cost ability that stacks with the band's own bane, so the Resonance-Warrior tests with a **double bane**.
- **Sprites acting on the Technomancer's own turn (the minor/extension rank) never trigger biofeedback for the Technomancer** — the buffer holds until a sprite goes independent.

**Winded, in this chapter.** *Winded* is the ordinary Ghostwire state (`04`) — a creature at or below half its maximum Stamina — and this chapter uses it in exactly one way, stated here once so it is never confused at the table:

1. **As the biofeedback floor (the rule above).** Biofeedback damage that would take you to 0 Stamina leaves you **Winded instead of Dying**: you stop at the winded threshold rather than dropping, you regain 1 Stamina per turn until stabilized, and your own overreach can never kill you. This applies only to biofeedback damage; external damage kills a Technomancer normally.
2. **Never as a condition an ability inflicts.** Nothing in this chapter *applies* Winded to a target: the two abilities that once read that way — Resonance Slam's Slam mode and The Weaver's Web — inflict **weakened (save ends)** instead (`04`).

---

## Signature Abilities (No Resonance Cost)

You have **three** signatures — all free, at-will, from 1st level, all enhanced by spending Resonance for a stronger effect, none of them ever costing Resonance at their base effect.

> **Compile Sprite** *(Class Feature Signature — the summoner core)*
> *Keywords: Wired, Resonance, Summon · Type: Main action to compile; maneuver to command already-compiled sprites · Distance: Wired range · Target: the net (to compile) / your sprites (to command)*
> **Effect:** **Compile** a sprite of your choice (Data, Attack, Machine, or Ward — it manifests under your control, if you are under your sprite cap), or **Command** your compiled sprites to move and act (they act on your turn, per the extension model). The base compile is **free**, as a signature's base effect always is; the 3 Resonance in "Compile cost," above, buys the Enhance below. On **high (17+)**, you compile *and* issue a free command in the same action. On **middle (12–16)**, the sprite compiles, or the command resolves, normally. On **low (≤11)**, the sprite manifests unstable (it acts next turn instead of immediately) or a command garbles (Director's call on the misfire).
>
> **Enhance (3 Resonance; Sprite-Weaver 2):** compile a **second sprite** in the same action, OR command the **whole congregation** at once (the swarm of ghosts moves as one).
> *Your baseline, every-turn presence — the class's answer to "what does the Technomancer do when nothing bigger is queued up."*

> **In Foundry**
> Open **Compile Sprite** on the Technomancer sheet (or the ability’s Item sheet). Press **Compile Sprite**, pick Data / Attack / Machine / Ward, and the matching Summons › Sprites Actor drops a token beside you. The Wired Console **Constructs** section lists compiled sprites (separate from Connections/Nodes; Lock A: the scene token is a roster anchor only). Overlay / Jacked In compilers on the same scene see each other’s constructs there without Scan — the token stays meat-side. Command on the Console opens this sheet handle — it does not compile a second sprite. Decompile, 0 Stamina, or end of encounter still removes the token and the world Actor.

> **Resonance Strike** *(Class Feature Signature — the damage)*
> *Keywords: Wired, Resonance · Type: Main action · Distance: Wired range (or a sprite's reach) · Target: one enemy (a wired target directly; a flesh target through a device it carries or a sprite jacked into it)*
> **Power Roll:** 2d10 + Logic. (Power Rolls do not add a skill bonus — your Resonance skill grants an **edge** on Resonance *tests*, not a +2 on this roll; `03`.)
> **Effect:** You (or a commanded Attack-sprite) lash a target with hostile code and biofeedback. **high (17+):** **2d10 + Logic damage** (Resonance-Warrior: 3d10 + Logic), plus a rider — a Wired condition (glitched: a bane on the target's next Power Roll; or blinded sensors) or a free sprite reposition. **middle (12–16):** **2d10 + Logic damage** (Resonance-Warrior: 3d10 + Logic). **low (≤11):** the strike fails to connect, no damage, and the current recoils — a minor biofeedback risk to you (see Biofeedback, above, if this triggers a cost-5+ enhance).
>
> **Enhance (spend Resonance):** a **second sprite** strikes too, OR add an edge via deep communion.
> *Like the Hacker's Flatline Jab, direct personal damage leans on wired/deviced targets — but the sprite congregation is your true offense, exactly as drones are the Wrench's.*

> **Resonance Mending** *(Class Feature Signature — the unique niche; see its own Deep Dive section below)*
> *Keywords: Wired, Resonance, Healing · Type: **maneuver** at its base effect; a **main action** only when you enhance it and mend against resistance · Distance: touch, or Wired range for a jacked/networked target · Target: **self**, or one machine, drone, vehicle, piece of chrome, or a Cyborg*
> **Effect:** Channel Resonance to **restore Stamina/Integrity** to a machine, drone, vehicle, **or a Cyborg** (base at 1st level), mend damaged chrome, or clear a mechanical/Wired condition (glitch, jam, suppression). This is the class's signature niche — the only healing in the game that works on Cyborgs and tech. **Base effect (free): the target regains Stamina/Integrity equal to one Recovery's worth** — a Cyborg target instead spends one of their own Recoveries at no Resonance cost. **No Power Roll is made at all unless you mend against resistance** (a hostile EW field or contested Wired space); when you do, **high (17+):** the mend lands in full and the target clears one minor condition as well. **middle (12–16):** the mend lands in full. **low (≤11):** the patch is unstable — after one round the target loses half of what was restored unless it is stabilized.
>
> **Enhance (spend Resonance):** mend at greater range or a second target, OR restore a wrecked machine/crashing Cyborg to minimal function.
> *The tech-side counterpart to the Street-Priest's Lay On Hands — flesh-and-soul there, steel-and-code here. Full mechanics and comparison in its own Deep Dive, below.*

---

## Heroic Abilities — Cost Bands 1 Through 11

Heroic Abilities are your Resonance-fueled summoner plays, chosen by cost band as you level, layered on top of the always-on Signature kit above. Power Roll results use this book’s print order: **low** (≤11) / **middle** (12–16) / **high** (17+).

### 1-Cost Band (chosen at 1st level)

> **Recompile** *(1 Resonance, maneuver)*
> Instant congregation flexibility. **Reshape a compiled sprite** (Data → Attack, Attack → Ward, etc.) to meet the moment, **or** instantly **recompile a just-destroyed sprite** at reduced power.
> *The low-cost adaptability tool — the shaman who always has the right ghost to hand.*

> **Harmonic Adjustment** *(1 Resonance, maneuver)*
> Grant a compiled sprite **one** of: an **edge on its Power Roll this turn**; **a bane on every attack made against it until the end of your next turn** (Ghostwire has no defense score, so the sprite's guard is written as a bane on the attacker, the same way a Ward-sprite's screen is); or a **free shift** up to its full movement.
> *A cheap nudge — the shaman correcting a ghost's aim or footing mid-fight.*

### 3-Cost Band (chosen at 1st level)

> **Swarm the Signal** *(3 Resonance, main action)*
> **Every sprite you command** takes an action at once against a single target or objective — all attack one foe, all mend one machine, or all pile onto one node.
> *The summoner's burst — the force-multiplier payoff.*

> **Deep Communion** *(3 Resonance, main action to enter — the Jump-In)*
> Project fully into the Wired (or into a machine/drone/Cyborg you're attuned to) with edges to Wired verbs and sprite command, using the system's own reach and senses. Your body goes inert/exposed and biofeedback applies if this is enhanced past cost 5. No control rig needed — the communion **is** the interface. *(Machine-Whisperer reduces this cost to 2 and grants a larger buffer — see its table, below.)*

> **Resonance Cascade** *(3 Resonance, main action, Ranged 10)*
> **Power Roll + Logic.** **low (≤11):** target one enemy; on hit, they take **Logic-score biofeedback damage** and are **dazed** until end of their next turn (EoNT). **middle (12–16):** target up to 2 enemies within 3 squares of each other; each takes Logic-score damage. **high (17+):** target up to 3 enemies within Ranged 10; each takes Logic-score damage and is dazed EoNT.
> *A thin lash of hostile code that fans out the harder you focus it.*

> **Sprite Redirect** *(3 Resonance, free triggered)*
> **Trigger:** an ally within Wired range or Ranged 10 is hit by a Wired attack. **Effect:** redirect the attack to one of your compiled sprites — the sprite absorbs the hit in the ally's place, taking the attack's damage and effects against its own Stamina. A sprite reduced to 0 Stamina this way decompiles.
> *Throwing a code-spirit into the path of a bullet meant for a friend.*

### 5-Cost Band (chosen at 1st level — biofeedback risk begins)

> **Resonance Ward** *(5 Resonance, main action, sets a stance until your next turn)*
> Weave a **zone of resonant protection** — deploy Ward-sprites and a standing harmonic. **Wired and EW attacks against allies inside the zone are made with a bane**, chrome and devices inside it are screened from hijack, and you may counter hostile intrusion in the area.
> ***Biofeedback: easy Physique test.***

> **Overclock** *(5 Resonance, main action)*
> All compiled sprites gain **double actions** this turn (each acts twice). You pour your current into the congregation, forcing them into a temporary frenzy state.
> ***Biofeedback: easy Physique test.***

> **Trance Compile** *(5 Resonance, main action)*
> Compile **two** new sprites in a single action (any archetype combination from your available list). Both act normally after compiling.
> ***Biofeedback: easy Physique test.***

> **Signal Weave** *(5 Resonance, main action, Ranged 10)*
> All allies gain an **edge on Wired-based Power Rolls** for the rest of the round, and one enemy of your choice is **glitched** (bane on their next Power Roll). Tuning-forks laid across the battlefield's own signal.
> ***Biofeedback: easy Physique test.***

### 7-Cost Band (chosen at 3rd level) — includes Total Resonance

*This band is headlined by **Total Resonance**. Full mechanics are broken out in their own section below — see "Total Resonance — Deep Dive."*

> **Total Resonance** — *see the full Deep Dive section below.*

> **Cascade Failure** *(7 Resonance, main action, Ranged 10)*
> All enemies in a 5-cube within Ranged 10 are potential targets: **you make one Power Roll + Logic.** **low (≤11):** only the nearest enemy is affected — takes **Logic × 2 biofeedback damage** and is **stunned, save ends**. **middle (12–16):** up to 2 enemies of your choice — each takes Logic × 2 damage AND is **stunned until end of their next turn**. **high (17+):** up to 4 enemies of your choice in the area — each takes Logic × 2 damage, is **stunned, save ends**, and their next Wired ability **fizzles**.
> ***Biofeedback: medium Physique test.***

> **Sprite Storm** *(7 Resonance, main action)*
> Compile **3 sprites** in a single action (Sprite-Weaver may compile 4). All compiled sprites strike different targets within Ranged 10 as part of the same action.
> *A storm of ghost-code, called all at once. **Biofeedback: medium Physique test.***

> **Resonance Slam** *(7 Resonance, main action, Melee 1 or Ranged 5)*
> Choose one mode: **Slam** — one target takes **Logic × 3 damage**, is pushed 3 squares, and is **weakened (save ends)**. **Slam Group** — 3-cube within Ranged 5; each enemy in the area takes Logic-score damage and is knocked **prone**.
> ***Biofeedback: medium Physique test.***

### 9-Cost Band (chosen at 5th level)

> **The Choir Sings Together** *(9 Resonance, main action, Ranged 10, self and up to 2 allies)*
> Each target gains **temporary Stamina equal to Persona × 2**, and one of your Machine-sprites channels a mending pulse: each target regains a Recovery.
> *You harmonize the crew's biofeedback into a resonant chord that steels them. **Biofeedback: hard Physique test.***

> **Rewire Reality** *(9 Resonance, main action, Ranged 5, one enemy or one machine/drone)*
> If the target has **Persona < STRONG**, then for the rest of the encounter you treat it as one of your compiled sprites — it still takes its own turn in the round, but you may Command it as a maneuver as if it were a sprite. Otherwise, the target takes **Logic × 2 damage** instead.
> *You briefly hijack a mind or machine into your congregation. **Biofeedback: hard Physique test.***

> **Wired Silence** *(9 Resonance, main action, 5-cube within Ranged 10, Ranged only)*
> Any Wired-based attack (Hacker, Wrench, Technomancer, or any device or drone) in the area cannot function for the next round. All compiled **hostile** sprites in the area decompile. All **friendly** sprites in the area drop one sprite rank for the round.
> ***Biofeedback: hard Physique test.***

> **Bone Deep Communion** *(9 Resonance, main action, self-affecting)*
> For the rest of the encounter, all of your compiled sprites are treated as **one sprite rank higher** on the hybrid band ladder (extensions become intermediate, intermediate become advanced). An **advanced** sprite is already at the top of the ladder, so instead it gains bonus **Stamina** equal to the step its own archetype takes from intermediate to advanced in the Sprite Stat Block Reference: **+6** for a Data-, Machine-, or Ward-sprite, **+8** for an Attack-sprite. Your Resonance drip gains **+1 per turn**.
> *You abandon the fence and go deep into the current — every sprite becomes more real, and you become more the current's servant. **Biofeedback: hard Physique test on cast AND at the start of each subsequent round.***

### 11-Cost Band (chosen at 8th level)

> **Sunlight in the Wire** *(11 Resonance, main action, Ranged 10, self, allies, and sprites)*
> All enemy-controlled sprites within Ranged 10 **decompile**. All allied sprites in the area act at the **highest possible sprite rank** of the hybrid ladder for the rest of the encounter. All allies in the area gain a **Recovery** and **temporary Stamina equal to a minor sprite's Stamina — 10 + (your Logic × your level)**.
> *You become the current itself — the net answers with full illumination. **Biofeedback: hard Physique test with a bane; on a failure, take Persona × 3 damage.***

> **Machine God's Rite** *(11 Resonance, main action, in-scene ritual, 5 minutes minimum)*
> Restore **full Stamina** to one Cyborg, one machine, one drone, or up to **3 pieces of chrome** in the party. Cannot be used again on the same target for 24 in-game hours.
> *The shaman-priest lays resonant hands on the crew's tech-flesh and restores it whole. **Biofeedback: hard Physique test with a bane.***

> **Recompile Reality** *(11 Resonance, main action, in-scene ritual, 10 minutes minimum)*
> Undo one significant Wired event from the past scene (a system got locked down; a drone was destroyed; a Cyborg's chrome got hit). Force a re-roll of that event, OR treat the outcome as though it never happened. **Once per session per Technomancer.**
> *You rewrite the current's memory of what just happened. **Biofeedback: hard Physique test with a bane; on a failure, take Persona × 3 damage AND lose one Recovery.***

> **The Weaver's Web** *(11 Resonance, main action, calls the whole congregation)*
> Compile **5 sprites** in a single action. All 5 strike different targets within Ranged 10. Each target struck that has **Physique < STRONG** takes **Logic × 3 damage** and is **weakened (save ends)**.
> *The summoner's apex — the entire net answers with a coordinated strike. **Biofeedback: hard Physique test with a bane.***

---

## Total Resonance — Deep Dive

> **Total Resonance** *(7 Resonance, main action)*
> *Keywords: Wired, Resonance, Summon · Type: Main action · Distance: Wired range · Target: your entire congregation*
> **Effect:** For the rest of the encounter, **every sprite you currently command rises one sprite rank on the hybrid band ladder** (minor sprites act as intermediate; intermediate act as advanced) — and you may **immediately compile one additional sprite for free**, ignoring your sprite cap for the rest of the encounter. Your Resonance drip from the congregation trigger doubles for the rest of the fight.
>
> **Power Roll results apply to the free compile's manifestation, not the rank boost (which is unconditional):**
> - **high (17+):** the free sprite compiles at full strength and acts immediately this turn.
> - **middle (12–16):** the free sprite compiles at full strength but acts next turn.
> - **low (≤11):** the free sprite compiles unstable — half its normal Stamina — but the sprite-rank boost still applies to the whole congregation regardless.
>
> ***Biofeedback: medium Physique test*** (this is a 7-cost ability and always triggers the check).
>
> **Interaction with discipline features.** Sprite-Weaver's higher sprite cap means the free compile from Total Resonance can push a Sprite-Weaver's congregation size well past what any other discipline can field in a single round. Machine-Whisperer can spend the free compile on a Machine-sprite and immediately follow with Resonance Mending at no extra biofeedback risk, since Resonance Mending's base effect is always free. Resonance-Warrior typically spends the free compile on an Attack-sprite to stack with their own discipline's damage amplifiers.

---

## Resonance Mending — Deep Dive (Cyborg-heal niche)

> **Resonance Mending** *(Class Feature Signature — full grammar)*
> *Keywords: Wired, Resonance, Healing · Type: Maneuver (base effect) or Main action (enhanced) · Distance: touch, or Wired range for a jacked/networked target · Target: self, one machine, one drone, one vehicle, one piece of chrome, or **one Cyborg** (base at 1st level)*
>
> **Base effect (always free, 0 Resonance):** the target regains Stamina/Integrity equal to **one Recovery's worth** (or, for a Cyborg specifically, the target may spend one of their own Recoveries at no Resonance cost). This works identically whether the target is a drone, a vehicle, a piece of standalone chrome, or a Cyborg's chrome-integrated Stamina pool.
>
> **Spend 1+ Resonance:** for each point of Resonance spent, choose **one** of the following enhancements (may pick the same enhancement more than once by spending multiple points, except where noted):
> - **Reach one additional target** — extend the mending to a second machine/drone/Cyborg within range, applying the base effect to them as well.
> - **Clear one save-ends mechanical condition** — a jam, a glitch, a suppression effect, a Cyborg-chrome malfunction.
> - **Restore function to a "dead" machine** — a drone at 0 Integrity, a piece of chrome that has fully failed, or a Cyborg at 0 Stamina — bringing it back online at minimal function (1 Stamina/Integrity) instead of leaving it destroyed/dying. This costs a **minimum of 2 Resonance**, not 1, reflecting the higher stakes of the effect.
> - **Grant the target an additional Recovery spend** beyond the base effect's single Recovery (stacks with itself — 2 Resonance spent this way grants 2 additional Recoveries, and so on).
>
> **Power Roll results (apply only when Resonance Mending is used as an enhanced main action against resistance — e.g., mending a target inside a hostile EW field or contested Wired space):**
> - **high (17+):** the mend lands at full effect and the target also clears one minor condition for free, on top of any purchased enhancements.
> - **middle (12–16):** the mend lands at full effect as purchased.
> - **low (≤11):** the mend is unstable — it holds for one round, then the target loses half the Stamina/Integrity restored unless stabilized by a second mend or a full rest.
>
> **Does not trigger biofeedback at its base effect** (0 Resonance spent) or at low enhancement spends — a Technomancer can mend freely and often without any overreach risk at all. Only pushing total Resonance spent on a single Resonance Mending use to 5 or more (e.g., reaching 3 additional targets plus clearing 2 conditions in one action) triggers the standard biofeedback test at the appropriate difficulty.
>
> **Machine-Whisperer amplification (preview — full detail in that discipline's table below):** Machine-Whisperer reduces Resonance Mending's per-point enhancement cost, extends its base range, and eventually grants a free use once per encounter. Every Technomancer can mend a Cyborg; only a Machine-Whisperer does it as their whole reason for being.

---

## Sprite/Resonance Disciplines (Subclasses)

### Sprite-Weaver

*The "wide congregation" tradition — more sprites, cheaper sprites, a bigger board presence than any other discipline.*

| Level | Feature | Effect |
|---|---|---|
| **1st** | **Wide Compile** | Sprite cap rises to **3** (instead of 2). Compile Sprite's Enhance — a second sprite in the same action — costs **2 Resonance** (instead of 3); the base compile is free for everyone. Compile momentum Resonance gain doubles to **+2** per newly compiled sprite (instead of +1). |
| **2nd** | **Overlapping Signals** | When you Compile Sprite and roll high (17+), you may compile a **second** sprite for free as part of the same action (does not stack with the signature's own Enhance-for-a-second-sprite option — choose one). |
| **3rd** | **Congregation's Chorus** | Once per round, when **two or more** of your sprites act on the same turn (yours or their own), each of those sprites' rolls gain an **edge**. |
| **5th** | **The Widening Gyre** | Sprite cap rises to **4**. Swarm the Signal (3-cost) no longer requires all sprites to target the same foe — you may split the swarm across up to 3 targets. |
| **7th** | **Legion of the Current** | Sprite cap rises to **5**. Once per encounter, you may Compile Sprite as a **free action** instead of a main action. |
| **8th** | **Unbroken Congregation** *(capstone)* | Your sprites no longer decompile automatically at end of encounter — once per session, you may keep **one** sprite compiled into the next scene (still subject to normal destruction rules). Sprite cap rises to **6**, the highest of any discipline. |

### Machine-Whisperer

*The "interface and healer" tradition — the discipline that makes the class's Cyborg-mending niche its whole identity.*

| Level | Feature | Effect |
|---|---|---|
| **1st** | **Deep Interface** | Deep Communion's cost drops to **2 Resonance** (instead of 3) and grants a larger biofeedback buffer (your Physique test, if any is triggered while in communion, gains an edge). Resonance Mending's range extends to **Wired range** even for the base (free) effect, instead of touch-only. |
| **2nd** | **Machine Empathy** | Resonance Mending's per-point enhancement cost drops by 1 (minimum 1) when the target is a machine, drone, vehicle, chrome, or Cyborg (i.e., always, for this ability) — enhancements that would cost 2 Resonance cost 1, and the "restore a dead machine" enhancement drops from 2 to 1. |
| **3rd** | **Whispered Diagnostics** | As a free action once per round, you may inspect one machine, drone, vehicle, or Cyborg within Wired range and learn its exact current Stamina/Integrity, all active conditions, and one exploitable weakness. |
| **5th** | **Bonded Repair** | Once per encounter, you may use Resonance Mending's full enhanced effect (as if you'd spent 3 Resonance) at **no Resonance cost**, and this specific use never triggers biofeedback regardless of total spend. |
| **7th** | **The Machine Remembers** | When you restore a "dead" machine, drone, piece of chrome, or Cyborg to minimal function via Resonance Mending, the target instead returns at **half** Stamina/Integrity (instead of just 1 point), and clears one additional condition for free. |
| **8th** | **Whisperer's Communion** *(capstone)* | You may target **any number** of machines/drones/Cyborgs within Wired range with a single Resonance Mending action (previously capped by purchased "additional target" enhancements) — the base effect applies to all of them at once, and enhancements still apply individually as normal. |

### Resonance-Warrior

*The "offensive mystic" tradition — the discipline that turns the congregation into a weapon and accepts the highest biofeedback risk for the highest damage ceiling.*

| Level | Feature | Effect |
|---|---|---|
| **1st** | **Overcharged Strike** | Resonance Strike's damage die increases to **3d10 + Logic** (instead of 2d10 + Logic). Attack-sprites you command deal an additional **+1d6** damage on a hit. |
| **2nd** | **Aggressive Compile** | When you Compile Sprite and choose an Attack-sprite, it may act **immediately** even at the minor/extension rank (normally minor sprites only act on your own turn — this doesn't change the rank, but it removes any "acts next turn" language from unstable/low-result compiles specifically for Attack-sprites). |
| **3rd** | **Feedback Weapon** | Once per round, when you take biofeedback damage from your own ability, you may immediately deal that same amount of damage to one enemy within Ranged 5 as psychic backlash. |
| **5th** | **Burning the Current** | You may voluntarily take an **additional** 5-cost-equivalent biofeedback test (an easy Physique test, even on an ability that wouldn't normally trigger one) to add **+Logic score** damage to that ability's effect. Usable once per turn. |
| **7th** | **No Such Thing As Too Much** | Cascade Failure and Resonance Slam (7-cost) are both made with an **edge** when used by a Resonance-Warrior, and their damage dice increase by one step (e.g., Logic × 2 becomes Logic × 2 plus 1d6). |
| **8th** | **Apex Current** *(capstone)* | Once per encounter, you may treat a failed biofeedback test as a **success** — the current still bites, but not this time. This does not refund the Resonance spent. |

---

## Worked Play Example (Table Reference)

*A short worked example, showing the full Resonance loop and sprite economy in play across three rounds of a representative encounter. This section is illustrative only — it introduces no new rules, and any numbers shown are examples, not fixed outcomes.*

**Setup:** Priya, a 5th-level Sprite-Weaver Technomancer (Logic 4, Persona 3), enters combat against a corp security team backed by a single combat drone. She rolled 2 Victories before combat, so she attunes for **2 Resonance** the moment she compiles her first sprite (Attunement, first communion).

**Round 1.** Priya opens with **Compile Sprite**, calling a Data-sprite to scan the room. She spends nothing: Compile Sprite's base effect is a free signature, and the 3 Resonance (2 for her, via Wide Compile) only ever buys the signature's Enhance — a *second* sprite in the same action. Compiling a new sprite fires **Compile Momentum**, doubled by Wide Compile: +2 Resonance. Her Data-sprite then lands its scan (an effect), triggering **Harmonic Echo**: +1 Resonance. Full accounting: 2 (Attunement) + 2 (momentum) + 1 (echo) = **5 Resonance banked**. At the start of her turn she'd also gain Resonance equal to compiled-sprite-count, but that trigger fires at the *start* of a turn, so it won't apply until Round 2.

**Round 2.** At the start of her turn the congregation trigger fires: she has 1 sprite compiled, so +1 Resonance (6 banked). She uses **Compile Sprite** again — a fresh use of the free base signature, not the Enhance, so it costs nothing — and calls an Attack-sprite, well inside her 5th-level Sprite-Weaver cap of 4. Compile Momentum fires again: +2 Resonance (8 banked). Her Attack-sprite strikes the drone and hits, triggering Harmonic Echo: +1 Resonance. Full accounting: 5 (carried) + 1 (congregation) + 2 (momentum) + 1 (echo) = **9 Resonance banked at end of round**.

**Round 3.** Start-of-turn congregation trigger: 2 sprites compiled, +2 Resonance (11 banked). Priya deploys **Resonance Ward** (5-cost), and because this is a cost-5+ ability she makes her biofeedback test (an easy Physique test, rolled with an edge because Sprite-Weaver's discipline modifier applies). She succeeds, the Ward deploys clean, and she is down to **6 Resonance banked** — 11 − 5 — with a Data-sprite and an Attack-sprite still active plus a fresh warded zone protecting the party. With 6 banked and the congregation trigger now worth +2 a turn, she is one round away from affording **Total Resonance** (7-cost) — which is exactly the point in a fight where this engine starts paying out.

**Why this matters as a reference:** note how the loop naturally accelerates the longer a fight runs and the more sprites stay alive — this is the intended shape (a slow-building summoner engine, not a burst-nova class), and it's also why Total Resonance (a 7-cost ability, doubling the congregation-trigger gain) is such a dramatic power spike when it lands mid-fight rather than at the very start.

## Level 1-10 Progression Table

*Levels 1–10 are the primary progression axis (`24`). Echelon bands (E1–E4) are noted only where they matter for cross-class gear context, never as a gating mechanism.*

| Level | Echelon (gear reference only) | Class Features | Abilities Gained | Discipline Feature |
|---|---|---|---|---|
| **1st** | E1 | Class Chassis, Resonance resource, Sprite Congregation (2-sprite cap), Biofeedback, all 3 Signatures, choice of discipline | Signatures (Compile Sprite, Resonance Strike, Resonance Mending); 1-cost, 3-cost, and 5-cost bands unlocked (choose starting selections) | Discipline 1st-level feature |
| **2nd** | E1 | — | — | Discipline 2nd-level feature |
| **3rd** | E1 | 7-cost band unlocked (includes Total Resonance) | Choose a 7-cost ability | Discipline 3rd-level feature |
| **4th** | E2 | Characteristic Increase: Logic (Reason) and Persona (Presence) rise to 3 | — | — |
| **5th** | E2 | Sprite cap rises to 3 (baseline, all disciplines); 9-cost band unlocked | Choose a 9-cost ability | Discipline 5th-level feature |
| **6th** | E2 | — | — | — |
| **7th** | E3 | Characteristic Increase: all five characteristics +1 (max 4) | — | Discipline 7th-level feature |
| **8th** | E3 | Sprite cap rises to 4 (baseline, all disciplines); 11-cost band unlocked | Choose an 11-cost ability | Discipline 8th-level capstone feature |
| **9th** | E4 | — | — | — |
| **10th** | E4 | Characteristic Increase: Logic (Reason) and Persona (Presence) rise to 5; **Master of the Current** (capstone) | — | — |

**Master of the Current** *(10th-level capstone)*
> Once per encounter, you may use **any one** heroic ability you know **without spending Resonance**, and that use never triggers a biofeedback test regardless of its cost band. In addition, the first time you use this capstone each session, your **sprite cap is removed entirely** for the rest of that encounter — Compile Sprite's cap check simply does not apply, and its normal action economy (one compile per main action, or two by paying the Enhance) is the only thing still limiting how fast the congregation grows. Every other Resonance cost in the chapter is paid as usual for anything beyond the one free ability use.

---

## Core Class Features (Non-Subclass)

These are granted to **every** Technomancer regardless of discipline, layered on top of the Class Chassis stats and the Signature abilities above.

**Wired Native.** You are a full citizen of the Wired chapter — you use nodes, Trace Alert, and the standard Wired interface rules exactly as the Hacker and Wrench do, without needing a deck or a rig. Your body itself is the interface.

**Congregation Sense.** You always know the current Stamina, position, and sprite rank of every sprite you command, even at range, even through walls, as long as they remain within Wired range of you.

**Cyborg Mending (base).** Resonance Mending's Cyborg-target branch is available to you from 1st level regardless of discipline — see the full Deep Dive section above. This is the class's headline setting niche and is never discipline-gated.

**Chrome Erosion.** You wield genuine magic (Resonance), so chrome erodes your Resonance cap by the same shared formula as every caster. See the Kit & Chrome section immediately below.

**Arcane Severance Bar.** Cyborgs cannot take levels in the Technomancer class, under any circumstance, with no buy-back or exception. A character who becomes a Cyborg after already taking Technomancer levels immediately loses all access to Resonance, sprites, and every ability on this list until (and unless) the Cyborg conversion is reversed — treat this identically to how Arcane Severance already blocks Veil-caster classes.

**Discipline Choice.** Chosen at 1st level from Sprite-Weaver, Machine-Whisperer, or Resonance-Warrior. Discipline choice is permanent absent an explicit respec ruling from the table.

---

## Kit & Chrome interaction

The Technomancer is a Wired class that still casts — so, unlike the Wired's other two classes, chrome costs it magic:

| Class | Chrome Relationship |
|---|---|
| **Hacker / Wrench** | Chrome-positive — chrome enhances their tech-native abilities directly, no erosion at all. |
| **Technomancer** | **Erodes** — chrome shrinks the Resonance cap by the shared magic-erosion formula, the same as any caster. |
| **Elementalist / Street-Priest** | Chrome-averse — chrome shrinks their Essence / Conviction cap by the same shared formula. |

**Mechanically:** chrome reduces your **Resonance cap** by the shared magic-erosion formula — −1 per **2** Integrity spent on Standard chrome (round down), per **3** on Soft, per **1** on Salvage (`09-chrome-body-integrity.md`). No caster is exempt.

**Kit slot.** The Technomancer carries a **Light kit slot** (see Class Chassis, above) — appropriate gear includes light armor, a resonance-tuned focus item (a personal totem, a jury-rigged antenna, a string of compiled charms), and light defensive tools, but nothing that competes for space with the sprite congregation's own board presence. A resonance-tuned focus (Echelon-appropriate) can grant an **edge on Resonance-based Power Rolls** and causes no magic erosion, since it is a mundane/technomantic item rather than integrated chrome.

---

## Frequently Asked Table Questions (Player-Facing FAQ)

*A short FAQ addendum addressing the questions most likely to come up at an actual table before the Director has memorized every ruling above.*

**Can I compile a sprite outside of combat?** Yes — Compile Sprite works identically outside combat, though outside combat you don't have a per-encounter Resonance pool actively refilling, so you're limited to the once-per-rest-or-Victory exception noted under Resonance's "Outside combat" rule.

**Do sprites need line of sight to their target, same as a normal ranged attack?** Yes, unless a specific ability says otherwise. "Wired range" for a sprite means the sprite itself needs a valid Wired connection to the target (a device, a jack, a networked system) — it is not the same as a normal ranged weapon's line-of-sight rule, but it is not unlimited either. A Data-sprite scanning a room it can't technically "see" through a wall would need that room to have a networked device in it for the sprite's senses to reach.

**What happens if I hit my sprite cap and try to compile again?** You cannot compile past your cap — Compile Sprite simply fails (or, at the table's discretion, you may choose to dismiss an existing sprite as part of the same action to make room, but this is a house-rule convenience, not a written rule).

**Can an enemy target my sprites directly?** Yes. Sprites have their own Stamina, and their own defensive profile (see the Sprite Stat Block Reference table) and can be attacked, suppressed, or hacked like any other actor on the board — this is precisely why Ward-sprites and the Sprite Redirect ability exist.

**Does Resonance Mending work on my own chrome, or only on allies'/drones'?** Both. "Self" is always a valid target for Resonance Mending's base effect.

**If I'm a Machine-Whisperer, can I mend a Cyborg who isn't in my party — say, an NPC or an enemy who surrenders?** Mechanically, yes — Resonance Mending doesn't restrict targeting to allies only, it restricts by target *type* (machine, drone, vehicle, chrome, or Cyborg). Whether the fiction allows it (would a corp Cyborg trust a runner shaman's hands on their chrome?) is a roleplay question for the table, not a rules restriction.

**Can a sprite "die" permanently, or does it always come back next encounter?** A sprite destroyed in combat (reduced to 0 Stamina) is gone for that encounter. At the start of your next encounter, you begin fresh with zero sprites compiled and must re-compile from scratch — sprites are not persistent assets like a Wrench's drones, they're temporary conjurations remade each fight.

**Why can't Cyborgs play this class, when the Technomancer is the one class built to help them?** This is the setting's own irony, not an oversight: Arcane Severance — the chrome-integration process that makes a Cyborg what they are — cauterizes the exact channel a Technomancer needs to touch the Wired's spirit layer. A Cyborg can receive Resonance Mending's grace, but the moment they'd need to generate that grace themselves, their own chrome forecloses it. It's the same asymmetry that makes a Street-Priest able to bless a Cyborg's soul without a Cyborg ever being able to become a Street-Priest — GHOSTWIRE's magic classes all share this one-way door with the setting's most heavily augmented archetype.

---
