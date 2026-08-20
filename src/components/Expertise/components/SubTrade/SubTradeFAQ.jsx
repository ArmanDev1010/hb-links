"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { MdOutlineLocalPhone } from "react-icons/md";

function FAQItem({ question, answer, isOpen, onToggle }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    if (!contentRef.current) return;
    setHeight(isOpen ? contentRef.current.scrollHeight : 0);
  }, [isOpen]);

  return (
    <div className="border-t border-black/25 last:border-b">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex cursor-pointer items-center justify-between gap-6 py-6 text-left font-bold text-lg lg:text-xl"
      >
        <span>{question}</span>
        <span
          className={`text-third text-2xl leading-none flex-shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      <div
        className="overflow-hidden transition-[height] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ height }}
      >
        <p ref={contentRef} className="pb-6 text-gray-700 max-w-3xl">
          {answer}
        </p>
      </div>
    </div>
  );
}

export default function SubTradeFAQ({ faqs = [] }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (!faqs.length) return null;

  return (
    <section className="relative py-[60px]" id="subtrade_faq">
      <div className="max-w-[1680px] mx-auto w-full 700:px-[1rem] px-[0.5rem]">
        <div className="mx-auto 1280:w-[83.33%] w-full mb-10 pointer-events-none">
          <p className="1280:text-sm text-xs uppercase font-xbold tracking-widest mb-4 text-gray-700">
            FAQ
          </p>
          <h3 className="pb-1 font-bold text-4xl lg:text-5xl leading-none">
            Common Questions
          </h3>
        </div>
        <div className="mx-auto 1280:w-[83.33%] w-full px-2">
          <div className="flex flex-col">
            {faqs.map(({ question, answer }, index) => (
              <FAQItem
                key={index}
                question={question}
                answer={answer}
                isOpen={openIndex === index}
                onToggle={() =>
                  setOpenIndex((current) => (current === index ? null : index))
                }
              />
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-6 border-t border-l p-6 border-black/25">
            <div className="flex items-center gap-4">
              <p className="w-12 h-12 flex items-center justify-center border border-black/15 rounded-md text-xl flex-shrink-0 pointer-events-none">
                <MdOutlineLocalPhone />
              </p>
              <div className="pointer-events-none">
                <p className="font-bold text-lg">Still have questions?</p>
                <p className="text-gray-600 text-sm">
                  Call us directly. Real answers, no scripts.
                </p>
              </div>
            </div>
            <Link
              href="tel:+1 (818) 303-3555"
              className="bg-third text-white border-[1.5px] border-third px-[2rem] py-[0.9rem] text-sm font-[500] uppercase tracking-[0.1em] hover:bg-white hover:text-third transition-all ease-[cubic-bezier(0.4,0,0.2,1)] duration-400"
            >
              Call (818) 303-3555
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
