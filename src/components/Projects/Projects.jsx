"use client";

import { useState, useRef, useEffect, useMemo } from "react";

import { projects } from "@/data/projects";
import ProjectPreview from "./ProjectPreview";

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
      <h2 className="uppercase text-[max(3vw,5.5vw)] mb-[50px] leading-[1.1] pointer-events-none">
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
        {filteredProjects.map(
          ({ title, id, videos, images, categories }, key) => (
            <ProjectPreview
              key={key}
              title={title}
              id={id}
              videos={videos}
              images={images}
              categories={categories}
              isLoading={isLoading}
            />
          )
        )}
      </div>
    </div>
  );
}
