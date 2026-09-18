# Spike B54 — Creature SFX OGG pass + map

**Status:** implemented locally 2026-09-17 — Foundry-verify then commit as 0.1.72.  
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


## As-built
- Converted 6 creature WAVs + 3 leftover MP3s to mono OGG q2 @ 44.1 kHz.
- Raw moved to _sfx-raw-backup/ (gitignored).
- Extended sfx-map.json with creature / command-battlecry / command-rally / veil-reveal rules; wired-scan before wired.
- Module **0.1.72**. No commit until Michael Foundry-verifies.
