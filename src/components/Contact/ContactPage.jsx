import ContactRequestForm from "@/components/UI/ContactRequestForm";
import { contactInfo } from "@/data/contact";
import Link from "next/link";

const phone = contactInfo.find((item) => item.type === "Phone");
const email = contactInfo.find((item) => item.type === "E-Mail");
const instagram = contactInfo.find((item) => item.type === "Instagram");

const direct = [phone, email, instagram];

const hours = [
  { label: "Office", value: "Sun–Sat · 7am–7pm" },
  { label: "Response", value: "Within 3 hours" },
  { label: "Estimates", value: "Free on-site" },
];

const isExternal = (href) => href?.startsWith("http");

function PanelHeading({ children }) {
  return (
    <div className="flex items-center gap-3 border-b border-white/15 px-6 700:px-10 py-5 pointer-events-none">
      <span className="block h-2 w-2 shrink-0 bg-third" />
      <span className="text-[11px] 550:text-[12px] font-bold uppercase tracking-[0.3em]">
        {children}
      </span>
    </div>
  );
}

export default function ContactPage() {
  return (
    <section className="relative bg-white 700:pt-[9.5rem] 700:pb-20 pt-36 pb-16">
      <div className="max-w-[1680px] mx-auto w-full 700:px-[32px] px-[24px]">
        {/* Intro */}
        <div className="pb-10 550:pb-12 pointer-events-none">
          <div className="flex items-center gap-4">
            <span className="block h-2 w-2 shrink-0 bg-third" />
            <span className="550:text-[13px] text-[12px] text-black/60 uppercase font-light tracking-[0.3em]">
              Start a Conversation
            </span>
            <span className="h-px flex-1 max-w-[640px] bg-gradient-to-r from-black/20 to-transparent" />
          </div>

          <h1 className="font-gt mt-6 text-[28px] 400:text-[30px] 550:text-[38px] 800:text-[42px] 1080:text-[45px] font-semibold uppercase leading-[1.2] tracking-tight text-black">
            Get a Free Quote <br />
            <span className="italic text-third">No Obligation</span>
          </h1>

          <p className="mt-6 max-w-2xl text-[14px] 400:text-[14.5px] 550:text-[15px] 700:text-[16.5px] text-black/75">
            Free on-site estimates anywhere across Los Angeles and the San
            Fernando Valley — share a few project details through the form, or
            reach us directly. Either way, we'll get on a call, talk through
            your project, and schedule a convenient time to meet.
          </p>
        </div>

        <div className="relative overflow-hidden 800:border 800:border-black/10 text-white">
          {/* Direct contact + hours */}
          <div className="grid grid-cols-1 800:grid-cols-2 max-800:gap-3">
            <div className="bg-black 800:border-r 800:border-white/15 max-800:border max-800:border-black/10">
              <PanelHeading>Reach Us Direct</PanelHeading>
              <ul className="flex flex-col gap-5 px-6 700:px-10 py-7 1080:py-10">
                {direct.map(({ icon, label, href }) => (
                  <li key={label} className="flex items-center gap-4 min-w-0">
                    <span className="flex h-9 w-9 800:h-[45px] 800:w-[45px] text-[16px] 800:text-[18px] shrink-0 items-center justify-center border border-white/20 bg-white/5">
                      {icon}
                    </span>
                    <Link
                      href={href}
                      target={isExternal(href) ? "_blank" : undefined}
                      rel={isExternal(href) ? "noopener noreferrer" : undefined}
                      className="font-gt min-w-0 break-words text-[13px] 550:text-[14px] 700:text-[15px] 1080:text-base font-semibold uppercase tracking-wide transition-colors duration-200 hover:text-third"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-black max-800:border max-800:border-black/10">
              <PanelHeading>Hours</PanelHeading>
              <ul className="px-6 700:px-10 py-2 1080:py-3 pointer-events-none">
                {hours.map(({ label, value }) => (
                  <li
                    key={label}
                    className="flex items-center justify-between gap-4 border-b border-white/15 py-5 800:py-6 last:border-b-0"
                  >
                    <span className="text-[10.5px] 550:text-[11.5px] 1080:text-[12px] uppercase tracking-[0.3em] text-white/60">
                      {label}
                    </span>
                    <span className="font-gt text-right text-[12.5px] 550:text-[14px] 1080:text-base font-semibold uppercase">
                      {value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Form card */}
          <div
            className="bg-black 800:border-t 800:border-white/15 max-800:border max-800:border-black/10 max-800:mt-3 
          p-2 550:p-6 700:p-10"
          >
            <div className="border border-black/10 bg-white text-black">
              <div className="flex items-center gap-2.5 px-6 700:px-9 py-5 border-b border-black/10">
                <span className="w-2 h-2 bg-third shrink-0" />
                <span className="text-[11px] 550:text-[12px] font-bold uppercase tracking-[0.3em]">
                  Get an Estimate
                </span>
              </div>
              <div className="p-6 800:px-9 800:pb-8">
                <ContactRequestForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
