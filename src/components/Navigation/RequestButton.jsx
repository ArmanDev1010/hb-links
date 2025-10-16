export default function RequestButton({ menu, toggleModal, showMenu }) {
  return (
    <button
      onClick={toggleModal}
      className={`${showMenu ? "text-white" : ""} ${
        menu ? "_1080:hidden" : "max-_1080:hidden"
      } group py-[10px] px-[60px] font-medium border-[1px] border-white rounded-full relative cursor-pointer overflow-hidden`}
    >
      <p
        className="relative text-center top-0 group-hover:top-[-40px]"
        style={{ transition: "top .4s cubic-bezier(.33,1,.68,1)" }}
      >
        Contact us
      </p>
      <div
        className="w-full h-full absolute top-[110%] left-0 flex items-center justify-center group-hover:top-0"
        style={{ transition: "top .4s cubic-bezier(.33,1,.68,1)" }}
      >
        <p className="absolute">Contact us</p>
        <div
          className="bg-third w-[60%] h-full rounded-[50%] group-hover:w-full group-hover:rounded-[100px]"
          style={{ transition: "all .4s cubic-bezier(.33,1,.68,1)" }}
        ></div>
      </div>
    </button>
  );
}
