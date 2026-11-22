// What the service pages' own hero scenes (heroes/*.js) are built from: the
// homepage hero's pieces (Home/intro/kit.js, property.js), and a few more —
// a slab poured, a wall's skin going on, hip, shed and flat roofs, lawn,
// shadows and the lights. Coordinates are feet: x across the front, y up, z
// away from the camera, which looks at the fronts (low z) and the right
// sides (high x). `G` is { ctx, P, s, lw }.

import { C, lerp, ease, span, mix, rgba, fillPoly, line, groundQuad, settle, shadeOf, groundGlow, convexHull, block, pane, frameRun, tree, path } from "@/components/Home/intro/kit";
import { ghost, box, shrub } from "@/components/Home/intro/property";

export { C, lerp, ease, span, mix, rgba, fillPoly, line, groundQuad, settle, shadeOf, groundGlow, block, pane, frameRun, tree, path, ghost, box, shrub };

// a few more materials
export const M = {
  terracotta: [168, 84, 58],
  sand: [224, 206, 176],
  slateBlue: [92, 114, 130],
  cream: [234, 224, 202],
  cedar: [170, 118, 74],
  charcoal: [48, 52, 56],
  metal: [70, 76, 80],
  navy: [38, 54, 78],
  sage: [66, 104, 80],
  oak: [178, 132, 84],
  porcelain: [240, 239, 234],
  walnut: [140, 100, 66],
  drywall: [196, 192, 184],
  paint: [236, 232, 222],
  plywood: [196, 164, 118],
  board: [158, 160, 156], // backer board
  membrane: [76, 150, 162],
  copper: [204, 124, 72],
  wire: [226, 196, 72],
  section: [230, 227, 218], // where a wall's been cut, seen from above
  dark: [12, 13, 13], // an opening before its window goes in
};

// how far `k` has got through [a, b], eased
export const step = (k, a, b) => ease(span(k, a, b));
// a quad on a wall (`at(s, y)` gives its points), s and y ranges
export const quad = (at, s0, s1, y0, y1) => [at(s0, y0), at(s1, y0), at(s1, y1), at(s0, y1)];
export function stroke(ctx, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

// A rectangle's four walls, each laid out along its own length: `at(s, y)`.
export function sides({ x: [x0, x1], z: [z0, z1] }) {
  return {
    front: (s, y) => [x0 + s, y, z0],
    right: (s, y) => [x1, y, z0 + s],
    back: (s, y) => [x0 + s, y, z1],
    left: (s, y) => [x0, y, z0 + s],
  };
}

// The lawn, with faint mowing stripes, `a` of the way in.
export function lawn(G, [x0, z0, x1, z1], a = 1) {
  if (a <= 0) return;
  const { ctx, P } = G;
  fillPoly(ctx, P, groundQuad([x0, z0, x1, z1], 0.01), rgba(C.lawn, a));
  for (let z = z0 + 2; z < z1; z += 4) fillPoly(ctx, P, groundQuad([x0, z, x1, Math.min(z1, z + 2)], 0.012), rgba(C.lawnDark, 0.55 * a));
}

// A soft shadow falling to the left from a box `h` tall.
export function shadow(G, [x0, x1], [z0, z1], h, a = 1) {
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

// Warm light: `spots` glowing in the air ([x, y, z, radius, alpha]), `pools`
// on the ground ([x, z, radius, alpha]), `lit` of the way on.
export function glow(G, spots, lit) {
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
export function spill(G, pools, lit) {
  if (lit <= 0) return;
  const { ctx, P } = G;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const [x, z, r, a] of pools) groundGlow(ctx, P, x, z, r, rgba(C.warm, a * lit));
  ctx.restore();
}
// where a window glows, and where its light falls (`out`: the way its wall
// faces, [dx, dz])
export function windowLight(at, w, out) {
  const [x, y, z] = at((w.s[0] + w.s[1]) / 2, (w.y[0] + w.y[1]) / 2);
  const width = w.s[1] - w.s[0];
  return { spot: [x, y, z, width * 0.9 + 1.5, 0.22], pool: [x + out[0] * 3, z + out[1] * 3, width * 0.9 + 2.5, 0.2] };
}

// A slab poured back to front over its forms as `k` runs: wet and dark,
// then cured.
export function pour(G, [x0, x1], [z0, z1], top, k, base = 0) {
  if (k <= 0) return;
  const { ctx, P, s } = G;
  const forms = span(k, 0, 0.3);
  const p = ease(span(k, 0.2, 0.8));
  if (p < 1) {
    ctx.beginPath();
    for (const y of [base, top + 0.1]) {
      line(ctx, P, [x0, y, z0], [x1, y, z0], ease(forms));
      line(ctx, P, [x1, y, z0], [x1, y, z1], ease(forms));
    }
    stroke(ctx, rgba(C.wood, 0.9 * (1 - p)), Math.max(1, s * 0.12));
  }
  if (p <= 0) return;
  const concrete = mix(C.wet, C.concrete, span(k, 0.7, 1));
  const zc = lerp(z1, z0, p);
  fillPoly(ctx, P, [[x1, base, zc], [x1, base, z1], [x1, top, z1], [x1, top, zc]], rgba(shadeOf(concrete, -0.32)));
  if (p >= 1) fillPoly(ctx, P, [[x0, base, z0], [x1, base, z0], [x1, top, z0], [x0, top, z0]], rgba(shadeOf(concrete, -0.18)));
  fillPoly(ctx, P, [[x0, top, zc], [x1, top, zc], [x1, top, z1], [x0, top, z1]], rgba(concrete));
}

// A wall's skin going on over its framing: sheathing panel by panel as
// `sheath` runs 0-1, then its finish (`color`) as `finish` does, its
// openings (`opens`, each with `when` its window goes in) dark until then.
// `shade` darkens a wall turned a little from the light; `battens` draws a
// board-and-batten wall's battens once it's finished.
export function skin(G, at, len, [y0, y1], { sheath, finish, color, shade = 0, opens = [], k, lit, battens = 0, door = null }) {
  if (sheath <= 0) return;
  const { ctx, P } = G;
  const panels = Math.ceil(len / 4);
  for (let i = 0; i < panels; i++) {
    const on = span(sheath, i / panels, (i + 0.8) / panels);
    if (on <= 0) continue;
    const s0 = i * 4;
    const s1 = Math.min(len, s0 + 4.06);
    const done = ease(span(finish, (i / panels) * 0.7, (i / panels) * 0.7 + 0.3));
    const osb = mix(settle(C.osb, sheath - (i + 0.8) / panels, 0.3), [0, 0, 0], shade);
    fillPoly(ctx, P, quad(at, s0, s1, y0, y1), rgba(mix(osb, shadeOf(color, -shade), done), ease(on)));
  }
  if (battens && finish >= 1) {
    ctx.beginPath();
    for (let s = battens; s < len; s += battens) line(ctx, P, at(s, y0), at(s, y1));
    stroke(ctx, "rgba(0,0,0,0.16)", 1);
  }
  if (sheath < 1) return;
  for (const o of opens) {
    fillPoly(ctx, P, quad(at, o.s[0], o.s[1], o.y[0], o.y[1]), rgba(M.dark));
    const a = step(k, ...o.when);
    if (a > 0) pane(G, at, o.s, o.y, lit, a, o.panes ?? 1);
  }
  if (door) {
    const a = step(k, ...door.when);
    if (a > 0) {
      fillPoly(ctx, P, quad(at, door.s[0], door.s[1], door.y[0], door.y[1]), rgba(door.color ?? C.green, a));
      fillPoly(ctx, P, quad(at, door.s[0] + 0.35, door.s[1] - 0.35, door.y[0] + 0.4, door.y[1] - 0.4), rgba(shadeOf(door.color ?? C.green, -0.18), a));
    }
  }
}

// A hip roof over a rectangle `r` ({ x, z }) from its walls' top `wall`:
// its back slope, both hip ends and its front slope (this low, all four
// face the camera), decked (OSB) as `deck`
// runs and finished in `color` as `finish` runs — courses along its eaves
// and, for tile, ribs down its slopes — with its fascia. `lift` raises it
// away (and `a` fades it).
export function hipRoof(G, r, wall, { pitch = 0.45, over = 1.2, color = C.roof, deck = 1, finish = 1, ribs = false, lift = 0, a = 1 }) {
  if (deck <= 0 || a <= 0.01) return;
  const { ctx, P, lw } = G;
  const X0 = r.x[0] - over;
  const X1 = r.x[1] + over;
  const Z0 = r.z[0] - over;
  const Z1 = r.z[1] + over;
  const hd = Math.min(X1 - X0, Z1 - Z0) / 2;
  const e = wall - pitch * over + lift;
  const top = e + pitch * hd;
  const zm = (Z0 + Z1) / 2;
  const rx0 = X0 + hd;
  const rx1 = X1 - hd;
  const shade = mix(settle(C.osb, deck - 0.9, 0.3), color, ease(finish));
  const tone = (k) => rgba(shadeOf(shade, k), a * ease(deck));
  fillPoly(ctx, P, [[X0, e, Z1], [X1, e, Z1], [rx1, top, zm], [rx0, top, zm]], tone(-0.35));
  fillPoly(ctx, P, [[X0, e, Z0], [X0, e, Z1], [rx0, top, zm]], tone(-0.24));
  fillPoly(ctx, P, [[X1, e, Z0], [X1, e, Z1], [rx1, top, zm]], tone(0.04));
  fillPoly(ctx, P, [[X0, e, Z0], [X1, e, Z0], [rx1, top, zm], [rx0, top, zm]], tone(-0.12));
  if (finish > 0) {
    ctx.beginPath();
    for (let i = 1; i < 8; i++) {
      const t = i / 8;
      const y = lerp(e, top, t);
      line(ctx, P, [X0 + hd * t, y, Z0 + hd * t], [X1 - hd * t, y, Z0 + hd * t]);
      line(ctx, P, [X1 - hd * t, y, Z0 + hd * t], [X1 - hd * t, y, Z1 - hd * t]);
      line(ctx, P, [X0 + hd * t, y, Z0 + hd * t], [X0 + hd * t, y, Z1 - hd * t]);
      line(ctx, P, [X0 + hd * t, y, Z1 - hd * t], [X1 - hd * t, y, Z1 - hd * t]);
    }
    if (ribs)
      for (let x = X0 + 0.9; x < X1; x += 0.9) {
        const t = Math.min(1, (x - X0) / hd, (X1 - x) / hd);
        line(ctx, P, [x, e, Z0], [x, lerp(e, top, t), Z0 + hd * t]);
      }
    stroke(ctx, `rgba(0,0,0,${0.2 * finish * a})`, 1);
  }
  ctx.beginPath();
  line(ctx, P, [X0, e, Z0], [X1, e, Z0]);
  line(ctx, P, [X1, e, Z0], [X1, e, Z1]);
  line(ctx, P, [X0, e, Z0], [X0, e, Z1]);
  line(ctx, P, [X0, e, Z1], [X1, e, Z1]);
  line(ctx, P, [X0, e, Z1], [rx0, top, zm]);
  line(ctx, P, [X1, e, Z1], [rx1, top, zm]);
  line(ctx, P, [X0, e, Z0], [rx0, top, zm]);
  line(ctx, P, [X1, e, Z0], [rx1, top, zm]);
  line(ctx, P, [rx0, top, zm], [rx1, top, zm]);
  stroke(ctx, rgba(C.trim, 0.9 * a * ease(deck)), lw(0.3, 1.2));
}
// its dashed outline
export function hipGhost(r, wall, { pitch = 0.45, over = 1.2 } = {}) {
  const X0 = r.x[0] - over;
  const X1 = r.x[1] + over;
  const Z0 = r.z[0] - over;
  const Z1 = r.z[1] + over;
  const hd = Math.min(X1 - X0, Z1 - Z0) / 2;
  const e = wall - pitch * over;
  const top = e + pitch * hd;
  const zm = (Z0 + Z1) / 2;
  return [
    [[X0, e, Z0], [X1, e, Z0]], [[X1, e, Z0], [X1, e, Z1]], [[X1, e, Z1], [X0, e, Z1]], [[X0, e, Z1], [X0, e, Z0]],
    [[X0, e, Z0], [X0 + hd, top, zm]], [[X1, e, Z0], [X1 - hd, top, zm]], [[X1, e, Z1], [X1 - hd, top, zm]], [[X0, e, Z1], [X0 + hd, top, zm]],
    [[X0 + hd, top, zm], [X1 - hd, top, zm]],
  ];
}

// A dark section cut across a wall's top, seen from above.
export function cutTop(G, [x0, x1], [z0, z1], y) {
  fillPoly(G.ctx, G.P, groundQuad([x0, z0, x1, z1], y), rgba(M.section));
}

// Tiles across a flat area (`pts`, a quad), its grid every `size` ft along
// its two sides.
export function tileGrid(G, pts, n, m, a = 1) {
  const { ctx, P } = G;
  const [p0, p1, , p3] = pts;
  const at = (u, v) => p0.map((c, i) => c + (p1[i] - c) * u + (p3[i] - c) * v);
  ctx.beginPath();
  for (let i = 1; i < n; i++) line(ctx, P, at(i / n, 0), at(i / n, 1));
  for (let j = 1; j < m; j++) line(ctx, P, at(0, j / m), at(1, j / m));
  stroke(ctx, `rgba(0,0,0,${0.16 * a})`, 1);
}

// A line of pipe or wire along `pts`, drawn on as `k` runs, freshly placed
// glowing green and settling to `color`.
export function run(G, pts, k, color, width = 1.5) {
  if (k <= 0) return;
  const { ctx, P } = G;
  const legs = pts.length - 1;
  ctx.beginPath();
  for (let i = 0; i < legs; i++) {
    const g = span(k, i / legs, (i + 1) / legs);
    if (g <= 0) break;
    line(ctx, P, pts[i], pts[i + 1], ease(g));
  }
  stroke(ctx, rgba(settle(color, k - 0.9)), width);
}
