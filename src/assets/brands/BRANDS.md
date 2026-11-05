# Brand logos

The app shows a merchant's logo next to its subscriptions only when that merchant's row below is **approved** and its
file is in this folder. Every other subscription shows its category icon. Logos are bundled into the app: browsers never
download them from a third party, and no merchant data is sent to a logo service.

## Trademark rules

Logos are trademarks of their owners. Before marking a row `approved`, the person approving it checks that brand's own
guidelines and confirms that all of these hold:

1. **Identification only.** The logo is used to show which service a user's own subscription is for (nominative use),
   never to advertise or to suggest the brand endorses or partners with this app.
2. **Unaltered.** No redrawing, cropping, stretching, effects or mixing with other marks. One-colour icons may be tinted
   in the brand's own colour (the Tint column); otherwise the file is shown as is.
3. **Small and next to the name.** Icon size only, always beside the service's name, never more prominent than our own
   branding.
4. **The brand allows it.** If a brand's guidelines forbid third-party apps from showing its logo, the row stays
   `rejected`. Apple is an example: its guidelines don't allow its logos to be used for Apple products in other apps.
5. **Trusted source.** Only an official brand source or a URL you choose yourself, over `https://`. Never a URL found in
   an email.
6. **Removed on request.** If a brand owner asks, set the row to `rejected` and delete the file the same day.
7. **Licence noted.** Record where the file came from. Simple Icons files are CC0, but CC0 covers the file, not the
   right to use the trademark; rules 1–6 still apply.

## How to add or change a logo

You don't need to know the frontend code.

1. **Find the merchant key.** It is the `merchantKey` of the subscription: the configured `key` in the backend's
   `application.yml` (for example `netflix`, `youtube-premium`), or for unknown merchants the key shown by the API or the
   `subscriptions.merchant_key` column (for example `acme-notes`). It must match exactly.
2. **Add or edit the row** in the Registry table below: key, title, status `approved` (after checking the rules above),
   the source URL, optionally a tint, and a short note (for example who checked the guidelines). Never put a `|` in a
   cell. Leave File, Added and SHA-256 as `—`; the command fills them in.
3. **Run one command** in the frontend folder:
   - from the URL in the row: `npm run brand:add -- <merchant-key>`
   - from another URL: `npm run brand:add -- <merchant-key> https://example.com/logo.svg`
   - from a file on your computer: `npm run brand:add -- <merchant-key> ./path/to/logo.png`

   It refuses unless the row is `approved`, accepts only `https://` URLs, allows only SVG, PNG or WebP up to 256 KB, and
   stops with a clear error if an SVG contains scripts, event handlers, external links, embedded content, `data:` URLs,
   CSS `url()`/`@import` or a doctype. On success it saves `<merchant-key>.<ext>` here and records the source, today's
   date and the file's SHA-256 in the row.
4. **Commit** the changed `BRANDS.md` and the logo file. The tests check that every file matches its row.

To **change** a logo, run the command again with the new source. To **hide** one, set its status to `pending` or
`rejected`; to remove it for good, also delete its file.

**Tint:** leave `—` to show the file in its own colours. Use a hex colour (`#E50914`) or `theme` (the text colour, for
black logos in dark mode) only for one-colour icons.

## Registry

| Key | Title | File | Status | Source | Added | SHA-256 | Tint | Guidelines | Notes |
|---|---|---|---|---|---|---|---|---|---|
| netflix | Netflix | netflix.svg | approved | https://cdn.jsdelivr.net/npm/simple-icons@16.35.0/icons/netflix.svg | 2026-11-04 | 67dbc495988bd5667a09ed4f56e14db4070a44c7a74e297b146c229f70fd6f6e | #E50914 | https://brand.netflix.com/en/assets/logos | — |
| spotify | Spotify | spotify.svg | approved | https://cdn.jsdelivr.net/npm/simple-icons@16.35.0/icons/spotify.svg | 2026-11-04 | b9ec9bec7769c35643981586d6ea0d675aaf3871b32f8a291bcac7a87fff0bc1 | #1ED760 | https://developer.spotify.com/documentation/general/design-and-branding/#using-our-logo | — |
| youtube-premium | YouTube | youtube.svg | approved | https://cdn.jsdelivr.net/npm/simple-icons@16.35.0/icons/youtube.svg | 2026-11-04 | 5038808acbbc4e6edda16cbeb1cc6dec80e4e4ee4e227e039c41229fa222aa8c | #FF0000 | https://www.youtube.com/howyoutubeworks/resources/brand-resources/#logos-icons-and-colors | — |
| anthropic | Claude | claude.svg | approved | https://cdn.jsdelivr.net/npm/simple-icons@16.35.0/icons/claude.svg | 2026-11-04 | 2d6fda79eb18ddccca35b799eeb3cece0dfabc22520ce3b10abd25668df9fa93 | #D97757 | — | — |
| notion | Notion | notion.svg | approved | https://cdn.jsdelivr.net/npm/simple-icons@16.35.0/icons/notion.svg | 2026-11-04 | b17d2a2b592a06252efef522d5205f0c7a958f748d40df1011ed081417e42f85 | theme | — | — |
| github | GitHub | github.svg | approved | https://cdn.jsdelivr.net/npm/simple-icons@16.35.0/icons/github.svg | 2026-11-04 | 3bf8cceead820aec50d4ee825a3fd02c5a1cd6665cc9cf4cbf3d9c8861a204bb | theme | https://github.com/logos | — |
| dropbox | Dropbox | dropbox.svg | approved | https://cdn.jsdelivr.net/npm/simple-icons@16.35.0/icons/dropbox.svg | 2026-11-04 | 1c9ea4ac8e318f3f6a598568df1a38ece03b7bc52a3a72d48c9e760340d7aeec | #0061FF | — | — |
| hetzner | Hetzner | hetzner.svg | approved | https://cdn.jsdelivr.net/npm/simple-icons@16.35.0/icons/hetzner.svg | 2026-11-04 | df276671b4076812a5a4b46f4113b0c38f56109f6bd368d1a6f09915b67961b4 | #D50C2D | — | — |
| apple-music | Apple Music | — | rejected | — | — | — | — | — | Apple's guidelines don't allow third-party use of Apple logos |
| skool | Skool | skool.png | approved | https://assets.skool.com/skool/8d5e2d4df1b645148f07ae0d9df14c51.png | 2026-11-05 | e4dfc339801aa21355b48ea3210306fedf368428beafe394aeb4007a4b40091b | — | — | Approved by owner, 2026-11-05; official skool.com app icon |
| namecheap | Namecheap | namecheap.svg | approved | https://cdn.jsdelivr.net/npm/simple-icons@16.35.0/icons/namecheap.svg | 2026-11-05 | 627da072fe9ba357e5fd89eb829cb60448ba476ba3ad320d123495fc5ca9a5dc | #DE3723 | — | Approved by owner, 2026-11-05; Simple Icons (CC0) |
| hackerai | HackerAI | hackerai.png | approved | https://hackerai.co/icon-512x512.png | 2026-11-05 | 77c277c68ba110a037b33f53ebbc098a3fa455019f96c47e1616e9645cee5e56 | — | — | Approved by owner, 2026-11-05; official hackerai.co icon |
| namecheap-for-education | Namecheap | namecheap-for-education.svg | approved | https://cdn.jsdelivr.net/npm/simple-icons@16.35.0/icons/namecheap.svg | 2026-11-05 | 627da072fe9ba357e5fd89eb829cb60448ba476ba3ad320d123495fc5ca9a5dc | #DE3723 | — | Approved by owner, 2026-11-05; same Namecheap logo (Simple Icons, CC0) for the education account |
