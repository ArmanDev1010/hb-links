"use client";

import { BsCheckCircle } from "react-icons/bs";
import { useModal } from "@/context/ModalContext";
import { contactInfo } from "@/data/contact";

const license = contactInfo.find((item) => item.type === "License")?.label;

export default function CityTrust({ city }) {
  const { toggleModal } = useModal();

  const glance = [
    `${license} — licensed general contractor serving ${city.name}`,
    "Free written estimates with no obligation",
    "General building, electrical, plumbing, and low-voltage under one roof",
    `No extra travel fee anywhere within ${city.name}`,
  ];

  return (
    <div className="mt-3 py-10 pb-[40px] text-black max-550:pb-[30px]">
      <div className="w-full lg:w-10/12 lg:mx-auto px-2 text-center">
        <p className="ck-tagline text-sm uppercase font-xbold tracking-widest mb-4 pointer-events-none">
          Why {city.name} Homeowners Choose Us
        </p>
        <h2 className="font-gt pb-1 font-semibold text-3xl 400:text-4xl 1080:text-5xl leading-[1] pointer-events-none">
          Trusted by {city.name} Homeowners for <br></br>
          <span className="text-third"> Quality Results</span>
        </h2>
        <p className="mt-8 text-gray-700 lg:mx-auto lg:max-w-2xl pointer-events-none">
          HB Links is a general contracting company serving {city.name} and the
          surrounding {city.countyName}, providing renovation, electrical,
          plumbing, and low-voltage services under one contract. We communicate
          clearly, respect your property, and show up when we say we will.
        </p>

        <ul className="mt-10 mx-auto max-w-2xl grid grid-cols-1 700:grid-cols-2 gap-x-8 gap-y-4 text-left pointer-events-none">
          {glance.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 text-gray-700 text-sm 700:text-[15px]"
            >
              <BsCheckCircle className="text-third mt-0.5 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>

        <button
          onClick={toggleModal}
          className="cursor-pointer mt-10 bg-third text-white border-[1.5px] border-third px-[2.5rem] py-[0.9rem] text-sm font-[500] uppercase tracking-[0.1em] hover:bg-white hover:text-third transition-all ease-[cubic-bezier(0.4,0,0.2,1)] duration-400"
        >
          Schedule a Free Inspection{" "}
          <span className="max-550:hidden">in {city.name}</span>
        </button>
      </div>
    </div>
  );
}
