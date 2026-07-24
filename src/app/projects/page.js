export default function ProjectsPage() {
  return (
    <div>
      <section
        className="relative overflow-hidden h-full flex min-h-screen items-end pt-28 sm:pt-22 bg-black text-neutral-50 bg-cover bg-center bg-no-repeat"
        style={{
          background:
            "url(https://bn-builders.transforms.svdcdn.com/staging/default/all-projects-hero.jpg?w=1680&h=1007&q=82&fm=webp&fit=crop&crop=focalpoint&fp-x=0.8128&fp-y=0.4408&dm=1691182121&s=cdc0b663bc83e57b68d80db47ad4192e)",
          backgroundPosition: "left",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
        id="projects_hero"
      >
        <div className="relative z-20 pb-20 mx-auto w-full 700:px-[1rem] lg:pb-30">
          <div className="mx-auto w-[83.333%] overflow-hidden">
            <h2
              className="px-2 uppercase font-compressed tracking-tight leading-[1] font-bold pointer-events-none
    lg:w-1/2  1080:text-[4.5rem] 800:text-[3.5rem] 550:text-[3rem] max-550:text-[10vw]"
            >
              If you can <br /> Imagine it, we <br /> can build it.
            </h2>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full z-10">
          <div className="absolute top-0 left-0 w-full h-1/2 z-20 opacity-50 bg-gradient-to-b from-black"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 z-20 opacity-60 bg-gradient-to-t from-black"></div>
        </div>
      </section>
    </div>
  );
}
