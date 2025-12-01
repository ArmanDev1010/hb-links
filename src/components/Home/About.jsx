import React from "react";
import ParralaxImages from "../other/ParralaxImages";

import greenLine from "@/../public/patterns/line_green.png";
import Image from "next/image";

export default function About() {
  return (
    <div className="relative px-[5%] mt-3 py-10 pb-24 max-1280:pb-16 max-700:pb-14 max-550:pb-4">
      <div className="mb-[7vw]">
        <h2
          className="text-[3.5vw] tracking-[-0.035em] leading-[1.02] indent-[24vw] mb-16 pointer-events-none 
          max-800:text-[5vw] max-550:text-[6vw] max-550:mb-10 max-400:text-[7.5vw]"
        >
          We design and deliver low-voltage systems from structured cabling
          and access control to surveillance, AV, and intercom integration.
          Every solution is tailored, every wire intentional, and every project
          backed by deep technical expertise and clean execution.
        </h2>
      </div>
      <ParralaxImages />
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-cover bg-no-repeat opacity-30 max-700:hidden">
        <Image
          src={greenLine}
          fill
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
