"use client";

import { useEffect, useState } from "react";
import RequestButton from "./RequestButton";
import Modal from "./Modal";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { MdLocalPhone } from "react-icons/md";
import logo from "@/../public/Logos/green/green_horizontal.png";

const NAV_LINKS = [
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [showModal, setShowModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [visible, setVisible] = useState(true);
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    document.body.style.overflow = showModal || showMenu ? "hidden" : "visible";
  }, [showModal, showMenu]);

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

  const toggleModal = () => setShowModal(!showModal);

  return (
    <>
      <nav
        className={`fixed z-[99] px-[3%] h-[75px] w-full border-b border-white/30 transition-all duration-400 ${
          visible ? "translate-y-0" : "-translate-y-full"
        } ${
          atTop ? "bg-transparent" : "bg-black/80 backdrop-blur-md"
        } text-white`}
      >
        <div className="relative flex items-center h-full">
          <div className="flex items-center w-[75%]">
            <Link href="/">
              <Image
                src={logo}
                alt="Logo"
                width={100}
                height={50}
                className="w-[230px] h-auto"
                priority
              />
            </Link>
            <ul className="flex gap-[2.5rem] text-base ml-[7rem]">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="capitalize transition-opacity duration-200 hover:opacity-70"
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
              <div className="text-base bg-[hsla(48,36%,95%,.1)] backdrop-blur-[4px] p-2 rounded-full">
                <MdLocalPhone />
              </div>
              <p className="text-sm transition-opacity duration-200 group-hover:opacity-70">
                +1 (818) 303-3555
              </p>
            </Link>
          </div>

          <div className="w-[25%] flex items-center justify-between">
            <ul className="pl-8 flex gap-5">
              {["In"].map((text, key) => (
                <li
                  key={key}
                  className="capitalize cursor-pointer transition-opacity duration-200 hover:opacity-70"
                >
                  <Link
                    href={
                      text === "fb"
                        ? "https://www.facebook.com/"
                        : text === "In"
                        ? "https://www.instagram.com/"
                        : ""
                    }
                  >
                    {text}
                  </Link>
                </li>
              ))}
            </ul>

            <Link href="mailto:info@hb-links.com">
              <button className="group py-[10px] px-[60px] border-[1px] border-white rounded-full relative cursor-pointer overflow-hidden">
                <p
                  className="relative text-center top-0 group-hover:top-[-40px]"
                  style={{ transition: "top .4s cubic-bezier(.33,1,.68,1)" }}
                >
                  Contact us
                </p>
                <div
                  className="w-full h-full absolute top-[110%] left-0 flex items-center justify-center group-hover:top-0"
                  style={{ transition: "top .4s cubic-bezier(.33,1,.68,1)" }}
                >
                  <p className="absolute">Contact us</p>
                  <div
                    className="bg-third w-[60%] h-full rounded-[50%] group-hover:w-full group-hover:rounded-[100px]"
                    style={{ transition: "all .4s cubic-bezier(.33,1,.68,1)" }}
                  ></div>
                </div>
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {showModal && (
          <Modal
            key="modal"
            showModal={showModal}
            handleClose={toggleModal}
            setShowMenu={setShowMenu}
          />
        )}
      </AnimatePresence>
    </>
  );
}
