"use client";

import { useState, useRef, useEffect, useMemo } from "react";

import ProjectPreview from "./ProjectPreview";

import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { normalizeCategory } from "../Services/utils/normalizeCategory";

export default function Projects() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const tabRefs = useRef({});

  const filteredProjects = useMemo(() => {
    if (selectedFilter === "All") return projects;

    return projects.filter((project) =>
      project.categories.some(
        (cat) => normalizeCategory(cat) === selectedFilter
      )
    );
  }, [selectedFilter, projects]);

  const usedServiceTitles = new Set();
  projects.forEach((project) => {
    project.categories.forEach((cat) => {
      usedServiceTitles.add(normalizeCategory(cat));
    });
  });
  const activeServices = services.filter((s) => usedServiceTitles.has(s.title));
  const filters = ["All", ...activeServices.map((s) => s.title)];

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
    }, 500);
  };

  return (
    <div className="relative px-[3%] pt-[50px] pb-[50px]">
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
          ({ title, id, video, background_image, images, categories }, key) => (
            <ProjectPreview
              key={key}
              title={title}
              id={id}
              video={video}
              bg_img={background_image}
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
