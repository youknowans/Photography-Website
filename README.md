# Ansaff Ashraff — photography portfolio
# (youknowans.com)

A hand-coded static photography site. Dark, cinematic, image-first.

**Build status:** Rung 1 — static multi-page site running locally.

## Pages
```
index.html          Landing page (hero + scroll-story sections)
portfolio.html      Portfolio (full gallery + lightbox)
about.html          About Me
blog.html           Blog index (list of articles)
blog/first-post.html  Article template — copy it to write a new post
work.html           Work With Me (creative brief -> opens your email)
```

## Structure
```
css/style.css       all styling
css/fonts/          self-hosted fonts (1971.ttf, walkway-black.woff2)
js/photos.js        the photo list — edit to add photos
js/gallery.js       grid + lightbox behaviour (portfolio page)
js/reveal.js        scroll-reveal animations (landing page)
images/full/        your untouched originals
images/large/       auto 1600px (lightbox)
images/thumb/       auto 800px (grid)
optimise-images.py  regenerates large/ + thumb/ from full/
```

## Run locally
```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```
(Opening index.html directly also works, but a local server avoids file:// quirks.)

## Add a photo
1. Drop the export in images/full/
2. python3 optimise-images.py
3. Add one entry to js/photos.js (newest at top)

## Add a blog post
1. Copy blog/first-post.html to blog/your-post.html, write it
2. Add a matching <li> to the list in blog.html

## CHANGE THE FONTS
Two places:
1. css/style.css — the @font-face blocks at the very top point at the files
   in css/fonts/. Drop a new file there and update the src url + family name.
2. css/style.css — :root has the two knobs:
       --font-name   (your name in the masthead)   currently "1971"
       --font-body   (everything else)             currently "Walkway Black"
   Change the family name in these to switch which loaded font is used where.

## THINGS TO PERSONALISE (search for these)
- Social links: replace href="#" in the footer of every page with your real
  Instagram / email URLs.
- Contact email: in work.html, change  MY_EMAIL = "hello@youknowans.com"
- About + blog copy: placeholder text, rewrite in your own voice.
- Photo captions (place / frame): in js/photos.js.

## Roadmap
- Rung 2 — deploy to AWS (S3 + CloudFront + Route 53 + ACM), manual upload
- Rung 3 — GitHub Actions CI/CD: push to deploy, with cache invalidation
- Rung 4 — Terraform IaC + automated image optimisation in the pipeline
