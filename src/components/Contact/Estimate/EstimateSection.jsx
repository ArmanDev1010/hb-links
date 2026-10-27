"use client";

import { VscWorkspaceTrusted } from "react-icons/vsc";

import EstimateForm from "./EstimateForm";
import ReachUsDirect from "./ReachUsDirect";
import { ESTIMATE_STEPS } from "@/data/estimate";
import Reveal from "@/components/UI/Reveal";
import { SECTION_TITLE, keepTogether } from "@/components/UI/titles";

function Stars() {
  return (
    <span className="flex items-center gap-[2px]">
      {Array.from({ length: 5 }).map((_, key) => (
        <svg
          key={key}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{ fill: "oklch(75% 0.18 80)" }}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  );
}

// Reveal's stand-in where the intro shouldn't fade in: the /contact page's
// own intro is the first thing it paints, so it's there at once.
function Static({ as: Tag = "div", delay, ...props }) {
  return <Tag {...props} />;
}

// The estimate section — label, heading and intro, the estimate
// form card, then Reach Us Direct — shared by the homepage (`dark`, on the
// footer's #111) and the /contact page (light, on #f5f4f1). The page also
// passes `headingAs="h1"` (the homepage already has its h1) and
// `showTrust` for the Google-reviews / licence line under the intro;
// `className` carries each one's own padding. Service pages pass their own
// `heading` — { firstLine, secondLine, italic }, e.g. "Ready to Build" /
// "Your" + "ADU?" in green italic, like the other sections' headings — in
// place of the default one.
//
// Further down a page it rises in as it scrolls into view (UI/Reveal): the
// intro, then the form and Reach Us Direct. As the /contact page's top
// (`headingAs="h1"`) only the form and Reach Us Direct do.
export default function EstimateSection({
  dark = false,
  headingAs: Heading = "h2",
  showTrust = false,
  heading,
  id,
  className = "",
}) {
  const Intro = Heading === "h1" ? Static : Reveal;

  return (
    <section
      id={id}
      className={`relative ${
        dark ? "bg-[#111111] text-white" : "bg-[#f5f4f1] text-black"
      } ${className}`}
    >
      <div className="max-w-[1680px] mx-auto w-full px-[24px] 700:px-[32px]">
        <Intro
          as="p"
          className="max-400:hidden flex items-center gap-4 pointer-events-none mb-6 800:mb-8"
        >
          <span className="block h-2 w-2 flex-shrink-0 bg-third"></span>
          <span
            className={`550:text-[13px] text-[12.5px] uppercase font-light tracking-[0.3em] ${
              dark ? "text-white/50" : "text-fourth"
            }`}
          >
            Free Estimate - {ESTIMATE_STEPS.length} Quick Steps
          </span>
        </Intro>

        <div className="pointer-events-none">
          <Intro
            as={Heading}
            delay={0.05}
            className={SECTION_TITLE}
          >
            {heading ? (
              <>
                {keepTogether(heading.firstLine)}
                <br />
                {heading.secondLine}{" "}
                <span className="italic text-third">
                  {keepTogether(heading.italic)}
                </span>
              </>
            ) : (
              <>
                Let's Talk About Your Project
                {/* Get a Free Estimate
                <span className="max-400:hidden">,</span>
                <br className="400:hidden"></br> No Obligation{" "}
                <br className="max-550:hidden"></br>—{" "}
                <br className="400:hidden"></br>
                <span className={softItalic}>quoted honestly.</span> */}
              </>
            )}
          </Intro>
          <Intro
            as="p"
            delay={0.1}
            className={`mt-6 max-w-xl text-[14.5px] 550:text-[15.5px] leading-relaxed ${
              dark ? "text-white/65" : "text-fourth"
            }`}
          >
            Tell us about your project and we&apos;ll come out for a free
            on-site estimate, then give you one fixed, written price. No
            pressure, no pushy sales visit.
          </Intro>

          {showTrust && (
            <Intro
              delay={0.15}
              className="mt-6 flex flex-wrap max-700:flex-col 700:items-center gap-4 gap-y-3 text-[12.5px] text-fourth"
            >
              <span className="flex items-center gap-2">
                <Stars /> <span className="font-semibold text-black">5.0 </span>
                <span>from 10+ Google reviews</span>
              </span>
              <span className="h-3.5 w-px bg-black/20 max-700:hidden" />
              <span className="flex items-center gap-2">
                <VscWorkspaceTrusted className="font-semibold text-black text-base" />
                <span>Licensed &amp; insured · CSLB #1144057</span>
              </span>
            </Intro>
          )}
        </div>

        <Reveal delay={0.1} className="mt-10 1080:mt-12">
          <EstimateForm shadow={false} />
        </Reveal>

        <Reveal delay={0.1} className="mt-10 1080:mt-12">
          <ReachUsDirect dark={dark} />
        </Reveal>
      </div>
    </section>
  );
}
