"use client";

import FlatMenuList from "./FlatMenuList";

// "Services" dropdown — a flat list of the service pages, all equal weight.
// See navigation.js `servicesNavItem` for how the row list is built.
export default function ServicesMegaMenuContent({
  rows,
  pathname,
  menuActive,
  onLinkClick,
  onMouseEnter,
  onMouseLeave,
}) {
  return (
    <FlatMenuList
      rows={rows}
      pathname={pathname}
      menuActive={menuActive}
      onLinkClick={onLinkClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
}
