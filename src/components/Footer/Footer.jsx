"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import FooterColumn from "./components/FooterColumn";
import Services_Slides from "./components/Services_Slides";

import { privacyPages } from "@/data/privacy";
import { pages } from "@/data/pages";

const contactInfo = [
  { type: "License", label: "CSLB #1144057" },
  { type: "Phone", label: "+1 (818) 303-3555", href: "tel:+1 (818) 303-3555" },
  {
    type: "E-Mail",
    label: "info@hb-links.com",
    href: "mailto:info@hb-links.com",
  },
  { type: "Area", label: "California, USA" },
];

export default function Footer() {
  const pathname = usePathname();

  const isLightPage =
    pathname.startsWith("/legal") || pathname.startsWith("/contact");

  const expertiseColumns = [pages[1], pages[2], pages[3], pages[4]].map(
    ({ title, href, dropdown }) => ({
      title,
      href,
      links: dropdown,
    }),
  );

  const pageColumn = {
    linkVariant: "title",
    links: [pages[0], pages[5], pages[6], pages[7]].map(({ title, href }) => ({
      label: title,
      href,
    })),
  };

  const footerColumns = [...expertiseColumns, pageColumn];

  return (
    <footer
      className={`relative pb-6 text-black ${
        isLightPage ? "bg-[#1f1f1f] text-white" : "bg-white"
      }`}
    >
      <Services_Slides isLightPage={isLightPage} />

      <div className="mx-auto w-full 900:px-[1.5rem] max-w-[1680px]">
        <div className="flex flex-col gap-y-4">
          <ul
            className="w-full px-4 w-full flex flex-wrap mb-4 justify-center gap-x-20 max-1080:gap-x-12 max-xl:text-center max-400:flex-col max-400:!text-left"
          >
            {contactInfo.map(({ type, label, href }, key) => (
              <li className="pr-4 my-4 text-lg" key={key}>
                <p
                  className={`uppercase !text-sm mb-2 pointer-events-none ${
                    isLightPage ? "text-white opacity-50" : "text-gray-500"
                  }`}
                >
                  {type}
                </p>
                {href ? (
                  <Link href={href}>{label}</Link>
                ) : (
                  <p className="pointer-events-none">{label}</p>
                )}
              </li>
            ))}
          </ul>
          <ul className="w-full px-2 grow flex max-xl:!grid max-xl:grid-cols-2 max-xl:gap-y-4 max-900:!grid-cols-1">
            {footerColumns.map((column, key) => (
              <FooterColumn {...column} key={column.href || key} />
            ))}
          </ul>
        </div>
      </div>
      <div
        className={`mt-26 px-[3%] flex flex-wrap justify-between items-center gap-y-6 gap-x-20 text-sm 
          max-900:flex-col max-900:mt-20 max-900:gap-y-10 ${
            isLightPage ? "text-white opacity-50" : "text-gray-500"
          }`}
      >
        <div className="pointer-events-none">
          © 2025 HB Links. All rights reserved.
        </div>
        <ul className="flex gap-x-10 gap-y-5 capitalize flex-wrap justify-center">
          {privacyPages.map(({ label, slug }) => {
            return (
              <li key={slug}>
                <Link href={`/legal/${slug}`}>{label}</Link>
              </li>
            );
          })}
        </ul>
        <div className="pointer-events-none">
          Made by{" "}
          <Link
            href="https://armanmanukyan.am/"
            className="font-semibold pointer-events-auto"
          >
            Arman Manukyan
          </Link>
        </div>
      </div>
    </footer>
  );
}
