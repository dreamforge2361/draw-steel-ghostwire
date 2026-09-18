# Pregen Portrait Art Notes

Extraction of the eight pregen character portraits from
`docs/masters/pregens/GHOSTWIRE-Dossiers-Fiction.pdf` (95 pages) into
`assets/pregens/` for use as Foundry actor portraits / tokens.

## Method

- Tool: PyMuPDF 1.28.2 (`import pymupdf`), Python 3.14, run from the repo root.
- Script: written to the session scratchpad (not committed); it iterated every
  page with `page.get_images(full=True)`, filtered to images >= 200x200 px, and
  mapped each to a hero by the `Pregen Character Sheet — <name>` heading on the
  same page.
- Result: the PDF contains exactly **eight** embedded raster images, one per
  hero, each on that hero's Pregen Character Sheet page. There are no logos,
  borders, textures or icons as embedded images (the page furniture is vector
  art), so no filtering ambiguity arose.
- Each portrait is an 800x800 PNG with a separate soft-mask (alpha) stream. The
  base image and its SMask were recombined with
  `pymupdf.Pixmap(pix, pymupdf.Pixmap(doc, smask))` and saved as RGBA PNG, so
  transparency outside the circular token frame is preserved. Output is at the
  full native resolution — no upscaling, downscaling, cropping or retouching.
- The source PDF was opened read-only and is unmodified.

## Per-hero record

| Hero (slug) | Character / story | PDF page | xref | Pixels | Output size | Output path |
| --- | --- | --- | --- | --- | --- | --- |
| `vessa-corran-dov` | Vessa Corran-Dov, "the Preacher of Ninth" (Street Priest, Corran) — *The Lamp on Ninth* | 20 | 22 | 800x800 | 1,464,868 B (1.40 MB) | `assets/pregens/vessa-corran-dov.webp` |
| `kaes-vahn-estal` | Kaïs Vahn-Estal, "the Static Saint" (Elementalist, Elvani) — *Rain on the Glass Tier* | 28 | 32 | 800x800 | 1,589,102 B (1.52 MB) | `assets/pregens/kaes-vahn-estal.webp` |
| `krv-9-krow` | KRV-9 "Krow," the Decommissioned Wall (Operator, Cyborg) — *Serial Number* | 37 | 42 | 800x800 | 1,447,979 B (1.38 MB) | `assets/pregens/krv-9-krow.png` |
| `barak-voss-hallor` | Barak Voss-Hallor, "the Foreman" (Commander, Goliar) — *The Weight of the Word* | 46 | 52 | 800x800 | 1,479,945 B (1.41 MB) | `assets/pregens/barak-voss-hallor.webp` |
| `wren-sable-corvin` | Wren Sable-Corvin, "the Kite" (Scout, Changer/Raven) — *The Long Sight* | 55 | 62 | 800x800 | 1,431,909 B (1.37 MB) | `assets/pregens/wren-sable-corvin.webp` |
| `sabbat-vane` | Sabbat Vane, "the Dead Frequency" (Technomancer, Revenant) — *The Dead Frequency* | 64 | 72 | 800x800 | 1,511,574 B (1.44 MB) | `assets/pregens/sabbat-vane.webp` |
| `vira-kellis-nade` | Vira Kellis-Nade, "the Warren-Wire" (Wrench, Changer/Rat) — *Nine Ways Out* | 75 | 84 | 800x800 | 1,442,122 B (1.38 MB) | `assets/pregens/vira-kellis-nade.webp` |
| `kessic-draye` | Kessic Draye, "Null" (Hacker, Mutant) — *Turn Their Own Guns Around* | 87 | 97 | 800x800 | 1,482,726 B (1.41 MB) | `assets/pregens/kessic-draye.webp` |

All output files: PNG, 800x800, RGBA (DeviceRGB + alpha), 8 bits per channel.
The in-PDF base image streams are ~1.25-1.39 MB each; the saved files are
slightly larger because the alpha channel is merged back in and re-encoded.

## Failures

None. All eight heroes have a usable portrait; nothing was skipped.

## Notes for use in Foundry

- Each portrait is already composed as a circular token medallion (neon ring
  frame, rain-slick street backdrop) on a transparent background, so the files
  work as-is for both `img` (actor portrait) and `prototypeToken.texture.src`.
- 800x800 is the native resolution; do not upscale. If pack size matters later,
  convert to WebP from these PNGs rather than re-extracting.
