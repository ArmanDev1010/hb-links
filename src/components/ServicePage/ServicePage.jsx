import Hero from "@/components/Home/Hero";
import Process from "@/components/Home/Process";
import Contact from "@/components/Home/Contact";
import FAQ from "@/components/Home/FAQ";
import ServiceAreas from "@/components/Home/ServiceAreas";
import ServiceIncluded from "./ServiceIncluded";
import ServiceOptions from "./ServiceOptions";
import ServiceGuide from "./ServiceGuide";
import ServiceRelated from "./ServiceRelated";
import { PRIMARY_AREA } from "@/lib/cities";
import {
  buildServicePageSchema,
  buildBreadcrumbSchema,
  buildServiceFAQSchema,
} from "@/lib/seo";

// A /<service>-los-angeles page (data/service-pages). It reuses the
// homepage's sections with the service's own content swapped in — hero,
// process, FAQ, service areas — plus its "What's Included" spec sheet and
// "Often Paired With" links, and the homepage's contact section unchanged.
// Pages aren't all built the same: one with `options` gets a comparison of
// the forms the service comes in after How We Work, one with a `guide`
// gets its local rules and decisions last, just before the footer.
export default function ServicePage({ page }) {
  const area = PRIMARY_AREA;
  const schemas = [
    buildServicePageSchema(page),
    buildBreadcrumbSchema(page.title, page.href),
    buildServiceFAQSchema(page),
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
      <Hero
        area={area}
        title={page.title}
        paragraph={page.hero}
        image={page.image}
        sequence={page.sequence ?? page.slug}
        variant="service"
      />
      <ServiceIncluded
        specs={page.specs}
        heading={page.included.heading}
        intro={page.included.intro}
        items={page.included.items}
      />
      <Process
        steps={page.process.steps}
        closing={page.process.closing}
        intro={page.process.intro}
      />
      {page.options && <ServiceOptions {...page.options} />}
      <Contact heading={page.estimateHeading} />
      <FAQ
        area={area}
        faqs={page.faqs}
        topic={page.faqTopic}
        intro={page.faqIntro}
      />
      <ServiceAreas
        area={area}
        heading={page.coverage.heading}
        description={page.coverage.description}
      />
      <ServiceRelated services={page.related} />
      {page.guide && <ServiceGuide {...page.guide} />}
    </>
  );
}
