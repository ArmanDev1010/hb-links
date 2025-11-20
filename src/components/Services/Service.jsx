import React from "react";

import Link from "next/link";
import Image from "next/image";

export default function Service({ title, page_image, description, link }) {
  return (
    <div className="service sticky top-0 overflow-hidden bg-primary text-white h-[85vh] max-900:h-fit">
      <div className="absolute top-0 h-2 w-full bg-third z-1"></div>
      <div className="w-full h-full flex gap-10 max-550:border-t-4 max-550:border-t-third">
        <div className="flex-1 relative max-900:hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-secondary mb-10 brightness-[70%]">
            <Image
              src={page_image}
              fill={true}
              alt=""
              className="w-full h-full object-cover filter grayscale"
            />
          </div>
        </div>
        <div className="relative z-[1] w-[45%] pr-[5%] pt-10 pb-24 max-900:w-full max-900:px-[5%] max-550:pt-7 max-550:pb-20">
          <div className="flex flex-col justify-between mt-10 gap-10 w-full max-w-[800px] max-900:flex-col max-900:gap-0 max-700:gap-5">
            <h1
              className="text-6xl font-[400] uppercase leading-[1.2] pointer-events-none mb-7 max-1280:text-[4.5vw] 
          max-900:text-5xl max-900:mb-10 max-700:text-[7vw] max-700:leading-[1.4] max-550:text-[8.5vw] max-400:text-[12vw] max-400:leading-[1.2] max-400:mb-4"
            >
              {title}
            </h1>
            <p className="text-lg max-w-[400px] w-full pointer-events-none max-1080:text-base max-900:mb-7 max-400:text-sm">
              {description}
            </p>
            <Link
              href={`./services/${
                link ? link : title?.toLowerCase().replace(/\s+/g, "-")
              }`}
              prefetch
            >
              <button
                className="group bg-white py-[10px] min-w-[220px] text-lg font-[500] border rounded-full relative cursor-pointer overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed
              max-900:text-base max-900:min-w-[200px] max-400:py-[5px]"
              >
                <p className="relative text-center text-black top-0 group-hover:top-[-40px] transition-[top] duration-[.4s] ease-[cubic-bezier(.33,1,.68,1)]">
                  Learn more
                </p>
                <div className="w-full h-full absolute top-[110%] left-0 flex items-center justify-center group-hover:top-0 transition-[top] duration-[.4s] ease-[cubic-bezier(.33,1,.68,1)]">
                  <p className="absolute text-white">Learn more</p>
                  <div className="bg-third w-[60%] h-full rounded-[50%] group-hover:w-full group-hover:rounded-[100px] transition-all duration-[.4s] ease-[cubic-bezier(.33,1,.68,1)]" />
                </div>
              </button>
            </Link>
          </div>
        </div>
        <div className="900:hidden absolute top-0 left-0 w-full h-full bg-secondary mb-10 brightness-[30%]">
          <Image
            src={page_image}
            fill={true}
            alt=""
            className="w-full h-full object-cover filter grayscale"
          />
        </div>
      </div>
    </div>
  );
}
