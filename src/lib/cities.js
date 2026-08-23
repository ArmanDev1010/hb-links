import { cities } from "@/data/citys/cities";
import { counties } from "@/data/citys/counties";

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

// Every city we service, flattened with its county attached — used for the
// full directory listing and for schema.org areaServed (via ALL_CITIES in
// lib/seo.js), never for routing directly.
export const ALL_CITY_RECORDS = cities.flatMap(({ county, cities: names }) => {
  const countyMeta = counties.find((c) => c.fips === county);
  return names.map((name) => ({
    name,
    slug: slugifyCity(name),
    countyFips: county,
    countyName: countyMeta?.county ?? "",
    countyLabel: countyMeta?.label ?? "",
  }));
});

// A curated subset of cities that get a real, fully-built landing page.
// Building all ~94 cities as near-identical templated pages risks Google
// treating them as thin/doorway content — this list is the business's
// actual service core (the San Fernando Valley, where the 818 area code
// operates) plus the highest-value cities already identified for SEO in
// FEATURED_CITIES (lib/seo.js). Every other city still appears in the
// directory listing and in areaServed schema, just without its own page.
export const PRIORITY_CITIES = [
  "Los Angeles",
  "Beverly Hills",
  "Santa Monica",
  "West Hollywood",
  "Culver City",
  "Pasadena",
  "Burbank",
  "Glendale",
  "Encino",
  "Sherman Oaks",
  "Van Nuys",
  "North Hollywood",
  "Studio City",
  "Woodland Hills",
  "Tarzana",
  "Northridge",
  "Reseda",
  "Canoga Park",
  "Chatsworth",
  "Granada Hills",
  "Calabasas",
  "Thousand Oaks",
  "Ventura",
];

export const PRIORITY_CITY_RECORDS = ALL_CITY_RECORDS.filter((c) =>
  PRIORITY_CITIES.includes(c.name),
);

export function isPriorityCity(name) {
  return PRIORITY_CITIES.includes(name);
}

export function getCityBySlug(slug) {
  return PRIORITY_CITY_RECORDS.find((c) => c.slug === slug) ?? null;
}

// Real href only for cities that have a page — callers use this to decide
// whether a city should render as a link or plain text.
export function cityHref(name) {
  return isPriorityCity(name) ? `/service-areas/${slugifyCity(name)}` : null;
}

// Deterministic same-county neighbors (alphabetically adjacent, wrapping
// around) — a simple proxy for proximity since no per-city coordinates
// exist. By default draws only from the priority tier (so every result is
// a real link, e.g. for the hero sidebar's short list); pass `allCities:
// true` to draw from the full 94-city roster instead (e.g. for a long
// "also serving" list, where most entries won't have their own page and
// render as plain text). Naturally caps out below `count` for Ventura
// County cities, which only has 15 cities total to draw from.
export function getNearbyCities(cityName, count = 4, { allCities = false } = {}) {
  const pool = allCities ? ALL_CITY_RECORDS : PRIORITY_CITY_RECORDS;
  const record = pool.find((c) => c.name === cityName) ??
    ALL_CITY_RECORDS.find((c) => c.name === cityName);
  if (!record) return [];

  const sameCounty = pool.filter(
    (c) => c.countyFips === record.countyFips && c.name !== cityName,
  );
  if (!sameCounty.length) return [];

  const startIndex = sameCounty.findIndex((c) => c.slug > record.slug);
  const from = startIndex === -1 ? 0 : startIndex;
  const rotated = [...sameCounty.slice(from), ...sameCounty.slice(0, from)];

  return rotated.slice(0, count);
}

// Templated, per-city FAQ copy — a functional first draft, not final
// marketing copy. Generated from the same fields for every city so it
// scales to the full priority tier without hand-authoring.
export function buildCityFAQs(city) {
  const nearby = getNearbyCities(city.name, 3)
    .map((c) => c.name)
    .join(", ");

  return [
    {
      question: `Do you provide services in ${city.name}?`,
      answer: `Yes — HB Links regularly works throughout ${city.name} and the surrounding ${city.countyName}, covering general building, electrical, plumbing, and low-voltage projects.`,
    },
    {
      question: `How far do you travel within ${city.name}?`,
      answer: `There's no extra travel fee anywhere within ${city.name}.${nearby ? ` We also serve nearby communities including ${nearby}.` : ""}`,
    },
    {
      question: `Are you licensed to work in ${city.name}?`,
      answer: `Yes — HB Links holds California CSLB license #1144057, valid for work throughout ${city.name} and all of California.`,
    },
    {
      question: `How quickly can you start a project in ${city.name}?`,
      answer: `Scheduling depends on project scope, but most ${city.name} consultations can be booked within a few business days — call (818) 303-3555 or request a consultation online.`,
    },
  ];
}
