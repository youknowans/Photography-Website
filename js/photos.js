/*
  photos.js — the single list that drives the portfolio gallery.

  To add a photo:
    1. Drop the export in images/full/ and run: python3 optimise-images.py
    2. Add one entry below (newest first — top of the list shows first).

  Fields:
    file   - filename (without folder); same name exists in thumb/ and large/
    alt    - plain description, for accessibility + SEO
    place  - shown in the field-note caption
    frame  - catalogue slug shown in the caption
    category - optional/dormant. Not used for grouping right now, but kept
               so categories can return later with zero data migration.
*/

const PHOTOS = [
  { file: "1000104863.webp", alt: "Figure in a red jacket dwarfed by a vast turquoise ice cave", place: "Werfen Ice Cave, Austria", frame: "PL-001", category: "caves" },
  { file: "1000105221.webp", alt: "Person photographing towering blue ice formations underground", place: "Werfen Ice Cave, Austria", frame: "PL-002", category: "caves" },
  { file: "1000104861.webp", alt: "Visitors descending a railed path through a warm-lit cavern", place: "Werfen Ice Cave, Austria", frame: "PL-003", category: "caves" },
  { file: "1000104862.webp", alt: "Yellow gorse in bloom across rolling green coastal hills", place: "Exmoor Coast, England", frame: "PL-004", category: "highlands" },
  { file: "1000105216.webp", alt: "Misty patchwork of green fields with grazing sheep", place: "Welsh Borders", frame: "PL-005", category: "highlands" },
];
