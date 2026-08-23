import ServiceAreas from "@/components/ServiceAreas/ServiceAreas";

export const metadata = {
  title: "Service Areas | HB LINKS",
  description:
    "General building, electrical, plumbing, and low-voltage services across Los Angeles and Ventura County. See every city HB LINKS serves.",
  alternates: { canonical: "https://hb-links.com/service-areas" },
};

export default function ServiceAreasPage() {
  return (
    <div className="pt-32">
      <ServiceAreas />
    </div>
  );
}
