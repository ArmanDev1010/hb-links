import React from "react";
import Link from "next/link";
import { projects } from "@/data/projects";

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

const privacy_pages = ["Terms of service", "Privacy policy"];

const maxProjectsToShow = 4;
const visibleProjects = projects.slice(0, maxProjectsToShow);
const hasMoreProjects = projects.length > maxProjectsToShow;

function Section({ title, children }) {
  return (
    <div className="min-w-[200px] text-xl">
      <p className="uppercase text-base text-gray-500 mb-5 pointer-events-none">
        {title}
      </p>
      {children}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative pt-10 pb-6 bg-[#f6f6f8] text-black">
      <div className="flex flex-wrap justify-between px-[3%] mb-10 gap-10">
        <ul className="flex flex-col gap-9 min-w-[250px] text-xl">
          {contactInfo.map(({ type, label, href }) => (
            <li key={type} className="w-fit">
              <p className="uppercase text-base text-gray-500 mb-2 pointer-events-none">
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

        <Section title="Pages">
          <ul className="flex flex-col gap-5 capitalize">
            {pages.map((page) => (
              <li key={page}>
                <Link
                  href={page === "home" ? "/" : `/${page}`}
                  className="bottom_line"
                >
                  {page}
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Projects">
          <ul className="flex flex-col gap-5 capitalize">
            {visibleProjects.map(({ title, id }) => (
              <li key={id}>
                <Link
                  href={`/projects/${id}`}
                  className="bottom_line w-full truncate overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  {title}
                </Link>
              </li>
            ))}
            {hasMoreProjects && (
              <li>
                <Link
                  href="/projects"
                  className="bottom_line_reverse text-gray-400 text-lg before:!bg-gray-400"
                >
                  View More
                </Link>
              </li>
            )}
          </ul>
        </Section>

        <Section title="Socials">
          <ul className="flex justify-start gap-5 font-medium uppercase">
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
      <div className="mt-26 px-[3%] flex flex-wrap justify-between items-center gap-4 text-sm text-gray-500">
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
    </footer>
  );
}
