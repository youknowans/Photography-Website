#!/usr/bin/env python3
"""
optimise-images.py

Turns Lightroom exports into web-ready versions.

    images/full/          ->  your exports, untouched (stays local, git-ignored)
    public/images/thumb/  ->  800px wide .webp, used in the grid
    public/images/large/  ->  1600px wide .webp, used in the lightbox

Usage:
    python3 optimise-images.py            # process anything new in images/full/
    python3 optimise-images.py --force    # rebuild everything

Then paste the printed lines into public/js/photos.js and fill in alt/place/category.

Privacy: EXIF/GPS metadata is dropped by design, so the published copies carry no
location, camera serial number or editing history. Originals never leave your computer.

Requires Pillow:  pip install pillow
"""

import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Pillow is not installed. Run:  pip install pillow")

ROOT = Path(__file__).parent
FULL = ROOT / "images" / "full"
THUMB = ROOT / "public" / "images" / "thumb"
LARGE = ROOT / "public" / "images" / "large"

SIZES = {  # folder: (max long-edge px, webp quality)
    THUMB: (800, 80),
    LARGE: (1600, 82),
}
ACCEPT = {".jpg", ".jpeg", ".png", ".tif", ".tiff", ".webp"}


def process(src: Path, force: bool) -> bool:
    """Write thumb + large for one source file. Returns True if anything was written."""
    out_name = src.stem + ".webp"
    targets = {folder: folder / out_name for folder in SIZES}

    if not force and all(t.exists() for t in targets.values()):
        return False

    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im)          # respect rotation from camera
        if im.mode not in ("RGB", "L"):
            im = im.convert("RGB")                # drop alpha / CMYK / etc.

        for folder, (max_edge, quality) in SIZES.items():
            folder.mkdir(parents=True, exist_ok=True)
            copy = im.copy()
            copy.thumbnail((max_edge, max_edge), Image.LANCZOS)   # keeps aspect, never upsizes
            copy.save(targets[folder], "WEBP", quality=quality, method=6)  # method=6: smallest files
    return True


def main() -> None:
    force = "--force" in sys.argv
    if not FULL.exists():
        sys.exit(f"No {FULL} folder found. Create it and drop your exports in.")

    sources = sorted(p for p in FULL.iterdir() if p.suffix.lower() in ACCEPT)
    if not sources:
        sys.exit(f"Nothing to process in {FULL}.")

    written = []
    for src in sources:
        if process(src, force):
            written.append(src.stem)
            print(f"  done  {src.name}")
        else:
            print(f"  skip  {src.name}  (already optimised, use --force to redo)")

    if written:
        print("\nPaste into public/js/photos.js (fill in alt, place and category):\n")
        for stem in written:
            print(f'  {{ file: "{stem}.webp", alt: "", place: "", category: "travel" }},')
    print()


if __name__ == "__main__":
    main()
