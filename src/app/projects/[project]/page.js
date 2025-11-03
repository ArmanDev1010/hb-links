"use client";

import React from "react";
import { useParams } from "next/navigation";
import { projects } from "@/data/projects";

import Intro from "@/components/Projects/Project/Intro";
import Description from "@/components/Projects/Project/Description";
import OtherProjects from "@/components/Projects/Project/OtherProjects";

export default function ProjectPage() {
  const params = useParams();
  const projectId = params?.project;

  const project = projects.find(
    (p) => p.title.toLowerCase().replace(/\s+/g, "-") === projectId
  );

  const otherProjects = projects
    .filter((p) => p.title.toLowerCase().replace(/\s+/g, "-") !== projectId)
    .slice(0, 2);

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
    description,
    details,
    videos,
    scope,
    infastructure,
    why_us,
  } = project;

  return (
    <div>
      <Intro title={title} bg_img={background_image} details={details} />
      <Description
        images={images}
        description={description}
        videos={videos}
        scope={scope}
        infastructure={infastructure}
        why_us={why_us}
      />
      <OtherProjects otherProjects={otherProjects} />
    </div>
  );
}
