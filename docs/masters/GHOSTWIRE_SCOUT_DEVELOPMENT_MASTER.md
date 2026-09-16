# GHOSTWIRE_SCOUT_DEVELOPMENT_MASTER

*This is the SINGLE SOURCE OF TRUTH for the Scout class as of 2026-07-29 (v2 refactor). All future Scout-class design, rules, and Foundry-implementation work — across every session — must reference and update THIS file, and only this file. Do not create new Scout-class markdown files; edit this one in place, the same way `GHOSTWIRE_BUILD_LOG_CANONICAL.md` is treated for build-log state and the Elementalist / Operator / Hacker masters are treated for those classes.*

*Last updated: 2026-07-29 (v2 refactor + attribute canon correction). Ground truth for Part 1 is (a) the DS Shadow class SRD mechanical spine (Steel Compendium, `https://steelcompendium.io/compendium/main/Rules/Classes/Shadow/`, retrieved 2026-07-29) reskinned into GHOSTWIRE, layered against (b) the **GHOSTWIRE core rulebook lore chapters** (Ossian Reach; The Overlords / Ten Conglomerates; The Wired; The Peoples; You Are a Ghost on the Wire) and the Wren Sable-Corvin Scout dossier — the **only canonical Scout material in-setting**. Attribute names follow the locked GHOSTWIRE convention: display label first, real DS attribute in parentheses — e.g. Reflex (Agility).*

> **Attribute canon correction (2026-07-29):** the five GHOSTWIRE characteristics are **Physique (Might)**, **Reflex (Agility)**, **Logic (Reason)**, **Instinct (Intuition)**, and **Persona (Presence)** per the Foundry Build Log V2 doctrine correction. This document originally shipped using the defunct labels "Reflexes (Agility)" (plural — wrong) and "Cognition (Reason)" (wrong attribute name); all such references have been rewritten to the canonical Reflex (Agility) and Logic (Reason). No mechanical values changed.

*Design conversation, 2026-07-29 v2 (verbatim Michael directives applied):*
- *Use only the core rulebook **lore** sections; the rules in the core PDF are defunct — do not reference them for mechanics.*
- *Replace all placeholder corp names (Ares, Aztechnology) with corporations from the GHOSTWIRE lore section (the Ten Conglomerates).*
- *Define **surge** near the point it is used (glossary drift eliminated).*
- *Remove all magic flavor. The Scout is not a magic class in GHOSTWIRE. Every "magic" ability is reflavored as a **technology edge** — nanotech, microdrone, drone-tech, chrome, dermal holo, tactical grapnel, chem-injector, etc. — explained as part of the Scout's technology training.*
- *Remove the Harlequin subclass — wrong imagery — and replace with a different street-independent option.*
- *Three subclasses by **role**: one **long-range sniper specialist**, one **infiltrator (fast-moving, heavy)**, one **melee (close-up and personal)**.*

*The three subclasses were re-anchored to the canonical GHOSTWIRE master-baseline Scout roster (**Ghost / Hunter / Face-in-crowd**, per §E2 and the "class-roster correction" note that names those three as the Scout's canonical subclass triad), then mapped to Michael's roles as follows:*
- *Long-range sniper = **Hunter** (mark-and-track marksman — the canonical Wren Sable-Corvin build). Corp academy: **Ironclad Longshot Division**.*
- *Melee close-quarters = **Ghost** (fade-and-blade knife-work; DS Black Ash mobility abilities reskinned to tactical grapnel/blink-harness). Corp academy: **Ferrum Dynastic Deep-Dark Program**.*
- *Infiltrator fast-moving = **Face-in-crowd** (blend, mask, and vanish; DS Harlequin Mask illusion abilities reskinned to holographic dermal projection). Street independent: **Nyx Cartel Mask-Line**.*

*Species note (Michael, 2026-07-29): the class is **species-agnostic**. Wren Sable-Corvin's Wereraven build is one canonical exemplar of the class, not the mold. Any of the Nine Peoples (Pure Human, Cyborg, Changer, Mutant, Revenant, Elvani, Corran, Goliar) may be a Scout of any subclass. Wereraven imagery is intentionally kept out of the class chassis.*

---

## PART 1 — PLAYER-FACING: THE SCOUT

### Who You Are

You are a **Scout** — on a clean corp badge an *"asymmetric-operations specialist,"* on the street a **ghost**, a **shade**, a **kite**, or simply *the knife*. You are the crew's infiltrator, its marksman, its long eye, and its assassin — the runner who is somewhere else the moment the fight arrives, and who has already left the moment the fight is over. Where the Operator wins the firefight with drilled discipline and chrome-forward stopping power, and the Hacker wins it by owning the Wired, and the Elementalist wins it by rewriting the battlefield — **you win it by never being in the fight the enemy thought they were in.** You are somewhere else. You are behind them. You look like their friend. Their next breath is your last favor to them.

Your power is neither spellcraft nor raw force of arms — the Scout is a **fully mundane class**, no Veil, no Signal, no innate magic. Your edge is the **read**: the disciplined study of an enemy's tells, their footwork, the fraction of a second they hesitate before a decision — feeding a tactical stack of chrome and gear that turns that read into precision. From that read you bank **Advantage**, a Heroic Resource that swells as the fight goes on and spends into precision strikes, escapes, misdirections, and — when you have built enough of it — kills so decisive the target is dead before they know they have been engaged.

You trained at one of three institutions, each of which shaped what kind of Scout you became: two are **corporate black-programs** — **Ironclad's Longshot Division** for the rooftop marksman, and **Ferrum Dynastic's Deep-Dark Program** for the close-quarters knife-work — and the third is the **Nyx Cartel Mask-Line**, the underworld crew that owns the face-thief trade the corps have been trying to break for a decade. Your school is your subclass. Corp Scouts often defect, and Nyx Scouts sometimes take a corp contract; either way, when the run starts, you belong to the crew.

You are the definitive **Edgerunner** in the shadow-specialist role. Corp records list you as an *"asymmetric-operations specialist"* while the street calls you a **ghost**, a **shade**, a **knife**, a **kite**, or — if you rolled out of a Nyx Mask-Line — **a mask**.

### Class Chassis

| Stat | Value |
|---|---|
| **Core Characteristics** | Reflex (Agility), Logic (Reason) |
| **Heroic Resource** | Advantage |
| **Epic Resource / Capstone** | Subterfuge (10th level) |
| **Starting Stamina** | 18 |
| **Stamina per Level** | +6 |
| **Recoveries** | 8 |
| **Kit Slot** | Light Kit (Cloak & Dagger / Rapid-Fire / Longshot) — weapon-and-armor loadout, chrome-friendly |
| **Skills** | You gain **Hide** and **Sneak** free, then choose any **five** additional skills from Criminal Underworld / exploration / interpersonal / intrigue groups. (Quick Build: Criminal Underworld, Hide, Lie, Pick Lock, Pick Pocket, Sabotage, Sneak.) |

*Design note (chassis rationale, per DS SRD "you also possess more skills than any other hero" + GHOSTWIRE's Edgerunner-native infiltrator identity): the Scout is a mobile, low-Stamina, skill-heavy class. Starting Stamina sits at 18 — below the Operator's 21 — with the same 8 Recoveries and +6/level scaling. The Scout survives by never being where the shot lands, not by soaking it. Species mods (e.g. Wereraven +2 Insight, Corran heavy-frame bonus Stamina, Cyborg chassis package) stack on top of the class chassis in the standard way.*

### Advantage — Your Heroic Resource

Advantage is the Scout's fuel, and it explicitly represents **the read** — the way a trained runner watches an enemy for the fraction of a second in which they have committed to a bad decision, and cashes that read into precision. Rules text in the class-baseline sense follows DS Shadow's Insight economy, GHOSTWIRE-renamed, and is locked to the master baseline §E2 (Scout — Advantage) which is the source of truth for numeric pool, cap, income, and heroic-cost values.

**Advantage in Combat.** At the start of a combat encounter or other stressful situation tracked in rounds (Director's call), you gain Advantage equal to your Victories — the Scout arrives already partially read-in on the situation (same on-ramp every class gets). At the start of each of your turns during combat, you gain **1d3 Advantage** (rising to **1d3+1** at 7th level via **Sharper Eye**, formerly DS's Keen Insight).

Additionally, the first time each combat round that you deal damage incorporating **1 or more surges** (see the **Surge** box, below, for the full definition), you gain **1 Advantage** (rising to **2** at 4th level via **Surge of Advantage**, formerly Surge of Insight, and **3** at 10th level via **Death Pool**).

Whenever you use a heroic ability that makes use of a **power roll**, that ability costs 1 fewer Advantage if you have an **edge** or **double edge** on it. If the ability has multiple targets, the cost is reduced even if the ability gains an edge or has a double edge against only one target. *This is the same "trained shadow spending less to press an opening" rule DS wrote for Insight — kept verbatim in spirit, renamed for the setting.*

You lose any remaining Advantage at the end of the encounter.

> **What is a Surge?** *(Inline definition — the term is used repeatedly in this document. Defined here so it is never more than a paragraph away from the ability that spends it.)*
>
> A **surge** is a stored, one-shot damage-boost token — narratively, the tactical read paying off on the trigger pull, the cut, or the placed shot. Mechanically, a surge is banked by the character (Coat the Blade, Careful Observation, Ghost Suite, Trained Assassin, and several signatures generate surges) and spent by adding **+2 damage to a strike (Echelon 4)**, scaling **+3 damage at Echelon 3, +4 at Echelon 2, +5 at Echelon 1**. A single strike can incorporate multiple surges, stacking. Surges never persist between encounters — any unspent surge is lost at encounter end. *(This inline definition is the current playtest value inherited from DS. When the master baseline's numeric damage/status pass locks the exact per-Echelon surge value, it will migrate to a shared glossary in `master_rules_baseline.md`; this doc will retain the inline definition and cross-reference the glossary.)*

**Advantage Outside of Combat.** You can't gain Advantage outside of combat, but you can still use your heroic abilities and effects that cost Advantage without spending it. Whenever you use an ability or effect outside of combat that costs Advantage, you can't use that same ability or effect outside of combat again until you earn 1 or more Victories or finish a respite. When you use an ability outside of combat that lets you spend **unlimited** Advantage on its effect (such as the Ghost subclass's **Grapnel-Blink**), you can use it as if you had spent an amount of Advantage equal to your Victories.

**Firewall note:** Advantage is a class resource on the BP/class side of the firewall. It never touches **nuyen** or **Body Integrity**, and chrome never generates it directly. The Ghost Suite optical-camo array (6th-level class feature) and other Scout chrome may **support** Advantage-fueled workings but never bank Advantage.

*Design note (Advantage vs. DS Insight — Michael's 2026-07-29 rename decision): The name captures the shadowrunner reading their mark, and it does not collide with the DS system term "Edge" (a distinct DS mechanic representing a bonus/penalty tier on rolls). The gameplay economy is unchanged from DS Insight — Advantage is the same 1d3-drip-plus-surge-bumps resource paying the same tiered ability costs. Only the label changed.*

### Signature Abilities

Every Scout chooses **one** signature ability at 1st level — your baseline, no-Advantage-cost option, all rolled with Reflex (Agility). *(Quick Build: **Teamwork Has Its Place.**)*

| Signature | Advantage Cost | Type | Target | Damage (T3/T2/T1) |
|---|---|---|---|---|
| **Gasping in Pain** | 0 | Melee 1, Strike, Weapon, Main | 1 creature | 3+chr / 5+chr / 8+chr; on T1, I<STRONG → prone. **Effect:** One ally within 5 of target gains 1 surge. |
| **I Work Better Alone** | 0 | Melee 1 or Ranged 5, Strike, Weapon, Main | 1 creature | 3+chr / 6+chr / 9+chr. **Effect:** If the target has none of your allies adjacent to them, you gain 1 surge **before** making the power roll. |
| **Teamwork Has Its Place** | 0 | Melee 1 or Ranged 5, Strike, Weapon, Main | 1 creature or object | 3+chr / 6+chr / 9+chr. **Effect:** If any ally is adjacent to the target, you gain 1 surge **before** making the power roll. |
| **You Were Watching the Wrong One** | 0 | Melee 1, Strike, Weapon, Main | 1 creature | 3+chr / 5+chr / 8+chr. **Effect:** If you have one or more allies within 5 of the target, you gain 1 surge. If you are flanking the target when you use this ability, choose one flanking ally — that ally also gains 1 surge. |

*`chr` above always means your Reflex (Agility) score.*

*Design note: the four signatures come **direct from the DS Shadow SRD** with names and mechanics preserved — the names are already flavor-neutral (they read cleanly at a shadowrunner's back-alley knife-work). Only the resource label — Advantage — differs. Mechanics carry over 1:1.*

### Heroic Abilities — Cost Tiers 3 Through 11

Heroic Abilities are the Scout's paid workings — chosen by cost tier as you level, each an Advantage-fueled release of the read you have been banking. Costs (3 / 5 / 7 / 9 / 11) mirror the DS Shadow ladder and match the master baseline §E2 heroic-cost pass. The Scout's tier abilities are direct DS Shadow reskins with names preserved except where a name carried fantasy-only flavor — those renames are called out in a `Reskin` column.

**Magic scrubbing (v2 refactor):** two DS Shadow tier abilities (Shadowstrike, Speed of Shadows) carried a DS "Magic" keyword and one (Blackout) carried DS "Magic" cloud flavor. In GHOSTWIRE the Scout is mundane — *there is no Magic keyword on any Scout ability.* Shadowstrike and Speed of Shadows are re-cast as **cyber-adrenaline overclock** techniques (a nervous-system dump that lets the runner strike two-to-four times in a quarter-second window; keyword `Chrome`). Blackout's cloud is re-cast as a **flash-emitter dispersal** (a broad-spectrum optical/EMP screen from a wrist-emitter or Ghost Suite pulse; keyword `Optics`). Corruption damage across the doc is reskinned to **thermal-optic pulse** damage (see per-ability rows).

*On our reversed Outcome Tiers (Tier 1 = 17+ = best).*

#### 3-Advantage Tier (chosen at 1st level; source: DS Shadow SRD 3-Insight ability)

| Ability | Advantage Cost | Type | Target | Damage/Effect (T3/T2/T1) | Reskin Notes |
|---|---|---|---|---|---|
| **Disorienting Strike** | 3 | Melee 1, Strike, Weapon, Main | 1 creature | 4+chr; slide 2 / 6+chr; slide 3 / 10+chr; slide 5. **Effect:** You can shift into any square the target leaves when you slide them. | Name kept. |
| **Eviscerate** | 3 | Melee 1 or Ranged 5, Strike, Weapon, Main | 1 creature | 4+chr; A<WEAK, bleeding (save ends) / 6+chr; A<AVG, bleeding (save ends) / 10+chr; A<STRONG, bleeding (save ends) | Name kept. |
| **Get In Get Out** | 3 | Melee 1, Strike, Weapon, Main | 1 creature | 5+chr / 8+chr / 11+chr. **Effect:** You can shift up to your speed, dividing that movement before or after your strike as desired. | Name kept — reads perfectly street. |
| **Two Throats at Once** | 3 | Melee 1 or Ranged 5, Strike, Weapon, Main | 2 creatures or objects | 4 damage / 6 damage / 10 damage | Name kept. |

*(Quick Build: **Get In Get Out.**)*

#### 5-Advantage Tier (chosen at 1st level; source: DS Shadow SRD 5-Insight ability)

| Ability | Advantage Cost | Type | Target | Damage/Effect (T3/T2/T1) | Reskin Notes |
|---|---|---|---|---|---|
| **Coup de Grâce** | 5 | Melee 1 or Ranged 5, Strike, Weapon, Main | 1 creature | 2d6+7+chr / 2d6+11+chr / 2d6+16+chr | Name kept (street and corp both use it). |
| **One Hundred Throats** | 5 | Melee, Weapon, Main | Self; see below | Shift up to your speed; make one power roll targeting up to three enemies who came adjacent during the move. 3 damage / 6 damage / 9 damage | Name kept. |
| **Setup** | 5 | Ranged 5, Strike, Weapon, Main | 1 creature | 6+chr; R<WEAK, damage weakness 5 (save ends) / 9+chr; R<AVG, damage weakness 5 (save ends) / 13+chr; R<STRONG, damage weakness 5 (save ends) | Name kept — reads shadowrunner. |
| **Neurospike** | 5 | Chrome, Melee, Ranged, Main | Self; see below | You use a strike signature ability **twice.** | **Renamed from DS "Shadowstrike."** Magic keyword removed. Narratively: a cyber-adrenaline dump from a wired-reflex implant (Body Integrity chrome) firing two strikes inside a quarter-second window. Available to any Scout with any chrome loadout — no awakened restriction. |

*(Quick Build: **Coup de Grâce.**)*

#### 7-Advantage Tier (chosen at 3rd level; source: DS Shadow SRD 7-Insight ability)

| Ability | Advantage Cost | Type | Target | Damage/Effect (T3/T2/T1) | Reskin Notes |
|---|---|---|---|---|---|
| **Dancer** | 7 | Maneuver, Self | Self | Until end of encounter, whenever an enemy moves or is force-moved adjacent to you or damages you, you can take the Disengage move action as a free triggered action. | Name kept. |
| **Misdirecting Strike** | 7 | Melee 1 or Ranged 5, Strike, Weapon, Main | 1 creature | 9+chr / 13+chr / 18+chr. **Effect:** The target is taunted by a willing ally within 5 squares of you until end of target's next turn. | Name kept. |
| **Pinning Shot** | 7 | Ranged 5, Strike, Weapon, Main | 1 creature | 8+chr; A<WEAK, restrained (save ends) / 12+chr; A<AVG, restrained (save ends) / 16+chr; A<STRONG, restrained (save ends) | Name kept — clean firearms read. |
| **Staggering Blow** | 7 | Melee 1 or Ranged 5, Strike, Weapon, Main | 1 creature | 7+chr; M<WEAK, slowed (save ends) / 11+chr; M<AVG, prone & can't stand (save ends) / 16+chr; M<STRONG, prone & can't stand (save ends) | Name kept. |

#### 9-Advantage Tier (chosen at 5th level; source: DS Shadow SRD 9-Insight ability)

| Ability | Advantage Cost | Type | Target | Damage/Effect (T3/T2/T1) | Reskin Notes |
|---|---|---|---|---|---|
| **Flash-Screen** | 9 | Area, Optics, Maneuver | 3 burst | A broad-spectrum flash-emitter pulse fills the area until end of your next turn, granting you and your allies **concealment** against enemies (dazzled sensors, thermal-white, HUD saturation). While you are in the area, whenever an enemy ends their turn in the area, use a free triggered action to shift to a new location within the area and make a free strike against them. | **Renamed from DS "Blackout"** and Magic keyword replaced with **Optics**. Cloud is a chrome-generated flash/EMP screen from wrist-emitter or Ghost Suite pulse — no magic. |
| **Blindside Shift** | 9 | Chrome, Melee 1, Strike, Weapon, Main | 1 creature or object | You and the target are removed from the encounter map until the start of your next turn (a cyber-reflex-driven grapple-and-vanish behind the nearest column, into a maintenance duct, over a railing, etc.). You reappear in the spaces you left or the nearest unoccupied spaces. Power roll on return: 8+chr thermal-optic pulse / 13+chr / 17+chr | **Renamed from DS "Into the Shadows"** — Magic keyword replaced with **Chrome**. Narratively a wired-reflex/microjet snatch-and-drag; damage type is a Ghost Suite emitter pulse fired on return, not shadow magic. |
| **Rooftop Rush** | 9 | Area, Melee, Weapon, Main | 10×1 line within 1 | 10 damage / 14 damage / 20 damage. **Effect:** You disappear before making the power roll (mag-grip parkour vault + optical stutter). After the roll is resolved, you appear in the first unoccupied space at the far end of the line. | **Renamed from DS "Shadowfall"** to drop the fantasy verb. Purely gear-driven — the mag-grip harness and Ghost Suite optical-camo do the work; no magic keyword. |
| **You Talk Too Much** | 9 | Melee 1 or Ranged 5, Strike, Weapon, Main | 1 creature | 10+chr; P<WEAK, dazed (save ends) / 15+chr; P<AVG, dazed (save ends) / 21+chr; P<STRONG, dazed (save ends). **Effect:** The target can't communicate with anyone until the end of the encounter (larynx shot / commlink jam). | Name kept — iconic Scout apex. |

#### 11-Advantage Tier (chosen at 8th level; source: DS Shadow SRD 11-Insight ability)

| Ability | Advantage Cost | Type | Target | Damage/Effect (T3/T2/T1) | Reskin Notes |
|---|---|---|---|---|---|
| **Assassinate** | 11 | Melee 1, Strike, Weapon, Main | 1 creature or object | 12+chr / 18+chr / 24+chr. **Effect:** A target who is **not** a minion, leader, or solo creature and who is **winded** after taking this damage is reduced to 0 Stamina. | Name kept — the Scout's signature apex. |
| **Kill-Zone Mesh** | 11 | Area, Optics, Main | 2 burst | 11 thermal-optic damage; A<WEAK, restrained (save ends) / 16 thermal-optic damage; A<AVG, restrained (save ends) / 21 thermal-optic damage; A<STRONG, restrained (save ends) | **Renamed from DS "Shadowgrasp"** — Magic keyword removed. Narratively: a rapidly-deployed micro-emitter mesh (throwable, low-yield thermal lasers on tripwire) that paints a kill-zone. |
| **Overclock Cascade** | 11 | Chrome, Main | Self | You use a strike signature ability **four times**, use one that gains an edge **three times**, or use one that has a double edge **twice.** You can shift up to 2 squares between each use. | **Renamed from DS "Speed of Shadows"** — Magic keyword replaced with **Chrome**. Narratively: a full cyber-adrenaline overclock burn — the runner's wired-reflex chrome runs at redline for a single second. Body Integrity cost is heavy: any Scout with Standard-tier or above wired-reflex chrome (any subclass) can select this ability. |
| **They Always Line Up** | 11 | Area, Ranged, Weapon, Main | 5×1 line within 5 | 12 damage; M<WEAK, slowed (save ends) / 18 damage; M<AVG, slowed (save ends) / 24 damage; M<STRONG, slowed (save ends) | Name kept — clean firearm read (the Longshot Division's calling card). |

*No awakened-only ability restrictions in this class.* All heroic abilities are available to every Scout regardless of subclass. Chrome tags (`Chrome`, `Optics`) are narrative descriptors, not gating tags.

### Scout Subclasses

Three subclasses, one per role, per Michael's 2026-07-29 v2 directive: **long-range sniper (Hunter — Ironclad Longshot Division), infiltrator (Face-in-crowd — Nyx Cartel Mask-Line), melee close-quarters (Ghost — Ferrum Dynastic Deep-Dark Program)**. Each grants a starting skill, one or two 1st-level features, a College Triggered Action, a starter Kit recommendation, and unlocks its own 2nd/5th/6th/8th-level features plus 5/9/11-cost College Abilities.

*Rules-wise, each subclass reskins one DS Shadow College with the college's mechanical spine kept intact and all magic/keyword text scrubbed to tech-branded equivalents. Where a DS ability was pure magic (Ash Teleport, I'm No Threat), the reskin explains the effect as a specific piece of Scout technology — nano-grapnel harness, holographic dermal projection, chemical-injector rig, etc.*

---

#### Hunter — *"the Longshot"* — Ironclad Longshot Division (Corporate Academy)

**Reskin of DS Shadow's canonical "Hunter" archetype (the marksman/tracker). Michael's role: long-range sniper specialist.**

Ironclad is one of the "and around them turn the rest" bracket of the Ten Conglomerates — the enforcement/security/mercenary contractor that supplies corp-army teeth to whichever conglomerate is paying that week. Its **Longshot Division** is a corp black-program built around a single premise: *the fight the sniper wins is the one that never begins.* Longshot Scouts are trained in optics, ballistics, static-position observation, and Ironclad's proprietary sensor-fusion smartlink stack — the marksman who reads a room from four hundred meters up, tags the mark, and calls the shot before their team's boots have crossed the threshold.

Officially "long-range assessment and precision-intervention specialist." Street name: **the Longshot**, **kite**, **the eye**, or — Ironclad's own — **shot number one**. Grants the **Survival/Tracking** skill. Starter Kit: **Longshot** (long-range rifle + light armor; +2 to first strike against an unaware target).

*This is the canonical Wren Sable-Corvin build path (a Wereraven Hunter is one exemplar of this subclass, but any species can be a Longshot).*

| Level | Feature/Ability | Type |
|---|---|---|
| 1 | Quarry (mark-as-track: always know a Marked target's direction/distance and gain a first-strike-per-round damage bump) | 1st-level college feature |
| 1 | Ranged Reflex (edge on ranged strikes vs. Marked targets while you are at Ranged 5+ from them) | 1st-level college feature (2nd feature) |
| 1 | Survival/Tracking (skill) | Skill grant |
| 1 | Steady the Scope (triggered: on being detected/interrupted at ranged distance, hold the shot and gain 1 surge) | College triggered action |
| 2 | Cold Read (each round, first Marked target hit at Ranged 5+ becomes visible to your allies through walls/cover until end of round) | Passive feature |
| 2 | 2nd-Level Longshot Ability (choice of 2: **Called Shot (Vitals)** / **Called Shot (Comm-link)**) | Ability grant |
| 5 | Range Discipline (your Ranged 5 abilities extend to Ranged 10; the first-strike-per-round Quarry bump doubles) | Passive feature |
| 6 | 6th-Level Longshot Ability (choice of 2: **Overwatch Lane** / **Ghost Round**) | Ability grant |
| 8 | Sensor-Fusion Smartlink (Marked targets have no cover from you; you can strike at Ranged 20 with the Longshot Kit) | Passive feature |
| 9 | 9th-Level Longshot Ability (choice of 2: **One Shot One Kill** / **Vantage Trap**) | Ability grant |

**Passive Features (fully mundane; no magic keywords):**

- **Quarry** (1st) — *You mark the target the way an old-line hunter marks a deer, and the mark stays.* **Maneuver, Self.** Choose one enemy within Ranged 20 that you can see. That enemy is Marked by you until end of encounter, until it dies, or until you Quarry another target. You always know a Marked target's direction and (in general terms) distance from you as long as it is within the same hive stratum, even through walls or cover. The **first** strike you make against a Marked target each round gains **+1 damage** at Echelon 4, scaling to **+2 / +3 / +4 damage** at Echelons 3 / 2 / 1. **Spend 1+ Advantage:** gain 1 surge per Advantage spent, usable only on your first strike against the Marked target this round.
- **Ranged Reflex** (1st) — Your ranged strikes gain an **edge** against any target that is at least Ranged 5 from you AND Marked by you. (Reads: the shooter finds the calm in the perch.)
- **Steady the Scope** (1st, triggered) — *You feel the wind, hold the breath, wait the beat.* **Trigger:** you would take a bane on a ranged strike from being observed, dazed, harried, or knocked off a firing position. **Effect:** ignore the bane on this strike, and gain **1 surge** usable only on this strike.
- **Cold Read** (2nd) — The first Marked target you damage at Ranged 5+ each round becomes visible to all your allies through walls and cover (thermal-signature call-out via your smartlink to their HUDs) until the start of your next turn.
- **Range Discipline** (5th) — Any Scout ability that lists Ranged 5 in its Type extends to Ranged 10 for you. Your Quarry first-strike-per-round damage bump doubles (E4: +2, E3: +4, E2: +6, E1: +8).
- **Sensor-Fusion Smartlink** (8th) — Marked targets grant you no cover benefit (your smartlink stack backs out the geometry). You can make Ranged strikes with your Longshot Kit at Ranged 20 (up from Ranged 5, per the Longshot Kit's own range extension).

**College Abilities (choose 1 of 2 at 2nd, 6th, 9th):**

| Ability | Advantage Cost | Level Unlocked | Type | Effect |
|---|---|---|---|---|
| **Called Shot (Vitals)** | 5 | 2nd | Ranged 10, Strike, Weapon, Main | 8+chr; A<WEAK, bleeding (save ends) / 12+chr; A<AVG, bleeding (save ends) / 16+chr; A<STRONG, bleeding (save ends). Deal +2 damage to a Marked target. |
| **Called Shot (Comm-link)** | 5 | 2nd | Ranged 10, Strike, Weapon, Main | 5+chr; target's next commlink/Wired action fails (comm blown out) / 9+chr; target can't communicate until end of encounter / 13+chr; target can't communicate AND takes 1 additional Wired-side biofeedback if their crew tries to contact them (per §D4). |
| **Overwatch Lane** | 9 | 6th | Ranged 20, Stance | Until start of your next turn, the first enemy per turn to enter or take an action inside a 5-square-wide firing lane you designate triggers a free Precision Strike (main-action equivalent) from you. Pure Longshot control tool. |
| **Ghost Round** | 9 | 6th | Optics, Ranged 10, Strike, Weapon, Main | You fire a subsonic, thermally-baffled Ghost Round. 9+chr / 13+chr / 17+chr. **Effect:** The target and all enemies within 5 of the target do not detect the shot's origin — they cannot use the shot as a bane against you, and cannot mark your position for their allies. On T1, you remain hidden from the target and its allies even if observed. |
| **One Shot One Kill** | 11 | 9th | Ranged 20, Strike, Weapon, Main | 15+chr / 22+chr / 30+chr. **Effect:** A Marked target who is not a minion, leader, or solo creature and who is winded after taking this damage is reduced to 0 Stamina. (Cross-references Assassinate but at long range and against a Marked target.) |
| **Vantage Trap** | 11 | 9th | Optics, Ranged 20, Zone (5-square radius circle placed on the map) | You have pre-laid the geometry of a kill zone (climb spots, mag-grip anchors, thermal-baffle wall panels, one dropped emitter). While the zone exists, you may make one free Ranged strike (main-action equivalent) per round against any enemy who enters or acts inside the zone; when you make that strike you may reposition yourself up to your speed for free. Zone lasts until end of encounter or you leave the encounter map. |

*Corp records: **long-range assessment and precision-intervention specialist, Level 3 Ironclad clearance**. Street: **longshot**, **kite**, **shot number one**, **the eye**.*

---

#### Ghost — *"the Knife"* — Ferrum Dynastic Deep-Dark Program (Corporate Academy)

**Reskin of DS Shadow's canonical "Ghost" archetype and DS Black Ash mechanical spine — the tactical-mobility close-quarters knife-worker. Michael's role: melee, close up and personal.**

Ferrum Dynastic built the hive's bones. Its ancestor-corps raised Ossian Reach's foundational levels and — per the setting canon — *has known for generations what settles in the deep dark, and paid to keep it quiet.* Ferrum's **Deep-Dark Program** is a corp wetwork cadre bred and trained to walk the sealed and abandoned strata below the Warrens and above the Sinks — the crushed corridors and dead maintenance ducts where the corps' oldest secrets are buried and where anything the Machine wants silenced can be silenced without leaving a public record. Deep-Dark operatives are close-quarters knife-workers first: they close the distance, they take the target with a blade, and they leave through a maintenance grate you did not know was there.

Their signature gear — the piece that defines the subclass — is the **Blink Rig**: a Ferrum-issue tactical mobility harness combining a micro-jet grapnel, mag-grip gauntlets, and a compressed-gas kick module. Worn under a light suit, the Rig lets a Deep-Dark operative cross 5 squares of terrain in a heartbeat — vault a railing, punch through a maintenance grate, drop three levels and stick the landing. It looks like a teleport from the target's point of view. It is not. It is very good corp engineering. *(Design note: this is the DS Black Ash "Ash Teleport" mechanic reskinned to pure tech, per Michael's 2026-07-29 v2 directive to scrub magic flavor.)*

Officially "confined-space and sub-strata operations specialist." Street name: **the knife**, **deep-dark**, **ferro**, or — Ferrum's own — **operative, deep**. Grants the **Sabotage** skill. Starter Kit: **Cloak & Dagger**.

| Level | Feature/Ability | Type |
|---|---|---|
| 1 | Grapnel-Blink (5-square rapid displacement via Blink Rig; hide-even-if-observed on arrival) | 1st-level college feature |
| 1 | Sabotage (skill) | Skill grant |
| 1 | Rig Recovery (triggered: on damage, take half + Blink 4 squares) | College triggered action |
| 2 | Kicked Sparks (thermal/kinetic bloom from Rig thrust — enemies adjacent to your Blink take Rig-thrust damage) | Passive feature |
| 2 | 2nd-Level Deep-Dark Ability (choice of 2: **Grapnel Snatch** / **Rig Reflex**) | Ability grant |
| 5 | Kill-Blink (kill → free Blink; may drag an ally along) | Passive feature |
| 6 | 6th-Level Deep-Dark Ability (choice of 2: **Rooftop Snap** / **Storm the Vent**) | Ability grant |
| 8 | Rig-Native Movement (any willing movement can be a Blink; carries all Blink riders) | Passive feature |
| 9 | 9th-Level Deep-Dark Ability (choice of 2: **Chain-Blink** / **The Grate**) | Ability grant |

**Passive Features (fully mundane — Blink Rig is chrome/gear, no magic keywords):**

- **Grapnel-Blink** (1st) — *You cross the room in a heartbeat via a grapnel-jet burst.* **Maneuver, Chrome, Self.** You reposition yourself up to **5 squares** via your Blink Rig. If you have concealment or cover at your destination, you can use the Hide maneuver even if you are observed. If you successfully hide using this maneuver, you gain **1 surge**. **Spend 1+ Advantage:** reposition 1 additional square per Advantage spent.
- **Rig Recovery** (1st, triggered) — *The Rig sees the hit coming half a beat before your brain does.* **Trigger:** you take damage. **Effect:** you take half the damage, then can reposition up to **4 squares** via Blink Rig after the triggering effect resolves. **Spend 1+ Advantage:** reposition 1 additional square per Advantage spent.
- **Kicked Sparks** (2nd) — The Rig's compressed-gas thrust and mag-grip strike-plates throw off a thermal/kinetic bloom when you Blink. The first time on a turn that you Blink away from or into a space adjacent to an enemy, that enemy takes **thermal-kinetic damage equal to your Reflex (Agility) score**.
- **Kill-Blink** (5th) — Whenever you reduce a non-minion creature to 0 Stamina, you can immediately use a **free maneuver** to use your Grapnel-Blink ability. Additionally, you can now bring an adjacent willing creature along with you whenever you Blink (the Rig's tandem-carry mode). The creature appears in an unoccupied space adjacent to the space into which you Blinked. If no such space exists, they can't come with you.
- **Rig-Native Movement** (8th) — Whenever you willingly move, you can convert that movement into a Blink. When you Blink this way, it counts as using a Scout ability for the purpose of triggering your Kicked Sparks and Kill-Blink features.

**College Abilities (choose 1 of 2 at 2nd, 6th, 9th):**

| Ability | Advantage Cost | Level Unlocked | Type | Effect |
|---|---|---|---|---|
| **Grapnel Snatch** | 5 | 2nd | Chrome, Melee 1 or Ranged 5, Strike, Weapon, Main | 6+chr; reposition target 1 square via grapnel-yank / 10+chr; reposition target up to 3 squares / 14+chr; reposition target up to 5 squares. |
| **Rig Reflex** | 5 | 2nd | Free Triggered | **Trigger:** You use your Rig Recovery ability. **Effect:** You ignore any effects associated with the damage that triggered your Rig Recovery. Before you Blink, you can make a free strike against a creature who damaged you. After you Blink, you can spend a Recovery. |
| **Rooftop Snap** | 9 | 6th | Chrome, Melee 1, Strike, Weapon, Main | 3+chr; vertical push 5 (grapnel-yank up a wall) / 6+chr; vertical push 10 / 9+chr; vertical push 15. A creature force-moved by this ability must be moved straight upward — the grapnel hooks their harness, gear, or a cyberlimb and yanks them up. |
| **Storm the Vent** | 9 | 6th | Chrome, Maneuver, 4 burst | Each target (self + each ally in area) can Blink up to 5 squares (each carries a Blink Rig or is close enough to yours to piggyback its emitter). For each ally target who Blinks away from or into a space adjacent to an enemy, that enemy takes **thermal-kinetic damage equal to your Reflex (Agility) score**. Additionally, a target who ends this movement in concealment or cover can use the Hide maneuver even if observed. |
| **Chain-Blink** | 11 | 9th | Chrome, Melee, Weapon, Main, Self; see below | You Blink up to twice your speed, making one power roll targeting each creature you come adjacent to during the Blink chain. **T3:** enemy takes 6 damage, ally can Blink up to 3. **T2:** 10 damage, ally Blinks up to 5. **T1:** 14 damage, ally Blinks up to 7. |
| **The Grate** | 11 | 9th | Chrome, Melee 3, Strike, Weapon, Main | 13+chr thermal-kinetic, push 3 / 18+chr thermal-kinetic, push 5 / 25+chr thermal-kinetic, push 7. **Effect:** On a critical hit, the target is grapnel-hooked, dragged into the nearest unsealed vent, maintenance grate, or utility shaft, and does not reappear on the encounter map. (They are alive; they are somewhere else; Deep-Dark Recovery Cell will find them or they will not be found.) |

*Corp records: **confined-space and sub-strata operations specialist, Ferrum Level 4 clearance**. Street: **knife**, **deep-dark**, **ferro**, **operative-deep**.*

---

#### Face-in-Crowd — *"the Mask"* — Nyx Cartel Mask-Line (Street-Independent)

**Reskin of DS Shadow's canonical "Face-in-crowd" archetype and DS Harlequin Mask mechanical spine — the infiltrator/impersonator. Michael's role: infiltrator, fast-moving, heavy.**

The **Nyx Cartel** is the hungriest and most precarious of the Ten Conglomerates — the legitimized underworld that runs the Sinks black market and the smuggling routes the other nine pretend they never use. The **Mask-Line** is Nyx's face-thief crew: the deniable, unregistered runners who slip through corp badges, walk into secure sub-annexes wearing someone else's face, and are gone before the retina scan flags a mismatch. Where a Ferrum knife-worker takes a target *hard*, a Nyx Mask takes them *soft* — the target signs the wrong document, hands over the wrong key, tells the wrong person the wrong secret, and does not know they were ever run.

Their signature gear is the **Mask Rig**: a Nyx-fabricated dermal-holographic projection array (chin-line and jaw emitters), synth-skin appliqué face-plate, laryngeal voice-modulator, and an off-brand smartlink that hijacks the target arcology's badge geometry in real time. It is not illusion magic. It is very good black-market chrome, run by a face-cutter who knows the local badge system's specs down to the pixel. The Mask Rig is why the corps have been trying to break the Mask-Line for a decade and have not managed it. *(Design note: this is the DS Harlequin Mask "I'm No Threat" illusion-magic mechanic reskinned to pure tech, per Michael's 2026-07-29 v2 directive to scrub magic flavor and replace the Harlequin imagery.)*

Officially "unaffiliated criminal — Nyx Cartel front-office fabrication division, no known SIN." Street name: **the mask**, **face-in-crowd**, or — Nyx's own — **the wearer**. Grants the **Lie** skill. Starter Kit: **Cloak & Dagger** or **Rapid-Fire** (Nyx Masks favor two small pistols and a face that is not theirs).

| Level | Feature/Ability | Type |
|---|---|---|
| 1 | Mask Rig (dermal holo + synth-skin: appear nonthreatening, strike-edge, Disengage-bonus) | 1st-level college feature |
| 1 | Lie (skill) | Skill grant |
| 1 | Diversion (1 Advantage triggered: retarget an incoming strike to another enemy) | College triggered action |
| 2 | Wrong Target (be a target of any ally-hitting AoE — enemies read your Rig as friendly; Disengage tacks onto Mask Rig activation) | Passive feature |
| 2 | 2nd-Level Mask-Line Ability (choice of 2: **Voice Throw** / **Face-Cut**) | Ability grant |
| 5 | Face-Thief (kill → free Mask Rig activation + move) | Passive feature |
| 6 | 6th-Level Mask-Line Ability (choice of 2: **Everybody's Looking** / **Wear Them**) | Ability grant |
| 8 | Blend (movement doesn't provoke opportunity attacks; Face-Thief triggers off Diversion kills) | Passive feature |
| 9 | 9th-Level Mask-Line Ability (choice of 2: **I Am You** / **The Wearer's Cut**) | Ability grant |

**Passive Features (fully mundane — Mask Rig is chrome/gear, no magic keywords):**

- **Mask Rig** (1st) — *Your dermal-holo array paints a friendly face; the Rig's smartlink sells the target arcology's own badge geometry back to their sensors.* **Maneuver, Chrome, Optics, Self.** You activate the Rig: it makes you appear nonthreatening and harmless to your enemies (their HUD reads you as a low-priority civilian, badge-carrier, or maintenance worker). While the Rig is active, your strikes gain an **edge**, and when you take the Disengage move action, you gain a **+1 bonus to the distance you can shift**. The Rig deactivates when you harm another creature, when you physically interact with a creature (touch-contact overrides the projection), when you use this ability again, or when you end it (no action required). If you end the Rig by harming another creature, you gain **1 surge**. **Spend 1 Advantage:** the Rig assumes the specific appearance of a creature whose size is no more than 1 greater than yours and within 10 squares — full body silhouette plus laryngeal voice-modulation. You gain an edge on tests to convince the target creature's allies you are them.
- **Diversion** (1st, 1 Advantage, triggered) — *A Rig-projected shout, a chest-cam glare, a badge-reader ping in the wrong direction.* **Trigger:** an enemy targets you with a strike. **Effect:** choose an enemy within distance of the triggering strike, including the enemy who targeted you; the strike targets that enemy instead. (The Rig sold them the wrong target for a quarter-second.)
- **Wrong Target** (2nd) — Your Rig sells you as friendly hard enough to fool an AoE targeting system. Whenever an enemy uses an ability or trait that targets multiple allies and you are within distance of the effect, you can choose to be a target of the effect as well (their sensors read you as one of their side and include you in the pass). Additionally, when you activate your Mask Rig, you can take the Disengage move action as part of that activation.
- **Face-Thief** (5th) — Whenever you reduce an adjacent non-minion creature to 0 Stamina, you can immediately use a **free maneuver** to activate your Mask Rig and then move up to your speed. If the creature is the same size as you, your Rig can present as them (a stolen face capture from your chin-line optics) without spending Advantage. If you do, while the Rig is active, the corpse's body is dermal-holographed to look like your body (a corpse-projection loop from your Rig's onboard cache). The projection ends on their body if another creature physically interacts with it. When the projection would end for either you or the corpse, it ends for both.
- **Blend** (8th) — Your movement no longer provokes opportunity attacks (the Rig sells you as staff/civilian to the AI targeting stack). Additionally, you can use your Face-Thief feature as a **free triggered action** when a creature is reduced to 0 Stamina by your Diversion ability.

**College Abilities (choose 1 of 2 at 2nd, 6th, 9th):**

| Ability | Advantage Cost | Level Unlocked | Type | Effect |
|---|---|---|---|---|
| **Voice Throw** | 5 | 2nd | Area, Optics, Ranged, Maneuver, 3 cube within 10 | You throw a laryngeal-modulator projection into the cube — a bark, a shout, an order. Slide 4 / Slide 5 / Slide 7. **Effect:** This forced movement ignores stability. Instead, the forced movement is reduced by a number equal to the target's Intuition score. |
| **Face-Cut** | 5 | 2nd | Chrome, Free Triggered | **Trigger:** another creature targets you with a strike. **Effect:** you use Diversion with no Advantage cost against the triggering creature and strike; reposition to an unoccupied space within 3 of that creature via a fast Rig-projected feint; make a free strike against them; then spend a Recovery. |
| **Everybody's Looking** | 9 | 6th | Area, Optics, Maneuver, 5 burst | Your Rig broadcasts a swarm of projection-decoys into the burst. Each enemy in the area. **Effect:** Until start of your next turn, any ability roll made against a target in the area gains an **edge** (their targeting system is tracking three ghosts of every friendly). |
| **Wear Them** | 9 | 6th | Chrome, Melee 1, Strike, Weapon, Main | Two enemies. **T3:** 2 damage; if target has R<WEAK, before damage resolves, the Rig sells them the wrong enemy and they make a free strike (at that target). **T2:** 5 damage; if R<AVG, they use a main action ability of your choice (the Rig's puppet-voice command). **T1:** 7 damage; if R<STRONG, they can shift up to their speed and use a main action ability of your choice. **Effect:** You choose the new targets for the original target's free strike or ability. Additionally, if your Rig is active (hidden or disguised), using this ability doesn't cause you to be revealed. |
| **I Am You** | 11 | 9th | Chrome, Ranged 10, Maneuver | One creature. Your Rig executes a full-fidelity capture-and-run of the target — retina, gait, voice, badge chip. Until end of encounter, you gain the target's damage immunities and speed (if better than yours), and can use any types of movement they can use. You can also use the target's signature ability, using their bonus for the power roll. |
| **The Wearer's Cut** | 11 | 9th | Melee 1, Strike, Weapon, Main | 15+chr / 21+chr / 28+chr. **Effect:** If your Rig is disguised as a creature the target knew (via Mask Rig), this ability deals extra damage equal to **three times your Reflex (Agility) score** (the target sees a friend, a lover, a boss — and dies mid-relief). |

*Corp records: **unaffiliated criminal, Nyx-Cartel-linked, no known SIN**. Street: **mask**, **wearer**, or — rarely, when a Mask has burned a corp badly — **that mask**.*

---

### Level 1-10 Progression Table

| Level | Class Features (all Scouts) | College Features | Abilities Known |
|---|---|---|---|
| 1 | Shadow College (subclass), Advantage, College Features, College Triggered Action, **Hesitation Is Weakness**, Kit, Scout Abilities | 1st-level college feature | Signature; 3-Adv; 5-Adv |
| 2 | College Feature, Perk | 2nd-level college feature | Signature; 3-Adv; 5-Adv + 5-Adv College Ability |
| 3 | Careful Observation, 7-Adv Ability | — | Signature; 3-Adv; 5-Adv; 7-Adv + 5-Adv College |
| 4 | Characteristic Increase, Keep It Down, Night Watch, Perk, Skill, **Surge of Advantage** | — | Signature; 3-Adv; 5-Adv; 7-Adv + 5-Adv College |
| 5 | College Feature, 9-Adv Ability | 5th-level college feature | Signature; 3/5/7/9-Adv + 5-Adv College |
| 6 | Perk, **Ghost Suite** (optical-camo array) | 6th-level college feature | Signature; 3/5/7/9-Adv + 5/9-Adv College |
| 7 | Characteristic Increase, **Sharper Eye**, Skill, Careful Observation Improvement, Ventriloquist | — | Signature; 3/5/7/9-Adv + 5/9-Adv College |
| 8 | College Feature, Perk, 11-Adv Ability | 8th-level college feature | Signature; 3/5/7/9/11-Adv + 5/9-Adv College |
| 9 | **Ghost Squad** (chromatic decoys), College Ability | — | Signature; 3/5/7/9/11-Adv + 5/9/11-Adv College |
| 10 | Characteristic Increase, **Death Pool**, Perk, Skill, Careful Observation Improvement, **Ghost Suite Improved**, **Subterfuge** (epic resource) | — | All tiers unlocked |

### Core Class Features (Non-Subclass)

*All fully mundane. No Magic keywords appear anywhere in this list.*

- **Hesitation Is Weakness** (1st, 1 Advantage, free triggered) — *A trained runner reads a teammate's cue and steps into the seam.* **Trigger:** another hero ends their turn. **Effect:** you take your turn after the triggering hero. *(Constraint: that hero cannot have used this ability to start their turn.)*
- **Careful Observation** (3rd, maneuver, Ranged 20) — *A moment of focus leaves a foe firmly in your sights.* **Effect:** as long as you remain within distance, maintain line of effect, and strike no other creature first, you gain an **edge** on the next strike you make against the assessed creature, and gain **1 surge** you can use only on that strike. **7th-level improvement:** target 2 creatures; striking one does not end observation of the other. **10th-level improvement:** target 3 creatures.
- **Keep It Down** (4th) — While conversing with any creature you share a language with, you can decide whether anyone else can perceive what you are conveying, **even while yelling** (throat-modulator + laryngeal-focus chrome — see the Mask Rig for the same technology fielded larger).
- **Night Watch** (4th, passive + triggered) — **Passive:** while you are hidden, enemies take a bane on tests made to search for you or other hidden creatures within 10 squares of you. **Triggered ability (Ranged 5, weapon, 1 ally):** target takes damage from another creature's ability while you are hidden → target takes **half** the damage; you remain hidden.
- **Surge of Advantage** (4th) — The first time each combat round that you deal damage incorporating 1 or more surges, you gain **2 Advantage** instead of 1 *(replaces the base 1-Advantage-per-surge rider)*.
- **Ghost Suite** (6th, maneuver) — *Prototype optical-camo / dermal chromatic-camo array; pure tech, no magic keyword.* Ghost Suite is a class-granted chrome integration installed during the Scout's Echelon-2 progression respite — it is treated as class-side gear (BP-granted), not a nuyen/Body-Integrity purchase, and does not consume a chrome slot or stack magic-erosion penalties (there is no magic-erosion on the Scout). As a maneuver, you activate the suite; you enter Ghost Suite mode until end of encounter, until you are dying, or until you deactivate after 1 hour of quiet focus outside of combat. Effects:
  - You can automatically climb at full speed while moving (mag-grip gauntlet/boot integration).
  - Enemies' spaces do not count as difficult terrain for you. An enemy takes **thermal-optic damage equal to your Reflex (Agility) score** the first time you pass through their space on a turn (the suite's emitters bloom on close-passage).
  - If you end your turn with cover or concealment from another creature, you are automatically hidden from that creature.
  - You gain **1 surge** at the start of each of your turns.
  - You have **thermal-optic damage immunity** equal to 5 + your level (the suite reflects and re-emits its own damage type).
  - **Trade-off (the "suite emitter bloom is loud" cost):** creatures gain an **edge** on strikes against you (the emitters are running hot and visible to any thermal sensor pointed straight at you). You take a **bane** on Presence tests made to interact with other creatures (the emitters mess with facial-reading and voice-modulator work).
  - **10th-level improvement (Ghost Suite Improved):** you gain **full control** over the suite; end at will (no action). The suite runs cold — you are always wreathed in optical distortion granting concealment, and creatures no longer gain an edge on strikes against you. Additionally, once per day, a 1-minute concentration on a location you have previously placed a Ghost Suite navigation beacon at → you and each willing creature within 10 squares can teleport to unoccupied spaces of your choice within that beaconed location; each such creature is **invisible for 1 hour** or until they use an ability. *(Reskin note: DS 10th-level teleport is re-cast as a Rare-Tier micro-drone beacon-relay system — the crew's mole pre-positions a nav beacon at a known location, and the Ghost Suite's improved emitter package does a rapid grapnel/mag-cable extraction of the wearers to that beacon via a pre-scouted vertical shaft or ductwork route. Mechanically DS-native — the 1-minute concentration and 1-hour invisibility are unchanged.)*
- **Sharper Eye** (7th) — *DS Keen Insight reskin.* At the start of each of your turns during combat, you gain **1d3+1 Advantage** instead of 1d3.
- **Ventriloquist** (7th) — Whenever you communicate, you can throw your voice so that it seems to originate from a creature or object within **10 squares** (via the same laryngeal-modulator chrome the Mask Rig fields at higher fidelity). If you are hidden, talking this way does not cause you to be revealed.
- **Ghost Squad** (9th) — *DS Gloom Squad reskin — Ghost Suite fabricates optical-camo decoys.* At the start of each of your turns, you can **forgo gaining Advantage** to create **1d6 chromatic decoys** (projection-figures) of yourself in unoccupied adjacent spaces. A decoy acts on your turn and uses your statistics, except they have 1 Stamina. They are affected by any conditions and effects on you, and last until the start of your next turn. A decoy does not have Advantage and cannot use Careful Observation, Ghost Suite, or any triggered actions. On their turn, a decoy has a move action, a maneuver, and a main action that they can use only to make a **free strike**. A decoy must choose free-strike targets not shared by you or another decoy. **Outside of combat:** one decoy active per 2 Victories; if destroyed, 1-hour cooldown. *(Reskin note: DS clones become GHOSTWIRE optical-camo decoys — the Ghost Suite's emitter array painting persistent, moving distortion-figures in nearby space, backed by the crew's shared HUD-decoy feed. Same rules; pure-tech flavor.)*
- **Death Pool** (10th) — The first time each combat round that you deal damage incorporating 1 or more surges, you gain **3 Advantage** instead of 2.
- **Subterfuge** (10th, epic resource) — Each time you finish a respite, you gain Subterfuge equal to the XP you gain. You can spend Subterfuge on your abilities as if it were Advantage. Additionally, you can spend Subterfuge to take **additional maneuvers** on your turn (1 maneuver per Subterfuge spent). Subterfuge remains until you spend it.

### Kits (Your Loadout)

The Scout uses **light Kits**. The Quick Build assumes **Cloak & Dagger** (dagger + hand-crossbow-analog / silenced pistol; low-profile stealth chrome). GHOSTWIRE-native Scout Kit options in the shared Kit v1.1 catalog (see Chapter 6: Kits in `master_rules_baseline.md`) map cleanly:

- **Cloak & Dagger** — Melee dagger + light ranged (silenced pistol or throwing needle); light armor; +1 to Hide/Sneak tests. **Ghost (Ferrum Deep-Dark) default. Face-in-Crowd (Nyx Mask) alternate.**
- **Rapid-Fire** — Two light one-handed pistols; light armor; two-strike ability rider. **Face-in-Crowd (Nyx Mask) default alternate.**
- **Longshot** — Long-range light rifle (marksman analog) + suppressor + optical stack; light armor; +2 to first strike against an unaware target; range extended to Ranged 20 on rifle strikes. **Hunter (Ironclad Longshot) required.**

*Doctrine reminder: Kits are the pre-Chrome loadout. A Scout who bolts on cyberarms, a Ghost Suite, and (subclass-specific) a Blink Rig or a Mask Rig is still using their Kit as the baseline; chrome layers on top.*

### Chrome a Scout Runs

The Scout is the class most likely to run **light-signature, high-precision** chrome — reflex-boosters, dermal-plating, subdermal optics, and (from 6th level up) the Ghost Suite optical-camo array as core class kit. The Scout is a **fully mundane class** (no Veil, no Signal, no innate magic), so the master-baseline magic-erosion doctrine — which taxes chrome on the mage-track casters — **does not apply**. Every Scout, of every subclass, may run chrome freely.

Subclass-differentiated recommendations (all fully mundane, no magic-erosion penalty):

- **Hunter (Ironclad Longshot):** buys **seeing first**. Cyber-Eyes with smartlink/thermal/rangefinder stack (subdermal). Cyber-Ears audio-spatial suite. Datajack for crew-feed comms. Wired-Reflex Standard (the delayed hold-the-breath discipline is chrome-fed, not chem-fed). Body Integrity spent light, in the sensory lanes.
- **Ghost (Ferrum Deep-Dark):** buys **moving first**. Wired-Reflex Standard or Salvage (the Rig-driven Blink is amplified by faster central nervous chrome). Blink Rig (subclass-issued gear, not a chrome purchase). Mag-grip gauntlets and boots. Subdermal armor (kinetic-band). Body Integrity spent medium-heavy in the mobility lanes.
- **Face-in-Crowd (Nyx Mask-Line):** buys **selling the lie first**. Mask Rig (subclass-issued gear). Laryngeal voice-modulator. Chin-line micro-optic capture rig. Datajack — the Mask needs to sell the target arcology's own badge geometry back at it. A light dermal package for the fistfight the Mask should not have to have. Body Integrity spent medium in the sensory + interpersonal lanes.

The **Ghost Suite** (6th-level class feature) is treated as **class-granted chrome** — not a purchasable catalog item; it is granted by advancement and represents the Scout's own accreted street/corp tech. It does not consume a chrome slot and does not consume Body Integrity. For an Ironclad Longshot Scout, it is officially "Ironclad-issue optical-suite package Mk-III." For a Ferrum Deep-Dark Scout, it is a Ferrum-fabbed dermal-emitter layer that meshes with the Blink Rig. For a Nyx Mask, it is a black-market chop of both, kluged together by the Mask-Line's fabrication division.

Specific chrome-catalog recommendations from `GHOSTWIRE-Chrome-Catalog-v1.md` are open (see Part 2 Known Bugs #10) and should be addressed in the shared class-specific chrome pass alongside the Elementalist and Operator equivalents.

---

## PART 2 — AGENT/DEV-FACING: IMPLEMENTATION GUIDE

*This half of the document is what the next Foundry-implementation agent — human or AI — needs to ship the Scout to the ghostwire module. Structure follows the Operator, Hacker, and Elementalist masters. **Because no Scout Foundry build exists yet, all schemas below are PLANNED and modeled on the live Operator/Hacker class items — flagged in the Known Bugs section and to be revised the moment the Scout ships.***

### Module Scope (Standing Rule)

The Scout ships to the same **`ghostwire`** Foundry module that houses the Operator, Hacker, and (planned) Elementalist. New Compendium pack files are added under `ghostwire/packs/`:

- **`ghostwire-classes`** — The Scout class item itself and any subclass-level toggle/feature items.
- **`ghostwire-abilities`** — All Scout signature, tier-cost, subclass-specific, and free-triggered abilities.

Doctrine feature items (Hesitation Is Weakness, Careful Observation, Night Watch, Keep It Down, Sharper Eye, Ventriloquist, Ghost Suite, Ghost Squad, Death Pool, Subterfuge, and per-subclass passive features) go in `ghostwire-classes`; the ability items themselves (all the ones in the tier tables above and the subclass ability tables) go in `ghostwire-abilities`. This is the same split used for the Operator and Hacker.

### Data Provenance — How This Document Was Built (v2 Refactor)

- **DS Shadow SRD (mechanical spine):** Fetched from Steel Compendium (`https://steelcompendium.io/compendium/main/Rules/Classes/Shadow/`) on 2026-07-29. Used only for **mechanical structure** (Advantage economy, tier costs, ability effect shapes, subclass progression skeleton). All fantasy flavor text, magic keywords, and "college" imagery scrubbed and reskinned per v2 directive.
- **GHOSTWIRE core rulebook lore chapters (primary flavor source):** The Ten Conglomerates, Ossian Reach strata, the Wired, the Nine Peoples — sourced from `ghostwire_intro_chapter.md`, `ghostwire_volume_structure.md`, and `GHOSTWIRE_Dossiers_and_Fiction.pdf` (all project files). Corp names, subclass academies, and setting-specific flavor drawn exclusively from these sources per Michael's 2026-07-29 v2 directive ("use only the core rulebook lore sections; the rules in that book are defunct").
- **GHOSTWIRE master baseline §E2 (Scout — Advantage):** Authoritative source for Advantage pool/cap (8 at T5), income (steady read +1, first-blood +Victories, Exploit-the-Mark +1, Reposition +1), edge discount (−1), and the heroic magnitude table (Called Shot 1, Ambush 2, Ghost Step 2, Overwatch Shot 3, Killing Blow 5). All numeric values in Part 1 traced back to this table.
- **GHOSTWIRE Wren Sable-Corvin dossier (canonical Scout exemplar):** Pregen 9/10 in `GHOSTWIRE_Dossiers_and_Fiction.pdf` — Tier-5 Wereraven Scout (Hunter), the recon-marksman build. Used to validate: (a) the Hunter subclass exists in canon and maps to marksman/tracker; (b) the mundane-class + chrome-erodes-nothing rule; (c) the mark-and-exploit loop as the Scout's defining fantasy; (d) the Lifestyle/Chrome/Kit interactions.
- **GHOSTWIRE templates (structural):** `Ghostwire_Elementalist_Development_Master.md`, `Ghostwire_Operator_Development_Master.md`, `Ghostwire_Hacker_Development_Master.md`.
- **Michael's 2026-07-29 v2 design directives (verbatim, applied):**
  - Use core rulebook **lore only**; core rulebook rules defunct.
  - Replace placeholder corp names (Ares, Aztechnology) with corps from the GHOSTWIRE Ten Conglomerates.
  - Define "surge" near the point of use.
  - Remove all magic flavor — every "magic" ability re-cast as a technology edge.
  - Remove Harlequin subclass, replace with a different street outfit.
  - Three subclasses by **role**: long-range sniper, infiltrator (fast-moving, heavy), melee close-up.
  - Not all Scouts are Wereraven — class must remain species-agnostic.
- **Standing GHOSTWIRE doctrine applied:** attribute display convention (display label first, real DS in parens); tier system removed (DS levels 1-10 + Echelons E1-E4); nuyen (Y) is currency; one canonical file per class; Foundry-first, rulebook-second; Preflight Doctrine (all `.ps1` ships with a ready-to-paste run-block).

### Corporate Rename Map (v2)

| v1 Placeholder | v2 Canonical (from GHOSTWIRE Lore) | Rationale |
|---|---|---|
| Ares Macrotechnology "Black-Ash Cell" | **Ironclad Longshot Division** | Ironclad is one of the "and around them turn the rest" conglomerates in the lore — the enforcement/mercenary contractor. Longshot Division is the marksman/precision-intervention arm. Corp black-program. |
| Aztechnology "Caustic Program" | **Ferrum Dynastic Deep-Dark Program** | Ferrum built the hive's bones and knows the sealed deep-dark levels — its wetwork cadre is the close-quarters knife-worker. Corp black-program. |
| Harlequin Crew (street-independent guild) | **Nyx Cartel Mask-Line** | Nyx is the legitimized underworld of the Ten Conglomerates. The Mask-Line is Nyx's face-thief crew. Nominally corp (Nyx holds a seat), but operates as a deniable, street-facing crew — the closest lore analog to a street-independent guild. |

Subclass role-mapping (v2, per Michael's directive):

| Role (Michael) | Canonical Subclass Name (master baseline) | Corp / Crew |
|---|---|---|
| Long-range sniper | Hunter | Ironclad Longshot Division |
| Melee close-quarters | Ghost | Ferrum Dynastic Deep-Dark Program |
| Infiltrator (fast-moving, heavy) | Face-in-crowd | Nyx Cartel Mask-Line |

### Item Inventory (Planned, To Be Built)

*For eventual Foundry ship. IDs allocated per the standing GHOSTWIRE ID convention (`GWScout00001` for the class item; `GWScoutSig00001`+ for signatures; `GWScoutHer00001`+ for tier-cost heroics; `GWScoutSub00001`+ for subclass abilities and features). All IDs are placeholder-planned; the live ship script assigns real UUIDs.*

**Class item** (`ghostwire-classes`):
- `GWScout00001` — The Scout (class-type item, holds chassis stats, Advantage resource definition, level advancement, feature grants at each level).

**Core doctrine features** (`ghostwire-classes`, type `feature`):
- `GWScoutFeat00001` — Hesitation Is Weakness (1st, class-wide, 1 Advantage free-triggered)
- `GWScoutFeat00002` — Careful Observation (3rd, class-wide, maneuver + edge/surge rider)
- `GWScoutFeat00003` — Keep It Down (4th, class-wide, communication passive)
- `GWScoutFeat00004` — Night Watch passive + Night Watch triggered ability (4th, class-wide) → 2 sub-items OR one bundled
- `GWScoutFeat00005` — Surge of Advantage (4th, class-wide, resource-generation passive)
- `GWScoutFeat00006` — Ghost Suite (6th, class-wide maneuver-activated form; carries reversion + 10th-level improvement clause)
- `GWScoutFeat00007` — Sharper Eye (7th, class-wide, resource-generation passive)
- `GWScoutFeat00008` — Ventriloquist (7th, class-wide, communication passive)
- `GWScoutFeat00009` — Ghost Squad (9th, class-wide, decoy-generation feature)
- `GWScoutFeat00010` — Death Pool (10th, class-wide, resource-generation passive)
- `GWScoutFeat00011` — Subterfuge (10th, class-wide, epic resource + extra-maneuver passive)

**Subclass grant items** (`ghostwire-classes`, type `feature`, one per subclass, 3 total):
- `GWScoutSub00001` — Hunter / Ironclad Longshot Division (1st-level grant: Survival/Tracking skill, Quarry + Ranged Reflex features, Steady the Scope triggered)
- `GWScoutSub00002` — Ghost / Ferrum Dynastic Deep-Dark Program (1st-level grant: Sabotage skill, Grapnel-Blink ability, Rig Recovery triggered)
- `GWScoutSub00003` — Face-in-Crowd / Nyx Cartel Mask-Line (1st-level grant: Lie skill, Mask Rig ability, Diversion triggered)

**Signature abilities** (`ghostwire-abilities`, type `ability`, 4 total):
- `GWScoutSig00001` — Gasping in Pain
- `GWScoutSig00002` — I Work Better Alone
- `GWScoutSig00003` — Teamwork Has Its Place
- `GWScoutSig00004` — You Were Watching the Wrong One

**Tier-cost heroic abilities** (`ghostwire-abilities`, type `ability`, 20 total):
- 3-Advantage (4): Disorienting Strike, Eviscerate, Get In Get Out, Two Throats at Once
- 5-Advantage (4): Coup de Grâce, One Hundred Throats, Setup, **Neurospike** *(v2 rename from Shadowstrike; Magic keyword removed)*
- 7-Advantage (4): Dancer, Misdirecting Strike, Pinning Shot, Staggering Blow
- 9-Advantage (4): **Flash-Screen** *(v2 rename from Blackout; Optics keyword)*, **Blindside Shift** *(v2 rename from Into the Shadows; Chrome keyword)*, **Rooftop Rush** *(v2 rename from Shadowfall; no keyword)*, You Talk Too Much
- 11-Advantage (4): Assassinate, **Kill-Zone Mesh** *(v2 rename from Shadowgrasp; Optics keyword)*, **Overclock Cascade** *(v2 rename from Speed of Shadows; Chrome keyword)*, They Always Line Up

**Subclass ability grants** (`ghostwire-abilities`, type `ability`, 6 per subclass × 3 = 18 total):
- **Hunter / Ironclad Longshot:** Called Shot (Vitals), Called Shot (Comm-link), Overwatch Lane, Ghost Round, One Shot One Kill, Vantage Trap
- **Ghost / Ferrum Deep-Dark:** Grapnel Snatch, Rig Reflex, Rooftop Snap, Storm the Vent, Chain-Blink, The Grate
- **Face-in-Crowd / Nyx Mask-Line:** Voice Throw, Face-Cut, Everybody's Looking, Wear Them, I Am You, The Wearer's Cut

**Total planned item count: 1 class + 11 doctrine features + 3 subclass grants + 4 signatures + 20 heroic tiers + 18 subclass abilities = 57 items.** (v2 has one fewer item than v1: the Aztech "Time Bomb" ability was v1-specific and has no v2 analog; the three v2 subclasses each cleanly deliver 6 subclass abilities with no passive-granted stragglers.)

### The Feature/Ability Pairing Pattern (Modeled After Operator, With Scout Adaptation)

The Operator master documents a "features grant abilities" pattern: a `feature` item that carries the class doctrine, and an `ability` item that carries the actual roll/effect. For the Scout, this pattern applies cleanly:

- **1st-level college grant** (feature item, e.g. `GWScoutSub00001` Hunter / Ironclad Longshot) → grants the subclass skill (Survival-Tracking / Sabotage / Lie) + carries the ID/link to the 1st-level ability items (Quarry+Ranged Reflex / Grapnel-Blink / Mask Rig) + the college-triggered ability item (Steady the Scope / Rig Recovery / Diversion). Player selects a subclass at 1st level → their character sheet lights up with all subclass-granted feature and ability items.
- **Hesitation Is Weakness** (feature item, class-wide) → the feature item is the doctrine wrapper; the associated ability item carries the actual "1 Advantage, free triggered, insert self after another hero's turn" effect. Both live in `ghostwire-classes` for the feature, `ghostwire-abilities` for the ability.
- **Ghost Suite** (feature item, class-wide) → the feature item is the maneuver-activated toggle; on activation, a set of sub-effect items (thermal-optic emitter aura, difficult-terrain-passthrough, hide-on-cover, surge-per-turn, thermal-optic-immunity) activate as active effects on the actor.
- **Ghost Squad** (feature item, class-wide) → the feature is the "at start of turn, forgo Advantage to create 1d6 decoys" trigger; the decoys themselves are token-summonable actor items (`ghostwire-actors/GWScoutDecoy00001`) that inherit the Scout's stat block with the 1-Stamina + no-triggered-actions overrides.

*Preserve the pattern: the Scout's biggest schema question is **Ghost Suite** (form-transformation vs. active-effect-stack), which is treated as one active-effect bundle applied to the actor with a duration of "until end of encounter or until the toggle is deactivated." See Known Bugs #3 for the specific schema question.*

### Class Item Schema (`GWScout00001`, type `class`) — PLANNED

*Modeled on the Operator class item schema in `Ghostwire_Operator_Development_Master.md`. Concrete JSON to be authored during ship.*

- **`name`:** "Scout"
- **`type`:** "class"
- **`img`:** placeholder (a Scout ghost-suit icon)
- **`system.description.value`:** Part 1 opening prose ("Who You Are"), condensed for the sheet.
- **`system.identity`:** "Scout"
- **`system.characteristics`:** primary `["agility","reason"]` mapped to display labels Reflex / Logic. Starting characteristic array as listed in Chassis.
- **`system.potency`:** weak = agility-2; average = agility-1; strong = agility.
- **`system.stamina.startAtLevel1`:** 18. **`system.stamina.perLevel`:** 6. **`system.recoveries`:** 8.
- **`system.resource.advantage`:** Heroic resource definition; `startOfEncounter: victories`; `perTurn: 1d3` (levels 1-6), `1d3+1` (levels 7-10); `onSurge: 1` (levels 1-3), `2` (levels 4-9), `3` (level 10); `outOfCombat: unlimited-once-per-victory-or-respite`.
- **`system.subclasses`:** `["ironclad-longshot-hunter", "ferrum-deep-dark-ghost", "nyx-mask-line-face-in-crowd"]`.
- **`system.levelFeatures`:** an array of level-N → feature-item-ID grants, populated from the Progression table above.

### Ability Item Schema (Signatures / Tier Heroics / Subclass Abilities) — PLANNED

*All ability items follow the shared GHOSTWIRE schema. Below is the schema shape for one signature and one tier heroic as reference.*

```yaml
# Example: GWScoutSig00001 -- Gasping in Pain
name: "Gasping in Pain"
type: "ability"
system:
  description.value: |
    Your precise strikes let your allies take advantage of a target's agony.
    (Free effect: one ally within 5 of the target gains 1 surge.)
  keywords: ["Melee", "Strike", "Weapon"]
  type: "main-action"
  distance: { melee: 1 }
  target: "one-creature"
  cost:
    resource: "advantage"
    value: 0
  powerRoll:
    characteristics: ["agility"]
    tiers:
      - { max: 11,   damage: "3 + @chr", conditions: [] }
      - { max: 16,   damage: "5 + @chr", conditions: [] }
      - { min: 17,   damage: "8 + @chr", conditions: [{ if: "intuition < STRONG", then: "prone" }] }
  effect: "One ally within 5 of the target gains 1 surge."
```

```yaml
# Example: GWScoutHer00013 -- Assassinate (11-Advantage apex)
name: "Assassinate"
type: "ability"
system:
  description.value: |
    A practiced attack will instantly kill an already weakened foe.
  keywords: ["Melee", "Strike", "Weapon"]
  type: "main-action"
  distance: { melee: 1 }
  target: "one-creature-or-object"
  cost:
    resource: "advantage"
    value: 11
  powerRoll:
    characteristics: ["agility"]
    tiers:
      - { max: 11, damage: "12 + @chr", conditions: [] }
      - { max: 16, damage: "18 + @chr", conditions: [] }
      - { min: 17, damage: "24 + @chr", conditions: [] }
  effect: "A target who is not a minion, leader, or solo creature and who is winded after taking this damage is reduced to 0 Stamina."
```

### Feature Item Schema — PLANNED

*Feature items carry doctrine text + passive effects + optional active-effect toggle. Reference (Ghost Suite):*

```yaml
# Example: GWScoutFeat00006 -- Ghost Suite (6th-level maneuver-activated array)
name: "Ghost Suite"
type: "feature"
system:
  description.value: |
    Prototype optical-camo / dermal chromatic-camo array. Fully mundane class chrome —
    no magic-erosion, no Body-Integrity cost. Full mechanics in the master doc.
  activation:
    type: "maneuver"
    duration: "encounter"
    endTriggers: ["dying", "one-hour-quiet-focus-outside-combat"]
  activeEffects:
    - key: "climb.speedMultiplier"
      value: 1
    - key: "difficultTerrain.ignoreEnemies"
      value: true
      onFirstPass: "damage @chr thermal-optic"
    - key: "hideOnEndTurnCoverConcealment"
      value: true
    - key: "surgeAtStartOfTurn"
      value: 1
    - key: "immunity.thermal-optic"
      value: "5 + @level"
    - key: "enemiesGainEdgeAgainstYou"
      value: true
    - key: "presenceTests.bane"
      value: true
  level10Improvement:
    name: "Ghost Suite Improved"
    effects:
      - key: "controlToggleAtWill"
        value: true
      - key: "concealment.always"
        value: true
      - key: "enemiesGainEdge"
        value: false   # override the base level-6 penalty
      - key: "beaconExtraction.1PerDay"
        value: true
```

### Kit / Focus Item Schema — N/A for Scout

The Scout uses **standard Kit items** (Cloak & Dagger / Rapid-Fire / Longshot) already in the shared Kit v1.1 catalog. No Scout-specific kit items are needed. The Blink Rig (Ghost/Ferrum subclass) and Mask Rig (Face-in-Crowd/Nyx subclass) are represented as subclass-granted **feature items**, not kit items, because they are class-side gear (BP-granted) rather than nuyen-purchased loadout.

### Folder Structure (Planned)

*Under `ghostwire/packs/` in the module:*

```
ghostwire-classes/
  GWScout00001.json                      # Class item
  GWScoutFeat00001.json - 00011.json     # 11 class-wide doctrine features
  GWScoutSub00001.json - 00003.json      # 3 subclass grants
ghostwire-abilities/
  GWScoutSig00001.json - 00004.json      # 4 signature abilities
  GWScoutHer00001.json - 00020.json      # 20 tier-cost heroic abilities
  GWScoutSub-Abil00001.json - 00018.json # 18 subclass abilities
ghostwire-actors/  (may or may not need)
  GWScoutDecoy00001.json                 # Ghost Squad decoy actor template
```

### Deploy/Fix Script Reference (Planned Chronological Order)

*Following the Elementalist master's Preflight Doctrine (all `.ps1` ships with a ready-to-paste run-block). Deploy scripts will be authored during ship in the below chronological order:*

1. `ship-scout-class.ps1` — Creates `GWScout00001` class item + validates schema against master baseline §E2.
2. `ship-scout-features.ps1` — Creates the 11 doctrine features (`GWScoutFeat00001-11`).
3. `ship-scout-subclasses.ps1` — Creates the 3 subclass grants (`GWScoutSub00001-03`).
4. `ship-scout-signatures.ps1` — Creates the 4 signature abilities.
5. `ship-scout-heroics.ps1` — Creates the 20 tier-cost heroic abilities.
6. `ship-scout-subclass-abilities.ps1` — Creates the 18 subclass ability grants.
7. `ship-scout-decoy-actor.ps1` — Creates the Ghost Squad decoy actor template.
8. `verify-scout-integrity.ps1` — Validates all cross-references (class → features → abilities → subclass grants) + confirms Advantage resource math per level advancement table + confirms Ghost Suite active-effect stack correctly resolves.

Each `.ps1` will be authored with a documented run-block, per the Preflight Doctrine — a ready-to-paste PowerShell 5.1-compatible command block (no `??`, no `?.`, no ternary) that the operator can drop into the console.

### Known Bugs / Caveats for Future Agents (v2)

1. **RESOLVED IN v2 — Magic-flavor scrub complete.** Per Michael's 2026-07-29 v2 directive, all "Magic" keywords and fantasy flavor have been removed from the Scout class. DS Shadow's Shadowstrike, Speed of Shadows, Blackout, Into the Shadows, Shadowfall, Shadowgrasp, and the Black Ash / Harlequin Mask magic-family abilities have been renamed and reflavored as tech (Neurospike, Overclock Cascade, Flash-Screen, Blindside Shift, Rooftop Rush, Kill-Zone Mesh, and the Ghost/Ferrum Blink Rig and Face-in-Crowd/Nyx Mask Rig respectively). No awakened-only restrictions remain — every heroic ability is available to every Scout regardless of subclass. Cross-check the ability tables when shipping to ensure no residual "Magic" keyword slipped through.

2. **RESOLVED IN v2 — Corp names replaced with canonical GHOSTWIRE lore.** Ares Macrotechnology → Ironclad Longshot Division. Aztechnology → Ferrum Dynastic Deep-Dark Program. Harlequin Crew → Nyx Cartel Mask-Line. See Corporate Rename Map (v2), above. Verify against `ghostwire_intro_chapter.md` and `ghostwire_volume_structure.md` when the core rulebook's Chapter 2 (The Overlords) is finalized — the Ten Conglomerates naming is canonical as of this document but the lore is still in draft.

3. **OPEN SCHEMA QUESTION — Ghost Suite active-effect stack.** The Ghost Suite has SEVEN concurrent active effects when active (climb-speed, difficult-terrain-passthrough with thermal-optic damage rider, hide-on-cover, surge-per-turn, thermal-optic-immunity, enemies-edge, presence-bane), which then partially reverse at 10th level via Improved. The cleanest Foundry implementation is one feature item with a bundled active-effect array + a level-10 conditional override. **Verify against DS v1.1.1 system's `duration` model on active effects** — does an "until end of encounter" duration correctly persist across combat scenes, or does it need a manual toggle?

4. **OPEN SCHEMA QUESTION — Ghost Squad decoy actor template.** Ghost Squad creates 1d6 chromatic decoys with the Scout's stat block minus specific overrides (1 Stamina, no Advantage, no Ghost Suite, no triggered actions). The simplest Foundry pattern is a copy-on-summon actor template that inherits the parent's stat block and applies a deltas layer. **Alternatively:** treat decoys as pure token-copies with the deltas as active effects, no separate actor item. Both work; the actor-item path is cleaner for the sheet but heavier at scale (1d6 = up to 6 actor items per turn).

5. **OPEN NAMING QUESTION — Hesitation Is Weakness.** The DS ability name is neutral enough to keep, but the flavor text ("Keep up the attack. Never give them a moment's grace.") reads corporate-sterile in a shadowrunner idiom. Michael to review and either (a) keep verbatim, (b) tweak flavor text (mechanics unchanged), or (c) rename entirely (e.g. "First to the Punch," "Read the Room"). Provisional: keep verbatim.

6. **OPEN NUMERIC QUESTION — Advantage income vs. Elementalist Essence.** DS Shadow's Insight was tuned around DS's own action economy. The Elementalist master notes GHOSTWIRE's own income retunes (2026-07-16 free-drip + optional-Channel; 2026-07-17 income retune). The Scout's Advantage inherits DS's 1d3-per-turn + 1-per-surge income unchanged — this is a **first-draft assumption**. The master baseline §E2 has already normalized Advantage's income streams (steady read +1, Exploit-the-Mark +1, Reposition +1 — see the Corporate Rename Map's link) and this document's Part 1 text still uses the DS-native 1d3 language. Reconcile: either the master baseline §E2 wins (steady read = +1 flat) and Part 1's 1d3 text needs correction, OR Part 1's 1d3 language is the intended playtest state and §E2 needs update. Flagged for Michael's ruling. Provisional: keep Part 1's 1d3 language and update §E2 in the numeric pass.

7. **RESOLVED IN v2 — Surge inline definition.** Per Michael's 2026-07-29 v2 directive to define surge near use, the term is now defined in a `> `-quoted callout box inside the Advantage section, immediately adjacent to its first three references. Migration to a shared glossary in `master_rules_baseline.md` remains a numeric-pass task, but the inline definition satisfies the near-use requirement.

8. **RESOLVED IN v2 — Harlequin removed.** Per Michael's 2026-07-29 v2 directive, the Harlequin Crew subclass has been removed. Replaced with the Nyx Cartel Mask-Line (Face-in-Crowd, canonical Scout subclass name from the master baseline). All Harlequin-specific imagery (illusion magic, harlequin mask motif) has been scrubbed and replaced with Nyx Cartel Mask-Line imagery (dermal-holographic projection, synth-skin face-plate, laryngeal voice-modulator — pure tech).

9. **OPEN CLASS-FEATURE QUESTION — Ghost Suite's 10th-level "beacon-extraction."** DS's Improved Umbral Form at 10th grants a 1-minute-concentration + teleport to a known location + 1-hour-invisibility rider. The v2 reskin treats this as a **micro-drone beacon-relay + grapnel/mag-cable extraction** — the crew's mole pre-positions a nav beacon and the Ghost Suite's improved emitter package pulls the party through a pre-scouted vertical shaft or ductwork route. This is a lore/narrative reskin that DOES NOT change the mechanics (still 1-minute concentration, still 1-hour invisibility, still 1/day). Verify with Michael that this narrative reskin is table-appropriate.

10. **OPEN CONTENT-COMPLETENESS ITEM — No Scout-specific Chrome/cyberware recommendations drafted.** Part 1's "Chrome a Scout Runs" section gives per-subclass narrative recommendations but does NOT name specific implants from `GHOSTWIRE-Chrome-Catalog-v1.md`. This is the same open item as Operator's #7 and Elementalist's #11, and should be addressed in a shared "class-specific chrome recommendations" pass across all shipped classes.

11. **OPEN CONTENT ITEM — Scout-specific art direction (Foundry icons/tokens/backgrounds).** Once the class ships to Foundry, per the Preflight Doctrine and the ghostwire-v2 world's art-direction standard, each ability and feature needs an icon (48x48). Class-wide items: Ghost Suite icon (optical-camo shimmer), Ghost Squad icon (silhouette-echo), Hesitation Is Weakness icon (knife-arrow). Subclass icons: rifle-scope for Ironclad Longshot, grapnel-hook for Ferrum Deep-Dark, dermal-holo/mask silhouette for Nyx Mask-Line. Placeholder until art-direction pass.

12. **OPEN LORE-CANON RECONCILIATION — Ironclad, Meridian, Verdant, Sanctum descriptions.** The core rulebook's Chapter 2 (The Overlords) canonically names the Ten Conglomerates but only fully describes HALO Ascendant, Ferrum Dynastic, Caduceus, Argent Exchange, Obsidian Holdings, Nyx Cartel, and the Radiant Concord. Ironclad's specific function (mercenary/enforcement/military-contractor per this document's read) is inferred from context ("and around them turn the rest — Meridian, Ironclad, Verdant, Sanctum") and should be confirmed when the core rulebook's world-lore-bible expands the four unnamed conglomerates. If Ironclad turns out to have a different specialization in canon, revise the Longshot Division's parent-corp attribution to Meridian, Verdant, or Sanctum (whichever the enforcement/military bracket lands on).

### Source File Index

| Purpose | Path |
|---|---|
| GHOSTWIRE core rulebook lore — Chapter 1 (Welcome to the Reach) + Chapter 2 (The Overlords) | `/home/user/workspace/space_files/collection_4fca5bc1-29ef-455c-a1c0-8bd6c167ddf6/e1a762e3-0bee-4933-b44d-d2501d520113/ghostwire_intro_chapter.md` |
| GHOSTWIRE core rulebook volume structure (chapter plan) | `/home/user/workspace/space_files/collection_4fca5bc1-29ef-455c-a1c0-8bd6c167ddf6/c2371376-4d7e-4108-a95c-9c7691962420/ghostwire_volume_structure.md` |
| Wren Sable-Corvin Scout pregen dossier ("The Long Sight" + Pregen Sheet) | `/home/user/workspace/space_files/collection_4fca5bc1-29ef-455c-a1c0-8bd6c167ddf6/476244b1-2602-464a-b039-c62253f82f64/GHOSTWIRE_Dossiers_and_Fiction.pdf` (pp. 47-54) |
| GHOSTWIRE master baseline §E2 (Scout — Advantage authoritative numeric block) | `/home/user/workspace/space_files/collection_4fca5bc1-29ef-455c-a1c0-8bd6c167ddf6/f6eb5eb4-8890-4f03-b840-dd842894db1a/master_rules_baseline-1.md` (lines ~4817+) |
| DS Shadow SRD (mechanical spine only; flavor discarded) | `https://steelcompendium.io/compendium/main/Rules/Classes/Shadow/` (retrieved 2026-07-29) |
| Elementalist master (structural template) | `/home/user/workspace/Ghostwire_Elementalist_Development_Master.md` |
| Operator master (feature/ability pairing template) | `/home/user/workspace/memory/space_files/Ghostwire_Operator_Development_Master.md` |
| Hacker master (schema patterns template) | `/home/user/workspace/memory/space_files/Ghostwire_Hacker_Development_Master.md` |
| GHOSTWIRE canonical build log | `/home/user/workspace/space_files/collection_4fca5bc1-29ef-455c-a1c0-8bd6c167ddf6/181cb751-b1b8-4488-8fae-db7179aae211/GHOSTWIRE_BUILD_LOG_CANONICAL.md` |
| Preflight Doctrine (PowerShell + Foundry deploy standards) | Project file: `GHOSTWIRE_Preflight_Doctrine_v1.md` |
| Advancement principles (2XP-1BP) | Project file: `GHOSTWIRE_Wiki_Advancement_Principles_2026-07-22.md` |

---

*End of `Ghostwire_Scout_Development_Master.md` (v2 refactor). Next agent: fold this into the ship pipeline once Michael reviews and approves; reconcile against the finalized core rulebook Chapter 2 (The Overlords) when the world-lore-bible expands the four currently-unnamed conglomerates (Meridian / Ironclad / Verdant / Sanctum); move surge definition to shared glossary during the numeric damage/status pass.*
