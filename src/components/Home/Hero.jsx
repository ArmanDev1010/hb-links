"use client";

import React from "react";
import Image from "next/image";
import { useModal } from "@/context/ModalContext";
import HeroBuildSequence from "@/components/Home/HeroBuildSequence";
import HeroShade from "@/components/Home/HeroShade";
import { getSequence } from "@/data/heroBuild";

import { IoIosArrowRoundForward } from "react-icons/io";

// `title` and `paragraph` default to the homepage's; each service page
// passes its own (e.g. "ADU Builder") — the H1 always ends "in <area>".
// `sequence` names a build timelapse (data/heroBuild) to pin the hero over as
// you scroll (see HeroBuildSequence) — "adu" on the homepage, the page's own
// on a service page — once its frames exist. Until then a service page's
// photo, `image` ({ src, alt }), sits behind the copy; without one the hero
// is black. `variant` is "home" or "service": on phones (under 550px) service
// pages' titles run a little larger (PHONE_TITLE); from 550px up both match.
const PHONE_TITLE = { home: "text-[6.5vw]", service: "text-[7vw]" };

export default function Hero({
  area,
  title = "Custom Home Builder",
  paragraph = `A licensed custom home builder serving ${area.coverage}. We specialize in ADUs, home remodels and additions, kitchen and bathroom renovations, and outdoor living spaces — quoted honestly, with no surprises.`,
  sequence = null,
  image = null,
  variant = "home",
}) {
  const { toggleModal } = useModal();

  const content = (
    <div className="max-w-4xl">
      <h1
        className={`font-gt uppercase w-fit font-compressed tracking-normal 550:leading-[1.1] leading-[1.2] font-semibold pointer-events-none
      1600:text-[3.5rem] 1080:text-[3rem] 700:text-[2.7rem] 550:text-[2.2rem] ${PHONE_TITLE[variant]}`}
      >
        {title} <br /> in <span className="italic">{area.name}</span>
      </h1>

      <p className="max-550:hidden font-gt mt-8 text-neutral-300 900:text-[11px] text-[10px] uppercase tracking-[0.3em] flex flex-wrap gap-x-3 gap-y-1.5 items-center pointer-events-none">
        <span>Licensed & Insured</span>{" "}
        <span className="text-third 700:text-2xl text-xl max-700:hidden">
          /
        </span>{" "}
        <span className="max-700:hidden">CSLB #1144057</span>{" "}
        <span className="text-third 700:text-2xl text-xl">/</span>{" "}
        <span>{area.badge}</span>
      </p>

      <p className="550:mt-6 mt-8 font-light max-w-2xl text-neutral-200 text-[15px] 700:text-base 900:text-[17px] pointer-events-none">
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

  const timelapse = getSequence(sequence);
  if (timelapse) {
    return (
      <HeroBuildSequence sequence={timelapse}>{content}</HeroBuildSequence>
    );
  }

  return (
    <section
      className="relative overflow-hidden h-full flex min-h-screen items-end pt-28 sm:pt-22 !bg-black text-neutral-50"
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

      <div className="relative z-20 900:pb-16 pb-20 mx-auto w-full 700:px-[32px] px-[24px]">
        {content}
      </div>
    </section>
  );
}
