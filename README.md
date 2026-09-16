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

## Building packs

Pack sources live in `src/packs/<pack>/*.json`. Names and descriptions are `GHOSTWIRE.*` lang keys, filled in from `lang/en.json` at build time. With Foundry closed, run `node tools/build-packs.mjs` to rebuild `packs/`. It uses the `classic-level` package bundled with Foundry; set `FOUNDRY_APP` if Foundry isn't installed in the default location.

## Rulebook

- [Stage 1 — Core Rulebook skeleton](docs/rulebook/00-STAGE1-skeleton.md) (awaiting review)
