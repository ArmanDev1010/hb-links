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
    label: "Custom Proposal & Agreement",
    description:
      "Our team creates a tailored proposal with design recommendations and a detailed scope of work. Once approved, we finalize the contract covering the timeline, scope, and process before work begins.",
    icon: <BiMoneyWithdraw />,
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
    <section className="relative overflow-hidden pt-[40px] pb-[60px]" id="process">
      <div className="max-w-[1680px] mx-auto w-full 700:px-[1rem] px-[0.5rem]">
        <div className="mx-auto 1280:w-[83.33%] w-full">
          <div className="flex relative w-full max-900:flex-col max-900:gap-8">
            <div className="w-full 900:w-1/2 px-2 900:pr-4 pointer-events-none">
              <p className="text-sm uppercase font-xbold tracking-widest mb-4 text-gray-700">
                Our Process
              </p>
              <h3 className="pb-1 font-bold 1080:text-5xl 400:text-4xl text-3xl leading-none">
                What working with us <br className="max-550:hidden"></br> looks
                like
              </h3>
            </div>
            <div className="w-full 900:w-1/2 px-2 900:pl-4 900:self-end flex flex-col">
              <Link href={"/contact"} className="900:self-end cursor-pointer">
                <div
                  className="w-fit bg-third text-white border-black border-[1.5px] 700:px-[2.5rem] px-[2rem] py-[0.75rem] 550:text-sm text-xs font-[500] uppercase tracking-[0.1em] 
              hover:bg-white hover:text-black transition-all ease-[cubic-bezier(0.4,0,0.2,1)] duration-400"
                >
                  Schedule a Free Consultation
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div className="relative 900:pt-10 pt-12 px-[8px]">
          <ul className="grid grid-cols-1 900:grid-cols-2 1280:grid-cols-4 gap-8 items-stretch">
            {process.map(({ label, description, icon }, index) => (
              <li
                key={index}
                className="w-full group flex flex-col h-full border-t border-l p-5 transition-colors border-black/25 hover:border-third"
              >
                <div className="flex justify-between items-center mb-8 pointer-events-none">
                  <p className="font-bold text-4xl">
                    {index >= 9 ? "" : "0"}
                    {index + 1}
                  </p>
                  <div className="text-3xl group-hover:text-third transition-colors">
                    {icon}
                  </div>
                </div>

                <h3 className="text-2xl 900:h-[150px] h-[120px] pointer-events-none uppercase font-bold text-third transition-colors group-hover:text-third">
                  {label}
                </h3>

                <p className="text-gray-700 pointer-events-none">
                  {description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
