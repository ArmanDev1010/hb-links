"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/UI/Reveal";

const pad = (n) => String(n).padStart(2, "0");

// The homepage's tabbed services block: a grid of tabs above one card for
// the selected service. Every service's card is rendered and the inactive
// ones are `hidden`, so each description and service-page link stays in the
// HTML for search engines instead of existing only after a click.
//
// The tabs and the card rise in as they scroll into view (UI/Reveal); a
// card shown by its tab rises in again (.tab-panel, globals.css), and its
// photo eases a little closer on hover.
export default function ServiceTabs({ services }) {
  const [active, setActive] = useState(0);
  const total = pad(services.length);

  return (
    <>
      <Reveal
        as="ul"
        delay={0.1}
        role="tablist"
        aria-label="Services"
        className="mt-8 800:mt-10 grid grid-cols-1 550:grid-cols-2 700:grid-cols-3 1080:grid-cols-4 gap-1.5"
      >
        {services.map((service, index) => {
          const selected = index === active;

          return (
            <li role="presentation" key={service.href}>
              <button
                type="button"
                role="tab"
                id={`service-tab-${index}`}
                aria-selected={selected}
                aria-controls={`service-panel-${index}`}
                onClick={() => setActive(index)}
                className={`group flex h-full w-full cursor-pointer items-center gap-2.5 border bg-[#F7F7F7] px-3 py-2.5 text-left transition-colors duration-200 ${
                  selected
                    ? "border-third"
                    : "border-secondary/15 hover:border-secondary/40"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`block h-1.5 w-1.5 flex-shrink-0 transition-colors duration-200 ${
                    selected
                      ? "bg-third"
                      : "bg-secondary/30 group-hover:bg-third"
                  }`}
                />
                <span
                  className={`flex-shrink-0 text-[10px] uppercase tracking-[0.2em] transition-colors duration-200 ${
                    selected ? "text-fourth" : "text-fourth/60"
                  }`}
                >
                  {pad(index + 1)}
                </span>
                <span
                  className={`550:truncate leading-tight font-gt text-[11.5px] 550:text-[12px] font-semibold uppercase tracking-tight transition-colors duration-200 ${
                    selected
                      ? "text-secondary"
                      : "text-secondary/60 group-hover:text-secondary"
                  }`}
                >
                  {service.title}
                </span>
              </button>
            </li>
          );
        })}
      </Reveal>

      <Reveal delay={0.15}>
        {services.map((service, index) => (
          <article
            key={service.href}
            id={`service-panel-${index}`}
            role="tabpanel"
            aria-labelledby={`service-tab-${index}`}
            hidden={index !== active}
            className="tab-panel group/panel mt-4 800:mt-1.5 grid grid-cols-1 800:grid-cols-12 overflow-hidden border border-secondary/15 bg-white"
          >
            <div className="relative order-last 800:order-none h-[220px] 550:h-[280px] 800:h-auto 800:col-span-5">
              {/* The service's photo; black for a service without one yet. */}
              <div className="absolute inset-[15px] overflow-hidden bg-black">
                {service.image && (
                  <Image
                    src={service.image.src}
                    alt={service.image.alt}
                    fill
                    sizes="(min-width: 1520px) 580px, (min-width: 800px) 40vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover/panel:scale-[1.04]"
                  />
                )}
              </div>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-[15px] border border-secondary/15"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-[15px] top-[15px] h-3.5 w-3.5 border-l-2 border-t-2 border-secondary/80"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-[15px] top-[15px] h-3.5 w-3.5 border-r-2 border-t-2 border-secondary/80"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-[15px] left-[15px] h-3.5 w-3.5 border-b-2 border-l-2 border-secondary/80"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-[15px] right-[15px] h-3.5 w-3.5 border-b-2 border-r-2 border-secondary/80"
              />
            </div>
            <div className="flex flex-col gap-6 800:gap-8 p-8 800:p-12 800:col-span-7">
              <p className="text-[11px] uppercase tracking-[0.3em] text-fourth pointer-events-none">
                Service {pad(index + 1)}/{total}
              </p>
              <h3 className="font-gt text-[1.5rem] 800:text-[1.75rem] font-semibold uppercase leading-[1.1] tracking-tight text-secondary pointer-events-none">
                {service.title}
              </h3>
              <p className="text-[15px] 800:text-[17px] leading-relaxed text-fourth pointer-events-none">
                {service.paragraph}
              </p>
              <hr className="mt-auto border-t border-secondary/15" />
              <div className="flex flex-col items-start 550:flex-row 550:flex-wrap 550:items-center 550:justify-between gap-4">
                <span className="text-[15px] text-fourth pointer-events-none">
                  {service.tagline}
                </span>
                <Link href={service.href} className="group w-full 550:w-fit">
                  <div
                    className="relative cursor-pointer flex items-center justify-center border-1 border-black/15 550:min-h-[44px] min-h-[42px] 700:px-12 px-10 w-full 550:w-fit uppercase font-bold text-[13px] 550:text-[14px] tracking-widest
            hover:bg-third transition duration-200 bg-black"
                  >
                    <div className="relative overflow-hidden text-center h-fit">
                      <div className="group-hover:-translate-y-[110%] text-white h-fit flex items-center gap-2 transition duration-300">
                        <span>Learn More</span>
                      </div>
                      <div className="translate-y-[110%] text-white h-fit group-hover:translate-y-0 absolute top-0 bottom-0 left-0 right-0 transition duration-300">
                        <span>Learn More</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </Reveal>
    </>
  );
}
