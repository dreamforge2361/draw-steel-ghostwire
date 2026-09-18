# Spike B54 — Creature SFX OGG pass + map

**Status:** backlog (Michael dropped WAVs 2026-09-17 after B52 verify).  
**Do NOT commit WAVs raw** — compress to mono OGG like B40/0.1.70, then wire scripts/data/sfx-map.json.

## Incoming (untracked under ssets/sfx/)
- CockatriceRoar1.wav
- DemonGrowl.wav
- FemaleHarshScream.wav
- GriffonCall1.wav
- OrkBattleCry.wav
- WerewolfGrowl.wav

## Work
1. Convert each WAV → mono OGG (same encode settings as the 0.1.70 family pack).
2. Keep or delete originals per prior pattern (_sfx-raw-backup/ gitignored if kept).
3. Extend sfx-map.json with sensible keys (creature / bestiary / roar / growl / scream / battle-cry) — match B40 hook patterns; do not invent damage types.
4. Spot-play in Foundry; bump one module patch; no commit until Michael verifies.

## Out of scope
- New ability cards; B52 Technomancer work; B50 Changer art.
