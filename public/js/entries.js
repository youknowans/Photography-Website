/*
  entries.js: the list that drives the Journal page.

  To publish a post:
    1. Copy templates/journal-post.html to public/posts/<short-name>.html and write it.
    2. Add one entry below (newest first).

  Fields:
    tag     one word, e.g. gear / technique / travel (a tab appears automatically)
    title   headline
    teaser  one or two sentences
    href    must start with /posts/
    src     optional cover image filename inside public/images/thumb
*/
const ENTRIES = [
  // { tag: "gear", title: "Packing for a week of cold shoots", teaser: "What earned its place in the bag.", href: "/posts/cold-shoots.html", src: "cold-shoots.webp" },
];
