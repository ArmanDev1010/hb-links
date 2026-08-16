import { pages } from "@/data/pages";
import { privacyPages } from "@/data/privacy";
import { BASE_URL } from "@/lib/seo";

export default function sitemap() {
  const staticRoutes = [
    { url: "", priority: 1 },
    { url: "/contact", priority: 0.8 },
    ...privacyPages.map(({ slug }) => ({
      url: `/legal/${slug}`,
      priority: 0.3,
    })),
  ].map(({ url, priority }) => ({
    url: `${BASE_URL}${url}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority,
  }));

  const tradeRoutes = pages.flatMap((page) => {
    if (!page.href) return [];

    const tradeRoute = {
      url: `${BASE_URL}${page.href}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    };

    const subTradeRoutes = (page.dropdown ?? []).map((sub) => ({
      url: `${BASE_URL}${sub.href}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

    return [tradeRoute, ...subTradeRoutes];
  });

  return [...staticRoutes, ...tradeRoutes];
}