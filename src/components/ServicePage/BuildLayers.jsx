"use client";

import { useEffect, useRef } from "react";
import { clamp } from "@/components/Home/intro/kit";
import { LAYERED, drawLayers, hitLayers, layoutLayers } from "./layers";

const CALM_QUERY = "(prefers-reduced-motion: reduce)";
const STEP = 210; // ms between one stage's layer starting and the next
const BUILD = 620; // ms each layer takes to build
const FOCUS = 160; // ms: how quickly a layer lights when its stage is read

// The Build's drawing (11-21, the user: "like LeTara's Layer by layer
// animated build thing, but with our design", "like you would have it on a
// blueprint", then "not so detailed"): the service taken apart layer by
// layer (layers.js), each stage numbered to match the list beside it.
// Shown as dashed outlines until it's well into view, then built a layer at
// a time (`onBuild(true)` as it starts). Once it's built, the layer of the
// stage pointed at (`active`, ServiceBuild) lifts and goes green while the
// rest fade back. Pointing at a layer or its number lights it for as long
// as it's pointed at (`onHover`); clicking or tapping it goes to its stage
// in the list (`onPick`). With
// Reduce Motion it builds more slowly, without anything dropping in.
// Nothing runs while nothing moves. It fills its box (sized by
// ServiceBuild).
export default function BuildLayers({ slug, active, onHover, onPick, onBuild }) {
  const ref = useRef(null);
  const live = useRef({ active: null, wake: null });
  const model = LAYERED[slug];

  useEffect(() => {
    const canvas = ref.current;
    const state = live.current;
    if (!canvas || !model) return;
    const ctx = canvas.getContext("2d");
    const calm = window.matchMedia(CALM_QUERY).matches;
    const font = getComputedStyle(document.documentElement).getPropertyValue("--font-gt").trim() || "sans-serif";
    const pace = calm ? 1.4 : 1;
    const count = model.stages;
    const on = new Array(count).fill(0);
    let dim = 0;
    let view = null;
    let zoom = 1; // the wide-screen zoom (wide-zoom) the canvas sits in
    let started = null;
    let raf = 0;
    let last = 0;
    let pointed = null; // the stage pointed at on the canvas itself

    const arrivals = (now) =>
      on.map((_, i) => (started === null ? 0 : clamp((now - started - i * STEP * pace) / (BUILD * pace))));

    const tick = (now) => {
      raf = 0;
      const dt = last ? Math.min(64, now - last) : 16;
      last = now;
      const arrive = arrivals(now);
      const built = started !== null && arrive[count - 1] >= 1;
      // nothing's lit until it's all built
      const target = built ? state.active : null;
      const pull = 1 - Math.exp(-dt / FOCUS);
      let moving = started !== null && !built;
      for (let i = 0; i < count; i++) {
        const goal = target === i ? 1 : 0;
        on[i] += (goal - on[i]) * pull;
        if (Math.abs(goal - on[i]) < 0.003) on[i] = goal;
        else moving = true;
      }
      const goal = target === null ? 0 : 1;
      dim += (goal - dim) * pull;
      if (Math.abs(goal - dim) < 0.003) dim = goal;
      else moving = true;
      if (view) drawLayers(ctx, view, { arrive, on, dim, calm, font });
      if (moving) raf = requestAnimationFrame(tick);
      else last = 0;
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    state.wake = wake;

    const resize = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (!width || !height) return;
      zoom = canvas.getBoundingClientRect().width / width || 1;
      const dpr = Math.min(window.devicePixelRatio || 1, 2) * zoom;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      // clear of the sheet's border, and from a 700px window (as BuildSheet
      // shows them) of its key plan and title block across the top; room on
      // the right for the stages' numbers
      const wide = window.matchMedia("(min-width: 700px)").matches;
      const inset = wide ? [74, 84, 14, 14] : [14, 50, 14, 10];
      view = layoutLayers(model, { width, height, dpr, inset, column: width - (wide ? 42 : 28) });
      wake();
    };

    // the stage under a pointer on the canvas
    const pick = (e) => {
      const box = canvas.getBoundingClientRect();
      return hitLayers(view, (e.clientX - box.left) / zoom, (e.clientY - box.top) / zoom);
    };
    const move = (e) => {
      if (e.pointerType !== "mouse" || !view) return;
      const stage = pick(e);
      canvas.style.cursor = stage === null ? "" : "pointer";
      if (stage === pointed) return;
      pointed = stage;
      onHover(stage);
    };
    const leave = (e) => {
      if (e.pointerType !== "mouse") return;
      canvas.style.cursor = "";
      if (pointed === null) return;
      pointed = null;
      onHover(null);
    };
    const click = (e) => {
      if (!view) return;
      const stage = pick(e);
      if (stage !== null) onPick(stage);
    };

    const sizes = new ResizeObserver(resize);
    sizes.observe(canvas);
    const seen = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        seen.disconnect();
        started = performance.now();
        onBuild?.(true);
        wake();
      },
      { rootMargin: "0px 0px -25% 0px" },
    );
    seen.observe(canvas);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerleave", leave);
    canvas.addEventListener("click", click);

    return () => {
      cancelAnimationFrame(raf);
      raf = -1; // nothing more after this
      state.wake = null;
      sizes.disconnect();
      seen.disconnect();
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
      canvas.removeEventListener("click", click);
    };
  }, [model, onHover, onPick, onBuild]);

  useEffect(() => {
    live.current.active = active;
    live.current.wake?.();
  }, [active]);

  if (!model) return null;
  return <canvas ref={ref} role="img" aria-label={model.label} className="relative block h-full w-full" />;
}
