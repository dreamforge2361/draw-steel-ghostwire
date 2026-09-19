#!/usr/bin/env python3
"""Extract embedded images from the Ghostwire Core Sourcebook PDF.

Optional local step (Windows or Linux) after:

    pip install pymupdf

Usage:
    python tools/extract-core-pdf-art.py --pdf "GHOSTWIRE — Core Sourcebook.pdf" \\
        --out docs/manuscript/print-art/from-core-pdf

Skips tiny images (<400 px on the long edge). Does not invent art.
Does not downscale. Credit remains Ghostwire AI.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--pdf", required=True, help="Core Sourcebook PDF path")
    parser.add_argument("--out", required=True, help="Output folder (from-core-pdf)")
    parser.add_argument("--min-edge", type=int, default=400)
    args = parser.parse_args()

    try:
        import fitz  # pymupdf
    except ImportError:
        print("pymupdf is not installed. Run:  pip install pymupdf", file=sys.stderr)
        return 2

    pdf = Path(args.pdf)
    if not pdf.is_file():
        print(f"PDF not found: {pdf}", file=sys.stderr)
        return 1

    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)

    doc = fitz.open(pdf)
    saved = 0
    skipped = 0
    for page_i, page in enumerate(doc, start=1):
        for img_i, img in enumerate(page.get_images(full=True), start=1):
            xref = img[0]
            pix = fitz.Pixmap(doc, xref)
            if pix.n >= 5:
                pix = fitz.Pixmap(fitz.csRGB, pix)
            long_edge = max(pix.width, pix.height)
            if long_edge < args.min_edge:
                skipped += 1
                continue
            name = f"p{page_i:03d}-{img_i:02d}-{pix.width}x{pix.height}.png"
            dest = out / name
            pix.save(dest)
            saved += 1
            print(f"wrote {dest}")
    print(f"Extracted {saved} images (≥{args.min_edge}px). Skipped {skipped} small.")
    print("Review names, then optionally copy cover / class / filler hits into the matching print-art folders.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
