// The Design-Build page's drawing (layers/index.js): a modern two-storey
// home, designed and built, taken apart. On its lot first its design, its
// plan laid out on the ground, and its permit set, stamped, over it; then
// its slab, both floors framed, its walls and flat roofs closing it in, and
// the finishes inside and the planting outside.

import { ease, span } from "@/components/Home/intro/kit";
import { EDGE, LINE, box, boxes, dashed, face, fading, flat, framing, ground, ink, pavers, put, seg, shrubs, slab, stakes, walls } from "./kit";

const LOWER = {
  x: [0, 30],
  z: [0, 22],
  base: 0.6,
  wall: 10.6,
  open: {
    front: [
      { s: [2, 9], y: [0.6, 8.6], door: "slider" },
      { s: [12, 15], y: [0.6, 8], door: "front" },
      { s: [19, 28], y: [2.6, 8.6] },
    ],
    right: [{ s: [3, 11], y: [2.6, 8.6] }, { s: [14, 19], y: [2.6, 8.6] }],
  },
};
const UPPER = {
  x: [0, 18],
  z: [0, 22],
  base: 11.2,
  wall: 20.2,
  open: { front: [{ s: [2, 16], y: [13, 18.6] }], right: [{ s: [4, 18], y: [13, 18.6] }] },
};
const PAD = { x: [-4, 34], z: [-11, 26], t: 1.3 };

// 1. Design: the plan laid out on the lot — its walls, its rooms dashed
const ROOMS = [[[12, 0], [12, 22]], [[0, 12], [12, 12]], [[20, 12], [30, 12]], [[20, 12], [20, 22]]];
function design(R, k) {
  ground(PAD)(R, k);
  stakes(LOWER.x, LOWER.z)(R, k);
  const rooms = ease(span(k, 0.5, 1));
  ROOMS.forEach(([[x0, z0], [x1, z1]]) => dashed(R, [x0, 0.02, z0], [x1, 0.02, z1], [4, 3], EDGE * 0.8, 1, rooms));
}

// 2. Permits: the drawing set, stamped, over the lot
const SET = { x: [-2.5, 9.5], z: [-9.5, -2], y: 3 };
function permits(R, k) {
  const g = ease(span(k, 0, 0.6));
  fading(R, g, () => {
    const [x0, x1] = SET.x;
    const [z0, z1] = SET.z;
    // the sheets under it, then the top one
    for (let i = 2; i >= 0; i--) face(R, flat([x0 + i * 0.4, z0 - i * 0.4, x1 + i * 0.4, z1 - i * 0.4], SET.y - i * 0.25), { tone: "paper" });
    // its title block and a drawing on it
    seg(R, [x1 - 3, SET.y + 0.01, z0], [x1 - 3, SET.y + 0.01, z1], LINE);
    for (let z = z0 + 1.5; z < z1; z += 1.5) seg(R, [x1 - 3, SET.y + 0.01, z], [x1, SET.y + 0.01, z], LINE * 0.7);
    face(R, flat([x0 + 1, z0 + 1.2, x0 + 6.5, z1 - 1.2], SET.y + 0.01), { fill: false, edge: LINE });
  });
  // the stamp
  const stamp = ease(span(k, 0.6, 1));
  if (stamp <= 0) return;
  const { ctx } = R;
  ctx.beginPath();
  for (let a = 0; a <= 24; a++) {
    const t = (a / 24) * Math.PI * 2;
    const [px, py] = put(R, [SET.x[1] - 6 + 1.6 * Math.cos(t), SET.y + 0.02, -4.6 + 1.6 * Math.sin(t)]);
    if (a) ctx.lineTo(px, py);
    else ctx.moveTo(px, py);
  }
  ctx.strokeStyle = ink(R, EDGE * stamp);
  ctx.lineWidth = 2;
  ctx.stroke();
}

// 4. Framing: the ground floor's walls, the second floor's joists, its walls
function framed(R, k) {
  framing(LOWER)(R, span(k, 0, 0.5));
  const joists = ease(span(k, 0.45, 0.65));
  for (let x = 0; x <= 30.01; x += 2) seg(R, [x, 10.9, 0], [x, 10.9, 22], LINE, 1.2, joists);
  seg(R, [0, 10.9, 0], [30, 10.9, 0], EDGE, 2, joists);
  framing(UPPER)(R, span(k, 0.6, 1));
}

// 5. Roof & exterior: the walls, the windows and doors, the flat roofs
function exterior(R, k) {
  walls(LOWER)(R, k);
  box(R, [-0.8, 30.8], [10.6, 11.2], [-0.8, 22.8], { top: "roof" });
  walls(UPPER)(R, k);
  box(R, [-0.8, 18.8], [20.2, 20.8], [-0.8, 22.8], { top: "roof" });
}

// 6. Finishes: the kitchen inside; the path and planting outside
const INSIDE = [
  { x: [21, 29.4], y: [0.6, 3.4], z: [19.6, 21.6], doors: 2.1 },
  { x: [22, 28], y: [0.6, 3.4], z: [14, 16.2], doors: 2 },
];
const PATH = Array.from({ length: 4 }, (_, i) => [12, -10 + i * 2.2, 15, -10 + i * 2.2 + 1.6]);
const PLANTING = [[2, -2], [6, -2], [20, -2], [24, -2], [28, -2], [31.5, 4], [31.5, 10], [31.5, 16]];

export default {
  stages: 6,
  levels: [0, 5, 11, [12, 35, 0]], // the lot, the slab, the framing, the house closed in (up and to the right)
  short: "Design-Build",
  plan: {
    size: [30, 22],
    walls: [[0, 0, 30, 22]],
    lines: [[12, 0, 12, 22], [0, 12, 12, 12], [20, 12, 30, 12], [20, 12, 20, 22]],
    dashes: [[0, 0, 18, 0], [18, 0, 18, 22]],
    windows: [[2, 0, 9, 0], [19, 0, 28, 0], [30, 3, 30, 11], [30, 14, 30, 19]],
    doors: [[12, 15]],
    boxes: INSIDE.map((f) => [f.x[0], f.z[0], f.x[1], f.z[1]]),
    labels: [[6, 6, "LIVING"], [25, 6, "DINING"], [25, 17.5, "KITCHEN"], [6, 17, "BED"]],
  },
  parts: [
    // 1. Design: the lot and the plan on it
    { stage: 0, level: 0, bounds: { x: PAD.x, y: [-PAD.t, 0], z: PAD.z }, draw: design, ghost: true, drop: -1.5, shadow: true },
    // 6. (on the lot) the path and planting
    {
      stage: 5,
      level: 0,
      bounds: { x: PAD.x, y: [0, 1.8], z: PAD.z },
      draw: (R, k) => {
        pavers(PATH)(R, k);
        shrubs(PLANTING)(R, k);
      },
      hit: false,
    },
    // 2. Permits: the set over the lot
    { stage: 1, level: 0, bounds: { x: [-2.5, 10.3], y: [2.5, 3], z: [-10.3, -2] }, draw: permits },
    // 3. Foundation
    { stage: 2, level: 1, bounds: { x: LOWER.x, y: [0, 0.6], z: LOWER.z }, draw: slab(LOWER.x, LOWER.z, 0.6), ghost: true, drop: 1.5, shadow: true },
    // 6. (on the slab) the kitchen
    { stage: 5, level: 1, bounds: { x: [21, 29.4], y: [0.6, 3.4], z: [14, 21.6] }, draw: boxes(INSIDE) },
    // 4. Framing: both floors
    { stage: 3, level: 2, bounds: { x: LOWER.x, y: [0.6, 20.2], z: LOWER.z }, draw: framed, ghost: true, shadow: true },
    // 5. Roof & exterior
    { stage: 4, level: 3, bounds: { x: [-0.8, 30.8], y: [0.6, 20.8], z: [-0.8, 22.8] }, draw: exterior, ghost: true, drop: 2.5, shadow: true },
  ],
  label:
    "A blueprint of a new two-storey home designed and built, taken apart one layer for each stage: its plan laid out on the lot, the permit set stamped, the slab, both floors framed, the walls, windows and flat roofs closing it in, and the kitchen and planting.",
};

