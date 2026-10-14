// Square menu / close button (mobile only). Outlined to match the phone icon
// square; fills solid black with a white X while the menu is open.
export default function MenuBtn({ setMenuActive, menuActive, light }) {
  const box = menuActive
    ? "bg-ink border-ink text-white"
    : light
      ? "border-white/50 text-white"
      : "border-ink/25 text-ink hover:bg-ink hover:text-white";

  const bar =
    "absolute left-0 top-1/2 w-full h-[1.5px] bg-current transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]";

  return (
    <button
      className={`1080:hidden relative z-[100] w-11 h-11 grid place-items-center border transition-colors duration-200 cursor-pointer ${box}`}
      aria-label={menuActive ? "Close menu" : "Open menu"}
      onClick={() => setMenuActive(!menuActive)}
    >
      <div className="relative w-[18px] h-[13px]">
        <span
          className={`${bar} ${
            menuActive
              ? "translate-y-[-50%] rotate-45"
              : "translate-y-[calc(-50%-5px)]"
          }`}
        />
        <span
          className={`${bar} translate-y-[-50%] transition-opacity duration-200 ${
            menuActive ? "opacity-0" : ""
          }`}
        />
        <span
          className={`${bar} ${
            menuActive
              ? "translate-y-[-50%] -rotate-45"
              : "translate-y-[calc(-50%+5px)]"
          }`}
        />
      </div>
    </button>
  );
}
