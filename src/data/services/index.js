import adu from "./adu";
import designBuild from "./design-build";
import homeRemodeling from "./home-remodeling";
import homeAdditions from "./home-additions";
import outdoorLiving from "./deck-patio";

// A category `paragraph` can name its location through an `{area}`
// placeholder, so the homepage's service cards can say "across Encino and
// greater Los Angeles" on the Encino page. Only the first two cards (ADU,
// Home Remodeling) carry it: the hero already names the area, and repeating
// the same phrase in every card reads as boilerplate rather than adding
// anything for search.
const AREA_PLACEHOLDER = "{area}";

// A category's paragraph for one service area's page (lib/cities.js).
export function getAreaParagraph(category, area) {
  return category.paragraph.replace(AREA_PLACEHOLDER, area.coverageServices);
}

// The contact forms' project types and the estimate form's first question.
// ADU is the site's primary SEO focus and stays first. Each category's href
// is its service page (data/service-pages).
export const primaryServices = [
  adu,
  homeRemodeling,
  homeAdditions,
  outdoorLiving,
  designBuild,
];

// The homepage's Services section: the five primary services. Garage
// conversions and the kitchen and bathroom remodels keep their own service
// pages (and their places in the Services menu) but not a tile there.
// Garage conversions stay out of `primaryServices` — the forms file them
// under ADU ("detached, attached or garage conversion", data/estimate).
export const homepageServices = primaryServices;

// "Project Type" options shared by every contact form (the /contact page and
// the header's request modal) — one source so the two never drift apart.
export const projectTypeOptions = [
  ...primaryServices.map((c) => c.title),
  "Not Sure / Other",
];
