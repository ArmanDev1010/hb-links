import LegalContent, { legalMetadata } from "@/components/Legal/LegalContent";

export const metadata = legalMetadata("disclaimer");

export default function DisclaimerPage() {
  return <LegalContent slug="disclaimer" />;
}
