"use client";

import Link from "next/link";
import { BsCheckCircle } from "react-icons/bs";
import { MdOutlineLocalPhone } from "react-icons/md";
import { useModal } from "@/context/ModalContext";

export default function SubTradeHero({
  trade,
  title,
  description,
  image,
  benefits = [],
}) {
  const { toggleModal } = useModal();

  return (
    <section
      className="relative overflow-hidden text-neutral-50 pt-40 pb-16 lg:pb-20"
      style={{
        backgroundColor: "#000000",
        backgroundImage: `url(${image})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      id="subtrade_hero"
    >
      <div className="absolute top-0 left-0 w-full h-full z-10 bg-black/70" />

      <div className="relative z-20 mx-auto w-full 700:px-[1rem] px-[0.5rem]">
        <div className="mx-auto 1080:w-[83.333%] px-2 1080:px-0">
          <nav className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-white/60 mb-8">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href={trade.href}
              className="hover:text-white transition-colors"
            >
              {trade.title}
            </Link>
            <span>/</span>
            <span className="text-white pointer-events-none">{title}</span>
          </nav>

          <h1 className="pb-1 font-bold text-4xl 800:text-5xl 1080:text-6xl leading-[1.05] max-w-3xl pointer-events-none">
            {title}
          </h1>
          {description && (
            <p className="mt-6 text-white/80 max-w-xl text-base 700:text-lg pointer-events-none">
              {description}
            </p>
          )}

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              onClick={toggleModal}
              className="cursor-pointer bg-third text-white border-[1.5px] border-third 700:px-[2.5rem] px-[2rem] py-[0.9rem] text-sm font-[500] uppercase tracking-[0.1em] hover:bg-white hover:text-black hover:border-white transition-all ease-[cubic-bezier(0.4,0,0.2,1)] duration-400"
            >
              Schedule a Free Consultation
            </button>
            <Link
              href="tel:+1 (818) 303-3555"
              className="flex items-center gap-2.5 border-[1.5px] border-white/40 700:px-[2rem] px-[1.5rem] py-[0.9rem] text-sm font-[500] uppercase tracking-[0.1em] hover:border-white transition-all duration-400"
            >
              <MdOutlineLocalPhone className="w-[18px] h-[18px]" />
              (818) 303-3555
            </Link>
          </div>

          {benefits.length > 0 && (
            <ul className="mt-12 grid grid-cols-1 700:grid-cols-2 gap-x-8 gap-y-3 max-w-2xl pointer-events-none">
              {benefits.slice(0, 4).map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2.5 text-white/85 text-sm 700:text-[15px]"
                >
                  <BsCheckCircle className="text-third mt-0.5 flex-shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
