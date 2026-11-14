import { getCollection } from 'astro:content';

/** Published posts, newest first. Drafts are included only while previewing locally. */
export async function getPosts() {
  const posts = await getCollection('journal', (p) => import.meta.env.DEV || !p.data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const postUrl = (id: string) => `/posts/${id}.html`;

export const label = (tag: string) => {
  const t = tag.replace(/-/g, ' ');
  return t.charAt(0).toUpperCase() + t.slice(1);
};

export const longDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
