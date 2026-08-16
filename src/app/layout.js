import "./globals.css";

import Navbar from "@/components/Navigation/Navbar";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer/Footer";
import { ModalProvider } from "@/context/ModalContext";
import FloatingRequestBtn from "@/components/Navigation/components/Nav/FloatingRequestBtn";
import {
  ALL_CITIES,
  FEATURED_CITIES,
  BASE_URL,
  DEFAULT_OG_IMAGE,
  LOGO_IMAGE,
} from "@/lib/seo";
import { reviews } from "@/data/reviews";

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default:
      "HB LINKS | General Building, Electrical, Low-Voltage & Plumbing in Los Angeles",
    template: "%s | HB LINKS",
  },
  description: `HB LINKS provides general building, electrical, low-voltage, and plumbing services across ${FEATURED_CITIES.slice(0, 4).join(", ")}, and the greater Los Angeles and Ventura County area. Licensed, insured, and locally trusted.`,
  alternates: { canonical: BASE_URL },
  icons: {
    icon: LOGO_IMAGE,
    apple: LOGO_IMAGE,
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

// Reviews shown on the homepage — reused here so the schema's rating
// count always matches what's actually visible on the page.
const reviewRatings = reviews.map((review) => review.rating);
const averageRating =
  reviewRatings.reduce((sum, rating) => sum + rating, 0) /
  reviewRatings.length;

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["GeneralContractor", "Electrician", "Plumber"],
  name: "HB LINKS",
  image: `${BASE_URL}${DEFAULT_OG_IMAGE}`,
  logo: `${BASE_URL}${LOGO_IMAGE}`,
  url: BASE_URL,
  telephone: "+1-818-303-3555",
  email: "info@hb-links.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "5515 Canoga Avenue",
    addressLocality: "Woodland Hills",
    addressRegion: "CA",
    postalCode: "91367",
    addressCountry: "US",
  },
  sameAs: [
    "https://share.google/XmhSxSeMGY10BV7ea",
    "https://www.instagram.com/hb_links/",
  ],
  areaServed: ALL_CITIES.map((city) => ({
    "@type": "City",
    name: `${city}, CA`,
  })),
  priceRange: "$$",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: averageRating.toFixed(1),
    reviewCount: reviews.length,
  },
  review: reviews.map((review) => ({
    "@type": "Review",
    author: { "@type": "Person", name: review.name },
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.rating,
      bestRating: 5,
    },
    reviewBody: review.quote,
  })),
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
        <ModalProvider>
          <Navbar />
          <FloatingRequestBtn />
          <Toaster position="top-center" />
          {children}
          <Footer />
        </ModalProvider>
      </body>
    </html>
  );
}
