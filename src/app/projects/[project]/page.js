import { projects } from "@/data/projects";
import ProjectPageClient from "@/components/Projects/Project/ProjectPageClient";

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

  const previewImage =
    project.page_images?.[0] || project.background_image || "/seo/main-og.jpg";

  return {
    title: `${project.title} | HB LINKS`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      url: `https://hb-links.com/projects/${projectId}`,
      images: [
        {
          url: previewImage,
          width: 1200,
          height: 630,
          alt: `${project.title} - HB LINKS`,
        },
      ],
    },
  };
}

export default function ProjectPage({ params }) {
  const projectId = params.project;
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

  return <ProjectPageClient project={project} />;
}
