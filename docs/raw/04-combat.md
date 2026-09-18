# Combat

**RAW status:** draft (Stage 3 fill 2026-09-18)  
**Sources:** class chapters (heroic resources), `docs/rulebook/10-kits.md`, `docs/masters/GHOSTWIRE_GEAR_MASTER.md` (armor as Stamina), `docs/rulebook/12-chrome.md`, `docs/rulebook/09-species.md`, `docs/raw/05-ancestries.md`, `docs/raw/08-kits-gear-wealth.md`, `docs/raw/09-chrome-body-integrity.md`, `docs/raw/21-the-wire.md`, `docs/raw/23-machines.md`, `docs/directors/equipment-use-abilities.md` (B49 / B44c)  
**Engine:** Draw Steel Heroes — shared combat loop (initiative shape, action economy math, forced movement vs stability, cover, conditions list, Malice). Ghostwire procedures below are original wording; remaps and module behavior are authoritative for this book.

---

## When a fight starts

Combat begins when someone draws, opens fire, or the Director says the quiet part is over. The fiction has already decided *why*; the table now needs a clock.

1. **Declare the fight.** Who is hostile, who is caught in the middle, and which board matters first — meatspace grid, Wire topology, or both cutting between each other (`21`).
2. **Place people.** Runners, drones, vehicles, and opposition on the active board. Note connection state for anyone Overlaid or Jacked In.
3. **Surprise.** If one side had the drop — silent approach, ambush, a Matrix Verb that never tipped Trace Alert — that side acts first for the opening beat. Otherwise everyone is already in the soup.
4. **Turn order.** Use Draw Steel’s combat turn order. Ghostwire does not invent a second initiative system. The Director may cut to a Jacked In runner’s Wire turn between meatspace turns when both boards are live.
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

Each class fuels its abilities with its own heroic resource. Unless its class chapter says otherwise, a resource follows Draw Steel’s heroic-resource timing (gain, spend, encounter boundaries).

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

**Surges and Victories** work as in Draw Steel Heroes unless a class or Wire rule says otherwise. Malice and the Director’s side live in `25`.

---

## Stamina and Recoveries

**Stamina** is how much punishment a runner (or machine) can take before they drop. Damage reduces current Stamina. Healing and Recoveries restore it, up to maximum.

**Armor is Stamina.** Worn armor raises maximum Stamina instead of subtracting from incoming damage. The only true damage reduction on the street is **typed immunity** (and similar) from sealed or hardened gear (`08`). When someone says “my plating held,” they mean the Stamina pool bought by that armor — not a separate DR layer.

**Winded.** When current Stamina falls to or below your winded value (half maximum, per Draw Steel), you are winded. The condition’s mechanical bite is the shared engine’s; Ghostwire only remaps *how you got that pool* (armor-as-Stamina, chrome, class).

**Recoveries** are your finite “patch myself / get patched” budget for the day (or until a full rest, per Draw Steel Heroes). Spending a Recovery usually restores Stamina equal to your **Recovery value**. Class features, Medic compounds, and Catch Breath all lean on that number.

**Catch Breath** (maneuver, when the shared engine allows it): spend Recoveries to climb back toward fighting shape without leaving the fight. Specific riders (Glowing Recovery, Rig Recovery, and so on) live in ancestry and class chapters — this chapter only names the shared loop.

Out of combat, rest and Recoveries follow Draw Steel Heroes, with Ghostwire downtime color in `01` and ¥ / lifestyle costs in `08`.

---

## Attacking: weapon use vs free strikes

Ghostwire heroes do **not** lean on generic Melee Free Strike / Ranged Free Strike as their default sheet attacks.

### What you use instead

1. **Class and kit abilities** — signatures, heroics, and doctrine strikes printed in `12`–`20` and kit text (`08`).
2. **Weapon use-abilities (B49)** — when a weapon treasure is on a hero, the Ghostwire module spawns a linked ability such as **Fire Chatterbox** or **Strike with Monoblade**. That ability is free-strike-*shaped* (category, keywords, kit bonus hooks) but carries **that weapon’s** range band and damage. Removing the weapon removes the ability.
3. **Improvised fallback** — no qualifying kit weapon in hand means class weapon abilities still work, but **kit bonuses and kit signature weapon riders do not** (`08`). Bare fists, a pipe, or a grabbed pistol that isn’t your kit piece are improvised.

### Module behavior (Foundry)

- **B44c:** the module **suppresses** stock Draw Steel generic free strikes on heroes and NPCs so they do not clutter new sheets.
- **B49:** equipment use-abilities replace that generic slot for owned weapons.

Table fiction and class text may still say “free strike” when an ability *grants* one (Commander Overwatch, Scout decoys, hybrid Changer +1 on melee free-strike-shaped attacks, and so on). In Foundry play, resolve those grants with a weapon use-ability, an improvised strike the Director allows, or the ability’s own printed attack — not by re-adding the stripped generics.

### Damage types

Draw Steel’s damage types are used unchanged. Ghostwire gear tags map onto them:

| Gear tag | Draw Steel damage |
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
- **Ranged** abilities and B49 weapon use-abilities print a distance (Ranged 5, 10, 20, …). Kit bonuses may extend distance on abilities that carry the right keywords (`08`).
- **Areas** (burst, cube, line, wall) use Draw Steel’s area language; Ghostwire Optics / Tech / Chrome keywords do not change how squares are counted.
- **Line of effect, cover, concealment, flanking** follow Draw Steel Heroes. Street clutter — cars, drones, neon pillars — is ordinary cover unless a Wire Overlay or Optics ability says it isn’t.
- **Forced movement** (push, pull, slide) contests **stability** as in the shared engine.
- **Wire distances** are topology and node ranges, not street squares — see `21`. A Jacked In body does not walk the grid while the mind is in the Wire.

Vehicle chases use a range track (`23`), not a crowded five-foot hallway, unless the Director drops the fight onto a parking deck mid-chase.

---

## Conditions

Ghostwire uses Draw Steel’s condition list: bleeding, dazed, frightened, grabbed, prone, restrained, slowed, taunted, weakened, and the rest the engine defines.

This chapter does not reprint those definitions. When an ability applies a condition, use the shared engine’s entry. Ghostwire-only fail states that are *not* that list:

- **Chrome Suppressed / Damaged / Destroyed** (`09`) — implant status, not a DS condition.
- **System Crisis** (Cyborg) and **inert** (Revenant) — ancestry fail states (`05`).
- **Connection Overlay / Jacked In** — Wire states with combat riders (`21`), not conditions.

If a Medic, Priest, or Program “clears a condition,” it means a Draw Steel condition unless the text names chrome or Wire state explicitly.

---

## Keywords added by Ghostwire

Ghostwire abilities use Draw Steel’s keywords plus:

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

- **Jacked In:** the runner’s body is inert on the meatspace board and can’t take real-world actions; allies usually guard it. Wire turns and Matrix Verbs are their fight (`21`).
- **Overlaid:** the runner still stands on the street grid but takes a **bane** on real-world Power Rolls while the Wire hangs in their vision.
- **Biofeedback** from the Wired deals damage to the runner’s Stamina when the Wire hits back (`21`).

Cutting between boards mid-round is normal. Finish one action on one board, then cut.

---

## Chrome under fire

An implant can be **Suppressed** (temporarily offline), **Damaged** (works at a penalty until repaired), or **Destroyed** (benefit lost until repaired or replaced) (`09`). EMP, hostile deckers, and some workings target chrome without necessarily dropping the runner’s Stamina first.

Caster soft-cap / Weave Strain for magic-primary classes is a chrome install rule (`09`), not a per-hit combat condition — but it still bites every casting Power Roll while over the cap.

---

## Dying, defeated, and ancestry fail states

### Shared loop

When Stamina hits **0**, the runner is **dying** (or otherwise defeated per Draw Steel Heroes — winded thresholds, death saves / dying track, and what “defeated” means for nameless opposition). Allies can stabilize, heal, or drag them clear. Medics and several class apexes interact with that line explicitly (`15` and others).

**Defeated** opposition is usually out of the fight: fled, unconscious, bound, or dead, Director’s call for the fiction. Named threats may use the full dying rules; mooks often just drop.

### Cyborgs — System Crisis

**Full Cyborgs** do not take the normal organic death spiral when they would die under the usual 0 Stamina / dying rules. They enter **System Crisis** — machine failure, Director-facing — instead (`05`). They also use **tech-only recovery**: Magic healing does not restore them; Wrench repair, Medic tech procedures, and similar do.

A full System Crisis table is not locked yet; the Director adjudicates severity (reboot, limp-home mode, brick). Point players at `05` and `09` when Crisis triggers.

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
2. **Heroic resources.** Most reset or settle per class / Draw Steel encounter boundaries. **Reagents stay where they are.**
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
| Foundry free-strike strip + weapon Fire/Use | B44c / B49 (`docs/directors/equipment-use-abilities.md`) |
