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

## Origins pack layout (Ghostwire Ancestries)

The pack id and path are `origins`; Foundry shows it as **Ghostwire Ancestries** (`GHOSTWIRE.COMPENDIUM.origins`). Keep the id so UUIDs stay stable.

Each People gets one compendium Folder named after it (Pure Human, Corran, Elvani, …). The People's ancestry and all of its traits and abilities go inside that folder, never at the pack root. The source mirrors this: `src/packs/origins/<people>/` holds a `_folder.json` (the Folder document) plus that People's items, and each item's `folder` is set to that Folder's `_id`. The build fails if an item's `folder` doesn't match its directory.

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
