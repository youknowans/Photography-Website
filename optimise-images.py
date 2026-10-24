#!/usr/bin/env python3
"""
optimise-images.py

Turns Lightroom exports into web-ready versions.

    images/full/          ->  your exports, untouched (stays local, git-ignored)
    public/images/thumb/  ->  1000px long edge, quality 85, used in the grid
    public/images/large/  ->  2560px long edge, quality 92, used in the lightbox (sharp on large and retina screens)

Usage:
    python3 optimise-images.py            # process anything new in images/full/
    python3 optimise-images.py --force    # rebuild everything

Then paste the printed lines into public/js/photos.js and fill in alt/place/category.

Privacy: EXIF/GPS metadata is dropped by design, so the published copies carry no
location, camera serial number or editing history. Originals never leave your computer.

Requires Pillow:  pip install pillow
"""

import io
import sys
from pathlib import Path

try:
    from PIL import Image, ImageCms, ImageOps
except ImportError:
    sys.exit("Pillow is not installed. Run:  pip install pillow")

ROOT = Path(__file__).parent
FULL = ROOT / "images" / "full"
THUMB = ROOT / "public" / "images" / "thumb"
LARGE = ROOT / "public" / "images" / "large"

SIZES = {  # folder: (max long-edge px, webp quality)
    THUMB: (1000, 85),
    LARGE: (2560, 92),
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
        icc = im.info.get("icc_profile")
        if icc:                                   # wide-gamut export (Display P3, AdobeRGB)?
            try:                                  # convert to sRGB so colours match what you graded
                im = ImageCms.profileToProfile(
                    im,
                    ImageCms.ImageCmsProfile(io.BytesIO(icc)),
                    ImageCms.createProfile("sRGB"),
                    outputMode="RGB",
                )
            except Exception:
                pass                              # unreadable profile: carry on as-is
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
