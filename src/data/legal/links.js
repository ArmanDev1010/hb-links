import Link from "next/link";
import { contactInfo } from "@/data/contact";

// Inline links for the legal pages' text, so phone, email and page links
// come from one place (data/contact.js, data/privacy.js slugs) instead of
// being retyped in every document.

const phone = contactInfo.find((item) => item.type === "Phone");
const email = contactInfo.find((item) => item.type === "E-Mail");

export function PhoneLink() {
  return <a href={phone.href}>{phone.label}</a>;
}

export function EmailLink() {
  return <a href={email.href}>{email.label}</a>;
}

export function DocLink({ slug, children }) {
  return <Link href={`/${slug}`}>{children}</Link>;
}

export function ExternalLink({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
