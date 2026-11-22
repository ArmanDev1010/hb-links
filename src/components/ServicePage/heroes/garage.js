// The Garage Conversion page's hero (ServicePage/ServiceHero): a detached
// Spanish-style garage — sand stucco, a red clay tile hip roof, a two-car
// roll-up door, a driveway — turned into a studio as you scroll. The door
// rolls up and is gone, the driveway's broken out, the opening's framed in,
// sheathed and stuccoed to match, a window and French doors go in between
// two sconces, then a paver patio with planters, the lawn, and the lights.
// `k`: how far it's got (0 = the garage as it stands, 1 = done, lit).
//
// In feet: the garage is 24 wide (x) by 22 deep (z), its slab's top 0.5
// up, its walls 9.5 tall; the camera looks at its front (z = 0) and right
// side (x = 24).

import { C, M, block, fillPoly, frameRun, ghost, glow, groundQuad, hipRoof, lawn, line, mix, pane, quad, rgba, shadeOf, shadow, shrub, sides, skin, spill, step, stroke, tree, windowLight, span } from "./kit";

const B = { x: [0, 24], z: [0, 22] };
const SLAB = 0.5;
const WALL = 9.5;
const { front, right } = sides(B);
const OPENING = { s: [3, 19], y: [SLAB, 8] };
// the infill wall in the old door's opening, laid out along its own length
const infill = (s, y) => front(OPENING.s[0] + s, y);
const NEW = [
  { s: [1.2, 7.8], y: [3, 7.4], panes: 2, when: [0.58, 0.63] },
  { s: [9.6, 14.8], y: [SLAB, 7.6], panes: 2, when: [0.6, 0.66] },
];
const SIDE_WINDOW = { s: [4, 9], y: [3.6, 6.6] };
const SIDE_DOOR = { s: [14.5, 17.5], y: [SLAB, 7.3] };
const DRIVE = [2.5, -14, 19.5, -0.05];
const PATIO = [2, -9.5, 22, -0.3];
const SCONCES = [[3 + 9.1, 6.4], [3 + 15.3, 6.4]];

export const GARAGE_BOUNDS = { x: [-5, 30], y: [0, 14], z: [-14, 24] };

const T = {
  roll: [0.05, 0.17],
  drive: [0.15, 0.27],
  frame: [0.22, 0.36],
  sheath: [0.34, 0.46],
  stucco: [0.44, 0.56],
  sconces: [0.62, 0.66],
  patio: [0.62, 0.74],
  lawn: [0.68, 0.8],
  planters: [0.72, 0.8],
  plants: [0.78, 0.88],
  lights: [0.9, 1],
};

export function drawGarage(G, k) {
  const { ctx, P } = G;
  const lit = step(k, ...T.lights);
  const sand = M.sand;

  lawn(G, [-8, -18, 34, 30]);
  tree(G, -7, 27, 1);
  // the driveway, broken out to soil, then the patio and the lawn over it
  const broken = step(k, ...T.drive);
  fillPoly(ctx, P, groundQuad(DRIVE, 0.015), rgba(mix(C.concrete, C.soil, broken)));
  lawn(G, [DRIVE[0], DRIVE[1], DRIVE[2], PATIO[1]], step(k, ...T.lawn));
  pavers(G, step(k, ...T.patio));
  const lights = [...NEW.map((w) => windowLight(infill, w, [0, -1])), windowLight(right, SIDE_WINDOW, [1, 0])];
  spill(G, lights.map((l) => l.pool), lit);
  shadow(G, B.x, B.z, 15);

  // the right side: stucco, its window and door
  fillPoly(ctx, P, quad(right, 0, 22, 0, WALL), rgba(sand));
  fillPoly(ctx, P, quad(right, 0, 22, 0, SLAB), rgba(shadeOf(C.concrete, -0.35)));
  pane(G, right, SIDE_WINDOW.s, SIDE_WINDOW.y, lit, 1);
  fillPoly(ctx, P, quad(right, ...SIDE_DOOR.s, ...SIDE_DOOR.y), rgba(M.walnut));
  // the front: stucco round the opening
  const shade = shadeOf(sand, -0.1);
  fillPoly(ctx, P, quad(front, 0, OPENING.s[0], 0, WALL), rgba(shade));
  fillPoly(ctx, P, quad(front, OPENING.s[1], 24, 0, WALL), rgba(shade));
  fillPoly(ctx, P, quad(front, OPENING.s[0], OPENING.s[1], OPENING.y[1], WALL), rgba(shade));
  fillPoly(ctx, P, quad(front, 0, 24, 0, SLAB), rgba(shadeOf(C.concrete, -0.25)));
  // the opening: dark inside, the door rolling up out of it, the infill
  const len = OPENING.s[1] - OPENING.s[0];
  fillPoly(ctx, P, quad(front, ...OPENING.s, ...OPENING.y), rgba(M.dark));
  door(G, step(k, ...T.roll));
  frameRun(G, infill, len, NEW, span(k, ...T.frame), SLAB, OPENING.y[1]);
  skin(G, infill, len, OPENING.y, {
    sheath: span(k, ...T.sheath),
    finish: span(k, ...T.stucco),
    color: sand,
    shade: 0.1,
    opens: NEW,
    k,
    lit,
  });
  // the sconces either side of the French doors
  const sconce = step(k, ...T.sconces);
  if (sconce > 0)
    SCONCES.forEach(([x, y]) => {
      block(G, [x - 0.25, x + 0.25], [y - 0.5, y + 0.5], [-0.35, 0], C.trim, sconce);
      if (lit > 0) fillPoly(ctx, P, quad(front, x - 0.15, x + 0.15, y - 0.35, y + 0.35).map(([px, py]) => [px, py, -0.36]), rgba(C.warm, lit)); // (the lamp's face, just proud of the wall)
    });
  hipRoof(G, B, WALL, { pitch: 0.45, color: M.terracotta, ribs: true });
  planters(G, step(k, ...T.planters), span(k, ...T.plants));
  glow(G, [...lights.map((l) => l.spot), ...SCONCES.map(([x, y]) => [x, y, -0.4, 2.2, 0.35])], lit);
}

// The roll-up door: its four panels rising into the opening as `k` runs.
function door(G, k) {
  if (k >= 1) return;
  const { ctx, P } = G;
  const [s0, s1] = OPENING.s;
  const [y0, y1] = OPENING.y;
  const bottom = y0 + (y1 - y0) * k;
  fillPoly(ctx, P, quad(front, s0 + 0.1, s1 - 0.1, bottom, y1), rgba([226, 222, 212]));
  ctx.beginPath();
  for (let i = 1; i < 4; i++) {
    const y = y0 + ((y1 - y0) * i) / 4;
    if (y > bottom) line(ctx, P, front(s0 + 0.1, y), front(s1 - 0.1, y));
  }
  stroke(ctx, "rgba(0,0,0,0.25)", 1);
}

// The patio: pavers laid over the old driveway, front to back.
function pavers(G, k) {
  if (k <= 0) return;
  const { ctx, P } = G;
  const [x0, z0, x1, z1] = PATIO;
  for (let z = z0, j = 0; z < z1; z += 2, j++)
    for (let x = x0, i = 0; x < x1; x += 2, i++) {
      const g = step(k, (j / 5) * 0.7, (j / 5) * 0.7 + 0.3);
      if (g <= 0) continue;
      const off = j % 2 ? 1 : 0;
      fillPoly(ctx, P, groundQuad([Math.max(x0, x + off - 1) + 0.06, z + 0.06, Math.min(x1, x + off + 1) - 0.06, Math.min(z1, z + 2) - 0.06], 0.05), rgba(mix(C.path, [0, 0, 0], (i + j) % 3 ? 0 : 0.06), g));
    }
}

// Two planters at the patio's front corners, and what's planted in them.
function planters(G, k, plants) {
  [[2, 4.4], [19.6, 22]].forEach(([x0, x1], i) => {
    block(G, [x0, x1], [0, 1.6], [-9.5, -7.4], M.charcoal, k);
    shrub(G, (x0 + x1) / 2, -8.4, step(plants, i * 0.3, i * 0.3 + 0.6), 1.1);
  });
}

// before it's begun: the new window and doors, and the patio, dashed
export function ghostGarage(G, a) {
  const at = infill;
  const rect = ({ s, y }) => {
    const [p, q, r, t] = quad(at, s[0], s[1], y[0], y[1]);
    return [[p, q], [q, r], [r, t], [t, p]];
  };
  const [x0, z0, x1, z1] = PATIO;
  ghost(G, [...NEW.flatMap(rect), [[x0, 0.05, z0], [x1, 0.05, z0]], [[x1, 0.05, z0], [x1, 0.05, z1]], [[x0, 0.05, z0], [x0, 0.05, z1]]], a);
}
