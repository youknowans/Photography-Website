---
title: How to write a journal post
date: 2026-11-14
tag: technique
teaser: A worked example. Copy this file, rename it, and write.
draft: true
---

This is an example post. Because it says `draft: true` above, it only shows while you preview with `npm run dev`. It is never published. Delete it whenever you like.

## Writing a post

1. Copy this file in `src/content/journal/` and rename it. The filename becomes the address: `kyoto-in-the-rain.md` becomes `/posts/kyoto-in-the-rain.html`.
2. Change the details between the `---` lines at the top:
   - **title**: the headline.
   - **date**: the date, as year-month-day. Newest posts show first.
   - **tag**: one word such as `gear`, `technique` or `travel`. A filter tab appears for it automatically.
   - **teaser**: one or two sentences for the journal page (optional).
   - **cover** and **coverAlt**: a photo filename from `public/images` and its description (optional).
   - **draft**: `true` to keep it private while you write. Delete the line or set it to `false` to publish.
3. Write underneath in plain text. Leave a blank line between paragraphs.

## Formatting

Use `**bold**` for **bold**, `*italic*` for *italic*, and `[link text](https://example.com)` for links. Start a line with `##` for a subheading.

To add a photo inside the post, run it through `optimise-images.py` first (put journal-only photos in `images/full/journal/` so they stay out of the portfolio), then write:

