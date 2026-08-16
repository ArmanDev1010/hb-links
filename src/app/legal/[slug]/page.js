import LegalContent from "@/components/Legal/LegalContent";
import { privacyPages } from "@/data/privacy";
import { BASE_URL } from "@/lib/seo";

export function generateStaticParams() {
  return privacyPages.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = privacyPages.find((item) => item.slug === slug);

  if (!page) return {};

  return {
    title: page.label,
    description: page.description,
    alternates: { canonical: `${BASE_URL}/legal/${slug}` },
  };
}

export default async function LegalPage({ params }) {
  const { slug } = await params;

  return <LegalContent slug={slug} />;
}
