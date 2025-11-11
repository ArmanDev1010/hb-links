export default function MenuBtn({
  showMenu,
  setShowMenu,
  isLightPage,
  atTop,
  isMobileProjectPage,
}) {
  const clicked = showMenu ? "menu_btn_clicked" : "";
  const lightPage =
    (isLightPage && !isMobileProjectPage) || !atTop
      ? "after:bg-black before:bg-black"
      : "after:bg-white before:bg-white";

  return (
    <div
      className={`1080:hidden menu_btn absolute left-1/2 -translate-x-1/2 w-10 h-14 cursor-pointer ${clicked} ${lightPage}
      max-900:relative max-900:left-auto max-900:top-auto max-900:-translate-x-0`}
      onClick={() => setShowMenu(!showMenu)}
    />
  );
}
