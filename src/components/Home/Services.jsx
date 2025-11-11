"use client";

import React from "react";
import { services } from "@/data/services";
import Link from "next/link";

export default function Services() {
  return (
    <div className="flex items-center px-[5%] py-[40px] flex-col bg-white text-black max-1280:px-[64px] max-700:px-0 max-550:pb-[30px]">
      <div className="w-full flex flex-col items-center justify-center max-700:mb-0">
        {services.map(({ title, link }, key) => {
          return (
            <Link
              href={`./services/${
                link ? link : title?.toLowerCase().replace(/\s+/g, "-")
              }`}
              key={key}
              className="w-full border-t-[1px] border-t-[rgb(201,201,201)] last:border-b-[1px] last:border-b-[rgb(201,201,201)] max-700:px-[5%]"
            >
              <div
                className="group flex w-full justify-between items-center py-[50px] px-[100px] cursor-pointer transition-all duration-200
                hover:opacity-50 max-1600:px-[70px] max-900:px-[50px] max-700:py-[40px] max-550:px-[10px]"
              >
                <h2
                  className="text-[35px] m-0 font-semibold text-[#222] whitespace-nowrap overflow-hidden text-ellipsis 
                  transition-all duration-[0.4s] group-hover:-translate-x-[10px] 
                  max-900:text-[35px] max-700:text-[28px] max-550:text-[24px] max-400:text-[20px]"
                >
                  {title}
                </h2>
                <p className="transition-all duration-[0.4s] font-medium group-hover:translate-x-[10px] pl-[20px]">
                  <svg
                    stroke="black"
                    fill="black"
                    strokeWidth="0"
                    viewBox="0 0 24 24"
                    className="pointer-events-none relative z-1 rotate-45 text-6xl text-black transition-all duration-[0.4s] ease-out group-hover:rotate-90
                    max-700:text-6xl max-550:text-5xl max-400:text-4xl"
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
