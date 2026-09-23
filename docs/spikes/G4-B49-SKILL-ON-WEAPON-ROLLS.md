# Spike G4 — B49 skill-on-weapon rolls

**Repo:** draw-steel-ghostwire · **Ships in:** 0.3.102 · **Locked:** Michael, 2026-09-22
**Builds on:** B49 (`scripts/equipment-use.mjs`), the Hacking-edge auto-apply path (`scripts/module.mjs` + `abilityPowerRollModifiers` in `scripts/wired-state.mjs`)
**Smoke:** `node tools/g4-skill-on-weapon-smoke.mjs` · **Foundry checklist:** `docs/directors/g4-skill-on-weapon-smoke-03102.md`

## The gap

B49 arms a Ghostwire weapon treasure with a spawned free-strike ability — *Fire Workhorse*, *Fire Chatterbox*, *Strike with Warhammer*. That ability rolls `@chr` (Might/Agility) and nothing else. A hero who took **Firearms** at chargen and a hero who took nothing rolled the Chatterbox identically, so the four weapon skills in the action group were flavour on the sheet and nowhere in the maths.

## Benefit: +2 bonus, not an edge

RAW (`docs/raw/03-tests-power-rolls.md`, `GHOSTWIRE_SKILLS_MASTER.md`) makes a skill worth a flat **+2** on a Power Roll. Draw Steel agrees in code: its own skill dropdown does `modifiers.bonuses += 2` when you pick one (`draw-steel.mjs`, `PowerRollDialog#_refreshInputs`). So this is a **bonus**, not an edge. The Hacking path next door is an edge only because the Wired rules say edge — the two are deliberately different and should stay that way.

## Where it has to be injected

`AbilityModel#use` copies **only edges and banes** out of `config.modifiers`:

```js
dialogConfig.context.modifiers.banes   = (config.modifiers?.banes ?? 0) + (this.power.roll.banes ?? 0);
dialogConfig.context.modifiers.edges   = (config.modifiers?.edges ?? 0) + (this.power.roll.edges ?? 0);
dialogConfig.context.modifiers.bonuses ??= 0;     // <- config.modifiers.bonuses is never read
```

`config.modifiers.bonuses` is dropped on the floor. The `??=` on the third line is the opening: `dialogConfig` is `mergeObject(defaults, dialogOptions)`, so a bonus seeded on **`dialogOptions.context.modifiers.bonuses`** survives. That is the path taken, and it has a second benefit — the +2 is sitting visibly in the roll dialog's Bonus field, so the player sees where it came from and the Director can clear it at the table. Per-target rolls pick it up too (`_prepareTargets` adds `context.modifiers.bonuses` into every `combinedModifiers`).

The Hacking edge keeps using `config.modifiers` because edges *are* read from there. The two live side by side in the same `if (this.power.roll.enabled)` block of `patchWiredAbilities`.

## Mapping

Locked by Michael, not reopened here. Gear **folder** → skill:

| Folder | Skill | Note |
|---|---|---|
| `weapons/heavy/` | `heavyWeapons` | includes the two `Mounted`-tagged pieces |
| `weapons/light-firearms/`, `weapons/longarms/` | `firearms` | |
| `weapons/bows-exotic/` | `firearms` | the skill reads "conventional ranged weapons" |
| `weapons/melee/` | `melee` | **even at heavy band** — Warhammer, Slab-Hammer, Powered Greatsword |
| `weapons/thrown/` — Thermite Charge, Shaped Charge | `demolitions` | placed breaching charges |
| a gun on a deployed machine | `gunnery` | the chassis, not a gear tag |

A folder is a compendium-side fact: once a weapon is dragged onto a sheet, the folder is gone. So the rule is compiled into an explicit `_dsid` table in `scripts/weapon-skills.mjs`, and the smoke **re-derives that table from `src/packs/gear/weapons/` on every run** — the rule and the table cannot drift, and a new SKU that nobody mapped fails the smoke.

### Deliberate `null`s

`null` is a real answer, and it means "no skill backs this, so no bonus":

* **Thrown grenades** — Frag, Gasser, Firestarter, Flash-Bang, Smart Grenade, Throwing Knife. The lock names Demolitions for the two *placed charges* only; throwing a grenade is a strong arm, not a trade. **Open for Michael:** if these should be Demolitions (or Athletics), it is one line each in the table plus one line in the smoke's `SKU_OVERRIDE`.
* **Weighted Net** — flung by hand. (It also has no damage line, so B49 never arms it; the entry is there so the table stays exhaustive.)
* **Anything unmapped** — a homebrew SKU gets `null`, never a guessed skill.

### Heavy Weapons vs Gunnery

The skills master gives "mounted guns" to **Heavy Weapons** and "vehicle-mounted weapons, drone weapon systems, turret control" to **Gunnery**. The split is the chassis, not the gear: a Wallbreaker carried by a hero is Heavy Weapons; the same Wallbreaker on a deployed machine Actor (`flags.<module>.kind` `vehicle`/`drone` + `band`, stamped by `deployMachine`) is Gunnery. `isMachineActor()` is that check.

B49's arming path is `isHero`-gated today, so no vehicle hardpoint carries a spawned ability yet — the Gunnery branch is wired ahead of that path and is exercised by the smoke, not by the table. It costs nothing and it is the right answer the day S1/L1 puts a gun on a hardpoint.

## Resolution order

`weaponSkillKey(gearItem)`:

1. `flags.<module>.gear.weaponSkill` — a Director's explicit word. A string wins; `null` opts the weapon out. Homebrew gear needs no code change.
2. the gear's parent is a deployed machine → `gunnery`.
3. the `_dsid` table.
4. `null`.

## No migration pass

`buildUseAbility` now stamps `flags.<module>.weaponSkill` on the ability it spawns, as a cache. `weaponSkillBonus()` reads that flag, and when it is `undefined` — every ability armed before 0.3.102 — walks back to `fromGearId` on the same sheet and resolves from the gear. Existing worlds get the +2 on the first roll with **no** ready-hook rewrite of anybody's items. An ability whose gear is gone falls back to `+0`, and B49 deletes those anyway.

## Files

| File | Change |
|---|---|
| `scripts/weapon-skills.mjs` | **new** — the table, `weaponSkillKey`, `weaponSkillBonus`, `isMachineActor`, `WEAPON_SKILL_BONUS` |
| `scripts/equipment-use.mjs` | stamps `weaponSkill` on the spawned ability; exports `weaponSkillKey` on `module.api` |
| `scripts/module.mjs` | applies the +2 via `dialogOptions.context.modifiers.bonuses` in the `use` patch |
| `tools/g4-skill-on-weapon-smoke.mjs` | **new** — 47 checks, no live Foundry |
