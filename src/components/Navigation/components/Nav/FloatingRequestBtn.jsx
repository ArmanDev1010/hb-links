"use client";

import { useModal } from "@/context/ModalContext";
import Link from "next/link";

import { FiCheckSquare } from "react-icons/fi";
import { MdOutlineLocalPhone } from "react-icons/md";

export default function FloatingRequestBtn() {
  const { toggleModal } = useModal();

  return (
    <div className="1440:hidden fixed bottom-5 right-[24px] z-[9998] flex items-center gap-3">
      <button
        onClick={toggleModal}
        className="group flex items-center gap-4 px-7 py-3 rounded-full
      bg-white border-[1.5px] border-[#e5e1db] text-third tracking-[.01em] font-bold cursor-pointer shadow-md
      max-700:text-[15px] max-700:px-5"
      >
        <FiCheckSquare className="700:w-[20px] 700:h-[20px] w-[17px] h-[17px]" />
        Free Consultation
      </button>
      <Link
        href={"tel:+1 (818) 303-3555"}
        className="550:hidden w-[56px] h-[56px] rounded-full bg-third text-white border-[1px] border-[#f6f4ee40] cursor-pointer 
      flex items-center justify-center shadow-2xl"
      >
        <MdOutlineLocalPhone className="w-[20px] h-[20px]" />
      </Link>
    </div>
  );
}
