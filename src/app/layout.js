import "./globals.css";

import Navbar from "@/components/Navigation/Navbar";
import { Open_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import ConditionalComponents from "@/components/other/ConditionalComponents";

const inter = Open_Sans({ subsets: ["latin"] });

export const metadata = {
  title:
    "HB LINKS | Low Voltage, Security Systems, CCTV, AccessControl, Networking, AV Integration, AudioVideo, Surveillance Systems, SmartHome",
  description:
    "We design and install structured cabling, UniFi networking, CCTV, access control, and AV integration for businesses across California. Reliable infrastructure, seamless connectivity, and secure systems tailored to your industry.",
  keywords: [
    "structured cabling",
    "networking",
    "low-voltage infrastructure",
    "CCTV installation",
    "security cameras",
    "access control",
    "audio video integration",
    "California IT services",
    "commercial wiring",
    "data cabling",
  ],
  authors: [{ name: "HB LINKS" }],
  openGraph: {
    title: "Professional Networking, Cabling & Security Solutions",
    description:
      "Trusted partner for structured cabling, UniFi networking, CCTV, access control, and AV integration.",
    url: "https://hb-links.com",
    siteName: "HB LINKS",
    images: [
      {
        url: "logos/logo.png",
        width: 1200,
        height: 630,
        alt: "Networking and Security Solutions",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://hb-links.com",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Your Company Name",
              url: "https://yourdomain.com",
              logo: "logos/white_vertical.png",
              image: "logos/white_vertical.png",
              description:
                "We provide structured cabling, networking, CCTV, access control, and AV integration services across California.",
              telephone: "+1-555-123-4567",
              address: {
                "@type": "PostalAddress",
                streetAddress: "123 Business St",
                addressLocality: "Los Angeles",
                addressRegion: "CA",
                postalCode: "90001",
                addressCountry: "US",
              },
              openingHours: "Mo-Fr 09:00-18:00",
              sameAs: [
                "https://www.facebook.com/yourcompany",
                "https://www.linkedin.com/company/yourcompany",
                "https://www.instagram.com/yourcompany",
              ],
              makesOffer: [
                {
                  "@type": "Service",
                  name: "Structured Cabling",
                  description:
                    "Cat5e, Cat6, and fiber optic cabling with clean terminations for reliable connectivity.",
                },
                {
                  "@type": "Service",
                  name: "Networking",
                  description:
                    "UniFi network design and installation for seamless connectivity and redundancy.",
                },
                {
                  "@type": "Service",
                  name: "Security Cameras",
                  description:
                    "CCTV and IP camera systems with NVR configurations for 24/7 monitoring.",
                },
                {
                  "@type": "Service",
                  name: "Access Control",
                  description:
                    "Keypads, card readers, maglocks, and biometric entry solutions for secure access.",
                },
                {
                  "@type": "Service",
                  name: "Audio / Video Integration",
                  description:
                    "Immersive audio/video systems with centralized control and HDMI routing.",
                },
              ],
            }),
          }}
        />
        <link rel="icon" type="image/png" href="logos/favicon.ico" />
      </head>
      <body className={inter.className}>
        <Navbar />
        <Toaster position="top-center" />
        {children}
        <ConditionalComponents />
      </body>
    </html>
  );
}
