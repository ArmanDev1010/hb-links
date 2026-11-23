// The Deck & Patio page's hero (ServicePage/ServiceHero): a modern
// single-storey house of its own — charcoal walls, a cedar-slat panel, a
// glass slider, a flat roof — and its backyard built as you scroll: the
// deck's footings and posts, beams, joists, composite decking, a cable rail
// and steps; then a paver patio beside it, a steel and cedar pergola over
// it, a fire pit and chairs, string lights, and the lights. `k`: how far
// it's got (0 = the bare yard, 1 = done, lit).
//
// In feet: the house is x 0-42, z 12-32, 11 tall; the deck x 4-22, z 0-12,
// 2.6 up; the patio x 24-40, z -4-11.

import { C, M, block, fillPoly, ghost, glow, groundQuad, lawn, lerp, line, mix, pane, quad, rgba, shadeOf, shadow, shrub, sides, spill, step, stroke, tree, windowLight } from "./kit";

const HOUSE = { x: [0, 42], z: [12, 32] };
const HT = 11;
const { front, right } = sides(HOUSE);
const SLIDER = { s: [6, 20], y: [0.3, 9], panes: 4 };
const FRONT_WINDOW = { s: [36, 40], y: [3, 8.4], panes: 1 };
const SIDE_WINDOW = { s: [5, 12], y: [3, 8.4], panes: 2 };
const SLATS = [25, 33.5];
const DECK = { x: [4, 22], z: [0, 12], top: 2.6 };
const POSTS = [4.6, 10, 15.5, 21.4].flatMap((x) => [0.6, 6, 11.4].map((z) => [x, z]));
const STAIRS = [15, 19];
const PATIO = [24, -4, 40, 11];
const PERGOLA = { posts: [[24.6, -3.4], [39.4, -3.4], [24.6, 10.4], [39.4, 10.4]], top: 9 };
const PIT = { x: 31, z: 3.5, r: 2 };
const CHAIRS = [[27.2, 3.5], [34.8, 3.5], [31, -0.6], [31, 7.6]];

export const DECK_BOUNDS = { x: [-3, 45], y: [0, 13], z: [-8, 34] };

const T = {
  dig: [0.03, 0.08],
  footings: [0.06, 0.16],
  posts: [0.14, 0.22],
  beams: [0.2, 0.3],
  joists: [0.28, 0.4],
  decking: [0.38, 0.52],
  rail: [0.5, 0.58],
  patio: [0.56, 0.7],
  pergola: [0.68, 0.8],
  pit: [0.78, 0.86],
  strings: [0.84, 0.92],
  plants: [0.86, 0.94],
  lights: [0.9, 1],
};

export function drawDeck(G, k) {
  const { ctx, P } = G;
  const lit = step(k, ...T.lights);
  lawn(G, [-6, -10, 46, 34]);
  tree(G, -3, 33, 1.3);
  // the ground dug where the deck and patio go, landscaped again after
  const dug = step(k, ...T.dig) * (1 - step(k, 0.84, 0.92));
  if (dug > 0) fillPoly(ctx, P, groundQuad([3, -5, 41, 12], 0.015), rgba(C.soil, dug));
  patio(G, step(k, ...T.patio));
  const lights = [windowLight(front, SLIDER, [0, -1]), windowLight(right, SIDE_WINDOW, [1, 0])];
  spill(G, [...lights.map((l) => l.pool), [PIT.x, PIT.z, 8, 0.3]], lit);
  shadow(G, HOUSE.x, HOUSE.z, 13);
  // the shrub round the house's front-left corner is behind it: drawn first
  // (11-23: drawn after, it sat on the wall)
  const plant = (i) => step(k, T.plants[0] + i * 0.015, T.plants[0] + 0.05 + i * 0.015);
  shrub(G, -1.4, 14, plant(0));
  house(G, lit);
  deck(G, k);
  firePit(G, step(k, ...T.pit), lit);
  pergola(G, k);
  strings(G, step(k, ...T.strings), lit);
  [[43.5, 16], [43.5, 24], [2.2, -1.2], [23.2, -5.4]].forEach(([x, z], i) => shrub(G, x, z, plant(i + 1)));
  glow(G, [...lights.map((l) => l.spot), [PIT.x, 1.6, PIT.z, 3.4, 0.5]], lit);
}

function house(G, lit) {
  const { ctx, P } = G;
  fillPoly(ctx, P, quad(right, 0, 20, 0, HT), rgba(M.charcoal));
  fillPoly(ctx, P, quad(front, 0, 42, 0, HT), rgba(shadeOf(M.charcoal, -0.12)));
  fillPoly(ctx, P, quad(front, ...SLATS, 0, HT), rgba(shadeOf(M.cedar, -0.1)));
  ctx.beginPath();
  for (let s = SLATS[0] + 0.4; s < SLATS[1]; s += 0.4) line(ctx, P, front(s, 0), front(s, HT));
  stroke(ctx, "rgba(0,0,0,0.22)", 1);
  pane(G, front, SLIDER.s, SLIDER.y, lit, 1, SLIDER.panes);
  pane(G, front, FRONT_WINDOW.s, FRONT_WINDOW.y, lit, 1);
  pane(G, right, SIDE_WINDOW.s, SIDE_WINDOW.y, lit, 1, SIDE_WINDOW.panes);
  // the flat roof, out over the walls
  block(G, [-1.5, 43.5], [HT, HT + 0.9], [10.5, 33.5], [60, 64, 68]);
}

function deck(G, k) {
  const { ctx, P, lw } = G;
  const footings = step(k, ...T.footings);
  POSTS.forEach(([x, z], i) => {
    const g = step(footings, (i / POSTS.length) * 0.6, (i / POSTS.length) * 0.6 + 0.4);
    block(G, [x - 0.6, x + 0.6], [0, 0.4], [z - 0.6, z + 0.6], C.concrete, g);
  });
  const posts = step(k, ...T.posts);
  if (posts > 0) POSTS.forEach(([x, z]) => block(G, [x - 0.25, x + 0.25], [0.4, lerp(0.4, DECK.top - 0.9, posts)], [z - 0.25, z + 0.25], C.wood));
  const beams = step(k, ...T.beams);
  [0.6, 6, 11.4].forEach((z, i) => block(G, [DECK.x[0], DECK.x[1]], [DECK.top - 0.9, DECK.top - 0.4], [z - 0.3, z + 0.3], C.wood, step(beams, i * 0.25, i * 0.25 + 0.5)));
  const joists = step(k, ...T.joists);
  if (joists > 0) {
    ctx.beginPath();
    for (let x = DECK.x[0]; x <= DECK.x[1] + 0.01; x += 4 / 3) line(ctx, P, [x, DECK.top - 0.35, DECK.z[0]], [x, DECK.top - 0.35, DECK.z[1]], step(joists, (x - 4) / 24, (x - 4) / 24 + 0.25));
    stroke(ctx, rgba(C.wood), lw(0.16));
  }
  // the decking, board by board front to back... (laid from the house out)
  const laid = step(k, ...T.decking);
  if (laid > 0) {
    const z0 = lerp(DECK.z[1], DECK.z[0], laid);
    block(G, DECK.x, [DECK.top - 0.3, DECK.top], [z0, DECK.z[1]], C.deck);
    ctx.beginPath();
    for (let z = DECK.z[1] - 0.5; z > z0; z -= 0.5) line(ctx, P, [DECK.x[0], DECK.top + 0.01, z], [DECK.x[1], DECK.top + 0.01, z]);
    stroke(ctx, "rgba(0,0,0,0.16)", 1);
  }
  // the cable rail and the steps down to the yard
  const rail = step(k, ...T.rail);
  if (rail > 0) {
    const postsAt = [[4, 0], [9.5, 0], [STAIRS[0], 0], [STAIRS[1], 0], [22, 0], [22, 4], [22, 8], [22, 12]];
    ctx.beginPath();
    postsAt.forEach(([x, z]) => line(ctx, P, [x, DECK.top, z], [x, DECK.top + 3.2 * rail, z]));
    stroke(ctx, rgba(M.charcoal), lw(0.25, 1.5));
    ctx.beginPath();
    for (const y of [1, 2, 3]) {
      line(ctx, P, [4, DECK.top + y * rail, 0], [STAIRS[0], DECK.top + y * rail, 0]);
      line(ctx, P, [STAIRS[1], DECK.top + y * rail, 0], [22, DECK.top + y * rail, 0]);
      line(ctx, P, [22, DECK.top + y * rail, 0], [22, DECK.top + y * rail, 12]);
    }
    stroke(ctx, rgba([150, 156, 160], rail), 1);
    block(G, STAIRS, [0, 1.75], [-0.9, 0], C.deck, rail);
    block(G, STAIRS, [0, 0.9], [-1.8, -0.9], C.deck, rail);
  }
}

function patio(G, k) {
  if (k <= 0) return;
  const { ctx, P } = G;
  const [x0, z0, x1, z1] = PATIO;
  for (let z = z0, j = 0; z < z1; z += 2.5, j++)
    for (let x = x0, i = 0; x < x1; x += 2.5, i++) {
      const g = step(k, (j / 6) * 0.7, (j / 6) * 0.7 + 0.3);
      if (g <= 0) continue;
      fillPoly(ctx, P, groundQuad([x + 0.07, z + 0.07, Math.min(x1, x + 2.5) - 0.07, Math.min(z1, z + 2.5) - 0.07], 0.05), rgba(mix(C.path, [0, 0, 0], (i + j) % 3 ? 0 : 0.07), g));
    }
}

function pergola(G, k) {
  const g = step(k, ...T.pergola);
  if (g <= 0) return;
  const { top } = PERGOLA;
  PERGOLA.posts.forEach(([x, z], i) => block(G, [x - 0.3, x + 0.3], [0, lerp(0, top, step(g, i * 0.1, i * 0.1 + 0.4))], [z - 0.3, z + 0.3], M.charcoal));
  [-3.4, 10.4].forEach((z, i) => block(G, [23.8, 40.2], [top, top + 0.6], [z - 0.25, z + 0.25], M.charcoal, step(g, 0.45 + i * 0.1, 0.65 + i * 0.1)));
  for (let x = 24.4, i = 0; x <= 39.7; x += 1.2, i++) block(G, [x - 0.12, x + 0.12], [top + 0.6, top + 0.95], [-4.2, 11.2], M.cedar, step(g, 0.65 + i * 0.02, 0.75 + i * 0.02));
}

function firePit(G, k, lit) {
  if (k <= 0) return;
  const { ctx, P } = G;
  const ring = Array.from({ length: 20 }, (_, i) => {
    const a = (i / 20) * Math.PI * 2;
    return [PIT.x + Math.cos(a) * PIT.r, PIT.z + Math.sin(a) * PIT.r];
  });
  for (const y of [0, 1.2 * k]) {
    ctx.beginPath();
    ring.forEach(([x, z], i) => {
      const [px, py] = P(x, y, z);
      if (i) ctx.lineTo(px, py);
      else ctx.moveTo(px, py);
    });
    ctx.closePath();
    ctx.fillStyle = rgba(y ? [150, 146, 140] : [110, 106, 100]);
    ctx.fill();
  }
  if (lit > 0) groundGlowPit(G, lit);
  CHAIRS.forEach(([x, z]) => block(G, [x - 0.9, x + 0.9], [0, 1.4], [z - 0.9, z + 0.9], M.walnut, k));
}
function groundGlowPit(G, lit) {
  const { ctx, P, s } = G;
  const [cx, cy] = P(PIT.x, 1.25, PIT.z);
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, PIT.r * s * 0.9);
  g.addColorStop(0, rgba([255, 170, 80], 0.9 * lit));
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(cx, cy, PIT.r * s * 0.9, PIT.r * s * 0.45, 0, 0, Math.PI * 2);
  ctx.fill();
}

// string lights sagging across the pergola, a bulb every foot or so
function strings(G, k, lit) {
  if (k <= 0) return;
  const { ctx, P, s } = G;
  [-1, 3.5, 8].forEach((z, i) => {
    const g = step(k, i * 0.2, i * 0.2 + 0.6);
    if (g <= 0) return;
    const sag = (t) => PERGOLA.top - 0.1 - 1.1 * (1 - (2 * t - 1) ** 2);
    ctx.beginPath();
    for (let t = 0; t <= g + 1e-6; t += 0.05) {
      const [px, py] = P(lerp(24.6, 39.4, t), sag(t), z);
      if (t) ctx.lineTo(px, py);
      else ctx.moveTo(px, py);
    }
    stroke(ctx, "rgba(20,20,20,0.9)", 1);
    for (let t = 0.06; t < g; t += 0.08) {
      const [px, py] = P(lerp(24.6, 39.4, t), sag(t) - 0.3, z);
      ctx.beginPath();
      ctx.arc(px, py, Math.max(1.2, s * 0.13), 0, Math.PI * 2);
      ctx.fillStyle = rgba(mix([230, 226, 214], C.warm, lit));
      ctx.fill();
    }
  });
}

// before it's begun: the deck, its rail, the patio and the pergola, dashed
export function ghostDeck(G, a) {
  const r = (x0, x1, z0, z1, y) => [[[x0, y, z0], [x1, y, z0]], [[x1, y, z0], [x1, y, z1]], [[x1, y, z1], [x0, y, z1]], [[x0, y, z1], [x0, y, z0]]];
  ghost(G, [
    ...r(DECK.x[0], DECK.x[1], DECK.z[0], DECK.z[1], DECK.top),
    ...r(PATIO[0], PATIO[2], PATIO[1], PATIO[3], 0.05),
    ...PERGOLA.posts.map(([x, z]) => [[x, 0, z], [x, PERGOLA.top, z]]),
    ...r(23.8, 40.2, -3.4, 10.4, PERGOLA.top),
  ], a);
}
