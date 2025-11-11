import Link from "next/link";

export default function ContactButton({ menu }) {
  return (
    <Link href="/contact" prefetch>
      <button
        className={`group py-[10px] px-[60px] border relative cursor-pointer overflow-hidden ${
          menu
            ? "rounded-0 text-xl py-[12px] px-[70px] hover:bg-third transition-bg duration-300 ease max-700:px-[60px] max-400:text-base max-400:px-[60px] max-400:py-[10px]"
            : "rounded-full"
        }`}
      >
        <p className="relative text-center top-0 group-hover:top-[-40px] transition-[top] duration-[.4s] ease-[cubic-bezier(.33,1,.68,1)]">
          Contact us
        </p>
        <div className="w-full h-full absolute top-[110%] left-0 flex items-center justify-center group-hover:top-0 transition-[top] duration-[.4s] ease-[cubic-bezier(.33,1,.68,1)]">
          <p className="absolute text-white">Contact us</p>
          {!menu && (
            <div className="bg-third w-[60%] h-full rounded-[50%] group-hover:w-full group-hover:rounded-[100px] transition-all duration-[.4s] ease-[cubic-bezier(.33,1,.68,1)]" />
          )}
        </div>
      </button>
    </Link>
  );
}
