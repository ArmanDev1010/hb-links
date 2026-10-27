import { servicePages } from "@/data/service-pages";
import { SERVICE_AREAS } from "@/lib/cities";

// The "Services" dropdown's rows — one per service page, numbered, each
// with its one-line `navBlurb`. There's no standalone directory page — the
// label itself lands on the homepage's services section.
export const servicesNavItem = {
  title: "Services",
  href: "/#services",
  type: "services",
  rows: servicePages.map(({ navLabel, navBlurb, href }) => ({
    title: navLabel,
    blurb: navBlurb,
    href,
  })),
};

// Los Angeles links to the homepage (its area page); every other area to
// its /general-contractor-<area> page. There's no standalone directory page —
// "view all" lands on the homepage's service-areas section.
export const serviceAreasNavItem = {
  title: "Service Areas",
  href: "/#service_areas",
  type: "service-areas",
  featured: SERVICE_AREAS.map(({ name, href }) => ({ name, href })),
  viewAllHref: "/#service_areas",
};

export const homeNavItem = { title: "Home", href: "/" };

export const desktopNavlinks = [homeNavItem, servicesNavItem, serviceAreasNavItem];

export const mobileNavlinks = [homeNavItem, servicesNavItem, serviceAreasNavItem];
