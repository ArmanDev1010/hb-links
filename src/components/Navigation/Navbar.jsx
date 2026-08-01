"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import Logo from "./components/Nav/Logo";
import NavLinks from "./components/Nav/NavLinks";
import MenuBtn from "./components/Nav/MenuBtn";
import RequestBtn from "./components/Form/RequestBtn";
import RequestModal from "./components/Form/RequestModal";
import { pages } from "@/data/pages";

export default function Navbar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [atTop, setAtTop] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [menuActive, setMenuActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth <= 1080);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const navlinks = isMobile ? pages : [pages[1], pages[2], pages[3], pages[4]];

  useEffect(() => {
    document.body.style.overflow = menuActive || showModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuActive, showModal]);

  const isLightPage =
    pathname.startsWith("/projects") ||
    pathname.startsWith("/services") ||
    pathname.startsWith("/about") ||
    ["/terms-of-service", "/privacy-policy"].includes(pathname);

  const isSubTradePage = pages.some((page) =>
    page.dropdown?.some((sub) => sub.href === pathname),
  );

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
      : "fixed translate-y-0";
  const topStyles = atTop
    ? "bg-transparent !h-[95px]"
    : !atTop && activeDropdown
      ? "!bg-white !h-[75px] !text-white"
      : "!bg-white !h-[75px] !text-black";
  const themeStyles =
    (isLightPage && !activeDropdown) || (isSubTradePage && !activeDropdown)
      ? "text-black"
      : "text-white";
  const isBlackNav = isContactPage ? "!bg-primary" : "";

  const navClasses = `${navBase} ${stickyStyles} ${topStyles} ${themeStyles} ${isBlackNav}`;

  const activeDropdownLength =
    pages.find((link) => link.title === activeDropdown)?.dropdown?.length ?? 0;

  const toggleModal = () => {
    setMenuActive(false);
    setShowModal((prev) => !prev);
  };

  return (
    <>
      <nav className={navClasses}>
        <div
          className="relative 1800:px-[1rem] 1440:px-[3%] 1080:px-[1.2rem] 700:px-[1.5rem] px-[1rem] z-[11] flex items-center justify-between h-full max-w-[1680px] mx-auto w-full border-b-2 transition-[border] duration-500 ease-in-out"
          style={{
            borderBottomColor:
              activeDropdown && !isMobile ? "#f6f4ee66" : "transparent",
          }}
        >
          <Logo
            atTop={atTop}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
            menuActive={menuActive}
            setMenuActive={setMenuActive}
            forceBlack={isSubTradePage && !activeDropdown && !menuActive}
          />
          <div className="flex items-center 1440:gap-x-[47.2px] gap-x-[30px]">
            <NavLinks
              navlinks={navlinks}
              pathname={pathname}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
              atTop={atTop}
              isLightPage={isLightPage}
              isSubTradePage={isSubTradePage}
              menuActive={menuActive}
              setMenuActive={setMenuActive}
              isMobile={isMobile}
              toggleModal={toggleModal}
            />

            <div className="flex items-center gap-4">
              <div className="max-700:hidden">
                <RequestBtn
                  toggleModal={toggleModal}
                  atTop={atTop}
                  activeDropdown={activeDropdown}
                  forceBlackBorder={isSubTradePage && !activeDropdown}
                />
              </div>
              <MenuBtn
                menuActive={menuActive}
                setMenuActive={setMenuActive}
                atTop={atTop}
                isLightPage={isLightPage}
                isSubTradePage={isSubTradePage}
              />
            </div>
          </div>
        </div>

        <div
          className="max-1080:hidden absolute top-0 left-0 w-full h-0 z-[10] bg-third/80 backdrop-blur-sm transition-[height] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{
            height: activeDropdown
              ? `${41 * (activeDropdownLength > 10 ? 10 : activeDropdownLength) + 194}px`
              : "0",
          }}
        />

        <div
          className="1080:hidden absolute top-0 left-0 w-full z-[10] bg-third/80 backdrop-blur-sm transition-[height] duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ height: menuActive ? "100vh" : "0" }}
        />
      </nav>

      <AnimatePresence>
        {showModal && (
          <RequestModal key="request-modal" handleClose={toggleModal} />
        )}
      </AnimatePresence>
    </>
  );
}
