"use client";

import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";
import { TbMapPin } from "react-icons/tb";

// "Service Areas" menu — a short curated list of SEO-priority cities plus a
// link to the full directory. Same row treatment as the Services menu so the
// two read as one system (desktop dropdown card / mobile accordion).
export default function ServiceAreasMenuContent({
  featured,
  viewAllHref,
  pathname,
  menuActive,
  onLinkClick,
  onMouseEnter,
  onMouseLeave,
}) {
  const isCurrentPage = (h) => pathname === h || pathname.startsWith(`${h}/`);

  return (
    <div
      className="flex flex-col 1080:pt-1 max-1080:bg-black/[0.03]"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {featured.map(({ name, href }) => {
        const active = isCurrentPage(href);
        return (
          <Link
            key={href}
            href={href}
            prefetch
            onClick={onLinkClick}
            className={`group flex items-center gap-3 uppercase border-b border-black/10 transition-colors duration-200
              1080:px-6 1080:py-3 1080:text-[12px] 1080:font-medium 550:font-semibold font-medium 1080:tracking-[0.14em] max-700:!px-7
              pl-11 pr-6 py-[15px] 400:text-[13.5px] text-[13px] tracking-[0.16em]
              ${
                active
                  ? "bg-black/[0.04] text-black font-medium"
                  : `text-black hover:bg-black/[0.05] hover:text-third ${
                      menuActive ? "text-black/70" : ""
                    }`
              }`}
          >
            <TbMapPin className="text-black/55 group-hover:text-black/75 shrink-0 transition-colors" />
            {name}, CA
          </Link>
        );
      })}

      <Link
        href={viewAllHref}
        prefetch
        onClick={onLinkClick}
        className="group flex items-center gap-2 uppercase font-semibold text-black hover:bg-black/[0.05] transition-colors duration-200
          1080:px-6 1080:py-3.5 1080:text-[11.5px] 1080:tracking-[0.16em]
          max-1080:pl-11 max-1080:pr-6 max-1080:py-4 max-1080:text-[13px] max-1080:tracking-[0.18em]"
      >
        See all service areas
        <BsArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
