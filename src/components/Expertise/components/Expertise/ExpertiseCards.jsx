import Link from "next/link";
import { Fragment } from "react";

const cardLayouts = [
  { linked: true, showDivider: true },
  {
    showDivider: true,
    className: "1280:pl-3 pointer-events-none",
  },
  { linked: true, className: "1280:pl-3" },
];

function ExpertiseCard({
  title,
  description,
  linked = false,
  showDivider = false,
  className = "",
}) {
  const Card = linked ? Link : "section";

  return (
    <Card
      {...(linked ? { href: "/about" } : {})}
      className={`relative block xl:pr-2 ${className} ${
        linked ? "group no-child-pointers" : ""
      } ${
        showDivider
          ? "after:content-[''] after:absolute after:top-0 after:right-[-0.75rem] after:h-full after:w-[1px] after:bg-[#f6f4ee40] max-1280:after:hidden"
          : ""
      }`}
    >
      <div className="h-full w-full flex flex-col">
        <div className="flex flex-col flex-grow pb-0.5">
          <div className="lg:flex xl:block lg:mt-6 xl:mt-0 text-only">
            <h3 className="pb-1 font-semibold text-3xl leading-tight transition-colors has-hover:group-hover:text-neutral-50/70 first:mt-0 lg:mt-0 xl:mt-6 lg:w-1/2 xl:w-full">
              {title}
            </h3>
            <p className="mt-6 max-w-xl first:mt-0 lg:mt-0 xl:mt-6 lg:w-1/2 xl:w-full lg:pl-2 xl:pl-0">
              {description}
            </p>
          </div>
          {linked && (
            <div className="lg:w-1/2 xl:w-full lg:ml-auto xl:ml-0 lg:pl-2 xl:pl-0 mt-6 xl:mt-8">
              <p className="relative w-fit uppercase font-bold text-base tracking-widest before:content-[''] before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-full before:bg-white group-hover:before:bg-third before:transition-all before:duration-300 before:ease-in-out">
                About HB Links
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function ExpertiseCards({ cards = [] }) {
  if (!cards.length) return null;

  return (
    <div className="pt-24 550:pt-20 lg:pt-30">
      <div className="max-w-[1680px] 700:px-[1rem] mx-auto w-full px-[0.5rem]">
        <div className="px-2 grid grid-cols-1 xl:grid-cols-3 gap-4 xl:gap-x-6 xl:gap-y-14 1440:mx-auto 1440:w-[83.333%] w-full">
          {cards.map((card, index) => (
            <Fragment key={card.title}>
              <ExpertiseCard {...cardLayouts[index]} {...card} />
              {index < cards.length - 1 && (
                <span className="w-full h-full border-t my-10 block xl:hidden border-neutral-50/25" />
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
