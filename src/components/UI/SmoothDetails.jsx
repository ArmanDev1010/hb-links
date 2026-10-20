"use client";

import { useRef } from "react";

const DURATION = 420; // ms
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

// A <details> that slides open and shut instead of jumping: a click on its
// <summary> (or Enter/Space on it) eases its height between the summary's
// and the whole thing's, and the content fades as it closes. Clicking again
// mid-slide turns it around from where it is. It stays a real <details> —
// the content is in the page for search engines, and it opens without
// JavaScript too.
//
// `open` itself stays set until the closing slide ends, so style the open
// look on data-state="open" (e.g. `group-data-[state=open]:rotate-45`),
// which flips the moment it's clicked.
export default function SmoothDetails({ className = "", children }) {
  const ref = useRef(null);
  const slide = useRef(null);
  const fade = useRef(null);
  const closing = useRef(false);

  const onClick = (event) => {
    const details = ref.current;
    const summary = event.target.closest("summary");
    if (!summary || summary.parentElement !== details) return;
    event.preventDefault();

    const from = details.offsetHeight;
    slide.current?.cancel();
    fade.current?.cancel();
    const opening = !details.open || closing.current;
    if (opening) details.open = true;
    const borders = details.offsetHeight - details.clientHeight;
    const to = opening ? details.offsetHeight : summary.offsetHeight + borders;
    closing.current = !opening;
    details.dataset.state = opening ? "open" : "closed";
    details.style.overflow = "hidden";

    const animation = details.animate(
      { height: [`${from}px`, `${to}px`] },
      { duration: DURATION, easing: EASE },
    );
    slide.current = animation;
    if (!opening) {
      fade.current = summary.nextElementSibling?.animate(
        { opacity: [1, 0] },
        { duration: DURATION * 0.6, easing: EASE, fill: "forwards" },
      );
    }
    animation.onfinish = () => {
      if (!opening) details.open = false;
      fade.current?.cancel();
      slide.current = fade.current = null;
      closing.current = false;
      details.style.overflow = "";
    };
  };

  // opened or closed some other way (the browser's find-in-page opens it)
  const onToggle = (event) => {
    if (slide.current) return;
    event.currentTarget.dataset.state = event.currentTarget.open
      ? "open"
      : "closed";
  };

  return (
    <details
      ref={ref}
      data-state="closed"
      onClick={onClick}
      onToggle={onToggle}
      className={className}
    >
      {children}
    </details>
  );
}
