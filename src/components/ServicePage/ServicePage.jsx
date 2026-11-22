import Hero from "@/components/Home/Hero";
import Process from "@/components/Home/Process";
import Contact from "@/components/Home/Contact";
import FAQ from "@/components/Home/FAQ";
import ServiceAreas from "@/components/Home/ServiceAreas";
import ServiceBuild from "./ServiceBuild";
import ServiceOptions from "./ServiceOptions";
import ServiceRelated from "./ServiceRelated";
import { PRIMARY_AREA } from "@/lib/cities";
import {
  buildServicePageSchema,
  buildBreadcrumbSchema,
  buildServiceFAQSchema,
} from "@/lib/seo";

// A /<service>-los-angeles page (data/service-pages). It reuses the
// homepage's sections with the service's own content swapped in — hero,
// process, FAQ, service areas — plus "The Build" right under the hero (the
// stages of its build, ServiceBuild) and its "Often Paired With" links, and
// the homepage's contact section unchanged. A page with `options` gets a
// comparison of the forms the service comes in after How We Work. (11-20:
// What's Included and Know Before You Build were taken out; Related comes
// after Areas We Service.)
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
        scene={page.slug}
        variant="service"
      />
      <ServiceBuild
        slug={page.slug}
        heading={page.build.heading}
        intro={page.build.intro}
        steps={page.build.steps}
      />
      {/* The section right before the dark contact band leaves room for
          it to cut in (edgeBottom); the FAQ after it does the same at its
          top (edgeTop). */}
      <Process
        steps={page.process.steps}
        closing={page.process.closing}
        intro={page.process.intro}
        decorated
        edgeBottom={!page.options}
      />
      {page.options && <ServiceOptions {...page.options} edgeBottom />}
      <Contact heading={page.estimateHeading} decorated />
      <FAQ
        area={area}
        faqs={page.faqs}
        topic={page.faqTopic}
        intro={page.faqIntro}
        edgeTop
      />
      <ServiceAreas
        area={area}
        heading={page.coverage.heading}
        description={page.coverage.description}
      />
      <ServiceRelated services={page.related} last />
    </>
  );
}
