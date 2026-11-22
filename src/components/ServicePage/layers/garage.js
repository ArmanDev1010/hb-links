// The Garage Conversion page's drawing (layers/index.js): the hero's garage
// (heroes/garage.js — a detached Spanish-style garage, 24 by 22 under a hip
// roof) taken apart as it's converted into a studio. Stage 1 is the garage
// as it stands, checked: its lot (and the route to the sewer), its slab and
// its roof. Then the roll-up door comes out (pulled out from the front), the
// opening's framed in round the new window and French doors, the walls and
// ceiling insulated and wired and the floor leveled, the walls stuccoed with
// the windows and doors set, and last the finishes inside and the paver
// patio and planters out front.

import { ease, lerp, span } from "@/components/Home/intro/kit";
import { EDGE, LINE, box, boxes, dashed, face, fading, framing, ghostHip, ground, hipBounds, hipRoof, pavers, runs, seg, shrubs, walls } from "./kit";

const L = 24;
const D = 22;
const SLAB = 0.5;
const WALL = 9.5;
// the garage, finished: the new window and French doors in the old door's
// opening, the side window and door it always had
const GARAGE = {
  x: [0, L],
  z: [0, D],
  base: SLAB,
  wall: WALL,
  open: {
    front: [
      { s: [4.2, 10.8], y: [3, 7.4] },
      { s: [12.6, 17.8], y: [SLAB, 7.6], door: "slider" },
    ],
    right: [
      { s: [4, 9], y: [3.6, 6.6] },
      { s: [14.5, 17.5], y: [SLAB, 7.3], door: "front" },
    ],
  },
};
const PAD = { x: [-4, 28], z: [-11.5, 25], t: 1.3 };
// the two-car door across the front, and how far it's pulled out
const DOOR = { x: [3, 19], y: [SLAB, 8] };
const OUT = 9;
// the new floor, leveled over a vapor barrier on the old slab
const FLOOR = 0.4;
// the patio over the old driveway, and its planters
const PATIO = [2, -9.5, 22, -0.3];
const PLANTERS = [
  { x: [2, 4.4], y: [0, 2], z: [-9.5, -7.1] },
  { x: [19.6, 22], y: [0, 2], z: [-9.5, -7.1] },
];
// inside: the kitchenette along the left wall, the bath's vanity and shower
// in the back corner, the bed
const UP = SLAB + FLOOR;
const INSIDE = [
  { x: [0.35, 2.6], y: [UP, UP + 3], z: [1.5, 9.5] },
  { x: [6, 12], y: [UP, UP + 1.8], z: [14.5, 21.5] },
  { x: [21.4, 23.6], y: [UP, UP + 2.8], z: [14.6, 17.6], basin: true },
  { x: [18, 23.6], y: [UP, UP + 0.4], z: [18.4, 21.6] },
];

// the roll-up door, its panels, pulled out of the front as `k` runs
function door(R, k) {
  const z = -lerp(0, OUT, ease(span(k, 0, 0.7)));
  const [x0, x1] = DOOR.x;
  const [y0, y1] = DOOR.y;
  box(R, [x0, x1], [y0, y1], [z - 0.3, z], { top: "top" });
  for (let i = 1; i < 4; i++) {
    const y = lerp(y0, y1, i / 4);
    seg(R, [x0, y, z - 0.3], [x1, y, z - 0.3], LINE);
  }
  // its windows, across the top panel
  for (let i = 0; i < 4; i++) {
    const a = lerp(x0 + 0.8, x1 - 0.8, i / 4) + 0.3;
    const b = lerp(x0 + 0.8, x1 - 0.8, (i + 1) / 4) - 0.3;
    face(R, [[a, y1 - 1.4, z - 0.3], [b, y1 - 1.4, z - 0.3], [b, y1 - 0.5, z - 0.3], [a, y1 - 0.5, z - 0.3]], { tone: "glass", edge: LINE });
  }
}

// the ceiling's insulation: batts across it, drawn as a drawing draws
// insulation, in zigzags; and the new wiring round the walls
const WIRING = [
  { a: [0.4, 1.8, D - 0.3], b: [L - 0.4, 1.8, D - 0.3], dash: [1.5, 2.5] },
  { a: [L - 0.3, 1.8, 1], b: [L - 0.3, 1.8, D - 0.4], dash: [1.5, 2.5] },
  { a: [L - 0.3, 1.8, 3], b: [L - 0.3, WALL, 3], dash: [1.5, 2.5] },
];
function insulation(R, k) {
  [2.75, 8.25, 13.75, 19.25].forEach((zc, i) => {
    const g = ease(span(k, i * 0.12, i * 0.12 + 0.5));
    if (g <= 0) return;
    const end = lerp(0.6, L - 0.6, g);
    for (let x = 0.6, j = 0; x + 1.1 <= end; x += 1.1, j++)
      seg(R, [x, WALL, zc + (j % 2 ? 1.8 : -1.8)], [x + 1.1, WALL, zc + (j % 2 ? -1.8 : 1.8)], LINE * 1.2, 1.2);
  });
  runs(WIRING)(R, span(k, 0.4, 1));
}

// the new floor over the slab, its sheets' seams
function newFloor(R, k) {
  fading(R, ease(span(k, 0, 0.5)), () => {
    box(R, [0, L], [SLAB, UP], [0, D]);
    for (let x = 4; x < L; x += 4) seg(R, [x, UP + 0.01, 0], [x, UP + 0.01, D], LINE * 0.6);
  });
}

// the patio's pavers, in courses across it (staggered)
const PAVERS = [];
for (let j = 0, z = PATIO[1]; z + 1.6 <= PATIO[3] + 0.01; j++, z += 1.84) {
  const off = j % 2 ? 1.2 : 0;
  for (let x = PATIO[0] - off; x < PATIO[2]; x += 2.4) PAVERS.push([Math.max(PATIO[0], x + 0.1), z, Math.min(PATIO[2], x + 2.3), z + 1.6]);
}

// the route to the sewer, found, out to the street
const SEWER = [{ a: [10, 0.02, 0], b: [10, 0.02, PAD.z[0]], dash: [6, 3] }];

const ROOF = { pitch: 0.45 };

export const GARAGE_PLAN = {
  size: [L, D],
  walls: [[0, 0, L, D]],
  lines: [[16.5, D, 16.5, 14], [16.5, 14, L, 14]],
  windows: [[4.2, 0, 10.8, 0], [L, 4, L, 9]],
  doors: [[12.6, 15.2], [15.2, 17.8]],
  boxes: INSIDE.map((f) => [f.x[0], f.z[0], f.x[1], f.z[1]]),
  labels: [[9, 8, "STUDIO"], [20.3, 12.4, "BATH"]],
};

export default {
  stages: 6,
  levels: [0, 5, 11.5, 27.5, 34], // the lot, the slab, the framing, the walls, the roof
  short: "Garage Conversion",
  plan: GARAGE_PLAN,
  parts: [
    {
      // 1. The garage, checked: its lot and the sewer's route
      stage: 0,
      level: 0,
      bounds: { x: PAD.x, y: [-PAD.t, 0], z: PAD.z },
      draw: (R, k) => {
        ground(PAD)(R, k);
        runs(SEWER)(R, span(k, 0.3, 1));
      },
      ghost: true,
      shadow: true,
    },
    {
      // 6. (on the lot) the patio and its planters
      stage: 5,
      level: 0,
      bounds: { x: [PATIO[0], PATIO[2]], y: [0, 3.2], z: [PATIO[1], PATIO[3]] },
      draw: (R, k) => {
        pavers(PAVERS)(R, k);
        fading(R, ease(span(k, 0.4, 0.8)), () => boxes(PLANTERS)(R, 1));
        shrubs([[3.2, -8.3], [20.8, -8.3]], { y: 2.6 })(R, span(k, 0.6, 1));
      },
    },
    // 1. its slab, checked
    { stage: 0, level: 1, bounds: { x: [0, L], y: [0, SLAB], z: [0, D] }, draw: (R) => box(R, [0, L], [0, SLAB], [0, D]), ghost: true, shadow: true },
    // 4. the floor leveled over a vapor barrier
    { stage: 3, level: 1, bounds: { x: [0, L], y: [SLAB, UP], z: [0, D] }, draw: newFloor, hit: false },
    // 6. the finishes inside: the kitchenette, the bed, the bath
    { stage: 5, level: 1, bounds: { x: [0.35, 23.6], y: [UP, UP + 3], z: [1.5, 21.6] }, draw: boxes(INSIDE) },
    // 3. the opening framed in (with the rest of the framing)
    { stage: 2, level: 2, bounds: { x: [0, L], y: [SLAB, WALL], z: [0, D] }, draw: framing(GARAGE), ghost: true, shadow: true },
    // 4. insulated and wired
    { stage: 3, level: 2, bounds: { x: [0, L], y: [WALL - 0.5, WALL], z: [0, D] }, draw: insulation, hit: false },
    // 5. stucco, windows and doors
    { stage: 4, level: 3, bounds: { x: [0, L], y: [SLAB, WALL], z: [0, D] }, draw: walls(GARAGE), ghost: true, shadow: true },
    {
      // 2. the door comes out
      stage: 1,
      level: 3,
      bounds: { x: DOOR.x, y: DOOR.y, z: [-OUT - 0.3, 0] },
      draw: door,
      ghost: (R) => dashed(R, [DOOR.x[0], DOOR.y[1], 0], [DOOR.x[1], DOOR.y[1], 0], [4, 4], EDGE),
    },
    // 1. the hip roof, checked
    { stage: 0, level: 4, bounds: hipBounds(GARAGE, ROOF), draw: hipRoof(GARAGE, ROOF), ghost: ghostHip(GARAGE, ROOF), shadow: true },
  ],
  label:
    "A blueprint of the Spanish-style garage taken apart as it's converted into a studio, one layer for each stage: the garage checked (its lot, slab and hip roof), the roll-up door coming out, the opening framed in round a new window and French doors, the walls and ceiling insulated and wired, the walls stuccoed with the windows and doors set, and the finishes inside with a paver patio and planters out front.",
};
