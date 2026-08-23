"use client";

import Link from "next/link";
import { MdOutlineLocalPhone } from "react-icons/md";
import { useModal } from "@/context/ModalContext";
import { getNearbyCities } from "@/lib/cities";

export default function CityAreaCTA({ city }) {
  const { toggleModal } = useModal();
  // Drawn from the full 94-city roster, not just the priority tier with
  // dedicated pages. Rendered as plain, uniform text for every city — most
  // don't have their own page, and singling out the ones that do (via a
  // link/highlight) reads as "we don't serve the rest," which isn't the
  // message this section is going for.
  const nearby = getNearbyCities(city.name, 24, { allCities: true });

  return (
    <section
      className="relative bg-primary text-white mt-[20px] mb-8"
      id="city_area_cta"
    >
      <div className="max-w-[1680px] mx-auto w-full px-[1rem] py-14">
        <div className="mx-auto 1280:w-[83.33%] w-full flex flex-wrap items-center justify-between gap-x-10 gap-y-8">
          <div className="pointer-events-none">
            <p className="text-sm uppercase font-xbold tracking-widest mb-4 text-white/60">
              Free On-Site Estimate. No Commitment Required.
            </p>
            <h3 className="font-bold text-2xl 700:text-3xl leading-tight max-w-xl">
              Serving {city.name} and <br /> Nearby Areas
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-4">
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
        </div>

        {nearby.length > 0 && (
          <div className="mx-auto 1280:w-[83.33%] w-full mt-10 pt-8 border-t border-white/15">
            <p className="text-xs uppercase font-xbold tracking-widest text-white/50 mb-4 pointer-events-none">
              Also Serving Nearby
            </p>
            <div className="flex flex-wrap gap-3 pointer-events-none">
              {nearby.map((c) => (
                <span
                  key={c.slug}
                  className="px-4 py-2 border border-white/25 rounded-full text-sm text-white/85"
                >
                  {c.name}, CA
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
