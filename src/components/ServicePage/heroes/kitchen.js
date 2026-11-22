// The Kitchen Remodel page's hero (ServicePage/ServiceHero): one kitchen,
// a room on its own — no house round it, no other rooms — seen from the
// front right with its near walls left off, remodeled as you scroll. The
// old oak kitchen comes out; the plumbing, gas and wiring are run; the
// floor's laid and the walls painted; sage cabinets and an island go in,
// then the quartz counters, the range, hood and fridge, the subway tile,
// three pendants and the stools; and the lights come on. `k`: how far it's
// got (0 = the old kitchen, 1 = done, lit).
//
// In feet: the room is 18 wide (x) by 14 deep (z), its floor 0.5 up, its
// back (z = 14) and left (x = 0) walls 9.5 tall, a window in the back one.

import { C, M, block, fillPoly, ghost, glow, groundQuad, lerp, line, mix, pane, rgba, run, shadeOf, shadow, span, step, stroke, tileGrid } from "./kit";

const F = 0.5; // the floor's top
const H = 9.5; // the walls' top
const W = 18;
const D = 14;
const WINDOW = { s: [7.4, 12], y: [4.4, 7.8] };
const back = (s, y) => [s, y, D];
const SINK = [8.6, 10.8];
const RANGE = [2.8, 5.6];

export const KITCHEN_BOUNDS = { x: [-1, 19], y: [0, 10.5], z: [-1, 15] };

const T = {
  demo: [0.05, 0.14],
  rough: [0.14, 0.27],
  floor: [0.25, 0.37],
  paint: [0.32, 0.4],
  cabinets: [0.39, 0.54],
  counters: [0.53, 0.6],
  appliances: [0.56, 0.68],
  backsplash: [0.66, 0.76],
  pendants: [0.74, 0.82],
  stools: [0.8, 0.86],
  lights: [0.9, 1],
};

export function drawKitchen(G, k) {
  const { ctx, P } = G;
  const lit = step(k, ...T.lights);
  shadow(G, [0, W], [0, D], 4, 0.6);
  // the floor: the old vinyl, then the new planks laid back to front
  block(G, [-0.5, W], [0, F], [0, D + 0.5], shadeOf(C.concrete, -0.2));
  fillPoly(ctx, P, groundQuad([0, 0, W, D], F + 0.005), rgba([206, 196, 176]));
  const old = 1 - step(k, ...T.demo);
  if (old > 0) tileGrid(G, [[0, F + 0.01, 0], [W, F + 0.01, 0], [W, F + 0.01, D], [0, F + 0.01, D]], 18, 14, old);
  const laid = step(k, ...T.floor);
  if (laid > 0) {
    const z0 = lerp(D, 0, laid);
    fillPoly(ctx, P, groundQuad([0, z0, W, D], F + 0.01), rgba([196, 160, 116]));
    ctx.beginPath();
    for (let z = D - 0.6; z > z0; z -= 0.6) line(ctx, P, [0, F + 0.02, z], [W, F + 0.02, z]);
    stroke(ctx, "rgba(0,0,0,0.12)", 1);
  }
  // the walls: drywall, then painted
  const wall = mix(M.drywall, M.paint, step(k, ...T.paint));
  fillPoly(ctx, P, [[0, F, 0], [0, F, D], [0, H, D], [0, H, 0]], rgba(shadeOf(wall, -0.06)));
  fillPoly(ctx, P, [[0, F, D], [W, F, D], [W, H, D], [0, H, D]], rgba(shadeOf(wall, -0.14)));
  fillPoly(ctx, P, groundQuad([-0.5, 0, 0, D + 0.5], H), rgba(M.section));
  fillPoly(ctx, P, groundQuad([0, D, W, D + 0.5], H), rgba(M.section));
  fillPoly(ctx, P, [[-0.5, 0, 0], [0, 0, 0], [0, H, 0], [-0.5, H, 0]], rgba(shadeOf(wall, -0.25)));
  fillPoly(ctx, P, [[W, 0, D], [W, 0, D + 0.5], [W, H, D + 0.5], [W, H, D]], rgba(shadeOf(wall, -0.2)));
  pane(G, back, WINDOW.s, WINDOW.y, lit, 1, 2);
  // the rough-in, on the walls before they're painted over
  const rough = span(k, ...T.rough);
  const roughA = 1 - step(k, 0.36, 0.42);
  if (rough > 0 && roughA > 0) {
    ctx.save();
    ctx.globalAlpha = roughA;
    run(G, [[9.2, F, D - 0.05], [9.2, 2.6, D - 0.05], [10.2, 2.6, D - 0.05]], span(rough, 0, 0.4), M.copper, 2);
    run(G, [[9.8, F, D - 0.05], [9.8, 2, D - 0.05]], span(rough, 0.1, 0.45), [120, 124, 128], 3);
    run(G, [[4.2, F, D - 0.05], [4.2, 1.6, D - 0.05]], span(rough, 0.25, 0.55), M.wire, 2);
    run(G, [[0.6, 4.2, D - 0.05], [17.4, 4.2, D - 0.05]], span(rough, 0.4, 0.85), M.wire, 1.2);
    run(G, [[0.05, 4.2, 1.2], [0.05, 4.2, D - 0.2]], span(rough, 0.55, 1), M.wire, 1.2);
    ctx.restore();
  }
  // the old kitchen, on its way out
  if (old > 0) {
    ctx.save();
    ctx.globalAlpha = old;
    block(G, [0.2, 14], [F, 3.2], [11.9, D], M.oak);
    block(G, [0.2, 14], [3.2, 3.4], [11.7, D], [214, 200, 170]);
    block(G, [0.2, 6.4], [5.4, 8], [12.8, D], M.oak);
    block(G, [14.4, 17.4], [F, 6.5], [11.4, D], [232, 228, 216]);
    ctx.restore();
  }
  backsplash(G, step(k, ...T.backsplash));
  cabinets(G, k);
  counters(G, k);
  appliances(G, k);
  stools(G, step(k, ...T.stools));
  pendants(G, span(k, ...T.pendants), lit);
  // light under the upper cabinets
  if (lit > 0) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (const [x0, x1] of [[0.2, 2.8], [5.6, 7.2], [12.2, 14]])
      fillPoly(ctx, P, [[x0, 3.45, D - 0.05], [x1, 3.45, D - 0.05], [x1, 5.4, D - 0.05], [x0, 5.4, D - 0.05]], rgba(C.warm, 0.22 * lit));
    ctx.restore();
  }
  glow(G, [[9.7, 6.1, D, 5, 0.18], ...[6.6, 8.75, 10.9].map((x) => [x, 6, 7.1, 2.6, 0.4])], lit);
}

const SAGE = M.sage;
// the base runs (the range's gap left), the uppers either side of the
// window and the hood, and the island, each set in turn
function cabinets(G, k) {
  const runs = [[0.2, 2.8], [5.6, 14]];
  runs.forEach(([x0, x1], i) => block(G, [x0, x1], [F, 3.2], [11.9, D], SAGE, 1, step(k, T.cabinets[0] + i * 0.03, T.cabinets[0] + 0.06 + i * 0.03)));
  [[0.2, 2.8], [5.6, 7.2], [12.2, 14]].forEach(([x0, x1], i) =>
    block(G, [x0, x1], [5.4, 8.6], [12.8, D], SAGE, step(k, T.cabinets[0] + 0.06 + i * 0.02, T.cabinets[0] + 0.1 + i * 0.02)),
  );
  block(G, [5, 12.5], [F, 3.2], [5.8, 8.4], M.navy, 1, step(k, T.cabinets[1] - 0.06, T.cabinets[1]));
  // the doors, once they're all in
  if (k >= T.cabinets[1]) {
    const { ctx, P } = G;
    ctx.beginPath();
    for (let x = 6.9; x < 14; x += 1.4) line(ctx, P, [x, F + 0.3, 11.89], [x, 2.9, 11.89]);
    for (let x = 6.5; x < 12.5; x += 1.5) line(ctx, P, [x, F + 0.3, 5.79], [x, 2.9, 5.79]);
    stroke(ctx, "rgba(0,0,0,0.3)", 1);
  }
}
function counters(G, k) {
  const c = step(k, ...T.counters);
  block(G, [0.1, 14.1], [3.2, 3.42], [11.7, D], M.porcelain, c);
  block(G, [4.8, 12.7], [3.2, 3.45], [5.6, 8.6], M.porcelain, c);
  if (c > 0) fillPoly(G.ctx, G.P, groundQuad([SINK[0], 12.2, SINK[1], 13.6], 3.43), rgba([120, 126, 130], c));
}
function appliances(G, k) {
  const a = step(k, ...T.appliances);
  block(G, RANGE, [F, 3.3], [11.9, D], C.steel, a);
  if (a > 0) fillPoly(G.ctx, G.P, groundQuad([RANGE[0] + 0.2, 12.1, RANGE[1] - 0.2, 13.8], 3.31), rgba(C.trim, a));
  const hood = step(k, T.appliances[0] + 0.03, T.appliances[1]);
  block(G, [RANGE[0] + 0.9, RANGE[1] - 0.9], [7, H], [13.1, D], C.steel, hood);
  block(G, [RANGE[0] + 0.2, RANGE[1] - 0.2], [6.2, 7], [12.4, D], C.steel, hood);
  const fridge = step(k, T.appliances[0] + 0.05, T.appliances[1]);
  block(G, [14.3, 17.6], [F, 7.4], [11.2, D], C.steel, fridge);
  if (fridge >= 1) {
    const { ctx, P } = G;
    ctx.beginPath();
    line(ctx, P, [15.95, F + 0.2, 11.2], [15.95, 7.2, 11.2]);
    stroke(ctx, "rgba(0,0,0,0.3)", 1);
  }
}
// subway tile behind the counters, up to the uppers
function backsplash(G, a) {
  if (a <= 0) return;
  const { ctx, P } = G;
  const pts = (x0, x1) => [[x0, 3.42, D - 0.03], [x1, 3.42, D - 0.03], [x1, 5.4, D - 0.03], [x0, 5.4, D - 0.03]];
  for (const [x0, x1] of [[0.2, 7.2], [12.2, 14]]) {
    fillPoly(ctx, P, pts(x0, x1), rgba(C.tile, a));
    tileGrid(G, pts(x0, x1), Math.round((x1 - x0) / 0.5), 6, a);
  }
}
// three pendants over the island, dropping from the open ceiling
function pendants(G, k, lit) {
  const { ctx, P } = G;
  [6.6, 8.75, 10.9].forEach((x, i) => {
    const g = step(k, i * 0.25, i * 0.25 + 0.5);
    if (g <= 0) return;
    const bottom = lerp(H, 6.7, g);
    const [x0, y0] = P(x, H + 0.6, 7.1);
    const [x1, y1] = P(x, bottom, 7.1);
    const cord = ctx.createLinearGradient(x0, y0, x1, y1);
    cord.addColorStop(0, "rgba(24,25,26,0)");
    cord.addColorStop(1, rgba(C.trim, g));
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    stroke(ctx, cord, 1);
    fillPoly(ctx, P, [[x - 0.25, bottom, 7.1], [x + 0.25, bottom, 7.1], [x + 0.65, bottom - 0.65, 7.1], [x - 0.65, bottom - 0.65, 7.1]], rgba(C.trim, g));
    if (lit > 0 && g >= 1) fillPoly(ctx, P, groundQuad([x - 0.6, 6.9, x + 0.6, 7.3], bottom - 0.65), rgba(C.warm, lit));
  });
}
function stools(G, a) {
  if (a <= 0) return;
  const { ctx, P, lw } = G;
  for (const x of [6.6, 8.75, 10.9]) {
    ctx.beginPath();
    line(ctx, P, [x, F, 9.4], [x, F + 2.1, 9.4]);
    stroke(ctx, rgba(C.trim, a), lw(0.12));
    block(G, [x - 0.5, x + 0.5], [F + 2.1, F + 2.4], [8.9, 9.9], M.walnut, a);
  }
}

// before it's begun: the new kitchen's layout, dashed — its runs and its
// island
export function ghostKitchen(G, a) {
  const r = (x0, x1, z0, z1, y) => [[[x0, y, z0], [x1, y, z0]], [[x1, y, z0], [x1, y, z1]], [[x1, y, z1], [x0, y, z1]], [[x0, y, z1], [x0, y, z0]]];
  ghost(G, [...r(0.2, 14, 11.7, D, 3.4), ...r(5, 12.5, 5.8, 8.4, 3.4), ...r(14.3, 17.6, 11.2, D, 7.4)], a);
}
