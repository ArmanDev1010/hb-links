import ServiceTabs from "@/components/Home/ServiceTabs";
import Reveal from "@/components/UI/Reveal";
import { SECTION_TITLE } from "@/components/UI/titles";
import { homepageServices, getAreaParagraph } from "@/data/services";
import { servicePages } from "@/data/service-pages";

export default function Services({ area }) {
  // Only plain strings cross into the client tabs: each card's paragraph is
  // resolved for this area here, on the server.
  const services = homepageServices.map((service) => ({
    title: service.title,
    href: service.href,
    tagline: service.tagline,
    // the photo of the service page the card links to, if it has one
    image: servicePages.find((page) => page.href === service.href)?.image ?? null,
    paragraph: getAreaParagraph(service, area),
  }));

  return (
    <section
      aria-labelledby="services-heading"
      className="relative bg-white pb-[100px] 1080:pb-[120px] scroll-mt-32"
      id="services"
    >
      <div className="max-w-[1680px] mx-auto w-full 700:px-[32px] px-[24px]">
        <div className="flex flex-col gap-6 800:gap-8 pointer-events-none">
          <Reveal className="flex items-center gap-4 max-w-3xl">
            <span className="block h-2 w-2 flex-shrink-0 bg-third"></span>
            <span className="550:text-[13px] text-[12.5px] text-fourth uppercase font-light tracking-[0.3em]">
              What We Build
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-fourth/20 to-transparent"></span>
          </Reveal>
          <Reveal
            as="h2"
            delay={0.05}
            id="services-heading"
            className={SECTION_TITLE}
          >
            Services we offer <br></br>
            {area.preposition}{" "}
            <span className="text-third italic whitespace-nowrap">{area.name}</span>
          </Reveal>
        </div>
        <ServiceTabs services={services} />
      </div>
    </section>
  );
}
