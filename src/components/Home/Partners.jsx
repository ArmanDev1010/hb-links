import React from "react";

import firstImage from "@/../public/partners/adi.png";
import secondImage from "@/../public/partners/koa.png";
import thirdImage from "@/../public/partners/axis.png";
import fourthImage from "@/../public/partners/salient.png";

import Image from "next/image";
import Link from "next/link";

export default function Partners() {
  const images_array = [firstImage, secondImage, thirdImage, fourthImage];

  return (
    <div className="mb-24 max-1280:mb-16 max-700:mb-14">
      <div className="px-[5%] mb-12">
        <h3
          className="text-[4.5vw] font-[500] pointer-events-none mb-7 
        max-1280:text-[6vw] max-900:text-[7.5vw] max-550:text-[10vw] max-400:text-[11.5vw]"
        >
          Partners
        </h3>
        <Link href={"/contact"} className="w-fit cursor-pointer">
          <p
            className="relative text-lg uppercase font-[600] cursor-pointer w-fit !pointer-events-auto inline-block pl-4 ml-[1px] text-lg cursor-pointer font-[500] hover:pl-[64px]
              max-1080:text-[17px]
              before:content-[''] before:block before:absolute before:top-1/2 before:left-0 before:h-[1px] before:w-[8px] before:-translate-y-1/2 before:bg-black
              after:content-[''] after:block after:absolute after:top-1/2 after:left-[calc(100%+9px)] after:h-[1px] after:w-[56px] after:-translate-y-1/2 after:bg-black
              hover:after:w-[8px] hover:before:w-[56px] before:transition-[width_0.5s_ease] before:duration-[0.5s] after:transition-[width_0.5s_ease] after:duration-[0.5s]"
            style={{
              transition:
                "padding-left .5s ease, right .5s ease, opacity .5s ease",
            }}
          >
            Become Our Partner
          </p>
        </Link>
      </div>
      <div className="border-y-1 border-black/10 max-700:border-y-0 max-700:border-b-1 max-700:border-b-black/10">
        <div className="px-[5%] grid justify-center items-center grid-cols-4 max-700:grid-cols-2 max-700:px-0">
          {images_array.map((image, key) => (
            <div
              className="border-r-1 border-black/10 last:border-r-0 h-full relative flex justify-center max-700:border-r-0
              max-700:border-t-1 max-700:border-t-black/10"
              key={key}
            >
              <Image
                src={image}
                alt="background image"
                className="w-[125px] h-auto object-contain filter grayscale 
                max-1080:w-[100px] max-700:h-[100px] max-550:w-[85px]"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
