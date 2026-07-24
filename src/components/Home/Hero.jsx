import React from "react";

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden h-full flex min-h-screen items-end pt-28 sm:pt-22 !bg-black text-neutral-50 bg-cover bg-center bg-no-repeat"
      style={{
        background: "url()",
        backgroundPosition: "left",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      id="hero"
    >
      <div className="relative z-20 pb-20 mx-auto w-full 700:px-[1rem] lg:pb-20">
        <div className="overflow-hidden max-w-4xl">
          <h2
            className="px-2 uppercase w-fit font-compressed tracking-tight leading-[1] font-bold pointer-events-none text-transparent bg-clip-text
    1600:text-[5rem] 1080:text-[4rem] 800:text-[3.5rem] 550:text-[3rem] max-550:text-[10vw]"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #ffffff 50%, #0b8540 50%)",
              WebkitBackgroundClip: "text",
            }}
          >
            General Building. <br /> Electrical. <br /> Low Voltage. <br />
            Plumbing.
          </h2>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full z-10">
        <div className="absolute top-0 left-0 w-full h-1/2 z-20 opacity-50 bg-gradient-to-b from-black"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 z-20 opacity-60 bg-gradient-to-t from-black"></div>
      </div>
    </section>
  );
}
