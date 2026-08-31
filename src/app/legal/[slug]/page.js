import LegalContent from "@/components/Legal/LegalContent";
import { privacyPages } from "@/data/privacy";

export function generateStaticParams() {
  return privacyPages.map(({ slug }) => ({ slug }));
}

export default async function LegalPage({ params }) {
  const { slug } = await params;

  return <LegalContent slug={slug} />;
}
