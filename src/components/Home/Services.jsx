import ServiceTabs from "@/components/Home/ServiceTabs";
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
      className="relative bg-white py-24 800:py-32"
      id="services"
    >
      <div className="max-w-[1680px] mx-auto w-full 700:px-[32px] px-[24px]">
        <div className="mx-auto w-full max-w-[1440px]">
          <div className="flex flex-col gap-6 800:gap-8 pointer-events-none">
            <div className="flex items-center gap-4 max-w-3xl">
              <span className="block h-2 w-2 flex-shrink-0 bg-third"></span>
              <span className="550:text-[13px] text-[12.5px] text-fourth uppercase font-light tracking-[0.3em]">
                What We Build
              </span>
              <span className="h-px flex-1 bg-gradient-to-r from-fourth/20 to-transparent"></span>
            </div>
            <h2
              id="services-heading"
              className="font-gt font-semibold leading-[1.2] text-[25px] 400:text-[28px] 550:text-[34px] 800:text-[38px] 1080:text-[40px] 1600:text-[42px]"
            >
              Services we offer <br></br>across{" "}
              <span className="text-third italic">{area.name}</span>
            </h2>
          </div>
          <ServiceTabs services={services} />
        </div>
      </div>
    </section>
  );
}
