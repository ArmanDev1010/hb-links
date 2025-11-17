"use client";

import { useState, useRef, useMemo } from "react";

import ProjectPreview from "./ProjectPreview";

import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { normalizeCategory } from "../Services/utils/normalizeCategory";

export default function Projects() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  const tabRefs = useRef({});

  // Filter projects by selected category (title or alias)
  const filteredProjects = useMemo(() => {
    if (selectedFilter === "All") return projects;

    return projects.filter((project) =>
      project.categories.some((cat) => {
        const normalizedCat = normalizeCategory(cat);

        // Check if selectedFilter matches category directly
        if (normalizedCat === selectedFilter) return true;

        // Check if selectedFilter matches a service alias
        const service = services.find(
          (s) =>
            normalizeCategory(s.title) === selectedFilter ||
            s.aliases.some(
              (alias) => normalizeCategory(alias) === selectedFilter
            )
        );

        if (!service) return false;

        // Match project category against service title or aliases
        return (
          normalizeCategory(service.title) === normalizedCat ||
          service.aliases.some(
            (alias) => normalizeCategory(alias) === normalizedCat
          )
        );
      })
    );
  }, [selectedFilter]);

  // Collect all categories used in projects
  const usedServiceTitles = new Set();
  projects.forEach((project) => {
    project.categories.forEach((cat) => {
      usedServiceTitles.add(normalizeCategory(cat));
    });
  });

  // Active services: match by title or alias
  const activeServices = services.filter((s) => {
    const normalizedTitle = normalizeCategory(s.title);
    const normalizedAliases = s.aliases.map((a) => normalizeCategory(a));
    return (
      usedServiceTitles.has(normalizedTitle) ||
      normalizedAliases.some((alias) => usedServiceTitles.has(alias))
    );
  });

  // Filters = "All" + active service titles
  const filters = ["All", ...activeServices.map((s) => s.title)];

  const handleFilterChange = (filter) => {
    setIsLoading(true);
    setSelectedFilter(filter);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="relative py-[50px] max-400:py-[40px]">
      <h3
        className="uppercase text-7xl mb-[40px] leading-[1.1] pointer-events-none px-[3%] 
      max-700:text-6xl max-700:mb-[40px] max-550:mb-[30px] max-400:text-5xl"
      >
        Projects
      </h3>

      {/* Filter Tabs */}
      <div className="relative w-full mb-10 flex justify-center">
        <div className="flex gap-5 flex-wrap px-[3%] max-550:gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              ref={(el) => (tabRefs.current[filter] = el)}
              onClick={() => handleFilterChange(filter)}
              className={`group cursor-pointer border border-gray-500 text-lg py-2 px-5 capitalize transition duration-[0.2s] hover:opacity-70
                  max-900:text-base max-550:text-[15px] max-400:text-sm ${
                    selectedFilter === filter ? "bg-third text-white" : ""
                  }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="absolute -bottom-5 h-[1px] bg-gray-300 w-[80%] max-w-[1400px] max-1080:w-full" />
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-2 gap-6 px-[3%] max-900:grid-cols-1">
        {filteredProjects.map(
          ({ title, id, background_image, images, categories }, key) => (
            <ProjectPreview
              key={key}
              title={title}
              id={id}
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
