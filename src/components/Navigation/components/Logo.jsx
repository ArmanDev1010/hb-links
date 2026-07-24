import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

import whiteLogo from "@/../public/Logos/white_horizontal.png";
import blackLogo from "@/../public/Logos/black_horizontal.png";
import onlyWhiteLogo from "@/../public/Logos/only_white_horizontal.png";

export default function Logo({
  atTop,
  isLightPage,
  setActiveDropdown,
  activeDropdown,
  setMenuActive,
  menuActive,
}) {
  const [currentLogo, setCurrentLogo] = useState(whiteLogo);
  const [fade, setFade] = useState(false);

  const newLogo =
    atTop && !isLightPage && !activeDropdown && !menuActive
      ? whiteLogo
      : activeDropdown || menuActive
        ? onlyWhiteLogo
        : blackLogo;

  useEffect(() => {
    if (newLogo !== currentLogo) {
      setFade(true);
      const timeout = setTimeout(() => {
        setCurrentLogo(newLogo);
        setFade(false);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [newLogo, currentLogo]);

  return (
    <Link
      href="/"
      prefetch
      className="relative z-[100]"
      onClick={() => {
        if (typeof menuActive !== "undefined") {
          setMenuActive(false);
        }
        setActiveDropdown(null);
      }}
    >
      <div
        className={`transition-opacity duration-200 ${
          fade ? "opacity-0" : "opacity-100"
        }`}
      >
        <Image
          src={currentLogo}
          alt="Logo"
          className="w-[230px] h-auto max-900:w-[215px] max-700:w-[230px] max-550:w-[200px] max-400:w-[195px]"
          priority
        />
      </div>
    </Link>
  );
}
