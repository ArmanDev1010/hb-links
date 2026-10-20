import Link from "next/link";
import { IoIosArrowRoundForward } from "react-icons/io";
import Reveal from "@/components/UI/Reveal";

const pad = (n) => String(n).padStart(2, "0");

// "Often Paired With" — the other service pages most often planned
// alongside this one, each with a line on why they go together. The
// heading, then each card's content, rise in as they scroll into view
// (UI/Reveal); the cards themselves stay put (their white covers the grid
// lines).
export default function ServiceRelated({ services }) {
  return (
    <section className="relative bg-white pb-[100px] 1080:pb-[120px]" id="related">
      <div className="max-w-[1680px] mx-auto w-full 700:px-[32px] px-[24px]">
        <div className="flex flex-wrap max-1080:flex-col justify-between gap-x-10 gap-y-6 mb-12 1080:mb-16 pointer-events-none">
          <div className="flex-[1]">
            <Reveal className="flex items-center gap-4 mb-6">
              <span className="block h-2 w-2 flex-shrink-0 bg-third"></span>
              <span className="550:text-[13px] text-[12.5px] text-fourth uppercase font-light tracking-[0.3em]">
                Often Paired With
              </span>
              <span className="h-px flex-1 bg-gradient-to-r from-fourth/20 to-transparent"></span>
            </Reveal>
            <Reveal
              as="h2"
              delay={0.05}
              className="font-gt uppercase font-semibold leading-[1.2] tracking-tight text-[28px] 800:text-[36px]"
            >
              Related Services
            </Reveal>
          </div>
          <Reveal
            as="p"
            delay={0.1}
            className="1080:self-end text-[15px] 550:text-base text-fourth max-w-3xl 1080:max-w-sm 1280:max-w-lg"
          >
            Projects homeowners often plan alongside this one — same licensed
            team, same contract, one schedule.
          </Reveal>
        </div>

        <ul className="grid grid-cols-1 gap-px border border-black/15 bg-black/10 900:grid-cols-3">
          {services.map(({ navLabel, href, note }, index) => (
            <li key={href} className="flex">
              <Link
                href={href}
                className="group flex w-full bg-white p-8 700:p-10 transition-colors duration-200 hover:bg-third/5"
              >
                <Reveal
                  delay={0.08 * index}
                  className="flex w-full flex-col gap-4"
                >
                  <span className="text-sm font-semibold tracking-wider text-third">
                    {pad(index + 1)}
                  </span>
                  <h3 className="text-base 800:text-lg font-semibold uppercase leading-tight tracking-tight transition-colors duration-200 group-hover:text-third">
                    {navLabel}
                  </h3>
                  <p className="text-[15px] 1440:text-base leading-[1.75] text-fourth">
                    {note}
                  </p>
                  <span className="mt-auto pt-4 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em]">
                    View Service
                    <IoIosArrowRoundForward className="text-xl transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </Reveal>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
