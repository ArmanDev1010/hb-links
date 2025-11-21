"use client";

import React from "react";
import { useParams } from "next/navigation";
import { services } from "@/data/services";
import Intro from "@/components/Services/Service/Intro";
import WhatWeOffer from "@/components/Services/Service/WhatWeOffer";

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
