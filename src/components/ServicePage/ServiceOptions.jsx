import Link from "next/link";
import { IoIosArrowRoundForward } from "react-icons/io";
import Reveal from "@/components/UI/Reveal";
import { SECTION_TITLE, keepTogether } from "@/components/UI/titles";

const pad = (n) => String(n).padStart(2, "0");

// "Compare Options" — the forms a service comes in (ADU types, which garage,
// kinds of addition ...) as separate cards side by side, each with a few
// facts — size, time, what it suits — and, when another service page covers
// it in depth, a link there. Only pages whose data has `options` render it,
// right after How We Work. Like every section it carries the gap to the
// next one below it and none above (see Home/HomePage).
//
// The heading, then each card's content, rise in as they scroll into view
// (UI/Reveal); the cards' frames stay put.
export default function ServiceOptions({ eyebrow, heading, intro, items }) {
  // two side by side, three in a row, four across on wide screens (two by
  // two before that)
  const columns = {
    2: "700:grid-cols-2",
    3: "1080:grid-cols-3",
    4: "700:grid-cols-2 1280:grid-cols-4",
  }[items.length];

  return (
    <section className="relative bg-white pb-[100px] 1080:pb-[120px]" id="options">
      <div className="max-w-[1680px] mx-auto w-full 700:px-[32px] px-[24px]">
        <div className="flex flex-wrap max-1080:flex-col justify-between gap-x-10 gap-y-6 mb-12 1080:mb-16 pointer-events-none">
          <div className="flex-[1]">
            <Reveal className="flex items-center gap-4 mb-6 800:mb-8">
              <span className="block h-2 w-2 flex-shrink-0 bg-third"></span>
              <span className="550:text-[13px] text-[12.5px] text-fourth uppercase font-light tracking-[0.3em]">
                {eyebrow}
              </span>
              <span className="h-px flex-1 bg-gradient-to-r from-fourth/20 to-transparent"></span>
            </Reveal>
            <Reveal
              as="h2"
              delay={0.05}
              className={`${SECTION_TITLE} uppercase`}
            >
              {keepTogether(heading[0])}
              <br />
              {keepTogether(heading[1])}
            </Reveal>
          </div>
          <Reveal
            as="p"
            delay={0.1}
            className="1080:self-end text-base 550:text-[17px] leading-relaxed text-fourth max-w-3xl 1080:max-w-md 1280:max-w-xl"
          >
            {intro}
          </Reveal>
        </div>

        <ul className={`grid grid-cols-1 gap-4 700:gap-5 ${columns}`}>
          {items.map(({ title, description, facts, href, linkLabel }, index) => (
            <li
              key={title}
              className="flex border border-black/15 bg-white p-8 700:p-10"
            >
              <Reveal
                delay={0.06 * index}
                className="flex w-full flex-col"
              >
                <div className="flex items-start gap-4 pointer-events-none">
                  <span className="text-sm font-semibold tracking-wider text-third">
                    {pad(index + 1)}
                  </span>
                  <h3 className="text-base 800:text-lg font-semibold uppercase leading-tight tracking-tight">
                    {keepTogether(title)}
                  </h3>
                </div>
                <p className="mt-4 text-[15px] 1440:text-base leading-[1.75] text-fourth pointer-events-none">
                  {description}
                </p>
                <dl className="mt-6 mb-auto divide-y divide-black/10 border-y border-black/10 pointer-events-none">
                  {facts.map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex items-baseline justify-between gap-4 py-3"
                    >
                      <dt className="shrink-0 text-[10px] uppercase tracking-[0.3em] text-fourth">
                        {label}
                      </dt>
                      <dd className="text-right text-[13px] font-semibold uppercase tracking-tight">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
                {href && (
                  <Link
                    href={href}
                    className="group mt-6 flex w-fit items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] transition-colors duration-200 hover:text-third"
                  >
                    {linkLabel}
                    <IoIosArrowRoundForward className="text-xl transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                )}
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
