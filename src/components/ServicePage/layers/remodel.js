// The Home Remodel page's drawing (layers/index.js): the hero's ranch house
// (heroes/remodel.js — 40 by 26 under a hip roof) opened up and taken
// apart, as an architect cuts one to show its rooms — its roof lifted off,
// its walls cut at waist height (the wall taken out between the living room
// and the kitchen dashed), the wiring and plumbing run through them, and
// under them its floor: the new floors, the kitchen and island, the
// bathroom with its tub, and the route we walk it with you.

import { ease, lerp, span } from "@/components/Home/intro/kit";
import { EDGE, LINE, box, boxes, dashed, ghostBox, ghostHip, ground, hipBounds, hipRoof, ink, put, runs, seg } from "./kit";

const FL = 0.8; // the floor's top
const HOUSE = { x: [0, 40], z: [0, 26], base: FL, wall: 9.3 };
const ROOF = { pitch: 0.4 };
const CUT = 5; // where the walls are cut
const PAD = { x: [-3, 43], z: [-6, 29], t: 1.3 };

// the walls, cut: [x0, x1, z0, z1, top] each, back to front — the outside
// walls with their windows' and the front door's gaps (the windows' sills a
// low wall), and the partitions
const SILL = 3;
const WALLS = [
  [0, 40, 25.5, 26],
  [0, 0.5, 0, 25.5],
  [26, 26.5, 17, 25.5],
  [18, 21, 12.5, 13],
  [24, 39.5, 12.5, 13],
  [18, 18.5, 0.5, 8],
  [39.5, 40, 0, 4],
  [39.5, 40, 4, 9, SILL],
  [39.5, 40, 9, 16],
  [39.5, 40, 16, 19, SILL + 1],
  [39.5, 40, 19, 25.5],
  [0, 3, 0, 0.5],
  [3, 8, 0, 0.5, SILL],
  [8, 10.5, 0, 0.5],
  [10.5, 16.5, 0, 0.5, SILL - 0.6],
  [16.5, 20, 0, 0.5],
  [23, 27, 0, 0.5],
  [27, 33, 0, 0.5, SILL],
  [33, 39.5, 0, 0.5],
];
// the wall taken out, between the living room and the kitchen
const REMOVED = [0.5, 18, 12.5, 13];

function cutWalls(R, k) {
  const rise = lerp(FL, CUT, ease(span(k, 0, 0.6)));
  for (const [x0, x1, z0, z1, top = CUT] of WALLS) box(R, [x0, x1], [FL, Math.min(rise, top)], [z0, z1], { top: "cut" });
  const out = ease(span(k, 0.5, 1));
  if (out > 0) {
    const { ctx } = R;
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = ink(R, 0.7 * out);
    ctx.lineWidth = 1;
    ghostBox(R, [REMOVED[0], REMOVED[1]], [FL, CUT], [REMOVED[2], REMOVED[3]]);
    ctx.restore();
  }
}

// the rough-in: water lines dashed, the kitchen's and bathroom's drain
// stacks, wiring dotted
const ROUGH_IN = [
  { a: [2, 2.2, 25.2], b: [38, 2.2, 25.2], dash: [5, 3] },
  { a: [8, FL, 25.2], b: [8, CUT + 1.5, 25.2], heavy: true },
  { a: [30, FL, 25.2], b: [30, CUT + 1.5, 25.2], heavy: true },
  { a: [1, 1.8, 0.8], b: [39, 1.8, 0.8], dash: [1.5, 2.5] },
  { a: [0.8, 1.8, 1], b: [0.8, 1.8, 25], dash: [1.5, 2.5] },
];

// the floor, its new finishes: oak planks, the bathroom's tile
const BATH_FLOOR = [26.5, 13, 39.5, 25.5];
function floor(R, k) {
  box(R, HOUSE.x, [0, FL], HOUSE.z);
  const laid = ease(span(k, 0.2, 1));
  for (let z = 0.8; z < 26 * laid; z += 0.8) seg(R, [0, FL + 0.01, z], [z < BATH_FLOOR[1] ? 40 : BATH_FLOOR[0], FL + 0.01, z], LINE * 0.5);
  if (laid >= 1) {
    const [x0, z0, x1, z1] = BATH_FLOOR;
    for (let x = x0 + 1; x < x1; x += 1) seg(R, [x, FL + 0.01, z0], [x, FL + 0.01, z1], LINE * 0.5);
    for (let z = z0 + 1; z < z1; z += 1) seg(R, [x0, FL + 0.01, z], [x1, FL + 0.01, z], LINE * 0.5);
  }
}

// the kitchen along the back wall and its island; the bathroom's double
// vanity, freestanding tub and toilet
const KITCHEN = [
  { x: [1, 15], y: [FL, FL + 2.8], z: [23.4, 25.5], doors: 2 },
  { x: [15.2, 18], y: [FL, FL + 3.2], z: [23.2, 25.5] },
  { x: [5, 13], y: [FL, FL + 2.8], z: [16.4, 18.6], doors: 2.3 },
];
const BATH = [
  { x: [27.2, 32.8], y: [FL, FL + 2.8], z: [23.6, 25.5], basin: true },
  { x: [33.6, 39], y: [FL, FL + 2], z: [20.5, 24.6], basin: true },
  { x: [27.4, 28.6], y: [FL, FL + 1.6], z: [14.2, 15.8] },
];

// the route we walk it with you, room to room, dashed with arrows: in at
// the front door, the living room, the kitchen, down the hall to the bath
const ROUTE = [[21.5, -3], [21.5, 10], [9, 10], [9, 14.6], [22.5, 14.6], [29, 14.8], [32, 18.5]];
function walkthrough(R, k) {
  const { ctx } = R;
  const legs = ROUTE.length - 1;
  for (let i = 0; i < legs; i++) {
    const g = ease(span(k, i / legs, (i + 1) / legs));
    if (g <= 0) continue;
    const [ax, az] = ROUTE[i];
    const [bx, bz] = ROUTE[i + 1];
    dashed(R, [ax, FL + 0.1, az], [bx, FL + 0.1, bz], [4, 3], EDGE, 1.8, g);
    if (g < 1) continue;
    // an arrowhead at the end of each leg
    const [x1, y1] = put(R, [ax, FL + 0.1, az]);
    const [x2, y2] = put(R, [bx, FL + 0.1, bz]);
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const size = 6;
    ctx.beginPath();
    ctx.moveTo(x2 - size * Math.cos(angle - 0.5), y2 - size * Math.sin(angle - 0.5));
    ctx.lineTo(x2, y2);
    ctx.lineTo(x2 - size * Math.cos(angle + 0.5), y2 - size * Math.sin(angle + 0.5));
    ctx.strokeStyle = ink(R, EDGE);
    ctx.lineWidth = 1.8;
    ctx.stroke();
  }
}

export default {
  stages: 6,
  levels: [0, 4, 9, 19], // the lot, the floor, the walls, the roof (well up, clear of the rooms)
  short: "Home Remodel",
  plan: {
    size: [40, 26],
    walls: [[0, 0, 40, 26]],
    lines: [[26, 17, 26, 26], [18, 12.75, 21, 12.75], [24, 12.75, 40, 12.75], [18, 0, 18, 8]],
    dashes: [[0, 12.75, 18, 12.75]],
    windows: [[3, 0, 8, 0], [10.5, 0, 16.5, 0], [27, 0, 33, 0], [40, 4, 40, 9], [40, 16, 40, 19]],
    doors: [[20, 23]],
    boxes: [...KITCHEN, ...BATH].map((f) => [f.x[0], f.z[0], f.x[1], f.z[1]]),
    labels: [[9, 5.5, "LIVING"], [30, 5.5, "BED"], [9, 21, "KITCHEN"], [33.5, 15.6, "BATH"]],
  },
  parts: [
    { stage: null, level: 0, bounds: { x: PAD.x, y: [-PAD.t, 0], z: PAD.z }, draw: ground(PAD), shadow: true },
    // 3. Floors & paint: the new floors
    { stage: 2, level: 1, bounds: { x: HOUSE.x, y: [0, FL], z: HOUSE.z }, draw: floor, ghost: true, drop: 1.5, shadow: true },
    // 4. Kitchen
    { stage: 3, level: 1, bounds: { x: [1, 18], y: [FL, FL + 3.2], z: [16.4, 25.5] }, draw: boxes(KITCHEN) },
    // 5. Bathroom
    { stage: 4, level: 1, bounds: { x: [27.2, 39], y: [FL, FL + 2.8], z: [14.2, 25.5] }, draw: boxes(BATH) },
    // 6. Final walkthrough: the route through it
    { stage: 5, level: 1, bounds: { x: [9, 32], y: [FL, FL + 0.2], z: [-3, 18.5] }, draw: walkthrough, hit: false },
    // 1. Opened up: the walls, cut, the one taken out dashed
    { stage: 0, level: 2, bounds: { x: HOUSE.x, y: [FL, CUT], z: HOUSE.z }, draw: cutWalls, ghost: true, drop: 2, shadow: true },
    // 2. Wiring & plumbing
    { stage: 1, level: 2, bounds: { x: [0.8, 39], y: [FL, CUT + 1.5], z: [0.8, 25.2] }, draw: runs(ROUGH_IN), hit: false },
    // 1. Opened up: the hip roof lifted off
    { stage: 0, level: 3, bounds: hipBounds(HOUSE, ROOF), draw: hipRoof(HOUSE, ROOF), ghost: ghostHip(HOUSE, ROOF), drop: 2, shadow: true },
  ],
  label:
    "A blueprint of a ranch house opened up for a remodel, one layer for each stage: the hip roof lifted off and the walls opened, the wiring and plumbing run through them, the new oak floors, the kitchen and island, the bathroom with its tub, and the route of the final walkthrough.",
};
