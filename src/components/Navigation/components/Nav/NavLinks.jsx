"use client";

import Link from "next/link";
import { useRef } from "react";
import DropdownMenu from "./DropdownMenu";
import RequestBtn from "../Form/RequestBtn";

const CLOSE_DELAY_MS = 0;

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
  toggleModal,
}) {
  const closeTimeout = useRef(null);

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

  const cancelClose = () => {
    if (isMobile) return;
    clearTimeout(closeTimeout.current);
  };

  return (
    <div
      className={`max-1080:h-[100dvh] max-1080:overflow-y-auto max-1080:pt-[6rem] max-1080:absolute max-1080:top-0 max-1080:left-0 max-1080:w-full transition-opacity duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        menuActive
          ? "max-1080:opacity-100 max-1080:pointer-event-auto max-1080:visible text-white"
          : "max-1080:opacity-0 max-1080:pointer-events-none max-1080:invisible"
      }`}
      onMouseEnter={cancelClose}
      onMouseLeave={scheduleClose}
    >
      <div className="max-1080:pointer-events-auto max-1080:h-[calc(100%-3rem)] max-1080:overflow-auto max-1080:border-t-[1px] max-1080:border-l-[1px] max-1080:border-[#f6f4ee40] max-1080:mx-[1rem]">
        <ul className="flex flex-col 1080:flex-row 1080:items-center 1080:h-full 1440:gap-x-[2.2rem] gap-x-[18px] max-1080:gap-y-5 max-1080:pt-[2rem] h-full">
          {navlinks.map(({ title, href, dropdown }, key) => {
            const linkActive = isCurrentPage(href);

            if (!dropdown) {
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
                  max-1080:tracking-[0.1em] max-1080:font-bold max-1080:text-xl max-1080:px-6 max-700:text-lg max-550:text-base ${getMenuActiveClasses(
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
                className={`relative 1080:h-full max-1080:after:hidden after:content-[''] after:absolute after:left-0 after:w-full after:h-[3px] 
              after:bg-white after:opacity-0 after:transition-opacity after:duration-200 ${
                activeDropdown === title ? "after:opacity-100" : ""
              } ${atTop ? "after:bottom-[0rem]" : "after:bottom-[0.75rem]"}`}
                key={key}
                onMouseEnter={() => openDropdown(title)}
              >
                <div className="flex gap-2 1080:justify-center items-center max-1080:py-3 max-1080:px-6 1080:h-full 1080:px-3 relative z-20">
                  <Link
                    href={href}
                    prefetch
                    className={`transition-opacity duration-200 hover:opacity-70 uppercase cursor-pointer
                  1280:text-sm text-[12px] font-medium max-1080:tracking-[0.1em] max-1080:font-bold max-1080:text-xl max-700:text-lg max-550:text-base 
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
                      (!atTop && !activeDropdown && !menuActive) ||
                      (isLightPage && !activeDropdown && !menuActive)
                        ? "bg-black"
                        : atTop && isLightPage && !activeDropdown && !menuActive
                          ? "bg-black"
                          : "bg-white"
                    }`}
                    />
                    <div
                      className={`absolute h-full w-[1.5px] top-0 left-1/2 -translate-x-1/2 transition-all ease-[cubic-bezier(0.4,0,0.2,1)] duration-500
                    max-1080:w-[2px] 
                    ${activeDropdown === title ? "rotate-90" : ""} 
                    ${
                      (!atTop && !activeDropdown && !menuActive) ||
                      (isLightPage && !activeDropdown && !menuActive)
                        ? "bg-black"
                        : atTop && isLightPage && !activeDropdown && !menuActive
                          ? "bg-black"
                          : "bg-white"
                    }`}
                    />
                  </button>
                </div>

                <DropdownMenu
                  title={title}
                  href={href}
                  dropdown={dropdown}
                  setActiveDropdown={setActiveDropdown}
                  active={activeDropdown === title}
                  pathname={pathname}
                  setMenuActive={setMenuActive}
                  menuActive={menuActive}
                  isMobile={isMobile}
                  onMouseEnter={cancelClose}
                  onMouseLeave={scheduleClose}
                />
              </li>
            );
          })}

          <li className="700:hidden px-6 py-3">
            <RequestBtn toggleModal={toggleModal} atTop={true} />
          </li>

          <li className="1080:hidden mt-auto flex justify-between flex-wrap gap-x-5 gap-y-7 transition-opacity duration-200 hover:opacity-70 font-bold text-xl pt-16 p-6 max-550:pr-0 max-550:pt-10">
            <Link href="tel:+18183033555">+1 (818) 303-3555</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
