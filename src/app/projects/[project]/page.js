"use client";

import React from "react";
import { useParams } from "next/navigation";
import { projects } from "@/data/projects";

import Intro from "@/components/Projects/Project/Intro";
import Description from "@/components/Projects/Project/Description";

export async function generateMetadata({ params }) {
  const projectId = params.project;
  const project = projects.find(
    (p) => p.title.toLowerCase().replace(/\s+/g, "-") === projectId
  );

  if (!project) {
    return {
      title: "Project Not Found | HB LINKS",
      description: "Requested project does not exist.",
      openGraph: {
        images: [{ url: "/seo/main-og.png", width: 1200, height: 630 }],
      },
    };
  }

  return {
    title: `${project.title} | HB LINKS`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      url: `https://hb-links.com/projects/${projectId}`,
      images: [
        {
          url: project.page_images?.[0] || project.background_image,
          width: 1200,
          height: 630,
          alt: `${project.title} - HB LINKS`,
        },
      ],
    },
  };
}

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
