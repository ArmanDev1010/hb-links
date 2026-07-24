export default function ExpertiseHero({ title }) {
  return (
    <section
      className="relative overflow-hidden h-full flex min-h-screen items-end pt-28 sm:pt-22 !bg-black text-neutral-50"
      style={{
        background: "url()",
        backgroundPosition: "left",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      id="expertise_hero"
    >
      <div className="relative z-20 pb-30 mx-auto w-full 700:px-[1rem] lg:pb-40">
        <div className="mx-auto 1080:w-[83.333%]">
          <h2
            className="px-2 uppercase font-compressed tracking-tight leading-[1] font-bold pointer-events-none
    max-1080:px-5 1080:text-[5rem] 800:text-[3.5rem] 550:text-[3rem] max-550:text-[10vw]"
          >
            {title}
          </h2>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full z-10">
        <div className="absolute top-0 left-0 w-full h-1/2 z-20 opacity-50 bg-gradient-to-b from-black" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 z-20 opacity-80 bg-gradient-to-t from-black" />
      </div>
    </section>
  );
}
