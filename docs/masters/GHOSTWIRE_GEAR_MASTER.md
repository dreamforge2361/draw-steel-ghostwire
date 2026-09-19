# GHOSTWIRE — Master Gear List


---

## DS ALIGNMENT OVERRIDE (2026-09-16) — BINDING

**This block overrides conflicting legacy wording in the tables and prose below for Foundry, PDF, and player-facing rulebook text.** Do not invent a Ghostwire item-tier ladder.

1. **Item Tier column = LEGACY gear-grade label only.** Read every **T5–T1** / Item Tier cell as **Echelon + Availability**:
   - **T5** → Echelon **1**, Availability **Street**
   - **T4** → Echelon **1**, Availability **Professional**
   - **T3** → Echelon **2**, Availability **Restricted**
   - **T2** → Echelon **3**, Availability **Military**
   - **T1** → Echelon **4**, Availability **Prototype**
   Higher-grade gear costs more and has more mod slots. Do **not** print “Item Tier / T5–T1” in player-facing chapters.

2. **§Craft is a procedure, not a skill.** Install / swap / remove / invent / configure = Draw Steel **Project** (downtime), with field-toggle for already-installed features. Power Rolls use:
   - **Hacking** — programs / deck software / software installs
   - **Electronics** — deck hardware, sensors, gadgets, Wired devices
   - **Repair** — weapons, armor, vehicles/drones physical mods (**replaces** legacy “Gunsmithing”)
   - **Cybertech** — chrome-adjacent only (**replaces** loose “Cyber/electronics” for chrome-side work; hardware/gadget rows use **Electronics**)

3. **Program installs (Category 4B+):** §Craft Project skill = **Hacking**.

4. **Armor-as-Stamina** scales with the wearer’s hero **Echelon** (old T5 column = **Echelon 1 Street — the default** for 1st–3rd level; old T4 column = **Echelon 1 Professional**, the upgraded E1 option when Availability allows; T3→E2, T2→E3, T1→E4). Kit Stamina per echelon follows Draw Steel. Do not scale armor Stamina by a Ghostwire item-tier ladder.

5. **Power Roll bands ≠ Item Tier.** Weapon Power Roll results print in DS order — **low / middle / high**; a weapon line with a single number gives its **middle** result. Any leftover legacy “Tier-N” roll prose in this file means a Power Roll band (Tier 1 = high, Tier 2 = middle, Tier 3 = low); legacy “Hero Tier” means hero **Echelon**.

6. **Slot integrity:** if an item has **modSlots > 0**, a published mod family must exist for that host family; otherwise set slots to **0**. Consumables never have mod slots. Full mod doctrine + Invent a Mod: `docs/rulebook/14-mods.md`.

Table rows are **not** rewritten in this pass (catalog too large). Treat this OVERRIDE as the binding remap for all Foundry imports and PDF/Journal rendering.


*The complete equipment catalog: General & Lifestyle, Armor, Weapons, Matrix Gear, Vehicles & Drones, and Magical Foci & Ritual Components. Compiled from `master_rules_baseline.md`, THE GEAR CATALOG (Categories 1–6, completed 2026-07-15) and Appendix §F (Economy/Gear Numbers).*

*All modification, configuration, installation, or crafting of any item below follows the canonical **§Craft procedure** (Economy + Mods chapters): Draw Steel **Project** downtime work only — **§Craft is not a skill** — with a field-toggle exception for already-owned/installed features (flipping a smartlink active, folding a stock, drawing a bonded focus). Project skills by host: **Repair** (weapons/armor/vehicles), **Electronics** (deck hardware/sensors/gadgets/Wired), **Hacking** (programs/software), **Cybertech** (chrome-adjacent). Every price, Availability, and mod-slot count is drawn from Appendix §F — nothing is invented off-frame. Legacy Item Tier labels: see **DS ALIGNMENT OVERRIDE** above.*

---

## How to Read Every Entry

Every item shares one template:

> **Name** *(slang / corporate / scientific — tri-register)* · **Tier** · **Availability** · **Cost (¥)** · **Profile** *(the stat that matters — effect, bonus, or damage)* · **Mod slots** · **Tags**

- **Tier** uses the reversed ladder: **T5 = street-grade / entry**, **T1 = milspec / prototype / apex** — the same ladder as characters, rituals, and nodes.
- **Availability, Cost, and Mod slots** are inherited from Item Tier alone (§F5/§F6) — never from the item's raw power:

| Item Tier | Availability | Price Band | Mod Slots |
|---|---|---|---|
| T5 | Avail 5 (common) | ¥50–¥300 | 1 |
| T4 | Avail 4 | ¥300–¥1,200 | 2 |
| T3 | Avail 3 | ¥1,200–¥5,000 | 3 |
| T2 | Avail 2 (restricted) | ¥5,000–¥20,000 | 4 |
| T1 | Avail 1 (milspec/proto) | ¥20,000–¥80,000+ | 5 |

- **Tags** are keywords other rules hook into (*Sealed*, *Wired*, *Concealable*, *Two-handed*, *Focus*, *Consumable*, etc.) — never new rules, just pointers to systems already written.
- **Consumables** (ammo, medkits, stims, grenades, reagents) are bought in the listed unit and expended in play; they carry no mod slots.
- **The firewall holds everywhere in this catalog:** nuyen and Item Tier buy convenience, price, Availability, and mod capacity — never raw combat power, Stamina, or class ability. The one sanctioned exception is the single **signature-focus bond** in Category 6.

### The Damage-Bridge (governs Weapons, Category 3)

Weapons carry an explicit **flat damage value** anchored to the Power Roll damage bands (Appendix §A2), not a replacement for them:

1. A weapon's listed damage **is its Weapon Base** — its **middle** Power Roll result. Weapon Power Roll results print in Draw Steel order — **low / middle / high**; a line that prints all three results uses those. **Light ≈ 4, Medium ≈ 6, Heavy ≈ 9, Anti-vehicle ≈ 14**, each varying ±1–2 within its band to feel distinct.
2. The **Power Roll result still scales it** exactly as §A2 already says (high-result rider, low-result glancing, the attacker's Power Roll bonus).
3. Each weapon names its band in Tags (`[Light]` / `[Medium]` / `[Heavy]` / `[Anti-veh]`).
4. Damage also carries a **type tag** that maps to Draw Steel damage: **electrical → lightning**, **toxin → poison**, **fire → fire**, **kinetic → untyped**, **AP → untyped** plus the AP gear note (ignores or reduces armor-as-Stamina per that gear’s rules; AP is not a damage type). Tags hook typed-Immunity armor and Hostile-Env. Untagged = kinetic (untyped) by default. Item rows below keep the tag words; read them through this mapping.

### The Armor-as-Stamina Rule (governs Armor, Category 2)

There is no armor class or to-hit-vs-defense roll. Worn armor **raises maximum Stamina** instead of reducing damage — the bonus scales with the wearer’s hero **Echelon** (legacy T5–T1 columns in the table below map per DS ALIGNMENT OVERRIDE) so it never becomes trivial at high echelons.

| Armor Class | Echelon 1 (Street — default) · legacy T5 | Echelon 1 (Professional) · legacy T4 | Echelon 2 · T3 | Echelon 3 · T2 | Echelon 4 · T1 | Encumbrance |
|---|---|---|---|---|---|---|
| **Light** | +3 | +4 | +6 | +8 | +10 | None — full mobility |
| **Medium** | +6 | +8 | +11 | +14 | +18 | Bane on Stealth |
| **Heavy** | +9 | +12 | +16 | +21 | +27 | −1 Speed *and* bane on Stealth + Reflex-agility tests |
| **Shield / riot board** (stacks with any armor) | +3 | +4 | +5 | +6 | +8 | Occupies one hand; bane on two-handed weapon use |

**Echelon 1 default is the Street column.** A 1st–3rd level hero uses Street unless they have bought Professional-Availability armor, which is the upgraded Echelon 1 option when Availability allows.

The **only** true damage reduction in the game is **typed Immunity** (fire/poison/lightning/cold), carried solely by sealed/hardened specialty gear (§2D). Item Tier never changes protection — only price, Availability, and mods (§Armor-2). Mod slots shift by class: **Heavy +1, Light −1, Medium unchanged** (§Armor-5).

---

## Category 1 — General & Lifestyle Gear

*The runner's everyday kit — what you carry, wear (non-armor), and use to get in, stay alive, talk, see, and haul loot.*

### 1A — Comms & Credentials

| Name (slang / corp / sci) | Tier | Avail | Cost ¥ | Profile | Slots | Tags |
|---|---|---|---|---|---|---|
| Burner / DataStick Comm / disposable transceiver | T5 | 5 | 60 | Basic encrypted call/text; no trace-hardening. Ditch after a run. | 1 | Wired, Consumable-ish |
| Pocket Sec / CommLink Mk II / personal network node | T4 | 4 | 500 | Standard runner's phone-computer-node; runs your Matrix avatar; holds up to 2 program mods. | 2 | Wired |
| Spoof Kit / Identity Overlay / credential-forge suite | T3 | 3 | 2,500 | Edge on one Deception/impersonation or fake-credential check per scene; forged SIN passes casual scans. | 3 | Wired, Concealable |
| Ghost Relay / Encrypted Mesh / anti-trace comm array | T2 | 2 | 9,000 | Crew-wide encrypted comms; bane on enemy attempts to trace or tap the crew's channel. | 4 | Wired |
| Corp Blacklink / Executive Uplink / prototype quantum-comm | T1 | 1 | 35,000 | Untappable milspec comms + a genuine (rented) high-Availability SIN opening Lifestyle-2 doors while active. | 5 | Wired |

### 1B — Sensors & Optics

| Name (slang / corp / sci) | Tier | Avail | Cost ¥ | Profile | Slots | Tags |
|---|---|---|---|---|---|---|
| Cheap Shades / Vision Enhancers / passive optical suite | T5 | 5 | 120 | Flare compensation + zoom; edge on one Perception (sight) check in bad light per scene. | 1 | Concealable |
| Low-Light Goggles / NightVision Rig / photon-amplifier optics | T4 | 4 | 700 | Removes the bane for acting in darkness/low light. | 2 | — |
| Thermal Scanner / IR Imager / thermographic sensor | T3 | 3 | 3,000 | See heat through smoke/dark; edge on Perception to spot hidden/cloaked/living targets; ignores smoke concealment. | 3 | — |
| Sensor Sweep Drone-Eye / Recon Sensor Pod / multi-spectral array | T2 | 2 | 12,000 | Deployable sensor: scans a room/area and auto-marks unaware targets. | 4 | Wired |
| Full Sensorium / Battlefield Awareness Suite / integrated multispectral C&C optics | T1 | 1 | 40,000 | All lower optics in one; edge on ALL Perception checks + shares marks crew-wide over the Ghost Relay. | 5 | Wired |

### 1C — Break-in & Infiltration Tools

| Name (slang / corp / sci) | Tier | Avail | Cost ¥ | Profile | Slots | Tags |
|---|---|---|---|---|---|---|
| Lockpick Set / Entry Toolkit / mechanical bypass kit | T5 | 5 | 90 | Enables (no bane) attempts on mechanical locks; edge on the first such check per scene. | 1 | Concealable |
| Maglock Passkey / Electronic Bypass / cryptographic lock-spoofer | T4 | 4 | 900 | Opens electronic maglocks; edge on Security-Systems checks vs. T4-or-lower locks. | 2 | Wired, Concealable |
| Grapple & Line / Ascension Rig / motorized climb system | T3 | 3 | 2,000 | Vertical traversal without a climb check up to Long distance; edge on Athletics to climb/rappel. | 3 | — |
| Cutting Torch / Breaching Kit / thermal-lance charge | T3 | 3 | 3,500 | Cuts a person-sized hole through a wall/door (~2-round field action); consumable charge. | 3 | Consumable |
| Silent Suite / Infiltrator's Kit / integrated sound-dampening breach tools | T2 | 2 | 11,000 | All-in-one B&E kit; edge on Stealth AND Security-Systems while infiltrating; masks entry noise. | 4 | Concealable, Wired |

### 1D — Survival & Field Kit

| Name (slang / corp / sci) | Tier | Avail | Cost ¥ | Profile | Slots | Tags |
|---|---|---|---|---|---|---|
| Respirator Mask / Filter Mask / particulate-toxin filter | T5 | 5 | 80 | Filtered tag: one automatic success vs. airborne-toxin/smoke suffocation ticks. Consumable filter. | 1 | Filtered, Consumable |
| Survival Roll / Field Kit / portable habitat pack | T4 | 4 | 400 | Shelter/water/rations; edge on survival montage tests in the wilds/wastes. | 2 | — |
| Rebreather / Aqua-Lung / closed-circuit O₂ recycler | T4 | 4 | 800 | Sealed (breath) vs. drowning/vacuum for a scene; adds to the Life Support stack. | 2 | Sealed |
| Rad Kit / Shielding Wrap / isotope-shielding tarp + dosimeter | T3 | 3 | 2,200 | Rad-Shielded tag: slows the radiation Exposure clock; dosimeter warns before thresholds. | 3 | Rad-Shielded |
| Environment Suit / Hostile-Env Suit / full hazard-sealed exosuit | T2 | 2 | 14,000 | Sealed / Vacuum / Thermal / Rad-Shielded / Filtered all at once — a portable Life Support rating. | 4 | Sealed, Rad-Shielded, Filtered, Thermal |

### 1E — Medical Consumables

*The field-medicine shelf — buys anyone basic care; the Medic class does it far better and cheaper. All heal values are keyed to the character's Recovery value (¼ max Stamina) so field medicine never out-heals a Medic.*

| Name (slang / corp / sci) | Tier | Avail | Cost ¥ | Profile | Slots | Tags |
|---|---|---|---|---|---|---|
| Trauma Patch / MediPatch / auto-injecting wound sealant | T5 | 5 | 100 | Heals 1 Recovery value OR stops Bleeding. One use. | — | Consumable |
| Stim Patch / Combat Stimulant / adrenal-boost injector | T4 | 4 | 350 | Clear Dazed/Slowed/Weakened OR gain a maneuver this turn; crash = Weakened next round. | — | Consumable |
| Field Surgery Kit / Trauma Kit / portable surgical suite | T3 | 3 | 2,000 | Reusable: stabilize a dying (0-Stamina) ally; edge on First-Aid/Restorative checks. | 3 | — |
| Antidote Dose / Broad Antitox / synthetic antivenin | T3 | 3 | 1,500 | Cancels one poison/toxin effect or grants a save-end vs. an ongoing one. | — | Consumable |
| Slap-Doc Kit / Nanite Med-Foam / autonomous nanosurgical canister | T2 | 2 | 8,000 | Heals 2 Recovery values + clears one physical condition; the crew's emergency button. | — | Consumable |

### 1F — Ammunition & Thrown

| Name (slang / corp / sci) | Tier | Avail | Cost ¥ | Profile | Slots | Tags |
|---|---|---|---|---|---|---|
| Standard Rounds / Ball Ammo / FMJ magazine | T5 | 5 | 50 | Baseline; no modifier. Sold per magazine/reload. | — | Consumable |
| AP Rounds / Armor-Piercing / penetrator magazine | T4 | 4 | 400 | Edge vs. armored/Dermal-Plated targets (ignores 1 tier of armor mitigation). | — | Consumable |
| Gel/Stick-n-Shock / Less-Lethal / capacitive stun rounds | T4 | 4 | 350 | Deals band's glancing damage but applies Dazed on standard-or-better hit; non-lethal takedown ammo. | — | Consumable |
| Frag Grenade / Fragmentation / prefragmented dispersal charge | T3 | 3 | 1,300 | Thrown to Short; [Heavy]-band burst in a small area. | — | Consumable, Heavy |
| Flash-Bang / Distraction Device / photoacoustic stun charge | T3 | 3 | 1,200 | Thrown to Short; no damage, applies Dazed + Frightened to all in area (save-ends). | — | Consumable |
| Smoke / Screening Canister / aerosol obscurant | T5 | 5 | 200 | Thrown to Short; creates concealment (bane on ranged through it) — negated by thermal optics. | — | Consumable |

### 1G — Lifestyle Goods & Services

| Name (slang / corp / sci) | Tier | Avail | Cost ¥ | Profile | Slots | Tags |
|---|---|---|---|---|---|---|
| Fake SIN (basic) / Provisional ID / low-grade synthetic identity | T4 | 4 | 1,000 | Passes casual checks; edge on avoiding routine ID scrutiny. Burns if scanned by T2+ security. | — | Concealable |
| Certified Credstick / Corporate Account Chip / authenticated value token | T3 | 3 | (holds value) | Carries nuyen securely; launders payment and eases high-value purchases. | — | Wired |
| Designer Threads / Corporate Wardrobe / status-signal apparel | T3 | 3 | 2,500 | Edge on social checks where appearance/status matters (pairs with the Face's Influence). | 3 | — |
| Doss Upgrade / Lifestyle Voucher / prepaid habitation contract | — | varies | per §F3 | Pays/steps up Lifestyle upkeep for a respite (Squatter ¥100 → Elite ¥9,000). Service, not an item. | — | Service |
| Fixer Retainer / Contact Introduction / brokered network access | T2 | 2 | 6,000 | Buys a one-time introduction to a new Contact, or an Availability re-roll on a restricted acquisition. | — | Service |

---

## Category 2 — Armor

*(See "The Armor-as-Stamina Rule" above for the governing mechanics.)*

### 2A — Light Armor

*Concealable, mobility-free — the caster/Scout/Face default.*

| Item (slang / corp / sci) | Tier | Avail | Price ¥ | Effect | Mod Slots | Tags |
|---|---|---|---|---|---|---|
| Secure Threads / Executive Line / ballistic-weave streetwear | T5 | 5 | 250 | Reads as ordinary clothing; edge to conceal that you're armored. | 1 | Concealable |
| Armored Jacket / Defiance Line / aramid-panel outerwear | T4 | 4 | 900 | The classic armored jacket — rugged, unremarkable. | 1 | Concealable |
| Synth-Leather Duster / Nightcoat / lined tactical longcoat | T3 | 3 | 3,500 | Room to hide a longarm or holdout; edge to conceal a Concealable weapon on your person. | 2 | Concealable |
| Second-Skin / Chameleon Weave / adaptive-camo bodysuit | T2 | 2 | 15,000 | Edge on Stealth in matching environments (thermoptic-lite). | 3 | Concealable, Stealth |
| Whisperweave / Diplomat's Skin / milspec concealed liner | T1 | 1 | 45,000 | Undetectable by pat-down or standard scanner; edge to defeat weapon/armor detection. | 4 | Concealable, Stealth |

### 2B — Medium Armor

*The protection-vs-profile middle: real coverage at the cost of a Stealth bane.*

| Item (slang / corp / sci) | Tier | Avail | Price ¥ | Effect | Mod Slots | Tags |
|---|---|---|---|---|---|---|
| Armor Vest / Guardian Vest / ceramic-trauma plate carrier | T5 | 5 | 300 | Baseline vest — cheap and everywhere. Stealth bane while worn. | 1 | — |
| Plated Jacket / Sentinel Line / hybrid soft-hard armor coat | T4 | 4 | 1,100 | Styled as heavy outerwear; blends better than a bare vest. | 2 | — |
| Riot Layer / Bulwark Kit / modular riot-control suit | T3 | 3 | 4,500 | Built for crowd lines; edge vs. being pushed/knocked prone. | 3 | — |
| Corp-Sec Hardweave / Enforcer Rig / powered-assist mesh | T2 | 2 | 16,000 | Servo-assist; cancels the Medium Stealth bane while standing still. | 4 | — |
| Ghostplate / Paladin Discreet / milspec low-profile hardmesh | T1 | 1 | 50,000 | Wears like Light — removes the Medium Stealth bane entirely. | 5 | Concealable |

### 2C — Heavy Armor

*Maximum Stamina, maximum encumbrance. The Operator/tank line.*

| Item (slang / corp / sci) | Tier | Avail | Price ¥ | Effect | Mod Slots | Tags |
|---|---|---|---|---|---|---|
| Hardshell / Aegis Line / full ballistic hardsuit | T5 | 5 | 300 | Entry Heavy armor — a wall you can barely walk in. Full Heavy encumbrance. | 2 | — |
| Security Rig / Custodian Suit / reinforced guard hardshell | T4 | 4 | 1,200 | Standard corp-sec armor; grants cover vs. one called shot per scene. | 3 | — |
| Milspec Battledress / Vanguard-C / composite combat armor | T3 | 3 | 5,000 | +1 stability (resists forced movement) on top of class Stamina. | 4 | — |
| Powered Hardsuit / Titan Frame / servo-exoskeleton armor | T2 | 2 | 18,000 | Removes the −1 Speed penalty (servos carry the weight). | 5 | — |
| Juggernaut / Bastion Prime / milspec powered exo-plate | T1 | 1 | 75,000 | Removes −1 Speed AND the Reflex-agility bane (only Stealth bane remains). +1 stability. | 6 | — |

### 2D — Sealed & Hardened (typed Immunity + Hostile-Env)

*Where genuine damage reduction lives, always typed and always small. Immunity values are PROVISIONAL.*

| Item (slang / corp / sci) | Tier | Avail | Price ¥ | Base Class | Effect | Mod Slots | Tags |
|---|---|---|---|---|---|---|---|
| Flashweave / Salamander Line / fire-retardant armor liner | T4 | 4 | 1,000 | Light | Fire immunity 2; Thermal seal. | 1 | Thermal |
| Faraday Suit / Insulator Line / dielectric-shielded armor | T3 | 3 | 4,000 | Medium | Electricity immunity 2; resists shock/taser/EMP-adjacent effects. | 3 | — |
| Sealed Armor / Voidshell / vacuum-rated hardsuit | T2 | 2 | 17,000 | Heavy | Fully Sealed/Vacuum + Pressure; portable Life Support rating; cold immunity 2. | 5 | Sealed, Pressure, Thermal |
| HE Combat Suit / Wasteland Prime / hostile-env battle exosuit | T1 | 1 | 70,000 | Heavy | Sealed/Vacuum, Rad-Shielded, Filtered, Thermal, Pressure all at once; removes −1 Speed; immunity 2 vs. fire, cold, toxin. | 6 | Sealed, Rad-Shielded, Filtered, Thermal, Pressure |

*(Cross-reference: the Environment Suit in §1D is the non-combat sealed suit; this is its combat-grade counterpart.)*

### 2E — Shields & Riot Gear

*Shields add their Stamina on top of any worn armor, at the cost of a hand — the one thing that stacks with armor Stamina by design.*

| Item (slang / corp / sci) | Tier | Avail | Price ¥ | Effect | Mod Slots | Tags |
|---|---|---|---|---|---|---|
| Riot Shield / Wall Line / polycarbonate breach shield | T5 | 5 | 200 | +Shield Stamina; grants cover to yourself and one adjacent ally vs. ranged. One hand. | 1 | — |
| Ballistic Board / Barrier Kit / composite assault shield | T3 | 3 | 3,000 | +Shield Stamina; cover as above; edge vs. forced movement while braced. One hand. | 3 | — |
| Smart-Shield / Praetorian / powered active-denial shield | T1 | 1 | 40,000 | +Shield Stamina; cover as above; once per scene, negate one ranged hit entirely. One hand. | 5 | Wired |

---

## Category 3 — Weapons

*(See "The Damage-Bridge" above for the governing mechanics. Range names the weapon's optimal band — Adjacent / Short / Medium / Long / Extreme; firing outside it takes a bane per step of mismatch. Melee is Adjacent and omits the field.)*

### 3A — Light Firearms (holdouts, pistols, machine pistols, SMGs)

| Name *(slang / corp / sci)* | Tier | Avail | Cost ¥ | Damage | Range | Mod Slots | Tags |
|---|---|---|---|---|---|---|---|
| Sleeve-Gun / Streek Vanish / holdout pistol | T5 | 5 | 150 | 3 kinetic | Short | 1 | [Light] Concealable |
| Popper / Ares Viper / compact pistol | T5 | 5 | 250 | 4 kinetic | Short | 1 | [Light] Concealable |
| Workhorse / Ceska Duty / service pistol | T4 | 4 | 500 | 4 kinetic | Short | 2 | [Light] |
| Hand-Cannon / Ruger MaxForce / heavy pistol | T4 | 4 | 900 | 5 kinetic | Short | 2 | [Light] Loud |
| Zapper / Defiance Shock / capacitive pistol | T4 | 4 | 800 | 4 electrical | Short | 2 | [Light] Non-lethal-capable |
| Buzz-Gun / Ares Stutter / machine pistol | T3 | 3 | 1,800 | 4 kinetic | Short | 3 | [Light] Auto |
| Chatter / SternMeyer Whisper / suppressed SMG | T3 | 3 | 2,800 | 5 kinetic | Medium | 3 | [Light] Auto Quiet |
| Streetsweeper SMG / Ares Executive / milspec SMG | T2 | 2 | 7,500 | 5 kinetic | Medium | 4 | [Light] Auto |
| Ghost Pistol / Fichetti Null / caseless prototype pistol | T1 | 1 | 24,000 | 5 kinetic | Short | 5 | [Light] Concealable Quiet Smart-ready |

### 3B — Longarms (rifles, carbines, shotguns, marksman rifles)

| Name *(slang / corp / sci)* | Tier | Avail | Cost ¥ | Damage | Range | Mod Slots | Tags |
|---|---|---|---|---|---|---|---|
| Boomstick / Remington Roomsweeper / pump shotgun | T5 | 5 | 300 | 6 kinetic | Short | 1 | [Medium] Two-handed Spread |
| Brush-Gun / Ruger Ranger / hunting carbine | T4 | 4 | 700 | 6 kinetic | Medium | 2 | [Medium] Two-handed |
| Chopper / AK-Kalash Endura / assault rifle | T4 | 4 | 1,100 | 6 kinetic | Medium | 2 | [Medium] Two-handed Auto |
| Streetline Carbine / Ares Alpha-Lite / bullpup carbine | T3 | 3 | 2,400 | 6 kinetic | Medium | 3 | [Medium] Two-handed Auto |
| Autoshotgun / Enfield Sweeper / combat shotgun | T3 | 3 | 3,200 | 7 kinetic | Short | 3 | [Medium] Two-handed Spread Auto |
| Longshot / Ranger Arms Reach / bolt marksman rifle | T3 | 3 | 4,500 | 7 AP | Long | 3 | [Medium] Two-handed |
| Milspec Battle Rifle / Ares Alpha / assault platform | T2 | 2 | 9,000 | 7 kinetic | Medium | 4 | [Medium] Two-handed Auto |
| Whisper Rifle / SternMeyer Silent / suppressed DMR | T2 | 2 | 12,000 | 7 AP | Long | 4 | [Medium] Two-handed Quiet |
| Apex Rifle / Fichetti Prototype / caseless smart-rifle | T1 | 1 | 30,000 | 8 AP | Long | 5 | [Medium] Two-handed Auto Quiet Smart-ready |

### 3C — Heavy Weapons (LMGs, cannons, launchers, anti-vehicle)

| Name *(slang / corp / sci)* | Tier | Avail | Cost ¥ | Damage | Range | Mod Slots | Tags |
|---|---|---|---|---|---|---|---|
| Chatterbox / Ingram Valiant / light machine gun | T3 | 3 | 4,800 | 9 kinetic | Medium | 3 | [Heavy] Two-handed Auto Loud |
| Wallbreaker / Ares HMG / heavy machine gun | T2 | 2 | 11,000 | 9 AP | Long | 4 | [Heavy] Mounted Auto Loud |
| Grease-Gun / Ares Thunderstruck / grenade launcher | T2 | 2 | 14,000 | 9 fire | Medium | 4 | [Heavy] Two-handed Blast |
| Hand-of-God / IRN Striker / anti-materiel rifle | T2 | 2 | 18,000 | 10 AP | Extreme | 4 | [Heavy] Two-handed |
| Dragon's Breath / Shiawase Salamander / man-portable flamer | T2 | 2 | 15,000 | 9 fire | Short | 4 | [Heavy] Two-handed Blast |
| Tank-Cracker / Ares Antioch / disposable rocket launcher | T1 | 1 | 22,000 | 14 fire | Long | — | [Anti-veh] Two-handed Blast Consumable |
| Siege Missile / Ares Guided / smart anti-vehicle launcher | T1 | 1 | 45,000 | 14 AP | Extreme | 5 | [Anti-veh] Mounted Smart-ready |

*(Mounted weapons want a bipod/tripod, drone hardpoint, or vehicle mount. Blast weapons hit an area. Anti-veh damage interacts with vehicle Scale bands and called-shot softening.)*

### 3D — Melee & Blades (clubs, blades, monoweapons, cyber-implant strikes)

*Adjacent-range, kinetic by default (mono-edged blades tag AP). No ammo, no jam, never disarmed if implanted.*

| Name *(slang / corp / sci)* | Tier | Avail | Cost ¥ | Damage | Mod Slots | Tags |
|---|---|---|---|---|---|---|
| Knuckles / Ares Persuader / impact baton | T5 | 5 | 80 | 3 kinetic | 1 | [Light] Concealable Non-lethal-capable |
| Street-Blade / Cavalier Combat / combat knife | T5 | 5 | 120 | 4 kinetic | 1 | [Light] Concealable |
| Shock-Stick / Defiance Prod / stun baton | T4 | 4 | 450 | 4 electrical | 2 | [Light] Non-lethal-capable |
| Machete / Ares Bushmaster / survival blade | T4 | 4 | 300 | 5 kinetic | 2 | [Light] |
| Monoblade / Renraku Edge / monofilament sword | T3 | 3 | 3,000 | 6 AP | 3 | [Medium] |
| Warhammer / FER Crusher / powered maul | T2 | 2 | 6,500 | 9 kinetic | 4 | [Heavy] Two-handed |
| Cyber-Spur / Renraku Talon / implant blade | T2 | 2 | 8,000 | 6 AP | 4 | [Medium] Concealable Implant |
| Monowhip / Fichetti Razorline / retractable monofilament | T1 | 1 | 20,000 | 7 AP | 5 | [Medium] Concealable Dangerous |
| Powered Greatsword / Ares Paladin / servo-blade | T1 | 1 | 26,000 | 10 AP | 5 | [Heavy] Two-handed |

*(Implant melee is installed via the Chrome chapter — Body Integrity cost, not just nuyen — and cannot be disarmed. Dangerous weapons risk the wielder on a fumble.)*

### 3E — Thrown & Grenades

*Short-range consumables (thrown melee excepted). All Consumable: no mod slots, bought per unit.*

| Name *(slang / corp / sci)* | Tier | Avail | Cost ¥ | Damage | Range | Tags |
|---|---|---|---|---|---|---|
| Throwing Knife / Cavalier Fan / balanced blade | T5 | 5 | 60 | 3 kinetic | Short | [Light] Consumable-recoverable |
| Frag / Ares Splinter / fragmentation grenade | T4 | 4 | 200 | 6 kinetic | Short | [Medium] Blast Consumable |
| Firestarter / Shiawase Ember / incendiary grenade | T4 | 4 | 250 | 6 fire | Short | [Medium] Blast Consumable |
| Gasser / IRN Choke / gas grenade | T4 | 4 | 220 | 4 toxin | Short | [Light] Blast Consumable |
| Flash-Bang / Lone Star Dazzle / stun grenade | T4 | 4 | 180 | 4 electrical | Short | [Light] Blast Consumable Non-lethal-capable |
| Thermite Charge / Ares Meltdown / breaching charge | T3 | 3 | 900 | 9 fire | Adjacent | [Heavy] Blast Consumable |
| Shaped Charge / Ares Demo / directional breaching charge | T2 | 2 | 3,500 | 9 AP | Adjacent | [Heavy] Blast Consumable |
| Smart-Grenade / Ares Airburst / programmable airburst grenade | T1 | 1 | 6,000 | 6 kinetic | Medium | [Medium] Blast Consumable Smart-ready |

### 3F — Bows, Crossbows & Exotic

*The quiet-kill and specialist lane — silent, ammo-flexible, Availability-friendly (raises no Alert, pings no weapon-detection).*

| Name *(slang / corp / sci)* | Tier | Avail | Cost ¥ | Damage | Range | Mod Slots | Tags |
|---|---|---|---|---|---|---|---|
| Street-Bow / Cavalier Silent / recurve bow | T5 | 5 | 200 | 4 kinetic | Medium | 1 | [Light] Two-handed Quiet |
| Hand-Crossbow / Fichetti Sting / pistol crossbow | T4 | 4 | 400 | 4 kinetic | Short | 2 | [Light] Concealable Quiet |
| Hunting Bow / Ranger Arms Draw / compound bow | T3 | 3 | 1,500 | 6 kinetic | Long | 3 | [Medium] Two-handed Quiet |
| Heavy Crossbow / NYX Bolt / tactical crossbow | T3 | 3 | 2,200 | 6 AP | Medium | 3 | [Medium] Two-handed Quiet |
| Dart-Gun / Shiawase Whisper / injection dart pistol | T3 | 3 | 2,000 | 3 toxin | Short | 3 | [Light] Concealable Quiet |
| Net-Gun / Lone Star Snare / capture launcher | T4 | 4 | 900 | — | Short | 2 | [Light] Restraining Non-lethal-capable |
| Gauss Needler / Renraku Railspike / coilgun prototype | T1 | 1 | 28,000 | 6 AP | Long | 5 | [Medium] Quiet Smart-ready |

### 3G — Weapon Mods (core set)

*Bench work under the §Craft **procedure** (downtime Project; skill = **Repair** for physical weapon mods, **Electronics** for Wired/smart interfaces). Slot cost = how many of the weapon's slots the mod consumes. Field exception: an already-installed mod can be toggled on/off as a normal action; installing/swapping/removing is always a downtime Project.*

| Mod *(slang / corp / sci)* | Slot Cost | Cost ¥ | Effect | §Craft Skill | Tags |
|---|---|---|---|---|---|
| Smartlink / Ares SmartSystem / targeting interface | 1 | 500 | Edge on ranged strikes while wielder has a datajack/smartgun link or smart-scope. Togglable. | Electronics | Wired Smart |
| Suppressor / SternMeyer Hush / sound suppressor | 1 | 300 | Adds Quiet tag; slight range penalty at Extreme. Field-mountable if pre-threaded. | Repair | Quiet |
| Recoil Comp / Ares Steady / gas-vented compensator | 1 | 250 | Removes the auto-fire/burst bane on the second target or sustained fire. | Repair | — |
| Extended Mag / Ares Deepwell / high-capacity magazine | 1 | 150 | Doubles shots between reloads; halves reload frequency in play. | Repair | — |
| Smart-Scope / Zeiss Hawkeye / optical smart-sight | 1 | 600 | Improves optimal range band by one step; enables Smart on non-datajack users. | Electronics | Smart |
| Gas-Seal Kit / Shiawase Deepdive / hostile-environment seal | 1 | 400 | Weapon fires reliably underwater/vacuum/toxic atmosphere; no environmental jam. | Repair | Sealed |
| Underbarrel Mount / Ares Adapt / accessory rail | 1 | 200 | Adds a mount for a second small weapon/tool or a bayonet. | Repair | — |
| Personalized Grip / Fichetti Lockhand / biometric grip | 1 | 350 | Weapon fires only for its keyed owner (anti-theft/anti-disarm-use). | Electronics | Wired |

---

## Category 4 — Matrix Gear (the jacked-in hardware)

*Governing rulings: (1) Decks are force-multipliers, not weapons — combat always rolls Cognition + the relevant Wired skill; a better deck buys Bandwidth capacity and situational edges, never raw power. (2) Programs are deck mods occupying mod slots — persistent programs (4B) stay resident; attack payloads (4C) are Consumable "ammo" — Craft-loaded magazines sharing the same slots. (3) This is the shared home for both the Hacker's gear and the Wrench's rigger-command hardware (RCCs, 4D) — the drones/vehicles they command live in Category 5.*

### 4A — Cyberdecks

| Name (slang / corp / sci) | Tier | Avail | Cost ¥ | Profile | Slots | Tags |
|---|---|---|---|---|---|---|
| Scrapdeck / Refurb Cyberdeck / salvaged intrusion terminal | T5 | 5 | 300 | Runs an avatar and a single program; bane on holding more than one compromised node at once. | 1 | Wired |
| Street Deck / Commlink-Deck / consumer intrusion rig | T4 | 4 | 1,200 | The workhorse runner's deck. Solid Bandwidth buffer, no special edges. | 2 | Wired |
| Ghostbox / Pro Cyberdeck / professional intrusion suite | T3 | 3 | 5,000 | Edge on one Breach/Intrude per scene; onboard scrubber boosts Ghost-the-Log/Alert-scrub actions. | 3 | Wired, Concealable |
| Blackdeck / Milspec Cyberdeck / hardened cyberwarfare platform | T2 | 2 | 15,000 | Edge on all EW/Disruptor verbs; larger Bandwidth reservoir; bane on enemy ICE trying to raise your Alert. | 4 | Wired |
| Fairlight Ghost / Apex Cyberdeck / prototype quantum-intrusion mainframe-in-hand | T1 | 1 | 55,000 | Maximum Bandwidth cap; one free program-slot verb per turn; no extra biofeedback penalty jacked in. | 5 | Wired |

### 4B — Programs & Utilities (persistent — utility / defense suites)

*A program-mod installed into a deck slot via the §Craft **procedure** (downtime Project; skill = **Hacking**); stays loaded until swapped out. Not Consumable.*

**Doctrine (locked 2026-09-17):** Suites are **utility / support** (Reader, Sneak, Mirror, Scrubber, Overlord), plus Skeleton (soft Breach edge) and Guardian (**defense**). They are not the decker's primary attack buttons — see §4C payloads and `docs/masters/GHOSTWIRE_WIRE_SOFTWARE_DOCTRINE.md`.

| Name (slang / corp / sci) | Tier | Avail | Cost ¥ | Effect (occupies 1 deck slot) | Tags |
|---|---|---|---|---|---|
| Sneak / Stealth Suite / signature-masking daemon | T4 | 4 | 800 | Standing edge on staying undetected while intruding; softens the Alert tick on a Tier-2 Wired roll. | Program, Wired |
| Reader / Analyze Utility / node-diagnostic daemon | T4 | 4 | 700 | Edge on Scan/Sniff; reads a node's Rating, ICE, and paydata at a glance. | Program, Wired |
| Skeleton / Exploit Kit / adaptive-breach daemon | T3 | 3 | 3,000 | Edge on Breach/Intrude against any node one Rating-band below your best clean breach. | Program, Wired |
| Mirror / Spoof Utility / identity-forgery daemon | T3 | 3 | 2,500 | Edge on Spoof/impersonate a device or user credential on the network. | Program, Wired |
| Scrubber / Log-Cleaner / trace-erasure daemon | T2 | 2 | 7,000 | Amplifies Ghost-the-Log/Alert-scrub actions. | Program, Wired |
| Guardian / Watchdog Suite / counter-intrusion daemon | T2 | 2 | 8,000 | Edge on resisting hostile ICE and enemy-decker attacks; warns the crew when Alert spikes. | Program, Wired |
| Overlord / Command Suite / multi-node orchestration daemon | T1 | 1 | 22,000 | Hold one extra compromised node beyond your normal cap; issue a held-node command as a maneuver. | Program, Wired |

### 4C — Intrusion & Attack Payloads (Consumable — offensive magazines)

*Offensive toolkit — the decker's expendable ammunition. **Doctrine (locked 2026-09-17):** payloads are the attack/disrupt side of deck software; suites (§4B) stay utility/defense. See `docs/masters/GHOSTWIRE_WIRE_SOFTWARE_DOCTRINE.md` and `docs/raw/21-the-wire.md` (Deck software).*

**Magazine rule (B51b, locked 2026-09-17):**
- **Shared slots.** A payload occupies **one deck mod slot** — the same slots §4B suites use (a Street Deck's 2 slots hold any mix of suites and magazines). No separate payload bay.
- **One kind per slot.** A slot holds a **magazine** of a single payload kind. Two kinds loaded = two slots.
- **Loading is a Craft Project.** Compiling the chip into a free slot is a downtime **Craft (Hacking)** Project with the payload as its target — not a free inventory action. A loose chip in the bag does nothing.
- **Tier sets fires.** The Project's power-roll tier sets the magazine's quantity: **tier 1 → 1 fire, tier 2 → 3 fires, tier 3 → 5 fires** (provisional). A better Craft means more fires in the *same* slot.
- **Recompile.** A loaded magazine can be re-rolled as a new downtime Craft Project; the new tier **replaces** its fires.
- **Run.** Each Run spends 1 fire. At 0 the magazine is spent and its slot frees.
- **Run tiers.** Tier 1 = partial; **tier 2 = the Effect below** (the catalog promise); tier 3 = the strong version.

| Zap / Feedback Payload / biofeedback surge-packet | T4 | 4 | 600 | Fires a biofeedback spike at a wired target — works only on jacked-in/wired foes. | Program, Consumable, Wired |
| Crash / ICE-Breaker / countermeasure-dissolution routine | T4 | 4 | 700 | Disables one piece of ICE (or grants a decisive edge to breach past it). | Program, Consumable, Wired |
| Static / Jam Burst / local-mesh disruption packet | T3 | 3 | 2,000 | Suppresses one enemy device (smartgun link, camera, comm, hostile drone control) for a round; a strong run hits several. | Program, Consumable, Wired |
| Ghostload / Data-Bomb / delayed logic-charge | T3 | 3 | 2,500 | Plants a trap on a node: next intruder takes a biofeedback hit and spikes their Alert. | Program, Consumable, Wired |
| Blackout / Cascade Payload / systemic-collapse routine | T2 | 2 | 9,000 | Crashes an entire small network / hard-locks a host briefly. | Program, Consumable, Wired |
| Wraith / Total-Intrusion Key / host-seizure exploit | T1 | 1 | 24,000 | Pre-built master exploit; one-shot decisive edge on a host-seizure attempt. | Program, Consumable, Wired |

### 4D — RCCs & Rigger Command

*The Wrench's parallel to a Hacker's deck — raises Uptime capacity and grants fleet edges. Slots hold autosoft/command mods.*

| Name (slang / corp / sci) | Tier | Avail | Cost ¥ | Profile | Slots | Tags |
|---|---|---|---|---|---|---|
| Remote Box / Basic RCC / drone-control terminal | T5 | 5 | 300 | Runs a single drone at a time by remote; no Jump-In support. | 1 | Wired |
| Fleet Deck / Standard RCC / multi-drone command console | T4 | 4 | 1,200 | Coordinate a small fleet; enables Jump-In (with a control rig); one autosoft slot of headroom. | 2 | Wired |
| War Table / Pro RCC / tactical fleet-orchestration suite | T3 | 3 | 5,000 | Edge on issuing fleet commands; larger Uptime buffer; holds more drones active before Overheat pressure. | 3 | Wired |
| Command Rig / Milspec RCC / hardened C2 platform | T2 | 2 | 16,000 | Edge on all Jump-In/Gunnery-through-drone rolls; bane on enemy attempts to jam your fleet control. | 4 | Wired |
| Hydra Console / Apex RCC / prototype swarm-orchestration mainframe | T1 | 1 | 55,000 | Maximum Uptime cap; command one extra drone beyond normal cap; no biofeedback penalty on a Jumped-in body damage tick. | 5 | Wired |

### 4E — Cyberjacks & Interfaces

*The bridge between meat and Matrix for heroes who don't want metal in their skull. Implanted versions (datajack, control rig) are Chrome; these are worn/external nuyen gear.*

| Name (slang / corp / sci) | Tier | Avail | Cost ¥ | Profile | Slots | Tags |
|---|---|---|---|---|---|---|
| Trode Net / Induction Rig / external neural-interface band | T5 | 5 | 250 | Connect without an implant; bane on jacked-in (full-immersion) actions. | 1 | Wired, Concealable |
| Datajack Dongle / Wired Interface Port / direct-tap coupling | T4 | 4 | 900 | Wearable direct-tap kit for a wired/direct connection without surgery. | 2 | Wired, Concealable |
| Hot-Sim Module / Immersion Interface / full-sensory dive rig | T3 | 3 | 4,000 | Enables safer full jacked-in immersion externally; edge on jacked-in Wired rolls. | 3 | Wired |
| Signal Ghost / Stealth Uplink / low-emission wireless array | T2 | 2 | 11,000 | Wireless connection that's hard to locate; bane on enemy counter-trace of your position. | 4 | Wired, Concealable |

### 4F — Matrix-Support Gear

*Peripheral kit — taps, jammers, tracers, and physical tools the crew uses to help the decker; several usable by non-deckers.*

| Name (slang / corp / sci) | Tier | Avail | Cost ¥ | Profile | Slots | Tags |
|---|---|---|---|---|---|---|
| Tap Kit / Data-Tap / physical line-intercept clamp | T5 | 5 | 200 | Physically clamp a data line to give the decker a wired-direct edge on that node. | 1 | Wired, Concealable |
| Buzzer / Signal Jammer / broadband denial emitter | T4 | 4 | 900 | Deployable jammer: bane on all wireless Matrix/comm actions in an area (friend and foe). | 2 | Wired |
| Bloodhound / Trace Unit / signal-triangulation scanner | T3 | 3 | 3,000 | Edge on tracing a hostile signal to its physical source, or detecting a hidden node/decker. | 3 | Wired |
| Faraday Bag / Signal Shroud / EM-isolation enclosure | T4 | 4 | 600 | Seals a device from all wireless contact — prevents remote wipe, trace, or hijack of held gear. | 2 | Concealable |
| Silent Runner / Ghost Router / rerouting mesh-relay | T2 | 2 | 8,000 | Worn relay that bounces your connection through decoy nodes: standing edge on avoiding counter-trace. | 4 | Wired, Concealable |
| Nexus Node / Portable Host / field server-in-a-case | T1 | 1 | 21,000 | Deployable friendly host: gives the decker home-turf edges, stages payloads, fallback if primary deck crashes. | 5 | Wired |

---

## Category 5 — Vehicles & Drones (the fleet)

*Governing rulings: each entry lists a Domain and Scale band plus a qualitative profile — concrete Integrity/Handling/Speed/Armor numbers are deferred to the damage/status pass. Item Tier sets price/Availability/mod-slots only, never Scale. Mounts draw from the standard §F6 mod-slot count and are all §Craft-gated; mounted weapons come from Category 3.*

### 5A — Ground

| Name (slang / corp / sci) | Domain | Scale | Tier | Avail | Cost ¥ | Profile | Slots |
|---|---|---|---|---|---|---|---|
| Rustbucket / City Runabout / urban commuter EV | Ground | Vehicle | T5 | 5 | 250 | The disposable get-around. Low Handling, no mounts. | 1 |
| Crotch-Rocket / Sport Bike / high-torque courier cycle | Ground | Light | T4 | 4 | 1,000 | Fast, nimble; weaves through traffic and foot combat. Exposed rider. | 2 |
| Getaway / Sedan / mid-line autonomous saloon | Ground | Vehicle | T4 | 4 | 1,200 | The classic crew car — seats a full team, decent Handling, self-drive option. | 2 |
| Workhorse / Utility Van / panel cargo hauler | Ground | Vehicle | T4 | 4 | 900 | Cargo + cover + mobile safehouse/rig-nest; the rigger's rolling workshop. | 2 |
| Hardtop / Armored SUV / executive-protection wagon | Ground | Vehicle | T3 | 3 | 4,500 | Up-armored, run-flats, tinted; the corp-extraction and bodyguard vehicle. | 3 |
| Warbike / Assault Cycle / weaponized recon cycle | Ground | Light | T2 | 2 | 12,000 | A bike with a forward mount and light armor — milspec scout/skirmisher. | 4 |
| Brick / APC / armored personnel carrier | Ground | Heavy | T2 | 2 | 18,000 | Heavy-scale crew mover + weapon platform; carries a squad, mounts a turret. | 4 |
| Iron Giant / Combat Walker / bipedal weapons platform | Ground | Vehicle–Heavy | T1 | 1 | 55,000 | The legged mech — all-terrain, multiple hardpoints, apex ground unit. | 5 |

### 5B — Air

*Adds Altitude band (height advantage = edges; forced to 0 altitude = crash) and Stall/lift.*

| Name (slang / corp / sci) | Domain | Scale | Tier | Avail | Cost ¥ | Profile | Slots |
|---|---|---|---|---|---|---|---|
| Buzzcopter / Light Rotor / civil autogyro | Air | Light | T4 | 4 | 1,200 | Cheap two-seat rotor — recon, insertion, a fast overhead eye. Fragile, unarmed. | 2 |
| Tiltjet / VTOL Transport / vectored-thrust rotorcraft | Air | Vehicle | T3 | 3 | 5,000 | Workhorse insertion/exfil bird — carries a team, hovers, mounts a door-gun. | 3 |
| Hoverpad / Air-Car / ducted-fan personal aircar | Air | Vehicle | T3 | 3 | 4,000 | Urban low-altitude flyer; beats a ground chase by ignoring streets. | 3 |
| Skyhunter / Gunship / attack rotorcraft | Air | Heavy | T2 | 2 | 20,000 | Heavy-scale strafe-and-fire-support platform — multiple hardpoints, armor, sensor suite. | 4 |
| Ghost-Wing / Stealth VTOL / low-observable insertion craft | Air | Heavy | T1 | 1 | 60,000 | Radar-and-Alert-quiet heavy insertion craft — the black-ops apex. | 5 |

### 5C — Water & Submersible

*Surface craft handle like ground vehicles on water; submersibles add Depth & Pressure, Silence/Sensors, and buoyancy.*

| Name (slang / corp / sci) | Domain | Scale | Tier | Avail | Cost ¥ | Profile | Slots |
|---|---|---|---|---|---|---|---|
| Skiff / Runabout Boat / outboard launch | Water | Light | T5 | 5 | 300 | A small open boat — river work, harbor crossings, a quiet approach. | 1 |
| Cigarette / Speedboat / hydroplane pursuit craft | Water | Vehicle | T4 | 4 | 1,500 | Fast surface pursuit — high Handling on open water, forward mount option. | 2 |
| Wetsub / Mini-Sub / two-man submersible | Water | Vehicle | T3 | 3 | 6,000 | Silent infiltration below the sensor line; limited depth. | 3 |
| Leviathan / Attack Sub / hunter-killer submersible | Water | Heavy | T1 | 1 | 58,000 | Heavy-scale silent hunter — deep-diving, sonar-armed, torpedo mounts. | 5 |

### 5D — Space

*Removes terrain/cover; adds Vector/inertia, Vacuum (hull breach = decompression), and limited sensors/no sound.*

| Name (slang / corp / sci) | Domain | Scale | Tier | Avail | Cost ¥ | Profile | Slots | Tags |
|---|---|---|---|---|---|---|---|---|
| Pod / Orbital Hopper / suborbital transfer capsule | Space | Vehicle | T3 | 3 | 7,000 | Cramped short-hop capsule — station-to-station, surface-to-orbit. | 3 | Sealed |
| Mule / Orbital Shuttle / heavy transit & boarding craft | Space | Heavy | T2 | 2 | 22,000 | Heavy-scale transit and boarding craft with a docking collar. | 4 | Sealed |
| Reaver / Corvette / fleet-scale warship | Space | Capital | T1 | 1 | 80,000+ | Capital-scale warship — a mobile base with heavy mounts and a crew of stations. | 5 | Sealed |

### 5E — Drones (all sizes & domains)

*The Wrench's signature fleet — a small, crewless vehicle run in one of the three Wired control modes and capped by Uptime. Cheap, expendable, and swarmable; a lost drone is a nuyen loss, not a life.*

| Name (slang / corp / sci) | Domain | Scale | Tier | Avail | Cost ¥ | Profile | Slots |
|---|---|---|---|---|---|---|---|
| Fly / Micro-Drone / insect-scale recon mote | Air (drone) | Personal | T5 | 5 | 200 | A palm-sized spy — slips through vents, perches, relays video. | 1 |
| Crawler / Recon Drone / quadruped sensor unit | Ground (drone) | Light | T4 | 4 | 800 | A ground scout — climbs, maps, plants taps; the decker's/Scout's forward sensor. | 2 |
| Rotor / Quad-Drone / aerial recon quadcopter | Air (drone) | Light | T4 | 4 | 900 | Standard eye-in-the-sky — overwatch, marks targets, cheap swarm unit. | 2 |
| Mule-Bot / Cargo Drone / autonomous hauler | Ground (drone) | Vehicle | T4 | 4 | 1,100 | Load-carrier — hauls gear, extracts wounded, blocks a corridor. | 2 |
| Medbot / Trauma Drone / autonomous field-medic unit | Ground (drone) | Light | T3 | 3 | 3,500 | Carries a Medic's stabilize package to a downed ally under fire. | 3 |
| Wrenchbot / Repair Drone / autonomous maintenance unit | Ground (drone) | Light | T3 | 3 | 3,000 | A mobile toolkit — feeds the Wrench's field-repair/rearm. | 3 |
| Guard-Dog / Patrol Drone / autonomous sentry unit | Ground (drone) | Light | T3 | 3 | 3,200 | Perimeter sentry — light mount, motion sensors, area-denial. | 3 |
| Stinger / Gun-Drone / aerial weapons platform | Air (drone) | Vehicle | T2 | 2 | 13,000 | Autonomous/Jumped-In gunner — a real hardpoint, the fleet's damage dealer. | 4 |
| Barracuda / Aquadrone / submersible sabotage unit | Water (drone) | Light | T3 | 3 | 4,000 | Underwater recon and sabotage — silent, sensor-quiet, plants charges. | 3 |
| Skulker / Anthro-Drone / humanoid infiltration unit | Ground (drone) | Personal | T2 | 2 | 14,000 | A human-scale walker that passes at a distance — the "body double" drone. | 4 |
| Warhound / Combat Drone / heavy autonomous weapons unit | Ground (drone) | Vehicle | T1 | 1 | 40,000 | The apex drone — heavy mounts, real armor, a one-machine assault element. | 5 |

### 5F — Vehicle & Drone Mods

*Every entry is a §Craft-gated mod (downtime Project; skill = **Repair** / **Electronics** as appropriate) occupying the machine's §F6 mod slots. Mounted weapons themselves come from Category 3.*

| Name (slang / corp / sci) | Tier | Avail | Cost ¥ | Effect | Tags |
|---|---|---|---|---|---|
| Gun Rack / Weapon Mount / hardpoint assembly | T4 | 4 | 800 | Adds a hardpoint to fit one Category-3 weapon (scale-appropriate); fired with Gunnery. | Mount |
| Plate-Up / Armor Upgrade / composite up-armor kit | T3 | 3 | 3,000 | Raises the machine's Armor (damage reduction); costs Handling. | — |
| Tune Kit / Handling Package / suspension-&-control upgrade | T3 | 3 | 2,500 | Improves Handling (edge on Piloting/Rigging & evasive driving). | — |
| Sensor Pod / Recon Suite / multi-spectral sensor array | T3 | 3 | 3,000 | Edge on detection/target-lock; pierces smoke/dark. | Wired |
| Ghost Coat / Stealth Skin / low-observable coating | T2 | 2 | 9,000 | Bane on enemy attempts to detect, sensor-lock, or trace the machine. | Wired |
| Runflats / Self-Seal Kit / autonomous-repair weave | T3 | 3 | 2,000 | Resists Crippled (blown tires, punctures); slowly self-repairs minor Integrity between scenes. | — |
| Rigger Cocoon / Control Interface / Jump-In coupling | T2 | 2 | 7,000 | Upgrades a vehicle to accept a Jumped-In pilot cleanly. | Wired |
| Ammo Bin / Rearm System / autonomous munitions feed | T3 | 3 | 2,500 | Extends a mounted weapon's sustained fire; faster Wrench field-rearm. | — |

---

## Category 6 — Magical Foci & Ritual Components

*Governing rulings: (1) Each focus lists a qualitative benefit tagged to the class resource it serves (Essence / Conviction / Resonance) — concrete magnitudes are deferred to the damage/status pass. (2) The signature-focus bond is the ONE sanctioned firewall crossing: a caster may permanently bond exactly one signature focus through a class feature (e.g. the Elementalist's Signature Bond — never a ¥ or character-power purchase) for a deeper, persistent benefit beyond the item's ordinary nuyen effect — every other focus stays pure nuyen. (3) The Necromancer's foci are reserved to the Necromancer class pass and are not included here.*

### 6A — Elementalist foci (Essence / Cognition)

| Item (slang / corp / sci) | Tier | Avail | Cost ¥ | Benefit | Mod Slots · Tags |
|---|---|---|---|---|---|
| Spark-ring / Ignis Band / combustion resonance ring | T5 | 5 | 250 | Edge on Channeling Fire; the beginner's attunement band. | 1 · Veil, Fire |
| Storm-tine / Voltaic Focus / atmospheric potential rod | T5 | 5 | 300 | Edge on Channeling Air/lightning. | 1 · Veil, Air |
| Riverstone / Aqua Sigil / hydrostatic focus stone | T4 | 4 | 700 | Edge on Channeling Water; eases holding a water/ice sustained working. | 2 · Veil, Water |
| Grave-anchor / Terra Core / geomantic mass-focus | T4 | 4 | 900 | Edge on Channeling Earth; steadies concentration against being broken while sustaining an earth working. | 2 · Veil, Earth |
| Void-null / Umbra Prism / entropic null-focus | T3 | 3 | 2,500 | Edge on Channeling Void; the rarest element, prized by controllers. | 3 · Veil, Void |
| Cascade-band / Elementa Suite / poly-elemental attunement array | T2 | 2 | 9,000 | Reduces the penalty for switching elements — the versatile caster's focus. | 4 · Veil |
| Summoner's brand / Genius Loci Seal / elemental-manifestation focus | T2 | 2 | 12,000 | Edge on the high-Essence elemental summoning payoff; helps sustain a bound elemental at lower ongoing Essence. | 4 · Veil, Summon |
| Elder crucible / Magnum Elementum / apex convergence crucible | T1 | 1 | 24,000 | Edge across all five elements at once; readiest signature-focus bond candidate. | 5 · Veil, Signature-capable |

### 6B — Street-Priest foci (Conviction / Presence)

| Item (slang / corp / sci) | Tier | Avail | Cost ¥ | Benefit | Mod Slots · Tags |
|---|---|---|---|---|---|
| Prayer-bead / Rosarium / devotional focus string | T5 | 5 | 200 | Edge on the prayer gamble (the pre-roll faith die); worn openly. | 1 · Veil, Faith |
| Creed-brand / Fidei Sigil / conviction-anchor seal | T5 | 5 | 300 | Steadies the Conviction drip against a bad prayer result. | 1 · Veil, Faith |
| Censer / Thuribulum / sanctified aerosol focus | T4 | 4 | 750 | Edge on warding/blessing workings; helps sustain a warded zone. | 2 · Veil, Ward |
| Judgment-mark / Iudex Brand / anathema focus-iron | T4 | 4 | 1,000 | Edge on the Templar's Judgment mark and its Conviction feedback. | 2 · Veil, Judgment |
| Reliquary / Sanctum Vessel / consecrated relic-housing | T3 | 3 | 3,000 | Edge on healing/support invocations (Shepherd) or anti-spirit rites (Exorcist). | 3 · Veil, Faith |
| Pact-seal / Foedus Sigil / covenant-manifestation seal | T2 | 2 | 10,000 | Edge on Invoke the Pact; helps sustain manifested aid at lower ongoing Conviction. | 4 · Veil, Summon |
| Exorcist's chain / Malleus Vinculum / abjuration binding-focus | T2 | 2 | 11,000 | Edge on banishing and anti-corruption rites. | 4 · Veil, Ward |
| Saint's relic / Numen Cor / apex covenant reliquary | T1 | 1 | 22,000 | Broad edge across invocation, warding, and the pact; readiest signature-focus bond candidate. | 5 · Veil, Signature-capable |

### 6C — Technomancer foci (Resonance / Cognition)

*Resonance-attuned, not owned hardware — the class needs no deck and no rig.*

| Item (slang / corp / sci) | Tier | Avail | Cost ¥ | Benefit | Mod Slots · Tags |
|---|---|---|---|---|---|
| Circuit-charm / Nexus Fetish / woven-trace resonance talisman | T5 | 5 | 250 | Edge on compiling a sprite. | 1 · Veil, Wired, Sprite |
| Echo-node / Resono Tag / harmonic sustain node | T5 | 5 | 300 | Helps sustain one sprite at lower ongoing Resonance. | 1 · Veil, Wired, Sprite |
| Ghost-key / Communio Focus / deep-communion attunement key | T4 | 4 | 800 | Edge on Deep Communion (gearless Jump-In) and its Wired-verb edges. | 2 · Veil, Wired |
| Mend-crystal / Sana Core / restorative resonance lattice | T4 | 4 | 1,000 | Edge on Resonance Mending (healing machines/drones/chrome/Cyborgs). | 2 · Veil, Wired |
| War-glyph / Bellum Sigil / offensive biofeedback focus | T3 | 3 | 2,800 | Edge on the Resonance-Warrior's biofeedback/EW attacks against wired targets. | 3 · Veil, Wired |
| Choir-array / Chorus Suite / wide-congregation resonance array | T2 | 2 | 10,000 | Helps compile and hold additional sprites at lower strain. | 4 · Veil, Wired, Sprite |
| Deep-conduit / Altus Nexus / apex communion conduit | T2 | 2 | 12,000 | Edge on projecting into a machine/drone/Cyborg attuned to via Deep Communion. | 4 · Veil, Wired |
| Resonance heart / Cor Machinae / apex sprite-forge core | T1 | 1 | 23,000 | Broad edge across sprite compiling, sustaining, and communion; readiest signature-focus bond candidate. | 5 · Veil, Wired, Signature-capable |

### 6D — Shared foci & ritual tools (any ritual-capable caster)

*The class-agnostic backbone — the lodge itself is not bought here (that's the stronghold/safehouse Lifestyle tier); these are the portable tools that furnish and improve it.*

| Item (slang / corp / sci) | Tier | Avail | Cost ¥ | Benefit | Mod Slots · Tags |
|---|---|---|---|---|---|
| Chalk-kit / Circulus Set / consecrated inscription kit | T5 | 5 | 200 | Edge on inscribing a ward-line, teleport-circle, or formula-glyph (reusable; consumed chalk/ink is 6F). | 1 · Ritual |
| Ward-stone / Custos Node / protective anchor-stone | T4 | 4 | 750 | Edge on Ward rituals; helps a sustained ward hold longer. | 2 · Ritual, Ward |
| Scry-lens / Speculum Optic / divination focusing lens | T4 | 4 | 800 | Edge on Scry rituals; pairs with a material link to find or watch a target. | 2 · Ritual, Scry |
| Circle-plates / Portalis Array / teleport-circle anchor set | T3 | 3 | 3,500 | Edge on Teleport-Circle rituals; steadies the destination anchor. | 3 · Ritual, Teleport |
| Lodge-kit / Sanctum Suite / portable ritual foundation | T2 | 2 | 9,000 | Raises the effective lodge tier a caster can work at away from home, within the Lifestyle cap. | 4 · Ritual, Lodge |
| Master's athame / Magnum Instrumentum / apex ritual implement | T1 | 1 | 20,000 | Broad edge across the shared ritual backbone; signature-focus bond candidate for a generalist ritualist. | 5 · Ritual, Signature-capable |

### 6E — Material components & telesma (consumed; §B2 authoritative)

*Spent in the casting, unlike the reusable foci above. Grade/cost scale with Ritual Tier. The Rituals-appendix §B2 table is authoritative on any conflict with this summary.*

| Ritual Tier | Component Grade | Base Nuyen | Drain-Trade (per §B2) |
|---|---|---|---|
| T5 | Common reagents | ¥200 | +¥100 → −1 Drain (max 2) |
| T4 | Uncommon reagents/foci | ¥750 | +¥250 → −1 Drain (max 2) |
| T3 | Rare reagents, minor material link | ¥2,500 | +¥750 → −1 Drain (max 3) |
| T2 | Exotic reagents, orichalcum trace, named link | ¥8,000 | +¥2,000 → −1 Drain (max 3) |
| T1 | Orichalcum, a body/greater link, near-unique | ¥30,000+ | +¥6,000 → −1 Drain (max 4) |

**The tangible components:**
- **Common reagents** — herbs, salts, blessed water, conductive dusts; the T5/T4 baseline consumable.
- **Telesma** — a physical vessel that holds a ritual's charge (carved talisman blank, consecrated candle, resonant shard); grade scales with tier.
- **Material link** — a hair, a drop of blood, a personal item tying a Scry or Teleport-Circle to its target. Named/greater links (a signature possession, a body part) are the T2–T1 grade.
- **Orichalcum** — the rare arcane alloy; a trace at T2, a working quantity at T1. Often a run objective in itself.
- **A corpse / greater vessel** — reserved to the death-magic tier; its full use deferred to the Necromancer class pass.

*Insufficient components = the ritual cannot be sealed. Component-hunting is a deliberate legwork/run driver.*

### 6F — Consumable reagent packages (the caster's field kit)

*Pre-assembled, consumed packages bundling 6E raw materials into ready-to-use kits. Priced at the §B2 grade for their tier; §B2 authoritative.*

| Item (slang / corp / sci) | Tier | Avail | Cost ¥ | What It Is | Tags |
|---|---|---|---|---|---|
| Chalk & candle pack / Rite Starter / basic inscription consumables | T5 | 5 | 200 | One ritual's worth of chalk, ink, candles, and common reagents. | Ritual, Consumable |
| Offering bundle / Oblatio Pack / graded reagent offering | T4 | 4 | 750 | A tier-graded offering bought expressly to feed the drain-trade (per §B2). | Ritual, Consumable, Drain-trade |
| Scry-focus kit / Vestigium Pack / material-link handling set | T4 | 4 | 800 | Preservative vials, warded pouches, and reagents for handling/burning a material link cleanly. | Ritual, Consumable, Scry |
| Ward-salt case / Limes Pack / graded warding consumables | T3 | 3 | 2,500 | Rare salts, blessed lines, and telesma for a T3-grade Ward working. | Ritual, Consumable, Ward |
| Orichalcum trace vial / Aurum Pack / exotic apex reagents | T2 | 2 | 8,000 | Exotic reagents plus an orichalcum trace — the T2 grade for relic-work and high rituals. | Ritual, Consumable |
| Apex working case / Magnum Oblatio / near-unique component set | T1 | 1 | 30,000+ | The T1 apex component set assembled for a world-shaking ritual; rarely simply bought. | Ritual, Consumable |

---

## Appendix — Reference Economy Tables (Appendix §F)

### F1. Starting nuyen by career + starting Lifestyle step

| Career | Starting Nuyen | Starting Lifestyle |
|---|---|---|
| Corp Defector | ¥3,000 | Lifestyle 4 |
| Street Kid | ¥500 | Lifestyle 5 |
| Ganger | ¥800 | Lifestyle 5 |
| Mage-for-Hire | ¥1,200 | Lifestyle 5 |
| Ex-Military | ¥2,000 | Lifestyle 4 |
| Corp Security | ¥2,500 | Lifestyle 4 |
| Fixer's Apprentice | ¥1,500 | Lifestyle 4 |

### F2. Payout bands by run tier

| Run Tier | Payout per Crew Member |
|---|---|
| T5 job | ¥400–¥800 |
| T4 job | ¥1,200–¥2,000 |
| T3 job | ¥3,500–¥6,000 |
| T2 job | ¥10,000–¥18,000 |
| T1 job | ¥30,000–¥60,000 |

### F3. Lifestyle upkeep cost per respite by tier

| Lifestyle | Upkeep/Respite | Recovery Quality | Downtime Capacity | Max Lodge Tier | Security |
|---|---|---|---|---|---|
| 5 Squatter | ¥100 | Half Recoveries only (2 of 4) unless treated elsewhere | 1 project slot | None (T5 improvised only) | None — exposed |
| 4 Low | ¥400 | Full Recoveries, no bonus | 1 project slot (+1 with a hireling) | T4 | Token |
| 3 Middle | ¥1,200 | Full Recoveries + edge on 1 Recovery roll/respite | 2 project slots | T3 | Basic |
| 2 High | ¥3,500 | Full Recoveries + edge on all Recovery rolls | 3 project slots | T2 | Strong (bane on hostile intrusion vs. safehouse) |
| 1 Elite | ¥9,000 | Full Recoveries + double the top Recovery-value roll | 4 project slots | T1 | Warded (double-bane on hostile intrusion) |

### F5. Availability values by item tier + gear price bands

| Item Tier | Availability | Price Band |
|---|---|---|
| T5 | Avail 5 (common) | ¥50–¥300 |
| T4 | Avail 4 | ¥300–¥1,200 |
| T3 | Avail 3 | ¥1,200–¥5,000 |
| T2 | Avail 2 (restricted) | ¥5,000–¥20,000 |
| T1 | Avail 1 (milspec/prototype) | ¥20,000–¥80,000+ |

### F6. Mod-slot counts by item tier

| Item Tier | Mod Slots |
|---|---|
| T5 | 1 |
| T4 | 2 |
| T3 | 3 |
| T2 | 4 |
| T1 | 5 |

---

## Gear-Pass Status

The full GHOSTWIRE gear catalog (Categories 1–6) was drafted and completed on 2026-07-15:

- **Category 1 — General & Lifestyle**: ~40 items across 7 sub-lists (1A–1G).
- **Category 2 — Armor**: ~23 items across 5 sub-lists (2A–2E), plus the armor-as-Stamina rule set (§Armor-1 through §Armor-5).
- **Category 3 — Weapons**: ~49 weapons across 6 function sub-lists (3A–3F) plus 3G (8 core weapon mods), exercising the damage-bridge (§A2).
- **Category 4 — Matrix Gear**: ~34 items across 6 sub-lists (4A–4F): Cyberdecks, Programs, Attack Payloads, RCCs, Cyberjacks, and Matrix-Support Gear.
- **Category 5 — Vehicles & Drones**: ~40 entries across 6 domain/function sub-lists (5A–5F), including the Wrench's signature ~11-entry Drone list (5E).
- **Category 6 — Magical Foci & Ritual Components**: ~40 entries across 6 sub-lists (6A–6F): Elementalist, Street-Priest, and Technomancer foci, shared ritual tools, material components, and consumable reagent packages.

**Deferred to later passes:** concrete numeric magnitudes for foci/vehicle stat blocks and Matrix Bandwidth/Uptime values (the damage/status pass); Necromancer foci (reserved to the Necromancer class pass); and dedicated Weapon-Mods, Armor-Mods, Matrix-Programs, and Vehicle-Mods sub-passes for expanded depth beyond the core sets listed here.
