import { notFound } from "next/navigation";
import ServicesOverview from "@/components/Expertise/Expertise";
import { pages } from "@/data/pages";
import { buildTradeMetadata, buildTradeSchema } from "@/lib/seo";

export async function generateStaticParams() {
  return pages.map((page) => ({
    trade: page.href.replace("/", ""),
  }));
}

export async function generateMetadata({ params }) {
  const { trade } = await params;

  const page = pages.find(({ href }) => href.replace("/", "") === trade);

  if (!page) return {};

  return buildTradeMetadata(page);
}

export default async function TradePage({ params }) {
  const { trade } = await params;

  const page = pages.find(({ href }) => href.replace("/", "") === trade);

  if (!page) notFound();

  const tradeSchema = buildTradeSchema(page);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tradeSchema) }}
      />
      <ServicesOverview {...page} services={page.dropdown} />
    </>
  );
}
