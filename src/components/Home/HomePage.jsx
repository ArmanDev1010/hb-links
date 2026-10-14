import Hero from "@/components/Home/Hero";
import About from "@/components/Home/About";
import Services from "@/components/Home/Services";
import Process from "@/components/Home/Process";
import Contact from "@/components/Home/Contact";
import Reviews from "@/components/Home/Reviews";
import ServiceAreas from "@/components/Home/ServiceAreas";
import FAQ from "@/components/Home/FAQ";
import {
  buildHomeSchema,
  buildHomeFAQSchema,
  buildBreadcrumbSchema,
} from "@/lib/seo";

// The homepage, rendered for one service area. "/" renders it for the
// primary area (Los Angeles); each /home-builder-<area> page renders the
// same sections with its own area swapped into the headings and copy, plus
// an FAQ that only that area's page has. Area pages also get a Home > area
// breadcrumb; the homepage is its own root.
export default function HomePage({ area }) {
  const schemas = [
    buildHomeSchema(area),
    buildHomeFAQSchema(area),
    !area.isPrimary &&
      buildBreadcrumbSchema(`Home Builder in ${area.name}`, area.href),
  ].filter(Boolean);

  return (
    <>
      {schemas.map((schema) => (
        <script
          key={schema["@type"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <Hero area={area} sequence="adu" />
      <About area={area} />
      <Services area={area} />
      <Reviews />
      <Process />
      <Contact />
      <FAQ area={area} />
      <ServiceAreas area={area} />
    </>
  );
}
