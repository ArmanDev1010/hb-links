"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function DropdownShell({ active, isMobile, triggerEl, children }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState(null);

  useEffect(() => setMounted(true), []);

  useLayoutEffect(() => {
    if (!isMobile || !contentRef.current) return;
    setHeight(active ? contentRef.current.scrollHeight : 0);
  }, [active, isMobile, children]);

  useLayoutEffect(() => {
    if (isMobile || !active || !triggerEl) return;
    const update = () => {
      const r = triggerEl.getBoundingClientRect();
      setCoords({ top: r.bottom + 12, left: r.left });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [active, isMobile, triggerEl]);

  if (!isMobile) {
    if (!mounted || !coords) return null;

    return createPortal(
      <div
        className={`fixed z-[1000] min-w-[280px] w-max origin-top
          bg-white/85 backdrop-blur-xl backdrop-saturate-150
          border-2 border-black/10 overflow-hidden
          transition ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
            active
              ? "opacity-100 translate-y-0 scale-100 duration-[440ms] pointer-events-auto"
              : "opacity-0 -translate-y-2 scale-[0.97] duration-[240ms] pointer-events-none"
          }`}
        style={{ top: coords.top, left: coords.left }}
      >
        <div ref={contentRef} className="flex flex-col">
          {children}
        </div>
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
