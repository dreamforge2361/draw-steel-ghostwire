# B40 — Ability / weapon / gear sound effects (backlog)

**Status:** Backlog locked 2026-09-17 — design stub only.  
**Depends on:** Stable ability use hooks (Draw Steel + Ghostwire items); Michael supplies sound assets.  
**Do NOT implement until Michael prioritizes** (after B38c firearms pass / bestiary verify is a natural time).

## Goal
When a hero or NPC **uses an ability, fires a weapon, or activates gear**, play a matching sound (gunshot, laser, spell cast, chrome whir, ICE bite, etc.). Bring the Reach to life without requiring manual playlist clicks.

## UX
1. **Module settings** (Configure Settings → Draw Steel - Ghostwire Build):
   - Master enable: `Enable ability/weapon SFX` (default on for GM, respect client mute / Foundry audio).
   - Volume slider (or use Foundry playlists volume).
   - Optional: “Play for GM only” vs “All clients who can hear the speaker.”
2. **Per-item / per-ability override** (Item sheet or ability config):
   - Sound path (FilePicker) or pack key from a Ghostwire SFX library.
   - Optional sound for crit / miss / power-roll tier if cheap.
3. **Fallback table** in settings or `src/data/sfx-map.json`: map by keywords / item type / ability category (e.g. `pistol` → `sounds/guns/pistol-01.ogg`, `laser` → `…`, `spell` / Veil → `…`).

## Asset pipeline
- Michael provides files (ogg/webm preferred for Foundry).
- Land under `modules/draw-steel-ghostwire/assets/sfx/` (guns, energy, chrome, veil, wire, ui).
- Document naming convention in this file when assets arrive.
- Do **not** commit huge binaries without Michael OK; optional Git LFS later.

## Implementation sketch
- Hook Draw Steel ability use / attack roll (confirm exact hook on DS 1.1.2 — hypothesis: ability use chat message or system hook; verify, don’t guess in code).
- `scripts/sfx.mjs` — resolve sound from item flag → type map → default; `foundry.audio.AudioHelper.play` (or current V14 API).
- Flags: `flags.draw-steel-ghostwire.sfx = { src, volume?, exclusive? }`.
- Respect Foundry “Disable audio” and per-client settings.

## Out of scope (v1)
Full Foley for footsteps/doors; music stingers; Animated Spell Effects dependency; auto-generating sounds.

## Done when (future spike)
Settings toggle works; sample pistol + laser + one Veil ability play on use; override on one Item; docs + STATUS; Foundry-verify; no commit until Michael says.

## Foundry core placeholders (testing until custom pack)
Reference root-relative core paths — do **not** copy into the module. Swap to `modules/draw-steel-ghostwire/assets/sfx/` when Michael’s files land.

| Keyword family | Placeholder `src` |
|---|---|
| Generic / UI | `sounds/notify.wav` |
| Mechanical / chrome click | `sounds/lock.wav` |
| Impact / heavy hit | `sounds/drums.wav` or `sounds/combat/epic-turn-1hit.ogg` |
| Tech / laser-ish | `sounds/doors/futuristic/open-fast.ogg`, `…/open-forcefield.ogg` |
| Spell / Veil | `sounds/doors/magic/door-open.ogg`, `…/wall-open.ogg` |
| Industrial | `sounds/doors/industrial/open.ogg`, `sounds/doors/metal/heavy-sliding-open.ogg` |

Core Foundry does **not** ship gunshots — pistols/SMGs/rifles stay on tech placeholders until custom SFX arrive.
