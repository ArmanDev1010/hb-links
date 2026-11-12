import Link from "next/link";
import { IoIosArrowRoundForward } from "react-icons/io";
import Reveal from "@/components/UI/Reveal";
import { SERVICES_TITLE } from "@/components/UI/titles";
import ServiceDrawing from "@/components/Home/ServiceDrawing";
import { homepageServices, getAreaParagraph } from "@/data/services";
import { servicePages } from "@/data/service-pages";
import { projectExtras } from "@/data/estimate";

const pad = (n) => String(n).padStart(2, "0");
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

// The cards' spans: ADU, the lead, tall on the left (across the top below
// 1080px), the other four two by two beside it (under it below 1080px).
const LEAD = "700:col-span-2 1080:col-span-1 1080:row-span-2 h-[440px] 700:h-[400px] 1080:h-auto";
const CARD = "h-[290px] 700:h-[300px] 1080:h-auto";

// A service as a black card that opens its page, the service drawn on it
// in the hero's style: its dashed outline until the card comes into view,
// then built (Home/ServiceDrawing). Over the drawing: the service's icon
// (the estimate form's) in the top left, and along the bottom its number,
// name and what it covers — the lead card's full paragraph, the others'
// short line (the estimate form's hint).
//
// The icon is Silver (the user's call, over the lime-on-dark rule).
// Pointing at it (or tabbing to it): the icon's box fills green, the arrow
// fills lime and nudges on, the text lifts a little and a lime rule draws in along
// the foot. With Reduce Motion only the colours change and the rule fades
// in.
function ServiceCard({ service, index }) {
  const { title, href, slug, icon: Icon, text } = service;
  const lead = index === 0;

  return (
    <Reveal as="li" delay={0.06 * index} className={lead ? LEAD : CARD}>
      <Link
        href={href}
        className="group relative isolate flex h-full flex-col justify-end overflow-hidden bg-black text-white outline-none focus-visible:outline-2 focus-visible:-outline-offset-[6px] focus-visible:outline-lime"
      >
        <ServiceDrawing slug={slug} frame={lead ? "lead" : "card"} delay={0.15 * index} />
        {/* darker under the text */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black via-black/80 to-transparent ${lead ? "h-[52%]" : "h-[58%]"}`}
        />

        {Icon && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-5 top-5 700:left-6 700:top-6 grid h-11 w-11 place-items-center border border-white/20 bg-black/60 text-silver transition-colors duration-300 group-hover:border-third group-hover:bg-third group-hover:text-white group-focus-visible:border-third group-focus-visible:bg-third group-focus-visible:text-white"
          >
            <Icon className="text-[22px]" />
          </span>
        )}

        <div
          className={`pointer-events-none relative p-5 700:p-6 1440:p-7 pr-16 700:pr-20 transition-[translate] duration-500 ${EASE} motion-safe:group-hover:-translate-y-1 motion-safe:group-focus-visible:-translate-y-1`}
        >
          <p className="flex items-center gap-2.5 text-[11px] uppercase tracking-[0.3em] text-silver">
            <span className="block h-1.5 w-1.5 bg-third" />
            {pad(index + 1)}
          </p>
          <h3
            className={`mt-2.5 font-gt font-semibold uppercase leading-[1.05] tracking-tight ${
              lead ? "text-[26px] 550:text-[30px] 1440:text-[36px]" : "text-[19px] 550:text-[21px] 1440:text-[23px]"
            }`}
          >
            {title}
          </h3>
          <p
            className={`text-silver first-letter:uppercase ${
              lead ? "mt-3 max-w-md text-[15px] 1440:text-[16px] leading-relaxed" : "mt-1.5 text-[13.5px] 1440:text-[14.5px] leading-snug"
            }`}
          >
            {text}
          </p>
        </div>

        {/* the card opens: the estimate button's arrow */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-5 right-5 700:bottom-6 700:right-6 1440:bottom-7 1440:right-7 grid h-10 w-10 place-items-center border border-white/25 text-white transition-colors duration-300 group-hover:border-lime group-hover:bg-lime group-hover:text-black group-focus-visible:border-lime group-focus-visible:bg-lime group-focus-visible:text-black"
        >
          <IoIosArrowRoundForward
            className={`-rotate-45 text-[24px] transition-[translate] duration-300 ${EASE} motion-safe:group-hover:translate-x-[2px] motion-safe:group-hover:-translate-y-[2px]`}
          />
        </span>
        {/* a lime rule along the foot, drawn in on hover */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-[3px] origin-left bg-lime transition-[scale,opacity] duration-500 ${EASE} motion-safe:scale-x-0 motion-safe:group-hover:scale-x-100 motion-safe:group-focus-visible:scale-x-100 motion-reduce:opacity-0 motion-reduce:group-hover:opacity-100 motion-reduce:group-focus-visible:opacity-100`}
        />
      </Link>
    </Reveal>
  );
}

// What we build: the five main services. The heading on the left with a
// line about how we work beside it; under them ADU as the big card and the
// other four beside it. The whole section fits one screen on a desktop.
export default function Services({ area }) {
  const services = homepageServices.map((service, index) => ({
    title: service.title,
    href: service.href,
    slug: servicePages.find((page) => page.href === service.href)?.slug,
    icon: projectExtras[service.href]?.icon,
    // the lead card's paragraph is resolved for this area, on the server
    text: index === 0 ? getAreaParagraph(service, area) : projectExtras[service.href]?.hint,
  }));

  return (
    <section
      aria-labelledby="services-heading"
      className="wide-zoom relative bg-white pb-[100px] 1080:pb-[120px] scroll-mt-32"
      id="services"
    >
      <div className="max-w-[1680px] mx-auto w-full 700:px-[32px] px-[24px]">
        <div className="grid gap-6 1080:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] 1080:items-end pointer-events-none">
          <div className="flex flex-col gap-6 800:gap-8">
            <Reveal className="flex items-center gap-4 max-w-3xl">
              <span className="block h-2 w-2 flex-shrink-0 bg-third"></span>
              <span className="550:text-[13px] text-[12.5px] text-fourth uppercase font-light tracking-[0.3em]">
                Our Services
              </span>
              <span className="h-px flex-1 bg-gradient-to-r from-fourth/20 to-transparent"></span>
            </Reveal>
            <Reveal as="h2" delay={0.05} id="services-heading" className={`${SERVICES_TITLE} uppercase`}>
              Everything we build <br className="max-400:hidden"></br>
              {area.preposition}{" "}
              <span className="whitespace-nowrap">{area.name}</span>
            </Reveal>
          </div>
          <Reveal
            as="p"
            delay={0.1}
            className="max-w-xl text-base 550:text-[17px] leading-relaxed text-fourth 1080:pb-1"
          >
            From backyard ADUs to whole-home remodels, one licensed and insured
            team takes your project from permits to the final walkthrough.
          </Reveal>
        </div>

        <ul className="mt-8 800:mt-10 grid gap-2 700:grid-cols-2 1080:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] 1080:grid-rows-[repeat(2,238px)] 1440:grid-rows-[repeat(2,270px)]">
          {services.map((service, index) => (
            <ServiceCard key={service.href} service={service} index={index} />
          ))}
        </ul>
      </div>
    </section>
  );
}
