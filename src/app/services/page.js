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
