"use client";

import Link from "next/link";
import { BsCheckCircle } from "react-icons/bs";
import { MdOutlineLocalPhone } from "react-icons/md";
import { useModal } from "@/context/ModalContext";
import { contactInfo } from "@/data/contact";

const license = contactInfo.find((item) => item.type === "License")?.label;

export default function ExpertiseHero({ title, paragraph, image }) {
  const { toggleModal } = useModal();

  const facts = [
    `Licensed for ${title} — ${license}`,
    "Serving Los Angeles & Ventura County",
    "Free written estimates, no obligation",
    "One point of contact from first call to final walkthrough",
  ];

  return (
    <section
      className="relative overflow-hidden h-full flex min-h-screen items-center !bg-black text-neutral-50"
      style={{
        background: `url(${image})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      id="expertise_hero"
    >
      <div className="relative z-20 1080:pt-10 pt-[10rem] max-1080:pb-10 mx-auto w-full 700:px-[1rem] px-[0.5rem]">
        <div className="mx-auto 1280:w-[83.333%] px-2 1280:px-0 grid grid-cols-1 1080:grid-cols-[1fr_340px] gap-12 1080:gap-16 items-center">
          <div className="">
            <nav className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-white/60 mb-8">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-white pointer-events-none">{title}</span>
            </nav>

            <h1
              className="uppercase font-compressed tracking-tight leading-[1] font-bold pointer-events-none
    900:text-[3.5rem] 550:text-[2.5rem] 400:text-[7.5vw] text-[8vw]"
            >
              {title} in <br></br>Los Angeles, Ca
            </h1>

            {paragraph && (
              <p className="mt-6 text-white/80 max-w-xl text-[15px] 550:text-base 1280:text-lg pointer-events-none">
                {paragraph}
              </p>
            )}

            <div className="mt-10 flex flex-wrap max-700:flex-col items-center gap-4">
              <button
                onClick={toggleModal}
                className="cursor-pointer max-700:w-full bg-third text-white border-[1.5px] border-third 700:px-[2.5rem] px-[2rem] py-[0.9rem] 550:text-sm text-xs font-[500] uppercase tracking-[0.1em] hover:bg-white hover:text-black hover:border-white transition-all ease-[cubic-bezier(0.4,0,0.2,1)] duration-400"
              >
                Schedule a Free Consultation
              </button>
              <Link
                href="tel:+1 (818) 303-3555"
                className="flex items-center max-700:w-full max-700:justify-center text-[15px] 550:text-sm gap-2.5 border-[1.5px] border-white/40 700:px-[2rem] px-[1.5rem] py-[0.9rem] font-[500] uppercase tracking-[0.1em] hover:border-white transition-all duration-400"
              >
                <MdOutlineLocalPhone className="w-[18px] h-[18px]" />
                <span className="max-550:mt-[2px]">(818) 303-3555</span>
              </Link>
            </div>
          </div>
          <div className="1080:border 1080:border-white/20 1080:bg-white/5 1080:backdrop-blur-sm 1080:p-6 pointer-events-none">
            <ul className="flex flex-col">
              {facts.map((fact, index) => (
                <li
                  key={fact}
                  className="flex gap-3 py-4 not-last:border-b border-white/10 pointer-events-none"
                >
                  <BsCheckCircle className="text-third text-xl flex-shrink-0" />
                  <p className="text-[15px]">{fact}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full z-10 bg-black/80" />
    </section>
  );
}
