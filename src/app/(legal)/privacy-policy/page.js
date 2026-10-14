import LegalContent, { legalMetadata } from "@/components/Legal/LegalContent";

export const metadata = legalMetadata("privacy-policy");

export default function PrivacyPolicyPage() {
  return <LegalContent slug="privacy-policy" />;
}
