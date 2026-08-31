import { cities } from "@/data/citys/cities";

export const BASE_URL = "https://hb-links.com";

// A small, curated set of well-known cities for human-readable text
// (meta description, keywords) — kept short so it reads naturally rather
// than as a keyword-stuffed wall of city names.
export const FEATURED_CITIES = [
  "Los Angeles",
  "Pasadena",
  "Burbank",
  "Santa Monica",
  "Beverly Hills",
  "Glendale",
  "Ventura",
  "Thousand Oaks",
];

// The complete list of every city served, flattened — safe to use in
// structured data (areaServed) since it's not a visible/indexed page,
// just a machine-readable signal of coverage.
export const ALL_CITIES = cities.flatMap((county) => county.cities);

// One representative image per trade. Sub-trade pages fall back to their
// parent trade's image until real per-sub-trade photos exist — swap a
// path here and every page under that trade picks it up automatically.
export const TRADE_IMAGES = {
  "/general-building": "/seo/general-building.jpg",
  "/electrical": "/seo/electrical.jpg",
  "/low-voltage": "/seo/low-voltage.jpg",
  "/plumbing": "/seo/plumbing.jpg",
};

// Used anywhere no trade-specific image is available yet (e.g. the
// homepage, or if a trade is ever missing from TRADE_IMAGES above).
// Sized to the 1200x630 OG/Twitter card spec — unlike the square logo,
// this won't get stretched or cropped in link previews.
export const DEFAULT_OG_IMAGE = "/seo/logo.png";

// Square mark for structured data's `logo` field, distinct from the
// wide `image`/OG photo above.
export const LOGO_IMAGE = "/seo/logo.png";

// No per-city photography exists yet. Rather than repeat one static image
// across every city page, deterministically pick one of the 4 trade photos
// per city (stable across builds, no extra data needed beyond the slug) so
// pages don't look visually identical to a crawler or a user comparing tabs.
export function getCityImage(city) {
  const images = Object.values(TRADE_IMAGES);
  const hash = [...city.slug].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return images[hash % images.length];
}

function getTradeImage(trade) {
  return TRADE_IMAGES[trade?.href] || DEFAULT_OG_IMAGE;
}

// og:image needs an explicit MIME type for crawlers that don't sniff the
// file — keeps this correct regardless of which extension a given image uses.
function getImageType(image) {
  return image.endsWith(".png") ? "image/png" : "image/jpeg";
}

// openGraph/twitter are objects, and Next.js metadata does NOT deep-merge
// nested objects between layout and page — a page-level `openGraph` fully
// replaces the root layout's, and a missing `twitter` block falls back to
// the root's (generic, wrong-image) one. Every field a link preview needs
// is set explicitly here so trade/service pages never silently inherit —
// or drop — the wrong title, siteName, or image.
export function buildTradeMetadata(trade) {
  const image = getTradeImage(trade);
  const description =
    trade.paragraph ||
    `Professional ${trade.title.toLowerCase()} services across Los Angeles and Ventura County.`;
  const ogTitle = `${trade.title} | HB LINKS`;

  return {
    title: `${trade.title} in Los Angeles, CA`,
    description,
    alternates: { canonical: `${BASE_URL}${trade.href}` },
    openGraph: {
      title: ogTitle,
      description,
      url: `${BASE_URL}${trade.href}`,
      siteName: "HB LINKS",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          type: getImageType(image),
          alt: `${trade.title} | HB LINKS`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [image],
    },
  };
}

export function buildServiceMetadata(trade, service) {
  const image = service.image || getTradeImage(trade);
  const description =
    service.description ||
    `Professional ${service.label.toLowerCase()} services across Los Angeles and Ventura County.`;
  const ogTitle = `${service.label} | HB LINKS`;

  return {
    title: `${service.label} in Los Angeles & Ventura County`,
    description,
    alternates: { canonical: `${BASE_URL}${service.href}` },
    openGraph: {
      title: ogTitle,
      description,
      url: `${BASE_URL}${service.href}`,
      siteName: "HB LINKS",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          type: getImageType(image),
          alt: `${service.label} | HB LINKS`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [image],
    },
  };
}

// Trade-level structured data — declares the trade itself as a Service
// offered across every city, same reasoning as buildServiceSchema below
// but scoped one level up (e.g. "General Building" as a whole).
export function buildTradeSchema(trade) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: trade.title,
    name: `${trade.title} | HB LINKS`,
    description: trade.paragraph,
    url: `${BASE_URL}${trade.href}`,
    provider: {
      "@type": "GeneralContractor",
      name: "HB LINKS",
      url: BASE_URL,
      telephone: "+1-818-303-3555",
    },
    areaServed: ALL_CITIES.map((city) => ({
      "@type": "City",
      name: `${city}, CA`,
    })),
  };
}

// BreadcrumbList structured data — surfaces Home > Trade > Service as a
// clickable trail directly in Google search results instead of a raw URL.
export function buildTradeBreadcrumbs(trade) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: trade.title,
        item: `${BASE_URL}${trade.href}`,
      },
    ],
  };
}

export function buildServiceBreadcrumbs({ trade, service }) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: trade.title,
        item: `${BASE_URL}${trade.href}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: service.label,
        item: `${BASE_URL}${service.href}`,
      },
    ],
  };
}

// FAQPage structured data — only emitted when a service defines FAQs,
// so pages without any never render an empty/invalid FAQPage block.
export function buildServiceFAQSchema(service) {
  if (!service.faqs?.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

// City-level metadata for /service-areas/[city] pages. Follows the same
// shape/conventions as buildServiceMetadata above.
export function buildCityMetadata(city) {
  const image = getCityImage(city);
  const description = `Licensed general contractor serving ${city.name}, CA — general building, electrical, plumbing, and low-voltage services with no extra travel fee within ${city.name}.`;
  const ogTitle = `${city.name} | HB LINKS`;
  const href = `/service-areas/${city.slug}`;

  return {
    title: `General Contractor in ${city.name}, CA | HB LINKS`,
    description,
    alternates: { canonical: `${BASE_URL}${href}` },
    openGraph: {
      title: ogTitle,
      description,
      url: `${BASE_URL}${href}`,
      siteName: "HB LINKS",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          type: getImageType(image),
          alt: ogTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [image],
    },
  };
}

// City-level structured data — scoped to just this city (unlike
// buildTradeSchema/buildServiceSchema, which broadcast across every city a
// trade serves), since a city page is specifically about that one area.
export function buildCitySchema(city) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "General Contracting",
    name: `HB LINKS — ${city.name}, CA`,
    description: `General building, electrical, plumbing, and low-voltage contracting services in ${city.name}, CA.`,
    url: `${BASE_URL}/service-areas/${city.slug}`,
    provider: {
      "@type": "GeneralContractor",
      name: "HB LINKS",
      url: BASE_URL,
      telephone: "+1-818-303-3555",
    },
    areaServed: { "@type": "City", name: `${city.name}, CA` },
  };
}

export function buildCityBreadcrumbs(city) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Service Areas",
        item: `${BASE_URL}/service-areas`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: city.name,
        item: `${BASE_URL}/service-areas/${city.slug}`,
      },
    ],
  };
}

// Service-level structured data — this is what safely communicates
// "this exact service is offered in these exact cities" to Google,
// without creating a single extra indexable page.
export function buildServiceSchema({ trade, service }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: service.label,
    name: `${service.label} | HB LINKS`,
    description: service.description,
    url: `${BASE_URL}${service.href}`,
    category: trade.title,
    provider: {
      "@type": "GeneralContractor",
      name: "HB LINKS",
      url: BASE_URL,
      telephone: "+1-818-303-3555",
    },
    areaServed: ALL_CITIES.map((city) => ({
      "@type": "City",
      name: `${city}, CA`,
    })),
  };
}
