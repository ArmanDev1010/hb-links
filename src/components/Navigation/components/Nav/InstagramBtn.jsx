import Link from "next/link";
import { BsInstagram } from "react-icons/bs";

// Compact icon square in the nav's right-hand cluster (desktop ≥1280 only).
export default function InstagramBtn({ light }) {
  return (
    <Link
      href="https://www.instagram.com/hb_links/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="HB Links on Instagram"
      className={`max-1280:hidden w-11 h-[46px] grid place-items-center border transition-colors duration-200 ${
        light
          ? "border-white/50 text-white hover:bg-white hover:text-ink"
          : "border-ink/25 text-ink hover:bg-ink hover:text-white"
      }`}
    >
      <BsInstagram className="w-[17px] h-[17px]" />
    </Link>
  );
}
