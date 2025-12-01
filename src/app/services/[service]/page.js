import { services } from "@/data/services";
import ServicePageClient from "@/components/Services/Service/ServicePageClient";

export async function generateMetadata({ params }) {
  const serviceId = params.service;
  const service = services.find(
    (p) =>
      p.link === serviceId ||
      p.title.toLowerCase().replace(/\s+/g, "-") === serviceId
  );

  if (!service) {
    return {
      title: "Service Not Found | HB LINKS",
      description: "Requested service does not exist.",
      openGraph: {
        images: [{ url: "/seo/main-og.png", width: 1200, height: 630 }],
      },
    };
  }

  return {
    title: `${service.title} | HB LINKS`,
    description: service.description,
    openGraph: {
      images: [
        {
          url: service.page_image,
          width: 1200,
          height: 630,
          alt: `${service.title} - HB LINKS`,
        },
      ],
    },
  };
}

export default function ServicePage({ params }) {
  const serviceId = params.service;
  const service = services.find(
    (p) =>
      p.link === serviceId ||
      p.title.toLowerCase().replace(/\s+/g, "-") === serviceId
  );

  if (!service) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-xl text-gray-500">Services not found.</p>
      </div>
    );
  }

  return <ServicePageClient service={service} />;
}
