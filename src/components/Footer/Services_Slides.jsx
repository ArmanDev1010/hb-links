import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function Services_Slides({ isLightPage }) {
  const items = [
    "Low Voltage",
    "Security Systems",
    "CCTV",
    "Access Control",
    "Networking",
    "AV Integration",
    "Audio / Video",
    "Surveillance Systems",
    "Smart Home",
  ];

  const duplicatedItems = [...items, ...items, ...items];

  return (
    <div
      className={`relative z-[1] py-3 mb-10 ${
        isLightPage
          ? "bg-third text-white"
          : "bg-white border-y-4 border-y-third text-black"
      }`}
    >
      <Swiper
        loop={true}
        spaceBetween={0}
        slidesPerView={7}
        autoplay={{
          delay: 1,
          disableOnInteraction: false,
        }}
        speed={1500}
        modules={[Autoplay]}
        className="services_swiper relative w-full h-full"
      >
        {duplicatedItems.map((text, key) => (
          <SwiperSlide key={key}>{text}</SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
