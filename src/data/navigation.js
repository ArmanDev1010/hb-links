import { servicePages } from "@/data/service-pages";
import { SERVICE_AREAS } from "@/lib/cities";

// Flat list of "Services" nav rows — one per service page, all equal weight
// and prefixed with a short dash in the dropdown. There's no standalone
// directory page — the label itself lands on the homepage's services section.
export const servicesNavItem = {
  title: "Services",
  href: "/#services",
  type: "services",
  rows: servicePages.map(({ navLabel, href }) => ({ title: navLabel, href })),
};

// Los Angeles links to the homepage (its area page); every other area to
// its /home-builder-<area> page. There's no standalone directory page —
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
