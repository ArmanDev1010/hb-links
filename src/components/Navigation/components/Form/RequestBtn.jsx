export default function RequestBtn({
  toggleModal,
  atTop,
  forceBlackBorder,
  forceWhiteBorder,
  isLightPage,
  menuActive,
}) {
  // forceWhiteBorder (the dropdown's green backdrop) has to win over
  // everything else, checked before forceBlackBorder/atTop: those two only
  // ever resolve to black once scrolled, even while the green bar is still
  // showing behind the nav.
  const borderColor = forceWhiteBorder
    ? "border-white"
    : forceBlackBorder
      ? "border-black"
      : atTop || menuActive
        ? "border-white"
        : "border-black";

  return (
    <button
      onClick={toggleModal}
      className={`relative group ${borderColor} 
      ${atTop && !isLightPage ? "hover:bg-transparent hover:text-white" : "hover:bg-white hover:text-black"}
       z-[9999] max-w-[300px] border-[2px] bg-third cursor-pointer px-6 py-[0.8125rem] rounded-md text-white
outline-none transition duration-200`}
    >
      <div className="text-[14px] pointer-events-none relative overflow-hidden text-center uppercase font-[600]">
        <div className="group-hover:-translate-y-[110%] transition duration-300">
          Free Consultation
        </div>
        <div className="translate-y-[110%] group-hover:translate-y-0 transition duration-300 absolute top-0 bottom-0 left-0 right-0">
          Free Consultation
        </div>
      </div>
    </button>
  );
}
