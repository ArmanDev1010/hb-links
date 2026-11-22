import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { MdOutlineLocalPhone } from "react-icons/md";
import { answerParts, getHomeFAQs } from "@/lib/seo";
import Reveal from "@/components/UI/Reveal";
import { FAQ_TITLE } from "@/components/UI/titles";
import SmoothDetails from "@/components/UI/SmoothDetails";
import FAQAnswer from "./FAQAnswer";
import {
  Bars,
  BlueprintHouse,
  Grid,
  PlusMarks,
  Slab,
} from "@/components/UI/Deco";

// A question's white card on the panel, with a soft shadow under it.
const ROW =
  "border border-black/15 bg-white shadow-[0_14px_30px_-20px_rgba(11,15,13,0.45)]";

// The panel's own drawing sheet, fixed (no fade): a 24px grid, a stronger
// 120px one with a small green cross in the middle of each cell, and
// diagonal hatching down both sides.
function PanelPattern() {
  return (
    <>
      <svg
        aria-hidden="true"
        width="100%"
        height="100%"
        className="pointer-events-none absolute inset-0 -z-1"
      >
        <defs>
          <pattern
            id="faq-fine"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <path d="M24 0H0V24" fill="none" stroke="rgba(16,107,55,.10)" />
          </pattern>
          <pattern
            id="faq-sheet"
            width="120"
            height="120"
            patternUnits="userSpaceOnUse"
          >
            <rect width="120" height="120" fill="url(#faq-fine)" />
            <path d="M120 0H0V120" fill="none" stroke="rgba(16,107,55,.24)" />
            <path
              d="M54 60h12M60 54v12"
              stroke="#106B37"
              strokeWidth="1.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#faq-sheet)" />
      </svg>
      {["left-0", "right-0"].map((side) => (
        <div
          key={side}
          aria-hidden="true"
          className={`pointer-events-none absolute ${side} top-[28px] bottom-[28px] 700:top-[48px] 700:bottom-[48px] w-[18px] -z-1 opacity-55`}
          style={{
            background:
              "repeating-linear-gradient(-45deg, #106B37 0 4px, transparent 4px 12px)",
          }}
        />
      ))}
    </>
  );
}

// The panel's corners are cut at 45° — 28px on phones, 48px from 700px.
const CHAMFER =
  "[clip-path:polygon(0_0,calc(100%-28px)_0,100%_28px,100%_100%,28px_100%,0_calc(100%-28px))] 700:[clip-path:polygon(0_0,calc(100%-48px)_0,100%_48px,100%_100%,48px_100%,0_calc(100%-48px))]";

function FAQItem({ question, answer, index }) {
  const step = String(index + 1).padStart(2, "0");

  return (
    <Reveal as="li" delay={Math.min(index, 5) * 0.05}>
      <SmoothDetails className={`group ${ROW} transition-colors duration-200 hover:border-black/40 data-[state=open]:border-black/40`}>
        <summary className="flex cursor-pointer list-none items-center gap-5 px-5 py-5 transition-colors duration-200 700:gap-7 700:px-7 700:py-7 [&::-webkit-details-marker]:hidden">
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center border border-black/25 bg-concrete 700:h-12 700:w-12">
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
//
// The questions sit on a full-width panel cut at two corners, drawn like a
// sheet (PanelPattern); "Still have questions?" follows under it. Over
// the heading: a fading grid, a blueprint house each side, bars and a faint
// slab (the grid at half strength, the user's call, 11-20). `edgeTop` when
// it follows the dark contact band, which pulls down over the top of this
// section on a diagonal (Home/Contact): the heading starts below it.
export default function FAQ({
  area,
  faqs = getHomeFAQs(area),
  topic = "General Contracting",
  intro = `Answers to the questions homeowners ask most before choosing a general contractor for their project across ${area.name} and the San Fernando Valley.`,
  edgeTop = false,
  last = false,
}) {
  // `last`: right above the footer, whose diagonal pulls up into the
  // bottom of it (Footer) — 40px more room so it clears the panel.
  return (
    <section
      className={`wide-zoom relative isolate overflow-hidden bg-white ${
        last
          ? "pb-[100px] 700:pb-[130px] 1080:pb-[160px]"
          : "pb-[100px] 1080:pb-[120px]"
      } ${edgeTop ? "pt-[112px] 700:pt-[150px] 1080:pt-[196px]" : ""}`}
      id="faq"
    >
      <Grid mask="58% 30% at 50% 14%" className="inset-0 opacity-50" />
      {edgeTop && (
        <>
          <PlusMarks
            inset={{
              top: "top-[60px] 700:top-[110px] 1080:top-[160px]",
              bottom: "bottom-[30px] 700:bottom-[40px]",
            }}
          />
        </>
      )}
      <Slab
        opacity={0.05}
        className="max-700:hidden w-[200px] h-[700px] left-[20%] -top-[200px]"
      />
      <BlueprintHouse
        opacity={0.1}
        className="max-1080:hidden w-[440px] -left-[120px] top-[160px] 1280:top-[180px]"
      />
      <BlueprintHouse
        opacity={0.1}
        className="max-1080:hidden w-[440px] -right-[120px] top-[160px] 1280:top-[180px]"
      />
      <Bars
        widths={[260, 150, 60]}
        align="start"
        className="max-1080:hidden -left-[40px] top-[440px]"
      />
      <Bars
        widths={[120, 220, 340]}
        className="700:hidden -right-[30px] top-[90px] scale-[0.5] origin-top-right"
      />

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

        {/* The panel runs the full width of the section (out past the
            content's padding). */}
        <div
          className={`relative isolate mt-12 1080:mt-16 -mx-[24px] 700:-mx-[32px] bg-concrete px-[24px] py-[28px] 700:px-[48px] 700:py-[48px] 1080:px-[64px] ${CHAMFER}`}
        >
          <PanelPattern />
          <ol className="flex flex-col gap-3 700:gap-4">
            {faqs.map((faq, index) => (
              <FAQItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
                index={index}
              />
            ))}
          </ol>

        </div>

        {/* As it was before the redesign (the user's call, 11-20): under the
            panel, with the green call button. */}
        <Reveal className="mt-10 700:mt-4 flex flex-wrap items-center justify-between gap-6 border border-black/15 bg-white px-5 py-5 700:px-7 700:py-7">
          <div className="flex items-center gap-5 700:gap-7">
            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center border border-black/25 bg-concrete 700:h-12 700:w-12">
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
            transition-colors duration-200 hover:bg-black hover:text-white"
          >
            Call (818) 303-3555
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
