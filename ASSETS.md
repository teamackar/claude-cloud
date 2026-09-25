# ASSETS

## Folders

- `/art` holds source masters.
- `/assets` holds site outputs.
- `/design` holds the `.dc.html` files, `support.js` and `.thumbnail`, and is
  never deployed.

## Naming

`hero-wide.png`, `hero-portrait.png`, `animal-cat-card.png`,
`howitworks-ceiling-diagram.svg`, `product-exploded.svg`.

Never version in the filename.

## Output widths

- Wide: 1600 and 2560 WebP, plus a JPG fallback.
- Portrait: 900 and 1440 WebP, plus a JPG fallback.

Keep this convention for all new art.

## Vector

Layered SVG preferred for anything animated, with meaningful layer ids.

## Manifest

Maintain `assets/manifest.json` listing every asset each section expects,
its status (`missing`, `placeholder`, `final`) and its dimensions.

Every section renders correctly when an asset is missing, showing a
labelled placeholder at the right ratio rather than breaking layout.

## Reporting

At the end of every section build, say in "For Sayan" exactly which
illustrations are still needed, at what shape and ratio.
