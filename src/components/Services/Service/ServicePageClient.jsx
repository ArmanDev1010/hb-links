"use client";

import Intro from "@/components/Services/Service/Intro";
import WhatWeOffer from "@/components/Services/Service/WhatWeOffer";

export default function ServicePageClient({ service }) {
  const { title, description, aliases, deliverables, page_image } = service;

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
