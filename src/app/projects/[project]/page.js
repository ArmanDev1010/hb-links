"use client";

import React from "react";
import { useParams } from "next/navigation";
import { projects } from "@/data/projects";

import Intro from "@/components/Projects/Project/Intro";
import Description from "@/components/Projects/Project/Description";

export default function ProjectPage() {
  const params = useParams();
  const projectId = params?.project;

  const project = projects.find(
    (p) => p.title.toLowerCase().replace(/\s+/g, "-") === projectId
  );

  if (!project) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-xl text-gray-500">Project not found.</p>
      </div>
    );
  }

  let {
    title,
    images,
    background_image,
    video,
    description,
    details,
    scope,
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
        description={description}
        scope={scope}
        categories={categories}
      />
    </div>
  );
}
