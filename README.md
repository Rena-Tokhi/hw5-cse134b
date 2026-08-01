# Rena Tokhi Portfolio (CSE 134B HW5)

Portfolio site built with Eleventy, deployed on Cloudflare Pages.

## Setup

```bash
npm install
npm start        # dev server at http://localhost:8080
npm run build    # builds site + search index to _site/
```

## Part 1: Theme picker

Light/dark/auto toggle in the header. Works with CSS alone by default (matches your OS).
JavaScript (`src/js/theme.js`) adds the toggle and saves your choice in `localStorage`.
If JS is off, the toggle is simply hidden, nothing breaks.

## Part 2: `<earthquake-feed>` component

Shows recent earthquakes from the USGS API. Used on the home page.

| | |
|---|---|
| Tag | `<earthquake-feed>` |
| Attributes | `minmagnitude` (default `2.5`), `limit` (default `8`) |
| Endpoint | USGS earthquake API (free, no key needed) |

Example:

```html
<earthquake-feed minmagnitude="2.5" limit="8">
  <template>
    <li>
      <strong class="eq-mag"></strong>
      <span class="eq-place"></span>
      <time class="eq-time"></time>
    </li>
  </template>
  <p class="eq-fallback">Needs JavaScript to load live data.</p>
</earthquake-feed>
```

Handles loading, success, error, and retry states. Code lives in `src/js/earthquake-feed.js`.

## Part 3: Eleventy

- `eleventy.config.js`: build config
- `src/_data/site.js`: site title, nav, and other shared info
- `src/_includes/`: shared header, footer, and page layouts
- `src/projects/*.njk`: one file per project, all using the same layout
- `src/sitemap.njk`, `src/404.njk`: auto-generated

Deployed on Cloudflare Pages, which builds the site from source on every push.

**Why Eleventy helped**: no more copy-pasting the header/footer into every page.
**Trade-off**: small edits now mean finding the right template file instead of just editing HTML.

## Extra credit: Search

`/search/` uses Pagefind, which builds a search index after the site builds. No server needed;
search runs entirely in the browser.

## Notes

- `deployed-url.json` has the live site URL.
- Project images are placeholder SVGs, not real screenshots.
