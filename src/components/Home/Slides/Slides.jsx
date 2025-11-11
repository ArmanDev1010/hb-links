"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";

import SlideText from "./SlideText";
import SlideNavigation from "./SlideNavigation";
import SlideCTA from "./SlideCTA";
import Image from "next/image";

const slideTexts = [
  ["Low Voltage", "High Impact"],
  ["Secure Access", "Smart Control"],
  ["Clean Wiring", "Reliable Power"],
  ["Control Every", "Connection"],
  ["Integration", "Network", "Surveillance"],
];

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
            <div className="absolute top-0 left-0 w-full h-full brightness-[30%] bg-primary">
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

        {/* Overlay Layout */}
        <div className="absolute inset-0 z-[3] px-[5%] py-[5%] flex flex-col justify-between">
          {/* Top Section */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mt-[15vh] max-1080:mt-[20vh] max-550:mt-[20vh]">
            <SlideText activeIndex={activeIndex} slideTexts={slideTexts} />

            <SlideNavigation
              activeIndex={activeIndex}
              totalSlides={totalSlides}
              slideToPrev={slideToPrev}
              slideToNext={slideToNext}
              progressRef={progressRef}
            />

            <SlideCTA />
          </div>
        </div>
      </Swiper>

      {/* Divider */}
      <div className="absolute top-0 left-[calc(75%-1.5%)] bg-white/30 h-full w-[1px] z-[3] max-1440:hidden" />
    </div>
  );
}
