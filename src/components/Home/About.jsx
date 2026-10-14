"use client";

import { contactInfo } from "@/data/contact";
import { rotatingWords } from "@/data/rotatingWords";
import RotatingWord from "@/components/UI/RotatingWord";

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

  return (
    <section className="mt-3 pt-10 text-black" id="about">
      <div className="w-full 1280:w-10/13 1280:mx-auto 1280:px-0 700:px-[32px] px-[24px] text-left">
        <p className="mb-6 550:text-[13px] text-[12.5px] text-fourth uppercase font-light tracking-[0.3em] 800:text-center max-550:text-center pointer-events-none">
          Who We Are
        </p>

        <p
          className="font-gt flex gap-3 max-550:gap-2 max-550:flex-col items-center 800:justify-center w-full pb-1 font-semibold 
        text-[28px] 400:text-[32px] 550:text-3xl 700:text-4xl 1080:text-[42px] 1600:text-[45px] uppercase leading-[1.2] pointer-events-none"
        >
          <span className="800:w-[50%] 800:text-right">HB Links</span>
          <span className="max-550:hidden">|</span>
          <RotatingWord
            words={rotatingWords}
            className="550:h-[1.2em] 800:w-[50%] max-800:flex-[1] max-550:w-full max-550:text-center"
          />
        </p>

        <div className="mt-8 grid gap-4 mx-auto grid-cols-1 550:grid-cols-2 800:grid-cols-3">
          {highlights.map((item, index) => (
            <div
              key={item.tag}
              className={`
        border border-black/10 px-4 py-3.5 text-left pointer-events-none
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

              <p className="text-[11px] text-fourth/85 mt-2 uppercase">
                {item.subtitle}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-10 550:text-[17px] 1080:text-[17px] text-fourth 800:mx-auto 800:text-center max-550:text-center 900:max-w-2xl pointer-events-none">
          HB Links is a licensed, fully insured home builder and remodeler{" "}
          {area.isPrimary ? "based in" : "serving"} {area.name}, CA. We build
          ADUs, outdoor living spaces, and high-end remodels for homeowners
          across greater Los Angeles — our approach is defined by honest
          pricing, a detailed process, and complete transparency at every stage.
          Before construction begins, we review materials, timeline, and cost
          with each client to ensure clarity. Throughout the build, progress is
          documented and communicated, so clients understand exactly what is
          being done and why. We discuss every detail upfront, quote it clearly,
          and build to the standard we'd want for ourselves.
        </p>
      </div>
    </section>
  );
}
