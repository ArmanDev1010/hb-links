import "./globals.css";

import { Montserrat } from "next/font/google";
import Navbar from "@/components/Navigation/Navbar";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer/Footer";
import { ModalProvider } from "@/context/ModalContext";
import MotionPreferences from "@/components/UI/MotionPreferences";
import PageTransition from "@/components/UI/PageTransition";
import FloatingRequestBtn from "@/components/Navigation/components/Nav/FloatingRequestBtn";
import {
  CORE_CITIES,
  BASE_URL,
  SITE_NAME,
  BUSINESS_ID,
  WEBSITE_ID,
  GOOGLE_MAPS_URL,
  DEFAULT_OG_IMAGE,
  LOGO_IMAGE,
} from "@/lib/seo";
import { PRIMARY_AREA } from "@/lib/cities";
import { servicePages } from "@/data/service-pages";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--next-font-montserrat",
});

// Site-wide defaults. Every page sets its own title, description, canonical
// and share card through buildPageMetadata (lib/seo.js) — nothing here names
// a URL, so a page that forgets can't claim to be the homepage.
export const metadata = {
  metadataBase: new URL(BASE_URL),
  applicationName: SITE_NAME,
  title: {
    default: `Home Builder in Los Angeles, CA | ${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: `Home builder in ${PRIMARY_AREA.coverageServices} — ADUs, garage conversions, additions and remodels by one licensed team. Free on-site estimates.`,
  icons: {
    icon: LOGO_IMAGE,
    apple: LOGO_IMAGE,
  },
  authors: [{ name: SITE_NAME, url: BASE_URL }],
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, type: "image/jpeg" }],
  },
  twitter: {
    card: "summary_large_image",
    images: [DEFAULT_OG_IMAGE],
  },
};

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// The business and the website, described once for every page. Each page's
// own schema (Service, FAQPage, BreadcrumbList) points back at the business
// by BUSINESS_ID. No review or rating markup: the reviews on the site are
// Google reviews, and Google's rules bar marking up reviews collected on
// another site — a business's own reviews never earn stars in results anyway.
const siteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "GeneralContractor",
      "@id": BUSINESS_ID,
      name: SITE_NAME,
      legalName: "HB LINKS LLC",
      url: BASE_URL,
      logo: `${BASE_URL}${LOGO_IMAGE}`,
      image: `${BASE_URL}${DEFAULT_OG_IMAGE}`,
      description:
        "Licensed general contractor building ADUs, garage conversions, home additions, and kitchen, bathroom and whole-home remodels across Los Angeles and the San Fernando Valley.",
      telephone: "+1-818-303-3555",
      email: "info@hb-links.com",
      // Service-area business — no public storefront, so no street address.
      address: {
        "@type": "PostalAddress",
        addressLocality: "Los Angeles",
        addressRegion: "CA",
        addressCountry: "US",
      },
      hasMap: GOOGLE_MAPS_URL,
      sameAs: [
        GOOGLE_MAPS_URL,
        "https://share.google/XmhSxSeMGY10BV7ea",
        "https://www.instagram.com/hb_links/",
      ],
      // The hours on the contact page (Estimate/ReachUsDirect).
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: DAYS,
        opens: "07:00",
        closes: "19:00",
      },
      hasCredential: {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "license",
        name: "California Contractor License #1144057 — B, C-10, C-36",
        recognizedBy: {
          "@type": "GovernmentOrganization",
          name: "Contractors State License Board",
          url: "https://www.cslb.ca.gov",
        },
      },
      areaServed: CORE_CITIES.map((city) => ({
        "@type": "City",
        name: `${city}, CA`,
      })),
      knowsAbout: [
        "Accessory Dwelling Units",
        "Detached ADU Construction",
        "Garage Conversion",
        "Junior ADU (JADU)",
        "Kitchen Remodeling",
        "Bathroom Remodeling",
        "Whole-Home Renovation",
        "Home Additions",
        "Second-Story Additions",
        "Design-Build Construction",
        "Outdoor Living & Hardscaping",
      ],
      // One offer per service page, linked to it.
      makesOffer: servicePages.map((page) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: page.serviceType,
          url: `${BASE_URL}${page.href}`,
        },
      })),
      priceRange: "$$",
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: BASE_URL,
      name: SITE_NAME,
      alternateName: ["HB Links", "HB LINKS LLC"],
      inLanguage: "en-US",
      publisher: { "@id": BUSINESS_ID },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={montserrat.variable} data-scroll-behavior="smooth">
      <body className="font-montserrat">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
        <MotionPreferences>
          <ModalProvider>
            <Navbar />
            <FloatingRequestBtn />
            <Toaster position="top-center" containerStyle={{ zIndex: 100001 }} />
            {children}
            <Footer />
            <PageTransition />
          </ModalProvider>
        </MotionPreferences>
      </body>
    </html>
  );
}
