import { notFound } from "next/navigation";
import SubTrade from "@/components/Expertise/SubTrade";
import { pages } from "@/data/pages";
import {
  buildServiceMetadata,
  buildServiceSchema,
  buildServiceBreadcrumbs,
  buildServiceFAQSchema,
} from "@/lib/seo";

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

  return buildServiceMetadata(category, currentService);
}

export default async function ServicePage({ params }) {
  const { trade, service } = await params;

  const category = getTrade(trade);

  if (!category) notFound();

  const currentService = category.dropdown.find(
    (item) => item.href.split("/").pop() === service,
  );

  if (!currentService) notFound();

  const serviceSchema = buildServiceSchema({
    trade: category,
    service: currentService,
  });
  const breadcrumbs = buildServiceBreadcrumbs({
    trade: category,
    service: currentService,
  });
  const faqSchema = buildServiceFAQSchema(currentService);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <SubTrade
        category={category}
        service={{
          ...currentService,
          title: currentService.label,
        }}
      />
    </>
  );
}