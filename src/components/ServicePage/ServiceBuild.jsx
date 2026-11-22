"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  TbBath,
  TbBolt,
  TbBuildingCottage,
  TbBuildingPavilion,
  TbBulb,
  TbDroplet,
  TbFileCertificate,
  TbFrame,
  TbHammer,
  TbHome,
  TbKey,
  TbLayoutGrid,
  TbLayoutRows,
  TbPaint,
  TbPencil,
  TbRulerMeasure,
  TbShovel,
  TbStack2,
  TbToolsKitchen2,
  TbWindow,
} from "react-icons/tb";
import Reveal from "@/components/UI/Reveal";
import { Bars, Edge, Grid } from "@/components/UI/Deco";
import { SECTION_TITLE, keepTogether } from "@/components/UI/titles";
import BuildLayers from "./BuildLayers";
import BuildSheet from "./BuildSheet";
import { LAYERED } from "./layers";

// Each stage's icon, by the `icon` key in a page's `build` data.
const ICONS = {
  measure: TbRulerMeasure,
  foundation: TbShovel,
  frame: TbFrame,
  roof: TbBuildingCottage,
  window: TbWindow,
  keys: TbKey,
  demo: TbHammer,
  systems: TbBolt,
  layers: TbStack2,
  home: TbHome,
  paint: TbPaint,
  kitchen: TbToolsKitchen2,
  bath: TbBath,
  counter: TbLayoutRows,
  light: TbBulb,
  water: TbDroplet,
  tile: TbLayoutGrid,
  pergola: TbBuildingPavilion,
  pencil: TbPencil,
  permit: TbFileCertificate,
};

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const STEP_DELAY = 300; // ms between one stage lighting up and the next
const pad = (n) => String(n).padStart(2, "0");

// A stage in its own bordered box, its square on the box's edge: the top
// edge from 1280px, the left on a phone, where the line runs.
function Stage({ stage, index, lit }) {
  const { icon, title, text } = stage;
  const Icon = ICONS[icon] ?? TbHome;
  const delay = { transitionDelay: lit ? `${index * STEP_DELAY}ms` : "0ms" };
  return (
    <li className="relative border border-black/10 bg-white pl-12 pr-5 py-6 1280:px-5 1280:pt-14 1280:pb-8 1280:text-center pointer-events-none">
      <span
        style={delay}
        className={`absolute z-[2] left-0 top-5 -translate-x-1/2 1280:left-1/2 1280:top-0 1280:-translate-y-1/2 grid h-12 w-12 place-items-center border transition-colors duration-500 ${
          lit
            ? "border-third bg-third text-white"
            : "border-black/20 bg-white text-black/55"
        }`}
      >
        <Icon aria-hidden="true" className="text-[21px]" />
      </span>
      <div
        style={delay}
        className={`transition-[opacity,transform] duration-700 ${EASE} ${
          lit
            ? "opacity-100 [transform:none]"
            : "opacity-0 [transform:translateY(12px)] motion-reduce:[transform:translateY(4px)]"
        }`}
      >
        <p className="text-[11px] uppercase tracking-[0.3em] text-fourth">
          Stage {pad(index + 1)}
        </p>
        <h3 className="mt-2 text-[17px] 700:text-[18px] font-semibold uppercase leading-[1.2] tracking-tight">
          {title}
        </h3>
        <p className="mt-3 text-[15px] 1280:text-[14px] 1440:text-[15px] leading-relaxed text-fourth">
          {text}
        </p>
      </div>
    </li>
  );
}

// The stages beside a drawing, as the story of it (11-21, the user: on the
// build's right rather than under it, nothing busy — no green numbers, no
// tags, no icons — "simple but better looking", and lit as you scroll).
// Each stage's number and name (h3) and what's done in it, in a column on a
// thin rail, kept short (titles well under the section's) and all as tall
// as the tallest, so each stage gets the same turn as you scroll (11-21, the
// user: a short one could be scrolled past without landing on it), one
// against the next, each numbered as on the drawing. Nothing is lit as you
// scroll (11-21, the user: scrapped, "do like we did with LeTara"): only
// the stage whose layer is pointed at in the drawing (`active`) is on a
// Concrete card with a green bar on the rail beside it. Nothing here is
// pointed at or clicked. All of it is always on the page.
function StageStory({ steps, active, listRef }) {
  return (
    <ol ref={listRef} className="relative grid auto-rows-fr pointer-events-none">
        <span
          aria-hidden="true"
          className="absolute left-0 top-0 bottom-0 w-px bg-black/10"
        />
        {steps.map(({ title, text }, i) => {
          const on = active === i;
          return (
            <li
              key={title}
              className={`relative pl-6 pr-5 700:pl-8 py-8 700:py-10 1080:py-12 transition-colors duration-300 ${on ? "bg-concrete" : ""}`}
            >
              <span
                aria-hidden="true"
                className={`absolute left-0 top-0 bottom-0 w-[3px] -translate-x-px origin-top bg-third transition-transform duration-300 ${EASE} ${
                  on ? "[transform:scaleY(1)]" : "[transform:scaleY(0)]"
                }`}
              />
              <div>
                <h3 className="flex items-baseline gap-3 font-gt font-semibold uppercase leading-[1.2] text-[19px] 1440:text-[21px]">
                  <span className="text-[13px] 1440:text-[14px] tracking-wide text-fourth/60">{pad(i + 1)}</span>
                  {title}
                </h3>
                <p className="mt-3.5 max-w-[34rem] text-[15px] leading-relaxed text-fourth">
                  {text}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
  );
}

// "The Build", right under a service page's hero (11-20, the user: like the
// section after LeTara's hero, its How We Work, in a design of our own; the
// stages of the build used to run along the bottom of the hero). The stages
// of the service's build (its data's `build`: Layout & Site Prep,
// Foundation, Framing...), each in a bordered box with its icon on a square.
// A line along the boxes' edge draws itself in green as it comes into view
// and each square lights up as it goes: across their tops from 1280px, down
// their left side below that. With Reduce Motion it all lights at once, the
// stages rising only a little.
//
// A service drawn layer by layer (layers.js: so far the ADU, 11-21) shows
// its drawing instead, like LeTara's "Layer by layer" in our own style: a
// plain blueprint of it taken apart (BuildLayers), built in turn as it
// comes into view, each stage numbered on it, with its stages beside it
// (StageStory) — as LeTara's Layer by layer does it (11-21, the user, after
// a stage lit as you scroll was tried and scrapped). From 1080px the
// drawing is held in view on the left while the stages scroll by, centred
// in the window under the navbar, its top level with the first card's as
// it's taken up and its bottom with the last's as it's let go; on a phone
// it's over the stages and scrolls with the page (as LeTara's). Pointing at
// a layer or its number lights it (in lime, on the sheet) and its stage,
// and clicking it brings its stage into view. The drawing is on a
// blueprint sheet of its own (BuildSheet) whose title block names the
// stage pointed at.
//
// Under the hero: the hero's black cuts in on a diagonal along the top
// (Edge), over a fading grid, with green bars in the gap below. It carries
// the gap to the next section below it (see Home/HomePage). (overflow-clip,
// not -hidden, so the held drawing can stick.)
export default function ServiceBuild({ slug, heading, intro, steps }) {
  const listRef = useRef(null);
  const [lit, setLit] = useState(false);
  const model = LAYERED[slug];
  const drawn = Boolean(model);
  // with a drawing: the stage whose layer is pointed at, if any
  const storyRef = useRef(null);
  const [active, setActive] = useState(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const seen = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setLit(true);
        seen.disconnect();
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    seen.observe(list);
    return () => seen.disconnect();
  }, []);

  // a layer clicked in the drawing: its stage brought to the middle of the
  // window
  const goTo = useCallback((stage) => {
    const card = storyRef.current?.querySelectorAll(":scope > li")[stage];
    if (!card) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    card.scrollIntoView({ block: "center", behavior: calm ? "auto" : "smooth" });
  }, []);

  return (
    <section
      className="wide-zoom relative isolate overflow-clip bg-white pt-[84px] 700:pt-[136px] 1080:pt-[184px] pb-[100px] 1080:pb-[120px]"
      id="build"
    >
      <Grid mask="55% 45% at 20% 20%" />
      <Edge at="top" />
      <Bars
        widths={[90, 180, 300]}
        className="right-[-40px] bottom-[24px] max-1080:scale-[0.55] max-1080:origin-bottom-right"
      />

      <div className="max-w-[1680px] mx-auto w-full 700:px-[32px] px-[24px]">
        <div className="flex flex-col items-start 1080:items-center 1080:text-center pointer-events-none">
          <Reveal className="flex items-center gap-4 mb-6 800:mb-8">
            <span className="block h-2 w-2 flex-shrink-0 bg-third"></span>
            <span className="550:text-[13px] text-[12.5px] text-fourth uppercase font-light tracking-[0.3em]">
              The Build
            </span>
          </Reveal>
          <Reveal as="h2" delay={0.05} className={`${SECTION_TITLE} uppercase`}>
            {keepTogether(heading[0])}
            <br />
            {keepTogether(heading[1])}
          </Reveal>
          <Reveal
            as="p"
            delay={0.1}
            className="mt-6 550:mt-8 max-w-xl text-base 550:text-[17px] leading-relaxed text-fourth"
          >
            {intro}
          </Reveal>
        </div>

        {drawn ? (
          <div className="mt-8 700:mt-12 1080:mt-14 grid gap-8 700:gap-10 1080:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] 1080:gap-12 1440:gap-20">
            {/* the drawing: on a phone over the stages; from 1080px held in
                view beside them, as tall as the window allows (680px at
                most) and centred in it under the navbar */}
            <figure className="relative h-[300px] 400:h-[330px] 550:h-[400px] 700:h-[460px] 1080:sticky 1080:self-start 1080:[--sheet-h:min(680px,calc(100*var(--vh)/var(--wide-zoom)_-_144px))] 1080:h-[var(--sheet-h)] 1080:top-[calc(88px_+_(100*var(--vh)/var(--wide-zoom)_-_88px_-_var(--sheet-h))/2)]">
              <BuildSheet
                stage={active}
                title={active === null ? "" : steps[active].title}
                total={steps.length}
                name={model.short}
                plan={model.plan}
              >
                <BuildLayers slug={slug} active={active} onHover={setActive} onPick={goTo} />
              </BuildSheet>
            </figure>
            <StageStory steps={steps} active={active} listRef={storyRef} />
          </div>
        ) : (
          <ol
            ref={listRef}
            className="relative mt-12 1080:mt-16 grid gap-3 pl-6 1280:pl-0 1280:pt-6 1280:grid-cols-6"
          >
            {/* the line, over the boxes' edge: down their left side on a
                phone, across their tops from 1280px */}
            <span
              aria-hidden="true"
              className="absolute z-[1] left-6 top-0 bottom-0 w-px bg-black/10 1280:left-0 1280:right-0 1280:top-6 1280:bottom-auto 1280:w-auto 1280:h-px"
            >
              <span
                className={`absolute inset-0 bg-third origin-top 1280:origin-left transition-transform duration-[1800ms] ${EASE} motion-reduce:duration-0 ${
                  lit
                    ? "[transform:none]"
                    : "[transform:scaleY(0)] 1280:[transform:scaleX(0)]"
                }`}
              />
            </span>
            {steps.map((stage, i) => (
              <Stage key={stage.title} stage={stage} index={i} lit={lit} />
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
