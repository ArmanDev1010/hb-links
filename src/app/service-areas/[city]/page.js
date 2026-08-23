import { notFound } from "next/navigation";
import CityPage from "@/components/ServiceAreas/CityPage";
import { PRIORITY_CITY_RECORDS, getCityBySlug, buildCityFAQs } from "@/lib/cities";
import {
  buildCityMetadata,
  buildCitySchema,
  buildCityBreadcrumbs,
  buildServiceFAQSchema,
} from "@/lib/seo";

// Only the priority-tier cities get a real page — a guessed or linked URL
// for any other city (there are ~94 total) 404s instead of Next silently
// rendering it on demand.
export const dynamicParams = false;

export function generateStaticParams() {
  return PRIORITY_CITY_RECORDS.map((city) => ({ city: city.slug }));
}

export async function generateMetadata({ params }) {
  const { city: slug } = await params;
  const city = getCityBySlug(slug);

  if (!city) return {};

  return buildCityMetadata(city);
}

export default async function CityRoute({ params }) {
  const { city: slug } = await params;
  const city = getCityBySlug(slug);

  if (!city) notFound();

  const citySchema = buildCitySchema(city);
  const breadcrumbs = buildCityBreadcrumbs(city);
  const faqSchema = buildServiceFAQSchema({ faqs: buildCityFAQs(city) });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(citySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <CityPage city={city} />
    </>
  );
}
