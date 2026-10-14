"use client";

import Link from "next/link";

export default function FlatMenuList({
  rows,
  pathname,
  menuActive,
  onLinkClick,
  onMouseEnter,
  onMouseLeave,
}) {
  const isCurrentPage = (h) => pathname === h || pathname.startsWith(`${h}/`);
  return (
    <div
      className="flex flex-col 1080:py-1 max-1080:bg-black/[0.03]"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {rows.map((row, i) => {
        const active = isCurrentPage(row.href);
        return (
          <Link
            key={row.href}
            href={row.href}
            prefetch
            onClick={onLinkClick}
            className={`group flex items-center gap-3 uppercase transition-colors duration-200
              1080:px-6 1080:py-3 1080:text-[12px] 1080:font-medium 550:font-semibold font-medium 1080:tracking-[0.14em] max-700:!px-7
              pl-11 pr-6 py-[15px] 400:text-[13.5px] text-[13px] tracking-[0.16em]
              ${i < rows.length - 1 ? "border-b border-black/10" : ""}
              ${
                active
                  ? "bg-black/[0.04] text-black"
                  : `text-black hover:bg-black/[0.05] hover:text-third ${
                      menuActive ? "text-black/70" : ""
                    }`
              }`}
          >
            <span className="text-black/35 group-hover:text-black/75 transition-colors">
              —
            </span>
            {row.title}
          </Link>
        );
      })}
    </div>
  );
}
