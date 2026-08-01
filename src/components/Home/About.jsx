import React from "react";
import Link from "next/link";

export default function About() {
  return (
    <div className="mt-3 py-10 pb-[40px] text-black max-550:pb-[30px]">
      <div className="w-full lg:w-10/12 lg:mx-auto px-2 text-center">
        <p className="ck-tagline text-sm uppercase font-xbold tracking-widest mb-4 pointer-events-none">
          ABOUT US
        </p>
        <h2 className="font-gt pb-1 font-semibold text-4xl 1080:text-5xl leading-[1] pointer-events-none">
          Smart Infrastructure.{" "}
          <span style={{ color: "#106b37" }}>Reliable Solutions.</span>
        </h2>
        <p className="mt-8 text-gray-700 only:mt-0 lg:mx-auto lg:max-w-2xl pointer-events-none">
          HB Links is a general contracting company based in Los Angeles,
          providing renovation, electrical, plumbing, and low-voltage services
          under one roof. Holding B (General Building), C-10 (Electrical), and
          C-36 (Plumbing) licenses, we're equipped to handle every trade a
          project needs, from full home renovations and additions to standalone
          electrical and plumbing work.
        </p>
        {/* <Link
          href="/about"
          prefetch
          className="relative uppercase font-bold text-lg hover:text-third transition-all duration-500 ease-in-out
          before:content-[''] before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-full before:bg-[#0d0c0c] hover:before:bg-third"
        >
          <span className="relative">About HB Links</span>
        </Link> */}
      </div>
    </div>
  );
}
