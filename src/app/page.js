"use client";

import About from "@/components/Home/About";
import Partners from "@/components/Home/Partners";
import Projects from "@/components/Home/Projects";
import Services from "@/components/Home/Services";
import Slides from "@/components/Home/Slides/Slides";

import greenLine from "@/../public/patterns/line_green.png";
import Image from "next/image";

export default function HomePage() {
  return (
    <>
      <Slides />
      <About />
      <Partners />
      <div className="absolute top-[230%] z-[-1] left-0 w-full h-[150vh] pointer-events-none bg-cover bg-no-repeat opacity-15 max-700:hidden">
        <Image
          src={greenLine}
          fill
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <Services />
      <Projects />
    </>
  );
}
