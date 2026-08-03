import React from "react";

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden h-full flex min-h-screen items-end pt-28 sm:pt-22 !bg-black text-neutral-50"
      style={{
        background: "url(/seo/main.png)",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      id="hero"
    >
      <div className="relative z-20 pb-20 mx-auto w-full 700:px-[1rem] lg:pb-20">
        <div className="overflow-hidden max-w-4xl">
          <h2
            className="px-2 uppercase w-fit font-compressed tracking-tight leading-[1] font-bold pointer-events-none text-transparent bg-clip-text
    1600:text-[5rem] 1080:text-[4rem] 800:text-[3.5rem] 550:text-[3rem] text-[9vw]"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #ffffff 50%, #0b8540 50%)",
              WebkitBackgroundClip: "text",
            }}
          >
            General Building. <br /> Electrical. <br /> Plumbing. <br /> Low
            Voltage.
          </h2>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full z-10">
        <div className="absolute top-0 left-0 w-full h-[30%] z-20 opacity-70 bg-gradient-to-b from-black"></div>
        <div className="absolute bottom-0 left-0 w-full h-[50%] z-20 opacity-70 bg-gradient-to-t from-black"></div>
      </div>
    </section>
  );
}
