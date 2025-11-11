import Image from "next/image";
import Link from "next/link";
import whiteLogo from "@/../public/Logos/white_horizontal.png";
import blackLogo from "@/../public/Logos/black_horizontal.png";

export default function Logo({ atTop, isLightPage, showMenu, isMobileProjectPage }) {
  const logoSrc = atTop && !isLightPage || showMenu || atTop && isMobileProjectPage ? whiteLogo : blackLogo;
  return (
    <Link href="/" prefetch>
      <Image
        src={logoSrc}
        alt="Logo"
        width={100}
        height={50}
        className="w-[230px] h-auto max-900:w-[200px] max-700:w-[230px] max-550:w-[200px] max-400:w-[180px]"
        priority
      />
    </Link>
  );
}
