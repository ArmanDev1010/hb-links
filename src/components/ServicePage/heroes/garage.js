// The Garage Conversion page's hero (ServicePage/ServiceHero): a detached
// Spanish-style garage — sand stucco, a red clay tile hip roof, a two-car
// roll-up door, a driveway — turned into a studio as you scroll. The door
// rolls up onto the garage as it stands (the car in it, a bare concrete
// floor, bare stud walls, shelving and a workbench); the car backs out and
// drives off and the garage is emptied; the driveway's broken out; the opening's framed in, sheathed and stuccoed to match, and a
// window and French doors go in between two sconces. Then the roof and the
// walls turn see-through and the studio's built inside: the bathroom's
// walls framed, the wiring and pipes run, insulation, drywall and paint, an
// oak floor (tile in the bathroom), a kitchenette, the bathroom's shower,
// toilet and vanity, a bed, a sofa and a rug, its lights on. The roof and
// walls go solid again, and a paver patio with planters, the lawn and the
// lights finish it. `k`: how far it's got (0 = the garage as it stands,
// 1 = done, lit).
//
// (11-23, the user: "at a point the roof becomes transparent and you see
// the interior being built", and the opening was "just black" once the door
// had gone.)
//
// In feet: the garage is 24 wide (x) by 22 deep (z), its slab's top 0.5
// up, its walls 9.5 tall; the camera looks at its front (z = 0) and right
// side (x = 24).

import { C, M, block, fillPoly, frameRun, ghost, glow, groundQuad, hipGhost, hipRoof, lawn, line, mix, pane, quad, rgba, run, shadeOf, shadow, shrub, sides, skin, spill, step, stroke, tileGrid, tree, windowLight, span } from "./kit";

const B = { x: [0, 24], z: [0, 22] };
const SLAB = 0.5;
const WALL = 9.5;
const ROOF = { pitch: 0.45 };
const { front, right } = sides(B);
const OPENING = { s: [3, 19], y: [SLAB, 8] };
// the infill wall in the old door's opening, laid out along its own length
const infill = (s, y) => front(OPENING.s[0] + s, y);
const NEW = [
  { s: [1.2, 7.8], y: [3, 7.4], panes: 2, when: [0.37, 0.41] },
  { s: [9.6, 14.8], y: [SLAB, 7.6], panes: 2, when: [0.38, 0.43] },
];
const SIDE_WINDOW = { s: [4, 9], y: [3.6, 6.6] };
const SIDE_DOOR = { s: [14.5, 17.5], y: [SLAB, 7.3] };
const DRIVE = [2.5, -14, 19.5, -0.05];
const PATIO = [2, -9.5, 22, -0.3];
const SCONCES = [[3 + 9.1, 6.4], [3 + 15.3, 6.4]];

// Inside: the walls' inside faces the camera sees (the back's and the
// left's), each laid out along its own length.
const IN = { x0: 0.5, x1: 23.5, z0: 0.5, z1: 21.5 };
const inBack = (s, y) => [IN.x0 + s, y, IN.z1];
const inLeft = (s, y) => [IN.x0, y, IN.z0 + s];
const OLD_WALL = [140, 132, 118]; // the garage's bare walls
const INSULATION = [226, 188, 126];
// the bathroom in the back left corner: its two walls, the right one with
// its door
const BATH = { x: [IN.x0, 7], z: [14.5, IN.z1] };
const bathFront = (s, y) => [IN.x0 + s, y, BATH.z[0]];
const bathSide = (s, y) => [BATH.x[1], y, BATH.z[0] + s];
const BATH_DOOR = { s: [0.8, 3.3], y: [SLAB, 7.4] };

export const GARAGE_BOUNDS = { x: [-5, 30], y: [0, 14], z: [-14, 24] };

const T = {
  roll: [0.03, 0.1],
  car: [0.1, 0.2],
  clear: [0.17, 0.23],
  drive: [0.2, 0.28],
  frame: [0.22, 0.31],
  sheath: [0.29, 0.37],
  stucco: [0.33, 0.41],
  sconces: [0.42, 0.45],
  see: [0.43, 0.49],
  rough: [0.47, 0.55],
  insulation: [0.52, 0.57],
  drywall: [0.56, 0.62],
  paint: [0.6, 0.64],
  floor: [0.62, 0.68],
  kitchen: [0.66, 0.73],
  bath: [0.69, 0.75],
  furnish: [0.73, 0.8],
  inside: [0.78, 0.8],
  solid: [0.8, 0.86],
  patio: [0.82, 0.9],
  lawn: [0.85, 0.92],
  planters: [0.87, 0.92],
  plants: [0.9, 0.95],
  lights: [0.92, 1],
};

export function drawGarage(G, k) {
  const { ctx, P } = G;
  const lit = step(k, ...T.lights);
  // how see-through the roof and the walls facing the camera are
  const see = step(k, ...T.see) * (1 - step(k, ...T.solid));

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

  // inside first: through the open door, and through the walls while
  // they're see-through
  interior(G, k);
  // the walls facing the camera, faded while it's see-through
  seeThrough(G, 1 - 0.87 * see, (W) => walls(W, k, lit));
  // the car again, where it's out of the door: in front of the wall
  car(G, k, true);
  if (see > 0) edges(G, see);
  // the roof: faded to its dashed outline while it's see-through
  hipRoof(G, B, WALL, { ...ROOF, color: M.terracotta, ribs: true, a: 1 - 0.94 * see });
  ghost(G, hipGhost(B, WALL, ROOF), see);
  planters(G, step(k, ...T.planters), span(k, ...T.plants));
  // the studio's lights, seen while it's see-through
  const inside = step(k, ...T.inside) * see;
  glow(G, [[12.5, 8.4, 19.5, 6, 0.3], [4, 8.4, 8, 5.5, 0.22], [18.5, 8.4, 7.5, 5.5, 0.22]], inside);
  glow(G, [...lights.map((l) => l.spot), ...SCONCES.map(([x, y]) => [x, y, -0.4, 2.2, 0.35])], lit);
}

// The walls facing the camera: the right side's stucco, window and door;
// the front's stucco round the opening, the door rolling up out of it, the
// infill framed, sheathed and stuccoed, its window and French doors, and
// the sconces either side of them.
function walls(G, k, lit) {
  const { ctx, P } = G;
  const sand = M.sand;
  fillPoly(ctx, P, quad(right, 0, 22, 0, WALL), rgba(sand));
  fillPoly(ctx, P, quad(right, 0, 22, 0, SLAB), rgba(shadeOf(C.concrete, -0.35)));
  pane(G, right, SIDE_WINDOW.s, SIDE_WINDOW.y, lit, 1);
  fillPoly(ctx, P, quad(right, ...SIDE_DOOR.s, ...SIDE_DOOR.y), rgba(M.walnut));
  const shade = shadeOf(sand, -0.1);
  fillPoly(ctx, P, quad(front, 0, OPENING.s[0], 0, WALL), rgba(shade));
  fillPoly(ctx, P, quad(front, OPENING.s[1], 24, 0, WALL), rgba(shade));
  fillPoly(ctx, P, quad(front, OPENING.s[0], OPENING.s[1], OPENING.y[1], WALL), rgba(shade));
  fillPoly(ctx, P, quad(front, 0, 24, 0, SLAB), rgba(shadeOf(C.concrete, -0.25)));
  const len = OPENING.s[1] - OPENING.s[0];
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
  const sconce = step(k, ...T.sconces);
  if (sconce > 0)
    SCONCES.forEach(([x, y]) => {
      block(G, [x - 0.25, x + 0.25], [y - 0.5, y + 0.5], [-0.35, 0], C.trim, sconce);
      if (lit > 0) fillPoly(ctx, P, quad(front, x - 0.15, x + 0.15, y - 0.35, y + 0.35).map(([px, py]) => [px, py, -0.36]), rgba(C.warm, lit)); // (the lamp's face, just proud of the wall)
    });
}

// The walls' outlines while they're see-through, so it still reads as the
// building.
function edges(G, a) {
  const { ctx, P, lw } = G;
  ctx.beginPath();
  for (const [p, q] of [
    [front(0, 0), front(24, 0)], [front(0, WALL), front(24, WALL)], [front(0, 0), front(0, WALL)],
    [right(0, 0), right(0, WALL)], [right(0, WALL), right(22, WALL)], [right(0, 0), right(22, 0)], [right(22, 0), right(22, WALL)],
  ])
    line(ctx, P, p, q);
  stroke(ctx, rgba(M.paint, 0.5 * a), lw(0.12, 1));
}

// Draws `draw(G)` at `a` opacity as one layer (on a canvas of its own), so
// where its pieces overlap doesn't show through.
let LAYER = null;
function seeThrough(G, a, draw) {
  if (a >= 0.999) return draw(G);
  const { ctx } = G;
  const { width, height } = ctx.canvas;
  LAYER ??= document.createElement("canvas");
  if (LAYER.width !== width || LAYER.height !== height) {
    LAYER.width = width;
    LAYER.height = height;
  }
  const layer = LAYER.getContext("2d");
  layer.setTransform(1, 0, 0, 1, 0, 0);
  layer.clearRect(0, 0, width, height);
  layer.setTransform(ctx.getTransform());
  draw({ ...G, ctx: layer });
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = a;
  ctx.drawImage(LAYER, 0, 0);
  ctx.restore();
}

// ---- inside -------------------------------------------------------------------

// The inside, back to front: the floor, the back and left walls' inside
// faces with what's run along them, the old garage's things on their way
// out, the bathroom, the kitchenette, the bed, the rug, table and sofa.
function interior(G, k) {
  const { ctx, P } = G;
  const rough = span(k, ...T.rough);
  const insulation = span(k, ...T.insulation);
  const drywall = span(k, ...T.drywall);
  const paint = step(k, ...T.paint);
  // the floor: the garage's concrete, then oak laid back to front (tile in
  // the bathroom)
  fillPoly(ctx, P, groundQuad([IN.x0, IN.z0, IN.x1, IN.z1], SLAB), rgba(shadeOf(C.concrete, -0.48)));
  const laid = step(k, ...T.floor);
  if (laid > 0) {
    const z0 = IN.z1 - (IN.z1 - IN.z0) * laid;
    fillPoly(ctx, P, groundQuad([BATH.x[1], z0, IN.x1, IN.z1], SLAB + 0.01), rgba(M.oak));
    if (z0 < BATH.z[0]) fillPoly(ctx, P, groundQuad([IN.x0, z0, BATH.x[1], BATH.z[0]], SLAB + 0.01), rgba(M.oak));
    ctx.beginPath();
    for (let z = IN.z1 - 0.6; z > z0; z -= 0.6) line(ctx, P, [z > BATH.z[0] ? BATH.x[1] : IN.x0, SLAB + 0.02, z], [IN.x1, SLAB + 0.02, z]);
    stroke(ctx, "rgba(0,0,0,0.1)", 1);
    const tz = Math.max(BATH.z[0], z0);
    if (tz < IN.z1) {
      const pts = [[IN.x0, SLAB + 0.02, tz], [BATH.x[1], SLAB + 0.02, tz], [BATH.x[1], SLAB + 0.02, IN.z1], [IN.x0, SLAB + 0.02, IN.z1]];
      fillPoly(ctx, P, pts, rgba(C.tile));
      tileGrid(G, pts, 7, Math.max(1, Math.round(IN.z1 - tz)));
    }
  }
  // the inside faces: bare studs, insulation, drywall, paint
  lining(G, inLeft, IN.z1 - IN.z0, { insulation, drywall, paint, shade: 0.06 });
  lining(G, inBack, IN.x1 - IN.x0, { insulation, drywall, paint, shade: 0.14 });
  // the wiring and the water, run along them, covered by the drywall
  if (rough > 0 && drywall < 1) {
    ctx.save();
    ctx.globalAlpha = 1 - step(drywall, 0, 0.5);
    run(G, [[0.6, 1.6, 2], [0.6, 1.6, 21.4], [23.4, 1.6, 21.4]], span(rough, 0.2, 0.8), M.wire);
    run(G, [[12.5, 1.6, 21.4], [12.5, 9, 21.4]], span(rough, 0.6, 1), M.wire);
    run(G, [[3, 0.9, 21.4], [12, 0.9, 21.4], [12, 2.6, 21.4]], span(rough, 0.3, 0.9), M.copper, 2);
    ctx.restore();
  }
  oldGarage(G, 1 - step(k, ...T.clear));
  car(G, k);
  bathroom(G, k, rough, drywall, paint);
  kitchen(G, k);
  rooms(G, k);
}

// A wall's inside face, `len` long: the garage's bare studs, then insulation
// between them and drywall over it panel by panel, then paint.
function lining(G, at, len, { insulation, drywall, paint, shade }) {
  const { ctx, P, lw } = G;
  fillPoly(ctx, P, quad(at, 0, len, SLAB, WALL), rgba(shadeOf(OLD_WALL, -shade)));
  const panels = Math.ceil(len / 4);
  for (let i = 0; i < panels; i++) {
    const at0 = (i / panels) * 0.7;
    const ins = step(insulation, at0, at0 + 0.3);
    const dry = step(drywall, at0, at0 + 0.3);
    if (ins <= 0 && dry <= 0) continue;
    const color = mix(mix(INSULATION, M.drywall, dry), M.paint, paint);
    fillPoly(ctx, P, quad(at, i * 4, Math.min(len, i * 4 + 4.04), SLAB, WALL), rgba(shadeOf(color, -shade), Math.max(ins, dry)));
  }
  const studs = 1 - step(drywall, 0.6, 1);
  if (studs > 0) {
    ctx.beginPath();
    for (let s = 0; s <= len; s += 4 / 3) line(ctx, P, at(s, SLAB), at(s, WALL));
    line(ctx, P, at(0, WALL - 0.2), at(len, WALL - 0.2));
    stroke(ctx, rgba(C.wood, 0.55 * studs), lw(0.15, 1));
  }
}

// The garage as it stands, as seen through the open door (which looks
// mostly onto the left wall): metal shelving with boxes and a workbench
// with a pegboard along the left wall, a water heater in the back corner,
// boxes on the floor; `a`: still there.
function oldGarage(G, a) {
  if (a <= 0) return;
  const { ctx, P, lw } = G;
  ctx.save();
  ctx.globalAlpha = a;
  const steel = [150, 154, 156];
  const card = [176, 138, 92];
  // the water heater
  block(G, [IN.x0, 2.4], [SLAB, SLAB + 5.2], [19.4, IN.z1], [214, 212, 204]);
  // the shelving, its boxes
  for (const y of [0.4, 2.3, 4.2, 6.1]) block(G, [IN.x0, 2.3], [SLAB + y - 0.1, SLAB + y], [12.6, 18.6], steel);
  ctx.beginPath();
  for (const z of [12.6, 18.6]) line(ctx, P, [2.3, SLAB, z], [2.3, SLAB + 6.1, z]);
  stroke(ctx, rgba(steel), lw(0.12, 1.2));
  [[0.4, 12.9, 15.4], [0.4, 15.8, 18.3], [2.3, 13, 16.6], [2.3, 17, 18.4], [4.2, 13.2, 18.2]].forEach(([y, z0, z1]) => block(G, [0.8, 2.1], [SLAB + y, SLAB + y + 1.6], [z0, z1], card));
  // the workbench, the pegboard over it, a few tools
  block(G, [IN.x0, 2.8], [SLAB, SLAB + 3], [4.4, 10.8], [124, 94, 64]);
  block(G, [IN.x0, 0.8], [SLAB + 3.6, SLAB + 6.6], [4.8, 10.4], [184, 160, 124]);
  ctx.beginPath();
  for (const [z, y0, y1] of [[5.8, 4.6, 6], [6.9, 4.4, 5.8], [8.3, 4.8, 6.2], [9.4, 4.5, 5.6]]) line(ctx, P, [0.85, SLAB + y0, z], [0.85, SLAB + y1, z]);
  stroke(ctx, rgba([60, 62, 64]), lw(0.14, 1.2));
  // boxes on the floor
  [[4, 6.6, 14, 16.4, 0, 2], [4.4, 6.2, 14.4, 16, 2, 1.4], [6.8, 8.8, 15.4, 17.6, 0, 1.6]].forEach(([x0, x1, z0, z1, y, h]) => block(G, [x0, x1], [SLAB + y, SLAB + y + h], [z0, z1], card));
  ctx.restore();
}

// The car parked in the garage's right bay, nose in, which backs out down
// the driveway as the work begins, and drives off. Its back is at `zc`. Its
// part still inside is drawn with the inside (the walls then hide what they
// should), its part out of the door after the walls (`outside`), so it's
// in front of them. Once it's out it fades as one piece.
const CAR_PAINT = [70, 104, 140];
const TIRE = [26, 27, 28];
const CAR_LEN = 15;
function car(G, k, outside = false) {
  const zc = 3 - 36 * step(k, ...T.car);
  const a = 1 - span(-zc, 17, 33);
  if (a <= 0) return;
  const [lo, hi] = outside ? [-Infinity, 0] : [0, Infinity];
  if (zc + CAR_LEN <= lo || zc >= hi) return;
  seeThrough(G, a, (W) => {
    const { ctx, P } = W;
    const y = SLAB;
    const part = ([x0, x1], [y0, y1], [z0, z1], color) => {
      const za = Math.max(zc + z0, lo);
      const zb = Math.min(zc + z1, hi);
      if (zb > za) block(W, [x0, x1], [y + y0, y + y1], [za, zb], color);
    };
    for (const z of [[2, 4.4], [10.6, 13]]) part([9.2, 9.8], [0, 1.8], z, TIRE);
    part([9.4, 14.6], [0.8, 3.1], [0, CAR_LEN], CAR_PAINT);
    part([9.8, 14.2], [3.1, 4.6], [4.2, 11.4], [44, 52, 60]);
    part([9.9, 14.1], [4.5, 4.8], [5, 10.6], CAR_PAINT);
    for (const z of [[2, 4.4], [10.6, 13]]) part([14.2, 14.8], [0, 1.8], z, TIRE);
    // its tail lights, on the back facing the camera
    if (zc >= lo && zc < hi)
      for (const [x0, x1] of [[9.7, 10.8], [13.2, 14.3]])
        fillPoly(ctx, P, [[x0, y + 2.2, zc - 0.02], [x1, y + 2.2, zc - 0.02], [x1, y + 2.7, zc - 0.02], [x0, y + 2.7, zc - 0.02]], rgba([200, 40, 36]));
  });
}

// The bathroom: its walls framed with the rough-in, the shower (tiled, a
// glass panel), the toilet and the vanity, its walls drywalled (faded, so
// what's inside shows).
function bathroom(G, k, rough, drywall, paint) {
  const { ctx, P, lw } = G;
  const [a, b] = T.bath;
  const tiles = step(k, a, a + 0.03);
  if (tiles > 0) {
    // the shower's walls: tile up to 7 ft on the back and the left
    const back = quad(inBack, 0, 3.3, SLAB, 7.5);
    const left = quad(inLeft, 17.7, 21, SLAB, 7.5);
    fillPoly(ctx, P, back, rgba(shadeOf(C.tile, -0.14), tiles));
    fillPoly(ctx, P, left, rgba(shadeOf(C.tile, -0.06), tiles));
    tileGrid(G, back, 4, 7, tiles);
    tileGrid(G, left, 4, 7, tiles);
  }
  block(G, [4.6, 5.9], [SLAB, SLAB + 1.4], [19.9, 21.2], M.porcelain, step(k, a + 0.02, a + 0.04));
  block(G, [4.6, 5.9], [SLAB + 1.4, SLAB + 2.6], [20.8, 21.4], M.porcelain, step(k, a + 0.02, a + 0.04));
  block(G, [IN.x0, 2.3], [SLAB, SLAB + 2.8], [15, 17.4], M.walnut, step(k, a + 0.03, a + 0.05));
  block(G, [IN.x0, 2.4], [SLAB + 2.8, SLAB + 3], [14.9, 17.5], M.porcelain, step(k, a + 0.04, a + 0.06));
  const glass = step(k, b - 0.02, b);
  if (glass > 0) {
    fillPoly(ctx, P, [[IN.x0, SLAB, 18.2], [3.8, SLAB, 18.2], [3.8, SLAB + 7, 18.2], [IN.x0, SLAB + 7, 18.2]], rgba([190, 214, 222], 0.22 * glass));
    ctx.beginPath();
    line(ctx, P, [3.8, SLAB, 18.2], [3.8, SLAB + 7, 18.2]);
    line(ctx, P, [IN.x0, SLAB + 7, 18.2], [3.8, SLAB + 7, 18.2]);
    stroke(ctx, rgba(C.trim, 0.8 * glass), lw(0.08, 1));
  }
  // its walls: studs, then drywall and paint, faded
  ctx.save();
  ctx.globalAlpha = 1 - step(drywall, 0.3, 1);
  frameRun(G, bathFront, BATH.x[1] - IN.x0, [], rough, SLAB, WALL);
  frameRun(G, bathSide, BATH.z[1] - BATH.z[0], [BATH_DOOR], rough, SLAB, WALL);
  ctx.restore();
  if (drywall > 0) {
    const color = mix(M.drywall, M.paint, paint);
    const a2 = 0.34 * step(drywall, 0.3, 1);
    fillPoly(ctx, P, quad(bathFront, 0, BATH.x[1] - IN.x0, SLAB, WALL), rgba(shadeOf(color, -0.12), a2));
    for (const [s0, s1, y0] of [[0, BATH_DOOR.s[0], SLAB], [BATH_DOOR.s[1], BATH.z[1] - BATH.z[0], SLAB], [BATH_DOOR.s[0], BATH_DOOR.s[1], BATH_DOOR.y[1]]])
      fillPoly(ctx, P, quad(bathSide, s0, s1, y0, WALL), rgba(color, a2));
  }
}

// The kitchenette along the back wall: sage base cabinets and uppers, a
// white counter with the sink and a cooktop, the fridge.
function kitchen(G, k) {
  const { ctx, P } = G;
  const [a] = T.kitchen;
  for (let i = 0; i < 4; i++) block(G, [8 + i * 2, 10.02 + i * 2], [SLAB, SLAB + 2.8], [19.4, IN.z1], M.sage, 1, step(k, a + i * 0.008, a + 0.02 + i * 0.008));
  block(G, [7.9, 16.1], [SLAB + 2.8, SLAB + 3], [19.2, IN.z1], M.porcelain, step(k, a + 0.03, a + 0.045));
  const top = step(k, a + 0.04, a + 0.055);
  if (top > 0) {
    fillPoly(ctx, P, groundQuad([10.8, 19.7, 12.8, 21], SLAB + 3.01), rgba([150, 156, 160], top));
    fillPoly(ctx, P, groundQuad([13.6, 19.7, 15.6, 21], SLAB + 3.01), rgba(M.charcoal, top));
  }
  block(G, [8, 16], [SLAB + 5.2, SLAB + 7.6], [20.3, IN.z1], M.sage, step(k, a + 0.045, a + 0.06));
  block(G, [16.4, 19], [SLAB, SLAB + 6.6], [19, IN.z1], C.steel, step(k, a + 0.055, a + 0.07));
}

// The bed against the left wall, the rug, the coffee table and the sofa
// along the right wall.
function rooms(G, k) {
  const { ctx, P } = G;
  const [a] = T.furnish;
  const bed = step(k, a, a + 0.025);
  if (bed > 0) {
    block(G, [IN.x0, 1], [SLAB, SLAB + 3.8], [4.8, 10.2], M.walnut, bed);
    block(G, [1, 7.4], [SLAB, SLAB + 1.4], [5, 10], M.walnut, bed);
    block(G, [1.1, 7.3], [SLAB + 1.4, SLAB + 2.1], [5.1, 9.9], [236, 234, 228], bed);
    block(G, [5.6, 7.3], [SLAB + 2.1, SLAB + 2.2], [5.1, 9.9], M.sage, bed);
    for (const [z0, z1] of [[5.5, 7.3], [7.7, 9.5]]) block(G, [1.3, 2.5], [SLAB + 2.1, SLAB + 2.6], [z0, z1], [248, 246, 240], bed);
  }
  const rug = step(k, a + 0.015, a + 0.035);
  if (rug > 0) fillPoly(ctx, P, groundQuad([12.5, 3.5, 20.4, 11], SLAB + 0.03), rgba([186, 174, 152], rug));
  block(G, [15, 18.2], [SLAB, SLAB + 1.3], [6, 8.6], M.walnut, step(k, a + 0.03, a + 0.05));
  const sofa = step(k, a + 0.04, a + 0.07);
  block(G, [21, 23.4], [SLAB, SLAB + 1.4], [3.6, 10], M.navy, sofa);
  block(G, [22.6, 23.4], [SLAB + 1.4, SLAB + 2.9], [3.6, 10], M.navy, sofa);
  block(G, [21, 22.6], [SLAB + 1.4, SLAB + 2.1], [3.6, 4.2], M.navy, sofa);
  block(G, [21, 22.6], [SLAB + 1.4, SLAB + 2.1], [9.4, 10], M.navy, sofa);
}

// ---- outside ------------------------------------------------------------------

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
