"use client";

import React from "react";

import { BiConversation, BiMoneyWithdraw, BiCheckCircle } from "react-icons/bi";
import { MdOutlineConstruction } from "react-icons/md";
import { LiaUserFriendsSolid } from "react-icons/lia";

import Link from "next/link";

const process = [
  {
    label: "Free Consultation",
    description:
      "Reach out today for a complimentary estimate. We'll pair you with one of our professional estimators and get you on the schedule.",
    icon: <BiConversation />,
  },
  {
    label: "On-Site Evaluation",
    description:
      "Our estimator meets with you — and all key decision-makers — to discuss your vision, goals, and project scope. If architectural or design plans are already in place, we review them together during this visit.",
    icon: <LiaUserFriendsSolid />,
  },
  {
    label: "Custom Design & Proposal",
    description:
      "Our team builds a tailored proposal, complete with design recommendations and a detailed breakdown of the full scope of work — so you know exactly what to expect.",
    icon: <BiMoneyWithdraw />,
  },
  {
    label: "Agreement & Contract",
    description:
      "Once you approve the proposal, we finalize a clear, comprehensive contract covering every detail — timeline, scope, and process — before any work begins.",
    icon: <BiCheckCircle />,
  },
  {
    label: "Expert Execution",
    description:
      "Our team brings the plan to life with quality craftsmanship and clear communication from start to finish, delivering a completed project you can be proud of.",
    icon: <MdOutlineConstruction />,
  },
];

export default function Process() {
  return (
    <section className="relative overflow-hidden py-[60px]" id="process">
      <div className="max-w-[1680px] mx-auto w-full 700:px-[1rem] px-[0.5rem]">
        <div className="mx-auto 1280:w-[83.33%] w-full">
          <div className="flex relative w-full max-900:flex-col max-900:gap-8">
            <div className="w-full 900:w-1/2 px-2 900:pr-4 pointer-events-none">
              <p className="text-sm uppercase font-xbold tracking-widest mb-4 text-gray-700">
                Our Process
              </p>
              <h3 className="pb-1 font-bold 1080:text-5xl text-4xl leading-none">
                What working with us <br className="max-550:hidden"></br> looks
                like
              </h3>
            </div>
            <div className="w-full 900:w-1/2 px-2 900:pl-4 900:self-end flex flex-col">
              <Link href={"/contact"} className="900:self-end cursor-pointer">
                <div
                  className="w-fit bg-third text-white border-black border-[2.5px] 700:px-[2.5rem] px-[2rem] py-[0.75rem] 550:text-sm text-xs font-[500] uppercase tracking-[0.1em] 
              hover:bg-white hover:text-black transition-all ease-[cubic-bezier(0.4,0,0.2,1)] duration-400"
                >
                  Schedule a Free Consultation
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div className="relative 900:pt-10 pt-12 px-[8px]">
          <ul className="process-list flex flex-wrap justify-center gap-6">
            {process.map(({ label, description, icon }, index) => (
              <li
                key={index}
                className="w-full 1280:w-[calc((100%-48px)/3)] 900:w-[calc((100%-24px)/2)] group flex flex-col h-full border-t border-l p-5 transition-colors border-black/25 hover:border-third"
              >
                <div className="flex justify-between items-center mb-8">
                  <p className="font-bold 900:text-4xl text-3xl">
                    {index >= 9 ? "" : "0"}
                    {index + 1}
                  </p>
                  <div className="text-3xl group-hover:text-third transition-colors">
                    {icon}
                  </div>
                </div>

                <span className="900:h-[150px] h-[120px] pointer-events-none uppercase font-bold 1280:text-3xl 900:text-2xl 550:text-3xl text-2xl text-third transition-colors group-hover:text-third">
                  {label}
                </span>

                <p className="text-gray-700">{description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
