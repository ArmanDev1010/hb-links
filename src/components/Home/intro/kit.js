// What the homepage hero's drawing (scene.js and its lots) shares: a little
// maths, the palette, and the pieces every lot is drawn with. Coordinates are
// feet in the lot's own frame: x across its front, y up, z away from the
// camera; `P(x, y, z)` turns a point into [screen x, screen y, depth].

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, k) => a + (b - a) * k;
export const ease = (k) => k * k * (3 - 2 * k);
// how far `b` has got through [a0, a1], 0-1
export const span = (b, a0, a1) => clamp((b - a0) / (a1 - a0));
export const mix = (c1, c2, k) => c1.map((v, i) => Math.round(lerp(v, c2[i], k)));
export const rgba = ([r, g, b], a = 1) => `rgba(${r},${g},${b},${a})`;
export const RAD = Math.PI / 180;

// ---- palette ---------------------------------------------------------------
export const C = {
  bg: [9, 11, 10],
  grid: [92, 132, 108],
  green: [16, 107, 55], // the logo's
  greenHi: [74, 214, 128], // freshly placed work glows this, then settles
  white: [244, 242, 236],
  wood: [218, 182, 130],
  osb: [190, 152, 100],
  concrete: [160, 160, 155],
  wet: [96, 98, 96],
  stucco: [238, 234, 225],
  stuccoShade: [205, 199, 188],
  sand: [222, 210, 188], // a warmer stucco, for neighbours
  slate: [118, 128, 132], // and a grey-blue one
  roof: [46, 49, 52],
  trim: [24, 25, 26],
  glass: [44, 58, 70],
  warm: [255, 196, 118],
  soil: [58, 44, 34],
  lawn: [44, 104, 58],
  lawnDark: [36, 88, 49],
  path: [200, 190, 170],
  shrub: [34, 82, 46],
  shrubHi: [66, 128, 74],
  deck: [176, 122, 78],
  deckDark: [128, 86, 54],
  floor: [196, 158, 112],
  tile: [226, 228, 226],
  steel: [168, 174, 178],
  paint: [228, 224, 214], // inside walls
};

// ---- drawing ---------------------------------------------------------------
export function path(ctx, P, pts) {
  ctx.beginPath();
  pts.forEach((p, i) => {
    const [x, y] = P(p[0], p[1], p[2]);
    if (i) ctx.lineTo(x, y);
    else ctx.moveTo(x, y);
  });
  ctx.closePath();
}
export function fillPoly(ctx, P, pts, color) {
  path(ctx, P, pts);
  ctx.fillStyle = color;
  ctx.fill();
}
// a straight piece from `a` to `b`, drawn `k` of the way along
export function line(ctx, P, a, b, k = 1) {
  const [x1, y1] = P(a[0], a[1], a[2]);
  const [x2, y2] = P(b[0], b[1], b[2]);
  ctx.moveTo(x1, y1);
  ctx.lineTo(lerp(x1, x2, k), lerp(y1, y2, k));
}
// a ground rectangle (x0, z0, x1, z1) at height y
export const groundQuad = ([x0, z0, x1, z1], y = 0.03) => [[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]];
// freshly placed work glows green, settling into its own color (a panel only
// takes a touch of it, a stud the full glow)
export const settle = (color, age, strength = 1) => mix(color, C.greenHi, strength * (1 - ease(clamp(age / 0.03))));
// darker and lighter versions of a colour, for the sides of a box
export const shadeOf = (color, k) => (k >= 0 ? mix(color, [255, 255, 255], k) : mix(color, [0, 0, 0], -k));

// a radial gradient lying on the ground (or a floor `y` up), centred on
// (x, z), `r` feet across: a pool of light that's round on the lot, an
// ellipse on screen
export function groundGlow(ctx, P, x, z, r, inner, outer = "rgba(0,0,0,0)", y = 0) {
  const [ox, oy] = P(x, y, z);
  const [ax, ay] = P(x + 1, y, z);
  const [bx, by] = P(x, y, z + 1);
  ctx.save();
  ctx.transform(ax - ox, ay - oy, bx - ox, by - oy, ox, oy);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
  g.addColorStop(0, inner);
  g.addColorStop(1, outer);
  ctx.fillStyle = g;
  ctx.fillRect(-r, -r, 2 * r, 2 * r);
  ctx.restore();
}

// the same "random" numbers every frame, so the scene is a function of t
export function rng(seed) {
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}

export function convexHull(points) {
  const p = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower = [], upper = [];
  for (const q of p) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0) lower.pop();
    lower.push(q);
  }
  for (const q of p.reverse()) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0) upper.pop();
    upper.push(q);
  }
  return lower.slice(0, -1).concat(upper.slice(0, -1));
}

// ---- building blocks for the lots ------------------------------------------
// `G` is { ctx, P, s (px per foot), lw(feet) -> line width }.

// A box's three sides the camera sees — its front (z0), right (x1) and top —
// each `color` lit as it faces (the right side catches the light). `a` fades
// it in; `grow` (0-1) raises it from the ground.
export function block(G, [x0, x1], [y0, y1], [z0, z1], color, a = 1, grow = 1) {
  if (a <= 0 || grow <= 0) return;
  const { ctx, P } = G;
  const top = lerp(y0, y1, grow);
  fillPoly(ctx, P, [[x0, top, z0], [x1, top, z0], [x1, top, z1], [x0, top, z1]], rgba(shadeOf(color, 0.1), a));
  fillPoly(ctx, P, [[x0, y0, z0], [x1, y0, z0], [x1, top, z0], [x0, top, z0]], rgba(shadeOf(color, -0.12), a));
  fillPoly(ctx, P, [[x1, y0, z0], [x1, y0, z1], [x1, top, z1], [x1, top, z0]], rgba(color, a));
}

// A window or glass door on a wall (`at(s, y)` gives the wall's points): a
// dark frame and glass, warm once the lights are on (`lit`). `panes` splits it.
export function pane(G, at, [s0, s1], [y0, y1], lit, a = 1, panes = 1) {
  if (a <= 0) return;
  const { ctx, P } = G;
  const quad = (a0, a1, b0, b1) => [at(a0, b0), at(a1, b0), at(a1, b1), at(a0, b1)];
  fillPoly(ctx, P, quad(s0 - 0.12, s1 + 0.12, y0 - 0.12, y1 + 0.12), rgba(C.trim, a));
  const glass = mix(C.glass, C.warm, lit * 0.9);
  const trim = 0.22;
  for (let p = 0; p < panes; p++) {
    const a0 = lerp(s0 + trim, s1 - trim, p / panes) + (p ? trim / 2 : 0);
    const a1 = lerp(s0 + trim, s1 - trim, (p + 1) / panes) - (p < panes - 1 ? trim / 2 : 0);
    const pts = quad(a0, a1, y0 + trim, y1 - trim);
    path(ctx, P, pts);
    const [gx0, gy0] = P(...pts[3]);
    const [gx1, gy1] = P(...pts[1]);
    const g = ctx.createLinearGradient(gx0, gy0, gx1, gy1);
    g.addColorStop(0, rgba(mix(glass, [255, 255, 255], 0.16 * (1 - lit)), a));
    g.addColorStop(0.55, rgba(glass, a));
    g.addColorStop(1, rgba(mix(glass, [0, 0, 0], 0.25 * (1 - lit)), a));
    ctx.fillStyle = g;
    ctx.fill();
  }
}

// A wall's framing going up as `k` runs 0-1: the bottom plate, then studs
// 16" apart along it (cut short over and under its openings), king studs and
// headers, then the double top plate.
export function frameRun(G, at, len, opens, k, base, top) {
  if (k <= 0) return;
  const { ctx, P, lw } = G;
  const members = [{ a: [0, base], b: [len, base], at: 0, dur: 0.15 }];
  const along = (s) => 0.1 + 0.68 * (s / len);
  const inOpening = (s) => opens.find((o) => s > o.s[0] - 0.2 && s < o.s[1] + 0.2);
  for (let i = 0; i * (4 / 3) <= len + 0.01; i++) {
    const s = Math.min(i * (4 / 3), len);
    const o = inOpening(s);
    if (!o) members.push({ a: [s, base], b: [s, top - 0.3], at: along(s), dur: 0.06 });
    else {
      if (o.y[0] > base + 0.3) members.push({ a: [s, base], b: [s, o.y[0]], at: along(s), dur: 0.05 });
      members.push({ a: [s, o.y[1] + 0.6], b: [s, top - 0.3], at: along(s), dur: 0.05 });
    }
  }
  for (const o of opens) {
    for (const s of [o.s[0] - 0.15, o.s[1] + 0.15]) members.push({ a: [s, base], b: [s, top - 0.3], at: along(s), dur: 0.06 });
    members.push({ a: [o.s[0] - 0.15, o.y[1] + 0.3], b: [o.s[1] + 0.15, o.y[1] + 0.3], at: along(o.s[1]) + 0.02, dur: 0.05, heavy: true });
    if (o.y[0] > base + 0.3) members.push({ a: [o.s[0], o.y[0]], b: [o.s[1], o.y[0]], at: along(o.s[1]) + 0.02, dur: 0.05 });
  }
  for (const y of [top - 0.3, top]) members.push({ a: [0, y], b: [len, y], at: 0.85, dur: 0.15 });
  for (const m of members) {
    const kk = span(k, m.at, m.at + m.dur);
    if (kk <= 0) continue;
    ctx.beginPath();
    line(ctx, P, at(...m.a), at(...m.b), ease(kk));
    ctx.strokeStyle = rgba(settle(C.wood, (k - m.at - m.dur) * 0.3));
    ctx.lineWidth = lw(m.heavy ? 0.3 : 0.15);
    ctx.stroke();
  }
}

// A tree: a trunk and a round, softly lit canopy (`dim` sinks it into the dark).
export function tree(G, x, z, size = 1, dim = 0) {
  const { ctx, P, s } = G;
  const [bx, by] = P(x, 0, z);
  const [tx, ty] = P(x, 5 * size, z);
  ctx.strokeStyle = rgba(mix([58, 44, 34], C.bg, dim));
  ctx.lineWidth = Math.max(1, s * 0.5 * size);
  ctx.beginPath();
  ctx.moveTo(bx, by);
  ctx.lineTo(tx, ty);
  ctx.stroke();
  const [cx, cy] = P(x, 9 * size, z);
  const r = s * 4.6 * size;
  const g = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.4, 0, cx, cy, r * 1.05);
  g.addColorStop(0, rgba(mix([62, 118, 70], C.bg, dim)));
  g.addColorStop(1, rgba(mix([24, 58, 34], C.bg, dim)));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
}

// A finished house with a gable roof, its ridge running across its front
// (`along: "x"`) or front to back (`"z"`): walls (front and right side), the
// roof planes the camera sees, a gable end, the fascia, and its windows
// (`windows`: { face: "front" | "right", s, y, panes, door }, `door` drawn in
// `doorColor`). `overRight` trims the overhang over its right gable (where an
// addition meets it). `a` fades all of it in.
export function house(G, h, lit, a = 1) {
  if (a <= 0) return;
  const { ctx, P, lw } = G;
  const { x0, x1, z0, z1, wall = 9, pitch = 0.6, over = 1.2, along = "x", color = C.stucco, roof = C.roof } = h;
  const front = (s, y) => [s, y, z0];
  const right = (s, y) => [x1, y, s];
  fillPoly(ctx, P, [front(x0, 0), front(x1, 0), front(x1, wall), front(x0, wall)], rgba(shadeOf(color, -0.1), a));
  fillPoly(ctx, P, [right(z0, 0), right(z1, 0), right(z1, wall), right(z0, wall)], rgba(color, a));
  const eave = wall - pitch * over;
  // the gable end first, then both slopes (from high up the far one shows
  // just over the ridge), so the overhangs sit in front of the wall
  if (along === "x") {
    const zm = (z0 + z1) / 2, ridge = wall + pitch * (zm - z0);
    const xr = x1 + (h.overRight ?? over);
    fillPoly(ctx, P, [[x1, wall, z0], [x1, wall, z1], [x1, ridge, zm]], rgba(color, a));
    fillPoly(ctx, P, [[x0 - over, eave, z1 + over], [xr, eave, z1 + over], [xr, ridge, zm], [x0 - over, ridge, zm]], rgba(shadeOf(roof, -0.3), a));
    fillPoly(ctx, P, [[x0 - over, eave, z0 - over], [xr, eave, z0 - over], [xr, ridge, zm], [x0 - over, ridge, zm]], rgba(roof, a));
    ctx.beginPath();
    line(ctx, P, [x0 - over, eave, z0 - over], [xr, eave, z0 - over]);
    line(ctx, P, [xr, eave, z0 - over], [xr, ridge, zm]);
    line(ctx, P, [xr, ridge, zm], [xr, eave, z1 + over]);
  } else {
    const xm = (x0 + x1) / 2, ridge = wall + pitch * (xm - x0);
    fillPoly(ctx, P, [[x0, wall, z0], [x1, wall, z0], [xm, ridge, z0]], rgba(shadeOf(color, -0.1), a));
    fillPoly(ctx, P, [[x0 - over, eave, z0 - over], [xm, ridge, z0 - over], [xm, ridge, z1 + over], [x0 - over, eave, z1 + over]], rgba(shadeOf(roof, -0.22), a));
    fillPoly(ctx, P, [[xm, ridge, z0 - over], [xm, ridge, z1 + over], [x1 + over, eave, z1 + over], [x1 + over, eave, z0 - over]], rgba(roof, a));
    ctx.beginPath();
    line(ctx, P, [x0 - over, eave, z0 - over], [xm, ridge, z0 - over]);
    line(ctx, P, [xm, ridge, z0 - over], [x1 + over, eave, z0 - over]);
    line(ctx, P, [x1 + over, eave, z0 - over], [x1 + over, eave, z1 + over]);
  }
  ctx.strokeStyle = rgba(C.trim, a);
  ctx.lineWidth = lw(0.4, 1.2);
  ctx.lineCap = "round";
  ctx.stroke();
  ctx.lineCap = "butt";
  for (const w of h.windows ?? []) {
    const at = w.face === "front" ? front : right;
    if (w.door) fillPoly(ctx, P, [at(w.s[0], w.y[0]), at(w.s[1], w.y[0]), at(w.s[1], w.y[1]), at(w.s[0], w.y[1])], rgba(h.doorColor ?? C.trim, a));
    else pane(G, at, w.s, w.y, lit, a, w.panes ?? 1);
  }
}
