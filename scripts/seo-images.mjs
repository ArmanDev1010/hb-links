// Builds the share cards link previews show:
//
//   npm run seo-images
//
// public/og/<name>.jpg — the 1200x630 card for each page (og:image /
// twitter:image; see lib/seo.js): the page's photo, darkened along the
// bottom, with the white logo in the corner. "home" is used by the homepage,
// the /general-contractor-<area> pages, contact and the legal pages; every service
// page gets its own.
//
// Re-run it after changing a service page's photo or the hero's opening frame.
// sharp comes with Next.js — it's what next/image uses.

import { mkdirSync } from "node:fs";
import sharp from "sharp";

const WIDTH = 1200;
const HEIGHT = 630;
const LOGO_WIDTH = 300;
const MARGIN = 56;

// `src` is the photo each card is cut from (cropped to fill 1200x630).
// "home" is the homepage hero's opening frame (the finished ADU) — frame
// count minus `openOn` for "adu" in data/heroBuild.js.
const CARDS = [
  { name: "home", src: "public/hero/adu/desktop/0022.webp" },
  { name: "adu-builder", src: "public/images/services/adu.png" },
  {
    name: "garage-conversion",
    src: "public/images/services/garage-conversion.webp",
  },
  { name: "home-remodel", src: "public/images/services/home-remodel.png" },
  { name: "kitchen-remodel", src: "public/images/services/kitchen-remodel.png" },
  { name: "bathroom-remodel", src: "public/images/services/bathroom-remodel.png" },
  { name: "home-additions", src: "public/images/services/home-additions.png" },
  { name: "deck-and-patio", src: "public/images/services/deck-and-patio.png" },
  { name: "design-build", src: "public/images/services/design-build.png" },
];

// Darkens the bottom of the photo so the white logo reads on any of them.
const shade = Buffer.from(
  `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0.45" stop-color="#000" stop-opacity="0"/>
        <stop offset="1" stop-color="#000" stop-opacity="0.72"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
  </svg>`,
);

async function buildCards() {
  mkdirSync("public/og", { recursive: true });

  const logo = await sharp("public/Logos/white_horizontal.png")
    .resize({ width: LOGO_WIDTH })
    .toBuffer({ resolveWithObject: true });

  for (const { name, src } of CARDS) {
    const out = `public/og/${name}.jpg`;
    const photo = await sharp(src)
      .resize(WIDTH, HEIGHT, { fit: "cover", position: "centre" })
      .toBuffer();
    await sharp(photo)
      .composite([
        { input: shade },
        {
          input: logo.data,
          left: MARGIN,
          top: HEIGHT - MARGIN - logo.info.height,
        },
      ])
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(out);
    console.log(out);
  }
}

await buildCards();
