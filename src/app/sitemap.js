import { servicePages } from "@/data/service-pages";
import { privacyPages } from "@/data/privacy";
import { BASE_URL } from "@/lib/seo";
import { AREA_PAGES } from "@/lib/cities";

// `lastModified` defaults to the build, and `images` lists the page's main
// photo so Google Images can find it.
function route(url, priority, { lastModified = new Date(), images } = {}) {
  return {
    url: `${BASE_URL}${url}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
    ...(images && { images: images.map((src) => `${BASE_URL}${src}`) }),
  };
}

export default function sitemap() {
  const staticRoutes = [
    route("", 1),
    route("/contact", 0.8),
    // The legal pages carry their own "Last updated" date — a real one is
    // worth more to crawlers than the build's.
    ...privacyPages.map(({ slug, updated }) =>
      route(`/${slug}`, 0.3, { lastModified: new Date(`${updated}T00:00:00Z`) }),
    ),
  ];

  // The /general-contractor-<area> pages — homepage copies for each service area,
  // so they sit just under the homepage itself.
  const areaRoutes = AREA_PAGES.map((area) => route(area.href, 0.9));

  // The /<service>-los-angeles service pages. ADU is the primary SEO focus
  // and gets the highest priority after Home; the rest are strong secondary
  // services.
  const servicePageRoutes = servicePages.map((page) =>
    route(page.href, page.featured ? 0.95 : 0.8, { images: [page.image.src] }),
  );

  return [...staticRoutes, ...servicePageRoutes, ...areaRoutes];
}
