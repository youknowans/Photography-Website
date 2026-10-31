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
];
