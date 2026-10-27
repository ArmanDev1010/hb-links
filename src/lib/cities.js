import { FEATURED_CITIES, PRIMARY } from "@/lib/seo";
import { areaContent } from "@/data/areas";

// URL-safe slug for a city name, e.g. "La Cañada Flintridge" -> "la-canada-flintridge".
export function slugifyCity(name) {
  return name
    .normalize("NFD")
    .replace(new RegExp("[\\u0300-\\u036f]", "g"), "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// The nine service areas the site targets (FEATURED_CITIES). Los Angeles is
// the primary area and its page IS the homepage; every other area gets a
// version of the homepage at /general-contractor-<slug> with its own name,
// building guide and FAQs (see components/Home/HomePage). `badge` and
// `coverage` are the location
// phrases those sections drop in. `badge` is always "<area>, CA"; for
// `coverage` the primary area pairs the city with the Valley ("Los Angeles
// and the San Fernando Valley" — "Los Angeles and Los Angeles County" would
// repeat itself), every other area names itself first ("Encino and greater
// Los Angeles"). `preposition` is for headings that place work in the area:
// "across Los Angeles" spans the whole city and Valley, but every other area
// is a single neighborhood or small city, so it's "in Woodland Hills" — and
// "in Calabasas" too, which is its own city but reads as a neighborhood.
// `local` is what makes the area's page its own — its building guide and
// its FAQs (data/areas.js) — null for the primary.
export const SERVICE_AREAS = FEATURED_CITIES.map((name) => {
  const isPrimary = name === PRIMARY.city;
  const slug = slugifyCity(name);

  return {
    name,
    slug,
    isPrimary,
    href: isPrimary ? "/" : `/general-contractor-${slug}`,
    badge: `${name}, CA`,
    coverage: isPrimary
      ? `${name} County`
      : `${name} and ${PRIMARY.city} County`,
    coverageServices: isPrimary
      ? `${name} and the San Fernando Valley`
      : `${name} and greater ${PRIMARY.city}`,
    preposition: isPrimary ? "across" : "in",
    local: areaContent[name] ?? null,
  };
});

export const PRIMARY_AREA = SERVICE_AREAS.find((area) => area.isPrimary);

// The areas that get their own /general-contractor-<slug> page.
export const AREA_PAGES = SERVICE_AREAS.filter((area) => !area.isPrimary);

export function getAreaBySlug(slug) {
  return AREA_PAGES.find((area) => area.slug === slug) ?? null;
}

// Public URL of a service page — /<service>-<primary city>, e.g.
// /adu-builder-los-angeles. Served by src/app/services/[service] through the
// rewrite in next.config.mjs, the same way the area pages are.
export function servicePageHref(slug) {
  return `/${slug}-${slugifyCity(PRIMARY.city)}`;
}
