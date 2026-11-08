"use client";

import { useEffect, useRef } from "react";
import HeroShade from "@/components/Home/HeroShade";
import { reachedByLink } from "@/components/Home/arrival";
import { drawScene } from "@/components/Home/intro/scene";
import { drawLife } from "@/components/Home/intro/context";

// The same query as the `intro-still` variant in globals.css: phones held
// sideways (too short to pin a hero) get the opening frame, the property with
// its services outlined, as a still, with the copy below it.
const STILL_QUERY = "(max-height: 500px) and (orientation: landscape)";

// "Reduce motion" still gets the builds — they only move as the visitor
// scrolls — but calmer: the camera holds its angle (no swing or tilt), the
// scene follows the scroll exactly instead of gliding after it, and nothing
// moves on its own (no cars, crew or drifting dust).
const CALM_QUERY = "(prefers-reduced-motion: reduce)";

// Seconds the drawn scene takes to catch up with the scroll position, so
// mouse-wheel steps play as motion instead of jumps.
const EASE = 0.12;

// The most canvas pixels (device px) the scene draws per frame: a bigger
// screen draws at a lower density rather than a slower frame rate.
const PIXEL_BUDGET = 4_200_000;

// How much of the pinned scroll plays the scene; the rest holds the finished
// property before the hero scrolls away.
const PLAY = 0.92;

// The white HB Links logo, for the yard sign in the scene.
const LOGO = "/Logos/white_horizontal.png";

// The homepage hero: pinned for several screens of scroll over one property
// where four services are built one after another (intro/scene.js), drawn on
// a canvas — it opens with them outlined and locked, and each is built and
// unlocked as the visitor scrolls. The copy (`children`) sits at the bottom
// left; the scene keeps clear of it, and names each service in the space
// over it. While it's on screen, cars, the crew and dust move about the scene
// on their own (intro/context.js drawLife). The navbar stays clear over the
// scene until it ends (data-nav-overlay-end, read by Navigation/Navbar.jsx).
export default function HeroIntro({ children }) {
  const trackRef = useRef(null);
  const panelRef = useRef(null);
  const canvasRef = useRef(null);
  const copyRef = useRef(null);
  const arrivalRef = useRef(null);

  useEffect(() => {
    // Reached by a link: start at the very top, so the scene opens on its
    // first frame. Next.js resets the scroll itself; this backs it up.
    // Back/Forward and links to a section (#…) keep their own position.
    // Asked once per hero — React runs this twice in development.
    if (!arrivalRef.current) {
      arrivalRef.current = { arrived: reachedByLink() && !window.location.hash };
      if (arrivalRef.current.arrived && window.scrollY > 0)
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
    let { arrived } = arrivalRef.current;

    const still = window.matchMedia(STILL_QUERY);
    const calm = window.matchMedia(CALM_QUERY);
    let stop = null;
    const sync = () => {
      stop?.();
      stop = playScene({
        track: trackRef.current,
        panel: panelRef.current,
        canvas: canvasRef.current,
        copy: copyRef.current,
        still: still.matches,
        calm: calm.matches,
        arrived,
      });
      arrived = false;
    };
    sync();
    still.addEventListener("change", sync);
    calm.addEventListener("change", sync);
    return () => {
      still.removeEventListener("change", sync);
      calm.removeEventListener("change", sync);
      stop?.();
    };
  }, []);

  return (
    <section
      ref={trackRef}
      id="hero"
      data-nav-overlay
      className="relative h-[calc(700*var(--vh))] max-700:h-[calc(620*var(--vh))] intro-still:h-auto bg-[#090b0a] text-neutral-50"
    >
      <div
        ref={panelRef}
        className="sticky top-0 h-dvh overflow-hidden flex items-end pt-28 sm:pt-22 intro-still:static intro-still:h-auto intro-still:block intro-still:pt-0"
      >
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="An HB Links property at dusk, drawn as you scroll, with four services outlined and locked: one by one they're built and unlocked. First an ADU in the back corner of the lot, starting from the HB Links logo chalked on the ground; then a home remodel, the roof lifted off while the kitchen and bathroom are redone; then a home addition goes up on its side; then a deck and patio with a fire pit and string lights, until the lights come on."
          className="absolute inset-0 h-full w-full intro-still:relative intro-still:h-[calc(100*var(--vh))]"
        />
        <div className="intro-still:hidden">
          <HeroShade />
        </div>
        <div
          ref={copyRef}
          className="wide-zoom relative z-20 900:pb-16 pb-20 mx-auto w-full 700:px-[32px] px-[24px] intro-still:pt-10"
        >
          {children}
        </div>
      </div>
    </section>
  );
}

// Draws the scene for how far the hero has been scrolled through (or, when
// `still`, its opening frame once). The scene is drawn on a canvas of its own
// when the scroll moves it; each frame lays that on the screen and draws what
// moves on its own over it. Returns a function that stops it.
function playScene({ track, panel, canvas, copy, still, calm, arrived }) {
  const context = canvas.getContext("2d");
  const base = document.createElement("canvas");
  const baseContext = base.getContext("2d");
  const life = !still && !calm;
  const abort = new AbortController();
  // the site's display face (globals.css), for the service names
  const gt = getComputedStyle(document.documentElement).getPropertyValue("--font-gt").trim();
  const fonts = { gt: gt || "sans-serif" };
  const logo = new Image();

  let stopped = false;
  let size = null; // { width, height, dpr, portrait, layout }
  let drawn = "";
  let target = 0; // scroll progress through the scene, 0-1
  let shown = 0; // the progress drawn, easing toward `target`
  let raf = 0;
  let lastTick = 0;
  let frame = null; // what the scene was drawn with, for drawLife
  let inView = true;

  const draw = (t, now = performance.now()) => {
    if (!size) return;
    const { copyTop, copyLeft, copyRight } = size.layout;
    const key = [t.toFixed(4), size.width, size.height, size.dpr, copyTop, copyLeft, copyRight, logo.complete].join(":");
    if (key !== drawn) {
      drawn = key;
      frame = drawScene(baseContext, { ...size, t, calm, fonts, logo, life });
    } else if (!life) return;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.drawImage(base, 0, 0);
    if (life) {
      context.setTransform(size.dpr, 0, 0, size.dpr, 0, 0);
      drawLife(context, frame, now / 1000);
    }
    // the page transition waits for this before it opens (UI/PageTransition)
    canvas.dataset.drawn = "1";
  };

  // No more canvas pixels than the screen has (within PIXEL_BUDGET); the
  // scene is laid out for the canvas's shape and around the copy.
  const resize = () => {
    const { clientWidth: width, clientHeight: height } = canvas;
    if (!width || !height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(PIXEL_BUDGET / (width * height)));
    canvas.width = base.width = Math.round(width * dpr);
    canvas.height = base.height = Math.round(height * dpr);
    size = { width, height, dpr, portrait: height > width, layout: sceneLayout({ canvas, copy, height, width, still }) };
    drawn = "";
    if (!still) measure();
    draw(still ? 0 : shown);
  };
  const resizeObserver = new ResizeObserver(resize);
  // redraw once the face and the logo have loaded
  document.fonts?.ready.then(() => !stopped && resize());
  logo.onload = () => !stopped && resize();
  logo.src = LOGO;

  if (still) {
    resizeObserver.observe(canvas);
    return () => {
      stopped = true;
      resizeObserver.disconnect();
    };
  }

  // Reached by a link, the hero opens at the start of the scene: until the
  // visitor first touches, scrolls or presses a key, wherever the browser
  // leaves the page counts as the start (`lead`, px into the hero). iOS
  // Safari, its toolbar collapsed by scrolling the last page, can land a new
  // one a little way down.
  let lead = 0;
  let leading = arrived;
  if (leading) {
    const done = () => (leading = false);
    for (const type of ["touchstart", "wheel", "keydown", "pointerdown"])
      window.addEventListener(type, done, { once: true, passive: true, signal: abort.signal });
  }

  const measure = () => {
    const distance = track.offsetHeight - panel.offsetHeight;
    const into = -track.getBoundingClientRect().top;
    // (more than a little way down is a real scroll position, not a landing)
    if (leading) lead = into > 0 && into < distance / 4 ? into : 0;
    else if (into <= 0) lead = 0;
    const run = distance - lead;
    const progress = run > 0 ? Math.min(1, Math.max(0, (into - lead) / run)) : 0;
    target = Math.min(1, progress / PLAY);
    // the navbar turns solid once the scene has played (Navigation/Navbar.jsx)
    track.dataset.navOverlayEnd = String(Math.round(lead + run * PLAY));
  };

  const tick = (now) => {
    // rAF's timestamp can be a little older than the performance.now() that
    // started the loop, so never step backwards.
    const seconds = Math.min(Math.max(0, (now - lastTick) / 1000), 0.1);
    lastTick = now;
    shown += (target - shown) * (calm ? 1 : 1 - Math.exp(-seconds / EASE));
    if (Math.abs(target - shown) < 0.0005) shown = target;
    draw(shown, now);
    // (what moves on its own keeps the loop going while the hero's in view)
    raf = shown !== target || (life && inView && !document.hidden) ? requestAnimationFrame(tick) : 0;
  };
  const play = () => {
    if (raf || stopped) return;
    lastTick = performance.now();
    raf = requestAnimationFrame(tick);
  };

  let scrolled = false;
  const onScroll = () => {
    scrolled = true;
    measure();
    play();
  };

  measure();
  shown = target;
  resizeObserver.observe(canvas);
  resizeObserver.observe(copy);
  const viewObserver = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    play();
  });
  viewObserver.observe(track);
  document.addEventListener("visibilitychange", play, { signal: abort.signal });
  // For the first second, re-read the scroll every frame and jump straight to
  // it, in case the browser resets it for a new page without a scroll event
  // reaching us.
  const settleUntil = performance.now() + 1000;
  let watching = requestAnimationFrame(function watch(now) {
    if (stopped) return;
    measure();
    if (!scrolled) shown = target;
    draw(shown);
    watching = now < settleUntil ? requestAnimationFrame(watch) : 0;
  });
  window.addEventListener("scroll", onScroll, { passive: true, signal: abort.signal });

  return () => {
    stopped = true;
    abort.abort();
    cancelAnimationFrame(raf);
    cancelAnimationFrame(watching);
    resizeObserver.disconnect();
    viewObserver.disconnect();
    delete track.dataset.navOverlayEnd;
  };
}

// Where the copy is, as fractions of the screen: `copyTop` (where it starts),
// `copyLeft` and `copyRight` (where its text starts and how far right it
// reaches, line by line — the scene goes beside it where there's room, and
// names the service over it). The still (a phone held sideways, the copy
// below it) has the screen to itself.
function sceneLayout({ canvas, copy, width, height, still }) {
  if (still) return { copyTop: 1, copyLeft: 0, copyRight: 0 };
  const box = canvas.getBoundingClientRect();
  const text = textBounds(copy);
  return {
    copyTop: (copy.getBoundingClientRect().top - box.top) / height,
    copyLeft: (text.left - box.left) / width,
    copyRight: (text.right - box.left) / width,
  };
}

// The left and right edges of an element's text, line by line (its blocks
// run wider than their lines do).
function textBounds(element) {
  const range = document.createRange();
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let left = Infinity;
  let right = 0;
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.textContent.trim()) continue;
    range.selectNodeContents(node);
    const rect = range.getBoundingClientRect();
    left = Math.min(left, rect.left);
    right = Math.max(right, rect.right);
  }
  return { left: Number.isFinite(left) ? left : 0, right };
}
