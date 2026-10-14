"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const ROTATE_INTERVAL_MS = 1800;

const WORD_TRANSITION = { duration: 0.8, ease: [0.25, 0.1, 0.26, 1] };

// Vertical word-roll used to cycle through a list of words in place (About's
// "HB Links | ADU Builder / Remodeler / ..." heading, and the footer's brand
// tagline). Layout/sizing is left to the caller via `className`; only the
// crossfade-and-slide animation itself is fixed.
export default function RotatingWord({
  words,
  interval = ROTATE_INTERVAL_MS,
  className = "",
  wordClassName = "text-third italic",
}) {
  const [index, setIndex] = useState(0);
  // With "reduce motion" on, the first word just stays put.
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      interval,
    );
    return () => clearInterval(id);
  }, [words.length, interval, reduceMotion]);

  return (
    <motion.span
      transition={WORD_TRANSITION}
      className={`relative inline-block overflow-hidden align-bottom ${className}`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[index]}
          initial={{ y: "100%", rotate: 5 }}
          animate={{ y: "0%", rotate: 0 }}
          exit={{ y: "-100%", rotate: -3 }}
          transition={WORD_TRANSITION}
          style={{ transformOrigin: "left top" }}
          className={`block whitespace-nowrap ${wordClassName}`}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}
