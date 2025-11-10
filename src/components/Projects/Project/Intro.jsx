"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Intro({ title, bg_img, video, details }) {
  const wrapper = useRef(null);
  const background = useRef(null);
  const introImage = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper.current,
          scrub: true,
          start: "top top",
          end: "+=500px",
        },
      });

      timeline
        .from(background.current, { clipPath: `inset(15%)` })
        .to(introImage.current, { height: "200px" }, 0);
    }, wrapper);

    const raf = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      ctx.revert();
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return (
    <div ref={wrapper} className="relative w-full h-[110vh]">
      <div className="absolute inset-0 brightness-[60%] -z-10" ref={background}>
        {bg_img ? (
          <Image
            src={bg_img}
            fill={true}
            alt="background image"
            priority={true}
            className="object-cover"
          />
        ) : (
          <video
            src={video}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div
        ref={introImage}
        className="flex flex-col items-center justify-center h-full pointer-events-none"
      >
        <h1 className="text-white text-[4.5vw] w-[60%] text-center uppercase border-b border-b-white mb-[2rem]">
          {title}
        </h1>
        <ul className="flex gap-y-[1rem] gap-x-[4.5rem] grid-cols-[repeat(4,max-content)] text-white">
          {details?.map(({ value }, key) => (
            <li key={key}>
              <p className="text-xl">{value}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
