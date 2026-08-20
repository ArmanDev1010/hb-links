export default function SubTradeScope({ scope = [] }) {
  if (!scope.length) return null;

  return (
    <section className="pt-12 pb-12" id="subtrade_scope">
      <div className="max-w-[1680px] 700:px-[1rem] mx-auto w-full px-[0.5rem]">
        <div className="1440:mx-auto 1440:w-[83.333%] w-full">
          <div className="w-full px-2 pointer-events-none">
            <p className="text-sm uppercase font-xbold tracking-widest mb-4 text-gray-700">
              What&apos;s Included
            </p>
            <h2 className="font-gt pb-1 font-semibold text-3xl lg:text-4xl leading-[1]">
              Scope of Work
            </h2>
          </div>
        </div>
        <div className="relative overflow-hidden pt-12 lg:pt-16 px-[8px]">
          <ul className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-8 items-stretch">
            {scope.map(({ title, description }, index) => (
              <li
                key={index}
                className="group flex flex-col h-full border-t border-l p-5 transition-colors border-black/25 hover:border-third pointer-events-none"
              >
                <p className="uppercase font-xbold tracking-widest mb-4 text-gray-500">
                  {index >= 9 ? "" : "0"}
                  {index + 1}
                </p>
                <h3 className="pb-1 font-bold text-2xl leading-tight mb-2">
                  {title}
                </h3>
                <p className="text-gray-600">{description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
