"use client";

import ServiceAreasList from "./ServiceAreasList";
import ServiceAreasCompact from "./ServiceAreasCompact";

export default function ServiceAreas({ compact = false }) {
  return (
    <section
      className={`relative ${compact ? "py-12" : "pt-[48px] pb-[60px]"}`}
      id="service_areas"
    >
      <div
        className={`max-w-[1680px] mx-auto w-full ${compact ? "700:px-[1rem] px-[0.5rem]" : "700:pl-[24px] pl-0 max-700:px-[16px]"}`}
      >
        <div className="mx-auto 1280:w-[83.33%] w-full mb-10 pointer-events-none">
          <p className="1280:text-sm text-xs uppercase font-xbold tracking-widest mb-4 text-gray-700">
            Areas We Service
          </p>

          <h3
            className={`pb-1 font-bold leading-none text-3xl 400:text-4xl lg:text-5xl 1280:text-6xl`}
          >
            Where We Work
          </h3>
        </div>
        {compact ? (
          <div className="mx-auto 1280:w-[83.33%] w-full">
            <ServiceAreasCompact />
          </div>
        ) : (
          <ServiceAreasList />
        )}
      </div>
    </section>
  );
}
