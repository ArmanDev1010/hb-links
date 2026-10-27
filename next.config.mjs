// General Building was retired as a standalone category during the
// ADU-first restructure — its content was redistributed into the new
// primary service categories (see src/data/services/). These redirects
// keep any existing links/bookmarks/indexed URLs pointed at the page that
// now covers that content, instead of 404ing.
const generalBuildingRedirects = [
  { source: "/general-building", destination: "/#services" },
  {
    source: "/general-building/renovation-remodeling",
    destination: "/home-remodel-los-angeles",
  },
  {
    source: "/general-building/room-additions-adus",
    destination: "/adu-builder-los-angeles",
  },
  {
    source: "/general-building/design-build",
    destination: "/design-build-los-angeles",
  },
  {
    source: "/general-building/framing-carpentry",
    destination: "/home-additions-los-angeles",
  },
  {
    source: "/general-building/full-scope-renovations",
    destination: "/home-remodel-los-angeles",
  },
  {
    source: "/general-building/new-construction",
    destination: "/home-additions-los-angeles",
  },
  {
    source: "/general-building/interior-finishes",
    destination: "/home-remodel-los-angeles",
  },
  {
    source: "/general-building/demolition-site-prep",
    destination: "/home-additions-los-angeles",
  },
  {
    source: "/general-building/outdoor-living-hardscaping",
    destination: "/deck-and-patio-los-angeles",
  },
];

// The old category hub pages (/adu, /home-remodel, ...) and every sub-page
// under them (/adu/detached-adu, /home-remodel/whole-home-renovation, ...)
// were replaced by the /<service>-los-angeles service pages
// (src/app/services/[service]). The kitchen and bathroom sub-pages have
// their own service pages, so they're matched before the /home-remodel
// catch-all. The /services directory page was dropped too — the homepage's
// services section lists every service.
const servicePageRedirects = [
  { source: "/services", destination: "/#services" },
  {
    source: "/home-remodel/kitchen-remodeling",
    destination: "/kitchen-remodel-los-angeles",
  },
  {
    source: "/home-remodel/bathroom-remodeling",
    destination: "/bathroom-remodel-los-angeles",
  },
  { source: "/adu/:path*", destination: "/adu-builder-los-angeles" },
  { source: "/home-remodel/:path*", destination: "/home-remodel-los-angeles" },
  {
    source: "/home-additions/:path*",
    destination: "/home-additions-los-angeles",
  },
  {
    source: "/deck-and-patio/:path*",
    destination: "/deck-and-patio-los-angeles",
  },
  {
    source: "/design-build/:path*",
    destination: "/design-build-los-angeles",
  },
];

// The old /service-areas directory and its per-city pages were replaced by
// the area pages, now /general-contractor-<area>. The old city pages that
// have a new equivalent map straight to it; everything else (including the
// directory itself and Los Angeles, whose area page is now the homepage)
// falls back to the homepage, which carries the service-areas list. The area
// pages were /home-builder-<area> until the site's focus moved from "home
// builder" to "general contractor" (2026-10-27).
const serviceAreaRedirects = [
  {
    source:
      "/service-areas/:city(woodland-hills|encino|tarzana|calabasas|canoga-park|sherman-oaks|reseda|northridge)",
    destination: "/general-contractor-:city",
  },
  { source: "/service-areas/:path*", destination: "/" },
  { source: "/home-builder-:area", destination: "/general-contractor-:area" },
  { source: "/home-builder/:area", destination: "/general-contractor-:area" },
];

// The old trade hubs and their sub-pages (/plumbing/rough-in,
// /electrical/panel-upgrades, ...) were dropped in the ADU-first
// restructure. Plumbing and electrical are now covered on the home remodel
// page (C-10 and C-36 under one contract); low voltage has no successor, so
// it falls back to the homepage's services section.
const tradeRedirects = [
  { source: "/plumbing/:path*", destination: "/home-remodel-los-angeles" },
  { source: "/electrical/:path*", destination: "/home-remodel-los-angeles" },
  { source: "/low-voltage/:path*", destination: "/#services" },
];

// The current service slugs (data/service-pages). Only these have a page
// at /<slug>-los-angeles — any other /services/<slug> left over from an
// older site (/services/access-control, ...) would redirect into a 404.
const SERVICE_SLUGS =
  "adu-builder|garage-conversion|home-remodel|kitchen-remodel|bathroom-remodel|home-additions|deck-and-patio|design-build";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      ...generalBuildingRedirects,
      ...servicePageRedirects,
      ...serviceAreaRedirects,
      ...tradeRedirects,
      // The internal paths behind the rewrites below — keep one public URL
      // per area page and per service page.
      {
        source: "/general-contractor/:area",
        destination: "/general-contractor-:area",
      },
      {
        source: `/services/:service(${SERVICE_SLUGS})`,
        destination: "/:service-los-angeles",
      },
      { source: "/services/:path*", destination: "/#services" },
      // The legal pages moved from /legal/<slug> to /<slug> (app/(legal)).
      { source: "/legal/:slug", destination: "/:slug" },
    ].map((redirect) => ({
      ...redirect,
      permanent: true,
    }));
  },
  async rewrites() {
    return [
      // Service-area pages (src/app/general-contractor/[area]) are served at
      // /general-contractor-<area>. Unknown areas 404 via the route's
      // dynamicParams = false.
      {
        source: "/general-contractor-:area",
        destination: "/general-contractor/:area",
      },
      // Service pages (src/app/services/[service]) are served at
      // /<service>-los-angeles — "los-angeles" is PRIMARY.city's slug (see
      // servicePageHref in lib/cities.js). Unknown services 404 via the
      // route's dynamicParams = false.
      { source: "/:service-los-angeles", destination: "/services/:service" },
    ];
  },
};

export default nextConfig;
