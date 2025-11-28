import "./globals.css";

import Navbar from "@/components/Navigation/Navbar";
import { Open_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import ConditionalComponents from "@/components/other/ConditionalComponents";
import Footer from "@/components/Footer/Footer";

const inter = Open_Sans({ subsets: ["latin"] });

export const metadata = {
  title:
    "HB LINKS | Low Voltage, Security Systems, CCTV, AccessControl, Networking, AV Integration, AudioVideo, Surveillance Systems, SmartHome",
  description:
    "We design and install structured cabling, UniFi networking, CCTV, access control, and AV integration for businesses across California. Reliable infrastructure, seamless connectivity, and secure systems tailored to your industry.",
  icons: {
    icon: "/logos/favicon.ico",
  },
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
              name: "HB LINKS",
              url: "https://hb-links.com",
              logo: "/logos/favicon.ico",
              image: "/logos/favicon.ico",
              description:
                "We provide structured cabling, networking, CCTV, access control, and AV integration services across California.",
              telephone: "+1 (818) 303-3555",
              openingHours: "Mo-Su 09:00-18:00",
              sameAs: ["https://www.instagram.com/hb_links/"],
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
      </head>
      <body className={inter.className}>
        <Navbar />
        <Toaster position="top-center" />
        {children}
        <ConditionalComponents />
        <Footer />
      </body>
    </html>
  );
}
