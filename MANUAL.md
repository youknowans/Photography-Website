# Website Owner's Manual — ansaffashraff / youknowans.com

Everything you need to edit the site yourself, without touching anything
you don't understand. Keep this file in the repo.

**Golden rules before you edit anything:**

1. Edit one thing, save, refresh the browser, check it worked. Small steps.
2. Run the site with `python3 -m http.server 8000` and view it at
   `http://localhost:8000` while editing.
3. Commit to git after each working change (`git add -A && git commit -m "..."`).
   Then any mistake is one `git checkout` away from undone.
4. In HTML, text lives *between* tags: `<p>your words here</p>`. Change the
   words, never delete the tags around them.

---

## 1. Changing fonts (typeface, size, spacing, everything)

All typography lives in **`css/style.css`**. There are two levels of control.

### 1a. Swap which typeface is used

At the top of `css/style.css` (~line 42) are the three font "knobs":

```css
--font-name: "1971", Impact, sans-serif;          /* your name only   */
--font-body: "Walkway Black", system-ui, sans-serif; /* everything else */
--font-mono: ui-monospace, "SF Mono", Menlo, monospace; /* captions/labels */
```

Every element on the site points at one of these three variables, so
changing a line here changes that font *everywhere at once*.

**To use a new font file you downloaded:**

1. Put the file (`.woff2` preferred, `.ttf` fine) in `css/fonts/`
2. Add an `@font-face` block at the very top of `style.css`, copying the
   existing pattern:
   ```css
   @font-face {
     font-family: "My New Font";        /* you choose this name */
     src: url("fonts/my-new-font.woff2") format("woff2"); /* or format("truetype") for .ttf */
     font-weight: normal;
     font-style: normal;
     font-display: swap;
   }
   ```
3. Point a knob at it: `--font-body: "My New Font", system-ui, sans-serif;`

The words after the first font (`Impact`, `sans-serif`, etc.) are the
**fallback chain** — what the browser uses if your font fails to load.
Always keep a generic (`sans-serif` or `monospace`) as the last item.

### 1b. Change size / spacing / weight of a specific element

Find the element's CSS block in `style.css` and edit its properties.
The names map like this:

| What you see on the site        | CSS selector in style.css |
|---------------------------------|---------------------------|
| Your name, top-left             | `.brand`                  |
| Your name on the hero image     | `.hero-title`             |
| Nav links (Portfolio, About...) | `.nav`                    |
| Page headings (COLD LIGHT...)   | `.page-head h1`           |
| Landing section headings        | `.story-text h2`          |
| Body paragraphs                 | `.prose p`                |
| Small cyan labels/captions      | `.story-kicker`, `.tile-cap`, `.field label` |

Properties you'll actually use:

```css
font-size: 1.2rem;        /* size. rem = multiples of base size (16px). 1.2rem ≈ 19px */
letter-spacing: 0.05em;   /* space between letters */
line-height: 1.6;         /* space between lines of a paragraph */
text-transform: uppercase;/* or lowercase, or delete the line for as-typed */
color: var(--paper);      /* see the colour variables at the top of the file */
```

Some sizes look like `clamp(1.8rem, 4vw, 2.8rem)` — that means
"minimum 1.8rem, scale with screen width (4vw), never bigger than 2.8rem".
Adjust the first and last numbers; leave the middle one alone unless you
know why.

**Tip:** in the browser, right-click any text → Inspect. The Styles panel
shows exactly which selector styles it — then search that name in
`style.css`.

---

## 2. Adding hyperlinks

A link is one tag:

```html
<a href="DESTINATION">the clickable text</a>
```

Three kinds of destination:

| Link to...                  | href looks like                          |
|-----------------------------|------------------------------------------|
| Another page on your site   | `href="about.html"`                      |
| An external website         | `href="https://example.com"`             |
| An email address            | `href="mailto:you@example.com"`          |

**Rules of thumb:**

- External links should open a new tab and get a security attribute:
  ```html
  <a href="https://example.com" target="_blank" rel="noopener">text</a>
  ```
- Linking **from a blog post** (which lives in the `blog/` folder), paths to
  your own pages need `../` to climb out first: `href="../about.html"`,
  `href="../images/large/photo.webp"`.
- Links inside paragraphs are automatically styled cyan+underline by the
  `.prose a` rule. No extra work.

**Your social icons** (bottom-right of every page): search each HTML file
for `href="#"` and replace `#` with your real profile URLs, e.g.
`href="https://instagram.com/yourhandle"`. There is one Instagram and one
email icon per page footer. To add another icon (e.g. LinkedIn), copy one
whole `<a>...</a>` block inside `<div class="socials">` and swap in a new
SVG icon (search "simple icons svg" for free ones).

---

## 3. Changing the background / hero images

### The hero image (big landing-page photo)

In **`index.html`** (~line 25):

```html
<img class="hero-img" src="images/large/1000104863.webp" alt="..." />
```

Change the filename in `src` to any file that exists in `images/large/`.
Update the `alt` text to describe the new photo. That's it.

If the important part of the new photo is cropped oddly on some screens,
adjust in `style.css` under `.hero-img`:

```css
object-position: center 40%;  /* horizontal vertical — 40% = focus toward the top.
                                 Try center 60% to bias lower, etc. */
```

### The landing-section teaser images

Also in `index.html` — each `<section class="story">` has one or two
`<img src="images/thumb/...">` lines. Swap the filenames the same way.

### The page background

The dark background isn't an image — it's a colour + subtle gradient set on
`body` in `style.css`. To change the base colour, edit `--ground` in the
`:root` block at the top. All the site colours are variables there
(`--ice`, `--rock`, `--paper`...) — change once, applies everywhere.

---

## 4. Adding new photos to the portfolio

The three-step loop, every time:

1. **Export** from Lightroom and drop the file into `images/full/`
   (any of .jpg, .png, .webp — keep filenames simple: lowercase, no spaces).
2. **Optimise** — from the project folder run:
   ```bash
   python3 optimise-images.py
   ```
   This creates a small grid version in `images/thumb/` and a lightbox
   version in `images/large/`. Your original in `full/` is never touched.
3. **Register it** — open `js/photos.js` and add one entry to the top of
   the `PHOTOS` list (top = shows first in the gallery):
   ```js
   { file: "my-new-photo.webp", alt: "Plain description of the photo",
     place: "Lofoten, Norway", frame: "PL-006", category: "travel" },
   ```
   - `file` — the filename only (no folder). Note the optimiser always
     outputs `.webp`, so if you dropped in `photo.jpg`, write `photo.webp` here.
   - `alt` — describe the image (used by screen readers and Google).
   - `place` / `frame` — the caption shown on hover and in the lightbox.
     The frame numbering scheme is yours; keep it consistent.
   - `category` — currently unused (grouping is off) but keep filling it in;
     costs nothing and enables categories later.

Refresh `portfolio.html` — the photo appears, lightbox included. Nothing
else to edit.

---

## 5. Changing photo resolution / size

### The generated web versions

Open **`optimise-images.py`** and find:

```python
SIZES = {THUMB: 800, LARGE: 1600}
QUALITY = 82
```

- `800` — max long-edge pixels for grid thumbnails.
- `1600` — max long-edge for lightbox images. Increase to 2000–2400 if you
  want more detail on large screens (files get bigger; keep an eye on it).
- `QUALITY` — WebP compression, 0–100. 75–85 is the sweet spot. Higher =
  sharper but heavier files = slower site.

After changing numbers, re-run `python3 optimise-images.py` — it
regenerates every thumb and large image from your untouched originals.

### How big photos *display* on screen

That's CSS, not the script:

- Grid: column count in `style.css` under `.grid`
  (`column-count: 3;` — change to 2 for bigger tiles, 4 for smaller;
  the `@media` lines below it control tablet/phone).
- Lightbox: under `#lb-img`, `max-height: 82vh` (percent of screen height)
  and `max-width: min(92vw, 1200px)`.

**Rule of thumb:** serve images at roughly the pixels they'll display at.
A 3-column grid on a 1320px-wide site shows tiles ~430px wide, so 800px
thumbnails are already generous (crisp on retina screens).

---

## 6. Adding new blog posts

Two steps per post:

**Step 1 — create the post file.**
Copy `blog/first-post.html` → `blog/your-post-name.html`
(lowercase-with-hyphens; the filename becomes the URL). Inside, edit:

- `<title>` in the `<head>` (shows in the browser tab / Google)
- The `eyebrow` line (date) and `<h1>` (post title) near the top
- Everything inside `<article class="prose">` — see section 7 for the
  writing patterns

**Step 2 — list it on the blog index.**
Open `blog.html`, find `<ul class="post-list">`, copy an existing
`<li>...</li>` block, paste it at the **top** of the list (newest first),
and edit:

```html
<li>
  <a href="blog/your-post-name.html">
    <span class="post-date">2026 · 08</span>
    <span class="post-title">Your Post Title</span>
    <span class="post-blurb">One-line description shown in the list.</span>
  </a>
</li>
```

**Remember:** files inside `blog/` reach the rest of the site with `../`
(`../css/style.css`, `../images/large/...`, `../about.html`). The template
already has this right — keep the pattern when adding images/links.

*When hand-writing HTML posts becomes tedious (likely 15–20 posts in),
that's the signal to move to a static-site generator. Not before.*

---

## 7. Editing existing text on any page

Text always sits between an opening and closing tag. Change the words,
keep the tags:

```html
<p>Old sentence.</p>   →   <p>Your new sentence.</p>
```

Where the text lives, per page:

| Page                | File            | The text you'd edit |
|---------------------|-----------------|---------------------|
| Landing sections    | `index.html`    | Inside each `<section class="story">`: the `<h2>`, the `<p>`, the link text |
| Hero name/subtitle  | `index.html`    | `.hero-title` and `.hero-sub` lines |
| About               | `about.html`    | Inside `<article class="prose">` |
| Blog index blurbs   | `blog.html`     | The `<span>`s inside each `<li>` |
| Blog posts          | `blog/*.html`   | Inside `<article class="prose">` |
| Work With Me intro  | `work.html`     | The `<p class="lead">`; also the form labels and the `<option>` list |
| Footer              | every page      | The `<footer class="site-foot">` block (edit on each page to keep them matching) |

Writing patterns inside `prose` articles:

```html
<p>A normal paragraph.</p>
<p class="lead">A bigger intro paragraph (use once, at the top).</p>
<h2>A section heading</h2>
<a href="../about.html">a link</a>
<img src="../images/large/photo.webp" alt="description" />
```

Three characters are special in HTML and must be written as codes if you
want them to *appear* as text: `<` → `&lt;`, `>` → `&gt;`, `&` → `&amp;`.
Normal punctuation and apostrophes are fine as-is.

---

## 8. Pointing the contact form at your real email

Open **`work.html`** and find this line (~line 71, near the bottom):

```js
var MY_EMAIL = "hello@youknowans.com";
```

Replace the address with your dedicated one. Done — the "Open in email"
button builds a pre-filled message to that address.

Also update the footer **email icon** on each page: change its
`href="#"` to `href="mailto:your@email.com"`.

**How it works / its limits:** this is a `mailto:` form — it opens the
*visitor's* email app with the brief pre-filled. Nothing is sent by the
website itself, so there's nothing to break and no spam risk — but a
visitor with no email app configured on their device will hit a dead end.
If that ever bothers you, the upgrade is a free form service (e.g.
Formspree): you'd swap the button's JavaScript for a real `<form>` that
posts to their URL. That's a 15-minute change we can do at any rung.

---

## Quick reference — which file does what

```
index.html            landing page (hero, story sections)
portfolio.html        full gallery
about.html            about page
blog.html             blog index (the list)
blog/*.html           individual posts
work.html             contact form  ← MY_EMAIL lives here
css/style.css         ALL styling: fonts, colours, sizes, layout
css/fonts/            font files
js/photos.js          THE photo list ← edit to add photos
js/gallery.js         gallery + lightbox logic (rarely touch)
js/reveal.js          scroll animations (rarely touch)
images/full/          your originals (never modified)
images/thumb|large/   generated web versions (never edit by hand)
optimise-images.py    regenerates thumb/large ← SIZES and QUALITY here
```

If something breaks and you can't see why: `git diff` shows exactly what
you changed since the last commit, and `git checkout -- path/to/file`
restores that file to the last committed version.
