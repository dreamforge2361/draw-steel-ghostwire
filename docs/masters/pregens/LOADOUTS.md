# Pregen loadouts — grants, gear, chrome, languages (B44b)

Machine-readable source: **`docs/masters/pregens/loadouts.json`** (gear / chrome / languages).
Generator: `tools/pregens-to-actors.mjs` → `src/packs/pregens/` → `node tools/build-packs.mjs` (Foundry closed).
Roster and Level 1 maths: `ROSTER.md`. Assumptions and the Tier 5 decision: `BUILD-NOTES.md`.

## How the grants were applied

Every Level 1 advancement on each hero's **ancestry, ancestry traits, class, subclass, kit, background and
profession** is now resolved and embedded, recursively — so a sheet opens complete and nothing waits on Foundry's
advancement dialog. Where an advancement offers a choice, the generator prefers **the roster's own picks** (that
hero's kit, subclass, lineage, traits and signature abilities) and otherwise takes the pool in order; every choice is
printed when the tool runs.

Two kinds of grant are deliberately left to Foundry at runtime:

- **`effectGrant`** pools point at the **Draw Steel system** compendium (`Compendium.draw-steel.effects.*`), not at
  this module, so they cannot be copied from our JSON. Foundry applies them when the item is on an actor.
- **`characteristic`** advancements are ignored: the Level 1 array is written directly (see `ROSTER.md`).

## Per hero

Item counts are what the built pack holds (class + subclass + ancestry + traits + kit + background + profession +
granted abilities/features + gear). "BI" is Body Integrity spent of 20.

| Hero | Items | Skills | Armor | Weapons | Street kit | Chrome (BI) | Languages |
|---|---|---|---|---|---|---|---|
| **Vessa** | 32 | 5 | Hardshell | Workhorse, Street-Blade | Burner, Trauma Patch, Field Surgery Kit, Standard Rounds | none (0) | FlatsCant, CorranWorkCant, SaintCant, RiteSpeech |
| **Kaïs** | 25 | 7 | none (kit says none) | Zapper, Sleeve-Gun | Pocket Sec, Fake SIN, Trauma Patch, Standard Rounds | none (0) | ElvaniHighCant, ElvaniSoftspeech, CorpCant, ReachMetro |
| **Barak** | 33 | 5 | Hardshell | Chatterbox, Knuckles | Pocket Sec, Certified Credstick, Fake SIN, Stim Patch | Cyberlimb (Arm) 5 + Dermal Plating 4 (**9**) | GoliarBattleCant, SprawlArgot, TradeCant, CorpCant |
| **Wren** | 30 | 7 | Armored Jacket | Longshot rifle, Popper | Burner, Cheap Shades, Standard Rounds, Trauma Patch | none (0) | ChangerPackTongue, ReachMetro, TradeCant, SprawlArgot |
| **Sabbat** | 31 | 9 | Secure Threads | Popper | Pocket Sec, Fake SIN, Standard Rounds, Faraday Bag | Cyber-Ears (Soft) 1 (**1**) | RevenantMemorySpeech, ResonanceNotation, WireSpeak, SprawlArgot |
| **Vira** | 32 | 6 | Secure Threads | Popper | Fleet Deck (RCC), Targeting Autosoft, Burner, Lockpick Set | Datajack 1 (**1**) | ChangerPackTongue, WireSpeak, MachineMarkup, SprawlArgot |
| **Kessic** | 29 | 6 | Secure Threads | Sleeve-Gun | Street Deck, Sneak program, Crash payload, Whiteout magazine (2 fires, compiled), Pocket Sec, Trauma Patch | Datajack 1 + Cyber-Eyes 2 (**3**) | MutantEnclaveCant, WireSpeak, OldCode, SprawlArgot |

Every hero's Body Integrity is legal: the most spent is Barak's 9 of 20.

## Choices worth knowing

- **Barak's kit changed: Juggernaut → Saturation.** Juggernaut is **not in the Commander class's kit pool** — that
  pool has no heavy kits at all — so v1's Juggernaut pick was illegal for a Commander. Saturation is the closest
  legal fit for a heavy-firearm fixer. His Stamina moved 30 → 24 as a result.
- **Kessic's kit changed: No Kit → Nyx Cartel "Switchblade".** The Hacker class grants no kit of its own, and he was
  ending up with two kit items. The Switchblade is the decker kit, which is what his fiction wants anyway.
- **Ancestry trait picks** now come from each People's own purchased-trait pool, with the roster's named traits
  preferred — so Wren keeps **Raven lineage** and Vira keeps **Rat lineage**.
- **Barak can't have both plating and lacing.** Dermal Plating and Muscle/Bone Lacing both occupy Torso/Core, and the
  install rule is one implant per slot. He takes Dermal Plating, which is the plate the prose leans on.
- **Wren is deliberately unchromed.** Implanted metal versus Changer shapeshifting is the same fiction problem as
  caster erosion. Swap in Cyber-Ears (2 BI) if you disagree.

## Where the packs had no clean fit (worth a later spike)

1. ~~No Soft-grade chrome exists.~~ **Closed by B55 (0.1.80).** The chrome pack now has six Soft/Bioware SKUs, each
   1 BI, so one of them costs a caster no casting cap (Soft erodes 1 per 3). Picks:
   - **Sabbat** takes **Cyber-Ears (Soft)**. His dossier says he "runs almost no chrome", and a grown cochlear lattice
     for hearing the dead frequency is the one implant that fits.
   - **Vessa** and **Kaïs** stay **unchromed**. Both dossiers lock it as an identity line ("Chrome: NONE … full flesh";
     "foci-not-chrome is his whole toolkit"). Director options if a table wants one: Vessa → **Empathy Processor
     (Soft)** (Insight, a preacher reading the soup line); Kaïs → **Cyber-Ears (Soft)** (grown, not metal, so it doesn't
     break his "will not share a body with metal" line). RAW still tier-gates Soft as late and expensive.
2. **Heavy street firearms are a dead zone.** `weapons/heavy/` has exactly one non-Military entry (Chatterbox,
   Restricted, Echelon 2). Barak carries it despite Restricted availability because nothing Street or Professional
   exists in that class of weapon.
3. ~~Hexshot, Longshot and Saturation kits still declare `weapon: ["bow"]`.~~ **Closed by B55 (0.1.80):** Hexshot
   light/medium, Longshot medium, Saturation light/medium, Streetsweeper medium. Kit bonuses key off ability keywords,
   so nothing changes mechanically.
4. **Barak's armor is heavier than his kit.** Saturation declares light armor; he wears Hardshell for the demolition
   plate look. Apply either the kit's Stamina bonus or the armor's, not both (`08-kits-gear-wealth.md`).
5. **Kaïs wears no armor at all**, strictly following Hexshot's `armor: "none"`. Wren, whose Longshot kit also says
   none, was given a light Armored Jacket per the spike's "Light / none" direction — flag if you want her bare too.
6. Above-Professional picks are limited to Wren's Longshot rifle and Barak's credstick and Chatterbox. Everything else is Street or Professional.
7. **Kessic’s Whiteout magazine is hand-compiled.** `loadouts.json` lists the SKU; `kessic-draye.json` then sets quantity **2**, `mod.installedOn` the Street Deck, and `mod.active` (B105). A full `pregens-to-actors.mjs` run would drop that compile unless re-applied.
