"use client";

import Hero from "@/components/Home/Hero";
import About from "@/components/Home/About";
import Expertises from "@/components/Home/Expertises";
import Process from "@/components/Home/Process";
import Reviews from "@/components/Home/Reviews";
import ServiceAreas from "@/components/ServiceAreas/ServiceAreas";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Expertises />
      <Reviews />
      <Process />
      <ServiceAreas />
    </>
  );
}
