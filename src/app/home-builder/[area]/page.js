import { notFound } from "next/navigation";
import HomePage from "@/components/Home/HomePage";
import { AREA_PAGES, getAreaBySlug } from "@/lib/cities";
import { buildAreaMetadata } from "@/lib/seo";

// Served publicly at /home-builder-<area> through the rewrite in
// next.config.mjs — an App Router folder can't mix fixed text and a param
// in one segment, so this route lives at /home-builder/<area> internally.
export const dynamicParams = false;

export function generateStaticParams() {
  return AREA_PAGES.map(({ slug }) => ({ area: slug }));
}

export async function generateMetadata({ params }) {
  const { area: slug } = await params;

  const area = getAreaBySlug(slug);

  if (!area) return {};

  return buildAreaMetadata(area);
}

export default async function AreaPage({ params }) {
  const { area: slug } = await params;

  const area = getAreaBySlug(slug);

  if (!area) notFound();

  return <HomePage area={area} />;
}
