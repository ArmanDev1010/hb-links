"use client";

import { useEffect, useRef, useState } from "react";
import { BiConversation, BiMoneyWithdraw } from "react-icons/bi";
import { MdOutlineConstruction } from "react-icons/md";
import { LiaUserFriendsSolid } from "react-icons/lia";

export default function ExpertiseJourney({ title }) {
  const lower = title.toLowerCase();
  const trackRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const raw = (window.innerHeight / 2 - rect.top) / rect.height;
      setProgress(Math.min(1, Math.max(0, raw)));
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const steps = [
    {
      tag: "Reach Out",
      label: "Free Consultation",
      description: `Call or request a free estimate for your ${lower} project — we'll get you on the schedule.`,
      icon: <BiConversation />,
    },
    {
      tag: "On-Site",
      label: "On-Site Evaluation",
      description:
        "Our estimator meets with you — and all key decision-makers — to discuss your vision, goals, and project scope. If architectural or design plans are already in place, we review them together during this visit.",
      icon: <LiaUserFriendsSolid />,
    },
    {
      tag: "Proposal & Scheduling",
      label: "Custom Proposal & Agreement",
      description:
        "Our team creates a tailored proposal with design recommendations and a detailed scope of work. Once approved, we finalize the contract covering the timeline, scope, and process before work begins.",
      icon: <BiMoneyWithdraw />,
    },
    {
      tag: "Expert Execution",
      label: `${title} Executed`,
      description:
        "Our team brings the plan to life with quality craftsmanship and clear communication from start to finish, delivering a completed project you can be proud of.",
      icon: <MdOutlineConstruction />,
    },
  ];

  return (
    <section className="relative py-12 1080:pt-24" id="expertise_journey">
      <div className="max-w-[1680px] mx-auto w-full 700:px-[1rem] px-[0.5rem]">
        <div className="mx-auto 1280:w-[83.33%] w-full">
          <div className="w-full lg:w-10/12 lg:mx-auto text-center px-2 mb-16 lg:mb-24 pointer-events-none">
            <p className="text-sm uppercase font-xbold tracking-widest mb-4 text-gray-700">
              Our Process
            </p>
            <h2 className="pb-1 font-bold 1080:text-5xl 700:text-4xl text-3xl leading-[1.2]">
              What working with us on a <br className="max-400:hidden"></br>
              {title} project looks like
            </h2>
          </div>

          <div className="relative px-2" ref={trackRef}>
            {/* base rail — desktop */}
            <div className="hidden 900:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-black/10" />
            {/* scroll-linked glow rail — desktop */}
            <div
              className="hidden 900:block absolute top-0 left-1/2 -translate-x-1/2 w-[3px] bg-third"
              style={{ height: `${progress * 100}%` }}
            />
            {/* base rail — mobile */}
            <div className="900:hidden absolute top-[1px] bottom-0 left-[1.7rem] w-px bg-black/10" />
            {/* scroll-linked glow rail — mobile */}
            <div
              className="900:hidden absolute top-[1px] left-[1.7rem] w-[3px] bg-third"
              style={{ height: `${progress * 100}%` }}
            />

            <ol className="flex flex-col gap-14 900:gap-16">
              {steps.map((step, index) => {
                const isRight = index % 2 === 0;
                return (
                  <li
                    key={step.label}
                    className="relative 900:grid 900:grid-cols-2 900:items-center"
                  >
                    <span className="absolute top-0 left-5 900:top-1/2 900:left-1/2 -translate-x-1/2 900:-translate-y-1/2 900:w-12 900:h-12 w-10 h-10 rounded-full bg-white border-2 border-third flex items-center justify-center text-third 900:text-2xl text-xl z-10 pointer-events-none">
                      {step.icon}
                    </span>

                    <div
                      className={`pl-14 900:pl-0 pointer-events-none ${
                        isRight
                          ? "900:col-start-2 900:pl-16 900:text-left"
                          : "900:col-start-1 900:pr-16 900:text-right"
                      }`}
                    >
                      <div
                        className={`pointer-events-auto inline-block w-full max-w-base border border-black/10 hover:border-third transition-colors px-5 py-5 ${
                          isRight ? "" : "900:ml-auto"
                        }`}
                      >
                        <div className="uppercase text-gray-600 400:text-sm text-xs font-xbold tracking-widest mb-5 pointer-events-none">
                          <span className="font-bold text-black">
                            {String(index + 1).padStart(2, "0")}
                          </span>{" "}
                          — {step.tag}
                        </div>
                        <h3 className="400:text-2xl text-xl h-[100px] pointer-events-none uppercase font-bold text-third transition-colors group-hover:text-third">
                          {step.label}
                        </h3>
                        <p className="text-gray-700 pointer-events-none max-400:text-sm">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
