"use client";

import EstimateBlueprint from "./EstimateBlueprint";

// The estimate form's blueprint works like a camera on the drawing
// (EstimateBlueprint): it starts on the whole thing, and each answer pans
// and zooms it to the part that just changed (`shot` — set by EstimateForm).
// The form shows it in the panel beside the questions, from 1080px up.

// Where the camera points, in drawing coordinates (640×380), and how far in
// it is — `k` × the width at which the whole drawing fits the window.
export const SHOTS = {
  full: { k: 1, x: 320, y: 190 },
  adu: { k: 2.3, x: 525, y: 249 },
  remodel: { k: 2.3, x: 200, y: 268 },
  addition: { k: 2, x: 200, y: 140 },
  patio: { k: 2.3, x: 374, y: 282 },
  plans: { k: 1.5, x: 330, y: 300 },
  address: { k: 2.3, x: 105, y: 310 },
};

export const MOVE = "700ms cubic-bezier(0.22, 1, 0.36, 1)";

// The drafting grid behind the drawing. It fades out toward every edge into
// the white, so it reads as part of the card rather than a box set into it.
// Fills its positioned parent; render it before the camera so it sits
// underneath.
const GRID_FADE =
  "radial-gradient(ellipse closest-side at center, #000 45%, transparent)";

export function GridPaper() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        maskImage: GRID_FADE,
        WebkitMaskImage: GRID_FADE,
      }}
    />
  );
}

// The camera, inside a positioned window that clips it: pinned at the
// window's centre and shifted by the focus point's share of its own size, so
// that point sits in the middle while the width — the zoom — changes. At the
// "full" shot the drawing is `fill`% of the window's width (100 for a window
// shaped like the drawing; less leaves a margin).
export function BlueprintCamera({
  marks,
  shot = "full",
  fill = 100,
  move = MOVE,
}) {
  const { k, x, y } = SHOTS[shot] ?? SHOTS.full;

  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{
        width: `${k * fill}%`,
        transform: `translate(${(-x / 640) * 100}%, ${(-y / 380) * 100}%)`,
        transition: `width ${move}, transform ${move}`,
      }}
    >
      <EstimateBlueprint {...marks} />
    </div>
  );
}
