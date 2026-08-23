import { services } from "@/data/services";
import { FEATURED_CITIES } from "@/lib/seo";
import { cityHref } from "@/lib/cities";

// References the existing trade/sub-trade data (services/index.js) instead
// of duplicating it, so the sitemap, footer, and homepage — which all read
// that data directly — are unaffected by how the navbar chooses to group it.
// No standalone "/services" page — the trigger just jumps to the services
// section on the homepage instead.
export const servicesNavItem = {
  title: "Services",
  href: "/#expertise",
  type: "services",
  trades: services,
};

export const serviceAreasNavItem = {
  title: "Service Areas",
  href: "/service-areas",
  type: "service-areas",
  featured: FEATURED_CITIES.map((name) => ({ name, href: cityHref(name) })),
  viewAllHref: "/service-areas",
};

export const homeNavItem = { title: "Home", href: "/" };

// Desktop: Home renders separately via Logo, so it's excluded here — this
// replaces the old hardcoded `[pages[1], pages[2], pages[3], pages[4]]`.
export const desktopNavlinks = [servicesNavItem, serviceAreasNavItem];

// Mobile keeps the original per-trade layout (4 separate expandable items,
// each with just its own sub-trades) rather than the grouped "Services"
// mega-menu — there's no column-width pressure on mobile, so there's no
// benefit to merging them, and it matches what the site had before. Each
// item reuses ServicesMegaMenuContent with a single-trade array, which
// renders identically to the old flat per-trade dropdown.
const mobileTradeNavItems = services.map((trade) => ({
  title: trade.title,
  href: trade.href,
  type: "services",
  trades: [trade],
}));

export const mobileNavlinks = [
  homeNavItem,
  ...mobileTradeNavItems,
  serviceAreasNavItem,
];
