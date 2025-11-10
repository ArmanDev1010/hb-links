"use client";

import React from "react";
import { projects } from "@/data/projects";
import ProjectPreview from "@/components/Projects/ProjectPreview";
import { normalizeCategory } from "../utils/normalizeCategory";

import greenLine from "@/../public/patterns/line_green.png";
import Image from "next/image";

export default function RelatedProjects({ serviceTitle }) {
  const relatedProjects = projects.filter((project) =>
    project.categories.some((cat) => normalizeCategory(cat) === serviceTitle)
  );

  if (relatedProjects.length === 0) return null;

  return (
    <div className="relative pb-[50px] px-[5%]">
      <h3 className="uppercase text-[max(3vw,5vw)] mb-[50px] leading-[1.1] pointer-events-none">
        Related Projects
      </h3>
      <div className="relative z-[1] grid grid-cols-2 gap-6">
        {relatedProjects.map(
          ({ title, id, video, background_image, images, categories }, key) => (
            <ProjectPreview
              key={key}
              title={title}
              id={id}
              video={video}
              bg_img={background_image}
              images={images}
              categories={categories}
              isLoading={false}
              isBlack={true}
            />
          )
        )}
      </div>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-cover bg-no-repeat opacity-50">
        <Image
          src={greenLine}
          layout="fill"
          objectFit="cover"
          quality={100}
          alt=""
        />
      </div>
    </div>
  );
}
