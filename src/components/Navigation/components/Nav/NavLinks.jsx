"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { BsInstagram } from "react-icons/bs";
import { useModal } from "@/context/ModalContext";
import DropdownShell from "./DropdownShell";
import PhoneChip from "./PhoneChip";
import RequestBtn from "../Form/RequestBtn";
import ServicesMegaMenuContent from "./ServicesMegaMenuContent";
import ServiceAreasMenuContent from "./ServiceAreasMenuContent";

// Small buffer so moving the cursor from a trigger to its panel (or between
// two triggers) doesn't flicker the menu closed. Opening is instant and only
// ever happens via a trigger's own onMouseEnter.
const CLOSE_DELAY_MS = 100;

// A desktop dropdown panel's id, by its nav item's index (DropdownShell).
const panelId = (key) => `nav-panel-${key}`;

const within = (rect, x, y) =>
  rect && x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

// Whether (x, y) falls inside a polygon of [x, y] points (ray casting).
function inPolygon(x, y, points) {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const [xi, yi] = points[i];
    const [xj, yj] = points[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

// The safe zone between an open dropdown's trigger and its panel, after the
// shape the user drew: tight around the trigger at the top, flaring out
// below it and down to the panel across about its middle half (21% to 73%
// of its width) — not the whole width. Inside it the menu stays open and
// the nav items it crosses don't react, so the pointer can cut diagonally
// to a row like ADU without the menu closing on the way.
function safeZone(trigger, panel) {
  const flare = trigger.top + trigger.height * 0.55;
  return [
    [trigger.left - 10, trigger.top],
    [trigger.right + 10, trigger.top],
    [trigger.right + 40, flare],
    [panel.left + panel.width * 0.73, panel.top + 4],
    [panel.left + panel.width * 0.21, panel.top + 4],
    [trigger.left - 45, flare],
  ];
}

function Chevron({ open, className = "" }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      aria-hidden="true"
      className={`transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        open ? "rotate-180" : ""
      } ${className}`}
    >
      <path
        d="M2 4.5 L6 8.5 L10 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function NavLinks({
  navlinks,
  pathname,
  light,
  activeDropdown,
  setActiveDropdown,
  menuActive,
  setMenuActive,
  isMobile,
}) {
  const closeTimeout = useRef(null);
  const triggerEls = useRef({});
  const { toggleModal } = useModal();

  const deskText = light ? "1080:text-white" : "1080:text-black";
  // a dropdown's title (Services, Service Areas)
  const titleClasses = `uppercase transition-opacity duration-200 hover:opacity-60 cursor-pointer text-black ${deskText}
    1280:text-[12px] 1080:text-[11px] 700:text-base 400:text-[15px] text-sm 1080:font-semibold font-medium
    1080:tracking-[0.14em] 1080:h-full 1080:flex 1080:items-center
    max-1080:flex-1 1080:px-0 700:px-7 px-5 max-1080:py-[22px] max-1080:tracking-[0.18em]`;

  const openCta = () => {
    setMenuActive(false);
    toggleModal();
  };

  // Whether (x, y) is over the open dropdown: its trigger, its panel, or
  // the safe zone between them.
  const overOpenMenu = (x, y) => {
    const key = navlinks.findIndex((link) => link.title === activeDropdown);
    if (key < 0) return false;
    const trigger = triggerEls.current[key]?.getBoundingClientRect();
    const panel = document.getElementById(panelId(key))?.getBoundingClientRect();
    if (!trigger || !panel) return false;
    return (
      within(trigger, x, y) ||
      within(panel, x, y) ||
      inPolygon(x, y, safeZone(trigger, panel))
    );
  };

  const cancelClose = () => {
    clearTimeout(closeTimeout.current);
    closeTimeout.current = null;
  };

  // `event` is the mouseenter that asked: one that lands in the open
  // dropdown's safe zone (crossing Home or the other dropdown on the way to
  // the panel) is ignored.
  const openDropdown = (title, event) => {
    if (isMobile) return;
    if (
      event &&
      activeDropdown &&
      activeDropdown !== title &&
      overOpenMenu(event.clientX, event.clientY)
    ) {
      return;
    }
    cancelClose();
    setActiveDropdown(title);
  };

  // Closes after CLOSE_DELAY_MS unless something cancels it first; a close
  // already on its way isn't pushed back.
  const scheduleClose = () => {
    if (isMobile || closeTimeout.current) return;
    closeTimeout.current = setTimeout(() => {
      closeTimeout.current = null;
      setActiveDropdown(null);
    }, CLOSE_DELAY_MS);
  };

  // While a dropdown is open on desktop, follow the pointer: over the open
  // menu it stays open; over the other dropdown's trigger (outside the safe
  // zone) that one opens; anywhere else it closes.
  useEffect(() => {
    if (isMobile || !activeDropdown) return;
    const onMove = (event) => {
      const { clientX: x, clientY: y } = event;
      if (overOpenMenu(x, y)) return cancelClose();
      const other = navlinks.findIndex(
        (link, key) =>
          link.type &&
          link.title !== activeDropdown &&
          within(triggerEls.current[key]?.getBoundingClientRect(), x, y),
      );
      if (other >= 0) {
        cancelClose();
        setActiveDropdown(navlinks[other].title);
        return;
      }
      scheduleClose();
    };
    document.addEventListener("pointermove", onMove);
    return () => document.removeEventListener("pointermove", onMove);
  });

  const handleLinkClick = () => {
    setMenuActive(false);
    setActiveDropdown(null);
  };

  return (
    <div
      className={`1080:flex-1 1080:flex 1080:justify-center 1080:h-full
        max-1080:absolute max-1080:top-full max-1080:left-0 max-1080:w-full max-1080:pt-3
        max-1080:transition-all max-1080:duration-300 max-1080:ease-[cubic-bezier(0,0,.2,1)] ${
          menuActive
            ? "max-1080:opacity-100 max-1080:translate-y-0 max-1080:pointer-events-auto"
            : "max-1080:opacity-0 max-1080:-translate-y-4 max-1080:pointer-events-none max-1080:invisible"
        }`}
    >
      <div
        className="1080:h-full
        max-1080:bg-white/85 max-1080:backdrop-blur-xl max-1080:backdrop-saturate-150
        max-1080:border max-1080:border-black/10 max-1080:overflow-y-auto max-1080:overscroll-contain
        max-1080:max-h-[calc(100dvh-150px)]"
      >
        <ul className="flex flex-col 1080:flex-row 1080:items-center 1080:h-full 1600:gap-x-[2rem] 1440:gap-x-[34px] 1280:gap-x-[26px] 1080:gap-x-[22px]">
          {navlinks.map(({ title, href, type, ...item }, key) => {
            if (!type) {
              return (
                <li
                  className="1080:h-full 1080:flex 1080:items-center max-1080:border-b max-1080:border-black/10"
                  key={key}
                  onMouseEnter={(event) => openDropdown(null, event)}
                >
                  <Link
                    href={href}
                    prefetch
                    className={`uppercase transition-opacity duration-200 hover:opacity-60 text-black ${deskText}
                      1280:text-[12px] 1080:text-[11px] 700:text-base 400:text-[15px] text-sm 1080:tracking-[0.14em] 
                      1080:font-semibold font-medium
                      max-1080:block max-1080:w-full 1080:px-0 700:px-7 px-5 max-1080:py-[22px] max-1080:tracking-[0.18em]`}
                    onClick={() => setMenuActive(false)}
                  >
                    {title}
                  </Link>
                </li>
              );
            }

            const open = activeDropdown === title;

            return (
              <li
                className="relative 1080:h-[95%] max-1080:border-b max-1080:border-black/10"
                key={key}
                ref={(el) => {
                  triggerEls.current[key] = el;
                }}
                onMouseEnter={(event) => openDropdown(title, event)}
                onMouseLeave={scheduleClose}
              >
                <div className="flex items-center 1080:gap-2 1080:justify-center 1080:h-full relative z-20 max-1080:pr-5">
                  {/* On desktop the title goes to the section (this page's
                      own where it has one, see UI/PageTransition); in the
                      phone menu it opens the list under it. */}
                  {isMobile ? (
                    <button
                      type="button"
                      aria-expanded={open}
                      className={`${titleClasses} text-left`}
                      onClick={() => setActiveDropdown(open ? null : title)}
                    >
                      {title}
                    </button>
                  ) : (
                    <Link
                      href={href}
                      prefetch
                      className={titleClasses}
                      onClick={() => {
                        setMenuActive(false);
                        setActiveDropdown(null);
                      }}
                    >
                      {title}
                    </Link>
                  )}

                  <button
                    type="button"
                    aria-label={`Toggle ${title} submenu`}
                    className={`cursor-pointer flex items-center text-black ${deskText} max-1080:p-2`}
                    onClick={() => setActiveDropdown(open ? null : title)}
                  >
                    <Chevron
                      open={open}
                      className="1080:w-[10px] 1080:h-[10px]"
                    />
                  </button>
                </div>

                {/* a mark under the open link (desktop): white over the
                    hero, black once the bar is solid */}
                <div
                  className={`max-1080:hidden absolute left-0 w-full h-[2px] bottom-0 transition-opacity duration-150 z-[100] ${
                    light ? "bg-white" : "bg-black"
                  } ${open ? "opacity-100" : "opacity-0"}`}
                />

                <DropdownShell
                  id={panelId(key)}
                  active={open}
                  isMobile={isMobile}
                  triggerEl={triggerEls.current[key]}
                >
                  {type === "services" && (
                    <ServicesMegaMenuContent
                      rows={item.rows}
                      pathname={pathname}
                      isMobile={isMobile}
                      onLinkClick={handleLinkClick}
                      onMouseEnter={() => openDropdown(title)}
                      onMouseLeave={scheduleClose}
                    />
                  )}
                  {type === "service-areas" && (
                    <ServiceAreasMenuContent
                      featured={item.featured}
                      viewAllHref={item.viewAllHref}
                      pathname={pathname}
                      isMobile={isMobile}
                      onLinkClick={handleLinkClick}
                      onMouseEnter={() => openDropdown(title)}
                      onMouseLeave={scheduleClose}
                    />
                  )}
                </DropdownShell>
              </li>
            );
          })}
        </ul>

        {/* Mobile menu footer — socials, call, and the primary CTA */}
        <div className="1080:hidden flex flex-col gap-4 px-6 pt-6 pb-9">
          <div className="flex gap-3 max-800:flex-col">
            <Link
              href="https://www.instagram.com/hb_links/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="HB Links on Instagram"
              className="w-11 h-11 grid place-items-center border border-black/25 text-black shrink-0 transition-colors duration-200 hover:bg-black hover:text-white"
            >
              <BsInstagram className="w-[17px] h-[17px]" />
            </Link>
            <PhoneChip
              icon
              className="flex-[0.5] !font-bold 550:!text-base !text-[14px] !gap-4 max-800:min-h-[44px]"
            />
            <RequestBtn toggleModal={openCta} solid className="flex-[0.5]" />
          </div>
        </div>
      </div>
    </div>
  );
}
