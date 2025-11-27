import Image from "next/image";
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

export default function BackgroundParallax({ page_image }) {
  const container = useRef();
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10vh", "10vh"]);

  return (
    <div
      ref={container}
      className="relative flex items-center justify-center h-[75vh] overflow-hidden bg-primary max-900:h-[75vh] max-550:h-[50vh]"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="fixed top-[-10vh] left-0 h-[120vh] w-full">
        <motion.div style={{ y }} className="relative w-full h-full">
          <Image
            src={page_image}
            fill
            alt="image"
            style={{ objectFit: "cover" }}
            className="filter grayscale"
          />
        </motion.div>
      </div>
    </div>
  );
}
