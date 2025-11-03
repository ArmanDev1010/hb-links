import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function Services_Slides({ isLightPage }) {
  const items = [
    "LowVoltageContractor",
    "SecuritySystems",
    "CCTV",
    "AccessControl",
    "Networking",
    "AVIntegration",
    "AudioVideo",
    "SurveillanceSystems",
    "SmartHome",
  ];

  const duplicatedItems = [...items, ...items, ...items]; // 3× duplication

  return (
    <div
      className={`relative z-[1] py-3 mb-10 ${
        isLightPage
          ? "bg-third text-white"
          : "bg-white border-y-4 border-y-third text-black"
      }`}
    >
      <Swiper
        spaceBetween={0}
        slidesPerView={"auto"}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        speed={2000}
        loop
        modules={[Autoplay]}
        className="services_swiper relative pointer-events-none text-lg"
      >
        {duplicatedItems.map((text, key) => (
          <SwiperSlide key={key} className="text-center !w-fit px-3">
            <span>{text}</span>{" "}
            <span className={`pl-4 ${isLightPage ? "text-white" : "text-gray-500"}`}>
              |
            </span>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
