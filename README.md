# youknowans.com

A hand-coded photography portfolio: plain HTML, CSS and a little JavaScript, served from Cloudflare. No framework, no build step, no third-party scripts.

## Layout

```
public/              the website (the only folder that is published)
  index.html         Portfolio (home)
  journal.html       Journal
  contact.html       About and Contact
  404.html           Not found page
  _headers           security headers (see SECURITY.md)
  css/  js/  images/
templates/           journal-post.html, a starting point for new posts (not published)
images/full/         your original exports (stays on your computer, git-ignored)
optimise-images.py   makes the web versions of your photos
wrangler.jsonc       tells Cloudflare what to publish and on which domains
SECURITY.md          what is protected, and your checklist
MANUAL.md            how to do everyday jobs
```

## Run it locally

```
npm install      # once
npm run dev      # then open http://localhost:8787
```

## Publish

`git push` to `main`. Cloudflare builds and deploys it, normally in about a minute.

## Roadmap

1. Static site (done)
2. Hosting on Cloudflare with the custom domain (this repo)
3. CI checks in GitHub Actions
4. Infrastructure as code
