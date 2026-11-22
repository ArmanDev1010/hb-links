// The Home Remodel page's hero (ServicePage/ServiceHero): a single-storey
// ranch house of its own — blue-grey board and batten, white trim, a low
// hip roof — remodeled as you scroll. Its roof lifts away and the walls
// facing the camera come down to waist height; the old carpet and kitchen
// come out; new oak floors go down (tile in the bathroom) and the walls are
// painted; then a navy kitchen with an island and pendants, a bathroom with
// a freestanding tub and a double vanity, the living room and the bedroom
// furnished; and the lights come on. `k`: how far it's got (0 = the house
// as it stands, 1 = done, lit).
//
// In feet: the house is 40 wide (x) by 26 deep (z), its floor 1.5 up over a
// crawlspace, its walls 10 tall; the camera looks at its front (z = 0) and
// right side (x = 40).

import { C, M, block, fillPoly, ghost, glow, groundQuad, hipRoof, lawn, lerp, line, mix, pane, quad, rgba, shadeOf, shadow, shrub, sides, step, stroke, tileGrid, tree } from "./kit";

const B = { x: [0, 40], z: [0, 26] };
const F = 1.5;
const H = 10;
const CUT = F + 3;
const LEFT = 0.5;
const BACK = 25.5;
const { front, right } = sides(B);
const FRONT_WINDOWS = [
  { s: [3, 8], y: [F + 2.4, F + 6.4], panes: 2 },
  { s: [10.5, 16.5], y: [F + 1.6, F + 6.6], panes: 3 },
  { s: [27, 33], y: [F + 2.4, F + 6.4], panes: 2 },
];
const FRONT_DOOR = { s: [20, 23], y: [F, F + 7.2] };
const RIGHT_WINDOWS = [{ s: [4, 9], y: [F + 2.4, F + 6.4] }, { s: [16, 19], y: [F + 3.6, F + 6] }];

export const REMODEL_BOUNDS = { x: [-3, 44], y: [0, 16], z: [-5, 29] };

const T = {
  lift: [0, 0.1],
  lower: [0.03, 0.12],
  demo: [0.12, 0.2],
  floors: [0.18, 0.32],
  paint: [0.28, 0.36],
  kitchen: [0.36, 0.54],
  bath: [0.52, 0.7],
  rooms: [0.66, 0.8],
  lights: [0.88, 1],
};

export function drawRemodel(G, k) {
  const { ctx, P } = G;
  const lift = step(k, ...T.lift);
  const low = step(k, ...T.lower);
  const lit = step(k, ...T.lights);
  lawn(G, [-6, -8, 46, 32]);
  tree(G, -3.5, 27, 1.2);
  fillPoly(ctx, P, groundQuad([19.5, -8, 23.5, 0], 0.03), rgba(C.path));
  shadow(G, B.x, B.z, 15, 1 - lift);
  if (lift > 0 || low > 0) interior(G, k, lit);
  // the walls facing the camera, cut down while it's open
  const top = lerp(H, CUT, low);
  const siding = M.slateBlue;
  fillPoly(ctx, P, quad(front, 0, 40, 0, top), rgba(shadeOf(siding, -0.1)));
  fillPoly(ctx, P, quad(right, 0, 26, 0, top), rgba(siding));
  fillPoly(ctx, P, quad(front, 0, 40, 0, F), rgba(shadeOf(C.concrete, -0.4)));
  fillPoly(ctx, P, quad(right, 0, 26, 0, F), rgba(shadeOf(C.concrete, -0.3)));
  ctx.beginPath();
  for (let s = 1.5; s < 40; s += 1.5) line(ctx, P, front(s, F), front(s, top));
  for (let s = 1.5; s < 26; s += 1.5) line(ctx, P, right(s, F), right(s, top));
  stroke(ctx, "rgba(0,0,0,0.14)", 1);
  if (low > 0) {
    fillPoly(ctx, P, groundQuad([0, 0, 40, 0.5], top), rgba(M.section));
    fillPoly(ctx, P, groundQuad([39.5, 0, 40, 26], top), rgba(M.section));
  }
  for (const [at, w] of [...FRONT_WINDOWS.map((w) => [front, w]), ...RIGHT_WINDOWS.map((w) => [right, w])]) {
    const y1 = Math.min(w.y[1], top - 0.2);
    if (y1 > w.y[0] + 0.4) pane(G, at, w.s, [w.y[0], y1], lit * (1 - low), 1, w.panes ?? 1);
  }
  const doorTop = Math.min(FRONT_DOOR.y[1], top - 0.1);
  fillPoly(ctx, P, quad(front, FRONT_DOOR.s[0], FRONT_DOOR.s[1], FRONT_DOOR.y[0], doorTop), rgba(M.navy));
  [[2, -1.2], [9, -1.2], [36.5, -1.2], [41.5, 6], [41.5, 18]].forEach(([x, z]) => shrub(G, x, z, 1, 1));
  hipRoof(G, B, H, { pitch: 0.4, color: C.roof, lift: lift * 14, a: 1 - lift });
  glow(G, [[9, F + 7, 7, 8, 0.2], [10, F + 7, 19, 8, 0.2], [29, F + 7, 6, 7, 0.18], [33, F + 7, 19, 6, 0.18], ...[7, 9.6, 12.2].map((x) => [x, F + 6, 17.8, 2.2, 0.35])], lit);
}

// Inside, while it's open: the floors, the back and left walls' inside
// faces, the partitions cut down, and what's in each room.
function interior(G, k, lit) {
  const { ctx, P } = G;
  const demo = step(k, ...T.demo);
  const laid = step(k, ...T.floors);
  // the floor: the old carpet, then oak (tile in the bathroom), back to
  // front
  fillPoly(ctx, P, groundQuad([LEFT, LEFT, 39.5, BACK], F), rgba(mix([150, 136, 118], [110, 94, 76], demo)));
  if (laid > 0) {
    const z0 = lerp(BACK, LEFT, laid);
    fillPoly(ctx, P, groundQuad([LEFT, z0, 39.5, BACK], F + 0.01), rgba([198, 160, 112]));
    ctx.beginPath();
    for (let z = BACK - 0.7; z > z0; z -= 0.7) line(ctx, P, [LEFT, F + 0.02, z], [26, F + 0.02, z]);
    stroke(ctx, "rgba(0,0,0,0.1)", 1);
    const bz0 = Math.max(12.5, z0);
    if (bz0 < BACK) {
      const pts = [[26.5, F + 0.02, bz0], [39.5, F + 0.02, bz0], [39.5, F + 0.02, BACK], [26.5, F + 0.02, BACK]];
      fillPoly(ctx, P, pts, rgba(C.tile));
      tileGrid(G, pts, 13, Math.max(1, Math.round(BACK - bz0)));
    }
  }
  // the back and left walls' inside faces, old beige then painted
  const wall = mix([206, 192, 166], M.paint, step(k, ...T.paint));
  fillPoly(ctx, P, [[LEFT, F, 0], [LEFT, F, BACK], [LEFT, H, BACK], [LEFT, H, 0]], rgba(shadeOf(wall, -0.06)));
  fillPoly(ctx, P, [[LEFT, F, BACK], [39.5, F, BACK], [39.5, H, BACK], [LEFT, H, BACK]], rgba(shadeOf(wall, -0.14)));
  // the old kitchen, on its way out
  if (demo < 1) {
    ctx.save();
    ctx.globalAlpha = 1 - demo;
    block(G, [1, 15], [F, F + 2.8], [23.4, BACK], M.oak);
    block(G, [1, 15], [F + 2.8, F + 3], [23.2, BACK], [214, 200, 170]);
    ctx.restore();
  }
  // the partitions, cut down
  for (const [x0, x1, z0, z1] of [[26, 26.5, 17, BACK], [18, 21, 12.5, 13], [24, 39.5, 12.5, 13], [18, 18.5, LEFT, 8]]) {
    fillPoly(ctx, P, [[x0, F, z0], [x1, F, z0], [x1, CUT, z0], [x0, CUT, z0]], rgba(shadeOf(wall, -0.16)));
    fillPoly(ctx, P, [[x1, F, z0], [x1, F, z1], [x1, CUT, z1], [x1, CUT, z0]], rgba(wall));
    fillPoly(ctx, P, groundQuad([x0, z0, x1, z1], CUT), rgba(M.section));
  }
  kitchen(G, k, lit);
  bathroom(G, k);
  rooms(G, step(k, ...T.rooms));
}

// the kitchen, back to front: the fridge, the navy base cabinets and
// uppers, the counters, the island and its pendants
function kitchen(G, k, lit) {
  const { ctx, P } = G;
  const [a, b] = T.kitchen;
  block(G, [15.2, 18], [F, F + 7], [23.2, BACK], C.steel, step(k, a, a + 0.04));
  for (let i = 0; i < 7; i++) block(G, [1 + i * 2, 3.02 + i * 2], [F, F + 2.8], [23.4, BACK], M.navy, 1, step(k, a + i * 0.01, a + 0.03 + i * 0.01));
  [[1, 5], [9, 15]].forEach(([x0, x1], i) => block(G, [x0, x1], [F + 4.6, F + 7.2], [24.2, BACK], M.navy, step(k, a + 0.06 + i * 0.02, a + 0.09 + i * 0.02)));
  block(G, [0.9, 15.1], [F + 2.8, F + 3.02], [23.2, BACK], M.porcelain, step(k, a + 0.1, a + 0.13));
  block(G, [5, 13], [F, F + 2.8], [16.4, 18.6], M.navy, 1, step(k, a + 0.1, a + 0.14));
  block(G, [4.8, 13.2], [F + 2.8, F + 3.05], [16.2, 18.8], M.porcelain, step(k, a + 0.13, a + 0.16));
  const pendants = step(k, b - 0.04, b);
  if (pendants > 0)
    [7, 9.6, 12.2].forEach((x) => {
      fillPoly(ctx, P, [[x - 0.25, F + 6.4, 17.5], [x + 0.25, F + 6.4, 17.5], [x + 0.6, F + 5.8, 17.5], [x - 0.6, F + 5.8, 17.5]], rgba(C.trim, pendants));
      if (lit > 0) fillPoly(ctx, P, groundQuad([x - 0.55, 17.3, x + 0.55, 17.7], F + 5.8), rgba(C.warm, lit));
    });
}
// the bathroom: a double vanity, a freestanding tub, the toilet
function bathroom(G, k) {
  const { ctx, P } = G;
  const [a] = T.bath;
  block(G, [27.2, 32.8], [F, F + 2.8], [23.6, BACK], M.walnut, step(k, a, a + 0.05));
  block(G, [27, 33], [F + 2.8, F + 3], [23.4, BACK], M.porcelain, step(k, a + 0.03, a + 0.07));
  const tub = step(k, a + 0.06, a + 0.12);
  block(G, [33.6, 39], [F, F + 2], [20.5, 24.6], M.porcelain, tub);
  if (tub > 0) fillPoly(ctx, P, groundQuad([34.1, 21, 38.5, 24.1], F + 2.01), rgba([176, 196, 204], tub));
  block(G, [27.4, 28.6], [F, F + 1.6], [14.2, 15.8], M.porcelain, step(k, a + 0.1, a + 0.15));
}
// the living room (a sofa, a rug, a table) and the bedroom (a bed, a rug)
function rooms(G, a) {
  if (a <= 0) return;
  const { ctx, P } = G;
  fillPoly(ctx, P, groundQuad([4, 3, 14, 10], F + 0.03), rgba([182, 170, 150], a));
  block(G, [3, 4.8], [F, F + 2.6], [3, 11], M.charcoal, a);
  block(G, [3, 12], [F, F + 2.6], [9.6, 11.4], M.charcoal, a);
  block(G, [7, 11], [F, F + 1.4], [5, 7.4], M.walnut, a);
  fillPoly(ctx, P, groundQuad([22, 2, 35, 10.5], F + 0.03), rgba([170, 160, 146], a));
  block(G, [24, 33], [F, F + 2.2], [4, 11.6], [232, 230, 224], a);
  block(G, [24, 33], [F, F + 4.4], [11.6, 12.3], M.walnut, a);
}

// before it's begun: the new kitchen and bathroom, seen through the roof
// like a floor plan
export function ghostRemodel(G, a) {
  const r = (x0, x1, z0, z1, y) => [[[x0, y, z0], [x1, y, z0]], [[x1, y, z0], [x1, y, z1]], [[x1, y, z1], [x0, y, z1]], [[x0, y, z1], [x0, y, z0]]];
  ghost(G, [...r(1, 15, 23.4, BACK, H + 6), ...r(5, 13, 16.4, 18.6, H + 6), ...r(27.2, 32.8, 23.6, BACK, H + 6), ...r(33.6, 39, 20.5, 24.6, H + 6)], a);
}
