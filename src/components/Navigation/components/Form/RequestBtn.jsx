import { IoIosArrowRoundForward } from "react-icons/io";

// Primary CTA — opens the request modal, with a roll-up label hover. Built
// like the hero's "Get a Free Quote" button (Home/Hero): same height, type,
// tracking and arrow, but HB Green, turning Electric Lime with black text
// on hover (the user's call, 11-20).
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
        className={`group flex items-center justify-center border-1 border-third bg-third text-white
        h-full 550:min-h-[46px] min-h-[42px] px-10 1440:px-12 uppercase 550:text-[12.5px] text-[12px] font-semibold tracking-[0.12em]
        hover:bg-lime hover:border-lime hover:text-black transition duration-200 cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-2 ${className ? "w-full" : ""} ${main && "max-1280:!text-[11.5px] max-1280:px-6"} ${
          solid ? "focus-visible:outline-third" : "focus-visible:outline-lime"
        }`}
      >
        <div className="relative overflow-hidden text-center">
          <div className="group-hover:-translate-y-[110%] flex items-center gap-2 transition duration-300">
            Get a Free Estimate
            <IoIosArrowRoundForward className="text-xl" />
          </div>
          <div className="translate-y-[110%] h-fit group-hover:translate-y-0 absolute top-0 bottom-0 left-0 right-0 transition duration-300">
            <span>Get a Free Estimate</span>
          </div>
        </div>
      </button>
    </div>
  );
}
