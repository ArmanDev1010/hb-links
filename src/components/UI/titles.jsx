import { FEATURED_CITIES } from "@/lib/seo";

// The size every section's title (h2) shares, phone to wide screen, so no
// section's heading reads bigger or smaller than its neighbours'. Sections
// add their own case, colour and tracking.
export const SECTION_TITLE =
  "font-gt font-semibold leading-[1.2] text-[27px] 400:text-[30px] 550:text-[32px] 800:text-[34px] 1080:text-[36px] 1600:text-[40px]";

// The FAQ's title is the same, except on phones: its topic and place each
// keep to one line ("Bathroom Remodeling" is the widest), so under 550px it
// eases down with the screen to fit them — a few px under the others on
// most phones (24.5px for 27px on a 390px iPhone).
export const FAQ_TITLE =
  "font-gt font-semibold leading-[1.2] text-[length:min(6.3vw,27px)] 400:text-[length:min(6.3vw,30px)] 550:text-[32px] 800:text-[34px] 1080:text-[36px] 1600:text-[40px]";

// The titles of the boxed sections (Areas We Service, Know Before You
// Build, Building in <area>) are the same, except on phones: the box's own
// padding leaves them less room, so under 550px they ease down with the
// screen until their longest phrase ("Garages Converted", "Garage
// Conversions") fits inside it.
export const BOXED_TITLE =
  "font-gt font-semibold leading-[1.2] text-[length:min(5.6vw,27px)] 400:text-[length:min(5.6vw,30px)] 550:text-[32px] 800:text-[34px] 1080:text-[36px] 1600:text-[40px]";

// The key phrases a title never splits across two lines: the services and
// the places. Longest first, so "Design-Bid-Build" wins over "Design-Build".
const PHRASES = [
  ...FEATURED_CITIES,
  "San Fernando Valley",
  "General Contracting",
  "General Contractor",
  "ADU Construction",
  "ADU Builder",
  "Garage Conversions",
  "Garage Conversion",
  "Garages Converted",
  "Bathroom Remodeling",
  "Bathroom Remodels",
  "Bathroom Remodel",
  "Kitchen Remodeling",
  "Kitchen Remodels",
  "Kitchen Remodel",
  "Home Remodeling",
  "Home Remodels",
  "Home Remodel",
  "Home Additions",
  "Home Addition",
  "Decks & Patios",
  "Deck & Patio",
  "Design-Bid-Build",
  "Design-Build",
  "Outdoor Living",
  "Outdoor Space",
  "Living Space",
].sort((a, b) => b.length - a.length);

const PHRASE_PATTERN = new RegExp(
  `(${PHRASES.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
  "gi",
);

// A title's text with each key phrase in it kept on one line, so it wraps
// between phrases, never inside one ("General / Contracting", "Design- /
// Build"). Anything but a string passes through untouched.
export function keepTogether(text) {
  if (typeof text !== "string") return text;
  return text.split(PHRASE_PATTERN).map((part, index) =>
    index % 2 ? (
      <span key={index} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  );
}
