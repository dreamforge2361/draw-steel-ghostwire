# Spike B38 — Ghostwire Bestiary: DS review + reskin wave 1

**Repo:** draw-steel-ghostwire  
**Do NOT commit or push.** Leave ready for Michael to Foundry-verify.  
**Bump** module.json one patch from current (read disk; was 0.1.49).

## Doctrine (LOCKED)
- **Reskin first:** Keep DS mechanics/stats as the spine; rewrite name + description (+ light number tweaks only if fiction requires).
- **Artwork / token pass later** — placeholder DS art or generic icons.
- Pack ships **only** reviewed Keep/Adapt entries — never dump the whole stock monsters pack.
- Inventory dump: `docs/masters/GHOSTWIRE_BESTIARY_DS_INVENTORY.md` (**483** Actors from `systems/draw-steel/packs/monsters`).

## Part A — Review pass
1. Fill **Decision** on every row in `GHOSTWIRE_BESTIARY_DS_INVENTORY.md`: `Keep` | `Adapt` | `Skip` | `Defer-hazard`.
2. For Keep/Adapt, propose **Ghostwire name** + Notes (region: Reach streets / corp / Wire / Veil / jungles / other).
3. Guidance: Keep Humans, Rivals, War Dogs, Time Raiders, Voiceless Talkers, Undead, Devils, Retainers, tech-ish Mechanisms; Adapt fantasy Peoples-analogues with hard renames; Skip or Defer-hazard pure mythic / dungeon terrain for later.
4. Claude proposes the full table; Michael corrects on verify.
5. Update `docs/masters/GHOSTWIRE_BESTIARY.md` with Keep/Adapt/Skip counts + Wave 1 list.

## Part B — Pack scaffold
New Actor pack `bestiary` — label “Ghostwire Bestiary”. Folders: Reach Streets, Corp & Security, Wire & Machine, Veil & Undead, Wilds & Jungles, Rivals. 16-char ids; rebuild via `tools/build-packs.mjs`.

## Part C — Reskin wave 1 (20–40 Actors)
Clone + reskin Keep/easy-Adapt from DS monsters into `src/packs/bestiary/`. Priority: Human street/corp muscle; Rivals; War Dogs slice; Undead slice; Time Raider / Voiceless samples; 2–4 wild fauna renames. Flags: `flags.draw-steel-ghostwire.bestiary = { dsSourceId, dsSourceName, decision, region }`. Keep system stats + embedded abilities; GW name/biography/lang keys. Placeholder art OK.

## Part D — Docs
FOUNDRY-BUILD-PLAN + STATUS: B38 Wave 1 pending Foundry verification.

## Out of scope
Full art pass; greenfield originals wave; importing entire DS pack; commit/push.

## Done when
Full Decision column; bestiary pack with 20+ reskins; Scene drag works; docs pending verify; no commit.

## Foundry test checklist (print when finished)
1. Ghostwire Bestiary shows folders + wave 1 Actors.
2. Spot-check 3: GW fiction, DS math intact.
3. Place Rival + street muscle on Scene.
4. No unreviewed stock names in GW pack.
5. Master shows Keep/Adapt/Skip counts.

## Follow-ons (do not do in B38)
- **B38b** Handbook originals Wave 2 — `docs/spikes/B38b-BESTIARY-ORIGINALS-WAVE2.md`.
- **B39** Run Generator — `docs/directors/run-generator.md`.
- Wilds: only light DS renames in Wave 1; Pandora-like wilds lore later. Handbook seeds Canopy-Stalker / Reach Behemoth wait for B38b.
