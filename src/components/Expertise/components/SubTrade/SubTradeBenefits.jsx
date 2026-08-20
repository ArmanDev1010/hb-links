import { BsCheckCircle } from "react-icons/bs";

export default function SubTradeBenefits({ benefits = [] }) {
  if (!benefits.length) return null;

  return (
    <section className="relative py-[60px]" id="subtrade_benefits">
      <div className="max-w-[1680px] mx-auto w-full 700:px-[1rem] px-[0.5rem]">
        <div className="mx-auto 1280:w-[83.33%] w-full mb-10 pointer-events-none">
          <p className="1280:text-sm text-xs uppercase font-xbold tracking-widest mb-4 text-gray-700">
            Why It Matters
          </p>
          <h3 className="pb-1 font-bold text-4xl lg:text-5xl leading-none">
            Built To Last, Done Right
          </h3>
        </div>
        <div className="mx-auto 1280:w-[83.33%] w-full px-2">
          <ul className="grid grid-cols-1 700:grid-cols-2 gap-6 pointer-events-none">
            {benefits.map((benefit, index) => (
              <li
                key={index}
                className="flex items-start gap-3 border-t border-l p-5 transition-colors border-black/25 hover:border-third"
              >
                <BsCheckCircle className="text-third text-xl mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">{benefit}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
