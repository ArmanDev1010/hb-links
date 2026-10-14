"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useModal } from "@/context/ModalContext";
import Link from "next/link";

import { MdOutlineLocalPhone } from "react-icons/md";
import { FiCheckSquare } from "react-icons/fi";

const PHONE = "(818) 303-3555";

export default function FloatingRequestBtn() {
  const { toggleModal, menuActive } = useModal();
  const [hidden, setHidden] = useState(true);
  const pathname = usePathname();
  // /contact is already the estimate form, so the bar only offers the phone
  // there — at every width, since it'd otherwise be empty above 550px.
  const onContactPage = pathname === "/contact";

  useEffect(() => {
    // Hidden at the top of the page — and, where the hero plays a build
    // timelapse as you scroll (Home/HeroBuildSequence), until the hero has
    // scrolled out from under the navbar, so the bar never sits over it.
    const handleScroll = () => {
      const hero = document.querySelector("[data-nav-overlay]");
      const inHero = hero ? hero.getBoundingClientRect().bottom > 100 : false;
      setHidden(window.scrollY < 10 || inHero);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const shouldShow = !hidden && !menuActive;

  return (
    <div className="900:hidden fixed bottom-5 700:right-[32px] 400:right-[24px] right-3 z-[9998]">
      <AnimatePresence>
        {shouldShow && (
          <motion.div
            key="floating-bar"
            initial={{ opacity: 0, x: 40, rotate: 3 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            exit={{
              opacity: 0,
              x: 24,
              rotate: 2,
              transition: { duration: 0.18 },
            }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="flex items-stretch h-11 bg-white border border-ink/15 shadow-[0_14px_32px_-10px_rgba(0,0,0,0.35)]"
          >
            <Link
              href={`tel:+1 ${PHONE}`}
              aria-label={`Call us at ${PHONE}`}
              className={`${onContactPage ? "" : "550:hidden"} flex items-center gap-2 pl-3.5 pr-3.5 hover:bg-ink/[0.04] transition-colors duration-200`}
            >
              <MdOutlineLocalPhone className="w-[16px] h-[16px] shrink-0" />
              <span className="text-[12.5px] font-semibold text-ink tracking-[0.1em] whitespace-nowrap">
                {PHONE}
              </span>
            </Link>

            {!onContactPage && (
              <>
                <div className="550:hidden w-px my-2 bg-ink/15 shrink-0" />

                <button
                  onClick={toggleModal}
                  aria-label="Request a free estimate"
                  className="flex items-center justify-center gap-1.5 550:gap-2 700:gap-2.5 px-3.5 550:px-6 700:px-7 bg-third text-white hover:bg-[#0c5a2e] transition-colors duration-200 cursor-pointer"
                >
                  <FiCheckSquare className="w-[15px] h-[15px] 550:w-[16px] 550:h-[16px] 700:w-[17px] 700:h-[17px] shrink-0" />
                  <span className="550:hidden text-[11.5px] leading-[1] mt-0.5 font-medium uppercase tracking-[0.08em] whitespace-nowrap">
                    Estimate
                  </span>
                  <span className="hidden 550:inline text-[12.5px] 700:text-[13px] leading-[1] mt-0.5 font-medium uppercase tracking-[0.08em] whitespace-nowrap">
                    Free Estimate
                  </span>
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
