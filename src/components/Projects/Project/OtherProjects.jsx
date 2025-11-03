import React from "react";
import ProjectPreview from "@/components/Projects/ProjectPreview";

export default function OtherProjects({ otherProjects }) {
  return (
    <div className="px-[5%] mb-10">
      <p className="uppercase text-[max(3vw,4.5vw)] mb-[30px] leading-[1.1] pointer-events-none">
        Other Projects
      </p>
      <ul className="grid grid-cols-2 gap-6">
        {otherProjects.map(({ title, id, videos, images, categories }, key) => (
          <ProjectPreview
            key={key}
            title={title}
            id={id}
            videos={videos}
            images={images}
            categories={categories}
          />
        ))}
      </ul>
    </div>
  );
}
