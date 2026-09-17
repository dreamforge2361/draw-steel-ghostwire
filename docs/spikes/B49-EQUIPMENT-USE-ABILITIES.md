# Spike B49 — Equipment → usable ability + B40 SFX

**Repo:** draw-steel-ghostwire  
**Depends on:** stub `docs/directors/equipment-use-abilities.md`; gear pack (`treasure`, kind `weapon`); B40 SFX (`createChatMessage` + `abilityUse`) — use local B40 code even if uncommitted.  
**Do NOT commit** until Michael Foundry-verifies.  
Bump **one** module patch.

## Bug (confirmed)
Gear SKUs (Chatterbox, Ghost Pistol, Longshot, …) are `type: "treasure"` with `system.kind: "weapon"` — inventory only. No ability, no advancement grant. Adding them to a Hero does nothing usable; B40 never plays.

## Goal
When a **weapon** treasure is added to an Actor, the hero gets a **usable attack ability** tied to that gear. Using it goes through Draw Steel’s normal ability use → chat `abilityUse` → **B40 SFX** (firearm map or per-ability override). Removing the gear removes the linked ability.

Armor (`kind: "armor"`) and generic `other`/trinkets: **out of scope for v1** except optional grenades if cheap.

## Investigation first (do not skip)
1. How stock **draw-steel** models weapons / free strikes / kit equipment (search system for weapon items, freeStrike, equipment). Prefer aligning to DS patterns over inventing a parallel combat system.  
2. Whether DS has a native path we should enable instead of spawning abilities.  
3. Document findings in the stub’s as-built section.

## Preferred v1 design (unless investigation finds a better DS-native path)
**Spawn linked Ability on equip:**

| Event | Behavior |
|---|---|
| `createItem` on Actor, item is GW weapon treasure | Create Ability Item on same Actor: name `Fire {WeaponName}` (or `Use {Name}`), copy attack profile from **category template**, link flags |
| `deleteItem` / treasure removed | Delete linked ability (match by flag) |
| Duplicate add | Do not double-spawn; idempotent |

### Flags
On treasure: `flags.draw-steel-ghostwire.useAbilityId` = ability `_id`  
On ability: `flags.draw-steel-ghostwire.fromGearId` = treasure `_id`  
On ability SFX: `flags.draw-steel-ghostwire.sfx.src` optional; else B40 map matches ability name (`Fire Chatterbox` → firearm rule)

### Attack profile templates
Maintain category → ability template (compendium abilities under `abilities` or data in `scripts/data/weapon-use-templates.json`):

| Gear folder / category heuristic | Template intent |
|---|---|
| `weapons/light-firearms` | Ranged strike, pistol band |
| `weapons/longarms` | Ranged strike, rifle band |
| `weapons/heavy` | Ranged strike, heavy/suppressive band |
| melee blades / knuckles | Melee strike band |
| grenades (if `kind`/`name` matches) | Area / thrown — only if template is easy |

Pull concrete distance/damage **from Draw Steel free-strike / kit signature bands** already used in Ghostwire (Gunslinger / Warframe / Longshot signatures are references — **do not paste MCDM prose**). Prefer numbers already in GW kit signatures or RAW weapon tables.

If treasure description lang strings encode damage, may parse later — **v1 templates by folder are enough**.

### Implementation sketch
- `scripts/equipment-use.mjs` — register hooks; `registerEquipmentUse()` from `module.mjs` init.  
- Templates: either silent compendium Abilities (`src/packs/abilities/equipment-use/…`) or JSON cloned onto the actor.  
- Only actors of hero/character type (not every NPC unless easy — **heroes required**; NPC nice-to-have).  
- Existing pregens: optional migration hook on `ready` to grant missing use-abilities for weapons already on sheets (Vessa Workhorse, Krow Chopper, etc.).

## SFX
Confirm using the new ability plays B40 firearm (or correct family) sound. FilePicker override on the **ability** sheet still works.

## Docs
- Update stub status + as-built (hook chosen, template table, flags).  
- STATUS / FOUNDRY-BUILD-PLAN: B49 spike → pending verify.  
- Note for gear authors: adding a weapon SKU under the right folder opts into a use-ability automatically.

## Out of scope (v1)
Armor “don” abilities; full chrome activation suite; rewriting all 49 weapon treasures into DS weapon documents; ASE VFX; inventing Soft chrome.

## Done when
- Drop Chatterbox on a Hero → `Fire Chatterbox` (or equivalent) appears and is usable.  
- Use it → chat abilityUse → B40 sound.  
- Delete Chatterbox → ability gone.  
- Pregen with existing guns gets use-abilities (migration or rebuild note).  
- Checklist printed; **no commit**.

## Michael checklist
1. Fresh hero or pregen: add Chatterbox → fire ability on sheet.  
2. Use it — hear B40 firearm placeholder (if B40 enabled).  
3. Remove Chatterbox — ability removed.  
4. Longshot / pistol from other folders get appropriate templates.  
5. No duplicate abilities on reload.  
6. As-built notes name DS investigation result + approach taken.