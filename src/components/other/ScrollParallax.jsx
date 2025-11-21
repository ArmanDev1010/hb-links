"use client";

import { useEffect, useRef, useState } from "react";
import { useTransform, useScroll, motion } from "framer-motion";

import Image from "next/image";
import Lenis from "@studio-freight/lenis";

import { services } from "@/data/services";

export default function ScrollParallax() {
  const gallery = useRef(null);

  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  const { scrollYProgress } = useScroll({
    target: gallery,

    offset: ["start end", "end start"],
  });

  const { width, height } = dimension;

  let factor1 = 1.25;
  let factor2 = 2.5;
  let factor3 = 1;
  let factor4 = 1.75;

  if (width <= 550) {
    factor1 = 0.5;
    factor2 = 1.25;
    factor3 = 0.5;
    factor4 = 1;
  } else if (width <= 700) {
    factor1 = 1;
    factor2 = 1.75;
    factor3 = 0.65;
    factor4 = 1.25;
  } else if (width <= 1080) {
    factor1 = 1.25;
    factor2 = 2.25;
    factor3 = 0.75;
    factor4 = 1.75;
  }
  1;

  const y = useTransform(scrollYProgress, [0, 1], [0, height * factor1]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, height * factor2]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, height * factor3]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, height * factor4]);

  useEffect(() => {
    const lenis = new Lenis();

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);
    const resize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", resize);

    requestAnimationFrame(raf);

    resize();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  const filledImages = gatherServiceImages(services, 12);

  return (
    <main className="relative">
      <div
        ref={gallery}
        className="h-[100vh] overflow-hidden bg-primary 
        max-1080:h-[120vh] max-700:h-[100vh] max-550:h-[75vh]"
      >
        <div
          className="galleryWrapper relative top-[-12.5vh] h-[200vh] flex gap-[2vw] p-[2vw] 
          max-1080:h-[150vh] max-700:h-[130vh] max-550:h-[100vh]"
        >
          <Column
            images={[filledImages[0], filledImages[1], filledImages[2]]}
            y={y}
          />
          <Column
            images={[filledImages[3], filledImages[4], filledImages[5]]}
            y={y2}
          />
          <Column
            images={[filledImages[6], filledImages[7], filledImages[8]]}
            y={y3}
          />
          <Column
            images={[filledImages[9], filledImages[10], filledImages[11]]}
            y={y4}
          />
        </div>
      </div>
    </main>
  );
}

function gatherServiceImages(services, targetLength = 12) {
  const result = [];
  let index = 0;
  while (result.length < targetLength) {
    for (const service of services) {
      if (service.images && service.images[index]) {
        result.push(service.images[index]);
        if (result.length === targetLength) break;
      }
    }
    index++;
    if (services.every((s) => !s.images || !s.images[index])) break;
  }
  return result;
}

const Column = ({ images, y }) => {
  return (
    <motion.div
      className="column relative h-full w-1/4 min-w-[250px] flex flex-col gap-[2vw] whitespace-nowrap"
      style={{ y }}
    >
      {images.map((src, i) => (
        <div
          key={i}
          className="group relative h-1/3 w-full rounded-[1vw] overflow-hidden bg-secondary brightness-[50%]"
        >
          <Image
            src={src}
            alt="image"
            fill
            className="object-cover filter grayscale"
          />
        </div>
      ))}
    </motion.div>
  );
};
