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

## Rulebook

- [Stage 1 — Core Rulebook skeleton](docs/rulebook/00-STAGE1-skeleton.md) (awaiting review)
