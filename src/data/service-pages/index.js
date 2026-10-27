import aduBuilder from "./adu-builder";
import garageConversion from "./garage-conversion";
import homeRemodel from "./home-remodel";
import kitchenRemodel from "./kitchen-remodel";
import bathroomRemodel from "./bathroom-remodel";
import homeAdditions from "./home-additions";
import deckAndPatio from "./deck-and-patio";
import designBuild from "./design-build";
import { servicePageHref } from "@/lib/cities";

// One page per service we offer, in the order the Services menu and the
// footer list them. Each is served at /<slug>-los-angeles (servicePageHref)
// and carries everything its page renders (components/ServicePage): hero
// copy, the "What's Included" spec sheet and scope, the four process steps,
// the FAQ, the service-areas heading, and its "Often Paired With" services —
// plus, on the pages that have them, `options` (the forms the service comes
// in, compared) and a `guide` (its local rules and decisions).
// `metaTitle` is its search-result title (lib/seo.js adds " | HB LINKS"),
// `title` its H1 and breadcrumb; its share card is public/og/<slug>.jpg
// (scripts/seo-images.mjs).
const pages = [
  aduBuilder,
  garageConversion,
  homeRemodel,
  kitchenRemodel,
  bathroomRemodel,
  homeAdditions,
  deckAndPatio,
  designBuild,
].map((page) => ({ ...page, href: servicePageHref(page.slug) }));

// `related` names other service pages by slug — resolve each to that page's
// label and URL for the "Often Paired With" cards.
export const servicePages = pages.map((page) => ({
  ...page,
  related: page.related.map(({ slug, note }) => {
    const { navLabel, href } = pages.find((other) => other.slug === slug);
    return { navLabel, href, note };
  }),
}));

export function getServicePage(slug) {
  return servicePages.find((page) => page.slug === slug) ?? null;
}
