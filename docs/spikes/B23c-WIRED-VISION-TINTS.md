# Spike B23c — Wired vision tints (Overlay / Jacked In)

**Repo:** draw-steel-ghostwire  
**Do NOT commit or push.** Leave ready for Michael to Foundry-verify.  
**Bump** module.json one patch from current (disk was 0.1.46 when this spike was written — read and bump).

## Locked design (2026-09-17)

Status-driven from existing B23a statuses (any hero who can Overlay / Jack In gets this — not Hacker-only).

| State | Player vision | Feel |
|---|---|---|
| **Overlay** (`ghostwire-overlay`) | World still readable; cyan–pink HUD color wash / mild saturation shift | HUD on top of the street |
| **Jacked In** (`ghostwire-jacked-in`) | Dark / high-contrast / desaturated or neon-forward; meatspace heavily shadowed | In the Wire; physical world is a ghost |
| **Disconnected** | Normal Foundry vision | — |

Clears when status ends (Jack Out / Toggle / HUD clear). Exclusive statuses already enforced in `scripts/module.mjs` (`WIRED_STATUSES`, `setWiredState`).

## Implementation approach (v1)

Prefer the cleanest Foundry v14 path that works with Draw Steel:

1. **Best:** register custom `CONFIG.Canvas.visionModes` (or detection modes) and set the controlled token’s vision mode when Overlay / Jacked In is applied; restore default on clear.
2. **Acceptable:** canvas/coloration filter or Token light/sight overrides scoped to the viewing user when their controlled token has the status.
3. **Avoid:** permanent Scene darkness changes that affect every client, or filters that stick after Jack Out.

Hook points (inspect and reuse):
- `WIRED_STATUSES` + `setWiredState` / `createActiveEffect` / `deleteActiveEffect` / token HUD toggle already in `scripts/module.mjs`
- Apply vision when the **viewing user’s** controlled/owned token gains the status; remove when lost
- Optional soft light radius while Jacked In so node tokens on the Scene remain navigable

Art direction (Ghostwire): cyan/pink neon wash for Overlay; deep shadow + sparse neon for Jacked In. Match `docs/rulebook/ART-STYLE.md` if present.

New file OK: `scripts/wired-vision.mjs` imported from `module.mjs`.

## Docs
- Mark B23c in FOUNDRY-BUILD-PLAN + STATUS as **pending Foundry verification** (do not mark verified).
- Leave checklist boxes for Michael’s test.

## Out of scope
- Changing Matrix Verb edge/bane rules
- Wired Console UI
- Commit / push

## Done when
1. Connect → Overlay: controlled token’s view gets readable cyan/pink wash.
2. Toggle → Jacked In: view goes dark/shadowed; wash replaced (not stacked).
3. Jack Out → normal vision restored.
4. A second client without the status is unaffected (or only their own token’s view changes — verify and document).
5. Version bumped; docs pending verify; **no git commit**.

## Foundry test checklist (print when finished)
1. Hero Connect → Overlay tint on; world still readable.
2. Toggle Connection State → Jacked In dark vision; Overlay tint gone.
3. Jack Out → normal vision.
4. Token HUD clear of statuses → normal vision.
5. Second user / GM view without status looks normal.
