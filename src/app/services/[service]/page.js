import { services } from "@/data/services";
import ServicePageClient from "@/components/Services/Service/ServicePageClient";

export async function generateMetadata({ params }) {
  const { service } = await params;
  const serviceId = service;

  const serviceData = services.find(
    (p) =>
      p.link === serviceId ||
      p.title.toLowerCase().replace(/\s+/g, "-") === serviceId
  );

  if (!serviceData) {
    return {
      title: "Service Not Found | HB LINKS",
      description: "Requested service does not exist.",
      openGraph: {
        images: [{ url: "/seo/main-og.png", width: 1200, height: 630 }],
      },
    };
  }

  return {
    title: `${serviceData.title} | HB LINKS`,
    description: serviceData.description,
    openGraph: {
      images: [
        {
          url: serviceData.page_image,
          width: 1200,
          height: 630,
          alt: `${serviceData.title} - HB LINKS`,
        },
      ],
    },
  };
}

export default async function ServicePage({ params }) {
  const { service } = await params;
  const serviceId = service;

  const serviceData = services.find(
    (p) =>
      p.link === serviceId ||
      p.title.toLowerCase().replace(/\s+/g, "-") === serviceId
  );

  if (!serviceData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-xl text-gray-500">Service not found.</p>
      </div>
    );
  }

  return <ServicePageClient service={serviceData} />;
}