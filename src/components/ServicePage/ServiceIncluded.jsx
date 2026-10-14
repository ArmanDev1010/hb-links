const pad = (n) => String(n).padStart(2, "0");

// "What's Included" — a service page's spec sheet (duration, scope,
// license) beside its heading, then the six things every project of that
// type covers, numbered in a 3-column grid. Spaced like the homepage: it
// sits as close under the hero as About does, the heading leads below
// 1080px (the spec sheet follows it), and How We Work's top padding sets
// the gap after it.
export default function ServiceIncluded({ specs, heading, intro, items }) {
  return (
    <section className="relative bg-white mt-3 pt-10" id="included">
      <div className="max-w-[1680px] mx-auto w-full 700:px-[32px] px-[24px]">
        <div className="grid grid-cols-1 gap-12 1080:grid-cols-12 1080:items-start 1080:gap-16">
          <div className="1080:col-span-6">
            <div className="border border-black/15 bg-white pointer-events-none">
              <div className="flex items-center gap-3 border-b border-black/15 px-6 py-3.5 800:px-8">
                <span className="block h-1.5 w-1.5 shrink-0 bg-third" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
                  Service Specs
                </span>
              </div>
              <dl className="divide-y divide-black/15 px-6 800:px-8">
                {specs.map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-baseline justify-between gap-4 py-4"
                  >
                    <dt className="text-[10px] uppercase tracking-[0.3em] text-fourth">
                      {label}
                    </dt>
                    <dd className="text-right text-[15px] font-semibold uppercase tracking-tight">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="max-1080:order-first 1080:col-span-6 pointer-events-none">
            <div className="flex items-center gap-4 mb-8">
              <span className="block h-2 w-2 flex-shrink-0 bg-third"></span>
              <span className="550:text-[13px] text-[12.5px] text-fourth uppercase font-light tracking-[0.3em]">
                What&apos;s Included
              </span>
              <span className="h-px flex-1 bg-gradient-to-r from-fourth/20 to-transparent"></span>
            </div>
            <h2 className="font-gt uppercase font-semibold leading-[1.2] text-[32px] 550:text-[30px] 1080:text-[36px] 1600:text-[45px]">
              {heading[0]}
              <br />
              {heading[1]}
            </h2>
            <p className="mt-6 550:mt-8 text-base 550:text-[17px] leading-relaxed text-fourth max-w-xl">
              {intro}
            </p>
          </div>
        </div>

        <div className="mt-5 1080:mt-16 border border-black/15 bg-white">
          <ul className="grid grid-cols-1 gap-px bg-black/10 700:grid-cols-2 1080:grid-cols-3">
            {items.map(({ title, description }, index) => (
              <li
                key={title}
                className="flex items-start gap-4 bg-white p-8 700:p-10 pointer-events-none"
              >
                <span className="text-sm font-semibold tracking-wider text-third">
                  {pad(index + 1)}
                </span>
                <div>
                  <h3 className="text-base 800:text-lg font-semibold uppercase leading-tight tracking-tight">
                    {title}
                  </h3>
                  <p className="mt-3 text-[15px] 1440:text-base leading-[1.75] text-fourth">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
