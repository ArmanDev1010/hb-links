import React from "react";

import greenLine from "@/../public/patterns/line_green.png";
import Image from "next/image";
import ScrollParallax from "@/components/other/ScrollParallax";
import BackgroundParallax from "@/components/other/BackgroundParallax";

export default function Intro({
  title,
  description,
  deliverables,
  images,
  page_image,
}) {
  return (
    <div className="relative">
      <div className="relative flex justify-between gap-10 pointer-events-none px-[5%] w-full pt-[150px] pb-14 max-1280:pb-10 max-900:flex-col max-900:pt-[130px]">
        <h1
          className="flex-1 text-[6.5vw] leading-[1.2] uppercase 
        max-1280:text-[7vw] max-900:text-[7.5vw] max-700:text-[9vw] max-550:text-[11.5vw] max-400:text-[12vw]"
        >
          {title}
        </h1>
        <h2
          className="w-[45%] self-end text-[2vw] tracking-[-0.035em] leading-[1.1] indent-32 max-1440:indent-0 max-1440:text-right max-1280:w-[40%]
         max-900:text-[2.5vw] max-900:w-1/2 max-700:text-[3vw] max-700:w-[70%] max-550:text-[4vw] max-550:w-full max-400:text-[5vw]"
        >
          {description}
        </h2>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-cover bg-no-repeat bg-center opacity-30 z-[-1]">
          <Image src={greenLine} layout="fill" objectFit="cover" alt="" />
        </div>
      </div>
      <BackgroundParallax page_image={page_image} />
      <div className="mb-[7vw] mt-14 max-1080:mb-24 max-700:mb-20 max-550:mt-12 max-550:mb-16">
        <div className="px-[5%] flex flex-col items-center pointer-events-none">
          <p className="mb-12 text-lg text-gray-400 font-[300] border rounded-full w-fit px-5 max-700:mb-8">
            What We Deliver
          </p>
          <ul className="grid gap-y-[2rem] gap-x-[5rem] grid-cols-3 max-1080:grid-cols-2 max-700:gap-x-[3rem] max-550:grid-cols-1">
            {deliverables?.map((text, key) => (
              <li key={key} className="relative flex items-center gap-5">
                <p className="bg-third min-w-3 min-h-3"></p>
                <p className="text-lg max-700:text-base">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
