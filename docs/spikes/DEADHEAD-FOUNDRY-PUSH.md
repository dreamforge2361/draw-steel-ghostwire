# Spike — Deadhead Foundry push (SIGNED OFF)

> **Status: SHIPPED 0.3.87** — see the ship note at the top of `docs/directors/runs/deadhead/FOUNDRY-NEXT-PUSH-DEADHEAD.md`.

**Repo:** this folder (`draw-steel-ghostwire`)  
**Foundry:** closed (Michael 2026-09-21)  
**Checklist SoR:** `docs/directors/runs/deadhead/FOUNDRY-NEXT-PUSH-DEADHEAD.md`  
**Session template:** `docs/directors/runs/deadhead/DEADHEAD-SESSION-CHAPTERS.md`  
**Token queue:** `docs/directors/runs/deadhead/FOUNDRY-NEXT-TOKEN-IMPORT.md`

Ship as next patch after **0.3.86**. Open a PR (or commit+push if that is the house pattern for this tree).

## Do
1. Ensure tokens/maps under `assets/tokens/deadhead/` and `assets/maps/battlemaps/nightjar-market/` (copy from repo assets if present; convert to webp if that matches mama-club convention).
2. Align SoR markdown if stale vs Session Chapters locks, then `node tools/deadhead-to-journals.mjs` so `gwDeadheadDirJrn` matches: **5 security + 1 worker drone**, wafer in **second-to-last** car, handoff = **Nightjar Market** Scene (not a Gold Line Beat / not club-return).
3. Stamp Session Chapters as Deadhead Journal under run folder from `DEADHEAD-SESSION-CHAPTERS.md` (Meatspace/Wired READ ALOUD preserved).
4. Stamp playable L1 Actors + tokens: Iona `gwDhIonaVale000`, Rhen `gwDhRhenCalder0`, Nim `gwDhNim00000000`, plus Rack & Rest five (ids in push checklist). Follow mama-club cast / bestiary patterns.
5. Nightjar Market map asset + world Scene path/docs. Foundry order: Mama’s → Rack & Rest → Gold Line → Nightjar. No phantom Transit/Freighter Scenes.
6. Bump `module.json` past 0.3.86; rebuild touched packs with Foundry closed (`node tools/build-packs.mjs …`); run `deadhead-director-smoke.mjs` / related smokes.
7. PR with Summary + Michael smoke checklist from push doc §E.

## Never
- `{force:true}` on live Gold Line Scene
- Ritual / Street Magic (deferred)
- Optional library props (burning sedan, corpse) unless already trivial

## Done when
PR/branch ready; SoR journal no longer has old 4+Lt/R1/club-return opposition; buyer + Rack & Rest Actors exist with tokens; Nightjar art in assets; smoke pass or failures explained.
