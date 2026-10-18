# ihelpfriendship website

Five static pages: `/`, `/about/`, `/our-work/`, `/support/`, and `/projects/`.

## Local preview

```powershell
npm.cmd install --cache .local/npm-cache
npm.cmd run build
npm.cmd run check
python -m http.server 8765 --directory dist
```

Open `http://localhost:8765/`. The generated `dist/` directory is the deployable output. No server, form backend, payment gateway, tracking, or account system is included.

With the server running and local Chrome installed, `npm.cmd run qa` checks routes at four viewport widths, interactions, JavaScript fallbacks, and a mobile automated accessibility scan.

## Hosting

For a root domain, `npm.cmd run build` creates root-relative links. For a GitHub Pages project path, set `SITE_BASE` to `/<repository>/` before building. Set `SITE_URL` to the confirmed public origin and base path before a production build; this adds canonical links and an absolute XML sitemap. The hosting platform must serve directory `index.html` files for the four nested routes. Do not use this local preview as proof that a production host is configured.

The GitHub Actions workflow builds and publishes the site to `https://jay-rtl.github.io/ihelpfriendship/` when `main` is updated. GitHub Pages must use **GitHub Actions** as its build source.

## Content and assets

`assets.json` maps the exact supplied logo, leadership portraits, two original activity photos, and five photograph areas extracted from the supplied messaging screenshots. The phone interface is excluded from those crops. Keep the original screenshots outside the public `dist/` directory. The screenshot-derived images have limited resolution; request original files when available. `videos.json` is ready for confirmed video entries with `src`, `type`, `poster`, and `caption`; it is empty while no video file is supplied.

Before public release, confirm publication consent for leadership photos and all photos containing children, the portrait labels, the current donation details, the approximate student count, the exact production URL, and any required privacy/legal text. Confirm the activity associated with each screenshot-derived photo before applying a specific program label.
