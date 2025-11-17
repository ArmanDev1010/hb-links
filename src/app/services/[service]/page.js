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

  let { title, description, aliases, deliverables, mini_descriptions } =
    service;

  return (
    <div className="relative">
      <Intro
        title={title}
        description={description}
        mini_descriptions={mini_descriptions}
        deliverables={deliverables}
      />
      <WhatWeOffer aliases={aliases} />
    </div>
  );
}
