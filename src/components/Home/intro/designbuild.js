// The homepage's Design-Build card (Home/ServiceDrawing, vignettes.js): a
// modern two-storey home, designed and then built. First the design: the
// floor plan is drawn on the ground with its dimensions, and the dashed
// outline firms up into the design's solid wireframe. Then the build, inside
// that wireframe: the slab, the ground floor's framing, the floor over it,
// the upper storey's framing, sheathing, stucco and cedar, flat roofs, the
// glass and the green front door. Last the terrace, the lawn, the path and
// the planting, and the lights come on. `k` is how far it's got (0 = the bare
// ground, 1 = finished, lights on).
//
// In feet: the ground floor is 34 wide (x) by 24 deep (z); the white upper
// storey sits on it, out 5 ft over the terrace in front and 6 ft past its
// right wall, held at that corner by one steel column. y points up, the
// camera looks at the fronts (low z) and right sides (high x).

import { lerp, ease, span, mix, rgba, C, path, fillPoly, line, groundQuad, settle, shadeOf, groundGlow, convexHull, block, pane, frameRun, tree } from "./kit";
import { dimension } from "./adu";
import { ghost, box, shrub } from "./property";

// What has to fit on screen when the camera frames it.
export const DESIGN_BUILD_BOUNDS = { x: [-4, 46], y: [0, 20], z: [-12, 26] };

const step = (k, a, b) => ease(span(k, a, b));
// a quad on a wall (`at(s, y)` gives its points), s and y ranges
const quad = (at, s0, s1, y0, y1) => [at(s0, y0), at(s1, y0), at(s1, y1), at(s0, y1)];
function stroke(ctx, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

// ---- the house --------------------------------------------------------------
const S = 0.8; // the slab's top
const MID = 10.5; // the upper floor, and the ground floor's roof
const RIM = MID - 1; // the upper storey's underside: its floor's edge shows
const TOP = 20; // the upper storey's roof
const LOW = { x: [0, 34], z: [0, 24] };
const UP = { x: [12, 40], z: [-5, 17] };
const COLUMN = [39.35, -4.35];
const WOOD = [170, 118, 74]; // cedar
const WOOD_AT = [8, 20]; // where the ground floor's front is cedar
const MEMBRANE = [78, 82, 84]; // the flat roofs
const DARK = [12, 13, 13]; // an opening before its glass goes in

// The faces the camera sees, and the far ones it sees only while they're
// bare framing.
const lowFront = (s, y) => [s, y, 0];
const lowRight = (s, y) => [34, y, s];
const lowBack = (s, y) => [s, y, 24];
const lowLeft = (s, y) => [0, y, s];
const upFront = (s, y) => [12 + s, y, -5];
const upRight = (s, y) => [40, y, -5 + s];
const upBack = (s, y) => [12 + s, y, 17];
const upLeft = (s, y) => [12, y, -5 + s];

// The openings, with when each one's glass goes in (`when`, in the build):
// a tall window in the white end, the front door in the cedar, a glass wall
// onto the terrace and one round the side; a ribbon window along the upper
// storey and a wide one on its side.
const DOOR = { s: [12.6, 16], y: [S, S + 8] };
const OPEN = {
  lowFront: [
    { s: [2.6, 6], y: [S + 2.4, S + 7.8], when: [0.7, 0.73] },
    { s: [20.5, 33], y: [S, S + 8.4], panes: 4, when: [0.71, 0.76] },
  ],
  lowRight: [{ s: [4, 15], y: [S + 0.6, S + 8.4], panes: 3, when: [0.72, 0.76] }],
  upFront: [{ s: [3, 25], y: [MID + 1.8, MID + 7.2], panes: 5, when: [0.73, 0.78] }],
  upRight: [{ s: [7, 17], y: [MID + 1.8, MID + 7.2], panes: 2, when: [0.74, 0.78] }],
};

// The floor plan drawn on the ground: the ground floor's walls and rooms,
// and (dashed, as a plan shows what's overhead) the upper storey.
const PLAN = [
  [[0, 0], [34, 0]], [[34, 0], [34, 24]], [[34, 24], [0, 24]], [[0, 24], [0, 0]],
  [[8, 0], [8, 24]], [[0, 14], [8, 14]], [[20, 9], [20, 24]], [[20, 9], [34, 9]],
];
const PLAN_ABOVE = [[[12, -5], [40, -5]], [[40, -5], [40, 17]], [[40, 0], [34, 0]]];
// The design's wireframe: the two boxes.
const MODEL = [...box(LOW.x, [S, MID], LOW.z), ...box(UP.x, [RIM, TOP], UP.z)];

// The yard: the terrace under the upper storey, the path's stepping stones
// from the front door, the shrubs and the tree behind.
const TERRACE = [18, -7.5, 41.5, 0];
const STONES = Array.from({ length: 6 }, (_, i) => [12.8, -1.7 - i * 1.75, 15.8, -0.6 - i * 1.75]);
const SHRUBS = [[1.6, -1.2], [5.6, -1.3], [42.6, 3], [42.6, 10], [42.6, 17], [-1.4, 6]];

// When each piece of work happens, as fractions of the build.
const W = {
  plan: [0, 0.1],
  dims: [0.05, 0.12],
  model: [0.03, 0.16],
  modelGone: [0.5, 0.66],
  slab: [0.15, 0.23],
  lowFrame: { back: [0.22, 0.29], left: [0.23, 0.3], front: [0.26, 0.35], right: [0.28, 0.36] },
  floor: [0.36, 0.42],
  column: [0.38, 0.42],
  upFrame: { back: [0.42, 0.48], left: [0.43, 0.49], front: [0.45, 0.53], right: [0.46, 0.54] },
  roofDeck: [0.53, 0.57],
  sheath: { lowFront: [0.52, 0.58], lowRight: [0.53, 0.59], upFront: [0.56, 0.62], upRight: [0.57, 0.63] },
  roofs: [0.6, 0.65],
  stucco: { low: [0.62, 0.7], up: [0.64, 0.72] },
  cedar: [0.63, 0.69],
  solar: [0.72, 0.8],
  door: [0.76, 0.8],
  shadow: [0.56, 0.7],
  terrace: [0.77, 0.83],
  lawn: [0.8, 0.88],
  stones: [0.84, 0.9],
  plants: [0.86, 0.95],
  lights: [0.93, 1],
};

export function drawDesignBuild(G, k, { gt }) {
  const { ctx } = G;
  const lit = step(k, ...W.lights);
  tree(G, -2.5, 25, 1.1);
  plan(G, k, gt);
  lawn(G, k);
  terrace(G, k);
  stones(G, k);
  spill(G, lit);
  shadow(G, k);
  slab(G, k);

  // the ground floor
  ctx.save();
  ctx.globalAlpha = 0.5;
  frameRun(G, lowBack, 34, [], span(k, ...W.lowFrame.back), S, MID);
  frameRun(G, lowLeft, 24, [], span(k, ...W.lowFrame.left), S, MID);
  ctx.restore();
  frameRun(G, lowFront, 34, [...OPEN.lowFront, DOOR], span(k, ...W.lowFrame.front), S, MID);
  frameRun(G, lowRight, 24, OPEN.lowRight, span(k, ...W.lowFrame.right), S, MID);
  skin(G, lowFront, 34, [S, MID], { sheath: span(k, ...W.sheath.lowFront), stucco: span(k, ...W.stucco.low), shade: 0.1, opens: OPEN.lowFront, cedar: span(k, ...W.cedar), k, lit });
  door(G, k);
  skin(G, lowRight, 24, [S, MID], { sheath: span(k, ...W.sheath.lowRight), stucco: span(k, ...W.stucco.low), opens: OPEN.lowRight, k, lit });
  underside(G, k);
  floor(G, k);

  // the upper storey
  block(G, [COLUMN[0] - 0.22, COLUMN[0] + 0.22], [0, RIM], [COLUMN[1] - 0.22, COLUMN[1] + 0.22], [52, 55, 58], 1, step(k, ...W.column));
  ctx.save();
  ctx.globalAlpha = 0.5;
  frameRun(G, upBack, 28, [], span(k, ...W.upFrame.back), MID, TOP);
  frameRun(G, upLeft, 22, [], span(k, ...W.upFrame.left), MID, TOP);
  ctx.restore();
  frameRun(G, upFront, 28, OPEN.upFront, span(k, ...W.upFrame.front), MID, TOP);
  frameRun(G, upRight, 22, OPEN.upRight, span(k, ...W.upFrame.right), MID, TOP);
  roof(G, UP, TOP, k, span(k, ...W.roofDeck));
  solar(G, k);
  skin(G, upFront, 28, [RIM, TOP], { sheath: span(k, ...W.sheath.upFront), stucco: span(k, ...W.stucco.up), shade: 0.1, opens: OPEN.upFront, k, lit });
  skin(G, upRight, 22, [RIM, TOP], { sheath: span(k, ...W.sheath.upRight), stucco: span(k, ...W.stucco.up), opens: OPEN.upRight, k, lit });

  SHRUBS.forEach(([x, z], i) => shrub(G, x, z, step(k, W.plants[0] + i * 0.012, W.plants[0] + 0.05 + i * 0.012)));
  model(G, k);
  glow(G, lit);
}

// ---- the design --------------------------------------------------------------

// The plan on the bare ground, drawn line by line in the drafting green,
// then the dimensions; the slab is poured over the rooms, the lawn over the
// rest.
function plan(G, k, gt) {
  const { ctx, P, s } = G;
  const drawn = span(k, ...W.plan);
  if (drawn <= 0 || k > W.lawn[1]) return;
  ctx.lineWidth = Math.max(1, s * 0.12);
  ctx.strokeStyle = rgba(C.greenHi, 0.85);
  PLAN.forEach(([a, b], i) => {
    const kk = span(drawn, (i / PLAN.length) * 0.7, (i / PLAN.length) * 0.7 + 0.3);
    if (kk <= 0) return;
    ctx.beginPath();
    line(ctx, P, [a[0], 0.02, a[1]], [b[0], 0.02, b[1]], ease(kk));
    ctx.stroke();
  });
  const above = span(drawn, 0.6, 1);
  if (above > 0) {
    ctx.save();
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    for (const [a, b] of PLAN_ABOVE) line(ctx, P, [a[0], 0.02, a[1]], [b[0], 0.02, b[1]], ease(above));
    stroke(ctx, rgba(C.greenHi, 0.7), 1);
    ctx.restore();
  }
  const dims = span(k, ...W.dims);
  if (dims > 0) {
    dimension(ctx, P, [0, 0, -10], [40, 0, -10], `40'-0"`, dims, s, gt);
    dimension(ctx, P, [44, 0, -5], [44, 0, 24], `29'-0"`, dims, s, gt);
  }
}

// The design's wireframe, firming up over the dashed outline in solid
// lines, then fading as the walls close in.
function model(G, k) {
  const { ctx, P } = G;
  const drawn = span(k, ...W.model);
  const a = 1 - step(k, ...W.modelGone);
  if (drawn <= 0 || a <= 0) return;
  ctx.beginPath();
  MODEL.forEach(([p, q], i) => {
    const kk = span(drawn, (i / MODEL.length) * 0.6, (i / MODEL.length) * 0.6 + 0.4);
    if (kk > 0) line(ctx, P, p, q, ease(kk));
  });
  stroke(ctx, rgba(C.greenHi, 0.8 * a), 1);
}

// The outline before the work starts: the two boxes, dashed.
export function ghostDesignBuild(G, a) {
  ghost(G, MODEL, a);
}

// ---- the build ---------------------------------------------------------------

// The slab, poured from the back to the front, wet and dark at first.
function slab(G, k) {
  const pour = span(k, ...W.slab);
  if (pour <= 0) return;
  const { ctx, P } = G;
  const concrete = mix(C.wet, C.concrete, span(k, W.slab[1], W.slab[1] + 0.1));
  const [x0, x1] = LOW.x, [z0, z1] = LOW.z;
  const zCut = lerp(z1, z0, ease(pour));
  fillPoly(ctx, P, [[x1, 0, zCut], [x1, 0, z1], [x1, S, z1], [x1, S, zCut]], rgba(mix(concrete, [0, 0, 0], 0.32)));
  if (pour >= 1) fillPoly(ctx, P, quad(lowFront, x0, x1, 0, S), rgba(mix(concrete, [0, 0, 0], 0.18)));
  fillPoly(ctx, P, groundQuad([x0, zCut, x1, z1], S), rgba(concrete));
}

// A face's skin over its framing: sheathing panel by panel, then stucco
// (cedar boards instead along WOOD_AT on the ground floor's front), its
// openings dark until their glass goes in.
function skin(G, at, len, [y0, y1], { sheath, stucco, cedar = 0, shade = 0, opens, k, lit }) {
  if (sheath <= 0) return;
  const { ctx, P } = G;
  const panels = Math.ceil(len / 4);
  const cedarFace = at === lowFront;
  for (let i = 0; i < panels; i++) {
    const on = span(sheath, i / panels, (i + 0.8) / panels);
    if (on <= 0) continue;
    // (each panel overlaps the next a hair, so no seam shows between them)
    const s0 = i * 4, s1 = Math.min(len, s0 + 4.06);
    const wood = cedarFace && s0 >= WOOD_AT[0] && s0 < WOOD_AT[1];
    const done = wood ? 0 : step(stucco, (i / panels) * 0.7, (i / panels) * 0.7 + 0.3);
    const osb = mix(settle(C.osb, sheath - (i + 0.8) / panels, 0.3), [0, 0, 0], shade);
    fillPoly(ctx, P, quad(at, s0, s1, y0, y1), rgba(mix(osb, shadeOf(C.stucco, -shade), done), ease(on)));
  }
  if (cedarFace && cedar > 0) {
    // the boards, put up from the left
    const [w0, w1] = WOOD_AT;
    const reach = lerp(w0, w1, ease(cedar));
    fillPoly(ctx, P, quad(at, w0, reach, y0, y1), rgba(shadeOf(WOOD, -shade)));
    ctx.beginPath();
    for (let x = w0 + 0.5; x < reach; x += 0.5) line(ctx, P, at(x, y0), at(x, y1));
    stroke(ctx, rgba([0, 0, 0], 0.16), 1);
  }
  for (const o of opens) {
    const panel = Math.floor((o.s[0] + o.s[1]) / 2 / 4);
    if (span(sheath, panel / panels, (panel + 0.8) / panels) < 1) continue;
    fillPoly(ctx, P, quad(at, o.s[0], o.s[1], o.y[0], o.y[1]), rgba(DARK));
    pane(G, at, o.s, o.y, lit, step(k, ...o.when), o.panes ?? 1);
  }
  // once it's stucco, a soft shade where the wall meets the ground
  const finished = ease(stucco);
  if (finished > 0 && y0 < 1) {
    path(ctx, P, quad(at, 0, len, y0, y1));
    const [gx0, gy0] = P(...at(len / 2, y0));
    const [gx1, gy1] = P(...at(len / 2, y0 + (y1 - y0) * 0.5));
    const g = ctx.createLinearGradient(gx0, gy0, gx1, gy1);
    g.addColorStop(0, `rgba(0,0,0,${0.22 * finished})`);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fill();
  }
}

// The front door, in the cedar: dark until it's hung, then HB Links green.
function door(G, k) {
  const { ctx, P, s } = G;
  if (span(k, ...W.sheath.lowFront) < 1) return;
  const hung = step(k, ...W.door);
  const [s0, s1] = DOOR.s, [y0, y1] = DOOR.y;
  fillPoly(ctx, P, quad(lowFront, s0 - 0.15, s1 + 0.15, y0, y1 + 0.15), rgba(mix(DARK, C.trim, hung)));
  if (hung <= 0) return;
  fillPoly(ctx, P, quad(lowFront, s0, s1, y0, y1), rgba(mix(DARK, C.green, hung)));
  // a tall pull
  ctx.beginPath();
  line(ctx, P, lowFront(s1 - 0.55, y0 + 2.6), lowFront(s1 - 0.55, y0 + 5.4));
  stroke(ctx, rgba([210, 196, 160], hung), Math.max(1, s * 0.14));
}

// The shade under the upper storey, on the ground floor's walls, once
// they're finished.
function underside(G, k) {
  const { ctx, P } = G;
  const a = step(k, ...W.stucco.low);
  if (a <= 0) return;
  for (const [at, s0, s1] of [[lowFront, UP.x[0], LOW.x[1]], [lowRight, 0, UP.z[1]]]) {
    path(ctx, P, quad(at, s0, s1, MID - 4, MID));
    const [gx0, gy0] = P(...at(s0, MID));
    const [gx1, gy1] = P(...at(s0, MID - 4));
    const g = ctx.createLinearGradient(gx0, gy0, gx1, gy1);
    g.addColorStop(0, `rgba(0,0,0,${0.3 * a})`);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fill();
  }
}

// The floor over the ground floor, laid from the back to the front and out
// over the terrace (its edge showing where it overhangs), and later the
// ground floor's flat roof on it.
function floor(G, k) {
  const laid = span(k, ...W.floor);
  if (laid <= 0) return;
  const { ctx, P } = G;
  const zCut = lerp(LOW.z[1], UP.z[0], ease(laid));
  const osb = settle(C.osb, k - W.floor[1], 0.3);
  fillPoly(ctx, P, groundQuad([LOW.x[0], Math.max(zCut, LOW.z[0]), LOW.x[1], LOW.z[1]], MID), rgba(osb));
  if (zCut < UP.z[1]) fillPoly(ctx, P, groundQuad([UP.x[0], zCut, UP.x[1], UP.z[1]], MID), rgba(osb));
  // the edge where it overhangs: dark rim boards until the stucco covers them
  if (zCut < UP.z[1]) {
    fillPoly(ctx, P, [[UP.x[1], RIM, zCut], [UP.x[1], RIM, UP.z[1]], [UP.x[1], MID, UP.z[1]], [UP.x[1], MID, zCut]], rgba(C.wood));
  }
  if (laid >= 1) fillPoly(ctx, P, quad(upFront, 0, 28, RIM, MID), rgba(shadeOf(C.wood, -0.1)));
  roof(G, LOW, MID, k, 1);
}

// A flat roof on a box: its deck (OSB, laid from the left as `deck` runs),
// then the membrane inside a white parapet once the roofs go on.
function roof(G, { x: [x0, x1], z: [z0, z1] }, y, k, deck) {
  if (deck <= 0) return;
  const { ctx, P, lw } = G;
  const done = step(k, ...W.roofs);
  if (y === TOP) {
    const reach = lerp(x0, x1, ease(deck));
    fillPoly(ctx, P, groundQuad([x0, z0, reach, z1], y), rgba(settle(C.osb, k - W.roofDeck[1], 0.3)));
  }
  if (done <= 0) return;
  const finish = step(k, ...(y === TOP ? W.stucco.up : W.stucco.low));
  fillPoly(ctx, P, groundQuad([x0, z0, x1, z1], y + 0.01), rgba(mix(C.osb, shadeOf(C.stucco, 0.05), finish), done));
  fillPoly(ctx, P, groundQuad([x0 + 0.7, z0 + 0.7, x1 - 0.7, z1 - 0.7], y + 0.02), rgba(MEMBRANE, done));
  // the parapet's crisp edge
  ctx.beginPath();
  line(ctx, P, [x0, y, z0], [x1, y, z0]);
  line(ctx, P, [x1, y, z0], [x1, y, z1]);
  stroke(ctx, rgba(shadeOf(C.stucco, 0.2), 0.7 * finish * done), lw(0.12));
}

// The solar array on the upper roof (a new California home has one): two
// rows of panels tilted to the front, set in from the left.
const PANEL = { w: 3.3, gap: 0.3, cols: 6, x0: 16, rows: [[0.5, 6], [7.4, 12.9]], rise: 0.9 };
function solar(G, k) {
  const on = span(k, ...W.solar);
  if (on <= 0) return;
  const { ctx, P } = G;
  const n = PANEL.rows.length * PANEL.cols;
  PANEL.rows.forEach(([z0, z1], r) => {
    for (let c = 0; c < PANEL.cols; c++) {
      const i = r * PANEL.cols + c;
      const a = step(on, (i / n) * 0.7, (i / n) * 0.7 + 0.3);
      if (a <= 0) continue;
      const x0 = PANEL.x0 + c * (PANEL.w + PANEL.gap), x1 = x0 + PANEL.w;
      const y0 = TOP + 0.3, y1 = y0 + PANEL.rise;
      const pts = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z1], [x0, y1, z1]];
      path(ctx, P, pts);
      const [gx0, gy0] = P(...pts[0]);
      const [gx1, gy1] = P(...pts[2]);
      const g = ctx.createLinearGradient(gx0, gy0, gx1, gy1);
      g.addColorStop(0, rgba([30, 44, 64], a));
      g.addColorStop(1, rgba([58, 78, 100], a));
      ctx.fillStyle = g;
      ctx.fill();
      ctx.strokeStyle = rgba([170, 180, 188], 0.55 * a);
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  });
}

// ---- the yard ------------------------------------------------------------------

function lawn(G, k) {
  const g = step(k, ...W.lawn);
  if (g <= 0) return;
  const { ctx, P } = G;
  fillPoly(ctx, P, groundQuad([-4, -12, 46, 26], 0.01), rgba(C.lawn, g));
  for (let z = -10; z < 26; z += 4) fillPoly(ctx, P, groundQuad([-4, z, 46, Math.min(26, z + 2)], 0.012), rgba(C.lawnDark, 0.55 * g));
}

// The terrace under the upper storey: big pale stone slabs.
function terrace(G, k) {
  const g = step(k, ...W.terrace);
  if (g <= 0) return;
  const { ctx, P } = G;
  const [x0, z0, x1, z1] = TERRACE;
  fillPoly(ctx, P, groundQuad(TERRACE, 0.04), rgba(mix(C.path, C.concrete, 0.25), g));
  ctx.beginPath();
  for (let x = x0 + 2.9; x < x1; x += 2.9) line(ctx, P, [x, 0.05, z0], [x, 0.05, z1]);
  for (let z = z0 + 2.5; z < z1; z += 2.5) line(ctx, P, [x0, 0.05, z], [x1, 0.05, z]);
  stroke(ctx, rgba([0, 0, 0], 0.14 * g), 1);
}

function stones(G, k) {
  const p = span(k, ...W.stones);
  if (p <= 0) return;
  STONES.forEach((r, i) => {
    const g = step(p, i * 0.2, i * 0.2 + 0.4);
    if (g > 0) fillPoly(G.ctx, G.P, groundQuad(r, 0.05), rgba(C.path, g));
  });
}

// The house's soft shadow, falling to the left, as it closes in.
function shadow(G, k) {
  const a = step(k, ...W.shadow);
  if (a <= 0) return;
  const { ctx, P, s } = G;
  const cast = (x, y, z) => P(x - 0.55 * y, 0.02, z - 0.3 * y);
  const hull = (xs, ys, zs) => {
    const pts = [];
    for (const x of xs) for (const y of ys) for (const z of zs) pts.push(cast(x, y, z).slice(0, 2));
    return convexHull(pts);
  };
  ctx.save();
  ctx.filter = `blur(${Math.max(2, s * 0.45)}px)`;
  ctx.beginPath();
  for (const h of [hull(LOW.x, [0, MID], LOW.z), hull(UP.x, [RIM, TOP], UP.z)]) {
    h.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.closePath();
  }
  ctx.fillStyle = `rgba(0,0,0,${0.36 * a})`;
  ctx.fill("nonzero");
  ctx.restore();
}

// ---- the lights ----------------------------------------------------------------

// Where each window glows, and where its light falls on the ground.
const LIGHTS = [
  ...OPEN.lowFront.map((o) => [lowFront, o, [0, -3]]),
  ...OPEN.lowRight.map((o) => [lowRight, o, [3, 0]]),
  ...OPEN.upFront.map((o) => [upFront, o, null]),
  ...OPEN.upRight.map((o) => [upRight, o, null]),
];

// Light from the glass on the terrace and the lawn, and the downlights
// under the upper storey's overhang.
function spill(G, lit) {
  if (lit <= 0) return;
  const { ctx, P } = G;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const [at, o, out] of LIGHTS) {
    if (!out) continue;
    const [x, , z] = at((o.s[0] + o.s[1]) / 2, 0);
    groundGlow(ctx, P, x + out[0], z + out[1], (o.s[1] - o.s[0]) * 0.6 + 3, rgba(C.warm, 0.2 * lit));
  }
  for (const x of [16, 23, 30, 37]) groundGlow(ctx, P, x, -2.6, 3.2, rgba(C.warm, 0.26 * lit));
  ctx.restore();
}

function glow(G, lit) {
  if (lit <= 0) return;
  const { ctx, P, s } = G;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const [at, o] of LIGHTS) {
    const [x, y, z] = at((o.s[0] + o.s[1]) / 2, (o.y[0] + o.y[1]) / 2);
    const r = ((o.s[1] - o.s[0]) * 0.55 + 1.5) * s;
    const [cx, cy] = P(x, y, z);
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, rgba(C.warm, 0.2 * lit));
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
