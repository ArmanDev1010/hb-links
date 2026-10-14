import Link from "next/link";
import { IoIosArrowRoundForward } from "react-icons/io";
import { TbArrowUpRight } from "react-icons/tb";
import { servicePages } from "@/data/service-pages";
import { contactInfo } from "@/data/contact";

// Overrides the layout's site-wide "index, follow", which would otherwise
// sit next to Next's own 404 noindex tag.
export const metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

const phone = contactInfo.find((item) => item.type === "Phone");

// The hero's white/green split, on the big "404".
const SPLIT_TEXT = {
  backgroundImage: "linear-gradient(137deg, #ffffff 50%, #0b8540 50%)",
  WebkitBackgroundClip: "text",
};

const buttonBase =
  "group flex items-center justify-center max-550:w-full w-fit 550:h-[46px] h-[42px] 700:px-12 px-10 uppercase 550:text-[12.5px] text-[12px] font-semibold tracking-[0.12em] transition duration-200 hover:bg-white hover:text-black";

// The hero button's rolling label.
function RollingLabel({ children }) {
  return (
    <span className="relative overflow-hidden text-center">
      <span className="group-hover:-translate-y-[110%] flex items-center gap-2 transition duration-300">
        {children}
        <IoIosArrowRoundForward className="text-xl" />
      </span>
      <span className="translate-y-[110%] group-hover:translate-y-0 absolute inset-0 transition duration-300">
        {children}
      </span>
    </span>
  );
}

// Every unmatched URL (and every notFound()) lands here. Black like the
// homepage hero, so the navbar's transparent white-text state reads over
// it without needing to know this is a 404.
export default function NotFound() {
  return (
    <section className="relative overflow-hidden min-h-screen bg-black text-neutral-50 flex items-center 700:pt-[9.5rem] pt-36 pb-20">
      <div className="max-w-[1680px] mx-auto w-full 700:px-[32px] px-[24px]">
        <div className="flex items-center gap-4 pointer-events-none">
          <span className="block h-2 w-2 shrink-0 bg-third" />
          <span className="550:text-[13px] text-[12px] text-neutral-300 uppercase font-light tracking-[0.3em]">
            Error 404 · Page not found
          </span>
          <span className="h-px flex-1 max-w-[640px] bg-gradient-to-r from-white/25 to-transparent" />
        </div>

        <p
          aria-hidden="true"
          className="font-gt mt-8 w-fit font-semibold leading-none tracking-tight text-transparent bg-clip-text pointer-events-none select-none text-[38vw] 550:text-[30vw] 1080:text-[17rem] 1600:text-[20rem]"
          style={SPLIT_TEXT}
        >
          404
        </p>

        <h1 className="font-gt mt-6 text-[26px] 400:text-[28px] 550:text-[36px] 800:text-[42px] font-semibold uppercase leading-[1.2] tracking-tight">
          This page doesn&rsquo;t exist
        </h1>
        <p className="mt-5 max-w-2xl font-light text-neutral-300 text-[15px] 700:text-base 900:text-[17px]">
          The link may be broken, or the page may have moved. Head back home,
          pick a service below, or call us at{" "}
          <a
            href={phone.href}
            className="font-medium text-white underline underline-offset-4 decoration-white/40 hover:decoration-white"
          >
            {phone.label}
          </a>
          .
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <Link
            href="/"
            className={`${buttonBase} border border-white bg-third text-white`}
          >
            <RollingLabel>Back to Home</RollingLabel>
          </Link>
          <Link
            href="/contact"
            className={`${buttonBase} border border-white/40 text-white`}
          >
            <RollingLabel>Get a Free Quote</RollingLabel>
          </Link>
        </div>

        <nav aria-label="Our services" className="mt-16 700:mt-20">
          <p className="uppercase text-[12px] text-white/50 tracking-[0.3em] pointer-events-none">
            Our services
          </p>
          {/* Each cell draws its own right/bottom edge, so a short last
              row leaves empty space rather than a filled-in block. */}
          <ul className="mt-5 grid grid-cols-1 550:grid-cols-2 1080:grid-cols-4 border-l border-t border-white/15">
            {servicePages.map(({ href, navLabel }) => (
              <li key={href} className="border-r border-b border-white/15">
                <Link
                  href={href}
                  className="group flex items-center justify-between gap-4 h-full px-5 py-5 text-[14px] 700:text-[15px] text-white/85 transition-colors duration-200 hover:bg-white/5 hover:text-white"
                >
                  {navLabel}
                  <TbArrowUpRight className="shrink-0 text-lg text-white/40 transition-colors duration-200 group-hover:text-third" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
