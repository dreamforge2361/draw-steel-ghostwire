# B121 — Twelve Conglomerates (AEQ + LAZ)

**Date:** 2026-09-20  
**Module:** 0.3.76  
**Status:** LOCKED (Michael names 2026-09-20)

Charter Age seated **the Ten**. Current play seats **the Twelve**. Tickers: `docs/rulebook/MEGACORP-TICKERS.md`. Profiles: L1 Conglomerate Profiles. Lifestyle extract: `docs/raw/26-lifestyle-downtime.md`.

| # | Ticker | Name | Domain |
|---|---|---|---|
| 1–10 | HAL…NYX | (Charter Ten — unchanged) | see MEGACORP-TICKERS |
| 11 | **AEQ** | Aequitas Mandate | Council justice / investigation / security. **Sells only to the Council.** |
| 12 | **LAZ** | Lazarus Extract | Trauma rescue / hot extract / body recovery. Lifestyle band includes contract tier. |

## Locks

- **AEQ Council-only.** Client = Congress / Chair / pooled authority of the Conglomerates. Forbidden: private parties, runners, gangs, a single mega acting alone. Not Ironclad (open-market PMC), not Aureole (HALO army), not Sanctum / Grey Ledger (surveillance and private law).
- **LAZ Lifestyle bundle.** Upkeep ¥ for a band includes that band’s Lazarus tier. No separate ¥ unless a premium rider. Not Caduceus (clinics / chrome-flesh).
- **Kestrel** stays seatless — the thirteenth-chair climber. Do not give it a ticker seat.
- **Art:** Michael plates shipped **0.3.76**. `brand-aeq` / `brand-laz` and `node-host-aeq` / `node-host-laz` (PNG 1254² + 1024² WebP). Host catalog rows `placeholder: false`.

## Sub-corps (house style)

| Parent | Sub-corp | Role |
|---|---|---|
| AEQ | **Writ Inquest** | Investigation — the file, the warrant, the procedure |
| AEQ | **Seal Wardens** | Security response — the badge that arrives when the Council names a disorder |
| LAZ | **White Door Flight** | Crash / VTOL trauma teams — the extract that kicks the door |

## Adjacent locks (same pass)

- **Pet Stamina:** sprites, Agents, and independent spirits use ordinary Stamina. Extension spirits have no separate pool (`22`, `19`, `20`).
- **Construct Wire visibility:** same-scene Wire + both compilers Overlay/Jacked In → sprites/Agents auto-see each other; no Scan tax; meat tokens are not Wire eyes (`21`).
- **Constructs Console (Lock A):** separate Console section from the node graph. Foundry UI later; RAW/Director note in `21` / `18-wired-foundry.md`.

## Voidmark

Council-only and Lifestyle→LAZ tiers must retrieve from L1, MEGACORP-TICKERS, RAW `26`, and the glossary. Rebuild: `node tools/build-voidmark-index.mjs`.

## Smoke

`node tools/twelve-conglomerates-smoke.mjs`  
`node tools/ten-conglomerates-art-smoke.mjs` (Twelve roster; AEQ/LAZ plates ship)
