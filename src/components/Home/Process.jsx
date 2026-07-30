import React from "react";
import Link from "next/link";

import {
  BiConversation,
  BiMoneyWithdraw,
  BiCalendar,
  BiCheckCircle,
} from "react-icons/bi";

const process = [
  {
    label: "Initial Contact",
    description: "Contact us for a free estimate.",
    icon: <BiConversation />,
  },
  {
    label: "Free Estimate",
    description: "Receive a detailed estimate for required services.",
    icon: <BiMoneyWithdraw />,
  },
  {
    label: "Job Scheduling",
    description: "We'll sign a contract & start the project.",
    icon: <BiCalendar />,
  },
  {
    label: "Job Completion",
    description: "Enjoy quality work done right.",
    icon: <BiCheckCircle />,
  },
];

export default function Process() {
  return (
    <section className="relative overflow-hidden py-[60px]" id="process">
      <div className="max-w-[1680px] mx-auto w-full 700:px-[1rem] px-[0.5rem]">
        <div className="mx-auto 1280:w-[83.33%] w-full">
          <div className="flex relative w-full max-1080:flex-col max-1080:gap-8">
            <div className="w-full 1080:w-1/2 px-2 1080:pr-4 pointer-events-none">
              <p className="1280:text-sm text-xs uppercase font-xbold tracking-widest mb-4 text-gray-700">
                What working with us looks like
              </p>
              <h3 className="pb-1 font-bold text-4xl lg:text-5xl 1280:text-6xl leading-none">
                Our Process
              </h3>
            </div>
            <div className="w-full 1080:w-1/2 px-2 1080:pl-4 1080:self-end flex flex-col 1080:gap-5 gap-6">
              <p className="text-gray-700 max-1080:max-w-[700px] pointer-events-none">
                Start by contacting us for a free estimate. After reviewing your
                project details, we'll create a plan and get started on bringing
                your project to life.
              </p>
              <Link href={"/contact"} className="1080:self-end">
                <div
                  className="w-fit bg-third text-white border-black border-[2.5px] px-[3.5rem] py-[0.75rem] text-base font-[500] uppercase tracking-[0.1em] 
              hover:bg-white hover:text-black transition-all ease-[cubic-bezier(0.4,0,0.2,1)] duration-400"
                >
                  Get an Estimate
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div className="relative pt-10 px-[8px]">
          <ul className="grid grid-cols-1 700:grid-cols-2 1280:grid-cols-4 gap-6 items-stretch">
            {process.map(({ label, description, icon }, index) => (
              <li
                key={index}
                className="group flex h-full w-full border-t border-l transition-colors border-black/25 hover:border-third"
              >
                <div className="flex items-start p-5 pr-0 pointer-events-none">
                  <span
                    className="uppercase font-bold 1280:text-4xl text-3xl text-third leading-none whitespace-nowrap transition-colors group-hover:text-third"
                    style={{
                      writingMode: "vertical-rl",
                      transform: "rotate(360deg)",
                    }}
                  >
                    {label}
                  </span>
                </div>

                <div className="flex flex-col grow-1 py-6 pl-6 pr-4 pointer-events-none">
                  <div className="flex justify-between">
                    <p className="font-bold text-4xl">
                      {index >= 9 ? "" : "0"}
                      {index + 1}
                    </p>
                    <div className="text-3xl group-hover:text-third transition-colors">
                      {icon}
                    </div>
                  </div>

                  <p className="mt-6 text-gray-700">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
