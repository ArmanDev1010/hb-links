"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// The room a desktop panel keeps from the window's edges.
const EDGE = 16;

// A nav dropdown's container. On a wide screen it's a panel of white glass
// with a green rule along its top (after LeTara's), portalled to the body
// and centred under its trigger — nudged in where that would cross the
// window's edge. It stays mounted, so its width can be measured, and is
// inert while closed; NavLinks finds it by its `id` for the hover safe
// zone. In the phone menu the content opens in place,
// sliding to its height.
export default function DropdownShell({
  id,
  active,
  isMobile,
  triggerEl,
  children,
}) {
  const contentRef = useRef(null);
  const panelRef = useRef(null);
  const [height, setHeight] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useEffect(() => setMounted(true), []);

  useLayoutEffect(() => {
    if (!isMobile || !contentRef.current) return;
    setHeight(active ? contentRef.current.scrollHeight : 0);
  }, [active, isMobile, children]);

  useLayoutEffect(() => {
    if (isMobile || !active || !triggerEl || !panelRef.current) return;
    const update = () => {
      const r = triggerEl.getBoundingClientRect();
      const width = panelRef.current.offsetWidth;
      const centred = r.left + r.width / 2 - width / 2;
      const max = document.documentElement.clientWidth - width - EDGE;
      setCoords({ top: r.bottom + 10, left: Math.max(EDGE, Math.min(centred, max)) });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [active, isMobile, triggerEl]);

  if (!isMobile) {
    if (!mounted) return null;

    return createPortal(
      <div
        ref={panelRef}
        id={id}
        inert={!active}
        className={`fixed z-[1000] w-max origin-top
          bg-white/85 backdrop-blur-xl backdrop-saturate-150
          border-2 border-black/10
          transition ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
            active
              ? "opacity-100 translate-y-0 duration-[380ms] pointer-events-auto"
              : "opacity-0 -translate-y-1.5 duration-200 pointer-events-none"
          }`}
        style={{ top: coords.top, left: coords.left }}
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-[-2px] -top-[2px] h-[2px] bg-third"
        />
        {children}
      </div>,
      document.body,
    );
  }

  return (
    <div
      className="overflow-hidden transition-[height] duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={{ height }}
    >
      <div ref={contentRef} className="flex flex-col">
        {children}
      </div>
    </div>
  );
}
