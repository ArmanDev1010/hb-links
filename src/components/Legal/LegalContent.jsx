import Link from "next/link";
import { privacyPages } from "@/data/privacy";
import { legalDocuments } from "@/data/legal";
import { contactInfo } from "@/data/contact";
import { SITE_NAME, buildPageMetadata } from "@/lib/seo";

const license = contactInfo.find((item) => item.type === "License")?.label;
const phone = contactInfo.find((item) => item.type === "Phone");
const email = contactInfo.find((item) => item.type === "E-Mail");

const CONTACT_ID = "contact-us";

const pad = (number) => String(number).padStart(2, "0");

// "2026-10-08" → "October 8, 2026", read as UTC so it can't slip a day.
function formatDate(iso) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function Eyebrow({ children, className = "" }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className="block h-2 w-2 shrink-0 bg-third" />
      <span className="text-[12px] 550:text-[13px] text-black/60 uppercase font-light tracking-[0.3em]">
        {children}
      </span>
    </div>
  );
}

// The document's sections as numbered anchor links, then "Contact us".
function SectionLinks({ sections }) {
  return (
    <ol className="flex flex-col">
      {sections.map(({ id, heading }, index) => (
        <li key={id}>
          <a
            href={`#${id}`}
            className="group flex gap-3 py-1.5 text-[13.5px] leading-snug text-black/65 transition-colors duration-200 hover:text-black"
          >
            <span className="w-5 shrink-0 tabular-nums text-black/45 transition-colors duration-200 group-hover:text-third">
              {pad(index + 1)}
            </span>
            {heading}
          </a>
        </li>
      ))}
      <li>
        <a
          href={`#${CONTACT_ID}`}
          className="flex gap-3 py-1.5 pl-8 text-[13.5px] leading-snug text-black/65 transition-colors duration-200 hover:text-black"
        >
          Contact us
        </a>
      </li>
    </ol>
  );
}

const findPage = (slug) => privacyPages.find((item) => item.slug === slug);

// Each legal page's metadata — its route file (app/(legal)/<slug>/page.js)
// exports `metadata = legalMetadata("<slug>")`.
export function legalMetadata(slug) {
  const page = findPage(slug);
  return buildPageMetadata({
    title: `${page.label} | ${SITE_NAME}`,
    description: page.description,
    path: `/${slug}`,
  });
}

// A legal page (/terms-of-service, /privacy-policy, ...): the header
// (title, last-updated date, license), a switcher across all the legal
// pages, then the document — numbered sections with an "On this page" list
// (sticky beside the text from 1080px, a collapsible block above it below
// that) — and a contact panel. `slug` is the page's entry in
// data/privacy.js; its text comes from data/legal.
export default function LegalContent({ slug }) {
  const page = findPage(slug);
  const doc = legalDocuments[slug];

  return (
    <section className="relative bg-white text-black 700:pt-[9.5rem] 700:pb-24 pt-36 pb-16">
      <div className="max-w-[1680px] mx-auto w-full 700:px-[32px] px-[24px]">
        <header className="pb-10 550:pb-12 border-b border-black/10">
          <div className="flex items-center gap-4">
            <Eyebrow>Legal</Eyebrow>
            <span className="h-px flex-1 max-w-[640px] bg-gradient-to-r from-black/20 to-transparent" />
          </div>

          <h1 className="font-gt mt-6 text-[28px] 400:text-[30px] 550:text-[38px] 800:text-[42px] 1080:text-[45px] font-semibold uppercase leading-[1.2] tracking-tight">
            {page.label}
          </h1>

          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-[13px] 550:text-[14px]">
            <div className="flex gap-2">
              <dt className="text-fourth">Last updated</dt>
              <dd className="font-semibold">
                <time dateTime={page.updated}>{formatDate(page.updated)}</time>
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-fourth">Company</dt>
              <dd className="font-semibold">HB LINKS LLC · {license}</dd>
            </div>
          </dl>
        </header>

        <nav aria-label="Legal pages" className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {privacyPages.map(({ label, slug }) => {
              const isActive = slug === page.slug;
              return (
                <li key={slug}>
                  <Link
                    href={`/${slug}`}
                    aria-current={isActive ? "page" : undefined}
                    className={`inline-flex items-center h-9 px-4 border text-[11.5px] 550:text-[12px] font-semibold uppercase tracking-[0.12em] transition-colors duration-200 ${
                      isActive
                        ? "bg-black border-black text-white"
                        : "border-black/15 text-black/70 hover:border-black hover:text-black"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-10 1080:mt-14 1080:grid 1080:grid-cols-[260px_minmax(0,1fr)] 1080:gap-x-16 1280:gap-x-24">
          <aside className="max-1080:hidden">
            <nav aria-label="On this page" className="sticky top-[120px]">
              <Eyebrow className="mb-4">On this page</Eyebrow>
              <SectionLinks sections={doc.sections} />
            </nav>
          </aside>

          <div className="min-w-0 max-w-[780px]">
            <details className="group 1080:hidden mb-10 border border-black/10">
              <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <span className="text-[12px] font-bold uppercase tracking-[0.16em]">
                  On this page
                </span>
                <span
                  aria-hidden="true"
                  className="text-[18px] leading-none text-third transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <nav
                aria-label="On this page"
                className="border-t border-black/10 px-5 py-3"
              >
                <SectionLinks sections={doc.sections} />
              </nav>
            </details>

            <div className="text-[16.5px] 700:text-[19px] leading-[1.65] text-black/80">
              {doc.intro}
            </div>

            {doc.sections.map(({ id, heading, body }, index) => (
              <section
                key={id}
                id={id}
                aria-labelledby={`${id}-heading`}
                className="scroll-mt-[110px] mt-12 pt-10 border-t border-black/10"
              >
                <h2
                  id={`${id}-heading`}
                  className="font-gt flex gap-4 text-[19px] 550:text-[21px] 700:text-[24px] font-semibold uppercase leading-tight tracking-tight"
                >
                  <span className="text-third tabular-nums">
                    {pad(index + 1)}
                  </span>
                  <span>{heading}</span>
                </h2>
                <div className="legal-prose mt-5">{body}</div>
              </section>
            ))}

            <section
              id={CONTACT_ID}
              aria-labelledby={`${CONTACT_ID}-heading`}
              className="scroll-mt-[110px] mt-14 bg-black text-white"
            >
              <div className="flex items-center gap-3 border-b border-white/15 px-6 700:px-10 py-5">
                <span className="block h-2 w-2 shrink-0 bg-third" />
                <h2
                  id={`${CONTACT_ID}-heading`}
                  className="text-[11px] 550:text-[12px] font-bold uppercase tracking-[0.3em]"
                >
                  Contact us
                </h2>
              </div>
              <div className="px-6 700:px-10 py-7 1080:py-9">
                <p className="text-[15px] leading-relaxed text-white/75">
                  Questions about this page, or a request about your
                  information? Reach us directly:
                </p>
                <ul className="mt-6 flex flex-col gap-4">
                  {[phone, email].map(({ icon, label, href }) => (
                    <li key={label} className="flex items-center gap-4 min-w-0">
                      <span className="flex h-9 w-9 800:h-[45px] 800:w-[45px] text-[16px] 800:text-[18px] shrink-0 items-center justify-center border border-white/20 bg-white/5">
                        {icon}
                      </span>
                      <a
                        href={href}
                        className="font-gt min-w-0 break-words text-[14px] 700:text-[15px] 1080:text-base font-semibold uppercase tracking-wide transition-colors duration-200 hover:text-third"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-7 pt-6 border-t border-white/15 text-[13px] text-white/60">
                  HB LINKS LLC · Licensed California contractor · {license}
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
