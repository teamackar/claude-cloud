# PROJECT

## Brand

Giraffe, by Sounds of Giraffe (Giraffe Stereo Systems LLP). Made in India.

## The product

Elevate Duo. Models GRC501 (active), GRC502 (passive).
Sold as a pair. Single SKU. Rs 15,990.

It is one system, not two speakers. The active unit holds the Class D
amplifier, Bluetooth and the smart crossover. The passive unit takes its
signal from the active unit through a supplied cable. Only the active
unit is powered, from a supplied 12V/2A adaptor.

Facts, all from the official manual:

- 200 mm (7.87 in) cutout diameter per speaker
- Speakers sit 6 to 10 ft (1.8 to 3 m) apart, symmetrically
- 6 inch coaxial drivers, 30 W, 8 ohms
- Bluetooth name "DJ AMP", PIN 012345
- Dry indoor only. Explicitly NOT for bathrooms or anywhere with moisture
- The AC wall socket is NOT supplied. A new socket may need an electrician
- In the box: active speaker, passive speaker, connection cable,
  12V/2A adaptor, user guide
- One pair covers a room. Four speakers was tried and failed. There is no
  coverage calculator on this site

## Upcoming

Two further products, no dates, no specifications: a waterproof ceiling
speaker for washrooms, and a karaoke ceiling speaker.

## Art direction

Contemporary African Folk Editorial. Flat hand-drawn editorial
illustration, naive folk influence, mid-century interiors with arches and
angular light, paper grain, calm and slightly surreal. Premium lifestyle,
never cartoon, never children's book. Animals appear as equals sharing the
room, eyes closed or half closed, at rest, never looking at the viewer,
never cute.

## Audience

Consumers buy on feeling. Specifiers (designers, architects, electricians,
dealers) buy on cutout diameter, spacing and ceiling compatibility. Warm
illustrated content for the first, plain dense content for the second,
reachable in one click.

## Site architecture

Multi-page, because the range will grow.

| Path            | Page |
|-----------------|------|
| `/`             | Home |
| `/product`      | Elevate Duo. Specs, exploded view, in the box, warranty, add to cart. Buying happens here. |
| `/upcoming`     | The two future products |
| `/story`        | Founder, the name, manufacturing |
| `/installation` | Video, steps, cutout and spacing. Also the QR destination from inside the product box |
| `/warranty`     | Serial number registration |
| `/trade`        | Dealer enquiries. Footer-only page, not a nav item. |

Policy pages: privacy, terms, refund, shipping.

## Navigation (correct the existing nav to this)

Product, Upcoming, Our Story, Installation, Register Warranty, plus Cart.
The logo links home. "Home" is not a nav item. "Spaces" is removed; it has
no page. "Products" becomes "Product"; there is one.

## Footer (does not exist yet, build it)

Technical downloads (spec sheet, cutout template, manual, CAD if it
exists). Dealer enquiries. Support. Contact. Newsletter capture. Social
links. Company details including GST, LLP registration and made in India.
Policy pages.

## Home page section order

1. Hero (built)
2. How It Works
3. Find Your Animal
4. The Listening Moment
5. Inside The Speaker
6. FAQ
7. Footer

## Parked sections — leave clean insertion points, build no placeholders

- **"Why It Is Different"**: cost comparison against the conventional route.
  Sits between Hero and How It Works. Waiting on prices from the client.
- **"Proof / Founder Story"**: real installations or the founder and factory.
  Sits between Inside The Speaker and FAQ.

## FAQ requirements

- The FAQ must carry the mains socket point, since How It Works no longer
  shows it on mobile. The question is already planned ("Do I need an
  electrician?") and its answer must state plainly that the adaptor needs
  a mains socket, that the socket is not supplied, and that an electrician
  is needed if the ceiling does not have one.

## Decisions made, with reasoning

- Static site built with Eleventy using Liquid templates. Liquid is what
  Shopify uses, so the partials port across later.
- The pair is the unit of sale. Never write copy implying single speakers.
- How It Works exists because customers do not understand the active and
  passive arrangement on unboxing. Three things must land: it is one
  system, only one unit has the amplifier and Bluetooth, only one unit
  gets power.
- How It Works states plainly that a ceiling mains socket is needed and is
  not supplied. Burying this loses sales later, not earlier.
- Find Your Animal is a passive read, not a quiz. All four cards link to
  /product. The four animals: the Cat, the Weaver Bird, the Elephant and
  the Zebra.
- The Listening Moment is purely emotional, no call to action. Do not add
  a button.
- Terracotta means action and nothing else.
- Mobile gets its own portrait illustrations, never crops of wide ones.
- No coverage calculator. One pair per room.

Do not relitigate these. If you think one is wrong, raise it in the
Technical section and continue.

## Standing constraint

Do not rebuild the hero. `index.html`, its CSS and its assets are approved
and stay as they are except where explicitly stated in later instructions.
