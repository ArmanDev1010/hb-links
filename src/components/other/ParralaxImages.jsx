import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

export default function ParralaxImages() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });
  const md = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const lg = useTransform(scrollYProgress, [0, 1], [0, -250]);

  const images_array = [
    {
      y: 0,
      image: "/projects/medical-office-manhattan-beach/1.jpg",
    },
    {
      y: lg,
      image: "/projects/restaurant-parking-in-woodland-hills/1.jpg",
    },
    {
      y: md,
      image: "/projects/credit-union-in-glendale/1.jpg",
    },
  ];

  return (
    <div
      ref={container}
      className="parallax_scroll relative mt-[10vh] min-h-[75vh] max-_700:mt-0 max-_550:min-h-[55vh]"
    >
      <div className="flex w-full !h-full justify-center relative mt-[5vh]">
        {images_array.map(({ y, image }, key) => {
          return (
            <motion.div
              style={{ y }}
              key={key}
              className="parralax_img absolute"
            >
              <Image
                src={image}
                fill={true}
                alt="background image"
                className="w-full h-full object-cover"
              />
            </motion.div>
          );
        })}
      </div>

      <div className="pointer-events-none text-[16px] text-gray-600 max-1280:hidden">
        <p className="absolute top-0 left-0 w-[320px]">
          Our work connects, protects, and communicates. Whether it’s wiring,
          surveillance, or media integration, we deliver systems that perform
          reliably and look sharp
        </p>
        <p className="absolute bottom-0 text-right right-0 w-[320px]">
          From structured cabling to access control and AV integration. Every
          install is clean, scalable, and built to last.
        </p>
      </div>
    </div>
  );
}
