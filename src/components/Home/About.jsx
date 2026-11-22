"use client";

import { contactInfo } from "@/data/contact";
import { rotatingWords } from "@/data/rotatingWords";
import RotatingWord from "@/components/UI/RotatingWord";
import Reveal from "@/components/UI/Reveal";
import {
  Bars,
  BlueprintHouse,
  Edge,
  Grid,
  PlusMarks,
  Slab,
} from "@/components/UI/Deco";

const license = contactInfo.find((item) => item.type === "License")?.label;

export default function About({ area }) {
  const highlights = [
    {
      tag: "Licensed",
      title: license,
      subtitle: "Bonded & Insured",
    },
    {
      tag: "Classifications",
      title: "B / C-10 / C-36",
      subtitle: "Ready for every trade",
    },
    {
      tag: "Serving",
      title: area.badge,
      subtitle: "Where we work",
    },
  ];

  // Sits under the dark hero: the hero's black cuts in along the top on a
  // diagonal (Edge), so the copy starts below it — 84px on phones, 184px
  // from 1080px.
  return (
    <section
      className="wide-zoom relative isolate overflow-hidden pt-[84px] 700:pt-[136px] 1080:pt-[184px] pb-[100px] 1080:pb-[112px] text-black"
      id="about"
    >
      <Grid mask="62% 70% at 50% 30%" />
      <Edge at="top" />
      <Slab className="w-[150px] 700:w-[240px] h-[1000px] left-[58%] -top-[120px]" />
      <Bars
        widths={[90, 180, 300]}
        className="700:max-1080:hidden right-[-40px] max-700:bottom-[24px] 700:bottom-[96px] max-700:scale-[0.55] max-700:origin-bottom-right"
      />
      <PlusMarks />
      <BlueprintHouse className="w-[300px] 700:w-[520px] right-[-90px] 700:right-[-150px] top-[110px] 700:top-[30px]" />
      <BlueprintHouse
        opacity={0.1}
        className="max-1080:hidden w-[460px] left-[-170px] bottom-[10px]"
      />

      <div className="w-full 1280:w-10/13 1280:mx-auto 1280:px-0 700:px-[32px] px-[24px] text-left">
        <Reveal
          as="p"
          className="mb-6 550:text-[13px] text-[12.5px] text-fourth uppercase font-light tracking-[0.3em] 800:text-center max-550:text-center pointer-events-none"
        >
          Who We Are
        </Reveal>

        <Reveal
          as="p"
          delay={0.05}
          className="font-gt flex gap-3 max-550:gap-2 max-550:flex-col items-center 800:justify-center w-full pb-1 font-semibold 
        text-[28px] 400:text-[32px] 550:text-3xl 700:text-4xl 1080:text-[42px] 1600:text-[45px] uppercase leading-[1.2] pointer-events-none"
        >
          <span className="800:w-[50%] 800:text-right">HB Links</span>
          <span className="max-550:hidden">|</span>
          <RotatingWord
            words={rotatingWords}
            className="550:h-[1.2em] 800:w-[50%] max-800:flex-[1] max-550:w-full max-550:text-center"
          />
        </Reveal>

        {/* The three facts in their boxes, solid white, so the green slab
            and the grid run under them (like the footer's icon squares; the
            redesign's unboxed row along a dimension line was reverted, 11-20). */}
        <div className="mt-8 grid gap-4 mx-auto grid-cols-1 550:grid-cols-2 800:grid-cols-3">
          {highlights.map((item, index) => (
            <Reveal
              key={item.tag}
              delay={0.1 + 0.08 * index}
              className={`
        border border-black/10 bg-white px-4 py-3.5 text-left pointer-events-none
        ${index === 2 ? "550:col-span-2 550:justify-self-center 550:w-full 550:max-w-[400px] 800:col-span-1 800:max-w-none" : ""}
      `}
            >
              <span className="flex items-center justify-start gap-2 text-[11px] font-xbold uppercase tracking-widest text-third">
                <span className="w-1.5 h-1.5 bg-third inline-block flex-shrink-0" />
                <span className="leading-none">{item.tag}</span>
              </span>

              <p className="mt-3 font-bold uppercase text-[14px] leading-snug tracking-wide">
                {item.title}
              </p>

              <p className="text-[11px] text-fourth mt-2 uppercase">
                {item.subtitle}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal
          as="p"
          delay={0.1}
          className="mt-10 550:text-[17px] 1080:text-[17px] text-fourth 800:mx-auto 800:text-center max-550:text-center 900:max-w-2xl pointer-events-none"
        >
          HB Links is a licensed, fully insured general contractor{" "}
          {area.isPrimary ? "based in" : "serving"} {area.name}, CA. We build
          ADUs, garage conversions, home additions, outdoor living spaces, and
          high-end remodels for homeowners
          across greater Los Angeles — our approach is defined by honest
          pricing, a detailed process, and complete transparency at every stage.
          {/* Phones stop here (the redesign's mobile board). */}
          <span className="max-550:hidden">
            {" "}
            Before construction begins, we review materials, timeline, and
            cost with each client to ensure clarity. Throughout the build,
            progress is documented and communicated, so clients understand
            exactly what is being done and why. We discuss every detail
            upfront, quote it clearly, and build to the standard we&apos;d want
            for ourselves.
          </span>
        </Reveal>
      </div>
    </section>
  );
}
