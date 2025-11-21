import React from "react";

import Link from "next/link";
import Image from "next/image";

export default function Service({ title, page_image, description, link }) {
  return (
    <div className="service sticky top-0 overflow-hidden bg-primary text-white h-screen max-900:h-[75vh]">
      <div className="absolute top-0 h-[5px] w-full bg-third z-1"></div>

      <div className="flex flex-col justify-center w-full h-full max-900:py-24">
        <div className="relative px-[5%]">
          <h1
            className="text-7xl font-[400] uppercase leading-[1.2] pointer-events-none mb-7 max-1280:text-[6vw] 
          max-900:text-5xl max-900:mb-10 max-700:text-[7vw] max-700:leading-[1.4] max-550:text-[9vw] max-550:mb-7 max-400:text-[12vw] max-400:leading-[1.2]"
          >
            {title}
          </h1>
          <p className="text-lg max-w-[400px] w-full mb-7 pointer-events-none max-1080:text-base max-900:mb-7 max-550:text-[15px]">
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
              max-900:text-base max-900:min-w-[200px] max-400:py-[7px]"
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

      <div className="absolute z-[-1] top-0 left-0 w-full h-full bg-secondary mb-10 brightness-[20%]">
        <Image
          src={page_image}
          fill={true}
          alt=""
          className="w-full h-full object-cover filter grayscale"
        />
      </div>
    </div>
  );
}
