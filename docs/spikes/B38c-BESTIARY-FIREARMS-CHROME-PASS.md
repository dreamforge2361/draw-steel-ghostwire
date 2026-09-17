# Spike B38c — Bestiary firearms / chrome ability pass

**Repo:** draw-steel-ghostwire  
**Depends on:** B38 Wave 1 pack on disk (`src/packs/bestiary/`, ~35 NPCs).  
**Do NOT commit or push.** Leave ready for Michael Foundry-verify.  
**Bump** module.json one patch from current (read disk).

## Problem (LOCKED)
Wave 1 reskins kept Draw Steel ability **names and fiction** (Zweihander, Halberd, Handaxes, Rapier, Morningstar, Crossbow, Command Saber, Death Scythe, etc.). In Ghostwire / The Reach, **melee is rare**. Street, corp, Ironclad, rivals, and Wire-adjacent humanoids should fight with **pistols, SMGs, carbines, rifles, shotguns**, plus **chrome / implants / decks** where it fits. Natural weapons stay for beasts, undead claws, and true monsters.

## Doctrine
1. **Keep DS math** (power roll tiers, damage numbers, keywords that affect rules, AP/Malice costs, ranges in squares). Prefer rename + description rewrite over redesigning the power.
2. **Rewrite ability `name` + description / flavor** to firearms/chrome/Wire. Map genre:
   - Blade / sword / saber / zweihander / spear / halberd / morningstar → **heavy pistol, SMG, carbine, shotgun, monowire (rare), stun baton (corp only, uncommon)**
   - Dagger / handaxe / knife → **holdout pistol, smartlinked sidearm, monofilament (rare knife OK for Street Cutter only)**
   - Bow / crossbow / bolt launcher → **rifle, sniper rifle, smartgun, carbine**
   - Whip / magic longsword (Gang Boss) → **heavy pistol + SMG / smartlinked longarm**; drop peasant/magic fiction
   - Parry / blade-throw → **cover fire, ricochet shot, magdump, suppress**
   - Alchemical device → **grenade / flashbang / stim / BTL spike** as fits
3. **Melee OK (do not force guns):** wilds beasts, vermin, undead natural attacks (claws/bite), Signal/Voiceless monster anatomy, Elementalist/Priest magical strikes (retheme magic, not into guns).
4. **Add chrome / deck fiction** where the Actor role implies it (Corp Enforcer, Ironclad, Chrome Bruiser-analogs, Hacker/Technomancer rivals): short biography or feature line for implants, smartlink, loyalty collar stays, deck on Wire rivals — **do not invent full chrome Item grants** unless trivial; flavor + ability rename first.
5. **Lang keys:** update `lang/en.json` `GHOSTWIRE.Bestiary.Actors.*.Description` and any ability name keys if abilities are localized; embedded ability `name` fields on the Actor JSON must read as GW firearms in Foundry.
6. Rebuild packs via `tools/build-packs.mjs` after edits.
7. Standing rule: document in `docs/masters/GHOSTWIRE_BESTIARY.md` — all future bestiary entries follow this pass.

## Scope — pass every Actor in `src/packs/bestiary/`
| Folder | Expectation |
|---|---|
| reach-streets | Guns primary; Street Cutter may keep one knife; drop fantasy weapons |
| corp-security | Carbines / smartguns / riot tools; no halberds/zweihanders/sabers |
| rivals | Operator/Scout/Commander → firearms kit; casters keep powers but drop blade fiction; Hacker/Technomancer → deck/ICE flavored where abilities allow |
| wire-machine | Chrome Raiders → chrome weapons not sabers/sickles; Signal beasts keep anatomy |
| veil-undead | Cultist: drop Death Scythe → ritual pistol / corruption focus; undead naturals OK |
| wilds-jungles | Leave natural weapons |

## Out of scope
New Actor count; B38b originals; art/tokens; Run Generator; changing DS damage formulas; full Gear Item embeds.

## Done when
- No street/corp/Ironclad/rival humanoid still named for medieval melee (spot-check Compendium).
- Beasts/undead naturals unchanged in role.
- Pack rebuilt; checklist printed; **no commit**.

## Foundry test checklist (print when finished)
1. Open Gang Boss, Corp Enforcer, Corp Security Officer, Ironclad Conscript, Rooftop Shooter, Trick Shooter — ability names are firearms/chrome.
2. Street Cutter may show holdout + optional knife; no handaxes on Gang Raider.
3. Feral Beast / Zombie still natural attacks.
4. Drag Enforcer + Gang Boss to Scene; abilities roll.
5. Master notes firearms doctrine.