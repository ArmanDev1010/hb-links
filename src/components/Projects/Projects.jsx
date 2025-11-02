"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import HoverImageSwiper from "@/components/Projects/HoverImageSwiper";
import Link from "next/link";

import { projects } from "@/data/projects";

export default function Projects() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const tabRefs = useRef({});

  const filters = [
    "All",
    "Security Systems",
    "CCTV",
    "Access Control",
    "Networking",
    "AV Integration",
    "Smart Home",
  ];

  const filteredProjects = useMemo(() => {
    return selectedFilter === "All"
      ? projects
      : projects.filter((project) =>
          project.categories.includes(selectedFilter)
        );
  }, [selectedFilter, projects]);

  useEffect(() => {
    const el = tabRefs.current[selectedFilter];
    if (el) {
      const { offsetLeft, offsetWidth } = el;
      setUnderlineStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [selectedFilter]);

  const handleFilterChange = (filter) => {
    setIsLoading(true);
    setSelectedFilter(filter);
    setTimeout(() => {
      setIsLoading(false);
    }, 500); // Adjust duration to match animation
  };

  return (
    <div className="relative px-[3%] pt-[50px] pb-[30px]">
      <h2 className="uppercase text-[max(3vw,5.5vw)] mb-[50px] leading-[1.1] pointer-events-none max-_1440:text-7xl max-_1440:mb-[30px] max-_550:text-[14vw]">
        Projects
      </h2>

      {/* Filter Tabs */}
      <div className="relative w-full mb-10 flex justify-center">
        <div className="flex gap-8 overflow-x-auto whitespace-nowrap">
          {filters.map((filter) => (
            <button
              key={filter}
              ref={(el) => (tabRefs.current[filter] = el)}
              onClick={() => handleFilterChange(filter)}
              className={`pb-2 text-[16px] font-medium cursor-pointer ${
                selectedFilter === filter
                  ? "text-third"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Sliding Underline */}
        <div
          className="absolute bottom-0 h-[2px] bg-third transition-all duration-300"
          style={{
            left: underlineStyle.left,
            width: underlineStyle.width,
          }}
        />
        <div className="absolute bottom-[-1px] h-[1px] bg-gray-300 w-[80%] max-w-[1400px]" />
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <Link href={`projects/${project.id}`} key={project.id}>
            <div
              className={`overflow-hidden transition-opacity duration-300 ${
                isLoading ? "pointer-events-none" : "hover:opacity-90"
              }`}
            >
              {isLoading ? (
                // Gray Placeholder Card
                <div className="w-full h-[400px] bg-gray-200 animate-pulse" />
              ) : (
                <HoverImageSwiper
                  images={project.images}
                  video={project.video}
                  alt={project.title}
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
                    <h3 className="text-[2vw] font-semibold mb-1">
                      {project.title}
                    </h3>
                    <p className="text-base text-gray-400">
                      {project.categories.join(", ")}
                    </p>
                  </>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
