export default function SubTradeOverview({ title, intro }) {
  if (!intro) return null;

  return (
    <section className="relative py-[40px] mt-[20px]" id="subtrade_overview">
      <div className="w-full lg:w-10/12 lg:mx-auto px-2 text-center pointer-events-none">
        <p className="text-sm uppercase font-xbold tracking-widest mb-4 text-gray-700">
          Overview
        </p>
        <h2 className="font-gt pb-1 font-semibold text-3xl lg:text-4xl leading-[1.15]">
          Expert {title} in Los Angeles
        </h2>
        <p className="mt-6 text-gray-700 text-lg lg:mx-auto lg:max-w-3xl">
          {intro}
        </p>
      </div>
    </section>
  );
}
