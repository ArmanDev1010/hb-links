"use client";

import React from "react";
import Image from "next/image";
import { useModal } from "@/context/ModalContext";
import HeroBuildSequence from "@/components/Home/HeroBuildSequence";
import HeroIntro from "@/components/Home/HeroIntro";
import HeroShade from "@/components/Home/HeroShade";
import { getSequence } from "@/data/heroBuild";
import { keepTogether } from "@/components/UI/titles";

import { IoIosArrowRoundForward } from "react-icons/io";

// `title` and `paragraph` default to the homepage's; each service page
// passes its own (e.g. "ADU Builder") — the H1 always ends "in <area>".
// `sequence` names a build timelapse (data/heroBuild) to pin the hero over as
// you scroll (see HeroBuildSequence) — the page's own on a service page —
// once its frames exist; "intro" is the homepage's drawn build instead (see
// HeroIntro), which needs no frames. Until then a service page's
// photo, `image` ({ src, alt }), sits behind the copy; without one the hero
// is black. `variant` is "home" or "service": on phones (under 550px) the
// title fills the copy's column (PHONE_TITLE, in cqw, the column's own width
// — vw would count a desktop scrollbar and spill past it): the homepage's
// "GENERAL CONTRACTOR" is 12.6em wide, the widest service line, "GARAGE
// CONVERSIONS", 12.3em, so every service page shares that size. From 550px
// up both match.
const PHONE_TITLE = {
  home: "text-[length:min(100cqw/12.7,2.3rem)]",
  service: "text-[length:min(100cqw/12.45,2.3rem)]",
};

export default function Hero({
  area,
  title = "General Contractor",
  paragraph = `A licensed general contractor serving ${area.coverage}. We specialize in ADUs and garage conversions, home remodels and additions, kitchen and bathroom renovations, and outdoor living spaces — quoted honestly, with no surprises.`,
  sequence = null,
  image = null,
  variant = "home",
}) {
  const { toggleModal } = useModal();

  const content = (
    <div className="@container max-w-4xl">
      <h1
        className={`font-gt uppercase w-fit font-compressed tracking-normal 550:leading-[1.1] leading-[1.2] font-semibold pointer-events-none
      1600:text-[3.25rem] 1080:text-[2.875rem] 700:text-[2.8rem] 550:text-[2.3rem] ${PHONE_TITLE[variant]}`}
      >
        {keepTogether(title)} <br /> in{" "}
        <span className="italic whitespace-nowrap">{area.name}</span>
      </h1>

      <p className="max-550:hidden font-gt mt-8 text-silver 900:text-[11px] text-[10px] uppercase tracking-[0.3em] flex flex-wrap gap-x-3 gap-y-1.5 items-center pointer-events-none">
        <span>Licensed & Insured</span>{" "}
        <span className="text-third 700:text-2xl text-xl max-700:hidden">
          /
        </span>{" "}
        <span className="max-700:hidden">CSLB #1144057</span>{" "}
        <span className="text-third 700:text-2xl text-xl">/</span>{" "}
        <span>{area.badge}</span>
      </p>

      {/* text-pretty: no word left alone on the last line */}
      <p className="550:mt-6 mt-8 font-light max-w-2xl text-pretty text-silver text-[15px] 700:text-base 900:text-[17px] pointer-events-none">
        {paragraph}
      </p>

      <button
        onClick={toggleModal}
        className="group border-1 border-white bg-third text-white flex items-center justify-center
        h-full 550:min-h-[46px] min-h-[42px] mt-8 700:px-12 px-10 uppercase 550:text-[12.5px] text-[12px] font-semibold tracking-[0.12em]
        hover:bg-white hover:text-black transition duration-200 cursor-pointer outline-none"
      >
        <div className="relative overflow-hidden text-center">
          <div className="group-hover:-translate-y-[110%] flex items-center gap-2 transition duration-300">
            Get a Free Quote
            <IoIosArrowRoundForward className="text-xl" />
          </div>
          <div className="translate-y-[110%] h-fit group-hover:translate-y-0 absolute top-0 bottom-0 left-0 right-0 transition duration-300">
            <span>Get a Free Quote</span>
          </div>
        </div>
      </button>
    </div>
  );

  if (sequence === "intro") return <HeroIntro>{content}</HeroIntro>;

  const timelapse = getSequence(sequence);
  if (timelapse) {
    return (
      <HeroBuildSequence sequence={timelapse}>{content}</HeroBuildSequence>
    );
  }

  return (
    <section
      className="relative overflow-hidden h-full flex min-h-[calc(100*var(--vh))] max-700:min-h-[calc(85*var(--svh))] max-550:min-h-[calc(90*var(--svh))] max-400:min-h-[calc(95*var(--svh))] items-end pt-28 sm:pt-22 !bg-black text-white"
      id="hero"
    >
      {image && (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      )}
      <HeroShade />

      <div className="wide-zoom relative z-20 900:pb-16 pb-20 mx-auto w-full 700:px-[32px] px-[24px]">
        {content}
      </div>
    </section>
  );
}
