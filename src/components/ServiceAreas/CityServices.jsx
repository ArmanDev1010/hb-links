import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";

export default function CityServices({ city, trades }) {
  return (
    <section className="relative overflow-hidden py-16" id="city_services">
      <div className="max-w-[1680px] mx-auto w-full 700:px-[1rem] px-[0.5rem]">
        <div className="w-full lg:w-10/12 lg:mx-auto text-center pointer-events-none mb-14">
          <p className="text-sm uppercase font-xbold tracking-widest mb-4">
            Our Services in {city.name}
          </p>
          <h2 className="font-gt pb-1 font-semibold text-2xl 550:text-3xl lg:text-4xl leading-[1.15]">
            Every trade HB Links offers, available in {city.name}
          </h2>
        </div>

        <div className="grid grid-cols-1 700:grid-cols-2 gap-8 lg:gap-10 px-2">
          {trades.map((trade) => (
            <Link
              href={trade.href}
              key={trade.href}
              className="group flex flex-col border border-black/10 hover:border-third transition-colors duration-300"
            >
              <div className="relative h-[240px] 550:h-[280px] overflow-hidden bg-black">
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url(${trade.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                <h3 className="absolute bottom-5 left-6 right-6 text-white font-bold text-2xl leading-tight pointer-events-none">
                  {trade.title}
                </h3>
              </div>
              <div className="flex flex-col flex-grow p-6">
                <p className="text-gray-600 flex-grow pointer-events-none">
                  {trade.paragraph}
                </p>
                <span className="mt-6 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-third">
                  Explore {trade.title}
                  <BsArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
