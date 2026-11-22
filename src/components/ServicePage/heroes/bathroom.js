// The Bathroom Remodel page's hero (ServicePage/ServiceHero): one bathroom,
// a room on its own — no house round it, no kitchen next door — seen from
// the front right with its near walls left off, remodeled as you scroll.
// The old pink-tiled bathroom comes out down to the studs; the supply lines,
// drains, valve, fan and wiring are run; backer board goes up and the
// shower's waterproofed; the shower walls and the floor are tiled, the rest
// painted; then the glass, the rain head, a floating vanity, the mirror and
// the toilet; then the sconces, and the lights come on. `k`: how far it's
// got (0 = the old bathroom, 1 = done, lit).
//
// In feet: the room is 12 wide (x) by 9 deep (z), its floor 0.5 up, its back
// (z = 9) and left (x = 0) walls 9 tall; the shower's in the back left
// corner.

import { C, M, block, fillPoly, ghost, glow, groundQuad, lerp, line, mix, rgba, run, shadeOf, shadow, span, step, stroke, tileGrid } from "./kit";

const F = 0.5;
const H = 9;
const W = 12;
const D = 9;
const SHOWER = { x: [0, 5], z: [4, 9], top: 7.6 };

export const BATHROOM_BOUNDS = { x: [-1, 13], y: [0, 10], z: [-1, 10] };

const T = {
  demo: [0.05, 0.13],
  rough: [0.13, 0.25],
  board: [0.24, 0.33],
  membrane: [0.31, 0.38],
  tile: [0.38, 0.54],
  paint: [0.46, 0.54],
  glass: [0.54, 0.6],
  vanity: [0.58, 0.66],
  mirror: [0.64, 0.7],
  toilet: [0.66, 0.72],
  sconces: [0.72, 0.8],
  lights: [0.88, 1],
};

// the two walls' inner faces, `y0`-`y1` up, `x`/`z` along them
const left = (z0, z1, y0, y1) => [[0.02, y0, z0], [0.02, y0, z1], [0.02, y1, z1], [0.02, y1, z0]];
const backQ = (x0, x1, y0, y1) => [[x0, y0, D - 0.02], [x1, y0, D - 0.02], [x1, y1, D - 0.02], [x0, y1, D - 0.02]];

export function drawBathroom(G, k) {
  const { ctx, P } = G;
  const lit = step(k, ...T.lights);
  const old = 1 - step(k, ...T.demo);
  shadow(G, [0, W], [0, D], 4, 0.6);
  block(G, [-0.5, W], [0, F], [0, D + 0.5], shadeOf(C.concrete, -0.2));
  // the floor: the old vinyl, the subfloor, then the new tile, back to front
  fillPoly(ctx, P, groundQuad([0, 0, W, D], F + 0.005), rgba(mix(M.plywood, [214, 200, 170], old)));
  const tiled = step(k, ...T.tile);
  if (tiled > 0) {
    const z0 = lerp(D, 0, tiled);
    const pts = [[0, F + 0.01, z0], [W, F + 0.01, z0], [W, F + 0.01, D], [0, F + 0.01, D]];
    fillPoly(ctx, P, pts, rgba([88, 92, 96]));
    tileGrid(G, pts, W, Math.max(1, Math.round(D - z0)));
  }
  // the walls: bare studs once the old's gone, backer board, the shower's
  // membrane, then tile in the shower and paint the rest
  const studs = mix([226, 214, 196], [92, 74, 56], step(k, ...T.demo));
  fillPoly(ctx, P, left(0, D, F, H), rgba(shadeOf(studs, -0.04)));
  fillPoly(ctx, P, backQ(0, W, F, H), rgba(shadeOf(studs, -0.12)));
  if (k >= T.demo[0] && k < T.board[1]) {
    ctx.beginPath();
    for (let s = 0.2; s < D; s += 16 / 12) line(ctx, P, [0.03, F, s], [0.03, H, s]);
    for (let s = 0.2; s < W; s += 16 / 12) line(ctx, P, [s, F, D - 0.03], [s, H, D - 0.03]);
    stroke(ctx, rgba(C.wood, step(k, ...T.demo)), 1.6);
  }
  const board = span(k, ...T.board);
  if (board > 0) {
    for (let i = 0; i < 3; i++) {
      const g = step(board, i / 3, (i + 1) / 3);
      fillPoly(ctx, P, left(i * 3, i * 3 + 3.02, F, H), rgba(shadeOf(M.board, -0.04), g));
    }
    for (let i = 0; i < 4; i++) {
      const g = step(board, i / 4, (i + 1) / 4);
      fillPoly(ctx, P, backQ(i * 3, i * 3 + 3.02, F, H), rgba(shadeOf(M.board, -0.12), g));
    }
  }
  const membrane = step(k, ...T.membrane);
  if (membrane > 0) {
    fillPoly(ctx, P, left(SHOWER.z[0], D, F, SHOWER.top), rgba(M.membrane, membrane * (1 - tiled)));
    fillPoly(ctx, P, backQ(0, SHOWER.x[1], F, SHOWER.top), rgba(shadeOf(M.membrane, -0.1), membrane * (1 - tiled)));
    fillPoly(ctx, P, groundQuad([0, SHOWER.z[0], SHOWER.x[1], D], F + 0.02), rgba(M.membrane, membrane * (1 - tiled)));
  }
  if (tiled > 0) {
    const wallTile = [236, 238, 236];
    fillPoly(ctx, P, left(SHOWER.z[0], D, F, SHOWER.top), rgba(shadeOf(wallTile, -0.04), tiled));
    fillPoly(ctx, P, backQ(0, SHOWER.x[1], F, SHOWER.top), rgba(shadeOf(wallTile, -0.12), tiled));
    tileGrid(G, left(SHOWER.z[0], D, F, SHOWER.top), 5, 7, tiled);
    tileGrid(G, backQ(0, SHOWER.x[1], F, SHOWER.top), 5, 7, tiled);
  }
  const paint = step(k, ...T.paint);
  if (paint > 0) {
    fillPoly(ctx, P, left(0, SHOWER.z[0], F, H), rgba(shadeOf(M.paint, -0.04), paint));
    fillPoly(ctx, P, left(SHOWER.z[0], D, SHOWER.top, H), rgba(shadeOf(M.paint, -0.04), paint));
    fillPoly(ctx, P, backQ(SHOWER.x[1], W, F, H), rgba(shadeOf(M.paint, -0.12), paint));
    fillPoly(ctx, P, backQ(0, SHOWER.x[1], SHOWER.top, H), rgba(shadeOf(M.paint, -0.12), paint));
  }
  // the walls' cut tops and ends
  fillPoly(ctx, P, groundQuad([-0.5, 0, 0, D + 0.5], H), rgba(M.section));
  fillPoly(ctx, P, groundQuad([0, D, W, D + 0.5], H), rgba(M.section));
  fillPoly(ctx, P, [[-0.5, 0, 0], [0, 0, 0], [0, H, 0], [-0.5, H, 0]], rgba(shadeOf(M.drywall, -0.25)));
  fillPoly(ctx, P, [[W, 0, D], [W, 0, D + 0.5], [W, H, D + 0.5], [W, H, D]], rgba(shadeOf(M.drywall, -0.2)));
  // the rough-in, until the walls close over it
  const rough = span(k, ...T.rough);
  const roughA = 1 - step(k, 0.3, 0.36);
  if (rough > 0 && roughA > 0) {
    ctx.save();
    ctx.globalAlpha = roughA;
    run(G, [[0.05, F, 6.4], [0.05, 4, 6.4], [0.05, 7.4, 6.4]], span(rough, 0, 0.35), M.copper, 2);
    run(G, [[8.6, F, D - 0.05], [8.6, 2.4, D - 0.05]], span(rough, 0.15, 0.45), M.copper, 2);
    run(G, [[11.2, F, D - 0.05], [11.2, 2, D - 0.05]], span(rough, 0.25, 0.55), [120, 124, 128], 3);
    run(G, [[5.5, H - 0.3, D - 0.05], [11.8, H - 0.3, D - 0.05]], span(rough, 0.4, 0.7), [150, 154, 158], 4);
    run(G, [[5.6, 6.6, D - 0.05], [11.6, 6.6, D - 0.05]], span(rough, 0.55, 1), M.wire, 1.2);
    ctx.restore();
  }
  // the old bathroom, on its way out
  if (old > 0) {
    ctx.save();
    ctx.globalAlpha = old;
    fillPoly(ctx, P, backQ(0, W, F, 4.5), rgba([214, 172, 170]));
    fillPoly(ctx, P, left(0, D, F, 4.5), rgba([222, 182, 180]));
    block(G, [0.3, 5.3], [F, 2.1], [6.6, D], [230, 220, 196]);
    block(G, [7.4, 10], [F, 3], [7.4, D], M.oak);
    block(G, [10.6, 11.8], [F, 1.7], [7.4, 8.6], [230, 220, 196]);
    ctx.restore();
  }
  fixtures(G, k, lit);
  glow(G, [[6.5, 5.4, D - 0.3, 2, 0.4], [10.6, 5.4, D - 0.3, 2, 0.4], [2.5, 4.5, 6.5, 4, 0.16]], lit);
}

// the shower's glass and rain head, the floating vanity, the mirror, the
// toilet and the sconces
function fixtures(G, k, lit) {
  const { ctx, P } = G;
  const glass = step(k, ...T.glass);
  if (glass > 0) {
    const pts = [[SHOWER.x[1], F, SHOWER.z[0]], [SHOWER.x[1], F, D], [SHOWER.x[1], 7.4, D], [SHOWER.x[1], 7.4, SHOWER.z[0]]];
    fillPoly(ctx, P, pts, rgba([196, 222, 230], 0.22 * glass));
    ctx.beginPath();
    pts.forEach((p, i) => line(ctx, P, p, pts[(i + 1) % 4]));
    stroke(ctx, rgba([220, 236, 240], 0.7 * glass), 1);
    block(G, [2.1, 2.9], [7.9, 8.05], [6.1, 6.9], C.steel, glass);
    ctx.beginPath();
    line(ctx, P, [2.5, 8.05, 6.5], [2.5, 8.05, D - 0.05]);
    stroke(ctx, rgba(C.steel, glass), 1.6);
  }
  const vanity = step(k, ...T.vanity);
  block(G, [6.4, 10.6], [1.6, 3.1], [7.6, D], M.walnut, vanity);
  block(G, [6.3, 10.7], [3.1, 3.3], [7.5, D], M.porcelain, vanity);
  if (vanity > 0) fillPoly(ctx, P, groundQuad([7.6, 7.9, 9.4, 8.8], 3.31), rgba([196, 204, 206], vanity));
  const mirror = step(k, ...T.mirror);
  if (mirror > 0) {
    const pts = backQ(7, 10, 4, 6.9).map(([x, y]) => [x, y, D - 0.04]);
    fillPoly(ctx, P, backQ(6.85, 10.15, 3.85, 7.05).map(([x, y]) => [x, y, D - 0.03]), rgba(C.trim, mirror));
    const [gx0, gy0] = P(...pts[0]);
    const [gx1, gy1] = P(...pts[2]);
    const g = ctx.createLinearGradient(gx0, gy0, gx1, gy1);
    g.addColorStop(0, rgba([120, 140, 148], mirror));
    g.addColorStop(1, rgba([196, 212, 216], mirror));
    fillPoly(ctx, P, pts, g);
  }
  const toilet = step(k, ...T.toilet);
  block(G, [10.9, 11.9], [F, 2.6], [8.3, D], M.porcelain, toilet);
  block(G, [10.9, 11.9], [F, 1.6], [6.8, 8.3], M.porcelain, toilet);
  const sconces = step(k, ...T.sconces);
  if (sconces > 0)
    [6.5, 10.5].forEach((x) => {
      block(G, [x - 0.2, x + 0.2], [4.8, 6], [D - 0.35, D], mix(C.trim, C.warm, lit), sconces);
    });
}

// before it's begun: the new bathroom's layout, dashed — the shower, the
// vanity and the toilet
export function ghostBathroom(G, a) {
  const r = (x0, x1, z0, z1, y) => [[[x0, y, z0], [x1, y, z0]], [[x1, y, z0], [x1, y, z1]], [[x1, y, z1], [x0, y, z1]], [[x0, y, z1], [x0, y, z0]]];
  ghost(G, [...r(0, SHOWER.x[1], SHOWER.z[0], D, F + 0.05), [[SHOWER.x[1], F, SHOWER.z[0]], [SHOWER.x[1], 7.4, SHOWER.z[0]]], ...r(6.4, 10.6, 7.6, D, 3.3), ...r(10.9, 11.9, 6.8, D, 1.6)], a);
}
