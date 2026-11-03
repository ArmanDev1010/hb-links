// The neighbourhood around the homepage hero's property (see scene.js): the
// street in front with its sidewalks and street lights, the neighbours'
// houses (darker, their windows lit), and what moves about it all —
// `drawLife`, drawn every frame over the scene by the clock rather than the
// scroll: cars driving by with their headlights on, the crew at work on
// whichever service is being built, and dust drifting in the light.
//
// In feet, in the property's frame (the house at 0, 0; the street runs along x
// in front of it, z -20 and nearer the camera). `G` is { ctx, P, s, lw }.

import { clamp, lerp, ease, span, mix, rgba, C, path, fillPoly, line, groundQuad, groundGlow, rng, block, tree, house } from "./kit";

// ---- the street ------------------------------------------------------------
// It runs a stretch along the front of the property and fades out at both
// ends into the dark, like the edge of a model — starting right of the hero's
// copy, so nothing drives behind the text.
const STREET = { x0: 0, x1: 160, fade: 26 };
const edge = (x) => clamp((x - STREET.x0) / STREET.fade) * clamp((STREET.x1 - x) / STREET.fade);
const CONCRETE = [74, 76, 74]; // at dusk
const VERGE = [30, 62, 40];
const ASPHALT = [26, 28, 30];
const LANES = [-32.5, -42.5]; // the near-house lane, the far one
const LIGHTS = [58, 112]; // the street lights, along the near sidewalk (clear of the deck)

// A strip along the street, its ends fading out.
function strip(G, z0, z1, color, y = 0.02) {
  const { ctx, P } = G;
  path(ctx, P, groundQuad([STREET.x0, z0, STREET.x1, z1], y));
  const zm = (z0 + z1) / 2;
  const [ax, ay] = P(STREET.x0, y, zm);
  const [bx, by] = P(STREET.x1, y, zm);
  const g = ctx.createLinearGradient(ax, ay, bx, by);
  const f = STREET.fade / (STREET.x1 - STREET.x0);
  g.addColorStop(0, rgba(color, 0));
  g.addColorStop(f, rgba(color));
  g.addColorStop(1 - f, rgba(color));
  g.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = g;
  ctx.fill();
}

// The ground around the property, drawn before anything stands on it: the
// neighbours' lawns, the sidewalks, verges and street with its centre line,
// and the street lights' pools of light.
export function drawGround(G) {
  const { ctx, P } = G;
  for (const h of NEIGHBOURS) fillPoly(ctx, P, groundQuad(h.lawn, 0.01), rgba(mix(C.lawn, C.bg, 0.7)));
  strip(G, -24.5, -20.6, CONCRETE);
  strip(G, -27, -24.5, VERGE);
  strip(G, -48, -27, ASPHALT);
  strip(G, -50.5, -48, VERGE);
  strip(G, -54.5, -50.5, CONCRETE);
  // the sidewalks' joints, and the dashes down the middle
  for (let x = STREET.x0; x < STREET.x1; x += 6) {
    const a = edge(x);
    if (a <= 0) continue;
    ctx.beginPath();
    line(ctx, P, [x, 0.03, -24.5], [x, 0.03, -20.6]);
    line(ctx, P, [x, 0.03, -54.5], [x, 0.03, -50.5]);
    ctx.strokeStyle = rgba([0, 0, 0], 0.3 * a);
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  for (let x = STREET.x0; x < STREET.x1; x += 30) {
    const a = edge(x + 5);
    if (a > 0) fillPoly(ctx, P, groundQuad([x, -37.75, x + 10, -37.25], 0.03), rgba([196, 170, 96], 0.6 * a));
  }
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const x of LIGHTS) groundGlow(ctx, P, x, -30, 15, rgba(C.warm, 0.2 * edge(x)));
  ctx.restore();
}

// The street lights: a pole on the verge, an arm out over the street, the
// lamp and its glow. They stand in front of everything but the cars.
export function drawStreetLights(G) {
  const { ctx, P, s, lw } = G;
  for (const x of LIGHTS) {
    const a = edge(x);
    if (a <= 0) continue;
    block(G, [x - 0.25, x + 0.25], [0, 14], [-26.05, -25.55], [44, 46, 48], a);
    ctx.beginPath();
    line(ctx, P, [x, 13.8, -25.8], [x, 13.8, -30.2]);
    ctx.strokeStyle = rgba([44, 46, 48], a);
    ctx.lineWidth = lw(0.25);
    ctx.stroke();
    block(G, [x - 0.55, x + 0.55], [13.2, 13.8], [-31, -29.8], [70, 72, 74], a);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const [cx, cy] = P(x, 13.1, -30.4);
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, s * 3.4);
    g.addColorStop(0, rgba([255, 226, 170], 0.7 * a));
    g.addColorStop(0.2, rgba(C.warm, 0.3 * a));
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, s * 3.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// ---- the neighbours --------------------------------------------------------
// Houses on the lots around: behind the ADU and two on the right (none to the
// left, where they'd sit behind the captions). Darker than the property,
// their windows lit.
const NEIGHBOURS = [
  { x0: 4, x1: 40, z0: 84, z1: 108, color: C.stucco, lawn: [-4, 74, 50, 116], trees: [[46, 92, 1.1]] },
  { x0: 60, x1: 90, z0: 42, z1: 66, along: "z", color: C.sand, lawn: [56, 34, 102, 76], trees: [[96, 46, 1.1]] },
  { x0: 68, x1: 102, z0: 2, z1: 26, color: C.stucco, lawn: [62, -20, 112, 34], trees: [[108, 10, 1.2], [64, -15, 0.9]] },
].map((h) => {
  const w = h.x1 - h.x0, d = h.z1 - h.z0;
  return {
    ...h,
    color: mix(h.color, C.bg, 0.68),
    roof: mix(C.roof, C.bg, 0.45),
    doorColor: [20, 21, 22],
    windows: [
      ...[0.14, 0.42, 0.7].map((f, i) => ({ face: "front", s: [h.x0 + w * f, h.x0 + w * f + 4], y: [3, 7], panes: i === 1 ? 2 : 1 })),
      { face: "front", s: [h.x0 + w * 0.86 - 1.5, h.x0 + w * 0.86 + 1.5], y: [0.3, 7.2], door: true },
      { face: "right", s: [h.z0 + d * 0.25, h.z0 + d * 0.25 + 4], y: [3, 7] },
      { face: "right", s: [h.z0 + d * 0.6, h.z0 + d * 0.6 + 4], y: [3, 7] },
    ],
  };
});
// ... each as something to draw in among the property, far to near: `e` is
// what it takes up
export const NEIGHBOUR_PARTS = NEIGHBOURS.map((h) => ({
  e: { x: [Math.min(h.x0, ...h.trees.map((t) => t[0])) - 5, Math.max(h.x1, ...h.trees.map((t) => t[0])) + 5], y: [0, 17], z: [Math.min(h.z0, ...h.trees.map((t) => t[1])) - 5, Math.max(h.z1, ...h.trees.map((t) => t[1])) + 5] },
  draw: (G) => {
    // the trees behind the house, the house, the trees in front of it
    const behind = ([x, z]) => z - x * 0.7 > (h.z0 + h.z1) / 2 - ((h.x0 + h.x1) / 2) * 0.7;
    for (const t of h.trees) if (behind(t)) tree(G, t[0], t[1], t[2], 0.6);
    house(G, h, 0.6);
    for (const t of h.trees) if (!behind(t)) tree(G, t[0], t[1], t[2], 0.6);
  },
}));

// ---- life ------------------------------------------------------------------
// Drawn every frame over the scene: `frame` is what drawScene returned (its
// projection, what's in view, how far each service has got, where the copy
// is), `time` seconds.
export function drawLife(ctx, { P, s, lw, focus, done, t, lit, copy }, time) {
  const G = { ctx, P, s, lw };
  // what moves fades out as it nears the copy, so nothing passes behind the text
  const clear = ([x, y]) => clamp(Math.hypot(Math.max(copy.x0 - x, 0, x - copy.x1), Math.max(copy.y0 - y, 0, y - copy.y1)) / 70);
  cars(G, time, clear);
  crew(G, done, time, clear);
  dust(ctx, P, focus, t * 6 + time * 0.5, t * 5 + time * 0.7, lit);
}

// Cars along the street, each going round again after LOOP ft, faded in and
// out at the street's ends; the far lane first.
const LOOP = 260;
const CARS = [
  { lane: LANES[0], dir: 1, speed: 23, phase: 0, color: [222, 224, 226] },
  { lane: LANES[0], dir: 1, speed: 23, phase: 0.6, color: [58, 78, 102] },
  { lane: LANES[1], dir: -1, speed: 19, phase: 0.35, color: [128, 34, 38] },
];
function cars(G, time, clear) {
  for (const car of CARS) {
    const run = (car.phase * LOOP + car.speed * time) % LOOP;
    const x = car.dir > 0 ? STREET.x0 - 30 + run : STREET.x1 + 30 - run;
    const a = edge(x) * clear(G.P(x, 2, car.lane));
    if (a > 0) drawCar(G, x, car, a);
  }
}

// A car: its shadow, its headlights' beams on the road ahead, its wheels on
// the near side, body and cabin, and its lamps (head or tail) on the side the
// camera sees.
function drawCar(G, x, { lane, dir, color }, a) {
  const { ctx, P, s } = G;
  const x0 = x - 7.5, x1 = x + 7.5, z0 = lane - 3.1, z1 = lane + 3.1;
  fillPoly(ctx, P, groundQuad([x0 - 0.6, z0 - 0.4, x1 + 0.6, z1 + 0.8], 0.04), `rgba(0,0,0,${0.4 * a})`);
  const front = dir > 0 ? x1 : x0;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  path(ctx, P, [[front, 0.05, lane - 2.4], [front + dir * 30, 0.05, lane - 6.5], [front + dir * 30, 0.05, lane + 6.5], [front, 0.05, lane + 2.4]]);
  const [bx0, by0] = P(front, 0, lane);
  const [bx1, by1] = P(front + dir * 30, 0, lane);
  const beam = ctx.createLinearGradient(bx0, by0, bx1, by1);
  beam.addColorStop(0, `rgba(255,236,190,${0.3 * a})`);
  beam.addColorStop(1, "rgba(255,236,190,0)");
  ctx.fillStyle = beam;
  ctx.fill();
  ctx.restore();
  for (const wx of [x0 + 3, x1 - 3]) {
    const [cx, cy] = P(wx, 0.9, z0);
    ctx.fillStyle = rgba([16, 16, 17], a);
    ctx.beginPath();
    ctx.ellipse(cx, cy, s * 1.05, s * 0.95, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  block(G, [x0, x1], [0.9, 3.7], [z0, z1], color, a);
  const c0 = x - 3.6 - dir * 0.6, c1 = x + 3.2 - dir * 0.6;
  block(G, [c0, c1], [3.7, 5.5], [z0 + 0.5, z1 - 0.5], [40, 52, 62], a);
  block(G, [c0 + 0.3, c1 - 0.3], [5.5, 5.7], [z0 + 0.7, z1 - 0.7], color, a);
  // the camera sees the car's right side (x1): its headlamps when it's
  // coming this way, its tail lights when it's going away
  const lamp = dir > 0 ? [255, 240, 210] : [230, 40, 40];
  for (const zz of [lane - 2.2, lane + 2.2]) {
    const [cx, cy] = P(x1 + 0.02, 2.9, zz);
    ctx.fillStyle = rgba(lamp, a);
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(1.2, s * 0.3), 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, s * 1.8);
    g.addColorStop(0, rgba(lamp, (dir > 0 ? 0.55 : 0.4) * a));
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, s * 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// The crew: two on each service while it's built (inside the house while its
// roof is off), walking up and down in front of the work or standing at it,
// placed where nothing stands between them and the camera. `y` is the floor
// they're on; one with no `b` stands and works.
const CREW = [
  [{ a: [10, 41], b: [22, 41] }, { a: [38.5, 47.5], b: [38.5, 59] }],
  [{ a: [15, 9], b: [21, 9], y: 2 }, { a: [16.5, 19.2], y: 2 }],
  [{ a: [38, 0.6], b: [48, 0.6] }, { a: [52.6, 6], b: [52.6, 17] }],
  [{ a: [5.5, -14.6], b: [12.3, -14.6] }, { a: [34.5, -16.2], b: [40, -16.2] }],
];
// while each service's crew is there, in its progress
const ON_SITE = [[0.04, 0.96], [0.14, 0.86], [0.04, 0.96], [0.04, 0.96]];
function crew(G, done, time, clear) {
  done.forEach((k, i) => {
    const [k0, k1] = ON_SITE[i];
    const a = Math.min(span(k, k0, k0 + 0.03), 1 - span(k, k1 - 0.03, k1));
    if (a <= 0) return;
    CREW[i].forEach((m, j) => {
      const y = m.y ?? 0;
      if (!m.b) {
        worker(G, [m.a[0], y, m.a[1]], 0, a * clear(G.P(m.a[0], y + 3, m.a[1])), time + j * 1.3, true);
        return;
      }
      const len = Math.hypot(m.b[0] - m.a[0], m.b[1] - m.a[1]);
      const u = ((time * 3.2) / len + j * 0.37) % 2; // 3.2 ft a second, there and back
      const f = u < 1 ? u : 2 - u;
      const at = [lerp(m.a[0], m.b[0], f), y, lerp(m.a[1], m.b[1], f)];
      worker(G, at, time * 7 + j, a * clear(G.P(at[0], y + 3, at[2])), time, false);
    });
  });
}

// A worker, about 6 ft tall: a shadow, dark work pants and sleeves, a green
// hi-vis vest, a white hard hat. `walk` swings the legs and arms; one who's
// `working` stands, lifting and dropping a hammer.
function worker(G, [x, y, z], walk, a, time, working) {
  if (a <= 0) return;
  const { ctx, P, s } = G;
  const [fx, fy] = P(x, y, z);
  const up = fy - P(x, y + 1, z)[1]; // px per foot upward
  const hip = fy - 2.9 * up, shoulder = fy - 4.6 * up, head = fy - 5.3 * up;
  const swing = working ? 0 : Math.sin(walk) * 0.5 * s;
  const bob = working ? 0 : Math.abs(Math.cos(walk)) * 0.12 * up;
  const width = Math.max(1.4, s * 0.38);
  ctx.save();
  ctx.globalAlpha = a;
  ctx.lineCap = "round";
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath();
  ctx.ellipse(fx, fy, s * 0.85, s * 0.36, 0, 0, Math.PI * 2);
  ctx.fill();
  const dark = rgba([40, 44, 52]);
  ctx.strokeStyle = dark;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(fx - s * 0.15, hip - bob);
  ctx.lineTo(fx + swing - s * 0.15, fy - 0.1 * up);
  ctx.moveTo(fx + s * 0.15, hip - bob);
  ctx.lineTo(fx - swing + s * 0.15, fy - 0.1 * up);
  ctx.stroke();
  // arms: swinging as they walk, or one raising a hammer
  ctx.lineWidth = width * 0.8;
  ctx.beginPath();
  ctx.moveTo(fx - s * 0.5, shoulder + 0.3 * up - bob);
  ctx.lineTo(fx - s * 0.55 - swing * 0.7, hip + 0.3 * up - bob);
  if (working) {
    const lift = ease(Math.abs(Math.sin(time * 3)));
    const hx = fx + s * 0.9, hy = shoulder + lerp(1.2, -0.6, lift) * up;
    ctx.moveTo(fx + s * 0.5, shoulder + 0.3 * up);
    ctx.lineTo(hx, hy);
    ctx.stroke();
    ctx.strokeStyle = rgba([150, 110, 70]);
    ctx.lineWidth = Math.max(1, s * 0.16);
    ctx.beginPath();
    ctx.moveTo(hx, hy);
    ctx.lineTo(hx + s * 0.35, hy - 0.5 * up);
    ctx.stroke();
  } else {
    ctx.moveTo(fx + s * 0.5, shoulder + 0.3 * up - bob);
    ctx.lineTo(fx + s * 0.55 + swing * 0.7, hip + 0.3 * up - bob);
    ctx.stroke();
  }
  // the vest, with its reflective stripe
  const vx = fx - s * 0.55, vy = shoulder - bob, vw = s * 1.1, vh = hip - shoulder + 0.25 * up;
  ctx.fillStyle = rgba([84, 206, 126]);
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(vx, vy, vw, vh, s * 0.25);
  else ctx.rect(vx, vy, vw, vh);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.fillRect(vx, vy + vh * 0.55, vw, Math.max(1, vh * 0.1));
  // head and hard hat
  const hy = head - bob;
  ctx.fillStyle = rgba([200, 158, 120]);
  ctx.beginPath();
  ctx.arc(fx, hy, s * 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = rgba(C.white);
  ctx.beginPath();
  ctx.arc(fx, hy - s * 0.1, s * 0.46, Math.PI, 0);
  ctx.fill();
  ctx.fillRect(fx - s * 0.58, hy - s * 0.12, s * 1.16, Math.max(1, s * 0.12));
  ctx.restore();
}

// Dust drifting in the light over what's in view: `rise` lifts it (each mote
// at its own speed), `sway` rocks it side to side.
const DUST = (() => {
  const r = rng(11);
  return Array.from({ length: 70 }, () => ({ x: lerp(-23, 23, r()), y: lerp(0.5, 19, r()), z: lerp(-19, 19, r()), size: lerp(0.6, 1.8, r()), phase: r() * Math.PI * 2, speed: lerp(0.5, 1.4, r()) }));
})();
export function dust(ctx, P, [fx, fz], rise, sway, lit) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const d of DUST) {
    const y = ((d.y + rise * d.speed) % 19) + 0.5;
    const x = fx + d.x + Math.sin(d.phase + sway) * 1.2;
    const [sx, sy] = P(x, y, fz + d.z);
    const fade = Math.sin(((y - 0.5) / 19) * Math.PI);
    ctx.fillStyle = rgba(mix([150, 210, 170], C.warm, lit), 0.22 * fade);
    ctx.beginPath();
    ctx.arc(sx, sy, d.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
