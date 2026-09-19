# Spike B103 — Bestiary humanoid portrait art

**Date:** 2026-09-19  
**Module:** **0.3.32** (plumbing only — no bump)  
**Status:** **PLUMBING** — apply script + empty `assets/tokens/bestiary/`. WebPs + one patch wait for the art-zip follow-up.  
**Pairs with:** `docs/masters/GHOSTWIRE_BESTIARY.md`, `docs/spikes/B38-BESTIARY-REVIEW-RESKIN-WAVE1.md`, `docs/spikes/B101-VEHICLE-DRONE-TOKEN-ART.md`, `docs/spikes/B102-ARMOR-WEAPON-ITEM-ART.md`

## Goal

Portrait art for the **33** published L1–4 corp / gang / E1 rival humanoids (plus the Veil Cultist), named by pack slug, stamped onto **both**:

1. Ghostwire Bestiary Actor `img` (sheet portrait)
2. The same Actor’s `prototypeToken.texture.src` (canvas token)

Then rebuild `packs/bestiary`. Generate is **not** this ticket — another agent drops WebPs; this ticket is the path convention + apply tool.

Art arrives in a follow-up zip. This PR only builds the apply path.

## Source of truth

| Layer | Path | Role |
|---|---|---|
| JSON sources | `src/packs/bestiary/**/<slug>.json` | **Edit here.** NPC Actors (`type: npc`). Slug = filename stem (Actors have no top-level `system._dsid`). |
| LevelDB | `packs/bestiary` | Compiled by `node tools/build-packs.mjs bestiary`. Do not hand-edit. Close Foundry first. |
| Lang | `lang/en.json` → `GHOSTWIRE.Bestiary.Actors.<Id>.Name` | Display names. The apply tool slugifies these as filename aliases. |
| Vehicles / drones / gear | `assets/tokens/{drones,vehicles,armor,weapons}/` | B101 / B102. Bestiary slugs do not collide with those folders. |

Foundry path convention (module-relative, same family as B101 / B102):

```text
modules/draw-steel-ghostwire/assets/tokens/bestiary/<slug>.webp
```

On-disk staging:

```text
assets/tokens/bestiary/<slug>.webp
```

`<slug>` = kebab-case pack JSON filename stem (`corp-enforcer.json` → `corp-enforcer.webp`).

## Actor update rule

Walk every in-scope Actor in `src/packs/bestiary/**`. For each matching WebP:

1. Set top-level `img` to the module token path.
2. Set `prototypeToken.texture.src` to the **same** path (create `texture` if missing).
3. Leave embedded Items / abilities / Active Effect icons untouched — those stay gear / DS role icons until a later pass.

Sheet portrait and dropped-token art must stay identical. A WebP replace + re-run restamps both.

## Tool

```text
node tools/apply-bestiary-portrait-art.mjs --list
node tools/apply-bestiary-portrait-art.mjs
node tools/apply-bestiary-portrait-art.mjs --from _incoming-art
node tools/apply-bestiary-portrait-art.mjs --from _incoming-art --dry-run
```

`--from` copies into `assets/tokens/bestiary/`, sets Actor `img` + `prototypeToken.texture.src`, then runs `tools/build-packs.mjs bestiary` (skip with `--no-build`). Unmatched filenames fail unless `--ignore-unknown`. `_incoming-art/` is gitignored (B44c).

Replace a WebP in place, then `node tools/apply-bestiary-portrait-art.mjs` (Foundry closed) to restamp both fields and rebuild `packs/bestiary`.

## Coordinator — drop the art zip

1. Close Foundry (LevelDB lock).
2. Unzip into `_incoming-art/` (flat, or a `bestiary/` subfolder). Filename = `<slug>.webp` (see inventory).
3. Run:

```text
node tools/apply-bestiary-portrait-art.mjs --from _incoming-art
node tools/apply-bestiary-portrait-art.mjs --list
```

4. Confirm `art=yes` **and** `img-set=yes` **and** `token-set=yes` for all **33** slugs.
5. Bump `module.json` one patch only in that follow-up (not this PR).

Alternatively, copy WebPs straight into `assets/tokens/bestiary/`, then `node tools/apply-bestiary-portrait-art.mjs` with no `--from`.

## Inventory — corp security L1–4 (9)

Pack root: `src/packs/bestiary/corp-security/`. Module img: `modules/draw-steel-ghostwire/assets/tokens/bestiary/<slug>.webp`.

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

Pack root: `src/packs/bestiary/reach-streets/`.

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

Pack root: `src/packs/bestiary/rivals/`.

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

Pack root: `src/packs/bestiary/veil-undead/`. Only the humanoid cultist; undead monsters stay placeholder.

| L | Name | slug / filename | Org | Role |
|---|---|---|---|---|
| 2 | Veil Cultist | `veil-cultist` | platoon | support |

**Counts: 9 corp + 16 streets + 7 rivals + 1 cultist = 33 Actors.** Live check: `node tools/apply-bestiary-portrait-art.mjs --list`.

Today every in-scope Actor still uses a Draw Steel role placeholder (`systems/draw-steel/assets/roles/*.webp`) on both `img` and `prototypeToken.texture.src`.

## Filename aliases the tool accepts

Primary: kebab-case pack slug. Also:

- no-hyphen forms (`corpenforcer` → `corp-enforcer`)
- localized-name slugs (`rival-commander-echelon-1` from “Rival Commander (Echelon 1)”)
- dropped `the-` (`choirmother` → `the-choirmother`)
- rival short forms (`rival-hacker`, `rival-hacker-e1`, `rival-hacker-echelon-1` → `rival-hacker-echelon1`)
- `choir-mother` → `the-choirmother`

A file in a `bestiary/` (or nested pack-folder) subfolder still maps by basename.

## Out of scope

- Generating art (follow-up zip)
- Critters (`reach-critters/*`)
- Wilds beasts (`wilds-jungles/*`)
- Wire ICE / chrome raiders (`wire-machine/*`)
- Undead monsters (`ghost`, `ghoul`, `skeleton`, `zombie`) — **except** `veil-cultist`
- Mama Cassavir (L5)
- L6 corp bosses (`contract-enforcer`, `ironclad-warden`, `warden-krael`)
- Changing stats, abilities, or SFX
- Vehicles / drones (B101) and armor / weapons (B102)

Dropped skip-list filenames fail the apply (unless `--ignore-unknown`) so a mixed zip cannot silently stamp Mama or a critter.

## Checklist

- [x] Spike inventory + path convention + Actor `img` / token update rule
- [x] `tools/apply-bestiary-portrait-art.mjs` (slug → Actor `img` + `prototypeToken.texture.src` → `build-packs.mjs bestiary`)
- [x] Empty `assets/tokens/bestiary/`
- [ ] WebPs attached → apply script → one patch bump
- [ ] Foundry-verify sheet portrait + Scene token (Corp Enforcer + Rival Hacker + Street Doc)
