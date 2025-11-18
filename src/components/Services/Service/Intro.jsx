import React from "react";
import TextFill from "@/components/other/TextFill";

import greenLine from "@/../public/patterns/line_green.png";
import Image from "next/image";

export default function Intro({
  title,
  description,
  background_image,
  deliverables,
}) {
  return (
    <div className="relative">
      <div className="relative px-[5%] w-full pt-[150px] max-700:pt-[130px]">
        <div className="relative z-[1] flex flex-col items-center justify-center h-full pointer-events-none uppercase">
          <h1 className="text-[7.5vw] leading-[1.2] w-full max-700:hidden">
            <TextFill title={title} />
          </h1>
          <h1 className="700:hidden text-[12vw] leading-[1.2] w-full max-400:text-[13.5vw]">
            {title}
          </h1>
        </div>
      </div>
      <div className="mb-[7vw] mt-24 max-1080:mb-24 max-700:mb-20 max-550:!my-16">
        <h2
          className="px-[5%] text-[4vw] tracking-[-0.035em] leading-[1.1] indent-[24vw] mb-[5vw] pointer-events-none 
         max-900:text-[5vw] max-900:leading-[1.2] max-900:mb-12 max-700:text-3xl max-550:text-[6vw] max-550:mb-16 max-550:text-right max-400:indent-[0] max-400:text-2xl"
        >
          {description}
        </h2>
        <div className="relative h-[75vh] bg-primary mb-[5vw] max-900:mb-12 max-550:mb-16">
          {/* <Image
              src={bg_img}
              fill={true}
              alt=""
              className="w-full h-full object-cover"
            /> */}
        </div>
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
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-cover bg-no-repeat bg-center opacity-30 z-[-1]">
        <Image src={greenLine} layout="fill" objectFit="cover" alt="" />
      </div>
    </div>
  );
}
