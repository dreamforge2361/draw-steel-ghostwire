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
granted abilities/features + gear + the seven Draw Steel and five Ghostwire default abilities embedded in
0.3.127). "BI" is Body Integrity spent — of 20 for a living hero, of 25 for a Cyborg frame.

| Hero | Items | Skills | Armor | Weapons | Street kit | Chrome (BI) | Languages |
|---|---|---|---|---|---|---|---|
| **Vessa** | 46 | 5 | Hardshell | IW Journeyman, Street-Blade | Burner, Trauma Patch, Field Surgery Kit, Standard Rounds ×150 | none (0) | FlatsCant, CorranWorkCant, SaintCant, RiteSpeech |
| **Kaïs** | 39 | 7 | none (kit says none) | Seraph Mercy, Velvet Cufflink | Pocket Sec, Fake SIN, Trauma Patch, Standard Rounds ×150 | none (0) | ElvaniHighCant, ElvaniSoftspeech, CorpCant, ReachMetro |
| **Barak** | 45 | 5 | Hardshell | IW Barrage-12, Knuckles | Pocket Sec, Certified Credstick, Fake SIN, Stim Patch, Standard Rounds ×150 | Cyberlimb (Arm) 5 + Dermal Plating 4 (**9**) | GoliarBattleCant, SprawlArgot, TradeCant, CorpCant |
| **Wren** | 43 | 7 | Armored Jacket | Greenline Longwatch rifle, Ferrum Rivet | Burner, Cheap Shades, Standard Rounds ×150, Trauma Patch | none (0) | ChangerPackTongue, ReachMetro, TradeCant, SprawlArgot |
| **Sabbat** | 45 | 9 | Secure Threads | Ferrum Rivet | Pocket Sec, Fake SIN, Standard Rounds ×150, Faraday Bag | Cyber-Ears (Soft) 1 (**1**) | RevenantMemorySpeech, ResonanceNotation, WireSpeak, SprawlArgot |
| **Vira** | 46 | 6 | Secure Threads | Ferrum Rivet | Fleet Deck (RCC), Targeting Soft, Burner, Lockpick Set, Standard Rounds ×150 | Datajack 1, Skillwires 4 (**5**) | ChangerPackTongue, WireSpeak, MachineMarkup, SprawlArgot |
| **Kessic** | 42 | 6 | Secure Threads | Velvet Cufflink | Street Deck, Sneak program, Crash payload, Whiteout magazine (2 fires, compiled), Pocket Sec, Trauma Patch, Standard Rounds ×150 | Datajack 1 + Cyber-Eyes 2 (**3**) | MutantEnclaveCant, WireSpeak, OldCode, SprawlArgot |
| **Renn** | 46 | 7 | Armored Jacket | IW Journeyman | Field Surgery Kit, Slap-Doc Kit, Trauma Patch, Pocket Sec, Fake SIN, Standard Rounds ×150 | none (0) | PureLineHomily, FlatsCant, TradeCant, SprawlArgot |
| **Kade** | 47 | 7 | Security Rig | Argent Sovereign .50, Shock-Stick | Riot Shield, Pocket Sec, Stim Patch, Fake SIN, Standard Rounds ×150 | Wired Reflexes 6 + Cyberlimb (Arm) 5 + Muscle/Bone Lacing 5 + Dermal Plating 4 + Cyber-Eyes 2 + Cyber-Ears 2 + Datajack 1 (**25**) | CyborgFrameCant, OpsDialects, TradeCant, CorpCant |

Every hero's Body Integrity is legal. The most spent is Kade's **25 of 25** — a Cyborg frame starts
at 25, not 20, and his is full; among the living heroes it is Barak's 9 of 20.

**0.3.129 — every hero carries 150 Standard Rounds.** Barak, Vira and Kessic had none at all and
the other six had the kiosk's box of 30. The count is an override on the loadout line
(`{ "path": "…/standard-rounds.json", "quantity": 150 }`), not a change to the SKU — a box on
a shelf is still 30 rounds for ¥50.

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
2. **Heavy street firearms are a dead zone.** `weapons/heavy/` has exactly one non-Military entry (IW Barrage-12,
   Restricted, Echelon 2). Barak carries it despite Restricted availability because nothing Street or Professional
   exists in that class of weapon.
3. ~~Hexshot, Longshot and Saturation kits still declare `weapon: ["bow"]`.~~ **Closed by B55 (0.1.80):** Hexshot
   light/medium, Longshot medium, Saturation light/medium, Streetsweeper medium. Kit bonuses key off ability keywords,
   so nothing changes mechanically.
4. **Barak's armor is heavier than his kit.** Saturation declares light armor; he wears Hardshell for the demolition
   plate look. Apply either the kit's Stamina bonus or the armor's, not both (`08-kits-gear-wealth.md`).
5. **Kaïs wears no armor at all**, strictly following Hexshot's `armor: "none"`. Wren, whose Longshot kit also says
   none, was given a light Armored Jacket per the spike's "Light / none" direction — flag if you want her bare too.
6. Above-Professional picks are limited to Wren's Greenline Longwatch rifle and Barak's credstick and IW Barrage-12. Everything else is Street or Professional.
7. **Kessic’s Whiteout magazine is hand-compiled.** `loadouts.json` lists the SKU; `kessic-draye.json` then sets quantity **2**, `mod.installedOn` the Street Deck, and `mod.active` (B105). A full `pregens-to-actors.mjs` run would drop that compile unless re-applied.

## Ritual Formulas (0.3.88)

The three Veil/Wire casters — Kaes (Elementalist), Vessa (Street Priest), Sabbat (Technomancer) — start with the **Ward the Room** Formula Item already studied (`rituals` in `loadouts.json`; the embed carries `flags.draw-steel-ghostwire.ritual.learned: true`). It is the teaching Working in The Veil (`docs/raw/22-the-veil.md`, Ritual Workings).

## 0.3.124 — Renn Solace-Ward and Kade Orrin-Vex

**Renn “Patchwire” Solace-Ward** — Medic (Street-Doc) · Pure Human. Kit is **Gunslinger**, which is the
Medic class's own Quick Build and the lightest thing in the class's kit pool that still allows the
Armored Jacket a trauma doc can cut off a patient and put back on himself. The bag is the character:
Field Surgery Kit, Slap-Doc Kit and a Trauma Patch, with an IW Journeyman service pistol he would rather keep
holstered, a PocketSec and a basic fake SIN. **No chrome** — Pure Human, and the whole point of him is
being the block's alternative to a ripperdoc, so Body Integrity stays 20/20.

**Kade “Hardframe” Orrin-Vex** — Operator (Corp-Milspec) · Cyborg. The 0.3.124 brief's ADDENDUM locks the
chrome exactly, and it spends a Cyborg's whole **25** Body Integrity with nothing left over:

| Chrome | Grade | BI |
|---|---|---|
| Wired Reflexes | Standard | 6 |
| Cyberlimb Arm | Standard | 5 |
| Muscle & Bone Lacing | Standard | 5 |
| Dermal Plating | Standard | 4 |
| Cyber-Eyes | Standard | 2 |
| Cyber-Ears | Standard | 2 |
| Datajack | Standard | 1 |
| **Total** | | **25 / 25** |

No Soft-grade substitutions: subtle is the opposite of the brief. Everything is Standard grade and
everything is visible.

**0.3.125 (C3) — the gear half is re-cut to Echelon 1.** Kade shipped with the Milspec Battledress
(E2) and the IW Bastion (E3), both above an E1 hero's band; the rifle is also two-handed,
which a Warframe cannot hold alongside the shield its own doctrine calls for. The Warframe category
is *medium weapon plus a shield; heavy armor*, so at street prices that is:

| Slot | Item | Echelon |
|---|---|---|
| Heavy armor | **Security Rig** — corp-sec issue, which reads right on an ex-corp frame | 1 |
| Shield | **Riot Shield** | 1 |
| Melee | **Shock-Stick** — the one-handed imposing / stun mace | 1 |
| Ranged | **Argent Sovereign .50** | 1 |

Plus the carry he already had: stims, ammunition, a PocketSec and a basic fake SIN. The chrome, the
Body Integrity spend and the fiction behind them are untouched — this lock is gear only.

Kade is the first Cyborg pregen, so `tools/pregens-to-actors.mjs` no longer hard-codes Body Integrity at
20 — see `INTEGRITY_BY_ANCESTRY` there, which mirrors `CYBORG_INTEGRITY_START` in `scripts/module.mjs`.
