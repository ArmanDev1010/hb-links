import Link from "next/link";

export default function SubTradeRelated({ trade, services = [] }) {
  if (!services.length) return null;

  return (
    <section className="pt-12 pb-12" id="subtrade_related">
      <div className="max-w-[1680px] 700:px-[1rem] mx-auto w-full px-[0.5rem]">
        <div className="1440:mx-auto 1440:w-[83.333%] w-full">
          <div className="w-full px-2 pointer-events-none">
            <p className="text-sm uppercase font-xbold tracking-widest mb-4 text-gray-700">
              {trade.title}
            </p>
            <h2 className="font-gt pb-1 font-semibold text-3xl lg:text-4xl leading-[1]">
              Explore More {trade.title} Services
            </h2>
          </div>
        </div>
        <div className="relative overflow-hidden pt-12 lg:pt-16">
          <ul className="px-2 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10 items-stretch">
            {services.map(({ label, href, description }, index) => (
              <li key={index} className="group flex">
                <Link
                  href={href}
                  className="relative flex flex-col h-full w-full no-child-pointers"
                >
                  <div className="h-full w-full flex flex-col">
                    <div className="flex flex-col flex-grow pb-6 pl-6 pt-6 border-t border-l transition-colors border-black/25 group-hover:border-third">
                      <div className="pointer-events-none mb-6">
                        <h3 className="pb-1 font-bold text-2xl leading-tight transition-colors group-hover:text-third">
                          {label}
                        </h3>
                        <p className="max-w-xl text-gray-600">{description}</p>
                      </div>
                      <div className="mt-auto">
                        <p className="relative w-fit uppercase font-bold text-base tracking-widest before:content-[''] before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-full before:bg-black group-hover:before:bg-third before:transition-all before:duration-300 before:ease-in-out">
                          Learn More
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <div className="px-2 mt-12 lg:mt-16">
            <Link
              href={trade.href}
              className="inline-block w-fit border-[1.5px] border-black px-[1.5rem] py-[0.75rem] text-[1rem] font-[500] uppercase tracking-[0.1em] hover:bg-third hover:text-white hover:border-third transition-all ease-[cubic-bezier(0.4,0,0.2,1)] duration-400"
            >
              View All {trade.title} Services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
