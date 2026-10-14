"use client";

import { VscWorkspaceTrusted } from "react-icons/vsc";

import EstimateForm from "./EstimateForm";
import ReachUsDirect from "./ReachUsDirect";
import { ESTIMATE_STEPS } from "@/data/estimate";

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

// The estimate section — label, heading and intro, the estimate
// form card, then Reach Us Direct — shared by the homepage (`dark`, on the
// footer's #111) and the /contact page (light, on #f5f4f1). The page also
// passes `headingAs="h1"` (the homepage already has its h1) and
// `showTrust` for the Google-reviews / licence line under the intro;
// `className` carries each one's own padding. Service pages pass their own
// `heading` — { firstLine, secondLine, italic }, e.g. "Ready to Build" /
// "Your" + italic "ADU?" — in place of the default one.
export default function EstimateSection({
  dark = false,
  headingAs: Heading = "h2",
  showTrust = false,
  heading,
  id,
  className = "",
}) {
  const softItalic = `font-light italic ${
    dark ? "text-white/45" : "text-black/45"
  }`;

  return (
    <section
      id={id}
      className={`relative ${
        dark ? "bg-[#111111] text-white" : "bg-[#f5f4f1] text-black"
      } ${className}`}
    >
      <div className="max-w-[1680px] mx-auto w-full px-[24px] 700:px-[32px]">
        <p className="max-400:hidden flex items-center gap-4 pointer-events-none mb-8">
          <span className="block h-2 w-2 flex-shrink-0 bg-third"></span>
          <span
            className={`550:text-[13px] text-[12.5px] uppercase font-light tracking-[0.3em] ${
              dark ? "text-white/50" : "text-fourth"
            }`}
          >
            Free Estimate - {ESTIMATE_STEPS.length} Quick Steps
          </span>
        </p>

        <div className="pointer-events-none">
          <Heading className="font-gt font-semibold tracking-tight leading-[1.2] text-[28px] 700:text-[34px] 1280:text-[42px]">
            {heading ? (
              <>
                {heading.firstLine}
                <br />
                {heading.secondLine}{" "}
                <span className={softItalic}>{heading.italic}</span>
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
          </Heading>
          <p
            className={`mt-6 max-w-xl text-[14.5px] 550:text-[15.5px] leading-relaxed ${
              dark ? "text-white/65" : "text-fourth"
            }`}
          >
            Tell us about your project and we&apos;ll come out for a free
            on-site estimate, then give you one fixed, written price. No
            pressure, no pushy sales visit.
          </p>

          {showTrust && (
            <div className="mt-6 flex flex-wrap max-700:flex-col 700:items-center gap-4 gap-y-3 text-[12.5px] text-fourth">
              <span className="flex items-center gap-2">
                <Stars /> <span className="font-semibold text-black">5.0 </span>
                <span>from 10+ Google reviews</span>
              </span>
              <span className="h-3.5 w-px bg-black/20 max-700:hidden" />
              <span className="flex items-center gap-2">
                <VscWorkspaceTrusted className="font-semibold text-black text-base" />
                <span>Licensed &amp; insured · CSLB #1144057</span>
              </span>
            </div>
          )}
        </div>

        <EstimateForm shadow={false} className="mt-10 1080:mt-12" />

        <ReachUsDirect dark={dark} className="mt-10 1080:mt-12" />
      </div>
    </section>
  );
}
