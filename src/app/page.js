"use client";

import About from "@/components/Home/About";
import Projects from "@/components/Home/Projects";
import Services from "@/components/Home/Services";
import Slides from "@/components/Home/Slides/Slides";

export default function HomePage() {
  return (
    <>
      <Slides />
      <About />
      <Services />
      <Projects />
    </>
  );
}
