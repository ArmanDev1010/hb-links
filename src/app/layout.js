import "./globals.css";

import Navbar from "@/components/Navigation/Navbar";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer/Footer";
import {
  ALL_CITIES,
  FEATURED_CITIES,
  BASE_URL,
  DEFAULT_OG_IMAGE,
} from "@/lib/seo";

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default:
      "HB LINKS | General Building, Electrical, Low-Voltage & Plumbing in Los Angeles",
    template: "%s | HB LINKS",
  },
  description: `HB LINKS provides general building, electrical, low-voltage, and plumbing services across ${FEATURED_CITIES.slice(0, 4).join(", ")}, and the greater Los Angeles and Ventura County area. Licensed, insured, and locally trusted.`,
  icons: {
    icon: "/seo/logo.png",
    apple: "/seo/logo.png",
  },
  keywords: [
    "general contractor Los Angeles",
    "general building services",
    "renovation and remodeling contractor",
    "room additions and ADU builder",
    "electrical contractor Los Angeles",
    "panel upgrades and EV charger installation",
    "low voltage contractor",
    "structured cabling installation",
    "security camera installation",
    "access control systems",
    "plumbing contractor Los Angeles",
    "water heater installation",
    "kitchen and bathroom remodeling",
  ],
  authors: [{ name: "HB LINKS" }],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    title: "HB LINKS | General Building, Electrical, Low-Voltage & Plumbing",
    description: `Trusted general contractor for general building, electrical, low-voltage, and plumbing work across ${FEATURED_CITIES.slice(0, 4).join(", ")}, and surrounding areas.`,
    url: BASE_URL,
    siteName: "HB LINKS",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "HB LINKS General Contracting & Low-Voltage Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HB LINKS | General Building, Electrical, Low-Voltage & Plumbing",
    description: `General contracting, electrical, low-voltage, and plumbing services across ${FEATURED_CITIES.slice(0, 4).join(", ")}, and surrounding areas.`,
    images: [DEFAULT_OG_IMAGE],
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  name: "HB LINKS",
  image: `${BASE_URL}${DEFAULT_OG_IMAGE}`,
  url: BASE_URL,
  telephone: "+1-818-303-3555",
  email: "info@hb-links.com",
  address: {
    "@type": "PostalAddress",
    addressRegion: "CA",
    addressCountry: "US",
  },
  areaServed: ALL_CITIES.map((city) => ({
    "@type": "City",
    name: `${city}, CA`,
  })),
  priceRange: "$$",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-gt">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
        <Navbar />
        <Toaster position="top-center" />
        {children}
        <Footer />
      </body>
    </html>
  );
}