import React from "react";

import Link from "next/link";
import Image from "next/image";

import whiteLine from "@/../public/patterns/line_white.png";

export default function Service({ title, bg_img, paragraph, tags }) {
  return (
    <div className="service sticky top-0 h-screen overflow-hidden flex">
      <div className="absolute z-[2] top-0 left-0 w-full h-full mx-auto text-white bg-transparent flex gap-3 p-3">
        <div className="relative w-1/2 bg-secondary rounded-l-[20px] overflow-hidden">
          <div className="absolute top-[55%] left-0 -translate-y-1/2 z-[4] px-[3%]">
            <h1 className="text-[5vw] font-[400] uppercase leading-[1.2] pointer-events-none mb-7">
              {title}
            </h1>
            <Link
              href={`./services/${title?.toLowerCase().replace(/\s+/g, "-")}`}
              prefetch
            >
              <button className="group bg-white py-[10px] px-[60px] text-base border rounded-full relative cursor-pointer overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed">
                <p className="relative text-center text-black top-0 group-hover:top-[-40px] transition-[top] duration-[.4s] ease-[cubic-bezier(.33,1,.68,1)]">
                  Learn more
                </p>
                <div className="w-full h-full absolute top-[110%] left-0 flex items-center justify-center group-hover:top-0 transition-[top] duration-[.4s] ease-[cubic-bezier(.33,1,.68,1)]">
                  <p className="absolute font-[500] text-white">Learn more</p>
                  <div className="bg-third w-[60%] h-full rounded-[50%] group-hover:w-full group-hover:rounded-[100px] transition-all duration-[.4s] ease-[cubic-bezier(.33,1,.68,1)]" />
                </div>
              </button>
            </Link>
            <ul className="mt-16 flex flex-wrap justify-center gap-x-[5rem] gap-y-[2rem] pointer-events-none">
              {tags?.map((text, key) => (
                <li key={key} className="flex items-center gap-5">
                  <p className="bg-third min-w-3 min-h-3"></p>
                  <p className="text-base">{text}</p>
                </li>
              ))}
            </ul>
          </div>
          <p className="absolute top-5 right-0 px-[3%] text-base w-[400px] pointer-events-none text-white/70">
            {paragraph}
          </p>
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-cover bg-no-repeat opacity-10 z-[0]">
            <Image
              src={whiteLine}
              layout="fill"
              objectFit="cover"
              quality={100}
              alt=""
            />
          </div>
        </div>
        <div className="relative w-1/2 bg-primary rounded-r-[20px] overflow-hidden">
          <Image
            src={bg_img}
            fill={true}
            alt="background image"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
