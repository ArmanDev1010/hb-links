import { IoIosArrowRoundForward } from "react-icons/io";

// Primary CTA — opens the request modal. Green fill with a roll-up label hover.
// Over a dark hero (`!solid`) it flips to white/black like the hero's button;
// once the bar is solid it flips to black/white instead.
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
        className={`group bg-third text-white flex items-center justify-center border-1
        h-full min-h-[44px] px-8 uppercase 550:text-[12.5px] text-[12px] font-semibold tracking-[0.12em]
        transition duration-200 cursor-pointer outline-none ${className ? "w-full" : null} ${main && "max-1280:!text-[11.5px] max-1280:px-6"} ${
          solid
            ? "border-black/15 hover:bg-black hover:text-white"
            : "border-white hover:bg-white hover:text-black"
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
