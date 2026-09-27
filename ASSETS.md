# ASSETS

## Folders

- `/art` holds source masters.
- `/assets` holds site outputs.
- `/design` holds the `.dc.html` files, `support.js` and `.thumbnail`, and is
  never deployed. The build does not read it.
  - `Hero Page v2.dc.html` is the canvas the approved hero was built from.
  - `Hero Page.dc.html` is an older exploration, kept for reference only. It
    references four images that do not exist: `hero-living-room.png`,
    `calm-cat.png`, `party-cheetah.png`, `giraffe-portrait.png`.

## Naming

`hero-wide.png`, `hero-portrait.png`, `animal-cat-card.png`,
`howitworks-ceiling-diagram.svg`, `product-exploded.svg`.

Never version in the filename.

## Output widths

- Wide: 1600 and 2560 WebP, plus a 1920 JPG fallback.
- Portrait: 900 and 1440 WebP, plus a 1000 JPG fallback.

Keep this convention for all new art. Wide or portrait is decided by the
source's own proportions (wider than tall = wide).

## Upscaling

Upscayl, Digital Art model, 2x, PNG output. No sharpening, no
post-processing. Sources go into /art at the upscaled size; npm run images
produces everything under /assets.

## Generating outputs

`npm run images` turns everything in `/art` into `/assets` at the widths
above (WebP quality 78, mozjpeg JPG quality 80). It skips outputs that
already exist, never upscales, warns if a source is too small for a target
width, and warns if any single output is over 250KB. SVGs are copied as-is.

- `npm run images -- animal-cat` processes only matching sources.
- `npm run images -- --force` re-encodes existing outputs. Do not use it on
  approved art without checking the result.

## Find Your Animal cards

`animal-cat-card`, `animal-weaver-bird-card`, `animal-elephant-card`,
`animal-zebra-card`. Portrait, 3:4, standard portrait outputs.

Status: **placeholder**. Current masters are 1086x1448, below the
1440x1920 minimum, so each `-1440.webp` is really 1086px wide. The card
builds its srcset from the output dimensions in `manifest.json`, so when
final art lands: drop the master into /art under the same name, run
`npm run images -- -card --force`, and update the dimensions and status
in the manifest. No template change needed.

## Vector

Layered SVG preferred for anything animated, with meaningful layer ids.

## Manifest

Maintain `assets/manifest.json` (internal, not shipped) listing every asset each section expects,
its status (`missing`, `placeholder`, `final`) and its dimensions.

Every section renders correctly when an asset is missing, showing a
labelled placeholder at the right ratio rather than breaking layout.

## Reporting

At the end of every section build, say in "For Sayan" exactly which
illustrations are still needed, at what shape and ratio.
