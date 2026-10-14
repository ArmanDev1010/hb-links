import LegalContent, { legalMetadata } from "@/components/Legal/LegalContent";

export const metadata = legalMetadata("terms-of-service");

export default function TermsOfServicePage() {
  return <LegalContent slug="terms-of-service" />;
}
