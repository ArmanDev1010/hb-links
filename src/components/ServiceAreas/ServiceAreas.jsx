"use client";

import { useState } from "react";
import ServiceAreasList from "./ServiceAreasList";
import ServiceAreasMap from "./ServiceAreasMap";
import { counties } from "@/data/citys/counties";

export default function ServiceAreas() {
  const [activeCounty, setActiveCounty] = useState(counties[0].county);

  return (
    <section className="relative py-[60px]">
      <div className="max-w-[1680px] mx-auto w-full 700:pl-[1rem] pl-[0.5rem] max-1080:px-[0.5rem]">
        <div className="mx-auto 1280:w-[83.33%] w-full mb-10">
          <p className="1280:text-sm text-xs uppercase font-xbold tracking-widest mb-4 text-gray-700">
            Areas We Service
          </p>

          <h3 className="pb-1 font-bold text-4xl lg:text-5xl 1280:text-6xl leading-none">
            Where We Work
          </h3>
        </div>
        <div className="grid grid-cols-1 1080:grid-cols-2 gap-10 1080:gap-12 items-start">
          <ServiceAreasList onSelectCounty={setActiveCounty} />
          <div className="1080:sticky 1080:top-10 h-screen 1440:max-h-[1200px] 1080:max-h-[900px] max-h-[500px]">
            <div className="w-full h-full">
              <ServiceAreasMap
                activeCounty={activeCounty}
                onSelectCounty={setActiveCounty}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
