"use client";
import { useState } from "react";

import { IoChatboxEllipsesOutline } from "react-icons/io5";

export default function ContactPanel() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Slide-in Panel */}
      <div
        className={`fixed top-1/2 -translate-y-1/2 right-0 w-[400px] h-[535px] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.08),0_2px_12px_rgba(0,0,0,0.06)] 
          rounded-tl-lg rounded-bl-lg z-[998] transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-xl cursor-pointer text-gray-500 transition ease duration-200 hover:text-black font-bold"
        >
          ✕
        </button>
      </div>

      {/* Vertical Tab — Smooth Transition */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-1/2 z-[998] transform -translate-y-1/2 rotate-180 flex items-center gap-4 bg-third text-white cursor-pointer px-4 py-3
   rounded-tr-lg rounded-br-lg shadow-[0_2px_4px_rgba(0,0,0,0.08),0_2px_12px_rgba(0,0,0,0.06)] outline-none"
        style={{
          writingMode: "vertical-rl",
          textOrientation: "mixed",
          transition: "right 300ms ease",
          right: open ? "400px" : "0px",
        }}
      >
        <IoChatboxEllipsesOutline className="text-2xl rotate-180" />
        <p>Consultation</p>
      </button>
    </>
  );
}
