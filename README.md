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

`assets.json` maps the original logo, leadership portraits, and earlier activity photographs. Two further field visit photographs appear in the gallery highlights. `gallery.json` groups 31 newly supplied photographs under Feeding Program, Relief Goods Program, Scholarship Program, and Seminars; `gallery-sizes.json` records their intrinsic dimensions. Duplicate source copies were omitted. `videos.json` lists five client-supplied videos shown after the photo gallery, with frame posters and neutral captions. No transcript or separate captions file was supplied for the three newest videos.

The client confirmed permission to publish the supplied photos and videos, including images of children, in this project conversation. The three newest videos still need captions or transcripts; their publication does not resolve this accessibility gap. Keep the portrait labels, donation details, approximate student count, production URL, and any required privacy/legal text under client review. Confirm the activity associated with each image before applying a more specific claim.
