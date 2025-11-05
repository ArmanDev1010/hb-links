"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";

import { IoIosArrowBack } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const slideTexts = [
  ["Secure.", "Smart.", "Connected."],
  ["Control Every", "Connection"],
  ["Low Voltage -", "High Impact"],
  ["Integration.", "Network.", "Surveillance."],
  ["Smart Wiring.", "Smarter Control."],
];

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

export default function Slides() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  const [progress, setProgress] = useState(0);

  const progressRef = useRef(null);
  const swiperRef = useRef(null);

  const handleAutoplayProgress = useCallback((_, __, prog) => {
    if (progressRef.current) {
      progressRef.current.style.setProperty(
        "--progress",
        `${(1 - prog) * 100}%`
      );
    }
    setProgress(prog);
  }, []);

  const updateSlideData = useCallback((swiper) => {
    setTotalSlides(swiper?.slides.length || 0);
    setActiveIndex(swiper?.realIndex || 0);
  }, []);

  const slideToPrev = () => swiperRef.current?.swiper?.slidePrev();
  const slideToNext = () => swiperRef.current?.swiper?.slideNext();

  useEffect(() => {
    if (isNaN(activeIndex)) setActiveIndex(0);
  }, [activeIndex]);

  return (
    <div className="relative w-full h-screen">
      <Swiper
        ref={swiperRef}
        slidesPerView={1}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop
        speed={1200}
        onSlideChange={updateSlideData}
        onAutoplayTimeLeft={handleAutoplayProgress}
        modules={[Autoplay, FreeMode, Thumbs]}
        className="hero_swiper w-full h-full text-white"
      >
        {slideTexts.map((_, index) => (
          <SwiperSlide key={index}>
            <div className="absolute top-0 left-0 w-full h-full brightness-[50%]">
              <Image
                src={`/swipers/${index + 1}.jpg`}
                alt={`Slide ${index + 1}`}
                fill
                priority={index === 0}
                className="object-cover"
              />
            </div>
          </SwiperSlide>
        ))}

        {/* Slide Text */}
        <div className="absolute top-0 left-0 w-[75%] h-full">
          <div className="absolute top-[45%] -translate-y-1/2 z-[4] w-[80%] h-full flex items-center pl-[70px] pointer-events-none">
            <AnimatePresence>
              <motion.h2
                key={activeIndex}
                variants={textVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="text-white text-[5vw] font-[400] uppercase leading-[1.2]"
              >
                {slideTexts[activeIndex].map((line, i) => (
                  <span
                    key={i}
                    className={`block w-full ${
                      i === 1 ? "text-right" : "text-left"
                    }`}
                  >
                    {line}
                  </span>
                ))}
              </motion.h2>
            </AnimatePresence>
          </div>

          {/* Navigation + Progress */}
          <div className="absolute left-[100px] bottom-0 pb-[10%] w-[calc(100%-70px)] z-[3] flex items-center justify-between text-sm">
            <div className="flex items-center">
              <button onClick={slideToPrev} className="cursor-pointer">
                <IoIosArrowBack size={17} />
              </button>
              <p className="mx-[1.3rem] w-[20px] pointer-events-none">
                0{activeIndex + 1}
              </p>
              <div className="autoplay-progress w-[15rem] h-[0.5px] bg-[hsla(47,36%,95%,.2)] max-1080:w-[200px] max-550:w-[150px]">
                <div
                  ref={progressRef}
                  className="h-full bg-white"
                  style={{ width: `var(--progress)` }}
                />
              </div>
              <p className="mx-[1.3rem] w-[20px] pointer-events-none">
                0{activeIndex + 1 !== totalSlides ? activeIndex + 2 : 1}
              </p>
              <button onClick={slideToNext} className="cursor-pointer">
                <IoIosArrowBack size={17} className="rotate-180" />
              </button>
            </div>

            {/* CTA Button */}
            <Link href="/projects">
              <div className="group absolute w-[384px] h-[384px] -bottom-12 right-[100px] flex justify-center items-center uppercase cursor-pointer rounded-full">
                <div className="absolute w-full h-full rounded-full border border-white/40 transition-transform duration-400 ease-in-out group-hover:scale-[1.05]" />
                <div className="pointer-events-none relative overflow-hidden text-center">
                  <div className="transition duration-400 group-hover:-translate-y-full">
                    Learn More
                  </div>
                  <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition duration-400">
                    Learn More
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </Swiper>

      {/* Divider */}
      <div className="absolute top-[0px] left-[calc(75%-1.5%)] bg-white/30 h-full w-[1px] z-[3]" />
    </div>
  );
}
