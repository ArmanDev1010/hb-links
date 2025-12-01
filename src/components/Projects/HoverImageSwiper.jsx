"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function HoverImageSwiper({ images, alt }) {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Detect tablet/mobile
  useEffect(() => {
    const checkDevice = () => setIsTouchDevice(window.innerWidth <= 1024);
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Desktop hover logic
  const handleMouseMove = (e) => {
    if (!images || images.length === 0 || isTouchDevice) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const zoneWidth = rect.width / images.length;
    const index = Math.min(images.length - 1, Math.floor(x / zoneWidth));
    setActiveIndex(index);
    setIsHovering(true);
  };
  const handleMouseLeave = () => {
    if (isTouchDevice) return;
    setActiveIndex(0);
    setIsHovering(false);
  };

  // Mobile swipe logic
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const deltaX = touchEndX.current - touchStartX.current;

    if (Math.abs(deltaX) > 50) {
      setHasInteracted(true); // user swiped → allow color
      if (deltaX < 0 && activeIndex < images.length - 1) {
        setActiveIndex((prev) => prev + 1);
      } else if (deltaX > 0 && activeIndex > 0) {
        setActiveIndex((prev) => prev - 1);
      }
    }
  };

  // Mobile reset grayscale when tapping outside
  useEffect(() => {
    if (!isTouchDevice) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setActiveIndex(0);
        setHasInteracted(false); // back to grayscale
      }
    };
    document.addEventListener("touchstart", handleClickOutside);
    return () => document.removeEventListener("touchstart", handleClickOutside);
  }, [isTouchDevice]);

  return (
    <>
      {isTouchDevice ? (
        // Mobile swiper
        <div
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative w-full h-[400px] overflow-hidden max-550:h-[300px] border-3 border-third"
        >
          <div
            className="flex transition-transform duration-500 ease-in-out h-full w-full"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {images.map((src, i) => (
              <div key={i} className="relative w-full h-full flex-shrink-0">
                <Image
                  src={src}
                  alt={`${alt} ${i + 1}`}
                  fill
                  sizes="none"
                  className={`object-cover transition duration-300 ${
                    activeIndex === i
                      ? hasInteracted
                        ? "grayscale-0" // active + interacted → color
                        : "grayscale" // active but idle → grayscale
                      : "grayscale" // inactive → grayscale
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Dot Navigation */}
          {images.length > 1 && (
            <div className="absolute bg-white/10 backdrop-blur-sm z-[30] bottom-4 left-1/2 -translate-x-1/2 flex justify-center gap-[0.5rem] rounded-[1rem] py-[0.375rem] px-[0.5rem]">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`h-[0.4rem] w-[0.4rem] rounded-full transition duration-300 ${
                    i === activeIndex ? "bg-third scale-[1.7]" : "bg-white"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        // Desktop hover logic
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative w-full h-[400px] overflow-hidden group max-550:h-[300px] border-3 border-third"
        >
          {images.map((src, i) => (
            <Image
              key={i}
              src={src}
              alt={`${alt} ${i + 1}`}
              fill
              sizes="none"
              className={`object-cover transition-opacity duration-300 ease-in-out filter ${
                i === activeIndex
                  ? isHovering
                    ? "grayscale-0 opacity-100 z-20" // active + hover → color
                    : "grayscale opacity-100 z-20" // active but idle → grayscale
                  : "opacity-0 z-0 grayscale" // inactive → hidden grayscale
              }`}
            />
          ))}

          {/* Dot Navigation */}
          {images.length > 1 && (
            <div className="absolute bg-white/10 backdrop-blur-sm z-[30] bottom-4 left-1/2 -translate-x-1/2 flex justify-center gap-[0.5rem] rounded-[1rem] py-[0.375rem] px-[0.5rem]">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`h-[0.4rem] w-[0.4rem] opacity-90 rounded-full transition-opacity transition-transform duration-300 ease-[cubic-bezier(0.24,1,0.52,1)] ${
                    i === activeIndex
                      ? "bg-third scale-[1.7] opacity-100"
                      : "bg-white"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
