/*
  photos.js: the single list that drives the portfolio gallery.

  To add a photo:
    1. Put the export in images/full/ (stays on your computer) and run:
         python3 optimise-images.py
    2. Paste the line it prints below (newest first: the top shows first).

  Fields:
    file      filename only; the same name exists in public/images/thumb and /large
    alt       plain description for screen readers and search engines
    place     optional, where it was taken
    category  one or more of: travel portraits lifestyle (space separated).
              A new tab appears on its own as soon as a photo uses it.
*/
const PHOTOS = [
  { file: "1000104863.webp", alt: "Figure in a red jacket dwarfed by a vast turquoise ice cave", place: "Werfen Ice Cave, Austria", category: "travel" },
  { file: "1000105221.webp", alt: "Person photographing towering blue ice formations underground", place: "Werfen Ice Cave, Austria", category: "travel" },
  { file: "1000104861.webp", alt: "Visitors descending a railed path through a warm-lit cavern", place: "Werfen Ice Cave, Austria", category: "travel" },
  { file: "1000104862.webp", alt: "Yellow gorse in bloom across rolling green coastal hills", place: "Exmoor Coast, England", category: "travel" },
  { file: "1000105216.webp", alt: "Misty patchwork of green fields with grazing sheep", place: "Welsh Borders", category: "travel" },
];
