import EstimatePage from "@/components/Contact/Estimate/EstimatePage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Contact HB LINKS | Free On-Site Estimates in Los Angeles",
  description:
    "Request a free on-site estimate from HB LINKS for ADUs, remodels, home additions, and outdoor living across Los Angeles and the San Fernando Valley.",
  path: "/contact",
});

export default function ContactPage() {
  return <EstimatePage />;
}
