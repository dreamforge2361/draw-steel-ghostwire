# Ghostwire Bestiary (master)

**Status:** Wave 1 (B38) built 2026-09-17 — DS review proposal + 35-Actor reskin pack; firearms / chrome ability pass (B38c, module v0.1.51) applied — both pending Michael review / Foundry verification; originals Wave 2 (B38b) queued.  
**Doctrine:** **Reskin first.** Where a Draw Steel monster/NPC can serve The Reach, keep mechanics/stats as the spine and rewrite name + description (+ light number tweaks only if fiction requires). **Artwork / token pass later.** Greenfield originals when stock does not fit.

## Firearms / chrome ability doctrine (LOCKED 2026-09-17 — standing rule for every bestiary entry)
Street, corp, Ironclad, rivals, and Wire-adjacent **humanoids** use **pistols, SMGs, carbines, rifles, shotguns**, plus chrome/implants/decks as fiction. **Melee is rare** (monowire / knife / stun baton / cyberarm exceptions only). Keep DS ability math; rewrite names + descriptions. Beasts, undead naturals, and monster anatomy keep natural weapons; casters (Elementalist, Street Priest, Technomancer, Veil cult) keep their powers. **Every future bestiary Actor — reskin or original — ships through this check.** Pass: `docs/spikes/B38c-BESTIARY-FIREARMS-CHROME-PASS.md`.

**Conventions (from B38c):**
- A stock **melee-only weapon signature** re-fiction'd as a gun becomes **Melee 1 or Ranged 5** (`meleeRanged`, same melee reach, keywords `melee, ranged, strike, weapon`) — Draw Steel's own hybrid-weapon shape (Knave, Rogue, War Dog Commando); damage tiers, targets, and riders unchanged. Grab / charge / chrome-melee signatures stay melee.
- Stock `magic` keyword is dropped when the fiction becomes tech (grenades, kill codes, repulsors, stims); kept for Veil / priest / elementalist powers. `psionic` stays on Chrome Raiders and Signal Talkers.
- Damage types stay (corruption = Veil-hexed rounds / rot stims / blight grenades; fire = mortar / incendiary).
- Shared swaps: Human **Supernatural Insight → Veil-Filter Optics**; **Alchemical Device → Blight Grenade**; Staying Power / End Effect → trauma stims; War Dog **Loyalty Collar** = cortex charge, **Reconstitute → Field Salvage**, **Fire for Effect** = mortar strike; Rival **Check Out Our Loot** = milspec grenade (flashbang / toxin / incendiary).
- Stock creature nouns in rules text (blackguard, bandit chief, knave, null, fury, …) read as the Ghostwire name.

**Wilds doctrine (2026-09-17):** Hive/Reach streets + Wire + Veil are primary now. **Wilds lore is intentionally thin** — expand later as a Pandora-like primeval biome beyond Cinderhold’s Outer Wall, with a dark Incursion edge. Seed critters from *The Ossian Reach Handbook* (Canopy-Stalker, Reach Behemoth) stand in until that pass; do not invent deep wilds ecology yet.

## Goal
A Director-facing Foundry **Bestiary / NPC** Actor pack that contains **only** reviewed entries (reskinned Keepers, Adapts, and approved originals) — never an unfiltered stock fantasy dump.

## Workflow
1. Inventory stock DS Monsters + NPCs → Keep (reskin) / Adapt / Skip.
2. Reskin Keep: GW name, description, fiction; DS math stays; placeholder art.
3. Adapt: structural changes when fiction cannot ride the stock block.
4. Skip: leave out of the GW pack.
5. Wave 2: originals for Reach threats (Handbook + lore named opposition).
6. Later: wilds expansion (Pandora-like) + artwork/tokens.
7. Pack + this master stay in sync.

## Review table
Filled in `docs/masters/GHOSTWIRE_BESTIARY_DS_INVENTORY.md` (483 rows; Claude proposal Keep 187 / Adapt 224 / Skip 56 / Defer-hazard 16 — Michael corrects on verify).
### Review rules (B38 proposal)

**Keep** — Humans (street / corp / Veil cult reskins), Rivals (Draw Steel class → Ghostwire class: Conduit → Street Priest, Fury → Operator, Null → Hacker, Shadow → Scout, Tactician → Commander, Talent → Technomancer, Elementalist → Elementalist), War Dogs → **Ironclad** Legion, Time Raiders → **Chrome Raiders**, Voiceless Talkers → **Signal Talkers**, Undead, Devils → **Infernal** bureaucrats, Elementals, Valok robots, Animals → jungle / feral templates, non-peoples Retainers, tech-ish Mechanisms and Fieldworks.

**Adapt** (hard renames onto Ghostwire Peoples and setting groups) — Dwarves → Corran, High Elves → Elvani, Shadow Elves → Umbral Elvani, Wode Elves → Wildwood Elvani, Orcs → Goliar, Hobgoblins → Cinder Legion, Goblins → Warrens Scavs, Kobolds → Scale Legion, Bugbears → Hulks, Gnolls → Maw, Lizardfolk → Saurians, Angulotl → Mire-Frogs, Radenwights → Rat-Changers, Minotaurs / Ogres / Trolls → Bull / Brute / Regen Mutants; Demons as Veil horrors; jungle beasts (Basilisk → Stone-Eye Lizard, Kingfissure Worm → Sinks Burrower, Lightbender → Refraction Cat, Wyverns → Canopy Wyverns); Werewolf → Feral Changer; siege engines → street emplacements.

**Skip** — Dragons, Draconians, Giants, Chimera, Griffon, Manticore, Medusa, Hag, named fantasy villains (Ajax, Count Rhodar, Lord Syuul, Xorannox and its eyes, Ashen Hoarder, Bredbeddle, Olothec, Lich, Arixx, Fossil Cryptic), class Summons, Cyclops, Ceramic Horse, Trained Gummy Brick. **Defer-hazard** — environmental hazards, siege relics (Catapult, Boiling Oil Cauldron, Exploding Mill Wheel), power fixtures, and supernatural objects.

**Keep / Adapt by region:**

| Region | Keep | Adapt |
|---|---|---|
| Reach Streets | 26 | 90 |
| Corp & Security | 47 | 10 |
| Wire & Machine | 23 | 1 |
| Veil & Undead | 55 | 64 |
| Wilds & Jungles | 8 | 59 |
| Rivals | 28 | 0 |

### Wave 1 — Ghostwire Bestiary pack (B38, module v0.1.50, pending Foundry verification)

Foundry Actor pack **`bestiary`** (“Ghostwire Bestiary”, Director-only by default), folders Reach Streets · Corp & Security · Wire & Machine · Veil & Undead · Wilds & Jungles · Rivals. **35 Actors** cloned from `systems/draw-steel/packs/monsters`: Draw Steel system stats, embedded abilities, and effects unchanged; Actor name, token name, and biography are Ghostwire lang keys (`GHOSTWIRE.Bestiary.Actors.*`); faction names inside ability prose (war dog, time raider, voiceless talker) read Ironclad / Chrome Raider / Signal Talker. Flags: `flags.draw-steel-ghostwire.bestiary = { dsSourceId, dsSourceName, decision, region }`. Placeholder Draw Steel art. Gang color-flavor labels (§A below) can ride these spines.

**B38c firearms / chrome pass (module v0.1.51, pending Foundry verification):** the 25 humanoid / Chrome Raider Actors have Ghostwire ability names, rules text, icons, and biographies (undead, wilds, and Signal Talker anatomy untouched). Hustler's duplicate stock *Exploit Opening* removed.

| Actor | Stock → Ghostwire abilities |
|---|---|
| Corp Enforcer | Zweihander Swing → **Autoshotgun Sweep**; Parry! → **Ballistic Shield!**; Back! (sonic repulsor); I Can Throw My Blade… → **Dump Your Mags!**; You! = laser designator |
| Corp Security Officer | Halberd → **Stunstick & Sidearm** (Melee 2 or Ranged 5) |
| Ironclad Conscript / Commando / Sharpshooter | Blade → **Bayonet Carbine**; Daggers → **Suppressed Machine Pistols**; Bolt Launcher → **Smartgun** |
| Ironclad Subcommander | Command Saber → **Command Sidearm** (Melee 1 or Ranged 5); Posthumous Promotion → **Kill Code** |
| Ironclad Ground Commander | Conditioning Spear → **Neural Tether Gun**; Final Orders / Highest Posthumous Promotion = collar override + kill code |
| Gang Boss | Whip and Magic Longsword → **Hand Cannon & SMG** (Melee 2 or Ranged 10, Veil-hexed rounds); Kneel, Peasant! → **On Your Knees!**; Bloodstones → **Rot Stim** |
| Gang Raider | Handaxes → **Sawed-Off Charge** (stays Melee 1 charge) |
| Hustler | Rapier and Dagger → **Twin Holdouts** (Melee 1 or Ranged 5); Dagger Storm → **Bullet Storm** |
| Rooftop Shooter / Trick Shooter | Crossbow → **Scoped Rifle**; Trick Crossbow → **Ricochet Smartgun** |
| Street Brawler | Haymaker → **Cyberarm Haymaker**; Throw → **Hydraulic Throw** (chrome melee exception) |
| Street Cutter | Concealed Dagger → **Holdout Pistol & Mono-Knife** (knife exception) |
| Street Punk | Morningstar and Javelin → **Riot Shield & Sawed-Off** |
| Veil Cultist | Death Scythe → **Hexed Revolver** (keeps `magic`) |
| Rival Commander | Tactician text → commander; carbine / pistol / rifle icons |
| Rival Hacker | Inertial Shield → **Threat-Prediction Script** (deck); Nimble Step → **Smartlinked Machine Pistol** (Melee 1 or Ranged 5); Numb → **Feedback Spike** (Melee 1 or Ranged 5, `psionic` dropped) |
| Rival Operator | Brutal Impact → **Breacher Shotgun** (Melee 1 or Ranged 5); Let's Tussle → **Cyberarm Clinch** |
| Rival Scout | Swift Serration → **Suppressed SMG** (Melee 1 or Ranged 5, active-camo blink); Poison the Blade → **Load Toxin Rounds** |
| Rival Elementalist / Street Priest / Technomancer | Powers kept; stock class nouns fixed; spell icons |
| Chrome Raider Armiger | Serrated Saber → **Flechette Carbine** (Melee 1 or Ranged 5); Foresight → **Predictive Targeting**; Kuran'zoi Heraldry → **Raider Beacon**; Gravity Well → **Grav Mine**; Psi-Cage → **Neural Jammer Cage** |
| Chrome Raider Hijack | Golden Sickles → **Monowire Lashes** (chrome melee exception); Psi-Sickle → **Grapple Harpoon** |

| DS source | Decision | Ghostwire name | Region | DS level / org / role |
|---|---|---|---|---|
| Human Guard | Keep | Corp Security Officer | Corp & Security | L1 minion brute |
| Human Blackguard | Keep | Corp Enforcer | Corp & Security | L1 leader  |
| Human Brawler | Keep | Street Brawler | Reach Streets | L1 platoon brute |
| Human Bandit Chief | Keep | Gang Boss | Reach Streets | L3 leader  |
| Human Raider | Keep | Gang Raider | Reach Streets | L1 minion harrier |
| Human Rogue | Keep | Street Cutter | Reach Streets | L1 minion ambusher |
| Human Scoundrel | Keep | Hustler | Reach Streets | L1 platoon ambusher |
| Human Knave | Keep | Street Punk | Reach Streets | L2 platoon defender |
| Human Archer | Keep | Rooftop Shooter | Reach Streets | L1 minion artillery |
| Human Trickshot | Keep | Trick Shooter | Reach Streets | L1 platoon artillery |
| Human Death Cultist | Keep | Veil Cultist | Veil & Undead | L2 platoon support |
| Rival Conduit | Keep | Rival Street Priest (Echelon 1) | Rivals | L2 elite support |
| Rival Elementalist | Keep | Rival Elementalist (Echelon 1) | Rivals | L2 elite controller |
| Rival Fury | Keep | Rival Operator (Echelon 1) | Rivals | L2 elite brute |
| Rival Null | Keep | Rival Hacker (Echelon 1) | Rivals | L2 elite harrier |
| Rival Shadow | Keep | Rival Scout (Echelon 1) | Rivals | L2 elite ambusher |
| Rival Tactician | Keep | Rival Commander (Echelon 1) | Rivals | L2 elite artillery |
| Rival Talent | Keep | Rival Technomancer (Echelon 1) | Rivals | L2 elite hexer |
| War Dog Conscript | Keep | Ironclad Conscript | Corp & Security | L1 minion harrier |
| War Dog Commando | Keep | Ironclad Commando | Corp & Security | L1 minion ambusher |
| War Dog Sharpshooter | Keep | Ironclad Sharpshooter | Corp & Security | L1 minion artillery |
| War Dog Subcommander | Keep | Ironclad Subcommander | Corp & Security | L2 horde support |
| War Dog Ground Commander | Keep | Ironclad Ground Commander | Corp & Security | L3 leader  |
| Zombie | Keep | Zombie | Veil & Undead | L1 horde brute |
| Skeleton | Keep | Skeleton | Veil & Undead | L1 horde artillery |
| Ghoul | Keep | Ghoul | Veil & Undead | L1 horde harrier |
| Ghost | Keep | Ghost | Veil & Undead | L1 leader  |
| Time Raider Armiger | Keep | Chrome Raider Armiger | Wire & Machine | L3 platoon defender |
| Time Raider Hijack | Keep | Chrome Raider Hijack | Wire & Machine | L3 platoon ambusher |
| Mindkiller Whelp | Keep | Signal Mindkiller Whelp | Wire & Machine | L6 minion hexer |
| Voiceless Talker Invader | Keep | Signal Talker Invader | Wire & Machine | L6 elite controller |
| Animal | Keep | Feral Beast | Wilds & Jungles | L1 elite harrier |
| Animal Swarm | Keep | Vermin Swarm | Wilds & Jungles | L1 elite hexer |
| Big Animal A | Keep | Jungle Beast | Wilds & Jungles | L1 elite mount |
| Predator A | Keep | Jungle Predator | Wilds & Jungles | L1 elite brute |


## Originals / Must-create (Wave 2+)

Sources: `GHOSTWIRE-Lore-Source-V2-edit.md`, Core Sourcebook, **Ossian Reach Handbook** end matter (Threat blocks + Critters of the Reach).  
**Tier note:** Handbook uses inverted Tier (5 = nuisance, 1 = nightmare). Map to **DS level 1–10 + echelon** on import; do not ship GW "tier" player text.

### A. Covered by B38 reskin (do not greenfield first)
Street muscle, corp security, War Dogs → Ironclad, Human/Rival/Undead/Devil Keep-Adapt rows already in the inventory. Gang color-flavor (Metermen / Skinjobs / Nightshift / Ninth Ward Kings / Rust Saints / Glass Vipers / Hollow Men) = **reskin labels + hooks** on Gang Boss / Street Punk / Goliar / Hulk spines, not separate math until Wave 2 polish.

### B. Reach Handbook — statted threats (must port / greenfield)
Handbook names below are **SoR for Wave 2 Actors** (provisional STA/ATK from Handbook; remapped to DS echelon).

| Working name | Handbook band | Role | Region | DS spine hint | Notes |
|---|---|---|---|---|---|
| Stall-Keeper | T5 Standard civilian | Shopkeeper | Flats | Human / noncombat | Social; Alert if attacked |
| Flats Worker | T5 Minion crowd | Civilian terrain | Flats | Human Raider minion | Crowd = cover + Malice spike |
| Wired Chore-Sprite | T5 Rabble | Wired scut sprite | Wire | Sprite / construct | Trace Feeder; already have summon sprites — **hostile/scut variant** |
| Colors Boss | T4 Leader | Gang leader | Flats gangs | Human Bandit Chief | Focus Fire / Show of Force |
| Chrome Bruiser | T4 Elite | Cyborg gang heavy | Flats gangs | Ogre / Cyborg Adapt | Warframe Plating |
| Response Lieutenant | T4 Leader | Corp field lead | Corp | Human Blackguard | Escalates drones + Alert |
| Corp Netrunner | T4 Elite | ICE overwatch | Corp / Wire | Rival Hacker lean | Trace Master + Black ICE |
| Street Doc | T4 Standard | Medic specialist | Flats | Human / Rival Medic | Field Medicine |
| Wrench Rigger | T4 Elite | Drone handler | Flats / Corp | Rival / Wrench lean | Sic 'Em drones |
| Nyx Fixer | T4 Solo social | Corran fixer | Flats | Face / social Solo | Negotiation as combat |
| The Warlord | T3 Solo | District boss | Flats | Mutant Solo / Commander | Named stand-in for Kings-scale boss |
| Razorline Prime | T3 Elite | Augmented duelist | Flats | Operator lean Cyborg | Pair with Warlord |
| Corp Enforcer | T3 Leader | Contract closer | Corp | Cyborg Operator | Corporate Escalation |
| Ironclad Warden | T3 Elite | Black-site chief | Corp / Ironclad | War Dog / brute Leader | Bulwark Plating |
| The Ripper | T3 Elite | Black-clinic surgeon | Flats / Sinks | Medic dark Mutant | Keeps enemy side standing |
| Null-Prophet | T3 Solo | Rogue Technomancer | Wire | Technomancer Solo | Node master; sprites + ICE |

### C. Critters of the Reach (Handbook — must create)
| Working name | Band | Type | Region | DS spine hint | Notes |
|---|---|---|---|---|---|
| Chrome-Rat | T5 Minion/Swarm | Beast vermin | Flats / Warrens | Animal Swarm | Chew the Line |
| Tunnel-Bat | T5 Swarm | Beast flyer | Warrens shafts | Animal Swarm / Giant Hawk lite | Whiteout Roost alarm |
| Scrap-Hound | T5 Standard | Beast brute | Warrens / Sprawl Cur | Predator A / Animal | Pack Hunter |
| Sink-Crawler | T3 Elite | Mutant beast | Sinks | Big Animal / burrower | Drag Under |
| Gutter-Serpent | T4 Standard | Drainage predator | Spillway / Slackwater | Predator B | Ambush from Murk |
| **Canopy-Stalker** | T3 Elite | Jungle apex pack | Wilds beyond gate | Predator A/B + climb | Feathered hooked-claw; **raptor stand-in** until wilds pass |
| **Reach Behemoth** | T2 Solo | Dinosaur-scale megafauna | Deep jungle / Outer Wall | Big Animal B / Solo apex | Vehicle-scale; **T-Rex-class slot**; survive not win |
| Data-Sprite | T5 Swarm | Wire spirit | Overlay | Spirit swarm | Weather-read for Technomancer |
| Wisp | T4 Standard | Data-ghost | Wire | Undead/spirit Adapt | Latch On |
| Watchdog ICE | T4 Standard | Construct ICE | Corp nodes | Construct | Raise the Alert |
| Scrambler ICE | T3 Elite | Disrupt ICE | Corp nodes | Construct | Glitch the Kit |
| Black ICE | T2 Elite | Lethal ICE | High-value nodes | Construct lethal | Biofeedback Kill |
| Ghost-in-the-Wire | T2 Solo | Emergent Veil AI | Deep Wire | Spirit/construct Solo | Bargain > fight |

### D. Lore named NPCs (level-bosses — greenfield or Solo Adapt)
| Working name | Role | Region | Notes |
|---|---|---|---|
| Mama Cassavir, "the Switchboard" | Fixer patron | Flats | Social Solo; job-giver — not a street fight first |
| Warden Krael, "the Landlord" | Corrupt Grid warden | Grid | Corp badge + Metermen leash |
| The Ferryman | Tollkeeper of descent | Flats/Sinks boundary | Chokepoint boss |
| The Choirmother | Cult-mother (tragic Light→hollow) | Flats | Director dial Early/Mid/Fallen |
| Ranger-Captain Cael Marrow, "the Gate" | Cinderhold protector | Cinderhold / wastes gate | Ally or hard wall; Greenline deserter |

### E. Lore opposition flavors (reskin hooks, not separate blocks yet)
Metermen, Skinjobs, Nightshift, Ninth Ward Kings, Rust Saints, Glass Vipers, Hollow Men; Aureole Security; Greenline Rangers; Ironclad Martial; Deadfall Nine Quiet Floor cults; lesser/greater Incursion demons (Adapt DS Demons).

### F. Wilds expansion (LATER — Pandora-like)
Deferred design with Michael. Target: Avatar/Pandora primeval canopy + biolume + megafauna, **dark Incursion edge**. Until then ship only Handbook seeds (Canopy-Stalker, Reach Behemoth) + DS Wilds Keep/Adapt renames.

## Art / token pass (later)
Track placeholders → final art when that wave starts.