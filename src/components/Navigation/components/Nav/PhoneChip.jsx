import Link from "next/link";
import { MdOutlineLocalPhone } from "react-icons/md";

const PHONE = "(818) 303-3555";

// Outlined "call us" pill showing the number. Used in the mobile bar and the
// mobile menu footer. `light` renders it white-on-transparent (over a hero);
// otherwise it's ink-on-cream.
export default function PhoneChip({ light, icon = false, className = "" }) {
  return (
    <Link
      href={`tel:+1 ${PHONE}`}
      className={`flex items-center justify-center gap-2 h-[44px] px-4 border text-[13px] font-semibold tracking-[0.06em] whitespace-nowrap transition-colors duration-200 ${
        light
          ? "border-white/50 text-white hover:bg-white hover:text-black"
          : "border-black/25 text-black hover:bg-black hover:text-white"
      } ${className}`}
    >
      {icon && <MdOutlineLocalPhone className="w-[17px] h-[17px] shrink-0 max-550:hidden" />}
      {PHONE}
    </Link>
  );
}
