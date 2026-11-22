// The ADU page's drawing (layers/index.js): the hero's own ADU (Home/intro/
// adu.js) taken apart — the lot, the slab, the framing, the stucco walls,
// the roof — each layer floating over the one under it.

import { ADU_SHAPE } from "@/components/Home/intro/adu";
import { boxes, framing, gableRoof, ghostBox, ghostGable, ground, pavers, shrubs, slab, stakes, walls, fading, box } from "./kit";
import { ease, span } from "@/components/Home/intro/kit";

const { L, D, SLAB, WALL, WALLS, PORCH, SHRUBS } = ADU_SHAPE;
export const ADU = { x: [0, L], z: [0, D], base: SLAB, wall: WALL, open: Object.fromEntries(WALLS.map((w) => [w.id, w.open])) };
export const ADU_PAD = { x: [-3.5, 35], z: [-10, 23.5], t: 1.3 };
// the path out to the street
export const ADU_PATH = Array.from({ length: 3 }, (_, i) => [21.6, -9.4 + i * 1.1, 24.4, -9.4 + i * 1.1 + 0.8]);
// the kitchen's run and island and the tub, in the front half (where the
// framing over them doesn't cross them)
export const ADU_FIXTURES = [
  { x: [0.35, 2.5], y: [SLAB, 3.4], z: [1, 8.6] },
  { x: [5.5, 11], y: [SLAB, 3.4], z: [3.6, 5.8] },
  { x: [27.2, 29.6], y: [SLAB, 2.2], z: [0.5, 5.6], basin: true },
];
// its floor plan (for the sheet's key plan): x across, z back from the front
export const ADU_PLAN = {
  size: [L, D],
  walls: [[0, 0, L, D]],
  lines: [[20, D, 20, 11], [20, 11, L, 11], [24.8, 0, 24.8, 9], [24.8, 9, L, 9]],
  windows: [[3, 0, 8, 0], [11, 0, 17, 0], [6, D, 10, D], [19, D, 23, D], [L, 5, L, 10], [L, 13.5, L, 16.5], [0, 8, 0, 12]],
  doors: [[21.5, 24.5]],
  boxes: ADU_FIXTURES.map((f) => [f.x[0], f.z[0], f.x[1], f.z[1]]),
  labels: [[11, 13, "LIVING"], [25, 15.2, "BED"], [27.4, 7.2, "BATH"]],
};

const porch = (R, k) => fading(R, ease(span(k, 0.55, 0.8)), () => box(R, [PORCH.x0, PORCH.x1], [0, PORCH.slab], [PORCH.z0, 0]));

export default {
  stages: 6,
  levels: [0, 5, 11, 26.4, 33.1], // the lot, the slab, the framing, the walls, the roof
  short: "ADU",
  plan: ADU_PLAN,
  parts: [
    {
      // 1. Layout & Site Prep: the pad, staked and strung
      stage: 0,
      level: 0,
      bounds: { x: ADU_PAD.x, y: [-ADU_PAD.t, 0], z: ADU_PAD.z },
      draw: (R, k) => {
        ground(ADU_PAD)(R, k);
        stakes([0, L], [0, D])(R, k);
      },
      ghost: true,
      drop: -1.5,
      shadow: true,
    },
    {
      // 6. (on the lot) the path and the shrubs
      stage: 5,
      level: 0,
      bounds: { x: ADU_PAD.x, y: [0, 1.8], z: ADU_PAD.z },
      draw: (R, k) => {
        pavers(ADU_PATH)(R, k);
        shrubs(SHRUBS)(R, k);
      },
      hit: false,
    },
    {
      // 2. Foundation: the slab poured, then the porch's
      stage: 1,
      level: 1,
      bounds: { x: [0, L], y: [0, SLAB], z: [PORCH.z0, D] },
      draw: (R, k) => {
        slab([0, L], [0, D], SLAB)(R, k);
        porch(R, k);
      },
      ghost: (R) => {
        ghostBox(R, [0, L], [0, SLAB], [0, D]);
        ghostBox(R, [PORCH.x0, PORCH.x1], [0, PORCH.slab], [PORCH.z0, 0]);
      },
      drop: 1.5,
      shadow: true,
    },
    // 6. (on the slab) the kitchen, the island and the tub
    { stage: 5, level: 1, bounds: { x: [0.35, 29.6], y: [SLAB, 3.4], z: [0.5, 8.6] }, draw: boxes(ADU_FIXTURES) },
    // 3. Framing
    { stage: 2, level: 2, bounds: { x: [0, L], y: [SLAB, WALL], z: [0, D] }, draw: framing(ADU), ghost: true, shadow: true },
    // 5. Windows & Stucco
    { stage: 4, level: 3, bounds: { x: [0, L], y: [SLAB, WALL], z: [0, D] }, draw: walls(ADU), ghost: true, drop: 2.5, shadow: true },
    // 4. Roof
    {
      stage: 3,
      level: 4,
      bounds: { x: [-1.2, L + 1.2], y: [8.28 - 0.45, 15 + 2.6], z: [-1.2, D + 1.2] },
      draw: gableRoof(ADU),
      ghost: ghostGable(ADU),
      drop: 2,
      shadow: true,
    },
  ],
  label:
    "A blueprint of the ADU taken apart layer by layer, one layer for each stage of the build: the lot laid out, the slab, the framing, the roof, the walls with their windows and front door, and the kitchen, bath and planting.",
};
