# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static personal website for Raul Medeiros, hosted at `https://www.raulmedeiros.eus`. It is a single-page site based on the "CeeVee" template (Styleshout). There is no build system, no package manager, and no test suite — all changes are made directly to source files.

## Development

To preview the site locally, serve it with any static file server:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

There are no linting, build, or test commands.

## Architecture

The entire site lives in `index.html` as a single page with anchor-linked sections: `#home`, `#about`, `#resume`, `#portfolio`, `#testimonials`. Navigation highlights the active section via the Waypoints library as the user scrolls.

**CSS layers** (loaded in order via `default.css` → `layout.css` → `media-queries.css`):
- `css/default.css` — resets, typography, grid, buttons; imports `fonts.css`, Fontello, and Font Awesome
- `css/layout.css` — all section-specific styles; owns the skill bar `@keyframes` animations and portfolio modal styles
- `css/media-queries.css` — responsive breakpoints

**JavaScript** (`js/init.js`) wires up all interactivity on `$(document).ready`:
- **FitText** — makes `h1.responsive-headline` fluid between 40–90 px
- **Smooth scroll** — `.smoothscroll` links animate `scrollTop`
- **Waypoints** — updates the `.current` class on `#nav-wrap` as sections enter the viewport
- **Magnific Popup** — `.item-wrap a` links open inline `#modal-NN` divs for portfolio items
- **FlexSlider** — `.flexslider` drives the quotes carousel in `#testimonials`
- **Contact form AJAX** — posts to `inc/sendEmail.php`; the PHP file contains a placeholder email (`user@website.com`) that must be updated before the form works

**Icon fonts**: Fontello (`css/fontello/`) supplies navigation/scroll icons (e.g. `icon-down-circle`, `icon-up-open`); Font Awesome (`css/font-awesome/`) supplies social and tag icons (`fa-twitter`, `fa-github`, `fa-tag`, etc.).

## Key Conventions

**Adding a portfolio item**: create a `.portfolio-item` div in `#portfolio-wrapper` linking to a new `#modal-NN` id, then add the corresponding `.popup-modal` div with the description and links.

**Adding a skill bar**: add a `<li>` to `.skills` in `#resume`, create a CSS class with `width` and `@keyframes` animation in `layout.css` following the existing pattern (e.g. `.python`, `.java`).

**Adding a publication**: add a `.row.item` block inside the `#publications` section following the existing `h3` / `p.info` structure.

**Skill bar widths** represent relative proficiency and are animated with vendor-prefixed `@keyframes` for both `-moz-` and `-webkit-`. Every new bar needs both prefixed keyframe declarations in `layout.css`.

## Notable Files

- `CV.pdf` — the downloadable resume linked from the About section; replace to update
- `inc/sendEmail.php` — contact form mailer; update `$siteOwnersEmail` before use (currently a placeholder)
- `sitemap.xml` / `robots.txt` — SEO files; update `<lastmod>` in sitemap when making significant content changes
