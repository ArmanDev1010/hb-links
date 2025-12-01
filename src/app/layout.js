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
    images: [
      {
        url: "/services/structured-cabling/images/9.jpg",
        width: 1200,
        height: 630,
        alt: "HB LINKS Networking & Security Solutions",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
