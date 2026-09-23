# Lang + style tokens — Foundry checklist (0.3.102 / G3)

Node smokes first, in the module folder with Foundry **closed**:

```
node tools/g3-lang-style-tokens-smoke.mjs
node tools/g4-skill-on-weapon-smoke.mjs
node tools/chargen-wizard-smoke.mjs
node tools/ritual-working-smoke.mjs
```

All must pass. **No packs were rebuilt this pass** — G3 touched `styles/ghostwire.css` and one new tool, nothing in `src/packs/`.

Spike note: `docs/spikes/G3-LANG-STYLE-TOKENS.md` · Prompt: `docs/directors/_claude-g4-g3-prompt.md`.

---

## What shipped

| Line | Before | After |
|---|---|---|
| `--ghostwire-ok` / `--ghostwire-warn` | **used but never declared** — two applets ran on their own fallbacks | declared, pointing at `success` / `warning` |
| Greens / ambers in the module | two of each (`#7ee787`+`#34d399`, `#f0b849`+`#fbbf24`) | one of each |
| `var(--ghostwire-x, #hex)` fallbacks | ~60, one already stale (`#3fc1c9`) | none — the `:root` block always wins |
| Colour literals duplicating a token | ~90 | none |
| Monospace stacks | two (`monospace`, `ui-monospace, monospace`) | one, `--ghostwire-font-mono` |
| Radius tokens | one (`6px`), least-used size in the file | a five-step ladder at the sizes already in use |
| Missing `GHOSTWIRE.*` lang keys | none — now checked on every run | none, and the checker fails if that changes |

**Lang: nothing was rewritten.** The audit found no missing key anywhere across 1,836 files. G3's lang deliverable is the checker that keeps it that way.

---

## The one thing that changes on screen

Everything else in this pass is value-preserving. **This is not:**

**Ritual Working** and the **Chargen Wizard** had their own green and amber. They now use the module's.

| | Before | After |
|---|---|---|
| "ok" green | `#7ee787` (pale mint) | `#34d399` (the module's success green) |
| "warn" amber | `#f0b849` (dull gold) | `#fbbf24` (the module's warning amber) |

- [ ] Open the **Ritual Working** applet and drive a working to a good result and a warning result. Both states read clearly against the panel, and match how the **Wired Console** and **Run Generator** show the same states.
- [ ] Open the **Chargen Wizard**. Walk to a step that shows a green "ready" mark and one that shows an amber warning (the ¥ firewall is an easy one). Same two colours as above, and legible.
- [ ] Put a Ritual Working panel and a Wired Console side by side. One green, one amber, across both.

If either colour reads worse than before, say so — it is a one-line change to give `ok` / `warn` their own values back.

---

## Nothing else should have moved

Spot-check one surface per applet. Any of these looking *different* is a bug, not a feature:

- [ ] **Wired Console** — panel darks, the cyan frame and glow, roster rows, state chips (Linked green / Connected teal are unchanged and still distinct), readout text.
- [ ] **Wired Minimap** — node dots, band colours (Stir violet, Malice amber, Hunting hot pink, Lockout red), sizes at each connection mode.
- [ ] **Run Generator** — header, the ¥ figure (monospace), pill badges.
- [ ] **VOIDMARK** — chat card and settings, borders and muted text.
- [ ] **Hero sheet inserts** — Body Integrity, Taint band, chrome line under an implant name.
- [ ] **Corners.** Rounded corners are the same size everywhere they were: pills still pills, cards still cards, portraits still slightly rounded.
- [ ] **Monospace.** The console readout, construct Stamina and the run generator's ¥ are all in the *same* mono face now. Nothing fell back to a serif.

## Regression

- [ ] Reload with the module on: no CSS errors in the console.
- [ ] Toggle to Foundry's light theme if you use it — nothing turns unreadable that was readable before.

---

## Result

- [ ] **PASS** — Michael, date:
- [ ] Notes / anything to reopen:
