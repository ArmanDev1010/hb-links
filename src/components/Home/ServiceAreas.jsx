"use client";

import Link from "next/link";
import { ALL_CITIES } from "@/lib/seo";
import { SERVICE_AREAS } from "@/lib/cities";
import Reveal from "@/components/UI/Reveal";
import { BOXED_TITLE, keepTogether } from "@/components/UI/titles";

function AreaPill({ area, active }) {
  return (
    <Link
      href={area.href}
      aria-current={active ? "page" : undefined}
      className={`group flex items-center justify-center gap-2.5 border px-4 py-3.5 pointer-events-auto transition-colors duration-200 hover:border-third hover:bg-third/5 ${
        active
          ? "border-third bg-third/5 text-third"
          : "border-black/10 bg-white"
      }`}
    >
      <span className="w-1.5 h-1.5 bg-third inline-block shrink-0" />
      <span className="font-bold text-xs 700:text-[13px] uppercase tracking-wide truncate">
        {area.name}
      </span>
    </Link>
  );
}

// `area` is the service area whose page this is (highlighted in the list).
// Service pages pass their own `heading` (its lines, e.g. ["ADUs Built",
// "Across Los Angeles"]) and `description`. The heading, the areas and the map
// rise in as they scroll into view (UI/Reveal). Jumped to ("Service Areas" in
// the navbar and footer), it stops clear of the fixed navbar.
export default function ServiceAreas({
  area,
  heading = ["Where We Work"],
  description = "We build throughout Los Angeles County. Free on-site estimates anywhere in our coverage zone.",
}) {
  const moreCities = ALL_CITIES.length - SERVICE_AREAS.length;

  return (
    <section className="relative bg-white scroll-mt-28" id="service_areas">
      <div className="max-w-[1680px] mx-auto w-full 700:px-[32px] px-[24px] pb-[100px] 1080:pb-[120px]">
        <div className="relative overflow-hidden border border-black/10 bg-[#fafafa] py-10 px-6 700:p-10 1080:p-14">
          <div className="flex flex-wrap max-1080:flex-col justify-between gap-x-10 gap-y-6 pb-8 mb-8 border-b border-black/15 pointer-events-none">
            <div className="flex-[1]">
              <Reveal className="flex items-center gap-4 mb-6 800:mb-8">
                <span className="block h-2 w-2 shrink-0 bg-third" />
                <span className="550:text-[13px] text-[12.5px] uppercase font-light tracking-[0.3em]">
                  Areas We Service
                </span>
                <span className="h-px flex-1 bg-gradient-to-r from-fourth/20 to-transparent"></span>
              </Reveal>

              <Reveal
                as="h2"
                delay={0.05}
                className={`${BOXED_TITLE} uppercase`}
              >
                {heading.map((line) => (
                  <span key={line} className="block">
                    {keepTogether(line)}
                  </span>
                ))}
              </Reveal>
            </div>
            <Reveal
              as="p"
              delay={0.1}
              className="1080:self-end text-[15px] 550:text-base text-fourth max-w-3xl 1080:max-w-sm 1280:max-w-lg"
            >
              {description}
            </Reveal>
          </div>

          <Reveal
            delay={0.1}
            className="grid grid-cols-1 550:grid-cols-2 800:grid-cols-3 1080:grid-cols-5 gap-3 mb-8"
          >
            {SERVICE_AREAS.map((serviceArea) => (
              <AreaPill
                key={serviceArea.slug}
                area={serviceArea}
                active={serviceArea.slug === area?.slug}
              />
            ))}
            <div className="flex items-center justify-center gap-2 border border-dashed border-third/50 bg-third/5 px-4 py-3.5 pointer-events-none">
              <span className="font-bold text-xs 700:text-[13px] uppercase tracking-wide text-third">
                + {moreCities} More
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.15} className="border border-black/10">
            <div className="flex items-center gap-4 bg-white px-6 py-3.5 800:px-8">
              <div className="flex items-center justify-center gap-2.5">
                <span className="w-1.5 h-1.5 bg-third inline-block shrink-0" />
                <span className="font-bold text-xs 700:text-[13px] uppercase tracking-wide truncate">
                  Map
                </span>
              </div>
              <span className="block h-3 w-px bg-black/25"></span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-fourth">
                Los Angeles County
              </span>
            </div>
            <div className="bg-[#f5f4f1] border-t border-black/10 p-2">
              <div className="relative h-[270px] 400:h-[300px] 550:h-[340px] 800:h-[450px] w-full overflow-hidden bg-black">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d423116.08925537445!2d-118.6980807!3d34.0542728!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x641cd639313d13b9%3A0xf7b403aff7a5bf6d!2sHB%20Links!5e0!3m2!1sen!2sam!4v1790577268395!5m2!1sen!2sam"
                  className="w-full h-full pointer-events-auto"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="HB Links service area on Google Maps"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
