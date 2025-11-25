"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import Logo from "./Nav/Logo";
import NavLinks from "./Nav/NavLinks";
import PhoneLink from "./Nav/PhoneLink";
import ContactButton from "./Nav/ContactButton";

import useMenu from "./hooks/useMenu";
import Menu from "./Menu/Menu";
import MenuBtn from "./Menu/MenuBtn";

export default function Navbar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [atTop, setAtTop] = useState(true);
  const [isMobileProjectPage, setIsMobileProjectPage] = useState(false);

  const { showMenu, setShowMenu, isScrolled, handleClose } = useMenu();

  const isLightPage =
    pathname.startsWith("/projects") ||
    pathname.startsWith("/services") ||
    pathname.startsWith("/about") ||
    [("/terms-of-service", "/privacy-policy")].includes(pathname);
  const isContactPage = pathname === "/contact";
  const isServicesPage = pathname === "/services";

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentY = window.scrollY;
      setAtTop(currentY < 10);
      setVisible(currentY < lastScrollY || currentY < 10);
      lastScrollY = currentY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkMobileProjectPage = () => {
      setIsMobileProjectPage(
        pathname.startsWith("/projects/") && window.innerWidth < 800
      );
    };
    checkMobileProjectPage();
    window.addEventListener("resize", checkMobileProjectPage);
    return () => window.removeEventListener("resize", checkMobileProjectPage);
  }, [pathname]);

  const navBase = "px-[3%] w-full transition-all duration-400 !z-[999]";
  const stickyStyles =
    isServicesPage || isContactPage
      ? "relative z-[999] !border-b-0"
      : `fixed ${visible ? "translate-y-0" : "-translate-y-full"}`;
  const noBorderBottom =
    isServicesPage || showMenu ? "!border-b-0" : `border-b-3 border-third`;
  const topStyles =
    atTop || showMenu
      ? "bg-transparent"
      : "!bg-white !h-[65px] !text-black !border-b-1 !border-black/10";
  const themeStyles = isLightPage
    ? "text-black h-[80px]"
    : "text-white h-[75px]";
  const mobileProjectStyles = isMobileProjectPage ? "text-white" : "";
  const isBlackNav = isContactPage ? "!bg-primary" : "";

  const navClasses = `${navBase} ${stickyStyles} ${topStyles} ${themeStyles} ${mobileProjectStyles} ${isBlackNav} ${noBorderBottom}`;

  return (
    <>
      <nav className={navClasses}>
        <div className="relative flex items-center justify-between h-full max-w-[1600px] mx-auto w-full">
          <div className="flex items-center max-900:justify-between">
            <Logo
              atTop={atTop}
              isLightPage={isLightPage}
              showMenu={showMenu}
              isMobileProjectPage={isMobileProjectPage}
            />
            <NavLinks />
          </div>

          <MenuBtn
            showMenu={showMenu}
            setShowMenu={setShowMenu}
            isLightPage={isLightPage}
            atTop={atTop}
            isMobileProjectPage={isMobileProjectPage}
          />

          <div className="flex gap-7 max-1280:gap-5 max-700:hidden">
            <PhoneLink isLightPage={isLightPage} showMenu={showMenu} />
            {!isContactPage && <ContactButton />}
          </div>
        </div>
      </nav>
      <Menu showMenu={showMenu} handleClose={handleClose} />
    </>
  );
}
