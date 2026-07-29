"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";

const DESKTOP_GAP_PX = 93;
const ITEMS_PER_COLUMN = 10;

export default function DropdownMenu({
  title,
  href,
  dropdown,
  setActiveDropdown,
  active,
  pathname,
  setMenuActive,
  menuActive,
  isMobile,
  onMouseEnter,
  onMouseLeave,
}) {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  const isCurrentPage = (h) => pathname === h || pathname.startsWith(`${h}/`);

  const getMenuActiveClasses = (active) =>
    menuActive
      ? active
        ? "max-1080:text-white max-1080:opacity-100"
        : "max-1080:text-[#f6f4ee99] max-1080:opacity-70"
      : "";

  useLayoutEffect(() => {
    if (!ref.current) return;
    const isDesktop = window.innerWidth >= 1080;
    const gap = isDesktop ? DESKTOP_GAP_PX : 0;
    setHeight(active ? ref.current.scrollHeight + gap : 0);
  }, [active, dropdown, isMobile]);

  const columns = [];
  for (let i = 0; i < dropdown.length; i += ITEMS_PER_COLUMN) {
    columns.push(dropdown.slice(i, i + ITEMS_PER_COLUMN));
  }

  const linkClasses = (isActive) =>
    `block text-lg py-3 1080:py-2.5 1080:text-sm 1080:whitespace-nowrap max-700:text-base max-550:text-[15px] font-xbold transition-opacity duration-300 hover:opacity-70 ${getMenuActiveClasses(
      isActive,
    )}`;

  const handleClick = () => {
    setMenuActive(false);
    setActiveDropdown(null);
  };

  return (
    <div
      className={`overflow-hidden px-6 transition-[height] duration-300 ease-[cubic-bezier(0,0,0.2,1)] 1080:px-0 1080:absolute 1080:top-0 1080:right-0 1080:z-10 1080:w-auto 1080:min-w-full 1080:pt-[calc(5.8rem+40px)] 1080:text-left ${
        active ? "pointer-events-auto" : "pointer-events-none"
      }`}
      style={{ height }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className={`transition-opacity duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col 1080:flex-row gap-x-8 ${
          active
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        ref={ref}
      >
        <Link
          href={href}
          prefetch
          className="1080:hidden text-lg pt-8 pb-3 block font-bold transition-opacity duration-300 hover:opacity-70"
          onClick={handleClick}
        >
          Overview
        </Link>
        {isMobile ? (
          <div className="flex flex-col">
            {dropdown.map(({ label, href: subHref }) => (
              <Link
                key={subHref}
                href={subHref}
                className={linkClasses(isCurrentPage(subHref))}
                prefetch
                onClick={handleClick}
              >
                {label}
              </Link>
            ))}
          </div>
        ) : (
          columns.map((column, columnIndex) => (
            <div key={columnIndex} className="flex flex-col">
              {column.map(({ label, href: subHref }) => (
                <Link
                  key={subHref}
                  href={subHref}
                  className={linkClasses(isCurrentPage(subHref))}
                  prefetch
                  onClick={handleClick}
                >
                  {label}
                </Link>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
