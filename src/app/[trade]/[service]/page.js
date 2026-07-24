import { notFound } from "next/navigation";
import SubService from "@/components/Expertise/SubService";
import { pages } from "@/data/pages";

function getTrade(trade) {
  return pages.find(
    (page) => page.href.replace("/", "") === trade && page.dropdown,
  );
}

export function generateStaticParams() {
  return pages
    .filter((page) => page.dropdown)
    .flatMap((trade) =>
      trade.dropdown.map((service) => ({
        trade: trade.href.replace("/", ""),
        service: service.href.split("/").pop(),
      })),
    );
}

export async function generateMetadata({ params }) {
  const { trade, service } = await params;

  const category = getTrade(trade);

  if (!category) return {};

  const currentService = category.dropdown.find(
    (item) => item.href.split("/").pop() === service,
  );

  if (!currentService) return {};

  return {
    title: `${currentService.label} | HB LINKS`,
    description: currentService.description,
  };
}

export default async function ServicePage({ params }) {
  const { trade, service } = await params;

  const category = getTrade(trade);

  if (!category) notFound();

  const currentService = category.dropdown.find(
    (item) => item.href.split("/").pop() === service,
  );

  if (!currentService) notFound();

  return (
    <SubService
      category={category}
      service={{
        ...currentService,
        title: currentService.label,
      }}
    />
  );
}
