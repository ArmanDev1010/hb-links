"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import whiteLine from "@/../public/patterns/line_white.png";
import blackLine from "@/../public/patterns/line_black.png";
import Image from "next/image";

import Services_Slides from "./Services_Slides";

import { privacyPages } from "@/data/privacy";

const contactInfo = [
  { type: "Phone", label: "+1 (818) 303-3555", href: "tel:+1 (818) 303-3555" },
  {
    type: "Mail",
    label: "info@hb-links.com",
    href: "mailto:info@hb-links.com",
  },
  { type: "Area", label: "California, USA" },
];

const pages = ["home", "projects", "services", "contact"];

const privacy_pages = privacyPages.map((page) => page.label);

export default function Footer() {
  const pathname = usePathname();

  const isLightPage =
    pathname.startsWith("/legal");

  return (
    <footer
      className={`relative pb-6 text-black ${
        isLightPage ? "bg-[#1f1f1f] text-white" : "bg-white"
      }`}
    >
      <Services_Slides isLightPage={isLightPage} />

      <div className="flex flex-wrap px-[3%] mb-10 gap-x-36 gap-y-16 max-900:mb-0">
        <ul className="flex flex-wrap items-center justify-between w-full gap-16 text-2xl max-700:flex-col max-550:items-start max-550:gap-12">
          <li className="opacity-70">CSLB #1144057</li>
          {contactInfo.map(({ type, label, href }) => (
            <li key={type} className="w-fit">
              <p
                className={`uppercase text-base mb-2 pointer-events-none ${
                  isLightPage ? "text-white opacity-50" : "text-gray-500"
                }`}
              >
                {type}
              </p>
              {href ? (
                <Link href={href} className="bottom_line">
                  {label}
                </Link>
              ) : (
                <p className="">{label}</p>
              )}
            </li>
          ))}
        </ul>

        <div className="min-w-[200px] max-900:min-w-[150px]">
          <p
            className={`uppercase text-lg mb-8 pointer-events-none ${
              isLightPage ? "text-white opacity-50" : "text-gray-500"
            }`}
          >
            Pages
          </p>
          <ul className="flex gap-16 capitalize text-xl max-700:flex-col max-700:gap-10">
            {pages.map((page) => (
              <li key={page}>
                <Link
                  href={page === "home" ? "/" : `/${page}`}
                  className="bottom_line"
                  prefetch
                >
                  {page}
                </Link>
              </li>
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
          {privacy_pages.map((page) => {
            const slug = page.toLowerCase().replace(/\s+/g, "-");
            return (
              <li key={slug}>
                <Link href={`/legal/${slug}`}>{page}</Link>
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

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-cover bg-no-repeat opacity-10 z-[0]">
        <Image
          src={isLightPage ? whiteLine : blackLine}
          fill
          alt=""
          className="object-cover"
        />
      </div>
    </footer>
  );
}
