"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Logo from "./components/Logo";
import NavLinks from "./components/NavLinks";
import MenuBtn from "./components/MenuBtn";
import { pages } from "@/data/pages";

export default function Navbar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [atTop, setAtTop] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [menuActive, setMenuActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth <= 1080);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const navlinks = isMobile
    ? pages
    : [pages[1], pages[2], pages[3], pages[4], pages[7]];

  useEffect(() => {
    if (menuActive) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuActive]);

  const isLightPage =
    pathname.startsWith("/projects") ||
    pathname.startsWith("/services") ||
    pathname.startsWith("/about") ||
    ["/terms-of-service", "/privacy-policy"].includes(pathname);

  const isContactPage = pathname === "/contact";
  const isServicesPage = pathname === "/services";

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentY = window.scrollY;
      setAtTop(currentY < 10);
      setVisible(currentY < lastScrollY || currentY < 10);
      lastScrollY = currentY;

      if (activeDropdown) setActiveDropdown(null);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeDropdown]);

  const navBase = "w-full transition-all duration-400 !z-[999]";
  const stickyStyles =
    isServicesPage || isContactPage
      ? "relative z-[999] !border-b-0"
      : `fixed ${visible ? "translate-y-0" : "-translate-y-full"}`;
  const topStyles = atTop
    ? "bg-transparent !h-[95px]"
    : !atTop && activeDropdown
      ? "!bg-white !h-[75px] !text-white"
      : "!bg-white !h-[75px] !text-black";
  const themeStyles =
    isLightPage && !activeDropdown ? "text-black" : "text-white";
  const isBlackNav = isContactPage ? "!bg-primary" : "";

  const navClasses = `${navBase} ${stickyStyles} ${topStyles} ${themeStyles} ${isBlackNav}`;

  return (
    <nav className={navClasses}>
      <div
        className="relative px-[3%] z-[11] flex items-center justify-between h-full max-w-[1600px] max-1080:px-[1rem] mx-auto w-full border-b-2 transition-[border] duration-500 ease-in-out"
        style={{
          borderBottomColor: activeDropdown ? "#f6f4ee66" : "transparent",
        }}
      >
        <Logo
          atTop={atTop}
          isLightPage={isLightPage}
          setActiveDropdown={setActiveDropdown}
          activeDropdown={activeDropdown}
          setMenuActive={setMenuActive}
          menuActive={menuActive}
        />
        <NavLinks
          navlinks={navlinks}
          pathname={pathname}
          activeDropdown={activeDropdown}
          setActiveDropdown={setActiveDropdown}
          atTop={atTop}
          isLightPage={isLightPage}
          menuActive={menuActive}
          setMenuActive={setMenuActive}
        />
        <MenuBtn
          setMenuActive={setMenuActive}
          menuActive={menuActive}
          atTop={atTop}
          isLightPage={isLightPage}
        />
      </div>
      <div
        className="max-1080:hidden absolute top-0 left-0 w-full h-0 z-[10] bg-third/80 backdrop-blur-sm transition-[height] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          height: activeDropdown
            ? `${
                41 *
                  (pages.find((link) => link.title === activeDropdown)?.dropdown
                    ?.length > 10
                    ? 10
                    : pages.find((link) => link.title === activeDropdown)
                        ?.dropdown?.length) +
                194
              }px`
            : "0",
        }}
      ></div>
      <div
        className="1080:hidden absolute top-0 left-0 w-full z-[10] bg-third/80 backdrop-blur-sm transition-[height] duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ height: menuActive ? "100vh" : "0" }}
      ></div>
    </nav>
  );
}
