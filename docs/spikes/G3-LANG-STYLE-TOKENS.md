# Spike G3 — lang pass + style tokens

**Repo:** draw-steel-ghostwire · **Ships in:** 0.3.102 (same bump as G4)
**Smoke:** `node tools/g3-lang-style-tokens-smoke.mjs` · **Foundry checklist:** `docs/directors/g3-lang-style-tokens-smoke-03102.md`
**Does not touch:** the Hero sheet skin. That is **R0**, still backlog.

## What the investigation found

### Lang — already clean, so the work was to lock it

Scanned `scripts/`, `templates/`, `src/packs/` and `data/` (1,836 files, 4,531 distinct `GHOSTWIRE.*` literals) against the 5,385 leaf keys in `lang/en.json`, plus the six key families that are built from a template literal and so never appear whole in the source:

| Family | Built from | Keys |
|---|---|---|
| `Skills.Groups.*` / `Skills.List.*` | `SKILL_GROUPS`, `SKILLS` | 6 + 44 |
| `WiredConsole.VerbNeed*` | every `reason:` a console gate returns | 8 |
| `Wired.Warnings.*` | every `warn("…")` in the ability-use patch | 5 |
| `Wired.States.*` | the four connection states | 4 |
| `EquipmentUse.*` | B49's spawned ability copy | 4 |

**Zero missing keys.** Nothing to fill. The only thing worth writing down is the twelve *empty* values, which turned out to be correct rather than half-finished: the Attack Sprite's Code Strike and the Spike Agent's Integrity Spike carry an `other` power-roll effect that says "no damage" at tier 1 and has nothing to add at tiers 2 and 3, where the damage effect speaks. `DrawSteelAbility#powerRollText` does `.map(e => e.toText(tier)).filter(_ => _).join("; ")`, so an empty tier display is **dropped**, not rendered as a blank line. The smoke lists those twelve by name, so a genuinely half-written key still fails.

So the lang deliverable is the checker, not new copy. It runs in 0.3s and fails on the first key a player would see raw on their sheet.

### Style tokens — four real gaps

1. **`--ghostwire-ok` and `--ghostwire-warn` were never declared.** Ritual Working and the Chargen Wizard were written against those names and ran entirely on their own fallbacks (`#7ee787`, `#f0b849`), while the Wired Console and Run Generator ran on `--ghostwire-success` / `--ghostwire-warning` (`#34d399`, `#fbbf24`). Two greens and two ambers in one module, with no way to change either from one place.
2. **Every `var(--ghostwire-x, #hex)` fallback was a second copy of the value**, and at least one had already drifted — `var(--ghostwire-accent, #3fc1c9)` claimed a cyan the palette left behind long ago. The `:root` block is unconditional and always wins, so those fallbacks were dead code that lied about the palette.
3. **Colour literals duplicated token values ~90 times** below the block.
4. **Two different monospace stacks** (`monospace` and `ui-monospace, monospace`) across the console, deck readouts and the ¥ line — they render differently on Windows — and the one declared radius token (`6px`) was the *least*-used size in the file, with 26 bare `4px`, 9 `999px` and 7 `3px` alongside it.

## What shipped

The `:root` block in `styles/ghostwire.css` is now the single source of truth, and 131 lines below it were folded back onto it:

* `--ghostwire-ok` → `var(--ghostwire-success)` and `--ghostwire-warn` → `var(--ghostwire-warning)`. One green, one amber. **This is the pass's only intended visual change** — Ritual Working and the Chargen Wizard shift a shade.
* Every `--ghostwire-*` read is now bare: no fallbacks anywhere. Since the fallbacks were never reachable, this changes nothing on screen (the stale `#3fc1c9` was already unreachable).
* Every colour literal that equalled a token is now that token.
* A radius ladder — `--ghostwire-radius-xs/-sm/(default)/-lg/-pill` — carrying the exact sizes already in use, so no geometry moved.
* `--ghostwire-font-mono`, one stack, used everywhere a rule asked for monospace.

The per-applet prefixes (`--wc-*`, `--rg-*`, `--rw-*`, `--cg-*`, `--vm-*`) were already the right pattern and are unchanged in shape: they still alias the globals, they just no longer re-state their values.

## Deliberately left for R0

Both are design decisions, not mechanical ones, and guessing at them here would be a sheet reskin by the back door:

* **The letter-spacing scale.** Nine values between `0.03em` and `0.16em`. Snapping them to a four-step ladder would move type on every applet.
* **The panel darks and state colours.** `#0a1118`, `#0c141c`, `#0e161f`, `#06121a`, `#0f1c26` are per-applet shades rather than one ramp; `#6ecf9a` (Linked) and `#7ad4c0` (Connected) are semantic state colours distinct from `success`. Naming these is R0's palette job.

## Files

| File | Change |
|---|---|
| `styles/ghostwire.css` | `:root` extended (ok/warn, radius ladder, mono stack) + 131 lines folded onto tokens |
| `tools/g3-lang-style-tokens-smoke.mjs` | **new** — 33 checks, no live Foundry |
