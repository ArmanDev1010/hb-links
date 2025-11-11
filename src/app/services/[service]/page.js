"use client";

import React from "react";
import { useParams } from "next/navigation";
import { services } from "@/data/services";
import Intro from "@/components/Services/Service/Intro";
import WhatWeDeliver from "@/components/Services/Service/WhatWeDeliver";
import AnimatedCards from "@/components/Services/Service/AnimatedCards";
import RelatedProjects from "@/components/Services/Service/RelatedProjects";

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

  let {
    title,
    background_image,
    background_image_page,
    description,
    aliases,
    deliverables,
  } = service;

  return (
    <div className="relative !bg-primary text-white">
      <Intro
        title={title}
        description={description}
        bg_img={background_image}
        bg_img_page={background_image_page}
      />
      <WhatWeDeliver deliverables={deliverables} />
      <AnimatedCards aliases={aliases} />
      <RelatedProjects serviceTitle={title} />
    </div>
  );
}
