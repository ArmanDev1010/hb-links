import React from "react";
import Image from "next/image";
import TextFill from "@/components/other/TextFill";

export default function Intro({ title, description, bg_img, bg_img_page }) {
  return (
    <div className="relative">
      <div className="relative w-full h-[80vh] px-[5%]">
        <div className="absolute inset-0 brightness-[40%] bg-secondary">
          <Image
            src={bg_img_page ? bg_img_page : bg_img}
            fill={true}
            alt="background image"
            priority={true}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-[1] flex flex-col items-center justify-center h-full pointer-events-none">
          <h1 className="text-white text-[7.5vw] leading-[1.2] w-full text-center uppercase">
            <TextFill title={title} />
          </h1>
        </div>
      </div>
      <div className="px-[5%] mt-10">
        <h2 className="text-[4vw] tracking-[-0.035em] leading-[1.02] indent-[24vw] mb-[7vw] pointer-events-none">
          {description}
        </h2>
      </div>
    </div>
  );
}
