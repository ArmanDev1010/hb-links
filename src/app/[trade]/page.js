import { notFound } from "next/navigation";
import ServicesOverview from "@/components/Expertise/Expertise";
import { pages } from "@/data/pages";

export async function generateStaticParams() {
  return pages.map((page) => ({
    trade: page.href.replace("/", ""),
  }));
}

export async function generateMetadata({ params }) {
  const page = pages.find(({ href }) => href.replace("/", "") === params.trade);

  if (!page) return {};

  return {
    title: `${page.title} | HB LINKS`,
    description: page.description,
  };
}

export default function TradePage({ params }) {
  const page = pages.find(({ href }) => href.replace("/", "") === params.trade);

  if (!page) notFound();

  return <ServicesOverview {...page} services={page.dropdown} />;
}
