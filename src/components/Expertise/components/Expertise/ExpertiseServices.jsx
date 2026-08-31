import Link from "next/link";

export default function ExpertiseServices({
  title,
  services = [],
  servicesHeadline,
}) {
  if (!services.length) return null;

  return (
    <section className="pt-20 pb-12" id="expertise_services">
      <div className="max-w-[1680px] 700:px-[1rem] mx-auto w-full px-[0.5rem]">
        <div className="1440:mx-auto 1440:w-[83.333%] w-full">
          <div className="w-full lg:w-10/12 lg:mx-auto text-center pointer-events-none">
            <p className="text-sm uppercase font-xbold tracking-widest mb-4">
              Capabilities
            </p>
            <h2 className="font-gt pb-1 font-semibold text-3xl 700:text-4xl 1080:text-5xl leading-[1.2]">
              {services.length} {servicesHeadline || `Ways We Handle ${title}`}{" "}
              in <br className="550:hidden"></br> Los Angeles
            </h2>
          </div>
        </div>
        <div className="relative overflow-hidden pt-16 550:pt-20 lg:pt-24">
          <ul className="px-2 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10 items-stretch">
            {services.map(({ label, href, description }, index) => (
              <li key={index} className="group flex">
                <Link
                  href={href}
                  className="relative flex flex-col h-full w-full no-child-pointers lg:mb-14 mb-6"
                >
                  <div className="h-full w-full flex flex-col">
                    <div className="flex flex-col flex-grow pb-0.5 pl-6 pt-6 border-t border-l transition-colors border-black/25 group-hover:border-third">
                      <p className="uppercase font-xbold tracking-widest mb-6 text-gray-500">
                        {index >= 9 ? "" : 0}
                        {index + 1}
                      </p>
                      <div className="pointer-events-none mb-6">
                        <h2 className="pb-1 h-[120px] font-bold 550:text-3xl text-2xl leading-tight transition-colors group-hover:text-third">
                          {label}
                        </h2>
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
        </div>
      </div>
    </section>
  );
}
