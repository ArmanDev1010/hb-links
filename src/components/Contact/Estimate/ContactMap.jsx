"use client";

import { useEffect, useRef } from "react";
import { drawCoverageMap, drawMapLife } from "@/components/Home/intro/map";
import { COVERAGE_CITIES as CITIES, PAGED_CITIES as PAGED } from "@/data/coverage";

// on a phone's closer view, which side two names go so they don't collide
const NARROW_SIDE = { Calabasas: false, "Canoga Park": true };

// `at`: where Woodland Hills sits, as fractions of the map (from 1080px
// clear of the form on the left); `span`: how many feet of the Valley the
// map's width takes.
const MAP_VIEWS = {
  wide: { at: [0.68, 0.44], span: 150000, cities: CITIES },
  narrow: {
    at: [0.46, 0.33],
    span: 90000,
    cities: CITIES.filter((c) => PAGED.includes(c.name)).map((c) => ({ ...c, left: NARROW_SIDE[c.name] ?? c.left })),
  },
};

// The /contact page's map (EstimatePage): the San Fernando Valley drawn as
// the area pages' heroes open on it (Home/intro/map.js) — the hills, the
// freeways, the boulevards — with no pin of ours and no distances (11-20,
// the user): the cities we work in marked, a ring sweeping out from Woodland
// Hills over them every few seconds and the traffic running on the
// freeways. `view`: "wide" (from 1080px) or "narrow" (a phone's).
//
// The map itself is drawn once for each size, on a canvas of its own; each
// frame only copies it and draws the sweep and the traffic over it, and only
// while it's on screen. With Reduce Motion the traffic runs at a third of
// the pace (calmer, not stopped: the user's iPhone has it on); the sweep
// keeps its pace, the same on a phone as on a desktop (11-22, the user).
export default function ContactMap({ view = "wide", className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const base = document.createElement("canvas");
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gt = getComputedStyle(document.documentElement).getPropertyValue("--font-gt").trim() || "sans-serif";
    const settings = MAP_VIEWS[view];
    let frame = null;
    let raf = 0;
    let visible = false;
    let dpr = 1;
    const start = performance.now();

    const paint = (now) => {
      if (!frame) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(base, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const t = (now - start) / 1000;
      drawMapLife(ctx, frame, calm ? t * 0.33 : t, t);
    };
    const loop = (now) => {
      raf = 0;
      paint(now);
      if (visible && !document.hidden) raf = requestAnimationFrame(loop);
    };
    const run = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(loop);
    };

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if (!width || !height) return;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = base.width = Math.round(width * dpr);
      canvas.height = base.height = Math.round(height * dpr);
      frame = drawCoverageMap(base.getContext("2d"), { width, height, dpr, gt, calm, ...settings });
      paint(performance.now());
      run();
    };

    const sizes = new ResizeObserver(resize);
    sizes.observe(canvas);
    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      run();
    });
    seen.observe(canvas);
    const wake = () => run();
    document.addEventListener("visibilitychange", wake);
    document.fonts?.ready.then(resize);

    return () => {
      cancelAnimationFrame(raf);
      sizes.disconnect();
      seen.disconnect();
      document.removeEventListener("visibilitychange", wake);
    };
  }, [view]);

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label="A map of the San Fernando Valley marking the cities we work in — Woodland Hills, Calabasas, Canoga Park, Tarzana, Reseda, Encino, Northridge, Sherman Oaks and more."
      className={`block h-full w-full ${className}`}
    />
  );
}
