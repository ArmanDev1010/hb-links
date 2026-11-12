// The homepage hero's ADU lot (see scene.js): a backyard ADU built from an
// empty lot — the HB Links logo chalked across the ground, stakes and string
// lines, the slab poured over the logo, studs, rafters, sheathing, shingles,
// windows, stucco, a green front door, the yard — with the HB Links yard sign
// out front. `b` is how far the build has got (0 = empty lot, 1 = finished,
// lights on).
//
// In feet: the ADU is 30 wide (x) by 20 deep (z), y points up, the camera
// looks at its front (z = 0) and right side (x = 30).

import { lerp, ease, span, mix, rgba, C, path, fillPoly, line, groundQuad, settle, groundGlow, convexHull } from "./kit";

// What has to fit on screen when the camera frames this lot.
export const ADU_BOUNDS = { x: [-3, 39], y: [0, 15.4], z: [-11, 22] };

// Draws the lot at build progress `b`; `G` is { ctx, P, s, lw }.
export function drawADU({ ctx, P, s, lw }, b, { logo, gt }) {
  const lit = ease(span(b, ...W.lights));
  yard(ctx, P, b, s);
  chalk(ctx, P, b, s);
  shadow(ctx, P, b, s);
  spill(ctx, P, lit);
  layoutLines(ctx, P, b, s, gt);
  foundation(ctx, P, b, s);
  // framing: the far walls first, dimmer
  for (const wall of WALLS) {
    const far = wall.id === "back" || wall.id === "left";
    for (const m of FRAMING[wall.id]) {
      const k = span(b, m.at, m.at + m.dur);
      if (k <= 0) continue;
      ctx.beginPath();
      line(ctx, P, wall.at(...m.a), wall.at(...m.b), ease(k));
      ctx.strokeStyle = rgba(settle(C.wood, b - m.at - m.dur), far ? 0.5 : 0.95);
      ctx.lineWidth = lw(m.heavy ? 0.3 : 0.15);
      ctx.stroke();
    }
  }
  roofFrame(ctx, P, b, lw);
  walls(ctx, P, b, s, lit);
  roof(ctx, P, b, lw);
  porch(ctx, P, b, s, lw, lit);
  shrubs(ctx, P, b, s);
  sign(ctx, P, b, s, logo, gt);
  glow(ctx, P, s, lit);
}

// When each piece of work happens, as fractions of the build.
const W = {
  sign: [0.015, 0.09],
  chalk: [0.01, 0.07],
  chalkFill: [0.05, 0.1],
  stakes: [0.06, 0.12],
  forms: [0.12, 0.17],
  slab: [0.16, 0.25],
  porchSlab: [0.22, 0.26],
  walls: { back: [0.27, 0.32], left: [0.31, 0.36], right: [0.35, 0.41], front: [0.4, 0.47] },
  ridge: [0.5, 0.53],
  rafters: [0.52, 0.6],
  gables: [0.56, 0.6],
  porchFrame: [0.58, 0.63],
  sheathRight: [0.62, 0.66],
  sheathFront: [0.65, 0.7],
  deck: [0.66, 0.7],
  shingles: [0.7, 0.76],
  windows: [0.71, 0.77],
  stucco: [0.75, 0.83],
  trim: [0.78, 0.82],
  door: [0.8, 0.84],
  bed: [0.84, 0.87],
  lawn: [0.86, 0.92],
  pavers: [0.88, 0.93],
  shrubs: [0.9, 0.95],
  grid: [0.84, 0.95],
  shadow: [0.62, 0.74],
  lights: [0.93, 1],
};

// ---- the house -------------------------------------------------------------
const L = 30; // width (x)
const D = 20; // depth (z)
const SLAB = 0.6; // the slab's top
const WALL = 9; // the walls' top plate
const OVER = 1.2; // the roof's overhang
const PITCH = 0.6; // 6 in 10
const RIDGE = WALL + PITCH * (D / 2); // 15
const EAVE = WALL - PITCH * OVER; // where the roof's edge is, 8.28
// the roof's height over depth `z` (on its front or back plane)
const roofY = (z) => WALL + PITCH * (D / 2 - Math.abs(z - D / 2));

// The four walls, each laid out along its own length `s`, with its openings.
// Only the front and right walls face the camera; the other two are seen
// only while they're bare framing.
const WALLS = [
  {
    id: "back",
    len: L,
    at: (s, y) => [s, y, D],
    open: [
      { s: [6, 10], y: [3, 7] },
      { s: [19, 23], y: [3.6, 6.6] },
    ],
  },
  { id: "left", len: D, at: (s, y) => [0, y, s], open: [{ s: [8, 12], y: [3, 7] }] },
  {
    id: "right",
    len: D,
    at: (s, y) => [L, y, s],
    open: [
      { s: [5, 10], y: [3, 7] },
      { s: [13.5, 16.5], y: [3.6, 6.6] },
    ],
  },
  {
    id: "front",
    len: L,
    at: (s, y) => [s, y, 0],
    open: [
      { s: [3, 8], y: [3, 7] },
      { s: [11, 17], y: [SLAB, 7], door: "slider" },
      { s: [21.5, 24.5], y: [SLAB, 7], door: "front" },
    ],
  },
];

// Each wall's framing — plates, studs 16" apart, king studs, headers and
// sills — with when each piece goes up (`at`, `dur`, in the build).
function frameWall(wall) {
  const [w0, w1] = W.walls[wall.id];
  const at = (f) => w0 + f * (w1 - w0);
  const along = (s) => at(0.1 + 0.7 * (s / wall.len));
  const members = [{ a: [0, SLAB], b: [wall.len, SLAB], at: at(0), dur: 0.25 * (w1 - w0) }];
  const inOpening = (s) => wall.open.find((o) => s > o.s[0] - 0.2 && s < o.s[1] + 0.2);
  for (let i = 0; i * (4 / 3) <= wall.len + 0.01; i++) {
    const s = Math.min(i * (4 / 3), wall.len);
    const o = inOpening(s);
    if (!o) members.push({ a: [s, SLAB], b: [s, WALL - 0.3], at: along(s), dur: 0.012 });
    else {
      if (o.y[0] > SLAB + 0.3) members.push({ a: [s, SLAB], b: [s, o.y[0]], at: along(s), dur: 0.01 });
      members.push({ a: [s, o.y[1] + 0.6], b: [s, WALL - 0.3], at: along(s), dur: 0.01 });
    }
  }
  for (const o of wall.open) {
    for (const s of [o.s[0] - 0.15, o.s[1] + 0.15])
      members.push({ a: [s, SLAB], b: [s, WALL - 0.3], at: along(s), dur: 0.012 });
    members.push({ a: [o.s[0] - 0.15, o.y[1] + 0.3], b: [o.s[1] + 0.15, o.y[1] + 0.3], at: along(o.s[1]) + 0.004, dur: 0.01, heavy: true });
    if (!o.door) members.push({ a: [o.s[0], o.y[0]], b: [o.s[1], o.y[0]], at: along(o.s[1]) + 0.004, dur: 0.01 });
  }
  for (const y of [WALL - 0.3, WALL]) members.push({ a: [0, y], b: [wall.len, y], at: at(0.85), dur: 0.15 * (w1 - w0) });
  return members;
}
const FRAMING = Object.fromEntries(WALLS.map((wall) => [wall.id, frameWall(wall)]));

// The porch over the front door: a slab, two posts, a beam and a shed roof
// tucked under the main roof's edge.
const PORCH = { x0: 19.5, x1: 26.5, z0: -6, slab: 0.4, posts: [20.1, 25.9], postZ: -5.4, beam: 7.45 };
const PORCH_ROOF = [
  [19.2, 7.75, -6.4],
  [26.8, 7.75, -6.4],
  [26.8, 8.15, -OVER],
  [19.2, 8.15, -OVER],
];

// The yard: the lawn's pieces (around the porch and the path), the path's
// pavers, and the shrubs in the beds along the walls.
const LAWN = [
  [-3, -11, 19.3, -1.7],
  [19.3, -11, 21.3, -6.2],
  [24.7, -11, 26.7, -6.2],
  [26.7, -11, 39, -1.7],
  [31.6, -1.7, 39, 22],
];
const PAVERS = Array.from({ length: 4 }, (_, i) => [21.5, -10.6 + i * 1.15, 24.5, -10.6 + i * 1.15 + 0.85]);
const SHRUBS = [
  [1.6, -0.9],
  [9.4, -0.9],
  [18.3, -0.9],
  [30.8, 2.2],
  [30.8, 12.4],
  [30.8, 18.6],
];
const SIGN = { x0: 31.6, x1: 37.8, z: -8.6, y0: 1.9, y1: 5.3 };

// The HB Links mark (in the pixels of the first horizontal logo; the mark is
// unchanged in the 11-12 logos, public/Logos/PNG|SVG): the
// white piece rising to a point, the green one falling to a point, locked
// together. Chalked across the lot at the start.
const MARK = {
  w: 2460,
  h: 1272,
  x0: 18,
  white: [[1353, 0], [1353, 325], [856, 681], [1131, 681], [1131, 950], [18, 950]],
  green: [[1354, 318], [2478, 318], [1135, 1272], [1135, 940], [1631, 588], [1354, 588]],
};
const markOnGround = ([mx, my]) => [15 + ((mx - MARK.x0) / MARK.w - 0.5) * 24, 0.02, 10 - (my / MARK.h - 0.5) * 12.4];

// a quad on a wall (s and y ranges), in world points
const wallQuad = (wall, s0, s1, y0, y1) => [wall.at(s0, y0), wall.at(s1, y0), wall.at(s1, y1), wall.at(s0, y1)];

// Warm light from the windows falling on the lawn once the lights are on.
function spill(ctx, P, lit) {
  if (lit <= 0) return;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const wall of WALLS) {
    if (wall.id !== "front" && wall.id !== "right") continue;
    for (const o of wall.open) {
      if (o.door === "front") continue;
      const mid = (o.s[0] + o.s[1]) / 2;
      const [x, , z] = wall.at(mid, 0);
      const out = wall.id === "front" ? [0, -3] : [3, 0];
      groundGlow(ctx, P, x + out[0], z + out[1], (o.s[1] - o.s[0]) * 0.9 + 2.5, rgba(C.warm, 0.2 * lit));
    }
  }
  groundGlow(ctx, P, 23, -3.5, 6, rgba(C.warm, 0.24 * lit));
  ctx.restore();
}

// The HB Links mark, chalked across the lot before anything else: outlined,
// then filled in, white and green; the slab is poured over it.
function chalk(ctx, P, b, s) {
  const draw = span(b, ...W.chalk);
  if (draw <= 0 || b > W.slab[1]) return;
  const fill = span(b, ...W.chalkFill);
  for (const [piece, color] of [[MARK.white, C.white], [MARK.green, C.greenHi]]) {
    const pts = piece.map(markOnGround);
    path(ctx, P, pts);
    if (fill > 0) {
      ctx.fillStyle = rgba(color === C.white ? C.white : C.green, 0.85 * fill);
      ctx.fill();
    }
    // the outline drawn on, chalk-line style
    let length = 0;
    const sp = pts.map((p) => P(p[0], p[1], p[2]));
    sp.forEach((p, i) => (length += Math.hypot(p[0] - sp[(i + 1) % sp.length][0], p[1] - sp[(i + 1) % sp.length][1])));
    ctx.setLineDash([length * ease(draw), length]);
    ctx.strokeStyle = rgba(color, 0.95);
    ctx.lineWidth = Math.max(1, s * 0.12);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

// Stakes at the corners, string lines between them and the footprint's
// dimensions; gone once the walls are up.
function layoutLines(ctx, P, b, s, gt) {
  const k = span(b, ...W.stakes);
  const gone = span(b, 0.26, 0.31);
  if (k <= 0 || gone >= 1) return;
  const a = 1 - gone;
  const corners = [[0, 0], [L, 0], [L, D], [0, D]];
  corners.forEach(([x, z], i) => {
    const kk = span(k, i * 0.12, i * 0.12 + 0.2);
    if (kk <= 0) return;
    ctx.beginPath();
    line(ctx, P, [x, 0, z], [x, 1.3, z], ease(kk));
    ctx.strokeStyle = rgba(C.wood, a);
    ctx.lineWidth = Math.max(1.5, s * 0.18);
    ctx.stroke();
  });
  const strings = span(k, 0.45, 1);
  if (strings > 0) {
    ctx.beginPath();
    corners.forEach(([x, z], i) => {
      const [nx, nz] = corners[(i + 1) % 4];
      line(ctx, P, [x, 0.9, z], [nx, 0.9, nz], ease(strings));
    });
    ctx.strokeStyle = rgba(C.greenHi, 0.9 * a);
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  const dims = span(k, 0.6, 1) * (1 - span(b, 0.17, 0.22));
  if (dims > 0) {
    dimension(ctx, P, [0, 0, -3], [L, 0, -3], `${L}'-0"`, dims, s, gt);
    dimension(ctx, P, [L + 3, 0, 0], [L + 3, 0, D], `${D}'-0"`, dims, s, gt);
  }
}

// An architect's dimension line on the ground: ticks at both ends and the
// length along it.
function dimension(ctx, P, a, b, label, alpha, s, gt) {
  const [x1, y1] = P(a[0], a[1], a[2]);
  const [x2, y2] = P(b[0], b[1], b[2]);
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const tick = Math.max(4, s * 0.5);
  ctx.strokeStyle = rgba(C.white, 0.7 * alpha);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  for (const [x, y] of [[x1, y1], [x2, y2]]) {
    ctx.moveTo(x - tick * Math.cos(angle - Math.PI / 4), y - tick * Math.sin(angle - Math.PI / 4));
    ctx.lineTo(x + tick * Math.cos(angle - Math.PI / 4), y + tick * Math.sin(angle - Math.PI / 4));
  }
  ctx.stroke();
  ctx.save();
  ctx.translate((x1 + x2) / 2, (y1 + y2) / 2);
  ctx.rotate(Math.abs(angle) > Math.PI / 2 ? angle + Math.PI : angle);
  ctx.font = `500 ${Math.round(Math.max(10, s * 0.65))}px ${gt}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.fillStyle = rgba(C.white, 0.85 * alpha);
  ctx.fillText(label, 0, -4);
  ctx.restore();
}

// The forms go round the slab's edge, then the concrete is poured from the
// back to the front, wet and dark at first.
function foundation(ctx, P, b, s) {
  const forms = span(b, ...W.forms);
  const pull = span(b, 0.28, 0.32);
  if (forms > 0 && pull < 1) {
    const a = ease(forms) * (1 - pull);
    ctx.beginPath();
    const edges = [[[0, 0], [L, 0]], [[L, 0], [L, D]], [[L, D], [0, D]], [[0, D], [0, 0]]];
    for (const [[x0, z0], [x1, z1]] of edges)
      for (const y of [0, SLAB + 0.15]) line(ctx, P, [x0, y, z0], [x1, y, z1], ease(forms));
    ctx.strokeStyle = rgba(C.wood, 0.9 * a);
    ctx.lineWidth = Math.max(1, s * 0.12);
    ctx.stroke();
  }
  const pour = span(b, ...W.slab);
  if (pour > 0) {
    const cure = span(b, W.slab[1], W.slab[1] + 0.1);
    const concrete = mix(C.wet, C.concrete, cure);
    const zCut = lerp(D, 0, ease(pour));
    fillPoly(ctx, P, [[L, 0, zCut], [L, 0, D], [L, SLAB, D], [L, SLAB, zCut]], rgba(mix(concrete, [0, 0, 0], 0.32)));
    if (pour >= 1) fillPoly(ctx, P, [[0, 0, 0], [L, 0, 0], [L, SLAB, 0], [0, SLAB, 0]], rgba(mix(concrete, [0, 0, 0], 0.18)));
    fillPoly(ctx, P, [[0, SLAB, zCut], [L, SLAB, zCut], [L, SLAB, D], [0, SLAB, D]], rgba(concrete));
  }
  const porch = span(b, ...W.porchSlab);
  if (porch > 0) {
    const concrete = mix(C.wet, C.concrete, span(b, W.porchSlab[1], W.porchSlab[1] + 0.1));
    const zCut = lerp(0, PORCH.z0, ease(porch));
    const { x0, x1, slab } = PORCH;
    fillPoly(ctx, P, [[x1, 0, zCut], [x1, 0, 0], [x1, slab, 0], [x1, slab, zCut]], rgba(mix(concrete, [0, 0, 0], 0.32)));
    if (porch >= 1) fillPoly(ctx, P, [[x0, 0, PORCH.z0], [x1, 0, PORCH.z0], [x1, slab, PORCH.z0], [x0, slab, PORCH.z0]], rgba(mix(concrete, [0, 0, 0], 0.18)));
    fillPoly(ctx, P, [[x0, slab, zCut], [x1, slab, zCut], [x1, slab, 0], [x0, slab, 0]], rgba(concrete));
  }
}

// The roof's bones: the ridge board, rafters 2 ft apart (the back ones
// dimmer) and the gable ends' studs.
function roofFrame(ctx, P, b, lw) {
  const ridge = span(b, ...W.ridge);
  if (ridge <= 0) return;
  ctx.beginPath();
  line(ctx, P, [-OVER, RIDGE, D / 2], [L + OVER, RIDGE, D / 2], ease(ridge));
  ctx.strokeStyle = rgba(settle(C.wood, b - W.ridge[1]), 0.95);
  ctx.lineWidth = lw(0.25);
  ctx.stroke();
  const n = 17;
  for (let i = 0; i < n; i++) {
    const x = -OVER + (i * (L + 2 * OVER)) / (n - 1);
    const at = lerp(W.rafters[0], W.rafters[1] - 0.015, i / (n - 1));
    const k = span(b, at, at + 0.015);
    if (k <= 0) continue;
    const color = settle(C.wood, b - at - 0.015);
    ctx.beginPath();
    line(ctx, P, [x, EAVE, D + OVER], [x, RIDGE, D / 2], ease(k));
    ctx.strokeStyle = rgba(color, 0.45);
    ctx.lineWidth = lw(0.15);
    ctx.stroke();
    ctx.beginPath();
    line(ctx, P, [x, EAVE, -OVER], [x, RIDGE, D / 2], ease(k));
    ctx.strokeStyle = rgba(color, 0.95);
    ctx.stroke();
  }
  const gables = span(b, ...W.gables);
  if (gables > 0) {
    ctx.beginPath();
    for (let z = 4 / 3; z < D; z += 4 / 3) {
      line(ctx, P, [L, WALL, z], [L, roofY(z), z], ease(gables));
      line(ctx, P, [0, WALL, z], [0, roofY(z), z], ease(gables));
    }
    ctx.strokeStyle = rgba(C.wood, 0.8);
    ctx.lineWidth = lw(0.12);
    ctx.stroke();
  }
}

// The walls that face the camera: sheathing (OSB) going on panel by panel,
// then stucco over it, the openings dark until their windows go in.
function walls(ctx, P, b, s, lit) {
  for (const wall of WALLS) {
    if (wall.id !== "front" && wall.id !== "right") continue;
    const when = wall.id === "right" ? W.sheathRight : W.sheathFront;
    const sheath = span(b, ...when);
    if (sheath <= 0) continue;
    const shade = wall.id === "front" ? 0.1 : 0; // the front faces a little away from the light
    const panels = Math.ceil(wall.len / 4);
    for (let i = 0; i < panels; i++) {
      const on = span(sheath, i / panels, (i + 0.8) / panels);
      if (on <= 0) continue;
      // (each panel overlaps the next a hair, so no seam shows between them)
      const s0 = i * 4, s1 = Math.min(wall.len, s0 + 4.06);
      // stucco goes on the right wall first, then across the front
      const start = lerp(...W.stucco, wall.id === "right" ? 0.35 * (i / panels) : 0.35 + 0.5 * (i / panels));
      const stucco = span(b, start, start + 0.02);
      const osb = mix(settle(C.osb, b - lerp(...when, (i + 0.8) / panels), 0.3), [0, 0, 0], shade);
      const color = mix(osb, mix(C.stucco, C.stuccoShade, shade * 4), ease(stucco));
      fillPoly(ctx, P, wallQuad(wall, s0, s1, SLAB, WALL), rgba(color, ease(on)));
      if (stucco < 1 && on >= 1) {
        // the sheathing's seams
        ctx.beginPath();
        line(ctx, P, wall.at(s1, SLAB), wall.at(s1, WALL));
        ctx.strokeStyle = rgba([0, 0, 0], 0.25 * (1 - stucco));
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
    if (wall.id === "right" && sheath >= 1) {
      // the gable end over it
      const on = span(b, W.sheathRight[1], W.sheathRight[1] + 0.02);
      const stucco = ease(span(b, W.stucco[0], W.stucco[0] + 0.04));
      fillPoly(ctx, P, [[L, WALL, 0], [L, WALL, D], [L, RIDGE, D / 2]], rgba(mix(C.osb, C.stucco, stucco), on));
    }
    for (const o of wall.open) {
      const center = (o.s[0] + o.s[1]) / 2;
      const panel = Math.floor(center / 4);
      if (span(sheath, panel / panels, (panel + 0.8) / panels) < 1) continue;
      opening(ctx, P, wall, o, b, s, lit);
    }
    // once it's stucco, a soft shade where the wall meets the ground
    const finished = ease(span(b, ...W.stucco));
    if (finished > 0) {
      const pts = wallQuad(wall, 0, wall.len, SLAB, WALL);
      path(ctx, P, pts);
      const [x0, y0] = P(...wall.at(wall.len / 2, SLAB));
      const [x1, y1] = P(...wall.at(wall.len / 2, WALL * 0.6));
      const g = ctx.createLinearGradient(x0, y0, x1, y1);
      g.addColorStop(0, `rgba(0,0,0,${0.24 * finished})`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fill();
    }
  }
}

// A window or door in a wall: a dark rough opening, then a dark frame and
// glass (warm once the lights are on); the front door is HB Links green.
function opening(ctx, P, wall, o, b, s, lit) {
  const [s0, s1] = o.s;
  const [y0, y1] = o.y;
  // the right wall's windows first, then the front's, left to right
  const start = lerp(W.windows[0], W.windows[1] - 0.02, (s0 / wall.len) * 0.5 + (wall.id === "front" ? 0.5 : 0));
  const installed = span(b, start, start + 0.02);
  if (o.door === "front") {
    const door = ease(span(b, ...W.door));
    fillPoly(ctx, P, wallQuad(wall, s0, s1, y0, y1), rgba(mix([14, 15, 15], C.green, door)));
    if (door > 0) {
      fillPoly(ctx, P, wallQuad(wall, s0 + 0.25, s1 - 0.25, y0 + 0.2, y1 - 0.2), rgba(mix(C.green, [0, 0, 0], 0.18), door));
      const [hx, hy] = P(...wall.at(s1 - 0.6, 3.6));
      ctx.fillStyle = rgba([210, 196, 160], door);
      ctx.beginPath();
      ctx.arc(hx, hy, Math.max(1, s * 0.12), 0, Math.PI * 2);
      ctx.fill();
    }
    return;
  }
  fillPoly(ctx, P, wallQuad(wall, s0, s1, y0, y1), rgba([12, 13, 13]));
  if (installed <= 0) return;
  const k = ease(installed);
  const trim = 0.25;
  fillPoly(ctx, P, wallQuad(wall, s0 - 0.12, s1 + 0.12, y0 - (o.door ? 0 : 0.12), y1 + 0.12), rgba(C.trim, k));
  const glass = mix(C.glass, C.warm, lit * 0.9);
  const panes = o.door === "slider" ? 2 : 1;
  for (let p = 0; p < panes; p++) {
    const a0 = lerp(s0 + trim, s1 - trim, p / panes) + (p ? trim / 2 : 0);
    const a1 = lerp(s0 + trim, s1 - trim, (p + 1) / panes) - (p < panes - 1 ? trim / 2 : 0);
    const pts = wallQuad(wall, a0, a1, y0 + trim, y1 - trim);
    path(ctx, P, pts);
    const [gx0, gy0] = P(...pts[3]);
    const [gx1, gy1] = P(...pts[1]);
    const g = ctx.createLinearGradient(gx0, gy0, gx1, gy1);
    g.addColorStop(0, rgba(mix(glass, [255, 255, 255], 0.16 * (1 - lit)), k));
    g.addColorStop(0.55, rgba(glass, k));
    g.addColorStop(1, rgba(mix(glass, [0, 0, 0], 0.25 * (1 - lit)), k));
    ctx.fillStyle = g;
    ctx.fill();
  }
}

// The roof: the deck going on in strips, shingles over it with their
// courses, and the fascia along its edges.
function roof(ctx, P, b, lw) {
  const deck = span(b, ...W.deck);
  if (deck <= 0) return;
  const strips = 8;
  const width = (L + 2 * OVER) / strips;
  // the far plane first (from high up it shows just over the ridge), in shade
  for (const far of [true, false]) {
    for (let i = 0; i < strips; i++) {
      const on = span(deck, i / strips, (i + 0.8) / strips);
      if (on <= 0) continue;
      const x0 = -OVER + i * width, x1 = Math.min(L + OVER, x0 + width + 0.06); // (a hair of overlap: no seams)
      const start = lerp(W.shingles[0], W.shingles[1] - 0.02, i / strips);
      const shingled = span(b, start, start + 0.02);
      const color = mix(settle(C.osb, b - lerp(...W.deck, (i + 0.8) / strips), 0.3), C.roof, ease(shingled));
      const z = far ? D + OVER : -OVER;
      fillPoly(ctx, P, [[x0, EAVE, z], [x1, EAVE, z], [x1, RIDGE, D / 2], [x0, RIDGE, D / 2]], rgba(far ? mix(color, [0, 0, 0], 0.3) : color, ease(on)));
    }
  }
  const shingled = span(b, ...W.shingles);
  if (shingled > 0) {
    // the courses, parallel to the eave
    ctx.beginPath();
    const rows = 14;
    for (let r = 1; r < rows; r++) {
      const k = r / rows;
      const z = lerp(-OVER, D / 2, k);
      const y = lerp(EAVE, RIDGE, k);
      line(ctx, P, [-OVER, y, z], [lerp(-OVER, L + OVER, ease(shingled)), y, z]);
    }
    ctx.strokeStyle = rgba([0, 0, 0], 0.22 * shingled);
    ctx.lineWidth = 1;
    ctx.stroke();
    // the shingles catch the evening sky toward the ridge, and fall into
    // shadow toward the far end
    const plane = [[-OVER, EAVE, -OVER], [L + OVER, EAVE, -OVER], [L + OVER, RIDGE, D / 2], [-OVER, RIDGE, D / 2]];
    const sheen = (a, b2, stops) => {
      path(ctx, P, plane);
      const [x0, y0] = P(...a);
      const [x1, y1] = P(...b2);
      const g = ctx.createLinearGradient(x0, y0, x1, y1);
      stops.forEach(([at, color]) => g.addColorStop(at, color));
      ctx.fillStyle = g;
      ctx.fill();
    };
    sheen([L / 2, EAVE, -OVER], [L / 2, RIDGE, D / 2], [[0, "rgba(255,255,255,0)"], [1, `rgba(190,215,205,${0.1 * shingled})`]]);
    sheen([-OVER, EAVE, -OVER], [L + OVER, EAVE, -OVER], [[0, `rgba(0,0,0,${0.22 * shingled})`], [0.6, "rgba(0,0,0,0)"]]);
  }
  // the fascia: bare wood, painted dark with the trim
  const fascia = mix(C.wood, C.trim, ease(span(b, ...W.trim)));
  ctx.beginPath();
  line(ctx, P, [-OVER, EAVE, -OVER], [L + OVER, EAVE, -OVER], ease(deck));
  line(ctx, P, [L + OVER, EAVE, -OVER], [L + OVER, RIDGE, D / 2], ease(deck));
  line(ctx, P, [L + OVER, RIDGE, D / 2], [L + OVER, EAVE, D + OVER], ease(deck));
  ctx.strokeStyle = rgba(fascia);
  ctx.lineWidth = lw(0.45, 1.5);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();
  ctx.lineCap = "butt";
}

// The porch: posts and a beam framed with the roof, then its shed roof; a
// light by the door once the trim is on.
function porch(ctx, P, b, s, lw, lit) {
  const frame = span(b, ...W.porchFrame);
  if (frame <= 0) return;
  const { posts, postZ, beam } = PORCH;
  const finish = ease(span(b, ...W.trim));
  const postColor = mix(settle(C.wood, b - W.porchFrame[1]), C.stucco, finish);
  posts.forEach((x, i) => {
    const k = span(frame, i * 0.2, i * 0.2 + 0.4);
    if (k <= 0) return;
    const top = lerp(PORCH.slab, beam, ease(k));
    fillPoly(ctx, P, [[x - 0.22, PORCH.slab, postZ - 0.22], [x + 0.22, PORCH.slab, postZ - 0.22], [x + 0.22, top, postZ - 0.22], [x - 0.22, top, postZ - 0.22]], rgba(postColor));
    fillPoly(ctx, P, [[x + 0.22, PORCH.slab, postZ - 0.22], [x + 0.22, PORCH.slab, postZ + 0.22], [x + 0.22, top, postZ + 0.22], [x + 0.22, top, postZ - 0.22]], rgba(mix(postColor, [0, 0, 0], 0.18)));
  });
  const beamK = span(frame, 0.45, 0.8);
  if (beamK > 0) {
    ctx.beginPath();
    line(ctx, P, [PORCH.x0 + 0.1, beam, postZ], [PORCH.x1 - 0.1, beam, postZ], ease(beamK));
    ctx.strokeStyle = rgba(mix(C.wood, C.trim, finish));
    ctx.lineWidth = lw(0.4, 1.5);
    ctx.stroke();
  }
  const deck = span(b, W.deck[1] - 0.01, W.deck[1] + 0.02);
  if (deck > 0) {
    const shingled = ease(span(b, W.shingles[1] - 0.03, W.shingles[1]));
    fillPoly(ctx, P, PORCH_ROOF, rgba(mix(C.osb, C.roof, shingled), ease(deck)));
    ctx.beginPath();
    line(ctx, P, PORCH_ROOF[0], PORCH_ROOF[1]);
    line(ctx, P, PORCH_ROOF[1], PORCH_ROOF[2]);
    ctx.strokeStyle = rgba(mix(C.wood, C.trim, finish), ease(deck));
    ctx.lineWidth = lw(0.35, 1.5);
    ctx.stroke();
  }
  if (finish > 0) {
    // the porch light, left of the door
    const [lx, ly] = P(20.9, 6.1, 0);
    ctx.fillStyle = rgba(C.trim, finish);
    ctx.fillRect(lx - s * 0.18, ly - s * 0.3, s * 0.36, s * 0.6);
    if (lit > 0) {
      ctx.fillStyle = rgba(C.warm, lit);
      ctx.fillRect(lx - s * 0.1, ly - s * 0.18, s * 0.2, s * 0.36);
    }
  }
}

// The lot's soft shadow, falling to the left, as the house closes in.
function shadow(ctx, P, b, s) {
  const k = ease(span(b, ...W.shadow));
  if (k <= 0) return;
  const cast = (x, y, z) => P(x - 0.55 * y, 0.02, z - 0.3 * y);
  const pts = [
    cast(0, 0, 0), cast(L, 0, 0), cast(L, 0, D), cast(0, 0, D),
    cast(-OVER, EAVE, -OVER), cast(L + OVER, EAVE, -OVER), cast(L + OVER, EAVE, D + OVER), cast(-OVER, EAVE, D + OVER),
    cast(-OVER, RIDGE, D / 2), cast(L + OVER, RIDGE, D / 2),
  ].map(([x, y]) => [x, y]);
  const hull = convexHull(pts);
  ctx.save();
  ctx.filter = `blur(${Math.max(2, s * 0.45)}px)`;
  ctx.beginPath();
  hull.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();
  ctx.fillStyle = `rgba(0,0,0,${0.38 * k})`;
  ctx.fill();
  ctx.restore();
}

// The yard at the end: beds along the walls, then the lawn (with its mowing
// stripes) and the path's pavers.
function yard(ctx, P, b, s) {
  const bed = ease(span(b, ...W.bed));
  if (bed > 0) {
    fillPoly(ctx, P, groundQuad([0.2, -1.7, 19.4, -0.05], 0.025), rgba(C.soil, bed));
    fillPoly(ctx, P, groundQuad([30.05, 0.4, 31.6, 19.6], 0.025), rgba(C.soil, bed));
  }
  const lawn = span(b, ...W.lawn);
  if (lawn > 0) {
    LAWN.forEach((r, i) => {
      const k = ease(span(lawn, i * 0.12, i * 0.12 + 0.5));
      if (k > 0) fillPoly(ctx, P, groundQuad(r), rgba(C.lawn, k));
    });
    // mowing stripes across the front lawn
    ctx.save();
    for (let i = 0; i < 6; i++) {
      const z0 = -11 + i * 1.6;
      if (i % 2) fillPoly(ctx, P, groundQuad([-3, z0, 19.3, z0 + 1.6], 0.032), rgba(C.lawnDark, 0.7 * ease(lawn)));
    }
    ctx.restore();
  }
  const pavers = span(b, ...W.pavers);
  PAVERS.forEach((r, i) => {
    const k = ease(span(pavers, i * 0.2, i * 0.2 + 0.4));
    if (k > 0) fillPoly(ctx, P, groundQuad(r, 0.06), rgba(C.path, k));
  });
}

// Shrubs in the beds, each a few overlapping rounded clumps.
function shrubs(ctx, P, b, s) {
  const k = span(b, ...W.shrubs);
  if (k <= 0) return;
  SHRUBS.forEach(([x, z], i) => {
    const g = ease(span(k, i * 0.1, i * 0.1 + 0.5));
    if (g <= 0) return;
    const r = s * 0.85 * g;
    for (const [dx, dy, rr] of [[-0.55, 0.1, 0.8], [0.55, 0.15, 0.75], [0, -0.35, 0.9]]) {
      const [cx, cy] = P(x + dx, 0.9 + dy, z);
      const grad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.4, 0, cx, cy, r * rr * 1.1);
      grad.addColorStop(0, rgba(C.shrubHi));
      grad.addColorStop(1, rgba(C.shrub));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r * rr, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

// The HB Links yard sign: it goes up with the layout and stays.
function sign(ctx, P, b, s, logo, gt) {
  const k = ease(span(b, ...W.sign));
  if (k <= 0) return;
  const { x0, x1, z, y0, y1 } = SIGN;
  const rise = lerp(0, 1, k);
  ctx.beginPath();
  for (const x of [x0 + 0.35, x1 - 0.35]) line(ctx, P, [x, 0, z], [x, y1 * rise, z]);
  ctx.strokeStyle = rgba(C.white, 0.9);
  ctx.lineWidth = Math.max(1.5, s * 0.16);
  ctx.stroke();
  if (k < 0.5) return;
  const a = ease(span(k, 0.5, 1));
  const top = y0 + (y1 - y0) * a;
  const panel = [[x0, y0, z], [x1, y0, z], [x1, top, z], [x0, top, z]];
  fillPoly(ctx, P, panel, rgba([14, 17, 15]));
  path(ctx, P, panel);
  ctx.strokeStyle = rgba(C.white, 0.8);
  ctx.lineWidth = 1;
  ctx.stroke();
  if (a < 1) return;
  // the logo across the panel (the panel faces the camera's x axis, so a
  // plain affine map puts the image on it exactly)
  const [px, py] = P(x0, y1, z);
  const [ux, uy] = P(x1, y1, z);
  const [vx, vy] = P(x0, y0, z);
  const pu = [ux - px, uy - py]; // across the panel
  const pv = [vx - px, vy - py]; // down it
  const onPanel = (u0, v0, uSpan, vSpan, w, h) => ctx.transform(
    (pu[0] * uSpan) / w, (pu[1] * uSpan) / w, (pv[0] * vSpan) / h, (pv[1] * vSpan) / h,
    px + pu[0] * u0 + pv[0] * v0, py + pu[1] * u0 + pv[1] * v0,
  );
  ctx.save();
  if (logo?.complete && logo.naturalWidth) {
    const uSpan = 0.8;
    const vSpan = (uSpan * (x1 - x0) * (logo.naturalHeight / logo.naturalWidth)) / (y1 - y0);
    onPanel(0.1, 0.42 - vSpan / 2, uSpan, vSpan, logo.naturalWidth, logo.naturalHeight);
    ctx.drawImage(logo, 0, 0);
  } else {
    onPanel(0.1, 0.18, 0.4, 0.44, MARK.w + MARK.x0, MARK.h);
    for (const [piece, color] of [[MARK.white, C.white], [MARK.green, C.green]]) {
      ctx.beginPath();
      piece.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.closePath();
      ctx.fillStyle = rgba(color);
      ctx.fill();
    }
  }
  ctx.restore();
  ctx.save();
  onPanel(0, 0.72, 1, 0.2, 1000, 100);
  ctx.font = `600 46px ${gt}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = rgba(C.white, 0.75);
  ctx.fillText("GENERAL CONTRACTOR", 500, 50);
  ctx.restore();
}

// The lights, once the house is finished: a warm glow from each window and
// the porch, and a pool of light on the porch slab.
function glow(ctx, P, s, lit) {
  if (lit <= 0) return;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const blob = (x, y, z, r, a) => {
    const [cx, cy] = P(x, y, z);
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * s);
    g.addColorStop(0, rgba(C.warm, a * lit));
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r * s, 0, Math.PI * 2);
    ctx.fill();
  };
  for (const wall of WALLS) {
    if (wall.id !== "front" && wall.id !== "right") continue;
    for (const o of wall.open) {
      if (o.door === "front") continue;
      const [x, y, z] = wall.at((o.s[0] + o.s[1]) / 2, (o.y[0] + o.y[1]) / 2);
      blob(x, y, z, (o.s[1] - o.s[0]) * 0.9 + 1.5, 0.22);
    }
  }
  blob(20.9, 6.1, 0, 3.2, 0.35);
  blob(23, 0.5, -3, 4.5, 0.16);
  ctx.restore();
}
