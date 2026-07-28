import React from "react";

export default function MenuBtn({
  setMenuActive,
  menuActive,
  atTop,
  isLightPage,
}) {
  return (
    <button
      className="1080:hidden relative z-[100] p-[15px] cursor-pointer"
      onClick={() => setMenuActive(!menuActive)}
    >
      <div className="relative w-[40px] h-[20px] max-550:w-[30px] max-550:h-[15px]">
        <div
          className={`w-full h-[1.5px] absolute left-0 top-0 transition-all ease-[cubic-bezier(0.4,0,0.2,1)] duration-200 max-550:h-[1.7px]
            ${menuActive ? "-rotate-45 translate-y-2 !bg-white max-550:translate-y-1" : ""} ${atTop && !isLightPage ? "bg-white" : "bg-black"}`}
        ></div>
        <div
          className={`w-[75%] h-[1.5px] absolute top-1/2 -translate-y-1/2 right-0 transition-opacity ease-[cubic-bezier(0.4,0,0.2,1)] duration-200
            ${menuActive ? "opacity-0 !bg-white" : ""} ${atTop && !isLightPage ? "bg-white" : "bg-black"}`}
        ></div>
        <div
          className={`w-full h-[1.8px] absolute left-0 bottom-0 transition-all ease-[cubic-bezier(0.4,0,0.2,1)] duration-200
            ${menuActive ? "rotate-45 -translate-y-2.5 !bg-white" : ""} ${atTop && !isLightPage ? "bg-white" : "bg-black"}`}
        ></div>
      </div>
    </button>
  );
}
