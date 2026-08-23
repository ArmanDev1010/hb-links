import React from "react";

import Link from "next/link";

import { MdOutlineLocalPhone } from "react-icons/md";

export default function PhoneBtn({
  atTop,
  menuActive,
  isLightPage,
  dropdownOverlay,
}) {
  const forceWhite = dropdownOverlay || menuActive || (atTop && !isLightPage);

  return (
    <Link
      href={"tel:+1 (818) 303-3555"}
      className={`max-550:hidden group relative 700:px-6 px-5 max-1440:py-[0.8125rem] flex flex-col items-center justify-center border-2 rounded-md
        bg-transparent 700:text-[15px] text-sm font-semibold overflow-hidden transition duration-200 ${
          forceWhite ? "border-white" : "border-black"
        }`}
    >
      <div
        className={`relative overflow-hidden text-center ${forceWhite ? "text-white" : "text-black"}`}
      >
        <div className="group-hover:-translate-y-[110%] flex items-center gap-2.5 transition duration-300">
          <MdOutlineLocalPhone className="max-1280:hidden w-[20px] h-[20px]" />
          <div className="mt-[1px]">(818) 303-3555</div>
        </div>
        <div className="translate-y-[110%] group-hover:translate-y-0 absolute top-0 bottom-0 left-0 right-0 transition duration-300">
          <div className="mt-[1px]">(818) 303-3555</div>
        </div>
      </div>
    </Link>
  );
}
