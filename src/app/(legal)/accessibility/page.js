import LegalContent, { legalMetadata } from "@/components/Legal/LegalContent";

export const metadata = legalMetadata("accessibility");

export default function AccessibilityPage() {
  return <LegalContent slug="accessibility" />;
}
