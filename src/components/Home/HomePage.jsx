import Hero from "@/components/Home/Hero";
import About from "@/components/Home/About";
import Services from "@/components/Home/Services";
import Process from "@/components/Home/Process";
import Contact from "@/components/Home/Contact";
import Reviews from "@/components/Home/Reviews";
import ServiceAreas from "@/components/Home/ServiceAreas";
import FAQ from "@/components/Home/FAQ";
import ServiceGuide from "@/components/ServicePage/ServiceGuide";
import {
  buildHomeSchema,
  buildHomeFAQSchema,
  buildBreadcrumbSchema,
} from "@/lib/seo";

// The homepage, rendered for one service area. "/" renders it for the
// primary area (Los Angeles); each /general-contractor-<area> page renders the
// same sections with its own area swapped into the headings and copy, plus
// what only that area's page has (data/areas.js): a guide to building there
// at the end, just before the footer, and its own FAQs. On an area page
// Areas We Service comes before the FAQ; the homepage keeps the FAQ first.
// Area pages also get a Home > area breadcrumb; the homepage is its own
// root.
//
// Spacing, here and on the service pages: every section carries the same
// gap below it (100px, 120px from 1080px) and none above, so any two
// neighbours sit the same distance apart — the dark contact band too, as
// white space under it (Home/Contact).
export default function HomePage({ area }) {
  const schemas = [
    buildHomeSchema(area),
    buildHomeFAQSchema(area),
    !area.isPrimary &&
      buildBreadcrumbSchema(`General Contractor in ${area.name}`, area.href),
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
      {area.isPrimary ? (
        <>
          <FAQ area={area} />
          <ServiceAreas area={area} />
        </>
      ) : (
        <>
          <ServiceAreas area={area} />
          <FAQ area={area} />
        </>
      )}
      {area.local && <ServiceGuide {...area.local.guide} />}
    </>
  );
}
