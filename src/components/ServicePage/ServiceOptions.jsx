"use client";

import { useState } from "react";
import Link from "next/link";
import { IoIosArrowRoundForward } from "react-icons/io";
import Reveal from "@/components/UI/Reveal";
import { SECTION_TITLE, keepTogether } from "@/components/UI/titles";
import { Grid } from "@/components/UI/Deco";
import PlanDrawing, { hasPlan } from "./PlanDrawing";

const pad = (n) => String(n).padStart(2, "0");

// "Compare Options" — the forms a service comes in (ADU types, which garage,
// kinds of addition ...) as a switcher: pick one from the list (tabs) and see
// it drawn as a small plan (an option's `plan`, PlanDrawing: where on the lot
// it goes, what it adds) beside what it is, its facts and, when another
// service page covers it in depth, a link there. An option without a plan
// shows its number large instead. Every option's text is in the page (the
// ones not picked are hidden, not left out), so it all counts for search.
// Only pages whose data has `options` render it, right after How We Work.
// The tabs: a column beside the panel from 1080px, two across from 550px,
// one per row on phones (11-22, the user: "Garage Conversion" ran out of
// its box two across).
//
// No estimate button here (11-21, the user: tried, taken out). `layout:
// "cards"` (Design-Build's "Two Ways to Build", 11-21, the user: its design
// from before) shows them as cards side by side instead (OptionCards).
//
// A grid fades from the top right. `edgeBottom`: the dark contact band comes
// next and pulls up over the bottom of this section on a diagonal
// (Home/Contact) — room for it.
export default function ServiceOptions({
  eyebrow,
  heading,
  intro,
  items,
  layout = "tabs",
  edgeBottom = false,
}) {
  const [active, setActive] = useState(0);
  if (layout === "cards") return <OptionCards {...{ eyebrow, heading, intro, items, edgeBottom }} />;
  const id = (i) => `option-${i}`;

  // arrow keys move along the tabs (the WAI tabs pattern)
  const onKeyDown = (event) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const next = (active + step + items.length) % items.length;
    setActive(next);
    document.getElementById(`${id(next)}-tab`)?.focus();
  };

  return (
    <section
      className={`wide-zoom relative isolate bg-white ${
        edgeBottom
          ? "pb-[110px] 700:pb-[140px] 1080:pb-[160px]"
          : "pb-[100px] 1080:pb-[120px]"
      }`}
      id="options"
    >
      <Grid mask="42% 40% at 88% 8%" />
      <div className="max-w-[1680px] mx-auto w-full 700:px-[32px] px-[24px]">
        {/* the heading, with the intro beside it */}
        <div className="grid grid-cols-1 1080:grid-cols-12 gap-x-16 gap-y-6 1080:items-end pointer-events-none">
          <div className="1080:col-span-6">
            <Reveal className="flex items-center gap-4 mb-6 800:mb-8">
              <span className="block h-2 w-2 flex-shrink-0 bg-third"></span>
              <span className="550:text-[13px] text-[12.5px] text-fourth uppercase font-light tracking-[0.3em]">
                {eyebrow}
              </span>
              <span className="h-px flex-1 bg-gradient-to-r from-fourth/20 to-transparent"></span>
            </Reveal>
            <Reveal as="h2" delay={0.05} className={`${SECTION_TITLE} uppercase`}>
              {keepTogether(heading[0])}
              <br />
              {keepTogether(heading[1])}
            </Reveal>
          </div>
          <Reveal
            as="p"
            delay={0.1}
            className="1080:col-span-6 text-base 550:text-[17px] leading-relaxed text-fourth max-w-xl 1080:justify-self-end"
          >
            {intro}
          </Reveal>
        </div>

        {/* the options, and the one picked beside them */}
        <div className="mt-10 1080:mt-14 grid grid-cols-1 1080:grid-cols-12 gap-6 1080:gap-10">
          <Reveal delay={0.1} className="1080:col-span-4">
            <div
              role="tablist"
              aria-label={heading.join(" ")}
              aria-orientation="vertical"
              onKeyDown={onKeyDown}
              className="grid grid-cols-1 550:grid-cols-2 1080:grid-cols-1 gap-2 1080:gap-0 1080:border-t 1080:border-black/10"
            >
              {items.map(({ title }, i) => {
                const on = i === active;
                return (
                  <button
                    key={title}
                    id={`${id(i)}-tab`}
                    role="tab"
                    type="button"
                    aria-selected={on}
                    aria-controls={id(i)}
                    tabIndex={on ? 0 : -1}
                    onClick={() => setActive(i)}
                    className={`group flex items-center gap-4 text-left cursor-pointer transition-colors duration-200 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-third
                      max-1080:border max-1080:px-4 max-1080:py-3.5 1080:border-b 1080:border-black/10 1080:py-5 ${
                        on
                          ? "max-1080:border-third max-1080:bg-third/5"
                          : "max-1080:border-black/15 hover:max-1080:border-black/40"
                      }`}
                  >
                    <span className={`text-[12px] font-semibold tracking-wider ${on ? "text-third" : "text-fourth/70"}`}>
                      {pad(i + 1)}
                    </span>
                    <span
                      className={`flex-1 text-[13px] 550:text-[14px] 1080:text-[16px] font-semibold uppercase leading-tight tracking-tight transition-colors duration-200 ${
                        on ? "text-third" : "text-black group-hover:text-third"
                      }`}
                    >
                      {keepTogether(title)}
                    </span>
                    <IoIosArrowRoundForward
                      aria-hidden="true"
                      className={`max-1080:hidden text-2xl transition-all duration-200 ${
                        on
                          ? "text-third translate-x-0 opacity-100"
                          : "-translate-x-2 opacity-0 group-hover:opacity-60 group-hover:translate-x-0"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={0.15} className="1080:col-span-8">
            {items.map(({ title, description, facts, href, linkLabel, plan }, i) => (
              <div
                key={title}
                id={id(i)}
                role="tabpanel"
                aria-labelledby={`${id(i)}-tab`}
                hidden={i !== active}
                className="grid grid-cols-1 800:grid-cols-2 border border-black/15 bg-white"
              >
                {/* the drawing */}
                <div className="relative isolate overflow-hidden flex items-center justify-center bg-concrete px-6 py-8 max-800:border-b 800:border-r border-black/15">
                  <Grid tone="card" mask="70% 70% at 50% 50%" />
                  {hasPlan(plan) ? (
                    <div className="w-full max-w-[440px]">
                      <PlanDrawing plan={plan} title={title} />
                    </div>
                  ) : (
                    <p
                      aria-hidden="true"
                      className="font-gt font-semibold leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(16,107,55,0.55)] text-[110px] 700:text-[150px]"
                    >
                      {pad(i + 1)}
                    </p>
                  )}
                </div>
                {/* what it is, its facts, where to read more */}
                <div className="flex flex-col p-6 700:p-8">
                  <h3 className="text-[19px] 800:text-[21px] font-semibold uppercase leading-tight tracking-tight">
                    {keepTogether(title)}
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.7] text-fourth">{description}</p>
                  <dl className="mt-6 border-t border-black/10">
                    {facts.map(({ label, value }) => (
                      <div
                        key={label}
                        className="flex items-baseline justify-between gap-4 border-b border-black/10 py-2.5"
                      >
                        <dt className="shrink-0 text-[10px] uppercase tracking-[0.3em] text-fourth">{label}</dt>
                        <dd className="text-right text-[13px] font-semibold uppercase tracking-tight">{value}</dd>
                      </div>
                    ))}
                  </dl>
                  {href && (
                    <Link
                      href={href}
                      className="group mt-auto pt-6 flex w-fit items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] transition-colors duration-200 hover:text-third"
                    >
                      {linkLabel}
                      <IoIosArrowRoundForward className="text-xl transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// The options as cards side by side (the section's design before 11-20,
// brought back for Design-Build's "Two Ways to Build"): the heading with the
// intro beside it, then each option's number, name, what it is and its
// facts in a bordered card.
function OptionCards({ eyebrow, heading, intro, items, edgeBottom }) {
  // two side by side, three in a row, four across on wide screens (two by
  // two before that)
  const columns = {
    2: "700:grid-cols-2",
    3: "1080:grid-cols-3",
    4: "700:grid-cols-2 1280:grid-cols-4",
  }[items.length];

  return (
    <section
      className={`wide-zoom relative bg-white ${edgeBottom ? "pb-[110px] 700:pb-[140px] 1080:pb-[160px]" : "pb-[100px] 1080:pb-[120px]"}`}
      id="options"
    >
      <div className="max-w-[1680px] mx-auto w-full 700:px-[32px] px-[24px]">
        <div className="flex flex-wrap max-1080:flex-col justify-between gap-x-10 gap-y-6 mb-12 1080:mb-16 pointer-events-none">
          <div className="flex-[1]">
            <Reveal className="flex items-center gap-4 mb-6 800:mb-8">
              <span className="block h-2 w-2 flex-shrink-0 bg-third"></span>
              <span className="550:text-[13px] text-[12.5px] text-fourth uppercase font-light tracking-[0.3em]">{eyebrow}</span>
              <span className="h-px flex-1 bg-gradient-to-r from-fourth/20 to-transparent"></span>
            </Reveal>
            <Reveal as="h2" delay={0.05} className={`${SECTION_TITLE} uppercase`}>
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
            <li key={title} className="flex border border-black/15 bg-white p-8 700:p-10">
              <Reveal delay={0.06 * index} className="flex w-full flex-col">
                <div className="flex items-start gap-4 pointer-events-none">
                  <span className="text-sm font-semibold tracking-wider text-third">{pad(index + 1)}</span>
                  <h3 className="text-base 800:text-lg font-semibold uppercase leading-tight tracking-tight">{keepTogether(title)}</h3>
                </div>
                <p className="mt-4 text-[15px] 1440:text-base leading-[1.75] text-fourth pointer-events-none">{description}</p>
                <dl className="mt-6 mb-auto divide-y divide-black/10 border-y border-black/10 pointer-events-none">
                  {facts.map(({ label, value }) => (
                    <div key={label} className="flex items-baseline justify-between gap-4 py-3">
                      <dt className="shrink-0 text-[10px] uppercase tracking-[0.3em] text-fourth">{label}</dt>
                      <dd className="text-right text-[13px] font-semibold uppercase tracking-tight">{value}</dd>
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
