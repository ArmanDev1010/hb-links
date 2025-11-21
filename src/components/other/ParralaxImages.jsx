import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

import firstImage from "@/../public/services/structured-cabling/images/9.jpg";
import secondImage from "@/../public/services/wiring-rewiring/images/4.jpg";
import thirdImage from "@/../public/services/security-cameras/images/3.jpg";

export default function ParralaxImages() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });
  const md = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const lg = useTransform(scrollYProgress, [0, 1], [0, -250]);

  const images_array = [
    { y: 0, image: firstImage },
    { y: lg, image: secondImage },
    { y: md, image: thirdImage },
  ];

  const texts_array = [
    "Our work connects, protects, and communicates. Whether it’s wiring, surveillance, or media integration, we deliver systems that perform reliably and look sharp.",
    "From structured cabling to access control and AV integration. Every install is clean, scalable, and built to last.",
  ];

  return (
    <div
      ref={container}
      className="parallax_scroll !relative mt-[10vh] min-h-[65vh] max-900:min-h-[65vh] max-550:min-h-[55vh]"
    >
      <div className="flex w-full !h-full justify-center relative mt-[5vh]">
        {images_array.map(({ y, image }, key) => (
          <motion.div
            style={{ y }}
            key={key}
            className="parralax_img absolute bg-primary brightness-[50%]"
          >
            <Image
              src={image}
              fill
              alt="background image"
              className="w-full h-full object-cover bg-primary filter grayscale"
            />
          </motion.div>
        ))}
      </div>

      <div className="pointer-events-none text-[16px] text-gray-600 max-1280:hidden">
        {texts_array[0] && (
          <p className="absolute top-0 left-0 w-[320px]">{texts_array[0]}</p>
        )}
        {texts_array[1] && (
          <p className="absolute bottom-0 text-right right-0 w-[320px]">
            {texts_array[1]}
          </p>
        )}
      </div>
    </div>
  );
}
