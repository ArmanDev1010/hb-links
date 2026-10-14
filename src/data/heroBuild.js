import manifests from "./heroSequences.json";

// The scroll-driven build timelapses heroes play (components/Home/
// HeroBuildSequence.jsx): a fixed camera, one "day" per frame, from before
// the work starts to the finished job, with an HB Links crew at work. The
// frames are AI-generated stills (scripts/hero-ai — illustrations, not real
// projects), lined up by scripts/hero-ai/align.mjs and cut by `npm run
// hero-frames -- … --name <sequence>` (scripts/hero-frames.mjs), which also
// writes the sequence's entry in heroSequences.json — the frame count and
// size of each set and their file type: `desktop` keeps the stills' shape,
// `mobile` is a 3:4 crop for portrait screens.
//
// "adu" is the homepage's. A service page plays the sequence named after its
// slug (or its `sequence`, see data/service-pages) as soon as one exists, and
// shows its still `image` until then.

// Per-sequence settings, over DEFAULTS:
// - `openOn`: which frame the hero opens on, counted from the end (1 is the
//   last). The first scroll wipes it away, before/after style, to reveal the
//   first frame underneath, then the build plays forward to the last frame.
// - `focus`: where the slow push-in zooms toward, as x/y fractions of each
//   set's frame.
const DEFAULTS = {
  openOn: 1,
  focus: { desktop: [0.5, 0.5], mobile: [0.5, 0.5] },
};
const SETTINGS = {
  // the last frame is the dusk shot; open on the finished ADU by day
  adu: { openOn: 2, focus: { desktop: [0.63, 0.5], mobile: [0.5, 0.5] } },
  // the house sits right of center on the drawn blueprint
  "design-build": { focus: { desktop: [0.59, 0.55], mobile: [0.5, 0.55] } },
};

// A sequence's frames and settings, or null when it has no frames yet.
export function getSequence(name) {
  const frames = name ? manifests[name] : null;
  if (!frames || frames.desktop.count < 2 || frames.mobile.count < 2) return null;
  return { name, ...frames, ...DEFAULTS, ...SETTINGS[name] };
}

// 0-based `index` -> /hero/<sequence>/<set>/0001.avif (or `ext`: a sequence
// can carry a `fallback` copy of its frames in another type, see
// HeroBuildSequence)
export const frameSrc = (sequence, set, index, ext = sequence.ext ?? "webp") =>
  `/hero/${sequence.name}/${set}/${String(index + 1).padStart(4, "0")}.${ext}`;

// How far through the hero's scroll the timeline reaches its last frame.
// The rest holds on the last frame before the hero scrolls away.
export const BUILD_END = 0.94;

// How many build frames' worth of scroll the opening wipe takes.
export const WIPE_PACE = 4.5;

// The frames (0-based) in the order the scroll shows them, and the scroll
// each step from one to the next takes (a build step is 1). The first step,
// the opening frame to the first, is the wipe.
export function buildTimeline(count, openOn) {
  const order = [Math.max(0, count - openOn)];
  for (let i = 0; i < count; i++) order.push(i);
  const weights = order.slice(1).map((_, step) => (step === 0 ? WIPE_PACE : 1));
  return { order, weights };
}

// The camera never moves, so the picture pushes in slowly instead: PUSH_IN
// more zoom by the end of the timeline (0.06 = 6%), toward the sequence's
// `focus`.
export const PUSH_IN = 0.06;
