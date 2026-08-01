import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

import whiteLogo from "@/../public/Logos/white_horizontal.png";
import blackLogo from "@/../public/Logos/black_horizontal.png";
import onlyWhiteLogo from "@/../public/Logos/only_white_horizontal.png";

const FADE_DURATION_MS = 200;

export default function Logo({
  atTop,
  setActiveDropdown,
  activeDropdown,
  setMenuActive,
  menuActive,
  forceBlack,
}) {
  const [currentLogo, setCurrentLogo] = useState(whiteLogo);
  const [fade, setFade] = useState(false);
  const pendingLogoRef = useRef(null);
  const fadeTimeoutRef = useRef(null);

  const newLogo =
    activeDropdown || menuActive
      ? onlyWhiteLogo
      : forceBlack
        ? blackLogo
        : atTop
          ? whiteLogo
          : blackLogo;

  useEffect(() => {
    pendingLogoRef.current = newLogo;

    if (newLogo === currentLogo) return;

    if (fadeTimeoutRef.current) return;

    setFade(true);
    fadeTimeoutRef.current = setTimeout(() => {
      setCurrentLogo(pendingLogoRef.current);
      setFade(false);
      fadeTimeoutRef.current = null;
    }, FADE_DURATION_MS);
  }, [newLogo, currentLogo]);

  useEffect(() => {
    return () => {
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    };
  }, []);

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
