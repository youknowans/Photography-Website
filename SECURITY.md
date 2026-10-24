# Security

## What protects the site

**Strict browser policy (`public/_headers`)**
- Content Security Policy that only allows files from this domain. No inline scripts, no third-party code, no fonts or analytics from elsewhere, so a stray `<script>` injected anywhere would not run.
- HSTS: browsers talk to the site over HTTPS only for a year.
- `frame-ancestors 'none'` and `X-Frame-Options: DENY`: nobody can embed the site in a page to trick visitors (clickjacking).
- `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, a Permissions-Policy that switches off camera, microphone, location and payment, plus Cross-Origin policies that stop other sites hot-linking your photos.

**Nothing to attack**
- Static files only: no server code, no database, no login, no forms, no cookies.
- No third-party JavaScript or CDN, so there is no supply-chain risk in the browser.
- Page content is built with safe DOM calls (never `innerHTML` with data). Values read from the browser's storage are validated before use.

**Privacy**
- `optimise-images.py` removes all EXIF/GPS metadata, so published photos carry no location, camera serial or edit history. Originals stay in `images/full/` on your computer and are git-ignored.
- The email address is assembled in the browser, not written in the HTML, so scrapers do not harvest it. Use a forwarding address on your domain, not your personal one.
- Only `public/` is uploaded to Cloudflare. Config, scripts, docs and `.git` are never published.
- The `*.workers.dev` and preview URLs are switched off, so there is exactly one public address.

**Repo hygiene**
- `.gitignore` blocks `.env`, `.dev.vars`, keys and certificates.
- `package-lock.json` pins the single dependency (Wrangler); Dependabot opens a weekly pull request for updates.
- No secrets, tokens or personal emails are in the files.

## Your checklist (settings only you can change)

GitHub
- Turn on two-factor authentication, ideally with a passkey.
- Settings, Emails: tick "Keep my email addresses private" and "Block command line pushes that expose my email".
- Settings, Code security: enable secret scanning and push protection.
- Repo Settings, Branches: add a rule for `main` (block force pushes and deletion).
- Give your SSH key a passphrase.

Cloudflare
- Turn on two-factor authentication on the account.
- Domain, SSL/TLS: set Always Use HTTPS on, minimum TLS 1.2, and enable DNSSEC (also add the DS record at the registrar if asked).
- Keep API tokens scoped to the minimum and never paste them into the repo.
- Email Routing: create `hello@youknowans.com` forwarding to your private inbox.

## Known limits

Photos on any website can be saved by visitors. Metadata stripping and the copyright line help, but nothing technical fully prevents copying. Keep the published versions at 1600 px or smaller.

## Reporting a problem

Email the contact address on the site.
