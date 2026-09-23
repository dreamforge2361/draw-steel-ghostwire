# R2 round pregen tokens — Foundry smoke checklist (0.3.121)

Walk this in a live world on Draw Steel + Ghostwire **0.3.121**. Ten minutes, no dice needed.
Implementation note: `docs/directors/r2-round-pregen-tokens.md`.

**Before you start:** the pregens compendium was rebuilt, so any pregen Actor you already dragged
into a world on an earlier version keeps its **old square token** — world Actors are copies, the
compendium rebuild does not reach them. Re-import a pregen (or drag a fresh one out of
**Ghostwire Pregens**) for this walk. That is expected, not a bug.

---

## 0. Bench (no Foundry)

- [ ] `node tools/r2-pregen-round-tokens-smoke.mjs` → **all checks passed**
- [ ] `node tools/pregen-regen-smoke.mjs` → **all checks passed** (section 10 = regen is a no-op)
- [ ] `assets/tokens/pregens/` holds **11** `.webp` files and `assets/pregens/` is unchanged
      (`git status` shows nothing under `assets/pregens/`)

---

## 1. The compendium art

Open the **Ghostwire Pregens** compendium.

- [ ] The compendium list shows each hero with their **square dossier portrait** thumbnail, exactly as
      before. Nothing in this list should look round.
- [ ] Open **Barak Voss-Hallor**. The sheet portrait is the square plate — unchanged from 0.3.120.
- [ ] In the same sheet, open the **prototype token** config (the token icon in the sheet header).
      Its image path is `.../assets/tokens/**pregens**/barak-voss-hallor.webp` — note the extra
      `tokens/` — and the preview is a **circle on a checkerboard**, not a rectangle.

---

## 2. On the canvas

Drag each of the seven pregens onto a scene with a visible battle grid.

- [ ] **Barak, Kaïs, Kessic (Null), Sabbat, Vessa, Vira, Wren** all land as **circular** tokens with
      transparent corners — the grid, the map art and any token underneath show through the corners.
- [ ] Put one of them next to a bestiary token (a Corp Security Officer, or the Mule-Bot drone). They
      read as the **same kind of token** — same circular framing, same weight. That is the whole point
      of R2; if a pregen still looks like a photo pasted on the map, something did not apply.
- [ ] Zoom in on one rim. The edge is smooth, not stair-stepped, and there is no dark halo ring.
- [ ] Zoom out to normal play distance. The face is still readable at grid scale.
- [ ] Double-click a token → **Appearance**. Scale is **1.0** and the token is 1×1. You should not
      need to rescale anything.

---

## 3. Changer form swaps — Wren

Open **Wren Sable-Corvin** with a token of hers on the canvas, and watch **both** the sheet portrait
and the canvas token on each click.

Stats tab → **Changer Forms** box.

- [ ] Click **Human**. Sheet portrait = Wren's square rooftop plate. Canvas token = her round plate.
- [ ] Click **Hybrid**. Sheet portrait swaps to the hybrid plate; canvas token swaps to the **round
      hybrid** circle. They are visibly different pictures and both changed.
- [ ] Click **Beast**. Sheet portrait swaps to the raven plate; the canvas token becomes the **round
      raven**.
- [ ] Click **Human** again. Both go back. Nothing is stuck on the beast art.
- [ ] At no point does the **canvas token** become a rectangle, and at no point does the **sheet
      portrait** become a circle. That swap-crossing is the exact bug R2 fixes.

## 4. Changer form swaps — Vira

- [ ] Same three clicks on **Vira Kellis-Nade**. Sheet and token both follow the form.
- [ ] **Fixed in 0.3.121 R2b:** Vira's **Human** token used to be cut from the *hybrid* plate (rat
      ears), so her human↔hybrid swap looked nearly identical on the canvas. It is now cut from
      `assets/pregens/_pre-compress-backup/vira-kellis-nade-human.png`. Check that the **Human**
      token has **no rat ears** and is visibly a different picture from the **Hybrid** token.

## 5. The form art pickers

Still on Wren, in the **Changer Forms** box, below the three form buttons.

- [ ] Each form now shows **two** thumbnails: **PORTRAIT** (square) and **TOKEN** (round), each with
      *Choose Art* and *Clear*.
- [ ] Hover *Choose Art* under Portrait → tooltip says the square sheet portrait. Under Token → it says
      the round canvas token.
- [ ] Click **Clear** under Hybrid → **Token** only. The hybrid *portrait* thumbnail is untouched.
- [ ] Click **Hybrid**. The sheet still swaps to the hybrid portrait, and the canvas token falls back
      to that same portrait rather than breaking. (This is the documented fallback for hand-built
      Changers with no round art.)
- [ ] Re-pick the token: *Choose Art* under Hybrid → Token → browse to
      `modules/draw-steel-ghostwire/assets/tokens/pregens/wren-sable-corvin-hybrid.webp`. The canvas
      token goes round again immediately.
- [ ] A non-owner player sees the pickers **disabled**, not missing.

---

## 6. Nothing else moved

- [ ] A **non-Changer** pregen (Sabbat, Kessic) has no Changer Forms box at all — unchanged.
- [ ] Bestiary, summons, drone, vehicle and Wired node tokens are all exactly as they were. R2 added a
      folder; it did not restamp anything else.
- [ ] Pregen journal dossiers still show the **square** portraits inline.
- [ ] Chat cards, the Chargen Wizard, the kiosk and the Wired Console are unaffected.

---

## Result

- [ ] **PASS** / **FAIL** — date, and anything you want changed before this merges.
