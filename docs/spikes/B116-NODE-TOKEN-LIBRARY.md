# Spike B116 — Node token library (Director picker)

**Date:** 2026-09-20  
**Module:** catalog + asset layout in **0.3.48**; picker UI **follow-up**  
**Status:** **SPIKE LIVE** (do not block B112 / B113 / B114 / B115)  
**Pairs with:** B113 Light Control / Maglock art (shipped).

## Goal

Michael will send more node token styles. Directors pick a style from the **Wired Console** when placing or editing a node. Auto Light Control / Maglock keep their B113 defaults.

## This module (0.3.48) — drop-in only

No picker UI. Structure so adding art is drop-in:

| Path | Role |
|---|---|
| `assets/tokens/wired/` | All node styles (png source + 1024² webp) |
| `assets/tokens/wired/library.json` | Catalog. Append a `styles[]` row when a file lands. |
| `assets/tokens/wired/README.md` | Drop-in steps |
| `scripts/wired-node-art.mjs` | Path helper + locked B113 ids |
| Board node `tokenStyle` | Optional slug, preserved by `getBoard`. Auto-nodes set `light-control` / `maglock`. |

**Drop-in:** `<id>.png` + `<id>.webp` + `library.json` row. `tokenArtForNode` resolves locked ids via B113 filenames, other ids as `assets/tokens/wired/<id>.webp`. Place on canvas already uses that helper.

## Follow-up (picker)

Wired Console selected-node panel: style `<select>` from `library.json` (fetch at render). Write `tokenStyle`. Place / re-place stamps `texture.src`. Empty / “Generic Track” = summons Track 1/2 template.

Auto-nodes: if `tokenStyle` is unset, keep B113 `AUTO_NODE_TOKEN_ART`. Do not overwrite a Director override on Skip re-run.

Out of scope until then: minimap glyphs per style; B113 file renames; Gold Line live-scene rewrite.

## Verify (now)

```text
node tools/b112-b115-smoke.mjs
```

Library JSON is BOM-free; every listed style has png + webp; locked autoKind paths match `AUTO_NODE_TOKEN_ART`.
