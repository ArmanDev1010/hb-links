"use client";

import React, { useRef } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

export default function AnimatedCards({ aliases }) {
  const container = useRef();

  useGSAP(
    () => {
      if (window.innerWidth < 1080) return;

      const cards = gsap.utils.toArray(".card");

      ScrollTrigger.create({
        trigger: cards[0],
        start: "top 30%",
        endTrigger: cards[cards.length - 1],
        end: "top 35%",
        pin: ".intro",
        pinSpacing: false,
      });

      cards.forEach((card, key) => {
        const cardInner = card.querySelector(".card-inner");

        ScrollTrigger.create({
          trigger: card,
          start: "top 35%",
          endTrigger: ".outro",
          end: "top 75%",
          pin: true,
          pinSpacing: false,
        });
        gsap.to(cardInner, {
          y: `-${(cards.length - key) * 17}vh`,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top 35%",
            endTrigger: ".outro",
            end: "top 75%",
            scrub: true,
          },
        });
      });
      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: container }
  );

  return (
    <div className="" ref={container}>
      <div className="intro"></div>
      <div className="cards">
        {aliases?.map(({ name, description }, key) => (
          <Card key={key} name={name} description={description} />
        ))}
      </div>
      <div className="outro"></div>
    </div>
  );
}

const Card = ({ name, description }) => {
  return (
    <div className="card relative text-white h-[400px] max-1280:h-[350px] max-1080:h-[280px] max-800:h-fit">
      <div className="card-inner border-t-6 border-t-third bg-secondary relative will-change-transform w-full h-full p-[2em] flex gap-[4em] max-800:py-12 max-550:px-[5%]">
        <div className="flex-[3] pointer-events-none">
          <h2 className="text-6xl capitalize font-[600] leading-[1] mb-[0.5em] max-1080:text-[6vw] max-800:text-5xl max-800:leading-[1.2]
          max-550:text-[10vw] max-400:mb-7 max-400:text-[10vw]">
            {name}
          </h2>
          <p className="text-[1.5vw] max-1280:text-xl max-w-[500px] font-[500] max-700:text-lg max-700:max-w-[400px] max-400:text-[4.5vw]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};
