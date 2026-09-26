# CLAUDE.md

Read PROJECT.md and this file at the start of every session. PROJECT.md is
imported below so it loads automatically; ASSETS.md governs all artwork.

@PROJECT.md

Do not rebuild the hero. `index.html`, its CSS and its assets are approved
and stay as they are except where explicitly stated in later instructions.

## Communication rules

End every piece of work with two clearly separated sections.

### For Sayan

Plain English, no jargon, maximum 200 words. What I can now see and do,
described as a person using the site. What it looks like, in words a
non-developer understands. Anything I need to decide, phrased as a
real-world choice with your recommendation and the trade-off. Anything I
need to provide before you continue.

Never use here: token names, hex codes, contrast ratios, file paths, CSS
or JS terminology, framework names, or anything in backticks.

Instead of "--text-invert on --action measures 4.97:1", write "button
labels need to be slightly larger than usual so the text stays readable
on the terracotta".

### Technical

Files changed, decisions, measurements, architecture, trade-offs, known
issues, what a reviewer should check.

When a decision is needed, the plain-English version goes in "For Sayan"
and the reasoning in "Technical".

## Contrast rules

- Buttons on light backgrounds: --accent fill, --cream label, 18px bold
  minimum. Smaller labels fail on terracotta.
- Buttons on dark backgrounds: --cream fill, --ink label. --accent fails
  on --forest at 2.26:1 and must never be a fill there.
- --muted is for captions and labels only, never running copy.
- New section CSS references only the semantic layer (--ui-*, --btn-*,
  --link, --focus-ring), never raw palette tokens. Mark dark section roots
  with data-surface="dark" and the semantic layer inverts itself.
- palette.html shows every token with measured contrast. Check it after
  any token change.

## Do not

- Never hardcode a hex or rgba value outside tokens.css.
  Sole exception: theme-color, which cannot read CSS variables. The default
  in _data/site.json mirrors --sand; a page overrides it with theme_color in
  front matter (home mirrors --ceiling). Both carry keep-in-sync comments.
- Never write inline !important styles from JavaScript.
- Never link a PNG from /art directly. Each is about 5x the page budget.
- Never deploy /design. It pulls React, ReactDOM and Babel, about 3MB.
- Never write copy implying single speakers are sold.

## Always

- Use MutationObserver for anything depending on deferred rendering.
- Mobile first. Verify at 375px before anything else.

## Build

Eleventy 3 with Liquid. Templates in src/, partials in _includes/, layouts
in _layouts/, data in _data/. Output goes to _site/ (not committed).

- `npm install` once, then `npm run dev` for the dev server with live
  reload at http://localhost:8080
- `npm run build` writes the static site to _site/
- Partials use `{% render %}` with explicit parameters, as Shopify does.
- Only src/ is templated and only css/, js/, assets/ are copied, so
  palette.html, /art, /design and the .dc.html files never ship.

## Performance budget

Under 1.5MB per page, LCP under 2.5s on a mid-range Android. Current pages
run 78KB to 143KB, so there is plenty of headroom. Protect it.

## Git

Commit after every working section. Message format:
`section(<name>): <what changed>`. Flag any asset over 5MB before committing,
except the PNG masters in /art, which are source files and are expected to
be large.
