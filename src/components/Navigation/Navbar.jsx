"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import Logo from "./Nav/Logo";
import NavLinks from "./Nav/NavLinks";
import PhoneLink from "./Nav/PhoneLink";
import SocialLinks from "./Nav/SocialLinks";
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
    ["/terms-of-service", "/privacy-policy"].includes(pathname);
  const isContactPage = pathname === "/contact";
  const isNonStickyPage = pathname === "/services" || isContactPage;

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

  const navBase =
    "px-[3%] w-full border-b transition-all duration-400 !z-[999]";
  const stickyStyles = isNonStickyPage
    ? "relative z-[999] !bg-primary"
    : `fixed ${visible ? "translate-y-0" : "-translate-y-full"}`;
  const topStyles =
    atTop || showMenu
      ? "bg-transparent"
      : "!bg-white !h-[65px] !text-black !border-black/10";
  const themeStyles = isLightPage
    ? "text-black border-black/10 h-[80px]"
    : "text-white border-white/30 h-[75px]";
  const mobileProjectStyles = isMobileProjectPage
    ? "text-white border-white/30"
    : "";

  const navClasses = `${navBase} ${stickyStyles} ${topStyles} ${themeStyles} ${mobileProjectStyles}`;

  return (
    <>
      <nav className={navClasses}>
        <div className="relative flex items-center h-full max-w-[1600px] mx-auto">
          <div
            className={`flex items-center max-1440:!w-full max-900:justify-between ${
              isLightPage || isContactPage ? "w-full" : "w-[75%]"
            }`}
          >
            <Logo
              atTop={atTop}
              isLightPage={isLightPage}
              showMenu={showMenu}
              isMobileProjectPage={isMobileProjectPage}
            />
            <NavLinks />
            <MenuBtn
              showMenu={showMenu}
              setShowMenu={setShowMenu}
              isLightPage={isLightPage}
              atTop={atTop}
              isMobileProjectPage={isMobileProjectPage}
            />
            <PhoneLink isLightPage={isLightPage} showMenu={showMenu} />
          </div>

          <div
            className={`flex items-center justify-between max-1440:justify-end max-1440:!w-fit max-1440:min-w-[230px] max-1080:hidden ${
              isContactPage ? "w-fit" : "w-[25%]"
            }`}
          >
            <SocialLinks />
            {!isContactPage && <ContactButton />}
          </div>
        </div>
      </nav>
      <Menu showMenu={showMenu} handleClose={handleClose} />
    </>
  );
}
