// The Deck & Patio page's drawing (layers/index.js): the hero's backyard
// (heroes/deck.js) taken apart in front of its modern flat-roofed house
// (faint: there already). On the ground the deck's footings and posts and
// the patio's pavers with its fire pit and chairs; over them the beams and
// joists; over those the decking with its cable rail and steps; and over the
// patio its pergola, with the string lights hung from it.

import { ease, lerp, span } from "@/components/Home/intro/kit";
import { EDGE, LINE, box, boxes, fading, ground, ink, pavers, put, seg, walls } from "./kit";

const HOUSE = {
  x: [0, 42],
  z: [12, 32],
  base: 0.3,
  wall: 11,
  open: {
    front: [
      { s: [6, 20], y: [0.3, 9], door: "slider" },
      { s: [36, 40], y: [3, 8.4] },
    ],
    right: [{ s: [5, 12], y: [3, 8.4] }],
  },
};
// the house as it stands: its walls, the cedar slats across its front, its
// flat roof out over them
function house(R) {
  walls(HOUSE)(R, 1);
  for (let x = 25.4; x < 33.5; x += 0.8) seg(R, [x, 0.3, 12], [x, 11, 12], LINE * 0.7);
  box(R, [-1.5, 43.5], [11, 11.9], [10.5, 33.5]);
}

const DECK = { x: [4, 22], z: [0, 12], top: 2.6 };
const BEAM = [1.9, 2.3];
const PATIO = [24, -4, 40, 11];
const PAD = { x: [-3, 45], z: [-8, 35], t: 1.3 };

const POSTS = [4.6, 10, 15.5, 21.4].flatMap((x) => [0.6, 6, 11.4].map((z) => [x, z]));
function footings(R, k) {
  POSTS.forEach(([x, z], i) => {
    const g = ease(span(k, (i / POSTS.length) * 0.6, (i / POSTS.length) * 0.6 + 0.3));
    fading(R, g, () => {
      box(R, [x - 0.6, x + 0.6], [0, 0.4], [z - 0.6, z + 0.6]);
      box(R, [x - 0.22, x + 0.22], [0.4, lerp(0.4, BEAM[0], g)], [z - 0.22, z + 0.22]);
    });
  });
}

function framing(R, k) {
  [0.6, 6, 11.4].forEach((z, i) => fading(R, ease(span(k, i * 0.12, i * 0.12 + 0.3)), () => box(R, DECK.x, BEAM, [z - 0.3, z + 0.3])));
  const joists = ease(span(k, 0.35, 1));
  for (let x = DECK.x[0]; x <= DECK.x[1] + 0.01; x += 4 / 3) {
    const g = ease(span(joists, (x - DECK.x[0]) / 22, (x - DECK.x[0]) / 22 + 0.3));
    seg(R, [x, BEAM[1], DECK.z[0]], [x, BEAM[1], DECK.z[1]], x === DECK.x[0] || x > DECK.x[1] - 0.5 ? EDGE : LINE + 0.15, 1.3, g);
  }
  seg(R, [DECK.x[0], BEAM[1], DECK.z[0]], [DECK.x[1], BEAM[1], DECK.z[0]], EDGE, 2, joists);
}

// the decking, its boards, the cable rail and the steps down to the yard
const STAIRS = [15, 19];
function decking(R, k) {
  const laid = ease(span(k, 0, 0.5));
  fading(R, laid, () => {
    box(R, DECK.x, [BEAM[1], DECK.top], DECK.z, { top: "roof" });
    for (let z = DECK.z[0] + 0.55; z < DECK.z[1]; z += 0.55) seg(R, [DECK.x[0], DECK.top + 0.01, z], [DECK.x[1], DECK.top + 0.01, z], LINE * 0.5);
  });
  const rail = ease(span(k, 0.45, 0.85));
  const top = DECK.top + 3.2;
  const posts = [[4, 0], [9.5, 0], [STAIRS[0], 0], [STAIRS[1], 0], [22, 0], [22, 4], [22, 8], [22, 12]];
  posts.forEach(([x, z]) => seg(R, [x, DECK.top, z], [x, top, z], EDGE, 2, rail));
  // its rail, and the cables strung under it
  for (const [y, w, a] of [[top, 1.6, EDGE], [DECK.top + 2.2, 1, LINE], [DECK.top + 1.2, 1, LINE]]) {
    seg(R, [4, y, 0], [STAIRS[0], y, 0], a, w, rail);
    seg(R, [STAIRS[1], y, 0], [22, y, 0], a, w, rail);
    seg(R, [22, y, 0], [22, y, 12], a, w, rail);
  }
  fading(R, ease(span(k, 0.7, 1)), () => {
    box(R, STAIRS, [0, 1.75], [-0.9, 0], { top: "roof" });
    box(R, STAIRS, [0, 0.9], [-1.8, -0.9], { top: "roof" });
  });
}

// the patio's pavers, and its fire pit and the chairs round it
const PAVERS = [];
for (let i = 0; i < 8; i++)
  for (let j = 0; j < 7; j++) {
    const [w, d] = [(PATIO[2] - PATIO[0]) / 8, (PATIO[3] - PATIO[1]) / 7];
    PAVERS.push([PATIO[0] + i * w + 0.08, PATIO[1] + j * d + 0.08, PATIO[0] + (i + 1) * w - 0.08, PATIO[1] + (j + 1) * d - 0.08]);
  }
const SEATING = [
  { x: [29.4, 32.6], y: [0, 1.2], z: [1.9, 5.1], basin: true },
  ...[[27.2, 3.5], [34.8, 3.5], [31, -0.6], [31, 7.6]].map(([x, z]) => ({ x: [x - 0.8, x + 0.8], y: [0, 1.4], z: [z - 0.8, z + 0.8] })),
];
function patio(R, k) {
  pavers(PAVERS, { y: 0.08 })(R, span(k, 0, 0.7));
  boxes(SEATING)(R, span(k, 0.55, 1));
}

// the pergola: four posts at the patio's corners, two beams, rafters across
const PERGOLA = { posts: [[24.6, -3.4], [39.4, -3.4], [24.6, 10.4], [39.4, 10.4]], top: 9 };
function pergola(R, k) {
  const { top } = PERGOLA;
  PERGOLA.posts.forEach(([x, z], i) => {
    const g = ease(span(k, i * 0.08, i * 0.08 + 0.35));
    fading(R, g, () => box(R, [x - 0.3, x + 0.3], [0, lerp(0, top, g)], [z - 0.3, z + 0.3]));
  });
  [-3.4, 10.4].forEach((z, i) => fading(R, ease(span(k, 0.35 + i * 0.1, 0.6 + i * 0.1)), () => box(R, [23.8, 40.2], [top, top + 0.6], [z - 0.25, z + 0.25])));
  for (let x = 24.4, i = 0; x <= 39.7; x += 1.2, i++) {
    const g = ease(span(k, 0.6 + i * 0.025, 0.75 + i * 0.025));
    fading(R, g, () => box(R, [x - 0.12, x + 0.12], [top + 0.6, top + 0.95], [-4.2, 11.2], { top: "roof" }));
  }
}

// string lights, three strands sagging between the beams, a bulb every so
// often
function lights(R, k) {
  const { ctx } = R;
  [-1, 3.5, 8].forEach((z, i) => {
    const g = ease(span(k, i * 0.2, i * 0.2 + 0.5));
    if (g <= 0) return;
    const sag = (t) => PERGOLA.top - 0.1 - 1.1 * (1 - (2 * t - 1) ** 2);
    const pts = [];
    for (let t = 0; t <= g + 1e-6; t += 0.05) pts.push(put(R, [lerp(24.6, 39.4, t), sag(t), z]));
    ctx.beginPath();
    pts.forEach(([x, y], j) => (j ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.strokeStyle = ink(R, LINE);
    ctx.lineWidth = 1;
    ctx.stroke();
    for (let t = 0.06; t < g; t += 0.08) {
      const [x, y] = put(R, [lerp(24.6, 39.4, t), sag(t) - 0.3, z]);
      ctx.beginPath();
      ctx.arc(x, y, Math.max(1.6, R.s * 0.16), 0, Math.PI * 2);
      ctx.fillStyle = ink(R, 1);
      ctx.fill();
    }
  });
}

export default {
  stages: 6,
  levels: [0, 4, 8, 5], // the ground, the deck's framing, the decking, the pergola
  short: "Deck & Patio",
  // (the key plan's z starts at the patio's front, 4 ft out from the deck's)
  plan: {
    size: [42, 36],
    walls: [[0, 16, 42, 36]],
    lines: [[4, 4, 22, 4], [22, 4, 22, 16], [4, 4, 4, 16]],
    dashes: [[24, 0, 40, 0], [40, 0, 40, 15], [24, 0, 24, 15], [24, 15, 40, 15]],
    windows: [[6, 16, 20, 16], [36, 16, 40, 16], [42, 21, 42, 28]],
    doors: [],
    boxes: [[29.4, 5.9, 32.6, 9.1]],
    labels: [[21, 26.5, "HOUSE"], [13, 10.5, "DECK"], [32, 12.6, "PATIO"]],
  },
  parts: [
    // the lot and the house
    {
      stage: null,
      level: 0,
      bounds: { x: PAD.x, y: [-PAD.t, 11.9], z: PAD.z },
      draw: (R, k) => {
        ground(PAD)(R, k);
        house(R);
      },
      faint: 0.7,
    },
    // 1. Footings: dug, poured, the posts set on them
    { stage: 0, level: 0, bounds: { x: DECK.x, y: [0, BEAM[0]], z: DECK.z }, draw: footings, ghost: true },
    // 4. Patio: the pavers laid, the fire pit and the chairs round it
    { stage: 3, level: 0, bounds: { x: [PATIO[0], PATIO[2]], y: [0, 1.4], z: [PATIO[1], PATIO[3]] }, draw: patio, ghost: true },
    // 2. Beams & joists
    { stage: 1, level: 1, bounds: { x: DECK.x, y: BEAM, z: DECK.z }, draw: framing, ghost: true, shadow: true },
    // 3. Decking, the cable rail and the steps
    { stage: 2, level: 2, bounds: { x: DECK.x, y: [0, DECK.top + 3.2], z: [-1.8, DECK.z[1]] }, draw: decking, ghost: true, drop: 1.5, shadow: true },
    // 5. Pergola
    { stage: 4, level: 3, bounds: { x: [23.8, 40.2], y: [0, PERGOLA.top + 0.95], z: [-4.2, 11.2] }, draw: pergola, ghost: true, drop: 2 },
    // 6. Lights
    { stage: 5, level: 3, bounds: { x: [24.6, 39.4], y: [7.8, 8.9], z: [-1, 8] }, draw: lights, hit: false },
  ],
  label:
    "A blueprint of a backyard's deck and patio taken apart in front of a modern house, one layer for each stage: the footings and posts, the beams and joists, the decking with its cable rail and steps, the patio's pavers with a fire pit and chairs, the pergola over it, and the string lights.",
};
