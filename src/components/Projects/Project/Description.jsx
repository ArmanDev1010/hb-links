import React from "react";
import Image from "next/image";

import greenLine from "@/../public/patterns/line_green.png";

export default function Description({
  description,
  images,
  scope,
  infastructure,
  categories,
}) {
  return (
    <div className="relative">
      <div className="relative">
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
        <div className="px-[7%] mt-10 flex flex-col items-center">
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
        <div className="grid grid-cols-2 gap-3 px-[5%] max-700:grid-cols-1 my-14">
          {images?.map((image, key) => (
            <Image
              src={image}
              key={key}
              alt=""
              width={800}
              height={800}
              className="bg-gray-500 aspect-[16/16] w-full h-full object-cover"
            />
          ))}
        </div>
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
      <div className="relative my-10 px-[7%] mb-24">
        <div className="relative pointer-events-none mb-16">
          <p className="mb-7 text-lg text-gray-400 font-[300] border rounded-full w-fit px-5">
            Scope of Work
          </p>
          <ul className="grid gap-y-[2rem] gap-x-[4.5rem] grid-cols-2 max-550:grid-cols-1">
            {scope?.map((text, key) => (
              <li key={key} className="relative flex items-center gap-5">
                <p className="bg-third min-w-3 min-h-3"></p>
                <p className="text-lg max-700:text-base">{text}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-center items-center flex-col">
          <p className="mb-7 text-3xl w-fit px-5 max-700:text-2xl">
            Infrastructure
          </p>
          <ul className="flex flex-wrap justify-center gap-x-[5rem] gap-y-[2rem] w-full">
            {infastructure?.map(({ name, number }, key) => (
              <li
                key={key}
                className="w-[220px] flex flex-col items-center justify-between border-[1px] border-black/10 rounded-[10px] p-3"
              >
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-[150px] h-[150px] flex items-center justify-center max-550:w-[120px] max-550:h-[120px]">
                    <Image
                      src={`/infastructure/${name
                        .toLowerCase()
                        .replace(/\s+/g, "-")}.png`}
                      alt={name.toLowerCase().replace(/\s+/g, "-")}
                      width={150}
                      height={150}
                      className="object-contain w-full h-full"
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center text-center gap-2 mt-4">
                  <p className="text-sm font-semibold bg-third/20 py-1 px-2 border-2 border-third">
                    {number}
                  </p>
                  <p className="text-black/70">{name}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
