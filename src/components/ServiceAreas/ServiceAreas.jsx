"use client";

import ServiceAreasList from "./ServiceAreasList";

export default function ServiceAreas() {
  return (
    <section className="relative py-[60px]" id="service_areas">
      <div className="max-w-[1680px] mx-auto w-full 700:pl-[24px] pl-0 max-700:px-[16px]">
        <div className="mx-auto 1280:w-[83.33%] w-full mb-10 pointer-events-none">
          <p className="1280:text-sm text-xs uppercase font-xbold tracking-widest mb-4 text-gray-700">
            Areas We Service
          </p>

          <h3 className="pb-1 font-bold text-4xl lg:text-5xl 1280:text-6xl leading-none">
            Where We Work
          </h3>
        </div>
        <ServiceAreasList />
      </div>
    </section>
  );
}
