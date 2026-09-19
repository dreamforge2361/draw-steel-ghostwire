# Spike B102 — Armor + weapon item art

**Date:** 2026-09-19  
**Module:** **0.3.31** (plumbing only — no bump)  
**Status:** **PLUMBING** — apply script + empty `assets/tokens/{armor,weapons}/`. WebPs + one patch wait for the art-zip follow-up.  
**Pairs with:** `docs/masters/GHOSTWIRE_GEAR_MASTER.md`, `docs/masters/pregens/loadouts.json`, `docs/spikes/B101-VEHICLE-DRONE-TOKEN-ART.md`

## Goal

Portrait art for every published armor (including shields) and weapon Item, named by pack `_dsid`, stamped onto:

1. Ghostwire Gear pack Item `img` fields under `src/packs/gear/armor/**` and `src/packs/gear/weapons/**`
2. Matching **embedded** treasure Items on the seven pregen Heroes (`src/packs/pregens/**`)

Then rebuild `packs/gear` + `packs/pregens`. Generate is **not** this ticket — another agent drops WebPs; this ticket is the path convention + apply tool.

## Source of truth

| Layer | Path | Role |
|---|---|---|
| JSON sources | `src/packs/gear/armor/**`, `src/packs/gear/weapons/**` | **Edit here.** Item documents (`type: treasure`) with `system._dsid` and top-level `img`. |
| LevelDB | `packs/gear` | Compiled by `node tools/build-packs.mjs gear`. Do not hand-edit. Close Foundry first. |
| Pregens | `src/packs/pregens/*.json` | Heroes store a **full copy** of each loadout Item on `items[]` (`type: treasure`, same `_dsid` / `_id` as the gear SKU). The Equipment tab displays the **embedded** `img`, not a live Compendium UUID. Armor Active Effects that still show the old item icon are restamped when they match the previous `img`. |
| Pregen generator | `tools/pregens-to-actors.mjs` + `docs/masters/pregens/loadouts.json` | Regenerating pregens copies `img` from the gear JSON. Apply gear first (or re-run this tool after a regen). |
| General gear / chrome / foci / kits | `src/packs/gear/general/**`, `chrome`, kits | **Out of scope.** Only armor + weapons (+ shields). Wren’s Longshot **kit** shares `_dsid` `longshot` with the rifle — the tool updates `type: treasure` only. |
| Vehicles / drones | `assets/tokens/{drones,vehicles}/` | B101. Firearm `workhorse.webp` does **not** collide with crewed van `vehicles/workhorse.webp`. |

Foundry `img` convention (module-relative, same family as B101):

```text
modules/draw-steel-ghostwire/assets/tokens/armor/<dsid>.webp
modules/draw-steel-ghostwire/assets/tokens/weapons/<dsid>.webp
```

On-disk staging:

```text
assets/tokens/armor/<dsid>.webp
assets/tokens/weapons/<dsid>.webp
```

`<dsid>` = `system._dsid` = kebab-case filename stem. **Shields file under `armor/`.**

## Pregen update rule

Walk every Actor in `src/packs/pregens/**`. For each embedded Item:

1. Require `type === "treasure"` (inventory / Equipment tab — what the sheet actually shows).
2. Match `system._dsid` to the armor/weapon catalog, **or** slugify the localized `name` and match that.
3. If a WebP exists for that dsid, set `item.img` to the module token path. Effects whose `img` equals the previous item `img` are kept in sync.
4. Leave general gear, chrome, foci, kits, abilities, and class features untouched — even when a kit dsid collides (`longshot`).

Live embeds today (from `loadouts.json` / packed Actors):

| Pregen | Armor | Weapons |
|---|---|---|
| Vessa Corran-Dov | `hardshell` | `workhorse`, `street-blade` |
| Kaïs Vahn-Estal | — (Hexshot / no armor) | `zapper`, `sleeve-gun` |
| Barak Voss-Hallor | `hardshell` | `chatterbox`, `knuckles` |
| Wren Sable-Corvin | `armored-jacket` | `longshot`, `popper` |
| Sabbat Vane | `secure-threads` | `popper` |
| Vira Kellis-Nade | `secure-threads` | `popper` |
| Kessic Draye | `secure-threads` | `sleeve-gun` |

## Tool

```text
node tools/apply-gear-token-art.mjs --list
node tools/apply-gear-token-art.mjs
node tools/apply-gear-token-art.mjs --from _incoming-art
node tools/apply-gear-token-art.mjs --from _incoming-art --dry-run
```

`--from` copies into `assets/tokens/{armor,weapons}/`, sets gear + pregen `img`, then runs `tools/build-packs.mjs gear pregens` (skip with `--no-build`). Unmatched filenames fail unless `--ignore-unknown`. `_incoming-art/` is gitignored (B44c).

Replace a WebP in place, then `node tools/apply-gear-token-art.mjs` (Foundry closed) to restamp `img` and rebuild both packs.

## Coordinator — drop the art zip

1. Close Foundry (LevelDB lock).
2. Unzip into `_incoming-art/` with `armor/` + `weapons/` subfolders. Shields go in `armor/` (a `shields/` folder is also accepted and maps to armor). Flat folder: pass `--kind armor` or `--kind weapons`.
3. Filename = `<dsid>.webp` (see inventory). Aliases: no-hyphen forms, `flash-bang` → `flash-bang-3e`, `dragon-breath` → `dragons-breath`, `streetsweeper` → `streetsweeper-smg`.
4. Run:

```text
node tools/apply-gear-token-art.mjs --from _incoming-art
node tools/apply-gear-token-art.mjs --list
```

5. Confirm `art=yes` for **22** armor/shields + **49** weapons, and the seven pregen columns above. `module.json` stays **0.3.31** until this follow-up ships the binaries + one patch.

Alternatively, copy WebPs straight into `assets/tokens/armor/` and `assets/tokens/weapons/`, then `node tools/apply-gear-token-art.mjs` with no `--from`.

## Inventory — armor + shields (22)

Module img: `modules/draw-steel-ghostwire/assets/tokens/armor/<dsid>.webp`. Pack root: `src/packs/gear/armor/`.

### Light (5)

| E | Name | `_dsid` / filename | Pack folder |
|---|---|---|---|
| 1 | Armored Jacket | `armored-jacket` | light |
| 1 | Secure Threads | `secure-threads` | light |
| 2 | Synth-Leather Duster | `synth-leather-duster` | light |
| 3 | Second-Skin | `second-skin` | light |
| 4 | Whisperweave | `whisperweave` | light |

### Medium (5)

| E | Name | `_dsid` / filename | Pack folder |
|---|---|---|---|
| 1 | Armor Vest | `armor-vest` | medium |
| 1 | Plated Jacket | `plated-jacket` | medium |
| 2 | Riot Layer | `riot-layer` | medium |
| 3 | Corp-Sec Hardweave | `corp-sec-hardweave` | medium |
| 4 | Ghostplate | `ghostplate` | medium |

### Heavy (5)

| E | Name | `_dsid` / filename | Pack folder |
|---|---|---|---|
| 1 | Hardshell | `hardshell` | heavy |
| 1 | Security Rig | `security-rig` | heavy |
| 2 | Milspec Battledress | `milspec-battledress` | heavy |
| 3 | Powered Hardsuit | `powered-hardsuit` | heavy |
| 4 | Juggernaut | `juggernaut` | heavy |

### Sealed (4)

| E | Name | `_dsid` / filename | Pack folder |
|---|---|---|---|
| 1 | Flashweave | `flashweave` | sealed |
| 2 | Faraday Suit | `faraday-suit` | sealed |
| 3 | Sealed Armor | `sealed-armor` | sealed |
| 4 | HE Combat Suit | `he-combat-suit` | sealed |

### Shields (3) — still `assets/tokens/armor/<dsid>.webp`

| E | Name | `_dsid` / filename | Pack folder |
|---|---|---|---|
| 1 | Riot Shield | `riot-shield` | shields |
| 2 | Ballistic Board | `ballistic-board` | shields |
| 4 | Smart-Shield | `smart-shield` | shields |

## Inventory — weapons (49)

Module img: `modules/draw-steel-ghostwire/assets/tokens/weapons/<dsid>.webp`. Pack root: `src/packs/gear/weapons/`.

### Bows / exotic (7)

| E | Name | `_dsid` / filename | Pack folder |
|---|---|---|---|
| 1 | Hand-Crossbow | `hand-crossbow` | bows-exotic |
| 1 | Net-Gun | `net-gun` | bows-exotic |
| 1 | Street-Bow | `street-bow` | bows-exotic |
| 2 | Dart-Gun | `dart-gun` | bows-exotic |
| 2 | Heavy Crossbow | `heavy-crossbow` | bows-exotic |
| 2 | Hunting Bow | `hunting-bow` | bows-exotic |
| 4 | Gauss Needler | `gauss-needler` | bows-exotic |

### Heavy (7)

| E | Name | `_dsid` / filename | Pack folder |
|---|---|---|---|
| 2 | Chatterbox | `chatterbox` | heavy |
| 3 | Dragon's Breath | `dragons-breath` | heavy |
| 3 | Grease-Gun | `grease-gun` | heavy |
| 3 | Hand-of-God | `hand-of-god` | heavy |
| 3 | Wallbreaker | `wallbreaker` | heavy |
| 4 | Siege Missile | `siege-missile` | heavy |
| 4 | Tank-Cracker | `tank-cracker` | heavy |

### Light firearms (9)

| E | Name | `_dsid` / filename | Pack folder |
|---|---|---|---|
| 1 | Hand-Cannon | `hand-cannon` | light-firearms |
| 1 | Popper | `popper` | light-firearms |
| 1 | Sleeve-Gun | `sleeve-gun` | light-firearms |
| 1 | Workhorse | `workhorse` | light-firearms |
| 1 | Zapper | `zapper` | light-firearms |
| 2 | Buzz-Gun | `buzz-gun` | light-firearms |
| 2 | Chatter | `chatter` | light-firearms |
| 3 | Streetsweeper SMG | `streetsweeper-smg` | light-firearms |
| 4 | Ghost Pistol | `ghost-pistol` | light-firearms |

### Longarms (9)

| E | Name | `_dsid` / filename | Pack folder |
|---|---|---|---|
| 1 | Boomstick | `boomstick` | longarms |
| 1 | Brush-Gun | `brush-gun` | longarms |
| 1 | Chopper | `chopper` | longarms |
| 2 | Autoshotgun | `autoshotgun` | longarms |
| 2 | Longshot | `longshot` | longarms |
| 2 | Streetline Carbine | `streetline-carbine` | longarms |
| 3 | Milspec Battle Rifle | `milspec-battle-rifle` | longarms |
| 3 | Whisper Rifle | `whisper-rifle` | longarms |
| 4 | Apex Rifle | `apex-rifle` | longarms |

### Melee (9)

| E | Name | `_dsid` / filename | Pack folder |
|---|---|---|---|
| 1 | Knuckles | `knuckles` | melee |
| 1 | Machete | `machete` | melee |
| 1 | Shock-Stick | `shock-stick` | melee |
| 1 | Street-Blade | `street-blade` | melee |
| 2 | Monoblade | `monoblade` | melee |
| 3 | Cyber-Spur | `cyber-spur` | melee |
| 3 | Warhammer | `warhammer` | melee |
| 4 | Monowhip | `monowhip` | melee |
| 4 | Powered Greatsword | `powered-greatsword` | melee |

### Thrown (8)

| E | Name | `_dsid` / filename | Pack folder |
|---|---|---|---|
| 1 | Firestarter | `firestarter` | thrown |
| 1 | Flash-Bang | `flash-bang-3e` | thrown |
| 1 | Frag | `frag` | thrown |
| 1 | Gasser | `gasser` | thrown |
| 1 | Throwing Knife | `throwing-knife` | thrown |
| 2 | Thermite Charge | `thermite-charge` | thrown |
| 3 | Shaped Charge | `shaped-charge` | thrown |
| 4 | Smart-Grenade | `smart-grenade` | thrown |

**Counts: 22 armor/shields + 49 weapons = 71 Items.** Live check: `node tools/apply-gear-token-art.mjs --list`.

## Filename aliases the tool accepts

Primary: kebab-case `_dsid`. Also: no-hyphen forms (`armoredjacket` → `armored-jacket`), localized-name slugs (`flash-bang` → `flash-bang-3e` because the pack name is “Flash-Bang”), `dragon-breath` → `dragons-breath`, `streetsweeper` → `streetsweeper-smg`. A file in a `shields/` folder is armor.

**Collision with B101:** pistol `workhorse` stages at `assets/tokens/weapons/workhorse.webp`. The van stays `assets/tokens/vehicles/workhorse.webp`.

## Out of scope

- Generating or committing WebP binaries
- General gear, chrome, foci, kit portraits
- Bumping `module.json` (follow-up when art ships)
- Changing equipment-use abilities or SFX
- Vehicles / drones (B101)

## Checklist

- [x] Spike inventory + path convention + pregen update rule
- [x] `tools/apply-gear-token-art.mjs` (slug → gear Item `img` → pregen embeds → `build-packs.mjs gear pregens`)
- [x] Empty `assets/tokens/armor/` + `assets/tokens/weapons/` (`.gitkeep`)
- [ ] WebPs attached → apply script → one patch bump → Foundry-verify Equipment tab on a pregen + Gear pack
