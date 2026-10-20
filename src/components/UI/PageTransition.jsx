"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

import { privacyPages } from "@/data/privacy";
import whiteLogo from "@/../public/Logos/white_horizontal.png";

// Between pages, a wall goes up: PANELS dark panels, each edged in green,
// rise from the bottom in a wave from left to right and close the screen. On
// it a faint blueprint grid and the logo, with a green "laser level" line
// sweeping under it while the next page loads. Once that page is in (its
// hero image painted), the logo fades and the panels lift off the top in the
// same wave, uncovering it.
//
// The site opens on the same wall, already shut: it's in the page's HTML, so
// the first thing a visitor sees is the logo, and it lifts once the page is
// ready (see INTRO). Without JavaScript it isn't shown at all (the
// <noscript> rule in app/layout.js), and if the page's script never runs it
// fades by itself after a few seconds (.intro-wall, globals.css).
//
// It takes over clicks on links to other pages of the site (any <a>, so
// next/link everywhere): covers first, then navigates. New tabs, other
// sites, files, links within the page, Back/Forward, and links from one
// legal page to another (they share a switcher; the change is quiet) are
// left alone. A link to one of the homepage's sections (/#services) that
// this page also has scrolls to this page's own instead: "Services" on an
// area page stays on that page. With "reduce motion" on, the panels fade in
// and out in the same wave instead of sliding.
const PANELS = 5;
const EASE = [0.76, 0, 0.24, 1];
const COVER = { duration: 0.45, stagger: 0.04 };
const REVEAL = { duration: 0.6, stagger: 0.05, after: 0.15 }; // after the logo fades
const MIN_SHUT_MS = 250; // the wall stays shut at least this long, so the logo reads
const IMAGE_WAIT_MS = 700; // the longest it waits for the new page's hero image
const MAX_WAIT_MS = 10000; // opens anyway if the page never arrives
// The opening wall lifts once the page's script is running and its hero
// image is ready (waiting no more than `imageWaitMs` for it), and not before
// `minMs` after the page started loading, so the logo reads.
const INTRO = { minMs: 800, imageWaitMs: 1500 };

const LEGAL_PATHS = new Set(privacyPages.map(({ slug }) => `/${slug}`));

// Shut, the same with or without "reduce motion", so the opening wall the
// server draws is the one the browser takes over.
const SHUT = { y: "0%", opacity: 1 };

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Resolves once the page's hero image is decoded, or after `wait` ms.
async function heroReady(wait) {
  const image = document.querySelector("#hero img");
  await Promise.race([image?.decode?.().catch(() => {}), sleep(wait)]);
}

export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const calm = useReducedMotion();
  const [isPending, startTransition] = useTransition();
  // intro (shut, on first load) → reveal → idle;
  // idle → cover (panels rising) → shut (navigating) → reveal (lifting) → idle
  const [phase, setPhase] = useState("intro");
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
      // one of the homepage's sections that this page has too: go to this
      // page's own (once a menu the link was in has closed)
      if (url.pathname === "/" && url.hash) {
        const section = document.getElementById(decodeURIComponent(url.hash.slice(1)));
        if (section) {
          event.preventDefault();
          requestAnimationFrame(() => section.scrollIntoView({ block: "start" }));
          return;
        }
      }
      // from one legal page to another: next/link, no wall
      if (LEGAL_PATHS.has(url.pathname) && LEGAL_PATHS.has(window.location.pathname))
        return;
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

  // The site opened on the wall: lift it once the page is ready.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await heroReady(INTRO.imageWaitMs);
      const early = INTRO.minMs - performance.now();
      if (early > 0) await sleep(early);
      if (!cancelled) setPhase((current) => (current === "intro" ? "reveal" : current));
    })();
    return () => (cancelled = true);
  }, []);

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
      await heroReady(IMAGE_WAIT_MS);
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

  const intro = phase === "intro";
  const revealing = phase === "reveal";
  const hidden = calm ? { opacity: 0 } : { y: "100%" };
  const closed = calm ? { opacity: 1 } : { y: "0%" };
  const gone = calm ? { opacity: 0 } : { y: "-100%" };

  return (
    <div
      aria-hidden="true"
      data-intro={intro ? "" : undefined}
      className="intro-wall fixed inset-0 z-[100002] flex overflow-hidden"
    >
      {Array.from({ length: PANELS }, (_, i) => (
        <motion.div
          key={i}
          initial={intro ? SHUT : hidden}
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
        initial={intro ? false : { opacity: 0 }}
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
            {/* draws across, then slides off; with reduce motion, pulses
                (.laser-line, globals.css — CSS, so it already runs on the
                opening wall before the page's script does) */}
            <div className="laser-line h-full w-full bg-third" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
