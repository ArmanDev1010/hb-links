import { IoIosArrowRoundForward } from "react-icons/io";

// Primary CTA — opens the request modal, with a roll-up label hover. Over a
// dark hero (`!solid`) it's the Electric Lime button, white on hover, like
// the hero's; once the bar is solid it's HB Green, Forest on hover
// (HB-LINKS-WEBSITE-COLORS.md 6.1).
export default function RequestBtn({
  toggleModal,
  solid,
  main,
  className = "",
}) {
  return (
    <div className={`${main && "max-900:hidden"} ${className}`}>
      <button
        onClick={toggleModal}
        className={`group flex items-center justify-center border-1
        h-full min-h-[44px] px-8 uppercase 550:text-[12.5px] text-[12px] font-semibold tracking-[0.12em]
        transition duration-200 cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-2 ${className ? "w-full" : null} ${main && "max-1280:!text-[11.5px] max-1280:px-6"} ${
          solid
            ? "bg-third text-white border-black/15 hover:bg-forest focus-visible:outline-third"
            : "bg-lime text-black border-lime hover:bg-white hover:border-white hover:text-black focus-visible:outline-lime"
        }`}
      >
        <div className="relative overflow-hidden text-center h-fit">
          <div className="group-hover:-translate-y-[110%] h-fit flex items-center gap-2 transition duration-300">
            <span>Get a Free Estimate</span>
            <IoIosArrowRoundForward className="text-xl -rotate-45" />
          </div>
          <div className="translate-y-[110%] h-fit group-hover:translate-y-0 absolute top-0 bottom-0 left-0 right-0 transition duration-300">
            <span>Get a Free Estimate</span>
          </div>
        </div>
      </button>
    </div>
  );
}
