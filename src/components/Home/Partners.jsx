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
    <div className="mb-24 max-1280:mb-16 max-700:mb-20">
      <div className="px-[5%] mb-7 text-center">
        <h3
          className="text-[4.5vw] font-[500] pointer-events-none 
        max-1280:text-[6vw] max-900:text-[7.5vw] max-550:text-[10vw] max-400:text-[11.5vw]"
        >
          Partners
        </h3>
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
