import React from "react";
import HoverImageSwiper from "@/components/Projects/HoverImageSwiper";
import Link from "next/link";

export default function ProjectPreview({
  title,
  bg_img,
  images,
  categories,
  isLoading,
  isBlack,
}) {
  return (
    <Link
      href={`/projects/${title?.toLowerCase().replace(/\s+/g, "-")}`}
      prefetch
    >
      <div
        className={`overflow-hidden transition-opacity duration-300 ${
          isLoading ? "pointer-events-none" : "hover:opacity-90"
        }`}
      >
        {isLoading ? (
          <div className="w-full h-[400px] bg-gray-200 animate-pulse max-550:h-[300px]" />
        ) : (
          <HoverImageSwiper
            images={images}
            bg_img={bg_img}
            alt={title}
          />
        )}

        <div className="py-4">
          {isLoading ? (
            <>
              <div className="h-4 w-3/4 bg-gray-200 rounded mb-2 animate-pulse" />
              <div className="h-6 w-1/2 bg-gray-300 rounded animate-pulse" />
            </>
          ) : (
            <>
              <h3
                className={`text-3xl font-semibold mb-1 max-1440:text-[2.5vw] max-900:text-3xl 
                  max-700:text-[4.5vw] max-700:leading-[1.4] max-550:text-[5.5vw] max-400:text-[8vw] max-400:mb-2 ${
                    isBlack && "text-white"
                  }`}
              >
                {title}
              </h3>

              <p className="text-lg text-gray-400 max-1080:text-base ">
                {categories.join(", ")}
              </p>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
