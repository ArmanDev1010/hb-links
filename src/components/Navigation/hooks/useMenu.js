import { useEffect, useState } from "react";

export default function useMenu() {
  const [showMenu, setShowMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY >= 5);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showMenu ? "hidden" : "visible";
  }, [showMenu]);

  const handleClose = () => setShowMenu(false);

  return { showMenu, setShowMenu, isScrolled, handleClose };
}