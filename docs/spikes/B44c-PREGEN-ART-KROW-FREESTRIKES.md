> **Status 2026-09-17:** B49 is on main as `0c51fb3` (module 0.1.68). This spike is the next job. Bump to **0.1.69**. Do **not** commit `assets/sfx/` or `_incoming-art/` — copy art into `assets/pregens/`, delete `_incoming-art/`, gitignore `_incoming-art/` and `_claude-*` helper files. Rebuild packs (Foundry closed) to clear LevelDB manifest churn as part of this pass. Leave `assets/sfx/` alone (separate OGG+map pass).
# Spike B44c — Pregen art swap + delete Krow + strip Free Strikes

**Repo:** draw-steel-ghostwire (this folder)  
**Do NOT commit** until Michael Foundry-verifies.  
Bump **one** module patch from current local version (likely already 0.1.68 from B49 WIP — if B49 is uncommitted in this tree, fold into **one** combined bump; if 0.1.68 is only B49, use **0.1.69** for this spike’s delta, or keep a single uncommitted 0.1.68 that covers B49+B44c — prefer **one** version for everything currently uncommitted).

Foundry is often running against this Dropbox module path. **Close Foundry before `build-packs.mjs` / LevelDB rebuilds.** If Foundry is open, stop and tell Michael; do not fight locks.

Incoming art (already on disk — copy over assets; do not re-download):

`_incoming-art/` (delete this folder when done, and add `_incoming-art/` to `.gitignore` if not ignored):

| File | Destination |
|---|---|
| vessa-corran-dov.png | assets/pregens/vessa-corran-dov.png |
| vira-kellis-nade.png | assets/pregens/vira-kellis-nade.png |
| barak-voss-hallor.png | assets/pregens/barak-voss-hallor.png (**cyborg plate — Barak**, Michael swap; NOT Krow) |
| kaes-vahn-estal.png | assets/pregens/kaes-vahn-estal.png (Kaïs; filename stays kaes-*) |
| kessic-draye.png | assets/pregens/kessic-draye.png |
| sabbat-vane.png | assets/pregens/sabbat-vane.png |
| wren-sable-corvin.png | assets/pregens/wren-sable-corvin.png (**human / Hybrid sheet art**) |
| wren-sable-corvin-beast.png | assets/pregens/wren-sable-corvin-beast.png (**Beast form**; NEW file) |

## A — Art

1. Overwrite the seven existing PNGs from `_incoming-art/` (byte replace).  
2. Add `wren-sable-corvin-beast.png`.  
3. Wren Actor: `img` + default `prototypeToken.texture.src` = **human** portrait. Store beast path in a durable place:
   - Prefer `flags.draw-steel-ghostwire.changer.beastArt` (and optionally `humanArt`) on the Wren Actor JSON in `src/packs/pregens/wren-sable-corvin.json`.
   - If Changer form-change code already swaps token art, wire beast form to that path; otherwise set the flags + note in BUILD-NOTES that token swap on Beast form is a follow-on (art files must still land).
4. Update pregen-fiction journal pages if they embed old medallions / base64 — point at module asset paths.
5. Short note in `docs/masters/pregens/BUILD-NOTES.md`.

## B — Delete Krow entirely

Remove Operator pregen **KRV-9 / Krow** from the module:

- `src/packs/pregens/krv-9-krow.json` (+ LevelDB after rebuild)
- `assets/pregens/krv-9-krow.png`
- Fiction page / index entry in `src/packs/pregen-fiction/` and any story markdown under `docs/masters/pregens/`
- `docs/masters/pregens/ROSTER.md`, `LOADOUTS.md`, `loadouts.json`, BUILD-NOTES, generators (`tools/pregens-to-actors.mjs` etc.)
- `lang/en.json` keys under `GHOSTWIRE.Pregens` for Krow (and any orphan references)
- STATUS / FOUNDRY-BUILD-PLAN one-liners if they list eight pregens → seven

Do **not** delete the Operator class or Cyborg ancestry — only the Krow pregen Actor + fiction + roster rows.

## C — Strip Melee Free Strike + Ranged Free Strike

Michael: generics must **not** appear on newly created Heroes/NPCs. Weapon use comes from **B49** linked Fire/Use abilities only.

Local B49 WIP already exists (`scripts/equipment-use.mjs`, `scripts/data/weapon-use-templates.json`, docs). Investigation there is SoR: DS puts Free Strikes in `hero.defaultItems` with `system.category: "freeStrike"`.

### Required behavior
1. **Runtime:** On Actor create (and when DS re-adds them), remove Items that are Free Strikes — match `system.category === "freeStrike"` and/or known DS sourceIds / slugs for Melee Free Strike and Ranged Free Strike. Cover **Hero** and **NPC** (and any other types that get the generics). Do not remove class signatures, kit signatures, or B49-spawned weapon abilities.
2. **Existing sheets:** Migration on `ready` (or one-shot pack scrub) strips Free Strikes from Actors that already have them, including pregens/bestiary if embedded.
3. **Packs:** After scrub, rebuild packs with Foundry closed if LevelDB needs it.
4. Coordinate with B49: if `equipment-use.mjs` is incomplete, finish enough that pregens with weapons get Fire/Use abilities and SFX still works. If B49 is already complete locally, only add the Free Strike strip (new small module script or extend equipment-use) and register it from `module.mjs`.
5. Update `docs/directors/equipment-use-abilities.md` / B49 spike as-built: Free Strikes suppressed module-wide; weapons grant linked abilities.

## Out of scope
- Soft chrome pack gap, kit weapon:bow retags, Barak Hardshell/kit armor double-dip (already parked in LOADOUTS.md)
- Committing / pushing

## Success criteria
1. Seven heroes remain; Krow gone from packs, assets, roster, fiction, lang.
2. New portraits on Vessa, Vira, Barak (cyborg), Kaïs, Kessic, Sabbat, Wren (human); beast PNG present + flagged on Wren.
3. New Hero / NPC: no Melee/Ranged Free Strike on sheet.
4. Pregens with weapons: Fire/Use abilities present (B49); no generic Free Strikes.
5. `_incoming-art/` removed or gitignored; one module version bump; nothing committed.
6. Print Michael’s Foundry checklist when done.

