"use client";

import { MotionConfig } from "framer-motion";

// Honors the visitor's "reduce motion" OS setting across every framer-motion
// animation on the site: slides, scales and rotations are skipped, while
// fades still play. The Accessibility Statement promises this ("turning off
// or toning down"): the hero timelapse (HeroBuildSequence) and the
// testimonials (Reviews) play a calmer version instead; the rotating words
// (RotatingWord) opt out and roll as usual. The scroll reveals
// (UI/Reveal) are CSS and tone themselves down: a third of the rise.
export default function MotionPreferences({ children }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
