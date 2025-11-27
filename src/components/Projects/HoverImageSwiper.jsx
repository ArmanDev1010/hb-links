import { useState, useRef } from "react";
import Image from "next/image";

export default function HoverImageSwiper({ images, alt, video }) {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    if (!images || images.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const zoneWidth = rect.width / images.length;
    const index = Math.min(images.length - 1, Math.floor(x / zoneWidth));
    setActiveIndex(index);
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setActiveIndex(0);
    setIsHovering(false);
  };

  const shouldShowImages = !video || isHovering;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[400px] overflow-hidden group max-550:h-[300px] border-3 border-third"
    >
      {/* Image Layer */}
      {images.map((src, i) => (
        <Image
          key={i}
          src={src}
          alt={`${alt} ${i + 1}`}
          sizes="none"
          fill
          className={`object-cover transition-opacity duration-300 ease-in-out filter grayscale hover:grayscale-0 ${
            shouldShowImages && i === activeIndex
              ? "opacity-100 z-20"
              : "opacity-0 z-0"
          }`}
        />
      ))}

      {/* Dot Navigation */}
      {images.length > 1 && (
        <div
          className="absolute bg-white/10 backdrop-blur-sm z-[30] bottom-4 left-1/2 -translate-x-1/2 flex justify-center gap-[0.5rem]
          rounded-[1rem] py-[0.375rem] px-[0.5rem]"
        >
          {images.map((_, i) => (
            <div
              key={i}
              className={`h-[0.4rem] w-[0.4rem] opacity-90 rounded-full 
                  transition-opacity transition-transform duration-300 ease-[cubic-bezier(0.24,1,0.52,1)] ${
                    i === activeIndex
                      ? "bg-third scale-[1.7] opacity-100"
                      : "bg-white"
                  }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
