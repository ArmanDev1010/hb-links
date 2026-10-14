"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

import whiteLogo from "@/../public/Logos/white_horizontal.png";

// Between pages, a wall goes up: PANELS dark panels, each edged in green,
// rise from the bottom in a wave from left to right and close the screen. On
// it a faint blueprint grid and the logo, with a green "laser level" line
// sweeping under it while the next page loads. Once that page is in (its
// hero image painted), the logo fades and the panels lift off the top in the
// same wave, uncovering it.
//
// It takes over clicks on links to other pages of the site (any <a>, so
// next/link everywhere): covers first, then navigates. New tabs, other
// sites, files, links within the page, and Back/Forward are left alone.
// With "reduce motion" on, the panels fade in and out in the same wave
// instead of sliding.
const PANELS = 5;
const EASE = [0.76, 0, 0.24, 1];
const COVER = { duration: 0.45, stagger: 0.04 };
const REVEAL = { duration: 0.6, stagger: 0.05, after: 0.15 }; // after the logo fades
const MIN_SHUT_MS = 250; // the wall stays shut at least this long, so the logo reads
const IMAGE_WAIT_MS = 700; // the longest it waits for the new page's hero image
const MAX_WAIT_MS = 10000; // opens anyway if the page never arrives

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const calm = useReducedMotion();
  const [isPending, startTransition] = useTransition();
  // idle → cover (panels rising) → shut (navigating) → reveal (lifting) → idle
  const [phase, setPhase] = useState("idle");
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const target = useRef(null); // { href, pathname }
  const shutAt = useRef(0);

  useEffect(() => {
    const onClick = (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link = event.target.closest?.("a[href]");
      if (!link || link.hasAttribute("download")) return;
      if (link.target && link.target !== "_self") return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return; // other sites, tel:, mailto:
      if (/\.[a-z0-9]+$/i.test(url.pathname)) return; // files (sitemap.xml, a PDF)
      // the same page (or a section of it): no wall
      if (url.pathname === window.location.pathname && url.search === window.location.search)
        return;
      // next/link sees this and leaves the navigating to us
      event.preventDefault();
      if (phaseRef.current !== "idle") return;
      target.current = { href: url.pathname + url.search + url.hash, pathname: url.pathname };
      router.prefetch(target.current.href);
      setPhase("cover");
    };
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, [router]);

  // The wall is shut: go to the page.
  const shut = () => {
    shutAt.current = performance.now();
    setPhase("shut");
    startTransition(() => router.push(target.current.href));
  };

  // Open once the new page is in and its hero image is ready.
  useEffect(() => {
    if (phase !== "shut") return;
    let cancelled = false;
    const open = async () => {
      const image = document.querySelector("#hero img");
      await Promise.race([image?.decode?.().catch(() => {}), sleep(IMAGE_WAIT_MS)]);
      const shutFor = performance.now() - shutAt.current;
      if (shutFor < MIN_SHUT_MS) await sleep(MIN_SHUT_MS - shutFor);
      if (!cancelled) setPhase("reveal");
    };
    if (!isPending && pathname === target.current.pathname) {
      open();
      return () => (cancelled = true);
    }
    const giveUp = setTimeout(() => setPhase("reveal"), MAX_WAIT_MS);
    return () => {
      cancelled = true;
      clearTimeout(giveUp);
    };
  }, [phase, isPending, pathname]);

  if (phase === "idle") return null;

  const revealing = phase === "reveal";
  const hidden = calm ? { opacity: 0 } : { y: "100%" };
  const closed = calm ? { opacity: 1 } : { y: "0%" };
  const gone = calm ? { opacity: 0 } : { y: "-100%" };

  return (
    <div aria-hidden="true" className="fixed inset-0 z-[100002] flex overflow-hidden">
      {Array.from({ length: PANELS }, (_, i) => (
        <motion.div
          key={i}
          initial={hidden}
          animate={revealing ? gone : closed}
          transition={
            revealing
              ? { duration: REVEAL.duration, delay: REVEAL.after + i * REVEAL.stagger, ease: EASE }
              : { duration: COVER.duration, delay: i * COVER.stagger, ease: EASE }
          }
          onAnimationComplete={() => {
            if (i !== PANELS - 1) return;
            if (phaseRef.current === "cover") shut();
            else if (phaseRef.current === "reveal") setPhase("idle");
          }}
          // a hair wider than its share, so no seam of page shows between panels
          className={`relative h-full flex-1 ${i < PANELS - 1 ? "-mr-px" : ""} ${
            i % 2 ? "bg-[#161616]" : "bg-[#121212]"
          }`}
        >
          <span className="absolute inset-x-0 top-0 h-[3px] bg-third" />
          <span className="absolute inset-x-0 bottom-0 h-[3px] bg-third" />
          <span className="absolute inset-y-0 right-0 w-px bg-white/[0.06]" />
        </motion.div>
      ))}

      {/* on the shut wall: the blueprint grid, the logo and the laser line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: revealing ? 0 : 1 }}
        transition={
          revealing
            ? { duration: 0.15 }
            : { duration: 0.3, delay: COVER.duration * 0.7 + (PANELS - 1) * COVER.stagger }
        }
        className="pointer-events-none absolute inset-0 grid place-items-center bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:48px_48px] bg-center"
      >
        <div className="flex flex-col items-center">
          <Image src={whiteLogo} alt="" priority className="h-auto w-[180px] 700:w-[220px]" />
          <div className="mt-7 h-px w-[180px] 700:w-[220px] overflow-hidden bg-white/15">
            {/* draws across, then slides off; with reduce motion, pulses */}
            <motion.div
              className="h-full w-full origin-left bg-third"
              initial={calm ? { opacity: 0.3 } : { scaleX: 0, x: "0%" }}
              animate={
                calm
                  ? { opacity: [0.3, 1, 0.3] }
                  : { scaleX: [0, 1, 1], x: ["0%", "0%", "100%"] }
              }
              transition={{ duration: 1.1, ease: "easeInOut", repeat: Infinity }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
