"use client";

import React from "react";
import { BiCheckCircle, BiConversation, BiMoneyWithdraw } from "react-icons/bi";
import { MdOutlineConstruction } from "react-icons/md";
import Reveal from "@/components/UI/Reveal";

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

// The homepage renders the general four steps above. Each service page
// passes its own four `steps`, the end of the heading ("Four Steps, Every
// ADU"), and its own intro line. Only the homepage steps carry an `icon`.
//
// The heading rises in as it scrolls into view (UI/Reveal), then the steps
// one after another, each one's gold bar drawing in once its card is up
// (.reveal-bar, globals.css).
export default function Process({
  steps = process,
  closing = "Every Project",
  intro = "Every project follows the same four steps — regardless of scope, budget, or location.",
}) {
  return (
    <section
      className="relative overflow-hidden py-[100px] 1080:pb-[120px] 1080:pt-[150px]"
      id="process"
    >
      <div className="max-w-[1680px] mx-auto w-full 700:px-[32px] px-[24px]">
        <div className="mx-auto 1280:w-[83.33%] w-full">
          <Reveal className="flex items-center gap-4 pointer-events-none mb-8">
            <span className="block h-2 w-2 flex-shrink-0 bg-third"></span>
            <span className="550:text-[13px] text-[12.5px] text-fourth uppercase font-light tracking-[0.3em] mt-[2px]">
              How We Work
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-fourth/20 to-transparent"></span>
          </Reveal>
          <Reveal
            as="h2"
            delay={0.05}
            className="font-gt uppercase font-semibold leading-[1.2] text-[32px] 550:text-[30px] 1080:text-[36px] 1600:text-[45px] pointer-events-none"
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
                      <Icon className="text-[36px] 900:text-[32px] text-black/70 transition-colors group-hover:text-third pointer-events-none" />
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
