import React from "react";
import Image from "next/image";

import greenLine from "@/../public/patterns/line_green.png";
import ImageCols from "@/components/other/ImageCols";

export default function Description({
  description,
  images,
  page_images,
  categories,
}) {
  const images_array = page_images ? page_images : images;
  return (
    <div className="relative mb-10">
      <div className="grid gap-x-[4.5rem] gap-y-[1rem] grid-cols-[1fr_2fr] my-10 px-[7%] max-1080:grid-cols-1">
        <div className="max-1080:hidden"></div>
        <div className="pointer-events-none">
          <p className="mb-5 text-lg text-gray-400 font-[300] border rounded-full w-fit px-5 max-550:text-base">
            Overview
          </p>
          <p className="text-[1.5rem] leading-[1.4] max-700:text-[1.3rem] max-550:text-[1.1rem] max-400:text-[1rem]">
            {description}
          </p>
        </div>
      </div>
      <div className="mx-auto w-[70%] h-[1px] bg-gray-300 max-700:w-full"></div>
      <div className="px-[7%] mt-10 mb-14 flex flex-col items-center">
        <p className="mb-10 text-xl border rounded-full w-fit px-7 py-1 max-700:text-lg">
          Services Provided
        </p>
        <ul className="flex flex-wrap justify-center gap-x-[5rem] gap-y-[2rem]">
          {categories?.map((text, key) => (
            <li key={key} className="flex items-center gap-5">
              <p className="bg-third min-w-3 min-h-3"></p>
              <p className="text-xl max-700:text-lg">{text}</p>
            </li>
          ))}
        </ul>
      </div>
      <ImageCols images_array={images_array} />
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-cover bg-no-repeat opacity-30 z-[-1]">
        <Image
          src={greenLine}
          layout="fill"
          objectFit="cover"
          quality={100}
          alt=""
        />
      </div>
    </div>
  );
}
