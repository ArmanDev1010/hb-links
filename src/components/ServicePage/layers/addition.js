// The Home Additions page's drawing (layers/index.js): the hero's bungalow
// (heroes/addition.js — 26 by 30, its gable to the street), as it stands
// (faint: not part of the build), with its new wing on its right side taken
// apart over its footprint — the slab, the framing (with the beam where the
// house's wall opens up), the walls and the shed roof. The walls are cut
// away half and half: sheathed on the right, finished on the left; the roof
// too: its bare rafters on the right, its standing-seam metal on the left.

import { EDGE, frontGable, framing, ghostBox, ground, seg, shedRoof, slab, walls } from "./kit";
import { ease, span } from "@/components/Home/intro/kit";

const HOUSE = {
  x: [0, 26],
  z: [0, 30],
  base: 0.6,
  wall: 10,
  open: {
    front: [
      { s: [2.5, 7.5], y: [2.6, 7] },
      { s: [11.5, 14.5], y: [0.6, 7.4], door: "front" },
      { s: [18.5, 23.5], y: [2.6, 7] },
    ],
    right: [{ s: [2, 6], y: [3, 7] }],
  },
};
const WING = {
  x: [26, 40],
  z: [8, 24],
  base: 0.6,
  wall: 9.5,
  open: { front: [{ s: [3, 9], y: [3, 8.4] }], right: [{ s: [2, 12], y: [2.6, 8.4] }] },
};
// its shed roof, from 12 ft at the house down to 9.5 at its right
const HIGH = 12;
const LOW = 9.5;
const OVER = 1.2;
const CUT = 33; // where the walls and roof are cut away
const PAD = { x: [-3, 44], z: [-7, 33], t: 1.3 };

export default {
  stages: 6,
  levels: [0, 5, 11.5, 27.5, 33.7], // the lot (and the house), the slab, the framing, the walls, the roof
  short: "Home Addition",
  plan: {
    size: [40, 30],
    walls: [[0, 0, 26, 30], [26, 8, 40, 24]],
    lines: [],
    windows: [[2.5, 0, 7.5, 0], [18.5, 0, 23.5, 0], [26, 2, 26, 6], [29, 8, 35, 8], [40, 10, 40, 20]],
    doors: [[11.5, 14.5]],
    boxes: [],
    labels: [[13, 15, "HOUSE"], [33, 15.5, "NEW"]],
    dim: [26, 8, 40, 24],
  },
  parts: [
    // the lot and the house as it stands
    {
      stage: null,
      level: 0,
      bounds: { x: PAD.x, y: [-PAD.t, 17.2], z: PAD.z },
      draw: (R, k) => {
        ground(PAD)(R, k);
        walls(HOUSE)(R, 1);
        frontGable(HOUSE)(R, 1);
      },
      faint: 0.7,
    },
    // 1. Foundation: the slab, tied in to the house
    {
      stage: 0,
      level: 1,
      bounds: { x: WING.x, y: [0, 0.6], z: WING.z },
      draw: slab(WING.x, WING.z, 0.6),
      ghost: true,
      drop: 1.5,
      shadow: true,
    },
    // 2. Framing: the wing's three walls, and the beam over the opening in
    // the house's wall
    {
      stage: 1,
      level: 2,
      bounds: { x: WING.x, y: [0.6, WING.wall], z: WING.z },
      draw: (R, k) => {
        framing(WING, { walls: ["back", "right", "front"] })(R, k);
        seg(R, [26, 8.6, 9], [26, 8.6, 23], EDGE, Math.max(3, R.s * 0.5), ease(span(k, 0.6, 0.9)));
      },
      ghost: true,
      shadow: true,
    },
    // 4. Sheathing: the walls' right half, sheathed
    {
      stage: 3,
      level: 3,
      bounds: { x: [CUT, 40], y: [0.6, WING.wall], z: WING.z },
      draw: walls(WING, { x: [CUT, 40], sheathing: true }),
      ghost: (R) => ghostBox(R, WING.x, [0.6, WING.wall], WING.z),
      drop: 2.5,
      shadow: true,
    },
    // 6. Finishes: the walls' left half, finished
    { stage: 5, level: 3, bounds: { x: [26, CUT], y: [0.6, WING.wall], z: WING.z }, draw: walls(WING, { x: [26, CUT] }), drop: 2.5 },
    // 3. Roof framing: the roof's right half, its bare rafters
    {
      stage: 2,
      level: 4,
      bounds: { x: [CUT, 40 + OVER], y: [LOW - 0.3, 11], z: [8 - OVER, 24 + OVER] },
      draw: shedRoof(WING, HIGH, LOW, { x: [CUT, 40 + OVER], rafters: true }),
      ghost: (R) => ghostBox(R, [26, 40 + OVER], [LOW - 0.6, HIGH], [8 - OVER, 24 + OVER]),
      shadow: true,
    },
    // 5. Roofing: its left half, standing-seam metal
    { stage: 4, level: 4, bounds: { x: [26, CUT], y: [10.7, HIGH], z: [8 - OVER, 24 + OVER] }, draw: shedRoof(WING, HIGH, LOW, { x: [26, CUT] }), drop: 2 },
  ],
  label:
    "A blueprint of a bungalow with its new wing taken apart beside it, one layer for each stage: the slab, the framing with the beam into the house, the shed roof's rafters, the walls sheathed, the standing-seam metal roof, and the walls finished.",
};
