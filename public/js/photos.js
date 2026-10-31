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
  { file: "Scotland-20.webp", alt: "Glenfinnan Viaduct curving across a green hillside above walkers on the track", place: "Glenfinnan, Scottish Highlands", category: "travel" },
  { file: "Scotland-8.webp", alt: "Storm clouds over a moorland valley with small lochans in Glencoe", place: "Glencoe, Scottish Highlands", category: "travel" },
  { file: "Scotland-21.webp", alt: "Highland cow standing among silver birch trees", place: "Scottish Highlands", category: "travel" },
  { file: "Scotland-13.webp", alt: "Snow-flecked peak emerging from cloud above a steep glen", place: "Glencoe, Scottish Highlands", category: "travel" },
  { file: "Scotland-25.webp", alt: "Kilchurn Castle ruins on a loch with a lone Highland cow grazing in the foreground", place: "Kilchurn Castle, Loch Awe", category: "travel" },
  { file: "Scotland-10.webp", alt: "Footpath winding up a misty glen beneath cloud-covered slopes", place: "Glencoe, Scottish Highlands", category: "travel" },
  { file: "Scotland-19.webp", alt: "Man looking out over the Glenfinnan Viaduct from the hillside", place: "Glenfinnan, Scottish Highlands", category: "travel" },
  { file: "Scotland-17.webp", alt: "Vintage cream and green railway carriage with a potted plant by its wheels", place: "Glenfinnan, Scottish Highlands", category: "travel" },
  { file: "Scotland-23.webp", alt: "Shaggy ginger Highland cow in a birch wood", place: "Scottish Highlands", category: "travel" },
  { file: "Scotland-11.webp", alt: "Low cloud pressing down on a wide, empty glen", place: "Glencoe, Scottish Highlands", category: "travel" },
  { file: "Scotland-18.webp", alt: "Calm loch below misty green hills with a small boat", place: "Scottish Highlands", category: "travel" },
  { file: "Scotland-12.webp", alt: "Cloud lifting from a snow-streaked mountain at the head of a glen", place: "Glencoe, Scottish Highlands", category: "travel" },
  { file: "Scotland-24.webp", alt: "Highland cow with a long fringe grazing between birch trunks", place: "Scottish Highlands", category: "travel" },
  { file: "Scotland-7.webp", alt: "Sunlit green hillside under towering clouds beside a Highland road", place: "Scottish Highlands", category: "travel" },
  { file: "Scotland-9.webp", alt: "Moody sky over a boggy valley floor with pools of light", place: "Glencoe, Scottish Highlands", category: "travel" },
  { file: "Scotland-15.webp", alt: "Mist drifting through a glen below a snow-capped summit", place: "Glencoe, Scottish Highlands", category: "travel" },
  { file: "Scotland-22.webp", alt: "Highland cow looking aside from a mossy slope of birches", place: "Scottish Highlands", category: "travel" },
  { file: "Scotland-16.webp", alt: "Rugged glen walls leading to a cloud-wrapped, snow-dusted peak", place: "Glencoe, Scottish Highlands", category: "travel" },
  { file: "Dolomite-1-2.webp", alt: "Jagged dolomite spires rising from a ridge under a blue dusk sky", place: "Dolomites, Italy", category: "travel" },
  { file: "Dolomite-2.webp", alt: "Hiker in a red jacket on a scree slope below purple limestone peaks", place: "Dolomites, Italy", category: "travel" },
  { file: "Dolomite-4.webp", alt: "Mountain hut on a ridge below sunlit limestone cliffs at dawn", place: "Rifugio Locatelli, Dolomites", category: "travel" },
  { file: "Dolomite-1.webp", alt: "Red-jacketed hiker facing layered peaks in soft pink light", place: "Dolomites, Italy", category: "travel" },
  { file: "Dolomite-6.webp", alt: "Whitewashed alpine refuge with red shutters against a deep blue sky", place: "Rifugio Locatelli, Dolomites", category: "travel" },
  { file: "Dolomite-3.webp", alt: "Sunlit Tre Cime towers with a small red-jacketed climber on the rocks below", place: "Tre Cime area, Dolomites", category: "travel" },
  { file: "Dolomite-7.webp", alt: "Dark-roofed hut beneath a golden limestone massif", place: "Rifugio Locatelli, Dolomites", category: "travel" },
  { file: "Dolomite-8.webp", alt: "Weathered rock spires catching warm evening light", place: "Dolomites, Italy", category: "travel" },
  { file: "Dolomite-5.webp", alt: "Small chalet at the foot of a glowing rock wall", place: "Rifugio Locatelli, Dolomites", category: "travel" },
  { file: "Dolomite-10.webp", alt: "Alpine refuge with an exterior staircase in low golden light", place: "Rifugio Locatelli, Dolomites", category: "travel" },
  { file: "Dolomite-9.webp", alt: "Rows of serrated peaks against a clear blue sky", place: "Dolomites, Italy", category: "travel" },
  { file: "Dolomite-13.webp", alt: "Two hikers silhouetted by hazy sunbeams beside a mountain hut", place: "Rifugio Locatelli, Dolomites", category: "travel" },
  { file: "Dolomite-11.webp", alt: "Walkers gathered by the hut below a towering rock face", place: "Rifugio Locatelli, Dolomites", category: "travel" },
  { file: "Dolomite-14.webp", alt: "Two people sitting in a shaft of light through mountain mist", place: "Dolomites, Italy", category: "travel" },
  { file: "Dolomite-12.webp", alt: "Hut roofline against soft misty ridgelines at sunrise", place: "Rifugio Locatelli, Dolomites", category: "travel" },
  { file: "Dolomite-15.webp", alt: "Wooden signpost and prayer flags in drifting cloud", place: "Dolomites, Italy", category: "travel" },
  { file: "1000104863.webp", alt: "Figure in a red jacket dwarfed by a vast turquoise ice cave", place: "Werfen Ice Cave, Austria", category: "travel" },
  { file: "1000105221.webp", alt: "Person photographing towering blue ice formations underground", place: "Werfen Ice Cave, Austria", category: "travel" },
  { file: "1000104861.webp", alt: "Visitors descending a railed path through a warm-lit cavern", place: "Werfen Ice Cave, Austria", category: "travel" },
  { file: "1000104862.webp", alt: "Yellow gorse in bloom across rolling green coastal hills", place: "Exmoor Coast, England", category: "travel" },
  { file: "1000105216.webp", alt: "Misty patchwork of green fields with grazing sheep", place: "Welsh Borders", category: "travel" },
];
