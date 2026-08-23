"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import Logo from "./components/Nav/Logo";
import NavLinks from "./components/Nav/NavLinks";
import MenuBtn from "./components/Nav/MenuBtn";
import RequestBtn from "./components/Form/RequestBtn";
import RequestModal from "./components/Form/RequestModal";
import PhoneBtn from "./components/Nav/PhoneBtn";
import { desktopNavlinks, mobileNavlinks } from "@/data/navigation";
import { useModal } from "@/context/ModalContext";

export default function Navbar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [atTop, setAtTop] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const { showModal, toggleModal, menuActive, setMenuActive } = useModal();

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth <= 1080);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const navlinks = isMobile ? mobileNavlinks : desktopNavlinks;

  useEffect(() => {
    document.body.style.overflow = menuActive || showModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuActive, showModal]);

  const isLightPage =
    pathname.startsWith("/contact") ||
    pathname === "/service-areas" ||
    ["/terms-of-service", "/privacy-policy"].includes(pathname);

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

  // True while the green mega-menu bar is open — the nav itself needs to
  // go white regardless of isLightPage or scroll position. The bar is
  // `position: fixed`, so it always paints above the nav's own background
  // (fixed elements out-stack a static background fill regardless of
  // z-index), meaning it shows through even once scrolled/opaque, not
  // just at the top of the page. Mobile dropdowns only ever open inside
  // the already-dark full-screen menu, so this only matters on desktop.
  const dropdownOverlay = !!activeDropdown && !isMobile;

  const navBase = "w-full transition-all duration-400 !z-[999]";

  const topStyles = atTop
    ? "bg-transparent !h-[95px]"
    : dropdownOverlay
      ? "!bg-white !h-[75px] !text-white"
      : "!bg-white !h-[75px] !text-black";
  const themeStyles = dropdownOverlay
    ? "text-white"
    : isLightPage
      ? "text-black"
      : "text-white";

  const navClasses = `fixed translate-y-0 ${navBase} ${topStyles} ${themeStyles}`;

  return (
    <>
      <nav className={navClasses}>
        <div className="relative 1800:px-[1rem] 1600:px-[3%] 1080:px-[24px] 700:px-[1.5rem] px-[1rem] z-[11] flex items-center justify-between h-full max-w-[1680px] mx-auto w-full">
          <Logo
            atTop={atTop}
            setActiveDropdown={setActiveDropdown}
            menuActive={menuActive}
            setMenuActive={setMenuActive}
            forceBlack={isLightPage && !menuActive && !dropdownOverlay}
            forceWhite={dropdownOverlay}
          />
          <div className="flex items-center 1440:gap-x-[40px] gap-x-[30px]">
            <NavLinks
              navlinks={navlinks}
              pathname={pathname}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
              atTop={atTop}
              isLightPage={isLightPage}
              menuActive={menuActive}
              setMenuActive={setMenuActive}
              isMobile={isMobile}
            />

            <div className="relative z-20 flex items-center items-stretch gap-4">
              <PhoneBtn
                atTop={atTop}
                menuActive={menuActive}
                isLightPage={isLightPage}
                dropdownOverlay={dropdownOverlay}
              />

              <div className="max-900:hidden">
                <RequestBtn
                  toggleModal={toggleModal}
                  atTop={atTop}
                  forceBlackBorder={isLightPage}
                  forceWhiteBorder={dropdownOverlay}
                  isLightPage={isLightPage}
                  menuActive={menuActive}
                />
              </div>
              <MenuBtn
                menuActive={menuActive}
                setMenuActive={setMenuActive}
                atTop={atTop}
                isLightPage={isLightPage}
              />
            </div>
          </div>
        </div>

        <div
          className="absolute top-[95px] left-0 w-full h-[2px] z-[999]"
          style={{
            background:
              activeDropdown && !isMobile ? "#f6f4ee66" : "transparent",
            top: atTop ? "95px" : "75px",
          }}
        ></div>

        <div
          className="1080:hidden absolute top-0 left-0 w-full z-[10] bg-third/90 backdrop-blur-sm transition-[height] duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]"
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
