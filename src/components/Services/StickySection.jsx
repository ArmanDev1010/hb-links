"use client";

import React, { useEffect } from "react";

import Service from "./Service";

import { stickyAnimation } from "./stickyAnimation";

import { services } from "@/data/services";

export default function StickySection() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      stickyAnimation();
    }
  }, []);

  return (
    <div className="relative pb-10 max-700:pb-16">
      <h1 className="text-[6vw] text-center uppercase pt-10 mb-5 text-white pointer-events-none 
      max-900:text-7xl max-900:pt-14 max-900:mb-10 max-700:text-[9vw] max-400:text-[10vw] max-400:mb-8">
        All Services
      </h1>
      {services?.map(
        ({ title, background_image, description, link, aliases }, key) => (
          <Service
            key={key}
            title={title}
            bg_img={background_image}
            description={description}
            link={link}
            aliases={aliases}
          />
        )
      )}
    </div>
  );
}
