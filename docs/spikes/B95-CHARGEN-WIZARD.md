# B95 / I2 — Chargen Wizard

**Shipped:** 0.3.101 (2026-09-22). **Print source:** `docs/manuscript/04-back/29-chargen-cheat-sheet.md` (Appendix B, B93).
**Code:** `scripts/chargen-wizard.mjs`, `templates/chargen-wizard.hbs`, `styles/ghostwire.css` (`.ghostwire-chargen*`),
`lang/en.json` → `GHOSTWIRE.Chargen`, `src/packs/macros/chargen-wizard.json`.
**Smoke:** `node tools/chargen-wizard-smoke.mjs` (213 checks). **Checklist:** `docs/directors/chargen-wizard-smoke-03101.md`.

Appendix B is a punch-list a player works by hand on the Hero sheet. This is that punch-list, clickable, on the sheet
it describes. It is **not** a second chargen engine.

---

## Locks (Michael, 2026-09-22 — do not reopen)

### Door
- **Players and Directors** both use it. The gate is Actor ownership, or GM.
- Trigger: a **Chargen** button in the **Hero sheet header** — top of the sheet, clear of the tab strip.
  Flow: create a Hero → open the sheet → press **Chargen**.
- Also on `module.api.openChargenWizard`, `game.ghostwire.openChargenWizard`, a keybinding, and the Ghostwire
  macro **Ghostwire: Chargen Wizard** (Directors / testing).
- `type === "hero"` only.

### Step order — FULL
Thirteen steps, in this order, and the order is the lock:

1. **Concept** — free-text bio, with **Ask VOIDMARK** as the primary action. Optional; skippable.
2. **Name** — sets the Actor name.
3. **People** · 4. **Background + Profession** · 5. **Class** · 6. **Kit** · 7. **Skills**
   · 8. **Characteristics** · 9. **Languages** · 10. **Resource + numbers** · 11. **Body Integrity**
   — the Appendix B spine, in print order.
12. **Early spends** — optional, out of the ¥5,000.
13. **Done** — the Appendix B *Done-when* box, then the wizard closes onto the finished sheet.

### Drive the system, never fork it
Every spine pick makes the **same call the Draw Steel hero sheet makes on a drop**:

| pick | call |
|---|---|
| class | `actor.system.advance({ levels: 1, item })` |
| People / Background / Profession / Kit | `item.system.applyAdvancements({ actor, levels: { end: actor.system.level } })` |
| plain gear (spends) | `Item.create(game.items.fromCompendium(source), { parent: actor })` |

So the stock advancement dialog runs, subclass / doctrine / pact prompts are the system's own, and **no grant math
is re-implemented**. `applyAdvancements` is awaitable, so the wizard waits on the dialog and re-reads the sheet after
it — a **Re-check** button is on every pick step for the cases where a prompt writes late.

G1 `kit-grants.mjs` fires on its own `createItem` hook when a Kit lands. The wizard **never** grants street gear; it
only reads G1's table (`packageDsids`) to say whether a Kit wants gear.

### The ¥ firewall
- Start wealth **¥5,000**, stamped only when the field carries no number at all.
- ¥ buys **objects**. Never a characteristic, never a skill, never class power.
- The spend catalog reads **four packs only**: `gear`, `matrix`, `foci`, `vehicles`.
  The **chrome** and **mods** packs are named as forbidden and are structurally unreachable.
- Second lock behind that: `isChargenSpendable()` refuses anything carrying a `flags.draw-steel-ghostwire.chrome`,
  and `buyChargenItem()` refuses a chrome source again before creating it.
  **Why it needs two locks:** `module.mjs` debits Body Integrity the instant a chrome Item lands on a hero. "No chrome
  at chargen" therefore has to be enforced at the *catalog*, not at the click.
- Unpriced and ¥0 rows are refused — the wizard never guesses at ¥.
- Lifestyle is not pre-paid. Mods are not installed.
- Characteristics: **2, 2, 1, 1, 0**, enforced as a multiset. The pool shrinks as you place numbers, so an illegal
  spread cannot be selected. **Lean on the class cores** drops the two 2s on the class's core characteristics.
- Integrity **20/20** (Cyborg **N/A**), **Taint 0**, **no chrome** — read back, warned about, never auto-written.

### Copy
- No Draw Steel / MCDM / Creator License name-checks in any player-facing string (B93). The smoke greps for them.
- Sheet remaps hold everywhere a player reads: Ancestry→**People**, Culture→**Background**, Career→**Profession**.
  The smoke greps for the stock words too.

### VOIDMARK
- Reached through `module.api.voidmark`, **not** a static import — `scripts/voidmark.mjs` destructures
  `foundry.applications.api` at module scope, and `chargen-wizard.mjs` has to stay importable in plain Node.
- `openVoidmark({ seed })` and a new `VoidmarkChat#seed(text)` drop a chargen-flavoured question into the prompt box
  **without sending it**. The runner reads it, edits it, sends it.
- The wizard **never touches the thread mode**. The B122 / S6 audience lock stands: a player asks as a runner and
  hears runner material.

### Re-run
Safer default, chosen deliberately. A hero **past 1st level**, or one already **stamped complete**, opens
**review-only** — for Directors too. Re-running the picks would drive the advancement dialogs a second time and
double-grant. The Done summary is still readable; nothing writes.

---

## What shipped

- `scripts/chargen-wizard.mjs` — ApplicationV2 applet (the `ritual-working.mjs` / `voidmark.mjs` shape: lazy class
  definition so the file imports in Node). Everything above the app class is Foundry-free and exported, which is what
  lets the smoke drive the ladder, the array and the firewall with no world.
- State lives in `flags.draw-steel-ghostwire.chargen` — `{ step, bio, acked, spent, started, completed }` — so a
  refresh lands back on the step you left, and Done stamps `completed`.
- The sheet launcher goes in after the B80 Taint readout if that already claimed the header spot, otherwise after the
  runner's name.
- 178 `GHOSTWIRE.Chargen` strings; the smoke resolves every static key the UI names.

## Deliberately not done

- The wizard does not automate every advancement edge case. Where the system owns a prompt, the wizard hands off and
  resumes — that was the lock, not a shortcut.
- No Lifestyle, no chrome install, no mod install, no portrait pipeline.
- No PDF reprint. Appendix B in print is unchanged; this is the Foundry side of the same list.

## Known open

- `isPlaceholderName()` only knows the English placeholder names. A runner named in another language reads as named,
  which is the harmless direction to fail.
- The spend catalog caps at 150 visible rows; the filter narrows it. The count above the list is the true total.
