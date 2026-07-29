"use client";

export default function RequestBtn({ toggleModal, atTop }) {
  return (
    <button
      onClick={toggleModal}
      className={`relative group ${atTop ? "border-white" : "border-black"} z-[9999] max-w-[300px] border-[2px] cursor-pointer 
      1280:px-[50px] 1080:px-[30px] 700:px-[50px] 550:px-[70px] px-[50px] py-3 outline-none transition duration-200 hover:bg-third hover:!text-white`}
    >
      <div className="pointer-events-none relative overflow-hidden text-center 1280:text-[14px] 700:text-[12px] 550:text-lg text-base
       uppercase font-[600]">
        <div className="group-hover:-translate-y-[110%] transition duration-300">
          Free Estimate
        </div>
        <div className="translate-y-[110%] group-hover:translate-y-0 transition duration-300 absolute top-0 bottom-0 left-0 right-0">
          Free Estimate
        </div>
      </div>
    </button>
  );
}
