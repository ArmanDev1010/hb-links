import Reveal from "@/components/UI/Reveal";
import { BOXED_TITLE, keepTogether } from "@/components/UI/titles";

const pad = (n) => String(n).padStart(2, "0");

// "Know Before You Build" — the local rules and decisions behind a service
// (permits, size limits, what drives the cost), each a titled answer of a
// paragraph or two. It's the long-form part of a service page: from 1280px
// the heading holds beside the list while the entries scroll past (half
// the box until 1440px, so "Garage Conversions" fits on its line), all in
// a bordered box padded like the Areas We Service one (Home/ServiceAreas).
// Only pages whose data has a `guide` render it, and an area page its guide
// to building there (data/areas.js) the same way — both last, just before
// the footer. Like every section it carries the gap to the next one below
// it and none above (see Home/HomePage).
//
// The heading, then each entry, rise in as they scroll into view
// (UI/Reveal).
export default function ServiceGuide({ eyebrow, heading, intro, items }) {
  return (
    <section className="relative bg-white pb-[100px] 1080:pb-[120px]" id="guide">
      <div className="max-w-[1680px] mx-auto w-full 700:px-[32px] px-[24px]">
        <div className="grid grid-cols-1 gap-10 1280:grid-cols-12 1280:gap-16 border border-black/10 bg-[#fafafa] py-10 px-6 700:p-10 1080:p-14">
          <div className="1280:col-span-6 1440:col-span-5">
            <div className="1280:sticky 1280:top-[140px] pointer-events-none">
              <Reveal className="flex items-center gap-4 mb-6 800:mb-8">
                <span className="block h-2 w-2 flex-shrink-0 bg-third"></span>
                <span className="550:text-[13px] text-[12.5px] text-fourth uppercase font-light tracking-[0.3em]">
                  {keepTogether(eyebrow)}
                </span>
                <span className="h-px flex-1 bg-gradient-to-r from-fourth/20 to-transparent"></span>
              </Reveal>
              <Reveal
                as="h2"
                delay={0.05}
                className={`${BOXED_TITLE} uppercase`}
              >
                {keepTogether(heading[0])}
                <br />
                {keepTogether(heading[1])}
              </Reveal>
              <Reveal
                as="p"
                delay={0.1}
                className="mt-6 550:mt-8 text-base 550:text-[17px] leading-relaxed text-fourth max-w-xl"
              >
                {intro}
              </Reveal>
            </div>
          </div>

          <ol className="1280:col-span-6 1440:col-span-7 border-t border-black/15">
            {items.map(({ title, body }, index) => (
              <li
                key={title}
                className="border-b border-black/15 py-8 700:py-10 pointer-events-none"
              >
                <Reveal className="flex items-start gap-5 700:gap-8">
                  <span className="min-w-[1.5rem] shrink-0 pt-[3px] text-sm font-semibold tracking-wider text-third">
                    {pad(index + 1)}
                  </span>
                  <div>
                    <h3 className="text-base 800:text-lg font-semibold uppercase leading-tight tracking-tight">
                      {title}
                    </h3>
                    {[].concat(body).map((paragraph) => (
                      <p
                        key={paragraph}
                        className="mt-4 text-[15px] 1440:text-base leading-[1.75] text-fourth"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
