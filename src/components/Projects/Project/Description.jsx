import React from "react";
import Image from "next/image";

import greenLine from "@/../public/patterns/line_green.png";
import greenLine_2 from "@/../public/patterns/line_green_2.png";

export default function Description({
  description,
  images,
  videos,
  scope,
  infastructure,
  categories,
}) {
  const firstVideo = videos?.[0];

  return (
    <div className="relative">
      <div className="relative">
        <div className="grid gap-x-[4.5rem] gap-y-[1rem] grid-cols-[1fr_2fr] my-10 px-[7%]">
          <div className=""></div>
          <div className="relative pointer-events-none">
            <p className="mb-5 text-lg text-gray-400 font-[300] border rounded-full w-fit px-5">
              Overview
            </p>
            <p className="text-[1.5rem] leading-[1.4]">{description}</p>
          </div>
        </div>
        <div className="mx-auto w-[70%] h-[1px] bg-gray-300"></div>
        <div className="px-[7%] my-10 flex flex-col items-center">
          <p className="mb-10 text-xl border rounded-full w-fit px-7 py-1">
            Services Provided
          </p>
          <ul className="flex flex-wrap justify-center gap-x-[5rem] gap-y-[2rem]">
            {categories?.map((text, key) => (
              <li key={key} className="flex items-center gap-5">
                <p className="bg-third min-w-3 min-h-3"></p>
                <p className="text-xl">{text}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-center">
          <video
            src={firstVideo}
            autoPlay
            muted
            loop
            playsInline
            className="w-[80%] h-full object-cover rounded-[15px]"
          />
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
      <div className="relative my-10 px-[7%]">
        <div className="relative pointer-events-none mb-16">
          <p className="mb-7 text-lg text-gray-400 font-[300] border rounded-full w-fit px-5">
            Scope of Work
          </p>
          <ul className="grid gap-y-[2rem] gap-x-[4.5rem] grid-cols-2">
            {scope?.map((text, key) => (
              <li key={key} className="relative flex items-center gap-5">
                <p className="bg-third min-w-3 min-h-3"></p>
                <p className="text-lg">{text}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-center items-center flex-col">
          <p className="mb-7 text-3xl w-fit px-5">Infastructure</p>
          <ul className="grid gap-x-[5rem] gap-y-[2rem] grid-cols-3">
            {infastructure?.map(({ name, number }, key) => (
              <li
                key={key}
                className="relative flex items-center flex-col gap-5 border-[1px] border-black/10 rounded-[10px] p-3"
              >
                <Image
                  src={`/infastructure/${name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}.png`}
                  alt={name.toLowerCase().replace(/\s+/g, "-")}
                  width={150}
                  height={150}
                  className="w-[150px] h-[150px]"
                />
                <div className="flex flex-col items-center gap-2">
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
      <div className="relative grid grid-cols-2 gap-3 px-[5%] max-700:grid-cols-1 mt-10 mb-14">
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
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-cover bg-no-repeat opacity-30 z-[-1]">
          <Image
            src={greenLine_2}
            layout="fill"
            objectFit="cover"
            quality={100}
            alt=""
          />
        </div>
      </div>
    </div>
  );
}
