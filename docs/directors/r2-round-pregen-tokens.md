# R2 — Round pregen canvas tokens (0.3.121)

**What changed in one line:** the sheet portrait and the canvas token are no longer the same file.

Until 0.3.120 every pregen set `actor.img` and `prototypeToken.texture.src` to the *same* square
dossier plate under `assets/pregens/`, so a hero walked onto the battle map as a rectangular photo
while every other Ghostwire token — bestiary, ARG, mule-bot, kiosk — was a circular plate with
transparency. R2 splits the two fields and gives the canvas its own round art.

**Portraits were not touched.** Nothing under `assets/pregens/` was rounded, overwritten or
replaced. The Hero sheet shows exactly the picture it showed on 0.3.120.

---

## What shipped

| | Sheet portrait | Canvas token |
|---|---|---|
| Folder | `assets/pregens/` | `assets/tokens/pregens/` **(new)** |
| Shape | square / rectangular plate | round 1024² WebP, `yuva420p`, alpha |
| Actor field | `img` | `prototypeToken.texture.src` |
| Changer flags | `humanArt` / `hybridArt` / `beastArt` | `humanToken` / `hybridToken` / `beastToken` **(new)** |

Eleven token plates — the seven pregens plus every Changer form:

`barak-voss-hallor`, `kaes-vahn-estal`, `kessic-draye`, `sabbat-vane`, `vessa-corran-dov`,
`vira-kellis-nade-human`, `vira-kellis-nade-hybrid`, `vira-kellis-nade-beast`,
`wren-sable-corvin`, `wren-sable-corvin-hybrid`, `wren-sable-corvin-beast`.

Five of the seven heroes (and Vira's default) come from the print circles Michael already had under
`docs/manuscript/print-art/pregens/*_circle.png` — upscaled 512→1024 with the alpha disc re-cut so
the rim is clean after the resample. Everything else is cut from the highest-resolution plate in the
repo: the pre-compress PNG masters under `assets/pregens/_pre-compress-backup/`, or the 1024×1536
print portraits for Wren (who has no `*_circle` in the bundle at all).

## One thing to look at, Michael

The brief locked `vira_circle → vira-kellis-nade-human`, and that is what shipped. But `vira_circle`
is cut from the **hybrid** plate — it has the rat ears. So today Vira's *human*-form token reads
hybrid, and it is near-identical to her hybrid token, which makes her human↔hybrid swap invisible on
the canvas (her sheet portrait still swaps correctly).

If that is not what you want, it is one row in `SOURCES` (`tools/pregen-round-tokens.mjs`):

```js
{ stem: "vira-kellis-nade-human", circle: `${PRINT}/vira_circle.png` },
// becomes
{ stem: "vira-kellis-nade-human", plate: `${MASTERS}/vira-kellis-nade-human.png` },
```

then `node tools/pregen-round-tokens.mjs --force` and the rebuild below. Nothing else changes.

## Runtime

`syncChangerFormArt` in `scripts/module.mjs` now reads **both** maps and writes them to different
places: `*Art` → `actor.img`, `*Token` → `prototypeToken.texture.src` and every placed token. It
never forces one onto the other — that single shared `src` was the old bug.

A form with no `*Token` falls back to that form's `*Art`, so a hand-built Changer that only has
portraits still swaps its token the way it always did. Hybrid still falls back to Human when it has
no plate of its own, on both halves.

The first Beast swap on a Changer with no `humanArt` still snapshots the current portrait, and now
snapshots the current token alongside it, so Human can swap back to both.

The Hero sheet's **Changer Forms** box gained a round-token picker beside each portrait picker
(Portrait / Token, each with Choose Art + Clear). Clearing one no longer strands the other.

## ffmpeg how-to

`tools/pregen-round-tokens.mjs` is the whole pipeline. It is **ffmpeg only** — Windows ships a
`convert.exe` that is *not* ImageMagick and must never be called here.

```text
node tools/pregen-round-tokens.mjs            # build anything missing
node tools/pregen-round-tokens.mjs --force    # rebuild all eleven
node tools/pregen-round-tokens.mjs --check    # report only, write nothing
```

Per plate it does three things:

1. **crop square** — `crop=S:S:X:Y`, where `S = min(w,h)`. `focusX` / `focusY` on the `SOURCES` row
   pan the crop across the free axis (0 = left/top, 0.5 = centre, 1 = right/bottom). A tall plate
   defaults to **focusY 0**, the top edge, because that is how the print circles were cut —
   `barak_circle.png` lines up pixel-for-pixel with `barak_2048.png` at y = 0. Two 16:9 plates are
   panned by hand: Wren's hybrid to `focusX 0.28`, Vira's rat to `focusX 0.62`.
2. **scale** — `scale=1024:1024:flags=lanczos`.
3. **cut the disc** — `geq` writes the alpha from `hypot(X-512, Y-512)` with a **1.5px feather**
   inside the rim, multiplied by whatever alpha the source already had. A hard cut stair-steps
   visibly once Foundry scales 1024² down to a 100px grid square.

Output is `-c:v libwebp -pix_fmt yuva420p -quality 90`, which is exactly what
`assets/tokens/bestiary/arg/*.webp` and `assets/tokens/drones/mule-bot.webp` already carry.

**To replace a token with hand art instead:** drop a 1024² WebP with alpha into
`assets/tokens/pregens/<stem>.webp` and skip step 1 of the rebuild. The smoke checks the *file*, not
how it was made.

## Rebuild, end to end

Foundry **closed** for the pack step.

```text
node tools/pregen-round-tokens.mjs --force
node tools/pregens-to-actors.mjs
node tools/build-packs.mjs pregens
node tools/r2-pregen-round-tokens-smoke.mjs
node tools/pregen-regen-smoke.mjs
```

> Opening `packs/pregens` read-only (any `classic-level` script, including some smokes) rotates the
> LevelDB manifest and leaves `MANIFEST-00000N` untracked beside the tracked `MANIFEST-000002`. Run
> `node tools/build-packs.mjs pregens` **last** — it wipes and rebuilds the directory deterministically,
> so the tracked triple (`000005.ldb`, `CURRENT`, `MANIFEST-000002`) comes back clean.

## Smokes

- **`node tools/r2-pregen-round-tokens-smoke.mjs`** (new). Eight sections: every stem is 1024² with
  alpha; the alpha really is a disc (corners clear, centre opaque, **77–83% coverage** — a square
  plate returns 100% and fails); the square portraits are still rectangular and still opaque; every
  Actor's `img` is under `assets/pregens/` and its token under `assets/tokens/pregens/` and they are
  different files; Vira and Wren carry all six Changer keys with three distinct tokens;
  `syncChangerFormArt` reads `*Token` for the canvas and `*Art` for the sheet and the pre-R2 shared
  `src` is gone; the generator wires the split; every source plate is still in the repo.
- **`node tools/pregen-regen-smoke.mjs`** (F4, updated). Its old assertion —
  `prototypeToken.texture.src === img` — was the exact thing R2 removes, so it is now the *split*
  assertion instead. Section 10, the byte-for-byte regen no-op, is unchanged and still green.

Foundry checklist: `docs/directors/r2-round-pregen-tokens-smoke-03121.md`.

## Not in scope

No R0 CSS redo, no R1 inside-cover, no R3 B103 palette/gender, no PDF rebuild, no Renown. No pregen
mechanics changed — this pass touches art paths, the art-swap runtime and the art pickers, nothing else.
