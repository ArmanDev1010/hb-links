import { AnimatePresence, motion } from "framer-motion";

import { services } from "@/data/services";

const textVariants = {
  initial: { opacity: 0, y: 40, position: "absolute" },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.7, 0, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -60,
    transition: { duration: 0.7, ease: [0.65, 0, 0.35, 1] },
  },
};

export default function SlideText({ activeIndex }) {
  return (
    <AnimatePresence>
      <motion.h2
        key={activeIndex}
        variants={textVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="text-white text-[5vw] font-[400] uppercase leading-[1.2] pointer-events-none
        max-1280:text-[5.5vw] max-700:text-[6.5vw] max-550:text-[9vw] max-550:leading-[1.4] max-400:text-[9vw]"
      >
        {services[activeIndex]?.title}
      </motion.h2>
    </AnimatePresence>
  );
}
