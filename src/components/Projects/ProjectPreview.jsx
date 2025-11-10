import React from "react";
import HoverImageSwiper from "@/components/Projects/HoverImageSwiper";
import Link from "next/link";

export default function ProjectPreview({
  title,
  video,
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
          <div className="w-full h-[400px] bg-gray-200 animate-pulse" />
        ) : (
          <HoverImageSwiper
            images={images}
            video={video}
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
                className={`text-[2vw] font-semibold mb-1 ${
                  isBlack && "text-white"
                }`}
              >
                {title}
              </h3>

              <p className="text-lg text-gray-400">{categories.join(", ")}</p>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
