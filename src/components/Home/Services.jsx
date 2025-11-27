"use client";

import React from "react";
import { services } from "@/data/services";
import Link from "next/link";

export default function Services() {
  return (
    <div className="pb-[40px] text-black max-550:pb-[30px]">
      <h3
        className="capitalize text-7xl mb-[55px] pointer-events-none px-[3%] max-900:text-[7.5vw] 
          max-700:mb-[50px] max-700:px-[5%] max-550:text-[9vw] max-400:text-[10vw] max-400:mb-[40px] text-black"
      >
        Our Expertise
      </h3>
      <div className="w-full flex flex-col items-center justify-center max-700:mb-0">
        {services.map(({ title, description, link }, key) => {
          return (
            <Link
              href={`./services/${
                link ? link : title?.toLowerCase().replace(/\s+/g, "-")
              }`}
              key={key}
              className="px-[5%] w-full border-t-[1px] border-t-[rgb(201,201,201)] last:border-b-[1px] last:border-b-[rgb(201,201,201)]"
            >
              <div
                className="group grid grid-cols-[1fr_1fr_auto] gap-7 w-full items-center py-[50px] cursor-pointer transition-all duration-200
                hover:opacity-50 max-1080:py-[35px] max-900:flex max-900:justify-between max-700:py-[40px]"
              >
                <h2
                  className="text-[35px] m-0 font-semibold text-[#222] whitespace-nowrap overflow-hidden text-ellipsis transition-all duration-[0.4s] group-hover:-translate-x-[10px] 
                  max-1080:text-[30px] max-700:text-[28px] max-550:text-[24px] max-400:text-[20px]"
                >
                  {title}
                </h2>
                <p className="w-[400px] max-1080:w-[350px] max-900:hidden">
                  {description}
                </p>
                <p className="transition-all duration-[0.4s] font-medium group-hover:translate-x-[10px]">
                  <svg
                    stroke="black"
                    fill="black"
                    strokeWidth="0"
                    viewBox="0 0 24 24"
                    className="pointer-events-none relative z-1 rotate-45 text-6xl text-black transition-all duration-[0.4s] ease-out group-hover:rotate-90
                    max-1080:text-5xl max-900:text-6xl max-550:text-5xl max-400:text-4xl"
                    height="0.6em"
                    width="0.6em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path fill="none" d="M0 0h24v24H0V0z"></path>
                    <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"></path>
                  </svg>
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
