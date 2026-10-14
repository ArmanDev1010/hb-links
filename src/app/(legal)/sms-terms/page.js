import LegalContent, { legalMetadata } from "@/components/Legal/LegalContent";

export const metadata = legalMetadata("sms-terms");

export default function SmsTermsPage() {
  return <LegalContent slug="sms-terms" />;
}
