# B86 — Deadfall / dark-zone sector module (BACKLOG)

**Date:** 2026-09-19  
**Status:** BACKLOG — not started  
**Delivery:** **Separate Foundry module** (not shipped inside draw-steel-ghostwire core)

## Ask
Build **Deadfall** (and the associated dark zone) as a **standalone Foundry module** that **connects to / depends on** *Draw Steel - Ghostwire Build*, adding a **massive dungeon-like** sector into the game: sector map(s), scenes, and supporting content without bloating the core module.

## Module shape (LOCKED intent)
- **New package** e.g. draw-steel-ghostwire-deadfall (name TBD with Michael)
- **
elationships.requires:** draw-steel-ghostwire (+ stock draw-steel as today)
- Optional: soft-require or recommend the Ghostwire world / Reach handbook packs
- Ships: sector overview map, high-res battle/crawl surfaces (**no downscale**), scenes, journals, maybe encounters — all Deadfall-scoped
- Core Ghostwire module stays Reach/Flats/general; Deadfall is opt-in content

## Lore hooks (existing — do not invent against L1)
- **Deadfall Nine / "the Quiet Floor"** — corrupted thin place; dead **FER** foundation in the **Sinks**
- Wider Sinks dark-zone ecology for the mega-dungeon

Confirm labels/bounds with Michael before art lock.

## Deliverables when picked up
1. New module repo or package folder + module.json dependency on Ghostwire
2. Sector overview map + optional keyed sub-sector play surfaces
3. World/scene wiring docs: how to enable alongside Ghostwire
4. Spike for crawl procedure (rest, corruption pressure, FER Deepworks residue) — may live in the Deadfall module docs

## Constraints
- ART-STYLE.md; Ghostwire AI art credit
- B78/B83: no external-IP name-checks; B84 tickers when corps appear (**FER**)
- Native resolution for play surfaces (B72 policy)

## Non-goals yet
Merging Deadfall assets into core draw-steel-ghostwire; full room-by-room key for every level; Corruption track automation (B80).
