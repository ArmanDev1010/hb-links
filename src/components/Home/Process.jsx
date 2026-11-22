"use client";

import React from "react";
import { BiCheckCircle, BiConversation, BiMoneyWithdraw } from "react-icons/bi";
import { MdOutlineConstruction } from "react-icons/md";
import Reveal from "@/components/UI/Reveal";
import { BlueprintHouse, DimensionLine, Grid } from "@/components/UI/Deco";
import { SECTION_TITLE } from "@/components/UI/titles";

const process = [
  {
    icon: BiConversation,
    label: "You Reach Out",
    description:
      "Call us, fill out the form, or send us an email. We’ll get back to you quickly and schedule a time to talk about your project in detail. No pressure, no sales pitch — just a real conversation.",
  },
  {
    icon: BiMoneyWithdraw,
    label: "We Discuss & Quote",
    description:
      "We visit the property, walk the scope, and prepare a detailed written estimate. You see the real cost — every phase accounted for. If something’s unclear, we explain it before you sign.",
  },
  {
    icon: MdOutlineConstruction,
    label: "We Build",
    description:
      "Once the project is confirmed, we get to work. Our team brings the plan to life with quality craftsmanship and clear communication from start to finish, delivering a completed project you can be proud of.",
  },
  {
    icon: BiCheckCircle,
    label: "We Hand It Over",
    description:
      "Final walkthrough, every detail reviewed and addressed. We review the completed work with you, address any final details, and ensure everything meets your expectations before we wrap up.",
  },
];

// An area page's four steps (`place`, 11-20): the homepage's, with the same
// titles — only the descriptions are worded for the area, its name in each
// (the user: "don't change the title, only the descriptions").
const placeDescriptions = (place) => [
  `Call us, fill out the form, or send us an email about your ${place} project. We’ll get back to you quickly and schedule a time to talk about it in detail. No pressure, no sales pitch — just a real conversation.`,
  `We visit your property in ${place}, walk the scope, and prepare a detailed written estimate. You see the real cost — every phase accounted for. If something’s unclear, we explain it before you sign.`,
  `Once the project is confirmed, we get to work on your ${place} home. Our team brings the plan to life with quality craftsmanship and clear communication from start to finish, delivering a completed project you can be proud of.`,
  `Final walkthrough at your ${place} home, every detail reviewed and addressed. We review the completed work with you, address any final details, and ensure everything meets your expectations before we wrap up.`,
];

// The homepage renders the general four steps above; an area page passes
// its name (`place`): the same steps and heading, its own descriptions and
// intro line. Each service page
// passes its own four `steps`, the end of the heading ("Four Steps, Every
// ADU"), and its own intro line. Only the homepage steps carry an `icon`.
//
// The heading rises in as it scrolls into view (UI/Reveal), then the steps
// one after another, each one's gold bar drawing in once its card is up
// (.reveal-bar, globals.css).
//
// The homepage dresses it (the redesign): a grid top left and a blueprint
// house with its dimension behind the heading (`decorated`), room above for
// the reviews band's cut (`afterBand`), and room below for the dark contact
// band, which pulls up over the bottom of this section on a diagonal
// (`edgeBottom`, Home/Contact).
export default function Process({
  place = null,
  steps: given = process,
  closing: givenClosing = "Every Project",
  intro: givenIntro = "Every project follows the same four steps — regardless of scope, budget, or location.",
  decorated = false,
  afterBand = false,
  edgeBottom = false,
}) {
  const steps = place
    ? given.map((step, i) => ({ ...step, description: placeDescriptions(place)[i] ?? step.description }))
    : given;
  const closing = givenClosing;
  const intro = place
    ? `Every ${place} project follows the same four steps — regardless of scope or budget.`
    : givenIntro;
  const padding = [
    afterBand && "pt-[72px] 700:pt-[96px] 1080:pt-[112px]",
    edgeBottom
      ? "pb-[110px] 700:pb-[140px] 1080:pb-[160px]"
      : "pb-[100px] 1080:pb-[120px]",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      className={`wide-zoom relative isolate overflow-hidden ${padding}`}
      id="process"
    >
      {decorated && (
        <>
          <Grid mask="40% 40% at 12% 18%" />
          {/* smaller than the redesign's 560px (the user's call, 11-20);
              the dimension runs across it at its windows */}
          <BlueprintHouse
            opacity={0.15}
            className="w-[200px] 700:w-[300px] 1080:w-[380px] -right-[30px] 700:right-[40px] top-[60px] 1080:top-[56px]"
          />
          <DimensionLine
            label={"52'-0\""}
            className="max-1080:hidden w-[380px] right-[40px] top-[203px]"
          />
        </>
      )}
      <div className="max-w-[1680px] mx-auto w-full 700:px-[32px] px-[24px]">
        <div className="mx-auto 1280:w-[83.33%] w-full">
          <Reveal className="flex items-center gap-4 pointer-events-none mb-6 800:mb-8">
            <span className="block h-2 w-2 flex-shrink-0 bg-third"></span>
            <span className="550:text-[13px] text-[12.5px] text-fourth uppercase font-light tracking-[0.3em] mt-[2px]">
              How We Work
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-fourth/20 to-transparent"></span>
          </Reveal>
          <Reveal
            as="h2"
            delay={0.05}
            className={`${SECTION_TITLE} uppercase pointer-events-none`}
          >
            Four Steps<span className="max-550:hidden">,</span>{" "}
            <br className="550:hidden"></br> {closing}
          </Reveal>
          <Reveal
            as="p"
            delay={0.1}
            className="mt-6 550:mt-8 text-base 550:text-[17px] text-fourth max-w-2xl pointer-events-none"
          >
            {intro}
          </Reveal>
        </div>
        <div className="relative mt-12 1080:mt-16">
          <ul className="grid grid-cols-1 900:grid-cols-2 1440:grid-cols-4 gap-5 900:gap-6 items-stretch">
            {steps.map(({ icon: Icon, label, description }, index) => {
              const step = String(index + 1).padStart(2, "0");
              const total = String(steps.length).padStart(2, "0");

              return (
                <Reveal
                  as="li"
                  key={index}
                  delay={0.08 * index}
                  className="w-full group flex flex-col h-full border border-black/15 p-8 700:p-10 1440:p-8 1600:p-10 transition-colors hover:border-third"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-16 w-16 items-center justify-center border border-black/25 900:h-[72px] 900:w-[72px]">
                      <span className="text-2xl font-bold tracking-tight text-black 900:text-[1.75rem]">
                        {step}
                      </span>
                    </div>
                    {Icon && (
                      <Icon className="text-[36px] 900:text-[32px] text-fourth transition-colors group-hover:text-third pointer-events-none" />
                    )}
                  </div>

                  <div className="mt-10 flex items-center gap-3 pointer-events-none">
                    <span className="reveal-bar block h-[2px] w-7 flex-shrink-0 bg-third"></span>
                    <span className="text-[12px] 550:text-[12px] uppercase font-light tracking-[0.3em] text-fourth">
                      Step {step} of {total}
                    </span>
                  </div>

                  <h3 className="mt-8 550:mt-5 text-[22px] 700:text-2xl 1440:text-[22px] 1600:text-2xl 900:min-h-[2lh] leading-[1.2] pointer-events-none uppercase font-bold text-black">
                    {label}
                  </h3>

                  <p className="mt-6 text-[15px] 1440:text-base leading-[1.75] text-fourth pointer-events-none">
                    {description}
                  </p>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
