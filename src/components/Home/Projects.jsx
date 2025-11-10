import React from "react";

import { projects } from "@/data/projects";
import ProjectPreview from "@/components/Projects/ProjectPreview";

import greenLine from "@/../public/patterns/line_green.png";
import Image from "next/image";
import Link from "next/link";

export default function Projects() {
  const visibleProjects = projects.slice(0, 4);

  return (
    <div className="relative py-[50px] px-[5%]">
      <h3 className="uppercase text-6xl mb-[40px] leading-[1.1] pointer-events-none">
        Our Projects
      </h3>
      <div className="relative z-[1] grid grid-cols-2 gap-6">
        {visibleProjects.map(
          ({ title, id, video, background_image, images, categories }, key) => (
            <ProjectPreview
              key={key}
              title={title}
              id={id}
              video={video}
              bg_img={background_image}
              images={images}
              categories={categories}
              isLoading={false}
            />
          )
        )}
      </div>
      <div className="flex justify-center my-10">
        <Link href={"/projects"}>
          <button className="group text-lg capitalize px-12 py-2 text-white rounded-full bg-secondary flex gap-2 cursor-pointer max-550:text-3xl">
            <div className="relative overflow-hidden">
              <div className="group-hover:translate-y-[-110%] transition duration-300">
                See more
              </div>
              <div className="translate-y-[110%] group-hover:translate-y-[0%] transition duration-300 absolute top-0 bottom-0 left-0 right-0">
                See more
              </div>
            </div>
          </button>
        </Link>
      </div>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-cover bg-no-repeat opacity-50">
        <Image
          src={greenLine}
          layout="fill"
          objectFit="cover"
          quality={100}
          alt=""
        />
      </div>
    </div>
  );
}
