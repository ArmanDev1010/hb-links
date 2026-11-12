// A faint slanted band of HB Green with forward chevrons cut into it, across
// the left of the homepage hero behind the copy, after the texture on the
// brand's posts (the user's reference, 11-12): the left side still reads as
// black, with a little green to it. It fades out to the right so the drawing
// stays clean. Decorative and static; sits over HeroShade, under the copy.

// One chevron per 24px tile in HB Green, a little brighter than the band
// (dark marks vanish on a band this dark); a second layer offsets them half
// a tile, row on row.
const CHEVRON =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Cpolyline points='9,7 15,12 9,17' fill='none' stroke='%23106B37' stroke-width='2.5' stroke-opacity='0.32'/%3E%3C/svg%3E\")";

const FADE = "linear-gradient(to right, #000 20%, transparent 92%)";

export default function HeroTexture() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-0 w-full 900:w-[62%]"
      style={{
        // the band's top edge rises to the right, the brand's slant
        clipPath: "polygon(0 56%, 100% 24%, 100% 100%, 0 100%)",
        backgroundImage: `${CHEVRON}, ${CHEVRON}, linear-gradient(color-mix(in oklab, var(--color-third) 12%, transparent) 0 0)`,
        backgroundSize: "24px 24px, 24px 24px, auto",
        backgroundPosition: "0 0, 12px 12px, 0 0",
        maskImage: FADE,
        WebkitMaskImage: FADE,
      }}
    />
  );
}
