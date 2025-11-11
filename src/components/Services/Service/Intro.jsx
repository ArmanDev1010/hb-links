import React from "react";
import Image from "next/image";
import TextFill from "@/components/other/TextFill";

export default function Intro({ title, description, bg_img, bg_img_page }) {
  return (
    <div className="relative">
      <div className="relative w-full h-[90vh] px-[5%] max-550:h-[70vh]">
        <div className="absolute inset-0 brightness-[40%] bg-secondary">
          <Image
            src={bg_img_page ? bg_img_page : bg_img}
            fill={true}
            alt="background image"
            priority={true}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-[1] flex flex-col items-center justify-center h-full pointer-events-none text-white text-center uppercase">
          <h1 className="text-[7.5vw] leading-[1.2] w-full max-550:hidden">
            <TextFill title={title} />
          </h1>
          <h1 className="550:hidden text-[12vw] leading-[1.2] w-full">
            {title}
          </h1>
        </div>
      </div>
      <div className="px-[5%] mt-10 max-550:mt-5">
        <h2
          className="text-[4.4vw] tracking-[-0.035em] leading-[1.1] indent-[24vw] mb-[7vw] pointer-events-none 
         max-1080:mb-24 max-900:text-[5vw] max-900:leading-[1.2] max-700:mb-20 max-700:text-3xl max-550:text-right max-550:mb-16 max-400:text-2xl"
        >
          {description}
        </h2>
      </div>
    </div>
  );
}
