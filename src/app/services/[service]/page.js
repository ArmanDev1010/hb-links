import { notFound } from "next/navigation";
import ServicePage from "@/components/ServicePage/ServicePage";
import { servicePages, getServicePage } from "@/data/service-pages";
import { buildServicePageMetadata } from "@/lib/seo";

// Served publicly at /<service>-los-angeles (e.g. /adu-builder-los-angeles)
// through the rewrite in next.config.mjs — same pattern as the area pages
// in app/general-contractor/[area].
export const dynamicParams = false;

export function generateStaticParams() {
  return servicePages.map(({ slug }) => ({ service: slug }));
}

export async function generateMetadata({ params }) {
  const { service: slug } = await params;

  const page = getServicePage(slug);

  if (!page) return {};

  return buildServicePageMetadata(page);
}

export default async function ServicePageRoute({ params }) {
  const { service: slug } = await params;

  const page = getServicePage(slug);

  if (!page) notFound();

  return <ServicePage page={page} />;
}
