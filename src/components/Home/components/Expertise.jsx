import Link from "next/link";
import React from "react";

export default function Expertise({ text, reverse }) {
  let { title, href, paragraph, image } = text;

  return (
    <div
      className={`flex flex-wrap w-full h-full py-10 ${
        reverse ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <div className="w-full lg:w-1/2 px-2">
        <div
          className={`w-full h-full flex flex-col border-black/25 pt-10 pl-6 lg:pl-10 border-t ${
            reverse ? "border-r" : "border-l"
          }`}
        >
          <div className="flex flex-col justify-between flex-grow pointer-events-none">
            <h1 className="pb-1 font-bold text-3xl 400:text-4xl lg:text-5xl leading-[1.2] lg:max-w-md mb-12 lg:mb-auto">
              {title}
            </h1>
            <p className="lg:mt-12 lg:pr-30 max-w-xl text-gray-700">
              {paragraph}
            </p>
          </div>
          <Link href={href}>
            <div
              className="mt-10 w-fit border-[1.5px] px-[1.5rem] py-[0.75rem] text-[1rem] font-[500] uppercase tracking-[0.1em] 
              hover:bg-third hover:text-white transition-all ease-[cubic-bezier(0.4,0,0.2,1)] duration-400"
            >
              Our Approach
            </div>
          </Link>
        </div>
      </div>
      <div className="w-full min-h-[480px] lg:min-h-[500px] mt-10 lg:mt-0 lg:w-1/2">
        <div className="relative w-full h-full px-2">
          <div className="relative w-full h-full">
            <div
              className="w-full h-full overflow-hidden bg-black"
              style={{
                backgroundImage: `url(${image})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
