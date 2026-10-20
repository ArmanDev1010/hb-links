"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const pad = (number) => String(number).padStart(2, "0");

// The switcher across the legal pages (`pages`, { label, slug }; `current`
// is this page's slug). It sticks under the navbar once it reaches it, so
// the other pages stay a tap away all the way down, turning into a frosted
// bar like the navbar's while it's stuck. Where the pages don't fit on one
// line (phones) the row scrolls sideways, opened on this page's.
export function LegalTabs({ pages, current }) {
  const navRef = useRef(null);
  const listRef = useRef(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const nav = navRef.current;
    let frame = 0;
    const check = () => {
      frame = 0;
      const top = parseFloat(getComputedStyle(nav).top) || 0;
      setStuck(nav.getBoundingClientRect().top <= top + 0.5);
    };
    const onScroll = () => (frame ||= requestAnimationFrame(check));
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // this page's tab in view in the row (it only scrolls on phones)
  useEffect(() => {
    const list = listRef.current;
    const active = list.querySelector("[aria-current='page']");
    if (!active || list.scrollWidth <= list.clientWidth) return;
    const offset =
      active.getBoundingClientRect().left - list.getBoundingClientRect().left;
    list.scrollLeft += offset - (list.clientWidth - active.offsetWidth) / 2;
  }, [current]);

  return (
    <nav
      ref={navRef}
      aria-label="Legal pages"
      className={`sticky top-[94px] 1080:top-[99px] z-20 mt-8 border border-black/10 p-1.5 transition-[background-color,box-shadow] duration-300 ${
        stuck
          ? "bg-white/85 backdrop-blur-xl backdrop-saturate-150 shadow-[0_14px_30px_-22px_rgba(0,0,0,0.4)]"
          : "bg-[#fafafa]"
      }`}
    >
      <ul
        ref={listRef}
        className="flex gap-1.5 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {pages.map(({ label, slug }) => {
          const isActive = slug === current;
          return (
            <li key={slug} className="shrink-0">
              <Link
                href={`/${slug}`}
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex items-center h-9 px-4 border text-[11.5px] 550:text-[12px] font-semibold uppercase tracking-[0.12em] whitespace-nowrap transition-colors duration-200 ${
                  isActive
                    ? "bg-black border-black text-white"
                    : "bg-white border-black/15 text-black/70 hover:border-black hover:text-black"
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// The document's sections as numbered anchor links, then "Contact us"
// (`contactId`). The section being read — the last one whose top has
// scrolled past the upper third of the screen — is marked in green, and the
// mark follows the scroll up and down.
export function SectionLinks({ sections, contactId }) {
  const [active, setActive] = useState(null);
  const ids = [...sections.map(({ id }) => id), contactId].join(" ");

  useEffect(() => {
    const targets = ids.split(" ");
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = Math.max(200, window.innerHeight * 0.3);
      let current = null;
      for (const id of targets) {
        const top = document.getElementById(id)?.getBoundingClientRect().top;
        if (top !== undefined && top <= line) current = id;
      }
      setActive(current);
    };
    const onScroll = () => (frame ||= requestAnimationFrame(update));
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids]);

  const linkClasses = (on) =>
    `group -ml-px flex gap-3 border-l-2 py-1.5 pl-4 text-[13.5px] leading-snug transition-colors duration-200 ${
      on
        ? "border-third text-third"
        : "border-transparent text-black/65 hover:text-black"
    }`;

  return (
    <ol className="flex flex-col border-l border-black/10">
      {sections.map(({ id, heading }, index) => {
        const on = active === id;
        return (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={on ? "location" : undefined}
              className={linkClasses(on)}
            >
              <span
                className={`w-5 shrink-0 tabular-nums transition-colors duration-200 ${
                  on ? "text-third" : "text-black/45 group-hover:text-third"
                }`}
              >
                {pad(index + 1)}
              </span>
              {heading}
            </a>
          </li>
        );
      })}
      <li>
        <a
          href={`#${contactId}`}
          aria-current={active === contactId ? "location" : undefined}
          className={`${linkClasses(active === contactId)} !pl-12`}
        >
          Contact us
        </a>
      </li>
    </ol>
  );
}
