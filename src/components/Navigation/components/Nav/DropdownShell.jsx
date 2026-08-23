"use client";

import { useLayoutEffect, useRef, useState } from "react";

// Owns the mechanics shared by every nav dropdown — positioning, open/close
// height animation, mobile/desktop wrapper — so the mega-menus only need to
// supply their own content, not reimplement this each time. On desktop this
// renders as a full-viewport-width green bar (fixed, not anchored under the
// trigger) so it can never overflow past the edge of the screen regardless
// of which trigger opened it or how narrow the desktop viewport is. The
// bar's background paints from the very top of the viewport — behind the
// nav row itself, which goes transparent while a dropdown is open — and the
// actual content is pushed below the nav via padding-top (not margin-top),
// so the color, not just the content, shows through behind the logo/links.
// On mobile it stays a plain flat list over the existing full-screen menu
// backdrop (no card chrome needed there).
//
// Structure matters here: the height-animated `outer` div must carry NO
// padding/border of its own. A box with `height: 0` still renders at least
// its own padding+border (CSS can't shrink below that floor), so a closed
// dropdown would render as a small solid box instead of vanishing. The
// card's padding/border/background live one level down on `card`, which
// gets correctly clipped to nothing by the outer's `overflow-hidden` when
// height is 0, since that's a parent clipping a child, not a box clipping
// its own required padding.
// Open/close is entirely driven by `active` — hover handling lives on the
// trigger `<li>` and on each mega-menu's own content wrapper in NavLinks,
// not here, so there's exactly one place deciding when a dropdown should
// be open.
//
// On desktop, NavLinks mounts one of these PER dropdown-typed trigger
// (Services, Service Areas, ...) rather than sharing one instance across
// triggers, so switching from one open dropdown to another is two
// independent transitions — the old one closes while the new one opens —
// instead of a single instance morphing its height directly from one
// panel's size to the other's. Whichever one is currently `active` is
// raised above the other shells (but still kept under the trigger row's
// own z-20 icons/links — see NavLinks — so an open bar never paints over
// the trigger that opened it) so the opening panel visibly comes down in
// front while the closing one recedes behind it.
export default function DropdownShell({ active, isMobile, children }) {
  const cardRef = useRef(null);
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    if (!contentRef.current || !cardRef.current) return;
    const cardStyles = window.getComputedStyle(cardRef.current);
    const gap =
      parseFloat(cardStyles.marginTop) +
      parseFloat(cardStyles.paddingTop) +
      parseFloat(cardStyles.paddingBottom);
    const contentHeight = contentRef.current.scrollHeight;
    setHeight(active ? contentHeight + gap + 2 : 0);
  }, [active, isMobile]);

  return (
    <div
      className={`overflow-hidden transition-[height] duration-300 ease-[cubic-bezier(0,0,0.2,1)] pointer-events-none 1080:fixed 1080:top-0 1080:left-0 1080:w-full ${
        active ? "1080:z-[15]" : "1080:z-10"
      }`}
      style={{ height }}
    >
      <div
        ref={cardRef}
        className="1080:overflow-hidden 1080:pt-[calc(5.8rem+16px)] 1080:bg-third/95 1080:backdrop-blur-sm 1080:text-left"
      >
        <div className="1080:max-w-[1680px] 1080:mx-auto 1800:px-[1rem] 1600:px-[3%] 1080:px-[24px]">
          <div
            className={`transition-opacity duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col max-1080:flex-col-reverse ${
              active
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
            ref={contentRef}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
