"use client";

import Link from "next/link";
import { BsGeoAlt, BsArrowRight } from "react-icons/bs";

const CITIES_PER_COLUMN = 4;

// A short curated list (8 cities) plus a link to the full directory — the
// dropdown can't hold all ~94 cities, so this only ever shows the
// SEO-priority ones passed in via `featured`.
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

  const getMenuActiveClasses = (active) =>
    menuActive
      ? active
        ? "max-1080:text-white max-1080:opacity-100"
        : "max-1080:text-[#f6f4ee99] max-1080:opacity-70"
      : "";

  const linkClasses = (isActive) =>
    `flex items-center gap-2.5 text-lg py-3 1080:py-2 1080:text-sm 1080:whitespace-nowrap max-700:text-base max-550:text-[15px] font-xbold transition-colors duration-300 1080:text-[#f6f4ee99] hover:opacity-70 1080:hover:opacity-100 1080:hover:text-white ${getMenuActiveClasses(
      isActive,
    )} ${isActive ? "1080:text-white" : ""}`;

  // Desktop splits the featured cities into columns instead of one long
  // list — now that the bar spans the full viewport width, a single
  // narrow column left most of it blank. Mobile still gets one flat
  // stacked list, since these columns collapse to flex-col there.
  const columns = [];
  for (let i = 0; i < featured.length; i += CITIES_PER_COLUMN) {
    columns.push(featured.slice(i, i + CITIES_PER_COLUMN));
  }

  return (
    // Scoped the same way as ServicesMegaMenuContent's safe-zone box — sized
    // to the visible city columns + "See all" link, not the full-width bar.
    <div
      className="1080:max-w-[1120px] 1080:mx-auto"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="px-6 1080:px-0 1080:pt-10 1080:pb-10 flex flex-col 1080:flex-row 1080:justify-center 1080:items-stretch gap-x-16">
        <div className="flex flex-col 1080:flex-row gap-x-10">
          {columns.map((column, i) => (
            <div key={i} className="flex flex-col 1080:min-w-[200px]">
              {column.map(({ name, href }) => (
                <Link
                  key={href}
                  href={href}
                  prefetch
                  className={linkClasses(isCurrentPage(href))}
                  onClick={onLinkClick}
                >
                  <BsGeoAlt className="text-white/60 shrink-0" />
                  {name}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <Link
          href={viewAllHref}
          prefetch
          className="flex items-center 1080:justify-center gap-2 shrink-0 1080:min-w-[220px] text-lg 1080:text-sm py-3 1080:py-0 mt-4 1080:mt-0 pt-4 1080:pt-0 1080:pl-10 border-t 1080:border-t-0 1080:border-l border-white/20 font-bold uppercase tracking-widest text-white transition-opacity duration-300 hover:opacity-70"
          onClick={onLinkClick}
        >
          See all service areas
          <BsArrowRight />
        </Link>
      </div>
    </div>
  );
}
