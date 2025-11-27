"use client";

import About from "@/components/Home/About";
import Partners from "@/components/Home/Partners";
import Projects from "@/components/Home/Projects";
import Services from "@/components/Home/Services";
import Slides from "@/components/Home/Slides/Slides";

export default function HomePage() {
  return (
    <>
      <Slides />
      <About />
      <Partners />
      <Services />
      <Projects />
    </>
  );
}
