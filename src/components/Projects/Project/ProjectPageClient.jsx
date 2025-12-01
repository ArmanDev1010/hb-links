"use client";

import Intro from "@/components/Projects/Project/Intro";
import Description from "@/components/Projects/Project/Description";

export default function ProjectPageClient({ project }) {
  const {
    title,
    images,
    page_images,
    background_image,
    video,
    description,
    details,
    categories,
  } = project;

  return (
    <div>
      <Intro
        title={title}
        bg_img={background_image}
        video={video}
        details={details}
      />
      <Description
        images={images}
        page_images={page_images}
        description={description}
        categories={categories}
      />
    </div>
  );
}
