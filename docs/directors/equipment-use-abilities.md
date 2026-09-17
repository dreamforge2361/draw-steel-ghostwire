# B49 — Equipment → usable ability (bug / gap) (backlog)

**Status:** **Built 0.1.68 (B49), pending Michael Foundry-verify** — `scripts/equipment-use.mjs` spawns a free-strike-shaped ability per weapon treasure on a hero, removes it with the weapon, and rides the normal ability pipeline so B40 SFX fires. Templates: `scripts/data/weapon-use-templates.json`. Spike: `docs/spikes/B49-EQUIPMENT-USE-ABILITIES.md`.  
**Reported:** Michael Foundry-testing B40 — dropping gear (e.g. Chatterbox) on a Hero sheet does **not** create or link an ability to fire/use it, so SFX never fires for that gun either.  
**Depends on:** Gear pack (`treasure` items), Draw Steel ability use pipeline, B40 SFX (`createChatMessage` + `abilityUse`).  
**Do NOT implement until Michael prioritizes.**

## Bug
Ghostwire weapons/armor/gear in `src/packs/gear` are **`type: "treasure"`** inventory items (kind/category/echelon/keywords only). They carry **no** embedded ability, no `itemGrant` advancements, and no link to a free-strike / “Fire [Weapon]” ability.

So when a Director or player adds Chatterbox (or Ghost Pistol, Longshot, etc.) to a sheet:
- The item sits in inventory.
- There is **no** sheet ability to attack with that weapon.
- B40 SFX only plays on `abilityUse` chat parts — inventory treasure never triggers it.

Kits grant signatures + equipment *categories*, not per-SKU fire abilities. Pregens that “work” are using **class/kit abilities**, not the treasure gun itself.

## Goal
Make equipped / carried gear **usable** from the sheet, and have that use path hit B40 SFX (firearm map / per-item override).

## Design options (spike picks one — investigate DS 1.1.2 first)
1. **On createItem (treasure weapon):** spawn a linked Ability Item on the actor (“Fire Chatterbox”) with DS free-strike / weapon profile math, keywords, and `flags.draw-steel-ghostwire.sfx` / linked gear UUID; delete ability when gear is removed.  
2. **Promote weapons to real DS weapon/ability documents** in the gear pack (schema migration) so Draw Steel’s native equipment→attack path applies — if the system has one.  
3. **Universal “Use equipped weapon” ability** that reads the actor’s active firearm treasure and resolves damage/range from gear data + plays SFX.  
4. Hybrid: templates per gear category (light firearm / longarm / heavy) + instance name/sfx from the treasure.

Also cover: armor (probably no fire ability), chrome activatables, decks/programs, grenades — at least **weapons** in v1.

## Acceptance (future spike)
- Add Chatterbox to a Hero → a usable attack ability appears (or native use works).  
- Using it creates an `abilityUse` chat part → B40 firearm (or override) sound plays.  
- Removing the gear cleans up the linked ability (no orphans).  
- Works for stock gear SKUs; documented for new gear authors.  
- Foundry-verify; no commit until Michael says.

## Out of scope (v1)
Rewriting all treasure descriptions; full ASE VFX; inventing new damage math beyond DS free-strike / kit bands already in RAW.

## Related
- B40 Ability SFX (hook ready; needs a real ability use)  
- B44b pregens (gear on sheet but fire path is class abilities)  
- Kit `equipment` categories vs concrete SKUs

---

## As built (B49, module 0.1.68 — pending Foundry-verify)

### What Draw Steel 1.1.2 actually does (investigation result)

Read from `draw-steel.mjs`, not assumed:

- **There is no weapon Item type.** The system's Item types are ability, ancestry, ancestryTrait, career,
  class, complication, culture, feature, follower, kit, perk, project, subclass, title, **treasure**. A weapon is
  a `treasure` with `system.kind: "weapon"` — kind, category, echelon, keywords, quantity, project. No attack
  profile, no advancement grant, nothing to activate.
- **`freeStrike` as a stat belongs to monsters**, not heroes (`system.monster.freeStrike`).
- **Heroes attack with abilities.** The system ships **Melee Free Strike** and **Ranged Free Strike** as
  abilities with `system.category: "freeStrike"`, handed out through `ds.CONFIG.hero.defaultItems`. Kits then
  add their damage and distance bonuses to any ability carrying the right keywords.

So there is **no native per-weapon path to switch on** — the bug report is correct, and this is the system
working as designed: the weapon is flavour, the free strike is the action, the kit is the maths.

### Approach taken

Spawn an ability that *is* a free strike with that weapon. It copies the system free-strike shape exactly
(`category: "freeStrike"`, `type: "main"`, single creature target, power roll `@chr` over might/agility) and
changes only what the weapon determines: its **distance band** and its **damage**. Because the keywords stay
`strike` + `weapon` + `melee`/`ranged`, **kit bonuses keep applying** exactly as they do to a normal free
strike — no parallel combat system, nothing to keep in sync.

Using it runs the ordinary ability pipeline, so it emits the `abilityUse` chat part that **B40** listens for,
and the SFX plays with no extra wiring. The generated name ("Fire Chatterbox", "Strike with Monoblade") is what
the B40 keyword map matches on, so guns hit the firearm rule and blades hit the impact rule.

### Where the numbers come from

Every Ghostwire weapon already carries `flags.draw-steel-ghostwire.gear` with `weaponBand`, `range`,
`damage` and `damageType` — so nothing had to be parsed out of prose and no pack file was edited.

| Gear `range` | Ability distance |
|---|---|
| Adjacent | melee 1 |
| Short | ranged 5 |
| Medium | ranged 10 |
| Long | ranged 20 |
| Extreme | ranged 20 |

Distances are the ladder Ghostwire content already uses (5 / 10 / 20 cover all but two of the ranged abilities
in the packs). **RAW does not define range bands in squares**, so Extreme currently collapses onto Long — flagged
below.

**Damage:** the gear's `damage` is the weapon's RAW printed number, which Pass A lock A10 defines as the
**middle** result. Low and high use the same spread the system's own free strikes use — ranged 2/4/6 gives
−2/+2, melee 2/5/7 gives −3/+2. A low result floors at 1, because a hit that connects should do something.
**No characteristic is added to damage**: RAW prints weapon damage as the number itself, and kit bonus lines add
on top by result. Damage types follow Pass A lock A9 (kinetic and AP untyped, electrical → lightning, toxin →
poison, fire → fire).

Checked against all 49 shipped weapons: **48 arm**, and the **Net-Gun** is deliberately skipped because it has
no damage line at all (it ensnares). Samples: Chatterbox ranged 10, 7/9/11 · Workhorse ranged 5, 2/4/6 ·
Longshot ranged 20, 5/7/9 · Knuckles melee 1, 1/3/5.

### Lifecycle

| Event | Behaviour |
|---|---|
| Weapon treasure added to a **hero** | Spawns the ability; the weapon stores `flags.draw-steel-ghostwire.useAbilityId`, the ability stores `fromGearId` |
| Weapon removed | Its linked ability is deleted |
| Same weapon added twice | No double-spawn — the link flag and a `fromGearId` scan both guard it |
| Actor imported whole (a pregen) | `createActor` syncs it, because embedded items never fire `createItem` |
| World load | `ready` syncs every owned hero: arms unarmed weapons, deletes abilities whose weapon is gone |

The `ready` pass is the migration for existing pregens, so Vessa's Workhorse and Krow's Chopper arm themselves
on first load. It is idempotent and only runs for actors you own.

### Generic Free Strikes are suppressed (B44c, 0.1.69)

Draw Steel hands every hero **Melee Free Strike** and **Ranged Free Strike** through
`ds.CONFIG.hero.defaultItems`. Ghostwire does not want them: a weapon on the sheet already grants its own
attack, so the generics are duplicate clutter. `scripts/free-strikes.mjs` removes them three ways —
it deletes both uuids from `hero.defaultItems` at init (so new heroes never receive them), deletes them on
`createItem` for any other path including NPCs, and strips them from existing actors on `ready`.

**Matching is narrow on purpose.** `system.category === "freeStrike"` is *not* a safe test: the system files
**Mind Spike** (Talent) and **Hurl Element** (Elementalist) under that same category, and Ghostwire gives Hurl
Element to Kaïs. The strip matches only the two generics, by `_dsid` (`melee-free-strike`,
`ranged-free-strike`), by their system compendium ids, and by name as a fallback. Class signatures, kit
signatures and B49's own weapon abilities are never touched.

No pack scrub was needed: no shipped Actor in this module embeds a Free Strike — they only ever arrive at
runtime from the system's defaults.

### Notes for gear authors

A new weapon SKU opts in automatically: give it `system.kind: "weapon"` and the usual
`flags.draw-steel-ghostwire.gear` block with `range`, `damage` and `damageType`. Nothing else is needed. To
change how a band maps to distance or how low/high derive, edit `scripts/data/weapon-use-templates.json`.

### Open questions for Michael

1. **Extreme range** has no RAW definition in squares and currently equals Long (20). Siege Missile and
   Tank-Cracker therefore reach no further than a sniper rifle.
2. **No `@chr` on damage.** This keeps weapons at their printed RAW numbers. If you want DS-style
   characteristic scaling on gun damage, it is a one-line change in the template file — but it would make
   weapon damage diverge from the gear tables.
3. **Thrown weapons are single-target strikes** — grenades do not yet place an area. Blast tags exist on the
   gear; area templates are a v2 job.
4. **Armour, chrome and decks are untouched**, per the spike's v1 scope.
