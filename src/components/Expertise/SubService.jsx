import Link from "next/link";

export default function SubService({ category, service }) {
  let { title, description, deliverables = [], capabilities = [] } = service;

  return (
    <div>
      <section
        className="relative overflow-hidden h-full flex items-center justify-center pt-30 bg-white"
        id="subservice_hero"
      >
        <div className="max-800:hidden absolute top-36 left-10 z-[100]">
          <Link
            href={category.href}
            className="text-sm font-medium uppercase tracking-[0.14em] hover:text-third transition-text duration-200 ease-in-out"
          >
            ← {category.title}
          </Link>
        </div>
        <div className="max-w-[1680px] w-full mx-auto px-[0.5rem] 700:px-[1rem] relative z-20 pt-30 pb-30 max-900:pb-20">
          <div className="mx-auto 1440:w-[83.333%] w-full">
            <div className="overflow-hidden w-full flex flex-wrap justify-center 700:text-center">
              <h2 className="px-2 uppercase font-bold tracking-tight 1280:text-6xl 700:text-5xl 550:text-4xl text-3xl pointer-events-none">
                {title}
              </h2>
              <p className="my-8 text-lg text-gray-700 only:mt-0 lg:mx-auto lg:max-w-2xl pointer-events-none">
                {description}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="900:pt-10" id="subservice_delivery">
        <div className="px-[5%] flex flex-col items-center pointer-events-none">
          <p className="mb-12 text-xl text-gray-400 font-medium border rounded-full w-fit px-10 max-700:text-lg">
            What We Deliver
          </p>
          <ul className="grid gap-y-[4rem] gap-x-[5rem] grid-cols-3 max-1280:grid-cols-2 max-800:grid-cols-1 max-800:gap-y-[2.5rem] max-550:gap-y-[2rem]">
            {deliverables.map((text, key) => (
              <li key={key} className="relative flex items-center gap-5">
                <p className="bg-third min-w-3 min-h-3"></p>
                <p className="text-lg max-550:text-base">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="1280:pt-30 pt-24 pb-16" id="subservice_capabilities">
        <p
          className="uppercase px-[5%] text-5xl font-[600] border-b-[1px] border-b-black/50 pb-5 w-full pointer-events-none
      max-1280:text-4xl max-700:text-3xl max-550:text-3xl"
        >
          What we Offer
        </p>
        <div className="flex flex-col items-end">
          <ul className="w-[70%] pointer-events-none max-700:w-[80%] max-550:w-full">
            {capabilities.map((text, key) => (
              <li
                key={key}
                className="py-4 pr-[5%] border-t-[1px] border-t-black/50 flex first:border-t-0 text-lg max-900:text-base max-550:px-[5%] max-550:text-[15px]"
              >
                <span>0{key + 1}</span>
                <span className="ml-16 max-550:ml-8 max-400:ml-6">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
