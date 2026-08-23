"use client";

import Link from "next/link";
import { useRef } from "react";
import DropdownShell from "./DropdownShell";
import ServicesMegaMenuContent from "./ServicesMegaMenuContent";
import ServiceAreasMenuContent from "./ServiceAreasMenuContent";

// Non-zero on purpose: the dropdown panel starts a few px below the nav's
// own box (see DropdownShell's gutter comment), so moving from a trigger
// straight down into the open panel briefly crosses a strip that belongs
// to neither's hover area. With a 0ms delay that strip instantly closed
// the dropdown, which then had to reopen a beat later. This delay is a
// buffer for that crossing; it never affects *opening*, which only ever
// happens via a specific trigger's onMouseEnter. (Switching between two
// triggers doesn't rely on this delay at all — see the `<ul>`'s
// onMouseLeave below.)
const CLOSE_DELAY_MS = 250;

export default function NavLinks({
  navlinks,
  pathname,
  activeDropdown,
  setActiveDropdown,
  atTop,
  isLightPage,
  menuActive,
  setMenuActive,
  isMobile,
}) {
  const closeTimeout = useRef(null);

  // Any open dropdown means the green mega-menu bar is showing (it's
  // `position: fixed`, so it paints above the nav's background at any
  // scroll position, not just at the top), so the toggle icon needs to go
  // white regardless of isLightPage — matches the same rule Navbar uses
  // for the logo/nav text.
  const dropdownOverlay = !!activeDropdown && !isMobile;

  const isCurrentPage = (href) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  const getMenuActiveClasses = (active) =>
    menuActive
      ? active
        ? "max-1080:text-white max-1080:opacity-100"
        : "max-1080:text-gray-200 max-1080:opacity-70"
      : "";

  const openDropdown = (title) => {
    if (isMobile) return;
    clearTimeout(closeTimeout.current);
    setActiveDropdown(title);
  };

  const scheduleClose = () => {
    if (isMobile) return;
    clearTimeout(closeTimeout.current);
    closeTimeout.current = setTimeout(() => {
      setActiveDropdown(null);
    }, CLOSE_DELAY_MS);
  };

  const handleLinkClick = () => {
    setMenuActive(false);
    setActiveDropdown(null);
  };

  return (
    <div
      className={`max-1080:h-[100dvh] max-1080:overflow-y-auto max-1080:pt-[6rem] max-1080:absolute max-1080:top-0 max-1080:left-0 max-1080:w-full transition-opacity duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        menuActive
          ? "max-1080:opacity-100 max-1080:pointer-event-auto max-1080:visible text-white"
          : "max-1080:opacity-0 max-1080:pointer-events-none max-1080:invisible"
      }`}
    >
      <div className="max-1080:pointer-events-auto max-1080:h-[calc(100%-3rem)] max-1080:overflow-auto max-1080:border-t-[1px] max-1080:border-l-[1px] max-1080:border-[#f6f4ee40] max-1080:mx-[1rem]">
        <ul
          className="flex flex-col 1080:flex-row 1080:items-center 1080:h-full 1600:gap-x-[1.5rem] 1440:gap-x-[35px] gap-x-[28px] max-1080:gap-y-7 max-1080:pt-[2rem] h-full"
          onMouseLeave={scheduleClose}
        >
          {navlinks.map(({ title, href, type, ...item }, key) => {
            const linkActive = isCurrentPage(href);

            if (!type) {
              return (
                <li
                  className={`max-1080:py-3 1080:h-full 1080:flex 1080:items-center ${
                    title === "Home" ? "1080:hidden" : ""
                  }`}
                  key={key}
                  onMouseEnter={() => openDropdown(null)}
                >
                  <Link
                    href={href}
                    className={`transition-opacity duration-200 hover:opacity-70 uppercase
                  max-1080:tracking-[0.1em] max-1080:font-bold max-1080:text-lg max-1080:px-6 ${getMenuActiveClasses(
                    linkActive,
                  )}`}
                    prefetch
                    onClick={() => setMenuActive(false)}
                  >
                    {title}
                  </Link>
                </li>
              );
            }

            return (
              <li
                className={`relative 1080:h-full `}
                key={key}
                onMouseEnter={() => openDropdown(title)}
              >
                <div className="flex gap-2 1080:justify-center items-center max-1080:py-3 1080:h-full 1600:px-3 max-1080:px-6 relative z-20">
                  <Link
                    href={href}
                    prefetch
                    className={`transition-opacity duration-200 hover:opacity-70 uppercase cursor-pointer
                  1080:text-sm font-medium max-1080:tracking-[0.1em] max-1080:font-bold max-1080:text-lg
                  relative top-[1.5px] flex items-center ${getMenuActiveClasses(linkActive)} ${atTop && !isMobile ? "h-[95px]" : !atTop && !isMobile ? "h-[100px]" : "h-auto"}`}
                    onClick={(e) => {
                      if (isMobile) {
                        e.preventDefault();
                        setActiveDropdown(
                          activeDropdown === title ? null : title,
                        );
                        return;
                      }
                      setMenuActive(false);
                      setActiveDropdown(null);
                    }}
                  >
                    {title}
                  </Link>

                  <button
                    type="button"
                    aria-label={`Toggle ${title} submenu`}
                    className="relative w-[12px] h-[12px] max-1280:w-[10px] max-1280:h-[10px] max-1080:w-[15px] max-1080:h-[15px] max-550:w-[12px] max-550:h-[12px] cursor-pointer"
                    onClick={() =>
                      setActiveDropdown(activeDropdown === title ? null : title)
                    }
                  >
                    <div
                      className={`absolute w-full h-[1.5px] top-1/2 -translate-y-1/2 transition-all ease-[cubic-bezier(0.4,0,0.2,1)] duration-500
                     max-1080:h-[2px]
                    ${activeDropdown === title ? "rotate-90 opacity-0" : ""}
                    ${
                      !menuActive && !dropdownOverlay && (!atTop || isLightPage)
                        ? "bg-black"
                        : "bg-white"
                    }`}
                    />
                    <div
                      className={`absolute h-full w-[1.5px] top-0 left-1/2 -translate-x-1/2 transition-all ease-[cubic-bezier(0.4,0,0.2,1)] duration-500
                    max-1080:w-[2px]
                    ${activeDropdown === title ? "rotate-90" : ""}
                    ${
                      !menuActive && !dropdownOverlay && (!atTop || isLightPage)
                        ? "bg-black"
                        : "bg-white"
                    }`}
                    />
                  </button>
                </div>

                <div
                  className={`max-1080:hidden content-[''] absolute left-0 w-full h-[3px]
              bg-white opacity-0 transition-opacity duration-100 z-[100] ${
                activeDropdown === title ? "opacity-100" : ""
              } ${atTop ? "bottom-[0rem]" : "bottom-[0.75rem]"}`}
                ></div>

                {isMobile && (
                  <DropdownShell
                    active={activeDropdown === title}
                    isMobile={isMobile}
                  >
                    {type === "services" && (
                      <ServicesMegaMenuContent
                        trades={item.trades}
                        pathname={pathname}
                        menuActive={menuActive}
                        onLinkClick={handleLinkClick}
                      />
                    )}
                    {type === "service-areas" && (
                      <ServiceAreasMenuContent
                        featured={item.featured}
                        viewAllHref={item.viewAllHref}
                        pathname={pathname}
                        menuActive={menuActive}
                        onLinkClick={handleLinkClick}
                      />
                    )}
                  </DropdownShell>
                )}
              </li>
            );
          })}
        </ul>

        {!isMobile &&
          navlinks
            .filter((l) => l.type)
            .map((item) => (
              <DropdownShell
                key={item.title}
                active={activeDropdown === item.title}
                isMobile={isMobile}
              >
                {item.type === "services" && (
                  <ServicesMegaMenuContent
                    trades={item.trades}
                    pathname={pathname}
                    menuActive={menuActive}
                    onLinkClick={handleLinkClick}
                    onMouseEnter={() => openDropdown(item.title)}
                    onMouseLeave={scheduleClose}
                  />
                )}
                {item.type === "service-areas" && (
                  <ServiceAreasMenuContent
                    featured={item.featured}
                    viewAllHref={item.viewAllHref}
                    pathname={pathname}
                    menuActive={menuActive}
                    onLinkClick={handleLinkClick}
                    onMouseEnter={() => openDropdown(item.title)}
                    onMouseLeave={scheduleClose}
                  />
                )}
              </DropdownShell>
            ))}
      </div>
    </div>
  );
}
