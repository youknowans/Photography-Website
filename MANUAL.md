# Owner's manual

Everything below happens in the `public/` folder unless stated otherwise.

## Preview before you publish

```
npm run dev
```
Open http://localhost:8787. Leave DevTools open on the Network tab with "Disable cache" ticked while editing, otherwise the browser may show an old copy of a file.

## Add photos

1. Export from Lightroom at high quality: JPEG quality 90 to 100, sRGB, full resolution (or at least 3000 px on the long edge). Never export a smaller or lower-quality copy first: the script can only shrink, never restore detail.
2. Put the files in `images/full/` (create the folder if needed). It is git-ignored, so originals never leave your computer.
3. Run `pip install pillow` once, then `python3 optimise-images.py` (on Windows try `py optimise-images.py`).
4. It creates two web versions: a 1000 px grid image and a 2560 px lightbox image (high quality, converted to sRGB so colours match your grade). It removes all metadata (including GPS) and prints one line per photo.
5. Paste those lines at the top of `public/js/photos.js` and fill in `alt`, `place` and `category`.
6. `git add -A`, commit, `git push`.

`alt` is a plain description for screen readers ("Figure in a red jacket dwarfed by a turquoise ice cave"). Newest photos go at the top.

## Categories

`category` takes one or more words separated by spaces: `travel`, `portraits`, `lifestyle`.

```js
{ file: "gion.webp", alt: "...", category: "travel lifestyle" }
```
That photo shows under both tabs. The tab bar appears on its own once two or more categories are in use, and a tab with no photos stays hidden. Spell categories in lowercase exactly as above. To add a new one (say `architecture`), use it in `photos.js` and add one line to the tab list in `index.html`:
```html
<button data-filter="architecture" aria-pressed="false">Architecture</button>
```

## Write a journal post

1. Copy `templates/journal-post.html` to `public/posts/my-post.html` and replace the capitalised placeholders.
2. Add the entry to `public/js/entries.js` (see the example in the file). `href` must start with `/posts/`.
3. The tag you choose becomes a filter tab automatically.

## Edit text

- Bio and contact wording: `public/contact.html`
- Footer: the `<footer>` block at the bottom of each page (it is repeated, so change all four pages plus the template)

## Email address

The address is assembled in the browser so it never appears in the page source. To change it, edit `data-user` and `data-domain` on the two links in `contact.html`, the footer link on each page, and the template. Use an address on your own domain that forwards to your private inbox (Cloudflare Email Routing does this for free). Never type your personal address into the site.

## Add social links

Add a line to the footer on each page, for example:
```html
<a href="https://www.instagram.com/yourname" target="_blank" rel="noopener noreferrer">Instagram</a>
```
The security policy allows plain links like this.

## Fonts

Space Grotesk (headings, nav) and Hanken Grotesk (text). Both are open source (SIL OFL) and live in `public/css/fonts`. Do not add commercial font files to this public repo unless their licence allows redistribution.

## If something looks wrong

- Old content showing: hard refresh, or test in a private window.
- A photo missing: check the filename in `photos.js` matches the file in `public/images/thumb` exactly (including `.webp`).
- Deploy failed: Cloudflare dashboard, Workers and Pages, your project, Deployments, open the failed build log.
