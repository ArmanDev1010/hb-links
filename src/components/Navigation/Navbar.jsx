"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MdLocalPhone } from "react-icons/md";
import { usePathname } from "next/navigation";

import whiteLogo from "@/../public/Logos/white_horizontal.png";
import blackLogo from "@/../public/Logos/black_horizontal.png";

const NAV_LINKS = [
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [atTop, setAtTop] = useState(true);

  const isLightPage =
    pathname.startsWith("/projects") ||
    ["/terms-of-service", "/privacy-policy"].includes(pathname);
  const isContactPage = pathname === "/contact";
  const isNonStickyPage = pathname === "/services" || isContactPage;

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      setAtTop(currentY < 10);
      setVisible(currentY < lastScrollY || currentY < 10);
      lastScrollY = currentY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navBase = "px-[3%] w-full border-b transition-all duration-400";
  const stickyStyles = isNonStickyPage
    ? "!bg-primary"
    : `fixed z-[99] ${visible ? "translate-y-0" : "-translate-y-full"}`;
  const topStyles = atTop
    ? "bg-transparent"
    : "!bg-white !h-[65px] !text-black !border-black/10";
  const themeStyles = isLightPage
    ? "text-black border-black/10 h-[80px]"
    : "text-white border-white/30 h-[75px]";
  const navClasses = `${navBase} ${stickyStyles} ${topStyles} ${themeStyles}`;

  const phoneBg = isLightPage ? "bg-black/10" : "bg-[hsla(48,36%,95%,.1)]";
  const logoSrc = atTop && !isLightPage ? whiteLogo : blackLogo;

  return (
    <nav className={navClasses}>
      <div className="relative flex items-center h-full max-w-[1600px]">
        <div
          className={`flex items-center ${
            isLightPage || isContactPage ? "w-full" : "w-[75%]"
          }`}
        >
          <Link href="/" prefetch>
            <Image
              src={logoSrc}
              alt="Logo"
              width={100}
              height={50}
              className="w-[230px] h-auto"
              priority
            />
          </Link>

          <ul className="flex gap-[2.5rem] text-base ml-[7rem] font-[400]">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="capitalize transition-opacity duration-200 hover:opacity-70"
                  prefetch
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="tel:+18183033555"
            className="group flex items-center gap-3 ml-auto pr-8"
          >
            <div
              className={`text-base backdrop-blur-[4px] p-2 rounded-full ${phoneBg}`}
            >
              <MdLocalPhone />
            </div>
            <p className="text-sm transition-opacity duration-200 group-hover:opacity-70">
              +1 (818) 303-3555
            </p>
          </Link>
        </div>

        <div
          className={`flex items-center justify-between ${
            isContactPage ? "w-fit" : "w-[25%]"
          }`}
        >
          <ul className="pl-8 flex gap-5">
            <li className="capitalize cursor-pointer transition-opacity duration-200 hover:opacity-70">
              <Link href="https://www.instagram.com/">In</Link>
            </li>
          </ul>

          {!isContactPage && (
            <Link href="/contact" prefetch>
              <button className="group py-[10px] px-[60px] border rounded-full relative cursor-pointer overflow-hidden">
                <p className="relative text-center top-0 group-hover:top-[-40px] transition-[top] duration-[.4s] ease-[cubic-bezier(.33,1,.68,1)]">
                  Contact us
                </p>
                <div className="w-full h-full absolute top-[110%] left-0 flex items-center justify-center group-hover:top-0 transition-[top] duration-[.4s] ease-[cubic-bezier(.33,1,.68,1)]">
                  <p className="absolute text-white">Contact us</p>
                  <div className="bg-third w-[60%] h-full rounded-[50%] group-hover:w-full group-hover:rounded-[100px] transition-all duration-[.4s] ease-[cubic-bezier(.33,1,.68,1)]" />
                </div>
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
