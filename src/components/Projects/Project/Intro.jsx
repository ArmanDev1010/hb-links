"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Intro({ title, bg_img, details }) {
  const wrapper = useRef(null);
  const background = useRef(null);
  const introImage = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (window.innerWidth >= 800) {
      const ctx = gsap.context(() => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper.current,
            scrub: true,
            start: "top top",
            end: "+=500px",
          },
        });

        timeline
          .from(background.current, { clipPath: `inset(12%)` })
          .to(introImage.current, { height: "200px" }, 0);
      }, wrapper);

      const raf = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });

      return () => {
        ctx.revert();
        cancelAnimationFrame(raf);
      };
    }
  }, [pathname]);

  return (
    <div ref={wrapper} className="relative w-full h-[110vh] max-800:h-screen">
      <div
        className="absolute inset-0 brightness-[60%] -z-10 max-800:w-full max-800:h-full"
        ref={background}
      >
        <Image
          src={bg_img}
          fill={true}
          alt="background image"
          priority={true}
          className="object-cover"
        />
      </div>
      <div
        ref={introImage}
        className="flex flex-col items-center justify-center h-full pointer-events-none max-550:px-[3%]"
      >
        <h1
          className="text-white text-[4.5vw] w-[60%] text-center uppercase border-b border-b-white mb-[2rem] 
        max-800:text-[7vw] max-800:w-[80%] max-700:w-full max-400:text-[8vw]"
        >
          {title}
        </h1>
        <ul className="flex flex-wrap justify-center gap-y-[1rem] gap-x-[4.5rem] grid-cols-[repeat(4,max-content)] text-white max-550:gap-x-[3rem]">
          {details?.map(({ value }, key) => (
            <li key={key}>
              <p className="text-xl max-700:text-lg max-550:text-base max-400:text-sm">
                {value}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
