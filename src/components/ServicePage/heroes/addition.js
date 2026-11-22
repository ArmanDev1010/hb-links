// The Home Additions page's hero (ServicePage/ServiceHero): a cream stucco
// bungalow of its own, its gable to the street, and a modern wing built on
// its right side as you scroll — the ground broken, the slab poured, the
// walls framed and tied in with a beam, the shed roof's rafters set, walls
// and roof sheathed, a standing-seam metal roof, cedar siding and a corner
// window, then the planting and the lights. `k`: how far it's got (0 = the
// house as it stands, 1 = done, lit).
//
// In feet: the house is 26 wide (x) by 30 deep (z); the wing is x 26-40, z
// 8-24, its roof sloping from 12 ft at the house down to 9.5 at its right.

import { C, M, block, fillPoly, frameRun, ghost, glow, groundQuad, lawn, lerp, line, mix, pane, pour, rgba, settle, shadeOf, shadow, shrub, spill, step, span, stroke, tree, windowLight } from "./kit";
import { house } from "@/components/Home/intro/kit";

const HOUSE = {
  x0: 0,
  x1: 26,
  z0: 0,
  z1: 30,
  wall: 10,
  pitch: 0.55,
  along: "z",
  color: M.cream,
  roof: C.roof,
  windows: [
    { face: "front", s: [2.5, 7.5], y: [2.6, 7], panes: 2 },
    { face: "front", s: [11.5, 14.5], y: [0.3, 7.4], door: true },
    { face: "front", s: [18.5, 23.5], y: [2.6, 7], panes: 2 },
    { face: "right", s: [2, 6], y: [3, 7] },
  ],
  doorColor: C.green,
};
const WING = { x: [26, 40], z: [8, 24] };
const FLOOR = 1;
const HIGH = 12; // the wing's walls' top at the house
const LOW = 9.5; // and at its right
const topAt = (x) => lerp(HIGH, LOW, (x - 26) / 14);
const wingFront = (s, y) => [26 + s, y, 8];
const wingRight = (s, y) => [40, y, 8 + s];
const FRONT_WINDOW = { s: [3, 9], y: [3, 8.4], panes: 2 };
const CORNER = { s: [2, 12], y: [2.6, 8.4], panes: 3 };

export const ADDITION_BOUNDS = { x: [-3, 44], y: [0, 19], z: [-8, 32] };

const T = {
  ground: [0.02, 0.08],
  slab: [0.08, 0.2],
  frame: [0.2, 0.36],
  beam: [0.34, 0.38],
  rafters: [0.36, 0.46],
  sheath: [0.44, 0.58],
  roofing: [0.56, 0.68],
  cedar: [0.64, 0.76],
  windows: [0.72, 0.8],
  lawn: [0.8, 0.88],
  plants: [0.84, 0.92],
  lights: [0.9, 1],
};

export function drawAddition(G, k) {
  const { ctx, P } = G;
  const lit = step(k, ...T.lights);
  lawn(G, [-6, -8, 46, 34]);
  tree(G, -3, 31, 1.2);
  // the ground broken where the wing goes, then the lawn back over it
  const soil = step(k, ...T.ground) * (1 - step(k, ...T.lawn));
  if (soil > 0) fillPoly(ctx, P, groundQuad([25, 6, 43, 26], 0.015), rgba(C.soil, soil));
  fillPoly(ctx, P, groundQuad([11.5, -8, 14.5, 0], 0.03), rgba(C.path));
  const lights = [windowLight(wingFront, FRONT_WINDOW, [0, -1]), windowLight(wingRight, CORNER, [1, 0])];
  spill(G, lights.map((l) => l.pool), lit);
  shadow(G, [0, 26], [0, 30], 17);
  shadow(G, WING.x, WING.z, 12, step(k, ...T.sheath));
  house(G, HOUSE, lit);
  wing(G, k, lit);
  [[2, -1.4], [23.5, -1.4], [-1.4, 12]].forEach(([x, z]) => shrub(G, x, z, 1, 1));
  [[41.5, 10], [41.5, 17], [41.5, 23], [31, 6.4]].forEach(([x, z], i) => shrub(G, x, z, step(k, T.plants[0] + i * 0.02, T.plants[0] + 0.05 + i * 0.02)));
  glow(G, lights.map((l) => l.spot), lit);
}

function wing(G, k, lit) {
  const { ctx, P, lw } = G;
  pour(G, WING.x, WING.z, FLOOR, span(k, ...T.slab));
  // the framing: the back wall (fainter), the right, the front's studs up
  // to its sloping top, the beam where the house's wall opens
  const frame = span(k, ...T.frame);
  ctx.save();
  ctx.globalAlpha = 0.5;
  frameRun(G, (s, y) => [26 + s, y, 24], 14, [], frame, FLOOR, LOW);
  ctx.restore();
  frameRun(G, wingRight, 16, [CORNER], frame, FLOOR, LOW);
  if (frame > 0) {
    ctx.beginPath();
    for (let s = 0; s <= 14.01; s += 4 / 3) {
      const inWindow = s > FRONT_WINDOW.s[0] - 0.2 && s < FRONT_WINDOW.s[1] + 0.2;
      const g = step(frame, (s / 14) * 0.7, (s / 14) * 0.7 + 0.2);
      if (g <= 0) continue;
      if (inWindow) {
        line(ctx, P, wingFront(s, FLOOR), wingFront(s, FRONT_WINDOW.y[0]), g);
        line(ctx, P, wingFront(s, FRONT_WINDOW.y[1] + 0.4), wingFront(s, topAt(26 + s)), g);
      } else line(ctx, P, wingFront(s, FLOOR), wingFront(s, topAt(26 + s)), g);
    }
    line(ctx, P, wingFront(0, FLOOR), wingFront(14, FLOOR), step(frame, 0, 0.2));
    line(ctx, P, wingFront(0, HIGH), wingFront(14, LOW), step(frame, 0.8, 1));
    ctx.strokeStyle = rgba(settle(C.wood, frame - 1.05));
    ctx.lineWidth = lw(0.15);
    ctx.stroke();
  }
  const beam = step(k, ...T.beam);
  if (beam > 0) {
    ctx.beginPath();
    line(ctx, P, [26, 9.4, 9], [26, 9.4, 23], beam);
    stroke(ctx, rgba(C.wood), lw(0.5, 2));
  }
  // the shed roof's rafters, then its deck and metal
  const rafters = span(k, ...T.rafters);
  const sheath = span(k, ...T.sheath);
  const roofing = step(k, ...T.roofing);
  if (rafters > 0 && sheath < 1) {
    ctx.beginPath();
    for (let z = 6.8; z <= 25.21; z += 2) line(ctx, P, [26, HIGH + 0.4, z], [41.2, LOW - 0.3, z], step(rafters, (z - 6.8) / 22, (z - 6.8) / 22 + 0.3));
    stroke(ctx, rgba(C.wood, 0.95), lw(0.15));
  }
  // the walls: sheathed, then cedar, the front's slope followed
  const cedar = step(k, ...T.cedar);
  if (sheath > 0) {
    const color = (base, shade) => mix(shadeOf(base, -shade), shadeOf(M.cedar, -shade), cedar);
    fillPoly(ctx, P, [wingRight(0, FLOOR), wingRight(16, FLOOR), wingRight(16, LOW), wingRight(0, LOW)], rgba(color(C.osb, 0), step(sheath, 0, 0.5)));
    fillPoly(ctx, P, [wingFront(0, FLOOR), wingFront(14, FLOOR), wingFront(14, LOW), wingFront(0, HIGH)], rgba(color(C.osb, 0.12), step(sheath, 0.3, 0.8)));
    if (cedar > 0) {
      ctx.beginPath();
      for (let s = 0.5; s < 16; s += 0.5) line(ctx, P, wingRight(s, FLOOR), wingRight(s, LOW));
      for (let s = 0.5; s < 14; s += 0.5) line(ctx, P, wingFront(s, FLOOR), wingFront(s, topAt(26 + s)));
      stroke(ctx, `rgba(0,0,0,${0.12 * cedar})`, 1);
    }
    for (const [at, w, when] of [[wingFront, FRONT_WINDOW, [0.72, 0.77]], [wingRight, CORNER, [0.74, 0.8]]]) {
      fillPoly(ctx, P, [at(w.s[0], w.y[0]), at(w.s[1], w.y[0]), at(w.s[1], w.y[1]), at(w.s[0], w.y[1])], rgba(M.dark, step(sheath, 0.5, 1)));
      const a = step(k, ...when);
      if (a > 0) pane(G, at, w.s, w.y, lit, a, w.panes);
    }
  }
  if (sheath > 0) {
    const roofPts = [[26, HIGH + 0.4, 6.8], [41.2, LOW - 0.3, 6.8], [41.2, LOW - 0.3, 25.2], [26, HIGH + 0.4, 25.2]];
    fillPoly(ctx, P, roofPts, rgba(mix(C.osb, M.metal, roofing), step(sheath, 0.5, 1)));
    if (roofing > 0) {
      ctx.beginPath();
      for (let z = 7.8; z < 25.2; z += 1.4) line(ctx, P, [26, HIGH + 0.4, z], [41.2, LOW - 0.3, z], roofing);
      stroke(ctx, "rgba(255,255,255,0.14)", 1);
    }
    ctx.beginPath();
    line(ctx, P, [41.2, LOW - 0.3, 6.8], [41.2, LOW - 0.3, 25.2]);
    line(ctx, P, [26, HIGH + 0.4, 6.8], [41.2, LOW - 0.3, 6.8]);
    stroke(ctx, rgba(C.trim, step(sheath, 0.5, 1)), lw(0.35, 1.4));
  }
  // its front step
  block(G, [32, 36], [0, 0.6], [5.6, 8], C.concrete, step(k, ...T.cedar));
}

// before it's begun: the wing's walls and roof, dashed
export function ghostAddition(G, a) {
  ghost(G, [
    [[26, FLOOR, 8], [40, FLOOR, 8]], [[40, FLOOR, 8], [40, FLOOR, 24]], [[40, FLOOR, 8], [40, LOW, 8]], [[40, FLOOR, 24], [40, LOW, 24]],
    [[26, HIGH, 8], [40, LOW, 8]], [[40, LOW, 8], [40, LOW, 24]], [[26, HIGH, 24], [40, LOW, 24]], [[26, HIGH, 8], [26, HIGH, 24]],
  ], a);
}
