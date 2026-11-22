// The Kitchen Remodel page's drawing (layers/index.js): the hero's kitchen
// (heroes/kitchen.js — a room of its own, 18 by 14, everything along its
// back wall: the range, the sink under the window, the fridge; an island in
// front) taken apart, seen from the front right with its near walls left
// off. At the bottom the room stripped to its studs (the old cabinets
// dashed), the plumbing, gas and wiring run through them; over it the room
// finished, floored and painted, with its window; then the cabinets and
// island, the counters with the sink and range, the hood and the fridge,
// and on top the backsplash and the pendants.

import { ease, lerp, span } from "@/components/Home/intro/kit";
import { EDGE, LINE, box, boxes, face, fading, flat, ghostBox, put, runs, seg, shell, ink } from "./kit";

const ROOM = { x: [0, 18], z: [0, 14], h: 8, t: 0.4 };
const BACK = 13.6; // the back wall's inner face
const FLOOR = 0.5;
const WINDOW = { x: [7.4, 12], y: [4.4, 7.4] };

// the old kitchen, taken out: its outline dashed
const OLD = [
  [[0.4, 14], [FLOOR, 3.4], [11.9, BACK]],
  [[0.4, 6.4], [5.4, 7.6], [12.8, BACK]],
];
function demo(R, k) {
  shell(ROOM, { kind: "studs" })(R, k);
  const out = ease(span(k, 0.5, 1));
  if (out <= 0) return;
  const { ctx } = R;
  ctx.save();
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = ink(R, 0.7 * out);
  ctx.lineWidth = 1;
  for (const [x, y, z] of OLD) ghostBox(R, x, y, z);
  ctx.restore();
}

// the rough-in: water dashed to the sink, its drain, gas dashed to the
// range, the circuits dotted round the walls
const ROUGH_IN = [
  { a: [9.2, FLOOR, BACK + 0.1], b: [9.2, 2.4, BACK + 0.1], dash: [4, 3] },
  { a: [10, FLOOR, BACK + 0.1], b: [10, 2.2, BACK + 0.1], heavy: true },
  { a: [4.2, FLOOR, BACK + 0.1], b: [4.2, 1.6, BACK + 0.1], dash: [6, 2] },
  { a: [0.5, 1.4, BACK + 0.1], b: [17.5, 1.4, BACK + 0.1], dash: [1.5, 2.5] },
  { a: [0.3, 1.4, 0.5], b: [0.3, 1.4, BACK], dash: [1.5, 2.5] },
  { a: [0.3, 1.4, 2], b: [0.3, 4.2, 2], dash: [1.5, 2.5] },
];

// the room finished, floored and painted, with the window in its back wall
function room(R, k) {
  shell(ROOM, { floor: "planks" })(R, k);
  fading(R, ease(span(k, 0.6, 0.9)), () => {
    const [x0, x1] = WINDOW.x;
    const [y0, y1] = WINDOW.y;
    face(R, [[x0, y0, BACK - 0.01], [x1, y0, BACK - 0.01], [x1, y1, BACK - 0.01], [x0, y1, BACK - 0.01]], { tone: "glass" });
    seg(R, [(x0 + x1) / 2, y0, BACK - 0.02], [(x0 + x1) / 2, y1, BACK - 0.02], LINE);
  });
}

// the base run along the back wall, the uppers either side of the hood and
// the window, the island
const CABINETS = [
  { x: [0.4, 14.2], y: [FLOOR, 3.3], z: [11.9, BACK], doors: 2 },
  { x: [0.4, 2.8], y: [5.4, 7.8], z: [12.8, BACK], doors: 1.2 },
  { x: [5.6, 7.2], y: [5.4, 7.8], z: [12.8, BACK] },
  { x: [12.2, 14.2], y: [5.4, 7.8], z: [12.8, BACK], doors: 1 },
  { x: [5, 12.5], y: [FLOOR, 3.3], z: [5.8, 8.4], doors: 2.5 },
];

// the counters (with the sink and the range's burners in them), the hood
// and the fridge
const COUNTERS = [
  [[0.3, 14.3], [11.7, BACK]],
  [[4.8, 12.7], [5.6, 8.6]],
];
function counters(R, k) {
  COUNTERS.forEach(([x, z], i) => fading(R, ease(span(k, i * 0.15, i * 0.15 + 0.4)), () => box(R, x, [3.3, 3.5], z, { top: "roof" })));
  fading(R, ease(span(k, 0.35, 0.65)), () => {
    face(R, flat([8.6, 12, 10.8, 13.3], 3.51), { tone: "front", edge: LINE });
    // the burners
    const { ctx } = R;
    for (const [x, z] of [[3.6, 12.3], [4.8, 12.3], [3.6, 13.2], [4.8, 13.2]]) {
      ctx.beginPath();
      for (let a = 0; a <= 12; a++) {
        const t = (a / 12) * Math.PI * 2;
        const [px, py] = put(R, [x + 0.35 * Math.cos(t), 3.52, z + 0.35 * Math.sin(t)]);
        if (a) ctx.lineTo(px, py);
        else ctx.moveTo(px, py);
      }
      ctx.strokeStyle = ink(R, EDGE);
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  });
  fading(R, ease(span(k, 0.5, 0.8)), () => {
    box(R, [3.7, 4.7], [7, ROOM.h], [13.1, BACK]);
    box(R, [3, 5.4], [6.2, 7], [12.4, BACK]);
  });
  fading(R, ease(span(k, 0.6, 1)), () => {
    box(R, [14.6, 17.6], [FLOOR, lerp(FLOOR, 7.4, ease(span(k, 0.6, 1)))], [11.2, BACK]);
    seg(R, [14.6, 4.4, 11.2], [17.6, 4.4, 11.2], LINE);
  });
}

// the backsplash, tiled up to the window's sill, and three pendants over
// the island
function finishes(R, k) {
  fading(R, ease(span(k, 0, 0.4)), () => {
    face(R, [[0.4, 3.5, BACK - 0.2], [14.2, 3.5, BACK - 0.2], [14.2, 4.4, BACK - 0.2], [0.4, 4.4, BACK - 0.2]], { tone: "top" });
    for (let x = 0.9; x < 14.2; x += 0.5) seg(R, [x, 3.5, BACK - 0.2], [x, 4.4, BACK - 0.2], LINE * 0.6);
    seg(R, [0.4, 3.95, BACK - 0.2], [14.2, 3.95, BACK - 0.2], LINE * 0.6);
  });
  [6.5, 8.75, 11].forEach((x, i) => {
    const g = ease(span(k, 0.35 + i * 0.15, 0.6 + i * 0.15));
    if (g <= 0) return;
    seg(R, [x, ROOM.h, 7.1], [x, lerp(ROOM.h, 5.9, g), 7.1], EDGE, 1, 1);
    fading(R, g, () => box(R, [x - 0.4, x + 0.4], [5.2, 5.9], [6.7, 7.5], { top: "roof" }));
  });
}

export default {
  stages: 6,
  levels: [0, 12, 13.5, 17.2, 21], // the studs, the room finished, the cabinets, the counters, the backsplash and lights
  short: "Kitchen Remodel",
  plan: {
    size: [18, 14],
    walls: [[0, 0, 18, 14]],
    lines: [],
    windows: [[7.4, 14, 12, 14]],
    doors: [],
    boxes: [[0.4, 11.9, 14.2, 13.6], [5, 5.8, 12.5, 8.4], [14.6, 11.2, 17.6, 13.6]],
    labels: [[9, 3, "KITCHEN"]],
  },
  parts: [
    // 1. Demo & prep: down to the studs, the old kitchen dashed
    { stage: 0, level: 0, bounds: { x: ROOM.x, y: [0, ROOM.h], z: ROOM.z }, draw: demo, ghost: true, shadow: true },
    // 2. Plumbing & electrical
    { stage: 1, level: 0, bounds: { x: [0.3, 17.5], y: [FLOOR, 4.2], z: [0.5, BACK + 0.1] }, draw: runs(ROUGH_IN), hit: false },
    // 3. Floors & paint: the room finished, with its window
    { stage: 2, level: 1, bounds: { x: ROOM.x, y: [0, ROOM.h], z: ROOM.z }, draw: room, ghost: true, drop: 1.5, shadow: true },
    // 4. Cabinets & island
    { stage: 3, level: 2, bounds: { x: [0.4, 14.2], y: [FLOOR, 7.8], z: [5.8, BACK] }, draw: boxes(CABINETS), drop: 1.5 },
    // 5. Counters & appliances
    { stage: 4, level: 3, bounds: { x: [0.3, 17.6], y: [FLOOR, ROOM.h], z: [5.6, BACK] }, draw: counters, drop: 1.5 },
    // 6. Backsplash & lights
    { stage: 5, level: 4, bounds: { x: [0.4, 14.2], y: [3.5, ROOM.h], z: [6.7, BACK] }, draw: finishes, drop: 1.5 },
  ],
  label:
    "A blueprint of a kitchen taken apart, one layer for each stage: the room down to its studs, the plumbing, gas and wiring run through them, the floor and walls finished with the window, the cabinets and island, the counters with the sink and range, the hood and fridge, and the backsplash and pendant lights.",
};
