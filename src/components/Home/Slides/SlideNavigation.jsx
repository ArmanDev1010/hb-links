import { IoIosArrowBack } from "react-icons/io";

export default function SlideNavigation({
  activeIndex,
  totalSlides,
  slideToPrev,
  slideToNext,
  progressRef,
}) {
  return (
    <div
      className="absolute left-[100px] bottom-[15%] z-[10] text-sm 
    max-800:w-full max-800:left-0 max-800:px-[5%] max-800:bottom-[5%]"
    >
      <div className="flex items-center max-800:w-full">
        <button onClick={slideToPrev} className="cursor-pointer">
          <IoIosArrowBack size={17} />
        </button>
        <p className="mx-[1.3rem] w-[20px] pointer-events-none">
          0{activeIndex + 1}
        </p>
        <div className="autoplay-progress w-[15rem] h-[0.5px] bg-[hsla(47,36%,95%,.2)] max-1080:w-[200px] max-550:w-[150px] max-800:flex-[1]">
          <div
            ref={progressRef}
            className="h-full bg-white"
            style={{ width: `var(--progress)` }}
          />
        </div>
        <p className="mx-[1.3rem] w-[20px] pointer-events-none">
          0{activeIndex + 1 !== totalSlides ? activeIndex + 2 : 1}
        </p>
        <button onClick={slideToNext} className="cursor-pointer">
          <IoIosArrowBack size={17} className="rotate-180" />
        </button>
      </div>
    </div>
  );
}
