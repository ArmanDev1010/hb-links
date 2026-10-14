"use client";

import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";

import EstimateForm from "@/components/Contact/Estimate/EstimateForm";

// The estimate form — the same card as the homepage and /contact — in a
// dialog: from 1080px up it's wide enough for the blueprint panel beside
// the questions (but well short of the page's width); below that it's
// narrower, with just the questions (the card has no blueprint there). The
// card's own "Complete the Form" line is left off, since this header
// already says it.
export default function RequestModal({ handleClose }) {
  return (
    <div className="modal fixed inset-0 z-[100000] text-black">
      {/* Dim + blur the page behind the modal — the same treatment the mobile
          menu's own backdrop uses. */}
      <motion.div
        className="fixed inset-0 bg-black/55 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      />

      <div className="relative z-10 h-full w-full flex items-center justify-center p-4 700:p-8 pointer-events-none">
        <motion.div
          className="pointer-events-auto flex flex-col w-full max-w-[720px] 1080:max-w-[1040px] max-h-[90dvh] bg-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Header stays put; only the form below scrolls. */}
          <div className="flex items-center justify-between px-6 700:px-9 py-5 border-b border-black/10 shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 bg-third shrink-0" />
              <span className="uppercase text-[12px] font-bold tracking-[0.16em] pointer-events-none">
                Get an Estimate
              </span>
            </div>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close"
              className="w-9 h-9 grid place-items-center border border-black/15 hover:bg-black hover:text-white hover:border-black transition-colors duration-200 cursor-pointer"
            >
              <IoClose className="text-xl" />
            </button>
          </div>

          <div className="modal-scroll overflow-y-auto bg-[#f5f4f1] p-3 550:p-5 1080:p-6">
            <EstimateForm showLabel={false} shadow={false} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
