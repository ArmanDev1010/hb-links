"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { projects } from "@/data/projects";

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

const pages = ["home", "projects", "services", "about", "contact"];

const socials = [
  { type: "Instagram", href: "https://www.instagram.com/hb_links" },
];

const privacy_pages = privacyPages.map((page) => page.label);

const maxProjectsToShow = 4;
const visibleProjects = projects.slice(0, maxProjectsToShow);
const hasMoreProjects = projects.length > maxProjectsToShow;

function Section({ title, isLightPage, children }) {
  return (
    <div className="min-w-[200px] text-lg">
      <p
        className={`uppercase text-base mb-5 pointer-events-none ${
          isLightPage ? "text-white opacity-50" : "text-gray-500"
        }`}
      >
        {title}
      </p>
      {children}
    </div>
  );
}

export default function Footer() {
  const pathname = usePathname();

  const isLightPage =
    pathname.startsWith("/legal") || ["/services"].includes(pathname);

  return (
    <footer
      className={`relative pb-6 text-black ${
        isLightPage ? "bg-[#1f1f1f] text-white" : "bg-white"
      }`}
    >
      <Services_Slides isLightPage={isLightPage} />

      <div className="flex flex-wrap justify-between px-[3%] mb-10 gap-10">
        <ul className="flex flex-col gap-9 min-w-[250px] text-2xl">
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

        <Section title="Pages" isLightPage={isLightPage}>
          <ul className="flex flex-col gap-5 capitalize">
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
        </Section>

        <Section title="Projects" isLightPage={isLightPage}>
          <ul className="flex flex-col gap-5 capitalize">
            {visibleProjects.map(({ title, id }) => (
              <li key={id}>
                <Link
                  href={`/projects/${title.toLowerCase().replace(/\s+/g, "-")}`}
                  className="bottom_line w-full truncate overflow-hidden text-ellipsis whitespace-nowrap"
                  prefetch
                >
                  {title}
                </Link>
              </li>
            ))}
            {hasMoreProjects && (
              <li>
                <Link
                  href="/projects"
                  className={`bottom_line_reverse text-base ${
                    isLightPage
                      ? "text-white opacity-50 before:!bg-white/50"
                      : "text-gray-500 before:!bg-gray-500"
                  }`}
                  prefetch
                >
                  View More
                </Link>
              </li>
            )}
          </ul>
        </Section>

        <Section title="Socials" isLightPage={isLightPage}>
          <ul className="flex justify-start gap-5 font-medium uppercase text-xl">
            {socials.map(({ type, href }) => (
              <li key={type}>
                <Link href={href} className="bottom_line_reverse">
                  {type}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* Footer Bottom */}
      <div
        className={`mt-26 px-[3%] flex flex-wrap justify-between items-center gap-4 text-sm ${
          isLightPage ? "text-white opacity-50" : "text-gray-500"
        }`}
      >
        <div className="flex gap-36">
          <p className="pointer-events-none">
            © 2025 HB Links. All rights reserved.
          </p>
          <ul className="flex gap-10 capitalize">
            {privacy_pages.map((page) => {
              const slug = page.toLowerCase().replace(/\s+/g, "-");
              return (
                <li key={slug}>
                  <Link href={`/legal/${slug}`}>{page}</Link>
                </li>
              );
            })}
          </ul>
        </div>
        <p className="pointer-events-none">
          Made by{" "}
          <Link
            href="https://armanmanukyan.am/"
            className="font-semibold pointer-events-auto"
          >
            Arman Manukyan
          </Link>
        </p>
      </div>

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-cover bg-no-repeat opacity-10 z-[0]">
        <Image
          src={isLightPage ? whiteLine : blackLine}
          layout="fill"
          objectFit="cover"
          quality={100}
          alt=""
        />
      </div>
    </footer>
  );
}
