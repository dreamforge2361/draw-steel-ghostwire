# Spike B103 — Bestiary + L≤4 summon portrait art

**Date:** 2026-09-19  
**Module:** **0.3.35**  
**Status:** **SHIPPED** — 40 bestiary (humanoids + ICE) + 17 L≤4 summon WebPs; Actor `img` + `prototypeToken.texture.src` + LevelDB rebuilt. Michael approved shipping (no further art review). *Pending Foundry-verify (sheet + Scene token).*  
**Pairs with:** `docs/masters/GHOSTWIRE_BESTIARY.md`, `docs/spikes/B38-BESTIARY-REVIEW-RESKIN-WAVE1.md`, `docs/spikes/B101-VEHICLE-DRONE-TOKEN-ART.md`, `docs/spikes/B102-ARMOR-WEAPON-ITEM-ART.md`

## Goal

Portrait art for **57** published Actors, named by pack slug, stamped onto **both**:

1. Actor `img` (sheet portrait)
2. The same Actor’s `prototypeToken.texture.src` (canvas token)

Then rebuild the pack(s) that changed (`bestiary` and/or `summons`). Plumbing (apply script + empty dirs) landed first; this bump ships the `gw-bestiary-portraits` pack.

**Counts:** 33 L1–4 humanoids + 1 veil-cultist + 7 wire ICE/constructs + 17 L≤4 summons = **57**.

## Source of truth

| Layer | Path | Role |
|---|---|---|
| Bestiary JSON | `src/packs/bestiary/**/<slug>.json` | **Edit here.** NPC Actors (`type: npc`). Slug = filename stem (no top-level `system._dsid`). |
| Summons JSON | `src/packs/summons/**/<slug>.json` | Same Actor shape. Elementals / spirits / sprites / nodes in scope; **not** `machines/*` band templates. |
| LevelDB | `packs/bestiary`, `packs/summons` | Compiled by `node tools/build-packs.mjs bestiary summons`. Do not hand-edit. Close Foundry first. |
| Lang | `lang/en.json` | Display names. The apply tool slugifies these as filename aliases (`Ember Companion` → `companion-ember`). |
| Vehicles / drones / gear | `assets/tokens/{drones,vehicles,armor,weapons}/` | B101 / B102. Bestiary / summons slugs live in their own folders. |

## Path convention (split by pack)

Bestiary pack Actors (humanoids + ICE) stay under `bestiary/`. Summons pack Actors go under `summons/` so a later machine-band or advanced-sprite pass does not collide with chassis tokens (B101) or this ICE set.

```text
modules/draw-steel-ghostwire/assets/tokens/bestiary/<slug>.webp
modules/draw-steel-ghostwire/assets/tokens/summons/<slug>.webp
```

On-disk staging:

```text
assets/tokens/bestiary/<slug>.webp
assets/tokens/summons/<slug>.webp
```

`<slug>` = kebab-case pack JSON filename stem (`corp-enforcer.json` → `corp-enforcer.webp`).

A flat incoming zip is fine: the tool resolves by basename. Subfolders `bestiary/` / `summons/` (or pack folders like `wire-machine/`, `elementals/`) set kind when names would otherwise be ambiguous.

## Actor update rule

Walk every in-scope Actor. For each matching WebP:

1. Set top-level `img` to the module token path for that pack.
2. Set `prototypeToken.texture.src` to the **same** path (create `texture` if missing).
3. Leave embedded Items / abilities / Active Effect icons untouched.

Sheet portrait and dropped-token art must stay identical. A WebP replace + re-run restamps both.

## Tool

```text
node tools/apply-bestiary-portrait-art.mjs --list
node tools/apply-bestiary-portrait-art.mjs
node tools/apply-bestiary-portrait-art.mjs --from _incoming-art
node tools/apply-bestiary-portrait-art.mjs --from _incoming-art --dry-run
```

`--from` copies into `assets/tokens/{bestiary,summons}/`, sets Actor `img` + `prototypeToken.texture.src`, then runs `tools/build-packs.mjs` for the packs that changed (skip with `--no-build`). Unmatched filenames fail unless `--ignore-unknown`. `_incoming-art/` is gitignored (B44c).

Replace a WebP in place, then `node tools/apply-bestiary-portrait-art.mjs` (Foundry closed) to restamp both fields and rebuild.

## Coordinator — drop the art zip

1. Close Foundry (LevelDB lock).
2. Unzip into `_incoming-art/` (flat, or `bestiary/` + `summons/` subfolders). Filename = `<slug>.webp` (see inventory).
3. Run:

```text
node tools/apply-bestiary-portrait-art.mjs --from _incoming-art
node tools/apply-bestiary-portrait-art.mjs --list
```

4. Confirm `art=yes` **and** `img-set=yes` **and** `token-set=yes` for all **57** slugs.
5. Bump `module.json` one patch only when shipping new binaries.

Alternatively, copy WebPs straight into `assets/tokens/bestiary/` and `assets/tokens/summons/`, then `node tools/apply-bestiary-portrait-art.mjs` with no `--from`.

**Shipped from `gw-bestiary-portraits.zip`:** 57 canonical `<slug>.webp` + `MANIFEST.json` in a flat folder (no zip aliases required).

## Inventory — corp security L1–4 (9)

Pack root: `src/packs/bestiary/corp-security/`. Dest: `assets/tokens/bestiary/`.

| L | Name | slug / filename | Org | Role |
|---|---|---|---|---|
| 1 | Corp Enforcer | `corp-enforcer` | leader | — |
| 1 | Corp Security Officer | `corp-security-officer` | minion | brute |
| 1 | Ironclad Commando | `ironclad-commando` | minion | ambusher |
| 1 | Ironclad Conscript | `ironclad-conscript` | minion | harrier |
| 1 | Ironclad Sharpshooter | `ironclad-sharpshooter` | minion | artillery |
| 1 | Response Lieutenant | `response-lieutenant` | leader | — |
| 2 | Ironclad Subcommander | `ironclad-subcommander` | horde | support |
| 3 | Corp Netrunner | `corp-netrunner` | platoon | controller |
| 3 | Ironclad Ground Commander | `ironclad-ground-commander` | leader | — |

## Inventory — Reach streets L1–4 (16)

Pack root: `src/packs/bestiary/reach-streets/`. Dest: `assets/tokens/bestiary/`.

| L | Name | slug / filename | Org | Role |
|---|---|---|---|---|
| 1 | Colors Boss | `colors-boss` | leader | — |
| 1 | Gang Raider | `gang-raider` | minion | harrier |
| 1 | Hustler | `hustler` | platoon | ambusher |
| 1 | Rooftop Shooter | `rooftop-shooter` | minion | artillery |
| 1 | Street Brawler | `street-brawler` | platoon | brute |
| 1 | Street Cutter | `street-cutter` | minion | ambusher |
| 1 | Street Doc | `street-doc` | platoon | support |
| 1 | Trick Shooter | `trick-shooter` | platoon | artillery |
| 1 | Wrench Rigger | `wrench-rigger` | platoon | hexer |
| 2 | Chrome Bruiser | `chrome-bruiser` | elite | brute |
| 2 | Razorline Prime | `razorline-prime` | elite | ambusher |
| 2 | Street Punk | `street-punk` | platoon | defender |
| 3 | Gang Boss | `gang-boss` | leader | — |
| 3 | The Choirmother | `the-choirmother` | leader | — |
| 3 | The Ferryman | `the-ferryman` | leader | — |
| 3 | The Warlord | `the-warlord` | leader | — |

## Inventory — rivals E1 (7)

Pack root: `src/packs/bestiary/rivals/`. Dest: `assets/tokens/bestiary/`.

| L | Name | slug / filename | Org | Role |
|---|---|---|---|---|
| 2 | Rival Commander (Echelon 1) | `rival-commander-echelon1` | elite | artillery |
| 2 | Rival Elementalist (Echelon 1) | `rival-elementalist-echelon1` | elite | controller |
| 2 | Rival Hacker (Echelon 1) | `rival-hacker-echelon1` | elite | harrier |
| 2 | Rival Operator (Echelon 1) | `rival-operator-echelon1` | elite | brute |
| 2 | Rival Scout (Echelon 1) | `rival-scout-echelon1` | elite | ambusher |
| 2 | Rival Street Priest (Echelon 1) | `rival-street-priest-echelon1` | elite | support |
| 2 | Rival Technomancer (Echelon 1) | `rival-technomancer-echelon1` | elite | hexer |

## Inventory — Veil (1)

Pack root: `src/packs/bestiary/veil-undead/`. Dest: `assets/tokens/bestiary/`. Only the humanoid cultist; undead monsters stay placeholder.

| L | Name | slug / filename | Org | Role |
|---|---|---|---|---|
| 2 | Veil Cultist | `veil-cultist` | platoon | support |

## Inventory — wire / ICE constructs (7)

Pack root: `src/packs/bestiary/wire-machine/`. Dest: `assets/tokens/bestiary/`.

| L | Name | slug / filename | Org | Role |
|---|---|---|---|---|
| 1 | Watchdog ICE | `watchdog-ice` | horde | defender |
| 3 | Scrambler ICE | `scrambler-ice` | platoon | hexer |
| 3 | Chrome Raider Armiger | `chrome-raider-armiger` | platoon | defender |
| 3 | Chrome Raider Hijack | `chrome-raider-hijack` | platoon | ambusher |
| 6 | Black ICE | `black-ice` | elite | hexer |
| 6 | Signal Mindkiller Whelp | `signal-mindkiller-whelp` | minion | hexer |
| 6 | Signal Talker Invader | `signal-talker-invader` | elite | controller |

Black ICE / Signal horrors are L6 on the DS chassis; they are **in scope** because they are the published wire-machine folder (B103 expansion), not L6 corp meatspace bosses.

## Inventory — summons L≤4 (17)

Pack root: `src/packs/summons/`. Dest: `assets/tokens/summons/`.

### Elementals (4)

| L | Name | slug / filename | Org | Role |
|---|---|---|---|---|
| 1 | Ember Companion | `companion-ember` | minion | brute |
| 1 | Zephyr Companion | `companion-zephyr` | minion | harrier |
| 1 | Boulder Companion | `companion-boulder` | minion | defender |
| 1 | Bound Elemental (Rank 1) | `elemental-rank-1` | minion | brute |

### Spirits (3)

| L | Name | slug / filename | Org | Role |
|---|---|---|---|---|
| 3 | Guardian Spirit | `spirit-guardian` | minion | defender |
| 3 | Hunter Spirit | `spirit-hunter` | minion | controller |
| 3 | Warrior Spirit | `spirit-warrior` | minion | brute |

### Sprites — minor + intermediate only (8)

| L | Name | slug / filename | Org | Role |
|---|---|---|---|---|
| 1 | Attack Sprite (Minor) | `sprite-attack-minor` | minion | harrier |
| 1 | Data Sprite (Minor) | `sprite-data-minor` | minion | hexer |
| 1 | Machine Sprite (Minor) | `sprite-machine-minor` | minion | support |
| 1 | Ward Sprite (Minor) | `sprite-ward-minor` | minion | defender |
| 4 | Attack Sprite (Intermediate) | `sprite-attack-intermediate` | minion | harrier |
| 4 | Data Sprite (Intermediate) | `sprite-data-intermediate` | minion | hexer |
| 4 | Machine Sprite (Intermediate) | `sprite-machine-intermediate` | minion | support |
| 4 | Ward Sprite (Intermediate) | `sprite-ward-intermediate` | minion | defender |

### Wired nodes (2)

| L | Name | slug / filename | Org | Role |
|---|---|---|---|---|
| 3 | Wired Node (Track 1) | `node-token-track-1` | — | — |
| 3 | Wired Node (Track 2) | `node-token-track-2` | — | — |

**Counts: 9 corp + 16 streets + 7 rivals + 1 cultist + 7 wire + 17 summons = 57 Actors.** Live check: `node tools/apply-bestiary-portrait-art.mjs --list`.

Today in-scope Actors still use Draw Steel role placeholders or generic icons on both `img` and `prototypeToken.texture.src`.

## Filename aliases the tool accepts

Primary: kebab-case pack slug. Also:

- no-hyphen forms (`corpenforcer` → `corp-enforcer`)
- localized-name slugs (`rival-commander-echelon-1`, `ember-companion`, `attack-sprite-minor`, `wired-node-track-1`)
- dropped `the-` (`choirmother` → `the-choirmother`)
- rival short forms (`rival-hacker`, `rival-hacker-e1` → `rival-hacker-echelon1`)
- ICE short forms (`watchdog` → `watchdog-ice`)
- `choir-mother` → `the-choirmother`
- `node-track-1` / `node-track-2` → the node token slugs

A file in a `bestiary/` or `summons/` (or nested pack-folder) subfolder still maps by basename; the folder selects the pack when needed.

## Out of scope

- Generating art (follow-up zip)
- Critters (`reach-critters/*`)
- Wilds beasts (`wilds-jungles/*`)
- Undead monsters (`ghost`, `ghoul`, `skeleton`, `zombie`) — **except** `veil-cultist`
- Mama Cassavir (L5)
- L6 corp bosses (`contract-enforcer`, `ironclad-warden`, `warden-krael`)
- Machine band templates (`src/packs/summons/machines/*`) — Deploy already stamps chassis Item art (B101)
- Elemental Rank 2 / Rank 3 / Greater
- Sprite `*-advanced`
- Changing stats, abilities, or SFX
- Vehicles / drones (B101) and armor / weapons (B102)

Dropped skip-list filenames fail the apply (unless `--ignore-unknown`) so a mixed zip cannot silently stamp Mama, a critter, or an advanced sprite.

## Checklist

- [x] Spike inventory + path convention + Actor `img` / token update rule
- [x] `tools/apply-bestiary-portrait-art.mjs` (slug → Actor `img` + `prototypeToken.texture.src` → `build-packs.mjs` bestiary and/or summons)
- [x] Empty `assets/tokens/bestiary/` + `assets/tokens/summons/`
- [x] WebPs attached → apply script → **0.3.35**
- [ ] Foundry-verify sheet portrait + Scene token (Corp Enforcer, Watchdog ICE, Ember Companion)
