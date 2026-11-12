"use client";

import { useEffect, useRef } from "react";
import { clamp, ease, lerp } from "@/components/Home/intro/kit";
import { VIGNETTES, drawVignette, stageFor, turnStage } from "@/components/Home/intro/vignettes";

// The white HB Links logo, for the ADU's yard sign (as in the hero).
const LOGO = "/Logos/white_horizontal.png";

// Where the service is framed on its card (fractions of the card, left,
// top, right, bottom), keeping clear of the card's text along the bottom:
// the big card's text runs longer.
const FRAMES = {
  lead: [0.08, 0.09, 0.92, 0.6],
  card: [0.12, 0.1, 0.88, 0.54],
};

// The walk-round while the card is pointed at: how far the camera turns
// (degrees) and how quickly it gets there and back (its time constant, ms).
const TURN = 22;
const TURN_PACE = 700;
// The replay: back to the service's `replay` point quickly, then built
// again.
const REWIND = 450;
const REBUILD = 2300;
// Leaving mid-replay finishes the build this quickly.
const FINISH = 600;

const easeIn = (t) => t * t;

// A service drawn on a canvas filling its card (intro/vignettes): its
// dashed outline until the card is well into view, then built over a few
// seconds, `delay` after it gets there.
//
// Once it's built, pointing at the card (or tabbing to its link) plays a
// little timelapse: the build runs back to an early stage and goes up
// again while the camera walks round it; leaving lets the build finish
// quickly and the camera swing back. With Reduce Motion the camera stays
// put and the builds run a little slower. Nothing runs while nothing
// moves.
export default function ServiceDrawing({ slug, frame = "card", delay = 0 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const view = VIGNETTES[slug];
    if (!canvas || !view) return;
    const ctx = canvas.getContext("2d");
    const card = canvas.closest("a") ?? canvas;
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = matchMedia("(hover: hover)").matches;
    const slow = calm ? 1.4 : 1;
    const gt = getComputedStyle(document.documentElement).getPropertyValue("--font-gt").trim() || "sans-serif";
    const logo = new Image();
    const assets = { logo, gt };

    let stage = null;
    let k = 0;
    let turn = 0;
    let on = false; // pointed at or focused
    let built = false; // the first build is done
    // the build's current move: from `from` to `to` over `ms` from `at`,
    // then `next`
    let move = null;
    let raf = 0;
    let last = 0;

    const draw = () => {
      if (!stage) return;
      turnStage(stage, turn);
      drawVignette(ctx, stage, k, assets);
    };

    const frameTick = (now) => {
      raf = 0;
      const dt = last ? now - last : 16;
      last = now;
      let moving = false;

      if (move && now >= move.at) {
        const t = clamp((now - move.at) / move.ms);
        k = lerp(move.from, move.to, move.curve(t));
        if (t >= 1) {
          move = move.next ? { ...move.next, from: k, at: now } : null;
          if (!move) built = true;
        }
      }
      if (move) moving = true;

      const goal = on && !calm ? TURN : 0;
      turn += (goal - turn) * (1 - Math.exp(-dt / TURN_PACE));
      if (Math.abs(goal - turn) < 0.05) turn = goal;
      else moving = true;

      draw();
      if (moving) raf = requestAnimationFrame(frameTick);
      else last = 0;
    };
    const run = () => {
      if (!raf) raf = requestAnimationFrame(frameTick);
    };

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if (!width || !height) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      stage = stageFor(slug, { width, height, dpr }, FRAMES[frame]);
      draw();
    };

    const enter = () => {
      if (!built || on) return;
      on = true;
      move = {
        from: k,
        to: view.replay,
        ms: REWIND,
        curve: easeIn,
        at: performance.now(),
        next: { to: view.end, ms: REBUILD * slow, curve: ease },
      };
      run();
    };
    const leave = () => {
      if (!on) return;
      on = false;
      if (move) move = { from: k, to: view.end, ms: FINISH, curve: ease, at: performance.now() };
      run();
    };

    const sizes = new ResizeObserver(resize);
    sizes.observe(canvas);
    const seen = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        seen.disconnect();
        move = { from: 0, to: view.end, ms: view.seconds * slow * 1000, curve: ease, at: performance.now() + delay * 1000 };
        run();
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    seen.observe(canvas);
    if (pointer) {
      card.addEventListener("pointerenter", enter);
      card.addEventListener("pointerleave", leave);
    }
    card.addEventListener("focus", enter);
    card.addEventListener("blur", leave);
    logo.onload = draw;
    logo.src = LOGO;
    document.fonts?.ready.then(draw);

    return () => {
      cancelAnimationFrame(raf);
      sizes.disconnect();
      seen.disconnect();
      card.removeEventListener("pointerenter", enter);
      card.removeEventListener("pointerleave", leave);
      card.removeEventListener("focus", enter);
      card.removeEventListener("blur", leave);
      logo.onload = null;
    };
  }, [slug, frame, delay]);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
