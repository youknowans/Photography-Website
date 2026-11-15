#!/usr/bin/env python3
"""
optimise-images.py

Turns Lightroom exports into the portfolio, with no hand-editing.

    images/full/          ->  your exports, untouched (stays local, git-ignored).
                              Subfolders are fine (e.g. Lightroom's "Untitled Export").
                              images/full/journal/ is special: resized for journal posts
                              but NOT added to the portfolio.
    public/images/thumb/  ->  1000px long edge, quality 85, used in the grid
    public/images/large/  ->  2560px long edge, quality 92, used in the lightbox
    public/js/photos.js   ->  rewritten every run (do not edit by hand)

What it reads from each export (fill these in Lightroom's Metadata panel):

    Caption              ->  alt text (description for screen readers and search engines)
    City, Country        ->  place   (IPTC "Image" section, NOT "Contact")
    Keywords             ->  categories, one filter tab each. Several = several tabs.
    Category (optional)  ->  also used as categories, split on spaces/commas
    Capture date         ->  order on the site, newest first (saved in photos.js)
    Lens, f/, shutter, ISO -> settings line under the caption (from camera EXIF)

Usage:
    python3 optimise-images.py            # process new or re-exported photos, rebuild photos.js
    python3 optimise-images.py --force    # re-make every web image

Once a photo is on the site it stays there, even if you later delete its export from
images/full/: its details are carried over from the existing photos.js. To take a photo
down, delete its .webp from public/images/thumb and public/images/large, then run again.
To change a photo or its caption, re-export it into images/full/ and run again.

Privacy: EXIF/GPS metadata is dropped from the web images by design, so the published
copies carry no location, camera serial number or editing history. Only the fields
listed above are copied into photos.js. Originals never leave your computer.

Requires Pillow:  python3 -m pip install --user pillow
"""

import io
import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

try:
    from PIL import Image, ImageCms, ImageOps
except ImportError:
    sys.exit("Pillow is not installed. Run:  python3 -m pip install --user pillow")

ROOT = Path(__file__).parent
FULL = ROOT / "images" / "full"
THUMB = ROOT / "public" / "images" / "thumb"
LARGE = ROOT / "public" / "images" / "large"
PHOTOS_JS = ROOT / "public" / "js" / "photos.js"

SIZES = {  # folder: (max long-edge px, webp quality)
    THUMB: (1000, 85),
    LARGE: (2560, 92),
}
ACCEPT = {".jpg", ".jpeg", ".png", ".tif", ".tiff", ".webp"}

NS = {
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "dc": "http://purl.org/dc/elements/1.1/",
    "photoshop": "http://ns.adobe.com/photoshop/1.0/",
    "xmp": "http://ns.adobe.com/xap/1.0/",
}


# ---------- metadata ----------------------------------------------------------

def read_xmp(path: Path) -> dict:
    """Pull caption, place, categories and date from the XMP block Lightroom embeds."""
    data = path.read_bytes()
    m = re.search(rb"<x:xmpmeta.*?</x:xmpmeta>", data, re.S)
    meta = {"alt": "", "place": "", "tags": [], "date": ""}
    if not m:
        return meta
    try:
        root = ET.fromstring(m.group(0))
    except ET.ParseError:
        return meta

    descs = root.findall(".//rdf:Description", NS)

    def simple(prefix, name):
        """A property stored either as an attribute or as a child element."""
        key = "{%s}%s" % (NS[prefix], name)
        for d in descs:
            if key in d.attrib:
                return d.attrib[key].strip()
            el = d.find(f"{prefix}:{name}", NS)
            if el is not None and el.text and el.text.strip():
                return el.text.strip()
        return ""

    def items(prefix, name):
        """A list property (rdf:Alt / rdf:Bag / rdf:Seq)."""
        for d in descs:
            el = d.find(f"{prefix}:{name}", NS)
            if el is not None:
                return [li.text.strip() for li in el.iter("{%s}li" % NS["rdf"]) if li.text and li.text.strip()]
        return []

    caption = items("dc", "description") or items("dc", "title")
    meta["alt"] = caption[0] if caption else ""

    # The photo's location (IPTC "Image" section). The "Contact" country is the
    # photographer's own address, so it is deliberately ignored.
    city, country = simple("photoshop", "City"), simple("photoshop", "Country")
    meta["place"] = ", ".join(p for p in (city, country) if p)

    raw = items("dc", "subject") + re.split(r"[,\s]+", simple("photoshop", "Category"))
    tags = []
    for word in raw:
        t = slug(word)
        if t and t not in tags:
            tags.append(t)
    meta["tags"] = tags

    meta["date"] = simple("photoshop", "DateCreated") or simple("xmp", "CreateDate")
    return meta


def read_settings(path: Path) -> str:
    """Lens | aperture, shutter | ISO from the camera EXIF, e.g.
    'XF56mmF1.2 R | f/2.8, 1/250s | ISO 160'. Serial numbers are never read."""
    try:
        with Image.open(path) as im:
            ex = im.getexif().get_ifd(0x8769)          # Exif sub-IFD
    except Exception:
        return ""
    lens = str(ex.get(0xA434, "")).strip("\x00 ")     # LensModel
    f, t, iso = ex.get(0x829D), ex.get(0x829A), ex.get(0x8827)  # FNumber, ExposureTime, ISO

    exposure = []
    if f:
        exposure.append(f"f/{float(f):g}")
    if t:
        t = float(t)
        exposure.append(f"1/{round(1 / t)}s" if 0 < t < 1 else f"{t:g}s")
    if isinstance(iso, (tuple, list)):
        iso = iso[0] if iso else None
    parts = [lens, ", ".join(exposure), f"ISO {iso}" if iso else ""]
    return " | ".join(p for p in parts if p)


def slug(text: str) -> str:
    """'Street Photography' -> 'street-photography' (safe for filenames and tags)."""
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


# ---------- images ------------------------------------------------------------

def process(src: Path, out_name: str, force: bool) -> bool:
    """Write thumb + large for one source file. Returns True if anything was written."""
    targets = {folder: folder / out_name for folder in SIZES}
    src_time = src.stat().st_mtime
    if not force and all(t.exists() and t.stat().st_mtime >= src_time for t in targets.values()):
        return False                              # up to date (re-exports are picked up)

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
            copy.save(targets[folder], "WEBP", quality=quality, method=6)  # no metadata is written
    return True


# ---------- photos.js ---------------------------------------------------------

HEADER = """/*
  photos.js: GENERATED by optimise-images.py. Do not edit by hand; changes are
  overwritten on the next run. Edit the photo's metadata in Lightroom instead,
  re-export into images/full/, and run:  python3 optimise-images.py

  Fields: file (in images/thumb and images/large), w and h (grid image size in
  pixels, so the page knows each photo's shape), date (capture date, used only
  to keep the newest first), alt (Lightroom Caption),
  place (City, Country), category (Keywords, space separated; one tab each),
  settings (Lens | aperture, shutter | ISO, read from the camera data).
*/
"""


FIELDS = ("file", "w", "h", "date", "alt", "place", "category", "settings")


def read_photos_js() -> list:
    """The photos currently listed in photos.js, so ones whose original has been
    deleted can stay on the site. Anything unreadable is skipped."""
    if not PHOTOS_JS.exists():
        return []
    decoder, entries = json.JSONDecoder(), []
    for line in PHOTOS_JS.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not (line.startswith("{ file:") and line.endswith("},")):
            continue
        body, pos, entry = line[1:-2].strip(), 0, {}
        try:
            while pos < len(body):
                m = re.compile(r"[\s,]*([a-z]+):\s*").match(body, pos)
                if not m:
                    break
                entry[m.group(1)], pos = decoder.raw_decode(body, m.end())
        except ValueError:
            continue
        if re.fullmatch(r"[A-Za-z0-9._-]+\.webp", str(entry.get("file", ""))):
            entries.append(entry)
    return entries


def write_photos_js(entries: list) -> None:
    lines = []
    for e in entries:
        fields = ", ".join(f"{k}: {json.dumps(e.get(k, ''), ensure_ascii=False)}" for k in FIELDS)
        lines.append(f"  {{ {fields} }},")
    PHOTOS_JS.write_text(HEADER + "const PHOTOS = [\n" + "\n".join(lines) + ("\n" if lines else "") + "];\n", encoding="utf-8")


# ---------- main --------------------------------------------------------------

def main() -> None:
    force = "--force" in sys.argv
    if not FULL.exists():
        sys.exit(f"No {FULL} folder found. Create it and export your photos into it.")

    previous = read_photos_js()                    # read before anything is rewritten
    sources = sorted(p for p in FULL.rglob("*") if p.is_file() and p.suffix.lower() in ACCEPT and not p.name.startswith("."))

    entries, seen, problems = [], {}, []
    for src in sources:
        name = slug(src.stem) + ".webp"
        rel = src.relative_to(FULL)
        if name in seen:
            problems.append(f"{rel}: same name as {seen[name]}, skipped. Rename one in Lightroom.")
            continue
        seen[name] = rel

        status = "done" if process(src, name, force) else "same"
        if rel.parts[0].lower() == "journal":          # journal-only: resized, not in the portfolio
            print(f"  {status}  {rel}  ->  journal only, use as  {name}")
            continue

        meta = read_xmp(src)
        print(f"  {status}  {rel}  ->  {', '.join(meta['tags']) or 'no categories'}")

        if not meta["alt"]:
            problems.append(f"{rel}: no Caption (alt text). Add one in Lightroom for accessibility.")
        if not meta["tags"]:
            problems.append(f"{rel}: no Keywords, so it only appears under 'All'.")
        with Image.open(THUMB / name) as t:            # the grid lays tiles out from this shape
            w, h = t.size
        entries.append({"file": name, "w": w, "h": h, "alt": meta["alt"], "place": meta["place"],
                        "category": " ".join(meta["tags"]), "settings": read_settings(src),
                        "date": meta["date"]})

    # Photos already on the site whose original is no longer in images/full stay
    # on the site, as long as their web image still exists.
    kept = []
    for old in previous:
        name = old["file"]
        if name in seen or not (THUMB / name).exists():
            continue
        if not (old.get("w") and old.get("h")):
            with Image.open(THUMB / name) as t:
                old["w"], old["h"] = t.size
        old.setdefault("date", "")
        kept.append(name)
        entries.append(old)

    # Newest capture first. Photos with no recorded date keep their old order, at the end.
    entries.sort(key=lambda e: e["date"], reverse=True)
    write_photos_js(entries)

    listed = {e["file"] for e in entries}
    orphans = sorted(p.name for p in THUMB.glob("*.webp") if p.name not in seen and p.name not in listed) if THUMB.exists() else []
    tags = sorted({t for e in entries for t in e["category"].split()})
    print(f"\n{len(entries)} photo(s) written to public/js/photos.js")
    print(f"Categories: {', '.join(tags) or 'none'}")
    for p in problems:
        print(f"  ! {p}")
    if kept:
        print(f"  {len(kept)} photo(s) kept on the site without an original in images/full.")
        print("    To take one down, delete its .webp from public/images/thumb and public/images/large, then run this again.")
    if orphans:
        print(f"  ! Web images not in the portfolio (fine if a journal post or the Contact page uses them): {', '.join(orphans)}")
    print()


if __name__ == "__main__":
    main()
