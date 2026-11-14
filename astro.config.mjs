// Astro settings. The site is still 100% static: Astro runs only on your Mac
// (and later in CI) and writes plain HTML into dist/, which Cloudflare serves.
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://youknowans.com',
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file',              // journal.astro -> journal.html, keeps the old URLs working
    inlineStylesheets: 'never',  // the CSP in public/_headers forbids inline <style>
  },
  markdown: {
    syntaxHighlight: false,      // highlighters write inline style="" that the CSP blocks
  },
  devToolbar: { enabled: false },
});
