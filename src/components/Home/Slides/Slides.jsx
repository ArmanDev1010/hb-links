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

import { services } from "@/data/services";

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
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        loop
        speed={1200}
        onSlideChange={updateSlideData}
        onAutoplayTimeLeft={handleAutoplayProgress}
        modules={[Autoplay, FreeMode, Thumbs]}
        className="hero_swiper w-full h-full text-white"
      >
        {services.map(({ home_image }, index) => (
          <SwiperSlide key={index}>
            <div className="absolute top-0 left-0 w-full h-full brightness-[30%] bg-primary">
              {home_image ? (
                <Image
                  src={home_image}
                  alt={`Slide ${index + 1}`}
                  fill
                  priority={index === 0}
                  className="object-cover filter grayscale"
                />
              ) : null}
            </div>
          </SwiperSlide>
        ))}

        <div className="absolute inset-0 z-[3] px-[5%] py-[5%] flex flex-col justify-between">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mt-[25vh] max-1080:mt-[20vh] max-550:mt-[20vh]">
            <SlideText activeIndex={activeIndex} />

            <SlideNavigation
              activeIndex={activeIndex}
              totalSlides={totalSlides}
              slideToPrev={slideToPrev}
              slideToNext={slideToNext}
              progressRef={progressRef}
            />

            <SlideCTA activeIndex={activeIndex} />
          </div>
        </div>
      </Swiper>
    </div>
  );
}
