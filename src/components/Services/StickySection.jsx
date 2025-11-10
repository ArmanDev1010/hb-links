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
    <div className="relative pb-10">
      <h1 className="text-[6vw] text-center uppercase pt-10 mb-5 text-white pointer-events-none">
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
