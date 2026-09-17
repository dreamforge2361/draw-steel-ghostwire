# Spike B40 — Ability / weapon / gear SFX

**Repo:** draw-steel-ghostwire  
**Depends on:** stub `docs/directors/ability-sfx.md` (incl. Foundry core placeholders); DS 1.1.2 + module `scripts/module.mjs`.  
**Do NOT commit** until Michael Foundry-verifies.  
Bump **one** module patch.

## Goal
When a hero or NPC **uses an ability, fires a weapon, or activates gear**, play a matching sound. Configurable in module settings; per-item override; fallback keyword map. v1 ships on **Foundry core placeholder paths** (no custom wavs required). Michael swaps to `assets/sfx/` later.

## Deliverables
1. `scripts/sfx.mjs` — register settings, resolve sound, play via Foundry V14 audio API.  
2. Wire from `scripts/module.mjs` (`import` + `registerAbilitySfx()` in `init`).  
3. `src/data/sfx-map.json` (or equivalent in `scripts/data/`) — keyword / type → `src` path.  
4. Item flag schema + sheet hook for override FilePicker (reuse `renderDrawSteelItemSheet` pattern if present).  
5. Update stub status, STATUS, FOUNDRY-BUILD-PLAN.  
6. Short `docs/directors/ability-sfx.md` “as-built” section (hook used, settings keys, how to add custom files).

## Settings (module scope `draw-steel-ghostwire`)
| Key | Type | Default | Notes |
|---|---|---|---|
| `sfxEnabled` | Boolean | `true` | Master enable |
| `sfxVolume` | Number (0–1) | `0.8` | Multiplier |
| `sfxGmOnly` | Boolean | `false` | If true, only GM clients play |
| (optional) `sfxMap` | Object/JSON | from file | Advanced override of map |

Respect Foundry client mute / disable audio.

## Sound resolution order
1. Item flag `flags.draw-steel-ghostwire.sfx.src` (FilePicker path)  
2. Keyword / type map (`sfx-map.json`) from item name, type, ability keywords (`tech`, `chrome`, `wired`, Magic/Veil, firearm tags)  
3. Generic default (`sounds/notify.wav`)

### Placeholder map (core paths — do not copy into module)
Use / extend the stub table:
- pistol / smg / rifle / gun → tech placeholders (`sounds/doors/futuristic/open-fast.ogg` etc.) until custom gunshots exist  
- chrome / mechanical → `sounds/lock.wav`  
- impact / melee → `sounds/drums.wav` or combat hit ogg  
- veil / spell / magic → magic door oggs  
- wired / ICE / matrix → futuristic / forcefield  
- ui / generic → `sounds/notify.wav`

## Hook discovery (mandatory — do not guess)
On DS 1.1.2, find the real fire point by reading stock `draw-steel` + Ghostwire ability use path. Candidates to verify:
- chat message creation for ability/attack cards  
- system hooks (search `Hooks.call` / `ds.hooks` / ability use methods)  
- roll completion hooks  

Document the chosen hook in the as-built notes. Prefer one reliable hook that covers abilities and weapon attacks used from the sheet.

## Play API
Use current V14-safe play helper (`foundry.audio.AudioHelper.play` or successor). Pass `{ src, volume, loop: false }` and socket/broadcast behavior consistent with `sfxGmOnly`.

## Per-item override UX (v1 minimum)
On Item sheet render: small “Ghostwire SFX” block — FilePicker for `src`, clear button. Store under `flags.draw-steel-ghostwire.sfx`. Optional: volume override.

Crit/miss/result-band sounds are **optional** if cheap; otherwise defer.

## Out of scope
Footsteps/doors Foley; music; ASE dependency; generating audio; requiring Michael’s custom files for v1; B41.

## Done when
- Setting toggles SFX on/off; volume works.  
- Using a pregen pistol/ability plays a placeholder sound.  
- One Item with flag override plays that path instead.  
- Map covers gun / chrome / veil / wired / default families.  
- Hook documented; module patch bumped; checklist printed; **no commit**.

## Michael checklist
1. Enable SFX in module settings; use Vessa Smite or Krow weapon — hear placeholder.  
2. Toggle master enable off — silence.  
3. Set FilePicker override on one Item — that sound plays.  
4. Mute Foundry audio — no play (or respectful no-op).  
5. As-built notes name the hook used.  
6. No custom binaries required in the commit.