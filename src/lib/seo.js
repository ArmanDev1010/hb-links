import { cities } from "@/data/citys/cities";

export const BASE_URL = "https://hb-links.com";

export const SITE_NAME = "HB LINKS";

// The single service + geo the whole site is pointed at. Every title, H1,
// and schema geo derives from this, so the focus is declared in one place.
export const PRIMARY = {
  service: "General Contractor",
  serviceShort: "General Contractor",
  city: "Los Angeles",
  region: "Los Angeles County",
};

// A small, curated set of well-known cities for human-readable text
// (meta description, keywords) — kept short so it reads naturally rather
// than as a keyword-stuffed wall of city names. Scoped to the west-Valley
// ring we actually compete in. These are also the nine service areas — each
// non-primary one gets its own /general-contractor-<area> page (SERVICE_AREAS
// in lib/cities.js).
export const FEATURED_CITIES = [
  "Los Angeles",
  "Woodland Hills",
  "Encino",
  "Tarzana",
  "Calabasas",
  "Canoga Park",
  "Sherman Oaks",
  "Reseda",
  "Northridge",
];

// Formats FEATURED_CITIES (minus the base city, already named separately in
// these sentences) as natural-language prose — "Los Angeles, Encino, ... and
// Northridge" — so the handful of duplicated FAQ answers that list these
// cities can't drift out of sync with the nav's featured list.
export function featuredCitiesProse(exclude = PRIMARY.city) {
  const names = FEATURED_CITIES.filter((name) => name !== exclude);
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

// The ~12 cities we realistically compete in — a tight west-Valley ring
// around the base city, plus "Los Angeles" for perceived reach. Used for
// schema `areaServed` instead of the full 94-city list so the machine
// signal matches the on-page depth rather than contradicting it.
export const CORE_CITIES = [
  "Woodland Hills",
  "Tarzana",
  "Canoga Park",
  "West Hills",
  "Winnetka",
  "Reseda",
  "Encino",
  "Calabasas",
  "Sherman Oaks",
  "Northridge",
  "Chatsworth",
  "Los Angeles",
];

// The complete list of every city served, flattened — safe to use in
// structured data (areaServed) since it's not a visible/indexed page,
// just a machine-readable signal of coverage.
export const ALL_CITIES = cities.flatMap((county) => county.cities);

// The 1200x630 share card (scripts/seo-images.mjs) for pages without one of
// their own: the homepage, the /general-contractor-<area> pages, contact and the
// legal pages. Each service page has its own, /og/<slug>.jpg. The photo is
// the homepage hero's finished ADU, so its alt describes the scene and not
// a project of ours.
export const DEFAULT_OG_IMAGE = "/og/home.jpg";
const DEFAULT_OG_IMAGE_ALT =
  "Detached backyard ADU with white stucco walls, black trim and an arched entry porch";

// Square mark for structured data's `logo` field, distinct from the
// wide `image`/OG photo above.
export const LOGO_IMAGE = "/seo/logo.png";

// Stable ids for the business and the website in structured data. The root
// layout describes both once; each page's own schema points back at them
// by id, so search engines read one HB LINKS entity across the whole site.
export const BUSINESS_ID = `${BASE_URL}/#business`;
export const WEBSITE_ID = `${BASE_URL}/#website`;

// The Google Business Profile, by the CID of the listing the service-areas
// map embeds.
export const GOOGLE_MAPS_URL =
  "https://maps.google.com/?cid=17848895277485113197";

// The `provider` every Service schema below points back to: the root
// layout's GeneralContractor by id, with enough of it repeated to stand on
// its own.
const PROVIDER = {
  "@type": "GeneralContractor",
  "@id": BUSINESS_ID,
  name: SITE_NAME,
  url: BASE_URL,
  telephone: "+1-818-303-3555",
};

// Absolute URL of a page from its path — the bare site root for "/".
function pageUrl(path) {
  return path === "/" ? BASE_URL : `${BASE_URL}${path}`;
}

// Every page's metadata goes through here. openGraph/twitter are objects,
// and Next.js metadata does NOT deep-merge nested objects between layout and
// page — a page-level `openGraph` fully replaces the root layout's, and a
// page without one inherits the root's. So each page sets every field a link
// preview needs, its own URL included. `title` is the page's full <title>,
// brand and all, set as absolute so the root layout's "%s | HB LINKS"
// template can't add the brand twice. `image` is a 1200x630 JPEG.
export function buildPageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  imageAlt = DEFAULT_OG_IMAGE_ALT,
  keywords,
}) {
  const url = pageUrl(path);

  return {
    title: { absolute: title },
    description,
    ...(keywords && { keywords }),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      type: "website",
      images: [
        { url: image, width: 1200, height: 630, type: "image/jpeg", alt: imageAlt },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: image, alt: imageAlt }],
    },
  };
}

// Metadata for the /<service>-los-angeles service pages (data/service-pages).
// `metaTitle` is the page's search title — it names more of what people
// search for than the H1 (`title`) has room for.
export function buildServicePageMetadata(page) {
  return buildPageMetadata({
    title: `${page.metaTitle} | ${SITE_NAME}`,
    description: page.description,
    path: page.href,
    image: `/og/${page.slug}.jpg`,
    imageAlt: page.image.alt,
    keywords: page.keywords,
  });
}

// Service-page structured data — safely communicates "this exact service
// (e.g. ADU Construction) is offered in these exact cities" to Google.
export function buildServicePageSchema(page) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: page.serviceType,
    name: `${page.title} in ${PRIMARY.city}, CA`,
    description: page.description,
    url: `${BASE_URL}${page.href}`,
    image: `${BASE_URL}${page.image.src}`,
    provider: PROVIDER,
    areaServed: CORE_CITIES.map((city) => ({
      "@type": "City",
      name: `${city}, CA`,
    })),
  };
}

// BreadcrumbList structured data — Home > this page, shown as the trail in
// search results instead of a raw URL. `name` is this page's crumb.
export function buildBreadcrumbSchema(name, path) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name, item: pageUrl(path) },
    ],
  };
}

// An FAQ answer can mark a phrase `{{like this}}` to make it a link that
// opens the estimate form (components/Home/FAQ). Structured data gets the
// words alone.
const ESTIMATE_LINK = /\{\{(.+?)\}\}/g;

export function plainAnswer(answer) {
  return answer.replace(ESTIMATE_LINK, "$1");
}

// An answer split into its text and its estimate links, in order:
// [{ text }, { link }, { text }, ...].
export function answerParts(answer) {
  return answer
    .split(ESTIMATE_LINK)
    .map((part, i) => (i % 2 ? { link: part } : { text: part }))
    .filter((part) => part.link || part.text);
}

// FAQPage structured data from a list of questions and answers.
function faqPageSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: plainAnswer(answer) },
    })),
  };
}

// FAQPage structured data — only emitted when a service defines FAQs,
// so pages without any never render an empty/invalid FAQPage block.
export function buildServiceFAQSchema(service) {
  if (!service.faqs?.length) return null;
  return faqPageSchema(service.faqs);
}

const AREA_KEYWORDS = [
  "general contractor",
  "licensed general contractor",
  "remodeling contractor",
  "ADU builder",
  "garage conversion",
  "ADU contractor",
  "home addition contractor",
  "room addition",
  "second story addition",
  "design-build contractor",
  "whole home remodel",
];

// Metadata for the homepage and the /general-contractor-<area> pages — the
// same page with the location swapped. The homepage leaves "ADU" to
// /adu-builder-los-angeles, so the two don't compete for one search; the
// other areas have no ADU page of their own, so theirs names it.
// Descriptions stay under ~155 characters, where Google cuts them off.
export function buildAreaMetadata(area) {
  return buildPageMetadata({
    title: area.isPrimary
      ? `General Contractor in ${area.name}, CA | ${SITE_NAME}`
      : `General Contractor & ADU Builder in ${area.name}, CA | ${SITE_NAME}`,
    description: `Licensed general contractor in ${area.coverageServices} — ADUs, garage conversions, additions and remodels under one contract. Free estimates.`,
    path: area.href,
    keywords: AREA_KEYWORDS.map((keyword) => `${keyword} ${area.name}`),
  });
}

// Homepage structured data — declares general contracting as the primary
// offering. Mirrors the buildServicePageSchema shape but is scoped to the site
// as a whole: the homepage (primary area) covers the core west-Valley
// service area, while each /general-contractor-<area> page covers just its
// area.
export function buildHomeSchema(area) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: PRIMARY.service,
    name: `General Contractor in ${area.name}, CA`,
    description: `Design, permitting, and construction of detached ADUs, garage conversions, and room additions across ${area.coverage}.`,
    url: pageUrl(area.href),
    provider: PROVIDER,
    areaServed: area.isPrimary
      ? CORE_CITIES.map((city) => ({ "@type": "City", name: `${city}, CA` }))
      : { "@type": "City", name: `${area.name}, CA` },
  };
}

// Homepage FAQs — SEO-focused questions covering service-area coverage,
// every primary service (ADU, remodeling, additions), and the trust
// signals (licensing, pricing) buyers search for before hiring. Built per
// service area so each /general-contractor-<area> page asks about its own
// area.
// Exported as plain data (not just wrapped in schema below) so the
// homepage can render them as real, visible content, not just an
// invisible FAQPage block — Google's guidance favors structured data
// that matches what's actually on the page.
export function getHomeFAQs(area) {
  const city = area.name;

  const faqs = [
    {
      question: `Do you serve my area in ${city}?`,
      answer: area.isPrimary
        ? `Yes. HB LINKS is based in Los Angeles and builds throughout the San Fernando Valley and greater Los Angeles — including ${featuredCitiesProse()}. Call us to confirm coverage for your specific address.`
        : `Yes. HB LINKS builds throughout ${city} and the rest of greater Los Angeles — including ${featuredCitiesProse(city)}. Call us to confirm coverage for your specific address.`,
    },
    {
      question: `Do you build ADUs and garage conversions in ${city}?`,
      answer: `Yes — ADU construction is our primary focus. We design, permit, and build detached ADUs, attached ADUs, garage conversions, and JADUs across ${PRIMARY.region}.`,
    },
    {
      question: `Do you handle both kitchen and bathroom remodeling in ${city}?`,
      answer:
        "Yes. Kitchen remodeling, bathroom remodeling, and whole-home renovation are all part of our core scope — available on their own or bundled together — with structural, electrical, and plumbing work scheduled under one contract instead of separate subcontractors.",
    },
    {
      question: `Can you build home additions in ${city}?`,
      answer:
        "Yes. Room additions, second-story additions, and other square-footage expansions are built by the same licensed team that handles our ADU and remodeling projects, from permitting through final walkthrough.",
    },
    {
      question: "Are you a licensed general contractor?",
      answer:
        "Yes — HB LINKS holds California CSLB license #1144057 with classifications B (General Building), C-10 (Electrical), and C-36 (Plumbing), so every trade your project needs is covered under one license instead of handed off to separate subcontractors.",
    },
    {
      question: `How much does an ADU, remodel, or addition cost in ${city}?`,
      answer:
        "Cost depends on square footage, scope, and finish level — a garage conversion prices differently than a detached ADU, a kitchen remodel, or a room addition. We provide a detailed, project-specific estimate after an on-site evaluation rather than a generic per-square-foot number. {{Get a free on-site estimate}} for your exact number.",
    },
  ];

  // An area page asks its own local questions (data/areas.js) after the
  // coverage one, in place of the homepage's what-do-you-build questions,
  // which every area page would otherwise repeat word for word. The licence
  // and cost questions stay.
  if (area.local) {
    const [coverage, , , , licensed, cost] = faqs;
    return [coverage, ...area.local.faqs, licensed, cost];
  }

  return faqs;
}

// Homepage FAQ structured data — mirrors getHomeFAQs above so the schema
// always matches the visible content.
export function buildHomeFAQSchema(area) {
  return faqPageSchema(getHomeFAQs(area));
}
