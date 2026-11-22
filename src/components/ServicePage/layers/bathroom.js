// The Bathroom Remodel page's drawing (layers/index.js): the hero's bathroom
// (heroes/bathroom.js — a room of its own, 12 by 9: a walk-in shower behind
// glass in its back left corner, a floating vanity and the toilet along its
// back wall) taken apart through its walls, seen from the front right with
// its near walls left off, the layers stepping up and out to the right:
// first the room down to its studs and subfloor with the supply lines,
// drains and wiring roughed in; then the backer board and waterproof
// membrane on its walls and floor; then the room tiled, with the shower's
// curb and glass, the vanity, mirror and toilet, and its lights and fan.

import { ease, lerp, span } from "@/components/Home/intro/kit";
import { EDGE, boxes, face, fading, box, runs, shell, seg } from "./kit";

const ROOM = { x: [0, 12], z: [0, 9], h: 8, t: 0.4 };
const BACK = 8.6; // the back wall's inner face
const FLOOR = 0.5;
const SHOWER = { x: [0.4, 5], z: [4, BACK] };

const ROUGH_IN = [
  { a: [0.45, FLOOR, 6.4], b: [0.45, 3.8, 6.4], dash: [4, 3] },
  { a: [0.45, 3.8, 6.4], b: [0.45, 6.9, 6.4], dash: [4, 3] },
  { a: [8.5, FLOOR, BACK + 0.1], b: [8.5, 2.6, BACK + 0.1], dash: [4, 3] },
  { a: [11.5, FLOOR, BACK + 0.1], b: [11.5, ROOM.h, BACK + 0.1], heavy: true },
  { a: [0.5, 1.4, BACK + 0.1], b: [11.6, 1.4, BACK + 0.1], dash: [1.5, 2.5] },
  { a: [9, ROOM.h, 3.4], b: [9, ROOM.h, BACK], dash: [6, 3] },
];

// the shower's curb, the floating vanity, the toilet's bowl and tank
const FIXTURES = [
  { x: SHOWER.x, y: [FLOOR, FLOOR + 0.3], z: SHOWER.z },
  { x: [6.4, 10.6], y: [1.6, 3], z: [7.4, BACK], basin: true },
  { x: [10.9, 11.9], y: [FLOOR, 1.9], z: [6.8, 7.8] },
  { x: [10.9, 11.9], y: [1.9, 3.1], z: [7.8, BACK] },
];
function fixtures(R, k) {
  boxes(FIXTURES)(R, k);
  // the shower's glass, its rain head, and the mirror over the vanity
  fading(R, ease(span(k, 0.4, 0.8)), () => {
    face(R, [[5, FLOOR + 0.3, SHOWER.z[0] + 0.6], [5, FLOOR + 0.3, BACK], [5, 7.4, BACK], [5, 7.4, SHOWER.z[0] + 0.6]], { tone: "glass" });
    box(R, [2.3, 3.1], [6.9, 7.05], [6, 6.8], { top: "door" });
  });
  fading(R, ease(span(k, 0.6, 1)), () =>
    face(R, [[6.8, 3.9, BACK - 0.05], [10.2, 3.9, BACK - 0.05], [10.2, 6.3, BACK - 0.05], [6.8, 6.3, BACK - 0.05]], { tone: "glass" }),
  );
}

// the sconces either side of the mirror, the fan, a light over the shower
function lights(R, k) {
  fading(R, ease(span(k, 0, 0.4)), () => {
    box(R, [6.2, 6.5], [4.4, 5.6], [BACK - 0.35, BACK - 0.05], { top: "door" });
    box(R, [10.5, 10.8], [4.4, 5.6], [BACK - 0.35, BACK - 0.05], { top: "door" });
  });
  fading(R, ease(span(k, 0.3, 0.7)), () => {
    box(R, [8.4, 9.6], [ROOM.h - 0.3, ROOM.h], [2.8, 4], { top: "door" });
    for (let i = 1; i < 4; i++) seg(R, [8.4 + i * 0.3, ROOM.h - 0.3, 2.8], [8.4 + i * 0.3, ROOM.h - 0.3, 4], 0.4);
  });
  fading(R, ease(span(k, 0.55, 1)), () => {
    const y = lerp(ROOM.h, 7.4, ease(span(k, 0.55, 1)));
    seg(R, [2.7, ROOM.h, 5.2], [2.7, y, 5.2], EDGE);
    box(R, [2.35, 3.05], [y - 0.4, y], [4.85, 5.55], { top: "door" });
  });
}

export default {
  stages: 6,
  // the studs, the membrane, the tile: each up and out to the right
  levels: [
    [0, 0, 0],
    [9, 9.5, 0],
    [18, 19, 0],
  ],
  short: "Bathroom Remodel",
  plan: {
    size: [12, 9],
    walls: [[0, 0, 12, 9]],
    lines: [[5, 4.6, 5, 9]],
    windows: [],
    doors: [],
    boxes: [[0.4, 4, 5, 8.6], [6.4, 7.4, 10.6, 8.6], [10.9, 6.8, 11.9, 8.6]],
    labels: [[6.5, 2.6, "BATH"], [2.7, 6, "SHOWER"]],
  },
  parts: [
    // 1. Demo & prep: down to the studs and subfloor
    { stage: 0, level: 0, bounds: { x: ROOM.x, y: [0, ROOM.h], z: ROOM.z }, draw: shell(ROOM, { kind: "studs" }), ghost: true, shadow: true },
    // 2. Plumbing & electrical
    { stage: 1, level: 0, bounds: { x: [0.45, 11.6], y: [FLOOR, ROOM.h], z: [3.4, BACK + 0.1] }, draw: runs(ROUGH_IN), hit: false },
    // 3. Waterproofing
    { stage: 2, level: 1, bounds: { x: ROOM.x, y: [0, ROOM.h], z: ROOM.z }, draw: shell(ROOM, { kind: "membrane" }), ghost: true, drop: 1.5, shadow: true },
    // 4. Tile
    { stage: 3, level: 2, bounds: { x: ROOM.x, y: [0, ROOM.h], z: ROOM.z }, draw: shell(ROOM, { kind: "tile" }), ghost: true, drop: 1.5, shadow: true },
    // 5. Vanity & fixtures
    { stage: 4, level: 2, bounds: { x: [0.4, 11.9], y: [FLOOR, 7.4], z: [4, BACK] }, draw: fixtures },
    // 6. Lights & walkthrough
    { stage: 5, level: 2, bounds: { x: [2.35, 10.8], y: [4.4, ROOM.h], z: [2.8, BACK] }, draw: lights },
  ],
  label:
    "A blueprint of a bathroom taken apart through its walls, one layer for each stage: down to the studs, the plumbing and wiring roughed in, the walls and floor waterproofed, the room tiled, the walk-in shower's glass, the floating vanity, mirror and toilet, and the sconces and fan.",
};
