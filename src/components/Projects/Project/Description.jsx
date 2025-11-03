import React from "react";
import Image from "next/image";

import greenLine from "@/../public/patterns/line_green.png";
import greenLine_2 from "@/../public/patterns/line_green_2.png";

import { RiDoubleQuotesL } from "react-icons/ri";

export default function Description({
  description,
  images,
  videos,
  scope,
  infastructure,
  why_us,
}) {
  const gridImages = images?.slice(0, -1);
  const lastImage = images?.[images.length - 1];

  const firstVideo = videos?.[0];
  const lastVideo = videos?.[1];

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
      <div className="grid grid-cols-2 gap-3 px-[5%] max-700:grid-cols-1 my-10">
        {gridImages?.map((image, key) => (
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
      <div className="relative mb-10">
        <div className="mx-auto w-[60%] mb-10">
          <p className="mb-7 text-lg text-gray-400 font-[300] border rounded-full w-fit px-5">
            Why <span className="text-third font-[500]">HB LINKS</span>
          </p>
          <div className="text-lg font-[300] flex flex-col gap-7">
            {why_us?.map((text, key) => (
              <p key={key}>{text}</p>
            ))}
          </div>
        </div>
        <div className="flex justify-center gap-3 mx-auto w-[80%] h-[500px]">
          <Image
            src={lastImage}
            alt=""
            width={800}
            height={800}
            className="bg-gray-500 w-[60%] h-full object-cover"
          />
          <video
            src={lastVideo}
            autoPlay
            muted
            loop
            playsInline
            className="w-[40%] h-full object-cover"
          />
        </div>
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
      <div className="mx-auto w-[60%] mb-12">
        <div className="relative flex items-center flex-col gap-5 w-[75%] mx-auto bg-gray-100 text-center font-[300] py-5 px-14">
          <p>
            With UniFi, we’ve delivered stability, compliance, and built a
            network ready for future growth.
          </p>
          <p className="text-sm font-[500] text-gray-400">
            Sean Graham of MacGuru Consulting
          </p>
          <RiDoubleQuotesL className="absolute -top-4 -left-5 text-4xl text-gray-400" />
          <RiDoubleQuotesL className="absolute -bottom-4 -right-5 text-4xl text-gray-400 rotate-180" />
        </div>
      </div>
    </div>
  );
}
