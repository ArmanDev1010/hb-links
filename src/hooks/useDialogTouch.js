"use client";

import { useEffect } from "react";

// While a dialog is open, a finger moves only what can scroll inside it (its
// body, or a text box with more in it), never the page: with the keyboard up
// an iPhone otherwise lets a swipe move the page behind, which the page's
// scroll lock can't stop (the user caught it). Two fingers still zoom.
// `panelRef` is the dialog's card.
export default function useDialogTouch(panelRef) {
  useEffect(() => {
    let lastY = 0;
    const scrolls = (node, dy, panel) => {
      for (; node && panel.contains(node); node = node.parentElement) {
        if (node.scrollHeight <= node.clientHeight + 1) continue;
        const { overflowY } = getComputedStyle(node);
        if (overflowY !== "auto" && overflowY !== "scroll") continue;
        if (dy > 0 ? node.scrollTop > 0 : node.scrollTop + node.clientHeight < node.scrollHeight - 1) return true;
      }
      return false;
    };
    const onStart = (event) => {
      lastY = event.touches[0].clientY;
    };
    const onMove = (event) => {
      if (event.touches.length > 1) return;
      const y = event.touches[0].clientY;
      const panel = panelRef.current;
      if (!panel?.contains(event.target) || !scrolls(event.target, y - lastY, panel)) event.preventDefault();
      lastY = y;
    };
    document.addEventListener("touchstart", onStart, { passive: true });
    document.addEventListener("touchmove", onMove, { passive: false });
    return () => {
      document.removeEventListener("touchstart", onStart);
      document.removeEventListener("touchmove", onMove);
    };
  }, [panelRef]);
}
