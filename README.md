# Draw Steel - Ghostwire Build

Foundry VTT **module** for Ghostwire. It runs on the stock **Draw Steel** system (`draw-steel`) and does **not** fork or replace that system.

## Architecture

| Layer | Package |
| --- | --- |
| System (unchanged) | `draw-steel` |
| Ghostwire world | Your Foundry world bound to Draw Steel |
| This module | Reskin / CSS, localization, Ghostwire compendium packs, optional sheet overlays |

Class design rules live in Ghostwire Development Master docs outside this repo. This repo ships Foundry packaging only.

## Target stack

- Foundry VTT **14** (minimum / verified **14.367**)
- Draw Steel **1.1.2+**

## Characteristic lang map (0.1.1+)

Ghostwire display labels override Draw Steel characteristic **full** names. Abbreviations (M / A / R / I / P) stay Draw Steel so potency text keeps working.

| Draw Steel | Ghostwire label |
| --- | --- |
| Might | Physique |
| Agility | Reflex |
| Reason | Logic |
| Intuition | Instinct |
| Presence | Persona |

Also: Wealth → **Nuyen**; sheet chrome labels say Ghostwire instead of Draw Steel.

Style tokens live in `styles/ghostwire.css` (`--ghostwire-*`). The module adds `ghostwire` / `ghostwire-theme` classes on `document.body` at init.

## Install (dev)

1. Install Draw Steel from Foundry’s system browser.
2. Clone or symlink this repo into your Foundry Data folder:

```text
Data/modules/draw-steel-ghostwire
```

3. Enable **Draw Steel - Ghostwire Build** in the world module list.
4. Reload the world.

## Install (release)

Use Foundry **Install Module** / update from:

`https://github.com/dreamforge2361/draw-steel-ghostwire/releases/latest/download/module.json`

## Status

- `0.1.0` — skeleton
- `0.1.1` — lang pass (characteristics + nuyen + sheet labels) and CSS style tokens
- `0.1.2` — Foundry spike: **Ghostwire Origins** compendium with Pure Human (ancestry) and its signature trait Detect the Supernatural (trait + maneuver), cloned from DS Human. Purchased traits not yet implemented.
- `0.1.3` — Pure Human purchased traits: 3-point picker with Can’t Take Hold (1), Perseverance (1), Resist the Unnatural (1), Determination (2), and Staying Power (2), cloned from DS Human. The build script now writes embedded Active Effects.
- `0.1.4` — Lang: item type labels Culture → **Background**, Career → **Profession** (`TYPES.Item.*`), so the hero sheet header shows "+ Add Background" and "No Profession". Class is unchanged.
- `0.1.5` — Corran ancestry: signature trait Labor Brand (a reskin of Runic Carving; the Light brand is an effect you toggle on the sheet) and a 3-point picker with Great Fortitude (2), Grounded (1), Hardened Hide (2), Stand Tough (1), and Stone Shaper (1), cloned from DS Dwarf.
- `0.1.6` — Ghostwire Origins now has one folder per People. Adds the Elvani ancestry: signature trait Corp Glamor and a 3-point picker with Glamor of Terror (2), Graceful Retreat (1), High Senses (1), Otherworldly Grace (2), Revisit Memory (1), and Unstoppable Mind (2), cloned from DS High Elf.
- `0.1.7` — New heroes get **Drive** (vehicles) instead of the Draw Steel **Ride** move action. Drive lives in a new **Ghostwire Abilities** compendium; `scripts/module.mjs` swaps it into `ds.CONFIG.hero.defaultItems` at init.
- `0.1.8` — Goliar ancestry (in its own Origins folder): signature trait Relentless and a 3-point picker with Bloodfire Rush (1; its +2 speed is an effect you apply by clicking a link in the trait), Glowing Recovery (2), Grounded (1), Nonstop (2), and Passionate Artisan (1), cloned from DS Orc.
- `0.1.9` — Changer ancestry (in its own Origins folder), cloned from DS Dragon Knight: signature trait Beast-Hide and a 3-point picker with Pack Guard (1), Feral Cry (2), Savage Burst (2), Layered Hide (1), Beast’s Resolve (1), and Beast Movement (2). A required **Lineage** pick gives Raven Walk + Fly, Rat size 1S, or Wolf +2 speed. **Changer Forms** has three form effects (Human, the default; Hybrid; Beast), and `scripts/module.mjs` keeps only one enabled and warns if a Changer is created without a lineage.
- `0.1.10` — Revenant ancestry (in its own Origins folder), cloned from DS Revenant. Signature trait Tough But Withered (immunity equal to level to cold, corruption, lightning, and poison; fire weakness 5; being inert, and fire destroying an inert body, are rules text only). A required **Former Life** pick grants one of `Former Life: Pure Human / Corran / Elvani / Goliar / Changer / Mutant / Cyborg`, which stays on the sheet. The purchased traits are Bloodless (2), Previous Life: 1 Point (1), Previous Life: 2 Points (2), Undead Influence (1), and Vengeance Mark (2, grants the Vengeance Mark maneuver and the Detonate Sigil signature ability). Previous Life opens a pick of one real Origins trait of that cost; `scripts/module.mjs` disables any trait that isn’t in the Former Life People’s Origins folder. Size and speed need no effects (every Ghostwire People is 1M and hero speed is 5), so a 1S former life (a Rat-lineage Changer) uses **Revenant (Small)** (size 1S, 3 points). Mutant and Cyborg have no Origins traits yet, and each Previous Life trait can be bought once. No Decay ladder.
- `0.1.11` — Mutant ancestry (in its own Origins folder), cloned from DS Devil: signature trait Aberrant Rapport (one interpersonal skill, plus an edge to discover motivations and pitfalls) and a 3-point picker with Barbed Mutation (1), Warped Legs (1, speed 6), Taint Flare (1, grants a triggered ability), Taint Sight (1), Ossified Crown (2, saves on 5+), Prehensile Mutation (2, can’t be flanked), and Membrane Wings (2; toggle the echelon 1 or echelon 2+ fly effect while flying). The optional Corruptive Flaw is description only, with no Corruption Load meter. Revenant Former Life: Mutant now offers these traits to Previous Life.
- `0.1.12` — Cyborg ancestry (in its own Origins folder), cloned from DS Time Raider. Signature trait Cortical Firewall (psychic immunity equal to level) plus a free **Arcane Severance** feature holding the hard constraints: no Magic abilities, no Elementalist or Street Priest, tech-only recovery, and a System Crisis pointer. There’s a 3-point picker with Penetration Optics (1, grants a maneuver), Predictive Sensors (1), Auxiliary Limbs — Athletics (1), Auxiliary Limbs — Combat (2), Installed Suite (2: pick Kinetic Driver, Particle Lance, or Servo Overclock; these use a **Tech** keyword that `scripts/module.mjs` registers, not Psionic), and Locked Processors (2, can’t be dazed). Particle Lance follows the Ghostwire text, so it has no slide. Cyborgs don’t use the Chrome chapter. Revenant Former Life: Cyborg now offers these traits to Previous Life.
- `0.1.13` — Street-themed default hero actions with unchanged mechanics: Charge → **Rush** (the Charge keyword label also reads Rush), Defend → **Take Cover**, Heal → **Patch Up**, Aid Attack → **Spot Target**, alongside Ride → Drive. They are Ghostwire Abilities copies that `scripts/module.mjs` swaps into the hero default items. Hide, Search for Hidden Creatures, Use Consumable, and Make/Assist Test are rules text in Draw Steel, not hero ability items, so they aren’t renamed.
- `0.1.14` — The Origins compendium is now labeled **Ghostwire Ancestries** in Foundry. Its pack id and path stay `origins`, so existing `Compendium.draw-steel-ghostwire.origins.*` UUIDs and links don’t change.
- `0.1.15` — **Body Integrity** (actor flag, shown at the top of the hero Stats tab; living heroes 20/20; Cyborgs see N/A), new heroes start with **¥5,000**, and a **Ghostwire Chrome** compendium with five Standard implants that have working effects: Datajack (1), Cyber-Eyes (2, edge on Alertness and Search), Reaction Enhancer (3, +1 Disengage), Dermal Plating (4, damage immunity 2), and Cyberlimb (Arm) (5, +1 melee weapon damage). Dropping an implant on a hero spends its Integrity; deleting it refunds 75%. Cyborgs and heroes without enough Integrity are blocked.
- `0.1.16` — Ghostwire Chrome now has 13 Standard implants, each with a price and Availability (the header line in its description, plus a line under the name on the item sheet). New implants: Vocal Modulator, Implant Weapon (grants Spur Strike), Internal Air / Filtration, Cyber-Ears, Running Gear, Skillwires / Encephalon, Muscle / Bone Lacing, and Wired Reflexes. Location slot caps are enforced (Nervous System 1, so Reaction Enhancer and Wired Reflexes can’t stack).
- `0.1.17` — **Ghostwire Kits** compendium with all 21 Kits in role folders, cloned from the Draw Steel kits with stock bonus numbers as a provisional benchmark and reskinned signature abilities. The Duelist signature uses the Tech keyword instead of Psionic. Kit sheets relabel weapon categories: Firearm / Bow, Unarmed / Cyberlimb, Whip / Monowhip.
- `0.1.18` — **Ghostwire Gear** compendium: 17 Kit-qualifying weapons, shields, and special gear plus 4 armors, each with ¥, Availability, and the Kit categories it satisfies (in the description header and under the name on the item sheet). Street gear adds no numbers because the Kit supplies doctrine. Armor Stamina is a no-Kit-only toggle, and a few premium items have small wielded toggles.
- `0.1.19` — **Ghostwire skills**: the 44 skills in 6 groups (Action, Technical, Knowledge, Social, Vehicle & Drone, Magic & Supernatural) replace the Draw Steel skill list everywhere skills are picked or shown. Draw Steel skill and group grants (stock Backgrounds, Professions, classes) translate to Ghostwire skills. Module content that referenced Draw Steel skills now uses Ghostwire skills.
- `0.1.20` — **Ghostwire Classes** compendium with the **Operator** (Adrenaline), cloned from the Draw Steel Fury: class, three Origins (Corp-Milspec, Merc with two Kits, Street-vet), Ghostwire signatures Controlled Pair + Suppressing Fire, the Ghostwire 1–5 Adrenaline base band, and every level 1–10 feature and 7/9/11 ability with Draw Steel mechanics under chapter names.
- `0.1.21` — **Ghostwire Backgrounds** (8) and **Ghostwire Professions** (15). A Background grants one fixed skill and a choice of 1 from four; a Profession grants one fixed skill and a choice of 2 from four. Skill pickers leave out skills the hero already has. The hero sheet’s **+ Add Ancestry / Background / Profession** buttons open the Ghostwire compendiums.
- `0.1.22` — Operator polish: feature levels follow `01-operator.md`; heroic abilities use the Tech keyword instead of Magic; signatures and base band roll with Reflex; skill picks use Ghostwire groups; Merc gets a Field Arsenal feature (two Kits, preferred Kit); Street-vet picks a Loadout Damage Type; remaining Fury flavor text rewritten. Heroic abilities can’t be used in combat without enough heroic resource (Adrenaline).
- `0.1.23` — **Full Master Gear List import** (`docs/masters/GHOSTWIRE_GEAR_MASTER.md`): every table row is an item — **Ghostwire Gear** (107: general & lifestyle, armor, weapons), **Ghostwire Mods** (16), **Ghostwire Matrix** (33), **Ghostwire Vehicles & Drones** (31), **Ghostwire Foci** (41). Grade is Draw Steel **echelon 1–4 + Availability band** (no Item Tier). Replaces the 0.1.18 Kit-subset gear.
- `0.1.24` — **Mods expansion:** Ghostwire Mods now has Weapon, Vehicle & Drone, **Armor & Shield** (7), and **Gadget** (8) mods (31 total); Ghostwire Matrix adds **RCC Autosofts** (4). Every item with mod slots lists the mods that fit it; items with no mod family (foci, Field Surgery Kit, Designer Threads, Faraday Bag) have 0 slots. §Craft text is the downtime Project procedure keyed to Repair, Electronics, Hacking (autosofts: Hacking or Rigging), or Cybertech — no “Gunsmithing”. Rules: `docs/rulebook/14-mods.md` (mod doctrine + Invent a Mod).
- `0.1.25` — **Scout** class (Advantage) in **Ghostwire Classes**, cloned from the Draw Steel Shadow: class, three subclasses (**Hunter** — Ironclad Longshot, **Ghost** — Ferrum Deep-Dark, **Face-in-crowd** — Nyx Mask-Line), four signatures, the 3/5/7/9/11 Advantage bands, and every level 1–10 feature, per `docs/rulebook/02-scout.md`. New **Chrome** and **Optics** ability keywords. *Pending Foundry verification.*
- `0.1.26` — **Ghostwire Perks** compendium: all 47 Draw Steel perks reskinned for the Reach, in one folder per perk type (crafting, exploration, interpersonal, intrigue, lore, supernatural), plus the three perk abilities (Veil Trick, Ghost Touch, Wire Whisper) cloned into the pack. Class perk grants now list the matching Ghostwire perks as choices; Draw Steel perks are refused and removed from the perk registry. Rules: `docs/rulebook/17-perks.md`. *Pending Foundry verification.*
- `0.1.27` — **Matrix Verbs + Wired connection states (B23a):** every hero gets the nine Matrix Verbs (Ghostwire Abilities › Matrix Verbs, **Wired** keyword, no cost). Connect enters **Overlay**, Toggle Connection State switches Overlay ↔ **Jacked In**, Jack Out disconnects; the state is a token status icon, a sheet status, a Wired box on the Stats tab, and `flags.draw-steel-ghostwire.wired`. Overlay banes real-world ability rolls; Jacked In gives an edge on Wired rolls and blocks real-world rolls; the Hacking skill gives an edge on Wired rolls. Existing heroes get missing verbs once on GM load. Rules: `docs/rulebook/08-hacker.md`; Foundry notes: `docs/rulebook/18-wired-foundry.md`. *Pending Foundry verification.*
- `0.1.28` — **Wired Console (B23b):** an ApplicationV2 popout (Token controls › network button, or an assignable keybinding) for the viewed scene: a live connection roster from the Overlay / Jacked In statuses, and the scene’s nodes stored in `flags.draw-steel-ghostwire.wiredBoard` — Track, Node Rating with the System Stat Card (Breach DC, ICE, Biofeedback, Integrity 12/18/26/36/50), Integrity damage/restore, and a 12-step Trace Alert with a counter-trace warning and reset to 6. The Director edits and reveals nodes; players see revealed nodes and their own connection read-only. Notes: `docs/rulebook/18-wired-foundry.md`. *Pending Foundry verification.*
- `0.1.29` — **Commander** class (Influence) in **Ghostwire Classes**, on the Draw Steel Tactician spine: class, three Command Doctrines (**Street-Fixer**, **Corp-Exec**, **Bard**) with their level 1–9 features, triggered actions, and 2nd/6th/9th-level ability choices; four signatures (**Direct Ally**, **Mark** with a Marked effect, **Read the Room**, **The Right Word**); every 1/3/5/7/9/11-Influence ability from the chapter; and the level 1–10 class features. New **Command** ability keyword. Rules: `docs/rulebook/03-commander-face.md`. *Pending Foundry verification.*
- `0.1.30` — **Languages:** every Draw Steel language keeps its key but shows its locked Ghostwire name (Trade Cant, Corp Cant, Wire Speak, …) on the hero sheet and in language pickers. Map and rules baseline: `docs/masters/GHOSTWIRE_LANGUAGES.md`, `docs/rulebook/19-languages.md`.
- `0.1.31` — **Medic** class (Reagents) in **Ghostwire Classes**, on the Draw Steel Troubadour spine: class, three specializations (**Street-Doc**, **Corp-Medtech**, **Ripperdoc**, including the Nano-Adrenal Auto-Injector capstone) with their level 1–9 features, triggered actions, and 2nd/6th/9th-level picks; three signatures (**First Aid**, **Administer Dose**, **Diagnose**); every 1/3/5/7/9/11-Reagent ability from the chapter plus **Field Synthesis**; and the level 1–10 class features. **Reagents persist across encounters:** no per-turn gain, and combat start doesn't reset them. Rules: `docs/rulebook/04-medic.md`.
- `0.1.32` — **Wrench** class (Uptime) in **Ghostwire Classes**, on the Draw Steel Talent spine with every psionic reference scrubbed: class, three street-taught subclasses (**Drone Jockey**, **Vehicle Rig-Pilot**, **Facility Rigger**) with their level 1–9 feature ladders and full Base / 7 / 9 / 11-cost ability bands; four signatures (**Deploy & Command**, **Rigged Fire**, **Field Repair**, **Override Ping**); **Focus Fire**; Fleet Size, Uptime cap, Jump-In buffer, and **Overclock** features. Uptime gains a flat 1 per turn in Foundry; the rest of the fleet loop is feature text. Drone/vehicle inventories are not in this release. Rules: `docs/rulebook/05-wrench.md`.
- `0.1.33` — **Medic gap locks:** Toxins deal 2 + Instinct over 2 rounds with Weakened (enhanced 4 + Instinct, Weakened and Slowed); a second 9th-level pick for each specialization (**Last Syringe**, **Crash Protocol Override**, **Emergency Excision**); **Anesthetize** is now an Instinct power roll; Reagents still spend outside combat, and Foundry blocks an unaffordable Reagent ability out of combat too.
- `0.1.34` — **Wrench polish:** Overclock is now a real 10th-level capstone (once per encounter on Deploy/Command: Uptime costs −2, machines +2 Integrity buffer); **Jump-In Buffer** rises to +5 at 6th level and +6 at 7th; **Uptime Economy Mastery** at 9th. Three new rigger Kits in **Ghostwire Kits › Tech / rigger** — **Fabricator's Bench**, **Rigger's Harness**, **Field Chassis** — each with a signature ability and a +1 rigging bonus, listed first in the Wrench Kit picker as the subclass starter Kits. **Medic:** Nerve Toxin and Nerve Agent deal 6 + Instinct over 3 rounds; the Medic master matches the chapter locks.
- `0.1.35` — **Elementalist** class (Essence) in **Ghostwire Classes**: class, three specializations (**Pyromancer**, **Stormcaller**, **Geomancer**) with passives at 1/2/5/6/8, signature summons (Ember / Zephyr / Boulder Companion), signature foci from Ghostwire Foci, and specialization ability picks at 2/6/9; three signatures (**Hurl Element**, **Elemental Shaping**, **Read the Weave**); the base / 7 / 9 / 11-Essence workings including **Summon Elemental**; and the level 1–10 class features through **Primordial Reservoir**. Essence drips 1 per turn; Channel and Resonance are feature text. Cyborgs can't be Elementalists: the hero sheet refuses the combination either way (Arcane Severance). **+ Add Class** now opens Ghostwire Classes, and the Elementalist Kit grant offers **No Kit (Pure Caster)**. Rules: `docs/rulebook/06-elementalist.md`.
- `0.1.37` — **Street Priest** class (Conviction) in **Ghostwire Classes**: a level-1 **Light / Dark pact** overlay (the pact-named features — Roster/Ledger, Burgeoning Saint/Rising Adept, Consecrated/Damned Weapon, Ordained/Sworn — offer only your pact's version); three ministries (**Shepherd**, **Templar** with the **Judgment** mark, **Exorcist**) with ladders and ability picks; three class signatures plus two chosen from eight; the 1/3/5/7/9/11-Conviction workings including **Invoke the Pact**; and the level 1–10 features through **Avatar of the Pact**, **Manifest Will**, and **Most Faithful**. Conviction drips 2 per turn; the Prayer Gamble is feature text. Cyborgs can't be Street Priests. Rules: `docs/rulebook/07-street-priest.md`.
- `0.1.38` — **Hacker** class (Bandwidth) in **Ghostwire Classes**: three Hacking Doctrines (**Disruptor**, **Controller**, **Support**) with full level 1–9 ladders; Programs **Seize Control**, **Deep Scan**, **Ghost Signal**, **Kill Switch**, **Failsafe Cascade**, **Network Purge**, **Backdoor Override**; core features through **Ghost in the Machine**, **Infinite Loop**, and **Borrowed Access**. Three street cyberdecks as Kits in **Ghostwire Kits › Tech / rigger** — Nyx Cartel "Switchblade", Ferrum "Padlock-6", Meridian "Lookout" — each with its signature. The nine Matrix Verbs stay on every hero. Cyborgs can be Hackers. Rules: `docs/rulebook/08-hacker.md`.
- `0.1.39` — **Technomancer** class (Resonance) in **Ghostwire Classes**, the ninth class: three Sprite/Resonance Disciplines (**Sprite-Weaver**, **Machine-Whisperer**, **Resonance-Warrior**) with ladders at 1/2/3/5/7/8; three signatures (**Compile Sprite**, **Resonance Strike**, **Resonance Mending**, which heals machines, chrome, and Cyborgs); the 1/3/5/7/9/11-Resonance abilities including **Total Resonance**; and core features through **Master of the Current**. Resonance drips 1 per turn; sprites and biofeedback (5+ Resonance spends only, never lethal) are feature text. Optional light Kit, including **No Kit (Pure Caster)**. Cyborgs can't be Technomancers. Rules: `docs/rulebook/20-technomancer.md`.

## Origins pack layout (Ghostwire Ancestries)

The pack id and path are `origins`; Foundry shows it as **Ghostwire Ancestries** (`GHOSTWIRE.COMPENDIUM.origins`). Keep the id so UUIDs stay stable.

Each People gets one compendium Folder named after it (Pure Human, Corran, Elvani, …). The People's ancestry and all of its traits and abilities go inside that folder, never at the pack root. The source mirrors this: `src/packs/origins/<people>/` holds a `_folder.json` (the Folder document) plus that People's items, and each item's `folder` is set to that Folder's `_id`. The build fails if an item's `folder` doesn't match its directory.

## Skills (v1)

Rules: `docs/masters/GHOSTWIRE_SKILLS_MASTER.md`. Skills use the five Ghostwire characteristics (Physique, Reflex, Logic, Instinct, Persona); the social skill is **Insight**.

- **How:** `scripts/skills.mjs` replaces `ds.CONFIG.skills.groups` and `ds.CONFIG.skills.list` during `init` (Draw Steel localizes them afterwards), so the hero sheet, skill pickers, and test rolls show only Ghostwire skills, grouped. Keys are camelCase (`firearms`, `securitySystems`, `matrixTheory`, …); effects use `system.skills.modifiers.<key>.edges`.
- **Draw Steel grants:** skill advancements that name Draw Steel skills or groups — stock Backgrounds, Professions, and classes — are translated when the picker opens. A Draw Steel skill becomes its Ghostwire skill below; a Draw Steel group becomes the Ghostwire skills its members map to (for example *interpersonal* offers Command, Deception, Insight, Intimidation, Negotiation, Performance, Persuasion, and Survival from Handle Animals). If two Draw Steel skills map to the same Ghostwire skill, the grant offers it once.
- **Module content updated to Ghostwire keys:** Cyber-Eyes and Cyber-Ears (Perception), Running Gear and Muscle / Bone Lacing (Athletics), Skillwires (Repair), Vocal Modulator (Deception), Synth-Weave Coat (Stealth), Changer Forms (Stealth, Perception, Intimidation), Auxiliary Limbs — Athletics (Athletics, Acrobatics), Corp Glamor (Persuasion), Perseverance (Athletics), Aberrant Rapport (social group). Chrome edges on the same skill don’t stack.
- **Existing heroes:** skills they already picked under Draw Steel keys no longer display. Re-pick them (or re-run the skill advancement) on heroes made before this version.

| Group | Skills |
|---|---|
| Action | Athletics, Brawl, Melee, Firearms, Heavy Weapons, Stealth, Acrobatics, Perception, Survival |
| Technical | Hacking, Electronics, Engineering, Repair, Cybertech, Medicine, Demolitions, Security Systems |
| Knowledge | Streetwise, Corporate, History, Occult, Religion, Matrix Theory, Medicine Lore, Xenology |
| Social | Negotiation, Persuasion, Deception, Intimidation, Command, Insight, Performance, Contacts |
| Vehicle & Drone | Driving, Piloting, Rigging, Gunnery, Navigation |
| Magic & Supernatural | Spellcraft, Rituals, Warding, Resonance, Corruption, Summoning |

**Draw Steel → Ghostwire skill map** (used to translate stock grants)

| Ghostwire skill | Draw Steel skills |
|---|---|
| Athletics | Climb, Endurance, Jump, Lift, Swim |
| Stealth | Conceal Object, Hide, Pick Pocket, Sneak |
| Acrobatics | Gymnastics, Escape Artist |
| Perception | Alertness, Eavesdrop, Search |
| Survival | Cooking, Handle Animals, Track, Nature |
| Electronics | Jewelry |
| Engineering | Architecture, Carpentry |
| Repair | Blacksmithing, Fletching, Mechanics, Tailoring |
| Medicine | Heal |
| Demolitions | Sabotage |
| Security Systems | Pick Lock |
| Streetwise | Criminal Underworld, Rumors |
| Corporate | Society |
| History | Culture, History |
| Occult | Magic, Monsters |
| Religion | Religion |
| Matrix Theory | Timescape |
| Medicine Lore | Alchemy |
| Negotiation | Gamble |
| Persuasion | Flirt, Persuade |
| Deception | Forgery, Lie, Disguise |
| Intimidation | Interrogate, Intimidate |
| Command | Lead, Strategy |
| Insight | Empathize, Read Person |
| Performance | Brag, Music, Perform |
| Driving | Drive, Ride |
| Navigation | Navigate |
| Resonance | Psionics |

**Test click-path**

1. Create a new hero → **Stats** tab → switch to **Edit** mode → open the skills selector: it lists only Ghostwire skills in six groups (Firearms, Hacking, Streetwise, Insight, …) — no Alchemy, Blacksmithing, or other crafting skills.
2. Drag **Mutant** from **Ghostwire Ancestries**: Aberrant Rapport asks for one **Social** skill (Insight, Persuasion, …).
3. Add a stock Draw Steel Background (culture) or Profession (career) with a skill choice: the picker offers Ghostwire skills.
4. Drag **Cyber-Eyes** from **Ghostwire Chrome**: roll a Perception test — it has an edge.

## Backgrounds & Professions (v1)

Rules: `docs/rulebook/13-backgrounds-professions.md`. Draw Steel’s *culture* and *career* item types are labeled **Background** and **Profession** on the sheet.

- **Packs:** **Ghostwire Backgrounds** (`backgrounds`, `culture` items) and **Ghostwire Professions** (`professions`, `career` items). Each item has two skill advancements, both using Ghostwire skill keys: a fixed skill (`chooseN` empty, one choice) and a pick (`chooseN` 1 for Backgrounds, 2 for Professions, from four choices). No languages or perks. Professions set Renown, ¥, and project points to 0.
- **No duplicate picks:** `scripts/skills.mjs` filters a skill picker while it’s open. It leaves out skills the hero already has (sheet skills from any source) and skills chosen elsewhere in the same advancement run, but keeps the advancement’s own current picks when you reconfigure. If fewer than *choose N + 1* options remain, it pads the list with unowned skills from the same Ghostwire groups (then any group), so it’s always a real choice. The filter only applies while the picker is open — Draw Steel’s own data preparation sees the unfiltered list, so saved picks stay valid.
- **Fixed skills don’t collide:** Background fixed skills, Profession fixed skills, and Operator Origin skills (Command, Demolitions, Intimidation) are disjoint, so a Background + Profession never wastes a fixed grant. A fixed skill already granted by some other source (for example an ancestry pick made first) is not rerouted automatically; pick a replacement on the sheet.
- **Sheet buttons:** `scripts/module.mjs` points the hero sheet’s **+ Add** action at the Ghostwire packs for Ancestry (Ghostwire Ancestries), Background, and Profession. Class still opens the Draw Steel classes compendium.

| Background | Fixed | Choose 1 |
|---|---|---|
| Undercity Barrens | Stealth | Streetwise, Survival, Perception, Athletics |
| Corp Arcology | Corporate | Persuasion, Negotiation, Insight, Security Systems |
| Sprawl District | Streetwise | Negotiation, Contacts, Perception, Brawl |
| Transit Hub / Freeport | Navigation | Contacts, Driving, Piloting, Negotiation |
| Outland Wastes | Survival | Athletics, Driving, Perception, Firearms |
| Academic Spire | History | Occult, Matrix Theory, Medicine Lore, Xenology |
| Faith District | Religion | Insight, Occult, Warding, Medicine |
| Industrial Deep | Engineering | Repair, Athletics, Demolitions, Electronics |

| Profession | Fixed | Choose 2 |
|---|---|---|
| Wage-Slave | Negotiation | Corporate, Persuasion, Insight, Electronics |
| Street Doc | Medicine | Cybertech, Insight, Streetwise, Medicine Lore |
| Fixer | Contacts | Negotiation, Streetwise, Insight, Deception |
| Courier | Driving | Stealth, Navigation, Athletics, Streetwise |
| Gang Soldier | Firearms | Intimidation, Streetwise, Brawl, Melee |
| Security Guard | Perception | Firearms, Intimidation, Security Systems, Brawl |
| Smuggler | Security Systems | Deception, Contacts, Driving, Stealth |
| Rig-Tech | Rigging | Electronics, Repair, Driving, Piloting |
| Deck Jockey | Hacking | Matrix Theory, Electronics, Security Systems, Streetwise |
| Entertainer | Performance | Persuasion, Deception, Insight, Contacts |
| Beat Reporter | Perception | Corporate, Contacts, Insight, Electronics |
| Hauler / Labor | Athletics | Driving, Repair, Brawl, Engineering |
| Merc Recruit | Firearms | Athletics, Survival, Melee, Heavy Weapons |
| Acolyte | Occult | Religion, Insight, Warding, Rituals |
| Chop-Doc Assistant | Cybertech | Medicine, Streetwise, Demolitions, Electronics |

**Test click-path**

1. Create a new hero. Click **+ Add Background** (opens **Ghostwire Backgrounds**) and drag **Sprawl District** onto the hero. The advancement window shows the fixed **Streetwise** and a **Background Skill (choose 1)** picker: Negotiation, Contacts, Perception, Brawl. Pick **Negotiation**.
2. Click **+ Add Profession** and drag **Fixer**. Its fixed skill is **Contacts**. The **Profession Skills (choose 2)** picker would normally offer Negotiation, Streetwise, Insight, Deception — Negotiation and Streetwise are already yours, so it shows Insight and Deception plus one unowned skill from the same groups (Corporate) to keep it a real choice. Pick two.
3. **Stats** tab → Skills lists Streetwise, Negotiation, Contacts, and your two new picks — five different Ghostwire skills, no duplicates, no Draw Steel skills.

## Classes (v1)

Rules: `docs/rulebook/01-operator.md` (authoritative), `docs/masters/GHOSTWIRE_OPERATOR_DEVELOPMENT_MASTER.md`. The **Ghostwire Classes** compendium (pack id `classes`) holds folder **Operator** › **Abilities** / **Origins** › Corp-Milspec, Merc, Street-vet.

### Operator

- **Structure:** the Operator is the Draw Steel **Fury** tree cloned and renamed (Ferocity → Adrenaline, Berserker → Corp-Milspec, Reaver → Merc, Stormwight → Street-vet). Every 7/9/11 ability, Origin doctrine ability, and feature keeps its Draw Steel power rolls and effects; names, text, and feature levels come from the chapter. Class: Physique + Reflex, Stamina 21 (+9), Recoveries 10, heroic resource **Adrenaline** (1d3 per turn), epic resource **Combat Legend**.
- **No magic:** the Operator casts nothing, so heroic and doctrine abilities that had Draw Steel’s Magic keyword use **Tech** instead (a Cyborg Operator can use all of them under Arcane Severance).
- **Adrenaline costs:** every heroic ability’s cost is its Draw Steel `resource` (base band 1–5, bands 7/9/11, Origin doctrine abilities 5/9/11); signatures and the Origin triggered abilities cost nothing. Draw Steel’s own use dialog doesn’t stop you spending Adrenaline you don’t have, so `scripts/module.mjs` refuses to use a heroic ability **in combat** when the hero’s current heroic resource is below its cost (warning, no dialog). Outside combat abilities stay usable without spending, per the chapter. The dialog still lets you type a different spend amount.
- **Ghostwire-original:** signatures **Controlled Pair** (ranged 10, 3/6/9 + Reflex) and **Suppressing Fire** (3 cube within 10, 1/2/3), both granted at 1st level; base band **Breach & Clear** (1), **Trigger Cadence** (2), **Hold the Line** (2), **Overwatch** (3), **Adrenaline Dump** (5), choose one at 1st level. All roll with **Reflex**; base-band damage is flat as printed in the chapter.
- **Skills:** 1st level — choose two from the **Action** or **Vehicle & Drone** groups; 4th, 7th, and 10th — any Ghostwire skill. Origin skills are fixed: Corp-Milspec **Command**, Merc **Demolitions**, Street-vet **Intimidation**. Pickers leave out skills the hero already has (same rule as Backgrounds and Professions).
- **Origins:** each picks from the 21 Ghostwire Kits. **Merc** picks **two** and gets **Field Arsenal**: Draw Steel uses the better Stamina, speed, stability, disengage, and distance of the two Kits and the damage bonus of the **preferred Kit** — on the sheet’s **Equipment** tab, right-click a Kit → **Make Preferred Kit** (a star marks it). **Street-vet** picks a **Loadout Damage Type** (Cryo = cold, Toxin = corruption, Incendiary = fire, Shock = lightning) used by its abilities; at 4th and 10th level, enable the matching immunity effect on Combat Form / Warzone Incarnate.
- **Level table — follows the chapter.** Draw Steel advancements are independent per-level grants with no dependencies between them, so the Fury slots were moved to match `01-operator.md`: **4th** — Damaging Adrenaline, Growing Adrenaline I, Combat Attunement, Precision Strike, Veteran of the Sprawl, Breach Point, Combat Form, Greater Adrenaline (Fury had the last four at 6th/7th); **7th** — Growing Adrenaline II; **Corp-Milspec Anchored Stance** — 6th (Fury: 3rd). Adrenaline income is unchanged in shape: Greater Adrenaline (1d3 + 1 per turn) and Damaging Adrenaline both arrive at 4th, Peak Adrenaline at 10th. This front-loads 4th level compared to Draw Steel’s Fury.
- **Omitted:** Fury’s Mighty Leap and fixed Nature skill (not in the chapter). Street-vet’s Growing Adrenaline table is cloned from the Merc’s, since the Stormwight’s lived in its animal-form kits. Lock Down! still applies Draw Steel’s **Petrified** condition (called “locked down” in its text). Perks are still Draw Steel perks.

**Create an Operator hero**

1. Create a hero. On the sheet, **+ Add Ancestry** → drag **Pure Human** (or any People) and finish its picks.
2. Drag **Operator** from **Ghostwire Classes** › Operator. In the advancement window: choose two **Action / Vehicle & Drone** skills, an **Operator Origin**, and one **Heroic Ability (1–5 Adrenaline)**. Adrenaline, Controlled Pair, and Suppressing Fire are granted automatically.
3. Configure the Origin: its skill is fixed (Command, Demolitions, or Intimidation); pick the Kit (Merc: two Kits; Street-vet: also the Loadout Damage Type).
4. **+ Add Background** → drag one (for example **Sprawl District**); take the fixed skill and choose 1. **+ Add Profession** → drag one (for example **Gang Soldier**); choose 2. Skills you already have — including your Origin skill — don’t appear in these pickers. *(Add the class before Background/Profession: Origin skills are fixed grants, so a Background/Profession pick made first could duplicate them.)*
5. **Merc only:** Equipment tab → right-click the Kit whose damage you want → **Make Preferred Kit**.
6. Drag qualifying gear from **Ghostwire Gear** (for example the **Longshot** marksman rifle for the Longshot Kit, or the **Sleeve-Gun** + **Armored Jacket** for Ghost).
7. Check: Stats shows **Adrenaline**; Skills are all Ghostwire skills with no duplicates; Abilities lists Controlled Pair, Suppressing Fire, the chosen heroic ability, the Kit signature ability, and the Origin’s triggered ability (Kinetic Redirect, Wired Reflexes, or Overclock Nerves); Features include Field Arsenal (Merc) or your Loadout (Street-vet).

### Scout

Rules: `docs/rulebook/02-scout.md` (authoritative), `docs/masters/GHOSTWIRE_SCOUT_DEVELOPMENT_MASTER.md`. Folder **Scout** › **Abilities** / **Origins** › Hunter, Ghost, Face-in-crowd.

- **Structure:** the Draw Steel **Shadow** tree cloned and renamed (Insight → **Advantage**, Umbral Form → **Ghost Suite**, Gloom Squad → **Ghost Squad**, Keen Insight → **Sharper Eye**, Surge of Insight → **Surge of Advantage**). Class: Reflex + Logic, Stamina 18 (+6), Recoveries 8, 1d3 Advantage per turn, epic resource **Subterfuge**. Heroic abilities keep Draw Steel power rolls; names and text come from the chapter, and strikes roll with **Reflex**.
- **Subclasses:** **Hunter** is Ghostwire-original (Quarry, Ranged Reflex, Steady the Scope, Called Shots, Overwatch Lane, Ghost Round, One Shot One Kill, Vantage Trap). **Ghost** reskins Black Ash (Blink Rig: “Blink” = reposition, not teleport). **Face-in-crowd** reskins Harlequin Mask (Mask Rig keeps I’m No Threat’s edge and Disengage effects). Subclass skills: Survival, Demolitions (sabotage), Deception (lie).
- **No magic:** no Scout ability has Magic. Former Magic abilities use **Chrome** (implant-driven) or **Optics** (emitter/holo-driven), registered in `scripts/module.mjs`. Corruption damage became untyped damage called thermal-optic or thermal-kinetic in the text; Ghost Suite’s thermal-optic immunity is rules text.
- **Advantage costs:** heroic abilities carry their cost in `resource`, so the existing in-combat check blocks a heroic ability when current Advantage is below its cost (Hesitation Is Weakness and Diversion cost 1). The Scout’s “1 fewer Advantage with an edge” discount isn’t automated; the check uses the full cost.
- **Surges:** feature text gives the Ghostwire value (+2/+3/+4/+5 damage per surge by echelon). Gaining surges uses Draw Steel’s `[[/surge]]` links; how much damage a spent surge adds is still Draw Steel’s own calculation.
- **Skills and Kit:** Stealth is free; then choose five from Action, Social, Technical, or Knowledge (owned skills are left out). 4th/7th/10th: any skill. Kit pool is the 11 light Kits (no or light armor, no heavy weapon, not Hexshot/Spellblade/Sanctified); Quick Build Ghost.
- **Ghost Suite** is an effect you apply from the feature (climb, edge on strikes against you, bane on Persona tests; ends at combat end). Quarry has a **Marked (Quarry)** effect to apply to the target.

## Perks (v1)

Rules: `docs/rulebook/17-perks.md`. The **Ghostwire Perks** compendium (pack id `perks`) holds 47 perks in six type folders (Crafting 6, Exploration 10, Interpersonal 10, Intrigue 6, Lore 8, Supernatural 7) and a **Perk Abilities** folder.

- **Structure:** each perk is cloned from its Draw Steel perk with the same `perkType` and mechanics; names and text are Ghostwire (skill groups read as Technical / Action / Social / Knowledge, outcomes as low / middle / high results). Polyglot keeps Linguist’s two-language grant; Echo Reader keeps Thingspeaker’s bane effect; Veil Familiar still links the Draw Steel familiar stat block.
- **Perk abilities:** Veil Trick (Magic), Ghost Touch and Wire Whisper (Psionic, read as the Signal) are module copies; their perks grant the module copies, not the Draw Steel abilities.
- **Perk grants:** Draw Steel perk advancements have an empty pool and only accept a dropped perk. `scripts/module.mjs` fills the choice list with every Ghostwire perk whose type the grant allows (all six when the grant says any perk), refuses Draw Steel perks dropped from `draw-steel.character-options`, and removes those perks from `ds.registry.perk`. Ghostwire perks can still be dropped in. The six perk types are registered with Ghostwire labels, because Draw Steel derived them from the skill groups Ghostwire replaced.
- **Not hidden:** the Draw Steel perks still appear if you open the Draw Steel character-options compendium directly (that pack also holds kits and titles).

## Kits (v1)

Rules: `docs/rulebook/10-kits.md`. The **Ghostwire Kits** compendium (pack id `kits`) holds all 21 Kits in five role folders. Each Kit folder also holds that Kit’s signature ability.

- **Structure:** each Kit is a Draw Steel `kit` item cloned from its source kit. It has the same equipment block and bonus fields (Stamina per echelon, speed, stability, disengage, melee/ranged damage by result, distance) and a signature-ability grant pointing at the Ghostwire copy.
- **Numbers are provisional.** They are the Draw Steel kit benchmarks unchanged, pending the Kits numeric pass. Signature abilities keep their Draw Steel numbers; names, story, and effect text are reskinned (Might/Agility read as Physique/Reflex).
- **Doctrine never costs ¥**, so Kits have no price. Every description repeats the ownership rule: no qualifying gear owned means no Kit bonuses (not automated; the Director and player apply it).
- **Keywords:** Duelist’s Gravity Cut uses **Tech** instead of Psionic. Hexshot, Spellblade, and Sanctified signatures keep **Magic** (Cyborgs can’t use them under Arcane Severance).

| Kit | Folder | Draw Steel source | Gear category | Bonuses (damage low/mid/high) | Signature |
|---|---|---|---|---|---|
| Longshot | Ranged specialists | Sniper | Precision rifle; no armor | Speed +1, Disengage +1, Ranged +0/+0/+4, Ranged distance +10 | Held Breath |
| Saturation | Ranged specialists | Rapid-Fire | SMG or carbine; light armor | Stamina +3, Speed +1, Disengage +1, Ranged +2/+2/+2, Ranged distance +7 | Double Tap |
| Ghost | Ranged specialists | Cloak and Dagger | One or two silenced light weapons; light armor | Stamina +3, Speed +2, Disengage +1, Melee +1/+1/+1, Ranged +1/+1/+1, Ranged distance +5 | Ghost Out |
| Hexshot | Ranged specialists | Arcane Archer | Bow, crossbow, or dartgun; no armor | Speed +1, Disengage +1, Ranged +2/+2/+2, Ranged distance +10 | Hex Round |
| Gunslinger | Gun/blade finesse | Swashbuckler | Medium sidearm or blade; light armor | Stamina +3, Speed +3, Disengage +1, Melee +2/+2/+2 | Quickdraw Shuffle |
| Streetsweeper | Gun/blade finesse | Ranger | Shotgun or carbine plus a medium weapon; medium armor | Stamina +6, Speed +1, Disengage +1, Melee +1/+1/+1, Ranged +1/+1/+1, Ranged distance +5 | Kneecap Shot |
| Raider | Gun/blade finesse | Raider | Light weapon plus a shield; light armor | Stamina +6, Speed +1, Disengage +1, Melee +1/+1/+1, Ranged +1/+1/+1, Ranged distance +5 | Shock and Awe |
| Juggernaut | Heavy / tank | Mountain | Heavy weapon; heavy armor | Stamina +9, Stability +2, Melee +0/+0/+4 | Payback |
| Warframe | Heavy / tank | Shining Armor | Medium weapon plus a shield; heavy armor | Stamina +12, Stability +1, Melee +2/+2/+2 | Hold the Line |
| Breacher | Heavy / tank | Sword and Board | Medium weapon plus a ballistic shield; medium armor | Stamina +9, Stability +1, Disengage +1, Melee +2/+2/+2 | Breach and Bash |
| Bulldozer | Heavy / tank | Panther | Heavy weapon; no armor | Stamina +6, Speed +1, Stability +1, Melee +0/+0/+4 | Freight Train |
| Brawler | Melee / martial | Pugilist | Unarmed or cyberlimb strikes; no armor | Stamina +6, Speed +2, Stability +1, Melee +1/+1/+1 | Stagger Combo |
| Mantis | Melee / martial | Martial Artist | Unarmed or cyberlimb strikes; no armor | Stamina +3, Speed +3, Disengage +1, Melee +2/+2/+2 | Mantis Feint |
| Chromeblade | Melee / martial | Dual Wielder | A light plus a medium melee weapon; medium armor | Stamina +6, Speed +2, Disengage +1, Melee +2/+2/+2 | Twin Cut |
| Reach | Melee / martial | Guisarmier | Polearm or long cyber-weapon; medium armor | Stamina +6, Stability +1, Melee +2/+2/+2, Melee distance +1 | Haft and Blade |
| Monowhip | Melee / martial | Whirlwind | Whip, monofilament, or chain; no armor | Speed +3, Disengage +1, Melee +1/+1/+1, Melee distance +1 | Monofilament Lash |
| Snarehunter | Melee / martial | Retiarius | Net or ensnaring gear plus a polearm; light armor | Stamina +3, Speed +1, Disengage +1, Melee +2/+2/+2, Melee distance +1 | Tangle and Stab |
| Staff Adept | Melee / martial | Stick and Robe | Staff or polearm; light armor | Stamina +3, Speed +2, Disengage +1, Melee +1/+1/+1, Melee distance +1 | Staff Redirect |
| Duelist | Melee / martial | Battlemind | Medium melee weapon; light armor | Stamina +3, Speed +2, Stability +1, Melee +2/+2/+2 | Gravity Cut |
| Spellblade | Magic-tech | Spellsword | Medium melee weapon plus a shield; light armor | Stamina +6, Speed +1, Stability +1, Melee +2/+2/+2 | Arc Blade |
| Sanctified | Magic-tech | Warrior Priest | Light weapon; heavy armor | Stamina +9, Speed +1, Stability +1, Melee +1/+1/+1 | Veil Brand |

**Test click-path**

1. Compendium sidebar → **Ghostwire Kits** → five folders (Ranged specialists, Gun/blade finesse, Heavy / tank, Melee / martial, Magic-tech) holding 21 Kits.
2. Open **Longshot**: the description shows gear, ownership rule, provisional bonuses, and a link to Held Breath; the details show Firearm / Bow and no armor.
3. Drag **Longshot** onto a hero (with a class): the Kit appears on the sheet, **Held Breath** is added to Abilities, speed is +1, and Held Breath and the ranged free strike show +10 distance and +4 damage on the high result.
4. Swap to **Brawler**: Stamina max rises by 6 (echelon 1), stability +1, speed +2, melee free strike +1/+1/+1, and **Stagger Combo** is added.
5. Swap to **Juggernaut**: Stamina +9, stability +2, melee free strike +0/+0/+4, and **Payback** is added.

## Gear catalog (v2)

Source of record: `docs/masters/GHOSTWIRE_GEAR_MASTER.md` — every table row is a Foundry item; prices, slots, profiles, and tags are copied from the master. Rules: `docs/rulebook/10-kits.md` (ownership rule), `docs/rulebook/11-economy.md`, `docs/rulebook/12-chrome.md`.

| Compendium | Pack id | Items | Master sections | Folders |
|---|---|---|---|---|
| **Ghostwire Gear** | `gear` | 107 | 1A–1G, 2A–2E, 3A–3F | General & Lifestyle › Comms, Sensors, Break-in, Survival, Medical, Ammunition & Thrown, Lifestyle · Armor › Light, Medium, Heavy, Sealed & Hardened, Shields · Weapons › Light Firearms, Longarms, Heavy, Melee & Blades, Thrown & Grenades, Bows/Crossbows/Exotic |
| **Ghostwire Mods** | `mods` | 31 | 3G, 5F + B20 armor/gadget mods | Weapon Mods · Vehicle & Drone Mods · Armor & Shield Mods · Gadget Mods |
| **Ghostwire Matrix** | `matrix` | 37 | 4A–4F + B20 RCC autosofts | Cyberdecks · Programs · Payloads · RCCs · RCC Autosofts · Cyberjacks & Interfaces · Matrix-Support |
| **Ghostwire Vehicles & Drones** | `vehicles` | 31 | 5A–5E | Ground · Air · Water & Submersible · Space · Drones |
| **Ghostwire Foci** | `foci` | 41 | 6A–6F | Elementalist · Street-Priest · Technomancer · Shared · Material Components · Reagent Packages |

- **Grade = echelon + Availability.** Ghostwire uses Draw Steel levels 1–10 and echelons 1–4 only; the master’s old T5–T1 column maps to **Echelon 1 Street** (T5), **Echelon 1 Professional** (T4), **Echelon 2 Restricted** (T3), **Echelon 3 Military** (T2), **Echelon 4 Prototype** (T1). Items store it in `system.echelon` and the flag; descriptions say “Echelon N · Availability: Street/…”. A few row texts that named the old ladder were reworded (for example “Professional-grade (or lower) locks”, “a middle-result Wired roll”). Weapon mods (3G) have no grade in the master, so they show “Echelon —”.
- **Items:** Draw Steel `treasure`. Weapons `kind: weapon` (keywords: `light`/`medium`/`heavy` from the band — Anti-veh counts as heavy — plus `bow` for firearms, bows, and launchers, `ensnaring` for the Net-Gun, `whip` for the Monowhip); armor and shields `kind: armor` (keyword = armor class or `shield`); everything else `kind: other`, `category: trinket`.
- **Flags:** `flags.draw-steel-ghostwire.gear | mod | matrix | vehicle | focus` = `{ echelon, availability, price, modSlots, tags, consumable? }`, plus weapons `damage, damageType, range, weaponBand`; armor `armorClass` (`light|medium|heavy|shield|sealed`, sealed also `baseClass`), `staminaByEchelon`, `immunity`; mods `host, slotCost, craftSkill`; matrix `role`; vehicles `domain, scale, drone`; foci `tradition` (components also `drainTrade`). `priceText`/`priceNote` cover “per §F3”, “(holds value)”, and “80,000+”. The item sheet shows “Echelon · Availability · ¥ · Mod slots” under the name.
- **Weapons:** the description lists the master’s **Weapon Base** damage, type, band, and range. No damage effects — Kit doctrine still supplies Draw Steel damage bands.
- **Armor as Stamina:** each armor lists its Stamina by hero echelon (Echelon 1 uses the street numbers for Street items and the professional numbers for everything else; Echelons 2–4 use the old T3/T2/T1 columns) and carries four **disabled** “No Kit — Echelon N” effects. With a Kit, the Kit’s Stamina already is the armor’s Stamina — leave them off. Shields stack with any armor. Sealed & Hardened armor also carries a disabled **typed immunity** effect (Flashweave fire 2, Faraday Suit lightning 2, Sealed Armor cold 2, HE Combat Suit fire/cold/poison 2 — toxin maps to poison).
- **Mods and §Craft:** §Craft is the downtime Project procedure, never a skill. Every mod, program, and autosoft says what it fits, its slot cost, and its Project skill: weapon/armor/shield/vehicle physical mods **Repair**; gadget and smart hardware **Electronics**; programs and payloads **Hacking**; autosofts **Hacking or Rigging**; chrome-adjacent **Cybertech**. Installing/swapping/removing is downtime; toggling an installed mod or loaded program is a field action. Mods are inventory items; there is no attach UI yet. Flags: `mod` = `{ …, host, hosts, slotCost, craftSkill: [skill keys] }`.
- **Slot integrity:** every item with mod slots has `modFamily` in its flag and lists the fitting mods (as links) in its description — weapons, vehicles & drones, armor, shields, gadgets (comms, sensors, mechanical/electronic break-in tools, survival kits, Wired interfaces and support gear), cyberdecks (programs + payloads), and RCCs (autosofts). 33 items with no mod family have 0 slots and say so: Field Surgery Kit, Designer Threads, Faraday Bag, and the 30 foci. Rules: `docs/rulebook/14-mods.md`.
- **Consumables:** anything tagged Consumable (plus matrix payloads, ritual components, and reagent packages) has `modSlots: 0`. This overrides two master rows that listed slots on a Consumable (Respirator Mask 1, Cutting Torch 3); the Burner is tagged “Consumable-ish” and keeps its 1 slot.
- **Implants:** the Cyber-Spur is a price listing that links the chrome **Implant Weapon (Spur)**, which spends Body Integrity.
- **Not automated:** buying (¥ not deducted), Availability gating, mod slot tracking, vehicle/drone stat blocks (deferred in the master), focus bonding.

**Test plan**

1. Foundry closed → `node tools/build-packs.mjs` (no errors).
2. Start Foundry, enable the module: the Compendium sidebar lists **Ghostwire Gear**, **Ghostwire Mods**, **Ghostwire Matrix**, **Ghostwire Vehicles & Drones**, **Ghostwire Foci**.
3. Spot-check: **Smartlink** (Mods › Weapon Mods) ¥500, slot cost 1, Wired/Smart; **Sleeve-Gun** (Gear › Weapons › Light Firearms) Echelon 1 · Street · ¥150; **Hardshell** (Gear › Armor › Heavy) four disabled No Kit effects; **Scrapdeck** (Matrix › Cyberdecks); **Fly** (Vehicles › Drones); **Spark-ring** (Foci › Elementalist).
4. Open a few folders — nested structure is readable.
5. Browser console has no errors.
6. Mods pack shows four folders: Weapon Mods, Vehicle & Drone Mods, Armor & Shield Mods, Gadget Mods. Matrix has an RCC Autosofts folder.
7. Open **Reader** (Matrix › Programs): its text says Hacking, not Craft. Open **Lockpick Set** (Gear › General › Break-in): its mod slot note links **Quiet Picks**. Open **Spark-ring**: it explains its 0 slots.

## Chrome & Body Integrity (v1)

Rules: `docs/rulebook/11-economy.md`, `docs/rulebook/12-chrome.md`, `docs/masters/GHOSTWIRE_CHROME_MASTER.md`.

- **Nuyen** is Draw Steel `system.hero.wealth`, relabeled in lang. It’s shown in the hero **Biography** tab; switch the sheet to **Edit** mode to type a value. Heroes created with Ghostwire enabled start at ¥5,000. Older heroes keep whatever they had (default 1), so set 5000 by hand for tests.
- **Body Integrity** is stored in `flags.draw-steel-ghostwire.integrity` (`value`/`max`, default 20/20) and edited in the **Body Integrity** box at the top of the **Stats** tab. Heroes with the Cyborg ancestry see “Not used” instead.
- **Chrome** implants are `treasure` items in **Ghostwire Chrome**. Each carries `flags.draw-steel-ghostwire.chrome` (`grade`, `location`, `integrity`, `price`, `availability`, optional `grants`) and an always-on transferred effect. Draw Steel treasure has no price field, so ¥ shows in the description header and in a line under the name on the item sheet.
- **Install** = drag onto a hero. `scripts/module.mjs` blocks Cyborgs, heroes without enough Integrity, and full locations; then it spends the Integrity and adds any granted abilities (Implant Weapon → Spur Strike). **Delete** returns 75% of the Integrity (round down) and removes granted abilities.
- **Slot caps:** Head 3 · Eyes 1 · Ears 1 · Torso 3 · Arms 4 (2 per arm) · Legs 4 (2 per leg) · Nervous System 1.
- **Not automated yet:** buying (¥ isn’t deducted), Availability gating, the no-double-dip rule between different implants, surgery Projects, and Suppressed/Damaged states.

| Implant | Location | Integrity | Price | Availability | Automated |
|---|---|---|---|---|---|
| Datajack | Head | 1 | ¥500 | Street | effect marker |
| Vocal Modulator | Head | 1 | ¥800 | Professional | edge on Lie |
| Implant Weapon (Spur) | Arms | 1 | ¥1,000 | Restricted | grants Spur Strike |
| Internal Air / Filtration | Torso | 2 | ¥1,500 | Professional | poison immunity 2 |
| Cyber-Ears | Ears | 2 | ¥1,800 | Professional | edge on Eavesdrop |
| Cyber-Eyes | Eyes | 2 | ¥2,000 | Professional | edge on Alertness, Search |
| Running Gear | Legs | 3 | ¥2,500 | Professional | +1 speed, edge on Jump |
| Reaction Enhancer | Nervous | 3 | ¥3,500 | Restricted | +1 Disengage |
| Dermal Plating | Torso | 4 | ¥4,000 | Restricted | damage immunity 2 (all) |
| Skillwires / Encephalon | Head | 4 | ¥5,000 | Restricted | edge on Mechanics (edit key to swap) |
| Muscle / Bone Lacing | Torso | 5 | ¥6,000 | Restricted | +1 stability, edge on Lift |
| Cyberlimb (Arm) | Arms | 5 | ¥7,500 | Restricted | +1 melee weapon damage |
| Wired Reflexes | Nervous | 6 | ¥12,000 | Military | +1 speed, +2 Disengage |

**Prices are provisional** (Standard grade only). Grade variants are a later pass; rough rule for now:
- **Salvage / Used** ≈ 0.5× ¥ and 1.5× Body Integrity.
- **Soft / Bioware** ≈ 3× ¥ and 0.4× Body Integrity (round up).

Chrome **packages** (Roadrunner, Argus, Bulwark, …) are not in the compendium yet.

**Test click-path**

1. Create a new hero → **Biography** tab: Nuyen 5000.
2. **Stats** tab: **Body Integrity** Current 20 / Max 20.
3. Compendium sidebar → **Ghostwire Chrome** → open **Wired Reflexes**: under the name the sheet reads “Standard · Nervous System · Body Integrity 6 · ¥12,000 · Military”, and the description starts with the same header.
4. Drag **Cyber-Eyes** onto the hero: notice says 2 spent; Integrity 18/20; item in **Equipment**; effect in **Effects**; Alertness and Search tests roll with an edge.
5. Drag **Implant Weapon (Spur)**: Integrity 17/20 and **Spur Strike** appears in **Abilities**. Delete the implant: Spur Strike is removed (Integrity back to 17, since 75% of 1 rounds down to 0).
6. Drag **Reaction Enhancer** (Disengage 2 in Movement), then try **Wired Reflexes**: blocked because Nervous System is full.
7. Drag **Dermal Plating** (Stats → Immunities: All 2) and **Cyberlimb (Arm)** (melee free strike +1 damage on each tier). Keep adding until an implant costs more than the Integrity left: it’s blocked with a warning.
8. Delete Cyberlimb (Arm): 3 Integrity returns.
9. Hero with the **Cyborg** ancestry: Stats shows Body Integrity “Not used”, and dragging any chrome is blocked.

## Building packs

Pack sources live in `src/packs/<pack>/` (subfolders allowed). Names and descriptions are `GHOSTWIRE.*` lang keys, filled in from `lang/en.json` at build time. With Foundry closed, run `node tools/build-packs.mjs` to rebuild `packs/`. It uses the `classic-level` package bundled with Foundry; set `FOUNDRY_APP` if Foundry isn't installed in the default location.

## Rulebook

- [Stage 1 — Core Rulebook skeleton](docs/rulebook/00-STAGE1-skeleton.md) (awaiting review)
