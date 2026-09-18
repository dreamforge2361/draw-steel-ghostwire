# Spike B50 — Changer form token-art swap

**Status:** implemented locally 2026-09-17 as 0.1.73 (`syncChangerFormArt` in `scripts/module.mjs`) — Foundry-verify, then commit.

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


## B50b — Sheet form control (Michael 2026-09-17)

Art sync on effect enable is already implemented locally (0.1.73). **Extend the same local bump** — do not bump again.

### Goal
Changer heroes get a **built-in sheet control** (Human / Hybrid / Beast) that:
1. Enables the matching Forms-trait ActiveEffect (maneuver fiction; exactly one active — existing mutual exclusion stays).
2. That enable path already applies **stat ActiveEffect changes** (Hybrid: Intimidation edge; Beast: Stealth + Perception edges) and **B50 art sync**.
3. Highlight the active form on the control.

### UI
- Hook 
enderDrawSteelHeroSheet (same pattern as Body Integrity / Wired fieldsets in scripts/module.mjs).
- Only if the actor has ancestry _dsid === "changer" (or a Forms trait with changerForm effects).
- Three buttons or a segmented control near Stats / under portrait — label with lang keys already used for Forms.
- Owner-only clickable; GMs can click too.
- Click → find the Forms ancestryTrait (item _dsid changer-forms or effects with changerForm flag) → updateEmbeddedDocuments to set chosen effect disabled: false (siblings disable via existing hook). Prefer updating the **trait item's** effects if that's where they live after transfer, or the actor's transferred effects — match whatever the current mutual-exclusion hook already watches (effect.parent).

### Stats gap (only if cheap)
RAW also wants Hybrid **melee free strikes +1 damage** and Human **edge on pass-as-human**. Hybrid Intimidation + Beast Stealth/Perception are already on the effects. If a Draw Steel ActiveEffect key for free-strike damage is obvious from DS 1.1.2 / existing Ghostwire effects, add it; otherwise note as follow-on and do not invent a wrong key. Human blend-in edge may stay prose if no clean key.

### Success checklist (add to prior)
9. On Wren's hero sheet, form control visible; click **Beast** → effect enables, token+portrait swap, Stealth/Perception edges apply.
10. Click **Human** → back; Hybrid → Intimidation edge; only one form active.
11. Non-Changer sheets show no control.

### As-built (0.1.73, same local bump)
- `scripts/module.mjs`: new `renderDrawSteelHeroSheet` hook adds a **Changer Forms** fieldset (Human / Hybrid / Beast buttons) on the Stats tab, after the Wired fieldset. Shown only when `actor.allApplicableEffects()` includes `changerForm` effects (the Forms trait's transferred effects, which live on the trait item) — non-Changers and Former Life: Changer revenants get nothing.
- Click → `effect.update({ disabled: false })` on that form's effect; the existing `updateActiveEffect` hook disables the siblings on the same parent and runs `syncChangerFormArt`. Stat changes come from the effects themselves. Active form is highlighted (`.active`, `aria-pressed`). Buttons are disabled for non-owners; GMs own everything.
- `lang/en.json`: `Forms.Hint`, `Forms.{Human,Hybrid,Beast}.Label`; Forms description's "In Foundry" line points at the sheet box. `styles/ghostwire.css`: `.ghostwire-changer-forms`.
- **Hybrid free strike +1: follow-on, not automated.** DS 1.1.2 has no hero free-strike damage key; `abilityModifier` effects only filter by keyword, and hero free strikes share melee/weapon/strike with signature abilities, so any key would also hit non-free strikes. The Hybrid description already says "add it to the roll". Human blend-in edge stays prose. No pack rebuild.
- **Update (B57, 0.1.84):** Hybrid +1 is now automated as a keyword-filtered `abilityModifier` (melee + weapon). See `docs/spikes/B57-CHANGER-HYBRID-FREE-STRIKE.md`.
