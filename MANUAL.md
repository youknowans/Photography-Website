# Owner's manual

Run every command from inside this project folder.

## Preview before you publish

While writing, run:
```
npm run dev
```
Open http://localhost:4321. The page refreshes by itself every time you save a file, and draft posts are visible.

As a final check before publishing, run:
```
npm run preview
```
Open http://localhost:8787. This is the finished site served exactly the way Cloudflare will serve it, with the security headers switched on and no drafts. If something works in `dev` but breaks here, the security policy is usually the cause.

## Add photos

Everything comes from Lightroom; you never edit `photos.js` by hand.

1. In Lightroom's **Metadata** panel, fill in:
   - **Caption**: a plain description, used as alt text for screen readers ("Figure in a red jacket dwarfed by a turquoise ice cave").
   - **City** and **Country** in the **Image** section (not the Contact section, which is your own address).
   - **Keywords**: one per category, e.g. `travel, hike, landscape`. Each keyword becomes a filter tab.
2. Export at high quality: JPEG quality 90 to 100, sRGB, full resolution (or at least 3000 px on the long edge). Set **Metadata** to "All Metadata" or "All Except Camera & Camera Raw Info". "Copyright Only" strips the caption and keywords.
3. Export into `images/full/` (subfolders are fine). It is git-ignored, so originals never leave your computer.
4. Run `python3 -m pip install --user pillow` once, then `python3 optimise-images.py`.
5. The script makes a 1000 px grid image and a 2560 px lightbox image (converted to sRGB, all metadata including GPS removed), then rewrites `public/js/photos.js`, newest capture date first. It warns about any photo with no caption or keywords.
6. Check it with `npm run dev` (or `npm run preview`), then `git add -A`, commit, `git push`.

**Changing a photo:** edit it or its metadata in Lightroom, re-export over the old file, and run the script again.
**Removing a photo:** delete its export from `images/full/` and run the script. It lists the leftover web images you can delete.

## Categories

Categories are your Lightroom **Keywords**. Give a photo several and it appears under each tab. A new keyword gets its own tab automatically, with no HTML to edit. `Street Photography` becomes the tab "Street photography". The tab bar stays hidden until at least two categories are in use.

Every keyword on an exported photo becomes a tab, so keep private keywords (camera, people's names) off the site: in Lightroom, open **Metadata → Edit Keyword Tag** for that keyword and untick **Include on Export**. The **Category** field also works (words separated by spaces), but Keywords are the better habit.

## Write a journal post

Posts are plain text files in `src/content/journal/`. There is no list to update: the journal page, the post's own page and its filter tab are all made automatically.

1. Copy `src/content/journal/example-post.md` and rename it. The filename becomes the address, so `kyoto-in-the-rain.md` becomes `/posts/kyoto-in-the-rain.html`. Use lowercase and hyphens.
2. Fill in the details between the `---` lines (title, date, tag, teaser, cover). The example explains each one.
3. Write the post underneath. Leave a blank line between paragraphs, and use `**bold**`, `*italic*`, `## Subheading` and `[text](https://link)`.
4. Keep `draft: true` while writing, and preview with `npm run dev`. Remove that line when you're ready to publish.

If a detail is wrong (a missing title, a date in the wrong format, a cover that isn't a `.webp`), the build stops and names the file and field, so a broken post can never go live.

**Photos in posts:** export them into `images/full/journal/` and run `python3 optimise-images.py`. Photos in that folder are resized for the web but stay out of the portfolio. Then use the filename as `cover:`, or place one inside the text with `![description](/images/large/name.webp)`. Portfolio photos can be used in posts too.

## Edit text

- Bio and contact wording: `src/pages/contact.astro`
- Nav and footer: `src/layouts/Base.astro`. Change it once and every page updates.

## Email address

The address is assembled in the browser so it never appears in the page source. To change it, edit `data-user` and `data-domain` on the links in `src/layouts/Base.astro` and `src/pages/contact.astro`. Use an address on your own domain that forwards to your private inbox (Cloudflare Email Routing does this for free). Never type your personal address into the site.

## Add social links

Add a line to the footer in `src/layouts/Base.astro`, for example:
```html
<a href="https://www.instagram.com/yourname" target="_blank" rel="noopener noreferrer">Instagram</a>
```
The security policy allows plain links like this.

## Fonts

Space Grotesk (headings, nav) and Hanken Grotesk (text). Both are open source (SIL OFL) and live in `public/css/fonts`. Do not add commercial font files to this public repo unless their licence allows redistribution.

## If something looks wrong

- Old content showing: hard refresh, or test in a private window.
- A photo missing: run `python3 optimise-images.py` again and read its warnings.
- The build stops with an error: read the first line. It names the file and the field that is wrong.
- Deploy failed: Cloudflare dashboard, Workers and Pages, your project, Deployments, open the failed build log.
