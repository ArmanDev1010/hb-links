import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { MdOutlineLocalPhone } from "react-icons/md";
import { answerParts, getHomeFAQs } from "@/lib/seo";
import Reveal from "@/components/UI/Reveal";
import { FAQ_TITLE } from "@/components/UI/titles";
import SmoothDetails from "@/components/UI/SmoothDetails";
import FAQAnswer from "./FAQAnswer";

function FAQItem({ question, answer, index }) {
  const step = String(index + 1).padStart(2, "0");

  return (
    <Reveal as="li" delay={Math.min(index, 5) * 0.05}>
      <SmoothDetails className="group border border-black/15 bg-white transition-colors duration-200 hover:border-black/30 data-[state=open]:border-black/40">
        <summary className="flex cursor-pointer list-none items-center gap-5 px-5 py-5 transition-colors duration-200 700:gap-7 700:px-7 700:py-7 [&::-webkit-details-marker]:hidden">
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center border border-black/25 bg-[#F7F7F7] 700:h-12 700:w-12">
            <span className="text-[12px] font-bold tracking-tight text-third 700:text-[15px]">
              {step}
            </span>
          </span>
          <h3 className="flex-1 text-[14px] 550:text-base 700:text-[17px] 1080:text-lg font-semibold uppercase leading-[1.35] group-hover:text-third">
            {question}
          </h3>
          <span
            aria-hidden="true"
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-black/20 bg-white transition-colors duration-300 group-data-[state=open]:border-third group-data-[state=open]:bg-third"
          >
            <FiPlus className="h-4 w-4 text-black transition-all duration-300 group-data-[state=open]:rotate-45 group-data-[state=open]:text-white" />
          </span>
        </summary>
        <div className="faq-answer border-t border-black/15 px-5 pb-7 pt-6 700:px-7 700:pb-8">
          <div className="700:pl-[76px]">
            <p className="flex items-center text-[10px] uppercase tracking-[0.3em] text-fourth">
              <span
                aria-hidden="true"
                className="mr-3 inline-block h-px w-5 align-middle bg-third"
              ></span>
              Answer
            </p>
            <p className="mt-3 max-w-3xl text-[14px] 550:text-[15px] 700:text-[17px] leading-relaxed text-fourth">
              <FAQAnswer parts={answerParts(answer)} />
            </p>
          </div>
        </div>
      </SmoothDetails>
    </Reveal>
  );
}

// The homepage (and each area page) asks the area's questions about your
// project; each service page passes its own `faqs`, the `topic` the heading
// names ("Common Questions About ADU Construction in ..."), and its own
// intro line. An answer's `{{...}}` phrases open the estimate form
// (FAQAnswer).
//
// The heading, then the questions one after another, rise in as they
// scroll into view (UI/Reveal); a question slides open and shut
// (UI/SmoothDetails), its answer rising in as it opens (.faq-answer,
// globals.css).
export default function FAQ({
  area,
  faqs = getHomeFAQs(area),
  topic = "General Contracting",
  intro = `Answers to the questions homeowners ask most before choosing a general contractor for their project across ${area.name} and the San Fernando Valley.`,
}) {
  return (
    <section className="relative bg-white pb-[100px] 1080:pb-[120px]" id="faq">
      <div className="max-w-[1680px] mx-auto w-full 700:px-[32px] px-[24px]">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center pointer-events-none">
          <Reveal as="p" className="mb-6 800:mb-8 550:text-[13px] text-[12.5px] text-fourth uppercase font-light tracking-[0.3em] 800:text-center max-550:text-center">
            FAQ
          </Reveal>
          {/* the topic and the place each stay on one line */}
          <Reveal as="h2" delay={0.05} className={`${FAQ_TITLE} uppercase`}>
            Common Questions <br></br> About{" "}
            <span className="italic text-third whitespace-nowrap">{topic}</span>{" "}
            <br></br> in{" "}
            <span className="italic text-third whitespace-nowrap">
              {area.name}, CA
            </span>
          </Reveal>
          <Reveal as="p" delay={0.1} className="mt-8 max-w-2xl text-[15px] leading-relaxed text-fourth 700:text-[17px]">
            {intro}
          </Reveal>
        </div>

        <ol className="flex flex-col gap-3 mt-12 1080:mt-16 700:mb-4 mb-10 700:gap-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              index={index}
            />
          ))}
        </ol>

        <Reveal className="flex flex-wrap items-center justify-between gap-6 border border-black/15 bg-white px-5 py-5 700:px-7 700:py-7">
          <div className="flex items-center gap-5 700:gap-7">
            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center border border-black/25 bg-[#F7F7F7] 700:h-12 700:w-12">
              <MdOutlineLocalPhone className="text-lg text-third" />
            </span>
            <div className="pointer-events-none">
              <p className="550:text-[17px] 700:text-lg font-semibold uppercase leading-tight tracking-tight">
                Still have questions?
              </p>
              <p className="mt-1 text-sm text-fourth">
                Call us directly — we&apos;re open 7 days a week.
              </p>
            </div>
          </div>
          <Link
            href="tel:+1 (818) 303-3555"
            className="border-[1.5px] max-550:w-full max-550:text-center border-third bg-third px-[2rem] py-[0.9rem] 550:text-[13px] text-xs font-[500] uppercase tracking-[0.1em] text-white 
            transition-colors duration-200 border-black/25 text-black hover:bg-black hover:text-white"
          >
            Call (818) 303-3555
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
