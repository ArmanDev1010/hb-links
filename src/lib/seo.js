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
export const DEFAULT_OG_IMAGE = "/seo/logo.png";

function getTradeImage(trade) {
  return TRADE_IMAGES[trade?.href] || DEFAULT_OG_IMAGE;
}

export function buildTradeMetadata(trade) {
  const image = getTradeImage(trade);
  const description =
    trade.paragraph ||
    `Professional ${trade.title.toLowerCase()} services across Los Angeles and Ventura County.`;

  return {
    title: `${trade.title} Services in Los Angeles & Ventura County`,
    description,
    alternates: { canonical: `${BASE_URL}${trade.href}` },
    openGraph: {
      title: `${trade.title} | HB LINKS`,
      description,
      url: `${BASE_URL}${trade.href}`,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${trade.title} | HB LINKS`,
        },
      ],
    },
  };
}

export function buildServiceMetadata(trade, service) {
  const image = getTradeImage(trade);
  const description =
    service.description ||
    `Professional ${service.label.toLowerCase()} services across Los Angeles and Ventura County.`;

  return {
    title: `${service.label} in Los Angeles & Ventura County`,
    description,
    alternates: { canonical: `${BASE_URL}${service.href}` },
    openGraph: {
      title: `${service.label} | HB LINKS`,
      description,
      url: `${BASE_URL}${service.href}`,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${service.label} | HB LINKS`,
        },
      ],
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