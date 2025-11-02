"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

const privacyPages = [
  { label: "Terms of Service", slug: "terms-of-service" },
  { label: "Privacy Policy", slug: "privacy-policy" },
];

const contentMap = {
  "terms-of-service": {
    title: "Terms of Service",
    sections: [
      {
        heading: "1. Acceptance of Terms",
        body: "By using our site, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use our services.",
      },
      {
        heading: "2. Scope of Services",
        body: "HB Links provides professional low-voltage contracting and technology integration services, including but not limited to:",
        list: [
          "Security systems and surveillance (CCTV, access control, alarm systems)",
          "Audio/video solutions for residential and commercial spaces",
          "Networking infrastructure and smart home automation",
          "AV integration for educational, corporate, and entertainment environments",
        ],
      },
      {
        heading: "3. Intellectual Property",
        body: "All content on this site, including text, graphics, logos, and images, is the property of HB Links and protected by copyright laws.",
      },
      {
        heading: "4. Limitation of Liability",
        body: "We are not liable for any damages resulting from the use or inability to use our services.",
      },
      {
        heading: "5. Changes to Terms",
        body: "We reserve the right to update these terms at any time. Continued use of the site constitutes acceptance of the revised terms.",
      },
    ],
  },

  "privacy-policy": {
    title: "Privacy Policy",
    sections: [
      {
        heading: "1. Information We Collect",
        body: "We may collect personal information such as your name, email address, phone number, and any other data you provide through forms or communication.",
      },
      {
        heading: "2. How We Use Your Information",
        body: "We use your information to respond to inquiries, provide services, and improve our website and offerings.",
      },
      {
        heading: "3. Data Protection",
        body: "We implement appropriate security measures to protect your data from unauthorized access, alteration, or disclosure.",
      },
      {
        heading: "4. Data Collection for Technical Services",
        body: "When providing services such as security system installation, smart home setup, or networking, we may collect:",
        list: [
          "Site layout details for system planning",
          "Device configurations and IP addresses for network setup",
          "Contact information for service coordination and support",
        ],
      },
      {
        heading: "5. Your Rights",
        body: "You have the right to access, update, or delete your personal information. Contact us at info@hb-links.com for any requests.",
      },
    ],
  },
};

export default function LegalPage({ params }) {
  const pathname = usePathname();
  const { slug } = useParams();
  const content = contentMap[slug];

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        <p className="text-xl">Page not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1f1f1f] text-white">
      <div className="h-[80px]"></div>

      <div className="mx-auto px-[3%] flex flex-col lg:flex-row gap-10">
        {/* Main Content */}
        <div className="flex-1 pt-16 pb-8 text-gray-200 pointer-events-none">
          <h1 className="text-[6vw] uppercase mb-[8.5rem] text-white">
            {content.title}
          </h1>
          {content.sections.map(({ heading, body, list }, index) => (
            <div key={index} className="mb-6">
              <h2 className="text-xl font-semibold mt-10 mb-4">{heading}</h2>
              <p className="mb-4 opacity-70">{body}</p>
              {list && (
                <ul className="list-disc list-inside mb-4 opacity-70">
                  {list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Sidebar Navigation */}
        <aside className="lg:w-[250px] pt-16 pb-8">
          <ul className="flex lg:flex-col gap-3 text-lg font-medium">
            {privacyPages.map(({ label, slug: linkSlug }) => {
              const isActive = pathname.includes(linkSlug);
              return (
                <li key={linkSlug}>
                  <Link
                    href={`/legal/${linkSlug}`}
                    className={`transition-colors ${
                      isActive
                        ? "text-white font-bold"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </div>
  );
}
