"use client";

import React, { useEffect } from "react";

import Service from "@/components/Services/Service";

import { stickyAnimation } from "@/components/Services/stickyAnimation";

import { services } from "@/data/services";

export default function ServicesPage() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      stickyAnimation();
    }
  }, []);

  return (
    <div className="relative pb-10 max-700:pb-16">
      <h1
        className="text-[7vw] text-center uppercase pt-10 mb-7 pointer-events-none 
      max-900:text-7xl max-900:pt-14 max-900:mb-10 max-700:text-[10vw] max-550:text-[12vw] max-400:mb-8"
      >
        Services
      </h1>
      {services?.map(({ title, page_image, description, link }, key) => (
        <Service
          key={key}
          title={title}
          page_image={page_image}
          description={description}
          link={link}
        />
      ))}
    </div>
  );
}
