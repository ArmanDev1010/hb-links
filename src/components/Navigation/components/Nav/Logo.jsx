import Image from "next/image";
import Link from "next/link";

import blackLogo from "@/../public/Logos/black_horizontal.png";
import whiteLogo from "@/../public/Logos/white_horizontal.png";

export default function Logo({
  light,
  setActiveDropdown,
  setMenuActive,
  menuActive,
}) {
  const imgClass =
    "1280:w-[210px] 1080:w-[190px] w-[210px] h-auto max-700:w-[200px] max-400:w-[185px]";

  return (
    <div className="relative z-[100] flex items-center gap-4">
      <Link
        href="/"
        prefetch
        className="relative block"
        onClick={() => {
          if (typeof menuActive !== "undefined") setMenuActive(false);
          setActiveDropdown(null);
        }}
      >
        <Image src={blackLogo} alt="HB Links" className={imgClass} priority />
        <Image
          src={whiteLogo}
          alt=""
          aria-hidden="true"
          priority
          className={`${imgClass} absolute inset-0 transition-opacity duration-300 ${
            light ? "opacity-100" : "opacity-0"
          }`}
        />
      </Link>

      <span
        className={`max-1440:hidden h-[26px] w-px transition-colors duration-300 pointer-events-none ${
          light ? "bg-white/40" : "bg-ink/20"
        }`}
      />
      <span
        className={`font-gt max-1440:hidden text-[10px] uppercase tracking-[0.16em] pointer-events-none font-medium whitespace-nowrap transition-colors duration-300 ${
          light ? "text-white/80" : "text-ink/55"
        }`}
      >
        License #1144057
      </span>
    </div>
  );
}
