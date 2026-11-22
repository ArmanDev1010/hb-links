// What every service's drawing for The Build is made of (layers/index.js):
// the pieces of an architect's exploded view, drawn in white on the Forest
// Green blueprint ServiceBuild lays under it (BuildSheet). Each face is
// filled with the sheet lightened by how much it faces the light (tops
// lightest, fronts darkest, glass the sheet itself), so the drawing reads
// as a white model; lines are white, and Electric Lime while their layer is
// lit (being read, or just built).
//
// Coordinates are feet in the drawing's own frame (Home/intro/kit.js): x
// across its front, y up, z away from the camera, which looks at the front
// (low z) and the right side (high x) from above.

import { ease, lerp, mix, rgba, span } from "@/components/Home/intro/kit";

export const SHEET = [10, 69, 35]; // Forest Green: the sheet it's drawn on
export const WHITE = [255, 255, 255];
export const LIME = [196, 229, 56]; // Electric Lime
// the line weights (opacities of the white)
export const EDGE = 0.85; // outlines
export const LINE = 0.5; // the lines inside them
// the faces: the sheet lightened toward white by how much each faces the
// light; a few materials a shade apart
export const TONE = {
  roof: 0.44,
  top: 0.34,
  right: 0.21,
  front: 0.11,
  door: 0.42,
  glass: 0.02,
  paper: 0.62,
  osb: 0.27,
  membrane: 0.16,
  cut: 0.5, // a wall's top where the drawing cuts it
};

// ---- drawing a layer ------------------------------------------------------
// `R` is { ctx, P, s (px per foot), dpr, off ([x, y, z] ft the layer is
// moved by), a (its opacity), on (0-1, being read), fresh (0-1, just
// built) }.

export const put = (R, [x, y, z]) => R.P(x + R.off[0], y + R.off[1], z + R.off[2]);
export const lit = (R) => Math.max(R.on, R.fresh);
// the line colour: white, lime while its layer is lit
export const ink = (R, alpha) => rgba(mix(WHITE, LIME, lit(R)), Math.min(1, alpha * lerp(1, 1.2, lit(R))) * R.a);
// a face's fill: its tone, lime-washed while its layer is read
export const fillOf = (R, tone) => rgba(mix(mix(SHEET, WHITE, TONE[tone]), LIME, 0.32 * R.on), R.a);

export function trace(R, pts) {
  const { ctx } = R;
  ctx.beginPath();
  pts.forEach((p, i) => {
    const [x, y] = put(R, p);
    if (i) ctx.lineTo(x, y);
    else ctx.moveTo(x, y);
  });
  ctx.closePath();
}

// a face: filled in its tone (so what's behind it is hidden), outlined
export function face(R, pts, { tone = "top", fill = true, edge = EDGE } = {}) {
  if (R.a <= 0) return;
  const { ctx } = R;
  trace(R, pts);
  if (fill) {
    ctx.fillStyle = fillOf(R, tone);
    ctx.fill();
  }
  if (edge) {
    ctx.strokeStyle = ink(R, edge);
    ctx.lineWidth = lerp(1, 1.6, R.on);
    ctx.stroke();
  }
}

// a straight line from `a` to `b`, drawn `k` of the way along
export function seg(R, a, b, alpha = LINE, width = 1, k = 1) {
  if (k <= 0 || R.a <= 0) return;
  const { ctx } = R;
  const [x1, y1] = put(R, a);
  const [x2, y2] = put(R, b);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(lerp(x1, x2, k), lerp(y1, y2, k));
  ctx.strokeStyle = ink(R, alpha);
  ctx.lineWidth = width;
  ctx.stroke();
}

// the same, dashed (or dotted)
export function dashed(R, a, b, dash = [5, 4], alpha = LINE, width = 1, k = 1) {
  const { ctx } = R;
  ctx.save();
  ctx.setLineDash(dash);
  seg(R, a, b, alpha, width, k);
  ctx.restore();
}

// a box's three faces the camera sees, each in its tone (`top` sets the
// top's)
export function box(R, [x0, x1], [y0, y1], [z0, z1], { top = "top", front = "front", right = "right" } = {}) {
  face(R, [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], { tone: front });
  face(R, [[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]], { tone: right });
  face(R, [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], { tone: top });
}

// a rectangle on the ground (or a floor `y` up)
export const flat = ([x0, z0, x1, z1], y) => [[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]];

// with `R.a` faded by `k` for the length of `draw`
export function fading(R, k, draw) {
  if (k <= 0) return;
  const a = R.a;
  R.a = a * k;
  draw();
  R.a = a;
}

// A soft shadow under a layer: its footprint, dark and blurred (drawn as
// the shadow of a shape off the canvas, which blurs the same everywhere).
export function softShadow(R, pts, blur, alpha) {
  if (R.a <= 0) return;
  const { ctx, dpr } = R;
  const away = 20000;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.beginPath();
  pts.forEach((p, i) => {
    const [x, y] = put(R, p);
    if (i) ctx.lineTo(x * dpr - away, y * dpr);
    else ctx.moveTo(x * dpr - away, y * dpr);
  });
  ctx.closePath();
  ctx.shadowColor = `rgba(0,0,0,${alpha * R.a})`;
  ctx.shadowBlur = blur * dpr;
  ctx.shadowOffsetX = away;
  ctx.fillStyle = "#000";
  ctx.fill();
  ctx.restore();
}

// the edges of a box the camera sees, for a layer's dashed outline
export function ghostBox(R, [x0, x1], [y0, y1], [z0, z1]) {
  const edges = [
    [[x0, y1, z0], [x1, y1, z0]], [[x1, y1, z0], [x1, y1, z1]], [[x1, y1, z1], [x0, y1, z1]], [[x0, y1, z1], [x0, y1, z0]],
    [[x0, y0, z0], [x1, y0, z0]], [[x1, y0, z0], [x1, y0, z1]],
    [[x0, y0, z0], [x0, y1, z0]], [[x1, y0, z0], [x1, y1, z0]], [[x1, y0, z1], [x1, y1, z1]],
  ];
  const { ctx } = R;
  ctx.beginPath();
  for (const [a, b] of edges) {
    const [ax, ay] = put(R, a);
    const [bx, by] = put(R, b);
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
  }
  ctx.stroke();
}

// ---- a building -----------------------------------------------------------
// A rectangular building `b`: { x: [x0, x1], z: [z0, z1], base (its floor's
// top), wall (its walls' top), open: { front, right, back, left } — each a
// list of openings along that wall, { s: [from, to] along it, y: [sill,
// head], door: "front" | "slider" } }. Its walls, each laid out along its
// own length `s`.
export function wallsOf(b) {
  const [x0, x1] = b.x;
  const [z0, z1] = b.z;
  const open = b.open ?? {};
  return [
    { id: "back", len: x1 - x0, at: (s, y) => [x0 + s, y, z1], open: open.back ?? [] },
    { id: "left", len: z1 - z0, at: (s, y) => [x0, y, z0 + s], open: open.left ?? [] },
    { id: "right", len: z1 - z0, at: (s, y) => [x1, y, z0 + s], open: open.right ?? [] },
    { id: "front", len: x1 - x0, at: (s, y) => [x0 + s, y, z0], open: open.front ?? [] },
  ];
}

// A wall's framing: its plates, studs `spacing` ft apart, the posts beside
// its openings and the headers over them; each piece with when it goes up
// (`t`, 0-1 of the wall's build).
function wallMembers(wall, base, top, spacing) {
  const { len, open } = wall;
  const along = (s) => 0.08 + 0.6 * (s / len);
  const m = [{ a: [0, base], b: [len, base], t: 0, heavy: true }];
  const inOpening = (s) => open.find((o) => s > o.s[0] - 0.3 && s < o.s[1] + 0.3);
  for (let s = 0; s <= len + 0.01; s += spacing) {
    const o = inOpening(s);
    if (!o) m.push({ a: [s, base], b: [s, top], t: along(s) });
    else {
      if (o.y[0] > base + 0.3) m.push({ a: [s, base], b: [s, o.y[0]], t: along(s) });
      m.push({ a: [s, o.y[1]], b: [s, top], t: along(s) });
    }
  }
  for (const o of open) {
    for (const s of [o.s[0], o.s[1]]) m.push({ a: [s, base], b: [s, top], t: along(s) });
    m.push({ a: [o.s[0], o.y[1]], b: [o.s[1], o.y[1]], t: along(o.s[1]) + 0.04, heavy: true });
    if (o.y[0] > base + 0.3) m.push({ a: [o.s[0], o.y[0]], b: [o.s[1], o.y[0]], t: along(o.s[1]) + 0.04 });
  }
  m.push({ a: [0, top], b: [len, top], t: 0.74, heavy: true });
  return m;
}

// The framing of building `b`'s walls (`walls`: which, far ones fainter),
// raised wall by wall as `k` runs 0-1.
export function framing(b, { walls = ["back", "left", "right", "front"], spacing = 2, base = b.base, top = b.wall } = {}) {
  const all = wallsOf(b).filter((w) => walls.includes(w.id));
  const members = Object.fromEntries(all.map((w) => [w.id, wallMembers(w, base, top, spacing)]));
  return (R, k) => {
    all.forEach((wall, i) => {
      const kw = span(k, i * 0.09, i * 0.09 + 0.62);
      if (kw <= 0) return;
      const far = wall.id === "back" || wall.id === "left" ? 0.5 : 1;
      for (const m of members[wall.id]) {
        const g = ease(span(kw, m.t, m.t + 0.14));
        seg(R, wall.at(...m.a), wall.at(...m.b), (m.heavy ? EDGE : LINE + 0.15) * far, m.heavy ? 2 : 1.2, g);
      }
    });
  };
}

// A window or door in wall `wall`, set as `set` runs 0-1: its rough opening
// (dark glass), then its frame round a pane (the slider's two), or the
// front door. `side`: the tone of the wall it's in.
export function opening(R, wall, o, set, side = "front") {
  const [s0, s1] = o.s;
  const [y0, y1] = o.y;
  const quad = (a0, a1, b0, b1) => [wall.at(a0, b0), wall.at(a1, b0), wall.at(a1, b1), wall.at(a0, b1)];
  face(R, quad(s0, s1, y0, y1), { tone: "glass", edge: LINE });
  fading(R, set, () => {
    if (o.door === "front") {
      face(R, quad(s0, s1, y0, y1), { tone: "door" });
      face(R, quad(s0 + 0.45, s1 - 0.45, y0 + 0.6, y1 - 0.5), { fill: false, edge: LINE });
      return;
    }
    face(R, quad(s0 - 0.15, s1 + 0.15, y0 - (o.door ? 0 : 0.15), y1 + 0.15), { tone: side });
    const trim = 0.3;
    const panes = o.door === "slider" ? 2 : Math.max(1, Math.round((s1 - s0) / 6));
    for (let p = 0; p < panes; p++) {
      const a0 = lerp(s0 + trim, s1 - trim, p / panes) + (p ? trim / 2 : 0);
      const a1 = lerp(s0 + trim, s1 - trim, (p + 1) / panes) - (p < panes - 1 ? trim / 2 : 0);
      face(R, quad(a0, a1, y0 + trim, y1 - trim), { tone: "glass", edge: LINE });
    }
  });
}

// Building `b`'s walls, finished: a box from its floor to its walls' top
// (over `x` if given, for a cutaway), then its front and right walls'
// windows and doors set in turn. `sheathing`: the walls sheathed instead —
// OSB, the sheets' seams across it and its openings rough.
export function walls(b, { x = b.x, sheathing = false, top = b.wall } = {}) {
  const [x0, x1] = x;
  const tone = sheathing ? "osb" : null;
  return (R, k) => {
    box(R, [x0, x1], [b.base, top], b.z, tone ? { top: "top", front: tone, right: tone } : {});
    const sides = wallsOf(b).filter((w) => w.id === "front" || (w.id === "right" && x1 >= b.x[1]));
    if (sheathing) {
      // the sheets: 4 ft wide, 8 tall
      for (const w of sides) {
        const from = w.id === "front" ? x0 - b.x[0] : 0;
        const to = w.id === "front" ? x1 - b.x[0] : w.len;
        for (let s = Math.ceil(from / 4) * 4; s < to; s += 4) if (s > from) seg(R, w.at(s, b.base), w.at(s, top), LINE * 0.8);
        if (top - b.base > 8) seg(R, w.at(from, b.base + 8), w.at(to, b.base + 8), LINE * 0.8);
      }
    }
    let i = 0;
    const count = sides.reduce((n, w) => n + w.open.length, 0) || 1;
    for (const w of sides)
      for (const o of w.open) {
        const along = w.id === "front" ? b.x[0] + (o.s[0] + o.s[1]) / 2 : b.x[1];
        if (along < x0 || along > x1) continue;
        const set = sheathing ? 0 : ease(span(k, 0.3 + (i / count) * 0.5, 0.5 + (i / count) * 0.5));
        opening(R, w, o, set, w.id === "right" ? "right" : "front");
        i++;
      }
  };
}

// A gable roof over building `b`, its ridge across the front (along x):
// the far slope, the gable end, the near slope with a few shingle courses
// laid across it as `k` runs, and the fascia. `x`: only that much of it (a
// cutaway); `rafters`: its bare rafters and ridge board instead, set left
// to right as `k` runs; `pitch`, `over`.
export function gableRoof(b, { x, rafters = false, pitch = 0.6, over = 1.2 } = {}) {
  const [z0, z1] = b.z;
  const zm = (z0 + z1) / 2;
  const ridge = b.wall + pitch * (zm - z0);
  const eave = b.wall - pitch * over;
  const left = x ? x[0] : b.x[0] - over;
  const right = x ? x[1] : b.x[1] + over;
  const gableEnd = !x || x[1] >= b.x[1];
  return (R, k) => {
    if (rafters) {
      seg(R, [left, ridge, zm], [right, ridge, zm], EDGE, 2.2, ease(span(k, 0, 0.3)));
      for (let xx = left; xx <= right + 0.01; xx += 2) {
        const g = ease(span(k, 0.15 + ((xx - left) / (right - left)) * 0.6, 0.3 + ((xx - left) / (right - left)) * 0.6));
        seg(R, [xx, eave, z1 + over], [xx, ridge, zm], LINE * 0.8, 1.2, g);
        seg(R, [xx, eave, z0 - over], [xx, ridge, zm], EDGE, 1.6, g);
      }
      return;
    }
    face(R, [[left, eave, z1 + over], [right, eave, z1 + over], [right, ridge, zm], [left, ridge, zm]], { tone: "front" });
    if (gableEnd) face(R, [[b.x[1], b.wall, z0], [b.x[1], b.wall, z1], [b.x[1], ridge, zm]], { tone: "right" });
    face(R, [[left, eave, z0 - over], [right, eave, z0 - over], [right, ridge, zm], [left, ridge, zm]], { tone: "roof" });
    const laid = ease(span(k, 0.25, 0.85));
    for (let r = 1; r < 6; r++) {
      const t = r / 6;
      seg(R, [left, lerp(eave, ridge, t), lerp(z0 - over, zm, t)], [right, lerp(eave, ridge, t), lerp(z0 - over, zm, t)], LINE, 1, laid);
    }
    const fascia = 0.45;
    face(R, [[left, eave - fascia, z0 - over], [right, eave - fascia, z0 - over], [right, eave, z0 - over], [left, eave, z0 - over]], { tone: "front" });
    if (gableEnd) {
      face(R, [[right, eave - fascia, z0 - over], [right, ridge - fascia, zm], [right, ridge, zm], [right, eave, z0 - over]], { tone: "right" });
      face(R, [[right, ridge - fascia, zm], [right, eave - fascia, z1 + over], [right, eave, z1 + over], [right, ridge, zm]], { tone: "right" });
    }
  };
}
// its dashed outline
export const ghostGable = (b, { pitch = 0.6, over = 1.2 } = {}) => (R) => {
  const [z0, z1] = b.z;
  const zm = (z0 + z1) / 2;
  const ridge = b.wall + pitch * (zm - z0);
  const eave = b.wall - pitch * over;
  const [l, r] = [b.x[0] - over, b.x[1] + over];
  trace(R, [[l, eave, z0 - over], [r, eave, z0 - over], [r, ridge, zm], [l, ridge, zm]]);
  R.ctx.stroke();
  trace(R, [[r, eave, z0 - over], [r, ridge, zm], [r, eave, z1 + over]]);
  R.ctx.stroke();
};

// A slab, its forms going round, then poured back to front as `k` runs.
export function slab([x0, x1], [z0, z1], top) {
  return (R, k) => {
    const { ctx } = R;
    const forms = span(k, 0, 0.25);
    const pour = ease(span(k, 0.12, 0.7));
    if (forms > 0 && pour < 1) {
      ctx.strokeStyle = ink(R, EDGE * forms * (1 - pour));
      ctx.lineWidth = 1.5;
      for (const y of [0, top + 0.1]) {
        trace(R, flat([x0, z0, x1, z1], y));
        ctx.stroke();
      }
    }
    if (pour > 0) {
      const zCut = lerp(z1, z0, pour);
      face(R, [[x1, 0, zCut], [x1, 0, z1], [x1, top, z1], [x1, top, zCut]], { tone: "right" });
      if (pour >= 1) face(R, [[x0, 0, z0], [x1, 0, z0], [x1, top, z0], [x0, top, z0]], { tone: "front" });
      face(R, [[x0, top, zCut], [x1, top, zCut], [x1, top, z1], [x0, top, z1]], { tone: "top" });
    }
  };
}

// A graded pad of ground, cut as a block: `pad` { x, z, t (its depth) }.
export function ground(pad) {
  return (R) => box(R, pad.x, [-pad.t, 0], pad.z);
}

// Stakes at a footprint's corners and the strings run between them.
export function stakes([x0, x1], [z0, z1]) {
  const corners = [[x0, z0], [x1, z0], [x1, z1], [x0, z1]];
  return (R, k) => {
    const lay = span(k, 0.3, 1);
    corners.forEach(([x, z], i) => seg(R, [x, 0, z], [x, 1.5, z], EDGE, 2, ease(span(lay, i * 0.08, i * 0.08 + 0.3))));
    const strings = ease(span(lay, 0.3, 0.85));
    corners.forEach(([x, z], i) => {
      const [nx, nz] = corners[(i + 1) % 4];
      dashed(R, [x, 1.15, z], [nx, 1.15, nz], [5, 4], EDGE * 0.8, 1, strings);
    });
  };
}

// Shrubs, each as a planting plan draws one — a scalloped round with a dot
// in the middle — planted in turn as `k` runs. `at`: [x, z] each.
export function shrubs(at, { size = 1.05, y = 0.7 } = {}) {
  return (R, k) => {
    const { ctx } = R;
    at.forEach(([x, z], i) => {
      const g = ease(span(k, (i / at.length) * 0.6, (i / at.length) * 0.6 + 0.4));
      if (g <= 0) return;
      const r = R.s * size * g;
      const [cx, cy] = put(R, [x, y, z]);
      const bumps = 9;
      ctx.beginPath();
      for (let b = 0; b <= bumps; b++) {
        const t = (b / bumps) * Math.PI * 2;
        const [px, py] = [cx + r * Math.cos(t), cy + r * 0.82 * Math.sin(t)];
        if (!b) ctx.moveTo(px, py);
        else {
          const m = t - Math.PI / bumps;
          ctx.quadraticCurveTo(cx + r * 1.3 * Math.cos(m), cy + r * 1.07 * Math.sin(m), px, py);
        }
      }
      ctx.closePath();
      ctx.fillStyle = fillOf(R, "roof");
      ctx.fill();
      ctx.strokeStyle = ink(R, EDGE);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(0.9, r * 0.12), 0, Math.PI * 2);
      ctx.fillStyle = ink(R, EDGE);
      ctx.fill();
    });
  };
}

// Pavers (or any flat pieces on the ground: [x0, z0, x1, z1] each), laid in
// turn as `k` runs.
export function pavers(rects, { y = 0.06, tone = "roof" } = {}) {
  return (R, k) =>
    rects.forEach((r, i) => fading(R, ease(span(k, (i / rects.length) * 0.7, (i / rects.length) * 0.7 + 0.3)), () => face(R, flat(r, y), { tone, edge: LINE })));
}

// Boxes (cabinets, fixtures, appliances: { x, y, z } each, `basin` for a
// tub's or sink's), set in turn as `k` runs, each rising as it's set.
export function boxes(list) {
  return (R, k) =>
    list.forEach((f, i) => {
      const g = ease(span(k, (i / list.length) * 0.7, (i / list.length) * 0.7 + 0.3));
      fading(R, g, () => {
        const top = lerp(f.y[0], f.y[1], g);
        box(R, f.x, [f.y[0], top], f.z, f.tone ? { top: f.tone } : {});
        if (f.basin && g >= 1) face(R, flat([f.x[0] + 0.35, f.z[0] + 0.35, f.x[1] - 0.35, f.z[1] - 0.35], top + 0.01), { tone: "front", edge: LINE });
        if (f.doors && g >= 1) for (let x = f.x[0] + f.doors; x < f.x[1] - 0.2; x += f.doors) seg(R, [x, f.y[0] + 0.3, f.z[0]], [x, top - 0.35, f.z[0]], LINE);
      });
    });
}

// Runs of line (the rough-in: water, drains, wiring), drawn on in turn as
// `k` runs: { a, b, dash } each; `heavy` for a drain stack.
export function runs(list) {
  return (R, k) =>
    list.forEach(({ a, b, dash, heavy }, i) => {
      const g = ease(span(k, (i / list.length) * 0.6, (i / list.length) * 0.6 + 0.4));
      if (dash) dashed(R, a, b, dash, LINE * 1.3, 1.3, g);
      else seg(R, a, b, heavy ? EDGE : LINE * 1.3, heavy ? Math.max(2, R.s * 0.26) : 1.3, g);
    });
}

// A room's shell, seen from the front right with its front and right walls
// left off: a floor and its back and left walls (`room` { x, z, h, t }).
// `kind`: "studs" (the bare framing and subfloor), "plain" (finished:
// painted walls, the floor `planks` or tiled), "tile" (tiled all over),
// "membrane" (backer board and a waterproof membrane: the sheets' seams).
export function shell(room, { kind = "plain", floor = "plain" } = {}) {
  const [x0, x1] = room.x;
  const [z0, z1] = room.z;
  const t = room.t ?? 0.4;
  const h = room.h;
  return (R, k) => {
    const rise = ease(span(k, 0, 0.6));
    const top = lerp(0.5, h, rise);
    // the floor
    box(R, [x0, x1], [0, 0.5], [z0, z1]);
    if (floor === "planks") for (let z = z0 + 0.75; z < z1; z += 0.75) seg(R, [x0, 0.51, z], [x1, 0.51, z], LINE * 0.5);
    if (floor === "tile" || kind === "tile") {
      for (let x = x0 + 1; x < x1; x += 1) seg(R, [x, 0.51, z0], [x, 0.51, z1], LINE * 0.5);
      for (let z = z0 + 1; z < z1; z += 1) seg(R, [x0, 0.51, z], [x1, 0.51, z], LINE * 0.5);
    }
    if (kind === "studs") {
      // the walls' framing only
      const studs = (at, len) => {
        for (let s = 0; s <= len + 0.01; s += 16 / 12) seg(R, at(s, 0.5), at(s, top), LINE + 0.15, 1.2);
        seg(R, at(0, 0.5), at(len, 0.5), EDGE, 2);
        if (rise >= 1) seg(R, at(0, h), at(len, h), EDGE, 2);
      };
      studs((s, y) => [x0 + t / 2, y, z0 + s], z1 - z0);
      studs((s, y) => [x0 + s, y, z1 - t / 2], x1 - x0);
      return;
    }
    // the walls: their inner faces, the left's then the back's, and their
    // cut tops
    face(R, [[x0 + t, 0.5, z0], [x0 + t, 0.5, z1 - t], [x0 + t, top, z1 - t], [x0 + t, top, z0]], { tone: "right" });
    face(R, [[x0 + t, 0.5, z1 - t], [x1, 0.5, z1 - t], [x1, top, z1 - t], [x0 + t, top, z1 - t]], { tone: "front" });
    face(R, [[x0, top, z0], [x0 + t, top, z0], [x0 + t, top, z1 - t], [x0, top, z1 - t]], { tone: "cut" });
    face(R, [[x0, top, z1 - t], [x1, top, z1 - t], [x1, top, z1], [x0, top, z1]], { tone: "cut" });
    face(R, [[x0, 0, z0], [x0 + t, 0, z0], [x0 + t, top, z0], [x0, top, z0]], { tone: "front" });
    face(R, [[x1, 0, z1 - t], [x1, 0, z1], [x1, top, z1], [x1, top, z1 - t]], { tone: "right" });
    if (kind === "tile") {
      for (let y = 1.5; y < top; y += 1) {
        seg(R, [x0 + t, y, z0], [x0 + t, y, z1 - t], LINE * 0.5);
        seg(R, [x0 + t, y, z1 - t], [x1, y, z1 - t], LINE * 0.5);
      }
      for (let s = z0 + 1; s < z1 - t; s += 1) seg(R, [x0 + t, 0.5, s], [x0 + t, top, s], LINE * 0.5);
      for (let s = x0 + t + 1; s < x1; s += 1) seg(R, [s, 0.5, z1 - t], [s, top, z1 - t], LINE * 0.5);
    }
    if (kind === "membrane") {
      for (let s = z0 + 3; s < z1 - t; s += 3) seg(R, [x0 + t, 0.5, s], [x0 + t, top, s], LINE * 0.8);
      for (let s = x0 + t + 3; s < x1; s += 3) seg(R, [s, 0.5, z1 - t], [s, top, z1 - t], LINE * 0.8);
      seg(R, [x0 + t, 4.5, z0], [x0 + t, 4.5, z1 - t], LINE * 0.8);
      seg(R, [x0 + t, 4.5, z1 - t], [x1, 4.5, z1 - t], LINE * 0.8);
    }
  };
}

// A hip roof over building `b` (its walls' top `b.wall`): the back slope,
// both hips (this low, all four slopes face the camera), the front slope
// with a few courses laid across it and the right hip as `k` runs.
export function hipRoof(b, { pitch = 0.45, over = 1.2 } = {}) {
  const X0 = b.x[0] - over;
  const X1 = b.x[1] + over;
  const Z0 = b.z[0] - over;
  const Z1 = b.z[1] + over;
  const hd = Math.min(X1 - X0, Z1 - Z0) / 2;
  const e = b.wall - pitch * over;
  const top = e + pitch * hd;
  const zm = (Z0 + Z1) / 2;
  return (R, k) => {
    face(R, [[X0, e, Z1], [X1, e, Z1], [X1 - hd, top, zm], [X0 + hd, top, zm]], { tone: "front" });
    face(R, [[X0, e, Z0], [X0, e, Z1], [X0 + hd, top, zm]], { tone: "front" });
    face(R, [[X1, e, Z0], [X1, e, Z1], [X1 - hd, top, zm]], { tone: "right" });
    face(R, [[X0, e, Z0], [X1, e, Z0], [X1 - hd, top, zm], [X0 + hd, top, zm]], { tone: "roof" });
    const laid = ease(span(k, 0.25, 0.85));
    for (let i = 1; i < 6; i++) {
      const t = i / 6;
      const y = lerp(e, top, t);
      seg(R, [X0 + hd * t, y, Z0 + hd * t], [X1 - hd * t, y, Z0 + hd * t], LINE, 1, laid);
      seg(R, [X1 - hd * t, y, Z0 + hd * t], [X1 - hd * t, y, Z1 - hd * t], LINE, 1, laid);
    }
  };
}
export const hipBounds = (b, { pitch = 0.45, over = 1.2 } = {}) => {
  const hd = Math.min(b.x[1] - b.x[0], b.z[1] - b.z[0]) / 2 + over;
  return { x: [b.x[0] - over, b.x[1] + over], y: [b.wall - pitch * over, b.wall - pitch * over + pitch * hd], z: [b.z[0] - over, b.z[1] + over] };
};
// its dashed outline: the eaves, the hips and the ridge
export const ghostHip = (b, { pitch = 0.45, over = 1.2 } = {}) => (R) => {
  const [X0, X1, Z0, Z1] = [b.x[0] - over, b.x[1] + over, b.z[0] - over, b.z[1] + over];
  const hd = Math.min(X1 - X0, Z1 - Z0) / 2;
  const e = b.wall - pitch * over;
  const top = e + pitch * hd;
  const zm = (Z0 + Z1) / 2;
  trace(R, [[X0, e, Z0], [X1, e, Z0], [X1, e, Z1], [X0, e, Z1], [X0, e, Z0]]);
  R.ctx.stroke();
  trace(R, [[X0, e, Z0], [X0 + hd, top, zm], [X1 - hd, top, zm], [X1, e, Z0]]);
  R.ctx.stroke();
  trace(R, [[X0, e, Z1], [X0 + hd, top, zm]]);
  R.ctx.stroke();
  trace(R, [[X1 - hd, top, zm], [X1, e, Z1]]);
  R.ctx.stroke();
};

// A gable roof with its gable to the front (its ridge running back, along
// z): the gable end, the left slope (just showing) and the right one.
export function frontGable(b, { pitch = 0.55, over = 1.2 } = {}) {
  const [x0, x1] = b.x;
  const xm = (x0 + x1) / 2;
  const ridge = b.wall + pitch * (xm - x0);
  const eave = b.wall - pitch * over;
  const [z0, z1] = [b.z[0] - over, b.z[1] + over];
  return (R) => {
    face(R, [[x0 - over, eave, z0], [xm, ridge, z0], [xm, ridge, z1], [x0 - over, eave, z1]], { tone: "front" });
    face(R, [[x0, b.wall, b.z[0]], [x1, b.wall, b.z[0]], [xm, ridge, b.z[0]]], { tone: "front" });
    face(R, [[xm, ridge, z0], [xm, ridge, z1], [x1 + over, eave, z1], [x1 + over, eave, z0]], { tone: "roof" });
  };
}

// A shed roof over `r` ({ x, z }), high at its left (`high`) sloping down to
// its right (`low`), out `over` at its sides and right; standing seams down
// it as `k` runs. `x`: only that much of it (a cutaway); `rafters`: its
// bare rafters instead, on the low wall's plate, set front to back.
export function shedRoof(r, high, low, { over = 1.2, x, rafters = false } = {}) {
  const [x0, x1] = r.x;
  const [z0, z1] = [r.z[0] - over, r.z[1] + over];
  const yAt = (xx) => high - ((high - low) / (x1 - x0)) * (xx - x0);
  const left = x ? x[0] : x0;
  const right = x ? x[1] : x1 + over;
  const end = right >= x1 + over - 0.01;
  return (R, k) => {
    if (rafters) {
      seg(R, [x1, low, r.z[0]], [x1, low, r.z[1]], EDGE, 2.2, ease(span(k, 0, 0.3)));
      for (let z = z0; z <= z1 + 0.01; z += 2) {
        const t = (z - z0) / (z1 - z0);
        seg(R, [left, yAt(left), z], [right, yAt(right), z], z === z0 ? EDGE : LINE + 0.15, 1.4, ease(span(k, 0.15 + t * 0.6, 0.3 + t * 0.6)));
      }
      return;
    }
    face(R, [[left, yAt(left), z0], [right, yAt(right), z0], [right, yAt(right), z1], [left, yAt(left), z1]], { tone: "roof" });
    face(R, [[left, yAt(left) - 0.4, z0], [right, yAt(right) - 0.4, z0], [right, yAt(right), z0], [left, yAt(left), z0]], { tone: "front" });
    if (end) face(R, [[right, yAt(right) - 0.4, z0], [right, yAt(right) - 0.4, z1], [right, yAt(right), z1], [right, yAt(right), z0]], { tone: "right" });
    const laid = ease(span(k, 0.2, 0.9));
    for (let z = z0 + 1.4; z < z1; z += 1.4) seg(R, [left, yAt(left), z], [right, yAt(right), z], LINE * 0.8, 1, laid);
  };
}
