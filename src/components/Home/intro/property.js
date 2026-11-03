// The homepage hero's property (see scene.js): a house at dusk where three of
// HB Links' services are done one after another, each drawn at its own
// progress (0 = not started, 1 = done):
//   - Home Remodel: the roof lifts off and the walls facing the
//     camera come down; the bare shell inside gets wood floors, paint, a
//     kitchen (green cabinets, an island, pendants) and a bathroom (tub, tile,
//     vanity); then the house closes up again
//   - Home Addition: a wing goes up on the house's right side
//   - Deck & Patio: a deck with a pergola off the slider, then a patio with a
//     fire pit, chairs and string lights
// The ADU, in the back corner of the lot, is adu.js. Before each service is
// started, a dashed outline of what it'll build hangs over the lot (`ghost…`).
//
// In feet: the house is 36 wide (x) by 24 deep (z), its floor 2 up, y up; the
// camera looks at its front (z = 0, where the deck goes) and its right side
// (x = 36, where the wing goes). `G` is { ctx, P, s, lw }. Things are drawn
// far to near.

import { lerp, ease, span, mix, rgba, C, path, fillPoly, line, groundQuad, settle, shadeOf, groundGlow, convexHull, block, pane, frameRun, tree } from "./kit";

// how far `k` has got through [a, b], eased
const step = (k, a, b) => ease(span(k, a, b));
// a quad on a wall (`at(s, y)` gives its points), s and y ranges
const quad = (at, s0, s1, y0, y1) => [at(s0, y0), at(s1, y0), at(s1, y1), at(s0, y1)];
function stroke(ctx, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

const DARK = [12, 13, 13]; // an opening before its window goes in
const PORCELAIN = [240, 239, 234];
const WALNUT = [140, 100, 66];
const CHARCOAL = [44, 47, 50];
const DRYWALL = [190, 186, 178];
const SECTION = [230, 227, 218]; // where a wall's been cut, seen from above

// ---- the house --------------------------------------------------------------
const F = 2; // its floor, over a crawlspace
const H = 11; // its walls' top
const CUT = F + 3; // how far its walls come down while it's open
const OVER = 1.2;
const RIDGE = H + 0.5 * 12; // its ridge runs across its front, 6 in 12
const EAVE = H - 0.5 * OVER;
const front = (s, y) => [s, y, 0];
const right = (s, y) => [36, y, s];
const FRONT_WINDOWS = [
  { s: [2.5, 7.5], y: [F + 2.6, F + 6.6], panes: 2 },
  { s: [10.5, 16.5], y: [F + 0.1, F + 6.9], panes: 2 }, // the slider (onto the deck)
  { s: [19.5, 23], y: [F + 2.6, F + 6.6] },
  { s: [27, 33], y: [F + 2.6, F + 6.6], panes: 2 },
];
const SIDE_WINDOW = { s: [9, 15], y: [F + 2.6, F + 6.6], panes: 2 }; // covered by the wing
// inside: the back and left walls' inside faces
const BACK = 23.5;
const LEFT = 0.5;
// How open the house is through its remodel: the roof lifted away, the walls
// lowered to CUT (both 0-1), and back again at the end.
const lifted = (k) => Math.min(step(k, 0, 0.1), 1 - step(k, 0.92, 1));
const lowered = (k) => Math.min(step(k, 0.03, 0.12), 1 - step(k, 0.9, 0.98));

// what's on the property, for the camera
export const PROPERTY_BOUNDS = { x: [-8, 56], y: [0, 18], z: [-20, 30] };

export function drawProperty(G, { remodel, addition, deck }) {
  const { ctx, P } = G;
  const homeLit = 1 - Math.max(lifted(remodel), lowered(remodel));
  const wingLit = step(addition, 0.9, 1);
  const deckLit = step(deck, 0.9, 1);
  lawn(G, [-8, -20, 56, 30]);
  // bare ground where the work is, until it's landscaped
  const wingDone = step(addition, 0.84, 0.92);
  if (addition > 0 && wingDone < 1) fillPoly(ctx, P, groundQuad([35, 1, 54, 23.5], 0.015), rgba(C.soil, 1 - wingDone));
  const deckDone = step(deck, 0.84, 0.92);
  if (deck > 0 && deckDone < 1) fillPoly(ctx, P, groundQuad([4, -16.5, 42, -0.2], 0.015), rgba(C.soil, 1 - deckDone));
  pavers(G, deck);
  tree(G, -4.5, 21, 1.2);

  const homeWindows = [...FRONT_WINDOWS.map((w) => windowLight(front, w, [0, -1])), ...(addition < 0.3 ? [windowLight(right, SIDE_WINDOW, [1, 0])] : [])];
  spill(G, homeWindows.map((l) => l.pool), homeLit);
  spill(G, WING_LIGHTS.map((l) => l.pool), wingLit);
  spill(G, [[PIT.x, PIT.z, 8, 0.3]], deckLit);
  shadow(G, [0, 36], [0, 24], 16, 1 - lifted(remodel));
  shadow(G, [36, 50], [3, 21], 13, step(addition, 0.58, 0.74));

  house(G, remodel, addition, homeLit);
  wing(G, addition, wingLit);
  deckAndPatio(G, deck, deckLit);
  [[2.6, -1.3], [33.8, -1.3]].forEach(([x, z]) => shrub(G, x, z, 1, 0.95));
  [[51.4, 1.6], [37.6, 1.4]].forEach(([x, z], i) => shrub(G, x, z, step(addition, 0.88 + i * 0.02, 0.93 + i * 0.02)));

  glow(G, homeWindows.map((l) => l.spot), homeLit);
  glow(G, WING_LIGHTS.map((l) => l.spot), wingLit);
}

// The house: inside (only while it's open), then its walls facing the camera
// (cut down while it's open), its windows, and its roof (lifted away).
function house(G, k, addition, lit) {
  const { ctx, P } = G;
  const lift = lifted(k);
  const low = lowered(k);
  if (lift > 0 || low > 0) interior(G, k);
  const top = lerp(H, CUT, low);
  const base = mix(C.concrete, [0, 0, 0], 0.35);
  fillPoly(ctx, P, quad(front, 0, 36, 0, top), rgba(shadeOf(C.sand, -0.1)));
  fillPoly(ctx, P, quad(front, 0, 36, 0, F), rgba(shadeOf(base, -0.1)));
  fillPoly(ctx, P, quad(right, 0, 24, 0, top), rgba(C.sand));
  fillPoly(ctx, P, quad(right, 0, 24, 0, F), rgba(base));
  if (low > 0) {
    // the cut along the walls' tops
    fillPoly(ctx, P, groundQuad([0, 0, 36, 0.5], top), rgba(SECTION));
    fillPoly(ctx, P, groundQuad([35.5, 0, 36, 24], top), rgba(SECTION));
  }
  // the windows, as much of each as the wall still reaches
  const windows = [...FRONT_WINDOWS.map((w) => [front, w]), ...(addition < 0.3 ? [[right, SIDE_WINDOW]] : [])];
  for (const [at, w] of windows) {
    const y1 = Math.min(w.y[1], top - 0.2);
    if (y1 > w.y[0] + 0.4) pane(G, at, w.s, [w.y[0], y1], lit, 1, w.panes ?? 1);
  }
  houseRoof(G, lift, step(addition, 0.4, 0.5));
}

// The roof: the gable over the right wall, the far slope (from high up it
// shows just over the ridge), the near slope with its courses, and the
// fascia. `lift` raises it away and fades it; `trim` cuts its overhang back
// over the right gable once the wing's roof meets it.
function houseRoof(G, lift, trim) {
  const { ctx, P, lw } = G;
  const a = 1 - lift;
  if (a <= 0.01) return;
  const dy = 14 * lift;
  const x0 = -OVER, x1 = 36 + lerp(OVER, 0.15, trim);
  fillPoly(ctx, P, [[36, H + dy, 0], [36, H + dy, 24], [36, RIDGE + dy, 12]], rgba(C.sand, a));
  // (the far slope only when it's solid: half see-through it'd show through)
  if (lift <= 0) fillPoly(ctx, P, [[x0, EAVE, 24 + OVER], [x1, EAVE, 24 + OVER], [x1, RIDGE, 12], [x0, RIDGE, 12]], rgba(shadeOf(C.roof, -0.3)));
  const near = [[x0, EAVE + dy, -OVER], [x1, EAVE + dy, -OVER], [x1, RIDGE + dy, 12], [x0, RIDGE + dy, 12]];
  fillPoly(ctx, P, near, rgba(C.roof, a));
  ctx.beginPath();
  for (let r = 1; r < 12; r++) {
    const z = lerp(-OVER, 12, r / 12), y = lerp(EAVE, RIDGE, r / 12) + dy;
    line(ctx, P, [x0, y, z], [x1, y, z]);
  }
  stroke(ctx, rgba([0, 0, 0], 0.2 * a), 1);
  // the evening sky catching it toward the ridge
  path(ctx, P, near);
  const [gx0, gy0] = P(18, EAVE + dy, -OVER);
  const [gx1, gy1] = P(18, RIDGE + dy, 12);
  const sheen = ctx.createLinearGradient(gx0, gy0, gx1, gy1);
  sheen.addColorStop(0, "rgba(255,255,255,0)");
  sheen.addColorStop(1, `rgba(190,215,205,${0.1 * a})`);
  ctx.fillStyle = sheen;
  ctx.fill();
  ctx.beginPath();
  line(ctx, P, [x0, EAVE + dy, -OVER], [x1, EAVE + dy, -OVER]);
  line(ctx, P, [x1, EAVE + dy, -OVER], [x1, RIDGE + dy, 12]);
  line(ctx, P, [x1, RIDGE + dy, 12], [x1, EAVE + dy, 24 + OVER]);
  ctx.lineCap = "round";
  stroke(ctx, rgba(C.trim, a), lw(0.4, 1.2));
  ctx.lineCap = "butt";
}

// Inside the house, back to front, as the remodel goes: subfloor and drywall,
// then wood floors laid from the back wall forward, the bathroom tiled,
// paint, the kitchen, the partition, the bathroom, the dining table.
function interior(G, k) {
  const { ctx, P } = G;
  const lit = step(k, 0.82, 0.88);
  fillPoly(ctx, P, groundQuad([LEFT, 0.5, 35.5, BACK], F), rgba(C.osb));
  const planks = span(k, 0.12, 0.22);
  for (let j = 0; j < 20; j++) {
    const g = step(planks, (j / 20) * 0.75, (j / 20) * 0.75 + 0.25);
    if (g <= 0) continue;
    const z1 = BACK - j * 1.2;
    fillPoly(ctx, P, groundQuad([LEFT, Math.max(0.5, z1 - 1.22), 35.5, z1], F + 0.01), rgba(j % 2 ? C.floor : shadeOf(C.floor, -0.06), g));
  }
  const tiled = step(k, 0.17, 0.24);
  if (tiled > 0) {
    fillPoly(ctx, P, groundQuad([24, 13, 35.5, BACK], F + 0.02), rgba([206, 208, 206], tiled));
    ctx.beginPath();
    for (let x = 25.5; x < 35.5; x += 1.5) line(ctx, P, [x, F + 0.03, 13], [x, F + 0.03, BACK]);
    for (let z = 14.5; z < BACK; z += 1.5) line(ctx, P, [24, F + 0.03, z], [35.5, F + 0.03, z]);
    stroke(ctx, rgba([0, 0, 0], 0.12 * tiled), 1);
  }
  const furnished = step(k, 0.8, 0.85);
  if (furnished > 0) fillPoly(ctx, P, groundQuad([25.6, 3.4, 32.4, 9.4], F + 0.03), rgba([58, 78, 66], furnished));

  // the back and left walls (full height), drywall until they're painted
  const wall = mix(DRYWALL, C.paint, step(k, 0.2, 0.28));
  fillPoly(ctx, P, [[LEFT, F, BACK], [35.5, F, BACK], [35.5, H, BACK], [LEFT, H, BACK]], rgba(shadeOf(wall, -0.12)));
  fillPoly(ctx, P, [[LEFT, F, 0.5], [LEFT, F, BACK], [LEFT, H, BACK], [LEFT, H, 0.5]], rgba(wall));
  fillPoly(ctx, P, groundQuad([0, BACK, 36, 24], H), rgba(SECTION));
  fillPoly(ctx, P, groundQuad([0, 0, LEFT, 24], H), rgba(SECTION));
  fillPoly(ctx, P, [[0, 0, 0], [LEFT, 0, 0], [LEFT, H, 0], [0, H, 0]], rgba(shadeOf(SECTION, -0.12)));
  // the kitchen window over the sink, the bathroom's over the tub
  pane(G, (s, y) => [LEFT, y, s], [11.5, 16.5], [F + 3.4, F + 6.6], 0, 1, 2);
  pane(G, (s, y) => [s, y, BACK], [29, 32.5], [F + 6.6, F + 7.9], 0, 1, 1);
  // tile: the backsplash, and the bathroom's back wall, tiled up from the floor
  const splash = span(k, 0.6, 0.65);
  if (splash > 0) tiles(G, [3.6, lerp(3.6, 13.6, ease(splash))], [F + 3.02, F + 4.6], 0.5);
  const tile = span(k, 0.69, 0.75);
  if (tile > 0) tiles(G, [24, 35.5], [F, lerp(F, F + 6.4, ease(tile))], 1);

  kitchen(G, k, lit);
  // the partition between the kitchen and the bathroom
  fillPoly(ctx, P, [[24, F, 13], [24, F, BACK], [24, H, BACK], [24, H, 13]], rgba(wall));
  fillPoly(ctx, P, [[23.6, F, 13], [24, F, 13], [24, H, 13], [23.6, H, 13]], rgba(shadeOf(SECTION, -0.12)));
  fillPoly(ctx, P, groundQuad([23.6, 13, 24, BACK], H), rgba(SECTION));
  bathroom(G, k, lit);
  // the bathroom's front wall, cut down, its door at the left
  cutWall(G, [26.8, 35.5], [12.75, 13.25], [F, CUT], wall);
  if (furnished > 0) {
    chairAt(G, [27.9, 9.3], furnished, true);
    chairAt(G, [30.1, 9.3], furnished, true);
    block(G, [26.5, 31.5], [F + 2.3, F + 2.5], [5.5, 8.5], WALNUT, furnished);
    ctx.beginPath();
    for (const x of [26.8, 31.2]) line(ctx, P, [x, F, 5.8], [x, F + 2.3, 5.8]);
    stroke(ctx, rgba(shadeOf(WALNUT, -0.3), furnished), G.lw(0.15));
    chairAt(G, [27.9, 4.7], furnished, false);
    chairAt(G, [30.1, 4.7], furnished, false);
  }
  glow(G, [
    [7.4, F + 4.6, 12.5, 3.2, 0.32], [9.5, F + 4.6, 12.5, 3.2, 0.32], [11.6, F + 4.6, 12.5, 3.2, 0.32],
    [5.5, F + 3.8, 22.4, 2.6, 0.18], [11.7, F + 3.8, 22.4, 2.6, 0.18],
    [24.1, F + 7, 16.9, 2.4, 0.3],
    [16, F + 2, 12, 18, 0.07],
  ], lit);
  if (lit > 0) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (const [x, z, r, a] of [[9.5, 12.5, 7, 0.22], [29.5, 18, 6, 0.12], [29, 7, 7, 0.1]]) groundGlow(ctx, P, x, z, r, rgba(C.warm, a * lit), undefined, F);
    ctx.restore();
  }
}

// Tile on the back wall: a light field with its grout lines `size` ft apart.
function tiles(G, [x0, x1], [y0, y1], size) {
  const { ctx, P } = G;
  const z = BACK - 0.02;
  fillPoly(ctx, P, [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]], rgba(shadeOf(C.tile, -0.1)));
  ctx.beginPath();
  for (let x = x0 + size; x < x1; x += size) line(ctx, P, [x, y0, z], [x, y1, z]);
  for (let y = y0 + size; y < y1; y += size) line(ctx, P, [x0, y, z], [x1, y, z]);
  stroke(ctx, rgba([0, 0, 0], 0.13), 1);
}

// A wall cut down to y1, so the room shows over it: its sides in `color`,
// the cut along its top in SECTION.
function cutWall(G, [x0, x1], [z0, z1], [y0, y1], color) {
  const { ctx, P } = G;
  fillPoly(ctx, P, [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], rgba(shadeOf(color, -0.12)));
  fillPoly(ctx, P, [[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]], rgba(color));
  fillPoly(ctx, P, groundQuad([x0, z0, x1, z1], y1), rgba(SECTION));
}

// A dining chair; one on the far side of the table shows its back.
function chairAt(G, [x, z], g, far) {
  if (far) block(G, [x - 0.6, x + 0.6], [F, F + 3.6], [z + 0.35, z + 0.55], WALNUT, g);
  block(G, [x - 0.6, x + 0.6], [F, F + 1.7], [z - 0.55, z + 0.55], WALNUT, g);
}

// The kitchen, back to front: the fridge in the corner, the upper cabinets and
// hood, the base cabinets along the back wall and the left, the counters, the
// island, its stools, and three pendants over it.
function kitchen(G, k, lit) {
  const { ctx, P } = G;
  const fridge = step(k, 0.38, 0.43);
  block(G, [LEFT, 3.4], [F, F + 7], [21, BACK], C.steel, fridge);
  if (fridge >= 1) {
    ctx.beginPath();
    line(ctx, P, [1.95, F + 3, 21], [1.95, F + 7, 21]);
    line(ctx, P, [LEFT, F + 3, 21], [3.4, F + 3, 21]);
    stroke(ctx, "rgba(0,0,0,0.3)", 1);
  }
  [[3.6, 5.4], [5.4, 7.2], [9.8, 11.7], [11.7, 13.6]].forEach(([x0, x1], i) => {
    block(G, [x0, x1 + 0.02], [F + 4.6, F + 7.2], [22.3, BACK], [226, 223, 214], step(k, 0.41 + i * 0.016, 0.44 + i * 0.016));
  });
  const hood = step(k, 0.48, 0.52);
  block(G, [8.1, 8.9], [F + 5.8, H], [22.7, BACK], C.steel, hood);
  block(G, [7.4, 9.6], [F + 5.2, F + 5.8], [22.1, BACK], C.steel, hood);
  for (let i = 0; i < 5; i++) {
    const x0 = 3.6 + i * 2;
    block(G, [x0, x0 + 2.02], [F, F + 2.8], [21.4, BACK], C.green, 1, step(k, 0.27 + i * 0.012, 0.295 + i * 0.012));
  }
  const counters = step(k, 0.55, 0.6);
  block(G, [3.5, 13.7], [F + 2.8, F + 3.02], [21.2, BACK], PORCELAIN, counters);
  if (counters > 0) fillPoly(ctx, P, groundQuad([7.3, 21.8, 9.7, 23.2], F + 3.03), rgba(C.trim, counters));
  for (let j = 0; j < 6; j++) {
    const z1 = 21 - j * 2.5;
    block(G, [LEFT, 2.6], [F, F + 2.8], [z1 - 2.52, z1], C.green, 1, step(k, 0.32 + j * 0.01, 0.345 + j * 0.01));
  }
  const left = step(k, 0.57, 0.62);
  block(G, [LEFT, 2.8], [F + 2.8, F + 3.02], [5.9, 21], PORCELAIN, left);
  if (left > 0) fillPoly(ctx, P, groundQuad([0.9, 13.2, 2.3, 15.4], F + 3.03), rgba([120, 126, 130], left));
  // the cabinets' doors, once they're all in
  if (k >= 0.4) {
    ctx.beginPath();
    for (let x = 4.6; x < 13.6; x += 1) line(ctx, P, [x, F + 0.3, 21.39], [x, F + 2.5, 21.39]);
    for (let z = 6.2; z < 21; z += 1.25) line(ctx, P, [2.61, F + 0.3, z], [2.61, F + 2.5, z]);
    stroke(ctx, "rgba(0,0,0,0.28)", 1);
  }
  block(G, [6, 13], [F, F + 2.8], [11, 14], CHARCOAL, step(k, 0.5, 0.56));
  block(G, [5.8, 13.2], [F + 2.8, F + 3.05], [10.8, 14.2], PORCELAIN, step(k, 0.57, 0.62));
  const stools = step(k, 0.8, 0.85);
  if (stools > 0) {
    for (const x of [7.4, 9.5, 11.6]) {
      ctx.beginPath();
      line(ctx, P, [x, F, 9.9], [x, F + 1.7, 9.9]);
      stroke(ctx, rgba(C.trim, stools), G.lw(0.12));
      block(G, [x - 0.45, x + 0.45], [F + 1.7, F + 2], [9.45, 10.35], WALNUT, stools);
    }
  }
  const pendants = span(k, 0.63, 0.68);
  [7.4, 9.5, 11.6].forEach((x, i) => {
    const g = step(pendants, i * 0.25, i * 0.25 + 0.5);
    if (g <= 0) return;
    // the cord, fading up into the ceiling that's been lifted away
    const [x0, y0] = P(x, H + 0.8, 12.5);
    const [x1, y1] = P(x, F + 6.4, 12.5);
    const cord = ctx.createLinearGradient(x0, y0, x1, y1);
    cord.addColorStop(0, "rgba(24,25,26,0)");
    cord.addColorStop(1, rgba(C.trim, g));
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    stroke(ctx, cord, 1);
    fillPoly(ctx, P, [[x - 0.25, F + 6.4, 12.5], [x + 0.25, F + 6.4, 12.5], [x + 0.6, F + 5.7, 12.5], [x - 0.6, F + 5.7, 12.5]], rgba(C.trim, g));
    if (lit > 0) fillPoly(ctx, P, groundQuad([x - 0.55, 12.3, x + 0.55, 12.7], F + 5.7), rgba(C.warm, lit * g));
  });
  // light under the upper cabinets
  if (lit > 0) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (const [x0, x1] of [[3.6, 7.2], [9.8, 13.6]]) fillPoly(ctx, P, [[x0, F + 3.05, BACK - 0.05], [x1, F + 3.05, BACK - 0.05], [x1, F + 4.6, BACK - 0.05], [x0, F + 4.6, BACK - 0.05]], rgba(C.warm, 0.22 * lit));
    ctx.restore();
  }
}

// The bathroom, back to front: the toilet, the tub, the mirror on the
// partition and the vanity under it.
function bathroom(G, k, lit) {
  const { ctx, P, s } = G;
  const loo = step(k, 0.78, 0.82);
  block(G, [24, 24.7], [F, F + 2.7], [20.6, 22.4], PORCELAIN, loo);
  block(G, [24.7, 26.1], [F, F + 1.3], [20.9, 22.1], PORCELAIN, loo);
  const tub = step(k, 0.66, 0.71);
  block(G, [27, 35.2], [F, F + 1.9], [21.3, BACK], PORCELAIN, tub);
  if (tub > 0) fillPoly(ctx, P, groundQuad([27.5, 21.7, 34.7, 23.1], F + 1.91), rgba([176, 196, 204], tub));
  const mirror = step(k, 0.76, 0.8);
  if (mirror > 0) {
    const at = (z, y) => [24.02, y, z];
    fillPoly(ctx, P, quad(at, 15.2, 18.6, F + 3.6, F + 6.6), rgba(C.trim, mirror));
    const pts = quad(at, 15.4, 18.4, F + 3.8, F + 6.4);
    const [gx0, gy0] = P(...pts[0]);
    const [gx1, gy1] = P(...pts[2]);
    const g = ctx.createLinearGradient(gx0, gy0, gx1, gy1);
    g.addColorStop(0, rgba([120, 140, 148], mirror));
    g.addColorStop(1, rgba([196, 212, 216], mirror));
    fillPoly(ctx, P, pts, g);
    // the light over it
    const [lx, ly] = P(24.05, F + 6.95, 16.9);
    ctx.fillStyle = rgba(mix(C.trim, C.warm, lit), mirror);
    ctx.fillRect(lx - s * 0.7, ly - s * 0.12, s * 1.4, s * 0.24);
  }
  const vanity = step(k, 0.73, 0.78);
  block(G, [24, 25.8], [F, F + 2.6], [15, 18.8], WALNUT, vanity);
  block(G, [24, 26], [F + 2.6, F + 2.8], [14.9, 18.9], PORCELAIN, vanity);
  if (vanity > 0) fillPoly(ctx, P, groundQuad([24.4, 16.1, 25.5, 17.7], F + 2.81), rgba([190, 196, 198], vanity));
}

// ---- the addition -----------------------------------------------------------
// A wing on the house's right side, x 36-50, z 3-19: a raised slab, framing,
// its own gable facing the camera, sheathing, a roof, stucco to match,
// windows. Its ridge runs front to back at x 43.
const WING_RIDGE = H + 0.6 * 7;
const WING_EAVE = H - 0.6 * OVER;
const wingRoofY = (x) => H + 0.6 * (7 - Math.abs(x - 43));
const wingFront = (s, y) => [36 + s, y, 3];
const wingRight = (s, y) => [50, y, 3 + s];
const wingBack = (s, y) => [36 + s, y, 21];
const WING_OPEN = {
  front: [{ s: [3, 11], y: [F + 1.6, F + 6.2], panes: 3, when: [0.78, 0.83] }],
  right: [{ s: [4, 12], y: [F + 2, F + 6], panes: 2, when: [0.81, 0.86] }],
};
const WING_LIGHTS = [windowLight(wingFront, WING_OPEN.front[0], [0, -1]), windowLight(wingRight, WING_OPEN.right[0], [1, 0])];

function wing(G, k, lit) {
  if (k <= 0) return;
  const { ctx, P, lw } = G;
  block(G, [36, 50], [0, F], [3, 21], settle(C.concrete, k - 0.1), 1, step(k, 0, 0.1));
  ctx.save();
  ctx.globalAlpha = 0.5;
  frameRun(G, wingBack, 14, [], span(k, 0.08, 0.2), F, H);
  ctx.restore();
  frameRun(G, wingFront, 14, WING_OPEN.front, span(k, 0.15, 0.3), F, H);
  frameRun(G, wingRight, 18, WING_OPEN.right, span(k, 0.24, 0.38), F, H);
  wingBones(G, k);
  const frontSkin = { sheath: span(k, 0.5, 0.58), stucco: span(k, 0.7, 0.78), shade: 0.1, color: C.sand, opens: WING_OPEN.front, k, lit };
  skin(G, wingFront, 14, [F, H], frontSkin);
  if (frontSkin.sheath >= 1) {
    // the gable over it
    const color = mix(mix(C.osb, [0, 0, 0], 0.1), shadeOf(C.sand, -0.1), ease(frontSkin.stucco));
    fillPoly(ctx, P, [[36, H, 3], [50, H, 3], [43, WING_RIDGE, 3]], rgba(color, step(k, 0.58, 0.6)));
  }
  skin(G, wingRight, 18, [F, H], { sheath: span(k, 0.55, 0.63), stucco: span(k, 0.72, 0.8), color: C.sand, opens: WING_OPEN.right, k, lit });
  wingRoof(G, k, lw);
}

// The wing's roof framing: the gable studs, the ridge board, then rafters
// down to the house's wall on the left (dimmer) and over the eave on the right.
function wingBones(G, k) {
  const { ctx, P, lw } = G;
  const gable = span(k, 0.36, 0.42);
  if (gable > 0) {
    ctx.beginPath();
    for (let x = 36 + 4 / 3; x < 50; x += 4 / 3) line(ctx, P, [x, H, 3], [x, wingRoofY(x), 3], ease(gable));
    stroke(ctx, rgba(C.wood, 0.8), lw(0.12));
  }
  const ridge = span(k, 0.38, 0.42);
  if (ridge <= 0) return;
  ctx.beginPath();
  line(ctx, P, [43, WING_RIDGE, 1.8], [43, WING_RIDGE, 22.2], ease(ridge));
  stroke(ctx, rgba(settle(C.wood, k - 0.42), 0.95), lw(0.25));
  const n = 11;
  for (let i = 0; i < n; i++) {
    const z = lerp(1.8, 22.2, i / (n - 1));
    const at = lerp(0.4, 0.488, i / (n - 1));
    const kk = span(k, at, at + 0.012);
    if (kk <= 0) continue;
    const color = settle(C.wood, k - at - 0.012);
    ctx.beginPath();
    line(ctx, P, [36, H, z], [43, WING_RIDGE, z], ease(kk));
    stroke(ctx, rgba(color, 0.5), lw(0.15));
    ctx.beginPath();
    line(ctx, P, [50 + OVER, WING_EAVE, z], [43, WING_RIDGE, z], ease(kk));
    stroke(ctx, rgba(color, 0.95), lw(0.15));
  }
}

// The wing's roof: the deck going on in strips from the front, shingles over
// it, and the fascia along its gable and eave.
function wingRoof(G, k, lw) {
  const { ctx, P } = G;
  const deck = span(k, 0.58, 0.66);
  if (deck <= 0) return;
  const strips = 6, z0 = 1.8, z1 = 22.2, w = (z1 - z0) / strips;
  for (const far of [true, false]) {
    for (let i = 0; i < strips; i++) {
      const on = span(deck, i / strips, (i + 0.8) / strips);
      if (on <= 0) continue;
      const za = z0 + i * w, zb = Math.min(z1, za + w + 0.06);
      const start = lerp(0.64, 0.72, i / strips);
      const color = mix(settle(C.osb, k - lerp(0.58, 0.66, (i + 0.8) / strips), 0.3), C.roof, step(k, start, start + 0.02));
      const pts = far
        ? [[36, H, za], [43, WING_RIDGE, za], [43, WING_RIDGE, zb], [36, H, zb]]
        : [[43, WING_RIDGE, za], [50 + OVER, WING_EAVE, za], [50 + OVER, WING_EAVE, zb], [43, WING_RIDGE, zb]];
      fillPoly(ctx, P, pts, rgba(far ? shadeOf(color, -0.22) : color, ease(on)));
    }
  }
  const shingled = span(k, 0.64, 0.74);
  if (shingled > 0) {
    // the courses, parallel to the eave
    ctx.beginPath();
    for (let r = 1; r < 10; r++) {
      const x = lerp(50 + OVER, 43, r / 10), y = lerp(WING_EAVE, WING_RIDGE, r / 10);
      line(ctx, P, [x, y, z0], [x, y, lerp(z0, z1, ease(shingled))]);
    }
    stroke(ctx, rgba([0, 0, 0], 0.22 * shingled), 1);
  }
  ctx.beginPath();
  line(ctx, P, [36, H, z0], [43, WING_RIDGE, z0], ease(deck));
  line(ctx, P, [43, WING_RIDGE, z0], [50 + OVER, WING_EAVE, z0], ease(deck));
  line(ctx, P, [50 + OVER, WING_EAVE, z0], [50 + OVER, WING_EAVE, z1], ease(deck));
  ctx.lineCap = "round";
  stroke(ctx, rgba(mix(C.wood, C.trim, step(k, 0.76, 0.8))), lw(0.4, 1.2));
  ctx.lineCap = "butt";
}

// ---- the deck and patio -----------------------------------------------------
// Off the slider, level with the floor: posts, beams, joists, boards, a
// railing, stairs and a pergola; then the patio beside it, a fire pit, chairs,
// and string lights from the pergola to two poles.
const DECK = { x0: 6, x1: 25, z0: -12, z1: 0 };
const DECK_POSTS = [6.4, 12.7, 18.9, 24.6].flatMap((x) => [[x, -5.8], [x, -11.6]]);
const PERGOLA = { posts: [[17, -0.6], [24.4, -0.6], [17, -11], [24.4, -11]], top: F + 7.8 };
const PATIO = { x0: 27.5, z0: -14, cols: 6, rows: 6, size: 1.92 };
const PIT = { x: 33.3, z: -8.3, r: 1.7, h: 1.3 };
// chairs round it, each with its back away from the fire
const CHAIRS = [
  { x: 33.5, z: -5.2, back: "z1" },
  { x: 30.3, z: -8.5, back: "x0" },
];
const NEAR_CHAIR = { x: 36.4, z: -8.7, back: "x1" };
const POLES = [[40.6, -2.6], [40.6, -14.6]];
const STRANDS = [
  [[24.4, PERGOLA.top + 0.3, -0.6], [40.6, 9.4, -2.6]],
  [[24.4, PERGOLA.top + 0.3, -11], [40.6, 9.4, -14.6]],
  [[40.6, 9.4, -14.6], [40.6, 9.4, -2.6]],
];

function deckAndPatio(G, k, lit) {
  if (k <= 0) return;
  const { ctx, P, lw } = G;
  // the ledger on the house, the posts, beams and joists
  const ledger = span(k, 0, 0.06);
  ctx.beginPath();
  line(ctx, P, [DECK.x0, F - 0.3, -0.05], [DECK.x1, F - 0.3, -0.05], ease(ledger));
  stroke(ctx, rgba(settle(C.wood, k - 0.06)), lw(0.3));
  DECK_POSTS.forEach(([x, z], i) => {
    block(G, [x - 0.25, x + 0.25], [0, F - 0.5], [z - 0.25, z + 0.25], settle(C.wood, k - 0.16), 1, step(k, 0.04 + i * 0.012, 0.07 + i * 0.012));
  });
  for (const [i, z] of [[0, -5.8], [1, -11.6]]) {
    const kk = span(k, 0.14 + i * 0.04, 0.2 + i * 0.04);
    if (kk <= 0) continue;
    ctx.beginPath();
    line(ctx, P, [DECK.x0, F - 0.4, z], [DECK.x1, F - 0.4, z], ease(kk));
    stroke(ctx, rgba(settle(C.wood, k - 0.24)), lw(0.35));
  }
  const joists = span(k, 0.22, 0.38);
  if (joists > 0) {
    ctx.beginPath();
    for (let x = DECK.x0; x <= DECK.x1 + 0.01; x += 4 / 3) {
      const at = ((x - DECK.x0) / (DECK.x1 - DECK.x0)) * 0.8;
      const kk = span(joists, at, at + 0.2);
      if (kk > 0) line(ctx, P, [x, F - 0.2, DECK.z1], [x, F - 0.2, DECK.z0], ease(kk));
    }
    stroke(ctx, rgba(settle(C.wood, k - 0.38)), lw(0.15));
  }
  // the boards, laid from the house out
  const boards = span(k, 0.38, 0.56);
  for (let j = 0; j < 12; j++) {
    const g = step(boards, (j / 12) * 0.8, (j / 12) * 0.8 + 0.2);
    if (g <= 0) continue;
    const z1 = DECK.z1 - j, z0 = z1 - 1.03;
    const color = settle(j % 2 ? C.deck : shadeOf(C.deck, -0.06), boards - (j / 12) * 0.8 - 0.2, 0.4);
    fillPoly(ctx, P, groundQuad([DECK.x0, Math.max(DECK.z0, z0), DECK.x1, z1], F), rgba(color, g));
  }
  const fascia = step(k, 0.54, 0.58);
  if (fascia > 0) {
    fillPoly(ctx, P, [[DECK.x0, F - 0.8, DECK.z0], [DECK.x1, F - 0.8, DECK.z0], [DECK.x1, F, DECK.z0], [DECK.x0, F, DECK.z0]], rgba(shadeOf(C.deckDark, -0.1), fascia));
    fillPoly(ctx, P, [[DECK.x1, F - 0.8, DECK.z0], [DECK.x1, F - 0.8, DECK.z1], [DECK.x1, F, DECK.z1], [DECK.x1, F, DECK.z0]], rgba(C.deckDark, fascia));
  }
  // the pergola's posts, then the railing in front of them, the stairs, and
  // the pergola's beams and slats over it all
  const pergola = span(k, 0.68, 0.84);
  PERGOLA.posts.forEach(([x, z], i) => {
    block(G, [x - 0.3, x + 0.3], [F, PERGOLA.top], [z - 0.3, z + 0.3], C.wood, 1, step(pergola, i * 0.08, i * 0.08 + 0.3));
  });
  railing(G, k);
  const stairs = span(k, 0.56, 0.64);
  for (let j = 0; j < 3; j++) {
    block(G, [13.2, 16.3], [0, F - 0.5 * (j + 1)], [DECK.z0 - (j + 1), DECK.z0 - j], C.deck, step(stairs, j * 0.3, j * 0.3 + 0.4));
  }
  for (const [i, z] of [[0, -0.6], [1, -11]]) {
    const kk = step(pergola, 0.55 + i * 0.08, 0.7 + i * 0.08);
    if (kk > 0) block(G, [16.4, lerp(16.4, 25.1, kk)], [PERGOLA.top - 0.4, PERGOLA.top], [z - 0.2, z + 0.2], C.wood);
  }
  const slats = span(pergola, 0.75, 1);
  if (slats > 0) {
    for (let x = 16.8; x < 24.8; x += 0.85) {
      const at = ((x - 16.8) / 8) * 0.8;
      const g = step(slats, at, at + 0.2);
      if (g > 0) block(G, [x, x + 0.22], [PERGOLA.top, PERGOLA.top + 0.25], [-11.7, lerp(-11.7, 0, g)], C.wood);
    }
  }
  // round the fire pit, far to near
  CHAIRS.forEach((c, i) => chair(G, c, step(k, 0.78 + i * 0.03, 0.83 + i * 0.03)));
  firePit(G, k, lit);
  chair(G, NEAR_CHAIR, step(k, 0.84, 0.88));
  stringLights(G, k, lit);
  [[8, -13.4], [10.8, -13.2]].forEach(([x, z], i) => shrub(G, x, z, step(k, 0.88 + i * 0.02, 0.93 + i * 0.02)));
}

// The patio's pavers, laid from the left, a little uneven in tone.
function pavers(G, k) {
  const p = span(k, 0.6, 0.72);
  if (p <= 0) return;
  const { ctx, P } = G;
  const { x0, z0, cols, rows, size } = PATIO;
  for (let i = 0; i < cols; i++) {
    const g = step(p, (i / cols) * 0.7, (i / cols) * 0.7 + 0.3);
    if (g <= 0) continue;
    for (let j = 0; j < rows; j++) {
      const x = x0 + i * size, z = z0 + j * size;
      const tone = ((i * 7 + j * 3) % 4) * 0.05;
      fillPoly(ctx, P, groundQuad([x + 0.07, z + 0.07, x + size - 0.07, z + size - 0.07], 0.05), rgba(mix(C.path, C.concrete, tone), g));
    }
  }
}

// The deck's railing: dark balusters and posts under a wooden cap, along the
// right edge (it's farther back), then the front either side of the stairs.
function railing(G, k) {
  const r = span(k, 0.62, 0.76);
  if (r <= 0) return;
  const { ctx, P, lw } = G;
  const runs = [
    [[24.85, -0.1], [24.85, -11.85]],
    [[6.2, -11.85], [13.1, -11.85]],
    [[16.4, -11.85], [24.85, -11.85]],
  ];
  runs.forEach(([a, b], i) => {
    const kk = ease(span(r, i * 0.25, i * 0.25 + 0.5));
    if (kk <= 0) return;
    const at = (u, y) => [lerp(a[0], b[0], u), y, lerp(a[1], b[1], u)];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    ctx.beginPath();
    const n = Math.round(len / 0.5);
    for (let j = 1; j < n && j / n <= kk; j++) line(ctx, P, at(j / n, F), at(j / n, F + 2.9));
    stroke(ctx, rgba(C.trim, 0.9), lw(0.08));
    const posts = Math.max(1, Math.round(len / 4));
    for (let j = 0; j <= posts && j / posts <= kk + 0.001; j++) {
      const [x, , z] = at(j / posts, 0);
      block(G, [x - 0.17, x + 0.17], [F, F + 3], [z - 0.17, z + 0.17], C.trim);
    }
    ctx.beginPath();
    line(ctx, P, at(0, F + 3.05), at(kk, F + 3.05));
    stroke(ctx, rgba(C.wood), lw(0.28));
  });
}

// A patio chair: a seat and a back on the side away from the fire.
function chair(G, { x, z, back }, g) {
  if (g <= 0) return;
  const seat = [x - 0.8, x + 0.8], depth = [z - 0.8, z + 0.8];
  const white = [232, 228, 220];
  const backBlock = () => {
    if (back === "x0") block(G, [x - 0.8, x - 0.5], [0, 2.9], depth, white, g);
    else if (back === "x1") block(G, [x + 0.5, x + 0.8], [0, 2.9], depth, white, g);
    else block(G, seat, [0, 2.9], [z + 0.5, z + 0.8], white, g);
  };
  // a back the camera sees past goes first
  if (back !== "x1") backBlock();
  block(G, seat, [0, 1.4], depth, white, g);
  if (back === "x1") backBlock();
}

// The fire pit: a ring of stone, and the fire in it once the lights are on.
function firePit(G, k, lit) {
  const g = step(k, 0.72, 0.8);
  if (g <= 0) return;
  const { ctx, P, s } = G;
  const { x, z, r, h } = PIT;
  const ring = (rr, y) => Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * Math.PI * 2;
    return [x + Math.cos(a) * rr, y, z + Math.sin(a) * rr];
  });
  const top = h * g;
  const side = convexHull([...ring(r, 0), ...ring(r, top)].map((p) => P(...p).slice(0, 2)));
  ctx.beginPath();
  side.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
  ctx.closePath();
  ctx.fillStyle = rgba([92, 88, 82]);
  ctx.fill();
  fillPoly(ctx, P, ring(r, top), rgba([150, 144, 134]));
  fillPoly(ctx, P, ring(r * 0.68, top + 0.01), rgba([28, 24, 20]));
  const fire = lit * g;
  if (fire <= 0) return;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const [cx, cy] = P(x, top + 0.6, z);
  const flame = ctx.createRadialGradient(cx, cy, 0, cx, cy, s * 3.2);
  flame.addColorStop(0, `rgba(255,190,110,${0.8 * fire})`);
  flame.addColorStop(0.25, `rgba(255,120,40,${0.4 * fire})`);
  flame.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = flame;
  ctx.beginPath();
  ctx.arc(cx, cy, s * 3.2, 0, Math.PI * 2);
  ctx.fill();
  // three tongues of flame
  for (const [dx, hh] of [[-0.4, 1.3], [0.1, 1.9], [0.5, 1.1]]) {
    const [bx, by] = P(x + dx, top, z);
    const [tx, ty] = P(x + dx * 0.6, top + hh, z);
    const w = s * 0.42;
    ctx.beginPath();
    ctx.moveTo(bx - w, by);
    ctx.quadraticCurveTo(bx - w * 0.6, (by + ty) / 2, tx, ty);
    ctx.quadraticCurveTo(bx + w * 0.6, (by + ty) / 2, bx + w, by);
    ctx.closePath();
    ctx.fillStyle = `rgba(255,170,70,${0.75 * fire})`;
    ctx.fill();
  }
  ctx.restore();
}

// String lights from the pergola to two poles past the patio, sagging between
// them; the bulbs come on with the lights.
function stringLights(G, k, lit) {
  const { ctx, P, s } = G;
  POLES.forEach(([x, z], i) => block(G, [x - 0.2, x + 0.2], [0, 9.6], [z - 0.2, z + 0.2], C.trim, 1, step(k, 0.8 + i * 0.02, 0.84 + i * 0.02)));
  const strung = span(k, 0.84, 0.92);
  if (strung <= 0) return;
  const at = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u) - 1.3 * 4 * u * (1 - u), lerp(a[2], b[2], u)];
  STRANDS.forEach(([a, b], i) => {
    const kk = span(strung, i * 0.25, i * 0.25 + 0.5);
    if (kk <= 0) return;
    ctx.beginPath();
    const n = 24;
    for (let j = 0; j <= n * kk; j++) {
      const [x, y] = P(...at(a, b, j / n));
      if (j) ctx.lineTo(x, y);
      else ctx.moveTo(x, y);
    }
    stroke(ctx, rgba(C.trim, 0.9), 1);
    const bulbs = 9;
    for (let j = 1; j < bulbs && j / bulbs <= kk; j++) {
      const [x, y] = P(...at(a, b, j / bulbs));
      ctx.fillStyle = rgba(mix([110, 104, 90], [255, 214, 150], lit));
      ctx.beginPath();
      ctx.arc(x, y + Math.max(1, s * 0.14), Math.max(1, s * 0.13), 0, Math.PI * 2);
      ctx.fill();
      if (lit > 0) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        const g = ctx.createRadialGradient(x, y, 0, x, y, s * 1.4);
        g.addColorStop(0, rgba(C.warm, 0.35 * lit));
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, s * 1.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  });
}

// ---- ghosts -----------------------------------------------------------------
// Before a service starts, a dashed outline of what it'll build hangs over the
// lot, drawn over everything like a blueprint; `a` fades it.
function ghost(G, segments, a) {
  if (a <= 0.01) return;
  const { ctx, P } = G;
  ctx.save();
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  for (const [p, q] of segments) line(ctx, P, p, q);
  ctx.strokeStyle = rgba([150, 228, 182], 0.6 * a);
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}
// a box's twelve edges
function box([x0, x1], [y0, y1], [z0, z1]) {
  const c = (i) => [i & 1 ? x1 : x0, i & 2 ? y1 : y0, i & 4 ? z1 : z0];
  return [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]].map(([i, j]) => [c(i), c(j)]);
}
// a rectangle lying flat at height y
const flat = ([x0, x1], y, [z0, z1]) => [
  [[x0, y, z0], [x1, y, z0]], [[x1, y, z0], [x1, y, z1]], [[x1, y, z1], [x0, y, z1]], [[x0, y, z1], [x0, y, z0]],
];

// the ADU (in its own frame, adu.js): its walls and its roof
export function ghostADU(G, a) {
  const zm = 10, e = 8.28, r = 15;
  ghost(G, [
    ...box([0, 30], [0.6, 9], [0, 20]),
    [[-1.2, r, zm], [31.2, r, zm]], [[-1.2, e, -1.2], [31.2, e, -1.2]], [[-1.2, e, 21.2], [31.2, e, 21.2]],
    [[-1.2, e, -1.2], [-1.2, r, zm]], [[-1.2, r, zm], [-1.2, e, 21.2]], [[31.2, e, -1.2], [31.2, r, zm]], [[31.2, r, zm], [31.2, e, 21.2]],
  ], a);
}
// the kitchen and bathroom, seen through the roof like a floor plan: the
// cabinets, the island, the tub and the vanity
export function ghostRemodel(G, a) {
  ghost(G, [
    ...flat([3.6, 13.6], F + 3, [21.4, BACK]),
    ...flat([LEFT, 2.6], F + 3, [6, 21]),
    ...flat([6, 13], F + 3, [11, 14]),
    ...flat([27, 35.2], F + 1.9, [21.3, BACK]),
    ...flat([24, 25.8], F + 2.6, [15, 18.8]),
    [[24, F, 13], [24, F, BACK]],
  ], a);
}
// the wing: its walls and its roof
export function ghostAddition(G, a) {
  const e = WING_EAVE, r = WING_RIDGE;
  ghost(G, [
    ...box([36, 50], [F, H], [3, 21]),
    [[43, r, 1.8], [43, r, 22.2]], [[51.2, e, 1.8], [51.2, e, 22.2]],
    [[36, H, 1.8], [43, r, 1.8]], [[43, r, 1.8], [51.2, e, 1.8]], [[36, H, 22.2], [43, r, 22.2]], [[43, r, 22.2], [51.2, e, 22.2]],
  ], a);
}
// the deck, its railing and pergola, the patio and the fire pit
export function ghostDeck(G, a) {
  const t = PERGOLA.top;
  const ring = Array.from({ length: 16 }, (_, i) => {
    const a0 = (i / 16) * Math.PI * 2, a1 = ((i + 1) / 16) * Math.PI * 2;
    return [[PIT.x + Math.cos(a0) * PIT.r, 0.05, PIT.z + Math.sin(a0) * PIT.r], [PIT.x + Math.cos(a1) * PIT.r, 0.05, PIT.z + Math.sin(a1) * PIT.r]];
  });
  ghost(G, [
    ...box([DECK.x0, DECK.x1], [F - 0.8, F], [DECK.z0, DECK.z1]),
    [[DECK.x0, F + 3, DECK.z0], [DECK.x1, F + 3, DECK.z0]], [[DECK.x1, F + 3, DECK.z0], [DECK.x1, F + 3, DECK.z1]],
    ...PERGOLA.posts.map(([x, z]) => [[x, F, z], [x, t, z]]),
    ...flat([16.4, 25.1], t, [-11.2, -0.4]),
    ...flat([PATIO.x0, PATIO.x0 + PATIO.cols * PATIO.size], 0.05, [PATIO.z0, PATIO.z0 + PATIO.rows * PATIO.size]),
    ...ring,
  ], a);
}

// ---- shared pieces ----------------------------------------------------------

// The lawn, with faint mowing stripes across it.
function lawn(G, [x0, z0, x1, z1]) {
  const { ctx, P } = G;
  fillPoly(ctx, P, groundQuad([x0, z0, x1, z1], 0.01), rgba(C.lawn));
  for (let z = z0 + 2; z < z1; z += 4)
    fillPoly(ctx, P, groundQuad([x0, z, x1, Math.min(z1, z + 2)], 0.012), rgba(C.lawnDark, 0.55));
}

// A soft shadow falling to the left from a box `h` tall.
function shadow(G, [x0, x1], [z0, z1], h, a = 1) {
  if (a <= 0) return;
  const { ctx, P, s } = G;
  const cast = (x, y, z) => P(x - 0.55 * y, 0.02, z - 0.3 * y);
  const pts = [];
  for (const x of [x0, x1]) for (const z of [z0, z1]) for (const y of [0, h]) pts.push(cast(x, y, z));
  const hull = convexHull(pts.map(([x, y]) => [x, y]));
  ctx.save();
  ctx.filter = `blur(${Math.max(2, s * 0.45)}px)`;
  ctx.beginPath();
  hull.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();
  ctx.fillStyle = `rgba(0,0,0,${0.36 * a})`;
  ctx.fill();
  ctx.restore();
}

// A shrub, a few overlapping rounded clumps, grown `g` of the way.
function shrub(G, x, z, g, size = 1) {
  if (g <= 0) return;
  const { ctx, P, s } = G;
  const r = s * 0.85 * g * size;
  for (const [dx, dy, rr] of [[-0.55, 0.1, 0.8], [0.55, 0.15, 0.75], [0, -0.35, 0.9]]) {
    const [cx, cy] = P(x + dx * size, (0.9 + dy) * size, z);
    const grad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.4, 0, cx, cy, r * rr * 1.1);
    grad.addColorStop(0, rgba(C.shrubHi));
    grad.addColorStop(1, rgba(C.shrub));
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r * rr, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Warm light: `spots` glowing in the air ([x, y, z, radius, alpha]), `pools`
// on the ground ([x, z, radius, alpha]), `lit` of the way on.
function glow(G, spots, lit) {
  if (lit <= 0) return;
  const { ctx, P, s } = G;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const [x, y, z, r, a] of spots) {
    const [cx, cy] = P(x, y, z);
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * s);
    g.addColorStop(0, rgba(C.warm, a * lit));
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r * s, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
function spill(G, pools, lit) {
  if (lit <= 0) return;
  const { ctx, P } = G;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const [x, z, r, a] of pools) groundGlow(ctx, P, x, z, r, rgba(C.warm, a * lit));
  ctx.restore();
}

// Where a window glows, and where its light falls (`out` is the way its
// wall faces, [dx, dz]).
function windowLight(at, w, out) {
  const [x, y, z] = at((w.s[0] + w.s[1]) / 2, (w.y[0] + w.y[1]) / 2);
  const width = w.s[1] - w.s[0];
  return { spot: [x, y, z, width * 0.9 + 1.5, 0.22], pool: [x + out[0] * 3, z + out[1] * 3, width * 0.9 + 2.5, 0.2] };
}

// A window going into a wall: a dark rough opening, then the window as `k`
// runs through `o.when`.
function opening(G, at, o, k, lit) {
  const { ctx, P } = G;
  fillPoly(ctx, P, quad(at, o.s[0], o.s[1], o.y[0], o.y[1]), rgba(DARK));
  const a = step(k, ...o.when);
  if (a > 0) pane(G, at, o.s, o.y, lit, a, o.panes ?? 1);
}

// A wall's skin going on over its framing: sheathing panel by panel as
// `sheath` runs 0-1, then stucco (in `color`) as `stucco` does, its openings
// (`opens`) dark until their windows go in. `shade` darkens a wall that faces
// a little away from the light.
function skin(G, at, len, [y0, y1], { sheath, stucco, shade = 0, color = C.stucco, opens = [], k, lit }) {
  if (sheath <= 0) return;
  const { ctx, P } = G;
  const panels = Math.ceil(len / 4);
  for (let i = 0; i < panels; i++) {
    const on = span(sheath, i / panels, (i + 0.8) / panels);
    if (on <= 0) continue;
    // (each panel overlaps the next a hair, so no seam shows between them)
    const s0 = i * 4, s1 = Math.min(len, s0 + 4.06);
    const done = ease(span(stucco, (i / panels) * 0.7, (i / panels) * 0.7 + 0.3));
    const osb = mix(settle(C.osb, sheath - (i + 0.8) / panels, 0.3), [0, 0, 0], shade);
    fillPoly(ctx, P, quad(at, s0, s1, y0, y1), rgba(mix(osb, shadeOf(color, -shade), done), ease(on)));
  }
  for (const o of opens) {
    const panel = Math.floor((o.s[0] + o.s[1]) / 2 / 4);
    if (span(sheath, panel / panels, (panel + 0.8) / panels) >= 1) opening(G, at, o, k, lit);
  }
}
