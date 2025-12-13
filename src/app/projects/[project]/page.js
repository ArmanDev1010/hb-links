import { projects } from "@/data/projects";
import ProjectPageClient from "@/components/Projects/Project/ProjectPageClient";

export async function generateMetadata({ params }) {
  const { project } = await params;
  const projectId = project;

  const projectData = projects.find(
    (p) => p.title.toLowerCase().replace(/\s+/g, "-") === projectId
  );

  if (!projectData) {
    return {
      title: "Project Not Found | HB LINKS",
      description: "Requested project does not exist.",
      openGraph: {
        images: [{ url: "/seo/main-og.png", width: 1200, height: 630 }],
      },
    };
  }

  const previewImage =
    projectData.page_images?.[0] ||
    projectData.background_image ||
    "/seo/main-og.jpg";

  return {
    title: `${projectData.title} | HB LINKS`,
    description: projectData.description,
    openGraph: {
      title: projectData.title,
      description: projectData.description,
      url: `https://hb-links.com/projects/${projectId}`,
      images: [
        {
          url: previewImage,
          width: 1200,
          height: 630,
          alt: `${projectData.title} - HB LINKS`,
        },
      ],
    },
  };
}

export default async function ProjectPage({ params }) {
  const { project } = await params;
  const projectId = project;

  const projectData = projects.find(
    (p) => p.title.toLowerCase().replace(/\s+/g, "-") === projectId
  );

  if (!projectData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-xl text-gray-500">Project not found.</p>
      </div>
    );
  }

  return <ProjectPageClient project={projectData} />;
}