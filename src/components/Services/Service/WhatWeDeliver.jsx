import Link from "next/link";
import React from "react";

export default function WhatWeDeliver({ deliverables }) {
  return (
    <div className="my-[50px] max-550:mt-[20px]">
      <p
        className="uppercase px-[5%] text-5xl text-white font-[600] border-b-[1px] border-b-white/50 pb-5 w-full pointer-events-none
      max-900:text-4xl max-700:text-3xl max-550:text-2xl"
      >
        What we Deliver
      </p>
      <div className="flex flex-col items-end mb-[50px] max-550:mb-[40px]">
        <ul className="w-[70%] pointer-events-none max-700:w-[80%] max-550:w-full">
          {deliverables.map((text, key) => (
            <li
              key={key}
              className="py-4 pr-[5%] border-t-[1px] border-t-white/50 flex first:border-t-0 text-lg max-900:text-base max-550:px-[5%] max-550:text-[15px]"
            >
              <span>0{key + 1}</span>
              <span className="ml-16 max-550:ml-8 max-400:ml-6">{text}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-center">
        <Link href={"/contact"}>
          <button className="group text-4xl font-[600] flex gap-2 cursor-pointer max-900:text-3xl max-550:text-2xl max-400:text-xl">
            <span>(</span>
            <div className="relative overflow-hidden">
              <div className="group-hover:translate-y-[-110%] transition duration-300">
                Learn more
              </div>
              <div className="translate-y-[110%] group-hover:translate-y-[0%] transition duration-300 absolute top-0 bottom-0 left-0 right-0">
                Learn more
              </div>
            </div>
            <span>)</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
