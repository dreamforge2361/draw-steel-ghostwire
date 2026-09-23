# Combat

**Engine:** Ghostwire combat procedures in this chapter. Playable without a separate rulebook.

---

## When a fight starts

Combat begins when someone draws, opens fire, or the Director says the quiet part is over. The fiction has already decided *why*; the table now needs a clock.

1. **Declare the fight.** Who is hostile, who is caught in the middle, and which board matters first — meatspace grid, Wire topology, or both cutting between each other (`21`).
2. **Place people.** Runners, drones, vehicles, and opposition on the active board. Note connection state for anyone Linked, Overlaid, or Jacked In.
3. **Surprise.** If one side had the drop — silent approach, ambush, a Matrix Verb that never tipped Trace Alert — that side acts first for the opening beat. Otherwise everyone is already in the soup.
4. **Turn order.** Each combatant who can act takes one turn per round. If surprise is unclear, the Director picks who starts from the fiction (the side that opened fire, the runner who jacked in first). Then alternate **crew** and **opposition** in an order the table can track — or use the Foundry combat tracker if you are on Foundry. Ghostwire does not invent a second initiative stat. The Director may cut to a Jacked In runner’s Wire turn between meatspace turns when both boards are live.
5. **Resources tick.** Classes that gain heroic resource at the start of combat or the start of their turn do so per their class chapter. **Medic Reagents do not reset** when a fight starts or ends.

Once the first turn begins, you are in **rounds**.

---

## Rounds, turns, and actions

A **round** is one full pass around the table: every combatant who can act gets a turn, then the round ends and the next begins.

On **your turn**, you normally get:

| Budget | What it is for |
|---|---|
| **Main action** | The big beat — a strike, a heroic ability, Deploy, a Matrix Verb, Catch Breath, most kit signatures |
| **Maneuver** | Setup, utility, secondary pressure — Mark, Reload flavor, short tech tricks, many support abilities |
| **Move action** | Spend your Speed in squares (or the Wire’s movement rules when Jacked In) |
| **Free / triggered** | Only when an ability or the situation hands them to you — opportunity pressure, free triggered riders, some chrome reflexes |

You can take your main, maneuver, and move in any order. Triggered actions interrupt when their trigger fires, even off your turn.

**Ghostwire table language:** say “I Fire Chatterbox,” “I Deploy the swarm,” “I Overlay and glass the node,” not “I use my free strike.” The sheet should match that language (see Weapon use below).

If an ability costs a **heroic resource**, check the cost before you commit. You cannot spend what you do not have.

---

## Heroic resources in a fight

Each class fuels its abilities with its own heroic resource. Unless its class chapter says otherwise: gain the printed amount at the **start of combat** and/or the **start of your turn**; spend on printed costs; leftover usually **dumps when the fight ends**.

| Class | Resource | Notable combat rule (see class chapter) |
|---|---|---|
| Operator | Adrenaline | — |
| Scout | Advantage | Reading the target; surges |
| Commander / Face | Influence | Gained from combat and social Marks |
| Medic | **Reagents** | **Persist between encounters** — they don’t reset when combat ends or starts, and they’re spent even outside combat |
| Wrench | Uptime | Earned and drained by the machines you field |
| Elementalist | Essence | Sustained workings cost Essence each turn |
| Street Priest | Conviction | Per-turn drip; Light or Dark pact |
| Hacker | Bandwidth | Spent on Programs |
| Technomancer | Resonance | Sprites; biofeedback when overreaching |

**Cost check:** in combat, a runner can’t use a heroic ability that costs more of their resource than they currently have.

**Victories** (job-beat wins that also feed some class resources) live in `24`. **Malice** and the Director’s side live in `25`.

**Surges (this book).** A **surge** is a one-use damage bonus. You hold it until you spend it or the encounter ends, unless the ability that granted it names a shorter clock.

- **Gain:** when an ability says you (or an ally) gain one or more surges, mark them on the sheet.
- **Spend:** when you deal damage with a strike or a damaging ability, you may spend **one or more** surges you currently hold. Each surge spent adds **extra damage equal to your highest characteristic** (minimum +1). Choose after you know the Power Roll result, before damage is applied.
- You cannot spend surges you do not have. Unspent surges vanish at the end of the encounter unless an ability says they last longer.

Ghostwire adds no second surge currency. Class and Wire text that “incorporates 1 or more surges” means you spent at least one surge on that damage.

---

## Stamina and Recoveries

**Stamina** is how much punishment a runner (or machine) can take before they drop. Damage reduces current Stamina. Healing and Recoveries restore it, up to maximum.

**Armor is Stamina.** Worn armor raises maximum Stamina instead of subtracting from incoming damage. The only true damage reduction on the street is **typed immunity** (and similar) from sealed or hardened gear (`08`). When someone says “my plating held,” they mean the Stamina pool bought by that armor — not a separate DR layer.

**Winded.** Your **winded value** is **half your maximum Stamina** (round down). When current Stamina is at or below that number, you are **winded**. Winded is a state abilities key off (Medic compounds, some apexes, nameless-foe drop lines). It does not add a bane by itself unless an ability says so.

**Recoveries** are your finite “patch myself / get patched” budget until the next full respite (`26`). Spending a Recovery restores Stamina equal to your **Recovery value**.

**Recovery value** is how much Stamina one Recovery restores. The hero sheet prints it. On paper, if the class chapter does not print a number, use **one-third of your current maximum Stamina** (round down, minimum 1). Class features, Medic compounds, and Catch Breath all lean on that number.

**Catch Breath** (maneuver): spend **one Recovery** to regain Recovery-value Stamina without leaving the fight, if you have a Recovery left and the Director agrees you have a breath (not mid-shove, not Jacked In and inert). Specific riders (Glowing Recovery, Rig Recovery, and so on) live in ancestry and class chapters.

Out of combat, a **respite** (`26`) lets you spend Recoveries freely, then **refills your Recovery pool** to the class maximum. Squatter rest may be incomplete (`26`). ¥ / lifestyle costs live in `08` and `26`.

---

## Attacking: weapon use vs free strikes

Ghostwire heroes do **not** lean on generic Melee Free Strike / Ranged Free Strike as their default sheet attacks.

### What you use instead

1. **Class and kit abilities** — signatures, heroics, and doctrine strikes printed in `12`–`20` and kit text (`08`).
2. **Weapon use-abilities** — when a weapon treasure is on a hero, the Ghostwire module spawns a linked ability such as **Fire Chatterbox** or **Strike with Monoblade**. That ability is free-strike-*shaped* (category, keywords, kit bonus hooks) but carries **that weapon’s** range band and damage. Removing the weapon removes the ability.
3. **Improvised fallback** — no qualifying kit weapon in hand means class weapon abilities still work, but **kit bonuses and kit signature weapon riders do not** (`08`). Bare fists, a pipe, or a grabbed pistol that isn’t your kit piece are improvised.

> **In Foundry**
> Enable **Draw Steel - Ghostwire Build** on a compatible Foundry world. Use the Foundry **combat tracker** for turn order. Owned Ghostwire weapons spawn sheet abilities named **Fire {weapon}** or **Strike with {weapon}** — roll those, not generic free strikes. The module **strips** stock Melee/Ranged Free Strike from heroes and NPCs so sheets stay clean. Ability SFX may play from the chat card when you fire.

Table fiction and class text may still say “free strike” when an ability *grants* one (Commander Overwatch, Scout decoys, hybrid Changer +1 on melee free-strike-shaped attacks, and so on). In Foundry play, resolve those grants with a weapon use-ability, an improvised strike the Director allows, or the ability’s own printed attack — not by re-adding the stripped generics.

### Damage types

Damage types in this book include acid, cold, corruption, fire, holy, lightning, poison, psychic, sonic, and untyped (kinetic). Ghostwire gear tags map onto them:

| Gear tag | Damage type |
|---|---|
| Electrical | Lightning |
| Toxin | Poison |
| Fire | Fire |
| Kinetic | Untyped |
| AP (armor-piercing) | Untyped, plus the gear’s AP note (it ignores or reduces armor-as-Stamina as that gear’s rules say) |

AP is a gear note, not a damage type.

---

## Distance and ranges (brief)

Combat uses a square grid in meatspace unless the Director switches to theater-of-mind for a chase or bar brawl.

- **Melee** reach is usually adjacent (1 square) unless an ability or weapon says otherwise.
- **Ranged** abilities and weapon use-abilities print a distance (Ranged 5, 10, 20, …). Kit bonuses may extend distance on abilities that carry the right keywords (`08`).
- **Areas** (burst, cube, line, wall) count squares from the origin the ability names. Ghostwire Optics / Tech / Chrome keywords do not change how squares are counted.
- **Line of effect:** you need an unblocked path to the target. Solid walls stop it; windows, gratings, and neon do not unless the Director says the shot is impossible.
- **Cover:** if a barrier blocks part of the line from attacker to target, the target has **cover** — the attacker takes a **bane** on the strike. Street clutter — cars, drones, neon pillars — is ordinary cover unless a Wire Overlay or Optics ability says it isn’t.
- **Concealment:** you cannot be seen clearly (smoke, dark, Overlay glare). Strikes against you take a **bane**; you may attempt Hide (`03`).
- **Flanking:** if two allies stand on opposite sides of a target (adjacent, facing through the target), melee strikes against that target gain an **edge**.
  Opposite sides means a straight line through the target: north–south, east–west, or either diagonal. Two allies crowding the same corner are not flanking. A creature that “can’t be flanked” (Mutant **Prehensile Mutation**, and anything else that prints the line) never grants that edge, and a body that is unconscious, defeated, or **meat-inert** (`21`) is not holding a side. Ranged strikes never gain the flanking edge. In Foundry this is detected from token positions automatically.
- **Forced movement** (push, pull, slide) moves the target the printed number of squares. **Stability** reduces forced movement by that many squares (minimum 0). If leftover movement would go through a solid wall, the target stops unless the ability says they break through.
- **Wire distances** are topology and node ranges, not street squares — see `21`. A Jacked In body does not walk the grid while the mind is in the Wire.

Vehicle chases use a range track (`23`), not a crowded five-foot hallway, unless the Director drops the fight onto a parking deck mid-chase.

---

## Conditions

When an ability applies a named condition, use the short glossary below unless the ability prints a different rider. **Save ends** means a saving throw (`03`) at the end of the target’s turn.

| Condition | Ghostwire read |
|---|---|
| **Bleeding** | Take damage at the start of your turn (the amount the ability printed, or **1d6** if none). Save ends. |
| **Dazed** | On your turn you may take only **one** of: main action, maneuver, or move — not all three. |
| **Frightened** | **Bane** on Power Rolls that target the source; you cannot willingly move closer to them. |
| **Grabbed** | Speed 0; you cannot move away from the grabber. |
| **Prone** | **Bane** on your strikes; melee strikes against you gain an **edge**. Stand as your move action. |
| **Restrained** | You cannot move or take move actions; **bane** on most Power Rolls. |
| **Slowed** | Your Speed becomes **2** (or the printed number) until the effect ends. |
| **Taunted** | **Bane** on actions that do not include the taunter as a target. |
| **Weakened** | **Bane** on Power Rolls. |

Ghostwire-only fail states that are *not* that list:

- **Chrome Suppressed / Damaged / Destroyed** (`09`) — implant status, not a condition from the glossary above.
- **System Crisis** (Cyborg) and **inert** (Revenant) — ancestry fail states (`05`).
- **Connection Linked / Overlay / Jacked In** — Wire states with combat riders (`21`), not conditions.

If a Medic, Priest, or Program “clears a condition,” it means a row from the glossary above unless the text names chrome or Wire state explicitly.

---

## Keywords added by Ghostwire

Ghostwire abilities use the usual action and effect keywords (melee, ranged, strike, weapon, area, magic, and so on) plus:

| Keyword | Meaning |
|---|---|
| **Tech** | Powered by machinery, not magic or psionics. Cyborgs can use it. |
| **Chrome** | Powered by an implant. |
| **Optics** | Powered by an emitter, holo, or optical system. |
| **Wired** | Acts in the Wired (connection state rules apply). |
| **Command** | Driven by command presence: orders, rallies, reads. |

Keywords tell you what can suppress, counter, or ride the ability (EMP vs Chrome, ICE vs Wired, and so on). They do not replace the action type (main / maneuver / triggered).

---

## Kits need their gear

A Kit’s bonuses and signature ability work only with an owned qualifying weapon and armor. Without them, you fight with an **improvised weapon**: class weapon abilities still work, but no Kit bonuses apply (`08`).

Disarm, confiscation, and “you woke up in a cell with a jumpsuit” are real setbacks. The runner is not helpless — they are fighting without doctrine math.

---

## Connection states in combat

Four states (`21`): **Disconnected | Linked | Overlay | Jacked In**. Connect lands in Linked. Toggle steps Linked → Overlay → Jacked In → Linked. Jack Out is the only off-ramp.

- **Linked:** on-net for comms / Broadcast only. Meat Power Rolls are **normal** (no Overlay bane). No Jacked In Wired edge. Scan, Programs, and payload Runs still need Overlay or Jacked In. Soft presence — Wire-discoverable.
- **Overlaid:** the runner still stands on the street grid but takes a **bane** on real-world Power Rolls while the Wire hangs in their vision.
- **Jacked In:** the runner’s body is inert on the meatspace board and can’t take real-world actions; allies usually guard it. Wire turns and Matrix Verbs are their fight (`21`).
- **Biofeedback** from the Wired deals damage to the runner’s Stamina when the Wire hits back (`21`). Linked has **none** (not immersed). Overlay is half (round down, min 1); Jacked In is ×1.5 (round up).

Cutting between boards mid-round is normal. Finish one action on one board, then cut.

---

## Chrome under fire

An implant can be **Suppressed** (temporarily offline), **Damaged** (works at a penalty until repaired), or **Destroyed** (benefit lost until repaired or replaced) (`09`). EMP, hostile deckers, and some workings target chrome without necessarily dropping the runner’s Stamina first.

Caster soft-cap / Weave Strain for magic-primary classes is a chrome install rule (`09`), not a per-hit combat condition — but it still bites every casting Power Roll while over the cap.

---

## Dying, defeated, and ancestry fail states

### Shared loop

When Stamina hits **0**, a **named** runner or threat is **dying**. They fall prone. At the start of each of their turns while dying, they make a saving throw (`03`):

- **Success (6+):** they stay dying but do not slide further.
- **Failure:** they take one **dying strike**. After **three** dying strikes, they **die**.

Allies can **stabilize** them (a Medicine test, a printed heal, or Catch Breath if the fiction allows). Stabilized: they stop accumulating dying strikes and sit at **1 Stamina** (or stay at 0 unconscious if the ability says so) until they take damage again. Medics and several class apexes interact with that line explicitly (`15` and others).

**Defeated** opposition is usually out of the fight: fled, unconscious, bound, or dead, Director’s call for the fiction. **Nameless** opposition (minions, most street mooks) is defeated at 0 Stamina — no dying track. Named threats may use the full dying rules.

### Cyborgs — System Crisis

**Full Cyborgs** do not take the normal organic death spiral when they would die under the usual 0 Stamina / dying rules. They enter **System Crisis** — machine failure — instead (`05`). There are no dying saves and no dying strikes: a Cyborg in Crisis is a collapsed chassis, not a bleeding body. They also use **tech-only recovery**: Magic healing does nothing for them; Wrench repair, Medic tech procedures, and similar do.

**Trigger.** A Cyborg hero — or a Director-flagged full Cyborg NPC — enters System Crisis the moment they would enter the dying track.

**While in Crisis.** Down, chassis locked, not dead. Magic healing does nothing. Tech repair is the recovery path. The body can be carried.

**Severity — roll 2d6.** The Director rolls once when Crisis triggers. Optional modifiers: **−1** for a soft or scrapheap chassis, **+1** for a military or overclocked one.

| 2d6 | Severity | Immediate result | Tech recovery |
|---:|---|---|---|
| 2–3 | **Brick** | The chassis locks. Treat as unconscious until a Repair Project (goal 60, parts about half a week of Middle Lifestyle) or a Machine God’s Rite or equivalent finishes. Can be carried. | No field reboot |
| 4–5 | **Cascade** | One random installed living Chrome Item escalates **one** step on the chrome damage track (`09`), stopping at Destroyed. Then treat the Crisis as **Limp-Home**. If no living Chrome is installed, it is Limp-Home with a bane on the reboot roll. | Limp-Home, then deal with the chrome |
| 6–8 | **Limp-Home** | Down until rebooted. After the reboot: Stamina equal to the Recoveries spent (minimum 1), speed halved, and a bane on tests until a full respite or a Field Repair. | Reboot now |
| 9–10 | **Soft Reboot** | Down until rebooted. After the reboot: Stamina from Recoveries, no lasting bane. The reboot itself spends 1 Recovery. | Ally maneuver reboot, or a printed self-reboot |
| 11–12 | **Failover** | Spend 1 Recovery, stand with that Stamina, no aftermath. Once per respite — a second Crisis in the same respite is **Limp-Home** instead. | Recovery only |

**Reboot procedure.** An adjacent ally with Repair, Medicine, or Cybertech — or a Wrench or Medic — spends a **maneuver** and makes a Power Roll to bring the chassis back online. A Cyborg can self-reboot only on **Soft Reboot** or **Failover**, and only with at least 1 Recovery left. A **Brick** never field-reboots without the Project or a named ability that says so.

**What Crisis is not.** It is not organic dying saves. It is not chrome Suppressed / Damaged / Destroyed applied to the Cyborg as a whole (`09`) — Cascade is the only row that touches living Chrome at all, and it does so through the ordinary chrome track. It is not a Body Integrity debit, and it never deletes an Item.

In Foundry the severity table ships as the **Cyborg System Crisis** RollTable in the Ghostwire encounters compendium.

### Revenants — inert

When a **Revenant’s** Stamina reaches the **negative of their winded value**, they become **inert** instead of dying (`05`). They fall prone and can’t stand. They still observe, but they can’t speak or take main actions, maneuvers, move actions, or triggered actions. **Fire damage while inert destroys the body permanently.** Otherwise, after **12 hours**, they regain Stamina equal to their Recovery value.

Treat inert as “down but not gone” unless fire finishes the job.

---

## Machines in combat

Drones and vehicles fight on the same meatspace grid as runners.

- Anyone can run **one** drone within ordinary limits.
- **Wrenches** field fleets, spend **Uptime**, and can Jump In (`16`, `23`).
- Machine Stamina / Integrity and what “destroyed” means for a hull are in `23`.
- Vehicle chases use a **range track**; boarding actions can dump people back onto a normal grid mid-scene.

A drone’s attack is still an ability use — often a Wrench command — not a generic free strike.

---

## Ending combat

Combat ends when the Director says the threat is over: hostiles fled, surrendered, dead, or the crew aborted and ran.

Then:

1. **Drop initiative.** Return to scene time (`01`).
2. **Heroic resources.** Most reset or dump when the fight ends, per the class chapter. **Reagents stay where they are.**
3. **Trace Alert, heat, and clocks** do not auto-clear — Wire and street consequences persist (`21`, `25`).
4. **Chrome and machines** that were Damaged or wrecked stay that way until repaired (`09`, `23`).
5. **Victories / Malice bookkeeping** follows the shared engine and `25`.
6. **Short breath or push on.** Catch Breath and Recoveries may still be available if the fiction allows a pause; a running gunfight into the next block may not.

If the crew Jacked out mid-fight, resolve whether bodies left behind were secured. An unattended Jacked In runner is a narrative hostage situation waiting to happen.

---

## Director quick reference

| Need | Where |
|---|---|
| Power Rolls, edges/banes | `03` |
| Peoples fail states (Crisis / inert) | `05` |
| Kits, armor-as-Stamina, improvised | `08` |
| Chrome Suppress/Damage/Destroy | `09` |
| Class resources and heroics | `12`–`20` |
| Wire boards and biofeedback | `21` |
| Drones / vehicles | `23` |
| Opposition / Malice | `25` |
