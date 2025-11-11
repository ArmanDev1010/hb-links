import Link from "next/link";
import { MdLocalPhone } from "react-icons/md";

export default function PhoneLink({ isLightPage, menu, showMenu }) {
  const phoneBg = isLightPage ? "bg-black/10" : "bg-[hsla(48,36%,95%,.1)]";

  return (
    <Link
      href="tel:+18183033555"
      className={`group text-sm flex items-center gap-3 ml-auto pr-8 max-1440:pr-0 max-1080:text-base max-900:ml-0 ${
        menu ? "700:hidden max-700:text-base self-end max-550:text-sm" : "max-700:hidden"
      } ${showMenu && "text-white"}`}
    >
      <div
        className={`!text-base backdrop-blur-[4px] p-2 rounded-full ${phoneBg} max-1440:hidden`}
      >
        <MdLocalPhone />
      </div>
      <p className="transition-opacity duration-200 group-hover:opacity-70">
        +1 (818) 303-3555
      </p>
    </Link>
  );
}
