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
    <div className="py-[60px]" ref={container}>
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
    <div className="card relative text-white h-[400px]">
      <div className="border-y-4 border-y-third card-inner bg-secondary relative will-change-transform w-full h-full p-[2em] flex gap-[4em]">
        <div className="flex-[3] pointer-events-none">
          <h2 className="text-[5vw] capitalize font-[600] leading-[1] mb-[0.5em]">
            {name}
          </h2>
          <p className="text-[1.5vw] max-w-[900px] font-[500] max-_900:hidden">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};
