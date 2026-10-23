"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

import { privacyPages } from "@/data/privacy";
import { servicePages } from "@/data/service-pages";
import { contactInfo } from "@/data/contact";
import { useModal } from "@/context/ModalContext";
import { rotatingWords } from "@/data/rotatingWords";
import { IoIosArrowRoundForward } from "react-icons/io";
import RotatingWord from "@/components/UI/RotatingWord";
import whiteLogo from "@/../public/Logos/white_horizontal.png";

const license = contactInfo.find((item) => item.type === "License")?.label;
const phone = contactInfo.find((item) => item.type === "Phone");
const email = contactInfo.find((item) => item.type === "E-Mail");
const area = contactInfo.find((item) => item.type === "Area");
const instagram = contactInfo.find((item) => item.type === "Instagram");

const sitemapLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "Service Areas", href: "/#service_areas" },
  { label: "Contact", href: "/contact" },
];

// The icon and the text are one link, so either one can be clicked.
function LinkIcon({ info }) {
  let { icon, label, href } = info;
  return (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      className="group flex w-fit items-center gap-3"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/25 bg-white/10 backdrop-blur-md text-[16px] text-white transition-colors duration-200 group-hover:border-white/60 group-hover:bg-white/20">
        {icon}
      </span>
      <span className="text-[13px] 550:text-[14px] tracking-wide text-white/80 transition-colors duration-200 group-hover:text-white">
        {label}
      </span>
    </a>
  );
}

export default function Footer() {
  const { toggleModal } = useModal();

  return (
    <footer className="relative bg-[#111111] text-white border-t-5 border-third">
      <div className="max-w-[1680px] mx-auto w-full max-700:pb-20 pt-12 700:pt-16 700:px-[32px] px-[24px]">
        <div className="grid grid-cols-1 900:grid-cols-[1fr_0.5fr_0.8fr] 1080:grid-cols-[1.3fr_0.55fr_0.65fr_0.9fr] 1280:grid-cols-[1.25fr_0.6fr_0.65fr_0.9fr] gap-y-16 gap-x-10">
          <div className="max-900:order-1 flex flex-col gap-12 1080:gap-16">
            <div className="flex items-center gap-6">
              <Image
                src={whiteLogo}
                alt="HB Links"
                className="w-[200px] 900:w-[190px] 1280:w-[225px] h-auto shrink-0"
              />
              <span className="max-550:hidden h-8 w-px bg-white/25 shrink-0" />
              <p className="max-550:hidden text-white/70 leading-snug text-[17px] italic pointer-events-none max-900:flex-1">
                <RotatingWord
                  words={rotatingWords}
                  className="h-[1.2em] w-full 900:w-[180px]"
                  wordClassName="text-white font-semibold"
                />
              </p>
            </div>
            <div className="flex flex-col gap-4 pointer-events-none">
              <p className="uppercase text-[12px] text-white/50 tracking-[0.3em]">
                Credentials
              </p>
              <div className="flex flex-col gap-3">
                <p className="text-white/80 text-[15px]">License {license}</p>
                <p className="text-white/80 text-[15px]">
                  Licensed, bonded &amp; insured in California.
                </p>
              </div>
            </div>
            <button
              onClick={toggleModal}
              className="group border-1 border-white bg-third text-white flex items-center justify-center
                    550:h-[46px] h-[42px] w-fit 700:px-12 px-10 uppercase 550:text-[12.5px] text-[12px] font-semibold tracking-[0.12em]
                    hover:bg-white hover:text-black transition duration-200 cursor-pointer outline-none"
            >
              <div className="relative overflow-hidden text-center">
                <div className="group-hover:-translate-y-[110%] flex items-center gap-2 transition duration-300">
                  Get a Free Quote
                  <IoIosArrowRoundForward className="text-xl" />
                </div>
                <div className="translate-y-[110%] h-fit group-hover:translate-y-0 absolute top-0 bottom-0 left-0 right-0 transition duration-300">
                  <span>Get a Free Quote</span>
                </div>
              </div>
            </button>
          </div>

          <div className="max-900:order-3 flex flex-col gap-3">
            <p className="uppercase text-[12px] text-white/50 tracking-[0.3em] mb-2 pointer-events-none">
              Sitemap
            </p>
            {sitemapLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[15px] text-white/80 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="max-1080:hidden max-900:flex max-900:order-4 flex flex-col gap-3">
            <p className="uppercase text-[12px] text-white/50 tracking-[0.3em] mb-2 pointer-events-none">
              Services
            </p>
            {servicePages.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className="text-[15px] text-white/80 hover:text-white transition-colors"
              >
                {service.navLabel}
              </Link>
            ))}
          </div>

          <div className="max-900:order-2 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <p className="uppercase text-[12px] text-white/50 tracking-[0.3em] pointer-events-none">
                Service Area
              </p>
              <LinkIcon info={area} />
            </div>
            <div className="border-t border-white/15 pt-6 flex flex-col gap-4">
              <p className="uppercase text-[12px] text-white/50 tracking-[0.3em] pointer-events-none">
                Contact
              </p>
              <ul className="flex flex-col gap-3">
                {[phone, email, instagram].map((text, key) => (
                  <li key={key}>
                    <LinkIcon info={text} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div
          className="mt-16 py-6 border-t border-white/10 flex flex-wrap justify-center 900:justify-between items-center
        max-900:text-center gap-10 text-white/50"
        >
          <span className="font-gt uppercase tracking-[0.2em] text-[11px] pointer-events-none">
            © {new Date().getFullYear()} HB Links LLC. All rights reserved.
          </span>
          <ul className="flex gap-x-6 gap-y-3 capitalize flex-wrap justify-center text-[13px]">
            {privacyPages.map(({ label, slug }) => (
              <li key={slug}>
                <Link
                  href={`/${slug}`}
                  className="hover:text-white transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="font-gt text-[12px] uppercase tracking-[0.2em] pointer-events-none">
            Built by{" "}
            <span className="font-semibold text-white/80">Arman Manukyan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
