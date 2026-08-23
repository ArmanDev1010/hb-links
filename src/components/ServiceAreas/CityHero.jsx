"use client";

import Link from "next/link";
import { BsCheckCircle, BsGeoAlt } from "react-icons/bs";
import { MdOutlineLocalPhone } from "react-icons/md";
import { useModal } from "@/context/ModalContext";
import { getCityImage } from "@/lib/seo";
import { getNearbyCities } from "@/lib/cities";

const TRUST_BADGES = [
  "Free On-Site Estimate",
  "Licensed & Insured",
  "Workmanship Guaranteed",
];

export default function CityHero({ city }) {
  const { toggleModal } = useModal();
  const image = getCityImage(city);
  // Drawn from the full roster, not just the priority tier with dedicated
  // pages — plain text (not links) so every nearby city reads the same way,
  // whether or not it has its own page.
  const nearby = getNearbyCities(city.name, 12, { allCities: true });

  return (
    <section
      className="relative overflow-hidden text-neutral-50 min-h-screen 550:pt-40 pt-36 pb-16 lg:pb-20"
      style={{
        backgroundColor: "#000000",
        backgroundImage: `url(${image})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      id="city_hero"
    >
      <div className="absolute top-0 left-0 w-full h-full z-10 bg-black/80" />

      <div className="relative z-20 mx-auto w-full 700:px-[1rem] px-[0.5rem]">
        <div className="mx-auto 1080:w-[83.333%] px-2 1080:px-0 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12 lg:gap-16 items-start">
          <div>
            <nav className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-white/60 550:mb-8 mb-12">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link
                href="/service-areas"
                className="hover:text-white transition-colors"
              >
                Service Areas
              </Link>
              <span>/</span>
              <span className="text-white pointer-events-none">
                {city.name}
              </span>
            </nav>

            <h1 className="pb-1 font-bold text-4xl 800:text-5xl leading-[1.1] max-w-3xl pointer-events-none">
              General Contractor in <br></br> {city.name}, CA
            </h1>
            <p className="mt-6 text-white/80 max-w-xl text-base 700:text-lg pointer-events-none">
              HB Links provides general building, electrical, plumbing, and
              low-voltage services to homeowners throughout {city.name} and
              the surrounding {city.countyName}, all under one contract and
              one point of contact.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                onClick={toggleModal}
                className="cursor-pointer max-550:w-full bg-third text-white border-[1.5px] border-third 700:px-[2.5rem] px-[2rem] py-[0.9rem] text-sm font-[500] uppercase tracking-[0.1em] hover:bg-white hover:text-black hover:border-white transition-all ease-[cubic-bezier(0.4,0,0.2,1)] duration-400"
              >
                Schedule a Free Consultation
              </button>
              <Link
                href="tel:+1 (818) 303-3555"
                className="flex items-center max-550:w-full max-550:justify-center max-550:text-[15px] gap-2.5 border-[1.5px] border-white/40 700:px-[2rem] px-[1.5rem] py-[0.9rem] text-sm font-[500] uppercase tracking-[0.1em] hover:border-white transition-all duration-400"
              >
                <MdOutlineLocalPhone className="w-[18px] h-[18px]" />
                <span className="max-550:mt-[2px]">(818) 303-3555</span>
              </Link>
            </div>

            <ul className="mt-12 grid grid-cols-1 700:grid-cols-2 gap-x-8 gap-y-3 max-w-2xl pointer-events-none">
              {TRUST_BADGES.map((badge) => (
                <li
                  key={badge}
                  className="flex items-start gap-2.5 text-white/85 text-sm 700:text-[15px] text-base"
                >
                  <BsCheckCircle className="text-third mt-0.5 flex-shrink-0" />
                  {badge}
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-white/20 bg-white/5 backdrop-blur-sm p-6 pointer-events-none">
            <p className="text-xs uppercase font-xbold tracking-widest text-white/50 mb-4">
              Service Location
            </p>
            <div className="flex items-center gap-2.5 mb-1">
              <BsGeoAlt className="text-third shrink-0" />
              <p className="font-bold text-lg">{city.name}, CA</p>
            </div>
            <p className="text-sm text-white/60 mb-5">{city.countyName}</p>
            <p className="text-sm text-white/80 border-t border-white/15 pt-4 mb-5">
              No extra travel fees for this area.
            </p>
            {nearby.length > 0 && (
              <>
                <p className="text-xs uppercase font-xbold tracking-widest text-white/50 mb-3">
                  Also Serving Nearby
                </p>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {nearby.map((c) => (
                    <li key={c.slug} className="text-sm text-white/85">
                      {c.name}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
