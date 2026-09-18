# Spike B50 — Changer form token-art swap

**Repo:** draw-steel-ghostwire  
**Do NOT commit.** Leave uncommitted with the local SFX 0.1.70 work (or bump once to 0.1.71 only if you must separate versions — prefer **one** local version for SFX+B50).  
Foundry may be open for Michael's playtest — **do not rebuild packs / touch LevelDB** unless absolutely required. This is scripts + optional Actor JSON flags only.

## Already in place
- `scripts/module.mjs` ~L398: `updateActiveEffect` mutual-exclusion for effects with `flags.draw-steel-ghostwire.changerForm` (`human` | `hybrid` | `beast`).
- Forms trait: `src/packs/origins/changer/changer-forms-trait.json` — three transfer ActiveEffects with those flags.
- Wren pregen flags:
  ```
  flags.draw-steel-ghostwire.changer.humanArt = modules/.../wren-sable-corvin.png
  flags.draw-steel-ghostwire.changer.beastArt = modules/.../wren-sable-corvin-beast.png
  ```
  Sheet + default token currently use human art.

## Goal
When a Changer enables a form effect (Human / Hybrid / Beast), update **active canvas tokens** (and optionally Actor `img` + `prototypeToken.texture.src` for persistence) to the art path for that form.

### Art resolution (per Actor)
Read `flags.draw-steel-ghostwire.changer`:
| Form | Path |
|---|---|
| `beast` | `beastArt` (required for swap; if missing, no-op / warn once) |
| `human` | `humanArt` else current Actor img |
| `hybrid` | `hybridArt` if set, else `humanArt`, else Actor img |

If neither beast nor human art is configured, do nothing (other Changers without custom art keep default).

### Implementation
Extend the existing Changer `updateActiveEffect` hook (same file) or extract a small `syncChangerFormArt(actor, form)` helper next to the pact-tint pattern:
1. On enable (`changes.disabled === false`) of a `changerForm` effect — after disabling siblings — call sync with that form id.
2. Update every active token for the Actor: `token.document.update({ "texture.src": path })` (or TokenDocument API as used elsewhere in this module).
3. Also update Actor `img` and `prototypeToken.texture.src` so sheet portrait and future drops match the active form (Beast on sheet is fine for play; document in a one-line BUILD-NOTES / directors note).
4. Owner/GM permission: only the user who enabled the effect (same `userId === game.user.id` guard as today).
5. Do **not** break mutual exclusion. Do **not** change Hybrid/Beast mechanical effects.

### Optional nicety (only if cheap)
- If Actor has `changer.beastArt` but no `humanArt`, snapshot current img into `humanArt` on first Beast swap so return works.
- Vira (Rat) has no beast PNG yet — no-op is correct.

### Docs
- Short as-built in `docs/masters/pregens/BUILD-NOTES.md` or a tiny `docs/directors/changer-form-art.md`.
- Spike file can stay as this doc: `docs/spikes/B50-CHANGER-FORM-ART.md`.

## Success / Michael checklist
1. Drag Wren to a scene.
2. Enable **Beast** form effect — token (and sheet art) become the raven portrait.
3. Enable **Human** — back to human portrait.
4. Enable **Hybrid** — human (or hybridArt if set); still only one form active.
5. Vira / a Changer without beastArt — form switch still works mechanically; art unchanged.
6. No pack rebuild required; no commit.
