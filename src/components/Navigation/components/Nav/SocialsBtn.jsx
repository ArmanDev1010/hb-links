import { BsArrowUpRight } from "react-icons/bs";
import { SOCIAL_HANDLE, socials } from "@/data/contact";

const instagram = socials.find(({ name }) => name === "Instagram");

// The Instagram square in the nav's right-hand cluster (desktop ≥1280
// only). Hovering it, or tabbing onto it, drops a small panel under it
// listing all four platforms, Instagram too, dressed like the Services
// and Service Areas dropdowns (DropdownShell): white glass, green rule
// along the top. It's
// plain CSS: the panel lives inside the square's wrapper and its top
// padding bridges the gap, so the hover holds on the way down to it. Not
// portalled like DropdownShell, so Tab goes from the square straight into
// its links; the glass is near-opaque because the solid bar's own
// backdrop blur stops a blur nested inside it from reaching the page.
export default function SocialsBtn({ light }) {
  const Icon = instagram.icon;

  return (
    <div className="group/socials relative max-1280:hidden">
      <a
        href={instagram.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="HB Links on Instagram"
        className={`w-11 h-[46px] grid place-items-center border transition-colors duration-200 ${
          light
            ? "border-white/50 text-white hover:bg-white hover:text-ink group-hover/socials:bg-white group-hover/socials:text-ink"
            : "border-ink/25 text-ink hover:bg-ink hover:text-white group-hover/socials:bg-ink group-hover/socials:text-white"
        }`}
      >
        <Icon className="w-[17px] h-[17px]" />
      </a>

      <div
        className="absolute left-1/2 top-full pt-2.5 -translate-x-1/2 -translate-y-1.5 opacity-0 invisible
          transition duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none
          group-hover/socials:visible group-hover/socials:opacity-100 group-hover/socials:translate-y-0 group-hover/socials:duration-[380ms]
          group-focus-within/socials:visible group-focus-within/socials:opacity-100 group-focus-within/socials:translate-y-0 group-focus-within/socials:duration-[380ms]"
      >
        <div className="relative w-[236px] py-3 bg-white/95 backdrop-blur-xl backdrop-saturate-150 border-2 border-black/10">
          <span
            aria-hidden="true"
            className="absolute inset-x-[-2px] -top-[2px] h-[2px] bg-third"
          />
          <p className="px-5 pt-2 pb-2 uppercase text-[10.5px] font-semibold tracking-[0.24em] text-third pointer-events-none">
            Follow {SOCIAL_HANDLE}
          </p>
          <ul className="px-5">
            {socials.map(({ name, href, icon: PlatformIcon }) => (
              <li
                key={name}
                className="border-b border-black/10 last:border-b-0"
              >
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`HB Links on ${name}`}
                  className="group/row flex items-center gap-3 -mx-3 px-3 py-2.5 uppercase text-[12px] font-medium tracking-[0.14em] text-fourth transition-colors duration-200 hover:text-black hover:bg-black/[0.04] outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-third"
                >
                  <span className="grid place-items-center w-8 h-8 shrink-0 border border-black/10 text-[15px] text-fourth transition-colors duration-200 group-hover/row:border-third/40 group-hover/row:text-third">
                    <PlatformIcon />
                  </span>
                  {name}
                  <BsArrowUpRight className="ml-auto text-[11px] text-fourth/60 transition-colors duration-200 group-hover/row:text-third" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
