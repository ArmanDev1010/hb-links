"use client";

import Link from "next/link";
import { TbArrowRight } from "react-icons/tb";
import { useModal } from "@/context/ModalContext";

const number = (i) => String(i + 1).padStart(2, "0");

// The "Services" dropdown, after LeTara's: on a wide screen a panel of white
// glass (DropdownShell) with a label, every service page numbered in two
// columns with a line between rows — its name over its one-line blurb, an
// arrow sliding in on hover —
// and a footer that opens the estimate form for anyone not sure what fits.
// In the phone menu the same rows open in place, in one column. Rows come
// from navigation.js `servicesNavItem`.
export default function ServicesMegaMenuContent({
  rows,
  pathname,
  isMobile,
  onLinkClick,
  onMouseEnter,
  onMouseLeave,
}) {
  const { toggleModal } = useModal();
  const isCurrentPage = (h) => pathname === h || pathname.startsWith(`${h}/`);

  const openEstimate = () => {
    onLinkClick();
    toggleModal();
  };

  if (isMobile) {
    return (
      <ul className="px-7 pt-1 pb-5 bg-black/[0.03]">
        {rows.map(({ title, blurb, href }, i) => (
          <li key={href} className="border-b border-black/10 last:border-b-0">
            <Link
              href={href}
              prefetch
              onClick={onLinkClick}
              className="group flex items-baseline gap-4 py-3"
            >
              <span className="w-6 shrink-0 text-[11px] font-semibold tracking-wider text-third">
                {number(i)}
              </span>
              <span>
                <span
                  className={`block font-gt uppercase font-semibold text-[16px] 400:text-[17px] leading-tight transition-colors duration-200 group-hover:text-third ${
                    isCurrentPage(href) ? "text-third" : "text-black"
                  }`}
                >
                  {title}
                </span>
                <span className="block mt-0.5 text-[12.5px] text-black/50">
                  {blurb}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div
      className="w-[700px] py-3"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <p className="px-6 pt-2 pb-3 uppercase text-[10.5px] font-semibold tracking-[0.24em] text-third pointer-events-none">
        What we build
      </p>
      <ul className="grid grid-cols-2 gap-x-8 px-6">
        {rows.map(({ title, blurb, href }, i) => (
          <li
            key={href}
            className="border-b border-black/10 [&:nth-last-child(-n+2)]:border-b-0"
          >
            <Link
              href={href}
              prefetch
              onClick={onLinkClick}
              className="group flex items-start gap-3.5 -mx-2 px-2 py-3.5 transition-colors duration-200 hover:bg-black/[0.04] outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-third"
            >
              <span className="w-5 shrink-0 pt-[3px] text-[11px] font-semibold tracking-wider text-third/60 transition-colors duration-200 group-hover:text-third">
                {number(i)}
              </span>
              <span className="flex-1 min-w-0">
                <span
                  className={`block font-gt uppercase font-semibold text-[15px] leading-tight transition-colors duration-200 group-hover:text-third ${
                    isCurrentPage(href) ? "text-third" : "text-black"
                  }`}
                >
                  {title}
                </span>
                <span className="block mt-1 text-[12.5px] leading-snug text-black/55">
                  {blurb}
                </span>
              </span>
              <TbArrowRight
                aria-hidden="true"
                className="self-center shrink-0 text-third opacity-0 -translate-x-1 transition duration-200 group-hover:opacity-100 group-hover:translate-x-0 motion-reduce:transition-none"
              />
            </Link>
          </li>
        ))}
      </ul>
      <div className="mx-6 mt-2 pt-4 pb-1 border-t border-black/10 flex items-center justify-between gap-4">
        <span className="text-[12.5px] text-black/55 pointer-events-none">
          Not sure what fits?
        </span>
        <button
          type="button"
          onClick={openEstimate}
          aria-haspopup="dialog"
          className="group inline-flex items-center gap-2 uppercase text-[11.5px] font-semibold tracking-[0.14em] text-third hover:text-black transition-colors duration-200 cursor-pointer"
        >
          Get a free estimate
          <TbArrowRight
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </button>
      </div>
    </div>
  );
}
