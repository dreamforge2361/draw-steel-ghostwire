# R0 — Hero sheet Ghostwire skin (0.3.120)

**Locked mock:** `docs/directors/ghostwire-r0-hero-sheet-mock.png` (Michael, 2026-09-23). It is committed
alongside this note as the design lock artifact — if the sheet and the mock ever disagree, the mock wins.

**Smokes:** `node tools/r0-hero-sheet-skin-smoke.mjs` · `node tools/g3-lang-style-tokens-smoke.mjs`
**Foundry checklist:** `docs/directors/r0-hero-sheet-skin-smoke-03120.md`

---

## What changed

Three things, in the order they matter.

1. **The two token ladders G3 (0.3.102) deferred are closed.** The letter-spacing scale G3 counted at nine values (it is ten,
   once `0.02em` is counted) is now `--ghostwire-track-*`, the per-applet panel darks are one measured `--ghostwire-panel-*` ramp,
   and the wire-state colours are named. 106 declarations across the file moved onto them.
2. **The Hero sheet has a skin** — deep ink, cold steel, a soft GHOSTWIRE watermark, a hairline wire
   frame with corner nodes, one corner sigil, and ember reserved for Body Integrity.
3. **Nothing else moved.** No existing token changed value. The Wired Console, Chargen Wizard, Run
   Generator, Ritual Working, kiosk, locker and machine sheet all still read `--ghostwire-accent` and
   still look exactly as they did at 0.3.119. There was no global neon → steel flip, by design.

Two G3 regressions that had crept in since 0.3.102 are also swept up here, because R0's acceptance
requires the G3 smoke green: the 0.3.106 machine sheet had re-introduced two
`var(--ghostwire-accent, #hex)` fallbacks, and the machine sheet / locker / S9 blocks had re-typed
five ladder radius sizes. `node tools/g3-lang-style-tokens-smoke.mjs` was **red on main** before this
branch and is green on it.

---

## Scope: one class, and why

`scripts/module.mjs` stamps `ghostwire-hero-sheet` on the Hero sheet root in a
`renderDrawSteelHeroSheet` hook, next to the three hooks that already inject Body Integrity, the Wired
readout and the Changer form control. That single line is the whole of the JavaScript R0 adds.

```js
Hooks.on("renderDrawSteelHeroSheet", (app, element) => {
  element.classList.add("ghostwire-hero-sheet");
});
```

Everything else is `styles/ghostwire.css`, in one block at the foot of the file, every selector under
`.ghostwire-hero-sheet`. The sheet could have been reached with Draw Steel's own
`.application.draw-steel.actor.hero` chain instead — but that chain is three of the *system's*
`DEFAULT_OPTIONS` away from us and would have to be repeated on every rule. The marker class is ours,
it is one token long, and it is what the smoke asserts.

**Ordering matters and is deliberate.** The module-wide theme hooks near the top of the file glow every
Draw Steel application in neon cyan (`--ghostwire-glow`). R0's shell rules repeat that selector's
specificity (`body.ghostwire-theme .application.ghostwire-hero-sheet`, 0-3-0) and sit later in the file,
so the Hero sheet — and only the Hero sheet — steps out of the neon into steel.

---

## The lever: Draw Steel's own colour variables

The single most effective thing in the block is the first rule. Draw Steel styles its entire sheet
against `--draw-steel-c-*`, which the system declares per theme in
`@scope (.theme-light) to (.themed)` / `@scope (.theme-dark) …`. Re-pointing them on the Hero sheet
root carries tags, rules, table headers, item stripes, input placeholders and button hovers into deep
ink in one move — without touching a line of Draw Steel layout HTML, and without a per-element chase.

It also means the sheet reads the same for a Director on the light Foundry theme as for one on dark.
The `@scope` declarations apply at `:scope` specificity (0-1-0); `.application.ghostwire-hero-sheet` is
0-2-0, so ours wins regardless of which theme is active or which element carries the theme class.

| Draw Steel var | now reads | carries |
|---|---|---|
| `--draw-steel-c-white` | `--ghostwire-sheet-panel` | sheet and panel backgrounds |
| `--draw-steel-c-faint` | `--ghostwire-sheet-panel-2` | tag fills, placeholders, table wash |
| `--draw-steel-c-beige` | `--ghostwire-sheet-wire` | tag borders |
| `--draw-steel-c-dark` | `--ghostwire-sheet-text` | tag text |
| `--draw-steel-c-tan` | `--ghostwire-sheet-text-dim` | dashed rules |
| `--draw-steel-c-groove` | `--ghostwire-sheet-wire-soft` | grooved separators |
| `--draw-steel-c-laserline` | `--ghostwire-sheet-steel` | the system's accent rules and underlines |
| `--draw-steel-c-item-header-bg` | `--ghostwire-sheet-panel-2` | ability / equipment list headers |
| `--draw-steel-c-item-alternating-bg` | 4% steel | list striping |

Core Foundry's `--color-fieldset-border`, `--input-placeholder-color`, `--color-shadow-primary`,
`--button-hover-background-color` and `--button-focus-outline-color` are re-pointed in the same rule.

---

## New tokens

All of them are declared in the one `:root` block — G3's rule that a `--ghostwire-*` token is never
read with a fallback still holds, and the R0 block below contains **no bare colour literal at all**.

### Tracking ladder — `--ghostwire-track-*`

Exactly the ten values already in the file, in order. `0.04em` was the most-used (15 rules) and holds
the bare name. A literal `letter-spacing: 0` is "none", not a rung, and stays a literal.

| token | value | typical use |
|---|---|---|
| `--ghostwire-track-xs` | `0.02em` | sheet one-liners (chrome, identity, cover) |
| `--ghostwire-track-sm` | `0.03em` | body-adjacent emphasis, the watermark |
| `--ghostwire-track` | `0.04em` | module default — small-caps labels |
| `--ghostwire-track-md` | `0.05em` | applet field labels |
| `--ghostwire-track-lg` | `0.06em` | sheet labels, item names |
| `--ghostwire-track-xl` | `0.08em` | uppercase section headers, tabs, legends |
| `--ghostwire-track-2xl` | `0.1em` | run-generator card headings |
| `--ghostwire-track-3xl` | `0.12em` | applet sub-titles |
| `--ghostwire-track-4xl` | `0.14em` | applet titles |
| `--ghostwire-track-5xl` | `0.16em` | the widest rung (VOIDMARK title) |

### Panel dark ramp — `--ghostwire-panel-0` … `-10`

The ten per-applet darks G3 left, **sorted by relative luminance rather than by hex**: the near-twins
`#0a1018` and `#0a1118` are a single point of luminance apart, and the visibly bluer `#06121a` lands
just above both of them rather than where a hex sort would put it. Step 0 is new: the deep ink ground
the Hero sheet is drawn on.

`#05080c` · `#031017` · `#0a1018` · `#0a1118` · `#06121a` · `#0c141c` · `#0e161f` · `#0f1c26` ·
`#10202c` · `#102030` · `#16202b`

### Wire states — `--ghostwire-wire-*`

`--ghostwire-wire-linked` `#8fd4a8` (sheet / token HUD / chat card) · `--ghostwire-wire-linked-console`
`#6ecf9a` (Wired Console roster + node chip) · `--ghostwire-wire-connected` `#7ad4c0` ·
`--ghostwire-wire-jacked` `#e0457b`.

**The two greens stay two greens.** G3's precedent was to merge a split pair, but the console rung is
read inside the applet against its own cyan and the sheet rung against steel; merging them would be an
applet repaint, which R0 has no remit for. They are named rather than merged so the next pass can
decide with both values in front of it. The smoke asserts they are still different, on purpose.

### Hero sheet group — `--ghostwire-sheet-*`

| token | value | note |
|---|---|---|
| `--ghostwire-sheet-ink` | `var(--ghostwire-panel-0)` | `#05080c` window ground |
| `--ghostwire-sheet-panel` | `var(--ghostwire-panel-3)` | raised panel |
| `--ghostwire-sheet-panel-2` | `var(--ghostwire-panel-6)` | list headers, tag fills |
| `--ghostwire-sheet-steel` | `#6a8a9a` | the cold-steel accent — hue 200°, **saturation 19%** |
| `--ghostwire-sheet-steel-bright` | `#9fb7c4` | names, numbers, hovers |
| `--ghostwire-sheet-steel-dim` | `#3a4f5e` | scrollbars, reversed rules |
| `--ghostwire-sheet-text` | `#c6d2dc` | body |
| `--ghostwire-sheet-text-dim` | `#7d8f9d` | labels |
| `--ghostwire-sheet-ember` | `#8a5a3a` | Integrity / warning-adjacent **only** |
| `--ghostwire-sheet-ember-bright` | `#b87a4c` | Integrity numerals, Taint band labels |
| `--ghostwire-sheet-watermark` | `#0d1620` | the GHOSTWIRE fill |
| `--ghostwire-sheet-wire` | 38% steel | the hairline |
| `--ghostwire-sheet-wire-soft` | 16% steel | the fainter hairline |
| `--ghostwire-sheet-sigil` | `url("../assets/brands/ghostwire-sigil.svg")` | the corner glyph |

Plus one type token: `--ghostwire-font-display: Newsreader, Georgia, "Times New Roman", serif`.
Newsreader ships with Draw Steel (`--font-secondary` / `--font-h2`), so the name line and the watermark
are set in a face every table already has.

"Cold steel, not neon" is the whole brief, so the smoke checks it numerically: hue between 170° and
230°, saturation under 32%, and not equal to `--ghostwire-accent`.

---

## The mock's four pieces

| piece | selector | how |
|---|---|---|
| GHOSTWIRE watermark | `.ghostwire-hero-sheet .window-content::before` | `content: "GHOSTWIRE"` in the display serif at 6.5rem, filled `--ghostwire-sheet-watermark`, `overflow: hidden` on the pseudo-element itself so it clips without ever widening or scrolling the sheet |
| wire frame + corner nodes | `.ghostwire-hero-sheet::before` | 1px `--ghostwire-sheet-wire-soft` border inset 5px, plus four corner `radial-gradient` node dots in `--ghostwire-sheet-steel` |
| circuit trace | `.ghostwire-hero-sheet::after` | four short `linear-gradient` runs off the top-left and bottom-right nodes — hairline, not a PCB |
| corner sigil | `.ghostwire-hero-sheet .window-content::after` | `assets/brands/ghostwire-sigil.svg` used as a **`mask-image`**, 74px, bottom-right, 30% opacity |

The sigil is masked rather than drawn so it takes `--ghostwire-sheet-steel` and can never drift from
the palette the way a coloured PNG would. The asset is 975 bytes of vector (a wire lattice closing on
itself — a Ghostwire original, no MCDM or Draw Steel wordmark, no licensed corp art), and it lives in
`assets/`, so **no pack was rebuilt for R0**.

All four are `pointer-events: none`. The smoke asserts that for each of them: atmosphere must never eat
a click on the sheet underneath it.

Content sits above the watermark because the Hero sheet's three top-level parts
(`.sheet-header`, `nav.tabs`, `section.tab`) get `position: relative; z-index: 1`; the watermark and
sigil are `z-index: 0` and the frame is `z-index: 2` so it draws over the content edges.

---

## Ember discipline

Ember appears in exactly four places, all of them Integrity- or warning-adjacent:

- the **Body Integrity** fieldset border and background wash (`.ghostwire-integrity`)
- its legend and its two numerals, in the display face
- the **Taint** legend and the always-visible Taint header label
- nothing else

Everything else on the sheet — tabs, characteristics, resources, item lists, the Wired and Changer
legends — is cold steel. The Wired readout keeps its own state colours because it is a *readout*, not
sheet chrome; the one exception is the **Overlay** rung, which read `--ghostwire-accent` and would have
been the single neon cyan left on a cold-steel sheet. It now reads `--ghostwire-sheet-steel-bright`.

---

## What R0 deliberately did not do

- **No global accent flip.** `--ghostwire-accent` is still `#6ee7ff` and the applets still read it.
  The smoke asserts both, and that the R0 block never reads the accent at all.
- **No layout HTML.** No Draw Steel template is overridden, no part is replaced, no element is injected.
  The mock's stat *bars* are the one thing that cannot be reproduced without new markup, and were not
  attempted — the acceptance names ink, frame, watermark, glyph and ember, and those are all CSS.
- **No pack rebuild, no journal regen, no lang keys.** R0 adds no player-facing copy.
- **The two greens were not merged** (see above).

## Running the smokes

```
node tools/r0-hero-sheet-skin-smoke.mjs
node tools/g3-lang-style-tokens-smoke.mjs
```

Neither needs a live Foundry. The Foundry-side walkthrough — open a Hero, check the watermark, the
frame, the sigil, the steel accent and the Integrity ember, then confirm the Chargen Wizard and Wired
Console are still readable — is `docs/directors/r0-hero-sheet-skin-smoke-03120.md`.
