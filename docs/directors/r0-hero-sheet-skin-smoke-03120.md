# R0 Hero sheet skin — Foundry smoke checklist (0.3.120)

Walk this in a live world on Draw Steel + Ghostwire **0.3.120**. Fifteen minutes, no dice needed.
Design lock: `docs/directors/ghostwire-r0-hero-sheet-mock.png`. Implementation note:
`docs/directors/r0-hero-sheet-skin.md`.

**Before you start:** hard-refresh (F5) once after updating — `styles/ghostwire.css` is cached by the
browser, and a stale copy is the only way this checklist can fail for a reason that is not real.

---

## 0. Bench (no Foundry)

- [ ] `node tools/r0-hero-sheet-skin-smoke.mjs` → **64 checks passed**
- [ ] `node tools/g3-lang-style-tokens-smoke.mjs` → **G3 smoke PASS** (it was red on main before this branch)

---

## 1. The Hero sheet reads like the mock

Open any Hero — a pregen (Kaes, Vessa, Barak…) is ideal because it has art, tags and abilities.

- [ ] The whole sheet is **deep ink**, not the stock parchment / grey. Nothing is bright cyan.
- [ ] A large, soft **GHOSTWIRE** watermark sits behind the header, top-right, in a serif — visible as
      atmosphere, *not* legible as a logo stamp. It should be easy to miss on first glance and obvious
      once you look for it.
- [ ] A **hairline frame** runs just inside the window edge in muted steel, with a small **node dot**
      at each of the four corners and a short trace run off the top-left and bottom-right nodes.
- [ ] One small **sigil** — a wire lattice in a circle — sits in the **bottom-right** of the sheet
      body at low opacity.
- [ ] The character **name** is set in the display serif, uppercase, widely spaced, in pale steel.
- [ ] The origin tags (ancestry / culture / career / class) are quiet outlined chips, not filled ones.
- [ ] Tabs are uppercase and letter-spaced; the **active** tab is a steel wash, the rest are dim.

**Nothing below is decoration you can click through by accident:**

- [ ] Click straight through where the watermark is — the header, the name field, the portrait. Every
      one of them still responds. Same for the bottom-right corner where the sigil is: whatever is
      under it (an ability row, a button) still takes the click.
- [ ] Resize the sheet by the bottom-right corner handle. It still grabs.

## 2. Ember is only where it should be

- [ ] **Stats** tab → the **Body Integrity** fieldset is the one warm thing on the sheet: an ember
      border, a faint ember wash, an ember legend, and its two numerals in ember.
- [ ] The **Taint** legend and the always-visible Taint header label are ember too.
- [ ] **Nothing else** on the sheet is warm. Resources, characteristics, tabs, abilities, equipment,
      features, biography — all cold steel.
- [ ] A **Cyborg** hero (Integrity max 25) shows the same ember treatment.

## 3. Everything still works, not just looks

- [ ] Every tab opens: **Stats · Abilities · Equipment · Features · Projects · Effects · Biography**.
- [ ] Stats → the five **characteristics** are boxed cells with a hairline border; hovering one lights
      the border steel; clicking one still opens the Power Roll dialog.
- [ ] Stats → Stamina / Recoveries / Heroic resource numbers are readable and **editable**; typing in
      one and tabbing away still saves.
- [ ] Stats → the **Wired** fieldset still shows the connection state, and the state word is still
      colour-coded (Linked green, Jacked In magenta). **Overlay** now reads pale steel rather than
      neon cyan — that is the one deliberate change to the readout.
- [ ] Abilities → the list header and rows are dark with hairline separators; hovering a row lifts it
      slightly; clicking an ability name still rolls it; the chevron still expands the description.
- [ ] Equipment → item rows, kits and treasure all readable. Chrome lines under item names readable.
- [ ] Biography → the prose-mirror editor opens, has a dark field, and the text in it is legible.
- [ ] Switch Foundry to the **light** UI theme (Settings → Core → Appearance) and reopen the Hero.
      The sheet should look **the same** — deep ink either way. Switch back.
- [ ] Toggle the sheet into **edit** mode (the lock / edit control). Inputs and selects are dark
      fields with steel text; placeholder text is dim but readable.

## 4. Nothing else was repainted

This is the half of R0 that is a promise rather than a picture — the skin is sheet-scoped, so every
other Ghostwire surface must be **unchanged** from 0.3.119.

- [ ] **Chargen Wizard** (Hero sheet header button) — still neon cyan, still readable, all 13 steps.
- [ ] **Wired Console** — roster, node list, Integrity ring, Trace Alert track, buttons: all still the
      net-deck cyan. The Linked / Connected greens on the roster rows are unchanged.
- [ ] **Run Generator**, **Ritual Working**, **kiosk**, **Chest / Locker**, **VOIDMARK** chat: all
      unchanged.
- [ ] **Machine sheet** (a drone or vehicle Actor) — tabs, portrait, inventory: unchanged. *(Its
      active tab and a few radii were folded back onto tokens in this pass; the rendered result should
      be identical.)*
- [ ] An **NPC / monster** Actor sheet is **not** skinned — it is still the stock Draw Steel sheet.
      Only Heroes get the Ghostwire skin.
- [ ] Item sheets, journals and the chat log are unchanged.

## 5. Sign-off

- [ ] Michael has looked at a Hero sheet beside `ghostwire-r0-hero-sheet-mock.png` and agrees the
      direction matches: **deep ink · cold steel · soft watermark · corner glyph · ember on Integrity**.

Record misses here with the sheet, the tab, and a screenshot if the difference is visual.
