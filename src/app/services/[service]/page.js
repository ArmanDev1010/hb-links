"use client";

import React from "react";
import { useParams } from "next/navigation";
import { services } from "@/data/services";
import Intro from "@/components/Services/Service/Intro";
import WhatWeOffer from "@/components/Services/Service/WhatWeOffer";

export async function generateMetadata({ params }) {
  const serviceId = params.service;
  const service = services.find(
    (p) =>
      p.link === serviceId ||
      p.title.toLowerCase().replace(/\s+/g, "-") === serviceId
  );

  if (!service) {
    return {
      title: "Service Not Found | HB LINKS",
      description: "Requested service does not exist.",
      openGraph: {
        images: [{ url: "/seo/main-og.png", width: 1200, height: 630 }],
      },
    };
  }

  return {
    title: `${service.title} | HB LINKS`,
    description: service.description,
    openGraph: {
      title: service.title,
      description: service.description,
      url: `https://hb-links.com/services/${serviceId}`,
      images: [
        {
          url: service.page_image,
          width: 1200,
          height: 630,
          alt: `${service.title} - HB LINKS`,
        },
      ],
    },
  };
}

export default function ServicePage() {
  const params = useParams();
  const serviceId = params?.service;

  const service = services.find((p) =>
    p.link
      ? p.link === serviceId
      : p.title.toLowerCase().replace(/\s+/g, "-") === serviceId
  );

  if (!service) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-xl text-gray-500">Services not found.</p>
      </div>
    );
  }

  let { title, description, aliases, deliverables, page_image } = service;

  return (
    <div className="relative mb-14">
      <Intro
        title={title}
        description={description}
        deliverables={deliverables}
        page_image={page_image}
      />
      <WhatWeOffer aliases={aliases} />
    </div>
  );
}
