// Defines what a journal post's front matter (the block between --- lines at
// the top of each .md file) must contain. A typo or missing field stops the
// build with a clear message instead of publishing a broken page.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const journal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/journal' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tag: z.string().transform((t) => t.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')),
    teaser: z.string().optional(),
    // a photo made by optimise-images.py, e.g. "dolomite-38.webp"
    cover: z.string().regex(/^[A-Za-z0-9._-]+\.webp$/, 'cover must be a .webp filename from public/images').optional(),
    coverAlt: z.string().optional(),
    draft: z.boolean().default(false),   // drafts show in `npm run dev` only, never published
  }),
});

export const collections = { journal };
