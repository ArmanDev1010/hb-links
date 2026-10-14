"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import Logo from "./components/Nav/Logo";
import NavLinks from "./components/Nav/NavLinks";
import MenuBtn from "./components/Nav/MenuBtn";
import RequestBtn from "./components/Form/RequestBtn";
import RequestModal from "./components/Form/RequestModal";
import ThanksModal from "./components/Form/ThanksModal";
import InstagramBtn from "./components/Nav/InstagramBtn";
import PhoneChip from "./components/Nav/PhoneChip";
import { desktopNavlinks, mobileNavlinks } from "@/data/navigation";
import { privacyPages } from "@/data/privacy";
import { useModal } from "@/context/ModalContext";

// White pages with no dark hero behind the navbar, so it's solid with dark
// text from the top instead of transparent with white text.
const LIGHT_PAGES = ["/contact", ...privacyPages.map(({ slug }) => `/${slug}`)];

export default function Navbar() {
  const pathname = usePathname();
  const [atTop, setAtTop] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const {
    showModal,
    toggleModal,
    menuActive,
    setMenuActive,
    thanksName,
    closeThanks,
  } = useModal();
  const showThanks = thanksName !== null;

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 1080);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const navlinks = isMobile ? mobileNavlinks : desktopNavlinks;

  useEffect(() => {
    document.body.style.overflow =
      menuActive || showModal || showThanks ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuActive, showModal, showThanks]);

  useEffect(() => {
    const handleScroll = () => {
      // The homepage hero stays pinned under the bar while its tour plays
      // (Home/HeroBuildSequence), so the bar stays clear over it until the
      // tour ends — the hero puts how far into it that is in
      // data-nav-overlay-end — or, when it shows a still instead, until it
      // has scrolled out from under the bar.
      const hero = document.querySelector("[data-nav-overlay]");
      let overHero = false;
      if (hero) {
        const { top, bottom } = hero.getBoundingClientRect();
        const tourEnd = Number(hero.dataset.navOverlayEnd);
        overHero = tourEnd ? -top < tourEnd : bottom > 100;
      }
      setAtTop(window.scrollY < 10 || overHero);
      setActiveDropdown((d) => (d ? null : d));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLightPage = LIGHT_PAGES.includes(pathname);
  const solid = !atTop || isLightPage || menuActive;
  const light = !solid;

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[999]">
        <div
          className={`1080:hidden fixed inset-0 bg-[#111111]/40 backdrop-blur-sm transition-all duration-300 ${
            menuActive ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setMenuActive(false)}
        />

        <div
          className={`transition-all duration-300 ${solid ? "p-3 400:px-[24px] 700:px-[32px]" : ""}`}
        >
          <div
            className={`relative z-[11] mx-auto w-full max-w-[1680px]
              transition-all duration-300 ${
                solid
                  ? "1080:h-[75px] h-[70px] border bg-white/85 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/85 border-b border-black/10"
                  : "bg-transparent 1080:h-[100px] h-[95px]"
              }`}
          >
            <div
              className={`relative z-[12] 1600:!px-[3%] px-[24px]
                flex items-center justify-between h-full w-full transition-[padding] duration-300 ${
                  solid ? "1080:!px-[20px]" : "700:!px-[32px]"
                }`}
            >
              <Logo
                light={light}
                setActiveDropdown={setActiveDropdown}
                menuActive={menuActive}
                setMenuActive={setMenuActive}
              />

              <NavLinks
                navlinks={navlinks}
                pathname={pathname}
                light={light}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
                menuActive={menuActive}
                setMenuActive={setMenuActive}
                isMobile={isMobile}
              />

              <div className="relative z-20 flex items-center gap-3">
                <InstagramBtn light={light} />
                <PhoneChip light={light} className="!px-7 max-550:hidden" />
                <RequestBtn toggleModal={toggleModal} solid={solid} main />
                <MenuBtn
                  light={light}
                  menuActive={menuActive}
                  setMenuActive={setMenuActive}
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* "wait" lets the request modal finish closing before the thank-you
          modal opens in its place. */}
      <AnimatePresence mode="wait">
        {showModal && (
          <RequestModal key="request-modal" handleClose={toggleModal} />
        )}
        {showThanks && (
          <ThanksModal
            key="thanks-modal"
            name={thanksName}
            handleClose={closeThanks}
          />
        )}
      </AnimatePresence>
    </>
  );
}
