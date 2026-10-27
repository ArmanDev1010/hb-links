"use client";

import Link from "next/link";
import { TbArrowRight, TbMapPin } from "react-icons/tb";

// The "Service Areas" dropdown, after LeTara's: on a wide screen a panel of
// white glass (DropdownShell) with a label, the areas in two columns, each
// with its map pin and a line between them, and a link to the homepage's
// full list; in the phone menu the same list opens in place, in two columns
// too from 550px and in one below that, where the names wouldn't fit side
// by side, with "See all" as a button of its own under the list. The list
// runs down the first column, then the second, so each
// column's last area is the one without a line under it. The names stand
// alone — the label already says where they are.
export default function ServiceAreasMenuContent({
  featured,
  viewAllHref,
  pathname,
  isMobile,
  onLinkClick,
  onMouseEnter,
  onMouseLeave,
}) {
  const isCurrentPage = (h) =>
    h === "/" ? pathname === "/" : pathname === h || pathname.startsWith(`${h}/`);

  // the first column's length (it takes the odd one out)
  const rows = Math.ceil(featured.length / 2);

  const pin = (href) => (
    <TbMapPin
      className={`shrink-0 transition-colors ${
        isCurrentPage(href) ? "text-third" : "text-black/55 group-hover:text-black/75"
      }`}
    />
  );

  // A row's line: none under the last area and, in two columns, none under
  // the first column's last either — the phone menu's one column keeps it.
  const isLast = (index) => index === featured.length - 1;
  const endsFirstColumn = (index) => index === rows - 1;

  if (isMobile) {
    return (
      <div className="px-7 pt-1 pb-5 bg-black/[0.03]">
        <ul
          className="grid grid-cols-1 550:grid-cols-2 550:grid-flow-col 550:grid-rows-(--rows) 550:gap-x-10"
          style={{ "--rows": `repeat(${rows}, auto)` }}
        >
          {featured.map(({ name, href }, index) => (
            <li
              key={href}
              className={
                isLast(index)
                  ? ""
                  : endsFirstColumn(index)
                    ? "border-b border-black/10 550:border-b-0"
                    : "border-b border-black/10"
              }
            >
              <Link
                href={href}
                prefetch
                onClick={onLinkClick}
                className={`group flex items-center gap-3 py-3 uppercase text-[13px] tracking-[0.14em] font-medium transition-colors duration-200 hover:text-third ${
                  isCurrentPage(href) ? "text-third" : "text-black/80"
                }`}
              >
                {pin(href)}
                {name}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href={viewAllHref}
          prefetch
          onClick={onLinkClick}
          className="group mt-4 flex w-full items-center justify-between gap-3 border border-third/30 bg-third/[0.06] px-4 py-3.5 uppercase text-[12px] font-semibold tracking-[0.16em] text-third transition-colors duration-200 hover:bg-third hover:text-white"
        >
          See all service areas
          <TbArrowRight className="text-[15px] transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>
    );
  }

  return (
    <div
      className="w-[480px] py-3"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <p className="px-6 pt-2 pb-3 uppercase text-[10.5px] font-semibold tracking-[0.24em] text-third pointer-events-none">
        Serving Los Angeles
      </p>
      <ul
        className="grid grid-cols-2 grid-flow-col grid-rows-(--rows) gap-x-8 px-6"
        style={{ "--rows": `repeat(${rows}, auto)` }}
      >
        {featured.map(({ name, href }, index) => (
          <li
            key={href}
            className={
              isLast(index) || endsFirstColumn(index)
                ? ""
                : "border-b border-black/10"
            }
          >
            <Link
              href={href}
              prefetch
              onClick={onLinkClick}
              className={`group flex items-center gap-3 -mx-3 px-3 py-3 uppercase text-[12px] font-medium tracking-[0.14em] transition-colors duration-200 hover:text-black hover:bg-black/[0.04] outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-third ${
                isCurrentPage(href) ? "text-third" : "text-black/75"
              }`}
            >
              {pin(href)}
              {name}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mx-6 mt-2 pt-4 pb-1 border-t border-black/10">
        <Link
          href={viewAllHref}
          prefetch
          onClick={onLinkClick}
          className="group inline-flex items-center gap-2 uppercase text-[11.5px] font-semibold tracking-[0.14em] text-third hover:text-black transition-colors duration-200"
        >
          See all service areas
          <TbArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
