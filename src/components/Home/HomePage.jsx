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
// primary area (Los Angeles); each /general-contractor-<area> page renders the
// same sections with its own area swapped into the headings and copy, plus
// what only that area's page has: How We Work's descriptions worded for
// the area, and its own FAQs (data/areas.js). Area pages
// leave out the reviews band, and their contact band and Areas We Service
// are titled for the area. On an area page Areas We Service comes before
// the FAQ; the homepage keeps the FAQ first.
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
      <Hero area={area} sequence="intro" />
      <About area={area} />
      <Services area={area} />
      {area.isPrimary && <Reviews />}
      <Process
        decorated
        place={area.isPrimary ? null : area.name}
        afterBand={area.isPrimary}
        edgeBottom
      />
      <Contact
        decorated
        heading={
          area.isPrimary
            ? undefined
            : { firstLine: "Let's Talk About", secondLine: "Your", italic: `${area.name} Project` }
        }
      />
      {/* Whichever follows the dark contact band takes its diagonal. */}
      {area.isPrimary ? (
        <>
          <FAQ area={area} edgeTop />
          <ServiceAreas area={area} last />
        </>
      ) : (
        <>
          <ServiceAreas
            area={area}
            heading={["Building in", area.name]}
            description={`From ${area.name} to the rest of Los Angeles and Ventura Counties, we come out for a free on-site estimate anywhere in our coverage zone.`}
            edgeTop
          />
          <FAQ area={area} last />
        </>
      )}
    </>
  );
}
