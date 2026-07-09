#!/usr/bin/env python3
"""
optimise-images.py — the repeatable "add a photo" step for Rung 1.

What it does:
  Reads every original from images/full/ and writes two web-optimised
  versions per photo:
    - images/thumb/  (max 800px on long edge)  -> used in the gallery grid
    - images/large/  (max 1600px on long edge) -> used in the lightbox

Your originals in images/full/ are never modified.

Usage:
    python3 optimise-images.py

Workflow to add new photos later:
    1. Export from Lightroom, drop the file(s) into images/full/
    2. Run this script
    3. Add an entry to js/photos.js (filename, category, alt)
That's it. (Rung 4 will automate steps 2-3; for now they're one command + one line.)
"""

from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).parent
FULL = ROOT / "images" / "full"
THUMB = ROOT / "images" / "thumb"
LARGE = ROOT / "images" / "large"

SIZES = {THUMB: 800, LARGE: 1600}
QUALITY = 82  # WebP quality: good balance of size vs visible quality

def process():
    THUMB.mkdir(parents=True, exist_ok=True)
    LARGE.mkdir(parents=True, exist_ok=True)

    originals = sorted(
        p for p in FULL.iterdir()
        if p.suffix.lower() in {".webp", ".jpg", ".jpeg", ".png"}
    )
    if not originals:
        print("No images found in images/full/. Drop your exports there first.")
        return

    for src in originals:
        # ImageOps.exif_transpose respects camera rotation metadata
        with Image.open(src) as im:
            im = ImageOps.exif_transpose(im)
            im = im.convert("RGB")
            for out_dir, max_edge in SIZES.items():
                copy = im.copy()
                copy.thumbnail((max_edge, max_edge), Image.LANCZOS)
                out_path = out_dir / (src.stem + ".webp")
                copy.save(out_path, "WEBP", quality=QUALITY, method=6)
                kb = out_path.stat().st_size / 1024
                print(f"  {out_path.relative_to(ROOT)}  ({copy.width}x{copy.height}, {kb:.0f}KB)")
        print(f"done: {src.name}")

    print("\nAll images optimised. Remember to add new ones to js/photos.js.")

if __name__ == "__main__":
    process()
