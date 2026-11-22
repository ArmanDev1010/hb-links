"use client";

import { useEffect, useRef } from "react";
import HeroShade from "@/components/Home/HeroShade";
import { reachedByLink } from "@/components/Home/arrival";
import { lerp, span } from "@/components/Home/intro/kit";
import { worker } from "@/components/Home/intro/context";
import { drawChevrons } from "@/components/Home/intro/scene";
import { VIGNETTES, drawVignette, stageFor, turnStage } from "@/components/Home/intro/vignettes";
import { dimension } from "@/components/Home/intro/adu";
import { HERO_VIEWS } from "./heroes";
import { toBuild } from "./heroes/designbuild";

// Each service page's hero build: which drawing (intro/vignettes, by the
// page's slug) and what the canvas says it shows. `crew`: two workers on the job (members at `a`, walking to `b` and back,
// or standing and hammering; `y` the floor they're on), on site through
// `on` of the build, placed where nothing stands between them and the
// camera. `turn`: the camera's walk round it, start to end (degrees; TURN if
// not given). `mask`: the drawing is a close-up of something bigger (a room
// of the remodel's house), so all of it outside its frame fades into the
// dark instead of running under the copy.
export const SERVICE_SCENES = {
  "adu-builder": {
    crew: { on: [0.04, 0.95], members: [{ a: [4, -3], b: [16, -3] }, { a: [32.5, 3.5], b: [32.5, 15] }] },
    label: "A backyard ADU drawn as you scroll, from the layout chalked on the ground to the slab, framing, roof, windows and stucco, then the yard and the lights.",
    notes: {
      dims: [[[0, 0, -12.5], [30, 0, -12.5], "30'-0\""], [[40.5, 0, 0], [40.5, 0, 20], "20'-0\""]],
      north: [-2, -8],
      tag: { at: [22, 15, 10], reach: 72, text: "ADU · 600 SF · 1 BED · 1 BATH" },
    },
  },
  "garage-conversion": {
    crew: { on: [0.16, 0.74], members: [{ a: [4, -3], b: [18, -3] }, { a: [21.6, -2] }] },
    label: "A Spanish-style garage converted as you scroll: the roll-up door goes, the opening is framed in and stuccoed to match, a window and French doors go in, then a paver patio, planters and the lights.",
    turn: [10, -6],
    notes: {
      dims: [[[0, 0, -16], [24, 0, -16], "24'-0\""], [[27.5, 0, 0], [27.5, 0, 22], "22'-0\""]],
      north: [-3, -12],
      tag: { at: [13, 14.45, 11], reach: 72, text: "GARAGE → STUDIO · 528 SF" },
    },
  },
  "home-remodel": {
    crew: { on: [0.14, 0.84], members: [{ a: [6, 8], b: [15, 8], y: 1.5 }, { a: [31, 18], y: 1.5 }] },
    label: "A ranch house remodeled as you scroll: the roof lifted off and the walls opened, new oak floors and paint, a navy kitchen with an island, a bathroom with a freestanding tub, the rooms furnished, then the lights.",
    notes: {
      dims: [[[0, 0, -7], [40, 0, -7], "40'-0\""], [[43, 0, 0], [43, 0, 26], "26'-0\""]],
      north: [-2.5, -4],
      tag: { at: [28, 10, 25.5], reach: 64, text: "WHOLE-HOME REMODEL · 1,040 SF" },
    },
  },
  "kitchen-remodel": {
    crew: { on: [0.12, 0.84], members: [{ a: [12, 3.5], b: [16.5, 3.5], y: 0.5 }, { a: [3.5, 8.5], y: 0.5 }] },
    label: "A kitchen remodeled as you scroll: the old one out, the plumbing and wiring run, oak floors and paint, sage cabinets and a navy island, quartz counters, the range, hood and fridge, subway tile, pendants, then the lights.",
    turn: [-8, 8],
    mask: true,
    notes: {
      dims: [[[0, 0, -1.6], [18, 0, -1.6], "18'-0\""], [[19.6, 0, 0], [19.6, 0, 14], "14'-0\""]],
      tag: { at: [18, 0.5, 0], dir: [1, 1], text: "KITCHEN · 18' × 14'" },
    },
  },
  "bathroom-remodel": {
    crew: { on: [0.12, 0.8], members: [{ a: [6.5, 2.5], b: [10.5, 2.5], y: 0.5 }, { a: [3, 2], y: 0.5 }] },
    label: "A bathroom remodeled as you scroll: the old one out to the studs, the plumbing and wiring run, backer board and a waterproof membrane, tile, shower glass, a floating vanity, the mirror and toilet, then the lights.",
    turn: [-8, 8],
    mask: true,
    notes: {
      dims: [[[0, 0, -1.6], [12, 0, -1.6], "12'-0\""], [[13.6, 0, 0], [13.6, 0, 9], "9'-0\""]],
      tag: { at: [12, 0.5, 0], dir: [1, 1], text: "BATHROOM · 12' × 9'" },
    },
  },
  "home-additions": {
    crew: { on: [0.08, 0.8], members: [{ a: [28, 4.6], b: [38, 4.6] }, { a: [43, 15] }] },
    label: "A bungalow's new wing built as you scroll: the slab, the framing and the beam into the house, the rafters, sheathing, a standing-seam metal roof, cedar siding and a corner window, then the planting and the lights.",
    notes: {
      dims: [[[26, 0, 3.4], [40, 0, 3.4], "14'-0\""], [[45, 0, 8], [45, 0, 24], "16'-0\""]],
      north: [-2.5, -5],
      tag: { at: [33, 11, 16], reach: 80, text: "ADDITION · 224 SF" },
    },
  },
  "deck-and-patio": {
    crew: { on: [0.04, 0.9], members: [{ a: [6, -3], b: [20, -3] }, { a: [30, -6.4] }] },
    label: "A backyard built as you scroll: a deck's footings, posts, beams, joists and decking, a cable rail and steps, a paver patio, a pergola, a fire pit and chairs, string lights, then the lights.",
    notes: {
      dims: [[[4, 0, -5], [22, 0, -5], "18'-0\""], [[24, 0, -6.6], [40, 0, -6.6], "16'-0\""]],
      north: [-2.5, -6],
      tag: { at: [40, 0, -4], dir: [1, 1], reach: 44, text: "DECK 216 SF · PATIO 240 SF" },
    },
  },
  "design-build": {
    crew: { on: [toBuild(0.15), toBuild(0.92)], members: [{ a: [4, -4], b: [17, -4] }, { a: [38, 6], b: [38, 18] }] },
    label: "A modern two-storey home drafted on a blueprint, then built out of it as you scroll: the plan, the front elevation and the title block drawn on the sheet, then the slab, both floors framed, roofs and stucco, solar, the garden and the lights.",
    notes: { tag: { at: [28, 20, 8], reach: 84, text: "NEW HOME · 2 STOREYS" } },
  },
};

const STILL_QUERY = "(max-height: 500px) and (orientation: landscape)";
const CALM_QUERY = "(prefers-reduced-motion: reduce)";
const EASE = 0.12;
const PLAY = 0.9; // how much of the pinned scroll plays the build
const TURN = [-16, 10]; // the camera's walk round it, start to end (degrees)
const LOGO = "/Logos/white_horizontal.png";

// A service page's hero: like the homepage's, pinned for a couple of screens
// of scroll while the service is built on a canvas — here the one service,
// framed big on the right (above the copy on phones), the camera walking
// slowly round it as it goes up, two of the crew at work on it (walking,
// hammering) while their part is going on, and the homepage hero's chevrons
// beside the copy. It opens on the service's dashed outline.
// (11-20: the build timeline under it, "The build", was taken out.) The copy (`children`) sits at the bottom left, as on the
// homepage; the navbar stays clear over the scene until the build is done
// (data-nav-overlay-end, read by Navigation/Navbar.jsx).
export default function ServiceHero({ slug, children }) {
  const trackRef = useRef(null);
  const panelRef = useRef(null);
  const canvasRef = useRef(null);
  const copyRef = useRef(null);
  const scene = SERVICE_SCENES[slug];

  useEffect(() => {
    if (reachedByLink() && !window.location.hash && window.scrollY > 0)
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const still = window.matchMedia(STILL_QUERY);
    const calm = window.matchMedia(CALM_QUERY);
    let stop = null;
    const sync = () => {
      stop?.();
      stop = playBuild({
        slug,
        scene,
        track: trackRef.current,
        panel: panelRef.current,
        canvas: canvasRef.current,
        copy: copyRef.current,
        still: still.matches,
        calm: calm.matches,
      });
    };
    sync();
    still.addEventListener("change", sync);
    calm.addEventListener("change", sync);
    return () => {
      still.removeEventListener("change", sync);
      calm.removeEventListener("change", sync);
      stop?.();
    };
  }, [slug, scene]);

  return (
    <section
      ref={trackRef}
      id="hero"
      data-nav-overlay
      className="relative h-[calc(300*var(--vh))] max-700:h-[calc(260*var(--vh))] intro-still:h-auto bg-black text-white"
    >
      <div
        ref={panelRef}
        className="sticky top-0 h-dvh overflow-hidden flex items-end pt-28 sm:pt-22 intro-still:static intro-still:h-auto intro-still:block intro-still:pt-0"
      >
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={scene.label}
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

// Plays the build for how far the hero has been scrolled through (or, when
// `still`, shows it finished). Returns a function that stops it.
function playBuild({ slug, scene, track, panel, canvas, copy, still, calm }) {
  const { mask } = scene;
  const turn = scene.turn ?? TURN;
  const ctx = canvas.getContext("2d");
  const view = HERO_VIEWS[slug] ?? VIGNETTES[slug];
  const gt = getComputedStyle(document.documentElement).getPropertyValue("--font-gt").trim() || "sans-serif";
  const logo = new Image();
  const assets = { logo, gt };
  const abort = new AbortController();

  let stopped = false;
  let stage = null;
  let target = still ? 1 : 0;
  let shown = target;
  let raf = 0;
  let last = 0;
  // the crew moves on its own while the hero's on screen (not with Reduce
  // Motion, nor as a still)
  const life = !calm && !still;
  let inView = true;

  const draw = (now = performance.now()) => {
    if (!stage) return;
    const k = shown * view.end;
    turnStage(stage, calm || still ? 0 : lerp(turn[0], turn[1], shown));
    drawVignette(ctx, stage, k, assets);
    drawCrew(stage, scene.crew, k / view.end, now / 1000, life);
    drawNotes(stage, scene.notes, gt);
    // close-ups fade just outside their frame; the rest only far out, so
    // the lawn doesn't run on under the copy
    fadeOutside(ctx, stage, mask ? [1.2, 0.7] : [1.55, 0.62]);
    drawTag(stage, scene.notes?.tag, k / view.end, gt);
    // the homepage hero's chevrons, beside and above the copy, under the
    // drawing (where the fade has left the canvas clear)
    if (stage.width >= 1080) {
      ctx.save();
      ctx.globalCompositeOperation = "destination-over";
      drawChevrons(ctx, stage.dpr, stage.width, stage.height);
      ctx.restore();
    }
    canvas.dataset.drawn = "1";
  };

  // The drawing's frame on the canvas: the right side on a wide screen, the
  // space over the copy on a narrow one (fractions of the canvas).
  const frame = (width, height) => {
    const box = canvas.getBoundingClientRect();
    if (still) return width > height ? [0.42, 0.08, 0.96, 0.92] : [0.06, 0.1, 0.94, 0.9];
    if (width >= 1080) {
      // clear of the copy's text (a long title reaches past the middle on a
      // narrower desktop); where that leaves little room, out to the edge
      const left = Math.max(0.46, (textRight(copy) - box.left + 24) / width);
      return left > 0.6 ? [left, 0.16, 0.99, 0.94] : [left, 0.2, 0.97, 0.92];
    }
    const copyTop = (copy.getBoundingClientRect().top - box.top) / height;
    return [0.05, 0.2, 0.95, Math.max(0.42, copyTop - 0.03)];
  };

  const resize = () => {
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const box = frame(width, height);
    stage = stageFor(view, { width, height, dpr }, box);
    stage.ctx = ctx;
    stage.box = [box[0] * width, box[1] * height, box[2] * width, box[3] * height];
    stage.turn = null; // drawn again at the current angle
    draw();
  };

  const measure = () => {
    const distance = track.offsetHeight - panel.offsetHeight;
    const into = -track.getBoundingClientRect().top;
    const progress = distance > 0 ? Math.min(1, Math.max(0, into / distance)) : 0;
    target = Math.min(1, progress / PLAY);
    track.dataset.navOverlayEnd = String(Math.round(distance * PLAY));
  };

  const tick = (now) => {
    const seconds = Math.min(Math.max(0, (now - last) / 1000), 0.1);
    last = now;
    shown += (target - shown) * (calm ? 1 : 1 - Math.exp(-seconds / EASE));
    if (Math.abs(target - shown) < 0.0005) shown = target;
    draw(now);
    raf =
      shown !== target || (life && inView && !document.hidden)
        ? requestAnimationFrame(tick)
        : 0;
  };
  const play = () => {
    if (raf || stopped) return;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  };

  const sizes = new ResizeObserver(resize);
  sizes.observe(canvas);
  sizes.observe(copy);
  const seen = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    play();
  });
  seen.observe(track);
  document.addEventListener("visibilitychange", play, { signal: abort.signal });
  logo.onload = () => !stopped && draw();
  logo.src = LOGO;
  // (its frame again too: the copy's text is measured for it)
  document.fonts?.ready.then(() => !stopped && resize());

  if (!still) {
    measure();
    shown = target;
    window.addEventListener(
      "scroll",
      () => {
        measure();
        play();
      },
      { passive: true, signal: abort.signal },
    );
  }

  return () => {
    stopped = true;
    abort.abort();
    cancelAnimationFrame(raf);
    sizes.disconnect();
    seen.disconnect();
    logo.onload = null;
    delete track.dataset.navOverlayEnd;
  };
}

// The crew on the job while its part of the build is going on (`p`, 0-1 of
// the build): each member walks between `a` and `b` (3.2 ft a second), or
// stands at `a` swinging a hammer — held still when nothing moves on its own
// (`life` off).
function drawCrew(stage, crew, p, time, life) {
  if (!crew) return;
  const [p0, p1] = crew.on;
  const a = Math.min(span(p, p0, p0 + 0.03), 1 - span(p, p1 - 0.03, p1));
  if (a <= 0) return;
  const G = { ctx: stage.ctx, P: stage.P, s: stage.s, lw: stage.lw };
  const t = life ? time : 0;
  crew.members.forEach((m, j) => {
    const y = m.y ?? 0;
    if (!m.b) {
      worker(G, [m.a[0], y, m.a[1]], 0, a, t + j * 1.3, true);
      return;
    }
    const len = Math.hypot(m.b[0] - m.a[0], m.b[1] - m.a[1]);
    const u = ((t * 3.2) / len + j * 0.37) % 2;
    const f = u < 1 ? u : 2 - u;
    worker(G, [lerp(m.a[0], m.b[0], f), y, lerp(m.a[1], m.b[1], f)], t * 7 + j, a, t, false);
  });
}

// Fades what's drawn outside the drawing's frame (`stage.box`, px) to
// nothing, softly — an ellipse `grow` times the frame, solid to `solid`
// of the way out — so the section's own black shows there.
function fadeOutside(ctx, { box: [x0, y0, x1, y1], dpr, width, height }, [grow, solid]) {
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const rx = ((x1 - x0) / 2) * grow;
  const ry = ((y1 - y0) / 2) * grow;
  ctx.save();
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.globalCompositeOperation = "destination-in";
  ctx.translate(cx, cy);
  ctx.scale(1, ry / rx);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
  g.addColorStop(0, "rgba(0,0,0,1)");
  g.addColorStop(solid, "rgba(0,0,0,1)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  // the whole canvas, in these units
  const reach = (Math.max(width, height) * 2 * rx) / Math.min(rx, ry);
  ctx.fillRect(-reach, -reach, reach * 2, reach * 2);
  ctx.restore();
}

// The drawing's notes, as on an architect's sheet (11-21, the user: the
// hero's right side looked empty): the project's dimensions laid out round
// it on the ground and a north arrow (the tag naming it: drawTag).
function drawNotes(stage, notes, gt) {
  if (!notes) return;
  const { ctx, P, s } = stage;
  for (const [a, b, label] of notes.dims ?? []) dimension(ctx, P, a, b, label, 0.75, s, gt);
  if (notes.north) {
    const [x, z] = notes.north;
    const [x0, y0] = P(x, 0.02, z);
    const [x1, y1] = P(x, 0.02, z + 4);
    const angle = Math.atan2(y1 - y0, x1 - x0);
    ctx.save();
    ctx.strokeStyle = "rgba(244,242,236,0.6)";
    ctx.fillStyle = "rgba(244,242,236,0.75)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - 7 * Math.cos(angle - 0.4), y1 - 7 * Math.sin(angle - 0.4));
    ctx.lineTo(x1 - 7 * Math.cos(angle + 0.4), y1 - 7 * Math.sin(angle + 0.4));
    ctx.closePath();
    ctx.fill();
    ctx.font = `600 11px ${gt}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("N", x1 + 9 * Math.cos(angle), y1 + 9 * Math.sin(angle));
    ctx.restore();
  }
}

// The tag naming what was built, once it's built: on a leader from its
// point (`dir`, up and right unless the scene says otherwise, `reach` px
// out), drawn over the edge fade so it's always crisp, and kept inside the
// canvas: slid back towards its point, and if that's not enough, its box
// set on the leader's other side.
function drawTag(stage, tag, p, gt) {
  const a = span(p, 0.9, 0.98);
  if (!tag || a <= 0) return;
  const { ctx, P, width, box } = stage;
  const [dx, dy] = tag.dir ?? [1, -1];
  const [ax, ay] = P(...tag.at);
  ctx.save();
  ctx.font = `600 12px ${gt}`;
  if ("letterSpacing" in ctx) ctx.letterSpacing = "1.6px";
  const w = ctx.measureText(tag.text).width + 20;
  const reach = tag.reach ?? 40;
  let ex = ax + reach * dx;
  const ey = Math.min(Math.max(ay + reach * dy, box[1] + 14), box[3] - 14);
  let bx = dx > 0 ? ex + 14 : ex - 14 - w;
  if (bx + w > width - 12) {
    const back = Math.min(bx + w - (width - 12), Math.max(0, ex - ax));
    ex -= back;
    bx -= back;
    if (bx + w > width - 12) bx = ex - 14 - w;
  } else if (bx < 12) {
    const back = Math.min(12 - bx, Math.max(0, ax - ex));
    ex += back;
    bx += back;
    if (bx < 12) bx = ex + 14;
  }
  // a narrow screen: the box held on it whatever, the leader then meeting
  // its edge nearest the point
  bx = Math.max(12, Math.min(bx, width - 12 - w));
  const over = ex >= bx && ex <= bx + w;
  ctx.globalAlpha = a;
  ctx.strokeStyle = "rgba(196,229,56,0.9)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  if (over) ctx.lineTo(ex, ey + (ay > ey ? 14 : -14));
  else {
    ctx.lineTo(ex, ey);
    ctx.lineTo(bx > ex ? bx : bx + w, ey);
  }
  ctx.stroke();
  ctx.fillStyle = "rgba(196,229,56,1)";
  ctx.beginPath();
  ctx.arc(ax, ay, 2.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(11,15,13,0.85)";
  ctx.fillRect(bx, ey - 14, w, 28);
  ctx.strokeRect(bx + 0.5, ey - 13.5, w - 1, 27);
  ctx.fillStyle = "rgba(196,229,56,1)";
  ctx.textBaseline = "middle";
  ctx.fillText(tag.text, bx + 10, ey + 0.5);
  ctx.restore();
}

// How far right the text in `el` reaches (px, in the window): its lines,
// not its boxes.
function textRight(el) {
  const range = document.createRange();
  const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let right = 0;
  for (let node = walk.nextNode(); node; node = walk.nextNode()) {
    if (!node.textContent.trim()) continue;
    range.selectNodeContents(node);
    for (const rect of range.getClientRects()) if (rect.width > 0) right = Math.max(right, rect.right);
  }
  return right;
}
