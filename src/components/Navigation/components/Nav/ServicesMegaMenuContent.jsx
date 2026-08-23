"use client";

import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";
import { FEATURED_CITIES } from "@/lib/seo";
import { cityHref } from "@/lib/cities";

const MAX_VISIBLE_SUBTRADES = 4;

export default function ServicesMegaMenuContent({
  trades,
  pathname,
  menuActive,
  onLinkClick,
  onMouseEnter,
  onMouseLeave,
}) {
  const isCurrentPage = (h) => pathname === h || pathname.startsWith(`${h}/`);
  // Only the desktop 4-column mega-menu caps the list (mobile renders one
  // trade at a time via this same component, with room to show everything).
  const isGrouped = trades.length > 1;

  const getMenuActiveClasses = (active) =>
    menuActive
      ? active
        ? "max-1080:text-white max-1080:opacity-100"
        : "max-1080:text-[#f6f4ee99] max-1080:opacity-70"
      : "";

  // No 1080:whitespace-nowrap here on purpose — the column has a fixed
  // width (see below), and letting long labels wrap within it is what
  // keeps them from overflowing straight through the divider into the
  // next column.
  const subLinkClasses = (isActive) =>
    `block text-[17px] 550:text-base py-3 1080:py-2 1080:text-sm font-xbold transition-colors duration-300 1080:text-[#f6f4ee99] hover:opacity-70 1080:hover:opacity-100 1080:hover:text-white ${getMenuActiveClasses(
      isActive,
    )} ${isActive ? "1080:text-white" : ""}`;

  const headerClasses = (isActive) =>
    `block text-base 550:text-[17px] 1080:mb-4 pt-8 1080:pt-0 pb-3 uppercase tracking-widest font-bold border-b border-white/20 1080:text-white transition-colors duration-300 hover:opacity-70 ${getMenuActiveClasses(
      isActive,
    )}`

  const showAllClasses =
    "block text-lg py-3 1080:py-2 1080:mt-1 1080:text-sm font-bold uppercase tracking-widest text-white transition-opacity duration-300 hover:opacity-70";

  return (
    // The hover safe-zone for keeping the dropdown open is scoped to this
    // box, not the full-width green bar it sits inside — it's sized to
    // exactly the visible content (from the first trade column to the
    // "All areas" link), so blank bar space to the left/right of the
    // content closes the dropdown same as leaving it from below.
    <div
      className="1080:max-w-[1220px] 1080:mx-auto"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="px-6 1080:px-0 1080:pt-10 flex flex-col 1080:flex-row 1080:justify-center">
        {trades.map((trade, i) => {
          const subs = trade.dropdown ?? [];
          const visibleSubs = isGrouped
            ? subs.slice(0, MAX_VISIBLE_SUBTRADES)
            : subs;
          const hasMore = isGrouped && subs.length > MAX_VISIBLE_SUBTRADES;

          return (
            <div
              key={trade.href}
              className={`flex flex-col 1080:w-[220px] 1280:w-full ${
                i > 0
                  ? "1080:ml-6 1080:pl-6 1280:ml-8 1280:pl-8 1080:border-l 1080:border-white/15"
                  : ""
              }`}
            >
              <Link
                href={trade.href}
                prefetch
                className={headerClasses(isCurrentPage(trade.href))}
                onClick={onLinkClick}
              >
                {trade.title}
              </Link>
              {visibleSubs.map(({ label, href: subHref }) => (
                <Link
                  key={subHref}
                  href={subHref}
                  prefetch
                  className={subLinkClasses(isCurrentPage(subHref))}
                  onClick={onLinkClick}
                >
                  {label}
                </Link>
              ))}
              {hasMore && (
                <Link
                  href={trade.href}
                  prefetch
                  className={showAllClasses}
                  onClick={onLinkClick}
                >
                  Show all →
                </Link>
              )}
            </div>
          );
        })}
      </div>

      <div className="px-6 1080:px-0 1080:pb-10 hidden 1080:flex 1080:items-center 1080:justify-between 1080:gap-6 1080:mt-8 1080:pt-6 1080:border-t 1080:border-white/20">
        {/* min-w-0 overrides the flex default of min-width:auto, which
            would otherwise refuse to let this text wrap/shrink below its
            full unwrapped width — pushing "All areas" off the clipped
            edge of the bar at narrower desktop widths. */}
        <p className="min-w-0 text-sm text-[#f6f4ee99]">
          <span className="font-bold text-white mr-3">Serving </span>
          {FEATURED_CITIES.map((city, i) => (
            <span key={city}>
              <Link
                href={cityHref(city)}
                onClick={onLinkClick}
                className="hover:text-white transition-colors"
              >
                {city}
              </Link>
              {i < FEATURED_CITIES.length - 1 ? " · " : ""}
            </span>
          ))}
        </p>
        <Link
          href="/service-areas"
          onClick={onLinkClick}
          className="flex items-center gap-1.5 shrink-0 text-sm font-bold uppercase tracking-widest text-white hover:opacity-70 transition-opacity"
        >
          All areas
          <BsArrowRight />
        </Link>
      </div>
    </div>
  );
}
